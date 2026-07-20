# Audit et pistes de refonte des véhicules

## Contexte de la réflexion

Cette note consigne l'état des règles de véhicules de Terre Natale au moment de leur mise en retrait, ainsi que les réflexions qui devront servir de point de départ à leur future refonte.

L'extension de la Science introduit désormais les **objets technologiques complexes**. Ces objets possèdent quatre attributs techniques communs :

- **Efficacité** ;
- **Fiabilité** ;
- **Maniabilité** ;
- **Rapidité**.

Les quatre attributs techniques valent 2 sur un modèle standard et ne peuvent normalement pas dépasser 6. Les améliorations génériques permettent d'augmenter chacun d'eux de 1, jusqu'à trois occurrences d'une même amélioration. Les règles propres à chaque famille d'objets traduisent ensuite ces attributs abstraits en caractéristiques concrètes.

Les véhicules doivent devenir une famille d'objets technologiques complexes au même titre que les boucliers d'énergie. Leur futur système devra donc respecter cette structure commune tout en définissant leurs caractéristiques, leurs actions et leurs interactions particulières.

Au moment de cet audit, il a été décidé de ne pas improviser une refonte partielle. Les anciennes valeurs mécaniques et améliorations ont été retirées de la documentation publique afin de ne pas présenter comme utilisable un système incomplet ou contradictoire. La documentation conserve l'existence des différents milieux et châssis de véhicules, ainsi que leurs prix comme références commerciales provisoires.

## État de l'ancien système

L'ancien système était presque entièrement contenu dans la section « Les Véhicules » du compendium des équipements.

### Modèles proposés

Il distinguait trois tailles de véhicules dans trois milieux :

| Milieu | Léger | Intermédiaire | Lourd |
| --- | --- | --- | --- |
| Terrestre | Motocycle | Automobile | Autocar |
| Aérien | Aéronef léger | Zeppelin | Aéronef lourd, dont la désignation restait à préciser |
| Aquatique | Scooter | Navire | Steamer |

Chaque modèle possédait un prix, une valeur générale d'attributs, une capacité en passagers, un multiplicateur de vitesse et une réserve.

Les véhicules légers avaient tous leurs attributs à `12 + Qualité`, les véhicules intermédiaires à `10 + Qualité` et les véhicules lourds à `8 + Qualité`. Cela rendait mécaniquement les petits véhicules meilleurs dans presque tous les domaines, y compris l'armement, la fiabilité, la solidité et l'autonomie. La taille du châssis influençait donc trop de notions différentes dans un même sens.

### Anciens attributs

Les véhicules possédaient huit attributs :

- **Armement**, pour les tests d'attaque ;
- **Manœuvrabilité**, pour les tests de défense ;
- **Vitesse**, pour les tests tactiques ;
- **Réactivité**, pour les tests d'initiative ;
- **Fiabilité**, pour les sauvegardes et les défenses passives ;
- **Autonomie**, associée au steam ;
- **Solidité**, associée à la structure ;
- **Allure**, associée à la chance.

Cette approche semblait vouloir traiter le véhicule comme un personnage possédant ses propres attributs. Elle ne précisait cependant pas si ces valeurs remplaçaient celles du pilote, s'y ajoutaient ou intervenaient autrement. Elle ne déterminait pas non plus qui, du pilote ou du véhicule, effectuait réellement une attaque, une défense, une tactique ou une sauvegarde.

### Anciennes caractéristiques

Le texte distinguait également les caractéristiques suivantes :

- Capacité en passagers ;
- Vitesse sous la forme d'un multiplicateur de déplacement ;
- Autonomie ou carburant ;
- Réserve ;
- armes équipées ;
- armure ou blindage.

Vitesse et Autonomie existaient donc à la fois comme attributs et comme caractéristiques. La Réserve n'était pas clairement reliée à l'Autonomie et aucune règle n'indiquait comment elle se consommait.

### Anciennes améliorations

Quatre améliorations étaient proposées :

- +2 à un ancien attribut, jusqu'à deux fois par attribut ;
- +4 à un ancien attribut et -2 à tous les autres ;
- davantage de places ;
- davantage de réserve.

Les deux premières ne sont pas compatibles avec la nouvelle échelle des attributs techniques, qui commence à 2 et se limite normalement à 6. Les améliorations de places et de réserve pourront éventuellement inspirer de futures améliorations de châssis, après définition de ces caractéristiques.

## Règles connexes existantes

### Conduite et Pilotage

Les compétences de base distinguent actuellement :

- **Conduite**, pour les engins simples ou légers, les embarcations, les chariots et les deux-roues ;
- **Pilotage**, pour les véhicules motorisés, rapides ou employés dans un environnement dynamique et dangereux.

Cette distinction peut être conservée, mais il faudra préciser quels véhicules et quelles situations relèvent de chacune de ces compétences.

### Action « Mener un véhicule/une monture »

Une action générale permet à un personnage de mener un véhicule ou une monture. Une réussite lui permet de le mener normalement pendant `1 + DR` rounds et un changement abrupt peut réduire cette durée.

Cette action ne définit toutefois pas ce que signifie « mener normalement ». Elle ne précise pas :

- les actions dont dispose le véhicule ;
- les actions que doit dépenser le pilote ;
- les effets d'une perte de contrôle ;
- le fonctionnement du déplacement, des défenses ou des manœuvres ;
- la différence entre un trajet ordinaire et une confrontation.

La caste Pilote évoque par ailleurs le fait de piloter en action simple au lieu d'une action complexe. Cette formulation devra être harmonisée avec l'action générale lorsque le coût normal du pilotage aura été fixé.

### Sciences mécaniques

L'extension de la Science répartit déjà la création, la réparation et la modification des véhicules entre :

- Machinerie terrestre ;
- Machinerie aérienne ;
- Machinerie aquatique.

Cette répartition concerne l'industrie et ne suffit pas à définir les règles d'utilisation. Elle constitue néanmoins une base stable pour déterminer les compétences de fabrication et de réparation.

## Éléments entièrement manquants

L'ancien système ne définissait pas réellement :

- la vitesse actuelle ;
- la vitesse maximale ;
- l'accélération et la décélération ;
- les distances parcourues en confrontation ;
- les virages et manœuvres difficiles ;
- la perte de contrôle ;
- les collisions, écrasements et sorties de route ;
- les chutes d'un véhicule aérien ;
- les dangers propres aux véhicules aquatiques ;
- les dégâts et avaries d'un véhicule ;
- les réparations d'urgence ;
- la manière de cibler ou protéger les passagers ;
- les armes embarquées ;
- le blindage ;
- les postes d'équipage et le nombre d'opérateurs nécessaires ;
- la consommation du carburant ou du steam ;
- les conséquences d'une réserve vide ;
- le rôle de la catégorie, de la qualité et de l'intégrité ;
- les différences mécaniques entre les milieux terrestre, aérien et aquatique.

## Architecture envisagée

### Attributs techniques

La première correspondance envisagée est la suivante :

| Attribut technique | Fonction envisagée |
| --- | --- |
| **Efficacité** | Déterminer la puissance de déplacement ou la Vitesse maximale. |
| **Fiabilité** | Déterminer l'Autonomie, la résistance aux avaries ou une combinaison des deux. Cette fonction reste à trancher. |
| **Maniabilité** | Déterminer la Manœuvrabilité, les changements de direction et les défenses du véhicule. |
| **Rapidité** | Déterminer l'Accélération, la décélération et éventuellement la réactivité du véhicule. |

Il faudra distinguer clairement la **Vitesse maximale**, issue de la conception du véhicule, et la **Vitesse actuelle**, qui évolue pendant son déplacement.

### Caractéristiques de châssis

Les différences fondamentales entre une motocycle, une automobile et un autocar ne devraient pas venir d'une augmentation ou d'une réduction uniforme de tous leurs attributs techniques. Elles devraient être portées par le châssis et ses caractéristiques propres.

Une future fiche de véhicule pourrait notamment posséder :

- un milieu de déplacement ;
- un châssis ou gabarit ;
- une capacité en passagers ;
- une capacité de cargaison ;
- une structure ou intégrité ;
- un blindage ;
- une réserve énergétique ;
- un équipage minimal ;
- des emplacements d'armes ou d'équipements ;
- éventuellement une valeur de vitesse propre au type de châssis.

Un véhicule léger, intermédiaire ou lourd conserverait des attributs techniques de base égaux à 2. Le châssis déterminerait plutôt ce qu'il peut transporter, supporter et équiper, ainsi que les contraintes propres à sa masse.

### Répartition entre pilote et véhicule

La piste privilégiée consiste à traiter le véhicule comme un participant **semi-autonome** :

- le pilote fournit ses attributs, ses compétences et ses actions ;
- le véhicule fournit son mouvement, sa structure et ses caractéristiques techniques ;
- les attributs techniques du véhicule se traduisent en caractéristiques ou modificateurs précis, plutôt que de remplacer tous les attributs du pilote ;
- les armes embarquées conservent leurs propres règles et sont employées par un opérateur, sauf automatisation particulière.

Cette approche évite de créer une seconde fiche de personnage complète pour chaque véhicule tout en permettant les poursuites, combats et manœuvres dangereuses.

## Questions à trancher

### Périmètre du système

Il faudra d'abord choisir le degré de détail voulu :

- véhicule principalement abstrait, utilisé comme moyen de transport avec quelques tests ;
- participant complet aux confrontations ;
- solution intermédiaire, privilégiée lors de l'audit, avec des règles complètes seulement lorsqu'une poursuite, un danger ou un combat le justifie.

### Fiabilité

La traduction de la Fiabilité reste ouverte. Elle pourrait déterminer :

- l'Autonomie ;
- la résistance aux pannes et avaries ;
- une réserve de fonctionnement ;
- plusieurs caractéristiques au moyen de formules différentes.

Il faut éviter de confondre Fiabilité, Solidité, Intégrité et Autonomie. La Fiabilité est un attribut technique abstrait ; les autres devraient être des caractéristiques aux fonctions distinctes.

### Déplacement

Il faudra déterminer :

- l'unité de Vitesse ;
- la conversion en distance par action, passe ou round ;
- la variation de Vitesse produite par l'Accélération ;
- le coût des virages, freinages et changements de milieu ;
- la manière dont les différentes échelles de véhicules coexistent avec les personnages à pied.

### Actions et tests

Il faudra préciser :

- le coût normal pour piloter ;
- la durée pendant laquelle un test de pilotage reste valable ;
- les événements qui imposent un nouveau test ;
- l'attribut et la compétence du pilote employés selon l'action ;
- la manière dont la Maniabilité ou les autres caractéristiques du véhicule modifient le test ;
- les conséquences exactes d'un échec ou d'une maladresse.

### Dégâts et avaries

Il faudra décider si les véhicules utilisent directement les règles générales de dégradation des objets ou une déclinaison adaptée. Une future règle devra distinguer au minimum :

- les dégâts superficiels ;
- les pertes d'intégrité ou de structure ;
- les avaries affectant une fonction précise ;
- l'immobilisation ;
- la destruction ;
- les conséquences pour le pilote, les passagers et la cargaison.

### Milieux et châssis

Les trois milieux doivent partager une base commune, puis recevoir quelques règles spécifiques. Il faudra éviter de créer trois systèmes entièrement séparés.

Les châssis légers, intermédiaires et lourds devront produire des avantages et contraintes différents sans déterminer automatiquement la qualité de tous les systèmes embarqués.

## Ordre de travail conseillé

La refonte devrait être menée dans cet ordre :

1. définir la fiche et le vocabulaire d'un véhicule ;
2. définir les châssis et leurs caractéristiques ;
3. traduire les quatre attributs techniques ;
4. définir Vitesse actuelle, Vitesse maximale, Accélération et déplacement ;
5. reprendre l'action de pilotage et la répartition entre pilote et véhicule ;
6. définir poursuites, manœuvres et perte de contrôle ;
7. définir dégâts, avaries, collisions et passagers ;
8. définir armes, blindages et équipements embarqués ;
9. convertir les modèles terrestres, aériens et aquatiques ;
10. créer les améliorations génériques, spéciales et éventuelles signatures de fabricants ;
11. harmoniser les compétences, actions, castes et règles d'industrie concernées.

Cette note doit servir de base de reprise. Les anciennes valeurs ne doivent pas être restaurées telles quelles : elles constituent des intentions et des exemples, pas un système fonctionnel.
