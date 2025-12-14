'use client';

import { Notification, NotificationType } from '@/types/notification';
import { Calendar, UserCheck, UserPlus, MessageSquare, Users, Trophy } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

interface NotificationItemProps {
  notification: Notification;
  onRead?: (id: string) => void;
}

export function NotificationItem({ notification, onRead }: NotificationItemProps) {
  const handleClick = () => {
    if (!notification.isRead && onRead) {
      onRead(notification.id);
    }
  };

  const icon = getNotificationIcon(notification.type);
  const timeAgo = formatDistanceToNow(new Date(notification.createdAt), {
    addSuffix: true,
    locale: ko,
  });

  const content = (
    <div
      className={`flex gap-3 p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer ${
        !notification.isRead ? 'bg-primary/5' : ''
      }`}
      onClick={handleClick}
    >
      {/* 아이콘 */}
      <div className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${
        !notification.isRead ? 'bg-primary/10' : 'bg-muted'
      }`}>
        {notification.imageUrl ? (
          <Image
            src={notification.imageUrl}
            alt=""
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <div className="text-primary">{icon}</div>
        )}
      </div>

      {/* 내용 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <p className={`text-sm font-medium ${!notification.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
              {notification.title}
            </p>
            <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
              {notification.message}
            </p>
          </div>
          {!notification.isRead && (
            <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1" />
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1">{timeAgo}</p>
      </div>
    </div>
  );

  if (notification.link) {
    return <Link href={notification.link}>{content}</Link>;
  }

  return content;
}

function getNotificationIcon(type: NotificationType) {
  switch (type) {
    case 'match_schedule':
      return <Calendar className="h-5 w-5" />;
    case 'attendance_request':
      return <UserCheck className="h-5 w-5" />;
    case 'mercenary_application':
      return <UserPlus className="h-5 w-5" />;
    case 'comment':
      return <MessageSquare className="h-5 w-5" />;
    case 'team_invitation':
      return <Users className="h-5 w-5" />;
    case 'league_update':
      return <Trophy className="h-5 w-5" />;
    default:
      return <Calendar className="h-5 w-5" />;
  }
}
