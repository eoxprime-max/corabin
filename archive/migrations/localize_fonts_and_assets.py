import os
import re
import urllib.request

BASE = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
PUBLIC_DIR = os.path.join(BASE, 'public')
FONTS_DIR = os.path.join(PUBLIC_DIR, 'assets', 'fonts')

os.makedirs(FONTS_DIR, exist_ok=True)

def localize_fonts():
    font_urls = set()
    for root, _, files in os.walk(PUBLIC_DIR):
        for file in files:
            if file.endswith(('.html', '.css', '.js', '.mjs')):
                path = os.path.join(root, file)
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # find all https://fonts.gstatic.com/s/... URLs stopping at .woff2, .woff, or .ttf
                urls = re.findall(r'https://fonts\.gstatic\.com/s/[^)"\'\s]+?\.(?:woff2|woff|ttf)', content)
                font_urls.update(urls)

    print(f"Found {len(font_urls)} unique font URLs.")

    url_to_local = {}
    for url in font_urls:
        filename = url.split('/')[-1]
        local_path = f"/assets/fonts/{filename}"
        url_to_local[url] = local_path
        
        fs_path = os.path.join(FONTS_DIR, filename)
        if not os.path.exists(fs_path):
            print(f"Downloading {url} to {fs_path}")
            try:
                # Need custom headers? Usually not for gstatic
                req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
                with urllib.request.urlopen(req) as response:
                    with open(fs_path, 'wb') as out_file:
                        out_file.write(response.read())
            except Exception as e:
                print(f"Failed to download {url}: {e}")

    # Now replace in files
    modified_files = 0
    for root, _, files in os.walk(PUBLIC_DIR):
        for file in files:
            if file.endswith(('.html', '.css', '.js', '.mjs')):
                path = os.path.join(root, file)
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                new_content = content
                for url, local_path in url_to_local.items():
                    # also replace the escaped versions if any
                    new_content = new_content.replace(url, local_path)
                
                # Also remove <link href="https://fonts.gstatic.com" ...>
                new_content = re.sub(r'<link[^>]+href="https://fonts\.gstatic\.com"[^>]*>', '', new_content)
                new_content = re.sub(r'<link[^>]+href="https://fonts\.googleapis\.com"[^>]*>', '', new_content)
                
                if new_content != content:
                    with open(path, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    modified_files += 1

    print(f"Modified {modified_files} files with local font paths.")

if __name__ == '__main__':
    localize_fonts()
