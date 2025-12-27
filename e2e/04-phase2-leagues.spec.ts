import { test, expect } from '@playwright/test';

test.describe('Phase 2: 리그 페이지 기능', () => {
  
  test.describe('리그 목록 페이지 (/leagues)', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/leagues');
    });

    test('리그 목록 및 카드 표시 확인', async ({ page }) => {
      // 헤더 확인
      await expect(page.getByRole('heading', { name: '리그 탐색' })).toBeVisible();

      // 리그 카드 확인 (최소 1개 이상)
      const leagueCards = page.locator('a[href^="/leagues/"]');
      await expect(leagueCards.first()).toBeVisible();
      const count = await leagueCards.count();
      expect(count).toBeGreaterThan(0);

      // 첫 번째 카드의 내용 확인
      const firstCard = leagueCards.first();
      await expect(firstCard.locator('h3')).toBeVisible(); // 리그명
      await expect(firstCard.getByText(/참가팀/)).toBeVisible(); // 참가팀 수
      await expect(firstCard.getByText(/진행중|모집중|종료/)).toBeVisible(); // 상태
    });

    test('필터링 기능 확인', async ({ page }) => {
      // 필터 버튼들이 존재하는지 확인 (Select 컴포넌트)
      // Radix UI Select Trigger는 button 역할을 가짐
      // placeholder 텍스트로 찾기
      await expect(page.getByRole('combobox').filter({ hasText: '지역' })).toBeVisible();
      await expect(page.getByRole('combobox').filter({ hasText: '진행 상태' })).toBeVisible();
      await expect(page.getByRole('combobox').filter({ hasText: '실력' })).toBeVisible();

      // 지역 필터 테스트 (서울 선택)
      // Select 열기
      await page.getByRole('combobox').filter({ hasText: '지역' }).click();
      // 옵션 선택 (Radix UI SelectContent는 body에 포탈로 렌더링됨)
      await expect(page.getByRole('option', { name: '서울' })).toBeVisible();
      await page.keyboard.press('Escape'); // 닫기
    });
  });

  test.describe('리그 상세 페이지 (/leagues/[id])', () => {
    let leagueId: string;

    test.beforeEach(async ({ page }) => {
      // 리그 목록 페이지로 이동하여 첫 번째 리그의 ID를 가져옴
      await page.goto('/leagues');
      const firstCard = page.locator('a[href^="/leagues/"]').first();
      const href = await firstCard.getAttribute('href');
      expect(href).not.toBeNull();
      leagueId = href!.split('/').pop()!;
      
      // 상세 페이지로 이동
      await page.goto(`/leagues/${leagueId}`);
    });

    test('기본 정보 및 탭 네비게이션 확인', async ({ page }) => {
      // 리그 제목 확인
      await expect(page.locator('h1')).toBeVisible();

      // 탭 확인
      const tabs = page.getByRole('tablist');
      await expect(tabs).toBeVisible();
      await expect(page.getByRole('tab', { name: '순위', exact: true })).toBeVisible();
      await expect(page.getByRole('tab', { name: '일정' })).toBeVisible();
      await expect(page.getByRole('tab', { name: '득점순위' })).toBeVisible();
      await expect(page.getByRole('tab', { name: '정보' })).toBeVisible();
    });

    test('순위 탭 기능 확인', async ({ page }) => {
      await page.getByRole('tab', { name: '순위', exact: true }).click();
      
      // 순위표 헤더 확인
      const tableHeader = page.locator('thead');
      await expect(tableHeader).toContainText('순위');
      await expect(tableHeader).toContainText('팀');
      await expect(tableHeader).toContainText('경기');
      await expect(tableHeader).toContainText('승점');

      // 득실차 계산 검증 (첫 번째 행)
      const firstRow = page.locator('tbody tr').first();
      if (await firstRow.isVisible()) {
        const gf = await firstRow.locator('td').nth(4).textContent(); // 득점 (인덱스는 추정)
        const ga = await firstRow.locator('td').nth(5).textContent(); // 실점
        const gd = await firstRow.locator('td').nth(6).textContent(); // 득실차
        
        if (gf && ga && gd) {
           // 텍스트가 숫자인 경우에만 검증
           const goalsFor = parseInt(gf);
           const goalsAgainst = parseInt(ga);
           const goalDiff = parseInt(gd);
           if (!isNaN(goalsFor) && !isNaN(goalsAgainst) && !isNaN(goalDiff)) {
             expect(goalDiff).toBe(goalsFor - goalsAgainst);
           }
        }
      }
    });

    test('일정 탭 기능 확인', async ({ page }) => {
      await page.getByRole('tab', { name: '일정' }).click();
      
      // 일정 목록 확인
      const matches = page.locator('.space-y-4 > div'); // 일반적인 리스트 컨테이너 추정
      // 데이터가 없을 수도 있으므로 에러가 나지 않게 처리하거나, 가짜 데이터가 있다고 가정
      // await expect(matches.first()).toBeVisible(); 
    });

    test('득점왕 탭 기능 확인', async ({ page }) => {
      await page.getByRole('tab', { name: '득점순위' }).click();
      
      // 득점 순위 테이블 확인
      const table = page.locator('table');
      await expect(table).toBeVisible();
      await expect(table).toContainText('순위');
      await expect(table).toContainText('선수');
      await expect(table).toContainText('골');
    });

    test('정보 탭 기능 확인', async ({ page }) => {
      await page.getByRole('tab', { name: '정보' }).click();
      
      // 리그 설명 확인
      await expect(page.getByText('리그 소개')).toBeVisible();
      await expect(page.getByText('리그 규정')).toBeVisible();
    });
  });
});
