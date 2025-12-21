"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-r from-primary to-purple-900 text-white text-center">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">
          지금 시작하고, 무료로 팀을 만들어보세요
        </h2>
        <p className="text-lg md:text-xl text-purple-100 mb-10 max-w-2xl mx-auto">
          신용카드 필요 없음 · 5분 만에 가입 완료
        </p>
        
        <div className="flex flex-col items-center">
          <Button 
            size="lg" 
            className="bg-white text-primary hover:bg-gray-100 text-lg px-8 py-6 h-auto font-bold mb-4"
            asChild
          >
            <Link href="/signup">무료로 시작하기</Link>
          </Button>
          <p className="text-sm text-purple-200">
            이미 1,234개 팀이 함께하고 있습니다
          </p>
        </div>
      </div>
    </section>
  );
}
