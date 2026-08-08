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
  const sortedSorts = [...sorts].sort((a, b) =>
    (a.nom || '').localeCompare(b.nom || '', 'fr', { sensitivity: 'base' })
  );

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
          <div className="magie-carac-row magie-puissances">
            <CaracBoxSmall name="Puissance Invocatrice" value={formatMod(calc.puissanceInvocatrice)} desc="Effets d'invocation" />
            <CaracBoxSmall name="Puissance Soins/Dégâts" value={formatMod(calc.puissanceSoinsDegats)} desc="Effets de soins/dégâts" />
            <CaracBoxSmall name="Puissance Positive" value={formatMod(calc.puissancePositive)} desc="Enchantements positifs" />
            <CaracBoxSmall name="Puissance Négative" value={formatMod(calc.puissanceNegative)} desc="Enchantements négatifs" />
            <CaracBoxSmall name="Puissance Générique" value={formatMod(calc.puissanceGenerique)} desc="Tous les autres effets" />
          </div>
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
            sortedSorts.map(sort => {
              const isExpanded = expandedSorts[sort.id] || false;
              const difficulte = getEffectiveSortValue(sort, 'difficulte');
              const drain = getEffectiveSortValue(sort, 'drain');
              const ecole = getEffectiveSortValue(sort, 'ecole');
              const domaines = getEffectiveSortValue(sort, 'domaines');
              const description = getEffectiveSortValue(sort, 'description');
              const effets = getEffectiveSortValue(sort, 'effets');
              const domainesLabel = getDomaineLabels(domaines);
              const sortMeta = [ecole, domainesLabel].filter(Boolean).join(' · ');
              return (
                <div key={sort.id} className={`memoire-item ${isExpanded ? 'expanded' : ''}`}>
                  <div className="memoire-item-header" style={{ cursor: 'pointer' }} onClick={() => toggleSort(sort.id)}>
                    <span className="memoire-nom">
                      {sort.nom}
                      {sortMeta && <span className="sort-meta-inline"> — {sortMeta}</span>}
                    </span>
                    <div className="memoire-item-controls">
                      {difficulte && <span className="sort-badge">Diff {difficulte}</span>}
                      {drain && <span className="sort-badge">Drain {drain}</span>}
                      {sort.presetId && <span className="sort-badge sort-badge-preset" title="Lié au compendium">⚡</span>}
                      <span className="memoire-toggle-hint">{isExpanded ? '▲' : '▼'}</span>
                      <button className="btn-sort-cast" onClick={(e) => { e.stopPropagation(); setCastingSort(sort); }} title="Lancer le sort">✦</button>
                      <button className="btn-memoire-desc" onClick={(e) => { e.stopPropagation(); setEditingSort(sort); }} title="Modifier">✎</button>
                      <button className="btn-memoire-delete" onClick={(e) => { e.stopPropagation(); handleRemoveSort(sort.id); }} title="Supprimer">✕</button>
                    </div>
                  </div>
                  {isExpanded && (
                    <div className="memoire-item-desc">
                      {domainesLabel && <p className="sort-detail-line">Domaines : {domainesLabel}</p>}
                      {description && <p className="memoire-desc-readonly">{description}</p>}
                      {effets && effets.trim() && (
                        <div className="sort-effets">
                          <span className="sort-effets-title">Effets</span>
                          <ul className="sort-effets-list">
                            {effets.split('\n').filter(l => l.trim()).map((ligne, i) => (
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

// ─── Données ────────────────────────────────────────────────────────────────

const ECOLES = [
  "École d'Abjuration", "École d'Altération", "École de Bénédiction",
  "École de Conjuration", "École de Destruction", "École de Divination",
  "École d'Évocation", "École d'Invocation", "École de Malédiction",
  "École de Restauration",
];

const DOMAINES = [
  { emoji: '⚔️', nom: 'Acier' },   { emoji: '🌪️', nom: 'Air' },
  { emoji: '✡️', nom: 'Arcane' },  { emoji: '🌀', nom: 'Chaos' },
  { emoji: '⚜️', nom: 'Charme' },  { emoji: '⚕️', nom: 'Corps' },
  { emoji: '💧', nom: 'Eau' },     { emoji: '🧠', nom: 'Esprit' },
  { emoji: '🐗', nom: 'Faune' },   { emoji: '🔥', nom: 'Feu' },
  { emoji: '🌿', nom: 'Flore' },   { emoji: '⚡', nom: 'Foudre' },
  { emoji: '❄️', nom: 'Glace' },   { emoji: '🛡️', nom: 'Guerre' },
  { emoji: '🎭', nom: 'Illusion' }, { emoji: '🩸', nom: 'Impie' },
  { emoji: '⚖️', nom: 'Loi' },     { emoji: '☀️', nom: 'Lumière' },
  { emoji: '🔮', nom: 'Magie' },   { emoji: '🧩', nom: 'Mental' },
  { emoji: '☠️', nom: 'Mort' },    { emoji: '🪷', nom: 'Nature' },
  { emoji: '🌑', nom: 'Ombre' },   { emoji: '✨', nom: 'Sacré' },
  { emoji: '📚', nom: 'Savoir' },  { emoji: '🪨', nom: 'Terre' },
  { emoji: '☢️', nom: 'Toxique' }, { emoji: '💢', nom: 'Vide' },
  { emoji: '❤️', nom: 'Vie' },     { emoji: '👁️', nom: 'Vision' },
];

// ─── Helpers emoji ───────────────────────────────────────────────────────────

// Normalise un emoji vers la version avec variation-selector (U+FE0F) du composant.
// Nécessaire car all_spells.json stocke les emojis sans variation-selector.
function normalizeEmoji(emoji) {
  const stripped = emoji.replace(/️/g, '');
  const found = DOMAINES.find(d => d.emoji.replace(/️/g, '') === stripped);
  return found ? found.emoji : emoji;
}

function getDomaineLabels(domaines) {
  if (!domaines) return '';
  const values = Array.isArray(domaines)
    ? domaines
    : domaines.split(',').map(v => v.trim()).filter(Boolean);

  return values.map(value => {
    const stripped = value.replace(/️/g, '');
    const domaine = DOMAINES.find(d =>
      d.emoji === value ||
      d.emoji.replace(/️/g, '') === stripped ||
      d.nom === value
    );
    return domaine ? `${domaine.emoji} ${domaine.nom}` : null;
  }).filter(Boolean).join(', ');
}

// ─── Helpers preset ──────────────────────────────────────────────────────────

// Calcule la valeur d'un champ à partir d'un sort du compendium (toujours une string).
function computePresetStr(preset, field) {
  switch (field) {
    case 'difficulte': return preset.difficulty || '';
    case 'drain':      return preset.drain || '';
    case 'ecole':      return (preset.schools || [])[0] || '';
    case 'domaines':   return (preset.domains || []).map(normalizeEmoji).join(', ');
    case 'description': return preset.description || '';
    case 'effets': {
      const lines = (preset.words || [])
        .filter(w => w.description)
        .map(w => {
          const label = w.word_type ? `${w.name} (${w.word_type})` : w.name;
          const modif = w.magnitude_modifiers ? ` (${w.magnitude_modifiers})` : '';
          return `${label} : ${w.description}${modif}`;
        });
      if (preset.notes?.trim()) lines.push(preset.notes.trim());
      return lines.join('\n');
    }
    default: return '';
  }
}

// Valeur effective d'un champ : override manuel > preset live > valeur stockée (compat).
function getEffectiveSortValue(sort, field) {
  if (sort.overrides?.[field] !== undefined) return sort.overrides[field];
  if (sort.presetId) {
    const preset = ALL_SPELLS.find(s => s.id === sort.presetId);
    if (preset) return computePresetStr(preset, field);
  }
  return sort[field] ?? '';
}

// ─── SortModal ───────────────────────────────────────────────────────────────

function SortModal({ initialValues, onSave, onClose }) {
  const isEdit = !!initialValues;

  const [nom, setNom] = useState(initialValues?.nom || '');
  const [presetId, setPresetId] = useState(initialValues?.presetId ?? null);
  // overrides : champs modifiés manuellement (absent = suit le preset ou valeur initiale)
  const [overrides, setOverrides] = useState(initialValues?.overrides || {});

  const preset = presetId ? ALL_SPELLS.find(s => s.id === presetId) : null;

  // Valeur effective d'un champ dans le contexte modal
  const getField = (field) => {
    if (overrides[field] !== undefined) return overrides[field];
    if (preset) return computePresetStr(preset, field);
    return initialValues?.[field] ?? '';
  };

  // Version array pour le picker domaines
  const getDomainesArray = () => {
    const raw = overrides.domaines !== undefined
      ? overrides.domaines
      : preset
        ? (preset.domains || []).map(normalizeEmoji).join(', ')
        : initialValues?.domaines || '';
    return raw ? raw.split(',').map(s => s.trim()).filter(Boolean) : [];
  };

  const setField = (field, value) =>
    setOverrides(prev => ({ ...prev, [field]: value }));

  const clearField = (field) =>
    setOverrides(prev => { const o = { ...prev }; delete o[field]; return o; });

  const isOverridden = (field) => overrides[field] !== undefined;
  // Champ affiché depuis le preset (non overridé et preset actif)
  const fromPreset = (field) => !!preset && !isOverridden(field);
  // Peut-on reset vers le preset ?
  const canReset = (field) => !!preset && isOverridden(field);

  const handlePresetChange = (e) => {
    const id = parseInt(e.target.value) || null;
    const newPreset = id ? ALL_SPELLS.find(s => s.id === id) : null;
    setPresetId(id);
    setOverrides({});
    if (newPreset) setNom(newPreset.title || '');
  };

  const toggleDomaine = (emoji) => {
    const current = getDomainesArray();
    const next = current.includes(emoji)
      ? current.filter(x => x !== emoji)
      : [...current, emoji];
    setField('domaines', next.join(', '));
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleSubmit = () => {
    if (!nom.trim()) return;
    let data;
    if (presetId) {
      // Sort lié au compendium : on ne stocke que les overrides
      data = { nom: nom.trim(), presetId, overrides };
    } else {
      // Sort manuel : format classique (compatible avec les fiches existantes)
      const domainesArr = getDomainesArray();
      data = {
        nom: nom.trim(),
        difficulte: getField('difficulte'),
        drain: getField('drain'),
        ecole: getField('ecole'),
        domaines: domainesArr.join(', '),
        description: getField('description'),
        effets: getField('effets'),
      };
    }
    onSave(isEdit ? { ...initialValues, ...data } : data);
  };

  const currentDomaines = getDomainesArray();

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">{isEdit ? 'Modifier le sort' : 'Nouveau sort'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {/* Sélecteur de preset — toujours visible */}
          <div className="info-field">
            <label>Modèle (compendium)</label>
            <select className="info-input" value={presetId || ''} onChange={handlePresetChange}>
              <option value="">— Sort manuel —</option>
              {[...ALL_SPELLS].sort((a, b) => (a.title || '').localeCompare(b.title || '', 'fr')).map(spell => (
                <option key={spell.id} value={spell.id}>{spell.title}</option>
              ))}
            </select>
          </div>

          <div className="sort-modal-grid">
            {/* Nom — toujours manuel */}
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

            {/* École */}
            <SortField label="École" fromPreset={fromPreset('ecole')} canReset={canReset('ecole')} onReset={() => clearField('ecole')}>
              <select
                className={`info-input${fromPreset('ecole') ? ' sort-field-preset' : ''}`}
                value={getField('ecole')}
                onChange={(e) => setField('ecole', e.target.value)}
              >
                <option value="">— Aucune —</option>
                {ECOLES.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </SortField>

            {/* Difficulté */}
            <SortField label="Difficulté" fromPreset={fromPreset('difficulte')} canReset={canReset('difficulte')} onReset={() => clearField('difficulte')}>
              <input
                type="text"
                className={`info-input${fromPreset('difficulte') ? ' sort-field-preset' : ''}`}
                value={getField('difficulte')}
                onChange={(e) => setField('difficulte', e.target.value)}
              />
            </SortField>

            {/* Drain */}
            <SortField label="Drain" fromPreset={fromPreset('drain')} canReset={canReset('drain')} onReset={() => clearField('drain')}>
              <input
                type="text"
                className={`info-input${fromPreset('drain') ? ' sort-field-preset' : ''}`}
                value={getField('drain')}
                onChange={(e) => setField('drain', e.target.value)}
              />
            </SortField>

            {/* Domaines */}
            <div className="info-field sort-modal-full">
              <div className="sort-field-label-row">
                <label>Domaines</label>
                {fromPreset('domaines') && <span className="sort-preset-badge">preset</span>}
                {canReset('domaines') && (
                  <button className="btn-field-reset" onClick={() => clearField('domaines')} title="Revenir au preset">↺</button>
                )}
              </div>
              <div className={`domaines-picker${fromPreset('domaines') ? ' domaines-picker-preset' : ''}`}>
                {DOMAINES.map(d => (
                  <button
                    key={d.emoji}
                    type="button"
                    className={`domaine-btn${currentDomaines.includes(d.emoji) ? ' domaine-btn--selected' : ''}`}
                    onClick={() => toggleDomaine(d.emoji)}
                    title={d.nom}
                  >
                    {d.emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <SortField label="Description" className="sort-modal-full" fromPreset={fromPreset('description')} canReset={canReset('description')} onReset={() => clearField('description')}>
              <textarea
                className={`memoire-desc-input${fromPreset('description') ? ' sort-field-preset' : ''}`}
                placeholder="Description générale du sort..."
                value={getField('description')}
                onChange={(e) => setField('description', e.target.value)}
                rows={3}
              />
            </SortField>

            {/* Effets */}
            <SortField
              label={<>Effets <span className="sort-modal-hint">(une ligne par effet)</span></>}
              className="sort-modal-full"
              fromPreset={fromPreset('effets')}
              canReset={canReset('effets')}
              onReset={() => clearField('effets')}
            >
              <textarea
                className={`memoire-desc-input${fromPreset('effets') ? ' sort-field-preset' : ''}`}
                placeholder="Un effet par ligne..."
                value={getField('effets')}
                onChange={(e) => setField('effets', e.target.value)}
                rows={5}
              />
            </SortField>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Annuler</button>
          <button className="btn-primary" onClick={handleSubmit} disabled={!nom.trim()}>
            {isEdit ? 'Modifier' : 'Ajouter'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Wrapper de champ avec badge "preset" et bouton reset
function SortField({ label, children, fromPreset, canReset, onReset, className }) {
  return (
    <div className={`info-field${className ? ' ' + className : ''}`}>
      {(fromPreset || canReset) ? (
        <div className="sort-field-label-row">
          <label>{label}</label>
          {fromPreset && <span className="sort-preset-badge">preset</span>}
          {canReset && <button className="btn-field-reset" onClick={onReset} title="Revenir au preset">↺</button>}
        </div>
      ) : (
        <label>{label}</label>
      )}
      {children}
    </div>
  );
}

// ─── CastModal ───────────────────────────────────────────────────────────────

function CastModal({ sort, expertiseMagique, modTradition, onClose }) {
  const { character, updateCharacter } = useCharacter();
  const [niveau, setNiveau] = useState(0);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const baseDiff = parseInt(getEffectiveSortValue(sort, 'difficulte')) || 0;
  const baseDrain = parseInt(getEffectiveSortValue(sort, 'drain')) || 0;

  const difficulte = baseDiff + 2 * niveau;
  const drain = baseDrain + 2 * niveau - modTradition;
  const drainMin = 3 + niveau;
  const difficulteArcanique = 10 + 2 * niveau;
  const expertise = 10 + expertiseMagique + niveau;

  const pmActuelCurrent = character.ressources?.PM?.actuel || 0;
  const pmTempCurrent = character.ressources?.PM?.temporaire || 0;
  const drainExtra = Math.max(0, drain - drainMin);

  let previewPmActuel = pmActuelCurrent - drainMin;
  let previewPmTemp = pmTempCurrent;
  let previewSurDrainTemp = 0;

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

  const formatMod = (val) => val >= 0 ? `+${val}` : `${val}`;

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
          <button className="btn-primary" onClick={handleApplyDrain}>Appliquer le drain</button>
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
