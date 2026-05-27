#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
pipeline.py — Mise à jour complète du site et de la fiche.

Lance tous les parseurs et générateurs dans le bon ordre.
Usage : python3 tools/pipeline.py

Gaps connus (doc non générée automatiquement) :
  - docs/traits/index.md       : catégories hardcodées, pas de generate_doc_traits.py
  - competences                : aucune page doc
  - prouesses                  : JSON généré (prouesses.json) mais ni doc ni sheet
"""

import subprocess
import sys
import time
from pathlib import Path

TOOLS = Path(__file__).parent


def run(label: str, script: str) -> bool:
    path = TOOLS / script
    print(f"\n{'─' * 60}")
    print(f"▶  {label}")
    print(f"   {path}")
    print(f"{'─' * 60}")
    t0 = time.time()
    result = subprocess.run([sys.executable, str(path)], cwd=str(TOOLS))
    elapsed = time.time() - t0
    if result.returncode == 0:
        print(f"   ✓ OK ({elapsed:.1f}s)")
        return True
    else:
        print(f"   ✗ ERREUR (code {result.returncode})")
        return False


def main() -> None:
    steps = [
        # ── Traits ───────────────────────────────────────────────────────────
        ("Traits : parse source → traits.json",
         "parse_traits.py"),
        ("Traits : export → app-sheet/src/data/traits.json",
         "export_traits.py"),

        # ── Compétences ──────────────────────────────────────────────────────
        ("Compétences : parse source → competences.json + app-sheet",
         "parse_competences.py"),

        # ── Castes ───────────────────────────────────────────────────────────
        ("Castes : parse xlsx → docs/classes/castes.md + app-sheet",
         "parse_castes.py"),

        # ── Manœuvres & Prouesses ────────────────────────────────────────────
        ("Manœuvres : parse xlsx → manoeuvres.json + prouesses.json",
         "parse_manoeuvres.py"),
        ("Manœuvres : generate doc → docs/manoeuvres/index.md",
         "generate_doc_manoeuvres.py"),

        # ── Styles ───────────────────────────────────────────────────────────
        ("Styles : generate doc → docs/styles/index.md",
         "generate_doc_styles.py"),

        # ── Conditions ───────────────────────────────────────────────────────
        ("Conditions : generate doc + app-sheet",
         "generate_doc_conditions.py"),

        # ── Archétypes ───────────────────────────────────────────────────────
        ("Archétypes : generate doc → docs/archetypes/index.md",
         "generate_doc_archetypes.py"),

        # ── Ethnies & Particularités ─────────────────────────────────────────
        ("Ethnies : parse doc → app-sheet/src/data/ethnies.js",
         "parse_ethnies.py"),
        ("Particularités : parse doc → app-sheet/src/data/particularites.json",
         "parse_particularites.py"),

        # ── Magie (pipeline lourd) ───────────────────────────────────────────
        ("Magie : pipeline complet → docs/magies/ + docs/mots-de-pouvoir/ + app-sheet",
         "pipeline_magie.py"),

        # ── Matières ─────────────────────────────────────────────────────────
        ("Matières : parse xlsx → matieres.json + app-sheet + docs/matieres/",
         "parse_matieres.py"),
    ]

    t_start = time.time()
    errors = []

    for label, script in steps:
        ok = run(label, script)
        if not ok:
            errors.append(script)

    total = time.time() - t_start
    print(f"\n{'═' * 60}")
    if errors:
        print(f"Pipeline terminé en {total:.1f}s — {len(errors)} erreur(s) :")
        for e in errors:
            print(f"  ✗ {e}")
        sys.exit(1)
    else:
        print(f"Pipeline terminé en {total:.1f}s — tout OK ✓")
        print()
        print("Gaps à combler (doc non générée) :")
        print("  • docs/traits/index.md  — catégories hardcodées (pas de generate_doc_traits.py)")
        print("  • competences           — aucune page doc")
        print("  • prouesses             — JSON produit mais ni doc ni sheet")
    print(f"{'═' * 60}")


if __name__ == "__main__":
    main()
