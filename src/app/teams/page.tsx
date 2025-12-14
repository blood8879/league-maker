"use client";

import { useState } from "react";
import { TeamList } from "@/components/teams/TeamList";
import { TeamFilters } from "@/components/teams/TeamFilters";
import { TeamSearch } from "@/components/teams/TeamSearch";
import { MOCK_TEAMS } from "@/lib/mock-data";

export default function TeamsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [regionFilter, setRegionFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");

  const filteredTeams = MOCK_TEAMS.filter((team) => {
    const matchesSearch = team.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesRegion =
      regionFilter === "all" || team.region === regionFilter;
    const matchesLevel = levelFilter === "all" || team.level === levelFilter;

    return matchesSearch && matchesRegion && matchesLevel;
  });

  const handleReset = () => {
    setSearchQuery("");
    setRegionFilter("all");
    setLevelFilter("all");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">팀 찾기</h1>
          <p className="text-muted-foreground">
            함께 뛸 팀을 찾아보세요. 지역별, 실력별로 검색할 수 있습니다.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 justify-between items-end lg:items-center">
          <TeamSearch onSearch={setSearchQuery} />
          <TeamFilters
            region={regionFilter}
            level={levelFilter}
            onRegionChange={setRegionFilter}
            onLevelChange={setLevelFilter}
            onReset={handleReset}
          />
        </div>
      </div>

      <TeamList teams={filteredTeams} />
    </div>
  );
}
