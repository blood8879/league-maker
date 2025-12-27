"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Check, X, HelpCircle } from "lucide-react";
import { getMatchAttendances, upsertAttendance } from "@/lib/supabase/queries/attendances";

interface AttendanceData {
  id: string;
  user_id: string;
  status: 'attending' | 'absent' | 'pending';
  user?: {
    id: string;
    nickname: string;
    avatar_url?: string | null;
  };
}

interface MatchAttendanceProps {
  matchId: string;
  teamId: string;
}

export function MatchAttendance({ matchId, teamId }: MatchAttendanceProps) {
  const { user } = useAuth();
  const [attendances, setAttendances] = useState<AttendanceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadAttendances();
  }, [matchId]);

  async function loadAttendances() {
    try {
      const data = await getMatchAttendances(matchId);
      setAttendances(data as AttendanceData[]);
    } catch (error) {
      console.error('Failed to load attendances:', error);
    } finally {
      setLoading(false);
    }
  }

  const myAttendance = user ? attendances.find(a => a.user_id === user.id) : null;

  async function handleAttendance(status: 'attending' | 'absent' | 'pending') {
    if (!user || updating) return;

    setUpdating(true);
    try {
      await upsertAttendance({
        match_id: matchId,
        user_id: user.id,
        team_id: teamId,
        status,
      });

      await loadAttendances();
    } catch (error) {
      console.error('Failed to update attendance:', error);
      alert('참석 상태 업데이트에 실패했습니다.');
    } finally {
      setUpdating(false);
    }
  }

  const attending = attendances.filter(a => a.status === 'attending');
  const absent = attendances.filter(a => a.status === 'absent');
  const pending = attendances.filter(a => a.status === 'pending');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>참석 현황</span>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              참석 {attending.length}
            </Badge>
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
              불참 {absent.length}
            </Badge>
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
              미정 {pending.length}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {user && (
          <div className="flex justify-center gap-4 p-4 bg-muted/30 rounded-lg">
            <Button
              variant={myAttendance?.status === 'attending' ? "default" : "outline"}
              className={myAttendance?.status === 'attending' ? "bg-green-600 hover:bg-green-700" : ""}
              onClick={() => handleAttendance('attending')}
            >
              <Check className="mr-2 h-4 w-4" /> 참석
            </Button>
            <Button
              variant={myAttendance?.status === 'absent' ? "default" : "outline"}
              className={myAttendance?.status === 'absent' ? "bg-red-600 hover:bg-red-700" : ""}
              onClick={() => handleAttendance('absent')}
            >
              <X className="mr-2 h-4 w-4" /> 불참
            </Button>
            <Button
              variant={myAttendance?.status === 'pending' ? "default" : "outline"}
              className={myAttendance?.status === 'pending' ? "bg-yellow-600 hover:bg-yellow-700" : ""}
              onClick={() => handleAttendance('pending')}
            >
              <HelpCircle className="mr-2 h-4 w-4" /> 미정
            </Button>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-3 text-muted-foreground">참석자 ({attending.length})</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {attending.map((a) => (
                <div key={a.playerId} className="flex items-center gap-2 p-2 rounded border bg-card">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`https://placehold.co/100x100/png?text=${getPlayerName(a.playerId)[0]}`} />
                    <AvatarFallback>{getPlayerName(a.playerId)[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium truncate">{getPlayerName(a.playerId)}</span>
                </div>
              ))}
              {attending.length === 0 && <div className="text-sm text-muted-foreground col-span-full text-center py-2">참석자가 없습니다.</div>}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
