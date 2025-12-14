"use client";

import { useState } from "react";
import { Match, MatchType } from "@/types/match";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, MapPin, Trophy, Share2, Check } from "lucide-react";

interface MatchResultHeaderProps {
  match: Match;
}

const getMatchTypeLabel = (type: MatchType): string => {
  const labels: Record<MatchType, string> = {
    league: "리그",
    cup: "컵대회",
    friendly: "친선경기",
    practice: "연습경기",
  };
  return labels[type];
};

const getMatchTypeColor = (type: MatchType): string => {
  const colors: Record<MatchType, string> = {
    league: "bg-blue-100 text-blue-700 border-blue-200",
    cup: "bg-purple-100 text-purple-700 border-purple-200",
    friendly: "bg-green-100 text-green-700 border-green-200",
    practice: "bg-gray-100 text-gray-700 border-gray-200",
  };
  return colors[type];
};

export function MatchResultHeader({ match }: MatchResultHeaderProps) {
  const homeScore = match.score?.home ?? 0;
  const awayScore = match.score?.away ?? 0;
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6 md:p-8">
        {/* 상태 및 타입 뱃지와 공유 버튼 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            <Badge className="bg-gray-900 text-white border-gray-800">
              경기 종료
            </Badge>
            <Badge className={getMatchTypeColor(match.type)}>
              {getMatchTypeLabel(match.type)}
            </Badge>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="gap-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                복사됨
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                공유
              </>
            )}
          </Button>
        </div>

        {/* 스코어보드 */}
        <div className="flex items-center justify-center gap-4 md:gap-8 mb-6">
          {/* 홈팀 */}
          <div className="flex-1 text-center md:text-right">
            <div className="flex items-center justify-center md:justify-end gap-3 mb-2">
              {match.homeTeamLogo && (
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                  <span className="text-2xl">{match.homeTeamLogo}</span>
                </div>
              )}
              <h2 className="text-lg md:text-2xl font-bold">{match.homeTeamName}</h2>
            </div>
            <div className="text-5xl md:text-7xl font-bold text-primary">
              {homeScore}
            </div>
          </div>

          {/* VS */}
          <div className="flex flex-col items-center">
            <div className="text-2xl md:text-3xl font-bold text-muted-foreground">
              VS
            </div>
          </div>

          {/* 원정팀 */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              <h2 className="text-lg md:text-2xl font-bold">{match.awayTeamName}</h2>
              {match.awayTeamLogo && (
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                  <span className="text-2xl">{match.awayTeamLogo}</span>
                </div>
              )}
            </div>
            <div className="text-5xl md:text-7xl font-bold text-primary">
              {awayScore}
            </div>
          </div>
        </div>

        {/* 경기 정보 */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm md:text-base text-muted-foreground border-t pt-4">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4" />
            <span>{match.date} {match.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{match.venue}</span>
          </div>
          {match.leagueId && (
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              <span>리그 경기</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
