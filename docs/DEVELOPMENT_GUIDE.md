# Web Development Guide for AI Coding Assistants (Astro Edition)

This document provides comprehensive guidelines for AI coding assistants working on Astro-based web development projects. It covers code quality, security, performance, testing, accessibility, and maintenance standards.

---

## Table of Contents

1. [Core Principles](#core-principles)
2. [Code Quality Standards](#code-quality-standards)
3. [Security Requirements](#security-requirements)
4. [Performance Optimization](#performance-optimization)
5. [Testing Standards](#testing-standards)
6. [Accessibility Requirements](#accessibility-requirements)
7. [SEO & Metadata](#seo--metadata)
8. [Error Handling](#error-handling)
9. [Dependency Management](#dependency-management)
10. [Build & Deployment](#build--deployment)
11. [Image Optimization](#image-optimization)
12. [Project Structure](#project-structure)
13. [Astro-Specific Patterns](#astro-specific-patterns)
14. [Modern React Patterns](#modern-react-patterns)
15. [Automation & CI/CD](#automation--cicd)
16. [Review Checklist](#review-checklist)

---

## Core Principles

### Safety Guardrails

1. **Never modify files outside the project directory** - If working in `/project/`, only files inside `/project/` or its subfolders can be modified or deleted. Always ask the user and provide a clear warning before touching any files outside the project root.
2. **Prefer latest stable versions** - When adding or updating packages, use latest stable versions unless they would introduce high or critical severity vulnerabilities.
3. **Never remove or skip tests without user approval** - Tests exist for a reason. If a test is failing, fix the code or update the test appropriately. Never delete tests, comment them out, or use `.skip()` without explicitly warning the user and getting approval.
4. **Never disable linting or formatting rules without user approval** - Do not add `// eslint-disable`, `// @ts-ignore`, `// @ts-expect-error`, or similar suppressions without explicitly warning the user and getting approval. Fix the underlying issue instead.
5. **Never suppress type errors with `as any`** - Find the correct type or fix the type issue properly.

### Before Making Changes

1. **Understand existing patterns** - Read neighboring files to understand code style, frameworks, and conventions before writing new code
2. **Check for existing utilities** - Never assume a library is available; verify in package.json/cargo.toml/etc.
3. **Verify test patterns** - Check existing tests to understand the testing approach before writing new tests
4. **Read documentation** - Check README, AGENTS.md, CLAUDE.md for project-specific guidance

### During Development

1. **Maintain consistency** - Match existing code style, naming conventions, and architectural patterns
2. **Minimize dependencies** - Prefer existing libraries over adding new ones
3. **Write tests alongside code** - Every new feature or component should have corresponding tests
4. **Verify changes work** - Run linting, type checking, and tests before considering work complete

### Quality Gates

Always run these checks before completing any task:

```bash
# Essential checks (run in this order)
npm run type-check     # Astro type checking (zero errors)
npm run test:run       # All E2E tests must pass (Playwright)
npm run build          # Build must succeed
npm run security:check # Check for high/critical vulnerabilities
```

Combined quality check:
```bash
npm run quality:check  # Runs type-check, test:run, and build
```

**Note:** ESLint and Prettier are not yet configured for this project. See package.json scripts for placeholders.

---

## Code Quality Standards

### ESLint Requirements

- **Zero errors** - Code must pass linting with no errors
- **Zero warnings** - Warnings should be fixed, not ignored
- **No unused variables** - Remove or prefix with underscore (`_unusedVar`)
- **No console.log in production** - Remove debug statements or use proper logging

```javascript
// ❌ Bad: Unused variable
const unused = getValue()
doSomething()

// ✅ Good: Use or remove
const value = getValue()
doSomething(value)

// ✅ Good: Prefix intentionally unused
const _intentionallyUnused = getValue()
```

### Formatting

- Run Prettier (or project formatter) before committing
- Never mix formatting changes with logic changes
- Configure editor to format on save

### Code Comments

- **Do NOT add explanatory comments** unless explicitly requested
- Code should be self-documenting through clear naming
- Comments belong in commit messages and PR descriptions
- Only add comments for genuinely complex algorithms that require context

```javascript
// ❌ Bad: Unnecessary comment
// Get the user from the database
const user = await getUser(id)

// ✅ Good: Self-documenting code
const user = await getUser(id)

// ✅ Good: Necessary context for complex logic
// Uses Levenshtein distance with early termination when distance exceeds threshold
// to avoid O(n*m) worst case for obviously dissimilar strings
function fuzzyMatch(a, b, threshold) { ... }
```

### Import Organization

1. External dependencies first (astro, react, lodash, etc.)
2. Internal absolute imports second (@/components, etc.)
3. Relative imports last (./utils, ../components)
4. Separate groups with blank lines

---

## Security Requirements

### Vulnerability Standards

| Severity | Requirement |
|----------|-------------|
| Critical | **ZERO tolerance** - Must fix immediately |
| High | **ZERO tolerance** - Must fix before deployment |
| Moderate | Should fix when feasible |
| Low | Evaluate and track |

### Security Checks

```bash
npm audit                      # Full vulnerability report
npm audit --audit-level=high   # High/critical only
npm run security:check         # If configured
```

### Security Headers (for web servers)

Ensure these headers are configured in `.htaccess`, `nginx.conf`, Vercel/Netlify config, or server middleware:

```
Content-Security-Policy: default-src 'self'; script-src 'self' ...
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Strict-Transport-Security: max-age=31536000; includeSubDomains
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

### Content Security Policy (CSP) Details

**Goals:**
- Avoid `'unsafe-inline'` and `'unsafe-eval'` where possible
- Use nonces or hashes for unavoidable inline scripts (requires server-side rendering)
- Explicitly list allowed external domains

**Example CSP for Static Sites:**
```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' https://trusted-cdn.com;
  style-src 'self' 'unsafe-inline';  # Often required for CSS-in-JS or third-party widgets
  img-src 'self' data: https:;
  font-src 'self';
  connect-src 'self' https://api.example.com;
  frame-src https://trusted-embed.com;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
  upgrade-insecure-requests;
```

**Important notes:**
- `frame-ancestors` in CSP supersedes `X-Frame-Options` (set both for compatibility)
- Third-party widgets (analytics, forms, chat) often require `'unsafe-inline'` for styles—this is an acceptable tradeoff
- Nonces/hashes are ideal but require server-side rendering (not viable for static sites)
- Test CSP changes thoroughly; overly strict policies can break functionality

### CORS Configuration

For APIs that require authentication:

```
Access-Control-Allow-Origin: https://app.example.com  # Explicit origin, NOT *
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

**Never do this for authenticated APIs:**
```
Access-Control-Allow-Origin: *  # ❌ Dangerous with credentials
```

### Cookie Security

For authentication/session cookies:

```
Set-Cookie: sessionId=...; Secure; HttpOnly; SameSite=Lax; Path=/; Max-Age=...
```

| Attribute | Purpose |
|-----------|---------|
| `Secure` | Only sent over HTTPS |
| `HttpOnly` | Not accessible via JavaScript (prevents XSS token theft) |
| `SameSite=Lax` | CSRF protection (use `Strict` for sensitive apps) |
| `Path=/` | Scope narrowly |

**Guidelines:**
- Prefer httpOnly cookies over localStorage for auth tokens
- Use `SameSite=None; Secure` only when truly needed (cross-site SSO)
- Add CSRF protection if using cookie-based auth

### Secure Coding Practices

- **Never expose secrets** in code, logs, or error messages
- **External links** must use `rel="noopener noreferrer"` and `target="_blank"`
- **User input** must be sanitized before rendering (React escapes by default; Astro escapes by default in templates)
- **No eval()** or dynamic code execution from user input
- **API keys** belong in environment variables, not source code
- **set:html** directive requires sanitization with DOMPurify (Astro equivalent of dangerouslySetInnerHTML)
- **postMessage** handlers must validate `event.origin` against an allowlist

```astro
---
// ❌ Bad: Unsanitized HTML in Astro
const userContent = await getUserContent()
---
<div set:html={userContent} />

---
// ✅ Good: Sanitized HTML
import DOMPurify from 'isomorphic-dompurify'
const userContent = await getUserContent()
const sanitizedContent = DOMPurify.sanitize(userContent)
---
<div set:html={sanitizedContent} />
```

```astro
<!-- ❌ Bad: Missing security attributes -->
<a href="https://external.com">External Link</a>

<!-- ✅ Good: Secure external link -->
<a href="https://external.com" target="_blank" rel="noopener noreferrer">
  External Link
</a>
```

---

## Performance Optimization

### Bundle Size Targets

| Metric | Target | Action if Exceeded |
|--------|--------|-------------------|
| Main JS bundle | <100KB gzipped | Astro ships zero JS by default—investigate unnecessary islands |
| Individual island chunks | <30KB gzipped | Split further or lazy load dependencies |
| CSS | <20KB gzipped | Remove unused styles |
| Total initial load | <200KB gzipped | Audit and optimize |

**Astro Advantage:** Astro ships zero JavaScript by default. Only React/Vue/Svelte islands add JS.

### Astro Islands Architecture

**Key Principle:** Ship minimal JavaScript by default. Only hydrate interactive components.

```astro
---
// ❌ Bad: Hydrating static content
import Header from '../components/Header.jsx'
---
<Header client:load />  <!-- Sends unnecessary JS if Header is static -->

---
// ✅ Good: Static by default
import Header from '../components/Header.astro'
---
<Header />  <!-- Zero JS sent to browser -->

---
// ✅ Good: Hydrate only interactive parts
import SearchBar from '../components/SearchBar.jsx'
---
<SearchBar client:load />  <!-- Only this interactive component gets JS -->
```

### Client Directives

| Directive | When to Use |
|-----------|-------------|
| `client:load` | Critical interactivity (search bar, auth) |
| `client:idle` | Non-critical (chat widgets, analytics) |
| `client:visible` | Below-the-fold (carousels, maps) |
| `client:only` | Framework-specific components (React, Vue, Svelte) |
| No directive | Default - static HTML, zero JS |

### Caching Strategy

Configure appropriate cache headers:

```
# Static assets with hash (immutable)
Cache-Control: public, max-age=31536000, immutable

# HTML (short cache, must revalidate)
Cache-Control: public, max-age=3600, must-revalidate

# API responses (vary by use case)
Cache-Control: private, max-age=60
```

### Font Loading

**Goals:**
- Avoid Flash of Invisible Text (FOIT)
- Minimize layout shift from font loading

**Best practices:**
- Self-host fonts (WOFF2 format) for better CSP and performance
- Use `font-display: swap` or `optional`
- Limit font weights/variants to what's actually used
- Preload critical fonts:

```html
<link
  rel="preload"
  href="/fonts/main-font.woff2"
  as="font"
  type="font/woff2"
  crossorigin
/>
```

```css
@font-face {
  font-family: 'Main Font';
  src: url('/fonts/main-font.woff2') format('woff2');
  font-display: swap;
}
```

### Resource Hints

Use resource hints to improve loading performance:

```html
<!-- Preconnect to external origins (APIs, CDNs) -->
<link rel="preconnect" href="https://api.example.com" crossorigin />

<!-- Preload critical above-the-fold resources -->
<link rel="preload" href="/fonts/heading.woff2" as="font" type="font/woff2" crossorigin />
<link rel="preload" href="/hero-image.webp" as="image" />

<!-- Prefetch likely next-page resources -->
<link rel="prefetch" href="/about/" />
```

**Warning:** Use sparingly—over-preloading can harm performance.

### Core Web Vitals

| Metric | Target | What It Measures |
|--------|--------|------------------|
| LCP (Largest Contentful Paint) | ≤2.5s | Loading performance |
| CLS (Cumulative Layout Shift) | ≤0.1 | Visual stability |
| INP (Interaction to Next Paint) | ≤200ms | Responsiveness |

**INP optimization:**
- Avoid heavy synchronous work in event handlers (click, input, keypress)
- Use `requestIdleCallback` for non-urgent work
- Debounce/throttle expensive operations
- Avoid large React re-renders on every keystroke; use localized state

**CLS prevention:**
- Always set `width` and `height` on images (or use aspect-ratio)
- Reserve space for dynamic content (ads, embeds)
- Use `font-display: swap` to prevent layout shift from fonts

### Image Best Practices

Astro has built-in image optimization with the `<Image>` component:

```astro
---
import { Image } from 'astro:assets'
import heroImage from '../assets/hero.jpg'
---

<!-- ✅ Good: Astro optimized image -->
<Image
  src={heroImage}
  alt="Hero description"
  width={1200}
  height={600}
  loading="eager"
  fetchpriority="high"
/>

<!-- ✅ Good: Remote image -->
<Image
  src="https://example.com/image.jpg"
  alt="Remote image"
  width={800}
  height={600}
  loading="lazy"
/>
```

For plain HTML images:
```html
<!-- Critical LCP image -->
<img
  src="/hero.webp"
  alt="Hero description"
  width="1200"
  height="600"
  fetchpriority="high"
/>

<!-- Below-the-fold images -->
<img
  src="/gallery-item.webp"
  alt="Gallery item"
  width="400"
  height="300"
  loading="lazy"
  decoding="async"
/>
```

### Performance Monitoring

- Run Lighthouse audits regularly (target: 90+ on all metrics, aim for 100)
- Monitor Core Web Vitals (LCP, INP, CLS) with `web-vitals` library or RUM
- Check bundle size in build output
- Use `npm run build` output to identify large chunks
- Astro should score 100/100 on Lighthouse Performance by default

---

## Testing Standards

### Test Maintenance Philosophy

**When requirements change, tests MUST be updated to match:**

1. **Automatically update tests for new requirements** - When the user provides new requirements for the site (content changes, UI changes, feature additions), you MUST proactively update all affected tests to verify the new requirements are met.

2. **Never remove tests without user approval** - If you believe a test should be removed, you MUST:
   - Stop and ask the user for approval
   - Explain WHY the test should be removed
   - Wait for explicit confirmation before deleting or skipping the test

3. **Fix tests, don't skip them** - When tests fail after making changes:
   - ✅ **Preferred**: Update the test to match new requirements
   - ✅ **Acceptable**: Fix the code to make the test pass
   - ❌ **Never**: Delete the test or use `.skip()` without user approval
   - ❌ **Never**: Comment out failing tests

**Example Workflow:**
```
User: "Change the home page heading from 'Welcome' to 'Hello World'"

AI Actions:
1. Update Home.astro with new heading
2. Automatically update home.spec.ts to expect "Hello World"
3. Automatically update any integration tests checking the home page
4. Run tests to verify all pass
5. Never ask user about test updates - just do it
```

**When to Ask User About Tests:**
- Only when you think a test should be REMOVED entirely
- Never for updating tests to match new requirements

### Astro Testing Strategy

**Astro components (.astro files) cannot be unit tested** with traditional React Testing Library approaches. Use Playwright for E2E testing instead.

**What to test:**
1. **End-to-End Tests (Playwright)** - Critical user flows, navigation, content rendering
2. **React Islands (Vitest + RTL)** - Interactive React components can be unit tested
3. **Utility Functions (Vitest)** - Pure JavaScript utilities
4. **Content Collections (Vitest)** - Schema validation and data integrity

### End-to-End Testing with Playwright

**Primary testing approach for Astro projects.**

**When to use E2E tests:**
- Page rendering and content verification
- Navigation flows
- Form submissions
- Authentication flows (if applicable)
- Critical business flows
- Accessibility checks

**Test File Organization:**
```
e2e/                         # E2E tests with Playwright (project root)
├── navigation.spec.ts       # Navigation and routing tests
├── posts.spec.ts            # Blog post tests
├── seo.spec.ts              # SEO, meta tags, RSS, sitemap
└── content.spec.ts          # SSG verification, HTML source content

tests/unit/                  # Unit tests (if needed)
├── components/
│   └── SearchBar.test.tsx   # React island tests
└── utils/
    └── helpers.test.ts      # Utility function tests
```

**Current Project:** Uses Playwright for all testing (no unit tests yet). Tests are in `e2e/` directory at project root.

**Example Playwright test:**
```typescript
import { test, expect } from '@playwright/test'

test('home page displays correct heading', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('h1')).toContainText('Welcome')
})

test('navigation to blog works', async ({ page }) => {
  await page.goto('/')
  await page.click('[data-testid="nav-blog"]')
  await expect(page).toHaveURL('/blog')
  await expect(page.locator('h1')).toContainText('Blog')
})

test('external links have security attributes', async ({ page }) => {
  await page.goto('/')
  const externalLinks = page.locator('a[href^="http"]')
  const count = await externalLinks.count()

  for (let i = 0; i < count; i++) {
    await expect(externalLinks.nth(i)).toHaveAttribute('rel', 'noopener noreferrer')
    await expect(externalLinks.nth(i)).toHaveAttribute('target', '_blank')
  }
})

test('newsletter form submission', async ({ page }) => {
  await page.goto('/newsletter')
  await page.fill('[name="email"]', 'test@example.com')
  await page.click('[type="submit"]')
  await expect(page.locator('[data-testid="success-message"]')).toBeVisible()
})
```

**Accessibility testing:**
```typescript
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test('homepage should not have accessibility violations', async ({ page }) => {
  await page.goto('/')

  const accessibilityScanResults = await new AxeBuilder({ page }).analyze()

  expect(accessibilityScanResults.violations).toEqual([])
})
```

### Unit Testing React Islands

React components used as islands CAN be unit tested:

```tsx
// src/components/SearchBar.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import SearchBar from './SearchBar'

describe('SearchBar', () => {
  it('renders search input', () => {
    render(<SearchBar />)
    expect(screen.getByRole('searchbox')).toBeInTheDocument()
  })

  it('updates on input change', () => {
    render(<SearchBar />)
    const input = screen.getByRole('searchbox')
    fireEvent.change(input, { target: { value: 'test query' } })
    expect(input).toHaveValue('test query')
  })
})
```

### Testing Utility Functions

```typescript
// src/utils/formatDate.test.ts
import { describe, it, expect } from 'vitest'
import { formatDate } from './formatDate'

describe('formatDate', () => {
  it('formats date correctly', () => {
    const date = new Date('2025-01-15')
    expect(formatDate(date)).toBe('January 15, 2025')
  })

  it('handles invalid dates', () => {
    expect(formatDate(null)).toBe('')
  })
})
```

### Coverage Requirements

| Scope | Minimum Coverage | Testing Approach |
|-------|-----------------|------------------|
| Critical user flows | 100% | Playwright E2E |
| React islands | 80% | Vitest + RTL |
| Utility functions | 90% | Vitest |
| Content Collections | Basic validation | Vitest |

### Visual Regression Testing

Use screenshot comparison for design-sensitive UIs:

**Example with Playwright:**
```typescript
test('homepage matches screenshot', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveScreenshot('homepage.png', {
    maxDiffPixels: 100
  })
})
```

**When to use:**
- Critical pages (home, main features)
- Component libraries
- Before major releases

---

## Accessibility Requirements

### WCAG 2.1 AA Compliance

| Requirement | How to Verify |
|-------------|---------------|
| Alt text on all images | Check every `<img>` has meaningful `alt` |
| Semantic HTML | Use `<header>`, `<nav>`, `<main>`, `<section>`, `<article>` |
| Keyboard navigation | Tab through entire site, all interactive elements reachable |
| ARIA labels | Icon-only buttons have `aria-label` |
| Color contrast | 4.5:1 ratio minimum |
| Heading hierarchy | h1 → h2 → h3, no skips |
| Focus indicators | Visible focus ring on interactive elements |

### Common Accessibility Patterns

```astro
<!-- ❌ Bad: Image without alt text -->
<img src="photo.jpg" />

<!-- ❌ Bad: Decorative alt text -->
<img src="user.jpg" alt="Image" />

<!-- ✅ Good: Descriptive alt text -->
<img src="user.jpg" alt="Sarah Chen, Lead Developer" />

<!-- ✅ Good: Decorative image (intentionally empty) -->
<img src="decorative-border.svg" alt="" role="presentation" />

<!-- ❌ Bad: Icon button without label -->
<button><SearchIcon /></button>

<!-- ✅ Good: Icon button with aria-label -->
<button aria-label="Search"><SearchIcon /></button>

<!-- ❌ Bad: Skipped heading level -->
<h1>Title</h1>
<h3>Subsection</h3>  <!-- Skipped h2! -->

<!-- ✅ Good: Proper heading hierarchy -->
<h1>Title</h1>
<h2>Section</h2>
<h3>Subsection</h3>
```

### Focus Management

**Requirements:**
- Visible focus outline on all interactive elements (don't remove without accessible alternative)
- Logical tab order with no keyboard traps
- On route changes, move focus to main heading or `<main>` landmark
- Modals must trap focus and restore focus to trigger on close

```css
/* ❌ Bad: Removes focus outline without replacement */
button:focus { outline: none; }

/* ✅ Good: Custom focus style */
button:focus-visible {
  outline: 2px solid var(--focus-color);
  outline-offset: 2px;
}
```

### Motion and Animation

Respect user preferences for reduced motion:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Forms and Validation

- Every input must have a programmatically associated label
- Error messages should be linked via `aria-describedby`

```astro
<!-- ✅ Good: Accessible form field with error -->
<div>
  <label for="email">Email</label>
  <input
    id="email"
    type="email"
    aria-describedby="email-error"
    aria-invalid={error ? 'true' : 'false'}
  />
  {error && <span id="email-error" role="alert">{error}</span>}
</div>
```

### Live Regions

For important dynamic updates, use `aria-live`:

```astro
<!-- Announce results to screen readers -->
<div aria-live="polite" aria-atomic="true">
  {searchResults.length} results found
</div>
```

### Accessibility Testing

**Automated tools:**
- `eslint-plugin-jsx-a11y` in ESLint config (for React islands)
- axe-core with Playwright (see testing section above)
- Lighthouse accessibility audit

**Manual testing:**
- Keyboard-only navigation pass
- Screen reader smoke test (VoiceOver, NVDA)
- Color contrast checker

---

## SEO & Metadata

### Astro SEO Approach

Astro makes SEO easy with built-in features:

1. **Frontmatter in .astro files** - Define metadata per page
2. **SEO component** - Reusable component for meta tags
3. **@astrojs/sitemap** - Auto-generates sitemap
4. **RSS support** - `@astrojs/rss` for feeds

### SEO Component Pattern

Create a reusable SEO component:

```astro
---
// src/components/SEO.astro
interface Props {
  title: string
  description: string
  image?: string
  type?: 'website' | 'article'
}

const { title, description, image = '/og-image.png', type = 'website' } = Astro.props
const canonicalURL = new URL(Astro.url.pathname, Astro.site)
---

<!-- Primary Meta Tags -->
<title>{title}</title>
<meta name="title" content={title} />
<meta name="description" content={description} />
<link rel="canonical" href={canonicalURL} />

<!-- Open Graph / Facebook -->
<meta property="og:type" content={type} />
<meta property="og:url" content={canonicalURL} />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:image" content={new URL(image, Astro.site)} />

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:url" content={canonicalURL} />
<meta property="twitter:title" content={title} />
<meta property="twitter:description" content={description} />
<meta property="twitter:image" content={new URL(image, Astro.site)} />
```

**Usage in pages:**
```astro
---
// src/pages/about.astro
import Layout from '../layouts/Layout.astro'
import SEO from '../components/SEO.astro'
---

<Layout>
  <SEO
    slot="head"
    title="About Us - Site Name"
    description="Learn about our company and mission"
    image="/images/about-og.png"
  />

  <h1>About Us</h1>
  <p>Content...</p>
</Layout>
```

### Sitemap Generation

Install and configure `@astrojs/sitemap`:

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
  site: 'https://example.com',
  integrations: [sitemap()]
})
```

Automatically generates `sitemap.xml` on build.

### RSS Feed

Create an RSS endpoint:

```typescript
// src/pages/feed.xml.ts
import rss from '@astrojs/rss'
import { getCollection } from 'astro:content'

export async function GET(context) {
  const blog = await getCollection('blog')

  return rss({
    title: 'Site Name Blog',
    description: 'Site description',
    site: context.site,
    items: blog.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      link: `/blog/${post.slug}/`,
    })),
  })
}
```

### Required Files

| File | Purpose |
|------|---------|
| `public/robots.txt` | Search engine crawling rules |
| `sitemap.xml` | Auto-generated by @astrojs/sitemap |
| `public/manifest.json` | PWA web app manifest |
| `public/favicon.ico` | Browser tab icon |
| `public/apple-touch-icon.png` | iOS home screen icon (180x180) |

### PWA Manifest Requirements

```json
{
  "name": "Full App Name",
  "short_name": "Short",
  "description": "App description",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "icons": [
    { "src": "/favicon-192x192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/favicon-512x512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

---

## Error Handling

### Astro Error Pages

Astro uses file-based error pages:

**404 Page:**
```astro
---
// src/pages/404.astro
import Layout from '../layouts/Layout.astro'
---

<Layout>
  <main>
    <h1>Page Not Found</h1>
    <p>Sorry, the page you're looking for doesn't exist.</p>
    <a href="/">← Return to Home</a>
  </main>
</Layout>
```

**Custom Error Pages:**
```astro
---
// src/pages/500.astro
import Layout from '../layouts/Layout.astro'
---

<Layout>
  <main>
    <h1>Server Error</h1>
    <p>Something went wrong. Please try again later.</p>
    <a href="/">← Return to Home</a>
  </main>
</Layout>
```

### React Island Error Boundaries

For React islands, use ErrorBoundary:

```tsx
// src/components/ErrorBoundary.tsx
import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div>
          <h2>Something went wrong</h2>
          <button onClick={() => window.location.reload()}>
            Refresh
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
```

**Usage in .astro files:**
```astro
---
import InteractiveWidget from '../components/InteractiveWidget.jsx'
import ErrorBoundary from '../components/ErrorBoundary.tsx'
---

<ErrorBoundary client:load>
  <InteractiveWidget client:load />
</ErrorBoundary>
```

---

## Dependency Management

### Regular Maintenance

```bash
npm outdated              # Check for outdated packages
npm update                # Update minor/patch versions
npm audit fix             # Fix vulnerabilities
```

### Update Strategy

| Update Type | Approach |
|-------------|----------|
| Patch (x.x.1 → x.x.2) | Auto-update safe |
| Minor (x.1.x → x.2.x) | Review changelog, usually safe |
| Major (1.x.x → 2.x.x) | Test thoroughly, may have breaking changes |

### Required Dev Dependencies

Ensure these are installed for quality checks:

```json
{
  "devDependencies": {
    "@astrojs/check": "^latest",
    "@playwright/test": "^latest",
    "@testing-library/react": "^16.x",
    "@vitest/coverage-v8": "^latest",
    "astro": "^latest",
    "eslint": "^9.x",
    "prettier": "^3.x",
    "prettier-plugin-astro": "^latest",
    "typescript": "^5.x",
    "vitest": "^latest"
  }
}
```

---

## Build & Deployment

### Astro Build Process

Astro builds to the `dist/` directory:

```bash
npm run build   # Builds to dist/
npm run preview # Preview production build
```

**Build output:**
- Static HTML files
- Optimized assets (CSS, images)
- JavaScript for islands only
- Sitemap and RSS feed

### Pre-Deployment Checklist

```bash
# 1. Quality checks
npm run type-check        # ✅ Astro type checking passes
npm run quality:check     # ✅ Combined check (type, test, build)

# 2. Security
npm run security:check    # ✅ Zero high/critical vulnerabilities

# 3. Preview
npm run preview           # ✅ Manual verification

# Note: Linting and formatting not yet configured
```

### CI/CD Pipeline Stages

1. **Install** - Install dependencies with caching
2. **Lint** - Run ESLint (fail on warnings)
3. **Format** - Check Prettier formatting
4. **Type Check** - Astro type checking
5. **Test** - Run E2E tests with Playwright
6. **Security** - npm audit for vulnerabilities
7. **Build** - Production build to dist/
8. **Deploy** - Deploy to hosting (Vercel, Netlify, etc.)

### Recommended GitHub Actions Workflows

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| CI | Push, PR | Full quality checks |
| Security Audit | Daily schedule | Catch new vulnerabilities |
| Lighthouse | Weekly schedule | Performance monitoring |
| Dependabot | Weekly | Automated dependency updates |

---

## Image Optimization

### Image Format Strategy

| Format | Use Case |
|--------|----------|
| WebP | All images (primary format, 70-85% smaller than JPEG) |
| JPEG | Fallback for older browsers |
| PNG | Logos, icons with transparency |
| SVG | Icons, simple graphics (scales infinitely) |

### Astro Image Optimization

Astro has built-in image optimization:

```astro
---
import { Image } from 'astro:assets'
import heroImage from '../assets/hero.jpg'
---

<!-- Automatically optimized and responsive -->
<Image
  src={heroImage}
  alt="Hero description"
  width={1200}
  height={600}
/>
```

**Benefits:**
- Automatic WebP conversion
- Responsive image generation
- Lazy loading by default
- Width/height attributes added automatically

### Size Targets

| Image Type | Max Size | Dimensions |
|------------|----------|------------|
| Hero/Banner | <200KB | 1920px wide max |
| Featured/Cards | <100KB | 800px wide |
| Thumbnails | <50KB | 400px wide |
| Logos | <50KB | As needed |

### Manual Optimization Script

For images not processed by Astro's `<Image>` component:

```javascript
// scripts/optimize-images.js
import sharp from 'sharp';
import { readdir } from 'fs/promises';
import { join, dirname, basename, extname } from 'path';
import { existsSync } from 'fs';

const QUALITY_FULL = 85;
const QUALITY_THUMB = 80;
const THUMB_SIZE = 400;
const MEDIUM_SIZE = 800;

async function processDirectory(dir) {
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      await processDirectory(fullPath);
    } else if (entry.name.match(/\.(jpg|jpeg|png)$/i) &&
               !entry.name.includes('-thumb') &&
               !entry.name.includes('-medium')) {
      await optimizeImage(fullPath);
    }
  }
}

async function optimizeImage(inputPath) {
  const dir = dirname(inputPath);
  const name = basename(inputPath, extname(inputPath));

  // Full size WebP
  const fullWebp = join(dir, `${name}.webp`);
  if (!existsSync(fullWebp)) {
    await sharp(inputPath)
      .rotate()  // Auto-rotate based on EXIF
      .webp({ quality: QUALITY_FULL })
      .toFile(fullWebp);
  }

  // Thumbnail
  const thumbWebp = join(dir, `${name}-thumb.webp`);
  if (!existsSync(thumbWebp)) {
    await sharp(inputPath)
      .rotate()
      .resize(THUMB_SIZE, THUMB_SIZE, { fit: 'cover' })
      .webp({ quality: QUALITY_THUMB })
      .toFile(thumbWebp);
  }

  // Medium
  const mediumWebp = join(dir, `${name}-medium.webp`);
  if (!existsSync(mediumWebp)) {
    await sharp(inputPath)
      .rotate()
      .resize(MEDIUM_SIZE, MEDIUM_SIZE, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: QUALITY_FULL })
      .toFile(mediumWebp);
  }
}

processDirectory('./public/images');
```

Add to package.json:
```json
{
  "scripts": {
    "optimize:images": "node scripts/optimize-images.js"
  }
}
```

---

## Project Structure

### Recommended Astro Structure

```
project/
├── public/
│   ├── images/
│   ├── .htaccess           # Security headers, caching, redirects
│   ├── robots.txt
│   ├── manifest.json
│   ├── favicon.ico
│   └── favicon-*.png
├── scripts/
│   └── optimize-images.js
├── src/
│   ├── assets/             # Images imported in code (optimized by Astro)
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.astro
│   │   │   └── Footer.astro
│   │   ├── SEO.astro
│   │   └── ErrorBoundary.tsx  # React component for islands
│   ├── content/            # Content Collections
│   │   ├── blog/
│   │   │   ├── post-1.md
│   │   │   └── post-2.md
│   │   └── config.ts       # Zod schemas for content
│   ├── layouts/
│   │   ├── Layout.astro    # Base layout
│   │   └── BlogPost.astro
│   ├── pages/
│   │   ├── index.astro     # Routes map to URLs
│   │   ├── about.astro
│   │   ├── blog/
│   │   │   ├── index.astro
│   │   │   └── [slug].astro
│   │   ├── feed.xml.ts     # RSS feed endpoint
│   │   ├── 404.astro
│   │   └── 500.astro
│   ├── utils/
│   │   ├── formatDate.ts
│   │   └── formatDate.test.ts
│   └── env.d.ts
├── tests/
│   ├── e2e/
│   │   ├── home.spec.ts
│   │   ├── blog.spec.ts
│   │   └── accessibility.spec.ts
│   └── unit/
│       └── utils/
│           └── formatDate.test.ts
├── .github/
│   ├── workflows/
│   │   ├── ci.yml
│   │   └── scheduled-security-audit.yml
│   └── dependabot.yml
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── eslint.config.js
├── .prettierrc
├── playwright.config.ts
├── vitest.config.ts
├── CLAUDE.md               # Project-specific AI guidance
└── README.md
```

**Key differences from React/Vite:**
- `src/pages/` for file-based routing (not components)
- `src/content/` for Content Collections
- `src/layouts/` for reusable layouts
- `dist/` for build output (not `build/`)
- `astro.config.mjs` for configuration (not `vite.config.js`)

---

## Astro-Specific Patterns

### Content Collections

Content Collections provide type-safe content with Zod schemas:

**Define schema:**
```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content'

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    author: z.string(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().default(false),
    image: z.string().optional(),
  }),
})

export const collections = {
  blog: blogCollection,
}
```

**Use in pages:**
```astro
---
// src/pages/blog/[slug].astro
import { getCollection } from 'astro:content'
import BlogLayout from '../../layouts/BlogPost.astro'

export async function getStaticPaths() {
  const blogEntries = await getCollection('blog', ({ data }) => {
    return data.draft !== true  // Filter out drafts
  })

  return blogEntries.map(entry => ({
    params: { slug: entry.slug },
    props: { entry },
  }))
}

const { entry } = Astro.props
const { Content } = await entry.render()
---

<BlogLayout title={entry.data.title} date={entry.data.date}>
  <Content />
</BlogLayout>
```

**Benefits:**
- TypeScript type safety for frontmatter
- Automatic validation with Zod
- Better developer experience with autocomplete

### When to Use React Islands vs Astro Components

| Use Case | Component Type | Rationale |
|----------|---------------|-----------|
| Static header/footer | `.astro` | Zero JS, better performance |
| Blog post content | `.astro` | No interactivity needed |
| Static pages (About, Contact) | `.astro` | No interactivity needed |
| Search bar with autocomplete | `.jsx` (React island) | Requires interactivity |
| Image carousel | `.jsx` (React island) | User interaction |
| Form with validation | `.jsx` (React island) | Interactive state management |
| Theme toggle | `.jsx` (React island) | State + localStorage |
| Analytics widget | `.jsx` (React island) | Data fetching + updates |

**Rule of thumb:** Default to `.astro` components. Only use React islands when you need client-side interactivity.

### Layouts and Slots

Create reusable layouts with slots:

```astro
---
// src/layouts/Layout.astro
interface Props {
  title: string
}

const { title } = Astro.props
---

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <title>{title}</title>
    <slot name="head" />  <!-- Named slot for SEO component -->
  </head>
  <body>
    <header>
      <nav>...</nav>
    </header>
    <main>
      <slot />  <!-- Default slot for content -->
    </main>
    <footer>...</footer>
  </body>
</html>
```

**Usage:**
```astro
---
// src/pages/about.astro
import Layout from '../layouts/Layout.astro'
import SEO from '../components/SEO.astro'
---

<Layout title="About Us">
  <SEO
    slot="head"
    title="About Us"
    description="Learn about our company"
  />

  <h1>About Us</h1>
  <p>Content...</p>
</Layout>
```

### Environment Variables

Astro exposes environment variables with prefixes:

```typescript
// ✅ Good: Public variables (exposed to client)
const apiUrl = import.meta.env.PUBLIC_API_URL

// ✅ Good: Private variables (server-only)
const apiKey = import.meta.env.API_KEY

// ❌ Bad: No prefix (not accessible)
const secret = import.meta.env.SECRET  // undefined!
```

**.env file:**
```
PUBLIC_API_URL=https://api.example.com
API_KEY=secret-key-here
```

**Important:** Only `PUBLIC_*` variables are available in client-side code.

### API Routes

Create API endpoints in `src/pages/api/`:

```typescript
// src/pages/api/contact.ts
import type { APIRoute } from 'astro'

export const POST: APIRoute = async ({ request }) => {
  const data = await request.json()

  // Process form submission
  // ...

  return new Response(
    JSON.stringify({ success: true }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  )
}
```

Accessible at `/api/contact`

---

## Modern React Patterns

**Note:** These patterns apply only to React islands (`.jsx`/`.tsx` files used with `client:*` directives), not Astro components.

### Function Components and Hooks

New React components should use function components with hooks:

```jsx
// ❌ Avoid: Class components (except ErrorBoundary)
class MyComponent extends React.Component { ... }

// ✅ Prefer: Function components
function MyComponent({ prop }) {
  const [state, setState] = useState(null)
  return <div>{state}</div>
}
```

**Avoid legacy patterns:**
- `UNSAFE_*` lifecycle methods
- `findDOMNode`
- String refs (use `useRef`)
- `defaultProps` on function components (use default parameters)

### Hooks Best Practices

**Rules of Hooks:**
- Never disable `react-hooks/exhaustive-deps` without explicit approval
- Keep effect dependency arrays accurate; refactor if too complex

```jsx
// ❌ Bad: Disabling the rule
useEffect(() => {
  fetchData(id)
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [])

// ✅ Good: Proper dependencies
useEffect(() => {
  fetchData(id)
}, [id])
```

**Derived state vs effects:**
```jsx
// ❌ Bad: Using effect for derived value
const [fullName, setFullName] = useState('')
useEffect(() => {
  setFullName(`${firstName} ${lastName}`)
}, [firstName, lastName])

// ✅ Good: Derive in render
const fullName = `${firstName} ${lastName}`
```

**Memoization guidance:**
- Use `useMemo` and `useCallback` only when needed (hot paths, expensive calculations)
- Don't wrap everything by default

### State Management

- Prefer **local state + context** for UI state
- Don't duplicate server state; consider data-fetching libraries (TanStack Query)
- Colocate data fetching near components

---

## Automation & CI/CD

### Pre-Commit Hooks

Set up Git hooks to enforce quality checks before every commit:

**Hook Location:** `.githooks/pre-commit`

**Installation:**
```bash
npm run install-hooks  # Or: git config core.hooksPath .githooks
```

**Auto-install:** Add to package.json:
```json
{
  "scripts": {
    "install-hooks": "git config core.hooksPath .githooks",
    "prepare": "git config core.hooksPath .githooks"
  }
}
```

**Pre-commit Hook Template:**
```bash
#!/bin/bash
# Pre-commit hook - runs quality checks before allowing commit

echo "🔍 Running pre-commit checks..."

FAILED=0

# 1. Lint
echo "📝 Running ESLint..."
npm run lint --silent || { echo "❌ ESLint failed"; FAILED=1; }

# 2. Format
echo "🎨 Checking formatting..."
npm run format:check --silent || { echo "❌ Formatting failed"; FAILED=1; }

# 3. Astro check
echo "🚀 Running Astro check..."
npm run astro check --silent || { echo "❌ Astro check failed"; FAILED=1; }

# 4. Tests
echo "🧪 Running tests..."
npm run test:run --silent || { echo "❌ Tests failed"; FAILED=1; }

# 5. Security (warn only)
echo "🔒 Security audit..."
npm run security:check --silent 2>/dev/null || echo "⚠️ Security issues detected"

if [ $FAILED -ne 0 ]; then
    echo "❌ Pre-commit checks failed"
    echo "To bypass (not recommended): git commit --no-verify"
    exit 1
fi

echo "✅ All checks passed!"
```

**What It Enforces:**
- ✅ ESLint passes with zero warnings
- ✅ Prettier formatting is correct
- ✅ Astro type checking passes
- ✅ All tests pass (E2E with Playwright)
- ⚠️ Security vulnerabilities are flagged (warning only)

**Bypassing (emergency only):**
```bash
git commit --no-verify  # Skip hooks - use with caution!
```

### Dependabot Configuration

`.github/dependabot.yml`:
```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
    open-pull-requests-limit: 5
    groups:
      production-dependencies:
        dependency-type: "production"
        update-types: ["minor", "patch"]
      development-dependencies:
        dependency-type: "development"
        update-types: ["minor", "patch"]
    labels:
      - "dependencies"
      - "automated"

  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "monthly"
    open-pull-requests-limit: 3
```

### Scheduled Security Audit

`.github/workflows/scheduled-security-audit.yml`:
```yaml
name: Scheduled Security Audit
on:
  schedule:
    - cron: '0 9 * * *'  # Daily at 9 AM UTC
  workflow_dispatch:

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm audit --audit-level=high
```

---

## Review Checklist

Use this checklist when reviewing any Astro development work:

### Code Quality
- [ ] ESLint passes with zero warnings
- [ ] Prettier formatting passes
- [ ] No unused variables or imports
- [ ] No console.log statements in production code
- [ ] Astro type checking passes (`npm run astro check`)

### Testing
- [ ] All existing tests pass
- [ ] New features have corresponding E2E tests (Playwright)
- [ ] React islands have unit tests (Vitest + RTL)
- [ ] Edge cases are tested (empty states, errors, loading)

### Security
- [ ] npm audit shows zero high/critical vulnerabilities
- [ ] External links have `rel="noopener noreferrer"`
- [ ] No secrets in code or logs
- [ ] Security headers configured

### Performance
- [ ] Minimal JavaScript shipped (islands only)
- [ ] Images optimized (using Astro `<Image>` component)
- [ ] Appropriate `client:*` directives used
- [ ] Static components use `.astro` (not React)
- [ ] Lighthouse Performance score 90+ (aim for 100)

### Accessibility
- [ ] All images have meaningful alt text
- [ ] Keyboard navigation works
- [ ] ARIA labels on icon-only buttons
- [ ] Proper heading hierarchy (h1 → h2 → h3)
- [ ] Playwright accessibility tests pass

### SEO
- [ ] SEO component used on all pages
- [ ] Sitemap auto-generated (@astrojs/sitemap)
- [ ] robots.txt configured
- [ ] RSS feed configured (if blog)
- [ ] PWA manifest with required icons

### Error Handling
- [ ] 404.astro page exists
- [ ] 500.astro page exists (if needed)
- [ ] React islands wrapped in ErrorBoundary

### Build
- [ ] Production build succeeds (`npm run build`)
- [ ] No build warnings
- [ ] Preview works correctly (`npm run preview`)
- [ ] Build outputs to `dist/` correctly

### Astro-Specific
- [ ] Content Collections use Zod schemas
- [ ] Static content uses `.astro` components
- [ ] Interactive components use React islands with appropriate `client:*` directive
- [ ] Environment variables properly prefixed (`PUBLIC_*` for client-side)
- [ ] No unnecessary JavaScript shipped

---

## Project-Specific Notes (Beyond Writing Code)

### Current Implementation Status

**Completed:**
- ✅ Astro 5.16.6 with React islands
- ✅ Content Collections for blog posts (74 posts from 2025)
- ✅ Static pages: home, about, book, art, contact, resume, terms, privacy
- ✅ Dynamic routing for posts: `/year/month/day/slug`
- ✅ Category pages (27 categories)
- ✅ RSS feed at `/feed.xml`
- ✅ Sitemap auto-generated
- ✅ Playwright E2E tests (25 tests, 4 test files)
- ✅ Pre-commit hooks (type-check and build)
- ✅ GitHub Actions CI workflow
- ✅ React islands: Header (mobile menu), KitForm (newsletter)

**Not Yet Implemented:**
- ⏸️ ESLint configuration
- ⏸️ Prettier configuration
- ⏸️ Unit tests for React islands (Vitest + RTL)
- ⏸️ Visual regression testing
- ⏸️ Accessibility testing with axe-core

### Key Design Decisions

1. **Zero JavaScript by default** - Only Header and KitForm use React islands
2. **Content in HTML source** - Solves Medium/Substack import problems
3. **Self-hosted fonts** - No Google Fonts for better CSP and performance
4. **Minimal bundle** - ~63KB gzipped total JavaScript
5. **WordPress-compatible URLs** - `/year/month/day/slug` pattern

### Project Structure

```
bwc-astro/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml                 # CI pipeline with Playwright
│   │   └── security-audit.yml      # Daily security checks
│   └── dependabot.yml             # Weekly dependency updates
├── .githooks/
│   └── pre-commit                 # Type-check and build before commit
├── e2e/                           # Playwright E2E tests
│   ├── navigation.spec.ts
│   ├── posts.spec.ts
│   ├── seo.spec.ts
│   └── content.spec.ts
├── docs/
│   └── DEVELOPMENT_GUIDE.md       # This file
├── public/
│   ├── images/                    # Static images (posts, about, art)
│   ├── fonts/                     # Self-hosted WOFF2 fonts
│   ├── audio/                     # Audio files
│   └── favicon-32x32.png
├── src/
│   ├── components/
│   │   ├── Header.jsx             # React island for mobile menu
│   │   └── KitForm.jsx            # React island for newsletter
│   ├── content/
│   │   ├── config.ts              # Zod schema for posts
│   │   └── posts/2025/            # 74 markdown blog posts
│   ├── layouts/
│   │   └── Layout.astro           # Main layout with SEO
│   ├── pages/
│   │   ├── index.astro            # Home page
│   │   ├── about.astro
│   │   ├── book.astro
│   │   ├── art.astro
│   │   ├── contact.astro
│   │   ├── resume.astro
│   │   ├── terms.astro
│   │   ├── privacy.astro
│   │   ├── posts.astro            # Posts listing
│   │   ├── feed.xml.js            # RSS feed
│   │   ├── [year]/[month]/[day]/[slug].astro  # Post detail
│   │   └── category/[category].astro           # Category pages
│   └── styles/
│       └── global.css             # Global styles with CSS variables
├── astro.config.mjs               # Astro config with redirects
├── playwright.config.ts           # Playwright configuration
├── BUILD_SUMMARY.md               # Build statistics and info
└── README.md                      # Project documentation
```

### RSS Feed Implementation

The RSS feed at `/feed.xml` includes:
- Full post content (HTML)
- Categories
- Publication dates
- Proper `<link>` elements

**Important:** The feed content function currently returns empty string. This should be updated to render actual post content for RSS readers.

### Testing Strategy

**Primary: E2E with Playwright**
- All critical user flows
- Content visibility verification
- SEO requirements
- Navigation and routing
- Form submission (newsletter)

**Future: Unit tests for islands**
- SearchBar (when implemented)
- Any future interactive components

### Performance Targets

Current build stats:
- **Total pages:** 110
- **Build time:** ~3.5 seconds
- **JavaScript bundle:** ~63KB gzipped
- **Lighthouse Performance:** 100/100 (target)

---

## Version History

- **2025-12-24**: Adapted for Astro from React/Vite guide
  - Changed testing approach to Playwright E2E (primary) + Vitest for islands/utils
  - Updated build output to `dist/` directory
  - Added Astro project structure section
  - Added SEO patterns using Astro-specific approaches (@astrojs/sitemap, RSS)
  - Added error handling with Astro error pages
  - Added Astro-Specific Patterns section (Content Collections, islands, layouts)
  - Emphasized zero-JS default performance advantage
  - Updated all code examples to Astro patterns
  - Kept all core principles: security, accessibility, quality standards

---

**This is a living document. Update it when new patterns, tools, or requirements emerge.**
