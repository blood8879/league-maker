"use client";

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EventType, PlayerLineup } from '@/types/match';

interface EventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventType: EventType | null;
  currentMinute: number;
  selectedPlayer: PlayerLineup | null;
  teamPlayers: PlayerLineup[];
  onConfirm: (data: {
    minute: number;
    assistPlayerId?: string;
    reason?: string;
    outPlayerId?: string;
    inPlayerId?: string;
  }) => void;
}

export function EventDialog({
  open,
  onOpenChange,
  eventType,
  currentMinute,
  selectedPlayer,
  teamPlayers,
  onConfirm,
}: EventDialogProps) {
  const [minute, setMinute] = useState(currentMinute.toString());
  const [assistPlayerId, setAssistPlayerId] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [outPlayerId, setOutPlayerId] = useState<string>('');
  const [inPlayerId, setInPlayerId] = useState<string>('');

  const handleConfirm = () => {
    const data: {
      minute: number;
      assistPlayerId?: string;
      reason?: string;
      outPlayerId?: string;
      inPlayerId?: string;
    } = {
      minute: parseInt(minute, 10),
    };

    if (eventType === 'goal' && assistPlayerId) {
      data.assistPlayerId = assistPlayerId;
    }

    if ((eventType === 'yellow' || eventType === 'red') && reason) {
      data.reason = reason;
    }

    if (eventType === 'substitution') {
      data.outPlayerId = outPlayerId;
      data.inPlayerId = inPlayerId;
    }

    onConfirm(data);
    resetForm();
  };

  const resetForm = () => {
    setMinute(currentMinute.toString());
    setAssistPlayerId('');
    setReason('');
    setOutPlayerId('');
    setInPlayerId('');
  };

  const getTitle = (): string => {
    switch (eventType) {
      case 'goal':
        return '⚽ 득점 기록';
      case 'yellow':
        return '🟨 경고 기록';
      case 'red':
        return '🟥 퇴장 기록';
      case 'substitution':
        return '🔄 교체 기록';
      default:
        return '기록 추가';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription>
            {selectedPlayer && `선수: ${selectedPlayer.name}`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* 시간 입력 */}
          <div className="space-y-2">
            <Label htmlFor="minute">경기 시간 (분)</Label>
            <Input
              id="minute"
              type="number"
              value={minute}
              onChange={(e) => setMinute(e.target.value)}
              min="0"
              max="90"
            />
          </div>

          {/* 득점 - 어시스트 선택 */}
          {eventType === 'goal' && (
            <div className="space-y-2">
              <Label htmlFor="assist">어시스트 (선택사항)</Label>
              <Select value={assistPlayerId} onValueChange={setAssistPlayerId}>
                <SelectTrigger id="assist">
                  <SelectValue placeholder="어시스트한 선수를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">없음</SelectItem>
                  {teamPlayers
                    .filter(p => p.playerId !== selectedPlayer?.playerId)
                    .map(player => (
                      <SelectItem key={player.playerId} value={player.playerId}>
                        {player.name} (#{player.number})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* 경고/퇴장 - 사유 선택 */}
          {(eventType === 'yellow' || eventType === 'red') && (
            <div className="space-y-2">
              <Label htmlFor="reason">사유</Label>
              <Select value={reason} onValueChange={setReason}>
                <SelectTrigger id="reason">
                  <SelectValue placeholder="사유를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="반칙">반칙</SelectItem>
                  <SelectItem value="핸드볼">핸드볼</SelectItem>
                  <SelectItem value="항의">항의</SelectItem>
                  <SelectItem value="시간 끌기">시간 끌기</SelectItem>
                  <SelectItem value="폭력">폭력</SelectItem>
                  <SelectItem value="기타">기타</SelectItem>
                  {eventType === 'red' && <SelectItem value="2번째 경고">2번째 경고</SelectItem>}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* 교체 - OUT/IN 선수 선택 */}
          {eventType === 'substitution' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="out">교체 OUT</Label>
                <Select value={outPlayerId} onValueChange={setOutPlayerId}>
                  <SelectTrigger id="out">
                    <SelectValue placeholder="교체될 선수를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {teamPlayers
                      .filter(p => p.isStarter || p.isSubstituted)
                      .map(player => (
                        <SelectItem key={player.playerId} value={player.playerId}>
                          {player.name} (#{player.number})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="in">교체 IN</Label>
                <Select value={inPlayerId} onValueChange={setInPlayerId}>
                  <SelectTrigger id="in">
                    <SelectValue placeholder="투입될 선수를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {teamPlayers
                      .filter(p => !p.isStarter && !p.isSubstituted)
                      .map(player => (
                        <SelectItem key={player.playerId} value={player.playerId}>
                          {player.name} (#{player.number})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button onClick={handleConfirm}>
            확인
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
