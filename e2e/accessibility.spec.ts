import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const pages = [
  { url: '/', name: 'Home' },
  { url: '/about', name: 'About' },
  { url: '/posts', name: 'Posts' },
  { url: '/book', name: 'Book' },
  { url: '/art', name: 'Art' },
  { url: '/resume', name: 'Resume' },
  { url: '/recommend', name: 'Recommendations' },
  { url: '/contact', name: 'Contact' },
];

test.describe('Accessibility', () => {
  pages.forEach(({ url, name }) => {
    test(`${name} page should not have accessibility violations`, async ({ page }) => {
      await page.goto(url);

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  test('Blog post detail page should not have accessibility violations', async ({ page }) => {
    // Navigate to posts page and click first post
    await page.goto('/posts');
    const firstPostLink = page.locator('.post-card a').first();
    await firstPostLink.click();

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Category page should not have accessibility violations', async ({ page }) => {
    // Navigate to posts page and click first category
    await page.goto('/posts');
    const firstCategory = page.locator('.category').first();

    if ((await firstCategory.count()) > 0) {
      await firstCategory.click();

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    } else {
      test.skip();
    }
  });
});
