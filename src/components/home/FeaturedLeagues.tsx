import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Users } from "lucide-react";

export function FeaturedLeagues() {
  const leagues = [
    {
      id: 1,
      name: "2024 강남구 주말리그",
      type: "리그전",
      teams: 12,
      nextMatch: "11/23 (토)",
      image: "https://images.unsplash.com/photo-1522778119026-d647f0565c6a?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: 2,
      name: "제5회 직장인 챔피언스컵",
      type: "토너먼트",
      teams: 32,
      nextMatch: "11/24 (일)",
      image: "https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: 3,
      name: "서울 대학생 축구 연맹전",
      type: "혼합",
      teams: 24,
      nextMatch: "11/25 (월)",
      image: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: 4,
      name: "수도권 아마추어 1부 리그",
      type: "리그전",
      teams: 16,
      nextMatch: "11/23 (토)",
      image: "https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=800&auto=format&fit=crop",
    },
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-foreground mb-8">진행중인 대회</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {leagues.map((league) => (
            <Card key={league.id} className="overflow-hidden hover:scale-105 transition-transform duration-300 cursor-pointer group">
              <div className="relative h-40 overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url('${league.image}')` }}
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                <Badge className="absolute top-3 right-3 bg-primary text-white hover:bg-primary">
                  {league.type}
                </Badge>
              </div>
              <CardContent className="p-5">
                <h3 className="text-lg font-bold mb-3 line-clamp-1 group-hover:text-primary transition-colors">
                  {league.name}
                </h3>
                <div className="flex flex-col space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    <span>{league.teams}개 팀 참가 중</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>다음 경기: {league.nextMatch}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-5 pt-0">
                <Button variant="secondary" className="w-full" asChild>
                  <Link href={`/leagues/${league.id}`}>리그 보기</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
