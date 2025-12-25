import { Match } from "@/types/league";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin } from "lucide-react";

interface RecentMatchesProps {
  matches: Match[];
  teamId: string;
}

export function RecentMatches({ matches, teamId }: RecentMatchesProps) {
  if (matches.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>최근 경기 기록</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            아직 경기 기록이 없습니다.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>최근 경기 기록</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {matches.map((match) => {
          const isHome = match.homeTeamId === teamId;
          const teamScore = isHome ? match.score?.home : match.score?.away;
          const opponentScore = isHome ? match.score?.away : match.score?.home;
          const opponentName = isHome
            ? match.awayTeamName
            : match.homeTeamName;

          const result =
            teamScore === undefined || opponentScore === undefined
              ? null
              : teamScore > opponentScore
                ? "win"
                : teamScore < opponentScore
                  ? "loss"
                  : "draw";

          return (
            <div
              key={match.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <Badge
                    variant={
                      result === "win"
                        ? "default"
                        : result === "loss"
                          ? "destructive"
                          : "secondary"
                    }
                    className="shrink-0"
                  >
                    {result === "win" ? "승" : result === "loss" ? "패" : "무"}
                  </Badge>
                  <div className="flex items-center gap-2 text-lg font-semibold">
                    <span className={isHome ? "text-primary" : ""}>
                      {isHome ? "홈" : opponentName}
                    </span>
                    <span className="text-muted-foreground">
                      {teamScore} - {opponentScore}
                    </span>
                    <span className={!isHome ? "text-primary" : ""}>
                      {isHome ? opponentName : "원정"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{match.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{match.venue}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
