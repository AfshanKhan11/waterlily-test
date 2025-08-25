import { Request, Response } from "express";
import SurveyResponse from "../models/surveyModel";
import User from '../models/userModel';

type IncomingSingleResponse = {
    question_id: number;
    survey_form_id: string;
    answer: string | number | boolean | null;
}
export const submitResponse = async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const { question_id, survey_form_id, answer } = req.body as IncomingSingleResponse;
    if (typeof question_id !== "number") {
        return res.status(400).json({ message: "Invalid question_id" });
    }
    if (typeof survey_form_id !== "string") {
        return res.status(400).json({ message: "Invalid survey_form_id" });
    }
    if (answer === null) {
        return res.status(400).json({ message: "Invalid answer" });
    }

    try {
        console.log(req.user)
        const response = await SurveyResponse.create({
            user_id: req.user.id,
            question_id,
            survey_form_id,
            answer: String(answer ?? ""),

        });
        const out = {
            id: response.id,
            user_id: response.user_id,
            survey_form_id: response.survey_form_id,
            question_id,
            answer: /^\d+(\.\d+)?/.test(response.answer) ? Number(response.answer) : response.answer,
            createdAt: response.createdAt,
        }

        return res.status(201).json(out);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const myResponses = async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const rows = await SurveyResponse.findAll({
            where: {
                user_id: req.user.id,
            },
            attributes: ["question_id", "survey_form_id", "createdAt"],
            order: [["createdAt", "DESC"]],
            raw: true,
        });
        type SessionRow = {
            survey_form_id: string,
            question_id: number,
            answer_count: number,
            first_created_at: string,
            last_created_at: string,


        }
        const group  = new Map<string,SessionRow>() ;
        (rows as any[]).forEach((r)=>{
            const fid = r.survey_form_id as string;
            const createdISO= (r.createdAt as Date).toISOString();
            const qid = r.question_id as number;
            const existing = group.get(fid);
            if(!existing){
                group.set(fid,{
                    survey_form_id:fid,
                    question_id:qid,
                    answer_count:1,
                    first_created_at:createdISO,
                    last_created_at:createdISO,
                })
            }
            else{
                existing.answer_count++;
                existing.last_created_at=createdISO;
            }

        })

        const out = Array.from(group.values()).sort(
            (a,b)=>{
                return b.last_created_at.localeCompare(a.last_created_at);

            }
        );
        return res.status(200).json(out);

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const getResponsesByForm = async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const { survey_form_id } = req.params; // e.g. /api/surveys/form_001/responses

    if (!survey_form_id) {
        return res.status(400).json({ message: "Missing survey_form_id" });
    }

    try {
        const responses = await SurveyResponse.findAll({
            where: {
                user_id: req.user.id,
                survey_form_id,
            },
            attributes: ["id", "question_id", "answer", "createdAt"],
            order: [["createdAt", "ASC"]],
            raw: true,
        });

        return res.status(200).json({
            survey_form_id,
            user_id: req.user.id,
            total_answers: responses.length,
            responses: responses.map((r) => ({
                question_id: r.question_id,
                answer: /^\d+(\.\d+)?$/.test(r.answer) ? Number(r.answer) : r.answer,
                createdAt: r.createdAt,
            })),
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

