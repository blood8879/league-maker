"use client";

import { useState } from "react";
import { LeagueCard } from "@/components/leagues/LeagueCard";
import { LeagueFilters } from "@/components/leagues/LeagueFilters";
import { MOCK_LEAGUES } from "@/lib/mock-data";

export default function LeaguesPage() {
  const [filters, setFilters] = useState({
    region: "all",
    status: "all",
    level: "all",
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setFilters({
      region: "all",
      status: "all",
      level: "all",
    });
  };

  const filteredLeagues = MOCK_LEAGUES.filter((league) => {
    if (filters.region !== "all" && !league.region.includes(filters.region)) return false;
    if (filters.status !== "all" && league.status !== filters.status) return false;
    if (filters.level !== "all" && league.level !== filters.level) return false;
    return true;
  });

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">리그 탐색</h1>
          <p className="text-muted-foreground">
            참가할 수 있는 다양한 리그와 대회를 찾아보세요.
          </p>
        </div>
      </div>

      <LeagueFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
      />

      {filteredLeagues.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLeagues.map((league) => (
            <LeagueCard key={league.id} league={league} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-muted/30 rounded-lg">
          <p className="text-muted-foreground text-lg">조건에 맞는 리그가 없습니다.</p>
        </div>
      )}
    </div>
  );
}
