#!/usr/bin/env python3
"""
generate_book.py — Convertit les docs MkDocs de Terre Natale en PDF imprimable.

Usage:
    python3 tools/generate_book.py                        # liste les sections disponibles
    python3 tools/generate_book.py "Règles de Base"       # génère le PDF d'une section
    python3 tools/generate_book.py all                    # génère tous les livres
    python3 tools/generate_book.py "Règles de Base" --output regles.pdf
    python3 tools/generate_book.py "Règles de Base" --no-toc  # sans table des matières

Dépendances: weasyprint, markdown, pyyaml (pip install weasyprint markdown pyyaml)
"""

import argparse
import base64
import mimetypes
import os
import re
import sys
from pathlib import Path

import markdown
import yaml
from weasyprint import HTML, CSS

# ─── Chemins ──────────────────────────────────────────────────────────────────

REPO_ROOT = Path(__file__).parent.parent
DOCS_DIR = REPO_ROOT / "docs"
MKDOCS_YML = REPO_ROOT / "mkdocs.yml"
OUTPUT_DIR = REPO_ROOT / "tools" / "output"

# ─── CSS du livre ─────────────────────────────────────────────────────────────

BOOK_CSS = """
@import url('data:text/css,');

@page {
    size: A4;
    margin: 20mm 20mm 25mm 25mm;

    @bottom-center {
        content: counter(page);
        font-family: 'Georgia', serif;
        font-size: 9pt;
        color: #666;
    }
    @top-left {
        content: string(section-title);
        font-family: 'Georgia', serif;
        font-size: 8pt;
        color: #888;
        font-style: italic;
    }
    @top-right {
        content: "Terre Natale";
        font-family: 'Georgia', serif;
        font-size: 8pt;
        color: #888;
        font-style: italic;
    }
}

@page :first {
    margin-top: 0;
    @top-left { content: none; }
    @top-right { content: none; }
    @bottom-center { content: none; }
}

@page chapter-start {
    @top-left { content: none; }
    @top-right { content: none; }
}

/* ── Réinitialisation et base ── */
* { box-sizing: border-box; margin: 0; padding: 0; }

body {
    font-family: 'Georgia', 'Times New Roman', serif;
    font-size: 10.5pt;
    line-height: 1.65;
    color: #1a1a1a;
    text-align: justify;
    hyphens: auto;
}

/* ── Page de titre ── */
.cover-page {
    page-break-after: always;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 260mm;
    text-align: center;
    background: #f7f3ee;
}

.cover-title {
    font-family: 'Georgia', serif;
    font-size: 36pt;
    font-weight: bold;
    color: #2c1810;
    margin-bottom: 8mm;
    letter-spacing: 2px;
}

.cover-subtitle {
    font-family: 'Georgia', serif;
    font-size: 18pt;
    color: #5a3e2b;
    font-style: italic;
    margin-bottom: 20mm;
}

.cover-rule {
    width: 80mm;
    height: 2px;
    background: #8b5e3c;
    margin: 8mm auto;
}

/* ── Table des matières ── */
.toc-page {
    page-break-after: always;
}

.toc-page h2 {
    font-size: 18pt;
    color: #2c1810;
    border-bottom: 2px solid #8b5e3c;
    padding-bottom: 3mm;
    margin-bottom: 8mm;
}

.toc-entry {
    display: flex;
    align-items: baseline;
    margin-bottom: 3pt;
}

.toc-entry-h1 {
    font-size: 11pt;
    font-weight: bold;
    color: #2c1810;
    margin-top: 4pt;
}

.toc-entry-h2 {
    font-size: 10pt;
    padding-left: 8mm;
    color: #333;
}

.toc-entry-h3 {
    font-size: 9pt;
    padding-left: 16mm;
    color: #555;
}

.toc-dots {
    flex: 1;
    border-bottom: 1px dotted #bbb;
    margin: 0 3mm 2pt;
}

.toc-page-num {
    font-size: 9pt;
    color: #555;
    white-space: nowrap;
}

/* ── Chapitres ── */
.chapter {
    page-break-before: always;
    string-set: section-title content(text, before);
}

.chapter:first-child {
    page-break-before: avoid;
}

/* ── Titres ── */
h1 {
    font-family: 'Georgia', serif;
    font-size: 22pt;
    font-weight: bold;
    color: #2c1810;
    margin-top: 0;
    margin-bottom: 6mm;
    padding-bottom: 3mm;
    border-bottom: 2px solid #8b5e3c;
    page-break-after: avoid;
    string-set: section-title content();
}

h2 {
    font-family: 'Georgia', serif;
    font-size: 15pt;
    font-weight: bold;
    color: #3d2010;
    margin-top: 7mm;
    margin-bottom: 3mm;
    padding-bottom: 1mm;
    border-bottom: 1px solid #c8a882;
    page-break-after: avoid;
}

h3 {
    font-family: 'Georgia', serif;
    font-size: 12pt;
    font-weight: bold;
    color: #4a2c18;
    margin-top: 5mm;
    margin-bottom: 2mm;
    page-break-after: avoid;
}

h4 {
    font-family: 'Georgia', serif;
    font-size: 10.5pt;
    font-weight: bold;
    font-style: italic;
    color: #5a3a22;
    margin-top: 4mm;
    margin-bottom: 1.5mm;
    page-break-after: avoid;
}

h5, h6 {
    font-size: 10pt;
    font-weight: bold;
    color: #5a3a22;
    margin-top: 3mm;
    margin-bottom: 1mm;
}

/* ── Texte ── */
p {
    margin-bottom: 2.5mm;
    orphans: 2;
    widows: 2;
}

strong { color: #2c1810; }
em { font-style: italic; }

/* ── Listes ── */
ul, ol {
    margin: 2mm 0 2.5mm 6mm;
    padding-left: 5mm;
}

li {
    margin-bottom: 1mm;
    orphans: 2;
}

ul li::marker { color: #8b5e3c; }

/* ── Tables ── */
table {
    width: 100%;
    border-collapse: collapse;
    margin: 4mm 0;
    font-size: 9.5pt;
    page-break-inside: avoid;
}

thead {
    background-color: #5a3e2b;
    color: #fff;
}

th {
    padding: 2mm 3mm;
    text-align: left;
    font-weight: bold;
    border: 1px solid #4a2c18;
}

td {
    padding: 1.5mm 3mm;
    border: 1px solid #c8a882;
    vertical-align: top;
}

tr:nth-child(even) td {
    background-color: #faf6f1;
}

/* ── Admonitions (MkDocs Material) ── */
.admonition {
    border-radius: 3px;
    margin: 4mm 0;
    padding: 3mm 4mm;
    page-break-inside: avoid;
    border-left: 4px solid #888;
    background: #f5f5f5;
}

.admonition-title {
    font-weight: bold;
    font-size: 9.5pt;
    margin-bottom: 1.5mm;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.admonition.note, .admonition.abstract, .admonition.summary {
    border-left-color: #4a90d9;
    background: #eef4fd;
}
.admonition.note .admonition-title { color: #2a6099; }

.admonition.tip, .admonition.hint, .admonition.important {
    border-left-color: #00a86b;
    background: #edfaf4;
}
.admonition.tip .admonition-title { color: #007a50; }

.admonition.warning, .admonition.caution, .admonition.attention {
    border-left-color: #e6a817;
    background: #fffbee;
}
.admonition.warning .admonition-title { color: #a07010; }

.admonition.danger, .admonition.error {
    border-left-color: #d9534f;
    background: #fdf0f0;
}
.admonition.danger .admonition-title { color: #9e2020; }

.admonition.info, .admonition.todo {
    border-left-color: #17a2b8;
    background: #edf8fb;
}
.admonition.info .admonition-title { color: #0e7a8c; }

.admonition.example {
    border-left-color: #9b59b6;
    background: #f5eefb;
}
.admonition.example .admonition-title { color: #6c3483; }

.admonition.quote, .admonition.cite {
    border-left-color: #999;
    background: #f5f5f5;
}

/* ── Code ── */
code {
    font-family: 'Courier New', monospace;
    font-size: 9pt;
    background: #f0ebe4;
    padding: 0 1.5pt;
    border-radius: 2px;
    color: #4a2c18;
}

pre {
    background: #f5f0ea;
    border: 1px solid #d4b896;
    border-radius: 3px;
    padding: 3mm 4mm;
    margin: 3mm 0;
    overflow-x: auto;
    page-break-inside: avoid;
}

pre code {
    background: none;
    padding: 0;
    font-size: 8.5pt;
}

/* ── Images ── */
img {
    max-width: 100%;
    height: auto;
    display: block;
    margin: 4mm auto;
}

/* ── Liens (pas d'underline dans le livre) ── */
a {
    color: #5a3e2b;
    text-decoration: none;
}

/* ── Séparateurs ── */
hr {
    border: none;
    border-top: 1px solid #c8a882;
    margin: 5mm 0;
}

/* ── Blockquotes ── */
blockquote {
    border-left: 3px solid #c8a882;
    padding-left: 4mm;
    margin: 3mm 0 3mm 3mm;
    color: #555;
    font-style: italic;
}
"""

# ─── Utilitaires ──────────────────────────────────────────────────────────────

def image_to_data_uri(img_path: Path) -> str:
    """Encode une image en base64 data URI."""
    mime, _ = mimetypes.guess_type(str(img_path))
    if mime is None:
        mime = "image/png"
    with open(img_path, "rb") as f:
        data = base64.b64encode(f.read()).decode()
    return f"data:{mime};base64,{data}"


def fix_image_paths(html: str, md_file: Path) -> str:
    """Remplace les chemins d'images relatifs par des data URIs."""
    md_dir = md_file.parent

    def replace_src(match):
        src = match.group(1)
        if src.startswith(("http://", "https://", "data:")):
            return match.group(0)
        img_path = (md_dir / src).resolve()
        if img_path.exists():
            return f'src="{image_to_data_uri(img_path)}"'
        return match.group(0)

    return re.sub(r'src="([^"]+)"', replace_src, html)


def slugify(text: str) -> str:
    """Transforme un titre en ID HTML utilisable comme ancre."""
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_-]+', '-', text)
    return text.strip('-')


# ─── Parsing de mkdocs.yml ────────────────────────────────────────────────────

def flatten_nav(nav_item, section_name=None):
    """Extrait récursivement les fichiers .md d'une entrée nav."""
    files = []
    if isinstance(nav_item, str):
        if nav_item.endswith(".md"):
            files.append(nav_item)
    elif isinstance(nav_item, dict):
        for title, value in nav_item.items():
            files.extend(flatten_nav(value, section_name))
    elif isinstance(nav_item, list):
        for item in nav_item:
            files.extend(flatten_nav(item, section_name))
    return files


def load_sections():
    """Charge mkdocs.yml et retourne {section_name: [fichiers .md]}."""
    with open(MKDOCS_YML, encoding="utf-8") as f:
        config = yaml.safe_load(f)

    sections = {}
    for nav_item in config.get("nav", []):
        if isinstance(nav_item, dict):
            for title, content in nav_item.items():
                files = flatten_nav(content)
                if files:
                    sections[title] = files
    return sections


# ─── Conversion Markdown → HTML ──────────────────────────────────────────────

MD_EXTENSIONS = [
    "admonition",
    "tables",
    "attr_list",
    "toc",
    "fenced_code",
    "footnotes",
    "def_list",
    "abbr",
    "nl2br",
]

MD_EXT_CONFIGS = {
    "toc": {
        "permalink": False,
        "toc_depth": 3,
    }
}


def convert_md_file(md_path: Path) -> tuple[str, list]:
    """
    Convertit un fichier .md en HTML.
    Retourne (html_body, toc_entries) où toc_entries = [(level, title, anchor), ...]
    """
    if not md_path.exists():
        return f"<p><em>Fichier manquant : {md_path}</em></p>", []

    text = md_path.read_text(encoding="utf-8")

    md = markdown.Markdown(
        extensions=MD_EXTENSIONS,
        extension_configs=MD_EXT_CONFIGS,
    )
    html = md.convert(text)
    html = fix_image_paths(html, md_path)

    # Extraire les titres pour la table des matières
    toc_entries = []
    for match in re.finditer(r'<h([123])[^>]*>(.*?)</h\1>', html, re.DOTALL):
        level = int(match.group(1))
        raw_title = re.sub(r'<[^>]+>', '', match.group(2)).strip()
        toc_entries.append((level, raw_title))

    return html, toc_entries


# ─── Construction du livre ────────────────────────────────────────────────────

def build_book_html(book_title: str, section_name: str, md_files: list[str],
                    include_toc: bool = True) -> str:
    """Assemble le HTML complet du livre."""

    chapters_html = []
    all_toc = []

    for rel_path in md_files:
        md_path = DOCS_DIR / rel_path
        html_body, toc_entries = convert_md_file(md_path)

        chapter_div = f'<div class="chapter">\n{html_body}\n</div>'
        chapters_html.append(chapter_div)
        all_toc.extend(toc_entries)

    # Page de couverture
    cover = f"""
<div class="cover-page">
  <div class="cover-rule"></div>
  <div class="cover-title">{book_title}</div>
  <div class="cover-subtitle">{section_name}</div>
  <div class="cover-rule"></div>
</div>
"""

    # Table des matières
    toc_html = ""
    if include_toc and all_toc:
        toc_items = []
        for level, title in all_toc:
            css_class = f"toc-entry toc-entry-h{level}"
            toc_items.append(
                f'<div class="{css_class}">'
                f'<span>{title}</span>'
                f'<span class="toc-dots"></span>'
                f'</div>'
            )
        toc_html = f"""
<div class="toc-page">
  <h2>Table des Matières</h2>
  {''.join(toc_items)}
</div>
"""

    body = "\n".join(chapters_html)

    return f"""<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <title>{book_title} — {section_name}</title>
</head>
<body>
{cover}
{toc_html}
{body}
</body>
</html>"""


# ─── Génération du PDF ────────────────────────────────────────────────────────

def generate_pdf(section_name: str, md_files: list[str],
                 output_path: Path, include_toc: bool = True):
    """Génère le PDF pour une section."""
    print(f"  → Assemblage de {len(md_files)} fichier(s)...")

    html_content = build_book_html(
        book_title="Terre Natale",
        section_name=section_name,
        md_files=md_files,
        include_toc=include_toc,
    )

    # Chemin de base pour WeasyPrint (résolution des ressources relatives)
    base_url = DOCS_DIR.as_uri() + "/"

    print("  → Rendu PDF en cours (WeasyPrint)...")
    html_doc = HTML(string=html_content, base_url=base_url)
    css = CSS(string=BOOK_CSS)
    html_doc.write_pdf(str(output_path), stylesheets=[css])

    size_kb = output_path.stat().st_size // 1024
    print(f"  ✓ PDF généré : {output_path}  ({size_kb} Ko)")


# ─── Interface CLI ────────────────────────────────────────────────────────────

def section_to_filename(name: str) -> str:
    """Transforme un nom de section en nom de fichier sûr."""
    name = name.lower()
    name = re.sub(r'[àâä]', 'a', name)
    name = re.sub(r'[éèêë]', 'e', name)
    name = re.sub(r'[îï]', 'i', name)
    name = re.sub(r'[ôö]', 'o', name)
    name = re.sub(r'[ùûü]', 'u', name)
    name = re.sub(r'[ç]', 'c', name)
    name = re.sub(r"[^a-z0-9]+", '-', name)
    return name.strip('-')


def main():
    parser = argparse.ArgumentParser(
        description="Génère un PDF livre depuis les docs MkDocs de Terre Natale."
    )
    parser.add_argument(
        "section",
        nargs="?",
        help='Nom de la section (ex: "Règles de Base") ou "all" pour tout générer.',
    )
    parser.add_argument(
        "--output", "-o",
        help="Chemin du fichier PDF de sortie (optionnel).",
    )
    parser.add_argument(
        "--no-toc",
        action="store_true",
        help="Désactive la génération de la table des matières.",
    )
    parser.add_argument(
        "--list",
        action="store_true",
        help="Liste les sections disponibles et quitte.",
    )
    args = parser.parse_args()

    sections = load_sections()

    if args.list or not args.section:
        print("\nSections disponibles :\n")
        for name, files in sections.items():
            print(f"  • {name!r}  ({len(files)} fichier(s))")
        print(
            "\nUsage : python3 tools/generate_book.py <section> [--output fichier.pdf]\n"
            '        python3 tools/generate_book.py all\n'
        )
        return

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    if args.section.lower() == "all":
        for name, files in sections.items():
            fname = section_to_filename(name) + ".pdf"
            out = Path(args.output) if args.output else OUTPUT_DIR / fname
            print(f"\n[{name}]")
            generate_pdf(name, files, out, include_toc=not args.no_toc)
    else:
        # Recherche insensible à la casse
        match = None
        for name in sections:
            if name.lower() == args.section.lower():
                match = name
                break
        if match is None:
            # Recherche partielle
            candidates = [n for n in sections if args.section.lower() in n.lower()]
            if len(candidates) == 1:
                match = candidates[0]
            elif len(candidates) > 1:
                print(f"Plusieurs sections correspondent à {args.section!r} :")
                for c in candidates:
                    print(f"  • {c!r}")
                sys.exit(1)
            else:
                print(f"Section introuvable : {args.section!r}")
                print("Sections disponibles :", list(sections.keys()))
                sys.exit(1)

        fname = section_to_filename(match) + ".pdf"
        out = Path(args.output) if args.output else OUTPUT_DIR / fname
        print(f"\n[{match}]")
        generate_pdf(match, sections[match], out, include_toc=not args.no_toc)


if __name__ == "__main__":
    main()
