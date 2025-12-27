'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, StopCircle } from 'lucide-react';

interface ScoreboardProps {
  homeTeam: {
    name: string;
    logo_url: string | null;
  };
  awayTeam: {
    name: string;
    logo_url: string | null;
  };
  homeScore: number;
  awayScore: number;
  matchDate: string;
  matchTime: string;
  venue: string;
  firstHalfDuration: number;
  secondHalfDuration: number;
  onMatchStatusChange: (status: 'scheduled' | 'live' | 'finished') => void;
}

export function Scoreboard({
  homeTeam,
  awayTeam,
  homeScore,
  awayScore,
  matchDate,
  matchTime,
  venue,
  firstHalfDuration,
  secondHalfDuration,
  onMatchStatusChange,
}: ScoreboardProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [currentHalf, setCurrentHalf] = useState<'first' | 'second'>('first');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const maxSeconds = currentHalf === 'first' ? firstHalfDuration * 60 : secondHalfDuration * 60;
  const currentMinute = Math.floor(elapsedSeconds / 60);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && elapsedSeconds < maxSeconds) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, elapsedSeconds, maxSeconds]);

  const handleStart = () => {
    setIsRunning(true);
    onMatchStatusChange('live');
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleSwitchHalf = () => {
    if (currentHalf === 'first') {
      setCurrentHalf('second');
      setElapsedSeconds(0);
      setIsRunning(false);
    }
  };

  const handleEnd = () => {
    setIsRunning(false);
    onMatchStatusChange('finished');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="rounded-lg border bg-card p-6">
      {/* Match Info */}
      <div className="text-center mb-4">
        <div className="text-sm text-muted-foreground mb-2">
          {matchDate} {matchTime} · {venue}
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
          {currentHalf === 'first' ? '전반전' : '후반전'} {currentMinute}&apos;
        </div>
      </div>

      {/* Score Display */}
      <div className="flex items-center justify-center gap-8 mb-6">
        <div className="flex-1 text-right">
          <div className="text-xl font-bold mb-2">{homeTeam.name}</div>
          <div className="text-5xl font-bold">{homeScore}</div>
        </div>

        <div className="text-3xl font-bold text-muted-foreground">VS</div>

        <div className="flex-1 text-left">
          <div className="text-xl font-bold mb-2">{awayTeam.name}</div>
          <div className="text-5xl font-bold">{awayScore}</div>
        </div>
      </div>

      {/* Timer Display */}
      <div className="text-center mb-4">
        <div className="text-3xl font-mono font-bold">
          {formatTime(elapsedSeconds)}
        </div>
        <div className="text-sm text-muted-foreground mt-1">
          / {formatTime(maxSeconds)}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        {!isRunning ? (
          <Button onClick={handleStart} size="lg" className="gap-2">
            <Play className="h-5 w-5" />
            {elapsedSeconds === 0 ? '시작' : '재개'}
          </Button>
        ) : (
          <Button onClick={handlePause} size="lg" variant="secondary" className="gap-2">
            <Pause className="h-5 w-5" />
            일시정지
          </Button>
        )}

        {currentHalf === 'first' && elapsedSeconds >= maxSeconds && (
          <Button onClick={handleSwitchHalf} size="lg" variant="outline">
            후반전 시작
          </Button>
        )}

        {currentHalf === 'second' && (
          <Button onClick={handleEnd} size="lg" variant="destructive" className="gap-2">
            <StopCircle className="h-5 w-5" />
            경기 종료
          </Button>
        )}
      </div>
    </div>
  );
}
