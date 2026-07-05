# Liaisons, Annexes & Formes

> Mots spéciaux combinables avec n'importe quel sort.

<div id="lia-app">

<div class="lia-filters">
  <input type="text" id="lia-search" placeholder="Rechercher…" />
  <select id="lia-cat">
    <option value="">Toutes catégories</option>
    <option value="Annexe">Annexe</option>
<option value="Forme">Forme</option>
<option value="Liaison">Liaison</option>
  </select>
  <select id="lia-type">
    <option value="">Tous types</option>
    <option value="*">*</option>
<option value="Avancé">Avancé</option>
<option value="Forme">Forme</option>
<option value="Liaison">Liaison</option>
  </select>
  <span id="lia-count"></span>
</div>

<table id="lia-table">
  <thead>
    <tr>
      <th class="col-name" data-col="name">Nom ↕</th>
      <th class="col-cat" data-col="category">Catégorie ↕</th>
      <th class="col-type" data-col="word_type">Type ↕</th>
      <th class="col-diff" data-col="difficulty">Diff. ↕</th>
      <th class="col-drain" data-col="drain">Drain ↕</th>
      <th class="col-mag">Mod. Magnitude</th>
      <th class="col-desc">Description</th>
    </tr>
  </thead>
  <tbody id="lia-tbody"></tbody>
</table>

</div>

<style>
#lia-app {
  font-size: 0.85em;
}
.lia-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5em;
  margin-bottom: 1em;
  align-items: center;
}
.lia-filters input[type=text], .lia-filters select {
  padding: 0.35em 0.6em;
  border: 1px solid #aaa;
  border-radius: 4px;
  font-size: 0.9em;
  background: var(--md-default-bg-color, #fff);
  color: var(--md-default-fg-color, #000);
}
.lia-filters input[type=text] {
  flex: 1;
  min-width: 200px;
}
#lia-count {
  margin-left: auto;
  color: #888;
  font-size: 0.85em;
  white-space: nowrap;
}
#lia-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}
#lia-table th, #lia-table td {
  padding: 0.35em 0.5em;
  border: 1px solid var(--md-default-fg-color--lightest, #e0e0e0);
  vertical-align: top;
  word-break: break-word;
}
#lia-table th {
  background: var(--md-primary-fg-color, #3f51b5);
  color: var(--md-primary-bg-color, #fff);
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
}
#lia-table th:hover { opacity: 0.85; }
.col-name  { width: 10%; }
.col-cat   { width: 8%; }
.col-type  { width: 8%; }
.col-diff  { width: 5%; text-align: center; }
.col-drain { width: 5%; text-align: center; }
.col-mag   { width: 16%; }
.col-desc  { width: 48%; }
#lia-table tbody tr:nth-child(even) {
  background: var(--md-default-bg-color--light, #f9f9f9);
}
#lia-table tbody tr:hover {
  background: var(--md-accent-fg-color--transparent, #e8eaf6);
}
.lia-bracket {
  color: #ff1493;
  font-weight: bold;
}
</style>

<script>
(function() {
  const DATA = [
  {
    "name": "Boost",
    "category": "Liaison",
    "word_type": "Liaison",
    "difficulty": "0",
    "drain": "X",
    "mag_mod": "",
    "description": "Lorsque le sort est lancé le personnage peux dépenser autant de mana que souhaité pour augmenter la puissance du sort d'autant, maximum 2 par dés."
  },
  {
    "name": "Long",
    "category": "Liaison",
    "word_type": "Liaison",
    "difficulty": "2",
    "drain": "2",
    "mag_mod": "",
    "description": "La distance de diffusion du sort est doublée."
  },
  {
    "name": "Large",
    "category": "Liaison",
    "word_type": "Liaison",
    "difficulty": "0",
    "drain": "2",
    "mag_mod": "",
    "description": "La zone de propagation du sort est doublée."
  },
  {
    "name": "Aléa",
    "category": "Liaison",
    "word_type": "Liaison",
    "difficulty": "X",
    "drain": "X",
    "mag_mod": "",
    "description": "Le sort est associé à X autres mots de pouvoir, lorsque le sort est lancé seul l'un d'eux est sélectionné, PWR +X."
  },
  {
    "name": "Aléatoire",
    "category": "Liaison",
    "word_type": "Liaison",
    "difficulty": "0",
    "drain": "0",
    "mag_mod": "",
    "description": "Le sort a 50% de chance de s'appliquer sur chaque cible, PWR +2."
  },
  {
    "name": "Filtre",
    "category": "Liaison",
    "word_type": "Liaison",
    "difficulty": "4",
    "drain": "0",
    "mag_mod": "",
    "description": "Le sort n'affecte pas les alliés du lanceur de sort (ni le lanceur du sort lui même)."
  },
  {
    "name": "Concentration",
    "category": "Liaison",
    "word_type": "Liaison",
    "difficulty": "2",
    "drain": "2",
    "mag_mod": "",
    "description": "Chaque cases du sort rattaché à sa zone d'effet qui est bloquée par la typologie du lieu où il est lancé augmente la puissance du sort de 1, maximum 2 x dés."
  },
  {
    "name": "Ephémère",
    "category": "Liaison",
    "word_type": "Liaison",
    "difficulty": "0",
    "drain": "0",
    "mag_mod": "",
    "description": "Le sort d'invocation ne dure qu'un cycle unique, l'invocation est avantagé a ses tests & jets."
  },
  {
    "name": "Drain",
    "category": "Liaison",
    "word_type": "Liaison",
    "difficulty": "0",
    "drain": "0",
    "mag_mod": "",
    "description": "Le sort doit inclure deux mots, en duo ou avec une annexe : l'un pour endommager une ressource, l'autre pour soigner celle ci; les dégats aurons alors lieu sur la cible et le soin sur le lanceur du sort, le montant soigné ne peux être supérieur à la perte réelle de la dite ressource par la cible."
  },
  {
    "name": "Combo",
    "category": "Liaison",
    "word_type": "Liaison",
    "difficulty": "2",
    "drain": "0",
    "mag_mod": "",
    "description": "Le sort doit inclure deux mots, en duo ou avec une annexe : les deux mots doivent avoir un lien évident et explicite formant une combinaison logique; alors le sort reçoit PWR +1."
  },
  {
    "name": "Perçant",
    "category": "Liaison",
    "word_type": "Liaison",
    "difficulty": "2",
    "drain": "2",
    "mag_mod": "",
    "description": "L'attaque issus du sort génère des dégats perçants (ignore la moitié de l'absorption de la cible)."
  },
  {
    "name": "Biorythme",
    "category": "Liaison",
    "word_type": "Liaison",
    "difficulty": "2",
    "drain": "4",
    "mag_mod": "",
    "description": "Le soin produit par le sort génère deux fois moins de fatigue le cas échéant."
  },
  {
    "name": "Intelligent",
    "category": "Liaison",
    "word_type": "Liaison",
    "difficulty": "4",
    "drain": "2",
    "mag_mod": "",
    "description": "Le sort n'affecte que les alliés ou les ennemis, au choix du lanceur de sort."
  },
  {
    "name": "Némésis",
    "category": "Liaison",
    "word_type": "Liaison",
    "difficulty": "2",
    "drain": "2",
    "mag_mod": "",
    "description": "Le sort n'affecte que les ennemis du lanceur de sort."
  },
  {
    "name": "Sacrifice",
    "category": "Liaison",
    "word_type": "Liaison",
    "difficulty": "0",
    "drain": "0",
    "mag_mod": "",
    "description": "Le lanceur de sort perd autant de PV que le drain minimum du sort, PWR +2."
  },
  {
    "name": "Nuance",
    "category": "Liaison",
    "word_type": "Liaison",
    "difficulty": "2",
    "drain": "2",
    "mag_mod": "",
    "description": "Si le sort produit ses effets contre ou en rapport avec un domaine ou un élément, cet effet considère l'ensemble des domaines du même cercle (à savoir : Energie, Matière, Prime, Origine, Eternel, Cycle, Nature, Mental, Magie)."
  },
  {
    "name": "Alignement",
    "category": "Liaison",
    "word_type": "Liaison",
    "difficulty": "2",
    "drain": "2",
    "mag_mod": "",
    "description": "Si le sort produit ses effets contre ou en rapport avec un domaine Divin ou Occulte il affecte tous les domaines de ce type (Divin : Sacré, Vie, Lumière, Loi; Occulte : Impie, Mort, Ombre, Chaos)."
  },
  {
    "name": "Présence",
    "category": "Liaison",
    "word_type": "Liaison",
    "difficulty": "4",
    "drain": "4",
    "mag_mod": "",
    "description": "Le sort qui fait apparaitre des entitées magiques deviens un enchantement qui maintient la présence de ces dernières, provoquant un déplacement de ces derniers (selon les règles appropriées du sort) à chaque tour au même rang d'initiative que le moment où le sort a été lancé."
  },
  {
    "name": "Interruption",
    "category": "Liaison",
    "word_type": "Liaison",
    "difficulty": "2",
    "drain": "2",
    "mag_mod": "",
    "description": "Le sort peux être lancé en interruption, mais requière malgré tout les actions simples habituels (et non une ACTR comme les sorts dont le mot de pouvoir est une interruption)."
  },
  {
    "name": "Annexe",
    "category": "Annexe",
    "word_type": "Avancé",
    "difficulty": "0",
    "drain": "2",
    "mag_mod": "",
    "description": "Le sort est avancé (voir les règles), entre autre il requière une ACTS de plus pour être lancé, de plus le sort est associé à un second mot de pouvoir, cet effet subit PWR-2, le malus de PWR ne peux pas être supérieur à 4 une fois tous les mots associés."
  },
  {
    "name": "Duo",
    "category": "Annexe",
    "word_type": "Avancé",
    "difficulty": "0",
    "drain": "2",
    "mag_mod": "",
    "description": "Le sort est avancé (voir les règles), entre autre il requière une ACTS de plus pour être lancé, de plus le sort est associé à un second mot de pouvoir, les deux effets subissent PWR-1, le malus de PWR ne peux pas être supérieur à 4 une fois tous les mots associés."
  },
  {
    "name": "Supérieur",
    "category": "Annexe",
    "word_type": "Avancé",
    "difficulty": "0",
    "drain": "2",
    "mag_mod": "",
    "description": "Le sort est avancé (voir les règles), entre autre il requière une ACTS de plus pour être lancé, de plus le sort est reçoit PWR +1."
  },
  {
    "name": "Soi",
    "category": "Forme",
    "word_type": "Forme",
    "difficulty": "-2",
    "drain": "-2",
    "mag_mod": "",
    "description": "Portée : Sans, Vecteur : Sans, Cible soi possible."
  },
  {
    "name": "Contact",
    "category": "Forme",
    "word_type": "Forme",
    "difficulty": "0",
    "drain": "0",
    "mag_mod": "Défendable, Interceptible",
    "description": "Portée : Mêlée, Vecteur : Touché, Cible soi possible."
  },
  {
    "name": "Projectile",
    "category": "Forme",
    "word_type": "Forme",
    "difficulty": "4",
    "drain": "2",
    "mag_mod": "Défendable, Interceptible",
    "description": "Portée : Portée magique x2, Vecteur : Vue."
  },
  {
    "name": "Manifestation",
    "category": "Forme",
    "word_type": "Forme",
    "difficulty": "2",
    "drain": "2",
    "mag_mod": "",
    "description": "Portée : Portée magique x1, Vecteur : Vue, Cible soi possible."
  },
  {
    "name": "Mot",
    "category": "Forme",
    "word_type": "Forme",
    "difficulty": "6",
    "drain": "4",
    "mag_mod": "",
    "description": "Portée : Portée magique x3, Vecteur : Voix."
  },
  {
    "name": "Regard",
    "category": "Forme",
    "word_type": "Forme",
    "difficulty": "6",
    "drain": "4",
    "mag_mod": "",
    "description": "Portée : Portée magique x3, Vecteur : Vue."
  },
  {
    "name": "Reflet",
    "category": "Forme",
    "word_type": "Forme",
    "difficulty": "4",
    "drain": "2",
    "mag_mod": "",
    "description": "Portée : Lieu, Vecteur : Reflets."
  },
  {
    "name": "Nom",
    "category": "Forme",
    "word_type": "Forme",
    "difficulty": "4",
    "drain": "2",
    "mag_mod": "",
    "description": "Portée : Lieu, Vecteur : Voix."
  },
  {
    "name": "*",
    "category": "Forme",
    "word_type": "*",
    "difficulty": "*",
    "drain": "*",
    "mag_mod": "",
    "description": "*."
  },
  {
    "name": "Unique",
    "category": "Forme",
    "word_type": "Forme",
    "difficulty": "0",
    "drain": "0",
    "mag_mod": "",
    "description": "Touche une cible unique."
  },
  {
    "name": "Carré",
    "category": "Forme",
    "word_type": "Forme",
    "difficulty": "2",
    "drain": "2",
    "mag_mod": "",
    "description": "Touche une cible et 1 case à proximité (AOE 3)."
  },
  {
    "name": "Cercle",
    "category": "Forme",
    "word_type": "Forme",
    "difficulty": "0",
    "drain": "2",
    "mag_mod": "",
    "description": "Comme carré mais ignore la cible (n'affecte que les cases à proximité donc, utile pour les novas)."
  },
  {
    "name": "Croix",
    "category": "Forme",
    "word_type": "Forme",
    "difficulty": "2",
    "drain": "2",
    "mag_mod": "",
    "description": "Touche une cible et jusqu'à 2 cases de chaque coté en croix (AOE spéciale)."
  },
  {
    "name": "Rayon",
    "category": "Forme",
    "word_type": "Forme",
    "difficulty": "2",
    "drain": "2",
    "mag_mod": "",
    "description": "Touche une cible et jusqu'à 4 cases derrière celle ci (AOE spéciale)."
  },
  {
    "name": "Ligne",
    "category": "Forme",
    "word_type": "Forme",
    "difficulty": "2",
    "drain": "2",
    "mag_mod": "",
    "description": "Touche une cible et jusqu'à 3 cases sur chaque cotés (face au lanceur de sort) (AOE spéciale)."
  },
  {
    "name": "Cône",
    "category": "Forme",
    "word_type": "Forme",
    "difficulty": "2",
    "drain": "2",
    "mag_mod": "",
    "description": "Touche une cible, 3 cases de largeur et 2 cases de profondeur derrières elles (AOE spéciale)."
  },
  {
    "name": "Zone",
    "category": "Forme",
    "word_type": "Forme",
    "difficulty": "4",
    "drain": "4",
    "mag_mod": "",
    "description": "Touche une cible et 3 cases à proximité (AOE 7)."
  },
  {
    "name": "Ciel",
    "category": "Forme",
    "word_type": "Forme",
    "difficulty": "4",
    "drain": "4",
    "mag_mod": "",
    "description": "Touche une cible et 5 cases à proximité (AOE 9), dans les airs uniquement."
  },
  {
    "name": "Surface",
    "category": "Forme",
    "word_type": "Forme",
    "difficulty": "4",
    "drain": "4",
    "mag_mod": "",
    "description": "Touche une cible et 5 cases à proximité (AOE 9) sur une surface/hauteur identique à la cible."
  },
  {
    "name": "Ombre",
    "category": "Forme",
    "word_type": "Forme",
    "difficulty": "4",
    "drain": "4",
    "mag_mod": "",
    "description": "Touche une cible et 5 cases à proximité (AOE 9) qui partage la même pénombre."
  },
  {
    "name": "Lumière",
    "category": "Forme",
    "word_type": "Forme",
    "difficulty": "4",
    "drain": "4",
    "mag_mod": "",
    "description": "Touche une cible et 5 cases à proximité (AOE 9) qui partage la même luminosité."
  },
  {
    "name": "*",
    "category": "Forme",
    "word_type": "*",
    "difficulty": "*",
    "drain": "*",
    "mag_mod": "",
    "description": "*."
  },
  {
    "name": "Puit",
    "category": "Forme",
    "word_type": "Forme",
    "difficulty": "0",
    "drain": "0",
    "mag_mod": "PWR -2/-2/-2 (6)",
    "description": "Le sort s'applique au moment où il est lancé puis aux deux rounds d'après, même cible, la cible doit être un lieu."
  },
  {
    "name": "Echos",
    "category": "Forme",
    "word_type": "Forme",
    "difficulty": "2",
    "drain": "2",
    "mag_mod": "PWR -1/-2/-3 (6)",
    "description": "Le sort s'applique au moment où il est lancé puis aux deux rounds d'après, même cible, la cible doit être un lieu."
  },
  {
    "name": "Chaine",
    "category": "Forme",
    "word_type": "Forme",
    "difficulty": "2X",
    "drain": "2X",
    "mag_mod": "PWR +0/-1/-2/... (9)",
    "description": "Le sort s'applique puis change de cible, la nouvelle cible doit être valide, jusqu'à X fois en tout."
  },
  {
    "name": "Souffle",
    "category": "Forme",
    "word_type": "Forme",
    "difficulty": "4",
    "drain": "4",
    "mag_mod": "PWR +0/-2",
    "description": "Le sort s'applique normalement mais une version diminuée du sort affecte également les cibles adjacentes (en AOE la portée de ce souffle est équivalant à la distance d'AOE)."
  },
  {
    "name": "Lent",
    "category": "Forme",
    "word_type": "Forme",
    "difficulty": "2X",
    "drain": "2X",
    "mag_mod": "PWR +X",
    "description": "Le sort s'applique après un délai de X rounds, maximum 3."
  },
  {
    "name": "Poison",
    "category": "Forme",
    "word_type": "Forme",
    "difficulty": "2",
    "drain": "2",
    "mag_mod": "PWR -3/-2/-1",
    "description": "Le sort s'applique au moment où il est lancé puis aux deux rounds d'après, même cible (lieu ou cible)."
  },
  {
    "name": "Double",
    "category": "Forme",
    "word_type": "Forme",
    "difficulty": "2",
    "drain": "0",
    "mag_mod": "PWR -1",
    "description": "Le sort s'applique sur deux cibles distincts, ces deux cibles sont nécessaires."
  },
  {
    "name": "Multiple",
    "category": "Forme",
    "word_type": "Forme",
    "difficulty": "2X",
    "drain": "2X",
    "mag_mod": "PWR -1",
    "description": "Le sort s'applique sur une cible + X autres cibles distincts."
  },
  {
    "name": "Activable",
    "category": "Forme",
    "word_type": "Forme",
    "difficulty": "0",
    "drain": "0",
    "mag_mod": "PWR +2",
    "description": "Le sort ne s'applique pas au moment où il est lancé, la cible/zone devient un enchantement qui déclanche les effets si une cible viable la touche, l'enchantement est défaussé après activation, le sort ne peux pas être lancé directement sur une cible correspondant."
  },
  {
    "name": "Statique",
    "category": "Forme",
    "word_type": "Forme",
    "difficulty": "0",
    "drain": "0",
    "mag_mod": "PWR -1",
    "description": "Le sort ne s'applique pas au moment où il est lancé, la cible/zone devient un enchantement qui déclanche les effets si une cible viable la touche ou débute son round à son contact, ce qui décharge une fois l'enchantement."
  },
  {
    "name": "Chaos",
    "category": "Forme",
    "word_type": "Forme",
    "difficulty": "0",
    "drain": "0",
    "mag_mod": "PWR +Y-X (max 3)",
    "description": "Le sort s'applique sur X cibles (aléatoires) parmi Y cibles dans la zone d'effet."
  },
  {
    "name": "Vague",
    "category": "Forme",
    "word_type": "Forme",
    "difficulty": "0",
    "drain": "0",
    "mag_mod": "PWR +1",
    "description": "Le sort, nécessairement en AOE, ne touche que les premières cibles d'une même lignes (en provenance de la cible d'origine de l'AOE), celles qui sont derrière ne sont pas affectée."
  },
  {
    "name": "Orbe",
    "category": "Forme",
    "word_type": "Forme",
    "difficulty": "2",
    "drain": "2",
    "mag_mod": "PWR -2",
    "description": "Comme statique mais peux être déplacé via une ACTL du lanceur de sort, AOE maximum 5."
  },
  {
    "name": "Myriade",
    "category": "Forme",
    "word_type": "Forme",
    "difficulty": "2X",
    "drain": "2X",
    "mag_mod": "PWR -3",
    "description": "Le sort s'applique X fois sur la cible."
  },
  {
    "name": "Pluie",
    "category": "Forme",
    "word_type": "Forme",
    "difficulty": "0",
    "drain": "0",
    "mag_mod": "PWR -3/-3/-3/-3/-3/-3 (6)",
    "description": "Le sort s'applique au moment où il est lancé puis aux cinq rounds d'après, même cible, la cible doit être un lieu."
  },
  {
    "name": "Sol",
    "category": "Forme",
    "word_type": "Forme",
    "difficulty": "0",
    "drain": "0",
    "mag_mod": "PWR -3",
    "description": "Le sort ne s'applique pas au moment où il est lancé, la cible/zone devient un enchantement qui déclanche les effets si une cible viable la touche ou débute son round à son contact."
  },
  {
    "name": "Epieu",
    "category": "Forme",
    "word_type": "Forme",
    "difficulty": "2",
    "drain": "2",
    "mag_mod": "PWR +0/-1/-2/... (9)",
    "description": "Le projectile issus du sort traverse chaque cible qui se trouve sur son passage, chaque nouvelle cible subit des effets réduits (PWR -1)."
  },
  {
    "name": "Global",
    "category": "Forme",
    "word_type": "Forme",
    "difficulty": "2",
    "drain": "2",
    "mag_mod": "",
    "description": "L'enchantement contenu dans le sort s'applique de façon globale sur la zone de propagation, tant qu'une créature est dans la zone en question elle est affectée par l'enchantement, dés qu'elle en sort ce n'est plus le cas, si un test de sauvegarde doit être réalisé il l'est une fois seulement."
  },
  {
    "name": "*",
    "category": "Forme",
    "word_type": "*",
    "difficulty": "*",
    "drain": "*",
    "mag_mod": "",
    "description": "*."
  },
  {
    "name": "Lieu",
    "category": "Forme",
    "word_type": "Forme",
    "difficulty": "6",
    "drain": "6",
    "mag_mod": "",
    "description": "Le sort affecte le lieu entier de la scène, le sort doit avoir pour cible un lieu."
  }
];

  const tbody   = document.getElementById('lia-tbody');
  const search  = document.getElementById('lia-search');
  const selCat  = document.getElementById('lia-cat');
  const selType = document.getElementById('lia-type');
  const counter = document.getElementById('lia-count');

  let sortCol = null;
  let sortAsc = true;

  function fmtText(text) {
    if (!text) return '';
    return text.replace(/\[([^\]]+)\]/g, '<span class="lia-bracket">[$1]</span>');
  }

  function render(list) {
    tbody.innerHTML = '';
    list.forEach(w => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${w.name}</strong></td>
        <td>${w.category}</td>
        <td>${w.word_type}</td>
        <td style="text-align:center">${w.difficulty}</td>
        <td style="text-align:center">${w.drain}</td>
        <td style="font-size:0.85em">${fmtText(w.mag_mod)}</td>
        <td>${fmtText(w.description)}</td>
      `;
      tbody.appendChild(tr);
    });
    counter.textContent = list.length + ' mot' + (list.length !== 1 ? 's' : '');
  }

  function filter() {
    const q = search.value.toLowerCase();
    const cat = selCat.value;
    const t = selType.value;

    let list = DATA.filter(w => {
      if (cat && w.category !== cat) return false;
      if (t && w.word_type !== t) return false;
      if (q && ![w.name, w.description, w.mag_mod]
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
  selCat.addEventListener('change', filter);
  selType.addEventListener('change', filter);

  document.querySelectorAll('#lia-table th[data-col]').forEach(th => {
    th.addEventListener('click', () => {
      if (sortCol === th.dataset.col) sortAsc = !sortAsc;
      else { sortCol = th.dataset.col; sortAsc = true; }
      filter();
    });
  });

  filter();
})();
</script>
