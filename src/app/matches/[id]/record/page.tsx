"use client";

import { useState, use } from "react";
import { notFound } from "next/navigation";
import { MOCK_MATCHES } from "@/lib/mock-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus } from "lucide-react";

interface MatchRecordPageProps {
  params: Promise<{ id: string }>;
}

interface GoalRecord {
  id: string;
  scorerId: string;
  scorerName: string;
  assistId?: string;
  assistName?: string;
  teamId: string;
}

interface PlayerStats {
  playerId: string;
  playerName: string;
  teamId: string;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
}

interface Player {
  id: string;
  name: string;
  teamId: string;
}

interface GoalInputSectionProps {
  teamName: string;
  teamId: string;
  score: number;
  goals: GoalRecord[];
  players: Player[];
  onAddGoal: (teamId: string) => void;
  onRemoveGoal: (teamId: string, goalId: string) => void;
  onUpdateGoal: (teamId: string, goalId: string, field: 'scorerId' | 'assistId', value: string) => void;
}

const GoalInputSection = ({
  teamName,
  teamId,
  score,
  goals,
  players,
  onAddGoal,
  onRemoveGoal,
  onUpdateGoal
}: GoalInputSectionProps) => (
  <Card>
    <CardHeader>
      <div className="flex justify-between items-center">
        <div>
          <CardTitle>{teamName}</CardTitle>
          <CardDescription>득점: {score}골</CardDescription>
        </div>
        <Button onClick={() => onAddGoal(teamId)} size="sm">
          <Plus className="h-4 w-4 mr-1" /> 골 추가
        </Button>
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      {goals.map((goal, idx) => (
        <div key={goal.id} className="border rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-center">
            <Badge variant="outline">골 #{idx + 1}</Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemoveGoal(teamId, goal.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2">
            <Label>득점자</Label>
            <Select
              value={goal.scorerId}
              onValueChange={(value) => onUpdateGoal(teamId, goal.id, 'scorerId', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="득점자 선택" />
              </SelectTrigger>
              <SelectContent>
                {players.map(p => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>도움 (선택사항)</Label>
            <Select
              value={goal.assistId}
              onValueChange={(value) => onUpdateGoal(teamId, goal.id, 'assistId', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="도움 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">없음</SelectItem>
                {players.filter(p => p.id !== goal.scorerId).map(p => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      ))}
    </CardContent>
  </Card>
);

export default function MatchRecordPage({ params }: MatchRecordPageProps) {
  const { id } = use(params);
  const match = MOCK_MATCHES.find((m) => m.id === id);

  if (!match) {
    notFound();
  }

  const [homeScore, setHomeScore] = useState(match.score?.home || 0);
  const [awayScore, setAwayScore] = useState(match.score?.away || 0);
  const [homeGoals, setHomeGoals] = useState<GoalRecord[]>([]);
  const [awayGoals, setAwayGoals] = useState<GoalRecord[]>([]);
  const [playerStats, setPlayerStats] = useState<PlayerStats[]>([]);

  // Get players from attendance
  const homeAttendees = match.attendances?.filter(
    a => a.status === 'attending'
  ).slice(0, 15) || []; // Assume first half are home team

  const awayAttendees = match.attendances?.filter(
    a => a.status === 'attending'
  ).slice(15, 30) || []; // Second half are away team

  // Mock player data - in real app, this would come from team rosters
  const homePlayers = homeAttendees.map((a, idx) => ({
    id: a.playerId,
    name: `홈팀 선수 ${idx + 1}`,
    teamId: match.homeTeamId
  }));

  const awayPlayers = awayAttendees.map((a, idx) => ({
    id: a.playerId,
    name: `원정팀 선수 ${idx + 1}`,
    teamId: match.awayTeamId
  }));

  const allPlayers = [...homePlayers, ...awayPlayers];

  const addGoal = (teamId: string) => {
    const newGoal: GoalRecord = {
      id: crypto.randomUUID(),
      scorerId: '',
      scorerName: '',
      teamId,
    };

    if (teamId === match.homeTeamId) {
      setHomeGoals([...homeGoals, newGoal]);
    } else {
      setAwayGoals([...awayGoals, newGoal]);
    }
  };

  const removeGoal = (teamId: string, goalId: string) => {
    if (teamId === match.homeTeamId) {
      setHomeGoals(homeGoals.filter(g => g.id !== goalId));
      setHomeScore(Math.max(0, homeScore - 1));
    } else {
      setAwayGoals(awayGoals.filter(g => g.id !== goalId));
      setAwayScore(Math.max(0, awayScore - 1));
    }
  };

  const updateGoal = (teamId: string, goalId: string, field: 'scorerId' | 'assistId', value: string) => {
    if (value === 'none') value = ''; // Handle "none" selection for assist
    
    const player = allPlayers.find(p => p.id === value);
    // Allow empty value for assist (when selecting "none")
    if (!player && value !== '') return;

    const updateGoalList = (goals: GoalRecord[]) =>
      goals.map(g => {
        if (g.id === goalId) {
          if (field === 'scorerId') {
            return { ...g, scorerId: value, scorerName: player?.name || '' };
          } else {
            return { ...g, assistId: value, assistName: player?.name || '' };
          }
        }
        return g;
      });

    if (teamId === match.homeTeamId) {
      setHomeGoals(updateGoalList(homeGoals));
    } else {
      setAwayGoals(updateGoalList(awayGoals));
    }
  };

  const updatePlayerStat = (playerId: string, stat: keyof Omit<PlayerStats, 'playerId' | 'playerName' | 'teamId'>, delta: number) => {
    const player = allPlayers.find(p => p.id === playerId);
    if (!player) return;

    setPlayerStats(prev => {
      const existing = prev.find(s => s.playerId === playerId);
      if (existing) {
        return prev.map(s =>
          s.playerId === playerId
            ? { ...s, [stat]: Math.max(0, s[stat] + delta) }
            : s
        );
      } else {
        return [...prev, {
          playerId: player.id,
          playerName: player.name,
          teamId: player.teamId,
          goals: 0,
          assists: 0,
          yellowCards: 0,
          redCards: 0,
          [stat]: Math.max(0, delta)
        }];
      }
    });
  };

  const handleSave = () => {
    // Calculate final stats from goals
    const finalStats = [...playerStats];

    [...homeGoals, ...awayGoals].forEach(goal => {
      if (goal.scorerId) {
        const existing = finalStats.find(s => s.playerId === goal.scorerId);
        if (existing) {
          existing.goals += 1;
        } else {
          const player = allPlayers.find(p => p.id === goal.scorerId);
          if (player) {
            finalStats.push({
              playerId: player.id,
              playerName: player.name,
              teamId: player.teamId,
              goals: 1,
              assists: 0,
              yellowCards: 0,
              redCards: 0
            });
          }
        }
      }

      if (goal.assistId) {
        const existing = finalStats.find(s => s.playerId === goal.assistId);
        if (existing) {
          existing.assists += 1;
        } else {
          const player = allPlayers.find(p => p.id === goal.assistId);
          if (player) {
            finalStats.push({
              playerId: player.id,
              playerName: player.name,
              teamId: player.teamId,
              goals: 0,
              assists: 1,
              yellowCards: 0,
              redCards: 0
            });
          }
        }
      }
    });

    console.log('경기 결과 저장:', {
      matchId: match.id,
      score: { home: homeScore, away: awayScore },
      homeGoals,
      awayGoals,
      playerStats: finalStats
    });

    alert('경기 결과가 저장되었습니다!');
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">경기 결과 입력</h1>
        <p className="text-muted-foreground">
          {match.homeTeamName} vs {match.awayTeamName}
        </p>
      </div>

      <div className="grid gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>최종 스코어</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center gap-8">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">{match.homeTeamName}</p>
                <Input
                  type="number"
                  min="0"
                  value={homeScore}
                  onChange={(e) => setHomeScore(parseInt(e.target.value) || 0)}
                  className="text-3xl font-bold text-center w-24"
                />
              </div>
              <span className="text-2xl font-bold">:</span>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">{match.awayTeamName}</p>
                <Input
                  type="number"
                  min="0"
                  value={awayScore}
                  onChange={(e) => setAwayScore(parseInt(e.target.value) || 0)}
                  className="text-3xl font-bold text-center w-24"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <GoalInputSection
            teamName={match.homeTeamName}
            teamId={match.homeTeamId}
            score={homeScore}
            goals={homeGoals}
            players={homePlayers}
            onAddGoal={addGoal}
            onRemoveGoal={removeGoal}
            onUpdateGoal={updateGoal}
          />

          <GoalInputSection
            teamName={match.awayTeamName}
            teamId={match.awayTeamId}
            score={awayScore}
            goals={awayGoals}
            players={awayPlayers}
            onAddGoal={addGoal}
            onRemoveGoal={removeGoal}
            onUpdateGoal={updateGoal}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>기타 기록</CardTitle>
            <CardDescription>경고/퇴장 등 추가 기록</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {allPlayers.map(player => {
                const stats = playerStats.find(s => s.playerId === player.id);
                return (
                  <div key={player.id} className="flex items-center justify-between border-b pb-3">
                    <span className="font-medium">{player.name}</span>
                    <div className="flex gap-4">
                      <div className="flex items-center gap-2">
                        <Label className="text-xs">옐로카드</Label>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updatePlayerStat(player.id, 'yellowCards', -1)}
                          >
                            -
                          </Button>
                          <span className="w-8 text-center">{stats?.yellowCards || 0}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updatePlayerStat(player.id, 'yellowCards', 1)}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Label className="text-xs">레드카드</Label>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updatePlayerStat(player.id, 'redCards', -1)}
                          >
                            -
                          </Button>
                          <span className="w-8 text-center">{stats?.redCards || 0}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updatePlayerStat(player.id, 'redCards', 1)}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => window.history.back()}>
          취소
        </Button>
        <Button onClick={handleSave} size="lg">
          경기 결과 저장
        </Button>
      </div>
    </div>
  );
}
