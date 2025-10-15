#!/usr/bin/env python3
# chmod +x ./admin/dev-normalise_image_filenames.py

## use case egs
# # Dry-run: see what would change
# ./admin/dev-normalise_image_filenames.py
# # Apply renames (no MD edits)
# ./admin/dev-normalise_image_filenames.py --apply
# #Apply renames and update Markdown links under docs/
# python ./admin/dev-normalise_image_filenames.py --apply --update-md
# # chmod +x ./admin/dev-normalise_image_filenames.py


import argparse, re
from pathlib import Path
from urllib.parse import quote

def slugify(stem: str) -> str:
    s = stem.lower()
    s = re.sub(r'[^a-z0-9]+', '-', s).strip('-')
    return s or 'file'

def build_mapping(img_dir: Path):
    mapping = {}
    taken = {p.name for p in img_dir.iterdir() if p.is_file()}
    for p in sorted(img_dir.iterdir()):
        if not p.is_file():
            continue
        old = p.name
        stem = p.stem
        ext  = p.suffix.lower()  # normalise extension case
        base = slugify(stem) + ext
        new  = base

        # ensure unique (avoid collisions with existing files)
        i = 1
        while (new in taken) and (new != old):
            new = f"{slugify(stem)}-{i}{ext}"
            i += 1

        taken.add(new)
        if new != old:
            mapping[old] = new
    return mapping

def apply_mapping(img_dir: Path, mapping: dict, dry_run: bool):
    for old, new in mapping.items():
        src = img_dir / old
        dst = img_dir / new
        print(f"{'RENAME' if not dry_run else 'DRY   '}  {old}  ->  {new}")
        if not dry_run:
            src.rename(dst)

def update_markdown_links(docs_dir: Path, mapping: dict, dry_run: bool):
    if not mapping:
        print("No renamed files; skipping Markdown update")
        return
    changed_files = 0
    for md in docs_dir.rglob("*.md"):
        text = md.read_text(encoding="utf-8")
        new_text = text
        for old, new in mapping.items():
            # Replace both raw and URL-encoded under assets/img/
            raw_old = f"assets/img/{old}"
            raw_new = f"assets/img/{new}"
            enc_old = f"assets/img/{quote(old)}"
            enc_new = f"assets/img/{quote(new)}"
            new_text = new_text.replace(raw_old, raw_new).replace(enc_old, enc_new)
        if new_text != text:
            changed_files += 1
            print(f"{'WRITE' if not dry_run else 'DRY   '}  {md}")
            if not dry_run:
                md.write_text(new_text, encoding="utf-8")
    print(f"Markdown updates: {changed_files} file(s) {'would change' if dry_run else 'updated'}.")

def main():
    ap = argparse.ArgumentParser(description="Lowercase + hyphenate filenames in docs/assets/img and optionally update Markdown links")
    ap.add_argument("--img-dir", default="docs/assets/img", help="Images dir (default: docs/assets/img)")
    ap.add_argument("--docs-dir", default="docs", help="Docs root to update links (default: docs)")
    ap.add_argument("--apply", action="store_true", help="Actually perform rename (default: dry-run)")
    ap.add_argument("--update-md", action="store_true", help="Also rewrite Markdown links under docs/")
    args = ap.parse_args()

    img_dir = Path(args.img_dir)
    docs_dir = Path(args.docs_dir)

    if not img_dir.exists():
        raise SystemExit(f"Not found: {img_dir}")

    mapping = build_mapping(img_dir)
    if not mapping:
        print("Nothing to rename; all filenames already good to go :)")
        return

    print("Proposed rename:")
    for old, new in mapping.items():
        print(f"  {old}  ->  {new}")

    apply_mapping(img_dir, mapping, dry_run=not args.apply)

    if args.update_md:
        update_markdown_links(docs_dir, mapping, dry_run=not args.apply)

if __name__ == "__main__":
    main()
