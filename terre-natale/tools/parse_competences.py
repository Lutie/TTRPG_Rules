#!/usr/bin/env python3
"""
parse_competences.py — Parse la section "Aperçu rapide des Compétences"
de tools/Terre Natale.docx.txt et génère :
  - tools/competences.json           (debug/intermédiaire)
  - app-react/src/data/competences.js  (ES module)

Usage: python3 tools/parse_competences.py
"""

import re
import json
import unicodedata
from pathlib import Path
from collections import defaultdict


# ─── Slugify ───────────────────────────────────────────────────────────────────

def slugify(text):
    nfkd = unicodedata.normalize('NFKD', text)
    ascii_text = nfkd.encode('ascii', 'ignore').decode('ascii').lower()
    return re.sub(r'[^a-z0-9]+', '-', ascii_text).strip('-')


# ─── Mappings ──────────────────────────────────────────────────────────────────

# IDs d'attributs reconnus (pour validation)
VALID_ATTRS = {
    'DEX', 'AGI', 'FOR', 'CON', 'PER', 'CHA', 'INT',
    'RUS', 'VOL', 'SAG', 'MAG', 'LOG', 'EQU', 'CHN',
}

# Nom de catégorie → id
CATEGORY_MAP = {
    'Martiales':      'martiales',
    'Sociales':       'sociales',
    'de Tir':         'tir',
    'Rurales':        'rurales',
    'Urbaines':       'urbaines',
    "de l'Ombre":     'ombre',
    'Physiques':      'physiques',
    'Mentales':       'mentales',
    'de Métiers':     'metiers',
    'de Connaissances': 'connaissances',
}

# Noms de catégorie pour l'affichage
CATEGORY_DISPLAY = {
    'martiales':      'Les Compétences Martiales',
    'sociales':       'Les Compétences Sociales',
    'tir':            'Les Compétences de Tir',
    'rurales':        'Les Compétences Rurales',
    'urbaines':       'Les Compétences Urbaines',
    'ombre':          "Les Compétences de l'Ombre",
    'physiques':      'Les Compétences Physiques',
    'mentales':       'Les Compétences Mentales',
    'metiers':        'Les Compétences de Métiers',
    'connaissances':  'Les Compétences de Connaissances',
}

# Sous-groupes Combat reconnus
COMBAT_SUBGROUPS = {'Par Genre', 'Par Type', 'Spéciales'}


# ─── Tokenisation du COMPLIST ──────────────────────────────────────────────────

def tokenize_complist(text):
    """
    Split sur les virgules de niveau 0.
    Ignore les virgules à l'intérieur de < ... > et ( ... ).
    Nettoie le préfixe 'etc.' éventuel sur chaque token.
    """
    tokens = []
    current = ''
    depth_angle = 0
    depth_paren = 0
    for c in text:
        if c == '<':
            depth_angle += 1
        elif c == '>':
            depth_angle -= 1
        elif c == '(':
            depth_paren += 1
        elif c == ')':
            depth_paren -= 1
        if c == ',' and depth_angle == 0 and depth_paren == 0:
            t = current.strip()
            if t:
                tokens.append(t)
            current = ''
        else:
            current += c
    t = current.strip()
    if t:
        tokens.append(t)

    result = []
    for t in tokens:
        # Supprimer un éventuel préfixe "etc. " (ex: "etc. < Type d'Arme >")
        t = re.sub(r'^etc\.\s*', '', t, flags=re.IGNORECASE).strip()
        if t and t.lower().rstrip('.') != 'etc':
            result.append(t)
    return result


# ─── Parser des attributs ──────────────────────────────────────────────────────

def parse_attrs(raw):
    """
    Retourne un dict :
      { 'attributs': [...], 'secondaires': [...], 'attrVariable': bool, 'limitant': bool }

    Règles :
      raw vide / None → tout vide (ex: groupe Ambidextrie entier)
      "L"             → limitant: true, attributs: []
      "*" ou "selon"  → attrVariable: true
      "SAG, INT"      → attributs: ["SAG"], secondaires: ["INT"]
      "SAG, PER, CHN" → attributs: ["SAG"], secondaires: ["PER","CHN"]
      "CHA/INT/SAG"   → attributs: ["CHA","INT","SAG"]  (plusieurs primaires / contexte)
      "AGI, CHA/CON"  → attributs: ["AGI"], secondaires: ["CHA","CON"]
    """
    result = {
        'attributs':    [],
        'secondaires':  [],
        'attrVariable': False,
        'limitant':     False,
    }

    if not raw or not raw.strip():
        return result

    raw = raw.strip()

    # Limitant seul
    if raw == 'L':
        result['limitant'] = True
        return result

    # Variable
    if raw == '*' or raw.lower().startswith('selon'):
        result['attrVariable'] = True
        return result

    # Split sur virgule → [partie_primaire, sec1, sec2, ...]
    parts = [p.strip() for p in raw.split(',') if p.strip()]

    primaires_raw = parts[0]
    secondaires_raws = parts[1:]

    # Primaires : split sur /
    primaires = [a.strip() for a in primaires_raw.split('/') if a.strip()]
    primaires = [a for a in primaires if a in VALID_ATTRS]

    # Secondaires : chaque partie peut aussi contenir des /
    secondaires = []
    for s in secondaires_raws:
        for a in s.split('/'):
            a = a.strip()
            if a in VALID_ATTRS:
                secondaires.append(a)

    result['attributs'] = primaires
    result['secondaires'] = secondaires
    return result


# ─── Parser d'un token ────────────────────────────────────────────────────────

def parse_token(token, default_categorie, default_groupe, default_sous_groupe):
    """
    Parse un token de COMPLIST.
    Retourne un dict compétence ou None si token invalide.

    Formes possibles :
      "Arme à Garde (DEX)"
      "Représailles (L)"
      "Arme Tranchante (selon arme)"
      "< Type d'Arme >"               → libre, pas d'attrs
      "< Langue > (INT)"              → libre + attrs
    """
    token = token.strip()
    if not token:
        return None

    # Slot libre : commence par <
    libre = token.startswith('<')

    if libre:
        # Extraire le label entre < >
        m = re.match(r'^<([^>]+)>\s*(?:\(([^)]*)\))?$', token)
        if m:
            label = m.group(1).strip()
            raw_attrs = m.group(2) if m.group(2) else ''
        else:
            label = token
            raw_attrs = ''
        nom = f'< {label} >'
    else:
        # Nom + optionnel (attrs)
        m = re.match(r'^(.+?)\s*(?:\(([^)]*)\))?\s*$', token)
        if not m:
            return None
        nom = m.group(1).strip()
        raw_attrs = m.group(2) if m.group(2) else ''

    attrs = parse_attrs(raw_attrs)

    comp = {
        'id':           slugify(nom) if not libre else slugify(nom.replace('<', '').replace('>', '').strip()),
        'nom':          nom,
        'categorie':    default_categorie,
        'groupe':       default_groupe,
        'sousGroupe':   default_sous_groupe,
        'attributs':    attrs['attributs'],
        'secondaires':  attrs['secondaires'],
        'attrVariable': attrs['attrVariable'],
        'libre':        libre,
        'limitant':     attrs['limitant'],
    }
    return comp


# ─── Parsing principal ────────────────────────────────────────────────────────

def parse_apercu(source_path):
    """
    Lit la section "Aperçu rapide des Compétences" et retourne :
      (competences_list, categories_list)
    """
    text = source_path.read_text(encoding='utf-8')
    lines = text.split('\n')

    # 1. Localiser la section aperçu
    # On cherche la ligne exacte (sans numéro de page ni suffixe — évite le sommaire)
    start = None
    for i, line in enumerate(lines):
        if line.strip() == 'Aperçu rapide des Compétences':
            start = i + 1
            break

    if start is None:
        raise ValueError("Section 'Aperçu rapide des Compétences' introuvable")

    # Extraire jusqu'au prochain séparateur de chapitre (ligne vide après le dernier ___)
    # On s'arrête à "Chapitre 3" ou à une ligne avec "Chapitre"
    apercu_lines = []
    for line in lines[start:]:
        if re.match(r'^Chapitre\s+\d', line.strip()):
            break
        apercu_lines.append(line)

    # ─── Machine à états ──────────────────────────────────────────────────────

    competences_list = []      # flat list
    categories_map   = {}      # id → { id, nom, groupes: [...] }
    categories_order = []      # pour conserver l'ordre

    current_cat_id   = None
    current_groupe   = None    # { id, nom, limitant, libre, sousGroupes?, competences? }
    in_combat        = False   # True quand on est dans le groupe Combat (a des sous-groupes)
    current_subgroup = None    # nom du sous-groupe courant (dans Combat)

    def finish_groupe():
        """Referme le groupe courant et l'ajoute à la catégorie."""
        nonlocal current_groupe, in_combat, current_subgroup
        if current_groupe and current_cat_id:
            cat = categories_map[current_cat_id]
            cat['groupes'].append(current_groupe)
        current_groupe   = None
        in_combat        = False
        current_subgroup = None

    def new_category(cat_id, cat_nom):
        nonlocal current_cat_id
        finish_groupe()
        current_cat_id = cat_id
        if cat_id not in categories_map:
            categories_map[cat_id] = {
                'id':      cat_id,
                'nom':     cat_nom,
                'groupes': [],
            }
            categories_order.append(cat_id)

    def new_groupe(groupe_id, groupe_nom, limitant=False, libre=False):
        nonlocal current_groupe, in_combat, current_subgroup
        finish_groupe()
        current_groupe = {
            'id':       groupe_id,
            'nom':      groupe_nom,
            'limitant': limitant,
            'libre':    libre,
        }
        in_combat        = False
        current_subgroup = None

    def add_competences_to_groupe(comp_tokens, sous_groupe_nom=None):
        """
        Parse les tokens et les ajoute à la liste flat + à la structure du groupe.
        """
        for tok in comp_tokens:
            comp = parse_token(tok, current_cat_id, current_groupe['id'], sous_groupe_nom)
            if comp is None:
                continue
            competences_list.append(comp)

            if in_combat and sous_groupe_nom:
                # Cherche ou crée le sous-groupe
                sgs = current_groupe.setdefault('sousGroupes', [])
                sg = next((s for s in sgs if s['nom'] == sous_groupe_nom), None)
                if sg is None:
                    sg = {'nom': sous_groupe_nom, 'competences': []}
                    sgs.append(sg)
                sg['competences'].append(comp['id'])
            else:
                current_groupe.setdefault('competences', []).append(comp['id'])

    # ─── Boucle principale ────────────────────────────────────────────────────

    for raw_line in apercu_lines:
        line = raw_line.strip()

        # Ligne vide ou note → skip
        if not line:
            continue
        if line.startswith('Note :') or line.startswith('Voici') or line.startswith('Toutes'):
            continue

        # Séparateur ___
        if re.match(r'^_{3,}', line):
            finish_groupe()
            continue

        # Nouvelle catégorie : "Les Compétences Martiales"
        cat_match = re.match(r'^Les Compétences\s+(.+)', line)
        if cat_match:
            suffix = cat_match.group(1).strip().rstrip(':')
            # Chercher dans CATEGORY_MAP
            cat_id = None
            for key, cid in CATEGORY_MAP.items():
                if key in suffix or suffix in key:
                    cat_id = cid
                    break
            if cat_id is None:
                # Fallback slugify
                cat_id = slugify(suffix)
            cat_nom = CATEGORY_DISPLAY.get(cat_id, f'Les Compétences {suffix}')
            new_category(cat_id, cat_nom)
            continue

        # Ligne "GROUPE : COMPLIST" ou "GROUPE :"
        # Le nom peut commencer par un espace (artifact du .txt)
        # Le séparateur est " : " (avec espaces) ou " :"
        sep_match = re.match(r'^(.+?)\s*:\s*(.*)', line)
        if not sep_match or not current_cat_id:
            continue

        groupe_nom_raw = sep_match.group(1).strip()
        complist_raw   = sep_match.group(2).strip()

        # Cas Ambidextrie : groupe entier libre/limitant (slot entre < >)
        if groupe_nom_raw == 'Ambidextrie':
            new_groupe('ambidextrie', 'Ambidextrie', limitant=True, libre=True)
            # Le complist contient un seul token < ... > qui décrit le slot
            # On ne l'ajoute pas comme compétence individuelle (groupe = entrée libre entière)
            current_groupe['competences'] = []
            continue

        # Sous-groupe Combat : "Par Genre", "Par Type", "Spéciales"
        if groupe_nom_raw in COMBAT_SUBGROUPS and in_combat:
            current_subgroup = groupe_nom_raw
            tokens = tokenize_complist(complist_raw)
            add_competences_to_groupe(tokens, sous_groupe_nom=groupe_nom_raw)
            continue

        # Nouveau groupe standard
        groupe_id = slugify(groupe_nom_raw)
        is_libre   = '<' in complist_raw and not complist_raw.replace('<', '').replace('>', '').strip()
        new_groupe(groupe_id, groupe_nom_raw)

        if not complist_raw:
            # Groupe Combat : ce qui suit sont des sous-groupes
            in_combat = True
            current_groupe['sousGroupes'] = []
        elif is_libre:
            # Groupe entièrement libre (rare)
            current_groupe['libre'] = True
            current_groupe['competences'] = []
        else:
            # Groupe normal
            tokens = tokenize_complist(complist_raw)
            add_competences_to_groupe(tokens)

    # Dernier groupe éventuel
    finish_groupe()

    # ─── Construire la liste ordonnée des catégories ──────────────────────────
    categories_list = [categories_map[cid] for cid in categories_order if cid in categories_map]

    return competences_list, categories_list


# ─── Main ─────────────────────────────────────────────────────────────────────

def main():
    tools_dir   = Path(__file__).parent
    source_path = tools_dir / 'Terre Natale.docx.txt'
    json_path   = tools_dir / 'competences.json'
    js_path     = tools_dir.parent / 'app-react' / 'src' / 'data' / 'competences.js'

    competences, categories = parse_apercu(source_path)

    # ── JSON intermédiaire
    output_data = {
        'competences':         competences,
        'categoriesCompetences': categories,
    }
    json_path.write_text(
        json.dumps(output_data, ensure_ascii=False, indent=2),
        encoding='utf-8'
    )

    # ── JS pour l'app React
    nb_groupes = sum(len(c['groupes']) for c in categories)
    comp_str   = json.dumps(competences, ensure_ascii=False, indent=2)
    cat_str    = json.dumps(categories,  ensure_ascii=False, indent=2)

    js_output = (
        "// AUTO-GENERATED — ne pas modifier manuellement\n"
        "// Source : tools/Terre Natale.docx.txt  •  Script : tools/parse_competences.py\n"
        f"// {len(competences)} compétences, {len(categories)} catégories, {nb_groupes} groupes\n\n"
        f"const competences = {comp_str};\n\n"
        f"const categoriesCompetences = {cat_str};\n\n"
        "export { competences, categoriesCompetences };\n"
    )
    js_path.write_text(js_output, encoding='utf-8')

    # ── Rapport
    print(f"✓ JSON : {json_path}")
    print(f"✓ JS   : {js_path}")
    print(f"\n  {len(competences)} compétences  |  {len(categories)} catégories  |  {nb_groupes} groupes\n")

    # Par catégorie
    comp_by_cat = defaultdict(list)
    for c in competences:
        comp_by_cat[c['categorie']].append(c)

    for cat in categories:
        cid = cat['id']
        comps = comp_by_cat[cid]
        print(f"  {cat['nom']:<40} : {len(comps):>3} compétences, {len(cat['groupes'])} groupes")

    # Cross-groupe : compétences présentes dans plusieurs groupes
    from collections import Counter
    id_counts = Counter(c['id'] for c in competences)
    doublons = {cid: n for cid, n in id_counts.items() if n > 1}
    if doublons:
        print(f"\n  Cross-groupe ({len(doublons)} IDs) :")
        for cid, n in sorted(doublons.items()):
            noms = [c['nom'] for c in competences if c['id'] == cid]
            groupes = [c['groupe'] for c in competences if c['id'] == cid]
            print(f"    {cid:<30} ×{n}  ({', '.join(groupes)})")

    # Entrées libres
    libres = [c for c in competences if c['libre']]
    if libres:
        print(f"\n  Entrées libres ({len(libres)}) : {', '.join(c['nom'] for c in libres)}")

    # Limitants
    limitants = [c for c in competences if c['limitant']]
    if limitants:
        print(f"\n  Limitants ({len(limitants)}) : {', '.join(c['nom'] for c in limitants)}")

    # Variables
    variables = [c for c in competences if c['attrVariable']]
    if variables:
        print(f"\n  Attribut variable ({len(variables)}) : {', '.join(c['nom'] for c in variables)}")


if __name__ == '__main__':
    main()
