"use client";

import Link from "next/link";
import { Calendar, MapPin } from "lucide-react";
import { getUserPendingMatches } from "@/lib/mock-data";

interface PendingMatchesProps {
  userId: string;
}

export function PendingMatches({ userId }: PendingMatchesProps) {
  const matches = getUserPendingMatches(userId);

  if (matches.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        참석 대기중인 경기가 없습니다.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {matches.map((match) => (
        <Link
          key={match.id}
          href={`/matches/${match.id}`}
          className="block border rounded-lg p-4 hover:bg-gray-50 transition"
        >
          <h3 className="font-semibold mb-2">
            {match.homeTeamName} vs {match.awayTeamName}
          </h3>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{match.date} {match.time}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{match.venue}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
