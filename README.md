# Beyond Writing Code - Astro Implementation

A modern, static site generation (SSG) implementation of Beyond Writing Code using Astro with Content Collections.

## Overview

This is an Astro implementation built to solve the critical problem of content visibility in HTML source. The previous SPA version only had `<div id="root"></div>` in the source, which broke:

- ✅ Medium import (needs content in HTML source)
- ✅ Substack import (needs content in HTML source)
- ✅ LinkedIn copy/paste (needs images in markup)
- ✅ RSS feed readers (needs real HTML with images)

## Tech Stack

- **Astro 5.16.6** - Static site generator
- **React 19** - For interactive components (islands)
- **Content Collections** - Type-safe content management with Zod
- **@astrojs/rss** - RSS feed generation
- **@astrojs/sitemap** - Automatic sitemap generation
- **date-fns** - Date formatting

## Project Structure

```
bwc-astro/
├── src/
│   ├── content/
│   │   ├── config.ts           # Content Collections schema
│   │   └── posts/
│   │       └── 2025/*.md       # 74 blog posts
│   ├── layouts/
│   │   └── Layout.astro        # Main layout with SEO
│   ├── components/
│   │   ├── Header.jsx          # Navigation (React island)
│   │   └── KitForm.jsx         # Newsletter form (React island)
│   ├── pages/
│   │   ├── index.astro         # Home page
│   │   ├── about.astro         # About page
│   │   ├── book.astro          # Book page
│   │   ├── art.astro           # Art gallery
│   │   ├── contact.astro       # Contact page
│   │   ├── posts.astro         # Posts listing
│   │   ├── feed.xml.js         # RSS feed
│   │   ├── [year]/[month]/[day]/[slug].astro  # Post detail (dynamic)
│   │   └── category/[category].astro           # Category pages (dynamic)
│   └── styles/
│       └── global.css          # Global styles with CSS variables
├── public/
│   ├── images/                 # Post images, about images, art
│   ├── fonts/                  # Self-hosted fonts
│   └── favicon-32x32.png
├── astro.config.mjs            # Astro configuration
└── BUILD_SUMMARY.md            # Detailed build summary
```

## Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Features

### Content Management

- **74 blog posts** with frontmatter metadata
- **Content Collections** with Zod schema validation
- **Categories & tags** for organization
- **Featured images** for posts
- **Draft mode** via `published: false` flag
- **Dual dates** - `date` (for URL) and `originalDate` (for republished content)

### URL Structure

Posts use WordPress-compatible URL pattern: `/:year/:month/:day/:slug`

Example: `/2025/12/09/ai-and-i-built-a-website-yesterday`

### SEO

- Meta tags (title, description)
- Open Graph tags
- Twitter Card tags
- Canonical URLs
- Sitemap (auto-generated)
- RSS feed at `/feed.xml` (with redirect from `/feed`)

### Performance

- Static site generation (no runtime JavaScript needed for content)
- React islands for interactivity (Header menu, KitForm)
- Self-hosted fonts (no Google Fonts)
- Minimal JavaScript bundle (~63KB gzipped)

### Styling

- CSS custom properties for theming
- Responsive design (mobile-first)
- Self-hosted Cormorant Garamond (serif) and Fira Sans (sans-serif) fonts
- Component-scoped styles with Astro

## Content Collections Schema

```typescript
{
  title: string,
  date: string,
  originalDate?: string,
  excerpt: string,
  categories?: string[],
  tags?: string[],
  featuredImage?: string,
  published: boolean (default: true),
  comments?: Comment[]
}
```

## Build Output

- **107 pages** generated
- **131MB** total size (includes images)
- **74 blog posts** with proper URL structure
- **27 category pages**
- **RSS feed** (43KB)
- **Sitemap** with index

## Redirects

Configured in `astro.config.mjs`:

- `/newsletter` → `/posts`
- `/legal/terms` → `/terms`
- `/legal/privacy` → `/privacy`
- `/feed` → `/feed.xml`

## Key Components

### React Islands

Only two components use React for interactivity:

1. **Header** - Mobile menu toggle
2. **KitForm** - Newsletter signup (loads Kit.com script)

Everything else is static Astro components.

### Layout System

Single main layout (`Layout.astro`) with:

- SEO meta tags
- Global navigation
- Footer with social links
- Slot for page content

## Adding Content

### New Blog Post

1. Create markdown file in `src/content/posts/YYYY/post-slug.md`
2. Add frontmatter:

```yaml
---
title: 'Your Post Title'
date: '2025-12-24'
excerpt: 'Brief description...'
categories: ['category']
tags: ['tag1', 'tag2']
featuredImage: '/images/posts/2025/image.jpg'
published: true
---
```

3. Write content in Markdown
4. Run `npm run build`

### Drafts

Set `published: false` in frontmatter to exclude from:

- Posts listing
- Category pages
- RSS feed
- Sitemap

The post will still build (for preview) but won't appear in public listings.

## Deployment

**Staging:** https://beyondwritingcodebook.com (DreamHost)

### Automatic Deployment

Every push to `main` automatically deploys to beyondwritingcodebook.com via GitHub Actions.

**Status:** See latest deployment in [Actions](https://github.com/Beyond-Writing-Code/bwc-astro/actions)

### Setup

First-time deployment setup:

1. Follow instructions in `SETUP_DEPLOYMENT.md`
2. Configure GitHub secrets (SSH credentials)
3. Push to `main` to trigger deployment

### Manual Deployment

```bash
# Via GitHub Actions
# Go to Actions → Deploy to DreamHost → Run workflow

# Or via local machine
npm run build
rsync -avz --delete dist/ user@host:~/beyondwritingcodebook.com/
```

See `docs/DEPLOYMENT.md` for full documentation.

## Development

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:4321)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Comparison to React SPA

| Feature                | React SPA | Astro SSG |
| ---------------------- | --------- | --------- |
| Content in HTML source | ❌        | ✅        |
| JavaScript required    | ✅        | ❌        |
| Bundle size            | ~500KB    | ~63KB     |
| SEO-friendly           | ⚠️        | ✅        |
| Medium import works    | ❌        | ✅        |
| Build time             | Fast      | Fast      |
| Maintenance            | Complex   | Simple    |

## License

Copyright 2025 by Jessica Roy.

## Credits

Built according to implementation plan in `/Users/leaf/.claude/plans/vectorized-forging-kahan.md`

Migrated from React SPA at `/Users/leaf/Vibe Coding/bwc-web`
