"use client";

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
  loadingComponent?: ReactNode;
}

export default function ProtectedRoute({
  children,
  redirectTo = "/login",
  loadingComponent,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { user, isLoading, isInitialized, initialize } = useAuthStore();

  useEffect(() => {
    // 앱 초기화
    if (!isInitialized) {
      initialize();
    }
  }, [isInitialized, initialize]);

  useEffect(() => {
    // 초기화가 완료되고 사용자가 없으면 로그인 페이지로 리다이렉트
    if (isInitialized && !isLoading && !user) {
      router.push(redirectTo);
    }
  }, [user, isLoading, isInitialized, redirectTo, router]);

  // 초기화 중이거나 로딩 중인 경우
  if (!isInitialized || isLoading) {
    return (
      loadingComponent || (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">로딩 중...</p>
          </div>
        </div>
      )
    );
  }

  // 사용자가 인증되지 않은 경우
  if (!user) {
    return null; // 리다이렉트 진행 중
  }

  // 사용자가 인증된 경우 자식 컴포넌트 렌더링
  return <>{children}</>;
}
