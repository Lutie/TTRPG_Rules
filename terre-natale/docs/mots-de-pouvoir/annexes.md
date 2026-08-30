# Annexes (Mots Avancés)

> Les mots avancés modifient la structure même du sort, combinant ou amplifiant plusieurs mots de pouvoir. Ils nécessitent une Action Simple supplémentaire.

<div class="mp-app">

<div class="mp-filters">
  <input type="text" id="mp-search" placeholder="Rechercher…" />
  <span id="mp-count"></span>
</div>

<div style="overflow-x:auto">
<table class="mp-table" id="mp-table">
  <thead><tr>
    <th data-col="name" style="width:15%">Nom ↕</th>
    <th data-col="difficulty" style="width:8%;text-align:center">Diff. ↕</th>
    <th data-col="drain" style="width:8%;text-align:center">Drain ↕</th>
    <th style="width:69%">Description</th>
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
    "name": "Annexe",
    "category": "Annexe",
    "word_type": "Avancé",
    "sort_type": "",
    "difficulty": "X",
    "drain": "X",
    "description": "Le sort est avancé (voir les règles), entre autre il requière une ACTS de plus pour être lancé, de plus le sort est associé à un second mot de pouvoir, cet effet subit PWR-2, le malus de PWR ne peux pas être supérieur à 4 une fois tous les mots associés",
    "conditions": "",
    "domain": "",
    "mag_mod": "",
    "sub_type": "",
    "limitations": ""
  },
  {
    "name": "Duo",
    "category": "Annexe",
    "word_type": "Avancé",
    "sort_type": "",
    "difficulty": "X",
    "drain": "X",
    "description": "Le sort est avancé (voir les règles), entre autre il requière une ACTS de plus pour être lancé, de plus le sort est associé à un second mot de pouvoir, les deux effets subissent PWR-1, le malus de PWR ne peux pas être supérieur à 4 une fois tous les mots associés",
    "conditions": "",
    "domain": "",
    "mag_mod": "",
    "sub_type": "",
    "limitations": ""
  },
  {
    "name": "Supérieur",
    "category": "Annexe",
    "word_type": "Avancé",
    "sort_type": "",
    "difficulty": "X",
    "drain": "X",
    "description": "Le sort est avancé (voir les règles), entre autre il requière une ACTS de plus pour être lancé, de plus le sort est reçoit PWR +1",
    "conditions": "",
    "domain": "",
    "mag_mod": "",
    "sub_type": "",
    "limitations": ""
  }
];
  const tbody  = document.getElementById('mp-tbody');
  const search = document.getElementById('mp-search');
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
        '<td style="text-align:center">' + (w.difficulty || '—') + '</td>' +
        '<td style="text-align:center">' + (w.drain || '—') + '</td>' +
        '<td>' + fmtText(w.description) + '</td>';
      tbody.appendChild(tr);
    });
    counter.textContent = list.length + ' mot' + (list.length !== 1 ? 's' : '');
  }

  function filter() {
    const q = search.value.toLowerCase();
    let list = DATA.filter(w =>
      !q || [w.name, w.description].some(s => (s||'').toLowerCase().includes(q))
    );
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
