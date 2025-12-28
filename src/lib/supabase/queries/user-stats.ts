import { supabase } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/types';

type Team = Database['public']['Tables']['teams']['Row'];

export interface UserStats {
  totalMatches: number;
  totalGoals: number;
  totalAssists: number;
  totalYellowCards: number;
  totalRedCards: number;
  attendanceRate: number;
}

export interface TeamStats {
  team: Pick<Team, 'id' | 'name' | 'logo_url'>;
  matches: number;
  goals: number;
  assists: number;
}

export interface AttendanceStats {
  total: number;
  attended: number;
  absent: number;
  pending: number;
  attendanceRate: number;
}

/**
 * 사용자의 전체 통계를 가져옵니다
 */
export async function getUserStats(userId: string): Promise<UserStats | null> {
  const { data: user, error } = await supabase
    .from('users')
    .select(
      'total_matches, total_goals, total_assists, total_yellow_cards, total_red_cards, attendance_rate'
    )
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
    total_yellow_cards: number;
    total_red_cards: number;
    attendance_rate: number;
  };

  return {
    totalMatches: userData.total_matches,
    totalGoals: userData.total_goals,
    totalAssists: userData.total_assists,
    totalYellowCards: userData.total_yellow_cards,
    totalRedCards: userData.total_red_cards,
    attendanceRate: userData.attendance_rate,
  };
}

/**
 * 사용자의 팀별 통계를 가져옵니다
 */
export async function getTeamStats(userId: string): Promise<TeamStats[]> {
  const { data: teamMembers } = await supabase
    .from('team_members')
    .select(
      `
      team_id,
      team_matches,
      team_goals,
      team_assists,
      teams:team_id(id, name, logo_url)
    `
    )
    .eq('user_id', userId);

  if (!teamMembers || teamMembers.length === 0) {
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return teamMembers.map((tm: any) => {
    const team = Array.isArray(tm.teams) ? tm.teams[0] : tm.teams;
    return {
      team: {
        id: team.id,
        name: team.name,
        logo_url: team.logo_url,
      },
      matches: tm.team_matches,
      goals: tm.team_goals,
      assists: tm.team_assists,
    } as TeamStats;
  });
}

/**
 * 사용자의 참석률 통계를 가져옵니다
 */
export async function getAttendanceStats(userId: string): Promise<AttendanceStats> {
  // 1. 사용자가 속한 팀들 가져오기
  const { data: teamMembers } = await supabase
    .from('team_members')
    .select('team_id')
    .eq('user_id', userId);

  if (!teamMembers || teamMembers.length === 0) {
    return {
      total: 0,
      attended: 0,
      absent: 0,
      pending: 0,
      attendanceRate: 0,
    };
  }

  const teamIds = teamMembers.map((tm: { team_id: string }) => tm.team_id);

  // 2. 해당 팀들의 모든 경기 수 계산
  const { count: totalMatches } = await supabase
    .from('matches')
    .select('*', { count: 'exact', head: true })
    .or(`home_team_id.in.(${teamIds.join(',')}),away_team_id.in.(${teamIds.join(',')})`)
    .in('status', ['finished', 'scheduled']);

  // 3. 참석 정보 가져오기
  const { data: attendances } = await supabase
    .from('match_attendances')
    .select('status')
    .eq('user_id', userId);

  const attended = attendances?.filter((a: { status: string }) => a.status === 'attending').length || 0;
  const absent = attendances?.filter((a: { status: string }) => a.status === 'absent').length || 0;
  const pending = attendances?.filter((a: { status: string }) => a.status === 'pending').length || 0;
  const total = totalMatches || 0;
  const attendanceRate = total > 0 ? Math.round((attended / total) * 100) : 0;

  return {
    total,
    attended,
    absent,
    pending,
    attendanceRate,
  };
}

/**
 * 사용자의 시즌별 통계를 가져옵니다
 */
export async function getSeasonStats(userId: string, year?: number): Promise<UserStats | null> {
  // 기본적으로 올해
  const targetYear = year || new Date().getFullYear();
  const startDate = `${targetYear}-01-01`;
  const endDate = `${targetYear}-12-31`;

  // 1. 해당 기간의 경기 가져오기
  const { data: teamMembers } = await supabase
    .from('team_members')
    .select('team_id')
    .eq('user_id', userId);

  if (!teamMembers || teamMembers.length === 0) {
    return null;
  }

  const teamIds = teamMembers.map((tm: { team_id: string }) => tm.team_id);

  const { data: matches } = await supabase
    .from('matches')
    .select('id')
    .or(`home_team_id.in.(${teamIds.join(',')}),away_team_id.in.(${teamIds.join(',')})`)
    .gte('match_date', startDate)
    .lte('match_date', endDate)
    .eq('status', 'finished');

  if (!matches || matches.length === 0) {
    return {
      totalMatches: 0,
      totalGoals: 0,
      totalAssists: 0,
      totalYellowCards: 0,
      totalRedCards: 0,
      attendanceRate: 0,
    };
  }

  const matchIds = matches.map((m: { id: string }) => m.id);

  // 2. 참석 정보 가져오기
  const { data: attendances } = await supabase
    .from('match_attendances')
    .select('status')
    .in('match_id', matchIds)
    .eq('user_id', userId);

  const attended = attendances?.filter((a: { status: string }) => a.status === 'attending').length || 0;

  // 3. 경기 이벤트에서 골/어시스트/카드 집계
  const { data: events } = await supabase
    .from('match_events')
    .select('event_type')
    .in('match_id', matchIds)
    .eq('player_id', userId);

  const goals = events?.filter((e: { event_type: string }) => e.event_type === 'goal').length || 0;
  const yellowCards =
    events?.filter((e: { event_type: string }) => e.event_type === 'yellow_card').length || 0;
  const redCards =
    events?.filter((e: { event_type: string }) => e.event_type === 'red_card').length || 0;

  // 어시스트는 related_player_id가 userId인 goal 이벤트
  const { data: assistEvents } = await supabase
    .from('match_events')
    .select('event_type')
    .in('match_id', matchIds)
    .eq('event_type', 'goal')
    .eq('related_player_id', userId);

  const assists = assistEvents?.length || 0;

  return {
    totalMatches: matches.length,
    totalGoals: goals,
    totalAssists: assists,
    totalYellowCards: yellowCards,
    totalRedCards: redCards,
    attendanceRate: matches.length > 0 ? Math.round((attended / matches.length) * 100) : 0,
  };
}
