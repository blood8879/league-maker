import { supabase } from '../client';
import type { Database } from '../types';

type MercenaryApplication = Database['public']['Tables']['mercenary_applications']['Row'];

/**
 * Get all mercenary applications for a match
 */
export async function getMercenaryApplications(matchId: string) {
  const { data, error } = await supabase
    .from('mercenary_applications')
    .select(`
      *,
      user:users!mercenary_applications_user_id_fkey(id, nickname, avatar_url, preferred_position)
    `)
    .eq('match_id', matchId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Get mercenary application for a specific user and match
 */
export async function getUserMercenaryApplication(matchId: string, userId: string) {
  const { data, error } = await supabase
    .from('mercenary_applications')
    .select('*')
    .eq('match_id', matchId)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

/**
 * Create a mercenary application
 */
export async function createMercenaryApplication(application: {
  match_id: string;
  team_id: string;
  user_id: string;
  position: string;
  message?: string | null;
}) {
  const { data, error } = await supabase
    .from('mercenary_applications')
    // @ts-expect-error - Supabase type inference issue
    .insert(application)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Update mercenary application status
 */
export async function updateMercenaryApplicationStatus(
  id: string,
  status: 'pending' | 'approved' | 'rejected'
) {
  const { data, error } = await supabase
    .from('mercenary_applications')
    // @ts-expect-error - Supabase type inference issue
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Delete mercenary application
 */
export async function deleteMercenaryApplication(id: string) {
  const { error } = await supabase
    .from('mercenary_applications')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
