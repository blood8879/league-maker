'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useMemo, Suspense } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Search, Users, Trophy, Calendar, FileText, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { performSearch } from '@/lib/search-utils';
import { SearchCategory } from '@/types/search';
import { Post } from '@/types/post';
import { Team } from '@/types/team';
import { League } from '@/types/league';
import { Match } from '@/types/match';
import { MOCK_TEAMS, MOCK_LEAGUES } from '@/lib/mock-data';
import { mockMatches } from '@/data/mock-matches';
import { MOCK_POSTS } from '@/lib/mock-community';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [activeTab, setActiveTab] = useState<SearchCategory>('all');

  // 검색 수행
  const results = useMemo(() => {
    if (!query.trim()) {
      return { teams: [], leagues: [], matches: [], posts: [], mercenaries: [] };
    }

    return performSearch(query, MOCK_TEAMS, MOCK_LEAGUES, mockMatches, MOCK_POSTS);
  }, [query]);

  const totalCount =
    results.teams.length +
    results.leagues.length +
    results.matches.length +
    results.posts.length;

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-6">
      {/* 헤더 */}
      <div>
        <h1 className="text-3xl font-bold">검색 결과</h1>
        <p className="text-muted-foreground mt-1">
          &ldquo;{query}&rdquo;에 대한 검색 결과 {totalCount}개
        </p>
      </div>

      {query && (
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as SearchCategory)}>
          <TabsList className="grid w-full grid-cols-6 mb-6">
            <TabsTrigger value="all">
              전체 ({totalCount})
            </TabsTrigger>
            <TabsTrigger value="teams">
              <Users className="h-4 w-4 mr-1" />
              팀 ({results.teams.length})
            </TabsTrigger>
            <TabsTrigger value="leagues">
              <Trophy className="h-4 w-4 mr-1" />
              리그 ({results.leagues.length})
            </TabsTrigger>
            <TabsTrigger value="matches">
              <Calendar className="h-4 w-4 mr-1" />
              경기 ({results.matches.length})
            </TabsTrigger>
            <TabsTrigger value="posts">
              <FileText className="h-4 w-4 mr-1" />
              게시글 ({results.posts.length})
            </TabsTrigger>
            <TabsTrigger value="mercenaries">
              <UserPlus className="h-4 w-4 mr-1" />
              용병 ({results.mercenaries.length})
            </TabsTrigger>
          </TabsList>

          {/* 전체 탭 */}
          <TabsContent value="all" className="space-y-6">
            {totalCount === 0 ? (
              <EmptyState query={query} />
            ) : (
              <>
                {results.teams.length > 0 && (
                  <Section title="팀" count={results.teams.length}>
                    {results.teams.slice(0, 3).map((team) => (
                      <TeamCard key={team.id} team={team} />
                    ))}
                  </Section>
                )}

                {results.leagues.length > 0 && (
                  <Section title="리그" count={results.leagues.length}>
                    {results.leagues.slice(0, 3).map((league) => (
                      <LeagueCard key={league.id} league={league} />
                    ))}
                  </Section>
                )}

                {results.matches.length > 0 && (
                  <Section title="경기" count={results.matches.length}>
                    {results.matches.slice(0, 3).map((match) => (
                      <MatchCard key={match.id} match={match} />
                    ))}
                  </Section>
                )}

                {results.posts.length > 0 && (
                  <Section title="게시글" count={results.posts.length}>
                    {results.posts.slice(0, 3).map((post) => (
                      <PostCard key={post.id} post={post} />
                    ))}
                  </Section>
                )}
              </>
            )}
          </TabsContent>

          {/* 팀 탭 */}
          <TabsContent value="teams">
            {results.teams.length === 0 ? (
              <EmptyState query={query} category="팀" />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.teams.map((team) => (
                  <TeamCard key={team.id} team={team} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* 리그 탭 */}
          <TabsContent value="leagues">
            {results.leagues.length === 0 ? (
              <EmptyState query={query} category="리그" />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.leagues.map((league) => (
                  <LeagueCard key={league.id} league={league} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* 경기 탭 */}
          <TabsContent value="matches">
            {results.matches.length === 0 ? (
              <EmptyState query={query} category="경기" />
            ) : (
              <div className="space-y-3">
                {results.matches.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* 게시글 탭 */}
          <TabsContent value="posts">
            {results.posts.length === 0 ? (
              <EmptyState query={query} category="게시글" />
            ) : (
              <div className="space-y-3">
                {results.posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* 용병 탭 */}
          <TabsContent value="mercenaries">
            {results.mercenaries.length === 0 ? (
              <EmptyState query={query} category="용병 모집" />
            ) : (
              <div className="space-y-3">
                {results.mercenaries.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}

      {!query && (
        <div className="text-center py-12 text-muted-foreground">
          <Search className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <p>검색어를 입력해주세요</p>
        </div>
      )}
    </div>
  );
}

// 섹션 컴포넌트
function Section({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">
        {title} <span className="text-muted-foreground">({count})</span>
      </h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

// 팀 카드
function TeamCard({ team }: { team: Team }) {
  return (
    <Link href={`/teams/${team.id}`}>
      <Card className="hover:bg-accent/50 transition-colors">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{team.name}</h3>
              <p className="text-sm text-muted-foreground">{team.region}</p>
            </div>
            <Badge variant="outline">{team.memberCount}명</Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

// 리그 카드
function LeagueCard({ league }: { league: League }) {
  return (
    <Link href={`/leagues/${league.id}`}>
      <Card className="hover:bg-accent/50 transition-colors">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">{league.name}</h3>
              <p className="text-sm text-muted-foreground">{league.region}</p>
            </div>
            <Badge>{league.status === 'ongoing' ? '진행중' : league.status}</Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

// 경기 카드
function MatchCard({ match }: { match: Match }) {
  return (
    <Link href={`/matches/${match.id}`}>
      <Card className="hover:bg-accent/50 transition-colors">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">
                {match.homeTeamName} vs {match.awayTeamName}
              </h3>
              <p className="text-sm text-muted-foreground">
                {match.date} {match.time} • {match.venue}
              </p>
            </div>
            <Badge variant={match.status === 'finished' ? 'secondary' : 'default'}>
              {match.status === 'scheduled' ? '예정' : '종료'}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

// 게시글 카드
function PostCard({ post }: { post: Post }) {
  const categoryLabels = {
    free: '자유',
    recruitment: '모집',
    mercenary: '용병',
    review: '후기',
  };

  return (
    <Link href={`/community/${post.id}`}>
      <Card className="hover:bg-accent/50 transition-colors">
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline">{categoryLabels[post.category as keyof typeof categoryLabels]}</Badge>
              <h3 className="font-semibold">{post.title}</h3>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">{post.content}</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>{post.author.nickname}</span>
              <span>조회 {post.viewCount}</span>
              <span>댓글 {post.commentCount}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

// 빈 상태
function EmptyState({ query, category }: { query: string; category?: string }) {
  return (
    <div className="text-center py-12 text-muted-foreground">
      <Search className="h-16 w-16 mx-auto mb-4 opacity-50" />
      <p className="font-medium">
        {category ? `"${query}"에 대한 ${category} 검색 결과가 없습니다` : `"${query}"에 대한 검색 결과가 없습니다`}
      </p>
      <p className="text-sm mt-1">다른 검색어로 다시 시도해보세요</p>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}
