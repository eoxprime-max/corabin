import json
import sys

file_path = 'public/framerusercontent.com/sites/46CYIm3dbxFoU3f63shpCX/l0aFVHEAD.Du2GMRYI.mjs'

with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Update item 0 date so that custom-vs-off-the-shelf is aligned with Supabase's 3 featured posts
old_item0_date = '"OjAlyiakl":{"type":"string","value":"custom-vs-off-the-shelf-choose-wisely"},"eViimYxMt":{"type":"date","value":"2025-01-16T00:00:00.000Z"}'
new_item0_date = '"OjAlyiakl":{"type":"string","value":"custom-vs-off-the-shelf-choose-wisely"},"eViimYxMt":{"type":"date","value":"2026-10-11T00:00:00.000Z"}'

if old_item0_date not in text:
    print('ERROR: Old item 0 date not found in file!')
    sys.exit(1)

text = text.replace(old_item0_date, new_item0_date, 1)

# 2. Add nextItemId to item 11 and append item 12
old_end_item11 = 'lead path.\\"]]]"}}];'
if old_end_item11 not in text:
    print('ERROR: Old end item 11 not found in file!')
    sys.exit(1)

item12_obj = {
    "id": {"type": "string", "value": "C8m2We3xZ"},
    "previousItemId": {"type": "string", "value": "X2k7Lp9vM"},
    "rxkeCE0l_": {"type": "string", "value": "Why Every Real Estate Agent Needs a Website in 2026"},
    "OjAlyiakl": {"type": "string", "value": "why-every-real-estate-agent-needs-a-website-in-2026"},
    "eViimYxMt": {"type": "date", "value": "2026-04-13T10:00:00.000Z"},
    "DYldC4ELI": {
        "type": "responsiveimage",
        "value": {
            "src": "https://res.cloudinary.com/teolzwgc/image/upload/f_auto,q_auto/corabin/blog-covers/why-every-real-estate-agent-needs-a-website-in-2026-e34ab2c1",
            "srcSet": "https://res.cloudinary.com/teolzwgc/image/upload/f_auto,q_auto,w_512/corabin/blog-covers/why-every-real-estate-agent-needs-a-website-in-2026-e34ab2c1 512w, https://res.cloudinary.com/teolzwgc/image/upload/f_auto,q_auto,w_1024/corabin/blog-covers/why-every-real-estate-agent-needs-a-website-in-2026-e34ab2c1 1024w, https://res.cloudinary.com/teolzwgc/image/upload/f_auto,q_auto,w_1672/corabin/blog-covers/why-every-real-estate-agent-needs-a-website-in-2026-e34ab2c1 1672w",
            "pixelWidth": 1672,
            "pixelHeight": 941,
            "positionX": "50%",
            "positionY": "50%"
        }
    },
    "pFOAL5b2B": {"type": "string", "value": "Souvik"},
    "vY4r0YgEv": {"type": "string", "value": "Founder & Lead Architect"},
    "OcVxWrNlF": {
        "type": "responsiveimage",
        "value": {
            "src": "/assets/images/about/Souvik_short_profile_img.jpeg",
            "srcSet": "/assets/images/about/Souvik_short_profile_img-512.webp 512w, /assets/images/about/Souvik_short_profile_img.webp 1024w",
            "pixelWidth": 1024,
            "pixelHeight": 1024
        }
    },
    "XtPRgJU7d": {"type": "string", "value": "Discover how a professional real estate website helps agents build trust, showcase property listings, attract potential buyers, and generate more qualified leads."},
    "qf1cbKeUW": {
        "type": "richtext",
        "value": json.dumps([
            1,
            [4, "p", None, [5, "In today’s digital world, most property buyers start their search online. Before contacting an agent, they often compare properties, check reviews, and research local real estate companies."]],
            [4, "p", None, [5, "A professional website helps agents build trust and showcase their properties in one place. It can include property listings, high-quality images, location details, and a simple contact form so potential buyers can reach out easily."]],
            [4, "p", None, [5, "However, having a website is not enough. It should load quickly, work smoothly on mobile devices, and make it easy for visitors to enquire about a property."]],
            [4, "p", None, [4, "strong", None, [5, "The bottom line:"]], [5, " A well-designed real estate website is more than an online business card. It is a valuable tool for building credibility, attracting potential buyers, and generating new leads."]]
        ])
    }
}

item12_str = json.dumps(item12_obj)
new_end_item11 = 'lead path.\\"]]]"},"nextItemId":{"type":"string","value":"C8m2We3xZ"}},' + item12_str + '];'

text = text.replace(old_end_item11, new_end_item11, 1)

# 3. Update s map (getSlugByRecordId)
old_s = '"X2k7Lp9vM":"idx-listings-not-showing-google"};'
new_s = '"X2k7Lp9vM":"idx-listings-not-showing-google","C8m2We3xZ":"why-every-real-estate-agent-needs-a-website-in-2026"};'
if old_s not in text:
    print('ERROR: Old s map not found in file!')
    sys.exit(1)
text = text.replace(old_s, new_s, 1)

# 4. Update m map (getRecordIdBySlug)
old_m = '"idx-listings-not-showing-google":"X2k7Lp9vM"};'
new_m = '"idx-listings-not-showing-google":"X2k7Lp9vM","why-every-real-estate-agent-needs-a-website-in-2026":"C8m2We3xZ"};'
if old_m not in text:
    print('ERROR: Old m map not found in file!')
    sys.exit(1)
text = text.replace(old_m, new_m, 1)

# Validate CMS JSON parse
prefix = 'let _inMemoryCMS=['
start_idx = text.find(prefix) + len(prefix) - 1
depth = 0
end_idx = start_idx
for i in range(start_idx, len(text)):
    if text[i] == '[': depth += 1
    elif text[i] == ']':
        depth -= 1
        if depth == 0:
            end_idx = i + 1
            break

cms_items = json.loads(text[start_idx:end_idx])
print('Successfully parsed new _inMemoryCMS! Total items:', len(cms_items))
assert len(cms_items) == 13
assert cms_items[12]['id']['value'] == 'C8m2We3xZ'
assert cms_items[11]['nextItemId']['value'] == 'C8m2We3xZ'
assert cms_items[0]['eViimYxMt']['value'] == '2026-10-11T00:00:00.000Z'

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(text)

print('Successfully written updated l0aFVHEAD.Du2GMRYI.mjs!')
