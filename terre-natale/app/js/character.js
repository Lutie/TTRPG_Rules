// character.js - Logique du personnage et calculs

const Character = {
  // Crée un nouveau personnage vide
  create() {
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
        PE: { actuel: 0, max: 0 },
        PV: { actuel: 0, max: 0 },
        PS: { actuel: 0, max: 0 },
        PC: { actuel: 0, max: 0 },
        PK: { actuel: 3, max: 3 },
        PM: { actuel: 0, max: 0 }
      }
    };

    // Initialise les attributs principaux à 10
    DATA.attributsPrincipaux.forEach(attr => {
      character.attributs[attr.id] = {
        base: DATA.valeurDefaut,
        bonus: 0
      };
    });

    // Initialise les attributs secondaires à 10
    DATA.attributsSecondaires.forEach(attr => {
      character.attributs[attr.id] = {
        base: DATA.valeurDefaut,
        bonus: 0
      };
    });

    // Initialise les attributs spéciaux à 10
    DATA.attributsSpeciaux.forEach(attr => {
      character.attributs[attr.id] = {
        base: DATA.valeurDefaut,
        bonus: 0
      };
    });

    return character;
  },

  // Calcule le coût en PA pour une valeur d'attribut
  calculerCoutPA(valeur) {
    if (valeur <= 8) return 0;
    const n = valeur - 8;
    return Math.floor(0.5 * n * (n + 5));
  },

  // Calcule le PA total utilisé
  calculerPAUtilises(character) {
    let total = 0;
    DATA.attributsPrincipaux.forEach(attr => {
      const val = character.attributs[attr.id]?.base || DATA.valeurDefaut;
      total += this.calculerCoutPA(val);
    });
    return total;
  },

  // Calcule le modificateur d'un attribut
  calculerModificateur(valeur) {
    return Math.floor((valeur - 10) / 2);
  },

  // Calcule la valeur totale d'un attribut (base + bonus)
  getValeurTotale(character, attrId) {
    const attr = character.attributs[attrId];
    if (!attr) return DATA.valeurDefaut;
    return (attr.base || DATA.valeurDefaut) + (attr.bonus || 0);
  },

  // Calcule la défense normale
  calculerDefenseNormale(valeur) {
    const mod = this.calculerModificateur(valeur);
    const impair = valeur % 2 !== 0 ? 1 : 0;
    return 10 + mod + 5 + impair;
  },

  // Calcule la défense choquée
  calculerDefenseChoquee(valeur) {
    const mod = this.calculerModificateur(valeur);
    const impair = valeur % 2 !== 0 ? 1 : 0;
    return 10 + mod + impair;
  },

  // Calcule l'équilibre de base (moyenne entre attribut principal le plus haut et le plus bas)
  calculerEquilibreBase(character) {
    const valeurs = DATA.attributsPrincipaux.map(attr => this.getValeurTotale(character, attr.id));
    const min = Math.min(...valeurs);
    const max = Math.max(...valeurs);
    return Math.floor((min + max) / 2);
  },

  // Récupère le bonus de maîtrise selon le rang
  getBonusMaitrise(rang) {
    const rangData = DATA.rangs.find(r => r.niveau === rang);
    return rangData ? rangData.bonusMaitrise : 2;
  },

  // Calcule les ressources max
  calculerRessources(character, castes) {
    const ressources = {};
    const caste = castes.find(c => c.nom === character.caste.nom);
    const rang = character.caste.rang || 0;

    DATA.ressources.forEach(res => {
      let max = 0;

      if (res.type === 'caste') {
        // PC (Chi) = Attribut Caste 1 + Attribut Caste 2
        if (character.caste.attribut1 && character.caste.attribut2) {
          const attr1 = this.getValeurTotale(character, character.caste.attribut1);
          const attr2 = this.getValeurTotale(character, character.caste.attribut2);
          max = attr1 + attr2;
        }
      } else if (res.type === 'tradition') {
        // PM (Mana) = 2 x Attribut de Tradition
        if (character.tradition) {
          const tradition = DATA.traditions.find(t => t.id === character.tradition);
          if (tradition) {
            const valeur = this.getValeurTotale(character, tradition.attribut);
            max = valeur * res.multiplicateur;
          }
        }
      } else if (res.attribut) {
        const valeur = this.getValeurTotale(character, res.attribut);
        max = valeur * res.multiplicateur;
      }

      // Bonus de rang pour les ressources de caste
      if (caste && caste.ressources && caste.ressources.includes(res.id)) {
        max += rang;
      }

      ressources[res.id] = {
        actuel: Math.min(character.ressources[res.id]?.actuel || max, max),
        max: max
      };
    });

    return ressources;
  },

  // Calcule une sauvegarde
  calculerSauvegarde(character, sauvegarde, caste, estMajeure, estMineure, estAutre) {
    let valeur;

    // Opposition utilise le max entre MAG et LOG
    if (Array.isArray(sauvegarde.attribut)) {
      const valeurs = sauvegarde.attribut.map(attr => this.getValeurTotale(character, attr));
      valeur = Math.max(...valeurs);
    } else {
      valeur = this.getValeurTotale(character, sauvegarde.attribut);
    }

    let bonus = this.calculerModificateur(valeur);

    // Bonus selon le type de sauvegarde et le rang (voir tableau Notes.md)
    const rang = character.caste.rang || 0;
    const bonusMajeur = this.getBonusSauvegardeMajeure(rang);
    const bonusMineur = this.getBonusSauvegardeMineure(rang);
    const bonusAutre = this.getBonusSauvegardeAutre(rang);

    if (estMajeure) {
      bonus += bonusMajeur;
    } else if (estMineure) {
      bonus += bonusMineur;
    } else if (estAutre) {
      bonus += bonusAutre;
    }

    return bonus;
  },

  // Bonus de sauvegarde majeure selon le rang
  getBonusSauvegardeMajeure(rang) {
    const table = [0, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7];
    return table[rang] || 0;
  },

  // Bonus de sauvegarde mineure selon le rang
  getBonusSauvegardeMineure(rang) {
    const table = [0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4];
    return table[rang] || 0;
  },

  // Bonus de sauvegarde autre selon le rang
  getBonusSauvegardeAutre(rang) {
    const table = [0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2];
    return table[rang] || 0;
  },

  // Calcule l'allure (10 + mTAI + mAGI - Encombrement)
  calculerAllure(character, encombrementEquipement = 0) {
    const tai = this.getValeurTotale(character, 'TAI');
    const agi = this.getValeurTotale(character, 'AGI');
    return 10 + this.calculerModificateur(tai) + this.calculerModificateur(agi) - encombrementEquipement;
  },

  // Calcule le déplacement (Allure / 2)
  calculerDeplacement(character, encombrementEquipement = 0) {
    return Math.floor(this.calculerAllure(character, encombrementEquipement) / 2);
  },

  // Calcule la résilience (10 + mVOL + mEQU)
  calculerResilience(character) {
    const vol = this.getValeurTotale(character, 'VOL');
    const equ = this.getValeurTotale(character, 'EQU');
    return 10 + this.calculerModificateur(vol) + this.calculerModificateur(equ);
  },

  // Calcule la récupération (5 + aSAG)
  calculerRecuperation(character) {
    const sag = this.getValeurTotale(character, 'SAG');
    // aSAG = modificateur avec ajustement d'équilibre (simplifié ici)
    return 5 + this.calculerModificateur(sag);
  },

  // Calcule la mémoire (INT - 5)
  calculerMemoire(character) {
    const intel = this.getValeurTotale(character, 'INT');
    return intel - 5;
  },

  // Calcule la charge maximale (5 + FOR + STA)
  calculerChargeMax(character) {
    const forVal = this.getValeurTotale(character, 'FOR');
    const sta = this.getValeurTotale(character, 'STA');
    return 5 + forVal + sta;
  },

  // Calcule l'encombrement maximum (5 + FOR + STA)
  calculerEncombrementMax(character) {
    const forVal = this.getValeurTotale(character, 'FOR');
    const sta = this.getValeurTotale(character, 'STA');
    return 5 + forVal + sta;
  },

  // Calcule la poigne (FOR)
  calculerPoigne(character) {
    return this.getValeurTotale(character, 'FOR');
  },

  // Calcule la protection physique naturelle (5 + mSTA)
  calculerProtectionPhysique(character) {
    const sta = this.getValeurTotale(character, 'STA');
    return 5 + this.calculerModificateur(sta);
  },

  // Calcule la protection mentale naturelle (5 + mEGO)
  calculerProtectionMentale(character) {
    const ego = this.getValeurTotale(character, 'EGO');
    return 5 + this.calculerModificateur(ego);
  },

  // Calcule l'absorption physique naturelle (mCON)
  calculerAbsorptionPhysique(character) {
    const con = this.getValeurTotale(character, 'CON');
    return this.calculerModificateur(con);
  },

  // Calcule l'absorption mentale naturelle (mVOL)
  calculerAbsorptionMentale(character) {
    const vol = this.getValeurTotale(character, 'VOL');
    return this.calculerModificateur(vol);
  },

  // Calcule les prouesses innées (mRUS)
  calculerProuessesInnees(character) {
    const rus = this.getValeurTotale(character, 'RUS');
    return this.calculerModificateur(rus);
  },

  // Calcule le moral (mCHA)
  calculerMoral(character) {
    const cha = this.getValeurTotale(character, 'CHA');
    return this.calculerModificateur(cha);
  },

  // Calcule la perforation physique (mPER)
  calculerPerforationPhysique(character) {
    const per = this.getValeurTotale(character, 'PER');
    return this.calculerModificateur(per);
  },

  // Calcule la perforation mentale (mSAG)
  calculerPerforationMentale(character) {
    const sag = this.getValeurTotale(character, 'SAG');
    return this.calculerModificateur(sag);
  },

  // Calcule le contrôle actif (mDEX)
  calculerControleActif(character) {
    const dex = this.getValeurTotale(character, 'DEX');
    return this.calculerModificateur(dex);
  },

  // Calcule le contrôle passif (mAGI)
  calculerControlePassif(character) {
    const agi = this.getValeurTotale(character, 'AGI');
    return this.calculerModificateur(agi);
  },

  // Calcule la technique max (mINT)
  calculerTechniqueMax(character) {
    const intel = this.getValeurTotale(character, 'INT');
    return this.calculerModificateur(intel);
  },

  // Calcule la charge mentale maximale (5 + CHA + EGO)
  calculerChargeMentaleMax(character) {
    const cha = this.getValeurTotale(character, 'CHA');
    const ego = this.getValeurTotale(character, 'EGO');
    return 5 + cha + ego;
  },

  // Calcule la poigne mentale (CHA)
  calculerPoigneMentale(character) {
    return this.getValeurTotale(character, 'CHA');
  },

  // Applique les bonus d'ethnie
  appliquerBonusEthnie(character, ethnies) {
    // Reset tous les bonus
    Object.keys(character.attributs).forEach(id => {
      character.attributs[id].bonus = 0;
    });

    // Applique les bonus de l'ethnie sélectionnée
    const ethnie = ethnies.find(e => e.nom === character.infos.ethnie);
    if (ethnie && ethnie.bonus) {
      Object.entries(ethnie.bonus).forEach(([attr, bonus]) => {
        if (character.attributs[attr]) {
          character.attributs[attr].bonus = bonus;
        }
      });
    }

    return character;
  },

  // Valide et corrige un personnage importé
  valider(character) {
    // S'assure que toutes les propriétés existent
    if (!character.infos) character.infos = {};
    if (!character.attributs) character.attributs = {};
    if (!character.caste) character.caste = { nom: '', rang: 0, attribut1: '', attribut2: '' };
    if (!character.ressources) character.ressources = {};
    if (!character.tradition) character.tradition = '';

    // Vérifie tous les attributs (principaux, secondaires, spéciaux)
    [...DATA.attributsPrincipaux, ...DATA.attributsSecondaires, ...DATA.attributsSpeciaux].forEach(attr => {
      if (!character.attributs[attr.id]) {
        character.attributs[attr.id] = { base: DATA.valeurDefaut, bonus: 0 };
      }
    });

    return character;
  }
};
