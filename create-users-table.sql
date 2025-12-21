-- ===================================================================
-- Phase 7: Users 테이블 생성 (간소화 버전)
-- ===================================================================
-- Supabase Dashboard > SQL Editor에서 실행하세요
-- ===================================================================

-- 1. Users 테이블 생성
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  nickname VARCHAR(50) UNIQUE NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'player',
  preferred_position VARCHAR(10),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,

  CONSTRAINT valid_role CHECK (role IN ('player', 'coach', 'manager')),
  CONSTRAINT valid_preferred_position CHECK (preferred_position IN ('FW', 'MF', 'DF', 'GK') OR preferred_position IS NULL)
);

-- 2. 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_nickname ON public.users(nickname);

-- 3. RLS 활성화
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 4. RLS 정책 생성
-- 모든 사람이 프로필 조회 가능
CREATE POLICY "Users are viewable by everyone" ON public.users
  FOR SELECT USING (true);

-- 회원가입 시 본인 프로필 생성 가능
CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 본인 프로필만 수정 가능
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- 5. updated_at 자동 업데이트 트리거
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ===================================================================
-- 완료! 이제 회원가입을 시도해보세요.
-- ===================================================================
