#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
parse_matieres.py — Parse Matières.xlsx et génère :
  - tools/matieres.json
  - app-sheet/src/data/matieres.json
  - docs/matieres/index.md  (compendium filtrable)
"""

from pathlib import Path
import pandas as pd
import json

TOOLS_DIR = Path(__file__).parent
XLSX      = TOOLS_DIR / 'src' / 'Matières.xlsx'
JSON_OUT  = TOOLS_DIR / 'matieres.json'
APP_OUT   = TOOLS_DIR.parent / 'app-sheet' / 'src' / 'data' / 'matieres.json'
DOC_OUT   = TOOLS_DIR.parent / 'docs' / 'matieres' / 'index.md'


def safe(v) -> str:
    if pd.isna(v):
        return ''
    return str(v).strip()


def parse() -> list:
    df = pd.read_excel(XLSX, sheet_name='Matières', header=None)
    entries = []
    for i in range(1, len(df)):
        row = df.iloc[i]
        nom = safe(row.iloc[0])
        if not nom:
            continue
        niveau_raw = safe(row.iloc[2])
        try:
            niveau = int(niveau_raw)
        except (ValueError, TypeError):
            niveau = niveau_raw or 'X'
        entries.append({
            'nom':          nom,
            'type':         safe(row.iloc[1]),
            'niveau':       niveau,
            'effet':        safe(row.iloc[3]),
            'armes':        safe(row.iloc[5])  == 'O',
            'outils':       safe(row.iloc[7])  == 'O',
            'armures':      safe(row.iloc[9])  == 'O',
            'bijoux':       safe(row.iloc[11]) == 'O',
            'focalisateurs':safe(row.iloc[13]) == 'O',
            'effet_special':safe(row.iloc[15]),
            'alternative':  safe(row.iloc[17]),
        })
    return entries


def generate_doc(entries: list) -> None:
    DOC_OUT.parent.mkdir(parents=True, exist_ok=True)

    all_types   = sorted(set(e['type'] for e in entries))
    all_niveaux = sorted(set(str(e['niveau']) for e in entries),
                         key=lambda x: (x == 'X', int(x) if x != 'X' else 0))

    data_js        = json.dumps(entries, ensure_ascii=False, indent=2)
    types_options  = '\n'.join(f'<option value="{t}">{t}</option>' for t in all_types)
    niveaux_options= '\n'.join(f'<option value="{n}">Niveau {n}</option>' for n in all_niveaux)

    page = f"""# Compendium des Matières

<div id="mat-app">

<div class="mat-filters">
  <input type="text" id="mat-search" placeholder="Rechercher…" />
  <select id="mat-type">
    <option value="">Tous les types</option>
    {types_options}
  </select>
  <select id="mat-niveau">
    <option value="">Tous niveaux</option>
    {niveaux_options}
  </select>
  <div class="mat-checks">
    <label><input type="checkbox" id="f-armes" /> Armes</label>
    <label><input type="checkbox" id="f-outils" /> Outils</label>
    <label><input type="checkbox" id="f-armures" /> Armures</label>
    <label><input type="checkbox" id="f-bijoux" /> Bijoux</label>
    <label><input type="checkbox" id="f-foca" /> Focalisateurs</label>
  </div>
  <span id="mat-count"></span>
</div>

<table id="mat-table">
  <thead>
    <tr>
      <th class="col-nom" data-col="nom">Nom ↕</th>
      <th class="col-type" data-col="type">Type ↕</th>
      <th class="col-niv" data-col="niveau">Niv. ↕</th>
      <th class="col-app">Usage</th>
      <th class="col-effet">Effet</th>
      <th class="col-special">Effet Spécial</th>
      <th class="col-alt">Alternative</th>
    </tr>
  </thead>
  <tbody id="mat-tbody"></tbody>
</table>

</div>

<style>
#mat-app {{ font-size: 0.85em; }}
.mat-filters {{
  display: flex;
  flex-wrap: wrap;
  gap: 0.5em;
  margin-bottom: 1em;
  align-items: center;
}}
.mat-filters input[type=text] {{
  flex: 1;
  min-width: 200px;
  padding: 0.35em 0.6em;
  border: 1px solid #aaa;
  border-radius: 4px;
  font-size: 0.9em;
  background: var(--md-default-bg-color, #fff);
  color: var(--md-default-fg-color, #000);
}}
.mat-filters select {{
  padding: 0.35em 0.6em;
  border: 1px solid #aaa;
  border-radius: 4px;
  font-size: 0.9em;
  background: var(--md-default-bg-color, #fff);
  color: var(--md-default-fg-color, #000);
}}
.mat-checks {{
  display: flex;
  gap: 0.8em;
  align-items: center;
  flex-wrap: wrap;
}}
.mat-checks label {{
  display: flex;
  align-items: center;
  gap: 0.3em;
  cursor: pointer;
  font-size: 0.9em;
}}
#mat-count {{
  margin-left: auto;
  color: #888;
  font-size: 0.85em;
  white-space: nowrap;
}}
#mat-table {{
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}}
#mat-table th, #mat-table td {{
  padding: 0.35em 0.5em;
  border: 1px solid var(--md-default-fg-color--lightest, #e0e0e0);
  vertical-align: top;
  word-break: break-word;
}}
#mat-table th {{
  background: var(--md-primary-fg-color, #3f51b5);
  color: var(--md-primary-bg-color, #fff);
  cursor: pointer;
  user-select: none;
}}
#mat-table th:hover {{ opacity: 0.85; }}
.col-nom    {{ width: 9%; }}
.col-type   {{ width: 7%; }}
.col-niv    {{ width: 4%; text-align: center; }}
.col-app    {{ width: 10%; }}
.col-effet  {{ width: 28%; }}
.col-special{{ width: 21%; }}
.col-alt    {{ width: 21%; }}
#mat-table tbody tr:nth-child(even) {{
  background: var(--md-default-bg-color--light, #f9f9f9);
}}
#mat-table tbody tr:hover {{
  background: var(--md-accent-fg-color--transparent, #e8eaf6);
}}
.mat-tag {{
  display: inline-block;
  font-size: 0.75em;
  padding: 0.1em 0.4em;
  border-radius: 3px;
  background: var(--md-primary-fg-color, #3f51b5);
  color: var(--md-primary-bg-color, #fff);
  margin: 0.1em;
}}
</style>

<script>
(function() {{
  const DATA = {data_js};

  const tbody    = document.getElementById('mat-tbody');
  const search   = document.getElementById('mat-search');
  const selType  = document.getElementById('mat-type');
  const selNiv   = document.getElementById('mat-niveau');
  const chkArmes  = document.getElementById('f-armes');
  const chkOutils = document.getElementById('f-outils');
  const chkArmures= document.getElementById('f-armures');
  const chkBijoux = document.getElementById('f-bijoux');
  const chkFoca   = document.getElementById('f-foca');
  const counter  = document.getElementById('mat-count');

  let sortCol = null;
  let sortAsc = true;

  function tags(e) {{
    const t = [];
    if (e.armes)         t.push('Armes');
    if (e.outils)        t.push('Outils');
    if (e.armures)       t.push('Armures');
    if (e.bijoux)        t.push('Bijoux');
    if (e.focalisateurs) t.push('Foca.');
    return t.map(l => `<span class="mat-tag">${{l}}</span>`).join(' ');
  }}

  function render(list) {{
    tbody.innerHTML = '';
    list.forEach(e => {{
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${{e.nom}}</strong></td>
        <td>${{e.type}}</td>
        <td style="text-align:center">${{e.niveau}}</td>
        <td>${{tags(e)}}</td>
        <td>${{e.effet}}</td>
        <td style="font-size:0.88em;color:#555">${{e.effet_special}}</td>
        <td style="font-size:0.88em;color:#555">${{e.alternative === '//' ? '' : e.alternative}}</td>
      `;
      tbody.appendChild(tr);
    }});
    counter.textContent = list.length + ' matière' + (list.length !== 1 ? 's' : '');
  }}

  function filter() {{
    const q   = search.value.toLowerCase();
    const t   = selType.value;
    const n   = selNiv.value;

    let list = DATA.filter(e => {{
      if (t && e.type !== t) return false;
      if (n && String(e.niveau) !== n) return false;
      if (chkArmes.checked   && !e.armes)         return false;
      if (chkOutils.checked  && !e.outils)        return false;
      if (chkArmures.checked && !e.armures)       return false;
      if (chkBijoux.checked  && !e.bijoux)        return false;
      if (chkFoca.checked    && !e.focalisateurs) return false;
      if (q && ![e.nom, e.type, e.effet, e.effet_special, e.alternative]
               .some(s => (s || '').toLowerCase().includes(q))) return false;
      return true;
    }});

    if (sortCol) {{
      list = list.slice().sort((a, b) => {{
        const va = String(a[sortCol] ?? '').toLowerCase();
        const vb = String(b[sortCol] ?? '').toLowerCase();
        return sortAsc ? va.localeCompare(vb) : vb.localeCompare(va);
      }});
    }}

    render(list);
  }}

  [search, selType, selNiv, chkArmes, chkOutils, chkArmures, chkBijoux, chkFoca]
    .forEach(el => el.addEventListener('input', filter));

  document.querySelectorAll('#mat-table th[data-col]').forEach(th => {{
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
    DOC_OUT.write_text(page, encoding='utf-8')
    print(f'[OK] Doc : {DOC_OUT} ({len(entries)} matières)')


def main() -> None:
    entries = parse()
    print(f'[OK] {len(entries)} matières parsées')

    JSON_OUT.write_text(json.dumps(entries, ensure_ascii=False, indent=2), encoding='utf-8')
    print(f'[OK] JSON : {JSON_OUT}')

    APP_OUT.parent.mkdir(parents=True, exist_ok=True)
    APP_OUT.write_text(json.dumps(entries, ensure_ascii=False, indent=2), encoding='utf-8')
    print(f'[OK] App JSON : {APP_OUT}')

    generate_doc(entries)


if __name__ == '__main__':
    main()
