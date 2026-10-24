/**
 * @module ui/components/error-state
 * @description Renders a stylized, accessible fallback state when an article is not found or unavailable.
 */

import { updateMetaTag } from '../../utils/dom.js';

/**
 * Applies the unavailable view to the article root container.
 *
 * @param {HTMLElement} root
 * @param {string} [message]
 */
export function renderUnavailableState(root, message = 'The requested article is not currently published or does not exist.') {
    if (typeof document === 'undefined') return;

    document.title = 'Article Unavailable — Corabin';

    // Mark as noindex for search engines
    updateMetaTag('meta[name="robots"]',              'content', 'noindex, nofollow');
    updateMetaTag('meta[name="description"]',         'content', 'The requested article is not currently published or does not exist on Corabin.');
    updateMetaTag('meta[property="og:title"]',        'content', 'Article Unavailable — Corabin');
    updateMetaTag('meta[name="twitter:title"]',       'content', 'Article Unavailable — Corabin');
    updateMetaTag('meta[property="og:description"]',  'content', 'The requested article is not currently published or does not exist on Corabin.');

    document.querySelector('link[rel="canonical"]')?.remove();
    document.querySelector('meta[property="og:url"]')?.remove();

    if (!root) return;

    // Title
    const titleEl = root.querySelector('#article-title') || root.querySelector('.framer-1ltkmql h1');
    if (titleEl && titleEl.textContent !== 'Article Unavailable') {
        titleEl.textContent = 'Article Unavailable';
    }

    // Hide author & date block
    const authorWrapper = root.querySelector('.framer-16ganb5, [data-framer-name="Heading Wrapper"] .framer-16ganb5');
    if (authorWrapper && authorWrapper.style.display !== 'none') {
        authorWrapper.style.display = 'none';
    }

    // Hide cover image & hero background
    const coverWrapper = root.querySelector('.framer-z182eh, [data-framer-name="Background Image"]');
    if (coverWrapper && coverWrapper.style.display !== 'none') {
        coverWrapper.style.display = 'none';
    }
    const coverImg = root.querySelector('#article-cover-img');
    if (coverImg && coverImg.style.display !== 'none') {
        coverImg.style.display = 'none';
    }

    // Excerpt
    const excerptEl = root.querySelector('#article-excerpt') || root.querySelector('.framer-1ig6rss h2');
    if (excerptEl && excerptEl.textContent !== message) {
        excerptEl.textContent = message;
        excerptEl.style.color = 'rgba(0, 0, 0, 0.6)';
    }

    // Body CTA
    const bodyEl = root.querySelector('#article-body-content') || root.querySelector('.framer-1272rho');
    if (bodyEl && !bodyEl.getAttribute('data-unavailable-synced')) {
        bodyEl.innerHTML = `
            <div class="article-unavailable-container" style="text-align: center; padding: 48px 24px; font-family: Inter, sans-serif;">
                <p class="framer-text framer-styles-preset-1go6xkm" style="color: rgba(0, 0, 0, 0.6); max-width: 520px; margin: 0 auto 32px auto; font-size: 16px; line-height: 1.6;">
                    The article you are looking for may have been moved, unpublished, or the link may be outdated. You can explore all published insights and guides on our blog.
                </p>
                <a href="/blog/" class="article-unavailable-back-btn framer-styles-preset-1k8uo92" style="display: inline-flex; align-items: center; justify-content: center; padding: 14px 28px; background-color: var(--token-bb407a59-7892-4758-ae44-34831ff9d303, rgb(12, 18, 12)); color: #fff; border-radius: 120px; font-weight: 500; font-size: 15px; text-decoration: none; transition: opacity 0.2s ease;">
                    ← Return to all articles
                </a>
            </div>
        `;
        bodyEl.setAttribute('data-unavailable-synced', 'true');
    }
}
