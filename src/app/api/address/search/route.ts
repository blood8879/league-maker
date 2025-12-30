import { NextRequest, NextResponse } from 'next/server';
import { searchKakaoAddress } from '@/lib/kakao-address';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query');

    if (!query) {
      return NextResponse.json(
        { error: '검색어를 입력해주세요.' },
        { status: 400 }
      );
    }

    const result = await searchKakaoAddress(query);

    return NextResponse.json(result);
  } catch (error) {
    console.error('주소 검색 API 오류:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '주소 검색에 실패했습니다.' },
      { status: 500 }
    );
  }
}
