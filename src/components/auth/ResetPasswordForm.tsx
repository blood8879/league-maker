'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from '@/lib/validations/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function ResetPasswordForm() {
  const router = useRouter();
  const { resetPassword } = useAuth();
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    try {
      setError('');
      setIsSubmitting(true);

      await resetPassword(data.password);

      // Redirect to login page after successful password reset
      router.push('/login?reset=success');
    } catch (err) {
      console.error('Password reset error:', err);
      setError(
        err instanceof Error
          ? err.message
          : '비밀번호 재설정 중 오류가 발생했습니다'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <p className="text-sm text-gray-600">
          새로운 비밀번호를 입력해주세요.
        </p>
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="password">새 비밀번호</Label>
        <Input
          id="password"
          type="password"
          placeholder="최소 8자 (대문자, 소문자, 숫자 포함)"
          {...register('password')}
          className={errors.password ? 'border-red-500' : ''}
          autoComplete="new-password"
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">비밀번호 확인</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="비밀번호를 다시 입력하세요"
          {...register('confirmPassword')}
          className={errors.confirmPassword ? 'border-red-500' : ''}
          autoComplete="new-password"
        />
        {errors.confirmPassword && (
          <p className="text-sm text-red-500">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting}
        size="lg"
      >
        {isSubmitting ? '재설정 중...' : '비밀번호 재설정'}
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
