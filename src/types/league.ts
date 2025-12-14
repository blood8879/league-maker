import { Team } from "./team";

export type MatchEventType = 'goal' | 'yellow_card' | 'red_card' | 'substitution';

export interface Standing {
  rank: number;
  teamId: string;
  teamName: string; // Helper for display
  matchesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export interface MatchAttendance {
  matchId: string;
  playerId: string;
  status: 'attending' | 'absent' | 'pending';
  updatedAt: string;
  reason?: string;
}

export interface Mercenary {
  id: string;
  matchId: string;
  playerId: string;
  position: string;
  level: string;
  introduction: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: string;
}

export interface MatchEvent {
  id: string;
  matchId: string;
  type: MatchEventType;
  time: number; // minutes
  teamId: string;
  playerId: string;
  playerName: string;
  assistPlayerId?: string;
  assistPlayerName?: string;
  subInPlayerId?: string; // For substitution
  subInPlayerName?: string;
  reason?: string; // For cards
}

export interface Lineup {
  matchId: string;
  teamId: string;
  starting: string[]; // Player IDs
  substitutes: string[]; // Player IDs
  formation?: string; // e.g. "4-4-2"
}

export interface MatchStats {
  homeShots: number;
  awayShots: number;
  homeFouls: number;
  awayFouls: number;
  homeCorners: number;
  awayCorners: number;
  homePossession?: number;
  awayPossession?: number;
}

export interface Match {
  id: string;
  type: 'league' | 'cup' | 'friendly' | 'practice';
  leagueId?: string;
  homeTeamId: string;
  homeTeamName: string;
  homeTeamLogo?: string;
  awayTeamId: string;
  awayTeamName: string;
  awayTeamLogo?: string;
  date: string;
  time: string;
  venue: string;
  status: 'scheduled' | 'live' | 'finished';
  score?: {
    home: number;
    away: number;
  };
  round?: number;
  
  // Mercenary Recruitment
  mercenaryRecruitment?: {
    enabled: boolean;
    positions: string[];
    count: number;
  };

  // Attendance & Mercenaries
  attendances?: MatchAttendance[];
  approvedMercenaries?: string[]; // IDs of approved mercenaries

  // Match Record
  events?: MatchEvent[];
  homeLineup?: Lineup;
  awayLineup?: Lineup;
  stats?: MatchStats;
}

export interface PlayerStats {
  rank: number;
  playerId: string;
  playerName: string;
  teamName: string;
  teamId: string;
  goals: number;
  assists: number;
  matchesPlayed: number;
}

export interface League {
  id: string;
  name: string;
  region: string;
  status: 'upcoming' | 'ongoing' | 'finished';
  level: string;
  startDate: string;
  endDate: string;
  description: string;
  rules: string[];
  teams: Team[]; // Participating teams
  standings: Standing[];
  matches: Match[];
  topScorers: PlayerStats[];
}
