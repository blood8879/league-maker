'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2 } from 'lucide-react';
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
import { useState } from 'react';

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

interface EventTimelineProps {
  events: MatchEvent[];
  onDeleteEvent: (eventId: string) => void;
}

export function EventTimeline({ events, onDeleteEvent }: EventTimelineProps) {
  const [deleteEventId, setDeleteEventId] = useState<string | null>(null);

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'goal':
        return '⚽';
      case 'yellow_card':
        return '🟨';
      case 'red_card':
        return '🟥';
      case 'substitution':
        return '🔄';
      default:
        return '📝';
    }
  };

  const getEventLabel = (eventType: string) => {
    switch (eventType) {
      case 'goal':
        return '득점';
      case 'yellow_card':
        return '경고';
      case 'red_card':
        return '퇴장';
      case 'substitution':
        return '교체';
      default:
        return '기록';
    }
  };

  const getEventDescription = (event: MatchEvent) => {
    switch (event.event_type) {
      case 'goal':
        return event.related_player_name
          ? `${event.player_name} (도움: ${event.related_player_name})`
          : event.player_name;
      case 'yellow_card':
      case 'red_card':
        return event.player_name;
      case 'substitution':
        return event.related_player_name
          ? `OUT: ${event.player_name} → IN: ${event.related_player_name}`
          : event.player_name;
      default:
        return event.player_name;
    }
  };

  const sortedEvents = [...events].sort((a, b) => {
    // Sort by half first
    if (a.half !== b.half) {
      return a.half === 'first' ? -1 : 1;
    }
    // Then by minute
    return b.minute - a.minute;
  });

  const confirmDelete = () => {
    if (deleteEventId) {
      onDeleteEvent(deleteEventId);
      setDeleteEventId(null);
    }
  };

  return (
    <>
      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">경기 타임라인</h2>

        {sortedEvents.length > 0 ? (
          <div className="space-y-3">
            {sortedEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-start gap-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors"
              >
                <div className="text-2xl">{getEventIcon(event.event_type)}</div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs">
                      {event.minute}&apos; ({event.half === 'first' ? '전반' : '후반'})
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {getEventLabel(event.event_type)}
                    </Badge>
                  </div>
                  <div className="text-sm font-medium truncate">
                    {getEventDescription(event)}
                  </div>
                  {event.description && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {event.description}
                    </div>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeleteEventId(event.id)}
                  className="shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <div className="text-4xl mb-2">📝</div>
            <div className="text-sm">아직 기록된 이벤트가 없습니다.</div>
          </div>
        )}
      </div>

      <AlertDialog open={!!deleteEventId} onOpenChange={(open) => !open && setDeleteEventId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>이벤트 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              이 이벤트를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>삭제</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
