"use client";

import { use, useState } from "react";
import { notFound } from "next/navigation";
import { MOCK_MATCHES } from "@/lib/mock-data";
import { Match as LeagueMatch, MatchEvent as LeagueMatchEvent } from "@/types/league";
import { Match, MatchEvent, EventType } from "@/types/match";
import { MatchInfoHeader } from "@/components/matches/MatchInfoHeader";
import { MatchAttendance } from "@/components/matches/MatchAttendance";
import { MercenaryRecruitment } from "@/components/matches/MercenaryRecruitment";
import { MatchResultHeader } from "@/components/matches/result/MatchResultHeader";
import { OverviewTab } from "@/components/matches/result/OverviewTab";
import { EventsTab } from "@/components/matches/result/EventsTab";
import { LineupTab } from "@/components/matches/result/LineupTab";
import { StatsTab } from "@/components/matches/result/StatsTab";
import { AttendanceTab } from "@/components/matches/result/AttendanceTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MatchPageProps {
  params: Promise<{ id: string }>;
}

// 리그 Match를 결과 컴포넌트용 Match로 변환
function normalizeMatch(leagueMatch: LeagueMatch): Match {
  const normalizeEvent = (event: LeagueMatchEvent): MatchEvent => {
    // MatchEventType을 EventType으로 변환
    let type: EventType;
    switch (event.type) {
      case 'goal':
        type = 'goal';
        break;
      case 'yellow_card':
        type = 'yellow';
        break;
      case 'red_card':
        type = 'red';
        break;
      case 'substitution':
        type = 'substitution';
        break;
    }

    return {
      id: event.id,
      type,
      teamId: event.teamId,
      playerId: event.playerId,
      minute: event.time,
      phase: event.time <= 45 ? 'first-half' : 'second-half',
      relatedPlayerId: event.assistPlayerId || event.subInPlayerId,
      reason: event.reason,
    };
  };

  // Lineup 객체를 PlayerLineup[] 배열로 변환
  const normalizeLineup = (lineup: { starting: string[]; substitutes: string[] } | undefined) => {
    if (!lineup) return undefined;

    const players: Array<{
      playerId: string;
      name: string;
      position: string;
      number: number;
      isStarter: boolean;
    }> = [];

    // 선발 라인업
    lineup.starting.forEach((playerId, index) => {
      players.push({
        playerId,
        name: playerId, // 임시: playerId를 이름으로 사용
        position: 'FW', // 임시: 기본 포지션
        number: index + 1, // 임시: 순서대로 등번호
        isStarter: true,
      });
    });

    // 교체 선수
    lineup.substitutes.forEach((playerId, index) => {
      players.push({
        playerId,
        name: playerId, // 임시: playerId를 이름으로 사용
        position: 'SUB', // 임시: 교체 선수 표시
        number: lineup.starting.length + index + 1, // 임시: 이어서 등번호
        isStarter: false,
      });
    });

    return players;
  };

  return {
    ...leagueMatch,
    events: leagueMatch.events?.map(normalizeEvent),
    homeLineup: normalizeLineup(leagueMatch.homeLineup),
    awayLineup: normalizeLineup(leagueMatch.awayLineup),
  } as Match;
}

export default function MatchPage({ params }: MatchPageProps) {
  const { id } = use(params);
  const match = MOCK_MATCHES.find((m) => m.id === id);
  const [activeTab, setActiveTab] = useState("overview");

  if (!match) {
    notFound();
  }

  // 경기 종료 후: 결과 페이지
  if (match.status === "finished") {
    const normalizedMatch = normalizeMatch(match);

    return (
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <MatchResultHeader match={normalizedMatch} />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="overview">개요</TabsTrigger>
            <TabsTrigger value="events">기록</TabsTrigger>
            <TabsTrigger value="lineup">라인업</TabsTrigger>
            <TabsTrigger value="stats">통계</TabsTrigger>
            <TabsTrigger value="attendance">참석</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <OverviewTab match={normalizedMatch} />
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <EventsTab match={normalizedMatch} />
          </TabsContent>

          <TabsContent value="lineup" className="space-y-6">
            <LineupTab match={normalizedMatch} />
          </TabsContent>

          <TabsContent value="stats" className="space-y-6">
            <StatsTab match={normalizedMatch} />
          </TabsContent>

          <TabsContent value="attendance" className="space-y-6">
            <AttendanceTab match={normalizedMatch} />
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  // 경기 전/진행중: 기존 페이지
  return (
    <div className="container mx-auto py-8 px-4">
      <MatchInfoHeader match={match} />

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <MercenaryRecruitment match={match} />
          <MatchAttendance match={match} />
        </div>

        <div className="space-y-6">
          {/* Additional sidebar content can go here (e.g. Weather, Map) */}
        </div>
      </div>
    </div>
  );
}
