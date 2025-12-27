# PageSpeed Insights Recommendations

**Generated:** 2025-12-27
**Source:** PageSpeed Insights analysis for beyondwritingcode.com
**Scope:** Performance-specific improvements identified by Google PageSpeed that are not fully covered in IMPROVEMENTS.md

---

## Executive Summary

PageSpeed analysis reveals several high-impact optimization opportunities:

**Desktop Performance:**

- First Contentful Paint: 0.3s ✅ (excellent)
- Largest Contentful Paint: 2.8s ⚠️ (needs improvement - target <2.5s)
- Total Blocking Time: 20ms ✅ (excellent)
- Cumulative Layout Shift: 0.008 ✅ (excellent)

**Mobile Performance:**

- First Contentful Paint: 2.0s ⚠️ (needs improvement)
- Largest Contentful Paint: 3.8s ❌ (poor - target <2.5s)
- Total Blocking Time: 0ms ✅ (excellent)
- Cumulative Layout Shift: 0 ✅ (excellent)

**Critical Issues:**

1. **Image optimization** - 2,991 KiB savings opportunity (HIGHEST PRIORITY)
2. **Render-blocking resources** - 650ms savings on mobile
3. **Font display strategy** - 170-230ms savings

---

## 1. Image Optimization (CRITICAL PRIORITY)

**Impact:** Est. savings of **2,991 KiB** (~3 MB)
**Current issue:** Largest performance bottleneck
**Affects:** Both desktop and mobile

### Problem

Images account for the majority of page weight (3,310 KiB total payload). PageSpeed identifies nearly 3MB of potential savings through:

- Serving images in modern formats (WebP/AVIF)
- Properly sizing images for different viewports
- Compressing images more aggressively

### Recommended Actions

#### 1.1 Convert to Modern Image Formats

Replace JPEG/PNG images with WebP or AVIF:

```astro
<picture>
  <source srcset="/images/post.avif" type="image/avif" />
  <source srcset="/images/post.webp" type="image/webp" />
  <img src="/images/post.jpg" alt="Post image" loading="lazy" />
</picture>
```

**Expected savings:** 40-50% file size reduction

#### 1.2 Use Astro's Image Component

Replace raw `<img>` tags with Astro's optimized `<Image>` component:

```astro
---
import { Image } from 'astro:assets';
import postImage from '../assets/my-post.jpg';
---

<Image
  src={postImage}
  alt="Post image"
  widths={[400, 800, 1200]}
  sizes="(max-width: 640px) 100vw, 800px"
  loading="lazy"
  format="webp"
/>
```

Benefits:

- Automatic format conversion
- Responsive srcset generation
- Build-time optimization
- Lazy loading by default

#### 1.3 Implement Build-Time Image Pipeline

Add sharp for image processing:

```bash
npm install sharp
```

Create image optimization script:

```javascript
// scripts/optimize-images.js
import sharp from 'sharp';
import { glob } from 'glob';

const images = await glob('public/images/**/*.{jpg,png}');

for (const image of images) {
  await sharp(image)
    .resize(1200, null, { withoutEnlargement: true })
    .webp({ quality: 85 })
    .toFile(image.replace(/\.(jpg|png)$/, '.webp'));
}
```

**Estimated effort:** 3-4 hours
**Priority:** CRITICAL (3MB savings is massive)

---

## 2. Eliminate Render-Blocking Resources (HIGH PRIORITY)

**Impact:** 200ms desktop, **650ms mobile** savings
**Current issue:** CSS and fonts block initial render
**Affects:** Mobile users significantly

### Problem

Render-blocking resources prevent the browser from displaying content until they're downloaded and processed. Mobile shows 650ms delay - this is substantial.

### Likely Culprits

1. External or large CSS files
2. Font files loaded synchronously
3. Inline critical CSS not implemented

### Recommended Actions

#### 2.1 Inline Critical CSS

Extract and inline above-the-fold CSS in `<head>`:

```astro
---
// Layout.astro
const criticalCSS = `
  /* Inline only critical styles for above-fold content */
  body { font-family: 'Fira Sans', sans-serif; margin: 0; }
  header { /* ... */ }
  /* Keep to <14KB total */
`;
---

<head>
  <style set:html={criticalCSS}></style>
  <link rel="stylesheet" href="/styles/global.css" media="print" onload="this.media='all'" />
</head>
```

#### 2.2 Preconnect to Required Origins

If using external resources:

```html
<link rel="preconnect" href="https://leafjessicaroy.kit.com" />
<link rel="dns-prefetch" href="https://leafjessicaroy.kit.com" />
```

#### 2.3 Defer Non-Critical CSS

Load non-critical stylesheets asynchronously:

```html
<link rel="stylesheet" href="/styles/non-critical.css" media="print" onload="this.media='all'" />
<noscript>
  <link rel="stylesheet" href="/styles/non-critical.css" />
</noscript>
```

**Estimated effort:** 2-3 hours
**Priority:** HIGH (650ms is significant on mobile)

---

## 3. Optimize Font Loading Strategy (HIGH PRIORITY)

**Impact:** 170-230ms savings
**Current issue:** Fonts block text rendering
**Affects:** Both desktop and mobile

### Problem

Fonts are loaded without `font-display` property, causing Flash of Invisible Text (FOIT) and blocking render.

### Current Font Loading

Likely using `@font-face` without display strategy:

```css
@font-face {
  font-family: 'Fira Sans';
  src: url('/fonts/fira-sans.woff2') format('woff2');
  /* Missing font-display! */
}
```

### Recommended Actions

#### 3.1 Add font-display: swap

Update all `@font-face` declarations:

```css
@font-face {
  font-family: 'Fira Sans';
  src: url('/fonts/fira-sans.woff2') format('woff2');
  font-display: swap; /* Show fallback font immediately */
  font-weight: 400;
  font-style: normal;
}
```

#### 3.2 Preload Critical Fonts

Add to `<head>` for fonts used above the fold:

```html
<link rel="preload" href="/fonts/fira-sans-400.woff2" as="font" type="font/woff2" crossorigin />
<link
  rel="preload"
  href="/fonts/cormorant-garamond-400.woff2"
  as="font"
  type="font/woff2"
  crossorigin
/>
```

Note: Only preload fonts used in initial viewport (typically 1-2 weights).

#### 3.3 Subset Fonts

Reduce font file sizes by including only needed characters:

```bash
# Use glyphhanger or subfont
npx glyphhanger --subset=*.woff2 --formats=woff2
```

For English-only content with limited special characters, can reduce font size by 60-80%.

**Estimated effort:** 30 minutes
**Priority:** HIGH (quick win with significant impact)

---

## 4. Cache Optimization (MEDIUM PRIORITY)

**Impact:** 13 KiB savings
**Current issue:** Suboptimal cache headers

### Problem

Static assets not cached efficiently, causing unnecessary re-downloads.

### Recommended Cache Headers

Configure at hosting provider (Vercel/Netlify):

```javascript
// vercel.json or netlify.toml
{
  "headers": [
    {
      "source": "/fonts/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/images/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/_astro/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/(.*).html",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        }
      ]
    }
  ]
}
```

**Strategy:**

- Static assets (fonts, images, hashed JS/CSS): 1 year cache
- HTML pages: No cache (or short cache with revalidation)

**Estimated effort:** 15 minutes
**Priority:** MEDIUM

---

## 5. Reduce Unused JavaScript (MEDIUM PRIORITY)

**Impact:** 98-99 KiB savings
**Current issue:** JavaScript bundles include unused code

### Problem

While the site uses minimal JavaScript (good!), there's still ~99KB of unused code being shipped.

### Investigation Needed

Use Chrome DevTools Coverage tool to identify unused code:

1. Open DevTools → Coverage tab
2. Reload page
3. Check which JS files have low utilization

### Likely Causes

1. **Kit.com form script** - May include features you don't use
2. **React production bundle** - Even minimal React includes overhead
3. **Polyfills** - May be shipping unnecessary polyfills

### Recommended Actions

#### 5.1 Analyze Bundle Composition

```bash
npm run build -- --mode=production
# Use Rollup Bundle Visualizer or similar
```

#### 5.2 Code Splitting

If multiple React components, ensure they're loaded independently:

```astro
---
// Don't load Header component everywhere if not needed
import Header from '../components/Header';
---

<Header client:load />
```

Already doing this with `client:load` directive - good!

#### 5.3 Consider Alternatives to Kit.com Widget

If Kit.com script is the culprit, consider:

- Using Kit's iframe embed instead (isolated code)
- Custom form with direct API submission (lightest)

**Estimated effort:** 1-2 hours investigation + implementation
**Priority:** MEDIUM (good to have, not critical)

---

## 6. Security Headers (MEDIUM PRIORITY)

**Issues flagged:**

- Ensure CSP is effective against XSS attacks
- Use a strong HSTS policy
- Ensure proper origin isolation with COOP
- Mitigate DOM-based XSS with Trusted Types

### Current State

These are best practice warnings, not vulnerabilities. IMPROVEMENTS.md Section 5.2 covers some of these.

### Additional Headers to Implement

Beyond what's in IMPROVEMENTS.md, add:

```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Resource-Policy: same-origin
```

**Note:** These can break third-party embeds (like Kit.com). Test thoroughly.

**For Trusted Types:**

```
Content-Security-Policy: require-trusted-types-for 'script'
```

**Warning:** Trusted Types requires code changes. May break Kit.com form.

### Recommendation

Start with basic security headers (in IMPROVEMENTS.md), add COOP/COEP only if needed for specific features (SharedArrayBuffer, etc.).

**Estimated effort:** 30 minutes
**Priority:** MEDIUM (best practices, not immediate issues)

---

## 7. Fix Console Errors (MEDIUM PRIORITY)

**Issue:** "Browser errors were logged to the console"

### Action Required

1. Open site in Chrome DevTools
2. Check Console tab for errors
3. Check Issues panel for warnings
4. Fix identified issues

Common issues:

- Mixed content (HTTP resources on HTTPS page)
- Failed resource loads (404s)
- JavaScript errors from third-party scripts
- Deprecated API usage

**Estimated effort:** 30 minutes - 1 hour
**Priority:** MEDIUM (errors can affect functionality)

---

## 8. Long Main-Thread Tasks (LOW PRIORITY)

**Impact:** 1 long task found (desktop only)
**Current:** Total Blocking Time is excellent (20ms), so not critical

### Investigation

Long task is likely:

- Initial JavaScript execution
- Font parsing
- Large DOM manipulation

### If Needed

Use Chrome DevTools Performance tab:

1. Record page load
2. Find long tasks (>50ms)
3. Identify bottleneck
4. Break into smaller chunks or defer

**Priority:** LOW (TBT is already excellent)

---

## Implementation Priority

### Phase 1: Critical (Do First)

1. **Image optimization** - 3MB savings, biggest impact
   - Convert to WebP/AVIF
   - Implement responsive images
   - Use Astro Image component

### Phase 2: High Impact (Do Soon)

2. **Font display strategy** - Add `font-display: swap` (30 min)
3. **Eliminate render blocking** - Critical CSS inlining (2-3 hours)
4. **Cache headers** - Configure hosting (15 min)

### Phase 3: Polish (Do Eventually)

5. **Reduce unused JS** - Bundle analysis and optimization
6. **Fix console errors** - Debug and fix
7. **Security headers** - Add COOP, Trusted Types

---

## Expected Results

After implementing Phase 1 & 2:

**Desktop:**

- LCP: 2.8s → **~1.5s** (target: <2.5s) ✅
- Total payload: 3,310 KiB → **~1,500 KiB** ✅

**Mobile:**

- FCP: 2.0s → **~1.0s** ✅
- LCP: 3.8s → **~2.2s** (target: <2.5s) ✅
- Render blocking: 650ms → **~100ms** ✅

**Overall:** Should achieve "Good" rating for all Core Web Vitals.

---

## Comparison with IMPROVEMENTS.md

**Already covered in IMPROVEMENTS.md:**

- Responsive images (Section 3.2) - but marked LOW priority, PageSpeed shows it's CRITICAL
- Font optimization (Section 3.3) - but doesn't mention `font-display: swap`
- CSP (Section 5.1) - basic coverage
- HSTS (Section 5.2) - mentioned
- Client hydration (Section 3.1) - helps with unused JS

**New in this document:**

- Render-blocking resources (critical for mobile)
- Font-display strategy (quick win)
- Cache headers configuration
- COOP/COEP headers
- Trusted Types
- Console errors investigation
- Specific image optimization targets (3MB!)

**Recommendation:** Treat image optimization and render-blocking elimination as HIGH priority, not LOW. PageSpeed data shows these have the biggest real-world impact.
