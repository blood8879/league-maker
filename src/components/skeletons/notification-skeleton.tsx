import { Skeleton } from '@/components/ui/skeleton';

export function NotificationItemSkeleton() {
  return (
    <div className="flex gap-3 p-3">
      <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-3 w-full max-w-md" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  );
}

export function NotificationListSkeleton() {
  return (
    <div className="space-y-1 p-1">
      <NotificationItemSkeleton />
      <NotificationItemSkeleton />
      <NotificationItemSkeleton />
      <NotificationItemSkeleton />
      <NotificationItemSkeleton />
    </div>
  );
}
