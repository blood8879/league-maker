import { Notification } from '@/types/notification';

export const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    type: 'match_schedule',
    title: '경기 일정 알림',
    message: 'FC 서울 vs 수원 블루윙즈 경기가 내일 오후 2시에 시작됩니다.',
    link: '/matches/match-upcoming-1',
    isRead: false,
    createdAt: '2024-11-23T09:00:00',
    imageUrl: '/teams/fc-seoul.png',
    metadata: {
      matchId: 'match-upcoming-1',
    },
  },
  {
    id: 'notif-2',
    type: 'attendance_request',
    title: '참석 여부 확인',
    message: '11월 28일 전북 현대와의 경기 참석 여부를 결정해주세요.',
    link: '/matches/match-upcoming-2',
    isRead: false,
    createdAt: '2024-11-23T08:30:00',
    metadata: {
      matchId: 'match-upcoming-2',
    },
  },
  {
    id: 'notif-3',
    type: 'mercenary_application',
    title: '용병 신청',
    message: '김철수님이 12월 1일 연습 경기 용병으로 신청했습니다.',
    link: '/matches/match-upcoming-3',
    isRead: true,
    createdAt: '2024-11-22T15:20:00',
    metadata: {
      matchId: 'match-upcoming-3',
      userId: 'user-5',
    },
  },
  {
    id: 'notif-4',
    type: 'comment',
    title: '새 댓글',
    message: '박영희님이 회원님의 게시글에 댓글을 남겼습니다.',
    link: '/community/post-1',
    isRead: true,
    createdAt: '2024-11-22T11:10:00',
    metadata: {
      postId: 'post-1',
      userId: 'user-3',
    },
  },
  {
    id: 'notif-5',
    type: 'team_invitation',
    title: '팀 초대',
    message: '강남 FC에서 팀 가입을 초대했습니다.',
    link: '/teams/team-6',
    isRead: true,
    createdAt: '2024-11-21T16:45:00',
    imageUrl: '/teams/gangnam-fc.png',
    metadata: {
      teamId: 'team-6',
    },
  },
  {
    id: 'notif-6',
    type: 'league_update',
    title: '리그 순위 변동',
    message: '서울 K리그 아마추어 순위표가 업데이트되었습니다.',
    link: '/leagues/league-1',
    isRead: true,
    createdAt: '2024-11-21T14:00:00',
    metadata: {
      matchId: 'league-1',
    },
  },
];

// 읽지 않은 알림 수 계산
export const getUnreadNotificationCount = (notifications: Notification[]): number => {
  return notifications.filter((n) => !n.isRead).length;
};

// 알림을 읽음으로 표시
export const markAsRead = (notificationId: string, notifications: Notification[]): Notification[] => {
  return notifications.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n));
};

// 모든 알림을 읽음으로 표시
export const markAllAsRead = (notifications: Notification[]): Notification[] => {
  return notifications.map((n) => ({ ...n, isRead: true }));
};
