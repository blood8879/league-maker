import {
  DashboardData,
  MatchWithAttendance,
  TeamWithRole,
  UserStats,
  SeasonStats,
  TeamStats as DashboardTeamStats,
} from '@/types/dashboard';

// 현재 로그인한 사용자 ID (가짜)
export const CURRENT_USER_ID = 'user-1';

// 다가오는 경기 (참석 여부 포함)
export const mockUpcomingMatches: MatchWithAttendance[] = [
  {
    id: 'match-upcoming-1',
    type: 'friendly',
    homeTeamId: 'team-1',
    awayTeamId: 'team-2',
    homeTeamName: 'FC 서울',
    awayTeamName: '수원 블루윙즈',
    homeTeamLogo: '/teams/fc-seoul.png',
    awayTeamLogo: '/teams/suwon.png',
    date: '2024-11-25',
    time: '14:00',
    venue: '서울월드컵경기장',
    status: 'scheduled',
    myAttendance: 'attending',
  },
  {
    id: 'match-upcoming-2',
    type: 'league',
    leagueId: 'league-1',
    homeTeamId: 'team-1',
    awayTeamId: 'team-3',
    homeTeamName: 'FC 서울',
    awayTeamName: '전북 현대',
    homeTeamLogo: '/teams/fc-seoul.png',
    awayTeamLogo: '/teams/jeonbuk.png',
    date: '2024-11-28',
    time: '19:00',
    venue: '서울월드컵경기장',
    status: 'scheduled',
    myAttendance: 'pending',
  },
  {
    id: 'match-upcoming-3',
    type: 'practice',
    homeTeamId: 'team-1',
    awayTeamId: 'team-1',
    homeTeamName: 'FC 서울',
    awayTeamName: 'FC 서울',
    homeTeamLogo: '/teams/fc-seoul.png',
    awayTeamLogo: '/teams/fc-seoul.png',
    date: '2024-12-01',
    time: '10:00',
    venue: '서울월드컵경기장 연습장',
    status: 'scheduled',
    myAttendance: 'attending',
  },
  {
    id: 'match-upcoming-4',
    type: 'friendly',
    homeTeamId: 'team-4',
    awayTeamId: 'team-1',
    homeTeamName: '울산 현대',
    awayTeamName: 'FC 서울',
    homeTeamLogo: '/teams/ulsan.png',
    awayTeamLogo: '/teams/fc-seoul.png',
    date: '2024-12-05',
    time: '15:00',
    venue: '울산문수경기장',
    status: 'scheduled',
    myAttendance: 'absent',
  },
  {
    id: 'match-upcoming-5',
    type: 'cup',
    leagueId: 'cup-1',
    homeTeamId: 'team-1',
    awayTeamId: 'team-5',
    homeTeamName: 'FC 서울',
    awayTeamName: '인천 유나이티드',
    homeTeamLogo: '/teams/fc-seoul.png',
    awayTeamLogo: '/teams/incheon.png',
    date: '2024-12-08',
    time: '14:00',
    venue: '서울월드컵경기장',
    status: 'scheduled',
    myAttendance: 'pending',
  },
];

// 참석 대기중인 경기 (미정 상태만)
export const mockPendingMatches: MatchWithAttendance[] = mockUpcomingMatches.filter(
  (match) => match.myAttendance === 'pending'
);

// 내 팀 목록 (역할 포함)
export const mockMyTeams: TeamWithRole[] = [
  {
    id: 'team-1',
    name: 'FC 서울',
    logo: '/teams/fc-seoul.png',
    region: '서울특별시 마포구',
    level: 'advanced',
    memberCount: 18,
    isRecruiting: true,
    tags: ['주말 활동', '실력자 위주'],
    description: '서울 지역 최고의 아마추어 축구팀',
    foundedDate: '2020-03-15',
    activityDays: ['토', '일'],
    stats: {
      matchCount: 42,
      wins: 28,
      draws: 8,
      losses: 6,
      goalsFor: 98,
      goalsAgainst: 45,
    },
    members: [],
    myRole: 'captain',
  },
  {
    id: 'team-6',
    name: '강남 FC',
    logo: '/teams/gangnam-fc.png',
    region: '서울특별시 강남구',
    level: 'intermediate',
    memberCount: 15,
    isRecruiting: false,
    tags: ['평일 저녁', '친목 위주'],
    description: '강남에서 활동하는 친목 축구팀',
    foundedDate: '2022-01-10',
    activityDays: ['화', '목'],
    stats: {
      matchCount: 25,
      wins: 12,
      draws: 7,
      losses: 6,
      goalsFor: 52,
      goalsAgainst: 38,
    },
    members: [],
    myRole: 'member',
  },
];

// 개인 통계
export const mockUserStats: UserStats = {
  matchCount: 67,
  attendanceRate: 82.5, // 67경기 중 55경기 참석
  goals: 23,
  assists: 17,
  yellowCards: 5,
  redCards: 0,
};

// 대시보드 데이터
export const mockDashboardData: DashboardData = {
  upcomingMatches: mockUpcomingMatches,
  pendingMatches: mockPendingMatches,
  myTeams: mockMyTeams,
  stats: mockUserStats,
};

// 내 경기 목록 (전체 - 더 많은 경기 데이터)
export const mockAllMyMatches: MatchWithAttendance[] = [
  ...mockUpcomingMatches,
  // 완료된 경기
  {
    id: 'match-finished-1',
    type: 'league',
    leagueId: 'league-1',
    homeTeamId: 'team-1',
    awayTeamId: 'team-3',
    homeTeamName: 'FC 서울',
    awayTeamName: '전북 현대',
    homeTeamLogo: '/teams/fc-seoul.png',
    awayTeamLogo: '/teams/jeonbuk.png',
    date: '2024-11-15',
    time: '15:00',
    venue: '서울월드컵경기장',
    status: 'finished',
    score: { home: 3, away: 2 },
    myAttendance: 'attending',
  },
  {
    id: 'match-finished-2',
    type: 'friendly',
    homeTeamId: 'team-2',
    awayTeamId: 'team-1',
    homeTeamName: '수원 블루윙즈',
    awayTeamName: 'FC 서울',
    homeTeamLogo: '/teams/suwon.png',
    awayTeamLogo: '/teams/fc-seoul.png',
    date: '2024-11-10',
    time: '14:00',
    venue: '수원월드컵경기장',
    status: 'finished',
    score: { home: 1, away: 1 },
    myAttendance: 'attending',
  },
  {
    id: 'match-finished-3',
    type: 'league',
    leagueId: 'league-1',
    homeTeamId: 'team-4',
    awayTeamId: 'team-1',
    homeTeamName: '울산 현대',
    awayTeamName: 'FC 서울',
    homeTeamLogo: '/teams/ulsan.png',
    awayTeamLogo: '/teams/fc-seoul.png',
    date: '2024-11-03',
    time: '19:00',
    venue: '울산문수경기장',
    status: 'finished',
    score: { home: 0, away: 2 },
    myAttendance: 'absent',
  },
  {
    id: 'match-finished-4',
    type: 'practice',
    homeTeamId: 'team-1',
    awayTeamId: 'team-1',
    homeTeamName: 'FC 서울',
    awayTeamName: 'FC 서울',
    homeTeamLogo: '/teams/fc-seoul.png',
    awayTeamLogo: '/teams/fc-seoul.png',
    date: '2024-10-27',
    time: '10:00',
    venue: '서울월드컵경기장 연습장',
    status: 'finished',
    score: { home: 5, away: 3 },
    myAttendance: 'attending',
  },
  {
    id: 'match-finished-5',
    type: 'friendly',
    homeTeamId: 'team-1',
    awayTeamId: 'team-5',
    homeTeamName: 'FC 서울',
    awayTeamName: '인천 유나이티드',
    homeTeamLogo: '/teams/fc-seoul.png',
    awayTeamLogo: '/teams/incheon.png',
    date: '2024-10-20',
    time: '15:00',
    venue: '서울월드컵경기장',
    status: 'finished',
    score: { home: 4, away: 1 },
    myAttendance: 'attending',
  },
  {
    id: 'match-finished-6',
    type: 'league',
    leagueId: 'league-1',
    homeTeamId: 'team-1',
    awayTeamId: 'team-2',
    homeTeamName: 'FC 서울',
    awayTeamName: '수원 블루윙즈',
    homeTeamLogo: '/teams/fc-seoul.png',
    awayTeamLogo: '/teams/suwon.png',
    date: '2024-10-13',
    time: '14:00',
    venue: '서울월드컵경기장',
    status: 'finished',
    score: { home: 2, away: 2 },
    myAttendance: 'attending',
  },
  {
    id: 'match-finished-7',
    type: 'cup',
    leagueId: 'cup-1',
    homeTeamId: 'team-3',
    awayTeamId: 'team-1',
    homeTeamName: '전북 현대',
    awayTeamName: 'FC 서울',
    homeTeamLogo: '/teams/jeonbuk.png',
    awayTeamLogo: '/teams/fc-seoul.png',
    date: '2024-10-06',
    time: '16:00',
    venue: '전주월드컵경기장',
    status: 'finished',
    score: { home: 1, away: 3 },
    myAttendance: 'attending',
  },
  {
    id: 'match-finished-8',
    type: 'friendly',
    homeTeamId: 'team-1',
    awayTeamId: 'team-4',
    homeTeamName: 'FC 서울',
    awayTeamName: '울산 현대',
    homeTeamLogo: '/teams/fc-seoul.png',
    awayTeamLogo: '/teams/ulsan.png',
    date: '2024-09-29',
    time: '15:00',
    venue: '서울월드컵경기장',
    status: 'finished',
    score: { home: 3, away: 3 },
    myAttendance: 'pending',
  },
];

// 시즌별 통계
export const mockSeasonStats: SeasonStats[] = [
  {
    season: '2024 가을',
    matchCount: 28,
    goals: 12,
    assists: 8,
    yellowCards: 2,
    redCards: 0,
    attendanceRate: 85.7,
  },
  {
    season: '2024 여름',
    matchCount: 22,
    goals: 7,
    assists: 6,
    yellowCards: 2,
    redCards: 0,
    attendanceRate: 81.8,
  },
  {
    season: '2024 봄',
    matchCount: 17,
    goals: 4,
    assists: 3,
    yellowCards: 1,
    redCards: 0,
    attendanceRate: 76.5,
  },
];

// 팀별 통계
export const mockTeamStats: DashboardTeamStats[] = [
  {
    teamId: 'team-1',
    teamName: 'FC 서울',
    teamLogo: '/teams/fc-seoul.png',
    matchCount: 52,
    goals: 19,
    assists: 14,
    attendanceRate: 84.6,
  },
  {
    teamId: 'team-6',
    teamName: '강남 FC',
    teamLogo: '/teams/gangnam-fc.png',
    matchCount: 15,
    goals: 4,
    assists: 3,
    attendanceRate: 73.3,
  },
];

// 유틸리티 함수
export const getMyMatches = (status?: 'scheduled' | 'finished'): MatchWithAttendance[] => {
  if (!status) return mockAllMyMatches;
  return mockAllMyMatches.filter((match) => match.status === status);
};

export const getMyMatchesByAttendance = (
  attendance?: 'attending' | 'absent' | 'pending'
): MatchWithAttendance[] => {
  if (!attendance) return mockAllMyMatches;
  return mockAllMyMatches.filter((match) => match.myAttendance === attendance);
};
