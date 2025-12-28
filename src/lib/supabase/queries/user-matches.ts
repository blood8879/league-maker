import { supabase } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/types';

type Match = Database['public']['Tables']['matches']['Row'];
type Team = Database['public']['Tables']['teams']['Row'];
type MatchAttendance = Database['public']['Tables']['match_attendances']['Row'];

export interface UserMatch extends Match {
  homeTeam: Pick<Team, 'id' | 'name' | 'logo_url'>;
  awayTeam: Pick<Team, 'id' | 'name' | 'logo_url'>;
  myAttendance?: MatchAttendance;
  myTeamId: string;
}

export type MatchStatusFilter = 'all' | 'scheduled' | 'finished';
export type AttendanceFilter = 'all' | 'attending' | 'absent' | 'pending';

/**
 * 사용자의 경기 목록을 가져옵니다
 */
export async function getUserMatches(
  userId: string,
  statusFilter: MatchStatusFilter = 'all',
  attendanceFilter: AttendanceFilter = 'all'
): Promise<UserMatch[]> {
  // 1. 사용자가 속한 팀들 가져오기
  const { data: teamMembers } = await supabase
    .from('team_members')
    .select('team_id')
    .eq('user_id', userId);

  if (!teamMembers || teamMembers.length === 0) {
    return [];
  }

  const teamIds = teamMembers.map((tm: { team_id: string }) => tm.team_id);

  // 2. 기본 쿼리 생성
  let query = supabase
    .from('matches')
    .select(
      `
      *,
      homeTeam:home_team_id(id, name, logo_url),
      awayTeam:away_team_id(id, name, logo_url)
    `
    )
    .or(`home_team_id.in.(${teamIds.join(',')}),away_team_id.in.(${teamIds.join(',')})`)
    .order('match_date', { ascending: false })
    .order('match_time', { ascending: false });

  // 3. 상태 필터 적용
  if (statusFilter === 'scheduled') {
    query = query.eq('status', 'scheduled');
  } else if (statusFilter === 'finished') {
    query = query.eq('status', 'finished');
  }

  const { data: matches, error } = await query;

  if (error || !matches) {
    console.error('Failed to fetch user matches:', error);
    return [];
  }

  // 4. 참석 정보 가져오기
  const matchIds = matches.map((m: Match) => m.id);
  const { data: attendances } = await supabase
    .from('match_attendances')
    .select('*')
    .in('match_id', matchIds)
    .eq('user_id', userId);

  // 5. 데이터 결합
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let userMatches = matches.map((match: any) => {
    const homeTeam = Array.isArray(match.homeTeam) ? match.homeTeam[0] : match.homeTeam;
    const awayTeam = Array.isArray(match.awayTeam) ? match.awayTeam[0] : match.awayTeam;
    const myAttendance = attendances?.find((a: MatchAttendance) => a.match_id === match.id);
    const myTeamId = teamIds.find(
      (tid: string) => tid === match.home_team_id || tid === match.away_team_id
    )!;

    return {
      ...match,
      homeTeam,
      awayTeam,
      myAttendance,
      myTeamId,
    } as UserMatch;
  });

  // 6. 참석 필터 적용
  if (attendanceFilter !== 'all') {
    userMatches = userMatches.filter(
      (match: UserMatch) => match.myAttendance?.status === attendanceFilter
    );
  }

  return userMatches;
}
