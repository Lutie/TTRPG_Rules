"""
tools/archetypes.json → docs/archetypes/index.md
Compendium des archétypes : cartes accordéon avec mécaniques + rangs + améliorations.
"""
import json, os
from pathlib import Path

TOOLS = Path(__file__).parent
json_path = TOOLS / "archetypes.json"
out_path  = TOOLS.parent / "docs" / "archetypes" / "index.md"
os.makedirs(os.path.dirname(out_path), exist_ok=True)

with open(json_path, encoding="utf-8") as f:
    archetypes = json.load(f)

print(f"Archétypes : {len(archetypes)}")

# ---------------------------------------------------------------------------
# Build archetype cards HTML
# ---------------------------------------------------------------------------
def escape(s):
    return (s or "").replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")

def render_text(s):
    """Escape HTML then convert **bold** markers to <strong>."""
    s = escape(s)
    import re
    return re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', s)

def archetype_card(a, idx):
    nom           = escape(a.get("nom", ""))
    concept       = escape(a.get("concept", ""))
    description   = a.get("description", "")
    rangs         = a.get("rangs", [])
    mecaniques    = a.get("mecaniques", [])
    ameliorations = a.get("ameliorations", [])

    card_id = f"arch-{idx}"

    # --- description block ---
    desc_html = f'<p class="arch-desc">{render_text(description)}</p>' if description else ""

    # --- mécaniques block ---
    mec_html = ""
    if mecaniques:
        rows = "".join(
            f'<tr><th>{render_text(m["titre"])}</th><td>{render_text(m["texte"])}</td></tr>'
            for m in mecaniques
        )
        mec_html = f'<table class="arch-mec">{rows}</table>'

    # --- voies block ---
    voies = a.get("voies", [])
    voies_html = ""
    if voies:
        voie_items = "".join(
            f'<li><strong>{escape(v["nom"])}</strong> — {render_text(v["description"])}</li>'
            for v in voies
        )
        voies_html = f'<div class="arch-voies"><strong>Voies :</strong><ul>{voie_items}</ul></div>'

    # --- origines block ---
    origines = a.get("origines", {})
    origines_html = ""
    if origines:
        cols = origines.get("colonnes", [])
        milieux = origines.get("milieux", [])
        header = "".join(f'<th>{escape(c)}</th>' for c in cols)
        rows_o = ""
        for m in milieux:
            cells = "".join(f'<td class="orig-val">{v}</td>' for v in m["valeurs"])
            rows_o += f'<tr><td class="orig-nom"><strong>{escape(m["nom"])}</strong><br><span class="orig-desc">{escape(m["description"])}</span></td>{cells}</tr>'
        origines_html = f'<details class="arch-origines"><summary>Milieux d\'origine ({len(milieux)})</summary><table class="orig-table"><thead><tr><th>Milieu</th>{header}</tr></thead><tbody>{rows_o}</tbody></table></details>'

    # --- formes block ---
    formes = a.get("formes", [])
    formes_html = ""
    if formes:
        total_formes = sum(len(cat["liste"]) for cat in formes)
        cat_sections = ""
        for cat in formes:
            cat_items = "".join(
                f'<li><strong>{escape(f["nom"])}</strong> — {render_text(f["description"])}</li>'
                for f in cat["liste"]
            )
            cat_sections += f'<div class="arch-formes-group"><span class="arch-formes-cat">◆ {escape(cat["categorie"])}</span><ul>{cat_items}</ul></div>'
        formes_html = f"""
<details class="arch-formes">
  <summary>Catalogue de formes ({total_formes})</summary>
  {cat_sections}
</details>"""

    # --- améliorations block ---
    CATEGORIE_LABELS = {
        "commun":        ("commun", "#555"),
        "animal_dresse": ("animal dressé", "#4a7c59"),
        "animal_sauvage":("animal sauvage", "#7c4a2e"),
        "humanoide":     ("humanoïde", "#2e5c7c"),
        "excellence":    ("excellence", "#7c5c2e"),
        "equilibre":     ("équilibre", "#2e7c5c"),
        "virtuose":      ("virtuose", "#5c2e7c"),
        "metamorphose":  ("métamorphose", "#4a7c3f"),
        "bete":          ("bête", "#7c3f3f"),
    }
    amel_html = ""
    if ameliorations:
        # Group by categorie if any amelioration has one
        has_categories = any("categorie" in am for am in ameliorations)
        if has_categories:
            from collections import OrderedDict
            groups = OrderedDict()
            for am in ameliorations:
                cat = am.get("categorie", "commun")
                groups.setdefault(cat, []).append(am)
            sections = ""
            for cat, items in groups.items():
                label, color = CATEGORIE_LABELS.get(cat, (cat, "#555"))
                item_html = "".join(
                    f'<li><strong>{escape(am["nom"])}</strong> — {render_text(am["description"])}</li>'
                    for am in items
                )
                sections += f'<div class="arch-amel-group"><span class="arch-amel-cat" style="color:{color}">◆ {escape(label)}</span><ul>{item_html}</ul></div>'
            amel_html = f"""
<details class="arch-amel">
  <summary>Améliorations disponibles ({len(ameliorations)})</summary>
  {sections}
</details>"""
        else:
            items = "".join(
                f'<li><strong>{escape(am["nom"])}</strong> — {render_text(am["description"])}</li>'
                for am in ameliorations
            )
            amel_html = f"""
<details class="arch-amel">
  <summary>Améliorations disponibles ({len(ameliorations)})</summary>
  <ul>{items}</ul>
</details>"""

    # --- rangs block ---
    rang_rows = ""
    for r in rangs:
        desc = r.get("description") or ""
        desc_part = f'<div class="rang-desc">{render_text(desc)}</div>' if desc else ""
        choix_html = ""
        if r.get("choix") == "ameliorations" and ameliorations:
            choix_html = '<span class="rang-choix">⬡ Choisir une amélioration</span>'
        rang_rows += f"""
<div class="rang-row">
  <div class="rang-badge">R{r["rang"]}</div>
  <div class="rang-body">
    {desc_part}
    {choix_html}
  </div>
</div>"""

    return f"""
<div class="arch-card" id="{card_id}">
  <div class="arch-header" onclick="toggleArch('{card_id}')">
    <span class="arch-nom">{nom}</span>
    <span class="arch-concept">{concept}</span>
    <span class="arch-chevron">▾</span>
  </div>
  <div class="arch-body">
    {desc_html}
    {voies_html}
    {mec_html}
    {origines_html}
    {formes_html}
    <div class="arch-rangs">{rang_rows}</div>
    {amel_html}
  </div>
</div>"""

cards_html = "\n".join(archetype_card(a, i) for i, a in enumerate(archetypes))

# ---------------------------------------------------------------------------
# Full page
# ---------------------------------------------------------------------------
page = f"""# Compendium des Archétypes

Les archétypes sont des traits spéciaux à 5 rangs. Il en existe deux formes : les archétypes **uniques**, dont le rang 1 débloque une mécanique de jeu significative et les rangs suivants l'améliorent ; et les archétypes **bundles**, dans lesquels le personnage puise des améliorations dès le rang 1.

!!! warning "Règle générale"
    Un personnage ne peut posséder qu'**un seul archétype**. Des exceptions restent possibles avec l'accord du MJ, qui devrait considérer la question avec grande attention — cumuler plusieurs archétypes peut rapidement devenir difficile à gérer en jeu.

<div id="arch-app">

<div class="arch-filters">
  <input type="text" id="arch-search" placeholder="Rechercher un archétype…" />
  <span id="arch-count"></span>
</div>

<div id="arch-list">
{cards_html}
</div>

</div>

<style>
#arch-app {{
  font-size: 0.9em;
}}
.arch-filters {{
  display: flex;
  gap: 0.6em;
  margin-bottom: 1.2em;
  align-items: center;
}}
.arch-filters input {{
  flex: 1;
  max-width: 360px;
  padding: 0.35em 0.6em;
  border: 1px solid #aaa;
  border-radius: 4px;
  font-size: 0.9em;
  background: var(--md-default-bg-color, #fff);
  color: var(--md-default-fg-color, #000);
}}
#arch-count {{
  color: #888;
  font-size: 0.85em;
}}
.arch-card {{
  border: 1px solid var(--md-default-fg-color--lightest, #ddd);
  border-radius: 6px;
  margin-bottom: 0.7em;
  overflow: hidden;
}}
.arch-header {{
  display: flex;
  align-items: baseline;
  gap: 0.8em;
  padding: 0.65em 1em;
  cursor: pointer;
  background: var(--md-primary-fg-color, #3f51b5);
  color: var(--md-primary-bg-color, #fff);
  user-select: none;
}}
.arch-header:hover {{ opacity: 0.9; }}
.arch-nom {{
  font-weight: 700;
  font-size: 1.05em;
  white-space: nowrap;
}}
.arch-concept {{
  flex: 1;
  font-style: italic;
  font-size: 0.88em;
  opacity: 0.85;
}}
.arch-chevron {{
  font-size: 1.1em;
  transition: transform 0.2s;
}}
.arch-card.open .arch-chevron {{
  transform: rotate(180deg);
}}
.arch-body {{
  display: none;
  padding: 1em;
  border-top: 1px solid var(--md-default-fg-color--lightest, #ddd);
}}
.arch-card.open .arch-body {{
  display: block;
}}
/* description */
.arch-desc {{
  margin: 0 0 0.9em 0;
  color: var(--md-default-fg-color--light, #444);
  font-size: 0.92em;
  line-height: 1.5;
}}
/* mécaniques */
.arch-mec {{
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1em;
  font-size: 0.9em;
}}
.arch-mec th, .arch-mec td {{
  padding: 0.35em 0.6em;
  border: 1px solid var(--md-default-fg-color--lightest, #e0e0e0);
  vertical-align: top;
}}
.arch-mec th {{
  white-space: nowrap;
  font-weight: 600;
  width: 1%;
  background: var(--md-default-bg-color--light, #f5f5f5);
  color: var(--md-default-fg-color, #000);
}}
/* rangs */
.arch-rangs {{
  display: flex;
  flex-direction: column;
  gap: 0.4em;
  margin-bottom: 0.9em;
}}
.rang-row {{
  display: flex;
  gap: 0.7em;
  align-items: flex-start;
}}
.rang-badge {{
  flex-shrink: 0;
  width: 2em;
  height: 2em;
  border-radius: 50%;
  background: var(--md-primary-fg-color, #3f51b5);
  color: var(--md-primary-bg-color, #fff);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.8em;
}}
.rang-body {{
  flex: 1;
}}
.rang-desc {{
  color: var(--md-default-fg-color--light, #444);
  font-size: 0.92em;
}}
.rang-choix {{
  display: inline-block;
  margin-top: 0.2em;
  font-size: 0.82em;
  color: #7c4dff;
  font-style: italic;
}}
/* améliorations */
.arch-amel > summary {{
  cursor: pointer;
  font-weight: 600;
  color: var(--md-primary-fg-color, #3f51b5);
  margin-bottom: 0.4em;
  user-select: none;
}}
.arch-amel ul {{
  margin: 0.4em 0 0 0;
  padding-left: 1.2em;
}}
.arch-amel li {{
  margin-bottom: 0.3em;
  font-size: 0.9em;
}}
/* voies */
.arch-voies {{
  margin-bottom: 0.9em;
  font-size: 0.9em;
}}
.arch-voies ul {{
  margin: 0.3em 0 0 0;
  padding-left: 1.2em;
}}
.arch-voies li {{
  margin-bottom: 0.25em;
}}
/* améliorations groupées */
.arch-amel-group {{
  margin-bottom: 0.6em;
}}
.arch-amel-cat {{
  display: block;
  font-size: 0.82em;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 0.2em;
}}
.arch-amel-group ul {{
  margin: 0;
  padding-left: 1.2em;
}}
/* origines */
.arch-origines > summary {{
  cursor: pointer;
  font-weight: 600;
  color: var(--md-primary-fg-color, #3f51b5);
  margin-bottom: 0.4em;
  user-select: none;
}}
.orig-table {{
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85em;
  margin-top: 0.5em;
}}
.orig-table th, .orig-table td {{
  border: 1px solid var(--md-default-fg-color--lightest, #e0e0e0);
  padding: 0.3em 0.5em;
  text-align: center;
  vertical-align: top;
}}
.orig-table th {{
  background: var(--md-default-bg-color--light, #f5f5f5);
  font-weight: 600;
}}
.orig-nom {{
  text-align: left !important;
  white-space: nowrap;
}}
.orig-desc {{
  display: block;
  font-size: 0.8em;
  font-style: italic;
  color: var(--md-default-fg-color--light, #555);
  white-space: normal;
  font-weight: normal;
}}
.orig-val {{
  font-weight: 700;
  min-width: 2.5em;
}}
/* catalogue de formes */
.arch-formes > summary {{
  cursor: pointer;
  font-weight: 600;
  color: var(--md-primary-fg-color, #3f51b5);
  margin-bottom: 0.4em;
  user-select: none;
}}
.arch-formes-group {{
  margin-bottom: 0.6em;
}}
.arch-formes-cat {{
  display: block;
  font-size: 0.82em;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--md-default-fg-color--light, #555);
  margin-bottom: 0.2em;
}}
.arch-formes-group ul {{
  margin: 0;
  padding-left: 1.2em;
}}
/* search highlight */
.arch-card.hidden {{
  display: none;
}}
</style>

<script>
(function() {{
  const search  = document.getElementById('arch-search');
  const counter = document.getElementById('arch-count');
  const cards   = Array.from(document.querySelectorAll('.arch-card'));

  function updateCount() {{
    const visible = cards.filter(c => !c.classList.contains('hidden')).length;
    counter.textContent = visible + ' archétype' + (visible !== 1 ? 's' : '');
  }}

  search.addEventListener('input', () => {{
    const q = search.value.toLowerCase();
    cards.forEach(card => {{
      const text = card.textContent.toLowerCase();
      card.classList.toggle('hidden', q.length > 0 && !text.includes(q));
    }});
    updateCount();
  }});

  updateCount();
}})();

function toggleArch(id) {{
  document.getElementById(id).classList.toggle('open');
}}
</script>
"""

with open(out_path, "w", encoding="utf-8") as f:
    f.write(page)
print(f"Generated: {out_path}")
