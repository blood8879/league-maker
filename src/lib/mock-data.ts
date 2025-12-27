import { Team } from "@/types/team";
import { User } from "@/types/auth";

export const MOCK_USERS: User[] = [
  {
    id: "u1",
    email: "user@example.com",
    nickname: "축구왕",
    role: "player",
    position: "FW",
    teamIds: ["1"],
    stats: {
      matchCount: 15,
      attendanceRate: 95,
      goals: 10,
      assists: 5,
      yellowCards: 1,
      redCards: 0,
    },
  },
  {
    id: "u2",
    email: "coach@example.com",
    nickname: "전술가",
    role: "coach",
    teamIds: ["1"],
    stats: {
      matchCount: 20,
      attendanceRate: 100,
      goals: 0,
      assists: 0,
      yellowCards: 0,
      redCards: 0,
    },
  },
];

export const MOCK_TEAMS: Team[] = [
  {
    id: "1",
    name: "FC 강남",
    logo: "https://placehold.co/200x200/png",
    region: "서울 강남구",
    level: "advanced",
    memberCount: 22,
    isRecruiting: true,
    tags: ["주말", "실력파", "매너중시"],
    description: "강남구에서 활동하는 실력파 팀입니다. 매주 일요일 아침 운동합니다.",
    foundedDate: "2018-03-01",
    activityDays: ["일"],
    stats: {
      matchCount: 45,
      wins: 30,
      draws: 5,
      losses: 10,
      goalsFor: 120,
      goalsAgainst: 50,
    },
    members: [
      { id: "m1", name: "김철수", position: "FW", number: 10, role: "captain" },
      { id: "m2", name: "이영희", position: "MF", number: 8, role: "vice_captain" },
      // ... more members would go here
    ],
  },
  {
    id: "2",
    name: "서초 라이온즈",
    region: "서울 서초구",
    level: "intermediate",
    memberCount: 18,
    isRecruiting: false,
    tags: ["평일야간", "친목", "2030"],
    description: "서초구 2030 친목 축구팀입니다. 평일 저녁에 주로 찹니다.",
    foundedDate: "2020-05-15",
    activityDays: ["화", "목"],
    stats: {
      matchCount: 32,
      wins: 15,
      draws: 8,
      losses: 9,
      goalsFor: 60,
      goalsAgainst: 55,
    },
    members: [],
  },
  {
    id: "3",
    name: "송파 유나이티드",
    region: "서울 송파구",
    level: "beginner",
    memberCount: 25,
    isRecruiting: true,
    tags: ["초보환영", "즐겜", "회식없음"],
    description: "축구를 처음 시작하는 분들도 환영합니다. 승패보다는 즐거움을 추구합니다.",
    foundedDate: "2022-01-10",
    activityDays: ["토"],
    stats: {
      matchCount: 15,
      wins: 3,
      draws: 2,
      losses: 10,
      goalsFor: 20,
      goalsAgainst: 45,
    },
    members: [],
  },
  {
    id: "4",
    name: "마포 호랑이",
    region: "서울 마포구",
    level: "advanced",
    memberCount: 20,
    isRecruiting: false,
    tags: ["대회참가", "체계적", "유니폼필수"],
    description: "각종 대회 입상을 목표로 하는 팀입니다.",
    foundedDate: "2015-08-20",
    activityDays: ["토", "일"],
    stats: {
      matchCount: 80,
      wins: 55,
      draws: 10,
      losses: 15,
      goalsFor: 200,
      goalsAgainst: 80,
    },
    members: [],
  },
  {
    id: "5",
    name: "영등포 자이언츠",
    region: "서울 영등포구",
    level: "intermediate",
    memberCount: 30,
    isRecruiting: true,
    tags: ["대규모", "자체전", "선출보유"],
    description: "인원이 많아 자체전 위주로 진행합니다.",
    foundedDate: "2010-11-11",
    activityDays: ["일"],
    stats: {
      matchCount: 120,
      wins: 60,
      draws: 30,
      losses: 30,
      goalsFor: 250,
      goalsAgainst: 180,
    },
    members: [],
  },
   {
    id: "6",
    name: "관악 마운틴",
    region: "서울 관악구",
    level: "beginner",
    memberCount: 15,
    isRecruiting: true,
    tags: ["등산겸용", "체력증진", "아침운동"],
    description: "관악산 정기를 받아 축구합니다.",
    foundedDate: "2023-03-01",
    activityDays: ["토"],
    stats: {
      matchCount: 10,
      wins: 2,
      draws: 1,
      losses: 7,
      goalsFor: 15,
      goalsAgainst: 30,
    },
    members: [],
  },
  {
    id: "7",
    name: "동작 웨이브",
    region: "서울 동작구",
    level: "intermediate",
    memberCount: 21,
    isRecruiting: false,
    tags: ["패스플레이", "조직력", "매너"],
    description: "패스 위주의 플레이를 지향합니다.",
    foundedDate: "2019-09-09",
    activityDays: ["수", "금"],
    stats: {
      matchCount: 40,
      wins: 20,
      draws: 10,
      losses: 10,
      goalsFor: 80,
      goalsAgainst: 60,
    },
    members: [],
  },
  {
    id: "8",
    name: "용산 드래곤즈",
    region: "서울 용산구",
    level: "advanced",
    memberCount: 28,
    isRecruiting: true,
    tags: ["외국인환영", "글로벌", "영어가능"],
    description: "다국적 멤버들이 함께하는 글로벌 팀입니다.",
    foundedDate: "2017-07-07",
    activityDays: ["토"],
    stats: {
      matchCount: 60,
      wins: 35,
      draws: 15,
      losses: 10,
      goalsFor: 150,
      goalsAgainst: 90,
    },
    members: [],
  },
  {
    id: "9",
    name: "성동 스타즈",
    region: "서울 성동구",
    level: "intermediate",
    memberCount: 19,
    isRecruiting: true,
    tags: ["직장인", "퇴근후", "스트레스해소"],
    description: "성동구 직장인들이 모인 팀입니다.",
    foundedDate: "2021-04-01",
    activityDays: ["목"],
    stats: {
      matchCount: 25,
      wins: 10,
      draws: 5,
      losses: 10,
      goalsFor: 40,
      goalsAgainst: 40,
    },
    members: [],
  },
  {
    id: "10",
    name: "광진 히어로즈",
    region: "서울 광진구",
    level: "beginner",
    memberCount: 16,
    isRecruiting: true,
    tags: ["초보", "기본기", "레슨"],
    description: "기본기부터 차근차근 배우며 성장하는 팀입니다.",
    foundedDate: "2023-01-01",
    activityDays: ["일"],
    stats: {
      matchCount: 8,
      wins: 1,
      draws: 0,
      losses: 7,
      goalsFor: 5,
      goalsAgainst: 25,
    },
    members: [],
  },
  {
    id: "16",
    name: "FC 성북",
    region: "서울 성북구",
    level: "beginner",
    memberCount: 14,
    isRecruiting: true,
    tags: ["초보환영", "평일야간"],
    description: "성북구에서 활동하는 초보 팀입니다.",
    foundedDate: "2023-11-01",
    activityDays: ["화", "목"],
    stats: {
      matchCount: 5,
      wins: 1,
      draws: 1,
      losses: 3,
      goalsFor: 4,
      goalsAgainst: 10,
    },
    members: [],
  },
  {
    id: "11",
    name: "동대문 킹스",
    region: "서울 동대문구",
    level: "advanced",
    memberCount: 24,
    isRecruiting: false,
    tags: ["새벽", "부지런", "열정"],
    description: "새벽 공기를 가르며 달리는 열정적인 팀입니다.",
    foundedDate: "2016-06-06",
    activityDays: ["토", "일"],
    stats: {
      matchCount: 70,
      wins: 40,
      draws: 10,
      losses: 20,
      goalsFor: 130,
      goalsAgainst: 80,
    },
    members: [],
  },
  {
    id: "12",
    name: "중랑 스톰",
    region: "서울 중랑구",
    level: "intermediate",
    memberCount: 20,
    isRecruiting: true,
    tags: ["공격축구", "다득점", "화끈"],
    description: "화끈한 공격 축구를 구사합니다.",
    foundedDate: "2018-12-12",
    activityDays: ["일"],
    stats: {
      matchCount: 50,
      wins: 25,
      draws: 5,
      losses: 20,
      goalsFor: 100,
      goalsAgainst: 90,
    },
    members: [],
  },
  {
    id: "13",
    name: "성북 유니콘스",
    region: "서울 성북구",
    level: "beginner",
    memberCount: 14,
    isRecruiting: true,
    tags: ["대학생", "젊음", "패기"],
    description: "인근 대학생들이 주축이 된 팀입니다.",
    foundedDate: "2022-09-01",
    activityDays: ["금"],
    stats: {
      matchCount: 12,
      wins: 4,
      draws: 2,
      losses: 6,
      goalsFor: 18,
      goalsAgainst: 24,
    },
    members: [],
  },
  {
    id: "14",
    name: "강북 이글스",
    region: "서울 강북구",
    level: "intermediate",
    memberCount: 23,
    isRecruiting: false,
    tags: ["산악", "체력", "끈기"],
    description: "지치지 않는 체력을 자랑합니다.",
    foundedDate: "2019-02-02",
    activityDays: ["일"],
    stats: {
      matchCount: 35,
      wins: 15,
      draws: 10,
      losses: 10,
      goalsFor: 55,
      goalsAgainst: 45,
    },
    members: [],
  },
  {
    id: "15",
    name: "도봉 피닉스",
    region: "서울 도봉구",
    level: "advanced",
    memberCount: 26,
    isRecruiting: true,
    tags: ["불사조", "역전승", "멘탈"],
    description: "끝까지 포기하지 않는 불사조 같은 팀입니다.",
    foundedDate: "2014-04-04",
    activityDays: ["토"],
    stats: {
      matchCount: 90,
      wins: 60,
      draws: 15,
      losses: 15,
      goalsFor: 180,
      goalsAgainst: 100,
    },
    members: [],
  },
];

import { League, Match, Standing, PlayerStats } from "@/types/league";

const createMockStandings = (teams: Team[]): Standing[] => {
  return teams.map((team, index) => ({
    rank: index + 1,
    teamId: team.id,
    teamName: team.name,
    matchesPlayed: 5,
    wins: Math.floor(Math.random() * 5),
    draws: Math.floor(Math.random() * 2),
    losses: Math.floor(Math.random() * 2),
    goalsFor: Math.floor(Math.random() * 15),
    goalsAgainst: Math.floor(Math.random() * 10),
    goalDifference: 0,
    points: 0,
  })).map(s => ({
    ...s,
    goalDifference: s.goalsFor - s.goalsAgainst,
    points: s.wins * 3 + s.draws
  })).sort((a, b) => b.points - a.points);
};

const createMockMatches = (leagueId: string, teams: Team[]): Match[] => {
  const matches: Match[] = [];
  // Create some finished matches
  for (let i = 0; i < 5; i++) {
    matches.push({
      id: `m${i}`,
      type: 'league',
      leagueId,
      homeTeamId: teams[i % teams.length].id,
      homeTeamName: teams[i % teams.length].name,
      homeTeamLogo: teams[i % teams.length].logo,
      awayTeamId: teams[(i + 1) % teams.length].id,
      awayTeamName: teams[(i + 1) % teams.length].name,
      awayTeamLogo: teams[(i + 1) % teams.length].logo,
      date: "2024-03-01",
      time: "14:00",
      venue: "서울월드컵경기장 보조구장",
      status: 'finished',
      score: {
        home: Math.floor(Math.random() * 3),
        away: Math.floor(Math.random() * 3),
      },
      round: 1
    });
  }
  // Create some scheduled matches
  for (let i = 5; i < 10; i++) {
    matches.push({
      id: `m${i}`,
      type: 'league',
      leagueId,
      homeTeamId: teams[i % teams.length].id,
      homeTeamName: teams[i % teams.length].name,
      homeTeamLogo: teams[i % teams.length].logo,
      awayTeamId: teams[(i + 1) % teams.length].id,
      awayTeamName: teams[(i + 1) % teams.length].name,
      awayTeamLogo: teams[(i + 1) % teams.length].logo,
      date: "2024-04-01",
      time: "16:00",
      venue: "효창운동장",
      status: 'scheduled',
      round: 2
    });
  }
  return matches;
};

const createMockScorers = (teams: Team[]): PlayerStats[] => {
  return [
    { rank: 1, playerId: "p1", playerName: "김철수", teamName: teams[0].name, teamId: teams[0].id, goals: 8, assists: 2, matchesPlayed: 5 },
    { rank: 2, playerId: "p2", playerName: "이영희", teamName: teams[1].name, teamId: teams[1].id, goals: 6, assists: 3, matchesPlayed: 5 },
    { rank: 3, playerId: "p3", playerName: "박지성", teamName: teams[2].name, teamId: teams[2].id, goals: 5, assists: 5, matchesPlayed: 5 },
    { rank: 4, playerId: "p4", playerName: "손흥민", teamName: teams[0].name, teamId: teams[0].id, goals: 4, assists: 1, matchesPlayed: 5 },
    { rank: 5, playerId: "p5", playerName: "차범근", teamName: teams[3].name, teamId: teams[3].id, goals: 3, assists: 0, matchesPlayed: 5 },
  ];
};

export const MOCK_LEAGUES: League[] = [
  {
    id: "l1",
    name: "2024 서울 아마추어 리그",
    region: "서울",
    status: "ongoing",
    level: "intermediate",
    startDate: "2024-03-01",
    endDate: "2024-11-30",
    description: "서울 지역 아마추어 축구 최강자를 가리는 리그입니다.",
    rules: [
      "전/후반 25분 경기",
      "선수 교체 무제한",
      "경고 2회 누적 시 다음 경기 출전 불가",
      "우승 상금 100만원"
    ],
    teams: MOCK_TEAMS.slice(0, 8),
    standings: createMockStandings(MOCK_TEAMS.slice(0, 8)),
    matches: createMockMatches("l1", MOCK_TEAMS.slice(0, 8)),
    topScorers: createMockScorers(MOCK_TEAMS.slice(0, 8))
  },
  {
    id: "l2",
    name: "제5회 강남구 직장인 컵",
    region: "서울 강남구",
    status: "upcoming",
    level: "beginner",
    startDate: "2024-05-01",
    endDate: "2024-06-30",
    description: "강남구 소재 직장인들을 위한 즐거운 축구 축제",
    rules: [
      "참가 자격: 강남구 소재 직장인",
      "팀당 선수 등록 최대 20명",
      "조별 예선 후 토너먼트"
    ],
    teams: MOCK_TEAMS.slice(8, 15),
    standings: [],
    matches: [],
    topScorers: []
  },
  {
    id: "l3",
    name: "2023 전국 동호회 챔피언십",
    region: "전국",
    status: "finished",
    level: "advanced",
    startDate: "2023-09-01",
    endDate: "2023-12-15",
    description: "전국 최고의 아마추어 팀들이 모이는 왕중왕전",
    rules: ["KFA 규정 준수"],
    teams: MOCK_TEAMS.slice(0, 10),
    standings: createMockStandings(MOCK_TEAMS.slice(0, 10)),
    matches: createMockMatches("l3", MOCK_TEAMS.slice(0, 10)),
    topScorers: createMockScorers(MOCK_TEAMS.slice(0, 10))
  }
];

export const MOCK_MATCHES: Match[] = [
  // Finished Match with Full Data
  {
    id: "m103",
    type: "league",
    leagueId: "l1",
    homeTeamId: "1",
    homeTeamName: "FC 강남",
    homeTeamLogo: "⚽",
    awayTeamId: "2",
    awayTeamName: "서초 라이온즈",
    awayTeamLogo: "🦁",
    date: "2024-04-15",
    time: "14:00",
    venue: "강남구민체육관",
    status: "finished",
    score: {
      home: 3,
      away: 2
    },
    events: [
      {
        id: "e1",
        matchId: "m103",
        type: "goal",
        time: 12,
        teamId: "1",
        playerId: "p1",
        playerName: "김철수",
        assistPlayerId: "p2",
        assistPlayerName: "이영희"
      },
      {
        id: "e2",
        matchId: "m103",
        type: "yellow_card",
        time: 18,
        teamId: "2",
        playerId: "p5",
        playerName: "박지성",
        reason: "반칙"
      },
      {
        id: "e3",
        matchId: "m103",
        type: "goal",
        time: 25,
        teamId: "2",
        playerId: "p6",
        playerName: "손흥민"
      },
      {
        id: "e4",
        matchId: "m103",
        type: "substitution",
        time: 30,
        teamId: "1",
        playerId: "p3",
        playerName: "정우영",
        subInPlayerId: "p7",
        subInPlayerName: "김민재"
      },
      {
        id: "e5",
        matchId: "m103",
        type: "goal",
        time: 38,
        teamId: "1",
        playerId: "p2",
        playerName: "이영희",
        assistPlayerId: "p1",
        assistPlayerName: "김철수"
      },
      {
        id: "e6",
        matchId: "m103",
        type: "goal",
        time: 52,
        teamId: "2",
        playerId: "p6",
        playerName: "손흥민",
        assistPlayerId: "p5",
        assistPlayerName: "박지성"
      },
      {
        id: "e7",
        matchId: "m103",
        type: "yellow_card",
        time: 60,
        teamId: "1",
        playerId: "p4",
        playerName: "차두리",
        reason: "지연 행위"
      },
      {
        id: "e8",
        matchId: "m103",
        type: "goal",
        time: 75,
        teamId: "1",
        playerId: "p7",
        playerName: "김민재"
      }
    ],
    homeLineup: {
      matchId: "m103",
      teamId: "1",
      starting: ["p1", "p2", "p3", "p4", "p7", "p8", "p9", "p10", "p11"],
      substitutes: ["p12", "p13"],
      formation: "4-4-2"
    },
    awayLineup: {
      matchId: "m103",
      teamId: "2",
      starting: ["p5", "p6", "p14", "p15", "p16", "p17", "p18", "p19", "p20"],
      substitutes: ["p21", "p22"],
      formation: "4-3-3"
    },
    stats: {
      homeShots: 15,
      awayShots: 12,
      homeFouls: 8,
      awayFouls: 10,
      homeCorners: 6,
      awayCorners: 4,
      homePossession: 55,
      awayPossession: 45
    },
    attendances: [
      { matchId: "m103", playerId: "p1", status: "attending", updatedAt: "2024-04-10" },
      { matchId: "m103", playerId: "p2", status: "attending", updatedAt: "2024-04-10" },
      { matchId: "m103", playerId: "p3", status: "attending", updatedAt: "2024-04-10" },
      { matchId: "m103", playerId: "p4", status: "attending", updatedAt: "2024-04-10" },
      { matchId: "m103", playerId: "p5", status: "attending", updatedAt: "2024-04-10" },
      { matchId: "m103", playerId: "p6", status: "attending", updatedAt: "2024-04-10" },
      { matchId: "m103", playerId: "p7", status: "absent", reason: "부상", updatedAt: "2024-04-12" },
    ],
    approvedMercenaries: []
  },
  // League Match (Upcoming)
  {
    id: "m101",
    type: "league",
    leagueId: "l1",
    homeTeamId: "1",
    homeTeamName: "FC 강남",
    homeTeamLogo: "https://placehold.co/200x200/png",
    awayTeamId: "2",
    awayTeamName: "서초 유나이티드",
    date: "2024-05-20",
    time: "14:00",
    venue: "강남구민체육관",
    status: "scheduled",
    attendances: [
      { matchId: "m101", playerId: "u1", status: "attending", updatedAt: "2024-05-15" },
      { matchId: "m101", playerId: "u2", status: "absent", reason: "개인 사정", updatedAt: "2024-05-16" },
      { matchId: "m101", playerId: "u3", status: "pending", updatedAt: "2024-05-10" },
    ]
  },
  // Friendly Match (Recruiting Mercenaries)
  {
    id: "m102",
    type: "friendly",
    homeTeamId: "1",
    homeTeamName: "FC 강남",
    homeTeamLogo: "https://placehold.co/200x200/png",
    awayTeamId: "3",
    awayTeamName: "송파 워리어스",
    date: "2024-05-25",
    time: "18:00",
    venue: "탄천유수지 축구장",
    status: "scheduled",
    mercenaryRecruitment: {
      enabled: true,
      positions: ["GK", "MF"],
      count: 2
    },
    attendances: [
      { matchId: "m102", playerId: "u1", status: "attending", updatedAt: "2024-05-18" },
    ],
    approvedMercenaries: []
  }
];

// Dashboard utility functions
export function getUserUpcomingMatches(userId: string) {
  return MOCK_MATCHES.filter(match => {
    if (match.status !== 'scheduled') return false;
    const hasAttendance = match.attendances?.some(a => a.playerId === userId);
    return hasAttendance;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export function getUserPendingMatches(userId: string) {
  return MOCK_MATCHES.filter(match => {
    if (match.status !== 'scheduled') return false;
    const attendance = match.attendances?.find(a => a.playerId === userId);
    return attendance?.status === 'pending';
  });
}

export function getUserTeams(userId: string) {
  const user = MOCK_USERS.find(u => u.id === userId);
  if (!user) return [];
  return MOCK_TEAMS.filter(team => user.teamIds.includes(team.id));
}

export function getTeamRecentMatches(teamId: string, limit: number = 5) {
  return MOCK_MATCHES
    .filter(match =>
      (match.homeTeamId === teamId || match.awayTeamId === teamId) &&
      match.status === 'finished'
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}
