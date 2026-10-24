/**
 * Corabin Blog Runtime — Main Entry Point
 *
 * This is the only script tag loaded by Framer HTML pages:
 *   <script type="module" src="/assets/js/blog-runtime.js"></script>
 *
 * Architecture overview:
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │  blog-runtime.js  (this file — entry point & public re-exports)     │
 * ├─────────────────────────────────────────────────────────────────────┤
 * │  modules/                                                            │
 * │    config.js          — Environment constants & selectors            │
 * │    utils.js           — Pure helpers (date, slug, URL, meta)        │
 * │    cloudinary.js      — Cloudinary URL builder & srcset generator    │
 * │    supabase-api.js    — Supabase REST client (read-only)            │
 * │    markdown-parser.js — Markdown → HTML + Framer AST renderer       │
 * │    featured-grid.js   — Featured card/grid sync + homepage init      │
 * │    listing-runtime.js — Regular card listing sync + blog init        │
 * │    article-runtime.js — Stateful article page runtime               │
 * │    router.js          — SPA routing helpers & history patches        │
 * └─────────────────────────────────────────────────────────────────────┘
 *
 * Data flow per page type:
 *   / (homepage)      → initHomepageFeatured() → fetchPublishedPosts → syncFeaturedGrid
 *   /blog/            → initBlogListing()       → fetchPublishedPosts → syncFeaturedGrid + syncRegularListing
 *   /blog/<slug>/     → initSharedBlogArticle() → fetchPost          → applyArticleData + MutationObserver
 *
 * @module blog-runtime
 */

// ---------------------------------------------------------------------------
// Module Imports
// ---------------------------------------------------------------------------

// Configuration & utilities
export {
    SUPABASE_PROJECT_URL,
    SUPABASE_ANON_KEY,
    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_BLOG_COVERS_FOLDER,
    REQUIRED_ARTICLE_COLUMNS,
    REQUIRED_LISTING_COLUMNS,
    ARTICLE_ROOT_SELECTOR,
    BASELINE_STATIC_SLUGS,
} from './modules/config.js';

export {
    formatArticleDate,
    resolveCurrentSlug,
    urlsMatch,
    extractSlugFromHref,
    updateMetaTag,
} from './modules/utils.js';

// Cloudinary
export {
    resolveCloudinaryImageUrl,
    generateResponsiveSrcset,
} from './modules/cloudinary.js';

// Supabase API
export {
    fetchPostFromSupabase,
    fetchPublishedPostsFromSupabase,
} from './modules/supabase-api.js';

// Content rendering
export { parseArticleContent } from './modules/markdown-parser.js';

// Featured grid
export {
    selectFeaturedPosts,
    attachCardHoverHandlers,
    syncFeaturedCard,
    syncFeaturedGrid,
    initHomepageFeatured,
} from './modules/featured-grid.js';

// Regular listing
export {
    ensureBlogAnimationStyles,
    syncCardResponsiveVariant,
    syncRegularCard,
    cloneRegularCard,
    syncRegularListing,
    initBlogListing,
} from './modules/listing-runtime.js';

// Article runtime
export {
    cleanupArticleRuntime,
    applyArticleData,
    renderUnavailableState,
    syncArticleRelatedPosts,
    initSharedBlogArticle,
} from './modules/article-runtime.js';

// Router helpers
export {
    normalizeFramerRouteUrl,
    sanitizeHref,
    fixDomLinks,
    setupRouteListeners,
} from './modules/router.js';

// Scalable API & State singletons
export { store, Store } from './state/store.js';
export { HttpClient } from './api/client.js';
export { SupabaseApi } from './api/supabase.js';

// ---------------------------------------------------------------------------
// Internal imports (not re-exported — used only in this entry point)
// ---------------------------------------------------------------------------

import { resolveCurrentSlug as _resolveCurrentSlug } from './modules/utils.js';
import { cleanupArticleRuntime as _cleanupArticleRuntime } from './modules/article-runtime.js';
import { initSharedBlogArticle as _initSharedBlogArticle } from './modules/article-runtime.js';
import { initBlogListing as _initBlogListing } from './modules/listing-runtime.js';
import { initHomepageFeatured as _initHomepageFeatured } from './modules/featured-grid.js';
import { setupRouteListeners as _setupRouteListeners } from './modules/router.js';

// ---------------------------------------------------------------------------
// Universal Blog System Initialiser
// ---------------------------------------------------------------------------

/**
 * Detects the current page type and runs the appropriate initialiser.
 *
 * Page detection priority:
 *   1. Article route — a non-empty, non-index slug resolved from the URL.
 *   2. Blog listing  — /blog/ path or presence of `.framer-18dht5n` in the DOM.
 *   3. Homepage      — root path or presence of `#insights` / `.framer-k7mcxy`.
 *
 * Called automatically on DOMContentLoaded, and again on every route change
 * by the SPA routing layer.
 */
export function initBlogSystem() {
    const pathname = window.location.pathname;
    const slug     = _resolveCurrentSlug();

    // ------------------------------------------------------------------
    // 1. Article route (e.g. /blog/my-article/ or ?slug=my-article)
    // ------------------------------------------------------------------
    if (slug && slug !== 'blog' && slug !== 'index.html') {
        _initSharedBlogArticle();
        return;
    }

    // Leaving or outside an article route — clean up any lingering article state
    _cleanupArticleRuntime();

    // ------------------------------------------------------------------
    // 2. Blog listing page (/blog/ or /blog/index.html)
    // ------------------------------------------------------------------
    const isBlogListing =
        pathname === '/blog' ||
        pathname === '/blog/' ||
        pathname === '/blog/index.html' ||
        pathname.endsWith('/blog/') ||
        Boolean(
            document.querySelector('.framer-18dht5n') ||
            (document.querySelector('.framer-ugj76m') && !document.querySelector('#insights'))
        );

    if (isBlogListing && pathname.includes('/blog')) {
        _initBlogListing();
        return;
    }

    // ------------------------------------------------------------------
    // 3. Homepage (/ or /index.html)
    // ------------------------------------------------------------------
    const isHomepage =
        pathname === '/' ||
        pathname === '/index.html' ||
        pathname === '' ||
        Boolean(document.querySelector('#insights, .framer-k7mcxy'));

    if (isHomepage) {
        _initHomepageFeatured();
        return;
    }
}

// ---------------------------------------------------------------------------
// Auto-Init on DOM Ready
// ---------------------------------------------------------------------------

if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBlogSystem);
    } else {
        // Document already parsed (e.g. script tag after body close)
        initBlogSystem();
    }
}

// ---------------------------------------------------------------------------
// SPA Route Listeners
// ---------------------------------------------------------------------------

// Pass initBlogSystem and cleanupArticleRuntime as callbacks to avoid circular deps
if (typeof window !== 'undefined') {
    _setupRouteListeners(initBlogSystem, _cleanupArticleRuntime);
}
