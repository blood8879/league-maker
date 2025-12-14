"use client";

import { Match } from "@/types/league";
import { MOCK_USERS } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PlayerSelectionProps {
  match: Match;
  selectedPlayerId: string | null;
  onSelectPlayer: (playerId: string, teamId: string, playerName: string) => void;
}

export function PlayerSelection({ match, selectedPlayerId, onSelectPlayer }: PlayerSelectionProps) {
  // Mock logic to get players for home/away teams based on attendance
  // In a real app, we would filter by teamId and attendance status
  const getAttendingPlayers = (teamId: string) => {
    // For mock purposes, we'll just return some users and pretend they are on the team
    // In reality, we need to check match.attendances and filter by team membership
    // const attendances = match.attendances || [];
    // const attendingIds = attendances.filter(a => a.status === 'attending').map(a => a.playerId);
    
    // Mock: Split mock users between home and away for demo
    const allUsers = MOCK_USERS;
    if (teamId === match.homeTeamId) {
      return allUsers.slice(0, 5); // First 5 users are home team
    } else {
      return allUsers.slice(5, 10); // Next 5 users are away team
    }
  };

  const homePlayers = getAttendingPlayers(match.homeTeamId);
  const awayPlayers = getAttendingPlayers(match.awayTeamId);

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">선수 선택</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="home" className="w-full">
          <TabsList className="w-full grid grid-cols-2 mb-4">
            <TabsTrigger value="home">홈팀</TabsTrigger>
            <TabsTrigger value="away">원정팀</TabsTrigger>
          </TabsList>
          
          <TabsContent value="home" className="space-y-2">
            {homePlayers.map(player => (
              <div
                key={player.id}
                onClick={() => onSelectPlayer(player.id, match.homeTeamId, player.nickname)}
                className={cn(
                  "flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors border",
                  selectedPlayerId === player.id 
                    ? "bg-primary/10 border-primary" 
                    : "hover:bg-muted border-transparent bg-card"
                )}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={`https://placehold.co/100x100/png?text=${player.nickname[0]}`} />
                  <AvatarFallback>{player.nickname[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-medium text-sm">{player.nickname}</div>
                  <div className="text-xs text-muted-foreground">{player.position || "포지션 없음"}</div>
                </div>
                {selectedPlayerId === player.id && (
                  <Badge variant="default" className="h-5 text-[10px]">선택됨</Badge>
                )}
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="away" className="space-y-2">
            {awayPlayers.map(player => (
              <div
                key={player.id}
                onClick={() => onSelectPlayer(player.id, match.awayTeamId, player.nickname)}
                className={cn(
                  "flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors border",
                  selectedPlayerId === player.id 
                    ? "bg-primary/10 border-primary" 
                    : "hover:bg-muted border-transparent bg-card"
                )}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={`https://placehold.co/100x100/png?text=${player.nickname[0]}`} />
                  <AvatarFallback>{player.nickname[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-medium text-sm">{player.nickname}</div>
                  <div className="text-xs text-muted-foreground">{player.position || "포지션 없음"}</div>
                </div>
                {selectedPlayerId === player.id && (
                  <Badge variant="default" className="h-5 text-[10px]">선택됨</Badge>
                )}
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
