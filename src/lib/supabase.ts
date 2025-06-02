import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// OAuth 제공자 설정
export const authProviders = {
  google: {
    name: "google",
    displayName: "Google",
    scopes: "email profile",
  },
  kakao: {
    name: "kakao",
    displayName: "Kakao",
    scopes: "profile_nickname profile_image account_email",
  },
} as const;

export type AuthProvider = keyof typeof authProviders;
