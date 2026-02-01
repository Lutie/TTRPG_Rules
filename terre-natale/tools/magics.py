#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Parse magic word spreadsheet and generate markdown files:
- one markdown per school (sheet)
- one markdown per domain (based on icons in the "keys" column)
- one JSON file listing all magic words

Features:
- Uses column LETTERS (A, B, C...)
- A start row index (e.g. line 3)
- Stops when a row is missing any required core fields
- Numbers entries per school/domain
- Highlights [bracketed] text in bold pink (HTML) in markdown
- Highlights keys in bold green
- Adds a final dot to descriptions when missing
- Builds a JSON file with all words
"""

from pathlib import Path
import pandas as pd
import re
import json
import unicodedata
import argparse
from typing import Dict, List, Tuple, Any, Optional

# =========================
# CONFIGURATION
# =========================

# Name of the Excel file exported from Google Sheets
INPUT_FILE = "Terre Natale - Aides de jeu _ Magies.xlsx"

# Where to put generated files
OUTPUT_DIR_SCHOOLS = Path("out_schools")
OUTPUT_DIR_DOMAINS = Path("out_domains")
OUTPUT_JSON = Path("all_magic_words.json")
OUTPUT_SPELLS_DIR = Path("out_spells")
OUTPUT_EXTRA_JSON = Path("other_magic_words.json")

# Mapping of sheet names (tabs) to pretty school names and filenames
SCHOOL_SHEETS: Dict[str, Dict[str, str]] = {
    "Dest": {"label": "École de Destruction", "filename": "destruction.md"},
    "Rest": {"label": "École de Restauration", "filename": "restauration.md"},
    "Béné": {"label": "École de Bénédiction", "filename": "benediction.md"},
    "Malé": {"label": "École de Malédiction", "filename": "malediction.md"},
    "Invoc": {"label": "École d'Invocation", "filename": "invocation.md"},
    "Abju": {"label": "École d'Abjuration", "filename": "abjuration.md"},
    "Divi": {"label": "École de Divination", "filename": "divination.md"},
    "Evoc": {"label": "École d'Évocation", "filename": "evocation.md"},
    "Conj": {"label": "École de Conjuration", "filename": "conjuration.md"},
    "Alté": {"label": "École d'Altération", "filename": "alteration.md"},
}

# Domains configuration: icon → (domain label, output filename)
DOMAINS: Dict[str, Tuple[str, str]] = {
    "🔥": ("Domaine du Feu", "feu.md"),
    "❄️": ("Domaine de la Glace", "glace.md"),
    "⚡": ("Domaine de la Foudre", "foudre.md"),
    "🪨": ("Domaine de la Terre", "terre.md"),
    "💧": ("Domaine de l'Eau", "eau.md"),
    "🌪️": ("Domaine de l'Air", "air.md"),
    "☀️": ("Domaine de la Lumière", "lumiere.md"),
    "🌑": ("Domaine de l'Ombre", "ombre.md"),
    "⚖️": ("Domaine de la Loi", "loi.md"),
    "🌀": ("Domaine du Chaos", "chaos.md"),
    "✨": ("Domaine du Sacré", "sacre.md"),
    "🩸": ("Domaine de l'Impie", "impie.md"),
    "❤️": ("Domaine de la Vie", "vie.md"),
    "☠️": ("Domaine de la Mort", "mort.md"),
    "⚕️": ("Domaine du Corps", "corps.md"),
    "🧠": ("Domaine de l'Esprit", "esprit.md"),
    "🐗": ("Domaine de la Faune", "faune.md"),
    "🌿": ("Domaine de la Flore", "flore.md"),
    "🧩": ("Domaine du Mental", "mental.md"),
    "⚜️": ("Domaine du Charme", "charme.md"),
    "✡️": ("Domaine de l'Arcane", "arcane.md"),
    "🔮": ("Domaine de la Magie", "magie.md"),
    "🪷": ("Domaine de la Nature", "nature.md"),
    "☢️": ("Domaine Toxique", "toxique.md"),
    "🎭": ("Domaine de l'Illusion", "illusion.md"),
    "📚": ("Domaine du Savoir", "savoir.md"),
    "👁️": ("Domaine de la Vision", "vision.md"),
    "⚔️": ("Domaine de l'Acier", "acier.md"),
    "🛡️": ("Domaine de la Guerre", "guerre.md"),
    "💢": ("Domaine du Vide", "vide.md"),
}

# Column letters (A = 0, B = 1, etc.)
COLUMNS_LETTER = {
    "latin": "A",        # Latin
    "arcane": "B",       # Mot arcanique
    "vulgar": "C",       # Mot vulguaire
    "word_type": "D",    # Type de Mot
    "target_type": "E",  # Type de Cible
    "difficulty": "F",   # Difficulté
    "drain": "G",        # Drain
    "description": "H",  # Description
    "keys": "I",         # Clés
    # "prod": "J",       # Prod (ignored)
}

# Pages spéciales : L (Liaison), A (Annexe), F (Forme)
# Chaque entrée définit les colonnes utilisées
SPECIAL_SHEETS = {
    "L": {
        "category": "Liaison",
        "type": "liaison",
        "start_row_index": 1,
        "columns": {
            "name": "A",
            "word_type": "B",
            "difficulty": "D",
            "drain": "E",
            "description": "F",
        },
    },
    "A": {
        "category": "Annexe",
        "type": "annexe",
        "start_row_index": 1,
        "columns": {
            "name": "A",
            "word_type": "B",
            "difficulty": "D",
            "drain": "E",
            "description": "F",
        },
    },
    "F": {
        "category": "Forme",
        "type": "forme",
        "start_row_index": 1,  # pour récupérer "Soi"
        "columns": {
            "name": "A",
            "word_type": "B",
            "difficulty": "E",
            "drain": "F",
            "description": "G",
            "mag_mod": "H",   # <-- Modificateurs de Magnitude
        },
    },
}


# Row index to start parsing (0-based): 2 = line 3 in the sheet
START_ROW_INDEX = 2

# Fields that must all be present; otherwise we stop parsing for that school
REQUIRED_FIELDS = [
    "latin",
    "arcane",
    "vulgar",
    "word_type",
    "target_type",
    "difficulty",
    "drain",
    "description",
    "keys",
]

# =========================
# HELPERS
# =========================

def safe(value: Any) -> str:
    """Convert NaN/None to empty string and cast everything to str."""
    if pd.isna(value):
        return ""
    return str(value).strip()

def letter_to_index(letter: str) -> int:
    """Convert a column letter (A, B, C...) to a 0-based index."""
    letter = letter.upper()
    return ord(letter) - ord("A")

def get_field(row: pd.Series, field_key: str) -> str:
    """Get a cell from the row using our COLUMNS_LETTER mapping."""
    col_letter = COLUMNS_LETTER[field_key]
    col_index = letter_to_index(col_letter)
    if col_index >= len(row):
        return ""
    return safe(row.iloc[col_index])

def row_has_required_fields(row: pd.Series) -> bool:
    """Return True if all required fields are non-empty."""
    for key in REQUIRED_FIELDS:
        if get_field(row, key) == "":
            return False
    return True

def ensure_final_dot(text: str) -> str:
    """If text is non-empty and doesn't end with . ! ? …, add a final dot."""
    if not text:
        return text
    stripped = text.rstrip()
    if not stripped:
        return text
    if stripped[-1] in ".!?…":
        return stripped
    return stripped + "."

def highlight_brackets(text: str) -> str:
    """
    Wrap [something] as bold pink HTML in markdown.
    Example: [Foo] -> <span style="color:#ff1493; font-weight:bold;">[Foo]</span>
    """
    if not text:
        return text

    def repl(match: re.Match) -> str:
        inner = match.group(0)  # includes brackets
        return f'<span style="color:#ff1493; font-weight:bold;">{inner}</span>'

    return re.sub(r"\[[^\]]+\]", repl, text)

def highlight_keys(text: str) -> str:
    """
    Wrap key text in bold green HTML.
    Example: Feu -> <span style="color:#228B22; font-weight:bold;">Feu</span>
    """
    if not text:
        return text
    return f'<span style="color:#228B22; font-weight:bold;">{text}</span>'

def extract_domains_from_keys(keys_raw: str) -> List[str]:
    """Return list of domain icons present in keys_raw."""
    domains: List[str] = []
    for icon in DOMAINS.keys(): 
        if icon in keys_raw:
            domains.append(icon)
    return domains

def row_to_markdown(
    row: pd.Series,
    school_label: str | None = None,
    index: int | None = None,
    cell_ref: str | None = None
) -> str:
    """
    Turn one row into a markdown block.

    #### 1. Mot vulguaire
    *École :* X
    *Latin :* ..., *Arcanique :* ...
    *Type de mot :* ..., *Type de cible :* ...
    *Difficulté :* X, *Drain :* Y
    **Clés :** ...
    Description.
    """
    latin = get_field(row, "latin")
    arcane = get_field(row, "arcane")
    vulgar = get_field(row, "vulgar")
    word_type = get_field(row, "word_type")
    target_type = get_field(row, "target_type")
    difficulty = get_field(row, "difficulty")
    drain = get_field(row, "drain")

    # Description: add dot if missing, then highlight brackets
    raw_description = get_field(row, "description")
    raw_description = ensure_final_dot(raw_description)
    description = highlight_brackets(raw_description)

    # Keys: no highlighting here (just raw text)
    keys_raw = get_field(row, "keys")
    keys = keys_raw

    if not vulgar:
        return ""

    lines: List[str] = []

    # Title with optional cell reference
    title_parts = []
    if index is not None:
        title_parts.append(f"{index}.")
    title_parts.append(vulgar)
    
    if DEBUG_MODE and cell_ref:
        title_parts.append(f"[{cell_ref}]")
    
    lines.append(f"#### {' '.join(title_parts)}")

    # Optional school info (useful for domain view)
    if school_label:
        lines.append(f"***École :*** {school_label}")

    # Latin / Arcane (sans le type redondant)
    lines.append(f"***Latin :*** {latin}, ***Arcanique :*** {arcane}")

    # Word type / Target type
    lines.append(f"***Type de mot :*** {word_type}, ***Type de cible :*** {target_type}")

    # Difficulty / Drain
    lines.append(f"***Difficulté :*** {difficulty}, ***Drain :*** {drain}")

    # Keys
    if keys:
        lines.append(f"**Clés :** {keys}")

    # Description
    if description:
        lines.append(description)

    return "\n".join(lines)

def make_cell_ref(sheet_name: str, row_idx: int, col_letter: str) -> str:
    """Build an Excel-style reference like 'Dest'!C4"""
    # row_idx is 0-based in pandas, Excel is 1-based
    excel_row = row_idx + 1
    return f"'{sheet_name}'!{col_letter}{excel_row}"

# =========================
# MAIN GENERATION LOGIC
# =========================

def generate_markdown() -> None:
    input_path = Path(INPUT_FILE)
    if not input_path.exists():
        raise FileNotFoundError(f"Input file not found: {input_path}")

    OUTPUT_DIR_SCHOOLS.mkdir(exist_ok=True, parents=True)
    OUTPUT_DIR_DOMAINS.mkdir(exist_ok=True, parents=True)

    excel = pd.ExcelFile(input_path)

    # For domains and JSON
    all_rows: List[Tuple[str, str, pd.Series, str]] = []
    json_entries: List[Dict[str, Any]] = []
    global_index = 1

    # --------
    # Per-school files
    # --------
    for sheet_name, meta in SCHOOL_SHEETS.items():
        if sheet_name not in excel.sheet_names:
            print(f"[WARN] Onglet '{sheet_name}' introuvable, ignoré.")
            continue

        school_label = meta["label"]
        out_file = OUTPUT_DIR_SCHOOLS / meta["filename"]

        # Read sheet with NO HEADER: we work only with positions
        df = pd.read_excel(excel, sheet_name=sheet_name, header=None)

        blocks: List[str] = []

        entry_index = 1
        # Iterate from START_ROW_INDEX until a row is missing required fields
        for idx in range(START_ROW_INDEX, len(df)):
            row = df.iloc[idx]

            if not row_has_required_fields(row):
                # Stop parsing this school as soon as a row is incomplete
                break

            # Markdown block
            cell_ref = make_cell_ref(sheet_name, idx, COLUMNS_LETTER["vulgar"])
            block = row_to_markdown(
                row, 
                school_label=None, 
                index=entry_index,
                cell_ref=cell_ref
            )
            if block.strip():
                blocks.append(block)
                all_rows.append((sheet_name, school_label, row, cell_ref))

                # JSON entry (raw values, no HTML)
                latin = get_field(row, "latin")
                arcane = get_field(row, "arcane")
                vulgar = get_field(row, "vulgar")
                word_type = get_field(row, "word_type")
                target_type = get_field(row, "target_type")
                difficulty = get_field(row, "difficulty")
                drain = get_field(row, "drain")
                desc_raw = ensure_final_dot(get_field(row, "description"))
                keys_raw = get_field(row, "keys")
                domains_icons = extract_domains_from_keys(keys_raw)

                json_entries.append({
                    "id": global_index,
                    "school_code": sheet_name,
                    "school_label": school_label,
                    "latin": latin,
                    "arcane": arcane,
                    "vulgar": vulgar,
                    "word_type": word_type,
                    "target_type": target_type,
                    "difficulty": difficulty,
                    "drain": drain,
                    "description": desc_raw,
                    "keys": keys_raw,
                    "domains": domains_icons,
                    "cell_ref": cell_ref,
                })
                global_index += 1

                entry_index += 1

        num_entries = len(blocks)

        content_lines: List[str] = []
        content_lines.append(f"# {school_label}")
        content_lines.append("")
        content_lines.append(f"> {num_entries} mots pour cette école")
        content_lines.append("")

        if blocks:
            content_lines.append("\n\n---\n\n".join(blocks))
        else:
            content_lines.append("_Aucun mot trouvé pour cette école._")

        out_file.write_text("\n".join(content_lines), encoding="utf-8")
        print(f"[OK] Fichier école généré : {out_file}")

    # --------
    # Per-domain files (icon filters)
    # --------
    for icon, (domain_label, filename) in DOMAINS.items():
        out_file = OUTPUT_DIR_DOMAINS / filename

        domain_blocks: List[str] = []

        entry_index = 1
        for sheet_name, school_label, row, cell_ref in all_rows:
            keys_text = get_field(row, "keys")
            if icon in keys_text:
                block = row_to_markdown(
                    row,
                    school_label=school_label,
                    index=entry_index,
                    cell_ref=cell_ref
                )
                if block.strip():
                    domain_blocks.append(block)
                    entry_index += 1

        num_entries = len(domain_blocks)

        content_lines: List[str] = []
        content_lines.append(f"# {domain_label} {icon}")
        content_lines.append("")
        content_lines.append(f"> {num_entries} mots pour ce domaine")
        content_lines.append("")

        if domain_blocks:
            content_lines.append("\n\n---\n\n".join(domain_blocks))
        else:
            content_lines.append("_Aucun mot trouvé pour ce domaine._")

        out_file.write_text("\n".join(content_lines), encoding="utf-8")
        print(f"[OK] Fichier domaine généré : {out_file}")

    # --------
    # Global JSON
    # --------
    OUTPUT_JSON.write_text(
        json.dumps(json_entries, ensure_ascii=False, indent=2),
        encoding="utf-8"
    )
    print(f"[OK] Fichier JSON global généré : {OUTPUT_JSON}")

def generate_extra_words_json() -> None:
    """
    Parse sheets L, A, F and build a separate JSON source
    with 'liaison', 'annexe' and 'forme' words.
    """
    input_path = Path(INPUT_FILE)
    if not input_path.exists():
        raise FileNotFoundError(f"Input file not found: {input_path}")

    excel = pd.ExcelFile(input_path)

    entries: List[Dict[str, Any]] = []
    special_id = 1

    # Required fields for these special words
    required_fields = ["name", "word_type", "difficulty", "drain", "description"]

    for sheet_code, meta in SPECIAL_SHEETS.items():
        if sheet_code not in excel.sheet_names:
            print(f"[WARN] Onglet spécial '{sheet_code}' introuvable, ignoré.")
            continue

        category = meta["category"]
        word_type_group = meta["type"]
        cols = meta["columns"]
        start_idx = meta.get("start_row_index", START_ROW_INDEX)

        df = pd.read_excel(excel, sheet_name=sheet_code, header=None)

        for idx in range(start_idx, len(df)):
            row = df.iloc[idx]

            def get_special(key: str) -> str:
                letter = cols[key]
                col_index = letter_to_index(letter)
                if col_index >= len(row):
                    return ""
                return safe(row.iloc[col_index])

            # valeurs pour les champs requis
            row_values = {f: get_special(f) for f in required_fields}

            # debug ciblé sur "Soi"
            if row_values.get("name") == "Soi":
                print(f"[DEBUG] Feuille {sheet_code}, ligne {idx + 1} (Soi) valeurs : {row_values}")

            # si tout est vide → fin du tableau
            if all(v == "" for v in row_values.values()):
                break

            # si partiellement vide → on ignore la ligne
            if any(v == "" for v in row_values.values()):
                continue

            name = row_values["name"]
            wtype = row_values["word_type"]
            difficulty = row_values["difficulty"]
            drain = row_values["drain"]
            desc_raw = ensure_final_dot(row_values["description"])

            # optionnel : modificateurs de magnitude (seulement F)
            mag_mod = ""
            if "mag_mod" in cols:
                mag_mod = get_special("mag_mod")

            entries.append({
                "id": special_id,
                "sheet_code": sheet_code,
                "category": category,           # "Liaison" / "Annexe" / "Forme"
                "group_type": word_type_group,  # "liaison" / "annexe" / "forme"
                "name": name,
                "word_type": wtype,
                "difficulty": difficulty,
                "drain": drain,
                "description": desc_raw,
                "magnitude_modifiers": mag_mod,
            })
            special_id += 1

    OUTPUT_EXTRA_JSON.write_text(
        json.dumps(entries, ensure_ascii=False, indent=2),
        encoding="utf-8"
    )
    print(f"[OK] Fichier JSON supplémentaire généré : {OUTPUT_EXTRA_JSON}")

def slugify(text: str) -> str:
    """Turn a name into a filesystem-friendly slug."""
    text = text.strip().lower()
    text = unicodedata.normalize("NFKD", text)
    text = "".join(c for c in text if not unicodedata.combining(c))
    text = re.sub(r"[^a-z0-9]+", "-", text).strip("-")
    return text or "groupe"

def generate_spells_from_sorts() -> None:
    """
    Read the 'Sorts' sheet and generate spell descriptions,
    grouped into markdown files by school/domain (column A).

    Uses:
    - all_magic_words.json  (mots de pouvoir des écoles)
    - other_magic_words.json (mots L/A/F)
    """

    input_path = Path(INPUT_FILE)
    if not input_path.exists():
        raise FileNotFoundError(f"Input file not found: {input_path}")

    # Load JSON dictionaries
    if not OUTPUT_JSON.exists():
        raise FileNotFoundError(f"Missing JSON file: {OUTPUT_JSON}")
    if not OUTPUT_EXTRA_JSON.exists():
        raise FileNotFoundError(f"Missing JSON file: {OUTPUT_EXTRA_JSON}")

    with OUTPUT_JSON.open(encoding="utf-8") as f:
        main_words = json.load(f)

    with OUTPUT_EXTRA_JSON.open(encoding="utf-8") as f:
        extra_words = json.load(f)

    # Build lookup maps
    main_by_vulgar = {w["vulgar"]: w for w in main_words}
    extra_by_name = {w["name"]: w for w in extra_words}

    # Access 'Sorts' sheet
    excel = pd.ExcelFile(input_path)
    if "Sorts" not in excel.sheet_names:
        raise ValueError("Sheet 'Sorts' not found in workbook.")

    df = pd.read_excel(excel, sheet_name="Sorts", header=None)

    OUTPUT_SPELLS_DIR.mkdir(exist_ok=True, parents=True)

    # group_name -> list of spell markdown blocks
    spells_by_group: Dict[str, List[str]] = {}

    def get_cell(row: pd.Series, col_letter: str) -> str:
        idx = letter_to_index(col_letter)
        if idx >= len(row):
            return ""
        return safe(row.iloc[idx])

    # Role labels (for presentation)
    ROLE_LABELS = {
        "diffusion": "Mot de diffusion",
        "propagation": "Mot de propagation",
        "structure": "Mot de structure",
        "power": "Mot de pouvoir",
        "power_single": "Mot de pouvoir",
        "power_main": "Mot de pouvoir principal",
        "power2": "Mot de pouvoir secondaire",
        "avance": "Mot avancé",
        "liaison": "Mot de liaison",
        "linked": "Mot de pouvoir lié",
    }
    
    # Order of display for spell components
    ROLE_ORDER = {
        "diffusion": 1,
        "propagation": 2,
        "structure": 3,
        "power": 4,
        "power_single": 4,
        "power_main": 4,
        "power2": 5,
        "avance": 6,
        "liaison": 7,
        "linked": 8,
    }

    current_group: str | None = None

    for idx in range(START_ROW_INDEX, len(df)):
        row = df.iloc[idx]

        group_raw = get_cell(row, "A")  # école ou domaine
        title = get_cell(row, "B")      # titre du sort

        # fin de tableau
        if group_raw == "" and title == "":
            break

        if group_raw:
            current_group = group_raw

        if title == "":
            continue

        if current_group is None:
            current_group = "Inconnu"

        # --- noms de mots ---

        power_name = get_cell(row, "H")   # mot de pouvoir (nom vulgaire)
        power_key = get_cell(row, "I")    # clé du mot de pouvoir principal
        diffusion_name = get_cell(row, "K")
        propagation_name = get_cell(row, "L")
        structure_name = get_cell(row, "M")
        avance_name = get_cell(row, "N")
        liaison_names = [
            get_cell(row, "P"),
            get_cell(row, "Q"),
            get_cell(row, "R"),
        ]
        notes_raw = get_cell(row, "S")
        
        # NOUVELLES COLONNES
        power2_name = get_cell(row, "T")   # 2ème mot de pouvoir
        power2_key = get_cell(row, "U")    # clé du 2ème mot
        linked_name = get_cell(row, "V")   # clé liée
        linked_key = get_cell(row, "W")    # clé de la clé liée
        spell_description = get_cell(row, "X")  # description synthétique/RP du sort

        words_used: List[Dict[str, Any]] = []

        # Déterminer le rôle du mot de pouvoir principal selon le contexte
        has_power2 = bool(power2_name)
        has_linked = bool(linked_name)
        
        if power_name:
            # Ajuster le rôle selon qu'il y ait d'autres mots de pouvoir
            if has_power2 or has_linked:
                power_role = "power_main"
            else:
                power_role = "power_single"
            
            words_used.append({
                "role": power_role,
                "name": power_name,
                "key": power_key,
                "entry": main_by_vulgar.get(power_name),
                "source": "main",
            })

        def add_extra_word(role: str, name: str) -> None:
            if not name:
                return
            words_used.append({
                "role": role,
                "name": name,
                "entry": extra_by_name.get(name),
                "source": "extra",
            })

        add_extra_word("diffusion", diffusion_name)
        add_extra_word("propagation", propagation_name)
        add_extra_word("structure", structure_name)
        add_extra_word("avance", avance_name)

        for l_name in liaison_names:
            if l_name:
                add_extra_word("liaison", l_name)

        # AJOUT du 2ème mot de pouvoir
        if power2_name:
            words_used.append({
                "role": "power2",
                "name": power2_name,
                "key": power2_key,
                "entry": main_by_vulgar.get(power2_name),
                "source": "main",
            })

        # AJOUT de la clé liée
        if linked_name:
            words_used.append({
                "role": "linked",
                "name": linked_name,
                "key": linked_key,
                "entry": main_by_vulgar.get(linked_name),
                "source": "main",
            })

        # --- calcul difficulté & drain (avec X) ---

        def to_int(x: Any) -> int:
            try:
                return int(str(x).strip())
            except Exception:
                return 0

        total_difficulty = 8
        total_drain = 8
        x_coeff_total = 0  # somme des coefficients de X (par mot)

        def extract_x_coeff(val: str) -> int:
            """
            Return the coefficient of X in a string like 'X', '2X', '-X', '3X'.
            If parsing fails, default to 1.
            """
            val = val.strip().upper()
            if "X" not in val:
                return 0
            m = re.search(r"([+-]?\d*)\s*X", val)
            if not m:
                return 1
            coeff_str = m.group(1)
            if coeff_str in ("", "+"):
                return 1
            if coeff_str == "-":
                return -1
            try:
                return int(coeff_str)
            except Exception:
                return 1

        for w in words_used:
            entry = w["entry"]
            if not entry:
                continue

            diff_str = str(entry.get("difficulty", "")).strip()
            drain_str = str(entry.get("drain", "")).strip()

            # Coeff X par mot (on ne compte qu'une seule fois, même s'il y a X en diff ET en drain)
            has_x_diff = "X" in diff_str
            has_x_drain = "X" in drain_str
            
            if has_x_diff or has_x_drain:
                coeff_diff = extract_x_coeff(diff_str) if has_x_diff else 0
                coeff_drain = extract_x_coeff(drain_str) if has_x_drain else 0
                
                # Take the larger absolute value coefficient
                if abs(coeff_diff) >= abs(coeff_drain):
                    x_coeff_total += coeff_diff
                else:
                    x_coeff_total += coeff_drain

            # Add numeric parts (only if no X in that field)
            if not has_x_diff:
                total_difficulty += to_int(diff_str)

            if not has_x_drain:
                total_drain += to_int(drain_str)

        def format_with_x(base: int, x_coeff: int) -> str:
            """
            Format base + x_coeff*X :
            - base=14, x_coeff=2 -> '14+2X'
            - base=14, x_coeff=1 -> '14+X'
            - base=14, x_coeff=-1 -> '14-X'
            - base=0, x_coeff=1 -> 'X'
            - base=0, x_coeff=2 -> '2X'
            - base=0, x_coeff=-1 -> '-X'
            """
            if x_coeff == 0:
                return str(base)

            if base == 0:
                if x_coeff == 1:
                    return "X"
                if x_coeff == -1:
                    return "-X"
                return f"{x_coeff}X"

            if x_coeff == 1:
                return f"{base}+X"
            if x_coeff == -1:
                return f"{base}-X"

            sign = "+" if x_coeff > 0 else ""
            return f"{base}{sign}{x_coeff}X"

        difficulty_display = format_with_x(total_difficulty, x_coeff_total)
        drain_display = format_with_x(total_drain, x_coeff_total)

        # Récupérer le type de sort, l'école et le domaine depuis les mots de pouvoir
        spell_type = ""
        spell_schools = []
        spell_domains = []
        
        for w in words_used:
            if w["role"] in ("power_single", "power_main", "power2") and w["entry"]:
                # Type de sort (seulement du mot principal)
                if w["role"] in ("power_single", "power_main") and not spell_type:
                    spell_type = w["entry"].get("word_type", "")
                
                # École du sort
                school_label = w["entry"].get("school_label", "")
                if school_label and school_label not in spell_schools:
                    spell_schools.append(school_label)
                
                # Domaine (première lettre de chaque clé)
                key = w.get("key", "")
                if key:
                    # Prendre la première lettre de la clé
                    first_letter = key[0] if key else ""
                    if first_letter:
                        spell_domains.append(first_letter)

        # --- Sort words_used by display order ---
        words_used.sort(key=lambda w: ROLE_ORDER.get(w["role"], 99))

        # --- bloc markdown du sort ---

        lines: List[str] = []
        lines.append(f"## {title}")
        
        # Difficulté, Drain, Type de sort, Domaine et École
        type_part = f", ***Type de sort :*** {spell_type}" if spell_type else ""
        
        domain_str = "".join(spell_domains) if spell_domains else ""
        domain_part = f", ***Domaine du sort :*** {domain_str}" if domain_str else ""
        
        school_str = " et ".join(spell_schools) if spell_schools else ""
        school_part = f", ***École du sort :*** {school_str}" if school_str else ""
        
        lines.append(f"***Difficulté :*** {difficulty_display}, ***Drain :*** {drain_display}{type_part}{domain_part}{school_part}")
        
        # Séparer les mots de pouvoir des autres mots
        power_words = []
        other_words = []
        
        for w in words_used:
            if w["role"] in ("power_single", "power_main", "power2", "linked"):
                power_words.append(w)
            else:
                other_words.append(w)
        
        # Afficher les autres mots (diffusion, propagation, etc.) d'abord
        for w in other_words:
            role = w["role"]
            label = ROLE_LABELS.get(role, role.capitalize())
            entry = w["entry"]
            name = w["name"]
            
            if entry:
                desc_raw = ensure_final_dot(entry.get("description", ""))
                desc_md = highlight_brackets(desc_raw)
                
                # Nom du mot en vert
                word_name = highlight_keys(entry.get('name', name))
                
                line = f"**{label} :** {word_name} : {desc_md}"
                lines.append(line)

                # cas spécial : mot de structure → Modificateurs de Magnitude
                if role == "structure":
                    mag_mod = entry.get("magnitude_modifiers", "")
                    if mag_mod:
                        mag_mod_md = highlight_brackets(mag_mod)
                        lines.append(f"***Modificateurs de Magnitude :*** {mag_mod_md}")

            else:
                word_name = highlight_keys(name)
                line = f"**{label} :** {word_name} *(mot introuvable dans les dictionnaires)*"
                lines.append(line)
        
        # Encadré pour les mots de pouvoir (blockquote)
        if power_words:
            lines.append("")
            
            for w in power_words:
                role = w["role"]
                label = ROLE_LABELS.get(role, role.capitalize())
                entry = w["entry"]
                name = w["name"]
                key = w.get("key", "")
                
                if entry:
                    latin = entry.get("latin", "")
                    arcane = entry.get("arcane", "")
                    desc_raw = ensure_final_dot(entry.get("description", ""))
                    desc_md = highlight_brackets(desc_raw)

                    ref_part = ""
                    if DEBUG_MODE:
                        cell_ref = entry.get("cell_ref", "")
                        if cell_ref:
                            ref_part = f" [{cell_ref}]"
                    
                    # Format key in normal text if present
                    key_part = ""
                    if key:
                        key_part = f" ***Clé :*** {key}"

                    # Nom du mot en vert
                    word_name = highlight_keys(entry.get('vulgar', name))

                    line = (
                        f"> **{label} :** "
                        f"{word_name}{ref_part} ({latin} / {arcane}) : {desc_md}{key_part}"
                    )
                else:
                    key_part = ""
                    if key:
                        key_part = f" ***Clé :*** {key}"
                    word_name = highlight_keys(name)
                    line = (
                        f"> **{label} :** {word_name} "
                        f"*(mot introuvable dans les dictionnaires)*{key_part}"
                    )

                lines.append(line)
        
        # Description synthétique/RP du sort en bas (si présente)
        if spell_description:
            lines.append("")
            spell_desc_formatted = ensure_final_dot(spell_description)
            spell_desc_md = highlight_brackets(spell_desc_formatted)
            lines.append(f"***Description :*** {spell_desc_md}")

        # notes
        if notes_raw:
            lines.append("")
            notes = ensure_final_dot(notes_raw)
            notes_md = highlight_brackets(notes)
            lines.append(f"***Notes :*** {notes_md}")

        spell_block = "\n".join(lines).strip()

        group_name = current_group
        spells_by_group.setdefault(group_name, []).append(spell_block)

    # --- fichiers markdown par groupe ---

    for group_name, spells in spells_by_group.items():
        slug = slugify(group_name)
        out_file = OUTPUT_SPELLS_DIR / f"{slug}.md"

        content_lines: List[str] = []
        content_lines.append(f"# Sorts – {group_name}")
        content_lines.append("")
        content_lines.append(f"> {len(spells)} sorts pour {group_name}")
        content_lines.append("")
        content_lines.append("\n\n---\n\n".join(spells))

        out_file.write_text("\n".join(content_lines), encoding="utf-8")
        print(f"[OK] Fichier de sorts généré : {out_file}")

def check_duplicate_words() -> None:
    """
    Check for duplicate magic words that may cause ambiguous lookups,
    especially vulgar names shared between multiple schools.

    Prints warnings to the console so that you can fix / rename them.
    """
    # --- Vérif des mots de pouvoir (all_magic_words.json) ---

    if not OUTPUT_JSON.exists():
        print("[WARN] Impossible de vérifier les doublons : all_magic_words.json est introuvable.")
    else:
        with OUTPUT_JSON.open(encoding="utf-8") as f:
            main_words = json.load(f)

        by_vulgar: Dict[str, List[Dict[str, Any]]] = {}
        for w in main_words:
            key = w.get("vulgar", "").strip()
            if not key:
                continue
            by_vulgar.setdefault(key, []).append(w)

        print("\n=== Vérification des doublons (mots vulgaires, écoles) ===")
        has_duplicates = False
        for vulgar, entries in by_vulgar.items():
            if len(entries) > 1:
                has_duplicates = True
                schools = {e.get("school_code", "?") for e in entries}
                labels = {e.get("school_label", "?") for e in entries}
                ids = [str(e.get("id", "?")) for e in entries]
                print(
                    f"[WARN] Mot vulgaire en doublon : '{vulgar}' "
                    f"-> écoles: {', '.join(sorted(schools))} "
                    f"({'; '.join(sorted(labels))}), ids: {', '.join(ids)}"
                )
        if not has_duplicates:
            print("Aucun doublon trouvé sur les mots vulgaires.")

    # --- Vérif optionnelle des autres mots (other_magic_words.json) ---

    if not OUTPUT_EXTRA_JSON.exists():
        print("[INFO] other_magic_words.json introuvable, pas de vérif sur L/A/F.")
        return

    with OUTPUT_EXTRA_JSON.open(encoding="utf-8") as f:
        extra_words = json.load(f)

    by_name: Dict[str, List[Dict[str, Any]]] = {}
    for w in extra_words:
        key = w.get("name", "").strip()
        if not key:
            continue
        by_name.setdefault(key, []).append(w)

    print("\n=== Vérification des doublons (autres mots : L/A/F) ===")
    has_duplicates_extra = False
    for name, entries in by_name.items():
        if len(entries) > 1:
            has_duplicates_extra = True
            sheets = {e.get("sheet_code", "?") for e in entries}
            categories = {e.get("category", "?") for e in entries}
            ids = [str(e.get("id", "?")) for e in entries]
            print(
                f"[WARN] Mot 'autre' en doublon : '{name}' "
                f"-> feuilles: {', '.join(sorted(sheets))} "
                f"({'; '.join(sorted(categories))}), ids: {', '.join(ids)}"
            )

    if not has_duplicates_extra:
        print("Aucun doublon trouvé dans les mots L/A/F.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate magic word documentation")
    parser.add_argument("--debug", action="store_true", help="Enable debug mode (show cell references)")
    args = parser.parse_args()
    
    global DEBUG_MODE
    DEBUG_MODE = args.debug
    
    generate_markdown()             # écoles + domaines + all_magic_words.json
    generate_extra_words_json()     # L/A/F -> other_magic_words.json
    generate_spells_from_sorts()    # Sorts -> out_spells/*.md
    check_duplicate_words()         # vérifie les doublons et affiche des warnings