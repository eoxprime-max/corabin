import os
import re

BASE = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
PUBLIC_DIR = os.path.join(BASE, 'public')

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

    for root, _, files in os.walk(PUBLIC_DIR):
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
                
                if new_content != content:
                    with open(path, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    modified_files += 1

    print(f"Applied a11y patches to {modified_files} files.")

if __name__ == '__main__':
    apply_a11y_patches()
