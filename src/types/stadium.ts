export interface Stadium {
  id: string;
  teamId: string;
  name: string;
  address: string;
  addressDetail?: string;
  roadAddress?: string;
  jibunAddress?: string;
  zoneCode?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

export interface KakaoAddressSearchResult {
  address_name: string;
  address_type: 'REGION' | 'ROAD' | 'REGION_ADDR' | 'ROAD_ADDR';
  x: string; // 경도
  y: string; // 위도
  address: {
    address_name: string;
    region_1depth_name: string;
    region_2depth_name: string;
    region_3depth_name: string;
    mountain_yn: 'Y' | 'N';
    main_address_no: string;
    sub_address_no: string;
    zip_code: string;
  } | null;
  road_address: {
    address_name: string;
    region_1depth_name: string;
    region_2depth_name: string;
    region_3depth_name: string;
    road_name: string;
    underground_yn: 'Y' | 'N';
    main_building_no: string;
    sub_building_no: string;
    building_name: string;
    zone_no: string;
  } | null;
}

export interface KakaoAddressResponse {
  meta: {
    total_count: number;
    pageable_count: number;
    is_end: boolean;
  };
  documents: KakaoAddressSearchResult[];
}

export interface StadiumFormData {
  name: string;
  address: string;
  addressDetail?: string;
  roadAddress?: string;
  jibunAddress?: string;
  zoneCode?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  notes?: string;
}
