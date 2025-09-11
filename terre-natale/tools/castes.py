import pandas as pd
import re
import os

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
    # Nettoyage robuste
    style = str(style).strip().lower()
    domaine = str(domaine).strip().lower()

    # Gestion spéciale si Domaine est vide
    key = (domaine, style) if domaine else (style, "")
    res1, res2 = ressource_mapping.get(key, ("voir documentation", "voir documentation"))

    def label(abr):
        return f"{abr} ({ressource_labels.get(abr, '???')})" if abr != "voir documentation" else abr

    return label(res1), label(res2)

# Dossier du script
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

# Chemins
XLSX_PATH = os.path.join(SCRIPT_DIR, "Terre Natale - Aides de jeu _ Castes.xlsx")
MARKDOWN_OUTPUT = os.path.abspath(os.path.join(SCRIPT_DIR, "..", "docs", "classes", "castes.md"))
IMAGE_PATH_IN_MD = "../images"

# Vérifie que le fichier Excel est là
if not os.path.exists(XLSX_PATH):
    raise FileNotFoundError(f"❌ Fichier Excel introuvable : {XLSX_PATH}")

# Lecture du fichier Excel
df = pd.read_excel(XLSX_PATH, header=1)
df = df[df[df.columns[0]].notna()] # Ignore lignes sans nom de caste

# Normalisation simple : tout type non reconnu devient "fondamentale"
def normaliser_type(val):
    val = str(val).strip().lower()
    if "av" in val:
        return "avancée"
    elif "ex" in val:
        return "expert"
    return "fondamentale"

df["Type"] = df[df.columns[1]].apply(normaliser_type)

# Affiche les castes ignorées
non_reconnues = df[df["Type"].isna()]
if not non_reconnues.empty:
    print("⚠️ Castes ignorées (type non reconnu) :")
    print(non_reconnues[[df.columns[0], df.columns[1]]])

# Renommage des colonnes utiles
df = df.rename(columns={
    df.columns[0]: "Nom",
    df.columns[2]: "Attribut1",
    df.columns[3]: "Attribut2",
    df.columns[4]: "Style",
    df.columns[6]: "Domaine",
    df.columns[8]: "SauvegardesMajeures",
    df.columns[9]: "SauvegardesMineures",
    df.columns[11]: "Privilège",
    df.columns[13]: "Trait1",
    df.columns[15]: "Trait2",
    df.columns[17]: "ActionSpéciale",
    df.columns[18]: "Amélioration"
})

ordre_types = ["fondamentale", "avancée", "expert"]
df = df[df["Type"].isin(ordre_types)]
df["Type"] = pd.Categorical(df["Type"], categories=ordre_types, ordered=True)
df = df.sort_values(["Type", "Nom"])

# Markdown
markdown_lines = ["# Castes de Thalifen\n"]

def slugify(text):
    return re.sub(r'[^a-z0-9\-]', '', text.strip().lower().replace(' ', '-'))

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

        # Image toujours présente (chemin relatif), qu'elle existe ou non physiquement
        markdown_lines.append(
            f'<td style="width: 300px; vertical-align: top;"><img src="{image_path_for_md}" alt="{nom}" style="max-width: 100%; height: auto;"></td>'
        )

        style = str(row.get("Style", "")).strip()
        domaine = str(row.get("Domaine", "")).strip()
        res1, res2 = get_ressources(style, domaine)

        markdown_lines.append("<td style='vertical-align: top;'>")
        markdown_lines.append(f"<p><strong>Attributs 1</strong> : {row.get('Attribut1', '')}<br>")
        markdown_lines.append(f"<strong>Attributs 2</strong> : {row.get('Attribut2', '')}<br>")
        markdown_lines.append(f"<strong>Type</strong> : {row.get('Style', '')}<br>")
        markdown_lines.append(f"<strong>Domaine</strong> : {row.get('Domaine', '')}<br>")
        markdown_lines.append(f"<strong>Ressource 1</strong> : {res1}<br>")
        markdown_lines.append(f"<strong>Ressource 2</strong> : {res2}<br>")
        markdown_lines.append(f"<strong>Sauvegardes majeures</strong> : {row.get('SauvegardesMajeures', '')}<br>")
        markdown_lines.append(f"<strong>Sauvegardes mineures</strong> : {row.get('SauvegardesMineures', '')}<br>")
        markdown_lines.append(f"<strong>Privilège</strong> : {row.get('Privilège', '')}<br>")
        markdown_lines.append(f"<strong>Trait 1</strong> : {row.get('Trait1', '')}<br>")
        markdown_lines.append(f"<strong>Trait 2</strong> : {row.get('Trait2', '')}<br>")
        markdown_lines.append(f"<strong>Action spéciale</strong> : {row.get('ActionSpéciale', '')}<br>")
        markdown_lines.append(f"<strong>Amélioration</strong> : {row.get('Amélioration', '')}</p>")
        markdown_lines.append("</td></tr></table>\n")
        markdown_lines.append("<hr/>\n")

# Écriture finale
with open(MARKDOWN_OUTPUT, "w", encoding="utf-8") as f:
    f.write("\n".join(markdown_lines))

print(f"✅ castes.md généré dans : {MARKDOWN_OUTPUT}")
