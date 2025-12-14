"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { PlayerLineup, AttendanceStatus } from '@/types/match';
import { cn } from '@/lib/utils';

interface PlayerSelectorProps {
  homeTeamName: string;
  awayTeamName: string;
  homeLineup: PlayerLineup[];
  awayLineup: PlayerLineup[];
  attendances: { playerId: string; status: AttendanceStatus }[];
  selectedPlayerId: string | null;
  onPlayerSelect: (playerId: string, teamId: 'home' | 'away') => void;
}

export function PlayerSelector({
  homeTeamName,
  awayTeamName,
  homeLineup,
  awayLineup,
  attendances,
  selectedPlayerId,
  onPlayerSelect,
}: PlayerSelectorProps) {
  const [activeTab, setActiveTab] = useState<'home' | 'away'>('home');

  const isPlayerAttending = (playerId: string): boolean => {
    const attendance = attendances.find(a => a.playerId === playerId);
    return attendance?.status === 'attending';
  };

  const getAttendanceStatus = (playerId: string): AttendanceStatus | undefined => {
    return attendances.find(a => a.playerId === playerId)?.status;
  };

  const renderPlayer = (player: PlayerLineup, teamId: 'home' | 'away') => {
    const isAttending = isPlayerAttending(player.playerId);
    const attendanceStatus = getAttendanceStatus(player.playerId);
    const isSelected = selectedPlayerId === player.playerId;

    return (
      <button
        key={player.playerId}
        type="button"
        onClick={() => isAttending && onPlayerSelect(player.playerId, teamId)}
        disabled={!isAttending}
        className={cn(
          "w-full p-4 rounded-lg border-2 transition-all text-left",
          "flex items-center gap-3",
          isSelected && isAttending && "border-primary bg-primary/5 ring-2 ring-primary/20",
          !isSelected && isAttending && "border-border hover:border-primary/50 hover:bg-accent",
          !isAttending && "opacity-40 cursor-not-allowed bg-muted border-dashed"
        )}
      >
        <Avatar className="h-12 w-12 flex-shrink-0">
          <AvatarImage src={player.avatar} />
          <AvatarFallback>{player.name[0]}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm truncate">{player.name}</span>
            {!isAttending && (
              <Badge variant="secondary" className="text-xs">
                {attendanceStatus === 'absent' && '불참'}
                {attendanceStatus === 'pending' && '미정'}
                {!attendanceStatus && '미응답'}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="text-xs">{player.position}</Badge>
            <span className="text-xs text-muted-foreground">#{player.number}</span>
          </div>
        </div>

        {isSelected && isAttending && (
          <div className="flex-shrink-0">
            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        )}
      </button>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>선수 선택</CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          참석한 선수만 선택 가능합니다
        </p>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'home' | 'away')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="home">{homeTeamName}</TabsTrigger>
            <TabsTrigger value="away">{awayTeamName}</TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="mt-4 space-y-2">
            {homeLineup.map(player => renderPlayer(player, 'home'))}
          </TabsContent>

          <TabsContent value="away" className="mt-4 space-y-2">
            {awayLineup.map(player => renderPlayer(player, 'away'))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
