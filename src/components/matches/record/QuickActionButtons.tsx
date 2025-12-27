'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';

interface Player {
  id: string;
  user_id: string;
  users: {
    nickname: string;
  };
}

interface QuickActionButtonsProps {
  selectedPlayerId: string | null;
  selectedTeamId: string | null;
  currentMinute: number;
  currentHalf: 'first' | 'second';
  allPlayers: Player[];
  onRecordGoal: (playerId: string, teamId: string, minute: number, half: 'first' | 'second', assistId?: string) => void;
  onRecordCard: (playerId: string, teamId: string, minute: number, half: 'first' | 'second', cardType: 'yellow' | 'red') => void;
  onRecordSubstitution: (outPlayerId: string, inPlayerId: string, teamId: string, minute: number, half: 'first' | 'second') => void;
}

export function QuickActionButtons({
  selectedPlayerId,
  selectedTeamId,
  currentMinute,
  currentHalf,
  allPlayers,
  onRecordGoal,
  onRecordCard,
  onRecordSubstitution,
}: QuickActionButtonsProps) {
  const [dialogOpen, setDialogOpen] = useState<'goal' | 'substitution' | null>(null);
  const [assistId, setAssistId] = useState<string>('');
  const [inPlayerId, setInPlayerId] = useState<string>('');

  const selectedPlayer = allPlayers.find((p) => p.user_id === selectedPlayerId);
  const teamPlayers = allPlayers.filter((p) =>
    selectedTeamId && p.id.includes(selectedTeamId)
  );

  const handleGoal = () => {
    if (!selectedPlayerId || !selectedTeamId) return;
    setDialogOpen('goal');
  };

  const confirmGoal = () => {
    if (!selectedPlayerId || !selectedTeamId) return;
    onRecordGoal(
      selectedPlayerId,
      selectedTeamId,
      currentMinute,
      currentHalf,
      assistId || undefined
    );
    setAssistId('');
    setDialogOpen(null);
  };

  const handleYellowCard = () => {
    if (!selectedPlayerId || !selectedTeamId) return;
    onRecordCard(selectedPlayerId, selectedTeamId, currentMinute, currentHalf, 'yellow');
  };

  const handleRedCard = () => {
    if (!selectedPlayerId || !selectedTeamId) return;
    onRecordCard(selectedPlayerId, selectedTeamId, currentMinute, currentHalf, 'red');
  };

  const handleSubstitution = () => {
    if (!selectedPlayerId || !selectedTeamId) return;
    setDialogOpen('substitution');
  };

  const confirmSubstitution = () => {
    if (!selectedPlayerId || !selectedTeamId || !inPlayerId) return;
    onRecordSubstitution(selectedPlayerId, inPlayerId, selectedTeamId, currentMinute, currentHalf);
    setInPlayerId('');
    setDialogOpen(null);
  };

  const isDisabled = !selectedPlayerId || !selectedTeamId;

  return (
    <>
      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">빠른 기록</h2>

        {isDisabled && (
          <div className="mb-4 p-3 bg-muted rounded-lg text-sm text-muted-foreground text-center">
            선수를 먼저 선택해주세요
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button
            variant="outline"
            className="h-24 flex flex-col gap-2"
            onClick={handleGoal}
            disabled={isDisabled}
          >
            <span className="text-3xl">⚽</span>
            <span className="font-medium">득점</span>
          </Button>

          <Button
            variant="outline"
            className="h-24 flex flex-col gap-2"
            onClick={handleYellowCard}
            disabled={isDisabled}
          >
            <span className="text-3xl">🟨</span>
            <span className="font-medium">경고</span>
          </Button>

          <Button
            variant="outline"
            className="h-24 flex flex-col gap-2"
            onClick={handleRedCard}
            disabled={isDisabled}
          >
            <span className="text-3xl">🟥</span>
            <span className="font-medium">퇴장</span>
          </Button>

          <Button
            variant="outline"
            className="h-24 flex flex-col gap-2"
            onClick={handleSubstitution}
            disabled={isDisabled}
          >
            <span className="text-3xl">🔄</span>
            <span className="font-medium">교체</span>
          </Button>
        </div>
      </div>

      {/* Goal Dialog */}
      <Dialog open={dialogOpen === 'goal'} onOpenChange={(open) => !open && setDialogOpen(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>득점 기록</DialogTitle>
            <DialogDescription>
              {selectedPlayer?.users.nickname}의 득점을 기록합니다.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>득점 시간</Label>
              <Input value={`${currentMinute}분 (${currentHalf === 'first' ? '전반' : '후반'})`} disabled />
            </div>

            <div>
              <Label>어시스트 (선택사항)</Label>
              <Select value={assistId} onValueChange={setAssistId}>
                <SelectTrigger>
                  <SelectValue placeholder="어시스트 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">없음</SelectItem>
                  {teamPlayers
                    .filter((p) => p.user_id !== selectedPlayerId)
                    .map((player) => (
                      <SelectItem key={player.user_id} value={player.user_id}>
                        {player.users.nickname}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setDialogOpen(null)}>
                취소
              </Button>
              <Button onClick={confirmGoal}>
                기록하기
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Substitution Dialog */}
      <Dialog open={dialogOpen === 'substitution'} onOpenChange={(open) => !open && setDialogOpen(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>교체 기록</DialogTitle>
            <DialogDescription>
              {selectedPlayer?.users.nickname}를 교체합니다.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>교체 시간</Label>
              <Input value={`${currentMinute}분 (${currentHalf === 'first' ? '전반' : '후반'})`} disabled />
            </div>

            <div>
              <Label>OUT</Label>
              <Input value={selectedPlayer?.users.nickname} disabled />
            </div>

            <div>
              <Label>IN</Label>
              <Select value={inPlayerId} onValueChange={setInPlayerId}>
                <SelectTrigger>
                  <SelectValue placeholder="교체 투입 선수 선택" />
                </SelectTrigger>
                <SelectContent>
                  {teamPlayers
                    .filter((p) => p.user_id !== selectedPlayerId)
                    .map((player) => (
                      <SelectItem key={player.user_id} value={player.user_id}>
                        {player.users.nickname}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setDialogOpen(null)}>
                취소
              </Button>
              <Button onClick={confirmSubstitution} disabled={!inPlayerId}>
                기록하기
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
