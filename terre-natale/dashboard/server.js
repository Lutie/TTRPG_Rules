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

// Crée les dossiers si nécessaire
fs.mkdirSync(CHARACTERS_DIR, { recursive: true });
if (!fs.existsSync(CAMPAIGNS_FILE)) {
  fs.writeFileSync(CAMPAIGNS_FILE, '[]', 'utf-8');
}

app.use(cors());
app.use(express.json({ limit: '5mb' }));

// Servir le frontend buildé en production
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

// === API Personnages ===

// Recevoir l'état d'un personnage (sync depuis app-react)
app.post('/api/sync', (req, res) => {
  const character = req.body;
  if (!character || !character.uuid) {
    return res.status(400).json({ error: 'UUID requis' });
  }

  const data = {
    ...character,
    _sync: {
      dateSync: new Date().toISOString(),
      nom: character.infos?.nom || 'Sans nom'
    }
  };

  const filePath = path.join(CHARACTERS_DIR, `${character.uuid}.json`);
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
