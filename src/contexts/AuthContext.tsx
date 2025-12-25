'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/types';

type UserProfile = Database['public']['Tables']['users']['Row'];
type UserInsert = Database['public']['Tables']['users']['Insert'];

interface AuthContextType {
  user: SupabaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: {
    nickname: string;
    role: 'player' | 'coach' | 'manager';
    preferred_position?: 'FW' | 'MF' | 'DF' | 'GK';
  }) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    console.log('👤 Fetching user profile...', { userId });
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      console.log('📊 Profile fetch result:', { data, error });

      if (error) {
        console.error('❌ Profile fetch error:', error);
        throw error;
      }

      if (data) {
        console.log('✅ Profile loaded:', data);
        setUserProfile(data);
      } else {
        console.warn('⚠️ Profile not found for user:', userId);
        console.warn('⚠️ This might mean the user exists in auth.users but not in public.users');
      }
    } catch (error) {
      console.error('❌ Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    userData: {
      nickname: string;
      role: 'player' | 'coach' | 'manager';
      preferred_position?: 'FW' | 'MF' | 'DF' | 'GK';
    }
  ) => {
    console.log('🔐 Starting signup process...', { email, nickname: userData.nickname });

    // Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: {
          nickname: userData.nickname,
          role: userData.role,
        }
      }
    });

    console.log('📧 Supabase Auth response:', {
      user: authData.user?.id,
      session: !!authData.session,
      error: authError
    });

    if (authError) {
      console.error('❌ Auth error:', authError);
      throw authError;
    }
    if (!authData.user) {
      throw new Error('회원가입에 실패했습니다. 다시 시도해주세요.');
    }

    // Check if email confirmation is required
    if (!authData.session) {
      console.warn('⚠️ Email confirmation required. User created but not logged in.');
      throw new Error('이메일 인증이 필요합니다. 이메일을 확인해주세요.');
    }

    // Create user profile in users table
    const profileData: UserInsert = {
      id: authData.user.id,
      email,
      nickname: userData.nickname,
      role: userData.role,
      preferred_position: userData.preferred_position ?? null,
    };

    console.log('💾 Creating user profile...', profileData);

    const { data: insertedData, error: profileError } = await supabase
      .from('users')
      .insert(profileData as any)
      .select()
      .single();

    if (profileError) {
      console.error('❌ Profile creation error:', {
        message: profileError.message,
        details: profileError.details,
        hint: profileError.hint,
        code: profileError.code,
      });
      throw new Error(`프로필 생성 실패: ${profileError.message}`);
    }

    console.log('✅ Profile created successfully:', insertedData);

    // 프로필이 생성되었으므로 바로 fetch (onAuthStateChange보다 먼저 설정)
    await fetchUserProfile(authData.user.id);
  };

  const signIn = async (email: string, password: string) => {
    console.log('🔑 Starting login process...', { email });

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log('🔓 Login response:', {
      user: data.user?.id,
      session: !!data.session,
      error: error
    });

    if (error) {
      console.error('❌ Login error:', error);
      throw error;
    }

    if (!data.user) {
      throw new Error('로그인에 실패했습니다.');
    }

    console.log('✅ Login successful, fetching profile...');
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    // Explicitly clear user state
    setUser(null);
    setUserProfile(null);
  };

  const refreshUserProfile = async () => {
    if (user) {
      await fetchUserProfile(user.id);
    }
  };

  const requestPasswordReset = async (email: string) => {
    console.log('🔑 Requesting password reset...', { email });

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      console.error('❌ Password reset request error:', error);
      throw error;
    }

    console.log('✅ Password reset email sent');
  };

  const resetPassword = async (newPassword: string) => {
    console.log('🔑 Resetting password...');

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      console.error('❌ Password reset error:', error);
      throw error;
    }

    console.log('✅ Password reset successful');
  };

  const value = {
    user,
    userProfile,
    loading,
    signUp,
    signIn,
    signOut,
    refreshUserProfile,
    requestPasswordReset,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
