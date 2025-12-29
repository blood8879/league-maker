import { supabase } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/types';

type Team = Database['public']['Tables']['teams']['Row'];

export interface UserTeamDetail extends Team {
  memberRole: 'captain' | 'coach' | 'manager' | 'member';
  position: string | null;
  jerseyNumber: number | null;
  joinedAt: string;
  teamMatches: number;
  teamGoals: number;
  teamAssists: number;
}

/**
 * 사용자가 속한 팀 목록을 가져옵니다
 */
export async function getUserTeams(userId: string): Promise<UserTeamDetail[]> {
  const { data: teamMembers, error } = await supabase
    .from('team_members')
    .select(
      `
      role,
      position,
      jersey_number,
      joined_at,
      team_matches,
      team_goals,
      team_assists,
      teams:team_id(*)
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
    const team = Array.isArray(tm.teams) ? tm.teams[0] : tm.teams;
    return {
      ...team,
      memberRole: tm.role,
      position: tm.position,
      jerseyNumber: tm.jersey_number,
      joinedAt: tm.joined_at,
      teamMatches: tm.team_matches,
      teamGoals: tm.team_goals,
      teamAssists: tm.team_assists,
    } as UserTeamDetail;
  });
}

/**
 * 팀에서 탈퇴합니다
 */
export async function leaveTeam(userId: string, teamId: string): Promise<boolean> {
  // 1. 먼저 주장인지 확인
  // @ts-ignore - Supabase type system limitation with generic table types
  const { data: member } = await supabase.from('team_members').select('role').eq('user_id', userId).eq('team_id', teamId).single() as { data: { role: string } | null };

  if (!member) {
    console.error('Team member not found');
    return false;
  }

  if (member.role === 'captain') {
    console.error('Captain cannot leave the team');
    return false;
  }

  // 2. 팀 멤버에서 삭제
  const { error } = await supabase
    .from('team_members')
    .delete()
    .eq('user_id', userId)
    .eq('team_id', teamId);

  if (error) {
    console.error('Failed to leave team:', error);
    return false;
  }

  return true;
}
