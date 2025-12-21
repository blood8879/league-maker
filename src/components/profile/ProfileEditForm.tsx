'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRouter } from 'next/navigation';

const profileEditSchema = z.object({
  nickname: z
    .string()
    .min(2, '닉네임은 최소 2자 이상이어야 합니다')
    .max(20, '닉네임은 최대 20자까지 가능합니다')
    .regex(
      /^[가-힣a-zA-Z0-9_]+$/,
      '닉네임은 한글, 영문, 숫자, 언더스코어만 사용 가능합니다'
    ),
  preferred_position: z.enum(['FW', 'MF', 'DF', 'GK']).optional(),
});

type ProfileEditFormValues = z.infer<typeof profileEditSchema>;

export function ProfileEditForm() {
  const router = useRouter();
  const { userProfile, user, refreshUserProfile } = useAuth();
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProfileEditFormValues>({
    resolver: zodResolver(profileEditSchema),
    defaultValues: {
      nickname: userProfile?.nickname || '',
      preferred_position: userProfile?.preferred_position || undefined,
    },
  });

  useEffect(() => {
    if (userProfile) {
      setValue('nickname', userProfile.nickname);
      if (userProfile.preferred_position) {
        setValue('preferred_position', userProfile.preferred_position as 'FW' | 'MF' | 'DF' | 'GK');
      }
    }
  }, [userProfile, setValue]);

  const onSubmit = async (data: ProfileEditFormValues) => {
    if (!user) {
      setError('로그인이 필요합니다');
      return;
    }

    try {
      setError('');
      setSuccess('');
      setIsSubmitting(true);

      const updateData: {
        nickname: string;
        preferred_position?: 'FW' | 'MF' | 'DF' | 'GK' | null;
        updated_at: string;
      } = {
        nickname: data.nickname,
        updated_at: new Date().toISOString(),
      };

      if (userProfile?.role === 'player' && data.preferred_position) {
        updateData.preferred_position = data.preferred_position;
      }

      const { error: updateError } = await supabase
        .from('users')
        .update(updateData as never) // eslint-disable-line @typescript-eslint/no-explicit-any
        .eq('id', user.id);

      if (updateError) throw updateError;

      // Refresh user profile in AuthContext
      await refreshUserProfile();

      setSuccess('프로필이 성공적으로 수정되었습니다');

      setTimeout(() => {
        router.push(`/profile/${user.id}`);
      }, 1500);
    } catch (err) {
      console.error('Profile update error:', err);
      setError(
        err instanceof Error
          ? err.message
          : '프로필 수정 중 오류가 발생했습니다'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!userProfile) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">프로필 정보를 불러오는 중...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>프로필 수정</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-green-600 text-sm">
              {success}
            </div>
          )}

          {/* Email (Read-only) */}
          <div className="space-y-2">
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              type="email"
              value={userProfile.email}
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">
              이메일은 변경할 수 없습니다
            </p>
          </div>

          {/* Role (Read-only) */}
          <div className="space-y-2">
            <Label htmlFor="role">역할</Label>
            <Input
              id="role"
              value={
                userProfile.role === 'player'
                  ? '선수'
                  : userProfile.role === 'coach'
                  ? '감독'
                  : '매니저'
              }
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">
              역할은 변경할 수 없습니다
            </p>
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

          {/* Preferred Position (only for players) */}
          {userProfile.role === 'player' && (
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
                value={watch('preferred_position')}
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

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? '수정 중...' : '수정하기'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/profile/${user?.id}`)}
              disabled={isSubmitting}
            >
              취소
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
