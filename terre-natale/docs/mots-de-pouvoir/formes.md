# Formes

> Les mots de Forme définissent comment le sort se propage dans l'espace et dans le temps.

<div class="mp-app">

<div class="mp-filters">
  <input type="text" id="mp-search" placeholder="Rechercher…" />
  <select id="mp-sub-type">
    <option value="">Tous sous-types</option>
    <option value="Diffusion">Diffusion</option>
<option value="Propagation">Propagation</option>
<option value="Structure">Structure</option>
  </select>
  <span id="mp-count"></span>
</div>

<div style="overflow-x:auto">
<table class="mp-table" id="mp-table">
  <thead><tr>
    <th data-col="name" style="width:9%">Nom ↕</th>
    <th data-col="sub_type" style="width:10%">Sous-type ↕</th>
    <th style="width:12%">Limitations</th>
    <th data-col="difficulty" style="width:5%;text-align:center">Diff. ↕</th>
    <th data-col="drain" style="width:5%;text-align:center">Drain ↕</th>
    <th style="width:12%">Mod. Magnitude</th>
    <th style="width:10%">Domaine</th>
    <th style="width:37%">Description</th>
  </tr></thead>
  <tbody id="mp-tbody"></tbody>
</table>
</div>

</div>


<style>
.mp-app { font-size: 0.85em; }
.mp-filters {
  display: flex; flex-wrap: wrap; gap: 0.5em;
  margin-bottom: 1em; align-items: center;
}
.mp-filters input[type=text], .mp-filters select {
  padding: 0.35em 0.6em;
  border: 1px solid #aaa;
  border-radius: 4px;
  font-size: 0.9em;
  background: var(--md-default-bg-color, #fff);
  color: var(--md-default-fg-color, #000);
}
.mp-filters input[type=text] { flex: 1; min-width: 200px; }
#mp-count { margin-left: auto; color: #888; font-size: 0.85em; white-space: nowrap; }
.mp-table { width: 100%; border-collapse: collapse; table-layout: fixed; }
.mp-table th, .mp-table td {
  padding: 0.35em 0.5em;
  border: 1px solid var(--md-default-fg-color--lightest, #e0e0e0);
  vertical-align: top; word-break: break-word;
}
.mp-table th {
  background: var(--md-primary-fg-color, #3f51b5);
  color: var(--md-primary-bg-color, #fff);
  cursor: pointer; user-select: none; white-space: nowrap;
}
.mp-table th:hover { opacity: 0.85; }
.mp-table tbody tr:nth-child(even) { background: var(--md-default-bg-color--light, #f9f9f9); }
.mp-table tbody tr:hover { background: var(--md-accent-fg-color--transparent, #e8eaf6); }
.mp-domain { color: #888; font-size: 0.85em; }
.mp-bracket { color: #e040fb; font-weight: bold; }
.mp-tag {
  display: inline-block; padding: 0.1em 0.45em; border-radius: 3px;
  font-size: 0.8em; font-weight: 600; white-space: nowrap;
  background: var(--md-code-bg-color, #f0f0f0);
  color: var(--md-code-fg-color, #555);
}
</style>

<script>
(function() {
  const DATA = [
  {
    "name": "Soi",
    "category": "Forme",
    "word_type": "Forme",
    "sub_type": "Diffusion",
    "limitations": "Def, Enc, Eff",
    "difficulty": "-2",
    "drain": "-2",
    "description": "Portée : Sans, Vecteur : Sans, Cible soi possible",
    "mag_mod": "",
    "domain": "",
    "sort_type": "",
    "conditions": ""
  },
  {
    "name": "Contact",
    "category": "Forme",
    "word_type": "Forme",
    "sub_type": "Diffusion",
    "limitations": "Off, Def, Enc, Eff, Inv",
    "difficulty": "0",
    "drain": "0",
    "description": "Portée : Mêlée, Vecteur : Touché, Cible soi possible",
    "mag_mod": "Défendable, Interceptible",
    "domain": "",
    "sort_type": "",
    "conditions": ""
  },
  {
    "name": "Projectile",
    "category": "Forme",
    "word_type": "Forme",
    "sub_type": "Diffusion",
    "limitations": "Off",
    "difficulty": "4",
    "drain": "2",
    "description": "Portée : Portée magique x2, Vecteur : Vue",
    "mag_mod": "Défendable, Interceptible",
    "domain": "",
    "sort_type": "",
    "conditions": ""
  },
  {
    "name": "Manifestation",
    "category": "Forme",
    "word_type": "Forme",
    "sub_type": "Diffusion",
    "limitations": "Off, Def, Enc, Eff, Inv",
    "difficulty": "2",
    "drain": "2",
    "description": "Portée : Portée magique x1, Vecteur : Vue, Cible soi possible",
    "mag_mod": "",
    "domain": "",
    "sort_type": "",
    "conditions": ""
  },
  {
    "name": "Mot",
    "category": "Forme",
    "word_type": "Forme",
    "sub_type": "Diffusion",
    "limitations": "Off, Def, Enc, Eff",
    "difficulty": "6",
    "drain": "4",
    "description": "Portée : Portée magique x3, Vecteur : Voix",
    "mag_mod": "",
    "domain": "Loi, Sacre",
    "sort_type": "",
    "conditions": ""
  },
  {
    "name": "Regard",
    "category": "Forme",
    "word_type": "Forme",
    "sub_type": "Diffusion",
    "limitations": "Off, Def, Enc, Eff",
    "difficulty": "6",
    "drain": "4",
    "description": "Portée : Portée magique x3, Vecteur : Vue",
    "mag_mod": "",
    "domain": "Chaos, Impie",
    "sort_type": "",
    "conditions": ""
  },
  {
    "name": "Reflet",
    "category": "Forme",
    "word_type": "Forme",
    "sub_type": "Diffusion",
    "limitations": "Off, Def, Eff",
    "difficulty": "4",
    "drain": "2",
    "description": "Portée : Lieu, Vecteur : Reflets",
    "mag_mod": "",
    "domain": "Illusion",
    "sort_type": "",
    "conditions": ""
  },
  {
    "name": "Nom",
    "category": "Forme",
    "word_type": "Forme",
    "sub_type": "Diffusion",
    "limitations": "Off, Def, Enc, Eff",
    "difficulty": "4",
    "drain": "2",
    "description": "Portée : Lieu, Vecteur : Voix",
    "mag_mod": "",
    "domain": "Impie",
    "sort_type": "",
    "conditions": ""
  },
  {
    "name": "Unique",
    "category": "Forme",
    "word_type": "Forme",
    "sub_type": "Propagation",
    "limitations": "",
    "difficulty": "0",
    "drain": "0",
    "description": "Touche une cible unique",
    "mag_mod": "",
    "domain": "",
    "sort_type": "",
    "conditions": ""
  },
  {
    "name": "Carré",
    "category": "Forme",
    "word_type": "Forme",
    "sub_type": "Propagation",
    "limitations": "",
    "difficulty": "2",
    "drain": "2",
    "description": "Touche une cible et 1 case à proximité (AOE 3)",
    "mag_mod": "",
    "domain": "",
    "sort_type": "",
    "conditions": ""
  },
  {
    "name": "Cercle",
    "category": "Forme",
    "word_type": "Forme",
    "sub_type": "Propagation",
    "limitations": "",
    "difficulty": "0",
    "drain": "2",
    "description": "Comme carré mais ignore la cible (n'affecte que les cases à proximité donc, utile pour les novas)",
    "mag_mod": "",
    "domain": "",
    "sort_type": "",
    "conditions": ""
  },
  {
    "name": "Croix",
    "category": "Forme",
    "word_type": "Forme",
    "sub_type": "Propagation",
    "limitations": "",
    "difficulty": "2",
    "drain": "2",
    "description": "Touche une cible et jusqu'à 2 cases de chaque coté en croix (AOE spéciale)",
    "mag_mod": "",
    "domain": "",
    "sort_type": "",
    "conditions": ""
  },
  {
    "name": "Rayon",
    "category": "Forme",
    "word_type": "Forme",
    "sub_type": "Propagation",
    "limitations": "",
    "difficulty": "2",
    "drain": "2",
    "description": "Touche une cible et jusqu'à 4 cases derrière celle ci (AOE spéciale)",
    "mag_mod": "",
    "domain": "",
    "sort_type": "",
    "conditions": ""
  },
  {
    "name": "Ligne",
    "category": "Forme",
    "word_type": "Forme",
    "sub_type": "Propagation",
    "limitations": "",
    "difficulty": "2",
    "drain": "2",
    "description": "Touche une cible et jusqu'à 3 cases sur chaque cotés (face au lanceur de sort) (AOE spéciale)",
    "mag_mod": "",
    "domain": "",
    "sort_type": "",
    "conditions": ""
  },
  {
    "name": "Cône",
    "category": "Forme",
    "word_type": "Forme",
    "sub_type": "Propagation",
    "limitations": "",
    "difficulty": "2",
    "drain": "2",
    "description": "Touche une cible, 3 cases de largeur et 2 cases de profondeur derrières elles (AOE spéciale)",
    "mag_mod": "",
    "domain": "",
    "sort_type": "",
    "conditions": ""
  },
  {
    "name": "Zone",
    "category": "Forme",
    "word_type": "Forme",
    "sub_type": "Propagation",
    "limitations": "",
    "difficulty": "4",
    "drain": "4",
    "description": "Touche une cible et 3 cases à proximité (AOE 7)",
    "mag_mod": "",
    "domain": "",
    "sort_type": "",
    "conditions": ""
  },
  {
    "name": "Ciel",
    "category": "Forme",
    "word_type": "Forme",
    "sub_type": "Propagation",
    "limitations": "",
    "difficulty": "4",
    "drain": "4",
    "description": "Touche une cible et 5 cases à proximité (AOE 9), dans les airs uniquement",
    "mag_mod": "",
    "domain": "",
    "sort_type": "",
    "conditions": ""
  },
  {
    "name": "Surface",
    "category": "Forme",
    "word_type": "Forme",
    "sub_type": "Propagation",
    "limitations": "",
    "difficulty": "4",
    "drain": "4",
    "description": "Touche une cible et 5 cases à proximité (AOE 9) sur une surface/hauteur identique à la cible",
    "mag_mod": "",
    "domain": "",
    "sort_type": "",
    "conditions": ""
  },
  {
    "name": "Ombre",
    "category": "Forme",
    "word_type": "Forme",
    "sub_type": "Propagation",
    "limitations": "",
    "difficulty": "4",
    "drain": "4",
    "description": "Touche une cible et 5 cases à proximité (AOE 9) qui partage la même pénombre",
    "mag_mod": "",
    "domain": "",
    "sort_type": "",
    "conditions": ""
  },
  {
    "name": "Lumière",
    "category": "Forme",
    "word_type": "Forme",
    "sub_type": "Propagation",
    "limitations": "",
    "difficulty": "4",
    "drain": "4",
    "description": "Touche une cible et 5 cases à proximité (AOE 9) qui partage la même luminosité",
    "mag_mod": "",
    "domain": "",
    "sort_type": "",
    "conditions": ""
  },
  {
    "name": "Puit",
    "category": "Forme",
    "word_type": "Forme",
    "sub_type": "Structure",
    "limitations": "Off, Def, Eff",
    "difficulty": "0",
    "drain": "0",
    "description": "Le sort s'applique au moment où il est lancé puis aux deux rounds d'après, même cible, la cible doit être un lieu",
    "mag_mod": "PWR -2/-2/-2 (6)",
    "domain": "",
    "sort_type": "",
    "conditions": ""
  },
  {
    "name": "Echos",
    "category": "Forme",
    "word_type": "Forme",
    "sub_type": "Structure",
    "limitations": "Off, Def, Eff",
    "difficulty": "2",
    "drain": "2",
    "description": "Le sort s'applique au moment où il est lancé puis aux deux rounds d'après, même cible, la cible doit être un lieu",
    "mag_mod": "PWR -1/-2/-3 (6)",
    "domain": "",
    "sort_type": "",
    "conditions": ""
  },
  {
    "name": "Chaine",
    "category": "Forme",
    "word_type": "Forme",
    "sub_type": "Structure",
    "limitations": "Off",
    "difficulty": "2X",
    "drain": "2X",
    "description": "Le sort s'applique puis change de cible, la nouvelle cible doit être valide, jusqu'à X fois en tout",
    "mag_mod": "PWR +0/-1/-2/... (9)",
    "domain": "Foudre",
    "sort_type": "",
    "conditions": ""
  },
  {
    "name": "Souffle",
    "category": "Forme",
    "word_type": "Forme",
    "sub_type": "Structure",
    "limitations": "Off, Eff",
    "difficulty": "4",
    "drain": "4",
    "description": "Le sort s'applique normalement mais une version diminuée du sort affecte également les cibles adjacentes (en AOE la portée de ce souffle est équivalant à la distance d'AOE)",
    "mag_mod": "PWR +0/-2",
    "domain": "Feu",
    "sort_type": "",
    "conditions": ""
  },
  {
    "name": "Lent",
    "category": "Forme",
    "word_type": "Forme",
    "sub_type": "Structure",
    "limitations": "Off, Enc, Eff",
    "difficulty": "2X",
    "drain": "2X",
    "description": "Le sort s'applique après un délai de X rounds, maximum 3",
    "mag_mod": "PWR +X",
    "domain": "Glace",
    "sort_type": "",
    "conditions": ""
  },
  {
    "name": "Poison",
    "category": "Forme",
    "word_type": "Forme",
    "sub_type": "Structure",
    "limitations": "Off, Eff",
    "difficulty": "2",
    "drain": "2",
    "description": "Le sort s'applique au moment où il est lancé puis aux deux rounds d'après, même cible (lieu ou cible)",
    "mag_mod": "PWR -3/-2/-1",
    "domain": "Poison",
    "sort_type": "",
    "conditions": ""
  },
  {
    "name": "Double",
    "category": "Forme",
    "word_type": "Forme",
    "sub_type": "Structure",
    "limitations": "Off, Eff",
    "difficulty": "2",
    "drain": "0",
    "description": "Le sort s'applique sur deux cibles distincts, ces deux cibles sont nécessaires",
    "mag_mod": "PWR -1",
    "domain": "",
    "sort_type": "",
    "conditions": ""
  },
  {
    "name": "Multiple",
    "category": "Forme",
    "word_type": "Forme",
    "sub_type": "Structure",
    "limitations": "Off, Eff",
    "difficulty": "2X",
    "drain": "2X",
    "description": "Le sort s'applique sur une cible + X autres cibles distincts",
    "mag_mod": "PWR -1",
    "domain": "",
    "sort_type": "",
    "conditions": ""
  },
  {
    "name": "Activable",
    "category": "Forme",
    "word_type": "Forme",
    "sub_type": "Structure",
    "limitations": "Off, Def, Eff, Enc",
    "difficulty": "0",
    "drain": "0",
    "description": "Le sort ne s'applique pas au moment où il est lancé, la cible/zone devient un enchantement qui déclanche les effets si une cible viable la touche, l'enchantement est défaussé après activation, le sort ne peux pas être lancé directement sur une cible correspondant",
    "mag_mod": "PWR +2",
    "domain": "",
    "sort_type": "",
    "conditions": ""
  },
  {
    "name": "Statique",
    "category": "Forme",
    "word_type": "Forme",
    "sub_type": "Structure",
    "limitations": "Off, Def, Eff",
    "difficulty": "0",
    "drain": "0",
    "description": "Le sort ne s'applique pas au moment où il est lancé, la cible/zone devient un enchantement qui déclanche les effets si une cible viable la touche ou débute son round à son contact, ce qui décharge une fois l'enchantement",
    "mag_mod": "PWR -1",
    "domain": "",
    "sort_type": "",
    "conditions": ""
  },
  {
    "name": "Chaos",
    "category": "Forme",
    "word_type": "Forme",
    "sub_type": "Structure",
    "limitations": "Off, Def, Eff, Enc",
    "difficulty": "0",
    "drain": "0",
    "description": "Le sort s'applique sur X cibles (aléatoires) parmi Y cibles dans la zone d'effet",
    "mag_mod": "PWR +Y-X (max 3)",
    "domain": "",
    "sort_type": "",
    "conditions": ""
  },
  {
    "name": "Vague",
    "category": "Forme",
    "word_type": "Forme",
    "sub_type": "Structure",
    "limitations": "Off, Eff",
    "difficulty": "0",
    "drain": "0",
    "description": "Le sort, nécessairement en AOE, ne touche que les premières cibles d'une même lignes (en provenance de la cible d'origine de l'AOE), celles qui sont derrière ne sont pas affectée",
    "mag_mod": "PWR +1",
    "domain": "Eau",
    "sort_type": "",
    "conditions": ""
  },
  {
    "name": "Orbe",
    "category": "Forme",
    "word_type": "Forme",
    "sub_type": "Structure",
    "limitations": "Off, Def, Eff",
    "difficulty": "2",
    "drain": "2",
    "description": "Comme statique mais peux être déplacé via une ACTL du lanceur de sort, AOE maximum 5",
    "mag_mod": "PWR -2",
    "domain": "",
    "sort_type": "",
    "conditions": ""
  },
  {
    "name": "Myriade",
    "category": "Forme",
    "word_type": "Forme",
    "sub_type": "Structure",
    "limitations": "Off, Eff",
    "difficulty": "2X",
    "drain": "2X",
    "description": "Le sort s'applique X fois sur la cible",
    "mag_mod": "PWR -3",
    "domain": "",
    "sort_type": "",
    "conditions": ""
  },
  {
    "name": "Pluie",
    "category": "Forme",
    "word_type": "Forme",
    "sub_type": "Structure",
    "limitations": "Off, Def, Eff",
    "difficulty": "0",
    "drain": "0",
    "description": "Le sort s'applique au moment où il est lancé puis aux cinq rounds d'après, même cible, la cible doit être un lieu",
    "mag_mod": "PWR -3/-3/-3/-3/-3/-3 (6)",
    "domain": "",
    "sort_type": "",
    "conditions": ""
  },
  {
    "name": "Sol",
    "category": "Forme",
    "word_type": "Forme",
    "sub_type": "Structure",
    "limitations": "Off, Def, Eff",
    "difficulty": "0",
    "drain": "0",
    "description": "Le sort ne s'applique pas au moment où il est lancé, la cible/zone devient un enchantement qui déclanche les effets si une cible viable la touche ou débute son round à son contact",
    "mag_mod": "PWR -3",
    "domain": "",
    "sort_type": "",
    "conditions": ""
  },
  {
    "name": "Epieu",
    "category": "Forme",
    "word_type": "Forme",
    "sub_type": "Structure",
    "limitations": "Off",
    "difficulty": "2",
    "drain": "2",
    "description": "Le projectile issus du sort traverse chaque cible qui se trouve sur son passage, chaque nouvelle cible subit des effets réduits (PWR -1)",
    "mag_mod": "PWR +0/-1/-2/... (9)",
    "domain": "",
    "sort_type": "",
    "conditions": ""
  },
  {
    "name": "Global",
    "category": "Forme",
    "word_type": "Forme",
    "sub_type": "Structure",
    "limitations": "Enc",
    "difficulty": "2",
    "drain": "2",
    "description": "L'enchantement contenu dans le sort s'applique de façon globale sur la zone de propagation, tant qu'une créature est dans la zone en question elle est affectée par l'enchantement, dés qu'elle en sort ce n'est plus le cas, si un test de sauvegarde doit être réalisé il l'est une fois seulement",
    "mag_mod": "",
    "domain": "",
    "sort_type": "",
    "conditions": ""
  },
  {
    "name": "Lieu",
    "category": "Forme",
    "word_type": "Forme",
    "sub_type": "Propagation",
    "limitations": "",
    "difficulty": "6",
    "drain": "6",
    "description": "Le sort affecte le lieu entier de la scène, le sort doit avoir pour cible un lieu",
    "mag_mod": "",
    "domain": "Terre",
    "sort_type": "",
    "conditions": ""
  }
];
  const tbody  = document.getElementById('mp-tbody');
  const search = document.getElementById('mp-search');
  const selST  = document.getElementById('mp-sub-type');
  const counter = document.getElementById('mp-count');
  let sortCol = null, sortAsc = true;


  function fmtText(t) {
    if (!t) return '';
    return t.replace(/\[([^\]]+)\]/g, '<span class="mp-bracket">[$1]</span>');
  }
  function fmtTag(t) {
    if (!t) return '';
    return t.split(',').map(s => s.trim()).filter(Boolean)
             .map(s => '<span class="mp-tag">' + s + '</span>').join(' ');
  }


  function render(list) {
    tbody.innerHTML = '';
    list.forEach(w => {
      const tr = document.createElement('tr');
      tr.innerHTML =
        '<td><strong>' + w.name + '</strong></td>' +
        '<td><span class="mp-tag">' + (w.sub_type||'') + '</span></td>' +
        '<td style="font-size:0.85em;color:#888">' + fmtTag(w.limitations) + '</td>' +
        '<td style="text-align:center">' + (w.difficulty || '—') + '</td>' +
        '<td style="text-align:center">' + (w.drain || '—') + '</td>' +
        '<td style="font-size:0.85em">' + fmtText(w.mag_mod) + '</td>' +
        '<td class="mp-domain">' + fmtText(w.domain) + '</td>' +
        '<td>' + fmtText(w.description) + '</td>';
      tbody.appendChild(tr);
    });
    counter.textContent = list.length + ' mot' + (list.length !== 1 ? 's' : '');
  }

  function filter() {
    const q  = search.value.toLowerCase();
    const st = selST.value;
    let list = DATA.filter(w => {
      if (st && w.sub_type !== st) return false;
      if (q && ![w.name, w.description, w.mag_mod, w.domain]
                 .some(s => (s||'').toLowerCase().includes(q))) return false;
      return true;
    });
    if (sortCol) {
      list = list.slice().sort((a, b) => {
        const va = String(a[sortCol]||'').toLowerCase();
        const vb = String(b[sortCol]||'').toLowerCase();
        return sortAsc ? va.localeCompare(vb) : vb.localeCompare(va);
      });
    }
    render(list);
  }

  search.addEventListener('input', filter);
  selST.addEventListener('change', filter);

  function sortBy(col) {
    if (sortCol === col) sortAsc = !sortAsc;
    else { sortCol = col; sortAsc = true; }
    filter();
  }
  document.querySelectorAll('.mp-table th[data-col]').forEach(th => {
    th.addEventListener('click', () => sortBy(th.dataset.col));
  });

  filter();
})();
</script>
