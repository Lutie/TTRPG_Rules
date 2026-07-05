# Liste des Focus de Style

<div id="focus-app">

<div class="foc-filters">
  <input type="text" id="foc-search" placeholder="Rechercher..." />
  <div class="foc-filter-row">
    <span class="foc-filter-label">Domaine :</span>
    <div class="foc-choice-group" id="foc-domain-options"></div>
  </div>
  <div class="foc-filter-row">
    <span class="foc-filter-label">Famille :</span>
    <div class="foc-choice-group" id="foc-family-options"></div>
  </div>
  <span id="foc-count"></span>
</div>

<table id="foc-table">
  <thead>
    <tr>
      <th class="col-nom" data-col="nom">Focus ↕</th>
      <th class="col-domain" data-col="domaine">Domaine</th>
      <th class="col-family" data-col="famille">Famille</th>
      <th class="col-section" data-col="sous_section">Section</th>
      <th class="col-values">Valeurs</th>
      <th class="col-effect">Effet</th>
    </tr>
  </thead>
  <tbody id="foc-tbody"></tbody>
</table>

</div>

<style>
#focus-app {
  font-size: 0.88em;
}
.foc-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5em;
  margin-bottom: 1em;
  align-items: center;
}
.foc-filters input[type=text] {
  padding: 0.35em 0.6em;
  border: 1px solid #aaa;
  border-radius: 4px;
  font-size: 0.9em;
  background: var(--md-default-bg-color, #fff);
  color: var(--md-default-fg-color, #000);
}
#foc-search {
  flex: 1;
  min-width: 200px;
}
.foc-filter-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.35em;
  width: 100%;
}
.foc-filter-label {
  font-weight: 700;
  white-space: nowrap;
}
.foc-choice-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3em;
}
.foc-choice {
  display: inline-flex;
  align-items: center;
  gap: 0.25em;
  padding: 0.2em 0.55em;
  border: 1px solid var(--md-default-fg-color--lightest, #d7d7d7);
  border-radius: 4px;
  background: var(--md-default-bg-color, #fff);
  white-space: nowrap;
  font-size: 0.9em;
  cursor: pointer;
}
.foc-choice:has(input:checked) {
  border-color: var(--md-primary-fg-color, #3f51b5);
  background: var(--md-accent-fg-color--transparent, #e8eaf6);
  color: var(--md-primary-fg-color, #3f51b5);
  font-weight: 700;
}
.foc-choice input {
  margin: 0;
}
#foc-count {
  margin-left: auto;
  color: #888;
  font-size: 0.85em;
  white-space: nowrap;
}
#foc-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}
#foc-table th, #foc-table td {
  padding: 0.4em 0.55em;
  border: 1px solid var(--md-default-fg-color--lightest, #e0e0e0);
  vertical-align: top;
  word-break: break-word;
}
#foc-table th {
  background: var(--md-primary-fg-color, #3f51b5);
  color: var(--md-primary-bg-color, #fff);
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
}
#foc-table th:hover { opacity: 0.85; }
.col-nom { width: 15%; }
.col-domain { width: 10%; }
.col-family { width: 10%; }
.col-section { width: 16%; }
.col-values { width: 8%; }
.col-effect { width: 41%; }
#foc-table tbody tr:nth-child(even) {
  background: var(--md-default-bg-color--light, #f9f9f9);
}
#foc-table tbody tr:hover {
  background: var(--md-accent-fg-color--transparent, #e8eaf6);
}
.foc-nom { font-weight: 700; }
.foc-values {
  font-weight: 700;
  white-space: nowrap;
}
.foc-error {
  color: #b00020;
  font-weight: 700;
}
</style>

<script>
(async function() {
  const tbody = document.getElementById('foc-tbody');
  const search = document.getElementById('foc-search');
  const domainOptions = document.getElementById('foc-domain-options');
  const familyOptions = document.getElementById('foc-family-options');
  const counter = document.getElementById('foc-count');

  let DATA = [];
  let sortCol = 'nom';
  let sortAsc = true;

  function esc(value) {
    return String(value || '').replace(/[&<>"']/g, char => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[char]));
  }

  function fillChoiceGroup(container, name, values) {
    const choices = ['', ...values];
    choices.forEach((value, index) => {
      const label = document.createElement('label');
      label.className = 'foc-choice';
      label.innerHTML = `
        <input type="radio" name="${name}" value="${esc(value)}"${index === 0 ? ' checked' : ''} />
        <span>${value ? esc(value) : 'Tout'}</span>
      `;
      container.appendChild(label);
    });
  }

  function selectedValue(name) {
    return document.querySelector(`input[name="${name}"]:checked`)?.value || '';
  }

  function render(list) {
    tbody.innerHTML = '';
    list.forEach(f => {
      const tr = document.createElement('tr');
      const values = Array.isArray(f.valeurs) && f.valeurs.length
        ? `<span class="foc-values">${esc(f.valeurs.join(' / '))}</span>`
        : '';
      tr.innerHTML = `
        <td><div class="foc-nom">${esc(f.nom)}</div></td>
        <td>${esc(f.domaine)}</td>
        <td>${esc(f.famille)}</td>
        <td>${esc(f.sous_section)}</td>
        <td>${values}</td>
        <td>${esc(f.effet)}</td>
      `;
      tbody.appendChild(tr);
    });
    counter.textContent = list.length + ' focus';
  }

  function filter() {
    const q = search.value.toLowerCase();
    const selectedDomain = selectedValue('foc-domain');
    const selectedFamily = selectedValue('foc-family');

    let list = DATA.filter(f => {
      if (selectedDomain && f.domaine !== selectedDomain) return false;
      if (selectedFamily && f.famille !== selectedFamily) return false;
      if (q && ![f.nom, f.domaine, f.famille, f.sous_section, f.effet]
        .some(t => (t || '').toLowerCase().includes(q))) return false;
      return true;
    });

    list = list.slice().sort((a, b) => {
      const va = (a[sortCol] || '').toLowerCase();
      const vb = (b[sortCol] || '').toLowerCase();
      return sortAsc ? va.localeCompare(vb) : vb.localeCompare(va);
    });

    render(list);
  }

  try {
    const response = await fetch('focus.json');
    DATA = await response.json();
  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="6" class="foc-error">Impossible de charger focus.json.</td></tr>';
    counter.textContent = '';
    return;
  }

  fillChoiceGroup(domainOptions, 'foc-domain', [...new Set(DATA.map(f => f.domaine).filter(Boolean))].sort());
  fillChoiceGroup(familyOptions, 'foc-family', [...new Set(DATA.map(f => f.famille).filter(Boolean))].sort());

  search.addEventListener('input', filter);
  domainOptions.addEventListener('change', filter);
  familyOptions.addEventListener('change', filter);
  document.querySelectorAll('#foc-table th[data-col]').forEach(th => {
    th.addEventListener('click', () => {
      if (sortCol === th.dataset.col) sortAsc = !sortAsc;
      else { sortCol = th.dataset.col; sortAsc = true; }
      filter();
    });
  });

  filter();
})();
</script>
