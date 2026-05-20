import { useState } from 'react';
import { useCharacter } from '../../context/CharacterContext';
import { useCharacterCalculations } from '../../hooks/useCharacterCalculations';
import DATA from '../../data';
import Section from '../common/Section';
import ALL_SPELLS from '../../data/all_spells.json';

function TabMagie() {
  const { character, updateCharacter } = useCharacter();
  const calc = useCharacterCalculations(character);
  const [showSortModal, setShowSortModal] = useState(false);
  const [editingSort, setEditingSort] = useState(null);
  const [castingSort, setCastingSort] = useState(null);
  const [expandedSorts, setExpandedSorts] = useState({});

  const sorts = character.sorts || [];

  const handleAddSort = (sort) => {
    updateCharacter(prev => ({
      ...prev,
      sorts: [...(prev.sorts || []), { id: Date.now(), ...sort }]
    }));
    setShowSortModal(false);
  };

  const handleEditSort = (sort) => {
    updateCharacter(prev => ({
      ...prev,
      sorts: (prev.sorts || []).map(s => s.id === sort.id ? sort : s)
    }));
    setEditingSort(null);
  };

  const handleRemoveSort = (id) => {
    updateCharacter(prev => ({
      ...prev,
      sorts: (prev.sorts || []).filter(s => s.id !== id)
    }));
  };

  const toggleSort = (id) => {
    setExpandedSorts(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleTraditionChange = (traditionId) => {
    updateCharacter(prev => ({ ...prev, tradition: traditionId }));
  };

  const formatMod = (val) => val >= 0 ? `+${val}` : `${val}`;

  const tradition = DATA.traditions.find(t => t.id === character.tradition);

  return (
    <div id="tab-magie" className="tab-content active">
      {/* Tradition Magique */}
      <Section title="Tradition Magique">
        <div className="tradition-field">
          <label>Tradition Magique</label>
          <select
            value={character.tradition || ''}
            onChange={(e) => handleTraditionChange(e.target.value)}
          >
            <option value="">-- Aucune --</option>
            {DATA.traditions.map(trad => (
              <option key={trad.id} value={trad.id}>
                {trad.nom} ({trad.attribut})
              </option>
            ))}
          </select>
        </div>
      </Section>

      {/* Caractéristiques Magiques */}
      <Section title="Caractéristiques Magiques">
        <div className="magie-carac-section">
          {/* Puissances */}
          <div className="magie-carac-row magie-puissances">
            <CaracBoxSmall
              name="Puissance Invocatrice"
              value={formatMod(calc.puissanceInvocatrice)}
              desc="Effets d'invocation"
            />
            <CaracBoxSmall
              name="Puissance Soins/Dégâts"
              value={formatMod(calc.puissanceSoinsDegats)}
              desc="Effets de soins/dégâts"
            />
            <CaracBoxSmall
              name="Puissance Positive"
              value={formatMod(calc.puissancePositive)}
              desc="Enchantements positifs"
            />
            <CaracBoxSmall
              name="Puissance Négative"
              value={formatMod(calc.puissanceNegative)}
              desc="Enchantements négatifs"
            />
            <CaracBoxSmall
              name="Puissance Générique"
              value={formatMod(calc.puissanceGenerique)}
              desc="Tous les autres effets"
            />
          </div>

          {/* Autres caractéristiques */}
          <div className="caracteristiques-grid">
            <div className="carac-box">
              <span className="carac-name">Portée Magique</span>
              <span className="carac-value">{calc.porteeMagique} <small>m/c</small></span>
              <span className="carac-help" title="10 + mPER">ⓘ</span>
            </div>
            <div className="carac-box">
              <span className="carac-name">Temps d'Incantation</span>
              <span className="carac-value">{formatMod(-calc.tempsIncantation)}</span>
              <span className="carac-help" title="-mDEX">ⓘ</span>
            </div>
            <div className="carac-box">
              <span className="carac-name">Expertise Magique</span>
              <span className="carac-value">{formatMod(calc.expertiseMagique)}</span>
              <span className="carac-help" title={`mAttr Tradition (${calc.attrTradition || '?'})`}>ⓘ</span>
            </div>
            <div className="carac-box">
              <span className="carac-name">Résistance au Drain</span>
              <span className="carac-value">{calc.resistanceDrain}</span>
              <span className="carac-help" title={`mAttr Tradition (${calc.attrTradition || '?'})`}>ⓘ</span>
            </div>
          </div>
        </div>
      </Section>

      {/* Sorts */}
      <Section title="Sorts">
        <div className="memoire-list">
          {sorts.length === 0 ? (
            <div className="memoire-empty">Aucun sort</div>
          ) : (
            sorts.map(sort => {
              const isExpanded = expandedSorts[sort.id] || false;
              return (
                <div key={sort.id} className={`memoire-item ${isExpanded ? 'expanded' : ''}`}>
                  <div className="memoire-item-header" style={{ cursor: 'pointer' }} onClick={() => toggleSort(sort.id)}>
                    <span className="memoire-nom">
                      {sort.nom}
                      {sort.ecole && <span className="sort-meta-inline"> — {sort.ecole}</span>}
                    </span>
                    <div className="memoire-item-controls">
                      {sort.difficulte && <span className="sort-badge">Diff {sort.difficulte}</span>}
                      {sort.drain && <span className="sort-badge">Drain {sort.drain}</span>}
                      <span className="memoire-toggle-hint">{isExpanded ? '▲' : '▼'}</span>
                      <button
                        className="btn-sort-cast"
                        onClick={(e) => { e.stopPropagation(); setCastingSort(sort); }}
                        title="Lancer le sort"
                      >✦</button>
                      <button
                        className="btn-memoire-desc"
                        onClick={(e) => { e.stopPropagation(); setEditingSort(sort); }}
                        title="Modifier"
                      >✎</button>
                      <button
                        className="btn-memoire-delete"
                        onClick={(e) => { e.stopPropagation(); handleRemoveSort(sort.id); }}
                        title="Supprimer"
                      >✕</button>
                    </div>
                  </div>
                  {isExpanded && (
                    <div className="memoire-item-desc">
                      {sort.domaines && <p className="sort-detail-line">Domaines : {sort.domaines}</p>}
                      {sort.description && (
                        <p className="memoire-desc-readonly">{sort.description}</p>
                      )}
                      {sort.effets && sort.effets.trim() && (
                        <div className="sort-effets">
                          <span className="sort-effets-title">Effets</span>
                          <ul className="sort-effets-list">
                            {sort.effets.split('\n').filter(l => l.trim()).map((ligne, i) => (
                              <li key={i}>{ligne}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
        <div className="memoire-add">
          <button className="btn-memoire-add" onClick={() => setShowSortModal(true)} title="Ajouter un sort">+</button>
        </div>
      </Section>

      {/* Modales */}
      {showSortModal && (
        <SortModal onSave={handleAddSort} onClose={() => setShowSortModal(false)} />
      )}
      {editingSort && (
        <SortModal initialValues={editingSort} onSave={handleEditSort} onClose={() => setEditingSort(null)} />
      )}
      {castingSort && (
        <CastModal sort={castingSort} expertiseMagique={calc.expertiseMagique} modTradition={calc.modTradition} onClose={() => setCastingSort(null)} />
      )}
    </div>
  );
}

function SortModal({ initialValues, onSave, onClose }) {
  const isEdit = !!initialValues;
  const [nom, setNom] = useState(initialValues?.nom || '');
  const [difficulte, setDifficulte] = useState(initialValues?.difficulte || '');
  const [drain, setDrain] = useState(initialValues?.drain || '');
  const [ecole, setEcole] = useState(initialValues?.ecole || '');
  const [domaines, setDomaines] = useState(initialValues?.domaines || '');
  const [description, setDescription] = useState(initialValues?.description || '');
  const [effets, setEffets] = useState(initialValues?.effets || '');

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handlePickSpell = (e) => {
    const id = parseInt(e.target.value);
    if (!id) return;
    const spell = ALL_SPELLS.find(s => s.id === id);
    if (!spell) return;
    setNom(spell.title || '');
    setDifficulte(spell.difficulty || '');
    setDrain(spell.drain || '');
    setEcole((spell.schools || []).join(', '));
    setDomaines((spell.domains || []).join(', '));
    setDescription(spell.description || '');

    // Effets : une ligne par mot, puis les notes
    const lignesEffets = (spell.words || [])
      .filter(w => w.description)
      .map(w => {
        const label = w.word_type ? `${w.name} (${w.word_type})` : w.name;
        const modif = w.magnitude_modifiers ? ` (${w.magnitude_modifiers})` : '';
        return `${label} : ${w.description}${modif}`;
      });
    if (spell.notes && spell.notes.trim()) lignesEffets.push(spell.notes.trim());
    setEffets(lignesEffets.join('\n'));
  };

  const handleSubmit = () => {
    if (!nom.trim()) return;
    const data = { nom: nom.trim(), difficulte, drain, ecole, domaines, description, effets };
    onSave(isEdit ? { ...initialValues, ...data } : data);
  };

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">{isEdit ? 'Modifier le sort' : 'Nouveau sort'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {!isEdit && <div className="info-field">
            <label>Importer depuis le compendium</label>
            <select className="info-input" defaultValue="" onChange={handlePickSpell}>
              <option value="">— choisir un sort —</option>
              {[...ALL_SPELLS].sort((a, b) => (a.title || '').localeCompare(b.title || '', 'fr')).map(spell => (
                <option key={spell.id} value={spell.id}>{spell.title}</option>
              ))}
            </select>
          </div>}
          <div className="sort-modal-grid">
            <div className="info-field">
              <label>Nom</label>
              <input
                type="text"
                className="info-input"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                autoFocus
              />
            </div>
            <div className="info-field">
              <label>École</label>
              <input
                type="text"
                className="info-input"
                value={ecole}
                onChange={(e) => setEcole(e.target.value)}
              />
            </div>
            <div className="info-field">
              <label>Difficulté</label>
              <input
                type="text"
                className="info-input"
                value={difficulte}
                onChange={(e) => setDifficulte(e.target.value)}
              />
            </div>
            <div className="info-field">
              <label>Drain</label>
              <input
                type="text"
                className="info-input"
                value={drain}
                onChange={(e) => setDrain(e.target.value)}
              />
            </div>
            <div className="info-field sort-modal-full">
              <label>Domaines</label>
              <input
                type="text"
                className="info-input"
                value={domaines}
                onChange={(e) => setDomaines(e.target.value)}
                placeholder="ex: ❄, 🔥"
              />
            </div>
            <div className="info-field sort-modal-full">
              <label>Description</label>
              <textarea
                className="memoire-desc-input"
                placeholder="Description générale du sort..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div className="info-field sort-modal-full">
              <label>Effets <span className="sort-modal-hint">(une ligne par effet)</span></label>
              <textarea
                className="memoire-desc-input"
                placeholder="Un effet par ligne..."
                value={effets}
                onChange={(e) => setEffets(e.target.value)}
                rows={5}
              />
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Annuler</button>
          <button className="btn-primary" onClick={handleSubmit} disabled={!nom.trim()}>{isEdit ? 'Modifier' : 'Ajouter'}</button>
        </div>
      </div>
    </div>
  );
}

function CastModal({ sort, expertiseMagique, modTradition, onClose }) {
  const { character, updateCharacter } = useCharacter();
  const [niveau, setNiveau] = useState(0);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const baseDiff = parseInt(sort.difficulte) || 0;
  const baseDrain = parseInt(sort.drain) || 0;

  const difficulte = baseDiff + 2 * niveau;
  const drain = baseDrain + 2 * niveau - modTradition;
  const drainMin = 3 + niveau;
  const difficulteArcanique = 10 + 2 * niveau;
  const expertise = 10 + expertiseMagique + niveau;

  // Preview du drain optimisé
  const pmActuelCurrent = character.ressources?.PM?.actuel || 0;
  const pmTempCurrent = character.ressources?.PM?.temporaire || 0;
  const drainExtra = Math.max(0, drain - drainMin);

  let previewPmActuel = pmActuelCurrent - drainMin;
  let previewPmTemp = pmTempCurrent;
  let previewSurDrainTemp = 0; // ce qui est pris sur le temp

  if (previewPmTemp >= drainExtra) {
    previewPmTemp -= drainExtra;
    previewSurDrainTemp = drainExtra;
  } else {
    previewSurDrainTemp = previewPmTemp;
    const remaining = drainExtra - previewPmTemp;
    previewPmTemp = 0;
    previewPmActuel -= remaining;
  }

  const surcharge = previewPmActuel < 0 ? -previewPmActuel : 0;
  if (surcharge > 0) previewPmActuel = 0;

  const handleApplyDrain = () => {
    updateCharacter(prev => {
      const pm = prev.ressources?.PM || { actuel: 0, temporaire: 0 };
      let pmActuel = (pm.actuel || 0) - drainMin;
      let pmTemp = pm.temporaire || 0;

      if (pmTemp >= drainExtra) {
        pmTemp -= drainExtra;
      } else {
        pmActuel -= (drainExtra - pmTemp);
        pmTemp = 0;
      }

      const deficit = pmActuel < 0 ? -pmActuel : 0;
      if (deficit > 0) pmActuel = 0;

      const pv = prev.ressources?.PV || { actuel: 0 };
      const ps = prev.ressources?.PS || { actuel: 0 };

      return {
        ...prev,
        ressources: {
          ...prev.ressources,
          PM: { ...pm, actuel: pmActuel, temporaire: pmTemp },
          ...(deficit > 0 ? {
            PV: { ...pv, actuel: (pv.actuel || 0) - deficit },
            PS: { ...ps, actuel: (ps.actuel || 0) - deficit },
          } : {})
        }
      };
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className="modal-content cast-modal">
        <div className="modal-header">
          <h2 className="modal-title">✦ {sort.nom}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="cast-niveau-row">
            <label className="cast-niveau-label">Niveau</label>
            <button className="cast-niveau-btn" onClick={() => setNiveau(n => Math.max(0, n - 1))}>−</button>
            <span className="cast-niveau-value">{niveau}</span>
            <button className="cast-niveau-btn" onClick={() => setNiveau(n => n + 1)}>+</button>
          </div>
          <div className="cast-stats-grid">
            <div className="cast-stat">
              <span className="cast-stat-label">Difficulté du sort</span>
              <span className="cast-stat-value">{difficulte}</span>
              <span className="cast-stat-detail">{baseDiff} + 2×{niveau}</span>
            </div>
            <div className="cast-stat">
              <span className="cast-stat-label">Drain du sort</span>
              <span className="cast-stat-value">{drain}</span>
              <span className="cast-stat-detail">{baseDrain} + 2×{niveau} − mTrad {modTradition >= 0 ? `+${modTradition}` : modTradition}</span>
            </div>
            <div className="cast-stat">
              <span className="cast-stat-label">Drain minimum</span>
              <span className="cast-stat-value">{drainMin}</span>
              <span className="cast-stat-detail">3 + {niveau}</span>
            </div>
            <div className="cast-stat">
              <span className="cast-stat-label">Difficulté arcanique</span>
              <span className="cast-stat-value">{difficulteArcanique}</span>
              <span className="cast-stat-detail">10 + 2×{niveau}</span>
            </div>
            <div className="cast-stat cast-stat-highlight">
              <span className="cast-stat-label">Expertise magique</span>
              <span className="cast-stat-value">{expertise}</span>
              <span className="cast-stat-detail">10 + {expertiseMagique >= 0 ? `+${expertiseMagique}` : expertiseMagique} + {niveau}</span>
            </div>
          </div>

          <div className="cast-drain-preview">
            <div className="cast-drain-preview-title">Drain optimisé</div>
            <div className="cast-drain-preview-rows">
              <div className="cast-drain-row">
                <span>PM permanent</span>
                <span className="cast-drain-val">{pmActuelCurrent} → {previewPmActuel}</span>
                <span className="cast-drain-detail">−{drainMin} (min)</span>
              </div>
              {drainExtra > 0 && (
                <div className="cast-drain-row">
                  <span>PM temporaire</span>
                  <span className="cast-drain-val">{pmTempCurrent} → {previewPmTemp}</span>
                  <span className="cast-drain-detail">−{previewSurDrainTemp} (surplus){previewSurDrainTemp < drainExtra ? `, reste −${drainExtra - previewSurDrainTemp} sur PM` : ''}</span>
                </div>
              )}
              {surcharge > 0 && (
                <div className="cast-drain-row cast-drain-surcharge">
                  <span>Surcharge</span>
                  <span className="cast-drain-val">−{surcharge} PV & PS</span>
                  <span className="cast-drain-detail">mana insuffisant</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Fermer</button>
          <button className="btn-primary" onClick={handleApplyDrain}>
            Appliquer le drain
          </button>
        </div>
      </div>
    </div>
  );
}

function CaracBoxSmall({ name, value, desc }) {
  return (
    <div className="carac-box carac-box-small">
      <span className="carac-name">{name}</span>
      <span className="carac-value">{value}</span>
      <span className="carac-desc">{desc}</span>
    </div>
  );
}

export default TabMagie;
