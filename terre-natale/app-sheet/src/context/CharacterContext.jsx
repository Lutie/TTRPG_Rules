import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import DATA from '../data';
import { getValeurTotale, calculerRangCaste } from '../hooks/useCharacterCalculations';

// Helper: slugify a string (mirrors tools/add_caste_ids.py logic)
const _slugify = (str) => {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
};

// Migration: convert old saved characters (French field names + nom strings) to new format
const migrateCharacterFields = (character) => {
  if (!character) return character;
  const infos = character.infos ? { ...character.infos } : {};
  let changed = false;

  // Helper: rename field + convert string value to id via lookup
  const migrateField = (oldKey, newKey, dataArray) => {
    if (oldKey in infos && !(newKey in infos)) {
      const val = infos[oldKey];
      if (val && dataArray) {
        const found = dataArray.find(d => d.nom === val || d.id === val);
        infos[newKey] = found ? found.id : val;
      } else {
        infos[newKey] = val || '';
      }
      delete infos[oldKey];
      changed = true;
    }
  };

  migrateField('ethnie', 'ethnicity', DATA.ethnies);
  migrateField('destinee', 'destiny', DATA.destinees);
  migrateField('vecu', 'background', DATA.vecus);
  migrateField('milieu', 'environment', DATA.milieux);
  migrateField('allegeance', 'allegiance', DATA.allegeances);
  migrateField('persona', 'persona', DATA.personas);
  migrateField('origine', 'origin', DATA.origines);
  migrateField('comportement', 'behavior', DATA.temperaments);
  migrateField('caractere', 'nature', DATA.temperaments);

  // Migrate caste.nom → caste.id
  let caste = character.caste ? { ...character.caste } : character.caste;
  if (caste && 'nom' in caste && !('id' in caste)) {
    const casteNom = caste.nom;
    const found = DATA.castes.find(c => c.nom === casteNom);
    caste = { ...caste, id: found ? found.id : _slugify(casteNom) };
    delete caste.nom;
    changed = true;
  }

  // Migrate memoire compendium entries (full object → { typeId, sourceId })
  const COMPENDIUM_TYPE_IDS = new Set([0, 3]); // Manœuvre, Prouesse
  let memoire = character.memoire;
  if (Array.isArray(memoire)) {
    const migratedMemoire = memoire.map(entry => {
      if (!COMPENDIUM_TYPE_IDS.has(entry.typeId)) return entry;
      if (entry.sourceId) return entry; // already migrated
      // Try to find sourceId by matching nom in the liste
      const type = DATA.typesMémoire.find(t => t.id === entry.typeId);
      const entryNom = entry.nom_fluff || entry.nom || '';
      const found = type?.liste?.find(e =>
        (e.nom_fluff || e.nom || '') === entryNom || e.nom === entry.nom
      );
      if (found) {
        changed = true;
        return { typeId: entry.typeId, sourceId: found.id };
      }
      // Can't resolve — keep as manual entry with nom only
      return { typeId: entry.typeId, nom: entryNom, description: '' };
    });
    if (changed) memoire = migratedMemoire;
  }

  if (!changed && caste === character.caste) return character;
  return {
    ...character,
    infos,
    ...(caste !== character.caste ? { caste } : {}),
    ...(memoire !== character.memoire ? { memoire } : {}),
  };
};

// État initial du personnage
const createEmptyCharacter = () => {
  const character = {
    uuid: crypto.randomUUID(),
    infos: {
      nom: '',
      origin: '',
      ethnicity: '',
      behavior: '',
      nature: '',
      destiny: '',
      background: '',
      environment: '',
      allegiance: '',
      persona: '',
      nombreFetiche: ''
    },
    attributs: {},
    caste: {
      id: '',
      rang: 0,
      attribut1: '',
      attribut2: ''
    },
    tradition: '',
    ressources: {
      PE: { actuel: 0, max: 0, temporaire: 0 },
      PV: { actuel: 0, max: 0, temporaire: 0 },
      PS: { actuel: 0, max: 0, temporaire: 0 },
      PC: { actuel: 0, max: 0, temporaire: 0 },
      PK: { actuel: 3, max: 3, temporaire: 0 },
      PM: { actuel: 0, max: 0, temporaire: 0 }
    },
    originesChoix: {},
    originesBonus: {},
    naissanceBonus: { STA: 0, TAI: 0, EGO: 0, APP: 0, CHN: 0, EQU: 0 },
    xpAcquis: 0,
    competences: { groupes: {}, competences: {}, attributsChoisis: {} },
    traits: [],
    memoire: [],
    sorts: [],
    inventaire: [],
    autresRessources: [],
    lesions: [],
    conditions: [],
    resolution: { categorie: 0, useQualiteArmure: false },
    argumentation: { categorie: 0, attribut: 'CHA', useQualiteArme: false },
    entrainements: {
      armesMelee: 0, armesDistance: 0, armures: 0, outils: 0,
      magie: 0, science: 0, social: 0
    },
    tensions: { fatigue: 0, corruption: 0 },
    options: {
      magieActive: false,
      aptitudeActive: false
    },
    bonusConfig: {
      allure: 0, resilience: 0, encombrement: 0,
      protectionPhysique: 0, protectionMentale: 0,
      absorptionPhysique: 0, absorptionMentale: 0,
      recuperation: 0, recuperationPV: 0, recuperationPS: 0,
      recuperationPE: 0, recuperationPM: 0, recuperationPK: 0, recuperationPC: 0,
      memoire: 0, chargeMax: 0, poigne: 0, prouessesInnees: 0, moral: 0,
      perfPhysique: 0, perfMentale: 0, controleActif: 0, controlePassif: 0, techniqueMax: 0,
      expertisePhysique: 0, expertiseMentale: 0, precisionPhysique: 0, precisionMentale: 0,
      maxPV: 0, maxPS: 0, maxPE: 0, maxPM: 0, maxPK: 0, maxPC: 0,
      porteeMagique: 0, tempsIncantation: 0, expertiseMagique: 0, resistanceDrain: 0,
      puissanceInvocatrice: 0, puissanceSoinsDegats: 0, puissancePositive: 0,
      puissanceNegative: 0, puissanceGenerique: 0,
      resiliencePhysique: 0, resilienceMentale: 0, resilienceMagique: 0,
      resilienceNerf: 0, resilienceCorruption: 0, resilienceFatigue: 0,
      attrFOR: 0, attrDEX: 0, attrAGI: 0, attrCON: 0, attrPER: 0,
      attrCHA: 0, attrINT: 0, attrRUS: 0, attrVOL: 0, attrSAG: 0,
      attrMAG: 0, attrLOG: 0, attrCHN: 0,
      attrSTA: 0, attrTAI: 0, attrEGO: 0, attrAPP: 0
    },
    notes: [],
    aptitudes: { styles: [{ id: crypto.randomUUID(), nom: 'Styles', rang: 0, entries: [] }] }
  };

  // Initialise les attributs
  [...DATA.attributsPrincipaux, ...DATA.attributsMagiques].forEach(attr => {
    character.attributs[attr.id] = { base: DATA.valeurDefautPrincipal, bonus: 0 };
  });

  DATA.attributsSecondaires.forEach(attr => {
    character.attributs[attr.id] = { base: DATA.valeurDefautSecondaire, bonus: 0 };
  });

  ['CHN', 'EQU'].forEach(id => {
    character.attributs[id] = { base: DATA.valeurDefautSecondaire, bonus: 0 };
  });

  return character;
};

// Clés localStorage
const STORAGE_CHARACTERS = 'terreNatale_characters';
const STORAGE_LAST_ID = 'terreNatale_lastCharacterId';
const STORAGE_OLD_KEY = 'terreNatale_character';
const STORAGE_DASHBOARD_URL = 'terreNatale_dashboardUrl';

// Helpers localStorage
const loadAllCharacters = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_CHARACTERS)) || {};
  } catch { return {}; }
};

const saveAllCharacters = (chars) => {
  localStorage.setItem(STORAGE_CHARACTERS, JSON.stringify(chars));
};

const saveCharacterToStore = (character) => {
  const chars = loadAllCharacters();
  chars[character.uuid] = {
    ...character,
    _meta: {
      uuid: character.uuid,
      nom: character.infos?.nom || 'Sans nom',
      dateModification: new Date().toISOString()
    }
  };
  saveAllCharacters(chars);
  localStorage.setItem(STORAGE_LAST_ID, character.uuid);
};

// Migration depuis l'ancien format
const migrateOldFormat = () => {
  const old = localStorage.getItem(STORAGE_OLD_KEY);
  if (!old) return null;
  try {
    const character = JSON.parse(old);
    if (!character.uuid) {
      character.uuid = crypto.randomUUID();
    }
    saveCharacterToStore(character);
    localStorage.removeItem(STORAGE_OLD_KEY);
    return character;
  } catch {
    localStorage.removeItem(STORAGE_OLD_KEY);
    return null;
  }
};

// Context
const CharacterContext = createContext(null);

export function CharacterProvider({ children }) {
  const [character, setCharacter] = useState(null);
  const [currentCharacterId, setCurrentCharacterId] = useState(null);
  const [dashboardUrl, setDashboardUrlState] = useState(
    () => localStorage.getItem(STORAGE_DASHBOARD_URL) || ''
  );

  // Initialisation : migration + chargement
  useEffect(() => {
    // Migration ancien format (single-character localStorage key)
    const migrated = migrateOldFormat();
    if (migrated) {
      const migratedFields = migrateCharacterFields(migrated);
      setCharacter(migratedFields);
      setCurrentCharacterId(migratedFields.uuid);
      return;
    }

    // Charger le dernier personnage utilisé
    const lastId = localStorage.getItem(STORAGE_LAST_ID);
    if (lastId) {
      const chars = loadAllCharacters();
      if (chars[lastId]) {
        const { _meta, ...charData } = chars[lastId];
        const migratedData = migrateCharacterFields(charData);
        setCharacter(migratedData);
        setCurrentCharacterId(lastId);
        return;
      }
    }
    // Sinon, aucun personnage chargé → modale s'affichera
  }, []);

  // Sauvegarde automatique
  useEffect(() => {
    if (character && character.uuid) {
      saveCharacterToStore(character);
    }
  }, [character]);

  // Mise à jour partielle
  const updateCharacter = useCallback((updates) => {
    setCharacter(prev => {
      if (!prev) return prev;
      if (typeof updates === 'function') {
        return updates(prev);
      }
      return { ...prev, ...updates };
    });
  }, []);

  // Liste des personnages
  const listCharacters = useCallback(() => {
    const chars = loadAllCharacters();
    return Object.values(chars).map(c => ({
      uuid: c.uuid || c._meta?.uuid,
      nom: c._meta?.nom || c.infos?.nom || 'Sans nom',
      dateModification: c._meta?.dateModification || null
    })).sort((a, b) => {
      if (!a.dateModification) return 1;
      if (!b.dateModification) return -1;
      return b.dateModification.localeCompare(a.dateModification);
    });
  }, []);

  // Charger un personnage
  const loadCharacter = useCallback((uuid) => {
    // Sauvegarder le personnage courant avant de changer
    if (character && character.uuid) {
      saveCharacterToStore(character);
    }
    const chars = loadAllCharacters();
    if (chars[uuid]) {
      const { _meta, ...charData } = chars[uuid];
      const migratedData = migrateCharacterFields(charData);
      setCharacter(migratedData);
      setCurrentCharacterId(uuid);
      localStorage.setItem(STORAGE_LAST_ID, uuid);
    }
  }, [character]);

  // Créer un nouveau personnage
  const createNewCharacter = useCallback(() => {
    // Sauvegarder le personnage courant avant
    if (character && character.uuid) {
      saveCharacterToStore(character);
    }
    const newChar = createEmptyCharacter();
    setCharacter(newChar);
    setCurrentCharacterId(newChar.uuid);
    saveCharacterToStore(newChar);
    return newChar.uuid;
  }, [character]);

  // Supprimer un personnage
  const deleteCharacter = useCallback((uuid) => {
    const chars = loadAllCharacters();
    delete chars[uuid];
    saveAllCharacters(chars);
    // Si c'est le personnage courant, décharger
    if (currentCharacterId === uuid) {
      setCharacter(null);
      setCurrentCharacterId(null);
      localStorage.removeItem(STORAGE_LAST_ID);
    }
  }, [currentCharacterId]);

  // Export JSON
  const exportCharacter = useCallback(() => {
    if (!character) return;
    const blob = new Blob([JSON.stringify(character, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${character.infos?.nom || 'personnage'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [character]);

  // Import JSON
  const importCharacter = useCallback((file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = migrateCharacterFields(JSON.parse(e.target.result));
          // Attribuer un nouvel UUID pour éviter les conflits
          imported.uuid = crypto.randomUUID();
          // Sauvegarder le courant avant
          if (character && character.uuid) {
            saveCharacterToStore(character);
          }
          setCharacter(imported);
          setCurrentCharacterId(imported.uuid);
          saveCharacterToStore(imported);
          resolve(imported.uuid);
        } catch (err) {
          console.error('Erreur import:', err);
          resolve(null);
        }
      };
      reader.readAsText(file);
    });
  }, [character]);

  // Dashboard sync
  const setDashboardUrl = useCallback((url) => {
    const cleaned = url.replace(/\/+$/, '');
    setDashboardUrlState(cleaned);
    if (cleaned) {
      localStorage.setItem(STORAGE_DASHBOARD_URL, cleaned);
    } else {
      localStorage.removeItem(STORAGE_DASHBOARD_URL);
    }
  }, []);

  const syncToDashboard = useCallback(async () => {
    if (!dashboardUrl || !character) return false;
    try {
      // Calculer les max des ressources pour le dashboard
      const getAttr = (id) => getValeurTotale(character, id);
      const bonus = character.bonusConfig || {};
      const caste = DATA.castes.find(c => c.id === character.caste?.id);
      const rang = calculerRangCaste(character);
      const tradition = DATA.traditions.find(t => t.id === character.tradition);
      const attrTradition = tradition?.attribut;

      const enrichedRessources = { ...character.ressources };
      DATA.ressources.forEach(res => {
        let max = 0;
        if (res.type === 'caste') {
          if (character.caste?.attribut1 && character.caste?.attribut2) {
            max = getAttr(character.caste.attribut1) + getAttr(character.caste.attribut2);
          }
        } else if (res.type === 'tradition') {
          if (attrTradition) max = getAttr(attrTradition) * res.multiplicateur;
        } else if (res.attribut) {
          max = getAttr(res.attribut) * res.multiplicateur;
        }
        if (caste?.ressources?.includes(res.id)) max += rang;
        max += bonus[`max${res.id}`] || 0;
        enrichedRessources[res.id] = { ...enrichedRessources[res.id], max };
      });

      const enrichedCharacter = { ...character, ressources: enrichedRessources };
      const res = await fetch(`${dashboardUrl}/api/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enrichedCharacter)
      });
      return res.ok;
    } catch (err) {
      console.error('Sync dashboard échoué:', err);
      return false;
    }
  }, [dashboardUrl, character]);

  const value = {
    character,
    currentCharacterId,
    setCharacter,
    updateCharacter,
    listCharacters,
    loadCharacter,
    createNewCharacter,
    deleteCharacter,
    exportCharacter,
    importCharacter,
    dashboardUrl,
    setDashboardUrl,
    syncToDashboard
  };

  return (
    <CharacterContext.Provider value={value}>
      {children}
    </CharacterContext.Provider>
  );
}

export function useCharacter() {
  const context = useContext(CharacterContext);
  if (!context) {
    throw new Error('useCharacter must be used within a CharacterProvider');
  }
  return context;
}

export default CharacterContext;
