# Audit de mise en page MkDocs

Contexte : une partie de `terre-natale/docs` provient d'une conversion DOCX vers Markdown. Le contenu est globalement present, mais plusieurs structures d'origine ont ete aplaties ou abimees : listes, tableaux, encadres, images et fiches mecaniques.

## Perimetre observe

La navigation MkDocs expose surtout :

- `regles/*`
- `confrontation/*`
- `magie-ext/details/*`
- `equipement/*`
- les compendiums generes (`traits`, `conditions`, `manoeuvres`, `mots-de-pouvoir`, `classes/castes`)

Attention : 15 fichiers sont strictement dupliques entre `magie-ext/details/` et `magie-ext/details-de-l-extension/`. La navigation utilise `magie-ext/details/`; `details-de-l-extension/` semble donc etre un doublon historique ou une sortie intermediaire.

## Familles de problemes

### 1. Listes aplaties en paragraphes

Symptome : des listes DOCX sont devenues des phrases du type :

```md
On denote deux types d'objets : - Les equipements. - Les consommables. - Les munitions.
```

Effet : lecture difficile, perte de hierarchie, impossible a scanner.

Exemples :

- `docs/regles/chapitre-9-les-objets.md:7`
- `docs/regles/chapitre-9-les-objets.md:167`
- `docs/regles/chapitre-8-les-confrontations.md`
- `docs/regles/chapitre-2-les-competences.md`
- `docs/rules/conditions.md`

Correction type :

- convertir les segments `: - ... - ...` en vraies listes Markdown ;
- isoler les phrases d'introduction ;
- reserver les listes aux informations vraiment enumerables.

### 2. Blocs "fiche" aplatis

Symptome : des entrees structurees sont sur une seule ligne :

```md
Penalites : ... Categorie : ... Description : ... Effet : ... Restrictions : ... Modularite : ...
```

Effet : les objets de regle (manoeuvres, matieres, consommables) deviennent indigestes alors qu'ils devraient etre consultables comme des fiches.

Exemples :

- `docs/confrontation/les-man-uvres.md:116`
- `docs/equipement/les-matieres.md:29`
- `docs/equipement/les-matieres.md:33`
- `docs/equipement/les-matieres.md:119`
- `docs/magie-ext/details/liste-des-man-uvres-incantatoires.md`

Correction type :

```md
#### Nom

| Champ | Valeur |
| --- | --- |
| Penalites | ... |
| Categorie | ... |
| Conditions | ... |

**Description.** ...

**Effet.** ...

**Modularite.** ...
```

Ou, pour les matieres :

```md
#### Carbone

| Donnee | Valeur |
| --- | --- |
| Prix de reference | +10 |
| Disponibilite | +1 |
| Qualite minimum | 1 |

**Description.** ...

**Propriete principale (arme).** ...

**Propriete principale (armure).** ...

**Propriete secondaire.** ...
```

### 3. Encadres de notes/admonitions casses

Symptome : les admonitions MkDocs existent (`!!! info`, `!!! tip`), mais leur contenu est souvent aplati, avec images collees au texte ou listes perdues.

Exemples :

- `docs/regles/chapitre-8-les-confrontations.md:59`
- `docs/confrontation/les-man-uvres.md:74`
- `docs/regles/chapitre-9-les-objets.md:167`
- `docs/regles/chapitre-10-l-aventure-autres-regles.md:603`

Correction type :

- garder l'admonition ;
- mettre l'image sur sa propre ligne ou la supprimer si elle n'apporte rien ;
- reformater le contenu interne comme paragraphes/listes normales ;
- eviter les images inline dans les phrases.

### 4. Images DOCX parasites

Symptome : images avec alt text de conversion automatique ou chemins locaux :

```md
![A yellow diamond with a black strip Description automatically generated](images/image1.png)
![C:\Users\home\Pictures\Icones Dragon Age\DA2 ico\latest_014.png](images/image2.png)
```

Effet : alt-text bruité, traces de machine locale, images parfois collees a la phrase precedente.

Exemples :

- `docs/confrontation/les-man-uvres.md:121`
- `docs/confrontation/les-man-uvres.md:258`
- `docs/regles/chapitre-9-les-objets.md:242`
- `docs/regles/chapitre-9-les-objets.md:344`
- `docs/regles/chapitre-8-les-confrontations.md:59`
- `docs/magie-ext/details/l-usage-de-la-magie.md`

Correction type :

- remplacer les alt texts automatiques par un libelle court (`Note`, `Schema`, `Icone de rappel`) ;
- supprimer les chemins `C:\Users\...` ;
- deplacer l'image sur une ligne separee ;
- supprimer les images purement decoratives si elles ne servent qu'a signaler un encadre.

### 5. Tableaux recuperes mais sales

Symptome : tableaux Markdown presents, mais avec colonnes vides, en-tetes perdus, images inline dans cellules, ou valeurs fusionnees.

Exemples :

- `docs/regles/chapitre-9-les-objets.md:74`
- `docs/regles/chapitre-9-les-objets.md:216`
- `docs/equipement/les-ameliorations.md`
- `docs/equipement/les-equipements.md`
- `docs/listes/liste-des-achats.md:151`
- `docs/regles/chapitre-5-la-creation-de-personnage.md:307`

Correction type :

- renommer les colonnes vides ;
- separer les icones des valeurs ou les retirer ;
- scinder les tableaux trop larges ;
- verifier si un tableau doit devenir une liste de fiches.

### 6. HTML/JS embarque volontaire

Symptome : plusieurs compendiums sont generes en HTML/JS (`<div>`, `<table>`, `<script>`, `<style>`).

Fichiers concernes :

- `docs/traits/index.md`
- `docs/conditions/index.md`
- `docs/manoeuvres/index.md`
- `docs/mots-de-pouvoir/*.md`
- `docs/classes/castes.md`

Ce n'est pas forcement un probleme de conversion DOCX. Ces pages doivent etre traitees cote generateur si on veut ameliorer leur rendu, pas nettoyees manuellement ligne par ligne.

### 7. Doublons de documentation

Il existe 15 doublons stricts entre :

- `docs/magie-ext/details/*.md`
- `docs/magie-ext/details-de-l-extension/*.md`

La navigation MkDocs pointe vers `docs/magie-ext/details/*.md`.

Action conseillee :

- confirmer que `details-de-l-extension/` n'est plus utilise ;
- l'exclure du chantier ou l'archiver ;
- eviter de corriger les deux dossiers a la main.

### 8. Encodage / mojibake

Les extraits PowerShell affichent souvent des caracteres du type `Ã©`, mais l'audit en octets indique que ce n'est pas massif dans les fichiers sources. Il reste quelques vrais cas isoles.

Fichiers avec vrais indices d'encodage suspect :

- `docs/heros-ext/details/les-voies.md`
- `docs/heros-ext/details/les-dons.md`
- `docs/regles/chapitre-8-les-confrontations.md`
- quelques pages `mots-de-pouvoir/*`

Action conseillee :

- traiter ces cas apres les problemes structurels ;
- ne pas lancer de correction globale d'encodage sans verification, car la plupart des fichiers semblent deja en UTF-8 correct.

## Fichiers prioritaires

### Priorite 1

`docs/regles/chapitre-9-les-objets.md`

Problemes : listes aplaties, notes cassees, nombreuses images inline, tableaux sales.

Exemples :

- `: - ... - ...` ligne 7 ;
- glossaire de prix aplati ligne 148 ;
- rappel "Tous les objets ont donc..." ligne 167 ;
- images DOCX inline lignes 242, 344, 397, 408, 413, 420, 431, 442, 451, etc.

### Priorite 2

`docs/confrontation/les-man-uvres.md`

Problemes : fiches de manoeuvres aplaties en une ligne, images DOCX avec chemins locaux, notes cassees.

Exemples :

- premiere fiche a restructurer vers la ligne 116 ;
- images avec `C:\Users\...` lignes 121, 258, 405, 534, 717 ;
- note optionnelle avec image collee ligne 74.

### Priorite 3

`docs/equipement/les-matieres.md`

Problemes : tres longs blocs de matieres, champs repetes `Description / Proprietes` aplatis, sections qui devraient devenir fiches ou tableaux.

Exemples :

- metaux communs ligne 29 ;
- metaux peu communs ligne 33 ;
- cuirs/tissus lignes 107, 119, 123, 127, 131, 135.

### Priorite 4

`docs/regles/chapitre-8-les-confrontations.md`

Problemes : notes cassees, images inline, listes aplaties, sections et sous-sections parfois perdues.

Exemples :

- note avec image automatique ligne 59 ;
- initiative et listes aplaties autour des lignes 70-90 ;
- gros bloc de definitions ligne 611 ;
- images inline recurrentes dans les rappels.

### Priorite 5

`docs/magie-ext/details-de-l-extension.md` et `docs/magie-ext/details/*`

Problemes : beaucoup d'images, notes, tableaux de correspondances elementaires, doublons avec `details-de-l-extension/`.

Action prealable : decider quel dossier est canonique. La navigation pointe vers `details/`.

### Priorite 6

Autres fichiers a traiter ensuite :

- `docs/equipement/les-consommables.md`
- `docs/equipement/les-ameliorations.md`
- `docs/regles/chapitre-10-l-aventure-autres-regles.md`
- `docs/regles/chapitre-2-les-competences.md`
- `docs/regles/chapitre-5-la-creation-de-personnage.md`
- `docs/confrontation/la-confrontation.md`
- `docs/confrontation/details-de-l-extension.md`

## Ordre de chantier conseille

1. Definir les conventions de rendu :
   - admonitions ;
   - images de rappel ;
   - fiches mecaniques ;
   - tableaux larges ;
   - listes de regles.

2. Nettoyer les images/notes de rappel :
   - supprimer les alt-texts DOCX ;
   - enlever les chemins locaux ;
   - separer images et paragraphes.

3. Convertir les listes aplaties dans les chapitres de base :
   - commencer par `chapitre-9` et `chapitre-8`.

4. Convertir les fiches mecaniques :
   - manoeuvres ;
   - matieres ;
   - consommables.

5. Nettoyer les tableaux :
   - renommer les colonnes vides ;
   - scinder les tableaux trop larges ;
   - enlever les icones inutiles dans les cellules.

6. Traiter les doublons :
   - choisir `magie-ext/details/` comme source canonique si la nav reste ainsi ;
   - ignorer ou archiver `details-de-l-extension/`.

7. Ne toucher aux compendiums generes qu'en modifiant leurs scripts generateurs.

## Remarque importante

Ne pas corriger manuellement les fichiers generes si un script les regenere ensuite. Pour ces pages, la bonne correction se fait dans `terre-natale/tools`.

