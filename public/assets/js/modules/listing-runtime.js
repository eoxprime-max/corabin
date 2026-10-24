/**
 * @module modules/listing-runtime
 * @description Synchronises the /blog/ listing page regular card grid with live Supabase data.
 */

import {
    syncCardResponsiveVariant,
    syncRegularCard,
    cloneRegularCard,
    attachCardHoverHandlers,
} from '../ui/components/card.js';
import { ensureBlogAnimationStyles } from '../ui/animations/card-effects.js';
import { extractSlugFromHref } from '../utils/url.js';
import { selectFeaturedPosts, selectRegularPosts } from '../services/article-service.js';
import { syncFeaturedGrid } from './featured-grid.js';
import { loadPublishedPosts } from '../state/actions.js';
import { fetchPublishedPostsFromSupabase } from '../api/supabase.js';

export {
    ensureBlogAnimationStyles,
    syncCardResponsiveVariant,
    syncRegularCard,
    cloneRegularCard,
};

/**
 * Synchronises the regular card listing container (`.framer-18dht5n`) with
 * regular (non-featured) posts.
 *
 * @param {HTMLElement}   container
 * @param {Array<Object>} regularPosts
 * @param {Set<string>}   featuredSlugs
 * @param {HTMLElement}   sampleCard
 */
export function syncRegularListing(container, regularPosts, featuredSlugs, sampleCard) {
    if (!container || !regularPosts || regularPosts.length === 0) return;

    const sampleTemplate =
        sampleCard
            ? sampleCard.cloneNode(true)
            : (container.querySelector('.framer-ij7w41-container')?.cloneNode(true) || window.__corabinSampleCard);

    if (!sampleTemplate) return;
    if (!window.__corabinSampleCard) {
        window.__corabinSampleCard = sampleTemplate.cloneNode(true);
    }

    const regularSlugs = new Set(regularPosts.map(p => p.slug));

    // Remove cards for featured or non-existent posts
    container.querySelectorAll('.framer-ij7w41-container').forEach(c => {
        const slug =
            c.getAttribute('data-post-slug') ||
            extractSlugFromHref(c.querySelector('a')?.getAttribute('href'));
        if (!slug || featuredSlugs?.has(slug) || !regularSlugs.has(slug)) {
            c.remove();
        }
    });

    // Fast-path: check if container already has the exact cards in order
    const currentCards = Array.from(container.querySelectorAll('.framer-ij7w41-container'));
    const isAlreadySynced =
        currentCards.length === regularPosts.length &&
        currentCards.every((c, idx) => {
            const slug =
                c.getAttribute('data-post-slug') ||
                extractSlugFromHref(c.querySelector('a')?.getAttribute('href'));
            return slug === regularPosts[idx].slug;
        });

    if (isAlreadySynced) {
        currentCards.forEach(card => {
            syncCardResponsiveVariant(card);
            attachCardHoverHandlers(card.querySelector('a'));
        });
        const loadMore = container.querySelector('.framer-1xy7824');
        if (loadMore) loadMore.style.display = 'none';
        return;
    }

    const loadMore = container.querySelector('.framer-1xy7824');

    for (let i = 0; i < regularPosts.length; i++) {
        const post = regularPosts[i];

        let card = container.querySelector(`[data-post-slug="${post.slug}"]`);
        if (!card) {
            for (const c of container.querySelectorAll('.framer-ij7w41-container')) {
                if (extractSlugFromHref(c.querySelector('a')?.getAttribute('href')) === post.slug) {
                    card = c;
                    break;
                }
            }
        }

        if (!card) {
            card = cloneRegularCard(post, sampleTemplate);
            card.setAttribute('data-animated', 'true');
            card.style.setProperty('--card-index', String(Math.min(i, 8)));
        } else {
            syncRegularCard(card, post);
        }

        if (loadMore) {
            container.insertBefore(card, loadMore);
        } else {
            container.appendChild(card);
        }
    }

    if (loadMore) {
        loadMore.style.display = 'none';
    }
}

/**
 * Initialises the /blog/ listing page:
 *   1. Fetches published posts.
 *   2. Partitions into featured and regular posts.
 *   3. Syncs both featured and regular grids.
 *   4. Attaches debounced MutationObserver.
 *   5. Attaches resize listener.
 */
export async function initBlogListing() {
    ensureBlogAnimationStyles();

    let posts = [];
    try {
        posts = await loadPublishedPosts();
    } catch {
        posts = await fetchPublishedPostsFromSupabase();
    }
    if (!posts || posts.length === 0) return;

    const featuredPosts  = selectFeaturedPosts(posts);
    const featuredSlugs  = new Set(featuredPosts.map(p => p.slug));
    const regularPosts   = selectRegularPosts(posts, featuredPosts);

    function syncFeatured() {
        const featGrid = document.querySelector('.framer-ugj76m, .framer-3lukgt');
        if (featGrid) syncFeaturedGrid(featGrid, featuredPosts);
    }

    function syncRegular() {
        const container = document.querySelector('.framer-18dht5n');
        if (!container) return false;

        let sample = window.__corabinSampleCard;
        if (!sample) {
            const existing = container.querySelector('.framer-ij7w41-container');
            if (existing) {
                sample = existing.cloneNode(true);
                window.__corabinSampleCard = sample;
            }
        }

        if (sample) {
            syncRegularListing(container, regularPosts, featuredSlugs, sample);
            return true;
        }
        return false;
    }

    function syncAll() {
        syncFeatured();
        syncRegular();
    }

    syncAll();

    if (typeof window !== 'undefined') {
        window.addEventListener('load', syncAll, { once: true });
        window.addEventListener('resize', () => {
            syncFeatured();
            document.querySelectorAll('.framer-ij7w41-container').forEach(syncCardResponsiveVariant);
        });
    }

    if (
        window.__corabinBlogObserver &&
        window.__corabinBlogObservedEl &&
        !document.body.contains(window.__corabinBlogObservedEl)
    ) {
        window.__corabinBlogObserver.disconnect();
        window.__corabinBlogObserver         = null;
        window.__corabinBlogObserverAttached = false;
    }

    const targetEl = document.getElementById('main') || document.body;
    if (targetEl && !window.__corabinBlogObserverAttached) {
        window.__corabinBlogObserverAttached = true;
        window.__corabinBlogObservedEl       = targetEl;

        let isSyncing     = false;
        let debounceTimer = null;

        const observer = new MutationObserver(() => {
            if (isSyncing) return;
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                if (isSyncing) return;
                isSyncing = true;
                try {
                    syncAll();
                } finally {
                    observer.takeRecords();
                    isSyncing = false;
                }
            }, 50);
        });

        observer.observe(targetEl, { childList: true, subtree: true });
        window.__corabinBlogObserver = observer;
    }
}
