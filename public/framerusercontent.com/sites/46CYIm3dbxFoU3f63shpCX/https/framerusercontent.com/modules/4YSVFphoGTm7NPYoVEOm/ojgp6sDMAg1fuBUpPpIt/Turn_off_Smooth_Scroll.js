import {
    jsx as _jsx
} from "react/jsx-runtime";
export function withNativeScroll(Component) {
    return props => {
        return /*#__PURE__*/ _jsx(Component, { ...props,
            "data-lenis-prevent": true
        });
    };
}
export const __FramerMetadata__ = {
    "exports": {
        "withNativeScroll": {
            "type": "reactHoc",
            "name": "withNativeScroll",
            "annotations": {
                "framerContractVersion": "1"
            }
        },
        "__FramerMetadata__": {
            "type": "variable"
        }
    }
}
//# sourceMappingURL=./Turn_off_Smooth_Scroll.map