#!/usr/bin/env python3
import json
import os
import re

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
BASE_DIR = os.path.abspath(os.path.join(SCRIPT_DIR, '..'))

# 1. Define AST for Article Body (100% faithful to supplied Markdown)
ast = [
    1,
    [4, "p", None, [5, "An IDX search can work perfectly for a visitor and still create weak or inconsistent search visibility. A user-facing page being available is not the same as Google crawling, rendering, selecting and indexing it. Listing data can also be duplicated across many agent websites, while property inventory changes frequently."]],
    [4, "p", None, [5, "The fix is not to add a keyword to every property title. Start by finding out which URLs are missing and why."]],
    [4, "h2", None, [5, "1. Check whether the URLs are indexed"]],
    [4, "p", None,
        [5, "Choose a small sample: the IDX landing page, a property detail page, a search-results page, a neighbourhood page and one expired listing. Inspect each URL in Google Search Console. Confirm whether Google knows the URL, whether crawling succeeded, whether indexing is allowed and which canonical URL Google selected. The URL Inspection tool provides Google’s view of an individual URL: "],
        [4, "a", {"href": "https://support.google.com/webmasters/answer/9012289", "target": "_blank", "rel": "noopener noreferrer", "className": "framer-styles-preset-1k8uo92"}, [5, "Search Console help"]],
        [5, "."]
    ],
    [4, "p", None, [5, "Do not confuse low visibility with deindexing. A page can be indexed but rank too low to generate meaningful traffic."]],
    [4, "h2", None, [5, "2. Confirm the page can be crawled and rendered"]],
    [4, "p", None,
        [5, "Review "],
        [4, "code", {"style": {"fontFamily": "monospace", "backgroundColor": "rgba(0, 0, 0, 0.05)", "padding": "2px 5px", "borderRadius": "4px", "fontSize": "0.9em"}}, [5, "robots.txt"]],
        [5, ", meta robots tags, server responses and the site’s bot protection. A "],
        [4, "code", {"style": {"fontFamily": "monospace", "backgroundColor": "rgba(0, 0, 0, 0.05)", "padding": "2px 5px", "borderRadius": "4px", "fontSize": "0.9em"}}, [5, "noindex"]],
        [5, " directive prevents a page from appearing in Google results when the crawler can access and read it. Blocking the page in "],
        [4, "code", {"style": {"fontFamily": "monospace", "backgroundColor": "rgba(0, 0, 0, 0.05)", "padding": "2px 5px", "borderRadius": "4px", "fontSize": "0.9em"}}, [5, "robots.txt"]],
        [5, " can prevent Google from seeing that directive, so use the correct mechanism for the goal. See "],
        [4, "a", {"href": "https://developers.google.com/search/docs/crawling-indexing/block-indexing", "target": "_blank", "rel": "noopener noreferrer", "className": "framer-styles-preset-1k8uo92"}, [5, "Google's noindex guidance"]],
        [5, "."]
    ],
    [4, "p", None,
        [5, "If listing details load only after a script runs, test the rendered page—not just the source file. Google processes JavaScript pages through crawling, rendering and indexing phases, and some content can be missed when scripts, APIs or resources fail. Review "],
        [4, "a", {"href": "https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics", "target": "_blank", "rel": "noopener noreferrer", "className": "framer-styles-preset-1k8uo92"}, [5, "Google's JavaScript SEO guide"]],
        [5, "."]
    ],
    [4, "p", None, [5, "Check for:"]],
    [4, "ul", {"style": {"margin": "24px 0", "paddingLeft": "24px", "lineHeight": "1.8em"}},
        [4, "li", None,
            [4, "code", {"style": {"fontFamily": "monospace", "backgroundColor": "rgba(0, 0, 0, 0.05)", "padding": "2px 5px", "borderRadius": "4px", "fontSize": "0.9em"}}, [5, "200 OK"]],
            [5, " responses for live listings;"]
        ],
        [4, "li", None,
            [5, "accidental "],
            [4, "code", {"style": {"fontFamily": "monospace", "backgroundColor": "rgba(0, 0, 0, 0.05)", "padding": "2px 5px", "borderRadius": "4px", "fontSize": "0.9em"}}, [5, "noindex"]],
            [5, " tags on listing templates;"]
        ],
        [4, "li", None, [5, "blocked JavaScript, CSS or data endpoints;"]],
        [4, "li", None, [5, "consent walls or login screens hiding the main listing information;"]],
        [4, "li", None, [5, "server errors or slow third-party listing feeds."]]
    ],
    [4, "h2", None, [5, "3. Fix canonical URLs and duplicate listing variations"]],
    [4, "p", None, [5, "IDX systems commonly create many URLs for sorting, filtering, pagination and tracking. For example, the same listing could be reachable through several neighbourhood filters or a query string. Those variations may not deserve separate indexable pages."]],
    [4, "p", None,
        [5, "Choose a stable canonical URL for the main property detail page. Keep internal links consistent, use canonical tags where appropriate and avoid submitting disposable filter URLs as if each were a unique destination. Google's canonicalization guidance explains how it chooses a representative URL from similar pages: "],
        [4, "a", {"href": "https://developers.google.com/search/docs/crawling-indexing/canonicalization", "target": "_blank", "rel": "noopener noreferrer", "className": "framer-styles-preset-1k8uo92"}, [5, "Canonicalization"]],
        [5, "."]
    ],
    [4, "p", None, [5, "Do not automatically canonicalize every property page to the home page. Each genuinely unique property detail page needs a sensible canonical strategy, while duplicate variations should consolidate appropriately."]],
    [4, "h2", None, [5, "4. Give important pages useful context"]],
    [4, "p", None, [5, "A feed often supplies factual fields—address, price, bedrooms and a description—but multiple sites may publish near-identical information. Do not rewrite the same supplied description with superficial word swaps. Add genuinely useful, verified context where permitted: neighbourhood information, property features explained clearly, travel or amenity details that can be supported, the agent's role, viewing instructions and a transparent way to ask a question."]],
    [4, "p", None,
        [5, "Do not invent features, distances, school ratings or availability. Follow MLS/IDX rules regarding what can be changed, displayed or retained. The National Association of REALTORS® describes IDX as a limited electronic display policy; the applicable MLS rules and agreements govern the actual implementation: "],
        [4, "a", {"href": "https://www.nar.realtor/about-nar/policies/internet-data-exchange-idx", "target": "_blank", "rel": "noopener noreferrer", "className": "framer-styles-preset-1k8uo92"}, [5, "NAR IDX policy"]],
        [5, "."]
    ],
    [4, "h2", None, [5, "5. Make the sitemap useful, not huge for its own sake"]],
    [4, "p", None,
        [5, "Include canonical, indexable URLs that you actually want search engines to discover. Exclude private, expired, duplicate or low-value URLs when your policy calls for that exclusion. Keep "],
        [4, "code", {"style": {"fontFamily": "monospace", "backgroundColor": "rgba(0, 0, 0, 0.05)", "padding": "2px 5px", "borderRadius": "4px", "fontSize": "0.9em"}}, [5, "lastmod"]],
        [5, " values honest. Submit the sitemap through Search Console, then review processing errors and indexing reports. A sitemap is a hint, not a guarantee that every URL will be indexed: "],
        [4, "a", {"href": "https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap", "target": "_blank", "rel": "noopener noreferrer", "className": "framer-styles-preset-1k8uo92"}, [5, "Google sitemap guidance"]],
        [5, "."]
    ],
    [4, "h2", None, [5, "6. Handle sold, rented and expired inventory deliberately"]],
    [4, "p", None, [5, "Do not send every expired URL to the homepage. Depending on the business and the value of the page, you may keep a useful sold-property page with accurate status, redirect it to a genuinely equivalent replacement, or return an appropriate not-found response. Remove outdated calls to action and keep the status visible. Follow listing-data retention terms before displaying historical information."]],
    [4, "h2", None, [5, "7. Measure the right outcome"]],
    [4, "p", None, [5, "Track indexed important URLs, Search Console impressions and clicks, organic landing-page visits, enquiry rate and listing freshness. Segment detail pages from search-result pages: they have different purposes. If pages are indexed but receive no impressions, investigate query relevance, content uniqueness and competition rather than repeatedly requesting indexing."]],
    [4, "h3", None, [5, "Practical order of operations"]],
    [4, "ol", {"style": {"margin": "24px 0", "paddingLeft": "24px", "lineHeight": "1.8em"}},
        [4, "li", None, [5, "Inspect five to ten representative missing URLs."]],
        [4, "li", None,
            [5, "Fix access, rendering, "],
            [4, "code", {"style": {"fontFamily": "monospace", "backgroundColor": "rgba(0, 0, 0, 0.05)", "padding": "2px 5px", "borderRadius": "4px", "fontSize": "0.9em"}}, [5, "noindex"]],
            [5, " and canonical errors first."]
        ],
        [4, "li", None, [5, "Verify the template exposes the main property facts in rendered HTML."]],
        [4, "li", None, [5, "Clean sitemap and internal links."]],
        [4, "li", None, [5, "Add original local context without violating MLS or data agreements."]],
        [4, "li", None, [5, "Request indexing for a small set of corrected URLs and monitor results over time."]]
    ],
    [4, "p", None,
        [4, "strong", None, [5, "Bottom line:"]],
        [5, " IDX does not guarantee search visibility. Technical access, sensible URL handling, useful page content and compliant listing data all matter."]
    ],
    [4, "h3", None, [5, "FAQs"]],
    [4, "p", None,
        [4, "strong", None, [5, "Does Google index every IDX listing automatically?"]],
        [5, " No. Discovery, crawlability and usefulness do not guarantee indexing. Check individual URLs in Search Console."]
    ],
    [4, "p", None,
        [4, "strong", None, [5, "Should I index every IDX search filter?"]],
        [5, " Usually not by default. Index only filter pages with a stable purpose and distinct value; control endless combinations and duplicate URLs."]
    ],
    [4, "p", None,
        [4, "strong", None, [5, "Will adding schema make all listings rank?"]],
        [5, " No. Structured data can clarify page meaning but does not guarantee indexing, rankings or rich results."]
    ],
    [4, "p", None,
        [4, "strong", None, [5, "Can I rewrite MLS descriptions for SEO?"]],
        [5, " Only within the rights and rules of your MLS/data agreement. Add original context where allowed; do not invent property facts."]
    ],
    [4, "h3", None, [5, "Internal links"]],
    [4, "ul", {"style": {"margin": "24px 0", "paddingLeft": "24px", "lineHeight": "1.8em"}},
        [4, "li", None,
            [5, "Existing: "],
            [4, "a", {"href": "https://corabin.com/", "className": "framer-styles-preset-1k8uo92"}, [5, "Corabin home"]],
            [5, ", "],
            [4, "a", {"href": "https://corabin.com/projects", "className": "framer-styles-preset-1k8uo92"}, [5, "Projects"]],
            [5, ", "],
            [4, "a", {"href": "https://corabin.com/contact", "className": "framer-styles-preset-1k8uo92"}, [5, "Contact"]],
            [5, "."]
        ],
        [4, "li", None,
            [5, "Planned related posts: schema markup; Next.js rendering and indexing; page speed."]
        ]
    ],
    [4, "h3", None, [5, "Sources and further reading"]],
    [4, "ul", {"style": {"margin": "24px 0", "paddingLeft": "24px", "lineHeight": "1.8em"}},
        [4, "li", None,
            [4, "a", {"href": "https://www.nar.realtor/about-nar/policies/internet-data-exchange-idx", "target": "_blank", "rel": "noopener noreferrer", "className": "framer-styles-preset-1k8uo92"}, [5, "NAR: IDX policy"]]
        ],
        [4, "li", None,
            [4, "a", {"href": "https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics", "target": "_blank", "rel": "noopener noreferrer", "className": "framer-styles-preset-1k8uo92"}, [5, "Google: JavaScript SEO basics"]]
        ],
        [4, "li", None,
            [4, "a", {"href": "https://developers.google.com/search/docs/crawling-indexing/canonicalization", "target": "_blank", "rel": "noopener noreferrer", "className": "framer-styles-preset-1k8uo92"}, [5, "Google: URL canonicalization"]]
        ],
        [4, "li", None,
            [4, "a", {"href": "https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap", "target": "_blank", "rel": "noopener noreferrer", "className": "framer-styles-preset-1k8uo92"}, [5, "Google: build and submit a sitemap"]]
        ],
        [4, "li", None,
            [4, "a", {"href": "https://search.google.com/search-console/about", "target": "_blank", "rel": "noopener noreferrer", "className": "framer-styles-preset-1k8uo92"}, [5, "Google Search Console"]]
        ]
    ],
    [4, "p", None,
        [4, "strong", None, [5, "CTA:"]],
        [5, " If your listing pages are available to visitors but difficult for search engines to understand, "],
        [4, "a", {"href": "https://corabin.com/contact/", "className": "framer-styles-preset-1k8uo92"}, [5, "contact Corabin"]],
        [5, " to discuss a technical review of the templates, URLs and lead path."]
    ]
]

ARTICLE_ID = "X2k7Lp9vM"
PREV_ARTICLE_ID = "B7k9Re2wQ"
SLUG = "idx-listings-not-showing-google"
TITLE = "Why Your IDX Listings Aren't Showing Up on Google (and How to Fix It)"
DESCRIPTION = "Find out why IDX listing pages may not appear in Google and follow a practical checklist for crawl access, rendering, canonical URLs, thin content and indexing."
ALT_TEXT = "Real estate IDX dashboard beside a Google Search Console URL inspection screen."
PUB_DATE_ISO = "2026-10-13T00:00:00.000Z"
PUB_DATE_Z = "2026-10-13T00:00:00Z"
PUB_DATE_SHORT = "2026-10-13"

new_record = {
    "id": {
        "type": "string",
        "value": ARTICLE_ID
    },
    "previousItemId": {
        "type": "string",
        "value": PREV_ARTICLE_ID
    },
    "rxkeCE0l_": {
        "type": "string",
        "value": TITLE
    },
    "OjAlyiakl": {
        "type": "string",
        "value": SLUG
    },
    "eViimYxMt": {
        "type": "date",
        "value": PUB_DATE_ISO
    },
    "DYldC4ELI": {
        "type": "responsiveimage",
        "value": {
            "src": "/assets/images/blogs/blog12.webp",
            "srcSet": "/assets/images/blogs/blog12.png 512w, /assets/images/blogs/blog12.png 1024w, /assets/images/blogs/blog12.webp 1672w",
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
        "value": DESCRIPTION
    },
    "qf1cbKeUW": {
        "type": "richtext",
        "value": json.dumps(ast, ensure_ascii=False)
    }
}

print("1. Updating tools/updated_blog_records.json...")
records_path = os.path.join(BASE_DIR, 'tools/updated_blog_records.json')
with open(records_path, 'r', encoding='utf-8') as f:
    records = json.load(f)

# Ensure 11th record points to ARTICLE_ID
for r in records:
    if r["id"]["value"] == PREV_ARTICLE_ID:
        r["nextItemId"] = {
            "type": "string",
            "value": ARTICLE_ID
        }

# Avoid duplicate append
if not any(r["id"]["value"] == ARTICLE_ID for r in records):
    records.append(new_record)

with open(records_path, 'w', encoding='utf-8') as f:
    json.dump(records, f, indent=2, ensure_ascii=False)
print(f"tools/updated_blog_records.json updated with {len(records)} records!")

# 2. Update l0aFVHEAD.Du2GMRYI.mjs in public
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
    old_s_pattern = f'"{PREV_ARTICLE_ID}":"real-estate-agent-website-cost-2026"}}'
    new_s_pattern = f'"{PREV_ARTICLE_ID}":"real-estate-agent-website-cost-2026","{ARTICLE_ID}":"{SLUG}"}}'
    if old_s_pattern in content:
        content = content.replace(old_s_pattern, new_s_pattern, 1)

    old_m_pattern = f'"real-estate-agent-website-cost-2026":"{PREV_ARTICLE_ID}"}}'
    new_m_pattern = f'"real-estate-agent-website-cost-2026":"{PREV_ARTICLE_ID}","{SLUG}":"{ARTICLE_ID}"}}'
    if old_m_pattern in content:
        content = content.replace(old_m_pattern, new_m_pattern, 1)

    with open(cfile, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Saved {cfile} successfully!")

# 3. Generate detail route
dest_rel = f'public/blog/{SLUG}/index.html'
src_rel = 'public/blog/real-estate-agent-website-cost-2026/index.html'

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
    f'<title>{TITLE} — Corabin</title>',
    html
)
# Meta description
html = re.sub(
    r'<meta name="description" content=".*?">',
    f'<meta name="description" content="{DESCRIPTION}">',
    html
)
# Canonical URL
html = re.sub(
    r'<link rel="canonical" href="https://corabin.com/blog/.*?">',
    f'<link rel="canonical" href="https://corabin.com/blog/{SLUG}">',
    html
)
# OG URL
html = re.sub(
    r'<meta property="og:url" content="https://corabin.com/blog/.*?">',
    f'<meta property="og:url" content="https://corabin.com/blog/{SLUG}">',
    html
)
# OG Title
html = re.sub(
    r'<meta property="og:title" content=".*?">',
    f'<meta property="og:title" content="{TITLE} — Corabin">',
    html
)
# OG Description
html = re.sub(
    r'<meta property="og:description" content=".*?">',
    f'<meta property="og:description" content="{DESCRIPTION}">',
    html
)
# OG Image
html = re.sub(
    r'<meta property="og:image" content="https://corabin.com/assets/images/blogs/blog\d+\.webp">',
    '<meta property="og:image" content="https://corabin.com/assets/images/blogs/blog12.webp">',
    html
)
# OG Image alt
html = re.sub(
    r'<meta property="og:image:alt" content=".*?">',
    f'<meta property="og:image:alt" content="{ALT_TEXT}">',
    html
)
# Twitter Title
html = re.sub(
    r'<meta name="twitter:title" content=".*?">',
    f'<meta name="twitter:title" content="{TITLE} — Corabin">',
    html
)
# Twitter Description
html = re.sub(
    r'<meta name="twitter:description" content=".*?">',
    f'<meta name="twitter:description" content="{DESCRIPTION}">',
    html
)
# Twitter Image
html = re.sub(
    r'<meta name="twitter:image" content="https://corabin.com/assets/images/blogs/blog\d+\.webp">',
    '<meta property="twitter:image" content="https://corabin.com/assets/images/blogs/blog12.webp">',
    html
)
# Fix potential name vs property for twitter:image
html = re.sub(
    r'<meta (?:name|property)="twitter:image" content="https://corabin.com/assets/images/blogs/blog\d+\.webp">',
    '<meta name="twitter:image" content="https://corabin.com/assets/images/blogs/blog12.webp">',
    html
)
# Twitter Image alt
html = re.sub(
    r'<meta name="twitter:image:alt" content=".*?">',
    f'<meta name="twitter:image:alt" content="{ALT_TEXT}">',
    html
)

# JSON-LD Article
old_article_snippet_pattern = r'\{\s*"@context":\s*"https://schema\.org",\s*"@type":\s*"Article",.*?"mainEntityOfPage":\s*\{\s*"@type":\s*"WebPage",\s*"@id":\s*"https://corabin\.com/blog/.*?"\s*\}\s*\}'
new_article_snippet = f'''{{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "{TITLE}",
  "description": "{DESCRIPTION}",
  "url": "https://corabin.com/blog/{SLUG}",
  "datePublished": "{PUB_DATE_Z}",
  "dateModified": "{PUB_DATE_Z}",
  "author": {{
    "@type": "Person",
    "name": "Souvik",
    "url": "https://corabin.com"
  }},
  "publisher": {{
    "@type": "Organization",
    "name": "Corabin",
    "logo": {{
      "@type": "ImageObject",
      "url": "https://corabin.com/assets/images/Corabin_logo.webp"
    }}
  }},
  "image": "https://corabin.com/assets/images/blogs/blog12.webp",
  "mainEntityOfPage": {{
    "@type": "WebPage",
    "@id": "https://corabin.com/blog/{SLUG}"
  }}
}}'''
html = re.sub(old_article_snippet_pattern, new_article_snippet, html, flags=re.DOTALL)

# JSON-LD Breadcrumb
old_breadcrumb_pattern = r'\{\s*"@type":\s*"ListItem",\s*"position":\s*3,\s*"name":\s*".*?",\s*"item":\s*"https://corabin\.com/blog/.*?"\s*\}'
new_breadcrumb = f'''{{
      "@type": "ListItem",
      "position": 3,
      "name": "{TITLE}",
      "item": "https://corabin.com/blog/{SLUG}"
    }}'''
html = re.sub(old_breadcrumb_pattern, new_breadcrumb, html)

# data-framer-hydrate-v2
# Replace pathVariables and collectionItemId
hydrate_match = re.search(r'data-framer-hydrate-v2="([^"]+)"', html)
assert hydrate_match, "data-framer-hydrate-v2 not found in " + src_path
hydrate_raw = hydrate_match.group(1).replace('&quot;', '"')
hydrate_data = json.loads(hydrate_raw)
hydrate_data["pathVariables"] = {"OjAlyiakl": SLUG}
hydrate_data["collectionItemId"] = ARTICLE_ID
new_hydrate_str = json.dumps(hydrate_data).replace('"', '&quot;')
html = html[:hydrate_match.start(1)] + new_hydrate_str + html[hydrate_match.end(1):]

with open(dest_path, 'w', encoding='utf-8') as f:
    f.write(html)
print(f"Generated {dest_path} successfully!")

# 4. Update Sitemap in public
sitemap_file = os.path.join(BASE_DIR, 'public/sitemap.xml')
canonical_url = f'https://corabin.com/blog/{SLUG}'

print(f"Updating {sitemap_file}...")
with open(sitemap_file, 'r', encoding='utf-8') as f:
    scontent = f.read()

new_sitemap_entry = f'''
  <url>
    <loc>{canonical_url}</loc>
    <lastmod>{PUB_DATE_SHORT}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>'''

if canonical_url not in scontent:
    scontent = scontent.replace('</urlset>', new_sitemap_entry.strip())
    with open(sitemap_file, 'w', encoding='utf-8') as f:
        f.write(scontent + '\n')
    print(f"Added {canonical_url} to {sitemap_file}")
else:
    print(f"{canonical_url} already present in {sitemap_file}")

print("\n🎉 Publication pipeline for Blog 12 completed successfully!")
