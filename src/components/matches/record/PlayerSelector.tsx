'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface Player {
  id: string;
  user_id: string;
  users: {
    nickname: string;
    avatar_url: string | null;
    preferred_position: string | null;
  };
  jersey_number: number | null;
  position: string | null;
  is_mercenary: boolean;
}

interface PlayerSelectorProps {
  homeTeam: {
    id: string;
    name: string;
  };
  awayTeam: {
    id: string;
    name: string;
  };
  homePlayers: Player[];
  awayPlayers: Player[];
  selectedPlayerId: string | null;
  onPlayerSelect: (playerId: string, teamId: string) => void;
}

export function PlayerSelector({
  homeTeam,
  awayTeam,
  homePlayers,
  awayPlayers,
  selectedPlayerId,
  onPlayerSelect,
}: PlayerSelectorProps) {
  const [activeTab, setActiveTab] = useState<string>(homeTeam.id);

  const renderPlayerCard = (player: Player, teamId: string) => {
    const isSelected = selectedPlayerId === player.user_id;
    const position = player.position || player.users.preferred_position || 'MF';

    return (
      <button
        key={player.id}
        onClick={() => onPlayerSelect(player.user_id, teamId)}
        className={cn(
          'flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all hover:border-primary/50',
          isSelected && 'border-primary bg-primary/5',
          !isSelected && 'border-border bg-card'
        )}
      >
        <Avatar className={cn('h-12 w-12', isSelected && 'ring-2 ring-primary')}>
          <AvatarFallback className="text-sm font-semibold">
            {player.users.nickname.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="text-center">
          <div className="font-medium text-sm">{player.users.nickname}</div>
          <div className="text-xs text-muted-foreground mt-1">
            {position}
            {player.jersey_number && ` · #${player.jersey_number}`}
          </div>
          {player.is_mercenary && (
            <div className="text-xs text-amber-600 mt-1">용병</div>
          )}
        </div>
      </button>
    );
  };

  return (
    <div className="rounded-lg border bg-card p-6">
      <h2 className="text-lg font-semibold mb-4">선수 선택</h2>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value={homeTeam.id}>{homeTeam.name}</TabsTrigger>
          <TabsTrigger value={awayTeam.id}>{awayTeam.name}</TabsTrigger>
        </TabsList>

        <TabsContent value={homeTeam.id} className="mt-4">
          {homePlayers.length > 0 ? (
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {homePlayers.map((player) => renderPlayerCard(player, homeTeam.id))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              참석한 선수가 없습니다.
            </div>
          )}
        </TabsContent>

        <TabsContent value={awayTeam.id} className="mt-4">
          {awayPlayers.length > 0 ? (
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {awayPlayers.map((player) => renderPlayerCard(player, awayTeam.id))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              참석한 선수가 없습니다.
            </div>
          )}
        </TabsContent>
      </Tabs>

      {selectedPlayerId && (
        <div className="mt-4 p-3 bg-primary/10 rounded-lg text-center">
          <span className="text-sm font-medium">
            선택된 선수:{' '}
            {[...homePlayers, ...awayPlayers].find((p) => p.user_id === selectedPlayerId)?.users.nickname}
          </span>
        </div>
      )}
    </div>
  );
}
