"use client";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LeagueFiltersProps {
  filters: {
    region: string;
    status: string;
    level: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onReset: () => void;
}

export function LeagueFilters({ filters, onFilterChange, onReset }: LeagueFiltersProps) {
  return (
    <div className="flex flex-wrap gap-4 mb-6 p-4 bg-muted/30 rounded-lg">
      <Select
        value={filters.region}
        onValueChange={(value) => onFilterChange("region", value)}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="지역" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">전체 지역</SelectItem>
          <SelectItem value="서울">서울</SelectItem>
          <SelectItem value="경기">경기</SelectItem>
          <SelectItem value="인천">인천</SelectItem>
          <SelectItem value="전국">전국</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.status}
        onValueChange={(value) => onFilterChange("status", value)}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="진행 상태" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">전체 상태</SelectItem>
          <SelectItem value="upcoming">모집중</SelectItem>
          <SelectItem value="ongoing">진행중</SelectItem>
          <SelectItem value="finished">종료</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.level}
        onValueChange={(value) => onFilterChange("level", value)}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="실력" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">전체 실력</SelectItem>
          <SelectItem value="beginner">초급</SelectItem>
          <SelectItem value="intermediate">중급</SelectItem>
          <SelectItem value="advanced">고급</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="ghost" onClick={onReset} className="ml-auto">
        필터 초기화
      </Button>
    </div>
  );
}
