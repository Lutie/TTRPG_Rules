import re
import os
from bs4 import BeautifulSoup, NavigableString

html_path = "/home/lutie/Projects/TTRPG_Rules/terre-natale/src/Terre Natale.docx/TerreNatale.docx.html"
out_dir = "/home/lutie/Projects/TTRPG_Rules/terre-natale/docs/regles"
os.makedirs(out_dir, exist_ok=True)

with open(html_path, "r", encoding="utf-8") as f:
    soup = BeautifulSoup(f.read(), "html.parser")

body = soup.body

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def slugify(text):
    text = text.lower()
    for src, dst in [("àáâä","a"),("éèêë","e"),("îï","i"),("ôö","o"),("ùûü","u"),("ç","c")]:
        for c in src:
            text = text.replace(c, dst)
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return text.strip("-")

def clean_alt(alt):
    """Strip Google Docs auto-generated alt text."""
    if not alt:
        return ""
    if "AI-generated content" in alt or len(alt) > 80:
        return ""
    return alt

# Map specific image filenames to their text equivalent.
# Add entries here when a decorative icon carries semantic meaning.
IMAGE_TEXT_MAP = {
    "images/image2.png": "🪙",  # In-game currency gold coin icon
}

def normalize(text):
    """Normalize whitespace including non-breaking spaces."""
    text = text.replace("\xa0", " ")
    text = re.sub(r"[\n\r]+", " ", text)
    text = re.sub(r"[ \t]+", " ", text)
    return text.strip()

def inline_content(tag):
    """
    Render inline content as markdown string.
    Falls back to recursion for any unhandled tag (handles <p>, <div>, etc. inside cells).
    """
    parts = []
    for child in tag.children:
        if isinstance(child, NavigableString):
            parts.append(str(child))
        elif child.name == "img":
            src = child.get("src", "")
            text_equiv = IMAGE_TEXT_MAP.get(src)
            if text_equiv:
                parts.append(text_equiv)
            else:
                alt = clean_alt(child.get("alt", ""))
                if src:
                    parts.append(f"![{alt}]({src})")
        elif child.name in ("b", "strong"):
            inner = inline_content(child).strip()
            if inner:
                parts.append(f"**{inner}**")
        elif child.name in ("i", "em"):
            inner = inline_content(child).strip()
            if inner:
                parts.append(f"*{inner}*")
        elif child.name == "br":
            parts.append(" ")
        elif child.name == "a":
            inner = inline_content(child).strip()
            href = child.get("href", "")
            if inner and href:
                parts.append(f"[{inner}]({href})")
            elif inner:
                parts.append(inner)
        else:
            # Recurse into any other tag (p, span, div, td content, etc.)
            parts.append(inline_content(child))
    return "".join(parts)

def clean_inline(tag):
    """Get clean single-line text from a tag."""
    text = inline_content(tag)
    return normalize(text)

def cell_text(cell):
    """Get clean text for a table cell (no nested table content, no newlines)."""
    # Only collect direct inline/text content, skip nested tables
    parts = []
    for child in cell.children:
        if isinstance(child, NavigableString):
            parts.append(str(child))
        elif child.name == "table":
            pass  # skip nested tables in regular table cells
        elif child.name == "img":
            src = child.get("src", "")
            text_equiv = IMAGE_TEXT_MAP.get(src)
            if text_equiv:
                parts.append(text_equiv)
            else:
                alt = clean_alt(child.get("alt", ""))
                # Skip images with no alt text inside table cells (decorative icons)
                if src and alt:
                    parts.append(f"![{alt}]({src})")
        else:
            # Recurse inline (but still skip any nested tables inside)
            parts.append(inline_content(child))
    text = "".join(parts)
    text = normalize(text)
    # Strip decorative images (no alt text) from table cells
    text = re.sub(r'!\[\]\([^)]+\)\s*', '', text).strip()
    return text.replace("|", "\\|")

# ---------------------------------------------------------------------------
# Callout detection
# ---------------------------------------------------------------------------

CALLOUT_KEYWORDS = {
    "règles optionnelles": "tip",
    "règle optionnelle": "tip",
    "note": "note",
    "astuce": "tip",
    "rappel": "info",
    "attention": "warning",
    "avertissement": "warning",
    "important": "warning",
    "exemple": "example",
}

def callout_type(title):
    """Return admonition type if title matches a callout keyword, else None."""
    t = title.lower().strip()
    for kw, kind in CALLOUT_KEYWORDS.items():
        if t == kw or t.startswith(kw + " ") or t.startswith(kw + ":") or t.startswith(kw + "\xa0"):
            return kind
    return None

def indent_block(text, spaces=4):
    prefix = " " * spaces
    lines = text.split("\n")
    return "\n".join(prefix + line if line.strip() else "" for line in lines)

def process_cell_content(cell):
    """Render rich content inside a callout cell (text paragraphs, nested tables, lists, images)."""
    parts = []
    for child in cell.children:
        if isinstance(child, NavigableString):
            t = normalize(str(child))
            if t:
                parts.append(t + "\n\n")
        elif child.name == "p":
            text = clean_inline(child)
            if text:
                parts.append(text + "\n\n")
        elif child.name == "table":
            parts.append(process_tag(child))
        elif child.name in ("ul", "ol"):
            parts.append(process_tag(child))
        elif child.name == "img":
            src = child.get("src", "")
            alt = clean_alt(child.get("alt", ""))
            if src:
                parts.append(f"![{alt}]({src})\n\n")
        elif child.name in ("span", "div"):
            sub = process_cell_content(child)
            if sub.strip():
                parts.append(sub)
    result = "".join(parts)
    result = re.sub(r"\n{3,}", "\n\n", result)
    return result.strip()

# ---------------------------------------------------------------------------
# Main tag processor
# ---------------------------------------------------------------------------

def process_tag(tag):
    name = tag.name if tag.name else ""

    # --- Headings ---
    if name in ("h1","h2","h3","h4","h5","h6"):
        level = int(name[1])
        text = clean_inline(tag)
        if not text:
            return ""
        return "#" * level + " " + text + "\n\n"

    # --- Paragraph ---
    elif name == "p":
        imgs = tag.find_all("img")
        has_text = bool(tag.get_text(strip=True).replace("\xa0", "").strip())
        if not has_text and imgs:
            lines = [f"![{clean_alt(img.get('alt',''))}]({img.get('src','')})" for img in imgs]
            return "\n".join(lines) + "\n\n"
        text = clean_inline(tag)
        if not text:
            return ""
        return text + "\n\n"

    # --- Lists ---
    elif name in ("ul", "ol"):
        lines = []
        for i, li in enumerate(tag.find_all("li", recursive=False)):
            prefix = "- " if name == "ul" else f"{i+1}. "
            text = clean_inline(li)
            if text:
                lines.append(prefix + text)
        return "\n".join(lines) + "\n\n" if lines else ""

    # --- Tables ---
    elif name == "table":
        rows = tag.find_all("tr", recursive=False)
        if not rows:
            return ""

        first_cells = rows[0].find_all(["td","th"], recursive=False)

        # Callout: first row is a single-cell title matching a keyword
        if len(first_cells) == 1:
            title = clean_inline(first_cells[0])
            kind = callout_type(title)
            if kind:
                content_parts = []
                for row in rows[1:]:
                    cells = row.find_all(["td","th"], recursive=False)
                    for cell in cells:
                        c = process_cell_content(cell)
                        if c:
                            content_parts.append(c)
                content = "\n\n".join(content_parts)
                content = re.sub(r"\n{3,}", "\n\n", content)
                indented = indent_block(content)
                return f'!!! {kind} "{title}"\n{indented}\n\n'

        # Regular table — detect mismatched title row
        # (first row has fewer cols than data rows → treat as a section title)
        data_rows = [r for r in rows[1:]
                     if any(c.get_text(strip=True)
                            for c in r.find_all(["td","th"], recursive=False))]
        max_data_cols = max(
            (len(r.find_all(["td","th"], recursive=False)) for r in data_rows),
            default=0
        )
        first_col_count = len(first_cells)
        prefix = ""
        start_row = 0
        if data_rows and first_col_count < max_data_cols and first_col_count <= 2:
            title = clean_inline(rows[0])
            if title:
                prefix = f"**{title}**\n\n"
            start_row = 1

        md_rows = []
        header_done = False
        for row in rows[start_row:]:
            cells = row.find_all(["td","th"], recursive=False)
            if not cells:
                continue
            texts = [cell_text(c) for c in cells]
            if not any(t.strip() for t in texts):
                continue
            md_rows.append("| " + " | ".join(texts) + " |")
            if not header_done:
                md_rows.append("| " + " | ".join(["---"] * len(texts)) + " |")
                header_done = True
        if md_rows:
            return prefix + "\n".join(md_rows) + "\n\n"
        return prefix if prefix else ""

    # --- Containers ---
    elif name in ("div", "section"):
        parts = []
        for child in tag.children:
            if hasattr(child, "name") and child.name:
                parts.append(process_tag(child))
        return "".join(parts)

    return ""

# ---------------------------------------------------------------------------
# Document splitting
# ---------------------------------------------------------------------------

BLOCK_TAGS = {"h1","h2","h3","h4","h5","h6","p","ul","ol","table","div","section"}

blocks = [child for child in body.children
          if hasattr(child, "name") and child.name and child.name in BLOCK_TAGS]

chapters = []
current_title = "intro"
current_blocks = []

for block in blocks:
    if block.name == "h1":
        if current_blocks:
            chapters.append((current_title, current_blocks))
        current_title = clean_inline(block)
        current_blocks = [block]
    else:
        current_blocks.append(block)
if current_blocks:
    chapters.append((current_title, current_blocks))

for chapter_title, chapter_blocks in chapters:
    md_parts = [process_tag(b) for b in chapter_blocks]
    content = "".join(md_parts)
    content = re.sub(r"\n{3,}", "\n\n", content).strip() + "\n"

    slug = slugify(chapter_title) if chapter_title else "intro"
    filepath = os.path.join(out_dir, slug + ".md")

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)

    admons = content.count("!!!")
    imgs   = content.count("![")
    print(f"  {slug}.md ({len(content.splitlines())}L, {imgs} imgs, {admons} admons) — {chapter_title[:50]}")

print(f"\nTotal : {len(chapters)} fichiers")
