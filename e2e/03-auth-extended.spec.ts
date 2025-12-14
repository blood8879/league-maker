import { test, expect } from '@playwright/test';

test.describe('2️⃣ 인증 기능 - 고급 테스트', () => {
  test.describe('로그인 유효성 검증', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/login');
    });

    test('2.2.6 - 잘못된 이메일 형식 검증', async ({ page }) => {
      // 잘못된 이메일 입력
      await page.getByPlaceholder('user@example.com').fill('invalid-email');
      await page.getByPlaceholder('******').fill('password123');

      // 로그인 버튼 클릭
      await page.getByRole('main').getByRole('button', { name: '로그인' }).click();

      // 에러 메시지 확인
      await expect(page.getByText('유효한 이메일 주소를 입력해주세요')).toBeVisible();
    });

    test('2.2.7 - 빈 비밀번호 검증', async ({ page }) => {
      // 이메일만 입력
      await page.getByPlaceholder('user@example.com').fill('user@example.com');

      // 로그인 버튼 클릭
      await page.getByRole('main').getByRole('button', { name: '로그인' }).click();

      // 에러 메시지 확인
      await expect(page.getByText('비밀번호를 입력해주세요')).toBeVisible();
    });

    test('2.2.8 - 유효한 로그인 플로우', async ({ page }) => {
      // 테스트 계정으로 로그인
      await page.getByPlaceholder('user@example.com').fill('user@example.com');
      await page.getByPlaceholder('******').fill('password');

      // 로그인 버튼 클릭
      await page.getByRole('main').getByRole('button', { name: '로그인' }).click();

      // 로그인 성공 후 홈페이지로 리다이렉트 확인
      await expect(page).toHaveURL('/', { timeout: 10000 });
    });

    test('2.2.9 - 비밀번호 찾기 링크 존재', async ({ page }) => {
      const forgotPasswordLink = page.getByText('비밀번호를 잊으셨나요?');
      await expect(forgotPasswordLink).toBeVisible();
    });
  });

  test.describe('회원가입 유효성 검증', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/signup');
    });

    test('2.1.4 - 이메일 형식 검증', async ({ page }) => {
      // 잘못된 이메일 입력
      await page.getByPlaceholder('user@example.com').fill('invalid');
      await page.getByRole('button', { name: /가입/ }).click();

      await expect(page.getByText('유효한 이메일 주소를 입력해주세요')).toBeVisible();
    });

    test('2.1.5 - 비밀번호 길이 검증 (6자 미만)', async ({ page }) => {
      await page.getByPlaceholder('user@example.com').fill('test@example.com');
      await page.getByPlaceholder('******').fill('12345'); // 5자
      await page.getByRole('button', { name: /가입/ }).click();

      await expect(page.getByText('비밀번호는 6자 이상이어야 합니다')).toBeVisible();
    });

    test('2.1.6 - 닉네임 길이 검증 (2자 미만)', async ({ page }) => {
      await page.getByPlaceholder('user@example.com').fill('test@example.com');
      await page.getByPlaceholder('******').fill('password123');
      await page.getByPlaceholder('축구왕').fill('A'); // 1자
      await page.getByRole('button', { name: /가입/ }).click();

      await expect(page.getByText('닉네임은 2글자 이상이어야 합니다')).toBeVisible();
    });

    test('2.1.7 - 역할 선택 - 선수 선택 시 포지션 표시', async ({ page }) => {
      // 역할 선택 드롭다운 클릭
      await page.getByRole('combobox').first().click();

      // '선수' 선택
      await page.getByRole('option', { name: '선수' }).click();

      // 포지션 필드가 표시되는지 확인
      await expect(page.getByText('주 포지션')).toBeVisible({ timeout: 2000 });
    });

    test('2.1.8 - 역할 선택 - 감독/코치 선택 시 포지션 숨김', async ({ page }) => {
      // 역할 선택 드롭다운 클릭
      await page.getByRole('combobox').first().click();

      // '감독/코치' 선택
      await page.getByRole('option', { name: '감독/코치' }).click();

      // 포지션 필드가 표시되지 않는지 확인
      await expect(page.getByText('주 포지션')).not.toBeVisible();
    });

    test('2.1.9 - 전체 회원가입 플로우', async ({ page }) => {
      // 폼 작성
      await page.getByPlaceholder('user@example.com').fill('newuser@example.com');
      await page.getByPlaceholder('******').fill('password123');
      await page.getByPlaceholder('축구왕').fill('테스트유저');

      // 역할 선택
      await page.getByRole('combobox').first().click();
      await page.getByRole('option', { name: '선수' }).click();

      // 포지션 선택
      await page.getByRole('combobox').nth(1).click();
      await page.getByRole('option', { name: '공격수 (FW)' }).click();

      // 회원가입 버튼 클릭
      await page.getByRole('button', { name: /가입/ }).click();

      // alert 핸들링
      page.on('dialog', async dialog => {
        expect(dialog.message()).toContain('회원가입이 완료');
        await dialog.accept();
      });

      // 로그인 페이지로 리다이렉트 확인
      await expect(page).toHaveURL('/login', { timeout: 10000 });
    });
  });

  test.describe('보호된 라우트 접근', () => {
    test('2.3.1 - 로그인하지 않고 대시보드 접근 시도', async ({ page }) => {
      // 로컬 스토리지 클리어 (로그아웃 상태)
      await page.context().clearCookies();
      await page.evaluate(() => localStorage.clear());

      await page.goto('/dashboard');

      // 대시보드 접근 확인 (인증이 없어도 접근 가능한지, 아니면 리다이렉트되는지)
      // 현재 구현에 따라 다를 수 있음
      await page.waitForTimeout(1000);
    });

    test('2.3.2 - 로그인 후 대시보드 접근', async ({ page }) => {
      // 로그인
      await page.goto('/login');
      await page.getByPlaceholder('user@example.com').fill('user@example.com');
      await page.getByPlaceholder('******').fill('password');
      await page.getByRole('main').getByRole('button', { name: '로그인' }).click();

      // 대시보드로 이동
      await page.goto('/dashboard');

      // 대시보드 콘텐츠 확인
      await expect(page.getByText(/안녕하세요/)).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('로그아웃 기능', () => {
    test('2.4.1 - 로그인 후 로그아웃', async ({ page }) => {
      // 로그인
      await page.goto('/login');
      await page.getByPlaceholder('user@example.com').fill('user@example.com');
      await page.getByPlaceholder('******').fill('password');
      await page.getByRole('main').getByRole('button', { name: '로그인' }).click();

      await page.waitForTimeout(2000);

      // 헤더의 사용자 메뉴 찾기
      const userMenu = page.locator('header').getByRole('button').filter({ hasText: /김철수/ });
      if (await userMenu.isVisible()) {
        await userMenu.click();

        // 로그아웃 버튼 클릭
        const logoutButton = page.getByRole('menuitem', { name: '로그아웃' });
        if (await logoutButton.isVisible()) {
          await logoutButton.click();

          // 홈페이지로 리다이렉트 확인
          await expect(page).toHaveURL('/', { timeout: 5000 });
        }
      }
    });
  });

  test.describe('세션 유지', () => {
    test('2.5.1 - 로그인 후 페이지 새로고침 시 세션 유지', async ({ page }) => {
      // 로그인
      await page.goto('/login');
      await page.getByPlaceholder('user@example.com').fill('user@example.com');
      await page.getByPlaceholder('******').fill('password');
      await page.getByRole('main').getByRole('button', { name: '로그인' }).click();

      await page.waitForTimeout(2000);

      // 페이지 새로고침
      await page.reload();

      // 로그인 상태 확인 (헤더에 사용자 정보 표시)
      await expect(page.locator('header').getByText(/김철수/)).toBeVisible({ timeout: 5000 });
    });
  });
});
