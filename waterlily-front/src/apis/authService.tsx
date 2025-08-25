import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Create axios instance with interceptors
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth-storage');
  if (token) {
    try {
      const parsedToken = JSON.parse(token).state.token;
      if (parsedToken) {
        config.headers.Authorization = `Bearer ${parsedToken}`;
      }
    } catch (e) {
      console.error('Error parsing auth token', e);
    }
  }
  return config;
});

export const authService = {
  register: async (userData: { name: string; email: string; password: string }): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/api/auth/register', userData);
    return response.data;
  },

  login: async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/api/auth/login', credentials);
    return response.data;
  },

  verifyToken: async (token: string): Promise<{ valid: boolean; user?: User }> => {
    try {
      const response = await api.get<{ user: User }>('/api/auth/verify', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return { valid: true, user: response.data.user };
    } catch (error) {
      return { valid: false };
    }
  }
};