'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  getRecentSearches,
  saveRecentSearch,
  removeRecentSearch,
  clearRecentSearches,
  mockPopularSearches,
} from '@/data/search-mock';

interface SearchBarProps {
  className?: string;
}

export function SearchBar({ className }: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 비동기로 최근 검색어 로드하여 React Compiler 경고 방지
    setTimeout(() => {
      setRecentSearches(getRecentSearches());
    }, 0);
  }, []);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    saveRecentSearch(searchQuery);
    setRecentSearches(getRecentSearches());
    setQuery('');
    setIsFocused(false);
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const handleRecentSearchClick = (search: string) => {
    handleSearch(search);
  };

  const handleRemoveRecentSearch = (search: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeRecentSearch(search);
    setRecentSearches(getRecentSearches());
  };

  const handleClearAll = () => {
    clearRecentSearches();
    setRecentSearches([]);
  };

  const showDropdown = isFocused && (recentSearches.length > 0 || mockPopularSearches.length > 0);

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="팀, 리그, 경기 검색..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          className="pl-10 pr-4"
        />
      </form>

      {/* 검색 자동완성 드롭다운 */}
      {showDropdown && (
        <div className="absolute top-full mt-2 w-full bg-background border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {/* 최근 검색어 */}
          {recentSearches.length > 0 && (
            <div className="p-3 border-b">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Clock className="h-4 w-4" />
                  <span>최근 검색어</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearAll}
                  className="h-auto p-1 text-xs text-muted-foreground hover:text-foreground"
                >
                  전체 삭제
                </Button>
              </div>
              <div className="space-y-1">
                {recentSearches.map((search) => (
                  <div
                    key={search}
                    className="flex items-center justify-between group hover:bg-accent rounded px-2 py-1.5 cursor-pointer"
                    onClick={() => handleRecentSearchClick(search)}
                  >
                    <span className="text-sm">{search}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleRemoveRecentSearch(search, e)}
                      className="h-auto p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 인기 검색어 */}
          <div className="p-3">
            <div className="flex items-center gap-2 text-sm font-medium mb-2">
              <TrendingUp className="h-4 w-4" />
              <span>인기 검색어</span>
            </div>
            <div className="space-y-1">
              {mockPopularSearches.slice(0, 5).map((search, index) => (
                <div
                  key={search.query}
                  className="flex items-center gap-3 hover:bg-accent rounded px-2 py-1.5 cursor-pointer"
                  onClick={() => handleSearch(search.query)}
                >
                  <span className="text-xs font-medium text-primary w-4">{index + 1}</span>
                  <span className="text-sm flex-1">{search.query}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
