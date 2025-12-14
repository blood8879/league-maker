"use client";

import { memo } from "react";
import { User } from "@/types/auth";

interface PlayerStatsProps {
  user: User;
}

export const PlayerStats = memo(function PlayerStats({ user }: PlayerStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <div className="bg-blue-50 rounded-lg p-4">
        <div className="text-sm text-gray-600 mb-1">경기 수</div>
        <div className="text-2xl font-bold text-blue-600">{user.stats.matchCount}</div>
      </div>

      <div className="bg-green-50 rounded-lg p-4">
        <div className="text-sm text-gray-600 mb-1">참석률</div>
        <div className="text-2xl font-bold text-green-600">{user.stats.attendanceRate}%</div>
      </div>

      <div className="bg-yellow-50 rounded-lg p-4">
        <div className="text-sm text-gray-600 mb-1">득점</div>
        <div className="text-2xl font-bold text-yellow-600">{user.stats.goals}</div>
      </div>

      <div className="bg-purple-50 rounded-lg p-4">
        <div className="text-sm text-gray-600 mb-1">도움</div>
        <div className="text-2xl font-bold text-purple-600">{user.stats.assists}</div>
      </div>

      <div className="bg-orange-50 rounded-lg p-4">
        <div className="text-sm text-gray-600 mb-1">경고</div>
        <div className="text-2xl font-bold text-orange-600">{user.stats.yellowCards}</div>
      </div>

      <div className="bg-red-50 rounded-lg p-4">
        <div className="text-sm text-gray-600 mb-1">퇴장</div>
        <div className="text-2xl font-bold text-red-600">{user.stats.redCards}</div>
      </div>
    </div>
  );
});
