'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from '@/lib/validations/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function ForgotPasswordForm() {
  const { requestPasswordReset } = useAuth();
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    try {
      setError('');
      setSuccess(false);
      setIsSubmitting(true);

      await requestPasswordReset(data.email);
      setSuccess(true);
    } catch (err) {
      console.error('Password reset request error:', err);
      setError(
        err instanceof Error
          ? err.message
          : '비밀번호 재설정 요청 중 오류가 발생했습니다'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="space-y-6">
        <div className="p-4 rounded-lg bg-green-50 border border-green-200">
          <p className="text-green-800 font-medium">
            비밀번호 재설정 이메일이 전송되었습니다
          </p>
          <p className="text-sm text-green-700 mt-2">
            이메일을 확인하고 링크를 클릭하여 비밀번호를 재설정하세요.
          </p>
        </div>

        <div className="text-center">
          <Link
            href="/login"
            className="text-sm text-purple-600 hover:underline"
          >
            로그인 페이지로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <p className="text-sm text-gray-600">
          가입하신 이메일 주소를 입력하시면 비밀번호 재설정 링크를 보내드립니다.
        </p>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">이메일</Label>
        <Input
          id="email"
          type="email"
          placeholder="example@email.com"
          {...register('email')}
          className={errors.email ? 'border-red-500' : ''}
          autoComplete="email"
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting}
        size="lg"
      >
        {isSubmitting ? '전송 중...' : '재설정 링크 보내기'}
      </Button>

      {/* Back to Login */}
      <div className="text-center">
        <Link href="/login" className="text-sm text-purple-600 hover:underline">
          로그인 페이지로 돌아가기
        </Link>
      </div>
    </form>
  );
}
