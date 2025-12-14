"use client";

import { MatchEvent, MatchEventType } from "@/types/league";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MatchTimelineProps {
  events: MatchEvent[];
  onDeleteEvent: (eventId: string) => void;
}

export function MatchTimeline({ events, onDeleteEvent }: MatchTimelineProps) {
  // Sort events by time (descending for timeline view)
  const sortedEvents = [...events].sort((a, b) => b.time - a.time);

  const getEventIcon = (type: MatchEventType) => {
    switch (type) {
      case 'goal': return '⚽';
      case 'yellow_card': return '🟨';
      case 'red_card': return '🟥';
      case 'substitution': return '🔄';
    }
  };

  const getEventLabel = (type: MatchEventType) => {
    switch (type) {
      case 'goal': return '득점';
      case 'yellow_card': return '경고';
      case 'red_card': return '퇴장';
      case 'substitution': return '교체';
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">경기 기록</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-[300px] px-4">
          <div className="space-y-4 py-4">
            {sortedEvents.length === 0 && (
              <div className="text-center text-muted-foreground text-sm py-8">
                아직 기록된 이벤트가 없습니다.
              </div>
            )}
            {sortedEvents.map((event) => (
              <div key={event.id} className="flex gap-3 items-start relative pl-4 border-l-2 border-muted">
                <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-primary" />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm">{event.time}&apos;</span>
                      <Badge variant="outline" className="gap-1">
                        <span>{getEventIcon(event.type)}</span>
                        <span>{getEventLabel(event.type)}</span>
                      </Badge>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 text-muted-foreground hover:text-destructive"
                      onClick={() => onDeleteEvent(event.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="text-sm font-medium">{event.playerName}</div>
                  {event.type === 'goal' && event.assistPlayerName && (
                    <div className="text-xs text-muted-foreground">도움: {event.assistPlayerName}</div>
                  )}
                  {event.type === 'substitution' && event.subInPlayerName && (
                    <div className="text-xs text-muted-foreground">IN: {event.subInPlayerName}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
