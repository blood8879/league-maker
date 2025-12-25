'use client';

import { memo } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { TeamWithRole } from '@/types/dashboard';
import { MapPin, Users, Settings } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface TeamCardProps {
  team: TeamWithRole;
  onLeaveTeam?: (teamId: string) => void;
}

export const TeamCard = memo(function TeamCard({ team, onLeaveTeam }: TeamCardProps) {
  const getRoleBadge = () => {
    const roles = {
      captain: { label: '주장', variant: 'default' as const },
      vice_captain: { label: '부주장', variant: 'secondary' as const },
      member: { label: '팀원', variant: 'outline' as const },
    };

    const { label, variant } = roles[team.myRole];
    return <Badge variant={variant}>{label}</Badge>;
  };

  const getLevelLabel = () => {
    const levels = {
      beginner: '초급',
      intermediate: '중급',
      advanced: '상급',
    };
    return levels[team.level] || team.level;
  };

  const handleLeaveTeam = () => {
    onLeaveTeam?.(team.id);
  };

  return (
    <Card className="hover:bg-accent/50 transition-colors">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* 팀 로고 및 역할 */}
          <div className="flex items-start justify-between">
            <Link href={`/teams/${team.id}`} className="flex items-center gap-3 flex-1">
              {team.logo ? (
                <Image
                  src={team.logo}
                  alt={team.name}
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
              )}
              <div>
                <h3 className="font-semibold text-base">{team.name}</h3>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                  <MapPin className="h-3 w-3" />
                  <span>{team.region}</span>
                </div>
              </div>
            </Link>
            {getRoleBadge()}
          </div>

          {/* 팀 정보 */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{team.memberCount}명</span>
            </div>
            <Badge variant="outline">{getLevelLabel()}</Badge>
          </div>

          {/* 팀 통계 */}
          <div className="grid grid-cols-3 gap-2 text-center text-sm">
            <div className="bg-secondary/30 rounded-lg p-2">
              <div className="text-xs text-muted-foreground">전적</div>
              <div className="font-semibold mt-1">
                {team.stats.wins}승 {team.stats.draws}무 {team.stats.losses}패
              </div>
            </div>
            <div className="bg-secondary/30 rounded-lg p-2">
              <div className="text-xs text-muted-foreground">경기</div>
              <div className="font-semibold mt-1">{team.stats.matchCount}경기</div>
            </div>
            <div className="bg-secondary/30 rounded-lg p-2">
              <div className="text-xs text-muted-foreground">득실</div>
              <div className="font-semibold mt-1">
                {team.stats.goalsFor}/{team.stats.goalsAgainst}
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        {/* 팀 설정 버튼 (주장만) */}
        {team.myRole === 'captain' && (
          <Link href={`/teams/${team.id}/settings`} className="flex-1">
            <Button variant="outline" className="w-full" size="sm">
              <Settings className="h-4 w-4 mr-1" />
              설정
            </Button>
          </Link>
        )}

        {/* 팀 탈퇴 버튼 */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" className={team.myRole === 'captain' ? 'flex-1' : 'w-full'} size="sm">
              탈퇴
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>팀 탈퇴</AlertDialogTitle>
              <AlertDialogDescription>
                정말로 <strong>{team.name}</strong> 팀에서 탈퇴하시겠습니까?
                {team.myRole === 'captain' && (
                  <span className="block mt-2 text-destructive">
                    주장은 탈퇴하기 전에 다른 멤버에게 주장 권한을 이양해야 합니다.
                  </span>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>취소</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleLeaveTeam}
                disabled={team.myRole === 'captain'}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                탈퇴
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
});
