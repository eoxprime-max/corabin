import os
import re

BASE = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
PUBLIC_DIR = os.path.join(BASE, 'public')

def get_aria_label(href):
    if not href or href == './' or href == '/': return "Home"
    name = href.strip('./').split('/')[-1]
    if not name: return "Link"
    return name.replace('-', ' ').title()

def apply_a11y_patches():
    modified_files = 0
    
    skip_link_html = '<a href="#main" class="skip-link">Skip to main content</a>'
    skip_link_css = """
    <style>
        .skip-link {
            position: absolute;
            top: -40px;
            left: 0;
            background: #111;
            color: #fff;
            padding: 8px 16px;
            z-index: 9999;
            transition: top 0.2s ease;
            text-decoration: none;
            font-family: inherit;
        }
        .skip-link:focus {
            top: 0;
        }
    </style>
    """

    dirs_to_process = [PUBLIC_DIR, BASE]

    for d in dirs_to_process:
        for root, _, files in os.walk(d):
            if '.git' in root or 'tools' in root or 'scripts' in root:
                continue
            for file in files:
                if file.endswith('.html'):
                    path = os.path.join(root, file)
                    with open(path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    new_content = content
                    
                    # Insert CSS before </head> if not exists
                    if 'class="skip-link"' not in new_content:
                        new_content = new_content.replace('</head>', skip_link_css + '\n</head>', 1)
                    
                    # Insert skip link after <body> if not exists
                    if 'class="skip-link"' in skip_link_css and '<a href="#main" class="skip-link">' not in new_content:
                        new_content = re.sub(r'(<body[^>]*>)', r'\1\n    ' + skip_link_html, new_content, count=1)
                    
                    # Add role="main" to <div id="main"...> without changing tag to avoid hydration mismatch
                    if 'id="main"' in new_content and 'role="main"' not in new_content:
                        new_content = re.sub(r'(<div\s+id="main")', r'\1 role="main"', new_content, count=1)
                    
                    # Add aria-label to empty links
                    def repl_anchor(m):
                        anchor_text = m.group(0)
                        if 'aria-label=' in anchor_text: return anchor_text
                        
                        href_match = re.search(r'href="([^"]+)"', anchor_text)
                        if not href_match: return anchor_text
                        
                        # If link is completely empty: <a ...></a>
                        if re.search(r'<a[^>]*>\s*</a>', anchor_text):
                            label = get_aria_label(href_match.group(1))
                            return anchor_text.replace('<a ', f'<a aria-label="{label}" ')
                        return anchor_text

                    new_content = re.sub(r'<a[^>]*>.*?</a>', repl_anchor, new_content, flags=re.DOTALL)
                    
                    if new_content != content:
                        with open(path, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                        modified_files += 1

    print(f"Applied a11y patches to {modified_files} files.")

if __name__ == '__main__':
    apply_a11y_patches()
