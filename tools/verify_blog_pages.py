import os
import subprocess
import sys
import threading
import time
import urllib.request
import urllib.error

def ensure_dev_server(port=8088):
    try:
        with urllib.request.urlopen(f"http://localhost:{port}/", timeout=1) as resp:
            return
    except Exception:
        pass

    # Start dev server in daemon thread
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.abspath(os.path.join(script_dir, '..'))
    if project_root not in sys.path:
        sys.path.insert(0, project_root)

    from tools.dev_server import run
    server_thread = threading.Thread(target=run, args=(port,), daemon=True)
    server_thread.start()
    for _ in range(30):
        time.sleep(0.1)
        try:
            with urllib.request.urlopen(f"http://localhost:{port}/", timeout=1) as resp:
                return
        except Exception:
            pass

ensure_dev_server(8088)

pages = [
    ("Homepage", "http://localhost:8088/index.html", [
        "Why Your IDX Listings Aren't Showing Up on Google",
        "How Much Does a Real Estate Agent Website Cost in 2026",
        "Custom Web Architecture vs. Commercial Templates"
    ]),
    ("Blog Listing Page", "http://localhost:8088/blog", [
        "Why Your IDX Listings Aren't Showing Up on Google",
        "How Much Does a Real Estate Agent Website Cost in 2026",
        "Custom Web Architecture vs. Commercial Templates",
        "Conversion-Driven Design",
        "From Concept to Market",
        "The Modern Web Tech Stack",
        "Sub-Second Web Performance",
        "Why Scalable Design Systems Actually Matter",
        "The Headless Architecture Paradigm"
    ]),
    ("Blog Detail 1 (Custom vs Template)", "http://localhost:8088/blog/custom-vs-off-the-shelf-choose-wisely", [
        "Custom Web Architecture vs. Commercial Templates",
        "The Strategic Illusion of Off-the-Shelf Simplicity",
        "When Custom Engineering Becomes a Force Multiplier",
        "Total Cost of Ownership",
        "Souvik"
    ]),
    ("Blog Detail 2 (Conversion Design)", "http://localhost:8088/blog/design-that-converts-our-approach", [
        "Conversion-Driven Design",
        "Beyond Surface Visuals",
        "Cognitive Load Reduction",
        "Micro-Interactions and the Perception of Trust",
        "Souvik"
    ]),
    ("Blog Detail 3 (Product Launch)", "http://localhost:8088/blog/7-critical-steps-to-successfully-launch-your-digital-product", [
        "From Concept to Market",
        "1. Defining the Core Value Thesis",
        "3. Design System Tokenization",
        "7. Post-Launch Rapid Feedback Cadence",
        "Souvik"
    ]),
    ("Blog Detail 4 (Tech Stack 2026)", "http://localhost:8088/blog/choosing-the-right-tech-stack-a-decision-framework-for-2025", [
        "The Modern Web Tech Stack",
        "The Evolution Beyond Monolithic Paradigms",
        "Edge Infrastructure, Caching Topologies",
        "Souvik"
    ]),
    ("Blog Detail 5 (Sub-Second Performance)", "http://localhost:8088/blog/speed-up-your-website-today", [
        "Sub-Second Web Performance",
        "Deconstructing Largest Contentful Paint",
        "Taming Interaction to Next Paint",
        "Eliminating Cumulative Layout Shift",
        "Souvik"
    ]),
    ("Blog Detail 6 (Design Systems)", "http://localhost:8088/blog/why-design-systems-actually-matter", [
        "Why Scalable Design Systems Actually Matter",
        "Design Tokens: The Semantic Source of Truth",
        "Bridging the Designer-Developer Chasm",
        "Souvik"
    ]),
    ("Blog Detail 7 (Headless CMS)", "http://localhost:8088/blog/headless-cms-the-future-is-here", [
        "The Headless Architecture Paradigm",
        "The Breakdown of Traditional Monolithic CMS",
        "Decoupling Content as Pure Structured Data",
        "Souvik"
    ]),
    ("Blog Detail 8 (API Architecture)", "http://localhost:8088/blog/stop-making-these-common-api-mistakes", [
        "High-Throughput API Architecture",
        "Unbounded Query Payloads",
        "Neglecting HTTP Caching Semantics",
        "Souvik"
    ]),
    ("Blog Detail 9 (Client-Side Security)", "http://localhost:8088/blog/website-security-made-simple", [
        "Client-Side Web Security",
        "Enforcing a Strict Content Security Policy",
        "Subresource Integrity",
        "Souvik"
    ]),
    ("Blog Detail 10 (Technical Debt)", "http://localhost:8088/blog/technical-debt-friend-or-foe", [
        "Technical Debt in Digital Products",
        "The Financial Analogy of Technical Debt",
        "Intentional Debt vs. Unintentional Incompetence",
        "Souvik"
    ]),
    ("Blog Detail 11 (IDX SEO)", "http://localhost:8088/blog/idx-listings-not-showing-google", [
        "Why Your IDX Listings Aren't Showing Up on Google",
        "1. Check whether the URLs are indexed",
        "2. Confirm the page can be crawled and rendered",
        "Souvik"
    ]),
    ("Blog Detail 12 (Real Estate Cost 2026)", "http://localhost:8088/blog/real-estate-agent-website-cost-2026", [
        "How Much Does a Real Estate Agent Website Cost in 2026",
        "Compare realistic 2026 budget ranges for a real estate agent website",
        "Four realistic budget levels",
        "Souvik"
    ]),
    ("Dynamic Shell Direct (?slug=idx-listings-not-showing-google)", "http://localhost:8088/blog/article.html?slug=idx-listings-not-showing-google", [
        "Why Your IDX Listings Aren't Showing Up on Google",
        "1. Check whether the URLs are indexed",
        "Souvik"
    ]),
    ("Actual Hosting Rewrite Test (/blog/future-cms-article-test-12345)", "http://localhost:8088/blog/future-cms-article-test-12345", [
        "Article Unavailable",
        "The requested article is not currently published or does not exist.",
        "Return to all articles"
    ]),
    ("Future Published Supabase Route (/blog/why-every-real-estate-agent-needs-a-website-in-2026)", "http://localhost:8088/blog/why-every-real-estate-agent-needs-a-website-in-2026", [
        "Why Every Real Estate Agent Needs a Website in 2026",
        "In today",
        "Souvik"
    ]),
]

all_passed = True

# --- 1. Authentic Original Article & Shared Template Audit ---
print("=== Step 1: Authentic Original Article & Shared Template Audit ===")
import glob
import os

backup_dir = ".corabin-local-backups/phase3-pre-cutover-articles"
if not os.path.isdir(backup_dir):
    backup_dir = ".corabin-local-backups/20261016-pre-shared-template/blog"

expected_12_slugs = [
    "7-critical-steps-to-successfully-launch-your-digital-product",
    "choosing-the-right-tech-stack-a-decision-framework-for-2025",
    "custom-vs-off-the-shelf-choose-wisely",
    "design-that-converts-our-approach",
    "headless-cms-the-future-is-here",
    "idx-listings-not-showing-google",
    "real-estate-agent-website-cost-2026",
    "speed-up-your-website-today",
    "stop-making-these-common-api-mistakes",
    "technical-debt-friend-or-foe",
    "website-security-made-simple",
    "why-design-systems-actually-matter"
]

for slug in expected_12_slugs:
    index_file = os.path.join(backup_dir, slug, "index.html")
    if not os.path.isfile(index_file):
        print(f"❌ Missing recoverable backup index.html for {slug} in {backup_dir}!")
        all_passed = False
    else:
        with open(index_file, "r", encoding="utf-8") as f:
            content = f.read()
        if '<style data-framer-css>' not in content and '<style data-framer-font-css>' not in content:
            print(f"❌ Backup for {slug} does not contain authentic Framer CSS styles!")
            all_passed = False
        else:
            print(f"✅ {slug}: Authentic original Framer article verified in {backup_dir}")

# Check reusable article.html
article_html_file = "public/blog/article.html"
if not os.path.isfile(article_html_file):
    print("❌ public/blog/article.html does not exist!")
    all_passed = False
else:
    with open(article_html_file, "r", encoding="utf-8") as f:
        article_content = f.read()
    if 'id="article-title"' in article_content and 'id="article-body-content"' in article_content and 'blog-runtime.js' in article_content:
        print("✅ article.html: Authentic reusable article template with blog-runtime.js integration verified")
    else:
        print("❌ public/blog/article.html is missing required article markers or Supabase runtime!")
        all_passed = False

# --- 2. Hosting Rewrite HTTP Verification ---
print("\n=== Step 2: Hosting Rewrite HTTP Verification ===")
try:
    req = urllib.request.Request("http://localhost:8088/blog/future-cms-article-test-12345")
    with urllib.request.urlopen(req, timeout=10) as resp:
        if resp.status == 200:
            body = resp.read().decode('utf-8')
            if 'id="article-body-content"' in body:
                print("✅ Hosting Rewrite: /blog/future-cms-article-test-12345 rewrites to /blog/article.html (200 OK)")
            else:
                print("❌ Hosting Rewrite: Returned 200 but content is not article.html")
                all_passed = False
        else:
            print(f"❌ Hosting Rewrite: Expected 200, got {resp.status}")
            all_passed = False
except Exception as e:
    print(f"❌ Hosting Rewrite failed: {e}")
    all_passed = False

# --- 3. Headless Chrome Browser Hydration Verification ---
print("\n=== Step 3: Headless Chrome Browser Hydration Verification ===")
for name, url, expected_texts in pages:
    cmd = [
        "google-chrome",
        "--headless=new",
        "--no-sandbox",
        "--disable-gpu",
        "--window-size=1440,900",
        "--virtual-time-budget=6000",
        "--dump-dom",
        url
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    dom = res.stdout

    if "GracefullyDegradingErrorBoundary" in dom:
        print(f"❌ {name} ({url}): ERROR BOUNDARY TRIGGERED!")
        all_passed = False
        continue

    missing = [t for t in expected_texts if t not in dom]
    if missing:
        print(f"❌ {name} ({url}): Missing expected texts: {missing}")
        all_passed = False
    else:
        print(f"✅ {name} ({url}): All {len(expected_texts)} markers verified successfully!")

if all_passed:
    print("\n🎉 ALL AUDITS AND 16 ROUTES (HOMEPAGE, LISTING, 12 DETAIL SHELLS, REWRITE ROUTE, AND DYNAMIC SHELL) PASSED 100%!")
    sys.exit(0)
else:
    print("\n❌ SOME BLOG CHECKS FAILED!")
    sys.exit(1)
