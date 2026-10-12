import {
    jsx as _jsx,
    jsxs as _jsxs
} from "react/jsx-runtime";
import {
    useState
} from "react";
import {
    addPropertyControls,
    ControlType
} from "framer";
import {
    motion
} from "framer-motion";
/**
 * @copyright ©framersnippets.com
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 * @framerDisableUnlink
 **/
export default function SocialSharingButton(props) {
    const {
        text,
        font,
        style,
        platform,
        icon,
        hover,
        transition,
        padding,
        radius,
        border,
        scale,
        isMixedPadding = false,
        isMixedRadius = false,
        isMixedRadiusHover = false
    } = props;
    const [hoverState, setHoverState] = useState(false);
    const paddingValue = isMixedPadding ? `${style.padding}px` : `${style.top}px ${style.right}px ${style.bottom}px ${style.left}px`;
    const radiusValue = isMixedRadius ? `${style.radius}px` : `${style.topLeft}px ${style.topRight}px ${style.bottomRight}px ${style.bottomLeft}px`;
    const radiusValueHover = isMixedRadiusHover ? `${hover.radius}px` : `${hover.topLeft}px ${hover.topRight}px ${hover.bottomRight}px ${hover.bottomLeft}px`;
    const iconStyle = {
        fill: hoverState ? hover.icon.color : icon.color,
        width: icon.size,
        height: icon.size
    };
    const icons = {
        facebook: /*#__PURE__*/ _jsx("svg", {
            viewBox: "0 0 16 16",
            style: iconStyle,
            xmlns: "http://www.w3.org/2000/svg",
            children: /*#__PURE__*/ _jsx("path", {
                "fill-rule": "evenodd",
                "clip-rule": "evenodd",
                d: "M0.752779 0.585786C0.166992 1.17157 0.166992 2.11438 0.166992 4V12C0.166992 13.8856 0.166992 14.8284 0.752779 15.4142C1.33857 16 2.28137 16 4.16699 16H8.70566V9.80802H6.62743V7.40091H8.70566V5.62669C8.70566 3.56625 9.96343 2.44447 11.8008 2.44447C12.4213 2.44202 13.0415 2.47377 13.6585 2.53958V4.69336H12.3839C11.3848 4.69336 11.191 5.16891 11.191 5.8658V7.40091H13.575L13.2648 9.80802H11.191V16H12.167C14.0526 16 14.9954 16 15.5812 15.4142C16.167 14.8284 16.167 13.8856 16.167 12V4C16.167 2.11438 16.167 1.17157 15.5812 0.585786C14.9954 0 14.0526 0 12.167 0H4.16699C2.28137 0 1.33857 0 0.752779 0.585786Z"
            })
        }),
        linkedin: /*#__PURE__*/ _jsx("svg", {
            viewBox: "0 0 16 16",
            style: iconStyle,
            xmlns: "http://www.w3.org/2000/svg",
            children: /*#__PURE__*/ _jsx("path", {
                "fill-rule": "evenodd",
                "clip-rule": "evenodd",
                d: "M0.752779 0.585786C0.166992 1.17157 0.166992 2.11438 0.166992 4V12C0.166992 13.8856 0.166992 14.8284 0.752779 15.4142C1.33857 16 2.28137 16 4.16699 16H12.167C14.0526 16 14.9954 16 15.5812 15.4142C16.167 14.8284 16.167 13.8856 16.167 12V4C16.167 2.11438 16.167 1.17157 15.5812 0.585786C14.9954 0 14.0526 0 12.167 0H4.16699C2.28137 0 1.33857 0 0.752779 0.585786ZM11.6833 14H14.1661L14.167 9.60124C14.167 7.44199 13.7012 5.78289 11.1859 5.78289C9.97477 5.78289 9.16428 6.44821 8.83076 7.07714H8.79815V5.98538H6.41325V14H8.8969V10.0342C8.8969 8.98818 9.09441 7.97667 10.3884 7.97667C11.6647 7.97667 11.6833 9.17294 11.6833 10.1023V14ZM3.05674 4.77942C3.2318 4.85195 3.41943 4.88917 3.60889 4.88896C3.89387 4.889 4.17248 4.80448 4.40954 4.64604C4.6468 4.48747 4.83179 4.26199 4.94111 3.99812C5.05043 3.73425 5.07918 3.44383 5.02371 3.16359C4.96825 2.88335 4.83107 2.62588 4.62951 2.42374C4.42796 2.22159 4.17108 2.08385 3.89138 2.02794C3.61167 1.97202 3.32169 2.00044 3.0581 2.1096C2.79452 2.21876 2.56917 2.40375 2.41055 2.64119C2.25194 2.87863 2.16718 3.15786 2.16699 3.44355C2.16663 3.63339 2.20367 3.82143 2.276 3.9969C2.34833 4.17237 2.45453 4.33182 2.58851 4.4661C2.72248 4.60038 2.8816 4.70685 3.05674 4.77942ZM2.36356 14H4.85281L4.85374 5.98538H2.36356V14Z"
            })
        }),
        reddit: /*#__PURE__*/ _jsx("svg", {
            viewBox: "0 0 16 16",
            style: iconStyle,
            xmlns: "http://www.w3.org/2000/svg",
            children: /*#__PURE__*/ _jsx("path", {
                "fill-rule": "evenodd",
                "clip-rule": "evenodd",
                d: "M0.752779 0.586031C0.166992 1.17182 0.166992 2.11463 0.166992 4.00024V12.0002C0.166992 13.8859 0.166992 14.8287 0.752779 15.4145C1.33857 16.0002 2.28137 16.0002 4.16699 16.0002H12.167C14.0526 16.0002 14.9954 16.0002 15.5812 15.4145C16.167 14.8287 16.167 13.8859 16.167 12.0002V4.00024C16.167 2.11463 16.167 1.17182 15.5812 0.586031C14.9954 0.000244141 14.0526 0.000244141 12.167 0.000244141H4.16699C2.28137 0.000244141 1.33857 0.000244141 0.752779 0.586031ZM14.6517 7.29464C14.8156 7.52847 14.9083 7.80471 14.9187 8.09006C14.9231 8.36939 14.8482 8.64423 14.7029 8.88283C14.5576 9.12142 14.3478 9.31402 14.0976 9.43835C14.1085 9.58684 14.1085 9.73592 14.0976 9.88441C14.0976 12.1552 11.4517 14.0002 8.18742 14.0002C4.92314 14.0002 2.27724 12.1552 2.27724 9.88441C2.26632 9.73592 2.26632 9.58684 2.27724 9.43835C2.08226 9.34877 1.90908 9.21786 1.76972 9.0547C1.63035 8.89153 1.52813 8.70002 1.47014 8.49342C1.41215 8.28683 1.39978 8.07009 1.43388 7.85824C1.46797 7.64638 1.54773 7.44448 1.66761 7.26651C1.7875 7.08855 1.94465 6.93878 2.12817 6.82758C2.31169 6.71638 2.5172 6.64642 2.73044 6.62254C2.94369 6.59866 3.15958 6.62144 3.36315 6.68929C3.56672 6.75714 3.7531 6.86844 3.90938 7.01548C5.0775 6.22326 6.45176 5.78984 7.86302 5.76857L8.6132 2.25084C8.62162 2.21012 8.63805 2.17147 8.66152 2.13714C8.68499 2.10281 8.71504 2.07348 8.74993 2.05085C8.78481 2.02822 8.82385 2.01274 8.86477 2.00531C8.90568 1.99787 8.94767 1.99863 8.98829 2.00754L11.472 2.50428C11.5933 2.29589 11.7849 2.13756 12.0124 2.0577C12.2399 1.97784 12.4884 1.98169 12.7133 2.06856C12.9383 2.15542 13.1249 2.31961 13.2397 2.53166C13.3544 2.74371 13.3899 2.98972 13.3396 3.22554C13.2894 3.46136 13.1567 3.67155 12.9654 3.81838C12.7742 3.9652 12.5368 4.03904 12.296 4.02666C12.0552 4.01427 11.8267 3.91645 11.6516 3.75078C11.4764 3.5851 11.366 3.36241 11.3402 3.12267L9.17076 2.66648L8.51182 5.82939C9.90613 5.85814 11.2621 6.29133 12.4148 7.07631C12.6208 6.87859 12.8796 6.74468 13.16 6.69072C13.4404 6.63677 13.7304 6.66508 13.9951 6.77223C14.2598 6.87939 14.4878 7.06081 14.6517 7.29464ZM5.07813 8.38698C4.88802 8.5771 4.78121 8.83495 4.78121 9.10382C4.78121 9.37268 4.88802 9.63053 5.07813 9.82065C5.26825 10.0108 5.5261 10.1176 5.79496 10.1176C6.06383 10.1176 6.32168 10.0108 6.5118 9.82065C6.70191 9.63053 6.80872 9.37268 6.80872 9.10382C6.80872 8.83495 6.70191 8.5771 6.5118 8.38698C6.32168 8.19687 6.06383 8.09006 5.79496 8.09006C5.5261 8.09006 5.26825 8.19687 5.07813 8.38698ZM8.16715 12.6722C9.06697 12.7095 9.95188 12.4336 10.6711 11.8916V11.9322C10.7008 11.907 10.725 11.876 10.7422 11.8411C10.7594 11.8061 10.7692 11.768 10.771 11.7291C10.7729 11.6903 10.7667 11.6514 10.7529 11.615C10.7391 11.5786 10.7179 11.5454 10.6907 11.5176C10.6636 11.4897 10.6309 11.4677 10.5949 11.453C10.5589 11.4383 10.5202 11.4311 10.4813 11.432C10.4423 11.4328 10.404 11.4417 10.3687 11.458C10.3333 11.4743 10.3017 11.4976 10.2758 11.5267C9.66051 11.968 8.91306 12.1862 8.15701 12.1451C7.40188 12.1788 6.6579 11.9535 6.0484 11.5064C5.99588 11.4633 5.9292 11.4413 5.86133 11.4446C5.79346 11.4479 5.72926 11.4764 5.68121 11.5244C5.63316 11.5725 5.6047 11.6367 5.60137 11.7046C5.59804 11.7724 5.62007 11.8391 5.66318 11.8916C6.38241 12.4336 7.26732 12.7095 8.16715 12.6722ZM9.92543 9.98727C10.0921 10.0987 10.2343 10.1731 10.4785 10.1758C10.616 10.1773 10.7523 10.1737 10.8792 10.1208C11.0061 10.068 11.1209 9.98986 11.2167 9.89124C11.3125 9.79262 11.3872 9.67556 11.4363 9.54716C11.4854 9.41877 11.5079 9.28172 11.5024 9.14437C11.5024 8.94386 11.4429 8.74787 11.3315 8.58115C11.2202 8.41444 11.0618 8.28451 10.8766 8.20778C10.6913 8.13105 10.4875 8.11098 10.2909 8.15009C10.0942 8.18921 9.91359 8.28576 9.77181 8.42753C9.63003 8.56931 9.53348 8.74994 9.49437 8.94659C9.45525 9.14324 9.47533 9.34707 9.55205 9.53231C9.62878 9.71755 9.75872 9.87588 9.92543 9.98727Z"
            })
        }),
        x: /*#__PURE__*/ _jsx("svg", {
            viewBox: "0 0 16 16",
            style: iconStyle,
            xmlns: "http://www.w3.org/2000/svg",
            children: /*#__PURE__*/ _jsx("path", {
                "fill-rule": "evenodd",
                "clip-rule": "evenodd",
                d: "M0.752779 0.585786C0.166992 1.17157 0.166992 2.11438 0.166992 4V12C0.166992 13.8856 0.166992 14.8284 0.752779 15.4142C1.33857 16 2.28137 16 4.16699 16H12.167C14.0526 16 14.9954 16 15.5812 15.4142C16.167 14.8284 16.167 13.8856 16.167 12V4C16.167 2.11438 16.167 1.17157 15.5812 0.585786C14.9954 0 14.0526 0 12.167 0H4.16699C2.28137 0 1.33857 0 0.752779 0.585786ZM13.4578 2.57654H11.6177L8.58501 6.04254L5.9634 2.57654H2.16699L6.70322 8.50895L2.4034 13.4234H4.24459L7.56318 9.63147L10.4635 13.4234H14.167L9.43775 7.17117L13.4578 2.57654Z"
            })
        })
    };
    const handleShare = (platform, text) => {
        let url;
        switch (platform) {
            case "facebook":
                url = "https://facebook.com/61594918605124/";
                break;
            case "linkedin":
                url = "https://linkedin.com/company/corabin";
                break;
            case "reddit":
                url = "https://reddit.com/user/CorabinHQ/";
                break;
            case "x":
                url = "https://x.com/CorabinStudio";
                break;
            default:
                url = "https://x.com/CorabinStudio";
                break;
        }
        window.open(url, "_blank");
    };
    const customIcon = icon.custom ? /*#__PURE__*/ _jsx("img", {
        src: hoverState && hover.icon.custom ? hover.icon.custom : icon.custom,
        style: {
            width: icon.size,
            height: icon.size
        }
    }) : null;
    const iconElement = icons[platform];
    return /*#__PURE__*/ _jsxs(motion.button, {
        onClick: () => handleShare(platform, text),
        onHoverStart: () => setHoverState(true),
        onHoverEnd: () => setHoverState(false),
        onTapStart: () => setHoverState(true),
        onTapCancel: () => setHoverState(false),
        style: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            cursor: "pointer",
            width: "100%",
            height: "100%",
            backgroundColor: style.fill,
            color: style.color,
            borderRadius: radiusValue,
            border: `${style.border.borderWidth}px ${style.border.borderStyle} ${style.border.borderColor}`,
            padding: paddingValue,
            gap: `${icon.gap}px`,
            fontFamily: props.fontFamily,
            fontSize: props.fontSize,
            fontWeight: props.fontWeight,
            lineHeight: props.lineHeight,
            letterSpacing: props.letterSpacing,
            scale: style.scale,
            whiteSpace: "nowrap",
            ...font
        },
        whileHover: {
            backgroundColor: hover.fill,
            color: hover.color,
            borderRadius: radiusValueHover,
            border: `${hover.border.borderWidth}px ${hover.border.borderStyle} ${hover.border.borderColor}`,
            scale: hover.scale
        },
        whileTap: {
            backgroundColor: hover.fill,
            color: hover.color,
            borderRadius: radiusValueHover,
            border: `${hover.border.borderWidth}px ${hover.border.borderStyle} ${hover.border.borderColor}`,
            scale: style.scale
        },
        transition: transition,
        children: [icon.align === "start" && (icon.custom ? customIcon : icons[platform]), text, icon.align === "end" && (icon.custom ? customIcon : icons[platform])]
    });
}
SocialSharingButton.defaultProps = {
    fontFamily: "Inter, sans-serif",
    fontSize: 14,
    fontWeight: "Regular",
    lineHeight: 1,
    letterSpacing: 0
};
addPropertyControls(SocialSharingButton, {
    text: {
        type: ControlType.String,
        title: "Label",
        defaultValue: "Share on",
        placeholder: "Your text…"
    },
    font: {
        type: "font",
        controls: "extended",
        displayTextAlignment: false,
        defaultFontType: "sans-serif",
        defaultValue: {
            fontSize: 14,
            lineHeight: 1,
            letterSpacing: 0
        }
    },
    platform: {
        type: ControlType.Enum,
        title: "Platform",
        options: ["x", "reddit", "facebook", "linkedin"],
        optionTitles: ["X", "Reddit", "Facebook", "LinkedIn"],
        defaultValue: "x"
    },
    icon: {
        type: ControlType.Object,
        controls: {
            default: {
                type: ControlType.Boolean,
                title: "Default",
                defaultValue: true
            },
            align: {
                type: ControlType.Enum,
                title: "Align",
                options: ["start", "end"],
                optionTitles: ["Start", "End"],
                defaultValue: "end"
            },
            gap: {
                type: ControlType.Number,
                title: "Gap",
                defaultValue: 6,
                min: 0
            },
            size: {
                type: ControlType.Number,
                title: "Size",
                defaultValue: 14,
                min: 8,
                max: 48
            },
            custom: {
                type: ControlType.Image,
                title: "Icon",
                hidden(props) {
                    return props.default;
                }
            },
            color: {
                type: ControlType.Color,
                title: "Color",
                defaultValue: "white",
                hidden(props) {
                    return !props.default;
                }
            }
        }
    },
    style: {
        type: ControlType.Object,
        title: "Styles",
        controls: {
            fill: {
                type: ControlType.Color,
                title: "Fill",
                defaultValue: "#007AFF"
            },
            color: {
                type: ControlType.Color,
                title: "Color",
                defaultValue: "#FFFFFF"
            },
            radiusValue: {
                type: ControlType.FusedNumber,
                title: "Radius",
                defaultValue: 13,
                toggleKey: "isMixedRadius",
                toggleTitles: ["All", "Individual"],
                valueKeys: ["topLeft", "topRight", "bottomRight", "bottomLeft"],
                valueLabels: ["TL", "TR", "BR", "BL"],
                min: 0
            },
            paddingValue: {
                type: ControlType.FusedNumber,
                title: "Padding",
                defaultValue: 10,
                toggleKey: "isMixedPadding",
                toggleTitles: ["All", "Individual"],
                valueKeys: ["top", "right", "bottom", "left"],
                valueLabels: ["T", "R", "B", "L"],
                min: 0
            },
            scale: {
                type: ControlType.Number,
                title: "Scale",
                defaultValue: 1,
                min: 0,
                step: .1,
                displayStepper: true
            },
            border: {
                type: ControlType.Object,
                title: "Border",
                controls: {
                    borderWidth: {
                        type: ControlType.Number,
                        title: "Size",
                        defaultValue: 1,
                        min: 0,
                        displayStepper: true
                    },
                    borderStyle: {
                        type: ControlType.Enum,
                        title: "Style",
                        options: ["dotted", "dashed", "solid", "double", "groove", "ridge", "inset", "outset", "none"],
                        optionTitles: ["Dotted", "Dashed", "Solid", "Double", "Groove", "Ridge", "Inset", "Outset", "None"],
                        defaultValue: "solid"
                    },
                    borderColor: {
                        type: ControlType.Color,
                        title: "Color",
                        defaultValue: "#007AFF"
                    }
                }
            }
        }
    },
    hover: {
        type: ControlType.Object,
        controls: {
            fill: {
                type: ControlType.Color,
                title: "Fill",
                defaultValue: "#0060C0"
            },
            color: {
                type: ControlType.Color,
                title: "Color",
                defaultValue: "#FFFFFF"
            },
            radiusValueHover: {
                type: ControlType.FusedNumber,
                title: "Radius",
                defaultValue: 13,
                toggleKey: "isMixedRadiusHover",
                toggleTitles: ["All", "Individual"],
                valueKeys: ["topLeft", "topRight", "bottomRight", "bottomLeft"],
                valueLabels: ["TL", "TR", "BR", "BL"],
                min: 0
            },
            scale: {
                type: ControlType.Number,
                title: "Scale",
                defaultValue: 1,
                min: 0,
                step: .05,
                displayStepper: true
            },
            border: {
                type: ControlType.Object,
                title: "Border",
                controls: {
                    borderWidth: {
                        type: ControlType.Number,
                        title: "Size",
                        defaultValue: 1,
                        min: 0,
                        displayStepper: true
                    },
                    borderStyle: {
                        type: ControlType.Enum,
                        title: "Style",
                        options: ["dotted", "dashed", "solid", "double", "groove", "ridge", "inset", "outset", "none"],
                        optionTitles: ["Dotted", "Dashed", "Solid", "Double", "Groove", "Ridge", "Inset", "Outset", "None"],
                        defaultValue: "solid"
                    },
                    borderColor: {
                        type: ControlType.Color,
                        title: "Color",
                        defaultValue: "#0060C0"
                    }
                }
            },
            icon: {
                type: ControlType.Object,
                title: "Icon",
                controls: {
                    default: {
                        type: ControlType.Boolean,
                        title: "Default",
                        defaultValue: true
                    },
                    custom: {
                        type: ControlType.Image,
                        title: "Icon",
                        hidden(props) {
                            return props.default;
                        }
                    },
                    color: {
                        type: ControlType.Color,
                        title: "Color",
                        defaultValue: "#FFFFFF",
                        hidden(props) {
                            return !props.default;
                        }
                    }
                }
            }
        }
    },
    transition: {
        type: ControlType.Transition,
        title: "Transition",
        description: `
Important: Update the component in Framer (Assets > Components > Click purple update button) to prevent crashes.
`
    }
});
export const __FramerMetadata__ = {
    "exports": {
        "default": {
            "type": "reactComponent",
            "name": "SocialSharingButton",
            "slots": [],
            "annotations": {
                "framerContractVersion": "1",
                "framerSupportedLayoutHeight": "any",
                "framerDisableUnlink": "",
                "framerSupportedLayoutWidth": "any"
            }
        },
        "__FramerMetadata__": {
            "type": "variable"
        }
    }
}
//# sourceMappingURL=./ShareOnSocial.map