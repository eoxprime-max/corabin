import os
import re

BASE_DIR = "/home/souvik/Projects/opus_template.framer.website"
HOME_MJS = os.path.join(BASE_DIR, "framerusercontent.com/sites/46CYIm3dbxFoU3f63shpCX/iKJRSh9jmrbmilHdac6ozhPaiCytW8lQqaCPLmlLitI.Z1Wyg5E1.mjs")

# 1. Update HTML files (both root and opus-template folder)
for h_file in ["opus-template.framer.website/index.html", "index.html"]:
    p = os.path.join(BASE_DIR, h_file)
    with open(p, "r", encoding="utf-8") as f:
        html = f.read()
    
    # Replace Motion Graphics with App Development
    html = html.replace(">Motion Graphics<", ">App Development<")
    html = html.replace('"Motion Graphics"', '"App Development"')
    
    # Replace Client retention in paragraph with On-time delivery
    html = html.replace(">Client retention<", ">On-time delivery<")
    html = html.replace('"Client retention"', '"On-time delivery"')
    
    # Replace Infinity Icon with 5+ text in HTML
    # <div class="framer-1mdck3s" data-framer-name="Icon Wrapper">...</div>
    html = re.sub(
        r'<div class="framer-1mdck3s" data-framer-name="Icon Wrapper">[\s\S]*?</div>\s*</div>',
        '<div class="framer-1mdck3s" data-framer-name="Icon Wrapper"><div class="framer-1918xru" data-framer-component-type="RichTextContainer" style="transform:none"><h1 class="framer-text framer-styles-preset-9meupv" data-styles-preset="ecQl5A1yh" style="--framer-text-color:var(--token-8e40c9bb-798b-4b01-b44f-6ce860eedadb, rgb(255, 255, 255))">5<span style="--framer-text-color:var(--token-cd9ab9a9-1d98-4bbc-9f79-c98ab7a3770b, rgb(0, 72, 249))" class="framer-text">+</span></h1></div></div>',
        html
    )
    
    with open(p, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"Updated {h_file}")

# 2. Update Home MJS
with open(HOME_MJS, "r", encoding="utf-8") as f:
    hm = f.read()

hm = hm.replace("XjTPTz1lc:`Motion Graphics`", "XjTPTz1lc:`App Development`")
hm = hm.replace("`Motion Graphics`", "`App Development`")
hm = hm.replace("`Client retention`", "`On-time delivery`")

# Tablet override for projects later:
hm = hm.replace("children:`projects`", "children:`Projects`")
hm = hm.replace("children:`later`", "children:`delivered`")

# Infinity Icon in Home MJS -> replace with 5+
# d(`div`,{className:`framer-1mdck3s`,"data-framer-name":`Icon Wrapper`,children:d(te,{className:`framer-acx9xf`,"data-framer-name":`Infinity Icon`...})})
infinity_pattern = re.compile(r'd\(`div`,{className:`framer-1mdck3s`,"data-framer-name":`Icon Wrapper`,children:d\(te,{className:`framer-acx9xf`,"data-framer-name":`Infinity Icon`[\s\S]*?}\)\)}\)')
replacement_5plus = "d(`div`,{className:`framer-1mdck3s`,\"data-framer-name\":`Icon Wrapper`,children:d(K,{__fromCanvasComponent:!0,children:d(r,{children:m(`h1`,{className:`framer-styles-preset-9meupv`,\"data-styles-preset\":`ecQl5A1yh`,style:{\"--framer-text-color\":`var(--token-8e40c9bb-798b-4b01-b44f-6ce860eedadb, rgb(255, 255, 255))`},children:[`5`,d(`span`,{style:{\"--framer-text-color\":`var(--token-cd9ab9a9-1d98-4bbc-9f79-c98ab7a3770b, rgb(0, 72, 249))`},children:`+`})]})}),className:`framer-1918xru`,\"data-framer-name\":`5+`,fonts:[`Inter`],verticalAlignment:`top`,withExternalLayout:!0})})"

if infinity_pattern.search(hm):
    hm = infinity_pattern.sub(replacement_5plus, hm)
    print("Replaced Infinity Icon with 5+ in Home MJS")
else:
    print("Warning: infinity pattern not matched, attempting direct substring replacement")
    idx = hm.find('"data-framer-name":`Infinity Icon`')
    if idx != -1:
        start_div = hm.rfind('d(`div`,{className:`framer-1mdck3s`', 0, idx)
        end_div = hm.find('})})', idx) + 4
        if start_div != -1 and end_div != -1:
            hm = hm[:start_div] + replacement_5plus + hm[end_div:]
            print("Replaced Infinity Icon via index search in Home MJS")

with open(HOME_MJS, "w", encoding="utf-8") as f:
    f.write(hm)
print("Updated Home MJS successfully")
