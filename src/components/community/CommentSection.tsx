'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Send, User, ThumbsUp, MoreVertical } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Comment } from '@/lib/mock-community';


interface CommentSectionProps {
  comments?: Comment[];
  postId: string;
}

export function CommentSection({ comments = [], postId }: CommentSectionProps) {
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would call an API
    console.log('Submit comment:', newComment, 'for post:', postId);
    setNewComment('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold">댓글</h3>
        <span className="text-muted-foreground">{comments.length}</span>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-4">
        <Avatar className="h-10 w-10 hidden sm:block">
          <AvatarFallback><User className="h-5 w-5" /></AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
          <Textarea
            placeholder="댓글을 작성하세요..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[80px] resize-none"
          />
          <div className="flex justify-end">
            <Button type="submit" size="sm" disabled={!newComment.trim()}>
              <Send className="h-4 w-4 mr-2" />
              등록
            </Button>
          </div>
        </div>
      </form>

      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={comment.author.avatar} />
              <AvatarFallback><User className="h-5 w-5" /></AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{comment.author.nickname}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: ko })}
                  </span>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-foreground/90 whitespace-pre-wrap">
                {comment.content}
              </p>
              <div className="flex items-center gap-4 pt-1">
                <Button variant="ghost" size="sm" className="h-auto p-0 text-muted-foreground hover:text-primary">
                  <ThumbsUp className="h-3 w-3 mr-1" />
                  좋아요 {comment.likeCount}
                </Button>
                <Button variant="ghost" size="sm" className="h-auto p-0 text-muted-foreground hover:text-primary">
                  답글 달기
                </Button>
              </div>
            </div>
          </div>
        ))}
        
        {comments.length === 0 && (
          <div className="text-center py-10 text-muted-foreground">
            첫 번째 댓글을 남겨보세요!
          </div>
        )}
      </div>
    </div>
  );
}
