export interface User {
  id: string;
  email: string;
  nickname: string;
  avatar?: string;
  role: 'player' | 'coach' | 'manager';
  position?: string;
  teamIds: string[];
  stats: {
    matchCount: number;
    attendanceRate: number; // 0-100
    goals: number;
    assists: number;
    yellowCards: number;
    redCards: number;
  };
}

export interface AuthContextType {
  user: User | null;
  login: (email: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  isLoading: boolean;
}
