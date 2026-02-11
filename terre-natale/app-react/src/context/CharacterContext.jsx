import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import DATA from '../data';

// État initial du personnage
const createEmptyCharacter = () => {
  const character = {
    infos: {
      nom: '',
      origine: '',
      ethnie: '',
      comportement: '',
      caractere: '',
      destinee: '',
      vecu: '',
      nombreFetiche: ''
    },
    attributs: {},
    caste: {
      nom: '',
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
    notes: []
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

// Clé localStorage
const STORAGE_KEY = 'terreNatale_character';

// Context
const CharacterContext = createContext(null);

export function CharacterProvider({ children }) {
  const [character, setCharacter] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Erreur chargement personnage:', e);
      }
    }
    return createEmptyCharacter();
  });

  // Sauvegarde automatique
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(character));
  }, [character]);

  // Mise à jour partielle
  const updateCharacter = useCallback((updates) => {
    setCharacter(prev => {
      if (typeof updates === 'function') {
        return updates(prev);
      }
      return { ...prev, ...updates };
    });
  }, []);

  // Nouveau personnage
  const resetCharacter = useCallback(() => {
    setCharacter(createEmptyCharacter());
  }, []);

  // Export JSON
  const exportCharacter = useCallback(() => {
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
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        setCharacter(imported);
      } catch (err) {
        console.error('Erreur import:', err);
      }
    };
    reader.readAsText(file);
  }, []);

  const value = {
    character,
    setCharacter,
    updateCharacter,
    resetCharacter,
    exportCharacter,
    importCharacter
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
