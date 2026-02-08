import { useState } from 'react';
import { useCharacter } from '../../context/CharacterContext';
import { useCharacterCalculations } from '../../hooks/useCharacterCalculations';
import DATA from '../../data';

function TabMemoire() {
  const { character, updateCharacter } = useCharacter();
  const calc = useCharacterCalculations(character);
  const [expandedDescs, setExpandedDescs] = useState({});
  const [newItemNames, setNewItemNames] = useState({});

  const memoireEntries = character.memoire || [];
  const memoireMax = calc.memoire;
  const memoireUsed = memoireEntries.length;

  // Grouper les entrées par type
  const entriesParType = {};
  DATA.typesMémoire.forEach(type => {
    entriesParType[type.id] = memoireEntries
      .map((entry, index) => ({ ...entry, index }))
      .filter(entry => entry.typeId === type.id);
  });

  const handleAdd = (typeId) => {
    const nom = newItemNames[typeId]?.trim();
    if (!nom) return;

    updateCharacter(prev => ({
      ...prev,
      memoire: [...(prev.memoire || []), { typeId, nom, description: '' }]
    }));

    setNewItemNames(prev => ({ ...prev, [typeId]: '' }));
  };

  const handleRemove = (index) => {
    const entry = memoireEntries[index];
    if (confirm(`Supprimer "${entry.nom}" ?`)) {
      updateCharacter(prev => ({
        ...prev,
        memoire: prev.memoire.filter((_, i) => i !== index)
      }));
      setExpandedDescs(prev => {
        const newExpanded = { ...prev };
        delete newExpanded[index];
        return newExpanded;
      });
    }
  };

  const toggleDesc = (index) => {
    setExpandedDescs(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleDescChange = (index, description) => {
    updateCharacter(prev => ({
      ...prev,
      memoire: prev.memoire.map((entry, i) =>
        i === index ? { ...entry, description } : entry
      )
    }));
  };

  const handleInputChange = (typeId, value) => {
    setNewItemNames(prev => ({ ...prev, [typeId]: value }));
  };

  const handleKeyPress = (e, typeId) => {
    if (e.key === 'Enter') {
      handleAdd(typeId);
    }
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
          {DATA.typesMémoire.map(type => (
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
                    const isExpanded = expandedDescs[entry.index] || false;
                    const hasDesc = entry.description && entry.description.trim() !== '';
                    return (
                      <div
                        key={entry.index}
                        className={`memoire-item ${isExpanded ? 'expanded' : ''}`}
                      >
                        <div className="memoire-item-header">
                          <span className="memoire-nom">{entry.nom}</span>
                          <div className="memoire-item-controls">
                            <button
                              className={`btn-memoire-desc ${hasDesc ? 'has-content' : ''}`}
                              onClick={() => toggleDesc(entry.index)}
                              title="Description"
                            >
                              ✎
                            </button>
                            <button
                              className="btn-memoire-delete"
                              onClick={() => handleRemove(entry.index)}
                              title="Supprimer"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                        {isExpanded && (
                          <div className="memoire-item-desc">
                            <textarea
                              className="memoire-desc-input"
                              placeholder="Description..."
                              value={entry.description || ''}
                              onChange={(e) => handleDescChange(entry.index, e.target.value)}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
              <div className="memoire-add">
                <input
                  type="text"
                  className="memoire-input"
                  placeholder="Nouvelle entrée..."
                  value={newItemNames[type.id] || ''}
                  onChange={(e) => handleInputChange(type.id, e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, type.id)}
                />
                <button
                  className="btn-memoire-add"
                  onClick={() => handleAdd(type.id)}
                  title="Ajouter"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default TabMemoire;
