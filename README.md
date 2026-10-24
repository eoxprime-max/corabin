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
├── vercel.json                           ← Vercel deployment & rewrite configuration
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
