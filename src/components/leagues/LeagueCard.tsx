import Link from "next/link";
import { Calendar, MapPin, Trophy, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { League } from "@/types/league";

interface LeagueCardProps {
  league: League;
}

export function LeagueCard({ league }: LeagueCardProps) {
  const getStatusBadge = (status: League["status"]) => {
    switch (status) {
      case "ongoing":
        return <Badge className="bg-green-500">진행중</Badge>;
      case "upcoming":
        return <Badge className="bg-blue-500">모집중</Badge>;
      case "finished":
        return <Badge variant="secondary">종료</Badge>;
    }
  };

  const getLevelBadge = (level: League["level"]) => {
    switch (level) {
      case "beginner":
        return <Badge variant="outline">초급</Badge>;
      case "intermediate":
        return <Badge variant="outline">중급</Badge>;
      case "advanced":
        return <Badge variant="outline">고급</Badge>;
      default:
        return <Badge variant="outline">{level}</Badge>;
    }
  };

  return (
    <Link href={`/leagues/${league.id}`}>
      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader>
          <div className="flex justify-between items-start mb-2">
            {getStatusBadge(league.status)}
            {getLevelBadge(league.level)}
          </div>
          <CardTitle className="text-xl line-clamp-2">{league.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{league.region}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{league.startDate} ~ {league.endDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>{league.teams.length}팀 참가</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex items-center gap-2 text-sm text-primary font-medium">
            <Trophy className="h-4 w-4" />
            <span>리그 상세 보기</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
