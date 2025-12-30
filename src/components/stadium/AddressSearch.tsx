'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { searchAddressClient } from '@/lib/kakao-address';
import type { KakaoAddressSearchResult } from '@/types/stadium';

interface AddressSearchProps {
  onSelectAddress: (address: {
    address: string;
    roadAddress?: string;
    jibunAddress?: string;
    zoneCode?: string;
    latitude?: number;
    longitude?: number;
  }) => void;
}

export default function AddressSearch({ onSelectAddress }: AddressSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<KakaoAddressSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) {
      setError('검색어를 입력해주세요.');
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      const response = await searchAddressClient(query);

      if (response.documents.length === 0) {
        setError('검색 결과가 없습니다. 다른 키워드로 검색해보세요.');
        setResults([]);
      } else {
        setResults(response.documents);
      }
    } catch (err) {
      console.error('주소 검색 오류:', err);
      setError(err instanceof Error ? err.message : '주소 검색에 실패했습니다.');
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectResult = (result: KakaoAddressSearchResult) => {
    const selectedAddress = {
      address: result.address_name,
      roadAddress: result.road_address?.address_name,
      jibunAddress: result.address?.address_name,
      zoneCode: result.road_address?.zone_no || result.address?.zip_code,
      latitude: parseFloat(result.y),
      longitude: parseFloat(result.x),
    };

    onSelectAddress(selectedAddress);
    setResults([]);
    setQuery('');
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="도로명 또는 지번 주소를 입력하세요"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          disabled={isSearching}
        />
        <button
          onClick={handleSearch}
          disabled={isSearching}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Search className="w-4 h-4" />
          {isSearching ? '검색 중...' : '검색'}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {results.length > 0 && (
        <div className="border border-gray-200 rounded-lg divide-y max-h-96 overflow-y-auto">
          {results.map((result, index) => (
            <button
              key={index}
              onClick={() => handleSelectResult(result)}
              className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium text-gray-900">
                {result.road_address?.address_name || result.address_name}
              </div>
              {result.road_address && result.address && (
                <div className="text-sm text-gray-600 mt-1">
                  지번: {result.address.address_name}
                </div>
              )}
              {result.road_address?.zone_no && (
                <div className="text-xs text-gray-500 mt-1">
                  우편번호: {result.road_address.zone_no}
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
