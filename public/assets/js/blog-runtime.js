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
export const SUPABASE_PROJECT_URL = window.__CORABIN_SUPABASE_URL__ || 'https://oplfhsqycxroqyrdruej.supabase.co';
export const SUPABASE_ANON_KEY = window.__CORABIN_SUPABASE_ANON_KEY__ || localStorage.getItem('corabin_supabase_anon_key') || 'sb_publishable_c2_9jMvBS9iNxTqX9eyj2Q_oG0t2oVl';
export const CLOUDINARY_CLOUD_NAME = 'teolzwgc';
export const CLOUDINARY_BLOG_COVERS_FOLDER = 'corabin/blog-covers';

const REQUIRED_ARTICLE_COLUMNS = 'id,slug,title,excerpt,content,category,status,published_at,author,cover_image,cover_image_alt,seo_title,meta_description,canonical_url,og_image';
const REQUIRED_LISTING_COLUMNS = 'slug,title,excerpt,category,status,published_at,cover_image,cover_image_alt,featured';

/**
 * Resolves a stored image reference into an optimized Cloudinary delivery URL.
 * Supports:
 * - Cloudinary public IDs (e.g. "corabin/blog-covers/sample-id")
 * - Full URLs (pass-through)
 * - Local static paths (/assets/images/blogs/...)
 */
export function resolveCloudinaryImageUrl(imageRef, options = {}) {
    if (!imageRef || typeof imageRef !== 'string') return null;
    const clean = imageRef.trim();
    if (!clean) return null;

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
    const clean = imageRef.trim();
    if (!clean) return '';

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
    const blogIdx = segments.indexOf('blog');
    if (blogIdx !== -1 && segments[blogIdx + 1] && segments[blogIdx + 1] !== 'article.html') {
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
export async function fetchPostFromSupabase(slug, anonKey = SUPABASE_ANON_KEY) {
    if (!anonKey) {
        return {
            status: 'pending_connection',
            dependency: 'Supabase client anon key is not configured in client runtime. Querying public.posts is paused.',
            slug
        };
    }

    try {
        const endpoint = `${SUPABASE_PROJECT_URL}/rest/v1/posts?slug=eq.${encodeURIComponent(slug)}&status=eq.published&select=${REQUIRED_ARTICLE_COLUMNS}`;
        const res = await fetch(endpoint, {
            headers: {
                'apikey': anonKey,
                'Authorization': `Bearer ${anonKey}`,
                'Accept': 'application/json'
            }
        });

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
        const excerptEl = document.querySelector('.framer-1ig6rss h2') || document.querySelector('[data-excerpt]');
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
    if (el) {
        el.setAttribute(attribute, value);
    }
}

/**
 * Sets up and mounts the shared article template runtime.
 */
export async function initSharedBlogArticle() {
    const root = document.getElementById('main');
    if (!root) return;

    const slug = resolveCurrentSlug();
    if (!slug) return;

    // Read initial metadata from DOM attributes if available
    const initialTitle = root.dataset.title || document.title.replace(/\s*—\s*Corabin.*$/, '').trim();
    const initialDate = root.dataset.date || '';
    const initialAuthor = root.dataset.author || 'Souvik';
    const initialExcerpt = root.dataset.excerpt || document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
    const initialImage = root.dataset.coverImage || '';

    // Check if initial HTML already has valid pre-rendered content (non-placeholder)
    const existingBodyEl = root.querySelector('.framer-1272rho') || document.getElementById('article-body-content');
    const hasPreRenderedContent = existingBodyEl &&
                                  !existingBodyEl.querySelector('.corabin-supabase-state') &&
                                  existingBodyEl.children.length > 0;

    // Fetch live post data from Supabase using public anon key
    const supabaseResult = await fetchPostFromSupabase(slug);

    if (supabaseResult.status === 'success' && supabaseResult.post) {
        const post = supabaseResult.post;
        const activeTitle = post.title || initialTitle;
        const activeDate = post.published_at || initialDate;
        const activeExcerpt = post.excerpt || post.meta_description || initialExcerpt;
        const activeImage = post.cover_image || initialImage;

        let activeAuthor = initialAuthor;
        if (post.author) {
            activeAuthor = typeof post.author === 'object' ? (post.author.name || 'Souvik') : String(post.author);
        }

        const resolvedCover = resolveCloudinaryImageUrl(activeImage) || '/assets/images/blogs/blog1.webp';
        const resolvedSrcset = generateResponsiveSrcset(activeImage);
        const formattedDate = formatArticleDate(activeDate);

        // Update Document Title and Head Metadata for dynamic routes
        document.title = `${activeTitle} — Corabin`;
        updateMetaTag('meta[name="description"]', 'content', post.meta_description || activeExcerpt);
        updateMetaTag('meta[property="og:title"]', 'content', `${activeTitle} — Corabin`);
        updateMetaTag('meta[property="og:description"]', 'content', post.meta_description || activeExcerpt);
        updateMetaTag('meta[property="og:image"]', 'content', resolvedCover);
        updateMetaTag('meta[property="og:url"]', 'content', post.canonical_url || `https://corabin.com/blog/${slug}`);
        updateMetaTag('link[rel="canonical"]', 'href', post.canonical_url || `https://corabin.com/blog/${slug}`);

        // Update Hero DOM elements
        const titleEl = root.querySelector('.framer-1ltkmql h1');
        if (titleEl && activeTitle) titleEl.textContent = activeTitle;

        const dateEl = root.querySelector('.framer-ybkmy time');
        const dateP = root.querySelector('.framer-ybkmy p');
        if (dateEl) {
            dateEl.dateTime = activeDate;
            dateEl.textContent = formattedDate;
            if (dateP) {
                dateP.innerHTML = `<time datetime="${activeDate}">${formattedDate}</time>`;
            }
        }

        const authorEl = root.querySelector('.framer-y7unnl p');
        if (authorEl && activeAuthor) authorEl.textContent = activeAuthor;

        const excerptEl = root.querySelector('.framer-1ig6rss h2');
        if (excerptEl && activeExcerpt) excerptEl.textContent = activeExcerpt;

        // Social Share links
        const fbShare = root.querySelector('a[aria-label="Share on Facebook"]');
        if (fbShare) fbShare.href = `https://www.facebook.com/sharer/sharer.php?u=https://corabin.com/blog/${slug}`;
        const xShare = root.querySelector('a[aria-label="Share on X"]');
        if (xShare) xShare.href = `https://twitter.com/intent/tweet?url=https://corabin.com/blog/${slug}&text=${encodeURIComponent(activeTitle)}`;
        const liShare = root.querySelector('a[aria-label="Share on LinkedIn"]');
        if (liShare) liShare.href = `https://www.linkedin.com/sharing/share-offsite/?url=https://corabin.com/blog/${slug}`;

        // Render Body Content: only update if not pre-rendered or if updated_at changed or fallback shell
        if (existingBodyEl) {
            const isPreRendered = existingBodyEl.getAttribute('data-pre-rendered') === 'true' && !existingBodyEl.querySelector('.corabin-supabase-state');
            const isFallbackShell = root.dataset.rendered === 'false' || !root.dataset.blogSlug;
            const hasUpdate = post.updated_at && root.dataset.updatedAt && post.updated_at !== root.dataset.updatedAt;
            if (!isPreRendered || isFallbackShell || hasUpdate) {
                existingBodyEl.innerHTML = parseArticleContent(post.content);
                existingBodyEl.setAttribute('data-pre-rendered', 'true');
                root.setAttribute('data-rendered', 'true');
            }
        }

        const coverImg = root.querySelector('.framer-z182eh img');
        if (coverImg && resolvedCover) {
            coverImg.src = resolvedCover;
            if (resolvedSrcset) coverImg.srcset = resolvedSrcset;
            coverImg.alt = post.cover_image_alt || activeTitle;
        }
    } else if (supabaseResult.status === 'not_found') {
        // If not found and no pre-rendered content, render elegant 404 state
        if (!hasPreRenderedContent) {
            document.title = 'Article Not Found — Corabin';
            const titleEl = root.querySelector('.framer-1ltkmql h1');
            if (titleEl) titleEl.textContent = 'Article Not Found';

            if (existingBodyEl) {
                existingBodyEl.innerHTML = `
                    <div class="corabin-supabase-state" style="border-left-color: #e53e3e;">
                        <div class="corabin-supabase-state-title" style="color: #e53e3e;">
                            <span class="corabin-supabase-state-badge" style="background: rgba(229, 62, 62, 0.1); color: #e53e3e;">Not Found</span>
                            Article Unavailable
                        </div>
                        <p class="corabin-supabase-state-desc">
                            The requested article is not currently published or does not exist.
                        </p>
                        <p style="margin-top: 16px;">
                            <a href="/blog" class="framer-styles-preset-1k8uo92" style="font-weight: 500;">← Return to all articles</a>
                        </p>
                    </div>
                `;
            }
        }
    } else if (!hasPreRenderedContent) {
        // Pending connection / unconfigured state
        if (existingBodyEl) {
            existingBodyEl.innerHTML = `
                <div class="corabin-supabase-state">
                    <div class="corabin-supabase-state-title">
                        <span class="corabin-supabase-state-badge">Supabase Schema Ready</span>
                        Article Content Layer Active
                    </div>
                    <p class="corabin-supabase-state-desc">
                        The full article content for <code>${slug}</code> is stored in Supabase table <code>public.posts</code>.
                    </p>
                </div>
            `;
        }
    }
}

/**
 * Synchronizes the /blog/ listing page with published posts from Supabase.
 * Preserves the exact Framer card design, layout, and reverse chronological ordering.
 */
export async function initBlogListing() {
    const isListing = window.location.pathname === '/blog' ||
                      window.location.pathname === '/blog/' ||
                      window.location.pathname === '/blog/index.html' ||
                      Boolean(document.querySelector('.framer-3lukgt') || document.querySelector('.framer-ugj76m'));
    if (!isListing) return;

    const posts = await fetchPublishedPostsFromSupabase();
    if (!posts || posts.length === 0) return;

    function createCardElement(post, isMobile = false) {
        const formattedDate = formatArticleDate(post.published_at);
        const coverUrl = resolveCloudinaryImageUrl(post.cover_image) || '/assets/images/blogs/blog1.webp';
        const srcset = generateResponsiveSrcset(post.cover_image);
        const altText = post.cover_image_alt || post.title;
        const variantClass = isMobile ? 'framer-v-174qcj7' : 'framer-v-f4x1p0';
        const variantName = isMobile ? 'Mobile' : 'Desktop';

        const cardWrapper = document.createElement('div');
        cardWrapper.className = 'framer-1o9a060-container';
        cardWrapper.setAttribute('data-post-slug', post.slug);
        cardWrapper.setAttribute('data-dynamic-post', 'true');
        cardWrapper.innerHTML = `
            <a class="framer-7Bi9P framer-bIdlB framer-GgXrq framer-f4x1p0 ${variantClass} framer-1fa5qs8" data-framer-name="${variantName}" href="/blog/${post.slug}" style="width:100%">
                <div class="framer-1vaignd" data-framer-name="Image Wrapper" style="border-bottom-left-radius:12px;border-bottom-right-radius:12px;border-top-left-radius:12px;border-top-right-radius:12px">
                    <div class="framer-vcvfqo" data-framer-name="Featured Image" style="transform:none">
                        <div style="position:absolute;border-radius:inherit;corner-shape:inherit;top:0;right:0;bottom:0;left:0" data-framer-background-image-wrapper="true">
                            <img decoding="async" width="2688" height="1792" src="${coverUrl}" ${srcset ? `srcset="${srcset}"` : ''} alt="${altText}" style="display:block;width:100%;height:100%;border-radius:inherit;corner-shape:inherit;object-position:center;object-fit:cover">
                        </div>
                    </div>
                    <div class="framer-8piq4i" data-framer-name="Icon Wrapper" style="background-color:rgb(243, 243, 241);border-bottom-left-radius:100px;border-bottom-right-radius:100px;border-top-left-radius:100px;border-top-right-radius:100px">
                        <div class="framer-lsr854-container">
                            <div class="framer-Mavv5 framer-1l4ntg0 framer-v-1l4ntg0" data-framer-name="Arrow Top Right" style="height:100%;width:100%">
                                <div data-framer-component-type="SVG" data-framer-name="Arrow-narrow-up-right" parentsize="0" _constraints="[object Object]" rotation="0" shadows class="framer-eaa5ru" aria-hidden="true" style="image-rendering:pixelated;flex-shrink:0;fill:var(--token-cd9ab9a9-1d98-4bbc-9f79-c98ab7a3770b, rgb(0, 72, 249));color:var(--token-cd9ab9a9-1d98-4bbc-9f79-c98ab7a3770b, rgb(0, 72, 249))">
                                    <div class="svgContainer" style="width:100%;height:100%;aspect-ratio:inherit"><svg style="width:100%;height:100%;" viewBox="0 0 32 32"><use href="#svg-134287132_231"/></svg></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="framer-1gz1ey8" data-framer-name="Content Wrapper">
                    <div class="framer-gifdkw" data-framer-name="Date" data-framer-component-type="RichTextContainer" style="--framer-paragraph-spacing:0px;opacity:0.7;transform:none">
                        <p class="framer-text framer-styles-preset-2tzpld" data-styles-preset="polLgksOM">${formattedDate}</p>
                    </div>
                    <div class="framer-giavb9" data-framer-name="Title" data-framer-component-type="RichTextContainer" style="--framer-paragraph-spacing:0px;transform:none">
                        <p class="framer-text framer-styles-preset-1gjhefo" data-styles-preset="pLdfyfLcz" dir="auto">${post.title}</p>
                    </div>
                </div>
            </a>
        `;
        return cardWrapper;
    }

    function syncListingDOM() {
        const gridContainer = document.querySelector('.framer-ugj76m') || document.querySelector('.framer-3lukgt');
        const desktopGrid = gridContainer?.querySelector('.framer-fb3t1t') ||
                            gridContainer?.querySelector('.framer-1tq2jgu .hidden-1fvi3ca') ||
                            gridContainer?.querySelector('.framer-v3he4g') ||
                            gridContainer;
        const mobileContainer = gridContainer?.querySelector('.framer-1tq2jgu .hidden-72rtr7');

        if (!desktopGrid && !gridContainer) return;

        // Gather all existing post slugs in the document
        const existingSlugs = new Set();
        document.querySelectorAll('a[href*="/blog/"]').forEach(a => {
            const href = a.getAttribute('href') || '';
            const match = href.match(/(?:\/|\.\/)?blog\/([a-zA-Z0-9_-]+)/);
            if (match && match[1] && match[1] !== 'index.html' && match[1] !== 'article.html') {
                existingSlugs.add(match[1]);
            }
        });

        // Find posts in Supabase that are not yet rendered in the DOM
        const missingPosts = posts.filter(p => !existingSlugs.has(p.slug));
        if (missingPosts.length > 0 && desktopGrid) {
            for (let i = missingPosts.length - 1; i >= 0; i--) {
                const post = missingPosts[i];
                const card = createCardElement(post, false);
                desktopGrid.insertBefore(card, desktopGrid.firstChild);
                if (mobileContainer) {
                    const mobileCard = createCardElement(post, true);
                    mobileContainer.insertBefore(mobileCard, mobileContainer.firstChild);
                }
            }
        }
    }

    syncListingDOM();

    // Attach MutationObserver to #main so newly published posts remain visible after Framer hydration
    const mainEl = document.getElementById('main');
    if (mainEl && !window.__corabinBlogObserverAttached) {
        window.__corabinBlogObserverAttached = true;
        let debounceTimer;
        const observer = new MutationObserver(() => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                syncListingDOM();
            }, 100);
        });
        observer.observe(mainEl, { childList: true, subtree: true });
    }
}

/**
 * Universal Auto-Init
 */
export function initBlogSystem() {
    const isListingPage = window.location.pathname === '/blog' ||
                          window.location.pathname === '/blog/' ||
                          window.location.pathname === '/blog/index.html' ||
                          Boolean(document.querySelector('.framer-3lukgt') || document.querySelector('.framer-ugj76m'));
    const slug = resolveCurrentSlug();

    if (isListingPage && (!slug || slug === 'blog')) {
        initBlogListing();
    } else if (slug && slug !== 'blog') {
        initSharedBlogArticle();
    }
}

// Auto-run on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBlogSystem);
} else {
    initBlogSystem();
}
