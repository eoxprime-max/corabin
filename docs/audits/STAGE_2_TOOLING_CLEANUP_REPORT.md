# Stage 2 Cleanup Report — Tooling Organization & Safe Path Modernization

**Execution Date:** October 13, 2026  
**Repository:** `Corabin.website` (Original GitHub-connected Project)  
**Status:** Completed & Verified  
**Scope:** Stage 2: Tooling Organization and Safe Path Modernization  
**Safety Guarantees Met:** Zero modifications to production HTML, JS, CSS, images, fonts, videos, blog content, or assets inside `public/`; zero changes to `vercel.json`, `_headers`, `_redirects`, or CSP; zero files deleted without byte-for-byte SHA256 verification; blog publisher verified strictly via isolated disposable test fixture.

---

## 1. Overview of Actions Taken

Stage 2 organized historical migration scripts, intermediate CMS dumps, and raw creative assets out of `tools/` into structured subdirectories under `archive/migrations/` and `archive/raw-assets/`. Active tools were preserved, modernized to resolve project paths dynamically relative to script location, and configured to target canonical `public/` files exclusively. A standardized local preview command (`scripts/dev.sh`) was introduced.

---

## 2. Inventory of Moved Files

### 2.1 Historical Migration Scripts (`archive/migrations/`)
29 one-off historical scripts moved from `tools/` $\rightarrow$ `archive/migrations/` with verified byte-for-byte SHA256 integrity:

| Original Script Path | New Archive Path | Size | SHA256 Verification | Rationale |
|---|---|---|---|---|
| `tools/apply_a11y_pass.py` | `archive/migrations/apply_a11y_pass.py` | 3,547 B | `ca52ebaec5...` | One-time accessibility link & label patcher. |
| `tools/apply_corabin_branding.py` | `archive/migrations/apply_corabin_branding.py` | 9,944 B | `ae587b1abd...` | Initial brand token & color replacement script. |
| `tools/apply_full_customization.py` | `archive/migrations/apply_full_customization.py` | 20,331 B | `f2db99cc7d...` | Initial template decoupling pass. |
| `tools/apply_round2_refinements.py` | `archive/migrations/apply_round2_refinements.py` | 19,204 B | `56e121c107...` | Second-pass template decoupling script. |
| `tools/apply_seo_pass.py` | `archive/migrations/apply_seo_pass.py` | 29,411 B | `9e38a513b0...` | Initial title, description, and OG tag injector. |
| `tools/clean_template_fingerprints.py` | `archive/migrations/clean_template_fingerprints.py` | 16,093 B | `51544be02d...` | Template author metadata scrubber. |
| `tools/cleanup_remaining.py` | `archive/migrations/cleanup_remaining.py` | 4,076 B | `8c57576deb...` | Remnant template domain scrubber. |
| `tools/decode_blogs.py` | `archive/migrations/decode_blogs.py` | 4,018 B | `7bed4ca4ed...` | Extracted initial Framer CMS blog records. |
| `tools/fix_corabin_console_errors.py` | `archive/migrations/fix_corabin_console_errors.py` | 5,817 B | `c1ac84a7c1...` | Event listener error patch. |
| `tools/fix_remaining_console_errors.py` | `archive/migrations/fix_remaining_console_errors.py` | 2,990 B | `43b9c4c8b4...` | Keydown listener error patch. |
| `tools/fix_runtime_socials.py` | `archive/migrations/fix_runtime_socials.py` | 19,449 B | `5ebdf22a5c...` | Social links bundle patch. |
| `tools/fix_service4_and_counters.py` | `archive/migrations/fix_service4_and_counters.py` | 3,913 B | `30e4fb3b92...` | Motion counter and service 4 patch. |
| `tools/generate_corabin_blogs.py` | `archive/migrations/generate_corabin_blogs.py` | 39,368 B | `a99c0b8c87...` | Generator for blogs 1–10. |
| `tools/generate_legal_and_404_routes.py` | `archive/migrations/generate_legal_and_404_routes.py` | 31,032 B | `beac768d76...` | Privacy, terms, and 404 HTML generator. |
| `tools/inject_styles.py` | `archive/migrations/inject_styles.py` | 1,823 B | `162066541b...` | Early style injector with obsolete local paths. |
| `tools/localize_fonts_and_assets.py` | `archive/migrations/localize_fonts_and_assets.py` | 2,894 B | `c481b96920...` | CDN-to-local asset crawler. |
| `tools/patch_blogs_cms.py` | `archive/migrations/patch_blogs_cms.py` | 9,964 B | `0e01b728ae...` | Injected initial blog records into Framer CMS bundle. |
| `tools/patch_contact_form.py` | `archive/migrations/patch_contact_form.py` | 8,394 B | `f27c0fa681...` | Injected n8n webhook into contact component. |
| `tools/patch_custom_footer.py` | `archive/migrations/patch_custom_footer.py` | 4,949 B | `394594d184...` | Injected footer into legal pages. |
| `tools/patch_logo_styles.py` | `archive/migrations/patch_logo_styles.py` | 3,266 B | `6d673de894...` | SVG viewBox and styling adjuster. |
| `tools/patch_projects_cms.py` | `archive/migrations/patch_projects_cms.py` | 6,046 B | `7b1e28135b...` | Injected project case studies into bundle. |
| `tools/patch_social_insert.py` | `archive/migrations/patch_social_insert.py` | 6,241 B | `7610075878...` | Social links patch attempt 1. |
| `tools/patch_social_insert2.py` | `archive/migrations/patch_social_insert2.py` | 7,121 B | `372b280c44...` | Social links patch attempt 2. |
| `tools/patch_social_insert3.py` | `archive/migrations/patch_social_insert3.py` | 6,432 B | `d222294249...` | Social links patch attempt 3. |
| `tools/patch_social_links.py` | `archive/migrations/patch_social_links.py` | 15,157 B | `4bcc53f206...` | Social links bundle patcher. |
| `tools/patch_testimonials_landing.py` | `archive/migrations/patch_testimonials_landing.py` | 2,530 B | `0265f1f4c9...` | Testimonials injector. |
| `tools/replace_content.py` | `archive/migrations/replace_content.py` | 2,288 B | `285facbe4d...` | String replacement utility. |
| `tools/setup_legacy_redirects.py` | `archive/migrations/setup_legacy_redirects.py` | 3,723 B | `2eed41af41...` | Created 6 legacy project redirect stubs. |
| `tools/setup_spa_routes.py` | `archive/migrations/setup_spa_routes.py` | 3,161 B | `426c0148d3...` | Created SPA route folders. |

### 2.2 Historical CMS & Schema Data (`archive/migrations/`)
6 intermediate data files moved from `tools/` $\rightarrow$ `archive/migrations/` with verified byte-for-byte SHA256 integrity:

| Original Path | New Archive Path | Size | SHA256 Verification | Rationale |
|---|---|---|---|---|
| `tools/clean_blog_chunk.framercms` | `archive/migrations/clean_blog_chunk.framercms` | 35,523 B | `27292d0f33...` | Raw binary chunk dump. |
| `tools/clean_blog_records.json` | `archive/migrations/clean_blog_records.json` | 35,879 B | `ed7b153b33...` | Decoded blog records. |
| `tools/clean_blog_records_typed.json` | `archive/migrations/clean_blog_records_typed.json` | 54,995 B | `43399c8888...` | Typed AST records for blogs. |
| `tools/decoded_cms_records.json` | `archive/migrations/decoded_cms_records.json` | 35,166 B | `c12665fee7...` | Initial decoded CMS record dump. |
| `tools/project_images.json` | `archive/migrations/project_images.json` | 19,203 B | `2e1c343347...` | Project image hash mapping. |
| `tools/updated_cms_records.json` | `archive/migrations/updated_cms_records.json` | 25,281 B | `3c83f91500...` | Project CMS records. |

### 2.3 Raw Working Assets & Notes
- `tools/source-images/` $\rightarrow$ `archive/raw-assets/source-images/` (57 files / 34 MB raw screenshots and blog graphics).
- `tools/_DataURI/` $\rightarrow$ `archive/raw-assets/data-uris/` (13 SVG data URI text dumps).
- `tools/MD_REVIEW.md` $\rightarrow$ `docs/editorial/MD_REVIEW.md` (1,145 B editorial review note).

---

## 3. Active Scripts Intentionally Preserved in `tools/`

The following 5 active tools and data dependencies were retained in `tools/`:

1. **`tools/publish_blog11.py`:** Active blog article publishing pipeline.
2. **`tools/updated_blog_records.json`:** Canonical CMS record repository containing all 11 published blog records.
3. **`tools/verify_production_readiness.py`:** Automated pre-flight suite testing 24 canonical routes, 6 legacy redirects, 9 critical assets, contact form accessibility, and security headers.
4. **`tools/verify_all_pages.py`:** Headless Chrome DOM verification suite for all portfolio case studies.
5. **`tools/verify_blog_pages.py`:** Headless Chrome DOM verification suite for all published blog detail pages.

---

## 4. Active Tool Path Modernization

### 4.1 Blog Article Publisher (`tools/publish_blog11.py`)
- **Dynamic Project Root Resolution:**
  Replaced hardcoded `BASE_DIR = '/home/souvik/Corabin/Corabin.website'` with:
  ```python
  SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
  BASE_DIR = os.path.abspath(os.path.join(SCRIPT_DIR, '..'))
  ```
- **Single Canonical Targets:**
  - `cms_files`: Targets strictly `public/framerusercontent.com/sites/46CYIm3dbxFoU3f63shpCX/l0aFVHEAD.Du2GMRYI.mjs`.
  - `routes`: Targets strictly `public/blog/real-estate-agent-website-cost-2026/index.html` from source `public/blog/technical-debt-friend-or-foe/index.html`.
  - `sitemap_files`: Targets strictly `public/sitemap.xml`.
- **Preservation:** Article body AST, record schema, OG metadata, breadcrumbs, JSON-LD schemas, and hydration attributes preserved 100% byte-for-byte.

### 4.2 Production Readiness Verifier (`tools/verify_production_readiness.py`)
- **Direct `public/` Serving:**
  Updated `run_server()` to serve `public/` directly (`os.chdir(pub_dir)`).
- **Clean URL Resolution:**
  Implemented `QuietHandler.translate_path` to resolve extensionless clean URLs (mapping `/404` to `404.html`), accurately matching Vercel's edge routing behavior.

### 4.3 Pre-Deploy Sanity Suite (`scripts/check.sh`)
- Updated Check #1 (`deploy folder integrity`) to assert that `archive/` and `scripts/` are never accidentally copied or deployed into `public/`.
- Preserved checks 2 through 9 unchanged without modifying security configurations.

### 4.4 Local Preview Runner (`scripts/dev.sh`)
- Created an executable runner resolving `${PROJECT_ROOT}/public` dynamically.
- Accepts an optional port argument (default: 8080) and uses Python's standard library `http.server`.

---

## 5. Disposable Test Fixture Validation for `publish_blog11.py`

As required by safety regulations, the modified blog publisher was executed strictly against an isolated disposable test fixture in `.test_fixture_publisher/`:
- **Execution Mode:** Out-of-tree test directory mirroring project layout.
- **Fixture Dependencies:** Disposable copies of `updated_blog_records.json`, `l0aFVHEAD.Du2GMRYI.mjs`, `technical-debt-friend-or-foe/index.html`, and `sitemap.xml`.
- **Results:**
  - `updated_blog_records.json` successfully appended record `B7k9Re2wQ`.
  - Framer CMS bundle `l0aFVHEAD.Du2GMRYI.mjs` patched with AST and lookup maps.
  - `real-estate-agent-website-cost-2026/index.html` generated with valid headline, canonical URL, and schema.
  - `sitemap.xml` updated with new URL.
  - Project production files inside `public/` were untouched.
- **Cleanup:** Fixture was cleanly removed.

---

## 6. Local Preview Server Route Validation (`scripts/dev.sh`)

Executed `./scripts/dev.sh 8094` in the background and verified direct HTTP responses without `/public/` in the URL:

| Route Requested | HTTP Status | Response Size | Result |
|:---|:---:|:---:|:---:|
| `http://localhost:8094/` | **200 OK** | 1,379,373 B | **PASS** |
| `http://localhost:8094/about/` | **200 OK** | 1,378,738 B | **PASS** |
| `http://localhost:8094/contact/` | **200 OK** | 1,380,520 B | **PASS** |
| `http://localhost:8094/projects/` | **200 OK** | 1,378,283 B | **PASS** |
| `http://localhost:8094/projects/kora/` | **200 OK** | 1,379,235 B | **PASS** |
| `http://localhost:8094/blog/` | **200 OK** | 1,378,291 B | **PASS** |
| `http://localhost:8094/blog/real-estate-agent-website-cost-2026/` | **200 OK** | 1,379,350 B | **PASS** |
| `http://localhost:8094/privacy/` | **200 OK** | 822,025 B | **PASS** |
| `http://localhost:8094/terms/` | **200 OK** | 822,098 B | **PASS** |
| `http://localhost:8094/404.html` | **200 OK** | 817,980 B | **PASS** |
| `http://localhost:8094/assets/images/Corabin_logo.png` | **200 OK** | 245,001 B | **PASS** |
| `http://localhost:8094/favicon.ico` | **200 OK** | 32,038 B | **PASS** |

---

## 7. Verification Gates & Actual Results

| Gate # | Check Description | Command Executed | Actual Result | Status |
|:---:|:---|:---|:---|:---:|
| **1** | Moved File Integrity & Non-Empty Check | Python SHA256 comparison | All 35 moved files match source hashes byte-for-byte. | **PASS** |
| **2** | Active Tools Preservation | Inventory verification | All 5 designated tools confirmed active in `tools/`. | **PASS** |
| **3** | Stale Reference Scan | Python reference crawler across `scripts/` and `tools/` | Zero stale `tools/<moved_file>` paths found. | **PASS** |
| **4** | Pre-Deploy Sanity Suite | `bash scripts/check.sh` | **9/9 checks passed**. | **PASS** |
| **5** | Shell Script Syntax Validation | `bash -n scripts/*.sh` | 0 syntax errors across all shell scripts. | **PASS** |
| **6** | Python Script Compilation | `python3 -m py_compile tools/*.py archive/migrations/*.py` | All 33 Python scripts compiled with 0 errors. | **PASS** |
| **7** | Local Preview Route Validation | Ephemeral preview server on port 8094 testing 12 routes | All 12 routes returned **HTTP 200 OK**. | **PASS** |
| **8** | Production Readiness Verifier | `python3 tools/verify_production_readiness.py` | **41 PASSED, 0 ERRORS** across all routes, stubs, and assets. | **PASS** |
| **9** | Production `public/` Parity Audit | Cryptographic SHA256 comparison against pre-Stage 2 baseline | **100% Identical:** 0 added, 0 removed, 0 modified (395 files checked). | **PASS** |

---

## 8. Summary of Residual Risks & Next Steps

1. **Production Parity Protected:** `public/` remains completely untouched.
2. **Tooling Cleanliness:** `tools/` now contains strictly active tools (5 items down from 43).
3. **Stage 2 Complete:** The tooling and paths are modernized and ready for Stage 3 (Security & CSP Configuration + HTML Syntax Repair).
