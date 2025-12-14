"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, AlertCircle, XCircle, Repeat } from 'lucide-react';
import { MatchEvent } from '@/types/match';

interface KeyEventSummaryProps {
  events: MatchEvent[];
  homeTeamName: string;
  awayTeamName: string;
  homeTeamId: string;
  awayTeamId: string;
}

interface EventCounts {
  goals: number;
  yellowCards: number;
  redCards: number;
  substitutions: number;
}

export function KeyEventSummary({
  events,
  homeTeamName,
  awayTeamName,
  homeTeamId,
  awayTeamId,
}: KeyEventSummaryProps) {
  // 팀별 이벤트 카운트 계산
  const homeEvents = events.filter(e => e.teamId === homeTeamId);
  const awayEvents = events.filter(e => e.teamId === awayTeamId);

  const countEvents = (teamEvents: MatchEvent[]): EventCounts => ({
    goals: teamEvents.filter(e => e.type === 'goal').length,
    yellowCards: teamEvents.filter(e => e.type === 'yellow').length,
    redCards: teamEvents.filter(e => e.type === 'red').length,
    substitutions: teamEvents.filter(e => e.type === 'substitution').length,
  });

  const homeCounts = countEvents(homeEvents);
  const awayCounts = countEvents(awayEvents);

  return (
    <Card>
      <CardHeader>
        <CardTitle>주요 이벤트</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* 득점 */}
          <div className="flex items-center justify-between py-3 border-b">
            <div className="flex items-center gap-2 flex-1">
              <span className="font-medium text-sm">{homeTeamName}</span>
              <span className="text-lg font-bold">{homeCounts.goals}</span>
            </div>
            <div className="flex items-center gap-2 px-4">
              <Target className="w-5 h-5 text-green-600" />
              <span className="text-sm text-muted-foreground">득점</span>
            </div>
            <div className="flex items-center gap-2 flex-1 justify-end">
              <span className="text-lg font-bold">{awayCounts.goals}</span>
              <span className="font-medium text-sm">{awayTeamName}</span>
            </div>
          </div>

          {/* 경고 */}
          <div className="flex items-center justify-between py-3 border-b">
            <div className="flex items-center gap-2 flex-1">
              <span className="font-medium text-sm">{homeTeamName}</span>
              <span className="text-lg font-bold">{homeCounts.yellowCards}</span>
            </div>
            <div className="flex items-center gap-2 px-4">
              <AlertCircle className="w-5 h-5 text-yellow-500" />
              <span className="text-sm text-muted-foreground">경고</span>
            </div>
            <div className="flex items-center gap-2 flex-1 justify-end">
              <span className="text-lg font-bold">{awayCounts.yellowCards}</span>
              <span className="font-medium text-sm">{awayTeamName}</span>
            </div>
          </div>

          {/* 퇴장 */}
          <div className="flex items-center justify-between py-3 border-b">
            <div className="flex items-center gap-2 flex-1">
              <span className="font-medium text-sm">{homeTeamName}</span>
              <span className="text-lg font-bold">{homeCounts.redCards}</span>
            </div>
            <div className="flex items-center gap-2 px-4">
              <XCircle className="w-5 h-5 text-red-600" />
              <span className="text-sm text-muted-foreground">퇴장</span>
            </div>
            <div className="flex items-center gap-2 flex-1 justify-end">
              <span className="text-lg font-bold">{awayCounts.redCards}</span>
              <span className="font-medium text-sm">{awayTeamName}</span>
            </div>
          </div>

          {/* 교체 */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-2 flex-1">
              <span className="font-medium text-sm">{homeTeamName}</span>
              <span className="text-lg font-bold">{homeCounts.substitutions}</span>
            </div>
            <div className="flex items-center gap-2 px-4">
              <Repeat className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-muted-foreground">교체</span>
            </div>
            <div className="flex items-center gap-2 flex-1 justify-end">
              <span className="text-lg font-bold">{awayCounts.substitutions}</span>
              <span className="font-medium text-sm">{awayTeamName}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
