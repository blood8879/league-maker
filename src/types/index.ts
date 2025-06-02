// User related types
export interface User {
  id: string;
  email: string;
  name?: string;
  position?: Position;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

// Team related types
export interface Team {
  id: string;
  name: string;
  description?: string;
  home_stadium: string;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: TeamRole;
  joined_at: string;
  status: MemberStatus;
}

// Match related types
export interface Match {
  id: string;
  home_team_id: string;
  away_team_id?: string;
  away_team_name?: string; // For external teams
  stadium: string;
  match_date: string;
  status: MatchStatus;
  created_at: string;
  updated_at: string;
}

export interface MatchAttendance {
  id: string;
  match_id: string;
  user_id: string;
  status: AttendanceStatus;
  is_mercenary: boolean;
  created_at: string;
  updated_at: string;
}

// Enums
export enum Position {
  GOALKEEPER = "goalkeeper",
  DEFENDER = "defender",
  MIDFIELDER = "midfielder",
  FORWARD = "forward",
}

export enum TeamRole {
  OWNER = "owner", // 구단주
  MANAGER = "manager", // 운영진
  CAPTAIN = "captain", // 주장
  MEMBER = "member", // 일반멤버
}

export enum MemberStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export enum MatchStatus {
  SCHEDULED = "scheduled",
  ONGOING = "ongoing",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export enum AttendanceStatus {
  ATTENDING = "attending",
  NOT_ATTENDING = "not_attending",
  MAYBE = "maybe",
}
