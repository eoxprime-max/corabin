#!/usr/bin/env python3
"""
patch_social_insert.py - Insert Reddit, Discord, GitHub after X in social blocks.

The exact HTML structure we're targeting in each footer responsive variant:

    </div>              ← closes X entry (framer-5p9otn)
</div>                  ← closes Socials container (framer-3v64wr)
<div class="framer-1ljltif" data-framer-name="Navigation">  ← Navigation starts

We insert Reddit, Discord, GitHub entries BEFORE </div> (Socials container close).
"""

import re
from pathlib import Path

ROOT = Path(__file__).parent.parent

NEW_SOCIALS_TEMPLATE = """\
                                    <div class="framer-1ajyosv" data-framer-name="{name}" data-framer-component-type="RichTextContainer" style="--extracted-r6o4lv:var(--token-8e40c9bb-798b-4b01-b44f-6ce860eedadb, rgb(255, 255, 255));--framer-paragraph-spacing:14px;transform:none">
                                        <p class="framer-text framer-styles-preset-187nily" data-styles-preset="rYiD74HIx" style="--framer-text-color:var(--extracted-r6o4lv, var(--token-8e40c9bb-798b-4b01-b44f-6ce860eedadb, rgb(255, 255, 255)))">
                                            <!--$--><a class="framer-text framer-styles-preset-wk3ys3" data-styles-preset="tooqoNzjM" href="{url}" target="_blank" rel="noopener noreferrer">{name}</a>
                                            <!--/$-->
                                        </p>
                                    </div>"""

NEW_ENTRIES = [
    ("Reddit", "https://reddit.com/user/CorabinHQ/"),
    ("Discord", "https://discord.gg/prUmeKj7E"),
    ("GitHub", "https://github.com/corabin"),
]

NEW_SOCIALS_HTML = "\n".join(
    NEW_SOCIALS_TEMPLATE.format(name=name, url=url)
    for name, url in NEW_ENTRIES
)


def patch_file(file_path):
    """Insert Reddit/Discord/GitHub after X entry in each Socials block."""
    with open(file_path, "r", encoding="utf-8", errors="replace") as f:
        content = f.read()

    # Guard: don't double-insert
    if "reddit.com/user/CorabinHQ" in content or "discord.gg/prUmeKj7E" in content:
        return False, "already has Reddit/Discord — skipping"

    # Find the pattern:
    # The X entry closes (</div>), then immediately the Socials container closes (</div>),
    # then Navigation div starts.
    #
    # We look for:
    #   <!--/$-->
    #   </p>
    #   </div>              ← X entry close
    # </div>                ← Socials (framer-3v64wr) close
    # <div ... data-framer-name="Navigation"
    #
    # The indentation is 36 spaces for X entry close and 32 for Socials close.

    pattern = re.compile(
        r'(<!--/\$-->\s*\n'                              # <!--/$-->
        r'\s*</p>\s*\n'                                  # </p>
        r'\s*</div>\s*\n)'                               # closes X (framer-5p9otn)
        r'(\s*</div>\s*\n'                               # closes Socials (framer-3v64wr)
        r'\s*<div[^>]*data-framer-name="Navigation")',   # Navigation div starts
        re.DOTALL
    )

    count = len(pattern.findall(content))
    if count == 0:
        return False, "pattern not found"

    # We need to determine the correct indentation for the insertion.
    # Extract the indentation used by the X entry's closing </div>
    # by looking at the first match.
    m = pattern.search(content)
    if not m:
        return False, "no match found"

    # Get the indentation of the closing </div> of X entry
    x_close_line = m.group(1).split("\n")
    # Find the line with </div>
    x_indent = ""
    for line in x_close_line:
        if "</div>" in line:
            x_indent = line[:len(line) - len(line.lstrip())]
            break

    # Build the insertion with correct indentation
    # The NEW_SOCIALS_TEMPLATE uses 36-space indent, which should match
    insertion = "\n" + NEW_SOCIALS_HTML + "\n"

    def replacer(m):
        return m.group(1) + insertion + m.group(2)

    new_content = pattern.sub(replacer, content)

    if new_content == content:
        return False, "substitution produced no changes"

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(new_content)

    return True, f"inserted Reddit/Discord/GitHub in {count} social blocks"


def main():
    html_files = sorted(ROOT.rglob("*.html"))
    html_files = [f for f in html_files if ".git" not in f.parts]

    print(f"Processing {len(html_files)} HTML files...\n")
    modified = 0
    skipped = 0
    errors = 0

    for path in html_files:
        rel = path.relative_to(ROOT)
        ok, msg = patch_file(path)
        if ok:
            print(f"  UPDATED  {rel}: {msg}")
            modified += 1
        else:
            if "already has" in msg or "no changes" in msg or "pattern not found" in msg:
                skipped += 1
            else:
                print(f"  SKIP     {rel}: {msg}")
                skipped += 1

    print(f"\nDone. Modified: {modified}, Skipped: {skipped}, Errors: {errors}")

    # Verification
    print("\n--- VERIFICATION ---")
    with open(ROOT / "index.html", "r", encoding="utf-8") as f:
        idx = f.read()

    platforms = {
        "LinkedIn": "linkedin.com/company/corabin",
        "Instagram": "instagram.com/corabinagency",
        "Facebook": "facebook.com/61594918605124",
        "X": "x.com/CorabinStudio",
        "Reddit": "reddit.com/user/CorabinHQ",
        "Discord": "discord.gg/prUmeKj7E",
        "GitHub": "github.com/corabin",
    }
    all_ok = True
    for name, url in platforms.items():
        count = idx.count(url)
        if count > 0:
            print(f"  OK  ({count}x) {name}: {url}")
        else:
            print(f"  MISSING! {name}: {url}")
            all_ok = False

    if all_ok:
        print("\nAll 7 social platforms confirmed in index.html footer.")
    else:
        print("\nWARNING: Some platforms are missing!")

    # Count occurrences to verify 3 breakpoints
    reddit_count = idx.count("reddit.com/user/CorabinHQ")
    print(f"\nReddit appears {reddit_count} times in index.html (expected 3 for 3 breakpoints)")

    discord_count = idx.count("discord.gg/prUmeKj7E")
    print(f"Discord appears {discord_count} times in index.html (expected 3 for 3 breakpoints)")


if __name__ == "__main__":
    main()
