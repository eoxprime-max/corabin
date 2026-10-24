/**
 * @module modules/utils
 * @description Utility facade module providing backward compatibility.
 */

export { formatArticleDate } from '../utils/date.js';
export { resolveCurrentSlug, extractSlugFromHref, urlsMatch, buildShareUrls } from '../utils/url.js';
export { safeQuery, safeQueryAll, safeSetText, safeSetAttr, safeSetHtml, updateMetaTag } from '../utils/dom.js';
