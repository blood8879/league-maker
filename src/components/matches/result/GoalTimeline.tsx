"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target } from 'lucide-react';
import { MatchEvent } from '@/types/match';

interface GoalTimelineProps {
  events: MatchEvent[];
  homeTeamId: string;
  getPlayerName: (playerId: string) => string;
}

export function GoalTimeline({
  events,
  homeTeamId,
  getPlayerName,
}: GoalTimelineProps) {
  // 득점 이벤트만 필터링 및 정렬
  const goalEvents = events
    .filter(event => event.type === 'goal')
    .sort((a, b) => a.minute - b.minute);

  if (goalEvents.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            득점 타임라인
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            득점이 없었습니다
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5" />
          득점 타임라인
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {goalEvents.map((goal) => {
            const isHomeTeam = goal.teamId === homeTeamId;
            const scorerName = getPlayerName(goal.playerId);
            const assistName = goal.relatedPlayerId
              ? getPlayerName(goal.relatedPlayerId)
              : null;

            return (
              <div
                key={goal.id}
                className={`flex items-center gap-4 ${
                  isHomeTeam ? 'flex-row' : 'flex-row-reverse'
                }`}
              >
                {/* 시간 뱃지 */}
                <Badge variant="secondary" className="flex-shrink-0 font-mono">
                  {goal.minute}&apos;
                </Badge>

                {/* 세로 라인 */}
                <div className="flex-shrink-0 w-px h-12 bg-border" />

                {/* 득점 정보 */}
                <div
                  className={`flex-1 p-3 rounded-lg border ${
                    isHomeTeam ? 'bg-blue-50' : 'bg-red-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-green-600" />
                    <span className="font-semibold">{scorerName}</span>
                    {goal.isMercenary && (
                      <Badge variant="outline" className="text-xs">
                        용병
                      </Badge>
                    )}
                  </div>
                  {assistName && (
                    <div className="text-sm text-muted-foreground mt-1">
                      어시스트: {assistName}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
