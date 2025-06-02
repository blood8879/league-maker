"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { getProfile } from "@/lib/profile";
import ProfileEditForm from "@/components/profile/ProfileEditForm";
import type { UserProfile } from "@/types/profile";

export default function ProfileEditPage() {
  const router = useRouter();
  const { user, isLoading } = useAuthStore();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    loadProfile();
  }, [user, isLoading, router]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { profile: userProfile, error } = await getProfile(user.id);

      if (error) {
        setError(error);
        return;
      }

      if (!userProfile) {
        // 프로필이 없으면 생성 페이지로 리다이렉트
        router.push("/profile/setup");
        return;
      }

      setProfile(userProfile);
    } catch (error) {
      console.error("Profile load error:", error);
      setError("프로필을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
    // 프로필 업데이트 후 홈으로 이동하거나 이전 페이지로 이동
    router.push("/");
  };

  const handleCancel = () => {
    router.back();
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">오류 발생</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            프로필을 찾을 수 없습니다
          </h1>
          <p className="text-gray-600 mb-4">프로필을 먼저 생성해주세요.</p>
          <button
            onClick={() => router.push("/profile/setup")}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            프로필 생성하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <ProfileEditForm
          profile={profile}
          onUpdate={handleProfileUpdate}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
