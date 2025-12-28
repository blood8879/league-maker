import { supabase } from '../client';
import type { Database } from '../types';

type MatchEvent = Database['public']['Tables']['match_events']['Row'];

/**
 * Get finished match details with teams and score
 */
export async function getFinishedMatchDetails(id: string) {
  const { data, error } = await supabase
    .from('matches')
    .select(`
      *,
      home_team:teams!matches_home_team_id_fkey(
        id,
        name,
        logo_url
      ),
      away_team:teams!matches_away_team_id_fkey(
        id,
        name,
        logo_url
      )
    `)
    .eq('id', id)
    .eq('status', 'finished')
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get all match events (goals, cards, substitutions) ordered by time
 */
export async function getMatchEvents(matchId: string) {
  const { data, error } = await supabase
    .from('match_events')
    .select(`
      *,
      player:users!match_events_player_id_fkey(
        id,
        nickname,
        avatar_url
      ),
      related_player:users!match_events_related_player_id_fkey(
        id,
        nickname,
        avatar_url
      ),
      team:teams!match_events_team_id_fkey(
        id,
        name,
        logo_url
      )
    `)
    .eq('match_id', matchId)
    .order('minute', { ascending: true });

  if (error) throw error;
  return data || [];
}

/**
 * Get match lineup for a specific team
 */
export async function getMatchLineup(matchId: string, teamId: string) {
  const { data, error } = await supabase
    .from('match_attendances')
    .select(`
      *,
      user:users!match_attendances_user_id_fkey(
        id,
        nickname,
        avatar_url,
        preferred_position
      )
    `)
    .eq('match_id', matchId)
    .eq('team_id', teamId)
    .eq('status', 'attending')
    .order('is_starter', { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * Get all attendance for a match
 */
export async function getMatchAttendance(matchId: string) {
  const { data, error } = await supabase
    .from('match_attendances')
    .select(`
      *,
      user:users!match_attendances_user_id_fkey(
        id,
        nickname,
        avatar_url
      ),
      team:teams!match_attendances_team_id_fkey(
        id,
        name
      )
    `)
    .eq('match_id', matchId)
    .order('status', { ascending: true });

  if (error) throw error;
  return data || [];
}

/**
 * Get approved mercenaries for a match
 */
export async function getMatchMercenaries(matchId: string) {
  const { data, error } = await supabase
    .from('mercenary_applications')
    .select(`
      *,
      user:users!mercenary_applications_user_id_fkey(
        id,
        nickname,
        avatar_url
      )
    `)
    .eq('match_id', matchId)
    .eq('status', 'approved');

  if (error) throw error;
  return data || [];
}

/**
 * Get player statistics for a match
 */
export async function getMatchPlayerStats(matchId: string, playerId: string) {
  const { data, error } = await supabase
    .from('match_events')
    .select('event_type, team_id, player_id, related_player_id')
    .eq('match_id', matchId);

  if (error) throw error;

  // Calculate stats from events
  const events = (data as MatchEvent[]) || [];
  const stats = {
    goals: events.filter(
      (e) => e.event_type === 'goal' && e.player_id === playerId
    ).length,
    assists: events.filter(
      (e) => e.event_type === 'goal' && e.related_player_id === playerId
    ).length,
    yellowCards: events.filter(
      (e) => e.event_type === 'yellow_card' && e.player_id === playerId
    ).length,
    redCards: events.filter(
      (e) => e.event_type === 'red_card' && e.player_id === playerId
    ).length,
  };

  return stats;
}

/**
 * Get MVP candidates (top scorer and top assister)
 */
export async function getMatchMVP(matchId: string) {
  const eventsData = await getMatchEvents(matchId);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const events = eventsData as any[];

  type PlayerStat = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    player: any;
    goals: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    team: any;
  };

  type AssistStat = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    player: any;
    assists: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    team: any;
  };

  // Count goals per player
  const goalsByPlayer = events
    .filter((e) => e.event_type === 'goal')
    .reduce((acc, event) => {
      const playerId = event.player_id;
      if (!acc[playerId]) {
        acc[playerId] = {
          player: event.player,
          goals: 0,
          team: event.team,
        };
      }
      acc[playerId].goals += 1;
      return acc;
    }, {} as Record<string, PlayerStat>);

  // Count assists per player (related_player_id on goal events)
  const assistsByPlayer = events
    .filter((e) => e.event_type === 'goal' && e.related_player_id)
    .reduce((acc, event) => {
      const playerId = event.related_player_id;
      if (!playerId) return acc;
      if (!acc[playerId]) {
        acc[playerId] = {
          player: event.related_player,
          assists: 0,
          team: event.team,
        };
      }
      acc[playerId].assists += 1;
      return acc;
    }, {} as Record<string, AssistStat>);

  // Find top scorer
  const topScorer = Object.values(goalsByPlayer).sort(
    (a: PlayerStat, b: PlayerStat) => b.goals - a.goals
  )[0];

  // Find top assister
  const topAssister = Object.values(assistsByPlayer).sort(
    (a: AssistStat, b: AssistStat) => b.assists - a.assists
  )[0];

  return {
    topScorer: topScorer || null,
    topAssister: topAssister || null,
  };
}
