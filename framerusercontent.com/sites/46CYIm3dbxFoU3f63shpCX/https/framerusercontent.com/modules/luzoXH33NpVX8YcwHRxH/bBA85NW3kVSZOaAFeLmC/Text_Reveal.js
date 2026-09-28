import {
    jsx as _jsx
} from "react/jsx-runtime";
import {
    useRef,
    useEffect,
    useState
} from "react";
import {
    addPropertyControls,
    ControlType,
    RenderTarget
} from "framer";
/**
 * Text Reveal
 *
 * @framerDisableUnlink
 *
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerIntrinsicWidth 400
 * @framerSupportedLayoutHeight any-prefer-fixed
 * @framerIntrinsicHeight 200
 */
export default function TextReveal(props) {
    const {
        text = "", color, font = {
            fontFamily: "Inter",
            fontWeight: 500,
            fontSize: 60,
            letterSpacing: 0,
            lineHeight: 1,
            textAlign: "left"
        }, fullRevealDistance, initialBlur, initialOpacity, initialScale, triggerOffset = 0, perspective, rotateX, revealMode, transition
    } = props;
    const containerRef = useRef(null);
    let textUnits = [];
    const {
        parentSelector
    } = props;
    const fontStyle = font || {}; // Debug: uncomment to inspect what Framer passes
    // console.log("FONT OBJECT:", JSON.stringify(font, null, 2))
    // Build extra CSS for variable axes and OpenType features
    const extraFontCSS = {};
    if (fontStyle.fontVariationAxes) {
        extraFontCSS.fontVariationSettings = Object.entries(fontStyle.fontVariationAxes).map(([axis, value]) => `"${axis}" ${value}`).join(", ");
    }
    if (fontStyle.fontFeatureSettings) {
        if (typeof fontStyle.fontFeatureSettings === "string") {
            extraFontCSS.fontFeatureSettings = fontStyle.fontFeatureSettings;
        } else if (typeof fontStyle.fontFeatureSettings === "object") {
            const features = Object.entries(fontStyle.fontFeatureSettings).filter(([, value]) => value).map(([feature]) => `"${feature}"`).join(", ");
            if (features) {
                extraFontCSS.fontFeatureSettings = features;
            }
        }
    }
    if (revealMode === "word") {
        textUnits = text.match(/\S+|\s+/g) || [];
    } else {
        const wordOrSpace = text.match(/\S+|\s+/g) || [];
        textUnits = wordOrSpace.map(unit => {
            if (/\s+/.test(unit)) {
                return {
                    type: "space",
                    value: unit
                };
            } else {
                return {
                    type: "word",
                    value: unit.split("")
                };
            }
        });
    }
    const [scrollProgress, setScrollProgress] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const isCanvas = RenderTarget.current() === RenderTarget.canvas;
    const stickyStartScroll = useRef(null);
    useEffect(() => {
        if (isCanvas) return;
        let startPosition = 0;
        let endPosition = 0;
        let containerHeight = 0;
        let parentEl = null;
        if (parentSelector && typeof window !== "undefined") {
            parentEl = document.querySelector(parentSelector);
        }
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                if (!parentEl) {
                    const rect = entry.boundingClientRect;
                    startPosition = window.scrollY + rect.top;
                    containerHeight = rect.height;
                    endPosition = startPosition + fullRevealDistance;
                }
                handleScroll();
            } else {
                setIsVisible(false);
            }
        }, {
            threshold: [0]
        });
        if (containerRef.current) {
            observer.observe(containerRef.current);
        }
        const handleScroll = () => {
            if (!isVisible) return;
            let progress = 0;
            if (parentEl) {
                const parentRect = parentEl.getBoundingClientRect();
                if (parentRect.top > 0) {
                    stickyStartScroll.current = null;
                    progress = 0;
                } else if (parentRect.top === 0) {
                    if (stickyStartScroll.current === null) {
                        stickyStartScroll.current = window.scrollY;
                    }
                    progress = (window.scrollY - stickyStartScroll.current - triggerOffset) / fullRevealDistance;
                } else if (parentRect.bottom > 0) {
                    if (stickyStartScroll.current !== null) {
                        progress = (window.scrollY - stickyStartScroll.current - triggerOffset) / fullRevealDistance;
                    } else {
                        progress = 1;
                    }
                } else {
                    stickyStartScroll.current = null;
                    progress = 1;
                }
                progress = Math.max(0, Math.min(1, progress));
            } else {
                const currentScroll = window.scrollY;
                const elementTop = startPosition - currentScroll;
                const visibleHeight = window.innerHeight - elementTop - triggerOffset;
                progress = visibleHeight / fullRevealDistance;
                progress = Math.max(0, Math.min(1, progress));
            }
            setScrollProgress(progress);
        };
        window.addEventListener("scroll", handleScroll, {
            passive: true
        });
        return () => {
            window.removeEventListener("scroll", handleScroll);
            if (containerRef.current) {
                observer.unobserve(containerRef.current);
            }
        };
    }, [fullRevealDistance, isCanvas, isVisible, parentSelector, triggerOffset]);

    function buildTransitionString() {
        if (!transition) return "filter 0.2s, opacity 0.2s, transform 0.2s";
        const {
            duration = .2, ease = "ease-out", delay = 0
        } = transition;
        const t = `${duration}s ${ease} ${delay}s`;
        return [`filter ${t}`, `opacity ${t}`, `transform ${t}`].join(", ");
    }
    const transitionString = buildTransitionString();
    let totalLetters = 0;
    if (revealMode === "letter") {
        totalLetters = textUnits.reduce((acc, unit) => acc + (unit.type === "word" ? unit.value.length : 0), 0);
    }
    return /*#__PURE__*/ _jsx("div", {
        ref: containerRef,
        style: {
            position: "sticky",
            top: 0,
            color: color,
            ...fontStyle,
            ...extraFontCSS,
            opacity: isVisible || isCanvas ? 1 : 0,
            perspective: `${perspective}px`,
            whiteSpace: "pre-wrap"
        },
        children: revealMode === "word" ? textUnits.map((unit, index) => {
            const unitProgress = isCanvas ? 1 : (scrollProgress - index / textUnits.length) * textUnits.length;
            const progress = Math.max(0, Math.min(1, unitProgress));
            const blurAmount = initialBlur * (1 - progress);
            const opacity = initialOpacity + (1 - initialOpacity) * progress;
            const scale = initialScale + (1 - initialScale) * progress;
            const xRotation = rotateX * (1 - progress);
            return /*#__PURE__*/ _jsx("span", {
                style: {
                    display: "inline-block",
                    filter: `blur(${blurAmount}px)`,
                    opacity: opacity,
                    transform: `scale(${scale}) rotateX(${xRotation}deg)`,
                    transition: transitionString
                },
                children: unit
            }, index);
        }) : textUnits.map((unit, i) => {
            if (unit.type === "space") {
                return /*#__PURE__*/ _jsx("span", {
                    children: unit.value
                }, "space-" + i);
            } else {
                return /*#__PURE__*/ _jsx("span", {
                    style: {
                        display: "inline-block",
                        whiteSpace: "nowrap"
                    },
                    children: unit.value.map((char, j) => {
                        let letterIndex = 0;
                        for (let k = 0; k < i; k++) {
                            if (textUnits[k].type === "word") letterIndex += textUnits[k].value.length;
                        }
                        letterIndex += j;
                        const unitProgress = isCanvas ? 1 : (scrollProgress - letterIndex / totalLetters) * totalLetters;
                        const progress = Math.max(0, Math.min(1, unitProgress));
                        const blurAmount = initialBlur * (1 - progress);
                        const opacity = initialOpacity + (1 - initialOpacity) * progress;
                        const scale = initialScale + (1 - initialScale) * progress;
                        const xRotation = rotateX * (1 - progress);
                        return /*#__PURE__*/ _jsx("span", {
                            style: {
                                display: isCanvas ? "inline" : "inline-block",
                                filter: `blur(${blurAmount}px)`,
                                opacity: opacity,
                                transform: `scale(${scale}) rotateX(${xRotation}deg)`,
                                transition: transitionString
                            },
                            children: char
                        }, j);
                    })
                }, "word-" + i);
            }
        })
    });
}
addPropertyControls(TextReveal, {
    parentSelector: {
        type: ControlType.String,
        title: "Parent Selector",
        placeholder: "#parent-id",
        description: "CSS selector (e.g. #parent-id) for sticky parent container. If set, reveal starts when parent hits top of viewport."
    },
    text: {
        type: ControlType.String,
        title: "Text",
        displayTextArea: true
    },
    color: {
        type: ControlType.Color,
        title: "Color"
    },
    font: {
        type: ControlType.Font,
        title: "Font",
        controls: "extended",
        defaultValue: {
            fontFamily: "Inter",
            fontWeight: 500,
            fontSize: 60,
            letterSpacing: 0,
            lineHeight: 1,
            textAlign: "left"
        }
    },
    fullRevealDistance: {
        type: ControlType.Number,
        title: "Full Reveal Distance",
        min: 100,
        max: 5e3,
        step: 10,
        defaultValue: 1500
    },
    initialBlur: {
        type: ControlType.Number,
        title: "Initial Blur",
        min: 0,
        max: 10,
        step: .5
    },
    initialOpacity: {
        type: ControlType.Number,
        title: "Initial Opacity",
        min: 0,
        max: 1,
        step: .05
    },
    initialScale: {
        type: ControlType.Number,
        title: "Initial Scale",
        min: .5,
        max: 1,
        step: .05
    },
    triggerOffset: {
        type: ControlType.Number,
        title: "Trigger Offset",
        min: -1e3,
        max: 1e3,
        step: 10,
        defaultValue: 0,
        description: "Shifts when the reveal starts. Positive = starts later (lower), negative = starts earlier (higher)."
    },
    perspective: {
        type: ControlType.Number,
        title: "Perspective",
        min: 100,
        max: 2e3,
        step: 50
    },
    rotateX: {
        type: ControlType.Number,
        title: "Rotate X",
        min: -90,
        max: 90,
        step: 1
    },
    transition: {
        type: ControlType.Transition,
        title: "Transition",
        description: "Controls the animation for opacity, blur, and transform.",
        defaultValue: {
            duration: .2,
            ease: "ease-out",
            delay: 0
        }
    },
    revealMode: {
        type: ControlType.Enum,
        title: "Reveal Mode",
        options: ["word", "letter"],
        optionTitles: ["Word", "Letter"],
        description: "Component from [Windaro](https://windaro.com?utm_source=codecomponent)"
    }
});
export const __FramerMetadata__ = {
    "exports": {
        "default": {
            "type": "reactComponent",
            "name": "TextReveal",
            "slots": [],
            "annotations": {
                "framerContractVersion": "1",
                "framerIntrinsicWidth": "400",
                "framerSupportedLayoutWidth": "any-prefer-fixed",
                "framerSupportedLayoutHeight": "any-prefer-fixed",
                "framerIntrinsicHeight": "200",
                "framerDisableUnlink": "*"
            }
        },
        "__FramerMetadata__": {
            "type": "variable"
        }
    }
}
//# sourceMappingURL=./Text_Reveal.map