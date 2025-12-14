"use client";

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MatchScore } from '@/types/match';

interface ScoreboardProps {
  homeTeamName: string;
  awayTeamName: string;
  homeTeamLogo?: string;
  awayTeamLogo?: string;
  score: MatchScore;
}

export function Scoreboard({
  homeTeamName,
  awayTeamName,
  homeTeamLogo,
  awayTeamLogo,
  score,
}: ScoreboardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-7 gap-4 items-center">
          {/* Home Team */}
          <div className="col-span-3 flex items-center justify-end gap-3">
            {homeTeamLogo && (
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                <Image
                  src={homeTeamLogo}
                  alt={homeTeamName}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="text-right">
              <div className="font-bold text-lg">{homeTeamName}</div>
              <Badge variant="outline" className="mt-1">홈</Badge>
            </div>
          </div>

          {/* Score */}
          <div className="col-span-1 flex items-center justify-center">
            <div className="text-4xl md:text-6xl font-bold font-mono tabular-nums">
              {score.home}
              <span className="text-muted-foreground mx-1 md:mx-2">:</span>
              {score.away}
            </div>
          </div>

          {/* Away Team */}
          <div className="col-span-3 flex items-center justify-start gap-3">
            <div className="text-left">
              <div className="font-bold text-lg">{awayTeamName}</div>
              <Badge variant="outline" className="mt-1">원정</Badge>
            </div>
            {awayTeamLogo && (
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                <Image
                  src={awayTeamLogo}
                  alt={awayTeamName}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
