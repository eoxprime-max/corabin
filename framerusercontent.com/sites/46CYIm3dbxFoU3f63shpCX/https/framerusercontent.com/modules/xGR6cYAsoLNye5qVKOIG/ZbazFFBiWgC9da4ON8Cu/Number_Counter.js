// Number Counter with ease-out animation, runs once on first viewport entry, no loop, no replay, no delay
import {
    jsx as _jsx,
    jsxs as _jsxs
} from "react/jsx-runtime";
import {
    useState,
    useEffect,
    useRef,
    startTransition
} from "react";
import {
    motion
} from "framer-motion";
import {
    addPropertyControls,
    ControlType
} from "framer";
/**
 * Number Counter with ease-out animation, runs once on first viewport entry
 *
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 */
function Counter({
    start = 0,
    end = 100,
    duration = 2,
    gapSize = 4,
    prefixText = "",
    suffixText = "",
    prefixFont,
    suffixFont,
    prefixColor,
    suffixColor,
    decimalSeparatorType = "comma",
    font,
    textColor = "#D3D3D3",
    startOnViewport = false,
    incrementType = "integer",
    style
}) {
    const [count, setCount] = useState(start);
    const [hasAnimated, setHasAnimated] = useState(false);
    const containerRef = useRef(null);
    const rafRef = useRef(null); // Ease-out cubic function
    function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }
    useEffect(() => {
        if (!startOnViewport) {
            if (!hasAnimated) {
                setHasAnimated(true);
            }
            return;
        }
        if (typeof window === "undefined") return;
        const observer = new window.IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !hasAnimated) {
                startTransition(() => setHasAnimated(true));
            }
        });
        if (containerRef.current) observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, [startOnViewport, hasAnimated]);
    useEffect(() => {
        if (!hasAnimated) return;
        let startTime = null;
        let cancelled = false;

        function animate(ts) {
            if (cancelled) return;
            if (!startTime) startTime = ts;
            const elapsed = (ts - startTime) / 1e3;
            let t = Math.min(elapsed / duration, 1);
            let eased = easeOutCubic(t);
            let value;
            if (incrementType === "integer") {
                value = Math.round(start + (end - start) * eased);
            } else {
                value = parseFloat((start + (end - start) * eased).toFixed(1));
            }
            setCount(value);
            if (t < 1) {
                rafRef.current = requestAnimationFrame(animate);
            } else {
                setCount(end);
            }
        }
        rafRef.current = requestAnimationFrame(animate);
        return () => {
            cancelled = true;
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [hasAnimated, start, end, duration, incrementType]);
    const formatNumber = number => {
        if (decimalSeparatorType === "comma") return number.toLocaleString("en-US");
        if (decimalSeparatorType === "period") return number.toLocaleString("en-US").replace(/,/g, ".");
        return number.toFixed(incrementType === "integer" ? 0 : 1);
    };
    return /*#__PURE__*/ _jsxs(motion.div, {
        ref: containerRef,
        style: {
            display: "flex",
            gap: `${gapSize}px`,
            alignItems: "center",
            color: textColor,
            letterSpacing: font ? .letterSpacing,
            fontSize: font ? .fontSize,
            fontWeight: font ? .variant ? undefined : font ? .fontWeight,
            fontStyle: font ? .variant && font.variant.toLowerCase().includes("italic") ? "italic" : undefined,
            fontFamily: font ? .fontFamily,
            lineHeight: font ? .lineHeight,
            ...style
        },
        children: [prefixText && /*#__PURE__*/ _jsx("span", {
            style: {
                fontFamily: prefixFont ? .fontFamily,
                fontWeight: prefixFont ? .fontWeight,
                fontSize: prefixFont ? .fontSize,
                letterSpacing: prefixFont ? .letterSpacing,
                lineHeight: prefixFont ? .lineHeight,
                color: prefixColor
            },
            children: prefixText
        }), /*#__PURE__*/ _jsx("span", {
            children: formatNumber(count)
        }), suffixText && /*#__PURE__*/ _jsx("span", {
            style: {
                fontFamily: suffixFont ? .fontFamily,
                fontWeight: suffixFont ? .fontWeight,
                fontSize: suffixFont ? .fontSize,
                letterSpacing: suffixFont ? .letterSpacing,
                lineHeight: suffixFont ? .lineHeight,
                color: suffixColor
            },
            children: suffixText
        })]
    });
}
addPropertyControls(Counter, {
    startOnViewport: {
        type: ControlType.Boolean,
        title: "Viewport",
        defaultValue: false
    },
    font: {
        type: ControlType.Font,
        title: "Font",
        controls: "extended",
        defaultFontType: "sans-serif",
        defaultValue: {
            fontSize: "36px",
            variant: "Medium",
            letterSpacing: "-0.07em",
            lineHeight: "1em"
        }
    },
    textColor: {
        type: ControlType.Color,
        title: "Font Color",
        defaultValue: "#D3D3D3"
    },
    start: {
        type: ControlType.Number,
        title: "Start Number",
        defaultValue: 0
    },
    end: {
        type: ControlType.Number,
        title: "End Number",
        defaultValue: 10
    },
    duration: {
        type: ControlType.Number,
        title: "Duration (s)",
        defaultValue: 2,
        min: .1,
        max: 20,
        step: .1
    },
    decimalSeparatorType: {
        type: ControlType.Enum,
        title: "Separator",
        defaultValue: "comma",
        options: ["comma", "period", "none"]
    },
    incrementType: {
        type: ControlType.Enum,
        title: "Increment Type",
        defaultValue: "integer",
        options: ["integer", "decimal"]
    },
    prefixText: {
        type: ControlType.String,
        title: "Prefix",
        defaultValue: ""
    },
    prefixFont: {
        title: "Prefix Font",
        type: ControlType.Font,
        controls: "extended",
        defaultFontType: "sans-serif",
        defaultValue: {
            fontSize: "18px",
            variant: "Medium",
            letterSpacing: "-0.01em",
            lineHeight: "1em"
        }
    },
    prefixColor: {
        type: ControlType.Color,
        title: "Prefix Color",
        defaultValue: "#D3D3D3"
    },
    suffixText: {
        type: ControlType.String,
        title: "Suffix",
        defaultValue: ""
    },
    suffixFont: {
        title: "Suffix Font",
        type: ControlType.Font,
        controls: "extended",
        defaultFontType: "sans-serif",
        defaultValue: {
            fontSize: "18px",
            variant: "Medium",
            letterSpacing: "-0.01em",
            lineHeight: "1em"
        }
    },
    suffixColor: {
        type: ControlType.Color,
        title: "Suffix Color",
        defaultValue: "#D3D3D3"
    },
    gapSize: {
        type: ControlType.Number,
        title: "Gap Size",
        defaultValue: 4,
        min: 0,
        max: 100
    }
});
export default Counter;
export const __FramerMetadata__ = {
    "exports": {
        "default": {
            "type": "reactComponent",
            "name": "Counter",
            "slots": [],
            "annotations": {
                "framerSupportedLayoutHeight": "any-prefer-fixed",
                "framerContractVersion": "1",
                "framerSupportedLayoutWidth": "any-prefer-fixed"
            }
        },
        "__FramerMetadata__": {
            "type": "variable"
        }
    }
}
//# sourceMappingURL=./Number_Counter.map