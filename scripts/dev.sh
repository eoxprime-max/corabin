#!/usr/bin/env bash
# scripts/dev.sh — Local static preview server for Corabin website.
# Serves the canonical production directory (public/) with clean process forwarding.

set -euo pipefail

# 1. Resolve project root relative to this script's directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
PUB_DIR="${ROOT_DIR}/public"

# 2. Port configuration (default: 8080, or accept custom port argument)
PORT="${1:-8080}"

if [ ! -d "${PUB_DIR}" ]; then
  echo "❌ Error: Production directory not found at ${PUB_DIR}" >&2
  exit 1
fi

echo "=========================================================="
echo " 🌐 Corabin Local Preview Server"
echo " Serving directory: ${PUB_DIR}"
echo " Local URL:         http://localhost:${PORT}"
echo " Press Ctrl+C to stop."
echo "=========================================================="

# 3. Forward process termination cleanly (exec replaces the subshell)
exec python3 "${ROOT_DIR}/tools/dev_server.py" "${PORT}"
