export type MatchType = 'league' | 'cup' | 'friendly' | 'practice';
export type MatchStatus = 'scheduled' | 'live' | 'finished' | 'cancelled';
export type AttendanceStatus = 'attending' | 'absent' | 'pending';
export type EventType = 'goal' | 'yellow' | 'red' | 'substitution';
export type TimerPhase = 'first-half' | 'half-time' | 'second-half' | 'finished';

export interface MatchScore {
  home: number;
  away: number;
}

export interface MercenaryRecruitment {
  enabled: boolean;
  positions: string[];
  count: number;
}

export interface MatchAttendance {
  matchId: string;
  playerId: string;
  status: AttendanceStatus;
  updatedAt: string;
  reason?: string;
}

export interface MatchEvent {
  id: string;
  type: EventType;
  teamId: string;
  playerId: string;
  minute: number;
  phase: 'first-half' | 'second-half';
  relatedPlayerId?: string; // 어시스트 또는 교체 IN 선수
  reason?: string; // 경고/퇴장 사유
  isMercenary?: boolean;
}

export interface PlayerLineup {
  playerId: string;
  name: string;
  avatar?: string;
  position: string;
  number: number;
  isStarter: boolean;
  isSubstituted?: boolean;
  substitutedAt?: number;
}

export interface Match {
  id: string;
  type: MatchType;
  leagueId?: string;
  homeTeamId: string;
  awayTeamId: string;
  homeTeamName: string;
  awayTeamName: string;
  homeTeamLogo?: string;
  awayTeamLogo?: string;
  date: string;
  time: string;
  venue: string;
  status: MatchStatus;
  score?: MatchScore;
  mercenaryRecruitment?: MercenaryRecruitment;
  attendances?: MatchAttendance[];
  approvedMercenaries?: string[];
  events?: MatchEvent[];
  homeLineup?: PlayerLineup[];
  awayLineup?: PlayerLineup[];
  stats?: MatchStats; // Phase 5: 경기 통계
}

export interface MatchTimer {
  phase: TimerPhase;
  minute: number;
  second: number;
  isRunning: boolean;
}

// Phase 5: 경기 결과 관련 타입
export interface MatchStats {
  homeShots: number;
  awayShots: number;
  homeFouls: number;
  awayFouls: number;
  homeCorners: number;
  awayCorners: number;
  homePossession?: number; // 선택적 (0-100)
  awayPossession?: number; // 선택적 (0-100)
}

export interface PlayerMatchStats {
  playerId: string;
  playerName: string;
  teamId: string;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
}

export interface MatchMVP {
  topScorer?: PlayerMatchStats; // 득점왕
  topAssister?: PlayerMatchStats; // 어시스트왕
}
