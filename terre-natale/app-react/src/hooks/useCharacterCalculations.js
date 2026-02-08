import { useMemo } from 'react';
import DATA from '../data';

// Calcule le modificateur d'un attribut
export const calculerModificateur = (valeur) => Math.floor((valeur - 10) / 2);

// Retourne la valeur par défaut d'un attribut selon son type
export const getValeurDefaut = (attrId) => {
  const secondaires = ['STA', 'TAI', 'EGO', 'APP', 'CHN', 'EQU'];
  return secondaires.includes(attrId) ? DATA.valeurDefautSecondaire : DATA.valeurDefautPrincipal;
};

// Calcule la valeur totale d'un attribut
export const getValeurTotale = (character, attrId, progressionInfo = null) => {
  const attr = character.attributs[attrId];
  const defaut = getValeurDefaut(attrId);
  if (!attr) return defaut;

  const base = attr.base || defaut;
  const bonusEthnie = attr.bonus || 0;
  const bonusOrigines = (character.originesBonus && character.originesBonus[attrId]) || 0;
  const bonusNaissance = (character.naissanceBonus && character.naissanceBonus[attrId]) || 0;

  let bonusCaste = 0;
  if (attrId === 'EQU' && progressionInfo) {
    bonusCaste = progressionInfo.bonusEquilibre || 0;
  }

  const bonusKey = 'attr' + attrId;
  const bonusConfig = character.bonusConfig?.[bonusKey] || 0;

  return base + bonusEthnie + bonusOrigines + bonusNaissance + bonusCaste + bonusConfig;
};

// Calcule l'XP de départ selon le vécu
export const getXPDepart = (character) => {
  const vecuNom = character.infos?.vecu;
  const vecu = DATA.vecus.find(v => v.nom === vecuNom);
  return vecu?.xp || 200;
};

// Calcule l'XP total
export const getXPTotal = (character) => {
  return getXPDepart(character) + (character.xpAcquis || 0);
};

// Calcule l'aptitude (somme des rangs de compétences liées aux attributs de caste)
export const calculerAptitude = (character) => {
  const charCompetences = character.competences || { groupes: {}, competences: {} };
  const attrCaste1 = character.caste?.attribut1;
  const attrCaste2 = character.caste?.attribut2;
  if (!attrCaste1 && !attrCaste2) return 0;

  const attrsCaste = [attrCaste1, attrCaste2].filter(Boolean);
  let aptitude = 0;

  DATA.competences.forEach(groupe => {
    let groupeEstLie = false;
    groupe.competences?.forEach(comp => {
      if (comp.attributs?.some(a => attrsCaste.includes(a))) {
        groupeEstLie = true;
      }
    });

    if (groupeEstLie) {
      const rangGroupe = charCompetences.groupes?.[groupe.id] || 0;
      aptitude += rangGroupe;

      groupe.competences?.forEach(comp => {
        if (comp.attributs?.some(a => attrsCaste.includes(a))) {
          const rangComp = charCompetences.competences?.[comp.id] || 0;
          aptitude += rangComp;
        }
      });
    }
  });

  return aptitude;
};

// Calcule le rang permis par l'XP
export const calculerRangCasteParXP = (character) => {
  const xpTotal = getXPTotal(character);
  let rang = 0;
  for (const level of DATA.casteProgression) {
    if (xpTotal >= level.reqXp) {
      rang = level.rang;
    } else {
      break;
    }
  }
  return rang;
};

// Calcule le rang permis par l'aptitude
export const calculerRangCasteParAptitude = (character) => {
  const aptitude = calculerAptitude(character);
  let rang = 0;
  for (const level of DATA.casteProgression) {
    if (aptitude >= level.reqAptitude) {
      rang = level.rang;
    } else {
      break;
    }
  }
  return rang;
};

// Calcule le rang de caste réel (minimum entre XP et aptitude)
export const calculerRangCaste = (character) => {
  const rangXP = calculerRangCasteParXP(character);
  const rangAptitude = calculerRangCasteParAptitude(character);
  return Math.min(rangXP, rangAptitude);
};

// Récupère les infos de progression pour un rang donné
export const getProgressionInfo = (rang) => {
  return DATA.casteProgression.find(p => p.rang === rang) || null;
};

// Récupère le prochain palier de rang
export const getNextProgressionInfo = (rang) => {
  return DATA.casteProgression.find(p => p.rang === rang + 1) || null;
};

// Hook principal pour les calculs
export function useCharacterCalculations(character, castes = DATA.castes) {
  return useMemo(() => {
    const getAttr = (id) => getValeurTotale(character, id);
    const getMod = (id) => calculerModificateur(getAttr(id));
    const bonus = character.bonusConfig || {};

    // Allure et déplacement
    const allure = 10 + getMod('TAI') + getMod('AGI') + (bonus.allure || 0);
    const deplacement = Math.floor(allure / 2);
    const sautHauteur = Math.floor(allure / 8);
    const sautLargeur = Math.floor(allure / 4);

    // Résilience et récupération
    const resilience = 10 + getMod('VOL') + getMod('EQU') + (bonus.resilience || 0);
    const recuperation = 5 + getMod('SAG') + (bonus.recuperation || 0);

    // Résiliences spécifiques
    const resilPhys = resilience + (bonus.resiliencePhysique || 0);
    const resilMent = resilience + (bonus.resilienceMentale || 0);
    const resilMag = resilience + (bonus.resilienceMagique || 0);
    const resilNerf = resilience + (bonus.resilienceNerf || 0);
    const resilFat = resilience + (bonus.resilienceFatigue || 0);
    const resilCorr = resilience + (bonus.resilienceCorruption || 0);

    // Caractéristiques
    const memoire = getAttr('INT') - 5 + (bonus.memoire || 0);
    const chargeMax = 5 + getAttr('FOR') + getAttr('STA') + (bonus.chargeMax || 0);
    const encombrementMax = 5 + getAttr('FOR') + getAttr('STA') + (bonus.encombrement || 0);
    const poigne = getAttr('FOR') + (bonus.poigne || 0);

    // Protections et absorptions
    const protPhys = 5 + getMod('STA') + (bonus.protectionPhysique || 0);
    const protMent = 5 + getMod('EGO') + (bonus.protectionMentale || 0);
    const absPhys = getMod('CON') + (bonus.absorptionPhysique || 0);
    const absMent = getMod('VOL') + (bonus.absorptionMentale || 0);

    // Combat
    const prouesses = getMod('RUS') + (bonus.prouessesInnees || 0);
    const moral = getMod('CHA') + (bonus.moral || 0);
    const perfPhys = getMod('PER') + (bonus.perfPhysique || 0);
    const perfMent = getMod('SAG') + (bonus.perfMentale || 0);
    const ctrlActif = getMod('DEX') + (bonus.controleActif || 0);
    const ctrlPassif = getMod('AGI') + (bonus.controlePassif || 0);
    const techMax = getMod('INT') + (bonus.techniqueMax || 0);
    const expPhys = getMod('DEX') + (bonus.expertisePhysique || 0);
    const expMent = getMod('INT') + (bonus.expertiseMentale || 0);
    const precPhys = getMod('DEX') + (bonus.precisionPhysique || 0);
    const precMent = getMod('INT') + (bonus.precisionMentale || 0);

    // Magie
    const tradition = DATA.traditions.find(t => t.id === character.tradition);
    const attrTradition = tradition?.attribut;
    const modTradition = attrTradition ? getMod(attrTradition) : 0;

    const porteeMagique = 10 + getMod('PER') + (bonus.porteeMagique || 0);
    const tempsIncantation = getMod('DEX') + (bonus.tempsIncantation || 0);
    const expertiseMagique = modTradition + (bonus.expertiseMagique || 0);
    const resistanceDrain = modTradition + (bonus.resistanceDrain || 0);
    const puissanceInvocatrice = getMod('CHA') + (bonus.puissanceInvocatrice || 0);
    const puissanceSoinsDegats = getMod('VOL') + (bonus.puissanceSoinsDegats || 0);
    const puissancePositive = getMod('SAG') + (bonus.puissancePositive || 0);
    const puissanceNegative = getMod('RUS') + (bonus.puissanceNegative || 0);
    const puissanceGenerique = getMod('INT') + (bonus.puissanceGenerique || 0);

    // Caste et progression
    const caste = castes.find(c => c.nom === character.caste?.nom);
    const xpTotal = getXPTotal(character);
    const aptitude = calculerAptitude(character);
    const rangXP = calculerRangCasteParXP(character);
    const rangAptitude = calculerRangCasteParAptitude(character);
    const rangCaste = Math.min(rangXP, rangAptitude);
    const rang = rangCaste;
    const progressionInfo = getProgressionInfo(rangCaste);
    const nextProgression = getNextProgressionInfo(rangCaste);

    // Ressources max

    const ressourcesMax = {};
    DATA.ressources.forEach(res => {
      let max = 0;

      if (res.type === 'caste') {
        if (character.caste?.attribut1 && character.caste?.attribut2) {
          max = getAttr(character.caste.attribut1) + getAttr(character.caste.attribut2);
        }
      } else if (res.type === 'tradition') {
        if (attrTradition) {
          max = getAttr(attrTradition) * res.multiplicateur;
        }
      } else if (res.attribut) {
        max = getAttr(res.attribut) * res.multiplicateur;
      }

      if (caste?.ressources?.includes(res.id)) {
        max += rang;
      }

      max += bonus[`max${res.id}`] || 0;
      ressourcesMax[res.id] = max;
    });

    // Récupération par ressource
    const recuperationRessource = {};
    DATA.ressources.forEach(res => {
      // Récupération de base
      let recup = recuperation;
      // Bonus spécifique à la ressource
      recup += bonus[`recuperation${res.id}`] || 0;
      // Bonus de caste : +1 par rang impair si ressource de caste
      if (caste?.ressources?.includes(res.id)) {
        recup += Math.ceil(rang / 2);
      }
      recuperationRessource[res.id] = recup;
    });

    // XP calculations
    const xpDepart = getXPDepart(character);
    const xpAcquis = character.xpAcquis || 0;
    // XP utilisés = coût des groupes + coût des compétences
    const competencesData = character.competences || { groupes: {}, competences: {} };
    let xpUtilises = 0;
    // Coût des groupes: 1->10, 2->25, 3->45
    const coutGroupe = [0, 10, 25, 45];
    Object.values(competencesData.groupes || {}).forEach(r => {
      for (let i = 1; i <= r; i++) xpUtilises += coutGroupe[i] || 0;
    });
    // Coût des compétences: 1->5, 2->10, 3->15, 4->25, 5->35, 6->50
    const coutComp = [0, 5, 10, 15, 25, 35, 50];
    Object.values(competencesData.competences || {}).forEach(r => {
      for (let i = 1; i <= r; i++) xpUtilises += coutComp[i] || 0;
    });
    const xpRestants = xpTotal - xpUtilises;

    // PP calculations
    const destineeNom = character.infos?.destinee;
    const destinee = DATA.destinees.find(d => d.nom === destineeNom);
    const ppDepart = destinee?.pp || DATA.destinees[0].pp;
    // PP from désavantages
    const characterTraits = character.traits || [];
    let ppDesavantages = 0;
    characterTraits.forEach(ct => {
      const traitInfo = DATA.traits.find(t => t.id === ct.id);
      if (traitInfo && traitInfo.type === 'desavantage') {
        ppDesavantages += ct.rang * (traitInfo.coutPP || 1);
      }
    });
    // PP from caste (1 PP at ranks 5, 7, 9, 11, 13, 15, 17, 19)
    const paliersPP = [5, 7, 9, 11, 13, 15, 17, 19];
    let ppCaste = 0;
    paliersPP.forEach(p => { if (rangCaste >= p) ppCaste += 1; });
    const ppTotal = ppDepart + ppDesavantages + ppCaste;
    // PP utilisés = coût des avantages
    let ppUtilises = 0;
    characterTraits.forEach(ct => {
      const traitInfo = DATA.traits.find(t => t.id === ct.id);
      if (traitInfo && traitInfo.type === 'avantage') {
        ppUtilises += ct.rang * (traitInfo.coutPP || 1);
      }
    });
    const ppRestants = ppTotal - ppUtilises;

    return {
      // Attributs
      getAttr,
      getMod,

      // Déplacement
      allure,
      deplacement,
      sautHauteur,
      sautLargeur,

      // Résistances
      resilience,
      resilPhys,
      resilMent,
      resilMag,
      resilNerf,
      resilFat,
      resilCorr,
      recuperation,

      // Caractéristiques
      memoire,
      chargeMax,
      encombrementMax,
      poigne,
      protPhys,
      protMent,
      absPhys,
      absMent,
      prouesses,
      moral,
      perfPhys,
      perfMent,
      ctrlActif,
      ctrlPassif,
      techMax,
      expPhys,
      expMent,
      precPhys,
      precMent,

      // Magie
      porteeMagique,
      tempsIncantation,
      expertiseMagique,
      resistanceDrain,
      puissanceInvocatrice,
      puissanceSoinsDegats,
      puissancePositive,
      puissanceNegative,
      puissanceGenerique,
      attrTradition,

      // Ressources
      ressourcesMax,
      recuperationRessource,

      // Caste
      caste,
      rang,
      rangCaste,
      rangXP,
      rangAptitude,
      xpTotal,
      aptitude,
      progressionInfo,
      nextProgression,

      // XP
      xpDepart,
      xpAcquis,
      xpUtilises,
      xpRestants,

      // PP
      ppDepart,
      ppDesavantages,
      ppCaste,
      ppTotal,
      ppUtilises,
      ppRestants
    };
  }, [character, castes]);
}

export default useCharacterCalculations;
