import subprocess
import sys

pages = [
    ("Homepage", "http://localhost:8088/index.html", [
        "Custom Web Architecture vs. Commercial Templates",
        "Conversion-Driven Design: How Top Digital Studios Engineer User Intent",
        "From Concept to Market: The 7 Strategic Milestones of Digital Product Launch"
    ]),
    ("Blog Listing Page", "http://localhost:8088/blog", [
        "Custom Web Architecture vs. Commercial Templates",
        "Conversion-Driven Design",
        "From Concept to Market",
        "The Modern Web Tech Stack",
        "Sub-Second Web Performance",
        "Why Scalable Design Systems Actually Matter",
        "The Headless Architecture Paradigm",
        "High-Throughput API Architecture",
        "Client-Side Web Security"
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
]

all_passed = True

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
        print(f"⚠️ {name} ({url}): Missing expected texts: {missing}")
        all_passed = False
    else:
        print(f"✅ {name} ({url}): All {len(expected_texts)} markers verified successfully!")

if all_passed:
    print("\n🎉 ALL 12 BLOG ROUTES (HOMEPAGE, LISTING, AND ALL 10 DETAILS) HYDRATED 100% CLEANLY!")
    sys.exit(0)
else:
    print("\n❌ SOME BLOG CHECKS FAILED!")
    sys.exit(1)
