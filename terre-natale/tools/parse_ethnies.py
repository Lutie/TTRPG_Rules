#!/usr/bin/env python3
"""
parse_ethnies.py — Convertit docs/ethnies/ethnies.md en app-react/src/data/ethnies.js

Usage: python3 tools/parse_ethnies.py

Règles de parsing :
  - Chaque ethnie est une section ### dans un bloc ## X ethnics
  - Les attributs forts/faibles utilisent des noms anglais → IDs français
  - Les attributs de naissance sont en valeurs absolues → stockés tels quels
  - Les particularités gèrent : simples, alternatives (//), conditionnelles (If X :),
    avec paramètre (: texte), avec détails inline (· séparés), avec coût PP ([1PP])
"""

import re
import json
import unicodedata
from pathlib import Path
from collections import Counter

# ─── Mapping anglais → ID app ──────────────────────────────────────────────────

ATTR_MAP = {
    'strength':     'FOR',
    'dexterity':    'DEX',
    'agility':      'AGI',
    'constitution': 'CON',
    'perception':   'PER',
    'charisma':     'CHA',
    'intelligence': 'INT',
    'cunning':      'RUS',
    'willpower':    'VOL',
    'wisdom':       'SAG',
    'magic':        'MAG',
    'logic':        'LOG',
    'balance':      'EQU',
    'luck':         'CHN',
}

BIRTH_ATTR_MAP = {
    'stature':    'STA',
    'height':     'TAI',
    'ego':        'EGO',
    'appearance': 'APP',
    'luck':       'CHN',
    'balance':    'EQU',
}

DEFAULT_SECONDARY = 10  # valeur par défaut des attributs secondaires dans l'app

# ─── Utilitaires ───────────────────────────────────────────────────────────────

def slugify(text):
    nfkd = unicodedata.normalize('NFKD', text)
    ascii_text = nfkd.encode('ascii', 'ignore').decode('ascii').lower()
    return re.sub(r'[^a-z0-9]+', '-', ascii_text).strip('-')


def parse_attr_list(text):
    """
    Parse la liste d'attributs forts/faibles.
    Gère : 'Intelligence, Cunning, Magic or Logic', 'Perception (x2)', 'None', etc.
    Retourne une liste d'éléments :
      - str  : ID simple (ex: 'FOR')
      - dict {'id': 'PER', 'fois': 2}  : attribut choisi plusieurs fois
      - dict {'choice': ['MAG', 'LOG']} : choix entre deux attributs
    """
    text = text.strip()
    if not text or text.lower() == 'none':
        return []

    # Supprimer les éventuelles annotations de fin de ligne non pertinentes
    # (ex: "Strength, Constitution (x2), Willpower  " → strip déjà fait)
    parts = [p.strip() for p in text.split(',') if p.strip()]
    result = []

    for part in parts:
        # "X or Y"
        or_match = re.match(r'^(.+?)\s+or\s+(.+?)$', part, re.IGNORECASE)
        # "Attr (xN)"
        xn_match = re.match(r'^(.+?)\s*\(x(\d+)\)\s*$', part, re.IGNORECASE)

        if or_match:
            a = ATTR_MAP.get(or_match.group(1).strip().lower())
            b = ATTR_MAP.get(or_match.group(2).strip().lower())
            if a and b:
                result.append({'choice': [a, b]})
            elif a:
                result.append(a)
            elif b:
                result.append(b)
        elif xn_match:
            attr_id = ATTR_MAP.get(xn_match.group(1).strip().lower())
            n = int(xn_match.group(2))
            if attr_id:
                result.append({'id': attr_id, 'fois': n})
        else:
            attr_id = ATTR_MAP.get(part.lower())
            if attr_id:
                result.append(attr_id)
            # attribut inconnu ignoré silencieusement

    return result


def parse_birth_attrs(text):
    """
    Parse 'Stature 10, Height 10~12, Ego 10~11, Appearance 8~10, Luck 8~10, Balance 9~10'
    Retourne {ID: {val} ou {min, max}} en valeurs absolues.
    """
    result = {}
    parts = [p.strip() for p in text.split(',')]
    for part in parts:
        m = re.match(r'^(\w+)\s+(\d+)(?:~(\d+))?', part.strip())
        if m:
            name = m.group(1).lower()
            attr_id = BIRTH_ATTR_MAP.get(name)
            if attr_id:
                val_min = int(m.group(2))
                val_max = int(m.group(3)) if m.group(3) else val_min
                if val_min == val_max:
                    result[attr_id] = {'val': val_min}
                else:
                    result[attr_id] = {'min': val_min, 'max': val_max}
    return result


# ─── Parsing des particularités ────────────────────────────────────────────────

_LINK_RE = re.compile(r'\[(.+?)\]\(#([\w-]+)\)')


def parse_link(text):
    """'[Name](#anchor)' → {'nom': ..., 'anchor': ...}  ou  None"""
    m = _LINK_RE.match(text.strip())
    if m:
        return {'nom': m.group(1), 'anchor': m.group(2)}
    return None


def parse_particularity_line(line):
    """
    Parse une ligne de liste de particularités.
    Retourne une liste d'objets (plusieurs si conditionnel ou alternatif).

    Cas supportés :
      - [Name](#anchor)
      - [Name](#anchor) [1PP]
      - [Name](#anchor) : Param text
      - [Name](#anchor) : Detail1 · Detail2 · Detail3
      - [A](#a) // [B](#b)
      - If Condition : [A](#a) and [B](#b)
      - [Name](#anchor) (Morphological)
    """
    line = line.strip()
    if not line.startswith('-'):
        return []
    line = line[1:].strip()

    # ── Conditionnel : "If X : [A] and [B]"
    cond_match = re.match(r'^If\s+(.+?)\s*:\s*(.+)$', line, re.IGNORECASE)
    if cond_match:
        condition = cond_match.group(1).strip()
        rest = cond_match.group(2)
        items = []
        for nom, anchor in _LINK_RE.findall(rest):
            items.append({'nom': nom, 'anchor': anchor, 'condition': condition})
        return items

    # ── Alternatif : "[A](#a) // [B](#b)"
    if ' // ' in line:
        parts = [p.strip() for p in line.split(' // ')]
        choix = [parse_link(p) for p in parts]
        choix = [c for c in choix if c]
        if len(choix) >= 2:
            return [{'choix': choix}]
        elif choix:
            return choix
        return []

    # ── Cas standard : un seul lien principal
    link_match = re.match(r'(\[.+?\]\(#[\w-]+\))(.*)', line)
    if not link_match:
        return []

    item = parse_link(link_match.group(1))
    if not item:
        return []
    rest = link_match.group(2).strip()

    # Coût PP : "[1PP]"
    pp_match = re.search(r'\[(\d+)\s*PP\]', rest, re.IGNORECASE)
    if pp_match:
        item['coutPP'] = int(pp_match.group(1))

    # Paramètre ou détails : ": texte" (après le lien)
    param_match = re.match(r'^:\s*(.+?)(?:\s*\[\d+\s*PP\])?$', rest)
    if param_match:
        param_text = param_match.group(1).strip()
        if '·' in param_text:
            item['details'] = [s.strip() for s in param_text.split('·') if s.strip()]
        else:
            item['param'] = param_text

    # Annotation morphologique
    if re.search(r'\(Morphological\)', rest, re.IGNORECASE):
        item['morphologique'] = True

    return [item]


# ─── Parsing d'une section ethnie ──────────────────────────────────────────────

def parse_ethnic(section_text, race):
    """
    Parse le texte d'une section ### en un objet ethnie.
    """
    lines = section_text.split('\n')

    # En-tête : "### Nom (Sous-nom)"
    header = lines[0].strip()
    hm = re.match(r'^###\s+(.+?)(?:\s+\((.+?)\))?$', header)
    if not hm:
        return None
    nom     = hm.group(1).strip()
    sous_nom = hm.group(2).strip() if hm.group(2) else None

    ethnie = {
        'id':                      slugify(nom),
        'nom':                     nom,
        'sousNom':                 sous_nom,
        'race':                    race,
        'description':             None,
        'competences':             [],
        'traits_personnalite':     [],
        'attributs_forts':         [],
        'attributs_faibles':       [],
        'attributs_naissance':     {},
        'allegeances':             [],
        'environnement':           [],
        'nature':                  None,
        'totem':                   None,
        'famille':                 None,
        'origines':                None,
        'religion':                None,
        'particularites_naissance':   [],
        'particularites_culturelles': [],
    }

    i = 1

    # Sauter les blocs HTML (images, page-break)
    while i < len(lines) and (
        '<div' in lines[i] or '</div>' in lines[i] or
        '<img' in lines[i] or 'page-break' in lines[i]
    ):
        i += 1

    # ── Description narrative (avant le premier **Champ:**)
    desc_lines = []
    while i < len(lines):
        stripped = lines[i].strip()
        if re.match(r'^\*\*', stripped):
            break
        if stripped and not stripped.startswith('<'):
            desc_lines.append(stripped)
        i += 1
    if desc_lines:
        ethnie['description'] = '\n\n'.join(desc_lines)

    # ── Champs structurés
    in_birth = False
    in_cult  = False

    while i < len(lines):
        stripped = lines[i].strip()
        i += 1

        # Ignorer HTML
        if stripped.startswith('<') and stripped.endswith('>'):
            continue
        if not stripped:
            continue

        # ── Ligne de liste de particularités
        if stripped.startswith('-') and (in_birth or in_cult):
            items = parse_particularity_line(stripped)
            target = ethnie['particularites_naissance'] if in_birth else ethnie['particularites_culturelles']
            target.extend(items)
            continue

        # ── Champ structuré **Key:** value  ou  **Key: extras** (entièrement en gras)
        # Le `:?` final absorbe le `:` éventuel hors du gras (ex: **Nature**: value)
        fm = re.match(r'^\*\*(.+?)\*\*\s*:?\s*(.*)', stripped)
        if not fm:
            # Ligne de description d'attribut (−− ou "Attr –") : ignorer
            continue

        key   = fm.group(1).strip().rstrip(':').lower()
        value = fm.group(2).strip()

        # Réinitialiser l'état des sections de particularités
        in_birth = False
        in_cult  = False

        if 'skills' in key:
            ethnie['competences'] = [s.strip() for s in value.split(',') if s.strip()]

        elif 'personality' in key:
            ethnie['traits_personnalite'] = [s.strip() for s in value.split(',') if s.strip()]

        elif 'strong attributes' in key:
            ethnie['attributs_forts'] = parse_attr_list(value)

        elif 'weak attributes' in key:
            ethnie['attributs_faibles'] = parse_attr_list(value)

        elif 'birth attributes' in key:
            ethnie['attributs_naissance'] = parse_birth_attrs(value)

        elif 'allegiance' in key:
            ethnie['allegeances'] = [s.strip() for s in value.split(',') if s.strip()]

        elif 'living environment' in key:
            # "Urban, City-dwelling, or Rural" → split sur virgule et " or "
            parts = re.split(r',\s*|\s+or\s+', value)
            ethnie['environnement'] = [p.strip() for p in parts if p.strip()]

        elif key.startswith('nature'):
            ethnie['nature'] = value or None

        elif key.startswith('totem'):
            ethnie['totem'] = value or None

        elif 'family' in key:
            ethnie['famille'] = value or None

        elif key.startswith('origins'):
            ethnie['origines'] = value or None

        elif key.startswith('religion'):
            ethnie['religion'] = value or None

        elif 'birth particularities' in key:
            in_birth = True
            if value:  # texte inline (ex: Half Elves "Inherits...")
                ethnie['particularites_naissance'].append({'note': value})

        elif 'cultural particularities' in key:
            in_cult = True
            if value:
                ethnie['particularites_culturelles'].append({'note': value})

    return ethnie


# ─── Lecture et découpage du fichier ──────────────────────────────────────────

def parse_file(source_path):
    text    = source_path.read_text(encoding='utf-8')
    lines   = text.split('\n')

    ethnies          = []
    current_race     = None
    section_lines    = []
    in_ethnic        = False

    for line in lines:

        # Stopper aux sections de définitions de particularités
        if re.match(r'^## Particularities', line):
            if in_ethnic and section_lines:
                e = parse_ethnic('\n'.join(section_lines), current_race)
                if e:
                    ethnies.append(e)
            break

        # Nouvelle catégorie de race : ## X ethnics
        race_match = re.match(r'^## (.+?) ethnics\s*$', line, re.IGNORECASE)
        if race_match:
            if in_ethnic and section_lines:
                e = parse_ethnic('\n'.join(section_lines), current_race)
                if e:
                    ethnies.append(e)
            current_race  = race_match.group(1).strip()
            section_lines = []
            in_ethnic     = False
            continue

        # Nouvelle ethnie : ### Nom
        if re.match(r'^### ', line):
            if in_ethnic and section_lines:
                e = parse_ethnic('\n'.join(section_lines), current_race)
                if e:
                    ethnies.append(e)
            section_lines = [line]
            in_ethnic     = True
            continue

        if in_ethnic:
            section_lines.append(line)

    # Dernière ethnie éventuelle
    if in_ethnic and section_lines:
        e = parse_ethnic('\n'.join(section_lines), current_race)
        if e:
            ethnies.append(e)

    return ethnies


# ─── Main ──────────────────────────────────────────────────────────────────────

def main():
    tools_dir   = Path(__file__).parent
    source_path = tools_dir.parent / 'docs' / 'ethnies' / 'ethnies.md'
    json_path   = tools_dir / 'ethnies.json'
    js_path     = tools_dir.parent / 'app-react' / 'src' / 'data' / 'ethnies.js'

    ethnies = parse_file(source_path)

    # ── JSON intermédiaire (debug / réutilisation)
    json_path.write_text(
        json.dumps(ethnies, ensure_ascii=False, indent=2),
        encoding='utf-8'
    )

    # ── JS pour l'app React
    js_output = (
        "// AUTO-GENERATED — ne pas modifier manuellement\n"
        "// Source : docs/ethnies/ethnies.md  •  Script : tools/parse_ethnies.py\n"
        f"// {len(ethnies)} ethnies au total\n\n"
        f"const ethnies = {json.dumps(ethnies, ensure_ascii=False, indent=2)};\n\n"
        "export default ethnies;\n"
    )
    js_path.write_text(js_output, encoding='utf-8')

    # ── Rapport
    print(f"✓ JSON : {json_path}")
    print(f"✓ JS   : {js_path}")
    print(f"  Total : {len(ethnies)} ethnies\n")

    by_race = Counter(e['race'] for e in ethnies)
    for race, count in sorted(by_race.items()):
        print(f"  {race:<25} : {count}")

    # Diagnostics : ethnies sans particularités de naissance ou culturelles
    sans_birth = [e['nom'] for e in ethnies if not e['particularites_naissance']]
    sans_cult  = [e['nom'] for e in ethnies if not e['particularites_culturelles']]
    if sans_birth:
        print(f"\n⚠ Sans particularités de naissance ({len(sans_birth)}) :")
        for n in sans_birth:
            print(f"  - {n}")
    if sans_cult:
        print(f"\n⚠ Sans particularités culturelles ({len(sans_cult)}) :")
        for n in sans_cult:
            print(f"  - {n}")


if __name__ == '__main__':
    main()
