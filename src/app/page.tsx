"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
// import { useRouter } from "next/navigation"; // 임시 비활성화
import { useAuthStore } from "@/stores/authStore";
import { createClient } from "@/utils/supabase/client";
// import { getProfile } from "@/lib/profile"; // 임시 비활성화
import Image from "next/image";

export default function Home() {
  // const router = useRouter(); // 임시 비활성화
  const [connectionStatus, setConnectionStatus] =
    useState<string>("연결 확인 중...");
  // const [checkingProfile, setCheckingProfile] = useState(false); // 임시 비활성화
  const { user, isLoading, initialize, signOut } = useAuthStore();

  useEffect(() => {
    // 인증 상태 초기화
    initialize();

    const testConnection = async () => {
      try {
        const supabase = createClient();
        const { error } = await supabase.from("_realtime").select("*").limit(1);
        if (error) {
          console.log("Connection test (expected error):", error);
          setConnectionStatus("✅ Supabase 연결 성공!");
        } else {
          setConnectionStatus("✅ Supabase 연결 성공!");
        }
      } catch (error) {
        console.error("Connection error:", error);
        setConnectionStatus("❌ Supabase 연결 실패");
      }
    };

    testConnection();
  }, [initialize]);

  // 임시로 프로필 체크 비활성화 - 무한 루프 디버깅용
  /*
  useEffect(() => {
    let isMounted = true;

    const checkProfileAndRedirect = async () => {
      // 로그인되지 않았거나 로딩 중이면 체크하지 않음
      if (!user || isLoading) return;

      // 이미 체크 중이면 중복 실행 방지
      if (checkingProfile) return;

      setCheckingProfile(true);
      try {
        const { profile } = await getProfile(user.id);

        // 컴포넌트가 언마운트되었으면 상태 업데이트 안함
        if (!isMounted) return;

        // 프로필이 없으면 프로필 설정 페이지로 리다이렉트
        if (!profile) {
          router.push("/profile/setup");
          return;
        }

        // 프로필이 있으면 현재 페이지에 머물거나 대시보드로 이동
        // 여기서는 현재 페이지에 머물도록 함
      } catch (error) {
        console.error("Profile check error:", error);
        // 에러가 발생해도 프로필 설정으로 안내
        if (isMounted) {
          router.push("/profile/setup");
        }
      } finally {
        if (isMounted) {
          setCheckingProfile(false);
        }
      }
    };

    checkProfileAndRedirect();

    return () => {
      isMounted = false;
    };
  }, [user, isLoading, router]);
  */

  const handleSignOut = async () => {
    await signOut();
  };

  // 프로필 확인 중이면 로딩 표시 (임시 비활성화)
  /*
  if (checkingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">프로필 확인 중...</p>
        </div>
      </div>
    );
  }
  */

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">⚽ League Maker</h1>
          <p className="text-lg text-gray-600 mb-8">풋볼 리그 관리 시스템</p>

          <div className="bg-white p-6 rounded-lg shadow-md border">
            <h2 className="text-xl font-semibold mb-4">시스템 상태</h2>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Supabase 연결:</span>
                <span className="font-medium">{connectionStatus}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">로그인 상태:</span>
                <span className="font-medium">
                  {isLoading
                    ? "확인 중..."
                    : user
                    ? `✅ ${user.email}`
                    : "❌ 로그인 필요"}
                </span>
              </div>
            </div>
          </div>

          {/* 사용자 정보 */}
          {user && (
            <div className="bg-blue-50 p-4 rounded-lg mt-4">
              <h3 className="text-lg font-semibold mb-2">환영합니다!</h3>
              <p className="text-gray-700">이메일: {user.email}</p>
              {user.user_metadata?.full_name && (
                <p className="text-gray-700">
                  이름: {user.user_metadata.full_name}
                </p>
              )}
              <p className="text-sm text-gray-500 mt-2">
                로그인 방법: {user.app_metadata?.provider || "unknown"}
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
              >
                대시보드
              </Link>
              <Link
                href="/profile/edit"
                className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
              >
                프로필 수정
              </Link>
              <button
                onClick={handleSignOut}
                disabled={isLoading}
                className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44 disabled:opacity-50"
              >
                {isLoading ? "처리 중..." : "로그아웃"}
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
              >
                로그인
              </Link>
              <Link
                href="/docs"
                className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
              >
                문서 보기
              </Link>
            </>
          )}
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
        <span className="text-sm text-gray-500">
          League Maker v0.1.0 - 풋볼 팀 관리 시스템
        </span>
      </footer>
    </div>
  );
}
