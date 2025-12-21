# League Maker 데이터베이스 설계

## 개요
아마추어 축구 기록 관리 플랫폼을 위한 데이터베이스 스키마 정의

**백엔드**: Supabase (PostgreSQL 15+)
**클라이언트**: @supabase/supabase-js
**인증**: Supabase Auth (이메일, OAuth)
**스토리지**: Supabase Storage (이미지 업로드)
**실시간**: Supabase Realtime (경기 스코어 업데이트)
**ORM (선택)**: Prisma (타입 안정성 강화용)

---

## Supabase 주요 기능 활용

### 1. 자동 REST API
- 모든 테이블에 대해 CRUD API 자동 생성
- `/rest/v1/teams?select=*` 형태로 즉시 사용 가능

### 2. Row Level Security (RLS)
- 사용자별 데이터 접근 제어
- SQL 정책으로 보안 규칙 정의

### 3. Realtime Subscriptions
- 경기 스코어, 참석 여부 등 실시간 업데이트
- WebSocket 기반 자동 동기화

### 4. Supabase Auth
- 이메일/비밀번호, OAuth (Google, GitHub 등)
- JWT 기반 세션 관리

### 5. Supabase Storage
- 프로필 사진, 팀 로고, 경기 사진 업로드
- CDN을 통한 빠른 이미지 제공

---

## 핵심 엔티티 관계도

```
User ─┬─ TeamMember ── Team ─┬─ Match (home/away)
      │   (Many-to-Many)     ├─ LeagueTeam ── League
      │   한 선수 = 여러 팀    └─ TeamStats
      │
      ├─ MatchAttendance ── Match ── MatchEvent
      │                            └─ MercenaryApplication
      │
      ├─ Post ── Comment
      │       └─ PostLike
      │
      └─ Notification
```

**🏃 아마추어 축구 특성 반영**
- **1 플레이어 = N 팀**: team_members 테이블로 다대다 관계 구현
- **팀별 다른 포지션**: 같은 선수가 A팀에선 FW, B팀에선 MF 가능
- **팀별 다른 등번호**: 각 팀마다 다른 등번호 착용 가능
- **팀별 통계 분리**: 전체 통계(users) + 팀별 통계(team_members)

---

## 1. 사용자 관리 (User Management)

### users
사용자 계정 정보 (팀 독립적 정보만 저장)

**중요**:
- Supabase Auth와 연동 (auth.users의 id를 참조)
- 포지션, 등번호는 팀별로 다를 수 있으므로 team_members 테이블에 저장
- avatar_url은 Supabase Storage 경로 저장

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE, -- Supabase Auth 연동
  email VARCHAR(255) UNIQUE NOT NULL,
  nickname VARCHAR(50) UNIQUE NOT NULL,
  avatar_url TEXT, -- Supabase Storage: avatars/user-id/profile.jpg
  role VARCHAR(20) NOT NULL DEFAULT 'player', -- player, coach, manager
  bio TEXT,
  phone VARCHAR(20),
  preferred_position VARCHAR(30), -- 선호 포지션 (참고용, 팀별 실제 포지션은 team_members에)

  -- 전체 통계 (모든 팀 합산)
  total_matches INTEGER DEFAULT 0,
  total_goals INTEGER DEFAULT 0,
  total_assists INTEGER DEFAULT 0,
  total_yellow_cards INTEGER DEFAULT 0,
  total_red_cards INTEGER DEFAULT 0,
  attendance_rate DECIMAL(5,2) DEFAULT 0.00, -- 전체 참석률 (0.00 ~ 100.00)

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

-- 모든 사용자는 다른 사용자 프로필을 읽을 수 있음
CREATE POLICY "Users are viewable by everyone" ON users
  FOR SELECT USING (true);

-- 사용자는 자신의 프로필만 수정 가능
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- 사용자는 자신의 프로필만 삭제 가능
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
```

---

## 2. 팀 관리 (Team Management)

### teams
팀 기본 정보

```sql
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  logo_url TEXT,
  region VARCHAR(100) NOT NULL, -- 예: "서울 강남구"
  district VARCHAR(50), -- 시/군/구
  city VARCHAR(50), -- 시/도
  level VARCHAR(20) NOT NULL DEFAULT 'intermediate', -- beginner, intermediate, advanced
  description TEXT,
  founded_date DATE,

  -- 활동 정보
  activity_days JSON, -- ["월", "수", "금"] 또는 ["주말"]
  activity_time VARCHAR(50), -- "저녁 7시~9시"
  home_ground VARCHAR(200), -- 홈 구장 정보

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

-- 모든 사용자는 팀 정보를 읽을 수 있음
CREATE POLICY "Teams are viewable by everyone" ON teams
  FOR SELECT USING (true);

-- 팀 주장만 팀 정보 수정 가능
CREATE POLICY "Team captains can update team" ON teams
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.team_id = teams.id
        AND team_members.user_id = auth.uid()
        AND team_members.role = 'captain'
    )
  );

-- 로그인한 사용자는 팀 생성 가능
CREATE POLICY "Authenticated users can create teams" ON teams
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
```

### team_members
팀 멤버십 - User와 Team의 **다대다 관계** (한 선수가 여러 팀 소속 가능)

**핵심 설계**:
- 한 선수(user)는 여러 팀에 소속 가능 (UNIQUE 제약이 없음)
- 같은 팀에는 중복 가입 불가 (UNIQUE(team_id, user_id))
- 팀별로 다른 포지션, 등번호, 역할 가능

```sql
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- 역할 (팀별로 다를 수 있음)
  role VARCHAR(20) NOT NULL DEFAULT 'member', -- captain, vice_captain, member
  position VARCHAR(30), -- FW, MF, DF, GK (A팀에선 FW, B팀에선 MF 가능)
  jersey_number INTEGER, -- 팀별로 다른 등번호 착용 가능

  -- 등록 정보
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_registered BOOLEAN DEFAULT true, -- 리그 등록 선수 여부 (팀별로 관리)

  -- 팀 내 통계 (해당 팀에서만의 기록)
  team_matches INTEGER DEFAULT 0,
  team_goals INTEGER DEFAULT 0,
  team_assists INTEGER DEFAULT 0,

  UNIQUE(team_id, user_id), -- 같은 팀에 중복 가입 방지
  UNIQUE(team_id, jersey_number), -- 팀 내에서 등번호 중복 방지
  CONSTRAINT valid_member_role CHECK (role IN ('captain', 'vice_captain', 'member')),
  CONSTRAINT valid_jersey CHECK (jersey_number >= 1 AND jersey_number <= 99)
);

CREATE INDEX idx_team_members_team ON team_members(team_id);
CREATE INDEX idx_team_members_user ON team_members(user_id); -- 한 선수의 모든 팀 조회
CREATE INDEX idx_team_members_role ON team_members(team_id, role);

-- RLS 정책
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- 모든 사용자는 팀 멤버 목록을 읽을 수 있음
CREATE POLICY "Team members are viewable by everyone" ON team_members
  FOR SELECT USING (true);

-- 팀 주장은 멤버를 추가/삭제 가능
CREATE POLICY "Team captains can manage members" ON team_members
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM team_members tm
      WHERE tm.team_id = team_members.team_id
        AND tm.user_id = auth.uid()
        AND tm.role = 'captain'
    )
  );

-- 사용자는 본인의 팀 멤버십 정보를 수정 가능 (포지션, 등번호 등)
CREATE POLICY "Users can update own membership" ON team_members
  FOR UPDATE USING (user_id = auth.uid());
```

**예시 시나리오**:
```sql
-- 김민수는 FC강남(FW, #10), 서울FC(MF, #8), 주말리그팀(DF, #5) 3개 팀에 소속
INSERT INTO team_members (team_id, user_id, position, jersey_number) VALUES
  ('fc-gangnam-id', 'user-kim-id', 'FW', 10),
  ('seoul-fc-id', 'user-kim-id', 'MF', 8),
  ('weekend-team-id', 'user-kim-id', 'DF', 5);

-- 김민수의 모든 소속팀 조회
SELECT t.name, tm.position, tm.jersey_number
FROM team_members tm
JOIN teams t ON tm.team_id = t.id
WHERE tm.user_id = 'user-kim-id';
```

### team_tags
팀 태그 (검색/필터용)

```sql
CREATE TABLE team_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  tag VARCHAR(50) NOT NULL, -- "주중", "주말", "친목", "경쟁", "30대", "풋살"

  UNIQUE(team_id, tag)
);

CREATE INDEX idx_team_tags_tag ON team_tags(tag);
```

---

## 3. 리그 관리 (League Management)

### leagues
리그/대회 정보

```sql
CREATE TABLE leagues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(150) NOT NULL,
  logo_url TEXT,
  description TEXT,

  -- 분류
  type VARCHAR(20) NOT NULL DEFAULT 'league', -- league, cup, tournament
  region VARCHAR(100) NOT NULL,
  level VARCHAR(20) NOT NULL DEFAULT 'intermediate',

  -- 일정
  status VARCHAR(20) NOT NULL DEFAULT 'upcoming', -- upcoming, ongoing, finished
  start_date DATE NOT NULL,
  end_date DATE,

  -- 규칙
  rules TEXT, -- 리그 규칙 설명
  max_teams INTEGER DEFAULT 12,
  registered_player_limit INTEGER DEFAULT 25, -- 등록 선수 제한
  match_duration_first_half INTEGER DEFAULT 45, -- 전반 시간 (분)
  match_duration_second_half INTEGER DEFAULT 45, -- 후반 시간 (분)

  -- 메타
  organizer_id UUID REFERENCES users(id), -- 주최자
  is_featured BOOLEAN DEFAULT false, -- 인기 리그 표시
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT valid_league_type CHECK (type IN ('league', 'cup', 'tournament')),
  CONSTRAINT valid_league_status CHECK (status IN ('upcoming', 'ongoing', 'finished'))
);

CREATE INDEX idx_leagues_status ON leagues(status);
CREATE INDEX idx_leagues_region ON leagues(region);
CREATE INDEX idx_leagues_featured ON leagues(is_featured);
```

### league_teams
리그 참가팀

```sql
CREATE TABLE league_teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  league_id UUID NOT NULL REFERENCES leagues(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,

  -- 순위 정보 (자동 계산)
  rank INTEGER DEFAULT 0,
  matches_played INTEGER DEFAULT 0,
  wins INTEGER DEFAULT 0,
  draws INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  goals_for INTEGER DEFAULT 0,
  goals_against INTEGER DEFAULT 0,
  goal_difference INTEGER DEFAULT 0,
  points INTEGER DEFAULT 0, -- 승점 (승 3점, 무 1점)

  -- 폼 (최근 5경기)
  recent_form JSON, -- ["W", "D", "L", "W", "W"]

  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(league_id, team_id)
);

CREATE INDEX idx_league_teams_league ON league_teams(league_id);
CREATE INDEX idx_league_teams_rank ON league_teams(league_id, rank);
```

### league_top_scorers
리그 득점왕 순위 (뷰로 생성 가능)

```sql
CREATE TABLE league_top_scorers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  league_id UUID NOT NULL REFERENCES leagues(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,

  goals INTEGER DEFAULT 0,
  assists INTEGER DEFAULT 0,
  matches_played INTEGER DEFAULT 0,

  UNIQUE(league_id, user_id)
);

CREATE INDEX idx_league_scorers_league ON league_top_scorers(league_id, goals DESC);
```

---

## 4. 경기 관리 (Match Management)

### matches
경기 정보

```sql
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 경기 분류
  type VARCHAR(20) NOT NULL DEFAULT 'friendly', -- league, cup, friendly, practice
  league_id UUID REFERENCES leagues(id) ON DELETE SET NULL, -- 리그/컵 경기인 경우

  -- 팀 정보
  home_team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  away_team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,

  -- 일정
  match_date DATE NOT NULL,
  match_time TIME NOT NULL,
  venue VARCHAR(200) NOT NULL, -- 경기 장소
  venue_address TEXT,

  -- 경기 상태
  status VARCHAR(20) NOT NULL DEFAULT 'scheduled', -- scheduled, live, finished, cancelled

  -- 스코어
  home_score INTEGER DEFAULT 0,
  away_score INTEGER DEFAULT 0,

  -- 경기 시간 설정
  first_half_duration INTEGER DEFAULT 45,
  second_half_duration INTEGER DEFAULT 45,

  -- 용병 모집 (친선/연습 경기만)
  mercenary_recruitment_enabled BOOLEAN DEFAULT false,
  mercenary_positions JSON, -- ["FW", "MF"]
  mercenary_count INTEGER DEFAULT 0,
  mercenary_level VARCHAR(20), -- beginner, intermediate, advanced

  -- 메모
  notes TEXT,

  -- 메타
  created_by UUID REFERENCES users(id), -- 경기 생성자
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

-- 모든 사용자는 경기 정보를 읽을 수 있음
CREATE POLICY "Matches are viewable by everyone" ON matches
  FOR SELECT USING (true);

-- 경기 생성자 또는 참여 팀 주장이 경기 수정 가능
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

-- 로그인한 사용자는 경기 생성 가능
CREATE POLICY "Authenticated users can create matches" ON matches
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Realtime 활성화 (실시간 스코어 업데이트)
ALTER PUBLICATION supabase_realtime ADD TABLE matches;
```

### match_attendances
경기 참석 관리

```sql
CREATE TABLE match_attendances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,

  -- 참석 상태
  status VARCHAR(20) NOT NULL DEFAULT 'pending', -- attending, absent, pending
  reason TEXT, -- 불참 사유 (선택)

  -- 선발/교체 정보
  is_starter BOOLEAN DEFAULT false, -- 선발 여부
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
```

### match_events
경기 이벤트 (득점, 카드, 교체)

```sql
CREATE TABLE match_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,

  -- 이벤트 분류
  type VARCHAR(20) NOT NULL, -- goal, assist, yellow_card, red_card, substitution
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,

  -- 선수 정보
  player_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  related_player_id UUID REFERENCES users(id), -- 어시스트 또는 교체 IN 선수

  -- 이벤트 시간
  minute INTEGER NOT NULL, -- 경기 시간 (분)
  half VARCHAR(10) NOT NULL DEFAULT 'first', -- first, second, extra

  -- 용병 여부
  is_mercenary BOOLEAN DEFAULT false,

  -- 메타
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT valid_event_type CHECK (type IN ('goal', 'assist', 'yellow_card', 'red_card', 'substitution')),
  CONSTRAINT valid_half CHECK (half IN ('first', 'second', 'extra')),
  CONSTRAINT valid_minute CHECK (minute >= 0 AND minute <= 120)
);

CREATE INDEX idx_match_events_match ON match_events(match_id, minute);
CREATE INDEX idx_match_events_player ON match_events(player_id);
CREATE INDEX idx_match_events_type ON match_events(type);
```

### mercenary_applications
용병 신청

```sql
CREATE TABLE mercenary_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- 신청 정보
  position VARCHAR(30) NOT NULL,
  level VARCHAR(20) NOT NULL,
  introduction TEXT NOT NULL, -- 한줄 소개

  -- 승인 상태
  status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending, approved, rejected
  approved_by UUID REFERENCES users(id), -- 승인자 (팀 관리자)

  -- 메타
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(match_id, user_id),
  CONSTRAINT valid_mercenary_status CHECK (status IN ('pending', 'approved', 'rejected'))
);

CREATE INDEX idx_mercenary_applications_match ON mercenary_applications(match_id);
CREATE INDEX idx_mercenary_applications_status ON mercenary_applications(status);
```

---

## 5. 커뮤니티 (Community)

### posts
게시글

```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- 카테고리
  category VARCHAR(30) NOT NULL DEFAULT 'free', -- free, recruitment, mercenary, review

  -- 경기 연동 (용병 구함 게시글)
  match_id UUID REFERENCES matches(id) ON DELETE SET NULL,

  -- 통계
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,

  -- 메타
  is_pinned BOOLEAN DEFAULT false, -- 공지 고정
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT valid_post_category CHECK (category IN ('free', 'recruitment', 'mercenary', 'review'))
);

CREATE INDEX idx_posts_category ON posts(category);
CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_created ON posts(created_at DESC);
CREATE INDEX idx_posts_deleted ON posts(is_deleted);
```

### comments
댓글

```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE, -- 대댓글

  content TEXT NOT NULL,

  -- 메타
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_comments_post ON comments(post_id);
CREATE INDEX idx_comments_author ON comments(author_id);
CREATE INDEX idx_comments_parent ON comments(parent_comment_id);
```

### post_likes
게시글 좋아요

```sql
CREATE TABLE post_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(post_id, user_id)
);

CREATE INDEX idx_post_likes_post ON post_likes(post_id);
```

---

## 6. 알림 (Notifications)

### notifications
사용자 알림

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- 알림 분류
  type VARCHAR(30) NOT NULL, -- match_schedule, attendance_request, mercenary_application, comment, like
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,

  -- 링크
  link_url TEXT, -- 클릭 시 이동할 URL

  -- 관련 엔티티
  related_match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
  related_post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  related_user_id UUID REFERENCES users(id) ON DELETE CASCADE,

  -- 상태
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT valid_notification_type CHECK (
    type IN ('match_schedule', 'attendance_request', 'mercenary_application', 'comment', 'like', 'team_invitation')
  )
);

CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);
```

---

## 7. 검색 및 메타데이터

### search_history
최근 검색어 (로컬 스토리지 대체 가능)

```sql
CREATE TABLE search_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  query VARCHAR(200) NOT NULL,
  category VARCHAR(30), -- team, league, match, post, mercenary

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(user_id, query, category)
);

CREATE INDEX idx_search_history_user ON search_history(user_id, created_at DESC);
```

### popular_searches
인기 검색어 (집계)

```sql
CREATE TABLE popular_searches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query VARCHAR(200) UNIQUE NOT NULL,
  search_count INTEGER DEFAULT 1,

  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_popular_searches_count ON popular_searches(search_count DESC);
```

---

## 8. 플랫폼 통계 (Platform Stats)

### platform_stats
플랫폼 전체 통계 (일별 집계)

```sql
CREATE TABLE platform_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stat_date DATE UNIQUE NOT NULL DEFAULT CURRENT_DATE,

  -- 집계 데이터
  total_teams INTEGER DEFAULT 0,
  total_matches INTEGER DEFAULT 0,
  total_players INTEGER DEFAULT 0,
  weekly_goals INTEGER DEFAULT 0,
  active_leagues INTEGER DEFAULT 0,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_platform_stats_date ON platform_stats(stat_date DESC);
```

---

## 9. 세션 및 인증

### sessions
사용자 세션 (NextAuth.js 등 사용 시 자동 생성)

```sql
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sessions_token ON sessions(session_token);
CREATE INDEX idx_sessions_user ON sessions(user_id);
```

---

## 데이터베이스 뷰 (Views)

### 실시간 팀 랭킹
```sql
CREATE VIEW team_rankings AS
SELECT
  t.id,
  t.name,
  t.logo_url,
  t.wins,
  t.draws,
  t.losses,
  t.goals_for,
  t.goals_against,
  (t.goals_for - t.goals_against) AS goal_difference,
  (t.wins * 3 + t.draws) AS points,
  RANK() OVER (ORDER BY (t.wins * 3 + t.draws) DESC, (t.goals_for - t.goals_against) DESC) AS rank
FROM teams t
WHERE t.is_active = true;
```

### 실시간 득점왕 랭킹
```sql
CREATE VIEW top_scorers AS
SELECT
  u.id,
  u.nickname,
  u.avatar_url,
  u.total_goals,
  u.total_assists,
  t.name AS team_name,
  t.id AS team_id,
  RANK() OVER (ORDER BY u.total_goals DESC, u.total_assists DESC) AS rank
FROM users u
LEFT JOIN team_members tm ON u.id = tm.user_id
LEFT JOIN teams t ON tm.team_id = t.id
WHERE u.role = 'player' AND u.is_active = true;
```

---

## 트리거 (Triggers)

### 팀 멤버 수 자동 업데이트
```sql
CREATE OR REPLACE FUNCTION update_team_member_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE teams
  SET current_member_count = (
    SELECT COUNT(*) FROM team_members WHERE team_id = NEW.team_id
  )
  WHERE id = NEW.team_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_team_member_count
AFTER INSERT OR DELETE ON team_members
FOR EACH ROW EXECUTE FUNCTION update_team_member_count();
```

### 사용자 통계 자동 업데이트
```sql
CREATE OR REPLACE FUNCTION update_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.type = 'goal' THEN
    UPDATE users SET total_goals = total_goals + 1 WHERE id = NEW.player_id;
  ELSIF NEW.type = 'assist' THEN
    UPDATE users SET total_assists = total_assists + 1 WHERE id = NEW.player_id;
  ELSIF NEW.type = 'yellow_card' THEN
    UPDATE users SET total_yellow_cards = total_yellow_cards + 1 WHERE id = NEW.player_id;
  ELSIF NEW.type = 'red_card' THEN
    UPDATE users SET total_red_cards = total_red_cards + 1 WHERE id = NEW.player_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_user_stats
AFTER INSERT ON match_events
FOR EACH ROW EXECUTE FUNCTION update_user_stats();
```

### 경기 스코어 자동 업데이트
```sql
CREATE OR REPLACE FUNCTION update_match_score()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.type = 'goal' THEN
    UPDATE matches
    SET home_score = (
      SELECT COUNT(*) FROM match_events
      WHERE match_id = NEW.match_id
      AND type = 'goal'
      AND team_id = matches.home_team_id
    ),
    away_score = (
      SELECT COUNT(*) FROM match_events
      WHERE match_id = NEW.match_id
      AND type = 'goal'
      AND team_id = matches.away_team_id
    )
    WHERE id = NEW.match_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_match_score
AFTER INSERT ON match_events
FOR EACH ROW EXECUTE FUNCTION update_match_score();
```

---

## 초기 데이터 (Seed Data)

### 기본 지역 데이터
```sql
-- 주요 활동 지역
INSERT INTO regions (name, type) VALUES
('서울 강남구', 'district'),
('서울 서초구', 'district'),
('경기 성남시', 'city'),
('경기 수원시', 'city'),
('부산 해운대구', 'district');
```

---

## 인덱스 전략

### 복합 인덱스
```sql
-- 경기 검색 최적화
CREATE INDEX idx_matches_composite ON matches(status, match_date DESC, type);

-- 게시글 검색 최적화
CREATE INDEX idx_posts_composite ON posts(category, is_deleted, created_at DESC);

-- 알림 조회 최적화
CREATE INDEX idx_notifications_composite ON notifications(user_id, is_read, created_at DESC);

-- 리그 순위 최적화
CREATE INDEX idx_league_teams_composite ON league_teams(league_id, points DESC, goal_difference DESC);
```

### 전문 검색 (Full-Text Search)
```sql
-- PostgreSQL 전문 검색 인덱스
CREATE INDEX idx_teams_search ON teams USING GIN(to_tsvector('korean', name || ' ' || COALESCE(description, '')));
CREATE INDEX idx_posts_search ON posts USING GIN(to_tsvector('korean', title || ' ' || content));
```

---

## 마이그레이션 전략

### Phase 1: 핵심 테이블
1. users
2. teams, team_members
3. matches, match_attendances

### Phase 2: 리그 및 경기 기록
1. leagues, league_teams
2. match_events
3. mercenary_applications

### Phase 3: 커뮤니티 및 알림
1. posts, comments, post_likes
2. notifications

### Phase 4: 최적화 및 집계
1. Views 생성
2. Triggers 생성
3. Full-text search 인덱스

---

## TypeScript 타입 정의 (Supabase 자동 생성)

**자동 생성 명령어**:
```bash
supabase gen types typescript --local > lib/database.types.ts
```

**생성된 타입 예시** (lib/database.types.ts):
```typescript
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          nickname: string
          avatar_url: string | null
          role: string
          preferred_position: string | null
          bio: string | null
          phone: string | null
          total_matches: number
          total_goals: number
          total_assists: number
          total_yellow_cards: number
          total_red_cards: number
          attendance_rate: number
          created_at: string
          updated_at: string
          last_login_at: string | null
          is_active: boolean
        }
        Insert: {
          id: string
          email: string
          nickname: string
          avatar_url?: string | null
          role?: string
          preferred_position?: string | null
          bio?: string | null
          phone?: string | null
          // ... 기타 필드
        }
        Update: {
          id?: string
          email?: string
          nickname?: string
          // ... 기타 필드
        }
      }
      teams: {
        Row: {
          id: string
          name: string
          logo_url: string | null
          region: string
          // ... 기타 필드
        }
        Insert: {
          name: string
          region: string
          // ... 기타 필드
        }
        Update: {
          name?: string
          region?: string
          // ... 기타 필드
        }
      }
      team_members: {
        Row: {
          id: string
          team_id: string
          user_id: string
          role: string
          position: string | null
          jersey_number: number | null
          joined_at: string
          is_registered: boolean
          team_matches: number
          team_goals: number
          team_assists: number
        }
        Insert: {
          team_id: string
          user_id: string
          role?: string
          position?: string | null
          jersey_number?: number | null
          // ... 기타 필드
        }
        Update: {
          role?: string
          position?: string | null
          jersey_number?: number | null
          // ... 기타 필드
        }
      }
      // ... 기타 테이블
    }
    Views: {
      team_rankings: {
        Row: {
          id: string
          name: string
          wins: number
          draws: number
          losses: number
          points: number
          rank: number
        }
      }
      top_scorers: {
        Row: {
          id: string
          nickname: string
          total_goals: number
          total_assists: number
          team_name: string
          rank: number
        }
      }
    }
    Functions: {
      // Edge Functions 타입 정의
    }
    Enums: {
      // Enum 타입 정의
    }
  }
}
```

**사용 예시**:
```typescript
import { Database } from '@/lib/database.types'
import { createClient } from '@supabase/supabase-js'

// 타입 안전한 Supabase 클라이언트
export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// 타입 자동 추론
const { data: users } = await supabase
  .from('users') // 자동완성 지원
  .select('*')   // Row 타입 반환

// Insert 타입 체크
const { error } = await supabase
  .from('teams')
  .insert({
    name: 'FC 강남',
    region: '서울 강남구',
    // 필수 필드 누락 시 타입 에러
  })
```

---

## ORM 스키마 예시 (Prisma - 선택 사항)

Supabase와 함께 Prisma를 사용하여 타입 안정성을 더욱 강화할 수 있습니다.

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL") // Supabase connection string
  directUrl = env("DIRECT_URL")  // Direct connection (for migrations)
}

model User {
  id               String   @id @default(uuid())
  email            String   @unique
  passwordHash     String   @map("password_hash")
  nickname         String   @unique
  avatarUrl        String?  @map("avatar_url")
  role             String   @default("player")
  preferredPosition String? @map("preferred_position") // 선호 포지션 (실제는 team_members에)
  bio              String?
  phone            String?

  // 전체 통계 (모든 팀 합산)
  totalMatches       Int     @default(0) @map("total_matches")
  totalGoals         Int     @default(0) @map("total_goals")
  totalAssists       Int     @default(0) @map("total_assists")
  totalYellowCards   Int     @default(0) @map("total_yellow_cards")
  totalRedCards      Int     @default(0) @map("total_red_cards")
  attendanceRate     Decimal @default(0.00) @map("attendance_rate") @db.Decimal(5, 2)

  emailVerified Boolean   @default(false) @map("email_verified")
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")
  lastLoginAt   DateTime? @map("last_login_at")
  isActive      Boolean   @default(true) @map("is_active")

  // 관계: 한 선수는 여러 팀에 소속 가능 (Many-to-Many via TeamMember)
  teamMembers        TeamMember[]         // 여러 팀 멤버십
  matchAttendances   MatchAttendance[]
  matchEvents        MatchEvent[]
  posts              Post[]
  comments           Comment[]
  postLikes          PostLike[]
  notifications      Notification[]
  mercenaryApps      MercenaryApplication[]

  @@map("users")
}

model TeamMember {
  id           String   @id @default(uuid())
  teamId       String   @map("team_id")
  userId       String   @map("user_id")

  // 팀별 역할/포지션 (같은 선수가 A팀에선 FW, B팀에선 MF 가능)
  role         String   @default("member") // captain, vice_captain, member
  position     String?  // FW, MF, DF, GK
  jerseyNumber Int?     @map("jersey_number")

  joinedAt     DateTime @default(now()) @map("joined_at")
  isRegistered Boolean  @default(true) @map("is_registered")

  // 팀별 통계 (해당 팀에서만의 기록)
  teamMatches  Int      @default(0) @map("team_matches")
  teamGoals    Int      @default(0) @map("team_goals")
  teamAssists  Int      @default(0) @map("team_assists")

  // 관계
  team         Team     @relation(fields: [teamId], references: [id], onDelete: Cascade)
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([teamId, userId])        // 같은 팀에 중복 가입 방지
  @@unique([teamId, jerseyNumber])  // 팀 내 등번호 중복 방지
  @@map("team_members")
}

model Team {
  id                   String   @id @default(uuid())
  name                 String   @unique
  logoUrl              String?  @map("logo_url")
  region               String
  district             String?
  city                 String?
  level                String   @default("intermediate")
  description          String?
  foundedDate          DateTime? @map("founded_date") @db.Date

  activityDays         Json?    @map("activity_days")
  activityTime         String?  @map("activity_time")
  homeGround           String?  @map("home_ground")

  isRecruiting         Boolean  @default(false) @map("is_recruiting")
  memberLimit          Int      @default(25) @map("member_limit")
  currentMemberCount   Int      @default(0) @map("current_member_count")

  totalMatches         Int      @default(0) @map("total_matches")
  wins                 Int      @default(0)
  draws                Int      @default(0)
  losses               Int      @default(0)
  goalsFor             Int      @default(0) @map("goals_for")
  goalsAgainst         Int      @default(0) @map("goals_against")

  createdAt            DateTime @default(now()) @map("created_at")
  updatedAt            DateTime @updatedAt @map("updated_at")
  isActive             Boolean  @default(true) @map("is_active")

  members              TeamMember[]
  homeMatches          Match[]  @relation("HomeTeam")
  awayMatches          Match[]  @relation("AwayTeam")
  leagueTeams          LeagueTeam[]
  tags                 TeamTag[]

  @@map("teams")
}

// ... 기타 모델 정의
```

---

## 실용적인 쿼리 예시

### 다중 팀 소속 관련 쿼리

#### 1. 한 선수의 모든 소속팀 조회
```sql
-- 김민수의 모든 팀과 각 팀에서의 역할/포지션 조회
SELECT
  t.name AS team_name,
  tm.position,
  tm.jersey_number,
  tm.role,
  tm.team_goals,
  tm.team_matches
FROM team_members tm
JOIN teams t ON tm.team_id = t.id
JOIN users u ON tm.user_id = u.id
WHERE u.nickname = '김민수'
ORDER BY tm.joined_at DESC;
```

#### 2. 선수의 팀별 통계 vs 전체 통계
```sql
-- 전체 통계와 팀별 통계 비교
SELECT
  u.nickname,
  u.total_goals AS 전체_골,
  u.total_assists AS 전체_어시스트,
  t.name AS 팀명,
  tm.team_goals AS 팀_골,
  tm.team_assists AS 팀_어시스트
FROM users u
LEFT JOIN team_members tm ON u.id = tm.user_id
LEFT JOIN teams t ON tm.team_id = t.id
WHERE u.id = 'user-id'
ORDER BY tm.team_goals DESC;
```

#### 3. 여러 팀에서 활동하는 선수 찾기
```sql
-- 2개 이상의 팀에 소속된 선수 목록
SELECT
  u.nickname,
  COUNT(tm.team_id) AS team_count,
  STRING_AGG(t.name, ', ') AS teams
FROM users u
JOIN team_members tm ON u.id = tm.user_id
JOIN teams t ON tm.team_id = t.id
GROUP BY u.id, u.nickname
HAVING COUNT(tm.team_id) >= 2
ORDER BY team_count DESC;
```

#### 4. 같은 선수가 포함된 경기 (다른 팀으로)
```sql
-- 김민수가 서로 다른 팀으로 참가한 경기 (한 선수가 양쪽 팀에 있을 수 없음을 확인)
SELECT
  m.match_date,
  ht.name AS home_team,
  at.name AS away_team,
  tm_home.position AS home_position,
  tm_away.position AS away_position
FROM matches m
JOIN teams ht ON m.home_team_id = ht.id
JOIN teams at ON m.away_team_id = at.id
LEFT JOIN team_members tm_home ON ht.id = tm_home.team_id
LEFT JOIN team_members tm_away ON at.id = tm_away.team_id
WHERE (tm_home.user_id = 'user-kim-id' AND tm_away.user_id IS NULL)
   OR (tm_away.user_id = 'user-kim-id' AND tm_home.user_id IS NULL);
```

#### 5. 특정 선수의 다가오는 경기 일정 (모든 소속팀)
```sql
-- 김민수의 모든 팀 경기 일정 (미래 경기만)
SELECT
  m.match_date,
  m.match_time,
  CASE
    WHEN m.home_team_id = tm.team_id THEN t.name || ' (홈)'
    ELSE t.name || ' (원정)'
  END AS my_team,
  CASE
    WHEN m.home_team_id = tm.team_id THEN opponent.name
    ELSE home.name
  END AS opponent_team,
  ma.status AS attendance_status
FROM team_members tm
JOIN teams t ON tm.team_id = t.id
JOIN matches m ON (m.home_team_id = tm.team_id OR m.away_team_id = tm.team_id)
LEFT JOIN teams home ON m.home_team_id = home.id
LEFT JOIN teams opponent ON m.away_team_id = opponent.id
LEFT JOIN match_attendances ma ON m.id = ma.match_id AND tm.user_id = ma.user_id
WHERE tm.user_id = 'user-kim-id'
  AND m.match_date >= CURRENT_DATE
  AND m.status = 'scheduled'
ORDER BY m.match_date, m.match_time;
```

### 경기 참석 관리 쿼리

#### 6. 팀별 참석률 계산
```sql
-- 각 팀에서의 참석률 계산
SELECT
  t.name AS team_name,
  COUNT(DISTINCT m.id) AS total_team_matches,
  COUNT(DISTINCT CASE WHEN ma.status = 'attending' THEN m.id END) AS attended_matches,
  ROUND(
    COUNT(DISTINCT CASE WHEN ma.status = 'attending' THEN m.id END)::DECIMAL /
    NULLIF(COUNT(DISTINCT m.id), 0) * 100,
    2
  ) AS attendance_rate
FROM team_members tm
JOIN teams t ON tm.team_id = t.id
LEFT JOIN matches m ON (m.home_team_id = t.id OR m.away_team_id = t.id)
LEFT JOIN match_attendances ma ON m.id = ma.match_id AND tm.user_id = ma.user_id
WHERE tm.user_id = 'user-id'
  AND m.status = 'finished'
GROUP BY t.id, t.name;
```

#### 7. 여러 팀 경기 겹침 체크
```sql
-- 같은 날짜/시간에 여러 팀의 경기가 겹치는지 확인
SELECT
  u.nickname,
  m1.match_date,
  m1.match_time,
  t1.name AS team_1,
  t2.name AS team_2
FROM users u
JOIN team_members tm1 ON u.id = tm1.user_id
JOIN team_members tm2 ON u.id = tm2.user_id AND tm1.team_id != tm2.team_id
JOIN matches m1 ON (m1.home_team_id = tm1.team_id OR m1.away_team_id = tm1.team_id)
JOIN matches m2 ON (m2.home_team_id = tm2.team_id OR m2.away_team_id = tm2.team_id)
JOIN teams t1 ON tm1.team_id = t1.id
JOIN teams t2 ON tm2.team_id = t2.id
WHERE m1.match_date = m2.match_date
  AND m1.match_time = m2.match_time
  AND m1.id < m2.id  -- 중복 방지
  AND u.id = 'user-id';
```

### 통계 및 분석 쿼리

#### 8. 선수의 전체 시즌 요약 (모든 팀 합산)
```sql
-- 시즌 전체 활동 요약
SELECT
  u.nickname,
  COUNT(DISTINCT tm.team_id) AS total_teams,
  u.total_matches,
  u.total_goals,
  u.total_assists,
  u.total_yellow_cards,
  u.total_red_cards,
  ROUND(u.attendance_rate, 2) AS attendance_rate,
  ROUND(u.total_goals::DECIMAL / NULLIF(u.total_matches, 0), 2) AS goals_per_match
FROM users u
LEFT JOIN team_members tm ON u.id = tm.user_id
WHERE u.id = 'user-id'
GROUP BY u.id, u.nickname;
```

#### 9. 가장 활발한 멀티팀 플레이어 랭킹
```sql
-- 여러 팀에서 활동하는 활발한 선수 랭킹
SELECT
  u.nickname,
  u.avatar_url,
  COUNT(DISTINCT tm.team_id) AS team_count,
  u.total_matches,
  u.total_goals,
  STRING_AGG(DISTINCT t.name, ', ' ORDER BY t.name) AS teams
FROM users u
JOIN team_members tm ON u.id = tm.user_id
JOIN teams t ON tm.team_id = t.id
WHERE u.role = 'player'
GROUP BY u.id
HAVING COUNT(DISTINCT tm.team_id) >= 2
ORDER BY u.total_goals DESC, team_count DESC
LIMIT 20;
```

#### 10. 팀 간 이적 이력
```sql
-- 선수의 팀 가입 순서 (이적 타임라인)
SELECT
  u.nickname,
  t.name AS team_name,
  tm.joined_at,
  tm.position,
  tm.jersey_number,
  LAG(t.name) OVER (PARTITION BY u.id ORDER BY tm.joined_at) AS previous_team
FROM users u
JOIN team_members tm ON u.id = tm.user_id
JOIN teams t ON tm.team_id = t.id
WHERE u.id = 'user-id'
ORDER BY tm.joined_at;
```

---

## 성능 최적화 가이드

### 쿼리 최적화
1. **N+1 문제 방지**: JOIN 또는 batch loading 사용
2. **적절한 인덱스**: 자주 검색하는 컬럼에 인덱스 추가
3. **페이지네이션**: LIMIT/OFFSET 또는 cursor-based pagination
4. **캐싱**: Redis로 자주 조회되는 데이터 캐싱 (랭킹, 통계)

### 스케일링 전략
1. **읽기 복제본**: 읽기 부하 분산
2. **연결 풀링**: PgBouncer 등 사용
3. **파티셔닝**: 큰 테이블(matches, match_events) 날짜별 파티션
4. **아카이빙**: 오래된 데이터 별도 보관

---

## 백업 및 복구

### 백업 전략
```bash
# 일일 자동 백업
pg_dump -U postgres -d league_maker -F c -f backup_$(date +%Y%m%d).dump

# 증분 백업 (WAL archiving)
archive_mode = on
archive_command = 'cp %p /backup/wal/%f'
```

### 복구 절차
```bash
# 전체 복원
pg_restore -U postgres -d league_maker_new backup_20250101.dump

# 특정 시점 복구 (PITR)
restore_command = 'cp /backup/wal/%f %p'
recovery_target_time = '2025-01-01 12:00:00'
```

---

## 보안 고려사항

### 데이터 보호
1. **암호화**: 비밀번호는 bcrypt/argon2로 해싱
2. **민감정보**: 전화번호, 이메일 암호화 저장 고려
3. **SQL Injection**: ORM 사용 또는 파라미터화된 쿼리
4. **접근 제어**: Row Level Security (RLS) 활용

### 감사 로그
```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name VARCHAR(50),
  action VARCHAR(20), -- INSERT, UPDATE, DELETE
  old_data JSONB,
  new_data JSONB,
  user_id UUID,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Supabase 설정 가이드

### 1. Supabase 프로젝트 생성

```bash
# 1. Supabase CLI 설치
npm install -g supabase

# 2. 프로젝트 초기화
supabase init

# 3. Supabase 대시보드에서 프로젝트 생성
# https://app.supabase.com → New Project

# 4. 로컬 개발 시작
supabase start
```

### 2. 환경 변수 설정 (.env.local)

```bash
# Supabase 프로젝트 URL과 API Key (대시보드에서 확인)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. 마이그레이션 파일 생성

```bash
# supabase/migrations/폴더에 SQL 파일 생성
supabase migration new initial_schema

# 생성된 파일에 위 테이블 정의 SQL 복사 후 실행
supabase db push
```

### 4. TypeScript 타입 자동 생성

```bash
# Supabase 타입을 TypeScript로 자동 생성
supabase gen types typescript --local > lib/database.types.ts

# 또는 프로젝트 ID 사용
supabase gen types typescript --project-id your-project-id > lib/database.types.ts
```

### 5. Supabase Client 설정

**lib/supabase.ts**:
```typescript
import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
```

### 6. Storage 버킷 설정

Supabase 대시보드 → Storage → Create Bucket:

```sql
-- 1. avatars 버킷 (프로필 이미지)
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

-- 2. team-logos 버킷 (팀 로고)
INSERT INTO storage.buckets (id, name, public) VALUES ('team-logos', 'team-logos', true);

-- 3. match-photos 버킷 (경기 사진)
INSERT INTO storage.buckets (id, name, public) VALUES ('match-photos', 'match-photos', true);

-- Storage RLS 정책
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload own avatar" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update own avatar" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

### 7. Realtime 설정

**프론트엔드에서 실시간 구독**:
```typescript
import { supabase } from '@/lib/supabase'

// 경기 스코어 실시간 업데이트
const channel = supabase
  .channel('match-updates')
  .on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'matches',
      filter: `id=eq.${matchId}`
    },
    (payload) => {
      console.log('Match updated:', payload.new)
      // 스코어 업데이트 로직
    }
  )
  .subscribe()

// 정리
return () => {
  supabase.removeChannel(channel)
}
```

### 8. API 사용 예시

#### 사용자 프로필 조회
```typescript
const { data: user, error } = await supabase
  .from('users')
  .select('*')
  .eq('id', userId)
  .single()
```

#### 팀 목록 조회 (멤버 포함)
```typescript
const { data: teams, error } = await supabase
  .from('teams')
  .select(`
    *,
    members:team_members(
      user:users(nickname, avatar_url),
      position,
      jersey_number
    )
  `)
  .eq('region', '서울 강남구')
```

#### 한 선수의 모든 팀 조회
```typescript
const { data: myTeams, error } = await supabase
  .from('team_members')
  .select(`
    team:teams(*),
    position,
    jersey_number,
    role
  `)
  .eq('user_id', userId)
```

#### 경기 생성
```typescript
const { data: match, error } = await supabase
  .from('matches')
  .insert({
    type: 'friendly',
    home_team_id: homeTeamId,
    away_team_id: awayTeamId,
    match_date: '2025-12-20',
    match_time: '19:00',
    venue: '서울 강남구 체육공원',
    created_by: userId
  })
  .select()
  .single()
```

#### 참석 여부 변경
```typescript
const { error } = await supabase
  .from('match_attendances')
  .upsert({
    match_id: matchId,
    user_id: userId,
    team_id: teamId,
    status: 'attending'
  })
```

#### 이미지 업로드
```typescript
const file = event.target.files[0]
const fileExt = file.name.split('.').pop()
const fileName = `${userId}/profile.${fileExt}`

const { error: uploadError } = await supabase.storage
  .from('avatars')
  .upload(fileName, file, { upsert: true })

if (!uploadError) {
  const { data } = supabase.storage
    .from('avatars')
    .getPublicUrl(fileName)

  // users 테이블의 avatar_url 업데이트
  await supabase
    .from('users')
    .update({ avatar_url: data.publicUrl })
    .eq('id', userId)
}
```

### 9. Edge Functions (선택 사항)

복잡한 비즈니스 로직은 Edge Functions로 구현:

```bash
# Edge Function 생성
supabase functions new calculate-league-standings

# 배포
supabase functions deploy calculate-league-standings
```

**supabase/functions/calculate-league-standings/index.ts**:
```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const { leagueId } = await req.json()

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  // 순위 계산 로직
  const { data: matches } = await supabase
    .from('matches')
    .select('*')
    .eq('league_id', leagueId)

  // ... 순위 계산 및 업데이트

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' }
  })
})
```

### 10. 보안 체크리스트

- ✅ 모든 테이블에 RLS 활성화
- ✅ Storage 버킷에 적절한 정책 설정
- ✅ Service Role Key는 서버 사이드에서만 사용
- ✅ Anon Key는 클라이언트에서 안전하게 사용 가능
- ✅ 민감한 작업은 Edge Functions 사용
- ✅ Rate Limiting 설정 (Supabase 대시보드)

---

## 다음 단계

### 1단계: Supabase 프로젝트 설정
- ✅ Supabase 프로젝트 생성
- ✅ 환경 변수 설정
- ✅ 마이그레이션 실행
- ✅ TypeScript 타입 생성

### 2단계: 인증 구현
- Supabase Auth 설정 (이메일, OAuth)
- 회원가입/로그인 페이지 구현
- Protected Routes 설정

### 3단계: 초기 데이터 생성
- Seed 스크립트 작성
- 테스트 데이터 생성 (Faker.js)
- Storage에 샘플 이미지 업로드

### 4단계: 프론트엔드 연동
- Supabase Client 설정
- React Query / SWR로 데이터 fetching
- Realtime 구독 설정 (경기 스코어)
- Storage 활용 (이미지 업로드)

---

## 참고 자료

### Supabase 공식 문서
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Supabase Storage](https://supabase.com/docs/guides/storage)
- [Supabase Realtime](https://supabase.com/docs/guides/realtime)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)

### 기술 스택 문서
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Next.js Database Guide](https://nextjs.org/docs/app/building-your-application/data-fetching)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### 추가 리소스
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli/introduction)
- [Database Design Best Practices](https://www.postgresql.org/docs/current/ddl.html)
- [Supabase YouTube Channel](https://www.youtube.com/@Supabase)

---

## 핵심 요약: 다중 팀 소속 설계

### ✅ 아마추어 축구 특성 완벽 반영

**1. 관계 구조**
- `User` ←→ `TeamMember` ←→ `Team` (다대다 관계)
- 한 선수가 **무제한**으로 여러 팀에 소속 가능
- 각 팀에서 **독립적인** 역할, 포지션, 등번호 보유

**2. 통계 분리**
```
전체 통계 (users 테이블)
├─ total_goals: 모든 팀 합산 골
├─ total_assists: 모든 팀 합산 어시스트
└─ attendance_rate: 전체 참석률

팀별 통계 (team_members 테이블)
├─ team_goals: A팀에서 넣은 골
├─ team_assists: A팀에서 기록한 어시스트
└─ team_matches: A팀 경기 수
```

**3. 실무 시나리오**
| 항목 | 예시 |
|------|------|
| 김민수의 팀 | FC강남, 서울FC, 주말리그팀 (3개) |
| FC강남에서 | FW, #10, 주장 |
| 서울FC에서 | MF, #8, 일반 멤버 |
| 주말리그팀에서 | DF, #5, 부주장 |
| 전체 통계 | 45골 (3개 팀 합산) |
| FC강남 통계 | 20골 (해당 팀만) |

**4. 주요 제약조건**
- ✅ 같은 팀에 중복 가입 불가: `UNIQUE(team_id, user_id)`
- ✅ 팀 내 등번호 중복 불가: `UNIQUE(team_id, jersey_number)`
- ✅ 다른 팀에는 같은 등번호 사용 가능
- ✅ 팀 탈퇴 시 해당 팀 기록만 삭제: `ON DELETE CASCADE`

**5. 자주 하는 질문**

**Q: 한 선수가 A팀과 B팀에서 동시에 경기를 뛸 수 있나요?**
A: 아니요. 경기 일정 겹침 체크 쿼리(예시 #7)로 방지합니다.

**Q: 팀 이적 시 이전 팀 기록은 어떻게 되나요?**
A: 팀을 탈퇴하면 team_members에서 해당 행이 삭제되지만, users.total_goals 등 전체 통계는 유지됩니다.

**Q: 리그 등록 선수 제한은 어떻게 관리하나요?**
A: team_members.is_registered 필드로 팀별로 등록 여부를 관리합니다.

**Q: 같은 선수가 양쪽 팀에 있을 수 있나요?**
A: 경기 생성 시 비즈니스 로직으로 방지합니다 (home_team_id ≠ away_team_id 멤버 교집합 체크).

---

**🚀 다음 단계**:
1. Supabase 프로젝트 생성 및 마이그레이션 실행
2. TypeScript 타입 자동 생성
3. Supabase Auth & Storage 설정
4. RLS 정책 활성화
5. Seed 데이터 생성

---

## Supabase 주요 장점

### 🎯 개발 속도 향상
- ✅ **자동 REST API**: 테이블 생성 즉시 API 사용 가능
- ✅ **TypeScript 타입 생성**: 타입 안정성 자동 확보
- ✅ **Auth 내장**: 이메일, OAuth 즉시 사용
- ✅ **Storage 내장**: 이미지 업로드 즉시 구현

### 🔒 보안 기본 제공
- ✅ **Row Level Security**: SQL 정책으로 데이터 보호
- ✅ **JWT 인증**: 안전한 세션 관리
- ✅ **자동 암호화**: 비밀번호 해싱 자동 처리

### ⚡ 실시간 기능
- ✅ **Realtime Subscriptions**: 경기 스코어 실시간 업데이트
- ✅ **WebSocket 자동 관리**: 복잡한 설정 불필요
- ✅ **Presence**: 온라인 사용자 추적

### 💰 비용 효율
- ✅ **무료 티어**: 500MB 데이터베이스, 1GB 파일 저장
- ✅ **종량제**: 사용량에 따라 자동 확장
- ✅ **All-in-One**: 별도 인프라 불필요

### 🚀 배포 간편
- ✅ **자동 스케일링**: 트래픽 증가 시 자동 대응
- ✅ **CDN 제공**: 전 세계 빠른 이미지 제공
- ✅ **백업 자동화**: 데이터 손실 방지
