"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Pause, Square } from "lucide-react";
import { Match } from "@/types/league";

interface MatchScoreboardProps {
  match: Match;
  homeScore: number;
  awayScore: number;
  onStatusChange: (status: Match["status"]) => void;
}

export function MatchScoreboard({ match, homeScore, awayScore, onStatusChange }: MatchScoreboardProps) {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000); // In a real app, this might be minutes or scaled
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsRunning(true);
    onStatusChange('live');
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleEnd = () => {
    setIsRunning(false);
    onStatusChange('finished');
  };

  return (
    <Card className="mb-6 bg-slate-900 text-white border-none">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-slate-400">
            {match.type === 'league' ? '리그 경기' : '친선 경기'}
          </div>
          <div className="text-2xl font-mono font-bold text-yellow-400">
            {formatTime(time)}
          </div>
          <div className="flex gap-2">
            {!isRunning && match.status !== 'finished' && (
              <Button size="sm" variant="secondary" onClick={handleStart}>
                <Play className="h-4 w-4 mr-1" /> 시작
              </Button>
            )}
            {isRunning && (
              <Button size="sm" variant="secondary" onClick={handlePause}>
                <Pause className="h-4 w-4 mr-1" /> 일시정지
              </Button>
            )}
            {match.status !== 'finished' && (
              <Button size="sm" variant="destructive" onClick={handleEnd}>
                <Square className="h-4 w-4 mr-1" /> 종료
              </Button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex-1 text-center">
            <h2 className="text-xl font-bold mb-2">{match.homeTeamName}</h2>
            <div className="text-5xl font-bold">{homeScore}</div>
          </div>
          <div className="text-2xl font-bold text-slate-500">VS</div>
          <div className="flex-1 text-center">
            <h2 className="text-xl font-bold mb-2">{match.awayTeamName}</h2>
            <div className="text-5xl font-bold">{awayScore}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
