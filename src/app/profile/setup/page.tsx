"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { getProfile } from "@/lib/profile";
import ProfileSetupForm from "@/components/profile/ProfileSetupForm";
import WelcomeOnboarding from "@/components/profile/WelcomeOnboarding";

export default function ProfileSetupPage() {
  const router = useRouter();
  const { user, isLoading, initialize } = useAuthStore();
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [checkingProfile, setCheckingProfile] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(true);

  useEffect(() => {
    // 인증 상태 초기화
    if (!user && !isLoading) {
      initialize();
    }
  }, [user, isLoading, initialize]);

  useEffect(() => {
    const checkExistingProfile = async () => {
      if (!user) return;

      setCheckingProfile(true);
      try {
        const { profile } = await getProfile(user.id);
        if (profile) {
          setHasProfile(true);
          // 이미 프로필이 있으면 대시보드로 리다이렉트
          router.push("/dashboard");
        } else {
          setHasProfile(false);
          // 프로필이 없는 경우 온보딩 상태 확인
          const hasSeenOnboarding = localStorage.getItem(
            "league-maker-onboarding-seen"
          );
          if (hasSeenOnboarding) {
            setShowOnboarding(false);
          }
        }
      } catch (error) {
        console.error("Profile check error:", error);
        setHasProfile(false);
        // 에러가 발생해도 온보딩 상태 확인
        const hasSeenOnboarding = localStorage.getItem(
          "league-maker-onboarding-seen"
        );
        if (hasSeenOnboarding) {
          setShowOnboarding(false);
        }
      } finally {
        setCheckingProfile(false);
      }
    };

    if (user) {
      checkExistingProfile();
    }
  }, [user, router]);

  const handleOnboardingComplete = () => {
    // 온보딩 완료 상태를 로컬 스토리지에 저장
    localStorage.setItem("league-maker-onboarding-seen", "true");
    setShowOnboarding(false);
  };

  const handleProfileComplete = () => {
    router.push("/dashboard");
  };

  // 로딩 중
  if (isLoading || checkingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">프로필 확인 중...</p>
        </div>
      </div>
    );
  }

  // 로그인되지 않은 경우
  if (!user) {
    router.push("/login");
    return null;
  }

  // 이미 프로필이 있는 경우
  if (hasProfile) {
    return null; // 리다이렉트 진행 중
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      {showOnboarding ? (
        <WelcomeOnboarding onStart={handleOnboardingComplete} />
      ) : (
        <ProfileSetupForm onComplete={handleProfileComplete} />
      )}
    </div>
  );
}
