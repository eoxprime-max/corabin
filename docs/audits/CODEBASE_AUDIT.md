# CODEBASE_AUDIT.md — Corabin Studio Website

**Audit Date**: 2026-10-01  
**Auditor**: Re-engineering pass (pre-SEO cleanup)  
**Purpose**: Full codebase audit before SEO/production optimization.

---

## 1. Detected Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Static file server (no Node.js, no backend) |
| Frontend Framework | React 18 (client-side hydration of SSR HTML) |
| Bundler | Rolldown (Framer's internal Vite/Rollup variant) |
| Animation | Framer Motion |
| Scroll | Lenis smooth-scroll v1.3.19 |
| CMS | Framer CMS (binary .framercms, decoded & in-memory patched) |
| Routing | File-based SPA (data-framer-hydrate-v2 attributes on static HTML) |
| Styling | Framer-generated CSS + <style id="corabin-brand-overrides"> custom block |
| Typography | Onest, Fragment Mono (Google Fonts CDN), Inter/Inter Display (local woff2) |
| Package Manager | None (no package.json) |
| Build System | None (pre-compiled Framer export) |
| Deployment | Any static file server |

---

## 2. How The Site Works

1. Browser requests / → receives index.html (full SSR HTML, 1.37MB)
2. script_main.CNn1uaXy.mjs bootstraps React, reads data-framer-hydrate-v2 JSON, determines route, lazy-loads page .mjs
3. Blog/project data embedded as JS class definitions inside .mjs files (patched with Corabin content)
4. Internal navigation is client-side SPA. Each sub-route has a static index.html with correct hydration attribute.
5. Images: /assets/images/ for project/blog images; https://framerusercontent.com/images/ CDN for original template photos.

---

## 3. Files Created During Audit

- .gitignore — OS/editor/Python artifact exclusions
- tools/README.md — Explains migration scripts; DO NOT re-run warning
- CODEBASE_AUDIT.md — This document

---

## 4. Files Removed

| File/Directory | Reason |
|---------------|--------|
| index.html.bak | Migration backup |
| opus-template.framer.website/index.html.bak | Migration backup |
| framerusercontent.com/.../ARVkZnRTw.BOg_bqGO.mjs.bak | Migration backup |
| framerusercontent.com/.../l0aFVHEAD.Du2GMRYI.mjs.bak | Migration backup |
| framerusercontent.com/.../jfdGCqCG1...BwObU7WC.mjs.bak | Migration backup |
| test_chunk.framercms | Temporary test file |
| test_indexes.framercms | Temporary test file |
| test_screen.png | Temporary screenshot |
| inspector---opus-template.framer.website/ | Chrome DevTools DOM snapshot artifact |
| events.framer.com/ | Framer telemetry (0 refs in live files) |
| api.framer.com/ | Framer auth API (0 refs in live files) |
| app.framerstatic.com/ | Framer editor app (0 refs in live files) |
| framer.com/ | Framer editor bootstrap (dead-code path only) |
| opus-template.framer.website/ | Byte-for-byte duplicate of root index.html |
| docs/baseline/ | Empty directory |

---

## 5. Files Moved to tools/

14 Python migration scripts, 7 intermediate JSON/framercms data files,
New_updated_img/ (34MB source images) -> tools/source-images/,
_DataURI/ (SVG extraction files), docs/MD_REVIEW.md (planning notes)

---

## 6. Content Fixes Applied

| File | Fix |
|------|-----|
| index.html | CSS comment: removed "OPUS clean fold" -> Corabin-specific explanation |
| FhR90JJqz.js | children: "Markus Chen" -> "Souvik" (blog detail module) |
| JM55RxQUn.js | data-framer-name: "Markus Chen" -> "Souvik" (about page module) |

---

## 7. Template Remnants — Final Scan Results

| Search Term | Occurrences in Served Files |
|------------|----------------------------|
| opushq | 0 |
| Markus Chen | 0 |
| STUDIO OPUS | 0 |
| opus-template | 0 |
| OPUS (case-sensitive) | 0 |

---

## 8. Dependencies

No package.json. Runtime libraries are Framer-bundled:
- React 18 (MIT)
- Framer Motion (MIT)  
- Lenis 1.3.19 (MIT)
- Rolldown runtime (Framer proprietary)

No unused dependencies found.

---

## 9. Asset Inventory

Served:
- assets/images/Corabin_logo.png — Favicon, apple-touch-icon, CSS logo
- assets/images/blogs/blog{1-10}.png — Blog thumbnails
- assets/images/projects/{name}/img{1-6}.png — Project screenshots
- framerusercontent.com/images/ — 43 original Framer photos (CDN)
- video.gumlet.io/ — Hero video

Not served (tools/):
- tools/source-images/ — 34MB original AI-generated images (staging)
- tools/_DataURI/ — SVG extraction working files

---

## 10. Environment / Security

- No API keys or secrets in source files — PASS
- No hardcoded passwords or tokens — PASS
- No .env file needed (static site) — PASS
- .gitignore was missing — FIXED (created)
- Contact form POSTs to Framer backend — NOTE: if Framer project expires, form submissions fail. Consider Formspree/Netlify Forms for production independence.
- script_main has dead-code path to framer.com/edit/init.mjs — INFO: only loads when Framer editor flag is true (never true on standalone hosting). Harmless.

---

## 11. Remaining Technical Debt

| Item | Priority |
|------|---------|
| Contact form independence (from Framer backend) | Medium |
| Font self-hosting (GDPR / external dependency) | Low |
| Lenis CSS: link still points to unpkg CDN (local mirror exists) | Low |
| Image optimization: PNGs -> WebP/AVIF + responsive srcsets | Medium |
| Template photos on framerusercontent.com CDN (external dependency) | Low |
| sitemap.xml missing | HIGH — SEO pass |
| robots.txt missing | HIGH — SEO pass |
| Canonical meta tags | HIGH — SEO pass |
| <html lang=""> is empty string, should be lang="en" | Medium |
| Open Graph / Twitter Card meta tags need verification | HIGH — SEO pass |
| No 404 fallback page configured | Medium |
| tools/ dir is 35MB in git (consider .gitignore or Git LFS) | Low |

---

## 12. License / Third-Party

- OPUS Framer Template: Commercial license (Framer Marketplace). Private end-use deployment — compliant.
- Framer Runtime: Proprietary (Framer Inc.). Self-hosting permitted under export terms.
- Template photography (framerusercontent.com/images/): Licensed via Framer/Unsplash. Not Corabin's photos.
- React, Framer Motion, Lenis: MIT. Bundled by Framer.
- Google Fonts (Onest, Fragment Mono): SIL Open Font License.

DO NOT insert comments claiming the site was built from scratch. It originated from a commercially licensed Framer template.

---

## Summary

STACK: Static HTML + React 18 hydration (pre-compiled Framer export). No build system. No backend.

ARCHITECTURE: File-based SPA. index.html = SSR HTML + inline CSS. React hydrates via script_main.mjs. CMS data embedded in .mjs. All assets local or CDN.

FILES CREATED: .gitignore, tools/README.md, CODEBASE_AUDIT.md

FILES MODIFIED: index.html (CSS comment), FhR90JJqz.js, JM55RxQUn.js

FILES REMOVED: 5x .bak, 3x test files, inspector dir, events/api/editor Framer dirs, duplicate HTML dir, empty baseline dir

FILES REORGANIZED: 14x Python scripts, 7x data files, 34MB source images, DataURIs, MD_REVIEW — all to tools/

DEPENDENCIES REMOVED: None applicable

ASSETS CLEANED: 34MB staging dir removed from root. 3x unreferenced Framer external dirs removed.

SECURITY: No secrets found. Contact form Framer dependency noted.

LICENSE: Commercial template (Framer). MIT runtime libs. Framer proprietary runtime.

BUILD STATUS: No build step. Structural integrity verified. Zero template remnants in served files.

READY FOR SEO PASS: YES — Structure clean. Priorities: lang attr, sitemap.xml, robots.txt, canonical tags, OG meta, image optimization, 404 page.
