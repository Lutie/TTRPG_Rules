# Fix TODO — Corrections différées

Ce fichier recense les corrections à apporter aux fichiers markdown issus de la conversion docx → md.
À traiter par session selon les tokens disponibles. Commencer par les fichiers courts.

---

## 1. Listes cassées (docs/regles/)

Lors de la conversion, certaines listes à puces ont été fusionnées en une seule ligne avec ` - ` comme séparateur au lieu d'être sur des lignes distinctes. Pattern typique : `phrase introductive : - élément 1. - élément 2. - élément 3.`

### Fichiers à corriger (du plus court au plus long)

| Fichier | Lignes | Priorité |
| --- | --- | --- |
| `docs/regles/chapitre-1-les-attributs.md` | 32 | Court |
| `docs/regles/chapitre-6-la-caste-du-personnage.md` | 70 | Court |
| `docs/regles/chapitre-0-le-systeme-de-jeu.md` | 74, 147 | Court |
| `docs/regles/chapitre-7-la-progression-du-personnage.md` | 35, 40, 56 | Moyen |
| `docs/regles/chapitre-4-les-caracteristiques.md` | 117, 123, 131 | Moyen |
| `docs/regles/chapitre-5-la-creation-de-personnage.md` | 204, 206, 210, 212, 264, 336 | Moyen |
| `docs/regles/chapitre-9-les-objets.md` | 7, 9, 142, 167, 171, 278, 405, 410, 417, 426, 428, 511 | Long |
| `docs/regles/chapitre-10-l-aventure-autres-regles.md` | 61, 95, 295, 386, 399, 603, 636 | Long |
| `docs/regles/chapitre-8-les-confrontations.md` | 77, 369, 381, 409, 632, 844, 1453, 1643, 1919, 1923 | Très long — garder pour fin |

> Pour retrouver les occurrences restantes : `grep -n ".+ - .+ - .+ - " docs/regles/*.md`

---

## 2. Tableaux cassés

Les tableaux cassés dans `docs/regles/` ont déjà été corrigés. Les répertoires suivants n'ont **pas encore été vérifiés** :

| Répertoire | Statut |
| --- | --- |
| `docs/regles/` | ✅ Traité |
| `docs/equipement/` | ❌ Non vérifié |
| `docs/confrontation/` | ❌ Non vérifié |
| `docs/magie-ext/` | ❌ Non vérifié |
| `docs/steam-ext/` | ❌ Non vérifié |
| `docs/styles/` | ❌ Non vérifié |

> Pour trouver les tableaux suspects : chercher des `|` sans ligne de séparation `| --- |` dans les 2 lignes suivantes, ou des cellules avec contenu multiligne.

---

## 3. Listes cassées hors docs/regles/

Non encore auditées. Mêmes répertoires que ci-dessus à passer au crible une fois les regles/ terminées.
