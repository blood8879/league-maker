-- ===================================================================
-- League Maker Database Setup - Phase 1: Core Tables
-- ===================================================================
-- Supabase PostgreSQL 15+
-- Created: 2025-12-16
-- ===================================================================

-- ===================================================================
-- 1. USERS TABLE
-- ===================================================================
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  nickname VARCHAR(50) UNIQUE NOT NULL,
  avatar_url TEXT,
  role VARCHAR(20) NOT NULL DEFAULT 'player',
  bio TEXT,
  phone VARCHAR(20),
  preferred_position VARCHAR(30),

  -- 전체 통계 (모든 팀 합산)
  total_matches INTEGER DEFAULT 0,
  total_goals INTEGER DEFAULT 0,
  total_assists INTEGER DEFAULT 0,
  total_yellow_cards INTEGER DEFAULT 0,
  total_red_cards INTEGER DEFAULT 0,
  attendance_rate DECIMAL(5,2) DEFAULT 0.00,

  -- 메타
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  last_login_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,

  CONSTRAINT valid_role CHECK (role IN ('player', 'coach', 'manager')),
  CONSTRAINT valid_preferred_position CHECK (preferred_position IN ('FW', 'MF', 'DF', 'GK') OR preferred_position IS NULL),
  CONSTRAINT valid_attendance CHECK (attendance_rate >= 0 AND attendance_rate <= 100)
);

-- 인덱스
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_nickname ON users(nickname);
CREATE INDEX idx_users_role ON users(role);

-- RLS 정책
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users are viewable by everyone" ON users
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can delete own profile" ON users
  FOR DELETE USING (auth.uid() = id);

-- 트리거: updated_at 자동 업데이트
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===================================================================
-- 2. TEAMS TABLE
-- ===================================================================
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  logo_url TEXT,
  region VARCHAR(100) NOT NULL,
  district VARCHAR(50),
  city VARCHAR(50),
  level VARCHAR(20) NOT NULL DEFAULT 'intermediate',
  description TEXT,
  founded_date DATE,

  -- 활동 정보
  activity_days JSON,
  activity_time VARCHAR(50),
  home_ground VARCHAR(200),

  -- 모집 정보
  is_recruiting BOOLEAN DEFAULT false,
  member_limit INTEGER DEFAULT 25,
  current_member_count INTEGER DEFAULT 0,

  -- 통계
  total_matches INTEGER DEFAULT 0,
  wins INTEGER DEFAULT 0,
  draws INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  goals_for INTEGER DEFAULT 0,
  goals_against INTEGER DEFAULT 0,

  -- 메타
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT true,

  CONSTRAINT valid_level CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  CONSTRAINT valid_member_count CHECK (current_member_count >= 0 AND current_member_count <= member_limit)
);

CREATE INDEX idx_teams_region ON teams(region);
CREATE INDEX idx_teams_level ON teams(level);
CREATE INDEX idx_teams_recruiting ON teams(is_recruiting);
CREATE INDEX idx_teams_name ON teams(name);

-- RLS 정책
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teams are viewable by everyone" ON teams
  FOR SELECT USING (true);

CREATE POLICY "Team captains can update team" ON teams
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.team_id = teams.id
        AND team_members.user_id = auth.uid()
        AND team_members.role = 'captain'
    )
  );

CREATE POLICY "Authenticated users can create teams" ON teams
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- ===================================================================
-- 3. TEAM_MEMBERS TABLE (다대다 관계)
-- ===================================================================
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- 역할 (팀별로 다를 수 있음)
  role VARCHAR(20) NOT NULL DEFAULT 'member',
  position VARCHAR(30),
  jersey_number INTEGER,

  -- 등록 정보
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_registered BOOLEAN DEFAULT true,

  -- 팀 내 통계 (해당 팀에서만의 기록)
  team_matches INTEGER DEFAULT 0,
  team_goals INTEGER DEFAULT 0,
  team_assists INTEGER DEFAULT 0,

  UNIQUE(team_id, user_id),
  UNIQUE(team_id, jersey_number),
  CONSTRAINT valid_member_role CHECK (role IN ('captain', 'vice_captain', 'member')),
  CONSTRAINT valid_jersey CHECK (jersey_number >= 1 AND jersey_number <= 99)
);

CREATE INDEX idx_team_members_team ON team_members(team_id);
CREATE INDEX idx_team_members_user ON team_members(user_id);
CREATE INDEX idx_team_members_role ON team_members(team_id, role);

-- RLS 정책
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Team members are viewable by everyone" ON team_members
  FOR SELECT USING (true);

CREATE POLICY "Team captains can manage members" ON team_members
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM team_members tm
      WHERE tm.team_id = team_members.team_id
        AND tm.user_id = auth.uid()
        AND tm.role = 'captain'
    )
  );

CREATE POLICY "Users can update own membership" ON team_members
  FOR UPDATE USING (user_id = auth.uid());

-- ===================================================================
-- 4. MATCHES TABLE
-- ===================================================================
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 경기 분류
  type VARCHAR(20) NOT NULL DEFAULT 'friendly',
  league_id UUID,

  -- 팀 정보
  home_team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  away_team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,

  -- 일정
  match_date DATE NOT NULL,
  match_time TIME NOT NULL,
  venue VARCHAR(200) NOT NULL,
  venue_address TEXT,

  -- 경기 상태
  status VARCHAR(20) NOT NULL DEFAULT 'scheduled',

  -- 스코어
  home_score INTEGER DEFAULT 0,
  away_score INTEGER DEFAULT 0,

  -- 경기 시간 설정
  first_half_duration INTEGER DEFAULT 45,
  second_half_duration INTEGER DEFAULT 45,

  -- 용병 모집
  mercenary_recruitment_enabled BOOLEAN DEFAULT false,
  mercenary_positions JSON,
  mercenary_count INTEGER DEFAULT 0,
  mercenary_level VARCHAR(20),

  -- 메모
  notes TEXT,

  -- 메타
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  started_at TIMESTAMP,
  finished_at TIMESTAMP,

  CONSTRAINT valid_match_type CHECK (type IN ('league', 'cup', 'friendly', 'practice')),
  CONSTRAINT valid_match_status CHECK (status IN ('scheduled', 'live', 'finished', 'cancelled')),
  CONSTRAINT different_teams CHECK (home_team_id != away_team_id)
);

CREATE INDEX idx_matches_date ON matches(match_date DESC);
CREATE INDEX idx_matches_status ON matches(status);
CREATE INDEX idx_matches_home_team ON matches(home_team_id);
CREATE INDEX idx_matches_away_team ON matches(away_team_id);
CREATE INDEX idx_matches_league ON matches(league_id);

-- RLS 정책
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Matches are viewable by everyone" ON matches
  FOR SELECT USING (true);

CREATE POLICY "Match creator or team captains can update" ON matches
  FOR UPDATE USING (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.team_id IN (matches.home_team_id, matches.away_team_id)
        AND team_members.user_id = auth.uid()
        AND team_members.role = 'captain'
    )
  );

CREATE POLICY "Authenticated users can create matches" ON matches
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- ===================================================================
-- 5. MATCH_ATTENDANCES TABLE
-- ===================================================================
CREATE TABLE match_attendances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,

  -- 참석 상태
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  reason TEXT,

  -- 선발/교체 정보
  is_starter BOOLEAN DEFAULT false,
  jersey_number INTEGER,

  -- 메타
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(match_id, user_id),
  CONSTRAINT valid_attendance_status CHECK (status IN ('attending', 'absent', 'pending'))
);

CREATE INDEX idx_attendances_match ON match_attendances(match_id);
CREATE INDEX idx_attendances_user ON match_attendances(user_id);
CREATE INDEX idx_attendances_status ON match_attendances(match_id, status);

-- ===================================================================
-- 6. TRIGGERS
-- ===================================================================

-- 팀 멤버 수 자동 업데이트
CREATE OR REPLACE FUNCTION update_team_member_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE teams
  SET current_member_count = (
    SELECT COUNT(*) FROM team_members WHERE team_id = COALESCE(NEW.team_id, OLD.team_id)
  )
  WHERE id = COALESCE(NEW.team_id, OLD.team_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_team_member_count
AFTER INSERT OR DELETE ON team_members
FOR EACH ROW EXECUTE FUNCTION update_team_member_count();

-- ===================================================================
-- SETUP COMPLETE - Phase 1
-- ===================================================================
