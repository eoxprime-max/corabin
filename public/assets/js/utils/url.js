/**
 * @module utils/url
 * @description URL and slug utilities for routing and social sharing.
 */

/**
 * Resolves the active article slug from the current browser location.
 * Checks both query parameters (?slug=...) and pathname segments (/blog/:slug).
 *
 * @param {Location} [loc=window.location] - Location object to parse.
 * @returns {string|null} Resolved slug, or null if on an index or non-article page.
 */
export function resolveCurrentSlug(loc = (typeof window !== 'undefined' ? window.location : null)) {
    if (!loc) return null;

    // 1. Query parameter override (?slug=...)
    const params = new URLSearchParams(loc.search || '');
    const querySlug = params.get('slug');
    if (querySlug && querySlug.trim()) {
        const clean = querySlug.trim().replace(/^\/+|\/+$/g, '');
        if (clean && clean !== 'blog' && clean !== 'index.html' && clean !== 'article' && clean !== 'article.html') {
            return clean;
        }
    }

    // 2. Pathname segment extraction
    const rawPath = loc.pathname || '';
    const cleanPath = rawPath.replace(/\/index\.html$/, '').replace(/\/+$/, '');
    const segments = cleanPath.split('/').filter(Boolean);

    // Expected pattern: ['blog', '<slug>']
    const blogIndex = segments.indexOf('blog');
    if (blogIndex !== -1 && blogIndex < segments.length - 1) {
        const candidate = segments[blogIndex + 1];
        if (candidate && candidate !== 'index.html' && candidate !== 'article' && candidate !== 'article.html') {
            return candidate;
        }
    }

    return null;
}

/**
 * Extracts a blog slug from an anchor href attribute.
 *
 * @param {string|null|undefined} href - The href attribute string.
 * @returns {string|null} The extracted slug, or null.
 */
export function extractSlugFromHref(href) {
    if (!href || typeof href !== 'string') return null;

    // Strip anchor and query strings
    const clean = href.split('#')[0].split('?')[0].trim();
    const match = clean.match(/(?:\.\/|\/)?blog\/([a-zA-Z0-9_-]+)(?:\/|\/index\.html)?$/);
    if (!match) return null;

    const slug = match[1];
    return (slug && slug !== 'index' && slug !== 'index.html' && slug !== 'article') ? slug : null;
}

/**
 * Compares two URLs or pathname strings for equivalence.
 *
 * @param {string} a - First URL.
 * @param {string} b - Second URL.
 * @returns {boolean} True if they point to the same path.
 */
export function urlsMatch(a, b) {
    if (!a || !b) return false;
    if (a === b) return true;

    const norm = (u) => {
        try {
            const parsed = new URL(u, 'https://corabin.com');
            return parsed.pathname.replace(/\/index\.html$/, '').replace(/\/+$/, '') || '/';
        } catch {
            return String(u).split('?')[0].split('#')[0].replace(/\/index\.html$/, '').replace(/\/+$/, '') || '/';
        }
    };

    return norm(a) === norm(b);
}

/**
 * Generates social sharing URLs for Twitter/X, LinkedIn, and Facebook.
 *
 * @param {string} url   - The canonical URL of the article.
 * @param {string} title - The title of the article.
 * @returns {{ twitter: string, linkedin: string, facebook: string }}
 */
export function buildShareUrls(url, title = '') {
    const encodedUrl   = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);

    return {
        twitter:  `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    };
}
