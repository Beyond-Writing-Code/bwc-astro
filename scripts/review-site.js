#!/usr/bin/env node

/**
 * Site Review Script using Puppeteer
 * Crawls the site and checks for common issues
 */

/* global document */

import puppeteer from 'puppeteer';
import { writeFileSync } from 'fs';

const BASE_URL = process.argv[2] || 'http://localhost:4321';
const MAX_PAGES = 50; // Limit crawling
const IGNORE_EXTENSIONS = [
  '.pdf',
  '.jpg',
  '.png',
  '.gif',
  '.webp',
  '.svg',
  '.ico',
  '.woff',
  '.woff2',
];

const visited = new Set();
const issues = [];
const toVisit = ['/'];

/**
 * Check if URL should be crawled
 */
function shouldCrawl(url) {
  try {
    const parsed = new URL(url, BASE_URL);

    // Only crawl same origin
    if (!parsed.href.startsWith(BASE_URL)) return false;

    // Skip file extensions
    if (IGNORE_EXTENSIONS.some((ext) => parsed.pathname.endsWith(ext))) return false;

    // Skip already visited
    const path = parsed.pathname + parsed.search;
    if (visited.has(path)) return false;

    return true;
  } catch {
    return false;
  }
}

/**
 * Extract links from page
 */
async function extractLinks(page) {
  return page.evaluate(() => {
    return Array.from(document.querySelectorAll('a[href]'))
      .map((a) => a.href)
      .filter(Boolean);
  });
}

/**
 * Check for common problems from COMMON_PROBLEMS.md
 */
async function checkCommonProblems(page, url) {
  const pageIssues = [];

  // Check Posts page for required content
  if (url.includes('/posts')) {
    const hasIntroText = await page.evaluate(() => {
      const text = document.body.textContent;
      return text.includes('Sign up for my mailing list to not miss anything');
    });

    if (!hasIntroText) {
      pageIssues.push({
        type: 'content',
        severity: 'high',
        page: url,
        message: 'Posts page missing intro text at top',
      });
    }

    const hasCrosspostText = await page.evaluate(() => {
      const text = document.body.textContent;
      return text.includes('How does Leaf cross-post these blog posts');
    });

    if (!hasCrosspostText) {
      pageIssues.push({
        type: 'content',
        severity: 'high',
        page: url,
        message: 'Posts page missing cross-posting instructions at bottom',
      });
    }
  }

  // Check for Kit.com forms on pages that should have them
  const shouldHaveForm = url === '/' || url.includes('/newsletter') || url.includes('/book');
  if (shouldHaveForm) {
    const hasKitForm = await page.evaluate(() => {
      // Check for Kit.com iframe or script
      return !!(
        document.querySelector('iframe[src*="kit.com"]') ||
        document.querySelector('script[src*="kit.com"]') ||
        document.querySelector('[data-uid]')
      );
    });

    if (!hasKitForm) {
      pageIssues.push({
        type: 'content',
        severity: 'high',
        page: url,
        message: 'Kit.com newsletter form missing',
      });
    }
  }

  return pageIssues;
}

/**
 * Check for accessibility issues on page
 */
async function checkAccessibility(page, url) {
  const pageIssues = [];

  // Check for images without alt text
  const imagesWithoutAlt = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('img'))
      .filter((img) => !img.alt || img.alt.trim() === '')
      .map((img) => img.src);
  });

  if (imagesWithoutAlt.length > 0) {
    pageIssues.push({
      type: 'accessibility',
      severity: 'high',
      page: url,
      message: `${imagesWithoutAlt.length} image(s) missing alt text`,
      details: imagesWithoutAlt.slice(0, 5), // Show first 5
    });
  }

  // Check for links without accessible text
  const linksWithoutText = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a'))
      .filter((a) => {
        const text = a.textContent.trim();
        const ariaLabel = a.getAttribute('aria-label');
        const title = a.getAttribute('title');
        return !text && !ariaLabel && !title && !a.querySelector('img[alt]');
      })
      .map((a) => a.href);
  });

  if (linksWithoutText.length > 0) {
    pageIssues.push({
      type: 'accessibility',
      severity: 'high',
      page: url,
      message: `${linksWithoutText.length} link(s) without accessible text`,
      details: linksWithoutText.slice(0, 5),
    });
  }

  // Check for missing page title
  const title = await page.title();
  if (!title || title.trim() === '') {
    pageIssues.push({
      type: 'seo',
      severity: 'high',
      page: url,
      message: 'Page missing title tag',
    });
  }

  // Check for missing meta description
  const hasDescription = await page.evaluate(() => {
    const meta = document.querySelector('meta[name="description"]');
    return meta && meta.content && meta.content.trim() !== '';
  });

  if (!hasDescription) {
    pageIssues.push({
      type: 'seo',
      severity: 'medium',
      page: url,
      message: 'Page missing meta description',
    });
  }

  // Check for external links without rel="noopener noreferrer"
  const unsafeExternalLinks = await page.evaluate((baseUrl) => {
    return Array.from(document.querySelectorAll('a[target="_blank"]'))
      .filter((a) => {
        const href = a.href;
        if (!href || href.startsWith(baseUrl)) return false;
        const rel = a.getAttribute('rel') || '';
        return !rel.includes('noopener') || !rel.includes('noreferrer');
      })
      .map((a) => a.href);
  }, BASE_URL);

  if (unsafeExternalLinks.length > 0) {
    pageIssues.push({
      type: 'security',
      severity: 'medium',
      page: url,
      message: `${unsafeExternalLinks.length} external link(s) missing rel="noopener noreferrer"`,
      details: unsafeExternalLinks.slice(0, 5),
    });
  }

  return pageIssues;
}

/**
 * Check a single page
 */
async function checkPage(browser, path) {
  const url = new URL(path, BASE_URL).href;
  console.log(`Checking: ${path}`);

  const page = await browser.newPage();

  // Collect console errors
  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      const text = msg.text();

      // Filter out known extension errors
      const extensionPatterns = [
        'CSP.js',
        'DocumentCSP.js',
        'staticNS.js',
        'content.js',
        "Identifier 'CSP' has already been declared",
        "Identifier 'DocumentCSP' has already been declared",
        "Identifier 'FILE_OR_FTP' has already been declared",
      ];

      if (!extensionPatterns.some((pattern) => text.includes(pattern))) {
        consoleErrors.push(text);
      }
    }
  });

  try {
    // Navigate to page
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    // Check for common problems
    const commonProblems = await checkCommonProblems(page, path);
    issues.push(...commonProblems);

    // Check for issues
    const accessibilityIssues = await checkAccessibility(page, path);
    issues.push(...accessibilityIssues);

    // Add console errors if any
    if (consoleErrors.length > 0) {
      issues.push({
        type: 'javascript',
        severity: 'high',
        page: path,
        message: `${consoleErrors.length} console error(s)`,
        details: consoleErrors,
      });
    }

    // Extract links for crawling
    const links = await extractLinks(page);
    for (const link of links) {
      if (shouldCrawl(link)) {
        const parsed = new URL(link, BASE_URL);
        const linkPath = parsed.pathname + parsed.search;
        if (!visited.has(linkPath) && !toVisit.includes(linkPath)) {
          toVisit.push(linkPath);
        }
      }
    }
  } catch (error) {
    issues.push({
      type: 'error',
      severity: 'high',
      page: path,
      message: `Failed to load page: ${error.message}`,
    });
  } finally {
    await page.close();
  }
}

/**
 * Generate markdown report
 */
function generateReport() {
  const now = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });

  let report = `# Site Review Report\n\n`;
  report += `**Last checked:** ${now}\n`;
  report += `**URL:** ${BASE_URL}\n\n`;
  report += `**Pages checked:** ${visited.size}\n\n`;

  if (issues.length === 0) {
    report += `✅ No issues found!\n`;
    return report;
  }

  report += `**Total issues:** ${issues.length}\n\n`;

  // Group by severity
  const critical = issues.filter((i) => i.severity === 'critical');
  const high = issues.filter((i) => i.severity === 'high');
  const medium = issues.filter((i) => i.severity === 'medium');
  const low = issues.filter((i) => i.severity === 'low');

  if (critical.length > 0) {
    report += `## 🚨 Critical Issues (${critical.length})\n\n`;
    critical.forEach((issue) => {
      report += formatIssue(issue);
    });
  }

  if (high.length > 0) {
    report += `## ❌ High Priority (${high.length})\n\n`;
    high.forEach((issue) => {
      report += formatIssue(issue);
    });
  }

  if (medium.length > 0) {
    report += `## ⚠️ Medium Priority (${medium.length})\n\n`;
    medium.forEach((issue) => {
      report += formatIssue(issue);
    });
  }

  if (low.length > 0) {
    report += `## ℹ️ Low Priority (${low.length})\n\n`;
    low.forEach((issue) => {
      report += formatIssue(issue);
    });
  }

  return report;
}

/**
 * Format a single issue
 */
function formatIssue(issue) {
  let text = `### ${issue.page}\n\n`;
  text += `**Type:** ${issue.type}\n\n`;
  text += `**Issue:** ${issue.message}\n\n`;

  if (issue.details && issue.details.length > 0) {
    text += `**Details:**\n`;
    issue.details.forEach((detail) => {
      text += `- ${detail}\n`;
    });
    text += `\n`;
  }

  return text;
}

/**
 * Main function
 */
async function main() {
  console.log(`Starting site review: ${BASE_URL}`);
  console.log(`Max pages: ${MAX_PAGES}\n`);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    while (toVisit.length > 0 && visited.size < MAX_PAGES) {
      const path = toVisit.shift();
      if (visited.has(path)) continue;

      visited.add(path);
      await checkPage(browser, path);
    }

    // Generate report
    const report = generateReport();
    console.log('\n' + report);

    // Write to file
    writeFileSync('REVIEW_ISSUES.md', report);
    console.log('\nReport written to REVIEW_ISSUES.md');

    // Exit with error code if issues found
    process.exit(issues.length > 0 ? 1 : 0);
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error('Review failed:', error);
  process.exit(1);
});
