const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://qfjqqflkzkwyipimfpic.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function createUsersTable() {
  console.log('Creating users table...');

  const createTableSQL = `
    -- Users 테이블 생성
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

    -- 정책 삭제 (이미 존재할 경우)
    DROP POLICY IF EXISTS "Users are viewable by everyone" ON public.users;
    DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
    DROP POLICY IF EXISTS "Users can update own profile" ON public.users;

    -- 정책 생성
    CREATE POLICY "Users are viewable by everyone" ON public.users FOR SELECT USING (true);
    CREATE POLICY "Users can insert own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);
    CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
  `;

  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql: createTableSQL });

    if (error) {
      console.error('Error creating table:', error);
      console.error('\n⚠️  ANON KEY로는 테이블 생성이 불가능합니다.');
      console.error('Supabase Dashboard > Settings > API에서 SERVICE_ROLE_KEY를 복사하세요.');
      console.error('그 다음: SUPABASE_SERVICE_ROLE_KEY=your-key node setup-database.js');
      return;
    }

    console.log('✅ Users table created successfully!');
    console.log(data);
  } catch (err) {
    console.error('Unexpected error:', err.message);
    console.error('\n📝 직접 Supabase SQL Editor에서 실행해야 합니다.');
    console.error('또는 SERVICE_ROLE_KEY를 사용하세요.');
  }
}

createUsersTable();
