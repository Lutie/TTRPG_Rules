import { useState } from 'react';
import { useCharacter } from '../../context/CharacterContext';
import { useCharacterCalculations } from '../../hooks/useCharacterCalculations';
import DATA from '../../data';
import Section from '../common/Section';

function TabStatus() {
  const { character, updateCharacter } = useCharacter();
  const calc = useCharacterCalculations(character);
  const [editModal, setEditModal] = useState(null);

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

  // === Actions combat/repos ===
  const handleConfrontation = () => {
    // Ajoute Initiative et Moral si pas présents
    updateCharacter(prev => {
      let autresRes = [...(prev.autresRessources || [])];

      if (!autresRes.some(ar => ar.id === 'initiative')) {
        autresRes.push({ id: 'initiative', actuel: 0, max: 0 });
      }
      if (!autresRes.some(ar => ar.id === 'moral')) {
        autresRes.push({ id: 'moral', actuel: calc.moral, max: calc.resilience });
      }

      return { ...prev, autresRessources: autresRes };
    });
  };

  const handleNouveauTour = () => {
    // Reset des ressources temporaires comme Garde
    updateCharacter(prev => {
      const autresRes = prev.autresRessources?.map(ar => {
        const resData = DATA.autresRessources.find(r => r.id === ar.id);
        if (resData?.temporaire && ar.id !== 'rage' && ar.id !== 'adrenaline') {
          return { ...ar, actuel: 0 };
        }
        return ar;
      }) || [];
      return { ...prev, autresRessources: autresRes };
    });
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

      return { ...prev, ressources, autresRessources: autresRes };
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

      return { ...prev, ressources, autresRessources: autresRes };
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
      return { ...prev, ressources, lesions: newLesions, autresRessources: [] };
    });
  };

  return (
    <div id="tab-status" className="tab-content active">
      {/* Récap État / Pénalités */}
      <div className="status-recap-box">
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

export default TabStatus;
