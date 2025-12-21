"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function LiveMatches() {
  const matches = [
    {
      id: 1,
      homeTeam: "FC 강남",
      awayTeam: "송파 유나이티드",
      homeScore: 2,
      awayScore: 1,
      time: "72'",
      status: "LIVE",
    },
    {
      id: 2,
      homeTeam: "분당 위너스",
      awayTeam: "판교 테크",
      homeScore: 0,
      awayScore: 0,
      time: "23'",
      status: "LIVE",
    },
    {
      id: 3,
      homeTeam: "마포 시티",
      awayTeam: "용산 드래곤즈",
      homeScore: 1,
      awayScore: 3,
      time: "88'",
      status: "LIVE",
    },
  ];

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <h2 className="text-2xl font-bold text-foreground">LIVE 진행 중인 경기</h2>
          </div>
          <Link href="/matches" className="text-sm font-medium text-primary hover:underline">
            전체 보기
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {matches.map((match) => (
            <Card key={match.id} className="overflow-hidden hover:shadow-lg transition-shadow border-gray-200">
              <CardContent className="p-0">
                <div className="bg-gray-50 p-3 flex justify-between items-center border-b border-gray-100">
                  <Badge variant="destructive" className="animate-pulse">LIVE</Badge>
                  <span className="text-sm font-mono text-red-500 font-bold">{match.time}</span>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex flex-col items-center w-1/3">
                      <div className="w-12 h-12 rounded-full bg-gray-200 mb-2 flex items-center justify-center text-xs text-gray-500">
                        Logo
                      </div>
                      <span className="text-sm font-semibold text-center truncate w-full">{match.homeTeam}</span>
                    </div>
                    <div className="flex flex-col items-center w-1/3">
                      <div className="text-3xl font-bold text-foreground tracking-widest">
                        {match.homeScore} - {match.awayScore}
                      </div>
                    </div>
                    <div className="flex flex-col items-center w-1/3">
                      <div className="w-12 h-12 rounded-full bg-gray-200 mb-2 flex items-center justify-center text-xs text-gray-500">
                        Logo
                      </div>
                      <span className="text-sm font-semibold text-center truncate w-full">{match.awayTeam}</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full mt-2" asChild>
                    <Link href={`/matches/${match.id}`}>경기 보기</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
