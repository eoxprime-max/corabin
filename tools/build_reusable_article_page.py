#!/usr/bin/env python3
"""
tools/build_reusable_article_page.py
====================================
Generates public/blog/article.html from the authentic original Framer article DOM (/tmp/real_hydrated_custom_article.html).
Preserves the actual DOM structure, styles, fonts, breakpoints, spacing, typography, hero, footer, and SVGs.
Replaces article-specific data with dynamic Supabase loading and Cloudinary delivery.
"""

import os
import re

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(SCRIPT_DIR, '..'))
RENDERED_SOURCE = '/tmp/real_hydrated_custom_article.html'
DEST_PATH = os.path.join(PROJECT_ROOT, 'public', 'blog', 'article.html')

with open(RENDERED_SOURCE, 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Update Title and Meta tags in <head>
html = re.sub(
    r'<title>.*?</title>',
    '<title>Article — Corabin</title>',
    html
)
html = re.sub(
    r'<meta name="description" content=".*?">',
    '<meta name="description" id="meta-description" content="In-depth articles on custom web architecture, conversion-driven design, and modern digital engineering.">',
    html
)
html = re.sub(
    r'<link rel="canonical" href="https://corabin.com/blog/.*?">',
    '<link rel="canonical" id="meta-canonical" href="https://corabin.com/blog/">',
    html
)

# 2. Fix unescaped newline in __framer__breakpoints JSON
html = re.sub(
    r'(<script type="framer/appear" id="__framer__breakpoints">)([\s\S]*?)(</script>)',
    lambda m: m.group(1) + m.group(2).replace('\n', ' ').replace('\r', ' ') + m.group(3),
    html
)

# 3. Add Authentic Framer Article CSS & runtime typography overrides
article_css = """
<style data-framer-article-css="">
/* Authentic Framer Article Layout & Typography */
.framer-xnkHH.framer-5wr3nx, .framer-xnkHH .framer-5wr3nx { display: block; }
.framer-xnkHH.framer-1yc8rq2 { place-content: center flex-start; align-items: center; display: flex; flex-flow: column; gap: 0px; height: min-content; overflow: hidden; padding: 0px; position: relative; width: 100%; }
.framer-xnkHH .framer-p85gyj { place-content: center; align-items: center; background-color: var(--token-a4df3636-53b0-4779-b6cc-9bd50f685908, #f3f3f1); display: flex; flex: 0 0 auto; flex-flow: column; gap: 64px; height: min-content; min-height: 90vh; overflow: hidden; padding: 200px 60px 60px; position: relative; width: 100%; }
.framer-xnkHH .framer-1ekua6s { place-content: center flex-start; align-items: center; display: flex; flex: 0 0 auto; flex-flow: column; gap: 32px; height: min-content; overflow: visible; padding: 0px; position: relative; width: 100%; will-change: var(--framer-will-change-effect-override, transform); z-index: 2; }
.framer-xnkHH .framer-1ltkmql { --framer-link-text-color: #0099ff; --framer-link-text-decoration: underline; flex: 0 0 auto; height: auto; max-width: 1000px; position: relative; white-space: pre-wrap; width: 100%; word-break: break-word; overflow-wrap: break-word; }
.framer-xnkHH .framer-16ganb5 { place-content: center space-between; align-items: center; display: flex; flex: 0 0 auto; flex-flow: row; height: min-content; max-width: 600px; overflow: visible; padding: 0px; position: relative; width: 100%; }
.framer-xnkHH .framer-lipgb4 { place-content: center; align-items: center; display: flex; flex: 0 0 auto; flex-flow: row; gap: 16px; height: min-content; overflow: hidden; padding: 0px; position: relative; width: min-content; }
.framer-xnkHH .framer-1p877mm { --border-bottom-width: 2px; --border-color: var(--token-bb407a59-7892-4758-ae44-34831ff9d303, #0c120c); --border-left-width: 2px; --border-right-width: 2px; --border-style: solid; --border-top-width: 2px; aspect-ratio: 1 / 1; border-radius: 999px; flex: 0 0 auto; height: var(--framer-aspect-ratio-supported, 64px); overflow: hidden; position: relative; width: 64px; will-change: var(--framer-will-change-override, transform); }
.framer-xnkHH .framer-15d7qcn { place-content: flex-start center; align-items: flex-start; display: flex; flex: 0 0 auto; flex-flow: column; gap: 4px; height: min-content; overflow: hidden; padding: 0px; position: relative; width: min-content; }
.framer-xnkHH .framer-y7unnl, .framer-xnkHH .framer-ybkmy { --framer-link-text-color: #0099ff; --framer-link-text-decoration: underline; flex: 0 0 auto; height: auto; position: relative; white-space: pre; width: auto; }
.framer-xnkHH .framer-le4leg { place-content: center; align-items: center; display: flex; flex: 0 0 auto; flex-flow: row; gap: 6px; height: min-content; overflow: visible; padding: 0px; position: relative; width: min-content; }
.framer-xnkHH .framer-15rtoso-container, .framer-xnkHH .framer-1jorree-container, .framer-xnkHH .framer-g9kd8e-container, .framer-xnkHH .framer-11wimsg-container { flex: 0 0 auto; height: auto; position: relative; width: auto; }
.framer-xnkHH .framer-z182eh { flex: 0 0 auto; height: 120%; left: calc(2.13163e-14%); opacity: 0.7; overflow: hidden; position: absolute; top: calc(-10%); width: 100%; will-change: var(--framer-will-change-effect-override, transform); z-index: 0; }
.framer-xnkHH .framer-hprlou { background: linear-gradient(180deg, rgba(242, 242, 240, 0.5) 0%, var(--token-8e40c9bb-798b-4b01-b44f-6ce860eedadb, rgb(255, 255, 255)) 100%); flex: 0 0 auto; height: 100%; left: calc(2.13163e-14%); overflow: hidden; position: absolute; top: calc(2.13163e-14%); width: 100%; z-index: 1; }
.framer-xnkHH .framer-3x2kfl { place-content: center; align-items: center; display: flex; flex: 0 0 auto; flex-flow: column; gap: 64px; height: min-content; overflow: visible; padding: 100px 60px; position: relative; width: 100%; }
.framer-xnkHH .framer-1ynlqum { place-content: center flex-start; align-items: center; display: flex; flex: 0 0 auto; flex-flow: column; gap: 60px; height: min-content; max-width: 800px; overflow: visible; padding: 0px; position: relative; width: 100%; z-index: 2; }
.framer-xnkHH .framer-1ig6rss { --framer-link-text-color: #0099ff; --framer-link-text-decoration: underline; flex: 0 0 auto; height: auto; position: relative; white-space: pre-wrap; width: 100%; word-break: break-word; overflow-wrap: break-word; }
.framer-xnkHH .framer-1272rho { --framer-link-text-color: #0099ff; --framer-link-text-decoration: underline; --framer-paragraph-spacing: 48px; flex: 0 0 auto; height: auto; position: relative; white-space: pre-wrap; width: 100%; word-break: break-word; overflow-wrap: break-word; }
.framer-xnkHH .framer-px4s1i { place-content: center flex-start; align-items: center; display: flex; flex: 0 0 auto; flex-flow: column; gap: 0px; height: min-content; overflow: visible; padding: 100px 60px; position: relative; width: 100%; }
.framer-xnkHH .framer-1l0gdgp { place-content: flex-start center; align-items: flex-start; display: flex; flex: 0 0 auto; flex-flow: row; gap: 64px; height: min-content; max-width: 1800px; overflow: hidden; padding: 0px; position: relative; width: 100%; }
.framer-xnkHH .framer-1ljthvh { place-content: flex-start; align-items: flex-start; display: flex; flex: 1 0 0px; flex-flow: column; gap: 30px; height: min-content; overflow: visible; padding: 0px; position: relative; width: 1px; z-index: 1; }
.framer-xnkHH .framer-rfsnq0 { --framer-paragraph-spacing: 0px; flex: 0 0 auto; height: auto; position: relative; white-space: pre-wrap; width: 100%; word-break: break-word; overflow-wrap: break-word; }
.framer-xnkHH .framer-1v435k6 { --framer-paragraph-spacing: 0px; flex: 0 0 auto; height: auto; max-width: 400px; position: relative; white-space: pre-wrap; width: 100%; word-break: break-word; overflow-wrap: break-word; }
.framer-xnkHH .framer-ffkmv5 { place-content: flex-start center; align-items: flex-start; display: flex; flex: 2 0 0px; flex-flow: column; gap: 0px; height: min-content; padding: 0px; position: relative; width: 1px; }
.framer-xnkHH .framer-2gobjs-container { flex: 0 0 auto; height: auto; position: relative; width: 100%; }
.framer-xnkHH .framer-hoe7yd { place-content: center flex-start; align-items: center; display: flex; flex: 0 0 auto; flex-flow: row; gap: 10px; height: min-content; overflow: hidden; padding: 40px 0px 0px; position: relative; width: 100%; }
.framer-xnkHH .framer-jpwizs-container { flex: 0 0 auto; height: auto; left: 50%; position: absolute; top: 0px; transform: translateX(-50%); width: auto; z-index: 1; }
.framer-xnkHH[data-border="true"]::after, .framer-xnkHH [data-border="true"]::after { content: ""; border-width: var(--border-top-width, 0) var(--border-right-width, 0) var(--border-bottom-width, 0) var(--border-left-width, 0); border-color: var(--border-color, none); border-style: var(--border-style, none); width: 100%; height: 100%; position: absolute; box-sizing: border-box; left: 0px; top: 0px; border-radius: inherit; corner-shape: inherit; pointer-events: none; }

@media (min-width: 700px) and (max-width: 1439.98px) {
  .framer-xnkHH.framer-1yc8rq2 { width: 100%; }
  .framer-xnkHH .framer-p85gyj { min-height: unset; padding: 220px 40px 160px; }
  .framer-xnkHH .framer-16ganb5 { max-width: 500px; }
  .framer-xnkHH .framer-1p877mm { height: var(--framer-aspect-ratio-supported, 54px); width: 54px; }
  .framer-xnkHH .framer-3x2kfl, .framer-xnkHH .framer-px4s1i { padding: 60px 40px; }
  .framer-xnkHH .framer-1l0gdgp { flex-direction: column; gap: 50px; }
  .framer-xnkHH .framer-1ljthvh, .framer-xnkHH .framer-ffkmv5 { flex: 0 0 auto; width: 100%; }
}

@media (max-width: 699.98px) {
  .framer-xnkHH.framer-1yc8rq2 { width: 100%; }
  .framer-xnkHH .framer-p85gyj { min-height: unset; padding: 180px 20px 100px; }
  .framer-xnkHH .framer-16ganb5 { flex-direction: column; gap: 24px; justify-content: flex-start; }
  .framer-xnkHH .framer-lipgb4 { gap: 12px; }
  .framer-xnkHH .framer-1p877mm { width: 48px; }
  .framer-xnkHH .framer-15d7qcn { gap: 2px; }
  .framer-xnkHH .framer-le4leg { gap: 4px; }
  .framer-xnkHH .framer-3x2kfl, .framer-xnkHH .framer-px4s1i { padding: 50px 20px; }
  .framer-xnkHH .framer-1l0gdgp { flex-direction: column; gap: 40px; justify-content: flex-start; }
  .framer-xnkHH .framer-1ljthvh { flex: 0 0 auto; gap: 20px; width: 100%; }
  .framer-xnkHH .framer-ffkmv5 { flex: 0 0 auto; gap: 12px; width: 100%; }
  .framer-xnkHH .framer-hoe7yd { padding: 30px 0px 0px; }
}

[data-framer-appear-id] {
    opacity: 1 !important;
    transform: none !important;
}
.ssr-variant {
    opacity: 1 !important;
}
#article-body-content {
    min-height: 200px;
}
#article-body-content h1,
#article-body-content h2,
#article-body-content h3 {
    margin-top: 40px;
    margin-bottom: 16px;
}
#article-body-content p {
    margin-bottom: 20px;
    line-height: 1.8;
}
#article-body-content ul,
#article-body-content ol {
    margin: 24px 0;
    padding-left: 28px;
    line-height: 1.8;
}
#article-body-content li {
    margin-bottom: 10px;
}
#article-body-content code {
    font-family: monospace;
    background-color: rgba(0, 0, 0, 0.05);
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.9em;
}
#article-body-content pre {
    background-color: #0c120c;
    color: #fff;
    padding: 20px;
    border-radius: 12px;
    overflow-x: auto;
    margin: 24px 0;
}
#article-body-content a {
    color: var(--token-cd9ab9a9-1d98-4bbc-9f79-c98ab7a3770b, rgb(0, 72, 249));
    text-decoration: underline;
}
</style>
</head>
"""

html = html.replace('</head>', article_css, 1)

# 4. Clean up id="main" attributes
html = re.sub(
    r'<div id="main" role="main" data-framer-hydrate-v2="[^"]*"',
    '<div id="main" role="main" data-blog-slug="" data-rendered="false"',
    html
)
html = re.sub(
    r'<div id="main" role="main"[^>]*>',
    '<div id="main" role="main" data-blog-slug="" data-rendered="false" data-framer-ssr-released-at="2026-05-19T15:13:01.659Z" data-framer-page-optimized-at="2026-05-22T13:47:36.567Z" data-framer-generated-page="">',
    html
)

# 5. Replace Hero Title
html = re.sub(
    r'<h1 class="framer-text framer-styles-preset-9meupv" data-styles-preset="ecQl5A1yh" style="--framer-text-alignment: center;">.*?</h1>',
    '<h1 id="article-title" class="framer-text framer-styles-preset-9meupv" data-styles-preset="ecQl5A1yh" style="--framer-text-alignment: center;">Article</h1>',
    html
)

# 6. Replace Author Name
html = re.sub(
    r'<p class="framer-text framer-styles-preset-1gjhefo" data-styles-preset="pLdfyfLcz" dir="auto">Souvik</p>',
    '<p id="article-author" class="framer-text framer-styles-preset-1gjhefo" data-styles-preset="pLdfyfLcz" dir="auto">Souvik</p>',
    html
)

# 7. Replace Date
html = re.sub(
    r'<time datetime="[^"]*">[^<]*</time>',
    '<time id="article-date" datetime=""></time>',
    html
)

# 8. Replace Cover Image
html = re.sub(
    r'<div class="framer-z182eh"[^>]*>.*?</div>\s*</div>\s*<div class="framer-hprlou"',
    '''<div class="framer-z182eh" data-framer-appear-id="z182eh" data-framer-name="Background Image" style="will-change: transform; opacity: 0.422607; transform: none;"><div data-framer-background-image-wrapper="true" style="position: absolute; border-radius: inherit; corner-shape: inherit; inset: 0px;"><img id="article-cover-img" decoding="auto" width="1672" height="941" sizes="100vw" srcset="/assets/images/blogs/blog1.png 512w, /assets/images/blogs/blog1.png 1024w, /assets/images/blogs/blog1.png 1672w" src="/assets/images/blogs/blog1.png" alt="" style="display: block; width: 100%; height: 100%; border-radius: inherit; corner-shape: inherit; object-position: 50% 50%; object-fit: cover;"></div></div><div class="framer-hprlou"''',
    html,
    flags=re.DOTALL
)

# 9. Replace Excerpt
html = re.sub(
    r'<h2 class="framer-text framer-styles-preset-1gjhefo" data-styles-preset="pLdfyfLcz" style="--framer-text-color: var\(--token-bb407a59-7892-4758-ae44-34831ff9d303, rgb\(12, 18, 12\)\);">(?:.*?</h2>)',
    '<h2 id="article-excerpt" class="framer-text framer-styles-preset-1gjhefo" data-styles-preset="pLdfyfLcz" style="--framer-text-color: var(--token-bb407a59-7892-4758-ae44-34831ff9d303, rgb(12, 18, 12));"></h2>',
    html
)

# 10. Replace Article Body Content
html = re.sub(
    r'<div class="framer-1272rho" data-framer-component-type="RichTextContainer" style="transform: none;">.*?</div>',
    '<div class="framer-1272rho" data-framer-component-type="RichTextContainer" id="article-body-content" style="transform: none;"><div id="article-loading" style="padding: 40px 0; text-align: center; color: #888;">Loading article...</div></div>',
    html,
    count=1,
    flags=re.DOTALL
)

# 11. Fix relative links href="../" to "/"
html = html.replace('href="../"', 'href="/"')
html = html.replace('href="../projects"', 'href="/projects"')
html = html.replace('href="../blog"', 'href="/blog"')
html = html.replace('href="../about"', 'href="/about"')
html = html.replace('href="../contact"', 'href="/contact"')
html = html.replace('href="../privacy"', 'href="/privacy"')
html = html.replace('href="../terms"', 'href="/terms"')

# 12. Add runtime script
runtime_script = """
    <script type="module">
        const SUPABASE_URL = 'https://oplfhsqycxroqyrdruej.supabase.co';
        const SUPABASE_ANON_KEY = 'sb_publishable_c2_9jMvBS9iNxTqX9eyj2Q_oG0t2oVl';
        const CLOUDINARY_CLOUD_NAME = 'teolzwgc';

        function resolveCloudinary(ref) {
            if (!ref) return null;
            const trimmed = ref.trim();
            if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/') || trimmed.startsWith('data:')) {
                return { src: trimmed, srcSet: `${trimmed} 512w, ${trimmed} 1024w, ${trimmed} 1600w` };
            }
            const base = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/f_auto,q_auto`;
            return {
                src: `${base}/${trimmed}`,
                srcSet: `${base},w_512/${trimmed} 512w, ${base},w_1024/${trimmed} 1024w, ${base},w_1600/${trimmed} 1600w`
            };
        }

        function parseMarkdown(md) {
            if (!md) return '';
            let html = md;
            // Headers
            html = html.replace(/^### (.*$)/gim, '<h3 class="framer-text framer-styles-preset-1nepq3m">$1</h3>');
            html = html.replace(/^## (.*$)/gim, '<h2 class="framer-text framer-styles-preset-1nepq3m">$1</h2>');
            html = html.replace(/^# (.*$)/gim, '<h1 class="framer-text framer-styles-preset-9meupv">$1</h1>');
            // Bold / Italic
            html = html.replace(/\\*\\*\\*(.*?)\\*\\*\\*/gim, '<strong><em>$1</em></strong>');
            html = html.replace(/\\*\\*(.*?)\\*\\*/gim, '<strong>$1</strong>');
            html = html.replace(/\\*(.*?)\\*/gim, '<em>$1</em>');
            // Code
            html = html.replace(/`([^`]+)`/gim, '<code>$1</code>');
            // Links
            html = html.replace(/\\[([^\\]]+)\\]\\(([^)]+)\\)/gim, '<a class="framer-styles-preset-1k8uo92" href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

            const blocks = html.split(/\\n\\s*\\n/);
            return blocks.map(block => {
                block = block.trim();
                if (!block) return '';
                if (block.startsWith('<h1') || block.startsWith('<h2') || block.startsWith('<h3')) return block;
                if (block.startsWith('- ') || block.startsWith('* ')) {
                    const items = block.split(/\\n/).map(line => line.replace(/^[-*]\\s+/, '').trim()).filter(Boolean);
                    return `<ul style="margin:24px 0;padding-left:24px;line-height:1.8em;">${items.map(i => `<li>${i}</li>`).join('')}</ul>`;
                }
                if (/^\\d+\\.\\s+/.test(block)) {
                    const items = block.split(/\\n/).map(line => line.replace(/^\\d+\\.\\s+/, '').trim()).filter(Boolean);
                    return `<ol style="margin:24px 0;padding-left:24px;line-height:1.8em;">${items.map(i => `<li>${i}</li>`).join('')}</ol>`;
                }
                return `<p class="framer-text framer-styles-preset-1go6xkm">${block.replace(/\\n/g, ' ')}</p>`;
            }).join('\\n');
        }

        async function loadArticle() {
            const urlParams = new URLSearchParams(window.location.search);
            let slug = urlParams.get('slug');
            if (!slug) {
                const parts = window.location.pathname.split('/').filter(Boolean);
                if (parts[0] === 'blog' && parts[1] && parts[1] !== 'article.html') {
                    slug = parts[1];
                }
            }

            const titleEl = document.getElementById('article-title');
            const authorEl = document.getElementById('article-author');
            const dateEl = document.getElementById('article-date');
            const excerptEl = document.getElementById('article-excerpt');
            const coverImgEl = document.getElementById('article-cover-img');
            const bodyEl = document.getElementById('article-body-content');
            const rootMain = document.getElementById('main');

            function renderUnavailable() {
                document.title = 'Article Unavailable — Corabin';
                if (titleEl) titleEl.innerText = 'Article Unavailable';
                if (excerptEl) excerptEl.style.display = 'none';
                if (dateEl && dateEl.parentElement) dateEl.parentElement.style.display = 'none';
                if (bodyEl) {
                    bodyEl.innerHTML = `
                        <p class="framer-text framer-styles-preset-1go6xkm">The requested article is not currently published or does not exist.</p>
                        <p style="margin-top: 24px;">
                            <a href="/blog" class="framer-styles-preset-1k8uo92" style="display:inline-flex;align-items:center;gap:8px;font-weight:600;">
                                Return to all articles
                            </a>
                        </p>
                    `;
                }
                if (rootMain) rootMain.dataset.rendered = 'true';
            }

            if (!slug) {
                renderUnavailable();
                return;
            }

            if (rootMain) rootMain.dataset.blogSlug = slug;

            try {
                const resp = await fetch(`${SUPABASE_URL}/rest/v1/posts?slug=eq.${encodeURIComponent(slug)}&status=eq.published&select=*`, {
                    headers: {
                        'apikey': SUPABASE_ANON_KEY,
                        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                    }
                });
                if (!resp.ok) {
                    renderUnavailable();
                    return;
                }
                const posts = await resp.json();
                if (!posts || posts.length === 0) {
                    renderUnavailable();
                    return;
                }

                const post = posts[0];

                // Metadata
                let rawTitle = post.seo_title || post.title;
                const pageTitle = (rawTitle.includes('Corabin') ? rawTitle : `${rawTitle} — Corabin`);
                document.title = pageTitle;
                const metaDesc = document.querySelector('meta[name="description"]');
                if (metaDesc && post.meta_description) metaDesc.setAttribute('content', post.meta_description);

                const canonical = document.querySelector('link[rel="canonical"]');
                if (canonical) canonical.setAttribute('href', `https://corabin.com/blog/${slug}`);

                // Hero
                if (titleEl) titleEl.innerText = post.title;

                let authorName = 'Souvik';
                if (post.author) {
                    if (typeof post.author === 'string') {
                        authorName = post.author;
                    } else if (typeof post.author === 'object' && post.author.name) {
                        authorName = post.author.name;
                    }
                }
                if (authorEl) authorEl.innerText = authorName;

                const authorAvatarImg = document.querySelector('[data-framer-name="Photo"] img');
                if (authorAvatarImg && post.author && typeof post.author === 'object' && post.author.avatar) {
                    authorAvatarImg.src = post.author.avatar;
                    authorAvatarImg.srcset = `${post.author.avatar} 512w`;
                }

                if (dateEl && post.published_at) {
                    dateEl.setAttribute('datetime', post.published_at);
                    const d = new Date(post.published_at);
                    dateEl.innerText = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
                }

                if (excerptEl) {
                    if (post.excerpt) {
                        excerptEl.innerText = post.excerpt;
                        excerptEl.style.display = '';
                    } else {
                        excerptEl.style.display = 'none';
                    }
                }

                if (coverImgEl && post.cover_image) {
                    const resolved = resolveCloudinary(post.cover_image);
                    if (resolved) {
                        coverImgEl.src = resolved.src;
                        coverImgEl.srcset = resolved.srcSet;
                        if (post.cover_image_alt) coverImgEl.alt = post.cover_image_alt;
                    }
                }

                // Content Body
                if (bodyEl) {
                    bodyEl.innerHTML = parseMarkdown(post.content);
                }

                if (rootMain) rootMain.dataset.rendered = 'true';
            } catch (err) {
                console.error('Failed to load article:', err);
                renderUnavailable();
            }
        }

        loadArticle();

        // Mobile / Desktop Menu toggle
        document.querySelectorAll('[data-framer-name*="Closed"]').forEach(btn => {
            btn.addEventListener('click', () => {
                const header = btn.closest('header');
                if (header) {
                    const content = header.querySelector('[data-framer-name="Content"]');
                    if (content) {
                        const isHidden = content.style.display === 'none' || getComputedStyle(content).display === 'none';
                        content.style.display = isHidden ? 'block' : 'none';
                        content.style.position = isHidden ? 'fixed' : '';
                        content.style.inset = isHidden ? '0' : '';
                        content.style.zIndex = isHidden ? '9999' : '';
                    }
                }
            });
        });
    </script>
"""

# Replace script_main and modulepreloads at bottom
html = re.sub(
    r'<link rel="modulepreload".*?<script type="module" async="" data-framer-bundle="main".*?</script>',
    lambda m: runtime_script.strip(),
    html,
    flags=re.DOTALL
)

with open(DEST_PATH, 'w', encoding='utf-8') as f:
    f.write(html)

print(f"✅ Generated {DEST_PATH} successfully! Size: {os.path.getsize(DEST_PATH)} bytes")
