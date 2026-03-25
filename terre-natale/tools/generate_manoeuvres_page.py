"""
Parse tools/manoeuvres.json and generate docs/manoeuvres/index.md
— self-contained filterable HTML+JS manoeuvres compendium.
"""
import json, os

json_path = "/home/lutie/Projects/TTRPG_Rules/terre-natale/tools/manoeuvres.json"
out_path  = "/home/lutie/Projects/TTRPG_Rules/terre-natale/docs/manoeuvres/index.md"
os.makedirs(os.path.dirname(out_path), exist_ok=True)

with open(json_path, encoding="utf-8") as f:
    data = json.load(f)

# Collect unique values for filters
all_types = sorted(set(m["type"] for m in data))
all_cats  = sorted(set(m["categorie"] for m in data))
all_pens  = sorted(set(m["penalite"] for m in data))

def pen_label(p):
    if p > 0: return f"+{p}"
    return str(p)

types_options = "\n".join(f'<option value="{t}">{t}</option>' for t in all_types)
cats_options  = "\n".join(f'<option value="{c}">{c}</option>' for c in all_cats)
pens_options  = "\n".join(f'<option value="{p}">{pen_label(p)}</option>' for p in all_pens)

data_js = json.dumps(data, ensure_ascii=False, indent=2)

print(f"Manoeuvres: {len(data)}")
print(f"Types: {all_types}")
print(f"Catégories: {all_cats}")
print(f"Pénalités: {all_pens}")

html = f"""# Compendium des Manœuvres

<div id="man-app">

<div class="man-filters">
  <input type="text" id="man-search" placeholder="Rechercher…" />
  <select id="man-type">
    <option value="">Tous types</option>
    {types_options}
  </select>
  <select id="man-cat">
    <option value="">Toutes catégories</option>
    {cats_options}
  </select>
  <select id="man-pen">
    <option value="">Toutes pénalités</option>
    {pens_options}
  </select>
  <div class="man-checks">
    <label><input type="checkbox" id="f-att" /> Attaque</label>
    <label><input type="checkbox" id="f-def" /> Défense</label>
    <label><input type="checkbox" id="f-tac" /> Tactique</label>
  </div>
  <div class="man-checks">
    <label><input type="checkbox" id="f-combat" /> Combat</label>
    <label><input type="checkbox" id="f-joute"  /> Joute</label>
    <label><input type="checkbox" id="f-mixte"  /> Mixte</label>
    <label><input type="checkbox" id="f-autre"  /> Autre</label>
  </div>
  <span id="man-count"></span>
</div>

<table id="man-table">
  <thead>
    <tr>
      <th class="col-nom"  data-col="nom">Manœuvre ↕</th>
      <th class="col-type" data-col="type">Type ↕</th>
      <th class="col-cat"  data-col="categorie">Catégorie ↕</th>
      <th class="col-pen"  data-col="penalite">Pén. ↕</th>
      <th class="col-restr">Restr.</th>
      <th class="col-act">Action</th>
      <th class="col-det">Effets / Modularité / Conditions</th>
    </tr>
  </thead>
  <tbody id="man-tbody"></tbody>
</table>

</div>

<style>
#man-app {{
  font-size: 0.88em;
}}
.man-filters {{
  display: flex;
  flex-wrap: wrap;
  gap: 0.5em;
  margin-bottom: 1em;
  align-items: center;
}}
.man-filters input[type=text], .man-filters select {{
  padding: 0.35em 0.6em;
  border: 1px solid #aaa;
  border-radius: 4px;
  font-size: 0.9em;
  background: var(--md-default-bg-color, #fff);
  color: var(--md-default-fg-color, #000);
}}
.man-filters input[type=text] {{
  flex: 1;
  min-width: 160px;
}}
.man-checks {{
  display: flex;
  gap: 0.6em;
  align-items: center;
  flex-wrap: wrap;
}}
.man-checks label {{
  display: flex;
  gap: 0.25em;
  align-items: center;
  cursor: pointer;
  white-space: nowrap;
}}
#man-count {{
  margin-left: auto;
  color: #888;
  font-size: 0.85em;
  white-space: nowrap;
}}
#man-table {{
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}}
#man-table th, #man-table td {{
  padding: 0.4em 0.55em;
  border: 1px solid var(--md-default-fg-color--lightest, #e0e0e0);
  vertical-align: top;
  word-break: break-word;
}}
#man-table th {{
  background: var(--md-primary-fg-color, #3f51b5);
  color: var(--md-primary-bg-color, #fff);
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
}}
#man-table th:hover {{ opacity: 0.85; }}
.col-nom  {{ width: 11%; }}
.col-type {{ width: 8%;  }}
.col-cat  {{ width: 10%; }}
.col-pen  {{ width: 5%;  text-align: center; }}
.col-restr{{ width: 7%;  }}
.col-act  {{ width: 8%;  }}
.col-det  {{ width: 51%; }}
#man-table tbody tr:nth-child(even) {{
  background: var(--md-default-bg-color--light, #f9f9f9);
}}
#man-table tbody tr:hover {{
  background: var(--md-accent-fg-color--transparent, #e8eaf6);
}}
.man-nom {{ font-weight: 600; }}
.man-resume {{ font-style: italic; font-size: 0.85em; color: #666; margin-top: 0.15em; }}
.tag {{
  display: inline-block;
  padding: 0.1em 0.4em;
  border-radius: 3px;
  font-size: 0.78em;
  margin: 0.1em 0.1em 0.1em 0;
  white-space: nowrap;
  font-weight: 500;
}}
.tag-att   {{ background: #fde8d8; color: #7d3200; }}
.tag-def   {{ background: #d8eafd; color: #003d7d; }}
.tag-tac   {{ background: #e8d8fd; color: #4a007d; }}
.tag-combat{{ background: #fdf5d8; color: #5a4a00; }}
.tag-joute {{ background: #d8fde8; color: #00622a; }}
.tag-mixte {{ background: #fdd8f5; color: #62006b; }}
.tag-autre {{ background: #ececec; color: #444; }}
.pen-neg  {{ color: #c0392b; font-weight: 700; }}
.pen-pos  {{ color: #27ae60; font-weight: 700; }}
.pen-zero {{ color: #888; }}
.man-effets {{ margin-bottom: 0.3em; }}
.man-sub {{ font-size: 0.85em; color: #555; margin-top: 0.25em; }}
.man-sub-label {{ font-weight: 600; color: #333; }}
</style>

<script>
(function() {{
  const DATA = {data_js};

  const tbody   = document.getElementById('man-tbody');
  const search  = document.getElementById('man-search');
  const selType = document.getElementById('man-type');
  const selCat  = document.getElementById('man-cat');
  const selPen  = document.getElementById('man-pen');
  const fAtt    = document.getElementById('f-att');
  const fDef    = document.getElementById('f-def');
  const fTac    = document.getElementById('f-tac');
  const fCombat = document.getElementById('f-combat');
  const fJoute  = document.getElementById('f-joute');
  const fMixte  = document.getElementById('f-mixte');
  const fAutre  = document.getElementById('f-autre');
  const counter = document.getElementById('man-count');

  let sortCol = 'nom';
  let sortAsc = true;

  function penHtml(p) {{
    const lbl = p > 0 ? '+' + p : String(p);
    const cls = p < 0 ? 'pen-neg' : p > 0 ? 'pen-pos' : 'pen-zero';
    return `<span class="${{cls}}">${{lbl}}</span>`;
  }}

  function restrTags(r) {{
    const out = [];
    if (r.att) out.push('<span class="tag tag-att">Att</span>');
    if (r.def) out.push('<span class="tag tag-def">Déf</span>');
    if (r.tac) out.push('<span class="tag tag-tac">Tac</span>');
    return out.join(' ');
  }}

  function actionTags(t) {{
    const out = [];
    if (t.combat) out.push('<span class="tag tag-combat">Combat</span>');
    if (t.joute)  out.push('<span class="tag tag-joute">Joute</span>');
    if (t.mixte)  out.push('<span class="tag tag-mixte">Mixte</span>');
    if (t.autre)  out.push('<span class="tag tag-autre">Autre</span>');
    return out.join(' ');
  }}

  function detailHtml(m) {{
    let html = `<div class="man-effets">${{m.effets}}</div>`;
    if (m.modularite) html += `<div class="man-sub"><span class="man-sub-label">Modularité : </span>${{m.modularite}}</div>`;
    if (m.conditions) html += `<div class="man-sub"><span class="man-sub-label">Conditions : </span>${{m.conditions}}</div>`;
    if (m.notes)      html += `<div class="man-sub"><span class="man-sub-label">Notes : </span>${{m.notes}}</div>`;
    return html;
  }}

  function render(list) {{
    tbody.innerHTML = '';
    list.forEach(m => {{
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <div class="man-nom">${{m.nom}}</div>
          <div class="man-resume">${{m.resume}}</div>
        </td>
        <td>${{m.type}}</td>
        <td>${{m.categorie}}</td>
        <td style="text-align:center">${{penHtml(m.penalite)}}</td>
        <td>${{restrTags(m.restrictions)}}</td>
        <td>${{actionTags(m.types_action)}}</td>
        <td>${{detailHtml(m)}}</td>
      `;
      tbody.appendChild(tr);
    }});
    counter.textContent = list.length + ' manœuvre' + (list.length !== 1 ? 's' : '');
  }}

  function filter() {{
    const q   = search.value.toLowerCase();
    const typ = selType.value;
    const cat = selCat.value;
    const pen = selPen.value;

    let list = DATA.filter(m => {{
      if (typ && m.type !== typ) return false;
      if (cat && m.categorie !== cat) return false;
      if (pen !== '' && String(m.penalite) !== pen) return false;
      if (fAtt.checked    && !m.restrictions.att)    return false;
      if (fDef.checked    && !m.restrictions.def)    return false;
      if (fTac.checked    && !m.restrictions.tac)    return false;
      if (fCombat.checked && !m.types_action.combat) return false;
      if (fJoute.checked  && !m.types_action.joute)  return false;
      if (fMixte.checked  && !m.types_action.mixte)  return false;
      if (fAutre.checked  && !m.types_action.autre)  return false;
      if (q && !m.nom.toLowerCase().includes(q) &&
               !m.resume.toLowerCase().includes(q) &&
               !m.effets.toLowerCase().includes(q) &&
               !m.type.toLowerCase().includes(q)) return false;
      return true;
    }});

    list = list.slice().sort((a, b) => {{
      let va = sortCol === 'penalite' ? a[sortCol] : (a[sortCol] || '').toLowerCase();
      let vb = sortCol === 'penalite' ? b[sortCol] : (b[sortCol] || '').toLowerCase();
      if (va < vb) return sortAsc ? -1 : 1;
      if (va > vb) return sortAsc ?  1 : -1;
      return 0;
    }});

    render(list);
  }}

  [search, selType, selCat, selPen, fAtt, fDef, fTac, fCombat, fJoute, fMixte, fAutre]
    .forEach(el => el.addEventListener(el.tagName === 'INPUT' && el.type === 'text' ? 'input' : 'change', filter));

  document.querySelectorAll('#man-table th[data-col]').forEach(th => {{
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
