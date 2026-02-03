# Lexique

mATT : Modificateur d'attribut, se base sur l'attribut total, l'attribut en question dépend de la situation/du contexte
aATT : Modificateur d'attribut, se base sur l'[attribut total + ajustement d'équilibre]
[Encombrement Equipement] : Total des catégories de l'arme en main directrice, de l'arme en main non directrice et en armure

# Contraintes techniques

L'ensemble des données doivent être enregistrée dans les cookies/la session, il faut pouvoir importer ou exporter des données (donc récupérer le json sous forme de fichier ou pouvoir écraser les données via un json justement)

# Attributs

10 attributs principaux
    dont 5 de corps : Force (FOR), Dextérité (DEX), Agilité (AGI), Constitution (CON) et Perception (PER)
    et 5 d'esprit : Charisme (CHA), Intelligence (INT), Ruse (RUS), Volonté (VOL) et Sagesse (SAG)

6 attributs secondaires
    dont 2 de corps : Stature (STA), Taille (TAI)
    et 2 d'esprit : Ego (EGO), Apparence (APP)
    et 2 neutres : Chance (CHN), Equilibre (EQU)

2 attributs spéciaux : Magie (MAG) et Logique (LOG)

Un attribut est associé à une valeur de base, un cout en PA en fonction de cette valeur de base, un bonus lié à des ajustements d'origines ou de bonus autres, à un modificateur (calculé comme pour DnD, à savoir (Valeur-10)/2), à une défense passive normale (10+mATT+5) et choquée (10+mATT)
Les défenses sont augmentées de 1 si l'attribut a une valeur impaire

L'équilibre de base vaut la moyenne entre l'attribut principal le plus élevé et le plus bas, le reste est un choix libre allant de 7 à 22

## Attributs et PA

Les attributs ont un cout en PA (point d'attribut) de 0.5*(valeurs-8+1)*(valeurs-8+6)
Donc à 7 ça ne cout rien, au delà ça cout des PA
Le personnage débute avec des PA et en gagne selon le rang de sa caste, le total des couts de ses attributs de base ne doit pas dépasser les PA totaux (dans l'ui on affiche PA restants et PA totaux)

# Ressources

Endurance (PE) = Equilibre x 2, icone ⚡
Vitalité (PV) = 2 x CON, icone ❤️
Spiritualité (PS) = 2 x VOL, icone 💙
Chi (PC) = Attribut de Caste 1 + Attribut de Caste 2, icone 💠
Karma (PK) = 2 x CHN, icone ⭐
Mana (PM) = 2 x Attribut de Tradition (if any) (à choisir), icone 🔮

## Traditions

Tradition communes:
- Académique (INT)
- Shamanique (SAG)
- Profane (RUS)
- Hérmétique (VOL)
- Artistique (CHA)

Tradition peu communes:
- Ornementale (CON)
- Caprice (CHN)

# Caste

Une caste se caractérise par:
- Un nom
- Deux attributs (parmi les principaux)
- Deux ressources
- Une à deux sauvegarde primaire
- Deux sauvegardes secondaires
- La caste a un rang (entre 0 et 20) => dépends de l'XP du personnage (voir le tableau plus bas)

> la liste des castes fait l'objet d'un json qui contient les configurations utiles

## Rang de la Caste

Le rang de la caste est ajouté aux maximums des ressources de la caste.

## Sauvegardes

Une sauvegarde est un bonus ou malus (+ ou -) pour un test.
Ce bonus (ou malus si négatif) vaux mATT.
L'attribut pris en considération est la valeur finale de l'attribut + un ajustement qui dépends du niveau de la caste et de si la sauvegarde est primaire, secondaire ou classique (voir ci dessous).

- Robustesse (CON)
- Détermination (VOL)
- Réflexes (AGI)
- Sang-Froid (RUS)
- Intuition (SAG)
- Fortune (CHN)
- Opposition (MAG/LOG, le plus haut des deux)
- Prestige (APP)

# Caractéritiques

Allure = 10 + mTAI + mAGI - [Encombrement Equipement]
Déplacement = Allure/2 (round down)
Récupération = 5 + aSAG
Prouesses Innée = mRUS
Menace = [Encombrement Equipement]
Portée (mêlée) = mTAI + Allonge de l'Arme de mêlée (= Catégorie de l'arme) / 4
Portée (distance) = Allonge de l'Arme à distance (= Catégorie de l'arme) * 4
Portée (mots) = 5
Résilience = 10 + mVOL + mEQU
Mémoire = INT - 5
Technique Max = mINT
Perforation Physique = mPER
Perforation Mentale = mSAG
Moral = mCHA
Contrôle Actif = mDEX
Contrôle Passif = mAGI
Absorption physique (naturelle) = mCON
Protection physique (naturelle) = 5 + mSTA
Résistance physique (naturelle) = 0
Absorption mentale (naturelle) = mVOL
Protection mentale (naturelle) = 5 + mEGO
Résistance mentale (naturelle) = 0
Charge maximale = 5 + FOR + STA
Encombrement maximum = 5 + FOR + STA
Poigne = FOR
Charge mentale maximale = 5 + CHA + EGO
Poigne mentale = CHA

# Contraintes

Corruption, chaque fois que la corruption actuelle dépasse la résilience le personnage subit une pénalité équivalante aux tests
Fatigue, chaque fois que la fatigue actuelle dépasse la résilience le personnage subit une pénalité équivalante aux tests

# Valeurs dynamiques

Charge actuel = Poids de l'arme main directrice + poids de l'arme main non directrice + poids de l'armure
Si Charge actuelle > Charge maximale : Désavantages aux tests

Si le poids de l'arme dépasse la poigne : Désavantages aux tests réalisés avec

# Ressources temporaires

Généralement à 0, maximum = Résilience

A ajouter via un menu qui permet d'ajouter une ligne/supprimer au besoin, car pas toujours pertinent/utile/présent: Garde, Adrénaline, Rage + toutes les ressources normales (qui peuvent être sous forme temporaires)

# Personnalisation

Le personnage peux choisir un:
- Comportement (Alpha, Bêta, Dela, Lambda)
- Caractère (Alpha, Bêta, Dela, Lambda)
- Origines (Humain	Elf	Nain	Sémie	Démie	Vermine	Férale)
- Ethnies (parmis une liste issus d'un json, car il y aura des informations utiles dedans)
- Destinée 
- Vécu
- Nombre fétiche (choix de 1 à 6)

## Destinée

Nom / PA de départ  / PP de départ / Max Attribut (base) de départ
Commun des Mortels / 200 / 2 / 14
Destin Honorable / 300	4 / 15
Marche de la Gloire / 400 / 6 / 16
Arpenteur Héroïque / 500 / 8 / 17
Dieu parmi les Hommes / 600 / 10 / 18

## Vécu

Nom / XP de départ  / Finances de départ (en pc argent) / Max Compétence / Groupe de départ
Aucun / 200 / 10 / 1 / 1
Notable / 300 / 15 / 1 / 2
Admirable / 400	20	2 / 2
Spectaculaire / 500 / 25 / 2 / 3
Légendaire / 600 / 30 / 2 / 4

# Pages

L'application se présente comme un livre avec des onglets sur le coté, l'onglet du haut est le principal avec les attributs, caractéristiques, etc...
Le suivant "Compétences", qui sera détaillé plus tard
Le suivant "Inventaire", qui sera détaillé plus tard
Le suivant "Mémoire", qui sera détaillé plus tard
Le suivant "Magie", qui sera détaillé plus tard
Le dernier onglet est l'onglet "confrontation", qui sera détaillé plus tard

# Rang de Castes et ses valeurs

Castes
Expérience	Aptitude	Rang	Titre	Bonus Equilibre	PA	PA Total	Sauvegarde Majeur	Sauvegarde Mineur	Sauvegarde autre
0	0	0	Quidam	0	0	0	0	0	0
50	7	1	Apprenti	0	7	7	2	1	0
100	9	2	Apprenti+	1	8	15	2	1	0
225	11	3	Compagnon	1	9	24	3	1	0
375	13	4	Compagnon+	2	10	34	3	2	0
550	17	5	Expert	2	11	45	4	2	1
700	21	6	Expert+	3	12	57	4	2	1
950	25	7	Maitre	3	13	70	5	3	1
1250	29	8	Maitre+	4	14	84	5	3	1
1600	33	9	Grand Maitre	4	15	99	6	3	2
2000	37	10	Grand Maitre+	5	16	115	6	4	2
2400	42	11	Sommité	5	17	132	7	4	2
2800	47	12	Sommité+	6	18	150	7	4	2