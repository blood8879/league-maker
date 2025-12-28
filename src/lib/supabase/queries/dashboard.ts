import { supabase } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/types';

type Match = Database['public']['Tables']['matches']['Row'];
type Team = Database['public']['Tables']['teams']['Row'];
type MatchAttendance = Database['public']['Tables']['match_attendances']['Row'];

export interface DashboardStats {
  totalMatches: number;
  totalGoals: number;
  totalAssists: number;
  attendanceRate: number;
}

export interface UpcomingMatch extends Match {
  homeTeam: Pick<Team, 'id' | 'name' | 'logo_url'>;
  awayTeam: Pick<Team, 'id' | 'name' | 'logo_url'>;
  myAttendance?: MatchAttendance;
}

export interface UserTeam extends Team {
  memberRole: 'captain' | 'vice_captain' | 'member';
  joinedAt: string;
}

/**
 * 사용자의 대시보드 통계를 가져옵니다
 */
export async function getUserDashboardStats(userId: string): Promise<DashboardStats | null> {
  const { data: user, error } = await supabase
    .from('users')
    .select('total_matches, total_goals, total_assists, attendance_rate')
    .eq('id', userId)
    .single();

  if (error || !user) {
    console.error('Failed to fetch user stats:', error);
    return null;
  }

  const userData = user as {
    total_matches: number;
    total_goals: number;
    total_assists: number;
    attendance_rate: number;
  };

  return {
    totalMatches: userData.total_matches,
    totalGoals: userData.total_goals,
    totalAssists: userData.total_assists,
    attendanceRate: userData.attendance_rate,
  };
}

/**
 * 사용자의 다가오는 경기 목록을 가져옵니다
 */
export async function getUpcomingMatches(userId: string, limit = 5): Promise<UpcomingMatch[]> {
  // 1. 사용자가 속한 팀들 가져오기
  const { data: teamMembers } = await supabase
    .from('team_members')
    .select('team_id')
    .eq('user_id', userId);

  if (!teamMembers || teamMembers.length === 0) {
    return [];
  }

  const teamIds = teamMembers.map((tm: { team_id: string }) => tm.team_id);

  // 2. 해당 팀들의 예정된 경기 가져오기
  const { data: matches, error } = await supabase
    .from('matches')
    .select(
      `
      *,
      homeTeam:home_team_id(id, name, logo_url),
      awayTeam:away_team_id(id, name, logo_url)
    `
    )
    .or(`home_team_id.in.(${teamIds.join(',')}),away_team_id.in.(${teamIds.join(',')})`)
    .eq('status', 'scheduled')
    .gte('match_date', new Date().toISOString().split('T')[0])
    .order('match_date', { ascending: true })
    .order('match_time', { ascending: true })
    .limit(limit);

  if (error || !matches) {
    console.error('Failed to fetch upcoming matches:', error);
    return [];
  }

  // 3. 각 경기에 대한 참석 정보 가져오기
  const matchIds = matches.map((m: Match) => m.id);
  const { data: attendances } = await supabase
    .from('match_attendances')
    .select('*')
    .in('match_id', matchIds)
    .eq('user_id', userId);

  // 4. 데이터 결합
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return matches.map((match: any) => ({
    ...match,
    homeTeam: Array.isArray(match.homeTeam) ? match.homeTeam[0] : match.homeTeam,
    awayTeam: Array.isArray(match.awayTeam) ? match.awayTeam[0] : match.awayTeam,
    myAttendance: attendances?.find((a: MatchAttendance) => a.match_id === match.id),
  })) as UpcomingMatch[];
}

/**
 * 사용자의 참석 대기중인 경기 목록을 가져옵니다 (status = pending)
 */
export async function getPendingMatches(userId: string): Promise<UpcomingMatch[]> {
  // 1. 참석 상태가 pending인 경기 ID들 가져오기
  const { data: pendingAttendances } = await supabase
    .from('match_attendances')
    .select('match_id, team_id, status, reason')
    .eq('user_id', userId)
    .eq('status', 'pending');

  if (!pendingAttendances || pendingAttendances.length === 0) {
    return [];
  }

  const matchIds = pendingAttendances.map((a: MatchAttendance) => a.match_id);

  // 2. 경기 정보 가져오기
  const { data: matches, error } = await supabase
    .from('matches')
    .select(
      `
      *,
      homeTeam:home_team_id(id, name, logo_url),
      awayTeam:away_team_id(id, name, logo_url)
    `
    )
    .in('id', matchIds)
    .eq('status', 'scheduled')
    .order('match_date', { ascending: true })
    .order('match_time', { ascending: true });

  if (error || !matches) {
    console.error('Failed to fetch pending matches:', error);
    return [];
  }

  // 3. 데이터 결합
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return matches.map((match: any) => ({
    ...match,
    homeTeam: Array.isArray(match.homeTeam) ? match.homeTeam[0] : match.homeTeam,
    awayTeam: Array.isArray(match.awayTeam) ? match.awayTeam[0] : match.awayTeam,
    myAttendance: pendingAttendances.find((a: MatchAttendance) => a.match_id === match.id),
  })) as UpcomingMatch[];
}

/**
 * 사용자의 팀 목록을 가져옵니다
 */
export async function getUserTeams(userId: string): Promise<UserTeam[]> {
  const { data: teamMembers, error } = await supabase
    .from('team_members')
    .select(
      `
      role,
      joined_at,
      team_id(*)
    `
    )
    .eq('user_id', userId)
    .order('joined_at', { ascending: false });

  if (error || !teamMembers) {
    console.error('Failed to fetch user teams:', error);
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return teamMembers.map((tm: any) => {
    const team = Array.isArray(tm.team_id) ? tm.team_id[0] : tm.team_id;
    return {
      ...team,
      memberRole: tm.role,
      joinedAt: tm.joined_at,
    } as UserTeam;
  });
}
