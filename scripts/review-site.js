#!/usr/bin/env node

/**
 * Site Review Script
 * Fetches deployed site pages and generates REVIEW_ISSUES.md with actionable items
 *
 * Usage: node scripts/review-site.js <base-url>
 * Example: node scripts/review-site.js https://humanitymattersbook.com
 */

const fs = require('fs');

const BASE_URL = process.argv[2] || 'http://localhost:3000';
const OUTPUT_FILE = 'REVIEW_ISSUES.md';

// Pages that should exist
const EXPECTED_PAGES = [
  { path: '/', name: 'Home' },
  { path: '/about', name: 'About' },
  { path: '/book', name: 'Book' },
  { path: '/art', name: 'Art' },
  { path: '/posts', name: 'Posts' },
  { path: '/recommendations', name: 'Recommendations' },
  { path: '/resume', name: 'Resume' },
  { path: '/contact', name: 'Contact' },
  { path: '/terms', name: 'Terms' },
  { path: '/privacy', name: 'Privacy' },
  { path: '/card', name: 'Card' },
];

// Content checks for specific pages
const CONTENT_CHECKS = {
  '/': [
    { text: 'Humanity matters', description: 'Main heading present' },
    { text: 'uniquely human skills', description: 'Tagline present' },
    { text: 'Sign up to receive', description: 'Newsletter CTA present' },
  ],
  '/about': [{ text: 'Leaf', description: 'Author name present' }],
  '/book': [{ text: 'book', description: 'Book content present', caseSensitive: false }],
};

async function fetchPage(url) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SiteReviewBot/1.0)',
      },
    });

    return {
      status: response.status,
      ok: response.ok,
      html: response.ok ? await response.text() : null,
      url: response.url,
    };
  } catch (error) {
    return {
      status: 0,
      ok: false,
      error: error.message,
      html: null,
    };
  }
}

function checkContent(html, checks) {
  const issues = [];

  for (const check of checks) {
    const searchText = check.caseSensitive === false ? check.text.toLowerCase() : check.text;
    const searchHtml = check.caseSensitive === false ? html.toLowerCase() : html;

    if (!searchHtml.includes(searchText)) {
      issues.push(`Missing: ${check.description}`);
    }
  }

  return issues;
}

function checkImages(html) {
  const issues = [];
  const imgRegex = /<img[^>]+src=["']([^"']+)["']/g;
  let match;

  while ((match = imgRegex.exec(html)) !== null) {
    const src = match[1];

    // Check for missing alt text
    const imgTag = match[0];
    if (!imgTag.includes('alt=')) {
      issues.push(`Image missing alt text: ${src}`);
    }

    // Check for broken image paths
    if (src.startsWith('/') && !src.startsWith('//')) {
      // Relative path - would need to fetch to verify
    } else if (src.startsWith('http')) {
      // External image - could check but skip for now
    }
  }

  return issues;
}

function checkLinks(html) {
  const issues = [];
  const linkRegex = /<a[^>]+href=["']https?:\/\/[^"']+["'][^>]*>/g;
  let match;

  while ((match = linkRegex.exec(html)) !== null) {
    const linkTag = match[0];

    // Check for security attributes on external links
    if (!linkTag.includes('rel=')) {
      const hrefMatch = linkTag.match(/href=["']([^"']+)["']/);
      if (hrefMatch) {
        issues.push(`External link missing rel attribute: ${hrefMatch[1]}`);
      }
    }

    if (linkTag.includes('target="_blank"') && !linkTag.includes('rel=')) {
      issues.push('External link with target="_blank" missing rel="noopener noreferrer"');
    }
  }

  return issues;
}

function checkMetadata(html) {
  const issues = [];

  if (!html.includes('<meta name="description"')) {
    issues.push('Missing meta description');
  }

  if (!html.includes('<meta property="og:title"')) {
    issues.push('Missing Open Graph title');
  }

  if (!html.includes('<meta property="og:description"')) {
    issues.push('Missing Open Graph description');
  }

  return issues;
}

async function reviewSite() {
  console.log(`🔍 Reviewing site: ${BASE_URL}`);

  const results = {
    timestamp: new Date().toISOString(),
    baseUrl: BASE_URL,
    critical: [],
    layout: [],
    content: [],
    seo: [],
    lowPriority: [],
  };

  // Check each expected page
  for (const page of EXPECTED_PAGES) {
    const url = `${BASE_URL}${page.path}`;
    console.log(`  Checking ${page.name} (${page.path})...`);

    const response = await fetchPage(url);

    if (!response.ok) {
      if (response.status === 404) {
        results.critical.push(`\`${page.path}\` returns 404 - page missing`);
      } else if (response.status === 0) {
        results.critical.push(`\`${page.path}\` failed to load: ${response.error}`);
      } else {
        results.critical.push(`\`${page.path}\` returns ${response.status}`);
      }
      continue;
    }

    const html = response.html;

    // Content checks
    const contentChecks = CONTENT_CHECKS[page.path];
    if (contentChecks) {
      const contentIssues = checkContent(html, contentChecks);
      if (contentIssues.length > 0) {
        results.content.push(`**${page.name}**: ${contentIssues.join(', ')}`);
      }
    }

    // Image checks
    const imageIssues = checkImages(html, BASE_URL);
    if (imageIssues.length > 0) {
      results.lowPriority.push(...imageIssues.map((i) => `**${page.name}**: ${i}`));
    }

    // Link checks
    const linkIssues = checkLinks(html);
    if (linkIssues.length > 0) {
      results.seo.push(...linkIssues.map((i) => `**${page.name}**: ${i}`));
    }

    // Metadata checks
    if (page.path === '/') {
      const metaIssues = checkMetadata(html);
      if (metaIssues.length > 0) {
        results.seo.push(...metaIssues.map((i) => `**${page.name}**: ${i}`));
      }
    }
  }

  // Generate markdown report
  const report = generateReport(results);

  // Write to file
  fs.writeFileSync(OUTPUT_FILE, report);
  console.log(`\n✅ Review complete! Generated ${OUTPUT_FILE}`);

  // Exit with error code if there are critical issues
  if (results.critical.length > 0) {
    console.error(`\n⚠️  Found ${results.critical.length} critical issue(s)`);
    process.exit(1);
  }
}

function generateReport(results) {
  const sections = [];

  // Header
  sections.push(`# Site Review\n`);
  sections.push(`**Last checked:** ${new Date(results.timestamp).toLocaleString()}`);
  sections.push(`**URL:** ${results.baseUrl}\n`);

  // Critical issues
  if (results.critical.length > 0) {
    sections.push(`## 🚨 Critical Issues (blocks deployment)\n`);
    results.critical.forEach((issue) => {
      sections.push(`- [ ] ${issue}`);
    });
    sections.push('');
  }

  // Content issues
  if (results.content.length > 0) {
    sections.push(`## 📝 Content Issues\n`);
    results.content.forEach((issue) => {
      sections.push(`- [ ] ${issue}`);
    });
    sections.push('');
  }

  // SEO issues
  if (results.seo.length > 0) {
    sections.push(`## 🔍 SEO/Metadata Issues\n`);
    results.seo.forEach((issue) => {
      sections.push(`- [ ] ${issue}`);
    });
    sections.push('');
  }

  // Layout issues (currently empty, would be populated by visual checks)
  if (results.layout.length > 0) {
    sections.push(`## 🎨 Layout/Styling Issues\n`);
    results.layout.forEach((issue) => {
      sections.push(`- [ ] ${issue}`);
    });
    sections.push('');
  }

  // Low priority
  if (results.lowPriority.length > 0) {
    sections.push(`## ℹ️ Low Priority\n`);
    results.lowPriority.forEach((issue) => {
      sections.push(`- [ ] ${issue}`);
    });
    sections.push('');
  }

  // Success message if no issues
  if (
    results.critical.length === 0 &&
    results.content.length === 0 &&
    results.seo.length === 0 &&
    results.layout.length === 0 &&
    results.lowPriority.length === 0
  ) {
    sections.push(`## ✅ All Checks Passed!\n`);
    sections.push(`No issues found. Site looks good!`);
  }

  return sections.join('\n');
}

// Run the review
reviewSite().catch((error) => {
  console.error('Review failed:', error);
  process.exit(1);
});
