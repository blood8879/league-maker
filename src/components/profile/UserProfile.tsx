'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { User, Mail, Briefcase, MapPin } from 'lucide-react';

type UserProfile = Database['public']['Tables']['users']['Row'];

interface UserProfileProps {
  userId: string;
}

export function UserProfile({ userId }: UserProfileProps) {
  const { user, userProfile: currentUserProfile, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const isOwnProfile = user?.id === userId;

  useEffect(() => {
    // Wait for auth to finish loading before attempting to fetch profile
    if (authLoading) {
      return;
    }

    async function fetchProfile() {
      try {
        setLoading(true);
        setError('');

        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('프로필을 불러오는 중 오류가 발생했습니다');
      } finally {
        setLoading(false);
      }
    }

    if (isOwnProfile && currentUserProfile) {
      setProfile(currentUserProfile);
      setLoading(false);
    } else {
      fetchProfile();
    }
  }, [userId, isOwnProfile, currentUserProfile, authLoading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">프로필을 불러오는 중...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-red-500">{error || '프로필을 찾을 수 없습니다'}</p>
        <Link href="/">
          <Button variant="outline">홈으로 돌아가기</Button>
        </Link>
      </div>
    );
  }

  const getRoleText = (role: string) => {
    switch (role) {
      case 'player':
        return '선수';
      case 'coach':
        return '감독';
      case 'manager':
        return '매니저';
      default:
        return role;
    }
  };

  const getPositionText = (position: string | null) => {
    if (!position) return '-';
    return position;
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl">프로필</CardTitle>
          {isOwnProfile && (
            <Link href="/settings">
              <Button variant="outline" size="sm">
                프로필 수정
              </Button>
            </Link>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Nickname */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-muted-foreground">
              <User className="h-4 w-4" />
              닉네임
            </Label>
            <p className="text-lg font-medium">{profile.nickname}</p>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4" />
              이메일
            </Label>
            <p className="text-lg">{profile.email}</p>
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-muted-foreground">
              <Briefcase className="h-4 w-4" />
              역할
            </Label>
            <p className="text-lg">{getRoleText(profile.role)}</p>
          </div>

          {/* Preferred Position (only for players) */}
          {profile.role === 'player' && (
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                선호 포지션
              </Label>
              <p className="text-lg">{getPositionText(profile.preferred_position)}</p>
            </div>
          )}

          {/* Created At */}
          <div className="space-y-2 pt-4 border-t">
            <Label className="text-muted-foreground text-sm">가입일</Label>
            <p className="text-sm text-muted-foreground">
              {new Date(profile.created_at).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
