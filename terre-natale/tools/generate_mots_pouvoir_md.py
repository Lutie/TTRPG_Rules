#!/usr/bin/env python3
"""
Génère les 3 pages de mots de pouvoir depuis tools/mots-pouvoir.json :
  docs/mots-de-pouvoir/liaisons.md
  docs/mots-de-pouvoir/annexes.md
  docs/mots-de-pouvoir/formes.md

Usage : python tools/generate_mots_pouvoir_md.py
"""
import json
from pathlib import Path

JSON_SRC = Path(__file__).parent / "mots-pouvoir.json"
DOCS_DIR = Path(__file__).parent.parent / "docs" / "mots-de-pouvoir"


# ─── helpers ──────────────────────────────────────────────────────────────────

def js_array(items):
    """Sérialise une liste Python en JS array inline (2-space indent)."""
    return json.dumps(items, ensure_ascii=False, indent=2)


def domain_values(words):
    """Retourne les domaines uniques, triés, pour un filtre <select>."""
    seen = set()
    out = []
    for w in words:
        for d in w.get("domain", "").split(","):
            d = d.strip()
            if d and d not in seen:
                seen.add(d)
                out.append(d)
    return sorted(out)


def enum_values(words, field):
    """Retourne les valeurs uniques d'un champ, triées."""
    seen = set()
    out = []
    for w in words:
        v = w.get(field, "").strip()
        if v and v not in seen:
            seen.add(v)
            out.append(v)
    return sorted(out)


# ─── CSS commun ───────────────────────────────────────────────────────────────

COMMON_CSS = """
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
"""

SORT_JS = """
  function sortBy(col) {
    if (sortCol === col) sortAsc = !sortAsc;
    else { sortCol = col; sortAsc = true; }
    filter();
  }
  document.querySelectorAll('.mp-table th[data-col]').forEach(th => {
    th.addEventListener('click', () => sortBy(th.dataset.col));
  });
"""

FMT_JS = """
  function fmtText(t) {
    if (!t) return '';
    return t.replace(/\\[([^\\]]+)\\]/g, '<span class="mp-bracket">[$1]</span>');
  }
  function fmtTag(t) {
    if (!t) return '';
    return t.split(',').map(s => s.trim()).filter(Boolean)
             .map(s => '<span class="mp-tag">' + s + '</span>').join(' ');
  }
"""


# ─── PAGE LIAISONS ─────────────────────────────────────────────────────────────

def gen_liaisons(words):
    sort_types = enum_values(words, "sort_type")
    st_opts = "\n".join(f'<option value="{v}">{v}</option>' for v in sort_types)

    data_js = js_array(words)

    return f"""# Liaisons

> Mots modificateurs combinables avec n'importe quel sort. Certains sont limités à un domaine ou un type de sort.

<div class="mp-app">

<div class="mp-filters">
  <input type="text" id="mp-search" placeholder="Rechercher (nom, description…)" />
  <select id="mp-sort-type">
    <option value="">Tous types de sort</option>
    {st_opts}
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

{COMMON_CSS}
<script>
(function() {{
  const DATA = {data_js};
  const tbody  = document.getElementById('mp-tbody');
  const search = document.getElementById('mp-search');
  const selST  = document.getElementById('mp-sort-type');
  const counter = document.getElementById('mp-count');
  let sortCol = null, sortAsc = true;

{FMT_JS}

  function render(list) {{
    tbody.innerHTML = '';
    list.forEach(w => {{
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
    }});
    counter.textContent = list.length + ' mot' + (list.length !== 1 ? 's' : '');
  }}

  function filter() {{
    const q  = search.value.toLowerCase();
    const st = selST.value;
    let list = DATA.filter(w => {{
      if (st && w.sort_type !== st) return false;
      if (q && ![w.name, w.description, w.domain, w.conditions]
                 .some(s => (s||'').toLowerCase().includes(q))) return false;
      return true;
    }});
    if (sortCol) {{
      list = list.slice().sort((a, b) => {{
        const va = String(a[sortCol]||'').toLowerCase();
        const vb = String(b[sortCol]||'').toLowerCase();
        return sortAsc ? va.localeCompare(vb) : vb.localeCompare(va);
      }});
    }}
    render(list);
  }}

  search.addEventListener('input', filter);
  selST.addEventListener('change', filter);
{SORT_JS}
  filter();
}})();
</script>
"""


# ─── PAGE ANNEXES ─────────────────────────────────────────────────────────────

def gen_annexes(words):
    data_js = js_array(words)
    return f"""# Annexes (Mots Avancés)

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

{COMMON_CSS}
<script>
(function() {{
  const DATA = {data_js};
  const tbody  = document.getElementById('mp-tbody');
  const search = document.getElementById('mp-search');
  const counter = document.getElementById('mp-count');
  let sortCol = null, sortAsc = true;

{FMT_JS}

  function render(list) {{
    tbody.innerHTML = '';
    list.forEach(w => {{
      const tr = document.createElement('tr');
      tr.innerHTML =
        '<td><strong>' + w.name + '</strong></td>' +
        '<td style="text-align:center">' + (w.difficulty || '—') + '</td>' +
        '<td style="text-align:center">' + (w.drain || '—') + '</td>' +
        '<td>' + fmtText(w.description) + '</td>';
      tbody.appendChild(tr);
    }});
    counter.textContent = list.length + ' mot' + (list.length !== 1 ? 's' : '');
  }}

  function filter() {{
    const q = search.value.toLowerCase();
    let list = DATA.filter(w =>
      !q || [w.name, w.description].some(s => (s||'').toLowerCase().includes(q))
    );
    if (sortCol) {{
      list = list.slice().sort((a, b) => {{
        const va = String(a[sortCol]||'').toLowerCase();
        const vb = String(b[sortCol]||'').toLowerCase();
        return sortAsc ? va.localeCompare(vb) : vb.localeCompare(va);
      }});
    }}
    render(list);
  }}

  search.addEventListener('input', filter);
{SORT_JS}
  filter();
}})();
</script>
"""


# ─── PAGE FORMES ──────────────────────────────────────────────────────────────

def gen_formes(words):
    sub_types = enum_values(words, "sub_type")
    st_opts = "\n".join(f'<option value="{v}">{v}</option>' for v in sub_types)

    data_js = js_array(words)

    return f"""# Formes

> Les mots de Forme définissent comment le sort se propage dans l'espace et dans le temps.

<div class="mp-app">

<div class="mp-filters">
  <input type="text" id="mp-search" placeholder="Rechercher…" />
  <select id="mp-sub-type">
    <option value="">Tous sous-types</option>
    {st_opts}
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

{COMMON_CSS}
<script>
(function() {{
  const DATA = {data_js};
  const tbody  = document.getElementById('mp-tbody');
  const search = document.getElementById('mp-search');
  const selST  = document.getElementById('mp-sub-type');
  const counter = document.getElementById('mp-count');
  let sortCol = null, sortAsc = true;

{FMT_JS}

  function render(list) {{
    tbody.innerHTML = '';
    list.forEach(w => {{
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
    }});
    counter.textContent = list.length + ' mot' + (list.length !== 1 ? 's' : '');
  }}

  function filter() {{
    const q  = search.value.toLowerCase();
    const st = selST.value;
    let list = DATA.filter(w => {{
      if (st && w.sub_type !== st) return false;
      if (q && ![w.name, w.description, w.mag_mod, w.domain]
                 .some(s => (s||'').toLowerCase().includes(q))) return false;
      return true;
    }});
    if (sortCol) {{
      list = list.slice().sort((a, b) => {{
        const va = String(a[sortCol]||'').toLowerCase();
        const vb = String(b[sortCol]||'').toLowerCase();
        return sortAsc ? va.localeCompare(vb) : vb.localeCompare(va);
      }});
    }}
    render(list);
  }}

  search.addEventListener('input', filter);
  selST.addEventListener('change', filter);
{SORT_JS}
  filter();
}})();
</script>
"""


# ─── MAIN ─────────────────────────────────────────────────────────────────────

def main():
    data = json.loads(JSON_SRC.read_text(encoding="utf-8"))

    liaisons = [w for w in data if w["category"] == "Liaison"]
    annexes  = [w for w in data if w["category"] == "Annexe"]
    formes   = [w for w in data if w["category"] == "Forme"]

    pages = [
        ("liaisons.md", gen_liaisons(liaisons)),
        ("annexes.md",  gen_annexes(annexes)),
        ("formes.md",   gen_formes(formes)),
    ]

    for fname, content in pages:
        path = DOCS_DIR / fname
        path.write_text(content, encoding="utf-8")
        print(f"  Écrit : {path.name}")

    print(f"  Liaisons: {len(liaisons)}, Annexes: {len(annexes)}, Formes: {len(formes)}")


if __name__ == "__main__":
    main()
