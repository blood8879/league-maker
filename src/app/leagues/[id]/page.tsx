import { use } from "react";
import { notFound } from "next/navigation";
import { MOCK_LEAGUES } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LeagueStandings } from "@/components/leagues/LeagueStandings";
import { LeagueSchedule } from "@/components/leagues/LeagueSchedule";
import { LeagueTopScorers } from "@/components/leagues/LeagueTopScorers";
import { LeagueInfo } from "@/components/leagues/LeagueInfo";
import { Calendar, MapPin, Users } from "lucide-react";

interface LeaguePageProps {
  params: Promise<{ id: string }>;
}

export default function LeaguePage({ params }: LeaguePageProps) {
  const { id } = use(params);
  const league = MOCK_LEAGUES.find((l) => l.id === id);

  if (!league) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <Badge variant="outline" className="text-lg py-1 px-3">
            {league.level === 'beginner' ? '초급' : league.level === 'intermediate' ? '중급' : '고급'}
          </Badge>
          <Badge className={league.status === 'ongoing' ? 'bg-green-500' : 'bg-blue-500'}>
            {league.status === 'ongoing' ? '진행중' : league.status === 'upcoming' ? '모집중' : '종료'}
          </Badge>
        </div>
        <h1 className="text-4xl font-bold mb-4">{league.name}</h1>
        <div className="flex flex-wrap gap-6 text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            <span>{league.region}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            <span>{league.startDate} ~ {league.endDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <span>{league.teams.length}팀 참가</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="standings" className="space-y-6">
        <TabsList className="w-full justify-start h-auto p-1 bg-muted/50">
          <TabsTrigger value="standings" className="flex-1 md:flex-none py-2 px-6">순위</TabsTrigger>
          <TabsTrigger value="schedule" className="flex-1 md:flex-none py-2 px-6">일정</TabsTrigger>
          <TabsTrigger value="scorers" className="flex-1 md:flex-none py-2 px-6">득점순위</TabsTrigger>
          <TabsTrigger value="info" className="flex-1 md:flex-none py-2 px-6">정보</TabsTrigger>
        </TabsList>

        <TabsContent value="standings">
          <LeagueStandings standings={league.standings} />
        </TabsContent>

        <TabsContent value="schedule">
          <LeagueSchedule matches={league.matches} />
        </TabsContent>

        <TabsContent value="scorers">
          <LeagueTopScorers scorers={league.topScorers} />
        </TabsContent>

        <TabsContent value="info">
          <LeagueInfo league={league} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
