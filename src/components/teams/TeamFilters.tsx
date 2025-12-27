"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface TeamFiltersProps {
  region: string;
  level: string;
  sortBy: string;
  onRegionChange: (value: string) => void;
  onLevelChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onReset: () => void;
}

export function TeamFilters({
  region,
  level,
  sortBy,
  onRegionChange,
  onLevelChange,
  onSortChange,
  onReset,
}: TeamFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-end">
      <div className="grid gap-2 w-full sm:w-[180px]">
        <Label htmlFor="region-filter">지역</Label>
        <Select value={region} onValueChange={onRegionChange}>
          <SelectTrigger id="region-filter">
            <SelectValue placeholder="지역 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            <SelectItem value="서울 강남구">서울 강남구</SelectItem>
            <SelectItem value="서울 서초구">서울 서초구</SelectItem>
            <SelectItem value="서울 송파구">서울 송파구</SelectItem>
            <SelectItem value="서울 마포구">서울 마포구</SelectItem>
            <SelectItem value="서울 영등포구">서울 영등포구</SelectItem>
            <SelectItem value="서울 관악구">서울 관악구</SelectItem>
            <SelectItem value="서울 동작구">서울 동작구</SelectItem>
            <SelectItem value="서울 용산구">서울 용산구</SelectItem>
            <SelectItem value="서울 성동구">서울 성동구</SelectItem>
            <SelectItem value="서울 광진구">서울 광진구</SelectItem>
            <SelectItem value="서울 동대문구">서울 동대문구</SelectItem>
            <SelectItem value="서울 중랑구">서울 중랑구</SelectItem>
            <SelectItem value="서울 성북구">서울 성북구</SelectItem>
            <SelectItem value="서울 강북구">서울 강북구</SelectItem>
            <SelectItem value="서울 도봉구">서울 도봉구</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2 w-full sm:w-[180px]">
        <Label htmlFor="level-filter">실력</Label>
        <Select value={level} onValueChange={onLevelChange}>
          <SelectTrigger id="level-filter">
            <SelectValue placeholder="실력 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            <SelectItem value="beginner">초급</SelectItem>
            <SelectItem value="intermediate">중급</SelectItem>
            <SelectItem value="advanced">상급</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2 w-full sm:w-[180px]">
        <Label htmlFor="sort-filter">정렬</Label>
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger id="sort-filter">
            <SelectValue placeholder="정렬 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">최신순</SelectItem>
            <SelectItem value="popular">인기순</SelectItem>
            <SelectItem value="members">멤버 수순</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button variant="ghost" onClick={onReset} className="mb-[2px]">
        초기화
      </Button>
    </div>
  );
}
