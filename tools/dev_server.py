#!/usr/bin/env python3
"""
tools/dev_server.py — Local preview server supporting Vercel/Netlify rewrites:
1. Exact static file matches from public/
2. Clean URLs (e.g., /about -> /about.html)
3. 301 redirects as defined in vercel.json and _redirects
4. Dynamic rewrite: /blog/:slug -> /blog/article.html (200 OK)
"""

import os
import sys
import mimetypes
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
import urllib.parse

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(SCRIPT_DIR, '..'))
PUBLIC_DIR = os.path.join(PROJECT_ROOT, 'public')

REDIRECTS = {
    "/projects/arrows": "/projects/kora",
    "/projects/arrows/": "/projects/kora",
    "/projects/chantalle": "/projects/himon",
    "/projects/chantalle/": "/projects/himon",
    "/projects/papyrus": "/projects/norda",
    "/projects/papyrus/": "/projects/norda",
    "/projects/london-museum": "/projects/ardene",
    "/projects/london-museum/": "/projects/ardene",
    "/projects/bullseye": "/projects/havyn",
    "/projects/bullseye/": "/projects/havyn",
    "/projects/interference": "/projects/almare",
    "/projects/interference/": "/projects/almare",
}

class CorabinRewriteHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=PUBLIC_DIR, **kwargs)

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        clean_path = parsed.path

        # 1. Check 301 redirects
        if clean_path in REDIRECTS:
            self.send_response(301)
            self.send_header('Location', REDIRECTS[clean_path])
            self.end_headers()
            return

        # 2. Check exact file or directory index
        disk_path = os.path.join(PUBLIC_DIR, clean_path.lstrip('/'))
        if os.path.isdir(disk_path):
            index_path = os.path.join(disk_path, 'index.html')
            if os.path.isfile(index_path):
                return super().do_GET()

        if os.path.isfile(disk_path):
            return super().do_GET()

        # 3. Clean URLs check: /about -> /about.html
        html_disk_path = disk_path + '.html'
        if os.path.isfile(html_disk_path):
            self.path = clean_path + '.html'
            if parsed.query:
                self.path += '?' + parsed.query
            return super().do_GET()

        # 4. Dynamic rewrite: /blog/:slug -> /blog/article.html
        if clean_path.startswith('/blog/') and clean_path not in ('/blog/', '/blog/index.html'):
            slug_part = clean_path[len('/blog/'):].strip('/')
            # If no physical directory exists for this slug, serve article.html with HTTP 200
            fallback_path = os.path.join(PUBLIC_DIR, 'blog', 'article.html')
            if os.path.isfile(fallback_path):
                with open(fallback_path, 'rb') as f:
                    content = f.read()
                self.send_response(200)
                self.send_header('Content-Type', 'text/html; charset=utf-8')
                self.send_header('Content-Length', str(len(content)))
                self.end_headers()
                self.wfile.write(content)
                return

        # Fallback to standard handler (will 404 cleanly)
        return super().do_GET()

    def do_HEAD(self):
        parsed = urllib.parse.urlparse(self.path)
        clean_path = parsed.path

        if clean_path in REDIRECTS:
            self.send_response(301)
            self.send_header('Location', REDIRECTS[clean_path])
            self.end_headers()
            return

        disk_path = os.path.join(PUBLIC_DIR, clean_path.lstrip('/'))
        if os.path.isfile(disk_path) or os.path.isdir(disk_path) or os.path.isfile(disk_path + '.html'):
            return super().do_HEAD()

        if clean_path.startswith('/blog/') and clean_path not in ('/blog/', '/blog/index.html'):
            fallback_path = os.path.join(PUBLIC_DIR, 'blog', 'article.html')
            if os.path.isfile(fallback_path):
                size = os.path.getsize(fallback_path)
                self.send_response(200)
                self.send_header('Content-Type', 'text/html; charset=utf-8')
                self.send_header('Content-Length', str(size))
                self.end_headers()
                return

        return super().do_HEAD()


def run(port=8088):
    server_address = ('', port)
    ThreadingHTTPServer.allow_reuse_address = True
    httpd = ThreadingHTTPServer(server_address, CorabinRewriteHandler)
    httpd.daemon_threads = True
    print(f"🚀 Corabin Rewrite-Aware Dev Server running at http://localhost:{port}/")
    print(f"📁 Serving: {PUBLIC_DIR}")
    print(f"🔄 /blog/:slug rewrites enabled to /blog/article.html")
    sys.stdout.flush()
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping server...")
        httpd.server_close()


if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8088
    run(port)
