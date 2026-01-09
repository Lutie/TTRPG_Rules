import pandas as pd
import os

# --- Paths ---
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

XLSX_PATH = os.path.join(SCRIPT_DIR, "Terre Natale - Aides de jeu _ Magies.xlsx")
MARKDOWN_OUTPUT = os.path.abspath(os.path.join(SCRIPT_DIR, "..", "docs", "rules", "conditions.md"))
SHEET_NAME = "Conditions"

if not os.path.exists(XLSX_PATH):
    raise FileNotFoundError(f"❌ Excel file not found: {XLSX_PATH}")

# --- Helpers ---
def clean(value) -> str:
    if value is None:
        return ""
    try:
        if pd.isna(value):
            return ""
    except Exception:
        pass
    return str(value).strip()

def join_domaines(d1, d2) -> str:
    parts = [clean(d1), clean(d2)]
    parts = [p for p in parts if p and p != "-"]
    return " / ".join(parts) if parts else "-"

def normalize_save(value) -> str:
    v = clean(value)
    return "-" if v in ("", "-", "—") else v

def is_stop_name(name: str) -> bool:
    return clean(name) == ""

def is_skip_name(name: str) -> bool:
    return clean(name) == "_"

def format_condition_block(name: str, ctype: str, domaines: str, save: str, rp_desc: str, effect: str) -> list[str]:
    lines = [f"### {name}\n"]
    lines.append(f"- **Type** : {ctype}")
    lines.append(f"- **Domaines** : {domaines}")
    lines.append(f"- **Sauvegarde** : {save}")
    lines.append(f"- **Description** : {rp_desc if rp_desc else '-'}")
    lines.append(f"- **Effet** : {effect if effect else '-'}\n")
    lines.append("<hr/>\n")
    return lines

# --- Read (start at Excel row 4 => skiprows=3) ---
# Read without header, using 0-based indexes (A=0, B=1, ...)
df = pd.read_excel(
    XLSX_PATH,
    sheet_name=SHEET_NAME,
    header=None,
    skiprows=3,   # starts at row 4
)

# Column mapping by your latest letters:
# Positives: A B C D E F => 0 1 2 3 4 5
# Negatives: H I J K L M => 7 8 9 10 11 12
POS = {"name": 0, "d1": 1, "d2": 2, "save": 3, "effect": 4, "desc": 5}
NEG = {"name": 7, "d1": 8, "d2": 9, "save": 10, "effect": 11, "desc": 12}

max_needed = max(NEG.values())
if df.shape[1] <= max_needed:
    raise ValueError(
        f"❌ Not enough columns in sheet '{SHEET_NAME}'. "
        f"Need at least {max_needed+1} columns (A..M), got {df.shape[1]}."
    )

# --- Build Markdown ---
md = []
md.append("# Conditions\n")

md.append("## Conditions positives\n")
md.append("> Note : une condition positive peut être acceptée volontairement sans effectuer de sauvegarde.\n")

for i in range(len(df)):
    pos_name = clean(df.iat[i, POS["name"]])
    neg_name = clean(df.iat[i, NEG["name"]])

    # Stop when either side name is empty
    if is_stop_name(pos_name) or is_stop_name(neg_name):
        break

    # Skip placeholder rows
    if is_skip_name(pos_name) or is_skip_name(neg_name):
        continue

    domaines = join_domaines(df.iat[i, POS["d1"]], df.iat[i, POS["d2"]])
    save = normalize_save(df.iat[i, POS["save"]])
    rp_desc = clean(df.iat[i, POS["desc"]])      # RP description
    effect = clean(df.iat[i, POS["effect"]])     # Game effect

    md.extend(format_condition_block(pos_name, "Positif", domaines, save, rp_desc, effect))

md.append("\n## Conditions négatives\n\n")

for i in range(len(df)):
    pos_name = clean(df.iat[i, POS["name"]])
    neg_name = clean(df.iat[i, NEG["name"]])

    if is_stop_name(pos_name) or is_stop_name(neg_name):
        break

    if is_skip_name(pos_name) or is_skip_name(neg_name):
        continue

    domaines = join_domaines(df.iat[i, NEG["d1"]], df.iat[i, NEG["d2"]])
    save = normalize_save(df.iat[i, NEG["save"]])
    rp_desc = clean(df.iat[i, NEG["desc"]])
    effect = clean(df.iat[i, NEG["effect"]])

    md.extend(format_condition_block(neg_name, "Négatif", domaines, save, rp_desc, effect))

# --- Write ---
os.makedirs(os.path.dirname(MARKDOWN_OUTPUT), exist_ok=True)
with open(MARKDOWN_OUTPUT, "w", encoding="utf-8") as f:
    f.write("\n".join(md).strip() + "\n")

print(f"✅ conditions.md generated at: {MARKDOWN_OUTPUT}")
