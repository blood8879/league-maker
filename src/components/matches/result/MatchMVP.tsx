"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Target, Zap } from 'lucide-react';
import { PlayerMatchStats } from '@/types/match';

interface MatchMVPProps {
  topScorer?: PlayerMatchStats;
  topAssister?: PlayerMatchStats;
}

export function MatchMVP({ topScorer, topAssister }: MatchMVPProps) {
  if (!topScorer && !topAssister) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            경기 MVP
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            MVP 정보가 없습니다
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5" />
          경기 MVP
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          {/* 득점왕 */}
          {topScorer && topScorer.goals > 0 && (
            <div className="p-4 rounded-lg border bg-gradient-to-br from-yellow-50 to-orange-50">
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-5 h-5 text-orange-600" />
                <span className="font-semibold text-sm">득점왕</span>
              </div>
              <div className="space-y-1">
                <div className="font-bold text-lg">{topScorer.playerName}</div>
                <div className="text-2xl font-bold text-orange-600">
                  {topScorer.goals}골
                </div>
                {topScorer.assists > 0 && (
                  <div className="text-sm text-muted-foreground">
                    어시스트 {topScorer.assists}개
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 어시스트왕 */}
          {topAssister && topAssister.assists > 0 && (
            <div className="p-4 rounded-lg border bg-gradient-to-br from-blue-50 to-cyan-50">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-sm">어시스트왕</span>
              </div>
              <div className="space-y-1">
                <div className="font-bold text-lg">{topAssister.playerName}</div>
                <div className="text-2xl font-bold text-blue-600">
                  {topAssister.assists}개
                </div>
                {topAssister.goals > 0 && (
                  <div className="text-sm text-muted-foreground">
                    득점 {topAssister.goals}골
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
