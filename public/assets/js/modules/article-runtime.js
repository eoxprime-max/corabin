/**
 * @module modules/article-runtime
 * @description Stateful runtime for the shared Framer blog article template.
 * Coordinates data fetching, state management, and component hydration.
 */

import { ARTICLE_ROOT_SELECTOR } from './config.js';
import { resolveCurrentSlug } from '../utils/url.js';
import { renderHero } from '../ui/components/hero.js';
import { renderBody } from '../ui/components/body.js';
import { renderShareLinks } from '../ui/components/share.js';
import { renderRelatedPosts } from '../ui/components/related-posts.js';
import { renderUnavailableState as renderUnavailableUi } from '../ui/components/error-state.js';
import { loadArticle, loadPublishedPosts } from '../state/actions.js';
import { store } from '../state/store.js';

let activeArticleSlug = null;
let activeArticleRequestToken = 0;
let activeArticleAbortController = null;
let articleTimers = [];
let isApplyingArticleData = false;
let articleObserver = null;
let articleDebounceTimer = null;

/**
 * Tears down all active timers, observers, and state from an article session.
 */
export function cleanupArticleRuntime() {
    if (activeArticleAbortController) {
        try { activeArticleAbortController.abort(); } catch { /* ignore */ }
        activeArticleAbortController = null;
    }
    if (articleObserver) {
        articleObserver.disconnect();
        articleObserver = null;
    }
    if (articleTimers.length > 0) {
        articleTimers.forEach(id => clearTimeout(id));
        articleTimers = [];
    }
    if (articleDebounceTimer) {
        clearTimeout(articleDebounceTimer);
        articleDebounceTimer = null;
    }

    store.resetCurrentArticle();
    window.__corabinLivePost = null;
    window.__corabinUnavailableObserverAttached = false;
    activeArticleSlug = null;
}

/**
 * Applies article data to the DOM using modular presenters with change detection.
 *
 * @param {Object} post
 * @param {number} [token]
 */
export function applyArticleData(post, token = undefined) {
    if (!post || isApplyingArticleData) return;

    const currentSlug = resolveCurrentSlug();
    if (!currentSlug || currentSlug !== post.slug) return;
    if (token !== undefined && token !== activeArticleRequestToken) return;

    const root = document.querySelector(ARTICLE_ROOT_SELECTOR);
    if (!root) return;

    isApplyingArticleData = true;

    try {
        renderHero(root, post, currentSlug);
        renderBody(root, post);
        renderShareLinks(root, post, currentSlug);
        activeArticleSlug = post.slug;
    } finally {
        if (articleObserver) {
            articleObserver.takeRecords();
        }
        isApplyingArticleData = false;
    }
}

/**
 * Public facade to sync related posts for backward compatibility.
 *
 * @param {string} currentSlug
 */
export async function syncArticleRelatedPosts(currentSlug) {
    const post = store.getState().currentArticle.data || window.__corabinLivePost;
    const category = post?.category || '';
    return renderRelatedPosts(currentSlug, category);
}

/**
 * Renders an unavailable error view.
 *
 * @param {string} [message]
 */
export function renderUnavailableState(message = 'The requested article is not currently published or does not exist.') {
    cleanupArticleRuntime();

    const applyUnavailable = () => {
        const root = document.querySelector(ARTICLE_ROOT_SELECTOR);
        if (root) {
            renderUnavailableUi(root, message);
        }
    };

    applyUnavailable();

    const root = document.querySelector(ARTICLE_ROOT_SELECTOR);
    if (root && !window.__corabinUnavailableObserverAttached) {
        window.__corabinUnavailableObserverAttached = true;
        const unavailObserver = new MutationObserver(() => {
            applyUnavailable();
        });
        unavailObserver.observe(root, { childList: true, subtree: true });

        [50, 150, 300, 600, 1000, 1500, 2000, 3000].forEach(delay => {
            const tid = setTimeout(applyUnavailable, delay);
            articleTimers.push(tid);
        });
    }
}

/**
 * Main initialiser for the shared blog article page.
 */
export async function initSharedBlogArticle() {
    const slug = resolveCurrentSlug();
    if (!slug || slug === 'blog' || slug === 'index.html') {
        renderUnavailableState('Please select an article from our blog.');
        return;
    }

    const requestToken = ++activeArticleRequestToken;

    if (activeArticleAbortController) {
        try { activeArticleAbortController.abort(); } catch { /* ignore */ }
    }
    activeArticleAbortController = new AbortController();

    articleTimers.forEach(id => clearTimeout(id));
    articleTimers = [];

    const root = document.querySelector(ARTICLE_ROOT_SELECTOR);
    if (!root) {
        const retryTimer = setTimeout(() => {
            if (activeArticleRequestToken === requestToken && resolveCurrentSlug() === slug) {
                initSharedBlogArticle();
            }
        }, 50);
        articleTimers.push(retryTimer);
        return;
    }

    // Loading skeleton if navigating to a new article
    if (activeArticleSlug !== slug) {
        const titleEl   = root.querySelector('#article-title')   || root.querySelector('.framer-1ltkmql h1');
        const coverEl   = root.querySelector('#article-cover-img');
        const excerptEl = root.querySelector('#article-excerpt') || root.querySelector('.framer-1ig6rss h2');
        const bodyEl    = root.querySelector('#article-body-content') || root.querySelector('.framer-1272rho');

        if (window.__PRELOADED_BLOG_POST__?.slug === slug) {
            applyArticleData(window.__PRELOADED_BLOG_POST__, requestToken);
            syncArticleRelatedPosts(slug);
        } else {
            const LOADING_COVER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1672 941'%3E%3Crect width='100%25' height='100%25' fill='%23111111'/%3E%3C/svg%3E";
            if (titleEl)   titleEl.innerHTML = '&nbsp;';
            if (coverEl)   {
                coverEl.removeAttribute('srcset');
                coverEl.src = LOADING_COVER;
                coverEl.alt = 'Loading article...';
                coverEl.removeAttribute('data-synced-cover');
                coverEl.style.opacity = '1';
            }
            if (excerptEl) excerptEl.textContent = '';
            if (bodyEl && !bodyEl.querySelector('#article-loading')) {
                bodyEl.innerHTML = '<div id="article-loading" style="padding: 40px 0; text-align: center; color: #888;">Loading article...</div>';
            }
        }
    }

    // Fetch post and warm up published posts cache in parallel
    const [supabaseResult] = await Promise.all([
        loadArticle(slug, activeArticleAbortController.signal),
        loadPublishedPosts(),
    ]);

    if (requestToken !== activeArticleRequestToken) return;
    if (resolveCurrentSlug()  !== slug)             return;
    if (supabaseResult.status === 'aborted')        return;

    if (supabaseResult.status === 'success' && supabaseResult.post) {
        const post = supabaseResult.post;

        if (post.status !== 'published') {
            renderUnavailableState();
            return;
        }

        window.__corabinLivePost = post;
        applyArticleData(post, requestToken);
        syncArticleRelatedPosts(slug);

        if (articleObserver) {
            articleObserver.disconnect();
            articleObserver = null;
        }

        const observer = new MutationObserver(() => {
            if (isApplyingArticleData) return;
            clearTimeout(articleDebounceTimer);
            articleDebounceTimer = setTimeout(() => {
                if (window.__corabinLivePost && resolveCurrentSlug() === slug && requestToken === activeArticleRequestToken) {
                    applyArticleData(window.__corabinLivePost, requestToken);
                    syncArticleRelatedPosts(slug);
                }
            }, 50);
        });
        articleObserver = observer;

        const currentRoot = document.querySelector(ARTICLE_ROOT_SELECTOR);
        if (currentRoot) {
            observer.observe(currentRoot, {
                childList:       true,
                subtree:         true,
                attributes:      true,
                attributeFilter: ['src', 'srcset'],
            });
        }

        [50, 150, 300, 600, 1000, 1500, 2500].forEach(delay => {
            const tid = setTimeout(() => {
                if (window.__corabinLivePost && resolveCurrentSlug() === slug && requestToken === activeArticleRequestToken) {
                    applyArticleData(window.__corabinLivePost, requestToken);
                    syncArticleRelatedPosts(slug);
                }
            }, delay);
            articleTimers.push(tid);
        });

        const lateCheckTimer = setTimeout(() => {
            if (resolveCurrentSlug() === slug && requestToken === activeArticleRequestToken) {
                const headingWrapper = document.querySelector('.framer-1ekua6s');
                if (headingWrapper && parseFloat(window.getComputedStyle(headingWrapper).opacity) < 0.05) {
                    headingWrapper.style.opacity   = '1';
                    headingWrapper.style.transform = 'none';
                }
                const coverWrapper = document.querySelector('.framer-z182eh');
                if (coverWrapper && parseFloat(window.getComputedStyle(coverWrapper).opacity) < 0.05) {
                    coverWrapper.style.opacity   = '0.7';
                    coverWrapper.style.transform = 'none';
                }
            }
        }, 2000);
        articleTimers.push(lateCheckTimer);

    } else {
        if (
            window.__PRELOADED_BLOG_POST__?.slug === slug &&
            supabaseResult.status !== 'not_found'
        ) {
            window.__corabinLivePost = window.__PRELOADED_BLOG_POST__;
            applyArticleData(window.__PRELOADED_BLOG_POST__, requestToken);
            syncArticleRelatedPosts(slug);
            return;
        }

        renderUnavailableState(
            supabaseResult.status === 'not_found'
                ? 'The requested article is not currently published or does not exist.'
                : 'Unable to load article content at this time. Please check your connection or return to the blog.'
        );
    }
}
