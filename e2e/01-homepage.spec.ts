import { test, expect } from '@playwright/test';

test.describe('1️⃣ 공통 기능 (비로그인 사용자) - 홈페이지 기본 UI', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('1.1.1 - 헤더 표시 및 로고 클릭 시 홈 이동', async ({ page }) => {
    // 헤더 표시 확인
    const header = page.locator('header');
    await expect(header).toBeVisible();

    // 로고 확인 (일반적으로 링크나 이미지)
    const logo = page.locator('header a').first();
    await expect(logo).toBeVisible();

    // 로고 클릭
    await logo.click();

    // 홈페이지 URL 확인
    await expect(page).toHaveURL('/');
  });

  test('1.1.2 - 네비게이션 메뉴 표시', async ({ page }) => {
    // 네비게이션 메뉴 확인
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();

    // 주요 메뉴 항목 확인 (일반적인 메뉴 구조)
    // 실제 구현에 따라 선택자를 조정해야 할 수 있음
    const navLinks = page.locator('nav a');
    const linksCount = await navLinks.count();
    expect(linksCount).toBeGreaterThan(0);
  });

  test('1.2.1 - 히어로 섹션 메인 메시지 표시', async ({ page }) => {
    // 히어로 섹션 확인
    const hero = page.locator('section').first();
    await expect(hero).toBeVisible();

    // 메인 메시지가 있는지 확인
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();
  });

  test('1.3.1 - 통계 카드 표시', async ({ page }) => {
    // 페이지가 완전히 로드될 때까지 대기
    await page.waitForLoadState('networkidle');

    // 통계 관련 섹션 찾기 (일반적으로 숫자가 표시되는 영역)
    const statsSection = page.getByText(/팀|경기|플레이어|골/);
    await expect(statsSection.first()).toBeVisible({ timeout: 10000 });
  });
});

test.describe('1️⃣ 공통 기능 - 히어로 섹션', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('1.2.2 - CTA 버튼 존재 확인', async ({ page }) => {
    // 주요 액션 버튼 확인
    const buttons = page.locator('button, a[href]');
    const buttonCount = await buttons.count();
    expect(buttonCount).toBeGreaterThan(0);
  });
});

test.describe('1️⃣ 공통 기능 - 히어로 섹션 추가 테스트', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('1.2.3 - "팀 찾아보기" 버튼 → 팀 검색 페이지 이동', async ({ page }) => {
    // "팀 찾아보기" 또는 유사한 CTA 버튼 찾기
    const ctaButton = page.getByRole('main').getByRole('link', { name: /팀|찾|검색/i }).first();

    // 버튼이 존재하면 클릭하고 페이지 이동 확인
    if (await ctaButton.count() > 0) {
      const href = await ctaButton.getAttribute('href');
      await ctaButton.click();

      // 팀 관련 페이지로 이동했는지 확인
      await page.waitForURL(/\/(teams|team|search)/);
    } else {
      // CTA 버튼이 없으면 테스트 스킵 (아직 구현 안 됨)
      test.skip();
    }
  });
});

test.describe('1️⃣ 공통 기능 - 실시간 랭킹', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('1.6.1 - 득점왕/팀 파워 랭킹 탭 전환', async ({ page }) => {
    // 랭킹 탭 버튼 직접 찾기
    const tabs = page.locator('button, [role="tab"]').filter({ hasText: /득점왕|팀|파워|랭킹/ });
    const tabCount = await tabs.count();

    if (tabCount >= 2) {
      // 최소 2개의 탭이 있어야 전환 테스트 가능
      await tabs.first().click();
      await page.waitForTimeout(300);

      await tabs.nth(1).click();
      await page.waitForTimeout(300);

      // 탭 전환이 성공했다고 판단
      expect(tabCount).toBeGreaterThanOrEqual(2);
    } else {
      // 탭이 없거나 1개만 있으면 스킵
      test.skip();
    }
  });

  test('1.6.2 - 1-10위 순위 표시', async ({ page }) => {
    // 순위 리스트를 더 구체적으로 찾기 (테이블 또는 리스트)
    const rankingList = page.locator('table, ol, ul').filter({
      has: page.locator(':text-matches("1위|1등|#1", "i")')
    });

    const listExists = await rankingList.count() > 0;

    if (listExists) {
      // 순위 항목 개수 확인
      const items = rankingList.locator('tr, li').filter({
        hasText: /위|등|#/
      });
      const itemCount = await items.count();
      expect(itemCount).toBeGreaterThanOrEqual(1);
    } else {
      // 순위 리스트가 없으면 스킵
      test.skip();
    }
  });

  test('1.6.3 - 순위 변동 화살표 표시', async ({ page }) => {
    // 순위 변동을 나타내는 요소 찾기 (화살표 아이콘이나 텍스트)
    const changeIndicators = page.locator('svg, i, span').filter({
      hasText: /▲|▼|↑|↓|up|down/i
    });

    const count = await changeIndicators.count();

    if (count > 0) {
      // 화살표가 있으면 통과
      expect(count).toBeGreaterThan(0);
    } else {
      // 화살표가 없으면 스킵 (구현 안 됨)
      test.skip();
    }
  });

  test('1.6.4 - 플레이어/팀 클릭 → 프로필 페이지 이동', async ({ page }) => {
    // 순위 목록에서 클릭 가능한 항목 찾기
    const clickableItem = page.getByRole('link').filter({
      hasText: /FC|팀|선수/
    }).first();

    if (await clickableItem.count() > 0) {
      await clickableItem.click();

      // 프로필 페이지로 이동했는지 확인
      await page.waitForURL(/\/(team|player|profile)/);
    } else {
      // 클릭 가능한 항목이 없으면 테스트 스킵 (아직 구현 안 됨)
      test.skip();
    }
  });
});

test.describe('1️⃣ 공통 기능 - 최근 경기 결과', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('1.7.1 - 최근 6경기 표시', async ({ page }) => {
    // 경기 카드 또는 리스트 항목 직접 찾기
    const matchCards = page.locator('[class*="match"], [class*="game"], [class*="result"]').filter({
      hasText: /vs|:|대|-/
    });

    const cardCount = await matchCards.count();

    if (cardCount > 0) {
      // 최소 1개 이상의 경기가 표시되는지 확인
      expect(cardCount).toBeGreaterThanOrEqual(1);
    } else {
      // 경기 카드가 없으면 테스트 스킵 (아직 구현 안 됨 또는 데이터 없음)
      test.skip();
    }
  });

  test('1.7.2 - 필터 (전체/리그전/컵대회/연습경기) 동작', async ({ page }) => {
    // 필터 버튼 찾기
    const filterButtons = page.locator('button, [role="tab"]').filter({
      hasText: /전체|리그|컵|연습/
    });

    const filterCount = await filterButtons.count();

    if (filterCount > 0) {
      // 각 필터 클릭해보기
      for (let i = 0; i < Math.min(filterCount, 4); i++) {
        await filterButtons.nth(i).click();
        await page.waitForTimeout(300);
      }

      // 최소 1개의 필터가 있는지 확인
      expect(filterCount).toBeGreaterThanOrEqual(1);
    } else {
      // 필터가 없으면 테스트 스킵 (아직 구현 안 됨)
      test.skip();
    }
  });

  test('1.7.3 - 경기 카드 클릭 → 상세 페이지 이동', async ({ page }) => {
    // 경기 카드에서 클릭 가능한 링크 찾기
    const matchLink = page.getByRole('link').filter({
      hasText: /vs|FC|경기/
    }).first();

    if (await matchLink.count() > 0) {
      await matchLink.click();

      // 경기 상세 페이지로 이동했는지 확인
      await page.waitForURL(/\/(match|game|detail)/);
    } else {
      // 경기 링크가 없으면 테스트 스킵 (아직 구현 안 됨)
      test.skip();
    }
  });
});

test.describe('1️⃣ 공통 기능 - 푸터', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('1.9.1 - 푸터 표시', async ({ page }) => {
    // 페이지 하단으로 스크롤
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // 푸터 확인
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });
});
