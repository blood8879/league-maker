import { supabase } from '../client';
import type { Database } from '../types';

type Mercenary = Database['public']['Tables']['mercenaries']['Row'];
type MercenaryInsert = Database['public']['Tables']['mercenaries']['Insert'];

/**
 * Get all mercenary applications for a match
 */
export async function getMatchMercenaries(matchId: string) {
  const { data, error } = await supabase
    .from('mercenaries')
    .select(`
      *,
      user:users!mercenaries_user_id_fkey(id, nickname, avatar_url, preferred_position)
    `)
    .eq('match_id', matchId)
    .order('created_at', { ascending: false});

  if (error) throw error;
  return data;
}

/**
 * Get mercenaries by status for a match
 */
export async function getMercenariesByStatus(matchId: string, status: 'pending' | 'approved' | 'rejected') {
  const { data, error } = await supabase
    .from('mercenaries')
    .select(`
      *,
      user:users!mercenaries_user_id_fkey(id, nickname, avatar_url)
    `)
    .eq('match_id', matchId)
    .eq('status', status)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Get mercenary application for a specific user and match
 */
export async function getUserMercenaryApplication(matchId: string, userId: string) {
  const { data, error } = await supabase
    .from('mercenaries')
    .select('*')
    .eq('match_id', matchId)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

/**
 * Apply as a mercenary for a match
 */
export async function applyMercenary(mercenary: MercenaryInsert) {
  const { data, error } = await supabase
    .from('mercenaries')
    // @ts-expect-error - Supabase type inference issue
    .insert(mercenary)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Approve a mercenary application
 */
export async function approveMercenary(id: string) {
  const { data, error } = await supabase
    .from('mercenaries')
    // @ts-expect-error - Supabase type inference issue
    .update({ status: 'approved' })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Reject a mercenary application
 */
export async function rejectMercenary(id: string) {
  const { data, error } = await supabase
    .from('mercenaries')
    // @ts-expect-error - Supabase type inference issue
    .update({ status: 'rejected' })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get all approved mercenaries for a match
 */
export async function getApprovedMercenaries(matchId: string) {
  const { data, error} = await supabase
    .from('mercenaries')
    .select(`
      *,
      user:users!mercenaries_user_id_fkey(id, nickname, avatar_url, preferred_position)
    `)
    .eq('match_id', matchId)
    .eq('status', 'approved')
    .order('position');

  if (error) throw error;
  return data;
}
