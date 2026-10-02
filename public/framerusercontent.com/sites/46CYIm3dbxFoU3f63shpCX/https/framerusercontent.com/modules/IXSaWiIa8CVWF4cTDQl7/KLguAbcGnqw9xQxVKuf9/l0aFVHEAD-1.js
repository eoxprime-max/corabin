// src/code-generation/components/cms/bundled/getRichTextJsonResolver.tsx?bundle
import {
    jsx as e
} from "react/jsx-runtime";
import {
    ComponentPresetsConsumer as r,
    Link as t,
    motion as n
} from "framer";
import {
    Fragment as o,
    createElement as a
} from "react"; // src/code-generation/components/cms/bundled/assert.ts
function i(e, ...r) {
    if (!e) throw Error("Assertion Error" + (r.length > 0 ? ": " + r.join(" ") : ""));
} // src/code-generation/components/cms/bundled/getRichTextJsonResolver.tsx?bundle
var u, s = ((u = s || {})[u.Fragment = 1] = "Fragment", u[u.Link = 2] = "Link", u[u.Module = 3] = "Module", u[u.Tag = 4] = "Tag", u[u.Text = 5] = "Text", u);

function c(u) {
    let s = /* @__PURE__ */ new Map;
    return c => {
        let l = s.get(c);
        if (l) return l;
        let m = JSON.parse(c),
            f = function s(c) {
                switch (c[0]) {
                    case 1 /* Fragment */ :
                        {
                            let [, ...e] = c,
                            r = e.map(s);
                            return /*#__PURE__*/ a(o, void 0, ...r);
                        }
                    case 2 /* Link */ :
                        {
                            let [, e, ...r] = c,
                            n = r.map(s);
                            return /*#__PURE__*/ a(t, e, ...n);
                        }
                    case 3 /* Module */ :
                        {
                            let [, t, n] = c,
                            o = u[t];
                            return i(o, "Module not found"),
                            /*#__PURE__*/ e(r, {
                                componentIdentifier: t,
                                children: r => /*#__PURE__*/ e(o, { ...r,
                                    ...n
                                })
                            });
                        }
                    case 4 /* Tag */ :
                        {
                            let [, e, r, ...t] = c,
                            o = t.map(s);
                            if ("a" === e) return /*#__PURE__*/ a(n.a, r, ...o);
                            return /*#__PURE__*/ a(e, r, ...o);
                        }
                    case 5 /* Text */ :
                        {
                            let [, e] = c;
                            return e;
                        }
                }
            }(m);
        return s.set(c, f), f;
    };
}
export {
    s as RichTextJsonType, c as getRichTextJsonResolver
};
export const __FramerMetadata__ = {
    "exports": {
        "getRichTextJsonResolver": {
            "type": "reactComponent",
            "name": "getRichTextJsonResolver",
            "slots": [],
            "annotations": {
                "framerContractVersion": "1"
            }
        },
        "RichTextJsonType": {
            "type": "variable",
            "annotations": {
                "framerContractVersion": "1"
            }
        },
        "__FramerMetadata__": {
            "type": "variable"
        }
    }
}