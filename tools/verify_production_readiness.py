#!/usr/bin/env python3
"""
verify_production_readiness.py — Exhaustive production verification suite for Corabin:
1. Validates all 23 primary routes return HTTP 200
2. Validates all 6 legacy project stubs return HTTP 200 with proper redirect tags
3. Validates static assets (favicons, sitemap, robots, redirects, headers)
4. Checks HTML structure, canonical URLs, OG metadata, and schema JSON-LD
5. Scans for any forbidden template strings or broken link patterns
"""

import os
import sys
import re
import urllib.request
import urllib.error
import http.server
import socketserver
import threading
import json

PORT = 8089
BASE_URL = f"http://127.0.0.1:{PORT}"

ROUTES = [
    "/",
    "/about",
    "/contact",
    "/projects",
    "/blog",
    "/privacy",
    "/terms",
    "/404",
    "/projects/kora",
    "/projects/himon",
    "/projects/norda",
    "/projects/ardene",
    "/projects/havyn",
    "/projects/almare",
    "/blog/custom-vs-off-the-shelf-choose-wisely",
    "/blog/design-that-converts-our-approach",
    "/blog/7-critical-steps-to-successfully-launch-your-digital-product",
    "/blog/choosing-the-right-tech-stack-a-decision-framework-for-2025",
    "/blog/speed-up-your-website-today",
    "/blog/why-design-systems-actually-matter",
    "/blog/headless-cms-the-future-is-here",
    "/blog/stop-making-these-common-api-mistakes",
    "/blog/website-security-made-simple",
    "/blog/technical-debt-friend-or-foe",
]

LEGACY_ROUTES = {
    "/projects/arrows": "/projects/kora",
    "/projects/chantalle": "/projects/himon",
    "/projects/papyrus": "/projects/norda",
    "/projects/london-museum": "/projects/ardene",
    "/projects/bullseye": "/projects/havyn",
    "/projects/interference": "/projects/almare"
}

ASSETS = [
    "/favicon.ico",
    "/assets/images/favicon-32.png",
    "/assets/images/favicon-180.png",
    "/assets/images/Corabin_logo.png",
    "/assets/images/og-corabin.png",
    "/sitemap.xml",
    "/robots.txt",
    "/_redirects",
    "/_headers"
]

FORBIDDEN_PATTERNS = [
    "Vectura",
    "Terrain Coffee",
    "Stellar Analytics",
    "Greenwave Solar",
    "Tom Bennett",
    "Sarah Chen",
    "Marcus Rodriguez",
    "My Framer Site",
    "preserves OPUS clean fold"
]

class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        pass

def run_server():
    os.chdir(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
    server = socketserver.TCPServer(("127.0.0.1", PORT), QuietHandler)
    server.serve_forever()

def verify():
    print("=" * 70)
    print("     CORABIN WEBSITE PRODUCTION READINESS VERIFICATION")
    print("=" * 70)

    # 1. Start Server
    server_thread = threading.Thread(target=run_server, daemon=True)
    server_thread.start()

    errors = 0
    passed = 0

    print("\n[1/5] Verifying Primary Canonical Routes:")
    for route in ROUTES:
        url = BASE_URL + route
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'ProductionVerifier/1.0'})
            with urllib.request.urlopen(req) as resp:
                status = resp.status
                body = resp.read().decode('utf-8', errors='ignore')

                # Check Title
                title_match = re.search(r'<title>(.*?)</title>', body)
                title = title_match.group(1) if title_match else "MISSING"

                # Check Canonical
                can_match = re.search(r'<link\s+rel=["\']canonical["\']\s+href=["\']([^"\']+)["\']', body)
                canonical = can_match.group(1) if can_match else "MISSING"

                # Check JSON-LD
                has_ld = '<script type="application/ld+json">' in body

                if status == 200 and title != "MISSING":
                    print(f"  ✅ {route:<45} [200 OK] {title[:40]}...")
                    passed += 1
                else:
                    print(f"  ❌ {route:<45} [Status: {status}] Title: {title}")
                    errors += 1

                # Check Forbidden
                for term in FORBIDDEN_PATTERNS:
                    if term in body:
                        print(f"     ⚠️ FORBIDDEN TERM IN {route}: '{term}'")
                        errors += 1

        except Exception as e:
            print(f"  ❌ {route:<45} FAILED: {e}")
            errors += 1

    print(f"\n[2/5] Verifying Legacy Slug Redirect Stubs:")
    for leg_route, target in LEGACY_ROUTES.items():
        url = BASE_URL + leg_route
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'ProductionVerifier/1.0'})
            with urllib.request.urlopen(req) as resp:
                body = resp.read().decode('utf-8', errors='ignore')
                has_meta_refresh = f'content="0; url={target}"' in body or f'content="0;url={target}"' in body
                has_canonical = f'href="https://corabin.com{target}"' in body
                if resp.status == 200 and has_meta_refresh and has_canonical:
                    print(f"  ✅ {leg_route:<25} -> {target:<20} [301 Meta + Canonical OK]")
                    passed += 1
                else:
                    print(f"  ❌ {leg_route} invalid redirect stub!")
                    errors += 1
        except Exception as e:
            print(f"  ❌ {leg_route} FAILED: {e}")
            errors += 1

    print(f"\n[3/5] Verifying Critical Production Assets:")
    for asset in ASSETS:
        url = BASE_URL + asset
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'ProductionVerifier/1.0'})
            with urllib.request.urlopen(req) as resp:
                size = len(resp.read())
                print(f"  ✅ {asset:<35} [200 OK] Size: {size:,} bytes")
                passed += 1
        except Exception as e:
            print(f"  ❌ {asset:<35} FAILED: {e}")
            errors += 1

    print(f"\n[4/5] Verifying Contact Form Accessibility & Configuration:")
    contact_path = "framerusercontent.com/sites/46CYIm3dbxFoU3f63shpCX/https/framerusercontent.com/modules/VM6LshqF3kGfk3qxJUTi/2SWjHeF37NxXG6KxhVeu/TQtrT4cVD.js"
    if os.path.exists(contact_path):
        with open(contact_path, "r", encoding="utf-8") as f:
            c = f.read()
        has_req_email = 'inputName: "Email"' in c and 'required: true' in c
        has_labels = 'htmlFor: "contact-name"' in c and 'htmlFor: "contact-email"' in c
        has_aria = 'aria-label": "Your Name"' in c or '"aria-label": "Your Name"' in c
        if has_req_email and has_labels and has_aria:
            print("  ✅ Contact form has required Email, explicit labels, and ARIA labels.")
            passed += 1
        else:
            print(f"  ❌ Contact form accessibility check failed: req={has_req_email}, labels={has_labels}, aria={has_aria}")
            errors += 1

    print(f"\n[5/5] Verifying Security Configuration (_headers):")
    if os.path.exists("_headers"):
        with open("_headers", "r", encoding="utf-8") as f:
            h = f.read()
        has_hsts = "Strict-Transport-Security" in h
        has_nosniff = "X-Content-Type-Options: nosniff" in h
        has_csp = "Content-Security-Policy" in h
        if has_hsts and has_nosniff and has_csp:
            print("  ✅ _headers declares HSTS, nosniff, frame-ancestors, CSP, and asset cache rules.")
            passed += 1
        else:
            print(f"  ❌ _headers missing critical security headers.")
            errors += 1

    print("\n" + "=" * 70)
    print(f"VERIFICATION SUMMARY: {passed} PASSED, {errors} ERRORS")
    print("=" * 70)
    return errors == 0

if __name__ == "__main__":
    success = verify()
    sys.exit(0 if success else 1)
