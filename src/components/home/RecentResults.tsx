"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function RecentResults() {
  const results = [
    {
      id: 1,
      date: "11/21 (목) 20:00",
      type: "리그전",
      league: "2024 강남구 주말리그",
      homeTeam: "FC 강남",
      awayTeam: "서초 라이온즈",
      score: "3 - 1",
      winner: "home",
    },
    {
      id: 2,
      date: "11/21 (목) 19:00",
      type: "연습경기",
      league: "관악구 친선 매치",
      homeTeam: "관악 마운틴",
      awayTeam: "동작 웨이브",
      score: "2 - 2",
      winner: "draw",
    },
    {
      id: 3,
      date: "11/20 (수) 21:00",
      type: "컵대회",
      league: "제5회 직장인 챔피언스컵",
      homeTeam: "송파 유나이티드",
      awayTeam: "강동 타이거즈",
      score: "0 - 1",
      winner: "away",
    },
    {
      id: 4,
      date: "11/20 (수) 20:00",
      type: "리그전",
      league: "수도권 아마추어 1부 리그",
      homeTeam: "노원 이글스",
      awayTeam: "도봉 피닉스",
      score: "4 - 2",
      winner: "home",
    },
    {
      id: 5,
      date: "11/19 (화) 19:30",
      type: "리그전",
      league: "성동구 직장인 리그",
      homeTeam: "성동 스타즈",
      awayTeam: "광진 히어로즈",
      score: "1 - 1",
      winner: "draw",
    },
    {
      id: 6,
      date: "11/19 (화) 20:00",
      type: "연습경기",
      league: "중랑구 풋살 친선",
      homeTeam: "중랑 스톰",
      awayTeam: "동대문 킹스",
      score: "2 - 5",
      winner: "away",
    },
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h2 className="text-3xl font-bold text-foreground">최근 경기 결과</h2>
          <div className="flex space-x-2">
            <Button variant="secondary" size="sm" className="bg-primary text-white hover:bg-primary/90">전체</Button>
            <Button variant="outline" size="sm">리그전</Button>
            <Button variant="outline" size="sm">컵대회</Button>
            <Button variant="outline" size="sm">연습경기</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((match) => (
            <Card key={match.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col mb-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-sm text-primary line-clamp-1 mr-2">{match.league}</span>
                    <Badge variant="outline" className="shrink-0">{match.type}</Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">{match.date}</span>
                </div>
                
                <div className="flex justify-between items-center mb-6">
                  <div className={`flex flex-col items-center w-1/3 ${match.winner === 'home' ? 'font-bold text-foreground' : 'text-muted-foreground'}`}>
                    <span className="text-lg text-center truncate w-full">{match.homeTeam}</span>
                  </div>
                  <div className="text-2xl font-bold text-foreground mx-2">
                    {match.score}
                  </div>
                  <div className={`flex flex-col items-center w-1/3 ${match.winner === 'away' ? 'font-bold text-foreground' : 'text-muted-foreground'}`}>
                    <span className="text-lg text-center truncate w-full">{match.awayTeam}</span>
                  </div>
                </div>
                
                <Button variant="ghost" className="w-full text-primary hover:text-primary/80 h-auto py-2" asChild>
                  <Link href={`/matches/${match.id}`}>경기 상세 &gt;</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
