/**
 * @module modules/config
 * @description Configuration facade module providing backward compatibility
 * for existing tooling and test suites.
 */

import { ENV } from '../config/env.js';
import { SELECTORS, COLUMNS, BASELINE_STATIC_SLUGS } from '../config/selectors.js';

export const SUPABASE_PROJECT_URL = ENV.SUPABASE_URL;
export const SUPABASE_ANON_KEY = ENV.SUPABASE_ANON_KEY;
export const CLOUDINARY_CLOUD_NAME = ENV.CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_BLOG_COVERS_FOLDER = ENV.CLOUDINARY_BLOG_COVERS_FOLDER;

export const REQUIRED_ARTICLE_COLUMNS = COLUMNS.ARTICLE;
export const REQUIRED_LISTING_COLUMNS = COLUMNS.LISTING;

export const ARTICLE_ROOT_SELECTOR = SELECTORS.ARTICLE_ROOT;
export { BASELINE_STATIC_SLUGS };
