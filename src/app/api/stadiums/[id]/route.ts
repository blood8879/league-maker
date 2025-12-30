import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

// 경기장 수정
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const stadiumId = params.id;
    const body = await request.json();
    const {
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

    // 현재 사용자 확인
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    // 경기장 정보 조회하여 팀 ID 확인
    const { data: stadium, error: stadiumError } = await supabase
      .from('stadiums')
      .select('team_id')
      .eq('id', stadiumId)
      .single();

    if (stadiumError || !stadium) {
      return NextResponse.json(
        { error: '경기장을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 사용자가 해당 팀의 주장, 코치, 감독인지 확인
    const { data: membership, error: membershipError } = await supabase
      .from('team_members')
      .select('role')
      .eq('team_id', stadium.team_id)
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
        { error: '경기장을 수정할 권한이 없습니다. 주장, 코치, 감독만 수정할 수 있습니다.' },
        { status: 403 }
      );
    }

    // 경기장 정보 수정
    const { data, error } = await supabase
      .from('stadiums')
      .update({
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
      })
      .eq('id', stadiumId)
      .select()
      .single();

    if (error) {
      console.error('경기장 수정 오류:', error);
      return NextResponse.json(
        { error: '경기장 수정에 실패했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ stadium: data });
  } catch (error) {
    console.error('경기장 수정 API 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 경기장 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const stadiumId = params.id;

    // 현재 사용자 확인
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    // 경기장 정보 조회하여 팀 ID 확인
    const { data: stadium, error: stadiumError } = await supabase
      .from('stadiums')
      .select('team_id')
      .eq('id', stadiumId)
      .single();

    if (stadiumError || !stadium) {
      return NextResponse.json(
        { error: '경기장을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 사용자가 해당 팀의 주장, 코치, 감독인지 확인
    const { data: membership, error: membershipError } = await supabase
      .from('team_members')
      .select('role')
      .eq('team_id', stadium.team_id)
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
        { error: '경기장을 삭제할 권한이 없습니다. 주장, 코치, 감독만 삭제할 수 있습니다.' },
        { status: 403 }
      );
    }

    // 경기장 삭제
    const { error } = await supabase
      .from('stadiums')
      .delete()
      .eq('id', stadiumId);

    if (error) {
      console.error('경기장 삭제 오류:', error);
      return NextResponse.json(
        { error: '경기장 삭제에 실패했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: '경기장이 삭제되었습니다.' });
  } catch (error) {
    console.error('경기장 삭제 API 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
