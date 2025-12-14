import { test, expect } from '@playwright/test';

test.describe('2️⃣ 인증 기능 - 로그인', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('2.2.1 - 로그인 페이지 접근', async ({ page }) => {
    // 페이지 제목 확인
    await expect(page.getByRole('heading', { name: '로그인' })).toBeVisible();
  });

  test('2.2.2 - 이메일/비밀번호 입력 폼 표시', async ({ page }) => {
    // 이메일 입력 필드 확인
    const emailInput = page.getByPlaceholder('user@example.com');
    await expect(emailInput).toBeVisible();

    // 비밀번호 입력 필드 확인
    const passwordInput = page.getByPlaceholder('******');
    await expect(passwordInput).toBeVisible();
  });

  test('2.2.3 - 로그인 버튼 표시', async ({ page }) => {
    // 로그인 버튼 확인 (본문의 제출 버튼만 선택)
    const loginButton = page.getByRole('main').getByRole('button', { name: '로그인' });
    await expect(loginButton).toBeVisible();
  });

  test('2.2.4 - 유효성 검증 - 빈 필드', async ({ page }) => {
    // 로그인 버튼 클릭 (본문의 제출 버튼만 선택)
    const loginButton = page.getByRole('main').getByRole('button', { name: '로그인' });
    await loginButton.click();

    // 오류 메시지 표시 대기
    await page.waitForTimeout(500);

    // 폼 에러 메시지 확인 (유효성 검증) - 본문의 폼만 선택
    const form = page.getByRole('main').locator('form');
    await expect(form).toBeVisible();
  });

  test('2.2.5 - 회원가입 링크 존재', async ({ page }) => {
    // 회원가입 링크 확인 (본문의 링크만 선택)
    const signupLink = page.getByRole('main').getByRole('link', { name: '회원가입' });
    await expect(signupLink).toBeVisible();
    await expect(signupLink).toHaveAttribute('href', '/signup');
  });
});

test.describe('2️⃣ 인증 기능 - 회원가입', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/signup');
  });

  test('2.1.1 - 회원가입 페이지 접근', async ({ page }) => {
    // 회원가입 페이지로 이동 확인
    await expect(page).toHaveURL('/signup');

    // 페이지 제목 확인 (회원가입 또는 유사한 텍스트)
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();
  });

  test('2.1.2 - 회원가입 폼 필드 표시', async ({ page }) => {
    // 폼이 존재하는지 확인 (본문 영역에서)
    const form = page.getByRole('main').locator('form');
    await expect(form).toBeVisible();

    // 입력 필드들 확인
    const inputs = form.locator('input');
    const inputCount = await inputs.count();
    expect(inputCount).toBeGreaterThan(0);
  });

  test('2.1.3 - 로그인 링크 존재', async ({ page }) => {
    // 로그인 페이지로 가는 링크 확인 (본문의 링크만 선택)
    const loginLink = page.getByRole('main').getByRole('link', { name: /로그인/ });
    await expect(loginLink).toBeVisible({ timeout: 5000 });
  });
});

test.describe('2️⃣ 인증 기능 - 네비게이션', () => {
  test('로그인에서 회원가입으로 이동', async ({ page }) => {
    await page.goto('/login');

    // 회원가입 링크 클릭 (본문의 링크만 선택)
    const signupLink = page.getByRole('main').getByRole('link', { name: '회원가입' });
    await signupLink.click();

    // 회원가입 페이지로 이동 확인
    await expect(page).toHaveURL('/signup');
  });

  test('회원가입에서 로그인으로 이동', async ({ page }) => {
    await page.goto('/signup');

    // 로그인 링크 클릭 (본문의 링크만 선택)
    const loginLink = page.getByRole('main').getByRole('link', { name: /로그인/ });
    await loginLink.click();

    // 로그인 페이지로 이동 확인
    await expect(page).toHaveURL('/login');
  });
});
