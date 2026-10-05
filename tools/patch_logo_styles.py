#!/usr/bin/env python3
"""
tools/patch_logo_styles.py
Updates the website logo styling across all HTML files:
- Sets width: 24px, height: 24px, margin-right: 10px
- Sets background-size: contain (replacing 120% auto)
- Points background-image to /assets/images/Corabin_logo.png
- Updates both base styles and override styles in both root and public/
"""

import glob
import re

html_files = sorted(glob.glob("**/*.html", recursive=True))
print(f"Found {len(html_files)} HTML files to process.")

# Base pattern without !important
base_pattern = re.compile(
    r'\.framer-N9nKc::before\s*\{\s*'
    r'content:\s*""\s*;\s*'
    r'display:\s*inline-block\s*;\s*'
    r'width:\s*\d+px\s*;\s*'
    r'height:\s*\d+px\s*;\s*'
    r'margin-right:\s*\d+px\s*;\s*'
    r'background-image:\s*url\("[^"]+"\)\s*;\s*'
    r'background-size:\s*[^;]+;\s*'
    r'background-position:\s*center\s*;\s*'
    r'background-repeat:\s*no-repeat\s*;\s*'
    r'flex-shrink:\s*0\s*'
    r'\}',
    re.DOTALL
)

base_replacement = (
    '.framer-N9nKc::before {\n'
    '            content: "";\n'
    '            display: inline-block;\n'
    '            width: 24px;\n'
    '            height: 24px;\n'
    '            margin-right: 10px;\n'
    '            background-image: url("/assets/images/Corabin_logo.png");\n'
    '            background-size: contain;\n'
    '            background-position: center;\n'
    '            background-repeat: no-repeat;\n'
    '            flex-shrink: 0\n'
    '        }'
)

# Override pattern with !important
override_pattern = re.compile(
    r'\.framer-N9nKc::before\s*\{\s*'
    r'content:\s*""\s*!important\s*;\s*'
    r'display:\s*inline-block\s*!important\s*;\s*'
    r'width:\s*\d+px\s*!important\s*;\s*'
    r'height:\s*\d+px\s*!important\s*;\s*'
    r'margin-right:\s*\d+px\s*!important\s*;\s*'
    r'background-image:\s*url\("[^"]+"\)\s*!important\s*;\s*'
    r'background-size:\s*[^;]+!important\s*;\s*'
    r'background-position:\s*center\s*!important\s*;\s*'
    r'background-repeat:\s*no-repeat\s*!important\s*;\s*'
    r'flex-shrink:\s*0\s*!important\s*;\s*'
    r'\}',
    re.DOTALL
)

override_replacement = (
    '.framer-N9nKc::before {\n'
    '        content: "" !important;\n'
    '        display: inline-block !important;\n'
    '        width: 24px !important;\n'
    '        height: 24px !important;\n'
    '        margin-right: 10px !important;\n'
    '        background-image: url("/assets/images/Corabin_logo.png") !important;\n'
    '        background-size: contain !important;\n'
    '        background-position: center !important;\n'
    '        background-repeat: no-repeat !important;\n'
    '        flex-shrink: 0 !important;\n'
    '    }'
)

updated_count = 0
for filepath in html_files:
    if filepath.startswith("test_"):
        continue
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    new_content = base_pattern.sub(base_replacement, content)
    new_content = override_pattern.sub(override_replacement, new_content)

    if new_content != content:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(new_content)
        updated_count += 1

print(f"Successfully patched {updated_count} HTML files with 24px contain logo styles.")
