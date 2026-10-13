# Corabin

### Digital Presence, Reimagined.

Corabin is a premium digital portfolio and brand experience designed to present the studio's work, capabilities, and visual identity through a refined, modern web experience.

The website combines clear information architecture, strong visual hierarchy, intentional motion, and a cohesive design language to create a digital presence that feels distinctive, confident, and aligned with the Corabin brand.

---

## Overview

The Corabin website serves as the central digital home for the brand, bringing together its identity, selected work, services, and brand story in one cohesive experience.

The interface follows a restrained and purposeful approach, using carefully considered typography, spacing, imagery, transitions, and interactive details to maintain a premium visual standard without unnecessary complexity.

### Design Principles

- **Clarity** — Content remains easy to understand and navigate.
- **Precision** — Layout, spacing, typography, and motion are intentionally controlled.
- **Character** — The visual language is centered around the Corabin identity.
- **Consistency** — Pages and components follow a unified design system.
- **Performance** — Interactions and visuals are implemented with a focus on a smooth user experience.

---

## Experience

The website is designed around the complete Corabin brand experience.

### Brand

A distinctive visual language establishes Corabin's identity from the first interaction and maintains that character throughout the website.

### Portfolio

Selected work is presented with an emphasis on visual storytelling, hierarchy, and context, allowing each project to receive the attention it deserves.

### Services

Capabilities and offerings are communicated through a clean structure that keeps the focus on value, clarity, and credibility.

### Interaction

Subtle transitions, hover states, scrolling behavior, and micro-interactions add depth and responsiveness without distracting from the content.

### Responsive Design

The experience adapts across desktop, tablet, and mobile devices while preserving visual hierarchy, usability, and consistency.

---

## Design System

The website is built around a cohesive design system covering:

- Typography
- Color and contrast
- Spacing and layout rhythm
- Grid structure
- Buttons and controls
- Cards and content sections
- Navigation patterns
- Responsive behavior
- Motion and transition principles

The system is structured to keep future pages, sections, and content visually consistent with the overall Corabin experience.

---

## Technology

The website is engineered as a high-performance static web application designed for exceptional speed, visual fidelity, and security.

**Core Technologies**

- **Frontend Engine**: React 18 client-side hydration over pre-rendered SSR HTML
- **Bundler**: Rolldown / Framer runtime bundler
- **Styling**: Modular CSS tokens + dedicated `<style id="corabin-brand-overrides">` brand system
- **Motion & Scrolling**: Framer Motion + Lenis Smooth Scroll v1.3.19
- **Deployment Platform**: Vercel Static Hosting (`vercel.json` with `"outputDirectory": "public"`)
- **Multi-Platform Fallback**: Netlify / Cloudflare Pages compatible via `_headers` and `_redirects`

---

## Project Structure

```text
.
├── vercel.json                 # Vercel deployment configuration (outputDirectory: "public")
├── _headers                    # Root fallback security & caching headers
├── _redirects                  # Root fallback 301 redirect rules for legacy project slugs
├── scripts/
│   ├── check.sh                # Automated pre-deployment validation suite (verifies public/)
│   └── dev.sh                  # Local preview server (serves public/ on port 8080)
├── tools/                      # Content management tools & verification suites
│   ├── publish_blog11.py       # Blog article publishing workflow (targets public/)
│   ├── updated_blog_records.json # CMS blog records
│   └── verify_*.py             # Automated route & DOM verification suites
├── docs/                       # Organized documentation
│   ├── architecture/           # System design & changelogs
│   ├── audits/                 # Production & security audit reports
│   ├── editorial/              # Editorial strategy & content map
│   └── logs/                   # Historical diagnostic logs
├── archive/                    # Non-runtime archives & raw source assets
│   ├── migrations/             # Historical one-time template migration scripts
│   └── raw-assets/             # Original branding, source images, legacy chunks & SVG dumps
├── public/                     # CANONICAL WEBSITE DIRECTORY (served in dev and production)
└── README.md
```

The structure keeps public production assets separate from internal tooling and documentation.

---

## Local Development & Preview

The site is fully self-contained with no npm dependencies required to run locally.

### Start Local Static Preview

Use the dedicated preview runner (which automatically serves the canonical `public/` directory):

```bash
./scripts/dev.sh
```

To specify a custom port:

```bash
./scripts/dev.sh 8089
```

Or using manual server commands:

```bash
python3 -m http.server 8080 --directory public
```

Open `http://localhost:8080` in your browser.

---

## Pre-Deployment Quality Checks

Before publishing changes to production or deploying to Vercel, run the automated validation suite:

```bash
./scripts/check.sh
```

This script verifies:
1. **Deploy folder integrity** — Ensures internal files (`docs/`, `tools/`, `archive/`, `scripts/`, `.git/`) are never deployed.
2. **Mailto links** — Validates proper syntax without malformed whitespace.
3. **No template remnants** — Confirms removal of legacy template identifiers and publish stamps.
4. **Contact form endpoint** — Verifies production webhook configuration.
5. **SEO & Link hygiene** — Validates `noindex` on 404 pages and proper redirect definitions.
6. **CSP enforcement** — Asserts Content Security Policy is strictly enforced.


---

## Project Goals

The Corabin website is designed to:

- Establish a strong digital brand presence
- Present work through a premium visual experience
- Communicate capabilities with clarity
- Create a memorable first impression
- Maintain a scalable and consistent interface
- Deliver a polished experience across devices

---

## Status

**Active Development**

The website and its underlying design system may continue to evolve as Corabin's brand, content, and digital presence are refined.

---

## Brand

**Corabin**

A focused digital experience built around thoughtful design, clear communication, and a refined visual identity.

**Website:** [corabin.com](https://corabin.com)

---

## Repository

This repository contains the source code and implementation of the Corabin web experience.

The project is maintained specifically for the Corabin brand and its digital presence.
