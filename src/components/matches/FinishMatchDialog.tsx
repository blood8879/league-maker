"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { MatchScore } from '@/types/match';

interface FinishMatchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  homeTeamName: string;
  awayTeamName: string;
  score: MatchScore;
  onConfirm: () => void;
}

export function FinishMatchDialog({
  open,
  onOpenChange,
  homeTeamName,
  awayTeamName,
  score,
  onConfirm,
}: FinishMatchDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>경기를 종료하시겠습니까?</AlertDialogTitle>
          <AlertDialogDescription>
            경기를 종료하면 더 이상 기록을 수정할 수 없습니다.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="py-4">
          <div className="text-center space-y-2">
            <div className="text-sm text-muted-foreground">최종 스코어</div>
            <div className="text-3xl font-bold font-mono">
              {homeTeamName} {score.home} : {score.away} {awayTeamName}
            </div>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            경기 종료
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
