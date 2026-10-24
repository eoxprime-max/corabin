/**
 * @module ui/components/card
 * @description Unified card component for synchronising and cloning Framer blog post cards.
 * Supports featured card anchors and regular card containers with change-detected DOM writes.
 */

import { resolveCloudinaryImageUrl, generateResponsiveSrcset } from '../../api/cloudinary.js';
import { formatArticleDate } from '../../utils/date.js';
import { safeSetText, safeSetAttr } from '../../utils/dom.js';
import { urlsMatch } from '../../utils/url.js';
import { attachCardHoverHandlers } from '../animations/card-effects.js';
export { attachCardHoverHandlers };

const FALLBACK_COVER = 'https://res.cloudinary.com/teolzwgc/image/upload/f_auto,q_auto/corabin/blog-covers/custom-vs-off-the-shelf-choose-wisely-edb0902a';

/**
 * Synchronises a featured card anchor (`a.framer-7Bi9P`) with post data.
 *
 * @param {HTMLElement|null} cardEl
 * @param {Object}           post
 * @param {object}           [options]
 * @param {boolean}          [options.isHero]
 * @param {number}           [options.index]
 */
export function syncFeaturedCard(cardEl, post, options = {}) {
    if (!cardEl || !post) return;

    safeSetAttr(cardEl, 'data-post-slug', post.slug);
    safeSetAttr(cardEl, 'href', `/blog/${post.slug}/`);

    // Title
    const titleEl =
        cardEl.querySelector('.framer-giavb9 p') ||
        cardEl.querySelector('[data-framer-name*="Title"] p') ||
        cardEl.querySelector('.framer-giavb9');
    safeSetText(titleEl, post.title);

    // Date
    const formattedDate = formatArticleDate(post.published_at);
    const dateEl =
        cardEl.querySelector('.framer-gifdkw p') ||
        cardEl.querySelector('[data-framer-name*="Date"] p') ||
        cardEl.querySelector('.framer-gifdkw');
    safeSetText(dateEl, formattedDate);

    // Cover Image
    const img = cardEl.querySelector('img');
    if (img) {
        const isHero = options.isHero ?? (options.index === 0);

        if (isHero) {
            safeSetAttr(img, 'loading', 'eager');
            safeSetAttr(img, 'fetchpriority', 'high');
        } else {
            safeSetAttr(img, 'loading', 'lazy');
            safeSetAttr(img, 'fetchpriority', null);
        }
        safeSetAttr(img, 'decoding', 'async');

        const coverUrl = resolveCloudinaryImageUrl(post.cover_image) || FALLBACK_COVER;
        if (!urlsMatch(img.getAttribute('src'), coverUrl)) {
            img.src = coverUrl;
        }

        const altText = post.cover_image_alt || post.title || '';
        safeSetAttr(img, 'alt', altText);

        const srcset = generateResponsiveSrcset(post.cover_image);
        if (srcset) {
            safeSetAttr(img, 'srcset', srcset);
        } else {
            safeSetAttr(img, 'srcset', null);
        }
    }

    attachCardHoverHandlers(cardEl);
}

/**
 * Synchronises responsive breakpoint classes for a regular card based on viewport width.
 *
 * @param {HTMLElement} cardEl
 */
export function syncCardResponsiveVariant(cardEl) {
    if (!cardEl || typeof window === 'undefined') return;
    const link = cardEl.querySelector('a');
    if (!link) return;

    const w = window.innerWidth;
    const isMobile = w <= 809;
    const isTablet = w > 809 && w <= 1199;

    link.classList.remove('framer-v-6b3n5n', 'framer-v-1ejbd52', 'framer-v-gaszep');

    if (isMobile) {
        link.classList.add('framer-v-gaszep');
        safeSetAttr(link, 'data-framer-name', 'Mobile');
    } else if (isTablet) {
        link.classList.add('framer-v-1ejbd52');
        safeSetAttr(link, 'data-framer-name', 'Tablet');
    } else {
        link.classList.add('framer-v-6b3n5n');
        safeSetAttr(link, 'data-framer-name', 'Desktop Wide');
    }
}

/**
 * Synchronises a regular blog post card (`.framer-ij7w41-container`) with post data.
 *
 * @param {HTMLElement|null} cardEl
 * @param {Object}           post
 */
export function syncRegularCard(cardEl, post) {
    if (!cardEl || !post) return;

    safeSetAttr(cardEl, 'data-post-slug', post.slug);
    safeSetAttr(cardEl, 'data-dynamic-post', 'true');

    // Anchor link
    const link = cardEl.querySelector('a');
    if (link) {
        safeSetAttr(link, 'href', `/blog/${post.slug}/`);
        safeSetAttr(link, 'data-framer-page-link-current', null);
        attachCardHoverHandlers(link);
    }

    // Cover Image
    const img = cardEl.querySelector('.framer-1462w5l img') || cardEl.querySelector('img');
    if (img) {
        const coverUrl = resolveCloudinaryImageUrl(post.cover_image) || FALLBACK_COVER;
        if (!urlsMatch(img.getAttribute('src'), coverUrl)) {
            img.src = coverUrl;
        }

        const altText = post.cover_image_alt || post.title || '';
        safeSetAttr(img, 'alt', altText);

        const srcset = generateResponsiveSrcset(post.cover_image);
        if (srcset) {
            safeSetAttr(img, 'srcset', srcset);
        } else {
            safeSetAttr(img, 'srcset', null);
        }

        safeSetAttr(img, 'loading', 'lazy');
        safeSetAttr(img, 'decoding', 'async');
    }

    // Publication date
    const formattedDate = formatArticleDate(post.published_at);
    const dateP =
        cardEl.querySelector('.framer-ie051f p') ||
        cardEl.querySelector('[data-framer-name*="Dec"], [data-framer-name*="Jan"], [data-framer-name*="Date"]') ||
        cardEl.querySelector('.framer-1m2k1ez p');
    safeSetText(dateP, formattedDate);

    // Title
    const titleP =
        cardEl.querySelector('.framer-1pz7yr3 p') ||
        cardEl.querySelector('[data-framer-name="Title"] p') ||
        cardEl.querySelector('.framer-1pz7yr3');
    safeSetText(titleP, post.title);

    syncCardResponsiveVariant(cardEl);
}

/**
 * Creates a new regular card by deep-cloning a template card node.
 *
 * @param {Object}      post
 * @param {HTMLElement} sampleCard
 * @returns {HTMLElement}
 */
export function cloneRegularCard(post, sampleCard) {
    const clone = sampleCard.cloneNode(true);
    syncRegularCard(clone, post);
    return clone;
}
