#!/usr/bin/env python3
"""
patch_social_links.py - Task 1 & 2: Social Media Update + Codebase Cleanup

TASK 1: Update social media links across all HTML files:
  - Remove Dribbble and Behance
  - Add Facebook, X, Reddit, Discord, GitHub
  - Update Instagram URL from corabin.studio to corabinagency
  - Update sameAs JSON-LD arrays
  - Update LinkedIn URL from www.linkedin to linkedin (normalize)

TASK 2: Codebase cleanup of Framer branding (visible/user-facing only):
  - Update sameAs arrays to have correct URLs
  - No destructive changes to CSS classes (framer-* classes are framework code)
"""

import os
import re
import glob
from pathlib import Path

# ============================================================
# CONFIGURATION
# ============================================================

ROOT = Path(__file__).parent.parent  # project root

# New social media data
SOCIAL_PLATFORMS = [
    {
        "name": "LinkedIn",
        "url": "https://linkedin.com/company/corabin",
        "old_framer_name": "LinkedIn",
        "div_class": "framer-1whz7tv",
    },
    {
        "name": "Instagram",
        "url": "https://instagram.com/corabinagency",
        "old_framer_name": "Instagram",
        "div_class": "framer-1ajyosv",
    },
    {
        "name": "Facebook",
        "url": "https://facebook.com/61594918605124/",
        "old_framer_name": "Dribbble",   # replaces Dribbble
        "div_class": "framer-1ppv1sp",
    },
    {
        "name": "X",
        "url": "https://x.com/CorabinStudio",
        "old_framer_name": "Behance",    # replaces Behance
        "div_class": "framer-5p9otn",
    },
    {
        "name": "Reddit",
        "url": "https://reddit.com/user/CorabinHQ/",
        "old_framer_name": None,          # new addition
        "div_class": None,
    },
    {
        "name": "Discord",
        "url": "https://discord.gg/prUmeKj7E",
        "old_framer_name": None,
        "div_class": None,
    },
    {
        "name": "GitHub",
        "url": "https://github.com/corabin",
        "old_framer_name": None,
        "div_class": None,
    },
]

# The 4 new additions (Reddit, Discord, GitHub) use the same structure as existing ones
NEW_SOCIALS = [p for p in SOCIAL_PLATFORMS if p["old_framer_name"] is None]

# JSON-LD sameAs entries (old → new full list)
OLD_SAMEAS_PATTERNS = [
    r'"https://www\.linkedin\.com/company/corabin"',
    r'"https://www\.instagram\.com/corabin\.studio"',
    r'"https://dribbble\.com/corabin"',
    r'"https://www\.behance\.net/corabin"',
]

NEW_SAMEAS_JSON = '''    "https://linkedin.com/company/corabin",
    "https://instagram.com/corabinagency",
    "https://facebook.com/61594918605124/",
    "https://x.com/CorabinStudio",
    "https://reddit.com/user/CorabinHQ/",
    "https://discord.gg/prUmeKj7E",
    "https://github.com/corabin"'''

# ============================================================
# HELPERS
# ============================================================

def find_all_html_files():
    """Find all HTML files in the project root, excluding .git"""
    html_files = []
    for path in ROOT.rglob("*.html"):
        # skip git internals
        if ".git" in path.parts:
            continue
        html_files.append(path)
    return sorted(html_files)


def make_social_link_div(platform, style_attrs=""):
    """
    Build a div block for a social link matching the existing pattern.
    The existing pattern uses data-framer-name for the platform name.
    """
    base_style = (
        "--extracted-r6o4lv:var(--token-8e40c9bb-798b-4b01-b44f-6ce860eedadb, rgb(255, 255, 255));"
        "--framer-paragraph-spacing:14px;transform:none"
    )
    p_style = "--framer-text-color:var(--extracted-r6o4lv, var(--token-8e40c9bb-798b-4b01-b44f-6ce860eedadb, rgb(255, 255, 255)))"

    return (
        f'                                    <div class="framer-1ajyosv" data-framer-name="{platform["name"]}" '
        f'data-framer-component-type="RichTextContainer" style="{base_style}">\n'
        f'                                        <p class="framer-text framer-styles-preset-187nily" '
        f'data-styles-preset="rYiD74HIx" style="{p_style}">\n'
        f'                                            <!--$--><a class="framer-text framer-styles-preset-wk3ys3" '
        f'data-styles-preset="tooqoNzjM" href="{platform["url"]}" target="_blank" rel="noopener noreferrer">'
        f'{platform["name"]}</a>\n'
        f'                                            <!--/$-->\n'
        f'                                        </p>\n'
        f'                                    </div>\n'
    )


def patch_sameas(content):
    """Replace the sameAs array in JSON-LD structured data."""
    # Match the entire sameAs block
    pattern = re.compile(
        r'"sameAs"\s*:\s*\[([^\]]*)\]',
        re.DOTALL
    )
    replacement = f'"sameAs": [\n{NEW_SAMEAS_JSON}\n  ]'
    new_content, count = pattern.subn(replacement, content)
    return new_content, count


def patch_instagram_url(content):
    """Fix Instagram URL: corabin.studio → corabinagency"""
    old = "https://www.instagram.com/corabin.studio"
    new = "https://instagram.com/corabinagency"
    new_content = content.replace(old, new)
    count = content.count(old)
    return new_content, count


def patch_linkedin_url(content):
    """Normalize LinkedIn URL: www.linkedin → linkedin"""
    old = "https://www.linkedin.com/company/corabin"
    new = "https://linkedin.com/company/corabin"
    new_content = content.replace(old, new)
    count = content.count(old)
    return new_content, count


def patch_social_block(content, file_path):
    """
    Find each "Socials" div containing LinkedIn/Instagram/Dribbble/Behance,
    and replace the Dribbble/Behance entries, then append Reddit/Discord/GitHub.

    Pattern to find:
      <div class="framer-1ppv1sp" data-framer-name="Dribbble" ...>
        ... href="https://dribbble.com/corabin" ...>Dribbble</a>
      </div>
      <div class="framer-5p9otn" data-framer-name="Behance" ...>
        ... href="https://www.behance.net/corabin" ...>Behance</a>
      </div>
    
    Replace Dribbble with Facebook, Behance with X,
    then insert Reddit, Discord, GitHub after Behance/X div.
    """
    changes = 0

    # --- Step 1: Replace Dribbble → Facebook ---
    dribbble_pattern = re.compile(
        r'(<div\s+class="framer-1ppv1sp"\s+data-framer-name="Dribbble"[^>]*>.*?'
        r'href=")[^"]*(".*?>)Dribbble(</a>)',
        re.DOTALL
    )
    def replace_dribbble(m):
        return (
            m.group(1).replace(
                'data-framer-name="Dribbble"', 
                'data-framer-name="Facebook"'
            ) +
            "https://facebook.com/61594918605124/" +
            m.group(2) +
            "Facebook" +
            m.group(3)
        )
    # We need a broader approach — let's use a more targeted pattern

    # Replace Dribbble href and label
    content, n = re.subn(
        r'(href=")https://dribbble\.com/corabin(".*?>)Dribbble',
        r'\g<1>https://facebook.com/61594918605124/\g<2>Facebook',
        content
    )
    changes += n

    # Replace Behance href and label
    content, n = re.subn(
        r'(href=")https://www\.behance\.net/corabin(".*?>)Behance',
        r'\g<1>https://x.com/CorabinStudio\g<2>X',
        content
    )
    changes += n

    # Update data-framer-name for Dribbble → Facebook and Behance → X
    content, n = re.subn(
        r'data-framer-name="Dribbble"',
        'data-framer-name="Facebook"',
        content
    )
    changes += n

    content, n = re.subn(
        r'data-framer-name="Behance"',
        'data-framer-name="X"',
        content
    )
    changes += n

    # --- Step 2: Insert Reddit, Discord, GitHub after each X (Behance) block ---
    # Find the closing tag of the X div block (formerly Behance div, class framer-5p9otn)
    # and insert the 3 new social divs after it.
    
    # New social entries HTML (matching existing style)
    def make_new_social_entry(name, url):
        base_style = (
            "--extracted-r6o4lv:var(--token-8e40c9bb-798b-4b01-b44f-6ce860eedadb, rgb(255, 255, 255));"
            "--framer-paragraph-spacing:14px;transform:none"
        )
        p_style = "--framer-text-color:var(--extracted-r6o4lv, var(--token-8e40c9bb-798b-4b01-b44f-6ce860eedadb, rgb(255, 255, 255)))"
        indent = "                                    "
        return (
            f'{indent}<div class="framer-1ajyosv" data-framer-name="{name}" '
            f'data-framer-component-type="RichTextContainer" style="{base_style}">\n'
            f'{indent}    <p class="framer-text framer-styles-preset-187nily" '
            f'data-styles-preset="rYiD74HIx" style="{p_style}">\n'
            f'{indent}        <!--$--><a class="framer-text framer-styles-preset-wk3ys3" '
            f'data-styles-preset="tooqoNzjM" href="{url}" target="_blank" rel="noopener noreferrer">'
            f'{name}</a>\n'
            f'{indent}        <!--/$-->\n'
            f'{indent}    </p>\n'
            f'{indent}</div>\n'
        )

    new_socials_block = ""
    for plat in [
        ("Reddit", "https://reddit.com/user/CorabinHQ/"),
        ("Discord", "https://discord.gg/prUmeKj7E"),
        ("GitHub", "https://github.com/corabin"),
    ]:
        new_socials_block += make_new_social_entry(plat[0], plat[1])

    # The X block ends with </div> followed by whitespace and then
    # </div> that closes the "Socials" wrapper (framer-3v64wr)
    # We need to insert the new entries BEFORE the closing </div> of framer-3v64wr
    # after the last social entry (X, formerly Behance, class framer-5p9otn)
    
    # Pattern: the closing div of the framer-5p9otn block, before framer-3v64wr closes
    # framer-5p9otn closing </div> followed by closing </div> of framer-3v64wr
    
    # We'll look for the X link block's last closing div followed immediately by
    # the closing div of the Socials container
    behance_x_closing_pattern = re.compile(
        r'(<!--/\$-->\s*\n\s*</p>\s*\n\s*</div>\s*\n)'  # closing of X (Behance) entry
        r'(\s*</div>\s*\n'                               # closing of Socials container
        r'\s*<div[^>]*data-framer-name="Navigation")',   # start of Navigation div
        re.DOTALL
    )

    def insert_new_socials(m):
        return m.group(1) + new_socials_block + m.group(2)

    # Count existing occurrences before inserting (to avoid double-insertion)
    if "Reddit" not in content and "discord.gg" not in content:
        new_content, n = behance_x_closing_pattern.subn(insert_new_socials, content)
        if n > 0:
            content = new_content
            changes += n
    else:
        # Already has Reddit — just count as 0 new insertions
        pass

    return content, changes


def patch_file(file_path):
    """Apply all patches to a single file. Returns (modified, change_summary)."""
    try:
        with open(file_path, "r", encoding="utf-8", errors="replace") as f:
            original = f.read()
    except Exception as e:
        return False, f"ERROR reading: {e}"

    content = original
    summary = []

    # 1. Fix LinkedIn URL
    content, n = patch_linkedin_url(content)
    if n:
        summary.append(f"LinkedIn URL normalized ({n} occurrences)")

    # 2. Fix Instagram URL
    content, n = patch_instagram_url(content)
    if n:
        summary.append(f"Instagram URL updated ({n} occurrences)")

    # 3. Replace sameAs JSON-LD array
    content, n = patch_sameas(content)
    if n:
        summary.append(f"sameAs JSON-LD updated ({n} blocks)")

    # 4. Replace Dribbble→Facebook, Behance→X, insert Reddit/Discord/GitHub
    content, n = patch_social_block(content, file_path)
    if n:
        summary.append(f"Social link block updated ({n} replacements/insertions)")

    if content == original:
        return False, "no changes needed"

    try:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        return True, "; ".join(summary) if summary else "modified"
    except Exception as e:
        return False, f"ERROR writing: {e}"


# ============================================================
# MAIN
# ============================================================

def main():
    html_files = find_all_html_files()
    print(f"Found {len(html_files)} HTML files to process.\n")

    modified_count = 0
    skipped_count = 0
    error_count = 0

    for file_path in html_files:
        rel = file_path.relative_to(ROOT)
        modified, summary = patch_file(file_path)
        if "ERROR" in summary:
            print(f"  ERROR  {rel}: {summary}")
            error_count += 1
        elif modified:
            print(f"  UPDATED {rel}: {summary}")
            modified_count += 1
        else:
            skipped_count += 1

    print(f"\n{'='*60}")
    print(f"Done. Modified: {modified_count}, Skipped: {skipped_count}, Errors: {error_count}")

    # Verification step
    print("\n--- VERIFICATION ---")
    print("Checking for remaining Dribbble/Behance references in HTML files...")
    remaining_dribbble = []
    remaining_behance = []
    wrong_instagram = []
    for file_path in html_files:
        try:
            with open(file_path, "r", encoding="utf-8", errors="replace") as f:
                content = f.read()
            if "dribbble.com/corabin" in content.lower():
                remaining_dribbble.append(str(file_path.relative_to(ROOT)))
            if "behance.net/corabin" in content.lower():
                remaining_behance.append(str(file_path.relative_to(ROOT)))
            if "corabin.studio" in content:
                wrong_instagram.append(str(file_path.relative_to(ROOT)))
        except Exception:
            pass

    if remaining_dribbble:
        print(f"  WARNING: Dribbble still found in: {remaining_dribbble}")
    else:
        print("  OK: No remaining Dribbble references in HTML files.")

    if remaining_behance:
        print(f"  WARNING: Behance still found in: {remaining_behance}")
    else:
        print("  OK: No remaining Behance references in HTML files.")

    if wrong_instagram:
        print(f"  WARNING: Old Instagram URL still in: {wrong_instagram}")
    else:
        print("  OK: No old Instagram URL references in HTML files.")

    print("\nChecking all 7 social platforms appear in index.html...")
    try:
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
        for name, url in platforms.items():
            if url in idx:
                print(f"  OK: {name} ({url})")
            else:
                print(f"  MISSING: {name} ({url})")
    except Exception as e:
        print(f"  ERROR reading index.html: {e}")


if __name__ == "__main__":
    main()
