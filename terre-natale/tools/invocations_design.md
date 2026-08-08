# Invocations — Référentiel de design

## Formule d'équilibre

```
Score = Arme + Armure + Σ(Spéciaux) + (Sta + Tai + Ego + App) / 2
```

**Cible : 4 à 5 points.** Les modificateurs Sta/Tai/Ego/App/Chance/Équilibre (colonnes étendues) sont une soupape : si une créature a besoin de valeurs élevées dans ces attributs sans contrepartie en Arme/Armure/Spéciaux, ils s'appliquent en bonus de modificateur en jeu (hors formule).

Pour les stats (+/-) : viser **3 à 4 bonus** et **3 à 4 malus** par profil.

---

## Colonnes du profil

| Colonne | Description |
|---|---|
| Arme | Valeur d'arme (0 = inerme, 5 = armement lourd) |
| Armure | Valeur de protection (0 = nue, 5 = plein acier) |
| Sta / Tai / Ego / App | Stature / Taille / Ego / Apparence — modificateurs physiques et sociaux |
| Spécial | Capacités d'orientation du gameplay (1–3, jamais plus) |
| Capacités | Deux capacités passives : une de Type, une d'Archétype |
| Compétences P | Groupe de compétence principal |
| Compétences S | Groupe de compétence secondaire |
| FO DX AG CO PE CA IN RU VL SG CH EQ MG | Bonus (+) ou malus (-) aux attributs du personnage invoquant |

---

## Spéciaux — liste et logique

Un Spécial oriente le style de jeu de la créature. Il n'est pas un bonus passif mais une règle particulière. Valeur de 1 à 3 (jamais plus).

| Spécial | Effet |
|---|---|
| **Tir X** | Peut attaquer à distance catégorie X |
| **Focus X** | Augmente le niveau de sort de X (pour les sorts invoqués via la créature) |
| **Monture** | Peut être montée par l'invocateur ou un allié |
| **Statique** | Ne peut pas se déplacer mais gagne des avantages liés à l'ancrage |
| **Vol** | Peut voler ; avantages liés à la position aérienne |

---

## Capacités passives — système

Chaque invocation a **deux capacités** :

1. **Capacité de Type** — partagée par toutes les créatures du même type. Définit le comportement fondamental de la famille.
2. **Capacité d'Archétype** — propre à la créature. Définit sa particularité unique.

Les capacités sont **passives** : toujours actives ou déclenchées automatiquement par une condition (proximité, action ennemie, état…). Ce ne sont pas des actions jouées.

Format : `[Nom] — [Déclencheur / condition] → [Effet, éventuellement échelle N = niveau du sort d'invocation]`

---

## Mapping Règnes du Bestiaire

Les invocations héritent des propriétés de règne du bestiaire. Le niveau {x} du bestiaire = N (niveau du sort d'invocation).

| Type invoc | Règne bestiaire | Attributs | Particularité 1 | Particularité 2 |
|---|---|---|---|---|
| **Élémentaire** | Élémentaire | Boost/deboost selon élément + force/faiblesse | Mana surnaturelle {N} | Magie élémentaires/énergies {N} |
| **Empyréen** | Primordial | Boost tout, Équilibre /= 2 | Karma surnaturelle {N} | Magie divin/occulte {N} |
| **Hypogéen** | Primordial | Boost tout, Équilibre /= 2 | Karma surnaturelle {N} | Magie divin/occulte {N} |
| **Esprit** | Sylvestre | Deboost tous attributs, double boost Chance/Équilibre | Opposition +{N} | — |
| **Zodiaque** | Spectral | Corps = 0, immunité physique | Spiritualité surnaturelle {N} | Maladie mentale {N} |
| **Guerrier** | Humanoïde | Pas de modificateurs | Qualité des objets et améliorations {N} | Styles de combat {N} |
| **Bête** | Animal | Boost Corps, Deboost Esprit | Férocement compétent {N} | Pattern de combat {N} |
| **Flore** | Sylvestre | Deboost tous attributs, double boost Chance/Équilibre | Naturellement compétent {N} | Opposition +{N} |
| **Arcane** | Maudit | Boost tout, Chance /= 2 | Immunité {N} (intuable, sauf condition propre à la carte) | Implacable {N} (fait très mal, sauf condition propre à la carte) |
| **Objet** | Artificiel | Esprit = 0, immunité mentale, Magie 0 | Solide {N} | Opposition +{N} |
| **Chimère** | Chimèrique | Double boost Corps, Double deboost Esprit | Chi surnaturelle {N} | Multiple nature {N} |

> **Esprit vs Flore (même règne Sylvestre)** : Esprit prend *Opposition* uniquement ; Flore prend *Naturellement compétent* + *Opposition*. Les Esprits ont un Spécial défensif actif (Fuyant), les Flores s'ancrent.

---

## Capacités de Type

Chaque type a une capacité passive propre qui s'ajoute par-dessus les propriétés de règne héritées ci-dessus.

| Type | Capacité de Type | Déclencheur |
|---|---|---|
| **Élémentaire** | *Corps Élémentaire* — résistance +2N contre son élément fort, faiblesse +2N contre son élément faible ; dégâts de corps à corps full élémentaires +N ; Endurance +2N | Passif permanent |
| **Empyréen** | *Aura de Vertu* — octroie un statut positif propre à la vertu (catégorie N = 2+N dés 8) à tous les alliés dans la zone | Entrée dans la zone (alliés) |
| **Hypogéen** | *Aura de Vice* — inflige un statut négatif propre au vice (catégorie N, sauvegarde selon le statut) à tous les ennemis dans la zone | Entrée dans la zone (ennemis) |
| **Esprit** | *Fuyant* — une fois par tour, gagne un bonus de 2N en défenses contre une action de combat (attaque ou tactique) ciblant l'esprit | Réaction à une attaque/tactique |
| **Zodiaque** | *Influence Astrologique* — bonus de N aux jets liés aux deux domaines du signe (voir liste par archétype) ; leurs attaques affectent le mental plutôt que le physique (Maladie mentale {N} via Spectral) | Passif permanent |
| **Guerrier** | *Bouclier vivant* — les défenses passives du guerrier sont augmentées de N (flat), car son rôle est d'encaisser à la place de l'invocateur | Passif permanent |
| **Bête** | *Instinct Animal* — Perception +N, Initiative +N ; ne peut jamais être surprise | Passif permanent |
| **Flore** | *Racines* — peut s'ancrer pour immobiliser une cible adjacente (force = N) | Déclenchement sur contact adjacent |
| **Arcane** | *Immanence* — sa présence altère la réalité selon sa carte (Immunité {N} + Implacable {N} du règne Maudit ; condition spécifique à chaque arcane) | Passif permanent |
| **Objet** | *Inanimé* — insensible à la douleur, à la peur et aux effets mentaux ; ne peut pas être soigné mais peut être réparé | Passif permanent |
| **Chimère** | *Nature Composite* — cumule deux capacités de Type issues de ses natures mélangées | Passif permanent |

---

## Inspirations par Archétype

### ÉLÉMENTAIRE *(complet)*
Profils déjà définis dans la feuille.

---

### ESPRIT *(complet)*
Pixies des quatre saisons, focus magique sur leur domaine élémentaire saisonnier.

---

### EMPYRÉEN — Anges des vertus

Créatures de soutien et de bénédiction. Faible en combat direct, puissantes en aura et buff. Profils sociaux/mentaux.

| Archétype | Inspiration | Domaines | Note Lutie |
|---|---|---|---|
| Chasteté | Pureté de l'esprit, résistance aux corruptions mentales ; bouclier contre la manipulation | Défense · Discipline | - |
| Tempérance | Modération, équilibre des extrêmes ; atténue à la fois les pics de dégâts et les déficits | Représentation · Analyse | - |
| Charité | Don sans retour, soin, compassion ; transfère ses propres ressources aux alliés | Guérison · Inspiration | - |
| Diligence | Travail acharné, persistance ; augmente l'endurance et la capacité d'action des alliés | Discipline · Athlétisme | - |
| Patience | Tolérance face à l'adversité ; absorbe les effets négatifs destinés aux alliés | Défense · Représentation | - |
| Bonté | Générosité inconditionnelle ; partage ses bonus avec tous les alliés dans la zone | Inspiration · Éloquence | - |
| Humilité | Reconnait ses limites et celles des autres ; réduit les bonus excessifs des ennemis | Analyse · Connaissances | - |
| Droiture | Justice et vérité ; révèle les tromperies et les invisibles dans la zone | Enquête · Connaissances | - |
| Courage | Bravoure face au danger ; immunise les alliés proches à la peur et booste l'offensive | Communication · Combat | - |

---

### HYPOGÉEN — Démons des vices

Miroirs noirs des Empyréens. Créatures de malédiction et d'aura négative. Plusieurs ont un potentiel offensif.

| Archétype | Inspiration | Domaines | Note Lutie |
|---|---|---|---|
| Luxure | Séduction, domination par le désir ; charme et contrôle mental en aura | Éloquence · Inspiration | - |
| Gourmandise | Dévoration, épuisement des ressources ; draine PV ou ressources des ennemis proches | Corps à Corps · Discipline | - |
| Avarice | Cupidité, vol ; copie et annule les buffs ennemis au profit de ses alliés | Larcin · Subterfuge | - |
| Paresse | Torpeur, ralentissement ; aura de fatigue qui réduit les actions disponibles | Sagacité · Représentation | - |
| Colère | Furie pure, berserker destructeur ; Arme max, dégâts directs en zone courte | Combat · Athlétisme | - |
| Envie | Jalousie, mimétisme offensif ; retourne les forces ennemies contre eux | Sagacité · Connaissances | - |
| Orgueil | Arrogance, supériorité ; debuff de moral sur tous les ennemis dans la zone | Communication · Entregent | - |
| Supercherie | Illusion, confusion, identité fracturée ; cibles ne peuvent distinguer ami/ennemi | Subterfuge · Discrétion | - |
| Couardise | Peur contagieuse ; aura de terreur qui pousse les ennemis à fuir ou se figer | Représentation · Sagacité | - |

---

### ZODIAQUE — Esprits des constellations

Profils variés, chacun avec deux domaines distincts pour les différencier. Ni uniquement combat, ni uniquement support.

| Archétype | Inspiration | Domaines | Note Lutie |
|---|---|---|---|
| Bélier | Fonceur impulsif, charge en tête ; bruiser offensif, ignore la défense, attaque frontale | Combat · Athlétisme | - |
| Taureau | Immuable, indestructible, stoïque ; tank pur, difficile à déplacer ou à affecter | Défense · Discipline | - |
| Gémeaux | Dualité, communication, miroir ; hybride social/magie, peut agir deux fois mais avec moins d'impact | Connaissances · Inspiration | - |
| Cancer | Carapace et contre-attaque ; attaque uniquement si frappé en premier, défense extrême | Défense · Corps à Corps | - |
| Lion | Roi, cri de guerre, charisme conquérant ; buff de moral massif, peut rugir pour imposer sa présence | Communication · Combat | - |
| Vierge | Précision analytique, soutien discret ; heal et boost de précision, aucun effet offensif | Guérison · Analyse | - |
| Balance | Justice des deux côtés ; combattant deux lames, frappe équilibrée et parade simultanée | Combat · Défense | - |
| Scorpion | Poison, secrets, attente dans l'ombre ; assassin patient, bonus fort sur cibles affaiblies | Discrétion · Larcin | - |
| Sagittaire | Liberté, mobilité, archer philosophe ; tir mobile, jamais statique, bonus de déplacement | Armes de Trait · Survie Rurale | - |
| Capricorne | Ambition disciplinée, deux armes, montée en puissance ; devient plus fort au fil des rounds | Combat · Discipline | - |
| Verseau | Innovation, électricité, penseur rebelle ; magic user technologique, effets de zone inattendus | Connaissances · Domaine | - |
| Poisson | Illusion, eau, rêve ; insaisissable, confusion des cibles, magie mentale | Discrétion · Domaine | - |

---

### ARCANES MAJEURS — Esprits du Tarot

Chaque arcane est fort en thématique symbolique. Profils très variés.

| Archétype | Inspiration | Domaines | Note Lutie |
|---|---|---|---|
| Le Mat | Chaos pur, imprévisible, hors des règles ; effets aléatoires de haute variance à chaque round | Sagacité · Savoir-Être | - |
| Le Magicien | Volonté manifestée, maîtrise des sorts ; Focus 3, magic user par excellence | Domaine · Arcanes | - |
| La Papesse | Mystère, intuition, savoir caché ; détection passive de tout ce qui est dissimulé | Enquête · Connaissances | - |
| L'Impératrice | Fertilité, nature, abondance ; régénération des alliés, terrain fertile | Guérison · Survie Rurale | - |
| L'Empereur | Autorité, structure, commandement ; buff de discipline collective, fortification de zone | Entregent · Analyse | - |
| Le Pape | Tradition, foi, rite ; bénit les alliés, annule les effets profanes dans la zone | Connaissances · Inspiration | - |
| L'Amoureux | Choix, dualité, lien affectif ; crée un lien entre deux cibles (partage de PV ou de sorts) | Éloquence · Inspiration | - |
| Le Chariot | Victoire par la volonté, mouvement conquérant ; charge mobile, bonus quand il se déplace | Athlétisme · Combat | - |
| La Justice | Loi, équité, conséquence ; retourne exactement les dégâts reçus sur leur source | Défense · Connaissances | - |
| L'Hermite | Solitude, sagesse, lumière dans l'obscurité ; guide à distance, bonus aux alliés isolés | Connaissances · Acuité | - |
| La Roue de Fortune | Destin, cycles, chance ; manipule les résultats de dés dans la zone (buff ou malus aléatoire) | Savoir-Être · Analyse | - |
| La Force | Courage intérieur, endurance, maîtrise de la bête ; tient en combat prolongé, s'améliore sous pression | Discipline · Corps à Corps | - |
| La Mort | Transformation inévitable, fin des choses ; dégâts de zone continus, affaiblit progressivement | Combat · Tactique | - |
| Tempérance | Alchimie, adaptation, flux ; combine deux effets opposés en quelque chose de nouveau | Guérison · Analyse | - |
| Le Diable | Enchaînement, ombre du soi, dépendance ; entrave les ennemis et exploite leurs faiblesses | Subterfuge · Larcin | - |
| La Tour | Destruction soudaine, révélation par le chaos ; AoE explosive dévastatrice, imprévisible | Combat · Athlétisme | - |
| L'Étoile | Espoir, renouveau, inspiration ; soin progressif et buff de moral durable | Guérison · Inspiration | - |
| La Lune | Illusion, peur, subconscient ; confusion et terreur, la réalité devient floue dans sa zone | Discrétion · Subterfuge | - |
| Le Soleil | Joie, vitalité, lumière ; dégâts radiants, révèle tout ce qui est caché, boost de moral | Combat · Acuité | - |
| Le Jugement | Résurrection, absolution, verdict final ; permet à un allié de se relever une fois ; finisher | Guérison · Connaissances | - |
| Le Monde | Accomplissement, intégration, totalité ; polyvalent, bonus dans tous les domaines mais plus faible partout | Analyse · Connaissances | - |

---

### GUERRIER — Compagnons de combat

Profils humanoïdes, spécialisés dans un style de combat précis.

| Archétype | Inspiration | Domaines | Note Lutie |
|---|---|---|---|
| Combattant | Guerrier polyvalent, arme et armure solides, aucune faiblesse marquée | Combat · Défense | - |
| Larron | Frappe rapide et fuite ; bonus en embuscade, pénalité en combat prolongé | Discrétion · Larcin | - |
| Gardien | Protecteur dédié ; se place entre les alliés et les ennemis, absorbe les attaques | Défense · Discipline | - |
| Archer | Tir précis à distance ; bonus à distance, pénalité en mêlée | Armes de Trait · Acuité | - |
| Tacticien | Commandant de terrain ; aucun bonus offensif propre mais amplifie les alliés | Tactique · Analyse | - |

---

### BÊTE — Animaux invoqués

Profils physiques. Chaque animal a un rôle écologique qui se transpose en combat.

| Archétype | Inspiration | Domaines | Note Lutie |
|---|---|---|---|
| Ursidé | Ours : force brute, frappe massive, intimidation naturelle | Corps à Corps · Discipline | - |
| Canidé | Loup : meute, pistage, attaque coordonnée avec l'invocateur | Chasse · Athlétisme | - |
| Cervidé | Cerf : vitesse, élégance, fuite et contournement ; mobil et difficile à attraper | Athlétisme · Acuité | - |
| Félidé | Félin : prédateur furtif, bond fatal, frappe létale depuis l'ombre | Discrétion · Corps à Corps | - |
| Rapace | Oiseau de proie : vision perçante, attaque aérienne en piqué | Acuité · Armes de Trait | - |
| Reptilien | Reptile : armure naturelle, patience froide, morsure puissante | Défense · Discipline | - |
| Aquatide | Créature aquatique : contrôle de l'espace aqueux, noyade, déstabilisation | Athlétisme · Survie Rurale | - |
| Équidé | Cheval : vitesse de déplacement exceptionnelle, Monture 2, charge | Athlétisme · Combat | - |
| Ophidien | Serpent : venin, constriction, mouvement silencieux | Discrétion · Corps à Corps | - |
| Suidé | Sanglier : charge frontale dévastatrice, défonce les lignes | Combat · Athlétisme | - |

---

### FLORE — Végétaux animés

Créatures lentes mais tenaces. Contrôle de zone et terrain.

| Archétype | Inspiration | Domaines | Note Lutie |
|---|---|---|---|
| Tréant | Arbre ancien, immense et lent ; coups massifs, résistance extrême, Statique 2 | Corps à Corps · Défense | - |
| Dryade Sylvestre | Esprit de la forêt ; magie de nature, soin des plantes, invisible en milieu boisé | Domaine · Survie Rurale | - |
| Plante Carnivore | Piège végétal ; immobilise et dévore les cibles proches | Corps à Corps · Tactique | - |
| Ronces Vivantes | Réseau d'épines ; contrôle de zone, ralentit et blesse tout ce qui se déplace | Défense · Tactique | - |
| Fleur Hypnotique | Charme olfactif ; hypnose passive sur les cibles proches qui ne se méfient pas | Inspiration · Éloquence | - |

---

### CHIMÈRE — Créatures composites

Hybrides de plusieurs natures. Stats mixtes entre leurs composantes. Capacité de Type = *Nature Composite* (cumule deux capacités de Type).

| Archétype | Inspiration | Domaines | Note Lutie |
|---|---|---|---|
| Shiva | Entité de glace multi-membre ; dégâts froids, ralentissement, frappe multiple | Domaine (Froid) · Combat | - |
| *(à compléter)* | … | … |

---

### OBJET — Armes animées

Pas de corps, juste l'arme. Statique ou mobile selon l'objet. Insensibles aux effets mentaux et physiques non-magiques.

| Archétype | Inspiration | Domaines | Note Lutie |
|---|---|---|---|
| Épée animée | Précision et rapidité ; attaques répétées, faible Armure | Combat · Défense | - |
| Hache animée | Puissance brute ; attaque lente mais dévastatrice, ignore l'armure légère | Combat · Athlétisme | - |
| Lance animée | Portée et percement ; maintient la distance, efficace contre les montées en ligne | Combat · Tactique | - |
| Arc animé | Tir autonome ; peut se positionner seul et tirer en couverture | Armes de Trait · Acuité | - |

---

## À faire

- [ ] Valider les inspirations ci-dessus
- [ ] Définir les Capacités d'Archétype pour chaque entrée
- [ ] Remplir les stats (Arme, Armure, Spéciaux, Sta/Tai/Ego/App, +/-, Compétences)
- [ ] Compléter la liste Chimère
- [ ] Reporter les profils validés dans le fichier XLSX
