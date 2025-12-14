import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { PlayerStats } from "@/types/league";

interface LeagueTopScorersProps {
  scorers: PlayerStats[];
}

export function LeagueTopScorers({ scorers }: LeagueTopScorersProps) {
  if (!scorers || scorers.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">득점 기록이 없습니다.</div>;
  }

  return (
    <div className="grid gap-4">
      {scorers.map((scorer, index) => (
        <Card key={scorer.playerId} className="overflow-hidden">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-8 h-8 flex items-center justify-center font-bold text-lg text-muted-foreground">
              {index + 1}
            </div>
            <Avatar className="h-10 w-10">
              <AvatarImage src={`https://placehold.co/100x100/png?text=${scorer.playerName[0]}`} />
              <AvatarFallback>{scorer.playerName[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="font-bold">{scorer.playerName}</div>
              <div className="text-sm text-muted-foreground">{scorer.teamName}</div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-primary">{scorer.goals} <span className="text-sm font-normal text-muted-foreground">골</span></div>
              <div className="text-xs text-muted-foreground">{scorer.matchesPlayed}경기</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
