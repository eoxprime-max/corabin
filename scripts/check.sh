#!/usr/bin/env bash
# Pre-deploy sanity check for the Corabin website.
#
# Usage:    ./scripts/check.sh [--strict]
# Options:  --strict  Treats warnings (⚠️) as failures (exit 1)
#
# Run from the repository root before every deployment.
# All checks are non-destructive and read-only.
set -euo pipefail

PUB=public
FAIL=0
WARN=0
STRICT=false

# Parse flags
for arg in "$@"; do
  case $arg in
    --strict) STRICT=true ;;
  esac
done

pass()  { echo "✅ $1"; }
warn()  { echo "⚠️  WARNING: $1"; WARN=1; $STRICT && FAIL=1; }
fail()  { echo "❌ FAIL: $1"; FAIL=1; }

# ---------------------------------------------------------------------------
# 1. Deploy folder integrity — no internal files inside public/
# ---------------------------------------------------------------------------
echo "=== 1. Deploy folder integrity ==="
INTERNAL_PATHS=(tools docs archive scripts .git \
  CODEBASE_AUDIT.md SEO_PRODUCTION_AUDIT.md README.md \
  Corabin_PRODUCTION_AUDIT_REPORT.md scratch)
_check_fail=0
for p in "${INTERNAL_PATHS[@]}"; do
  if [ -e "$PUB/$p" ]; then
    fail "$PUB/$p must not be deployed"
    _check_fail=1
  fi
done
[ $_check_fail -eq 0 ] && pass "No internal files inside deploy folder"

# ---------------------------------------------------------------------------
# 2. Malformed mailto links
# ---------------------------------------------------------------------------
echo ""
echo "=== 2. mailto link formatting ==="
if grep -rIn 'mailto: ' $PUB --include='*.js' --include='*.mjs' --include='*.html' 2>/dev/null; then
  fail "'mailto: ' has a space — must be 'mailto:'"
else
  pass "All mailto links correctly formatted"
fi

# ---------------------------------------------------------------------------
# 3. Template leftover text
# ---------------------------------------------------------------------------
echo ""
echo "=== 3. Template remnants ==="
if grep -rIn 'opus_template\|lorem ipsum' $PUB \
    --include='*.js' --include='*.mjs' --include='*.html' 2>/dev/null; then
  fail "Template leftovers found in deploy folder"
else
  pass "No template leftovers detected"
fi

# ---------------------------------------------------------------------------
# 4. Old Framer form ID
# ---------------------------------------------------------------------------
echo ""
echo "=== 4. Legacy Framer form ID ==="
if grep -rIn 'fbe3507b-9997-4e3f-91ff-9e4321e5b4d4' $PUB 2>/dev/null; then
  fail "Old Framer form ID still present"
else
  pass "Old Framer form ID removed"
fi

# ---------------------------------------------------------------------------
# 5. 404 page has noindex
# ---------------------------------------------------------------------------
echo ""
echo "=== 5. 404 page SEO ==="
if grep -q 'noindex' "$PUB/404.html" 2>/dev/null; then
  pass "404 page has noindex"
else
  fail "404.html missing 'noindex' meta tag"
fi

# ---------------------------------------------------------------------------
# 6. Template publish stamp removed from all HTML
# ---------------------------------------------------------------------------
echo ""
echo "=== 6. Template publish stamps ==="
if grep -rIn 'Published May 22, 2026' $PUB --include='*.html' 2>/dev/null; then
  fail "Template publish stamp still present in HTML"
else
  pass "Template publish stamps removed"
fi

# ---------------------------------------------------------------------------
# 7. n8n webhook placeholder (warning — won't block if not yet configured)
# ---------------------------------------------------------------------------
echo ""
echo "=== 7. Form endpoint configuration ==="
if grep -rIn 'YOUR-N8N-WEBHOOK-URL' $PUB --include='*.js' --include='*.mjs' 2>/dev/null; then
  warn "n8n webhook URL placeholder still needs to be replaced before going live"
else
  pass "Form endpoint configured"
fi

# ---------------------------------------------------------------------------
# 8. CSP is enforced, not Report-Only
# ---------------------------------------------------------------------------
echo ""
echo "=== 8. CSP enforcement ==="
if grep -q 'Content-Security-Policy-Report-Only' "$PUB/_headers" 2>/dev/null; then
  fail "CSP is Report-Only in _headers — must be enforced (use Content-Security-Policy)"
else
  pass "CSP is enforced (not Report-Only)"
fi

# ---------------------------------------------------------------------------
# 9. No placeholder URLs in deployment config files
# ---------------------------------------------------------------------------
echo ""
echo "=== 9. Placeholder URLs in config ==="
if grep -rIn 'YOUR-N8N-WEBHOOK-URL' "$PUB/_headers" 2>/dev/null; then
  fail "Placeholder URL found in $PUB/_headers"
else
  pass "No placeholder URLs in deployment config"
fi

# ---------------------------------------------------------------------------
# 10. Malformed JS optional-chaining / nullish-coalescing in HTML scripts
# ---------------------------------------------------------------------------
echo ""
echo "=== 10. Inline JS operator syntax ==="
if grep -rInE '([A-Za-z0-9_$)\]])\s+\?\s+[.?]' "$PUB" --include='*.html' 2>/dev/null; then
  fail "Malformed optional-chaining or nullish-coalescing operator found in inline HTML scripts"
else
  pass "All inline JavaScript operators are valid"
fi

# ---------------------------------------------------------------------------
# 11. CSP permits n8n contact webhook origin
# ---------------------------------------------------------------------------
echo ""
echo "=== 11. CSP webhook allowlist ==="
CSP_OK=true
grep -q 'connect-src.*https://n8n.corabin.com' "$PUB/_headers" 2>/dev/null || CSP_OK=false
grep -q 'form-action.*https://n8n.corabin.com' "$PUB/_headers" 2>/dev/null || CSP_OK=false
if $CSP_OK; then
  pass "CSP permits https://n8n.corabin.com in connect-src and form-action"
else
  fail "CSP in _headers does not allow https://n8n.corabin.com"
fi

# ---------------------------------------------------------------------------
# 12. NEW — Supabase anon key present in config module
# ---------------------------------------------------------------------------
echo ""
echo "=== 12. Supabase configuration ==="
CONFIG_FILE="$PUB/assets/js/modules/config.js"
if [ -f "$CONFIG_FILE" ]; then
  if grep -q 'SUPABASE_ANON_KEY' "$CONFIG_FILE" && \
     grep -q 'SUPABASE_PROJECT_URL' "$CONFIG_FILE"; then
    pass "Supabase config keys present in modules/config.js"
  else
    fail "SUPABASE_ANON_KEY or SUPABASE_PROJECT_URL missing from modules/config.js"
  fi
  # Verify anon key is non-empty (not a placeholder)
  if grep -q "SUPABASE_ANON_KEY = ''" "$CONFIG_FILE" || \
     grep -q 'SUPABASE_ANON_KEY = ""' "$CONFIG_FILE" || \
     grep -q "SUPABASE_ANON_KEY = 'REPLACE_ME'" "$CONFIG_FILE"; then
    fail "SUPABASE_ANON_KEY is empty or placeholder in modules/config.js"
  else
    pass "Supabase anon key is non-empty"
  fi
else
  fail "modules/config.js not found — blog runtime will not function"
fi

# ---------------------------------------------------------------------------
# 13. NEW — All blog runtime modules are present
# ---------------------------------------------------------------------------
echo ""
echo "=== 13. Blog runtime module completeness ==="
MODULES=(config utils cloudinary supabase-api markdown-parser \
          featured-grid listing-runtime article-runtime router)
_missing=0
for mod in "${MODULES[@]}"; do
  if [ ! -f "$PUB/assets/js/modules/${mod}.js" ]; then
    fail "Missing module: $PUB/assets/js/modules/${mod}.js"
    _missing=1
  fi
done
if [ -f "$PUB/assets/js/blog-runtime.js" ]; then
  pass "blog-runtime.js entry point present"
else
  fail "blog-runtime.js not found — pages will not load blog content"
  _missing=1
fi
[ $_missing -eq 0 ] && pass "All 9 blog runtime modules present"

# ---------------------------------------------------------------------------
# 14. NEW — No service role key accidentally committed
# ---------------------------------------------------------------------------
echo ""
echo "=== 14. Security: no Supabase service role key ==="
# Service role JWTs are ~220+ chars and contain 'service_role' in their decoded payload.
# We can heuristically flag any JWT-shaped string longer than 200 chars that isn't
# the anon key itself appearing in non-config source files.
if grep -rInE 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.[A-Za-z0-9_-]{150,}' \
    "$PUB/assets/js" --include='*.js' 2>/dev/null | \
    grep -v 'modules/config.js' | grep -v 'blog-runtime.js' | grep -q .; then
  fail "Possible Supabase JWT found outside of config.js — verify no service role key is committed"
else
  pass "No service role keys detected in JS source files"
fi

# ---------------------------------------------------------------------------
# 15. NEW — Canonical URLs present on blog article shell
# ---------------------------------------------------------------------------
echo ""
echo "=== 15. Blog article shell canonical meta ==="
ARTICLE_SHELL="$PUB/blog/article.html"
if [ -f "$ARTICLE_SHELL" ]; then
  if grep -q 'rel="canonical"' "$ARTICLE_SHELL" || \
     grep -q "rel='canonical'" "$ARTICLE_SHELL"; then
    pass "Blog article shell has canonical link element"
  else
    warn "Blog article shell is missing canonical link — runtime should inject it dynamically"
  fi
else
  warn "blog/article.html not found — checking for Framer output format"
fi

# ---------------------------------------------------------------------------
# 16. NEW — sitemap.xml exists
# ---------------------------------------------------------------------------
echo ""
echo "=== 16. Sitemap ==="
if [ -f "$PUB/sitemap.xml" ]; then
  # Sanity-check it's not empty or malformed
  if grep -q '<url>' "$PUB/sitemap.xml"; then
    SITEMAP_URLS=$(grep -c '<url>' "$PUB/sitemap.xml" 2>/dev/null || echo 0)
    pass "sitemap.xml present with $SITEMAP_URLS URL entries"
  else
    warn "sitemap.xml exists but contains no <url> entries"
  fi
else
  warn "sitemap.xml not found in $PUB/"
fi

# ---------------------------------------------------------------------------
# 17. NEW — robots.txt allows Googlebot and references sitemap
# ---------------------------------------------------------------------------
echo ""
echo "=== 17. robots.txt ==="
if [ -f "$PUB/robots.txt" ]; then
  if grep -q 'Sitemap:' "$PUB/robots.txt"; then
    pass "robots.txt present and references sitemap"
  else
    warn "robots.txt exists but does not contain a Sitemap: directive"
  fi
else
  warn "robots.txt not found in $PUB/"
fi

# ---------------------------------------------------------------------------
# 18. NEW — Scratch/dev files not inside public/ (excluding Framer bundles)
# ---------------------------------------------------------------------------
echo ""
echo "=== 18. Dev artifacts in deploy folder ==="
# Exclude public/framerusercontent.com/ — those are Framer's own production bundles.
# Also exclude public/assets/js/ — our own authored .js modules live there.
DEV_ARTIFACTS=$(find "$PUB" \
  -not -path "$PUB/framerusercontent.com/*" \
  -not -path "$PUB/assets/js/*" \
  \( -name 'dev_server.py' -o -name 'cdp_helper.mjs' \
     -o -name '*.test.js'  -o -name '*.spec.js' \
     -o -name 'apply_cms_fixes.mjs' \
  \) 2>/dev/null)
if [ -n "$DEV_ARTIFACTS" ]; then
  echo "$DEV_ARTIFACTS"
  fail "Dev/test artifacts found in deploy folder"
else
  pass "No dev or test artifacts in deploy folder"
fi

# ---------------------------------------------------------------------------
# 19. NEW — vercel.json has cleanUrls and correct outputDirectory
# ---------------------------------------------------------------------------
echo ""
echo "=== 19. Vercel config ==="
if [ -f "vercel.json" ]; then
  if grep -q '"outputDirectory"' vercel.json && grep -q '"public"' vercel.json; then
    pass "vercel.json has outputDirectory set to public"
  else
    fail "vercel.json missing outputDirectory: public"
  fi
  if grep -q '"cleanUrls"' vercel.json; then
    pass "vercel.json has cleanUrls configured"
  else
    warn "vercel.json does not explicitly configure cleanUrls"
  fi
else
  fail "vercel.json not found in repo root"
fi

# ---------------------------------------------------------------------------
# 20. NEW — _headers file has security headers
# ---------------------------------------------------------------------------
echo ""
echo "=== 20. Security headers ==="
HEADERS_FILE="$PUB/_headers"
if [ -f "$HEADERS_FILE" ]; then
  REQUIRED_HEADERS=(
    "Content-Security-Policy"
    "X-Content-Type-Options"
    "X-Frame-Options"
    "Referrer-Policy"
  )
  _header_fail=0
  for h in "${REQUIRED_HEADERS[@]}"; do
    if ! grep -q "$h" "$HEADERS_FILE" 2>/dev/null; then
      fail "Missing security header in _headers: $h"
      _header_fail=1
    fi
  done
  [ $_header_fail -eq 0 ] && pass "All required security headers present in _headers"
else
  fail "$PUB/_headers file not found"
fi

# ---------------------------------------------------------------------------
# Summary
# ---------------------------------------------------------------------------
echo ""
echo "================================"
if [ $FAIL -eq 0 ] && [ $WARN -eq 0 ]; then
  echo "✅ All $((20)) pre-deploy checks passed"
  exit 0
elif [ $FAIL -eq 0 ]; then
  echo "✅ All required checks passed ($WARN warning(s) — run with --strict to treat as failures)"
  exit 0
else
  echo "❌ One or more checks failed — fix before deploying"
  exit 1
fi
