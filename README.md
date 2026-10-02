# Corabin Website — Production Readiness Audit

**Project:** `opus_template.framer.website copy` (Corabin Studio, target domain `https://corabin.com`)
**Audit date:** 2026-10-02
**Method:** Static analysis of the full ZIP (all 27 HTML routes, every served JS/MJS module, `_headers`, `_redirects`, `robots.txt`, `sitemap.xml`, assets, docs, tooling and the full Git history). I did **not** run a browser, Lighthouse, or a live deployment, so runtime behaviour (console errors, hydration, real Core Web Vitals) is marked "verify" where it matters.

---

## 0. Verdict

# ❌ NOT ready to publish as-is

The site is visually finished and the SEO/metadata groundwork is genuinely good. But there are **five blockers** that would hurt you on day one: your contact form most likely doesn't deliver to you, every page's raw HTML is a copy of the home page, several claims on the site are false or contradict each other, internal build files would be publicly served, and your own security headers would break fonts and smooth scrolling.

All of the blockers are fixable. Realistic effort: roughly 1–2 focused days, with the contact form and content honesty being the most important.

### Scorecard

| Area | Status | One-line summary |
|---|---|---|
| Contact / lead capture | ❌ Blocker | Form posts to a Framer form ID that is almost certainly the template author's, not yours |
| SEO (head metadata) | ✅ Good | Unique titles, canonicals, OG/Twitter, valid JSON-LD, sitemap matches files |
| SEO (rendered content) | ❌ Blocker | All 27 pages ship identical home-page body HTML; only JS swaps in the real content |
| Content accuracy / trust | ❌ Blocker | Fabricated stats, contradictory company history, unattributed testimonials |
| Security (secrets) | ✅ Good | No keys/tokens in tree or Git history (pattern scan) |
| Security (deploy exposure) | ❌ Blocker | `tools/`, `docs/`, `*.md`, `.git/` sit in the deploy root |
| Security headers / CSP | ⚠️ High | CSP blocks Inter fonts + Lenis CSS; `unsafe-inline`/`unsafe-eval`; header merging risk |
| Performance | ⚠️ High | ~22.9 MB of PNGs are what pages actually load; WebP files exist but aren't wired in |
| Accessibility | ⚠️ High | No `<main>`, no skip link, no aria-labels, missing/empty alt text |
| Legal pages | ⚠️ High | Terms lack governing law/refunds; Privacy describes features that don't exist |
| Deployment config | ⚠️ Medium | Redirect/header rules are host-ambiguous; no deploy folder; no Git remote |
| Code quality / structure | ⚠️ Medium | Framer compiled export (not hand-maintainable), in-place patched modules |

---

## 1. What is already good ✅

### Structure & hygiene
1. Clean static-site layout: one `index.html` per route (`/about`, `/contact`, `/blog`, `/projects`, 10 blog posts, 6 projects, `/privacy`, `/terms`, `/404`).
2. No broken local references: every `/assets/...`, `/framerusercontent.com/...`, `/fonts.gstatic.com/...` path referenced from `index.html` and `about/index.html` exists on disk (38 checked, 0 missing). Every image referenced by the CMS modules exists.
3. No leftover template strings in served files: zero hits for `opus`, `Markus`, `framer.website`, `lorem`, `example.com`.
4. `.gitignore` exists and excludes `.env`, OS junk, logs and backups.
5. Sensible Git history with descriptive commits (13 commits, clean working tree).
6. Migration scripts are documented in `tools/README.md` with a "do not re-run" warning.

### SEO (metadata layer)
7. Every indexable page has a **unique `<title>`, meta description, and self-referencing canonical**.
8. Full Open Graph + Twitter Card tags on every page, with absolute URLs.
9. **JSON-LD is valid on every page** (all 55 blocks parse): Organization, WebSite, ProfessionalService, Article, BreadcrumbList, WebPage, CreativeWork.
10. `sitemap.xml` lists 23 URLs and every one maps to a real file; `robots.txt` references it.
11. The 6 legacy project slugs are handled properly three ways: `noindex`, canonical to the new slug, and 301s in `_redirects`.
12. `<html lang="en-US">` and a correct `viewport` meta are set.
13. Favicons present in all needed sizes (`.ico`, 32 px, 180 px apple-touch).

### Security
14. **No secrets found** in the working tree or Git history (AWS/OpenAI/Google/GitHub/Slack tokens, private keys, hard-coded passwords). This was a pattern-based scan; see §5 for a recommended second tool.
15. No `.env`, key, credential or `.pem` files are tracked.
16. A real security-header set is already drafted in `_headers` (HSTS, nosniff, X-Frame-Options, Referrer-Policy, Permissions-Policy, CSP, `frame-ancestors 'none'`). It needs fixes (see §3) but the intent is right.
17. External `target="_blank"` links all carry `noopener` (0 violations).
18. No analytics or trackers are loaded, so there is no consent-banner obligation today.

### Performance & UX
19. Hero video uses `preload="none"`, `muted`, `playsinline`.
20. `prefers-reduced-motion` CSS is present.
21. Per-route 404 page exists, and legal pages are lightweight (~38 KB body).
22. Hashed Framer runtime files make long-term caching feasible.

---

## 2. What is missing 🕳️

### Missing functionality / files
1. **A working contact-form backend that belongs to you** (see B1).
2. **A deploy folder.** There is no `public/` or `dist/`, so "deploy the repo root" would publish internal files (see B4).
3. **A project-level `README.md`** (only `tools/README.md` exists). This file can serve as the start of one.
4. **A Git remote.** `git remote -v` is empty, so the code exists only on this machine.
5. **Real hosting config for one specific host** (`wrangler.toml`/Cloudflare Pages settings, or `netlify.toml`). `_headers` and `_redirects` are written for "either" and behave differently on each.
6. **Real WebP/AVIF usage.** The files exist but the pages don't reference them (see H2).
7. **A correctly sized Open Graph image** (see H2).
8. **`noindex` on the 404 page** (it is currently indexable, with `canonical` → `/404`).
9. **Web app manifest** (`manifest.webmanifest`) and optionally `favicon.svg`: nice-to-have.
10. **`/.well-known/security.txt`**: optional but good practice for a studio that sells web security content.
11. **A `www` → apex redirect plan** and DNS/email records for `hello@corabin.com` (MX, SPF, DKIM, DMARC). The site publishes this address everywhere.
12. **Monitoring:** uptime check, Search Console, Bing Webmaster, and (if wanted) privacy-friendly analytics.
13. **A LICENSE / ownership note** documenting the template license and third-party licences (Framer runtime, Lenis, React, Motion, fonts).

### Missing content
14. Real **client attribution/consent** for testimonials and case studies (see B3).
15. Governing law, jurisdiction, cancellation/refund and liability-limit clauses in the **Terms**.
16. A **Privacy Policy** that matches reality: name the form processor, the host/CDN, and drop features you don't have (newsletters, payments, analytics, cookies) or add them for real.
17. **Accessibility statement** (optional) and a visible **skip link** (required for good keyboard UX).
18. Real photography: founder photo, logo SVG (the logo is a 1254×1254 PNG), real project screenshots.

---

## 3. What needs to be fixed or updated 🔧

Severity key: 🛑 Blocker (don't publish) · 🔴 High · 🟠 Medium · 🟡 Low

### 🛑 B1 — Contact form submits to a Framer form that probably isn't yours

- **Evidence:** `framerusercontent.com/sites/46CYIm3dbxFoU3f63shpCX/https/framerusercontent.com/modules/VM6LshqF3kGfk3qxJUTi/2SWjHeF37NxXG6KxhVeu/TQtrT4cVD.js`, line 410:
  `action: "https://api.framer.com/forms/v1/forms/fbe3507b-9997-4e3f-91ff-9e4321e5b4d4/submit"`
- **Why it matters:** This site was cloned from `opus_template.framer.website`. That form ID belongs to the Framer project that owns the original template. Submissions will either fail or land in someone else's inbox/dashboard, and **you will receive nothing**. The earlier `SEO_PRODUCTION_AUDIT.md` framed this as "if your Framer project expires", which understates it: there is no Framer project of yours behind this form.
- **Note:** I can't see Framer's server, so treat "almost certainly not yours" as a strong inference, not a proof. Test it (below) either way.
- **Fix (choose one):**
  1. Replace the `action` URL with a form service you control (Formspree, Web3Forms, Basin, or a Cloudflare Pages Function + Resend/Mailgun). Then **submit a real test** and confirm (a) the email arrives and (b) the on-page success/error state works, since Framer's form component expects a particular response shape.
  2. If that proves flaky, replace the Framer form block with a plain HTML `<form>` + small script.
  3. Stopgap before launch: remove the form and show `mailto:` + WhatsApp/phone buttons only.
- **Also do:** add a honeypot field or Cloudflare Turnstile for spam; add the new endpoint host to CSP `connect-src` and `form-action`; confirm your Privacy Policy names the processor.

### 🛑 B2 — Every route's HTML body is the home page

- **Evidence:** Body HTML of `/about`, `/contact`, `/blog`, `/projects`, all 6 project pages and all 10 blog posts has **100% text similarity** with `index.html` (identical 15,341-character visible text; each ~586 KB body). The only differences are the `<head>` metadata and the `data-framer-hydrate-v2` route attribute. The 12 `<h1>`s on every page all read "STUDIO / CORABIN".
- **What works:** `<head>` tags are route-specific, so link previews (WhatsApp, LinkedIn, Slack) show the right title/image.
- **What breaks:** Anything that does not run the JavaScript sees the **home page** at `/about`, `/contact` and every blog URL: some search/AI crawlers, link unfurlers that read body text, read-it-later tools, no-JS users, and the first paint before hydration. Googlebot does render JS, but it's slower, less reliable, and risks hydration mismatch (content flash or React errors when SSR markup doesn't match the route).
- **Fix options:**
  1. **Best:** regenerate true per-route static HTML (re-export from Framer, or rebuild the pages in a static generator such as Astro/Next export so each route's body matches its content).
  2. **If you must keep this build:** at minimum add a short, route-specific server-rendered `<h1>` + intro paragraph in each page's HTML, and test hydration in the browser console for mismatch warnings.
- **Verify:** `curl -s https://corabin.com/about | sed 's/<[^>]*>//g' | grep -i "our story"` should return the About copy, and the same for a blog URL.

### 🛑 B3 — Several claims on the site are false, fabricated, or contradict each other

This is both a trust problem and a legal one (misleading-advertising rules in India and wherever your clients are). It is also the fastest thing to fix.

| Claim on the site | Where | Problem |
|---|---|---|
| "Building digital excellence since **2019**" | About page module `Rp33.../UlP2zZZj6.js` | 7 years of history |
| "Over the past **decade**, we've built dozens of websites…" | Contact page, `TQtrT4cVD.js` | 10 years |
| "**5** Years experience" | Home | 5 years: three different histories on one site |
| "**134** Projects delivered", "**19** Direct collaboration" | Home | These are the **original template's numbers** (see `docs/AUDIT.md`: "19 individuals, 134+ projects") |
| "**99%** On-time delivery", "**$17M** Client revenue impacted" | Home | `docs/CHANGELOG.md` shows these were edited from the template's "95%" and "$21M" with no source |
| "We're a team of…", "our team members…", "19 direct collaboration" | About/Home | Reads as a large team |
| 3 testimonials credited only to project names ("Enterprise Revenue Architecture" etc.) | Home | No real person/company/permission |
| 6 case studies with "Client: Havyn Real Estate", "Client: Juliette Ardène"… | `/projects/*` | Source images are AI-generated (`tools/source-images`, `docs/CORABIN_BLOGS_EDITORIAL_AND_AI_IMAGE_PROMPTS.md`); if these are concept/sample projects, presenting them as delivered client work is misleading |

- **Fix:**
  1. Replace every stat with a number you can prove, or remove the counters. If you're a solo designer-developer with a shorter track record, say so. That is a selling point (direct access, no agency overhead), not a weakness.
  2. Pick **one** company/experience timeline and use it everywhere (Home, About, Contact, JSON-LD, Terms).
  3. Label concept work honestly ("Concept project", "Case study (self-initiated)"), or replace with real work; get written permission before naming real clients.
  4. Remove or replace testimonials until you have real, attributed, permitted quotes (name, role, company).
  5. Replace the template's remaining stock photos (17 `<img>` tags still load from `framerusercontent.com`; see H3).
  6. Fix blog dates (see M3).

### 🛑 B4 — Internal files would be publicly deployed

- **Evidence:** Repo root contains `tools/` (35 MB: migration scripts, decoded CMS JSON, source images), `docs/` (AUDIT, CHANGELOG, content map, AI prompt doc), `CODEBASE_AUDIT.md`, `SEO_PRODUCTION_AUDIT.md`, `_headers`/`_redirects`, and `.git/` (68 MB, full history).
- **Risk:** If the host's publish directory is the repo root (the default for "static, no build"), these become public: `corabin.com/tools/updated_cms_records.json`, `/docs/CHANGELOG.md` (which documents the OPUS template origin), and potentially `/.git/` contents. `robots.txt` has `Disallow: /tools/`, which doesn't protect anything and advertises the path. The old audit's `rsync --exclude` advice only helps if you always deploy that way.
- **Fix:**
  1. Create a `public/` (or `dist/`) folder containing **only** what should be served: `index.html`, route folders, `assets/`, `framerusercontent.com/`, `fonts.gstatic.com/`, `unpkg.com/`, `video.gumlet.io/`, `favicon.ico`, `robots.txt`, `sitemap.xml`, `_headers`, `_redirects`, `404.html`.
  2. Set the host's publish directory to `public/`.
  3. Move `tools/`, `docs/`, and the audit `.md` files to the repo root outside `public/` (or a private repo).
  4. After deploy: `curl -I https://corabin.com/tools/README.md`, `/docs/CHANGELOG.md`, `/.git/config` must all return **404**.

### 🛑 B5 — Your own CSP blocks the Inter fonts and the Lenis scroll CSS

The full detail and fix are in **H1** below. It is a launch blocker because, once `_headers` is applied on the host, the site's typography and smooth-scroll styling will not match what you see when testing locally without those headers.

---

### 🔴 H1 — `_headers` Content-Security-Policy blocks things the site needs

| Problem | Evidence | Effect |
|---|---|---|
| `font-src` doesn't include `framerusercontent.com` | 78 `@font-face` entries (Inter, Inter Display) load from `https://framerusercontent.com/...` | Inter is blocked, so fallback font, layout shift, brand typography lost |
| `style-src` doesn't include `unpkg.com` | 21 HTML pages link `https://unpkg.com/lenis@1.3.19/dist/lenis.css` | Lenis CSS blocked, smooth-scroll quirks. A local copy already exists at `/unpkg.com/lenis@1.3.19/dist/lenis.css` |
| `script-src` has `'unsafe-inline' 'unsafe-eval'` | `_headers` | Much of the CSP's XSS protection is gone (Framer's runtime needs these today, so keep but document) |
| No `object-src 'none'` | `_headers` | Minor hardening gap |
| Form endpoint not future-proofed | `connect-src`/`form-action` only list `api.framer.com` | Your new form endpoint will be blocked until added |
| Duplicate `Cache-Control` | `/*` sets `max-age=0, must-revalidate`; `/assets/*` and `/framerusercontent.com/*` set long caching | On Cloudflare Pages, same-named headers from multiple matching rules are **joined with a comma**, producing contradictory directives. Check with `curl -I` after deploy |
| `immutable` 1-year cache on `/framerusercontent.com/*` | Several modules in that folder were **patched in place** (same hashed filename, new content) | After any future edit, returning visitors keep the old file for a year. Rename patched files (new hash) or give them shorter caching |
| `HSTS … preload` | `_headers` | Preload is hard to undo and applies to **all subdomains**. Add only when every subdomain is HTTPS-only |

**Fix:** use the corrected headers in Appendix A. Roll the CSP out as `Content-Security-Policy-Report-Only` first, load every page with DevTools open, and fix every console violation before enforcing. Better still: self-host the Inter fonts and the images (H3), then drop `framerusercontent.com` from the CSP entirely.

### 🔴 H2 — Images: pages load ~23 MB of PNGs; WebP files are not used

- **Evidence:** The CMS modules reference **46 PNGs (22.9 MB total)** and only **3 WebPs**. The 47 `.webp` files in `assets/images/` (about 3 MB combined) are effectively dead weight. The older audit's "87% reduction" claim is not realised in the delivered pages.
- **Worst offenders:** `blog8.png` 2.85 MB, `blog1.png` 2.19 MB, `blog9.png` 1.93 MB, `blog4.png` 1.89 MB, `blog3.png` 1.64 MB, `blog2.png` 1.50 MB. The home page shows 3 blog cards, so about 5.3 MB of PNG on the home page alone.
- **Other image problems:**
  - `Corabin_logo.png` and `favicon.png` are 410 KB, 1254×1254 (a WebP of the logo is 63 KB).
  - `assets/images/og-corabin.png` is **actually a JPEG** (`file` reports JPEG data) at **1376×768**, while the meta tags declare **1200×630**. Facebook/LinkedIn may crop or reject it. Export a real 1200×630 file.
  - No `loading="lazy"` in the static HTML (Framer's runtime may add it; verify in DevTools) and no `srcset`: the CMS records set `srcSet` to the same PNG for every width.
- **Fix:** In the CMS data (`tools/updated_blog_records.json`/`updated_cms_records.json` are the source, but the live data is inside the patched `.mjs`), point `src`/`srcSet` to the `.webp` files (or generate 640/1024/1600 px variants), keep PNG only as a fallback, and re-hash the changed modules (H1 caching). Target: blog/project images ≤ 150 KB each, home page total < 1.5 MB transferred.

### 🔴 H3 — Still dependent on the template author's CDN and assets

- **Fonts:** 78 Inter/Inter Display faces load from `framerusercontent.com`; Manrope too.
- **Images:** 17 `<img>` tags on each page load from `framerusercontent.com/images/...` (43 original template photos per `CODEBASE_AUDIT.md`). These are the template's demo photos, not yours.
- **Hero video:** `<video src="https://video.gumlet.io/67a34db7c82041cdc3756469/…/download.mp4">` is on the **template creator's Gumlet account**. A local copy exists at `/video.gumlet.io/…/download.mp4` but the HTML doesn't use it.
- **Licensing:** The earlier audit states self-hosting the Framer runtime is "permitted under export terms". I could not verify that, and Framer does not offer an official static export of a site. **Read the Framer Terms of Service and your template's licence** (the Framer Marketplace licence typically covers publishing via Framer, not redistributing the runtime). If you have any doubt, the clean route is to publish through Framer hosting (point `corabin.com` to it) or rebuild the site.
- **Fix:** Self-host the fonts (download the Inter files you actually use, or use `fontsource`); replace template photos with your own/licensed ones; point the video to your own file (or remove it); settle the licensing question before launch.

### 🔴 H4 — Accessibility basics are missing

- No `<main>` landmark (0 found) and no **skip link**.
- 0 `aria-label` attributes; only 3 `role=` attributes; 0 `<button>` elements. The "Menu" control and FAQ accordions are likely `div`s, so keyboard and screen-reader support is doubtful (verify by tabbing through).
- **32 `<img>` per page: 6 have no `alt` attribute and 15 have `alt=""`** (fine for decorative, wrong for content images like project/blog thumbnails).
- 12 `<h1>` per page, all "STUDIO / CORABIN": Framer renders one per breakpoint variant; confirm only one is exposed to assistive tech. The visible H1 isn't descriptive.
- Lenis smooth-scroll can interfere with keyboard/assistive scrolling; ensure it's disabled under `prefers-reduced-motion`.
- Colour contrast (e.g. `rgba(12,18,12,0.6)` text on `#f3f3f1`) is **untested**.
- **Fix:** add `<main>`, a skip link, real buttons/aria for menu + accordions, meaningful alt text, then run axe/Lighthouse and a keyboard-only pass.

### 🔴 H5 — Legal pages don't match reality

- **Terms** have payment terms (50% deposit, net-14) but **no governing law/jurisdiction, no refund/cancellation, no liability cap, no revision limits** (searched for "Governing", "Jurisdiction", "laws of", "Refund": not found).
- **Privacy Policy** says you send newsletters, process payments, run analytics and cookies, and give "Regular security assessments"; none of that exists on the site. It doesn't name the form processor/host, or mention India's DPDP Act 2023 / GDPR rights handling or a grievance contact.
- Both say "Last updated: October 2026 · Effective immediately".
- **Fix:** rewrite to describe what you actually do, add jurisdiction (India/Kolkata courts, as applicable), refund/cancellation, IP transfer on payment, liability limits. I'm not a lawyer, so have these reviewed.

### 🔴 H6 — `mailto:` links are malformed

- The email link is `mailto: hello@corabin.com` (note the **space after the colon**), in `TQtrT4cVD.js`, `xVFoVRkDB.js` and the home footer (3 links). Several mail clients handle it, others open a blank draft.
- **Fix:** `mailto:hello@corabin.com` in all three modules. Also make sure the mailbox exists and receives mail (MX/forwarding + SPF/DKIM/DMARC) before launch.

### 🔴 H7 — `_redirects` and 404 handling are host-dependent

- `/* /404.html 404`: valid on Netlify; **not supported on Cloudflare Pages** (which only allows 200/3xx and already serves `404.html` automatically). It may be ignored or flagged at deploy.
- `/privacy /privacy/index.html 200` and `/terms … 200` are unnecessary: both hosts already serve `/privacy/` from `privacy/index.html`, and on some hosts this rewrite can fight the pretty-URL redirect.
- `404.html` and `404/index.html` are byte-identical duplicates (797 KB each, mostly Framer CSS).
- The 404 page is **indexable** (no `noindex`) and has `canonical` → `https://corabin.com/404`.
- **Fix:** use the `_redirects` in Appendix B, keep a single `404.html`, add `<meta name="robots" content="noindex">`, and confirm unknown URLs return a real **HTTP 404** (`curl -I https://corabin.com/nope`).

---

### 🟠 Medium

| ID | Issue | Detail / Fix |
|---|---|---|
| M1 | **Titles too long** | 21 pages have `<title>` > 60 chars (e.g. "Custom Web Architecture vs. Commercial Templates: The ROI Breakdown — Corabin" = 77). Google will truncate. Shorten to ≤ 60. |
| M2 | **Meta descriptions too long** | 13 pages > 160 chars (worst: custom-vs-off-the-shelf = 193; design-that-converts = 180; technical-debt = 179). Trim to ≤ 155. |
| M3 | **Backdated blog dates** | Posts are dated Nov 2024 – Jan 2025 and `sitemap.xml` `lastmod` repeats that, yet the site was built in Sept/Oct 2026 and the Privacy page says "Last updated October 2026". Use real publish dates; "Corabin" blog posts older than the brand/domain look inauthentic and conflict with B3. |
| M4 | **Slug/title drift** | Slug `choosing-the-right-tech-stack-a-decision-framework-for-2025` but title says "for 2026"; `custom-vs-off-the-shelf-choose-wisely` etc. are old template slugs that no longer describe the post. If you rename, add 301s. |
| M5 | **Twitter handle is a guess** | `twitter:site` = `@corabin` on every page. Update or remove if the account doesn't exist. |
| M6 | **JSON-LD data unverified** | `sameAs` lists LinkedIn `/company/corabin`, Instagram `corabin.studio`, Dribbble, Behance, and the address uses postal code `700001`. Confirm each profile exists and the PIN is yours, or remove. Also review whether you want your **personal mobile number** in public markup (JSON-LD, Contact page, Privacy page): scrapers and spam calls follow. A business line/WhatsApp Business number is safer. |
| M7 | **Editor bundle shipped** | `framerusercontent.com/sites/…/https/app.framerstatic.com/framer.BVYWINPW.mjs` (1.6 MB) and `chunk-7KEO2DXG.mjs` (437 KB) are Framer **editor** code, plus a `ga.jspm.io` react-dom mirror (234 KB) and an `api.framer.com` auth path. They are probably never loaded on a live site, but verify in the Network tab and delete them (smaller deploy, smaller attack surface). |
| M8 | **Huge HTML** | Each page is ~1.37 MB of HTML (inlined CSS for all breakpoints, 3× duplicated DOM per breakpoint). Ensure Brotli/gzip is on (Cloudflare/Netlify do this by default; confirm with `curl -H 'Accept-Encoding: br' -I`). Real fix = re-export (B2). |
| M9 | **Legacy redirect stubs** | The 6 `projects/<old-slug>/index.html` files duplicate what `_redirects` already does. Keep one mechanism (the 301s are better for SEO). |
| M10 | **Trailing-slash behaviour** | Canonicals/sitemap use no trailing slash. Test `/about` and `/about/` both resolve without redirect loops, and one redirects to the other. |
| M11 | **`.gitignore` flaws** | It ignores `dist/`, `build/`, `lib/` (it would hide a future `dist/` deploy folder), and its comment claims `tools/source-images/` is ignored but there is no pattern, so 35 MB of source images are tracked. |
| M12 | **Stale/incorrect docs** | `SEO_PRODUCTION_AUDIT.md` and `CODEBASE_AUDIT.md` say: 22 sitemap URLs (actual 23); robots.txt disallows legacy slugs (actual file doesn't); "No 404 page" (one exists); "WebP files → 87% reduction" (not wired in); "safe to push to GitHub as a public repository" (true for secrets, but it publishes `tools/` and template provenance). Update or delete. |
| M13 | **Project folder name** | `opus_template.framer.website copy` (spaces + template name). Rename to `corabin-website` before creating a repo. |

### 🟡 Low

1. `<!-- Published May 22, 2026, 1:47 PM UTC -->` template stamp in HTML: remove.
2. `permissions-policy` includes `interest-cohort=()` (deprecated, harmless).
3. `Disallow: /tools/` in `robots.txt` advertises a path: remove once `tools/` isn't deployed.
4. Lenis smooth-scroll (hijacks native scroll) is a UX preference, so offer reduced-motion fallback.
5. No `<noscript>` fallback message.
6. Large `.framercms` chunk files are served (12 files); harmless but not needed in the browser if the data is embedded; verify before removing.

---

## 4. What needs to be created 🆕

| # | File / asset | Purpose |
|---|---|---|
| 1 | `public/` folder | Clean deploy root (B4) |
| 2 | Working **contact backend** (Formspree/Web3Forms/Pages Function) + spam protection | Leads actually reach you (B1) |
| 3 | `public/_headers` (corrected) | See Appendix A |
| 4 | `public/_redirects` (corrected) | See Appendix B |
| 5 | `wrangler.toml` **or** `netlify.toml` | Pin build dir = `public`, no build command |
| 6 | Real **1200×630 OG image** (`og-corabin.jpg`) | Correct social previews |
| 7 | **WebP/AVIF** variants (640/1024/1600) of all blog/project images, wired into the CMS data | Cut ~20 MB from page weight |
| 8 | **Logo as SVG** + small PNG fallbacks (180/512) | Replaces 410 KB PNG logo |
| 9 | Self-hosted **Inter** `.woff2` files + `@font-face` | Removes CDN/CSP dependency |
| 10 | Real **testimonials / case-study copy** with consent | B3 |
| 11 | Rewritten **Privacy Policy** and **Terms** | H5 |
| 12 | `README.md` at repo root (what this is, how to deploy, how to edit content) | Maintainability |
| 13 | `LICENSE` / `THIRD_PARTY.md` | Template + runtime + font licences |
| 14 | `.well-known/security.txt` | Responsible disclosure contact |
| 15 | `manifest.webmanifest` (optional) | PWA metadata/icons |
| 16 | `scripts/check.sh` (see Appendix C) | Repeatable pre-deploy checks |
| 17 | A **remote Git repository** (private to start) | Backup + deploy-from-Git |
| 18 | DNS records: apex + `www`, MX/SPF/DKIM/DMARC for `hello@corabin.com` | Domain + email |
| 19 | Analytics (optional): Plausible/Umami/Cloudflare Web Analytics | Cookie-free measurement |

---

## 5. What must be checked before publishing ✅

Tick every box. Items marked 🛑 map to blockers above.

### Content & legal
- [ ] 🛑 Every number on the site is true and provable (projects, years, team size, revenue, on-time %)
- [ ] 🛑 One consistent company history across Home/About/Contact/JSON-LD/Terms
- [ ] 🛑 Testimonials are real, attributed, and permitted, or removed
- [ ] 🛑 Case studies are labelled honestly (concept vs. client) and clients consented
- [ ] Template stock photos and hero video replaced with your own/licensed assets
- [ ] Framer Terms + template licence checked for self-hosting (H3)
- [ ] Privacy Policy and Terms rewritten and reviewed
- [ ] Blog dates are real; no dates earlier than the brand's existence
- [ ] Phone number/email intentionally public; `hello@corabin.com` receives mail

### Forms & links
- [ ] 🛑 Submit the contact form on the **live domain** and confirm the email arrives and the success state shows
- [ ] Spam protection works (honeypot/Turnstile)
- [ ] `mailto:` links have no space
- [ ] All 4 social profiles exist and the links open them (LinkedIn, Instagram, Dribbble, Behance)
- [ ] No broken links (run a crawler, e.g. `npx linkinator https://corabin.com --recurse`)

### SEO
- [ ] 🛑 View-source (not DevTools) of `/about`, `/contact`, one blog post and one project shows that page's own content in the body
- [ ] Titles ≤ 60 chars, descriptions ≤ 155 chars
- [ ] 404 page returns HTTP 404 and has `noindex`
- [ ] `robots.txt` and `sitemap.xml` load on the live domain; sitemap `lastmod` is accurate
- [ ] Rich Results Test passes on `/` and one blog post
- [ ] Facebook Sharing Debugger / LinkedIn Post Inspector show a correct 1200×630 image
- [ ] Search Console + Bing Webmaster verified; sitemap submitted
- [ ] `https://www.corabin.com` and `http://` both 301 to `https://corabin.com`

### Security & deploy
- [ ] 🛑 `curl -I` on `/tools/README.md`, `/docs/CHANGELOG.md`, `/.git/config`, `/CODEBASE_AUDIT.md`, `/_headers` all return **404**
- [ ] `curl -I https://corabin.com/` shows HSTS, nosniff, X-Frame-Options, Referrer-Policy, Permissions-Policy, and a **single, sane** `Cache-Control`
- [ ] CSP: deploy as Report-Only first; zero violations on every route; then enforce
- [ ] Inter fonts render (DevTools → Network → Fonts, no blocked requests); Lenis CSS applies
- [ ] Run a second secret scanner on the repo: `gitleaks detect` or `trufflehog git file://.`
- [ ] Don't enable HSTS `preload` until all subdomains are HTTPS
- [ ] Git repo pushed to a private remote; branch protection on `main`

### Performance
- [ ] Lighthouse (mobile, throttled) on `/`, `/blog`, one post: Performance ≥ 85, LCP < 2.5 s, CLS < 0.1, INP < 200 ms
- [ ] Home page transfer < 1.5 MB; no PNG > 200 KB served
- [ ] Brotli/gzip confirmed (`content-encoding: br`)
- [ ] Hero video loads from your own origin and doesn't block LCP
- [ ] Editor bundle (`app.framerstatic.com/*`) confirmed unused, then removed

### Accessibility & responsiveness
- [ ] Keyboard-only walkthrough: skip link, menu, FAQ accordions, form, focus visible
- [ ] axe DevTools / Lighthouse a11y ≥ 95
- [ ] Screen-reader pass (NVDA/VoiceOver) on Home + Contact
- [ ] Test at 360, 390, 768, 1024, 1440, 1920 px and on a real Android + iPhone
- [ ] Contrast checked on secondary text
- [ ] Reduced-motion setting disables animations and smooth scroll

### Post-launch (first 48 h)
- [ ] Watch Search Console coverage and the host's error logs
- [ ] Re-run Lighthouse on the live URL
- [ ] Set an uptime monitor (UptimeRobot / Better Stack)

---

## Appendix A — Suggested `_headers` (start here, then tighten)

```
/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  Content-Security-Policy-Report-Only: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://framerusercontent.com; style-src 'self' 'unsafe-inline'; font-src 'self' data: https://fonts.gstatic.com https://framerusercontent.com; img-src 'self' data: blob: https://framerusercontent.com; media-src 'self' blob: https://video.gumlet.io; connect-src 'self' https://framerusercontent.com https://YOUR-FORM-ENDPOINT; object-src 'none'; base-uri 'self'; form-action 'self' https://YOUR-FORM-ENDPOINT; frame-ancestors 'none'

# No Cache-Control on /* so it can't merge with the rules below.
# HTML keeps the host default (revalidate on every load).

/assets/*
  Cache-Control: public, max-age=86400, stale-while-revalidate=604800

/fonts.gstatic.com/*
  Cache-Control: public, max-age=31536000, immutable

/favicon.ico
  Cache-Control: public, max-age=86400
```

Notes:
- Remove `framerusercontent.com` and `video.gumlet.io` from the CSP once fonts, images and video are self-hosted (H3).
- Leave `/framerusercontent.com/*` on short caching (or rename patched files with new hashes) until you've verified which modules were patched in place (H1).
- Switch `Content-Security-Policy-Report-Only` to `Content-Security-Policy` after a clean pass.

## Appendix B — Suggested `_redirects`

```
# Legacy project slugs
/projects/arrows          /projects/kora      301
/projects/arrows/         /projects/kora      301
/projects/chantalle       /projects/himon     301
/projects/chantalle/      /projects/himon     301
/projects/papyrus         /projects/norda     301
/projects/papyrus/        /projects/norda     301
/projects/london-museum   /projects/ardene    301
/projects/london-museum/  /projects/ardene    301
/projects/bullseye        /projects/havyn     301
/projects/bullseye/       /projects/havyn     301
/projects/interference    /projects/almare    301
/projects/interference/   /projects/almare    301

# Cloudflare Pages serves /404.html automatically.
# On Netlify only, you may also add:  /*  /404.html  404
```

## Appendix C — Quick pre-deploy check script (`scripts/check.sh`)

```bash
#!/usr/bin/env bash
# Run from repo root. Fails if internal files or obvious problems would ship.
set -euo pipefail
PUB=public

# 1. Nothing internal inside the deploy folder
for p in tools docs .git CODEBASE_AUDIT.md SEO_PRODUCTION_AUDIT.md; do
  [ ! -e "$PUB/$p" ] || { echo "FAIL: $PUB/$p must not be deployed"; exit 1; }
done

# 2. Every route has its own body content (not a copy of home)
home=$(sed -n '/<body/,$p' $PUB/index.html | md5sum)
for r in about contact blog projects; do
  [ "$(sed -n '/<body/,$p' $PUB/$r/index.html | md5sum)" != "$home" ] \
    || { echo "FAIL: /$r body is identical to home"; exit 1; }
done

# 3. No malformed mailto, no template leftovers, no stray form IDs
! grep -rIn 'mailto: ' $PUB --include=*.js --include=*.mjs --include=*.html \
  || { echo "FAIL: 'mailto: ' has a space"; exit 1; }
! grep -rIniE 'opus|markus|lorem' $PUB --include=*.js --include=*.mjs --include=*.html \
  || { echo "FAIL: template leftovers"; exit 1; }
! grep -rIn 'fbe3507b-9997-4e3f-91ff-9e4321e5b4d4' $PUB \
  || { echo "FAIL: old Framer form ID still present"; exit 1; }

# 4. No oversized images
find $PUB/assets -type f \( -name '*.png' -o -name '*.jpg' \) -size +300k -print \
  | { ! grep . ; } || { echo "FAIL: images > 300 KB above"; exit 1; }

echo "OK"
```

---

## Suggested order of work

1. **Today:** create `public/` + move internal files out (B4) → fix `mailto:` (H6) → fix `_headers`/`_redirects` (H1, H7).
2. **Content pass (B3):** stats, timeline, testimonials, case-study labels, blog dates, legal pages.
3. **Contact form (B1):** swap endpoint, test end-to-end, add spam protection.
4. **Images/fonts/video (H2, H3):** wire WebP, self-host Inter, replace template assets, new OG image.
5. **Per-route HTML (B2):** re-export/rebuild so each route's body is its own.
6. **Accessibility (H4)**, then run the §5 checklist, deploy to a **preview URL first**, re-run the checklist, and only then point `corabin.com` at it.

---

*Limits of this audit: static review only. I did not execute the site in a browser, run Lighthouse/axe, test the form submission, or inspect Framer's servers or licence terms. Legal observations are not legal advice.*
