# Copilot Instructions for Beyond Writing Code - Astro

## Repository Overview

This is an Astro-based static site generator (SSG) for the Beyond Writing Code blog. It was built to solve content visibility issues in HTML source for better Medium/Substack imports, RSS feeds, and social sharing.

**Key Technologies:**
- **Astro 5.16.6** - Static site generator
- **React 19** - Interactive components (islands architecture)
- **TypeScript** - Type safety
- **Content Collections** - Type-safe content management with Zod schemas
- **Vitest** - Unit testing
- **Playwright** - E2E testing

## Build, Test, and Lint Commands

**Development:**
```bash
npm run dev                  # Start dev server at http://localhost:4321
npm run build                # Build for production
npm run preview              # Preview production build
```

**Testing:**
```bash
npm run test:unit            # Run unit tests (Vitest)
npm run test:unit:watch      # Watch mode for unit tests
npm run test:unit:coverage   # Generate coverage report
npm run test:e2e             # Run E2E tests (Playwright)
npm run test:e2e:ui          # Run Playwright with UI
npm run test:run             # Run all tests (unit + e2e)
```

**Code Quality:**
```bash
npm run lint                 # Run ESLint
npm run lint:fix             # Fix ESLint issues
npm run format               # Format code with Prettier
npm run format:check         # Check formatting
npm run type-check           # Run TypeScript type checking
npm run quality:check        # Run all quality checks + build + tests
npm run security:check       # Run npm audit
```

## Code Style and Conventions

### General
- **Single quotes** for strings (Prettier config)
- **Semicolons** always
- **2-space indentation**
- **100 character line width**
- Trailing commas in ES5 style

### TypeScript
- Use TypeScript for all new files (`.ts`, `.tsx`, `.astro`)
- Prefix unused variables/args with underscore: `_unusedVar`
- No `any` types - use strict typing
- React JSX uses `react-jsx` transform (no need to import React)

### React Components
- Use `.jsx` extension for React components (existing convention)
- Functional components only
- React 19 features available
- No prop-types (disabled in ESLint)
- React in JSX scope not required (automatic JSX runtime)

### Astro Components
- Use `.astro` extension
- Prefer Astro components over React for static content
- Use React islands only when interactivity is needed
- Component styles should be scoped with `<style>` tag

### Console Logging
- Only `console.warn()` and `console.error()` allowed
- Regular `console.log()` triggers warning

## Project Structure

```
src/
├── content/
│   ├── config.ts           # Content Collections schema (Zod)
│   └── posts/
│       └── 2025/*.md       # Blog posts organized by year
├── layouts/
│   └── Layout.astro        # Main layout with SEO meta tags
├── components/
│   ├── Header.jsx          # React island (navigation with mobile menu)
│   └── KitForm.jsx         # React island (newsletter form)
├── pages/
│   ├── index.astro         # Home page
│   ├── [year]/[month]/[day]/[slug].astro  # Dynamic blog post routes
│   ├── category/[category].astro          # Dynamic category pages
│   └── feed.xml.js         # RSS feed generator
├── styles/
│   └── global.css          # Global styles with CSS custom properties
└── test/
    └── setup.ts            # Vitest setup

public/
├── images/                 # Static images (posts, about, art)
└── fonts/                  # Self-hosted fonts (Cormorant Garamond, Fira Sans)

e2e/                        # Playwright E2E tests
```

## Content Management

### Blog Posts

Posts use Content Collections with Zod validation. Frontmatter schema:

```typescript
{
  title: string,              // Required: Post title
  date: string,               // Required: Date for URL (YYYY-MM-DD)
  originalDate?: string,      // Optional: For republished content
  excerpt: string,            // Required: Brief description
  categories?: string[],      // Optional: Post categories
  tags?: string[],           // Optional: Post tags
  featuredImage?: string,    // Optional: Path to featured image
  published: boolean,        // Default: true (false = draft)
  comments?: Comment[]       // Optional: Comment metadata
}
```

**URL Structure:** Posts follow WordPress-compatible pattern: `/:year/:month/:day/:slug`

Example: `/2025/12/09/ai-and-i-built-a-website-yesterday`

### Adding New Posts

1. Create markdown file in `src/content/posts/YYYY/post-slug.md`
2. Add complete frontmatter with all required fields
3. Write content in Markdown
4. Images go in `/public/images/posts/YYYY/`
5. Run `npm run build` to generate routes

### Draft Posts

Set `published: false` in frontmatter to exclude from:
- Posts listing pages
- Category pages
- RSS feed
- Sitemap

Draft posts still build (for preview) but won't appear in public listings.

## Important Constraints

### React Islands
- **Only two React components use client-side JavaScript:**
  - `Header.jsx` - Mobile menu toggle
  - `KitForm.jsx` - Newsletter signup (loads Kit.com script)
- **All other components should be Astro components** (static)
- Add `client:load` directive only when necessary for interactivity

### URL Compatibility
- Maintain WordPress-compatible URL structure for posts
- Don't change existing post URLs (breaks external links)
- Redirects configured in `astro.config.mjs`

### SEO Requirements
- All pages need proper meta tags (title, description, OG, Twitter)
- Canonical URLs must be set correctly
- RSS feed at `/feed.xml` must remain functional
- Sitemap auto-generated by Astro sitemap integration

### Build Output
- Build format: `file` (not `directory`) for clean URLs
- Static generation only (no SSR)
- All 74+ blog posts must build successfully
- Category pages generated dynamically from posts

## Testing Strategy

### Unit Tests (Vitest)
- Test React components in isolation
- Use `@testing-library/react` and `@testing-library/jest-dom`
- Mock external dependencies (Kit.com scripts, etc.)
- Coverage focused on `src/components/**/*.tsx`
- Setup file: `src/test/setup.ts`

### E2E Tests (Playwright)
- Test actual user flows on built site
- Dev server auto-starts at `localhost:4321`
- Only chromium browser configured
- Tests in `e2e/` directory

### CI/CD
- All PRs run: type-check → build → e2e tests → security audit
- Must pass before merging
- Playwright browsers installed automatically in CI

## Development Workflow

1. **Start with the docs:** Check README.md and BUILD_SUMMARY.md for context
2. **Make minimal changes:** This is a production site - surgical modifications only
3. **Test locally:** Always run `npm run dev` to verify changes work
4. **Run quality checks:** Use `npm run lint` and `npm run type-check` before committing
5. **Test the build:** Run `npm run build` to ensure static generation succeeds
6. **Verify E2E tests:** Run `npm run test:e2e` for critical user flows
7. **Check security:** Run `npm run security:check` for dependency vulnerabilities

## Common Pitfalls to Avoid

❌ **Don't** add client-side JavaScript to Astro components unless necessary
❌ **Don't** change the Content Collections schema without updating all posts
❌ **Don't** modify post URLs (breaks external links and SEO)
❌ **Don't** remove or change RSS feed structure (breaks feed readers)
❌ **Don't** add runtime dependencies that increase bundle size
❌ **Don't** remove or disable existing tests without good reason

✅ **Do** use Astro components for static content
✅ **Do** validate changes with `npm run build` before committing
✅ **Do** maintain backward compatibility with existing URLs
✅ **Do** follow the existing code style (Prettier + ESLint)
✅ **Do** add tests for new functionality
✅ **Do** keep the bundle size minimal (currently ~63KB gzipped)

## Deployment

**Production:** https://www.beyondwritingcode.com
**Staging:** https://beyondwritingcodebook.com

- Automatic deployment to staging on every push to `main`
- GitHub Actions workflow: `.github/workflows/deploy.yml`
- Manual deployment possible via Actions UI
- See `SETUP_DEPLOYMENT.md` for configuration details

## Notes for AI Assistants

- This is a **production website** - prioritize stability over features
- Make **minimal, targeted changes** - don't refactor working code
- **Test thoroughly** before suggesting changes go live
- **Respect the existing architecture** (Astro SSG + React islands)
- **Preserve SEO** - don't break URLs, meta tags, or the RSS feed
- **Check bundle size** - avoid adding heavy dependencies
- When in doubt, **ask for clarification** rather than making assumptions
