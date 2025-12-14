'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Filter, MapPin, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MercenaryCard } from '@/components/community/MercenaryCard';
import { getMercenaryPosts, Post } from '@/lib/mock-community';
import { Badge } from '@/components/ui/badge';

export default function MercenaryBoardPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filters
  const [region, setRegion] = useState('all');
  const [position, setPosition] = useState('all');
  const [level, setLevel] = useState('all');

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      const data = await getMercenaryPosts();
      
      // Client-side filtering
      const filteredData = data.filter(post => {
        if (!post.mercenaryInfo) return false;
        if (region !== 'all' && post.mercenaryInfo.region !== region) return false;
        if (position !== 'all' && !post.mercenaryInfo.positions.includes(position)) return false;
        if (level !== 'all' && post.mercenaryInfo.level !== level) return false;
        return true;
      });
      
      setPosts(filteredData);
      setIsLoading(false);
    };

    fetchPosts();
  }, [region, position, level]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">용병 모집</h1>
          <p className="text-muted-foreground mt-1">
            부족한 인원을 채우거나, 경기에 참여할 기회를 찾아보세요.
          </p>
        </div>
        <Link href="/community/new?category=mercenary">
          <Button className="gap-2">
            <User className="h-4 w-4" />
            용병 모집하기
          </Button>
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="bg-card border rounded-lg p-4 mb-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="팀명, 경기장 검색..."
              className="pl-9"
            />
          </div>
          
          <Select value={region} onValueChange={setRegion}>
            <SelectTrigger>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <SelectValue placeholder="지역 선택" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 지역</SelectItem>
              <SelectItem value="서울">서울</SelectItem>
              <SelectItem value="경기">경기</SelectItem>
              <SelectItem value="인천">인천</SelectItem>
              <SelectItem value="부산">부산</SelectItem>
            </SelectContent>
          </Select>

          <Select value={position} onValueChange={setPosition}>
            <SelectTrigger>
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="h-4 w-4" />
                <SelectValue placeholder="포지션 선택" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 포지션</SelectItem>
              <SelectItem value="FW">FW (공격수)</SelectItem>
              <SelectItem value="MF">MF (미드필더)</SelectItem>
              <SelectItem value="DF">DF (수비수)</SelectItem>
              <SelectItem value="GK">GK (골키퍼)</SelectItem>
            </SelectContent>
          </Select>

          <Select value={level} onValueChange={setLevel}>
            <SelectTrigger>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="실력 선택" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 실력</SelectItem>
              <SelectItem value="입문">입문</SelectItem>
              <SelectItem value="초급">초급</SelectItem>
              <SelectItem value="중급">중급</SelectItem>
              <SelectItem value="상급">상급</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
          <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">오늘 경기</Badge>
          <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">이번 주말</Badge>
          <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">긴급 모집</Badge>
          <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">마감 임박</Badge>
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-48 bg-muted/20 animate-pulse rounded-lg" />
          ))}
        </div>
      ) : posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <MercenaryCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-muted-foreground bg-muted/10 rounded-lg">
          조건에 맞는 용병 모집 공고가 없습니다.
        </div>
      )}
    </div>
  );
}
