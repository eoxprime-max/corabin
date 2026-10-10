#!/usr/bin/env python3
"""
patch_social_insert2.py - Insert Reddit, Discord, GitHub as visual footer links.

After the X (formerly Behance) social entry, before the closing </div> of the
Socials container (framer-3v64wr), in all 3 responsive breakpoints.
"""

import re
from pathlib import Path

ROOT = Path(__file__).parent.parent

# Match the exact Framer-generated structure
NEW_SOCIALS_TEMPLATE = (
    '                                    <div class="framer-1ajyosv" data-framer-name="{name}" '
    'data-framer-component-type="RichTextContainer" style="--extracted-r6o4lv:var(--token-8e40c9bb-798b-4b01-b44f-6ce860eedadb, rgb(255, 255, 255));'
    '--framer-paragraph-spacing:14px;transform:none">\n'
    '                                        <p class="framer-text framer-styles-preset-187nily" '
    'data-styles-preset="rYiD74HIx" style="--framer-text-color:var(--extracted-r6o4lv, var(--token-8e40c9bb-798b-4b01-b44f-6ce860eedadb, rgb(255, 255, 255)))">\n'
    '                                            <!--$--><a class="framer-text framer-styles-preset-wk3ys3" '
    'data-styles-preset="tooqoNzjM" href="{url}" target="_blank" rel="noopener noreferrer">{name}</a>\n'
    '                                            <!--/$-->\n'
    '                                        </p>\n'
    '                                    </div>'
)

NEW_ENTRIES = [
    ("Reddit", "https://reddit.com/user/CorabinHQ/"),
    ("Discord", "https://discord.gg/prUmeKj7E"),
    ("GitHub", "https://github.com/corabin"),
]

NEW_SOCIALS_HTML = "\n".join(
    NEW_SOCIALS_TEMPLATE.format(name=name, url=url)
    for name, url in NEW_ENTRIES
)

# The specific closing pattern for the X (formerly Behance) entry followed by the
# Socials container close and Navigation div start.
# We insert the new socials between the </div> of X and the </div> of the Socials container.
#
# Exact sequence (each line as-is, with leading whitespace):
#     </div>                    ← closes framer-5p9otn (X/Behance entry)
# </div>                        ← closes framer-3v64wr (Socials container)
# <div class="framer-1ljltif" data-framer-name="Navigation"

INSERT_PATTERN = re.compile(
    r'(                                    </div>\r?\n)'          # X entry close
    r'(                                </div>\r?\n)'              # Socials container close
    r'(                                <div[^\n]*data-framer-name="Navigation")',  # Navigation
    re.MULTILINE
)


def patch_file(file_path):
    with open(file_path, "r", encoding="utf-8", errors="replace") as f:
        content = f.read()

    # Guard: check for Reddit as an actual HTML link (href), not just JSON-LD
    if 'href="https://reddit.com/user/CorabinHQ/' in content:
        return False, "already has Reddit as HTML link"

    # Find the pattern — the X block's closing </div>
    # then the Socials </div>, then Navigation div
    # The key distinguisher: the X block's last child is <!--/$--> then </p> then </div>
    # We need to find that specific </div> that closes framer-5p9otn

    # Let me use a simpler but reliable approach:
    # Find the exact string "data-framer-name=\"X\"" and then find the next
    # "</div>\n" + "</div>\n" + '<div ... data-framer-name="Navigation"' sequence

    # Insert new social entries between the last social's </div> and the Socials container close
    # Pattern: after X </div>, before the Socials container </div>
    #
    # We'll search for the unique marker: the X (Behance replacement) entry's container
    # div close, which is followed by the Socials container close.
    # 
    # Using the pattern:
    #   <!--/$-->
    #   </p>
    #   </div>  ← closes X entry
    # </div>    ← closes Socials
    # <div ... data-framer-name="Navigation"

    PATTERN = re.compile(
        r'(<!--/\$-->\n'                                           # <!--/$-->
        r'                                            </p>\n'      # </p>
        r'                                    </div>\n)'           # closes X entry
        r'(                                </div>\n)'              # closes Socials
        r'(                                <div[^\n]*data-framer-name="Navigation")',  # Nav
    )

    count = len(PATTERN.findall(content))
    if count == 0:
        # Try with \r\n
        PATTERN_CRLF = re.compile(
            r'(<!--/\$-->\r\n'
            r'                                            </p>\r\n'
            r'                                    </div>\r\n)'
            r'(                                </div>\r\n)'
            r'(                                <div[^\n]*data-framer-name="Navigation")',
        )
        count = len(PATTERN_CRLF.findall(content))
        if count > 0:
            def replacer(m):
                return m.group(1) + NEW_SOCIALS_HTML + "\r\n" + m.group(2) + m.group(3)
            new_content = PATTERN_CRLF.sub(replacer, content)
        else:
            return False, f"pattern not matched (LF or CRLF)"
    else:
        def replacer(m):
            return m.group(1) + NEW_SOCIALS_HTML + "\n" + m.group(2) + m.group(3)
        new_content = PATTERN.sub(replacer, content)

    if new_content == content:
        return False, "no change after sub"

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(new_content)

    return True, f"inserted Reddit/Discord/GitHub in {count} location(s)"


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
            if "already has" not in msg:
                print(f"  SKIP     {rel}: {msg}")

    print(f"\nDone. Modified: {modified}, Skipped: {skipped}")

    # Verification on index.html
    print("\n--- VERIFICATION of index.html ---")
    with open(ROOT / "index.html", "r", encoding="utf-8") as f:
        idx = f.read()

    for name, url in NEW_ENTRIES:
        count = idx.count(f'href="{url}"')
        print(f"  {name}: {count} href occurrences (expected 3 for 3 breakpoints)")

    # Check all 7 platforms as visible links
    all_platforms = {
        "LinkedIn": "href=\"https://linkedin.com/company/corabin\"",
        "Instagram": "href=\"https://instagram.com/corabinagency\"",
        "Facebook": "href=\"https://facebook.com/61594918605124/\"",
        "X": "href=\"https://x.com/CorabinStudio\"",
        "Reddit": "href=\"https://reddit.com/user/CorabinHQ/\"",
        "Discord": "href=\"https://discord.gg/prUmeKj7E\"",
        "GitHub": "href=\"https://github.com/corabin\"",
    }
    print("\n--- All platform href counts in index.html ---")
    for name, href in all_platforms.items():
        n = idx.count(href)
        status = "OK" if n >= 3 else f"WARN ({n} found)"
        print(f"  {status}  {name}: {n} occurrences")


if __name__ == "__main__":
    main()
