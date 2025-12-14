import { PopularSearch } from '@/types/search';

// 인기 검색어
export const mockPopularSearches: PopularSearch[] = [
  { query: 'FC 서울', count: 245 },
  { query: '강남', count: 189 },
  { query: '서울 K리그', count: 156 },
  { query: '용병 구함', count: 142 },
  { query: '친선 경기', count: 128 },
  { query: '초급', count: 115 },
  { query: '주말 경기', count: 98 },
  { query: '수원', count: 87 },
  { query: '강북 FC', count: 76 },
  { query: '축구 모임', count: 65 },
];

// 로컬 스토리지 키
export const RECENT_SEARCHES_KEY = 'league-maker-recent-searches';
export const MAX_RECENT_SEARCHES = 10;

// 최근 검색어 저장
export const saveRecentSearch = (query: string): void => {
  if (typeof window === 'undefined') return;

  const existing = getRecentSearches();
  const filtered = existing.filter((q) => q !== query);
  const updated = [query, ...filtered].slice(0, MAX_RECENT_SEARCHES);

  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
};

// 최근 검색어 가져오기
export const getRecentSearches = (): string[] => {
  if (typeof window === 'undefined') return [];

  const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
  return stored ? JSON.parse(stored) : [];
};

// 최근 검색어 삭제
export const removeRecentSearch = (query: string): void => {
  if (typeof window === 'undefined') return;

  const existing = getRecentSearches();
  const updated = existing.filter((q) => q !== query);

  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
};

// 모든 최근 검색어 삭제
export const clearRecentSearches = (): void => {
  if (typeof window === 'undefined') return;

  localStorage.removeItem(RECENT_SEARCHES_KEY);
};
