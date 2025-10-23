#!/usr/bin/env python3
# chmod +x ./admin/dev-generate_README.py

# # Generate (dry run ---> README.generated.md)
# python ./admin/dev-generate_README.py
# # Generate and write README.md
# python ./admin/dev-generate_README.py --apply
# # Include docs/ tree and go deeper
# python ./admin/dev-generate_README.py --apply --include-docs --max-depth 3


"""
Generate simple README.md for repo:
- Auto-detect owner/repo from git remote (GitHub)
- badges (Actions, Pages, License, Last commit, optional Python)
- Include project structure (depth-limited), (from gen repo_structure)
- Dry-run is default---> README.generated.md. or just use --apply

Use:
  python admin/dev-generate_README.py
  python admin/dev-generate_README.py --apply
  python admin/dev-generate_README.py --max-depth 2 --include-docs --apply
"""

import argparse
import os
import re
import subprocess
from pathlib import Path
from urllib.parse import quote
from datetime import datetime
try:
    # Py 3.11+
    from datetime import UTC
except ImportError:  # Py < 3.11
    from datetime import timezone as _tz
    UTC = _tz.utc


ROOT = Path(__file__).resolve().parents[1]  # repo root 
DEFAULT_BRANCH = "main"

# ---- Exclusde  ----
EXCLUDE_DIRS = {
    ".git", "__pycache__", ".vscode", ".idea", ".github", ".pytest_cache",
    ".env", "venv", "d2i_dev", "site", "workers", "lunr", "node_modules"
}
EXCLUDE_FILES = {".DS_Store", "Thumbs.db"}

def run(cmd):
    return subprocess.check_output(cmd, text=True).strip()

def detect_owner_repo():
    """
    Parse `git remote get-url origin` for GitHub-style remotes.
    Supports:
      - git@github.com:owner/repo.git
      - https://github.com/owner/repo.git
      - ssh://git@github.com/owner/repo.git
    """
    try:
        url = run(["git", "config", "--get", "remote.origin.url"])
    except Exception:
        return None, None

    m = re.search(r"github\.com[:/](?P<owner>[^/]+)/(?P<repo>[\w.\-]+)(?:\.git)?$", url)
    if m:
        return m.group("owner"), m.group("repo")
    return None, None

def detect_workflow_file():
    wf_dir = ROOT / ".github" / "workflows"
    if not wf_dir.exists():
        return None
    # Prefer pages/mkdocs workflow if present
    preferred = []
    others = []
    for f in wf_dir.glob("*.yml"):
        if "page" in f.stem or "mkdocs" in f.stem or "deploy" in f.stem:
            preferred.append(f.name)
        else:
            others.append(f.name)
    if preferred:
        return sorted(preferred)[0]
    return sorted(others)[0] if others else None

def detect_license_badge(owner, repo):
    # Use shields GitHub license badge 
    return f"[![License](https://img.shields.io/github/license/{owner}/{repo})](LICENSE)"

def detect_actions_badge(owner, repo, workflow_file, branch=DEFAULT_BRANCH):
    if not workflow_file:
        return None
    # Standard GitHub Actions workflow badge
    return f"[![Build](https://github.com/{owner}/{repo}/actions/workflows/{workflow_file}/badge.svg?branch={branch})](https://github.com/{owner}/{repo}/actions/workflows/{workflow_file})"

def detect_pages_badge(owner, repo):
    url = f"https://{owner}.github.io/{repo}/"
    return f"[![Pages](https://img.shields.io/website?url={quote(url, safe='')}&label=pages)]({url})"

def detect_last_commit_badge(owner, repo):
    return f"![Last commit](https://img.shields.io/github/last-commit/{owner}/{repo})"

def detect_python_badge():
    """
    Try to detect requires-python in pyproject.toml or a .python-version file.
    Returns a shields badge or None.
    """
    pyproject = ROOT / "pyproject.toml"
    if pyproject.exists():
        txt = pyproject.read_text(encoding="utf-8")
        m = re.search(r"requires-python\s*=\s*\"([^\"]+)\"", txt)
        if m:
            ver = m.group(1).replace(">=", "≥ ").replace("~=", "≈ ")
            safe = m.group(1).replace(">=", "").replace("~=", "")
            return f"![Python](https://img.shields.io/badge/python-{quote(safe)}-blue?logo=python)"
    pyver = ROOT / ".python-version"
    if pyver.exists():
        v = pyver.read_text(encoding="utf-8").strip()
        return f"![Python](https://img.shields.io/badge/python-{quote(v)}-blue?logo=python)"
    # Fallback: look in requirements.txt? 
    return None

def build_tree(start: Path, prefix: str = "", depth: int = 0, max_depth: int = 2, include_docs: bool = False):
    """
    Build a simple 'tree' listing (text) up to max_depth.
    include_docs=False: hide docs/ unless explicitly requested.
    """
    lines = []
    if depth > max_depth:
        return lines
    try:
        entries = sorted(os.listdir(start))
    except PermissionError:
        return lines

    files = []
    dirs = []
    for e in entries:
        p = start / e
        if p.is_dir():
            if e in EXCLUDE_DIRS:
                continue
            if e == "docs" and not include_docs and depth == 0:
                # Skip root docs/ unless incl
                continue
            dirs.append(e)
        else:
            if e in EXCLUDE_FILES:
                continue
            files.append(e)

    for i, d in enumerate(dirs):
        connector = "├── " if i < len(dirs) - 1 or files else "└── "
        lines.append(prefix + connector + d + "/")
        extension = "│   " if i < len(dirs) - 1 or files else "    "
        lines.extend(build_tree(start / d, prefix + extension, depth + 1, max_depth, include_docs))

    for i, f in enumerate(files):
        connector = "├── " if i < len(files) - 1 else "└── "
        lines.append(prefix + connector + f)

    return lines

def read_repo_name():
    return ROOT.name

def read_one_line_description():
    # Fallback placeholder
    return "Static docs site built with MkDocs -Material"

def make_readme(owner, repo, max_depth=2, include_docs=False):
    repo_name = read_repo_name()
    desc = read_one_line_description()
    wf = detect_workflow_file()

    badges = []
    if owner and repo:
        a = detect_actions_badge(owner, repo, wf)
        if a: badges.append(a)
        badges.append(detect_pages_badge(owner, repo))
        badges.append(detect_last_commit_badge(owner, repo))
        badges.append(detect_license_badge(owner, repo))
    py = detect_python_badge()
    if py: badges.insert(0, py)

    # Build tree
    tree = [f"{repo_name}/"] + build_tree(ROOT, max_depth=max_depth, include_docs=include_docs)

    # Site URL (best guess)
    site_url = f"https://{owner}.github.io/{repo}/" if (owner and repo) else ""

    content = []
    content.append(f"# {repo_name}\n")
    if badges:
        content.append(" ".join(badges) + "\n")
    content.append(f"{desc}\n")

    if site_url:
        content.append(f"**Live site(this Repo not CoE master site):** {site_url}\n")

    content.append("## Quick start\n")
    content.append("```bash\npip install -r requirements.txt\nmkdocs serve\n```\n")
    content.append("If 'mkdocs serve' doesn't work, to preview the site use the following instead\n")
    content.append("```bash\npython3 -m mkdocs serve -a 0.0.0.0:8000```\n\n")


    content.append("## Build & deploy\n")
    content.append("- `mkdocs build`---> outputs static site to `site/`\n"
                   "- GitHub Actions builds on pushes to `main` and publishes to GitHub Pages.\n")

    content.append("## Project structure (summary)\n")
    content.append("```text")
    content.append("\n".join(tree))
    content.append("```\n")

    # sections can fill later
    content.append("## Contributing\n")
    content.append("PRs welcome. For major changes, please open an issue.\n")

    # License hint
    if (ROOT / "LICENSE").exists():
        content.append("## License\n")
        content.append("See [LICENSE](LICENSE).\n")

    # Footer/gen timestamp
    now_utc = datetime.now(UTC)
    content.append(f"\n<sub>Generated {now_utc.strftime('%Y-%m-%d %H:%M UTC')}</sub>\n")


    return "\n".join(content)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--apply", action="store_true", help="Write README.md (default writes README.generated.md)")
    ap.add_argument("--max-depth", type=int, default=2, help="Max depth of structure tree (default 2)")
    ap.add_argument("--include-docs", action="store_true", help="Include docs/ tree in the summary")
    args = ap.parse_args()

    owner, repo = detect_owner_repo()
    readme = make_readme(owner, repo, max_depth=args.max_depth, include_docs=args.include_docs)

    out = ROOT / ("README.md" if args.apply else "README.generated.md")
    out.write_text(readme, encoding="utf-8")
    print(f"Wrote {out}")

if __name__ == "__main__":
    main()
