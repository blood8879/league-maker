-- ====================================================
-- Supabase 데이터베이스 상태 확인
-- Supabase Dashboard > SQL Editor에서 실행하세요
-- https://supabase.com/dashboard/project/qfjqqflkzkwyipimfpic/sql
-- ====================================================

-- 1. users 테이블이 존재하는지 확인
SELECT EXISTS (
  SELECT FROM information_schema.tables
  WHERE table_schema = 'public'
  AND table_name = 'users'
) AS users_table_exists;

-- 2. users 테이블 구조 확인
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'users'
ORDER BY ordinal_position;

-- 3. auth.users 테이블에 사용자가 있는지 확인
SELECT
  id,
  email,
  email_confirmed_at,
  created_at,
  CASE
    WHEN email_confirmed_at IS NULL THEN '❌ 이메일 미인증'
    ELSE '✅ 이메일 인증됨'
  END AS status
FROM auth.users
ORDER BY created_at DESC
LIMIT 10;

-- 4. public.users 테이블에 프로필이 있는지 확인
SELECT
  id,
  email,
  nickname,
  role,
  preferred_position,
  created_at
FROM public.users
ORDER BY created_at DESC
LIMIT 10;

-- 5. 불일치 확인: auth에는 있지만 public.users에 없는 계정
SELECT
  au.id,
  au.email,
  au.created_at,
  CASE
    WHEN pu.id IS NULL THEN '⚠️ 프로필 없음'
    ELSE '✅ 프로필 있음'
  END AS profile_status
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
ORDER BY au.created_at DESC
LIMIT 10;

-- 6. RLS 정책 확인
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'users';
