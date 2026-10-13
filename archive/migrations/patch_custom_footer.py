#!/usr/bin/env python3
"""
patch_custom_footer.py - Add Reddit/Discord/GitHub to pages with the custom HTML footer
(privacy, terms, 404, and some project pages that have a different footer structure).

These pages have a Socials section like:
    <a href="https://linkedin.com/..." ...>LinkedIn</a>
    <a href="https://instagram.com/..." ...>Instagram</a>
    <a href="https://facebook.com/..." ...>Facebook</a>
    <a href="https://x.com/..." ...>X</a>

We need to append Reddit, Discord, GitHub after X.
"""

import re
from pathlib import Path

ROOT = Path(__file__).parent.parent

NEW_ENTRIES = [
    ("Reddit",  "https://reddit.com/user/CorabinHQ/"),
    ("Discord", "https://discord.gg/prUmeKj7E"),
    ("GitHub",  "https://github.com/corabin"),
]


def patch_file(file_path):
    with open(file_path, "r", encoding="utf-8", errors="replace") as f:
        content = f.read()

    # Skip if already has Reddit as an <a href>
    if 'href="https://reddit.com/user/CorabinHQ/' in content:
        return False, "already patched"

    # Skip if doesn't have the custom footer (looking for facebook.com link as <a href>)
    if 'href="https://facebook.com/61594918605124/"' not in content:
        return False, "no custom footer with Facebook link"

    # Skip if doesn't have X as <a href>
    if 'href="https://x.com/CorabinStudio"' not in content:
        return False, "no X link found"

    # Find the X link in the custom footer and insert after it
    # The X entry looks like:
    # <a href="https://x.com/CorabinStudio" target="_blank" rel="noopener" style="...">X</a>
    # followed by a closing </div>

    # Extract the style attribute from an existing link to match format
    # Find the X link line to get its style
    x_pattern = re.compile(
        r'(<a href="https://x\.com/CorabinStudio"[^>]*>X</a>)',
    )
    m = x_pattern.search(content)
    if not m:
        return False, "X link not found"

    x_link = m.group(1)
    # Extract the style part from the X link to reuse for new entries
    style_match = re.search(r'style="([^"]*)"', x_link)
    link_style = style_match.group(1) if style_match else "color: rgba(255, 255, 255, 0.8); text-decoration: none;"

    # Extract other attributes (target, rel)
    attrs_match = re.search(r'href="[^"]*"([^>]*)>', x_link)
    other_attrs = attrs_match.group(1).strip() if attrs_match else 'target="_blank" rel="noopener"'
    # Normalize: ensure target and rel are there
    if 'target=' not in other_attrs:
        other_attrs += ' target="_blank"'
    if 'rel=' not in other_attrs:
        other_attrs += ' rel="noopener noreferrer"'

    # Build new link entries
    new_links = ""
    for name, url in NEW_ENTRIES:
        new_links += f'\n                        <a href="{url}" target="_blank" rel="noopener noreferrer" style="{link_style}">{name}</a>'

    # Insert after the X link
    new_content = x_pattern.sub(m.group(1) + new_links, content, count=1)

    if new_content == content:
        return False, "substitution produced no changes"

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(new_content)

    return True, "inserted Reddit/Discord/GitHub after X"


def main():
    html_files = sorted(ROOT.rglob("*.html"))
    html_files = [f for f in html_files if ".git" not in f.parts]

    print(f"Processing {len(html_files)} HTML files...\n")
    modified = 0
    skipped = 0

    for path in html_files:
        rel = path.relative_to(ROOT)
        ok, msg = patch_file(path)
        if ok:
            print(f"  UPDATED  {rel}: {msg}")
            modified += 1
        else:
            skipped += 1
            if "already patched" not in msg and "no custom footer" not in msg:
                print(f"  SKIP     {rel}: {msg}")

    print(f"\nDone. Modified: {modified}, Skipped: {skipped}")

    # Verify
    print("\n--- Verification: Files with all 7 social links as href ---")
    all_platforms = {
        "LinkedIn": 'href="https://linkedin.com/company/corabin"',
        "Instagram": 'href="https://instagram.com/corabinagency"',
        "Facebook": 'href="https://facebook.com/61594918605124/"',
        "X":        'href="https://x.com/CorabinStudio"',
        "Reddit":   'href="https://reddit.com/user/CorabinHQ/"',
        "Discord":  'href="https://discord.gg/prUmeKj7E"',
        "GitHub":   'href="https://github.com/corabin"',
    }

    sample_files = [
        ROOT / "privacy/index.html",
        ROOT / "terms/index.html",
        ROOT / "404.html",
    ]
    for path in sample_files:
        if not path.exists():
            continue
        with open(path, encoding="utf-8") as f:
            content = f.read()
        rel = path.relative_to(ROOT)
        missing = [n for n, h in all_platforms.items() if h not in content]
        if missing:
            print(f"  MISSING in {rel}: {missing}")
        else:
            print(f"  OK  {rel}: all 7 platforms present")


if __name__ == "__main__":
    main()
