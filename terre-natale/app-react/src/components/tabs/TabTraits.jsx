import { useState } from 'react';
import { useCharacter } from '../../context/CharacterContext';
import { useCharacterCalculations } from '../../hooks/useCharacterCalculations';
import DATA from '../../data';

function TabTraits() {
  const { character, updateCharacter } = useCharacter();
  const calc = useCharacterCalculations(character);
  const [expandedTraits, setExpandedTraits] = useState({});

  const characterTraits = character.traits || [];

  // Récupérer les infos complètes des traits du personnage
  const traitsAvecInfos = characterTraits.map(ct => {
    const traitInfo = DATA.traits.find(t => t.id === ct.id);
    return { ...ct, info: traitInfo };
  }).filter(t => t.info);

  // Séparer avantages et désavantages
  const avantages = traitsAvecInfos.filter(t => t.info.type === 'avantage');
  const desavantages = traitsAvecInfos.filter(t => t.info.type === 'desavantage');

  // Traits disponibles (non encore pris)
  const traitsDisponibles = DATA.traits.filter(t =>
    !characterTraits.some(ct => ct.id === t.id)
  );

  // Avantages de caste
  const avantagesCaste = [];
  const rangCaste = calc.rangCaste || 0;
  for (const level of DATA.casteProgression) {
    if (level.rang <= rangCaste && level.avantages) {
      level.avantages.forEach(av => {
        avantagesCaste.push({
          ...av,
          rang: level.rang
        });
      });
    }
  }

  const toggleTrait = (traitId) => {
    setExpandedTraits(prev => ({
      ...prev,
      [traitId]: !prev[traitId]
    }));
  };

  const expandAll = () => {
    const newExpanded = {};
    characterTraits.forEach(t => {
      newExpanded[t.id] = true;
    });
    avantagesCaste.forEach((av, i) => {
      newExpanded[`caste-${av.rang}-${i}`] = true;
    });
    setExpandedTraits(newExpanded);
  };

  const collapseAll = () => {
    setExpandedTraits({});
  };

  const handleAddTrait = (type, traitId) => {
    if (!traitId) return;

    const traitInfo = DATA.traits.find(t => t.id === traitId);
    if (!traitInfo) return;

    updateCharacter(prev => ({
      ...prev,
      traits: [...(prev.traits || []), { id: traitId, rang: 1 }]
    }));
  };

  const handleRemoveTrait = (traitId) => {
    const traitInfo = DATA.traits.find(t => t.id === traitId);
    const traitNom = traitInfo ? traitInfo.nom : traitId;

    if (confirm(`Supprimer le trait "${traitNom}" ?`)) {
      updateCharacter(prev => ({
        ...prev,
        traits: (prev.traits || []).filter(t => t.id !== traitId)
      }));
      setExpandedTraits(prev => {
        const newExpanded = { ...prev };
        delete newExpanded[traitId];
        return newExpanded;
      });
    }
  };

  const handleRangChange = (traitId, newRang) => {
    updateCharacter(prev => ({
      ...prev,
      traits: (prev.traits || []).map(t => {
        if (t.id !== traitId) return t;
        const traitInfo = DATA.traits.find(ti => ti.id === traitId);
        const maxRang = traitInfo?.rangMax || 1;
        const clampedRang = Math.max(1, Math.min(maxRang, newRang));
        return { ...t, rang: clampedRang };
      })
    }));
  };

  const destineeNom = character.infos?.destinee || 'Commun des Mortels';

  return (
    <div id="tab-traits" className="tab-content active">
      {/* Bloc PP Résumé */}
      <section className="section xp-section">
        <div className="xp-summary-box pp-summary-box">
          <div className="xp-summary-title">Points de Personnage</div>
          <div className="xp-summary-content">
            <div className="xp-summary-row">
              <span className="xp-label">Départ ({destineeNom})</span>
              <span className="xp-value">{calc.ppDepart}</span>
            </div>
            <div className="xp-summary-row">
              <span className="xp-label">Désavantages</span>
              <span className="xp-value">{calc.ppDesavantages}</span>
            </div>
            <div className="xp-summary-row">
              <span className="xp-label">Caste (rang {calc.rangCaste})</span>
              <span className="xp-value">{calc.ppCaste}</span>
            </div>
            <div className="xp-summary-row xp-total-row">
              <span className="xp-label">Total</span>
              <span className="xp-value">{calc.ppTotal}</span>
            </div>
            <div className={`xp-summary-row xp-rest-row ${calc.ppRestants < 0 ? 'over-budget' : ''}`}>
              <span className="xp-label">Restant</span>
              <span className="xp-value xp-restant">{calc.ppRestants} / {calc.ppTotal}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Traits du Personnage</h2>
          <div className="traits-actions">
            <button className="btn-traits-expand" onClick={expandAll} title="Tout déplier">
              ▼ Tout
            </button>
            <button className="btn-traits-expand" onClick={collapseAll} title="Tout replier">
              ▲ Tout
            </button>
          </div>
        </div>

        <div className="traits-container">
          {/* Avantages Généraux */}
          <TraitsSection
            title="Avantages Généraux"
            type="avantage"
            traits={avantages}
            traitsDisponibles={traitsDisponibles}
            expandedTraits={expandedTraits}
            onToggle={toggleTrait}
            onRemove={handleRemoveTrait}
            onAdd={handleAddTrait}
            onRangChange={handleRangChange}
          />

          {/* Avantages de Caste */}
          <div className="traits-section traits-caste">
            <h3 className="traits-section-title">Avantages de Caste</h3>
            <div className="traits-list">
              {avantagesCaste.length === 0 ? (
                <div className="traits-empty">Aucun avantage de caste (rang 0)</div>
              ) : (
                avantagesCaste.map((av, index) => {
                  const expandId = `caste-${av.rang}-${index}`;
                  const isExpanded = expandedTraits[expandId] || false;
                  return (
                    <div
                      key={expandId}
                      className={`trait-item ${isExpanded ? 'expanded' : ''} trait-caste`}
                    >
                      <div className="trait-header">
                        <div className="trait-info">
                          <span className="trait-nom">{av.nom}</span>
                          <span className="trait-rang-caste">Rang {av.rang}</span>
                        </div>
                        <div className="trait-controls">
                          <button
                            className="btn-trait-toggle"
                            onClick={() => toggleTrait(expandId)}
                            title={isExpanded ? 'Replier' : 'Déplier'}
                          >
                            {isExpanded ? '▲' : '▼'}
                          </button>
                        </div>
                      </div>
                      {isExpanded && (
                        <div className="trait-content">
                          <p className="trait-description">{av.description}</p>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Désavantages */}
          <TraitsSection
            title="Désavantages"
            type="desavantage"
            traits={desavantages}
            traitsDisponibles={traitsDisponibles}
            expandedTraits={expandedTraits}
            onToggle={toggleTrait}
            onRemove={handleRemoveTrait}
            onAdd={handleAddTrait}
            onRangChange={handleRangChange}
          />
        </div>
      </section>
    </div>
  );
}

function TraitsSection({
  title,
  type,
  traits,
  traitsDisponibles,
  expandedTraits,
  onToggle,
  onRemove,
  onAdd,
  onRangChange
}) {
  const [selectedTrait, setSelectedTrait] = useState('');
  const typeClass = type === 'avantage' ? 'avantages' : 'desavantages';
  const traitsFiltered = traitsDisponibles.filter(t => t.type === type);

  const handleAdd = () => {
    if (selectedTrait) {
      onAdd(type, selectedTrait);
      setSelectedTrait('');
    }
  };

  return (
    <div className={`traits-section traits-${typeClass}`}>
      <h3 className="traits-section-title">{title}</h3>
      <div className="traits-list">
        {traits.length === 0 ? (
          <div className="traits-empty">Aucun {type}</div>
        ) : (
          traits.map(trait => {
            const isExpanded = expandedTraits[trait.id] || false;
            return (
              <div
                key={trait.id}
                className={`trait-item ${isExpanded ? 'expanded' : ''} trait-${type}`}
              >
                <div className="trait-header">
                  <div className="trait-info">
                    <span className="trait-nom">{trait.info.nom}</span>
                    <span className="trait-rang">[{trait.rang}]</span>
                  </div>
                  <div className="trait-controls">
                    <button
                      className="btn-trait-toggle"
                      onClick={() => onToggle(trait.id)}
                      title={isExpanded ? 'Replier' : 'Déplier'}
                    >
                      {isExpanded ? '▲' : '▼'}
                    </button>
                    <button
                      className="btn-trait-delete"
                      onClick={() => onRemove(trait.id)}
                      title="Supprimer"
                    >
                      ✕
                    </button>
                  </div>
                </div>
                {isExpanded && (
                  <div className="trait-content">
                    <p className="trait-description">{trait.info.description}</p>
                    {trait.info.rangMax > 1 && (
                      <div className="trait-rang-control">
                        <span>Rang: </span>
                        <select
                          value={trait.rang}
                          onChange={(e) => onRangChange(trait.id, parseInt(e.target.value))}
                        >
                          {Array.from({ length: trait.info.rangMax }, (_, i) => (
                            <option key={i + 1} value={i + 1}>{i + 1}</option>
                          ))}
                        </select>
                        <span> / {trait.info.rangMax}</span>
                        <span className="trait-cout-total">
                          {type === 'avantage'
                            ? ` (Coût: ${trait.info.coutPP * trait.rang} PP)`
                            : ` (Gain: +${trait.info.coutPP * trait.rang} PP)`}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
      {/* Ajout de trait */}
      <div className="trait-add-section">
        <div className="trait-add-row">
          <select
            className="select-add-trait"
            value={selectedTrait}
            onChange={(e) => setSelectedTrait(e.target.value)}
          >
            <option value="">-- Ajouter un {type} --</option>
            {traitsFiltered.map(t => (
              <option key={t.id} value={t.id}>
                {t.nom} ({t.coutPP} PP, max {t.rangMax})
              </option>
            ))}
          </select>
          <button className="btn-add-trait" onClick={handleAdd} title="Ajouter">+</button>
        </div>
      </div>
    </div>
  );
}

export default TabTraits;
