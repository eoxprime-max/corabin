/**
 * @module services/article-service
 * @description Pure business logic for blog article operations:
 * filtering, sorting, recommendation heuristics, and validation.
 * Zero DOM dependencies.
 */

/**
 * Selects up to `maxCount` featured posts from a list of published posts.
 * Prioritises posts where `featured === true`, sorted by publication date descending.
 * If fewer than `maxCount` posts are flagged as featured, fills the remaining slots
 * with the most recent non-featured posts to ensure consistent visual presentation.
 *
 * @param {Array<Object>} posts     - Array of published post records.
 * @param {number}        [maxCount=3] - Maximum number of featured posts to select.
 * @returns {Array<Object>} Selected featured posts.
 */
export function selectFeaturedPosts(posts, maxCount = 3) {
    if (!Array.isArray(posts) || posts.length === 0) return [];

    const sortByDate = (a, b) => new Date(b.published_at || 0) - new Date(a.published_at || 0);

    const explicitlyFeatured = posts.filter(p => p.featured === true).sort(sortByDate);
    const nonFeatured        = posts.filter(p => p.featured !== true).sort(sortByDate);

    const result = [...explicitlyFeatured];
    for (const post of nonFeatured) {
        if (result.length >= maxCount) break;
        if (!result.some(r => r.slug === post.slug)) {
            result.push(post);
        }
    }

    return result.slice(0, maxCount);
}

/**
 * Selects regular (non-featured) posts by excluding the featured set.
 *
 * @param {Array<Object>} allPosts      - All published posts.
 * @param {Array<Object>} featuredPosts - Currently selected featured posts.
 * @returns {Array<Object>} Array of regular posts sorted by date descending.
 */
export function selectRegularPosts(allPosts, featuredPosts = []) {
    if (!Array.isArray(allPosts)) return [];

    const featuredSlugs = new Set((featuredPosts || []).map(p => p.slug));
    const regular = allPosts.filter(p => !featuredSlugs.has(p.slug));

    return regular.sort((a, b) => new Date(b.published_at || 0) - new Date(a.published_at || 0));
}

/**
 * Finds up to `limit` related posts for a given article.
 * Prioritises posts in the same category, followed by other recent articles.
 * Never includes the active article itself.
 *
 * @param {string}        currentSlug     - Slug of the current article to exclude.
 * @param {string}        currentCategory - Category of the current article.
 * @param {Array<Object>} allPosts        - Pool of available posts.
 * @param {number}        [limit=3]       - Maximum related posts to return.
 * @returns {Array<Object>}
 */
export function findRelatedPosts(currentSlug, currentCategory, allPosts, limit = 3) {
    if (!Array.isArray(allPosts)) return [];

    const candidates = allPosts.filter(p => p.slug && p.slug !== currentSlug);

    const sameCategory = [];
    const otherCategory = [];

    for (const post of candidates) {
        if (currentCategory && post.category && post.category.toLowerCase() === currentCategory.toLowerCase()) {
            sameCategory.push(post);
        } else {
            otherCategory.push(post);
        }
    }

    const sortByDate = (a, b) => new Date(b.published_at || 0) - new Date(a.published_at || 0);
    sameCategory.sort(sortByDate);
    otherCategory.sort(sortByDate);

    return [...sameCategory, ...otherCategory].slice(0, limit);
}
