import { supabase } from '../client';
import type { Database } from '../types';

type Match = Database['public']['Tables']['matches']['Row'];
type MatchInsert = Database['public']['Tables']['matches']['Insert'];

/**
 * Get a single match by ID with team information
 */
export async function getMatchById(id: string) {
  const { data, error } = await supabase
    .from('matches')
    .select(`
      *,
      home_team:teams!matches_home_team_id_fkey(id, name, logo_url),
      away_team:teams!matches_away_team_id_fkey(id, name, logo_url)
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get all matches with optional filters
 */
export async function getMatches(params?: {
  teamId?: string;
  status?: 'scheduled' | 'live' | 'finished' | 'cancelled';
  limit?: number;
}) {
  let query = supabase
    .from('matches')
    .select(`
      *,
      home_team:teams!matches_home_team_id_fkey(id, name, logo_url),
      away_team:teams!matches_away_team_id_fkey(id, name, logo_url)
    `);

  if (params?.teamId) {
    query = query.or(`home_team_id.eq.${params.teamId},away_team_id.eq.${params.teamId}`);
  }

  if (params?.status) {
    query = query.eq('status', params.status);
  }

  query = query.order('match_date', { ascending: false });

  if (params?.limit) {
    query = query.limit(params.limit);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
}

/**
 * Create a new match
 */
export async function createMatch(match: MatchInsert) {
  const { data, error } = await supabase
    .from('matches')
    // @ts-expect-error - Supabase type inference issue
    .insert(match)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update a match
 */
export async function updateMatch(id: string, updates: Partial<Match>) {
  const { data, error } = await supabase
    .from('matches')
    // @ts-expect-error - Supabase type inference issue
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Delete a match
 */
export async function deleteMatch(id: string) {
  const { error } = await supabase
    .from('matches')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
