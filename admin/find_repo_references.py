#!/usr/bin/env python3
# chmod 755 admin/find_repo_references.py 

# use cases e.gs
# python admin/find_repo_references.py filename-withoutextension

# python find_repo_references.py filename-withoutextension --json-out refs.json # JSON report too
# python find_repo_references.py filename-withoutextension --root . --exclude .git node_modules site # restrict/expand scanning
# python find_repo_references.py filename-withoutextension --case-sensitive # case sensitive search


"""
find_repo_references.py

Search repo for:
  1) files whose names match given *base name* (case-insensitive), regardless of extension
  2) Text refs to that base name (e.g., imports, script tags, Worker() calls, generic mentions)

Works across tracked/untracked/ignored files. Does not require Git,
but if Git is available it will annotate whether found file is tracked/ignored.

Usage:
  python find_repo_references.py <base_name> [--root PATH] [--case-sensitive]
                                 [--max-bytes N] [--json-out FILE]
                                 [--no-file-scan] [--no-ref-scan]
                                 [--exclude DIR [DIR ...]]

Examples:
  python find_repo_references.py filename-withoutextension
  python find_repo_references.py filename-withoutextension --root . --json-out report.json
  python find_repo_references.py "feedback-items" --exclude .git node_modules site

Notes:
- By default, scanning excludes common heavy/build dirs. Use --exclude to customise
- "Base name" provided without f-extension; tool also looks for "<name>.js" in references.
- Reference scan reads text files (skips likely-binary files). Large files read up to --max-bytes per file.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
from typing import Dict, List, Optional, Tuple

DEFAULT_EXCLUDES = [
    ".git",
    "node_modules",
    "site",           # MkDocs output
    "dist",
    "build",
    ".venv",
    "venv",
    "env",
    "__pycache__",
    ".mypy_cache",
    ".pytest_cache",
    ".tox",
    ".ipynb_checkpoints",
]

TEXT_EXT_HINT = {
    ".py",".js",".ts",".tsx",".jsx",".mjs",".cjs",".css",".scss",".sass",
    ".html",".htm",".yml",".yaml",".json",".md",".markdown",".txt",".ini",
    ".toml",".xml",".csv",".tsv",".sql",".ps1",".psm1",".bat",".sh",".cfg",
    ".conf",".jinja",".j2",".njk",".rst",".vue"
}

def is_git_repo(path: str) -> bool:
    try:
        subprocess.run(["git", "-C", path, "rev-parse", "--is-inside-work-tree"],
                       check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        return True
    except Exception:
        return False

def git_repo_root(path: str) -> Optional[str]:
    try:
        result = subprocess.run(["git", "-C", path, "rev-parse", "--show-toplevel"],
                                check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        return result.stdout.strip()
    except Exception:
        return None

def git_is_tracked(path: str) -> Optional[bool]:
    try:
        subprocess.run(["git", "ls-files", "--error-unmatch", path],
                       check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        return True
    except subprocess.CalledProcessError:
        return False
    except Exception:
        return None

def git_is_ignored(path: str) -> Optional[bool]:
    try:
        r = subprocess.run(["git", "check-ignore", path],
                           stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        # exit code 0 means ignored, 1 means not ignored, >1 means error
        if r.returncode == 0:
            return True
        if r.returncode == 1:
            return False
        return None
    except Exception:
        return None

def is_probably_text_file(path: str, sample_size: int = 2048) -> bool:
    # Quick checks by extension first
    _, ext = os.path.splitext(path)
    if ext.lower() in TEXT_EXT_HINT:
        return True

    try:
        with open(path, "rb") as f:
            chunk = f.read(sample_size)
        if not chunk:
            return True  # empty --> treat as text
        # Heuristic: binary files often have NUL bytes
        if b"\x00" in chunk:
            return False
        # Treat as text by default
        return True
    except Exception:
        # can't read it, skip from content scan
        return False

def read_text_safely(path: str, max_bytes: int) -> str:
    try:
        with open(path, "rb") as f:
            data = f.read(max_bytes)
        return data.decode("utf-8", errors="ignore")
    except Exception:
        return ""

def build_reference_patterns(base: str, case_sensitive: bool) -> List[re.Pattern]:
    # Build few robust patterns:
    #  - raw base name (e.g., "filename-withoutextension")
    #  - base + extension .js (common)
    #  - script src, import, new Worker(...), URL-like references
    flags = 0 if case_sensitive else re.IGNORECASE

    escaped = re.escape(base)

    patterns = [
        re.compile(rf"{escaped}", flags),  # raw
        re.compile(rf"{escaped}\.js\b", flags),
        re.compile(rf"""<script[^>]+src=["'][^"']*{escaped}[^"']*["']""", flags),
        re.compile(rf"""new\s+Worker\s*\(\s*["'][^"']*{escaped}[^"']*["']""", flags),
        re.compile(rf"""import\s+[^;]*["'][^"']*{escaped}[^"']*["']""", flags),
        re.compile(rf"""from\s+["'][^"']*{escaped}[^"']*["']""", flags),
        re.compile(rf"""require\s*\(\s*["'][^"']*{escaped}[^"']*["']\s*\)""", flags),
        re.compile(rf"""url\(\s*["']?[^"')]*{escaped}[^"')]*["']?\s*\)""", flags),
    ]
    return patterns

def walk_files(root: str, excludes: List[str]) -> List[str]:
    exset = set(os.path.normpath(e) for e in excludes)
    results = []
    for dirpath, dirnames, filenames in os.walk(root):
        # prune excludes
        pruned = []
        for d in list(dirnames):
            rel = os.path.normpath(os.path.relpath(os.path.join(dirpath, d), root))
            if any(rel == e or rel.startswith(e + os.sep) for e in exset):
                pruned.append(d)
        for d in pruned:
            dirnames.remove(d)

        for fn in filenames:
            full = os.path.join(dirpath, fn)
            results.append(full)
    return results

def main():
    ap = argparse.ArgumentParser(description="Find physical files and textual references to a base name within a repository.")
    ap.add_argument("base_name", help="Base name to search for (no extension). Example: filename-withoutextension")
    ap.add_argument("--root", default=".", help="Root directory to scan (default: current directory)")
    ap.add_argument("--case-sensitive", action="store_true", help="Case sensitive search (default: case-insensitive)")
    ap.add_argument("--max-bytes", type=int, default=2_000_000, help="Max bytes to read per file for reference scan (default: 2,000,000)")
    ap.add_argument("--json-out", default=None, help="Optional path to write JSON results")
    ap.add_argument("--no-file-scan", action="store_true", help="Disable filename scan")
    ap.add_argument("--no-ref-scan", action="store_true", help="Disable content/reference scan")
    ap.add_argument("--exclude", nargs="*", default=DEFAULT_EXCLUDES, help="Directories to exclude (relative to root). Default excludes common build caches.")
    args = ap.parse_args()

    root = os.path.abspath(args.root)
    base = args.base_name
    case_sensitive = args.case_sensitive
    excludes = args.exclude

    if not os.path.isdir(root):
        print(f"Root not found or not a directory: {root}", file=sys.stderr)
        sys.exit(2)

    if is_git_repo(root):
        repo_root = git_repo_root(root) or root
    else:
        repo_root = root

    all_files = walk_files(repo_root, excludes)

    results: Dict[str, List[dict]] = {
        "file_matches": [],
        "reference_matches": []
    }

    # Filename matches
    if not args.no_file_scan:
        for path in all_files:
            name = os.path.basename(path)
            if case_sensitive:
                hit = base in name
            else:
                hit = base.lower() in name.lower()
            if hit:
                tracked = git_is_tracked(path)
                ignored = git_is_ignored(path)
                results["file_matches"].append({
                    "path": os.path.relpath(path, repo_root),
                    "tracked": tracked,
                    "ignored": ignored
                })

    # Reference matches
    if not args.no_ref_scan:
        patterns = build_reference_patterns(base, case_sensitive)
        for path in all_files:
            # Skip binary-ish files
            if not is_probably_text_file(path):
                continue
            text = read_text_safely(path, args.max_bytes)
            if not text:
                continue

            matches_here = []
            # Search line by line for line numbers + small snippet
            for i, line in enumerate(text.splitlines(), start=1):
                for pat in patterns:
                    m = pat.search(line)
                    if m:
                        snippet = line.strip()
                        if len(snippet) > 240:
                            # keep match centered-ish
                            s, e = m.span()
                            left = max(0, s - 80)
                            right = min(len(line), e + 80)
                            snippet = (line[left:right]).strip()
                            if left > 0:
                                snippet = "… " + snippet
                            if right < len(line):
                                snippet = snippet + " …"

                        matches_here.append({
                            "line": i,
                            "pattern": pat.pattern,
                            "snippet": snippet
                        })
                        break  # one pattern hit per line is enough

            if matches_here:
                results["reference_matches"].append({
                    "path": os.path.relpath(path, repo_root),
                    "hits": matches_here
                })

    # Output
    print("=" * 80)
    print(f"Search root: {repo_root}")
    print(f"Base name  : {base!r} (case {'sensitive' if case_sensitive else 'insensitive'})")
    print(f"Excludes   : {', '.join(excludes) if excludes else '(none)'}")
    print("=" * 80)

    print("\n--- FILE NAME MATCHES ---")
    if results["file_matches"]:
        for fm in sorted(results["file_matches"], key=lambda x: x["path"].lower()):
            t = "tracked" if fm["tracked"] else ("untracked" if fm["tracked"] is False else "unknown")
            ign = "ignored" if fm["ignored"] else ("not-ignored" if fm["ignored"] is False else "unknown")
            print(f"{fm['path']}  [{t}, {ign}]")
    else:
        print("(none)")

    print("\n--- REFERENCE MATCHES (by content) ---")
    if results["reference_matches"]:
        for rm in sorted(results["reference_matches"], key=lambda x: x["path"].lower()):
            print(rm["path"])
            for hit in rm["hits"][:100]:  # cap displayed hits per file
                print(f"  L{hit['line']:>6} : {hit['snippet']}")
            extra = len(rm["hits"]) - 100
            if extra > 0:
                print(f"  ... {extra} more hits")
    else:
        print("(none)")

    # JSON output if requested
    if args.json_out:
        try:
            with open(args.json_out, "w", encoding="utf-8") as f:
                json.dump(results, f, ensure_ascii=False, indent=2)
            print(f"\nJSON written to: {args.json_out}")
        except Exception as e:
            print(f"\n[warn] Could not write JSON: {e}", file=sys.stderr)

if __name__ == "__main__":
    main()
