'use client';

import Link from 'next/link';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Post } from '@/lib/mock-community';
import { cn } from '@/lib/utils';

interface MercenaryCardProps {
  post: Post;
  className?: string;
}

export function MercenaryCard({ post, className }: MercenaryCardProps) {
  if (!post.mercenaryInfo) return null;

  const { matchDate, matchTime, venue, positions, level, status, region } = post.mercenaryInfo;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'urgent':
        return <Badge variant="destructive" className="animate-pulse">긴급모집</Badge>;
      case 'closed':
        return <Badge variant="secondary">마감</Badge>;
      default:
        return <Badge className="bg-green-600 hover:bg-green-700">모집중</Badge>;
    }
  };

  return (
    <Link href={`/community/${post.id}`}>
      <Card className={cn("hover:shadow-md transition-shadow cursor-pointer h-full border-l-4", 
        status === 'urgent' ? "border-l-red-500" : (status === 'closed' ? "border-l-gray-300" : "border-l-green-500"),
        className
      )}>
        <CardHeader className="p-4 pb-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex gap-2">
              {getStatusBadge(status)}
              <Badge variant="outline">{region}</Badge>
            </div>
            <span className="text-xs text-muted-foreground">
              {post.author.nickname}
            </span>
          </div>
          <h3 className="font-semibold text-lg line-clamp-1">
            {post.title}
          </h3>
        </CardHeader>
        <CardContent className="p-4 pt-2 space-y-3">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4 text-primary" />
              <span>{matchDate}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4 text-primary" />
              <span>{matchTime}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground col-span-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="truncate">{venue}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex gap-2">
              {positions.map(pos => (
                <Badge key={pos} variant="secondary" className="text-xs">
                  {pos}
                </Badge>
              ))}
            </div>
            <span className="text-sm font-medium text-primary">
              {level}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
