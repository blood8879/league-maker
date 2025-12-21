# 인증 문제 디버깅 가이드

## 1️⃣ Supabase 이메일 인증 비활성화 (필수)

개발 중에는 이메일 인증을 비활성화하는 것이 좋습니다.

### 단계:
1. Supabase Dashboard 접속: https://supabase.com/dashboard/project/qfjqqflkzkwyipimfpic
2. **Authentication** → **Providers** → **Email** 클릭
3. **"Confirm email"** 토글을 **OFF**로 설정
4. **Save** 클릭

## 2️⃣ 데이터 확인하기

### Supabase Dashboard에서 확인:
1. **Table Editor** → **users** 테이블 확인
2. 회원가입한 이메일이 있는지 확인

### SQL로 확인:
```sql
-- Authentication 테이블 확인 (auth.users)
SELECT id, email, email_confirmed_at, created_at
FROM auth.users
ORDER BY created_at DESC;

-- Users 프로필 테이블 확인 (public.users)
SELECT id, email, nickname, role, preferred_position, created_at
FROM public.users
ORDER BY created_at DESC;

-- 불일치 확인 (Auth에는 있지만 Users 테이블에 없는 경우)
SELECT au.id, au.email, au.email_confirmed_at
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL;
```

## 3️⃣ 문제 해결 시나리오

### 시나리오 A: 이메일 인증 필요
**증상**: 회원가입 후 "이메일 인증이 필요합니다" 메시지
**해결**: 위의 1️⃣번 따라서 이메일 인증 비활성화

### 시나리오 B: 프로필이 생성되지 않음
**증상**: 로그인 시 "데이터를 찾을 수 없다" 에러
**원인**: auth.users에는 있지만 public.users에 프로필이 없음
**해결**:

```sql
-- 수동으로 프로필 생성 (아래의 값들을 실제 데이터로 교체)
INSERT INTO public.users (id, email, nickname, role, preferred_position)
VALUES (
  'USER_ID_FROM_AUTH_USERS',  -- auth.users 테이블의 id 복사
  'user@example.com',          -- 이메일
  'my_nickname',               -- 닉네임
  'player',                    -- 'player', 'coach', 'manager' 중 선택
  'FW'                         -- 'FW', 'MF', 'DF', 'GK' 중 선택 (player인 경우)
);
```

### 시나리오 C: RLS 정책 문제
**증상**: 프로필 생성 시 권한 에러
**해결**:

```sql
-- RLS 정책 다시 생성
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;

CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT
  WITH CHECK (auth.uid() = id);
```

## 4️⃣ 브라우저 콘솔 확인

1. 브라우저에서 F12 키로 개발자 도구 열기
2. **Console** 탭 확인
3. 회원가입 또는 로그인 시도
4. 다음과 같은 로그 확인:

```
🔐 Starting signup process...
📧 Supabase Auth response: { user: "...", session: true/false }
💾 Creating user profile...
✅ Profile created successfully
```

또는 로그인 시:
```
🔑 Starting login process...
🔓 Login response: { user: "...", session: true }
👤 Fetching user profile...
📊 Profile fetch result: { data: {...} }
✅ Profile loaded
```

### 에러가 있다면:
- ❌ 표시가 있는 로그 찾기
- 에러 메시지 복사해서 알려주세요

## 5️⃣ 테스트 순서

### 새로운 계정으로 테스트:
1. 브라우저 콘솔 열기 (F12)
2. http://localhost:3001/signup 접속
3. 새로운 이메일로 회원가입 시도
4. 콘솔에서 로그 확인
5. 성공하면 자동으로 대시보드로 이동
6. 실패하면 콘솔의 에러 메시지 확인

### 기존 계정으로 테스트:
1. Supabase Dashboard에서 users 테이블에 해당 이메일이 있는지 확인
2. 없다면 위의 시나리오 B 따라서 수동 생성
3. 있다면 로그인 시도
4. 콘솔에서 에러 확인

## 6️⃣ 완전히 초기화하고 다시 시작

```sql
-- 모든 사용자 데이터 삭제 (주의: 개발 환경에서만!)
DELETE FROM public.users;

-- Supabase Dashboard > Authentication > Users에서도 사용자 삭제
```

그 다음 새로 회원가입 시도
