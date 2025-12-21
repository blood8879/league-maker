export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          nickname: string;
          avatar_url: string | null;
          role: 'player' | 'coach' | 'manager';
          bio: string | null;
          phone: string | null;
          preferred_position: 'FW' | 'MF' | 'DF' | 'GK' | null;
          total_matches: number;
          total_goals: number;
          total_assists: number;
          total_yellow_cards: number;
          total_red_cards: number;
          attendance_rate: number;
          created_at: string;
          updated_at: string;
          last_login_at: string | null;
          is_active: boolean;
        };
        Insert: {
          id: string;
          email: string;
          nickname: string;
          avatar_url?: string | null;
          role?: 'player' | 'coach' | 'manager';
          bio?: string | null;
          phone?: string | null;
          preferred_position?: 'FW' | 'MF' | 'DF' | 'GK' | null;
          total_matches?: number;
          total_goals?: number;
          total_assists?: number;
          total_yellow_cards?: number;
          total_red_cards?: number;
          attendance_rate?: number;
          created_at?: string;
          updated_at?: string;
          last_login_at?: string | null;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          email?: string;
          nickname?: string;
          avatar_url?: string | null;
          role?: 'player' | 'coach' | 'manager';
          bio?: string | null;
          phone?: string | null;
          preferred_position?: 'FW' | 'MF' | 'DF' | 'GK' | null;
          total_matches?: number;
          total_goals?: number;
          total_assists?: number;
          total_yellow_cards?: number;
          total_red_cards?: number;
          attendance_rate?: number;
          created_at?: string;
          updated_at?: string;
          last_login_at?: string | null;
          is_active?: boolean;
        };
      };
      team_members: {
        Row: {
          id: string;
          team_id: string;
          user_id: string;
          role: 'captain' | 'vice_captain' | 'member';
          position: string | null;
          jersey_number: number | null;
          joined_at: string;
          is_registered: boolean;
          team_matches: number;
          team_goals: number;
          team_assists: number;
        };
        Insert: {
          id?: string;
          team_id: string;
          user_id: string;
          role?: 'captain' | 'vice_captain' | 'member';
          position?: string | null;
          jersey_number?: number | null;
          joined_at?: string;
          is_registered?: boolean;
          team_matches?: number;
          team_goals?: number;
          team_assists?: number;
        };
        Update: {
          id?: string;
          team_id?: string;
          user_id?: string;
          role?: 'captain' | 'vice_captain' | 'member';
          position?: string | null;
          jersey_number?: number | null;
          joined_at?: string;
          is_registered?: boolean;
          team_matches?: number;
          team_goals?: number;
          team_assists?: number;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
