import { Match, MatchEvent, MatchAttendance, PlayerLineup } from '@/types/match';

// 가짜 참석 데이터
const mockAttendances: MatchAttendance[] = [
  // 홈팀 참석자
  { matchId: 'match-1', playerId: 'player-1', status: 'attending', updatedAt: '2024-11-20T10:00:00Z' },
  { matchId: 'match-1', playerId: 'player-2', status: 'attending', updatedAt: '2024-11-20T10:00:00Z' },
  { matchId: 'match-1', playerId: 'player-3', status: 'attending', updatedAt: '2024-11-20T10:00:00Z' },
  { matchId: 'match-1', playerId: 'player-4', status: 'attending', updatedAt: '2024-11-20T10:00:00Z' },
  { matchId: 'match-1', playerId: 'player-5', status: 'attending', updatedAt: '2024-11-20T10:00:00Z' },
  { matchId: 'match-1', playerId: 'player-6', status: 'attending', updatedAt: '2024-11-20T10:00:00Z' },
  { matchId: 'match-1', playerId: 'player-7', status: 'attending', updatedAt: '2024-11-20T10:00:00Z' },
  { matchId: 'match-1', playerId: 'player-8', status: 'attending', updatedAt: '2024-11-20T10:00:00Z' },
  { matchId: 'match-1', playerId: 'player-9', status: 'attending', updatedAt: '2024-11-20T10:00:00Z' },
  { matchId: 'match-1', playerId: 'player-10', status: 'attending', updatedAt: '2024-11-20T10:00:00Z' },
  { matchId: 'match-1', playerId: 'player-11', status: 'attending', updatedAt: '2024-11-20T10:00:00Z' },
  { matchId: 'match-1', playerId: 'player-12', status: 'attending', updatedAt: '2024-11-20T10:00:00Z' },
  { matchId: 'match-1', playerId: 'player-13', status: 'attending', updatedAt: '2024-11-20T10:00:00Z' },
  { matchId: 'match-1', playerId: 'player-14', status: 'absent', updatedAt: '2024-11-20T10:00:00Z', reason: '개인 사정' },
  { matchId: 'match-1', playerId: 'player-15', status: 'pending', updatedAt: '2024-11-20T10:00:00Z' },
  // 원정팀 참석자
  { matchId: 'match-1', playerId: 'player-21', status: 'attending', updatedAt: '2024-11-20T10:00:00Z' },
  { matchId: 'match-1', playerId: 'player-22', status: 'attending', updatedAt: '2024-11-20T10:00:00Z' },
  { matchId: 'match-1', playerId: 'player-23', status: 'attending', updatedAt: '2024-11-20T10:00:00Z' },
  { matchId: 'match-1', playerId: 'player-24', status: 'attending', updatedAt: '2024-11-20T10:00:00Z' },
  { matchId: 'match-1', playerId: 'player-25', status: 'attending', updatedAt: '2024-11-20T10:00:00Z' },
  { matchId: 'match-1', playerId: 'player-26', status: 'attending', updatedAt: '2024-11-20T10:00:00Z' },
  { matchId: 'match-1', playerId: 'player-27', status: 'attending', updatedAt: '2024-11-20T10:00:00Z' },
  { matchId: 'match-1', playerId: 'player-28', status: 'attending', updatedAt: '2024-11-20T10:00:00Z' },
  { matchId: 'match-1', playerId: 'player-29', status: 'attending', updatedAt: '2024-11-20T10:00:00Z' },
  { matchId: 'match-1', playerId: 'player-30', status: 'attending', updatedAt: '2024-11-20T10:00:00Z' },
  { matchId: 'match-1', playerId: 'player-31', status: 'attending', updatedAt: '2024-11-20T10:00:00Z' },
  { matchId: 'match-1', playerId: 'player-32', status: 'attending', updatedAt: '2024-11-20T10:00:00Z' },
  { matchId: 'match-1', playerId: 'player-33', status: 'absent', updatedAt: '2024-11-20T10:00:00Z', reason: '업무' },
];

// 가짜 라인업 데이터
const mockHomeLineup: PlayerLineup[] = [
  { playerId: 'player-1', name: '김민수', position: 'GK', number: 1, isStarter: true },
  { playerId: 'player-2', name: '박지성', position: 'DF', number: 2, isStarter: true },
  { playerId: 'player-3', name: '이영표', position: 'DF', number: 3, isStarter: true },
  { playerId: 'player-4', name: '김태영', position: 'DF', number: 4, isStarter: true },
  { playerId: 'player-5', name: '송종국', position: 'DF', number: 5, isStarter: true },
  { playerId: 'player-6', name: '박주영', position: 'MF', number: 6, isStarter: true },
  { playerId: 'player-7', name: '손흥민', position: 'MF', number: 7, isStarter: true },
  { playerId: 'player-8', name: '기성용', position: 'MF', number: 8, isStarter: true },
  { playerId: 'player-9', name: '이동국', position: 'FW', number: 9, isStarter: true },
  { playerId: 'player-10', name: '황희찬', position: 'FW', number: 10, isStarter: true },
  { playerId: 'player-11', name: '김신욱', position: 'FW', number: 11, isStarter: true },
  { playerId: 'player-12', name: '조현우', position: 'GK', number: 12, isStarter: false },
  { playerId: 'player-13', name: '권창훈', position: 'MF', number: 13, isStarter: false },
];

const mockAwayLineup: PlayerLineup[] = [
  { playerId: 'player-21', name: '정성룡', position: 'GK', number: 1, isStarter: true },
  { playerId: 'player-22', name: '김영권', position: 'DF', number: 2, isStarter: true },
  { playerId: 'player-23', name: '윤종규', position: 'DF', number: 3, isStarter: true },
  { playerId: 'player-24', name: '홍철', position: 'DF', number: 4, isStarter: true },
  { playerId: 'player-25', name: '김진수', position: 'DF', number: 5, isStarter: true },
  { playerId: 'player-26', name: '이재성', position: 'MF', number: 6, isStarter: true },
  { playerId: 'player-27', name: '정우영', position: 'MF', number: 7, isStarter: true },
  { playerId: 'player-28', name: '남태희', position: 'MF', number: 8, isStarter: true },
  { playerId: 'player-29', name: '구자철', position: 'FW', number: 9, isStarter: true },
  { playerId: 'player-30', name: '이근호', position: 'FW', number: 10, isStarter: true },
  { playerId: 'player-31', name: '김현성', position: 'FW', number: 11, isStarter: true },
  { playerId: 'player-32', name: '김승규', position: 'GK', number: 12, isStarter: false },
];

// 가짜 경기 이벤트 데이터
const mockEvents: MatchEvent[] = [
  {
    id: 'event-1',
    type: 'goal',
    teamId: 'team-1',
    playerId: 'player-10',
    minute: 12,
    phase: 'first-half',
    relatedPlayerId: 'player-7',
  },
  {
    id: 'event-2',
    type: 'yellow',
    teamId: 'team-2',
    playerId: 'player-24',
    minute: 23,
    phase: 'first-half',
    reason: '반칙',
  },
  {
    id: 'event-3',
    type: 'goal',
    teamId: 'team-2',
    playerId: 'player-29',
    minute: 34,
    phase: 'first-half',
  },
  {
    id: 'event-4',
    type: 'substitution',
    teamId: 'team-1',
    playerId: 'player-11',
    minute: 46,
    phase: 'second-half',
    relatedPlayerId: 'player-13',
  },
  {
    id: 'event-5',
    type: 'goal',
    teamId: 'team-1',
    playerId: 'player-7',
    minute: 58,
    phase: 'second-half',
    relatedPlayerId: 'player-10',
  },
  {
    id: 'event-6',
    type: 'yellow',
    teamId: 'team-1',
    playerId: 'player-6',
    minute: 67,
    phase: 'second-half',
    reason: '항의',
  },
  {
    id: 'event-7',
    type: 'goal',
    teamId: 'team-1',
    playerId: 'player-13',
    minute: 75,
    phase: 'second-half',
  },
  {
    id: 'event-8',
    type: 'red',
    teamId: 'team-2',
    playerId: 'player-24',
    minute: 82,
    phase: 'second-half',
    reason: '2번째 경고',
  },
  {
    id: 'event-9',
    type: 'goal',
    teamId: 'team-1',
    playerId: 'player-9',
    minute: 88,
    phase: 'second-half',
    relatedPlayerId: 'player-8',
  },
];

// 가짜 경기 데이터
export const mockMatches: Match[] = [
  {
    id: 'match-1',
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
    mercenaryRecruitment: {
      enabled: true,
      positions: ['MF', 'FW'],
      count: 2,
    },
    attendances: mockAttendances,
    approvedMercenaries: [],
    events: [],
    homeLineup: mockHomeLineup,
    awayLineup: mockAwayLineup,
  },
  {
    id: 'match-2',
    type: 'league',
    leagueId: 'league-1',
    homeTeamId: 'team-3',
    awayTeamId: 'team-4',
    homeTeamName: '전북 현대',
    awayTeamName: '울산 현대',
    homeTeamLogo: '/teams/jeonbuk.png',
    awayTeamLogo: '/teams/ulsan.png',
    date: '2024-11-23',
    time: '15:00',
    venue: '전주월드컵경기장',
    status: 'finished',
    score: { home: 4, away: 1 },
    attendances: mockAttendances.map(a => ({ ...a, matchId: 'match-2' })),
    approvedMercenaries: [],
    events: mockEvents.map(e => ({ ...e, id: `match2-${e.id}` })),
    homeLineup: mockHomeLineup,
    awayLineup: mockAwayLineup,
  },
];

export const getMatchById = (id: string): Match | undefined => {
  return mockMatches.find(match => match.id === id);
};

export const getAttendingPlayers = (matchId: string): string[] => {
  return mockAttendances
    .filter(attendance => attendance.matchId === matchId && attendance.status === 'attending')
    .map(attendance => attendance.playerId);
};

export const getPlayersByTeam = (match: Match, teamId: string): PlayerLineup[] => {
  if (teamId === match.homeTeamId) {
    return match.homeLineup || [];
  }
  if (teamId === match.awayTeamId) {
    return match.awayLineup || [];
  }
  return [];
};
