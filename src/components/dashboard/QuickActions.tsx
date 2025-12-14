"use client";

import Link from "next/link";
import { PlusCircle, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export function QuickActions() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* 경기 생성 */}
      <Link href="/matches/new">
        <Button
          variant="outline"
          className="w-full h-24 flex flex-col items-center justify-center gap-2 hover:bg-primary/5"
        >
          <PlusCircle className="w-8 h-8" />
          <span className="font-semibold">경기 생성</span>
        </Button>
      </Link>

      {/* 팀 생성 */}
      <Link href="/teams/new">
        <Button
          variant="outline"
          className="w-full h-24 flex flex-col items-center justify-center gap-2 hover:bg-primary/5"
        >
          <Users className="w-8 h-8" />
          <span className="font-semibold">팀 생성</span>
        </Button>
      </Link>
    </div>
  );
}
