# 홈 경기장 등록 기능

팀의 주장, 코치, 감독이 홈 경기장을 등록하고 관리할 수 있는 기능입니다.

## 주요 기능

### 1. 경기장 등록
- 팀별로 여러 개의 경기장 등록 가능
- 카카오 주소 검색 API를 통한 정확한 주소 입력
- 경기장명, 주소, 상세주소, 연락처, 메모 등 입력 가능
- 좌표 정보(위도/경도) 자동 저장

### 2. 권한 관리
- 주장(captain), 코치(coach), 감독(manager)만 등록/수정/삭제 가능
- Row Level Security(RLS)를 통한 데이터베이스 수준 보안

### 3. 주소 검색
- 카카오 주소 검색 API 연동
- 도로명 주소 및 지번 주소 지원
- 우편번호 자동 입력
- 좌표 정보 자동 저장

## 설치 및 설정

### 1. 데이터베이스 마이그레이션

Supabase 대시보드에서 SQL Editor를 열고 다음 파일의 내용을 실행하세요:

\`\`\`bash
supabase-stadiums-migration.sql
\`\`\`

또는 Supabase CLI를 사용하는 경우:

\`\`\`bash
supabase db push
\`\`\`

### 2. 환경 변수 설정

\`.env.local\` 파일을 생성하고 다음 내용을 추가하세요:

\`\`\`bash
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# 카카오 REST API 키
NEXT_PUBLIC_KAKAO_REST_API_KEY=your-kakao-rest-api-key
\`\`\`

### 3. 카카오 REST API 키 발급

1. [카카오 개발자 센터](https://developers.kakao.com)에 접속
2. 로그인 후 "내 애플리케이션" 메뉴 선택
3. "애플리케이션 추가하기" 클릭
4. 앱 이름 입력 후 생성
5. 생성된 앱의 "앱 키" 탭에서 "REST API 키" 복사
6. \`.env.local\` 파일의 \`NEXT_PUBLIC_KAKAO_REST_API_KEY\`에 붙여넣기

## 사용 방법

### 경기장 관리 페이지 접근

1. 내 팀 목록에서 팀 선택
2. "홈 경기장 관리" 메뉴 클릭
3. URL: \`/my/teams/[teamId]/stadiums\`

### 경기장 등록 절차

1. "경기장 등록" 버튼 클릭
2. 경기장명 입력
3. 주소 검색창에 주소 입력 후 검색
4. 검색 결과에서 정확한 주소 선택
5. 상세 주소, 연락처, 메모 입력 (선택사항)
6. "경기장 등록" 버튼 클릭

### 경기장 삭제

1. 경기장 목록에서 삭제할 경기장 찾기
2. 휴지통 아이콘 클릭
3. 확인 대화상자에서 "확인" 클릭

## 데이터베이스 스키마

### stadiums 테이블

| 컬럼명 | 타입 | 설명 |
|--------|------|------|
| id | UUID | 기본 키 |
| team_id | UUID | 팀 ID (외래 키) |
| name | VARCHAR(200) | 경기장명 |
| address | VARCHAR(500) | 주소 |
| address_detail | VARCHAR(200) | 상세 주소 |
| road_address | VARCHAR(500) | 도로명 주소 |
| jibun_address | VARCHAR(500) | 지번 주소 |
| zone_code | VARCHAR(10) | 우편번호 |
| latitude | DECIMAL(10, 8) | 위도 |
| longitude | DECIMAL(11, 8) | 경도 |
| phone | VARCHAR(20) | 연락처 |
| notes | TEXT | 메모 |
| created_at | TIMESTAMP | 생성 일시 |
| updated_at | TIMESTAMP | 수정 일시 |
| created_by | UUID | 생성자 ID |

## API 엔드포인트

### GET /api/stadiums?teamId={teamId}
팀의 경기장 목록 조회

**응답:**
\`\`\`json
{
  "stadiums": [
    {
      "id": "uuid",
      "team_id": "uuid",
      "name": "서울 강남구 체육공원",
      "address": "서울특별시 강남구 테헤란로 123",
      ...
    }
  ]
}
\`\`\`

### POST /api/stadiums
경기장 등록

**요청 본문:**
\`\`\`json
{
  "teamId": "uuid",
  "name": "경기장명",
  "address": "주소",
  "addressDetail": "상세주소",
  "roadAddress": "도로명주소",
  "jibunAddress": "지번주소",
  "zoneCode": "12345",
  "latitude": 37.123456,
  "longitude": 127.123456,
  "phone": "02-1234-5678",
  "notes": "메모"
}
\`\`\`

### DELETE /api/stadiums/{stadiumId}
경기장 삭제

## 보안

- Row Level Security(RLS) 정책으로 데이터베이스 수준 접근 제어
- 주장, 코치, 감독만 등록/수정/삭제 가능
- 모든 사용자는 경기장 정보 조회 가능
- API 레벨에서도 권한 검증 수행

## 컴포넌트 구조

\`\`\`
src/
├── app/
│   ├── api/
│   │   ├── address/
│   │   │   └── search/
│   │   │       └── route.ts          # 카카오 주소 검색 API
│   │   └── stadiums/
│   │       ├── route.ts               # 경기장 목록 조회 & 등록
│   │       └── [id]/
│   │           └── route.ts           # 경기장 수정 & 삭제
│   └── (main)/
│       └── my/
│           └── teams/
│               └── [teamId]/
│                   └── stadiums/
│                       └── page.tsx    # 경기장 관리 페이지
├── components/
│   └── stadium/
│       ├── AddressSearch.tsx          # 주소 검색 컴포넌트
│       ├── StadiumForm.tsx            # 경기장 등록 폼
│       └── StadiumList.tsx            # 경기장 목록
├── lib/
│   └── kakao-address.ts               # 카카오 API 유틸리티
└── types/
    └── stadium.ts                     # Stadium 타입 정의
\`\`\`

## 향후 개선 사항

- [ ] 경기장 수정 기능 UI 추가
- [ ] 지도에서 경기장 위치 표시 (카카오맵 또는 네이버맵)
- [ ] 경기장 사진 업로드 기능
- [ ] 즐겨찾기 경기장 설정
- [ ] 경기 생성 시 경기장 자동 완성
- [ ] 경기장별 경기 이력 통계

## 트러블슈팅

### 카카오 API 오류
- API 키가 올바른지 확인
- 카카오 개발자 콘솔에서 플랫폼 설정 확인
- 브라우저 콘솔에서 네트워크 오류 확인

### 권한 오류
- 사용자의 팀 멤버십 role 확인
- Supabase RLS 정책이 올바르게 설정되었는지 확인

### 주소 검색 결과 없음
- 정확한 주소를 입력했는지 확인
- 도로명 또는 지번 주소로 검색
- 건물명보다는 도로명 주소 사용 권장
