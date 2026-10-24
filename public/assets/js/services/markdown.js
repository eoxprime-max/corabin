/**
 * @module services/markdown
 * @description Resilient Markdown-to-HTML parser and Framer AST renderer for blog article content.
 * Applies Framer typography CSS presets for visual parity with native Framer exports.
 */

import { logger } from '../utils/logger.js';

const FRAMER_PRESET = {
    paragraph: 'framer-text framer-styles-preset-1go6xkm',
    h2:        'framer-text framer-styles-preset-1dzuwqo',
    h3:        'framer-text framer-styles-preset-1nepq3m',
    link:      'framer-styles-preset-1k8uo92',
    code:      'framer-styles-preset-1ddjqgk',
};

/**
 * Applies inline formatting (links, bold, italic, inline code) to a text string.
 *
 * @param {string} str
 * @returns {string}
 */
function formatInline(str) {
    if (!str || typeof str !== 'string') return '';
    return str
        .replace(
            /\[([^\]]+)\]\(([^)]+)\)/g,
            `<a href="$2" target="_blank" rel="noopener noreferrer" class="${FRAMER_PRESET.link}">$1</a>`
        )
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\*([^*]+)\*/g, '<em>$1</em>')
        .replace(/`([^`]+)`/g, `<code class="${FRAMER_PRESET.code}">$1</code>`);
}

/**
 * Recursively renders Framer RichText AST into HTML.
 *
 * @param {Array} ast
 * @returns {string}
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
                const tag      = node[1];
                const attrs    = node[2] || {};
                const children = node.slice(3);

                let classAttr = '';
                if      (tag === 'p')  classAttr = ` class="${FRAMER_PRESET.paragraph}"`;
                else if (tag === 'h2') classAttr = ` class="${FRAMER_PRESET.h2}"`;
                else if (tag === 'h3') classAttr = ` class="${FRAMER_PRESET.h3}"`;
                else if (tag === 'a') {
                    const href   = attrs.href   || '#';
                    const target = attrs.target ? ` target="${attrs.target}"` : '';
                    const rel    = attrs.rel    ? ` rel="${attrs.rel}"`       : '';
                    chunks.push(`<a href="${href}"${target}${rel} class="${FRAMER_PRESET.link}">`);
                    children.forEach(walk);
                    chunks.push('</a>');
                    return;
                } else if (tag === 'code') {
                    chunks.push(`<code class="${FRAMER_PRESET.code}">`);
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

/**
 * Converts raw article content into an HTML string using Framer typography preset classes.
 *
 * @param {string|null|undefined} rawContent
 * @returns {string} Safe HTML string.
 */
export function parseArticleContent(rawContent) {
    if (!rawContent) return '';

    try {
        const text = typeof rawContent === 'string' ? rawContent.trim() : '';

        // 1. Framer RichText AST (JSON array)
        if (text.startsWith('[') && text.endsWith(']')) {
            try {
                const ast = JSON.parse(text);
                return renderFramerAst(ast);
            } catch {
                // Not valid JSON AST, fall through to Markdown
            }
        }

        // 2. Pre-rendered HTML
        if (
            text.startsWith('<p') ||
            text.startsWith('<div') ||
            text.startsWith('<article') ||
            text.includes('</p>')
        ) {
            return text;
        }

        // 3. Markdown line-by-line parsing
        const excerptEl =
            typeof document !== 'undefined'
                ? document.querySelector('.framer-1ig6rss h2') || document.querySelector('[data-excerpt]')
                : null;
        const pageExcerpt = excerptEl
            ? (excerptEl.innerText || excerptEl.dataset?.excerpt || '').trim()
            : '';

        const lines      = text.split('\n');
        const htmlChunks = [];
        let inList       = false;
        let listType     = '';
        let inTable      = false;
        let inPre        = false;
        let preBuffer    = [];

        const flushList = () => {
            if (inList) {
                htmlChunks.push(`</${listType}>`);
                inList   = false;
                listType = '';
            }
        };

        const flushTable = () => {
            if (inTable) {
                htmlChunks.push('</tbody></table>');
                inTable = false;
            }
        };

        for (let i = 0; i < lines.length; i++) {
            const line    = lines[i];
            const trimmed = line.trim();

            if (trimmed.startsWith('```')) {
                if (inPre) {
                    htmlChunks.push(`<pre><code>${preBuffer.join('\n')}</code></pre>`);
                    preBuffer = [];
                    inPre     = false;
                } else {
                    flushList();
                    flushTable();
                    inPre = true;
                }
                continue;
            }

            if (inPre) {
                preBuffer.push(
                    line
                        .replace(/&/g, '&amp;')
                        .replace(/</g, '&lt;')
                        .replace(/>/g, '&gt;')
                );
                continue;
            }

            if (!trimmed) {
                flushList();
                flushTable();
                continue;
            }

            if (trimmed.startsWith('### ')) {
                flushList(); flushTable();
                htmlChunks.push(`<h3 class="${FRAMER_PRESET.h3}">${formatInline(trimmed.substring(4))}</h3>`);
                continue;
            }
            if (trimmed.startsWith('## ')) {
                flushList(); flushTable();
                htmlChunks.push(`<h2 class="${FRAMER_PRESET.h2}">${formatInline(trimmed.substring(3))}</h2>`);
                continue;
            }
            if (trimmed.startsWith('# ')) {
                flushList(); flushTable();
                htmlChunks.push(`<h2 class="${FRAMER_PRESET.h2}">${formatInline(trimmed.substring(2))}</h2>`);
                continue;
            }

            if (trimmed.startsWith('> ')) {
                flushList(); flushTable();
                htmlChunks.push(`<blockquote>${formatInline(trimmed.substring(2))}</blockquote>`);
                continue;
            }

            if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
                flushList();
                const cells = trimmed.split('|').slice(1, -1).map(c => c.trim());
                if (cells.every(c => /^:?-+:?$/.test(c))) continue;

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

            if (/^[-*]\s+/.test(trimmed)) {
                if (!inList || listType !== 'ul') {
                    flushList();
                    htmlChunks.push('<ul>');
                    inList   = true;
                    listType = 'ul';
                }
                htmlChunks.push(`<li>${formatInline(trimmed.replace(/^[-*]\s+/, ''))}</li>`);
                continue;
            }

            if (/^\d+[.)]\s+/.test(trimmed)) {
                if (trimmed.length < 80 && !/[.,:;?!'"]$/.test(trimmed)) {
                    flushList();
                    htmlChunks.push(`<h3 class="${FRAMER_PRESET.h3}">${formatInline(trimmed)}</h3>`);
                    continue;
                }
                if (!inList || listType !== 'ol') {
                    flushList();
                    htmlChunks.push('<ol>');
                    inList   = true;
                    listType = 'ol';
                }
                htmlChunks.push(`<li>${formatInline(trimmed.replace(/^\d+[.)]\s+/, ''))}</li>`);
                continue;
            }

            if (
                trimmed.length < 80 &&
                !/[.,:;?!'"]$/.test(trimmed) &&
                !trimmed.startsWith('http') &&
                !trimmed.startsWith('[')
            ) {
                let nextLine = '';
                for (let j = i + 1; j < Math.min(i + 4, lines.length); j++) {
                    if (lines[j].trim()) { nextLine = lines[j].trim(); break; }
                }
                if (nextLine && (nextLine.length > 60 || nextLine.includes('\t') || /^[-*\d]/.test(nextLine))) {
                    flushList();
                    htmlChunks.push(`<h3 class="${FRAMER_PRESET.h3}">${formatInline(trimmed)}</h3>`);
                    continue;
                }
            }

            if (
                pageExcerpt &&
                (trimmed === pageExcerpt || (trimmed.length > 40 && pageExcerpt.startsWith(trimmed.slice(0, 40))))
            ) {
                continue;
            }

            flushList();
            htmlChunks.push(`<p class="${FRAMER_PRESET.paragraph}">${formatInline(trimmed)}</p>`);
        }

        flushList();
        flushTable();

        return htmlChunks.join('\n');
    } catch (err) {
        logger.error('Failed to parse article content, falling back to safe text:', err);
        return `<p class="${FRAMER_PRESET.paragraph}">${String(rawContent || '')}</p>`;
    }
}
