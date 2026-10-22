/**
 * Corabin Shared Blog Article Runtime & Supabase Data-Loading Layer
 *
 * Architecture:
 * 1. Resolves /blog/<slug> dynamically from pathname or DOM container attribute.
 * 2. Securely queries Supabase `public.posts` table using only the public anon key.
 * 3. Restricts queries explicitly to published posts (`status=eq.published`).
 * 4. Resolves Cloudinary cover-image public IDs into responsive delivery URLs.
 * 5. Hydrates the shared Framer article template with typography, tables, and links.
 * 6. Dynamically synchronizes the /blog/ listing grid with published posts from Supabase.
 */

// Configuration Constants
export const SUPABASE_PROJECT_URL = (typeof window !== 'undefined' && window.__CORABIN_SUPABASE_URL__) || 'https://oplfhsqycxroqyrdruej.supabase.co';
export const SUPABASE_ANON_KEY = (typeof window !== 'undefined' && (window.__CORABIN_SUPABASE_ANON_KEY__ || window.localStorage?.getItem('corabin_supabase_anon_key'))) || 'sb_publishable_c2_9jMvBS9iNxTqX9eyj2Q_oG0t2oVl';
export const CLOUDINARY_CLOUD_NAME = 'teolzwgc';
export const CLOUDINARY_BLOG_COVERS_FOLDER = 'corabin/blog-covers';

const REQUIRED_ARTICLE_COLUMNS = 'id,slug,title,excerpt,content,category,status,published_at,updated_at,author,cover_image,cover_image_alt,seo_title,meta_description,canonical_url,og_image';
const REQUIRED_LISTING_COLUMNS = 'id,slug,title,excerpt,category,status,published_at,updated_at,cover_image,cover_image_alt,featured';

/**
 * Resolves a stored image reference into an optimized Cloudinary delivery URL.
 * Supports:
 * - Cloudinary public IDs (e.g. "corabin/blog-covers/sample-id")
 * - Full URLs (pass-through)
 * - Cloudinary CDN delivery URLs
 */
export function resolveCloudinaryImageUrl(imageRef, options = {}) {
    if (!imageRef || typeof imageRef !== 'string') return null;
    let clean = imageRef.trim();
    if (!clean) return null;

    // All 13 posts use Cloudinary; local blog image fallback removed

    // Direct HTTP(S), data URI, or local path
    if (clean.startsWith('http://') || clean.startsWith('https://') || clean.startsWith('/') || clean.startsWith('data:')) {
        return clean;
    }

    const format = options.format || 'auto';
    const quality = options.quality || 'auto';
    const transforms = [`f_${format}`, `q_${quality}`];

    if (options.crop && (options.width || options.height)) {
        transforms.push(`c_${options.crop}`);
    }
    if (options.width) transforms.push(`w_${options.width}`);
    if (options.height) transforms.push(`h_${options.height}`);

    const transformStr = transforms.join(',');
    return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${transformStr}/${clean}`;
}

/**
 * Generates responsive srcset for a Cloudinary image or falls back to standard image.
 */
export function generateResponsiveSrcset(imageRef) {
    if (!imageRef || typeof imageRef !== 'string') return '';
    let clean = imageRef.trim();
    if (!clean) return '';

    // If it's a full Cloudinary URL, extract the public ID
    const cloudinaryMatch = clean.match(/^https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/(?:[a-zA-Z0-9_,]+\/)?(.+)$/);
    if (cloudinaryMatch) {
        clean = cloudinaryMatch[1];
    }

    // If it's a Cloudinary public ID, build true multi-resolution srcset
    if (!clean.startsWith('http://') && !clean.startsWith('https://') && !clean.startsWith('/')) {
        const widths = [512, 1024, 1672, 2688];
        return widths.map(w => `${resolveCloudinaryImageUrl(clean, { width: w })} ${w}w`).join(', ');
    }

    return '';
}

/**
 * Formats ISO date into human-readable string: e.g. "Jan 16, 2025"
 */
export function formatArticleDate(isoDateString) {
    if (!isoDateString) return '';
    try {
        const d = new Date(isoDateString);
        if (isNaN(d.getTime())) return isoDateString;
        return d.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            timeZone: 'UTC'
        });
    } catch {
        return isoDateString;
    }
}

/**
 * Extracts current blog slug from window.location.pathname or container attribute.
 */
export function resolveCurrentSlug() {
    // 1. Check container data attribute
    const rootEl = document.getElementById('main') || document.querySelector('[data-blog-slug]');
    if (rootEl && rootEl.dataset && rootEl.dataset.blogSlug && rootEl.dataset.blogSlug.trim() !== '') {
        return rootEl.dataset.blogSlug.trim();
    }

    // 2. Parse from pathname: /blog/<slug> or /blog/<slug>/
    const path = window.location.pathname.replace(/\/+$/, '');
    const segments = path.split('/').filter(Boolean);
    const blogIdx = segments.lastIndexOf('blog');
    if (blogIdx !== -1 && segments[blogIdx + 1] && segments[blogIdx + 1] !== 'article.html' && segments[blogIdx + 1] !== 'article' && segments[blogIdx + 1] !== 'index.html') {
        return segments[blogIdx + 1];
    }

    // 3. Fallback query param for testing ?slug=<slug>
    const params = new URLSearchParams(window.location.search);
    if (params.get('slug')) {
        return params.get('slug');
    }

    return '';
}

/**
 * Fetches published post from Supabase `public.posts` table.
 * Strictly uses the public anon key and filters for status='published'.
 */
export async function fetchPostFromSupabase(slug, anonKey = SUPABASE_ANON_KEY, signal = null) {
    if (!anonKey) {
        return {
            status: 'pending_connection',
            dependency: 'Supabase client anon key is not configured in client runtime. Querying public.posts is paused.',
            slug
        };
    }

    try {
        const endpoint = `${SUPABASE_PROJECT_URL}/rest/v1/posts?slug=eq.${encodeURIComponent(slug)}&status=eq.published&select=${REQUIRED_ARTICLE_COLUMNS}`;
        const fetchOptions = {
            headers: {
                'apikey': anonKey,
                'Authorization': `Bearer ${anonKey}`,
                'Accept': 'application/json'
            }
        };
        if (signal) {
            fetchOptions.signal = signal;
        }
        const res = await fetch(endpoint, fetchOptions);

        if (!res.ok) {
            return {
                status: 'error',
                error: `Supabase query failed with status ${res.status}: ${res.statusText}`,
                slug
            };
        }

        const data = await res.json();
        if (!data || data.length === 0) {
            return {
                status: 'not_found',
                error: `No published post found matching slug "${slug}" in Supabase public.posts table.`,
                slug
            };
        }

        return {
            status: 'success',
            post: data[0]
        };
    } catch (err) {
        if (err.name === 'AbortError') {
            return {
                status: 'aborted',
                slug
            };
        }
        return {
            status: 'error',
            error: err.message || 'Network error connecting to Supabase REST API.',
            slug
        };
    }
}

/**
 * Fetches all published posts from Supabase for the blog listing page.
 */
export async function fetchPublishedPostsFromSupabase(anonKey = SUPABASE_ANON_KEY) {
    if (!anonKey) return [];

    try {
        const endpoint = `${SUPABASE_PROJECT_URL}/rest/v1/posts?status=eq.published&select=${REQUIRED_LISTING_COLUMNS}&order=published_at.desc`;
        const res = await fetch(endpoint, {
            headers: {
                'apikey': anonKey,
                'Authorization': `Bearer ${anonKey}`,
                'Accept': 'application/json'
            }
        });

        if (!res.ok) return [];
        return await res.json();
    } catch (err) {
        console.warn('Failed to load published posts for blog listing:', err);
        return [];
    }
}

/**
 * Minimal, resilient Markdown-to-HTML parser that applies Framer's typography presets.
 */
export function parseArticleContent(rawContent) {
    if (!rawContent) return '';
    let text = typeof rawContent === 'string' ? rawContent.trim() : '';

    // If content is Framer AST array (e.g. [1, [4, "p", null, [5, "text"]]])
    if (text.startsWith('[') && text.endsWith(']')) {
        try {
            const ast = JSON.parse(text);
            return renderFramerAst(ast);
        } catch {
            // fallback to markdown parsing
        }
    }

    // If content already contains rich HTML tags, pass through safely
    if (text.startsWith('<p') || text.startsWith('<div') || text.startsWith('<article') || text.includes('</p>')) {
        return text;
    }

    // Markdown Parser
    const lines = text.split('\n');
    const htmlChunks = [];
    let inList = false;
    let listType = '';
    let inTable = false;
    let inPre = false;
    let preBuffer = [];

    const flushList = () => {
        if (inList) {
            htmlChunks.push(`</${listType}>`);
            inList = false;
            listType = '';
        }
    };

    const flushTable = () => {
        if (inTable) {
            htmlChunks.push('</tbody></table>');
            inTable = false;
        }
    };

    const formatInline = (str) => {
        return str
            // Links [text](url)
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="framer-styles-preset-1k8uo92">$1</a>')
            // Bold **text**
            .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
            // Italic *text*
            .replace(/\*([^*]+)\*/g, '<em>$1</em>')
            // Inline code `code`
            .replace(/`([^`]+)`/g, '<code class="framer-styles-preset-1ddjqgk">$1</code>');
    };

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        const trimmed = line.trim();

        // Code blocks
        if (trimmed.startsWith('```')) {
            if (inPre) {
                htmlChunks.push(`<pre><code>${preBuffer.join('\n')}</code></pre>`);
                preBuffer = [];
                inPre = false;
            } else {
                flushList();
                flushTable();
                inPre = true;
            }
            continue;
        }

        if (inPre) {
            // Escape HTML in code block
            const escaped = line
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
            preBuffer.push(escaped);
            continue;
        }

        // Empty line
        if (!trimmed) {
            flushList();
            flushTable();
            continue;
        }

        // Heading 3
        if (trimmed.startsWith('### ')) {
            flushList();
            flushTable();
            htmlChunks.push(`<h3 class="framer-text framer-styles-preset-1nepq3m">${formatInline(trimmed.substring(4))}</h3>`);
            continue;
        }

        // Heading 2
        if (trimmed.startsWith('## ')) {
            flushList();
            flushTable();
            htmlChunks.push(`<h2 class="framer-text framer-styles-preset-1dzuwqo">${formatInline(trimmed.substring(3))}</h2>`);
            continue;
        }

        // Heading 1
        if (trimmed.startsWith('# ')) {
            flushList();
            flushTable();
            htmlChunks.push(`<h2 class="framer-text framer-styles-preset-1dzuwqo">${formatInline(trimmed.substring(2))}</h2>`);
            continue;
        }

        // Blockquote
        if (trimmed.startsWith('> ')) {
            flushList();
            flushTable();
            htmlChunks.push(`<blockquote>${formatInline(trimmed.substring(2))}</blockquote>`);
            continue;
        }

        // Table row (pipe-separated)
        if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
            flushList();
            const cells = trimmed.split('|').slice(1, -1).map(c => c.trim());
            // Check if delimiter row
            if (cells.every(c => /^:?-+:?$/.test(c))) {
                continue;
            }
            if (!inTable) {
                inTable = true;
                htmlChunks.push('<table><thead><tr>');
                cells.forEach(h => htmlChunks.push(`<th>${formatInline(h)}</th>`));
                htmlChunks.push('</tr></thead><tbody>');
            } else {
                htmlChunks.push('<tr>');
                cells.forEach(c => htmlChunks.push(`<td>${formatInline(c)}</td>`));
                htmlChunks.push('</tr>');
            }
            continue;
        }

        // Table row (tab-separated)
        if (line.includes('\t')) {
            flushList();
            const cells = line.split('\t').map(c => c.trim()).filter(Boolean);
            if (cells.length > 1) {
                if (!inTable) {
                    inTable = true;
                    htmlChunks.push('<table><thead><tr>');
                    cells.forEach(h => htmlChunks.push(`<th>${formatInline(h)}</th>`));
                    htmlChunks.push('</tr></thead><tbody>');
                } else {
                    htmlChunks.push('<tr>');
                    cells.forEach(c => htmlChunks.push(`<td>${formatInline(c)}</td>`));
                    htmlChunks.push('</tr>');
                }
                continue;
            }
        }

        flushTable();

        // Unordered list item
        if (/^[-*]\s+/.test(trimmed)) {
            if (!inList || listType !== 'ul') {
                flushList();
                htmlChunks.push('<ul>');
                inList = true;
                listType = 'ul';
            }
            const itemText = trimmed.replace(/^[-*]\s+/, '');
            htmlChunks.push(`<li>${formatInline(itemText)}</li>`);
            continue;
        }

        // Ordered list item (e.g. "1. " or "1) ")
        if (/^\d+[\.\)]\s+/.test(trimmed)) {
            // Check if this is an unmarked numbered heading like "1. Check whether..." or "1. Four realistic budget levels"
            if (trimmed.length < 80 && !/[.,:;?!'"]$/.test(trimmed)) {
                flushList();
                htmlChunks.push(`<h3 class="framer-text framer-styles-preset-1nepq3m">${formatInline(trimmed)}</h3>`);
                continue;
            }
            if (!inList || listType !== 'ol') {
                flushList();
                htmlChunks.push('<ol>');
                inList = true;
                listType = 'ol';
            }
            const itemText = trimmed.replace(/^\d+[\.\)]\s+/, '');
            htmlChunks.push(`<li>${formatInline(itemText)}</li>`);
            continue;
        }

        // Unmarked section heading heuristic (plain-text titles without punctuation followed by longer text or table)
        if (trimmed.length < 80 && !/[.,:;?!'"]$/.test(trimmed) && !trimmed.startsWith('http') && !trimmed.startsWith('[')) {
            let nextLine = '';
            for (let j = i + 1; j < Math.min(i + 4, lines.length); j++) {
                if (lines[j].trim()) {
                    nextLine = lines[j].trim();
                    break;
                }
            }
            if (nextLine && (nextLine.length > 60 || nextLine.includes('\t') || /^[-*\d]/.test(nextLine))) {
                flushList();
                htmlChunks.push(`<h3 class="framer-text framer-styles-preset-1nepq3m">${formatInline(trimmed)}</h3>`);
                continue;
            }
        }

        // Excerpt deduplication check: skip if line is identical to the top excerpt h2
        const excerptEl = typeof document !== 'undefined' ? (document.querySelector('.framer-1ig6rss h2') || document.querySelector('[data-excerpt]')) : null;
        const pageExcerpt = excerptEl ? (excerptEl.innerText || excerptEl.dataset.excerpt || '').trim() : '';
        if (pageExcerpt && (trimmed === pageExcerpt || (trimmed.length > 40 && pageExcerpt.startsWith(trimmed.slice(0, 40))))) {
            continue;
        }

        // Standard Paragraph
        flushList();
        htmlChunks.push(`<p class="framer-text framer-styles-preset-1go6xkm">${formatInline(trimmed)}</p>`);
    }

    flushList();
    flushTable();
    return htmlChunks.join('\n');
}

/**
 * Renders Framer RichText AST into HTML string.
 */
function renderFramerAst(ast) {
    if (!Array.isArray(ast)) return '';
    const chunks = [];

    const walk = (node) => {
        if (!node) return;
        if (typeof node === 'string') {
            chunks.push(node);
            return;
        }
        if (typeof node === 'number') return;
        if (Array.isArray(node)) {
            const type = node[0];
            if (type === 5 && typeof node[1] === 'string') {
                chunks.push(node[1]);
                return;
            }
            if (type === 4) {
                const tag = node[1];
                const attrs = node[2] || {};
                const children = node.slice(3);

                let classAttr = '';
                if (tag === 'p') classAttr = ' class="framer-text framer-styles-preset-1go6xkm"';
                else if (tag === 'h2') classAttr = ' class="framer-text framer-styles-preset-1dzuwqo"';
                else if (tag === 'h3') classAttr = ' class="framer-text framer-styles-preset-1nepq3m"';
                else if (tag === 'a') {
                    const href = attrs.href || '#';
                    const target = attrs.target ? ` target="${attrs.target}"` : '';
                    const rel = attrs.rel ? ` rel="${attrs.rel}"` : '';
                    classAttr = ' class="framer-styles-preset-1k8uo92"';
                    chunks.push(`<a href="${href}"${target}${rel}${classAttr}>`);
                    children.forEach(walk);
                    chunks.push('</a>');
                    return;
                } else if (tag === 'code') {
                    chunks.push('<code class="framer-styles-preset-1ddjqgk">');
                    children.forEach(walk);
                    chunks.push('</code>');
                    return;
                }

                chunks.push(`<${tag}${classAttr}>`);
                children.forEach(walk);
                chunks.push(`</${tag}>`);
                return;
            }
            node.forEach(walk);
        }
    };

    walk(ast);
    return chunks.join('');
}

export const ARTICLE_ROOT_SELECTOR = '[data-blog-article-root="true"], div#main[data-blog-slug]';

let activeArticleSlug = null;
let activeArticleRequestToken = 0;
let activeArticleAbortController = null;
let articleTimers = [];
let isApplyingArticleData = false;
let articleObserver = null;
let articleDebounceTimer = null;

export function cleanupArticleRuntime() {
    if (activeArticleAbortController) {
        try { activeArticleAbortController.abort(); } catch {}
        activeArticleAbortController = null;
    }
    if (articleObserver) {
        articleObserver.disconnect();
        articleObserver = null;
    }
    if (articleTimers && articleTimers.length > 0) {
        articleTimers.forEach(id => clearTimeout(id));
        articleTimers = [];
    }
    if (articleDebounceTimer) {
        clearTimeout(articleDebounceTimer);
        articleDebounceTimer = null;
    }
    window.__corabinLivePost = null;
    window.__corabinArticleObserverAttached = false;
    window.__corabinUnavailableObserverAttached = false;
    activeArticleSlug = null;
}

function urlsMatch(attrOrProp, target) {
    if (!attrOrProp || !target) return false;
    if (attrOrProp === target) return true;
    try {
        const u1 = new URL(attrOrProp, window.location.href).href;
        const u2 = new URL(target, window.location.href).href;
        return u1 === u2;
    } catch {
        return false;
    }
}

function updateMetaTag(selector, attribute, value) {
    if (!value) return;
    let el = document.querySelector(selector);
    if (!el && selector.startsWith('meta[')) {
        el = document.createElement('meta');
        const match = selector.match(/meta\[([a-zA-Z0-9_:]+)=["']([^"']+)["']\]/);
        if (match) {
            el.setAttribute(match[1], match[2]);
            document.head.appendChild(el);
        }
    }
    if (el && el.getAttribute(attribute) !== value) {
        el.setAttribute(attribute, value);
    }
}

/**
 * Synchronizes article DOM elements with authoritative Supabase post data.
 */
export function applyArticleData(post, token = undefined) {
    if (!post || isApplyingArticleData) return;

    // Route verification: ensure current route is an article and matches post.slug
    const currentSlug = resolveCurrentSlug();
    if (!currentSlug || currentSlug === 'blog' || currentSlug === 'index.html') return;
    if (post.slug && post.slug !== currentSlug) return;
    if (token !== undefined && token !== activeArticleRequestToken) return;

    // Scope strictly to article root
    const root = document.querySelector(ARTICLE_ROOT_SELECTOR);
    if (!root) return;

    isApplyingArticleData = true;

    try {
        const activeTitle = post.title || '';
        const activeDate = post.published_at || post.date || '';
        const activeExcerpt = post.excerpt || post.meta_description || '';
        const activeImage = post.cover_image || '';

        let activeAuthor = 'Souvik';
        if (post.author) {
            activeAuthor = typeof post.author === 'object' ? (post.author.name || 'Souvik') : String(post.author);
        }

        const resolvedCover = resolveCloudinaryImageUrl(activeImage) || 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 1672 941\'%3E%3Crect width=\'100%25\' height=\'100%25\' fill=\'%23111111\'/%3E%3C/svg%3E';
        const resolvedSrcset = activeImage ? generateResponsiveSrcset(activeImage) : '';
        const formattedDate = formatArticleDate(activeDate);

        // Update document title and head metadata
        if (activeTitle) {
            const expectedTitle = activeTitle.includes('Corabin') ? activeTitle : `${activeTitle} — Corabin`;
            if (document.title !== expectedTitle) {
                document.title = expectedTitle;
            }
            updateMetaTag('meta[property="og:title"]', 'content', expectedTitle);
            updateMetaTag('meta[name="twitter:title"]', 'content', expectedTitle);
        }
        if (activeExcerpt) {
            updateMetaTag('meta[name="description"]', 'content', activeExcerpt);
            updateMetaTag('meta[property="og:description"]', 'content', activeExcerpt);
            updateMetaTag('meta[name="twitter:description"]', 'content', activeExcerpt);
        }
        if (resolvedCover) {
            updateMetaTag('meta[property="og:image"]', 'content', resolvedCover);
            updateMetaTag('meta[name="twitter:image"]', 'content', resolvedCover);
        }
        if (currentSlug) {
            const canonicalUrl = post.canonical_url || `https://corabin.com/blog/${currentSlug}`;
            updateMetaTag('meta[property="og:url"]', 'content', canonicalUrl);
            updateMetaTag('link[rel="canonical"]', 'href', canonicalUrl);
        }

        // Update Cover Image - strictly inside root
        const coverImg = root.querySelector('#article-cover-img') ||
                         root.querySelector('.framer-z182eh img') ||
                         root.querySelector('[data-framer-name="Background Image"] img') ||
                         root.querySelector('#hero [data-framer-name="Background Image"] img');
        if (coverImg && resolvedCover) {
            if (!urlsMatch(coverImg.getAttribute('src'), resolvedCover) && !urlsMatch(coverImg.src, resolvedCover)) {
                coverImg.src = resolvedCover;
            }
            if (resolvedSrcset) {
                if (coverImg.getAttribute('srcset') !== resolvedSrcset && coverImg.srcset !== resolvedSrcset) {
                    coverImg.srcset = resolvedSrcset;
                }
            } else if (coverImg.hasAttribute('srcset')) {
                coverImg.removeAttribute('srcset');
            }
            const expectedAlt = post.cover_image_alt || activeTitle;
            if (expectedAlt && coverImg.getAttribute('alt') !== expectedAlt) {
                coverImg.alt = expectedAlt;
            }
            const syncedCoverVal = post.cover_image || 'true';
            if (coverImg.getAttribute('data-synced-cover') !== syncedCoverVal) {
                coverImg.setAttribute('data-synced-cover', syncedCoverVal);
            }
            // Restore visibility after loading
            if (coverImg.style.opacity !== '1') {
                coverImg.style.opacity = '1';
            }
        }

        // Update Hero Title - strictly inside root (removed generic fallbacks like [data-framer-name="Heading Wrapper"] h1 and h1.framer-text)
        const titleEl = root.querySelector('#article-title') || root.querySelector('.framer-1ltkmql h1');
        if (titleEl && activeTitle && titleEl.textContent.trim() !== activeTitle.trim()) {
            titleEl.textContent = activeTitle;
        }

        // Update Author - strictly inside root
        const authorEl = root.querySelector('#article-author') || root.querySelector('.framer-y7unnl p') || root.querySelector('[data-framer-name="Photo"] ~ div p');
        if (authorEl && activeAuthor && authorEl.textContent.trim() !== activeAuthor.trim()) {
            authorEl.textContent = activeAuthor;
        }

        // Update Author Avatar - strictly inside root
        const authorAvatarImg = root.querySelector('[data-framer-name="Photo"] img');
        if (authorAvatarImg && post.author && typeof post.author === 'object' && post.author.avatar) {
            const avatarUrl = post.author.avatar;
            if (!urlsMatch(authorAvatarImg.getAttribute('src'), avatarUrl) && !urlsMatch(authorAvatarImg.src, avatarUrl)) {
                authorAvatarImg.src = avatarUrl;
            }
        }

        // Update Date - strictly inside root
        const timeEl = root.querySelector('#article-date') || root.querySelector('.framer-ybkmy time');
        if (timeEl && formattedDate) {
            if (activeDate && timeEl.getAttribute('datetime') !== activeDate) {
                timeEl.dateTime = activeDate;
            }
            if (timeEl.textContent.trim() !== formattedDate.trim()) {
                timeEl.textContent = formattedDate;
            }
        } else {
            const datePEl = root.querySelector('.framer-ybkmy p');
            if (datePEl && formattedDate && datePEl.textContent.trim() !== formattedDate.trim()) {
                datePEl.textContent = formattedDate;
            }
        }

        // Update Excerpt - strictly inside root
        const excerptEl = root.querySelector('#article-excerpt') || root.querySelector('.framer-1ig6rss h2') || root.querySelector('#content h2.framer-text');
        if (excerptEl && activeExcerpt && excerptEl.textContent.trim() !== activeExcerpt.trim()) {
            excerptEl.textContent = activeExcerpt;
        }

        // Update Body Content - strictly inside root
        const bodyEl = root.querySelector('#article-body-content') || root.querySelector('.framer-1272rho') || root.querySelector('#content .framer-1272rho');
        const syncKey = (post.updated_at || post.published_at || 'v1') + '_' + (post.content ? post.content.length : 0);
        if (bodyEl && post.content && bodyEl.getAttribute('data-supabase-synced') !== syncKey) {
            const parsedContent = parseArticleContent(post.content);
            if (bodyEl.innerHTML !== parsedContent) {
                bodyEl.innerHTML = parsedContent;
            }
            bodyEl.setAttribute('data-supabase-synced', syncKey);
            bodyEl.setAttribute('data-pre-rendered', 'true');
        }

        // Authentic Framer appear effects are driven by animator.animateAppearEffects.
        // We preserve native Framer appear transitions without premature inline overrides.

        // Social Share links - strictly inside root
        if (currentSlug) {
            const shareUrl = `https://corabin.com/blog/${currentSlug}`;
            const fbShare = root.querySelector('a[aria-label="Share on Facebook"]');
            const expectedFb = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
            if (fbShare && fbShare.getAttribute('href') !== expectedFb) fbShare.href = expectedFb;

            const xShare = root.querySelector('a[aria-label="Share on X"]');
            const expectedX = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(activeTitle)}`;
            if (xShare && xShare.getAttribute('href') !== expectedX) xShare.href = expectedX;

            const liShare = root.querySelector('a[aria-label="Share on LinkedIn"]');
            const expectedLi = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
            if (liShare && liShare.getAttribute('href') !== expectedLi) liShare.href = expectedLi;
        }

        activeArticleSlug = post.slug;
    } finally {
        if (articleObserver) {
            articleObserver.takeRecords();
        }
        isApplyingArticleData = false;
    }
}

export function renderUnavailableState(message = 'The requested article is not currently published or does not exist.') {
    document.title = 'Article Unavailable — Corabin';

    cleanupArticleRuntime();

    // Scope strictly to article root
    const root = document.querySelector(ARTICLE_ROOT_SELECTOR);
    if (!root) return;

    // Update SEO & Social Metadata
    updateMetaTag('meta[name="robots"]', 'content', 'noindex, nofollow');
    updateMetaTag('meta[name="description"]', 'content', 'The requested article is not currently published or does not exist on Corabin.');
    updateMetaTag('meta[property="og:title"]', 'content', 'Article Unavailable — Corabin');
    updateMetaTag('meta[name="twitter:title"]', 'content', 'Article Unavailable — Corabin');
    updateMetaTag('meta[property="og:description"]', 'content', 'The requested article is not currently published or does not exist on Corabin.');

    // Remove or reset canonical URL to avoid misleading indexing
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
        canonicalLink.remove();
    }
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
        ogUrl.remove();
    }

    const applyUnavailableDom = () => {
        const currentRoot = document.querySelector(ARTICLE_ROOT_SELECTOR);
        if (!currentRoot) return;

        // 1. Update Title to 'Article Unavailable'
        const titleEl = currentRoot.querySelector('#article-title') || currentRoot.querySelector('.framer-1ltkmql h1');
        if (titleEl && titleEl.textContent !== 'Article Unavailable') {
            titleEl.textContent = 'Article Unavailable';
        }

        // 2. Hide Author & Date block
        const authorWrapper = currentRoot.querySelector('.framer-16ganb5, [data-framer-name="Heading Wrapper"] .framer-16ganb5');
        if (authorWrapper && authorWrapper.style.display !== 'none') {
            authorWrapper.style.display = 'none';
        }

        // 3. Hide Hero Cover Image & Background
        const coverWrapper = currentRoot.querySelector('.framer-z182eh, [data-framer-name="Background Image"]');
        if (coverWrapper && coverWrapper.style.display !== 'none') {
            coverWrapper.style.display = 'none';
        }
        const coverImg = currentRoot.querySelector('#article-cover-img');
        if (coverImg && coverImg.style.display !== 'none') {
            coverImg.style.display = 'none';
        }

        // 4. Update Excerpt to explain unavailability
        const excerptEl = currentRoot.querySelector('#article-excerpt') || currentRoot.querySelector('.framer-1ig6rss h2');
        if (excerptEl && excerptEl.textContent !== message) {
            excerptEl.textContent = message;
            excerptEl.style.color = 'rgba(0, 0, 0, 0.6)';
        }

        // 5. Update Body Content with clear Return to Blog button
        const bodyEl = currentRoot.querySelector('#article-body-content') || currentRoot.querySelector('.framer-1272rho');
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
    };

    applyUnavailableDom();

    // Attach Framer Hydration Persistence Guard for Unavailable State
    if (!window.__corabinUnavailableObserverAttached) {
        window.__corabinUnavailableObserverAttached = true;
        const unavailObserver = new MutationObserver(() => {
            applyUnavailableDom();
        });
        unavailObserver.observe(root, {
            childList: true,
            subtree: true
        });

        // Track reconciliation timers
        [50, 150, 300, 600, 1000, 1500, 2000, 3000].forEach(delay => {
            const tid = setTimeout(applyUnavailableDom, delay);
            articleTimers.push(tid);
        });
    }
}

/**
 * Sets up and mounts the shared article template runtime.
 */
/**
 * Synchronizes the related blog posts section at the bottom of the shared article template (.framer-k7mcxy / .framer-3lukgt).
 * Guarantees that the active article is never recommended, and loads 3 distinct companion articles.
 */
export async function syncArticleRelatedPosts(currentSlug) {
    if (!currentSlug || currentSlug === 'blog' || currentSlug === 'index.html') return;
    const gridEl = document.querySelector('.framer-k7mcxy .framer-3lukgt') ||
                   document.querySelector('#main .framer-3lukgt') ||
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
    const eligible = allPosts.filter(p => p.slug && p.slug !== currentSlug && p.status === 'published');
    if (eligible.length === 0) return;

    // Pick 3 companion articles: prioritize featured posts, then recent posts
    const featuredEligible = eligible.filter(p => p.featured === true);
    const nonFeaturedEligible = eligible.filter(p => p.featured !== true);
    const relatedPosts = [...featuredEligible, ...nonFeaturedEligible].slice(0, 3);
    if (relatedPosts.length < 3 && eligible.length >= 3) {
        relatedPosts.push(...eligible.filter(p => !relatedPosts.includes(p)).slice(0, 3 - relatedPosts.length));
    }

    const p1 = relatedPosts[0];
    const p2 = relatedPosts[1];
    const p3 = relatedPosts[2];

    const targetGrid = gridEl.classList.contains('framer-3lukgt') ? gridEl : (gridEl.querySelector('.framer-3lukgt') || gridEl);

    // Desktop Hero Card: in .framer-1tq2jgu
    const desktopHero = targetGrid.querySelector('.framer-1tq2jgu a[data-framer-name="Desktop"]') ||
                        targetGrid.querySelector('.framer-1tq2jgu .ssr-variant:not(.hidden-72rtr7) a.framer-7Bi9P') ||
                        targetGrid.querySelector('.framer-1tq2jgu a.framer-7Bi9P');
    if (desktopHero && p1) {
        syncFeaturedCard(desktopHero, p1, { isHero: true, index: 0 });
    }

    // Desktop Side Cards: in .framer-v3he4g (2 cards)
    const desktopSideCards = targetGrid.querySelectorAll('.framer-v3he4g a.framer-7Bi9P');
    if (desktopSideCards[0] && p2) {
        syncFeaturedCard(desktopSideCards[0], p2, { isHero: false, index: 1 });
    }
    if (desktopSideCards[1] && p3) {
        syncFeaturedCard(desktopSideCards[1], p3, { isHero: false, index: 2 });
    }

    // Mobile Cards: in .framer-1tq2jgu (3 cards)
    const mobileCards = targetGrid.querySelectorAll('.framer-1tq2jgu a[data-framer-name="Mobile"], .framer-1tq2jgu .ssr-variant.hidden-72rtr7 a.framer-7Bi9P');
    if (mobileCards[0] && p1) {
        syncFeaturedCard(mobileCards[0], p1, { isHero: true, index: 0 });
    }
    if (mobileCards[1] && p2) {
        syncFeaturedCard(mobileCards[1], p2, { isHero: false, index: 1 });
    }
    if (mobileCards[2] && p3) {
        syncFeaturedCard(mobileCards[2], p3, { isHero: false, index: 2 });
    }
}

export async function initSharedBlogArticle() {
    const slug = resolveCurrentSlug();
    if (!slug || slug === 'blog' || slug === 'index.html') {
        renderUnavailableState('Please select an article from our blog.');
        return;
    }

    const requestToken = ++activeArticleRequestToken;
    if (activeArticleAbortController) {
        try { activeArticleAbortController.abort(); } catch {}
    }
    activeArticleAbortController = new AbortController();

    // Clear prior article reconciliation timers
    articleTimers.forEach(id => clearTimeout(id));
    articleTimers = [];

    const root = document.querySelector(ARTICLE_ROOT_SELECTOR);
    if (!root) {
        // If article root is not yet in DOM, wait briefly once
        const retryTimer = setTimeout(() => {
            if (activeArticleRequestToken === requestToken && resolveCurrentSlug() === slug) {
                initSharedBlogArticle();
            }
        }, 50);
        articleTimers.push(retryTimer);
        return;
    }

    // Apply immediate loading state if navigating to a different article
    // This removes previous article's title, excerpt, and cover image flash!
    if (activeArticleSlug !== slug) {
        const titleEl = root.querySelector('#article-title') || root.querySelector('.framer-1ltkmql h1');
        const coverEl = root.querySelector('#article-cover-img');
        const excerptEl = root.querySelector('#article-excerpt') || root.querySelector('.framer-1ig6rss h2');
        const bodyEl = root.querySelector('#article-body-content') || root.querySelector('.framer-1272rho');

        if (window.__PRELOADED_BLOG_POST__ && window.__PRELOADED_BLOG_POST__.slug === slug) {
            applyArticleData(window.__PRELOADED_BLOG_POST__, requestToken);
            syncArticleRelatedPosts(slug);
        } else {
            if (titleEl) titleEl.innerHTML = '&nbsp;';
            if (coverEl) {
                coverEl.removeAttribute('srcset');
                coverEl.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1672 941'%3E%3Crect width='100%25' height='100%25' fill='%23111111'/%3E%3C/svg%3E";
                coverEl.alt = "Loading article...";
                coverEl.removeAttribute('data-synced-cover');
                coverEl.style.opacity = '1';
            }
            if (excerptEl) excerptEl.textContent = '';
            if (bodyEl && !bodyEl.querySelector('#article-loading')) {
                bodyEl.innerHTML = '<div id="article-loading" style="padding: 40px 0; text-align: center; color: #888;">Loading article...</div>';
            }
        }
    }

    // Fetch live post data and published posts from Supabase in parallel
    const [supabaseResult, publishedResult] = await Promise.all([
        fetchPostFromSupabase(slug, SUPABASE_ANON_KEY, activeArticleAbortController.signal),
        (window.__corabinPublishedPosts && window.__corabinPublishedPosts.length > 0)
            ? Promise.resolve(window.__corabinPublishedPosts)
            : fetchPublishedPostsFromSupabase().catch(() => [])
    ]);

    if (publishedResult && publishedResult.length > 0) {
        window.__corabinPublishedPosts = publishedResult;
    }

    // Verify race safety
    if (requestToken !== activeArticleRequestToken) return;
    if (resolveCurrentSlug() !== slug) return;
    if (supabaseResult.status === 'aborted') return;

    if (supabaseResult.status === 'success' && supabaseResult.post) {
        const post = supabaseResult.post;

        // Verify status is published
        if (post.status !== 'published') {
            renderUnavailableState();
            return;
        }

        window.__corabinLivePost = post;
        applyArticleData(post, requestToken);
        syncArticleRelatedPosts(slug);

        // Disconnect previous observer
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
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['src', 'srcset']
            });
        }

        // Timed reconciliation across Framer hydration window (tracked in articleTimers)
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
        articleTimers.push(lateCheckTimer);
    } else {
        // Fallback to preloaded post if this is a known post and Supabase fetch failed due to network/offline
        if (window.__PRELOADED_BLOG_POST__ && window.__PRELOADED_BLOG_POST__.slug === slug && supabaseResult.status !== 'not_found') {
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

/**
 * 12 Baseline Static Slugs
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
    'why-every-real-estate-agent-needs-a-website-in-2026'
]);

/**
 * Extracts a normalized blog post slug from an href attribute.
 */
export function extractSlugFromHref(href) {
    if (!href || typeof href !== 'string') return '';
    const clean = href.replace(/^\.\//, '/').replace(/\/+$/, '');
    const segs = clean.split('/').filter(Boolean);
    const idx = segs.indexOf('blog');
    if (idx !== -1 && segs[idx + 1] && segs[idx + 1] !== 'article.html') {
        return segs[idx + 1];
    }
    // If href is directly like './stop-making-these-common-api-mistakes'
    if (segs.length > 0 && !['blog', 'insights', 'index.html'].includes(segs[segs.length - 1])) {
        return segs[segs.length - 1];
    }
    return '';
}

/**
 * Injects animation styles for blog cards and images.
 * Provides hover effects (arrow slide, image zoom) and smooth card entrance animations
 * while fully respecting prefers-reduced-motion.
 */
export function ensureBlogAnimationStyles() {
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
}

/**
 * Attaches pointer and keyboard focus listeners to ensure .hover class is synchronized
 * for Framer Motion compatibility.
 */
export function attachCardHoverHandlers(cardLink) {
    if (!cardLink || cardLink.__corabinHoverAttached) return;
    cardLink.__corabinHoverAttached = true;

    cardLink.addEventListener('pointerenter', () => cardLink.classList.add('hover'));
    cardLink.addEventListener('pointerleave', () => cardLink.classList.remove('hover'));
    cardLink.addEventListener('focus', () => cardLink.classList.add('hover'));
    cardLink.addEventListener('blur', () => cardLink.classList.remove('hover'));
}

/**
 * Selects up to 3 featured posts from all published posts.
 * Strictly requires post.featured === true; does NOT auto-promote unfeatured posts.
 */
export function selectFeaturedPosts(allPosts) {
    if (!allPosts || allPosts.length === 0) return [];
    return allPosts.filter(p => Boolean(p.featured)).slice(0, 3);
}

/**
 * Synchronizes an individual Framer featured card (a.framer-7Bi9P) with post data.
 */
export function syncFeaturedCard(cardEl, post, options = {}) {
    if (!cardEl || !post) return;

    if (cardEl.getAttribute('data-post-slug') !== post.slug) {
        cardEl.setAttribute('data-post-slug', post.slug);
    }

    const targetHref = `/blog/${post.slug}/`;
    if (cardEl.getAttribute('href') !== targetHref) {
        cardEl.setAttribute('href', targetHref);
    }

    // Safe Title (using textContent to prevent XSS / markup corruption)
    const titleEl = cardEl.querySelector('.framer-giavb9 p') ||
                    cardEl.querySelector('[data-framer-name*="Title"] p') ||
                    cardEl.querySelector('.framer-giavb9');
    if (titleEl && titleEl.textContent !== post.title) {
        titleEl.textContent = post.title;
    }

    // Formatted Date
    const formattedDate = formatArticleDate(post.published_at);
    const dateEl = cardEl.querySelector('.framer-gifdkw p') ||
                   cardEl.querySelector('[data-framer-name*="Date"] p') ||
                   cardEl.querySelector('.framer-gifdkw');
    if (dateEl && dateEl.textContent !== formattedDate) {
        dateEl.textContent = formattedDate;
    }

    // Image & Responsive Srcset
    const img = cardEl.querySelector('img');
    if (img) {
        const isHero = options.isHero ?? (options.index === 0);
        if (isHero) {
            img.setAttribute('loading', 'eager');
            img.setAttribute('fetchpriority', 'high');
        } else {
            img.setAttribute('loading', 'lazy');
            img.removeAttribute('fetchpriority');
        }
        if (img.getAttribute('decoding') !== 'async') {
            img.setAttribute('decoding', 'async');
        }

        const coverUrl = resolveCloudinaryImageUrl(post.cover_image) || 'https://res.cloudinary.com/teolzwgc/image/upload/f_auto,q_auto/corabin/blog-covers/custom-vs-off-the-shelf-choose-wisely-edb0902a';
        if (img.getAttribute('src') !== coverUrl) {
            img.src = coverUrl;
        }
        const altText = post.cover_image_alt || post.title || '';
        if (img.getAttribute('alt') !== altText) {
            img.alt = altText;
        }
        const srcset = generateResponsiveSrcset(post.cover_image);
        if (srcset) {
            if (img.getAttribute('srcset') !== srcset) {
                img.srcset = srcset;
            }
        } else if (img.hasAttribute('srcset')) {
            img.removeAttribute('srcset');
        }
    }

    attachCardHoverHandlers(cardEl);
}

/**
 * Synchronizes a featured posts grid (.framer-ugj76m or .framer-3lukgt) across viewports.
 * Gracefully handles 0, 1, 2, or 3 featured posts while preserving original Framer markup.
 */
export function syncFeaturedGrid(gridEl, featuredPosts) {
    if (!gridEl) return;
    const posts = featuredPosts || [];

    if (posts.length === 0) {
        gridEl.style.display = 'none';
        return;
    }
    gridEl.style.display = '';

    const p1 = posts[0];
    const p2 = posts[1];
    const p3 = posts[2];

    // Helper to toggle card container visibility
    const setVisible = (el, show) => {
        if (el) el.style.display = show ? '' : 'none';
    };

    // 1. Framer hydrated grid on /blog/ (.framer-ugj76m)
    if (gridEl.classList.contains('framer-ugj76m')) {
        const fbCards = gridEl.querySelectorAll('.framer-fb3t1t .framer-b3is9r-container');
        if (fbCards.length >= 3) {
            // Mobile variant rendered within .framer-fb3t1t
            syncFeaturedCard(fbCards[0].querySelector('a.framer-7Bi9P'), p1, { isHero: true, index: 0 });
            setVisible(fbCards[0], Boolean(p1));

            if (p2) {
                syncFeaturedCard(fbCards[1].querySelector('a.framer-7Bi9P'), p2, { isHero: false, index: 1 });
                setVisible(fbCards[1], true);
            } else {
                setVisible(fbCards[1], false);
            }

            if (p3) {
                syncFeaturedCard(fbCards[2].querySelector('a.framer-7Bi9P'), p3, { isHero: false, index: 2 });
                setVisible(fbCards[2], true);
            } else {
                setVisible(fbCards[2], false);
            }
        } else if (fbCards.length >= 1) {
            syncFeaturedCard(fbCards[0].querySelector('a.framer-7Bi9P'), p1, { isHero: true, index: 0 });
            setVisible(fbCards[0], Boolean(p1));
        }

        const sideCol = gridEl.querySelector('.framer-1jilkk2');
        const sideContainers = gridEl.querySelectorAll('.framer-1jilkk2 .framer-hww4bo-container');
        if (sideCol) {
            if (!p2 && !p3) {
                sideCol.style.display = 'none';
            } else {
                sideCol.style.display = '';
                if (sideContainers[0]) {
                    if (p2) {
                        syncFeaturedCard(sideContainers[0].querySelector('a.framer-7Bi9P'), p2, { isHero: false, index: 1 });
                        setVisible(sideContainers[0], true);
                    } else {
                        setVisible(sideContainers[0], false);
                    }
                }
                if (sideContainers[1]) {
                    if (p3) {
                        syncFeaturedCard(sideContainers[1].querySelector('a.framer-7Bi9P'), p3, { isHero: false, index: 2 });
                        setVisible(sideContainers[1], true);
                    } else {
                        setVisible(sideContainers[1], false);
                    }
                }
            }
        }
        return;
    }

    // 2. Framer grid on homepage or pre-hydration SSR (.framer-3lukgt)
    if (gridEl.classList.contains('framer-3lukgt')) {
        const tqCards = gridEl.querySelectorAll('.framer-1tq2jgu a.framer-7Bi9P');
        if (tqCards.length === 1) {
            syncFeaturedCard(tqCards[0], p1, { isHero: true, index: 0 });
        } else if (tqCards.length === 3) {
            // Hydrated mobile variant in .framer-1tq2jgu
            syncFeaturedCard(tqCards[0], p1, { isHero: true, index: 0 });
            setVisible(tqCards[0], Boolean(p1));

            if (p2) {
                syncFeaturedCard(tqCards[1], p2, { isHero: false, index: 1 });
                setVisible(tqCards[1], true);
            } else {
                setVisible(tqCards[1], false);
            }

            if (p3) {
                syncFeaturedCard(tqCards[2], p3, { isHero: false, index: 2 });
                setVisible(tqCards[2], true);
            } else {
                setVisible(tqCards[2], false);
            }
        } else if (tqCards.length > 3) {
            // Pre-hydration SSR with desktop + mobile variants
            const d1 = gridEl.querySelector('.framer-1tq2jgu .ssr-variant:not(.hidden-72rtr7) a.framer-7Bi9P');
            if (d1) syncFeaturedCard(d1, p1, { isHero: true, index: 0 });
            const mCards = gridEl.querySelectorAll('.framer-1tq2jgu .ssr-variant.hidden-72rtr7 a.framer-7Bi9P');
            if (mCards[0]) syncFeaturedCard(mCards[0], p1, { isHero: true, index: 0 });
            if (mCards[1]) {
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
            }
        }

        const v3Col = gridEl.querySelector('.framer-v3he4g');
        const v3Cards = gridEl.querySelectorAll('.framer-v3he4g a.framer-7Bi9P');
        if (v3Col) {
            if (!p2 && !p3) {
                v3Col.style.display = 'none';
            } else {
                v3Col.style.display = '';
                if (v3Cards[0]) {
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
                }
            }
        }
        return;
    }

    // 3. Fallback: query all visible cards in grid
    const allCards = Array.from(gridEl.querySelectorAll('a.framer-7Bi9P'));
    if (allCards[0] && p1) syncFeaturedCard(allCards[0], p1, { isHero: true, index: 0 });
    if (allCards[1]) {
        if (p2) {
            syncFeaturedCard(allCards[1], p2, { isHero: false, index: 1 });
            allCards[1].style.display = '';
        } else {
            allCards[1].style.display = 'none';
        }
    }
    if (allCards[2]) {
        if (p3) {
            syncFeaturedCard(allCards[2], p3, { isHero: false, index: 2 });
            allCards[2].style.display = '';
        } else {
            allCards[2].style.display = 'none';
        }
    }
}

/**
 * Synchronizes responsive variant class names on Framer regular cards.
 */
export function syncCardResponsiveVariant(cardEl) {
    const link = cardEl.querySelector('a');
    if (!link) return;
    const isMobile = window.innerWidth <= 809;
    const isTablet = window.innerWidth > 809 && window.innerWidth <= 1199;
    link.classList.remove('framer-v-6b3n5n', 'framer-v-1ejbd52', 'framer-v-gaszep');
    if (isMobile) {
        link.classList.add('framer-v-gaszep');
        link.setAttribute('data-framer-name', 'Mobile');
    } else if (isTablet) {
        link.classList.add('framer-v-1ejbd52');
        link.setAttribute('data-framer-name', 'Tablet');
    } else {
        link.classList.add('framer-v-6b3n5n');
        link.setAttribute('data-framer-name', 'Desktop Wide');
    }
}

/**
 * Synchronizes an individual regular card (.framer-ij7w41-container) with post data.
 */
export function syncRegularCard(cardEl, post) {
    if (!cardEl || !post) return;

    if (cardEl.getAttribute('data-post-slug') !== post.slug) {
        cardEl.setAttribute('data-post-slug', post.slug);
    }
    cardEl.setAttribute('data-dynamic-post', 'true');

    // Link
    const link = cardEl.querySelector('a');
    if (link) {
        const targetHref = `/blog/${post.slug}/`;
        if (link.getAttribute('href') !== targetHref) {
            link.setAttribute('href', targetHref);
        }
        link.removeAttribute('data-framer-page-link-current');
        attachCardHoverHandlers(link);
    }

    // Cover Image (thumbnail in .framer-1462w5l or direct img)
    const img = cardEl.querySelector('.framer-1462w5l img') || cardEl.querySelector('img');
    if (img) {
        const coverUrl = resolveCloudinaryImageUrl(post.cover_image) || 'https://res.cloudinary.com/teolzwgc/image/upload/f_auto,q_auto/corabin/blog-covers/custom-vs-off-the-shelf-choose-wisely-edb0902a';
        if (img.getAttribute('src') !== coverUrl) {
            img.src = coverUrl;
        }
        const altText = post.cover_image_alt || post.title || '';
        if (img.getAttribute('alt') !== altText) {
            img.alt = altText;
        }
        const srcset = generateResponsiveSrcset(post.cover_image);
        if (srcset) {
            if (img.getAttribute('srcset') !== srcset) {
                img.srcset = srcset;
            }
        } else if (img.hasAttribute('srcset')) {
            img.removeAttribute('srcset');
        }
        if (img.getAttribute('loading') !== 'lazy') {
            img.setAttribute('loading', 'lazy');
        }
        if (img.getAttribute('decoding') !== 'async') {
            img.setAttribute('decoding', 'async');
        }
    }

    // Date
    const formattedDate = formatArticleDate(post.published_at);
    const dateP = cardEl.querySelector('.framer-ie051f p') ||
                  cardEl.querySelector('[data-framer-name*="Dec"], [data-framer-name*="Jan"], [data-framer-name*="Date"]') ||
                  cardEl.querySelector('.framer-1m2k1ez p');
    if (dateP && dateP.textContent !== formattedDate) {
        dateP.textContent = formattedDate;
    }

    // Title
    const titleP = cardEl.querySelector('.framer-1pz7yr3 p') ||
                   cardEl.querySelector('[data-framer-name="Title"] p') ||
                   cardEl.querySelector('.framer-1pz7yr3');
    if (titleP && titleP.textContent !== post.title) {
        titleP.textContent = post.title;
    }

    syncCardResponsiveVariant(cardEl);
}

/**
 * Clones a regular card from a sample Framer card.
 */
export function cloneRegularCard(post, sampleCard) {
    const clone = sampleCard.cloneNode(true);
    syncRegularCard(clone, post);
    return clone;
}

/**
 * Synchronizes the regular card listing container (.framer-18dht5n) with published posts.
 * Removes duplicate featured slugs and maintains exact reverse-chronological order.
 */
export function syncRegularListing(container, regularPosts, featuredSlugs, sampleCard) {
    if (!container || !regularPosts || regularPosts.length === 0) return;

    // 1. Preserve or restore clean sample card template
    const sampleTemplate = sampleCard
        ? sampleCard.cloneNode(true)
        : (container.querySelector('.framer-ij7w41-container')?.cloneNode(true) || window.__corabinSampleCard);
    if (!sampleTemplate) return;
    if (!window.__corabinSampleCard) {
        window.__corabinSampleCard = sampleTemplate.cloneNode(true);
    }

    const regularSlugs = new Set(regularPosts.map(p => p.slug));

    // 2. Remove cards matching featured slugs (prevents duplicates) or NOT in regularSlugs
    container.querySelectorAll('.framer-ij7w41-container').forEach(c => {
        const slug = c.getAttribute('data-post-slug') || extractSlugFromHref(c.querySelector('a')?.getAttribute('href'));
        if (!slug || featuredSlugs?.has(slug) || !regularSlugs.has(slug)) {
            c.remove();
        }
    });

    // 3. Fast-path check: if already in sync with exact slugs and ordering, avoid touching DOM
    const currentCards = Array.from(container.querySelectorAll('.framer-ij7w41-container'));
    const isAlreadySynced = currentCards.length === regularPosts.length &&
        currentCards.every((c, idx) => (c.getAttribute('data-post-slug') || extractSlugFromHref(c.querySelector('a')?.getAttribute('href'))) === regularPosts[idx].slug);

    if (isAlreadySynced) {
        currentCards.forEach((card) => {
            syncCardResponsiveVariant(card);
            attachCardHoverHandlers(card.querySelector('a'));
        });
        const loadMore = container.querySelector('.framer-1xy7824');
        if (loadMore) loadMore.style.display = 'none';
        return;
    }

    // 4. Identify the Load More button container anchor
    const loadMore = container.querySelector('.framer-1xy7824');

    // 5. Render or update each regular post in exact reverse-chronological order
    for (let i = 0; i < regularPosts.length; i++) {
        const post = regularPosts[i];
        let card = container.querySelector(`[data-post-slug="${post.slug}"]`);
        if (!card) {
            for (const c of container.querySelectorAll('.framer-ij7w41-container')) {
                if (extractSlugFromHref(c.querySelector('a')?.getAttribute('href')) === post.slug) {
                    card = c;
                    break;
                }
            }
        }

        if (!card) {
            card = cloneRegularCard(post, sampleTemplate);
            card.setAttribute('data-animated', 'true');
            card.style.setProperty('--card-index', String(Math.min(i, 8)));
        } else {
            syncRegularCard(card, post);
        }

        if (loadMore) {
            container.insertBefore(card, loadMore);
        } else {
            container.appendChild(card);
        }
    }

    // Hide Load More since all published posts are already displayed
    if (loadMore) {
        loadMore.style.display = 'none';
    }
}

/**
 * Synchronizes the Homepage (#insights / .framer-k7mcxy) featured cards with live Supabase data.
 */
export async function initHomepageFeatured() {

    let posts = [];
    try {
        posts = await fetchPublishedPostsFromSupabase();
    } catch (err) {
        console.warn('Failed to load published posts for homepage featured section:', err);
        return;
    }
    if (!posts || posts.length === 0) return;

    const featuredPosts = selectFeaturedPosts(posts);

    function doSync() {
        const grid = document.querySelector('.framer-k7mcxy .framer-3lukgt, .framer-k7mcxy [data-framer-name="Grid"], .framer-3lukgt, .framer-ugj76m');
        if (grid) {
            syncFeaturedGrid(grid, featuredPosts);
        }
    }

    doSync();

    // Clean up any stale observer from detached elements across SPA navigation
    if (window.__corabinHomeObserver && window.__corabinHomeObservedEl && !document.body.contains(window.__corabinHomeObservedEl)) {
        window.__corabinHomeObserver.disconnect();
        window.__corabinHomeObserver = null;
        window.__corabinHomeObserverAttached = false;
    }

    // Attach MutationObserver to persist sync across Framer React hydration
    const targetSection = document.querySelector('.framer-k7mcxy, #insights, .framer-3lukgt') || document.getElementById('main') || document.body;
    if (targetSection && !window.__corabinHomeObserverAttached) {
        window.__corabinHomeObserverAttached = true;
        window.__corabinHomeObservedEl = targetSection;
        let isSyncing = false;
        let debounceTimer = null;
        const observer = new MutationObserver(() => {
            if (isSyncing) return;
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                if (isSyncing) return;
                isSyncing = true;
                try {
                    doSync();
                } finally {
                    observer.takeRecords();
                    isSyncing = false;
                }
            }, 60);
        });
        observer.observe(targetSection, { childList: true, subtree: true });
        window.__corabinHomeObserver = observer;
    }

    window.addEventListener('resize', () => {
        doSync();
    });
}

/**
 * Synchronizes the /blog/ listing page with published posts from Supabase.
 * Preserves the exact Framer regular card design, layout, and reverse chronological ordering.
 */
export async function initBlogListing() {
    ensureBlogAnimationStyles();

    let posts = [];
    try {
        posts = await fetchPublishedPostsFromSupabase();
    } catch (err) {
        console.warn('Failed to load published posts for blog listing:', err);
        return;
    }
    if (!posts || posts.length === 0) return;

    const featuredPosts = selectFeaturedPosts(posts);
    const featuredSlugs = new Set(featuredPosts.map(p => p.slug));
    const regularPosts = posts.filter(p => !featuredSlugs.has(p.slug));

    function syncFeatured() {
        const featGrid = document.querySelector('.framer-ugj76m, .framer-3lukgt');
        if (featGrid) {
            syncFeaturedGrid(featGrid, featuredPosts);
        }
    }

    function syncRegular() {
        const container = document.querySelector('.framer-18dht5n');
        if (!container) return false;

        let sample = window.__corabinSampleCard;
        if (!sample) {
            const existing = container.querySelector('.framer-ij7w41-container');
            if (existing) {
                sample = existing.cloneNode(true);
                window.__corabinSampleCard = sample;
            }
        }

        if (sample) {
            syncRegularListing(container, regularPosts, featuredSlugs, sample);
            return true;
        }
        return false;
    }

    function syncAll() {
        syncFeatured();
        syncRegular();
    }

    // Immediate sync pass for currently mounted DOM
    syncAll();

    // Re-check once when window finishes loading
    if (typeof window !== 'undefined') {
        window.addEventListener('load', syncAll, { once: true });
        window.addEventListener('resize', () => {
            syncFeatured();
            document.querySelectorAll('.framer-ij7w41-container').forEach(syncCardResponsiveVariant);
        });
    }

    // Clean up any stale observer from detached elements across SPA navigation
    if (window.__corabinBlogObserver && window.__corabinBlogObservedEl && !document.body.contains(window.__corabinBlogObservedEl)) {
        window.__corabinBlogObserver.disconnect();
        window.__corabinBlogObserver = null;
        window.__corabinBlogObserverAttached = false;
    }

    // Targeted, debounced MutationObserver on #main (or body) to react when Framer React mounts
    const targetEl = document.getElementById('main') || document.body;
    if (targetEl && !window.__corabinBlogObserverAttached) {
        window.__corabinBlogObserverAttached = true;
        window.__corabinBlogObservedEl = targetEl;
        let isSyncing = false;
        let debounceTimer = null;

        const observer = new MutationObserver(() => {
            if (isSyncing) return;
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                if (isSyncing) return;
                isSyncing = true;
                try {
                    syncAll();
                } finally {
                    observer.takeRecords();
                    isSyncing = false;
                }
            }, 50);
        });

        observer.observe(targetEl, { childList: true, subtree: true });
        window.__corabinBlogObserver = observer;
    }
}

/**
 * Universal Auto-Init
 */
export function initBlogSystem() {
    const pathname = window.location.pathname;
    const slug = resolveCurrentSlug();

    // 1. Article Route (e.g. /blog/some-article/ or ?slug=some-article)
    if (slug && slug !== 'blog' && slug !== 'index.html') {
        initSharedBlogArticle();
        return;
    }

    // Leaving or outside article route: completely clean up any lingering article runtime/observers
    cleanupArticleRuntime();

    // 2. Blog Listing Page (/blog/ or /blog/index.html)
    const isBlogListing = pathname === '/blog' ||
                          pathname === '/blog/' ||
                          pathname === '/blog/index.html' ||
                          pathname.endsWith('/blog/') ||
                          Boolean(document.querySelector('.framer-18dht5n') || (document.querySelector('.framer-ugj76m') && !document.querySelector('#insights')));
    if (isBlogListing && pathname.includes('/blog')) {
        initBlogListing();
        return;
    }

    // 3. Homepage (/ or /index.html)
    const isHomepage = pathname === '/' ||
                       pathname === '/index.html' ||
                       pathname === '' ||
                       Boolean(document.querySelector('#insights, .framer-k7mcxy'));
    if (isHomepage) {
        initHomepageFeatured();
        return;
    }
}

// Auto-run on DOM ready
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBlogSystem);
    } else {
        initBlogSystem();
    }
}

// Client-Side SPA History & Route Transition Listeners
if (typeof window !== 'undefined' && !window.__corabinRouteListenersAttached) {
    window.__corabinRouteListenersAttached = true;
    let currentPath = window.location.pathname;

    function normalizeFramerRouteUrl(url) {
        if (typeof url !== 'string' || !url) return url;
        if (url.startsWith('./blog/')) {
            return '/blog/' + url.slice(7);
        }
        if (url === './blog' || url === './blog/') {
            return '/blog/';
        }
        if (url.startsWith('./projects')) {
            return url.replace(/^\.\/projects/, '/projects');
        }
        if (url.startsWith('./about')) {
            return url.replace(/^\.\/about/, '/about');
        }
        if (url.startsWith('./contact')) {
            return url.replace(/^\.\/contact/, '/contact');
        }
        if (url.startsWith('./privacy')) {
            return url.replace(/^\.\/privacy/, '/privacy');
        }
        if (url.startsWith('./terms')) {
            return url.replace(/^\.\/terms/, '/terms');
        }
        if (url === './' || url === '.') {
            return '/';
        }
        if (url.startsWith('./')) {
            const rel = url.slice(2);
            if (window.location.pathname.startsWith('/blog')) {
                return '/blog/' + rel.replace(/^\/+/, '');
            }
            return '/' + rel;
        }
        if (url === '/blog/blog' || url.startsWith('/blog/blog/')) {
            return url.replace(/^\/blog\/blog\/?/, '/blog/');
        }
        return url;
    }

    // Immediately fix any active /blog/blog URL in browser location
    if (window.location.pathname.startsWith('/blog/blog')) {
        const cleanPath = window.location.pathname.replace(/^\/blog\/blog\/?/, '/blog/');
        window.history.replaceState(null, '', cleanPath + window.location.search + window.location.hash);
        currentPath = window.location.pathname;
    }

    function sanitizeHref(href) {
        if (!href || typeof href !== 'string') return href;
        if (href === './blog' || href === './blog/') return '/blog/';
        if (href.startsWith('./blog/')) return '/blog/' + href.slice(7);
        if (href.startsWith('./projects')) return href.replace(/^\.\/projects/, '/projects');
        if (href.startsWith('./about')) return href.replace(/^\.\/about/, '/about');
        if (href.startsWith('./contact')) return href.replace(/^\.\/contact/, '/contact');
        if (href.startsWith('./privacy')) return href.replace(/^\.\/privacy/, '/privacy');
        if (href.startsWith('./terms')) return href.replace(/^\.\/terms/, '/terms');
        if (href === './' || href === '.') return '/';
        if (href.startsWith('./')) {
            const rel = href.slice(2);
            if (window.location.pathname.startsWith('/blog')) {
                return '/blog/' + rel.replace(/^\/+/, '');
            }
            return '/' + rel;
        }
        if (href === '/blog/blog' || href.startsWith('/blog/blog/')) return href.replace(/^\/blog\/blog\/?/, '/blog/');
        return href;
    }

    function fixDomLinks() {
        document.querySelectorAll('a[href]').forEach(a => {
            const raw = a.getAttribute('href');
            const clean = sanitizeHref(raw);
            if (clean && clean !== raw) {
                a.setAttribute('href', clean);
            }
        });
    }

    // Capturing click listener to prevent relative link corruption
    // and safely handle dynamic article routes without Framer client-router collisions
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href]');
        if (!link) return;
        const raw = link.getAttribute('href');
        const clean = sanitizeHref(raw);
        if (clean && clean !== raw) {
            link.setAttribute('href', clean);
        }

        const effectiveHref = clean || raw;
        const targetSlug = extractSlugFromHref(effectiveHref);
        if (targetSlug && targetSlug !== 'blog' && targetSlug !== 'article.html' && targetSlug !== 'article' && targetSlug !== 'index.html') {
            // All blog article links (both baseline and dynamic CMS posts) must perform full document navigation
            // to load the shared Framer article template (/blog/article.html) cleanly through the server rewrite.
            // This prevents Framer client-router collisions, prevents cross-page DOM pollution, and ensures
            // pristine layout and animation state on every navigation.
            e.preventDefault();
            e.stopPropagation();
            window.location.href = effectiveHref;
        }
    }, true);

    fixDomLinks();
    window.addEventListener('load', fixDomLinks);

    const handleRouteChange = () => {
        if (window.location.pathname !== currentPath) {
            currentPath = window.location.pathname;
            const newSlug = resolveCurrentSlug();
            if (!newSlug || newSlug === 'blog' || newSlug === 'index.html') {
                cleanupArticleRuntime();
            }
            fixDomLinks();
            setTimeout(() => {
                initBlogSystem();
                fixDomLinks();
            }, 60);
        }
    };

    window.addEventListener('popstate', handleRouteChange);

    window.addEventListener('pageshow', (event) => {
        const currentSlug = resolveCurrentSlug();
        if (!currentSlug || currentSlug === 'blog' || currentSlug === 'index.html') {
            cleanupArticleRuntime();
            if (event.persisted) {
                initBlogSystem();
            }
        }
    });

    const origPush = history.pushState;
    if (origPush) {
        history.pushState = function(state, title, url) {
            const cleanUrl = normalizeFramerRouteUrl(url);
            const res = origPush.call(this, state, title, cleanUrl);
            handleRouteChange();
            return res;
        };
    }

    const origReplace = history.replaceState;
    if (origReplace) {
        history.replaceState = function(state, title, url) {
            const cleanUrl = normalizeFramerRouteUrl(url);
            const res = origReplace.call(this, state, title, cleanUrl);
            handleRouteChange();
            return res;
        };
    }
}
