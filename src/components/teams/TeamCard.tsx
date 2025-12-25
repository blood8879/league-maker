import Link from "next/link";
import { memo } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, MapPin, Trophy } from "lucide-react";
import Image from "next/image";
import type { Database } from "@/lib/supabase/types";

type Team = Database['public']['Tables']['teams']['Row'];

interface TeamCardProps {
  team: Team;
}

export const TeamCard = memo(function TeamCard({ team }: TeamCardProps) {
  const activityDays = team.activity_days
    ? (Array.isArray(team.activity_days) ? team.activity_days : [])
    : [];

  return (
    <Card className="flex flex-col h-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-full bg-muted flex items-center justify-center text-lg font-bold text-muted-foreground overflow-hidden">
              {team.logo_url ? (
                <Image
                  src={team.logo_url}
                  alt={team.name}
                  fill
                  className="object-cover"
                />
              ) : (
                team.name.slice(0, 2)
              )}
            </div>
            <div>
              <h3 className="font-bold text-lg leading-none mb-1">{team.name}</h3>
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="w-3 h-3 mr-1" />
                {team.region}
              </div>
            </div>
          </div>
          <Badge variant={team.is_recruiting ? "default" : "secondary"}>
            {team.is_recruiting ? "모집중" : "모집완료"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow pb-4">
        <div className="flex gap-2 mb-4 flex-wrap">
          <Badge variant="outline" className="text-xs">
            {team.level === 'beginner' ? '초급' : team.level === 'intermediate' ? '중급' : '상급'}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {team.description || '팀 소개가 없습니다.'}
        </p>
        <div className="grid grid-cols-3 gap-2 text-center text-sm bg-muted/30 p-2 rounded-md">
          <div className="flex flex-col">
            <span className="text-muted-foreground text-xs">멤버</span>
            <span className="font-semibold flex items-center justify-center gap-1">
              <Users className="w-3 h-3" /> {team.current_member_count}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground text-xs">경기</span>
            <span className="font-semibold flex items-center justify-center gap-1">
              <Trophy className="w-3 h-3" /> {team.total_matches}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground text-xs">활동</span>
            <span className="font-semibold">{activityDays.join(",") || '-'}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" variant="outline" asChild>
          <Link href={`/teams/${team.id}`}>팀 상세보기</Link>
        </Button>
      </CardFooter>
    </Card>
  );
});
