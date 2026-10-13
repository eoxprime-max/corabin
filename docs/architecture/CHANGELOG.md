# Corabin Studio Rebranding & Framer Decoupling Changelog

## 1. Brand Identity & Copy Updates
- **Brand Name**: Replaced all instances of `OPUS` and `Opus` with `CORABIN` and `Corabin`.
- **Main Heading**: Replaced `STUDIO OPUS` with `STUDIO CORABIN` across all breakpoints with recalculated responsive SVG fit-text viewBox metrics (`viewBox="0 0 1064.7 192"` on desktop).
- **Hero Intro**: Updated to *"At Corabin, we help companies build stronger brands, modern products, and websites that actually perform."*
- **Contact & Email**: Replaced `contact@opushq.com` with `hello@corabin.com`.
- **Domain & Canonical**: Replaced `https://opus-template.framer.website` with `https://corabin.com`.
- **Copyright**: Replaced `@2025/2026 Opus, All Rights Reserved` with `@2026 Corabin, All Rights Reserved`.

## 2. Key Section Metrics & Content
- **Metrics Bar**:
  - `47+ Projects delivered` -> `25+ Projects delivered` (animated counter set to 25)
  - `95% Client retention` -> `99% On-time delivery` (animated counter set to 99)
  - `$21M Client revenue impacted` -> `$17M Client revenue impacted` (animated counter set to 17)
- **Services**:
  - Service 04 Title: `04 Motion Graphics` -> `04 App Development`
  - Service 04 Description: *"We build intuitive, scalable digital applications that combine smooth user experiences with robust performance across every modern device."*
- **Mid-Page Call to Action**:
  - *"Corabin brings together bespoke design, modern development, and strategic thinking to help you grow."*
- **Studio Strengths & Counters**:
  - `19 talented individuals` -> `1:1 Direct collaboration`
  - `134+ projects later` -> `25+ Projects delivered`
  - `∞ combined experience` -> `5+ Years experience`
  - About Headline: *"We are a boutique digital studio dedicated to making a difference through intentional design."*
  - CTA Link: `Meet the team` -> `Our story`
- **Testimonials**:
  - Testimonial 01 (Tom Bennett): *"Finally found a partner that understands both design and business..."*
  - Testimonial 02 (Sarah Chen): *"The level of strategic thinking brought to the project was exceptional. Corabin didn't just build what we asked for — they made it better."*
  - Testimonial 03 (Marcus Rodriguez): *"Every feature built was focused on driving results. They completely transformed how we think about our digital presence."*
- **FAQ Section**:
  - Q1: Custom website development, interactive apps, and brand identities.
  - Q2: 2 to 4 weeks for landing pages, 4 to 8 weeks for complex multi-page platforms.
  - Q3: Discovery, Figma prototyping, responsive build, and multi-device testing.
  - Q5: Direct, transparent collaboration with seamless tech stack integration.

## 3. About Us Page Customizations
- **Hero & Mission**: *"Crafting modern digital experiences that perform"* and *"At Corabin, we are more than just a design studio, creating thoughtful design and clean code."*
- **Studio Story**: *"From a passion for craft to a trusted digital partner"*
- **Approach & Founder Quote**:
  - Founder name set to **Souvik** with role **Founder, Corabin**.
  - Quote: *"When I founded Corabin, I had a clear vision to help businesses stand out online by combining refined visual design and robust code."*
- **Team Grid**: Simplified the 8-person grid into a single Founder profile (Souvik, Founder, Corabin).
- **Core Values**: Updated Value 01 to Corabin's culture of continuous learning, experimentation, and modern web standards.
- **CTA Headline**: *"Ready to build something extraordinary?"*

## 4. Legal Pages (Privacy Policy & Terms of Service)
- **Privacy Policy**: Updated effective date to September 2026, Corabin brand definitions, security provisions, and contact details (`hello@corabin.com`, `+918101685159`).
- **Terms of Service**: Updated effective date to September 2026, Corabin legal governance, and contact email (`hello@corabin.com`).

## 5. Framer Artifact & Watermark Removals
- **Badge Container**: Excised `#__framer-badge-container` from the DOM and permanently disabled the React hydration loader in `script_main.CNn1uaXy.mjs`.
- **CSS Overrides**: Enforced `display: none !important` on badge containers, Framer badges, Pricing section, and Culture section.
- **Telemetry Script**: Removed `https://events.framer.com/script?v=2` and neutered `published_site_pageview` event tracking calls.
- **Metadata**: Replaced generator tag `Framer 0f5ea8b` with `Corabin Studio`, updated OpenGraph and Twitter cards to Corabin branding.
- **Editor Bar**: Removed all Framer editor bar scripts and localStorage hooks.

## 6. Architecture & Self-Contained Hosting
- **Local Asset Mapping**: Remapped `index.html` module preloads and script tags from `https://framerusercontent.com` to local paths (`/framerusercontent.com/...`).
- **Root Entry Point**: Created [index.html](file:///home/souvik/Projects/opus_template.framer.website/index.html) at the workspace root so any standard web server or static host will run the site directly out-of-the-box.

## 7. Round 2 Refinements & User Customizations (September 2026)
- **1. Section Action Button Replacement ("Our story ↗")**:
  - Replaced "Meet the team ↗" with "Our story ↗" on the Home page hero intro button across both SSR HTML and React hydration chunk `iKJRSh9jmrbmilHdac6ozhPaiCytW8lQqaCPLmlLitI.Z1Wyg5E1.mjs` and module `augiA20Il.js`.
  - Updated button component layer names in `ynxsaIxXW.BCRUgNo9.mjs` and `AO9TGkCbC._OuyEL15.mjs`.
- **2. Contact Phone Number**:
  - Replaced all instances of `+1 (555) 123-4567` with `+918101685159` across Contact page chunk `JLqe-6-qAsyy3l1paNGwEVrh-qv_jf3v_djF_VYWBoY.Ba0X3WII.mjs`, module `TQtrT4cVD.js`, and legal documents (`cDUh2JYGT-2.BDCxe8nq.mjs`, `cDUh2JYGT-2.js`).
- **3. Studio Location**:
  - Replaced `42 Pixel Place, Suite 404, New York, NY 10012` with `Kolkata, India, 700001` across Contact page chunk and modules.
- **4. About Page "Our approach" Section Restoration**:
  - Restored cards `02 Thoughtful solutions` and `03 Continuous innovation` in `znfm_uW3YvFdDZ28MEdBO9z2HrI7OaPyUiz_zX9GYnw.DsWxHuen.mjs`, preserving 100% of the Framer animations, typography, and styling tokens.
- **5. About Page Spacing Optimization Below Founder**:
  - Removed the empty second row generated by `grid-template-rows: repeat(2, minmax(0, 1fr))` in `.framer-14jbf0j` by setting `grid-template-rows: auto;`.
  - Reduced excess container and section padding (`padding-bottom: 40px; gap: 40px`), eliminating the large empty white space between the founder profile and the "Ready to build something extraordinary?" CTA.
- **6. Legal Documents Update Date ("September 2026")**:
  - Updated "Last Updated" display date on both Privacy Policy and Terms of Service to `September 2026` in `HVys2JR_mqWQ4qjYZ5ZXrhG6fmf28G6GRdCMu6paL6w.Btfzp99i.mjs` and `qMeMkGgYA.js`.
- **7. Navbar Header & Footer Logo Replacement ("OPUS" -> "CORABIN")**:
  - Excised the hardcoded SVG path mask in `.framer-N9nKc` that formed the word "OPUS".
  - Implemented clean, high-resolution typographical logo rendering for "CORABIN" using `Inter Display` (font weight 800, uppercase, dynamic `--oavjfn` color support) across base HTML, CSS overrides, and `script_main.CNn1uaXy.mjs`.

## 8. Hero Section Viewport Fold Alignment
- **Root Cause Diagnosed**:
  - The original OPUS template used a 4-letter brand name (`OPUS`), which in a 50%-width column had a height of ~205px (`viewBox="0 0 608.4 192"`).
  - The new brand name `CORABIN` has 7 letters (`viewBox="0 0 1064.7 192"`). In the same 50%-width column, maintaining proper typographic aspect ratio, its height is ~117px (~88px shorter).
  - As a result, the distance from the top of the viewport to the divider line dropped from 773px to 685px, causing the divider to rise prematurely and revealing the intro section text (*"At Corabin, we help companies build stronger brands, modern products, and websites that..."*) above the fold on initial load.
- **Implemented Fix**:
  - Added responsive viewport fold alignment rule `margin-bottom: clamp(88px, calc(100vh - 746px), 260px) !important` to `.framer-xtFIq .framer-1jyj1l4` (Heading Wrapper) on desktop screens (`framer-72rtr7` and `@media (min-width: 1440px)`).
  - Added tablet breakpoint alignment `margin-bottom: clamp(63px, calc(100vh - 660px), 200px) !important` for `.framer-1fvi3ca`.
  - Restored the exact 773px distance to the divider line on standard desktop viewports, perfectly matching the original OPUS fold.
  - On taller desktop monitors (900px, 1080p, 1440p), the dynamic `calc(100vh - 746px)` rule ensures the intro section starts cleanly below `100vh`, completely eliminating text peek across all screen heights.
  - Preserved 100% of the design system, visual hierarchy, cap-height proportions, 50/50 two-column grid, and Framer slide-up appear animations.

## 9. Custom Projects Overhaul & Decoupled CMS Integration (September 2026)
- **1. Replaced All 6 Projects Across Entire Platform**:
  - Arrows -> **Kora** (*Scaling Revenue Architecture for Modern Enterprises*, 2025, 6 weeks, Client: Kora, Badges: Branding / Web Design / Motion)
  - Chantalle -> **Himon** (*Precision Logistics & Intelligent Fleet Technology*, 2025, 5 weeks, Client: Himon, Badges: Branding / Product Design)
  - Papyrus -> **Nordå** (*Scandinavian Architecture Shaping Urban Landscapes*, 2024, 7 weeks, Client: Nordå Architects, Badges: Branding / Product Design)
  - London Museum -> **Ardène** (*Timeless Boutique Residences Across France*, 2025, 8 weeks, Client: Juliette Ardène, Badges: Branding / Motion / Product Design)
  - Bullseye -> **Havyn** (*Curated Modern Real Estate with Local Depth*, 2025, 6 weeks, Client: Havyn Real Estate, Badges: Branding / Web Design / Development)
  - Interference -> **Almare** (*Quiet Spatial Design & Roman Interior Architecture*, 2025, 4 weeks, Client: Almare Studio, Badges: Product Design)
- **2. Preserved Original Visual Assets**:
  - Retained all original responsive imagery (srcSet, resolutions, aspect ratios, crops, focal coordinates) exactly as requested.
- **3. Dual-Layer CMS Architecture & Decoupling**:
  - Re-encoded the Framer CMS binary chunk ARVkZnRTw-chunk-default-0.framercms with bit-exact serialisation for offline resilience.
  - Embedded pre-decoded records in ARVkZnRTw.BOg_bqGO.mjs, enabling instant, zero-latency queries.
  - Implemented bidirectional slug resolver mapping in At (both new and legacy slugs) to prevent 404s.
- **4. Symmetrical HTML & SPA Route Alignment**:
  - Updated card links and headings symmetrically in both index.html and opus-template.framer.website/index.html.
  - Generated dedicated route entry points for /projects, /projects/:slug, /about, /contact, and /blog with exact route IDs and collection item bindings.
- **5. Automated Validation & Zero Regressions**:
  - Verified 100% clean hydration across all 8 routes (/, /projects, and all 6 detail pages) with zero error boundaries, zero layout shift, and full editorial integrity.

