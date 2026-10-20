#!/usr/bin/env python3
"""
tools/backup_server.py — Serves original backup blog pages alongside public assets on port 8089.
"""

import os
import sys
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
import urllib.parse

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(SCRIPT_DIR, '..'))
PUBLIC_DIR = os.path.join(PROJECT_ROOT, 'public')
BACKUP_BLOG_DIR = os.path.join(PROJECT_ROOT, '.corabin-local-backups', '20261016-pre-shared-template', 'blog')

class BackupBlogHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        clean_path = parsed.path.rstrip('/')

        # 1. Map /blog/... to backup blog dir
        if parsed.path.startswith('/blog/'):
            sub_path = parsed.path[len('/blog/'):].strip('/')
            if not sub_path:
                target_file = os.path.join(BACKUP_BLOG_DIR, 'index.html')
            else:
                target_file = os.path.join(BACKUP_BLOG_DIR, sub_path, 'index.html')
                if not os.path.isfile(target_file):
                    target_file = os.path.join(BACKUP_BLOG_DIR, sub_path)

            if os.path.isfile(target_file):
                with open(target_file, 'rb') as f:
                    content = f.read()

                # Inject style override to cancel Framer initial appear hide states so original elements are rendered visibly
                appear_override = b"""<style id="framer-appear-reveal-override">
                [data-framer-appear-id], .ssr-variant, [style*="opacity: 0.001"], [style*="opacity:0.001"] {
                    opacity: 1 !important;
                    transform: none !important;
                }
                </style></head>"""
                if b'</head>' in content:
                    content = content.replace(b'</head>', appear_override, 1)

                self.send_response(200)
                self.send_header('Content-Type', 'text/html; charset=utf-8')
                self.send_header('Content-Length', str(len(content)))
                self.end_headers()
                self.wfile.write(content)
                return

        # 2. Everything else (/assets/..., /favicon.ico, etc.) served from public/
        return super().do_GET()

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=PUBLIC_DIR, **kwargs)

def run(port=8089):
    server_address = ('', port)
    ThreadingHTTPServer.allow_reuse_address = True
    httpd = ThreadingHTTPServer(server_address, BackupBlogHandler)
    httpd.daemon_threads = True
    print(f"📦 Backup Original Server running at http://localhost:{port}/")
    print(f"📁 Serving /blog/ from: {BACKUP_BLOG_DIR}")
    print(f"📁 Serving assets from: {PUBLIC_DIR}")
    sys.stdout.flush()
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping backup server...")
        httpd.server_close()

if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8089
    run(port)
