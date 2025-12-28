'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import {
  getUserMatches,
  type UserMatch,
  type MatchStatusFilter,
  type AttendanceFilter,
} from '@/lib/supabase/queries/user-matches';

export default function MyMatchesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [matches, setMatches] = useState<UserMatch[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<MatchStatusFilter>('all');
  const [attendanceFilter, setAttendanceFilter] = useState<AttendanceFilter>('all');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      loadMatches();
    }
  }, [user, statusFilter, attendanceFilter]);

  const loadMatches = async () => {
    if (!user) return;

    setDataLoading(true);
    try {
      const data = await getUserMatches(user.id, statusFilter, attendanceFilter);
      setMatches(data);
    } catch (error) {
      console.error('Failed to load matches:', error);
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">내 경기</h1>

      {/* 필터 */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          {/* 상태 필터 */}
          <div>
            <label className="block text-sm font-medium mb-2">경기 상태</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as MatchStatusFilter)}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="all">전체</option>
              <option value="scheduled">예정</option>
              <option value="finished">완료</option>
            </select>
          </div>

          {/* 참석 필터 */}
          <div>
            <label className="block text-sm font-medium mb-2">참석 상태</label>
            <select
              value={attendanceFilter}
              onChange={(e) => setAttendanceFilter(e.target.value as AttendanceFilter)}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="all">전체</option>
              <option value="attending">참석</option>
              <option value="absent">불참</option>
              <option value="pending">미정</option>
            </select>
          </div>
        </div>
      </div>

      {/* 경기 목록 */}
      <div className="bg-white rounded-lg shadow">
        {dataLoading ? (
          <div className="p-8 text-center">로딩 중...</div>
        ) : matches.length > 0 ? (
          <div className="divide-y">
            {matches.map((match) => (
              <Link
                key={match.id}
                href={`/matches/${match.id}`}
                className="block p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className={`px-2 py-1 text-xs rounded ${
                          match.status === 'scheduled'
                            ? 'bg-blue-100 text-blue-800'
                            : match.status === 'live'
                              ? 'bg-green-100 text-green-800'
                              : match.status === 'finished'
                                ? 'bg-gray-100 text-gray-800'
                                : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {match.status === 'scheduled'
                          ? '예정'
                          : match.status === 'live'
                            ? '진행중'
                            : match.status === 'finished'
                              ? '종료'
                              : '취소'}
                      </span>
                      <span className="text-xs text-gray-600 px-2 py-1 bg-gray-100 rounded">
                        {match.type === 'league'
                          ? '리그'
                          : match.type === 'cup'
                            ? '컵'
                            : match.type === 'friendly'
                              ? '친선'
                              : '연습'}
                      </span>
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
                            ? '✓ 참석'
                            : match.myAttendance.status === 'absent'
                              ? '✗ 불참'
                              : '? 미정'}
                        </span>
                      )}
                    </div>
                    <div className="font-semibold text-lg mb-1">
                      {match.homeTeam.name} vs {match.awayTeam.name}
                    </div>
                    {match.status === 'finished' && (
                      <div className="text-2xl font-bold text-gray-900 mb-2">
                        {match.home_score} - {match.away_score}
                      </div>
                    )}
                    <div className="text-sm text-gray-600">
                      {match.match_date} {match.match_time} • {match.venue}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            {statusFilter !== 'all' || attendanceFilter !== 'all'
              ? '조건에 맞는 경기가 없습니다.'
              : '참가한 경기가 없습니다.'}
          </div>
        )}
      </div>
    </div>
  );
}
