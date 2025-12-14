import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          {/* 404 Number */}
          <div className="space-y-4">
            <h1 className="text-9xl font-bold text-primary">404</h1>
            <div className="h-1 w-24 bg-primary mx-auto rounded-full" />
          </div>

          {/* Message */}
          <div className="space-y-4">
            <h2 className="text-3xl font-bold">페이지를 찾을 수 없습니다</h2>
            <p className="text-muted-foreground text-lg">
              요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
            </p>
          </div>

          {/* Suggestions */}
          <div className="bg-card border rounded-lg p-6 text-left">
            <h3 className="font-semibold mb-3">다음을 시도해보세요:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>URL 주소가 정확한지 확인해주세요</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>홈페이지에서 원하시는 페이지를 찾아보세요</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>검색 기능을 이용해보세요</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button size="lg" className="w-full sm:w-auto">
                <Home className="mr-2 h-5 w-5" />
                홈으로 이동
              </Button>
            </Link>
            <Link href="/search">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                <Search className="mr-2 h-5 w-5" />
                검색하기
              </Button>
            </Link>
            <Button
              size="lg"
              variant="ghost"
              className="w-full sm:w-auto"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              이전 페이지
            </Button>
          </div>

          {/* Quick Links */}
          <div className="pt-8 border-t">
            <p className="text-sm text-muted-foreground mb-4">자주 찾는 페이지</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/teams">
                <Button variant="link" size="sm">팀 찾기</Button>
              </Link>
              <Link href="/leagues">
                <Button variant="link" size="sm">대회</Button>
              </Link>
              <Link href="/matches">
                <Button variant="link" size="sm">경기 관리</Button>
              </Link>
              <Link href="/community">
                <Button variant="link" size="sm">커뮤니티</Button>
              </Link>
              <Link href="/support">
                <Button variant="link" size="sm">고객센터</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
