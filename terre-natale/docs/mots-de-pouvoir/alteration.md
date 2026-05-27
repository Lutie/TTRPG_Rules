# École d'Altération

<div id="mpv-app">

<div class="mpv-filters">
  <input type="text" id="mpv-search" placeholder="Rechercher (nom, latin, arcanique, description…)" />
  <select id="mpv-type">
    <option value="">Tous les types</option>
    <option value="Pouvoir">Pouvoir</option>
  </select>
  <select id="mpv-target">
    <option value="">Toutes les cibles</option>
    <option value="Cible">Cible</option>
<option value="Lieu">Lieu</option>
  </select>
  <span id="mpv-count"></span>
</div>

<table id="mpv-table">
  <thead>
    <tr>
      <th class="col-num">#</th>
      <th class="col-vulgar" data-col="vulgar">Vulgaire ↕</th>
      <th class="col-latin">Latin / Arcanique</th>
      <th class="col-type" data-col="word_type">Type ↕</th>
      <th class="col-target" data-col="target_type">Cible ↕</th>
      <th class="col-diff" data-col="difficulty">Diff. ↕</th>
      <th class="col-drain" data-col="drain">Drain ↕</th>
      <th class="col-keys">Clés</th>
      <th class="col-desc">Description</th>
    </tr>
  </thead>
  <tbody id="mpv-tbody"></tbody>
</table>

</div>

<style>
#mpv-app {
  font-size: 0.85em;
}
.mpv-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5em;
  margin-bottom: 1em;
  align-items: center;
}
.mpv-filters input[type=text] {
  flex: 1;
  min-width: 260px;
  padding: 0.35em 0.6em;
  border: 1px solid #aaa;
  border-radius: 4px;
  font-size: 0.9em;
  background: var(--md-default-bg-color, #fff);
  color: var(--md-default-fg-color, #000);
}
.mpv-filters select {
  padding: 0.35em 0.6em;
  border: 1px solid #aaa;
  border-radius: 4px;
  font-size: 0.9em;
  background: var(--md-default-bg-color, #fff);
  color: var(--md-default-fg-color, #000);
}
#mpv-count {
  margin-left: auto;
  color: #888;
  font-size: 0.85em;
  white-space: nowrap;
}
#mpv-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}
#mpv-table th, #mpv-table td {
  padding: 0.35em 0.5em;
  border: 1px solid var(--md-default-fg-color--lightest, #e0e0e0);
  vertical-align: top;
  word-break: break-word;
}
#mpv-table th {
  background: var(--md-primary-fg-color, #3f51b5);
  color: var(--md-primary-bg-color, #fff);
  cursor: pointer;
  user-select: none;
}
#mpv-table th:hover { opacity: 0.85; }
.col-num    { width: 2%; text-align: center; }
.col-vulgar { width: 9%; }
.col-latin  { width: 10%; }
.col-type   { width: 7%; }
.col-target { width: 7%; }
.col-diff   { width: 3%; text-align: center; }
.col-drain  { width: 3%; text-align: center; }
.col-keys   { width: 16%; }
.col-desc   { width: 43%; }
#mpv-table tbody tr:nth-child(even) {
  background: var(--md-default-bg-color--light, #f9f9f9);
}
#mpv-table tbody tr:hover {
  background: var(--md-accent-fg-color--transparent, #e8eaf6);
}
.mpv-bracket {
  color: #ff1493;
  font-weight: bold;
}
</style>

<script>
(function() {
  const DATA = [
  {
    "num": 1,
    "vulgar": "Sublimification",
    "latin": "Sublimis (Élevé)",
    "arcane": "Alsublim (Al + sublim)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🪨 Terre: Alsublimum, 💧 Eau: Alsublimyn, 🌪️ Air: Alsublimel",
    "description": "Produit un effet qui change l'état (gaz, liquide ou solide) de [Magnitude x 2] unités d'un élément qui dépends de la [clé]."
  },
  {
    "num": 2,
    "vulgar": "Fructification",
    "latin": "Fructus (Fruit)",
    "arcane": "Arfruct (Ar + fruct)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🌿 Flore: Arfructiln",
    "description": "L'effet du sort provoque la pousse de fruits comestible pour [Magnitude/10] personnes, si le sort est lancé sur un arbre la pousse est de [Magnitude/5] à la place."
  },
  {
    "num": 3,
    "vulgar": "Arborisation",
    "latin": "Arbor (Arbre)",
    "arcane": "Asarbor (As + arbor)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🌿 Flore: Asarboriln",
    "description": "L'effet du sort provoque la pousse de [Magnitude/5] arbres, divisé par 3 pour des arbustes, divisé par 10 pour des gros arbres."
  },
  {
    "num": 4,
    "vulgar": "Fendaison",
    "latin": "Findo (Fendre)",
    "arcane": "Aenfind (Aen + find)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🪨 Terre: Aenfindum",
    "description": "L'effet du sort génère une crevasse sur un sol de terre ou de pierre, la largeur x longueur x profondeur doit être inférieure à [Magnitude], aucun de ces paramètres ne peux pas dépasser [Magnitude/4], si une créature se trouve là où la crevasse a lieu elle peux réaliser un test de réflexe, en cas de réussite critique elle échappe à la chute en se déplaçant vers le bord de son choix, en cas de réussite elle glisse sur le bord de la crevasse à mi hauteur, en cas d'échec elle se retrouve au fond de la crevasse, en cas d'échec critique elle se retrouve au fond de la crevasse et subit les dégats de chute (elle a le droit à son test d'acrobatie pour réduire les dégats de celle ci), une cible dans la crevasse doit réussir un test d'acrobatie (si parois étroites) ou escalade pour remonter (difficulté basé sur la difficulté des effets du sort, voir règle idoines), cet effet fonctionne sur les autres sols mais avec une magnitude divisée par 2."
  },
  {
    "num": 5,
    "vulgar": "Transmutation",
    "latin": "Muto (Changer)",
    "arcane": "Almutat (Al + mutat)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚔️ Acier: Almutatan (Métaux), 🐗 Faune: Almutatorh (Cuir), 🌿 Flore: Almutatiln (Bois), 🌿 Flore: Almutatiln (Tissu)",
    "description": "L'effet du sort convertis jusqu'à [Magnitude/10] unités (définit par l'encombrement si on parle d'équipement) d'un type qui dépends de la [clé] vers une autre du même type (example : acier vers bronze), le niveau de qualité du minerai doit être le même ou inférieur, le résultat sera forcément du niveau de la matière initiale, si le prix des deux produits diffèrent alors il est obligatoire de compenser via la quantité (en somme le sort ne peux produire de la richesse)."
  },
  {
    "num": 6,
    "vulgar": "Reforgation",
    "latin": "Fero (Porter/Façonner)",
    "arcane": "Arfero (Ar + fero)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚔️ Acier: Arfero an (Métaux), 🌿 Flore: Arferoiln (Bois)",
    "description": "L'effet du sort change le type d'une arme jusqu'à [Magnitude/10] unités (définit par l'encombrement de l'équipement) pour un autre type (épée, hache, lance...), l'objet conserve donc sa qualité, ses améliorations etc."
  },
  {
    "num": 7,
    "vulgar": "Conditionnement",
    "latin": "Condicio (Condition)",
    "arcane": "Ascondi (As + condi)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "Voir liste des conditions",
    "description": "Génère un effet qui force un changement de condition à la cible pour lui appliquer une condition positive (qui correspond à l'une des conditions associable à la [clé]) avec une charge de [Magnitude]."
  },
  {
    "num": 8,
    "vulgar": "Affliction",
    "latin": "Fligo (Frapper)",
    "arcane": "Aenfligo (Aen + fligo)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "Voir liste des conditions",
    "description": "Génère un effet qui force un changement de condition à la cible pour lui appliquer une condition négative (qui correspond à l'une des conditions associable à la [clé]) avec une charge de [Magnitude], la cible peux réaliser un test de sauvegarde contre la condition en question (ou opposition si supérieure)."
  },
  {
    "num": 9,
    "vulgar": "Intoxication",
    "latin": "Toxum (Poison, grec)",
    "arcane": "Altox (Al + tox)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "☢️ Toxique: Altoxex",
    "description": "Génère un effet qui force un changement de condition à la cible pour lui appliquer une condition négative, nécessairement temporaire (une décharge par jour) de type venin avec une charge de [Magnitude], la cible peux réaliser un test de sauvegarde contre la condition en question (ou opposition si supérieure)."
  },
  {
    "num": 10,
    "vulgar": "Infection",
    "latin": "Inficio (Souiller)",
    "arcane": "Arinfic (Ar + infic)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "☠️ Mort: Arinficus",
    "description": "Génère un effet qui force un changement de condition à la cible pour lui appliquer une condition négative, nécessairement temporaire (une décharge par jour) de type maladie grave avec une charge de [Magnitude], la cible peux réaliser un test de sauvegarde contre la condition en question (ou opposition si supérieure)."
  },
  {
    "num": 11,
    "vulgar": "Conversion",
    "latin": "Verto (Tourner)",
    "arcane": "Asvert (As + vert)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚖️ Loi: Asvertem",
    "description": "Génère un effet qui convertis un maximum de [Magnitude/2] charge d'une condition négative au choix en charge de la condition positive opposée avec le double des charges ainsi converties, variante : Ce mot peux affecter toutes les conditions de la cible avec une difficulté augmentée de 4."
  },
  {
    "num": 12,
    "vulgar": "Corruption",
    "latin": "Rumpo (Briser)",
    "arcane": "Aenrump (Aen + rump)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🌀 Chaos: Aenrumpix",
    "description": "Génère un effet qui convertis un maximum de [Magnitude/2] charge d'une condition positive au choix en charge de la condition négative opposée avec le double des charges ainsi converties, la cible peux réaliser un test de sauvegarde appropriée pour ce type de condition (ou opposition si supérieure), variante : Ce mot peux affecter toutes les conditions de la cible avec une difficulté augmentée de 4."
  },
  {
    "num": 13,
    "vulgar": "Ponction",
    "latin": "Pungo (Piquer)",
    "arcane": "Alpung (Al + pung)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "❤️ Vie: Alpungir & ☠️ Mort: Alpungus (PV), 🧩 Mental: Alpungend (PS), ⚖️ Loi: Alpungem & 🌀 Chaos: Alpungix (PK), ⚕️ Corps: Alpungen (PC), 🧠 Esprit: Alpungys (PC), 🔮 Magie: Alpungirn (PM), 🪷 Nature: Alpungeiln (PE/fatigue)",
    "description": "Génère un effet qui transfert un maximum de [Magnitude/3] (ou [Magnitude/2] pour l'endurance) d'une ressource donnée (selon [clé]) d'une cible à une autre au contact (si le sort à une portée alors les deux cibles peuvent être distante de cette même portée), si la cible à laquelle la ressource est prélevée le souhaite elle peux réaliser un test de sauvegarde (vs détermination) afin de réduire les effets du sort, ceci n'est pas considéré comme des dégats ou des soins (d'ailleurs l'effet ne génère pas de fatigue, inutile de préciser utiliser ce sort sur une cible non consentante se voit/sait et que c'est un délit (voir crime)), une même cible ne peux recevoir qu'une fois des ressources de cette manière (une fois par types), en zone il n'y a pas de démultiplications des ressources."
  },
  {
    "num": 14,
    "vulgar": "Réparation",
    "latin": "Paro (Préparer)",
    "arcane": "Arparo (Ar + paro)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚔️ Acier: Arparoan (Métaux), 🐗 Faune: Arparorh (Cuir), 🌿 Flore: Arparoiln (Bois), 🌿 Flore: Arparoiln (Tissu), 🪨 Terre: Arparoum (Minéraux), ✡️ Arcane: Arparoys (Tout)",
    "description": "L'effet du sort répare un objet ou structure (dont la nature coRespond à la [clé]) d'un total de dégradation de [Magnitude], l'objet peux de cette manière voir son niveau de dégradation être réduit, la clé Arcane permet de réparer sans distinction de la nature de l'objet ou de la structure mais la magnitude est divisée par 2."
  },
  {
    "num": 15,
    "vulgar": "Floraison",
    "latin": "Flos (Fleur)",
    "arcane": "Asflos (As + flos)",
    "word_type": "Pouvoir",
    "target_type": "Lieu",
    "difficulty": "2",
    "drain": "2",
    "keys": "🌿 Flore: Asflosiln",
    "description": "Génère un effet fait pousser des plantes de façon permanente sur le lieu ciblé, le type de fleurs/plantes est choisit au lancement du sort (haLucinogènes, spores, etc) et se déplacer dans ces lieux impose un test de sauvegarde qui dépends de la condition (une parmis les suivantes: nauséeux, déboussolé, sourd, toxique, acide, cécité, aphone, confusion) qui est infligé avec [Magnitude/2] charges."
  },
  {
    "num": 16,
    "vulgar": "Racination",
    "latin": "Radix (Racine)",
    "arcane": "Aenradi (Aen + radi)",
    "word_type": "Pouvoir",
    "target_type": "Lieu",
    "difficulty": "2",
    "drain": "2",
    "keys": "🌿 Flore: Aenradiiln",
    "description": "Génère un effet fait pousser des racines de façon permanente sur le lieu ciblé, à moins de réussir un test de réflexes la zone couverte deviens un terrain difficile (avec ce que cela implique)."
  },
  {
    "num": 17,
    "vulgar": "Transfusion",
    "latin": "Fundo (Verser)",
    "arcane": "Alfundo (Al + fundo)",
    "word_type": "Pouvoir",
    "target_type": "Lieu",
    "difficulty": "2",
    "drain": "2",
    "keys": "Spécial: Alfundo (Pas de suffixe élémentaire, domaine spécial)",
    "description": "Génère un effet qui convertie, chez la cible, une première ressource (selon une première clé) en une seconde ressource (selon une seconde clé) à hauteur d'un maximum de [Magnitude] (ne génère pas de fatigue), si la cible n'est pas consentente elle peux réaliser un test de sauvegarde (détermination) pour réduire les effets, aussi il n'est pas possible de convertir des ressources en une ressource qui est déjà au maximum."
  },
  {
    "num": 18,
    "vulgar": "Rééquilibration",
    "latin": "Aequus (Égal)",
    "arcane": "Araequus (Ar + aequus)",
    "word_type": "Pouvoir",
    "target_type": "Lieu",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚖️ Loi: Araequusem",
    "description": "Rééquilibre les ressources de la cible: Toutes les ressources sont ajoutés avec un ajustement positif ou négatif (au choix au lancement du sort) de [Magnitude/2] puis redivisées équitablement, si la cible n'est pas consentente elle peux réaliser un test de sauvegarde (détermination) pour se soustraire à cet effet (sur une réussite), le sort ne peux être lancé qu'à un niveau de 3 au minimum."
  },
  {
    "num": 19,
    "vulgar": "Déséquilibration",
    "latin": "Libra (Balance)",
    "arcane": "Aslibra (As + libra)",
    "word_type": "Pouvoir",
    "target_type": "Lieu",
    "difficulty": "2",
    "drain": "2",
    "keys": "🌀 Chaos: Aslibraix",
    "description": "Déséquilibre les ressources de la cible: Toutes les ressources sont ajoutés avec un ajustement positif ou négatif (au choix au lancement du sort) de [Magnitude/2] puis redivisées inéquitablement (une même ressource ne peux descendre en deça de sa valeurs initiale moins sa moitié ou de sa valeurs initiale plus sa moitié), si la cible n'est pas consentente elle peux réaliser un test de sauvegarde (détermination) pour se soustraire à cet effet (sur une réussite), le sort ne peux être lancé qu'à un niveau de 3 au minimum."
  },
  {
    "num": 20,
    "vulgar": "Canalisation",
    "latin": "Canalis (Conduit)",
    "arcane": "Aencanali (Aen + canali)",
    "word_type": "Pouvoir",
    "target_type": "Lieu",
    "difficulty": "2",
    "drain": "2",
    "keys": "☢️ Toxique: Aencanaliex",
    "description": "Génère un effet qui redirige jusqu'à un maximum total de [Magnitude x 3] charges de n'importe quelles conditions négatives en charges d'une même condition négative (que la cible a déjà, ou n'importe quelle condition du domaine Toxique), la cible ne peux pas réaliser de test de sauvegarde contre cet effet."
  },
  {
    "num": 21,
    "vulgar": "Altération",
    "latin": "Alter (Autre)",
    "arcane": "Alalter (Al + alter)",
    "word_type": "Pouvoir",
    "target_type": "Lieu",
    "difficulty": "2",
    "drain": "2",
    "keys": "🌀 Chaos: Alalterix",
    "description": "Génère un effet qui inflige deux conditions négatives aléatoire avec [Magnitude] charges, la condition est choisit aléatoire à chaque occurence parmi la totalité des conditions de ce type possibles, le lanceur de sort peux relancer une des conditions à condition de baisser la Magnitude du sort de 5 à chaque fois."
  },
  {
    "num": 22,
    "vulgar": "Bénédiction",
    "latin": "Benedico (Dire du bien)",
    "arcane": "Arbene (Ar + bene)",
    "word_type": "Pouvoir",
    "target_type": "Lieu",
    "difficulty": "2",
    "drain": "2",
    "keys": "🌀 Chaos: Arbeneix",
    "description": "Génère un effet qui inflige deux conditions positif aléatoire avec [Magnitude] charges, la condition est choisit aléatoire à chaque occurence parmi la totalité des conditions de ce type possibles, le lanceur de sort peux relancer une des conditions à condition de baisser la Magnitude du sort de 5 à chaque fois."
  },
  {
    "num": 23,
    "vulgar": "Décharge",
    "latin": "Cargo (Charge)",
    "arcane": "Ascargo (As + cargo)",
    "word_type": "Pouvoir",
    "target_type": "Lieu",
    "difficulty": "2",
    "drain": "2",
    "keys": "☢️ Toxique: Ascargoex",
    "description": "Génère un effet qui décharge jusqu'à un maximum de [Magnitude/5] conditions de rupture sur la cible, cependant les effets de chaque décharge s'appliquent avec des montants doublés, la même condition peux être déchargée plusieurs fois de cette manière."
  },
  {
    "num": 24,
    "vulgar": "Animisation",
    "latin": "Anima (Âme)",
    "arcane": "Aenanima (Aen + anima)",
    "word_type": "Pouvoir",
    "target_type": "Lieu",
    "difficulty": "2",
    "drain": "2",
    "keys": "🌿 Flore: Aenanimailn",
    "description": "La plante ciblé deviens une créature autonome, elle présente les caractéristiques d'une plante \"invoquée\" de nature similaire (trent à défaut) (voir invocation de plante), elle ne peux se déplacer pour autant et sa durée de vie est réduite à [Magnitude] heures."
  },
  {
    "num": 25,
    "vulgar": "Déconstruction",
    "latin": "Struo (Construire)",
    "arcane": "Alstruo (Al + struo)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚔️ Acier: Alstruoan (Métaux), 🐗 Faune: Alstruoorh (Cuir), 🌿 Flore: Alstruoiln (Bois), 🌿 Flore: Alstruoiln (Tissu)",
    "description": "L'effet du sort recycle jusqu'à [Magnitude/10] unités (définit par l'encombrement si on parle d'équipement) d'un type qui dépends de la [clé] vers de la matière première exploitable ou qui peux être revendue, il n'y a pas de pertes dans le processus et le sort ne fonctionne donc que si la cible correspond aux limites imposées."
  },
  {
    "num": 26,
    "vulgar": "Construction",
    "latin": "Aedifico (Édifier)",
    "arcane": "Aredifi (Ar + edifi)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚔️ Acier: Aredifian (Métaux), 🐗 Faune: Aredifiorh (Cuir), 🌿 Flore: Aredifiiln (Bois), 🌿 Flore: Aredifiiln (Tissu), 🪨 Terre: Aredifium (Minéraux), ✡️ Arcane: Aredifiys (Tout)",
    "description": "L'effet du sort créer un objet avec un potenciel de [Magnitude] un type qui dépends de la [clé], le potenciel peux être utilisé pour augmenter la catégorie (5 par catégorie), la qualité (2 par qualité), les améliorations (2 par améliorations), qualité et améliorations étant limités à [Magnitude/7], au bout de 24h l'objet se désintègre, l'objet n'a pas de valeurs marchande."
  },
  {
    "num": 27,
    "vulgar": "Assemblage",
    "latin": "Faber (Forger / Artisan)",
    "arcane": "Asfaber (As + faber)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "4",
    "drain": "6",
    "keys": "⚔️ Acier: Asfaberan (Métaux), 🐗 Faune: Asfaberorh (Cuir), 🌿 Flore: Asfaberiln (Bois), 🌿 Flore: Asfaberiln (Tissu), 🪨 Terre: Asfaberum (Minéraux), ✡️ Arcane: Asfaberys (Tout)",
    "description": "L'effet du sort créer un objet avec un potenciel de [Magnitude] un type qui dépends de la [clé], le potenciel peux être utilisé pour augmenter la catégorie (5 par catégorie), la qualité (2 pour qualité 1, puis 4 pour passer à qualité 2, puis 6... etc), les améliorations (comme pour les qualités), qualité et améliorations étant limités à [Magnitude/7], ce sort requière 100% des matières premières et n'a pas de durée, le domaine des arcanes s'applique à toutes les matières mais le jet est très très limité (maximum des dés -3, soit 3 par défaut)."
  },
  {
    "num": 28,
    "vulgar": "Optimisation",
    "latin": "Melior (Mieux / Améliorer)",
    "arcane": "Aenmelior (Aen + melior)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "4",
    "drain": "2",
    "keys": "⚔️ Acier: Aenmelioran (Métaux), 🐗 Faune: Aenmeliororh (Cuir), 🌿 Flore: Aenmelioriln (Bois), 🌿 Flore: Aenmelioriln (Tissu), 🪨 Terre: Aenmeliorum (Minéraux), ✡️ Arcane: Aenmelior ys (Tout)",
    "description": "L'effet du sort améliore la qualité d'un objet avec un potenciel de [Magnitude] un type qui dépends de la [clé], le potenciel peux être utilisé pour augmenter la qualité (2 pour qualité 1, puis 4 pour passer à qualité 2, puis 6... etc), la qualité étant limités à [Magnitude/7], ce sort requière 100% des matières premières (dont on peux soustraire les matières déjà présente dans l'objet) et n'a pas de durée."
  },
  {
    "num": 29,
    "vulgar": "Création",
    "latin": "Creo (Créer)",
    "arcane": "Alcreo (Al + creo)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "6",
    "drain": "12",
    "keys": "⚔️ Acier: Alcreoan (Métaux), 🐗 Faune: Alcreoorh (Cuir), 🌿 Flore: Alcreoiln (Bois), 🌿 Flore: Alcreoiln (Tissu), 🪨 Terre: Alcreoum (Minéraux), ✡️ Arcane: Alcreoys (Tout)",
    "description": "L'effet du sort créer un objet avec un potenciel de [Magnitude] un type qui dépends de la [clé], le potenciel peux être utilisé pour augmenter la catégorie (5 par catégorie), la qualité (5 par qualité), les améliorations (5 par améliorations), qualité et améliorations étant limités à [Magnitude/10], ce sort n'a pas de durée."
  },
  {
    "num": 30,
    "vulgar": "Solidification",
    "latin": "Solidus (Solide)",
    "arcane": "Arsoli (Ar + soli)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚔️ Acier: Arsolian (Métaux), 🐗 Faune: Arsoliorh (Cuir), 🌿 Flore: Arsoliiln (Bois), 🌿 Flore: Arsoliiln (Tissu), 🪨 Terre: Arsolium (Minéraux), ✡️ Arcane: Arsoliys (Tout)",
    "description": "Génère de la résistance temporaire afin de renforcer un objet (dont la nature dépends de la [clé]), qui perdra jusqu'à un maximum de [Magnitude] avant de réellement subir de la détérioration, cet effet, qui n'est pas un enchantement, prend fin à la fin de la scène."
  },
  {
    "num": 31,
    "vulgar": "Falsification",
    "latin": "Fallo (Tromper)",
    "arcane": "Asfall (As + fall)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "📚 Savoir: Asfallaum",
    "description": "Dénature l'indice, la piste ou autre information ciblé, lui donnant une toute autre substance (au choix au lancement du sort, mais de même nature/compléxité), une test d'intuition peux permettre de se rendre compte que quelque chose cloche avec l'information et un test de compétence approprié peux permettre de retrouver une version très simplifiée de l'information (ou la totalité sur une réussite critique)."
  },
  {
    "num": 32,
    "vulgar": "Fabrication",
    "latin": "Facere (Faire)",
    "arcane": "Aenfac (Aen + fac)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "📚 Savoir: Aenfacaum",
    "description": "Génère un (faux) indice, une piste ou autre forme d'information, lui donnant une substance cohérent et crédible (au choix au lancement du sort), une test d'intuition peux permettre de se rendre compte que quelque chose cloche avec l'information et un test de compétence approprié peux permettre de comprendre qu'il s'agit d'une fausse information (voir de comprendre la nature de la vérité que cette fausse information cherche à cacher)."
  },
  {
    "num": 33,
    "vulgar": "Miroitement",
    "latin": "Speculum (Miroir)",
    "arcane": "Alspecul (Al + specul)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "👁️ Vision: Alspeculeth",
    "description": "Altère une surface transparente, mat ou sans teint afin de lui faire prendre une des 2 autres formes, au choix, un individu peux réaliser un test d'intuition pour voir si il perçoit que quelque chose cloche avec la surface puis un test d'acuité pour se rendre compte de la supercherie (ou non)."
  },
  {
    "num": 34,
    "vulgar": "Sublimation",
    "latin": "Sublimo (Élever)",
    "arcane": "Arsubli (Ar + subli)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "0",
    "keys": "✨ Sacre: Arsubliiel",
    "description": "Génère un effet qui fait passer les conditions positives \"normales\" de la cible en version \"améliorées\", ne peux convertir ainsi qu'un maximum de [Magnitude x2] charges."
  },
  {
    "num": 35,
    "vulgar": "Envenimation",
    "latin": "Veneno (Poison)",
    "arcane": "Asvenen (As + venen)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "0",
    "keys": "🩸 Impie: Asvenenun",
    "description": "Génère un effet qui fait passer les conditions négatives \"normales\" de la cible en version \"améliorées\", ne peux convertir ainsi qu'un maximum de [Magnitude x2] charges."
  },
  {
    "num": 36,
    "vulgar": "Renforcement",
    "latin": "Roboro (Fortifier)",
    "arcane": "Aenrobor (Aen + robor)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚔️ Acier: Aenroboran",
    "description": "Génère un enchantement positive qui augmente les dégats de l'arme (actions d'attaque) enchantée de [Magnitude/6]."
  },
  {
    "num": 37,
    "vulgar": "Impactation",
    "latin": "Impingo (Frapper)",
    "arcane": "Alimpac (Al + impac)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚔️ Acier: Alimpacan",
    "description": "Génère un enchantement positive qui augmente l'impact de l'arme (actions tactique) enchantée de [Magnitude/6]."
  },
  {
    "num": 38,
    "vulgar": "Déviation",
    "latin": "Devius (Détourné)",
    "arcane": "Ardevi (Ar + devi)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚔️ Acier: Ardevian",
    "description": "Génère un enchantement positive qui augmente la déviation de l'arme (actions de défense) enchantée de [Magnitude/6]."
  },
  {
    "num": 39,
    "vulgar": "Cristallisation",
    "latin": "Durus (Dur / Solide)",
    "arcane": "Asduran (As + duran)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚔️ Acier: Asduran",
    "description": "Génère un enchantement positive qui augmente la résistance de l'armure enchantée de [Magnitude/6]."
  },
  {
    "num": 40,
    "vulgar": "Amélioration",
    "latin": "Potius (Mieux)",
    "arcane": "Aenpoti (Aen + poti)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚔️ Acier: Aenpotian",
    "description": "Génère un enchantement positive qui augmente une caractéristique de l'arme (perforation, attrition, pénétration, malice) enchantée de [Magnitude/4]."
  },
  {
    "num": 41,
    "vulgar": "Evolution",
    "latin": "Volvo (Rouler)",
    "arcane": "Alvolv (Al + volv)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🐗 Faune: Alvolvorh",
    "description": "Génère un effet qui change la cible non humanoïde en sa version \"primale\", soit [Magnitude/10] à tous ses attributs (sans distinctions, attributs secondaires inclus), cet effet peux être relancé mais seul le meilleur bonus est conservé, une version primale ne peux plus être controlée et redevient sauvage à jamais."
  },
  {
    "num": 42,
    "vulgar": "Hématisation",
    "latin": "Haema (Sang, grec)",
    "arcane": "Arhaema (Ar + haema)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🩸 Impie: Arhaemaun",
    "description": "Génère un enchantement positive qui augmente les dégats de l'arme (actions d'attaque) enchantée de [Magnitude/4] SI l'arme est préalablement souillée du sang de la victime, une attaque qui touche la cible pour la première fois et qui n'a pas été enduite de son sang ne profite donc pas de l'effet."
  },
  {
    "num": 43,
    "vulgar": "Pétrification",
    "latin": "Petra (Roche)",
    "arcane": "Aspetra (As + petra)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "6",
    "drain": "6",
    "keys": "🪨 Terre: Aspetraum",
    "description": "Génère un enchantement négatif qui change la chaire de la cible en pierre à mesure que le temps passe, l'enchantement reçoit [Magnitude] marqueurs à la fin de chaque tour de la cible, la cible doit alors réaliser un test de robustesse avec une pénalité équivalante à Marqueurs/10, en cas de réussite critique le sort cesse, en cas de réussite normale il peux agir normalement, en cas d'échec il perd une ACTS, en cas d'échec critique il est totalement pétrifié/mort. Ce sort n'affecte que les cibles de rang inférieur à celui du lanceur de sort. Si cet enchantement prend fin avant la pétrification totale de la cible alors la chaire de ce dernier reprend consistance normale, sinon non."
  },
  {
    "num": 44,
    "vulgar": "Dermisation",
    "latin": "Cutis (Peau)",
    "arcane": "Arcutis (Ar + cutis)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🪨 Terre",
    "description": "Génère un enchantement positif qui augmente l'armure naturelle de la cible de [Magnitude/10]."
  },
  {
    "num": 45,
    "vulgar": "Flagellation",
    "latin": "Flagellum (Fouet / Cinglant)",
    "arcane": "Aenflagel",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🌿 Flore",
    "description": "Enchantement neutre qui forme des lianes cinglantes sur place, ces dernières ont une portée de 2 et réalise des attaques d'opportunité sur quiquonque passe dans sa zone, sans distinctions pour la cible sauf le lanceur du sort lui même. Les lianes ont jusqu'à [Magnitude/10] actions rapides à dépenser de la sorte par round. Ces lianes sont une seule entité ayant des attributs physiques de [10+Magnitude/2] sans niveau de compétence notable. Si les lianes sont vaincues l'enchantement prend fin. Les dégats causées par ces lianes sont d'élément flore. Ce ne sont pas des invocations mais une altération de la matière en une forme de vie alternative."
  },
  {
    "num": 46,
    "vulgar": "Viticination",
    "latin": "Vitis (Liane / Vigne)",
    "arcane": "Aenvit",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🌿 Flore",
    "description": "Enchantement neutre qui forme des lianes cinglantes sur place, ces dernières ont une portée de 2 et réalise des tactiques d'opportunité sur quiquonque passe dans sa zone, sans distinctions pour la cible sauf le lanceur du sort lui même. Les lianes ont jusqu'à [Magnitude/10] actions rapides à dépenser de la sorte par round. Ces lianes sont une seule entité ayant des attributs physiques de [10+Magnitude/2] sans niveau de compétence notable. Si les lianes sont vaincues l'enchantement prend fin. Ce ne sont pas des invocations mais une altération de la matière en une forme de vie alternative."
  },
  {
    "num": 47,
    "vulgar": "Fungination",
    "latin": "Fungus (Champignon)",
    "arcane": "Asfung (As + fung)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🌿 Flore",
    "description": "Enchantement neutre qui forme un gros champignon explosif sur place, le lanceur de sort répartis [Magnitude] entre explosivité et propagation, mais la propagation ne peux pas être supérieure à l'explosivité. Le champignon s'active si un individue le dérange dans une portée de 2 cases et réalise une explosion qui affecte toutes les cibles dans une zone de rayon [Propagation/2], sans distinctions pour la cible, infligeant [Explositivté] dégats physiques d'élément flore. Le champignon explose si il est attaqué à distance mais dans ce cas le rayon d'action est triplée dans la direction d'où viens l'attaque. Evidemment le fait que gros champignon soit exploif n'est écrit dessus et un test approprié peux permettre de le voir. Ceci n'est pas une invocation mais une altération de la matière en une forme de vie disons alternative."
  },
  {
    "num": 48,
    "vulgar": "Sporulation",
    "latin": "Sporum (Spore)",
    "arcane": "Aensorp (Aen + spor)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🌿 Flore",
    "description": "Enchantement neutre qui forme un gros champignon explosif sur place, le lanceur de sort répartis [Magnitude] entre explosivité et propagation, mais la propagation ne peux pas être supérieure à l'explosivité, de plus il doit choisir une condition issus du domaine de la flore. Le champignon s'active si un individue le dérange dans une portée de 2 cases et réalise une explosion qui affecte toutes les cibles dans une zone de rayon [Propagation/2], sans distinctions pour la cible, infligeant la condition avec [Explosivité] charges. Le champignon explose si il est attaqué à distance mais dans ce cas le rayon d'action est triplée dans la direction d'où viens l'attaque. Evidemment le fait qu'un gros champignon soit exploif n'est écrit dessus et un test approprié peux permettre de le voir. Ceci n'est pas une invocation mais une altération de la matière en une forme de vie disons alternative."
  },
  {
    "num": 49,
    "vulgar": "Revitalisation",
    "latin": "Vita (Vie)",
    "arcane": "Arvita (Ar + vita)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🌿 Flore: Arvitailn",
    "description": "L'effet du sort provoque la pousse de [Magnitude/5] petit(s) fruit, si le sort est lancé sur un arbre la pousse est de [Magnitude/3] à la place, ces fruits ne rassasis pas mais restaure 1D6 PE sur-le-champs lorsque consommés, plusieurs fruits peuvent être consommés à la fois évidemment, ces fruits ne font plus effet au bout d'un cycle entier (soit 24h)."
  }
];

  const tbody   = document.getElementById('mpv-tbody');
  const search  = document.getElementById('mpv-search');
  const selType = document.getElementById('mpv-type');
  const selTgt  = document.getElementById('mpv-target');
  const counter = document.getElementById('mpv-count');

  let sortCol = null;
  let sortAsc = true;

  function fmtDesc(text) {
    if (!text) return '';
    return text.replace(/\[([^\]]+)\]/g, '<span class="mpv-bracket">[$1]</span>');
  }

  function render(list) {
    tbody.innerHTML = '';
    list.forEach(w => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="text-align:center">${w.num}</td>
        <td><strong>${w.vulgar}</strong></td>
        <td><em style="font-size:0.88em">${w.latin}</em><br/><small style="color:#888">${w.arcane}</small></td>
        <td>${w.word_type}</td>
        <td>${w.target_type}</td>
        <td style="text-align:center">${w.difficulty}</td>
        <td style="text-align:center">${w.drain}</td>
        <td style="font-size:0.82em">${w.keys}</td>
        <td>${fmtDesc(w.description)}</td>
      `;
      tbody.appendChild(tr);
    });
    counter.textContent = list.length + ' mot' + (list.length !== 1 ? 's' : '');
  }

  function filter() {
    const q = search.value.toLowerCase();
    const t = selType.value;
    const tgt = selTgt.value;

    let list = DATA.filter(w => {
      if (t && w.word_type !== t) return false;
      if (tgt && w.target_type !== tgt) return false;
      if (q && ![w.vulgar, w.latin, w.arcane, w.description, w.keys]
               .some(s => (s || '').toLowerCase().includes(q))) return false;
      return true;
    });

    if (sortCol) {
      list = list.slice().sort((a, b) => {
        const va = String(a[sortCol] || '').toLowerCase();
        const vb = String(b[sortCol] || '').toLowerCase();
        return sortAsc ? va.localeCompare(vb) : vb.localeCompare(va);
      });
    }

    render(list);
  }

  search.addEventListener('input', filter);
  selType.addEventListener('change', filter);
  selTgt.addEventListener('change', filter);

  document.querySelectorAll('#mpv-table th[data-col]').forEach(th => {
    th.addEventListener('click', () => {
      if (sortCol === th.dataset.col) sortAsc = !sortAsc;
      else { sortCol = th.dataset.col; sortAsc = true; }
      filter();
    });
  });

  filter();
})();
</script>
