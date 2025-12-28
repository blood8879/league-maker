import { supabase } from '../client';
import type { Database } from '../types';

type Team = Database['public']['Tables']['teams']['Row'];
type TeamInsert = Database['public']['Tables']['teams']['Insert'];
type TeamMember = Database['public']['Tables']['team_members']['Row'];

export interface TeamWithMembers extends Team {
  members: TeamMember[];
}

/**
 * Get all teams with optional filters and sorting
 */
export async function getTeams(params?: {
  search?: string;
  region?: string;
  level?: string;
  sortBy?: 'latest' | 'popular' | 'members';
}) {
  let query = supabase
    .from('teams')
    .select('*')
    .eq('is_active', true);

  // Apply filters
  if (params?.search) {
    query = query.ilike('name', `%${params.search}%`);
  }
  if (params?.region && params.region !== 'all') {
    query = query.eq('region', params.region);
  }
  if (params?.level && params.level !== 'all') {
    query = query.eq('level', params.level);
  }

  // Apply sorting
  if (params?.sortBy === 'latest') {
    query = query.order('founded_date', { ascending: false, nullsFirst: false });
  } else if (params?.sortBy === 'popular') {
    query = query.order('total_matches', { ascending: false });
  } else if (params?.sortBy === 'members') {
    query = query.order('current_member_count', { ascending: false });
  } else {
    query = query.order('created_at', { ascending: false });
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
}

/**
 * Get a single team by ID
 */
export async function getTeamById(id: string) {
  const { data, error } = await supabase
    .from('teams')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get team with members
 */
export async function getTeamWithMembers(id: string) {
  const { data: team, error: teamError } = await supabase
    .from('teams')
    .select('*')
    .eq('id', id)
    .single();

  if (teamError) throw teamError;
  if (!team) return null;

  const { data: members, error: membersError } = await supabase
    .from('team_members')
    .select(`
      *,
      user:users(id, nickname)
    `)
    .eq('team_id', id)
    .order('role', { ascending: true })
    .order('jersey_number', { ascending: true });

  if (membersError) throw membersError;

  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...(team as any),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    members: (members || []).map((member: any) => ({
      id: member.id,
      name: member.user?.nickname || 'Unknown',
      avatar: undefined,
      position: member.position || '-',
      number: member.jersey_number || 0,
      role: member.role as 'captain' | 'vice_captain' | 'member',
    })),
  };
}

/**
 * Get recent matches for a team
 */
export async function getTeamRecentMatches(teamId: string, limit: number = 5) {
  const { data, error } = await supabase
    .from('matches')
    .select(`
      *,
      home_team:teams!matches_home_team_id_fkey(id, name, logo_url),
      away_team:teams!matches_away_team_id_fkey(id, name, logo_url)
    `)
    .or(`home_team_id.eq.${teamId},away_team_id.eq.${teamId}`)
    .eq('status', 'finished')
    .order('match_date', { ascending: false })
    .limit(limit);

  if (error) throw error;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data || []).map((match: any) => ({
    id: match.id,
    type: match.type,
    homeTeamId: match.home_team_id,
    awayTeamId: match.away_team_id,
    homeTeamName: match.home_team?.name || '',
    awayTeamName: match.away_team?.name || '',
    homeTeamLogo: match.home_team?.logo_url,
    awayTeamLogo: match.away_team?.logo_url,
    date: match.match_date,
    time: match.match_time,
    venue: match.venue,
    status: match.status as 'scheduled' | 'live' | 'finished' | 'cancelled',
    score: {
      home: match.home_score,
      away: match.away_score,
    },
  }));
}

/**
 * Create a new team
 */
export async function createTeam(team: TeamInsert): Promise<Team> {
  // @ts-ignore - Supabase type system limitation with generic table types
  const { data, error } = await supabase.from('teams').insert(team as any).select().single();

  if (error) throw error;
  return data as Team;
}

/**
 * Update a team
 */
export async function updateTeam(id: string, updates: Partial<TeamInsert>) {
  // @ts-ignore - Supabase type system limitation with generic table types
  const { data, error } = await supabase.from('teams').update(updates).eq('id', id).select().single();

  if (error) throw error;
  return data;
}

/**
 * Delete a team
 */
export async function deleteTeam(id: string) {
  const { error } = await supabase
    .from('teams')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

/**
 * Check if user is a member of a team
 */
export async function isUserTeamMember(teamId: string, userId: string | null | undefined): Promise<boolean> {
  if (!userId) return false;

  const { data, error } = await supabase
    .from('team_members')
    .select('id')
    .eq('team_id', teamId)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('Failed to check team membership:', error);
    return false;
  }

  return !!data;
}

/**
 * Add a member to a team
 */
export async function addTeamMember(params: {
  team_id: string;
  user_id: string;
  role: 'captain' | 'vice_captain' | 'member';
  position?: string;
  jersey_number?: number;
}) {
  // @ts-ignore - Supabase type system limitation with generic table types
  const { data, error } = await supabase.from('team_members').insert({ team_id: params.team_id, user_id: params.user_id, role: params.role, position: params.position ?? null, jersey_number: params.jersey_number ?? null }).select().single();

  if (error) throw error;
  return data;
}
