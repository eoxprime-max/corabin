#!/usr/bin/env bash
# Pre-deploy sanity check for Corabin website.
# Run from repo root: ./scripts/check.sh
set -euo pipefail

PUB=public
FAIL=0

pass() {
  echo "✅ $1"
}

# 1. No internal files inside the deploy folder
echo "=== Checking deploy folder integrity ==="
for p in tools docs archive scripts .git CODEBASE_AUDIT.md SEO_PRODUCTION_AUDIT.md README.md Corabin_PRODUCTION_AUDIT_REPORT.md; do
  if [ -e "$PUB/$p" ]; then
    echo "❌ FAIL: $PUB/$p must not be deployed"
    FAIL=1
  fi
done
[ $FAIL -eq 0 ] && pass "No internal files in deploy folder"

# 2. No malformed mailto links
echo ""
echo "=== Checking mailto links ==="
if grep -rIn 'mailto: ' $PUB --include='*.js' --include='*.mjs' --include='*.html' 2>/dev/null; then
  echo "❌ FAIL: 'mailto: ' has a space"
  FAIL=1
else
  pass "All mailto links are correctly formatted"
fi

# 3. No template leftovers
echo ""
echo "=== Checking for template remnants ==="
if grep -rIn 'opus_template\|Markus\|lorem ipsum' $PUB --include='*.js' --include='*.mjs' --include='*.html' 2>/dev/null; then
  echo "❌ FAIL: Template leftovers found"
  FAIL=1
else
  pass "No template leftovers detected"
fi

# 4. Old Framer form ID removed
echo ""
echo "=== Checking form endpoint ==="
if grep -rIn 'fbe3507b-9997-4e3f-91ff-9e4321e5b4d4' $PUB 2>/dev/null; then
  echo "❌ FAIL: Old Framer form ID still present"
  FAIL=1
else
  pass "Old Framer form ID removed"
fi

# 5. 404 page has noindex
echo ""
echo "=== Checking 404 page ==="
if grep -q 'noindex' "$PUB/404.html" 2>/dev/null; then
  pass "404 page has noindex"
else
  echo "❌ FAIL: 404.html missing noindex"
  FAIL=1
fi

# 6. Published template stamp removed
echo ""
echo "=== Checking for template stamps ==="
if grep -rIn 'Published May 22, 2026' $PUB --include='*.html' 2>/dev/null; then
  echo "❌ FAIL: Template publish stamp still present"
  FAIL=1
else
  pass "Template publish stamps removed"
fi

# 7. Check n8n webhook placeholder
echo ""
echo "=== Checking form endpoint configuration ==="
if grep -rIn 'YOUR-N8N-WEBHOOK-URL' $PUB --include='*.js' --include='*.mjs' 2>/dev/null; then
  echo "⚠️  WARNING: n8n webhook URL placeholder still needs to be replaced"
  # TODO: Change this to FAIL=1 once the production webhook URL is configured
else
  pass "Form endpoint configured"
fi

# 8. Check CSP is enforced (not Report-Only)
echo ""
echo "=== Checking CSP enforcement ==="
if grep -q 'Content-Security-Policy-Report-Only' "$PUB/_headers" 2>/dev/null; then
  echo "❌ FAIL: CSP is Report-Only in _headers — must be enforced"
  FAIL=1
else
  pass "CSP is enforced (not Report-Only)"
fi

# 9. No placeholder URLs in deployment config
echo ""
echo "=== Checking for placeholder URLs ==="
if grep -rIn 'YOUR-N8N-WEBHOOK-URL' "$PUB/_headers" 2>/dev/null; then
  echo "❌ FAIL: Placeholder URL found in _headers"
  FAIL=1
else
  pass "No placeholder URLs in deployment config"
fi

# 10. Check for malformed JS operators in HTML scripts
echo ""
echo "=== Checking for malformed JS operators ==="
if grep -rInE '([A-Za-z0-9_$)\]])[ \t]+\?[ \t]+[.?]' "$PUB" --include='*.html' 2>/dev/null; then
  echo "❌ FAIL: Malformed optional chaining or nullish coalescing operator found"
  FAIL=1
else
  pass "All inline JavaScript operators are valid"
fi

# 11. Check CSP allows the contact form webhook origin
echo ""
echo "=== Checking CSP permits contact webhook origin ==="
if grep -q 'connect-src.*https://n8n.corabin.com' "$PUB/_headers" && grep -q 'form-action.*https://n8n.corabin.com' "$PUB/_headers"; then
  pass "CSP permits https://n8n.corabin.com in connect-src and form-action"
else
  echo "❌ FAIL: CSP in _headers does not allow https://n8n.corabin.com"
  FAIL=1
fi

echo ""
echo "================================"
if [ $FAIL -eq 0 ]; then
  echo "✅ All pre-deploy checks passed"
  exit 0
else
  echo "❌ Some checks failed — fix before deploying"
  exit 1
fi
