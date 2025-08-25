import axios from "axios";
import api from "./api";

export type IncomingSingleResponse = {
  survey_form_id: number;
  question_id: number;
  answer: string;
}

export type SurveyResponseOut = {
  id: string;
  user_id: string;
  survey_form_id: string;
  question_id: string;
  answer: string|number;
  createdAt: string;
}

export type FormResponses = {
  survey_form_id: string;
  answer: string;
  total_answers: number;
  responses: {
    question_id: string;
    answer: string | number;
  }[];
  createdAt: string;
}

export type MyResponseSummary = {
  survey_form_id: string;
  answer_count: number;
  question_id: number;
  createdAt: string;
  first_created_at: string;
  last_created_at: string;
}

export const surveyService = {
  submitResponse: async (payload: IncomingSingleResponse): Promise<SurveyResponseOut> => {
    try {
      const res = await api.post<SurveyResponseOut>('/survey-responses/submit', payload)
      return res.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw error;
      }
      throw new Error('An unknown error occurred');

    }

  },
  myResponses: async (): Promise<MyResponseSummary[]> => {
    try {
      const res = await api.get<MyResponseSummary[]>('/survey-responses/my');
      return res.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw error;
      }
      throw new Error('An unknown error occurred');
    }
  },
  getResponseByForm: async (survey_form_id: string): Promise<FormResponses> => {
    try {
      const res = await api.get<FormResponses>(`/survey-responses/${survey_form_id}/responses`);
      return res.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw error;
      }
      throw new Error('An unknown error occurred');
    }

  }
}

