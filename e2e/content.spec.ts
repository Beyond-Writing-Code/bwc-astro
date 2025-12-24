import { test, expect } from '@playwright/test';

test.describe('Content Visibility', () => {
  test('post content is in HTML source (not JavaScript-rendered)', async ({ page }) => {
    await page.goto('/posts');
    await page.locator('.post-card h2 a').first().click();

    // Get the page source
    const content = await page.content();

    // Verify that actual post content is in the HTML source
    // This is critical for Medium import, Substack import, etc.
    expect(content).toContain('class="post-content"');
    expect(content).toContain('class="post-detail"');

    // Content should have actual paragraphs, not just placeholders
    const paragraphMatches = content.match(/<p[^>]*>/g);
    expect(paragraphMatches).toBeTruthy();
    expect(paragraphMatches!.length).toBeGreaterThan(0);
  });

  test('images are in HTML source', async ({ page }) => {
    await page.goto('/posts');

    // Get the page source
    const content = await page.content();

    // Check that images are present in source
    const imgMatches = content.match(/<img[^>]+src="[^"]*"/g);
    expect(imgMatches).toBeTruthy();
    expect(imgMatches!.length).toBeGreaterThan(0);
  });

  test('home page content is immediately visible', async ({ page }) => {
    await page.goto('/');

    // Content should be visible without JavaScript
    await expect(page.locator('main h1')).toBeVisible();
    await expect(page.locator('.intro')).toBeVisible();
    await expect(page.locator('.cta')).toBeVisible();
  });

  test('newsletter form container is present', async ({ page }) => {
    await page.goto('/');

    // Kit form container should be present (React island)
    await expect(page.locator('.home-signup-form')).toBeAttached({ timeout: 10000 });
  });

  test('about page images load', async ({ page }) => {
    await page.goto('/about');

    // Profile photo should be visible
    const profilePhoto = page.locator('img[alt*="Leaf"]').first();
    await expect(profilePhoto).toBeVisible();

    // Check that image has loaded
    await expect(profilePhoto).toHaveJSProperty('complete', true);
  });

  test('art gallery images load', async ({ page }) => {
    await page.goto('/art');

    // Creature images should be visible
    const images = page.locator('.creature-gallery img, .creature-image');
    await expect(images.first()).toBeVisible();

    // Check that at least 3 images are present
    expect(await images.count()).toBeGreaterThanOrEqual(3);
  });
});
