import { test, expect } from '@playwright/test';

test.describe('Blog Posts', () => {
  test('posts page shows list of posts', async ({ page }) => {
    await page.goto('/posts');

    // Check that posts are displayed
    const postCards = page.locator('.post-card');
    await expect(postCards.first()).toBeVisible();

    // Check that post cards have required elements
    await expect(postCards.first().locator('h2')).toBeVisible();
    await expect(postCards.first().locator('time')).toBeVisible();
  });

  test('can click on a post and view details', async ({ page }) => {
    await page.goto('/posts');

    // Click on first post
    const firstPostLink = page.locator('.post-card h2 a').first();
    const postTitle = await firstPostLink.textContent();
    await firstPostLink.click();

    // Verify we're on the post detail page
    await expect(page.locator('article.post-detail')).toBeVisible();
    await expect(page.locator('.post-title')).toContainText(postTitle || '');

    // Check that post content is visible
    await expect(page.locator('.post-content')).toBeVisible();
  });

  test('post detail page has proper URL structure', async ({ page }) => {
    await page.goto('/posts');

    // Click on first post
    await page.locator('.post-card h2 a').first().click();

    // Verify URL matches pattern /YYYY/MM/DD/slug
    const url = page.url();
    expect(url).toMatch(/\/\d{4}\/\d{2}\/\d{2}\/.+/);
  });

  test('post detail page has metadata', async ({ page }) => {
    await page.goto('/posts');
    await page.locator('.post-card h2 a').first().click();

    // Check for date
    await expect(page.locator('.post-meta time')).toBeVisible();

    // Check for categories (if present)
    const categories = page.locator('.post-categories');
    if (await categories.isVisible()) {
      await expect(categories.locator('.category').first()).toBeVisible();
    }
  });

  test('category pages work', async ({ page }) => {
    await page.goto('/posts');

    // Find and click on a category
    const categoryLink = page.locator('.post-categories a').first();
    if (await categoryLink.isVisible()) {
      const categoryName = await categoryLink.textContent();
      await categoryLink.click();

      // Verify we're on category page
      await expect(page.locator('main h1')).toContainText(categoryName || '');
      await expect(page.locator('.post-card').first()).toBeVisible();
    }
  });

  test('post content renders markdown properly', async ({ page }) => {
    await page.goto('/posts');
    await page.locator('.post-card h2 a').first().click();

    const postContent = page.locator('.post-content');

    // Check that common markdown elements render
    await expect(postContent.locator('p').first()).toBeVisible();

    // Images should be present (if any)
    const images = postContent.locator('img');
    if ((await images.count()) > 0) {
      await expect(images.first()).toBeVisible();
    }
  });
});
