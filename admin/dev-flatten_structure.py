#!/usr/bin/env python3
# chmod +x ./admin/dev-flatten_structure.py

# not yet done, for ref:
# ./admin/dev-flatten_structure.py appendix-1-more-on-how-our-system-works
# ./admin/dev-flatten_structure.py appendix-2-more-on-possible-mechanisms-for-change
# 3 - done
# 4 - done

import pathlib, re, sys

ROOT = pathlib.Path("docs")

def slugify(name):
    s = name.lower()
    s = re.sub(r'[^a-z0-9]+', '-', s).strip('-')
    return s

def read(p): return p.read_text(encoding="utf-8")

def strip_top_heading(md):
    # remove the first ATX heading line (H1/H2/...) if exists as this now redundant
    return re.sub(r'^\s{0,3}#{1,6}\s+.+?$', '', md, count=1, flags=re.M).lstrip()

def first_heading(md):
    m = re.search(r'^\s{0,3}#{1,6}\s+(.+?)\s*(\{#.*\})?$', md, re.M)
    return m.group(1).strip() if m else None

def flatten(dir_rel):
    d = ROOT / dir_rel
    assert d.is_dir(), f"Not a dir: {d}"
    index = d / "index.md"
    parts = []
    if index.exists():
        parts.append(read(index).rstrip() + "\n")
    for f in sorted(d.glob("*.md")):
        if f.name == "index.md":
            continue
        txt = read(f)
        title = first_heading(txt) or f.stem.replace("-", " ").title()
        anchor = slugify(f.stem)
        body = strip_top_heading(txt)
        parts.append(f"\n\n## {title} {{#{anchor}}}\n\n{body}".rstrip()+"\n")
    out = ROOT / f"{d.name}.md"
    out.write_text("\n".join(parts).strip()+"\n", encoding="utf-8")
    print(f"Wrote {out}")

    # produce redirect map entries (relative to docs/)
    # although likely not needed if links updated to new flat file
    maps = []
    for f in sorted(d.glob("*.md")):
        rel = f.relative_to(ROOT).as_posix()
        if f.name == "index.md":
            maps.append(f"{rel}: {d.name}.md")
        else:
            maps.append(f"{rel}: {d.name}.md#{slugify(f.stem)}")
    return maps




## use cases
# ./admin/dev-flatten_structure.py appendix-1-more-on-how-our-system-works
# ./admin/dev-flatten_structure.py appendix-2-more-on-possible-mechanisms-for-change

if __name__ == "__main__":
    targets = sys.argv[1:]  # e.g. admin/dev-flatten_structure.py imagining-a-centre-of-excellence
    if not targets:
        print("Usage: admin/flatten.py <dir> [<dir>...]  (relative to docs/)")
        sys.exit(2)
    allmaps = []
    for t in targets:
        allmaps += flatten(t)
    print("\n# redirect_maps to paste into mkdocs.yml:\n")
    for m in allmaps:
        print("  " + m)
