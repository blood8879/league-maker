"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Target, AlertCircle, XCircle, Repeat, Edit, Trash2 } from 'lucide-react';
import { MatchEvent, EventType } from '@/types/match';

interface EventTimelineProps {
  events: MatchEvent[];
  getPlayerName: (playerId: string) => string;
  onEdit: (eventId: string) => void;
  onDelete: (eventId: string) => void;
}

export function EventTimeline({
  events,
  getPlayerName,
  onEdit,
  onDelete,
}: EventTimelineProps) {
  const sortedEvents = [...events].sort((a, b) => a.minute - b.minute);

  const getEventIcon = (type: EventType) => {
    switch (type) {
      case 'goal':
        return <Target className="w-5 h-5 text-green-600" />;
      case 'yellow':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'red':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'substitution':
        return <Repeat className="w-5 h-5 text-blue-600" />;
    }
  };

  const getEventLabel = (event: MatchEvent): string => {
    const playerName = getPlayerName(event.playerId);

    switch (event.type) {
      case 'goal':
        if (event.relatedPlayerId) {
          const assistName = getPlayerName(event.relatedPlayerId);
          return `⚽ ${playerName} 득점 (어시스트: ${assistName})`;
        }
        return `⚽ ${playerName} 득점`;

      case 'yellow':
        return `🟨 ${playerName} 경고${event.reason ? ` (${event.reason})` : ''}`;

      case 'red':
        return `🟥 ${playerName} 퇴장${event.reason ? ` (${event.reason})` : ''}`;

      case 'substitution':
        if (event.relatedPlayerId) {
          const inPlayerName = getPlayerName(event.relatedPlayerId);
          return `🔄 교체: ${playerName} → ${inPlayerName}`;
        }
        return `🔄 ${playerName} 교체`;
    }
  };

  if (sortedEvents.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>경기 기록</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            아직 기록된 이벤트가 없습니다
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>경기 기록</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {sortedEvents.map((event) => (
            <div
              key={event.id}
              className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors"
            >
              {/* Icon */}
              <div className="flex-shrink-0">
                {getEventIcon(event.type)}
              </div>

              {/* Time Badge */}
              <Badge variant="secondary" className="flex-shrink-0 font-mono">
                {event.minute}&apos;
              </Badge>

              {/* Event Label */}
              <div className="flex-1 min-w-0 text-sm font-medium">
                {getEventLabel(event)}
              </div>

              {/* Action Buttons */}
              <div className="flex-shrink-0 flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(event.id)}
                  className="h-8 w-8 p-0"
                >
                  <Edit className="w-4 h-4" />
                  <span className="sr-only">수정</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(event.id)}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="sr-only">삭제</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
