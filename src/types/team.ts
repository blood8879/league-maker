export interface TeamStats {
  matchCount: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
}

export interface Member {
  id: string;
  name: string;
  avatar?: string;
  position: string;
  number: number;
  role: 'captain' | 'coach' | 'manager' | 'member';
}

export interface Team {
  id: string;
  name: string;
  logo?: string;
  region: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  memberCount: number;
  isRecruiting: boolean;
  tags: string[];
  description: string;
  foundedDate: string;
  activityDays: string[];
  stats: TeamStats;
  members: Member[];
}
