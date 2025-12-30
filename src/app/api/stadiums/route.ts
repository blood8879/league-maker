import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

// 경기장 목록 조회
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const teamId = searchParams.get('teamId');

    if (!teamId) {
      return NextResponse.json(
        { error: '팀 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('stadiums')
      .select('*')
      .eq('team_id', teamId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('경기장 조회 오류:', error);
      return NextResponse.json(
        { error: '경기장 목록을 불러오는데 실패했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ stadiums: data });
  } catch (error) {
    console.error('경기장 조회 API 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 경기장 등록
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      teamId,
      name,
      address,
      addressDetail,
      roadAddress,
      jibunAddress,
      zoneCode,
      latitude,
      longitude,
      phone,
      notes,
    } = body;

    // 필수 필드 검증
    if (!teamId || !name || !address) {
      return NextResponse.json(
        { error: '팀 ID, 경기장명, 주소는 필수 입력 항목입니다.' },
        { status: 400 }
      );
    }

    // 현재 사용자 확인
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    // 사용자가 해당 팀의 주장, 코치, 감독인지 확인
    const { data: membership, error: membershipError } = await supabase
      .from('team_members')
      .select('role')
      .eq('team_id', teamId)
      .eq('user_id', user.id)
      .single();

    if (membershipError || !membership) {
      return NextResponse.json(
        { error: '해당 팀의 멤버가 아닙니다.' },
        { status: 403 }
      );
    }

    if (!['captain', 'coach', 'manager'].includes(membership.role)) {
      return NextResponse.json(
        { error: '경기장을 등록할 권한이 없습니다. 주장, 코치, 감독만 등록할 수 있습니다.' },
        { status: 403 }
      );
    }

    // 경기장 등록
    const { data, error } = await supabase
      .from('stadiums')
      .insert({
        team_id: teamId,
        name,
        address,
        address_detail: addressDetail || null,
        road_address: roadAddress || null,
        jibun_address: jibunAddress || null,
        zone_code: zoneCode || null,
        latitude: latitude || null,
        longitude: longitude || null,
        phone: phone || null,
        notes: notes || null,
        created_by: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error('경기장 등록 오류:', error);
      return NextResponse.json(
        { error: '경기장 등록에 실패했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ stadium: data }, { status: 201 });
  } catch (error) {
    console.error('경기장 등록 API 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
