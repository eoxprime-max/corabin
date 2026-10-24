/**
 * @module state/store
 * @description Lightweight reactive Pub/Sub store for centralized blog state management.
 * Guarantees a single source of truth for post data, active article, and UI statuses.
 */

/**
 * @typedef {Object} BlogState
 * @property {Object} posts
 * @property {Array<Object>} posts.list
 * @property {Record<string, Object>} posts.bySlug
 * @property {Array<Object>} posts.featured
 * @property {Array<Object>} posts.regular
 * @property {'idle'|'loading'|'success'|'error'} posts.status
 * @property {string|null} posts.error
 * @property {number} posts.lastFetched
 * @property {Object} currentArticle
 * @property {string|null} currentArticle.slug
 * @property {Object|null} currentArticle.data
 * @property {'idle'|'loading'|'success'|'error'|'not_found'} currentArticle.status
 * @property {string|null} currentArticle.error
 * @property {Object} route
 * @property {string} route.pathname
 * @property {string|null} route.slug
 * @property {'home'|'listing'|'article'|'other'} route.pageType
 */

const INITIAL_STATE = {
    posts: {
        list: [],
        bySlug: {},
        featured: [],
        regular: [],
        status: 'idle',
        error: null,
        lastFetched: 0,
    },
    currentArticle: {
        slug: null,
        data: null,
        status: 'idle',
        error: null,
    },
    route: {
        pathname: typeof window !== 'undefined' ? window.location.pathname : '',
        slug: null,
        pageType: 'other',
    },
};

export class Store {
    constructor(initialState = INITIAL_STATE) {
        this._state = { ...initialState };
        this._listeners = new Set();
    }

    /**
     * Retrieves a copy of the current state snapshot.
     * @returns {BlogState}
     */
    getState() {
        return this._state;
    }

    /**
     * Updates state and notifies subscribers.
     * Supports both partial state objects and updater functions.
     *
     * @param {Partial<BlogState>|((prevState: BlogState) => Partial<BlogState>)} partialOrUpdater
     */
    setState(partialOrUpdater) {
        const partial = typeof partialOrUpdater === 'function'
            ? partialOrUpdater(this._state)
            : partialOrUpdater;

        this._state = {
            ...this._state,
            ...partial,
        };

        this._notify();
    }

    /**
     * Subscribes a listener function to state changes.
     *
     * @param {(state: BlogState) => void} listener
     * @returns {() => void} Unsubscribe function.
     */
    subscribe(listener) {
        if (typeof listener !== 'function') return () => {};
        this._listeners.add(listener);
        return () => this._listeners.delete(listener);
    }

    /**
     * Resets active article state on route departure.
     */
    resetCurrentArticle() {
        this.setState(prev => ({
            currentArticle: {
                slug: null,
                data: null,
                status: 'idle',
                error: null,
            },
        }));
    }

    _notify() {
        for (const listener of this._listeners) {
            try {
                listener(this._state);
            } catch (err) {
                console.error('[Corabin Store] Listener threw error:', err);
            }
        }
    }
}

/** Global singleton store instance */
export const store = new Store();
