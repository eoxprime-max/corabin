#!/usr/bin/env python3
"""
clean_template_fingerprints.py — Production Brand Engineering & Fingerprint Elimination
Preserves 100% of the visual layout, typography, colors, animations, and responsive system.
Eliminates template residuals: Vectura FAQ, fake testimonial identities, template avatars,
stale pricing attributes, social URLs/typos, form validation, and decorative accessibility tags.
"""

import os
import re

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

def update_file(path, replacements):
    full_path = os.path.join(BASE_DIR, path)
    if not os.path.exists(full_path):
        print(f"[SKIP] File not found: {path}")
        return
    with open(full_path, 'r', encoding='utf-8') as f:
        content = f.read()
    orig = content
    for old, new in replacements:
        if old in content:
            content = content.replace(old, new)
        else:
            # Try regex if provided as compiled pattern
            pass
    if content != orig:
        with open(full_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"[OK] Updated {path}")
    else:
        print(f"[NOOP] No changes needed in {path}")

def update_js_runtime():
    print("\n--- Updating JS Runtime Modules ---")
    
    # 1. FAQ: ARhvNzuJf modules
    faq_replacements = [
        ("Vectura supports imports of vendor data, team budgets, historical expenses, and departmental codes. You can also connect directly to your ERP or finance tools to sync this data automatically. Our team is available to assist with imports during onboarding.",
         "Our engineering process follows four structured phases: Discovery & Architecture, Systems Design, Full-Stack Implementation, and Rigorous QA & Launch. We collaborate closely through sprints with transparent milestones and code reviews."),
        ("tailored to unique business challanges.", "tailored to unique business challenges."),
        ("unique business challanges", "unique business challenges")
    ]
    update_file('framerusercontent.com/sites/46CYIm3dbxFoU3f63shpCX/ARhvNzuJf.Bc2RUKEP.mjs', faq_replacements)
    update_file('framerusercontent.com/sites/46CYIm3dbxFoU3f63shpCX/https/framerusercontent.com/modules/kjXRxRhZ2zUXjZlyQoPK/vKGfzfTUhFjlTjh6IKop/ARhvNzuJf.js', faq_replacements)

    # 2. TestimonialSlider canvas component: V2tVaJMnZ.js
    v2_replacements = [
        ('"Founder @ Terrain Coffee"', '"Enterprise Revenue Architecture"'),
        ('"COO @ Stellar Analytics"', '"Intelligent Logistics Platform"'),
        ('"Director @ Greenwave Solar"', '"Architecture Studio Platform"'),
        ('"Tom Bennett"', '"Kora"'),
        ('"Sarah Chen"', '"Himon"'),
        ('"Marcus Rodriguez"', '"Nordå"'),
        ("https://framerusercontent.com/images/d8xBroOAXEENKrUrrZk0Y0XLuhE.png", "/assets/images/projects/kora/img1.webp"),
        ("https://framerusercontent.com/images/CbuRnkePiOKQIv4qrnpK4ikxio.jpg", "/assets/images/projects/himon/img1.webp"),
        ("https://framerusercontent.com/images/pVkIzXwfVUeaGFFY4CaQBJJdXhE.jpg", "/assets/images/projects/norda/img1.webp"),
    ]
    update_file('framerusercontent.com/sites/46CYIm3dbxFoU3f63shpCX/https/framerusercontent.com/modules/80Qehajk8nMjcjBrGo0c/bJ5qieOgDDb65HayPTwR/V2tVaJMnZ.js', v2_replacements)

    # 3. Home page component: augiA20Il.js
    augi_replacements = [
        ('"Founder @ Terrain Coffee"', '"Enterprise Revenue Architecture"'),
        ('"COO @ Stellar Analytics"', '"Intelligent Logistics Platform"'),
        ('"Director @ Greenwave Solar"', '"Architecture Studio Platform"'),
        ('"Tom Bennett"', '"Kora"'),
        ('"Sarah Chen"', '"Himon"'),
        ('"Marcus Rodriguez"', '"Nordå"'),
        ("https://framerusercontent.com/images/d8xBroOAXEENKrUrrZk0Y0XLuhE.png", "/assets/images/projects/kora/img1.webp"),
        ("https://framerusercontent.com/images/CbuRnkePiOKQIv4qrnpK4ikxio.jpg", "/assets/images/projects/himon/img1.webp"),
        ("https://framerusercontent.com/images/pVkIzXwfVUeaGFFY4CaQBJJdXhE.jpg", "/assets/images/projects/norda/img1.webp"),
    ]
    update_file('framerusercontent.com/sites/46CYIm3dbxFoU3f63shpCX/https/framerusercontent.com/modules/5ClbloOPINMGWdjJrcrC/8di8dsBRxVbof9tpvgwT/augiA20Il.js', augi_replacements)

    # 4. Compiled Home page bundle: iKJRSh9jmrbmilHdac6ozhPaiCytW8lQqaCPLmlLitI.Z1Wyg5E1.mjs
    z1_replacements = [
        ('`Founder @ Terrain Coffee`', '`Enterprise Revenue Architecture`'),
        ('`COO @ Stellar Analytics`', '`Intelligent Logistics Platform`'),
        ('`Director @ Greenwave Solar`', '`Architecture Studio Platform`'),
        ('`Tom Bennett`', '`Kora`'),
        ('`Sarah Chen`', '`Himon`'),
        ('`Marcus Rodriguez`', '`Nordå`'),
        ("https://framerusercontent.com/images/d8xBroOAXEENKrUrrZk0Y0XLuhE.png", "/assets/images/projects/kora/img1.webp"),
        ("https://framerusercontent.com/images/CbuRnkePiOKQIv4qrnpK4ikxio.jpg", "/assets/images/projects/himon/img1.webp"),
        ("https://framerusercontent.com/images/pVkIzXwfVUeaGFFY4CaQBJJdXhE.jpg", "/assets/images/projects/norda/img1.webp"),
    ]
    update_file('framerusercontent.com/sites/46CYIm3dbxFoU3f63shpCX/iKJRSh9jmrbmilHdac6ozhPaiCytW8lQqaCPLmlLitI.Z1Wyg5E1.mjs', z1_replacements)

    # 5. Contact page component: TQtrT4cVD.js (Email input required: true)
    tq_path = 'framerusercontent.com/sites/46CYIm3dbxFoU3f63shpCX/https/framerusercontent.com/modules/VM6LshqF3kGfk3qxJUTi/2SWjHeF37NxXG6KxhVeu/TQtrT4cVD.js'
    full_tq = os.path.join(BASE_DIR, tq_path)
    if os.path.exists(full_tq):
        with open(full_tq, 'r', encoding='utf-8') as f:
            tq_code = f.read()
        target_input = 'inputName: "Email",\n                                                    placeholder: "E-mail *",\n                                                    type: "email"'
        replacement_input = 'inputName: "Email",\n                                                    placeholder: "E-mail *",\n                                                    required: true,\n                                                    type: "email"'
        if target_input in tq_code:
            tq_code = tq_code.replace(target_input, replacement_input)
            with open(full_tq, 'w', encoding='utf-8') as f:
                f.write(tq_code)
            print(f"[OK] Added required: true to Email in {tq_path}")
        else:
            print(f"[INFO] Email required check in {tq_path}: already set or pattern changed")

    # 6. Footer in script_main.CNn1uaXy.mjs
    sm_replacements = [
        ('href:`www.facebook.com`', 'href:`https://www.linkedin.com/company/corabin`'),
        ('href:`www.instagram.com`', 'href:`https://www.instagram.com/corabin.studio`'),
        ('href:`www.dribbble.com`', 'href:`https://dribbble.com/corabin`'),
        ('href:`www.behance.net`', 'href:`https://www.behance.net/corabin`'),
        ('children:`Facebook`', 'children:`LinkedIn`'),
        ('children:`Dribble`', 'children:`Dribbble`'),
    ]
    update_file('framerusercontent.com/sites/46CYIm3dbxFoU3f63shpCX/script_main.CNn1uaXy.mjs', sm_replacements)

def update_html_files():
    print("\n--- Updating HTML Documents ---")
    
    html_files = []
    for root, dirs, files in os.walk(BASE_DIR):
        # Exclude tools source cache or .git
        if '.git' in root or 'tools/source-images' in root or 'node_modules' in root:
            continue
        for file in files:
            if file.endswith('.html'):
                html_files.append(os.path.join(root, file))

    print(f"Found {len(html_files)} HTML files to audit and update.")

    vectura_regex = re.compile(
        r'Vectura supports imports of vendor data, team budgets, historical expenses, and departmental codes\.[\s\S]*?available to assist with imports during onboarding\.',
        re.MULTILINE
    )

    vectura_replacement = (
        "Our engineering process follows four structured phases: Discovery & Architecture, "
        "Systems Design, Full-Stack Implementation, and Rigorous QA & Launch. "
        "We collaborate closely through sprints with transparent milestones and code reviews."
    )

    for filepath in html_files:
        rel = os.path.relpath(filepath, BASE_DIR)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        orig = content

        # 1. Vectura FAQ replacement
        if vectura_regex.search(content):
            content = vectura_regex.sub(vectura_replacement, content)

        # 2. Typos
        content = content.replace('business challanges', 'business challenges')
        content = content.replace('business challange', 'business challenge')

        # 3. Testimonials: Names and Titles
        content = content.replace('>Tom Bennett<', '>Kora<')
        content = content.replace('>Founder @ Terrain Coffee<', '>Enterprise Revenue Architecture<')
        content = content.replace('data-framer-name="Founder @ Terrain Coffee"', 'data-framer-name="Enterprise Revenue Architecture"')
        content = content.replace('data-framer-name="Tom Bennett"', 'data-framer-name="Kora"')

        content = content.replace('>Sarah Chen<', '>Himon<')
        content = content.replace('>COO @ Stellar Analytics<', '>Intelligent Logistics Platform<')
        content = content.replace('data-framer-name="COO @ Stellar Analytics"', 'data-framer-name="Intelligent Logistics Platform"')
        content = content.replace('data-framer-name="Sarah Chen"', 'data-framer-name="Himon"')

        content = content.replace('>Marcus Rodriguez<', '>Nordå<')
        content = content.replace('>Director @ Greenwave Solar<', '>Architecture Studio Platform<')
        content = content.replace('data-framer-name="Director @ Greenwave Solar"', 'data-framer-name="Architecture Studio Platform"')
        content = content.replace('data-framer-name="Marcus Rodriguez"', 'data-framer-name="Nordå"')

        # 4. Testimonials: Photo assets
        content = content.replace(
            'https://framerusercontent.com/images/d8xBroOAXEENKrUrrZk0Y0XLuhE.png?scale-down-to=512&amp;width=1024&amp;height=1024 512w,https://framerusercontent.com/images/d8xBroOAXEENKrUrrZk0Y0XLuhE.png?width=1024&amp;height=1024 1024w',
            '/assets/images/projects/kora/img1.webp 512w,/assets/images/projects/kora/img1.webp 1024w'
        )
        content = content.replace(
            'src="https://framerusercontent.com/images/d8xBroOAXEENKrUrrZk0Y0XLuhE.png?width=1024&amp;height=1024" alt',
            'src="/assets/images/projects/kora/img1.webp" alt="Kora enterprise revenue architecture"'
        )
        content = content.replace(
            'https://framerusercontent.com/images/d8xBroOAXEENKrUrrZk0Y0XLuhE.png',
            '/assets/images/projects/kora/img1.webp'
        )

        content = content.replace(
            'https://framerusercontent.com/images/CbuRnkePiOKQIv4qrnpK4ikxio.jpg?scale-down-to=1024&amp;width=1903&amp;height=2855 682w,https://framerusercontent.com/images/CbuRnkePiOKQIv4qrnpK4ikxio.jpg?scale-down-to=2048&amp;width=1903&amp;height=2855 1365w,https://framerusercontent.com/images/CbuRnkePiOKQIv4qrnpK4ikxio.jpg?width=1903&amp;height=2855 1903w',
            '/assets/images/projects/himon/img1.webp 682w,/assets/images/projects/himon/img1.webp 1200w'
        )
        content = content.replace(
            'src="https://framerusercontent.com/images/CbuRnkePiOKQIv4qrnpK4ikxio.jpg?width=1903&amp;height=2855" alt',
            'src="/assets/images/projects/himon/img1.webp" alt="Himon intelligent logistics platform"'
        )
        content = content.replace(
            'https://framerusercontent.com/images/CbuRnkePiOKQIv4qrnpK4ikxio.jpg',
            '/assets/images/projects/himon/img1.webp'
        )

        content = content.replace(
            'https://framerusercontent.com/images/pVkIzXwfVUeaGFFY4CaQBJJdXhE.jpg?scale-down-to=512&amp;width=5184&amp;height=3456 512w,https://framerusercontent.com/images/pVkIzXwfVUeaGFFY4CaQBJJdXhE.jpg?scale-down-to=1024&amp;width=5184&amp;height=3456 1024w,https://framerusercontent.com/images/pVkIzXwfVUeaGFFY4CaQBJJdXhE.jpg?scale-down-to=2048&amp;width=5184&amp;height=3456 2048w,https://framerusercontent.com/images/pVkIzXwfVUeaGFFY4CaQBJJdXhE.jpg?scale-down-to=4096&amp;width=5184&amp;height=3456 4096w,https://framerusercontent.com/images/pVkIzXwfVUeaGFFY4CaQBJJdXhE.jpg?width=5184&amp;height=3456 5184w',
            '/assets/images/projects/norda/img1.webp 512w,/assets/images/projects/norda/img1.webp 1200w'
        )
        content = content.replace(
            'src="https://framerusercontent.com/images/pVkIzXwfVUeaGFFY4CaQBJJdXhE.jpg?width=5184&amp;height=3456" alt',
            'src="/assets/images/projects/norda/img1.webp" alt="Nordå Scandinavian architecture studio"'
        )
        content = content.replace(
            'https://framerusercontent.com/images/pVkIzXwfVUeaGFFY4CaQBJJdXhE.jpg',
            '/assets/images/projects/norda/img1.webp'
        )

        # 5. Team photo alt description
        content = content.replace('alt="Two women laughing at work"', 'alt="Corabin digital studio team collaborating on web architecture"')

        # 6. Parallax photo banner alt description
        content = content.replace(
            'src="https://framerusercontent.com/images/cxS3pdE2Am67jSPeaOJc4e6co.jpg?width=2500&amp;height=1667" alt style=',
            'src="https://framerusercontent.com/images/cxS3pdE2Am67jSPeaOJc4e6co.jpg?width=2500&amp;height=1667" alt="Digital product design and modern engineering at Corabin studio" style='
        )

        # 7. Pricing attribute cleanup
        content = content.replace(
            'data-framer-name="Start growing today"',
            'data-framer-name="Our perspectives"'
        )
        content = content.replace(
            'data-framer-name="Choose a plan that fits your needs. Get access to our team of designers and developers ready to help you grow."',
            'data-framer-name="Stay ahead with actionable insights, expert advice, and practical strategies for digital success."'
        )

        # 8. Social Links
        content = content.replace(
            'href="https://www.facebook.com" target="_blank" rel="noopener">Facebook</a>',
            'href="https://www.linkedin.com/company/corabin" target="_blank" rel="noopener">LinkedIn</a>'
        )
        content = content.replace('data-framer-name="Facebook"', 'data-framer-name="LinkedIn"')
        content = content.replace(
            'href="https://www.instagram.com" target="_blank" rel="noopener">Instagram</a>',
            'href="https://www.instagram.com/corabin.studio" target="_blank" rel="noopener">Instagram</a>'
        )
        content = content.replace(
            'href="https://www.dribbble.com" target="_blank" rel="noopener">Dribble</a>',
            'href="https://dribbble.com/corabin" target="_blank" rel="noopener">Dribbble</a>'
        )
        content = content.replace(
            'href="https://www.dribbble.com" target="_blank" rel="noopener">Dribbble</a>',
            'href="https://dribbble.com/corabin" target="_blank" rel="noopener">Dribbble</a>'
        )
        content = content.replace('data-framer-name="Dribble"', 'data-framer-name="Dribbble"')
        content = content.replace(
            'href="https://www.behance.net" target="_blank" rel="noopener">Behance</a>',
            'href="https://www.behance.net/corabin" target="_blank" rel="noopener">Behance</a>'
        )

        # 9. Generic alt="icon" on decorative SVGs/icons
        content = content.replace('alt="icon"', 'alt="" aria-hidden="true"')

        # 10. Empty links or logo wrappers
        content = content.replace('<a class="framer-1a3b5ce"', '<a aria-label="Corabin Home" class="framer-1a3b5ce"')

        if content != orig:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"[OK] Updated HTML: {rel}")

if __name__ == '__main__':
    update_js_runtime()
    update_html_files()
    print("\nTemplate fingerprints successfully sanitized across runtime and markup!")
