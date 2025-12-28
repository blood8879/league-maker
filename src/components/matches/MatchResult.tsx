"use client";

import { useState, useEffect } from "react";
import { Share2, Trophy, Target } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  getFinishedMatchDetails,
  getMatchEvents,
  getMatchLineup,
  getMatchAttendance,
  getMatchMercenaries,
  getMatchMVP,
} from "@/lib/supabase/queries/match-results";

interface MatchResultProps {
  matchId: string;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export function MatchResult({ matchId }: MatchResultProps) {
  const [match, setMatch] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [mvp, setMVP] = useState<any>(null);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [mercenaries, setMercenaries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMatchResult() {
      try {
        const [matchData, eventsData, mvpData, attendanceData, mercData] =
          await Promise.all([
            getFinishedMatchDetails(matchId),
            getMatchEvents(matchId),
            getMatchMVP(matchId),
            getMatchAttendance(matchId),
            getMatchMercenaries(matchId),
          ]);

        setMatch(matchData);
        setEvents(eventsData);
        setMVP(mvpData);
        setAttendance(attendanceData);
        setMercenaries(mercData);
      } catch (error) {
        console.error("Failed to load match result:", error);
      } finally {
        setLoading(false);
      }
    }

    loadMatchResult();
  }, [matchId]);

  const handleShare = async () => {
    const url = `${window.location.origin}/matches/${matchId}`;
    try {
      await navigator.clipboard.writeText(url);
      alert("링크가 복사되었습니다!");
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };

  if (loading || !match) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          로딩 중...
        </CardContent>
      </Card>
    );
  }

  const homeGoals = events.filter(
    (e) =>
      e.event_type === "goal" && e.team_id === match.home_team_id
  ).length;
  const awayGoals = events.filter(
    (e) =>
      e.event_type === "goal" && e.team_id === match.away_team_id
  ).length;

  return (
    <div className="space-y-6">
      {/* Match Result Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-8">
              <div className="flex-1 text-right">
                <h2 className="text-2xl font-bold">
                  {match.home_team?.name || "홈팀"}
                </h2>
              </div>
              <div className="text-5xl font-bold">
                {homeGoals} - {awayGoals}
              </div>
              <div className="flex-1 text-left">
                <h2 className="text-2xl font-bold">
                  {match.away_team?.name || "원정팀"}
                </h2>
              </div>
            </div>
            <div className="flex justify-center gap-4 text-muted-foreground">
              <span>{new Date(match.match_date).toLocaleDateString()}</span>
              <span>•</span>
              <span>{match.venue}</span>
            </div>
            <div className="flex justify-center">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                경기 공유
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">개요</TabsTrigger>
          <TabsTrigger value="events">기록</TabsTrigger>
          <TabsTrigger value="lineup">라인업</TabsTrigger>
          <TabsTrigger value="stats">통계</TabsTrigger>
          <TabsTrigger value="attendance">참석</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          {/* MVP */}
          {(mvp?.topScorer || mvp?.topAssister) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  MVP
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {mvp?.topScorer && (
                    <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                      <Target className="h-5 w-5 text-primary" />
                      <div>
                        <div className="font-semibold">
                          득점왕: {mvp.topScorer.player?.nickname}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {mvp.topScorer.goals}골
                        </div>
                      </div>
                    </div>
                  )}
                  {mvp?.topAssister && (
                    <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                      <Target className="h-5 w-5 text-blue-500" />
                      <div>
                        <div className="font-semibold">
                          어시스트왕: {mvp.topAssister.player?.nickname}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {mvp.topAssister.assists}도움
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Goal Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>득점 타임라인</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {events
                  .filter((e) => e.event_type === "goal")
                  .map((event, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 bg-muted rounded-lg"
                    >
                      <Badge variant="outline">{event.minute}&apos;</Badge>
                      <div className="flex-1">
                        <div className="font-semibold">
                          ⚽ {event.player?.nickname}
                        </div>
                        {event.related_player && (
                          <div className="text-sm text-muted-foreground">
                            도움: {event.related_player.nickname}
                          </div>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {event.team?.name}
                      </div>
                    </div>
                  ))}
                {events.filter((e) => e.event_type === "goal").length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    득점 기록이 없습니다
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle>전체 경기 기록</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {events.map((event, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 hover:bg-muted rounded-lg transition-colors"
                  >
                    <Badge variant="outline">{event.minute}&apos;</Badge>
                    <div className="flex-1">
                      {event.event_type === "goal" && (
                        <span>⚽ 득점: {event.player?.nickname}</span>
                      )}
                      {event.event_type === "yellow_card" && (
                        <span>🟨 경고: {event.player?.nickname}</span>
                      )}
                      {event.event_type === "red_card" && (
                        <span>🟥 퇴장: {event.player?.nickname}</span>
                      )}
                      {event.event_type === "substitution" && (
                        <span>
                          🔄 교체: {event.player?.nickname} →{" "}
                          {event.related_player?.nickname}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {event.team?.name}
                    </div>
                  </div>
                ))}
                {events.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    기록이 없습니다
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Lineup Tab */}
        <TabsContent value="lineup">
          <div className="grid md:grid-cols-2 gap-4">
            <LineupCard
              matchId={matchId}
              teamId={match.home_team_id}
              teamName={match.home_team?.name || "홈팀"}
            />
            <LineupCard
              matchId={matchId}
              teamId={match.away_team_id}
              teamName={match.away_team?.name || "원정팀"}
            />
          </div>
        </TabsContent>

        {/* Stats Tab */}
        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle>경기 통계</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-3xl font-bold">{homeGoals}</div>
                    <div className="text-sm text-muted-foreground">득점</div>
                  </div>
                  <div className="text-muted-foreground">VS</div>
                  <div>
                    <div className="text-3xl font-bold">{awayGoals}</div>
                    <div className="text-sm text-muted-foreground">득점</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Attendance Tab */}
        <TabsContent value="attendance">
          <Card>
            <CardHeader>
              <CardTitle>최종 참석 인원</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center mb-6">
                  <div>
                    <div className="text-2xl font-bold text-green-500">
                      {attendance.filter((a) => a.status === "attending").length}
                    </div>
                    <div className="text-sm text-muted-foreground">참석</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-500">
                      {attendance.filter((a) => a.status === "absent").length}
                    </div>
                    <div className="text-sm text-muted-foreground">불참</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-yellow-500">
                      {attendance.filter((a) => a.status === "pending").length}
                    </div>
                    <div className="text-sm text-muted-foreground">미정</div>
                  </div>
                </div>

                {attendance
                  .filter((a) => a.status === "attending")
                  .map((att, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 bg-muted rounded-lg"
                    >
                      <div className="font-semibold">
                        {att.user?.nickname}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {att.team?.name}
                      </div>
                      {att.is_starter && (
                        <Badge variant="secondary">선발</Badge>
                      )}
                    </div>
                  ))}

                {mercenaries.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-semibold mb-3">용병 ({mercenaries.length}명)</h3>
                    {mercenaries.map((merc: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3 bg-muted rounded-lg mb-2"
                      >
                        <div className="font-semibold">
                          {merc.user?.nickname}
                        </div>
                        <Badge variant="outline">용병</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// LineupCard component
function LineupCard({
  matchId,
  teamId,
  teamName,
}: {
  matchId: string;
  teamId: string;
  teamName: string;
}) {
  const [lineup, setLineup] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLineup() {
      try {
        const data = await getMatchLineup(matchId, teamId);
        setLineup(data);
      } catch (error) {
        console.error("Failed to load lineup:", error);
      } finally {
        setLoading(false);
      }
    }

    loadLineup();
  }, [matchId, teamId]);

  const starters = lineup.filter((p) => p.is_starter);
  const substitutes = lineup.filter((p) => !p.is_starter);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{teamName}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">로딩 중...</div>
        ) : (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">선발 ({starters.length}명)</h3>
              <div className="space-y-2">
                {starters.map((player, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-2 bg-muted rounded"
                  >
                    {player.jersey_number && (
                      <Badge variant="outline">{player.jersey_number}</Badge>
                    )}
                    <div className="font-medium">{player.user?.nickname}</div>
                    <div className="text-sm text-muted-foreground ml-auto">
                      {player.user?.preferred_position}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {substitutes.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">교체 ({substitutes.length}명)</h3>
                <div className="space-y-2">
                  {substitutes.map((player, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-2 bg-muted/50 rounded"
                    >
                      {player.jersey_number && (
                        <Badge variant="outline">{player.jersey_number}</Badge>
                      )}
                      <div className="font-medium">{player.user?.nickname}</div>
                      <div className="text-sm text-muted-foreground ml-auto">
                        {player.user?.preferred_position}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
