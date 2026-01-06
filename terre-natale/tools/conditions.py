import pandas as pd
import os

# --- Paths ---
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

XLSX_PATH = os.path.join(SCRIPT_DIR, "Terre Natale - Aides de jeu _ Magies.xlsx")
MARKDOWN_OUTPUT = os.path.abspath(os.path.join(SCRIPT_DIR, "..", "docs", "rules", "conditions.md"))

if not os.path.exists(XLSX_PATH):
    raise FileNotFoundError(f"❌ Excel file not found: {XLSX_PATH}")

# --- Helpers ---
def clean(value) -> str:
    if value is None or (isinstance(value, float) and pd.isna(value)) or pd.isna(value):
        return ""
    return str(value).strip()

def join_domaines(d1, d2) -> str:
    parts = [clean(d1), clean(d2)]
    parts = [p for p in parts if p and p != "-"]
    return " / ".join(parts) if parts else "-"

def normalize_save(value) -> str:
    v = clean(value)
    return "-" if v in ("", "-", "—") else v

def find_header_row(raw_df: pd.DataFrame) -> int:
    for i in range(min(50, len(raw_df))):
        row = raw_df.iloc[i].astype(str).str.lower().tolist()
        if any(cell.strip() == "nom" for cell in row) and any(cell.strip() == "description" for cell in row):
            return i
    return 1

def format_condition_block(name: str, domaines: str, save: str, desc: str, opposite: str | None = None) -> list[str]:
    lines = [f"### {name}\n"]
    lines.append(f"- **Domaines** : {domaines}")
    lines.append(f"- **Sauvegarde** : {save}")
    if opposite:
        lines.append(f"- *Opposée à* : {opposite}")
    lines.append(f"\n{desc}\n")
    return lines

def is_stop_name(name: str) -> bool:
    """Stop when the name cell is truly empty."""
    return clean(name) == ""

def is_skip_name(name: str) -> bool:
    """Skip when name is '_' (placeholder meaning 'nothing on this row')."""
    return clean(name) == "_"

# --- Read ---
raw = pd.read_excel(XLSX_PATH, header=None)
header_row = find_header_row(raw)

df = pd.read_excel(XLSX_PATH, header=header_row)

if df.shape[1] < 10:
    raise ValueError(f"❌ Unexpected layout: expected at least 10 columns (A..J). Got {df.shape[1]} columns.")

pos = df.iloc[:, 0:5].copy()
neg = df.iloc[:, 5:10].copy()

pos.columns = ["Nom", "Domaine1", "Domaine2", "Save", "Description"]
neg.columns = ["Nom", "Domaine1", "Domaine2", "Save", "Description"]

# --- Markdown ---
md = []
md.append("# Conditions\n")
md.append("## Conditions positives\n")
md.append("> Note : une condition positive peut être acceptée volontairement sans effectuer de sauvegarde.\n")

# We iterate row-by-row and apply STOP/SKIP logic
for i in range(len(df)):
    pos_name = clean(pos.loc[i, "Nom"]) if i in pos.index else ""
    neg_name = clean(neg.loc[i, "Nom"]) if i in neg.index else ""

    # STOP: if we encounter an empty name cell on either side, we stop entirely
    if is_stop_name(pos_name) or is_stop_name(neg_name):
        break

    # SKIP: '_' means "nothing on this row"
    if is_skip_name(pos_name) or is_skip_name(neg_name):
        continue

    domaines = join_domaines(pos.loc[i, "Domaine1"], pos.loc[i, "Domaine2"])
    save = normalize_save(pos.loc[i, "Save"])
    desc = clean(pos.loc[i, "Description"])
    md.extend(format_condition_block(pos_name, domaines, save, desc, opposite=neg_name or None))
    md.append("<hr/>\n")

md.append("\n## Conditions négatives\n\n")

for i in range(len(df)):
    pos_name = clean(pos.loc[i, "Nom"]) if i in pos.index else ""
    neg_name = clean(neg.loc[i, "Nom"]) if i in neg.index else ""

    if is_stop_name(pos_name) or is_stop_name(neg_name):
        break

    if is_skip_name(pos_name) or is_skip_name(neg_name):
        continue

    domaines = join_domaines(neg.loc[i, "Domaine1"], neg.loc[i, "Domaine2"])
    save = normalize_save(neg.loc[i, "Save"])
    desc = clean(neg.loc[i, "Description"])
    md.extend(format_condition_block(neg_name, domaines, save, desc, opposite=pos_name or None))
    md.append("<hr/>\n")

os.makedirs(os.path.dirname(MARKDOWN_OUTPUT), exist_ok=True)
with open(MARKDOWN_OUTPUT, "w", encoding="utf-8") as f:
    f.write("\n".join(md).strip() + "\n")

print(f"✅ conditions.md generated at: {MARKDOWN_OUTPUT}")
