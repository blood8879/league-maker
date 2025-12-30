'use client';

import { useState } from 'react';
import { MapPin, Phone, FileText } from 'lucide-react';
import AddressSearch from './AddressSearch';
import type { StadiumFormData } from '@/types/stadium';

interface StadiumFormProps {
  teamId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function StadiumForm({ teamId, onSuccess, onCancel }: StadiumFormProps) {
  const [formData, setFormData] = useState<StadiumFormData>({
    name: '',
    address: '',
    addressDetail: '',
    roadAddress: '',
    jibunAddress: '',
    zoneCode: '',
    latitude: undefined,
    longitude: undefined,
    phone: '',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddressSelect = (address: {
    address: string;
    roadAddress?: string;
    jibunAddress?: string;
    zoneCode?: string;
    latitude?: number;
    longitude?: number;
  }) => {
    setFormData({
      ...formData,
      address: address.address,
      roadAddress: address.roadAddress,
      jibunAddress: address.jibunAddress,
      zoneCode: address.zoneCode,
      latitude: address.latitude,
      longitude: address.longitude,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError('경기장명을 입력해주세요.');
      return;
    }

    if (!formData.address.trim()) {
      setError('주소를 검색하여 선택해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/stadiums', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          teamId,
          ...formData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '경기장 등록에 실패했습니다.');
      }

      // 성공 시 폼 초기화
      setFormData({
        name: '',
        address: '',
        addressDetail: '',
        roadAddress: '',
        jibunAddress: '',
        zoneCode: '',
        latitude: undefined,
        longitude: undefined,
        phone: '',
        notes: '',
      });

      onSuccess?.();
    } catch (err) {
      console.error('경기장 등록 오류:', err);
      setError(err instanceof Error ? err.message : '경기장 등록에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* 경기장명 */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          경기장명 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="예: 서울 강남구 체육공원"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />
      </div>

      {/* 주소 검색 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          주소 검색 <span className="text-red-500">*</span>
        </label>
        <AddressSearch onSelectAddress={handleAddressSelect} />
      </div>

      {/* 선택된 주소 표시 */}
      {formData.address && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start gap-2">
            <MapPin className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <div className="font-medium text-gray-900">{formData.address}</div>
              {formData.roadAddress && formData.roadAddress !== formData.address && (
                <div className="text-sm text-gray-600 mt-1">도로명: {formData.roadAddress}</div>
              )}
              {formData.jibunAddress && formData.jibunAddress !== formData.address && (
                <div className="text-sm text-gray-600">지번: {formData.jibunAddress}</div>
              )}
              {formData.zoneCode && (
                <div className="text-sm text-gray-600">우편번호: {formData.zoneCode}</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 상세 주소 */}
      <div>
        <label htmlFor="addressDetail" className="block text-sm font-medium text-gray-700 mb-2">
          상세 주소
        </label>
        <input
          type="text"
          id="addressDetail"
          value={formData.addressDetail}
          onChange={(e) => setFormData({ ...formData, addressDetail: e.target.value })}
          placeholder="예: 3층, A구장"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* 연락처 */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
          <Phone className="w-4 h-4 inline mr-1" />
          연락처
        </label>
        <input
          type="tel"
          id="phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="예: 02-1234-5678"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* 메모 */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
          <FileText className="w-4 h-4 inline mr-1" />
          메모
        </label>
        <textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="주차 정보, 샤워실 유무, 기타 참고사항 등"
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* 버튼 */}
      <div className="flex gap-3 justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            disabled={isSubmitting}
          >
            취소
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting || !formData.name || !formData.address}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? '등록 중...' : '경기장 등록'}
        </button>
      </div>
    </form>
  );
}
