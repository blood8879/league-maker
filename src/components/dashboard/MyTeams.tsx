"use client";

import Link from "next/link";
import { Users } from "lucide-react";
import { getUserTeams } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";

interface MyTeamsProps {
  userId: string;
}

export function MyTeams({ userId }: MyTeamsProps) {
  const teams = getUserTeams(userId);

  if (teams.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        소속된 팀이 없습니다.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {teams.map((team) => (
        <Link
          key={team.id}
          href={`/teams/${team.id}`}
          className="block border rounded-lg p-4 hover:bg-gray-50 transition"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2">{team.name}</h3>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{team.memberCount}명</span>
                </div>
                <span>{team.region}</span>
              </div>
            </div>
            <Badge variant="outline">{team.level === 'beginner' ? '초급' : team.level === 'intermediate' ? '중급' : '고급'}</Badge>
          </div>

          {team.stats && (
            <div className="mt-3 pt-3 border-t grid grid-cols-4 gap-2 text-sm text-center">
              <div>
                <div className="text-gray-500">경기</div>
                <div className="font-semibold">{team.stats.matchCount}</div>
              </div>
              <div>
                <div className="text-gray-500">승</div>
                <div className="font-semibold text-green-600">{team.stats.wins}</div>
              </div>
              <div>
                <div className="text-gray-500">무</div>
                <div className="font-semibold text-gray-600">{team.stats.draws}</div>
              </div>
              <div>
                <div className="text-gray-500">패</div>
                <div className="font-semibold text-red-600">{team.stats.losses}</div>
              </div>
            </div>
          )}
        </Link>
      ))}
    </div>
  );
}
