"use client";

import { Match, PlayerMatchStats } from '@/types/match';
import { GoalTimeline } from './GoalTimeline';
import { KeyEventSummary } from './KeyEventSummary';
import { MatchMVP } from './MatchMVP';

interface OverviewTabProps {
  match: Match;
}

export function OverviewTab({ match }: OverviewTabProps) {
  // 선수 이름 가져오기 함수 (임시 구현)
  const getPlayerName = (playerId: string): string => {
    // 실제로는 선수 데이터에서 가져와야 함
    // 지금은 임시로 playerId를 그대로 반환
    return playerId;
  };

  // MVP 계산 함수
  const calculateMVP = (): { topScorer?: PlayerMatchStats; topAssister?: PlayerMatchStats } => {
    const playerStats = new Map<string, PlayerMatchStats>();

    // 이벤트가 없으면 빈 결과 반환
    if (!match.events || match.events.length === 0) {
      return {};
    }

    // 이벤트에서 통계 수집
    match.events.forEach(event => {
      if (event.type === 'goal') {
        // 득점자 통계
        const scorer = playerStats.get(event.playerId) || {
          playerId: event.playerId,
          playerName: getPlayerName(event.playerId),
          teamId: event.teamId,
          goals: 0,
          assists: 0,
          yellowCards: 0,
          redCards: 0,
        };
        scorer.goals += 1;
        playerStats.set(event.playerId, scorer);

        // 어시스트 통계
        if (event.relatedPlayerId) {
          const assister = playerStats.get(event.relatedPlayerId) || {
            playerId: event.relatedPlayerId,
            playerName: getPlayerName(event.relatedPlayerId),
            teamId: event.teamId,
            goals: 0,
            assists: 0,
            yellowCards: 0,
            redCards: 0,
          };
          assister.assists += 1;
          playerStats.set(event.relatedPlayerId, assister);
        }
      }
    });

    const stats = Array.from(playerStats.values());

    // 득점왕 찾기
    const topScorer = stats.reduce<PlayerMatchStats | undefined>(
      (max, current) => {
        if (!max || current.goals > max.goals) return current;
        return max;
      },
      undefined
    );

    // 어시스트왕 찾기
    const topAssister = stats.reduce<PlayerMatchStats | undefined>(
      (max, current) => {
        if (!max || current.assists > max.assists) return current;
        return max;
      },
      undefined
    );

    return { topScorer, topAssister };
  };

  const { topScorer, topAssister } = calculateMVP();

  const events = match.events || [];

  return (
    <div className="space-y-6">
      {/* 득점 타임라인 */}
      <GoalTimeline
        events={events}
        homeTeamId={match.homeTeamId}
        getPlayerName={getPlayerName}
      />

      {/* 주요 이벤트 요약 */}
      <KeyEventSummary
        events={events}
        homeTeamName={match.homeTeamName}
        awayTeamName={match.awayTeamName}
        homeTeamId={match.homeTeamId}
        awayTeamId={match.awayTeamId}
      />

      {/* MVP */}
      <MatchMVP topScorer={topScorer} topAssister={topAssister} />
    </div>
  );
}
