#!/usr/bin/env python3
"""
Extrait les descriptions des particularités depuis docs/ethnies/ethnies.md
et génère app-sheet/src/data/particularites.json

Format de sortie : { "anchor-id": { "nom": "...", "description": "...", "effet": "..." }, ... }
"""

import re
import json
from pathlib import Path

SOURCE = Path(__file__).parent.parent / "docs" / "ethnies" / "ethnies.md"
OUTPUT = Path(__file__).parent.parent / "app-sheet" / "src" / "data" / "particularites.json"

# Correspond à : ### Titre quelconque {#anchor-id}
SECTION_RE = re.compile(r'^### (.+?) \{#([\w-]+)\}')


def clean_md(text: str) -> str:
    """Nettoie le markdown basique pour un affichage texte propre."""
    # Retire les balises HTML
    text = re.sub(r'<[^>]+>', '', text)
    # Gras **..** → conservé (on les retirera si besoin côté JS)
    # Retire les lignes de séparation ---
    text = re.sub(r'^---+$', '', text, flags=re.MULTILINE)
    # Normalise les espaces multiples et sauts de ligne
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.strip()


def parse_file(path: Path) -> dict:
    lines = path.read_text(encoding='utf-8').splitlines()
    result = {}

    current_anchor = None
    current_nom = None
    current_lines = []

    def flush():
        nonlocal current_anchor, current_nom, current_lines
        if not current_anchor:
            return
        raw = '\n'.join(current_lines).strip()

        # Sépare description et effet/topic
        # On cherche le premier **Xxx:** ou **Xxx**: (avec ou sans colon dans le gras)
        effect_match = re.search(r'\*\*(Effect|Effet|Topic):?\*\*\s*:?\s*(.*)', raw, re.DOTALL | re.IGNORECASE)
        if effect_match:
            description = raw[:effect_match.start()].strip()
            effet_raw = raw[effect_match.start():].strip()
            # Retire le label **Effect:** du début
            effet_raw = re.sub(r'^\*\*(Effect|Effet|Topic):?\*\*\s*:?\s*', '', effet_raw, flags=re.IGNORECASE).strip()
        else:
            # Pas de champ Effect explicite — tout est description
            description = raw
            effet_raw = ''

        result[current_anchor] = {
            'nom': current_nom,
            'description': clean_md(description),
            'effet': clean_md(effet_raw),
        }

        current_anchor = None
        current_nom = None
        current_lines = []

    for line in lines:
        m = SECTION_RE.match(line)
        if m:
            flush()
            current_nom = m.group(1).strip()
            current_anchor = m.group(2).strip()
            current_lines = []
        elif current_anchor is not None:
            # On arrête à la prochaine section de niveau >= 2 (##)
            if re.match(r'^## ', line):
                flush()
            else:
                current_lines.append(line)

    flush()
    return result


def main():
    data = parse_file(SOURCE)
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding='utf-8')
    print(f"✓ {len(data)} particularités extraites → {OUTPUT}")


if __name__ == '__main__':
    main()
