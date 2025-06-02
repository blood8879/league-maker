import type { User, AuthError } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import { authProviders, type AuthProvider } from "@/lib/supabase";

const supabase = createClient();

export interface AuthResponse {
  user: User | null;
  error: AuthError | null;
}

/**
 * OAuth 제공자로 로그인을 시작합니다.
 */
export const signInWithProvider = async (
  provider: AuthProvider,
  redirectTo?: string
): Promise<{ error: AuthError | null }> => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: redirectTo || `${window.location.origin}/auth/callback`,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
      scopes: authProviders[provider].scopes,
    },
  });

  return { error };
};

/**
 * 현재 로그인된 사용자를 가져옵니다.
 */
export const getCurrentUser = async (): Promise<AuthResponse> => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  return { user, error };
};

/**
 * 로그아웃을 수행합니다.
 */
export const signOut = async (): Promise<{ error: AuthError | null }> => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

/**
 * 세션을 새로고침합니다.
 */
export const refreshSession = async (): Promise<AuthResponse> => {
  const {
    data: { user },
    error,
  } = await supabase.auth.refreshSession();

  return { user, error };
};

/**
 * 인증 상태 변경을 감지합니다.
 */
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(session?.user ?? null);
  });
};
