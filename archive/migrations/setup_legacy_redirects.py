#!/usr/bin/env python3
"""
setup_legacy_redirects.py — Generates clean, fast redirect stubs for legacy project routes
and standard _redirects configuration for static hosts (Cloudflare Pages, Netlify, etc.)
"""

import os

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

LEGACY_REDIRECTS = [
    ("projects/arrows", "projects/kora", "Kora — Scaling Revenue Architecture"),
    ("projects/chantalle", "projects/himon", "Himon — Intelligent Fleet Technology"),
    ("projects/papyrus", "projects/norda", "Nordå — Scandinavian Architecture Studio"),
    ("projects/london-museum", "projects/ardene", "Ardène — Boutique Residential Real Estate"),
    ("projects/bullseye", "projects/havyn", "Havyn — Modern Real Estate Experience"),
    ("projects/interference", "projects/almare", "Almare — Roman Spatial Design Studio"),
]

REDIRECT_HTML_TEMPLATE = """<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Redirecting to {target_title} | Corabin</title>
    <meta http-equiv="refresh" content="0; url=/{target_slug}">
    <link rel="canonical" href="https://corabin.com/{target_slug}">
    <meta name="robots" content="noindex, follow">
    <script>window.location.replace("/{target_slug}");</script>
    <style>
        body {{
            margin: 0;
            padding: 80px 24px;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background-color: #F3F3F1;
            color: #0C120C;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 50vh;
        }}
        .brand {{
            font-size: 20px;
            font-weight: 600;
            letter-spacing: -0.02em;
            margin-bottom: 24px;
        }}
        p {{
            font-size: 16px;
            color: rgba(12, 18, 12, 0.7);
            margin: 0 0 16px 0;
        }}
        a {{
            color: #0048F9;
            text-decoration: underline;
            font-weight: 500;
        }}
    </style>
</head>
<body>
    <div class="brand">CORABIN</div>
    <p>Redirecting to <a href="/{target_slug}">{target_title}</a>...</p>
</body>
</html>
"""

def generate_redirect_stubs():
    print("--- Generating Legacy Project Redirect Stubs ---")
    redirects_lines = []
    
    for legacy_dir, target_slug, target_title in LEGACY_REDIRECTS:
        full_legacy_dir = os.path.join(BASE_DIR, legacy_dir)
        os.makedirs(full_legacy_dir, exist_ok=True)
        
        index_file = os.path.join(full_legacy_dir, "index.html")
        html_content = REDIRECT_HTML_TEMPLATE.format(
            target_slug=target_slug,
            target_title=target_title
        )
        
        with open(index_file, "w", encoding="utf-8") as f:
            f.write(html_content)
        
        print(f"[OK] Created redirect stub: /{legacy_dir} -> /{target_slug}")
        redirects_lines.append(f"/{legacy_dir} /{target_slug} 301")
        redirects_lines.append(f"/{legacy_dir}/ /{target_slug} 301")

    # Write _redirects for Netlify / Cloudflare Pages
    redirects_file = os.path.join(BASE_DIR, "_redirects")
    redirects_content = "# Corabin 301 Redirects for Legacy Slugs\n" + "\n".join(redirects_lines) + "\n\n# SPA fallback for legal and 404\n/privacy /privacy/index.html 200\n/terms /terms/index.html 200\n/* /404.html 404\n"
    
    with open(redirects_file, "w", encoding="utf-8") as f:
        f.write(redirects_content)
    print(f"[OK] Generated {redirects_file}")

if __name__ == "__main__":
    generate_redirect_stubs()
