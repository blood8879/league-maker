import { supabase } from '../client';
import type { Database } from '../types';

type MatchAttendance = Database['public']['Tables']['match_attendances']['Row'];
type MatchAttendanceInsert = Database['public']['Tables']['match_attendances']['Insert'];

/**
 * Get all attendances for a match
 */
export async function getMatchAttendances(matchId: string) {
  const { data, error } = await supabase
    .from('match_attendances')
    .select(`
      *,
      user:users!match_attendances_user_id_fkey(id, nickname, avatar_url, preferred_position)
    `)
    .eq('match_id', matchId);

  if (error) throw error;
  return data;
}

/**
 * Get attendance for a specific user and match
 */
export async function getUserAttendance(matchId: string, userId: string) {
  const { data, error } = await supabase
    .from('match_attendances')
    .select('*')
    .eq('match_id', matchId)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

/**
 * Upsert (insert or update) attendance for a user
 */
export async function upsertAttendance(attendance: {
  match_id: string;
  user_id: string;
  team_id: string;
  status: 'attending' | 'absent' | 'pending';
  jersey_number?: number | null;
  position?: string | null;
}) {
  const { data, error } = await supabase
    .from('match_attendances')
    // @ts-expect-error - Supabase type inference issue
    .upsert(
      {
        match_id: attendance.match_id,
        user_id: attendance.user_id,
        team_id: attendance.team_id,
        status: attendance.status,
        jersey_number: attendance.jersey_number,
        position: attendance.position,
      },
      {
        onConflict: 'match_id,team_id,user_id',
      }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Delete attendance
 */
export async function deleteAttendance(matchId: string, userId: string) {
  const { error } = await supabase
    .from('match_attendances')
    .delete()
    .eq('match_id', matchId)
    .eq('user_id', userId);

  if (error) throw error;
}
