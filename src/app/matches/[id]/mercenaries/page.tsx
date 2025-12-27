"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { getMatchById } from "@/lib/supabase/queries/matches";
import { applyMercenary } from "@/lib/supabase/queries/mercenaries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MercenaryPageProps {
  params: Promise<{ id: string }>;
}

interface MatchData {
  id: string;
  home_team_id: string;
  mercenary_recruitment_enabled: boolean;
  mercenary_positions: string[];
  home_team?: { name: string };
  away_team?: { name: string };
  match_date: string;
  venue: string;
}

export default function MercenaryPage({ params }: MercenaryPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const [match, setMatch] = useState<MatchData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [position, setPosition] = useState("");
  const [level, setLevel] = useState("");
  const [introduction, setIntroduction] = useState("");

  useEffect(() => {
    async function loadMatch() {
      try {
        const data = await getMatchById(id);
        const positions = data.mercenary_positions ? JSON.parse(JSON.stringify(data.mercenary_positions)) : [];

        setMatch({
          ...data,
          mercenary_positions: positions,
        } as MatchData);
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

  if (!match || !match.mercenary_recruitment_enabled) {
    notFound();
  }

  if (!user) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">로그인이 필요합니다.</p>
            <Button onClick={() => router.push('/login')}>로그인하기</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!position || !level || !introduction.trim()) {
      alert('모든 필수 항목을 입력해주세요.');
      return;
    }

    setSubmitting(true);
    try {
      await applyMercenary({
        match_id: match.id,
        user_id: user.id,
        team_id: match.home_team_id,
        position,
        level,
        introduction,
      });

      alert('용병 신청이 완료되었습니다!');
      router.push(`/matches/${match.id}`);
    } catch (error) {
      console.error('Failed to apply mercenary:', error);
      alert('용병 신청에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">용병 모집 공고</h1>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">
              {match.home_team?.name} vs {match.away_team?.name}
            </h2>
            <div className="flex gap-4 text-muted-foreground">
              <span>{match.match_date}</span>
              <span>{match.venue}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>용병 신청</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-2">
                <Label>희망 포지션 *</Label>
                <Select value={position} onValueChange={setPosition}>
                  <SelectTrigger>
                    <SelectValue placeholder="포지션을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {match.mercenary_positions.map((pos) => (
                      <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>실력 수준 *</Label>
                <Select value={level} onValueChange={setLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="본인의 실력을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">초급 (기본기 부족)</SelectItem>
                    <SelectItem value="intermediate">중급 (기본기 갖춤)</SelectItem>
                    <SelectItem value="advanced">고급 (선수 출신/숙련자)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>한줄 소개 *</Label>
                <Input
                  value={introduction}
                  onChange={(e) => setIntroduction(e.target.value)}
                  placeholder="간단한 자기소개를 입력해주세요."
                />
              </div>

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? '신청 중...' : '신청하기'}
              </Button>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
