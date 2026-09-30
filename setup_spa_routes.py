import json
import os

BASE_DIR = '/home/souvik/Projects/opus_template.framer.website'
INDEX_PATH = os.path.join(BASE_DIR, 'index.html')

with open(INDEX_PATH, 'r', encoding='utf-8') as f:
    base_html = f.read()

# Route mappings from script_main.CNn1uaXy.mjs
# augiA20Il: /
# UlP2zZZj6: /about
# TQtrT4cVD: /contact
# y1Ew2vdH6: /blog
# FuUVrQiF8: /projects
# eseCSX3uP: /projects/:CwlmI8aRA

project_routes = [
    ('projects/kora', 'kora', 'Ustqft4DL'),
    ('projects/himon', 'himon', 'VFLpUKlIO'),
    ('projects/norda', 'norda', 'CUlaUhWgh'),
    ('projects/ardene', 'ardene', 'dTQkCzsDE'),
    ('projects/havyn', 'havyn', 'h6IGjxPLf'),
    ('projects/almare', 'almare', 'JWyy1SaGa'),
    # Legacy fallbacks
    ('projects/arrows', 'arrows', 'Ustqft4DL'),
    ('projects/chantalle', 'chantalle', 'VFLpUKlIO'),
    ('projects/papyrus', 'papyrus', 'CUlaUhWgh'),
    ('projects/london-museum', 'london-museum', 'dTQkCzsDE'),
    ('projects/bullseye', 'bullseye', 'h6IGjxPLf'),
    ('projects/interference', 'interference', 'JWyy1SaGa'),
]

static_routes = [
    ('projects', 'FuUVrQiF8'),
    ('about', 'UlP2zZZj6'),
    ('contact', 'TQtrT4cVD'),
    ('blog', 'y1Ew2vdH6'),
]

breakpoints = [
    {"hash": "72rtr7", "mediaQuery": "(min-width: 1440px)"},
    {"hash": "1fvi3ca", "mediaQuery": "(min-width: 700px) and (max-width: 1439.98px)"},
    {"hash": "1nuy9oi", "mediaQuery": "(max-width: 699.98px)"},
    {"hash": "ixqi1r", "mediaQuery": "(min-width: 1440px)"},
    {"hash": "3qsubc", "mediaQuery": "(min-width: 700px) and (max-width: 1439.98px)"},
    {"hash": "vc5owj", "mediaQuery": "(max-width: 699.98px)"}
]

# Find where data-framer-hydrate-v2 is in base_html
start_idx = base_html.find('data-framer-hydrate-v2="')
end_idx = base_html.find('"', start_idx + len('data-framer-hydrate-v2="')) + 1
prefix = base_html[:start_idx]
suffix = base_html[end_idx:]

for r_dir, slug, item_id in project_routes:
    dir_path = os.path.join(BASE_DIR, r_dir)
    os.makedirs(dir_path, exist_ok=True)
    hydrate_obj = {
        "routeId": "eseCSX3uP",
        "localeId": "default",
        "pathVariables": {"CwlmI8aRA": slug},
        "collectionItemId": item_id,
        "breakpoints": breakpoints
    }
    encoded_json = json.dumps(hydrate_obj).replace('"', '&quot;')
    new_html = prefix + f'data-framer-hydrate-v2="{encoded_json}"' + suffix
    with open(os.path.join(dir_path, 'index.html'), 'w', encoding='utf-8') as f:
        f.write(new_html)
    print(f"Generated route: {r_dir} (route: eseCSX3uP, item: {item_id})")

for r_dir, route_id in static_routes:
    dir_path = os.path.join(BASE_DIR, r_dir)
    os.makedirs(dir_path, exist_ok=True)
    hydrate_obj = {
        "routeId": route_id,
        "localeId": "default",
        "breakpoints": breakpoints
    }
    encoded_json = json.dumps(hydrate_obj).replace('"', '&quot;')
    new_html = prefix + f'data-framer-hydrate-v2="{encoded_json}"' + suffix
    with open(os.path.join(dir_path, 'index.html'), 'w', encoding='utf-8') as f:
        f.write(new_html)
    print(f"Generated static route: {r_dir} (route: {route_id})")

print("All route entrypoints successfully generated and aligned!")
