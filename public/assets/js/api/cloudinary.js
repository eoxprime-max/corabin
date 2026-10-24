/**
 * @module api/cloudinary
 * @description Cloudinary asset URL resolution and responsive srcset generation for blog media.
 */

import { ENV } from '../config/env.js';

/**
 * Resolves a stored image reference into an optimised Cloudinary delivery URL.
 *
 * Supports three input forms:
 *   - Cloudinary public IDs (e.g. "corabin/blog-covers/sample-abc123")
 *   - Full HTTPS URLs (passed through unchanged)
 *   - Data URIs or root-relative paths (/...) (passed through unchanged)
 *
 * @param {string|null|undefined} imageRef - The stored image reference.
 * @param {object}  [options]              - Optional Cloudinary transformation options.
 * @param {string}  [options.format]       - Image format (default: "auto").
 * @param {string}  [options.quality]      - Quality setting (default: "auto").
 * @param {string}  [options.crop]         - Crop mode (e.g. "fill"). Requires width or height.
 * @param {number}  [options.width]        - Target width in pixels.
 * @param {number}  [options.height]       - Target height in pixels.
 * @returns {string|null} A fully-qualified Cloudinary delivery URL, or null if input is invalid.
 */
export function resolveCloudinaryImageUrl(imageRef, options = {}) {
    if (!imageRef || typeof imageRef !== 'string') return null;

    const clean = imageRef.trim();
    if (!clean) return null;

    // Pass through any absolute URL, data URI, or root-relative path as-is
    if (
        clean.startsWith('http://') ||
        clean.startsWith('https://') ||
        clean.startsWith('/') ||
        clean.startsWith('data:')
    ) {
        return clean;
    }

    // Build Cloudinary transformation string
    const format = options.format || 'auto';
    const quality = options.quality || 'auto';
    const transforms = [`f_${format}`, `q_${quality}`];

    if (options.crop && (options.width || options.height)) {
        transforms.push(`c_${options.crop}`);
    }
    if (options.width)  transforms.push(`w_${options.width}`);
    if (options.height) transforms.push(`h_${options.height}`);

    const transformStr = transforms.join(',');
    const cloudName = ENV.CLOUDINARY_CLOUD_NAME;
    return `https://res.cloudinary.com/${cloudName}/image/upload/${transformStr}/${clean}`;
}

/**
 * Generates a responsive srcset attribute value for a Cloudinary image.
 *
 * Generated widths: 512w, 1024w, 1672w, 2688w — covering mobile through retina desktop.
 *
 * @param {string|null|undefined} imageRef - Cloudinary public ID or full Cloudinary CDN URL.
 * @returns {string} A comma-separated srcset string, or empty string if not applicable.
 */
export function generateResponsiveSrcset(imageRef) {
    if (!imageRef || typeof imageRef !== 'string') return '';

    let clean = imageRef.trim();
    if (!clean) return '';

    // Extract public ID from a full Cloudinary CDN URL if provided
    const cloudinaryMatch = clean.match(
        /^https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/(?:[a-zA-Z0-9_,]+\/)?(.+)$/
    );
    if (cloudinaryMatch) {
        clean = cloudinaryMatch[1];
    }

    // Only build srcset for bare Cloudinary public IDs
    if (clean.startsWith('http://') || clean.startsWith('https://') || clean.startsWith('/')) {
        return '';
    }

    const widths = [512, 1024, 1672, 2688];
    return widths
        .map(w => `${resolveCloudinaryImageUrl(clean, { width: w })} ${w}w`)
        .join(', ');
}
