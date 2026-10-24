/**
 * @module state/actions
 * @description State transition actions with in-memory caching and request deduplication.
 */

import { store } from './store.js';
import { SupabaseApi } from '../api/supabase.js';
import { selectFeaturedPosts, selectRegularPosts } from '../services/article-service.js';
import { ENV } from '../config/env.js';

let activeFetchPostsPromise = null;

/**
 * Loads published posts with in-memory cache and request deduplication.
 *
 * @param {boolean} [force=false] - If true, bypasses in-memory cache.
 * @returns {Promise<Array<Object>>}
 */
export async function loadPublishedPosts(force = false) {
    const state = store.getState();
    const now = Date.now();

    // Cache hit check
    if (!force && state.posts.list.length > 0 && (now - state.posts.lastFetched < ENV.CACHE_TTL_MS)) {
        return state.posts.list;
    }

    // Deduplicate in-flight requests
    if (activeFetchPostsPromise) {
        return activeFetchPostsPromise;
    }

    store.setState(prev => ({
        posts: { ...prev.posts, status: 'loading', error: null },
    }));

    activeFetchPostsPromise = (async () => {
        try {
            const posts = await SupabaseApi.getPublishedPosts();
            const bySlug = {};
            for (const p of posts) {
                if (p.slug) bySlug[p.slug] = p;
            }

            const featured = selectFeaturedPosts(posts, 3);
            const regular  = selectRegularPosts(posts, featured);

            store.setState(prev => ({
                posts: {
                    list: posts,
                    bySlug: { ...prev.posts.bySlug, ...bySlug },
                    featured,
                    regular,
                    status: 'success',
                    error: null,
                    lastFetched: Date.now(),
                },
            }));

            return posts;
        } catch (err) {
            store.setState(prev => ({
                posts: {
                    ...prev.posts,
                    status: 'error',
                    error: err.message || 'Failed to load posts',
                },
            }));
            return [];
        } finally {
            activeFetchPostsPromise = null;
        }
    })();

    return activeFetchPostsPromise;
}

/**
 * Loads an article by slug with state management and caching.
 *
 * @param {string} slug
 * @param {AbortSignal} [signal=null]
 * @returns {Promise<{ status: string, post?: Object, error?: string }>}
 */
export async function loadArticle(slug, signal = null) {
    if (!slug) {
        return { status: 'error', error: 'No slug provided' };
    }

    const state = store.getState();

    // Check if full article with content is already in memory cache
    const cached = state.posts.bySlug[slug];
    if (cached && cached.content) {
        store.setState({
            currentArticle: {
                slug,
                data: cached,
                status: 'success',
                error: null,
            },
        });
        return { status: 'success', post: cached, slug };
    }

    store.setState({
        currentArticle: {
            slug,
            data: cached || null, // Preserve metadata if partially present
            status: 'loading',
            error: null,
        },
    });

    const result = await SupabaseApi.getPostBySlug(slug, ENV.SUPABASE_ANON_KEY, signal);

    if (result.status === 'success' && result.post) {
        store.setState(prev => ({
            posts: {
                ...prev.posts,
                bySlug: {
                    ...prev.posts.bySlug,
                    [slug]: result.post,
                },
            },
            currentArticle: {
                slug,
                data: result.post,
                status: 'success',
                error: null,
            },
        }));
    } else if (result.status !== 'aborted') {
        store.setState({
            currentArticle: {
                slug,
                data: null,
                status: result.status,
                error: result.error || 'Article unavailable',
            },
        });
    }

    return result;
}

/**
 * Updates the active route metadata in the store.
 *
 * @param {string} pathname
 * @param {string|null} slug
 */
export function setRoute(pathname, slug = null) {
    let pageType = 'other';
    if (slug && slug !== 'blog' && slug !== 'index.html') {
        pageType = 'article';
    } else if (pathname === '/blog' || pathname === '/blog/' || pathname === '/blog/index.html') {
        pageType = 'listing';
    } else if (pathname === '/' || pathname === '/index.html' || pathname === '') {
        pageType = 'home';
    }

    store.setState({
        route: {
            pathname,
            slug,
            pageType,
        },
    });
}
