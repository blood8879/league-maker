"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { getProfile } from "@/lib/profile";
import type { UserProfile } from "@/types/profile";
import { POSITIONS } from "@/types/profile";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading, initialize, signOut } = useAuthStore();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [checkingProfile, setCheckingProfile] = useState(true);

  useEffect(() => {
    // 인증 상태 초기화
    if (!user && !isLoading) {
      initialize();
    }
  }, [user, isLoading, initialize]);

  useEffect(() => {
    const checkProfile = async () => {
      if (!user) return;

      setCheckingProfile(true);
      try {
        const { profile: userProfile } = await getProfile(user.id);
        if (!userProfile) {
          // 프로필이 없으면 프로필 설정으로 리다이렉트
          router.push("/profile/setup");
        } else {
          setProfile(userProfile);
        }
      } catch (error) {
        console.error("Profile check error:", error);
        router.push("/profile/setup");
      } finally {
        setCheckingProfile(false);
      }
    };

    if (user) {
      checkProfile();
    }
  }, [user, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  // 로딩 중
  if (isLoading || checkingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {isLoading ? "로그인 확인 중..." : "프로필 확인 중..."}
          </p>
        </div>
      </div>
    );
  }

  // 로그인되지 않은 경우
  if (!user) {
    router.push("/login");
    return null;
  }

  // 프로필이 없는 경우 (이미 리다이렉트 처리됨)
  if (!profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                ⚽ League Maker
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                안녕하세요, {profile.name}님!
              </span>
              <button
                onClick={handleSignOut}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg min-h-96">
            <div className="p-8 text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                대시보드
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                League Maker에 오신 것을 환영합니다!
              </p>

              {/* 사용자 프로필 정보 */}
              <div className="bg-white rounded-lg shadow p-6 max-w-md mx-auto mb-8">
                <h3 className="text-xl font-semibold mb-4">내 프로필</h3>
                <div className="space-y-2 text-left">
                  <p>
                    <span className="font-medium">이름:</span> {profile.name}
                  </p>
                  <p>
                    <span className="font-medium">포지션:</span>{" "}
                    {profile.position.length > 0
                      ? profile.position
                          .map(
                            (pos) =>
                              POSITIONS.find((p) => p.value === pos)?.label ||
                              pos
                          )
                          .join(", ")
                      : "설정되지 않음"}
                  </p>
                  {profile.phone && (
                    <p>
                      <span className="font-medium">연락처:</span>{" "}
                      {profile.phone}
                    </p>
                  )}
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => router.push("/profile/edit")}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    프로필 수정
                  </button>
                </div>
              </div>

              {/* 추후 기능들 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h4 className="text-lg font-semibold mb-2">팀 관리</h4>
                  <p className="text-gray-600 mb-4">팀을 생성하고 관리하세요</p>
                  <button className="bg-gray-300 text-gray-500 px-4 py-2 rounded-md text-sm cursor-not-allowed">
                    곧 출시 예정
                  </button>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <h4 className="text-lg font-semibold mb-2">경기 관리</h4>
                  <p className="text-gray-600 mb-4">경기 일정을 관리하세요</p>
                  <button className="bg-gray-300 text-gray-500 px-4 py-2 rounded-md text-sm cursor-not-allowed">
                    곧 출시 예정
                  </button>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                  <h4 className="text-lg font-semibold mb-2">통계 확인</h4>
                  <p className="text-gray-600 mb-4">
                    개인 및 팀 통계를 확인하세요
                  </p>
                  <button className="bg-gray-300 text-gray-500 px-4 py-2 rounded-md text-sm cursor-not-allowed">
                    곧 출시 예정
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
