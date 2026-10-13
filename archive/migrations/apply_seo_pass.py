#!/usr/bin/env python3
"""
SEO & Production Optimization Script for Corabin Studio Website
Applies: unique per-page titles, descriptions, canonicals, OG tags,
         Twitter cards, structured data, security meta, framer-search-index removal,
         og:image, og:site_name, viewport fix, optimized favicon links,
         exact publication and modified dates, and article/project-specific images.

Run from project root:  python3 tools/apply_seo_pass.py
"""

import re, os, json

BASE = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
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
    "privacy": {
        "title": "Privacy Policy — Corabin Studio",
        "description": "Review Corabin's privacy policy and data governance practices. We protect your client data with absolute confidentiality and security.",
        "canonical": f"{DOMAIN}/privacy",
        "og_url": f"{DOMAIN}/privacy",
        "og_type": "website",
    },
    "terms": {
        "title": "Terms of Service — Corabin Studio",
        "description": "Review Corabin's terms of service and client engagement standards. Bespoke web design and digital architecture services.",
        "canonical": f"{DOMAIN}/terms",
        "og_url": f"{DOMAIN}/terms",
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
}

# Verified CMS metadata for blog posts
BLOG_META = {
    "custom-vs-off-the-shelf-choose-wisely": {
        "datePublished": "2025-01-16T00:00:00Z",
        "dateModified": "2026-10-01T00:00:00Z",
        "image": f"{DOMAIN}/assets/images/blogs/blog1.png"
    },
    "design-that-converts-our-approach": {
        "datePublished": "2025-01-09T00:00:00Z",
        "dateModified": "2026-10-01T00:00:00Z",
        "image": f"{DOMAIN}/assets/images/blogs/blog2.png"
    },
    "7-critical-steps-to-successfully-launch-your-digital-product": {
        "datePublished": "2025-01-03T00:00:00Z",
        "dateModified": "2026-10-01T00:00:00Z",
        "image": f"{DOMAIN}/assets/images/blogs/blog3.png"
    },
    "choosing-the-right-tech-stack-a-decision-framework-for-2025": {
        "datePublished": "2024-12-23T00:00:00Z",
        "dateModified": "2026-10-01T00:00:00Z",
        "image": f"{DOMAIN}/assets/images/blogs/blog4.png"
    },
    "speed-up-your-website-today": {
        "datePublished": "2024-12-19T00:00:00Z",
        "dateModified": "2026-10-01T00:00:00Z",
        "image": f"{DOMAIN}/assets/images/blogs/blog5.png"
    },
    "why-design-systems-actually-matter": {
        "datePublished": "2024-12-04T00:00:00Z",
        "dateModified": "2026-10-01T00:00:00Z",
        "image": f"{DOMAIN}/assets/images/blogs/blog6.png"
    },
    "headless-cms-the-future-is-here": {
        "datePublished": "2024-12-01T00:00:00Z",
        "dateModified": "2026-10-01T00:00:00Z",
        "image": f"{DOMAIN}/assets/images/blogs/blog7.png"
    },
    "stop-making-these-common-api-mistakes": {
        "datePublished": "2024-11-29T00:00:00Z",
        "dateModified": "2026-10-01T00:00:00Z",
        "image": f"{DOMAIN}/assets/images/blogs/blog8.png"
    },
    "website-security-made-simple": {
        "datePublished": "2024-11-18T00:00:00Z",
        "dateModified": "2026-10-01T00:00:00Z",
        "image": f"{DOMAIN}/assets/images/blogs/blog9.png"
    },
    "technical-debt-friend-or-foe": {
        "datePublished": "2024-11-13T00:00:00Z",
        "dateModified": "2026-10-01T00:00:00Z",
        "image": f"{DOMAIN}/assets/images/blogs/blog10.png"
    }
}

PROJECT_META = {
    "kora": {"image": f"{DOMAIN}/assets/images/projects/kora/img1.png"},
    "himon": {"image": f"{DOMAIN}/assets/images/projects/himon/img1.png"},
    "norda": {"image": f"{DOMAIN}/assets/images/projects/norda/img1.png"},
    "ardene": {"image": f"{DOMAIN}/assets/images/projects/ardene/img1.png"},
    "havyn": {"image": f"{DOMAIN}/assets/images/projects/havyn/img1.png"},
    "almare": {"image": f"{DOMAIN}/assets/images/projects/almare/img1.png"}
}

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
    "sameAs": [
        "https://www.linkedin.com/company/corabin",
        "https://www.instagram.com/corabin.studio",
        "https://dribbble.com/corabin",
        "https://www.behance.net/corabin"
    ],
    "description": "Corabin is a boutique digital design and modern web architecture studio based in Kolkata, India."
}

WEBSITE_LD = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Corabin",
    "url": DOMAIN
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

    schemas = []

    if page_key == "":
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
        bmeta = BLOG_META.get(slug, {})
        article = {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": title.split(" — Corabin")[0].strip(),
            "description": description,
            "url": canonical,
            "datePublished": bmeta.get("datePublished", "2025-01-01T00:00:00Z"),
            "dateModified": bmeta.get("dateModified", "2026-10-01T00:00:00Z"),
            "author": {"@type": "Person", "name": "Souvik", "url": DOMAIN},
            "publisher": {
                "@type": "Organization",
                "name": "Corabin",
                "logo": {"@type": "ImageObject", "url": f"{DOMAIN}/assets/images/Corabin_logo.png"}
            },
            "image": bmeta.get("image", OG_IMAGE),
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
        slug = page_key.replace("projects/", "")
        pmeta = PROJECT_META.get(slug, {})
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
        case_study = {
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            "name": project_name,
            "headline": title.split(" | Corabin")[0].strip(),
            "description": description,
            "url": canonical,
            "image": pmeta.get("image", OG_IMAGE),
            "creator": {"@type": "Organization", "name": "Corabin", "url": DOMAIN}
        }
        schemas = [
            {**WEBPAGE_LD_BASE, "name": title, "url": canonical, "description": description},
            case_study,
            breadcrumb
        ]
    else:
        schemas = [
            {**WEBPAGE_LD_BASE, "name": title, "url": canonical, "description": description}
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

    # Select specific image
    if page_key.startswith("blog/"):
        slug = page_key.replace("blog/", "")
        page_image = BLOG_META.get(slug, {}).get("image", OG_IMAGE)
    elif page_key.startswith("projects/"):
        slug = page_key.replace("projects/", "")
        page_image = PROJECT_META.get(slug, {}).get("image", OG_IMAGE)
    else:
        page_image = OG_IMAGE

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
    <meta property="og:image" content="{page_image}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="{title_esc}">
    <meta property="og:locale" content="en_US">
    <!-- Twitter / X -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@corabin">
    <meta name="twitter:title" content="{title_esc}">
    <meta name="twitter:description" content="{desc_esc}">
    <meta name="twitter:image" content="{page_image}">
    <meta name="twitter:image:alt" content="{title_esc}">
    <!-- Structured Data -->
    {jsonld}"""


def patch_html(html, page_key, page_data):
    """
    Patch an HTML file with updated title, description, viewport, favicons, and comprehensive SEO block.
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

    # 4. Update favicons to lightweight assets
    html = re.sub(
        r'<link\s+href="[^"]*Corabin_logo\.png"\s+rel="icon"[^>]*>',
        '<link href="/assets/images/favicon-32.png" rel="icon" type="image/png" sizes="32x32">\n    <link href="/favicon.ico" rel="icon" sizes="any">',
        html
    )
    html = re.sub(
        r'<link\s+href="[^"]*Corabin_logo\.png"\s+rel="apple-touch-icon"[^>]*>',
        '<link href="/assets/images/favicon-180.png" rel="apple-touch-icon">',
        html
    )

    # 5. Remove framer-search-index meta tags
    html = re.sub(r'\s*<meta\s+name=["\']framer-search-index[^"\']*["\']\s+content="[^"]*">\s*', '\n    ', html)
    html = re.sub(r'\s*<meta\s+name=["\']framer-search-index-fallback[^"\']*["\']\s+content="[^"]*">\s*', '\n    ', html)

    # 6. Remove old canonical
    html = re.sub(r'\s*<link\s+rel=["\']canonical["\']\s+href="[^"]*">', '', html)

    # 7. Remove old og:url
    html = re.sub(r'\s*<meta\s+property=["\']og:url["\']\s+content="[^"]*">', '', html)

    # 8. Remove old robots meta
    html = re.sub(r'\s*<meta\s+name=["\']robots["\']\s+content=["\']max-image-preview:large["\']\s*>', '', html)

    # 9. Clean out existing SEO block if already injected
    html = re.sub(
        r'\s*<!-- SEO: Corabin Production Meta -->.*?(?=</head>)',
        '',
        html,
        flags=re.DOTALL
    )

    # 10. Inject updated SEO block before </head>
    seo_block = build_seo_block(page_key, page_data)
    html = html.replace('</head>', f'\n    {seo_block}\n</head>', 1)

    return html


def update_sitemap():
    """Ensure sitemap has correct 2026 lastmod, correct blog dates, and includes privacy and terms."""
    sitemap_path = os.path.join(BASE, "sitemap.xml")
    if not os.path.exists(sitemap_path):
        return

    content = f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  <!-- Home -->
  <url>
    <loc>{DOMAIN}/</loc>
    <lastmod>2026-10-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- Core pages -->
  <url>
    <loc>{DOMAIN}/about</loc>
    <lastmod>2026-10-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>

  <url>
    <loc>{DOMAIN}/contact</loc>
    <lastmod>2026-10-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>

  <!-- Legal pages -->
  <url>
    <loc>{DOMAIN}/privacy</loc>
    <lastmod>2026-10-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>

  <url>
    <loc>{DOMAIN}/terms</loc>
    <lastmod>2026-10-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>

  <!-- Portfolio -->
  <url>
    <loc>{DOMAIN}/projects</loc>
    <lastmod>2026-10-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    <loc>{DOMAIN}/projects/kora</loc>
    <lastmod>2026-10-01</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.7</priority>
  </url>

  <url>
    <loc>{DOMAIN}/projects/himon</loc>
    <lastmod>2026-10-01</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.7</priority>
  </url>

  <url>
    <loc>{DOMAIN}/projects/norda</loc>
    <lastmod>2026-10-01</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.7</priority>
  </url>

  <url>
    <loc>{DOMAIN}/projects/ardene</loc>
    <lastmod>2026-10-01</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.7</priority>
  </url>

  <url>
    <loc>{DOMAIN}/projects/havyn</loc>
    <lastmod>2026-10-01</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.7</priority>
  </url>

  <url>
    <loc>{DOMAIN}/projects/almare</loc>
    <lastmod>2026-10-01</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.7</priority>
  </url>

  <!-- Blog listing -->
  <url>
    <loc>{DOMAIN}/blog</loc>
    <lastmod>2026-10-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
"""

    for slug, bmeta in BLOG_META.items():
        date_str = bmeta["datePublished"][:10]
        content += f"""
  <url>
    <loc>{DOMAIN}/blog/{slug}</loc>
    <lastmod>{date_str}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.7</priority>
  </url>
"""

    content += "</urlset>\n"
    with open(sitemap_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("  ✅ Updated sitemap.xml with canonical routes and verified dates.")


if __name__ == "__main__":
    print("--- Applying Comprehensive SEO & Metadata Pass ---")
    patched_count = 0
    skipped = []

    for page_key, page_data in PAGES.items():
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

    update_sitemap()
    print(f"\n✅ SEO patch complete: {patched_count} pages patched, {len(skipped)} skipped.")
