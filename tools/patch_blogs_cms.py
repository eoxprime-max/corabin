import json
import os
import shutil

BASE_DIR = '/home/souvik/Projects/opus_template.framer.website'
CMS_FILE = os.path.join(BASE_DIR, 'framerusercontent.com/sites/46CYIm3dbxFoU3f63shpCX/l0aFVHEAD.Du2GMRYI.mjs')
BAK_FILE = os.path.join(BASE_DIR, 'framerusercontent.com/sites/46CYIm3dbxFoU3f63shpCX/l0aFVHEAD.Du2GMRYI.mjs.bak')
UPDATED_CMS_JSON = os.path.join(BASE_DIR, 'updated_blog_records.json')

INDEX_FILES = [
    os.path.join(BASE_DIR, 'index.html'),
    os.path.join(BASE_DIR, 'opus-template.framer.website/index.html')
]

DETAIL_MJS = os.path.join(BASE_DIR, 'framerusercontent.com/sites/46CYIm3dbxFoU3f63shpCX/jfdGCqCG1RmfDuet8vgwgD75AxSOKw7XKcL0miQMXF0.BwObU7WC.mjs')

def patch_cms_mjs():
    print("Reading updated blog CMS records...")
    with open(UPDATED_CMS_JSON, 'r', encoding='utf-8') as f:
        records = json.load(f)
    
    compact_records_json = json.dumps(records, separators=(',', ':'), ensure_ascii=False)
    
    print("Reading clean backup of l0aFVHEAD.Du2GMRYI.mjs.bak...")
    with open(BAK_FILE, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Target 1: $e class definition
    pos1 = content.find('$e=class{async scanItems()')
    assert pos1 != -1 and content[pos1 - 1] == ',', "Expected comma before $e"
    pos1_start = pos1 - 1  # include comma

    end_marker1 = 'resolveVectorSetItem=e.resolveVectorSetItem}}'
    pos1_end = content.find(end_marker1, pos1) + len(end_marker1)
    assert pos1_end != -1, "Target 1 end not found"

    replacement1 = f''';let _inMemoryCMS={compact_records_json};
let _inMemoryItems=_inMemoryCMS.map((data,index)=>({{pointer:`0/${{index}}/1`,data}}));
let _pointerMap=new Map(_inMemoryItems.map(item=>[item.pointer,item]));
$e=class{{
async scanItems(){{return _inMemoryItems}}
async resolveItems(e){{return e.map(e=>{{let t=_pointerMap.get(e);if(!t){{let n=parseInt(String(e).split(`/`)[1],10);if(!isNaN(n)&&_inMemoryItems[n])t=_inMemoryItems[n]}}return t||_inMemoryItems[0]}})}}
compareItems(e,t){{let n=H.fromString(e.pointer),r=H.fromString(t.pointer);return n.compare(r)}}
compareValues(e,t,n){{return S.compare(e,t,n)}}
constructor(e){{this.options=e,N(this,`schema`),N(this,`indexes`),N(this,`resolveRichText`),N(this,`resolveVectorSetItem`),N(this,`chunks`),this.chunks=this.options.chunks.map((e,t)=>new Qe(t,e)),this.schema=e.schema,this.indexes=e.indexes,this.resolveRichText=e.resolveRichText,this.resolveVectorSetItem=e.resolveVectorSetItem}}
}}'''

    content = content[:pos1_start] + replacement1 + content[pos1_end:]

    # 2. Target 2: $ collection definition
    pos2 = content.find('$={collectionByLocaleId:{default:new $e')
    end_marker2 = 'displayName:`Articles`}'
    pos2_end = content.find(end_marker2, pos2) + len(end_marker2)
    assert pos2 != -1 and pos2_end != -1, "Target 2 not found"

    replacement2 = '$={collectionByLocaleId:{default:new $e({chunks:[new URL(`./l0aFVHEAD-chunk-default-0.framercms`,import.meta.url).href],indexes:[],resolveRichText:bt,resolveVectorSetItem:yt,schema:J})},displayName:`Articles`}'
    content = content[:pos2] + replacement2 + content[pos2_end:]

    # 3. Target 3: Ct slug resolver
    pos3 = content.find('Ct={async getSlugByRecordId(')
    end_marker3 = 'return n?.id}}'
    pos3_end = content.find(end_marker3, pos3) + len(end_marker3)
    assert pos3 != -1 and pos3_end != -1, "Target 3 not found"

    replacement3 = '''Ct={async getSlugByRecordId(e,t){const s={"szH0Mi3XA":"custom-vs-off-the-shelf-choose-wisely","TjuY5nALB":"design-that-converts-our-approach","YJU5546L0":"7-critical-steps-to-successfully-launch-your-digital-product","FUC4mVPeK":"choosing-the-right-tech-stack-a-decision-framework-for-2025","fJ2oYh0ac":"speed-up-your-website-today","q4N3H4ETK":"why-design-systems-actually-matter","DsX27QyFZ":"headless-cms-the-future-is-here","rwmE1DXn8":"stop-making-these-common-api-mistakes","wxgkdoVKg":"website-security-made-simple","GvcJbd8QO":"technical-debt-friend-or-foe"};if(s[e])return s[e];let[n]=await Q.get({from:{data:$,type:`Collection`},limit:{type:`LiteralValue`,value:1},select:[{name:`OjAlyiakl`,type:`Identifier`}],where:{left:{name:`id`,type:`Identifier`},operator:`==`,right:{type:`LiteralValue`,value:e},type:`BinaryOperation`}},t).readAsync();return n?.OjAlyiakl},async getRecordIdBySlug(e,t){const m={"custom-vs-off-the-shelf-choose-wisely":"szH0Mi3XA","design-that-converts-our-approach":"TjuY5nALB","7-critical-steps-to-successfully-launch-your-digital-product":"YJU5546L0","choosing-the-right-tech-stack-a-decision-framework-for-2025":"FUC4mVPeK","speed-up-your-website-today":"fJ2oYh0ac","why-design-systems-actually-matter":"q4N3H4ETK","headless-cms-the-future-is-here":"DsX27QyFZ","stop-making-these-common-api-mistakes":"rwmE1DXn8","website-security-made-simple":"wxgkdoVKg","technical-debt-friend-or-foe":"GvcJbd8QO"};if(m[e])return m[e];let[n]=await Q.get({from:{data:$,type:`Collection`},limit:{type:`LiteralValue`,value:1},select:[{name:`id`,type:`Identifier`}],where:{left:{name:`OjAlyiakl`,type:`Identifier`},operator:`==`,right:{type:`LiteralValue`,value:e},type:`BinaryOperation`}},t).readAsync();return n?.id}}'''
    content = content[:pos3] + replacement3 + content[pos3_end:]

    print(f"Writing updated {CMS_FILE}...")
    with open(CMS_FILE, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Blog CMS mjs patched successfully!")

def patch_detail_mjs():
    if os.path.exists(DETAIL_MJS):
        bak_path = DETAIL_MJS + '.bak'
        if not os.path.exists(bak_path):
            shutil.copy2(DETAIL_MJS, bak_path)
            print(f"Created backup {bak_path}")
        with open(DETAIL_MJS, 'r', encoding='utf-8') as f:
            c = f.read()
        c = c.replace('children:`Markus Chen`', 'children:`Souvik`')
        c = c.replace('children:`CEO & Co-founder`', 'children:`Founder & Lead Architect`')
        with open(DETAIL_MJS, 'w', encoding='utf-8') as f:
            f.write(c)
        print("Patched blog detail component fallbacks successfully!")

def patch_html_files():
    replacements = [
        ('>Custom vs. Off-the-Shelf: Choose Wisely</p>', '>Custom Web Architecture vs. Commercial Templates: The Enterprise ROI Breakdown</p>'),
        ('>Design That Converts: Our Approach</p>', '>Conversion-Driven Design: How Top Digital Studios Engineer User Intent</p>'),
        ('>7 Critical Steps to Successfully Launch Your Digital Product</p>', '>From Concept to Market: The 7 Strategic Milestones of Digital Product Launch</p>'),
    ]

    for fpath in INDEX_FILES:
        print(f"Patching {fpath}...")
        with open(fpath, 'r', encoding='utf-8') as f:
            html = f.read()

        for old_str, new_str in replacements:
            count = html.count(old_str)
            html = html.replace(old_str, new_str)
            print(f"  Replacing '{old_str}' -> '{new_str}' ({count} matches)")

        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(html)
        print(f"Saved {fpath} successfully!")

def generate_blog_spa_routes():
    with open(os.path.join(BASE_DIR, 'index.html'), 'r', encoding='utf-8') as f:
        base_html = f.read()

    breakpoints = [
        {"hash": "72rtr7", "mediaQuery": "(min-width: 1440px)"},
        {"hash": "1fvi3ca", "mediaQuery": "(min-width: 700px) and (max-width: 1439.98px)"},
        {"hash": "1nuy9oi", "mediaQuery": "(max-width: 699.98px)"},
        {"hash": "ixqi1r", "mediaQuery": "(min-width: 1440px)"},
        {"hash": "3qsubc", "mediaQuery": "(min-width: 700px) and (max-width: 1439.98px)"},
        {"hash": "vc5owj", "mediaQuery": "(max-width: 699.98px)"}
    ]

    start_idx = base_html.find('data-framer-hydrate-v2="')
    end_idx = base_html.find('"', start_idx + len('data-framer-hydrate-v2="')) + 1
    prefix = base_html[:start_idx]
    suffix = base_html[end_idx:]

    # Blog listing route
    blog_dir = os.path.join(BASE_DIR, 'blog')
    os.makedirs(blog_dir, exist_ok=True)
    hydrate_listing = {
        "routeId": "y1Ew2vdH6",
        "localeId": "default",
        "breakpoints": breakpoints
    }
    encoded_listing = json.dumps(hydrate_listing).replace('"', '&quot;')
    with open(os.path.join(blog_dir, 'index.html'), 'w', encoding='utf-8') as f:
        f.write(prefix + f'data-framer-hydrate-v2="{encoded_listing}"' + suffix)
    print("Generated static route for /blog (routeId: y1Ew2vdH6)")

    # 10 Blog detail routes
    blog_routes = [
        ("custom-vs-off-the-shelf-choose-wisely", "szH0Mi3XA"),
        ("design-that-converts-our-approach", "TjuY5nALB"),
        ("7-critical-steps-to-successfully-launch-your-digital-product", "YJU5546L0"),
        ("choosing-the-right-tech-stack-a-decision-framework-for-2025", "FUC4mVPeK"),
        ("speed-up-your-website-today", "fJ2oYh0ac"),
        ("why-design-systems-actually-matter", "q4N3H4ETK"),
        ("headless-cms-the-future-is-here", "DsX27QyFZ"),
        ("stop-making-these-common-api-mistakes", "rwmE1DXn8"),
        ("website-security-made-simple", "wxgkdoVKg"),
        ("technical-debt-friend-or-foe", "GvcJbd8QO"),
    ]

    for slug, item_id in blog_routes:
        route_dir = os.path.join(blog_dir, slug)
        os.makedirs(route_dir, exist_ok=True)
        hydrate_obj = {
            "routeId": "FhR90JJqz",
            "localeId": "default",
            "pathVariables": {"OjAlyiakl": slug},
            "collectionItemId": item_id,
            "breakpoints": breakpoints
        }
        encoded_json = json.dumps(hydrate_obj).replace('"', '&quot;')
        route_html = prefix + f'data-framer-hydrate-v2="{encoded_json}"' + suffix
        with open(os.path.join(route_dir, 'index.html'), 'w', encoding='utf-8') as f:
            f.write(route_html)
        print(f"Generated static route for /blog/{slug} (item: {item_id})")

if __name__ == '__main__':
    patch_cms_mjs()
    patch_detail_mjs()
    patch_html_files()
    generate_blog_spa_routes()
    print("\nAll blog CMS, HTML, and SPA routes successfully updated!")
