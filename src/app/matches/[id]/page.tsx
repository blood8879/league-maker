"use client";

import { use, useState, useEffect } from "react";
import { notFound } from "next/navigation";
import { getMatchById } from "@/lib/supabase/queries/matches";
import { MatchAttendance } from "@/components/matches/MatchAttendance";
import { MercenaryRecruitment } from "@/components/matches/MercenaryRecruitment";
import { Card, CardContent } from "@/components/ui/card";

interface MatchPageProps {
  params: Promise<{ id: string }>;
}

interface MatchData {
  id: string;
  type: string;
  home_team_id: string;
  away_team_id: string;
  match_date: string;
  match_time: string;
  venue: string;
  status: string;
  mercenary_recruitment_enabled: boolean;
  home_team?: { id: string; name: string; logo_url?: string | null };
  away_team?: { id: string; name: string; logo_url?: string | null };
}

export default function MatchPage({ params }: MatchPageProps) {
  const { id } = use(params);
  const [match, setMatch] = useState<MatchData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMatch() {
      try {
        const data = await getMatchById(id);
        setMatch(data as MatchData);
      } catch (error) {
        console.error('Failed to load match:', error);
      } finally {
        setLoading(false);
      }
    }
    loadMatch();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            로딩 중...
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!match) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold">
              {match.home_team?.name || '홈팀'} vs {match.away_team?.name || '원정팀'}
            </h1>
            <div className="flex justify-center gap-4 text-muted-foreground">
              <span>{match.match_date}</span>
              <span>{match.match_time}</span>
              <span>{match.venue}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          {match.mercenary_recruitment_enabled && (
            <MercenaryRecruitment matchId={match.id} teamId={match.home_team_id} />
          )}
          <MatchAttendance matchId={match.id} teamId={match.home_team_id} />
        </div>

        <div className="space-y-6">
          {/* Additional sidebar content can go here */}
        </div>
      </div>
    </div>
  );
}
