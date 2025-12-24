import { test, expect } from '@playwright/test';

test.describe('SEO and Feeds', () => {
  test('home page has proper meta tags', async ({ page }) => {
    await page.goto('/');

    // Check title
    await expect(page).toHaveTitle(/Beyond Writing Code/);

    // Check meta description
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBeTruthy();

    // Check Open Graph tags
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
    expect(ogTitle).toBeTruthy();

    const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
    expect(ogImage).toBeTruthy();
  });

  test('post detail page has proper meta tags', async ({ page }) => {
    await page.goto('/posts');
    await page.locator('.post-card h2 a').first().click();

    // Check that title includes post title
    const title = await page.title();
    expect(title).toContain('Beyond Writing Code');

    // Check meta description
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBeTruthy();
    expect(description!.length).toBeGreaterThan(0);

    // Check Open Graph type
    const ogType = await page.locator('meta[property="og:type"]').getAttribute('content');
    expect(ogType).toBe('article');
  });

  test('RSS feed is accessible', async ({ request }) => {
    const response = await request.get('/feed.xml');
    expect(response.ok()).toBeTruthy();
    expect(response.headers()['content-type']).toContain('xml');

    const body = await response.text();
    expect(body).toContain('<rss');
    expect(body).toContain('Beyond Writing Code');
  });

  test('RSS feed contains posts', async ({ request }) => {
    const response = await request.get('/feed.xml');
    const body = await response.text();

    // Check for items
    expect(body).toContain('<item>');
    expect(body).toContain('<title>');
    expect(body).toContain('<link>');
    expect(body).toContain('<pubDate>');
  });

  test('sitemap is accessible', async ({ request }) => {
    const response = await request.get('/sitemap-index.xml');
    expect(response.ok()).toBeTruthy();

    const body = await response.text();
    expect(body).toContain('<?xml');
    expect(body).toContain('sitemap');
  });

  test('canonical URLs are correct', async ({ page }) => {
    await page.goto('/about');

    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical).toContain('beyondwritingcode.com');
    expect(canonical).toContain('/about');
  });
});
