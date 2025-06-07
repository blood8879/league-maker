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
            // 로그아웃 성공 시 상태 초기화
            set({
              user: null,
              isLoading: false,
              error: null,
            });

            // localStorage에서 사용자 데이터 삭제
            if (typeof window !== "undefined") {
              const authStoreData = localStorage.getItem("auth-store");
              if (authStoreData) {
                try {
                  const parsedData = JSON.parse(authStoreData);
                  // user 정보만 삭제하고 다른 설정은 유지
                  parsedData.state.user = null;
                  localStorage.setItem(
                    "auth-store",
                    JSON.stringify(parsedData)
                  );
                } catch {
                  // JSON 파싱 실패 시 전체 삭제
                  localStorage.removeItem("auth-store");
                }
              }
            }
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

          // 인증 상태 변경 리스너를 먼저 설정
          const {
            data: { subscription },
          } = onAuthStateChange((user) => {
            console.log(
              "Auth state changed:",
              user ? "logged in" : "logged out"
            );
            set({ user, isLoading: false });
          });

          // 현재 사용자 확인
          getCurrentUser()
            .then(({ user }) => {
              console.log(
                "Current user:",
                user ? "logged in" : "not logged in"
              );
              set({ user, isLoading: false });
            })
            .catch((error) => {
              console.error("getCurrentUser error:", error);
              set({ user: null, isLoading: false });
            });

          set({
            isInitialized: true,
          });

          return () => subscription?.unsubscribe();
        } catch (error) {
          console.error("Initialize error:", error);
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
