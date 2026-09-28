import {
    jsx as _jsx,
    jsxs as _jsxs
} from "react/jsx-runtime";
import * as React from "react";
import {
    addPropertyControls,
    ControlType
} from "framer";
import {
    motion
} from "framer-motion";
const QuestionText = props => {
    const spanRef = React.useRef(null);
    const spanStyle = {
        color: props.color || props.font ? .color || "#333",
        fontFamily: props.font ? .fontFamily || "Inter",
        fontSize: props.font ? .fontSize || "16px",
        fontWeight: props.font ? .fontWeight || 400,
        lineHeight: props.font ? .lineHeight || "1.5",
        letterSpacing: props.font ? .letterSpacing || "normal",
        fontStyle: props.font ? .fontStyle || "normal",
        textAlign: props.font ? .textAlign || "left",
        margin: 0,
        padding: 0
    };
    return /*#__PURE__*/ _jsx("span", {
        ref: spanRef,
        style: spanStyle,
        ...props,
        children: props.children
    });
};
const AnswerText = props => {
    const pRef = React.useRef(null);
    const pStyle = {
        color: props.color || props.font ? .color || "#333",
        fontFamily: props.font ? .fontFamily || "Inter",
        fontSize: props.font ? .fontSize || "16px",
        fontWeight: props.font ? .fontWeight || 400,
        lineHeight: props.font ? .lineHeight || "1.5",
        letterSpacing: props.font ? .letterSpacing || "normal",
        fontStyle: props.font ? .fontStyle || "normal",
        textAlign: props.font ? .textAlign || "left",
        margin: 0,
        padding: 0,
        boxSizing: "border-box"
    };
    return /*#__PURE__*/ _jsx("p", {
        ref: pRef,
        style: pStyle,
        ...props,
        children: props.children
    });
}; // Backward compatibility function
const getCompatibleProps = props => { // Border settings compatibility
    const borderWidth = props.borderSettings ? .borderWidth ? ? props.borderWidth ? ? 1;
    const borderWidthTop = props.borderSettings ? .borderWidthTop ? ? props.borderWidthTop ? ? 1;
    const borderWidthRight = props.borderSettings ? .borderWidthRight ? ? props.borderWidthRight ? ? 1;
    const borderWidthBottom = props.borderSettings ? .borderWidthBottom ? ? props.borderWidthBottom ? ? 1;
    const borderWidthLeft = props.borderSettings ? .borderWidthLeft ? ? props.borderWidthLeft ? ? 1;
    const isMixed = props.borderSettings ? .isMixed ? ? props.isMixed ? ? false;
    const borderColor = props.borderSettings ? .borderColor ? ? props.borderColor ? ? "#000";
    const borderHoverColor = props.borderSettings ? .borderHoverColor ? ? props.borderHoverColor ? ? "#000"; // Background settings compatibility
    const backgroundColor = props.backgroundSettings ? .backgroundColor ? ? props.backgroundColor ? ? "#161F29";
    const openColor = props.backgroundSettings ? .openColor ? ? props.openColor ? ? "#233040";
    const hoverColor = props.backgroundSettings ? .hoverColor ? ? props.hoverColor ? ? "#233040"; // Question settings compatibility
    const questionFont = props.questionSettings ? .questionFont ? ? props.questionFont;
    const questionTextColor = props.questionSettings ? .questionTextColor ? ? props.questionTextColor ? ? "#333";
    const openTextColor = props.questionSettings ? .openTextColor ? ? props.openTextColor ? ? "#333";
    const questionPadding = props.questionSettings ? .questionPadding ? ? props.questionPadding ? ? 28;
    const questionPaddingTop = props.questionSettings ? .questionPaddingTop ? ? props.questionPaddingTop ? ? 28;
    const questionPaddingRight = props.questionSettings ? .questionPaddingRight ? ? props.questionPaddingRight ? ? 32;
    const questionPaddingBottom = props.questionSettings ? .questionPaddingBottom ? ? props.questionPaddingBottom ? ? 28;
    const questionPaddingLeft = props.questionSettings ? .questionPaddingLeft ? ? props.questionPaddingLeft ? ? 32;
    const isQuestionPaddingMixed = props.questionSettings ? .isQuestionPaddingMixed ? ? props.isQuestionPaddingMixed ? ? false; // Question icon settings compatibility
    const questionIcon = props.questionIconSettings ? .questionIcon ? ? props.questionIcon;
    const arrowSize = props.questionIconSettings ? .arrowSize ? ? props.arrowSize ? ? 16;
    const questionIconGap = props.questionIconSettings ? .questionIconGap ? ? props.questionIconGap ? ? 20;
    const questionIconRotation = props.questionIconSettings ? .questionIconRotation ? ? props.questionIconRotation ? ? 180;
    const iconPosition = props.questionIconSettings ? .iconPosition ? ? props.iconPosition ? ? "after"; // Answer settings compatibility
    const answerFont = props.answerSettings ? .answerFont ? ? props.answerFont;
    const answerTextColor = props.answerSettings ? .answerTextColor ? ? props.answerTextColor ? ? "#333";
    const answerPadding = props.answerSettings ? .answerPadding ? ? props.answerPadding ? ? 16;
    const answerPaddingTop = props.answerSettings ? .answerPaddingTop ? ? props.answerPaddingTop ? ? 16;
    const answerPaddingRight = props.answerSettings ? .answerPaddingRight ? ? props.answerPaddingRight ? ? 32;
    const answerPaddingBottom = props.answerSettings ? .answerPaddingBottom ? ? props.answerPaddingBottom ? ? 16;
    const answerPaddingLeft = props.answerSettings ? .answerPaddingLeft ? ? props.answerPaddingLeft ? ? 16;
    const isAnswerPaddingMixed = props.answerSettings ? .isAnswerPaddingMixed ? ? props.isAnswerPaddingMixed ? ? false; // Answer icon settings compatibility
    const answerIcon = props.answerIconSettings ? .answerIcon ? ? props.answerIcon;
    const answerIconSize = props.answerIconSettings ? .answerIconSize ? ? props.answerIconSize ? ? 16;
    const answerIconGap = props.answerIconSettings ? .answerIconGap ? ? props.answerIconGap ? ? 16;
    return { ...props,
        borderWidth,
        borderWidthTop,
        borderWidthRight,
        borderWidthBottom,
        borderWidthLeft,
        isMixed,
        borderColor,
        borderHoverColor,
        backgroundColor,
        openColor,
        hoverColor,
        questionFont,
        questionTextColor,
        openTextColor,
        questionPadding,
        questionPaddingTop,
        questionPaddingRight,
        questionPaddingBottom,
        questionPaddingLeft,
        isQuestionPaddingMixed,
        questionIcon,
        arrowSize,
        questionIconGap,
        questionIconRotation,
        iconPosition,
        answerFont,
        answerTextColor,
        answerPadding,
        answerPaddingTop,
        answerPaddingRight,
        answerPaddingBottom,
        answerPaddingLeft,
        isAnswerPaddingMixed,
        answerIcon,
        answerIconSize,
        answerIconGap
    };
};
/**
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any-prefer-auto
 *
 * @framerIntrinsicWidth 740
 * @framerIntrinsicHeight auto
 * @framerDisableUnlink
 */
export default function CustomAccordion(originalProps) {
    const props = getCompatibleProps(originalProps);
    const [isReady, setIsReady] = React.useState(false);
    const componentId = React.useId();
    React.useEffect(() => {
        const timer = setTimeout(() => setIsReady(true), 5);
        return () => clearTimeout(timer);
    }, []);
    const {
        faqs,
        gapSize,
        backgroundColor,
        openColor,
        hoverColor,
        borderRadius,
        borderWidthTop,
        borderWidthRight,
        borderWidthBottom,
        borderWidthLeft,
        isMixed,
        borderWidth,
        borderColor,
        borderHoverColor,
        fontFamily,
        showQuestionIcon,
        questionIcon,
        questionIconGap,
        questionIconRotation,
        questionTextColor,
        questionPaddingTop,
        questionPaddingRight,
        questionPaddingBottom,
        questionPaddingLeft,
        isQuestionPaddingMixed,
        questionPadding,
        answerPaddingTop,
        answerPaddingRight,
        answerPaddingBottom,
        answerPaddingLeft,
        isAnswerPaddingMixed,
        answerPadding,
        arrowSize,
        iconPosition,
        showAnswerIcon,
        answerIcon,
        answerIconGap,
        answerIconSize,
        questionFont,
        answerFont,
        answerTextColor,
        openTextColor,
        firstCardOpen,
        transition,
        applyBackgroundToParent,
        applyBorderToParent,
        applyBorderRadiusToParent
    } = props;
    const [openIndex, setOpenIndex] = React.useState(firstCardOpen && faqs.length > 0 ? 0 : null);
    const [hoveredIndex, setHoveredIndex] = React.useState(null); // Touch device detection for mobile fix
    const [isTouchDevice, setIsTouchDevice] = React.useState(false);
    React.useEffect(() => {
        setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
    }, []);
    React.useEffect(() => {
        if (firstCardOpen && faqs.length > 0) {
            setOpenIndex(0);
        } else {
            setOpenIndex(null);
        }
    }, [firstCardOpen, faqs]);
    const toggleFAQ = index => {
        setOpenIndex(prevIndex => prevIndex === index ? null : index);
    };
    const getBorderStyle = index => {
        if (isMixed) {
            return {
                borderTop: `${borderWidthTop}px solid ${borderColor}`,
                borderRight: `${borderWidthRight}px solid ${borderColor}`,
                borderBottom: `${borderWidthBottom}px solid ${borderColor}`,
                borderLeft: `${borderWidthLeft}px solid ${borderColor}`
            };
        } else {
            return {
                border: `${borderWidth}px solid ${borderColor}`
            };
        }
    };
    const getQuestionPaddingStyle = () => {
        if (isQuestionPaddingMixed) {
            return {
                paddingTop: `${questionPaddingTop}px`,
                paddingRight: `${questionPaddingRight}px`,
                paddingBottom: `${questionPaddingBottom}px`,
                paddingLeft: `${questionPaddingLeft}px`
            };
        } else {
            return {
                padding: `${questionPadding}px`
            };
        }
    };
    const getAnswerPaddingStyle = () => {
        if (isAnswerPaddingMixed) {
            return {
                paddingTop: `${answerPaddingTop}px`,
                paddingRight: `${answerPaddingRight}px`,
                paddingBottom: `${answerPaddingBottom}px`,
                paddingLeft: `${answerPaddingLeft}px`
            };
        } else {
            return {
                padding: `${answerPadding}px`
            };
        }
    };
    const content = /*#__PURE__*/ _jsx("div", {
        style: {
            width: "100%",
            ...props.style
        },
        children: faqs.map((faq, index) => /*#__PURE__*/ _jsxs(motion.div, {
            style: {
                marginBottom: index === faqs.length - 1 ? "0px" : `${gapSize}px`,
                ...applyBorderToParent ? getBorderStyle(index) : {},
                ...applyBorderRadiusToParent ? {
                    borderRadius: borderRadius
                } : {},
                ...applyBackgroundToParent ? {
                    backgroundColor: openIndex === index ? openColor : backgroundColor
                } : {},
                overflow: applyBorderRadiusToParent ? "hidden" : "visible"
            },
            animate: applyBackgroundToParent || applyBorderToParent ? { ...applyBorderToParent ? {
                    borderColor: hoveredIndex === index && !isTouchDevice ? borderHoverColor : borderColor
                } : {},
                ...applyBackgroundToParent ? {
                    backgroundColor: openIndex === index ? openColor : hoveredIndex === index && !isTouchDevice ? hoverColor : backgroundColor
                } : {}
            } : {},
            transition: transition,
            className: `force-styles-${componentId}-item-${index}`,
            children: [ /*#__PURE__*/ _jsxs(motion.div, {
                style: {
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                    ...!applyBorderRadiusToParent ? {
                        borderRadius: borderRadius
                    } : {},
                    ...!applyBorderToParent ? getBorderStyle(index) : {},
                    ...!applyBackgroundToParent ? {
                        backgroundColor: openIndex === index ? openColor : backgroundColor
                    } : {},
                    ...getQuestionPaddingStyle(),
                    boxSizing: "border-box"
                },
                animate: !applyBackgroundToParent || !applyBorderToParent ? { ...!applyBorderToParent ? {
                        borderColor: hoveredIndex === index && !isTouchDevice ? borderHoverColor : borderColor
                    } : {},
                    ...!applyBackgroundToParent ? {
                        backgroundColor: openIndex === index ? openColor : hoveredIndex === index && !isTouchDevice ? hoverColor : backgroundColor
                    } : {}
                } : {},
                transition: transition,
                onClick: () => toggleFAQ(index),
                onMouseEnter: () => !isTouchDevice && setHoveredIndex(index),
                onMouseLeave: () => !isTouchDevice && setHoveredIndex(null),
                children: [ /*#__PURE__*/ _jsxs("div", {
                    style: {
                        display: "flex",
                        alignItems: "center"
                    },
                    children: [showQuestionIcon && iconPosition === "before" && /*#__PURE__*/ _jsx(motion.img, {
                        src: questionIcon,
                        alt: "icon",
                        animate: {
                            rotate: openIndex === index ? questionIconRotation : 0
                        },
                        transition: transition,
                        style: {
                            width: arrowSize,
                            height: arrowSize,
                            marginRight: `${questionIconGap}px`
                        }
                    }), /*#__PURE__*/ _jsx(QuestionText, {
                        font: questionFont,
                        color: openIndex === index ? openTextColor : questionTextColor,
                        children: faq.question
                    })]
                }), showQuestionIcon && iconPosition === "after" && /*#__PURE__*/ _jsx(motion.img, {
                    src: questionIcon,
                    alt: "icon",
                    animate: {
                        rotate: openIndex === index ? questionIconRotation : 0
                    },
                    transition: transition,
                    style: {
                        width: arrowSize,
                        height: arrowSize,
                        marginLeft: `${questionIconGap}px`
                    }
                })]
            }, `${index}-${firstCardOpen}-${openColor}`), /*#__PURE__*/ _jsx(AccordionContent, {
                isOpen: openIndex === index,
                transition: transition,
                children: /*#__PURE__*/ _jsxs("div", {
                    style: {
                        display: "flex",
                        alignItems: "start",
                        ...getAnswerPaddingStyle(),
                        boxSizing: "border-box"
                    },
                    children: [showAnswerIcon && answerIcon && /*#__PURE__*/ _jsx("img", {
                        src: answerIcon,
                        alt: "icon",
                        style: {
                            width: answerIconSize,
                            height: answerIconSize,
                            marginRight: `${answerIconGap}px`
                        }
                    }), /*#__PURE__*/ _jsx(AnswerText, {
                        font: answerFont,
                        color: answerTextColor,
                        children: faq.answer
                    })]
                })
            })]
        }, index))
    });
    const forceStyles = `
    .force-styles-${componentId} {opacity: 1}
    ${faqs.map((_,index)=>`.force-styles-${componentId}-item-${index} {transform: translateZ(0)}`).join("\n")}
    `;
    return /*#__PURE__*/ _jsxs(React.Fragment, {
        children: [ /*#__PURE__*/ _jsx("style", {
            dangerouslySetInnerHTML: {
                __html: forceStyles
            }
        }), /*#__PURE__*/ _jsx("div", {
            className: `force-styles-${componentId}`,
            children: content
        })]
    });
}

function AccordionContent({
    isOpen,
    children,
    transition
}) {
    const contentRef = React.useRef(null);
    const [height, setHeight] = React.useState(0);
    React.useEffect(() => {
        if (contentRef.current) {
            contentRef.current.style.position = "absolute";
            contentRef.current.style.visibility = "hidden";
            contentRef.current.style.display = "block";
            const scrollHeight = contentRef.current.scrollHeight;
            contentRef.current.style.position = "";
            contentRef.current.style.visibility = "";
            contentRef.current.style.display = "";
            if (isOpen) {
                setHeight(scrollHeight);
            }
        }
    }, [isOpen, children]);
    return /*#__PURE__*/ _jsx(motion.div, {
        animate: {
            height: isOpen ? height : 0
        },
        initial: false,
        transition: {
            height: transition
        },
        style: {
            overflow: "hidden",
            willChange: "height"
        },
        children: /*#__PURE__*/ _jsx("div", {
            ref: contentRef,
            children: children
        })
    });
}
CustomAccordion.defaultProps = {
    faqs: [{
        question: "Why does Pixco offer free Framer components?",
        answer: "We love seeing great design come to life, and offering free Framer components is our way of helping the community."
    }, {
        question: "Is there a catch for these free components?",
        answer: "No catch at all! We genuinely enjoy helping designers and creators."
    }],
    gapSize: 16,
    backgroundSettings: {
        backgroundColor: "#161F29",
        openColor: "#233040",
        hoverColor: "#233040"
    },
    backgroundColor: "#161F29",
    openColor: "#233040",
    hoverColor: "#233040",
    borderRadius: 20,
    borderWidth: 1,
    borderWidthTop: 1,
    borderWidthRight: 1,
    borderWidthBottom: 1,
    borderWidthLeft: 1,
    isMixed: false,
    showQuestionIcon: true,
    questionIconGap: 20,
    questionIconRotation: 180,
    questionPadding: 28,
    questionPaddingTop: 28,
    questionPaddingRight: 32,
    questionPaddingBottom: 28,
    questionPaddingLeft: 32,
    isQuestionPaddingMixed: false,
    showAnswerIcon: true,
    answerIconGap: 16,
    answerPadding: 16,
    answerPaddingTop: 16,
    answerPaddingRight: 32,
    answerPaddingBottom: 16,
    answerPaddingLeft: 16,
    isAnswerPaddingMixed: false,
    borderColor: "#1D2836",
    borderHoverColor: "#2C3C52",
    questionIcon: "https://framerusercontent.com/assets/KeZKHxejeIz6mxENsIvmDZIEDo.svg",
    arrowSize: 16,
    iconPosition: "after",
    answerIcon: "https://framerusercontent.com/assets/XYbxWO3TFY2WvDPFG8MlDMVSoU.svg",
    answerIconSize: 16,
    answerTextColor: "#99ADC4",
    firstCardOpen: false,
    openTextColor: "#FFFFFF",
    transition: {
        type: "spring",
        stiffness: 800,
        damping: 60
    },
    applyBackgroundToParent: false,
    applyBorderToParent: false,
    applyBorderRadiusToParent: false
};
addPropertyControls(CustomAccordion, {
    faqs: {
        type: ControlType.Array,
        title: "FAQs",
        control: {
            type: ControlType.Object,
            controls: {
                question: {
                    type: ControlType.String,
                    title: "Question"
                },
                answer: {
                    type: ControlType.String,
                    title: "Answer",
                    displayTextArea: true
                }
            }
        },
        defaultValue: CustomAccordion.defaultProps.faqs
    },
    gapSize: {
        type: ControlType.Number,
        title: "Gap Size",
        defaultValue: 16,
        min: 0,
        max: 100,
        unit: "px",
        displayStepper: true
    },
    applyBackgroundToParent: {
        type: ControlType.Boolean,
        title: "Background",
        defaultValue: false,
        enabledTitle: "Parent",
        disabledTitle: "Card",
        description: "Apply background to parent or question card"
    },
    backgroundSettings: {
        type: ControlType.Object,
        title: "Background",
        controls: {
            backgroundColor: {
                type: ControlType.Color,
                title: "Default",
                defaultValue: CustomAccordion.defaultProps.backgroundColor
            },
            openColor: {
                type: ControlType.Color,
                title: "Open",
                defaultValue: CustomAccordion.defaultProps.openColor
            },
            hoverColor: {
                type: ControlType.Color,
                title: "Hover",
                defaultValue: CustomAccordion.defaultProps.hoverColor
            }
        }
    },
    applyBorderToParent: {
        type: ControlType.Boolean,
        title: "Border",
        defaultValue: false,
        enabledTitle: "Parent",
        disabledTitle: "Card",
        description: "Apply border to parent or question card"
    },
    borderSettings: {
        type: ControlType.Object,
        title: "Border",
        controls: {
            borderWidth: {
                type: ControlType.FusedNumber,
                title: "Width",
                defaultValue: 1,
                toggleKey: "isMixed",
                toggleTitles: ["All", "Individual"],
                valueKeys: ["borderWidthTop", "borderWidthRight", "borderWidthBottom", "borderWidthLeft"],
                valueLabels: ["T", "R", "B", "L"],
                min: 0,
                max: 10,
                step: 1,
                unit: "px"
            },
            borderColor: {
                type: ControlType.Color,
                title: "Color",
                defaultValue: "#1D2836"
            },
            borderHoverColor: {
                type: ControlType.Color,
                title: "Hover Color",
                defaultValue: "#2C3C52"
            }
        }
    },
    applyBorderRadiusToParent: {
        type: ControlType.Boolean,
        title: "Border Radius",
        defaultValue: false,
        enabledTitle: "Parent",
        disabledTitle: "Card",
        description: "Apply border radius to parent or question card"
    },
    borderRadius: {
        type: ControlType.Number,
        title: "Border Radius",
        defaultValue: 20,
        min: 0,
        max: 50,
        unit: "px",
        displayStepper: true
    },
    questionSettings: {
        type: ControlType.Object,
        title: "Question",
        controls: {
            questionFont: {
                type: ControlType.Font,
                title: "Font",
                controls: "extended",
                displayFontSize: true,
                displayTextAlignment: false,
                defaultFontType: "sans-serif",
                defaultValue: {
                    fontFamily: "Inter",
                    fontSize: 16,
                    fontWeight: 400,
                    lineHeight: "1.5",
                    letterSpacing: "normal"
                }
            },
            questionTextColor: {
                type: ControlType.Color,
                title: "Text Color",
                defaultValue: "#FFFFFF"
            },
            openTextColor: {
                type: ControlType.Color,
                title: "Open Text Color",
                defaultValue: "#FFFFFF"
            },
            questionPadding: {
                type: ControlType.FusedNumber,
                title: "Padding",
                defaultValue: 28,
                toggleKey: "isQuestionPaddingMixed",
                toggleTitles: ["All", "Individual"],
                valueKeys: ["questionPaddingTop", "questionPaddingRight", "questionPaddingBottom", "questionPaddingLeft"],
                valueLabels: ["T", "R", "B", "L"],
                min: 0,
                max: 100,
                step: 1,
                unit: "px"
            }
        }
    },
    showQuestionIcon: {
        type: ControlType.Boolean,
        title: "Question Icon",
        defaultValue: true,
        enabledTitle: "Show",
        disabledTitle: "Hide"
    },
    questionIconSettings: {
        type: ControlType.Object,
        title: "Question Icon",
        hidden: props => !props.showQuestionIcon,
        controls: {
            questionIcon: {
                type: ControlType.File,
                title: "Icon",
                allowedFileTypes: ["svg", "png", "jpg", "gif"]
            },
            arrowSize: {
                type: ControlType.Number,
                title: "Size",
                defaultValue: CustomAccordion.defaultProps.arrowSize,
                min: 8,
                max: 32,
                unit: "px",
                displayStepper: true
            },
            questionIconGap: {
                type: ControlType.Number,
                title: "Gap",
                defaultValue: 20,
                min: 0,
                max: 50,
                unit: "px",
                displayStepper: true
            },
            questionIconRotation: {
                type: ControlType.Number,
                title: "Rotation",
                defaultValue: 180,
                min: 0,
                max: 360,
                step: 1,
                unit: "\xb0",
                displayStepper: true,
                description: "Transitions on open and close states"
            },
            iconPosition: {
                type: ControlType.Enum,
                title: "Position",
                options: ["before", "after"],
                optionTitles: ["Before", "After"],
                defaultValue: "after"
            }
        }
    },
    answerSettings: {
        type: ControlType.Object,
        title: "Answer",
        controls: {
            answerFont: {
                type: ControlType.Font,
                title: "Font",
                controls: "extended",
                displayFontSize: true,
                displayTextAlignment: false,
                defaultFontType: "sans-serif",
                defaultValue: {
                    fontFamily: "Inter",
                    fontSize: 16,
                    fontWeight: 400,
                    lineHeight: "1.5",
                    letterSpacing: "normal"
                }
            },
            answerTextColor: {
                type: ControlType.Color,
                title: "Text Color",
                defaultValue: "#99ADC4"
            },
            answerPadding: {
                type: ControlType.FusedNumber,
                title: "Padding",
                defaultValue: 16,
                toggleKey: "isAnswerPaddingMixed",
                toggleTitles: ["All", "Individual"],
                valueKeys: ["answerPaddingTop", "answerPaddingRight", "answerPaddingBottom", "answerPaddingLeft"],
                valueLabels: ["T", "R", "B", "L"],
                min: 0,
                max: 100,
                step: 1,
                unit: "px"
            }
        }
    },
    showAnswerIcon: {
        type: ControlType.Boolean,
        title: "Answer Icon",
        defaultValue: true,
        enabledTitle: "Show",
        disabledTitle: "Hide"
    },
    answerIconSettings: {
        type: ControlType.Object,
        title: "Answer Icon",
        hidden: props => !props.showAnswerIcon,
        controls: {
            answerIcon: {
                type: ControlType.File,
                title: "Icon",
                allowedFileTypes: ["svg", "png", "jpg", "gif"]
            },
            answerIconSize: {
                type: ControlType.Number,
                title: "Size",
                defaultValue: CustomAccordion.defaultProps.answerIconSize,
                min: 8,
                max: 32,
                unit: "px",
                displayStepper: true
            },
            answerIconGap: {
                type: ControlType.Number,
                title: "Gap",
                defaultValue: 16,
                min: 0,
                max: 50,
                unit: "px",
                displayStepper: true
            }
        }
    },
    firstCardOpen: {
        type: ControlType.Boolean,
        title: "First Card Open",
        defaultValue: false,
        enabledTitle: "Yes",
        disabledTitle: "No"
    },
    transition: {
        type: ControlType.Transition,
        title: "Transition",
        defaultValue: {
            type: "spring",
            stiffness: 800,
            damping: 60
        },
        description: "Discover more Framer resources at [Pixco](https://pixcodrops.com/resources)"
    }
});
export const __FramerMetadata__ = {
    "exports": {
        "default": {
            "type": "reactComponent",
            "name": "CustomAccordion",
            "slots": [],
            "annotations": {
                "framerSupportedLayoutHeight": "any-prefer-auto",
                "framerDisableUnlink": "",
                "framerContractVersion": "1",
                "framerSupportedLayoutWidth": "any-prefer-fixed",
                "framerIntrinsicHeight": "auto",
                "framerIntrinsicWidth": "740"
            }
        },
        "__FramerMetadata__": {
            "type": "variable"
        }
    }
}
//# sourceMappingURL=./CustomAccordion.map