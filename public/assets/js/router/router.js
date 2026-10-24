/**
 * @module router/router
 * @description SPA routing helpers and link normalisation for the Corabin website.
 * Prevents broken relative links and coordinates route changes with runtime state.
 */

import { resolveCurrentSlug, extractSlugFromHref } from '../utils/url.js';
import { safeSetAttr } from '../utils/dom.js';

/**
 * Converts a Framer-relative URL string into an absolute path.
 *
 * @param {string|null|undefined} url
 * @returns {string|null|undefined}
 */
export function normalizeFramerRouteUrl(url) {
    if (typeof url !== 'string' || !url) return url;

    // Correct Framer's double-blog-segment bug
    if (url === '/blog/blog' || url.startsWith('/blog/blog/')) {
        return url.replace(/^\/blog\/blog\/?/, '/blog/');
    }

    const ROUTE_MAP = [
        { prefix: './blog/',    replacement: (s) => '/blog/' + s.slice(7) },
        { prefix: './projects', replacement: (s) => s.replace(/^\.\/projects/, '/projects') },
        { prefix: './about',    replacement: (s) => s.replace(/^\.\/about/,    '/about')    },
        { prefix: './contact',  replacement: (s) => s.replace(/^\.\/contact/,  '/contact')  },
        { prefix: './privacy',  replacement: (s) => s.replace(/^\.\/privacy/,  '/privacy')  },
        { prefix: './terms',    replacement: (s) => s.replace(/^\.\/terms/,    '/terms')    },
    ];

    for (const { prefix, replacement } of ROUTE_MAP) {
        if (url.startsWith(prefix)) return replacement(url);
    }

    if (url === './blog' || url === './blog/') return '/blog/';
    if (url === './' || url === '.')          return '/';

    if (url.startsWith('./')) {
        const rel = url.slice(2);
        if (typeof window !== 'undefined' && window.location.pathname.startsWith('/blog')) {
            return '/blog/' + rel.replace(/^\/+/, '');
        }
        return '/' + rel;
    }

    return url;
}

/**
 * Sanitises an anchor href attribute value.
 *
 * @param {string|null|undefined} href
 * @returns {string|null|undefined}
 */
export function sanitizeHref(href) {
    return normalizeFramerRouteUrl(href);
}

/**
 * Patches all anchor hrefs in the document to prevent relative navigation failures.
 */
export function fixDomLinks() {
    if (typeof document === 'undefined') return;
    document.querySelectorAll('a[href]').forEach(a => {
        const raw = a.getAttribute('href');
        const clean = sanitizeHref(raw);
        if (clean && clean !== raw) {
            safeSetAttr(a, 'href', clean);
        }
    });
}

/**
 * Activates SPA navigation listeners. Idempotent.
 *
 * @param {function(): void} onRouteEnter
 * @param {function(): void} onRouteLeave
 */
export function setupRouteListeners(onRouteEnter, onRouteLeave) {
    if (typeof window === 'undefined') return;
    if (window.__corabinRouteListenersAttached) return;

    window.__corabinRouteListenersAttached = true;
    let currentPath = window.location.pathname;

    // Correct /blog/blog if active
    if (window.location.pathname.startsWith('/blog/blog')) {
        const cleanPath = window.location.pathname.replace(/^\/blog\/blog\/?/, '/blog/');
        window.history.replaceState(null, '', cleanPath + window.location.search + window.location.hash);
        currentPath = window.location.pathname;
    }

    // Intercept article clicks for clean document load
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href]');
        if (!link) return;

        const raw   = link.getAttribute('href');
        const clean = sanitizeHref(raw);
        if (clean && clean !== raw) safeSetAttr(link, 'href', clean);

        const effectiveHref = clean || raw;
        const targetSlug    = extractSlugFromHref(effectiveHref);

        if (
            targetSlug &&
            targetSlug !== 'blog' &&
            targetSlug !== 'article.html' &&
            targetSlug !== 'article' &&
            targetSlug !== 'index.html'
        ) {
            e.preventDefault();
            e.stopPropagation();
            window.location.href = effectiveHref;
        }
    }, true);

    fixDomLinks();
    window.addEventListener('load', fixDomLinks);

    const handleRouteChange = () => {
        if (window.location.pathname === currentPath) return;

        currentPath   = window.location.pathname;
        const newSlug = resolveCurrentSlug();

        if (!newSlug || newSlug === 'blog' || newSlug === 'index.html') {
            if (typeof onRouteLeave === 'function') onRouteLeave();
        }

        fixDomLinks();

        setTimeout(() => {
            if (typeof onRouteEnter === 'function') onRouteEnter();
            fixDomLinks();
        }, 60);
    };

    window.addEventListener('popstate', handleRouteChange);

    window.addEventListener('pageshow', (event) => {
        const currentSlug = resolveCurrentSlug();
        if (!currentSlug || currentSlug === 'blog' || currentSlug === 'index.html') {
            if (typeof onRouteLeave === 'function') onRouteLeave();
            if (event.persisted && typeof onRouteEnter === 'function') onRouteEnter();
        }
    });

    // History API patches
    const origPush = history.pushState;
    if (origPush) {
        history.pushState = function(state, title, url) {
            const cleanUrl = normalizeFramerRouteUrl(url);
            const res = origPush.call(this, state, title, cleanUrl);
            handleRouteChange();
            return res;
        };
    }

    const origReplace = history.replaceState;
    if (origReplace) {
        history.replaceState = function(state, title, url) {
            const cleanUrl = normalizeFramerRouteUrl(url);
            const res = origReplace.call(this, state, title, cleanUrl);
            handleRouteChange();
            return res;
        };
    }
}
