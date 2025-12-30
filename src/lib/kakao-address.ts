import type { KakaoAddressResponse } from '@/types/stadium';

/**
 * 카카오 주소 검색 API를 사용하여 주소를 검색합니다.
 * @param query 검색할 주소 키워드
 * @returns 카카오 API 응답 결과
 */
export async function searchKakaoAddress(query: string): Promise<KakaoAddressResponse> {
  const apiKey = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY;

  if (!apiKey) {
    throw new Error('카카오 REST API 키가 설정되지 않았습니다.');
  }

  if (!query || query.trim().length === 0) {
    throw new Error('검색어를 입력해주세요.');
  }

  try {
    const response = await fetch(
      `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(query)}`,
      {
        headers: {
          Authorization: `KakaoAK ${apiKey}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`카카오 API 요청 실패: ${response.status} ${response.statusText}`);
    }

    const data: KakaoAddressResponse = await response.json();
    return data;
  } catch (error) {
    console.error('카카오 주소 검색 오류:', error);
    throw error;
  }
}

/**
 * 클라이언트 측에서 사용할 주소 검색 함수
 * Next.js API Route를 통해 호출합니다.
 */
export async function searchAddressClient(query: string): Promise<KakaoAddressResponse> {
  if (!query || query.trim().length === 0) {
    throw new Error('검색어를 입력해주세요.');
  }

  try {
    const response = await fetch(`/api/address/search?query=${encodeURIComponent(query)}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || '주소 검색에 실패했습니다.');
    }

    const data: KakaoAddressResponse = await response.json();
    return data;
  } catch (error) {
    console.error('주소 검색 오류:', error);
    throw error;
  }
}
