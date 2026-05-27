# École de Malédiction

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
<option value="Cible (objet)">Cible (objet)</option>
<option value="Objet">Objet</option>
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
    "vulgar": "Blâme",
    "latin": "???",
    "arcane": "???",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🪷 Nature: Maldamnoeiln",
    "description": "Génère un enchantement négatif qui réduit toutes les récupérations de [Magnitude/10], notons que pour que cela affecte un repos il est nécessaire que le lanceur de sort ai procédé à un rituel ou qu'il reste éveillé pour maintenir le sort."
  },
  {
    "num": 2,
    "vulgar": "Drainage",
    "latin": "???",
    "arcane": "???",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "☠️ Mort: Morsiccus (PV), 🧩 Mental: Morsiccoend (PS), ⚖️ Loi: Morsiccoem (PK), ⚕️ Corps: Morsiccoen (PC), 🧠 Esprit: Morsiccoys (PC), ✡️ Arcane: Morsiccoys (PM), 🪷 Nature: Morsiccoeiln (PE/fatigue)",
    "description": "Génère un enchantement négatif qui réduit la récupération d'une ressource qui dépends de la [clé] associée de [Magnitude/5], notons que pour que cela soit actif lors d'un repos il est nécessaire que le lanceur de sort ai procédé à un rituel ou qu'il reste éveillé pour maintenir le sort."
  },
  {
    "num": 3,
    "vulgar": "Malédiction",
    "latin": "Execror (Maudire)",
    "arcane": "Mugxecro (Mug + xecro)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🩸 Impie: Mugxecroun",
    "description": "Génère un enchantement négatif qui augmente de [Magnitude/10] la plage des singularités négatives (maladresses)."
  },
  {
    "num": 4,
    "vulgar": "Dissipation",
    "latin": "Disipo (Disperser)",
    "arcane": "Mundisi (Mun + disi)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "☢️ Toxique: Mundisiex",
    "description": "Produit un enchantement négatif qui réduit les charges de [Magnitude/2] des conditions positives, il est possible de concentrer l'effet sur un domaine de magie unique pour lequel l'effet sera doublé (via [clé]) (les autres domaines n'en profitent alors plus."
  },
  {
    "num": 5,
    "vulgar": "Exacerbation",
    "latin": "Acerbus (Acre, amer)",
    "arcane": "Malacerb (Mal + acerb)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "☢️ Toxique: Malacerbex",
    "description": "Produit un enchantement négatif qui double les charges, maximum [Magnitude], les effets des conditions négatives, il est possible de concentrer l'effet sur un domaine de magie unique pour lequel l'effet sera doublé (via [clé]) (les autres domaines n'en profitent alors plus."
  },
  {
    "num": 6,
    "vulgar": "Mutilation",
    "latin": "Mutilo (Mutiler)",
    "arcane": "Mormuti (Mor + muti)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "☢️ Toxique: Mormutiex",
    "description": "Produit un effet d'enchantement négatif provoquant à chaque tour les effets d'un autre [mot de pouvoir] infligeant des dégats avec une magnitude divisée par deux, un test de sauvegarde permet d'en réduire les effets (robustesse si dégats physiques, détermination si dégats mentaux, etc)."
  },
  {
    "num": 7,
    "vulgar": "Lestage",
    "latin": "???",
    "arcane": "???",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "💢 Vide: Muggravarh",
    "description": "Génère un enchantement négatif qui augmente le poids effectif de la cible de [Magnitude]% (arrondis supérieur)."
  },
  {
    "num": 8,
    "vulgar": "Massification",
    "latin": "Massa (Masse)",
    "arcane": "Munmas (Mun + mas)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🪨 Terre: Munmasum",
    "description": "Génère un enchantement négatif qui augmente le poids effectif de la cible de [Magnitude/4]."
  },
  {
    "num": 9,
    "vulgar": "Affaiblissement",
    "latin": "Debilito (Affaiblir)",
    "arcane": "Maldeb (Mal + deb)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚕️ Corps: Maldeben",
    "description": "Génère un enchantement négatif qui réduit le poids maximum de la cible de [Magnitude/4]."
  },
  {
    "num": 10,
    "vulgar": "Expulsion",
    "latin": "Pello (Pousser)",
    "arcane": "Morexp (Mor + exp)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🌪️ Air: Morexpel",
    "description": "Génère un enchantement négatif qui accroit la distance des déplacements forcés de [Magnitude/4], maximum le double."
  },
  {
    "num": 11,
    "vulgar": "Effondrement",
    "latin": "Ruina (Chute)",
    "arcane": "Mugruin (Mug + ruin)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🪨 Terre: Mugruinum",
    "description": "Génère un enchantement négatif qui accroit la distance des chutes de [Magnitude/4], maximum le double."
  },
  {
    "num": 12,
    "vulgar": "Inertie",
    "latin": "Impedio (Empêcher)",
    "arcane": "Muniped (Mun + iped)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🪨 Terre: Munipedum",
    "description": "Génère un enchantement négatif qui permet d'augmenter de [Magnitude/10] les pénalités liés au déplacement."
  },
  {
    "num": 13,
    "vulgar": "Déportation",
    "latin": "Porto (Porter)",
    "arcane": "Malporto (Mal + porto)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🌪️ Air: Malportel",
    "description": "Génère un enchantement négatif qui augmente de [Magnitude/3] le jet de déplacement forcé subit."
  },
  {
    "num": 14,
    "vulgar": "Surenvenimation",
    "latin": "Veneno (Poison)",
    "arcane": "Morvene (Mor + vene)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "☠️ Mort: Morveneus",
    "description": "Génère un enchantement négatif qui augmente de [Magnitude] la charge des conditons de rupture (DOT) (pas ceux inclus dans le sort lui même)."
  },
  {
    "num": 15,
    "vulgar": "Calcination",
    "latin": "Calco (Fouler, réprimer)",
    "arcane": "Mugcalco (Mug + calco)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "☠️ Mort: Mugcalcous",
    "description": "Génère un enchantement négatif augmente jusqu'à [Magnitude/2] les brûlures de mana, maximum le double."
  },
  {
    "num": 16,
    "vulgar": "Aminoration",
    "latin": "Minus (Moins)",
    "arcane": "Munminus (Mun + minus)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "☠️ Mort: Munminusus",
    "description": "Génère un enchantement négatif qui réduit d'un total de [Magnitude/5] le maximum de lésions par niveau de gravité (d'abord le niveau 0, puis 1, puis 2, etc)."
  },
  {
    "num": 17,
    "vulgar": "Fascination",
    "latin": "Fascinum (Charme)",
    "arcane": "Malfasci (Mal + fasci)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚜️ Charme: Malfasciynh",
    "description": "Génère un enchantement négatif qui octroie à une cible A un bonus à son apparence dans le cadre d'un test de prestige (première réaction) équivalant à [Magnitude/3] envers une cible B, si la cible A avait déjà une opinion sur la cible B alors un nouveau test peux être effectué (avec le bonus) et le meilleur résultat est conservé, la cible B peux faire valoir sa sauvegarde afin de diminuer ou ignorer les effets."
  },
  {
    "num": 18,
    "vulgar": "Dépréciation",
    "latin": "Pretium (Prix, valeur)",
    "arcane": "Morpret (Mor + pret)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚜️ Charme: Morpretynh",
    "description": "Génère un enchantement négatif qui octroie à une cible A un malus à son apparence dans le cadre d'un test de prestige (première réaction) équivalant à [Magnitude/3] envers une cible B, si la cible A avait déjà une opinion sur la cible B alors un nouveau test peux être effectué (avec le bonus) et le meilleur résultat est conservé, la cible A peux faire valoir sa sauvegarde afin de diminuer ou ignorer les effets."
  },
  {
    "num": 19,
    "vulgar": "Tentation",
    "latin": "Tempto (Tenter)",
    "arcane": "Mugtemp (Mug + temp)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚜️ Charme: Mugtempynh",
    "description": "Génère un enchantement négatif qui persuade la cible que le lanceur de sort dispose de l'objet de ses désirs et qu'il est prêt à le lui accorder, l'objet en question peux se mesurer sous la forme [Magnitude/5] (en terme de qualité), évidemment si la puissance du sort n'est pas suffisante la cible peux très bien estimer que l'objet qu'il pense en possession du lanceur du sort n'est pas suffisant, mais il considérera quand même sa présence dans la balance pour de futurs négociations."
  },
  {
    "num": 20,
    "vulgar": "Insidiosité",
    "latin": "???",
    "arcane": "???",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "☠️ Mort: Munficious",
    "description": "Génère un enchantement négatif qui augmente les dégats reçus de (au choix au lancement du sort) [Magnitude/2] / [Magnitude/3] / [Magnitude/4], s'applique un maximum de 3 / 5 / 7 fois."
  },
  {
    "num": 21,
    "vulgar": "Aggravation",
    "latin": "Gravis (Lourd)",
    "arcane": "Malgravi (Mal + gravi)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "☠️ Mort: Malgravius",
    "description": "Génère un enchantement négatif qui augmente la gravité des blessures à venir de [Magnitude/3] / [Magnitude/2] / [Magnitude], s'applique un maximum de 3 / 2 / 1 fois."
  },
  {
    "num": 22,
    "vulgar": "Altération",
    "latin": "Alter (Autre)",
    "arcane": "Moralter (Mor + alter)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🧩 Mental: MoralTerrend",
    "description": "Génère un enchantement négatif qui augmente la gravité des traumas à venir de [Magnitude/3] / [Magnitude/2] / [Magnitude], s'applique un maximum de 3 / 2 / 1 fois."
  },
  {
    "num": 23,
    "vulgar": "Contagion",
    "latin": "Tango (Toucher)",
    "arcane": "Mugtago (Mug + tago)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "4",
    "drain": "4",
    "keys": "🛡️ Guerre: Mugtagoorr",
    "description": "Génère un enchantement négatif qui produit les effets d'un autre [mot de pouvoir] à chaque fois qu'une attaque est porté par la cible et touche un adversaire, l'effet en question dispose d'une puissance de [Magnitude/2] / [Magnitude/3] / [Magnitude/4] et s'applique un maximum de 3 / 4 / 5 fois, si l'effet est positif il prend effet sur la cible de l'attaque sinon sur l'attaquant."
  },
  {
    "num": 24,
    "vulgar": "Résonance",
    "latin": "Sono (Ressonnance)",
    "arcane": "Munsona (Mun + sona)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "4",
    "drain": "4",
    "keys": "🛡️ Guerre: Munsonaorr",
    "description": "Génère un enchantement négatif qui produit les effets d'un autre [mot de pouvoir] à chaque fois qu'une attaque est porté par un adversaire sur la cible, l'effet en question dispose d'une puissance de [Magnitude/2] / [Magnitude/3] / [Magnitude/4] et s'applique un maximum de 3 / 4 / 5 fois, si l'effet est positif il prend effet sur la cible de l'attaque sinon sur l'attaquant."
  },
  {
    "num": 25,
    "vulgar": "Imprégnation",
    "latin": "Imbueo (Imprégner)",
    "arcane": "Malimbu (Mal + imbu)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🔮 Magie: Malimbuirn",
    "description": "Génère un enchantement négatif qui réduit la difficulté arcanique des sorts lancés par la cible de [Magnitude/5]."
  },
  {
    "num": 26,
    "vulgar": "Pistage",
    "latin": "Vestigium (Trace)",
    "arcane": "Morvesti (Mor + vesti)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "👁️ Vision: Morvesti eth",
    "description": "Génère un enchantement négatif qui permet au lanceur de sort de connaitre la position de la cible à tout moment sur une distance maximale de [Magnitude x100]."
  },
  {
    "num": 27,
    "vulgar": "Contradiction",
    "latin": "Contra (Contre)",
    "arcane": "Mugcontra (Mug + contra)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "4",
    "drain": "4",
    "keys": "🩸 Impie: Mugcontraun",
    "description": "Génère un enchantement négatif qui force la cible à relancer tous les dés d'un test si le total de ces derniers est supérieur à [18 - Magnitude/4] puis il conserve le moins bon des deux, cet effet peux avoir lieu jusqu'à 3 fois."
  },
  {
    "num": 28,
    "vulgar": "Suggestion",
    "latin": "Subgero (Porter)",
    "arcane": "Munsubger (Mun + subger)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚜️ Charme: Munsubgerynh",
    "description": "Génère un enchantement négatif qui rend la cible moins difficulté à persuader/convaincre, la difficulté est réduite de [Magnitude/5]."
  },
  {
    "num": 29,
    "vulgar": "Domestication",
    "latin": "Domus (Maison)",
    "arcane": "Maldos (Mal + dos)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🐗 Faune: Maldosorh",
    "description": "Génère un enchantement négatif qui rend la cible moins difficulté à approcher/domestiquer/dresser/autre, la cible doit être issus du règne animal, la difficulté est réduite de [Magnitude/4]."
  },
  {
    "num": 30,
    "vulgar": "Ralentissement",
    "latin": "Tardus (Lent)",
    "arcane": "Mortard (Mor + tard)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "💢 Vide: Mortardarh",
    "description": "Génère un enchantement négatif qui octroie à la cible un malus de [Magnitude/5] à son initiative, cette altération de valeurs est appliquée au moment où l'enchantement est lancé puis à chaque début de tours."
  },
  {
    "num": 31,
    "vulgar": "Incandescence",
    "latin": "Candeo (Être blanc ardent)",
    "arcane": "Mugcand (Mug + cand)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🔥 Feu: Mugcandar",
    "description": "Génère un enchantement négatif qui chauffe un objet composé en partie ou entièrement de métal à blanc, l'utilisation de l'objet induit une pénalité équivalante à [Magnitude/5], à la fin de son tour si la cible porte encore l'objet elle reçoit des dégats (physique, feu) (localisé là où se trouve l'objet) équivalants à [Magnitude/2]."
  },
  {
    "num": 32,
    "vulgar": "Provocation",
    "latin": "Voco (Appeler)",
    "arcane": "Munvoco (Mun + voco)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚜️ Charme: Munvocoynh",
    "description": "Génère un enchantement négatif qui force la cible à s'en prendre en priorité à une autre cible au choix du lanceur de sort (ce peut être lui même), la seconde cible peux être à portée de vue, à chaque fois qu'elle souhaite contrevenir à cet la cible peux réaliser un test de sauvegarde (vs détermination) pour tenter d'échapper à la contrainte, elle n'a pas conscience d'être ainsi manipulée sauf si elle réussit à se dégager de la contrainte et réussit à un test de concentration, la cible peux être contrainte pour un maximum de [Magnitude/4] actions si la cible n'est pas une cible naturelle pour elle (il s'agit d'un allié ou autre)."
  },
  {
    "num": 33,
    "vulgar": "Coercition",
    "latin": "???",
    "arcane": "???",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚜️ Charme: Maltimoynh",
    "description": "Génère un enchantement négatif qui force la cible à ignorer une autre cible au choix du lanceur de sort (ce peut être lui même), la seconde cible peux être à portée de vue, à chaque fois qu'elle souhaite contrevenir à cet la cible peux réaliser un test de sauvegarde (vs détermination) pour tenter d'échapper à la contrainte, elle n'a pas conscience d'être ainsi manipulée sauf si elle réussit à se dégager de la contrainte et réussit à un test de concentration, la cible peux être contrainte pour un maximum de [Magnitude/4] actions si la cible n'est pas une cible naturelle pour elle (il s'agit d'un allié ou autre)."
  },
  {
    "num": 34,
    "vulgar": "Adoration",
    "latin": "Oro (Prier)",
    "arcane": "Mororo (Mor + oro)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚜️ Charme: Mororo ynh",
    "description": "Génère un enchantement négatif qui force la cible à aider une autre cible au choix du lanceur de sort (ce peut être lui même), la seconde cible peux être à portée de vue, à chaque fois qu'elle souhaite contrevenir à cet la cible peux réaliser un test de sauvegarde (vs détermination) pour tenter d'échapper à la contrainte, elle n'a pas conscience d'être ainsi manipulée sauf si elle réussit à se dégager de la contrainte et réussit à un test de concentration, la cible peux être contrainte pour un maximum de [Magnitude/4] actions si la cible n'est pas une cible naturelle pour elle (il s'agit d'un allié ou autre)."
  },
  {
    "num": 35,
    "vulgar": "Statuefaction",
    "latin": "Status (Position)",
    "arcane": "Mugstatu (Mug + statu)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "4",
    "drain": "4",
    "keys": "🪨 Terre: Mugstatuum, ❄️ Glace: Mugstatuis",
    "description": "Génère un enchantement négatif qui statufie la cible en formant une couche solide autour d'elle, la cible n'est plus en mesure d'agir sauf pour tenter de briser l'effet du sort via un test de musculation, évasion ou autre moyen logique (voir magiques) contre la difficulté arcanique du sort, en cas de réussite la charge du sort est réduite d'autant que le jet (catégorie 0 + degré de réussite), tant que la cible est affecté les dégats qu'elle reçoit sont infligés aux charges à la place (réduit comme le serait des dégats opposés à une structure de catégorie égale au niveau du sort)."
  },
  {
    "num": 36,
    "vulgar": "Porosité",
    "latin": "???",
    "arcane": "???",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🔥 Feu: Munfrangiar, ❄️ Glace: Munfrangiis, ⚡ Foudre: Munfragior",
    "description": "Génère un enchantement négatif qui fragilise l'objet ciblé, ce dernier réalisant ses test de solidité avec une pénalité de [Magnitude/5]."
  },
  {
    "num": 37,
    "vulgar": "Détérioration",
    "latin": "Peior (Pire)",
    "arcane": "Malpeior (Mal + peior)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "💢 Vide: Malpeiorarh",
    "description": "Génère un enchantement négatif qui fragilise l'objet ciblé, ce dernier réalisant un test de solidité chaque fois qu'il est sollicité pour un test ou tout autre action/choc/usage (example l'armure si touché par une attaque, etc), chaque occurence provoque une décharge de cet effet."
  },
  {
    "num": 38,
    "vulgar": "Dislocation",
    "latin": "???",
    "arcane": "???",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "☠️ Mort: Morgrexaus, 🧩 Mental: Morgrexaend",
    "description": "Génère un enchantement négatif qui double les pénalités issus des lésions (dont la nature dépends de la [clé]) pour un maximum (d'augmentation) de [Magnitude/10]."
  },
  {
    "num": 39,
    "vulgar": "Défalcation",
    "latin": "Falx (Faux)",
    "arcane": "Mugfalx (Mug + falx)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "☠️ Mort: Mugfalxus, 🧩 Mental: Mugfalxend",
    "description": "Génère un enchantement négatif qui augmente les dégats et l'impact (dont la nature dépends de la [clé])  reçus par la cible d'autant que le triple de ses pénalités de lésions (dont la nature dépends de la [clé])  pour un maximum de [Magnitude/4], cet effet ne peux pas augmenter les dégats de plus de leur moitié."
  },
  {
    "num": 40,
    "vulgar": "Découverte",
    "latin": "???",
    "arcane": "???",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🛡️ Guerre: Munvulneorr, 🧩 Mental: Munvulneend",
    "description": "Génère un enchantement négatif qui augmente les dégats (dont la nature dépends de la [clé])  d'un tier, pour un maximum [Magnitude/5]."
  },
  {
    "num": 41,
    "vulgar": "Inhibition",
    "latin": "Habeo (Tenir, retenir)",
    "arcane": "Malhabeo (Mal + habeo)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🛡️ Guerre: Malhabeorr, 🧩 Mental: Malhabeend",
    "description": "Génère un enchantement négatif qui réduit les dégats et l'impact (dont la nature dépends de la [clé]) infligé par la cible d'autant que le triple de ses pénalités de lésions (dont la nature dépends de la [clé]) pour un maximum de [Magnitude/4], cet effet ne peux pas être réduits de plus de leur moitié."
  },
  {
    "num": 42,
    "vulgar": "Atrophiation",
    "latin": "Atro (Noir)",
    "arcane": "Moratro (Mor + atro)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🛡️ Guerre: Moratroorr",
    "description": "Génère un enchantement négatif qui réduit de moitié la génération de ressources temporaires tel que rage, garde et adrénaline, avec un maximum de [Magnitude/2], réduit également le maximum de ces ressources de [Magnitude/4]."
  },
  {
    "num": 43,
    "vulgar": "Débilitation",
    "latin": "Debilito (Affaiblir)",
    "arcane": "Mugdebil (Mug + debil)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🛡️ Guerre: Mugdebilorr, 🐗 Faune: Mugdebilorh, 🧩 Mental: Mugdebilend",
    "description": "Génère un enchantement négatif qui inflige un malus d'attribut de [Magnitude/5] lors des tests d'attaque via arme non naturelle (clé acier) ou arme naturelle (clé faune) ou joute (clé mental) de la cible."
  },
  {
    "num": 44,
    "vulgar": "Affaissement",
    "latin": "Cado (Tomber)",
    "arcane": "Muncado (Mun + cado)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🛡️ Guerre: Muncadoorr, 🐗 Faune: Muncadoorh, 🧩 Mental: Muncadoend",
    "description": "Génère un enchantement négatif qui inflige un malus d'attribut de [Magnitude/5] lors des tests de défense via arme non naturelle (clé acier) ou arme naturelle (clé faune) ou joute (clé mental) de la cible."
  },
  {
    "num": 45,
    "vulgar": "Désorganisation",
    "latin": "Ordo (Ordre)",
    "arcane": "Malordo (Mal + ordo)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🛡️ Guerre: Malordoorr, 🐗 Faune: Malordoorh, 🧩 Mental: Malordoend",
    "description": "Génère un enchantement négatif qui inflige un malus d'attribut de [Magnitude/5] lors des tests tactiques via arme non naturelle (clé acier) ou arme naturelle (clé faune) ou joute (clé mental) de la cible."
  },
  {
    "num": 46,
    "vulgar": "Entravation",
    "latin": "Impedio (Empêcher)",
    "arcane": "Morimped (Mor + imped)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🛡️ Guerre: Morimpedorr, 🧩 Mental: Morimpedend, 🔮 Magie: Morimpedirn",
    "description": "Génère un enchantement négatif qui augmente de [Magnitude/10] les pénalités des manoeuvres physiques (clé acier), mentales (clé mental) ou incantatoires (clé magie) de la cible, au mieux double les pénalités mais guère plus."
  },
  {
    "num": 47,
    "vulgar": "Minoration",
    "latin": "Minor (Plus petit)",
    "arcane": "Mugminor (Mug + minor)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🛡️ Guerre: Mugminororr, 🧩 Mental: Mugminorend",
    "description": "Génère un enchantement négatif qui réduit de moitié la déviation physique ou mentale (selon clé) générée par un blocage ou une parade d'ordre physique ou mental (selon clé), maximum [Magnitude/3]."
  },
  {
    "num": 48,
    "vulgar": "Souillure",
    "latin": "???",
    "arcane": "???",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🔮 Magie: Munprofanirn",
    "description": "Génère un enchantement négatif qui réduit de [Magnitude/5] le seuil à la corruption."
  },
  {
    "num": 49,
    "vulgar": "Contamination",
    "latin": "Tamino (Souiller)",
    "arcane": "Maltamin (Mal + tamin)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🔮 Magie: Maltaminirn",
    "description": "Génère un enchantement négatif qui augmente de [Magnitude/7] la corruption générée par chaque enchantements actifs sur la cible."
  },
  {
    "num": 50,
    "vulgar": "Naturalisation",
    "latin": "Natura (Nature)",
    "arcane": "Mornatur (Mor + natur)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🪷 Nature: Mornatureiln",
    "description": "Génère un enchantement négatif qui force la cible à utiliser ses sauvegardes normales et non l'opposition lorsqu'il s'agit de la magie, le sort doit être de niveau 2."
  },
  {
    "num": 51,
    "vulgar": "Asphyxiation",
    "latin": "Spiritus (Souffle)",
    "arcane": "Mugspira (Mug + spira)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🪷 Nature: Mugspiraeiln",
    "description": "Génère un enchantement négatif qui réduit la réunion de mana de [Magnitude/3], de plus faire appel à cet action requière la dépense supplémentaire de [Magnitude/10] points d'initiative."
  },
  {
    "num": 52,
    "vulgar": "Mascarade",
    "latin": "Masca (Fantôme)",
    "arcane": "Munmasca (Mun + masca)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "4",
    "drain": "4",
    "keys": "🎭 Illusion: Munmascain",
    "description": "Génère un enchantement négatif qui inverse l'utilisation des attributs du corps et de l'esprit : Chaque fois qu'une cible dans la zone doit utiliser un attribut dans un test (action, sauvegarde, etc) il est obligé d'employer son équivalant du corps ou de l'esprit à la place, cet effet ne peux être maintenu et sa décharge est doublée (10), un test de sauvegarde (vs détermination) réussie permet de se soustraire à cet effet (à chaque tests)."
  },
  {
    "num": 53,
    "vulgar": "Dysfonctionnement",
    "latin": "Functus (Fonction)",
    "arcane": "Maldysfu (Mal + dysfu)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "✡️ Arcane: Maldysfuys",
    "description": "Génère un enchantement négatif qui augmente de [Magnitude]% les risques liés à l'usage/déclanchement d'un appareil technologique."
  },
  {
    "num": 54,
    "vulgar": "Infection",
    "latin": "Tinguo (Teindre, imprégner)",
    "arcane": "Mortingo (Mor + tingo)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "☢️ Toxique: Mortingoex",
    "description": "Génère un enchantement négatif, à chaque fois que la cible reçoit des dégats mettez un marqueur avant la résolution des dégats, puis augmentez les dégats reçus de [Magnitude/10] par marqueurs acquis, maximum 5 marqueurs."
  },
  {
    "num": 55,
    "vulgar": "Flétrissement",
    "latin": "Marceo (Se flétrir)",
    "arcane": "Mugmarce (Mug + marce)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🌿 Flore: Mugmarceiln",
    "description": "Génère un enchantement négatif, à chaque début de tour la cible reçoit un marqueur, réduit un attribut principal au choix de [Magnitude/20] par marqueurs."
  },
  {
    "num": 56,
    "vulgar": "Vulnérable",
    "latin": "Laedo (Blesser)",
    "arcane": "Munlaedo (Mun + laedo)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🔥 Feu: Munlaedoar, ❄️ Glace: Munlaedois, ⚡ Foudre: Munlaedoor, 🪨 Terre: Munlaedoum, 💧 Eau: Munlaedoyn, 🌪️ Air: Munlaedoel, ☠️ Mort: Munlaedous, ✡️ Arcane: Munlaedoys, ☢️ Toxique: Munlaedoex, ⚔️ Acier: Munlaedoan, 🌿 Flore: Munlaedoiln, 🎭 Illusion: Munlaedoin, ⚖️ Loi: Munlaedoem, 🌀 Chaos: Munlaedoix, ✨ Sacre: Munlaedoiel, 🩸 Impie: Munlaedoun, 🧩 Mental: Munlaedoend, ☀️ Lumière: Munlaedoion, 🌑 Ombre: Munlaedooth, 💢 Vide: Munlaedoarh",
    "description": "Génère un enchantement négatif qui augmente de [Magnitude/3] les dégats réalisés sur la cible si ils sont issus d'élément contre lequel la [clé] utilisée est faible."
  },
  {
    "num": 57,
    "vulgar": "Irritation",
    "latin": "???",
    "arcane": "???",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚔️ Acier: Malintensen (Mêlée), ⚔️ Acier: Malintensen (Tir), 🧩 Mental: Malintensend (Mental), ✡️ Arcane: Malintensys (Magique), 🐗 Faune: Malintensorh (Naturel)",
    "description": "Génère un enchantement négatif qui augmente de un tiers les dégats reçu par la cible d'un type (selon la [clé] utilisée) avec un maximum de [Magnitude/3]."
  },
  {
    "num": 58,
    "vulgar": "Contraction",
    "latin": "Traho (Tirer)",
    "arcane": "Mortract (Mor + tract)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🌑 Ombre: Mortractoth",
    "description": "Génère un enchantement négatif qui réduit la plage singularité de la cible de 1 / 2, à chaque fois que cet effet permet une singularité l'enchantement subit une décharge / double décharge."
  },
  {
    "num": 59,
    "vulgar": "Dilatation",
    "latin": "Latus (Large)",
    "arcane": "Muglatus (Mug + latus)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🌑 Ombre: Muglatusoth",
    "description": "Génère un enchantement négatif qui augmente la plage singularité contre la cible de 1 / 2, à chaque fois que cet effet permet une singularité l'enchantement subit une décharge / double décharge."
  },
  {
    "num": 60,
    "vulgar": "Pénalisation",
    "latin": "Poena (Peine)",
    "arcane": "Munpoen (Mun + poen)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚖️ Loi: Munpoenem",
    "description": "Génère un enchantement négatif qui augmente octroie un malus de [Magnitude/5] lors d'une singularité (positive ou négative)."
  },
  {
    "num": 61,
    "vulgar": "Prohibition",
    "latin": "???",
    "arcane": "???",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚖️ Loi: Malvetoem",
    "description": "Génère un enchantement négatif qui interdit à la cible de réaliser une action définit au moment où le sort est lancé, la cible peux réaliser un test de sauvegarde (détermination) pour outrepasser cette interdiction : sur une réussite elle le peux mais avec un désavantage, sur un échec elle ne le peux pas, sur un échec critique elle perd son action en prime, sur une réussite critique elle le peux sans désavantage, à chaque fois que la cible réaliser un test de sauvegarde l'enchantement subit une décharge."
  },
  {
    "num": 62,
    "vulgar": "Désagrégation",
    "latin": "Cresco (Croître)",
    "arcane": "Morcres (Mor + cres)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "☢️ Toxique: Morcresex",
    "description": "Génère un enchantement négatif qui provoque une double décharge des conditions de rupture de la cible, chaque occurence provoquant une décharge de cet enchantement ci."
  },
  {
    "num": 63,
    "vulgar": "Dégradation",
    "latin": "Lapsus (Chute)",
    "arcane": "Mugdegrad (Mug + degrad)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "Mugdegradex",
    "description": "Génère un enchantement négatif qui réduit une sauvegarde au choix (dont le type dépends de la [clé]) de [Magnitude/5] (esprit, corps, loi, nature, arcane)."
  },
  {
    "num": 64,
    "vulgar": "Fragilisation",
    "latin": "Frangere (Briser)",
    "arcane": "Munfreg (Mun + freg)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "☢️ Toxique: Munfregex",
    "description": "Génère un enchantement négatif qui réduit toutes les sauvegardes de [Magnitude/10]."
  },
  {
    "num": 65,
    "vulgar": "Amputation",
    "latin": "Puto (Élaguer)",
    "arcane": "Malputo (Mal + puto)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "Malputoex",
    "description": "Génère un enchantement négatif qui réduit le maximum d'une ressource au choix (dont le type dépends de la [clé]) de [Magnitude/2], les ressources actuelles dépensant le nouveau maximum sont perdues (clé selon ressources négatives)."
  },
  {
    "num": 66,
    "vulgar": "Appauvrissement",
    "latin": "Pauper (Pauvre)",
    "arcane": "Morpaupe (Mor + paupe)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "☠️ Mort: Morpaupeus (PV), 🧩 Mental: Morpaupeend (PS), ⚖️ Loi: Morpaupeem (PK), ⚕️ Corps: Morpaupeen (PC), 🧠 Esprit: Morpaupeys (PC), ✡️ Arcane: Morpaupeys (PM), 🪷 Nature: Morpaupeeiln (PE/fatigue)",
    "description": "Génère un enchantement négatif qui réduit le maximum de toutes les ressources de [Magnitude/4], les ressources actuelles dépensant le nouveau maximum sont perdues."
  },
  {
    "num": 67,
    "vulgar": "Drainement",
    "latin": "Haurio (Puiser)",
    "arcane": "Mughaur (Mug + haur)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "☢️ Toxique: Mughaurex",
    "description": "Génère un enchantement négatif qui réduit toutes les ressources (actuelles) de la cible de [Magnitude/10] à chaque début de tour."
  },
  {
    "num": 68,
    "vulgar": "Affliction",
    "latin": "Fligo (Frapper)",
    "arcane": "Munfligo (Mun + fligo)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚕️ Corps: Munfligoen (FOR, CON, DEX, AGI, PER), 🧠 Esprit: Munfligoys (CHA, VOL, INT, RUS, SAG), 🌀 Chaos: Munfligoix (CHN), 🪷 Nature: Munfligoeiln (EQU)",
    "description": "Génère un enchantement négatif qui réduit un attribut (au choix selon la [clé]) de [Magnitude/5]."
  },
  {
    "num": 69,
    "vulgar": "Réduction",
    "latin": "Reduco (Ramener)",
    "arcane": "Malredu (Mal + redu)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "TODO : Liste des domaines avec caractéristiques",
    "description": "Produit un enchantement négatif qui réduit une caractéristique (dont la nature dépends de la [clé]) de [Magnitude/5]."
  },
  {
    "num": 70,
    "vulgar": "Déqualification",
    "latin": "Qualis (Qualité)",
    "arcane": "Morquali (Mor + quali)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🛡️ Guerre: Morqualiorr (Combat, Défense, Tactique, Archerie, Corps à corps), ⚕️ Corps: Morqualien (Athlétisme, Gymnastique, Discipline), 👁️ Vision: Morqualieth (Acuité), ✡️ Arcane: Morqualiys (Arcanes), 🔮 Magie: Morqualiirn (Chasse, Survie Rurale, Survie urbaine, Discrétion, Larçin, Sagacité, Subterfuge), ⚜️ Charme: Morqualiynh (Argumentation, Résolution, Manipulation, Art, Eloquence), 🧠 Esprit: Morqualiys (Artisanat, Profession, Savoir être, Savoir faire), 📚 Savoir: Morqualiaum (Langue, Enquête, Erudition, Stratégie, Guérison, Commerce)",
    "description": "Produit un enchantement négatif qui réduit une compétence (dont la nature dépends de la [clé]) de [Magnitude/5]."
  },
  {
    "num": 71,
    "vulgar": "Pérennisation",
    "latin": "Perennis (Durable)",
    "arcane": "Mugperen (Mug + peren)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🪷 Nature: Mugpereneiln",
    "description": "Génère un enchantement négatif qui maintient les conditions négatives sur la cible, cet enchantement ne peux pas être maintenu."
  },
  {
    "num": 72,
    "vulgar": "Privation",
    "latin": "Privo (Enlever)",
    "arcane": "Munprivo (Mun + privo)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "👁️ Vision: Munprivoeth",
    "description": "Génère un enchantement négatif qui bloque un ou tous les sens de la cible (au choix au lancement du sort) sur une distance supérieur à [Perception de la cible x 2] moins [Magnitude] mètres, si l'effet n'affecte qu'un seul sens la cible est désavantagé à son test de sauvegarde, si l'effet affecte tous les sens la magnitude est divisée par 2."
  },
  {
    "num": 73,
    "vulgar": "Duperie",
    "latin": "Fraus (Fraude)",
    "arcane": "Malfrau (Mal + frau)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚜️ Charme: Malfrauy nh (l'un ou l'autre), ⚖️ Loi: Malfrau em (vérité), 🌀 Chaos: Malfrauix (mensonge)",
    "description": "Produit un enchantement négatif qui force la cible à dire la vérité ou à mentir (au choix au lancement du sort), la cible ou ceux qui l'écoute doivent réussir un test d'intuition pour se rendre compte que quelque chose ne va pas avec les propos en question puis réussir un test de compétence pour comprendre que quelque chose altère les propos (voir en comprendre le sens réel sur un critique)."
  },
  {
    "num": 74,
    "vulgar": "Obsession",
    "latin": "Sedeo (Être assis)",
    "arcane": "Morobsid (Mor + obsid)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🎭 Illusion: Morobsidin",
    "description": "Produit un enchantement négatif qui pousse la cible à imaginer des menaces qui n'existent pas et qui proviennent de ses propres peurs (le lanceur de sort ne décide pas de la nature de ces Illusions donc), la cible peux réussir un test d'intuition pour se rendre compte que quelque chose ne va pas avec une Illusion et un test de compétence pour comprendre la supercherie (comme pour toutes Illusions), cependant cet enchantement génère une nouvelle Illusion à chaque fois que l'une d'entre elle est obsolète, si la cible a des phobies elles sont mises en avant en premier."
  },
  {
    "num": 75,
    "vulgar": "Distraction",
    "latin": "Traho (Tirer)",
    "arcane": "Mugdistra (Mug + distra)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚜️ Charme: Mugdistraynh",
    "description": "Génère un enchantement négatif qui rend la cible plus marquante, les autres sont prompt à s'interroger sur sa présence quel que soit l'environnement (chargé ou pas), octroyant un malus de [Magnitude/4] aux tests visant à échapper à l'attention des autres, voir à la menace."
  },
  {
    "num": 76,
    "vulgar": "Déclassement",
    "latin": "Classis (Classe)",
    "arcane": "Mundclas (Mun + dclas)",
    "word_type": "Pouvoir",
    "target_type": "Cible (objet)",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚔️ Acier: Mundclasan",
    "description": "Génère un enchantement négatif qui réduit la catégorie effective de la cible (arme, outils ou armure) de [Magnitude/10], notons que le changement de catégorie (à la baisse) implique entre autre des pénalités d'usages inférieures."
  },
  {
    "num": 77,
    "vulgar": "Alourdissement",
    "latin": "Pondus (Poids)",
    "arcane": "Malpondu (Mal + pondu)",
    "word_type": "Pouvoir",
    "target_type": "Cible (objet)",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚔️ Acier: Malponduan",
    "description": "Génère un enchantement négatif qui double les pénalités d'usage de la cible (arme, outils ou armure) avec un maximum de [Magnitude/10]."
  },
  {
    "num": 78,
    "vulgar": "Usure",
    "latin": "Rodo (Ronger)",
    "arcane": "Morerode (Mor + erode)",
    "word_type": "Pouvoir",
    "target_type": "Cible (objet)",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚔️ Acier: Morerodean",
    "description": "Génère un enchantement négatif qui double la déterioration que subit l'objet, tous les 2 points augmentés de cet manière réduisent la charge de cet enchantement de 1."
  },
  {
    "num": 79,
    "vulgar": "Effritement",
    "latin": "Fritus (Brisé)",
    "arcane": "Mugfrite (Mug + frite)",
    "word_type": "Pouvoir",
    "target_type": "Cible (objet)",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚔️ Acier: Mugfritean",
    "description": "Génère un enchantement négatif qui éffrite l'objet ciblé, ce dernier subissant un malus de solidité de [Magnitude/5]."
  },
  {
    "num": 80,
    "vulgar": "Amoindrissement",
    "latin": "???",
    "arcane": "???",
    "word_type": "Pouvoir",
    "target_type": "Cible (objet)",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚔️ Acier: Munfirmuan",
    "description": "Génère un enchantement négatif qui fragilise l'objet ciblé, ce dernier réalisant ses test de solidité avec un malus de [Magnitude/3]."
  },
  {
    "num": 81,
    "vulgar": "Fracturation",
    "latin": "Frango (Briser)",
    "arcane": "Malafran (Mal + afran)",
    "word_type": "Pouvoir",
    "target_type": "Cible (objet)",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚔️ Acier: Malafranan",
    "description": "Génère un enchantement négatif qui émousse l'objet ciblé, ce dernier imposant des test de solidité réduits de [Magnitude/3]."
  },
  {
    "num": 82,
    "vulgar": "Obturation",
    "latin": "Obturo (Boucher)",
    "arcane": "Morobtur (Mor + obtur)",
    "word_type": "Pouvoir",
    "target_type": "Cible (objet)",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚔️ Acier: Morobtu ran",
    "description": "Génère un enchantement négatif qui rend l'objet cassant, ce dernier subissant la moitié de ses jets à chaque usage sous forme de détérioration, maximum [Magnitude/3]."
  },
  {
    "num": 83,
    "vulgar": "Oblitération",
    "latin": "Littera (Lettre)",
    "arcane": "Muglitera (Mug + litera)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "📚 Savoir: Mugliteraaum",
    "description": "Génère un enchantement négatif qui réduit la mémoire de la cible de [Magnitude/4], tout ce qui a été appris en dernier et qui ne rentre plus dans la mémoire actuelle est considéré comme oublié du temps de l'enchantement, de plus la cible oublie un nombre d'élément clé (de nature très précise) équivalant au malus (par example l'existance d'une clé, ou ce qu'il était en train de faire bien que cela ne l'empêche pas de vouloir faire la chose si son raisonnement l'y amène)."
  },
  {
    "num": 84,
    "vulgar": "Interdiction",
    "latin": "Arceo (Arcer)",
    "arcane": "Munarceo (Mun + arceo)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚖️ Loi: Munarceoem",
    "description": "Génère un enchantement négatif qui impose une pénalité de [Magnitude/4] aux actions visant à agresser une cible (attaque ou tactique, mais pas uniquement, c'est au MD de trancher si une action constitue une agression ou non)."
  },
  {
    "num": 85,
    "vulgar": "Rétribution",
    "latin": "Tribuo (Donner)",
    "arcane": "Maltribu (Mal + tribu)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "✨ Sacre: Maltribuiel",
    "description": "Génère un enchantement négatif qui inflige des dégats temporaires (ignorant toute défenses) équivalant à [Magnitude/3] si la cible entreprend une action visant à agresser une cible (attaque ou tactique, mais pas uniquement, c'est au MD de trancher si une action constitue une agression ou non)."
  },
  {
    "num": 86,
    "vulgar": "Contrariation",
    "latin": "Contrarius (Contraire)",
    "arcane": "Morcontra (Mor + contra)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🔥 Feu: Morcontraar (défense), ❄️ Glace: Morcontrais (attaque), ⚡ Foudre: Morcontraor (tactique)",
    "description": "Génère un enchantement négatif qui octroie un malus aux jets des actions dont la nature dépends de la clé de [Magnitude/3], chaque occurence provoque une décharge de l'enchantement."
  },
  {
    "num": 87,
    "vulgar": "Précipitation",
    "latin": "Precipito (Lancer)",
    "arcane": "Mugpreci (Mug + preci)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚡ Foudre: Mugprecior",
    "description": "Génère un enchantement négatif qui inflige des dégats temporaires (ignorant toute défenses) équivalant à [Magnitude/3] à la cible à la fin de n'importe quel tour où la cible n'a pas entrepris d'action de déplacement profitant de l'aLure."
  },
  {
    "num": 88,
    "vulgar": "Déprécation",
    "latin": "Precor (Prier)",
    "arcane": "Munprec (Mun + prec)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🔥 Feu: Munprecar, ❄️ Glace: Munprecis, ⚡ Foudre: Munprecor, 🪨 Terre: Munprecum, 💧 Eau: Munprecyn, 🌪️ Air: Munprecel, ☀️ Lumière: Munprecion, 🌑 Ombre: Munprecoth, ⚖️ Loi: Munprecem, 🌀 Chaos: Munprecix, ✨ Sacre: Munpreciel, 🩸 Impie: Munprecun, ❤️ Vie: Munprecir, ☠️ Mort: Munprecus, ⚕️ Corps: Munprece n, 🧠 Esprit: Munprecys, 🐗 Faune: Munprecorh, 🌿 Flore: Munpreciln, 🧩 Mental: Munprecend, ⚜️ Charme: Munprecynh, ✡️ Arcane: Munprecys, 🔮 Magie: Munprecirn, 🪷 Nature: Munpreceiln, ☢️ Toxique: Munprecex, 🎭 Illusion: Munprecin, 📚 Savoir: Munprecaum, 👁️ Vision: Munpreceth, ⚔️ Acier: Munprecan, 🛡️ Guerre: Munprecorr, 💢 Vide: Munprecarh",
    "description": "Génère un enchantement négatif qui octroie à la cible des pénalités très marquée contre un élément donné, cela se traduit par une réduction de [Magnitude/4] en absorption, [Magnitude/6] en protection et [Magnitude/6] de malus aux sauvegardes."
  },
  {
    "num": 89,
    "vulgar": "Abdication",
    "latin": "Dico (Dire)",
    "arcane": "Malabdi (Mal + abdi)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚜️ Charme: Malabdiy nh",
    "description": "Génère un enchantement négatif qui résigne la cible à ne plus intervenir dans une confrontation, elle ne se laisse pas faire mais ne s'implique plus non plus, cet effet s'applique si la cible a moins de [Magnitude] d'endurance et des pénalités de lésions cumulées supérieurs à 8 - [Magnitude/5]."
  },
  {
    "num": 90,
    "vulgar": "Réprobation",
    "latin": "Reprobus (Réprouvé)",
    "arcane": "MoRepro (Mor + repro)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "☠️ Mort: MoReprous",
    "description": "Génère un enchantement négatif qui duplique les lésions physiques en lésions mentales ou les lésions mentales en lésions physiques, les copies ne peuvent dépasser un total de gravité de [Magnitude] ni être individuellement d'un niveau de gravité supérieure à [Magnitude/7]."
  },
  {
    "num": 91,
    "vulgar": "Dégénération",
    "latin": "Gigno (Engendrer)",
    "arcane": "Mugdegen (Mug + degen)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "☠️ Mort: Mugdegenus (PV), 🧩 Mental: Mugdegenend (PS), ⚖️ Loi: Mugdegenem (PK), ⚕️ Corps: Mugdegenen (PC), 🧠 Esprit: Mugdegenys (PC), ✡️ Arcane: Mugdegenys (PM), 🪷 Nature: Mugdegeneiln (PE/fatigue)",
    "description": "Produit un enchantement négatif qui réduit à chaque tour [Magnitude/5] points de ressources (selon la clé)."
  },
  {
    "num": 92,
    "vulgar": "Intensification",
    "latin": "Vehemens (Violent)",
    "arcane": "Munvehe (Mun + vehe)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🩸 Impie: Munveheun",
    "description": "Génère un enchantement négatif augmentant les effets des conditions négatives dont les charges sont inférieures à [Magnitude] sur la cible (les conditions normales ont les effets de conditions améliorées et les conditions améliorées ont des effets encore améliorés d'un cran, si numériquement applicable)."
  },
  {
    "num": 93,
    "vulgar": "Blocage",
    "latin": "???",
    "arcane": "???",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🩸 Impie: Malneutun",
    "description": "Génère un enchantement négatif réduisant les effets des conditions positives dont les charges sont inférieures à [Magnitude] sur la cible (les conditions normales ne font plus  effet et les de conditions améliorées ont des effets normaux)."
  },
  {
    "num": 94,
    "vulgar": "Désacralisation",
    "latin": "Sacro (Rendre sacré)",
    "arcane": "Morsacro (Mor + sacro)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🩸 Impie: Morsacroun",
    "description": "Génère un enchantement négatif qui augmente de [Magnitude/10] le cout des relances en karma d'un même test."
  },
  {
    "num": 95,
    "vulgar": "Exaltation",
    "latin": "Altius (Plus haut)",
    "arcane": "Mugalt (Mug + alt)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🩸 Impie: Mugaltun",
    "description": "Génère un enchantement négatif qui réduit de [Magnitude/10] le cout des relances en karma d'un même test d'action visant à nuire à la cible."
  },
  {
    "num": 96,
    "vulgar": "Damnation",
    "latin": "Condemno (Condamner)",
    "arcane": "Mundamna (Mun + damna)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🩸 Impie: Mundamnaun",
    "description": "Génère un enchantement négatif qui réduit les sauvegardes contre les conditions négatives de [Magnitude/5]."
  },
  {
    "num": 97,
    "vulgar": "Vulnérisation",
    "latin": "Lacero (Déchirer)",
    "arcane": "Malliacer (Mal + liacer)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🩸 Impie: Malliacerun",
    "description": "Génère un enchantement négatif qui double les bénéfices d'une faiblesse élémentaire de la cible, avec un maximum de [Magnitude/2]."
  },
  {
    "num": 98,
    "vulgar": "Magnétisation",
    "latin": "Magnes (Aimant)",
    "arcane": "Mormagne (Mor + magne)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚡ Foudre: Mormagneor",
    "description": "Génère un enchantement négatif qui inflige [Magnitude/4] de dégats physique transperçant (ignore l'absorption) temporaires (PE puis PV) d'élément foudre à chaque fois que la cible de cet enchantement entre en contact avec un élément (surface, objet, etc) conducteur."
  },
  {
    "num": 99,
    "vulgar": "Electrification",
    "latin": "Electro (Ambre)",
    "arcane": "Mugelec (Mug + elec)",
    "word_type": "Pouvoir",
    "target_type": "Objet",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚡ Foudre: Mugelecor",
    "description": "Génère un enchantement négatif qui inflige [Magnitude/3] de dégats physique perçant (ignore la moitié de l'absorption) choquants (condition physique de choc, en état de choc si charge > PV actuelles) d'élément foudre à chaque fois qu'une personne entre en contact avec l'objet ciblé."
  },
  {
    "num": 100,
    "vulgar": "Carbonisation",
    "latin": "Carbo (Charbon)",
    "arcane": "Muncarbo (Mun + carbo)",
    "word_type": "Pouvoir",
    "target_type": "Objet",
    "difficulty": "2",
    "drain": "2",
    "keys": "🔥 Feu: Muncarboar",
    "description": "Génère un enchantement négatif qui inflige [Magnitude/4] de dégats physique transperçant (ignore l'absorption) temporaires (PE puis PV) d'élément foudre à chaque fois qu'une personne entre en contact avec l'objet ciblé, ou débute son tour en contact avec elle, ou a est en contact avec elle au moment où l'enchantement est lancé."
  },
  {
    "num": 101,
    "vulgar": "Érosion",
    "latin": "???",
    "arcane": "???",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "💢 Vide: Malfugi arh",
    "description": "Génère un enchantement négatif qui force les enchantements positifs affectants la cible de se décharger de [Magnitude/4] à la fin de chaque tour, maintenir l'enchantement ne permet pas d'éviter cette décharge."
  },
  {
    "num": 102,
    "vulgar": "Suractivation",
    "latin": "???",
    "arcane": "???",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "💢 Vide: Moramploarh",
    "description": "Génère un enchantement négatif qui force les enchantements négatifs affectants la cible de se recharger de [Magnitude/4] à la fin de chaque tour."
  },
  {
    "num": 103,
    "vulgar": "Révocation",
    "latin": "Voco (Appeler)",
    "arcane": "Mugvoca (Mug + voca)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚖️ Loi: Mugvocaem",
    "description": "Génère un enchantement négatif qui force la cible à relancer (l'ensemble d')un test affichant un exploit, chaque occurence provoque une décharge de l'enchantement."
  },
  {
    "num": 104,
    "vulgar": "Illumination",
    "latin": "Lumen (Lumière)",
    "arcane": "Munlumen (Mun + lumen)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "☀️ Lumière: Munlumenion",
    "description": "Génère un enchantement négatif qui rend la cible plus visible, réduisant la difficulté pour le percevoir visuellement de [Magnitude/4]."
  },
  {
    "num": 105,
    "vulgar": "Résonation",
    "latin": "Clamor (Clameur)",
    "arcane": "Malclam (Mal + clam)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "☀️ Lumière: Malclamion",
    "description": "Génère un enchantement négatif qui rend la cible plus bruyante, réduisant la difficulté pour l'entendre de [Magnitude/4]."
  },
  {
    "num": 106,
    "vulgar": "Émanation",
    "latin": "Mano (Couler, émaner)",
    "arcane": "Mormana (Mor + mana)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "☀️ Lumière: Mormanaion",
    "description": "Génère un enchantement positif qui rend la cible plus odorante et plus perceptible, réduisant la difficulté pour la sentir (odeur ou touché) de [Magnitude/4]."
  },
  {
    "num": 107,
    "vulgar": "Focalisation",
    "latin": "Focus (Foyer)",
    "arcane": "Mugfocus (Mug + focus)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "☀️ Lumière: Mugfocusion",
    "description": "Génère un enchantement négatif qui révèle la vraie nature de la cible, on parle ici du karma notament (alignement, etc), la vraie nature est alors plus simple à percevoir pour ceux qui en sont capable ou la cible ne peux se dérober à l'observation, la difficulté associée à son étude étant réduite de [Magnitude/4]."
  },
  {
    "num": 108,
    "vulgar": "Exposition",
    "latin": "Pono (Placer)",
    "arcane": "Munponi (Mun + poni)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "☀️ Lumière: Munponiion",
    "description": "Génère un enchantement négatif qui rend la cible moins difficile à dicerner avec précision, ses défenses passives sont réduites de [Magnitude/6]."
  },
  {
    "num": 109,
    "vulgar": "Divulgation",
    "latin": "???",
    "arcane": "???",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "☀️ Lumière: Malveloion",
    "description": "Créer un enchantement négatif qui réduit la capacité de la cible à se couvrir via des obstacles, le % de couverture est divisé par deux, avec une réduction maximale de [Magnitude]."
  },
  {
    "num": 110,
    "vulgar": "Limitation",
    "latin": "Limes (Limite)",
    "arcane": "Morlimes (Mor + limes)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🩸 Impie: Morlimesun",
    "description": "Génère un enchantement négatif qui réduit le maximum des dés de tous les jets de la cible de [Magnitude/8], avec un minimum ainsi modifié de 2 (pour ce qui est de cet enchantement en tout cas)."
  },
  {
    "num": 111,
    "vulgar": "Désoptimisation",
    "latin": "Optimus (Le meilleur)",
    "arcane": "Mugopti (Mug + opti)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🩸 Impie: Mugoptiun",
    "description": "Génère un enchantement négatif qui réduit le maximum des dés de tous les tests de la cible de [Magnitude/8], cet effet n'affecte que le premier lancé et donc pas les relances via karma, lorsque l'enchantement est lancé le lanceur de sort peux décider que cet effet affecte X relance en plus si il décide de réduire la Magnitude de 10 par X."
  },
  {
    "num": 112,
    "vulgar": "Perturbation",
    "latin": "Turbo (Troubler)",
    "arcane": "Munturb (Mun + turb)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚜️ Charme: Munturbynh",
    "description": "Génère un enchantement négatif qui rend la cible plus sensibles aux émotions négatives, impose un malus pour y résister de [Magnitude/3]."
  },
  {
    "num": 113,
    "vulgar": "Condamnation",
    "latin": "Condemno (Condamner)",
    "arcane": "Malconde (Mal + conde)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "☠️ Mort: Malcondeus",
    "description": "Génère un enchantement négatif qui attends la mort de la cible afin de déclencher les effets d'un autre [mot de pouvoir] avec la magnitude du sort qui doit être nécessairement un effet de dégats, l'effet a une rayon de 1m, le lanceur de sort peux décider de réduire la magnitude du sort de 1/5, 1/4 ou 1/3 afin de respectivement augmenter ce rayon à 2, 4 ou 8. Les dégats sont sujets aux règles de dégats de zone, etc..."
  },
  {
    "num": 114,
    "vulgar": "Déflagration",
    "latin": "Flagro (Brûler)",
    "arcane": "Morflagro (Mor + flagro)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "4",
    "drain": "2",
    "keys": "☠️ Mort: Morflagrous",
    "description": "Génère un enchantement négatif qui attends la mise hors d'état de la cible (PV <= 0) afin de déclencher les effets d'un autre [mot de pouvoir] avec les 2/3 de la magnitude du sort qui doit être nécessairement un effet de dégats, l'effet a une rayon de 1m, le lanceur de sort peux décider de réduire la magnitude du sort de 1/5, 1/4 ou 1/3 afin de respectivement augmenter ce rayon à 2, 4 ou 8. Les dégats sont sujets aux règles de dégats de zone, etc... La cible de l'enchantement est elle même affectée par le sort mais pour elle ce ne sont pas des dégats de zone."
  },
  {
    "num": 115,
    "vulgar": "Frustration",
    "latin": "Frustra (En vain)",
    "arcane": "Mugfrustr (Mug + frustr)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "☠️ Mort: Mugfrustrus",
    "description": "Génère un enchantement négatif qui ajoute aux lésions de la cible [Magnitude/3] de gravité, au mieux la gravité peux être ainsi doublée."
  },
  {
    "num": 116,
    "vulgar": "Insalubre",
    "latin": "Salus (Santé)",
    "arcane": "Munsalu (Mun + salu)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "☠️ Mort: Munsalus",
    "description": "Génère un enchantement négatif qui augmente la charge/gravité des toxines, maladies, poisons, etc... mais aussi des blessures de [Magnitude/4]."
  },
  {
    "num": 117,
    "vulgar": "Désacration",
    "latin": "Sacer (Sacré)",
    "arcane": "Malsacer (Mal + sacer)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "☠️ Mort: Malsacerus",
    "description": "Génère un enchantement négatif qui réduit de [Magnitude/5] le seuil à la corruption."
  },
  {
    "num": 118,
    "vulgar": "Extinction",
    "latin": "???",
    "arcane": "???",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "☢️ Toxique: Morfessuex",
    "description": "Génère un enchantement négatif qui réduit de [Magnitude/5] le seuil à la fatigue."
  },
  {
    "num": 119,
    "vulgar": "Accablement",
    "latin": "Premo (Presser)",
    "arcane": "Mugprema (Mug + prema)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "☠️ Mort: Mugpremaus",
    "description": "Génère un enchantement négatif qui augmente la valeurs actuel de fatigue de [Magnitude/5]."
  },
  {
    "num": 120,
    "vulgar": "Profanation",
    "latin": "PoLuo (Souiller)",
    "arcane": "MunpoLu (Mun + poLu)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "☠️ Mort: MunpoLuus",
    "description": "Génère un enchantement négatif qui augmente la valeurs actuel de corruption de [Magnitude/5]."
  },
  {
    "num": 121,
    "vulgar": "Hantation",
    "latin": "Umbra (Ombre)",
    "arcane": "Malumbra (Mal + umbra)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "☠️ Mort: Malumbraus",
    "description": "Génère un enchantement qui pousse un esprit à hanter la cible, cette dernière est alors plus sujette aux échecs critiques, le seuil d'échec requis pour ces derniers étant réduit de [Magnitude/4], minimum 0 (ce qui est équivalant à faire un échec critique sur le moindre échec), si une créature a été tuée par la cible et si son corps ou esprit est à proximité alors le lanceur de sort peux choisir cet esprit pour hanter la cible, les effets étant à la place base sur [Magnitude/4] le cas échéant ET une réussite affichant trop peu de marge peu échouer de manière critique."
  },
  {
    "num": 122,
    "vulgar": "Agonie",
    "latin": "Crux (Souffrance, croix)",
    "arcane": "Morcrux (Mor + crux)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "☠️ Mort: Morcruxus",
    "description": "Génère un enchantement qui provoque à la fin du tour une perte de PV équivalant à la somme des pénalités de blessure de la cible (pas la pénalité active mais la somme des pénalités des blessures), de même pour les PS et les traumas, cette perte a pour maximum [Magnitude/5] PV et/ou PS."
  },
  {
    "num": 123,
    "vulgar": "Sporulation",
    "latin": "Spargo (Répandre)",
    "arcane": "Mugspargo (Mug + spargo)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🌿 Flore: Mugspargoiln",
    "description": "Génère un enchantement qui octroie un malus d'ajustement à tous les tests effectés équivalant au niveau de spore actuel, les spores sont de 0 puis augmente de [Magnitude] à la fin du chaque tour, le niveau de spore est équivalant aux spores actuels divisés par 10. Les pénalités d'ajustement ne peuvent dépasser [Magnitude/5] de la sorte."
  },
  {
    "num": 124,
    "vulgar": "Immobilisation",
    "latin": "Resto (Rester)",
    "arcane": "Munresto (Mun + resto)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "💢 Vide: Munresto arh",
    "description": "Génère un enchantement négatif qui force la cible à perdre une de ses ACTS par round, chaque occurence provoque une décharge de l'enchantement (+2)."
  },
  {
    "num": 125,
    "vulgar": "Surgélation",
    "latin": "Gelo (Geler)",
    "arcane": "Malgelo (Mal + gelo)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "❄️ Glace: Malgelois",
    "description": "Génère un enchantement négatif qui force la cible à perdre son ACTL par round, chaque occurence provoque une décharge de l'enchantement."
  },
  {
    "num": 126,
    "vulgar": "Pétrification",
    "latin": "Petra (Roche)",
    "arcane": "Morpetra (Mor + petra)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🪨 Terre: Morpetraum",
    "description": "Génère un enchantement négatif qui emprisonne un membre de la cible, la [Magnitude] permet d'en mesurer l'intégrité, la cible peux réaliser une évaluation (diff 10) de musculation ou évasion (on considère que le jet endommage l'enchantement)."
  },
  {
    "num": 127,
    "vulgar": "Enchaînement",
    "latin": "Catena (Chaîne)",
    "arcane": "Mugcatena (Mug + catena)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "4",
    "drain": "4",
    "keys": "🪨 Terre: Mugcatenaum",
    "description": "Génère un enchantement négatif qui emprisonne l'ensemble de la cible, la [Magnitude] permet d'en mesurer l'intégrité, la cible peux réaliser une évaluation (diff 10) de musculation ou évasion (on considère que le jet endommage l'enchantement), tant que cet enchantement fait effet toutes attaques reçues par la cible réduit les charges à la place, l'enchantement a une défense de catégorie [Magnitude/7]."
  },
  {
    "num": 128,
    "vulgar": "Apathie",
    "latin": "???",
    "arcane": "???",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🔮 Magie: Muntneoirn",
    "description": "Génère un enchantement négatif qui double le drain des sorts lancés par la cible, cette augmentation a lieu avant les réductions liés à la tradition mais peux être entièrement payée via du mana temporaire, avec pour maximum une augmentation de drain de [Magnitude/3]."
  },
  {
    "num": 129,
    "vulgar": "Diminution",
    "latin": "Minor (Plus petit)",
    "arcane": "Malminor (Mal + minor)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚖️ Loi: Malminorem",
    "description": "Génère un enchantement négatif qui réduit l'attribut le plus élevé de la cible de [Magnitude/4]."
  },
  {
    "num": 130,
    "vulgar": "Amplification",
    "latin": "Augeo (Augmenter)",
    "arcane": "Morauge (Mor + auge)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🌀 Chaos: Moraugeix",
    "description": "Génère un enchantement négatif qui réduit l'attribut le plus bas de la cible de [Magnitude/4]."
  },
  {
    "num": 131,
    "vulgar": "Epuisement",
    "latin": "Labor (Peine, effort)",
    "arcane": "Muglabor (Mug + labor)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "☢️ Toxique: Muglaborex",
    "description": "Génère un enchantement qui provoque une perte de PE équivalant à [Magnitude/5] à chaque fois que la cible réalise une action, fut-elle simple, complexe, libre ou rapide."
  },
  {
    "num": 132,
    "vulgar": "Mensongement",
    "latin": "Mendax (Menteur)",
    "arcane": "Munmendax (Mun + mendax)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🌀 Chaos: Munmendaxix",
    "description": "Génère un enchantement qui oblige la cible à mentir, chaques phrases prononcées déclanchent une décharge de l'enchantement équivalant à la moitié des de lettres, cette limite est évidemment inconnue de la cible, si la personne se dédit juste après ses interlocuteurs devraient avoir bien du mal à le croire (comme une sorte de justification maladroite après avoir mentis) mais c'est au MJ de juger."
  },
  {
    "num": 133,
    "vulgar": "Falsification",
    "latin": "Fallo (Tromper)",
    "arcane": "Malfallo (Mal + fallo)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🌀 Chaos: Malfalloix",
    "description": "Génère un enchantement qui inflige une pénalité aux tests de sincérité de la cible de [Magnitude/3]."
  },
  {
    "num": 134,
    "vulgar": "Révélation",
    "latin": "Pateo (Être ouvert)",
    "arcane": "Morpateo (Mor + pateo)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚖️ Loi: Morpateoem",
    "description": "Génère un enchantement qui inflige une pénalité aux tests de mensonges de la cible de [Magnitude/3]."
  },
  {
    "num": 135,
    "vulgar": "Expiration",
    "latin": "Spirare (Souffler)",
    "arcane": "Mugspir (Mug + spir)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "✨ Sacre: Mugspiriel",
    "description": "Génère un enchantement qui provoque une perte de PE équivalant à 1/3 des dégats que la cible inflige, maximum [Magnitude/5]."
  },
  {
    "num": 136,
    "vulgar": "Aberration",
    "latin": "Erro (EReur)",
    "arcane": "Munerro (Mun + erro)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚜️ Charme: Munerro ynh",
    "description": "Génère un enchantement qui induit une confusion magique, la cible a une chance sur 1+[Magnitude/10] de se tromper de cible lorsqu'elle réalise une action, elle peux faire partie de ces cibles potenciels, chaque fois que la cible n'est pas la bonne l'enchantement subit une double décharge."
  },
  {
    "num": 137,
    "vulgar": "Aliénation",
    "latin": "Alienus (Étranger)",
    "arcane": "Malalien (Mal + alien)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚜️ Charme: Malalienynh",
    "description": "Génère un enchantement qui induit une folie magique, la cible a une chance sur 8-[Magnitude/10] (utilisez un d8) de s'attaquer via une attaque simple (affectée par les règles idoines) elle même au lieu de réaliser sa première action du round, chaque fois que cela surviens l'enchantement subit une double décharge."
  },
  {
    "num": 138,
    "vulgar": "Intimidation",
    "latin": "Paveo (Craindre)",
    "arcane": "Morpaveo (Mor + paveo)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚜️ Charme: Morpaveoynh",
    "description": "Génère un enchantement qui induit une peur magique, lorsque l'enchantement est lancé l'objet de la peur doit être définit clairement, la cible a [Magnitude/10] chance sur 8 (utilisez un d8) d'être pétrifiée de peur lorsqu'elle doit réaliser une action ou subir une action de l'objet de sa peur, lorsqu'elle est pétrifiée de peur son action est perdue ou elle ne peux se défendre de l'action qui viens."
  },
  {
    "num": 139,
    "vulgar": "Effroi",
    "latin": "Pavor (Terreur)",
    "arcane": "Mugpavor (Mug + pavor)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚜️ Charme: Mugpavor ynh",
    "description": "Génère un enchantement qui induit une Terreur magique, la cible a une chance est obligée d'utiliser sa première action du round pour se déplacer aussi loin que possible de l'objet de sa Terreur, chaque fois que cela surviens l'enchantement subit une double décharge."
  },
  {
    "num": 140,
    "vulgar": "Léthargie",
    "latin": "Lethos (Oubli)",
    "arcane": "Munletho (Mun + letho)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚜️ Charme: Munlethoynh",
    "description": "Génère un enchantement qui induit un sommeil magique, la cible est alors incapable d'agir, chaque tour perdus (ou scène hors combat) provoque une décharge (qui s'ajoute à la décharge de fin de tour le cas échéant), de plus si la cible est l'objet d'une action l'enchantement subit une décharge, cet effet ne fonctionne pas sur les adversaires dont le rang est égal ou supérieur à celui du lanceur de sort."
  },
  {
    "num": 141,
    "vulgar": "Culpabilisation",
    "latin": "Culpa (Faute)",
    "arcane": "Malculpa (Mal + culpa)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚜️ Charme: Malculpaynh",
    "description": "Génère un enchantement qui induit un regret magique, la cible subit une perte de PS équivalant à 1/3 des dégats (tous types confondus) qu'elle inflige aux autres, maximum [Magnitude/5]."
  },
  {
    "num": 142,
    "vulgar": "Domination",
    "latin": "Dominus (Maître)",
    "arcane": "Mordomin (Mor + domin)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚜️ Charme: Mordominy nh",
    "description": "Génère un enchantement qui induit un charme magique, sachant que cet enchantement ne peux être maintenu et dispose de [Magnitude] charges, la cible pense qu'une autre cible (toutes deux à portée, le lanceur de sort pouvant être cette cible) est un allié et ne souhaite plus lui faire du tord, si le lanceur de sort le souhaite il peux faire en sorte que cela s'applique à plusieurs cibles \"alliées\" plutôt qu'un seul mais la magnitude est alors divisée par 2, cet effet ne fonctionne pas sur les adversaires dont le rang est égal ou supérieur à celui du lanceur de sort."
  },
  {
    "num": 143,
    "vulgar": "Rebellion",
    "latin": "Bello (Guerre)",
    "arcane": "Mugbello (Mug + bello)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "4",
    "drain": "4",
    "keys": "⚜️ Charme: Mugbelloynh",
    "description": "Génère un enchantement qui induit un charme magique, sachant que cet enchantement ne peux être maintenu et dispose de [Magnitude/2] charges, la cible pense qu'une autre cible (toutes deux à portée, le lanceur de sort pouvant être cette cible) est un allié et ne souhaite plus lui faire du tord, voir même mieux elle cherchera à le défendre ou à le soutenir activement (même si c'est contre ses propres réels alliés), si le lanceur de sort le souhaite il peux faire en sorte que cela s'applique à plusieurs cibles \"alliées\" plutôt qu'un seul mais la magnitude est alors divisée par 2, cet effet ne fonctionne pas sur les adversaires dont le rang est égal ou supérieur à celui du lanceur de sort."
  },
  {
    "num": 144,
    "vulgar": "Révolution",
    "latin": "Volvo (Rouler)",
    "arcane": "Munvolvo (Mun + volvo)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "6",
    "drain": "6",
    "keys": "⚜️ Charme: Munvolvoynh",
    "description": "Génère un enchantement qui induit un charme magique, sachant que cet enchantement ne peux être maintenu et dispose de [Magnitude/3] charges, la cible pense qu'une autre cible (toutes deux à portée, le lanceur de sort pouvant être cette cible) est un allié et ne souhaite plus lui faire du tord, il ira jusqu'à attaquer les adversaires qui s'opposent ou menacent la cible en question (il ne voit plus ses réels alliés comme des alliés), si le lanceur de sort le souhaite il peux faire en sorte que cela s'applique à plusieurs cibles \"alliées\" plutôt qu'un seul mais la magnitude est alors divisée par 2, cet effet ne fonctionne pas sur les adversaires dont le rang est égal ou supérieur à celui du lanceur de sort."
  },
  {
    "num": 145,
    "vulgar": "Rageance",
    "latin": "Ira (Colère)",
    "arcane": "Malira (Mal + ira)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "4",
    "drain": "4",
    "keys": "⚜️ Charme: Maliraynh",
    "description": "Génère un enchantement qui induit une rage magique, sachant que cet enchantement ne peux être maintenu et dispose de [Magnitude/2] charges, la cible ne pense plus et s'attaque (avec les moyens les plus sévères) à la cible la plus proche d'elle (elle exclus), cet effet ne fonctionne pas sur les adversaires dont le rang est égal ou supérieur à celui du lanceur de sort."
  },
  {
    "num": 146,
    "vulgar": "Stagnation",
    "latin": "Stagno (Stagner)",
    "arcane": "Morstagn (Mor + stagn)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "4",
    "drain": "4",
    "keys": "💢 Vide: Morstagnarh",
    "description": "Génère un enchantement négatif qui empêche la cible d'agir ou d'être affectée par quoi que ce soit, figée dans le temps, cet enchantement ne peux être maintenu, la décharge de l'enchantement est doublé."
  },
  {
    "num": 147,
    "vulgar": "Mortification",
    "latin": "Mors (Mort)",
    "arcane": "Mugmors (Mug + mors)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "☠️ Mort: Mugmorsus",
    "description": "Génère un enchantement négatif qui réduit jusqu'à [Magnitude/2] toutes formes de soins reçus par la cible."
  },
  {
    "num": 148,
    "vulgar": "Exténuation",
    "latin": "Fatisco (S'épuiser)",
    "arcane": "Munfatis (Mun + fatis)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "☢️ Toxique: Munfatisex",
    "description": "Génère un enchantement négatif qui double la fatigue reçues par la cible avec un maximum de [Magnitude/3] à chaque occurence."
  },
  {
    "num": 149,
    "vulgar": "Ralenti­ss­ement",
    "latin": "Lentus (Lent)",
    "arcane": "Maltardi (Mal + tardi)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "💢 Vide: Maltardiarh",
    "description": "Génère un enchantement négatif qui réduit la vitesse de la cible de [Magnitude/4]."
  },
  {
    "num": 150,
    "vulgar": "Inertisation",
    "latin": "Iners (Inerte)",
    "arcane": "Moriners (Mor + iners)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "💢 Vide: Morinersarh",
    "description": "Génère un enchantement négatif qui réduit la rapidité de la cible de [Magnitude/4]."
  },
  {
    "num": 151,
    "vulgar": "Entravement",
    "latin": "Vinculum (Lien)",
    "arcane": "Mugvin (Mug + vin)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "💢 Vide: Mugvinarh",
    "description": "Génère un enchantement négatif qui réduit l'allure de la cible de [Magnitude/4]."
  },
  {
    "num": 152,
    "vulgar": "Retardement",
    "latin": "Tardus (Lent)",
    "arcane": "Muntardo (Mun + tardo)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "💢 Vide: Muntardoarh",
    "description": "Génère un enchantement négatif qui réduit l'initiative de la cible de [Magnitude/6]."
  },
  {
    "num": 153,
    "vulgar": "Subversion",
    "latin": "Verto (Tourner)",
    "arcane": "Malvert (Mal + vert)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🌀 Chaos: Malvertix",
    "description": "Génère un enchantement négatif qui force la cible à utiliser sa sauvegarde de fortune lorsque celle ci est inférieure à une autre sauvegarde dont il fait l'objet."
  },
  {
    "num": 154,
    "vulgar": "Minimisation",
    "latin": "Minimus (Le plus petit)",
    "arcane": "Morminima (Mor + minima)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚕️ Corps: Morminimaen",
    "description": "Génère un enchantement négatif qui réduit la stature ou la taille de [Magnitude/4]."
  },
  {
    "num": 155,
    "vulgar": "Démajestuatisation",
    "latin": "Maiestas (Majesté)",
    "arcane": "Mugmajest (Mug + majest)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🧠 Esprit: Mugmajestys",
    "description": "Génère un enchantement négatif qui réduit l'ego ou l'apparence de [Magnitude/4]."
  },
  {
    "num": 156,
    "vulgar": "Assèchement",
    "latin": "Aridus (Sec)",
    "arcane": "Munaris (Mun + aris)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "☢️ Toxique: Munarisex",
    "description": "Génère un enchantement négatif qui réduit les regains (via soins ou actions, etc) d'une ressource au choix parmi PV, PS, PE, PM, PK ou PC de [Magnitude]."
  },
  {
    "num": 157,
    "vulgar": "Épuisement",
    "latin": "Consumo (Consumer)",
    "arcane": "Malconsu (Mal + consu)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "☢️ Toxique: Malconsuex",
    "description": "Génère un enchantement négatif qui réduit la récupération de la cible de [Magnitude/5]."
  },
  {
    "num": 158,
    "vulgar": "Tarissement",
    "latin": "Siccus (Sec)",
    "arcane": "Morsicus (Mor + sicus)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "☢️ Toxique: Morsicusex",
    "description": "Génère un enchantement négatif qui réduit les gains de ressources temporaires (toutes natures confondues) de [Magnitude]."
  },
  {
    "num": 159,
    "vulgar": "Répercussion",
    "latin": "Reddo (Rendre)",
    "arcane": "Munreddo (Mun + reddo)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🧩 Mental: Munreddoend",
    "description": "Génère un enchantement qui provoque une perte de PS équivalant à 1/3 de la perte de PS que la cible inflige, maximum [Magnitude/7]."
  },
  {
    "num": 160,
    "vulgar": "Saignement",
    "latin": "Sanguis (Sang)",
    "arcane": "Mugsangui (Mug + sangui)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🩸 Impie: Mugsanguiun",
    "description": "Génère un enchantement qui provoque une perte de PV équivalant à 1/3 de la perte de PV que la cible inflige, maximum [Magnitude/7]."
  },
  {
    "num": 161,
    "vulgar": "Coagluation",
    "latin": "Cogo (Assembler)",
    "arcane": "Malcogo (Mal + cogo)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🩸 Impie: Malcogoun",
    "description": "Génère un enchantement négatif qui provoque à la fin du tour une perte de PV à la cible équivalant à 1/3 des PV qu'elle a déjà perdues jusqu'ici, maximum [Magnitude/5]."
  },
  {
    "num": 162,
    "vulgar": "Déperdition",
    "latin": "Languor (Langueur)",
    "arcane": "Morlangor (Mor + langor)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🩸 Impie: Morlangorun",
    "description": "Génère un enchantement négatif qui provoque à la fin du tour une perte de PS à la cible équivalant à 1/3 des PS qu'elle a déjà perdues jusqu'ici, maximum [Magnitude/5]."
  },
  {
    "num": 163,
    "vulgar": "Désorientation",
    "latin": "Oriens (Est, Levant)",
    "arcane": "Mugorien (Mug + orien)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🎭 Illusion: Mugorienin",
    "description": "Génère un enchantement négatif qui plonge la cible dans un labyrinth mental, tant qu'il est perdu dans ce dernier il subit un double désavantages, la cible peux passer une ACTS à essayer de s'orienter dans ce labyrinth mental via un test d'orientation adapté au type de labyrinth imposé par le lanceur de sort (évaluation difficulté 10) et il progresse d'autant que son jet (catégorie 0 + DR), il peux à la placer utiliser un test de concentration, lorsque la progression atteint [Magnitude] il s'affranchit d'un désavantage, l'enchantement prend fin si la cible n'est plus affecté par des désavantages de cette manière, évidemment un test de sauvegarde approprié permet d'altérer la magnitude effective du sort."
  },
  {
    "num": 164,
    "vulgar": "Perdition",
    "latin": "Perdo (Perdre)",
    "arcane": "Munperdo (Mun + perdo)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🎭 Illusion: Munperdoin",
    "description": "Génère un enchantement négatif qui plonge la cible dans un labyrinth mental, tant qu'il est perdu dans ce dernier il ne peux plus agir ni se défendre, la cible peux passer une ACTS à essayer de s'orienter dans ce labyrinth mental via un test d'orientation adapté au type de labyrinth imposé par le lanceur de sort (évaluation difficulté 10) et il progresse d'autant que son jet (catégorie 0 + DR), il peux à la placer utiliser un test de concentration, lorsque la progression atteint [Magnitude] il s'affranchit du labyrinth et l'enchantement prend fin, évidemment un test de sauvegarde approprié permet d'altérer la magnitude effective du sort, ce sort n'affecte que les cibles dont le rang est inférieur à celui du lanceur de sort."
  },
  {
    "num": 165,
    "vulgar": "Symbiose",
    "latin": "Symbiosis (Vivre ensemble)",
    "arcane": "Malsym (Mal + sym)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🩸 Impie: Malsymun",
    "description": "Génère un enchantement qui provoque une perte de ressource équivalant à 1/3 de ce que les alliés OU les adversaires dans la zone perdent également, maximum [Magnitude/5], le lanceur de sort choisit la ressource au moment où l'enchantement est lancé parmi PE, PV et PS, le choix des alliés ou des adversaires peux être simplifié en \"tous les participants sans distinctions\" cependant la perte passe à 1/5 et la magnitude maximale à [Magnitude/7]."
  },
  {
    "num": 166,
    "vulgar": "Obligation",
    "latin": "Liga (Lier)",
    "arcane": "Morliga (Mor + liga)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚖️ Loi: Morligaem",
    "description": "Génère un enchantement négatif qui inflige un désavantage à toutes les actions qui contreviennent à un ordre donné lors du lancement du sort, l'ordre doit spécifier un type d'action et une un type de cible (par exemple: N'attaque pas mes alliés), cependant le lanceur de sort peux réduire le scope du type de cible à un seul individus par exemple et dans ce cas l'action subit un double désavantage à la place, chaque fois que la cible est affecté par ces effets le sort se décharge."
  },
  {
    "num": 167,
    "vulgar": "Soumission",
    "latin": "Mitto (Envoyer)",
    "arcane": "Mugmitto (Mug + mitto)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚖️ Loi: Mugmittoem",
    "description": "Génère un enchantement négatif qui empêche la cible de contrevenir à l'ordre qui doit spécifier un type d'action et une un type de cible (par exemple: N'attaque pas mes alliés), cependant le lanceur de sort peux réduire le scope du type de cible à un seul individus par exemple, lorsque la cible tente quand même ce type d'action elle doit réussir un test de détermination ou elle perd son action, chaque fois que la cible est affecté par ces effets (que le test de sauvegarde soit réussit ou non) le sort se décharge, le test est désavantagé si la cible est unique."
  },
  {
    "num": 168,
    "vulgar": "Neutralisation",
    "latin": "Medius (Milieu)",
    "arcane": "Munmedi (Mun + medi)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚖️ Loi: Munmediem",
    "description": "Génère un enchantement négatif qui réduit l'impact positif d'une force élémentaire de la cible, avec une réduction maximale de [Magnitude/2]."
  },
  {
    "num": 169,
    "vulgar": "Lassitude",
    "latin": "Lassus (Fatigué)",
    "arcane": "Mallassu (Mal + lassu)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "☢️ Toxique: Mallassu ex",
    "description": "Génère un enchantement négatif qui double la fatigue pour le calcule des pénalités, maximum [Magnitude/2]."
  },
  {
    "num": 170,
    "vulgar": "Statuequo",
    "latin": "Statuo (Fixer l'état)",
    "arcane": "Mugstatuo (Mug + statuo)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🔮 Magie",
    "description": "Génère un enchantement négatif qui réduit tous les gains de ressource temporaire de [Magnitude/2]."
  },
  {
    "num": 171,
    "vulgar": "Démagnification",
    "latin": "Magnus (Grand)",
    "arcane": "Mugmagn (Mug + magn)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🔮 Magie",
    "description": "Génère un enchantement négatif qui réduit la puissance des sorts lancés par la cible de [Magnitude/3], si le lanceur de sort le souhaite il peux conditionner ce bonus à une école ou un domaine précis, le bonus est alors de [Magnitude/2] mais la difficulté et le drain de ce sort sont respectivement augmentés de 2 et 4."
  },
  {
    "num": 172,
    "vulgar": "Implaccable",
    "latin": "Reciproco (Réciproque)",
    "arcane": "Mugrecip (Mug + recip)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🩸 Impie",
    "description": "Génère un enchantement qui provoque une perte de PE équivalant à 1/2 de la perte de PV ou PS que la cible inflige, maximum [Magnitude/8]."
  },
  {
    "num": 173,
    "vulgar": "Confusion",
    "latin": "Confundo (Confondre)",
    "arcane": "Mugconfund (Mug + confund)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🧩 Mental",
    "description": "Génère un enchantement qui induit une confusion magique, la cible a une chance sur 1+[Magnitude/10] de se tromper de cible lorsqu'elle réalise une action, elle peux faire partie de ces cibles potenciels, chaque fois que la cible n'est pas la bonne l'enchantement subit une double décharge."
  },
  {
    "num": 174,
    "vulgar": "Folie",
    "latin": "Insanio (Rendre fou)",
    "arcane": "Malinsan (Mal + insan)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🧩 Mental",
    "description": "Génère un enchantement qui induit une folie magique, la cible a une chance sur 8-[Magnitude/10] (utilisez un d8) de s'attaquer via une attaque simple (affectée par les règles idoines) elle même au lieu de réaliser sa première action du round, chaque fois que cela surviens l'enchantement subit une double décharge."
  },
  {
    "num": 175,
    "vulgar": "Peur",
    "latin": "Paveo (Avoir peur)",
    "arcane": "Mugpaveo (Mug + paveo)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚜️ Charme",
    "description": "Génère un enchantement qui induit une peur magique, lorsque l'enchantement est lancé l'objet de la peur doit être définit clairement, la cible a une chance sur 8-[Magnitude/10] (utilisez un d8) d'être pétrifiée de peur lorsqu'elle doit réaliser une action ou subir une action de l'objet de sa peur, lorsqu'elle est pétrifiée de peur son action est perdue ou elle ne peux se défendre de l'action qui viens."
  },
  {
    "num": 176,
    "vulgar": "Terreur",
    "latin": "Terreo (Terrifier)",
    "arcane": "Mugterreo (Mug + terreo)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚜️ Charme",
    "description": "Génère un enchantement qui induit une Terreur magique, la cible a une chance est obligée d'utiliser sa première action du round pour se déplacer aussi loin que possible de l'objet de sa Terreur, chaque fois que cela surviens l'enchantement subit une double décharge."
  },
  {
    "num": 177,
    "vulgar": "Sommeil",
    "latin": "Somnus (Sommeil)",
    "arcane": "Mugsomn (Mug + somn)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🧩 Mental",
    "description": "Génère un enchantement qui induit un sommeil magique, la cible est alors incapable d'agir, chaque tour perdus (ou scène hors combat) provoque une décharge (qui s'ajoute à la décharge de fin de tour le cas échéant), de plus si la cible est l'objet d'une action l'enchantement subit une décharge, cet effet ne fonctionne pas sur les adversaires dont le rang est égal ou supérieur à celui du lanceur de sort."
  },
  {
    "num": 178,
    "vulgar": "Regret",
    "latin": "Paeniteo (Regretter)",
    "arcane": "Mugpaeni (Mug + paeni)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚜️ Charme",
    "description": "Génère un enchantement qui induit un regret magique, la cible subit une perte de PS équivalant à 1/3 des dégats (tous types confondus) qu'elle inflige aux autres, maximum [Magnitude/5]."
  },
  {
    "num": 179,
    "vulgar": "Charme",
    "latin": "Fascino (Charmer)",
    "arcane": "Mugfascin (Mug + fascin)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚜️ Charme",
    "description": "Génère un enchantement qui induit un charme magique, sachant que cet enchantement ne peux être maintenu et dispose de [Magnitude] charges, la cible pense qu'une autre cible (toutes deux à portée, le lanceur de sort pouvant être cette cible) est un allié et ne souhaite plus lui faire du tord, si le lanceur de sort le souhaite il peux faire en sorte que cela s'applique à plusieurs cibles \"alliées\" plutôt qu'un seul mais la magnitude est alors divisée par 2, cet effet ne fonctionne pas sur les adversaires dont le rang est égal ou supérieur à celui du lanceur de sort."
  },
  {
    "num": 180,
    "vulgar": "Amitié",
    "latin": "Alligo (Lier d'amitié)",
    "arcane": "Mugallig (Mug + allig)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚜️ Charme",
    "description": "Génère un enchantement qui induit un charme magique, sachant que cet enchantement ne peux être maintenu et dispose de [Magnitude/2] charges, la cible pense qu'une autre cible (toutes deux à portée, le lanceur de sort pouvant être cette cible) est un allié et ne souhaite plus lui faire du tord, voir même mieux elle cherchera à le défendre ou à le soutenir activement (même si c'est contre ses propres réels alliés), si le lanceur de sort le souhaite il peux faire en sorte que cela s'applique à plusieurs cibles \"alliées\" plutôt qu'un seul mais la magnitude est alors divisée par 2, cet effet ne fonctionne pas sur les adversaires dont le rang est égal ou supérieur à celui du lanceur de sort."
  },
  {
    "num": 181,
    "vulgar": "Servitude",
    "latin": "Servitium (Servitude)",
    "arcane": "Mugservit (Mug + servit)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚜️ Charme",
    "description": "Génère un enchantement qui induit un charme magique, sachant que cet enchantement ne peux être maintenu et dispose de [Magnitude/3] charges, la cible pense qu'une autre cible (toutes deux à portée, le lanceur de sort pouvant être cette cible) est un allié et ne souhaite plus lui faire du tord, il ira jusqu'à attaquer les adversaires qui s'opposent ou menacent la cible en question (il ne voit plus ses réels alliés comme des alliés), si le lanceur de sort le souhaite il peux faire en sorte que cela s'applique à plusieurs cibles \"alliées\" plutôt qu'un seul mais la magnitude est alors divisée par 2, cet effet ne fonctionne pas sur les adversaires dont le rang est égal ou supérieur à celui du lanceur de sort."
  },
  {
    "num": 182,
    "vulgar": "Rage",
    "latin": "Furor (Fureur)",
    "arcane": "Mugfuror (Mug + furor)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚜️ Charme",
    "description": "Génère un enchantement qui induit une rage magique, sachant que cet enchantement ne peux être maintenu et dispose de [Magnitude/2] charges, la cible ne pense plus et s'attaque (avec les moyens les plus sévères) à la cible la plus proche d'elle (elle exclus), cet effet ne fonctionne pas sur les adversaires dont le rang est égal ou supérieur à celui du lanceur de sort."
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
