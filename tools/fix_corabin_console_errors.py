from pathlib import Path
from datetime import datetime
import shutil
import sys

SKIP_DIRS = {
    ".git", "node_modules", ".vercel",
    ".corabin-local-backups", "framerusercontent.com"
}

BROKEN_OPERATORS = {
    'this.getAttribute("rel") ? ? ""':
        'this.getAttribute("rel") ?? ""',

    'this.getAttribute("target") ? ? ""':
        'this.getAttribute("target") ?? ""',

    'document.currentScript ? .hasAttribute':
        'document.currentScript?.hasAttribute',

    'Te[r] ? ? t()':
        'Te[r] ?? t()',

    't.roundingIncrement ? ? 1':
        't.roundingIncrement ?? 1',

    't.roundingMode ? ? "halfExpand"':
        't.roundingMode ?? "halfExpand"',

    'window.process ? .env':
        'window.process?.env',
}

# Allow only the specific external icon path,
# not every script hosted on framer.com.
OLD_CSP_SOURCE = (
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' "
    "https://framerusercontent.com"
)

NEW_CSP_SOURCE = OLD_CSP_SOURCE + (
    " https://framer.com/m/phosphor-icons/"
)

def find_root():
    candidates = [
        Path.cwd(),
        Path(__file__).resolve().parent,
        Path(__file__).resolve().parent.parent,
    ]

    for folder in candidates:
        if (folder / "public" / "index.html").is_file():
            return folder.resolve()

    raise SystemExit(
        "ERROR: Project root nahi mila. "
        "Script ko tools/ folder mein rakhkar "
        "project root se run karo."
    )

def main():
    root = find_root()
    timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    backup_root = root / ".corabin-local-backups" / timestamp

    updates = {}
    originals = {}
    syntax_fixes = 0
    csp_fixes = 0
    csp_seen = False
    csp_unresolved = []

    # Find HTML pages and common deployment configuration files.
    extensions = {
        ".html", ".json", ".toml",
        ".yaml", ".yml", ".conf", ".txt"
    }

    candidates = []

    for path in root.rglob("*"):
        if not path.is_file():
            continue

        if any(part in SKIP_DIRS for part in path.parts):
            continue

        if path.stat().st_size > 4_000_000:
            continue

        if path.suffix.lower() in extensions or path.name in {
            "_headers", ".htaccess"
        }:
            candidates.append(path)

    # First pass: repair only the confirmed malformed operators
    # in deployed HTML pages, excluding exported asset bundles.
    for path in candidates:
        if "public" not in path.relative_to(root).parts:
            continue

        if path.suffix.lower() != ".html":
            continue

        try:
            original = path.read_text(encoding="utf-8")
        except (OSError, UnicodeError):
            continue

        updated = original

        for bad, good in BROKEN_OPERATORS.items():
            count = updated.count(bad)
            if count:
                updated = updated.replace(bad, good)
                syntax_fixes += count
                print(f"Operator fixed: {path.relative_to(root)} ({count})")

        if updated != original:
            originals[path] = original
            updates[path] = updated

    # Second pass: inspect and narrowly update a matching CSP policy.
    for path in candidates:
        try:
            content = updates.get(
                path,
                path.read_text(encoding="utf-8")
            )
        except (OSError, UnicodeError):
            continue

        lower = content.lower()

        if "content-security-policy" not in lower and "script-src" not in lower:
            continue

        csp_seen = True

        if NEW_CSP_SOURCE in content:
            continue

        if OLD_CSP_SOURCE in content:
            if path not in originals:
                originals[path] = path.read_text(encoding="utf-8")

            updates[path] = content.replace(
                OLD_CSP_SOURCE, NEW_CSP_SOURCE
            )
            csp_fixes += content.count(OLD_CSP_SOURCE)
            print(f"CSP updated: {path.relative_to(root)}")

        elif (
            "script-src" in lower
            and "https://framerusercontent.com" in lower
            and "https://framer.com/m/phosphor-icons/" not in lower
        ):
            csp_unresolved.append(path.relative_to(root))

    # Refuse to change files until all backups can be made.
    changed = {
        path: content
        for path, content in updates.items()
        if path in originals and content != originals[path]
    }

    try:
        for path in changed:
            backup = backup_root / path.relative_to(root)
            backup.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(path, backup)

        for path, content in changed.items():
            path.write_text(content, encoding="utf-8")

    except Exception as error:
        print(f"ERROR while writing files: {error}")
        print(f"Original backups, if created: {backup_root}")
        return 1

    print("\n========== SUMMARY ==========")
    print(f"JavaScript operator fixes: {syntax_fixes}")
    print(f"CSP policy fixes: {csp_fixes}")
    print(f"Files changed: {len(changed)}")

    if changed:
        print(f"Backups saved outside public/: {backup_root}")
    else:
        print("No files required changes.")

    if not csp_seen:
        print(
            "\nNo local CSP definition found. "
            "The policy may be configured in Vercel."
        )

    if csp_unresolved:
        print("\nCSP found but did not match the known policy exactly:")
        for path in csp_unresolved:
            print(f"  - {path}")
        print("These policies were deliberately not changed.")

    print(
        "\nNext: test locally, inspect Console, "
        "then deploy only after verification."
    )
    return 0

if __name__ == "__main__":
    sys.exit(main())