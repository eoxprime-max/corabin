/**
 * @module ui/components/share
 * @description Social sharing links component: updates Twitter/X, LinkedIn, and Facebook links.
 */

import { buildShareUrls } from '../../utils/url.js';
import { safeSetAttr } from '../../utils/dom.js';

/**
 * Updates social sharing anchors within the article root.
 *
 * @param {HTMLElement} root
 * @param {Object}      post
 * @param {string}      currentSlug
 */
export function renderShareLinks(root, post, currentSlug) {
    if (!root || !post || !currentSlug) return;

    const articleUrl = `https://corabin.com/blog/${currentSlug}`;
    const shareUrls = buildShareUrls(articleUrl, post.title || '');

    const fbShare = root.querySelector('a[aria-label="Share on Facebook"]');
    if (fbShare) {
        safeSetAttr(fbShare, 'href', shareUrls.facebook);
        safeSetAttr(fbShare, 'target', '_blank');
        safeSetAttr(fbShare, 'rel', 'noopener noreferrer');
    }

    const xShare = root.querySelector('a[aria-label="Share on X"]');
    if (xShare) {
        safeSetAttr(xShare, 'href', shareUrls.twitter);
        safeSetAttr(xShare, 'target', '_blank');
        safeSetAttr(xShare, 'rel', 'noopener noreferrer');
    }

    const liShare = root.querySelector('a[aria-label="Share on LinkedIn"]');
    if (liShare) {
        safeSetAttr(liShare, 'href', shareUrls.linkedin);
        safeSetAttr(liShare, 'target', '_blank');
        safeSetAttr(liShare, 'rel', 'noopener noreferrer');
    }
}
