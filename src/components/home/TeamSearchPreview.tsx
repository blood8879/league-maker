"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, MapPin, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export function TeamSearchPreview() {
  const teams = [
    {
      id: 1,
      name: "FC 강남",
      region: "서울 강남구",
      time: "주말 오전",
      level: "중급",
      members: "18/25",
      logo: "https://api.dicebear.com/7.x/identicon/svg?seed=FCGangnam",
    },
    {
      id: 2,
      name: "송파 유나이티드",
      region: "서울 송파구",
      time: "주중 저녁",
      level: "초급",
      members: "12/20",
      logo: "https://api.dicebear.com/7.x/identicon/svg?seed=SongpaUnited",
    },
    {
      id: 3,
      name: "분당 위너스",
      region: "경기 성남시",
      time: "주말 오후",
      level: "상급",
      members: "22/30",
      logo: "https://api.dicebear.com/7.x/identicon/svg?seed=BundangWinners",
    },
    {
      id: 4,
      name: "판교 테크",
      region: "경기 성남시",
      time: "주중 저녁",
      level: "중급",
      members: "15/20",
      logo: "https://api.dicebear.com/7.x/identicon/svg?seed=PangyoTech",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-foreground mb-6">지금 바로 팀을 찾아보세요</h2>
          
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 max-w-3xl mx-auto bg-gray-50 p-6 rounded-xl shadow-sm border">
            <div className="w-full md:w-1/3">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="지역 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="seoul">서울</SelectItem>
                  <SelectItem value="gyeonggi">경기</SelectItem>
                  <SelectItem value="incheon">인천</SelectItem>
                  <SelectItem value="busan">부산</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-1/3">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="활동 시간" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekday_night">주중 저녁</SelectItem>
                  <SelectItem value="weekend_morning">주말 오전</SelectItem>
                  <SelectItem value="weekend_afternoon">주말 오후</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full md:w-auto px-8 bg-primary hover:bg-primary/90 text-white">
              <Search className="w-4 h-4 mr-2" />
              검색하기
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teams.map((team) => (
            <Card key={team.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-gray-100 mr-3 overflow-hidden">
                    <Image src={team.logo} alt={team.name} width={48} height={48} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{team.name}</h3>
                    <Badge variant="outline" className="text-xs font-normal">{team.level}</Badge>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                    {team.region}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-gray-400" />
                    {team.time}
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2 text-gray-400" />
                    {team.members}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/teams/${team.id}`}>팀 보기</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
