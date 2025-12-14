'use client';

import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { MessageSquare, ThumbsUp, Eye, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Post } from '@/lib/mock-community';
import { cn } from '@/lib/utils';

interface PostCardProps {
  post: Post;
  className?: string;
}

export function PostCard({ post, className }: PostCardProps) {
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'free': return '자유';
      case 'recruitment': return '팀원모집';
      case 'mercenary': return '용병';
      case 'review': return '후기';
      default: return category;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'free': return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
      case 'recruitment': return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'mercenary': return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
      case 'review': return 'bg-green-100 text-green-800 hover:bg-green-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Link href={`/community/${post.id}`}>
      <Card className={cn("hover:shadow-md transition-shadow cursor-pointer h-full", className)}>
        <CardHeader className="p-4 pb-2 space-y-2">
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className={cn("font-normal", getCategoryColor(post.category))}>
              {getCategoryLabel(post.category)}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: ko })}
            </span>
          </div>
          <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
            {post.title}
          </h3>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4 h-10">
            {post.content}
          </p>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Avatar className="h-5 w-5">
                <AvatarImage src={post.author.avatar} />
                <AvatarFallback><User className="h-3 w-3" /></AvatarFallback>
              </Avatar>
              <span>{post.author.nickname}</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                <span>{post.viewCount}</span>
              </div>
              <div className="flex items-center gap-1">
                <ThumbsUp className="h-3 w-3" />
                <span>{post.likeCount}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                <span>{post.commentCount}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
