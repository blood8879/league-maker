-- Stadium 테이블 생성
-- 팀별로 여러 개의 홈 경기장을 등록할 수 있도록 함

CREATE TABLE stadiums (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,

  -- 경기장 정보
  name VARCHAR(200) NOT NULL, -- 경기장명
  address VARCHAR(500) NOT NULL, -- 도로명 주소 또는 지번 주소
  address_detail VARCHAR(200), -- 상세 주소 (동, 호수 등)

  -- 카카오 주소 API 응답 데이터
  road_address VARCHAR(500), -- 도로명 주소
  jibun_address VARCHAR(500), -- 지번 주소
  zone_code VARCHAR(10), -- 우편번호

  -- 좌표 정보
  latitude DECIMAL(10, 8), -- 위도
  longitude DECIMAL(11, 8), -- 경도

  -- 기타 정보
  phone VARCHAR(20), -- 경기장 연락처
  notes TEXT, -- 메모 (주차 정보, 샤워실 유무 등)

  -- 메타
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_by UUID REFERENCES users(id), -- 등록한 사용자

  CONSTRAINT valid_coordinates CHECK (
    (latitude IS NULL AND longitude IS NULL) OR
    (latitude BETWEEN -90 AND 90 AND longitude BETWEEN -180 AND 180)
  )
);

-- 인덱스
CREATE INDEX idx_stadiums_team ON stadiums(team_id);
CREATE INDEX idx_stadiums_coordinates ON stadiums(latitude, longitude) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- RLS 정책
ALTER TABLE stadiums ENABLE ROW LEVEL SECURITY;

-- 모든 사용자는 경기장 정보를 읽을 수 있음
CREATE POLICY "Stadiums are viewable by everyone" ON stadiums
  FOR SELECT USING (true);

-- 팀의 주장, 코치, 감독만 경기장 등록 가능
CREATE POLICY "Team captains, coaches, and managers can create stadiums" ON stadiums
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.team_id = stadiums.team_id
        AND team_members.user_id = auth.uid()
        AND team_members.role IN ('captain', 'coach', 'manager')
    )
  );

-- 팀의 주장, 코치, 감독만 경기장 수정 가능
CREATE POLICY "Team captains, coaches, and managers can update stadiums" ON stadiums
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.team_id = stadiums.team_id
        AND team_members.user_id = auth.uid()
        AND team_members.role IN ('captain', 'coach', 'manager')
    )
  );

-- 팀의 주장, 코치, 감독만 경기장 삭제 가능
CREATE POLICY "Team captains, coaches, and managers can delete stadiums" ON stadiums
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM team_members
      WHERE team_members.team_id = stadiums.team_id
        AND team_members.user_id = auth.uid()
        AND team_members.role IN ('captain', 'coach', 'manager')
    )
  );

-- 트리거: updated_at 자동 업데이트
CREATE TRIGGER update_stadiums_updated_at
  BEFORE UPDATE ON stadiums
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 코멘트
COMMENT ON TABLE stadiums IS '팀 홈 경기장 정보 - 팀별로 여러 개의 경기장을 등록할 수 있음';
COMMENT ON COLUMN stadiums.name IS '경기장명';
COMMENT ON COLUMN stadiums.address IS '카카오 주소 검색으로 입력된 주소';
COMMENT ON COLUMN stadiums.latitude IS '위도 (카카오 API 제공)';
COMMENT ON COLUMN stadiums.longitude IS '경도 (카카오 API 제공)';
