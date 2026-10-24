import sys

with open('public/assets/js/blog-runtime.js', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Remove premature appear overrides in applyArticleData
old_premature = """        // Ensure animations / visibility for dynamic articles where Framer appear effects might not have triggered
        const headingWrapper = root.querySelector('.framer-1ekua6s, [data-framer-name="Heading Wrapper"]');
        const coverWrapper = root.querySelector('.framer-z182eh, [data-framer-name="Background Image"]');
        const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (headingWrapper) {
            const op = parseFloat(window.getComputedStyle(headingWrapper).opacity);
            if (isNaN(op) || op < 0.1) {
                if (prefersReducedMotion) {
                    headingWrapper.style.transition = 'none';
                } else {
                    headingWrapper.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
                }
                headingWrapper.style.opacity = '1';
                headingWrapper.style.transform = 'none';
            }
        }

        if (coverWrapper) {
            const op = parseFloat(window.getComputedStyle(coverWrapper).opacity);
            if (isNaN(op) || op < 0.1) {
                if (prefersReducedMotion) {
                    coverWrapper.style.transition = 'none';
                } else {
                    coverWrapper.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
                }
                coverWrapper.style.opacity = '0.7';
                coverWrapper.style.transform = 'none';
            }
        }"""

new_premature = """        // Authentic Framer appear effects are driven by animator.animateAppearEffects.
        // We preserve native Framer appear transitions without premature inline overrides."""

assert old_premature in code, "old_premature not found!"
code = code.replace(old_premature, new_premature, 1)

# 2. Update container toggles in syncFeaturedGrid
old_grid_toggles = """            if (mCards[1]) {
                if (p2) {
                    syncFeaturedCard(mCards[1], p2, { isHero: false, index: 1 });
                    setVisible(mCards[1].closest('.ssr-variant'), true);
                } else {
                    setVisible(mCards[1].closest('.ssr-variant'), false);
                }
            }
            if (mCards[2]) {
                if (p3) {
                    syncFeaturedCard(mCards[2], p3, { isHero: false, index: 2 });
                    setVisible(mCards[2].closest('.ssr-variant'), true);
                } else {
                    setVisible(mCards[2].closest('.ssr-variant'), false);
                }
            }"""

new_grid_toggles = """            if (mCards[1]) {
                if (p2) {
                    syncFeaturedCard(mCards[1], p2, { isHero: false, index: 1 });
                    setVisible(mCards[1].closest('.framer-1o9a060-container, .ssr-variant'), true);
                } else {
                    setVisible(mCards[1].closest('.framer-1o9a060-container, .ssr-variant'), false);
                }
            }
            if (mCards[2]) {
                if (p3) {
                    syncFeaturedCard(mCards[2], p3, { isHero: false, index: 2 });
                    setVisible(mCards[2].closest('.framer-1o9a060-container, .ssr-variant'), true);
                } else {
                    setVisible(mCards[2].closest('.framer-1o9a060-container, .ssr-variant'), false);
                }
            }"""

assert old_grid_toggles in code, "old_grid_toggles not found!"
code = code.replace(old_grid_toggles, new_grid_toggles, 1)

old_v3_toggles = """                if (v3Cards[0]) {
                    if (p2) {
                        syncFeaturedCard(v3Cards[0], p2, { isHero: false, index: 1 });
                        setVisible(v3Cards[0].closest('.ssr-variant, div'), true);
                    } else {
                        setVisible(v3Cards[0].closest('.ssr-variant, div'), false);
                    }
                }
                if (v3Cards[1]) {
                    if (p3) {
                        syncFeaturedCard(v3Cards[1], p3, { isHero: false, index: 2 });
                        setVisible(v3Cards[1].closest('.ssr-variant, div'), true);
                    } else {
                        setVisible(v3Cards[1].closest('.ssr-variant, div'), false);
                    }
                }"""

new_v3_toggles = """                if (v3Cards[0]) {
                    if (p2) {
                        syncFeaturedCard(v3Cards[0], p2, { isHero: false, index: 1 });
                        setVisible(v3Cards[0].closest('.framer-1jrilsq-container, .ssr-variant, div'), true);
                    } else {
                        setVisible(v3Cards[0].closest('.framer-1jrilsq-container, .ssr-variant, div'), false);
                    }
                }
                if (v3Cards[1]) {
                    if (p3) {
                        syncFeaturedCard(v3Cards[1], p3, { isHero: false, index: 2 });
                        setVisible(v3Cards[1].closest('.framer-1jrilsq-container, .ssr-variant, div'), true);
                    } else {
                        setVisible(v3Cards[1].closest('.framer-1jrilsq-container, .ssr-variant, div'), false);
                    }
                }"""

assert old_v3_toggles in code, "old_v3_toggles not found!"
code = code.replace(old_v3_toggles, new_v3_toggles, 1)

# 3. Add syncArticleRelatedPosts function
sync_related_func = """/**
 * Synchronizes the related blog posts section at the bottom of the shared article template (.framer-k7mcxy / .framer-3lukgt).
 * Guarantees that the active article is never recommended, and loads 3 distinct companion articles.
 */
export async function syncArticleRelatedPosts(currentSlug) {
    if (!currentSlug || currentSlug === 'blog' || currentSlug === 'index.html') return;
    const gridEl = document.querySelector('.framer-k7mcxy .framer-3lukgt') ||
                   document.querySelector('[data-framer-name="Blog"] .framer-3lukgt') ||
                   document.querySelector('.framer-k7mcxy');
    if (!gridEl) return;

    let allPosts = window.__corabinPublishedPosts;
    if (!allPosts || allPosts.length === 0) {
        try {
            allPosts = await fetchPublishedPostsFromSupabase();
            if (allPosts && allPosts.length > 0) {
                window.__corabinPublishedPosts = allPosts;
            }
        } catch (err) {
            console.warn('Failed to fetch published posts for related section:', err);
        }
    }

    if (!allPosts || allPosts.length === 0) return;

    // Filter out active article so it NEVER recommends itself
    const eligible = allPosts.filter(p => p.slug && p.slug !== currentSlug);
    if (eligible.length === 0) return;

    // Pick 3 companion articles: prioritize featured posts, then recent posts
    const featuredEligible = eligible.filter(p => p.featured === true);
    const nonFeaturedEligible = eligible.filter(p => p.featured !== true);
    const relatedPosts = [...featuredEligible, ...nonFeaturedEligible].slice(0, 3);

    const targetGrid = gridEl.classList.contains('framer-3lukgt') ? gridEl : gridEl.querySelector('.framer-3lukgt');
    if (targetGrid) {
        syncFeaturedGrid(targetGrid, relatedPosts);
    }
}
"""

init_article_marker = "export async function initSharedBlogArticle() {"
assert init_article_marker in code, "init_article_marker not found!"
code = code.replace(init_article_marker, sync_related_func + "\n" + init_article_marker, 1)

# 4. In initSharedBlogArticle, call syncArticleRelatedPosts
old_apply1 = """        window.__corabinLivePost = post;
        applyArticleData(post, requestToken);"""

new_apply1 = """        window.__corabinLivePost = post;
        applyArticleData(post, requestToken);
        syncArticleRelatedPosts(slug);"""

assert old_apply1 in code, "old_apply1 not found!"
code = code.replace(old_apply1, new_apply1, 1)

old_apply_observer = """            clearTimeout(articleDebounceTimer);
            articleDebounceTimer = setTimeout(() => {
                if (window.__corabinLivePost && resolveCurrentSlug() === slug && requestToken === activeArticleRequestToken) {
                    applyArticleData(window.__corabinLivePost, requestToken);
                }
            }, 50);"""

new_apply_observer = """            clearTimeout(articleDebounceTimer);
            articleDebounceTimer = setTimeout(() => {
                if (window.__corabinLivePost && resolveCurrentSlug() === slug && requestToken === activeArticleRequestToken) {
                    applyArticleData(window.__corabinLivePost, requestToken);
                    syncArticleRelatedPosts(slug);
                }
            }, 50);"""

assert old_apply_observer in code, "old_apply_observer not found!"
code = code.replace(old_apply_observer, new_apply_observer, 1)

old_apply_recon = """        // Timed reconciliation across Framer hydration window (tracked in articleTimers)
        [50, 150, 300, 600, 1000, 1500, 2500].forEach(delay => {
            const tid = setTimeout(() => {
                if (window.__corabinLivePost && resolveCurrentSlug() === slug && requestToken === activeArticleRequestToken) {
                    applyArticleData(window.__corabinLivePost, requestToken);
                }
            }, delay);
            articleTimers.push(tid);
        });"""

new_apply_recon = """        // Timed reconciliation across Framer hydration window (tracked in articleTimers)
        [50, 150, 300, 600, 1000, 1500, 2500].forEach(delay => {
            const tid = setTimeout(() => {
                if (window.__corabinLivePost && resolveCurrentSlug() === slug && requestToken === activeArticleRequestToken) {
                    applyArticleData(window.__corabinLivePost, requestToken);
                    syncArticleRelatedPosts(slug);
                }
            }, delay);
            articleTimers.push(tid);
        });

        // After appear animation duration (1.0s), verify element is not stuck invisible
        const lateCheckTimer = setTimeout(() => {
            if (resolveCurrentSlug() === slug && requestToken === activeArticleRequestToken) {
                const headingWrapper = document.querySelector('.framer-1ekua6s');
                if (headingWrapper && parseFloat(window.getComputedStyle(headingWrapper).opacity) < 0.05) {
                    headingWrapper.style.opacity = '1';
                    headingWrapper.style.transform = 'none';
                }
                const coverWrapper = document.querySelector('.framer-z182eh');
                if (coverWrapper && parseFloat(window.getComputedStyle(coverWrapper).opacity) < 0.05) {
                    coverWrapper.style.opacity = '0.7';
                    coverWrapper.style.transform = 'none';
                }
            }
        }, 2000);
        articleTimers.push(lateCheckTimer);"""

assert old_apply_recon in code, "old_apply_recon not found!"
code = code.replace(old_apply_recon, new_apply_recon, 1)

old_apply_preloaded = """        if (window.__PRELOADED_BLOG_POST__ && window.__PRELOADED_BLOG_POST__.slug === slug && supabaseResult.status !== 'not_found') {
            window.__corabinLivePost = window.__PRELOADED_BLOG_POST__;
            applyArticleData(window.__PRELOADED_BLOG_POST__, requestToken);
            return;
        }"""

new_apply_preloaded = """        if (window.__PRELOADED_BLOG_POST__ && window.__PRELOADED_BLOG_POST__.slug === slug && supabaseResult.status !== 'not_found') {
            window.__corabinLivePost = window.__PRELOADED_BLOG_POST__;
            applyArticleData(window.__PRELOADED_BLOG_POST__, requestToken);
            syncArticleRelatedPosts(slug);
            return;
        }"""

assert old_apply_preloaded in code, "old_apply_preloaded not found!"
code = code.replace(old_apply_preloaded, new_apply_preloaded, 1)

# 5. Clean up ensureBlogAnimationStyles
anim_start = code.find("export function ensureBlogAnimationStyles() {")
anim_end = code.find("/**", anim_start)
old_anim_func = code[anim_start:anim_end].strip()

new_anim_func = """export function ensureBlogAnimationStyles() {
    if (typeof document === 'undefined') return;
    if (document.getElementById('corabin-blog-animations')) return;

    const style = document.createElement('style');
    style.id = 'corabin-blog-animations';
    style.textContent = `
        /* Regular Cards Dynamic Hover & Entrance Animations (Scoped without !important to avoid clashing with Framer Motion) */
        .framer-18dht5n .framer-sHlxX {
            cursor: pointer;
            transition: background-color 0.25s ease, border-color 0.25s ease;
        }
        .framer-18dht5n .framer-sHlxX .framer-pizjbw {
            transition: bottom 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
            will-change: bottom, transform;
        }
        .framer-18dht5n .framer-sHlxX:hover .framer-pizjbw,
        .framer-18dht5n .framer-sHlxX:focus-visible .framer-pizjbw {
            bottom: 20px;
        }
        .framer-18dht5n .framer-sHlxX .framer-1462w5l img {
            transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
            will-change: transform;
        }
        .framer-18dht5n .framer-sHlxX:hover .framer-1462w5l img,
        .framer-18dht5n .framer-sHlxX:focus-visible .framer-1462w5l img {
            transform: scale(1.05);
        }

        /* Smooth entrance animation for dynamic regular cards */
        @keyframes corabinCardFadeIn {
            from {
                opacity: 0;
                transform: translateY(12px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        .framer-ij7w41-container[data-animated="true"] {
            animation: corabinCardFadeIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
            animation-delay: calc(var(--card-index, 0) * 35ms);
        }

        /* Reduced Motion */
        @media (prefers-reduced-motion: reduce) {
            .framer-18dht5n .framer-sHlxX,
            .framer-18dht5n .framer-sHlxX .framer-pizjbw,
            .framer-18dht5n .framer-sHlxX .framer-1462w5l img,
            .framer-ij7w41-container[data-animated="true"] {
                animation: none !important;
                transition: none !important;
                transform: none !important;
            }
            .framer-18dht5n .framer-sHlxX:hover .framer-pizjbw {
                bottom: 20px;
            }
        }
    `;
    document.head.appendChild(style);
}"""

code = code[:anim_start] + new_anim_func + "\n\n" + code[anim_end:]

# 6. Remove ensureBlogAnimationStyles call from initHomepageFeatured
old_home_call = """export async function initHomepageFeatured() {
    ensureBlogAnimationStyles();"""

new_home_call = """export async function initHomepageFeatured() {"""

assert old_home_call in code, "old_home_call not found!"
code = code.replace(old_home_call, new_home_call, 1)

with open('public/assets/js/blog-runtime.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("public/assets/js/blog-runtime.js updated successfully!")
