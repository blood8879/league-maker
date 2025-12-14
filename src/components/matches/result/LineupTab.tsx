"use client";

import { Match, PlayerLineup } from '@/types/match';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, Zap, AlertCircle, XCircle, Repeat } from 'lucide-react';

interface LineupTabProps {
  match: Match;
}

interface PlayerStats {
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  substituted?: boolean;
  substitutedAt?: number;
}

export function LineupTab({ match }: LineupTabProps) {
  const events = match.events || [];

  // 선수별 통계 계산
  const getPlayerStats = (playerId: string): PlayerStats => {
    const stats: PlayerStats = {
      goals: 0,
      assists: 0,
      yellowCards: 0,
      redCards: 0,
    };

    events.forEach(event => {
      if (event.playerId === playerId) {
        if (event.type === 'goal') stats.goals += 1;
        if (event.type === 'yellow') stats.yellowCards += 1;
        if (event.type === 'red') stats.redCards += 1;
        if (event.type === 'substitution') {
          stats.substituted = true;
          stats.substitutedAt = event.minute;
        }
      }
      if (event.relatedPlayerId === playerId && event.type === 'goal') {
        stats.assists += 1;
      }
      if (event.relatedPlayerId === playerId && event.type === 'substitution') {
        // 교체로 들어온 선수
        stats.substituted = false; // 들어온 선수는 substituted가 아님
      }
    });

    return stats;
  };

  // 선수 카드 렌더링
  const renderPlayer = (player: PlayerLineup) => {
    const stats = getPlayerStats(player.playerId);
    const isSubstituted = player.isSubstituted || stats.substituted;

    return (
      <div
        key={player.playerId}
        className={`p-3 rounded-lg border ${
          isSubstituted ? 'bg-muted/50 opacity-75' : 'bg-card'
        }`}
      >
        <div className="flex items-center gap-3">
          {/* 등번호 */}
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold">
            {player.number}
          </div>

          {/* 선수 정보 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold truncate">{player.name}</span>
              {isSubstituted && (
                <Badge variant="outline" className="text-xs">
                  <Repeat className="w-3 h-3 mr-1" />
                  {stats.substitutedAt}&apos;
                </Badge>
              )}
            </div>
            <div className="text-sm text-muted-foreground">{player.position}</div>
          </div>

          {/* 기록 */}
          <div className="flex items-center gap-2">
            {stats.goals > 0 && (
              <Badge variant="secondary" className="gap-1">
                <Target className="w-3 h-3 text-green-600" />
                {stats.goals}
              </Badge>
            )}
            {stats.assists > 0 && (
              <Badge variant="secondary" className="gap-1">
                <Zap className="w-3 h-3 text-blue-600" />
                {stats.assists}
              </Badge>
            )}
            {stats.yellowCards > 0 && (
              <Badge variant="secondary" className="gap-1">
                <AlertCircle className="w-3 h-3 text-yellow-500" />
                {stats.yellowCards}
              </Badge>
            )}
            {stats.redCards > 0 && (
              <Badge variant="secondary" className="gap-1">
                <XCircle className="w-3 h-3 text-red-600" />
                {stats.redCards}
              </Badge>
            )}
          </div>
        </div>
      </div>
    );
  };

  // 팀 라인업 렌더링
  const renderTeamLineup = (
    lineup: PlayerLineup[] | undefined,
    teamName: string
  ) => {
    if (!lineup || lineup.length === 0) {
      return (
        <Card>
          <CardHeader>
            <CardTitle>{teamName}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              라인업 정보가 없습니다
            </div>
          </CardContent>
        </Card>
      );
    }

    const starters = lineup.filter(p => p.isStarter);
    const substitutes = lineup.filter(p => !p.isStarter);

    return (
      <Card>
        <CardHeader>
          <CardTitle>{teamName}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 선발 라인업 */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-muted-foreground">
              선발 라인업 ({starters.length}명)
            </h3>
            <div className="space-y-2">
              {starters.map(player => renderPlayer(player))}
            </div>
          </div>

          {/* 교체 선수 */}
          {substitutes.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-3 text-muted-foreground">
                교체 선수 ({substitutes.length}명)
              </h3>
              <div className="space-y-2">
                {substitutes.map(player => renderPlayer(player))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* 범례 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-green-600" />
              <span>득점</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-600" />
              <span>어시스트</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-500" />
              <span>경고</span>
            </div>
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-600" />
              <span>퇴장</span>
            </div>
            <div className="flex items-center gap-2">
              <Repeat className="w-4 h-4" />
              <span>교체</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 팀별 라인업 */}
      <div className="grid md:grid-cols-2 gap-6">
        {renderTeamLineup(match.homeLineup, match.homeTeamName)}
        {renderTeamLineup(match.awayLineup, match.awayTeamName)}
      </div>
    </div>
  );
}
