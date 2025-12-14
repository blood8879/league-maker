'use client';

import { MatchCard } from '@/components/dashboard/match-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockAllMyMatches } from '@/data/dashboard-mock';
import { Calendar } from 'lucide-react';
import { useState, useMemo } from 'react';

type StatusFilter = 'all' | 'scheduled' | 'finished';
type AttendanceFilter = 'all' | 'attending' | 'absent' | 'pending';

export default function MyMatchesPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [attendanceFilter, setAttendanceFilter] = useState<AttendanceFilter>('all');
  const [matches, setMatches] = useState(mockAllMyMatches);

  const handleAttendanceChange = (matchId: string, status: 'attending' | 'absent' | 'pending') => {
    setMatches((prev) =>
      prev.map((match) =>
        match.id === matchId ? { ...match, myAttendance: status } : match
      )
    );
  };

  // 필터링된 경기 목록
  const filteredMatches = useMemo(() => {
    let result = matches;

    // 경기 상태 필터
    if (statusFilter !== 'all') {
      result = result.filter((match) => match.status === statusFilter);
    }

    // 참석 여부 필터
    if (attendanceFilter !== 'all') {
      result = result.filter((match) => match.myAttendance === attendanceFilter);
    }

    return result;
  }, [matches, statusFilter, attendanceFilter]);

  const getMatchCountByStatus = (status: StatusFilter) => {
    if (status === 'all') return matches.length;
    return matches.filter((m) => m.status === status).length;
  };

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-6">
      {/* 헤더 */}
      <div>
        <h1 className="text-3xl font-bold">내 경기 목록</h1>
        <p className="text-muted-foreground mt-1">
          참가한 경기 내역을 확인하세요
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle>경기 목록</CardTitle>

            {/* 참석 여부 필터 */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">참석 여부:</span>
              <Select
                value={attendanceFilter}
                onValueChange={(value) => setAttendanceFilter(value as AttendanceFilter)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="attending">참석</SelectItem>
                  <SelectItem value="absent">불참</SelectItem>
                  <SelectItem value="pending">미정</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* 경기 상태 탭 */}
          <Tabs value={statusFilter} onValueChange={(value) => setStatusFilter(value as StatusFilter)}>
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="all">
                전체 ({getMatchCountByStatus('all')})
              </TabsTrigger>
              <TabsTrigger value="scheduled">
                예정 ({getMatchCountByStatus('scheduled')})
              </TabsTrigger>
              <TabsTrigger value="finished">
                완료 ({getMatchCountByStatus('finished')})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4 mt-0">
              {filteredMatches.length > 0 ? (
                filteredMatches.map((match) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    showQuickActions={match.status === 'scheduled'}
                    onAttendanceChange={handleAttendanceChange}
                  />
                ))
              ) : (
                <EmptyState />
              )}
            </TabsContent>

            <TabsContent value="scheduled" className="space-y-4 mt-0">
              {filteredMatches.length > 0 ? (
                filteredMatches.map((match) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    showQuickActions
                    onAttendanceChange={handleAttendanceChange}
                  />
                ))
              ) : (
                <EmptyState message="예정된 경기가 없습니다" />
              )}
            </TabsContent>

            <TabsContent value="finished" className="space-y-4 mt-0">
              {filteredMatches.length > 0 ? (
                filteredMatches.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))
              ) : (
                <EmptyState message="완료된 경기가 없습니다" />
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function EmptyState({ message = '경기가 없습니다' }: { message?: string }) {
  return (
    <div className="text-center py-12 text-muted-foreground">
      <Calendar className="h-16 w-16 mx-auto mb-4 opacity-50" />
      <p>{message}</p>
    </div>
  );
}
