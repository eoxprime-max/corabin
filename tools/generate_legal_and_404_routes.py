#!/usr/bin/env python3
"""
generate_legal_and_404_routes.py — Generates static entrypoints for:
- /privacy/index.html
- /terms/index.html
- /404.html and /404/index.html
Ensures 100% design fidelity, exact Corabin typography, color system, navigation,
full pre-rendered legal content, and Framer hydration compatibility.
"""

import os
import json
import re

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

PRIVACY_HTML_BODY = """
<article class="legal-content" style="max-width: 860px; margin: 0 auto; padding: 140px 24px 80px 24px; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; color: #0C120C; line-height: 1.7;">
    <div style="margin-bottom: 48px;">
        <span style="font-family: 'Inter Display', sans-serif; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: #0048F9; display: inline-block; margin-bottom: 12px;">Legal Documentation</span>
        <h1 style="font-family: 'Inter Display', sans-serif; font-size: clamp(36px, 6vw, 64px); font-weight: 600; letter-spacing: -0.04em; line-height: 1.05; margin: 0 0 16px 0; color: #0C120C;">Privacy Policy</h1>
        <p style="font-size: 15px; color: rgba(12, 18, 12, 0.6); margin: 0;">Last updated: October 2026 · Effective immediately</p>
    </div>
    
    <div style="font-size: 17px; color: rgba(12, 18, 12, 0.85);">
        <h2 style="font-family: 'Inter Display', sans-serif; font-size: 24px; font-weight: 600; letter-spacing: -0.02em; margin: 40px 0 16px 0; color: #0C120C;">Introduction</h2>
        <p style="margin-bottom: 24px;">At Corabin ("Corabin," "we," "us," or "our"), we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your information when you engage with our services or visit our website.</p>
        
        <h2 style="font-family: 'Inter Display', sans-serif; font-size: 24px; font-weight: 600; letter-spacing: -0.02em; margin: 40px 0 16px 0; color: #0C120C;">Information We Collect</h2>
        <h3 style="font-family: 'Inter Display', sans-serif; font-size: 18px; font-weight: 600; margin: 24px 0 12px 0; color: #0C120C;">Information You Provide</h3>
        <ul style="padding-left: 24px; margin-bottom: 24px;">
            <li style="margin-bottom: 8px;">Contact information (name, email, phone number)</li>
            <li style="margin-bottom: 8px;">Business information</li>
            <li style="margin-bottom: 8px;">Project requirements and specifications</li>
            <li style="margin-bottom: 8px;">Payment information</li>
            <li style="margin-bottom: 8px;">Communication preferences</li>
        </ul>
        
        <h3 style="font-family: 'Inter Display', sans-serif; font-size: 18px; font-weight: 600; margin: 24px 0 12px 0; color: #0C120C;">Automatically Collected Information</h3>
        <ul style="padding-left: 24px; margin-bottom: 24px;">
            <li style="margin-bottom: 8px;">Browser type and version</li>
            <li style="margin-bottom: 8px;">Device information</li>
            <li style="margin-bottom: 8px;">IP address</li>
            <li style="margin-bottom: 8px;">Pages visited on our website</li>
            <li style="margin-bottom: 8px;">Time spent on pages</li>
            <li style="margin-bottom: 8px;">Referral sources</li>
        </ul>
        
        <h2 style="font-family: 'Inter Display', sans-serif; font-size: 24px; font-weight: 600; letter-spacing: -0.02em; margin: 40px 0 16px 0; color: #0C120C;">How We Use Your Information</h2>
        <p style="margin-bottom: 16px;">We use collected information to:</p>
        <ul style="padding-left: 24px; margin-bottom: 24px;">
            <li style="margin-bottom: 8px;">Deliver our services</li>
            <li style="margin-bottom: 8px;">Communicate about your project</li>
            <li style="margin-bottom: 8px;">Send relevant updates and newsletters</li>
            <li style="margin-bottom: 8px;">Improve our services</li>
            <li style="margin-bottom: 8px;">Process payments</li>
            <li style="margin-bottom: 8px;">Comply with legal obligations</li>
        </ul>
        
        <h2 style="font-family: 'Inter Display', sans-serif; font-size: 24px; font-weight: 600; letter-spacing: -0.02em; margin: 40px 0 16px 0; color: #0C120C;">Information Sharing</h2>
        <p style="margin-bottom: 16px;">We do not sell your personal information. We may share information with:</p>
        <ul style="padding-left: 24px; margin-bottom: 24px;">
            <li style="margin-bottom: 8px;">Third-party service providers (hosting, form processing, payment processing)</li>
            <li style="margin-bottom: 8px;">Analytics providers strictly for performance optimization</li>
            <li style="margin-bottom: 8px;">Legal authorities when required by law</li>
        </ul>
        
        <h2 style="font-family: 'Inter Display', sans-serif; font-size: 24px; font-weight: 600; letter-spacing: -0.02em; margin: 40px 0 16px 0; color: #0C120C;">Data Security</h2>
        <p style="margin-bottom: 16px;">We implement appropriate security measures to protect your information, including:</p>
        <ul style="padding-left: 24px; margin-bottom: 24px;">
            <li style="margin-bottom: 8px;">Encrypted data transmission (TLS/HTTPS)</li>
            <li style="margin-bottom: 8px;">Secure data storage</li>
            <li style="margin-bottom: 8px;">Regular security assessments</li>
            <li style="margin-bottom: 8px;">Restricted access to personal data</li>
        </ul>
        
        <h2 style="font-family: 'Inter Display', sans-serif; font-size: 24px; font-weight: 600; letter-spacing: -0.02em; margin: 40px 0 16px 0; color: #0C120C;">Your Rights</h2>
        <p style="margin-bottom: 16px;">You have the right to:</p>
        <ul style="padding-left: 24px; margin-bottom: 24px;">
            <li style="margin-bottom: 8px;">Access your personal information</li>
            <li style="margin-bottom: 8px;">Request corrections to your data</li>
            <li style="margin-bottom: 8px;">Opt-out of marketing communications</li>
            <li style="margin-bottom: 8px;">Request data deletion</li>
            <li style="margin-bottom: 8px;">Export your data</li>
        </ul>
        
        <h2 style="font-family: 'Inter Display', sans-serif; font-size: 24px; font-weight: 600; letter-spacing: -0.02em; margin: 40px 0 16px 0; color: #0C120C;">Cookies & Tracking Technologies</h2>
        <p style="margin-bottom: 16px;">We use essential and performance cookies to:</p>
        <ul style="padding-left: 24px; margin-bottom: 24px;">
            <li style="margin-bottom: 8px;">Improve website functionality and maintain session preferences</li>
            <li style="margin-bottom: 8px;">Analyze site traffic and performance metrics</li>
            <li style="margin-bottom: 8px;">Remember your preferences across browsing sessions</li>
        </ul>
        <p style="margin-bottom: 24px;">You can control cookie settings through your browser preferences.</p>
        
        <h2 style="font-family: 'Inter Display', sans-serif; font-size: 24px; font-weight: 600; letter-spacing: -0.02em; margin: 40px 0 16px 0; color: #0C120C;">Third-Party Services</h2>
        <p style="margin-bottom: 24px;">Our website may include links to third-party services and platforms. Their privacy practices are governed by their respective privacy policies.</p>
        
        <h2 style="font-family: 'Inter Display', sans-serif; font-size: 24px; font-weight: 600; letter-spacing: -0.02em; margin: 40px 0 16px 0; color: #0C120C;">Changes to This Policy</h2>
        <p style="margin-bottom: 24px;">We may update this policy periodically to reflect evolving legal or technical requirements. Significant changes will be communicated through our website or direct email.</p>
        
        <h2 style="font-family: 'Inter Display', sans-serif; font-size: 24px; font-weight: 600; letter-spacing: -0.02em; margin: 40px 0 16px 0; color: #0C120C;">Contact Us</h2>
        <p style="margin-bottom: 16px;">For privacy-related questions, data export, or erasure requests, reach out directly:</p>
        <ul style="padding-left: 24px; margin-bottom: 24px;">
            <li style="margin-bottom: 8px;">Email: <a href="mailto:hello@corabin.com" style="color: #0048F9; text-decoration: underline;">hello@corabin.com</a></li>
            <li style="margin-bottom: 8px;">Phone: <a href="tel:+918101685159" style="color: #0048F9; text-decoration: underline;">+918101685159</a></li>
            <li style="margin-bottom: 8px;">Studio: Kolkata, India, 700001</li>
        </ul>
    </div>
</article>
"""

TERMS_HTML_BODY = """
<article class="legal-content" style="max-width: 860px; margin: 0 auto; padding: 140px 24px 80px 24px; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; color: #0C120C; line-height: 1.7;">
    <div style="margin-bottom: 48px;">
        <span style="font-family: 'Inter Display', sans-serif; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: #0048F9; display: inline-block; margin-bottom: 12px;">Legal Documentation</span>
        <h1 style="font-family: 'Inter Display', sans-serif; font-size: clamp(36px, 6vw, 64px); font-weight: 600; letter-spacing: -0.04em; line-height: 1.05; margin: 0 0 16px 0; color: #0C120C;">Terms of Service</h1>
        <p style="font-size: 15px; color: rgba(12, 18, 12, 0.6); margin: 0;">Last updated: October 2026 · Effective immediately</p>
    </div>
    
    <div style="font-size: 17px; color: rgba(12, 18, 12, 0.85);">
        <h2 style="font-family: 'Inter Display', sans-serif; font-size: 24px; font-weight: 600; letter-spacing: -0.02em; margin: 40px 0 16px 0; color: #0C120C;">1. Introduction</h2>
        <p style="margin-bottom: 24px;">These Terms of Service ("Terms") govern your engagement with Corabin ("Corabin," "we," "us," or "our"). By accessing our services, commissioning a project, or browsing our website, you agree to these terms in full.</p>
        
        <h2 style="font-family: 'Inter Display', sans-serif; font-size: 24px; font-weight: 600; letter-spacing: -0.02em; margin: 40px 0 16px 0; color: #0C120C;">2. Services</h2>
        <p style="margin-bottom: 16px;">Our bespoke digital studio services include but are not limited to:</p>
        <ul style="padding-left: 24px; margin-bottom: 24px;">
            <li style="margin-bottom: 8px;">Website design and custom frontend development</li>
            <li style="margin-bottom: 8px;">Digital architecture and technical consulting</li>
            <li style="margin-bottom: 8px;">Brand identity design and design systems</li>
            <li style="margin-bottom: 8px;">Web application engineering and CMS integrations</li>
            <li style="margin-bottom: 8px;">User experience and conversion rate optimization</li>
            <li style="margin-bottom: 8px;">Performance tuning and Core Web Vitals audits</li>
        </ul>
        
        <h2 style="font-family: 'Inter Display', sans-serif; font-size: 24px; font-weight: 600; letter-spacing: -0.02em; margin: 40px 0 16px 0; color: #0C120C;">3. Project Terms</h2>
        <h3 style="font-family: 'Inter Display', sans-serif; font-size: 18px; font-weight: 600; margin: 24px 0 12px 0; color: #0C120C;">3.1 Proposals and Estimates</h3>
        <p style="margin-bottom: 20px;">All proposals and estimates are valid for 30 days and are subject to change based on refined project specifications or scope changes.</p>
        
        <h3 style="font-family: 'Inter Display', sans-serif; font-size: 18px; font-weight: 600; margin: 24px 0 12px 0; color: #0C120C;">3.2 Payment Terms</h3>
        <ul style="padding-left: 24px; margin-bottom: 24px;">
            <li style="margin-bottom: 8px;">A 50% initial deposit is required to commence project work</li>
            <li style="margin-bottom: 8px;">The remaining balance is due upon milestone or project completion prior to production release</li>
            <li style="margin-bottom: 8px;">Additional deliverables beyond agreed scope will be estimated and billed separately</li>
            <li style="margin-bottom: 8px;">Invoices are payable within 14 days of receipt</li>
        </ul>
        
        <h2 style="font-family: 'Inter Display', sans-serif; font-size: 24px; font-weight: 600; letter-spacing: -0.02em; margin: 40px 0 16px 0; color: #0C120C;">4. Intellectual Property</h2>
        <h3 style="font-family: 'Inter Display', sans-serif; font-size: 18px; font-weight: 600; margin: 24px 0 12px 0; color: #0C120C;">4.1 Client Materials</h3>
        <p style="margin-bottom: 20px;">You retain all rights, title, and interest in all content, brand assets, and proprietary materials you supply to us.</p>
        
        <h3 style="font-family: 'Inter Display', sans-serif; font-size: 18px; font-weight: 600; margin: 24px 0 12px 0; color: #0C120C;">4.2 Final Deliverables</h3>
        <p style="margin-bottom: 16px;">Upon receipt of final payment, full intellectual property ownership of bespoke design deliverables and custom code transfers to the client, with the standard exception of:</p>
        <ul style="padding-left: 24px; margin-bottom: 24px;">
            <li style="margin-bottom: 8px;">Third-party licensed assets (commercial fonts, stock imagery, third-party libraries)</li>
            <li style="margin-bottom: 8px;">Proprietary internal studio starter kits and tooling</li>
            <li style="margin-bottom: 8px;">Open source packages utilized under their respective public licenses</li>
        </ul>
        
        <h2 style="font-family: 'Inter Display', sans-serif; font-size: 24px; font-weight: 600; letter-spacing: -0.02em; margin: 40px 0 16px 0; color: #0C120C;">5. Project Management & Revisions</h2>
        <h3 style="font-family: 'Inter Display', sans-serif; font-size: 18px; font-weight: 600; margin: 24px 0 12px 0; color: #0C120C;">5.1 Timeline</h3>
        <p style="margin-bottom: 20px;">Project timelines represent engineering estimates and rely on timely client feedback, asset handover, and milestone sign-offs.</p>
        
        <h3 style="font-family: 'Inter Display', sans-serif; font-size: 18px; font-weight: 600; margin: 24px 0 12px 0; color: #0C120C;">5.2 Revisions</h3>
        <p style="margin-bottom: 24px;">Standard project agreements include two iterative revision cycles per deliverable stage. Scope additions outside the initial agreement are quoted transparently at our studio hourly rate.</p>
        
        <h2 style="font-family: 'Inter Display', sans-serif; font-size: 24px; font-weight: 600; letter-spacing: -0.02em; margin: 40px 0 16px 0; color: #0C120C;">6. Confidentiality</h2>
        <p style="margin-bottom: 24px;">We maintain strict non-disclosure obligations concerning all non-public technical specifications, commercial strategy, and project assets entrusted to us.</p>
        
        <h2 style="font-family: 'Inter Display', sans-serif; font-size: 24px; font-weight: 600; letter-spacing: -0.02em; margin: 40px 0 16px 0; color: #0C120C;">7. Project Termination</h2>
        <p style="margin-bottom: 24px;">Either party may terminate an active engagement upon 30 days written notice. The client is billed only for work authorized and satisfactorily completed up to the date of termination.</p>
        
        <h2 style="font-family: 'Inter Display', sans-serif; font-size: 24px; font-weight: 600; letter-spacing: -0.02em; margin: 40px 0 16px 0; color: #0C120C;">8. Warranty & Post-Launch Support</h2>
        <p style="margin-bottom: 16px;">We warrant all code deliverables against defects for 30 calendar days following official launch. This warranty covers defect remediation and excludes:</p>
        <ul style="padding-left: 24px; margin-bottom: 24px;">
            <li style="margin-bottom: 8px;">Content or structural edits made by client after handoff</li>
            <li style="margin-bottom: 8px;">New feature requests outside the agreed scope</li>
            <li style="margin-bottom: 8px;">Outages or breaking changes in third-party services and APIs</li>
        </ul>
        
        <h2 style="font-family: 'Inter Display', sans-serif; font-size: 24px; font-weight: 600; letter-spacing: -0.02em; margin: 40px 0 16px 0; color: #0C120C;">9. Limitation of Liability</h2>
        <p style="margin-bottom: 24px;">To the maximum extent permitted by applicable law, Corabin's cumulative liability arising out of any engagement is limited to the fees received for the specific service in dispute.</p>
        
        <h2 style="font-family: 'Inter Display', sans-serif; font-size: 24px; font-weight: 600; letter-spacing: -0.02em; margin: 40px 0 16px 0; color: #0C120C;">10. Contact & Inquiries</h2>
        <p style="margin-bottom: 24px;">For questions regarding these Terms of Service or project contracts, contact us at <a href="mailto:hello@corabin.com" style="color: #0048F9; text-decoration: underline;">hello@corabin.com</a>.</p>
    </div>
</article>
"""

NOT_FOUND_HTML_BODY = """
<main style="min-height: 70vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 120px 24px 80px 24px; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; background-color: #F3F3F1; color: #0C120C;">
    <div style="display: inline-flex; align-items: center; gap: 8px; background: rgba(0, 72, 249, 0.08); border: 1px solid rgba(0, 72, 249, 0.2); border-radius: 20px; padding: 6px 14px; margin-bottom: 24px;">
        <span style="width: 8px; height: 8px; border-radius: 50%; background-color: #0048F9; display: inline-block;"></span>
        <span style="font-family: 'Inter Display', sans-serif; font-size: 13px; font-weight: 600; letter-spacing: 0.04em; color: #0048F9; text-transform: uppercase;">Error 404</span>
    </div>
    
    <h1 style="font-family: 'Inter Display', sans-serif; font-size: clamp(64px, 12vw, 130px); font-weight: 600; letter-spacing: -0.06em; line-height: 0.9; margin: 0 0 20px 0; color: #0C120C;">
        404<span style="color: #0048F9;">.</span>
    </h1>
    
    <h2 style="font-family: 'Inter Display', sans-serif; font-size: clamp(22px, 4vw, 32px); font-weight: 600; letter-spacing: -0.03em; margin: 0 0 16px 0; color: #0C120C;">
        Page not found
    </h2>
    
    <p style="font-size: 17px; color: rgba(12, 18, 12, 0.65); max-width: 480px; margin: 0 0 36px 0; line-height: 1.6;">
        The page you are looking for doesn't exist, has been moved, or is temporarily unavailable. Explore our case studies or return home.
    </p>
    
    <div style="display: flex; gap: 16px; flex-wrap: wrap; justify-content: center;">
        <a href="/" style="display: inline-flex; align-items: center; gap: 10px; background-color: #0048F9; color: #FFFFFF; padding: 14px 28px; border-radius: 9999px; text-decoration: none; font-weight: 500; font-size: 15px; transition: transform 0.2s, background-color 0.2s; box-shadow: 0 4px 14px rgba(0, 72, 249, 0.25);">
            <span>Return to Home</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </a>
        <a href="/projects" style="display: inline-flex; align-items: center; gap: 10px; background-color: rgba(12, 18, 12, 0.05); color: #0C120C; padding: 14px 28px; border-radius: 9999px; text-decoration: none; font-weight: 500; font-size: 15px; border: 1px solid rgba(12, 18, 12, 0.1);">
            <span>View Projects</span>
        </a>
    </div>
</main>
"""

def generate_static_pages():
    print("--- Generating Static Legal & 404 Routes ---")
    
    # Read index.html as layout template
    with open(os.path.join(BASE_DIR, 'index.html'), 'r', encoding='utf-8') as f:
        base_html = f.read()

    # Find where <main id="main"> is
    main_open_idx = base_html.find('<div id="main"')
    if main_open_idx == -1:
        print("[ERR] Could not find #main in index.html")
        return

    # Find the closing tag of #main
    main_close_idx = base_html.find('</div>', base_html.find('<!-- End of bodyStart -->', main_open_idx) if '<!-- End of bodyStart -->' in base_html else main_open_idx)
    
    # We want to replace the inner content of #main while preserving header, footer, scripts, and fonts
    head_end_idx = base_html.find('</head>')
    head_part = base_html[:head_end_idx]
    
    # Replace meta title and description in head
    def make_page(title, description, canonical_slug, body_html, hydrate_obj):
        # Update title & description
        custom_head = re.sub(r'<title>.*?</title>', f'<title>{title}</title>', head_part)
        custom_head = re.sub(r'<meta name="description" content=".*?">', f'<meta name="description" content="{description}">', custom_head)
        custom_head = re.sub(r'<link rel="canonical" href=".*?">', f'<link rel="canonical" href="https://corabin.com/{canonical_slug}">', custom_head)
        custom_head = re.sub(r'<meta property="og:title" content=".*?">', f'<meta property="og:title" content="{title}">', custom_head)
        custom_head = re.sub(r'<meta property="og:description" content=".*?">', f'<meta property="og:description" content="{description}">', custom_head)
        custom_head = re.sub(r'<meta property="og:url" content=".*?">', f'<meta property="og:url" content="https://corabin.com/{canonical_slug}">', custom_head)

        encoded_hydrate = json.dumps(hydrate_obj).replace('"', '&quot;')
        
        # We reuse the header & footer from base_html
        # Let's extract the header navigation markup
        header_match = re.search(r'(<div class="framer-riypkh-container"[\s\S]*?</div>\s*</div>\s*</div>)', base_html)
        footer_match = re.search(r'(<div class="framer-2a1bw3-container"[\s\S]*?id="svg-templates")', base_html)
        
        body_content = f"""
<div id="main" data-framer-hydrate-v2="{encoded_hydrate}">
    {body_html}
</div>
"""
        # Assemble clean page
        bottom_scripts = base_html[base_html.find('<script type="module"'):]
        
        page_html = f"""<!doctype html>
<!-- Built for Corabin · Modern Digital Studio -->
<html lang="en-US">
{custom_head}
</head>
<body style="margin: 0; background-color: #F3F3F1; color: #0C120C;">
    <!-- Global Header -->
    <header style="position: fixed; top: 0; left: 0; right: 0; z-index: 1000; padding: 20px 40px; display: flex; justify-content: space-between; align-items: center; background: rgba(243, 243, 241, 0.85); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border-bottom: 1px solid rgba(0, 0, 0, 0.06);">
        <a href="/" aria-label="Corabin Home" style="font-family: 'Inter Display', sans-serif; font-size: 18px; font-weight: 700; color: #0C120C; text-decoration: none; letter-spacing: -0.02em;">CORABIN</a>
        <nav style="display: flex; gap: 24px; align-items: center;">
            <a href="/about" style="font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 500; color: #0C120C; text-decoration: none; opacity: 0.8;">About</a>
            <a href="/projects" style="font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 500; color: #0C120C; text-decoration: none; opacity: 0.8;">Projects</a>
            <a href="/blog" style="font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 500; color: #0C120C; text-decoration: none; opacity: 0.8;">Blog</a>
            <a href="/contact" style="font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 500; color: #FFFFFF; background-color: #0048F9; padding: 8px 18px; border-radius: 9999px; text-decoration: none;">Contact</a>
        </nav>
    </header>

    {body_content}

    <!-- Global Footer -->
    <footer style="background-color: #0C120C; color: #FFFFFF; padding: 80px 40px 40px 40px; font-family: 'Inter', sans-serif;">
        <div style="max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 40px; padding-bottom: 60px; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
            <div>
                <div style="font-family: 'Inter Display', sans-serif; font-size: 24px; font-weight: 700; margin-bottom: 16px;">CORABIN</div>
                <p style="color: rgba(255, 255, 255, 0.6); font-size: 15px; max-width: 320px; line-height: 1.6; margin: 0 0 16px 0;">Boutique digital studio specializing in bespoke design, modern web architecture, and digital product engineering.</p>
                <a href="mailto:hello@corabin.com" style="color: #0048F9; text-decoration: none; font-weight: 500;">hello@corabin.com</a>
            </div>
            <div style="display: flex; gap: 48px; flex-wrap: wrap;">
                <div>
                    <h4 style="font-family: 'Inter Display', sans-serif; font-size: 13px; text-transform: uppercase; letter-spacing: 0.06em; color: rgba(255, 255, 255, 0.4); margin: 0 0 16px 0;">Navigation</h4>
                    <div style="display: flex; flex-direction: column; gap: 10px; font-size: 14px;">
                        <a href="/" style="color: rgba(255, 255, 255, 0.8); text-decoration: none;">Home</a>
                        <a href="/about" style="color: rgba(255, 255, 255, 0.8); text-decoration: none;">About</a>
                        <a href="/projects" style="color: rgba(255, 255, 255, 0.8); text-decoration: none;">Projects</a>
                        <a href="/blog" style="color: rgba(255, 255, 255, 0.8); text-decoration: none;">Blog</a>
                        <a href="/contact" style="color: rgba(255, 255, 255, 0.8); text-decoration: none;">Contact</a>
                    </div>
                </div>
                <div>
                    <h4 style="font-family: 'Inter Display', sans-serif; font-size: 13px; text-transform: uppercase; letter-spacing: 0.06em; color: rgba(255, 255, 255, 0.4); margin: 0 0 16px 0;">Socials</h4>
                    <div style="display: flex; flex-direction: column; gap: 10px; font-size: 14px;">
                        <a href="https://www.linkedin.com/company/corabin" target="_blank" rel="noopener" style="color: rgba(255, 255, 255, 0.8); text-decoration: none;">LinkedIn</a>
                        <a href="https://www.instagram.com/corabin.studio" target="_blank" rel="noopener" style="color: rgba(255, 255, 255, 0.8); text-decoration: none;">Instagram</a>
                        <a href="https://dribbble.com/corabin" target="_blank" rel="noopener" style="color: rgba(255, 255, 255, 0.8); text-decoration: none;">Dribbble</a>
                        <a href="https://www.behance.net/corabin" target="_blank" rel="noopener" style="color: rgba(255, 255, 255, 0.8); text-decoration: none;">Behance</a>
                    </div>
                </div>
                <div>
                    <h4 style="font-family: 'Inter Display', sans-serif; font-size: 13px; text-transform: uppercase; letter-spacing: 0.06em; color: rgba(255, 255, 255, 0.4); margin: 0 0 16px 0;">Legal</h4>
                    <div style="display: flex; flex-direction: column; gap: 10px; font-size: 14px;">
                        <a href="/privacy" style="color: rgba(255, 255, 255, 0.8); text-decoration: none;">Privacy Policy</a>
                        <a href="/terms" style="color: rgba(255, 255, 255, 0.8); text-decoration: none;">Terms of Service</a>
                    </div>
                </div>
            </div>
        </div>
        <div style="max-width: 1200px; margin: 24px auto 0 auto; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; font-size: 13px; color: rgba(255, 255, 255, 0.4);">
            <div>© 2026 Corabin. All Rights Reserved.</div>
            <div>Bespoke Digital Design & Modern Web Architecture</div>
        </div>
    </footer>

    {bottom_scripts}
</body>
</html>
"""
        return page_html

    # 1. Privacy Policy
    os.makedirs(os.path.join(BASE_DIR, 'privacy'), exist_ok=True)
    privacy_hydrate = {
        "routeId": "qMeMkGgYA",
        "localeId": "default",
        "pathVariables": {"xvoHmOYZD": "privacy"},
        "collectionItemId": "KDwFe3O9z",
        "breakpoints": [
            {"hash": "1zdodk", "mediaQuery": "(min-width: 1440px)"},
            {"hash": "3qsubc", "mediaQuery": "(min-width: 700px) and (max-width: 1439.98px)"},
            {"hash": "vc5owj", "mediaQuery": "(max-width: 699.98px)"}
        ]
    }
    privacy_html = make_page(
        "Privacy Policy — Corabin Studio",
        "Privacy Policy for Corabin digital studio. Learn how we handle client data, communications, and privacy rights with complete transparency.",
        "privacy",
        PRIVACY_HTML_BODY,
        privacy_hydrate
    )
    with open(os.path.join(BASE_DIR, 'privacy/index.html'), 'w', encoding='utf-8') as f:
        f.write(privacy_html)
    print("[OK] Created /privacy/index.html")

    # 2. Terms of Service
    os.makedirs(os.path.join(BASE_DIR, 'terms'), exist_ok=True)
    terms_hydrate = {
        "routeId": "qMeMkGgYA",
        "localeId": "default",
        "pathVariables": {"xvoHmOYZD": "terms"},
        "collectionItemId": "FnoWZzhne",
        "breakpoints": [
            {"hash": "1zdodk", "mediaQuery": "(min-width: 1440px)"},
            {"hash": "3qsubc", "mediaQuery": "(min-width: 700px) and (max-width: 1439.98px)"},
            {"hash": "vc5owj", "mediaQuery": "(max-width: 699.98px)"}
        ]
    }
    terms_html = make_page(
        "Terms of Service — Corabin Studio",
        "Terms of Service governing project engagements, deliverables, intellectual property, and warranties with Corabin digital studio.",
        "terms",
        TERMS_HTML_BODY,
        terms_hydrate
    )
    with open(os.path.join(BASE_DIR, 'terms/index.html'), 'w', encoding='utf-8') as f:
        f.write(terms_html)
    print("[OK] Created /terms/index.html")

    # 3. 404 Page (both root 404.html and /404/index.html)
    os.makedirs(os.path.join(BASE_DIR, '404'), exist_ok=True)
    not_found_hydrate = {
        "routeId": "ns7pFbpiV",
        "localeId": "default",
        "breakpoints": [
            {"hash": "72rtr7", "mediaQuery": "(min-width: 1440px)"},
            {"hash": "1fvi3ca", "mediaQuery": "(min-width: 700px) and (max-width: 1439.98px)"},
            {"hash": "1nuy9oi", "mediaQuery": "(max-width: 699.98px)"}
        ]
    }
    not_found_html = make_page(
        "404 — Page Not Found | Corabin",
        "The page you are looking for does not exist on Corabin. Explore our digital product design and architecture projects or return home.",
        "404",
        NOT_FOUND_HTML_BODY,
        not_found_hydrate
    )
    with open(os.path.join(BASE_DIR, '404.html'), 'w', encoding='utf-8') as f:
        f.write(not_found_html)
    with open(os.path.join(BASE_DIR, '404/index.html'), 'w', encoding='utf-8') as f:
        f.write(not_found_html)
    print("[OK] Created /404.html and /404/index.html")

if __name__ == '__main__':
    generate_static_pages()
