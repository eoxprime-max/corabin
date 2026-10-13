#!/usr/bin/env python3
import json
import os
import re
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
BASE_DIR = os.path.abspath(os.path.join(SCRIPT_DIR, '..'))

# 1. Define AST for Article Body
ast = [
    1,
    [4, "p", None, [5, "A real estate website can cost a few hundred dollars to set up, several thousand dollars for a tailored professional site, or considerably more when it includes complex listing integrations and custom software. The number that matters is not just the launch invoice. It is the total cost of building, running, updating and getting leads from the site."]],
    [4, "p", None, [5, "For a solo agent, the right budget depends on four questions: Do you need IDX/MLS listings? Who will update the site? How much original content and design do you need? And what happens after a visitor submits an enquiry?"]],
    [4, "p", None,
        [5, "The ranges below are "],
        [4, "strong", None, [5, "planning estimates, not industry averages"]],
        [5, ". Vendor pricing changes and local requirements differ, so ask for a written quote that separates setup, recurring fees and optional extras."]
    ],
    [4, "h2", None, [5, "1. Four realistic budget levels"]],
    [4, "div", {"className": "framer-table-wrapper", "style": {"overflowX": "auto", "margin": "32px 0 32px 0", "WebkitOverflowScrolling": "touch"}},
        [4, "table", {"className": "framer-text", "style": {"width": "100%", "borderCollapse": "collapse", "borderSpacing": 0, "textAlign": "left", "minWidth": "640px"}},
            [4, "thead", None,
                [4, "tr", None,
                    [4, "th", {"className": "framer-text", "style": {"padding": "14px 16px", "borderBottom": "2px solid rgba(0, 0, 0, 0.1)", "fontWeight": "600", "color": "var(--token-bb407a59-7892-4758-ae44-34831ff9d303, #0c120c)"}}, [5, "Website approach"]],
                    [4, "th", {"className": "framer-text", "style": {"padding": "14px 16px", "borderBottom": "2px solid rgba(0, 0, 0, 0.1)", "fontWeight": "600", "color": "var(--token-bb407a59-7892-4758-ae44-34831ff9d303, #0c120c)", "textAlign": "right"}}, [5, "Illustrative initial budget"]],
                    [4, "th", {"className": "framer-text", "style": {"padding": "14px 16px", "borderBottom": "2px solid rgba(0, 0, 0, 0.1)", "fontWeight": "600", "color": "var(--token-bb407a59-7892-4758-ae44-34831ff9d303, #0c120c)", "textAlign": "right"}}, [5, "Ongoing budget to plan for"]],
                    [4, "th", {"className": "framer-text", "style": {"padding": "14px 16px", "borderBottom": "2px solid rgba(0, 0, 0, 0.1)", "fontWeight": "600", "color": "var(--token-bb407a59-7892-4758-ae44-34831ff9d303, #0c120c)"}}, [5, "Usually makes sense when"]]
                ]
            ],
            [4, "tbody", None,
                [4, "tr", None,
                    [4, "td", {"className": "framer-text", "style": {"padding": "14px 16px", "borderBottom": "1px solid rgba(0, 0, 0, 0.06)"}}, [5, "DIY builder and template"]],
                    [4, "td", {"className": "framer-text", "style": {"padding": "14px 16px", "borderBottom": "1px solid rgba(0, 0, 0, 0.06)", "textAlign": "right"}}, [5, "$100–$800 for initial setup, excluding your own time"]],
                    [4, "td", {"className": "framer-text", "style": {"padding": "14px 16px", "borderBottom": "1px solid rgba(0, 0, 0, 0.06)", "textAlign": "right"}}, [5, "Roughly $15–$100+ per month for platform, domain and selected add-ons"]],
                    [4, "td", {"className": "framer-text", "style": {"padding": "14px 16px", "borderBottom": "1px solid rgba(0, 0, 0, 0.06)"}}, [5, "You have a limited budget, a small number of pages and time to maintain it"]]
                ],
                [4, "tr", None,
                    [4, "td", {"className": "framer-text", "style": {"padding": "14px 16px", "borderBottom": "1px solid rgba(0, 0, 0, 0.06)"}}, [5, "Freelancer-built brochure site"]],
                    [4, "td", {"className": "framer-text", "style": {"padding": "14px 16px", "borderBottom": "1px solid rgba(0, 0, 0, 0.06)", "textAlign": "right"}}, [5, "About $1,000–$5,000"]],
                    [4, "td", {"className": "framer-text", "style": {"padding": "14px 16px", "borderBottom": "1px solid rgba(0, 0, 0, 0.06)", "textAlign": "right"}}, [5, "Domain, hosting, support and paid tools vary; plan separately"]],
                    [4, "td", {"className": "framer-text", "style": {"padding": "14px 16px", "borderBottom": "1px solid rgba(0, 0, 0, 0.06)"}}, [5, "You need a more tailored brand, service pages, enquiry forms and local content"]]
                ],
                [4, "tr", None,
                    [4, "td", {"className": "framer-text", "style": {"padding": "14px 16px", "borderBottom": "1px solid rgba(0, 0, 0, 0.06)"}}, [5, "Custom professional site"]],
                    [4, "td", {"className": "framer-text", "style": {"padding": "14px 16px", "borderBottom": "1px solid rgba(0, 0, 0, 0.06)", "textAlign": "right"}}, [5, "About $5,000–$15,000+"]],
                    [4, "td", {"className": "framer-text", "style": {"padding": "14px 16px", "borderBottom": "1px solid rgba(0, 0, 0, 0.06)", "textAlign": "right"}}, [5, "Hosting, maintenance and integrations are separate"]],
                    [4, "td", {"className": "framer-text", "style": {"padding": "14px 16px", "borderBottom": "1px solid rgba(0, 0, 0, 0.06)"}}, [5, "Your website is a major marketing channel and needs a distinctive design or workflow"]]
                ],
                [4, "tr", None,
                    [4, "td", {"className": "framer-text", "style": {"padding": "14px 16px", "borderBottom": "1px solid rgba(0, 0, 0, 0.06)"}}, [5, "Larger listing/IDX or multi-agent build"]],
                    [4, "td", {"className": "framer-text", "style": {"padding": "14px 16px", "borderBottom": "1px solid rgba(0, 0, 0, 0.06)", "textAlign": "right"}}, [5, "$10,000–$30,000+ can be a useful early planning envelope, but scope can exceed it"]],
                    [4, "td", {"className": "framer-text", "style": {"padding": "14px 16px", "borderBottom": "1px solid rgba(0, 0, 0, 0.06)", "textAlign": "right"}}, [5, "IDX/MLS fees, listing-data service, support and integrations may be recurring"]],
                    [4, "td", {"className": "framer-text", "style": {"padding": "14px 16px", "borderBottom": "1px solid rgba(0, 0, 0, 0.06)"}}, [5, "You need complex search, many listings, team workflows or integrations"]]
                ]
            ]
        ]
    ],
    [4, "p", None, [5, "These are broad budgeting bands, not quoted prices for a specific provider. A template with ten pages and a custom site with data feeds, filtering, saved searches and CRM automation are different products even if both are called “a real estate website.”"]],
    [4, "h2", None, [5, "2. What actually changes the price?"]],
    [4, "h3", None, [5, "Design and content"]],
    [4, "p", None, [5, "A site using a licensed template and client-supplied copy takes less work than a bespoke visual system with edited photography, floor plans, location pages and carefully written service content. Ask whether copywriting, image licensing and content entry are included."]],
    [4, "h3", None, [5, "IDX/MLS integration"]],
    [4, "p", None,
        [5, "IDX enables eligible agents and brokers to display participating MLS listing data under the applicable MLS rules and agreements. It is not simply an image gallery. Ask about eligibility, setup, monthly data fees, refresh frequency, attribution, listing status, search filters, compliance review and what happens if you change vendors. The National Association of REALTORS® describes IDX as a policy framework for limited electronic display of listings by MLS participants; exact permissions depend on the MLS and local rules: "],
        [4, "a", {"href": "https://www.nar.realtor/about-nar/policies/internet-data-exchange-idx", "target": "_blank", "rel": "noopener noreferrer", "className": "framer-styles-preset-1k8uo92"}, [5, "NAR IDX overview"]],
        [5, "."]
    ],
    [4, "h3", None, [5, "Lead routing and CRM"]],
    [4, "p", None, [5, "A form that emails one inbox costs less to build than a workflow that validates a lead, routes it by territory, logs consent, sends an instant alert, updates a CRM and reports on response time. Define the required workflow before comparing quotes."]],
    [4, "h3", None, [5, "Migration and maintenance"]],
    [4, "p", None, [5, "Moving an old site, preserving URLs, mapping redirects, cleaning listing data and testing forms are real work. A site is not “finished” if nobody is responsible for security updates, backups, broken links and listing changes."]],
    [4, "h2", None, [5, "3. Monthly costs agents often forget"]],
    [4, "p", None, [5, "Build a budget for the domain, hosting or platform subscription, email, CRM, analytics, consent-management tools if needed, IDX/MLS services, premium plugins, backups, security monitoring and technical support. Some providers bundle several items; others invoice them separately. Do not compare a bundled monthly service with a one-time build fee without adding the recurring costs."]],
    [4, "p", None, [5, "Also budget for the work that creates demand: listing photography, original local guides, paid promotion, email follow-up and regular content updates. A technically excellent website cannot compensate for inaccurate listings or a slow response to enquiries."]],
    [4, "h2", None, [5, "4. A simple example budget"]],
    [4, "p", None, [5, "Suppose you are a solo buyer's agent with 6 core pages, a contact form, a handful of manually curated listings, neighbourhood guides and no IDX requirement. A template or modest custom brochure site may be sufficient. If you require live MLS data, advanced filters and saved searches, add a separate data-service and integration budget rather than assuming it is included in the base website price."]],
    [4, "p", None, [5, "Before paying, ask every provider for the same written scope:"]],
    [4, "ol", {"style": {"margin": "24px 0", "paddingLeft": "24px", "lineHeight": "1.8em"}},
        [4, "li", None, [5, "Which pages and features are included?"]],
        [4, "li", None, [5, "Is copywriting, photography, listing migration and SEO setup included?"]],
        [4, "li", None, [5, "Are IDX/MLS, CRM, WhatsApp/SMS, hosting and email recurring extras?"]],
        [4, "li", None, [5, "Who owns the domain, design files, site code and listing data?"]],
        [4, "li", None, [5, "What is the support window, turnaround time and exit/migration process?"]],
        [4, "li", None, [5, "How many revisions are included, and what triggers a change order?"]]
    ],
    [4, "h2", None, [5, "5. Should a solo agent build now or wait?"]],
    [4, "p", None, [5, "Start with a focused site if you can keep it accurate and respond to enquiries. A simple, useful site with clear services, current contact details, trustworthy property information and a direct conversion path can be a better first step than paying for features you will not use. Choose advanced search or automation when it solves a specific business bottleneck."]],
    [4, "p", None,
        [4, "strong", None, [5, "Bottom line:"]],
        [5, " Compare total ownership cost and the work the website must do, not only the launch price. A sensible scope makes quotes comparable and reduces expensive surprises."]
    ],
    [4, "h3", None, [5, "FAQs"]],
    [4, "p", None,
        [4, "strong", None, [5, "Can I build a realtor website for under $1,000?"]],
        [5, " Yes, a DIY or narrowly scoped template site may fit that budget, especially when you provide the content and do the setup. It may not include custom design, IDX, migration or hands-on support."]
    ],
    [4, "p", None,
        [4, "strong", None, [5, "Does a real estate website need IDX?"]],
        [5, " No. It depends on your business model and whether live MLS listing display is necessary. A local service site with curated listings or buyer/seller information can work without IDX."]
    ],
    [4, "p", None,
        [4, "strong", None, [5, "Are IDX fees included in a website build?"]],
        [5, " Not automatically. Ask for setup and recurring fees separately and verify the relevant MLS rules and eligibility."]
    ],
    [4, "p", None,
        [4, "strong", None, [5, "Does a custom Next.js site automatically rank better?"]],
        [5, " No. Technology alone does not guarantee rankings. Content, crawlability, relevance, links, site usability and local competition all matter."]
    ],
    [4, "h3", None, [5, "Internal links"]],
    [4, "ul", {"style": {"margin": "24px 0", "paddingLeft": "24px", "lineHeight": "1.8em"}},
        [4, "li", None,
            [5, "Existing: "],
            [4, "a", {"href": "https://corabin.com/", "className": "framer-styles-preset-1k8uo92"}, [5, "Corabin home"]],
            [5, ", "],
            [4, "a", {"href": "https://corabin.com/about", "className": "framer-styles-preset-1k8uo92"}, [5, "About Corabin"]],
            [5, ", "],
            [4, "a", {"href": "https://corabin.com/projects", "className": "framer-styles-preset-1k8uo92"}, [5, "Projects"]],
            [5, ", "],
            [4, "a", {"href": "https://corabin.com/contact", "className": "framer-styles-preset-1k8uo92"}, [5, "Contact"]],
            [5, "."]
        ]
    ],
    [4, "h3", None, [5, "Sources and further reading"]],
    [4, "ul", {"style": {"margin": "24px 0", "paddingLeft": "24px", "lineHeight": "1.8em"}},
        [4, "li", None,
            [4, "a", {"href": "https://www.nar.realtor/about-nar/policies/internet-data-exchange-idx", "target": "_blank", "rel": "noopener noreferrer", "className": "framer-styles-preset-1k8uo92"}, [5, "NAR: Internet Data Exchange (IDX)"]]
        ],
        [4, "li", None,
            [4, "a", {"href": "https://www.wix.com/plans", "target": "_blank", "rel": "noopener noreferrer", "className": "framer-styles-preset-1k8uo92"}, [5, "Wix: current plans and pricing"]],
            [5, " — platform pricing varies by location and billing term."]
        ],
        [4, "li", None,
            [4, "a", {"href": "https://support.squarespace.com/hc/en-us/articles/206536797-Choose-the-right-Squarespace-plan", "target": "_blank", "rel": "noopener noreferrer", "className": "framer-styles-preset-1k8uo92"}, [5, "Squarespace: choosing a plan"]]
        ],
        [4, "li", None,
            [4, "a", {"href": "https://developers.google.com/search/docs/fundamentals/creating-helpful-content", "target": "_blank", "rel": "noopener noreferrer", "className": "framer-styles-preset-1k8uo92"}, [5, "Google: helpful, reliable, people-first content"]]
        ]
    ],
    [4, "p", None,
        [4, "strong", None, [5, "CTA:"]],
        [5, " Need a website scope that matches your listings, lead process and budget? "],
        [4, "a", {"href": "https://corabin.com/contact/", "className": "framer-styles-preset-1k8uo92"}, [5, "Contact Corabin"]],
        [5, " to discuss the requirements before choosing a build approach."]
    ]
]

new_record = {
    "id": {
        "type": "string",
        "value": "B7k9Re2wQ"
    },
    "previousItemId": {
        "type": "string",
        "value": "GvcJbd8QO"
    },
    "rxkeCE0l_": {
        "type": "string",
        "value": "How Much Does a Real Estate Agent Website Cost in 2026? A Realistic Price Breakdown for Solo Agents"
    },
    "OjAlyiakl": {
        "type": "string",
        "value": "real-estate-agent-website-cost-2026"
    },
    "eViimYxMt": {
        "type": "date",
        "value": "2026-10-12T00:00:00.000Z"
    },
    "DYldC4ELI": {
        "type": "responsiveimage",
        "value": {
            "src": "/assets/images/blogs/blog11.webp",
            "srcSet": "/assets/images/blogs/blog11.png 512w, /assets/images/blogs/blog11.png 1024w, /assets/images/blogs/blog11.webp 1672w",
            "pixelWidth": 1672,
            "pixelHeight": 941,
            "positionX": "50%",
            "positionY": "50%"
        }
    },
    "pFOAL5b2B": {
        "type": "string",
        "value": "Souvik"
    },
    "vY4r0YgEv": {
        "type": "string",
        "value": "Founder & Lead Architect"
    },
    "OcVxWrNlF": {
        "type": "responsiveimage",
        "value": {
            "src": "/assets/images/about/Souvik_short_profile_img.jpeg",
            "srcSet": "/assets/images/about/Souvik_short_profile_img-512.webp 512w, /assets/images/about/Souvik_short_profile_img.webp 1024w",
            "pixelWidth": 1024,
            "pixelHeight": 1024
        }
    },
    "XtPRgJU7d": {
        "type": "string",
        "value": "Compare realistic 2026 budget ranges for a real estate agent website, from a DIY site to custom design, IDX listings, integrations and ongoing costs."
    },
    "qf1cbKeUW": {
        "type": "richtext",
        "value": json.dumps(ast, ensure_ascii=False)
    }
}

print("1. Updating tools/updated_blog_records.json...")
with open(os.path.join(BASE_DIR, 'tools/updated_blog_records.json'), 'r', encoding='utf-8') as f:
    records = json.load(f)

# Ensure 10th record points to B7k9Re2wQ
records[-1]["nextItemId"] = {
    "type": "string",
    "value": "B7k9Re2wQ"
}

# Check if already appended to avoid duplicate runs
if not any(r["id"]["value"] == "B7k9Re2wQ" for r in records):
    records.append(new_record)

with open(os.path.join(BASE_DIR, 'tools/updated_blog_records.json'), 'w', encoding='utf-8') as f:
    json.dump(records, f, indent=2, ensure_ascii=False)
print(f"tools/updated_blog_records.json updated with {len(records)} records!")

# 2. Update l0aFVHEAD.Du2GMRYI.mjs in both root and public
compact_json = json.dumps(records, separators=(',', ':'), ensure_ascii=False)

cms_files = [
    os.path.join(BASE_DIR, 'public/framerusercontent.com/sites/46CYIm3dbxFoU3f63shpCX/l0aFVHEAD.Du2GMRYI.mjs')
]

for cfile in cms_files:
    print(f"Patching {cfile}...")
    with open(cfile, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace _inMemoryCMS
    start_tag = ';let _inMemoryCMS='
    idx1 = content.find(start_tag)
    assert idx1 != -1, "start_tag not found in " + cfile
    idx_json_start = idx1 + len(start_tag)
    end_tag = ';\nlet _inMemoryItems='
    idx2 = content.find(end_tag, idx_json_start)
    assert idx2 != -1, "end_tag not found in " + cfile

    content = content[:idx_json_start] + compact_json + content[idx2:]

    # Update s and m dictionaries in Ct
    old_s_pattern = '"GvcJbd8QO":"technical-debt-friend-or-foe"}'
    new_s_pattern = '"GvcJbd8QO":"technical-debt-friend-or-foe","B7k9Re2wQ":"real-estate-agent-website-cost-2026"}'
    if old_s_pattern in content:
        content = content.replace(old_s_pattern, new_s_pattern, 1)

    old_m_pattern = '"technical-debt-friend-or-foe":"GvcJbd8QO"}'
    new_m_pattern = '"technical-debt-friend-or-foe":"GvcJbd8QO","real-estate-agent-website-cost-2026":"B7k9Re2wQ"}'
    if old_m_pattern in content:
        content = content.replace(old_m_pattern, new_m_pattern, 1)

    with open(cfile, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Saved {cfile} successfully!")

# 3. Generate detail routes
routes = [
    ('public/blog/real-estate-agent-website-cost-2026/index.html', 'public/blog/technical-debt-friend-or-foe/index.html')
]

for dest_rel, src_rel in routes:
    dest_path = os.path.join(BASE_DIR, dest_rel)
    src_path = os.path.join(BASE_DIR, src_rel)
    os.makedirs(os.path.dirname(dest_path), exist_ok=True)
    print(f"Generating {dest_path} from {src_path}...")

    with open(src_path, 'r', encoding='utf-8') as f:
        html = f.read()

    # Replacements:
    # Title
    html = re.sub(
        r'<title>.*?</title>',
        '<title>How Much Does a Real Estate Agent Website Cost in 2026? A Realistic Price Breakdown for Solo Agents — Corabin</title>',
        html
    )
    # Meta description
    html = re.sub(
        r'<meta name="description" content=".*?">',
        '<meta name="description" content="Compare realistic 2026 budget ranges for a real estate agent website, from a DIY site to custom design, IDX listings, integrations and ongoing costs.">',
        html
    )
    # Canonical URL
    html = re.sub(
        r'<link rel="canonical" href="https://corabin.com/blog/.*?">',
        '<link rel="canonical" href="https://corabin.com/blog/real-estate-agent-website-cost-2026">',
        html
    )
    # OG URL
    html = re.sub(
        r'<meta property="og:url" content="https://corabin.com/blog/.*?">',
        '<meta property="og:url" content="https://corabin.com/blog/real-estate-agent-website-cost-2026">',
        html
    )
    # OG Title
    html = re.sub(
        r'<meta property="og:title" content=".*?">',
        '<meta property="og:title" content="How Much Does a Real Estate Agent Website Cost in 2026? A Realistic Price Breakdown for Solo Agents — Corabin">',
        html
    )
    # OG Description
    html = re.sub(
        r'<meta property="og:description" content=".*?">',
        '<meta property="og:description" content="Compare realistic 2026 budget ranges for a real estate agent website, from a DIY site to custom design, IDX listings, integrations and ongoing costs.">',
        html
    )
    # OG Image
    html = re.sub(
        r'<meta property="og:image" content="https://corabin.com/assets/images/blogs/blog\d+\.webp">',
        '<meta property="og:image" content="https://corabin.com/assets/images/blogs/blog11.webp">',
        html
    )
    # OG Image alt
    html = re.sub(
        r'<meta property="og:image:alt" content=".*?">',
        '<meta property="og:image:alt" content="Cost-planning worksheet beside a laptop showing a clean property listing website.">',
        html
    )
    # Twitter Title
    html = re.sub(
        r'<meta name="twitter:title" content=".*?">',
        '<meta name="twitter:title" content="How Much Does a Real Estate Agent Website Cost in 2026? A Realistic Price Breakdown for Solo Agents — Corabin">',
        html
    )
    # Twitter Description
    html = re.sub(
        r'<meta name="twitter:description" content=".*?">',
        '<meta name="twitter:description" content="Compare realistic 2026 budget ranges for a real estate agent website, from a DIY site to custom design, IDX listings, integrations and ongoing costs.">',
        html
    )
    # Twitter Image
    html = re.sub(
        r'<meta name="twitter:image" content="https://corabin.com/assets/images/blogs/blog\d+\.webp">',
        '<meta name="twitter:image" content="https://corabin.com/assets/images/blogs/blog11.webp">',
        html
    )
    # Twitter Image alt
    html = re.sub(
        r'<meta name="twitter:image:alt" content=".*?">',
        '<meta name="twitter:image:alt" content="Cost-planning worksheet beside a laptop showing a clean property listing website.">',
        html
    )

    # JSON-LD Article
    old_article_snippet_pattern = r'\{\s*"@context":\s*"https://schema\.org",\s*"@type":\s*"Article",.*?"mainEntityOfPage":\s*\{\s*"@type":\s*"WebPage",\s*"@id":\s*"https://corabin\.com/blog/.*?"\s*\}\s*\}'
    new_article_snippet = '''{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "How Much Does a Real Estate Agent Website Cost in 2026? A Realistic Price Breakdown for Solo Agents",
  "description": "Compare realistic 2026 budget ranges for a real estate agent website, from a DIY site to custom design, IDX listings, integrations and ongoing costs.",
  "url": "https://corabin.com/blog/real-estate-agent-website-cost-2026",
  "datePublished": "2026-10-12T00:00:00Z",
  "dateModified": "2026-10-12T00:00:00Z",
  "author": {
    "@type": "Person",
    "name": "Souvik",
    "url": "https://corabin.com"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Corabin",
    "logo": {
      "@type": "ImageObject",
      "url": "https://corabin.com/assets/images/Corabin_logo.webp"
    }
  },
  "image": "https://corabin.com/assets/images/blogs/blog11.webp",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://corabin.com/blog/real-estate-agent-website-cost-2026"
  }
}'''
    html = re.sub(old_article_snippet_pattern, new_article_snippet, html, flags=re.DOTALL)

    # JSON-LD Breadcrumb
    old_breadcrumb_pattern = r'\{\s*"@type":\s*"ListItem",\s*"position":\s*3,\s*"name":\s*".*?",\s*"item":\s*"https://corabin\.com/blog/.*?"\s*\}'
    new_breadcrumb = '''{
      "@type": "ListItem",
      "position": 3,
      "name": "How Much Does a Real Estate Agent Website Cost in 2026? A Realistic Price Breakdown for Solo Agents",
      "item": "https://corabin.com/blog/real-estate-agent-website-cost-2026"
    }'''
    html = re.sub(old_breadcrumb_pattern, new_breadcrumb, html)

    # data-framer-hydrate-v2
    # Replace pathVariables and collectionItemId
    hydrate_match = re.search(r'data-framer-hydrate-v2="([^"]+)"', html)
    assert hydrate_match, "data-framer-hydrate-v2 not found in " + src_path
    hydrate_raw = hydrate_match.group(1).replace('&quot;', '"')
    hydrate_data = json.loads(hydrate_raw)
    hydrate_data["pathVariables"] = {"OjAlyiakl": "real-estate-agent-website-cost-2026"}
    hydrate_data["collectionItemId"] = "B7k9Re2wQ"
    new_hydrate_str = json.dumps(hydrate_data).replace('"', '&quot;')
    html = html[:hydrate_match.start(1)] + new_hydrate_str + html[hydrate_match.end(1):]

    with open(dest_path, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"Generated {dest_path} successfully!")

# 4. Update Sitemap in root and public
sitemap_files = [
    os.path.join(BASE_DIR, 'public/sitemap.xml')
]

new_sitemap_entry = '''
  <url>
    <loc>https://corabin.com/blog/real-estate-agent-website-cost-2026</loc>
    <lastmod>2026-10-12</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>'''

for sfile in sitemap_files:
    print(f"Updating {sfile}...")
    with open(sfile, 'r', encoding='utf-8') as f:
        scontent = f.read()

    if 'https://corabin.com/blog/real-estate-agent-website-cost-2026' not in scontent:
        scontent = scontent.replace('</urlset>', new_sitemap_entry.strip())
        with open(sfile, 'w', encoding='utf-8') as f:
            f.write(scontent + '\n')
        print(f"Added post to {sfile}")
    else:
        print(f"Post already in {sfile}")

print("\n🎉 Publication pipeline completed successfully!")
