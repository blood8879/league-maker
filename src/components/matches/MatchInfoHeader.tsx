import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Match } from "@/types/league";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { MapPin, Calendar, Clock } from "lucide-react";

interface MatchInfoHeaderProps {
  match: Match;
}

export function MatchInfoHeader({ match }: MatchInfoHeaderProps) {
  const getStatusBadge = (status: Match["status"]) => {
    switch (status) {
      case "scheduled":
        return <Badge className="bg-blue-500">예정</Badge>;
      case "live":
        return <Badge className="bg-red-500 animate-pulse">진행중</Badge>;
      case "finished":
        return <Badge variant="secondary">종료</Badge>;
    }
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-2">
            {getStatusBadge(match.status)}
            <Badge variant="outline">
              {match.type === 'league' ? '리그 경기' : 
               match.type === 'friendly' ? '친선 경기' : 
               match.type === 'cup' ? '컵 대회' : '연습 경기'}
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(match.date), "yyyy년 M월 d일 (EEE)", { locale: ko })}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{match.time}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{match.venue}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex-1 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl font-bold">
              {match.homeTeamName[0]}
            </div>
            <h2 className="text-xl font-bold">{match.homeTeamName}</h2>
          </div>

          <div className="px-8 text-center">
            {match.status === 'finished' && match.score ? (
              <div className="text-4xl font-bold tracking-widest">
                {match.score.home} : {match.score.away}
              </div>
            ) : (
              <div className="text-2xl font-bold text-muted-foreground">VS</div>
            )}
          </div>

          <div className="flex-1 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl font-bold">
              {match.awayTeamName[0]}
            </div>
            <h2 className="text-xl font-bold">{match.awayTeamName}</h2>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
