import os
import re

BASE_DIR = "/home/souvik/Projects/opus_template.framer.website"

# 1. Update HTML files
for h_file in ["opus-template.framer.website/index.html", "index.html"]:
    h_path = os.path.join(BASE_DIR, h_file)
    with open(h_path, "r", encoding="utf-8") as f:
        html = f.read()
    
    # Replace >Opus,</span> with >Corabin,</span>
    html = re.sub(r'>Opus,</span>', '>Corabin,</span>', html)
    # Replace >better</span> with >modern</span>
    html = re.sub(r'>better</span>', '>modern</span>', html)
    
    # Remove any remaining Made in Framer comments or badges
    html = html.replace("Made in Framer", "Corabin Studio")
    html = html.replace("framer.com", "corabin.com")
    
    with open(h_path, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"Cleaned {h_file}")

# 2. shared-lib.x3ATB_t4.mjs
sl_path = os.path.join(BASE_DIR, "framerusercontent.com/sites/46CYIm3dbxFoU3f63shpCX/shared-lib.x3ATB_t4.mjs")
with open(sl_path, "r", encoding="utf-8") as f:
    sl = f.read()
sl = re.sub(r'description:`OPUS is a modern Framer template[^`]*`', 'description:`At Corabin, we help companies build stronger brands, modern products, and websites that actually perform.`', sl)
sl = re.sub(r'title:`Opus - [^`]*`', 'title:`Corabin - Digital Design & Modern Web Studio`', sl)
with open(sl_path, "w", encoding="utf-8") as f:
    f.write(sl)
print("Cleaned shared-lib.x3ATB_t4.mjs")

# 3. znfm_uW3YvFdDZ28MEdBO9z2HrI7OaPyUiz_zX9GYnw.DsWxHuen.mjs
ab_path = os.path.join(BASE_DIR, "framerusercontent.com/sites/46CYIm3dbxFoU3f63shpCX/znfm_uW3YvFdDZ28MEdBO9z2HrI7OaPyUiz_zX9GYnw.DsWxHuen.mjs")
with open(ab_path, "r", encoding="utf-8") as f:
    ab = f.read()
ab = ab.replace("`Life at Opus`", "`Our Story`")
with open(ab_path, "w", encoding="utf-8") as f:
    f.write(ab)
print("Cleaned znfm_uW3YvFdDZ28MEdBO9z2HrI7OaPyUiz_zX9GYnw.DsWxHuen.mjs")

# 4. Modules: xVFoVRkDB.js, augiA20Il.js, cDUh2JYGT-2.js, UlP2zZZj6.js
modules_to_clean = [
    "framerusercontent.com/sites/46CYIm3dbxFoU3f63shpCX/https/framerusercontent.com/modules/zSrjPSGRsNYlmNmAgre9/BeJvMCfL4pQf5IKVF6T6/xVFoVRkDB.js",
    "framerusercontent.com/sites/46CYIm3dbxFoU3f63shpCX/https/framerusercontent.com/modules/5ClbloOPINMGWdjJrcrC/8di8dsBRxVbof9tpvgwT/augiA20Il.js",
    "framerusercontent.com/sites/46CYIm3dbxFoU3f63shpCX/https/framerusercontent.com/modules/Wp7ae5IzVzvpX9IekuHe/rGng6IvzYvn1rGoY4lTQ/cDUh2JYGT-2.js",
    "framerusercontent.com/sites/46CYIm3dbxFoU3f63shpCX/https/framerusercontent.com/modules/Rp33LvqLZ0soA55xBoV8/NbFhBB9qSfrMIblD8JfX/UlP2zZZj6.js",
    "framerusercontent.com/sites/46CYIm3dbxFoU3f63shpCX/framertoplevel/main.html"
]

for rel in modules_to_clean:
    p = os.path.join(BASE_DIR, rel)
    if os.path.exists(p):
        with open(p, "r", encoding="utf-8", errors="ignore") as f:
            c = f.read()
        c = c.replace('"OPUS"', '"CORABIN"')
        c = c.replace('"OPUS "', '"CORABIN "')
        c = c.replace('"Opus"', '"Corabin"')
        c = c.replace('`OPUS`', '`CORABIN`')
        c = c.replace('`OPUS `', '`CORABIN `')
        c = c.replace('`Opus`', '`Corabin`')
        c = c.replace('OPUS Digital Agency', 'Corabin')
        c = c.replace('("OPUS," "we," "us," or "our")', '("Corabin," "we," "us," or "our")')
        c = c.replace('At OPUS,', 'At Corabin,')
        c = c.replace('At OPUS ', 'At Corabin ')
        c = c.replace('When we founded OPUS,', 'When I founded Corabin,')
        c = c.replace('Markus Chen', 'Souvik')
        c = c.replace('CEO & Co-founder', 'Founder, Corabin')
        c = c.replace('Life at Opus', 'Our Story')
        c = c.replace('@2026 Opus, All Rights Reserved', '@2026 Corabin, All Rights Reserved')
        c = c.replace('@2025 Opus, All Rights Reserved', '@2026 Corabin, All Rights Reserved')
        c = c.replace('https://opus-template.framer.website', 'https://corabin.com')
        c = c.replace('contact@opushq.com', 'hello@corabin.com')
        with open(p, "w", encoding="utf-8") as f:
            f.write(c)
        print(f"Cleaned {rel}")

print("Targeted cleanup finished!")
