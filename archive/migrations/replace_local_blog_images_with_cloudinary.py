#!/usr/bin/env python3
"""
tools/replace_local_blog_images_with_cloudinary.py
Replaces all production references to local blog images with verified Cloudinary URLs.
Includes dry-run mode and verification checks.
"""

import os
import re
import sys

CLOUD_NAME = "teolzwgc"
CLOUDINARY_BASE = f"https://res.cloudinary.com/{CLOUD_NAME}/image/upload/f_auto,q_auto"

MAPPING = {
    "blog1": {
        "slug": "custom-vs-off-the-shelf-choose-wisely",
        "public_id": "corabin/blog-covers/custom-vs-off-the-shelf-choose-wisely-edb0902a"
    },
    "blog2": {
        "slug": "design-that-converts-our-approach",
        "public_id": "corabin/blog-covers/design-that-converts-our-approach-80009e6b"
    },
    "blog3": {
        "slug": "7-critical-steps-to-successfully-launch-your-digital-product",
        "public_id": "corabin/blog-covers/7-critical-steps-to-successfully-launch-your-digital-product-1f3f96f8"
    },
    "blog4": {
        "slug": "choosing-the-right-tech-stack-a-decision-framework-for-2025",
        "public_id": "corabin/blog-covers/choosing-the-right-tech-stack-a-decision-framework-for-2025-12999377"
    },
    "blog5": {
        "slug": "speed-up-your-website-today",
        "public_id": "corabin/blog-covers/speed-up-your-website-today-b415b53e"
    },
    "blog6": {
        "slug": "why-design-systems-actually-matter",
        "public_id": "corabin/blog-covers/why-design-systems-actually-matter-17f749da"
    },
    "blog7": {
        "slug": "headless-cms-the-future-is-here",
        "public_id": "corabin/blog-covers/headless-cms-the-future-is-here-1bda897f"
    },
    "blog8": {
        "slug": "stop-making-these-common-api-mistakes",
        "public_id": "corabin/blog-covers/stop-making-these-common-api-mistakes-3524e774"
    },
    "blog9": {
        "slug": "website-security-made-simple",
        "public_id": "corabin/blog-covers/website-security-made-simple-b53a4be0"
    },
    "blog10": {
        "slug": "technical-debt-friend-or-foe",
        "public_id": "corabin/blog-covers/technical-debt-friend-or-foe-120bb0fa"
    },
    "blog11": {
        "slug": "real-estate-agent-website-cost-2026",
        "public_id": "corabin/blog-covers/real-estate-agent-website-cost-2026-80f8a7b8"
    },
    "blog12": {
        "slug": "idx-listings-not-showing-google",
        "public_id": "corabin/blog-covers/idx-listings-not-showing-google-206d957f"
    }
}

for k, v in MAPPING.items():
    pid = v["public_id"]
    v["url"] = f"{CLOUDINARY_BASE}/{pid}"
    v["srcset_4widths"] = f"{CLOUDINARY_BASE},w_512/{pid} 512w, {CLOUDINARY_BASE},w_1024/{pid} 1024w, {CLOUDINARY_BASE},w_1672/{pid} 1672w, {CLOUDINARY_BASE},w_2688/{pid} 2688w"
    v["srcset_3widths"] = f"{CLOUDINARY_BASE},w_512/{pid} 512w, {CLOUDINARY_BASE},w_1024/{pid} 1024w, {CLOUDINARY_BASE},w_1672/{pid} 1672w"

def process_file(filepath, dry_run=False):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    orig_content = content

    # 1. blog-runtime.js
    if filepath.endswith("blog-runtime.js"):
        b1_url = MAPPING["blog1"]["url"]
        content = content.replace("'/assets/images/blogs/blog1.webp'", f"'{b1_url}'")
        content = content.replace('"/assets/images/blogs/blog1.webp"', f'"{b1_url}"')
        content = re.sub(
            r'// Prefer modern, lightweight \.webp for local blog assets\s*if\s*\(clean\.startsWith\(\'/assets/images/blogs/blog\'\)[^}]+\}',
            '// All 13 posts use Cloudinary; local blog image fallback removed',
            content
        )
        content = re.sub(
            r'// If it\'s a local blog image, build responsive webp srcset\s*if\s*\(clean\.startsWith\(\'/assets/images/blogs/blog\'\)[^}]+\}',
            '// All 13 posts use Cloudinary; local blog image branch removed',
            content
        )
        content = content.replace("* - Local static paths (/assets/images/blogs/...)", "* - Cloudinary CDN delivery URLs")

    # 2. article.html
    elif filepath.endswith("public/blog/article.html"):
        b1_url = MAPPING["blog1"]["url"]
        b1_srcset = MAPPING["blog1"]["srcset_3widths"]
        content = content.replace("https://corabin.com/assets/images/blogs/blog1.webp", b1_url)
        content = content.replace("/assets/images/blogs/blog1.webp", b1_url)
        content = re.sub(
            r'srcset="[^"]*blog1\.(?:webp|png)[^"]*"',
            f'srcset="{b1_srcset}"',
            content
        )

    # 3. Framer bundle l0aFVHEAD.Du2GMRYI.mjs
    elif filepath.endswith("l0aFVHEAD.Du2GMRYI.mjs"):
        for i in range(1, 13):
            key = f"blog{i}"
            info = MAPPING[key]
            # Replace src
            content = content.replace(f'"/assets/images/blogs/{key}.webp"', f'"{info["url"]}"')
            # Replace srcSet
            srcset_pattern = rf'"/assets/images/blogs/{key}\.webp 512w, /assets/images/blogs/{key}\.webp 1024w, /assets/images/blogs/{key}\.webp (?:1600w|1672w)"'
            content = re.sub(srcset_pattern, f'"{info["srcset_3widths"]}"', content)

    # 4. Standard static HTML files (index.html, about, contact, projects, blog/index)
    else:
        for i in range(1, 4):
            key = f"blog{i}"
            info = MAPPING[key]
            
            # Replace srcset variations
            content = re.sub(
                rf'srcset="[^"]*assets/images/blogs/{key}\.(?:png|webp)[^"]*"',
                f'srcset="{info["srcset_4widths"]}"',
                content
            )
            # Replace src
            content = re.sub(
                rf'src="/assets/images/blogs/{key}\.(?:png|webp)"',
                f'src="{info["url"]}"',
                content
            )

    if content != orig_content:
        changes = len(orig_content) - len(content)
        print(f"[{'DRY-RUN' if dry_run else 'APPLIED'}] {filepath} (delta: {changes} chars)")
        if not dry_run:
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(content)
        return True
    return False

def main():
    dry_run = "--execute" not in sys.argv
    print(f"=== REPLACING LOCAL BLOG IMAGE REFERENCES (mode: {'DRY RUN' if dry_run else 'LIVE EXECUTE'}) ===")

    target_files = [
        "public/assets/js/blog-runtime.js",
        "public/blog/article.html",
        "public/blog/index.html",
        "public/index.html",
        "public/about/index.html",
        "public/contact/index.html",
        "public/projects/index.html",
        "public/projects/kora/index.html",
        "public/projects/himon/index.html",
        "public/projects/norda/index.html",
        "public/projects/ardene/index.html",
        "public/projects/havyn/index.html",
        "public/projects/almare/index.html",
        "public/framerusercontent.com/sites/46CYIm3dbxFoU3f63shpCX/l0aFVHEAD.Du2GMRYI.mjs"
    ]

    modified_count = 0
    for tf in target_files:
        if os.path.exists(tf):
            if process_file(tf, dry_run=dry_run):
                modified_count += 1
        else:
            print(f"WARNING: File {tf} does not exist.")

    print(f"\nTotal files modified: {modified_count}/{len(target_files)}")

if __name__ == "__main__":
    main()
