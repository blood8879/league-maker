"use client"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Calendar } from "lucide-react";
import Image from "next/image";
import type { Database } from "@/lib/supabase/types";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { isUserTeamMember } from "@/lib/supabase/queries/teams";

type Team = Database['public']['Tables']['teams']['Row'];

interface TeamProfileProps {
  team: Team;
}

export function TeamProfile({ team }: TeamProfileProps) {
  const { user } = useAuth();
  const [isMember, setIsMember] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkMembership() {
      if (!user) {
        setLoading(false);
        return;
      }

      const memberStatus = await isUserTeamMember(team.id, user.id);
      setIsMember(memberStatus);
      setLoading(false);
    }

    checkMembership();
  }, [user, team.id]);
  return (
    <div className="bg-card border rounded-lg p-6 shadow-sm mb-8">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full bg-muted flex items-center justify-center text-3xl font-bold text-muted-foreground shrink-0 overflow-hidden">
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

        <div className="flex-grow">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{team.name}</h1>
              <div className="flex flex-wrap gap-2 items-center text-muted-foreground">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {team.region}
                </div>
                <span>•</span>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {team.current_member_count}명
                </div>
                {team.founded_date && (
                  <>
                    <span>•</span>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {team.founded_date} 창단
                    </div>
                  </>
                )}
              </div>
            </div>
            {!loading && !isMember && <Button size="lg">가입 신청</Button>}
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            <Badge variant="outline" className="text-sm">
              {team.level === "beginner"
                ? "초급"
                : team.level === "intermediate"
                ? "중급"
                : "상급"}
            </Badge>
            <Badge variant={team.is_recruiting ? "default" : "secondary"}>
              {team.is_recruiting ? "모집중" : "모집완료"}
            </Badge>
          </div>

          <p className="text-muted-foreground mb-6">{team.description || '팀 소개가 없습니다.'}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-muted/30 p-4 rounded-lg">
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-1">경기 수</div>
              <div className="text-2xl font-bold">{team.total_matches}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-1">승/무/패</div>
              <div className="text-2xl font-bold">
                {team.wins}/{team.draws}/{team.losses}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-1">득점</div>
              <div className="text-2xl font-bold text-blue-600">
                {team.goals_for}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-1">실점</div>
              <div className="text-2xl font-bold text-red-600">
                {team.goals_against}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
