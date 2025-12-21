'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search, PenSquare, Filter, TrendingUp, Clock, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PostCard } from '@/components/community/PostCard';
import { getPosts, Post } from '@/lib/mock-community';

function CommunityContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category') || 'all';
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(categoryParam);
  const [sortBy, setSortBy] = useState('latest');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      const data = await getPosts(activeTab === 'all' ? undefined : activeTab);

      // Client-side filtering by search query
      let filteredData = data;
      if (searchQuery.trim()) {
        const lowerQuery = searchQuery.toLowerCase();
        filteredData = data.filter(post =>
          post.title.toLowerCase().includes(lowerQuery) ||
          post.content.toLowerCase().includes(lowerQuery) ||
          post.author.nickname.toLowerCase().includes(lowerQuery)
        );
      }

      // Client-side sorting
      const sortedData = [...filteredData].sort((a, b) => {
        if (sortBy === 'popular') return b.viewCount - a.viewCount;
        if (sortBy === 'comments') return b.commentCount - a.commentCount;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

      setPosts(sortedData);
      setIsLoading(false);
    };

    fetchPosts();
  }, [activeTab, sortBy, searchQuery]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">커뮤니티</h1>
          <p className="text-muted-foreground mt-1">
            축구에 대한 모든 이야기를 나누어보세요.
          </p>
        </div>
        <Link href="/community/new">
          <Button className="gap-2">
            <PenSquare className="h-4 w-4" />
            글쓰기
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar / Filters */}
        <div className="space-y-6">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="게시글 검색..."
              className="pl-9"
              value={searchQuery || ''}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Filter className="h-4 w-4" />
              정렬
            </h3>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="정렬 기준" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" /> 최신순
                  </div>
                </SelectItem>
                <SelectItem value="popular">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" /> 인기순
                  </div>
                </SelectItem>
                <SelectItem value="comments">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" /> 댓글 많은 순
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="p-4 bg-muted/50 rounded-lg space-y-3">
            <h3 className="font-semibold text-sm">인기 태그</h3>
            <div className="flex flex-wrap gap-2">
              {['#축구화', '#전술', '#용병', '#풋살', '#K리그', '#EPL'].map(tag => (
                <span key={tag} className="text-xs bg-background px-2 py-1 rounded-full border cursor-pointer hover:border-primary transition-colors">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full justify-start mb-6 overflow-x-auto">
              <TabsTrigger value="all">전체</TabsTrigger>
              <TabsTrigger value="free">자유게시판</TabsTrigger>
              <TabsTrigger value="recruitment">팀원모집</TabsTrigger>
              <TabsTrigger value="mercenary">용병모집</TabsTrigger>
              <TabsTrigger value="review">경기후기</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-0 space-y-6">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-32 bg-muted/20 animate-pulse rounded-lg" />
                  ))}
                </div>
              ) : posts.length > 0 ? (
                posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))
              ) : (
                <div className="text-center py-20 text-muted-foreground bg-muted/10 rounded-lg">
                  게시글이 없습니다.
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default function CommunityPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CommunityContent />
    </Suspense>
  );
}
