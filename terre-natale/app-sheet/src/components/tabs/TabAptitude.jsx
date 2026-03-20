import { useState } from 'react';
import { useCharacter } from '../../context/CharacterContext';
import { useCharacterCalculations } from '../../hooks/useCharacterCalculations';

const MAX_RANG_STYLE = 3;
const MAX_RANG_ENTREE = 6;
const COUT_GROUPE = [0, 10, 25, 45];
const COUT_COMP   = [0, 5, 10, 15, 25, 35, 50];

function xpStyle(style) {
  let xp = 0;
  const rg = style.rang || 0;
  for (let i = 1; i <= rg; i++) xp += COUT_GROUPE[i] || 0;
  (style.entries || []).forEach(entry => {
    const re = entry.rang || 0;
    for (let i = 1; i <= re; i++) xp += COUT_COMP[i] || 0;
  });
  return xp;
}

function TabAptitude() {
  const { character, updateCharacter } = useCharacter();
  const calc = useCharacterCalculations(character);
  const styles = character.aptitudes?.styles || [];
  const xpAptitudes = styles.reduce((sum, s) => sum + xpStyle(s), 0);

  const updateStyles = (newStyles) => {
    updateCharacter(prev => ({
      ...prev,
      aptitudes: { ...prev.aptitudes, styles: newStyles }
    }));
  };

  const addStyle = () => {
    const id = crypto.randomUUID();
    updateStyles([...styles, { id, nom: '', rang: 0, entries: [] }]);
  };

  const removeStyle = (id) => {
    if (!confirm('Supprimer cette aptitude ?')) return;
    updateStyles(styles.filter(s => s.id !== id));
  };

  const updateStyle = (id, field, value) => {
    updateStyles(styles.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const addEntry = (styleId) => {
    updateStyles(styles.map(s =>
      s.id === styleId
        ? { ...s, entries: [...(s.entries || []), { nom: '', rang: 0 }] }
        : s
    ));
  };

  const updateEntry = (styleId, idx, field, value) => {
    updateStyles(styles.map(s => {
      if (s.id !== styleId) return s;
      const entries = [...(s.entries || [])];
      entries[idx] = { ...entries[idx], [field]: field === 'rang' ? parseInt(value) : value };
      return { ...s, entries };
    }));
  };

  const removeEntry = (styleId, idx) => {
    updateStyles(styles.map(s => {
      if (s.id !== styleId) return s;
      const entries = [...(s.entries || [])];
      entries.splice(idx, 1);
      return { ...s, entries };
    }));
  };

  return (
    <div id="tab-aptitude" className="tab-content active">

      {/* Cartouche XP */}
      <section className="section xp-section">
        <div className="xp-summary-box">
          <div className="xp-summary-title">Aptitudes — Dépenses XP</div>
          <div className="xp-summary-content">
            <div className="xp-summary-row">
              <span className="xp-label">XP dépensés en Aptitudes</span>
              <span className="xp-value">{xpAptitudes}</span>
            </div>
            <div className={`xp-summary-row xp-rest-row ${calc.xpRestants < 0 ? 'over-budget' : ''}`}>
              <span className="xp-label">XP Restants (global)</span>
              <span className="xp-value xp-restant">{calc.xpRestants} / {calc.xpTotal}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section Styles */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Aptitudes</h2>
          <button className="btn-aptitude-add-style" onClick={addStyle}>+ Nouvelle aptitude</button>
        </div>

        <div className="competences-container">
          {styles.length === 0 && (
            <div className="comp-summary-empty">Aucune aptitude — cliquez sur « Nouvelle aptitude » pour commencer</div>
          )}
          {styles.map(style => {
            return (
              <div key={style.id} className="groupe-block open">
                <div className="groupe-header">
                  <div className="groupe-info">
                    <input
                      type="text"
                      className="aptitude-style-nom"
                      value={style.nom}
                      placeholder="Nom de l'aptitude…"
                      onClick={e => e.stopPropagation()}
                      onChange={e => updateStyle(style.id, 'nom', e.target.value)}
                    />
                  </div>
                  <div className="groupe-stats" onClick={e => e.stopPropagation()}>
                    <div className="groupe-rang">
                      <label>Rang</label>
                      <select
                        className="groupe-rang-select"
                        value={style.rang || 0}
                        onChange={e => updateStyle(style.id, 'rang', parseInt(e.target.value))}
                      >
                        {Array.from({ length: MAX_RANG_STYLE + 1 }, (_, i) => (
                          <option key={i} value={i}>{i}</option>
                        ))}
                      </select>
                    </div>
                    <button
                      className="btn-aptitude-remove-style"
                      onClick={() => removeStyle(style.id)}
                      title="Supprimer ce style"
                    >×</button>
                  </div>
                </div>

                <div className="competences-list">
                    {(style.entries || []).map((entry, idx) => (
                      <div key={idx} className="competence-item aptitude-entry">
                        <input
                          type="text"
                          className="aptitude-entry-nom"
                          value={entry.nom}
                          placeholder="Nom du style…"
                          onChange={e => updateEntry(style.id, idx, 'nom', e.target.value)}
                        />
                        <div className="competence-rang">
                          <select
                            className="competence-rang-select"
                            value={entry.rang || 0}
                            onChange={e => updateEntry(style.id, idx, 'rang', e.target.value)}
                          >
                            {Array.from({ length: MAX_RANG_ENTREE + 1 }, (_, i) => (
                              <option key={i} value={i}>{i}</option>
                            ))}
                          </select>
                        </div>
                        <button
                          className="btn-libre-remove"
                          onClick={() => removeEntry(style.id, idx)}
                          title="Supprimer"
                        >×</button>
                      </div>
                    ))}
                    <div className="aptitude-entry-add">
                      <button className="btn-libre-add" onClick={() => addEntry(style.id)}>+</button>
                      <span className="aptitude-entry-add-label">Ajouter un style</span>
                    </div>
                  </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default TabAptitude;
