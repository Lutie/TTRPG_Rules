# tools/ — Scripts de génération

Ce répertoire contient les scripts Python qui alimentent à la fois la documentation MkDocs (`docs/`) et les apps React (`app-sheet/`, `app-dash/`).

---

## Vue d'ensemble

```
sources (xlsx / txt / csv / md)
        │
        ▼
  scripts Python
        │
        ├─► out_domains/ out_schools/ out_spells/   (→ copier dans docs/ manuellement)
        ├─► docs/…/index.md                         (écriture directe)
        ├─► tools/*.json                             (intermédiaires)
        └─► app-sheet/src/data/*.json               (consommés par React)
```

## Tableau récapitulatif

| Script | Source | Génère |
|--------|--------|--------|
| `pipeline_magie.py` | `Magies.xlsx` | `out_schools/`, `out_domains/`, `out_spells/`, `all_magic_words.json`, `all_spells.json` → auto-copié dans app-sheet |
| `parse_traits.py` | `Compendium des Traits.docx.txt` | `traits.json` |
| `export_traits.py` | `traits.json` | `app-sheet/src/data/traits.json` |
| `parse_manoeuvres.py` | `Manoeuvres & Prouesses.xlsx` | `manoeuvres.json`, `prouesses.json` |
| `parse_castes.py` | `Castes.xlsx` | `docs/classes/castes.md`, `app-sheet/src/data/castes.js` |
| `parse_competences.py` | `Terre Natale.docx.txt` | `competences.json`, `app-sheet/src/data/competences.js` |
| `parse_ethnies.py` | `docs/ethnies/ethnies.md` | `ethnies.json`, `app-sheet/src/data/ethnies.js` |
| `parse_particularites.py` | `docs/ethnies/ethnies.md` | `app-sheet/src/data/particularites.json` |
| `generate_doc_manoeuvres.py` | `manoeuvres.json` | `docs/manoeuvres/index.md` |
| `generate_doc_styles.py` | `src/Styles - Corpus.csv` | `styles.json`, `docs/styles/index.md` |
| `generate_doc_archetypes.py` | `archetypes.json` | `docs/archetypes/index.md` |
| `generate_doc_conditions.py` | `src/Conditions - Conditions.csv` | `docs/conditions/index.md`, `app-sheet/src/data/conditions.json` |

---

Convention de nommage :
- `parse_*` — lit une source brute (xlsx, txt, csv, md) → JSON intermédiaire
- `generate_doc_*` — JSON intermédiaire → page MkDocs
- `export_*` — JSON intermédiaire → fichier consommé par app-sheet
- `pipeline_*` — fait tout d'un bout à l'autre (parse + doc + export)

---

## Scripts

### `pipeline_magie.py`
**Source :** `Terre Natale - Aides de jeu _ Magies.xlsx`  
**Génère :**
- `out_schools/*.md` — un fichier par école (10 écoles)
- `out_domains/*.md` — un fichier par domaine (30 domaines)
- `out_spells/*.md` — sorts par domaine/école
- `all_magic_words.json` — 829 mots magiques (intermédiaire)
- `other_magic_words.json` — mots L/A/F
- `all_spells.json` — 515 sorts → **auto-copié vers `app-sheet/src/data/`**

```bash
cd tools && python3 pipeline_magie.py
# Ensuite copier out_domains/ et out_schools/ vers docs/ si nécessaire
```

---

### `parse_traits.py` + `export_traits.py`
Pipeline en deux étapes.

**`parse_traits.py`** — `Compendium des Traits.docx.txt` → `traits.json` (445 traits)  
**`export_traits.py`** — `traits.json` → `app-sheet/src/data/traits.json`

```bash
cd tools && python3 parse_traits.py && python3 export_traits.py
```

---

### `parse_manoeuvres.py`
**Source :** `Terre Natale - Aides de jeu _ Manoeuvres & Prouesses.xlsx`  
**Génère :** `manoeuvres.json` + `prouesses.json`

```bash
cd tools && python3 parse_manoeuvres.py
```

---

### `parse_castes.py`
**Source :** `Terre Natale - Aides de jeu _ Castes.xlsx`  
**Génère :** `docs/classes/castes.md` + `app-sheet/src/data/castes.js`

---

### `parse_competences.py`
**Source :** `Terre Natale.docx.txt`  
**Génère :** `competences.json` + `app-sheet/src/data/competences.js`

---

### `parse_ethnies.py`
**Source :** `docs/ethnies/ethnies.md`  
**Génère :** `ethnies.json` + `app-sheet/src/data/ethnies.js`

---

### `parse_particularites.py`
**Source :** `docs/ethnies/ethnies.md`  
**Génère :** `app-sheet/src/data/particularites.json`

---

### `generate_doc_manoeuvres.py`
**Source :** `manoeuvres.json`  
**Génère :** `docs/manoeuvres/index.md`

---

### `generate_doc_styles.py`
**Source :** `src/Styles - Corpus.csv`  
**Génère :** `styles.json` + `docs/styles/index.md`

---

### `generate_doc_archetypes.py`
**Source :** `archetypes.json` (maintenu à la main)  
**Génère :** `docs/archetypes/index.md`

---

### `generate_doc_conditions.py`
**Source :** `src/Conditions - Conditions.csv`  
**Génère :** `docs/conditions/index.md` + `app-sheet/src/data/conditions.json`

---

## Fichiers sources

| Fichier | Utilisé par |
|---------|------------|
| `Compendium des Traits.docx.txt` | `parse_traits.py` |
| `Terre Natale.docx.txt` | `parse_competences.py` |
| `Extension - Magie.docx.txt` | (référence doc, non parsé actuellement) |
| `Terre Natale - Aides de jeu _ Magies.xlsx` | `pipeline_magie.py` |
| `Terre Natale - Aides de jeu _ Castes.xlsx` | `parse_castes.py` |
| `Terre Natale - Aides de jeu _ Manoeuvres & Prouesses.xlsx` | `parse_manoeuvres.py` |

---

## JSONs intermédiaires (dans `tools/`)

Ne pas modifier à la main — sorties de scripts, entrées pour d'autres.

| Fichier | Généré par | Consommé par |
|---------|-----------|--------------|
| `traits.json` | `parse_traits.py` | `export_traits.py` |
| `manoeuvres.json` | `parse_manoeuvres.py` | `generate_doc_manoeuvres.py` + app-sheet |
| `prouesses.json` | `parse_manoeuvres.py` | app-sheet |
| `styles.json` | `generate_doc_styles.py` | *(self)* |
| `competences.json` | `parse_competences.py` | app-sheet |
| `ethnies.json` | `parse_ethnies.py` | app-sheet |
| `archetypes.json` | *(manuel)* | `generate_doc_archetypes.py` |
| `all_magic_words.json` | `pipeline_magie.py` | *(référence)* |
| `all_spells.json` | `pipeline_magie.py` | app-sheet (auto-copié) |
| `other_magic_words.json` | `pipeline_magie.py` | *(référence)* |

---

## Dossiers de sortie

| Dossier | Contenu | Destination finale |
|---------|---------|-------------------|
| `out_schools/` | 10 `.md` par école de magie | `docs/magies/` (copie manuelle) |
| `out_domains/` | 30 `.md` par domaine | `docs/magies/` (copie manuelle) |
| `out_spells/` | `.md` par domaine/école (sorts) | `docs/magies/` (copie manuelle) |

---

## Notes

- `fix-todo.md` — corrections manuelles restantes sur `docs/regles/` (listes cassées, tableaux non vérifiés)
- `__pycache__/` — artefact Python standard, ignorable
