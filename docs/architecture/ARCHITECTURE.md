# Corabin Website — Architecture Reference

**Last Updated:** October 2026  
**Maintained by:** Corabin Engineering

---

## 1. What This Is

Corabin's website is a high-performance **Framer static export** hosted on Vercel. All visual elements, typography, brand colors, motion springs, Lenis smooth scrolling, and responsive breakpoints are generated and owned by Framer.

The custom engineering layer on top of Framer provides:

1. **A Modular Runtime Architecture** (`public/assets/js/`) separating business logic, state management, UI presenters, and API client layers.
2. **Centralized Reactive State Management** (`state/store.js`) ensuring predictable caching, race-condition safety, and single-source-of-truth data flow.
3. **A Scalable REST API Client** (`api/client.js`, `api/supabase.js`) handling timeout protection, request cancellation, and error classification.
4. **Vercel Routing & Clean URL Rewrites** (`vercel.json`) serving `/blog/:slug` via the shared Framer article shell.
5. **Comprehensive Automated Verification** (`scripts/check.sh`, `tools/verify_blog_pages.py`).

---

## 2. Project Directory Structure

```
Corabin.website/
├── public/                               ← Production deploy root (Vercel outputDirectory)
│   ├── assets/
│   │   ├── js/
│   │   │   ├── blog-runtime.js           ← Primary entry point (imported by Framer HTML)
│   │   │   ├── config/                   ← Environment & DOM selector configurations
│   │   │   │   ├── env.js                ← Environment configs & runtime overrides
│   │   │   │   └── selectors.js          ← Framer DOM selectors & layout constants
│   │   │   ├── api/                      ← Scalable API layer
│   │   │   │   ├── client.js             ← Resilient HTTP client (timeout, abort, status checks)
│   │   │   │   ├── supabase.js           ← Supabase REST API service for articles
│   │   │   │   └── cloudinary.js         ← Cloudinary image resolution & responsive srcsets
│   │   │   ├── state/                    ← Centralized reactive state management
│   │   │   │   ├── store.js              ← Reactive Pub/Sub state store
│   │   │   │   └── actions.js            ← State actions, caching, and async workflows
│   │   │   ├── services/                 ← Pure business logic (zero DOM dependencies)
│   │   │   │   ├── article-service.js    ← Post filtering, featured/regular split, related posts
│   │   │   │   └── markdown.js           ← Markdown & Framer AST parsing service
│   │   │   ├── ui/                       ← Modular UI components & animation controllers
│   │   │   │   ├── components/
│   │   │   │   │   ├── card.js           ← Unified blog card component (featured & regular)
│   │   │   │   │   ├── hero.js           ← Article hero (title, author, date, cover)
│   │   │   │   │   ├── body.js           ← Article body content renderer
│   │   │   │   │   ├── share.js          ← Social share links
│   │   │   │   │   ├── related-posts.js  ← Bottom related posts component
│   │   │   │   │   └── error-state.js    ← Graceful fallback & unavailable banner
│   │   │   │   └── animations/
│   │   │   │       └── card-effects.js   ← Scoped CSS keyframes & hover listeners
│   │   │   ├── router/                   ← SPA routing & link normalisation
│   │   │   │   └── router.js
│   │   │   ├── utils/                    ← Pure utility functions
│   │   │   │   ├── date.js               ← Date formatting
│   │   │   │   ├── url.js                ← URL matching, slug parsing
│   │   │   │   ├── dom.js                ← Safe DOM mutations with change detection
│   │   │   │   └── logger.js             ← Centralized error logger
│   │   │   └── modules/                  ← Compatibility facades (keeps check.sh 100% green)
│   │   ├── fonts/                        ← Onest WOFF2 self-hosted fonts
│   │   └── images/                       ← Static visual assets
│   ├── blog/
│   │   ├── index.html                    ← Framer blog listing page
│   │   └── article.html                  ← Shared Framer blog article shell
│   ├── index.html                        ← Framer homepage
│   ├── 404.html                          ← 404 error page
│   ├── _headers                          ← Production HTTP headers (Cloudflare/Netlify)
│   ├── _redirects                        ← Legacy route redirects
│   ├── robots.txt                        ← SEO crawlers config
│   └── sitemap.xml                       ← Canonical sitemap
├── docs/                                 ← Single source of truth documentation
│   ├── architecture/
│   │   ├── ARCHITECTURE.md               ← Technical architecture reference (this file)
│   │   └── CHANGELOG.md                  ← Evolution history
│   ├── audits/                           ← Audit reports
│   └── editorial/                        ← Content standards
├── scripts/                              ← Pre-deploy & automation scripts
│   ├── check.sh                          ← Pre-deploy 20-point validation suite
│   └── dev.sh                            ← Local preview runner
├── tools/                                ← Active developer verification tools
│   ├── dev_server.py                     ← Local HTTP server with clean URL rewrites
│   ├── cdp_helper.mjs                    ← Chrome DevTools Protocol test helper
│   ├── verify_blog_pages.py              ← Headless Chrome 16-route test suite
│   ├── verify_all_pages.py               ← Comprehensive page checker
│   └── verify_production_readiness.py    ← Pre-production assertion
├── archive/                              ← Retired migrations & historical data
│   └── migrations/                       ← Legacy one-off migration scripts
└── vercel.json                           ← Vercel deployment & rewrite configuration
```

---

## 3. Layered Runtime Architecture

The runtime strictly decouples data access, state transitions, business rules, and UI presentations:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Presentation Layer (UI)                         │
│   ui/components/card.js  hero.js  body.js  share.js  related-posts.js  │
│   ui/animations/card-effects.js       ui/components/error-state.js     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ consumes state / triggers actions
┌───────────────────────────────────▼────────────────────────────────────┐
│                        State Management Layer                          │
│   state/store.js (Reactive Store)  │  state/actions.js (Cached Actions)│
└───────────────────┬────────────────────────────────┬───────────────────┘
                    │                                │
┌───────────────────▼─────────────┐    ┌─────────────▼───────────────────┐
│     Business Logic Services     │    │       Scalable API Client       │
│  services/article-service.js    │    │  api/client.js (HttpClient)     │
│  services/markdown.js (AST)     │    │  api/supabase.js (SupabaseApi)  │
│  utils/url.js (Slug & Routes)   │    │  api/cloudinary.js (CDN Assets) │
└─────────────────────────────────┘    └─────────────────────────────────┘
                    │                                │
┌───────────────────▼────────────────────────────────▼───────────────────┐
│                     Foundational Config & Utils                        │
│   config/env.js  config/selectors.js  utils/dom.js  utils/date.js      │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Module Responsibilities

| Subsystem | File | Responsibility |
|-----------|------|----------------|
| **Config** | `config/env.js` | Environment variables, window overrides, validation |
| | `config/selectors.js` | Framer DOM selectors, table columns, static slugs |
| **API** | `api/client.js` | Generic HTTP fetch wrapper with timeout, signal & retry |
| | `api/supabase.js` | Supabase REST client for article data |
| | `api/cloudinary.js` | Cloudinary dynamic media transformations & responsive srcset |
| **State** | `state/store.js` | Centralized Pub/Sub reactive store |
| | `state/actions.js` | Async actions with in-memory caching & deduplication |
| **Services** | `services/article-service.js` | Pure business logic: sorting, filtering, related post algorithm |
| | `services/markdown.js` | Markdown & Framer RichText AST renderer |
| **UI** | `ui/components/card.js` | Unified card presenter (featured, regular, responsive variants) |
| | `ui/components/hero.js` | Article header & meta tags presenter |
| | `ui/components/body.js` | Article content body presenter |
| | `ui/components/share.js` | Social share links presenter |
| | `ui/components/related-posts.js` | Recommendation grid presenter |
| | `ui/components/error-state.js` | Stylized unavailable / 404 notice |
| | `ui/animations/card-effects.js` | Hover listeners & scoped CSS keyframes |
| **Router** | `router/router.js` | SPA routing, link sanitisation, and history patching |
| **Utils** | `utils/date.js` | Date formatting |
| | `utils/url.js` | Slug parsing, URL matching, share URL builders |
| | `utils/dom.js` | Safe DOM query, text/attr change detection |
| | `utils/logger.js` | Centralized level-filtered logger |

---

## 5. State Management & Lifecycle

The centralized `store` manages three reactive slices:
- `posts`: Full list of published posts, indexed `bySlug` cache, partitioned `featured` and `regular` lists.
- `currentArticle`: Active article record, loading state, error code.
- `route`: Current pathname, resolved slug, page type (`home`, `listing`, `article`, `other`).

### Lifecycle per Page Type:
1. **Homepage (`/`)**:
   - `initHomepageFeatured()` loads cached posts.
   - Computes top 3 featured posts.
   - Reconciles `.framer-k7mcxy` / `.framer-3lukgt`.
   - Attaches debounced MutationObserver (60ms) to ensure resilience against Framer hydration.

2. **Blog Listing (`/blog/`)**:
   - `initBlogListing()` loads published posts.
   - Partitions into featured vs regular posts.
   - Syncs featured grid and regular cards container (`.framer-18dht5n`).
   - Clones additional cards dynamically if post count exceeds template slots.
   - Attaches responsive resize and hydration observers.

3. **Article Route (`/blog/:slug`)**:
   - `initSharedBlogArticle()` resolves slug from URL.
   - Dispatches `loadArticle(slug)` and `loadPublishedPosts()`.
   - Increments monotonically increasing request token for race-condition safety.
   - If success: applies data using `renderHero`, `renderBody`, `renderShareLinks`, and `renderRelatedPosts`.
   - If error / 404: applies accessible `renderUnavailableState`.
   - Attaches hydration MutationObserver + timed reconciliation passes (50ms – 2500ms).

---

## 6. Environment Configuration

All environment configuration is isolated in `config/env.js`.

### Priority Resolution Chain:
1. `window.__CORABIN_ENV__` (global configuration object)
2. Individual window globals (`window.__CORABIN_SUPABASE_URL__`, `window.__CORABIN_SUPABASE_ANON_KEY__`)
3. `localStorage.getItem('corabin_supabase_anon_key')` (development/staging local overrides)
4. Production defaults

> **Security Note:** The Supabase anon key is a public publishable key. Supabase Row Level Security strictly enforces read-only access to published articles. The browser runtime contains no service role keys and executes zero database mutations.

---

## 7. Pre-Deploy Validation & Testing

Always verify before committing or deploying:

```bash
# 1. Run the 20-point pre-deploy validation suite
./scripts/check.sh

# 2. Run the 16-route headless Chrome verification suite
python3 tools/verify_blog_pages.py
```

All 20 validation checks and all 16 automated route audits must pass 100%.
