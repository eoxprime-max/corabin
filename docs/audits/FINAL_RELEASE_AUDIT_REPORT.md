# Corabin Website — Final Release Audit Report (Stage 5)

**Audit Date:** October 13, 2026  
**Auditor:** Automated Engineering Pre-Flight Suite  
**Repository:** `/home/souvik/Corabin/Corabin.website`  
**Target Environment:** Vercel Static Hosting (Canonical Directory: `public/`)  
**Scope:** Final Read-Only Production Readiness Audit following Stages 1–4  
**Audit Mode:** Read-Only Verification (Zero project code, assets, or configuration files modified)  

---

## 1. Executive Summary

Following the completion of Stages 1 through 4 (documentation consolidation, tooling modernization, JavaScript operator repairs, contact form CSP allowlist, and retirement of root duplicate static exports), a comprehensive, read-only production readiness audit was performed on the Corabin website repository.

The audit verified that:
1. **`public/` is the single canonical production directory**, referenced consistently by `vercel.json`, `scripts/dev.sh`, `scripts/check.sh`, `tools/publish_blog11.py`, and `tools/verify_production_readiness.py`.
2. **Zero obsolete root duplicate website files remain**, reclaiming ~87.3 MB of disk space with no reintroduction of legacy exports.
3. **All 336 malformed optional-chaining (`?.`) and nullish-coalescing (`??`) JavaScript operators remain cleanly repaired**, and all 138 inline scripts across all 32 HTML files pass ES module AST syntax validation with zero errors.
4. **Content Security Policy is completely synchronized** across `vercel.json`, root `_headers`, and `public/_headers`, permitting contact form submissions to `https://n8n.corabin.com`.
5. **All 41 production readiness checks and 11 release checks passed with 100% success**, and 8/8 primary routes in headless Google Chrome rendered cleanly with zero error boundaries.

**Final Verdict:** **READY FOR DEPLOYMENT**

---

## 2. Checks That Passed (With Empirical Evidence)

### 2.1 Project Structure & Deployment Configuration
- **Vercel Output Directory:** Confirmed `vercel.json` specifies `"outputDirectory": "public"` and `"cleanUrls": true`.
- **Local Preview Server:** Confirmed `scripts/dev.sh` executes `python3 -m http.server "${PORT}" --directory "${PUB_DIR}"` where `PUB_DIR="${ROOT_DIR}/public"`.
- **Release Sanity Checker:** Confirmed `scripts/check.sh` defines `PUB=public` and runs all 11 integrity tests against `public/`.
- **Active Blog Publisher:** Confirmed `tools/publish_blog11.py` resolves paths dynamically and writes exclusively to `public/framerusercontent.com/...`, `public/blog/...`, and `public/sitemap.xml`.
- **Root Directory Cleanliness:** Verified that the repository root contains strictly 12 essential directories and files (`.corabin-local-backups`, `.git`, `.gitignore`, `README.md`, `_headers`, `_redirects`, `archive`, `docs`, `public`, `scripts`, `tools`, `vercel.json`). Zero obsolete static website copies (`index.html`, `about/`, `contact/`, `projects/`, etc.) exist at the root.

### 2.2 JavaScript and HTML Integrity
- **Malformed Operator Regressions:** Scanned all 32 HTML files in `public/` for regex pattern `([A-Za-z0-9_$)\]])[ \t]+\?[ \t]+[.?]`. **Result: 0 matches found.**
- **Inline JavaScript Syntax:** Extracted and evaluated all 138 executable inline `<script>` blocks across all 32 HTML files through Node.js (`node --input-type=module -c`). **Result: 138/138 scripts passed with zero syntax errors.**
- **Accessibility Skip Link Styling:** Verified that `.skip-link { ... }` and `.skip-link:focus { ... }` are present in all 31 route HTML pages.
- **Essential HTML Metadata:** All 25 content routes contain complete `<title>`, `<meta name="description">`, `<meta name="viewport">`, and canonical `<link>` tags. All 6 legacy project stubs (`arrows`, `bullseye`, `chantalle`, `interference`, `london-museum`, `papyrus`) properly declare 301 `<meta http-equiv="refresh">` redirects and canonical links to new routes.
- **Local Asset & Link References:** Scanned all 926 internal `src="/..."` and `href="/..."` paths across all HTML pages. **Result: 0 missing local assets or routes.**

### 2.3 Security and Content Security Policy (CSP)
- **Configuration Syntax:** Validated `vercel.json` with `python3 -m json.tool vercel.json`. **Result: Valid JSON.**
- **CSP Policy Uniformity:** Compared the `Content-Security-Policy` header strings across `vercel.json`, `_headers`, and `public/_headers`. **Result: 100% byte-for-byte identical across all three files.**
- **Contact Form Webhook Allowlist:** Verified that both `connect-src` and `form-action` explicitly authorize `https://n8n.corabin.com`:
  ```text
  connect-src 'self' https://framerusercontent.com https://n8n.corabin.com;
  form-action 'self' https://n8n.corabin.com;
  ```
- **Security Directives:** Confirmed `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Strict-Transport-Security: max-age=31536000; includeSubDomains`, and `frame-ancestors 'none'` are configured across all deployment targets.
- **Secret & Placeholder Scrubbing:** Scanned tracked configuration files for placeholder strings (`YOUR-N8N-WEBHOOK-URL`) and leaked credentials. **Result: 0 matches.**

### 2.4 SEO & Production Assets
- **Robots Directives:** Verified `public/robots.txt` specifies `User-agent: *`, allows asset crawling (`/assets/`, `/framerusercontent.com/`, `/fonts.gstatic.com/`, `/video.gumlet.io/`), and points to `https://corabin.com/sitemap.xml`.
- **Sitemap XML:** Verified `public/sitemap.xml` contains all 24 canonical routes including all 11 published blog articles.
- **404 Handling:** Verified `public/404.html` includes `<meta name="robots" content="noindex">`.
- **Critical Assets:** Verified presence and non-zero file sizes for:
  - `public/favicon.ico` (32,038 B)
  - `public/assets/images/favicon-32.png` (1,764 B)
  - `public/assets/images/favicon-180.png` (25,385 B)
  - `public/assets/images/Corabin_logo.png` (245,001 B)
  - `public/assets/images/og-corabin.png` (517,472 B)
  - `public/assets/images/about/Souvik_short_profile_img-512.webp` (29,286 B)
  - `public/assets/images/about/Souvik_short_profile_img.jpeg` (119,164 B)
  - All 11 blog WebP hero images (`blog1.webp` through `blog11.webp`).

### 2.5 Execution of Automated Test Suites
| Test Command | Purpose | Result | Evidence / Details |
|---|---|---|---|
| `bash scripts/check.sh` | Release pre-deploy sanity suite | **PASS** | 11/11 checks passed (Deploy integrity, mailto, template stamps, form ID, 404 noindex, CSP, operators, webhook origin). |
| `bash -n scripts/check.sh scripts/dev.sh` | Shell syntax validation | **PASS** | Exit code 0, zero syntax errors. |
| `python3 -m json.tool vercel.json` | JSON schema validation | **PASS** | Exit code 0, formatting and syntax valid. |
| `python3 -m py_compile tools/*.py` | Python tools compilation | **PASS** | Exit code 0, all active tools compile without errors. |
| `python3 tools/verify_production_readiness.py` | Full pre-flight readiness verification | **PASS** | 41/41 checks passed (24 canonical routes, 6 legacy redirects, 9 critical assets, contact form, security headers). |
| `python3 tools/verify_all_pages.py` | Headless Chrome DOM rendering suite | **PASS** | 8/8 routes verified healthy and content-accurate; zero error boundaries. |
| Preview Server HTTP Verification (`./scripts/dev.sh 8088`) | Local HTTP route status inspection | **PASS** | Verified 10 routes: `/`, `/about/`, `/contact/`, `/projects/`, `/projects/kora/`, `/blog/`, `/blog/real-estate-agent-website-cost-2026/`, `/privacy/`, `/terms/`, `/404.html` returned HTTP 200 with valid titles; random route returned HTTP 404. Server cleanly terminated. |

---

## 3. Issues Found Categorized by Severity

### Critical Issues (0)
*None.* Zero fatal blockers, broken production routes, or deployment impediments exist.

### High Issues (0)
*None.*

### Medium Issues (1)
- **Issue M-1: Historical Test Assertion Discrepancy in `tools/verify_blog_pages.py`**
  - **Affected File:** `tools/verify_blog_pages.py`
  - **Observed Evidence:** When executing `verify_blog_pages.py`, all 10 individual blog article detail routes pass 100% of their content assertions. However, the script asserts that all 9 historical blog titles must simultaneously be present in the raw DOM of `/index.html` and `/blog/index.html`. In the actual Framer production design, the blog component displays 3 featured/latest blog posts on the homepage and blog listing with client-side pagination, rather than rendering all articles on a single unpaginated view.
  - **Impact:** Does not affect production website health or user experience; reflects an outdated assumption in a legacy test script.
  - **Recommended Action:** In a future tooling update, adjust `tools/verify_blog_pages.py` to test the featured article titles that match the active paginated blog component.

### Low Issues (1)
- **Issue L-1: Local Git Branch Ahead of Remote**
  - **Affected File:** Git repository branch `main`
  - **Observed Evidence:** `git status` reports `Your branch is ahead of 'origin/main' by 4 commits`.
  - **Impact:** Clean working tree locally; commits have not yet been pushed to the GitHub remote.
  - **Recommended Action:** Run `git log` to review the local commit log and push to `origin/main` when authorized.

---

## 4. Checks Skipped or Requiring Manual Verification

1. **Live Webhook Transmission:**
   In adherence to strict safety rules, no test payload was transmitted over the live internet to `https://n8n.corabin.com/webhook/contact-form`. Static CSP allowlists (`connect-src` and `form-action`) were verified across all configuration files. Live end-to-end webhook delivery should be verified manually once deployed using a test contact form submission.
2. **Vercel Edge Response Headers:**
   Local static server (`python3 -m http.server`) does not parse `vercel.json` header rules. Verification of actual live HTTP response headers (`X-Frame-Options: DENY`, `HSTS`, `Content-Security-Policy`) was performed via static file inspection and should be verified on the live Vercel URL post-deployment.

---

## 5. Deployment and Live Webhook Limitations

- **Local Preview Server vs Edge CDN:** Local testing verifies static file integrity, DOM generation, hydration, and routing. Global CDN performance, Edge redirects, and dynamic asset compression are managed by Vercel upon deployment.
- **External Webhook Service Dependency:** Submission success on the contact form depends on the availability and operational health of the external n8n instance at `n8n.corabin.com`.

---

## 6. Final Recommendation

### **STATUS: READY FOR DEPLOYMENT**

The original GitHub-connected Corabin project has successfully achieved full architectural stabilization across Stages 1–4. The canonical static website is self-contained under `public/`, cleanly decoupled from obsolete files, free of JavaScript syntax defects, secure, and ready for deployment to Vercel.

**Recommended Next Steps:**
1. Review the local commits (`git log`).
2. Push commits to GitHub (`git push origin main`) to trigger Vercel deployment.
3. Test a live contact form submission on the deployed domain to confirm end-to-end n8n webhook processing.
