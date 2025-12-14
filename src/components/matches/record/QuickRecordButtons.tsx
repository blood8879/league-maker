"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MatchEventType } from "@/types/league";

interface QuickRecordButtonsProps {
  disabled: boolean;
  onRecord: (type: MatchEventType) => void;
}

export function QuickRecordButtons({ disabled, onRecord }: QuickRecordButtonsProps) {
  return (
    <Card>
      <CardContent className="p-4 grid grid-cols-2 gap-3">
        <Button 
          variant="outline" 
          className="h-20 flex flex-col gap-1 border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700"
          disabled={disabled}
          onClick={() => onRecord('goal')}
        >
          <span className="text-2xl">⚽</span>
          <span className="font-bold">득점</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="h-20 flex flex-col gap-1 border-yellow-200 bg-yellow-50 hover:bg-yellow-100 text-yellow-700"
          disabled={disabled}
          onClick={() => onRecord('yellow_card')}
        >
          <span className="text-2xl">🟨</span>
          <span className="font-bold">경고</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="h-20 flex flex-col gap-1 border-red-200 bg-red-50 hover:bg-red-100 text-red-700"
          disabled={disabled}
          onClick={() => onRecord('red_card')}
        >
          <span className="text-2xl">🟥</span>
          <span className="font-bold">퇴장</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="h-20 flex flex-col gap-1 border-green-200 bg-green-50 hover:bg-green-100 text-green-700"
          disabled={disabled}
          onClick={() => onRecord('substitution')}
        >
          <span className="text-2xl">🔄</span>
          <span className="font-bold">교체</span>
        </Button>
      </CardContent>
    </Card>
  );
}
