/**
 * @module ui/components/hero
 * @description Article Hero component: updates article title, metadata, cover, author, date, and excerpt.
 */

import { resolveCloudinaryImageUrl, generateResponsiveSrcset } from '../../api/cloudinary.js';
import { formatArticleDate } from '../../utils/date.js';
import { safeSetText, safeSetAttr, updateMetaTag } from '../../utils/dom.js';
import { urlsMatch } from '../../utils/url.js';

const FALLBACK_COVER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1672 941'%3E%3Crect width='100%25' height='100%25' fill='%23111111'/%3E%3C/svg%3E";

/**
 * Binds article metadata and hero visual elements into the Framer article shell.
 *
 * @param {HTMLElement} root        - Article root element.
 * @param {Object}      post        - Supabase post object.
 * @param {string}      currentSlug - Active article slug.
 */
export function renderHero(root, post, currentSlug) {
    if (!root || !post) return;

    const activeTitle   = post.title || '';
    const activeDate    = post.published_at || post.date || '';
    const activeExcerpt = post.excerpt || post.meta_description || '';
    const activeImage   = post.cover_image || '';

    let activeAuthor = 'Souvik';
    if (post.author) {
        activeAuthor = typeof post.author === 'object'
            ? (post.author.name || 'Souvik')
            : String(post.author);
    }

    const resolvedCover  = resolveCloudinaryImageUrl(activeImage) || FALLBACK_COVER;
    const resolvedSrcset = activeImage ? generateResponsiveSrcset(activeImage) : '';
    const formattedDate  = formatArticleDate(activeDate);

    // 1. Document title and SEO / Social meta tags
    if (activeTitle) {
        const expectedTitle = activeTitle.includes('Corabin')
            ? activeTitle
            : `${activeTitle} — Corabin`;
        if (document.title !== expectedTitle) document.title = expectedTitle;
        updateMetaTag('meta[property="og:title"]',  'content', expectedTitle);
        updateMetaTag('meta[name="twitter:title"]', 'content', expectedTitle);
    }

    if (activeExcerpt) {
        updateMetaTag('meta[name="description"]',         'content', activeExcerpt);
        updateMetaTag('meta[property="og:description"]',  'content', activeExcerpt);
        updateMetaTag('meta[name="twitter:description"]', 'content', activeExcerpt);
    }

    if (resolvedCover) {
        updateMetaTag('meta[property="og:image"]',  'content', resolvedCover);
        updateMetaTag('meta[name="twitter:image"]', 'content', resolvedCover);
    }

    if (currentSlug) {
        const canonicalUrl = post.canonical_url || `https://corabin.com/blog/${currentSlug}`;
        updateMetaTag('meta[property="og:url"]', 'content', canonicalUrl);
        updateMetaTag('link[rel="canonical"]',   'href',    canonicalUrl);
    }

    // 2. Cover Image
    const coverImg =
        root.querySelector('#article-cover-img') ||
        root.querySelector('.framer-z182eh img') ||
        root.querySelector('[data-framer-name="Background Image"] img') ||
        root.querySelector('#hero [data-framer-name="Background Image"] img');

    if (coverImg && resolvedCover) {
        if (!urlsMatch(coverImg.getAttribute('src'), resolvedCover) && !urlsMatch(coverImg.src, resolvedCover)) {
            coverImg.src = resolvedCover;
        }

        if (resolvedSrcset) {
            safeSetAttr(coverImg, 'srcset', resolvedSrcset);
        } else {
            safeSetAttr(coverImg, 'srcset', null);
        }

        const expectedAlt = post.cover_image_alt || activeTitle;
        safeSetAttr(coverImg, 'alt', expectedAlt);
        safeSetAttr(coverImg, 'data-synced-cover', post.cover_image || 'true');

        if (coverImg.style.opacity !== '1') {
            coverImg.style.opacity = '1';
        }
    }

    // 3. Hero Title
    const titleEl = root.querySelector('#article-title') || root.querySelector('.framer-1ltkmql h1');
    safeSetText(titleEl, activeTitle);

    // 4. Author Name
    const authorEl =
        root.querySelector('#article-author') ||
        root.querySelector('.framer-y7unnl p') ||
        root.querySelector('[data-framer-name="Photo"] ~ div p');
    safeSetText(authorEl, activeAuthor);

    // 5. Author Avatar
    const authorAvatarImg = root.querySelector('[data-framer-name="Photo"] img');
    if (authorAvatarImg && post.author && typeof post.author === 'object' && post.author.avatar) {
        const avatarUrl = post.author.avatar;
        if (!urlsMatch(authorAvatarImg.getAttribute('src'), avatarUrl)) {
            authorAvatarImg.src = avatarUrl;
        }
    }

    // 6. Publication Date
    const timeEl = root.querySelector('#article-date') || root.querySelector('.framer-ybkmy time');
    if (timeEl && formattedDate) {
        if (activeDate) safeSetAttr(timeEl, 'datetime', activeDate);
        safeSetText(timeEl, formattedDate);
    } else {
        const datePEl = root.querySelector('.framer-ybkmy p');
        safeSetText(datePEl, formattedDate);
    }

    // 7. Excerpt / Subheading
    const excerptEl =
        root.querySelector('#article-excerpt') ||
        root.querySelector('.framer-1ig6rss h2') ||
        root.querySelector('#content h2.framer-text');
    safeSetText(excerptEl, activeExcerpt);
}
