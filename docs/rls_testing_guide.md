# RLS 테스트 및 검증 가이드

## 개요

이 문서는 League Maker 프로젝트의 Row Level Security (RLS) 정책을 체계적으로 테스트하고 검증하는 방법을 설명합니다.

## 테스트 프레임워크 구성 요소

### 1. 테스트 결과 저장 테이블

#### `rls_test_results`
- 모든 테스트 실행 결과를 저장
- 테스트 카테고리, 이름, 예상/실제 결과, 상태 추적
- 30일 후 자동 정리

#### `rls_test_scenarios`
- 재사용 가능한 테스트 시나리오 정의
- 역할별, 테이블별, 작업별 테스트 케이스

### 2. 핵심 테스트 함수들

#### `run_comprehensive_rls_tests()`
```sql
SELECT * FROM run_comprehensive_rls_tests();
```
- 모든 RLS 정책에 대한 종합적인 테스트 실행
- 팀 격리, 역할 권한, 멤버 관리, 경기 통계 테스트 포함
- 카테고리별 성공률 반환

#### `check_rls_policies_status()`
```sql
SELECT * FROM check_rls_policies_status();
```
- 모든 테이블의 RLS 활성화 상태 확인
- 테이블별 정책 개수 및 정책 이름 목록 제공

#### `check_rls_coverage()`
```sql
SELECT * FROM check_rls_coverage();
```
- CRUD 작업별 정책 커버리지 분석
- 누락된 정책에 대한 권장사항 제공
- 커버리지 점수 (0-100%) 계산

#### `scan_rls_vulnerabilities()`
```sql
SELECT * FROM scan_rls_vulnerabilities();
```
- 보안 취약점 자동 스캔
- 과도하게 관대한 정책, 누락된 인덱스, 복잡한 정책 식별
- 심각도별 분류 및 개선 권장사항

## 테스트 카테고리

### 1. 팀 기반 데이터 격리 테스트 (`team_isolation`)

**목적**: 팀 간 데이터 격리가 올바르게 작동하는지 확인

**테스트 케이스**:
- 사용자가 자신의 팀 데이터만 접근 가능
- 다른 팀 데이터 접근 차단
- 크로스 팀 멤버 조회 차단

### 2. 역할 기반 권한 테스트 (`role_permissions`)

**목적**: 역할 계층 시스템이 올바르게 작동하는지 확인

**테스트 케이스**:
- Owner > Manager > Captain > Member 계층 구조
- 각 역할별 허용/차단 작업 확인
- 자신보다 높은 역할에 대한 작업 차단

### 3. 멤버 관리 권한 테스트 (`member_management`)

**목적**: 멤버 초대, 역할 변경, 제거 권한이 올바르게 작동하는지 확인

**테스트 케이스**:
- 멤버 초대 권한 (Captain+ 권한)
- 역할 변경 권한 (Manager+ 권한, 계층적 제한)
- 멤버 제거 권한 (상위 역할만)
- 자기 자신 역할 변경 차단

### 4. 경기 및 통계 접근 테스트 (`match_stats`)

**목적**: 경기 관리 및 통계 입력 권한이 올바르게 작동하는지 확인

**테스트 케이스**:
- 경기 생성/수정 권한 (Captain+ 권한)
- 통계 입력 권한 (Captain+ 권한)
- 일반 멤버의 제한된 접근

## 성능 모니터링

### `analyze_rls_performance()`
```sql
SELECT * FROM analyze_rls_performance() 
WHERE performance_rating != 'GOOD';
```

**성능 등급**:
- `GOOD`: 단순한 정책, 빠른 실행
- `MODERATE`: 중간 복잡도, 적당한 성능
- `NEEDS_OPTIMIZATION`: 복잡한 정책, 최적화 필요

### 성능 최적화 권장사항

1. **인덱스 추가**:
   ```sql
   CREATE INDEX idx_team_members_user_team ON team_members(user_id, team_id);
   CREATE INDEX idx_team_members_team_role ON team_members(team_id, role);
   ```

2. **정책 단순화**: 복잡한 서브쿼리를 함수로 분리
3. **캐싱 활용**: 자주 사용되는 권한 검사 결과 캐싱

## 보안 취약점 관리

### 심각도별 대응

#### HIGH (높음)
- **과도하게 관대한 정책**: 즉시 수정 필요
- 예: `WHERE true` 또는 `WHERE 1=1` 조건

#### MEDIUM (중간)
- **누락된 인덱스**: 성능 영향, 계획적 개선
- **복잡한 정책**: 리팩토링 고려

#### LOW (낮음)
- **정책 문서화 부족**: 주석 및 문서 개선

## 정기 검증 절차

### 일일 검증
```sql
-- 빠른 상태 확인
SELECT * FROM run_quick_rls_test();
```

### 주간 검증
```sql
-- 커버리지 확인
SELECT * FROM check_rls_coverage();

-- 취약점 스캔
SELECT * FROM scan_rls_vulnerabilities() 
WHERE severity IN ('HIGH', 'MEDIUM');
```

### 월간 검증
```sql
-- 종합 테스트 실행
SELECT * FROM run_comprehensive_rls_tests();

-- 성능 분석
SELECT * FROM analyze_rls_performance();
```

## 테스트 데이터 관리

### 테스트 데이터 정리
```sql
SELECT cleanup_test_data();
```

### 테스트 환경 설정
1. 테스트용 사용자 계정 생성
2. 테스트용 팀 및 멤버십 설정
3. 격리된 테스트 환경 구성

## 문제 해결 가이드

### 일반적인 문제들

1. **테스트 실패 시**:
   - 에러 메시지 확인
   - 정책 조건 재검토
   - 권한 함수 동작 확인

2. **성능 저하 시**:
   - 복잡한 정책 식별
   - 인덱스 추가 고려
   - 쿼리 실행 계획 분석

3. **보안 취약점 발견 시**:
   - 즉시 정책 수정
   - 영향 범위 분석
   - 감사 로그 확인

## 모범 사례

1. **정기적인 테스트 실행**: CI/CD 파이프라인에 통합
2. **문서화**: 모든 정책에 대한 명확한 설명
3. **모니터링**: 성능 및 보안 지표 추적
4. **버전 관리**: 정책 변경 사항 추적
5. **교육**: 팀원들의 RLS 이해도 향상

## 참고 자료

- [Supabase RLS 공식 문서](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL RLS 문서](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- 프로젝트 내 RLS 정책 파일들: `sql/` 디렉토리 