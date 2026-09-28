import {
    jsx as _jsx
} from "react/jsx-runtime";
import {
    addPropertyControls,
    ControlType
} from "framer";
import {
    useRef,
    useEffect
} from "react";
import {
    motion,
    useTransform,
    useScroll,
    useMotionValue
} from "framer-motion";
/**
 * ImageParallax Component
 *
 * A Framer component that creates parallax effects for images.
 * Features:
 * - Vertical parallax effect based on scroll position
 * - Optional horizontal parallax effect based on viewport position
 * - Configurable parallax amounts and smoothing
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 * @framerDisableUnlink
 *
 */
export default function ImageParallax(props) {
    const {
        verticalParallaxAmount,
        horizontalParallaxAmount,
        horizontalParallaxEnabled,
        image,
        transitionDuration,
        smoothingEnabled,
        style
    } = props; // Reference to the container element for position calculations
    const containerRef = useRef(null); // Motion value for horizontal movement - more efficient than useState
    const xMotionValue = useMotionValue(0); // Track vertical scroll progress using Framer Motion's useScroll
    // offset: ["start end", "end start"] means the effect runs from when the element's
    // top edge enters the bottom of the viewport until its bottom edge leaves the top
    const {
        scrollYProgress
    } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    }); // Transform scroll progress (0-1) to y-position movement
    const y = useTransform(scrollYProgress, [0, 1], [0, verticalParallaxAmount]); // Effect to track horizontal position in viewport
    useEffect(() => { // Skip setup if horizontal parallax is disabled
        if (!horizontalParallaxEnabled) return; // Observer reference for cleanup
        let observer = null; // Animation frame reference for cleanup
        let animationFrame = null; // Function to calculate and update horizontal parallax position
        const updateHorizontalParallax = () => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const viewportWidth = window.innerWidth; // Calculate horizontal progress (0-1) based on the element's position
            // 0 = element is entering from the right edge of viewport
            // 1 = element has completely exited the left edge of viewport
            const horizontalProgress = 1 - (rect.left + rect.width) / (viewportWidth + rect.width); // Calculate the new horizontal position based on progress and parallax amount
            const newX = horizontalProgress * horizontalParallaxAmount; // Update the motion value (more performant than setState)
            xMotionValue.set(newX);
        }; // Animation loop function for smooth updates
        const animate = () => {
            updateHorizontalParallax();
            animationFrame = requestAnimationFrame(animate);
        }; // Use Intersection Observer for efficiency - only animate when visible
        observer = new IntersectionObserver(entries => {
                const isVisible = entries[0].isIntersecting;
                if (isVisible) { // Start animation loop when element becomes visible
                    if (!animationFrame) {
                        animationFrame = requestAnimationFrame(animate);
                    }
                } else { // Stop animation loop when element is not visible
                    if (animationFrame) {
                        cancelAnimationFrame(animationFrame);
                        animationFrame = null;
                    }
                }
            }, {
                threshold: .01,
                rootMargin: "20% 0px"
            } // Start when 1% is visible, with some margin
        ); // Start observing the container element
        if (containerRef.current) {
            observer.observe(containerRef.current);
        } // Cleanup function to prevent memory leaks
        return () => {
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }
            if (observer) {
                observer.disconnect();
            }
        };
    }, [horizontalParallaxEnabled, horizontalParallaxAmount, xMotionValue]);
    return /*#__PURE__*/ _jsx("div", {
        ref: containerRef,
        style: { ...style,
            position: "relative",
            overflow: "hidden",
            width: "100%",
            height: "100%"
        },
        children: /*#__PURE__*/ _jsx(motion.div, {
            style: {
                position: "absolute", // Extend beyond boundaries to allow room for parallax movement
                top: verticalParallaxAmount < 0 ? 0 : -Math.abs(verticalParallaxAmount),
                left: horizontalParallaxAmount < 0 ? 0 : -Math.abs(horizontalParallaxAmount),
                right: horizontalParallaxAmount > 0 ? 0 : -Math.abs(horizontalParallaxAmount),
                bottom: verticalParallaxAmount > 0 ? 0 : -Math.abs(verticalParallaxAmount), // Apply transformations for parallax effect
                y: y,
                x: xMotionValue,
                backgroundImage: image ? `url(${image})` : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center", // Optimize rendering performance
                willChange: "transform", // Prevent text selection and mouse interactions with the parallax layer
                userSelect: "none",
                pointerEvents: "none", // Apply smoothing if enabled
                transition: smoothingEnabled ? `transform ${transitionDuration}s ease-out` : "none"
            }
        })
    });
} // Default props with descriptive values
ImageParallax.defaultProps = {
    verticalParallaxAmount: 264,
    horizontalParallaxAmount: 200,
    horizontalParallaxEnabled: false,
    transitionDuration: .1,
    smoothingEnabled: true
}; // Property controls with descriptive tooltips and appropriate ranges
addPropertyControls(ImageParallax, {
    image: {
        type: ControlType.Image,
        title: "Image",
        description: "Background image for parallax effect"
    }, // Vertical parallax controls
    verticalParallaxAmount: {
        type: ControlType.Number,
        title: "Vertical Parallax",
        defaultValue: 264,
        step: 10,
        displayStepper: true,
        description: "Amount of vertical movement in pixels. Positive values move down, negative values move up."
    }, // Horizontal parallax controls
    horizontalParallaxEnabled: {
        type: ControlType.Boolean,
        title: "Enable Horizontal",
        defaultValue: false,
        description: "Enable horizontal parallax effect as element moves across the viewport"
    },
    horizontalParallaxAmount: {
        type: ControlType.Number,
        title: "Horizontal Parallax",
        defaultValue: 200,
        step: 10,
        displayStepper: true,
        description: "Amount of horizontal movement in pixels. Positive values create a lag effect, negative values create a lead effect.",
        hidden: props => !props.horizontalParallaxEnabled
    }, // Smoothing controls
    smoothingEnabled: {
        type: ControlType.Boolean,
        title: "Enable Smoothing",
        defaultValue: true,
        description: "Apply transition for smoother movement (recommended for scrolling)"
    },
    transitionDuration: {
        type: ControlType.Number,
        title: "Smoothing Duration",
        defaultValue: .1,
        min: 0,
        max: 1,
        step: .01,
        displayStepper: true,
        description: "Duration of the smoothing transition in seconds (lower values = more responsive)",
        hidden: props => !props.smoothingEnabled
    }
});
export const __FramerMetadata__ = {
    "exports": {
        "default": {
            "type": "reactComponent",
            "name": "ImageParallax",
            "slots": [],
            "annotations": {
                "framerSupportedLayoutHeight": "any",
                "framerSupportedLayoutWidth": "any",
                "framerDisableUnlink": "*",
                "framerContractVersion": "1"
            }
        },
        "__FramerMetadata__": {
            "type": "variable"
        }
    }
}
//# sourceMappingURL=./Parallax_Image.map