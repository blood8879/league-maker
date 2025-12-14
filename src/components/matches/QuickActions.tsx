"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, AlertCircle, XCircle, Repeat } from 'lucide-react';

interface QuickActionsProps {
  onGoal: () => void;
  onYellow: () => void;
  onRed: () => void;
  onSubstitution: () => void;
  disabled?: boolean;
}

export function QuickActions({
  onGoal,
  onYellow,
  onRed,
  onSubstitution,
  disabled = false,
}: QuickActionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>빠른 기록</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={onGoal}
            disabled={disabled}
            size="lg"
            className="h-20 flex flex-col items-center justify-center gap-2 touch-manipulation"
          >
            <Target className="w-6 h-6" />
            <span className="text-sm">득점</span>
          </Button>

          <Button
            onClick={onYellow}
            disabled={disabled}
            size="lg"
            className="h-20 flex flex-col items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white touch-manipulation"
          >
            <AlertCircle className="w-6 h-6" />
            <span className="text-sm">경고</span>
          </Button>

          <Button
            onClick={onRed}
            disabled={disabled}
            variant="destructive"
            size="lg"
            className="h-20 flex flex-col items-center justify-center gap-2 touch-manipulation"
          >
            <XCircle className="w-6 h-6" />
            <span className="text-sm">퇴장</span>
          </Button>

          <Button
            onClick={onSubstitution}
            disabled={disabled}
            variant="secondary"
            size="lg"
            className="h-20 flex flex-col items-center justify-center gap-2 touch-manipulation"
          >
            <Repeat className="w-6 h-6" />
            <span className="text-sm">교체</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
