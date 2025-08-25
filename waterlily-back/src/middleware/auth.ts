import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from '../config/dotenv'

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers.authorization || "";

    const token = auth.startsWith("Bearer") ? auth.slice(7) : null;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const decoded = jwt.verify(token, dotenv.JWT_SECRET) as any;
        req.user = { id: decoded.id, email: decoded.email, is_admin: decoded.is_admin };
        next();
    } catch (error) {
        res.status(401).json({ message: "Unauthorized" });
    }
}
