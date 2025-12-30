'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, MapPin } from 'lucide-react';
import StadiumForm from '@/components/stadium/StadiumForm';
import StadiumList from '@/components/stadium/StadiumList';
import { supabase } from '@/lib/supabase/client';

export default function TeamStadiumsPage() {
  const params = useParams();
  const router = useRouter();
  const teamId = params.teamId as string;

  const [teamName, setTeamName] = useState<string>('');
  const [canManage, setCanManage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    async function checkPermissions() {
      try {
        // 현재 사용자 확인
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          router.push('/login');
          return;
        }

        // 팀 정보 조회
        const { data: team, error: teamError } = await supabase
          .from('teams')
          .select('name')
          .eq('id', teamId)
          .single();

        if (teamError || !team) {
          console.error('팀 조회 오류:', teamError);
          router.push('/my/teams');
          return;
        }

        setTeamName(team.name);

        // 사용자의 팀 멤버십 확인
        const { data: membership, error: membershipError } = await supabase
          .from('team_members')
          .select('role')
          .eq('team_id', teamId)
          .eq('user_id', user.id)
          .single();

        if (membershipError || !membership) {
          console.error('멤버십 조회 오류:', membershipError);
          setCanManage(false);
        } else {
          // 주장, 코치, 감독만 관리 권한 부여
          setCanManage(['captain', 'coach', 'manager'].includes(membership.role));
        }
      } catch (error) {
        console.error('권한 확인 오류:', error);
      } finally {
        setIsLoading(false);
      }
    }

    checkPermissions();
  }, [teamId, router]);

  const handleSuccess = () => {
    setShowForm(false);
    setRefreshKey((prev) => prev + 1);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* 헤더 */}
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          돌아가기
        </button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <MapPin className="w-8 h-8 text-green-600" />
              홈 경기장 관리
            </h1>
            <p className="text-gray-600 mt-2">{teamName}</p>
          </div>

          {canManage && !showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              경기장 등록
            </button>
          )}
        </div>
      </div>

      {/* 권한 안내 */}
      {!canManage && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800">
            경기장 등록 및 관리는 팀의 주장, 코치, 감독만 가능합니다.
          </p>
        </div>
      )}

      {/* 경기장 등록 폼 */}
      {canManage && showForm && (
        <div className="mb-8 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            새 경기장 등록
          </h2>
          <StadiumForm
            teamId={teamId}
            onSuccess={handleSuccess}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {/* 경기장 목록 */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          등록된 경기장 ({refreshKey >= 0 ? '목록' : ''})
        </h2>
        <StadiumList
          teamId={teamId}
          canManage={canManage}
          onRefresh={refreshKey}
        />
      </div>
    </div>
  );
}
