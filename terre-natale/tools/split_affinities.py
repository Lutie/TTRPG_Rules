#!/usr/bin/env python3
"""
Split the monolithic cult-affinity entry in particularites.json into individual entries,
and update ethnies.json to reference specific affinity anchors.
"""
import json
import re
import sys
from pathlib import Path

DATA_DIR = Path(__file__).parent.parent / "app-sheet" / "src" / "data"
PART_FILE = DATA_DIR / "particularites.json"
ETHN_FILE = DATA_DIR / "ethnies.json"

COMMON_EFFECT = (
    "When a test performed under the conditions of this Affinity results in a "
    "**Singularity**, the character gains a **+1 bonus** to that test.\n\n"
    "Multiple Affinities may apply to the same test and can stack. "
    "Affinities only apply when the fictional conditions are clearly met, "
    "as determined by the GM."
)

def slugify(name: str) -> str:
    """Convert 'Forest Affinity' → 'affinity-forest'"""
    # Remove "Affinity" suffix, strip, lowercase, replace spaces with dashes
    s = re.sub(r'\s+affinity\s*$', '', name, flags=re.IGNORECASE).strip()
    s = s.lower()
    s = re.sub(r'[^a-z0-9]+', '-', s)
    s = s.strip('-')
    return f"affinity-{s}"


def extract_affinities(description: str) -> dict[str, str]:
    """
    Parse lines like:  - **Forest Affinity** — Lush, forested...
    Returns dict: affinity_name → description_text
    """
    pattern = re.compile(r'- \*\*(.+? Affinity)\*\* — (.+)')
    affinities = {}
    for m in pattern.finditer(description):
        name = m.group(1).strip()
        desc = m.group(2).strip()
        affinities[name] = desc
    return affinities


def main():
    with open(PART_FILE, encoding="utf-8") as f:
        particularites = json.load(f)

    with open(ETHN_FILE, encoding="utf-8") as f:
        ethnies = json.load(f)

    # Extract all affinities from the big description
    cult_entry = particularites.get("cult-affinity", {})
    big_desc = cult_entry.get("description", "")
    affinities = extract_affinities(big_desc)
    print(f"Extracted {len(affinities)} affinities")

    # Build slug map: "Forest Affinity" → "affinity-forest"
    slug_map = {name: slugify(name) for name in affinities}

    # Add individual entries to particularites (before "cult-affinity" key)
    # We rebuild the dict in order to insert entries just before cult-affinity
    new_particularites = {}
    for key, val in particularites.items():
        if key == "cult-affinity":
            # Insert all individual affinity entries first
            for aff_name, aff_desc in affinities.items():
                slug = slug_map[aff_name]
                new_particularites[slug] = {
                    "nom": aff_name,
                    "description": aff_desc,
                    "effet": COMMON_EFFECT
                }
            # Keep the original cult-affinity entry (unchanged)
            new_particularites[key] = val
        else:
            new_particularites[key] = val

    # Update ethnies.json: replace anchor="cult-affinity" based on nom field
    updated_count = 0
    unknown_affinities = []

    for ethnie in ethnies:
        ethnie_key = ethnie.get("id", "?")
        for part in ethnie.get("particularites_culturelles", []):
            if part.get("anchor") == "cult-affinity":
                nom = part.get("nom", "")
                if nom in slug_map:
                    part["anchor"] = slug_map[nom]
                    updated_count += 1
                else:
                    # Try case-insensitive match
                    match = next(
                        (n for n in slug_map if n.lower() == nom.lower()),
                        None
                    )
                    if match:
                        part["anchor"] = slug_map[match]
                        updated_count += 1
                        print(f"  Case-insensitive match: '{nom}' → '{slug_map[match]}'")
                    else:
                        unknown_affinities.append((ethnie_key, nom))

    if unknown_affinities:
        print(f"\nWARNING: {len(unknown_affinities)} affinities not found in description:")
        for ek, nom in unknown_affinities:
            print(f"  ethnie '{ek}': '{nom}'")

    print(f"\nUpdated {updated_count} anchor references in ethnies.json")
    print(f"Added {len(affinities)} individual affinity entries to particularites.json")

    # Write files
    with open(PART_FILE, "w", encoding="utf-8") as f:
        json.dump(new_particularites, f, ensure_ascii=False, indent=2)
    print(f"Written: {PART_FILE}")

    with open(ETHN_FILE, "w", encoding="utf-8") as f:
        json.dump(ethnies, f, ensure_ascii=False, indent=2)
    print(f"Written: {ETHN_FILE}")


if __name__ == "__main__":
    main()
