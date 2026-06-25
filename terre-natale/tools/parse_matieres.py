#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
parse_matieres.py — Parse Matières.xlsx et génère :
  - tools/matieres.json
  - app-sheet/src/data/matieres.json
  - docs/matieres/index.md  (compendium filtrable)
"""

from pathlib import Path
import json
import re
import zipfile
import xml.etree.ElementTree as ET

TOOLS_DIR = Path(__file__).parent
XLSX      = TOOLS_DIR / 'src' / 'Matières.xlsx'
JSON_OUT  = TOOLS_DIR / 'matieres.json'
APP_OUT   = TOOLS_DIR.parent / 'app-sheet' / 'src' / 'data' / 'matieres.json'
DOC_OUT   = TOOLS_DIR.parent / 'docs' / 'matieres' / 'index.md'


NS_MAIN = {'x': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
NS_REL = {'r': 'http://schemas.openxmlformats.org/package/2006/relationships'}


def safe(v) -> str:
    if v is None:
        return ''
    return str(v).strip()


def col_index(cell_ref: str) -> int:
    letters = re.match(r'[A-Z]+', cell_ref).group(0)
    index = 0
    for letter in letters:
        index = index * 26 + ord(letter) - ord('A') + 1
    return index - 1


def read_shared_strings(zf: zipfile.ZipFile) -> list[str]:
    try:
        root = ET.fromstring(zf.read('xl/sharedStrings.xml'))
    except KeyError:
        return []

    strings = []
    for item in root.findall('x:si', NS_MAIN):
        strings.append(''.join(t.text or '' for t in item.findall('.//x:t', NS_MAIN)))
    return strings


def sheet_path(zf: zipfile.ZipFile, sheet_name: str) -> str:
    workbook = ET.fromstring(zf.read('xl/workbook.xml'))
    rels = ET.fromstring(zf.read('xl/_rels/workbook.xml.rels'))

    rel_targets = {
        rel.attrib['Id']: rel.attrib['Target']
        for rel in rels.findall('r:Relationship', NS_REL)
    }

    for sheet in workbook.findall('x:sheets/x:sheet', NS_MAIN):
        if sheet.attrib.get('name') != sheet_name:
            continue
        rel_id = sheet.attrib['{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id']
        target = rel_targets[rel_id]
        return 'xl/' + target.lstrip('/')

    raise ValueError(f'Feuille introuvable : {sheet_name}')


def read_xlsx_sheet(path: Path, sheet_name: str) -> list[list[str]]:
    with zipfile.ZipFile(path) as zf:
        shared_strings = read_shared_strings(zf)
        root = ET.fromstring(zf.read(sheet_path(zf, sheet_name)))

    rows = []
    for row in root.findall('.//x:sheetData/x:row', NS_MAIN):
        values = []
        for cell in row.findall('x:c', NS_MAIN):
            idx = col_index(cell.attrib['r'])
            while len(values) <= idx:
                values.append('')

            value_node = cell.find('x:v', NS_MAIN)
            inline_node = cell.find('x:is/x:t', NS_MAIN)
            if inline_node is not None:
                value = inline_node.text or ''
            elif value_node is None:
                value = ''
            elif cell.attrib.get('t') == 's':
                value = shared_strings[int(value_node.text)]
            else:
                value = value_node.text or ''

            values[idx] = value
        rows.append(values)
    return rows


def cell(row: list[str], index: int) -> str:
    return safe(row[index]) if index < len(row) else ''


def parse_niveau(value: str):
    value = safe(value)
    try:
        number = float(value)
        if number.is_integer():
            return int(number)
    except (ValueError, TypeError):
        pass
    return value or 'X'


def applications(entry: dict) -> list[str]:
    labels = []
    if entry['armes']:
        labels.append('Armes')
    if entry['armures']:
        labels.append('Armures et protections')
    if entry['outils']:
        labels.append('Outils, instruments et objets utiles')
    if entry['bijoux']:
        labels.append('Bijoux et colifichets')
    if entry['focalisateurs']:
        labels.append('Focalisateurs')
    return labels


def parse() -> list:
    rows = read_xlsx_sheet(XLSX, 'Matières')
    entries = []
    for row in rows[1:]:
        nom = cell(row, 0)
        if not nom:
            continue
        entry = {
            'nom':          nom,
            'type':         cell(row, 1),
            'niveau':       parse_niveau(cell(row, 2)),
            'effet':        cell(row, 3),
            'armes':        cell(row, 5)  == 'O',
            'outils':       cell(row, 7)  == 'O',
            'armures':      cell(row, 9)  == 'O',
            'bijoux':       cell(row, 11) == 'O',
            'focalisateurs':cell(row, 13) == 'O',
            'effet_special':cell(row, 15),
            'alternative':  cell(row, 17),
            'description':  cell(row, 19),
        }
        entry['applications'] = applications(entry)
        entries.append(entry)
    return entries


def generate_doc(entries: list) -> None:
    DOC_OUT.parent.mkdir(parents=True, exist_ok=True)

    all_types   = sorted(set(e['type'] for e in entries))
    all_niveaux = sorted(set(str(e['niveau']) for e in entries),
                         key=lambda x: (x == 'X', int(float(x)) if x != 'X' else 0))

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

<p class="mat-note">Les applications indiquent les types d'objets pour lesquels la matière est naturellement pertinente. La logique du MJ prévaut : l'objet doit rester utile et cohérent dans une situation de JDR.</p>

<table id="mat-table">
  <thead>
    <tr>
      <th class="col-nom" data-col="nom">Nom ↕</th>
      <th class="col-type" data-col="type">Type ↕</th>
      <th class="col-niv" data-col="niveau">Niv. ↕</th>
      <th class="col-app">Équipements</th>
      <th class="col-effet">Effet</th>
      <th class="col-desc">Description</th>
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
.mat-note {{
  margin: -0.25em 0 1em;
  color: #666;
  font-size: 0.9em;
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
.col-app    {{ width: 15%; }}
.col-effet  {{ width: 20%; }}
.col-desc   {{ width: 18%; }}
.col-special{{ width: 13%; }}
.col-alt    {{ width: 14%; }}
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

  function equipmentTags(e) {{
    const labels = e.applications || [];
    return labels.map(l => `<span class="mat-tag">${{l}}</span>`).join(' ');
  }}

  function render(list) {{
    tbody.innerHTML = '';
    list.forEach(e => {{
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${{e.nom}}</strong></td>
        <td>${{e.type}}</td>
        <td style="text-align:center">${{e.niveau}}</td>
        <td>${{equipmentTags(e)}}</td>
        <td>${{e.effet}}</td>
        <td style="font-size:0.88em;color:#555">${{e.description}}</td>
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
      if (q && ![e.nom, e.type, e.effet, e.description, e.effet_special, e.alternative, ...(e.applications || [])]
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
