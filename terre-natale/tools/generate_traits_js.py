#!/usr/bin/env python3
"""
generate_traits_js.py — Convertit traits.json en app-react/src/data/traits.js

Usage: python3 tools/generate_traits_js.py
"""

import json
import re
import unicodedata
from pathlib import Path


def slugify(text):
    """Convertit un nom français en identifiant slug."""
    nfkd = unicodedata.normalize('NFKD', text)
    ascii_text = nfkd.encode('ascii', 'ignore').decode('ascii')
    ascii_text = ascii_text.lower()
    ascii_text = re.sub(r'[^a-z0-9]+', '-', ascii_text)
    return ascii_text.strip('-')


def transform(trait, section_key):
    """Transforme un trait JSON parsé en objet pour l'app React.

    Règle PP : chaque rang coûte toujours 1 PP.
    Le champ 'cout' du JSON source indique le nombre de rangs disponibles (rangMax).
    """
    typ = trait['type']

    if typ == 'avantage_mineur':
        cout_pp = 0
        rang_max = trait.get('rang') or 1
    else:
        cout_pp = 1                        # toujours 1 PP par rang
        rang_max = trait.get('cout') or 1  # cout = nombre de rangs

    obj = {
        'nom':                 trait['nom'],
        'type':                typ,
        'coutPP':              cout_pp,
        'rangMax':             rang_max,
        'description':         trait.get('description'),
        'categories':          trait.get('categories') or [],
        'sous_section':        trait.get('sous_section'),
        'prerequis':           trait.get('prerequis'),
        'conditions':          trait.get('conditions') or [],
        'multiples_instances': trait.get('multiples_instances'),
        'limitation':          trait.get('limitation'),
    }

    if typ in ('avantage_majeur', 'avantage_archetype'):
        obj['avantage_mineur_bonus'] = bool(trait.get('avantage_mineur_bonus'))

    return obj


def main():
    tools_dir = Path(__file__).parent
    traits_json_path = tools_dir / 'traits.json'
    output_path = tools_dir.parent / 'app-react' / 'src' / 'data' / 'traits.js'

    with open(traits_json_path, encoding='utf-8') as f:
        data = json.load(f)

    all_traits = []
    ids_seen = {}

    for section_key, traits_list in data.items():
        for trait in traits_list:
            obj = transform(trait, section_key)

            # ID unique basé sur le nom slugifié
            base = slugify(trait['nom'])
            if base not in ids_seen:
                ids_seen[base] = 0
                slug = base
            else:
                ids_seen[base] += 1
                slug = f"{base}-{ids_seen[base]}"

            obj['id'] = slug
            # Met l'id en premier pour la lisibilité du JSON généré
            all_traits.append({'id': slug, **{k: v for k, v in obj.items() if k != 'id'}})

    traits_str = json.dumps(all_traits, ensure_ascii=False, indent=2)
    js_output = (
        "// AUTO-GENERATED — ne pas modifier manuellement\n"
        "// Source : tools/traits.json  •  Script : tools/generate_traits_js.py\n"
        f"// {len(all_traits)} traits au total\n\n"
        f"const traits = {traits_str};\n\n"
        "export default traits;\n"
    )

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(js_output)

    print(f"✓ Généré : {output_path}")
    print(f"  Total  : {len(all_traits)} traits")
    for key, lst in data.items():
        print(f"  {key:<30} : {len(lst)}")


if __name__ == '__main__':
    main()
