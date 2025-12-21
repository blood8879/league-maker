# 🔧 인증 문제 해결 - 단계별 가이드

## 문제 상황
- alert로 "사용자를 찾을 수 없습니다" 메시지가 뜸 (옛날 mock 코드)
- Supabase에 신규 유저 데이터가 안 들어감
- 브라우저가 여전히 옛날 캐시된 코드를 사용 중

---

## 🎯 1단계: Supabase 데이터베이스 확인 및 설정

### A. users 테이블 존재 여부 확인

1. **Supabase Dashboard 접속**
   - https://supabase.com/dashboard/project/qfjqqflkzkwyipimfpic

2. **SQL Editor로 이동**
   - 왼쪽 메뉴에서 "SQL Editor" 클릭

3. **CHECK_SUPABASE.sql 파일 내용 복사**
   - `CHECK_SUPABASE.sql` 파일 열기
   - 전체 내용 복사
   - SQL Editor에 붙여넣기
   - "Run" 버튼 클릭

4. **결과 확인**
   - `users_table_exists`가 `true`인지 확인
   - 만약 `false`라면 테이블을 만들어야 함

### B. users 테이블이 없는 경우 - 테이블 생성

1. **SQL Editor에서 새 쿼리 작성**

2. **`create-users-table.sql` 파일 내용 복사**
   - 전체 내용 복사
   - SQL Editor에 붙여넣기
   - "Run" 버튼 클릭

3. **성공 확인**
   - "Success. No rows returned" 메시지 확인

### C. 이메일 인증 비활성화 (필수!)

1. **Authentication 설정으로 이동**
   - 왼쪽 메뉴 "Authentication" 클릭
   - "Providers" 탭 클릭
   - "Email" 클릭

2. **이메일 인증 끄기**
   - "Confirm email" 토글을 **OFF**로 변경
   - "Save" 버튼 클릭

3. **확인**
   - 토글이 회색(OFF)인지 확인

---

## 🌐 2단계: 브라우저 캐시 완전 제거

### 옵션 A: 시크릿/프라이빗 모드 (가장 쉬움 - 추천!)

**Chrome:**
```
Ctrl + Shift + N (Windows/Linux)
Cmd + Shift + N (Mac)
```

**Firefox:**
```
Ctrl + Shift + P (Windows/Linux)
Cmd + Shift + P (Mac)
```

**Safari:**
```
Cmd + Shift + N (Mac)
```

시크릿 모드에서 http://localhost:3001 접속

### 옵션 B: 브라우저 캐시 완전 삭제

**Chrome:**
1. 개발자 도구 열기 (F12)
2. 우클릭 > "Empty Cache and Hard Reload" 선택
3. 또는: 설정 > 개인정보 보호 및 보안 > 인터넷 사용 기록 삭제
4. "캐시된 이미지 및 파일" 선택 후 삭제

**Firefox:**
1. Ctrl+Shift+Delete (Windows) / Cmd+Shift+Delete (Mac)
2. "캐시" 선택
3. "지금 지우기" 클릭

---

## 🧪 3단계: 새로운 코드로 회원가입 테스트

### 1. 시크릿 모드 브라우저에서:

```
http://localhost:3001/signup
```

### 2. F12로 개발자 도구 열기

### 3. Console 탭 확인

### 4. 회원가입 양식 작성
- 이메일: 새로운 이메일 (예: test123@test.com)
- 비밀번호: Test1234! (대문자, 소문자, 숫자 포함)
- 비밀번호 확인: Test1234!
- 닉네임: 테스터123
- 역할: 선수
- 선호 포지션: FW

### 5. "회원가입" 버튼 클릭

### 6. 콘솔 로그 확인

---

## ✅ 정상 작동 시 콘솔 로그

```
🔐 Starting signup process... {email: "test123@test.com", nickname: "테스터123"}
📧 Supabase Auth response: {user: "uuid-xxx-xxx", session: true, error: null}
💾 Creating user profile... {id: "uuid-xxx-xxx", email: "test123@test.com", ...}
✅ Profile created successfully: {id: "...", email: "...", nickname: "테스터123", ...}
👤 Fetching user profile... {userId: "uuid-xxx-xxx"}
📊 Profile fetch result: {data: {id: "...", email: "...", ...}, error: null}
✅ Profile loaded: {id: "...", email: "...", nickname: "테스터123", ...}
```

그리고 자동으로 `/dashboard`로 리다이렉트됩니다.

---

## ❌ 에러 발생 시

### 에러 A: "이메일 인증이 필요합니다"
```
⚠️ Email confirmation required. User created but not logged in.
```
**해결**: 1단계 C (이메일 인증 비활성화) 다시 확인

### 에러 B: 프로필 생성 실패
```
❌ Profile creation error: {message: "...", code: "..."}
```
**해결**:
1. RLS 정책 문제일 수 있음
2. Supabase SQL Editor에서:
```sql
-- RLS 정책 다시 생성
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;

CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT
  WITH CHECK (auth.uid() = id);
```

### 에러 C: 여전히 alert가 뜸
```
alert: "사용자를 찾을 수 없습니다..."
```
**해결**:
1. 개발 서버 재시작 필요
2. 터미널에서:
```bash
# Ctrl+C로 서버 종료
# 다시 시작
npm run dev
```
3. 브라우저 완전 종료 후 재시작
4. 시크릿 모드로 다시 접속

---

## 🔍 4단계: Supabase에서 데이터 확인

### 회원가입 성공 후:

1. **Supabase Dashboard > Table Editor**
2. **users 테이블 클릭**
3. **방금 가입한 이메일이 있는지 확인**

또는 SQL로:
```sql
SELECT * FROM public.users ORDER BY created_at DESC LIMIT 5;
```

---

## 📋 체크리스트

- [ ] Supabase users 테이블 존재 확인 (CHECK_SUPABASE.sql)
- [ ] users 테이블 없으면 생성 (create-users-table.sql)
- [ ] Supabase 이메일 인증 비활성화 (Confirm email OFF)
- [ ] 시크릿/프라이빗 모드로 브라우저 열기
- [ ] http://localhost:3001/signup 접속
- [ ] F12로 개발자 도구 > Console 탭
- [ ] 새로운 이메일로 회원가입
- [ ] 콘솔에서 🔐, 📧, 💾, ✅ 로그 확인
- [ ] Supabase Table Editor에서 데이터 확인

---

## 🆘 그래도 안 되면?

콘솔에 나오는 **전체 로그**를 복사해서 알려주세요:
- 🔐부터 시작하는 모든 로그
- ❌ 에러 메시지
- 스크린샷도 도움이 됩니다

특히:
1. `🔐 Starting signup process...` 로그가 **보이는지 안 보이는지**
2. alert가 뜨기 전에 콘솔에 무슨 로그가 있는지
3. Supabase Table Editor에서 auth.users 테이블에 데이터가 있는지
