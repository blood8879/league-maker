import Link from "next/link";
import { MOCK_MATCHES } from "@/lib/mock-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users } from "lucide-react";

export default function MatchesPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">경기 관리</h1>
          <p className="text-muted-foreground">
            예정된 경기와 완료된 경기를 확인하고 관리하세요
          </p>
        </div>
        <Link href="/matches/new">
          <Button>새 경기 생성</Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {MOCK_MATCHES.map((match) => (
          <Card key={match.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Badge variant={match.status === 'finished' ? 'secondary' : 'default'}>
                  {match.status === 'finished' ? '완료' : '예정'}
                </Badge>
                <Badge variant="outline">
                  {match.type === 'friendly' ? '친선경기' : '리그'}
                </Badge>
              </div>
              <CardTitle className="text-xl">
                {match.homeTeamName} vs {match.awayTeamName}
              </CardTitle>
              {match.score && (
                <CardDescription className="text-2xl font-bold text-primary">
                  {match.score.home} - {match.score.away}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="mr-2 h-4 w-4" />
                {match.date} {match.time}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="mr-2 h-4 w-4" />
                {match.venue}
              </div>
              {match.mercenaryRecruitment?.enabled && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="mr-2 h-4 w-4" />
                  용병 모집 중 ({match.mercenaryRecruitment.count}명)
                </div>
              )}

              <div className="flex gap-2 mt-4">
                <Link href={`/matches/${match.id}`} className="flex-1">
                  <Button variant="outline" className="w-full">
                    상세보기
                  </Button>
                </Link>
                {match.status !== 'finished' && (
                  <Link href={`/matches/${match.id}/record`} className="flex-1">
                    <Button className="w-full">
                      경기 기록
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {MOCK_MATCHES.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            아직 생성된 경기가 없습니다
          </p>
          <Link href="/matches/new">
            <Button>첫 경기 만들기</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
