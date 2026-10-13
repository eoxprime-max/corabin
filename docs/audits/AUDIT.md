# Phase 1: Audit and Understanding

## 1. Page Map
- **`/` (Home)**
- **`/about` (About Us)**
- **`/contact` (Contact)**
- **`/blog` (Blog List)**
- **`/projects` (Projects List)**
- **`/blog/:slug` (Blog Article Detail - CMS)**
- **`/projects/:slug` (Project Detail - CMS)**
- **`/:slug` (Generic page - includes Privacy Policy, Terms of Service)**
- **`/404` (Error Page)**

## 2. Section Inventory (Home Page)
- **Hero & Navigation**: Sticky header, large heading "STUDIO OPUS"
- **Value Proposition**: Intro text, "OUR VISION" tag
- **Metrics**: 47+ Projects, 95% retention, $21M revenue. Client logo marquee.
- **Services**: Animated cards / layout for Website Design, Product Design, Branding, Motion Graphics, Development.
- **Process**: "OUR PROCESS", Strategy & Research -> Launch & Support.
- **Recent Projects**: "OUR WORK", project cards with images.
- **Mid-Page CTA**: "Want to build something better?"
- **Studio Strengths**: Stat counters (19 individuals, 134+ projects), overlay watermark.
- **Pricing**: "PLANS", 3-tier subscription cards.
- **Testimonials**: Text reviews.
- **FAQ**: Accordion-style common Qs.
- **Blog**: Recent articles list.
- **Footer**: Brand statement, links.

## 3. Where Content Lives
- **Main HTML (SSR State)**: `opus-template.framer.website/index.html` (Static snapshot of content)
- **JavaScript Modules**: 
  - `framerusercontent.com/sites/46CYIm3dbxFoU3f63shpCX/znfm_uW3YvFdDZ28MEdBO9z2HrI7OaPyUiz_zX9GYnw.DsWxHuen.mjs` (Home Page & About Us textual content)
  - `framerusercontent.com/sites/46CYIm3dbxFoU3f63shpCX/cDUh2JYGT-2.BDCxe8nq.mjs` (Privacy Policy & Terms textual content)
- **CMS Data**: Found within chunks for `/blog/:slug` and `/projects/:slug`.

## 4. Design System Extraction
- **Colors**:
  - Primary Background: `#f3f3f1` (Off-white)
  - Text Primary: `#0c120c` (Dark Gray/Black)
  - Text Secondary: `rgba(12, 18, 12, 0.6)`
  - White: `#fff`
  - Accent: `rgb(0, 72, 249)` (Bright Blue)
  - Borders/Shadows: `rgba(0, 0, 0, 0.1)`, `rgb(34, 34, 34)`
- **Typography**: 
  - `Inter` and `Inter Display` (400, 500, 600, 700) for UI and body text.
  - `Onest` (400, 500, 600) for specific headings/accents.
  - `Fragment Mono` (400) for technical labels.
- **Breakpoints**: Desktop (`btKzulGQj`, 1440px), Tablet (`qrOLsGssp`, 700px - 1439px), Mobile (`CtCLCD9yi`, max 699px).

## 5. Interactions and Motion
- Heavy reliance on Framer's `motion` (Framer Motion) library.
- Scroll-triggered opacity and translate reveals.
- Text reveal by word/letter (Windaro component).
- Marquees for client logos.

## 6. Assets
- Mostly served from `framerusercontent.com/images/` and `video.gumlet.io`.
- To replace an image without breaking layout, aspect ratios and `object-fit: cover` properties must be maintained.

## 7. Dependencies
- React (`react.BkOV1Kk9.mjs`)
- Framer Runtime (`framer.29Vzp7jn.mjs`)
- Framer Motion (`motion.BsQXccXO.mjs`)
- Lenis (Smooth scrolling)
- Fonts loaded from Google Fonts (`fonts.gstatic.com`).

## 8. Template-Owner Leftovers
- "Opus" and "OPUS" scattered heavily across `index.html` and JS chunks.
- Emails: `contact@opushq.com`
- Phone: `(555) 123-4567`
- Domain: `opus-template.framer.website`

## 9. Responsive Behavior
- Layouts switch from horizontal flex/grids to vertical stacks at the `qrOLsGssp` (Tablet) and `CtCLCD9yi` (Mobile) breakpoints.
- Font sizes scale down, padding is reduced.

## 10. Risks
- **Hydration Mismatch**: Modifying only the static `index.html` will cause React to overwrite the DOM with original data from the `.mjs` chunks upon hydration. Thus, content MUST be replaced symmetrically across both the SSR HTML and the `.mjs` module files.
