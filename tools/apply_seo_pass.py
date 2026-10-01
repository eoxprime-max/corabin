#!/usr/bin/env python3
"""
SEO & Production Optimization Script for Corabin Studio Website
Applies: unique per-page titles, descriptions, canonicals, OG tags,
         Twitter cards, structured data, security meta, framer-search-index removal,
         og:image, og:site_name, viewport fix.

Run from project root:  python3 tools/apply_seo_pass.py
"""

import re, os

BASE = '/home/souvik/Projects/opus_template.framer.website'
DOMAIN = 'https://corabin.com'
OG_IMAGE = f'{DOMAIN}/assets/images/og-corabin.png'

# ──────────────────────────────────────────────────────────────────────────────
# Per-page SEO data
# Key = path relative to BASE (e.g. "" for root, "about" for /about)
# ──────────────────────────────────────────────────────────────────────────────
PAGES = {
    "": {
        "title": "Corabin — Digital Design & Modern Web Architecture Studio",
        "description": "Corabin is a boutique digital design studio. We build stronger brands, modern products, and high-performance websites that actually convert. Based in Kolkata.",
        "canonical": f"{DOMAIN}/",
        "og_url": f"{DOMAIN}/",
        "og_type": "website",
    },
    "about": {
        "title": "About Corabin — Our Studio, Story & Design Philosophy",
        "description": "Meet Souvik, founder of Corabin. We are a boutique digital studio built on 1:1 collaboration, bespoke design craft, and modern web architecture. Here is our story.",
        "canonical": f"{DOMAIN}/about",
        "og_url": f"{DOMAIN}/about",
        "og_type": "website",
    },
    "contact": {
        "title": "Contact Corabin — Start a Project or Get in Touch",
        "description": "Ready to build something exceptional? Reach Corabin at hello@corabin.com or +918101685159. Based in Kolkata, India — working globally.",
        "canonical": f"{DOMAIN}/contact",
        "og_url": f"{DOMAIN}/contact",
        "og_type": "website",
    },
    "blog": {
        "title": "Blog — Web Architecture, Design & Performance by Corabin",
        "description": "In-depth articles on custom web architecture, conversion-driven design, Core Web Vitals, design systems, headless CMS, and modern development by Corabin's founder.",
        "canonical": f"{DOMAIN}/blog",
        "og_url": f"{DOMAIN}/blog",
        "og_type": "website",
    },
    "projects": {
        "title": "Projects — Corabin Client Portfolio & Case Studies",
        "description": "Explore Corabin's portfolio of bespoke digital projects: Kora, Himon, Nordå, Ardène, Havyn, and Almare — spanning SaaS, logistics, architecture, and real estate.",
        "canonical": f"{DOMAIN}/projects",
        "og_url": f"{DOMAIN}/projects",
        "og_type": "website",
    },
    # Blog detail pages
    "blog/custom-vs-off-the-shelf-choose-wisely": {
        "title": "Custom Web Architecture vs. Commercial Templates: The ROI Breakdown — Corabin",
        "description": "A rigorous analysis of custom engineering versus off-the-shelf templates. Corabin examines DOM bloat, Core Web Vitals penalties, TCO, and the 36-month compounding value of bespoke architecture.",
        "canonical": f"{DOMAIN}/blog/custom-vs-off-the-shelf-choose-wisely",
        "og_url": f"{DOMAIN}/blog/custom-vs-off-the-shelf-choose-wisely",
        "og_type": "article",
    },
    "blog/design-that-converts-our-approach": {
        "title": "Conversion-Driven Design: How Top Digital Studios Engineer User Intent — Corabin",
        "description": "How Corabin uses cognitive load reduction, visual hierarchy, and micro-interactions to build websites that convert. A deep dive into the psychology of conversion-rate optimization.",
        "canonical": f"{DOMAIN}/blog/design-that-converts-our-approach",
        "og_url": f"{DOMAIN}/blog/design-that-converts-our-approach",
        "og_type": "article",
    },
    "blog/7-critical-steps-to-successfully-launch-your-digital-product": {
        "title": "7 Strategic Milestones for a Successful Digital Product Launch — Corabin",
        "description": "From core value thesis to post-launch feedback cadence: Corabin's 7-step framework for taking a digital product from concept to market without costly mistakes.",
        "canonical": f"{DOMAIN}/blog/7-critical-steps-to-successfully-launch-your-digital-product",
        "og_url": f"{DOMAIN}/blog/7-critical-steps-to-successfully-launch-your-digital-product",
        "og_type": "article",
    },
    "blog/choosing-the-right-tech-stack-a-decision-framework-for-2025": {
        "title": "The Modern Web Tech Stack: A Decision Framework for 2026 — Corabin",
        "description": "Edge infrastructure, caching topologies, and composable architecture. Corabin's framework for selecting the right tech stack for enterprise digital products in 2026.",
        "canonical": f"{DOMAIN}/blog/choosing-the-right-tech-stack-a-decision-framework-for-2025",
        "og_url": f"{DOMAIN}/blog/choosing-the-right-tech-stack-a-decision-framework-for-2025",
        "og_type": "article",
    },
    "blog/speed-up-your-website-today": {
        "title": "Sub-Second Web Performance: Mastering Core Web Vitals — Corabin",
        "description": "Deconstructing LCP, taming INP, and eliminating CLS. Corabin's practical engineering guide to achieving sub-second web performance and passing Google's Core Web Vitals.",
        "canonical": f"{DOMAIN}/blog/speed-up-your-website-today",
        "og_url": f"{DOMAIN}/blog/speed-up-your-website-today",
        "og_type": "article",
    },
    "blog/why-design-systems-actually-matter": {
        "title": "Why Scalable Design Systems Actually Matter for Growing Businesses — Corabin",
        "description": "Design tokens, semantic source of truth, and closing the designer-developer gap. Corabin explains why a well-architected design system is a business asset, not a luxury.",
        "canonical": f"{DOMAIN}/blog/why-design-systems-actually-matter",
        "og_url": f"{DOMAIN}/blog/why-design-systems-actually-matter",
        "og_type": "article",
    },
    "blog/headless-cms-the-future-is-here": {
        "title": "The Headless Architecture Paradigm: Decoupling Content from Presentation — Corabin",
        "description": "Why monolithic CMS platforms create technical debt and how headless architecture liberates your content as pure structured data. Corabin's guide to the headless paradigm.",
        "canonical": f"{DOMAIN}/blog/headless-cms-the-future-is-here",
        "og_url": f"{DOMAIN}/blog/headless-cms-the-future-is-here",
        "og_type": "article",
    },
    "blog/stop-making-these-common-api-mistakes": {
        "title": "High-Throughput API Architecture: Eliminating the Most Costly Bottlenecks — Corabin",
        "description": "Unbounded query payloads, neglected HTTP caching, and missing rate limits — Corabin's guide to designing APIs that scale without breaking under real-world traffic.",
        "canonical": f"{DOMAIN}/blog/stop-making-these-common-api-mistakes",
        "og_url": f"{DOMAIN}/blog/stop-making-these-common-api-mistakes",
        "og_type": "article",
    },
    "blog/website-security-made-simple": {
        "title": "Client-Side Web Security: Hardening Modern Frontends Against Common Attacks — Corabin",
        "description": "Content Security Policy, Subresource Integrity, and XSS mitigation. Corabin's practical guide to hardening the client-side security posture of modern web applications.",
        "canonical": f"{DOMAIN}/blog/website-security-made-simple",
        "og_url": f"{DOMAIN}/blog/website-security-made-simple",
        "og_type": "article",
    },
    "blog/technical-debt-friend-or-foe": {
        "title": "Technical Debt in Digital Products: Strategic Leverage or Architectural Decay? — Corabin",
        "description": "The financial analogy of technical debt, intentional vs. unintentional debt, and Corabin's 20% refactoring budget rule. A guide for CTOs making long-horizon engineering decisions.",
        "canonical": f"{DOMAIN}/blog/technical-debt-friend-or-foe",
        "og_url": f"{DOMAIN}/blog/technical-debt-friend-or-foe",
        "og_type": "article",
    },
    # Project detail pages
    "projects/kora": {
        "title": "Kora — Scaling Revenue Architecture for Modern Enterprises | Corabin",
        "description": "Corabin's case study on Kora: a bespoke digital architecture project focused on scaling revenue infrastructure for a modern enterprise client over 6 weeks.",
        "canonical": f"{DOMAIN}/projects/kora",
        "og_url": f"{DOMAIN}/projects/kora",
        "og_type": "website",
    },
    "projects/himon": {
        "title": "Himon — Precision Logistics & Intelligent Fleet Technology | Corabin",
        "description": "How Corabin designed and built Himon's digital product: a precision logistics platform with intelligent fleet technology. Delivered in 5 weeks.",
        "canonical": f"{DOMAIN}/projects/himon",
        "og_url": f"{DOMAIN}/projects/himon",
        "og_type": "website",
    },
    "projects/norda": {
        "title": "Nordå — Scandinavian Architecture Shaping Urban Landscapes | Corabin",
        "description": "Corabin's work on Nordå: a digital platform for a Scandinavian architecture studio shaping modern urban landscapes. Delivered in 7 weeks.",
        "canonical": f"{DOMAIN}/projects/norda",
        "og_url": f"{DOMAIN}/projects/norda",
        "og_type": "website",
    },
    "projects/ardene": {
        "title": "Ardène — Timeless Boutique Residences Across France | Corabin",
        "description": "Corabin designed the digital presence for Ardène, a French boutique residential real estate brand. An 8-week engagement focused on timeless visual craft.",
        "canonical": f"{DOMAIN}/projects/ardene",
        "og_url": f"{DOMAIN}/projects/ardene",
        "og_type": "website",
    },
    "projects/havyn": {
        "title": "Havyn — Curated Modern Real Estate with Local Depth | Corabin",
        "description": "Corabin's project for Havyn: curated modern real estate branding and digital platform designed to connect local depth with premium property presentation. 6 weeks.",
        "canonical": f"{DOMAIN}/projects/havyn",
        "og_url": f"{DOMAIN}/projects/havyn",
        "og_type": "website",
    },
    "projects/almare": {
        "title": "Almare — Quiet Spatial Design & Roman Interior Architecture | Corabin",
        "description": "Corabin's 4-week engagement with Almare: a digital identity for a quiet, Roman-influenced spatial design and interior architecture studio.",
        "canonical": f"{DOMAIN}/projects/almare",
        "og_url": f"{DOMAIN}/projects/almare",
        "og_type": "website",
    },
    # Legacy slug redirects (canonicals point to primary slugs)
    "projects/arrows": {
        "title": "Kora — Scaling Revenue Architecture for Modern Enterprises | Corabin",
        "description": "Corabin's case study on Kora: a bespoke digital architecture project focused on scaling revenue infrastructure for a modern enterprise client over 6 weeks.",
        "canonical": f"{DOMAIN}/projects/kora",
        "og_url": f"{DOMAIN}/projects/kora",
        "og_type": "website",
    },
    "projects/chantalle": {
        "title": "Himon — Precision Logistics & Intelligent Fleet Technology | Corabin",
        "description": "How Corabin designed and built Himon's digital product: a precision logistics platform with intelligent fleet technology. Delivered in 5 weeks.",
        "canonical": f"{DOMAIN}/projects/himon",
        "og_url": f"{DOMAIN}/projects/himon",
        "og_type": "website",
    },
    "projects/papyrus": {
        "title": "Nordå — Scandinavian Architecture Shaping Urban Landscapes | Corabin",
        "description": "Corabin's work on Nordå: a digital platform for a Scandinavian architecture studio shaping modern urban landscapes. Delivered in 7 weeks.",
        "canonical": f"{DOMAIN}/projects/norda",
        "og_url": f"{DOMAIN}/projects/norda",
        "og_type": "website",
    },
    "projects/london-museum": {
        "title": "Ardène — Timeless Boutique Residences Across France | Corabin",
        "description": "Corabin designed the digital presence for Ardène, a French boutique residential real estate brand. An 8-week engagement focused on timeless visual craft.",
        "canonical": f"{DOMAIN}/projects/ardene",
        "og_url": f"{DOMAIN}/projects/ardene",
        "og_type": "website",
    },
    "projects/bullseye": {
        "title": "Havyn — Curated Modern Real Estate with Local Depth | Corabin",
        "description": "Corabin's project for Havyn: curated modern real estate branding and digital platform designed to connect local depth with premium property presentation. 6 weeks.",
        "canonical": f"{DOMAIN}/projects/havyn",
        "og_url": f"{DOMAIN}/projects/havyn",
        "og_type": "website",
    },
    "projects/interference": {
        "title": "Almare — Quiet Spatial Design & Roman Interior Architecture | Corabin",
        "description": "Corabin's 4-week engagement with Almare: a digital identity for a quiet, Roman-influenced spatial design and interior architecture studio.",
        "canonical": f"{DOMAIN}/projects/almare",
        "og_url": f"{DOMAIN}/projects/almare",
        "og_type": "website",
    },
}

# ──────────────────────────────────────────────────────────────────────────────
# JSON-LD structured data per page key
# ──────────────────────────────────────────────────────────────────────────────
import json

ORGANIZATION_LD = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Corabin",
    "url": DOMAIN,
    "logo": f"{DOMAIN}/assets/images/Corabin_logo.png",
    "email": "hello@corabin.com",
    "telephone": "+918101685159",
    "address": {
        "@type": "PostalAddress",
        "addressLocality": "Kolkata",
        "addressCountry": "IN",
        "postalCode": "700001"
    },
    "sameAs": [DOMAIN],
    "description": "Corabin is a boutique digital design and modern web architecture studio based in Kolkata, India."
}

WEBSITE_LD = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Corabin",
    "url": DOMAIN,
    "potentialAction": {
        "@type": "SearchAction",
        "target": f"{DOMAIN}/blog?q={{search_term_string}}",
        "query-input": "required name=search_term_string"
    }
}

PROFESSIONAL_SERVICE_LD = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Corabin",
    "url": DOMAIN,
    "logo": f"{DOMAIN}/assets/images/Corabin_logo.png",
    "image": OG_IMAGE,
    "description": "Corabin is a boutique digital design and modern web architecture studio. We build stronger brands, modern products, and high-performance websites.",
    "email": "hello@corabin.com",
    "telephone": "+918101685159",
    "address": {
        "@type": "PostalAddress",
        "addressLocality": "Kolkata",
        "addressCountry": "IN",
        "postalCode": "700001"
    },
    "areaServed": "Worldwide",
    "serviceType": ["Web Design", "Web Development", "Brand Identity", "Digital Strategy"],
    "founder": {
        "@type": "Person",
        "name": "Souvik",
        "jobTitle": "Founder & Lead Architect"
    }
}

WEBPAGE_LD_BASE = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "isPartOf": {"@type": "WebSite", "name": "Corabin", "url": DOMAIN},
    "publisher": {"@type": "Organization", "name": "Corabin", "url": DOMAIN}
}

BREADCRUMB_BLOG = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "Home", "item": DOMAIN},
        {"@type": "ListItem", "position": 2, "name": "Blog", "item": f"{DOMAIN}/blog"}
    ]
}

BREADCRUMB_PROJECTS = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "Home", "item": DOMAIN},
        {"@type": "ListItem", "position": 2, "name": "Projects", "item": f"{DOMAIN}/projects"}
    ]
}

def get_jsonld_for_page(page_key, page_data):
    """Return JSON-LD script tag(s) appropriate for the page."""
    canonical = page_data["canonical"]
    title = page_data["title"]
    description = page_data["description"]
    og_type = page_data["og_type"]

    schemas = []

    if page_key == "":
        # Home: Organization + WebSite + ProfessionalService
        schemas = [ORGANIZATION_LD, WEBSITE_LD, PROFESSIONAL_SERVICE_LD]
    elif page_key == "about":
        schemas = [
            ORGANIZATION_LD,
            {**WEBPAGE_LD_BASE, "name": title, "url": canonical, "description": description}
        ]
    elif page_key == "contact":
        schemas = [
            PROFESSIONAL_SERVICE_LD,
            {**WEBPAGE_LD_BASE, "name": title, "url": canonical, "description": description}
        ]
    elif page_key == "blog":
        schemas = [
            {**WEBPAGE_LD_BASE, "name": title, "url": canonical, "description": description},
            BREADCRUMB_BLOG
        ]
    elif page_key == "projects":
        schemas = [
            {**WEBPAGE_LD_BASE, "name": title, "url": canonical, "description": description},
            BREADCRUMB_PROJECTS
        ]
    elif page_key.startswith("blog/"):
        slug = page_key.replace("blog/", "")
        article = {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": title.split(" — Corabin")[0].strip(),
            "description": description,
            "url": canonical,
            "author": {"@type": "Person", "name": "Souvik", "url": DOMAIN},
            "publisher": {
                "@type": "Organization",
                "name": "Corabin",
                "logo": {"@type": "ImageObject", "url": f"{DOMAIN}/assets/images/Corabin_logo.png"}
            },
            "image": OG_IMAGE,
            "mainEntityOfPage": {"@type": "WebPage", "@id": canonical}
        }
        breadcrumb = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "Home", "item": DOMAIN},
                {"@type": "ListItem", "position": 2, "name": "Blog", "item": f"{DOMAIN}/blog"},
                {"@type": "ListItem", "position": 3, "name": title.split(" — Corabin")[0].strip(), "item": canonical}
            ]
        }
        schemas = [article, breadcrumb]
    elif page_key.startswith("projects/"):
        project_name = title.split(" — ")[0].strip()
        breadcrumb = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "Home", "item": DOMAIN},
                {"@type": "ListItem", "position": 2, "name": "Projects", "item": f"{DOMAIN}/projects"},
                {"@type": "ListItem", "position": 3, "name": project_name, "item": canonical}
            ]
        }
        schemas = [
            {**WEBPAGE_LD_BASE, "name": title, "url": canonical, "description": description},
            breadcrumb
        ]

    blocks = []
    for schema in schemas:
        blocks.append(f'<script type="application/ld+json">\n{json.dumps(schema, indent=2, ensure_ascii=False)}\n</script>')
    return "\n    ".join(blocks)


def escape_html_attr(s):
    return s.replace('&', '&amp;').replace('"', '&quot;')


def build_seo_block(page_key, page_data):
    """Build the complete SEO block to inject into <head>."""
    title = page_data["title"]
    desc = page_data["description"]
    canonical = page_data["canonical"]
    og_url = page_data["og_url"]
    og_type = page_data["og_type"]
    site_name = "Corabin"

    title_esc = escape_html_attr(title)
    desc_esc = escape_html_attr(desc)
    jsonld = get_jsonld_for_page(page_key, page_data)

    return f"""    <!-- SEO: Corabin Production Meta -->
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
    <link rel="canonical" href="{canonical}">
    <!-- Open Graph -->
    <meta property="og:site_name" content="{site_name}">
    <meta property="og:type" content="{og_type}">
    <meta property="og:url" content="{og_url}">
    <meta property="og:title" content="{title_esc}">
    <meta property="og:description" content="{desc_esc}">
    <meta property="og:image" content="{OG_IMAGE}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="Corabin — Digital Design &amp; Modern Web Architecture Studio">
    <meta property="og:locale" content="en_US">
    <!-- Twitter / X -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@corabin">
    <meta name="twitter:title" content="{title_esc}">
    <meta name="twitter:description" content="{desc_esc}">
    <meta name="twitter:image" content="{OG_IMAGE}">
    <meta name="twitter:image:alt" content="Corabin — Digital Design &amp; Modern Web Architecture Studio">
    <!-- Structured Data -->
    {jsonld}"""


# ──────────────────────────────────────────────────────────────────────────────
# Regex patterns to find existing SEO blocks in HTML (for replacement)
# ──────────────────────────────────────────────────────────────────────────────

def patch_html(html, page_key, page_data):
    """
    Patch an HTML file:
    1. Fix <title> with unique value
    2. Fix <meta name="description">
    3. Fix <meta name="viewport"> — add initial-scale=1
    4. Remove framer-search-index metas
    5. Remove old canonical, og:url, robots meta
    6. Remove old og: and twitter: meta tags in the static early block (lines 23-30)
    7. Inject new SEO block at the right position (before </head>)
    8. Remove old early OG/Twitter block that was at lines 23-30
    """
    title = page_data["title"]
    desc = page_data["description"]

    # 1. Fix <title>
    html = re.sub(
        r'<title>[^<]*</title>',
        f'<title>{title}</title>',
        html
    )

    # 2. Fix meta description
    html = re.sub(
        r'<meta\s+name=["\']description["\']\s+content="[^"]*">',
        f'<meta name="description" content="{escape_html_attr(desc)}">',
        html
    )

    # 3. Fix viewport - add initial-scale=1 if not present
    html = re.sub(
        r'<meta\s+name=["\']viewport["\']\s+content=["\']width=device-width["\']>',
        '<meta name="viewport" content="width=device-width, initial-scale=1">',
        html
    )

    # 4. Remove framer-search-index meta tags
    html = re.sub(r'\s*<meta\s+name=["\']framer-search-index[^"\']*["\']\s+content="[^"]*">\s*', '\n    ', html)
    html = re.sub(r'\s*<meta\s+name=["\']framer-search-index-fallback[^"\']*["\']\s+content="[^"]*">\s*', '\n    ', html)

    # 5. Remove old canonical (in the late head block ~line 950)
    html = re.sub(r'\s*<link\s+rel=["\']canonical["\']\s+href="[^"]*">', '', html)

    # 6. Remove old og:url (in the late head block)
    html = re.sub(r'\s*<meta\s+property=["\']og:url["\']\s+content="[^"]*">', '', html)

    # 7. Remove old robots meta (only the old simple one, not our new comprehensive one)
    html = re.sub(r'\s*<meta\s+name=["\']robots["\']\s+content=["\']max-image-preview:large["\']\s*>', '', html)

    # 8. Remove the early static OG/Twitter block (Open Graph / Facebook comment + tags)
    # This block spans from "<!-- Open Graph / Facebook -->" to the last twitter: meta
    html = re.sub(
        r'\s*<!-- Open Graph / Facebook -->\s*'
        r'<meta\s+property=["\']og:type["\']\s+content="[^"]*">\s*'
        r'<meta\s+property=["\']og:title["\']\s+content="[^"]*">\s*'
        r'<meta\s+property=["\']og:description["\']\s+content="[^"]*">\s*'
        r'<!-- Twitter -->\s*'
        r'<meta\s+name=["\']twitter:card["\']\s+content="[^"]*">\s*'
        r'<meta\s+name=["\']twitter:title["\']\s+content="[^"]*">\s*'
        r'<meta\s+name=["\']twitter:description["\']\s+content="[^"]*">',
        '',
        html
    )

    # 9. Inject new comprehensive SEO block right before </style>\n</head> 
    #    (i.e., just before the closing </head> tag)
    seo_block = build_seo_block(page_key, page_data)
    html = html.replace('</head>', f'\n    {seo_block}\n</head>', 1)

    return html


# ──────────────────────────────────────────────────────────────────────────────
# Main: patch all HTML files
# ──────────────────────────────────────────────────────────────────────────────
patched_count = 0
skipped = []

for page_key, page_data in PAGES.items():
    # Build file path
    if page_key == "":
        html_path = os.path.join(BASE, "index.html")
    else:
        html_path = os.path.join(BASE, page_key, "index.html")

    if not os.path.exists(html_path):
        print(f"  SKIP (not found): {html_path}")
        skipped.append(page_key or "/")
        continue

    with open(html_path, 'r', encoding='utf-8') as f:
        html = f.read()

    patched = patch_html(html, page_key, page_data)

    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(patched)

    print(f"  ✅ Patched: {'/' + page_key if page_key else '/'}")
    patched_count += 1

print(f"\n✅ SEO patch complete: {patched_count} pages patched, {len(skipped)} skipped.")
if skipped:
    print(f"   Skipped: {skipped}")
