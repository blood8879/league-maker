'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { ArrowLeft, MoreHorizontal, Share2, Flag, ThumbsUp, Calendar } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { CommentSection } from '@/components/community/CommentSection';
import { getPostById, Post } from '@/lib/mock-community';

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (typeof params.id === 'string') {
        setIsLoading(true);
        const data = await getPostById(params.id);
        setPost(data || null);
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
        <div className="h-8 w-24 bg-muted/20 animate-pulse rounded" />
        <div className="h-12 w-3/4 bg-muted/20 animate-pulse rounded" />
        <div className="h-64 w-full bg-muted/20 animate-pulse rounded" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">게시글을 찾을 수 없습니다.</h2>
        <Button onClick={() => router.back()}>뒤로 가기</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button variant="ghost" className="mb-6 pl-0 hover:pl-0 hover:bg-transparent" onClick={() => router.back()}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        목록으로 돌아가기
      </Button>

      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{post.category === 'mercenary' ? '용병모집' : '자유게시판'}</Badge>
            <span className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: ko })}
            </span>
          </div>
          
          <h1 className="text-3xl font-bold">{post.title}</h1>
          
          <div className="flex items-center justify-between py-4 border-b">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={post.author.avatar} />
                <AvatarFallback>{post.author.nickname[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{post.author.nickname}</div>
                <div className="text-xs text-muted-foreground">
                  {post.author.teamName && <span>{post.author.teamName} • </span>}
                  조회 {post.viewCount}
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="ghost" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="text-destructive">
                    <Flag className="h-4 w-4 mr-2" /> 신고하기
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Mercenary Info (if applicable) */}
        {post.mercenaryInfo && (
          <div className="bg-muted/30 rounded-lg p-6 border">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              경기 정보
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground w-16">일시</span>
                  <span className="font-medium">{post.mercenaryInfo.matchDate} {post.mercenaryInfo.matchTime}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground w-16">장소</span>
                  <span className="font-medium">{post.mercenaryInfo.venue}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground w-16">지역</span>
                  <span className="font-medium">{post.mercenaryInfo.region}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground w-16">모집 포지션</span>
                  <div className="flex gap-2">
                    {post.mercenaryInfo.positions.map(pos => (
                      <Badge key={pos} variant="outline">{pos}</Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground w-16">실력</span>
                  <span className="font-medium">{post.mercenaryInfo.level}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground w-16">상태</span>
                  <Badge variant={post.mercenaryInfo.status === 'urgent' ? 'destructive' : 'default'}>
                    {post.mercenaryInfo.status === 'urgent' ? '긴급모집' : (post.mercenaryInfo.status === 'closed' ? '마감' : '모집중')}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <Button size="lg" className="w-full md:w-auto">
                용병 신청하기
              </Button>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="min-h-[200px] py-4 whitespace-pre-wrap leading-relaxed">
          {post.content}
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4 py-8">
          <Button variant="outline" size="lg" className="gap-2">
            <ThumbsUp className="h-5 w-5" />
            좋아요 {post.likeCount}
          </Button>
        </div>

        <Separator />

        {/* Comments */}
        <div className="pt-6">
          <CommentSection comments={post.comments} postId={post.id} />
        </div>
      </div>
    </div>
  );
}
