"""
Extrait les descriptions des particularités depuis docs/ethnies/ethnies.md
et génère app-sheet/src/data/particularites_descriptions.json.

Structure de sortie :
{
  "cult-affinity": {
    "_base": "description générale de l'Affinity...",
    "Technology Affinity": "Actions involving technological devices or systems.",
    "Repair Affinity": "..."
  },
  "cult-secundary-specialty": "The character gains one additional Specialty...",
  ...
}
"""

import re
import json
from pathlib import Path

ROOT = Path(__file__).parent.parent
DOC = ROOT / "docs" / "ethnies" / "ethnies.md"
OUT = ROOT / "app-sheet" / "src" / "data" / "particularites_descriptions.json"

text = DOC.read_text(encoding="utf-8")

# --- 1. Extraire les sections ### Trait {#anchor} ---------------------------
# Chaque section commence par ### et se termine à la prochaine ### ou EOF
section_re = re.compile(
    r'^### (.+?) \{#([\w-]+)\}\s*\n(.*?)(?=^### |\Z)',
    re.MULTILINE | re.DOTALL
)

descriptions = {}

for m in section_re.finditer(text):
    title = m.group(1).strip()
    anchor = m.group(2).strip()
    body = m.group(3).strip()

    # --- Cas spécial : Affinity → extraire la base + chaque sous-type -------
    if anchor == "cult-affinity":
        # Description de base : paragraphes avant la première liste
        base_paras = []
        for line in body.split("\n"):
            if line.startswith("####") or line.startswith("- **"):
                break
            if line.strip():
                base_paras.append(line.strip())
        base_desc = " ".join(base_paras)

        entry = {"_base": base_desc}

        # Chaque sous-ligne "- **Nom Affinity** — description"
        for sub in re.finditer(r'- \*\*(.+?)\*\* — (.+)', body):
            sub_name = sub.group(1).strip()
            sub_desc = sub.group(2).strip()
            entry[sub_name] = sub_desc

        descriptions[anchor] = entry

    # --- Cas spécial : Auras → conserver la description + tableau -----------
    elif anchor == "cult-auras":
        # Première phrase + effet général
        first_paras = []
        for line in body.split("\n"):
            if line.startswith("####") or line.startswith("|"):
                break
            if line.strip():
                first_paras.append(line.strip())
        descriptions[anchor] = " ".join(first_paras)

    # --- Cas général : première phrase significative ------------------------
    else:
        # Ignorer les lignes markdown de tableau, prendre le premier paragraphe utile
        lines = [l.strip() for l in body.split("\n") if l.strip()
                 and not l.strip().startswith("|") and not l.strip().startswith("#")]
        if lines:
            # Nettoyer le markdown bold/italic basique
            desc = lines[0]
            # Garder aussi la ligne **Effect:** si elle suit immédiatement
            if len(lines) > 1 and lines[1].startswith("**Effect"):
                desc = desc + " " + lines[1]
            descriptions[anchor] = desc

OUT.write_text(json.dumps(descriptions, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"✓ {len(descriptions)} entrées écrites dans {OUT}")

# Rapport des affinités extraites
aff = descriptions.get("cult-affinity", {})
print(f"  dont {len(aff) - 1} sous-types Affinity")
