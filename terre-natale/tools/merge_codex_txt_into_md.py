from __future__ import annotations

import re
import sys
import unicodedata
from pathlib import Path


START_PREFIX = "<!-- codex-txt:start:"
END_PREFIX = "<!-- codex-txt:end:"


def slug(value: str) -> str:
    value = unicodedata.normalize("NFKD", value)
    value = "".join(c for c in value if not unicodedata.combining(c))
    value = value.lower().replace("œ", "oe")
    value = re.sub(r"[^a-z0-9]+", "-", value).strip("-")
    return value


def canonical_target(source_title: str) -> str:
    aliases = {
        "Identité générale d'Arjan": "Royaume d'Arjan",
        "Identité générale d'Asura": "Royaume d'Asura",
        "Identité générale de Sylvengarde": "Royaume de Sylvengarde",
        "Identité générale d'Atlas": "Royaume d'Atlas",
        "Identité générale de Keld": "Royaume Keld",
        "Identité générale des EFT": "États Fédérés Technocrates (EFT)",
        "Identité générale de Morr": "Royaume de Morr",
        "Identité générale d'Albalion": "Royaume d'Albalion",
        "Identité générale d'Aube": "Royaume d'Aube",
        "Identité générale de Rosaï": "Royaume de Rosaï",
        "Identité générale du Royaume Céleste": "Royaume Céleste",
        "Tellas — Nains des Profondeurs": "Nains des Profondeurs",
    }
    if source_title in aliases:
        return aliases[source_title]

    match = re.match(r"^(?:Arjan|Asura|Sylvengarde|Atlas|Keld|EFT|Morr|Albalion|Aube|Rosaï|Royaume Céleste) \((.+)\)$", source_title)
    if match:
        title = match.group(1)
        if title == "Aldanie / Erasia":
            return "Aldanie (Erasia)"
        if title == "Brethnorr":
            return "Brehtnorr"
        return title
    return source_title


def parse_identity_blocks(lines: list[str]) -> tuple[list[tuple[str, list[str]]], int]:
    starts: list[int] = []
    for index, line in enumerate(lines):
        if line.startswith("Actuellement :") and index:
            starts.append(index - 1)

    blocks: list[tuple[str, list[str]]] = []
    for pos, start in enumerate(starts):
        next_start = starts[pos + 1] if pos + 1 < len(starts) else len(lines)
        end = next_start
        while end > start and not lines[end - 1].strip():
            end -= 1
        blocks.append((lines[start].strip(), lines[start + 1 : end]))

    tail_start = len(lines)
    for index, line in enumerate(lines):
        if line.strip() == "OLD CIVILISATIONS":
            tail_start = index
            break
    if tail_start < len(lines):
        trimmed: list[tuple[str, list[str]]] = []
        for title, body in blocks:
            title_index = lines.index(title)
            if title_index < tail_start:
                trimmed.append((title, body))
        blocks = trimmed
    return blocks, tail_start


def format_identity_block(source_title: str, body: list[str]) -> str:
    key = slug(source_title)
    out = [
        f"{START_PREFIX}{key} -->",
        "##### Fiche d’identité culturelle et toponymique",
        "",
        "> Source : consolidation de `Codex.txt`. Pour toute appartenance ou position géographique, la carte du monde actuelle prévaut.",
        "",
    ]

    previous_was_field = False
    for body_index, raw in enumerate(body):
        if not raw.strip():
            continue
        text = raw.strip()
        if set(text) == {"="}:
            continue
        if body_index + 1 < len(body) and body[body_index + 1].strip() and set(body[body_index + 1].strip()) == {"="}:
            continue
        field = re.match(r"^([^:]{1,80})\s*:\s*(.*)$", text)
        if field and not raw[:1].isspace():
            label, value = field.groups()
            label = label.strip()
            if label == "Actuellement":
                label = "Synthèse"
            elif label == "Régions":
                label = "Régions — notes de travail, carte prioritaire"
            elif label.lower() == "capitale":
                label = "Capitale — à confirmer par la carte en cas de conflit"
            rendered_value = value.strip()
            suffix = f" {rendered_value}" if rendered_value else ""
            out.append(f"- **{label}** :{suffix}")
            previous_was_field = True
        elif raw[:1].isspace() or previous_was_field:
            out.append(f"  - {text}")
        else:
            out.append(f"- {text}")
        previous_was_field = bool(field) or raw[:1].isspace()

    out.extend(["", f"{END_PREFIX}{key} -->"])
    return "\n".join(out)


def strip_generated_blocks(markdown: str) -> str:
    pattern = re.compile(
        r"(?:\r?\n)*<!-- codex-txt:start:([^ ]+) -->.*?<!-- codex-txt:end:\1 -->(?:\r?\n)*",
        re.DOTALL,
    )
    return pattern.sub("\n\n", markdown)


def heading_positions(markdown: str) -> dict[str, tuple[int, int]]:
    positions: dict[str, tuple[int, int]] = {}
    offset = 0
    for line in markdown.splitlines(keepends=True):
        match = re.match(r"^(#{2,5})\s+(.+?)\s*$", line.rstrip("\r\n"))
        if match:
            positions[slug(match.group(2))] = (offset, offset + len(line))
        offset += len(line)
    return positions


def insert_after_heading(markdown: str, heading: str, block: str) -> str:
    positions = heading_positions(markdown)
    target = slug(heading)
    if target not in positions:
        raise KeyError(f"Titre Markdown introuvable : {heading}")
    _, end = positions[target]
    return markdown[:end] + "\n" + block + "\n" + markdown[end:]


def format_general_principles(lines: list[str]) -> str:
    start = next((i for i, line in enumerate(lines) if line.strip() == "Pour infos:"), None)
    end = next((i for i, line in enumerate(lines) if line.strip() == "ARJAN"), None)
    if start is None or end is None:
        return ""
    content = [line.strip() for line in lines[start + 1 : end] if line.strip() and set(line.strip()) != {"="}]
    key = "principes-generaux"
    out = [
        f"{START_PREFIX}{key} -->",
        "## Principes généraux de magie, technologie et foi",
        "",
    ]
    out.extend(f"- {line}" for line in content)
    out.extend(["", f"{END_PREFIX}{key} -->"])
    return "\n".join(out)


def format_transversal_tail(lines: list[str]) -> str:
    heading_map = {
        "OLD CIVILISATIONS": "Civilisations anciennes et inspirations linguistiques",
        "AUTRES NOTES": "Autres notes transversales",
        "Géographie": "Réservoir géographique à consolider",
        "MERVEILLES": "Merveilles à développer",
        "MERVEILLES naturels": "Merveilles naturelles à développer",
        "LORE": "Pistes de lore à développer",
    }
    key = "materiaux-transversaux"
    out = [
        f"{START_PREFIX}{key} -->",
        "## Matériaux transversaux issus du carnet",
        "",
        "> Ces éléments sont conservés dans la bible pour développement ultérieur. Les rattachements géographiques restent subordonnés à la carte du monde actuelle.",
        "",
    ]
    index = 0
    while index < len(lines):
        line = lines[index].strip()
        if line in heading_map:
            out.extend([f"### {heading_map[line]}", ""])
            index += 2 if index + 1 < len(lines) and set(lines[index + 1].strip()) == {"="} else 1
            continue
        if not line:
            index += 1
            continue
        if line.startswith("*"):
            out.append("-" + line[1:])
        else:
            out.append(f"- {line}")
        index += 1
    out.extend(["", f"{END_PREFIX}{key} -->"])
    return "\n".join(out)


def main() -> int:
    if len(sys.argv) != 3:
        print("Usage: merge_codex_txt_into_md.py Codex.txt Codex.md", file=sys.stderr)
        return 2

    txt_path = Path(sys.argv[1])
    md_path = Path(sys.argv[2])
    txt_lines = txt_path.read_text(encoding="utf-8-sig").splitlines()
    markdown = md_path.read_text(encoding="utf-8-sig")
    markdown = strip_generated_blocks(markdown)

    blocks, tail_start = parse_identity_blocks(txt_lines)
    inserted: list[str] = []
    missing: list[tuple[str, str]] = []

    for source_title, body in blocks:
        target = canonical_target(source_title)
        try:
            markdown = insert_after_heading(markdown, target, format_identity_block(source_title, body))
            inserted.append(f"{source_title} -> {target}")
        except KeyError:
            missing.append((source_title, target))

    principles = format_general_principles(txt_lines)
    if principles:
        zone_match = re.search(r"^## Zone 1", markdown, flags=re.MULTILINE)
        if not zone_match:
            raise RuntimeError("Section Zone 1 introuvable")
        markdown = markdown[: zone_match.start()] + principles + "\n\n" + markdown[zone_match.start() :]

    if tail_start < len(txt_lines):
        transversal = format_transversal_tail(txt_lines[tail_start:])
        org_match = re.search(r"^## Organisations Transversales", markdown, flags=re.MULTILINE)
        insert_at = org_match.start() if org_match else len(markdown)
        markdown = markdown[:insert_at] + transversal + "\n\n" + markdown[insert_at:]

    if missing:
        for source, target in missing:
            print(f"MANQUANT: {source} -> {target}", file=sys.stderr)
        return 1

    md_path.write_text(markdown.rstrip() + "\n", encoding="utf-8")
    print(f"Fiches intégrées : {len(inserted)}")
    for item in inserted:
        print(item)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
