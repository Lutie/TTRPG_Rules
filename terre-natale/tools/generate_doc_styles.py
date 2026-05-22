"""
Parse src/Styles - Corpus.csv → tools/styles.json + docs/styles/index.md
Self-contained filterable HTML+JS styles compendium.
"""
import csv, json, os

csv_path = "/home/lutie/Projects/TTRPG_Rules/terre-natale/src/Styles - Corpus.csv"
json_path = "/home/lutie/Projects/TTRPG_Rules/terre-natale/tools/styles.json"
out_path  = "/home/lutie/Projects/TTRPG_Rules/terre-natale/docs/styles/index.md"
os.makedirs(os.path.dirname(out_path), exist_ok=True)

# ---------------------------------------------------------------------------
# Parse CSV
# ---------------------------------------------------------------------------
styles = []
with open(csv_path, encoding="utf-8") as f:
    reader = csv.reader(f)
    header = next(reader)
    for row in reader:
        while len(row) < 6:
            row.append("")
        nom      = row[0].strip()
        origines = row[1].strip()
        pitch    = row[2].strip()
        rang1    = row[3].strip()
        rang2    = row[4].strip()
        rang3    = row[5].strip()
        if not nom:
            continue
        nb_rangs = sum(1 for r in [rang1, rang2, rang3] if r)
        styles.append({
            "nom":      nom,
            "origines": origines,
            "pitch":    pitch,
            "rang1":    rang1,
            "rang2":    rang2,
            "rang3":    rang3,
            "nb_rangs": nb_rangs,
        })

print(f"Styles: {len(styles)}")
print(f"Avec rang3: {sum(1 for s in styles if s['rang3'])}")
print(f"Avec origines: {sum(1 for s in styles if s['origines'])}")

# ---------------------------------------------------------------------------
# Save JSON
# ---------------------------------------------------------------------------
with open(json_path, "w", encoding="utf-8") as f:
    json.dump(styles, f, ensure_ascii=False, indent=2)
print(f"JSON: {json_path}")

# ---------------------------------------------------------------------------
# Generate page
# ---------------------------------------------------------------------------
data_js = json.dumps(styles, ensure_ascii=False, indent=2)

html = f"""# Compendium des Styles

<div id="styles-app">

<div class="sty-filters">
  <input type="text" id="sty-search" placeholder="Rechercher…" />
  <span id="sty-count"></span>
</div>

<table id="sty-table">
  <thead>
    <tr>
      <th class="col-nom"   data-col="nom">Style ↕</th>
      <th class="col-pitch">Pitch</th>
      <th class="col-r1">Rang 1</th>
      <th class="col-r2">Rang 2</th>
      <th class="col-r3">Rang 3</th>
    </tr>
  </thead>
  <tbody id="sty-tbody"></tbody>
</table>

</div>

<style>
#styles-app {{
  font-size: 0.88em;
}}
.sty-filters {{
  display: flex;
  flex-wrap: wrap;
  gap: 0.5em;
  margin-bottom: 1em;
  align-items: center;
}}
.sty-filters input[type=text], .sty-filters select {{
  padding: 0.35em 0.6em;
  border: 1px solid #aaa;
  border-radius: 4px;
  font-size: 0.9em;
  background: var(--md-default-bg-color, #fff);
  color: var(--md-default-fg-color, #000);
}}
.sty-filters input[type=text] {{
  flex: 1;
  min-width: 200px;
}}
#sty-count {{
  margin-left: auto;
  color: #888;
  font-size: 0.85em;
  white-space: nowrap;
}}
#sty-table {{
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}}
#sty-table th, #sty-table td {{
  padding: 0.4em 0.55em;
  border: 1px solid var(--md-default-fg-color--lightest, #e0e0e0);
  vertical-align: top;
  word-break: break-word;
}}
#sty-table th {{
  background: var(--md-primary-fg-color, #3f51b5);
  color: var(--md-primary-bg-color, #fff);
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
}}
#sty-table th:hover {{ opacity: 0.85; }}
.col-nom   {{ width: 9%; }}
.col-pitch {{ width: 15%; font-style: italic; color: #555; }}
.col-r1    {{ width: 25%; }}
.col-r2    {{ width: 25%; }}
.col-r3    {{ width: 26%; }}
#sty-table tbody tr:nth-child(even) {{
  background: var(--md-default-bg-color--light, #f9f9f9);
}}
#sty-table tbody tr:hover {{
  background: var(--md-accent-fg-color--transparent, #e8eaf6);
}}
.sty-nom {{ font-weight: 700; }}
.sty-orig {{
  font-size: 0.78em;
  color: #888;
  margin-top: 0.1em;
}}
.rang-empty {{
  color: #ccc;
  font-style: italic;
  font-size: 0.85em;
}}
</style>

<script>
(function() {{
  const DATA = {data_js};

  const tbody  = document.getElementById('sty-tbody');
  const search = document.getElementById('sty-search');
  const counter= document.getElementById('sty-count');

  let sortCol = 'nom';
  let sortAsc = true;

  function render(list) {{
    tbody.innerHTML = '';
    list.forEach(s => {{
      const tr = document.createElement('tr');
      const origHtml = s.origines
        ? `<div class="sty-orig">${{s.origines}}</div>`
        : '';
      tr.innerHTML = `
        <td><div class="sty-nom">${{s.nom}}</div>${{origHtml}}</td>
        <td>${{s.pitch || ''}}</td>
        <td>${{s.rang1 || '<span class="rang-empty">—</span>'}}</td>
        <td>${{s.rang2 || '<span class="rang-empty">—</span>'}}</td>
        <td>${{s.rang3 || '<span class="rang-empty">—</span>'}}</td>
      `;
      tbody.appendChild(tr);
    }});
    counter.textContent = list.length + ' style' + (list.length !== 1 ? 's' : '');
  }}

  function filter() {{
    const q = search.value.toLowerCase();

    let list = DATA.filter(s => {{
      if (q && ![s.nom, s.pitch, s.rang1, s.rang2, s.rang3]
                .some(t => (t || '').toLowerCase().includes(q))) return false;
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

  document.querySelectorAll('#sty-table th[data-col]').forEach(th => {{
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
