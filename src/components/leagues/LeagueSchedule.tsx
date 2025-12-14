import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Match } from "@/types/league";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

interface LeagueScheduleProps {
  matches: Match[];
}

export function LeagueSchedule({ matches }: LeagueScheduleProps) {
  if (!matches || matches.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">경기 일정이 없습니다.</div>;
  }

  // Group matches by date
  const groupedMatches = matches.reduce((acc, match) => {
    const date = match.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(match);
    return acc;
  }, {} as Record<string, Match[]>);

  const sortedDates = Object.keys(groupedMatches).sort();

  return (
    <div className="space-y-6">
      {sortedDates.map((date) => (
        <div key={date}>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <span className="w-1 h-6 bg-primary rounded-full"></span>
            {format(new Date(date), "yyyy년 M월 d일 EEEE", { locale: ko })}
          </h3>
          <div className="grid gap-3">
            {groupedMatches[date].map((match) => (
              <Card key={match.id} className="overflow-hidden">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="text-sm text-muted-foreground w-12 text-center">
                      {match.time}
                    </div>
                    <div className="flex-1 flex items-center justify-end gap-3">
                      <span className="font-medium text-right">{match.homeTeamName}</span>
                      {/* Logo placeholder */}
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-xs">H</div>
                    </div>
                    <div className="px-4 py-1 bg-muted rounded text-sm font-bold min-w-[80px] text-center">
                      {match.status === 'finished' && match.score ? (
                        `${match.score.home} : ${match.score.away}`
                      ) : (
                        <Badge variant="outline">VS</Badge>
                      )}
                    </div>
                    <div className="flex-1 flex items-center justify-start gap-3">
                      {/* Logo placeholder */}
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-xs">A</div>
                      <span className="font-medium text-left">{match.awayTeamName}</span>
                    </div>
                  </div>
                  <div className="ml-4 hidden md:block">
                    <Badge variant={match.status === 'finished' ? "secondary" : "default"}>
                      {match.status === 'finished' ? "종료" : "예정"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
