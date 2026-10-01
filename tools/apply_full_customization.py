import os
import re

BASE_DIR = "/home/souvik/Projects/opus_template.framer.website"
SITE_DIR = os.path.join(BASE_DIR, "framerusercontent.com/sites/46CYIm3dbxFoU3f63shpCX")

print("Executing Complete Corabin Customization...")

# =========================================================================
# 1. script_main.CNn1uaXy.mjs (Main Routing, Header & Footer)
# =========================================================================
script_main_path = os.path.join(SITE_DIR, "script_main.CNn1uaXy.mjs")
with open(script_main_path, "r", encoding="utf-8") as f:
    sm = f.read()

# 1.1 Remove badge hydration
sm = re.sub(
    r'\(function\(\)\{Di&&C\(\(\)=>\{ne\(document\.getElementById\(`__framer-badge-container`\)[\s\S]*?import\(`\./PX9hIOIVM\.Dl3LQnTP\.mjs`\)\)\)\)\)\}\)\(\)',
    '(function(){/* framer badge removed */})()',
    sm
)

# 1.2 Neuter telemetry events push
sm = sm.replace("t.__framer_events.push([`published_site_pageview`", "/* disabled_telemetry */ (()=>{})([`published_site_pageview`")

# 1.3 Update canonical URL
sm = sm.replace("siteCanonicalURL:`https://opus-template.framer.website`", "siteCanonicalURL:`https://corabin.com`")

# 1.4 Footer Brand & Text replacements
sm = sm.replace('children:`OPUS `', 'children:`CORABIN `')
sm = sm.replace('"data-framer-name":`OPUS`', '"data-framer-name":`CORABIN`')
sm = sm.replace('mailto: contact@opushq.com', 'mailto:hello@corabin.com')
sm = sm.replace('children:`contact@opushq.com`', 'children:`hello@corabin.com`')
sm = sm.replace('"data-framer-name":`contact@opushq.com`', '"data-framer-name":`hello@corabin.com`')
sm = sm.replace('children:`@2026 Opus, All Rights Reserved`', 'children:`@2026 Corabin, All Rights Reserved`')
sm = sm.replace('"data-framer-name":`@2025 Opus, All Rights Reserved`', '"data-framer-name":`@2026 Corabin, All Rights Reserved`')
sm = sm.replace('"data-framer-name":`@2026 Opus, All Rights Reserved`', '"data-framer-name":`@2026 Corabin, All Rights Reserved`')

with open(script_main_path, "w", encoding="utf-8") as f:
    f.write(sm)
print("Updated script_main.CNn1uaXy.mjs")


# =========================================================================
# 2. iKJRSh9jmrbmilHdac6ozhPaiCytW8lQqaCPLmlLitI.Z1Wyg5E1.mjs (Home Page)
# =========================================================================
home_mjs_path = os.path.join(SITE_DIR, "iKJRSh9jmrbmilHdac6ozhPaiCytW8lQqaCPLmlLitI.Z1Wyg5E1.mjs")
with open(home_mjs_path, "r", encoding="utf-8") as f:
    hm = f.read()

# 2.1 Hero title & viewBox
hm = hm.replace('viewBox:`0 0 608.4 192`', 'viewBox:`0 0 1064.7 192`')
hm = hm.replace('viewBox:`0 0 182.32 58`', 'viewBox:`0 0 319.06 58`')
hm = hm.replace('viewBox:`0 0 152.6 48`', 'viewBox:`0 0 267.05 48`')
# Replace OPUS hero text
hm = hm.replace('children:`OPUS`', 'children:`CORABIN`')

# 2.2 Hero intro text
hm = hm.replace(
    'children:`At Opus, we help companies build stronger brands, better products, and websites that actually perform.`',
    'children:`At Corabin, we help companies build stronger brands, modern products, and websites that actually perform.`'
)

# 2.3 Counters / Metrics
hm = hm.replace('duration:2,end:47,font:', 'duration:2,end:25,font:')
hm = hm.replace('duration:2,end:95,font:', 'duration:2,end:99,font:')
hm = hm.replace('duration:2,end:21,font:', 'duration:2,end:17,font:')
hm = hm.replace('children:`Client retention`', 'children:`On-time delivery`')
hm = hm.replace('"data-framer-name":`Client retention`', '"data-framer-name":`On-time delivery`')

# 2.4 Service 04
hm = hm.replace('04 Motion Graphics', '04 App Development')
hm = hm.replace(
    'We bring ideas to life through dynamic, engaging animations that communicate complex concepts with clarity, creativity, and visual storytelling.',
    'We build intuitive, scalable digital applications that combine smooth user experiences with robust performance across every modern device.'
)

# 2.5 Mid-Page CTA
hm = hm.replace(
    'Our team brings together design, development, and strategic thinking to help you grow.',
    'Corabin brings together bespoke design, modern development, and strategic thinking to help you grow.'
)

# 2.6 Studio Strengths & About
hm = hm.replace('children:`19`', 'children:`1:1`')
hm = hm.replace('"data-framer-name":`19`', '"data-framer-name":`1:1`')
hm = hm.replace("children:[`talented`,d(`br`,{}),`individuals`]", "children:[`Direct`,d(`br`,{}),`collaboration`]")
hm = hm.replace("children:[`talented `,d(`br`,{}),`individuals`]", "children:[`Direct `,d(`br`,{}),`collaboration`]")
hm = hm.replace('"data-framer-name":`talented individuals`', '"data-framer-name":`Direct collaboration`')

hm = hm.replace("children:[`134`,d(`span`,{style:{\"--framer-text-color\":`var(--token-cd9ab9a9-1d98-4bbc-9f79-c98ab7a3770b, rgb(0, 72, 249))`},children:`+`})]", "children:[`25`,d(`span`,{style:{\"--framer-text-color\":`var(--token-cd9ab9a9-1d98-4bbc-9f79-c98ab7a3770b, rgb(0, 72, 249))`},children:`+`})]")
hm = hm.replace('"data-framer-name":`134+`', '"data-framer-name":`25+`')
hm = hm.replace("children:[`projects`,d(`br`,{}),`later`]", "children:[`Projects`,d(`br`,{}),`delivered`]")
hm = hm.replace('"data-framer-name":`projects later`', '"data-framer-name":`Projects delivered`')

# Replace Infinity Icon with '5+' text representation
hm = hm.replace(
    'd(r,{children:d(J,{"data-framer-name":`Infinity Icon`',
    'd(r,{children:d(`span`,{style:{fontFamily:`"Inter Display", sans-serif`,fontSize:`72px`,fontWeight:600,color:`#fff`}},`5+`'
)
hm = hm.replace("children:[`combined `,d(`br`,{}),`experience`]", "children:[`Years `,d(`br`,{}),`experience`]")
hm = hm.replace("children:[`combined`,d(`br`,{}),`experience`]", "children:[`Years`,d(`br`,{}),`experience`]")
hm = hm.replace('"data-framer-name":`combined experience`', '"data-framer-name":`Years experience`')

# About headline & CTA
hm = hm.replace(
    'We are a group of positive thinkers, dedicated to making a difference in the digital world.',
    'We are a boutique digital studio dedicated to making a difference through intentional design.'
)
hm = hm.replace('children:`Meet the team`', 'children:`Our story`')
hm = hm.replace('"data-framer-name":`Meet the team`', '"data-framer-name":`Our story`')

# 2.7 Remove Pricing section from React render
# We locate the Pricing JSX block in home_mjs:
# d(v.div,{className:`framer-g3lz1y`,"data-framer-name":`Pricing`,id:pe,layout:k,ref:q,children:...})
pricing_block_idx = hm.find('\"data-framer-name\":`Pricing`')
if pricing_block_idx != -1:
    # Find the start of d(v.div,{className:`framer-g3lz1y`
    start_idx = hm.rfind('d(v.div,{className:`framer-g3lz1y`', 0, pricing_block_idx)
    if start_idx != -1:
        # Find matching closing bracket by parenthesis counting
        open_parens = 0
        end_idx = -1
        for i in range(start_idx, len(hm)):
            if hm[i] == '(':
                open_parens += 1
            elif hm[i] == ')':
                open_parens -= 1
                if open_parens == 0:
                    end_idx = i + 1
                    break
        if end_idx != -1:
            hm = hm[:start_idx] + "null" + hm[end_idx:]
            print("Successfully excised Pricing JSX component from Home mjs")

# 2.8 Testimonials
hm = hm.replace(
    'Finally found a team that understands both design and business. Our brand now perfectly captures what makes us different.',
    'Finally found a partner that understands both design and business. Our brand now perfectly captures what makes us different.'
)
hm = hm.replace(
    "The level of strategic thinking they brought was unexpected. They didn't just build what we asked for - they made it better.",
    "The level of strategic thinking brought to the project was exceptional. Corabin didn't just build what we asked for — they made it better."
)
hm = hm.replace(
    'Every feature they built was focused on driving results. They transformed how we think about digital.',
    'Every feature built was focused on driving results. They completely transformed how we think about our digital presence.'
)

# 2.9 FAQs
hm = hm.replace(
    'We specialize in digital solutions including website development, web applications, e-commerce platforms, and enterprise software integrations. Our expertise spans diverse industries, delivering strategic technological solutions tailored to unique business meallanges.',
    'We specialize in digital solutions including custom website development, interactive web applications, e-commerce platforms, and brand identities. We craft modern, high-performance websites tailored to your specific business goals.'
)
hm = hm.replace(
    'Project timelines range from 4-6 weeks for small websites to 16-24 weeks for complex enterprise integrations. Each project is carefully scoped to balance efficiency with comprehensive development requirements.',
    'Most custom landing pages and brand websites take 2 to 4 weeks, while larger interactive multi-page platforms take 4 to 8 weeks. Each project is carefully scoped to balance speed with high craft standards.'
)
hm = hm.replace(
    'Vectura supports imports of vendor data, team budgets, historical expenses, and departmental codes. You can also connect directly to your ERP or finance tools to sync this data automatically. Our team is available to assist with imports during onboarding.',
    'We follow a phased workflow: strategic discovery, interactive Figma UI/UX prototyping, high-performance responsive build with smooth animations, and rigorous multi-device testing before launch.'
)
hm = hm.replace(
    'We conduct comprehensive system audits to ensure seamless integration with your current technology stack and organizational workflow. Our team provides flexible collaboration models, knowledge transfer, and transparent communication to minimize disruption.',
    'We ensure seamless integration with your current tech stack, tools, and branding guidelines. You get direct, transparent collaboration and clear communication throughout the build to ensure a smooth handoff.'
)

with open(home_mjs_path, "w", encoding="utf-8") as f:
    f.write(hm)
print("Updated iKJRSh9jmrbmilHdac6ozhPaiCytW8lQqaCPLmlLitI.Z1Wyg5E1.mjs")


# =========================================================================
# 3. znfm_uW3YvFdDZ28MEdBO9z2HrI7OaPyUiz_zX9GYnw.DsWxHuen.mjs (About Us Page)
# =========================================================================
about_mjs_path = os.path.join(SITE_DIR, "znfm_uW3YvFdDZ28MEdBO9z2HrI7OaPyUiz_zX9GYnw.DsWxHuen.mjs")
with open(about_mjs_path, "r", encoding="utf-8") as f:
    ab = f.read()

# 3.1 Hero & Mission
ab = ab.replace(
    'Building digital excellence since 2019',
    'Crafting modern digital experiences that perform'
)
ab = ab.replace(
    "At OPUS, we're more than just a digital agency - we're a team of creative problem-solvers who believe in the power of thoughtful digital solutions to transform businesses.",
    "At Corabin, we are more than just a design studio, creating thoughtful design and clean code."
)

# 3.2 Studio Story
ab = ab.replace(
    'From humble beginnings to a trusted digital partner',
    'From a passion for craft to a trusted digital partner'
)
ab = ab.replace(
    "What started as a small team of three developers working from a tiny office has grown into a dynamic digital agency trusted by businesses across multiple industries. Through dedication to quality, transparent communication, and a deep understanding of our clients' needs, we've built lasting partnerships and delivered solutions that make a difference.",
    "What started as a focused pursuit of design and technical excellence has evolved into an agile digital studio trusted by ambitious brands."
)

# 3.3 Approach & Quote
ab = ab.replace(
    "When we founded OPUS, we had a simple vision - to help businesses succeed in the digital world by combining technical excellence with genuine care for our clients' success. That vision still drives everything we do today.",
    "When I founded Corabin, I had a clear vision to help businesses stand out online by combining refined visual design and robust code."
)
ab = ab.replace('frI1cQi7o:`Markus Chen`', 'frI1cQi7o:`Souvik`')
ab = ab.replace('cM9MIykpp:`CEO & Co-founder`', 'cM9MIykpp:`Founder, Corabin`')
ab = ab.replace('Markus Chen', 'Souvik')

# 3.4 Values (Value 01)
ab = ab.replace(
    "At OPUS, we foster a culture of continuous learning and innovation. Our team members are encouraged to experiment, share ideas, and push the boundaries of what's possible in digital solutions.",
    "At Corabin, continuous learning, design experimentation, and modern web standards drive every build. Every project pushes the boundaries of performance and interactivity."
)

# 3.5 CTA Headline
ab = ab.replace(
    'Help us shape the future of digital',
    'Ready to build something extraordinary?'
)

# 3.6 Remove Culture Section ("After work" / Life at Opus)
after_work_idx = ab.find('\"data-framer-name\":`After work`')
if after_work_idx != -1:
    start_idx = ab.rfind('p(h.div,{className:`framer-1a9t247`', 0, after_work_idx)
    if start_idx != -1:
        open_parens = 0
        end_idx = -1
        for i in range(start_idx, len(ab)):
            if ab[i] == '(':
                open_parens += 1
            elif ab[i] == ')':
                open_parens -= 1
                if open_parens == 0:
                    end_idx = i + 1
                    break
        if end_idx != -1:
            ab = ab[:start_idx] + "null" + ab[end_idx:]
            print("Successfully excised Culture ('After work') JSX component from About mjs")

# 3.7 Team Grid - Reduce 8 cards to single Founder profile
# Find "data-framer-name":`Grid`,children:[ ... ]
grid_idx = ab.find('\"data-framer-name\":`Grid`,children:[')
if grid_idx != -1:
    # We keep only the first card in children:[ ... ]
    # First card starts after children:[
    first_card_start = grid_idx + len('\"data-framer-name\":`Grid`,children:[')
    # Find matching closing bracket for children array
    open_brackets = 1
    grid_children_end = -1
    for i in range(first_card_start, len(ab)):
        if ab[i] == '[':
            open_brackets += 1
        elif ab[i] == ']':
            open_brackets -= 1
            if open_brackets == 0:
                grid_children_end = i
                break
    
    if grid_children_end != -1:
        # Find where the first card ends (first top-level u(z,{...}) in children)
        open_parens = 0
        first_card_end = -1
        for i in range(first_card_start, grid_children_end):
            if ab[i] == '(':
                open_parens += 1
            elif ab[i] == ')':
                open_parens -= 1
                if open_parens == 0:
                    first_card_end = i + 1
                    break
        
        if first_card_end != -1:
            first_card = ab[first_card_start:first_card_end]
            # Replace children array with just [first_card]
            ab = ab[:first_card_start] + first_card + ab[grid_children_end:]
            print("Successfully simplified Team Grid to single Founder card")

with open(about_mjs_path, "w", encoding="utf-8") as f:
    f.write(ab)
print("Updated znfm_uW3YvFdDZ28MEdBO9z2HrI7OaPyUiz_zX9GYnw.DsWxHuen.mjs")


# =========================================================================
# 4. cDUh2JYGT-2.BDCxe8nq.mjs (Privacy Policy & Terms of Service)
# =========================================================================
legal_mjs_path = os.path.join(SITE_DIR, "cDUh2JYGT-2.BDCxe8nq.mjs")
with open(legal_mjs_path, "r", encoding="utf-8") as f:
    lg = f.read()

lg = lg.replace("Jan 15, 2025", "September 2026")
lg = lg.replace('OPUS Digital Agency', 'Corabin')
lg = lg.replace('("OPUS," "we," "us," or "our")', '("Corabin," "we," "us," or "our")')
lg = lg.replace('At OPUS,', 'At Corabin,')
lg = lg.replace('At OPUS ', 'At Corabin ')
lg = lg.replace('contact@opushq.com', 'hello@corabin.com')
lg = lg.replace('(555) 123-4567', '+918101685159')
lg = lg.replace(
    'Team members working on your project',
    'Third-party service providers (hosting, analytics, payment processing)'
)
lg = lg.replace(
    'Limited staff access to personal data',
    'Restricted access to personal data'
)
lg = lg.replace(
    'These Terms of Service ("Terms") govern your engagement with OPUS Digital Agency ("OPUS," "we," "us," or "our"). By accessing our services, you agree to these terms in full.',
    'These Terms of Service ("Terms") govern your engagement with Corabin ("Corabin," "we," "us," or "our"). By accessing our services, you agree to these terms in full.'
)

with open(legal_mjs_path, "w", encoding="utf-8") as f:
    f.write(lg)
print("Updated cDUh2JYGT-2.BDCxe8nq.mjs")


# =========================================================================
# 5. JLqe-6-qAsyy3l1paNGwEVrh-qv_jf3v_djF_VYWBoY.Ba0X3WII.mjs (Contact Page)
# =========================================================================
contact_mjs_path = os.path.join(SITE_DIR, "JLqe-6-qAsyy3l1paNGwEVrh-qv_jf3v_djF_VYWBoY.Ba0X3WII.mjs")
with open(contact_mjs_path, "r", encoding="utf-8") as f:
    ct = f.read()

ct = ct.replace("mailto: contact@opushq.com", "mailto:hello@corabin.com")
ct = ct.replace("children:`contact@opushq.com`", "children:`hello@corabin.com`")
ct = ct.replace('"data-framer-name":`contact@opushq.com`', '"data-framer-name":`hello@corabin.com`')
# Form action: change framer endpoint to direct mailto / self
ct = ct.replace(
    'action:`https://api.framer.com/forms/v1/forms/fbe3507b-9997-4e3f-91ff-9e4321e5b4d4/submit`',
    'action:`mailto:hello@corabin.com`'
)

with open(contact_mjs_path, "w", encoding="utf-8") as f:
    f.write(ct)
print("Updated JLqe-6-qAsyy3l1paNGwEVrh-qv_jf3v_djF_VYWBoY.Ba0X3WII.mjs")


# =========================================================================
# 6. shared-lib.x3ATB_t4.mjs (Shared Metadata)
# =========================================================================
shared_lib_path = os.path.join(SITE_DIR, "shared-lib.x3ATB_t4.mjs")
with open(shared_lib_path, "r", encoding="utf-8") as f:
    sl = f.read()

sl = sl.replace(
    'title:`Opus - A Framer template for Digital Agencies`',
    'title:`Corabin - Digital Design & Modern Web Studio`'
)
sl = sl.replace(
    'description:`OPUS is a modern Framer template for digital agencies, designed to elevate your online presence and showcase your creative expertise.`',
    'description:`At Corabin, we help companies build stronger brands, modern products, and websites that actually perform.`'
)

with open(shared_lib_path, "w", encoding="utf-8") as f:
    f.write(sl)
print("Updated shared-lib.x3ATB_t4.mjs")


# =========================================================================
# 7. Update raw modules in https/framerusercontent.com/modules/
# =========================================================================
modules_dir = os.path.join(SITE_DIR, "https/framerusercontent.com/modules")
for root, _, files in os.walk(modules_dir):
    for file in files:
        if file.endswith((".js", ".mjs")):
            p = os.path.join(root, file)
            with open(p, "r", encoding="utf-8", errors="ignore") as f:
                c = f.read()
            m = False
            if "Opus" in c or "OPUS" in c or "opushq.com" in c:
                c = c.replace("contact@opushq.com", "hello@corabin.com")
                c = c.replace("opushq.com", "corabin.com")
                c = c.replace("Opus - A Framer template for Digital Agencies", "Corabin - Digital Design & Modern Web Studio")
                c = c.replace("OPUS is a modern Framer template for digital agencies, designed to elevate your online presence and showcase your creative expertise.", "At Corabin, we help companies build stronger brands, modern products, and websites that actually perform.")
                c = c.replace("STUDIO OPUS", "STUDIO CORABIN")
                c = c.replace("Studio Opus", "Studio Corabin")
                c = c.replace("At Opus,", "At Corabin,")
                c = c.replace("At OPUS,", "At Corabin,")
                c = c.replace("Markus Chen", "Souvik")
                m = True
            if m:
                with open(p, "w", encoding="utf-8") as f:
                    f.write(c)
                print(f"Updated module file: {file}")

print("All Core Customizations Complete!")
