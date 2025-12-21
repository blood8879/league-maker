-- ====================================================
-- 이 SQL을 Supabase SQL Editor에 복사해서 Run 버튼만 누르세요
-- https://supabase.com/dashboard/project/qfjqqflkzkwyipimfpic/editor
-- ====================================================

CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  nickname TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'player',
  preferred_position TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  CONSTRAINT valid_role CHECK (role IN ('player', 'coach', 'manager')),
  CONSTRAINT valid_position CHECK (preferred_position IN ('FW', 'MF', 'DF', 'GK') OR preferred_position IS NULL)
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users are viewable by everyone" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
