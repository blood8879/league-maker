"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Pause, RotateCcw, Flag } from 'lucide-react';
import { MatchTimer as MatchTimerType } from '@/types/match';

interface MatchTimerProps {
  timer: MatchTimerType;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onFinish: () => void;
  onReset: () => void;
}

export function MatchTimer({
  timer,
  onStart,
  onPause,
  onResume,
  onFinish,
  onReset,
}: MatchTimerProps) {
  const formatTime = (minute: number, second: number): string => {
    return `${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`;
  };

  const getPhaseLabel = (): string => {
    switch (timer.phase) {
      case 'first-half':
        return '전반전';
      case 'half-time':
        return '하프타임';
      case 'second-half':
        return '후반전';
      case 'finished':
        return '경기 종료';
      default:
        return '';
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-4">
          {/* Phase Label */}
          <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            {getPhaseLabel()}
          </div>

          {/* Timer Display */}
          <div className="text-6xl font-bold font-mono tabular-nums">
            {formatTime(timer.minute, timer.second)}
          </div>

          {/* Control Buttons */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {!timer.isRunning && timer.phase === 'first-half' && timer.minute === 0 && (
              <Button onClick={onStart} size="lg">
                <Play className="w-4 h-4 mr-2" />
                시작
              </Button>
            )}

            {timer.isRunning && (
              <Button onClick={onPause} variant="secondary" size="lg">
                <Pause className="w-4 h-4 mr-2" />
                일시정지
              </Button>
            )}

            {!timer.isRunning && timer.phase !== 'finished' && timer.minute > 0 && (
              <Button onClick={onResume} size="lg">
                <Play className="w-4 h-4 mr-2" />
                재개
              </Button>
            )}

            {timer.phase !== 'finished' && (
              <Button onClick={onFinish} variant="destructive" size="lg">
                <Flag className="w-4 h-4 mr-2" />
                종료
              </Button>
            )}

            <Button onClick={onReset} variant="outline" size="lg">
              <RotateCcw className="w-4 h-4 mr-2" />
              초기화
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
