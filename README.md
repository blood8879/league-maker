# League Maker

풋살 리그 관리 플랫폼 - Next.js 기반 웹 애플리케이션

## 프로젝트 구조

```
league-maker/
├── PRD.md                 # Product Requirements Document
├── SPEC.md                # Technical Specification
├── TEST_e2e.md            # E2E Test Documentation
├── src/                   # Next.js 소스 코드
├── public/                # 정적 파일
├── e2e/                   # E2E 테스트
└── components.json        # shadcn/ui 설정
```

## 기술 스택

- **Framework**: Next.js 15
- **Language**: TypeScript
- **UI**: shadcn/ui (Radix UI + Tailwind CSS)
- **Testing**: Playwright
- **Backend**: Supabase (예정)

## 시작하기

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# E2E 테스트
npm run test:e2e
```

## 주요 기능

- 팀 관리 및 검색
- 경기 생성 및 실시간 기록
- 리그 및 순위 관리
- 대시보드 및 통계
- 용병 모집 커뮤니티

## 개발 문서

- [PRD.md](./PRD.md) - 제품 요구사항 명세
- [SPEC.md](./SPEC.md) - 기술 명세서
- [TEST_e2e.md](./TEST_e2e.md) - E2E 테스트 문서
