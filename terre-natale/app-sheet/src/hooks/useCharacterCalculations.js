import { useMemo } from 'react';
import DATA from '../data';

// Calcule le modificateur d'un attribut
export const calculerModificateur = (valeur) => Math.floor((valeur - 10) / 2);

// Calcule le bonusConfig effectif depuis bonusEntries (nouveau système)
export const computeBonusConfig = (character) => {
  const config = {};
  (character.bonusEntries || []).forEach(e => {
    if (e.type) config[e.type] = (config[e.type] || 0) + (e.valeur || 0);
  });
  return config;
};

// Retourne la valeur par défaut d'un attribut selon son type
export const getValeurDefaut = (attrId) => {
  const secondaires = ['STA', 'TAI', 'EGO', 'APP', 'CHN', 'EQU'];
  return secondaires.includes(attrId) ? DATA.valeurDefautSecondaire : DATA.valeurDefautPrincipal;
};

// Calcule la base de l'équilibre : moyenne du plus faible et du 2e plus élevé des attributs principaux
export const getBaseEquilibre = (character) => {
  const ids = DATA.attributsPrincipaux.map(a => a.id);
  const bases = ids.map(id => {
    const attr = character.attributs?.[id];
    return attr?.base || DATA.valeurDefautPrincipal;
  });
  const sorted = [...bases].sort((a, b) => a - b);
  const plusFaible = sorted[0];
  const deuxiemePlusEleve = sorted[sorted.length - 2];
  return Math.floor((plusFaible + deuxiemePlusEleve) / 2);
};

// Calcule la valeur totale d'un attribut
export const getValeurTotale = (character, attrId, progressionInfo = null) => {
  const attr = character.attributs?.[attrId];
  const defaut = getValeurDefaut(attrId);
  if (!attr) return defaut;

  const base = attrId === 'EQU' ? getBaseEquilibre(character) : (attr.base || defaut);
  const bonusEthnie = attr.bonus || 0;
  const bonusOrigines = (character.originesBonus && character.originesBonus[attrId]) || 0;
  const bonusNaissance = (character.naissanceBonus && character.naissanceBonus[attrId]) || 0;

  let bonusCaste = 0;
  if (attrId === 'EQU' && progressionInfo) {
    bonusCaste = progressionInfo.bonusEquilibre || 0;
  }

  const bonusKey = 'attr' + attrId;
  const bonusAttr = computeBonusConfig(character)[bonusKey] || 0;

  return base + bonusEthnie + bonusOrigines + bonusNaissance + bonusCaste + bonusAttr;
};

// Calcule l'XP de départ selon le vécu
export const getXPDepart = (character) => {
  const vecuId = character.infos?.background;
  const vecu = DATA.vecus.find(v => v.id === vecuId || v.nom === vecuId);
  return vecu?.xp || 200;
};

// Calcule l'XP total
export const getXPTotal = (character) => {
  const bonusXP = computeBonusConfig(character).xp || 0;
  return getXPDepart(character) + (character.xpAcquis || 0) + bonusXP;
};

// Clé de stockage d'une compétence (doit correspondre à compKey dans TabCompetences)
const _compKey = (comp) =>
  comp.sousGroupe
    ? `${comp.groupe}__${comp.sousGroupe}__${comp.id}`
    : `${comp.groupe}__${comp.id}`;

// Calcule l'aptitude (somme des rangs de compétences liées aux attributs de caste)
export const calculerAptitude = (character) => {
  const charCompetences = character.competences || { groupes: {}, competences: {} };
  const attrCaste1 = character.caste?.attribut1;
  const attrCaste2 = character.caste?.attribut2;
  if (!attrCaste1 && !attrCaste2) return 0;

  const attrsCaste = [attrCaste1, attrCaste2].filter(Boolean);
  let aptitude = 0;

  const processGroupe = (groupe, sourceComps) => {
    let groupeAttrs;
    if (groupe.id === 'ambidextrie') {
      groupeAttrs = ['DEX'];
    } else {
      // Attrs fixes des compétences du groupe
      const fixed = [...new Set(
        sourceComps.filter(c => c.groupe === groupe.id && !c.attrVariable).flatMap(c => c.attributs)
      )];
      // Pour les comps attrVariable, l'attribut est choisi par le joueur (défaut : 'FOR')
      const variable = sourceComps
        .filter(c => c.groupe === groupe.id && c.attrVariable)
        .map(c => charCompetences.attributsChoisis?.[_compKey(c)] ?? 'FOR');
      groupeAttrs = [...new Set([...fixed, ...variable])];
    }

    if (!groupeAttrs.some(a => attrsCaste.includes(a))) return;

    aptitude += charCompetences.groupes?.[groupe.id] || 0;

    if (!groupe.libre) {
      sourceComps
        .filter(c => c.groupe === groupe.id)
        .forEach(comp => {
          if (comp.libre) {
            // Slots libres (< Type d'Arme >, < Langue >, < Domaine >) : entrées ajoutées par le joueur
            const entries = charCompetences.libres?.[_compKey(comp)] || [];
            entries.forEach(entry => {
              if (entry.attr && attrsCaste.includes(entry.attr)) {
                aptitude += entry.rang || 0;
              }
            });
          } else {
            // attrVariable ou limitant sans attr fixe : utilise l'attribut choisi stocké
            const compAttrs = ((comp.attrVariable || comp.limitant) && comp.attributs.length === 0)
              ? [charCompetences.attributsChoisis?.[_compKey(comp)] ?? (comp.attrVariable ? 'FOR' : null)].filter(Boolean)
              : comp.attributs;
            if (compAttrs.some(a => attrsCaste.includes(a))) {
              aptitude += charCompetences.competences?.[_compKey(comp)] || 0;
            }
          }
        });
    }
  };

  DATA.categoriesCompetences.forEach(cat =>
    cat.groupes.forEach(groupe => processGroupe(groupe, DATA.competences))
  );
  DATA.categoriesMagie.forEach(cat =>
    cat.groupes.forEach(groupe => processGroupe(groupe, DATA.competencesMagie))
  );

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
    const bonus = computeBonusConfig(character);

    // Caste et progression — calculés en premier car le bonus EQU de caste
    // doit être disponible dans getAttr dès le début
    const caste = castes.find(c => c.id === character.caste?.id);
    const xpTotal = getXPTotal(character);
    const aptitude = calculerAptitude(character);
    const rangXP = calculerRangCasteParXP(character);
    const rangAptitudeCalc = calculerRangCasteParAptitude(character);
    const aptitudeOverride = character.caste?.rangAptitudeOverride ?? null;
    const rangAptitude = (aptitudeOverride !== null && !isNaN(aptitudeOverride))
      ? aptitudeOverride
      : rangAptitudeCalc;
    const rangCaste = Math.min(rangXP, rangAptitude);
    const rang = rangCaste;
    const progressionInfo = getProgressionInfo(rangCaste);
    const nextProgression = getNextProgressionInfo(rangCaste);

    const getAttr = (id) => getValeurTotale(character, id, progressionInfo);
    const getMod = (id) => calculerModificateur(getAttr(id));

    // Allure et déplacement
    const allure = 10 + getMod('TAI') + getMod('AGI') + (bonus.allure || 0);
    const deplacement = Math.floor(allure / 2);
    const sautHauteur = Math.floor(allure / 8);
  const sautLongueur = Math.floor(allure / 4);

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
    const panache = getAttr('CHA') + (bonus.panache || 0);
    const prestance = getAttr('CHA') + getAttr('EGO') + (bonus.prestance || 0);

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
    const attrNatPhys = getMod('FOR') + (bonus.attritionPhysique || 0);
    const attrNatMent = getMod('CHA') + (bonus.attritionMentale || 0);
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
    // Coût des groupes: 20×rang (rang 1→20, rang 2→40, rang 3→60 ; total 20 / 60 / 120)
    const coutGroupe = [0, 20, 40, 60];
    Object.values(competencesData.groupes || {}).forEach(r => {
      for (let i = 1; i <= r; i++) xpUtilises += coutGroupe[i] || 0;
    });
    // Coût des compétences: 10×rang (rang 1→10, rang 2→20, … ; total 10 / 30 / 60 / 100 / 150 / 210)
    const coutComp = [0, 10, 20, 30, 40, 50, 60];
    Object.values(competencesData.competences || {}).forEach(r => {
      for (let i = 1; i <= r; i++) xpUtilises += coutComp[i] || 0;
    });
    // Coût des compétences libres (Tradition, Type d'Arme, Langue…) : même tarif
    Object.values(competencesData.libres || {}).forEach(entries => {
      (entries || []).forEach(entry => {
        const r = entry.rang || 0;
        for (let i = 1; i <= r; i++) xpUtilises += coutComp[i] || 0;
      });
    });
    // Coût des aptitudes (styles)
    let xpAptitudes = 0;
    const aptitudesData = character.aptitudes || { styles: [] };
    (aptitudesData.styles || []).forEach(style => {
      const rg = style.rang || 0;
      for (let i = 1; i <= rg; i++) xpAptitudes += coutGroupe[i] || 0;
      (style.entries || []).forEach(entry => {
        const re = entry.rang || 0;
        for (let i = 1; i <= re; i++) xpAptitudes += coutComp[i] || 0;
      });
    });
    xpUtilises += xpAptitudes;
    const xpRestants = xpTotal - xpUtilises;

    // PP calculations
    const destineeId = character.infos?.destiny;
    const destinee = DATA.destinees.find(d => d.id === destineeId || d.nom === destineeId);
    const ppDepart = destinee?.pp || DATA.destinees[0].pp;
    // PP from désavantages
    const characterTraits = character.traits || [];
    let ppDesavantages = 0;
    characterTraits.forEach(ct => {
      const traitInfo = ct.custom ? ct : DATA.traits.find(t => t.id === ct.id);
      if (traitInfo && traitInfo.type === 'desavantage') {
        ppDesavantages += ct.rang * (traitInfo.coutPP || 1);
      }
    });
    // PP from caste (1 PP at ranks 5, 7, 9, 11, 13, 15, 17, 19)
    const paliersPP = [5, 7, 9, 11, 13, 15, 17, 19];
    let ppCaste = 0;
    paliersPP.forEach(p => { if (rangCaste >= p) ppCaste += 1; });
    const ppTotal = ppDepart + ppDesavantages + ppCaste;
    // PP utilisés = coût des avantages (majeurs et archétypes, pas mineurs)
    const TYPES_PP = ['avantage_majeur', 'avantage_archetype', 'avantage'];
    let ppUtilises = 0;
    characterTraits.forEach(ct => {
      const traitInfo = ct.custom ? ct : DATA.traits.find(t => t.id === ct.id);
      if (traitInfo && TYPES_PP.includes(traitInfo.type)) {
        ppUtilises += ct.rang * (traitInfo.coutPP || 1);
      }
    });
    // PP utilisés par les particularités d'origine activées
    const ethnie = DATA.ethnies.find(e => e.id === character.infos?.ethnicity);
    if (ethnie) {
      const allParts = [
        ...(ethnie.particularites_naissance  || []),
        ...(ethnie.particularites_culturelles || []),
      ];
      allParts.forEach(p => {
        if (!p.anchor) return;
        const info = DATA.particularites[p.anchor];
        if (!info?.coutPP) return;
        const isActive = character.particuliaritesActives?.[p.anchor] ?? false;
        if (isActive) ppUtilises += info.coutPP;
      });
    }
    const ppRestants = ppTotal - ppUtilises;

    // PA calculations
    // Coût palier principal : x → x+1 coûte max(0, x-4) PA (base départ = 7)
    const PA_START = 7;
    const paStepCost = (x) => Math.max(0, x - 4);
    const paCostPrimary = (value) => {
      let cost = 0;
      if (value > PA_START)      for (let x = PA_START; x < value; x++) cost += paStepCost(x);
      else if (value < PA_START) for (let x = PA_START; x > value; x--) cost -= paStepCost(x - 1);
      return cost;
    };
    const PA_SECONDARY_COSTS = { 8: -5, 9: -3, 10: 0, 11: 4, 12: 9 };
    const PA_CHANCE_COSTS    = { 8: -9, 9: -5, 10: 0, 11: 6, 12: 13 };
    const PRIMARY_ATTR_IDS   = ['FOR','DEX','AGI','CON','PER','CHA','INT','RUS','VOL','SAG','MAG','LOG'];
    const SECONDARY_ATTR_IDS = ['STA','TAI','EGO','APP'];

    let paDepenses = 0;
    PRIMARY_ATTR_IDS.forEach(id => {
      const base = character.attributs?.[id]?.base ?? PA_START;
      paDepenses += paCostPrimary(base);
    });
    SECONDARY_ATTR_IDS.forEach(id => {
      const base = character.attributs?.[id]?.base ?? 10;
      paDepenses += PA_SECONDARY_COSTS[base] ?? 0;
    });
    // CHN (Chance) — coût double des secondaires
    const chnBase = character.attributs?.['CHN']?.base ?? 10;
    paDepenses += PA_CHANCE_COSTS[chnBase] ?? 0;

    const paCaste = DATA.casteProgression.reduce((sum, level) => level.rang <= rangCaste ? sum + (level.pa || 0) : sum, 0);
    const paBudget  = (destinee?.pa || DATA.destinees[0].pa) + paCaste + (bonus.pa || 0);
    const paMax     = (destinee?.maxAttribut || DATA.destinees[0].maxAttribut) + (bonus.paMax || 0);
    const paRestants = paBudget - paDepenses;

    return {
      // Attributs
      getAttr,
      getMod,

      // Déplacement
      allure,
      deplacement,
      sautHauteur,
    sautLongueur,

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
      panache,
      prestance,
      protPhys,
      protMent,
      absPhys,
      absMent,
      prouesses,
      moral,
      perfPhys,
      perfMent,
      attrNatPhys,
      attrNatMent,
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
      modTradition,
      memoireDesSorts: bonus.memoireDesSorts || 0,

      // Ressources
      ressourcesMax,
      recuperationRessource,

      // Caste
      caste,
      rang,
      rangCaste,
      rangXP,
      rangAptitude,
      rangAptitudeCalc,
      aptitudeOverride,
      xpTotal,
      aptitude,
      progressionInfo,
      nextProgression,

      // XP
      xpDepart,
      xpAcquis,
      xpUtilises,
      xpAptitudes,
      xpRestants,

      // PP
      ppDepart,
      ppDesavantages,
      ppCaste,
      ppTotal,
      ppUtilises,
      ppRestants,

      // PA
      paBudget,
      paDepenses,
      paRestants,
      paMax,

      // Plafonds selon rang de caste
      maxAttrCaste:    progressionInfo?.maxAttrCaste    ?? 18,
      maxCompetence:   progressionInfo?.maxCompetence   ?? 4,
      maxGroupe:       progressionInfo?.maxGroupe       ?? 2,
    };
  }, [character, castes]);
}

export default useCharacterCalculations;
