# Terre Natale — Contexte Projet

Système de gestion de personnages pour un TTRPG maison, composé de deux apps React + un répertoire de règles/docs.

---

## Structure du dépôt

```
terre-natale/
├── app-sheet/          # Fiche de personnage (joueur)
├── app-dash/           # Dashboard de campagne (MJ)
├── docs/               # Règles du jeu (MkDocs)
├── src/                # Sources MkDocs (markdown)
├── tools/              # Scripts Python (génération de données)
├── saves/              # Sauvegardes JSON de personnages
├── docker-compose.yml
└── mkdocs.yml
```

---

## app-sheet — Fiche de personnage

**Rôle :** Interface joueur pour créer et gérer un personnage. Données stockées en localStorage. Synchronisation manuelle ou auto (30s) vers app-dash.

**Stack :** React 19 + Vite — app purement statique servie par nginx.

**Port Docker :** 8080 (nginx interne :80)

**Fichiers clés :**
- `src/App.jsx` — UI principale, 10 onglets, bouton sync, export PDF
- `src/context/CharacterContext.jsx` — état global, CRUD personnages, logique de sync (`POST /api/sync`)
- `src/hooks/useCharacterCalculations.js` — calculs dérivés (PP, XP, ressources max…)
- `src/data/index.js` — données statiques (castes, compétences…), importe `./traits.js`
- `src/data/traits.js` — **AUTO-GÉNÉRÉ** par `tools/generate_traits_js.py`
- `src/components/tabs/` — un composant par onglet (TabPrincipal, TabStatus, TabTraits…)
- `src/utils/printCharacter.js` — export PDF

**Onglets :** Status · Principal · Compétences · Aptitudes · Traits · Inventaire · Mémoire · Magie · Notes · Config

**Config utilisateur (localStorage) :**
- `terreNatale_dashboardUrl` — URL d'app-dash (défaut : `https://dash.thalifen.synology.me`)
- `terreNatale_syncEnabled` — active/désactive la sync auto
- `terreNatale_characters` — tous les personnages (objet JSON, clé = UUID)

---

## app-dash — Dashboard MJ

**Rôle :** Outil MJ pour centraliser les fiches reçues des joueurs, organiser des campagnes, gérer des confrontations et des PNJ.

**Stack :** React 19 + Vite (frontend) + Express 5 (backend Node.js). Le backend sert aussi le frontend buildé en prod.

**Port Docker :** 3100

**Fichiers clés :**
- `server.js` — backend Express, toute l'API REST, persistence fichier JSON
- `vite.config.js` — en dev, proxy `/api` → `http://localhost:3100`
- `src/App.jsx` — UI principale, polling toutes les 10s
- `src/components/` — CampaignList, CampaignView, ConfrontationList, ConfrontationView, CharacterList, CharacterCard, NpcCard

**API :**
| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/api/sync` | Reçoit un personnage depuis app-sheet, stocke dans `data/characters/{uuid}.json` |
| GET | `/api/characters` | Liste des personnages reçus (résumé) |
| GET | `/api/characters/:uuid` | Données complètes d'un personnage |
| CRUD | `/api/campaigns` | Gestion des campagnes |
| CRUD | `/api/confrontations` | Gestion des confrontations (rencontres) |
| CRUD | `/api/npc-presets` | Templates de PNJ |

**Données persistées (volume Docker `./app-dash/data/`) :**
- `characters/` — un fichier JSON par personnage (UUID comme nom)
- `campaigns.json`
- `confrontations.json`
- `npc_presets.json`

---

## Interconnexion

```
app-sheet (navigateur joueur)
    │
    │  POST /api/sync  (manuel ou auto toutes les 30s)
    │  → URL configurable dans l'onglet Config de la fiche
    ▼
app-dash :3100 (backend Express)
    │  stocke dans data/characters/{uuid}.json
    ▼
app-dash (frontend MJ)
    └─ polling GET /api/characters toutes les 10s
```

Les appels de sync partent du **navigateur du joueur** (pas du conteneur app-sheet). app-dash expose CORS ouvert pour accepter ces requêtes cross-origin.

---

## Pipeline Traits

1. Source : `tools/Compendium des Traits.docx.txt`
2. `python3 tools/parse_traits.py` → `tools/traits.json` (445 traits)
3. `python3 tools/generate_traits_js.py` → `app-sheet/src/data/traits.js`

**Types de traits :**
- `avantage_majeur` — coûtent des PP (★)
- `avantage_mineur` — gratuits, via slots (☆)
- `desavantage` — rapportent des PP (▼)
- `avantage_archetype` — comme majeur mais liés à un archétype

---

## Docker Compose

```yaml
app-dash:  ports: 3100:3100  volumes: ./app-dash/data:/app/data
app-sheet: ports: 8080:80    (pas de volume, stockage client)
```

---

## Docs (MkDocs)

Règles du jeu en markdown dans `src/`, buildées vers `site/` avec MkDocs Material. Déployées séparément (voir `NAS.md`).
