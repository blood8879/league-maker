import { Team } from './team';
import { League } from './league';
import { Match } from './match';
import { Post } from './post';

// 검색 카테고리
export type SearchCategory = 'all' | 'teams' | 'leagues' | 'matches' | 'posts' | 'mercenaries';

// 통합 검색 결과
export interface SearchResults {
  teams: Team[];
  leagues: League[];
  matches: Match[];
  posts: Post[];
  mercenaries: Post[]; // 용병 구함 게시글
}

// 검색 자동완성 결과
export interface SearchSuggestion {
  id: string;
  type: SearchCategory;
  title: string;
  subtitle?: string;
  imageUrl?: string;
}

// 최근 검색어
export interface RecentSearch {
  query: string;
  timestamp: string;
}

// 인기 검색어
export interface PopularSearch {
  query: string;
  count: number;
}
