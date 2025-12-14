import { use } from "react";
import { notFound } from "next/navigation";
import { MOCK_MATCHES } from "@/lib/mock-data";
import { MatchInfoHeader } from "@/components/matches/MatchInfoHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MercenaryPageProps {
  params: Promise<{ id: string }>;
}

export default function MercenaryPage({ params }: MercenaryPageProps) {
  const { id } = use(params);
  const match = MOCK_MATCHES.find((m) => m.id === id);

  if (!match || !match.mercenaryRecruitment?.enabled) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">용병 모집 공고</h1>
      
      <MatchInfoHeader match={match} />

      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>용병 신청</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-2">
              <Label>희망 포지션</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="포지션을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {match.mercenaryRecruitment.positions.map((pos) => (
                    <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>실력 수준</Label>
              <Select>
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
              <Label>한줄 소개</Label>
              <Input placeholder="간단한 자기소개를 입력해주세요." />
            </div>

            <div className="grid gap-2">
              <Label>연락처 (선택)</Label>
              <Input placeholder="카카오톡 ID 또는 전화번호" />
            </div>

            <Button className="w-full">신청하기</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
