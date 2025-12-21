"use client"

import { Team } from "@/types/team";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Calendar } from "lucide-react";
import Image from "next/image";

interface TeamProfileProps {
  team: Team;
}

export function TeamProfile({ team }: TeamProfileProps) {
  return (
    <div className="bg-card border rounded-lg p-6 shadow-sm mb-8">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full bg-muted flex items-center justify-center text-3xl font-bold text-muted-foreground shrink-0 overflow-hidden">
          {team.logo ? (
            <Image
              src={team.logo}
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
                  {team.memberCount}명
                </div>
                <span>•</span>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {team.foundedDate} 창단
                </div>
              </div>
            </div>
            <Button size="lg">가입 신청</Button>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            <Badge variant="outline" className="text-sm">
              {team.level === "beginner"
                ? "초급"
                : team.level === "intermediate"
                ? "중급"
                : "상급"}
            </Badge>
            {team.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-sm">
                #{tag}
              </Badge>
            ))}
            <Badge variant={team.isRecruiting ? "default" : "secondary"}>
              {team.isRecruiting ? "모집중" : "모집완료"}
            </Badge>
          </div>

          <p className="text-muted-foreground mb-6">{team.description}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-muted/30 p-4 rounded-lg">
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-1">경기 수</div>
              <div className="text-2xl font-bold">{team.stats.matchCount}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-1">승/무/패</div>
              <div className="text-2xl font-bold">
                {team.stats.wins}/{team.stats.draws}/{team.stats.losses}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-1">득점</div>
              <div className="text-2xl font-bold text-blue-600">
                {team.stats.goalsFor}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-1">실점</div>
              <div className="text-2xl font-bold text-red-600">
                {team.stats.goalsAgainst}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
