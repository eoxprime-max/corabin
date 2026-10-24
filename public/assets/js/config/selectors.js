/**
 * @module config/selectors
 * @description Centralized DOM selector definitions and layout constants.
 * Isolates Framer-generated class names and semantic IDs from runtime logic.
 */

export const SELECTORS = {
    // Article page
    ARTICLE_ROOT: '[data-blog-article-root="true"], div#main[data-blog-slug]',
    ARTICLE_COVER: '#article-cover-img',
    ARTICLE_TITLE: '#article-title',
    ARTICLE_AUTHOR: '#article-author',
    ARTICLE_AUTHOR_IMG: '#article-author-img',
    ARTICLE_DATE: '#article-date',
    ARTICLE_EXCERPT: '#article-excerpt',
    ARTICLE_BODY: '#article-body-content',
    ARTICLE_SHARE_TWITTER: '[data-blog-share="twitter"]',
    ARTICLE_SHARE_LINKEDIN: '[data-blog-share="linkedin"]',
    ARTICLE_SHARE_FACEBOOK: '[data-blog-share="facebook"]',

    // Blog listing page
    REGULAR_CARDS_CONTAINER: '.framer-18dht5n',
    REGULAR_CARD_WRAPPER: '.framer-ij7w41-container',
    REGULAR_CARD_INNER: '.framer-sHlxX',
    REGULAR_CARD_IMAGE: '.framer-1462w5l img',
    REGULAR_CARD_ARROW: '.framer-pizjbw',

    // Featured cards
    FEATURED_GRID_LISTING: '.framer-ugj76m',
    FEATURED_GRID_SSR: '.framer-3lukgt',
    HOMEPAGE_INSIGHTS_WRAPPER: '.framer-k7mcxy',
    FEATURED_CARD_ANCHOR: 'a.framer-7Bi9P',
};

/**
 * SQL Column select projections for Supabase REST endpoints.
 */
export const COLUMNS = {
    ARTICLE: 'id,slug,title,excerpt,content,category,status,published_at,updated_at,author,cover_image,cover_image_alt,seo_title,meta_description,canonical_url,og_image',
    LISTING: 'id,slug,title,excerpt,category,status,published_at,updated_at,cover_image,cover_image_alt,featured',
};

/**
 * Baseline static slugs pre-rendered on disk.
 */
export const BASELINE_STATIC_SLUGS = new Set([
    '7-critical-steps-to-successfully-launch-your-digital-product',
    'choosing-the-right-tech-stack-a-decision-framework-for-2025',
    'custom-vs-off-the-shelf-choose-wisely',
    'design-that-converts-our-approach',
    'headless-cms-the-future-is-here',
    'idx-listings-not-showing-google',
    'real-estate-agent-website-cost-2026',
    'speed-up-your-website-today',
    'stop-making-these-common-api-mistakes',
    'technical-debt-friend-or-foe',
    'website-security-made-simple',
    'why-design-systems-actually-matter',
    'why-every-real-estate-agent-needs-a-website-in-2026',
]);
