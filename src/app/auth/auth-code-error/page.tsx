"use client";

import Link from "next/link";

export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 text-center">
        <div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            인증 오류가 발생했습니다
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            소셜 로그인 처리 중 문제가 발생했습니다.
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-gray-500">
            다음과 같은 이유로 인증이 실패할 수 있습니다:
          </p>
          <ul className="text-left text-sm text-gray-600 space-y-2">
            <li>• 인증 코드가 만료되었거나 잘못되었습니다</li>
            <li>• 네트워크 연결에 문제가 있습니다</li>
            <li>• 서비스에 일시적인 문제가 발생했습니다</li>
          </ul>
        </div>

        <div className="space-y-3">
          <Link
            href="/login"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            다시 로그인하기
          </Link>

          <Link
            href="/"
            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
