/**
 * @module ui/components/body
 * @description Article Body component: renders rich article content with change detection.
 */

import { parseArticleContent } from '../../services/markdown.js';
import { safeSetAttr } from '../../utils/dom.js';

/**
 * Binds parsed content into the article body element.
 *
 * @param {HTMLElement} root - Article root container.
 * @param {Object}      post - Supabase post object.
 */
export function renderBody(root, post) {
    if (!root || !post || !post.content) return;

    const bodyEl =
        root.querySelector('#article-body-content') ||
        root.querySelector('.framer-1272rho') ||
        root.querySelector('#content .framer-1272rho');

    if (!bodyEl) return;

    const syncKey = (post.updated_at || post.published_at || 'v1') + '_' + post.content.length;

    if (bodyEl.getAttribute('data-supabase-synced') !== syncKey) {
        const parsedHtml = parseArticleContent(post.content);
        if (bodyEl.innerHTML !== parsedHtml) {
            bodyEl.innerHTML = parsedHtml;
        }
        safeSetAttr(bodyEl, 'data-supabase-synced', syncKey);
        safeSetAttr(bodyEl, 'data-pre-rendered', 'true');
    }
}
