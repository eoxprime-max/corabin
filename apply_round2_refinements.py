#!/usr/bin/env python3
"""
apply_round2_refinements.py
Implements the 6 user requests + Logo update:
1. Replace "Meet the team ↗" with "Our story ↗" across chunks and HTML.
2. Replace phone number with "+918101685159" across chunks and HTML.
3. Replace location with "Kolkata, India, 700001" across chunks and HTML.
4. Restore cards 02 & 03 in "Our approach" on About page.
5. Fix empty space below Souvik's card on About page (grid-template-rows: auto, tighter gap).
6. Change update time on Privacy Policy & Terms of Service to "September 2026".
+. Update navbar header/footer Logo from "OPUS" to "CORABIN".
"""

import os
import re

BASE_DIR = "/home/souvik/Projects/opus_template.framer.website"
SITE_DIR = os.path.join(BASE_DIR, "framerusercontent.com/sites/46CYIm3dbxFoU3f63shpCX")
MODULES_DIR = os.path.join(SITE_DIR, "https/framerusercontent.com/modules")

# -------------------------------------------------------------
# 1. LOGO: "OPUS" -> "CORABIN"
# -------------------------------------------------------------
print("--- Updating Logo to CORABIN ---")

# In script_main.CNn1uaXy.mjs
script_main_path = os.path.join(SITE_DIR, "script_main.CNn1uaXy.mjs")
with open(script_main_path, "r", encoding="utf-8") as f:
    sm_content = f.read()

old_logo_css = '[`.framer-N9nKc { -webkit-mask: ${Et}; aspect-ratio: 3.4583333333333335; background-color: var(--oavjfn); mask: ${Et}; width: 83px; }`]'
new_logo_css = '[`.framer-N9nKc { -webkit-mask: none; mask: none; background-color: transparent; width: auto; height: 28px; aspect-ratio: auto; display: inline-flex; align-items: center; font-family: "Inter Display", "Inter", sans-serif; font-size: 22px; font-weight: 800; letter-spacing: -0.04em; text-transform: uppercase; color: var(--oavjfn, rgb(12, 18, 12)); line-height: 1; text-decoration: none; } .framer-N9nKc::after { content: "CORABIN"; display: inline-block; }`]'

if old_logo_css in sm_content:
    sm_content = sm_content.replace(old_logo_css, new_logo_css)
    with open(script_main_path, "w", encoding="utf-8") as f:
        f.write(sm_content)
    print("Updated script_main.CNn1uaXy.mjs Logo CSS")
else:
    print("Note: old_logo_css not found in script_main, checking if already updated...")

# Update HTML files for Logo and Custom Overrides
corabin_css_override = """<style id="corabin-custom-overrides">
    /* Remove unused sections & framer badge */
    [data-framer-name="Pricing"],
    #pricing,
    [data-framer-name="After work"],
    #__framer-badge-container,
    .__framer-badge {
        display: none !important;
    }
    
    /* Corabin Brand Logo (Inter Display 800) */
    .framer-N9nKc {
        -webkit-mask: none !important;
        mask: none !important;
        background-color: transparent !important;
        width: auto !important;
        height: 28px !important;
        aspect-ratio: auto !important;
        display: inline-flex !important;
        align-items: center !important;
        font-family: "Inter Display", "Inter", -apple-system, BlinkMacSystemFont, sans-serif !important;
        font-size: 22px !important;
        font-weight: 800 !important;
        letter-spacing: -0.04em !important;
        text-transform: uppercase !important;
        color: var(--oavjfn, var(--token-bb407a59-7892-4758-ae44-34831ff9d303, rgb(12, 18, 12))) !important;
        line-height: 1 !important;
        text-decoration: none !important;
    }
    .framer-N9nKc::after {
        content: "CORABIN" !important;
        display: inline-block !important;
    }

    /* Spacing adjustments on About page */
    .framer-14jbf0j,
    .framer-a7ZOl .framer-14jbf0j {
        grid-template-rows: auto !important;
        height: auto !important;
        min-height: auto !important;
        margin-bottom: 0px !important;
    }
    .framer-1cqp2my,
    .framer-a7ZOl .framer-1cqp2my {
        gap: 40px !important;
    }
    .framer-1w5nlk2,
    .framer-a7ZOl .framer-1w5nlk2 {
        gap: 40px !important;
        padding-top: 60px !important;
        padding-bottom: 40px !important;
    }
    
    /* Ensure clean single founder layout */
    .corabin-founder-card {
        grid-column: 1 / -1 !important;
        max-width: 480px !important;
        margin: 0 auto !important;
    }
</style>"""

html_files = [
    os.path.join(BASE_DIR, "index.html"),
    os.path.join(BASE_DIR, "opus-template.framer.website/index.html")
]

for html_path in html_files:
    if os.path.exists(html_path):
        with open(html_path, "r", encoding="utf-8") as f:
            html = f.read()
        
        # Replace corabin-custom-overrides block
        html = re.sub(r'<style id="corabin-custom-overrides">.*?</style>', corabin_css_override, html, flags=re.DOTALL)
        
        with open(html_path, "w", encoding="utf-8") as f:
            f.write(html)
        print(f"Updated {html_path} with new Logo & Spacing CSS overrides")

# -------------------------------------------------------------
# 2. ITEM 1: Replace "Meet the team ↗" with "Our story ↗"
# -------------------------------------------------------------
print("\n--- Item 1: Replace Meet the team with Our story ---")

home_mjs_path = os.path.join(SITE_DIR, "iKJRSh9jmrbmilHdac6ozhPaiCytW8lQqaCPLmlLitI.Z1Wyg5E1.mjs")
with open(home_mjs_path, "r", encoding="utf-8") as f:
    home_mjs = f.read()

if "PYCSKtmKV:`Meet the team`" in home_mjs:
    home_mjs = home_mjs.replace("PYCSKtmKV:`Meet the team`", "PYCSKtmKV:`Our story`")
    with open(home_mjs_path, "w", encoding="utf-8") as f:
        f.write(home_mjs)
    print("Updated iKJRSh9jmrbmilHdac6ozhPaiCytW8lQqaCPLmlLitI.Z1Wyg5E1.mjs: PYCSKtmKV -> 'Our story'")
else:
    print("Note: PYCSKtmKV:`Meet the team` not found in home mjs")

# In module augiA20Il.js
augi_js_path = os.path.join(MODULES_DIR, "5ClbloOPINMGWdjJrcrC/8di8dsBRxVbof9tpvgwT/augiA20Il.js")
if os.path.exists(augi_js_path):
    with open(augi_js_path, "r", encoding="utf-8") as f:
        augi_js = f.read()
    if 'PYCSKtmKV: "Meet the team"' in augi_js:
        augi_js = augi_js.replace('PYCSKtmKV: "Meet the team"', 'PYCSKtmKV: "Our story"')
        with open(augi_js_path, "w", encoding="utf-8") as f:
            f.write(augi_js)
        print("Updated augiA20Il.js: PYCSKtmKV -> 'Our story'")

# In ynxsaIxXW.BCRUgNo9.mjs & AO9TGkCbC._OuyEL15.mjs
for fname in ["ynxsaIxXW.BCRUgNo9.mjs", "AO9TGkCbC._OuyEL15.mjs"]:
    p = os.path.join(SITE_DIR, fname)
    if os.path.exists(p):
        with open(p, "r", encoding="utf-8") as f:
            content = f.read()
        if '"data-framer-name":`Meet the team`' in content:
            content = content.replace('"data-framer-name":`Meet the team`', '"data-framer-name":`Our story`')
            with open(p, "w", encoding="utf-8") as f:
                f.write(content)
            print(f"Updated {fname}: data-framer-name -> 'Our story'")

# -------------------------------------------------------------
# 3. ITEM 2: Replace phone number with +918101685159
# -------------------------------------------------------------
print("\n--- Item 2: Replace phone number with +918101685159 ---")

contact_mjs_path = os.path.join(SITE_DIR, "JLqe-6-qAsyy3l1paNGwEVrh-qv_jf3v_djF_VYWBoY.Ba0X3WII.mjs")
with open(contact_mjs_path, "r", encoding="utf-8") as f:
    contact_mjs = f.read()

contact_mjs = contact_mjs.replace("tel:+1 (555) 123-4567", "tel:+918101685159")
contact_mjs = contact_mjs.replace("+1 (555) 123-4567", "+918101685159")
with open(contact_mjs_path, "w", encoding="utf-8") as f:
    f.write(contact_mjs)
print("Updated JLqe contact chunk with +918101685159")

contact_module_path = os.path.join(MODULES_DIR, "VM6LshqF3kGfk3qxJUTi/2SWjHeF37NxXG6KxhVeu/TQtrT4cVD.js")
if os.path.exists(contact_module_path):
    with open(contact_module_path, "r", encoding="utf-8") as f:
        c_mod = f.read()
    c_mod = c_mod.replace("tel:+1 (555) 123-4567", "tel:+918101685159")
    c_mod = c_mod.replace("+1 (555) 123-4567", "+918101685159")
    with open(contact_module_path, "w", encoding="utf-8") as f:
        f.write(c_mod)
    print("Updated TQtrT4cVD.js with +918101685159")

# Also check cDUh2JYGT-2.BDCxe8nq.mjs and cDUh2JYGT-2.js
legal_mjs_path = os.path.join(SITE_DIR, "cDUh2JYGT-2.BDCxe8nq.mjs")
with open(legal_mjs_path, "r", encoding="utf-8") as f:
    legal_mjs = f.read()
legal_mjs = legal_mjs.replace("(555) 123-4567", "+918101685159")
with open(legal_mjs_path, "w", encoding="utf-8") as f:
    f.write(legal_mjs)

legal_js_path = os.path.join(MODULES_DIR, "Wp7ae5IzVzvpX9IekuHe/rGng6IvzYvn1rGoY4lTQ/cDUh2JYGT-2.js")
if os.path.exists(legal_js_path):
    with open(legal_js_path, "r", encoding="utf-8") as f:
        legal_js = f.read()
    legal_js = legal_js.replace("(555) 123-4567", "+918101685159")
    with open(legal_js_path, "w", encoding="utf-8") as f:
        f.write(legal_js)
    print("Updated cDUh2JYGT-2 legal files with +918101685159")

# -------------------------------------------------------------
# 4. ITEM 3: Replace location with Kolkata, India, 700001
# -------------------------------------------------------------
print("\n--- Item 3: Replace location with Kolkata, India, 700001 ---")

with open(contact_mjs_path, "r", encoding="utf-8") as f:
    contact_mjs = f.read()
contact_mjs = contact_mjs.replace("42 Pixel Place, Suite 404, New York, NY 10012", "Kolkata, India, 700001")
with open(contact_mjs_path, "w", encoding="utf-8") as f:
    f.write(contact_mjs)
print("Updated JLqe contact chunk with Kolkata, India, 700001")

if os.path.exists(contact_module_path):
    with open(contact_module_path, "r", encoding="utf-8") as f:
        c_mod = f.read()
    c_mod = c_mod.replace("42 Pixel Place, Suite 404, New York, NY 10012", "Kolkata, India, 700001")
    with open(contact_module_path, "w", encoding="utf-8") as f:
        f.write(c_mod)
    print("Updated TQtrT4cVD.js with Kolkata, India, 700001")

# -------------------------------------------------------------
# 5. ITEM 4: Restore "Our approach" Cards 02 & 03 on About page
# -------------------------------------------------------------
print("\n--- Item 4: Restore Our approach cards 02 & 03 ---")

about_mjs_path = os.path.join(SITE_DIR, "znfm_uW3YvFdDZ28MEdBO9z2HrI7OaPyUiz_zX9GYnw.DsWxHuen.mjs")
with open(about_mjs_path, "r", encoding="utf-8") as f:
    about_mjs = f.read()

# Exact Card 01 ending in current file:
card1_target = 'className:`framer-6bru7k`,"data-framer-name":`We take the time to truly understand your business, goals, and challenges before proposing any solutions. This foundation helps us truly serve your needs.`,fonts:[`Inter`],verticalAlignment:`top`,withExternalLayout:!0})]})]})'

# Restored Cards 02 and 03:
cards_2_and_3 = ''',p(G,{__framer__animate:{transition:q},__framer__animateOnce:!0,__framer__enter:Y,__framer__exit:ft,__framer__styleAppearEffectEnabled:!0,__framer__threshold:.5,__perspectiveFX:!1,__targetOpacity:1,className:`framer-fafg3r`,"data-framer-name":`Card`,children:[u(R,{__fromCanvasComponent:!0,children:u(n,{children:u(`h2`,{className:`framer-styles-preset-1dzuwqo`,"data-styles-preset":`l6fBe7Wqi`,dir:`auto`,children:`02`})}),className:`framer-16blzjv`,"data-framer-name":`02`,fonts:[`Inter`],verticalAlignment:`top`,withExternalLayout:!0}),u(R,{__fromCanvasComponent:!0,children:u(n,{children:u(`h3`,{className:`framer-styles-preset-1nepq3m`,"data-styles-preset":`cGUnsbRA0`,children:`Thoughtful solutions`})}),className:`framer-3z3u7k`,"data-framer-name":`Thoughtful solutions`,fonts:[`Inter`],verticalAlignment:`top`,withExternalLayout:!0}),u(R,{__fromCanvasComponent:!0,children:u(n,{children:u(`p`,{className:`framer-styles-preset-15o9ve6`,"data-styles-preset":`V_DfU9Xne`,children:`We don\'t believe in one-size-fits-all approaches. Every solution we create is carefully crafted to address your specific challenges and opportunities.`})}),className:`framer-6a910f`,"data-framer-name":`We don\'t believe in one-size-fits-all approaches. Every solution we create is carefully crafted to address your specific challenges and opportunities.`,fonts:[`Inter`],verticalAlignment:`top`,withExternalLayout:!0})]}),p(G,{__framer__animate:{transition:pt},__framer__animateOnce:!0,__framer__enter:Y,__framer__exit:mt,__framer__styleAppearEffectEnabled:!0,__framer__threshold:.5,__perspectiveFX:!1,__targetOpacity:1,className:`framer-w9h2tm`,"data-framer-name":`Card`,children:[u(R,{__fromCanvasComponent:!0,children:u(n,{children:u(`h2`,{className:`framer-styles-preset-1dzuwqo`,"data-styles-preset":`l6fBe7Wqi`,dir:`auto`,children:`03`})}),className:`framer-4ja6m6`,"data-framer-name":`03`,fonts:[`Inter`],verticalAlignment:`top`,withExternalLayout:!0}),u(R,{__fromCanvasComponent:!0,children:u(n,{children:u(`h3`,{className:`framer-styles-preset-1nepq3m`,"data-styles-preset":`cGUnsbRA0`,children:`Continuous innovation`})}),className:`framer-12g6rje`,"data-framer-name":`Continuous innovation`,fonts:[`Inter`],verticalAlignment:`top`,withExternalLayout:!0}),u(R,{__fromCanvasComponent:!0,children:u(n,{children:u(`p`,{className:`framer-styles-preset-15o9ve6`,"data-styles-preset":`V_DfU9Xne`,children:`Technology never stands still, and neither do we. We\'re constantly learning, adapting, and finding better ways to serve our clients.`})}),className:`framer-18h6dqu`,"data-framer-name":`Technology never stands still, and neither do we. We\'re constantly learning, adapting, and finding better ways to serve our clients.`,fonts:[`Inter`],verticalAlignment:`top`,withExternalLayout:!0})]})'''

card1_with_restored = 'className:`framer-6bru7k`,"data-framer-name":`We take the time to truly understand your business, goals, and challenges before proposing any solutions. This foundation helps us truly serve your needs.`,fonts:[`Inter`],verticalAlignment:`top`,withExternalLayout:!0})]}' + cards_2_and_3 + '])'

if card1_target in about_mjs:
    about_mjs = about_mjs.replace(card1_target, card1_with_restored)
    print("Successfully restored Cards 02 & 03 in znfm_uW3YvFdDZ28MEdBO9z2HrI7OaPyUiz_zX9GYnw.DsWxHuen.mjs")
else:
    print("Note: Card 01 target pattern not matched directly, checking if already has Thoughtful solutions...")
    if "Thoughtful solutions" in about_mjs:
        print("Cards 02 & 03 already present!")
    else:
        print("ERROR: Card 01 pattern not found in about_mjs!")

# -------------------------------------------------------------
# 6. ITEM 5: Spacing below single founder card on About page
# -------------------------------------------------------------
print("\n--- Item 5: Fix whitespace below single founder on About page ---")

# Replace grid-template-rows: repeat(2, minmax(0, 1fr)) with grid-template-rows: auto
old_grid_css = ".framer-a7ZOl .framer-14jbf0j { display: grid; flex: none; gap: 32px; grid-auto-rows: minmax(0, 1fr); grid-template-columns: repeat(4, minmax(50px, 1fr)); grid-template-rows: repeat(2, minmax(0, 1fr)); height: min-content; justify-content: center; overflow: visible; padding: 0px; position: relative; width: 100%; }"
new_grid_css = ".framer-a7ZOl .framer-14jbf0j { display: grid; flex: none; gap: 32px; grid-auto-rows: minmax(0, 1fr); grid-template-columns: repeat(4, minmax(50px, 1fr)); grid-template-rows: auto; height: min-content; justify-content: center; overflow: visible; padding: 0px; position: relative; width: 100%; }"

if old_grid_css in about_mjs:
    about_mjs = about_mjs.replace(old_grid_css, new_grid_css)
    print("Replaced grid-template-rows: repeat(2, ...) with grid-template-rows: auto in about_mjs")
else:
    print("Note: old_grid_css not found, attempting regex replace...")
    about_mjs = re.sub(
        r'(\.framer-a7ZOl \.framer-14jbf0j \{[^}]*?grid-template-rows: )repeat\(2, minmax\(0, 1fr\)\)(;[^}]*\})',
        r'\g<1>auto\g<2>',
        about_mjs
    )

# Tighten padding and container gap in about_mjs CSS
about_mjs = about_mjs.replace(
    ".framer-a7ZOl .framer-1cqp2my { align-content: flex-start; align-items: flex-start; display: flex; flex: none; flex-direction: column; flex-wrap: nowrap; gap: 96px; height: min-content; justify-content: flex-start; max-width: 1800px; overflow: visible; padding: 0px; position: relative; width: 100%; }",
    ".framer-a7ZOl .framer-1cqp2my { align-content: flex-start; align-items: flex-start; display: flex; flex: none; flex-direction: column; flex-wrap: nowrap; gap: 40px; height: min-content; justify-content: flex-start; max-width: 1800px; overflow: visible; padding: 0px; position: relative; width: 100%; }"
)

about_mjs = about_mjs.replace(
    ".framer-a7ZOl .framer-1w5nlk2, .framer-a7ZOl .framer-1v06md3 { align-content: center; align-items: center; display: flex; flex: none; flex-direction: column; flex-wrap: nowrap; gap: 60px; height: min-content; justify-content: flex-start; overflow: visible; padding: 100px 60px 100px 60px; position: relative; width: 100%; }",
    ".framer-a7ZOl .framer-1w5nlk2, .framer-a7ZOl .framer-1v06md3 { align-content: center; align-items: center; display: flex; flex: none; flex-direction: column; flex-wrap: nowrap; gap: 40px; height: min-content; justify-content: flex-start; overflow: visible; padding: 60px 60px 40px 60px; position: relative; width: 100%; }"
)

with open(about_mjs_path, "w", encoding="utf-8") as f:
    f.write(about_mjs)
print("Updated znfm_uW3YvFdDZ28MEdBO9z2HrI7OaPyUiz_zX9GYnw.DsWxHuen.mjs spacing")

# -------------------------------------------------------------
# 7. ITEM 6: Privacy Policy & Terms of Service -> September 2026
# -------------------------------------------------------------
print("\n--- Item 6: Privacy Policy & Terms of Service update date ---")

privacy_mjs_path = os.path.join(SITE_DIR, "HVys2JR_mqWQ4qjYZ5ZXrhG6fmf28G6GRdCMu6paL6w.Btfzp99i.mjs")
with open(privacy_mjs_path, "r", encoding="utf-8") as f:
    p_mjs = f.read()

# Replace Jan 15, 2025 with September 2026
p_mjs = p_mjs.replace("Jan 15, 2025", "September 2026")
# Replace R=ft(k,se()) with R=`September 2026`
p_mjs = p_mjs.replace("R=ft(k,se())", "R=`September 2026`")
with open(privacy_mjs_path, "w", encoding="utf-8") as f:
    f.write(p_mjs)
print("Updated HVys2JR chunk: Jan 15, 2025 -> September 2026")

privacy_mod_path = os.path.join(MODULES_DIR, "aO1Y68TlMjXmj5KquoGP/k6Bxl2JbT2Boo3bo69Yi/qMeMkGgYA.js")
if os.path.exists(privacy_mod_path):
    with open(privacy_mod_path, "r", encoding="utf-8") as f:
        p_mod = f.read()
    p_mod = p_mod.replace("Jan 15, 2025", "September 2026")
    p_mod = p_mod.replace("R = ft(k, se())", 'R = "September 2026"')
    with open(privacy_mod_path, "w", encoding="utf-8") as f:
        f.write(p_mod)
    print("Updated qMeMkGgYA.js: Jan 15, 2025 -> September 2026")

print("\n--- All Round 2 Refinements Applied Successfully! ---")
