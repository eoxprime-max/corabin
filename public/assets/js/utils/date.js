/**
 * @module utils/date
 * @description Date formatting utilities for the Corabin blog runtime.
 */

const MONTHS_SHORT = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

/**
 * Formats an ISO date string or timestamp into "MMM DD, YYYY" format using UTC.
 * Example: "2026-10-18T10:00:00Z" -> "Oct 18, 2026"
 *
 * @param {string|number|Date} dateValue - The date to format.
 * @returns {string} Formatted date string, or empty string if input is invalid.
 */
export function formatArticleDate(dateValue) {
    if (!dateValue) return '';

    try {
        const d = dateValue instanceof Date ? dateValue : new Date(dateValue);
        if (Number.isNaN(d.getTime())) return '';

        const month = MONTHS_SHORT[d.getUTCMonth()];
        const day   = String(d.getUTCDate()).padStart(2, '0');
        const year  = d.getUTCFullYear();

        return `${month} ${day}, ${year}`;
    } catch {
        return '';
    }
}
