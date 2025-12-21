import { Metadata } from 'next';
import Link from 'next/link';
import { SignupForm } from '@/components/auth/SignupForm';

export const metadata: Metadata = {
  title: '회원가입 | League Maker',
  description: 'League Maker에 가입하고 아마추어 축구를 즐겨보세요',
};

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold text-purple-600">League Maker</h1>
          </Link>
          <h2 className="mt-6 text-2xl font-bold text-gray-900">
            새로운 계정 만들기
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            아마추어 축구의 모든 것을 기록하세요
          </p>
        </div>

        {/* Form */}
        <div className="mt-8 bg-white py-8 px-6 shadow-lg rounded-lg">
          <SignupForm />
        </div>
      </div>
    </div>
  );
}
