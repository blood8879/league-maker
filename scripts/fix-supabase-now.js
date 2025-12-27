const { Client } = require('pg');

const client = new Client({
  host: 'aws-0-ap-northeast-2.pooler.supabase.com',
  port: 6543,
  database: 'postgres',
  user: 'postgres.qfjqqflkzkwyipimfpic',
  password: 'dbswlghks88!',
  ssl: { rejectUnauthorized: false }
});

const sql = `
-- Users 테이블 확인 및 생성
CREATE TABLE IF NOT EXISTS public.users (
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

-- RLS 활성화
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 기존 정책 삭제
DROP POLICY IF EXISTS "Users are viewable by everyone" ON public.users;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;

-- 정책 생성
CREATE POLICY "Users are viewable by everyone" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
`;

async function fix() {
  try {
    console.log('🔄 Connecting to Supabase...');
    await client.connect();
    console.log('✅ Connected!');

    console.log('🔄 Setting up users table...');
    await client.query(sql);
    console.log('✅ Table setup complete!');

    console.log('\n📋 Verifying...');
    const result = await client.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'users'
      ORDER BY ordinal_position;
    `);

    console.log('Columns:');
    result.rows.forEach(r => console.log(`  - ${r.column_name}: ${r.data_type}`));

    console.log('\n🎉 완료! 브라우저 새로고침 후 회원가입하세요.');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

fix();
