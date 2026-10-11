#!/usr/bin/env python3
"""
Corabin social links repair for the exported static site.

Run from the project root (the folder containing vercel.json, public/, and tools/):
    python3 tools/fix_runtime_socials.py

This guarded script updates:
- the active/main JavaScript bundle in the root and public/ copies;
- the exported menu/header component module in the root and public/ copies;
- the exported footer component module in the root and public/ copies;
- HTML references to the main bundle, adding a cache-busting query.

It preserves the existing component markup/style by reusing the existing social node
blocks. It backs up changed files outside the repository. If the archive's structure
does not match the expected nodes, it aborts instead of guessing.
"""

from __future__ import annotations

import re
import shutil
import subprocess
import sys
from datetime import datetime
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
CACHE_VERSION = "corabin-social-links-v2"

SOCIAL_URLS = {
    "LinkedIn": "https://linkedin.com/company/corabin",
    "Instagram": "https://instagram.com/corabinagency",
    "Facebook": "https://facebook.com/61594918605124/",
    "X": "https://x.com/CorabinStudio",
    "Reddit": "https://reddit.com/user/CorabinHQ/",
    "Discord": "https://discord.gg/prUmeKj7E",
    "GitHub": "https://github.com/corabin",
}
EXPECTED_ORDER = list(SOCIAL_URLS)
VISIBLE_SOCIAL_LABELS = set(EXPECTED_ORDER) | {"Dribbble", "Dribble"}

# Role-to-node IDs were traced in the supplied ZIP. Node IDs are safer than
# current labels here because previous patch attempts changed some labels wrongly.
COMPONENTS = [
    (
        "framer-1as0clf",  # navigation Menu overlay social links
        "M",
        {
            "LinkedIn": "VnxdRlj0E",
            "Instagram": "r4ycf7uaO",
            "Facebook": "YDpYQWwZu",
            "X": "m_c_l35A5",
        },
    ),
    (
        "framer-3v64wr",  # footer social links
        "F",
        {
            "LinkedIn": "L0QTzmQ6X",
            "Instagram": "LbpZY69ZI",
            "Facebook": "R0qh8UJRV",
            "X": "ekF8lhxni",
        },
    ),
]

MAIN_BUNDLE_REL = Path(
    "framerusercontent.com/sites/46CYIm3dbxFoU3f63shpCX/script_main.CNn1uaXy.mjs"
)
PUBLIC_MAIN_BUNDLE_REL = Path(
    "public/framerusercontent.com/sites/46CYIm3dbxFoU3f63shpCX/script_main.CNn1uaXy.mjs"
)
MENU_MODULE_REL = Path(
    "framerusercontent.com/sites/46CYIm3dbxFoU3f63shpCX/https/framerusercontent.com/"
    "modules/jqiDLcNxPCv3ebpNVwF2/dPNVJYgScvEn5p9ibCnZ/gvLY5FfCM.js"
)
PUBLIC_MENU_MODULE_REL = Path("public") / MENU_MODULE_REL
FOOTER_MODULE_REL = Path(
    "framerusercontent.com/sites/46CYIm3dbxFoU3f63shpCX/https/framerusercontent.com/"
    "modules/zSrjPSGRsNYlmNmAgre9/BeJvMCfL4pQf5IKVF6T6/xVFoVRkDB.js"
)
PUBLIC_FOOTER_MODULE_REL = Path("public") / FOOTER_MODULE_REL

# Each file is expected to contain these social component arrays.
TARGET_FILES = [
    (MAIN_BUNDLE_REL, {"framer-1as0clf", "framer-3v64wr"}),
    (PUBLIC_MAIN_BUNDLE_REL, {"framer-1as0clf", "framer-3v64wr"}),
    (MENU_MODULE_REL, {"framer-1as0clf"}),
    (PUBLIC_MENU_MODULE_REL, {"framer-1as0clf"}),
    (FOOTER_MODULE_REL, {"framer-3v64wr"}),
    (PUBLIC_FOOTER_MODULE_REL, {"framer-3v64wr"}),
]


def skip_quoted_string(source: str, start: int) -> int:
    quote = source[start]
    i = start + 1
    while i < len(source):
        if source[i] == "\\":
            i += 2
            continue
        if source[i] == quote:
            return i + 1
        i += 1
    raise RuntimeError("Unterminated JavaScript string while scanning the bundle.")


def find_matching_bracket(source: str, open_index: int) -> int:
    pairs = {"(": ")", "[": "]", "{": "}"}
    opening = source[open_index]
    if opening not in pairs:
        raise RuntimeError(f"Expected an opening bracket, got {opening!r}.")
    stack = [pairs[opening]]
    i = open_index + 1

    while i < len(source):
        char = source[i]
        if char in ("'", '"', "`"):
            i = skip_quoted_string(source, i)
            continue
        if source.startswith("//", i):
            newline = source.find("\n", i + 2)
            i = len(source) if newline == -1 else newline + 1
            continue
        if source.startswith("/*", i):
            close = source.find("*/", i + 2)
            if close == -1:
                raise RuntimeError("Unterminated JavaScript block comment.")
            i = close + 2
            continue
        if char in pairs:
            stack.append(pairs[char])
        elif char in ")]}":
            if not stack or char != stack[-1]:
                expected = stack[-1] if stack else "no closing bracket expected"
                raise RuntimeError(
                    f"Unbalanced JavaScript bracket at character {i}; expected {expected!r}, got {char!r}."
                )
            stack.pop()
            if not stack:
                return i
        i += 1
    raise RuntimeError("Could not find a matching closing bracket in the runtime bundle.")


def split_array_items(array_body: str) -> list[str]:
    parts = []
    start = 0
    stack = []
    pairs = {"(": ")", "[": "]", "{": "}"}
    i = 0

    while i < len(array_body):
        char = array_body[i]
        if char in ("'", '"', "`"):
            i = skip_quoted_string(array_body, i)
            continue
        if array_body.startswith("//", i):
            newline = array_body.find("\n", i + 2)
            i = len(array_body) if newline == -1 else newline + 1
            continue
        if array_body.startswith("/*", i):
            close = array_body.find("*/", i + 2)
            if close == -1:
                raise RuntimeError("Unterminated JavaScript block comment.")
            i = close + 2
            continue
        if char in pairs:
            stack.append(pairs[char])
        elif char in ")]}":
            if not stack or char != stack[-1]:
                raise RuntimeError("Unexpected closing bracket while splitting social entries.")
            stack.pop()
        elif char == "," and not stack:
            item = array_body[start:i].strip()
            if item:
                parts.append(item)
            start = i + 1
        i += 1

    final_item = array_body[start:].strip()
    if final_item:
        parts.append(final_item)
    return parts


def extract_social_array(source: str, wrapper_class: str):
    marker_pattern = re.compile(
        r"className\s*:\s*(?:`"
        + re.escape(wrapper_class)
        + r"`|\""
        + re.escape(wrapper_class)
        + r"\"|'"
        + re.escape(wrapper_class)
        + r"')"
    )
    markers = list(marker_pattern.finditer(source))
    if len(markers) == 0:
        return None
    if len(markers) != 1:
        raise RuntimeError(
            f"Expected one {wrapper_class!r} component wrapper, found {len(markers)}."
        )

    pos = markers[0].start()
    children_match = re.search(r"children\s*:\s*\[", source[pos:])
    if not children_match:
        raise RuntimeError(f"Could not find a children array for {wrapper_class!r}.")

    open_index = pos + children_match.start() + children_match.group(0).rfind("[")
    close_index = find_matching_bracket(source, open_index)
    items = split_array_items(source[open_index + 1 : close_index])
    return open_index, close_index, items


def read_string_property(item: str, property_name: str) -> str | None:
    pattern = re.compile(
        re.escape(property_name) + r"\s*:\s*(?:`([^`]*)`|\"([^\"]*)\"|'([^']*)')"
    )
    matches = list(pattern.finditer(item))
    if len(matches) != 1:
        return None
    return next((group for group in matches[0].groups() if group is not None), None)


def visible_social_label(item: str) -> str | None:
    pattern = re.compile(r"children\s*:\s*(`([^`]*)`|\"([^\"]*)\"|'([^']*)')")
    found = []
    for match in pattern.finditer(item):
        label = next((g for g in match.groups()[1:] if g is not None), None)
        if label in VISIBLE_SOCIAL_LABELS:
            found.append(label)
    return found[0] if len(found) == 1 else None


def update_social_item(
    item: str,
    new_label: str,
    new_url: str,
    unique_prefix: str | None = None,
) -> str:
    # Replace just the link's href, regardless of whether the bundle uses
    # backticks (minified entry point) or quoted strings (component module).
    href_pattern = re.compile(r"(href\s*:\s*)([`\"'])([^`\"']*)(\2)")
    item, href_count = href_pattern.subn(
        lambda m: m.group(1) + m.group(2) + new_url + m.group(2),
        item,
        count=1,
    )
    if href_count != 1:
        raise RuntimeError(f"Expected exactly one href in component becoming {new_label}; found {href_count}.")

    # Replace the visible text label, including the historical spelling "Dribble".
    label_pattern = re.compile(
        r"(children\s*:\s*)([`\"'])(LinkedIn|Instagram|Dribbble|Dribble|Behance|Facebook|X|Reddit|Discord|GitHub)(\2)"
    )
    item, label_count = label_pattern.subn(
        lambda m: m.group(1) + m.group(2) + new_label + m.group(2),
        item,
        count=1,
    )
    if label_count != 1:
        raise RuntimeError(f"Could not safely identify the visible label for {new_label}.")

    # Fix the Framer component name if the attribute exists. This also corrects
    # the provided ZIP's LinkedIn row, which is incorrectly named "Facebook".
    name_pattern = re.compile(r'("data-framer-name"\s*:\s*)([`"\'])([^`"\']*)(\2)')
    item, _ = name_pattern.subn(
        lambda m: m.group(1) + m.group(2) + new_label + m.group(2),
        item,
        count=1,
    )

    if unique_prefix:
        for key, suffix in (("nodeId", "N"), ("layoutId", "L")):
            id_pattern = re.compile(
                r"(" + re.escape(key) + r"\s*:\s*)([`\"'])([^`\"']*)(\2)"
            )
            item, count = id_pattern.subn(
                lambda m: m.group(1) + m.group(2) + unique_prefix + suffix + m.group(2),
                item,
                count=1,
            )
            if count != 1:
                raise RuntimeError(f"Could not assign unique {key} to the new {new_label} item.")
    return item


def validate_social_array(source: str, wrapper_class: str) -> None:
    result = extract_social_array(source, wrapper_class)
    if result is None:
        raise RuntimeError(f"Required social array {wrapper_class!r} not found.")
    _open, _close, items = result
    labels = [visible_social_label(item) for item in items]
    if labels != EXPECTED_ORDER:
        raise RuntimeError(
            f"Order verification failed for {wrapper_class}: expected {EXPECTED_ORDER}, got {labels}."
        )

    for label, item in zip(EXPECTED_ORDER, items):
        href = read_string_property(item, "href")
        if href != SOCIAL_URLS[label]:
            raise RuntimeError(
                f"URL verification failed for {wrapper_class}/{label}: expected {SOCIAL_URLS[label]!r}, got {href!r}."
            )


def patch_one_array(source: str, wrapper_class: str, prefix: str, role_node_ids: dict[str, str]) -> tuple[str, str]:
    result = extract_social_array(source, wrapper_class)
    if result is None:
        return source, f"{wrapper_class}: not present in this component file"

    open_index, close_index, items = result
    labels = [visible_social_label(item) for item in items]

    if labels == EXPECTED_ORDER:
        validate_social_array(source, wrapper_class)
        return source, f"{wrapper_class}: already correct"

    if len(items) != 4:
        raise RuntimeError(
            f"{wrapper_class} has {len(items)} children, expected the original four. "
            "No guessing performed."
        )

    by_node_id = {}
    for item in items:
        node_id = read_string_property(item, "nodeId")
        if not node_id or node_id in by_node_id:
            raise RuntimeError(f"Could not uniquely identify node IDs in {wrapper_class}.")
        by_node_id[node_id] = item

    if set(by_node_id) != set(role_node_ids.values()):
        raise RuntimeError(
            f"Node IDs in {wrapper_class} differ from the supplied ZIP. "
            f"Expected {sorted(role_node_ids.values())}; found {sorted(by_node_id)}. "
            "No guessing performed."
        )

    correct = {}
    for semantic_label in ("LinkedIn", "Instagram", "Facebook", "X"):
        existing_item = by_node_id[role_node_ids[semantic_label]]
        correct[semantic_label] = update_social_item(
            existing_item, semantic_label, SOCIAL_URLS[semantic_label]
        )

    # Reuse the old Dribbble component as a visual template for Reddit, Discord,
    # and GitHub. Each clone receives unique Framer nodeId/layoutId values.
    short_id = {"Reddit": "Rddt", "Discord": "Dscrd", "GitHub": "GH"}
    for label in ("Reddit", "Discord", "GitHub"):
        correct[label] = update_social_item(
            correct["Facebook"],
            label,
            SOCIAL_URLS[label],
            unique_prefix=f"Crb{prefix}{short_id[label]}01",
        )

    new_items = [correct[label] for label in EXPECTED_ORDER]
    is_multiline = "\n" in source[open_index + 1 : close_index]
    if is_multiline:
        line_start = source.rfind("\n", 0, open_index) + 1
        property_line = source[line_start : source.find("\n", line_start)]
        base_indent = len(property_line) - len(property_line.lstrip())
        entry_indent = " " * (base_indent + 4)
        rebuilt_body = "\n" + entry_indent + (",\n" + entry_indent).join(new_items) + "\n" + (" " * base_indent)
    else:
        rebuilt_body = ",".join(new_items)

    source = source[: open_index + 1] + rebuilt_body + source[close_index:]
    validate_social_array(source, wrapper_class)
    return source, f"{wrapper_class}: repaired and verified seven platforms"


def patch_source(source: str, expected_wrappers: set[str]) -> tuple[str, list[str]]:
    actions = []
    found_wrappers = set()
    for wrapper_class, prefix, node_ids in COMPONENTS:
        result = extract_social_array(source, wrapper_class)
        if result is None:
            continue
        found_wrappers.add(wrapper_class)
        source, action = patch_one_array(source, wrapper_class, prefix, node_ids)
        actions.append(action)

    missing = expected_wrappers - found_wrappers
    if missing:
        raise RuntimeError(f"Expected component arrays not found: {sorted(missing)}.")

    for wrapper_class in expected_wrappers:
        validate_social_array(source, wrapper_class)
    return source, actions


def add_cache_busting(html: str) -> tuple[str, int]:
    pattern = re.compile(
        r"""(src=["'])(/framerusercontent\.com/sites/46CYIm3dbxFoU3f63shpCX/script_main\.CNn1uaXy\.mjs)(?:\?[^"']*)?(["'])"""
    )
    return pattern.subn(
        lambda m: f"{m.group(1)}{m.group(2)}?v={CACHE_VERSION}{m.group(3)}",
        html,
    )


def make_backup(path: Path, backup_root: Path, project_root: Path) -> None:
    destination = backup_root / path.relative_to(project_root)
    destination.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(path, destination)


def main() -> int:
    if not (PROJECT_ROOT / "vercel.json").is_file() or not (PROJECT_ROOT / "public").is_dir():
        print("ERROR: Put this script at tools/fix_runtime_socials.py inside the extracted project root.")
        return 2

    target_info = []
    for relative_path, expected_wrappers in TARGET_FILES:
        path = PROJECT_ROOT / relative_path
        if not path.is_file():
            print(f"ERROR: Required source file is missing: {relative_path}")
            return 2
        target_info.append((path, expected_wrappers))

    proposed: dict[Path, str] = {}
    try:
        for path, expected_wrappers in target_info:
            original = path.read_text(encoding="utf-8")
            updated, actions = patch_source(original, expected_wrappers)
            for action in actions:
                print(f"{path.relative_to(PROJECT_ROOT)} — {action}")
            proposed[path] = updated

        html_ref_count = 0
        html_file_count = 0
        for path in PROJECT_ROOT.rglob("*.html"):
            if ".git" in path.parts:
                continue
            original = path.read_text(encoding="utf-8", errors="replace")
            updated, count = add_cache_busting(original)
            if count:
                html_ref_count += count
                if updated != original:
                    proposed[path] = updated
                    html_file_count += 1

        if html_ref_count == 0:
            raise RuntimeError(
                "No HTML src references to script_main.CNn1uaXy.mjs were found."
            )

        for path, updated in proposed.items():
            if path.suffix.lower() in {".js", ".mjs"}:
                for wrapper_class in expected_wrapper_classes_for(path):
                    validate_social_array(updated, wrapper_class)

    except Exception as exc:
        print(f"\nERROR: {exc}")
        print("No project files have been written. Inspect the current bundle before retrying.")
        return 1

    timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    backup_root = PROJECT_ROOT.parent / f"{PROJECT_ROOT.name}-social-backups-{timestamp}"
    changed_files = []
    for path, updated in proposed.items():
        original = path.read_text(encoding="utf-8", errors="replace")
        if original != updated:
            changed_files.append(path)

    try:
        for path in changed_files:
            make_backup(path, backup_root, PROJECT_ROOT)
        for path in changed_files:
            path.write_text(proposed[path], encoding="utf-8")
    except Exception as exc:
        print(f"\nERROR while writing files: {exc}")
        print(f"Backups are located at: {backup_root}")
        return 1

    print("\n--- FINAL SOURCE VERIFICATION ---")
    for path, wrappers in target_info:
        content = path.read_text(encoding="utf-8")
        for wrapper in wrappers:
            validate_social_array(content, wrapper)
        print(f"PASS: {path.relative_to(PROJECT_ROOT)}")

    checked_html = 0
    for path in PROJECT_ROOT.rglob("*.html"):
        if ".git" in path.parts:
            continue
        text = path.read_text(encoding="utf-8", errors="replace")
        if "script_main.CNn1uaXy.mjs" in text:
            expected = f"script_main.CNn1uaXy.mjs?v={CACHE_VERSION}"
            if expected not in text:
                raise RuntimeError(f"Cache-busting reference failed: {path.relative_to(PROJECT_ROOT)}")
            checked_html += text.count(expected)

    print(f"PASS: cache-busting reference verified in {checked_html} HTML script tag(s)")
    print(f"Files changed: {len(changed_files)}")
    print(f"Backup folder: {backup_root}")
    print("Expected menu and footer order: " + " -> ".join(EXPECTED_ORDER))
    print("\nThese are source-level checks. Browser testing is still required before deployment.")
    return 0


def expected_wrapper_classes_for(path: Path) -> set[str]:
    relative = path.relative_to(PROJECT_ROOT).as_posix()
    if relative.endswith("gvLY5FfCM.js"):
        return {"framer-1as0clf"}
    if relative.endswith("xVFoVRkDB.js"):
        return {"framer-3v64wr"}
    # The main entry point has both components. HTML is not passed to this helper.
    if relative.endswith("script_main.CNn1uaXy.mjs"):
        return {"framer-1as0clf", "framer-3v64wr"}
    return set()


if __name__ == "__main__":
    sys.exit(main())
