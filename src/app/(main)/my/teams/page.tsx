'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { getUserTeams, leaveTeam, type UserTeamDetail } from '@/lib/supabase/queries/user-teams';

export default function MyTeamsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [teams, setTeams] = useState<UserTeamDetail[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [leavingTeamId, setLeavingTeamId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      loadTeams();
    }
  }, [user]);

  const loadTeams = async () => {
    if (!user) return;

    setDataLoading(true);
    try {
      const data = await getUserTeams(user.id);
      setTeams(data);
    } catch (error) {
      console.error('Failed to load teams:', error);
    } finally {
      setDataLoading(false);
    }
  };

  const handleLeaveTeam = async (teamId: string, teamName: string) => {
    if (!user) return;

    if (
      !confirm(
        `정말 "${teamName}" 팀에서 탈퇴하시겠습니까?\n주장은 팀에서 탈퇴할 수 없습니다.`
      )
    ) {
      return;
    }

    setLeavingTeamId(teamId);
    try {
      const success = await leaveTeam(user.id, teamId);
      if (success) {
        alert('팀에서 탈퇴했습니다.');
        loadTeams();
      } else {
        alert('팀 탈퇴에 실패했습니다. 주장은 팀을 탈퇴할 수 없습니다.');
      }
    } catch (error) {
      console.error('Failed to leave team:', error);
      alert('팀 탈퇴 중 오류가 발생했습니다.');
    } finally {
      setLeavingTeamId(null);
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">내 팀</h1>
        <Link
          href="/teams/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          새 팀 만들기
        </Link>
      </div>

      {dataLoading ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">로딩 중...</div>
      ) : teams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teams.map((team) => (
            <div key={team.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start gap-4 mb-4">
                {team.logo_url ? (
                  <Image
                    src={team.logo_url}
                    alt={team.name}
                    width={80}
                    height={80}
                    className="rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center text-2xl">
                    ⚽
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl font-bold">{team.name}</h2>
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        team.memberRole === 'captain'
                          ? 'bg-yellow-100 text-yellow-800'
                          : team.memberRole === 'coach'
                            ? 'bg-blue-100 text-blue-800'
                            : team.memberRole === 'manager'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {team.memberRole === 'captain'
                        ? '주장'
                        : team.memberRole === 'coach'
                          ? '코치'
                          : team.memberRole === 'manager'
                            ? '감독'
                            : '팀원'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    {team.region}
                    {team.district && ` • ${team.district}`}
                  </div>
                  <div className="text-sm text-gray-600">
                    가입일: {new Date(team.joinedAt).toLocaleDateString('ko-KR')}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-xs text-gray-600 mb-1">포지션</div>
                  <div className="font-semibold">{team.position || '-'}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">등번호</div>
                  <div className="font-semibold">{team.jerseyNumber || '-'}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">팀 경기</div>
                  <div className="font-semibold">{team.teamMatches}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">팀 득점</div>
                  <div className="font-semibold">{team.teamGoals}</div>
                </div>
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/teams/${team.id}`}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700"
                >
                  팀 페이지
                </Link>
                {team.memberRole === 'captain' ? (
                  <Link
                    href={`/teams/${team.id}/settings`}
                    className="flex-1 px-4 py-2 bg-gray-600 text-white text-center rounded-lg hover:bg-gray-700"
                  >
                    팀 설정
                  </Link>
                ) : (
                  <button
                    onClick={() => handleLeaveTeam(team.id, team.name)}
                    disabled={leavingTeamId === team.id}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                  >
                    {leavingTeamId === team.id ? '처리 중...' : '팀 탈퇴'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 mb-4">소속된 팀이 없습니다.</p>
          <Link
            href="/teams"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            팀 찾아보기
          </Link>
        </div>
      )}
    </div>
  );
}
