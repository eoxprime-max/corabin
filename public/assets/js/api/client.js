/**
 * @module api/client
 * @description Resilient HTTP client with built-in timeout, signal handling, and JSON parsing.
 */

import { ENV } from '../config/env.js';
import { logger } from '../utils/logger.js';

/**
 * Standardized API response format.
 * @typedef {Object} ApiResponse
 * @property {boolean} ok       - Whether the request succeeded with 2xx status.
 * @property {any}     [data]    - Parsed JSON body on success.
 * @property {string}  [error]   - Error description on failure.
 * @property {number}  status    - HTTP status code (0 for network/abort errors).
 * @property {boolean} [aborted] - True if aborted by caller.
 */

export class HttpClient {
    /**
     * Executes an HTTP request with timeout protection.
     *
     * @param {string} url - Target URL.
     * @param {RequestInit & { timeout?: number }} [options] - Fetch options with optional timeout in ms.
     * @returns {Promise<ApiResponse>} Standardized response object.
     */
    static async request(url, options = {}) {
        const timeoutMs = options.timeout ?? ENV.HTTP_TIMEOUT_MS;
        const callerSignal = options.signal;

        const controller = new AbortController();
        let timeoutId = null;

        // Propagate caller abort
        if (callerSignal) {
            if (callerSignal.aborted) {
                return { ok: false, status: 0, error: 'Request aborted by caller', aborted: true };
            }
            callerSignal.addEventListener('abort', () => controller.abort());
        }

        if (timeoutMs > 0) {
            timeoutId = setTimeout(() => {
                controller.abort(new Error(`Request timed out after ${timeoutMs}ms`));
            }, timeoutMs);
        }

        try {
            const fetchOptions = {
                ...options,
                signal: controller.signal,
                headers: {
                    'Accept': 'application/json',
                    ...(options.headers || {}),
                },
            };

            const response = await fetch(url, fetchOptions);

            if (timeoutId) clearTimeout(timeoutId);

            if (!response.ok) {
                const errorMsg = `HTTP Error ${response.status}: ${response.statusText}`;
                logger.warn(`Request failed: ${url} - ${errorMsg}`);
                return {
                    ok: false,
                    status: response.status,
                    error: errorMsg,
                };
            }

            const data = await response.json();
            return {
                ok: true,
                status: response.status,
                data,
            };
        } catch (err) {
            if (timeoutId) clearTimeout(timeoutId);

            const isAbort = err.name === 'AbortError' || controller.signal.aborted;
            if (isAbort && callerSignal?.aborted) {
                return { ok: false, status: 0, error: 'Request aborted', aborted: true };
            }

            const errorMsg = err.message || 'Unknown network error';
            logger.warn(`Network failure on ${url}:`, errorMsg);
            return {
                ok: false,
                status: 0,
                error: errorMsg,
                aborted: isAbort,
            };
        }
    }

    /**
     * Helper for GET requests.
     *
     * @param {string} url
     * @param {RequestInit & { timeout?: number }} [options]
     * @returns {Promise<ApiResponse>}
     */
    static get(url, options = {}) {
        return HttpClient.request(url, { ...options, method: 'GET' });
    }
}
