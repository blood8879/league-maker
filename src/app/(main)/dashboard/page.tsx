'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import {
  getUserDashboardStats,
  getUpcomingMatches,
  getPendingMatches,
  getUserTeams,
  type DashboardStats,
  type UpcomingMatch,
  type UserTeam,
} from '@/lib/supabase/queries/dashboard';
import { updateAttendanceStatus } from '@/lib/supabase/queries/attendances';

export default function DashboardPage() {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [upcomingMatches, setUpcomingMatches] = useState<UpcomingMatch[]>([]);
  const [pendingMatches, setPendingMatches] = useState<UpcomingMatch[]>([]);
  const [teams, setTeams] = useState<UserTeam[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;

    setDataLoading(true);
    try {
      const [statsData, upcomingData, pendingData, teamsData] = await Promise.all([
        getUserDashboardStats(user.id),
        getUpcomingMatches(user.id, 5),
        getPendingMatches(user.id),
        getUserTeams(user.id),
      ]);

      setStats(statsData);
      setUpcomingMatches(upcomingData);
      setPendingMatches(pendingData);
      setTeams(teamsData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setDataLoading(false);
    }
  };

  const handleQuickAttendanceChange = async (
    matchId: string,
    status: 'attending' | 'absent' | 'pending'
  ) => {
    if (!user) return;

    const success = await updateAttendanceStatus(matchId, user.id, status);
    if (success) {
      loadDashboardData();
    }
  };

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 환영 메시지 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          안녕하세요, {userProfile?.nickname || '사용자'}님!
        </h1>
        <p className="text-gray-600">오늘도 즐거운 축구 되세요 ⚽</p>
      </div>

      {/* 빠른 액션 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Link
          href="/matches/new"
          className="p-6 bg-blue-50 border-2 border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <h3 className="text-lg font-semibold mb-2">⚽ 경기 생성</h3>
          <p className="text-sm text-gray-600">새로운 경기를 만들어보세요</p>
        </Link>
        <Link
          href="/teams/new"
          className="p-6 bg-green-50 border-2 border-green-200 rounded-lg hover:bg-green-100 transition-colors"
        >
          <h3 className="text-lg font-semibold mb-2">👥 팀 생성</h3>
          <p className="text-sm text-gray-600">새로운 팀을 만들어보세요</p>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* 참석 대기중인 경기 */}
          {pendingMatches.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">⏰ 참석 대기중인 경기</h2>
              <div className="space-y-3">
                {pendingMatches.map((match) => (
                  <div
                    key={match.id}
                    className="bg-white p-4 rounded-lg border border-yellow-300"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold">
                        {match.homeTeam.name} vs {match.awayTeam.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {match.match_date} {match.match_time}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleQuickAttendanceChange(match.id, 'attending')}
                        className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                      >
                        참석
                      </button>
                      <button
                        onClick={() => handleQuickAttendanceChange(match.id, 'absent')}
                        className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                      >
                        불참
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 다가오는 경기 일정 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">📅 다가오는 경기</h2>
            {dataLoading ? (
              <p>로딩 중...</p>
            ) : upcomingMatches.length > 0 ? (
              <div className="space-y-3">
                {upcomingMatches.map((match) => (
                  <Link
                    key={match.id}
                    href={`/matches/${match.id}`}
                    className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold">
                        {match.homeTeam.name} vs {match.awayTeam.name}
                      </div>
                      {match.myAttendance && (
                        <span
                          className={`px-2 py-1 text-xs rounded ${
                            match.myAttendance.status === 'attending'
                              ? 'bg-green-100 text-green-800'
                              : match.myAttendance.status === 'absent'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {match.myAttendance.status === 'attending'
                            ? '참석'
                            : match.myAttendance.status === 'absent'
                              ? '불참'
                              : '미정'}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      {match.match_date} {match.match_time} • {match.venue}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">예정된 경기가 없습니다.</p>
            )}
          </div>
        </div>

        <div className="space-y-8">
          {/* 개인 통계 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">📊 내 통계</h2>
            {dataLoading || !stats ? (
              <p>로딩 중...</p>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">경기 수</span>
                  <span className="font-semibold">{stats.totalMatches}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">득점</span>
                  <span className="font-semibold">{stats.totalGoals}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">도움</span>
                  <span className="font-semibold">{stats.totalAssists}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">참석률</span>
                  <span className="font-semibold">{stats.attendanceRate}%</span>
                </div>
              </div>
            )}
            <Link
              href="/my/stats"
              className="block mt-4 text-center text-blue-600 hover:text-blue-800 text-sm"
            >
              자세히 보기 →
            </Link>
          </div>

          {/* 내 팀 현황 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">👥 내 팀</h2>
            {dataLoading ? (
              <p>로딩 중...</p>
            ) : teams.length > 0 ? (
              <div className="space-y-3">
                {teams.map((team) => (
                  <Link
                    key={team.id}
                    href={`/teams/${team.id}`}
                    className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="font-semibold">{team.name}</div>
                    <div className="text-sm text-gray-600">
                      {team.memberRole === 'captain'
                        ? '주장'
                        : team.memberRole === 'vice_captain'
                          ? '부주장'
                          : '팀원'}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">소속팀이 없습니다.</p>
            )}
            <Link
              href="/my/teams"
              className="block mt-4 text-center text-blue-600 hover:text-blue-800 text-sm"
            >
              팀 관리 →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
