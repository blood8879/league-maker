"use client";

import { Match } from '@/types/match';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatsTabProps {
  match: Match;
}

export function StatsTab({ match }: StatsTabProps) {
  const stats = match.stats;

  if (!stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>경기 통계</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            경기 통계 정보가 없습니다
          </div>
        </CardContent>
      </Card>
    );
  }

  // 통계 항목 렌더링
  const renderStatRow = (
    label: string,
    homeValue: number,
    awayValue: number,
    showPercentage?: boolean
  ) => {
    const total = homeValue + awayValue;
    const homePercent = total > 0 ? (homeValue / total) * 100 : 50;
    const awayPercent = total > 0 ? (awayValue / total) * 100 : 50;

    return (
      <div className="space-y-2">
        {/* 라벨 */}
        <div className="text-center text-sm font-medium text-muted-foreground">
          {label}
        </div>

        {/* 값과 바 */}
        <div className="flex items-center gap-4">
          {/* 홈팀 값 */}
          <div className="w-12 text-right font-bold">
            {showPercentage ? `${homeValue}%` : homeValue}
          </div>

          {/* 프로그레스 바 */}
          <div className="flex-1 flex h-6 rounded-full overflow-hidden bg-muted">
            <div
              className="bg-blue-500 flex items-center justify-end pr-2"
              style={{ width: `${homePercent}%` }}
            >
              {homePercent > 20 && (
                <span className="text-xs text-white font-medium">
                  {Math.round(homePercent)}%
                </span>
              )}
            </div>
            <div
              className="bg-red-500 flex items-center justify-start pl-2"
              style={{ width: `${awayPercent}%` }}
            >
              {awayPercent > 20 && (
                <span className="text-xs text-white font-medium">
                  {Math.round(awayPercent)}%
                </span>
              )}
            </div>
          </div>

          {/* 원정팀 값 */}
          <div className="w-12 text-left font-bold">
            {showPercentage ? `${awayValue}%` : awayValue}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* 팀 이름 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between text-lg font-bold">
            <div className="text-blue-600">{match.homeTeamName}</div>
            <div className="text-muted-foreground">VS</div>
            <div className="text-red-600">{match.awayTeamName}</div>
          </div>
        </CardContent>
      </Card>

      {/* 통계 */}
      <Card>
        <CardHeader>
          <CardTitle>경기 통계</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 점유율 */}
          {stats.homePossession !== undefined && stats.awayPossession !== undefined && (
            renderStatRow(
              '점유율',
              stats.homePossession,
              stats.awayPossession,
              true
            )
          )}

          {/* 슈팅 */}
          {renderStatRow('슈팅', stats.homeShots, stats.awayShots)}

          {/* 코너킥 */}
          {renderStatRow('코너킥', stats.homeCorners, stats.awayCorners)}

          {/* 파울 */}
          {renderStatRow('파울', stats.homeFouls, stats.awayFouls)}
        </CardContent>
      </Card>

      {/* 요약 */}
      <Card>
        <CardHeader>
          <CardTitle>통계 요약</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {/* 홈팀 */}
            <div className="space-y-2">
              <h3 className="font-semibold text-blue-600">{match.homeTeamName}</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">슈팅</span>
                  <span className="font-medium">{stats.homeShots}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">코너킥</span>
                  <span className="font-medium">{stats.homeCorners}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">파울</span>
                  <span className="font-medium">{stats.homeFouls}</span>
                </div>
                {stats.homePossession !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">점유율</span>
                    <span className="font-medium">{stats.homePossession}%</span>
                  </div>
                )}
              </div>
            </div>

            {/* 원정팀 */}
            <div className="space-y-2">
              <h3 className="font-semibold text-red-600">{match.awayTeamName}</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">슈팅</span>
                  <span className="font-medium">{stats.awayShots}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">코너킥</span>
                  <span className="font-medium">{stats.awayCorners}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">파울</span>
                  <span className="font-medium">{stats.awayFouls}</span>
                </div>
                {stats.awayPossession !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">점유율</span>
                    <span className="font-medium">{stats.awayPossession}%</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
