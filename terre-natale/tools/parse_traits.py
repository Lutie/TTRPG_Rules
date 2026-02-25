#!/usr/bin/env python3
"""
parse_traits.py — Parseur du Compendium des Traits (Terre Natale)

Transforme l'extraction texte du fichier .docx en JSON structuré.

Usage:
    python parse_traits.py [fichier_source.txt [sortie.json]]

Par défaut: lit "Compendium des Traits.docx.txt" dans le même dossier
           et écrit "traits.json" dans le même dossier.
"""

import re
import json
import sys
from pathlib import Path


# ─── Symboles ───────────────────────────────────────────────────────────────

SYM_MAJEUR  = '★'  # Avantage majeur
SYM_MINEUR  = '☆'  # Avantage mineur
SYM_DESAV   = '▼'  # Désavantage
SYM_FIN     = '■'  # Fin de bloc
SEPARATEUR  = '________________'

SYMBOLES_TRAIT = (SYM_MAJEUR, SYM_MINEUR, SYM_DESAV)


# ─── Sections principales ────────────────────────────────────────────────────

SECTIONS_PRINCIPALES = {
    'Les Avantages Majeurs':       'avantages_majeurs',
    'Les Désavantages':            'desavantages',
    'Avantages liés aux Archétypes': 'avantages_archetypes',
    'Les Avantages Mineurs':       'avantages_mineurs',
}


# ─── Champs reconnus dans un bloc de trait ──────────────────────────────────

# (motif regex, clé JSON)
# Ordre important : les plus spécifiques en premier
CHAMPS = [
    (r'^description\s*:\s*(.*)',           'description_debut'),
    (r'^catégorie\s*:\s*(.*)',             'categories'),
    (r'^extension\s*:\s*(.*)',             'extension'),
    (r'^univers\s*:\s*(.*)',               'extension'),      # alias
    (r'^prérequis\s*:\s*(.*)',             'prerequis'),
    (r'^condition\s*:\s*(.*)',             'conditions'),     # répétable
    (r'^multiples instances\s*:\s*(.*)',   'multiples_instances'),
    (r'^limitation\s*:\s*(.*)',            'limitation'),
    (r'^rang\s*:\s*(.*)',                  'rang'),
    (r'^coût\s*:\s*(.*)',                  'cout_brut'),      # archétypes
]

CHAMPS_COMPILES = [(re.compile(p, re.IGNORECASE), k) for p, k in CHAMPS]


# ─── Utilitaires ─────────────────────────────────────────────────────────────

def nettoyer(s):
    """Retire ponctuation finale et espaces."""
    return s.strip().rstrip('.')


def parse_categories(s):
    """'Passif, Social.' → ['Passif', 'Social']"""
    return [c.strip() for c in nettoyer(s).split(',') if c.strip()]


def parse_premiere_ligne(ligne):
    """
    Parse '★ Nom du Trait [2] ▣' en (nom, cout, has_bonus_mineur).
    Gère aussi '☆ Nom' et '▼ Nom [1]'.
    """
    s = ligne[1:].strip()           # Retire le symbole de tête

    has_bonus = '▣' in s
    s = s.replace('▣', '').strip()

    cout = None
    m = re.search(r'\[(\d+)\]', s)
    if m:
        cout = int(m.group(1))
        s = (s[:m.start()] + s[m.end():]).strip()

    return s.strip(), cout, has_bonus


# ─── Parseur de bloc ─────────────────────────────────────────────────────────

def parse_bloc(lignes_bloc, section, sous_section):
    """
    Parse une liste de lignes correspondant à un trait (sans le ■ final).
    Retourne un dict ou None si le bloc n'est pas reconnaissable.
    """
    if not lignes_bloc:
        return None

    premiere = lignes_bloc[0].strip()
    if not premiere or premiere[0] not in SYMBOLES_TRAIT:
        return None

    symbole = premiere[0]
    nom, cout, has_bonus = parse_premiere_ligne(premiere)

    if symbole == SYM_MAJEUR:
        type_trait = 'avantage_majeur'
    elif symbole == SYM_DESAV:
        type_trait = 'desavantage'
    else:
        type_trait = 'avantage_mineur'

    trait = {
        'nom':                  nom,
        'type':                 type_trait,
        'section':              section,
        'sous_section':         sous_section,
        'cout':                 cout,
        'avantage_mineur_bonus': has_bonus if symbole == SYM_MAJEUR else None,
        'description':          None,
        'categories':           [],
        'extension':            sous_section,   # sera écrasé si présent dans le texte
        'prerequis':            None,
        'conditions':           [],
        'multiples_instances':  None,
        'limitation':           None,
        'rang':                 None,
    }

    # ── Lecture des lignes suivantes ──
    pre_desc = []     # lignes avant "Description :"
    desc = []         # lignes de la description
    en_description = False
    description_trouvee = False

    for ligne_brute in lignes_bloc[1:]:
        ligne = ligne_brute.strip()

        if not ligne:
            if en_description:
                desc.append('')
            continue

        # Cherche un champ reconnu
        champ_trouve = None
        valeur = None
        for regex, cle in CHAMPS_COMPILES:
            m = regex.match(ligne)
            if m:
                champ_trouve = cle
                valeur = m.group(1).strip()
                break

        if champ_trouve:
            en_description = False

            if champ_trouve == 'description_debut':
                description_trouvee = True
                en_description = True
                if valeur:
                    desc.append(valeur)

            elif champ_trouve == 'categories':
                trait['categories'] = parse_categories(valeur)

            elif champ_trouve == 'extension':
                trait['extension'] = nettoyer(valeur)

            elif champ_trouve == 'prerequis':
                trait['prerequis'] = nettoyer(valeur)

            elif champ_trouve == 'conditions':
                trait['conditions'].append(nettoyer(valeur))

            elif champ_trouve == 'multiples_instances':
                trait['multiples_instances'] = nettoyer(valeur)

            elif champ_trouve == 'limitation':
                trait['limitation'] = nettoyer(valeur)

            elif champ_trouve == 'rang':
                v = nettoyer(valeur)
                try:
                    trait['rang'] = int(v)
                except ValueError:
                    trait['rang'] = v

            elif champ_trouve == 'cout_brut':
                # Format archétypes: "1 PP" ou "1 PP, Rangs : 4"
                pp = re.search(r'(\d+)\s*PP', valeur, re.IGNORECASE)
                if pp:
                    trait['cout'] = int(pp.group(1))
                rangs = re.search(r'rangs?\s*:\s*(\d+)', valeur, re.IGNORECASE)
                if rangs:
                    trait['rangs'] = int(rangs.group(1))

        elif en_description:
            desc.append(ligne)

        elif not description_trouvee:
            # Texte de saveur avant "Description :"
            pre_desc.append(ligne)

    # ── Assemblage de la description ──
    toutes_lignes = []
    if pre_desc:
        toutes_lignes.extend(pre_desc)
        if desc:
            toutes_lignes.append('')   # ligne vide de séparation
    toutes_lignes.extend(desc)

    # Retire les lignes vides en queue
    while toutes_lignes and not toutes_lignes[-1]:
        toutes_lignes.pop()

    trait['description'] = '\n'.join(toutes_lignes) if toutes_lignes else None

    # ── Nettoyage des champs inutiles selon le type ──
    if symbole != SYM_MAJEUR:
        del trait['avantage_mineur_bonus']
    if 'rangs' not in trait and symbole != SYM_MAJEUR:
        pass  # pas de rangs à supprimer
    if not trait['conditions']:
        trait['conditions'] = []

    return trait


# ─── Parseur principal ────────────────────────────────────────────────────────

def parse_fichier(chemin):
    """
    Lit le fichier texte et retourne (donnees, non_parsés).
    - donnees: dict avec les 4 sections
    - non_parsés: liste de blocs qui n'ont pas pu être analysés
    """
    with open(chemin, 'r', encoding='utf-8') as f:
        lignes = f.read().splitlines()

    resultat = {cle: [] for cle in SECTIONS_PRINCIPALES.values()}
    non_parses = []

    section_courante    = None
    sous_section_courante = None
    apres_sep           = False   # Vient-on de voir un SEPARATEUR ?
    en_trait            = False
    bloc_courant        = []

    for ligne in lignes:
        s = ligne.strip()

        # ── Séparateur de section ──
        if s == SEPARATEUR:
            if en_trait and bloc_courant:
                # Séparateur inattendu dans un bloc — on ignore le bloc
                non_parses.append(bloc_courant[:])
                bloc_courant = []
                en_trait = False
            apres_sep = True
            continue

        # ── Lignes vides ──
        if not s:
            if en_trait:
                bloc_courant.append(ligne)
            continue

        # ── Détection de section (1ère ligne non-vide après SEPARATEUR) ──
        if apres_sep and not en_trait:
            apres_sep = False

            # Section principale ?
            if s in SECTIONS_PRINCIPALES:
                section_courante = SECTIONS_PRINCIPALES[s]
                sous_section_courante = None   # reset à chaque nouvelle section
                continue

            # Sous-section (Extension : X ou Spécial : X) ?
            m = re.match(r'^(Extension|Spécial)\s*:\s*(.+?)\.?\s*$', s, re.IGNORECASE)
            if m:
                sous_section_courante = m.group(2).strip()
                continue

            # Sinon : texte d'intro, on laisse tomber dans le traitement normal

        # ── Début d'un trait ──
        if s and s[0] in SYMBOLES_TRAIT:
            if en_trait and bloc_courant:
                # Trait précédent sans ■ → on le sauvegarde quand même
                _enregistrer_trait(bloc_courant, section_courante,
                                   sous_section_courante, resultat, non_parses)
            bloc_courant = [s]
            en_trait = True
            continue

        # ── Fin d'un trait ──
        if s == SYM_FIN:
            if en_trait and bloc_courant:
                _enregistrer_trait(bloc_courant, section_courante,
                                   sous_section_courante, resultat, non_parses)
            bloc_courant = []
            en_trait = False
            continue

        # ── Contenu d'un trait ──
        if en_trait:
            bloc_courant.append(ligne)

        # sinon : texte d'intro/section, ignoré

    return resultat, non_parses


def _enregistrer_trait(bloc, section, sous_section, resultat, non_parses):
    """Parse un bloc et l'ajoute au bon bucket."""
    trait = parse_bloc(bloc, section, sous_section)
    if trait is None:
        non_parses.append(bloc[:])
        return
    cle = section or 'inconnu'
    if cle in resultat:
        resultat[cle].append(trait)
    else:
        resultat.setdefault('inconnu', []).append(trait)


# ─── Main ─────────────────────────────────────────────────────────────────────

def main():
    dossier = Path(__file__).parent

    source = Path(sys.argv[1]) if len(sys.argv) > 1 \
             else dossier / 'Compendium des Traits.docx.txt'

    sortie = Path(sys.argv[2]) if len(sys.argv) > 2 \
             else dossier / 'traits.json'

    if not source.exists():
        print(f"Erreur : fichier source introuvable : {source}")
        sys.exit(1)

    print(f"Lecture : {source}")
    donnees, non_parses = parse_fichier(source)

    total = sum(len(v) for v in donnees.values())
    print(f"\nRésultats :")
    for cle, items in donnees.items():
        print(f"  {cle:<30} : {len(items):>4} traits")
    print(f"  {'TOTAL':<30} : {total:>4} traits")

    if non_parses:
        print(f"\n  Avertissement : {len(non_parses)} bloc(s) non parsé(s) :")
        for bloc in non_parses[:5]:
            print(f"    • {bloc[0][:80]}")
        if len(non_parses) > 5:
            print(f"    … et {len(non_parses) - 5} de plus")

    with open(sortie, 'w', encoding='utf-8') as f:
        json.dump(donnees, f, ensure_ascii=False, indent=2)

    print(f"\nSortie : {sortie}")


if __name__ == '__main__':
    main()
