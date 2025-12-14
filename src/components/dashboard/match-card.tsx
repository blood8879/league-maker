'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MatchWithAttendance } from '@/types/dashboard';
import { Calendar, Clock, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface MatchCardProps {
  match: MatchWithAttendance;
  showQuickActions?: boolean;
  onAttendanceChange?: (matchId: string, status: 'attending' | 'absent' | 'pending') => void;
}

export function MatchCard({ match, showQuickActions = false, onAttendanceChange }: MatchCardProps) {
  const [attendance, setAttendance] = useState(match.myAttendance);

  const handleAttendanceClick = (status: 'attending' | 'absent' | 'pending') => {
    setAttendance(status);
    onAttendanceChange?.(match.id, status);
  };

  const getAttendanceBadge = () => {
    if (!attendance) return null;

    const variants = {
      attending: { label: '참석', variant: 'default' as const },
      absent: { label: '불참', variant: 'destructive' as const },
      pending: { label: '미정', variant: 'secondary' as const },
    };

    const { label, variant } = variants[attendance];
    return <Badge variant={variant}>{label}</Badge>;
  };

  const getMatchTypeLabel = () => {
    const types = {
      league: '리그',
      cup: '컵',
      friendly: '친선',
      practice: '연습',
    };
    return types[match.type] || match.type;
  };

  return (
    <Link href={`/matches/${match.id}`}>
      <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
        <CardContent className="p-4">
          <div className="space-y-3">
            {/* 경기 유형 및 참석 상태 */}
            <div className="flex items-center justify-between">
              <Badge variant="outline">{getMatchTypeLabel()}</Badge>
              {getAttendanceBadge()}
            </div>

            {/* 경기 정보 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{match.homeTeamName}</span>
                  {match.status === 'finished' && match.score && (
                    <>
                      <span className="text-muted-foreground">{match.score.home}</span>
                      <span className="text-muted-foreground">-</span>
                      <span className="text-muted-foreground">{match.score.away}</span>
                    </>
                  )}
                </div>
                {match.status === 'scheduled' && (
                  <span className="text-muted-foreground">vs</span>
                )}
              </div>
              <div className="text-sm font-semibold">{match.awayTeamName}</div>
            </div>

            {/* 날짜, 시간, 장소 */}
            <div className="space-y-1 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{new Date(match.date).toLocaleDateString('ko-KR')}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{match.time}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>{match.venue}</span>
              </div>
            </div>

            {/* 빠른 참석 변경 버튼 */}
            {showQuickActions && match.status === 'scheduled' && (
              <div className="flex gap-2 pt-2 border-t" onClick={(e) => e.preventDefault()}>
                <Button
                  size="sm"
                  variant={attendance === 'attending' ? 'default' : 'outline'}
                  onClick={() => handleAttendanceClick('attending')}
                  className="flex-1"
                >
                  참석
                </Button>
                <Button
                  size="sm"
                  variant={attendance === 'absent' ? 'destructive' : 'outline'}
                  onClick={() => handleAttendanceClick('absent')}
                  className="flex-1"
                >
                  불참
                </Button>
                <Button
                  size="sm"
                  variant={attendance === 'pending' ? 'secondary' : 'outline'}
                  onClick={() => handleAttendanceClick('pending')}
                  className="flex-1"
                >
                  미정
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
