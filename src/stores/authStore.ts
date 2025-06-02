import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@supabase/supabase-js";
import {
  signInWithProvider,
  signOut,
  getCurrentUser,
  onAuthStateChange,
} from "@/lib/auth";
import type { AuthProvider } from "@/lib/supabase";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
}

interface AuthActions {
  signIn: (provider: AuthProvider) => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => (() => void) | undefined;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      // State
      user: null,
      isLoading: false,
      isInitialized: false,
      error: null,

      // Actions
      signIn: async (provider: AuthProvider) => {
        try {
          set({ isLoading: true, error: null });
          const { error } = await signInWithProvider(provider);

          if (error) {
            set({ error: error.message, isLoading: false });
          }
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "로그인 중 오류가 발생했습니다.",
            isLoading: false,
          });
        }
      },

      signOut: async () => {
        try {
          set({ isLoading: true, error: null });
          const { error } = await signOut();

          if (error) {
            set({ error: error.message, isLoading: false });
          } else {
            set({ user: null, isLoading: false });
          }
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "로그아웃 중 오류가 발생했습니다.",
            isLoading: false,
          });
        }
      },

      initialize: () => {
        try {
          set({ isLoading: true });

          // 현재 사용자 확인
          getCurrentUser().then(({ user }) => {
            set({ user });
          });

          // 인증 상태 변경 리스너 설정
          const {
            data: { subscription },
          } = onAuthStateChange((user) => {
            set({ user, isLoading: false });
          });

          set({
            isLoading: false,
            isInitialized: true,
          });

          return () => subscription?.unsubscribe();
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "초기화 중 오류가 발생했습니다.",
            isLoading: false,
            isInitialized: true,
          });
          return undefined;
        }
      },

      setUser: (user) => set({ user }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-store",
      partialize: (state) => ({
        user: state.user,
        isInitialized: state.isInitialized,
      }),
    }
  )
);
