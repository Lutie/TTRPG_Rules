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
      },
      originesChoix: {},
      originesBonus: {},
      naissanceBonus: {
        STA: 0,
        TAI: 0,
        EGO: 0,
        APP: 0,
        CHN: 0,
        EQU: 0
      }
    };

    // Initialise les attributs principaux (Corps + Esprit) à 7
    DATA.attributsPrincipaux.forEach(attr => {
      character.attributs[attr.id] = {
        base: DATA.valeurDefautPrincipal,
        bonus: 0
      };
    });

    // Initialise les attributs secondaires (STA, TAI, EGO, APP) à 10
    DATA.attributsSecondaires.forEach(attr => {
      character.attributs[attr.id] = {
        base: DATA.valeurDefautSecondaire,
        bonus: 0
      };
    });

    // Initialise les attributs spéciaux
    // MAG et LOG à 7 (comme les principaux)
    // EQU est calculé, CHN à 10
    DATA.attributsSpeciaux.forEach(attr => {
      if (attr.id === 'CHN' || attr.id === 'EQU') {
        character.attributs[attr.id] = {
          base: DATA.valeurDefautSecondaire,
          bonus: 0
        };
      } else {
        // MAG et LOG
        character.attributs[attr.id] = {
          base: DATA.valeurDefautPrincipal,
          bonus: 0
        };
      }
    });

    return character;
  },

  // Calcule le coût PA pour passer de X à X+1 (attributs principaux)
  // Formule: X → X+1 coûte (X - 4) PA
  coutPasAttributPrincipal(valeur) {
    return Math.max(0, valeur - 4);
  },

  // Calcule le coût PA cumulé pour un attribut principal (base 7)
  calculerCoutPAPrincipal(valeur) {
    const base = DATA.valeurDefautPrincipal; // 7
    if (valeur <= base) return 0;

    let cout = 0;
    for (let x = base; x < valeur; x++) {
      cout += this.coutPasAttributPrincipal(x);
    }
    return cout;
  },

  // Calcule le coût PA pour un attribut secondaire (STA, TAI, EGO, APP)
  // Retourne négatif si gain de PA, positif si dépense
  calculerCoutPASecondaire(valeur) {
    // Inverse le signe car dans DATA c'est: positif = gain, négatif = dépense
    return -(DATA.coutSecondaire[valeur] || 0);
  },

  // Calcule le coût PA pour la Chance
  calculerCoutPAChance(valeur) {
    return -(DATA.coutChance[valeur] || 0);
  },

  // Récupère les PA de départ selon la destinée
  getPADepart(character) {
    const destineeNom = character.infos?.destinee;
    const destinee = DATA.destinees.find(d => d.nom === destineeNom);
    return destinee ? destinee.pa : DATA.destinees[0].pa; // Par défaut: Commun des Mortels
  },

  // Récupère le max d'attribut selon la destinée
  getMaxAttribut(character) {
    const destineeNom = character.infos?.destinee;
    const destinee = DATA.destinees.find(d => d.nom === destineeNom);
    return destinee ? destinee.maxAttribut : DATA.destinees[0].maxAttribut;
  },

  // Calcule le PA total utilisé
  calculerPAUtilises(character) {
    let total = 0;

    // Attributs principaux (Corps + Esprit) - base 7
    DATA.attributsPrincipaux.forEach(attr => {
      const val = character.attributs[attr.id]?.base || DATA.valeurDefautPrincipal;
      total += this.calculerCoutPAPrincipal(val);
    });

    // MAG et LOG - base 7
    ['MAG', 'LOG'].forEach(id => {
      const val = character.attributs[id]?.base || DATA.valeurDefautPrincipal;
      total += this.calculerCoutPAPrincipal(val);
    });

    // Attributs secondaires (STA, TAI, EGO, APP) - base 10
    DATA.attributsSecondaires.forEach(attr => {
      const val = character.attributs[attr.id]?.base || DATA.valeurDefautSecondaire;
      total += this.calculerCoutPASecondaire(val);
    });

    // Chance - base 10, coût spécial
    const chn = character.attributs['CHN']?.base || DATA.valeurDefautSecondaire;
    total += this.calculerCoutPAChance(chn);

    return total;
  },

  // Calcule le modificateur d'un attribut
  calculerModificateur(valeur) {
    return Math.floor((valeur - 10) / 2);
  },

  // Retourne la valeur par défaut d'un attribut selon son type
  getValeurDefaut(attrId) {
    // Attributs secondaires et CHN/EQU = base 10
    const secondaires = ['STA', 'TAI', 'EGO', 'APP', 'CHN', 'EQU'];
    if (secondaires.includes(attrId)) {
      return DATA.valeurDefautSecondaire;
    }
    // Attributs principaux et MAG/LOG = base 7
    return DATA.valeurDefautPrincipal;
  },

  // Calcule la valeur totale d'un attribut (base + bonus + origines + naissance + caste pour EQU)
  getValeurTotale(character, attrId) {
    const attr = character.attributs[attrId];
    const defaut = this.getValeurDefaut(attrId);
    if (!attr) return defaut;

    const base = attr.base || defaut;
    const bonusEthnie = attr.bonus || 0;
    const bonusOrigines = (character.originesBonus && character.originesBonus[attrId]) || 0;

    // Bonus de naissance pour STA, TAI, EGO, APP, CHN, EQU
    const bonusNaissance = (character.naissanceBonus && character.naissanceBonus[attrId]) || 0;

    // Bonus de caste pour EQU : +1 tous les 2 rangs révolus
    let bonusCaste = 0;
    if (attrId === 'EQU') {
      const rang = character.caste?.rang || 0;
      bonusCaste = Math.floor(rang / 2);
    }

    return base + bonusEthnie + bonusOrigines + bonusNaissance + bonusCaste;
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

  // Réinitialise les bonus d'ethnie (plus de bonus directs, géré par origines)
  appliquerBonusEthnie(character, ethnies) {
    // Reset tous les bonus d'ethnie (ils sont maintenant gérés via les origines)
    Object.keys(character.attributs).forEach(id => {
      character.attributs[id].bonus = 0;
    });

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
    if (!character.originesChoix) character.originesChoix = {};
    if (!character.originesBonus) character.originesBonus = {};
    if (!character.naissanceBonus) {
      character.naissanceBonus = { STA: 0, TAI: 0, EGO: 0, APP: 0, CHN: 0, EQU: 0 };
    }

    // Vérifie tous les attributs avec leurs valeurs par défaut appropriées
    DATA.attributsPrincipaux.forEach(attr => {
      if (!character.attributs[attr.id]) {
        character.attributs[attr.id] = { base: DATA.valeurDefautPrincipal, bonus: 0 };
      }
    });

    DATA.attributsSecondaires.forEach(attr => {
      if (!character.attributs[attr.id]) {
        character.attributs[attr.id] = { base: DATA.valeurDefautSecondaire, bonus: 0 };
      }
    });

    DATA.attributsSpeciaux.forEach(attr => {
      if (!character.attributs[attr.id]) {
        const base = (attr.id === 'CHN' || attr.id === 'EQU')
          ? DATA.valeurDefautSecondaire
          : DATA.valeurDefautPrincipal;
        character.attributs[attr.id] = { base, bonus: 0 };
      }
    });

    return character;
  }
};
