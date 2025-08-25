import { Request, Response } from "express";
import jwt, { type SignOptions, type Secret } from "jsonwebtoken";
import User from "../models/userModel";
import env from "../config/dotenv"
import bcrypt from "bcryptjs";

const signToken = (u: { id: number, email: string, is_admin: boolean }) => {
    const opts: SignOptions = { expiresIn: env.JWT_EXPIRES_IN };
    return jwt.sign(u, env.JWT_SECRET as Secret, opts);
};

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password, is_admin } = req.body;
        if (!name || !email || !password) {
            return res
                .status(400)
                .json({ message: "Name, email, and password are required" });
        }

        const exists = await User.findOne({ where: { email } });
        if (exists) {
            return res.status(400).json({ message: "User already exists" });
        }

        // ✅ Manually hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            is_admin: !!is_admin,
        });

        const token = signToken({
            id: newUser.id,
            email: newUser.email,
            is_admin: newUser.is_admin,
        });

        res.status(201).json({
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                is_admin: newUser.is_admin,
            },
            token,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // ✅ Check password against hashed one
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // ✅ Sign token
    const token = signToken({
      id: user.id,
      email: user.email,
      is_admin: user.is_admin,
    });

    res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        is_admin: user.is_admin,
      },
      token,
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
