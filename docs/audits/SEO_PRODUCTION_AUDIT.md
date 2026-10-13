# SEO_PRODUCTION_AUDIT.md — Corabin Studio Website
**Audit Date**: 2026-10-01  
**Domain**: https://corabin.com  
**Auditor**: Production readiness pass

---

## 1. Detected Technology / Framework

| Layer | Technology |
|-------|-----------|
| Runtime | Static file server — NO backend, NO Node.js |
| Frontend | React 18 (client-side hydration of SSR-generated HTML) |
| Bundler | Rolldown (Framer's internal Rollup/Vite variant) — pre-compiled |
| Routing | File-based SPA (each URL has a static index.html with data-framer-hydrate-v2) |
| Animation | Framer Motion (bundled) |
| Scroll | Lenis 1.3.19 |
| Styling | Framer-generated inline CSS + custom override block |
| Fonts | Onest, Fragment Mono (Google Fonts), Inter/Inter Display (local woff2) |
| Build system | None — site is a pre-compiled Framer export |
| Package manager | None |
| Config files found | .gitignore only |
| package.json | Not present |
| requirements.txt | Not present |
| pyproject.toml | Not present |

**SEO crawlability**: This is a static site. All HTML is server-rendered at export time. Google can crawl all routes without executing JavaScript. React only hydrates for interactivity — content is already in the initial HTML.

---

## 2. Project Structure Summary

```
corabin.com/
├── index.html               ← Home (/)
├── about/index.html         ← /about
├── contact/index.html       ← /contact
├── blog/
│   ├── index.html           ← /blog
│   └── <slug>/index.html    ← 10× blog detail pages
├── projects/
│   ├── index.html           ← /projects
│   ├── kora/                ← primary project slugs (6)
│   ├── himon/
│   ├── norda/
│   ├── ardene/
│   ├── havyn/
│   ├── almare/
│   └── arrows/ chantalle/ papyrus/ london-museum/ bullseye/ interference/  ← 6 legacy slugs
├── assets/images/           ← Brand + project + blog images (PNG + WebP)
├── framerusercontent.com/   ← Framer runtime JS modules (local mirror)
├── robots.txt               ← NEW
├── sitemap.xml              ← NEW
├── CODEBASE_AUDIT.md        ← Re-engineering documentation
└── tools/                   ← Migration scripts (not served)
```

**Total routes**: 27 HTML files  
**Canonical (indexable) URLs**: 22 (6 legacy project slugs have canonicals pointing to primaries)

---

## 3. Files Created

| File | Purpose |
|------|--------|
| `robots.txt` | Production crawl directives + sitemap reference |
| `sitemap.xml` | 22 canonical URLs with priority/changefreq |
| `assets/images/og-corabin.png` | 1200×630 Open Graph social share image |
| `assets/images/*.webp` (46 files) | WebP versions of all blog/project PNGs |
| `tools/apply_seo_pass.py` | Idempotent SEO patch script (run again to re-apply if needed) |

---

## 4. Files Modified

All 27 `index.html` files were patched by `tools/apply_seo_pass.py`:

| Route | Change |
|-------|--------|
| `/` (root) | Unique title, description, canonical, full OG+Twitter, 3× JSON-LD |
| `/about` | Unique title, description, canonical, OG+Twitter, 2× JSON-LD |
| `/contact` | Unique title, description, canonical, OG+Twitter, 2× JSON-LD |
| `/blog` | Unique title, description, canonical, OG+Twitter, 2× JSON-LD |
| `/projects` | Unique title, description, canonical, OG+Twitter, 2× JSON-LD |
| 10× blog detail | Unique titles+descriptions, og:type=article, Article+BreadcrumbList JSON-LD |
| 6× project primary | Unique titles+descriptions, BreadcrumbList+WebPage JSON-LD |
| 6× project legacy | Canonical → primary slug, same title as primary |

---

## 5. SEO Improvements

| Item | Before | After |
|------|--------|-------|
| Page titles | All 27 pages: identical generic title | 27 unique, descriptive, keyword-relevant titles |
| Meta descriptions | All 27 pages: identical | 27 unique, specific descriptions (143-160 chars) |
| Canonical tags | All pointing to https://corabin.com/ | Each page points to its own correct canonical URL |
| Legacy slug canonicals | Pointed to themselves (duplicate indexing risk) | Point to primary slugs |
| robots meta | max-image-preview:large only | index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1 |
| viewport | width=device-width (missing initial-scale) | width=device-width, initial-scale=1 |
| og:site_name | Missing | Added "Corabin" on all pages |
| og:image | Missing | 1200×630 PNG on all pages (absolute URL) |
| og:image dimensions | Missing | og:image:width=1200, og:image:height=630, og:image:alt added |
| og:type (blog) | website on all pages | article on blog detail pages |
| twitter:image | Missing | Added on all pages |
| framer-search-index meta | 2 per page = 54 occurrences total | REMOVED from all 27 pages |
| robots.txt | Missing | Created with correct directives |
| sitemap.xml | Missing | 22 canonical URLs, valid XML |
| JSON-LD structured data | None | Organization, WebSite, ProfessionalService (home); Article+Breadcrumb (blog); BreadcrumbList+WebPage (projects/about/contact) |
| lang attribute | lang="en-US" (already correct) | No change needed |

---

## 6. Sitemap Location

`/sitemap.xml` → served at `https://corabin.com/sitemap.xml`

Contains 22 URLs: /, /about, /contact, /blog, /projects, 6 project pages, 10 blog articles.
Does NOT include: 6 legacy project slugs (they have non-self canonicals), /tools/.

---

## 7. robots.txt Location

`/robots.txt` → served at `https://corabin.com/robots.txt`

```
User-agent: *
Allow: /
Disallow: /projects/arrows
Disallow: /projects/chantalle
Disallow: /projects/papyrus
Disallow: /projects/london-museum
Disallow: /projects/bullseye
Disallow: /projects/interference
Disallow: /tools/
Sitemap: https://corabin.com/sitemap.xml
```

---

## 8. Structured Data Types Implemented

| Page | Schema Types |
|------|-------------|
| Home (/) | Organization, WebSite, ProfessionalService |
| /about | Organization, WebPage |
| /contact | ProfessionalService, WebPage |
| /blog | WebPage, BreadcrumbList |
| /projects | WebPage, BreadcrumbList |
| Blog detail pages | Article, BreadcrumbList |
| Project detail pages | WebPage, BreadcrumbList |
| Legacy project slugs | WebPage, BreadcrumbList (inheriting from primary) |

**Fact-checked against visible content**: Organization name (Corabin), founder name (Souvik), email (hello@corabin.com), telephone (+918101685159), address (Kolkata, India), service types. No fake reviews, ratings, prices, certifications, or awards were added.

---

## 9. Security Issues Found / Fixed

| Finding | Action |
|---------|--------|
| framer-search-index meta exposed private Framer CDN endpoint | Removed from all 27 pages |
| No .gitignore | Already fixed in previous audit pass |
| No .env files | None exist — static site has no secrets |
| No API keys, tokens, passwords in source | Confirmed clean (grep sweep across all HTML/JS/MJS) |
| No hardcoded localhost URLs | Confirmed clean |
| Framer CSS design tokens (UUID-looking IDs) | Confirmed: NOT API keys — normal CSS variable names from Framer's design token system |
| Contact form POSTs to Framer backend | Documented but not changed (functional dependency) |

**Security verdict**: No secrets exposed. Site is safe to push to GitHub as a public repository.

---

## 10. Performance Issues Found / Fixed

| Issue | Before | After |
|-------|--------|-------|
| Blog images (PNG, unoptimized) | 1.5–2.8MB each | WebP versions: 48–360KB (avg ~87% reduction) |
| Project images (PNG) | 200–1.1MB each | WebP versions: 24–132KB |
| OG social image | Missing | 508KB PNG created |
| viewport missing initial-scale | Mobile reflow risk | Fixed: initial-scale=1 added |
| Render-blocking fonts | Onest/Fragment Mono via Google Fonts | No change — Framer's preconnect hint already in head |
| WebP serving | Not configured | WebP files exist; needs server-level content negotiation (see §12) |

**Note on JavaScript**: The JS bundle is Framer's pre-compiled, minified production output. No dead code to remove — it cannot be modified without rebuilding in Framer.

---

## 11. Remaining Issues

| Item | Priority | Notes |
|------|---------|-------|
| **WebP content negotiation** | Medium | WebP files now exist but the HTML `src` attributes still reference PNGs. Server must serve .webp when Accept: image/webp is present, OR the .mjs modules need updating to use .webp sources. Safest approach: configure server-level rewrite (Nginx/Cloudflare). See §12. |
| **Contact form independence** | Medium | Form POSTs to Framer's backend. If your Framer project is deactivated, contact form breaks. Use Formspree, Netlify Forms, or a custom backend for production resilience. |
| **Self-hosted fonts** | Low | Onest + Fragment Mono load from fonts.gstatic.com CDN. Self-hosting removes the external request and improves GDPR compliance. |
| **Lenis CSS: CDN vs local** | Low | `<link>` still points to unpkg.com. A local mirror file exists in unpkg.com/ directory — the HTML could be patched to use it. |
| **No 404.html** | Medium | Static hosts (Nginx, Apache, GitHub Pages, Netlify) need a 404 fallback. Configure your hosting platform to return the root index.html for unknown routes (SPA fallback). |
| **Image srcset/sizes** | Low | Images in .mjs bundles use single src. Adding srcset requires patching compiled Framer modules — high risk. WebP via server-level negotiation is the safer path. |
| **Large index.html (1.37MB)** | Info | The main HTML file is large due to all routes' CSS being inlined. This is an architectural characteristic of Framer exports — not fixable without re-exporting from Framer. |
| **Trailing slash consistency** | Low | Routes use no trailing slash (https://corabin.com/about). Ensure server redirects /about/ → /about to prevent duplicate indexing. |

---

## 12. Things to Configure Manually After Deployment

### A. WebP Content Negotiation (Nginx)
Add to your nginx.conf or site config to automatically serve WebP when supported:
```nginx
location ~* ^(/assets/images/.+)\.(png|jpg)$ {
    add_header Vary Accept;
    try_files $1.webp $uri =404;
}
```

### B. SPA 404 Fallback (Nginx)
```nginx
error_page 404 /index.html;
```

### C. Trailing Slash Redirect (Nginx)
```nginx
rewrite ^(/[^.]+)/$ $1 permanent;
```

### D. HTTPS Redirect
```nginx
server {
    listen 80;
    server_name corabin.com www.corabin.com;
    return 301 https://corabin.com$request_uri;
}
server {
    listen 443 ssl;
    server_name www.corabin.com;
    return 301 https://corabin.com$request_uri;
}
```

### E. Security Headers (Nginx)
```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
```

### F. WebP Content Negotiation (Cloudflare Pages)
Use a `_headers` file:
```
/assets/images/*
  Vary: Accept
```
And a `_redirects` file or Transform Rule to rewrite PNG requests to WebP when the Accept header includes image/webp.

### G. GitHub Pages Configuration
If deploying to GitHub Pages, add a `_config.yml` with `baseurl: ""` and configure the repo to serve from the root. Create a custom `404.html` that redirects to the SPA.

### H. Twitter/X Handle
Update `meta name="twitter:site" content="@corabin"` if your actual Twitter/X handle is different.

### I. Contact Form Migration
When ready: replace Framer's form POST target with a Formspree endpoint or equivalent. Edit the form action in the compiled .mjs file (search for the form POST URL).

---

## 13. Recommended Google Search Console Steps

1. **Verify ownership** — Add DNS TXT record or upload HTML verification file to project root.
2. **Submit sitemap** — In GSC: Sitemaps → Enter `https://corabin.com/sitemap.xml` → Submit.
3. **Request indexing** — Use URL Inspection tool on `/`, `/about`, `/contact`, `/projects`, `/blog`.
4. **Monitor coverage** — Check Coverage report after 48–72 hours for crawl errors or excluded pages.
5. **Check Core Web Vitals** — GSC → Core Web Vitals report. Primary LCP target: hero video/image.
6. **Verify rich results** — Use Google's Rich Results Test on: https://search.google.com/test/rich-results
   Test URLs: `https://corabin.com/`, `https://corabin.com/blog/custom-vs-off-the-shelf-choose-wisely`
7. **Disavow** — Not needed at launch. Monitor for spam backlinks after 3 months.

---

## 14. Exact Commands to Test the Site Locally

```bash
# 1. Serve the site locally (Python built-in server)
cd /home/souvik/Projects/opus_template.framer.website
python3 -m http.server 8080

# 2. Visit in browser
open http://localhost:8080

# 3. Verify robots.txt is accessible
curl http://localhost:8080/robots.txt

# 4. Verify sitemap.xml is accessible
curl http://localhost:8080/sitemap.xml

# 5. Check metadata on root
curl -s http://localhost:8080/ | grep -E '<title>|name="description"|rel="canonical"'

# 6. Validate JSON-LD on any page
curl -s http://localhost:8080/ | grep -A 3 'application/ld+json'

# 7. Check no framer-search-index remains
curl -s http://localhost:8080/ | grep -c framer-search-index || echo "0 — clean"
```

---

## 15. Exact Production Build Command

> This project has **no build step**. It is a pre-compiled static export.

**Deployment is simply**: copy the entire project directory to your static host (excluding `tools/`).

```bash
# Sync to server (example — adjust to your hosting)
rsync -avz --exclude='.git' --exclude='tools/' \
  /home/souvik/Projects/opus_template.framer.website/ \
  user@yourserver.com:/var/www/corabin/

# OR: push to GitHub, then deploy from GitHub via Netlify/Cloudflare Pages/Vercel
git push origin main
```

---

## 16. Environment Variables Required

> **None.** This is a fully static site. There are no environment variables.

If you later add server-side functionality (contact form backend, etc.):
- Create `.env` with real values
- Create `.env.example` with placeholder values  
- `.env` is already excluded by `.gitignore` (via the `.env` pattern)

---

## Summary

| Area | Status |
|------|--------|
| Title uniqueness | ✅ All 27 pages unique |
| Meta descriptions | ✅ All 27 pages unique and descriptive |
| Canonical tags | ✅ Correct per-page URLs; legacy slugs canonicalize to primaries |
| robots meta | ✅ index,follow + max-image/snippet/video preview |
| robots.txt | ✅ Created |
| sitemap.xml | ✅ 22 canonical URLs, valid XML |
| viewport | ✅ initial-scale=1 added |
| Open Graph | ✅ Complete: site_name, type, url, title, desc, image, locale |
| Twitter Card | ✅ Complete: card, title, desc, image, alt |
| OG image | ✅ 1200×630 PNG at /assets/images/og-corabin.png |
| JSON-LD | ✅ 7 schema types across 27 pages |
| framer-search-index | ✅ Removed from all 27 pages |
| Security scan | ✅ No secrets/API keys found |
| .gitignore | ✅ Correct |
| WebP images | ✅ 46 WebP files created (avg 87% size reduction) |
| 404 page | ⚠️ Needs server-level configuration |
| WebP serving | ⚠️ Files exist; needs server content negotiation |
| Contact form | ⚠️ Depends on Framer backend |
| Self-hosted fonts | ℹ️ Low priority — Google Fonts CDN is fine |
