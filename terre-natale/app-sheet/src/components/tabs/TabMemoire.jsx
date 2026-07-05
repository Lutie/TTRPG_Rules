import { useState } from 'react';
import { useCharacter } from '../../context/CharacterContext';
import { useCharacterCalculations } from '../../hooks/useCharacterCalculations';
import DATA from '../../data';

// Types qui ont un compendium riche (description/effets consultables)
const COMPENDIUM_TYPES = new Set([0, 3]); // Manœuvre, Prouesse

function getEntryDisplayName(entry) {
  // Prouesses : préférer nom_fluff si disponible
  return entry.nom_fluff || entry.nom || '';
}

function getEntrySubtitle(entry) {
  if (entry.type && entry.penalite !== undefined) {
    // Manœuvre
    return `${entry.type}${entry.penalite ? ` · ${entry.penalite}` : ''}${entry.categorie ? ` · ${entry.categorie}` : ''}`;
  }
  if (entry.type) return entry.type; // Prouesse
  return '';
}

// Preview d'une entrée compendium (affiché sous le select lors de la sélection)
function CompendiumPreview({ entry }) {
  if (!entry) return null;
  return (
    <div className="memoire-compendium-preview">
      <div className="memoire-preview-nom">{getEntryDisplayName(entry)}</div>
      {getEntrySubtitle(entry) && (
        <div className="memoire-preview-subtitle">{getEntrySubtitle(entry)}</div>
      )}
      {entry.resume && (
        <div className="memoire-preview-resume">{entry.resume}</div>
      )}
      {entry.description && (
        <div className="memoire-preview-block">
          <span className="memoire-preview-label">Description</span>
          <p>{entry.description}</p>
        </div>
      )}
      {entry.effets && (
        <div className="memoire-preview-block">
          <span className="memoire-preview-label">Effets</span>
          <p>{entry.effets}</p>
        </div>
      )}
      {entry.modularite && (
        <div className="memoire-preview-block">
          <span className="memoire-preview-label">Modularité</span>
          <p>{entry.modularite}</p>
        </div>
      )}
      {entry.conditions && (
        <div className="memoire-preview-block">
          <span className="memoire-preview-label">Conditions</span>
          <p>{entry.conditions}</p>
        </div>
      )}
    </div>
  );
}

// Entrée dans la liste (affichage riche en mode expanded)
function CompendiumListItem({ entry, isExpanded, onToggle, onRemove }) {
  const displayName = getEntryDisplayName(entry);
  const subtitle = getEntrySubtitle(entry);
  const hasContent = entry.description || entry.effets || entry.resume || entry.modularite || entry.conditions;

  return (
    <div className={`memoire-item ${isExpanded ? 'expanded' : ''}`}>
      <div className="memoire-item-header">
        <div className="memoire-item-main">
          <span className="memoire-nom">{displayName}</span>
          {subtitle && <span className="memoire-item-subtitle">{subtitle}</span>}
        </div>
        <div className="memoire-item-controls">
          {hasContent && (
            <button
              className={`btn-memoire-desc ${isExpanded ? 'has-content' : ''}`}
              onClick={onToggle}
              title="Détails"
            >▾</button>
          )}
          <button className="btn-memoire-delete" onClick={onRemove} title="Supprimer">✕</button>
        </div>
      </div>
      {isExpanded && hasContent && (
        <div className="memoire-item-desc">
          {entry.resume && (
            <p className="memoire-preview-resume">{entry.resume}</p>
          )}
          {entry.description && (
            <div className="memoire-preview-block">
              <span className="memoire-preview-label">Description</span>
              <p className="memoire-desc-readonly">{entry.description}</p>
            </div>
          )}
          {entry.effets && (
            <div className="memoire-preview-block">
              <span className="memoire-preview-label">Effets</span>
              <p className="memoire-desc-readonly">{entry.effets}</p>
            </div>
          )}
          {entry.modularite && (
            <div className="memoire-preview-block">
              <span className="memoire-preview-label">Modularité</span>
              <p className="memoire-desc-readonly">{entry.modularite}</p>
            </div>
          )}
          {entry.conditions && (
            <div className="memoire-preview-block">
              <span className="memoire-preview-label">Conditions</span>
              <p className="memoire-desc-readonly">{entry.conditions}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Grouper une liste par un champ
function groupBy(list, key) {
  const groups = {};
  list.forEach(item => {
    const g = item[key] || 'Autre';
    if (!groups[g]) groups[g] = [];
    groups[g].push(item);
  });
  return groups;
}

function TabMemoire() {
  const { character, updateCharacter } = useCharacter();
  const calc = useCharacterCalculations(character);
  const [expandedDescs, setExpandedDescs] = useState({});
  const [newItemNames, setNewItemNames] = useState({});
  const [newItemTexts, setNewItemTexts] = useState({});
  const [previewIds, setPreviewIds] = useState({}); // typeId → itemId sélectionné dans le select

  const memoireEntries = character.memoire || [];
  const sorts = character.sorts || [];
  const sortedSorts = [...sorts].sort((a, b) =>
    (a.nom || '').localeCompare(b.nom || '', 'fr', { sensitivity: 'base' })
  );
  const memoireMax = calc.memoire;
  const memoireDesSorts = calc.memoireDesSorts || 0;
  const sortsComptabilises = Math.max(0, sorts.length - memoireDesSorts);
  const memoireUsed = memoireEntries.length + sortsComptabilises;
  const magieActive = character.options?.magieActive || false;

  const entriesParType = {};
  DATA.typesMémoire.forEach(type => {
    entriesParType[type.id] = memoireEntries
      .map((entry, index) => {
        if (COMPENDIUM_TYPES.has(entry.typeId) && entry.sourceId) {
          // Résoudre depuis le compendium — rétroactif si les données changent
          const resolved = type.liste?.find(e => e.id === entry.sourceId);
          return resolved
            ? { ...resolved, typeId: entry.typeId, sourceId: entry.sourceId, index }
            : { typeId: entry.typeId, sourceId: entry.sourceId, nom: `[Introuvable #${entry.sourceId}]`, index };
        }
        return { ...entry, index };
      })
      .filter(entry => entry.typeId === type.id);
  });

  const handleAddFromList = (typeId) => {
    const type = DATA.typesMémoire.find(t => t.id === typeId);
    if (!type?.liste) return;
    const sourceId = Number(newItemNames[typeId]);
    if (!sourceId) return;
    updateCharacter(prev => ({
      ...prev,
      memoire: [...(prev.memoire || []), { typeId, sourceId }]
    }));
    setNewItemNames(prev => ({ ...prev, [typeId]: '' }));
    setPreviewIds(prev => ({ ...prev, [typeId]: null }));
  };

  const handleAddManual = (typeId) => {
    const nom = newItemTexts[typeId]?.trim();
    if (!nom) return;
    updateCharacter(prev => ({
      ...prev,
      memoire: [...(prev.memoire || []), { typeId, nom, description: '' }]
    }));
    setNewItemTexts(prev => ({ ...prev, [typeId]: '' }));
  };

  const handleAdd = (typeId) => {
    const type = DATA.typesMémoire.find(t => t.id === typeId);
    if (type?.liste) {
      handleAddFromList(typeId);
    } else {
      const nom = newItemNames[typeId]?.trim();
      if (!nom) return;
      updateCharacter(prev => ({
        ...prev,
        memoire: [...(prev.memoire || []), { typeId, nom, description: '' }]
      }));
      setNewItemNames(prev => ({ ...prev, [typeId]: '' }));
    }
  };

  const handleRemove = (index) => {
    const entry = memoireEntries[index];
    if (confirm(`Supprimer "${getEntryDisplayName(entry)}" ?`)) {
      updateCharacter(prev => ({
        ...prev,
        memoire: prev.memoire.filter((_, i) => i !== index)
      }));
    }
  };

  const toggleDesc = (key) => {
    setExpandedDescs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleDescChange = (index, description) => {
    updateCharacter(prev => ({
      ...prev,
      memoire: prev.memoire.map((entry, i) =>
        i === index ? { ...entry, description } : entry
      )
    }));
  };

  const handleSelectChange = (typeId, value, liste) => {
    setNewItemNames(prev => ({ ...prev, [typeId]: value }));
    const id = Number(value);
    const entry = liste?.find(e => e.id === id) || null;
    setPreviewIds(prev => ({ ...prev, [typeId]: entry }));
  };

  return (
    <div id="tab-memoire" className="tab-content active">
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Mémoire</h2>
          <div className={`memoire-counter ${memoireUsed > memoireMax ? 'over-budget' : ''}`}>
            {memoireUsed} / {memoireMax}
          </div>
        </div>

        <div className="memoire-container">
          {DATA.typesMémoire.filter(type => type.id !== 1 || magieActive).map(type => {
            // Type "Sort" : géré depuis l'onglet Magie
            if (type.id === 1) {
              return (
                <div key={type.id} className="memoire-section">
                  <div className="memoire-section-header">
                    <h3 className="memoire-section-title">{type.nom}</h3>
                    <span className="memoire-section-count">
                      ({sorts.length}{memoireDesSorts > 0 ? `, ${sortsComptabilises} en mémoire` : ''})
                    </span>
                  </div>
                  <div className="memoire-list">
                    {sorts.length === 0 ? (
                      <div className="memoire-empty">Aucun sort — gérez-les depuis l'onglet Magie</div>
                    ) : (
                      sortedSorts.map(sort => {
                        const isExpanded = expandedDescs[`sort_${sort.id}`] || false;
                        const hasDesc = sort.description && sort.description.trim() !== '';
                        return (
                          <div key={sort.id} className={`memoire-item ${isExpanded ? 'expanded' : ''}`}>
                            <div className="memoire-item-header">
                              <span className="memoire-nom">{sort.nom}</span>
                              {hasDesc && (
                                <div className="memoire-item-controls">
                                  <button
                                    className="btn-memoire-desc has-content"
                                    onClick={() => toggleDesc(`sort_${sort.id}`)}
                                    title="Description"
                                  >▾</button>
                                </div>
                              )}
                            </div>
                            {isExpanded && hasDesc && (
                              <div className="memoire-item-desc">
                                <p className="memoire-desc-readonly">{sort.description}</p>
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            }

            const isCompendium = COMPENDIUM_TYPES.has(type.id);

            return (
              <div key={type.id} className="memoire-section">
                <div className="memoire-section-header">
                  <h3 className="memoire-section-title">{type.nom}</h3>
                  <span className="memoire-section-count">({entriesParType[type.id].length})</span>
                </div>
                <div className="memoire-list">
                  {entriesParType[type.id].length === 0 ? (
                    <div className="memoire-empty">Aucune entrée</div>
                  ) : (
                    entriesParType[type.id].map(entry => {
                      const key = entry.index;
                      const isExpanded = expandedDescs[key] || false;

                      if (isCompendium) {
                        return (
                          <CompendiumListItem
                            key={key}
                            entry={entry}
                            isExpanded={isExpanded}
                            onToggle={() => toggleDesc(key)}
                            onRemove={() => handleRemove(key)}
                          />
                        );
                      }

                      // Entrée standard (textarea éditable)
                      const hasDesc = entry.description && entry.description.trim() !== '';
                      return (
                        <div key={key} className={`memoire-item ${isExpanded ? 'expanded' : ''}`}>
                          <div className="memoire-item-header">
                            <span className="memoire-nom">{entry.nom}</span>
                            <div className="memoire-item-controls">
                              <button
                                className={`btn-memoire-desc ${hasDesc ? 'has-content' : ''}`}
                                onClick={() => toggleDesc(key)}
                                title="Description"
                              >✎</button>
                              <button
                                className="btn-memoire-delete"
                                onClick={() => handleRemove(key)}
                                title="Supprimer"
                              >✕</button>
                            </div>
                          </div>
                          {isExpanded && (
                            <div className="memoire-item-desc">
                              <textarea
                                className="memoire-desc-input"
                                placeholder="Description..."
                                value={entry.description || ''}
                                onChange={(e) => handleDescChange(key, e.target.value)}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Zone d'ajout */}
                <div className="memoire-add">
                  {type.liste ? (
                    <>
                      <div className="memoire-add-row">
                        {isCompendium ? (
                          <select
                            className="memoire-input"
                            value={newItemNames[type.id] || ''}
                            onChange={(e) => handleSelectChange(type.id, e.target.value, type.liste)}
                          >
                            <option value="">— choisir —</option>
                            {Object.entries(groupBy(type.liste, 'type')).map(([grp, items]) => (
                              <optgroup key={grp} label={grp}>
                                {items.map(entry => (
                                  <option key={entry.id} value={entry.id}>
                                    {getEntryDisplayName(entry)}
                                    {entry.resume ? ` — ${entry.resume}` : ''}
                                  </option>
                                ))}
                              </optgroup>
                            ))}
                          </select>
                        ) : (
                          <select
                            className="memoire-input"
                            value={newItemNames[type.id] || ''}
                            onChange={(e) => setNewItemNames(prev => ({ ...prev, [type.id]: e.target.value }))}
                          >
                            <option value="">— choisir —</option>
                            {type.liste.map(entry => (
                              <option key={entry.id} value={entry.id}>{entry.nom}</option>
                            ))}
                          </select>
                        )}
                        <button
                          className="btn-memoire-add"
                          onClick={() => handleAddFromList(type.id)}
                          disabled={!newItemNames[type.id]}
                          title="Ajouter"
                        >+</button>
                      </div>

                      {/* Preview compendium */}
                      {isCompendium && previewIds[type.id] && (
                        <CompendiumPreview entry={previewIds[type.id]} />
                      )}

                      {/* Saisie manuelle */}
                      <div className="memoire-add-row">
                        <input
                          type="text"
                          className="memoire-input"
                          placeholder="Saisie manuelle..."
                          value={newItemTexts[type.id] || ''}
                          onChange={(e) => setNewItemTexts(prev => ({ ...prev, [type.id]: e.target.value }))}
                          onKeyPress={(e) => { if (e.key === 'Enter') handleAddManual(type.id); }}
                        />
                        <button
                          className="btn-memoire-add"
                          onClick={() => handleAddManual(type.id)}
                          title="Ajouter manuellement"
                        >+</button>
                      </div>
                    </>
                  ) : (
                    <div className="memoire-add-row">
                      <input
                        type="text"
                        className="memoire-input"
                        placeholder="Nouvelle entrée..."
                        value={newItemNames[type.id] || ''}
                        onChange={(e) => setNewItemNames(prev => ({ ...prev, [type.id]: e.target.value }))}
                        onKeyPress={(e) => { if (e.key === 'Enter') handleAdd(type.id); }}
                      />
                      <button
                        className="btn-memoire-add"
                        onClick={() => handleAdd(type.id)}
                        title="Ajouter"
                      >+</button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default TabMemoire;
