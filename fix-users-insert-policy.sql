-- Users 테이블에 INSERT 정책 추가
-- Supabase Dashboard > SQL Editor에서 실행하세요

CREATE POLICY "Users can insert own profile during signup" ON users
  FOR INSERT
  WITH CHECK (auth.uid() = id);
