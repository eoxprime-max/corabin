# Stage 4 Cleanup Report — Safe Retirement of Root-Level Duplicate Website Files

**Date:** October 13, 2026  
**Repository:** `/home/souvik/Corabin/Corabin.website` (Original GitHub-connected Project)  
**Status:** Completed & Verified  
**Scope:** Stage 4: Safe Retirement of Obsolete Root-Level Duplicate Static Website Files & Folders  
**Safety Guarantees Met:** Canonical production directory (`public/`) verified 100% byte-for-byte identical to pre-cleanup baseline (395 files, zero additions, zero deletions, zero content changes); zero modifications to `vercel.json`, root `_headers`, `_redirects`, `scripts/`, `tools/`, `docs/`, `archive/`, `.gitignore`, `README.md`, `.git/`, or `.corabin-local-backups/`; zero test leads submitted to live webhook.

---

## 1. Overview & Objective

In the original repository setup, an obsolete full website export resided at the repository root alongside the canonical `public/` deployment directory. While Vercel static deployment (`vercel.json`), preview tooling (`scripts/dev.sh`), quality validation (`scripts/check.sh`), and the blog publishing pipeline (`tools/publish_blog11.py`) had already been configured to target `public/` exclusively, the redundant root copies created architectural confusion, wasted ~87.3 MB of disk space, and created risk of accidental edits to non-deployed files.

Stage 4 retired only the confirmed obsolete root-level website files and directories while keeping all canonical production files, deployment headers, redirects, active tooling, documentation, and local backups completely intact.

---

## 2. Pre-Cleanup Safety Baseline

Before removing any files:
1. Verified the working directory was strictly `/home/souvik/Corabin/Corabin.website`.
2. Confirmed `vercel.json` specifies `"outputDirectory": "public"`.
3. Confirmed `scripts/dev.sh` serves `${ROOT_DIR}/public`.
4. Confirmed `scripts/check.sh` validates `$PUB` (`public/`).
5. Recorded a temporary cryptographic SHA256 manifest of all 395 files under `public/` (`.pre_stage4_public_manifest.json`).
6. Verified that no active scripts, configuration files, or canonical website links contained relative path escapes or un-prefixed root dependencies.

---

## 3. Inventory of Removed Root-Level Duplicate Files & Directories

A total of **12 directories** and **6 loose files** (393 individual files total, reclaiming **91,551,237 bytes / ~87.3 MB**) were verified as obsolete export copies and safely removed from the repository root:

### 3.1 Removed Directories
| Directory | File Count | Size | Verification & Safety Rationale |
|---|---|---|---|
| `404/` | 1 file | 817,614 B | Early SPA route experiment containing `404/index.html`. Canonical 404 page is `public/404.html`. |
| `about/` | 1 file | 1,378,332 B | Obsolete duplicate of `public/about/index.html`. Pre-Stage 3 duplicate; canonical version in `public/about/` contains verified JS operator fixes. |
| `contact/` | 1 file | 1,380,114 B | Obsolete duplicate of `public/contact/index.html`. Canonical version in `public/contact/` contains verified JS operator fixes. |
| `projects/` | 13 files | 9,664,645 B | Obsolete duplicate export of project index and case studies. Canonical versions in `public/projects/` contain verified repairs. |
| `blog/` | 12 files | 16,545,660 B | Obsolete duplicate export of blog index and articles 1–10. Canonical versions in `public/blog/` contain verified repairs and Article 11. |
| `privacy/` | 1 file | 821,608 B | Obsolete duplicate of `public/privacy/index.html`. Canonical version in `public/privacy/` contains verified CSS deduplication. |
| `terms/` | 1 file | 821,681 B | Obsolete duplicate of `public/terms/index.html`. Canonical version in `public/terms/` contains verified CSS deduplication. |
| `assets/` | 113 files | 31,261,644 B | Obsolete duplicate of served assets. Every file in root `assets/` exists in `public/assets/` (which contains 124 files, including localized webfonts). |
| `framerusercontent.com/` | 241 files | 24,294,554 B | Obsolete duplicate export of Framer runtime modules and unbundled scraper cache (`https/`). Canonical bundled runtime is served from `public/framerusercontent.com/`. |
| `fonts.gstatic.com/` | 1 file | 32,236 B | Obsolete duplicate font file. Identical copy exists at `public/fonts.gstatic.com/s/inter/v18/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7W0Q5nw.woff2`. |
| `video.gumlet.io/` | 1 file | 2,180,112 B | Obsolete duplicate video asset. Identical copy exists at `public/video.gumlet.io/6582a8.../673199.../asset-1080.mp4`. |
| `unpkg.com/` | 1 file | 521 B | Obsolete duplicate stylesheet stub. Identical copy exists at `public/unpkg.com/lenis@1.1.18/dist/lenis.css`. |

### 3.2 Removed Loose Root Files
| File | Size | Verification & Safety Rationale |
|---|---|---|
| `index.html` | 1,378,959 B | Obsolete duplicate homepage export. Canonical homepage is served from `public/index.html` (which contains Stage 3 CSS deduplication). |
| `404.html` | 817,563 B | Obsolete duplicate 404 page. Canonical 404 page is served from `public/404.html` (which contains Stage 3 CSS deduplication). |
| `favicon.ico` | 32,038 B | Obsolete duplicate favicon. Canonical favicon is served from `public/favicon.ico` (byte-for-byte SHA256 match). |
| `robots.txt` | 317 B | Obsolete duplicate robots directive. Canonical file is served from `public/robots.txt` (byte-for-byte SHA256 match). |
| `sitemap.xml` | 4,475 B | Obsolete duplicate sitemap. Canonical file is served from `public/sitemap.xml` (byte-for-byte SHA256 match; updated by blog publisher). |
| `Souvik_short_profile_img.jpeg` | 119,164 B | Obsolete loose root image export. Preserved in `public/Souvik_short_profile_img.jpeg` and `public/assets/images/about/Souvik_short_profile_img.jpeg` (byte-for-byte SHA256 match). |

---

## 4. Root Files & Directories Intentionally Retained

The repository root now contains exclusively essential project infrastructure, tooling, deployment configuration, and documentation:

```text
.
├── .corabin-local-backups/      # Local historical backup snapshots (protected from deletion)
├── .git/                       # Git version control metadata
├── .gitignore                  # Git repository ignore rules
├── README.md                   # Clean project documentation & preview guide
├── _headers                    # Root fallback security & caching headers (Netlify / Cloudflare Pages)
├── _redirects                  # Root fallback 301 redirects for legacy project slugs
├── archive/                    # Historical migrations & raw unreferenced source assets
│   ├── migrations/             # 35 historical one-time template migration scripts & CMS dumps
│   └── raw-assets/             # Original branding, source images, legacy chunks & SVG dumps
├── docs/                       # Project documentation & audit reports
│   ├── architecture/           # Technical changelog & system design
│   ├── audits/                 # Audit reports (Stages 1–4, codebase, SEO, production)
│   ├── editorial/              # Editorial guidelines & content maps
│   └── logs/                   # Diagnostic error logs
├── public/                     # CANONICAL STATIC WEBSITE DIRECTORY (served in dev and production)
├── scripts/                    # Development & quality assurance scripts
│   ├── check.sh                # Pre-deploy sanity check suite (11 automated tests)
│   └── dev.sh                  # Local preview server (serves public/)
├── tools/                      # Content management tools & verification suites
│   ├── publish_blog11.py       # Blog article publishing workflow (targets public/)
│   ├── updated_blog_records.json # Canonical CMS blog records (11 articles)
│   └── verify_*.py             # Automated route & DOM verification suites
└── vercel.json                 # Vercel deployment configuration (outputDirectory: "public")
```

---

## 5. Tooling Adjustments & Reference Verification

- **Blog Article Publisher (`tools/publish_blog11.py`):** Verified that line 5–6 resolves paths dynamically relative to `tools/` and targets `public/` exclusively (`public/framerusercontent.com/...`, `public/blog/...`, `public/sitemap.xml`).
- **Production Readiness Suite (`tools/verify_production_readiness.py`):** Verified that `PUB_DIR` points to `${ROOT_DIR}/public`.
- **Pre-Deployment Check (`scripts/check.sh`):** Verified that `$PUB` points to `public`.
- **Local Preview Runner (`scripts/dev.sh`):** Verified that `PUB_DIR` points to `${ROOT_DIR}/public`.
- **No Path Adjustments Required:** Because Stage 2 had already modernized all active tools to resolve paths dynamically and target `public/`, zero script adjustments were necessary during Stage 4.

---

## 6. Verification Checks & Actual Results

### 6.1 Cryptographic Integrity Verification of `public/`
A post-cleanup cryptographic scan comparing all files under `public/` against the pre-cleanup baseline SHA256 manifest confirmed:
- **Baseline file count:** 395
- **Post-cleanup file count:** 395
- **Files added:** 0
- **Files deleted:** 0
- **Files modified:** 0
- **Status:** **100% byte-for-byte identical.** The canonical production website was completely unaffected by the root retirement.

### 6.2 Pre-Deploy Sanity Suite (`bash scripts/check.sh`)
- **Command:** `bash scripts/check.sh`
- **Result:** **Exit Code 0 (All 11 checks passed)**:
  1. No internal files in deploy folder (`public/`).
  2. All mailto links correctly formatted without trailing spaces.
  3. No template leftovers (`opus_template`, `Markus`, `lorem ipsum`).
  4. Old Framer form ID removed.
  5. 404 page has `noindex`.
  6. Template publish stamps removed.
  7. Form endpoint configured.
  8. CSP enforced (not Report-Only).
  9. No placeholder URLs in deployment config.
  10. Malformed JS operator check: All inline JavaScript operators valid.
  11. CSP contact form webhook allowlist: `https://n8n.corabin.com` allowed in `connect-src` and `form-action`.

### 6.3 Shell Script Syntax Validation (`bash -n scripts/check.sh scripts/dev.sh`)
- **Command:** `bash -n scripts/check.sh scripts/dev.sh`
- **Result:** **Exit Code 0** (Zero shell syntax errors or warnings).

### 6.4 Configuration Syntax Validation (`python3 -m json.tool vercel.json > /dev/null`)
- **Command:** `python3 -m json.tool vercel.json > /dev/null`
- **Result:** **Exit Code 0** (Valid JSON, formatting intact).

### 6.5 Python Tool Compilation (`python3 -m py_compile tools/*.py`)
- **Command:** `python3 -m py_compile tools/*.py`
- **Result:** **Exit Code 0** (All Python scripts compile without syntax errors).

### 6.6 Production Readiness Verifier (`python3 tools/verify_production_readiness.py`)
- **Command:** `python3 tools/verify_production_readiness.py`
- **Result:** **Exit Code 0 (41 PASSED, 0 ERRORS)**:
  - 24 canonical routes verified [200 OK].
  - 6 legacy redirect stubs verified [301 Redirect].
  - 9 critical assets verified [200 OK].
  - Contact form accessibility & required attributes verified.
  - Security headers & CSP configuration verified.

### 6.7 Preview Server Route Testing (`./scripts/dev.sh 8089`)
Started preview server on port 8089 serving `public/` and executed automated HTTP route checks:
- `http://localhost:8089/` $\rightarrow$ `[200 OK]` Title: *Corabin — Digital Design & Modern Web Architecture*
- `http://localhost:8089/contact/` $\rightarrow$ `[200 OK]` Title: *Contact Corabin — Start a Project or Get in Touch*
- `http://localhost:8089/projects/` $\rightarrow$ `[200 OK]` Title: *Projects — Corabin Client Portfolio & Case Studies*
- `http://localhost:8089/blog/` $\rightarrow$ `[200 OK]` Title: *Blog — Web Architecture, Design & Performance Insights*
- `http://localhost:8089/blog/real-estate-agent-website-cost-2026/` $\rightarrow$ `[200 OK]` Title: *How Much Does a Real Estate Agent Website Cost in 2026?*
- `http://localhost:8089/privacy/` $\rightarrow$ `[200 OK]` Title: *Privacy Policy — Corabin Studio*
- `http://localhost:8089/terms/` $\rightarrow$ `[200 OK]` Title: *Terms of Service — Corabin Studio*
- `http://localhost:8089/404.html` $\rightarrow$ `[200 OK]` Title: *404 — Page Not Found | Corabin*
- `http://localhost:8089/some-random-route-xyz` $\rightarrow$ `[404 Not Found]` Verified proper 404 response.
- **Server Shutdown:** Test server stopped cleanly following verification.

---

## 7. Remaining Cleanup Candidates & Unresolved Items

1. **No Remaining Root Duplicate Candidates:**
   The root directory has been fully consolidated. There are zero remaining duplicate website export files or folders at the repository root.
2. **Local Backups Intentionally Retained:**
   `.corabin-local-backups/` was preserved at root as mandated by project safety constraints.
3. **Live Webhook Submission:**
   In compliance with safety rules, no test submission was posted to the live production endpoint `https://n8n.corabin.com/webhook/contact-form`. Static allowlists in CSP were verified.

---

## 8. Summary of Completion

Stage 4 is complete. The repository root now cleanly reflects the true architecture of the project: `public/` as the single canonical website directory, accompanied by dedicated `tools/`, `scripts/`, `docs/`, and `archive/` folders. Zero functional, visual, or content changes occurred in the production website.
