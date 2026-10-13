import os
import re

BASE_DIR = "/home/souvik/Projects/opus_template.framer.website"
INDEX_HTML = os.path.join(BASE_DIR, "opus-template.framer.website/index.html")

print("Starting Corabin Branding Transformation...")

# -------------------------------------------------------------
# STEP 1: Process index.html
# -------------------------------------------------------------
with open(INDEX_HTML, "r", encoding="utf-8") as f:
    html = f.read()

# 1.1 Metadata and Header Cleanup
html = html.replace("<!-- Made in Framer · framer.com ✨ -->", "<!-- Built for Corabin · Modern Digital Studio -->")
html = html.replace('<meta name="generator" content="Framer 0f5ea8b">', '<meta name="generator" content="Corabin Studio">')
html = html.replace(
    "<title>Opus - A Framer template for Digital Agencies</title>",
    "<title>Corabin - Digital Design & Modern Web Studio</title>"
)
html = html.replace(
    'content="OPUS is a modern Framer template for digital agencies, designed to elevate your online presence and showcase your creative expertise. "',
    'content="At Corabin, we help companies build stronger brands, modern products, and websites that actually perform."'
)
html = html.replace(
    'content="Opus - A Framer template for Digital Agencies"',
    'content="Corabin - Digital Design & Modern Web Studio"'
)

# 1.2 Remove Framer Events Tracking Script
html = re.sub(r'<script async src="https://events\.framer\.com/script\?v=2"[^>]*></script>', '', html)

# 1.3 Remove Framer Editor Bar Script
html = re.sub(r'<script>\s*try\s*\{\s*if\s*\(localStorage\.get\("__framer_force_showing_editorbar_since"\)\)[\s\S]*?\}\s*catch\s*\(e\)\s*\{\}\s*</script>', '', html)

# 1.4 Remove __framer-badge-container
html = re.sub(r'<div id="__framer-badge-container">[\s\S]*?</div>\s*<!--/\$-->\s*</div>', '', html)

# 1.5 Update Hero SVG fit-text viewBox and title: OPUS -> CORABIN
# Desktop: viewBox="0 0 608.4 192" -> viewBox="0 0 1064.7 192"
html = html.replace('viewBox="0 0 608.4 192"', 'viewBox="0 0 1064.7 192"')
# Tablet: viewBox="0 0 182.32 58" -> viewBox="0 0 319.06 58"
html = html.replace('viewBox="0 0 182.32 58"', 'viewBox="0 0 319.06 58"')
# Mobile: viewBox="0 0 152.6 48" -> viewBox="0 0 267.05 48"
html = html.replace('viewBox="0 0 152.6 48"', 'viewBox="0 0 267.05 48"')

# 1.6 Exact Text Replacements in index.html
text_replacements_html = [
    # Hero & Value Prop
    (
        "At Opus, we help companies build stronger brands, better products, and websites that actually perform.",
        "At Corabin, we help companies build stronger brands, modern products, and websites that actually perform."
    ),
    # Metrics
    ("47+ Projects delivered", "25+ Projects delivered"),
    ("95% Client retention", "99% On-time delivery"),
    ("$21M Client revenue impacted", "$17M Client revenue impacted"),
    # Services
    ("04 Motion Graphics", "04 App Development"),
    (
        "We bring ideas to life through dynamic, engaging animations that communicate complex concepts with clarity, creativity, and visual storytelling.",
        "We build intuitive, scalable digital applications that combine smooth user experiences with robust performance across every modern device."
    ),
    # Mid CTA
    (
        "Our team brings together design, development, and strategic thinking to help you grow.",
        "Corabin brings together bespoke design, modern development, and strategic thinking to help you grow."
    ),
    # Studio Strengths & About
    (
        "We are a group of positive thinkers, dedicated to making a difference in the digital world.",
        "We are a boutique digital studio dedicated to making a difference through intentional design."
    ),
    ("Meet the team", "Our story"),
    # Counters
    ("talented <br class=\"framer-text\">individuals", "Direct <br class=\"framer-text\">collaboration"),
    ("talented<br class=\"framer-text\">individuals", "Direct<br class=\"framer-text\">collaboration"),
    ("talented individuals", "Direct collaboration"),
    ("projects<br class=\"framer-text\">later", "Projects<br class=\"framer-text\">delivered"),
    ("projects later", "Projects delivered"),
    ("combined <br class=\"framer-text\">experience", "Years <br class=\"framer-text\">experience"),
    ("combined experience", "Years experience"),
    # Testimonials
    (
        "Finally found a team that understands both design and business. Our brand now perfectly captures what makes us different.",
        "Finally found a partner that understands both design and business. Our brand now perfectly captures what makes us different."
    ),
    (
        "The level of strategic thinking they brought was unexpected. They didn't just build what we asked for - they made it better.",
        "The level of strategic thinking brought to the project was exceptional. Corabin didn't just build what we asked for — they made it better."
    ),
    (
        "Every feature they built was focused on driving results. They transformed how we think about digital.",
        "Every feature built was focused on driving results. They completely transformed how we think about our digital presence."
    ),
    # FAQs
    (
        "We specialize in digital solutions including website development, web applications, e-commerce platforms, and enterprise software integrations. Our expertise spans diverse industries, delivering strategic technological solutions tailored to unique business meallanges.",
        "We specialize in digital solutions including custom website development, interactive web applications, e-commerce platforms, and brand identities. We craft modern, high-performance websites tailored to your specific business goals."
    ),
    (
        "Project timelines range from 4-6 weeks for small websites to 16-24 weeks for complex enterprise integrations. Each project is carefully scoped to balance efficiency with comprehensive development requirements.",
        "Most custom landing pages and brand websites take 2 to 4 weeks, while larger interactive multi-page platforms take 4 to 8 weeks. Each project is carefully scoped to balance speed with high craft standards."
    ),
    (
        "Vectura supports imports of vendor data, team budgets, historical expenses, and departmental codes. You can also connect directly to your ERP or finance tools to sync this data automatically. Our team is available to assist with imports during onboarding.",
        "We follow a phased workflow: strategic discovery, interactive Figma UI/UX prototyping, high-performance responsive build with smooth animations, and rigorous multi-device testing before launch."
    ),
    (
        "We conduct comprehensive system audits to ensure seamless integration with your current technology stack and organizational workflow. Our team provides flexible collaboration models, knowledge transfer, and transparent communication to minimize disruption.",
        "We ensure seamless integration with your current tech stack, tools, and branding guidelines. You get direct, transparent collaboration and clear communication throughout the build to ensure a smooth handoff."
    ),
    # Footer & Brand
    ("contact@opushq.com", "hello@corabin.com"),
    ("@2026 Opus, All Rights Reserved", "@2026 Corabin, All Rights Reserved"),
    ("@2025 Opus, All Rights Reserved", "@2026 Corabin, All Rights Reserved"),
    ("https://opus-template.framer.website", "https://corabin.com"),
]

for old, new in text_replacements_html:
    if old in html:
        html = html.replace(old, new)
        print(f"Replaced in index.html: {old[:30]}... -> {new[:30]}...")

# Brand name in H1 and H2 tags
html = re.sub(r'(<h1[^>]*class="framer-text"[^>]*>)OPUS(</h1>)', r'\1CORABIN\2', html)
html = re.sub(r'(<h2[^>]*data-styles-preset="SXxpl9onw"[^>]*>)OPUS\s*(</h2>)', r'\1CORABIN \2', html)
html = html.replace('data-framer-name="OPUS"', 'data-framer-name="CORABIN"')

# 1.7 Remove Pricing Section from HTML
pricing_pattern = re.compile(r'<div class="framer-g3lz1y" data-framer-name="Pricing" id="pricing">[\s\S]*?</div>\s*</div>\s*</div>\s*(?=<div class="framer-mlqjwb" data-framer-name="Testimonials")', re.MULTILINE)
if pricing_pattern.search(html):
    html = pricing_pattern.sub('', html)
    print("Cleanly removed Pricing Section from index.html")
else:
    print("Warning: Pricing section regex didn't match cleanly, will ensure CSS hiding and JSX excision")

# 1.8 Inject Brand Overrides Style Tag
css_overrides = """
<style id="corabin-custom-overrides">
    /* Remove unused sections & framer badge */
    [data-framer-name="Pricing"],
    #pricing,
    [data-framer-name="After work"],
    #__framer-badge-container,
    .__framer-badge {
        display: none !important;
    }
    
    /* Ensure clean single founder layout if needed */
    .corabin-founder-card {
        grid-column: 1 / -1 !important;
        max-width: 480px !important;
        margin: 0 auto !important;
    }
</style>
"""
if "</head>" in html:
    html = html.replace("</head>", css_overrides + "</head>")
    print("Injected CSS overrides in index.html")

# 1.9 Local Script and Asset Mapping
# Remap CDN scripts to local files so remote Framer CDN cannot overwrite local code
html = html.replace(
    'src="https://framerusercontent.com/sites/46CYIm3dbxFoU3f63shpCX/script_main.CNn1uaXy.mjs"',
    'src="/framerusercontent.com/sites/46CYIm3dbxFoU3f63shpCX/script_main.CNn1uaXy.mjs"'
)
html = re.sub(
    r'href="https://framerusercontent\.com/sites/46CYIm3dbxFoU3f63shpCX/([^"]+\.mjs)"',
    r'href="/framerusercontent.com/sites/46CYIm3dbxFoU3f63shpCX/\1"',
    html
)

with open(INDEX_HTML, "w", encoding="utf-8") as f:
    f.write(html)
print("Updated index.html successfully.")

# Also create root index.html so project can be served directly from repo root
ROOT_INDEX = os.path.join(BASE_DIR, "index.html")
with open(ROOT_INDEX, "w", encoding="utf-8") as f:
    f.write(html)
print("Created root index.html.")
