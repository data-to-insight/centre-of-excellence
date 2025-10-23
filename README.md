# centre-of-excellence

[![Pages](https://img.shields.io/website?url=https%3A%2F%2Fdata-to-insight.github.io%2Fcentre-of-excellence%2F&label=pages)](https://data-to-insight.github.io/centre-of-excellence/) ![Last commit](https://img.shields.io/github/last-commit/data-to-insight/centre-of-excellence) [![License](https://img.shields.io/github/license/data-to-insight/centre-of-excellence)](LICENSE)

Static docs site built with MkDocs -Material

**Live site(this Repo not CoE master site):** https://data-to-insight.github.io/centre-of-excellence/

## Quick start

At the Codespaces terminal command line use
```bash
python3 -m pip install --upgrade pip
pip install -r requirements.txt
mkdocs serve
```
if you find that mkdocs serve doesn't work out of the box use the following
```bash
python3 -m mkdocs serve -a 0.0.0.0:8000
```

## Build & deploy

For ref only. Git actions/workflow will do all this, no action needed whilst updating the site via Codespaces.

- `mkdocs build`---> outputs static site to `site/`
- GitHub Actions builds on pushes to `main` and publishes to GitHub Pages.

## Project structure (summary)

```text
centre-of-excellence/
├── admin/
│   ├── dev-flatten_structure.py
│   ├── dev-gen_repo_structure.py
│   ├── dev-generate_README.py
│   ├── dev-normalise_image_filenames.py
│   ├── ref-repo_structure_overview.md
│   └── ref-repo_structure_overview.txt
├── overrides/
│   └── partials/
│       └── integrations/
├── LICENSE
├── README.md
├── mkdocs.yml
└── requirements.txt
```

## Contributing

PRs welcome. For major changes, please open an issue.

## License

See [LICENSE](LICENSE).


<sub>Generated 2025-10-15 11:48 UTC</sub>
