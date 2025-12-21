'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { signupSchema, type SignupFormValues } from '@/lib/validations/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function SignupForm() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      role: 'player',
    },
  });

  const role = watch('role');

  const onSubmit = async (data: SignupFormValues) => {
    try {
      setError('');
      setIsSubmitting(true);

      await signUp(data.email, data.password, {
        nickname: data.nickname,
        role: data.role,
        preferred_position: data.preferred_position,
      });

      // Redirect to dashboard after successful signup
      router.push('/dashboard');
    } catch (err) {
      console.error('Signup error:', err);
      setError(
        err instanceof Error
          ? err.message
          : '회원가입 중 오류가 발생했습니다'
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

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">이메일</Label>
        <Input
          id="email"
          type="email"
          placeholder="example@email.com"
          {...register('email')}
          className={errors.email ? 'border-red-500' : ''}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="password">비밀번호</Label>
        <Input
          id="password"
          type="password"
          placeholder="최소 8자 (대문자, 소문자, 숫자 포함)"
          {...register('password')}
          className={errors.password ? 'border-red-500' : ''}
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
        />
        {errors.confirmPassword && (
          <p className="text-sm text-red-500">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Nickname */}
      <div className="space-y-2">
        <Label htmlFor="nickname">닉네임</Label>
        <Input
          id="nickname"
          type="text"
          placeholder="2-20자 (한글, 영문, 숫자, _ 가능)"
          {...register('nickname')}
          className={errors.nickname ? 'border-red-500' : ''}
        />
        {errors.nickname && (
          <p className="text-sm text-red-500">{errors.nickname.message}</p>
        )}
      </div>

      {/* Role */}
      <div className="space-y-2">
        <Label htmlFor="role">역할</Label>
        <Select
          onValueChange={(value) =>
            setValue('role', value as 'player' | 'coach' | 'manager', {
              shouldValidate: true,
            })
          }
          defaultValue="player"
        >
          <SelectTrigger className={errors.role ? 'border-red-500' : ''}>
            <SelectValue placeholder="역할을 선택하세요" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="player">선수</SelectItem>
            <SelectItem value="coach">감독</SelectItem>
            <SelectItem value="manager">매니저</SelectItem>
          </SelectContent>
        </Select>
        {errors.role && (
          <p className="text-sm text-red-500">{errors.role.message}</p>
        )}
      </div>

      {/* Preferred Position (only for players) */}
      {role === 'player' && (
        <div className="space-y-2">
          <Label htmlFor="position">선호 포지션</Label>
          <Select
            onValueChange={(value) =>
              setValue(
                'preferred_position',
                value as 'FW' | 'MF' | 'DF' | 'GK',
                { shouldValidate: true }
              )
            }
          >
            <SelectTrigger
              className={errors.preferred_position ? 'border-red-500' : ''}
            >
              <SelectValue placeholder="포지션을 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="FW">FW (공격수)</SelectItem>
              <SelectItem value="MF">MF (미드필더)</SelectItem>
              <SelectItem value="DF">DF (수비수)</SelectItem>
              <SelectItem value="GK">GK (골키퍼)</SelectItem>
            </SelectContent>
          </Select>
          {errors.preferred_position && (
            <p className="text-sm text-red-500">
              {errors.preferred_position.message}
            </p>
          )}
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting}
        size="lg"
      >
        {isSubmitting ? '가입 중...' : '회원가입'}
      </Button>

      {/* Login Link */}
      <p className="text-center text-sm text-gray-600">
        이미 계정이 있으신가요?{' '}
        <Link href="/login" className="text-purple-600 hover:underline">
          로그인
        </Link>
      </p>
    </form>
  );
}
