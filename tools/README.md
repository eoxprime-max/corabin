# Corabin — Migration & Transformation Tools

These scripts were **one-time migration tools** used to transform the original "OPUS" Framer website template into the Corabin Studio branded, self-hosted site.

**They have already been applied. They are NOT part of the live site.**

The live site is served entirely from static files: `index.html` and the local mirror of Framer runtime assets under `framerusercontent.com/`.

---

## Script Inventory

| Script | Purpose | Status |
|--------|---------|--------|
| `apply_corabin_branding.py` | Phase 1: HTML-level branding, metadata, Framer removal, CSS overrides, local asset remapping | **Applied** |
| `apply_full_customization.py` | Phase 2: Deep `.mjs` module edits — hero, metrics, services, counters, FAQs, About page, legal, Pricing excision | **Applied** |
| `apply_round2_refinements.py` | Phase 3: Logo CSS override, phone/location, "Our approach" restoration, spacing fixes, viewport fold alignment | **Applied** |
| `replace_content.py` | Bulk binary-level find-and-replace sweep across all files | **Applied** |
| `inject_styles.py` | Early CSS override injection (superseded by later scripts) | **Applied** |
| `cleanup_remaining.py` | Targeted cleanup of remaining OPUS references in modules | **Applied** |
| `fix_service4_and_counters.py` | Fixes Service 04 label and infinity icon → 5+ counter | **Applied** |
| `decode_blogs.py` | Reverse-engineered Framer's binary `.framercms` format into JSON for inspection | **Applied** |
| `generate_corabin_blogs.py` | Generated 10 original blog articles with Framer RichText AST | **Applied** |
| `patch_blogs_cms.py` | Patched blog CMS module with in-memory data + slug resolvers + SPA routes | **Applied** |
| `patch_projects_cms.py` | Patched projects CMS module with updated records + bidirectional slug resolver | **Applied** |
| `setup_spa_routes.py` | Generated all static SPA route entry points (projects, about, contact, blog) | **Applied** |
| `verify_all_pages.py` | Headless Chrome verification of project routes (post-migration QA) | **Applied** |
| `verify_blog_pages.py` | Headless Chrome verification of blog routes (post-migration QA) | **Applied** |

---

## Intermediate Data Files

These JSON/framercms files were intermediate outputs used during the migration pipeline. They are **not loaded at runtime**.

- `decoded_cms_records.json` — Decoded raw projects CMS records (inspection output)
- `project_images.json` — Project image metadata used during CMS patching
- `clean_blog_records.json` — Decoded raw blog CMS records (pre-branding)
- `clean_blog_records_typed.json` — Typed version with field descriptors intact
- `clean_blog_chunk.framercms` — Clean binary backup of original blog CMS chunk
- `updated_blog_records.json` — Final Corabin blog records used to patch the CMS
- `updated_cms_records.json` — Final Corabin project records used to patch the CMS

---

## Do NOT re-run these scripts against a production site

Re-running these scripts on the current codebase would break the live site — they contain targets from the original OPUS template that no longer exist in the current codebase.

If the site needs future content updates, edit the CMS modules directly or consider migrating to a proper headless CMS.
