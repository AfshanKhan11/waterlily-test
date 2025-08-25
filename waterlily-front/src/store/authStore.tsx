import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authService, type AuthResponse, type User } from "@/apis/authService";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  hasHydrated: boolean;

  // Actions
  login: (credentials: { email: string; password: string }) => Promise<boolean>;
  register: (data: { name: string; email: string; password: string }) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,
      hasHydrated: false,

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const res: AuthResponse = await authService.login(credentials);
          set({
            user: res.user,
            token: res.token,
            isLoading: false,
            error: null,
          });
          return true;
        } catch (err: any) {
          const errorMessage = err.response?.data?.message || err.message || 'Login failed';
          set({ error: errorMessage, isLoading: false });
          return false;
        }
      },

      register: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const res: AuthResponse = await authService.register(data);
          set({
            user: res.user,
            token: res.token,
            isLoading: false,
            error: null,
          });
          return true;
        } catch (err: any) {
          const errorMessage = err.response?.data?.message || err.message || 'Registration failed';
          set({ error: errorMessage, isLoading: false });
          return false;
        }
      },

      logout: () => {
        set({ user: null, token: null, error: null });
      },

      clearError: () => {
        set({ error: null });
      },

      hydrate: () => {
        set({ hasHydrated: true });
      },
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => (state) => {
        state?.hydrate();
      },
    }
  )
);