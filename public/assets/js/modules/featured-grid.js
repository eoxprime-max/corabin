/**
 * @module modules/featured-grid
 * @description Synchronises Framer featured card grids with live Supabase post data.
 * Covers both the /blog/ listing page and Homepage insights section.
 */

import { syncFeaturedCard, attachCardHoverHandlers } from '../ui/components/card.js';
import { selectFeaturedPosts } from '../services/article-service.js';
import { loadPublishedPosts } from '../state/actions.js';
import { fetchPublishedPostsFromSupabase } from '../api/supabase.js';

export { selectFeaturedPosts, attachCardHoverHandlers, syncFeaturedCard };

/**
 * Synchronises a featured posts grid element with up to 3 featured posts.
 * Handles hydrated listing grid (.framer-ugj76m) and pre-hydration SSR grid (.framer-3lukgt).
 *
 * @param {HTMLElement|null}  gridEl
 * @param {Array<Object>}     featuredPosts
 */
export function syncFeaturedGrid(gridEl, featuredPosts) {
    if (!gridEl) return;

    const posts = featuredPosts || [];

    if (posts.length === 0) {
        gridEl.style.display = 'none';
        return;
    }
    gridEl.style.display = '';

    const [p1, p2, p3] = posts;

    const setVisible = (el, show) => {
        if (el) el.style.display = show ? '' : 'none';
    };

    // Variant 1: Hydrated /blog/ listing grid (.framer-ugj76m)
    if (gridEl.classList.contains('framer-ugj76m')) {
        const fbCards = gridEl.querySelectorAll('.framer-fb3t1t .framer-b3is9r-container');

        if (fbCards.length >= 3) {
            syncFeaturedCard(fbCards[0].querySelector('a.framer-7Bi9P'), p1, { isHero: true, index: 0 });
            setVisible(fbCards[0], Boolean(p1));

            if (p2) {
                syncFeaturedCard(fbCards[1].querySelector('a.framer-7Bi9P'), p2, { isHero: false, index: 1 });
                setVisible(fbCards[1], true);
            } else {
                setVisible(fbCards[1], false);
            }

            if (p3) {
                syncFeaturedCard(fbCards[2].querySelector('a.framer-7Bi9P'), p3, { isHero: false, index: 2 });
                setVisible(fbCards[2], true);
            } else {
                setVisible(fbCards[2], false);
            }
        } else if (fbCards.length >= 1) {
            syncFeaturedCard(fbCards[0].querySelector('a.framer-7Bi9P'), p1, { isHero: true, index: 0 });
            setVisible(fbCards[0], Boolean(p1));
        }

        const sideCol        = gridEl.querySelector('.framer-1jilkk2');
        const sideContainers = gridEl.querySelectorAll('.framer-1jilkk2 .framer-hww4bo-container');
        if (sideCol) {
            if (!p2 && !p3) {
                sideCol.style.display = 'none';
            } else {
                sideCol.style.display = '';
                if (sideContainers[0]) {
                    if (p2) {
                        syncFeaturedCard(sideContainers[0].querySelector('a.framer-7Bi9P'), p2, { isHero: false, index: 1 });
                        setVisible(sideContainers[0], true);
                    } else {
                        setVisible(sideContainers[0], false);
                    }
                }
                if (sideContainers[1]) {
                    if (p3) {
                        syncFeaturedCard(sideContainers[1].querySelector('a.framer-7Bi9P'), p3, { isHero: false, index: 2 });
                        setVisible(sideContainers[1], true);
                    } else {
                        setVisible(sideContainers[1], false);
                    }
                }
            }
        }
        return;
    }

    // Variant 2: Pre-hydration SSR grid (.framer-3lukgt)
    if (gridEl.classList.contains('framer-3lukgt')) {
        const tqCards = gridEl.querySelectorAll('.framer-1tq2jgu a.framer-7Bi9P');

        if (tqCards.length === 1) {
            syncFeaturedCard(tqCards[0], p1, { isHero: true, index: 0 });
        } else if (tqCards.length === 3) {
            syncFeaturedCard(tqCards[0], p1, { isHero: true, index: 0 });
            setVisible(tqCards[0], Boolean(p1));

            if (p2) { syncFeaturedCard(tqCards[1], p2, { isHero: false, index: 1 }); setVisible(tqCards[1], true); }
            else     { setVisible(tqCards[1], false); }

            if (p3) { syncFeaturedCard(tqCards[2], p3, { isHero: false, index: 2 }); setVisible(tqCards[2], true); }
            else     { setVisible(tqCards[2], false); }
        } else if (tqCards.length > 3) {
            const d1 = gridEl.querySelector('.framer-1tq2jgu .ssr-variant:not(.hidden-72rtr7) a.framer-7Bi9P');
            if (d1) syncFeaturedCard(d1, p1, { isHero: true, index: 0 });

            const mCards = gridEl.querySelectorAll('.framer-1tq2jgu .ssr-variant.hidden-72rtr7 a.framer-7Bi9P');
            if (mCards[0]) syncFeaturedCard(mCards[0], p1, { isHero: true, index: 0 });
            if (mCards[1]) {
                if (p2) {
                    syncFeaturedCard(mCards[1], p2, { isHero: false, index: 1 });
                    setVisible(mCards[1].closest('.framer-1o9a060-container, .ssr-variant'), true);
                } else {
                    setVisible(mCards[1].closest('.framer-1o9a060-container, .ssr-variant'), false);
                }
            }
            if (mCards[2]) {
                if (p3) {
                    syncFeaturedCard(mCards[2], p3, { isHero: false, index: 2 });
                    setVisible(mCards[2].closest('.framer-1o9a060-container, .ssr-variant'), true);
                } else {
                    setVisible(mCards[2].closest('.framer-1o9a060-container, .ssr-variant'), false);
                }
            }
        }

        const v3Col   = gridEl.querySelector('.framer-v3he4g');
        const v3Cards = gridEl.querySelectorAll('.framer-v3he4g a.framer-7Bi9P');
        if (v3Col) {
            if (!p2 && !p3) {
                v3Col.style.display = 'none';
            } else {
                v3Col.style.display = '';
                if (v3Cards[0]) {
                    if (p2) {
                        syncFeaturedCard(v3Cards[0], p2, { isHero: false, index: 1 });
                        setVisible(v3Cards[0].closest('.framer-1jrilsq-container, .ssr-variant, div'), true);
                    } else {
                        setVisible(v3Cards[0].closest('.framer-1jrilsq-container, .ssr-variant, div'), false);
                    }
                }
                if (v3Cards[1]) {
                    if (p3) {
                        syncFeaturedCard(v3Cards[1], p3, { isHero: false, index: 2 });
                        setVisible(v3Cards[1].closest('.framer-1jrilsq-container, .ssr-variant, div'), true);
                    } else {
                        setVisible(v3Cards[1].closest('.framer-1jrilsq-container, .ssr-variant, div'), false);
                    }
                }
            }
        }
        return;
    }

    // Variant 3: Generic fallback
    const allCards = Array.from(gridEl.querySelectorAll('a.framer-7Bi9P'));
    if (allCards[0] && p1) syncFeaturedCard(allCards[0], p1, { isHero: true, index: 0 });
    if (allCards[1]) {
        if (p2) { syncFeaturedCard(allCards[1], p2, { isHero: false, index: 1 }); allCards[1].style.display = ''; }
        else    { allCards[1].style.display = 'none'; }
    }
    if (allCards[2]) {
        if (p3) { syncFeaturedCard(allCards[2], p3, { isHero: false, index: 2 }); allCards[2].style.display = ''; }
        else    { allCards[2].style.display = 'none'; }
    }
}

/**
 * Initialises and continuously synchronises the homepage Insights featured section.
 */
export async function initHomepageFeatured() {
    let posts = [];
    try {
        posts = await loadPublishedPosts();
    } catch {
        posts = await fetchPublishedPostsFromSupabase();
    }
    if (!posts || posts.length === 0) return;

    const featuredPosts = selectFeaturedPosts(posts);

    function doSync() {
        const grid = document.querySelector(
            '.framer-k7mcxy .framer-3lukgt, .framer-k7mcxy [data-framer-name="Grid"], .framer-3lukgt, .framer-ugj76m'
        );
        if (grid) syncFeaturedGrid(grid, featuredPosts);
    }

    doSync();

    // Clean up stale observer if navigation occurred
    if (
        window.__corabinHomeObserver &&
        window.__corabinHomeObservedEl &&
        !document.body.contains(window.__corabinHomeObservedEl)
    ) {
        window.__corabinHomeObserver.disconnect();
        window.__corabinHomeObserver         = null;
        window.__corabinHomeObserverAttached = false;
    }

    const targetSection =
        document.querySelector('.framer-k7mcxy, #insights, .framer-3lukgt') ||
        document.getElementById('main') ||
        document.body;

    if (targetSection && !window.__corabinHomeObserverAttached) {
        window.__corabinHomeObserverAttached = true;
        window.__corabinHomeObservedEl       = targetSection;

        let isSyncing    = false;
        let debounceTimer = null;

        const observer = new MutationObserver(() => {
            if (isSyncing) return;
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                if (isSyncing) return;
                isSyncing = true;
                try {
                    doSync();
                } finally {
                    observer.takeRecords();
                    isSyncing = false;
                }
            }, 60);
        });

        observer.observe(targetSection, { childList: true, subtree: true });
        window.__corabinHomeObserver = observer;
    }

    window.addEventListener('resize', doSync);
}
