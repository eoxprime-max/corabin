/**
 * @module utils/dom
 * @description Safe DOM query, manipulation, and change-detection helpers.
 * Protects against null dereferencing and eliminates redundant DOM mutations
 */

import { urlsMatch } from './url.js';
export { urlsMatch };

/**
 * Safely queries a single DOM element.
 *
 * @param {string} selector - CSS selector.
 * @param {ParentNode} [context=document] - Parent element to query within.
 * @returns {Element|null} The element or null.
 */
export function safeQuery(selector, context = (typeof document !== 'undefined' ? document : null)) {
    if (!context || typeof context.querySelector !== 'function') return null;
    try {
        return context.querySelector(selector);
    } catch {
        return null;
    }
}

/**
 * Safely queries all matching DOM elements.
 *
 * @param {string} selector - CSS selector.
 * @param {ParentNode} [context=document] - Parent element to query within.
 * @returns {Element[]} Array of matched elements.
 */
export function safeQueryAll(selector, context = (typeof document !== 'undefined' ? document : null)) {
    if (!context || typeof context.querySelectorAll !== 'function') return [];
    try {
        return Array.from(context.querySelectorAll(selector));
    } catch {
        return [];
    }
}

/**
 * Sets textContent on an element only if it differs from the current value.
 *
 * @param {Element|null} element - Target element.
 * @param {string|number} text   - Desired text.
 * @returns {boolean} True if the DOM was modified.
 */
export function safeSetText(element, text) {
    if (!element) return false;
    const str = String(text ?? '');
    if (element.textContent !== str) {
        element.textContent = str;
        return true;
    }
    return false;
}

/**
 * Sets an attribute on an element only if it differs from the current value.
 *
 * @param {Element|null} element - Target element.
 * @param {string} attr         - Attribute name.
 * @param {string|null} value    - Desired value. If null/undefined, removes attribute.
 * @returns {boolean} True if the DOM was modified.
 */
export function safeSetAttr(element, attr, value) {
    if (!element || !attr) return false;
    if (value === null || value === undefined) {
        if (element.hasAttribute(attr)) {
            element.removeAttribute(attr);
            return true;
        }
        return false;
    }

    const str = String(value);
    if (element.getAttribute(attr) !== str) {
        element.setAttribute(attr, str);
        return true;
    }
    return false;
}

/**
 * Sets innerHTML on an element only if it differs from the current value.
 *
 * @param {Element|null} element - Target element.
 * @param {string} html         - Desired HTML content.
 * @returns {boolean} True if the DOM was modified.
 */
export function safeSetHtml(element, html) {
    if (!element) return false;
    const str = String(html ?? '');
    if (element.innerHTML !== str) {
        element.innerHTML = str;
        return true;
    }
    return false;
}

/**
 * Updates or injects a meta or link tag with change detection.
 *
 * @param {string} selector      - Query selector for the tag (e.g. 'meta[property="og:title"]').
 * @param {string} attributeName - Attribute to set ('content' or 'href').
 * @param {string} content       - Desired content value.
 * @returns {boolean} True if the tag was updated or created.
 */
export function updateMetaTag(selector, attributeName, content) {
    if (typeof document === 'undefined' || !content) return false;

    let el = safeQuery(selector, document.head);
    if (!el) {
        // Tag doesn't exist — create it
        const isLink = selector.startsWith('link');
        el = document.createElement(isLink ? 'link' : 'meta');

        // Extract key attribute from selector, e.g. meta[property="og:title"] -> property="og:title"
        const attrMatch = selector.match(/\[([a-zA-Z0-9_-]+)=["']([^"']+)["']\]/);
        if (attrMatch) {
            el.setAttribute(attrMatch[1], attrMatch[2]);
        }
        document.head.appendChild(el);
    }

    return safeSetAttr(el, attributeName, content);
}
