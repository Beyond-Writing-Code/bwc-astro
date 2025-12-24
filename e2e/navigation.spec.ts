import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('home page loads successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Beyond Writing Code/);
    await expect(page.locator('h1')).toContainText('Humanity matters');
  });

  test('can navigate to About page', async ({ page }) => {
    await page.goto('/');
    await page.click('text=About');
    await expect(page).toHaveURL('/about');
    await expect(page.locator('h1')).toContainText('About Leaf');
  });

  test('can navigate to Book page', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Book');
    await expect(page).toHaveURL('/book');
    await expect(page.locator('h1')).toContainText('The book');
  });

  test('can navigate to Art page', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Art');
    await expect(page).toHaveURL('/art');
    await expect(page.locator('h1')).toContainText('Art');
  });

  test('can navigate to Posts page', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Posts');
    await expect(page).toHaveURL('/posts');
    await expect(page.locator('h1')).toContainText('Posts');
  });

  test('footer links are present', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('footer')).toBeVisible();
    await expect(page.locator('footer a[aria-label="Instagram"]')).toBeVisible();
    await expect(page.locator('footer a[aria-label="LinkedIn"]')).toBeVisible();
  });

  test('mobile menu works', async ({ page, isMobile }) => {
    if (!isMobile) {
      test.skip();
    }

    await page.goto('/');
    await page.click('.mobile-menu-toggle');
    await expect(page.locator('.site-nav')).toHaveClass(/nav-open/);
  });
});
