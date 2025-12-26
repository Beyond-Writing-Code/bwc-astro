# Test URLs

URLs to test for the Beyond Writing Code site.

Replace `BASE_URL` with your target (e.g., `https://quietwoodspath.com` or `https://beyondwritingcode.com`).

## Static Pages (in menu)

- `BASE_URL/` - Home
- `BASE_URL/about` - About
- `BASE_URL/book` - Book
- `BASE_URL/art` - Art
- `BASE_URL/posts` - Posts listing
- `BASE_URL/contact` - Contact

## Static Pages (not in menu)

- `BASE_URL/resume` - Resume
- `BASE_URL/terms` - Terms of service
- `BASE_URL/privacy` - Privacy policy
- `BASE_URL/card` - Card page
- `BASE_URL/recommend` - Recommendations
- `BASE_URL/speaking-at-leaddev-staffplus` - LeadDev speaking page

## Not Found

- `BASE_URL/this-page-does-not-exist` - 404 page

## Blog Posts

### Post with comments

- `BASE_URL/2025/04/25/blog-post-checklist` - Has 2 comments

### Post without comments

- `BASE_URL/2025/06/03/ai-for-developers` - No comments

## Category Page

- `BASE_URL/category/writing` - Writing category

## RSS Feed and Sitemap

- `BASE_URL/feed` - RSS feed
- `BASE_URL/sitemap.xml` - Sitemap

## Redirects (should 301 to new location)

### App-level redirects

- `BASE_URL/newsletter` → `/posts`
- `BASE_URL/connect` → `/contact`
- `BASE_URL/legal/terms-and-conditions` → `/terms`
- `BASE_URL/legal/privacy-policy` → `/privacy`

### .htaccess redirects

- `BASE_URL/recommend/` → `/recommendations` (trailing slash)
- `BASE_URL/newsletter/` → `/posts` (trailing slash)
- `BASE_URL/connect/` → `/contact` (trailing slash)
- `BASE_URL/feed.xml` → `/feed`
- `BASE_URL/comments/feed` → `/feed`
- `BASE_URL/about/` → `/about` (trailing slash removal)

## HTTPS Redirect

- `http://quietwoodspath.com/` → `https://quietwoodspath.com/`
- `http://beyondwritingcode.com/` → `https://beyondwritingcode.com/`

## Security (should return 403 Forbidden)

- `BASE_URL/wp-login.php` - WordPress login blocked
- `BASE_URL/wp-admin/` - WordPress admin blocked
- `BASE_URL/xmlrpc.php` - XML-RPC blocked
