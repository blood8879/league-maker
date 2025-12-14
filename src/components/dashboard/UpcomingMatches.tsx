"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, MapPin, Clock } from "lucide-react";
import { getUserUpcomingMatches } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface UpcomingMatchesProps {
  userId: string;
}

type AttendanceStatus = 'attending' | 'absent' | 'pending';

export function UpcomingMatches({ userId }: UpcomingMatchesProps) {
  const matches = getUserUpcomingMatches(userId);
  const [attendanceStates, setAttendanceStates] = useState<Record<string, AttendanceStatus>>(() => {
    const initial: Record<string, AttendanceStatus> = {};
    matches.forEach(match => {
      const attendance = match.attendances?.find(a => a.playerId === userId);
      initial[match.id] = attendance?.status || 'pending';
    });
    return initial;
  });

  const handleAttendanceChange = (matchId: string, status: AttendanceStatus) => {
    setAttendanceStates(prev => ({
      ...prev,
      [matchId]: status
    }));
  };

  const getStatusBadge = (status: AttendanceStatus) => {
    switch (status) {
      case 'attending':
        return <Badge variant="default" className="bg-green-500">참석</Badge>;
      case 'absent':
        return <Badge variant="destructive">불참</Badge>;
      case 'pending':
        return <Badge variant="secondary">미정</Badge>;
    }
  };

  if (matches.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        예정된 경기가 없습니다.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {matches.map((match) => (
        <div
          key={match.id}
          className="border rounded-lg p-4 hover:bg-gray-50 transition"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Link href={`/matches/${match.id}`} className="hover:underline">
                <h3 className="font-semibold text-lg mb-2">
                  {match.homeTeamName} vs {match.awayTeamName}
                </h3>
              </Link>

              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{match.date}</span>
                  <Clock className="w-4 h-4 ml-2" />
                  <span>{match.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{match.venue}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              {getStatusBadge(attendanceStates[match.id])}

              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant={attendanceStates[match.id] === 'attending' ? 'default' : 'outline'}
                  onClick={() => handleAttendanceChange(match.id, 'attending')}
                  className="text-xs"
                >
                  참석
                </Button>
                <Button
                  size="sm"
                  variant={attendanceStates[match.id] === 'absent' ? 'destructive' : 'outline'}
                  onClick={() => handleAttendanceChange(match.id, 'absent')}
                  className="text-xs"
                >
                  불참
                </Button>
                <Button
                  size="sm"
                  variant={attendanceStates[match.id] === 'pending' ? 'secondary' : 'outline'}
                  onClick={() => handleAttendanceChange(match.id, 'pending')}
                  className="text-xs"
                >
                  미정
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
