'use client';

import { TeamCard } from '@/components/dashboard/team-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockMyTeams } from '@/data/dashboard-mock';
import { Users, Plus } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function MyTeamsPage() {
  const [teams, setTeams] = useState(mockMyTeams);

  const handleLeaveTeam = (teamId: string) => {
    // 팀 탈퇴 처리 (실제 구현은 나중에)
    console.log('팀 탈퇴:', teamId);
    setTeams((prev) => prev.filter((team) => team.id !== teamId));
  };

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-6">
      {/* 헤더 */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">내 팀</h1>
          <p className="text-muted-foreground mt-1">
            소속된 팀을 관리하세요
          </p>
        </div>
        <Link href="/teams/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            팀 생성
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>소속 팀 목록 ({teams.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {teams.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teams.map((team) => (
                <TeamCard key={team.id} team={team} onLeaveTeam={handleLeaveTeam} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground space-y-4">
              <Users className="h-16 w-16 mx-auto opacity-50" />
              <div>
                <p className="font-medium">소속된 팀이 없습니다</p>
                <p className="text-sm mt-1">팀을 찾아보거나 새로운 팀을 만들어보세요</p>
              </div>
              <div className="flex gap-3 justify-center">
                <Link href="/teams">
                  <Button variant="outline">팀 찾아보기</Button>
                </Link>
                <Link href="/teams/new">
                  <Button>팀 생성하기</Button>
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 팀 역할 안내 */}
      <Card>
        <CardHeader>
          <CardTitle>팀 역할 안내</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <div className="h-2 w-2 rounded-full bg-primary mt-2" />
              <div>
                <p className="font-semibold">주장</p>
                <p className="text-sm text-muted-foreground">
                  팀 설정 관리, 멤버 초대/제거, 경기 생성 등 모든 권한을 가집니다.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-2 w-2 rounded-full bg-secondary mt-2" />
              <div>
                <p className="font-semibold">부주장</p>
                <p className="text-sm text-muted-foreground">
                  경기 생성, 참석 관리 등 일부 권한을 가집니다.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-2 w-2 rounded-full bg-muted mt-2" />
              <div>
                <p className="font-semibold">팀원</p>
                <p className="text-sm text-muted-foreground">
                  경기 참여, 참석 여부 관리 등 기본 권한을 가집니다.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
