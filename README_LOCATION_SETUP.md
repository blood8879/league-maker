# 지역 설정 기능 추가

프로필 설정 과정에 사용자의 활동 지역을 설정하는 단계가 추가되었습니다.

## 기능 개요

1. **2단계 프로필 설정**: 기본 정보 입력 → 지역 설정 → 완료
2. **지역 선택**: 시/도와 구/군을 순차적으로 선택
3. **데이터베이스 저장**: 사용자 지역 정보가 `users` 테이블에 저장됨

## 새로 추가된 컴포넌트

### `ProfileSetupContainer`
- 전체 프로필 설정 플로우를 관리하는 컨테이너 컴포넌트
- 기본 정보 → 지역 설정 → 완료 단계를 순차적으로 진행

### `LocationSetupForm`
- 지역 설정을 위한 폼 컴포넌트
- `src/utils/area.ts`의 지역 데이터를 사용
- 시/도 선택 시 해당 구/군 목록 자동 업데이트

## 데이터베이스 변경사항

`users` 테이블에 다음 컬럼이 추가되었습니다:

```sql
-- 시/도 정보
city TEXT

-- 구/군 정보  
district TEXT
```

## 마이그레이션 실행

### Supabase Dashboard에서 실행

1. Supabase 프로젝트의 SQL Editor로 이동
2. `src/lib/database/migrations/add_location_fields.sql` 파일의 내용을 복사
3. SQL Editor에 붙여넣고 실행

### 또는 직접 SQL 실행

```sql
-- Add city column
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS city TEXT;

-- Add district column
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS district TEXT;

-- Add comments for documentation
COMMENT ON COLUMN users.city IS 'User''s city/province (시/도)';
COMMENT ON COLUMN users.district IS 'User''s district/county (구/군)';

-- Create index for location-based queries
CREATE INDEX IF NOT EXISTS idx_users_location ON users(city, district) WHERE city IS NOT NULL AND district IS NOT NULL;
```

## 타입 정의 변경

### `ProfileFormData` 타입 업데이트

```typescript
interface ProfileFormData {
  name: string;
  phone: string;
  position: Position[];
  city?: City; // 새로 추가
  district?: Gu; // 새로 추가
  email?: string;
}
```

### `UserProfile` 타입 업데이트

```typescript
interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone: string;
  position: Position[];
  city?: City; // 새로 추가
  district?: Gu; // 새로 추가
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}
```

## 사용 방법

기존 `ProfileSetupForm`을 사용하던 곳에서 `ProfileSetupContainer`로 변경:

```typescript
// Before
import ProfileSetupForm from "@/components/profile/ProfileSetupForm";

// After  
import ProfileSetupContainer from "@/components/profile/ProfileSetupContainer";

// Usage
<ProfileSetupContainer onComplete={() => router.push("/dashboard")} />
```

## 지역 데이터 구조

`src/utils/area.ts`에서 관리되는 지역 데이터:

```typescript
// 시/도 타입
type City = "서울" | "경기" | "인천" | ...

// 구/군 타입  
type Gu = "강남구" | "강동구" | ...

// 지역 데이터 구조
const area = [
  {
    name: "서울",
    subArea: ["강남구", "강동구", ...]
  },
  ...
]
```

## 주요 기능

1. **진행률 표시**: 각 단계별 완성도를 시각적으로 표시
2. **유효성 검사**: 필수 지역 정보 입력 확인
3. **미리보기**: 선택된 지역 정보 실시간 표시
4. **건너뛰기 옵션**: 지역 설정을 나중에 할 수 있는 옵션 제공
5. **연쇄 선택**: 시/도 선택 시 구/군 목록 자동 업데이트

## 향후 활용 방안

- 지역 기반 팀 매칭
- 근처 풋살장 추천
- 지역 토너먼트 참가
- 팀 검색 필터링 