import Link from "next/link";
import { Match } from "@/types/league";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";

interface MercenaryRecruitmentProps {
  match: Match;
}

export function MercenaryRecruitment({ match }: MercenaryRecruitmentProps) {
  if (!match.mercenaryRecruitment?.enabled) {
    return null;
  }

  const { positions, count } = match.mercenaryRecruitment;

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
              {positions.map((pos) => (
                <Badge key={pos} variant="outline" className="bg-white">
                  {pos}
                </Badge>
              ))}
            </div>
          </div>
          <div className="space-y-1 text-center md:text-left">
            <div className="text-sm text-muted-foreground">모집 인원</div>
            <div className="font-bold">{count}명</div>
          </div>
          <Button asChild className="w-full md:w-auto">
            <Link href={`/matches/${match.id}/mercenaries`}>
              용병 신청하기
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
