import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { surveyService, type SurveyResponseOut, type MyResponseSummary, type FormResponses } from '@/apis/surveyService';
import { questions } from '@/data/questions';

export interface SurveySession {
  survey_form_id: string;
  answer_count: number;
  first_created_at: string;
  last_created_at: string;
}

export interface SessionResponse {
  question_id: number;
  answer: string | number;
  createdAt: string;
}

export interface SurveyState {
  survey_form_id: string | null;
  responses: SurveyResponseOut[];
  currentQuestionIndex: number; // Changed from question_id to currentQuestionIndex
  isLoading: boolean;
  isCompleted: boolean;
  error: string | null;
  sessions: SurveySession[];

  // actions
  validateAnswer: (question_id: number, answer: string) => boolean;
  startSurvey: () => void;
  submitResponse: (payload: {
    question_id: number;
    answer: string | number;
  }) => Promise<boolean>;
  nextQuestion: () => void;
  previousQuestion: () => void;
  myResponses: () => Promise<MyResponseSummary[]>;
  getResponsesByForm: (survey_form_id: string) => Promise<FormResponses | null>;
  completeSurvey: () => void;
  resetSurvey: () => void;
  getSurveyFormId: () => string | null;
  loadUserSessions: () => Promise<void>;
  getSessionResponses: (survey_form_id: string) => Promise<SessionResponse[]>;
}

export const useSurveyStore = create<SurveyState>()(
  persist(
    (set, get) => ({
      survey_form_id: null,
      responses: [],
      currentQuestionIndex: 0, // Fixed: using proper name
      isLoading: false,
      isCompleted: false,
      error: null,
      sessions: [],

      startSurvey: () => {
        const newId = uuidv4();
        set({
          survey_form_id: newId,
          currentQuestionIndex: 0, // Fixed: using proper name
          responses: [],
          isLoading: false,
          isCompleted: false,
          error: null,
        });
      },

      validateAnswer: (question_id: number, answer: string) => {
        const question = questions.find((q) => q.id === question_id);
        if (!question) return false;

        // Fixed: check for "multi-choice" instead of "multiple_choice"
        if (question.type === 'multi-choice') {
          const answers = answer.split(';');
          return answers.every((a) => question.options.includes(a));
        }

        return question.options.includes(answer);
      },

      submitResponse: async (payload) => {
        const { survey_form_id, validateAnswer } = get();

        if (!survey_form_id) {
          throw new Error('Survey has not started');
        }

        // Fixed: Only validate if answer is a string
        if (typeof payload.answer === 'string' && !validateAnswer(payload.question_id, payload.answer)) {
          set({ error: 'Invalid answer' });
          return false;
        }

        set({ isLoading: true, error: null });

        try {
          const res = await surveyService.submitResponse({
            ...payload,
            survey_form_id,
          });
          set((state) => ({
            responses: [...state.responses, res],
            isLoading: false,
          }));
          return true;
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message ||
            error.message ||
            'Failed to submit response';
          set({
            isLoading: false,
            error: errorMessage,
          });
          return false;
        }
      },

      nextQuestion: () => {
        set((state) => ({ 
          currentQuestionIndex: state.currentQuestionIndex + 1 
        }));
      },

      previousQuestion: () => {
        set((state) => ({ 
          currentQuestionIndex: Math.max(0, state.currentQuestionIndex - 1)
        }));
      },

      myResponses: async () => {
        try {
          return await surveyService.myResponses();
        } catch (error: any) {
          set({ error: error.message });
          return [];
        }
      },

      getResponsesByForm: async (survey_form_id: string) => {
        try {
          return await surveyService.getResponseByForm(survey_form_id); // Fixed: correct method name
        } catch (error: any) {
          set({ error: error.message });
          return null;
        }
      },

      completeSurvey: () => {
        set({ isCompleted: true });
      },

      resetSurvey: () => {
        set({
          survey_form_id: null,
          responses: [],
          currentQuestionIndex: 0,
          isLoading: false,
          isCompleted: false,
          error: null,
        });
      },

      getSurveyFormId: () => {
        return get().survey_form_id;
      },

      loadUserSessions: async () => {
        set({ isLoading: true, error: null });
        try {
          const responses = await surveyService.myResponses();
          const sessionMap = new Map<string, SurveySession>();
          
          responses.forEach((response) => {
            if (!sessionMap.has(response.survey_form_id)) {
              sessionMap.set(response.survey_form_id, {
                survey_form_id: response.survey_form_id,
                answer_count: 0,
                first_created_at: response.first_created_at,
                last_created_at: response.last_created_at,
              });
            }
            
            const session = sessionMap.get(response.survey_form_id)!;
            session.answer_count += response.answer_count;
            
            // Fixed: Correct date comparison logic
            if (new Date(response.first_created_at) < new Date(session.first_created_at)) {
              session.first_created_at = response.first_created_at;
            }
            
            if (new Date(response.last_created_at) > new Date(session.last_created_at)) {
              session.last_created_at = response.last_created_at;
            }
          });
          
          set({
            sessions: Array.from(sessionMap.values()),
            isLoading: false
          });
        } catch (error: any) {
          set({ 
            error: error.message,
            isLoading: false 
          });
        }
      },

      getSessionResponses: async (survey_form_id: string) => {
        try {
          const formResponses = await surveyService.getResponseByForm(survey_form_id); // Fixed: correct method name
          if (!formResponses) {
            throw new Error('No responses found for this session');
          }
          return formResponses.responses;   
        } catch (error: any) {
          set({ error: error.message });
          throw new Error(error.message || 'Failed to get session responses');
        }
      },
    }),
    {
      name: 'survey-storage',
    }
  )
);