'use client';

import { useAuth } from '@/contexts/AuthContext';
import { StatCard } from '@/components/dashboard/stat-card';
import { MatchCard } from '@/components/dashboard/match-card';
import { TeamCard } from '@/components/dashboard/team-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  mockUpcomingMatches,
  mockPendingMatches,
  mockMyTeams,
  mockUserStats,
} from '@/data/dashboard-mock';
import {
  Trophy,
  Users,
  Target,
  TrendingUp,
  Plus,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  const { user } = useAuth();
  const [upcomingMatches, setUpcomingMatches] = useState(mockUpcomingMatches);
  const [pendingMatches, setPendingMatches] = useState(mockPendingMatches);

  const handleAttendanceChange = (matchId: string, status: 'attending' | 'absent' | 'pending') => {
    // 다가오는 경기 목록 업데이트
    setUpcomingMatches((prev) =>
      prev.map((match) =>
        match.id === matchId ? { ...match, myAttendance: status } : match
      )
    );

    // 참석 대기중인 경기 목록 업데이트
    if (status === 'pending') {
      // 미정으로 변경된 경우 추가
      const match = upcomingMatches.find((m) => m.id === matchId);
      if (match && !pendingMatches.find((m) => m.id === matchId)) {
        setPendingMatches((prev) => [...prev, { ...match, myAttendance: status }]);
      }
    } else {
      // 참석/불참으로 변경된 경우 제거
      setPendingMatches((prev) => prev.filter((m) => m.id !== matchId));
    }
  };

  const handleLeaveTeam = (teamId: string) => {
    console.log('팀 탈퇴:', teamId);
    // 실제 구현은 나중에
  };

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-8">
      {/* 환영 메시지 */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">
          안녕하세요, {user?.nickname || '사용자'}님! 👋
        </h1>
        <p className="text-muted-foreground">
          오늘도 즐거운 축구 하세요!
        </p>
      </div>

      {/* 빠른 액션 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/matches/new">
          <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">경기 생성</h3>
                  <p className="text-sm text-muted-foreground">새로운 경기를 만들어보세요</p>
                </div>
                <Plus className="h-5 w-5 ml-auto text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/teams/new">
          <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">팀 생성</h3>
                  <p className="text-sm text-muted-foreground">새로운 팀을 만들어보세요</p>
                </div>
                <Plus className="h-5 w-5 ml-auto text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* 참석 대기중인 경기 */}
      {pendingMatches.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              <CardTitle>참석 여부를 결정해주세요</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingMatches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                showQuickActions
                onAttendanceChange={handleAttendanceChange}
              />
            ))}
          </CardContent>
        </Card>
      )}

      {/* 다가오는 경기 일정 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>다가오는 경기 일정</CardTitle>
            <Link href="/my/matches">
              <Button variant="ghost" size="sm">
                전체 보기
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {upcomingMatches.length > 0 ? (
            <div className="space-y-4">
              {upcomingMatches.slice(0, 5).map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  showQuickActions
                  onAttendanceChange={handleAttendanceChange}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>예정된 경기가 없습니다</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 내 팀 현황 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>내 팀</CardTitle>
            <Link href="/my/teams">
              <Button variant="ghost" size="sm">
                전체 보기
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {mockMyTeams.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockMyTeams.map((team) => (
                <TeamCard key={team.id} team={team} onLeaveTeam={handleLeaveTeam} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>소속된 팀이 없습니다</p>
              <Link href="/teams">
                <Button variant="outline" className="mt-4">
                  팀 찾아보기
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 개인 통계 위젯 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
      </div>
    </div>
  );
}
