/**
 * @module config/env
 * @description Centralized environment configuration for Corabin web services.
 *
 * Supports configuration overrides via:
 * 1. Global window.__CORABIN_ENV__ object
 * 2. Dedicated window global overrides (window.__CORABIN_SUPABASE_URL__, etc.)
 * 3. Browser localStorage for developer testing without editing source files
 */

const getWindow = () => (typeof window !== 'undefined' ? window : {});

const envGlobal = getWindow().__CORABIN_ENV__ || {};

/**
 * Validates and exposes environment runtime settings.
 */
export const ENV = {
    /** Supabase REST API endpoint */
    SUPABASE_URL:
        envGlobal.SUPABASE_URL ||
        getWindow().__CORABIN_SUPABASE_URL__ ||
        'https://oplfhsqycxroqyrdruej.supabase.co',

    /**
     * Supabase public publishable anon key.
     * Safe to expose in client code; protected by Supabase Row Level Security.
     */
    SUPABASE_ANON_KEY:
        envGlobal.SUPABASE_ANON_KEY ||
        getWindow().__CORABIN_SUPABASE_ANON_KEY__ ||
        getWindow().localStorage?.getItem('corabin_supabase_anon_key') ||
        'sb_publishable_c2_9jMvBS9iNxTqX9eyj2Q_oG0t2oVl',

    /** Cloudinary cloud account name */
    CLOUDINARY_CLOUD_NAME:
        envGlobal.CLOUDINARY_CLOUD_NAME ||
        getWindow().__CORABIN_CLOUDINARY_CLOUD_NAME__ ||
        'teolzwgc',

    /** Cloudinary asset directory for blog cover images */
    CLOUDINARY_BLOG_COVERS_FOLDER:
        envGlobal.CLOUDINARY_BLOG_COVERS_FOLDER ||
        getWindow().__CORABIN_CLOUDINARY_BLOG_COVERS_FOLDER__ ||
        'corabin/blog-covers',

    /** Default HTTP request timeout in milliseconds */
    HTTP_TIMEOUT_MS: 8000,

    /** Client cache TTL in milliseconds (5 minutes) */
    CACHE_TTL_MS: 5 * 60 * 1000,
};

/**
 * Validates critical environment configuration.
 *
 * @returns {{ valid: boolean, warnings: string[] }}
 */
export function validateEnv() {
    const warnings = [];

    if (!ENV.SUPABASE_URL || !ENV.SUPABASE_URL.startsWith('http')) {
        warnings.push('Invalid or missing SUPABASE_URL');
    }
    if (!ENV.SUPABASE_ANON_KEY) {
        warnings.push('Missing SUPABASE_ANON_KEY');
    }
    if (!ENV.CLOUDINARY_CLOUD_NAME) {
        warnings.push('Missing CLOUDINARY_CLOUD_NAME');
    }

    return {
        valid: warnings.length === 0,
        warnings,
    };
}
