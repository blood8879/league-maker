'use client';

import { useEffect, useState } from 'react';
import { MapPin, Phone, FileText, Trash2, Edit } from 'lucide-react';
import type { Stadium } from '@/types/stadium';

interface StadiumListProps {
  teamId: string;
  canManage?: boolean;
  onRefresh?: number;
}

export default function StadiumList({ teamId, canManage = false, onRefresh }: StadiumListProps) {
  const [stadiums, setStadiums] = useState<Stadium[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStadiums = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/stadiums?teamId=${teamId}`);

      if (!response.ok) {
        throw new Error('경기장 목록을 불러오는데 실패했습니다.');
      }

      const data = await response.json();
      setStadiums(data.stadiums || []);
    } catch (err) {
      console.error('경기장 조회 오류:', err);
      setError(err instanceof Error ? err.message : '경기장 목록을 불러올 수 없습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStadiums();
  }, [teamId, onRefresh]);

  const handleDelete = async (stadiumId: string) => {
    if (!confirm('정말로 이 경기장을 삭제하시겠습니까?')) {
      return;
    }

    try {
      const response = await fetch(`/api/stadiums/${stadiumId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '경기장 삭제에 실패했습니다.');
      }

      // 삭제 성공 시 목록 새로고침
      fetchStadiums();
    } catch (err) {
      console.error('경기장 삭제 오류:', err);
      alert(err instanceof Error ? err.message : '경기장 삭제에 실패했습니다.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
        {error}
      </div>
    );
  }

  if (stadiums.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-600">등록된 경기장이 없습니다.</p>
        {canManage && (
          <p className="text-sm text-gray-500 mt-2">
            상단의 등록 폼을 사용하여 경기장을 등록해보세요.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {stadiums.map((stadium) => (
        <div
          key={stadium.id}
          className="border border-gray-200 rounded-lg p-6 hover:border-green-500 transition-colors"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {stadium.name}
              </h3>

              <div className="space-y-2">
                <div className="flex items-start gap-2 text-gray-700">
                  <MapPin className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div>{stadium.address}</div>
                    {stadium.addressDetail && (
                      <div className="text-sm text-gray-600">상세: {stadium.addressDetail}</div>
                    )}
                    {stadium.roadAddress && stadium.roadAddress !== stadium.address && (
                      <div className="text-sm text-gray-600">도로명: {stadium.roadAddress}</div>
                    )}
                    {stadium.zoneCode && (
                      <div className="text-sm text-gray-600">우편번호: {stadium.zoneCode}</div>
                    )}
                  </div>
                </div>

                {stadium.phone && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <Phone className="w-5 h-5 text-green-600" />
                    <span>{stadium.phone}</span>
                  </div>
                )}

                {stadium.notes && (
                  <div className="flex items-start gap-2 text-gray-700">
                    <FileText className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="whitespace-pre-wrap">{stadium.notes}</span>
                  </div>
                )}
              </div>

              <div className="mt-3 text-xs text-gray-500">
                등록일: {new Date(stadium.createdAt).toLocaleDateString('ko-KR')}
              </div>
            </div>

            {canManage && (
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => handleDelete(stadium.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="삭제"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
