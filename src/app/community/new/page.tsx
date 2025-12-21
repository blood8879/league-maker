'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function NewPostForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'free';

  const [category, setCategory] = useState(initialCategory);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('Create post:', { category, title, content });
    
    setIsSubmitting(false);
    router.push('/community');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Button variant="ghost" className="mb-6 pl-0 hover:pl-0 hover:bg-transparent" onClick={() => router.back()}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        취소하고 돌아가기
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>새 게시글 작성</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="category">카테고리</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="카테고리 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">자유게시판</SelectItem>
                  <SelectItem value="recruitment">팀원모집</SelectItem>
                  <SelectItem value="mercenary">용병모집</SelectItem>
                  <SelectItem value="review">경기후기</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">제목</Label>
              <Input
                id="title"
                placeholder="제목을 입력하세요"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">내용</Label>
              <Textarea
                id="content"
                placeholder="내용을 입력하세요"
                className="min-h-[300px]"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                취소
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? '작성 중...' : '작성 완료'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function NewPostPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8 max-w-3xl">Loading...</div>}>
      <NewPostForm />
    </Suspense>
  );
}
