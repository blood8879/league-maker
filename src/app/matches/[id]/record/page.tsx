'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Scoreboard } from '@/components/matches/record/Scoreboard';
import { PlayerSelector } from '@/components/matches/record/PlayerSelector';
import { QuickActionButtons } from '@/components/matches/record/QuickActionButtons';
import { EventTimeline } from '@/components/matches/record/EventTimeline';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface PageProps {
  params: Promise<{ id: string }>;
}

interface MatchData {
  id: string;
  type: string;
  home_team_id: string;
  away_team_id: string;
  match_date: string;
  match_time: string;
  venue: string;
  status: 'scheduled' | 'live' | 'finished';
  home_score: number;
  away_score: number;
  first_half_duration: number;
  second_half_duration: number;
  teams_home: {
    id: string;
    name: string;
    logo_url: string | null;
  };
  teams_away: {
    id: string;
    name: string;
    logo_url: string | null;
  };
}

interface Player {
  id: string;
  user_id: string;
  users: {
    nickname: string;
    avatar_url: string | null;
    preferred_position: string | null;
  };
  jersey_number: number | null;
  position: string | null;
  is_mercenary: boolean;
}

interface MatchEvent {
  id: string;
  event_type: 'goal' | 'yellow_card' | 'red_card' | 'substitution';
  team_id: string;
  player_id: string;
  minute: number;
  half: 'first' | 'second';
  related_player_id: string | null;
  description: string | null;
  player_name: string;
  related_player_name?: string;
}

export default function MatchRecordPage({ params }: PageProps) {
  const router = useRouter();
  const { id: matchId } = use(params);

  const [match, setMatch] = useState<MatchData | null>(null);
  const [homePlayers, setHomePlayers] = useState<Player[]>([]);
  const [awayPlayers, setAwayPlayers] = useState<Player[]>([]);
  const [events, setEvents] = useState<MatchEvent[]>([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [currentMinute, setCurrentMinute] = useState(0);
  const [currentHalf, setCurrentHalf] = useState<'first' | 'second'>('first');
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch match data
  useEffect(() => {
    async function fetchMatchData() {
      try {
        const { data: matchData, error: matchError } = await supabase
          .from('matches')
          .select(`
            *,
            teams_home:teams!home_team_id(id, name, logo_url),
            teams_away:teams!away_team_id(id, name, logo_url)
          `)
          .eq('id', matchId)
          .single();

        if (matchError) throw matchError;
        setMatch(matchData as unknown as MatchData);

        // Fetch attending players for both teams
        const { data: attendances, error: attendanceError } = await supabase
          .from('match_attendances')
          .select(`
            id,
            user_id,
            jersey_number,
            position,
            team_id,
            users!match_attendances_user_id_fkey(
              nickname,
              avatar_url,
              preferred_position
            )
          `)
          .eq('match_id', matchId)
          .eq('status', 'attending');

        if (attendanceError) throw attendanceError;

        const home = (attendances || [])
          .filter((a: Player) => a.id.includes(matchData.home_team_id))
          .map((a: Player) => ({ ...a, is_mercenary: false }));

        const away = (attendances || [])
          .filter((a: Player) => a.id.includes(matchData.away_team_id))
          .map((a: Player) => ({ ...a, is_mercenary: false }));

        setHomePlayers(home);
        setAwayPlayers(away);

        // Fetch existing events
        await fetchEvents();
      } catch (error) {
        console.error('Error fetching match data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchMatchData();
  }, [matchId]);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('match_events')
        .select('*')
        .eq('match_id', matchId)
        .order('minute', { ascending: false });

      if (error) throw error;

      const eventsWithNames = (data || []).map((event) => {
        const allPlayers = [...homePlayers, ...awayPlayers];
        const player = allPlayers.find((p) => p.user_id === event.player_id);
        const relatedPlayer = event.related_player_id
          ? allPlayers.find((p) => p.user_id === event.related_player_id)
          : null;

        return {
          ...event,
          player_name: player?.users.nickname || 'Unknown',
          related_player_name: relatedPlayer?.users.nickname,
        };
      });

      setEvents(eventsWithNames);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleRecordGoal = async (
    playerId: string,
    teamId: string,
    minute: number,
    half: 'first' | 'second',
    assistId?: string
  ) => {
    try {
      const { error } = await supabase.from('match_events').insert({
        match_id: matchId,
        event_type: 'goal',
        team_id: teamId,
        player_id: playerId,
        minute,
        half,
        related_player_id: assistId || null,
        is_mercenary: false,
      });

      if (error) throw error;

      // Update match score
      const scoreField = teamId === match?.home_team_id ? 'home_score' : 'away_score';
      const currentScore = teamId === match?.home_team_id ? match?.home_score : match?.away_score;

      await supabase
        .from('matches')
        .update({ [scoreField]: (currentScore || 0) + 1 })
        .eq('id', matchId);

      // Refresh data
      await fetchEvents();
      if (match) {
        const updatedMatch = { ...match };
        if (teamId === match.home_team_id) {
          updatedMatch.home_score += 1;
        } else {
          updatedMatch.away_score += 1;
        }
        setMatch(updatedMatch);
      }
    } catch (error) {
      console.error('Error recording goal:', error);
    }
  };

  const handleRecordCard = async (
    playerId: string,
    teamId: string,
    minute: number,
    half: 'first' | 'second',
    cardType: 'yellow' | 'red'
  ) => {
    try {
      const { error } = await supabase.from('match_events').insert({
        match_id: matchId,
        event_type: cardType === 'yellow' ? 'yellow_card' : 'red_card',
        team_id: teamId,
        player_id: playerId,
        minute,
        half,
        is_mercenary: false,
      });

      if (error) throw error;
      await fetchEvents();
    } catch (error) {
      console.error('Error recording card:', error);
    }
  };

  const handleRecordSubstitution = async (
    outPlayerId: string,
    inPlayerId: string,
    teamId: string,
    minute: number,
    half: 'first' | 'second'
  ) => {
    try {
      const { error } = await supabase.from('match_events').insert({
        match_id: matchId,
        event_type: 'substitution',
        team_id: teamId,
        player_id: outPlayerId,
        minute,
        half,
        related_player_id: inPlayerId,
        is_mercenary: false,
      });

      if (error) throw error;
      await fetchEvents();
    } catch (error) {
      console.error('Error recording substitution:', error);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      // Get event details before deleting
      const event = events.find((e) => e.id === eventId);

      const { error } = await supabase
        .from('match_events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;

      // Update score if it was a goal
      if (event && event.event_type === 'goal' && match) {
        const scoreField =
          event.team_id === match.home_team_id ? 'home_score' : 'away_score';
        const currentScore =
          event.team_id === match.home_team_id ? match.home_score : match.away_score;

        await supabase
          .from('matches')
          .update({ [scoreField]: Math.max(0, currentScore - 1) })
          .eq('id', matchId);

        const updatedMatch = { ...match };
        if (event.team_id === match.home_team_id) {
          updatedMatch.home_score = Math.max(0, updatedMatch.home_score - 1);
        } else {
          updatedMatch.away_score = Math.max(0, updatedMatch.away_score - 1);
        }
        setMatch(updatedMatch);
      }

      await fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handleMatchStatusChange = async (status: 'scheduled' | 'live' | 'finished') => {
    if (status === 'finished') {
      setShowEndDialog(true);
      return;
    }

    try {
      const { error } = await supabase
        .from('matches')
        .update({ status })
        .eq('id', matchId);

      if (error) throw error;
      if (match) {
        setMatch({ ...match, status });
      }
    } catch (error) {
      console.error('Error updating match status:', error);
    }
  };

  const confirmEndMatch = async () => {
    try {
      const { error } = await supabase
        .from('matches')
        .update({
          status: 'finished',
          finished_at: new Date().toISOString(),
        })
        .eq('id', matchId);

      if (error) throw error;
      router.push(`/matches/${matchId}`);
    } catch (error) {
      console.error('Error ending match:', error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-muted rounded" />
          <div className="h-64 bg-muted rounded" />
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-96 bg-muted rounded" />
            <div className="h-96 bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">경기를 찾을 수 없습니다.</p>
          <Button onClick={() => router.back()} className="mt-4">
            돌아가기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Button variant="ghost" onClick={() => router.back()} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            돌아가기
          </Button>
          <h1 className="text-2xl font-bold">경기 기록 입력</h1>
          <div className="w-24" />
        </div>

        {/* Scoreboard */}
        <div className="mb-8">
          <Scoreboard
            homeTeam={match.teams_home}
            awayTeam={match.teams_away}
            homeScore={match.home_score}
            awayScore={match.away_score}
            matchDate={match.match_date}
            matchTime={match.match_time}
            venue={match.venue}
            firstHalfDuration={match.first_half_duration}
            secondHalfDuration={match.second_half_duration}
            onMatchStatusChange={handleMatchStatusChange}
          />
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <PlayerSelector
              homeTeam={match.teams_home}
              awayTeam={match.teams_away}
              homePlayers={homePlayers}
              awayPlayers={awayPlayers}
              selectedPlayerId={selectedPlayerId}
              onPlayerSelect={(playerId, teamId) => {
                setSelectedPlayerId(playerId);
                setSelectedTeamId(teamId);
              }}
            />

            <QuickActionButtons
              selectedPlayerId={selectedPlayerId}
              selectedTeamId={selectedTeamId}
              currentMinute={currentMinute}
              currentHalf={currentHalf}
              allPlayers={[...homePlayers, ...awayPlayers]}
              onRecordGoal={handleRecordGoal}
              onRecordCard={handleRecordCard}
              onRecordSubstitution={handleRecordSubstitution}
            />
          </div>

          <div>
            <EventTimeline events={events} onDeleteEvent={handleDeleteEvent} />
          </div>
        </div>
      </div>

      {/* End Match Confirmation */}
      <AlertDialog open={showEndDialog} onOpenChange={setShowEndDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>경기 종료</AlertDialogTitle>
            <AlertDialogDescription>
              경기를 종료하시겠습니까? 종료 후에는 기록을 수정할 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={confirmEndMatch}>종료하기</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
