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
      teams: {
        Row: {
          id: string;
          name: string;
          logo_url: string | null;
          region: string;
          district: string | null;
          city: string | null;
          level: 'beginner' | 'intermediate' | 'advanced';
          description: string | null;
          founded_date: string | null;
          activity_days: Json | null;
          activity_time: string | null;
          home_ground: string | null;
          is_recruiting: boolean;
          member_limit: number;
          current_member_count: number;
          total_matches: number;
          wins: number;
          draws: number;
          losses: number;
          goals_for: number;
          goals_against: number;
          created_at: string;
          updated_at: string;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          name: string;
          logo_url?: string | null;
          region: string;
          district?: string | null;
          city?: string | null;
          level?: 'beginner' | 'intermediate' | 'advanced';
          description?: string | null;
          founded_date?: string | null;
          activity_days?: Json | null;
          activity_time?: string | null;
          home_ground?: string | null;
          is_recruiting?: boolean;
          member_limit?: number;
          current_member_count?: number;
          total_matches?: number;
          wins?: number;
          draws?: number;
          losses?: number;
          goals_for?: number;
          goals_against?: number;
          created_at?: string;
          updated_at?: string;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          name?: string;
          logo_url?: string | null;
          region?: string;
          district?: string | null;
          city?: string | null;
          level?: 'beginner' | 'intermediate' | 'advanced';
          description?: string | null;
          founded_date?: string | null;
          activity_days?: Json | null;
          activity_time?: string | null;
          home_ground?: string | null;
          is_recruiting?: boolean;
          member_limit?: number;
          current_member_count?: number;
          total_matches?: number;
          wins?: number;
          draws?: number;
          losses?: number;
          goals_for?: number;
          goals_against?: number;
          created_at?: string;
          updated_at?: string;
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
      matches: {
        Row: {
          id: string;
          type: 'league' | 'cup' | 'friendly' | 'practice';
          league_id: string | null;
          home_team_id: string;
          away_team_id: string;
          match_date: string;
          match_time: string;
          venue: string;
          venue_address: string | null;
          status: 'scheduled' | 'live' | 'finished' | 'cancelled';
          home_score: number;
          away_score: number;
          first_half_duration: number;
          second_half_duration: number;
          mercenary_recruitment_enabled: boolean;
          mercenary_positions: Json | null;
          mercenary_count: number;
          mercenary_level: string | null;
          notes: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
          started_at: string | null;
          finished_at: string | null;
        };
        Insert: {
          id?: string;
          type?: 'league' | 'cup' | 'friendly' | 'practice';
          league_id?: string | null;
          home_team_id: string;
          away_team_id: string;
          match_date: string;
          match_time: string;
          venue: string;
          venue_address?: string | null;
          status?: 'scheduled' | 'live' | 'finished' | 'cancelled';
          home_score?: number;
          away_score?: number;
          first_half_duration?: number;
          second_half_duration?: number;
          mercenary_recruitment_enabled?: boolean;
          mercenary_positions?: Json | null;
          mercenary_count?: number;
          mercenary_level?: string | null;
          notes?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
          started_at?: string | null;
          finished_at?: string | null;
        };
        Update: {
          id?: string;
          type?: 'league' | 'cup' | 'friendly' | 'practice';
          league_id?: string | null;
          home_team_id?: string;
          away_team_id?: string;
          match_date?: string;
          match_time?: string;
          venue?: string;
          venue_address?: string | null;
          status?: 'scheduled' | 'live' | 'finished' | 'cancelled';
          home_score?: number;
          away_score?: number;
          first_half_duration?: number;
          second_half_duration?: number;
          mercenary_recruitment_enabled?: boolean;
          mercenary_positions?: Json | null;
          mercenary_count?: number;
          mercenary_level?: string | null;
          notes?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
          started_at?: string | null;
          finished_at?: string | null;
        };
      };
      match_attendances: {
        Row: {
          id: string;
          match_id: string;
          user_id: string;
          team_id: string;
          status: 'attending' | 'absent' | 'pending';
          reason: string | null;
          is_starter: boolean;
          jersey_number: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          match_id: string;
          user_id: string;
          team_id: string;
          status?: 'attending' | 'absent' | 'pending';
          reason?: string | null;
          is_starter?: boolean;
          jersey_number?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          match_id?: string;
          user_id?: string;
          team_id?: string;
          status?: 'attending' | 'absent' | 'pending';
          reason?: string | null;
          is_starter?: boolean;
          jersey_number?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      mercenaries: {
        Row: {
          id: string;
          match_id: string;
          user_id: string;
          team_id: string;
          position: string;
          level: string;
          introduction: string;
          status: 'pending' | 'approved' | 'rejected';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          match_id: string;
          user_id: string;
          team_id: string;
          position: string;
          level: string;
          introduction: string;
          status?: 'pending' | 'approved' | 'rejected';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          match_id?: string;
          user_id?: string;
          team_id?: string;
          position?: string;
          level?: string;
          introduction?: string;
          status?: 'pending' | 'approved' | 'rejected';
          created_at?: string;
          updated_at?: string;
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
