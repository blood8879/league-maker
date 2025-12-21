import { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: '로그인 | League Maker',
  description: 'League Maker에 로그인하세요',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold text-purple-600">League Maker</h1>
          </Link>
          <h2 className="mt-6 text-2xl font-bold text-gray-900">
            로그인
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            아마추어 축구 기록을 시작하세요
          </p>
        </div>

        {/* Form */}
        <div className="mt-8 bg-white py-8 px-6 shadow-lg rounded-lg">
          <Suspense fallback={<div>Loading...</div>}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
