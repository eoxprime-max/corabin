import json
import os
import shutil

BASE_DIR = '/home/souvik/Projects/opus_template.framer.website'
CMS_FILE = os.path.join(BASE_DIR, 'framerusercontent.com/sites/46CYIm3dbxFoU3f63shpCX/ARVkZnRTw.BOg_bqGO.mjs')
BAK_FILE = os.path.join(BASE_DIR, 'framerusercontent.com/sites/46CYIm3dbxFoU3f63shpCX/ARVkZnRTw.BOg_bqGO.mjs.bak')
UPDATED_CMS_JSON = os.path.join(BASE_DIR, 'updated_cms_records.json')

INDEX_FILES = [
    os.path.join(BASE_DIR, 'index.html'),
    os.path.join(BASE_DIR, 'opus-template.framer.website/index.html')
]

def patch_cms_mjs():
    print("Reading updated CMS records...")
    with open(UPDATED_CMS_JSON, 'r', encoding='utf-8') as f:
        records = json.load(f)
    
    compact_records_json = json.dumps(records, separators=(',', ':'), ensure_ascii=False)
    
    print("Reading clean backup of ARVkZnRTw.BOg_bqGO.mjs...")
    with open(BAK_FILE, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Target 1: $e class definition
    pos1 = content.find('$e=class{async scanItems()')
    assert pos1 != -1 and content[pos1 - 1] == ',', "Expected comma before $e"
    pos1_start = pos1 - 1  # include the comma

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
    end_marker2 = 'displayName:`Projects`}'
    pos2_end = content.find(end_marker2, pos2) + len(end_marker2)
    assert pos2 != -1 and pos2_end != -1, "Target 2 not found"

    replacement2 = '$={collectionByLocaleId:{default:new $e({chunks:[new URL(`./ARVkZnRTw-chunk-default-0.framercms`,import.meta.url).href],indexes:[],resolveRichText:Dt,resolveVectorSetItem:Et,schema:J})},displayName:`Projects`}'
    content = content[:pos2] + replacement2 + content[pos2_end:]

    # 3. Target 3: At slug resolver
    pos3 = content.find('At={async getSlugByRecordId('
    )
    end_marker3 = 'return n?.id}}'
    pos3_end = content.find(end_marker3, pos3) + len(end_marker3)
    assert pos3 != -1 and pos3_end != -1, "Target 3 not found"

    replacement3 = '''At={async getSlugByRecordId(e,t){const s={"Ustqft4DL":"kora","VFLpUKlIO":"himon","CUlaUhWgh":"norda","dTQkCzsDE":"ardene","h6IGjxPLf":"havyn","JWyy1SaGa":"almare"};if(s[e])return s[e];let[n]=await Q.get({from:{data:$,type:`Collection`},limit:{type:`LiteralValue`,value:1},select:[{name:`CwlmI8aRA`,type:`Identifier`}],where:{left:{name:`id`,type:`Identifier`},operator:`==`,right:{type:`LiteralValue`,value:e},type:`BinaryOperation`}},t).readAsync();return n?.CwlmI8aRA},async getRecordIdBySlug(e,t){const m={"kora":"Ustqft4DL","himon":"VFLpUKlIO","norda":"CUlaUhWgh","ardene":"dTQkCzsDE","havyn":"h6IGjxPLf","almare":"JWyy1SaGa","arrows":"Ustqft4DL","chantalle":"VFLpUKlIO","papyrus":"CUlaUhWgh","london-museum":"dTQkCzsDE","bullseye":"h6IGjxPLf","interference":"JWyy1SaGa"};if(m[e])return m[e];let[n]=await Q.get({from:{data:$,type:`Collection`},limit:{type:`LiteralValue`,value:1},select:[{name:`id`,type:`Identifier`}],where:{left:{name:`CwlmI8aRA`,type:`Identifier`},operator:`==`,right:{type:`LiteralValue`,value:e},type:`BinaryOperation`}},t).readAsync();return n?.id}}'''
    content = content[:pos3] + replacement3 + content[pos3_end:]

    print(f"Writing updated {CMS_FILE}...")
    with open(CMS_FILE, 'w', encoding='utf-8') as f:
        f.write(content)
    print("CMS mjs patched successfully!")

def patch_html_files():
    replacements = [
        ('href="./projects/arrows"', 'href="./projects/kora"'),
        ('>Arrows</h3>', '>Kora</h3>'),
        ('href="./projects/chantalle"', 'href="./projects/himon"'),
        ('>Chantalle</h3>', '>Himon</h3>'),
        ('href="./projects/papyrus"', 'href="./projects/norda"'),
        ('>Papyrus</h3>', '>Nordå</h3>'),
        ('href="./projects/london-museum"', 'href="./projects/ardene"'),
        ('>London Museum</h3>', '>Ardène</h3>'),
        ('href="./projects/bullseye"', 'href="./projects/havyn"'),
        ('>Bullseye</h3>', '>Havyn</h3>'),
        ('href="./projects/interference"', 'href="./projects/almare"'),
        ('>Interference</h3>', '>Almare</h3>'),
    ]

    for fpath in INDEX_FILES:
        print(f"Patching {fpath}...")
        bak_path = fpath + '.bak'
        if not os.path.exists(bak_path):
            shutil.copy2(fpath, bak_path)
            print(f"  Created backup {bak_path}")

        with open(fpath, 'r', encoding='utf-8') as f:
            html = f.read()

        for old_str, new_str in replacements:
            count = html.count(old_str)
            print(f"  Replacing '{old_str}' -> '{new_str}' ({count} matches)")
            html = html.replace(old_str, new_str)

        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(html)
        print(f"Finished {fpath}")

if __name__ == '__main__':
    patch_cms_mjs()
    patch_html_files()
    print("ALL PATCHES APPLIED SUCCESSFULLY!")
