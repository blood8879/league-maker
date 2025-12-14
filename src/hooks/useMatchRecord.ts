import { useState, useCallback } from 'react';
import { MatchEvent, EventType, PlayerLineup, MatchScore, AttendanceStatus } from '@/types/match';

interface UseMatchRecordProps {
  initialEvents?: MatchEvent[];
  initialScore?: MatchScore;
  homeLineup: PlayerLineup[];
  awayLineup: PlayerLineup[];
  attendances: { playerId: string; status: AttendanceStatus }[];
}

export function useMatchRecord({
  initialEvents = [],
  initialScore = { home: 0, away: 0 },
  homeLineup,
  awayLineup,
  attendances,
}: UseMatchRecordProps) {
  const [events, setEvents] = useState<MatchEvent[]>(initialEvents);
  const [score, setScore] = useState<MatchScore>(initialScore);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<'home' | 'away' | null>(null);

  const getPlayerById = useCallback((playerId: string): PlayerLineup | null => {
    const allPlayers = [...homeLineup, ...awayLineup];
    return allPlayers.find(p => p.playerId === playerId) || null;
  }, [homeLineup, awayLineup]);

  const getPlayerName = useCallback((playerId: string): string => {
    const player = getPlayerById(playerId);
    return player?.name || '알 수 없음';
  }, [getPlayerById]);

  const isPlayerAttending = useCallback((playerId: string): boolean => {
    const attendance = attendances.find(a => a.playerId === playerId);
    return attendance?.status === 'attending';
  }, [attendances]);

  const getTeamPlayers = useCallback((teamId: 'home' | 'away'): PlayerLineup[] => {
    const players = teamId === 'home' ? homeLineup : awayLineup;
    return players.filter(p => isPlayerAttending(p.playerId));
  }, [homeLineup, awayLineup, isPlayerAttending]);

  const handlePlayerSelect = useCallback((playerId: string, teamId: 'home' | 'away') => {
    setSelectedPlayerId(playerId);
    setSelectedTeamId(teamId);
  }, []);

  const addEvent = useCallback((
    type: EventType,
    phase: 'first-half' | 'second-half',
    minute: number,
    teamId: string,
    data: {
      assistPlayerId?: string;
      reason?: string;
      outPlayerId?: string;
      inPlayerId?: string;
    }
  ) => {
    if (!selectedPlayerId) return;

    const newEvent: MatchEvent = {
      id: `event-${Date.now()}`,
      type,
      teamId,
      playerId: type === 'substitution' && data.outPlayerId ? data.outPlayerId : selectedPlayerId,
      minute,
      phase,
      relatedPlayerId: data.assistPlayerId || data.inPlayerId,
      reason: data.reason,
    };

    setEvents(prev => [...prev, newEvent]);

    // Update score for goals
    if (type === 'goal') {
      setScore(prev => ({
        home: teamId === 'home' ? prev.home + 1 : prev.home,
        away: teamId === 'away' ? prev.away + 1 : prev.away,
      }));
    }

    // Clear selection after adding event
    setSelectedPlayerId(null);
    setSelectedTeamId(null);
  }, [selectedPlayerId]);

  const updateEvent = useCallback((eventId: string, updates: Partial<MatchEvent>) => {
    setEvents(prev => prev.map(event =>
      event.id === eventId ? { ...event, ...updates } : event
    ));
  }, []);

  const deleteEvent = useCallback((eventId: string) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return;

    setEvents(prev => prev.filter(e => e.id !== eventId));

    // Update score if deleting a goal
    if (event.type === 'goal') {
      setScore(prev => ({
        home: event.teamId === 'home' ? Math.max(0, prev.home - 1) : prev.home,
        away: event.teamId === 'away' ? Math.max(0, prev.away - 1) : prev.away,
      }));
    }
  }, [events]);

  const getSelectedPlayer = useCallback((): PlayerLineup | null => {
    if (!selectedPlayerId) return null;
    return getPlayerById(selectedPlayerId);
  }, [selectedPlayerId, getPlayerById]);

  return {
    events,
    score,
    selectedPlayerId,
    selectedTeamId,
    handlePlayerSelect,
    addEvent,
    updateEvent,
    deleteEvent,
    getPlayerById,
    getPlayerName,
    isPlayerAttending,
    getTeamPlayers,
    getSelectedPlayer,
  };
}
