// Component that blocks page scroll with toggle while preserving parent container overflow scroll
import {
    jsx as _jsx
} from "react/jsx-runtime";
import {
    useEffect
} from "react";
import {
    addPropertyControls,
    ControlType
} from "framer";
/**
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 */
export default function ScrollBlocker(props) {
    const {
        isBlocked = false, style
    } = props;
    useEffect(() => {
        if (typeof window === "undefined") return;
        if (isBlocked) { // Store original overflow value
            const originalOverflow = document.body.style.overflow; // Block page scroll by setting overflow hidden on body
            document.body.style.overflow = "hidden";
            return () => { // Restore original overflow
                document.body.style.overflow = originalOverflow;
            };
        }
    }, [isBlocked]); // Return a minimal div instead of null to satisfy Framer's component loader
    return /*#__PURE__*/ _jsx("div", {
        style: { ...style,
            position: "relative",
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            opacity: 0
        }
    });
}
addPropertyControls(ScrollBlocker, {
    isBlocked: {
        type: ControlType.Boolean,
        title: "Block Scroll",
        defaultValue: false,
        enabledTitle: "On",
        disabledTitle: "Off"
    }
});
export const __FramerMetadata__ = {
    "exports": {
        "default": {
            "type": "reactComponent",
            "name": "ScrollBlocker",
            "slots": [],
            "annotations": {
                "framerContractVersion": "1",
                "framerSupportedLayoutHeight": "any-prefer-fixed",
                "framerSupportedLayoutWidth": "any-prefer-fixed"
            }
        },
        "__FramerMetadata__": {
            "type": "variable"
        }
    }
}
//# sourceMappingURL=./ScrollBlocker.map