import { Match, AttendanceStatus } from './match';
import { Team } from './team';

// 참석 정보가 포함된 경기
export interface MatchWithAttendance extends Match {
  myAttendance?: AttendanceStatus;
}

// 역할 정보가 포함된 팀
export interface TeamWithRole extends Team {
  myRole: 'captain' | 'vice-captain' | 'member';
}

// 사용자 통계 (User.stats와 동일하지만 명시적으로 정의)
export interface UserStats {
  matchCount: number;
  attendanceRate: number; // 0-100
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
}

// 대시보드 데이터
export interface DashboardData {
  upcomingMatches: MatchWithAttendance[]; // 다가오는 경기 (최대 5개)
  pendingMatches: MatchWithAttendance[]; // 참석 대기중인 경기 (미정 상태)
  myTeams: TeamWithRole[]; // 내 팀 목록
  stats: UserStats; // 개인 통계
}

// 시즌별 통계
export interface SeasonStats {
  season: string; // 예: "2024 Spring"
  matchCount: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  attendanceRate: number;
}

// 팀별 통계
export interface TeamStats {
  teamId: string;
  teamName: string;
  teamLogo?: string;
  matchCount: number;
  goals: number;
  assists: number;
  attendanceRate: number;
}
