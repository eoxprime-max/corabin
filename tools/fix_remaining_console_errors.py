from pathlib import Path
from datetime import datetime
import re
import shutil

ROOT = Path.cwd()

FILES = [
    ROOT / "public" / "index.html",
    ROOT / "index.html",
]

# Only malformed operators inside inline JavaScript
REPAIRS = [
    (
        re.compile(r'([A-Za-z0-9_$)\]])[ \t]+\?[ \t]+\.(?=[A-Za-z_$])'),
        r'\1?.',
        "Malformed optional chaining"
    ),
    (
        re.compile(
            r'([A-Za-z0-9_$)\]])[ \t]+\?[ \t]+\?'
            r'(?=[ \t]*(?:[A-Za-z_$0-9({\[!~+\-]))'
        ),
        r'\1??',
        "Malformed nullish coalescing"
    ),
]

SCRIPT_RE = re.compile(
    r'(<script\b(?![^>]*\bsrc\s*=)[^>]*>)'
    r'(.*?)'
    r'(</script\s*>)',
    re.IGNORECASE | re.DOTALL
)

def main():
    pending = {}
    found = 0

    for path in FILES:
        if not path.is_file():
            continue

        original = path.read_text(encoding="utf-8")
        counts = {"optional": 0, "nullish": 0}

        def repair_script(match):
            opening, code, closing = match.groups()

            for pattern, replacement, description in REPAIRS:
                code, count = pattern.subn(replacement, code)

                if count:
                    key = (
                        "optional" if "optional" in description
                        else "nullish"
                    )
                    counts[key] += count

            return opening + code + closing

        updated = SCRIPT_RE.sub(repair_script, original)

        if updated != original:
            pending[path] = (original, updated, counts)
            found += sum(counts.values())

    if not pending:
        print("No matching malformed operators found.")
        print("No files changed. More diagnosis is needed.")
        return

    print("Proposed repairs:")
    for path, (_, _, counts) in pending.items():
        print(f"\n{path.relative_to(ROOT)}")
        print("  Optional chaining:", counts["optional"])
        print("  Nullish operators:", counts["nullish"])

    answer = input("\nApply these repairs? Type YES to continue: ")

    if answer.strip() != "YES":
        print("Cancelled. No files changed.")
        return

    backup_dir = (
        Path.home() / "Corabin-manual-backups"
        / datetime.now().strftime("%Y%m%d-%H%M%S")
    )

    try:
        for path, (original, _, _) in pending.items():
            backup = backup_dir / path.relative_to(ROOT)
            backup.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(path, backup)

        for path, (_, updated, _) in pending.items():
            path.write_text(updated, encoding="utf-8")

    except Exception as error:
        print("Write failed:", error)
        print("Backups, if created:", backup_dir)
        print("Restore the original files before continuing.")
        return

    print(f"\nRepaired {found} operator occurrence(s).")
    print("Backups:", backup_dir)
    print("Test locally before deploying.")

if __name__ == "__main__":
    main()