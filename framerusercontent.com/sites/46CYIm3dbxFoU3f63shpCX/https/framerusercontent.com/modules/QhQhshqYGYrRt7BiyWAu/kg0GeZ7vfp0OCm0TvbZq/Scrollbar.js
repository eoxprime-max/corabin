import {
    jsx as _jsx
} from "react/jsx-runtime";
const scrollbarWidth = 4;
const scrollbarBorderRadius = 0;
const scrollbarBackgroundColor = "#d6d6d6";
const thumbBorderRadius = 12;
const thumbColor = "#0048F9";
const hoverColor = "#1C1C1C";
const focusColor = "#000000";
import {
    useEffect
} from "react";
export function customScrollbar(Component) {
    return props => {
        useEffect(() => {
            const styleTag = document.createElement("style");
            styleTag.innerHTML = `
                
                ::-webkit-scrollbar {
                    width: ${scrollbarWidth}px;
                }
                ::-webkit-scrollbar-track {
                    background: ${scrollbarBackgroundColor};
                    padding: 4px;
                    border-radius: ${scrollbarBorderRadius}px;,
                }
                ::-webkit-scrollbar-thumb {
                    background-color: ${thumbColor};
                    border: transparent;
                    border-radius: ${thumbBorderRadius}px;
                }
                ::-webkit-scrollbar-thumb:hover {
                    background-color: ${hoverColor};
                }
                ::-webkit-scrollbar-thumb:active {
                    background-color: ${focusColor};
                }
            `;
            document.head.appendChild(styleTag);
            return () => {
                document.head.removeChild(styleTag);
            };
        }, [scrollbarWidth, thumbColor, scrollbarBackgroundColor, scrollbarBorderRadius, thumbBorderRadius, hoverColor, focusColor]);
        return /*#__PURE__*/ _jsx(Component, { ...props
        });
    };
}
export const __FramerMetadata__ = {
    "exports": {
        "customScrollbar": {
            "type": "reactHoc",
            "name": "customScrollbar",
            "annotations": {
                "framerContractVersion": "1"
            }
        },
        "__FramerMetadata__": {
            "type": "variable"
        }
    }
}
//# sourceMappingURL=./Scrollbar.map