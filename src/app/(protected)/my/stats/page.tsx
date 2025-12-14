'use client';

import { StatCard } from '@/components/dashboard/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockUserStats, mockSeasonStats, mockTeamStats } from '@/data/dashboard-mock';
import { Trophy, TrendingUp, Target, Users, AlertTriangle, Award } from 'lucide-react';

export default function MyStatsPage() {
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-6">
      {/* 헤더 */}
      <div>
        <h1 className="text-3xl font-bold">내 통계</h1>
        <p className="text-muted-foreground mt-1">
          나의 경기 기록과 통계를 확인하세요
        </p>
      </div>

      {/* 전체 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="총 경기 수"
          value={mockUserStats.matchCount}
          icon={Trophy}
        />
        <StatCard
          title="참석률"
          value={`${mockUserStats.attendanceRate.toFixed(1)}%`}
          icon={TrendingUp}
        />
        <StatCard
          title="득점"
          value={mockUserStats.goals}
          icon={Target}
        />
        <StatCard
          title="도움"
          value={mockUserStats.assists}
          icon={Users}
        />
        <StatCard
          title="경고"
          value={mockUserStats.yellowCards}
          icon={AlertTriangle}
          className="text-yellow-600"
        />
        <StatCard
          title="퇴장"
          value={mockUserStats.redCards}
          icon={Award}
          className="text-red-600"
        />
      </div>

      {/* 시즌별 통계 */}
      <Card>
        <CardHeader>
          <CardTitle>시즌별 통계</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-semibold">시즌</th>
                  <th className="text-center p-3 font-semibold">경기</th>
                  <th className="text-center p-3 font-semibold">참석률</th>
                  <th className="text-center p-3 font-semibold">득점</th>
                  <th className="text-center p-3 font-semibold">도움</th>
                  <th className="text-center p-3 font-semibold">경고</th>
                  <th className="text-center p-3 font-semibold">퇴장</th>
                </tr>
              </thead>
              <tbody>
                {mockSeasonStats.map((season) => (
                  <tr key={season.season} className="border-b hover:bg-accent/50">
                    <td className="p-3">
                      <div className="font-medium">{season.season}</div>
                    </td>
                    <td className="text-center p-3">{season.matchCount}</td>
                    <td className="text-center p-3">
                      <span className={
                        season.attendanceRate >= 80
                          ? 'text-green-600 font-medium'
                          : season.attendanceRate >= 60
                          ? 'text-yellow-600 font-medium'
                          : 'text-red-600 font-medium'
                      }>
                        {season.attendanceRate.toFixed(1)}%
                      </span>
                    </td>
                    <td className="text-center p-3">{season.goals}</td>
                    <td className="text-center p-3">{season.assists}</td>
                    <td className="text-center p-3 text-yellow-600">{season.yellowCards}</td>
                    <td className="text-center p-3 text-red-600">{season.redCards}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 팀별 통계 */}
      <Card>
        <CardHeader>
          <CardTitle>팀별 통계</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-semibold">팀명</th>
                  <th className="text-center p-3 font-semibold">경기</th>
                  <th className="text-center p-3 font-semibold">참석률</th>
                  <th className="text-center p-3 font-semibold">득점</th>
                  <th className="text-center p-3 font-semibold">도움</th>
                </tr>
              </thead>
              <tbody>
                {mockTeamStats.map((team) => (
                  <tr key={team.teamId} className="border-b hover:bg-accent/50">
                    <td className="p-3">
                      <div className="font-medium">{team.teamName}</div>
                    </td>
                    <td className="text-center p-3">{team.matchCount}</td>
                    <td className="text-center p-3">
                      <span className={
                        team.attendanceRate >= 80
                          ? 'text-green-600 font-medium'
                          : team.attendanceRate >= 60
                          ? 'text-yellow-600 font-medium'
                          : 'text-red-600 font-medium'
                      }>
                        {team.attendanceRate.toFixed(1)}%
                      </span>
                    </td>
                    <td className="text-center p-3">{team.goals}</td>
                    <td className="text-center p-3">{team.assists}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
