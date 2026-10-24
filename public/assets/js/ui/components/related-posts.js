/**
 * @module ui/components/related-posts
 * @description Related Posts component: syncs recommendation cards at the bottom of article pages.
 */

import { syncFeaturedCard } from './card.js';
import { findRelatedPosts } from '../../services/article-service.js';
import { loadPublishedPosts } from '../../state/actions.js';

/**
 * Synchronises the related posts grid at the bottom of an article page.
 *
 * @param {string} currentSlug     - Active article slug.
 * @param {string} currentCategory - Active article category.
 */
export async function renderRelatedPosts(currentSlug, currentCategory = '') {
    if (!currentSlug || currentSlug === 'blog' || currentSlug === 'index.html') return;

    const gridEl =
        document.querySelector('.framer-k7mcxy .framer-3lukgt') ||
        document.querySelector('#main .framer-3lukgt') ||
        document.querySelector('[data-framer-name="Blog"] .framer-3lukgt') ||
        document.querySelector('.framer-k7mcxy');

    if (!gridEl) return;

    const allPosts = await loadPublishedPosts();
    if (!Array.isArray(allPosts) || allPosts.length === 0) return;

    const relatedPosts = findRelatedPosts(currentSlug, currentCategory, allPosts, 3);
    if (relatedPosts.length === 0) return;

    const [p1, p2, p3] = relatedPosts;
    const targetGrid = gridEl.classList.contains('framer-3lukgt')
        ? gridEl
        : (gridEl.querySelector('.framer-3lukgt') || gridEl);

    // Desktop hero card
    const desktopHero =
        targetGrid.querySelector('.framer-1tq2jgu a[data-framer-name="Desktop"]') ||
        targetGrid.querySelector('.framer-1tq2jgu .ssr-variant:not(.hidden-72rtr7) a.framer-7Bi9P') ||
        targetGrid.querySelector('.framer-1tq2jgu a.framer-7Bi9P');
    if (desktopHero && p1) syncFeaturedCard(desktopHero, p1, { isHero: true, index: 0 });

    // Desktop side cards
    const desktopSideCards = targetGrid.querySelectorAll('.framer-v3he4g a.framer-7Bi9P');
    if (desktopSideCards[0] && p2) syncFeaturedCard(desktopSideCards[0], p2, { isHero: false, index: 1 });
    if (desktopSideCards[1] && p3) syncFeaturedCard(desktopSideCards[1], p3, { isHero: false, index: 2 });

    // Mobile cards
    const mobileCards = targetGrid.querySelectorAll(
        '.framer-1tq2jgu a[data-framer-name="Mobile"], .framer-1tq2jgu .ssr-variant.hidden-72rtr7 a.framer-7Bi9P'
    );
    if (mobileCards[0] && p1) syncFeaturedCard(mobileCards[0], p1, { isHero: true, index: 0 });
    if (mobileCards[1] && p2) syncFeaturedCard(mobileCards[1], p2, { isHero: false, index: 1 });
    if (mobileCards[2] && p3) syncFeaturedCard(mobileCards[2], p3, { isHero: false, index: 2 });
}
