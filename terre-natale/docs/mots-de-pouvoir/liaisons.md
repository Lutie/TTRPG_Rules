# Liaisons

> Mots modificateurs combinables avec n'importe quel sort. Certains sont limités à un domaine ou un type de sort.

<div class="mp-app">

<div class="mp-filters">
  <input type="text" id="mp-search" placeholder="Rechercher (nom, description…)" />
  <select id="mp-sort-type">
    <option value="">Tous types de sort</option>
    <option value="Attaque">Attaque</option>
<option value="Récup">Récup</option>
<option value="Tous">Tous</option>
  </select>
  <span id="mp-count"></span>
</div>

<div style="overflow-x:auto">
<table class="mp-table" id="mp-table">
  <thead><tr>
    <th data-col="name" style="width:10%">Nom ↕</th>
    <th data-col="sort_type" style="width:9%">Type de Sort ↕</th>
    <th data-col="difficulty" style="width:5%;text-align:center">Diff. ↕</th>
    <th data-col="drain" style="width:5%;text-align:center">Drain ↕</th>
    <th style="width:14%">Domaine</th>
    <th style="width:36%">Description</th>
    <th style="width:21%">Conditions</th>
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
    "name": "Boost",
    "category": "Liaison",
    "word_type": "Liaison",
    "sort_type": "Tous",
    "difficulty": "0",
    "drain": "X",
    "description": "Lorsque le sort est lancé le personnage peux dépenser autant de mana que souhaité pour augmenter la puissance du sort d'autant, maximum 2 par dés",
    "conditions": "",
    "domain": "",
    "mag_mod": "",
    "sub_type": "",
    "limitations": ""
  },
  {
    "name": "Long",
    "category": "Liaison",
    "word_type": "Liaison",
    "sort_type": "Tous",
    "difficulty": "2",
    "drain": "2",
    "description": "La distance de diffusion du sort est doublée",
    "conditions": "Diffusion avec distance magique",
    "domain": "",
    "mag_mod": "",
    "sub_type": "",
    "limitations": ""
  },
  {
    "name": "Large",
    "category": "Liaison",
    "word_type": "Liaison",
    "sort_type": "Tous",
    "difficulty": "0",
    "drain": "2",
    "description": "La zone de propagation du sort est doublée",
    "conditions": "Propagation de type AOE",
    "domain": "",
    "mag_mod": "",
    "sub_type": "",
    "limitations": ""
  },
  {
    "name": "Aléa",
    "category": "Liaison",
    "word_type": "Liaison",
    "sort_type": "Tous",
    "difficulty": "X",
    "drain": "X",
    "description": "Le sort est associé à X autres mots de pouvoir, lorsque le sort est lancé seul l'un d'eux est sélectionné, PWR +X",
    "conditions": "X maximum 3",
    "domain": "🌀 Chaos",
    "mag_mod": "",
    "sub_type": "",
    "limitations": ""
  },
  {
    "name": "Aléatoire",
    "category": "Liaison",
    "word_type": "Liaison",
    "sort_type": "Tous",
    "difficulty": "0",
    "drain": "0",
    "description": "Le sort a 50% de chance de s'appliquer sur chaque cible, PWR +2",
    "conditions": "",
    "domain": "",
    "mag_mod": "",
    "sub_type": "",
    "limitations": ""
  },
  {
    "name": "Filtre",
    "category": "Liaison",
    "word_type": "Liaison",
    "sort_type": "Tous",
    "difficulty": "4",
    "drain": "0",
    "description": "Le sort n'affecte pas les alliés du lanceur de sort (ni le lanceur du sort lui même)",
    "conditions": "",
    "domain": "",
    "mag_mod": "",
    "sub_type": "",
    "limitations": ""
  },
  {
    "name": "Concentration",
    "category": "Liaison",
    "word_type": "Liaison",
    "sort_type": "Tous",
    "difficulty": "2",
    "drain": "2",
    "description": "Chaque cases du sort rattaché à sa zone d'effet qui est bloquée par la typologie du lieu où il est lancé augmente la puissance du sort de 1, maximum 2 x dés",
    "conditions": "",
    "domain": "",
    "mag_mod": "",
    "sub_type": "",
    "limitations": ""
  },
  {
    "name": "Ephémère",
    "category": "Liaison",
    "word_type": "Liaison",
    "sort_type": "Tous",
    "difficulty": "0",
    "drain": "0",
    "description": "Le sort d'invocation ne dure qu'un cycle unique, l'invocation est avantagé a ses tests & jets",
    "conditions": "",
    "domain": "⚡ Foudre",
    "mag_mod": "",
    "sub_type": "",
    "limitations": ""
  },
  {
    "name": "Drain",
    "category": "Liaison",
    "word_type": "Liaison",
    "sort_type": "Tous",
    "difficulty": "0",
    "drain": "0",
    "description": "Le sort doit inclure deux mots, en duo ou avec une annexe : l'un pour endommager une ressource, l'autre pour soigner celle ci; les dégats aurons alors lieu sur la cible et le soin sur le lanceur du sort, le montant soigné ne peux être supérieur à la perte réelle de la dite ressource par la cible",
    "conditions": "",
    "domain": "",
    "mag_mod": "",
    "sub_type": "",
    "limitations": ""
  },
  {
    "name": "Combo",
    "category": "Liaison",
    "word_type": "Liaison",
    "sort_type": "Tous",
    "difficulty": "2",
    "drain": "0",
    "description": "Le sort doit inclure deux mots, en duo ou avec une annexe : les deux mots doivent avoir un lien évident et explicite formant une combinaison logique; alors le sort reçoit PWR +1",
    "conditions": "",
    "domain": "",
    "mag_mod": "",
    "sub_type": "",
    "limitations": ""
  },
  {
    "name": "Perçant",
    "category": "Liaison",
    "word_type": "Liaison",
    "sort_type": "Attaque",
    "difficulty": "2",
    "drain": "2",
    "description": "L'attaque issus du sort génère des dégats perçants (ignore la moitié de l'absorption de la cible)",
    "conditions": "",
    "domain": "🔥 Feu, ❄️ Glace, ⚡ Foudre",
    "mag_mod": "",
    "sub_type": "",
    "limitations": ""
  },
  {
    "name": "Biorythme",
    "category": "Liaison",
    "word_type": "Liaison",
    "sort_type": "Récup",
    "difficulty": "2",
    "drain": "4",
    "description": "Le soin produit par le sort génère deux fois moins de fatigue le cas échéant",
    "conditions": "",
    "domain": "❤️ Vie",
    "mag_mod": "",
    "sub_type": "",
    "limitations": ""
  },
  {
    "name": "Intelligent",
    "category": "Liaison",
    "word_type": "Liaison",
    "sort_type": "",
    "difficulty": "4",
    "drain": "2",
    "description": "Le sort n'affecte que les alliés ou les ennemis, au choix du lanceur de sort",
    "conditions": "",
    "domain": "🔮 Magie",
    "mag_mod": "",
    "sub_type": "",
    "limitations": ""
  },
  {
    "name": "Némésis",
    "category": "Liaison",
    "word_type": "Liaison",
    "sort_type": "",
    "difficulty": "2",
    "drain": "2",
    "description": "Le sort n'affecte que les ennemis du lanceur de sort",
    "conditions": "",
    "domain": "🩸 Impie",
    "mag_mod": "",
    "sub_type": "",
    "limitations": ""
  },
  {
    "name": "Sacrifice",
    "category": "Liaison",
    "word_type": "Liaison",
    "sort_type": "",
    "difficulty": "0",
    "drain": "0",
    "description": "Le lanceur de sort perd autant de PV que le drain minimum du sort, PWR +2",
    "conditions": "",
    "domain": "🩸 Impie",
    "mag_mod": "",
    "sub_type": "",
    "limitations": ""
  },
  {
    "name": "Nuance",
    "category": "Liaison",
    "word_type": "Liaison",
    "sort_type": "",
    "difficulty": "2",
    "drain": "2",
    "description": "Si le sort produit ses effets contre ou en rapport avec un domaine ou un élément, cet effet considère l'ensemble des domaines du même cercle (à savoir : Energie, Matière, Prime, Origine, Eternel, Cycle, Nature, Mental, Magie)",
    "conditions": "",
    "domain": "",
    "mag_mod": "",
    "sub_type": "",
    "limitations": ""
  },
  {
    "name": "Alignement",
    "category": "Liaison",
    "word_type": "Liaison",
    "sort_type": "",
    "difficulty": "2",
    "drain": "2",
    "description": "Si le sort produit ses effets contre ou en rapport avec un domaine Divin ou Occulte il affecte tous les domaines de ce type (Divin : Sacré, Vie, Lumière, Loi; Occulte : Impie, Mort, Ombre, Chaos)",
    "conditions": "",
    "domain": "",
    "mag_mod": "",
    "sub_type": "",
    "limitations": ""
  },
  {
    "name": "Présence",
    "category": "Liaison",
    "word_type": "Liaison",
    "sort_type": "",
    "difficulty": "4",
    "drain": "4",
    "description": "Le sort qui fait apparaitre des entitées magiques deviens un enchantement qui maintient la présence de ces dernières, provoquant un déplacement de ces derniers (selon les règles appropriées du sort) à chaque tour au même rang d'initiative que le moment où le sort a été lancé",
    "conditions": "",
    "domain": "🔮 Magie",
    "mag_mod": "",
    "sub_type": "",
    "limitations": ""
  },
  {
    "name": "Interruption",
    "category": "Liaison",
    "word_type": "Liaison",
    "sort_type": "",
    "difficulty": "2",
    "drain": "2",
    "description": "Le sort peux être lancé en interruption, mais requière malgré tout les actions simples habituels (et non une ACTR comme les sorts dont le mot de pouvoir est une interruption)",
    "conditions": "",
    "domain": "",
    "mag_mod": "",
    "sub_type": "",
    "limitations": ""
  }
];
  const tbody  = document.getElementById('mp-tbody');
  const search = document.getElementById('mp-search');
  const selST  = document.getElementById('mp-sort-type');
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
        '<td>' + (w.sort_type ? '<span class="mp-tag">' + w.sort_type + '</span>' : '') + '</td>' +
        '<td style="text-align:center">' + (w.difficulty || '—') + '</td>' +
        '<td style="text-align:center">' + (w.drain || '—') + '</td>' +
        '<td class="mp-domain">' + fmtText(w.domain) + '</td>' +
        '<td>' + fmtText(w.description) + '</td>' +
        '<td style="font-size:0.85em;color:#888">' + fmtText(w.conditions) + '</td>';
      tbody.appendChild(tr);
    });
    counter.textContent = list.length + ' mot' + (list.length !== 1 ? 's' : '');
  }

  function filter() {
    const q  = search.value.toLowerCase();
    const st = selST.value;
    let list = DATA.filter(w => {
      if (st && w.sort_type !== st) return false;
      if (q && ![w.name, w.description, w.domain, w.conditions]
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
