"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative h-[80vh] min-h-[600px] w-full flex items-center justify-center overflow-hidden bg-black">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-60"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=2670&auto=format&fit=crop')"
        }}
      />
      <div className="absolute inset-0 z-10 bg-black/50" />

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 text-center text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight animate-fade-in-up">
          당신의 축구 기록,<br className="md:hidden" /> 이제 프로처럼 관리하세요
        </h1>
        <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto animate-fade-in-up delay-100">
          경기 기록부터 리그 운영까지, 아마추어 축구의 모든 것.<br />
          이미 1,234개 팀이 함께하고 있습니다.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-200">
          <Button 
            size="lg" 
            className="w-full sm:w-auto min-w-[200px] text-lg h-14 bg-primary hover:bg-primary/90 text-white"
            asChild
          >
            <Link href="/signup">무료로 시작하기</Link>
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="w-full sm:w-auto min-w-[200px] text-lg h-14 border-white text-white hover:bg-white hover:text-black bg-transparent"
            asChild
          >
            <Link href="/teams">팀 찾아보기</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
