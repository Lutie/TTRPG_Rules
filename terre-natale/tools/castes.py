import pandas as pd
import re
import os
import json

ressource_mapping = {
    ("martiale", "corps"): ("PV", "PE"),
    ("martiale", "mixte"): ("PV", "PC"),
    ("sociale", "esprit"): ("PS", "PE"),
    ("sociale", "mixte"): ("PS", "PC"),
    ("aventure", "esprit"): ("PK", "PS"),
    ("aventure", "corps"): ("PK", "PV"),
    ("aventure", "mixte"): ("PK", "PE"),
    ("expert", "esprit"): ("PC", "PS"),
    ("expert", "corps"): ("PC", "PV"),
    ("expert", "mixte"): ("PC", "PE"),
    ("joker", ""): ("PK", "PC"),
    ("mage", "esprit"): ("PM", "PS"),
    ("mage", "mixte"): ("PM", "PC"),
    ("science", "esprit"): ("PR", "PS"),
    ("science", "mixte"): ("PR", "PC"),
}

ressource_labels = {
    "PV": "vitalité",
    "PE": "endurance",
    "PS": "spiritualité",
    "PK": "karma",
    "PM": "mana",
    "PC": "chi",
    "PR": "créativité",
}

def get_ressources(style, domaine):
    """Retourne (label1, label2) pour le markdown."""
    style = str(style).strip().lower()
    domaine = str(domaine).strip().lower()
    key = (domaine, style) if domaine and domaine != 'nan' else (style, "")
    res1, res2 = ressource_mapping.get(key, ("voir documentation", "voir documentation"))
    def label(abr):
        return f"{abr} ({ressource_labels.get(abr, '???')})" if abr != "voir documentation" else abr
    return label(res1), label(res2)

def get_ressources_ids(style, domaine):
    """Retourne ['PV', 'PE'] pour le JS."""
    style_key = str(style).strip().lower()
    domaine_key = str(domaine).strip().lower()
    key = (domaine_key, style_key) if domaine_key and domaine_key != 'nan' else (style_key, "")
    res1, res2 = ressource_mapping.get(key, (None, None))
    return [r for r in [res1, res2] if r]

# Normalisation des noms de sauvegardes (typos inclus dans le xlsx)
SAVE_CANONICAL = {
    "sang froid": "Sang-Froid",
    "sang-froid": "Sang-Froid",
    "sang froig": "Sang-Froid",   # typo xlsx
    "sang frois": "Sang-Froid",
    "robustesse": "Robustesse",
    "réflexes": "Réflexes",
    "reflexes": "Réflexes",
    "détermination": "Détermination",
    "determination": "Détermination",
    "intuition": "Intuition",
    "opposition": "Opposition",
    "fortune": "Fortune",
    "prestige": "Prestige",
}

def normalize_save(s):
    s = s.strip()
    return SAVE_CANONICAL.get(s.lower(), s)

def parse_attributs(text):
    """'FOR/DEX/AGI' → ['FOR', 'DEX', 'AGI']"""
    if not text or str(text).strip().lower() == 'nan':
        return []
    return [a.strip().upper() for a in str(text).strip().split('/') if a.strip()]

def parse_sauvegardes_majeures(text):
    if not text or str(text).strip().lower() in ('nan', 'un au choix', ''):
        return []
    parts = re.split(r'\s+ou\s+', str(text).strip(), flags=re.IGNORECASE)
    return [normalize_save(p) for p in parts if p.strip()]

def parse_sauvegardes_mineures(text, majeures):
    if not text or str(text).strip().lower() in ('nan', ''):
        return []
    text = str(text).strip()
    if text.lower() == "l'autre":
        # L'autre save du binôme majeures devient mineure
        return list(majeures)
    if text.lower() in ('2 au choix', 'un au choix'):
        return []
    # "X & Y" ou "X ou Y ou Z, selon..."
    result = []
    parts = re.split(r'\s*&\s*', text)
    for p in parts:
        sub = re.split(r'\s+ou\s+', p.strip(), flags=re.IGNORECASE)
        for sp in sub:
            sp = re.sub(r',\s+selon.*$', '', sp.strip(), flags=re.IGNORECASE).strip()
            normalized = normalize_save(sp)
            if normalized and normalized.lower() not in ('selon', ''):
                result.append(normalized)
    return result

def str_clean(val):
    """Cellule → str propre, None si vide/NaN."""
    s = str(val).strip()
    if s.lower() == 'nan' or not s or s == ' ':
        return None
    return s

# ── Chemins ────────────────────────────────────────────────────────────────
SCRIPT_DIR      = os.path.dirname(os.path.abspath(__file__))
XLSX_PATH       = os.path.join(SCRIPT_DIR, "Terre Natale - Aides de jeu _ Castes.xlsx")
MARKDOWN_OUTPUT = os.path.abspath(os.path.join(SCRIPT_DIR, "..", "docs", "classes", "castes.md"))
JS_OUTPUT       = os.path.abspath(os.path.join(SCRIPT_DIR, "..", "app-react", "src", "data", "castes.js"))
IMAGE_PATH_IN_MD = "../images"

if not os.path.exists(XLSX_PATH):
    raise FileNotFoundError(f"❌ Fichier Excel introuvable : {XLSX_PATH}")

# ── Lecture ─────────────────────────────────────────────────────────────────
df = pd.read_excel(XLSX_PATH, header=1)
df = df[df[df.columns[0]].notna()]

def normaliser_type(val):
    val = str(val).strip().lower()
    if "av" in val:
        return "avancée"
    elif "ex" in val:
        return "expert"
    return "fondamentale"

df["Type"] = df[df.columns[1]].apply(normaliser_type)

non_reconnues = df[df["Type"].isna()]
if not non_reconnues.empty:
    print("⚠️ Castes ignorées (type non reconnu) :")
    print(non_reconnues[[df.columns[0], df.columns[1]]])

df = df.rename(columns={
    df.columns[0]:  "Nom",
    df.columns[2]:  "Attribut1",
    df.columns[3]:  "Attribut2",
    df.columns[4]:  "Style",
    df.columns[6]:  "Domaine",
    df.columns[8]:  "SauvegardesMajeures",
    df.columns[9]:  "SauvegardesMineures",
    df.columns[11]: "Privilège",
    df.columns[13]: "Trait1",
    df.columns[15]: "Trait2",
    df.columns[17]: "ActionSpéciale",
    df.columns[18]: "Amélioration",
    df.columns[21]: "Entrainements",
})

ordre_types = ["fondamentale", "avancée", "expert"]
df = df[df["Type"].isin(ordre_types)]
df["Type"] = pd.Categorical(df["Type"], categories=ordre_types, ordered=True)
df = df.sort_values(["Type", "Nom"])

def slugify(text):
    return re.sub(r'[^a-z0-9\-]', '', text.strip().lower().replace(' ', '-'))

# ── Génération Markdown ──────────────────────────────────────────────────────
markdown_lines = ["# Castes de Thalifen\n"]

for caste_type in ordre_types:
    df_section = df[df["Type"] == caste_type]
    if df_section.empty:
        continue

    markdown_lines.append(f"## Castes {caste_type.capitalize()}s\n")

    for _, row in df_section.iterrows():
        nom = str(row["Nom"]).strip()
        slug = slugify(nom)
        image_path_for_md = f"{IMAGE_PATH_IN_MD}/{slug}.png"

        markdown_lines.append(f"### {nom}\n")
        markdown_lines.append("<table><tr>")
        markdown_lines.append(
            f'<td style="width: 300px; vertical-align: top;"><img src="{image_path_for_md}" alt="{nom}" style="max-width: 100%; height: auto;"></td>'
        )

        style  = str(row.get("Style",  "")).strip()
        domaine = str(row.get("Domaine", "")).strip()
        res1, res2 = get_ressources(style, domaine)

        markdown_lines.append("<td style='vertical-align: top;'>")
        markdown_lines.append(f"<p><strong>Attributs 1</strong> : {row.get('Attribut1', '')}<br>")
        markdown_lines.append(f"<strong>Attributs 2</strong> : {row.get('Attribut2', '')}<br>")
        markdown_lines.append(f"<strong>Type</strong> : {style}<br>")
        markdown_lines.append(f"<strong>Domaine</strong> : {domaine}<br>")
        markdown_lines.append(f"<strong>Ressource 1</strong> : {res1}<br>")
        markdown_lines.append(f"<strong>Ressource 2</strong> : {res2}<br>")
        markdown_lines.append(f"<strong>Sauvegardes majeures</strong> : {row.get('SauvegardesMajeures', '')}<br>")
        markdown_lines.append(f"<strong>Sauvegardes mineures</strong> : {row.get('SauvegardesMineures', '')}<br>")
        markdown_lines.append(f"<strong>Privilège</strong> : {row.get('Privilège', '')}<br>")
        markdown_lines.append(f"<strong>Trait 1</strong> : {row.get('Trait1', '')}<br>")
        markdown_lines.append(f"<strong>Trait 2</strong> : {row.get('Trait2', '')}<br>")
        markdown_lines.append(f"<strong>Action spéciale</strong> : {row.get('ActionSpéciale', '')}<br>")
        markdown_lines.append(f"<strong>Amélioration</strong> : {row.get('Amélioration', '')}<br>")
        markdown_lines.append(f"<strong>Entraînements</strong> : {row.get('Entrainements', '')}</p>")
        markdown_lines.append("</td></tr></table>\n")
        markdown_lines.append("<hr/>\n")

os.makedirs(os.path.dirname(MARKDOWN_OUTPUT), exist_ok=True)
with open(MARKDOWN_OUTPUT, "w", encoding="utf-8") as f:
    f.write("\n".join(markdown_lines))
print(f"✅ castes.md généré dans : {MARKDOWN_OUTPUT}")

# ── Génération JS ────────────────────────────────────────────────────────────
def js_str(v):
    """Sérialise une valeur Python en JS (string, array, null)."""
    if v is None:
        return "null"
    return json.dumps(v, ensure_ascii=False)

castes_js = []
for _, row in df.iterrows():
    nom = str_clean(row["Nom"])
    if not nom:
        continue

    style   = str_clean(row.get("Style",   "")) or ""
    domaine = str_clean(row.get("Domaine", "")) or ""

    sauv_maj_raw = row.get("SauvegardesMajeures", "")
    sauv_maj = parse_sauvegardes_majeures(sauv_maj_raw)
    sauv_min = parse_sauvegardes_mineures(row.get("SauvegardesMineures", ""), sauv_maj)

    castes_js.append({
        "nom":                nom,
        "type":               row["Type"],
        "attribut1":          parse_attributs(row.get("Attribut1", "")),
        "attribut2":          parse_attributs(row.get("Attribut2", "")),
        "style":              style,
        "domaine":            domaine,
        "ressources":         get_ressources_ids(style, domaine),
        "sauvegardesMajeures": sauv_maj,
        "sauvegardesMineures": sauv_min,
        "privilege":          str_clean(row.get("Privilège",      "")),
        "trait1":             str_clean(row.get("Trait1",         "")),
        "trait2":             str_clean(row.get("Trait2",         "")),
        "actionSpeciale":     str_clean(row.get("ActionSpéciale", "")),
        "amelioration":       str_clean(row.get("Amélioration",   "")),
        "entrainements":      str_clean(row.get("Entrainements",  "")),
    })

js_lines = [
    "// AUTO-GENERATED — ne pas modifier manuellement",
    "// Source : tools/Terre Natale - Aides de jeu _ Castes.xlsx  •  Script : tools/castes.py",
    f"// {len(castes_js)} castes ({sum(1 for c in castes_js if c['type']=='fondamentale')} fondamentales,"
    f" {sum(1 for c in castes_js if c['type']=='avancée')} avancées,"
    f" {sum(1 for c in castes_js if c['type']=='expert')} expert)",
    "",
    "const castes = [",
]

for c in castes_js:
    js_lines.append("  {")
    for k, v in c.items():
        js_lines.append(f"    {k}: {js_str(v)},")
    js_lines.append("  },")

js_lines += [
    "];",
    "",
    "export { castes };",
    "",
]

with open(JS_OUTPUT, "w", encoding="utf-8") as f:
    f.write("\n".join(js_lines))

# Rapport
types_counts = {t: sum(1 for c in castes_js if c['type'] == t) for t in ordre_types}
sans_ressources = [c['nom'] for c in castes_js if not c['ressources']]
print(f"✅ castes.js généré dans : {JS_OUTPUT}")
print(f"   {len(castes_js)} castes — {types_counts}")
if sans_ressources:
    print(f"   ⚠️  Sans ressources mappées ({len(sans_ressources)}) : {', '.join(sans_ressources[:10])}{'…' if len(sans_ressources) > 10 else ''}")
