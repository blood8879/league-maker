"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { getMatchById } from "@/lib/supabase/queries/matches";

interface MercenaryRecruitmentProps {
  matchId: string;
  teamId: string;
}

export function MercenaryRecruitment({ matchId }: MercenaryRecruitmentProps) {
  const [mercenaryData, setMercenaryData] = useState<{
    enabled: boolean;
    positions: string[];
    count: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMercenaryData() {
      try {
        const match = await getMatchById(matchId);

        if (match.mercenary_recruitment_enabled) {
          setMercenaryData({
            enabled: true,
            positions: match.mercenary_positions ? JSON.parse(JSON.stringify(match.mercenary_positions)) : [],
            count: match.mercenary_count || 0,
          });
        } else {
          setMercenaryData({ enabled: false, positions: [], count: 0 });
        }
      } catch (error) {
        console.error('Failed to load mercenary data:', error);
        setMercenaryData({ enabled: false, positions: [], count: 0 });
      } finally {
        setLoading(false);
      }
    }
    loadMercenaryData();
  }, [matchId]);

  if (loading || !mercenaryData?.enabled) {
    return null;
  }

  return (
    <Card className="border-blue-200 bg-blue-50/30">
      <CardHeader>
        <CardTitle className="flex justify-between items-center text-blue-900">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <span>용병 모집 중</span>
          </div>
          <Badge className="bg-blue-600 hover:bg-blue-700">모집중</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="space-y-1 text-center md:text-left">
            <div className="text-sm text-muted-foreground">모집 포지션</div>
            <div className="flex gap-2">
              {mercenaryData.positions.map((pos) => (
                <Badge key={pos} variant="outline" className="bg-white">
                  {pos}
                </Badge>
              ))}
            </div>
          </div>
          <div className="space-y-1 text-center md:text-left">
            <div className="text-sm text-muted-foreground">모집 인원</div>
            <div className="font-bold">{mercenaryData.count}명</div>
          </div>
          <Button asChild className="w-full md:w-auto">
            <Link href={`/matches/${matchId}/mercenaries`}>
              용병 신청하기
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
