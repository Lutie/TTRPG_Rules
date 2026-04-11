"""
Parse src/Conditions - Conditions.csv and generate:
  - app-sheet/src/data/conditions.json  (données brutes pour la sheet React)
  - docs/conditions/index.md            (compendium HTML+JS filtrable)
"""
import csv, json, re, os

csv_path  = "/home/lutie/Projects/TTRPG_Rules/terre-natale/src/Conditions - Conditions.csv"
out_path  = "/home/lutie/Projects/TTRPG_Rules/terre-natale/docs/conditions/index.md"
json_path = "/home/lutie/Projects/TTRPG_Rules/terre-natale/app-sheet/src/data/conditions.json"
os.makedirs(os.path.dirname(out_path), exist_ok=True)
os.makedirs(os.path.dirname(json_path), exist_ok=True)

# ---------------------------------------------------------------------------
# Category labels
# ---------------------------------------------------------------------------
CAT_LABELS = {
    "Avtg/Dsvgt":   "Avantage / Désavantage",
    "Jet mod":      "Modificateur de Jet",
    "Test mod":     "Modificateur de Test",
    "Carac buff":   "Caractéristique",
    "Action eco":   "Économie d'Action",
    "Attributs mod":"Attributs",
    "Résist elem":  "Résistance Élémentaire",
    "Spécial":      "Spécial",
    "HOT/DOT":      "HOT / DOT",
}

# ---------------------------------------------------------------------------
# Parse CSV
# ---------------------------------------------------------------------------
conditions = []
current_cat = ""

with open(csv_path, encoding="utf-8") as f:
    reader = csv.reader(f)
    rows = list(reader)

# Row 0 is header: ,Nom,Domaine A,Domaine B,Type,Effets,,Nom,Domaine A,Domaine B,Type,Effets
for row in rows[1:]:
    # Pad row to at least 12 columns
    while len(row) < 12:
        row.append("")

    cat_raw   = row[0].strip()
    nom_pos   = row[1].strip()
    dom_a_pos = row[2].strip()
    dom_b_pos = row[3].strip()
    type_pos  = row[4].strip()
    eff_pos   = row[5].strip()

    nom_neg   = row[7].strip()
    dom_a_neg = row[8].strip()
    dom_b_neg = row[9].strip()
    type_neg  = row[10].strip()
    eff_neg   = row[11].strip()

    if cat_raw:
        current_cat = cat_raw

    cat_label = CAT_LABELS.get(current_cat, current_cat)

    # Positive condition
    if nom_pos and "<TODO" not in eff_pos:
        conditions.append({
            "nom":      nom_pos,
            "polarite": "positive",
            "categorie": cat_label,
            "cat_key":  current_cat,
            "domaine_a": dom_a_pos,
            "domaine_b": dom_b_pos,
            "sauvegarde": type_pos,
            "effet":    eff_pos,
        })

    # Negative condition
    if nom_neg and "<TODO" not in eff_neg:
        conditions.append({
            "nom":      nom_neg,
            "polarite": "negative",
            "categorie": cat_label,
            "cat_key":  current_cat,
            "domaine_a": dom_a_neg,
            "domaine_b": dom_b_neg,
            "sauvegarde": type_neg,
            "effet":    eff_neg,
        })

# Collect unique domains and categories for filter dropdowns
all_domains = sorted(set(
    d for c in conditions
    for d in [c["domaine_a"], c["domaine_b"]] if d
))
all_cats = list(dict.fromkeys(
    c["categorie"] for c in conditions
))

print(f"Parsed {len(conditions)} conditions ({sum(1 for c in conditions if c['polarite']=='positive')} pos, {sum(1 for c in conditions if c['polarite']=='negative')} neg)")
print(f"Categories: {len(all_cats)}, Domains: {len(all_domains)}")

# ---------------------------------------------------------------------------
# Write JSON for app-sheet
# ---------------------------------------------------------------------------
with open(json_path, "w", encoding="utf-8") as f:
    json.dump(conditions, f, ensure_ascii=False, indent=2)
print(f"Generated: {json_path}")

# ---------------------------------------------------------------------------
# Generate page
# ---------------------------------------------------------------------------
data_js = json.dumps(conditions, ensure_ascii=False, indent=2)

cats_options = "\n".join(
    f'<option value="{c}">{c}</option>'
    for c in all_cats
)
domains_options = "\n".join(
    f'<option value="{d}">{d}</option>'
    for d in all_domains
)

html = f"""# Compendium des Conditions

<div id="conditions-app">

<div class="cond-filters">
  <input type="text" id="cond-search" placeholder="Rechercher…" />
  <select id="cond-polarite">
    <option value="">Positives &amp; Négatives</option>
    <option value="positive">Positives uniquement</option>
    <option value="negative">Négatives uniquement</option>
  </select>
  <select id="cond-categorie">
    <option value="">Toutes catégories</option>
    {cats_options}
  </select>
  <select id="cond-domaine">
    <option value="">Tous domaines</option>
    {domains_options}
  </select>
  <span id="cond-count"></span>
</div>

<table id="cond-table">
  <thead>
    <tr>
      <th class="col-nom" data-col="nom">Condition ↕</th>
      <th class="col-pol" data-col="polarite">Polarité ↕</th>
      <th class="col-cat" data-col="categorie">Catégorie ↕</th>
      <th class="col-dom">Domaines</th>
      <th class="col-sav">Sauvegarde</th>
      <th class="col-eff">Effet</th>
    </tr>
  </thead>
  <tbody id="cond-tbody"></tbody>
</table>

</div>

<style>
#conditions-app {{
  font-size: 0.9em;
}}
.cond-filters {{
  display: flex;
  flex-wrap: wrap;
  gap: 0.5em;
  margin-bottom: 1em;
  align-items: center;
}}
.cond-filters input, .cond-filters select {{
  padding: 0.35em 0.6em;
  border: 1px solid #aaa;
  border-radius: 4px;
  font-size: 0.9em;
  background: var(--md-default-bg-color, #fff);
  color: var(--md-default-fg-color, #000);
}}
.cond-filters input {{
  flex: 1;
  min-width: 160px;
}}
#cond-count {{
  margin-left: auto;
  color: #888;
  font-size: 0.85em;
  white-space: nowrap;
}}
#cond-table {{
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}}
#cond-table th, #cond-table td {{
  padding: 0.4em 0.6em;
  border: 1px solid var(--md-default-fg-color--lightest, #e0e0e0);
  vertical-align: top;
  word-break: break-word;
}}
#cond-table th {{
  background: var(--md-primary-fg-color, #3f51b5);
  color: var(--md-primary-bg-color, #fff);
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
}}
#cond-table th:hover {{ opacity: 0.85; }}
.col-nom  {{ width: 11%; }}
.col-pol  {{ width: 8%; }}
.col-cat  {{ width: 14%; }}
.col-dom  {{ width: 10%; }}
.col-sav  {{ width: 8%; }}
.col-eff  {{ width: 49%; }}
.badge {{
  display: inline-block;
  padding: 0.15em 0.5em;
  border-radius: 3px;
  font-size: 0.82em;
  font-weight: 600;
  white-space: nowrap;
}}
.badge-pos {{ background: #d4edda; color: #155724; }}
.badge-neg {{ background: #f8d7da; color: #721c24; }}
.dom-tag {{
  display: inline-block;
  background: var(--md-code-bg-color, #f5f5f5);
  border-radius: 3px;
  padding: 0.1em 0.4em;
  font-size: 0.82em;
  margin: 0.1em 0.1em 0.1em 0;
  white-space: nowrap;
}}
#cond-table tbody tr:nth-child(even) {{
  background: var(--md-default-bg-color--light, #f9f9f9);
}}
#cond-table tbody tr:hover {{
  background: var(--md-accent-fg-color--transparent, #e8eaf6);
}}
</style>

<script>
(function() {{
  const DATA = {data_js};

  const tbody   = document.getElementById('cond-tbody');
  const search  = document.getElementById('cond-search');
  const selPol  = document.getElementById('cond-polarite');
  const selCat  = document.getElementById('cond-categorie');
  const selDom  = document.getElementById('cond-domaine');
  const counter = document.getElementById('cond-count');

  let sortCol = 'nom';
  let sortAsc = true;

  function domTags(a, b) {{
    return [a, b].filter(Boolean)
      .map(d => `<span class="dom-tag">${{d}}</span>`)
      .join(' ');
  }}

  function render(list) {{
    tbody.innerHTML = '';
    list.forEach(c => {{
      const polBadge = c.polarite === 'positive'
        ? '<span class="badge badge-pos">Positive</span>'
        : '<span class="badge badge-neg">Négative</span>';
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${{c.nom}}</strong></td>
        <td>${{polBadge}}</td>
        <td>${{c.categorie}}</td>
        <td>${{domTags(c.domaine_a, c.domaine_b)}}</td>
        <td>${{c.sauvegarde || ''}}</td>
        <td>${{c.effet}}</td>
      `;
      tbody.appendChild(tr);
    }});
    counter.textContent = list.length + ' condition' + (list.length !== 1 ? 's' : '');
  }}

  function filter() {{
    const q   = search.value.toLowerCase();
    const pol = selPol.value;
    const cat = selCat.value;
    const dom = selDom.value;

    let list = DATA.filter(c => {{
      if (pol && c.polarite !== pol) return false;
      if (cat && c.categorie !== cat) return false;
      if (dom && c.domaine_a !== dom && c.domaine_b !== dom) return false;
      if (q && !c.nom.toLowerCase().includes(q) &&
               !c.effet.toLowerCase().includes(q) &&
               !c.categorie.toLowerCase().includes(q)) return false;
      return true;
    }});

    list = list.slice().sort((a, b) => {{
      const va = (a[sortCol] || '').toLowerCase();
      const vb = (b[sortCol] || '').toLowerCase();
      return sortAsc ? va.localeCompare(vb) : vb.localeCompare(va);
    }});

    render(list);
  }}

  search.addEventListener('input', filter);
  selPol.addEventListener('change', filter);
  selCat.addEventListener('change', filter);
  selDom.addEventListener('change', filter);

  document.querySelectorAll('#cond-table th[data-col]').forEach(th => {{
    th.addEventListener('click', () => {{
      if (sortCol === th.dataset.col) sortAsc = !sortAsc;
      else {{ sortCol = th.dataset.col; sortAsc = true; }}
      filter();
    }});
  }});

  filter();
}})();
</script>
"""

with open(out_path, "w", encoding="utf-8") as f:
    f.write(html)

print(f"Generated: {out_path}")
