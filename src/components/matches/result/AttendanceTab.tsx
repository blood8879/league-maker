"use client";

import { Match, AttendanceStatus } from '@/types/match';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, Users } from 'lucide-react';

interface AttendanceTabProps {
  match: Match;
}

export function AttendanceTab({ match }: AttendanceTabProps) {
  const attendances = match.attendances || [];
  const approvedMercenaries = match.approvedMercenaries || [];

  // 선수 이름 가져오기 (임시)
  const getPlayerName = (playerId: string): string => {
    return playerId;
  };

  // 상태별 참석자 분류
  const attending = attendances.filter(a => a.status === 'attending');
  const absent = attendances.filter(a => a.status === 'absent');
  const pending = attendances.filter(a => a.status === 'pending');

  // 상태 라벨
  const getStatusLabel = (status: AttendanceStatus) => {
    switch (status) {
      case 'attending':
        return '참석';
      case 'absent':
        return '불참';
      case 'pending':
        return '보류';
    }
  };

  // 상태 색상
  const getStatusColor = (status: AttendanceStatus) => {
    switch (status) {
      case 'attending':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'absent':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* 참석 통계 */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">{attending.length}</div>
              <div className="text-sm text-muted-foreground">참석</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">{absent.length}</div>
              <div className="text-sm text-muted-foreground">불참</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">{pending.length}</div>
              <div className="text-sm text-muted-foreground">보류</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 참석 인원 */}
      {attending.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              참석 인원 ({attending.length}명)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-3">
              {attending.map((attendance) => (
                <div
                  key={attendance.playerId}
                  className="flex items-center gap-3 p-3 rounded-lg border"
                >
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">
                      {getPlayerName(attendance.playerId)}
                    </div>
                  </div>
                  <Badge className={getStatusColor(attendance.status)}>
                    {getStatusLabel(attendance.status)}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 불참 인원 */}
      {absent.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-600" />
              불참 인원 ({absent.length}명)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {absent.map((attendance) => (
                <div
                  key={attendance.playerId}
                  className="flex items-start gap-3 p-3 rounded-lg border"
                >
                  <XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="font-medium truncate">
                        {getPlayerName(attendance.playerId)}
                      </div>
                      <Badge className={getStatusColor(attendance.status)}>
                        {getStatusLabel(attendance.status)}
                      </Badge>
                    </div>
                    {attendance.reason && (
                      <div className="text-sm text-muted-foreground">
                        사유: {attendance.reason}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 보류 인원 */}
      {pending.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-600" />
              보류 중 ({pending.length}명)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-3">
              {pending.map((attendance) => (
                <div
                  key={attendance.playerId}
                  className="flex items-center gap-3 p-3 rounded-lg border"
                >
                  <Clock className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">
                      {getPlayerName(attendance.playerId)}
                    </div>
                  </div>
                  <Badge className={getStatusColor(attendance.status)}>
                    {getStatusLabel(attendance.status)}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 용병 정보 */}
      {approvedMercenaries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              승인된 용병 ({approvedMercenaries.length}명)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-3">
              {approvedMercenaries.map((mercenaryId) => (
                <div
                  key={mercenaryId}
                  className="flex items-center gap-3 p-3 rounded-lg border bg-blue-50"
                >
                  <Users className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">
                      {getPlayerName(mercenaryId)}
                    </div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                    용병
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 빈 상태 */}
      {attendances.length === 0 && approvedMercenaries.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>참석 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              참석 정보가 없습니다
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
