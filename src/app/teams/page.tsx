"use client";

import { useState, useEffect } from "react";
import { TeamList } from "@/components/teams/TeamList";
import { TeamFilters } from "@/components/teams/TeamFilters";
import { TeamSearch } from "@/components/teams/TeamSearch";
import { getTeams } from "@/lib/supabase/queries/teams";
import type { Database } from "@/lib/supabase/types";

type Team = Database['public']['Tables']['teams']['Row'];

export default function TeamsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [regionFilter, setRegionFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"latest" | "popular" | "members">("latest");
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTeams() {
      try {
        setLoading(true);
        const data = await getTeams({
          search: searchQuery,
          region: regionFilter,
          level: levelFilter,
          sortBy,
        });
        setTeams(data);
      } catch (error) {
        console.error('Failed to load teams:', error);
      } finally {
        setLoading(false);
      }
    }

    loadTeams();
  }, [searchQuery, regionFilter, levelFilter, sortBy]);

  const handleReset = () => {
    setSearchQuery("");
    setRegionFilter("all");
    setLevelFilter("all");
    setSortBy("latest");
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
            sortBy={sortBy}
            onRegionChange={setRegionFilter}
            onLevelChange={setLevelFilter}
            onSortChange={(value) => setSortBy(value as "latest" | "popular" | "members")}
            onReset={handleReset}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">팀 목록을 불러오는 중...</p>
        </div>
      ) : (
        <TeamList teams={teams} />
      )}
    </div>
  );
}
