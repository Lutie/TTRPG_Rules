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
        PE: { actuel: 0, max: 0, temporaire: 0 },
        PV: { actuel: 0, max: 0, temporaire: 0 },
        PS: { actuel: 0, max: 0, temporaire: 0 },
        PC: { actuel: 0, max: 0, temporaire: 0 },
        PK: { actuel: 3, max: 3, temporaire: 0 },
        PM: { actuel: 0, max: 0, temporaire: 0 }
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
      },
      xpAcquis: 0,
      competences: {
        groupes: {},
        competences: {},
        attributsChoisis: {}
      },
      traits: [],  // Array de { id: string, rang: number }
      memoire: [],  // Array de { typeId: number, nom: string }
      autresRessources: [],  // Array de { id: string, actuel: number, max: number }
      lesions: [],  // Array de { type: string, actuel: number, max: number }
      conditions: [],  // Array de { id: string, charges: number, avancee: boolean }
      tensions: {  // Fatigue et Corruption, max = résilience
        fatigue: 0,
        corruption: 0
      },
      bonusConfig: {  // Bonus configurables pour les caractéristiques
        allure: 0,
        resilience: 0,
        encombrement: 0,
        protectionPhysique: 0,
        protectionMentale: 0,
        absorptionPhysique: 0,
        absorptionMentale: 0,
        recuperation: 0,
        recuperationPV: 0,
        recuperationPS: 0,
        recuperationPE: 0,
        recuperationPM: 0,
        recuperationPK: 0,
        recuperationPC: 0,
        memoire: 0,
        chargeMax: 0,
        poigne: 0,
        prouessesInnees: 0,
        moral: 0,
        perfPhysique: 0,
        perfMentale: 0,
        controleActif: 0,
        controlePassif: 0,
        techniqueMax: 0,
        expertisePhysique: 0,
        expertiseMentale: 0,
        precisionPhysique: 0,
        precisionMentale: 0,
        maxPV: 0,
        maxPS: 0,
        maxPE: 0,
        maxPM: 0,
        maxPK: 0,
        maxPC: 0,
        // Bonus magie
        porteeMagique: 0,
        tempsIncantation: 0,
        expertiseMagique: 0,
        resistanceDrain: 0,
        puissanceInvocatrice: 0,
        puissanceSoinsDegats: 0,
        puissancePositive: 0,
        puissanceNegative: 0,
        puissanceGenerique: 0,
        // Bonus résiliences spécifiques
        resiliencePhysique: 0,    // PE temporaires
        resilienceMentale: 0,     // PS temporaires
        resilienceMagique: 0,     // PM temporaires
        resilienceNerf: 0,        // Garde, Rage, Adrénaline
        resilienceCorruption: 0,  // Max Corruption
        resilienceFatigue: 0,     // Max Fatigue
        // Bonus aux attributs
        attrFOR: 0, attrDEX: 0, attrAGI: 0, attrCON: 0, attrPER: 0,
        attrCHA: 0, attrINT: 0, attrRUS: 0, attrVOL: 0, attrSAG: 0,
        attrMAG: 0, attrLOG: 0, attrCHN: 0,
        attrSTA: 0, attrTAI: 0, attrEGO: 0, attrAPP: 0
      },
      notes: []  // Array de { titre: string, contenu: string }
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

  // Calcule les PA bonus de la caste (chaque rang ajoute 6 + rang)
  getPACaste(character) {
    const rang = character.caste?.rang || 0;
    let total = 0;
    for (let i = 1; i <= rang; i++) {
      total += 6 + i;
    }
    return total;
  },

  // Calcule les PA totaux (départ + caste)
  getPATotal(character) {
    return this.getPADepart(character) + this.getPACaste(character);
  },

  // Calcule l'aptitude du personnage (pour les prérequis de rang de caste)
  calculerAptitude(character) {
    const competencesData = typeof Competences !== 'undefined' ? Competences.get() : [];
    const charCompetences = character.competences || { groupes: {}, competences: {} };

    // Attributs de caste du personnage
    const attrCaste1 = character.caste?.attribut1;
    const attrCaste2 = character.caste?.attribut2;
    if (!attrCaste1 && !attrCaste2) return 0;

    const attrsCaste = [attrCaste1, attrCaste2].filter(Boolean);
    let aptitude = 0;

    competencesData.forEach(groupe => {
      // Vérifier si le groupe a au moins une compétence liée à un attribut de caste
      let groupeEstLie = false;

      groupe.competences.forEach(comp => {
        // Vérifier si la compétence est liée à un attribut de caste
        const compEstLiee = comp.attributs.some(attr => attrsCaste.includes(attr));

        if (compEstLiee) {
          groupeEstLie = true;
          // Ajouter le rang de la compétence
          const rangComp = charCompetences.competences?.[comp.id] || 0;
          aptitude += rangComp;
        }
      });

      // Si le groupe est lié, ajouter le rang du groupe
      if (groupeEstLie) {
        const rangGroupe = charCompetences.groupes?.[groupe.id] || 0;
        aptitude += rangGroupe;
      }
    });

    return aptitude;
  },

  // Calcule le rang de caste permis par l'XP
  calculerRangCasteParXP(character) {
    const xpTotal = this.getXPTotal(character);
    const progression = typeof CasteProgression !== 'undefined' ? CasteProgression.get() : [];

    let rang = 0;
    for (const level of progression) {
      if (xpTotal >= level.reqXp) {
        rang = level.rang;
      } else {
        break;
      }
    }
    return rang;
  },

  // Calcule le rang de caste permis par l'aptitude
  calculerRangCasteParAptitude(character) {
    const aptitude = this.calculerAptitude(character);
    const progression = typeof CasteProgression !== 'undefined' ? CasteProgression.get() : [];

    let rang = 0;
    for (const level of progression) {
      if (aptitude >= level.reqAptitude) {
        rang = level.rang;
      } else {
        break;
      }
    }
    return rang;
  },

  // Calcule le rang de caste réel (minimum entre XP et aptitude)
  calculerRangCaste(character) {
    const rangXP = this.calculerRangCasteParXP(character);
    const rangAptitude = this.calculerRangCasteParAptitude(character);
    return Math.min(rangXP, rangAptitude);
  },

  // Récupère les infos de progression pour un rang donné
  getProgressionInfo(rang) {
    const progression = typeof CasteProgression !== 'undefined' ? CasteProgression.get() : [];
    return progression.find(p => p.rang === rang) || null;
  },

  // Récupère le prochain palier de rang
  getNextProgressionInfo(rang) {
    const progression = typeof CasteProgression !== 'undefined' ? CasteProgression.get() : [];
    return progression.find(p => p.rang === rang + 1) || null;
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

    // Bonus de caste pour EQU : bonusEquilibre du rang actuel dans CasteProgression
    let bonusCaste = 0;
    if (attrId === 'EQU') {
      const rang = character.caste?.rang || 0;
      const progression = this.getProgressionInfo(rang);
      bonusCaste = progression?.bonusEquilibre || 0;
    }

    // Bonus configurable (équipement, etc.)
    const bonusKey = 'attr' + attrId;
    const bonusConfig = character.bonusConfig?.[bonusKey] || 0;

    return base + bonusEthnie + bonusOrigines + bonusNaissance + bonusCaste + bonusConfig;
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

      // Bonus de configuration pour le max de la ressource
      const bonusKey = 'max' + res.id;
      const bonusMax = character.bonusConfig?.[bonusKey] || 0;
      max += bonusMax;

      ressources[res.id] = {
        actuel: Math.min(character.ressources[res.id]?.actuel || max, max),
        max: max,
        temporaire: character.ressources[res.id]?.temporaire || 0
      };
    });

    return ressources;
  },

  // Calcule une sauvegarde
  // Le bonus de sauvegarde s'ajoute à l'attribut avant de calculer le modificateur
  calculerSauvegarde(character, sauvegarde, caste, estMajeure, estMineure, estAutre) {
    let valeurAttribut;

    // Opposition utilise le max entre MAG et LOG
    if (Array.isArray(sauvegarde.attribut)) {
      const valeurs = sauvegarde.attribut.map(attr => this.getValeurTotale(character, attr));
      valeurAttribut = Math.max(...valeurs);
    } else {
      valeurAttribut = this.getValeurTotale(character, sauvegarde.attribut);
    }

    // Récupérer le bonus de sauvegarde selon le rang de caste
    const rang = character.caste.rang || 0;
    const bonusSauvegarde = this.getBonusSauvegardeParRang(rang, estMajeure, estMineure, estAutre);

    // Le bonus s'ajoute à l'attribut avant de calculer le modificateur
    const valeurModifiee = valeurAttribut + bonusSauvegarde;

    return this.calculerModificateur(valeurModifiee);
  },

  // Récupère le bonus de sauvegarde selon le rang et le type (majeure/mineure/autre)
  getBonusSauvegardeParRang(rang, estMajeure, estMineure, estAutre) {
    const progression = this.getProgressionInfo(rang);
    if (!progression || !progression.sauvegardes) return 0;

    if (estMajeure) {
      return progression.sauvegardes.max || 0;
    } else if (estMineure) {
      return progression.sauvegardes.mid || 0;
    } else if (estAutre) {
      return progression.sauvegardes.min || 0;
    }
    return 0;
  },

  // Calcule l'allure (10 + mTAI + mAGI - Encombrement + bonus)
  calculerAllure(character, encombrementEquipement = 0) {
    const tai = this.getValeurTotale(character, 'TAI');
    const agi = this.getValeurTotale(character, 'AGI');
    const bonus = character.bonusConfig?.allure || 0;
    return 10 + this.calculerModificateur(tai) + this.calculerModificateur(agi) - encombrementEquipement + bonus;
  },

  // Calcule le déplacement (Allure / 2)
  calculerDeplacement(character, encombrementEquipement = 0) {
    return Math.floor(this.calculerAllure(character, encombrementEquipement) / 2);
  },

  // Calcule la résilience (10 + mVOL + mEQU + bonus)
  calculerResilience(character) {
    const vol = this.getValeurTotale(character, 'VOL');
    const equ = this.getValeurTotale(character, 'EQU');
    const bonus = character.bonusConfig?.resilience || 0;
    return 10 + this.calculerModificateur(vol) + this.calculerModificateur(equ) + bonus;
  },

  // Calcule la récupération globale (5 + mSAG + bonus)
  calculerRecuperation(character) {
    const sag = this.getValeurTotale(character, 'SAG');
    const bonus = character.bonusConfig?.recuperation || 0;
    return 5 + this.calculerModificateur(sag) + bonus;
  },

  // Calcule la récupération d'une ressource spécifique
  calculerRecuperationRessource(character, ressourceId) {
    const baseRecup = this.calculerRecuperation(character);
    const bonusKey = 'recuperation' + ressourceId;
    const bonus = character.bonusConfig?.[bonusKey] || 0;
    return baseRecup + bonus;
  },

  // Calcule la mémoire (INT - 5 + bonus)
  calculerMemoire(character) {
    const intel = this.getValeurTotale(character, 'INT');
    const bonus = character.bonusConfig?.memoire || 0;
    return intel - 5 + bonus;
  },

  // Calcule la charge maximale (5 + FOR + STA + bonus)
  calculerChargeMax(character) {
    const forVal = this.getValeurTotale(character, 'FOR');
    const sta = this.getValeurTotale(character, 'STA');
    const bonus = character.bonusConfig?.chargeMax || 0;
    return 5 + forVal + sta + bonus;
  },

  // Calcule l'encombrement maximum (5 + FOR + STA + bonus)
  calculerEncombrementMax(character) {
    const forVal = this.getValeurTotale(character, 'FOR');
    const sta = this.getValeurTotale(character, 'STA');
    const bonus = character.bonusConfig?.encombrement || 0;
    return 5 + forVal + sta + bonus;
  },

  // Calcule la poigne (FOR + bonus)
  calculerPoigne(character) {
    const bonus = character.bonusConfig?.poigne || 0;
    return this.getValeurTotale(character, 'FOR') + bonus;
  },

  // Calcule la protection physique naturelle (5 + mSTA + bonus)
  calculerProtectionPhysique(character) {
    const sta = this.getValeurTotale(character, 'STA');
    const bonus = character.bonusConfig?.protectionPhysique || 0;
    return 5 + this.calculerModificateur(sta) + bonus;
  },

  // Calcule la protection mentale naturelle (5 + mEGO + bonus)
  calculerProtectionMentale(character) {
    const ego = this.getValeurTotale(character, 'EGO');
    const bonus = character.bonusConfig?.protectionMentale || 0;
    return 5 + this.calculerModificateur(ego) + bonus;
  },

  // Calcule l'absorption physique naturelle (mCON + bonus)
  calculerAbsorptionPhysique(character) {
    const con = this.getValeurTotale(character, 'CON');
    const bonus = character.bonusConfig?.absorptionPhysique || 0;
    return this.calculerModificateur(con) + bonus;
  },

  // Calcule l'absorption mentale naturelle (mVOL + bonus)
  calculerAbsorptionMentale(character) {
    const vol = this.getValeurTotale(character, 'VOL');
    const bonus = character.bonusConfig?.absorptionMentale || 0;
    return this.calculerModificateur(vol) + bonus;
  },

  // Calcule les prouesses innées (mRUS + bonus)
  calculerProuessesInnees(character) {
    const rus = this.getValeurTotale(character, 'RUS');
    const bonus = character.bonusConfig?.prouessesInnees || 0;
    return this.calculerModificateur(rus) + bonus;
  },

  // Calcule le moral (mCHA + bonus)
  calculerMoral(character) {
    const cha = this.getValeurTotale(character, 'CHA');
    const bonus = character.bonusConfig?.moral || 0;
    return this.calculerModificateur(cha) + bonus;
  },

  // Calcule la perforation physique (mPER + bonus)
  calculerPerforationPhysique(character) {
    const per = this.getValeurTotale(character, 'PER');
    const bonus = character.bonusConfig?.perfPhysique || 0;
    return this.calculerModificateur(per) + bonus;
  },

  // Calcule la perforation mentale (mSAG + bonus)
  calculerPerforationMentale(character) {
    const sag = this.getValeurTotale(character, 'SAG');
    const bonus = character.bonusConfig?.perfMentale || 0;
    return this.calculerModificateur(sag) + bonus;
  },

  // Calcule le contrôle actif (mDEX + bonus)
  calculerControleActif(character) {
    const dex = this.getValeurTotale(character, 'DEX');
    const bonus = character.bonusConfig?.controleActif || 0;
    return this.calculerModificateur(dex) + bonus;
  },

  // Calcule le contrôle passif (mAGI + bonus)
  calculerControlePassif(character) {
    const agi = this.getValeurTotale(character, 'AGI');
    const bonus = character.bonusConfig?.controlePassif || 0;
    return this.calculerModificateur(agi) + bonus;
  },

  // Calcule la technique max (mINT + bonus)
  calculerTechniqueMax(character) {
    const intel = this.getValeurTotale(character, 'INT');
    const bonus = character.bonusConfig?.techniqueMax || 0;
    return this.calculerModificateur(intel) + bonus;
  },

  // Calcule l'expertise physique (mDEX + bonus)
  calculerExpertisePhysique(character) {
    const dex = this.getValeurTotale(character, 'DEX');
    const bonus = character.bonusConfig?.expertisePhysique || 0;
    return this.calculerModificateur(dex) + bonus;
  },

  // Calcule l'expertise mentale (mINT + bonus)
  calculerExpertiseMentale(character) {
    const intel = this.getValeurTotale(character, 'INT');
    const bonus = character.bonusConfig?.expertiseMentale || 0;
    return this.calculerModificateur(intel) + bonus;
  },

  // Calcule la précision physique (mDEX + bonus)
  calculerPrecisionPhysique(character) {
    const dex = this.getValeurTotale(character, 'DEX');
    const bonus = character.bonusConfig?.precisionPhysique || 0;
    return this.calculerModificateur(dex) + bonus;
  },

  // Calcule la précision mentale (mINT + bonus)
  calculerPrecisionMentale(character) {
    const intel = this.getValeurTotale(character, 'INT');
    const bonus = character.bonusConfig?.precisionMentale || 0;
    return this.calculerModificateur(intel) + bonus;
  },

  // Calcule la portée magique (10 + mPER + bonus)
  calculerPorteeMagique(character) {
    const per = this.getValeurTotale(character, 'PER');
    const bonus = character.bonusConfig?.porteeMagique || 0;
    return 10 + this.calculerModificateur(per) + bonus;
  },

  // Calcule le temps d'incantation (-mDEX + bonus, affiché comme réduction)
  calculerTempsIncantation(character) {
    const dex = this.getValeurTotale(character, 'DEX');
    const bonus = character.bonusConfig?.tempsIncantation || 0;
    return this.calculerModificateur(dex) + bonus;
  },

  // Récupère l'attribut de la tradition magique
  getAttributTradition(character) {
    if (!character.tradition) return null;
    const tradition = DATA.traditions.find(t => t.id === character.tradition);
    return tradition ? tradition.attribut : null;
  },

  // Calcule l'expertise magique (mAttributTradition + bonus)
  calculerExpertiseMagique(character) {
    const attrTradition = this.getAttributTradition(character);
    if (!attrTradition) return 0;
    const valeur = this.getValeurTotale(character, attrTradition);
    const bonus = character.bonusConfig?.expertiseMagique || 0;
    return this.calculerModificateur(valeur) + bonus;
  },

  // Calcule la résistance au drain (mAttributTradition + bonus)
  calculerResistanceDrain(character) {
    const attrTradition = this.getAttributTradition(character);
    if (!attrTradition) return 0;
    const valeur = this.getValeurTotale(character, attrTradition);
    const bonus = character.bonusConfig?.resistanceDrain || 0;
    return this.calculerModificateur(valeur) + bonus;
  },

  // Calcule la puissance invocatrice (mCHA + bonus)
  calculerPuissanceInvocatrice(character) {
    const cha = this.getValeurTotale(character, 'CHA');
    const bonus = character.bonusConfig?.puissanceInvocatrice || 0;
    return this.calculerModificateur(cha) + bonus;
  },

  // Calcule la puissance soins/dégâts (mVOL + bonus)
  calculerPuissanceSoinsDegats(character) {
    const vol = this.getValeurTotale(character, 'VOL');
    const bonus = character.bonusConfig?.puissanceSoinsDegats || 0;
    return this.calculerModificateur(vol) + bonus;
  },

  // Calcule la puissance positive (mSAG + bonus)
  calculerPuissancePositive(character) {
    const sag = this.getValeurTotale(character, 'SAG');
    const bonus = character.bonusConfig?.puissancePositive || 0;
    return this.calculerModificateur(sag) + bonus;
  },

  // Calcule la puissance négative (mRUS + bonus)
  calculerPuissanceNegative(character) {
    const rus = this.getValeurTotale(character, 'RUS');
    const bonus = character.bonusConfig?.puissanceNegative || 0;
    return this.calculerModificateur(rus) + bonus;
  },

  // Calcule la puissance générique (mINT + bonus)
  calculerPuissanceGenerique(character) {
    const intel = this.getValeurTotale(character, 'INT');
    const bonus = character.bonusConfig?.puissanceGenerique || 0;
    return this.calculerModificateur(intel) + bonus;
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

  // === GESTION XP ET COMPETENCES ===

  // Récupère les XP de départ selon le vécu
  getXPDepart(character) {
    const vecuNom = character.infos?.vecu;
    const vecu = DATA.vecus.find(v => v.nom === vecuNom);
    return vecu ? vecu.xp : DATA.vecus[0].xp; // Par défaut: Aucun
  },

  // Récupère le max rang de groupe selon le vécu
  getMaxRangGroupe(character) {
    const vecuNom = character.infos?.vecu;
    const vecu = DATA.vecus.find(v => v.nom === vecuNom);
    return vecu ? vecu.maxGroupe : DATA.vecus[0].maxGroupe;
  },

  // Récupère le max rang de compétence selon le vécu
  getMaxRangCompetence(character) {
    const vecuNom = character.infos?.vecu;
    const vecu = DATA.vecus.find(v => v.nom === vecuNom);
    return vecu ? vecu.maxCompetence : DATA.vecus[0].maxCompetence;
  },

  // Calcule le coût cumulé pour atteindre un rang de groupe
  // Coût: 20 PX par rang (cumul: rang 1 = 20, rang 2 = 60, rang 3 = 120)
  calculerCoutGroupeTotal(rang) {
    let total = 0;
    for (let i = 1; i <= rang; i++) {
      total += 20 * i;
    }
    return total;
  },

  // Calcule le coût cumulé pour atteindre un rang de compétence
  // Coût: 10 PX par rang (cumul: rang 1 = 10, rang 2 = 30, rang 3 = 60, etc.)
  calculerCoutCompetenceTotal(rang) {
    let total = 0;
    for (let i = 1; i <= rang; i++) {
      total += 10 * i;
    }
    return total;
  },

  // Calcule les XP utilisés pour les compétences
  calculerXPUtilises(character) {
    let total = 0;
    const competencesData = character.competences || { groupes: {}, competences: {} };

    // Coût des rangs de groupes
    Object.values(competencesData.groupes || {}).forEach(rang => {
      total += this.calculerCoutGroupeTotal(rang);
    });

    // Coût des rangs de compétences
    Object.values(competencesData.competences || {}).forEach(rang => {
      total += this.calculerCoutCompetenceTotal(rang);
    });

    return total;
  },

  // Calcule les XP totaux (départ + acquis)
  getXPTotal(character) {
    return this.getXPDepart(character) + (character.xpAcquis || 0);
  },

  // Calcule les XP restants
  calculerXPRestants(character) {
    return this.getXPTotal(character) - this.calculerXPUtilises(character);
  },

  // Calcule le bonus d'une compétence (mATT + rang groupe + rang compétence)
  calculerBonusCompetence(character, groupeId, competenceId, attributId) {
    const competencesData = character.competences || { groupes: {}, competences: {} };
    const rangGroupe = competencesData.groupes?.[groupeId] || 0;
    const rangCompetence = competencesData.competences?.[competenceId] || 0;

    // Modificateur de l'attribut
    const valeurAttr = this.getValeurTotale(character, attributId);
    const modAttr = this.calculerModificateur(valeurAttr);

    return modAttr + rangGroupe + rangCompetence;
  },

  // Calcule la prouesse possible d'un groupe (mRUS + rang groupe)
  calculerProuesse(character, groupeId) {
    const competencesData = character.competences || { groupes: {} };
    const rangGroupe = competencesData.groupes?.[groupeId] || 0;
    const prouessesInnees = this.calculerProuessesInnees(character);
    return prouessesInnees + rangGroupe;
  },

  // === GESTION PP (POINTS DE PERSONNAGE) ===

  // Récupère les PP de départ selon la destinée
  getPPDepart(character) {
    const destineeNom = character.infos?.destinee;
    const destinee = DATA.destinees.find(d => d.nom === destineeNom);
    return destinee ? destinee.pp : DATA.destinees[0].pp;
  },

  // Calcule les PP acquis via désavantages (somme des rangs de désavantages)
  getPPDesavantages(character) {
    const traitsData = typeof Traits !== 'undefined' ? Traits.get() : [];
    const characterTraits = character.traits || [];

    let total = 0;
    characterTraits.forEach(ct => {
      const traitInfo = traitsData.find(t => t.id === ct.id);
      if (traitInfo && traitInfo.type === 'desavantage') {
        total += ct.rang * traitInfo.coutPP;
      }
    });
    return total;
  },

  // Calcule les PP acquis via le rang de caste (paliers 5, 7, 9, 11, 13, 15, 17, 19)
  getPPCaste(character) {
    const rang = character.caste?.rang || 0;
    const paliers = [5, 7, 9, 11, 13, 15, 17, 19];
    let total = 0;
    paliers.forEach(p => {
      if (rang >= p) total += 1;
    });
    return total;
  },

  // Calcule les PP acquis total (désavantages + caste)
  getPPAcquis(character) {
    return this.getPPDesavantages(character) + this.getPPCaste(character);
  },

  // Calcule les PP totaux (départ + acquis)
  getPPTotal(character) {
    return this.getPPDepart(character) + this.getPPAcquis(character);
  },

  // Calcule les PP utilisés (coût des avantages)
  calculerPPUtilises(character) {
    const traitsData = typeof Traits !== 'undefined' ? Traits.get() : [];
    const characterTraits = character.traits || [];

    let total = 0;
    characterTraits.forEach(ct => {
      const traitInfo = traitsData.find(t => t.id === ct.id);
      if (traitInfo && traitInfo.type === 'avantage') {
        total += ct.rang * traitInfo.coutPP;
      }
    });
    return total;
  },

  // Calcule les PP restants
  calculerPPRestants(character) {
    return this.getPPTotal(character) - this.calculerPPUtilises(character);
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
    if (character.xpAcquis === undefined) character.xpAcquis = 0;
    if (!character.competences) {
      character.competences = { groupes: {}, competences: {}, attributsChoisis: {} };
    }
    if (!character.competences.groupes) character.competences.groupes = {};
    if (!character.competences.competences) character.competences.competences = {};
    if (!character.competences.attributsChoisis) character.competences.attributsChoisis = {};
    if (!character.traits) character.traits = [];
    if (!character.memoire) character.memoire = [];

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
