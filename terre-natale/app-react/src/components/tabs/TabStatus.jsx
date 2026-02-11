import { useState, useMemo } from 'react';
import { useCharacter } from '../../context/CharacterContext';
import { useCharacterCalculations, calculerModificateur, getValeurTotale } from '../../hooks/useCharacterCalculations';

const ATTRS_PHYSIQUES = ['FOR', 'DEX', 'AGI', 'CON', 'PER'];

const calculerDefense = (valeur, choque) => {
  const mod = calculerModificateur(valeur);
  const impair = valeur % 2 !== 0 ? 1 : 0;
  return 10 + mod + (choque ? 0 : 5) + impair;
};
import DATA from '../../data';
import Section from '../common/Section';
import { calculerPenaliteAjustement } from './TabInventaire';

function TabStatus() {
  const { character, updateCharacter } = useCharacter();
  const calc = useCharacterCalculations(character);
  const [editModal, setEditModal] = useState(null);
  const [showConfrontationModal, setShowConfrontationModal] = useState(false);
  const [showNouveauTourModal, setShowNouveauTourModal] = useState(false);
  const [showRecapDetail, setShowRecapDetail] = useState(false);
  const [showPhysique, setShowPhysique] = useState(false);
  const [showMental, setShowMental] = useState(false);

  // Raccourcis
  const lesions = character.lesions || [];
  const autresRessources = character.autresRessources || [];
  const conditions = character.conditions || [];
  const tensions = character.tensions || { fatigue: 0, corruption: 0 };

  // Calcul pénalités lesions
  const blessures = lesions.filter(l => l.type === 'blessure');
  const traumas = lesions.filter(l => l.type === 'traumatisme');
  const maxNivBlessure = blessures.length > 0
    ? Math.max(...blessures.map(l => l.max > 0 ? Math.ceil(l.actuel / l.max) : 0))
    : 0;
  const maxNivTrauma = traumas.length > 0
    ? Math.max(...traumas.map(l => l.max > 0 ? Math.ceil(l.actuel / l.max) : 0))
    : 0;

  // Calcul pénalités tensions
  const nivFatigue = calc.resilFat > 0 ? Math.ceil(tensions.fatigue / calc.resilFat) : 0;
  const nivCorruption = calc.resilCorr > 0 ? Math.ceil(tensions.corruption / calc.resilCorr) : 0;

  const penaliteLesions = maxNivBlessure + maxNivTrauma;
  const penaliteTensions = nivFatigue + nivCorruption;
  const penaliteTotal = penaliteLesions + penaliteTensions;

  // État de choc si PE <= 0
  const peActuel = character.ressources?.PE?.actuel || 0;
  const enChoc = peActuel <= 0;

  // Calculs combat avec armure
  const inventaire = character.inventaire || [];
  const armureEquipee = inventaire.find(o => o.type === 'armure' && o.slot === 'armure');
  const armureCat = armureEquipee ? (armureEquipee.categorie ?? 1) : 0;
  const armureQualite = armureEquipee ? (armureEquipee.qualite ?? 0) : 0;
  const bonus = character.bonusConfig || {};

  // Absorption = absorption armure (cat×3) + mCON (CON finale = CON + qualité armure)
  const conBase = getValeurTotale(character, 'CON');
  const conEffective = conBase + armureQualite;
  const mConEffective = calculerModificateur(conEffective);
  const absorptionArmure = armureCat * 3;
  const absorptionTotale = absorptionArmure + mConEffective + (bonus.absorptionPhysique || 0);

  // Résistance = résistance armure (cat) + bonus
  const resistanceArmure = armureCat;
  const resistanceTotale = resistanceArmure + (bonus.resiliencePhysique || 0);

  // Protection physique = carac protection (5 + mSTA) + protection armure (cat) + bonus
  const protectionBase = 5 + calc.getMod('STA') + (bonus.protectionPhysique || 0);
  const protectionArmure = armureCat;
  const protectionTotale = protectionBase + protectionArmure;

  // Défenses passives physiques (attribut + qualité armure, -5 si choqué)
  const defensesPassives = ATTRS_PHYSIQUES.map(id => {
    const val = getValeurTotale(character, id) + armureQualite;
    return { id, defense: calculerDefense(val, enChoc) };
  });

  // Dégâts armes équipées
  const FORMES_ATTR = {
    tranchant: 'DEX', contondant: 'FOR', perforant: 'AGI', defense: 'CON', distance: 'PER'
  };
  const calcArme = (arme) => {
    if (!arme) return null;
    const cat = arme.categorie ?? 1;
    const qual = arme.qualite ?? 0;
    const attrId = FORMES_ATTR[arme.forme] || 'FOR';
    const attrBase = getValeurTotale(character, attrId);
    const mod = calculerModificateur(attrBase + qual);
    const nbDes = 2 + cat;
    // Perforation = m(PER + qualité arme) + bonus
    const perBase = getValeurTotale(character, 'PER');
    const perforation = calculerModificateur(perBase + qual) + (bonus.perfPhysique || 0);
    // Précision = m(DEX + qualité arme) + bonus
    const dexBase = getValeurTotale(character, 'DEX');
    const precision = calculerModificateur(dexBase + qual) + (bonus.precisionPhysique || 0);
    // Zone de contrôle active = m(DEX + qualité arme) + catégorie + bonus
    const zoneActive = calculerModificateur(dexBase + qual) + cat + (bonus.controleActif || 0);
    // Zone de contrôle passive = 5 + m(AGI + qualité arme) - catégorie + bonus
    const agiBase = getValeurTotale(character, 'AGI');
    const zonePassive = 5 + calculerModificateur(agiBase + qual) - cat + (bonus.controlePassif || 0);
    // Expertise = 10 + m(DEX + qualité arme) + bonus
    const expertise = 10 + calculerModificateur(dexBase + qual) + (bonus.expertisePhysique || 0);
    return { nom: arme.nom, nbDes, mod, attrId, qual, cat, perforation, precision, zoneActive, zonePassive, expertise };
  };
  const armeMainDir = inventaire.find(o => o.type === 'arme' && o.slot === 'mainDirectrice')
    || inventaire.find(o => o.type === 'arme' && o.slot === 'deuxMains');
  const armeMainNonDir = inventaire.find(o => o.type === 'arme' && o.slot === 'mainNonDirectrice');
  const degatsMainDir = calcArme(armeMainDir);
  const degatsMainNonDir = calcArme(armeMainNonDir);

  // Pénalités d'ajustement
  const entrainements = character.entrainements || {};
  const penaliteArmure = armureEquipee ? calculerPenaliteAjustement(armureEquipee, entrainements) : 0;
  const penaliteArmeDir = armeMainDir ? calculerPenaliteAjustement(armeMainDir, entrainements) : 0;
  const penaliteArmeNonDir = armeMainNonDir ? calculerPenaliteAjustement(armeMainNonDir, entrainements) : 0;

  // Status mental - Résolution
  const resolution = character.resolution || { categorie: 0, useQualiteArmure: false };
  const resCat = resolution.categorie ?? 0;
  const resQual = resolution.useQualiteArmure && armureEquipee ? (armureEquipee.qualite ?? 0) : 0;
  const volBase = getValeurTotale(character, 'VOL');
  const mVolEffective = calculerModificateur(volBase + resQual);
  const absorptionMentale = resCat * 3 + mVolEffective + (bonus.absorptionMentale || 0);
  const resistanceMentale = resCat + (bonus.resilienceMentale || 0);
  const protectionMentale = 5 + calc.getMod('EGO') + resCat + (bonus.protectionMentale || 0);
  const penaliteResolution = Math.max(0, 2 * resCat - 2 * (entrainements.social ?? 0) + resQual);
  const ATTRS_MENTAUX = ['CHA', 'INT', 'RUS', 'VOL', 'SAG'];
  const defensesPassivesMentales = ATTRS_MENTAUX.map(id => {
    const val = getValeurTotale(character, id) + resQual;
    return { id, defense: calculerDefense(val, enChoc) };
  });

  // Status mental - Argumentation
  const argumentation = character.argumentation || { categorie: 0, attribut: 'CHA', useQualiteArme: false };
  const argCat = argumentation.categorie ?? 0;
  const argAttr = argumentation.attribut || 'CHA';
  const argQual = argumentation.useQualiteArme && armeMainDir ? (armeMainDir.qualite ?? 0) : 0;
  const argAttrBase = getValeurTotale(character, argAttr);
  const argMod = calculerModificateur(argAttrBase + argQual);
  const argNbDes = 2 + argCat;
  const expertiseArgumentation = 10 + calculerModificateur(getValeurTotale(character, 'INT') + argQual) + (bonus.expertiseMentale || 0);
  const perforationMentale = calc.getMod('SAG') + (bonus.perfMentale || 0);
  const precisionMentale = calc.getMod('INT') + (bonus.precisionMentale || 0);
  const penaliteArgumentation = Math.max(0, 2 * argCat - 2 * (entrainements.social ?? 0) + argQual);

  // Surcharge sociale (prestance)
  const surchargePrestige = (resCat + argCat) * 5 > calc.prestance;

  // Surcharge physique (encombrement)
  const encEquipe = inventaire.reduce((total, o) => {
    if (o.type === 'consommable') {
      return total + (o.encombrement ?? 0.125) * (o.quantite ?? 1);
    } else if (['arme', 'armure', 'focalisateur', 'outil', 'autre'].includes(o.type)) {
      return total + (o.categorie ?? 0);
    }
    return total;
  }, 0);
  const surchargePhysique = encEquipe > calc.encombrementMax;

  // Détail pour savoir si le recap état a du contenu
  const hasRecapDetail = enChoc || penaliteTotal > 0;

  // Résiliences par ressource
  const resilParRessource = {
    PE: calc.resilPhys,
    PS: calc.resilMent,
    PM: calc.resilMag,
    PV: calc.resilience,
    PK: calc.resilience,
    PC: calc.resilience
  };

  // === Handlers ressources principales ===
  const handleRessourceChange = (resId, field, delta) => {
    updateCharacter(prev => {
      const ressource = prev.ressources[resId] || { actuel: 0, max: 0, temporaire: 0 };
      const resilTemp = resilParRessource[resId] || calc.resilience;
      const maxVal = field === 'temporaire'
        ? resilTemp
        : (calc.ressourcesMax[resId] || 0) + (ressource.temporaire || 0);
      const newVal = Math.max(0, Math.min(maxVal, (ressource[field] || 0) + delta));

      return {
        ...prev,
        ressources: {
          ...prev.ressources,
          [resId]: { ...ressource, [field]: newVal }
        }
      };
    });
  };

  const handleRessourceSet = (resId, field, value) => {
    updateCharacter(prev => {
      const ressource = prev.ressources[resId] || { actuel: 0, max: 0, temporaire: 0 };
      const resilTemp = resilParRessource[resId] || calc.resilience;
      const maxVal = field === 'temporaire'
        ? resilTemp
        : (calc.ressourcesMax[resId] || 0) + (ressource.temporaire || 0);
      const newVal = Math.max(0, Math.min(maxVal, value));

      return {
        ...prev,
        ressources: {
          ...prev.ressources,
          [resId]: { ...ressource, [field]: newVal }
        }
      };
    });
  };

  // === Handlers autres ressources ===
  const handleAddAutreRessource = (id) => {
    if (!id) return;
    const resData = DATA.autresRessources.find(r => r.id === id);
    if (!resData) return;

    let max = 0;
    if (resData.absorption === 'physique') max = calc.absPhys;
    else if (resData.absorption === 'mentale') max = calc.absMent;
    else if (resData.temporaire || resData.maxResilience) max = calc.resilience;

    updateCharacter(prev => ({
      ...prev,
      autresRessources: [...(prev.autresRessources || []), { id, actuel: 0, max }]
    }));
  };

  const handleAutreRessourceChange = (index, delta, isMinus5 = false) => {
    updateCharacter(prev => {
      const ar = prev.autresRessources[index];
      if (!ar) return prev;
      const resData = DATA.autresRessources.find(r => r.id === ar.id);
      const isSansMax = resData?.sansMax === true;

      let maxEffectif;
      if (resData?.absorption === 'physique') maxEffectif = calc.absPhys;
      else if (resData?.absorption === 'mentale') maxEffectif = calc.absMent;
      else if (resData?.temporaire) maxEffectif = calc.resilience;
      else if (resData?.maxResilience) maxEffectif = calc.resilience;
      else maxEffectif = ar.max || 0;

      const actualDelta = isMinus5 ? -5 : delta;
      const newVal = isSansMax
        ? Math.max(0, ar.actuel + actualDelta)
        : Math.max(0, Math.min(maxEffectif, ar.actuel + actualDelta));

      const newAutres = [...prev.autresRessources];
      newAutres[index] = { ...ar, actuel: newVal };
      return { ...prev, autresRessources: newAutres };
    });
  };

  const handleDeleteAutreRessource = (index) => {
    updateCharacter(prev => ({
      ...prev,
      autresRessources: prev.autresRessources.filter((_, i) => i !== index)
    }));
  };

  // === Handlers lésions ===
  const handleAddLesion = (type, valeur) => {
    if (!type || !valeur) return;
    const lesionData = DATA.typesLesions.find(l => l.id === type);
    if (!lesionData) return;

    const protection = lesionData.protection === 'physique' ? calc.protPhys : calc.protMent;

    updateCharacter(prev => ({
      ...prev,
      lesions: [...(prev.lesions || []), { type, actuel: valeur, max: protection }]
    }));
  };

  const handleLesionChange = (index, delta) => {
    updateCharacter(prev => {
      const lesion = prev.lesions[index];
      if (!lesion) return prev;

      const newVal = lesion.actuel + delta;
      if (newVal <= 0) {
        return { ...prev, lesions: prev.lesions.filter((_, i) => i !== index) };
      }

      const newLesions = [...prev.lesions];
      newLesions[index] = { ...lesion, actuel: newVal };
      return { ...prev, lesions: newLesions };
    });
  };

  const handleDeleteLesion = (index) => {
    updateCharacter(prev => ({
      ...prev,
      lesions: prev.lesions.filter((_, i) => i !== index)
    }));
  };

  // === Handlers conditions ===
  const handleAddCondition = (id, charges) => {
    if (!id) return;
    updateCharacter(prev => ({
      ...prev,
      conditions: [...(prev.conditions || []), { id, charges: charges || 10, avancee: false }]
    }));
  };

  const handleConditionChange = (index, delta) => {
    updateCharacter(prev => {
      const cond = prev.conditions[index];
      if (!cond) return prev;

      const newVal = cond.charges + delta;
      if (newVal <= 0) {
        return { ...prev, conditions: prev.conditions.filter((_, i) => i !== index) };
      }

      const newConds = [...prev.conditions];
      newConds[index] = { ...cond, charges: newVal };
      return { ...prev, conditions: newConds };
    });
  };

  const handleConditionAvancee = (index, avancee) => {
    updateCharacter(prev => {
      const newConds = [...prev.conditions];
      newConds[index] = { ...newConds[index], avancee };
      return { ...prev, conditions: newConds };
    });
  };

  const handleDeleteCondition = (index) => {
    updateCharacter(prev => ({
      ...prev,
      conditions: prev.conditions.filter((_, i) => i !== index)
    }));
  };

  // === Handlers tensions ===
  const handleTensionChange = (type, delta) => {
    updateCharacter(prev => ({
      ...prev,
      tensions: {
        ...prev.tensions,
        [type]: Math.max(0, (prev.tensions?.[type] || 0) + delta)
      }
    }));
  };

  // Calcule les catégories par défaut résolution/argumentation
  const calcDefaultSocial = () => {
    const maxParPanache = Math.min(Math.floor(calc.panache / 5), 6);
    const resCatDefault = Math.min(maxParPanache, Math.floor(calc.prestance / 5));
    const prestanceRestante = calc.prestance - resCatDefault * 5;
    const argCatDefault = Math.min(maxParPanache, Math.floor(prestanceRestante / 5), 6);
    return { resCatDefault, argCatDefault };
  };

  const applyDefaultSocial = (prev) => {
    const { resCatDefault, argCatDefault } = calcDefaultSocial();
    return {
      ...prev,
      resolution: { ...prev.resolution, categorie: resCatDefault },
      argumentation: { ...prev.argumentation, categorie: argCatDefault }
    };
  };

  // === Actions combat/repos ===
  const handleConfrontation = () => {
    setShowConfrontationModal(true);
  };

  const applyConfrontation = (initiative, moral) => {
    updateCharacter(prev => {
      // Supprime les anciennes armures, initiative et moral si présentes
      let autresRes = (prev.autresRessources || []).filter(
        ar => !['armure_physique', 'armure_mentale', 'initiative', 'moral'].includes(ar.id)
      );

      // Ajoute les ressources de combat au début
      if (calc.absPhys > 0) {
        autresRes.unshift({ id: 'armure_physique', actuel: calc.absPhys, max: calc.absPhys });
      }
      if (calc.absMent > 0) {
        autresRes.unshift({ id: 'armure_mentale', actuel: calc.absMent, max: calc.absMent });
      }
      if (initiative > 0) {
        autresRes.unshift({ id: 'initiative', actuel: initiative, max: 0 });
      }
      if (moral > 0) {
        autresRes.unshift({ id: 'moral', actuel: Math.min(moral, calc.resilience), max: calc.resilience });
      }

      return applyDefaultSocial({ ...prev, autresRessources: autresRes });
    });
    setShowConfrontationModal(false);
  };

  const handleNouveauTour = () => {
    setShowNouveauTourModal(true);
  };

  const applyNouveauTour = (initiative) => {
    updateCharacter(prev => {
      // Supprime les anciennes armures et initiative si présentes
      let autresRes = (prev.autresRessources || []).filter(
        ar => !['armure_physique', 'armure_mentale', 'initiative'].includes(ar.id)
      );

      // Ajoute les ressources de combat au début
      if (calc.absPhys > 0) {
        autresRes.unshift({ id: 'armure_physique', actuel: calc.absPhys, max: calc.absPhys });
      }
      if (calc.absMent > 0) {
        autresRes.unshift({ id: 'armure_mentale', actuel: calc.absMent, max: calc.absMent });
      }
      if (initiative > 0) {
        autresRes.unshift({ id: 'initiative', actuel: initiative, max: 0 });
      }

      // Réduit les conditions selon leur type
      let newConditions = (prev.conditions || []).filter(cond => {
        const condData = DATA.conditions.find(c => c.id === cond.id);
        if (!condData) return false;
        const recup = condData.type === 'physique'
          ? (calc.recuperationRessource?.PV || calc.recuperation)
          : (calc.recuperationRessource?.PS || calc.recuperation);
        cond.charges -= recup;
        return cond.charges > 0;
      });

      return { ...prev, autresRessources: autresRes, conditions: newConditions };
    });
    setShowNouveauTourModal(false);
  };

  const handleNouveauRound = () => {
    // Réduit l'initiative de 10
    updateCharacter(prev => {
      const autresRes = prev.autresRessources?.map(ar => {
        if (ar.id === 'initiative') {
          return { ...ar, actuel: Math.max(0, ar.actuel - 10) };
        }
        return ar;
      }) || [];
      return { ...prev, autresRessources: autresRes };
    });
  };

  const handleFinScene = () => {
    // Supprime temporaires et initiative
    updateCharacter(prev => {
      // Reset temporaires des ressources principales
      const ressources = { ...prev.ressources };
      Object.keys(ressources).forEach(key => {
        ressources[key] = { ...ressources[key], temporaire: 0 };
      });

      // Supprime les autres ressources temporaires
      const autresRes = prev.autresRessources?.filter(ar => {
        const resData = DATA.autresRessources.find(r => r.id === ar.id);
        return !resData?.temporaire && ar.id !== 'initiative' && ar.id !== 'moral';
      }) || [];

      return applyDefaultSocial({ ...prev, ressources, autresRessources: autresRes });
    });
  };

  const handleReposCourt = () => {
    const equilibre = calc.getAttr('EQU');

    updateCharacter(prev => {
      // Reset PE au minimum (EQU)
      const ressources = { ...prev.ressources };
      if (ressources.PE) {
        ressources.PE = {
          ...ressources.PE,
          actuel: Math.max(ressources.PE.actuel, equilibre),
          temporaire: 0
        };
      }
      // Reset tous les temporaires
      Object.keys(ressources).forEach(key => {
        ressources[key] = { ...ressources[key], temporaire: 0 };
      });

      // Reset/supprime autres ressources court
      const autresRes = prev.autresRessources?.filter(ar => {
        const resData = DATA.autresRessources.find(r => r.id === ar.id);
        return !resData?.reposCourt;
      }) || [];

      return applyDefaultSocial({ ...prev, ressources, autresRessources: autresRes });
    });
  };

  const handleReposLong = () => {
    updateCharacter(prev => {
      // Applique récupération à toutes les ressources
      const ressources = { ...prev.ressources };
      DATA.ressources.forEach(res => {
        const current = ressources[res.id] || { actuel: 0, max: calc.ressourcesMax[res.id], temporaire: 0 };
        const recup = calc.recuperationRessource[res.id] || calc.recuperation;
        const max = calc.ressourcesMax[res.id] || 0;
        ressources[res.id] = {
          ...current,
          actuel: Math.min(max, current.actuel + recup),
          temporaire: 0
        };
      });

      // Récupération des lésions
      const recupPV = calc.recuperationRessource.PV || calc.recuperation;
      const recupPS = calc.recuperationRessource.PS || calc.recuperation;
      const newLesions = (prev.lesions || []).filter(lesion => {
        const lesionData = DATA.typesLesions.find(l => l.id === lesion.type);
        if (!lesionData) return false;
        const recup = lesionData.ressource === 'PV' ? recupPV : recupPS;
        lesion.actuel -= recup;
        return lesion.actuel > 0;
      });

      // Supprime toutes les autres ressources
      return applyDefaultSocial({ ...prev, ressources, lesions: newLesions, autresRessources: [] });
    });
  };

  return (
    <div id="tab-status" className="tab-content active">
      {/* Récap État / Pénalités */}
      <div className="status-bandeau-group">
        <div
          className={`status-bandeau ${hasRecapDetail ? 'expandable' : ''}`}
          onClick={() => hasRecapDetail && setShowRecapDetail(!showRecapDetail)}
        >
          <div className="status-bandeau-summary">
            <div className="status-recap-item">
              <span className="status-recap-label">État</span>
              <span className={`status-recap-value ${enChoc ? 'etat-choc' : 'etat-normal'}`}>
                {enChoc ? 'Choc' : 'Normal'}
              </span>
            </div>
            <div className="status-recap-item">
              <span className="status-recap-label">Pénalités</span>
              <span className={`status-recap-value ${penaliteTotal > 0 ? 'has-penalty' : ''}`}>
                {penaliteTotal}
                <span className="status-recap-detail">
                {' '}({maxNivBlessure}/{maxNivTrauma}/{nivFatigue}/{nivCorruption})
                </span>
              </span>
            </div>
            {hasRecapDetail && (
              <span className="status-bandeau-toggle">{showRecapDetail ? '▲' : '▼'}</span>
            )}
          </div>
          {showRecapDetail && (
            <div className="status-bandeau-detail" onClick={e => e.stopPropagation()}>
              {enChoc && <div className="status-bandeau-detail-line">En état de choc (PE ≤ 0) : défenses réduites</div>}
              {penaliteTotal > 0 && <div className="status-bandeau-detail-line">
                Blessures {maxNivBlessure}, Traumatismes {maxNivTrauma}, Fatigue {nivFatigue}, Corruption {nivCorruption}
              </div>}
            </div>
          )}
        </div>

        {/* Status Physique */}
        <div className="status-bandeau expandable" onClick={() => setShowPhysique(!showPhysique)}>
          <div className="status-bandeau-summary">
            <div className="status-recap-item">
              <span className="status-recap-label">Status Physique</span>
            </div>
            <span className="status-bandeau-toggle">{showPhysique ? '▲' : '▼'}</span>
          </div>
          {showPhysique && (
            <div className="status-bandeau-detail" onClick={e => e.stopPropagation()}>
              {/* Armure */}
              <div className="status-bandeau-combat-row">
                <span className="status-recap-combat-label status-row-title">🛡 {armureEquipee ? armureEquipee.nom : 'Armure'}{armureEquipee && (armureEquipee.categorie ?? 1) * 5 > calc.poigne && <span className="inventaire-poids-warn" title="Poigne insuffisante : désavantagé au port de l'armure">&#x26A0;</span>}{surchargePhysique && <span className="inventaire-poids-warn" title="Encombrement dépassé : désavantagé">&#x26A0;</span>}</span>
                <div className="status-recap-combat-item">
                  <span className="status-recap-combat-label">Absorption</span>
                  <span className="status-recap-combat-value">{absorptionTotale}</span>
                  <span className="status-recap-combat-detail">
                    ({absorptionArmure} + mCON {mConEffective >= 0 ? '+' : ''}{mConEffective}{armureQualite !== 0 ? `, Q${armureQualite}` : ''}{bonus.absorptionPhysique ? `, bonus ${bonus.absorptionPhysique}` : ''})
                  </span>
                </div>
                <div className="status-recap-combat-item">
                  <span className="status-recap-combat-label">Résistance</span>
                  <span className="status-recap-combat-value">{resistanceTotale}</span>
                  <span className="status-recap-combat-detail">
                    ({resistanceArmure}{bonus.resiliencePhysique ? ` + bonus ${bonus.resiliencePhysique}` : ''})
                  </span>
                </div>
                <div className="status-recap-combat-item">
                  <span className="status-recap-combat-label">Protection</span>
                  <span className="status-recap-combat-value">{protectionTotale}</span>
                  <span className="status-recap-combat-detail">
                    ({protectionBase} + armure {protectionArmure})
                  </span>
                </div>
                <div className="status-defenses-passives">
                  <span className="status-defenses-passives-label">Défenses Passives :</span>
                  {defensesPassives.map((d, i) => (
                    <span key={d.id} className="status-defense-passive">
                      <span className="status-defense-attr">{d.id}</span> {d.defense}{i < defensesPassives.length - 1 ? ',\u00A0' : ''}
                    </span>
                  ))}
                  {enChoc && <span className="status-defense-choc">,&nbsp;choc -5</span>}
                  {penaliteArmure > 0 && (
                    <><span className="status-defense-passive">,&nbsp;</span><span className="status-defenses-passives-label status-penalite-warn">Ajustement : -{penaliteArmure}</span></>
                  )}
                </div>
              </div>
              {/* Arme main directrice / deux mains */}
              {degatsMainDir && (
                <div className="status-bandeau-combat-row">
                  <span className="status-recap-combat-label status-row-title">⚔ {degatsMainDir.nom} ({armeMainDir.slot === 'deuxMains' ? '2 mains' : 'main dir.'}){(armeMainDir.categorie ?? 1) * 5 > calc.poigne && <span className="inventaire-poids-warn" title="Poigne insuffisante : désavantagé à l'usage">&#x26A0;</span>}{surchargePhysique && <span className="inventaire-poids-warn" title="Encombrement dépassé : désavantagé">&#x26A0;</span>}</span>
                  <div className="status-recap-combat-item">
                    <span className="status-recap-combat-label">Dégâts</span>
                    <span className="status-recap-combat-value">
                      {degatsMainDir.nbDes}D8 {degatsMainDir.mod >= 0 ? `(+${degatsMainDir.mod})` : `(${degatsMainDir.mod})`}
                    </span>
                    <span className="status-recap-combat-detail">
                      ({degatsMainDir.attrId}{degatsMainDir.qual !== 0 ? ` Q${degatsMainDir.qual}` : ''})
                    </span>
                  </div>
                  <div className="status-recap-combat-item">
                    <span className="status-recap-combat-label">Perforation</span>
                    <span className="status-recap-combat-value">{degatsMainDir.perforation}</span>
                    <span className="status-recap-combat-detail">
                      (PER{degatsMainDir.qual !== 0 ? ` Q${degatsMainDir.qual}` : ''}{bonus.perfPhysique ? ` + bonus ${bonus.perfPhysique}` : ''})
                    </span>
                  </div>
                  <div className="status-recap-combat-item">
                    <span className="status-recap-combat-label">Précision</span>
                    <span className="status-recap-combat-value">{degatsMainDir.precision}</span>
                    <span className="status-recap-combat-detail">
                      (DEX{degatsMainDir.qual !== 0 ? ` Q${degatsMainDir.qual}` : ''}{bonus.precisionPhysique ? ` + bonus ${bonus.precisionPhysique}` : ''})
                    </span>
                  </div>
                  <div className="status-defenses-passives">
                    <span className="status-defenses-passives-label">Expertise :</span>
                    <span className="status-defense-passive">{degatsMainDir.expertise},&nbsp;</span>
                    <span className="status-defenses-passives-label">Zones de Contrôle :</span>
                    <span className="status-defense-passive">Active {degatsMainDir.zoneActive},&nbsp;</span>
                    <span className="status-defense-passive">Passive {degatsMainDir.zonePassive}</span>
                    {penaliteArmeDir > 0 && (
                      <><span className="status-defense-passive">,&nbsp;</span><span className="status-defenses-passives-label status-penalite-warn">Ajustement : -{penaliteArmeDir}</span></>
                    )}
                  </div>
                </div>
              )}
              {/* Arme main non directrice */}
              {degatsMainNonDir && (
                <div className="status-bandeau-combat-row">
                  <span className="status-recap-combat-label status-row-title">⚔ {degatsMainNonDir.nom} (main non dir.){(armeMainNonDir.categorie ?? 1) * 5 > calc.poigne && <span className="inventaire-poids-warn" title="Poigne insuffisante : désavantagé à l'usage">&#x26A0;</span>}{surchargePhysique && <span className="inventaire-poids-warn" title="Encombrement dépassé : désavantagé">&#x26A0;</span>}</span>
                  <div className="status-recap-combat-item">
                    <span className="status-recap-combat-label">Dégâts</span>
                    <span className="status-recap-combat-value">
                      {degatsMainNonDir.nbDes}D8 {degatsMainNonDir.mod >= 0 ? `(+${degatsMainNonDir.mod})` : `(${degatsMainNonDir.mod})`}
                    </span>
                    <span className="status-recap-combat-detail">
                      ({degatsMainNonDir.attrId}{degatsMainNonDir.qual !== 0 ? ` Q${degatsMainNonDir.qual}` : ''})
                    </span>
                  </div>
                  <div className="status-recap-combat-item">
                    <span className="status-recap-combat-label">Perforation</span>
                    <span className="status-recap-combat-value">{degatsMainNonDir.perforation}</span>
                    <span className="status-recap-combat-detail">
                      (PER{degatsMainNonDir.qual !== 0 ? ` Q${degatsMainNonDir.qual}` : ''}{bonus.perfPhysique ? ` + bonus ${bonus.perfPhysique}` : ''})
                    </span>
                  </div>
                  <div className="status-recap-combat-item">
                    <span className="status-recap-combat-label">Précision</span>
                    <span className="status-recap-combat-value">{degatsMainNonDir.precision}</span>
                    <span className="status-recap-combat-detail">
                      (DEX{degatsMainNonDir.qual !== 0 ? ` Q${degatsMainNonDir.qual}` : ''}{bonus.precisionPhysique ? ` + bonus ${bonus.precisionPhysique}` : ''})
                    </span>
                  </div>
                  <div className="status-defenses-passives">
                    <span className="status-defenses-passives-label">Expertise :</span>
                    <span className="status-defense-passive">{degatsMainNonDir.expertise},&nbsp;</span>
                    <span className="status-defenses-passives-label">Zones de Contrôle :</span>
                    <span className="status-defense-passive">Active {degatsMainNonDir.zoneActive},&nbsp;</span>
                    <span className="status-defense-passive">Passive {degatsMainNonDir.zonePassive}</span>
                    {penaliteArmeNonDir > 0 && (
                      <><span className="status-defense-passive">,&nbsp;</span><span className="status-defenses-passives-label status-penalite-warn">Ajustement : -{penaliteArmeNonDir}</span></>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Status Mental */}
        <div className="status-bandeau expandable" onClick={() => setShowMental(!showMental)}>
          <div className="status-bandeau-summary">
            <div className="status-recap-item">
              <span className="status-recap-label">Status Mental</span>
            </div>
            <span className="status-bandeau-toggle">{showMental ? '▲' : '▼'}</span>
          </div>
          {showMental && (
            <div className="status-bandeau-detail" onClick={e => e.stopPropagation()}>
              {/* Résolution */}
              <div className="status-bandeau-combat-row">
                <span className="status-recap-combat-label status-row-title">
                  🛡 Résolution{resCat * 5 > calc.panache && <span className="inventaire-poids-warn" title="Panache insuffisant : désavantagé à l'usage">&#x26A0;</span>}{surchargePrestige && <span className="inventaire-poids-warn" title="Prestance dépassée : désavantagé">&#x26A0;</span>}
                  <select
                    className="status-inline-select"
                    value={resCat}
                    onChange={e => updateCharacter(prev => ({ ...prev, resolution: { ...prev.resolution, categorie: Number(e.target.value) } }))}
                    onClick={e => e.stopPropagation()}
                  >
                    {[0,1,2,3,4,5,6].map(v => <option key={v} value={v}>C{v}</option>)}
                  </select>
                  <label className="status-inline-checkbox" onClick={e => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={resolution.useQualiteArmure || false}
                      onChange={e => updateCharacter(prev => ({ ...prev, resolution: { ...prev.resolution, useQualiteArmure: e.target.checked } }))}
                    />
                    <span className="status-inline-checkbox-label">Q armure{resQual !== 0 ? ` (${resQual > 0 ? '+' : ''}${resQual})` : ''}</span>
                    <span className="status-info-pip" title="Votre armure est-elle de prestige ou d'apparat ? Si oui, cochez cette case.">ⓘ</span>
                  </label>
                </span>
                <div className="status-recap-combat-item">
                  <span className="status-recap-combat-label">Absorption</span>
                  <span className="status-recap-combat-value">{absorptionMentale}</span>
                  <span className="status-recap-combat-detail">
                    ({resCat * 3} + mVOL {mVolEffective >= 0 ? '+' : ''}{mVolEffective}{resQual !== 0 ? `, Q${resQual}` : ''}{bonus.absorptionMentale ? ` + bonus ${bonus.absorptionMentale}` : ''})
                  </span>
                </div>
                <div className="status-recap-combat-item">
                  <span className="status-recap-combat-label">Résistance</span>
                  <span className="status-recap-combat-value">{resistanceMentale}</span>
                  <span className="status-recap-combat-detail">
                    ({resCat}{bonus.resilienceMentale ? ` + bonus ${bonus.resilienceMentale}` : ''})
                  </span>
                </div>
                <div className="status-recap-combat-item">
                  <span className="status-recap-combat-label">Protection</span>
                  <span className="status-recap-combat-value">{protectionMentale}</span>
                  <span className="status-recap-combat-detail">
                    (5 + mEGO {calc.getMod('EGO') >= 0 ? '+' : ''}{calc.getMod('EGO')} + rés. {resCat}{bonus.protectionMentale ? ` + bonus ${bonus.protectionMentale}` : ''})
                  </span>
                </div>
                <div className="status-defenses-passives">
                  <span className="status-defenses-passives-label">Défenses Passives :</span>
                  {defensesPassivesMentales.map((d, i) => (
                    <span key={d.id} className="status-defense-passive">
                      <span className="status-defense-attr">{d.id}</span> {d.defense}{i < defensesPassivesMentales.length - 1 ? ',\u00A0' : ''}
                    </span>
                  ))}
                  {enChoc && <span className="status-defense-choc">,&nbsp;choc -5</span>}
                  {penaliteResolution > 0 && (
                    <><span className="status-defense-passive">,&nbsp;</span><span className="status-defenses-passives-label status-penalite-warn">Ajustement : -{penaliteResolution}</span></>
                  )}
                </div>
              </div>
              {/* Argumentation */}
              <div className="status-bandeau-combat-row">
                <span className="status-recap-combat-label status-row-title">
                  ⚔ Argumentation{argCat * 5 > calc.panache && <span className="inventaire-poids-warn" title="Panache insuffisant : désavantagé à l'usage">&#x26A0;</span>}{surchargePrestige && <span className="inventaire-poids-warn" title="Prestance dépassée : désavantagé">&#x26A0;</span>}
                  <select
                    className="status-inline-select"
                    value={argCat}
                    onChange={e => updateCharacter(prev => ({ ...prev, argumentation: { ...prev.argumentation, categorie: Number(e.target.value) } }))}
                    onClick={e => e.stopPropagation()}
                  >
                    {[0,1,2,3,4,5,6].map(v => <option key={v} value={v}>C{v}</option>)}
                  </select>
                  <select
                    className="status-inline-select"
                    value={argAttr}
                    onChange={e => updateCharacter(prev => ({ ...prev, argumentation: { ...prev.argumentation, attribut: e.target.value } }))}
                    onClick={e => e.stopPropagation()}
                  >
                    {['CHA', 'INT', 'RUS'].map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                  <label className="status-inline-checkbox" onClick={e => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={argumentation.useQualiteArme || false}
                      onChange={e => updateCharacter(prev => ({ ...prev, argumentation: { ...prev.argumentation, useQualiteArme: e.target.checked } }))}
                    />
                    <span className="status-inline-checkbox-label">Q arme{argQual !== 0 ? ` (${argQual > 0 ? '+' : ''}${argQual})` : ''}</span>
                    <span className="status-info-pip" title="Votre arme est-elle de prestige ou d'apparat ? Si oui, cochez cette case.">ⓘ</span>
                  </label>
                </span>
                <div className="status-recap-combat-item">
                  <span className="status-recap-combat-label">Dégâts</span>
                  <span className="status-recap-combat-value">
                    {argNbDes}D8 {argMod >= 0 ? `(+${argMod})` : `(${argMod})`}
                  </span>
                  <span className="status-recap-combat-detail">
                    ({argAttr}{argQual !== 0 ? ` Q${argQual}` : ''})
                  </span>
                </div>
                <div className="status-recap-combat-item">
                  <span className="status-recap-combat-label">Perforation</span>
                  <span className="status-recap-combat-value">{perforationMentale}</span>
                  <span className="status-recap-combat-detail">
                    (mSAG{bonus.perfMentale ? ` + bonus ${bonus.perfMentale}` : ''})
                  </span>
                </div>
                <div className="status-recap-combat-item">
                  <span className="status-recap-combat-label">Précision</span>
                  <span className="status-recap-combat-value">{precisionMentale}</span>
                  <span className="status-recap-combat-detail">
                    (mINT{bonus.precisionMentale ? ` + bonus ${bonus.precisionMentale}` : ''})
                  </span>
                </div>
                <div className="status-defenses-passives">
                  <span className="status-defenses-passives-label">Expertise :</span>
                  <span className="status-defense-passive">{expertiseArgumentation}</span>
                  {penaliteArgumentation > 0 && (
                    <><span className="status-defense-passive">,&nbsp;</span><span className="status-defenses-passives-label status-penalite-warn">Ajustement : -{penaliteArgumentation}</span></>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions Combat/Repos */}
      <section className="section status-actions-section">
        <div className="status-actions-box">
          <div className="status-actions-group">
            <span className="status-actions-label">Combat</span>
            <button className="btn-combat" onClick={handleConfrontation} title="Démarre une confrontation avec Initiative et Moral">
              Confrontation
            </button>
            <button className="btn-combat" onClick={handleNouveauTour} title="Nouveau tour de combat">
              Nouveau Tour
            </button>
            <button className="btn-combat" onClick={handleNouveauRound} title="Réduit l'Initiative de 10">
              Nouveau Round
            </button>
          </div>
          <div className="status-actions-group">
            <span className="status-actions-label">Scène</span>
            <button className="btn-scene" onClick={handleFinScene} title="Supprime temporaires et initiative">
              Fin de Scène
            </button>
          </div>
          <div className="status-actions-group">
            <span className="status-actions-label">Repos</span>
            <button className="btn-repos" onClick={handleReposCourt} title="Remet PE au minimum (EQU) et supprime les temporaires">
              Repos Court
            </button>
            <button className="btn-repos" onClick={handleReposLong} title="Applique la récupération et remet PE au max">
              Repos Long
            </button>
          </div>
        </div>
      </section>

      {/* Ressources principales */}
      <Section title="Ressources">
        <p className="status-info">
          Résilience : {calc.resilience} | Récupération : {calc.recuperation} | Équilibre : {calc.getAttr('EQU')}
        </p>
        <div className="status-ressources-grid">
          {DATA.ressources.map(res => {
            const ressource = character.ressources[res.id] || { actuel: 0, max: 0, temporaire: 0 };
            const max = calc.ressourcesMax[res.id] || 0;
            const actuel = ressource.actuel || 0;
            const temporaire = ressource.temporaire || 0;
            const total = max + temporaire;
            const pct = total > 0 ? Math.min(100, (actuel / total) * 100) : 0;
            const pctTemp = total > 0 ? Math.min(100, (temporaire / total) * 100) : 0;

            return (
              <div key={res.id} className="status-ressource-box" data-ressource={res.id}>
                <div className="status-ressource-icone">{res.icone}</div>
                <div className="status-ressource-content">
                  <div className="status-ressource-header">
                    <span className="status-ressource-nom">{res.nom}</span>
                    <span className="status-ressource-valeurs">
                      {actuel} / {max}
                      {temporaire > 0 && <span className="status-valeur-temp"> (+{temporaire})</span>}
                    </span>
                  </div>
                  <div className="status-ressource-bar-container">
                    <div className="status-ressource-bar">
                      <div className="status-ressource-bar-fill" style={{ width: `${pct}%` }} />
                    </div>
                    {temporaire > 0 && (
                      <div className="status-ressource-bar-temp" style={{ width: `${pctTemp}%`, left: `${100 - pctTemp}%` }} />
                    )}
                  </div>
                  <div className="status-ressource-controls">
                    <span className="status-control-label">Actu</span>
                    <button className="btn-status-minus" onClick={() => handleRessourceChange(res.id, 'actuel', -1)}>-</button>
                    <button
                      className="btn-status-edit"
                      onClick={() => setEditModal({ type: 'ressource', resId: res.id, field: 'actuel', value: actuel, max: total })}
                    >
                      {actuel}
                    </button>
                    <button className="btn-status-plus" onClick={() => handleRessourceChange(res.id, 'actuel', 1)}>+</button>
                    <span className="status-separator">|</span>
                    <span className="status-control-label">Temp</span>
                    <button className="btn-status-minus" onClick={() => handleRessourceChange(res.id, 'temporaire', -1)}>-</button>
                    <button
                      className="btn-status-edit"
                      onClick={() => setEditModal({ type: 'ressource', resId: res.id, field: 'temporaire', value: temporaire, max: resilParRessource[res.id] })}
                    >
                      {temporaire}
                    </button>
                    <button className="btn-status-plus" onClick={() => handleRessourceChange(res.id, 'temporaire', 1)}>+</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Autres Ressources */}
      <Section title="Autres Ressources">
        <div className="status-ressources-grid status-autres-grid">
          {autresRessources.map((ar, index) => {
            const resData = DATA.autresRessources.find(r => r.id === ar.id);
            if (!resData) return null;

            const isSansMax = resData.sansMax === true;
            const isTemporaire = resData.temporaire === true;
            const isAbsorption = !!resData.absorption;

            let maxEffectif;
            if (isAbsorption) {
              maxEffectif = resData.absorption === 'physique' ? calc.absPhys : calc.absMent;
            } else if (isTemporaire || resData.maxResilience) {
              maxEffectif = calc.resilience;
            } else {
              maxEffectif = ar.max || 0;
            }

            const pct = !isSansMax && maxEffectif > 0 ? Math.min(100, (ar.actuel / maxEffectif) * 100) : 0;
            const reposTag = resData.reposCourt ? 'Court' : 'Long';
            const reposClass = resData.reposCourt ? 'repos-court' : 'repos-long';

            return (
              <div key={index} className={`status-ressource-box status-autre-ressource ${reposClass}`}>
                <div className="status-ressource-icone">{resData.icone}</div>
                <div className="status-ressource-content">
                  <div className="status-ressource-header">
                    <span className="status-ressource-nom">
                      {resData.nom} <span className={`status-repos-tag ${reposClass}`}>{reposTag}</span>
                    </span>
                    <span className="status-ressource-valeurs">
                      {ar.actuel}{!isSansMax && ` / ${maxEffectif}`}
                    </span>
                  </div>
                  {!isSansMax && (
                    <div className="status-ressource-bar-container">
                      <div className="status-ressource-bar">
                        <div
                          className="status-ressource-bar-fill status-autre-bar"
                          style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${resData.couleur} 0%, ${resData.couleur}99 100%)` }}
                        />
                      </div>
                    </div>
                  )}
                  <div className="status-ressource-controls">
                    <span className="status-control-label">Valeur</span>
                    <button className="btn-status-minus" onClick={() => handleAutreRessourceChange(index, -1)}>-</button>
                    {ar.id === 'initiative' && (
                      <button className="btn-status-minus btn-initiative-moins5" onClick={() => handleAutreRessourceChange(index, 0, true)}>-5</button>
                    )}
                    <span className="status-ressource-valeur">{ar.actuel}</span>
                    <button className="btn-status-plus" onClick={() => handleAutreRessourceChange(index, 1)}>+</button>
                    <button className="btn-autre-delete" onClick={() => handleDeleteAutreRessource(index)} title="Supprimer">✕</button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Carte d'ajout */}
          <AutreRessourceAddCard
            autresRessources={autresRessources}
            onAdd={handleAddAutreRessource}
          />
        </div>
      </Section>

      {/* Lésions */}
      <Section title="Lésions">
        <div className="status-ressources-grid status-lesions-grid">
          {lesions.map((lesion, index) => {
            const lesionData = DATA.typesLesions.find(l => l.id === lesion.type);
            if (!lesionData) return null;

            const pct = lesion.max > 0 ? Math.min(100, (lesion.actuel / lesion.max) * 100) : 0;
            const niveauGravite = lesion.max > 0 ? Math.ceil(lesion.actuel / lesion.max) : 0;
            const gravite = DATA.gravites.find(g => g.niveau === Math.min(niveauGravite, 5)) || DATA.gravites[0];

            return (
              <div key={index} className="status-ressource-box status-lesion">
                <div className="status-ressource-icone">{lesionData.icone}</div>
                <div className="status-ressource-content">
                  <div className="status-ressource-header">
                    <span className="status-ressource-nom">
                      {lesionData.nom}
                      <span className="status-lesion-gravite" style={{ color: gravite.couleur }}> {gravite.nom}</span>
                    </span>
                    <span className="status-ressource-valeurs">{lesion.actuel} / {lesion.max}</span>
                  </div>
                  <div className="status-ressource-bar-container">
                    <div className="status-ressource-bar">
                      <div
                        className="status-ressource-bar-fill"
                        style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${gravite.couleur} 0%, ${gravite.couleur}99 100%)` }}
                      />
                    </div>
                  </div>
                  <div className="status-ressource-controls">
                    <span className="status-control-label">Valeur</span>
                    <button className="btn-status-minus" onClick={() => handleLesionChange(index, -1)}>-</button>
                    <span className="status-ressource-valeur">{lesion.actuel}</span>
                    <button className="btn-status-plus" onClick={() => handleLesionChange(index, 1)}>+</button>
                    <button className="btn-lesion-delete" onClick={() => handleDeleteLesion(index)} title="Supprimer">✕</button>
                    <span className="status-lesion-niveau" style={{ color: gravite.couleur }}>Nv {niveauGravite}</span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Carte d'ajout */}
          <LesionAddCard protPhys={calc.protPhys} protMent={calc.protMent} onAdd={handleAddLesion} />
        </div>
      </Section>

      {/* Conditions */}
      <Section title="Conditions">
        <div className="status-ressources-grid status-conditions-grid">
          {conditions.map((cond, index) => {
            const condData = DATA.conditions.find(c => c.id === cond.id);
            if (!condData) return null;

            const typeClass = condData.type === 'physique' ? 'type-physique' : 'type-mentale';
            const typeLabel = condData.type === 'physique' ? 'Phys' : 'Ment';

            return (
              <div key={index} className={`status-ressource-box status-condition ${typeClass} ${cond.avancee ? 'condition-avancee' : ''}`}>
                <div className="status-ressource-icone">{condData.icone}</div>
                <div className="status-ressource-content">
                  <div className="status-ressource-header">
                    <span className="status-ressource-nom">
                      {condData.nom}
                      {cond.avancee && <span className="condition-avancee-tag"> Avancée</span>}
                    </span>
                    <span className={`status-condition-type ${typeClass}`}>{typeLabel}</span>
                  </div>
                  <div className="status-condition-effets">{condData.effets}</div>
                  <div className="status-ressource-controls">
                    <span className="status-control-label">Charges</span>
                    <button className="btn-status-minus" onClick={() => handleConditionChange(index, -1)}>-</button>
                    <span className="status-ressource-valeur">{cond.charges}</span>
                    <button className="btn-status-plus" onClick={() => handleConditionChange(index, 1)}>+</button>
                    <label className="condition-avancee-toggle" title="Avancée">
                      <input
                        type="checkbox"
                        className="condition-avancee-checkbox"
                        checked={cond.avancee || false}
                        onChange={(e) => handleConditionAvancee(index, e.target.checked)}
                      />
                      <span className="condition-avancee-label">Av.</span>
                    </label>
                    <button className="btn-condition-delete" onClick={() => handleDeleteCondition(index)} title="Supprimer">✕</button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Carte d'ajout */}
          <ConditionAddCard onAdd={handleAddCondition} />
        </div>
      </Section>

      {/* Tensions */}
      <Section title="Tensions">
        <div className="status-ressources-grid status-lesions-grid">
          <TensionCard
            id="fatigue"
            nom="Fatigue"
            icone="😫"
            actuel={tensions.fatigue}
            max={calc.resilFat}
            niveau={nivFatigue}
            onChange={(delta) => handleTensionChange('fatigue', delta)}
          />
          <TensionCard
            id="corruption"
            nom="Corruption"
            icone="💀"
            actuel={tensions.corruption}
            max={calc.resilCorr}
            niveau={nivCorruption}
            onChange={(delta) => handleTensionChange('corruption', delta)}
          />
        </div>
      </Section>

      {/* Modal d'édition */}
      {editModal && (
        <EditModal
          {...editModal}
          onClose={() => setEditModal(null)}
          onSave={(value) => {
            if (editModal.type === 'ressource') {
              handleRessourceSet(editModal.resId, editModal.field, value);
            }
            setEditModal(null);
          }}
        />
      )}

      {/* Modal Confrontation */}
      {showConfrontationModal && (
        <ConfrontationModal
          resilience={calc.resilience}
          absPhys={calc.absPhys}
          absMent={calc.absMent}
          onClose={() => setShowConfrontationModal(false)}
          onApply={applyConfrontation}
        />
      )}

      {/* Modal Nouveau Tour */}
      {showNouveauTourModal && (
        <NouveauTourModal
          absPhys={calc.absPhys}
          absMent={calc.absMent}
          onClose={() => setShowNouveauTourModal(false)}
          onApply={applyNouveauTour}
        />
      )}
    </div>
  );
}

// === Composants auxiliaires ===

function TensionCard({ id, nom, icone, actuel, max, niveau, onChange }) {
  const gravite = DATA.gravites.find(g => g.niveau === Math.min(niveau, 5)) || DATA.gravites[0];
  const pct = max > 0 ? Math.min((actuel / max) * 100, 100) : 0;

  return (
    <div className="status-ressource-box status-lesion status-tension" data-tension={id}>
      <div className="status-ressource-icone">{icone}</div>
      <div className="status-ressource-content">
        <div className="status-ressource-header">
          <span className="status-ressource-nom">
            {nom} <span className="status-lesion-gravite" style={{ color: gravite.couleur }}>{gravite.nom}</span>
          </span>
          <span className="status-ressource-valeurs">{actuel} / {max}</span>
        </div>
        <div className="status-ressource-bar-container">
          <div className="status-ressource-bar">
            <div
              className="status-ressource-bar-fill"
              style={{
                width: `${pct}%`,
                background: `linear-gradient(90deg, ${gravite.couleur} 0%, ${gravite.couleur}99 100%)`
              }}
            />
          </div>
        </div>
        <div className="status-ressource-controls">
          <span className="status-control-label">Valeur</span>
          <button className="btn-status-minus" onClick={() => onChange(-1)}>-</button>
          <span className="status-ressource-valeur">{actuel}</span>
          <button className="btn-status-plus" onClick={() => onChange(1)}>+</button>
          <span className="status-lesion-niveau" style={{ color: gravite.couleur }}>Nv {niveau}</span>
        </div>
      </div>
    </div>
  );
}

function AutreRessourceAddCard({ autresRessources, onAdd }) {
  const [selectedId, setSelectedId] = useState('');

  const available = DATA.autresRessources.filter(ar =>
    !autresRessources.some(cr => cr.id === ar.id)
  );

  const handleAdd = () => {
    if (selectedId) {
      onAdd(selectedId);
      setSelectedId('');
    }
  };

  return (
    <div className="status-ressource-box status-autre-add">
      <div className="status-autre-add-content">
        <select
          className="select-autre-ressource"
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
        >
          <option value="">-- Ajouter --</option>
          {available.map(ar => (
            <option key={ar.id} value={ar.id}>
              {ar.icone} {ar.nom} ({ar.reposCourt ? 'Court' : 'Long'})
            </option>
          ))}
        </select>
        <button className="btn-autre-add" onClick={handleAdd} title="Ajouter">+</button>
      </div>
    </div>
  );
}

function LesionAddCard({ protPhys, protMent, onAdd }) {
  const [selectedType, setSelectedType] = useState('');
  const [valeur, setValeur] = useState('');

  const handleAdd = () => {
    if (selectedType && valeur) {
      onAdd(selectedType, parseInt(valeur));
      setSelectedType('');
      setValeur('');
    }
  };

  return (
    <div className="status-ressource-box status-lesion-add">
      <div className="status-lesion-add-content">
        <select
          className="select-lesion"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="">-- Type --</option>
          {DATA.typesLesions.map(l => {
            const protection = l.protection === 'physique' ? protPhys : protMent;
            return (
              <option key={l.id} value={l.id}>
                {l.icone} {l.nom} (max: {protection})
              </option>
            );
          })}
        </select>
        <input
          type="number"
          className="input-lesion-valeur"
          min="1"
          placeholder="Valeur"
          title="Valeur initiale"
          value={valeur}
          onChange={(e) => setValeur(e.target.value)}
        />
        <button className="btn-lesion-add" onClick={handleAdd} title="Ajouter">+</button>
      </div>
    </div>
  );
}

function ConditionAddCard({ onAdd }) {
  const [selectedId, setSelectedId] = useState('');
  const [charges, setCharges] = useState(10);

  const handleAdd = () => {
    if (selectedId) {
      onAdd(selectedId, charges);
      setSelectedId('');
      setCharges(10);
    }
  };

  return (
    <div className="status-ressource-box status-condition-add">
      <div className="status-condition-add-content">
        <select
          className="select-condition"
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
        >
          <option value="">-- Condition --</option>
          {DATA.conditions.map(c => {
            const typeLabel = c.type === 'physique' ? '🏃' : '🧠';
            return (
              <option key={c.id} value={c.id}>
                {typeLabel} {c.nom}
              </option>
            );
          })}
        </select>
        <input
          type="number"
          className="input-condition-charges"
          min="1"
          placeholder="Charges"
          title="Charges initiales"
          value={charges}
          onChange={(e) => setCharges(parseInt(e.target.value) || 10)}
        />
        <button className="btn-condition-add" onClick={handleAdd} title="Ajouter">+</button>
      </div>
    </div>
  );
}

function EditModal({ value, max, onClose, onSave }) {
  const [inputValue, setInputValue] = useState(value);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSave = () => {
    const val = Math.max(0, Math.min(max, parseInt(inputValue) || 0));
    onSave(val);
  };

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className="status-edit-modal">
        <div className="status-edit-modal-content">
          <input
            type="number"
            className="status-edit-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            min="0"
            max={max}
            autoFocus
          />
          <span className="status-edit-max">/ {max}</span>
        </div>
        <div className="status-edit-modal-actions">
          <button className="btn-status-edit-cancel" onClick={onClose}>Annuler</button>
          <button className="btn-status-edit-save" onClick={handleSave}>OK</button>
        </div>
      </div>
    </div>
  );
}

function ConfrontationModal({ resilience, absPhys, absMent, onClose, onApply }) {
  const [initiative, setInitiative] = useState(10);
  const [moral, setMoral] = useState(10);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleApply = () => {
    onApply(initiative, Math.min(moral, resilience));
  };

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className="combat-modal">
        <h3 className="combat-modal-title">Confrontation</h3>

        <div className="combat-modal-fields">
          <div className="combat-modal-field">
            <label>Initiative</label>
            <input
              type="number"
              value={initiative}
              onChange={(e) => setInitiative(parseInt(e.target.value) || 0)}
              onKeyDown={(e) => e.key === 'Enter' && document.getElementById('input-moral')?.focus()}
              min="0"
              autoFocus
            />
          </div>
          <div className="combat-modal-field">
            <label>Moral <span className="combat-modal-hint">(max {resilience})</span></label>
            <input
              id="input-moral"
              type="number"
              value={moral}
              onChange={(e) => setMoral(parseInt(e.target.value) || 0)}
              onKeyDown={(e) => e.key === 'Enter' && handleApply()}
              min="0"
              max={resilience}
            />
          </div>
        </div>

        <p className="combat-modal-info">
          Armure Phys: {absPhys} | Armure Ment: {absMent}
        </p>

        <div className="combat-modal-buttons">
          <button className="btn-combat-cancel" onClick={onClose}>Annuler</button>
          <button className="btn-combat-confirm" onClick={handleApply}>Démarrer</button>
        </div>
      </div>
    </div>
  );
}

function NouveauTourModal({ absPhys, absMent, onClose, onApply }) {
  const [initiative, setInitiative] = useState(10);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleApply = () => {
    onApply(initiative);
  };

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className="combat-modal">
        <h3 className="combat-modal-title">Nouveau Tour</h3>

        <div className="combat-modal-fields">
          <div className="combat-modal-field">
            <label>Initiative</label>
            <input
              type="number"
              value={initiative}
              onChange={(e) => setInitiative(parseInt(e.target.value) || 0)}
              onKeyDown={(e) => e.key === 'Enter' && handleApply()}
              min="0"
              autoFocus
            />
          </div>
        </div>

        <p className="combat-modal-info">
          Armure Phys: {absPhys} | Armure Ment: {absMent}
        </p>

        <div className="combat-modal-buttons">
          <button className="btn-combat-cancel" onClick={onClose}>Annuler</button>
          <button className="btn-combat-confirm" onClick={handleApply}>Démarrer</button>
        </div>
      </div>
    </div>
  );
}

export default TabStatus;
