#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generate filterable HTML+JS documentation pages for magic word tables.
Reads all_magic_words.json and other_magic_words.json.
Outputs docs/mots-de-pouvoir/*.md (one per school + one for liaisons/annexes/formes).
"""

from pathlib import Path
import json

TOOLS_DIR = Path(__file__).parent
DOCS_DIR = TOOLS_DIR.parent / "docs" / "mots-de-pouvoir"

ALL_WORDS_JSON = TOOLS_DIR / "all_magic_words.json"
OTHER_WORDS_JSON = TOOLS_DIR / "other_magic_words.json"

SCHOOL_META = {
    "Dest":  {"label": "École de Destruction",  "filename": "destruction.md",  "symbol": "✸"},
    "Rest":  {"label": "École de Restauration", "filename": "restauration.md", "symbol": "⌖"},
    "Béné":  {"label": "École de Bénédiction",  "filename": "benediction.md",  "symbol": "✧"},
    "Malé":  {"label": "École de Malédiction",  "filename": "malediction.md",  "symbol": "⧖"},
    "Invoc": {"label": "École d'Invocation",    "filename": "invocation.md",   "symbol": "✪"},
    "Abju":  {"label": "École d'Abjuration",    "filename": "abjuration.md",   "symbol": "⛊"},
    "Divi":  {"label": "École de Divination",   "filename": "divination.md",   "symbol": "⊙"},
    "Evoc":  {"label": "École d'Évocation",     "filename": "evocation.md",    "symbol": "⧉"},
    "Conj":  {"label": "École de Conjuration",  "filename": "conjuration.md",  "symbol": "⧗"},
    "Alté":  {"label": "École d'Altération",    "filename": "alteration.md",   "symbol": "≈"},
}


def strip_symbol(vulgar: str, school_code: str) -> str:
    symbol = SCHOOL_META.get(school_code, {}).get("symbol", "")
    if symbol and vulgar.endswith(" " + symbol):
        return vulgar[:-(len(symbol) + 1)]
    return vulgar


def generate_school_page(school_code: str, meta: dict, words: list) -> None:
    label = meta["label"]
    out_path = DOCS_DIR / meta["filename"]

    all_types = sorted(set(w["word_type"] for w in words if w.get("word_type")))
    all_targets = sorted(set(w["target_type"] for w in words if w.get("target_type")))

    js_data = []
    for i, w in enumerate(words, 1):
        js_data.append({
            "num": i,
            "vulgar": strip_symbol(w.get("vulgar", ""), school_code),
            "latin": w.get("latin", ""),
            "arcane": w.get("arcane", ""),
            "word_type": w.get("word_type", ""),
            "target_type": w.get("target_type", ""),
            "difficulty": str(w.get("difficulty", "")),
            "drain": str(w.get("drain", "")),
            "keys": w.get("keys", ""),
            "description": w.get("description", ""),
        })

    data_js = json.dumps(js_data, ensure_ascii=False, indent=2)
    types_options = "\n".join(f'<option value="{t}">{t}</option>' for t in all_types)
    targets_options = "\n".join(f'<option value="{t}">{t}</option>' for t in all_targets)

    page = f"""# {label}

<div id="mpv-app">

<div class="mpv-filters">
  <input type="text" id="mpv-search" placeholder="Rechercher (nom, latin, arcanique, description…)" />
  <select id="mpv-type">
    <option value="">Tous les types</option>
    {types_options}
  </select>
  <select id="mpv-target">
    <option value="">Toutes les cibles</option>
    {targets_options}
  </select>
  <span id="mpv-count"></span>
</div>

<table id="mpv-table">
  <thead>
    <tr>
      <th class="col-num">#</th>
      <th class="col-vulgar" data-col="vulgar">Vulgaire ↕</th>
      <th class="col-latin">Latin / Arcanique</th>
      <th class="col-type" data-col="word_type">Type ↕</th>
      <th class="col-target" data-col="target_type">Cible ↕</th>
      <th class="col-diff" data-col="difficulty">Diff. ↕</th>
      <th class="col-drain" data-col="drain">Drain ↕</th>
      <th class="col-keys">Clés</th>
      <th class="col-desc">Description</th>
    </tr>
  </thead>
  <tbody id="mpv-tbody"></tbody>
</table>

</div>

<style>
#mpv-app {{
  font-size: 0.85em;
}}
.mpv-filters {{
  display: flex;
  flex-wrap: wrap;
  gap: 0.5em;
  margin-bottom: 1em;
  align-items: center;
}}
.mpv-filters input[type=text] {{
  flex: 1;
  min-width: 260px;
  padding: 0.35em 0.6em;
  border: 1px solid #aaa;
  border-radius: 4px;
  font-size: 0.9em;
  background: var(--md-default-bg-color, #fff);
  color: var(--md-default-fg-color, #000);
}}
.mpv-filters select {{
  padding: 0.35em 0.6em;
  border: 1px solid #aaa;
  border-radius: 4px;
  font-size: 0.9em;
  background: var(--md-default-bg-color, #fff);
  color: var(--md-default-fg-color, #000);
}}
#mpv-count {{
  margin-left: auto;
  color: #888;
  font-size: 0.85em;
  white-space: nowrap;
}}
#mpv-table {{
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}}
#mpv-table th, #mpv-table td {{
  padding: 0.35em 0.5em;
  border: 1px solid var(--md-default-fg-color--lightest, #e0e0e0);
  vertical-align: top;
  word-break: break-word;
}}
#mpv-table th {{
  background: var(--md-primary-fg-color, #3f51b5);
  color: var(--md-primary-bg-color, #fff);
  cursor: pointer;
  user-select: none;
}}
#mpv-table th:hover {{ opacity: 0.85; }}
.col-num    {{ width: 2%; text-align: center; }}
.col-vulgar {{ width: 9%; }}
.col-latin  {{ width: 10%; }}
.col-type   {{ width: 7%; }}
.col-target {{ width: 7%; }}
.col-diff   {{ width: 3%; text-align: center; }}
.col-drain  {{ width: 3%; text-align: center; }}
.col-keys   {{ width: 16%; }}
.col-desc   {{ width: 43%; }}
#mpv-table tbody tr:nth-child(even) {{
  background: var(--md-default-bg-color--light, #f9f9f9);
}}
#mpv-table tbody tr:hover {{
  background: var(--md-accent-fg-color--transparent, #e8eaf6);
}}
.mpv-bracket {{
  color: #ff1493;
  font-weight: bold;
}}
</style>

<script>
(function() {{
  const DATA = {data_js};

  const tbody   = document.getElementById('mpv-tbody');
  const search  = document.getElementById('mpv-search');
  const selType = document.getElementById('mpv-type');
  const selTgt  = document.getElementById('mpv-target');
  const counter = document.getElementById('mpv-count');

  let sortCol = null;
  let sortAsc = true;

  function fmtDesc(text) {{
    if (!text) return '';
    return text.replace(/\\[([^\\]]+)\\]/g, '<span class="mpv-bracket">[$1]</span>');
  }}

  function render(list) {{
    tbody.innerHTML = '';
    list.forEach(w => {{
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="text-align:center">${{w.num}}</td>
        <td><strong>${{w.vulgar}}</strong></td>
        <td><em style="font-size:0.88em">${{w.latin}}</em><br/><small style="color:#888">${{w.arcane}}</small></td>
        <td>${{w.word_type}}</td>
        <td>${{w.target_type}}</td>
        <td style="text-align:center">${{w.difficulty}}</td>
        <td style="text-align:center">${{w.drain}}</td>
        <td style="font-size:0.82em">${{w.keys}}</td>
        <td>${{fmtDesc(w.description)}}</td>
      `;
      tbody.appendChild(tr);
    }});
    counter.textContent = list.length + ' mot' + (list.length !== 1 ? 's' : '');
  }}

  function filter() {{
    const q = search.value.toLowerCase();
    const t = selType.value;
    const tgt = selTgt.value;

    let list = DATA.filter(w => {{
      if (t && w.word_type !== t) return false;
      if (tgt && w.target_type !== tgt) return false;
      if (q && ![w.vulgar, w.latin, w.arcane, w.description, w.keys]
               .some(s => (s || '').toLowerCase().includes(q))) return false;
      return true;
    }});

    if (sortCol) {{
      list = list.slice().sort((a, b) => {{
        const va = String(a[sortCol] || '').toLowerCase();
        const vb = String(b[sortCol] || '').toLowerCase();
        return sortAsc ? va.localeCompare(vb) : vb.localeCompare(va);
      }});
    }}

    render(list);
  }}

  search.addEventListener('input', filter);
  selType.addEventListener('change', filter);
  selTgt.addEventListener('change', filter);

  document.querySelectorAll('#mpv-table th[data-col]').forEach(th => {{
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

    out_path.write_text(page, encoding="utf-8")
    print(f"[OK] Page mots de pouvoir générée : {out_path} ({len(words)} mots)")


def generate_liaisons_page(extra_words: list) -> None:
    out_path = DOCS_DIR / "liaisons.md"

    all_categories = sorted(set(w["category"] for w in extra_words))
    all_types = sorted(set(w["word_type"] for w in extra_words))

    js_data = []
    for w in extra_words:
        js_data.append({
            "name": w.get("name", ""),
            "category": w.get("category", ""),
            "word_type": w.get("word_type", ""),
            "difficulty": str(w.get("difficulty", "")),
            "drain": str(w.get("drain", "")),
            "mag_mod": w.get("magnitude_modifiers", ""),
            "description": w.get("description", ""),
        })

    data_js = json.dumps(js_data, ensure_ascii=False, indent=2)
    cats_options = "\n".join(f'<option value="{c}">{c}</option>' for c in all_categories)
    types_options = "\n".join(f'<option value="{t}">{t}</option>' for t in all_types)

    page = f"""# Liaisons, Annexes & Formes

> Mots spéciaux combinables avec n'importe quel sort.

<div id="lia-app">

<div class="lia-filters">
  <input type="text" id="lia-search" placeholder="Rechercher…" />
  <select id="lia-cat">
    <option value="">Toutes catégories</option>
    {cats_options}
  </select>
  <select id="lia-type">
    <option value="">Tous types</option>
    {types_options}
  </select>
  <span id="lia-count"></span>
</div>

<table id="lia-table">
  <thead>
    <tr>
      <th class="col-name" data-col="name">Nom ↕</th>
      <th class="col-cat" data-col="category">Catégorie ↕</th>
      <th class="col-type" data-col="word_type">Type ↕</th>
      <th class="col-diff" data-col="difficulty">Diff. ↕</th>
      <th class="col-drain" data-col="drain">Drain ↕</th>
      <th class="col-mag">Mod. Magnitude</th>
      <th class="col-desc">Description</th>
    </tr>
  </thead>
  <tbody id="lia-tbody"></tbody>
</table>

</div>

<style>
#lia-app {{
  font-size: 0.85em;
}}
.lia-filters {{
  display: flex;
  flex-wrap: wrap;
  gap: 0.5em;
  margin-bottom: 1em;
  align-items: center;
}}
.lia-filters input[type=text], .lia-filters select {{
  padding: 0.35em 0.6em;
  border: 1px solid #aaa;
  border-radius: 4px;
  font-size: 0.9em;
  background: var(--md-default-bg-color, #fff);
  color: var(--md-default-fg-color, #000);
}}
.lia-filters input[type=text] {{
  flex: 1;
  min-width: 200px;
}}
#lia-count {{
  margin-left: auto;
  color: #888;
  font-size: 0.85em;
  white-space: nowrap;
}}
#lia-table {{
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}}
#lia-table th, #lia-table td {{
  padding: 0.35em 0.5em;
  border: 1px solid var(--md-default-fg-color--lightest, #e0e0e0);
  vertical-align: top;
  word-break: break-word;
}}
#lia-table th {{
  background: var(--md-primary-fg-color, #3f51b5);
  color: var(--md-primary-bg-color, #fff);
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
}}
#lia-table th:hover {{ opacity: 0.85; }}
.col-name  {{ width: 10%; }}
.col-cat   {{ width: 8%; }}
.col-type  {{ width: 8%; }}
.col-diff  {{ width: 5%; text-align: center; }}
.col-drain {{ width: 5%; text-align: center; }}
.col-mag   {{ width: 16%; }}
.col-desc  {{ width: 48%; }}
#lia-table tbody tr:nth-child(even) {{
  background: var(--md-default-bg-color--light, #f9f9f9);
}}
#lia-table tbody tr:hover {{
  background: var(--md-accent-fg-color--transparent, #e8eaf6);
}}
.lia-bracket {{
  color: #ff1493;
  font-weight: bold;
}}
</style>

<script>
(function() {{
  const DATA = {data_js};

  const tbody   = document.getElementById('lia-tbody');
  const search  = document.getElementById('lia-search');
  const selCat  = document.getElementById('lia-cat');
  const selType = document.getElementById('lia-type');
  const counter = document.getElementById('lia-count');

  let sortCol = null;
  let sortAsc = true;

  function fmtText(text) {{
    if (!text) return '';
    return text.replace(/\\[([^\\]]+)\\]/g, '<span class="lia-bracket">[$1]</span>');
  }}

  function render(list) {{
    tbody.innerHTML = '';
    list.forEach(w => {{
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${{w.name}}</strong></td>
        <td>${{w.category}}</td>
        <td>${{w.word_type}}</td>
        <td style="text-align:center">${{w.difficulty}}</td>
        <td style="text-align:center">${{w.drain}}</td>
        <td style="font-size:0.85em">${{fmtText(w.mag_mod)}}</td>
        <td>${{fmtText(w.description)}}</td>
      `;
      tbody.appendChild(tr);
    }});
    counter.textContent = list.length + ' mot' + (list.length !== 1 ? 's' : '');
  }}

  function filter() {{
    const q = search.value.toLowerCase();
    const cat = selCat.value;
    const t = selType.value;

    let list = DATA.filter(w => {{
      if (cat && w.category !== cat) return false;
      if (t && w.word_type !== t) return false;
      if (q && ![w.name, w.description, w.mag_mod]
               .some(s => (s || '').toLowerCase().includes(q))) return false;
      return true;
    }});

    if (sortCol) {{
      list = list.slice().sort((a, b) => {{
        const va = String(a[sortCol] || '').toLowerCase();
        const vb = String(b[sortCol] || '').toLowerCase();
        return sortAsc ? va.localeCompare(vb) : vb.localeCompare(va);
      }});
    }}

    render(list);
  }}

  search.addEventListener('input', filter);
  selCat.addEventListener('change', filter);
  selType.addEventListener('change', filter);

  document.querySelectorAll('#lia-table th[data-col]').forEach(th => {{
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

    out_path.write_text(page, encoding="utf-8")
    print(f"[OK] Page liaisons générée : {out_path} ({len(extra_words)} mots)")


def main() -> None:
    DOCS_DIR.mkdir(parents=True, exist_ok=True)

    with ALL_WORDS_JSON.open(encoding="utf-8") as f:
        all_words = json.load(f)

    words_by_school: dict = {}
    for w in all_words:
        words_by_school.setdefault(w["school_code"], []).append(w)

    for school_code, meta in SCHOOL_META.items():
        words = words_by_school.get(school_code, [])
        if words:
            generate_school_page(school_code, meta, words)
        else:
            print(f"[WARN] Aucun mot pour {meta['label']}")

    with OTHER_WORDS_JSON.open(encoding="utf-8") as f:
        extra_words = json.load(f)

    generate_liaisons_page(extra_words)
    print(f"\n✓ Pages mots de pouvoir générées dans {DOCS_DIR}")


if __name__ == "__main__":
    main()
