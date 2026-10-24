/**
 * @module ui/animations/card-effects
 * @description Manages scoped CSS animations and interactive hover listeners for blog cards.
 */

/**
 * Attaches pointer and keyboard focus listeners that toggle a `.hover` class
 * on a card anchor element for Framer Motion hover state compatibility.
 *
 * @param {HTMLElement|null} cardLink
 */
export function attachCardHoverHandlers(cardLink) {
    if (!cardLink || cardLink.__corabinHoverAttached) return;
    cardLink.__corabinHoverAttached = true;

    cardLink.addEventListener('pointerenter', () => cardLink.classList.add('hover'));
    cardLink.addEventListener('pointerleave', () => cardLink.classList.remove('hover'));
    cardLink.addEventListener('focus',        () => cardLink.classList.add('hover'));
    cardLink.addEventListener('blur',         () => cardLink.classList.remove('hover'));
}

/**
 * Injects a scoped <style> block for card hover transitions and entrance animations.
 * Idempotent: checks for existing style element with ID 'corabin-blog-animations'.
 */
export function ensureBlogAnimationStyles() {
    if (typeof document === 'undefined') return;
    if (document.getElementById('corabin-blog-animations')) return;

    const style = document.createElement('style');
    style.id = 'corabin-blog-animations';
    style.textContent = `
        /* Regular card hover: border/background */
        .framer-18dht5n .framer-sHlxX {
            cursor: pointer;
            transition: background-color 0.25s ease, border-color 0.25s ease;
        }

        /* Arrow slide-up on hover */
        .framer-18dht5n .framer-sHlxX .framer-pizjbw {
            transition: bottom 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
                        transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
            will-change: bottom, transform;
        }
        .framer-18dht5n .framer-sHlxX:hover .framer-pizjbw,
        .framer-18dht5n .framer-sHlxX:focus-visible .framer-pizjbw {
            bottom: 20px;
        }

        /* Cover image zoom on hover */
        .framer-18dht5n .framer-sHlxX .framer-1462w5l img {
            transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
            will-change: transform;
        }
        .framer-18dht5n .framer-sHlxX:hover .framer-1462w5l img,
        .framer-18dht5n .framer-sHlxX:focus-visible .framer-1462w5l img {
            transform: scale(1.05);
        }

        /* Entrance animation for dynamically inserted regular cards */
        @keyframes corabinCardFadeIn {
            from { opacity: 0; transform: translateY(12px); }
            to   { opacity: 1; transform: translateY(0);    }
        }
        .framer-ij7w41-container[data-animated="true"] {
            animation: corabinCardFadeIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
            animation-delay: calc(var(--card-index, 0) * 35ms);
        }

        /* Respect prefers-reduced-motion */
        @media (prefers-reduced-motion: reduce) {
            .framer-18dht5n .framer-sHlxX,
            .framer-18dht5n .framer-sHlxX .framer-pizjbw,
            .framer-18dht5n .framer-sHlxX .framer-1462w5l img,
            .framer-ij7w41-container[data-animated="true"] {
                animation: none !important;
                transition: none !important;
                transform: none !important;
            }
            .framer-18dht5n .framer-sHlxX:hover .framer-pizjbw {
                bottom: 20px;
            }
        }
    `;
    document.head.appendChild(style);
}
