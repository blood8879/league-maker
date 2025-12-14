"use client";

import { Team } from "@/types/team";
import { TeamCard } from "./TeamCard";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface TeamListProps {
  teams: Team[];
}

const ITEMS_PER_PAGE = 8;

export function TeamList({ teams }: TeamListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(teams.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentTeams = teams.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  if (teams.length === 0) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        검색 결과가 없습니다.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {currentTeams.map((team) => (
          <TeamCard key={team.id} team={team} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            이전
          </Button>
          <span className="flex items-center px-4 text-sm">
            {currentPage} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            다음
          </Button>
        </div>
      )}
    </div>
  );
}
