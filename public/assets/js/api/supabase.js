/**
 * @module api/supabase
 * @description Supabase REST client for querying published posts with error classification and timeout protection.
 *
 * Security Model:
 *   - Uses only the public publishable anon key — never a service role key.
 *   - Enforces status=eq.published on all queries.
 *   - Read-only: no mutations performed from client code.
 */

import { ENV } from '../config/env.js';
import { COLUMNS } from '../config/selectors.js';
import { HttpClient } from './client.js';
import { logger } from '../utils/logger.js';

/**
 * Builds standard Supabase request headers.
 *
 * @param {string} anonKey
 * @returns {Record<string, string>}
 */
function buildSupabaseHeaders(anonKey) {
    return {
        'apikey':        anonKey,
        'Authorization': `Bearer ${anonKey}`,
        'Accept':        'application/json',
    };
}

export class SupabaseApi {
    /**
     * Fetches a single published post matching the provided slug.
     *
     * @param {string} slug
     * @param {string} [anonKey=ENV.SUPABASE_ANON_KEY]
     * @param {AbortSignal} [signal=null]
     * @returns {Promise<{ status: 'success'|'not_found'|'error'|'aborted'|'pending_connection', post?: Object, error?: string, slug: string }>}
     */
    static async getPostBySlug(slug, anonKey = ENV.SUPABASE_ANON_KEY, signal = null) {
        if (!anonKey) {
            return {
                status:     'pending_connection',
                error:      'Supabase client anon key is not configured in client runtime. Querying public.posts is paused.',
                slug,
            };
        }

        const endpoint = `${ENV.SUPABASE_URL}/rest/v1/posts?slug=eq.${encodeURIComponent(slug)}&status=eq.published&select=${COLUMNS.ARTICLE}`;
        const res = await HttpClient.get(endpoint, {
            headers: buildSupabaseHeaders(anonKey),
            signal,
            timeout: ENV.HTTP_TIMEOUT_MS,
        });

        if (res.aborted) {
            return { status: 'aborted', slug };
        }

        if (!res.ok) {
            return {
                status: 'error',
                error:  res.error || `Supabase query failed with status ${res.status}`,
                slug,
            };
        }

        const posts = res.data;
        if (!Array.isArray(posts) || posts.length === 0) {
            return {
                status: 'not_found',
                error:  `No published post found matching slug "${slug}" in Supabase public.posts table.`,
                slug,
            };
        }

        return {
            status: 'success',
            post:   posts[0],
            slug,
        };
    }

    /**
     * Fetches all published posts ordered by published_at descending.
     *
     * @param {string} [anonKey=ENV.SUPABASE_ANON_KEY]
     * @param {AbortSignal} [signal=null]
     * @returns {Promise<Array<Object>>}
     */
    static async getPublishedPosts(anonKey = ENV.SUPABASE_ANON_KEY, signal = null) {
        if (!anonKey) return [];

        const endpoint = `${ENV.SUPABASE_URL}/rest/v1/posts?status=eq.published&select=${COLUMNS.LISTING}&order=published_at.desc`;
        const res = await HttpClient.get(endpoint, {
            headers: buildSupabaseHeaders(anonKey),
            signal,
            timeout: ENV.HTTP_TIMEOUT_MS,
        });

        if (!res.ok || !Array.isArray(res.data)) {
            logger.warn('Failed to retrieve published posts:', res.error);
            return [];
        }

        return res.data;
    }
}

// ---------------------------------------------------------------------------
// Functional compatibility exports
// ---------------------------------------------------------------------------

export async function fetchPostFromSupabase(slug, anonKey = ENV.SUPABASE_ANON_KEY, signal = null) {
    return SupabaseApi.getPostBySlug(slug, anonKey, signal);
}

export async function fetchPublishedPostsFromSupabase(anonKey = ENV.SUPABASE_ANON_KEY) {
    return SupabaseApi.getPublishedPosts(anonKey);
}
