## Statut du chantier — 18 juillet 2026

Ce fichier est un brouillon historique et ne constitue plus la source canonique des règles déjà intégrées.

- **Règles générales des objets technologiques complexes : intégrées.** Voir [Les Objets Technologiques Complexes](../docs/steam-ext/details/les-objets-technologiques-complexes.md).
- **Boucliers d'énergie : intégrés.** Leur fonctionnement, leurs améliorations génériques et les signatures uniques des fabricants sont présentés dans [Les Équipements — Les Boucliers d'Énergie](../docs/equipement/les-equipements.md#les-boucliers-denergie).
- **Véhicules : refonte volontairement reportée.** La documentation publique conserve uniquement les familles, les châssis et les prix provisoires. L'état de l'ancien système, les réflexions et les axes de reprise sont consignés dans [Audit et pistes de refonte des véhicules](vehicle_rules_audit.md).
- **Autres familles d'objets complexes : à traiter ultérieurement.** Les idées restantes de ce brouillon peuvent encore servir de base, mais devront être adaptées au système désormais canonique.

---

Les objets technologiques complexes (associés à l'extension des sciences donc) sont associés à des attributs.

# Attributs principaux

Ces attributs sont au nombre de 4.
Les attributs principaux sont toujours les mêmes et sont généralement représentatif d'un même aspect/une même notion, mais dans les faits et en terme de règle chaque attribut a un impact différent selon la nature de l'objet et des règles qui l'englobe.
Les attributs principaux définissent des caractéristiques spécifiques à l'objet.
Généralement les améliorations d'objets classiques peuvent modifier les attributs principaux.

# Caractéristiques

Il y a des caractéristiques qui découlent des attributs principaux. C'est là que la nature de l'objet interviens et transforme la notion "vague" des attributs principaux en notion concrète selon l'objet et son usage.
Il y a des caracs qui ne découlent pas des attributs principaux et dépendent de l'objet lui même.

# Généralités sur les objets complexes

Efficacité : Mesure l'efficacité de l'objet dans son domaine observable le plus parlant/utile/etc. Selon les systèmes/règles, généralement associé à l'attaque. Réponds à la question de si l'objet est efficace ou non.
Fiabilité : Mesure la durabilité dans le temps, la solidité, l'assurance qu'on peux avoir que l'objet va remplir sa mission sans faillir quelque soit la raison. Réponds à la question de si l'objet est fiable ou non. Selon les systèmes/règles, généralement associé à la défense.
Maniabilité : Mesure à quel point l'objet est pratique à l'usage. Un objet peut être efficace mais horrible à l'usage. Selon les systèmes/règles, généralement associé à la tactique. Réponds à la question de si l'objet est pratique ou non.
Rapidité : Mesure à quel point l'objet est réactif, simple à mettre en place, bref rapide à en faire l'usage. Selon les systèmes/règles, généralement associé à l'initiative. Réponds à la question de si l'objet est rapide ou non.

Note IA : Proposer de meilleure description ?

# Bouclier d'énergie

Efficacité > Magnitude (magnitude actuelle maximum).
Fiabilité > Capacité (magnitude totale que le bouclier peux récupérer, au delà de sa magnitude actuelle donc qui ne compte pas).
Maniabilité > Récupération (magnitude récupérée lorsque le délai est passé).
Rapidité > Délai (entre deux récupération).

Pas de carac en plus.

Le bouclier d'énergie dispose d'une magnitude actuelle et maximale, d'un stock actuelle et maximale, d'un délai et d'une récupération.
Le bouclier d'énergie peux réduire les dégats physique reçus jusqu'à hauteur de sa magnitude.
Lorsque le bouclier fait effet et perd de la magnitude un délai se déclanche, à la fin de ce dernier la magnitude est restaurée jusqu'à hauteur de la récupération. La magnitude actuelle ne peux jamais dépasser la magnitude maximale.
Lorsque le stock actuel est vide il faut changer de batterie/source d'énergie steam et remplacer, ce qui est requière une ACTC (le délai débute une fois l'appareil à nouveau alimenté).

Les caracs d'un bouclier débutent à 2 et peuvent monter jusqu'à 6 (avec des améliorations).
Magnitude = EFF x 2 + Qualité x 2.
Stock = FIA x 5 + Qualité x 5.
Récupération = MAN + Qualité.
Délai = 0 ~ 5
0 : Fin de journée
1 : Fin de scène
2 : Fin de tour
3 : Fin de round
4 : Fin de passe
5 : Fin d'action
6 : Immédiat (s'applique donc après chaque attaques d'une même action le cas échéant)

## Améliorations uniques

Les boucliers ont des améliorations bien à eux.
Globalement chaque constructeur d'arme propose aussi une amélioration de bouclier unique qui reflète sa mentalité/son lore.
/!\ TODO IA : Il faut lister les constructeurs ici et proposer un effet, parmis les effets on peux voir ce qui se fait sur BorderLands, mais en gros... dégats si touché, dégats aoe si touché, boost de dégats en réduisant la magnitude, recharge d'arme en résuidant la magnitude...

# Véhicules

Efficacité > Vitesse.
Fiabilité > 
Maniabilité > Manoeuvrabilité.
Rapidité > Accélération.

Caracs en plus :
Capacité (de passager).

Note IA : Oui on doit revoir les règles de base des véhicules.

## Améliorations uniques

Les véhicules ont des améliorations bien à eux.
Globalement chaque constructeur d'arme propose aussi une amélioration de véhicule unique qui reflète sa mentalité/son lore.
/!\ TODO IA : Il faut lister les constructeurs ici et proposer un effet, mais ça risque de pas être simple ah ah

# Améliorations

Ces objets ont souvent accés à des améliorations uniques qui dépendent de leurs nature.
Mais il existe aussi des améliorations dites "génériques".
Efficacité +1
Fiabilité +1
Maniabilité +1
Rapidité +1
Chaque constructeur d'arme propose une ou deux améliorations offrant, mais dans tous les cas un objet ne peux avoir qu'une seule de ces améliorations:
    +1 à deux caracs et -1 à une troisième
    +2 à une même carac et -1 à une autre (cout un peu plus cher que le reste)
/!\ TODO IA : il faudra faire la liste en retrouvant les constructeurs et en leurs associants les différentes combinaisons selon leurs lores/historiques
