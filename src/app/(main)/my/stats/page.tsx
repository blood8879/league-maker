'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import {
  getUserStats,
  getTeamStats,
  getAttendanceStats,
  getSeasonStats,
  type UserStats,
  type TeamStats,
  type AttendanceStats,
} from '@/lib/supabase/queries/user-stats';

export default function MyStatsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [teamStats, setTeamStats] = useState<TeamStats[]>([]);
  const [attendanceStats, setAttendanceStats] = useState<AttendanceStats | null>(null);
  const [seasonStats, setSeasonStats] = useState<UserStats | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      loadStats();
    }
  }, [user, selectedYear]);

  const loadStats = async () => {
    if (!user) return;

    setDataLoading(true);
    try {
      const [totalStats, teamStatsData, attendanceStatsData, seasonStatsData] = await Promise.all([
        getUserStats(user.id),
        getTeamStats(user.id),
        getAttendanceStats(user.id),
        getSeasonStats(user.id, selectedYear),
      ]);

      setStats(totalStats);
      setTeamStats(teamStatsData);
      setAttendanceStats(attendanceStatsData);
      setSeasonStats(seasonStatsData);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setDataLoading(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">내 통계</h1>

      {dataLoading ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">로딩 중...</div>
      ) : (
        <div className="space-y-6">
          {/* 전체 통계 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">📊 전체 통계</h2>
            {stats ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.totalMatches}</div>
                  <div className="text-sm text-gray-600 mt-1">경기 수</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.totalGoals}</div>
                  <div className="text-sm text-gray-600 mt-1">득점</div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-600">{stats.totalAssists}</div>
                  <div className="text-sm text-gray-600 mt-1">도움</div>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {stats.totalYellowCards}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">경고</div>
                </div>
                <div className="p-4 bg-red-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-red-600">{stats.totalRedCards}</div>
                  <div className="text-sm text-gray-600 mt-1">퇴장</div>
                </div>
                <div className="p-4 bg-indigo-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-indigo-600">
                    {stats.attendanceRate}%
                  </div>
                  <div className="text-sm text-gray-600 mt-1">참석률</div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">통계 데이터가 없습니다.</p>
            )}
          </div>

          {/* 참석률 통계 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">📅 참석률 통계</h2>
            {attendanceStats ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <div className="text-2xl font-bold">{attendanceStats.total}</div>
                  <div className="text-sm text-gray-600 mt-1">전체 경기</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {attendanceStats.attended}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">참석</div>
                </div>
                <div className="p-4 bg-red-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-red-600">{attendanceStats.absent}</div>
                  <div className="text-sm text-gray-600 mt-1">불참</div>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {attendanceStats.pending}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">미정</div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">참석 데이터가 없습니다.</p>
            )}
          </div>

          {/* 시즌별 통계 */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">📆 시즌별 통계</h2>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="px-4 py-2 border rounded-lg"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}년
                  </option>
                ))}
              </select>
            </div>
            {seasonStats ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {seasonStats.totalMatches}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">경기 수</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">{seasonStats.totalGoals}</div>
                  <div className="text-sm text-gray-600 mt-1">득점</div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {seasonStats.totalAssists}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">도움</div>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {seasonStats.totalYellowCards}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">경고</div>
                </div>
                <div className="p-4 bg-red-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {seasonStats.totalRedCards}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">퇴장</div>
                </div>
                <div className="p-4 bg-indigo-50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-indigo-600">
                    {seasonStats.attendanceRate}%
                  </div>
                  <div className="text-sm text-gray-600 mt-1">참석률</div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">{selectedYear}년 데이터가 없습니다.</p>
            )}
          </div>

          {/* 팀별 통계 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">👥 팀별 통계</h2>
            {teamStats.length > 0 ? (
              <div className="space-y-4">
                {teamStats.map((team) => (
                  <div key={team.team.id} className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      {team.team.logo_url ? (
                        <Image
                          src={team.team.logo_url}
                          alt={team.team.name}
                          width={40}
                          height={40}
                          className="rounded object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                          ⚽
                        </div>
                      )}
                      <h3 className="font-semibold">{team.team.name}</h3>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="text-xs text-gray-600 mb-1">경기</div>
                        <div className="text-lg font-semibold">{team.matches}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600 mb-1">득점</div>
                        <div className="text-lg font-semibold">{team.goals}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600 mb-1">도움</div>
                        <div className="text-lg font-semibold">{team.assists}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">소속팀이 없습니다.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
