# École de Conjuration

<div id="mpv-app">

<div class="mpv-filters">
  <input type="text" id="mpv-search" placeholder="Rechercher (nom, latin, arcanique, description…)" />
  <select id="mpv-type">
    <option value="">Tous les types</option>
    <option value="Miracle">Miracle</option>
<option value="Pouvoir">Pouvoir</option>
  </select>
  <select id="mpv-target">
    <option value="">Toutes les cibles</option>
    <option value="Cible">Cible</option>
<option value="Lieu">Lieu</option>
<option value="TO Finish ?">TO Finish ?</option>
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
    "vulgar": "Vol",
    "latin": "Volatus (Vol)",
    "arcane": "Convol (Con + vol)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🌪️ Air: Convolel",
    "description": "Génère un enchantement qui permet à la cible de voler, elle le fait avec une allure de [Magnitude/4] ou améliorée de [Magnitude/5]."
  },
  {
    "num": 2,
    "vulgar": "Planement",
    "latin": "Plaudo (Applaudir, battre des ailes)",
    "arcane": "Cemplaud (Cen + plaud)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🌪️ Air: Cemplaudel",
    "description": "Génère un enchantement qui permet à la cible de planer, elle le fait avec une allure de [Magnitude/3] ou améliorée de [Magnitude/5]."
  },
  {
    "num": 3,
    "vulgar": "Marcheflots",
    "latin": "Aqua (Eau)",
    "arcane": "Colaqua (Col + aqua)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "💧 Eau: Colaquayn",
    "description": "Génère un enchantement qui permet à la cible marcher sur l'eau, elle le fait avec une allure de [Magnitude/3] ou améliorée de [Magnitude/5]."
  },
  {
    "num": 4,
    "vulgar": "Nage",
    "latin": "Nato (Nager)",
    "arcane": "Carnato (Car + nato)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "💧 Eau: Carnatoyn",
    "description": "Génère un enchantement qui permet à la cible de nager, elle le fait avec une allure de [Magnitude/4] ou améliorée de [Magnitude/5]."
  },
  {
    "num": 5,
    "vulgar": "Ascension",
    "latin": "Ascendo (Monter)",
    "arcane": "Conasc (Con + asc)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🪨 Terre: Conascum",
    "description": "Génère un enchantement qui permet à la cible de grimper, elle le fait avec une allure de [Magnitude/3] ou améliorée de [Magnitude/5]."
  },
  {
    "num": 6,
    "vulgar": "Terremarche",
    "latin": "Terra (Terre)",
    "arcane": "Centerra (Cen + terra)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🪨 Terre: Centerraum",
    "description": "Génère un enchantement qui permet à la cible de marcher sur le sol, elle le fait avec une allure de [Magnitude/3]."
  },
  {
    "num": 7,
    "vulgar": "Attraction",
    "latin": "Traho (Tirer)",
    "arcane": "Coltraho (Col + traho)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "💢 Vide: Coltrahoarh",
    "description": "Génère un enchantement d'attraction agissant chaque tour comme l'action tactique de déplacement forcé avec un jet de [Magnitude/2] et attirant en son centre toutes les cibles dans la zone d'effet, de fait le sort doit inclure une zone d'effet."
  },
  {
    "num": 8,
    "vulgar": "Répulsion",
    "latin": "Pello (Pousser)",
    "arcane": "Carpello (Car + pello)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🌪️ Air: Carpelloel",
    "description": "Génère un enchantement répulsif agissant comme l'action tactique de déplacement forcé avec un jet de [Magnitude/2] et repoussant de son centre toutes les cibles dans la zone d'effet, de fait le sort doit inclure une zone d'effet."
  },
  {
    "num": 9,
    "vulgar": "Edification",
    "latin": "Aedifico (Édifier)",
    "arcane": "Conedi (Con + edi)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🔥 Feu: Conediar, ❄️ Glace: Conediis, ⚡ Foudre: Conedior, 🪨 Terre: Conedium, 💧 Eau: Conediyn, 🌪️ Air: Conediel, ☀️ Lumière: Conediion, 🌑 Ombre: Conedioth, ⚖️ Loi: Conediem, 🌀 Chaos: Conediix, ✨ Sacre: Conediiel, 🩸 Impie: Conediun, ❤️ Vie: Conediir, ☠️ Mort: Conedius, 🌿 Flore: Conediiln, ✡️ Arcane: Conediys, 🎭 Illusion: Conediin, ⚔️ Acier: Conedian, 💢 Vide: Conediarh",
    "description": "Génère un enchantement sous la forme d'un mur tangible ou intangible (selon la clé), la [Magnitude] permet d'en mesurer la distance et/ou l'intensité, voir la règle des murs magiques, de la [clé] dépends les effets associé au mur."
  },
  {
    "num": 10,
    "vulgar": "Revêtement",
    "latin": "Vestis (Vêtement)",
    "arcane": "Cenvest (Cen + vest)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🔥 Feu: Cenvestar, ❄️ Glace: Cenvestis, ⚡ Foudre: Cenvestor, 🪨 Terre: Cenvestum, 💧 Eau: Cenvestyn, 🌪️ Air: Cenvestel, ☀️ Lumière: Cenvestion, 🌑 Ombre: Cenvestoth, ⚖️ Loi: Cenvestem, 🌀 Chaos: Cenvestix, ✨ Sacre: Cenvestiiel, 🩸 Impie: Cenvestun, ❤️ Vie: Cenvestir, ☠️ Mort: Cenvestus, 🌿 Flore: Cenvestiln, ✡️ Arcane: Cenvestys, 🎭 Illusion: Cenvestin, 🛡️ Guerre: Cenvestorr",
    "description": "Génère un enchantement sous la forme d'un revêtement au sol tangible ou intangible (selon la clé), la [Magnitude] permet d'en mesurer la distance et/ou l'intensité, voir la règle des sols magiques, de la [clé] dépends les effets associé au sol."
  },
  {
    "num": 11,
    "vulgar": "Fers",
    "latin": "Ferrum (Fer)",
    "arcane": "Colfer (Col + fer)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "☠️ Mort: Colferus, ⚔️ Acier: Colferan, 🌿 Flore: Colferiln, ✡️ Arcane: Colferys, ☀️ Lumière: Colferion, 🌑 Ombre: Colferoth, ⚖️ Loi: Colferem, 🌀 Chaos: Colferix, ✨ Sacre: Colferiiel, 🩸 Impie: Colferun",
    "description": "Génère un enchantement (sous formes de chaines tangibles ou intangibles) qui emprisonne un membre de la cible, la [Magnitude] permet d'en mesurer l'intégrité, si intangible la difficulté pour se soustraire à l'effet est augmenté de 5, la cible peux réduire/endommager les charges de l'enchantement comme il le ferait avec une structure (catégorie 0 si intangible sinon 5), il peux aussi réaliser une évaluation (diff 10) de musculation ou évasion (on considère que le jet endommage l'enchantement)."
  },
  {
    "num": 12,
    "vulgar": "Incarcération",
    "latin": "Carcer (Prison)",
    "arcane": "Carcarce (Car + carce)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "4",
    "drain": "4",
    "keys": "☠️ Mort: Carcarceus, ⚔️ Acier: Carcarcean, 🌿 Flore: Carcarceiln, ✡️ Arcane: Carcarceys, ☀️ Lumière: Carcarceion, 🌑 Ombre: Carcarceoth, ⚖️ Loi: Carcarceem, 🌀 Chaos: Carcarceix, ✨ Sacre: Carcarceiel, 🩸 Impie: Carcarceun",
    "description": "Génère un enchantement (sous formes de cage tangibles ou intangibles) qui emprisonne entièrement la cible, fonctionne comme les fers mais prive de déplacement et réduire drastiquement les actions possibles (la cage étant serrée, l'usage de la plupart des armes est impossible, sauf armes légères)."
  },
  {
    "num": 13,
    "vulgar": "Sarcophagie",
    "latin": "Sarcophagus (Grec)",
    "arcane": "Consar (Con + sar)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "6",
    "drain": "6",
    "keys": "☠️ Mort: Consarus, ⚔️ Acier: Consaran, 🌿 Flore: Consariln, ✡️ Arcane: Consarys, ☀️ Lumière: Consarion, 🌑 Ombre: Consaroth, ⚖️ Loi: Consarem, 🌀 Chaos: Consarix, ✨ Sacre: Consariel, 🩸 Impie: Consarun",
    "description": "Génère un enchantement (sous formes de cerceuil tangibles ou intangibles) qui isole totalement la cible, fonctionne comme les fers mais la cible ne peux plus agir/interagir avec les autres, elle peux quand même tenter de briser/se soustraire à l'enchantement (même si là de toute évidence il ne pourra user de sa propre arme pour s'en sortir)."
  },
  {
    "num": 14,
    "vulgar": "Asphyxie",
    "latin": "Spirare (Souffler)",
    "arcane": "Censpira (Cen + spira)",
    "word_type": "Pouvoir",
    "target_type": "TO Finish ?",
    "difficulty": "2",
    "drain": "2",
    "keys": "💢 Vide: Censpiraarh",
    "description": "Nécessite le mot de pouvoir X (ci dessus), l'effet inclus une privation d'air qui génère une suffocation naturelle."
  },
  {
    "num": 15,
    "vulgar": "Eclairsissement",
    "latin": "Clarus (Clair)",
    "arcane": "Colclaru (Col + claru)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🔥 Feu: Colclaruar, ☀️ Lumière: Colclaruion",
    "description": "Génère un enchantement qui génère de la lumière, au lancement le lanceur de sort choisit entre l'enchantement qui suit une cible ou qui reste statique, la lumière peux être activée/désactivée en une action libre, elle permet d'y voir sur une distance [Magnitude/2] (annulant désavantages ou autres liés à la vue) et (si nécessaire/que cela fait sens) peux réduire les pénalités de vue de [Magnitude/10] ou octroyer un bonus pour percevoir visuellement les choses dans sa zone d'action, si la lumière est attachée à une cible un test d'opposition est toujours possible de la part de la cible pour tenter d'en réduire les effets."
  },
  {
    "num": 16,
    "vulgar": "Obscurcissement",
    "latin": "Obscuro (Obscurcir)",
    "arcane": "Carscuro (Car + scuro)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🌑 Ombre: Carscurooth",
    "description": "Génère un enchantement qui absorbe la lumière, au lancement le lanceur de sort choisit entre l'enchantement qui suit une cible ou qui reste statique, la réduction de lumière peux être activée/désactivée en une action libre, elle permet de réduire la visibilité sur une distance [Magnitude/2] (générant un désavantages liés à la vue) et (si nécessaire/que cela fait sens) peux augmenter les pénalités de vue de [Magnitude/10] ou octroyer un malus pour percevoir visuellement les choses dans sa zone d'action, si la lumière est attachée à une cible un test d'opposition est toujours possible de la part de la cible pour tenter d'en réduire les effets."
  },
  {
    "num": 17,
    "vulgar": "Simulacre",
    "latin": "Simulo (Imiter)",
    "arcane": "Consim (Con + sim)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🎭 Illusion: Consimin",
    "description": "Génère un enchantement qui prend les traits de la cible, ce clone agit et parle indépendament de son modèle mais ne peux rien faire par lui même de complexe, il aura l'air de réussire ce qu'il fait mais même si c'est le cas il n'y a pas de réelles conséquences dans le monde réel, à chaque fois qu'un changement de comportement/action est requis cet enchantement subit une décharge, ces effets sont sujets aux règles inhérentes aux Illusions."
  },
  {
    "num": 18,
    "vulgar": "Spiritisme",
    "latin": "Spiritus (Esprit)",
    "arcane": "Censpiri (Cen + spiri)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "4",
    "drain": "4",
    "keys": "☠️ Mort: Censpirius",
    "description": "Génère un enchantement qui met en contact le lanceur de sort et l'âme d'un être défunt ciblé pour un total de [Magnitude/10] questions, la cible réponds doit répondre honnêtement mais ne donnera fera des réponses courtes et ne précisera jamais sa réponse (sans que cela ne compte pour une autre question)."
  },
  {
    "num": 19,
    "vulgar": "Miasmes",
    "latin": "Miasma (SouiLure, grec)",
    "arcane": "Colmias (Col + mias)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "4",
    "drain": "4",
    "keys": "☢️ Toxique: Colmiasex",
    "description": "Génère un enchantement de lieu qui prend la forme de miasmes, tant qu'un individus est dans la zone d'effet il subit des pénalités à tout ses attributs pour les tests actifs équivalants à [Magnitude/10], un test de sauvegarde (vs robustesse) permet de diminuer la magnitude appliquée, cet effet ne fait pas de différence entre alliés et ennemis."
  },
  {
    "num": 20,
    "vulgar": "Pestilence",
    "latin": "Pestis (Peste)",
    "arcane": "Carpesti (Car + pesti)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "4",
    "drain": "4",
    "keys": "☠️ Mort: Carpestius",
    "description": "Génère un enchantement de lieu qui prend la forme de miasmes, tant qu'un individus est dans la zone d'effet il subit des pénalités à ses attributs du corps pour les tests actifs équivalants à [Magnitude/8], un test de sauvegarde (vs détermination) permet de diminuer la magnitude appliquée, cet effet ne fait pas de différence entre alliés et ennemis."
  },
  {
    "num": 21,
    "vulgar": "Hantise",
    "latin": "Umbra (Ombre)",
    "arcane": "Conumbra (Con + umbra)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "4",
    "drain": "4",
    "keys": "☠️ Mort: Conumbraus",
    "description": "Génère un enchantement de lieu qui prend la forme d'une hantise, tant qu'un individus est dans la zone d'effet il subit des pénalités à ses attributs de l'esprit pour les tests actifs équivalants à [Magnitude/8], un test de sauvegarde (vs détermination) permet de diminuer la magnitude appliquée, cet effet ne fait pas de différence entre alliés et ennemis."
  },
  {
    "num": 22,
    "vulgar": "Pulsation",
    "latin": "Pulso (Frapper)",
    "arcane": "Cenpulso (Cen + pulso)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "4",
    "drain": "4",
    "keys": "Tous: Cenpulso (Pas de suffixe élémentaire, domaine \"Tous\")",
    "description": "Génère un enchantement de lieu qui produit les effets d'un autre [mot de pouvoir] (écoles : Destruction, Restauration, Abjuration, Altération, Evocation) à chaque début de tour dans sa zone d'effet, l'effet en question dispose de toute sa [Magnitude], cet effet ne peux être maintenu et sa décharge est doublée (10), l'effet ne fait pas la différence entre ennemis et alliés... Il y a toujours une sauvegarde associé à cet effet qui dépends de la nature des effets : Une agression sera associée aux réflexes si physique ou sang froid si mentale, un effet autre serait associé à la robustesse si physique ou à la détermination si mental, etc... Le drain et la difficulté du mot de pouvoir associé sont à ajouter normalement."
  },
  {
    "num": 23,
    "vulgar": "Mandala",
    "latin": "Circulus (Cercle)",
    "arcane": "Colcircu (Col + circu)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "6",
    "drain": "6",
    "keys": "Tous: Colcircu (Pas de suffixe élémentaire, domaine \"Tous\")",
    "description": "Génère un enchantement de lieu qui produit les effets d'un autre [mot de pouvoir] (écoles : Bénédiction, Malédiction) à tous les individus tant qu'ils sont dans la zone d'effet, l'effet en question dispose de toute sa [Magnitude], cet effet ne peux être maintenu et sa décharge est doublée (10), l'effet ne fait pas la différence entre ennemis et alliés... Les effets négatifs sont associés à une sauvegarde de détermination, qui doit être lancé en entrant dans la zone où à chaque tour passé dedans. Le drain et la difficulté du mot de pouvoir associé sont à ajouter normalement."
  },
  {
    "num": 24,
    "vulgar": "Armement élémentaire",
    "latin": "Arma (Arme)",
    "arcane": "Cararma (Car + arma)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "4",
    "keys": "🔥 Feu: Cararmaar, ❄️ Glace: Cararmais, ⚡ Foudre: Cararmaor, 🪨 Terre: Cararmaum, 💧 Eau: Cararmayn, 🌪️ Air: Cararmael, ☀️ Lumière: Cararmaion, 🌑 Ombre: Cararmaoth, ⚖️ Loi: Cararmaem, 🌀 Chaos: Cararmaix, ✨ Sacre: Cararmaiel, 🩸 Impie: Cararmaun, ❤️ Vie: Cararmair, ☠️ Mort: Cararmaus, 🌿 Flore: Cararmailn, ✡️ Arcane: Cararmays, 🎭 Illusion: Cararmain, ⚔️ Acier: Cararmaan, 🔮 Magie: Cararmairn",
    "description": "Conjure une arme sous la forme d'un enchantement (neutre) dont une partie des propriétés dépendent de la [clé] : Spécifique aux armes conjourées : Les dégats sont entièrement de l'élément associé à la clé, toucher la cible requière de passer la défense associée à l'élément ET à la forme de l'arme. Global aux objets conjurés : Le personnage a l'expertise et la science de l'objet en question, la catégorie et la forme de l'objet est au choix mais au mieux de [Magnitude/5] (toutes les contraintes liées à ces valeurs subsistent, poids, etc), l'objet est de qualité [Magnitude/5]."
  },
  {
    "num": 25,
    "vulgar": "Armure élémentaire",
    "latin": "Loric (Cuirasse)",
    "arcane": "Conloric (Con + loric)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "4",
    "keys": "🔥 Feu: Conloricar, ❄️ Glace: Conloricis, ⚡ Foudre: Conloricor, 🪨 Terre: Conloricum, 💧 Eau: Conloricyn, 🌪️ Air: Conloricel, ☀️ Lumière: Conloricion, 🌑 Ombre: Conloricoth, ⚖️ Loi: Conloricem, 🌀 Chaos: Conloricix, ✨ Sacre: Conloriciel, 🩸 Impie: Conloricun, ❤️ Vie: Conloricir, ☠️ Mort: Conloricus, 🌿 Flore: Conloriciln, ✡️ Arcane: Conloricys, 🎭 Illusion: Conloricin, ⚔️ Acier: Conlorican, 🔮 Magie: Conloricirn",
    "description": "Conjure une armure sous la forme d'un enchantement (neutre) dont une partie des propriétés dépendent de la [clé] : Spécifique aux armures conjurées : Offre une résistance notable (mi dégats) aux éléments forts. Global aux objets conjurés : Le personnage a l'expertise et la science de l'objet en question, la catégorie et la forme de l'objet est au choix mais au mieux de [Magnitude/5] (toutes les contraintes liées à ces valeurs subsistent, poids, etc), l'objet est de qualité [Magnitude/5]."
  },
  {
    "num": 26,
    "vulgar": "Outil conjuré",
    "latin": "Instrumentum (Outil)",
    "arcane": "Ceninstr (Cen + instr)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "✡️ Arcane: Ceninstrys, ⚔️ Acier: Coninstran",
    "description": "Conjure un outil sous la forme d'un enchantement (neutre) dont une partie des propriétés dépendent de la [clé] : Les outils d'arcanes ne permettent que de travailler la magie, là où les outils d'acier permettent de générer les autres types d'outils (pour les activités dites vulguaires). Global aux objets conjurés : Le personnage a l'expertise et la science de l'objet en question, la catégorie et la forme de l'objet est au choix mais au mieux de [Magnitude/5] (toutes les contraintes liées à ces valeurs subsistent, poids, etc), l'objet est de qualité [Magnitude/5]."
  },
  {
    "num": 27,
    "vulgar": "Focalisateur conjuré",
    "latin": "Focus (Focaliser)",
    "arcane": "Cenfoc (Cen + Foc)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "✡️ Arcane: Cenfocrys",
    "description": "Conjure un focalisateur sous la forme d'un enchantement (neutre) : Global aux objets conjurés : Le personnage a l'expertise et la science de l'objet en question, la catégorie et la forme de l'objet est au choix mais au mieux de [Magnitude/5] (toutes les contraintes liées à ces valeurs subsistent, poids, etc), l'objet est de qualité [Magnitude/5]."
  },
  {
    "num": 28,
    "vulgar": "Imprégnation",
    "latin": "Pingo (Peindre)",
    "arcane": "Colpingo (Col + pingo)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🔮 Magie: Colpingoirn",
    "description": "Génère un enchantement qui enchante un autre enchantement pour en augmenter la difficulté arcanique associée de [Magnitude/5]."
  },
  {
    "num": 29,
    "vulgar": "Oculus",
    "latin": "Oculus (Œil)",
    "arcane": "Carocul (Car + ocul)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "👁️ Vision: Caroculeth",
    "description": "Génère un enchantement qui prend la forme d'un globe de petite taille capable de voler à une allure de [Magnitude/5], le lanceur de sort peux percevoir (et donc réaliser des tests d'acuité) comme il le ferait lui même au travers de ce globe, le globe ne peux aller au délà d'une distance de [Magnitude x10], une action libre suffit à contrôler le globe et lui donner d'autres indications/orientation, le globe (et la sensation d'être épié notament) peux être \"perçu\" (sans localisation) sur un test de sauvegarde (vs intuition) réussie sans quoi il ne l'est pas."
  },
  {
    "num": 30,
    "vulgar": "Démarquation",
    "latin": "Notus (Marque)",
    "arcane": "Connota (Con + nota)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🔮 Magie: Connotairn",
    "description": "Génère un enchantement qui permet, tant que cet enchantement perdure, au lanceur de sort de lancer des sorts sur la cible de cet enchantement comme si il s'agissait d'une cible valide, sur une distance maximale de [Magnitude] pour une personne, [Magnitude x10] pour un objet ou [Magnitude x100] pour un lieu (le sort échoue si la cible est trop loin)."
  },
  {
    "num": 31,
    "vulgar": "Lustration",
    "latin": "Lustro (Purifier)",
    "arcane": "Cenlustr (Cen + lustr)",
    "word_type": "Pouvoir",
    "target_type": "Lieu",
    "difficulty": "2",
    "drain": "2",
    "keys": "💧 Eau: Cenlustryn",
    "description": "Génère un enchantement qui purifie une source d'eau, n'importe qui peux alors s'y restaurer jusqu'à un total de [Magnitude/4] ressources réparties autant que possible entre elles (c'est le personnage qui consomme qui décide où va les restes), une même ressource ne peux recevoir plus de [Magnitude/10] de cette manière, une fois par jour maximum par personne (se cumule à la version eau)."
  },
  {
    "num": 32,
    "vulgar": "Verger pur",
    "latin": "Pura (Pur) + Hortus (Jardin)",
    "arcane": "Colhort (Col + hort)",
    "word_type": "Pouvoir",
    "target_type": "Lieu",
    "difficulty": "2",
    "drain": "2",
    "keys": "🌿 Flore: Colhortiln",
    "description": "Génère un enchantement qui purifie un arbre fruitier, n'importe qui peux alors s'y restaurer jusqu'à un total de [Magnitude/4] ressources réparties autant que possible entre elles (c'est le personnage qui consomme qui décide où va les restes), une même ressource ne peux recevoir plus de [Magnitude/10] de cette manière, une fois par jour maximum par personne (se cumule à la version flore)."
  },
  {
    "num": 33,
    "vulgar": "Illumination",
    "latin": "Lumen (Lumière)",
    "arcane": "Carlumen (Car + lumen)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🔥 Feu: Carlumenar, ☀️ Lumière: Carlumenion",
    "description": "Génère un enchantement qui réduit la faculté à se cacher ou à dissimuler, la difficulté visant à percevoir un élément caché étant réduite de [Magnitude/5]."
  },
  {
    "num": 34,
    "vulgar": "Occultation",
    "latin": "Occulto (Cacher)",
    "arcane": "Conocult (Con + nocult)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🌑 Ombre: Conocultoth",
    "description": "Génère un enchantement qui augmente la faculté à se cacher ou à dissimuler, la difficulté visant à percevoir un élément caché étant augmentée de [Magnitude/5]."
  },
  {
    "num": 35,
    "vulgar": "Démasquage",
    "latin": "Larva (Masque)",
    "arcane": "Cenlarva (Cen + larva)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚖️ Loi: Cenlarvatem",
    "description": "Génère un enchantement qui réduit la faculté à mentir, falcifier, se déguiser ou autre manipulation de la vérité, la difficulté visant à percevoir la vérité étant réduite de [Magnitude/5]."
  },
  {
    "num": 36,
    "vulgar": "Subterfuge",
    "latin": "Fugio (S'enfuir)",
    "arcane": "Colfugi (Col + fugi)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🌀 Chaos: Colfugiix",
    "description": "Génère un enchantement qui améliore la faculté à mentir, falcifier, se déguiser ou autre manipulation de la vérité, la difficulté visant à percevoir la vérité étant augmenté de [Magnitude/5]."
  },
  {
    "num": 37,
    "vulgar": "Entrave",
    "latin": "Impedio (Empêcher)",
    "arcane": "Cariped (Car + iped)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🧩 Mental: Caripedyend",
    "description": "Génère un enchantement qui permet au lanceur de sort de empêcher sa cible d'agir, pour le prix d'une action libre le lanceur du sort peux ainsi empêcher sa cible de réaliser une action d'un type choisit, cependant si la cible réussis un test de sauvegarde (vs Détermination) elle échappe à ce contrôle (même si cela ne met pas fin à l'enchantement lui même), l'enchantement prend fin après que la cible s'est vue bannir d'un total de [Magnitude/3] actions."
  },
  {
    "num": 38,
    "vulgar": "Marionnettisation",
    "latin": "Pupus (Poupée)",
    "arcane": "Conpupa (Con + pupa)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "4",
    "drain": "4",
    "keys": "🧩 Mental: Conpupaend",
    "description": "Génère un enchantement qui permet au lanceur de sort de contrôler partiellement les faits et geste d'une cible, pour le prix d'une action libre le lanceur du sort peux ainsi forcer sa cible à réaliser une action, dés que c'est à elle d'agir celle ci tentera de réaliser l'action en question en premier lieu, cependant si la cible réussis un test de sauvegarde (vs Détermination) elle échappe à ce contrôle (même si cela ne met pas fin à l'enchantement lui même), l'enchantement prend fin après que la cible est réalisée ou refusée [Magnitude/4] actions forcées."
  },
  {
    "num": 39,
    "vulgar": "Domination",
    "latin": "Dominus (Maître)",
    "arcane": "Cendomin (Cen + domin)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "6",
    "drain": "6",
    "keys": "🧩 Mental: Cendominend",
    "description": "Génère un enchantement qui permet au lanceur de sort de contrôler totalement les faits et geste d'une cible, pour le prix d'une action rapide le lanceur du sort peux ainsi choisir les actions pour sa cible lorsque viens le moment pour elle de jouer, cependant si la cible réussis un test de sauvegarde (vs Détermination) elle échappe à ce contrôle (même si cela ne met pas fin à l'enchantement lui même) et peux agir normalement ce round ci, l'enchantement prend fin après que la cible est réalisée ou refusée [Magnitude/5] actions forcées."
  },
  {
    "num": 40,
    "vulgar": "Lecture mentale",
    "latin": "Mente (Esprit)",
    "arcane": "Colment (Col + ment)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "4",
    "drain": "4",
    "keys": "📚 Savoir: Colmentaum",
    "description": "Génère un enchantement qui permet au lanceur de sort d'entendre les pensées de la cible sur une distance maximale de [Magnitude/3], cet effet peux être \"perçu\" (sans localisation) sur un test de sauvegarde (vs intuition) réussie sans quoi il ne l'est pas."
  },
  {
    "num": 41,
    "vulgar": "Danse des lames",
    "latin": "Gladius (Épée)",
    "arcane": "Cargladi (Car + gladi)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚔️ Acier: Cargladian",
    "description": "Génère un enchantement qui prend la forme de 4 petites armes (couteau) / 3 moyennes (épée courte) / 2 grandes (épée longue) / une très grande (claymore) autour du lanceur de sort, le type d'arme affecte la défense passive sollicité le cas échéant uniquement (tranchant, contondant ou perforant), lorsque la cible le souhaite elle peux dépenser une action libre et 0 / 1 / 2 / 3 points d'initiative pour attaquer, défendre ou réaliser une tactique avec l'une de ces lames, la cible utilise alors sa compétence de magie et son attribut de magie pour le test en question, le jet n'est pas lié à la forme de l'arme mais à [6+Magnitude/4] / [4+Magnitude/3] / [2+Magnitude/2] / [Magnitude], le test se fait avec une pénalité (totale) de 0 / 1 / 2 / 3, une fois l'arme utilisée elle est inactive jusqu'à ce que la cible utilise une action simple pour recharger le tout, l'arme n'attaque qu'à une portée de contact et l'action ne génère pas d'opportunité ou autre, si le personnage le souhaite il peux utiliser une action simple ou rapide à la place de libre et l'action sera avantagée."
  },
  {
    "num": 42,
    "vulgar": "Halo de projectiles",
    "latin": "Telum (Trait/Projectile)",
    "arcane": "Contelum (Con + telum)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚔️ Acier: Conteluman (Physique), 🧩 Mental: Contelume nd (Mental), ✡️ Arcane: Contelums (Magie)",
    "description": "Génère un enchantement qui prend la forme de [Magnitude/5] projectiles (sans catégorie) autour du lanceur de sort, lorsque la cible le souhaite elle peux dépenser une action libre pour attaquer (la nature de l'attaque dépends de la [clé] employée) avec l'un de ces projectiles, la cible utilise alors sa compétence de magie et son attribut de magie pour le test en question, le jet de l'attaque vaux [Magnitude/2] (perforation et gravité lié aux caracs du personnage s'appliquent normalement) une fois le projectile utilisé ce dernier disparait jusqu'à ce que la cible utilise une action simple pour recharger le tout, les projectiles ont une portée équivalante à celle d'un sort \"à disance\" et l'action ne génère pas d'opportunité ou autre, si le personnage le souhaite il peux utiliser une action simple ou rapide à la place de libre et l'action sera avantagée."
  },
  {
    "num": 43,
    "vulgar": "Couronne de boucliers",
    "latin": "Scutum (Bouclier)",
    "arcane": "Censcutu (Cen + scutu)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚔️ Acier: Censcutuan (Physique), 🧩 Mental: Censcutuend (Mental), 🪷 Nature: Censcutu eiln (Magie)",
    "description": "Génère un enchantement qui prend la forme de [Magnitude/5] boucliers autour du lanceur de sort, lorsque la cible le souhaite elle peux dépenser une action libre pour se défendre avec l'un de ces boucliers, il est possible de défendre (d'une agression dont la nature dépends de la [clé] employée) un allié adjacent de cette manière, la cible utilise alors sa compétence de magie et son attribut de magie pour le test en question, le jet associé est alors fixé à [Magnitude/3], une fois le bouclier utilisé ce dernier disparait jusqu'à ce que la cible utilise une action simple pour recharger le tout, si le personnage le souhaite il peux utiliser une action simple ou rapide à la place de libre et l'action sera avantagée."
  },
  {
    "num": 44,
    "vulgar": "Appel de la foudre",
    "latin": "Fulgur (Foudre)",
    "arcane": "Colfulgur (Col + fulgur)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "c",
    "keys": "⚡ Foudre: Colfulguror",
    "description": "Génère un enchantement de lieu qui charge les nuages au dessus (que l'origine soit magique ou pas, limité à la zone d'effet de l'enchantement le cas échéant), lorsque le lanceur de sort le souhaite il peux dépenser une action simple pour provoquer la foudre qui frappe la cible de son choix dans la zone, le lanceur de sort utilise sa compétence de magie et son attribut de magie pour le test en question, les dégats sont de [Magnitude] et font l'objet d'un test de sauvegarde (vs Réflexes), à chaque frappes l'enchantement subit une décharge, évidemment les conditions de fonctionnement de ce sort implique des éléments qu'il appartient au MJ de considérer."
  },
  {
    "num": 45,
    "vulgar": "Transmutation",
    "latin": "Muto (Changer)",
    "arcane": "Carmuta (Car + muta)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🐗 Faune: Carmutaorh",
    "description": "Génère un enchantement qui prend la forme de membres ou d'une particularité physiologique issus d'un animal au choix, ce gain entraine l'amélioration d'une compétence qui dépends logiquement du membre (examples : nagoire de requin pour natation, peau de croco pour armure, griffe d'ours pour attaquer, etc), dans le cas où la logique pourrait entrainer l'amélioration de plusieurs compétences une seule est affectée (au choix du lanceur de sort), l'utilisation de la compétence se fait alors avec un bonus de [Magnitude/7] ou avec un minimum (Groupe+Compétence) de [Magnitude/5]."
  },
  {
    "num": 46,
    "vulgar": "Locomutation",
    "latin": "Locus (Lieu) + Muto (Changer)",
    "arcane": "Conloco (Con + loco)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🐗 Faune: Conlocoorh",
    "description": "Génère un enchantement qui prend la forme de membres ou d'une particularité physiologique issus d'un animal au choix, ce gain entraine la possibilité de se déplacer différement: Voler, Marcher sur les parois, Marcher sur des surfaces qui ne permettent pas ou qui réduisent l'aLure, Nager... Le déplacement en question se fait avec une allure de [Magnitude/3] (remplace l'allure normale)."
  },
  {
    "num": 47,
    "vulgar": "Mimétisation",
    "latin": "Mimicus (Mime)",
    "arcane": "Cenmimic (Cen + mimic)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🎭 Illusion: Cenmimicin",
    "description": "Génère un enchantement donne à sa cible les traits (visuel, sonore, odeurs) d'une autre personne, si ces traits sont ceux d'une personne connu du lanceur de sort alors seuls les détails que ce dernier connait vraiment sont parfaits (le reste révèle la nature fausse de la chose à quiquonque connait celui ci chez la personne d'origine), ces effets sont sujets aux règles inhérentes aux Illusions."
  },
  {
    "num": 48,
    "vulgar": "Espace de poche",
    "latin": "Spatium (Espace)",
    "arcane": "Colspati (Col + spati)",
    "word_type": "Pouvoir",
    "target_type": "Lieu",
    "difficulty": "2",
    "drain": "2",
    "keys": "✡️ Arcane: Colspatiys",
    "description": "Génère un effet qui ouvre une porte afin de stocker ou récupérer dans l'espace interdimentionnel personel (chaque personne en dispose d'un unique) un ou des objets, la totalité des objets pouvant être stocké et sortis est limité à un encombrement total de [Magnitude/2], les objets sont catalogués juqu'à ou récupérés depuis l'index de référencement maximum [Magnitude/2], par exemple un objet d'encombrement 3 peux occuper l'espace de 16 à 18, il faudra alors une magnitude de 36 pour le récupérer ensuite."
  },
  {
    "num": 49,
    "vulgar": "Surcharge",
    "latin": "Onero (Charger)",
    "arcane": "Carnero (Car + nero)",
    "word_type": "Pouvoir",
    "target_type": "Lieu",
    "difficulty": "2",
    "drain": "2",
    "keys": "🪷 Nature: Carneroeiln",
    "description": "Génère un enchantement de lieu qui augmente le drain des sorts lancés dans la zone de [Magnitude/4], la sauvegarde de détermination permettant de réduire cet effet."
  },
  {
    "num": 50,
    "vulgar": "Saignée arcanique",
    "latin": "Sanguis (Sang)",
    "arcane": "Consang (Con + sang)",
    "word_type": "Pouvoir",
    "target_type": "Lieu",
    "difficulty": "2",
    "drain": "2",
    "keys": "🪷 Nature: Consangeiln",
    "description": "Génère un enchantement de lieu qui inflige aux lanceurs de sort l'équivalant du drain des sorts en attrition (perte de PE) dans la zone, la perte étant limité à [Magnitude/2], la sauvegarde de détermination permettant de réduire cet effet."
  },
  {
    "num": 51,
    "vulgar": "Perturbation",
    "latin": "Turbo (Troubler)",
    "arcane": "Centurb (Cen + turb)",
    "word_type": "Pouvoir",
    "target_type": "Lieu",
    "difficulty": "2",
    "drain": "2",
    "keys": "🪷 Nature: Centurbeiln",
    "description": "Génère un enchantement de lieu qui augmente la difficulté de sorts lancés dans la zone de [Magnitude/5], la sauvegarde de détermination permettant de réduire cet effet."
  },
  {
    "num": 52,
    "vulgar": "Harmonisation",
    "latin": "Harmonia (Harmonie)",
    "arcane": "Colharmo (Col + harmo)",
    "word_type": "Pouvoir",
    "target_type": "Lieu",
    "difficulty": "2",
    "drain": "2",
    "keys": "🔮 Magie: Colharmoirn",
    "description": "Génère un enchantement de lieu qui réduit la difficulté de sorts lancés dans la zone de [Magnitude/5]."
  },
  {
    "num": 53,
    "vulgar": "Allégement",
    "latin": "Leves (Léger)",
    "arcane": "Carleves (Car + leves)",
    "word_type": "Pouvoir",
    "target_type": "Lieu",
    "difficulty": "2",
    "drain": "2",
    "keys": "🔮 Magie: Carlevesirn",
    "description": "Génère un enchantement de lieu qui réduit le drain des sorts lancés dans la zone de [Magnitude/4], ce qui n'affecte pas le cout minimum des sorts."
  },
  {
    "num": 54,
    "vulgar": "Fenêtre astrale",
    "latin": "Astra (Étoile)",
    "arcane": "Conastra (Con + astra)",
    "word_type": "Pouvoir",
    "target_type": "Lieu",
    "difficulty": "2",
    "drain": "2",
    "keys": "👁️ Vision: Conastra eth",
    "description": "Génère un enchantement de lieu qui prend la forme d'une fenêtre vers un autre lieu, on ne peux y passer mais il est possible d'épier à travers, un test d'intuition réussis permet à ceux qui sont épiés de se sentir observés puis un test d'acuité peux permettre de repérer la fenêtre (ou en tout cas d'où viens la sensation), le lieu ainsi épié peux être à une distance maximale de [Magnitude]² mètres."
  },
  {
    "num": 55,
    "vulgar": "Invisibilité",
    "latin": "Celo (Cacher)",
    "arcane": "Cencelo (Cen + celo)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "4",
    "keys": "🎭 Illusion: Cenceloin",
    "description": "Génère un enchantement sur cible qui tord la lumière et rend le sujet invisible, un test d'intuition réussis permet de savoir que quelque chose ne va pas et un test d'acuité permet de voir la cible malgrés tout, ce sort ne peux être lancé à un niveau inférieur à 2, toute action d'agression met un terme à l'enchantement."
  },
  {
    "num": 56,
    "vulgar": "Silence",
    "latin": "Silentium (Silence)",
    "arcane": "Colsil (Col + sil)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "4",
    "keys": "🎭 Illusion: Colsilin",
    "description": "Génère un enchantement sur cible qui étouffe le son et rend le sujet difficile à entendre, un test d'intuition réussis permet de savoir que quelque chose ne va pas et un test d'acuité permet de voir la cible malgrés tout, ce sort ne peux être lancé à un niveau inférieur à 2, toute action d'agression met un terme à l'enchantement."
  },
  {
    "num": 57,
    "vulgar": "Réanimation",
    "latin": "Anima (Âme)",
    "arcane": "Caranima (Car + anima)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "☠️ Mort: Caranimaus",
    "description": "Sur une cible morte - Génère un enchantement qui force la cible à reprendre vie sous une forme impie et servile, ses attributs sont limités à 10 + 2 fois le niveau du sort, la créature dispose au mieux d'un maximum de [Magnitude] points d'endurance, pas de karma ni de chi ni de mana. La créature peux, si elle le souhaite et qu'un ordre contraire à ses valeurs d'antan lui est donné, effectuer un test de détermination à chaque tour et si elle le réussie elle peux cesser d'écouter les ordres qui lui sont donnés, mais pas mettre fin au sort spontanément. Le mage peux doit alors dépenser une action simple pour intimer un autre test de sauvegarde à la cible, qui écoute à nouveau sur un échec."
  },
  {
    "num": 58,
    "vulgar": "Climatisation",
    "latin": "Clima (Climat)",
    "arcane": "Conclim (Con + clim)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "6",
    "drain": "6",
    "keys": "🔥 Feu: Conclimar (chaleur), ❄️ Glace: Conclimais (froid), ⚡ Foudre: Conclimor (orageux), 💧 Eau: Conclimayn (pluvieux), 🌪️ Air: Conclimel (venteux), ☀️ Lumière: Conclimaion (ensoleillé), 🌑 Ombre: Conclimoth (nuageux)",
    "description": "Enchantement qui force le changement du climat dans une zone, fonctionne comme le mot Climatisation de l'école des évocations, sauf que la présence de ce climat est conditionné par l'enchantement et non une durée ou autre, il doit donc être maintenu d'une façon ou d'une autre sans quoi le phénomène ne dure pas (l'enchantement se décharge selon les règles normales), l'enchantement est situé à l'épicentre du phénomène."
  },
  {
    "num": 59,
    "vulgar": "Damnation",
    "latin": "???",
    "arcane": "???",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🩸 Impie",
    "description": "Génère un enchantement qui permet à la cible de puiser 1 PV pour augmenter de 2 la puissance des sorts lancés, avec un maximum [Magnitude/3] en puissance ajoutée."
  },
  {
    "num": 60,
    "vulgar": "Omnipotence",
    "latin": "???",
    "arcane": "???",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🧩 Mental",
    "description": "Génère un enchantement qui permet à la cible de puiser 1 PS pour augmenter de 2 la puissance des sorts lancés, avec un maximum [Magnitude/3] en puissance ajoutée."
  },
  {
    "num": 61,
    "vulgar": "Main lointaine",
    "latin": "Manus (Main)",
    "arcane": "Conmanu (Con + manu)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "💢 Vide: Conmanuarh",
    "description": "Le sort génère un enchantement de type portail sur le lieu ciblé, le portail en question occupe 1 case et permet au lanceur de sort ou à n'importe qui d'autre de réaliser des actions manuelles à distance, ou afin d'en réduire la distance par exemple (le portail servant alors de relais), la distance maximale entre le point d'entrée (le lieu ciblé) et le point de sortie est de [Magnitude/2], ce portail ne permet pas à des personnes de passer quelque sauf si elles sont de taille inférieure ou égale à 5, le lanceur de sort peux à tout moment dépenser une ACTS afin de relocaliser le portail d'entrée ou de sortie à un autre endroit (même conditions, notament de portée entre le point d'entrée et de sortie), chaque fois qu'un portail est déplacé l'enchantement subit une décharge."
  },
  {
    "num": 62,
    "vulgar": "Portail",
    "latin": "Porta (Porte)",
    "arcane": "Cenporta (Cen + porta)",
    "word_type": "Pouvoir",
    "target_type": "Lieu",
    "difficulty": "2",
    "drain": "2",
    "keys": "💢 Vide: Cenportaarh",
    "description": "Le sort génère un enchantement de type portail sur le lieu ciblé avec un potenciel de [Magnitude], le lanceur de sort répartie le potenciel entre X, Y et Z, le portail en question occupe 1 case et permet au lanceur de sort ou à n'importe qui d'autre de passer à travers afin d'atteindre un lieu déterminé lors du lancement de sort à une distance maximale de X cases, ce portail permet de faire passer jusqu'à Y/3 individus et le retour est possible si Z vaux au moins 5."
  },
  {
    "num": 63,
    "vulgar": "Arche",
    "latin": "Arcus (Arche)",
    "arcane": "Cenarch (Cen + arch)",
    "word_type": "Miracle",
    "target_type": "Lieu",
    "difficulty": "8",
    "drain": "8",
    "keys": "💢 Vide: Cenarcharh",
    "description": "Le sort génère un enchantement de type portail sur le lieu ciblé avec un potenciel de [Magnitude], le lanceur de sort répartie le potenciel entre X, Y et Z, le portail en question occupe 1 case et permet au lanceur de sort ou à n'importe qui d'autre de passer à travers afin d'atteindre un lieu déterminé lors du lancement de sort, connu de ce dernier (un test de mémoire peux être nécessaire si le lieu a été visité il y a quelques temps, le MJ détermine la difficulté selon ses critères) à une distance maximale de X fois 100m, si le lieu en question fait l'objet d'une marque magique alors la distance maximale est de X fois 5km à la place, ce portail permet de faire passer jusqu'à Y/5 individus et le retour est possible si Z vaux au moins 10."
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
