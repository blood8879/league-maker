// 알림 타입
export type NotificationType =
  | 'match_schedule'    // 경기 일정 알림
  | 'attendance_request' // 참석 요청 알림
  | 'mercenary_application' // 용병 신청 알림
  | 'comment'           // 댓글 알림
  | 'team_invitation'   // 팀 초대 알림
  | 'league_update';    // 리그 업데이트 알림

// 알림
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
  imageUrl?: string;

  // 추가 메타데이터
  metadata?: {
    matchId?: string;
    teamId?: string;
    postId?: string;
    userId?: string;
  };
}
