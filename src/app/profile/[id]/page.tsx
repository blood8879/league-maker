"use client";

import { MOCK_USERS, MOCK_TEAMS } from "@/lib/mock-data";
import { notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/auth-context";
import { Settings } from "lucide-react";
import { use } from "react";

interface ProfilePageProps {
  params: Promise<{ id: string }>;
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const { id } = use(params);
  const { user: currentUser } = useAuth();
  
  // If viewing own profile, use currentUser from context to show latest updates
  // Otherwise find in MOCK_USERS
  let user = MOCK_USERS.find((u) => u.id === id);
  
  if (currentUser && currentUser.id === id) {
    user = currentUser;
  }

  if (!user) {
    notFound();
  }

  const userTeams = MOCK_TEAMS.filter((team) => user.teamIds.includes(team.id));
  const isOwnProfile = currentUser?.id === user.id;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row gap-8 items-start mb-12">
        <Avatar className="w-32 h-32 border-4 border-background shadow-lg">
          <AvatarImage src={user.avatar} alt={user.nickname} />
          <AvatarFallback className="text-4xl">
            {user.nickname.slice(0, 2)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-grow space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">{user.nickname}</h1>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
            {isOwnProfile && (
              <Link href="/profile/edit">
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  프로필 수정
                </Button>
              </Link>
            )}
          </div>

          <div className="flex gap-2">
            <Badge variant="secondary">
              {user.role === "player"
                ? "선수"
                : user.role === "coach"
                ? "감독/코치"
                : "매니저"}
            </Badge>
            {user.position && <Badge variant="outline">{user.position}</Badge>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Stats */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>개인 기록</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">경기 수</div>
                <div className="text-2xl font-bold">{user.stats.matchCount}</div>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">득점</div>
                <div className="text-2xl font-bold text-blue-600">
                  {user.stats.goals}
                </div>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">도움</div>
                <div className="text-2xl font-bold text-green-600">
                  {user.stats.assists}
                </div>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">참석률</div>
                <div className="text-2xl font-bold">
                  {user.stats.attendanceRate}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Teams */}
        <Card>
          <CardHeader>
            <CardTitle>소속 팀</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userTeams.map((team) => (
                <Link
                  key={team.id}
                  href={`/teams/${team.id}`}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground shrink-0 overflow-hidden">
                    {team.logo ? (
                      <Image
                        src={team.logo}
                        alt={team.name}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      team.name.slice(0, 2)
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{team.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {team.region}
                    </div>
                  </div>
                </Link>
              ))}
              {userTeams.length === 0 && (
                <div className="text-center text-muted-foreground py-4">
                  소속된 팀이 없습니다.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
