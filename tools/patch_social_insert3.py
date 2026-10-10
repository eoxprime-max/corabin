#!/usr/bin/env python3
"""
patch_social_insert3.py - Insert Reddit, Discord, GitHub as visual footer links.

Uses the actual indentation discovered from the HTML:
  20 spaces for X entry </div>
  16 spaces for Socials container </div>
  16 spaces for Navigation <div>
"""

import re
from pathlib import Path

ROOT = Path(__file__).parent.parent

# 20-space indent for entries inside the Socials container (framer-3v64wr)
INDENT = " " * 20  # 20 spaces

NEW_SOCIALS_TEMPLATE = (
    '{indent}<div class="framer-1ajyosv" data-framer-name="{name}" '
    'data-framer-component-type="RichTextContainer" '
    'style="--extracted-r6o4lv:var(--token-8e40c9bb-798b-4b01-b44f-6ce860eedadb, rgb(255, 255, 255));'
    '--framer-paragraph-spacing:14px;transform:none">\n'
    '{indent}    <p class="framer-text framer-styles-preset-187nily" '
    'data-styles-preset="rYiD74HIx" '
    'style="--framer-text-color:var(--extracted-r6o4lv, var(--token-8e40c9bb-798b-4b01-b44f-6ce860eedadb, rgb(255, 255, 255)))">\n'
    '{indent}        <!--$--><a class="framer-text framer-styles-preset-wk3ys3" '
    'data-styles-preset="tooqoNzjM" href="{url}" target="_blank" rel="noopener noreferrer">{name}</a>\n'
    '{indent}        <!--/$-->\n'
    '{indent}    </p>\n'
    '{indent}</div>'
)

NEW_ENTRIES = [
    ("Reddit",  "https://reddit.com/user/CorabinHQ/"),
    ("Discord", "https://discord.gg/prUmeKj7E"),
    ("GitHub",  "https://github.com/corabin"),
]


def build_new_socials(indent):
    return "\n".join(
        NEW_SOCIALS_TEMPLATE.format(indent=indent, name=name, url=url)
        for name, url in NEW_ENTRIES
    )


def patch_file(file_path):
    with open(file_path, "r", encoding="utf-8", errors="replace") as f:
        content = f.read()

    # Guard: check if Reddit is already a visual <a href> link
    if 'href="https://reddit.com/user/CorabinHQ/' in content:
        return False, "already patched"

    # Detect indentation from the actual file
    # Find the X entry closing pattern to get actual indentation
    # Looking for: <!--/$-->\n{indent2}</p>\n{indent1}</div>\n{indent0}</div>
    # where indent1 is what we want for our insertion

    # Strategy: find the X entry's </div> that's followed by </div> (Socials close)
    # then <div...Navigation.
    # We know the structure from debugging:
    #   "<!--/$-->\n" + "                        </p>\n" + "                    </div>\n"
    #   + "                </div>\n" + "                <div...Navigation"

    # Try to detect the actual indent from the file
    # Find data-framer-name="X" first, then find the pattern after it
    x_idx = content.find('data-framer-name="X"')
    if x_idx == -1:
        return False, "X entry not found"

    # Find the <!--/$--> after the X entry
    slash_dollar_idx = content.find('<!--/$-->', x_idx)
    if slash_dollar_idx == -1:
        return False, "<!--/$--> not found after X"

    # Get the line after <!--/$--> to find </p> indentation
    after_slash = content[slash_dollar_idx + len('<!--/$-->'):]
    p_close_match = re.match(r'\n( *)</p>', after_slash)
    if not p_close_match:
        return False, "Could not detect </p> indentation"

    p_indent = p_close_match.group(1)  # spaces before </p>
    # The social entry div uses 4 fewer spaces than </p>
    # (since </p> is one level in from the div)
    entry_indent_len = max(0, len(p_indent) - 4)
    entry_indent = " " * entry_indent_len
    socials_close_indent = " " * max(0, entry_indent_len - 4)

    new_socials = build_new_socials(entry_indent)

    # Build the pattern using detected indentation
    # Pattern: <!--/$-->\n{p_indent}</p>\n{entry_indent}</div>\n{socials_indent}</div>\n{socials_indent}<div...Navigation
    pattern_str = (
        r'(<!--/\$-->\n'
        + re.escape(p_indent) + r'</p>\n'
        + re.escape(entry_indent) + r'</div>\n)'
        + r'(' + re.escape(socials_close_indent) + r'</div>\n)'
        + r'(' + re.escape(socials_close_indent) + r'<div[^\n]*data-framer-name="Navigation")'
    )

    pattern = re.compile(pattern_str)
    matches = pattern.findall(content)
    count = len(matches)

    if count == 0:
        return False, f"Pattern not found (p_indent={len(p_indent)} spaces, entry_indent={entry_indent_len} spaces)"

    def replacer(m):
        return m.group(1) + new_socials + "\n" + m.group(2) + m.group(3)

    new_content = pattern.sub(replacer, content)

    if new_content == content:
        return False, "substitution made no changes"

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(new_content)

    return True, f"inserted Reddit/Discord/GitHub ({count} blocks)"


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
            if "already patched" not in msg:
                print(f"  SKIP     {rel}: {msg}")

    print(f"\nDone. Modified: {modified}, Skipped: {skipped}")

    # Verification
    print("\n--- VERIFICATION of index.html ---")
    with open(ROOT / "index.html", "r", encoding="utf-8") as f:
        idx = f.read()

    all_platforms = [
        ("LinkedIn", 'href="https://linkedin.com/company/corabin"'),
        ("Instagram", 'href="https://instagram.com/corabinagency"'),
        ("Facebook", 'href="https://facebook.com/61594918605124/"'),
        ("X",        'href="https://x.com/CorabinStudio"'),
        ("Reddit",   'href="https://reddit.com/user/CorabinHQ/"'),
        ("Discord",  'href="https://discord.gg/prUmeKj7E"'),
        ("GitHub",   'href="https://github.com/corabin"'),
    ]
    all_ok = True
    for name, href in all_platforms:
        n = idx.count(href)
        if n >= 3:
            print(f"  OK  ({n}x) {name}")
        elif n > 0:
            print(f"  PARTIAL ({n}x — expected 3) {name}")
            all_ok = False
        else:
            print(f"  MISSING! {name}")
            all_ok = False

    if all_ok:
        print("\nAll 7 social platforms appear 3+ times in index.html ✓")
    else:
        print("\nWARNING: Some platforms are not present 3 times (one per breakpoint)!")


if __name__ == "__main__":
    main()
