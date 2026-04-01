import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3100;

// Dossiers de données
const DATA_DIR = path.join(__dirname, 'data');
const CHARACTERS_DIR = path.join(DATA_DIR, 'characters');
const CAMPAIGNS_FILE = path.join(DATA_DIR, 'campaigns.json');
const CONFRONTATIONS_FILE = path.join(DATA_DIR, 'confrontations.json');
const NPC_PRESETS_FILE = path.join(DATA_DIR, 'npc_presets.json');
const PLAYERS_FILE = path.join(DATA_DIR, 'players.json');

// Crée les dossiers si nécessaire
fs.mkdirSync(CHARACTERS_DIR, { recursive: true });
if (!fs.existsSync(CAMPAIGNS_FILE)) {
  fs.writeFileSync(CAMPAIGNS_FILE, '[]', 'utf-8');
}
if (!fs.existsSync(CONFRONTATIONS_FILE)) {
  fs.writeFileSync(CONFRONTATIONS_FILE, '[]', 'utf-8');
}
if (!fs.existsSync(NPC_PRESETS_FILE)) {
  fs.writeFileSync(NPC_PRESETS_FILE, '[]', 'utf-8');
}
if (!fs.existsSync(PLAYERS_FILE)) {
  fs.writeFileSync(PLAYERS_FILE, '[]', 'utf-8');
}

app.use(cors());
app.use(express.json({ limit: '5mb' }));

// Servir le frontend buildé en production
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

// === API Joueurs ===

const loadPlayers = () => {
  try { return JSON.parse(fs.readFileSync(PLAYERS_FILE, 'utf-8')); }
  catch { return []; }
};
const savePlayers = (p) => fs.writeFileSync(PLAYERS_FILE, JSON.stringify(p, null, 2), 'utf-8');

const generateToken = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let token = '';
  for (let i = 0; i < 8; i++) {
    if (i === 4) token += '-';
    token += chars[Math.floor(Math.random() * chars.length)];
  }
  return token;
};

// Lister les joueurs (MJ)
app.get('/api/players', (req, res) => {
  res.json(loadPlayers());
});

// Créer un joueur (MJ)
app.post('/api/players', (req, res) => {
  const { nom } = req.body;
  if (!nom) return res.status(400).json({ error: 'Nom requis' });
  const players = loadPlayers();
  const player = {
    id: crypto.randomUUID(),
    nom,
    token: generateToken(),
    dateCreation: new Date().toISOString()
  };
  players.push(player);
  savePlayers(players);
  res.json(player);
});

// Supprimer un joueur
app.delete('/api/players/:id', (req, res) => {
  savePlayers(loadPlayers().filter(p => p.id !== req.params.id));
  res.json({ ok: true });
});

// Authentifier un token (depuis app-sheet)
app.post('/api/players/auth', (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ error: 'Token requis' });
  const player = loadPlayers().find(p => p.token === token);
  if (!player) return res.status(404).json({ error: 'Token invalide' });
  res.json({ ok: true, nom: player.nom });
});

// Récupérer les personnages d'un joueur (pull depuis app-sheet)
app.get('/api/players/:token/characters', (req, res) => {
  const player = loadPlayers().find(p => p.token === req.params.token);
  if (!player) return res.status(404).json({ error: 'Token invalide' });

  const files = fs.readdirSync(CHARACTERS_DIR).filter(f => f.endsWith('.json'));
  const characters = files.map(f => {
    try {
      const data = JSON.parse(fs.readFileSync(path.join(CHARACTERS_DIR, f), 'utf-8'));
      return data._sync?.playerToken === req.params.token ? data : null;
    } catch { return null; }
  }).filter(Boolean);

  res.json(characters);
});

// === API Personnages ===

// Recevoir l'état d'un personnage (sync depuis app-sheet)
app.post('/api/sync', (req, res) => {
  const { playerToken, dateModification, ...character } = req.body;
  if (!character || !character.uuid) {
    return res.status(400).json({ error: 'UUID requis' });
  }

  const filePath = path.join(CHARACTERS_DIR, `${character.uuid}.json`);

  // Vérification de conflit : refuser si le serveur a une version plus récente
  if (fs.existsSync(filePath)) {
    const existing = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const existingDate = existing._sync?.dateModification;
    if (existingDate && dateModification && existingDate > dateModification) {
      return res.status(409).json({
        error: 'conflict',
        message: 'Le serveur possède une version plus récente',
        serverDate: existingDate
      });
    }
  }

  const data = {
    ...character,
    _sync: {
      dateSync: new Date().toISOString(),
      dateModification: dateModification || new Date().toISOString(),
      nom: character.infos?.nom || 'Sans nom',
      playerToken: playerToken || null
    }
  };

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  res.json({ ok: true, uuid: character.uuid });
});

// Lister tous les personnages reçus
app.get('/api/characters', (req, res) => {
  const files = fs.readdirSync(CHARACTERS_DIR).filter(f => f.endsWith('.json'));
  const characters = files.map(f => {
    try {
      const data = JSON.parse(fs.readFileSync(path.join(CHARACTERS_DIR, f), 'utf-8'));
      return {
        uuid: data.uuid,
        nom: data._sync?.nom || data.infos?.nom || 'Sans nom',
        dateSync: data._sync?.dateSync || null,
        caste: data.caste?.nom || '',
        rang: data.caste?.rang || 0
      };
    } catch { return null; }
  }).filter(Boolean);

  res.json(characters);
});

// Récupérer un personnage par UUID
app.get('/api/characters/:uuid', (req, res) => {
  const filePath = path.join(CHARACTERS_DIR, `${req.params.uuid}.json`);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Personnage non trouvé' });
  }
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  res.json(data);
});

// === API Campagnes ===

const loadCampaigns = () => {
  try {
    return JSON.parse(fs.readFileSync(CAMPAIGNS_FILE, 'utf-8'));
  } catch { return []; }
};

const saveCampaigns = (campaigns) => {
  fs.writeFileSync(CAMPAIGNS_FILE, JSON.stringify(campaigns, null, 2), 'utf-8');
};

// Lister les campagnes
app.get('/api/campaigns', (req, res) => {
  res.json(loadCampaigns());
});

// Créer une campagne
app.post('/api/campaigns', (req, res) => {
  const { nom } = req.body;
  if (!nom) return res.status(400).json({ error: 'Nom requis' });

  const campaigns = loadCampaigns();
  const campaign = {
    id: crypto.randomUUID(),
    nom,
    personnages: [],
    dateCreation: new Date().toISOString()
  };
  campaigns.push(campaign);
  saveCampaigns(campaigns);

  res.json(campaign);
});

// Mettre à jour une campagne (ajouter/retirer personnages)
app.put('/api/campaigns/:id', (req, res) => {
  const campaigns = loadCampaigns();
  const idx = campaigns.findIndex(c => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Campagne non trouvée' });

  const { nom, personnages } = req.body;
  if (nom !== undefined) campaigns[idx].nom = nom;
  if (personnages !== undefined) campaigns[idx].personnages = personnages;
  saveCampaigns(campaigns);

  res.json(campaigns[idx]);
});

// Supprimer une campagne
app.delete('/api/campaigns/:id', (req, res) => {
  let campaigns = loadCampaigns();
  campaigns = campaigns.filter(c => c.id !== req.params.id);
  saveCampaigns(campaigns);
  res.json({ ok: true });
});

// === API Confrontations ===

const loadConfrontations = () => {
  try {
    return JSON.parse(fs.readFileSync(CONFRONTATIONS_FILE, 'utf-8'));
  } catch { return []; }
};

const saveConfrontations = (confrontations) => {
  fs.writeFileSync(CONFRONTATIONS_FILE, JSON.stringify(confrontations, null, 2), 'utf-8');
};

app.get('/api/confrontations', (req, res) => {
  res.json(loadConfrontations());
});

app.post('/api/confrontations', (req, res) => {
  const { nom } = req.body;
  if (!nom) return res.status(400).json({ error: 'Nom requis' });

  const confrontations = loadConfrontations();
  const confrontation = {
    id: crypto.randomUUID(),
    nom,
    npcs: [],
    dateCreation: new Date().toISOString()
  };
  confrontations.push(confrontation);
  saveConfrontations(confrontations);
  res.json(confrontation);
});

app.put('/api/confrontations/:id', (req, res) => {
  const confrontations = loadConfrontations();
  const idx = confrontations.findIndex(c => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Confrontation non trouvée' });

  const { nom, npcs } = req.body;
  if (nom !== undefined) confrontations[idx].nom = nom;
  if (npcs !== undefined) confrontations[idx].npcs = npcs;
  saveConfrontations(confrontations);
  res.json(confrontations[idx]);
});

app.delete('/api/confrontations/:id', (req, res) => {
  let confrontations = loadConfrontations();
  confrontations = confrontations.filter(c => c.id !== req.params.id);
  saveConfrontations(confrontations);
  res.json({ ok: true });
});

// === API Présets PNJ ===

const loadPresets = () => {
  try { return JSON.parse(fs.readFileSync(NPC_PRESETS_FILE, 'utf-8')); }
  catch { return []; }
};
const savePresets = (p) => fs.writeFileSync(NPC_PRESETS_FILE, JSON.stringify(p, null, 2), 'utf-8');

app.get('/api/npc-presets', (req, res) => res.json(loadPresets()));

app.post('/api/npc-presets', (req, res) => {
  const { nom, ressources, armure_physique, armure_mentale, ajustement_initiative, moral_perso } = req.body;
  if (!nom) return res.status(400).json({ error: 'Nom requis' });
  const presets = loadPresets();
  const preset = { id: crypto.randomUUID(), nom, ressources, armure_physique: armure_physique || 0, armure_mentale: armure_mentale || 0, ajustement_initiative: ajustement_initiative || 0, moral_perso: moral_perso || 0 };
  presets.push(preset);
  savePresets(presets);
  res.json(preset);
});

app.delete('/api/npc-presets/:id', (req, res) => {
  savePresets(loadPresets().filter(p => p.id !== req.params.id));
  res.json({ ok: true });
});

// Fallback → frontend SPA
app.get('/{*splat}', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Build not found. Run: npm run build');
  }
});

app.listen(PORT, () => {
  console.log(`Dashboard server running on http://localhost:${PORT}`);
});
