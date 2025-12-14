import { SearchResults } from '@/types/search';
import { Team } from '@/types/team';
import { League } from '@/types/league';
import { Match } from '@/types/match';
import { Post } from '@/types/post';

// 검색 수행 함수
export function performSearch(
  query: string,
  teams: Team[],
  leagues: League[],
  matches: Match[],
  posts: Post[]
): SearchResults {
  const lowerQuery = query.toLowerCase();

  // 팀 검색
  const filteredTeams = teams.filter(
    (team) =>
      team.name.toLowerCase().includes(lowerQuery) ||
      team.region.toLowerCase().includes(lowerQuery) ||
      team.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );

  // 리그 검색
  const filteredLeagues = leagues.filter(
    (league) =>
      league.name.toLowerCase().includes(lowerQuery) ||
      league.region.toLowerCase().includes(lowerQuery)
  );

  // 경기 검색
  const filteredMatches = matches.filter(
    (match) =>
      match.homeTeamName?.toLowerCase().includes(lowerQuery) ||
      match.awayTeamName?.toLowerCase().includes(lowerQuery) ||
      match.venue?.toLowerCase().includes(lowerQuery)
  );

  // 게시글 검색
  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(lowerQuery) ||
      post.content.toLowerCase().includes(lowerQuery) ||
      post.author.nickname.toLowerCase().includes(lowerQuery)
  );

  // 용병 구함 게시글 검색
  const mercenaryPosts = filteredPosts.filter((post) => post.category === 'mercenary');

  return {
    teams: filteredTeams,
    leagues: filteredLeagues,
    matches: filteredMatches,
    posts: filteredPosts,
    mercenaries: mercenaryPosts,
  };
}

// 검색 결과 하이라이트
export function highlightText(text: string, query: string): string {
  if (!query.trim()) return text;

  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<mark class="bg-yellow-200">$1</mark>');
}
