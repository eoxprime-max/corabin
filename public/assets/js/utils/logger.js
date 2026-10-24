/**
 * @module utils/logger
 * @description Centralized logging utility for the Corabin runtime.
 * Provides level-filtered logging and consistent diagnostic formatting.
 */

const LOG_LEVELS = {
    DEBUG: 0,
    INFO:  1,
    WARN:  2,
    ERROR: 3,
    NONE:  4,
};

/** Current active log level. Configurable via window.__CORABIN_LOG_LEVEL__. */
const currentLogLevel = (() => {
    if (typeof window !== 'undefined' && window.__CORABIN_LOG_LEVEL__) {
        const lvl = String(window.__CORABIN_LOG_LEVEL__).toUpperCase();
        return LOG_LEVELS[lvl] ?? LOG_LEVELS.INFO;
    }
    return LOG_LEVELS.INFO;
})();

const PREFIX = '[Corabin]';

export const logger = {
    debug(...args) {
        if (currentLogLevel <= LOG_LEVELS.DEBUG) {
            console.debug(PREFIX, ...args);
        }
    },
    info(...args) {
        if (currentLogLevel <= LOG_LEVELS.INFO) {
            console.info(PREFIX, ...args);
        }
    },
    warn(...args) {
        if (currentLogLevel <= LOG_LEVELS.WARN) {
            console.warn(PREFIX, ...args);
        }
    },
    error(...args) {
        if (currentLogLevel <= LOG_LEVELS.ERROR) {
            console.error(PREFIX, ...args);
        }
    },
};
