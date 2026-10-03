# Corabin Website — Production Readiness & Security Audit

**Audit date:** 2026-10-03  
**Project:** Corabin website  
**Source archive:** `Corabin.website.zip`  
**Deployment target detected:** Vercel static deployment (`vercel.json` → `public/`)  
**Architecture:** Static Framer-export-style site with custom JavaScript modules and a prebuilt `public/` deployment tree

---

## 0. Executive Verdict

### ❌ Current status: **NOT PRODUCTION-READY**

The project is substantially customized and has several good production-oriented foundations, but it should **not be approved for public launch in its current state**.

The main blockers are not a lack of effort or missing basic SEO files; they are **deployment integrity, form configuration, route rendering/content correctness, security-header enforcement, asset provenance, and maintenance reliability**.

### Release decision

- **Production-ready today:** ❌ No
- **Safe to deploy exactly as provided:** ❌ No
- **Major rework required:** ❌ No
- **Focused production hardening required:** ✅ Yes
- **Main risk level:** **High until the P0/P1 items below are closed**

---

# 1. 🌟 What Is Already Good

## 1.1 Project and deployment structure

- [x] A dedicated Vercel configuration exists in `vercel.json`.
- [x] `vercel.json` explicitly uses `public` as the output/deployment directory.
- [x] `cleanUrls` is enabled.
- [x] `trailingSlash` is disabled for the intended clean URL structure.
- [x] Legacy project URLs have 301 redirects configured.
- [x] A dedicated `404.html` exists.
- [x] `robots.txt` exists.
- [x] `sitemap.xml` exists.
- [x] Security/caching headers have been defined.
- [x] Deployment-only files are separated from internal audit/tooling files through the `public/` directory.

## 1.2 Code integrity

- [x] The public JavaScript/MJS files passed Node syntax validation: **167 files checked, 0 syntax errors**.
- [x] The Python utility scripts passed compilation checks: **21 files checked, 0 syntax errors**.
- [x] No obvious broken local HTML/resource references were found by the static link/resource scan.
- [x] The repository contains dedicated verification tooling rather than relying entirely on manual checking.
- [x] The existing `tools/verify_production_readiness.py` reported **41 passed / 0 errors** under its own checks.

> Important: these checks prove static/code consistency only. They do **not** prove that the production site works correctly in a real browser, under Vercel edge behavior, or under real user interaction.

## 1.3 SEO foundations

- [x] Canonical URLs are present on indexable pages.
- [x] Meta descriptions are present.
- [x] Open Graph/Twitter metadata is present.
- [x] A `lang` attribute is present.
- [x] JSON-LD is present and parseable on the audited HTML pages.
- [x] Blog structured data includes publication/modification dates.
- [x] `sitemap.xml` contains **23 canonical URLs**.
- [x] Sitemap URLs map to real site files.
- [x] Legacy project URLs are intended to redirect to current project URLs.
- [x] Legacy redirect stubs are marked noindex/follow.
- [x] `robots.txt` references the sitemap.

## 1.4 Security foundations

- [x] `X-Content-Type-Options: nosniff` is configured.
- [x] `X-Frame-Options: DENY` is configured.
- [x] `frame-ancestors 'none'` is included in the CSP policy.
- [x] `Referrer-Policy` is configured.
- [x] `Permissions-Policy` is configured.
- [x] HSTS is configured.
- [x] `object-src 'none'` appears in the Vercel CSP configuration.
- [x] `base-uri 'self'` is configured.
- [x] A static repository scan found **0 obvious matches** for common private-key/API-token/password secret patterns.
- [x] No current Git remote is configured, reducing the chance of accidentally publishing this exact working tree to a configured remote without review.

> The secret scan is pattern-based. It is not proof that the project contains no secrets.

## 1.5 Accessibility foundations

- [x] Required contact form fields have labels/accessible names in the custom form module.
- [x] Email is required in the contact form.
- [x] Many image elements have alt attributes; the scan found **0 missing-alt attributes** in the inspected HTML, although many were intentionally empty.
- [x] `prefers-reduced-motion` support exists in the stylesheet/codebase.
- [x] The project has already undergone at least one accessibility-oriented pass, based on repository history and tooling.

## 1.6 Brand/content customization

- [x] Corabin branding is present throughout the customized route set.
- [x] Custom project and blog content has been added.
- [x] Founder imagery has been added.
- [x] Custom legal pages exist.
- [x] Legacy template route handling has been addressed rather than simply deleting old URLs.

---

# 2. 🚨 What Is Missing / What Is Currently Blocking Launch

## P0 — Release blockers

### 2.1 Contact form is not production-configured

- [ ] Replace the literal placeholder endpoint in the **actual Vercel deploy tree**:

`public/framerusercontent.com/sites/46CYIm3dbxFoU3f63shpCX/https/framerusercontent.com/modules/VM6LshqF3kGfk3qxJUTi/2SWjHeF37NxXG6KxhVeu/TQtrT4cVD.js`

Current deployed-copy endpoint:

```text
https://YOUR-N8N-WEBHOOK-URL/webhook/contact-form
```

- [ ] Set the real production endpoint.
- [ ] Decide whether the form should submit to n8n directly, to a server-side relay, or to another form processor.
- [ ] Test successful submission.
- [ ] Test failed submission.
- [ ] Test timeout/offline behavior.
- [ ] Add spam/abuse protection.
- [ ] Confirm the receiving workflow cannot be abused to send arbitrary email or execute unintended automation.
- [ ] Ensure the endpoint accepts only expected fields and validates them server-side.
- [ ] Add rate limiting or equivalent abuse controls.
- [ ] Ensure the privacy policy identifies the real processor and data flow.

### 2.2 Root source and `public/` deployment copy have already diverged

This is one of the most important structural problems in the project.

The root/source version of the contact module still points to the original Framer form endpoint:

```text
https://api.framer.com/forms/v1/forms/fbe3507b-9997-4e3f-91ff-9e4321e5b4d4/submit
```

The deployment copy in `public/` points to the placeholder n8n endpoint.

This proves that the source tree and deployment tree are **not automatically synchronized**.

- [ ] Define one authoritative source.
- [ ] Create a deterministic build/copy/export step.
- [ ] Make the deployment tree generated rather than manually edited.
- [ ] Add a CI check that fails when root and deploy output disagree where they are expected to match.
- [ ] Stop making ad-hoc production fixes directly inside `public/` unless `public/` itself is declared the canonical source.

### 2.3 Indexable pages are not carrying their own route-specific body content in static HTML

A normalization check found **20 indexable non-home routes with effectively identical body text** in the generated `public/*.html` shell.

The route-specific data is heavily dependent on the Framer runtime/modules being executed and hydrated in the browser.

Examples include:

- `/about`
- `/contact`
- `/projects`
- individual project pages
- `/blog`
- individual blog posts

This creates a strong dependency on client-side rendering for the real page content.

- [ ] Ensure each indexable route has meaningful route-specific content in the initial HTML/SSR/SSG output.
- [ ] Verify that the exact content expected for `/about`, `/contact`, `/blog/...`, `/projects/...` is available without relying exclusively on hydration.
- [ ] Test the rendered DOM with JavaScript disabled.
- [ ] Test Google-friendly rendered HTML after deployment.
- [ ] Validate that Open Graph previews and link unfurlers receive the correct page metadata/content.

### 2.4 Template asset/licensing provenance is not resolved in the repository

Git history shows this project originated from an Opus/Framer template import, and several image assets remain unchanged from the initial import.

The project therefore needs an explicit answer to:

- Are all remaining template images licensed for redistribution?
- Are all fonts licensed for self-hosting?
- Are all Framer runtime assets legally redistributable in this deployment context?
- Are all third-party assets properly attributed where required?

- [ ] Verify the template license.
- [ ] Verify image licenses.
- [ ] Verify font licenses.
- [ ] Verify third-party package/runtime licenses.
- [ ] Remove any asset for which ownership/licensing cannot be established.
- [ ] Create a third-party notices/license file where required.

---

# 3. 🔐 Security Findings

## 3.1 CSP is not enforced on Vercel

`vercel.json` uses:

```text
Content-Security-Policy-Report-Only
```

This means the policy is reporting violations rather than actively blocking them.

Additionally, the current policy contains:

```text
'unsafe-inline'
'unsafe-eval'
```

These materially weaken CSP protection.

- [ ] Move from Report-Only to enforced `Content-Security-Policy` after the policy is validated.
- [ ] Remove `'unsafe-eval'` if the runtime permits it.
- [ ] Reduce or eliminate `'unsafe-inline'` where practical.
- [ ] Use nonces/hashes for unavoidable inline scripts where feasible.
- [ ] Restrict `connect-src`, `img-src`, `font-src`, and `media-src` to only required vendors.
- [ ] Add the real form endpoint only after it is selected.
- [ ] Test the final policy in production with browser console/CSP reports.

## 3.2 Two different CSP/header configurations exist

There is a root `_headers` file and a separate `public/_headers` file, while Vercel is configured through `vercel.json`.

The two header files are not equivalent, and one still contains the n8n placeholder.

- [ ] Keep one authoritative deployment-header configuration per deployment platform.
- [ ] Generate platform-specific files from one source if multi-platform deployment is required.
- [ ] Remove stale/contradictory header definitions.
- [ ] Verify actual HTTP response headers from the live domain rather than trusting config files alone.

## 3.3 HSTS needs deployment validation

The configuration uses:

```text
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

The root `_headers` also adds `preload`.

- [ ] Confirm every production subdomain is HTTPS-ready before using `includeSubDomains`.
- [ ] Confirm the domain is intended for HSTS preload before submitting it to any preload list.
- [ ] Verify HTTP → HTTPS behavior on the live host.

## 3.4 Git repository is included in the source archive

The archive contains a `.git` directory of approximately **75 MB**.

It is not inside the configured `public/` deploy directory, so Vercel should not publish it when `outputDirectory` is respected.

However:

- [ ] Never deploy the repository root as the public web root.
- [ ] Never publish `.git` accidentally through another hosting platform.
- [ ] Keep `.git` excluded from packaged deploy artifacts.
- [ ] Consider repository cleanup/GC because the archive contains many Git objects and increases distribution size.

## 3.5 Stale Framer editor/runtime artifact is present under `public/`

The deploy tree contains:

```text
public/framerusercontent.com/sites/.../framertoplevel/main.html
```

This file references Framer editor initialization and pageview/tracking behavior, including an editor module such as:

```text
https://framer.com/edit/init.mjs
```

- [ ] Determine whether this file is actually required by the public site.
- [ ] Remove it from deployment if it is an editor/debug artifact.
- [ ] Remove any other unused Framer editor/debug artifacts from `public/`.
- [ ] Re-run the deployment scan after cleanup.

## 3.6 No obvious hard-coded secrets were found, but dependency exposure remains

A pattern-based scan did not find obvious private keys, AWS keys, Google API keys, GitHub tokens, Slack tokens, or generic password assignments.

That is positive, but the site still contains many external runtime/resource dependencies.

- [ ] Review every external origin.
- [ ] Remove unnecessary vendor dependencies.
- [ ] Self-host assets where practical.
- [ ] Use SRI for externally loaded scripts where applicable.
- [ ] Confirm that no tracking/analytics vendor exists without being reflected in the privacy documentation.

---

# 4. 🧱 Code Quality / Architecture Findings

## 4.1 No normal application build manifest exists

The repository contains no:

```text
package.json
package-lock.json
pnpm-lock.yaml
yarn.lock
bun.lockb
```

This is not automatically wrong for a static export, but it means:

- [ ] There is no standard package-managed build pipeline.
- [ ] There is no normal `npm audit`/lockfile-based dependency lifecycle.
- [ ] Runtime updates are harder to reproduce.
- [ ] Generated Framer runtime code is difficult to maintain manually.
- [ ] CI cannot easily reproduce a deterministic application build.

For a frozen static site this can be acceptable, but the project needs a documented maintenance strategy.

## 4.2 Compiled/vendored runtime code is difficult to maintain

Most of the application is generated/bundled Framer runtime code rather than a clean, human-maintainable source application.

- [ ] Document which files are generated.
- [ ] Document which files are human-authored.
- [ ] Do not patch generated runtime bundles manually unless absolutely necessary.
- [ ] Prefer regenerating the export from an authoritative source.
- [ ] Add a reproducible build/export step.
- [ ] Keep customization code separate from generated vendor code where possible.

## 4.3 Duplicated source/deploy trees create synchronization risk

The scan found **374 common relative paths** between the root tree and `public/`, with **325 identical files**.

That leaves files that are duplicated but no longer identical.

- [ ] Reduce duplication.
- [ ] Generate `public/` from source.
- [ ] Do not allow manually edited duplicates to become separate sources of truth.

## 4.4 Existing verification tooling has blind spots

`tools/verify_production_readiness.py` is useful, but it does not represent a full browser/deployment test.

Notable limitations identified in the current verifier:

- It starts a simple HTTP server instead of testing Vercel behavior.
- It does not truly validate the real 404 behavior for a nonexistent route.
- It checks contact accessibility/configuration fields but does not validate that the configured endpoint is usable.
- It does not validate browser hydration or interactive behavior.
- It reports success even though a separate check script only warns about the n8n placeholder.

- [ ] Update the verifier to serve/test `public/` rather than the repository root.
- [ ] Add actual HTTP 404 assertions for unknown paths.
- [ ] Fail on placeholder URLs.
- [ ] Add browser-based smoke tests.
- [ ] Add external-link checks.
- [ ] Add form submission tests with a test endpoint.

---

# 5. 🔎 Bugs / Potential Errors / Functional Risks

## 5.1 Contact form endpoint placeholder — confirmed

**Severity:** P0 / Blocker

This is a confirmed configuration error in the deployment copy.

- [ ] Replace `YOUR-N8N-WEBHOOK-URL`.
- [ ] Confirm form submission in production.
- [ ] Confirm n8n receives the expected payload.
- [ ] Confirm failure states are visible to the visitor.
- [ ] Confirm duplicate/replay/spam submissions are controlled.

## 5.2 Root and deploy form implementations disagree — confirmed

**Severity:** P0 / Blocker

The root copy still contains the old Framer form endpoint while the `public/` copy contains the n8n placeholder.

**Impact:** A future edit to the source can silently fail to reach production, or production can contain changes that are not represented in the source.

- [ ] Establish a canonical source/build process immediately.

## 5.3 404 robots metadata is contradictory — confirmed

`public/404.html` contains both:

```html
<meta name="robots" content="noindex, nofollow">
```

and later:

```html
<meta name="robots" content="index, follow, ...">
```

It also has a canonical URL pointing to:

```text
https://corabin.com/404
```

- [ ] Keep the 404 page unambiguously `noindex, nofollow`.
- [ ] Remove conflicting robots metadata.
- [ ] Decide whether `/404` should have a canonical at all; normally there is no SEO reason to canonicalize a generic error page as a normal indexable page.
- [ ] Ensure an actually missing URL returns HTTP `404`.

## 5.4 404 social metadata is inconsistent

The 404 page title is:

```text
404 — Page Not Found | Corabin
```

but its Twitter title still uses the homepage title.

- [ ] Align 404 Open Graph/Twitter metadata with the 404 context.
- [ ] Confirm generic social previews are acceptable for error pages.

## 5.5 Static counters expose non-final values

The static HTML contains initial counter values such as `0`, while other site content contains different project/metric values.

Observed examples include static values such as:

- `0 Projects delivered`
- `0% On-time delivery`
- `$0M Client revenue impacted`
- other lower-page figures such as `134 Projects delivered` and `19 Direct collaboration`

This is risky because the initial HTML can expose stale or incomplete values before client-side animation updates them.

- [ ] Put truthful final values in the initial HTML.
- [ ] Animate from the truthful value rather than from a misleading published value.
- [ ] Remove stale template-era metrics.
- [ ] Confirm all business claims are factually supportable.

---

# 6. 🚀 Performance Findings

## 6.1 Deployment payload is larger than necessary

Approximate audited sizes:

| Area | Size |
|---|---:|
| `public/` | ~83 MB |
| `public/assets/` | ~29 MB |
| `public/framerusercontent.com/` | ~25 MB |
| `public/video.gumlet.io/` | ~2.1 MB |
| `.git/` | ~75 MB |

The deploy tree contains **385 files**.

The large total is not automatically a page-speed failure because only a subset loads per page, but it indicates substantial asset and runtime weight.

## 6.2 Large image files exist

Examples include roughly:

- `tH0TkQuNIAPV18APpKlpNbDgBRE.jpg` — ~2.7 MB
- `blog8.png` — ~2.7 MB
- `blog1.png` — ~2.1 MB
- several other PNG/JPG files above ~1 MB

- [ ] Compress large images.
- [ ] Prefer WebP/AVIF where browser support and visual quality are suitable.
- [ ] Ensure correct intrinsic dimensions.
- [ ] Ensure responsive `srcset`/size selection.
- [ ] Avoid loading desktop-only assets on mobile.
- [ ] Avoid loading below-the-fold imagery eagerly.

## 6.3 High-resolution PNG variants remain in the tree

The asset inventory contains numerous PNG/WebP pairs, including cases where the WebP version is dramatically smaller.

- [ ] Identify assets that are never referenced.
- [ ] Remove unused originals from deployment.
- [ ] Use a single optimized source per visual where possible.
- [ ] Keep original production masters outside the web root.

## 6.4 External Framer imagery remains in the rendered HTML

The static HTML references Framer-hosted resources such as:

```text
https://framerusercontent.com/...
```

This creates:

- vendor availability dependency
- external network latency
- cache/vendor-control dependency
- potential licensing/provenance concerns
- additional CSP complexity

- [ ] Replace unnecessary remote template images with owned/local/CDN-controlled assets.
- [ ] Decide intentionally which Framer-hosted resources are still required.

## 6.5 External video dependency remains

The public HTML references a Gumlet video origin:

```text
https://video.gumlet.io/...
```

A local video copy is also present in the project.

- [ ] Decide whether the local or CDN version is the canonical production source.
- [ ] Avoid duplicate storage/traffic if one copy is unnecessary.
- [ ] Use an intentional CDN strategy.
- [ ] Verify mobile/autoplay/muted/poster behavior.
- [ ] Ensure the video is not delaying LCP.

## 6.6 External library dependency remains

The project contains references to external services such as `unpkg.com` and Google/Framer-hosted font assets.

- [ ] Self-host critical dependencies where reasonable.
- [ ] Add SRI for any external scripts that remain.
- [ ] Review version pinning.
- [ ] Remove unused local copies or remove unused external references so only one source remains.

## 6.7 HTML pages are unusually large

Normal route HTML files are approximately **1.3 MB each** in the deployed tree.

This is a significant amount of HTML for a studio/marketing site and is a clear optimization opportunity.

- [ ] Reduce duplicated HTML/runtime payload.
- [ ] Avoid embedding every breakpoint/page variant in every route where possible.
- [ ] Move large generated data out of the initial document when appropriate.
- [ ] Use proper static generation with route-specific documents.

---

# 7. ♿ Accessibility Findings

## 7.1 Missing/weak semantic landmarks

Normal pages do not consistently expose a clean `<main>` landmark in the static HTML shell.

- [ ] Add one clear `<main id="main-content">` landmark per page.
- [ ] Use one logical `<header>`, `<nav>`, `<main>`, and `<footer>` structure.
- [ ] Avoid relying on repeated desktop/tablet/mobile DOM copies to provide semantics.

## 7.2 Empty links need review

The static homepage contains many empty `<a>` elements. Examples include logo/menu wrappers where the visible label may be injected by layout/runtime behavior.

- [ ] Ensure every interactive link has an accessible name.
- [ ] Add `aria-label` where an icon/logo-only control is intended.
- [ ] Confirm keyboard users can identify every navigation control.
- [ ] Confirm no hidden breakpoint clone remains in the accessibility tree.

## 7.3 Repeated responsive DOM should be checked with a real screen reader

The HTML contains multiple desktop/tablet/mobile variants of navigation/header/footer.

- [ ] Confirm only the intended variant is exposed to assistive technology.
- [ ] Use `aria-hidden` or, preferably, a DOM strategy that avoids duplicate controls where appropriate.
- [ ] Test keyboard order at desktop/tablet/mobile widths.

## 7.4 Skip navigation is missing

No clear skip-to-content link was identified in the static HTML.

- [ ] Add a keyboard-accessible “Skip to main content” link.

## 7.5 Heading hierarchy requires rendered-page verification

The static HTML contains multiple `h1` elements because responsive variants are duplicated in the source.

- [ ] Ensure exactly one meaningful visible H1 per page.
- [ ] Make sure hidden breakpoint variants are not exposed to assistive technology.
- [ ] Verify logical H2/H3 hierarchy.

## 7.6 Interactive components need browser-level testing

The repository includes custom interactive components such as accordions and navigation.

- [ ] Verify `aria-expanded` and `aria-controls` relationships.
- [ ] Verify focus management.
- [ ] Verify Escape/Enter/Space behavior where appropriate.
- [ ] Verify keyboard access to mobile navigation.
- [ ] Verify visible focus indicators.
- [ ] Verify reduced-motion behavior.

## 7.7 Visual accessibility

- [ ] Run automated WCAG tooling such as axe against rendered pages.
- [ ] Check color contrast on all typography states.
- [ ] Check focus indicators on dark/light backgrounds.
- [ ] Check text scaling to 200%.
- [ ] Check browser zoom at 400%.
- [ ] Check touch targets on mobile.

---

# 8. 🔎 SEO Findings

## 8.1 Good SEO coverage

- [x] 23 sitemap URLs are present.
- [x] Indexable pages have titles, descriptions and canonical URLs.
- [x] JSON-LD is present.
- [x] Blog article dates are represented in structured data.
- [x] Legacy URLs have migration handling.

## 8.2 Title length cleanup needed

**16 indexable pages** have titles longer than approximately 60 characters.

Examples:

- Blog articles with titles in the 70–88 character range.
- Project pages such as Almare, Himon, Kora and Nordå.

This is not a hard Google indexing blocker, but long titles can be truncated and can reduce clarity in SERPs.

- [ ] Rewrite long titles to preserve the important search/entity terms first.
- [ ] Keep brand suffixes only where they add value.

## 8.3 Meta description cleanup needed

**13 indexable pages** have descriptions longer than approximately 160 characters.

- [ ] Trim descriptions to concise, accurate search snippets.
- [ ] Keep the main topic and differentiator early in the description.

## 8.4 Blog URL/title mismatch

The route:

```text
/blog/choosing-the-right-tech-stack-a-decision-framework-for-2025
```

currently has a title referring to **2026**.

- [ ] Decide whether the URL is intentionally historical.
- [ ] If the content/slug was materially renamed, create a clean migration plan and 301 redirect.
- [ ] Keep page title, H1, slug, publication date and content intent consistent.

## 8.5 Sitemap/article modification dates should reflect reality

Several blog pages have structured-data `dateModified` values around `2026-10-01`, while the sitemap retains older article dates.

That can be valid, but only if the content was actually materially reviewed/updated.

- [ ] Do not fabricate `dateModified` values.
- [ ] Align sitemap `lastmod` with real content changes.
- [ ] Keep publication date and modification date semantically distinct.

## 8.6 404 must be excluded cleanly

- [ ] Make `/404` non-indexable without contradictory metadata.
- [ ] Keep it out of the sitemap.
- [ ] Ensure unknown URLs return a true HTTP 404.

---

# 9. 📄 Legal / Privacy / Trust Findings

## 9.1 Privacy policy appears broader than the currently visible implementation

The privacy page describes processing such as:

- payment information
- newsletters
- cookies
- analytics
- hosting/form/payment/analytics providers

The current inspected frontend does not clearly demonstrate all of those systems as active production features.

- [ ] Create an actual data-processing inventory.
- [ ] Remove claims about systems that are not used.
- [ ] Add the real form processor/n8n flow.
- [ ] Document actual analytics, if any.
- [ ] Document cookie use, if any.
- [ ] Document retention periods.
- [ ] Document lawful basis where applicable.
- [ ] Ensure privacy policy contact details are correct.

## 9.2 Terms and Conditions require legal review

The Terms page contains commercial terms such as:

- deposit/payment schedules
- invoice timing
- warranty duration
- termination notice
- liability limitation

- [ ] Confirm governing law/jurisdiction.
- [ ] Confirm cancellation/refund treatment.
- [ ] Confirm late-payment consequences.
- [ ] Confirm intellectual-property ownership/transfer terms.
- [ ] Confirm acceptance/signature mechanics.
- [ ] Confirm the terms match real contracts/Proposal/MSA/SOW documents.
- [ ] Have a qualified legal professional review the final version for the target jurisdiction.

## 9.3 Contact information must be verified

- [ ] Verify `hello@corabin.com` is operational.
- [ ] Verify the displayed business/contact information is current.
- [ ] Verify email deliverability.
- [ ] Configure SPF, DKIM and DMARC for the sending domain as appropriate.

---

# 10. 🧩 Missing Files / Configurations / Operational Features

## 10.1 Missing standard dependency/build metadata

- [ ] `package.json` — create only if the project is moving to a managed build/runtime workflow.
- [ ] Lockfile — create with the chosen package manager.
- [ ] Document exact versions of all manually vendored runtime dependencies.

A package manifest is **not mandatory** for a pure frozen static export, but the current project has too much generated/runtime code to remain undocumented indefinitely.

## 10.2 Missing automated CI/CD quality gates

No standard CI workflow was identified.

- [ ] Add CI for static syntax checks.
- [ ] Add placeholder/secrets scan.
- [ ] Add route/link checks.
- [ ] Add sitemap consistency checks.
- [ ] Add 404 checks.
- [ ] Add form endpoint configuration checks.
- [ ] Add security-header checks.
- [ ] Add Lighthouse or equivalent performance checks.
- [ ] Add axe/accessibility smoke checks.

## 10.3 Existing pre-deploy checker must fail on placeholders

`scripts/check.sh` currently **warns** when `YOUR-N8N-WEBHOOK-URL` remains but does not fail the build.

That is dangerous for a production gate.

- [ ] Convert placeholder detection into a hard failure.
- [ ] Scan all deployable text/code, not only selected file extensions.
- [ ] Fail on any `YOUR-*`, `TODO-*`, fake endpoint, fake phone, fake email, placeholder copy, or unsupported template content.

## 10.4 Monitoring / incident visibility

- [ ] Add uptime monitoring.
- [ ] Add error monitoring for the form endpoint/workflow.
- [ ] Add form-delivery alerting.
- [ ] Add deployment notifications or rollback visibility.
- [ ] Consider privacy-friendly analytics only if there is a real business need and the privacy policy is updated accordingly.

## 10.5 Optional production hardening files

Consider creating:

- [ ] `security.txt` under the well-known path if appropriate.
- [ ] `THIRD_PARTY_NOTICES.md`.
- [ ] A deployment runbook.
- [ ] An asset ownership/license inventory.
- [ ] A content-claim/source inventory for metrics and testimonials.

---

# 11. 📦 Files / Artifacts That Should Not Be Public

The deployment directory correctly excludes most internal files, but the repository itself contains many internal/audit artifacts.

Never serve these from the public web root:

```text
.git/
tools/
docs/
CODEBASE_AUDIT.md
SEO_PRODUCTION_AUDIT.md
README.md
scripts/
```

Also review whether the following generated/editor artifacts belong in production:

```text
public/.../framertoplevel/main.html
```

- [ ] Keep deployment target explicitly set to `public/`.
- [ ] Verify the live host does not expose repository files.
- [ ] Verify directory listing is disabled.
- [ ] Verify unknown sensitive paths return 404 rather than source content.

---

# 12. 🌐 Routing / Redirect / Domain Checks

## Required

- [ ] Confirm `https://corabin.com/` resolves to the intended production deployment.
- [ ] Confirm `https://www.corabin.com/` redirects to the chosen canonical host.
- [ ] Confirm HTTP redirects to HTTPS.
- [ ] Confirm all sitemap URLs return `200`.
- [ ] Confirm legacy project URLs return a single `301` directly to the intended destination.
- [ ] Confirm there are no redirect chains.
- [ ] Confirm `/404` is a real error page if retained as a direct route.
- [ ] Request a random nonexistent route and confirm HTTP `404`.
- [ ] Confirm favicon and OG assets are reachable.

---

# 13. 🧪 Required Browser / Real-World QA

Static analysis cannot prove the following.

## Desktop

- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

## Mobile

- [ ] iPhone Safari
- [ ] Android Chrome
- [ ] Small-width viewport
- [ ] Large-width viewport

## User flows

- [ ] Open home page.
- [ ] Open every portfolio project.
- [ ] Open every blog article.
- [ ] Open About.
- [ ] Open Contact.
- [ ] Open Privacy.
- [ ] Open Terms.
- [ ] Submit contact form successfully.
- [ ] Submit contact form with invalid email.
- [ ] Submit contact form with missing required fields.
- [ ] Submit form while network request fails.
- [ ] Use mobile menu with keyboard/screen reader.
- [ ] Operate accordions with keyboard.
- [ ] Operate every CTA.
- [ ] Test all external social links.
- [ ] Test video playback/autoplay/poster behavior.
- [ ] Test reduced-motion mode.

---

# 14. 📊 Performance QA Before Launch

Run against the deployed URL, not just source files.

- [ ] Lighthouse Performance.
- [ ] Lighthouse Accessibility.
- [ ] Lighthouse Best Practices.
- [ ] Lighthouse SEO.
- [ ] WebPageTest or equivalent waterfall analysis.
- [ ] Core Web Vitals on representative mobile/desktop pages.
- [ ] Check LCP element.
- [ ] Check INP on menu/form/accordion interactions.
- [ ] Check CLS from images, fonts, video and dynamic layout.
- [ ] Confirm images are appropriately lazy-loaded.
- [ ] Confirm hero imagery/video are prioritized correctly.
- [ ] Confirm unused assets are not loaded.

### Minimum pages to test

- `/`
- `/about`
- `/contact`
- `/projects`
- one project detail page
- `/blog`
- one blog article
- `/privacy`
- `/terms`
- a nonexistent URL

---

# 15. 🔐 Final Security QA Checklist

- [ ] No API keys/secrets in public files.
- [ ] No `.env` files in deploy output.
- [ ] No `.git` in deploy output.
- [ ] No internal audit/tooling files in deploy output.
- [ ] No editor/debug artifacts in deploy output.
- [ ] Contact endpoint is real and production-ready.
- [ ] Form endpoint validates input server-side.
- [ ] Form endpoint has rate limiting/spam protection.
- [ ] CSP is enforced, not only Report-Only.
- [ ] No unnecessary `unsafe-eval`.
- [ ] Inline-script allowances are minimized.
- [ ] Actual external origins are intentionally allowlisted.
- [ ] Security headers are verified from the live response.
- [ ] HTTPS is enforced.
- [ ] HSTS settings are appropriate.
- [ ] Clickjacking protection is present.
- [ ] Referrer policy is correct.
- [ ] Permissions policy is correct.
- [ ] Third-party assets are licensed.
- [ ] Third-party scripts use integrity/version controls where applicable.

---

# 16. 🧹 Recommended Fix / Creation Order

## Phase 1 — Must fix before any public launch

1. [ ] Replace the n8n form placeholder in `public/`.
2. [ ] Make root/source and `public/` deterministic and synchronized.
3. [ ] Ensure route-specific content is present in initial HTML/SSG output.
4. [ ] Remove/resolve stale Framer editor artifacts in the deploy directory.
5. [ ] Resolve template asset ownership/licensing.
6. [ ] Fix the contradictory 404 robots metadata.
7. [ ] Make the pre-deploy checker fail on placeholders.
8. [ ] Verify actual Vercel responses and routing.

## Phase 2 — Security and quality hardening

9. [ ] Enforce CSP.
10. [ ] Remove unnecessary `unsafe-eval`/inline allowances.
11. [ ] Reconcile `_headers`, `public/_headers`, and `vercel.json`.
12. [ ] Verify HSTS/subdomain assumptions.
13. [ ] Add CI checks.
14. [ ] Add real browser accessibility tests.
15. [ ] Add real form/error-flow tests.

## Phase 3 — Performance and SEO refinement

16. [ ] Optimize large images.
17. [ ] Remove unused duplicate assets.
18. [ ] Reduce HTML/runtime payload.
19. [ ] Reduce unnecessary external dependencies.
20. [ ] Clean long titles/descriptions.
21. [ ] Reconcile blog slug/title/date metadata.
22. [ ] Align `sitemap.xml` lastmod values with actual updates.

## Phase 4 — Operational polish

23. [ ] Verify email deliverability.
24. [ ] Verify social accounts/links.
25. [ ] Finalize legal/privacy accuracy.
26. [ ] Add monitoring/alerts.
27. [ ] Produce an asset/license inventory.
28. [ ] Create a deployment/rollback runbook.

---

# 17. ✅ Final Pre-Publish Gate

Do **not** publish until every item below is checked.

- [ ] Real contact form endpoint configured.
- [ ] Contact form successfully tested from the live domain.
- [ ] Spam/rate limiting verified.
- [ ] Source/deployment synchronization solved.
- [ ] No placeholders remain anywhere in `public/`.
- [ ] No Framer template/editor artifacts remain unless intentionally required.
- [ ] All template/third-party assets are licensed or replaced.
- [ ] Every canonical route renders correct route-specific content.
- [ ] Every sitemap URL returns `200`.
- [ ] Nonexistent URLs return `404`.
- [ ] 404 has no contradictory robots directives.
- [ ] `www`/apex canonical behavior is correct.
- [ ] HTTPS is enforced.
- [ ] Security headers verified from live HTTP responses.
- [ ] CSP enforced and clean.
- [ ] No accidental secrets in deploy output.
- [ ] Accessibility passes manual keyboard testing.
- [ ] Accessibility passes automated axe/Lighthouse review.
- [ ] Mobile menu works.
- [ ] Accordion/interactions work.
- [ ] All CTAs work.
- [ ] All social links work.
- [ ] Video works and does not damage Core Web Vitals.
- [ ] Contact/privacy/terms content matches the actual data flow.
- [ ] Performance budgets pass.
- [ ] Final content claims/metrics are accurate and supportable.
- [ ] Production rollback procedure is known.

---

# 18. Audit Evidence Summary

| Check | Result |
|---|---|
| Public deploy tree | Present (`public/`) |
| Vercel config | Present |
| Package/build manifest | Not present |
| Public HTML files | 31 |
| JavaScript/MJS syntax | 167 checked, 0 errors |
| Python utility syntax | 21 checked, 0 errors |
| Canonical sitemap URLs | 23 |
| Static verifier | 41 passed, 0 errors |
| Obvious local resource breakage | None found in static scan |
| Common secret-pattern scan | 0 obvious matches |
| Placeholder URL | **Found** |
| 404 robots conflict | **Found** |
| Indexable route body duplication | **Found: 20 routes** |
| Long titles | **16 indexable pages** |
| Long descriptions | **13 indexable pages** |
| `public/` size | ~83 MB |
| `.git/` size in archive | ~75 MB |
| Browser/Lighthouse validation | **Not completed from the archive alone** |

---

# 19. Bottom Line

The project has a solid amount of production preparation already in place: routing, metadata, sitemap, redirects, security headers, custom content, static checks, and a Vercel deployment definition are all present.

However, the project currently behaves like a **heavily customized static Framer export rather than a clean, reproducible production application**. The strongest evidence is the divergence between the root/source tree and `public/`, the placeholder contact endpoint in the actual deployment copy, and the fact that most indexable routes share the same initial HTML body and depend on runtime hydration for their real content.

The correct next step is **not a visual redesign**. It is a focused production hardening pass that makes the deployment deterministic, makes the contact flow real and secure, removes template/editor leftovers, produces correct route-specific HTML, and verifies the live site with browser, accessibility, performance, routing and security checks.

**Final status after this audit: ❌ Do not publish yet.**
