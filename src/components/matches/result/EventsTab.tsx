"use client";

import { useState } from 'react';
import { Match, MatchEvent, EventType } from '@/types/match';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Target, AlertCircle, XCircle, Repeat } from 'lucide-react';

interface EventsTabProps {
  match: Match;
}

type EventFilter = 'all' | 'goal' | 'card' | 'substitution';

export function EventsTab({ match }: EventsTabProps) {
  const [filter, setFilter] = useState<EventFilter>('all');

  const events = match.events || [];

  // 선수 이름 가져오기 (임시)
  const getPlayerName = (playerId: string): string => {
    return playerId;
  };

  // 필터링된 이벤트
  const filteredEvents = events.filter(event => {
    if (filter === 'all') return true;
    if (filter === 'goal') return event.type === 'goal';
    if (filter === 'card') return event.type === 'yellow' || event.type === 'red';
    if (filter === 'substitution') return event.type === 'substitution';
    return true;
  });

  // 전반/후반으로 그룹핑
  const firstHalfEvents = filteredEvents.filter(e => e.phase === 'first-half');
  const secondHalfEvents = filteredEvents.filter(e => e.phase === 'second-half');

  // 이벤트 아이콘
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

  // 이벤트 라벨
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

  // 이벤트 렌더링
  const renderEventList = (eventList: MatchEvent[], title: string) => {
    if (eventList.length === 0) return null;

    const sortedEvents = [...eventList].sort((a, b) => a.minute - b.minute);

    return (
      <div>
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <div className="space-y-2">
          {sortedEvents.map((event) => (
            <div
              key={event.id}
              className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors"
            >
              {/* 아이콘 */}
              <div className="flex-shrink-0">
                {getEventIcon(event.type)}
              </div>

              {/* 시간 뱃지 */}
              <Badge variant="secondary" className="flex-shrink-0 font-mono">
                {event.minute}&apos;
              </Badge>

              {/* 이벤트 라벨 */}
              <div className="flex-1 min-w-0 text-sm font-medium">
                {getEventLabel(event)}
              </div>

              {/* 용병 표시 */}
              {event.isMercenary && (
                <Badge variant="outline" className="flex-shrink-0 text-xs">
                  용병
                </Badge>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (events.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>경기 기록</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            기록된 이벤트가 없습니다
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* 필터 버튼 */}
      <Card>
        <CardHeader>
          <CardTitle>경기 기록</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
              size="sm"
            >
              전체
            </Button>
            <Button
              variant={filter === 'goal' ? 'default' : 'outline'}
              onClick={() => setFilter('goal')}
              size="sm"
              className="gap-1"
            >
              <Target className="w-4 h-4" />
              득점
            </Button>
            <Button
              variant={filter === 'card' ? 'default' : 'outline'}
              onClick={() => setFilter('card')}
              size="sm"
              className="gap-1"
            >
              <AlertCircle className="w-4 h-4" />
              경고/퇴장
            </Button>
            <Button
              variant={filter === 'substitution' ? 'default' : 'outline'}
              onClick={() => setFilter('substitution')}
              size="sm"
              className="gap-1"
            >
              <Repeat className="w-4 h-4" />
              교체
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 이벤트 목록 (전/후반 구분) */}
      {filteredEvents.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <div className="text-center text-muted-foreground">
              해당하는 이벤트가 없습니다
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6 space-y-6">
            {renderEventList(firstHalfEvents, '전반전')}
            {firstHalfEvents.length > 0 && secondHalfEvents.length > 0 && (
              <div className="border-t pt-6" />
            )}
            {renderEventList(secondHalfEvents, '후반전')}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
