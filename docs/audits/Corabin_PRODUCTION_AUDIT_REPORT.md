# Corabin Website — Production Readiness & Security Audit

**Audit date:** 2026-10-05  
**Archive audited:** `Corabin.website.zip`  
**Deployment target identified:** Vercel static deployment (`vercel.json` → `public/`)  
**Verdict:** **NOT PRODUCTION-READY — DO NOT PUBLISH YET**

---

## 0. Executive Verdict

The project has a solid static-site foundation and several production-minded pieces already in place, but I would **not approve this build for public launch in its current state**.

The biggest problems are not cosmetic. They affect core functionality, deployment integrity, SEO/crawl robustness, security configuration, and release reliability:

1. **The live public contact form still contains a placeholder n8n webhook URL.**
2. **Source files and the `public/` deployment tree are materially out of sync**; 48 shared files differ.
3. **Most route HTML files contain essentially the same initial body content as the homepage and depend on Framer hydration for page-specific content.** This creates a real no-JS/preview/crawler robustness risk.
4. **The Content Security Policy is `Report-Only`, not enforced**, and it contains the same fake n8n origin placeholder. It is also incomplete for some current external resources.
5. **The project's own pre-deploy script currently fails.**
6. **The generated HTML is extremely large (~1.3 MB per major route)** and there is no `loading="lazy"` or `<link rel="preload">` in the static HTML.
7. **The deployment contains substantial external runtime/CDN dependencies**, making the site less self-contained and more fragile.
8. **Accessibility has concrete issues** including many unlabeled empty links, multiple `<h1>` elements per route, and the homepage lacking a semantic `main` landmark in the raw HTML.
9. **Privacy-policy content appears broader than what the current code actually implements**, while the site also contains claims/testimonials that must be factually and legally verified.
10. **There is no package/build pipeline, lockfile, CI configuration, or deterministic release gate.** That is acceptable for a frozen Framer export only if the export itself is controlled and automatically checked; currently it is not.

### Release decision

**Current status: ❌ BLOCKED**

This is not a claim that the site is malicious or that it contains a known secret leak. The issue is that the current archive does **not provide enough confidence that the published result will be the intended, functional, secure, and maintainable production site**.

---

# 1. What Is Already Good

## 1.1 Deployment structure

- `vercel.json` explicitly uses `public` as the output directory.
- `cleanUrls: true` is configured.
- `trailingSlash: false` is configured.
- Legacy project URLs have explicit 301 redirects in `vercel.json`.
- Internal files such as `tools/`, `docs/`, `.git/`, and audit documents are not inside `public/`.
- There is a dedicated `404.html`.

## 1.2 Security baseline

`vercel.json` already defines several useful response headers:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` restrictions for camera, microphone, and geolocation
- HSTS with a one-year max-age
- `frame-ancestors 'none'`
- `object-src 'none'`
- `base-uri 'self'`

These are good foundations.

## 1.3 Secret scanning

A scan of the current tree did **not** find the common credential patterns checked for (private-key blocks, AWS-style access keys, GitHub personal access tokens, Slack tokens, Google API-key patterns).

Git history was also checked for the same common patterns and did not produce a credential match.

**Important:** this does not prove the repository is secret-free. It only means no obvious credentials were found by the patterns checked.

## 1.4 SEO foundations

The site already has:

- `robots.txt`
- `sitemap.xml`
- canonical tags
- Open Graph metadata
- Twitter metadata
- JSON-LD structured data
- route-level titles/descriptions
- `404` noindex behavior
- legacy project redirect coverage

The sitemap contains the intended current canonical routes rather than the old project slugs.

## 1.5 Static integrity checks

The project is syntactically clean at a basic code level:

- **167 public JS/MJS files** passed `node --check`.
- **24 Python utility scripts** passed compilation checks.
- Relevant JSON configuration files parsed successfully.
- Static local-resource scanning found **0 missing local asset references** among the checked HTML/resource references.
- Static internal-link scanning found **0 missing internal route targets** among the checked references.

This is a strong baseline, but it is not equivalent to runtime QA.

## 1.6 Content/asset hygiene already partly addressed

- Legacy project routes are redirected instead of left as duplicate live project pages.
- Images generally have `alt` attributes in the parsed HTML. No missing `alt` attributes were found in the sampled static pages; empty `alt` values were used on some decorative/repeated images.
- The contact component has real labels, explicit field IDs, required-state handling, and an email input type in its custom module implementation.

---

# 2. Critical Problems — Must Be Fixed Before Publishing

## P0 — BLOCKER: Contact form is not production-configured

**File:**
`public/framerusercontent.com/sites/46CYIm3dbxFoU3f63shpCX/https/framerusercontent.com/modules/VM6LshqF3kGfk3qxJUTi/2SWjHeF37NxXG6KxhVeu/TQtrT4cVD.js`

**Line:** 410

Current public bundle contains:

```js
action: "https://YOUR-N8N-WEBHOOK-URL/webhook/contact-form"
```

This is a placeholder, not a production endpoint.

### Risk

- Contact enquiries will not reliably reach Corabin.
- The site's primary conversion mechanism is effectively unconfigured.
- CSP `connect-src` and `form-action` also reference the same fake origin.

### Required action

- Replace the placeholder with the real production flow.
- Test successful submission.
- Test validation failure.
- Test backend failure/timeout.
- Test duplicate submission behavior.
- Verify the webhook actually creates the desired lead/email/CRM record.
- Add spam/abuse protection and server-side validation.

### Important architecture note

A webhook URL embedded in browser JavaScript is **not a secret**. If the endpoint must be private or authenticated with a secret, the safer architecture is a server-side/serverless relay rather than exposing credentials in the browser.

---

## P0 — BLOCKER: Source and deployment trees are out of sync

A comparison of files that exist both at repository root and under `public/` found **48 differing shared files**.

Examples include:

- route HTML files
- `robots.txt`
- `sitemap.xml`
- `_headers`
- `_redirects`
- multiple Framer JS/MJS bundles
- project pages
- contact page

This is especially dangerous because it is possible to fix one copy while the other copy remains broken.

### Concrete example: contact endpoint drift

The source-side contact module still references the old Framer form endpoint:

```js
action: "https://api.framer.com/forms/v1/forms/fbe3507b-9997-4e3f-91ff-9e4321e5b4d4/submit"
```

The public deployment copy instead contains the n8n placeholder.

### Required action

Choose **one canonical source of truth** and make the deployment output reproducible from it.

Preferred approach:

```text
Source / Framer export
        ↓
Deterministic customization/build step
        ↓
public/
        ↓
Automated release checks
        ↓
Vercel
```

Do not manually patch `public/` while leaving the source tree different.

---

## P0 — BLOCKER: Route HTML is not genuinely route-specific before hydration

The static HTML is approximately **1.3 MB per major route** and most content routes have essentially the same initial body text.

Examples checked:

- `/`
- `/about`
- `/contact`
- `/projects`
- `/projects/kora`
- `/blog`
- `/blog/custom-vs-off-the-shelf-choose-wisely`

These pages all produce the same body-text hash/content footprint before runtime hydration, despite having different titles, descriptions, canonical URLs, and route IDs.

The route-specific content is represented in Framer hydration data and JS/CMS state rather than in genuinely route-specific semantic HTML.

### Why this matters

A JavaScript-capable browser may hydrate the right page, but the raw document is still not robust for:

- no-JS users
- link-preview/scraper systems
- some social crawlers
- performance-sensitive crawlers
- partial-render conditions
- failed/blocked third-party runtime dependencies
- debugging and static validation

Google can execute JavaScript, so this is **not proof that Google cannot index the pages**. It is a **crawl robustness and content-parity risk** and should not be ignored on an SEO-focused portfolio site.

### Required action

Validate every public route in a real production-like browser. More importantly, ensure the deployed build provides correct route content without depending on fragile client hydration for basic page identity.

Preferred target:

- real per-route static HTML / SSG output, or
- verified server-side rendering, or
- a known-good Framer export where the generated route HTML is proven to carry the expected content.

---

## P0 — BLOCKER: Security policy is report-only, not enforced

**File:** `vercel.json`

The current policy is:

```text
Content-Security-Policy-Report-Only
```

That means CSP violations are reported rather than blocked.

### Additional issue

The policy itself contains:

```text
https://YOUR-N8N-WEBHOOK-URL
```

in both `connect-src` and `form-action`.

### Additional CSP mismatch

Current pages use external resources such as:

- `unpkg.com` Lenis CSS
- `fonts.gstatic.com`
- Framer-hosted modules/assets
- Gumlet media

The CSP needs to be generated from the **actual production resource graph**, not from a template assumption.

### Required action

1. Replace all placeholders.
2. Run CSP in `Report-Only` during validation.
3. Collect real violations.
4. Correct all legitimate required origins.
5. Remove unnecessary origins.
6. Move to enforced `Content-Security-Policy`.
7. Keep the policy as restrictive as the site can realistically support.
8. Re-test the contact form, video, fonts, navigation, animations, and external assets after enforcement.

---

## P1 — FAILING RELEASE CHECK: Template publish stamp remains

**File:** `public/index.html:3`

Current value:

```html
<!-- Published May 22, 2026, 1:47 PM UTC -->
```

The project's own `scripts/check.sh` explicitly detects this and fails.

### Required action

Remove template/export-only publish metadata unless it is intentionally part of the production source and has a business reason to exist.

---

## P1 — FAILING RELEASE CHECK: malformed mailto in public HTML

The public homepage and related generated markup contain:

```html
href="mailto: hello@corabin.com"
```

There is a space after `mailto:`.

Correct form:

```html
href="mailto:hello@corabin.com"
```

The project check script identifies this as a failure.

### Root cause

The root/source tree also contains the malformed form, which means this can reappear in future exports even if the current `public/` copy is patched.

### Required action

Fix the canonical source and regenerate the deployment output.

---

# 3. Bugs / Functional Risks

## 3.1 Contact functionality risk — HIGH

The contact form is not configured to a real webhook in the public bundle.

**Status:** must fix.

## 3.2 Hydration/content mismatch risk — HIGH

Major route HTML files start as the same Framer shell and depend on hydration for route-specific content.

**Status:** must validate/fix architecture.

## 3.3 Metric animation fallback risk — MEDIUM

The raw homepage/contact content includes metric values and animation-friendly variants such as:

- `19`
- `134 +`
- `5 +`
- zero-state animation values elsewhere in the page data

If client-side animation/hydration fails, a visitor may potentially see an unintended fallback state rather than the final marketing number.

**Status:** test with JavaScript disabled, throttled CPU, and blocked external resources.

## 3.4 Source/deploy drift — HIGH

The duplicated root/public setup is an ongoing bug generator.

**Status:** establish one source of truth.

## 3.5 Release check script itself is slightly inconsistent

`scripts/check.sh` is not executable in the archive and has to be run as:

```bash
bash scripts/check.sh
```

rather than:

```bash
./scripts/check.sh
```

This is not a website runtime bug, but it reduces release ergonomics and makes accidental skipping of checks easier.

## 3.6 No runtime browser verification completed in this environment

The repository's own browser-oriented verification expects `google-chrome`, which was not available here. A Chromium attempt also did not complete a DOM dump within the test timeout.

Therefore the following remain unverified from this static audit:

- visual breakpoint correctness
- menu interaction
- animation behavior
- form submission lifecycle
- focus behavior after errors/success
- actual browser console errors
- runtime hydration correctness
- Core Web Vitals
- Safari/iOS rendering

These must be explicit launch gates.

---

# 4. Accessibility Audit

## Good

- Images parsed from the static HTML had alt attributes present.
- Decorative/repeated imagery sometimes uses empty alt text, which is acceptable when the image is genuinely decorative.
- Contact form component code includes labels and explicit `htmlFor`/`id` relationships.
- Email field uses an email input type.
- `required` validation is implemented in the contact component.

## Issues to fix

### 4.1 Empty unlabeled anchors — HIGH/MEDIUM

The static markup contains many anchor elements with no text and no accessible name.

Example patterns include Framer elements named:

- `Logo Wrapper`
- `Menu Link`

A sample static page contains **18 empty/unlabelled links** across responsive variants.

A screen reader cannot reliably infer a meaningful accessible name from an empty anchor.

**Fix:** give interactive elements a real accessible name or remove the anchor if it is only a visual wrapper.

### 4.2 Multiple H1 elements — MEDIUM

Major pages contain **12 `<h1>` elements** in the raw HTML.

The sample homepage includes repeated responsive variants of:

- `CORABIN`
- `STUDIO`
- numeric metrics
- the CTA line

Some of these are clearly responsive/duplicate design variants, but the DOM still exposes them as H1s.

**Fix:** use one semantic page H1 and keep responsive presentation in CSS rather than creating multiple semantic H1s.

### 4.3 Homepage main landmark — MEDIUM

The homepage uses a `div` with `id="main"` but does not expose the same semantic main landmark pattern found on other pages in the static markup.

**Fix:** use a real `<main>` element or a consistent `role="main"` landmark.

### 4.4 Skip link — MEDIUM

No reliable "Skip to main content" link was found in the static HTML.

**Fix:** add a keyboard-visible skip link, especially for a large animation-heavy portfolio site.

### 4.5 Form autocomplete — MEDIUM

The custom contact form implementation did not show `autocomplete` attributes.

Recommended examples:

- `autocomplete="name"`
- `autocomplete="email"`
- relevant organization/project fields where applicable

### 4.6 Dynamic form feedback — must verify

The form has success/error state logic in JavaScript, but the following must be tested in a real accessibility tree:

- error messages are announced
- focus moves sensibly after submission failure
- success status is announced
- users are not trapped by animated transitions
- keyboard-only users can submit without pointer interaction

### 4.7 Reduced motion

Any Lenis/smooth-scroll and motion-heavy interaction needs real-device validation with `prefers-reduced-motion: reduce` enabled.

Do not assume that a code path existing in the project automatically means every animation has been correctly disabled.

---

# 5. SEO Audit

## 5.1 Already good

- `robots.txt` exists.
- `sitemap.xml` exists.
- Canonicals are present.
- Open Graph metadata is present.
- Twitter metadata is present.
- JSON-LD is present across key page types.
- Legacy project URLs are redirected instead of indexed as duplicate portfolio pages.
- `404` has `noindex`.
- `lang="en-US"` is present.
- The sitemap contains 23 intended canonical URLs and excludes the legacy redirected project slugs.

## 5.2 Title length cleanup needed

Several titles are long enough to be at meaningful truncation risk.

Examples detected:

- `blog/custom-vs-off-the-shelf-choose-wisely` — 77 chars
- `blog/design-that-converts-our-approach` — 80 chars
- `blog/headless-cms-the-future-is-here` — 82 chars
- `blog/stop-making-these-common-api-mistakes` — 83 chars
- `blog/technical-debt-friend-or-foe` — 88 chars
- `blog/website-security-made-simple` — 85 chars
- `blog/why-design-systems-actually-matter` — 76 chars

### Recommendation

Rewrite titles to be clearer and more compact around the primary search intent.

## 5.3 Meta descriptions are often long

Multiple routes have descriptions above ~160 characters, including values around 165–193 characters.

This is not a Google ranking penalty by itself, but it increases the chance of truncation and weakens control over the search snippet.

### Recommendation

Aim for concise descriptions focused on the page's actual value proposition rather than treating the character target as a hard SEO rule.

## 5.4 Route-content/HTML parity is the larger SEO concern

The title/description/canonical change by route, but the raw body text does not.

For a portfolio where project and article content is the reason the page exists, this is more important than minor title-length tuning.

**Priority:** fix/validate route rendering first, then polish title/description copy.

## 5.5 Structured data needs factual verification

JSON-LD types are present and generally appropriate:

- Organization
- WebSite
- ProfessionalService
- WebPage
- Article
- CreativeWork
- BreadcrumbList

However, every structured-data property should be checked against real business facts before publishing.

Avoid adding schema merely because it exists in a template.

## 5.6 404 structured data

The 404 page inherits organization/site structured-data patterns that are not especially useful on an error page.

**Recommendation:** keep the 404 page simple and focused on navigation/recovery unless there is a clear reason for the schema.

## 5.7 Sitemap freshness

The sitemap uses `2026-10-01` as `lastmod` for a broad set of routes.

Before launch, verify those dates represent actual meaningful content changes. Do not use artificially recent timestamps simply to make pages appear fresh to crawlers.

---

# 6. Performance Audit

## 6.1 Major issue: huge HTML documents — HIGH

Major routes are around **1.3 MB of raw HTML each** before browser execution.

That is exceptionally large for a marketing site.

### Impact

- higher transfer cost
- slower HTML parsing
- more main-thread work
- slower mobile interaction
- larger memory pressure
- poorer performance on slow devices/networks

### Recommendation

Reduce the amount of serialized Framer/runtime data included in every route and make each route deliver only the data it needs.

---

## 6.2 No static `loading="lazy"` found

The static HTML contains **0 `loading="lazy"` attributes** in the checked HTML.

That does not prove every image is downloaded immediately at runtime, because Framer code can apply runtime behavior, but it means the static markup itself provides no lazy-loading hint.

**Recommendation:** verify image loading with Chrome DevTools/network waterfall and ensure below-the-fold images are actually deferred.

---

## 6.3 No `<link rel="preload">` tags found

There are no static preload tags in the checked HTML.

This is not automatically wrong, but the site should explicitly evaluate preloading only for genuinely critical resources such as:

- hero image
- critical font file(s)
- other LCP resource(s)

Do not preload everything; preload only what profiling proves is critical.

---

## 6.4 Large image assets — HIGH

The `public/` tree contains **37 files larger than 1 MB**, including **5 above 2 MB**.

Examples include:

- `public/assets/images/blogs/blog8.png` — ~2.85 MB
- `public/assets/images/blogs/blog1.png` — ~2.19 MB
- `public/video.gumlet.io/.../download.mp4` — ~2.18 MB
- matching Framer-hosted image copies around the same sizes

### Important optimization opportunity

The repository contains PNG/WebP variants where WebP is often dramatically smaller than the PNG.

Recommendation:

- prefer WebP or AVIF for photographic/raster content where supported
- generate real responsive size variants
- compress large originals
- remove unused duplicates from production output

---

## 6.5 Current `srcset` strategy is not fully effective

Some examples use the same PNG file for multiple width candidates and then a large WebP candidate at the final size.

That means the browser may still download an oversized image for smaller screens.

**Fix:** create actual 320/480/768/1200/etc. derivatives and use them as genuine `srcset` candidates.

---

## 6.6 External runtime dependency footprint — HIGH

The public code contains many external URL references.

Static scanning found hundreds of unique URL strings, including many Framer-hosted modules/assets, as well as resources from:

- `framerusercontent.com`
- `unpkg.com`
- `video.gumlet.io`
- `fonts.gstatic.com`

There are also many external Framer image URLs referenced from runtime/module code.

This increases:

- third-party dependency risk
- latency
- network failure modes
- privacy surface
- CSP maintenance complexity
- long-term reproducibility problems

### Recommendation

Self-host as much critical production content as practical, especially:

- CSS used for runtime behavior
- critical fonts
- critical JavaScript modules
- critical imagery

Keep external dependencies only when there is a clear reason and a controlled, pinned version.

---

## 6.7 Lenis is loaded from unpkg

The site references a specific Lenis stylesheet from `unpkg.com`.

For a production portfolio site, this is unnecessary external dependency if the repository already contains a local mirror.

**Recommendation:** use the local version and pin the version in the build.

This also simplifies the CSP.

---

## 6.8 Video handling

The video markup uses `preload="none"`, `muted`, and `playsinline`, which are good performance/UX choices.

Still verify:

- poster/fallback image
- reduced-motion behavior
- mobile bandwidth behavior
- autoplay policy handling
- whether the local duplicate video copy is actually needed

---

## 6.9 Caching configuration needs cleanup

`vercel.json` gives explicit caching to `/assets/` and fonts, which is good.

However, there is also a separate `_headers` configuration in the repository, creating multiple potential policy sources.

**Recommendation:** keep one authoritative config for the actual deployment provider. Do not maintain contradictory copies that future maintainers can accidentally edit independently.

---

# 7. Security Audit

## 7.1 Good

The project has a meaningful baseline header set and no obvious common credential pattern was found.

## 7.2 Must fix

### CSP must be enforced

Current policy is Report-Only.

### CSP contains an invalid placeholder

Replace `YOUR-N8N-WEBHOOK-URL` everywhere.

### CSP contains unsafe execution allowances

Current policy includes:

```text
'unsafe-inline'
'unsafe-eval'
```

This weakens CSP significantly.

Because this is a generated Framer app, removing these may require framework-compatible changes rather than a simple edit. Still, the goal should be to reduce them as far as the deployment can support.

### External allowlist is broader than necessary / incomplete in places

The final policy should reflect the actual runtime dependency graph, not guessed origins.

## 7.3 Security recommendations — not necessarily blockers

Consider, where compatible with the site architecture:

- `Cross-Origin-Opener-Policy`
- `Cross-Origin-Resource-Policy`
- stronger cache policy for immutable hashed assets
- CSP reporting/monitoring
- dependency pinning
- a dedicated server-side form relay if the webhook should not be directly exposed

Do not add security headers blindly; validate browser compatibility and actual resource requirements.

---

# 8. Privacy / Legal / Trust Audit

## 8.1 Privacy-policy mismatch risk — HIGH

The privacy page describes broad data collection such as:

- contact information
- business information
- project requirements
- payment information
- browser/device/IP/page/referral information
- analytics/performance cookies
- newsletters
- third-party processors

But static code scanning did not find clear implementation of common analytics/tracking libraries, browser storage, cookie APIs, or a newsletter system.

This creates a potential mismatch between:

**what the policy says happens** vs **what the site actually does**.

### Required action

Reconcile the policy with the actual deployed data flows.

Do not claim tracking, cookies, analytics, newsletters, processors, retention periods, or data categories that are not actually used.

At the same time, do not omit actual third-party data transfers such as external CDN/resource requests or the real contact-form processing chain.

## 8.2 Testimonials and business claims

The site contains strong marketing claims and testimonial content, including named client/company-style references and quantitative claims such as project counts and experience.

Before launch verify:

- each testimonial is real
- the person/company has permission to be named
- quoted wording is approved
- portfolio projects are accurately represented
- statistics are true as of launch
- any awards/badges/certifications are real

Never publish placeholder, invented, or template-derived social proof.

## 8.3 Terms content

The Terms page contains specific commercial policies (deposit, revision, warranty, etc.).

These must match the actual Corabin sales process and client contract language.

---

# 9. Code Quality & Repository Structure

## 9.1 What is good

- Static deployment separation is clear.
- Generated Framer files are organized by route/module.
- Utility scripts exist for verification/migration.
- There is a basic pre-deployment check script.
- The public bundle is syntactically valid under Node's parser.

## 9.2 What is weak

### No `package.json`

There is no standard package manifest in the audited root.

### No lockfile

No npm/pnpm/yarn lockfile was present.

### No CI workflow

No GitHub Actions/GitLab CI style configuration was found.

### No deterministic build command

The repository behaves more like a checked-in static export than a maintainable web application.

That is acceptable only if you deliberately treat the `public/` output as a release artifact and rigorously validate it.

### Generated code is difficult to maintain manually

The Framer export contains many large generated bundles. This is normal for an exported design, but it means:

- manual code edits are risky
- source/deploy drift is easy
- regression debugging is difficult
- reproducibility is more important than usual

### Git working tree is dirty

`git status` shows many modified files and untracked files.

The archive contains `.git` as well, with a repository history, but the current working tree is not a clean release state.

### Repository size is inflated

The archive contains `.git`, `tools`, source assets, duplicate files, and the entire `public/` tree.

`.git` alone is around 78 MB in the archive's working tree.

This is mostly repository hygiene, not direct Vercel runtime risk, because `public/` is the configured output.

---

# 10. Pages / Routes / Missing Coverage

## Existing route coverage found

The site currently contains:

- Home
- About
- Contact
- Projects listing
- 6 current project detail pages
- 6 legacy project route stubs for redirects
- Blog listing
- 10 blog post pages
- Privacy
- Terms
- 404

This is a good structural coverage for a studio/agency website.

## Missing or needing verification

These are not necessarily required files, but they should be considered/checked based on launch requirements:

- production analytics strategy (or explicit decision to run without analytics)
- error monitoring strategy
- Core Web Vitals monitoring
- deterministic deployment CI
- real contact-form integration test
- domain/HTTPS/canonical-host verification
- social share preview verification
- legal/business entity details appropriate to the operating jurisdiction
- asset/template/license provenance records

A web app manifest, `security.txt`, or `humans.txt` should **not** be added just for checklist completeness unless there is a real use case.

---

# 11. What Needs To Be Fixed / Updated

## Priority P0 — must fix before publish

- [ ] Replace `YOUR-N8N-WEBHOOK-URL` in the public contact bundle.
- [ ] Make source and `public/` output consistent.
- [ ] Decide and document the single source of truth for the deployment artifact.
- [ ] Validate real route-specific rendering on every indexable page.
- [ ] Resolve the CSP placeholder.
- [ ] Move from CSP Report-Only to enforced CSP after validation.
- [ ] Run and pass the complete pre-deploy check.
- [ ] Test the real contact form end-to-end.

## Priority P1 — must fix before or immediately around launch

- [ ] Remove the Framer template publish stamp.
- [ ] Fix all malformed `mailto:` links at the source.
- [ ] Replace empty/unlabelled interactive anchors with accessible names.
- [ ] Reduce duplicate H1 semantics.
- [ ] Add/verify a semantic `<main>` landmark on the homepage.
- [ ] Add a skip link.
- [ ] Add form `autocomplete` values.
- [ ] Verify form error/success announcements and focus handling.
- [ ] Optimize large image assets.
- [ ] Generate real responsive image variants.
- [ ] Verify lazy-loading behavior in the browser.
- [ ] Reduce unnecessary third-party runtime dependencies.
- [ ] Replace external Lenis CSS with a controlled local version where possible.
- [ ] Reconcile the privacy policy with actual runtime data collection.
- [ ] Verify every testimonial, project claim, statistic, and legal policy.
- [ ] Review long SEO titles/descriptions.
- [ ] Clean repository state before tagging release.

## Priority P2 — quality / maintenance improvements

- [ ] Consolidate duplicate deployment configs (`vercel.json`, `_headers`, `_redirects`) where they overlap.
- [ ] Add cache rules for hashed immutable assets if appropriate.
- [ ] Remove unused duplicate media/assets.
- [ ] Add CI checks.
- [ ] Add automated Lighthouse/Axe/link/form smoke tests.
- [ ] Review unnecessary schema on 404.
- [ ] Verify sitemap `lastmod` accuracy.

---

# 12. What Needs To Be Created

## 12.1 A deterministic release pipeline

Create a single documented command/process that produces the exact `public/` deployment tree from the canonical source.

Example target workflow:

```text
Edit source
   ↓
Build/export
   ↓
Generate public/
   ↓
Static validation
   ↓
Browser smoke tests
   ↓
Lighthouse/Axe
   ↓
Security-header/CSP checks
   ↓
Release commit/tag
   ↓
Vercel deployment
```

## 12.2 CI release gate

Create CI that fails the deployment when any of these happen:

- broken internal links
- missing local resources
- unresolved form placeholder
- known template leftovers
- malformed mailto
- broken canonical URLs
- invalid sitemap
- missing metadata
- CSP policy errors
- accessibility regression
- oversized assets beyond defined budgets
- JavaScript parse/build failure

## 12.3 Contact integration test

Create a real smoke test for:

```text
Form → webhook/relay → n8n → destination → success UI
```

Also test duplicate submissions, invalid email, empty fields, network failure, and backend failure.

## 12.4 Browser QA matrix

Create a repeatable smoke-test checklist for:

- 320px
- 375px
- 390px
- 430px
- 768px
- 1024px
- 1280px
- 1440px
- 1920px

And at minimum:

- Chrome desktop
- Safari desktop
- iPhone Safari
- Android Chrome

---

# 13. What Must Be Checked Before Publishing

Use this as the final release gate.

## Deployment

- [ ] `vercel.json` points to the intended `public/` directory.
- [ ] `public/` contains only deployable assets.
- [ ] Source and deploy copies are synchronized.
- [ ] Git working tree is clean.
- [ ] Deployment uses the intended domain.
- [ ] HTTP automatically redirects to HTTPS.
- [ ] `www` and apex host behavior is intentional and consistent.
- [ ] No accidental preview/staging hostname is canonical.

## Contact form

- [ ] Real production endpoint configured.
- [ ] n8n workflow is active.
- [ ] Successful enquiry reaches the correct destination.
- [ ] Error state works.
- [ ] Validation works.
- [ ] Spam protection works.
- [ ] Rate limiting/abuse controls are in place.
- [ ] Backend sanitizes and validates all input.
- [ ] No credentials are embedded in browser JavaScript.
- [ ] Privacy notice matches the actual data flow.

## Security

- [ ] No placeholder values remain.
- [ ] CSP is enforced, not only Report-Only.
- [ ] CSP allows every required production resource and nothing unnecessary.
- [ ] HSTS is safe for the actual domain/subdomains.
- [ ] Clickjacking protection is active.
- [ ] No exposed API keys or private credentials.
- [ ] Third-party dependencies are understood and pinned.
- [ ] Remote CDN dependencies are intentionally accepted.

## SEO

- [ ] Every indexable page has one clear primary H1.
- [ ] Every canonical route renders the correct page content.
- [ ] Title and description match page intent.
- [ ] Canonical URLs use the production domain.
- [ ] Open Graph preview is correct.
- [ ] Twitter/X preview is correct.
- [ ] JSON-LD is factually correct.
- [ ] Sitemap contains only intended canonical URLs.
- [ ] `lastmod` values are accurate.
- [ ] 404 is not indexable.
- [ ] Old URLs redirect appropriately.

## Accessibility

- [ ] All interactive controls have accessible names.
- [ ] Navigation works without mouse.
- [ ] Skip link works.
- [ ] Focus indicators are visible.
- [ ] Form errors are announced.
- [ ] Form success is announced.
- [ ] Keyboard focus is not lost during animations.
- [ ] Reduced-motion mode works.
- [ ] Contrast passes.
- [ ] Text can zoom to 200% without breaking layout.
- [ ] No unintended horizontal scrolling.
- [ ] Touch targets are usable on mobile.

## Performance

- [ ] Lighthouse tested on mobile.
- [ ] Core Web Vitals are acceptable.
- [ ] LCP resource is optimized.
- [ ] Hero image is correctly sized/compressed.
- [ ] Images below the fold are deferred where appropriate.
- [ ] Large PNGs are optimized or replaced.
- [ ] Real `srcset` candidates exist for responsive images.
- [ ] Third-party requests are minimized.
- [ ] Video does not consume unnecessary bandwidth.
- [ ] Font loading is verified.
- [ ] No excessive layout shift from fonts/media/animations.

## Content / trust / legal

- [ ] All portfolio projects are real/authorized.
- [ ] All testimonials are real/approved.
- [ ] All stats are accurate.
- [ ] Copyright/license provenance exists for images, fonts, icons, videos, and template code.
- [ ] Privacy policy matches implementation.
- [ ] Terms match actual commercial terms.
- [ ] Business identity/contact details are correct.
- [ ] All links and email addresses are correct.

---

# 14. Pre-Deploy Command Set

At minimum, the release process should end with something equivalent to:

```bash
# 1. clean source state
git status

# 2. run project checks
bash scripts/check.sh

# 3. parse-check public JS
find public -type f \( -name '*.js' -o -name '*.mjs' \) -print0 | xargs -0 -n1 node --check

# 4. validate configuration
python -m json.tool vercel.json >/dev/null

# 5. local HTTP server + browser smoke tests
# 6. Lighthouse
# 7. axe accessibility audit
# 8. contact-form end-to-end test
# 9. verify production response headers
# 10. verify sitemap/robots/canonical URLs on production
```

The actual CI command set should be made deterministic rather than relying on a developer's local machine.

---

# 15. Audit Evidence Summary

| Area | Result | Assessment |
|---|---|---|
| JS syntax | 167/167 parse-clean | ✅ Good |
| Python tool syntax | 24/24 compile-clean | ✅ Good |
| JSON config parse | Passed | ✅ Good |
| Local resource references | 0 missing in checked scan | ✅ Good |
| Internal route references | 0 missing in checked scan | ✅ Good |
| Sitemap | Present, 23 intended current URLs | ✅ Good |
| Robots | Present | ✅ Good |
| Canonicals | Present | ✅ Good |
| OG/Twitter | Present | ✅ Good |
| JSON-LD | Present | ✅ Good foundation |
| Common credential patterns | No hits found | ✅ No obvious leak |
| Contact endpoint | `YOUR-N8N-WEBHOOK-URL` remains | ❌ Blocker |
| CSP | Report-Only + placeholder | ❌ Blocker |
| Source vs public parity | 48 differing shared files | ❌ Blocker |
| Route raw HTML parity | Major routes share same body content | ❌ High risk |
| Predeploy script | Currently fails | ❌ Blocker |
| Template stamp | Present | ❌ Fix |
| Mailto syntax | Malformed in public HTML | ❌ Fix |
| Lazy-loading hints | 0 static `loading="lazy"` found | ⚠️ Review |
| Preload hints | 0 found | ⚠️ Profile first |
| Large public assets | 37 files >1 MB | ⚠️ Optimize |
| Major route HTML size | ~1.3 MB each | ⚠️ High performance risk |
| Empty/unlabelled anchors | 18 found on sample major pages | ⚠️ Accessibility issue |
| H1 count | 12 on many major pages | ⚠️ Accessibility/SEO issue |
| CI/build pipeline | None found | ⚠️ Create |
| Runtime browser QA | Not completed in this environment | ⚠️ Mandatory before launch |

---

# 16. Final Professional Assessment

## Production readiness score

**Current: ~55/100**

This is an engineering-readiness estimate, not a Lighthouse score.

### Why it is not higher

The site has substantial finished work, but the remaining issues sit on the most important release paths:

- the conversion form
- source/deployment consistency
- route rendering correctness
- enforced security policy
- release validation

Those deserve much more weight than visual polish or the presence of SEO metadata.

## Publish recommendation

### ❌ DO NOT PUBLISH THIS ARCHIVE AS-IS

The minimum bar for approval is:

```text
Real contact endpoint
        +
Source/public synchronization
        +
Route rendering verification
        +
CSP fixed and enforced
        +
All release checks passing
        +
Accessibility smoke test
        +
Lighthouse/mobile test
        +
Production HTTP/header/form verification
```

Once those pass, the remaining SEO, asset optimization, and repository cleanup items can be handled as a controlled optimization pass, although the route HTML size and external dependency footprint are important enough that they should not be ignored.

---

# 17. Known Audit Limitations

This audit was performed primarily from the uploaded source archive and local static analysis.

I could not independently prove from the archive alone:

- that the real `n8n` production endpoint exists or is configured correctly
- that all testimonials/statistics are factual and authorized
- that every asset/template/font has a valid production license
- the exact production-domain response headers
- actual Core Web Vitals
- real Safari/iOS behavior
- complete runtime DOM after Framer hydration
- browser-console errors on the live domain

These are therefore **release verification gates**, not assumptions.

---

# Final Status

**🔴 NOT READY FOR PRODUCTION**

**Primary blockers:**

1. Production contact form endpoint is not configured.
2. Source and deploy trees are inconsistent.
3. Route-specific content depends heavily on hydration and is not represented correctly in the initial HTML body.
4. CSP is not enforced and still contains a placeholder.
5. Project release checks currently fail.

**After those blockers are fixed, the next priority is:** accessibility cleanup + image/HTML performance optimization + CI/browser/Lighthouse release automation.

