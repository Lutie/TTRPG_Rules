import { useState, useMemo } from 'react';
import { useCharacter } from '../../context/CharacterContext';
import { useCharacterCalculations } from '../../hooks/useCharacterCalculations';
import DATA from '../../data';

// Types qui coûtent des PP en tant qu'avantages
const TYPES_AVANTAGE = ['avantage_majeur', 'avantage_archetype'];

// ─── Composant principal ──────────────────────────────────────────────────────

function TabTraits() {
  const { character, updateCharacter } = useCharacter();
  const calc = useCharacterCalculations(character);

  const [expandedTraits, setExpandedTraits] = useState({});
  const [modalType, setModalType] = useState(null); // null | 'avantage_majeur' | 'avantage_mineur' | 'desavantage'

  const characterTraits = character.traits || [];

  // Traits du personnage avec leurs infos complètes
  const traitsAvecInfos = useMemo(() =>
    characterTraits
      .map(ct => ({ ...ct, info: DATA.traits.find(t => t.id === ct.id) }))
      .filter(t => t.info),
    [characterTraits]
  );

  const avantagesMajeurs = traitsAvecInfos.filter(t => TYPES_AVANTAGE.includes(t.info.type));
  const avantagesMineurs = traitsAvecInfos.filter(t => t.info.type === 'avantage_mineur');
  const desavantages     = traitsAvecInfos.filter(t => t.info.type === 'desavantage');

  // Comptage des slots d'avantages mineurs (1 par avantage majeur avec ▣)
  const slotsMineurs = avantagesMajeurs.filter(t => t.info.avantage_mineur_bonus).length;

  // Avantages de caste
  const avantagesCaste = useMemo(() => {
    const result = [];
    const rangCaste = calc.rangCaste || 0;
    for (const level of DATA.casteProgression) {
      if (level.rang <= rangCaste && level.avantages) {
        level.avantages.forEach((av, i) => {
          result.push({ ...av, rang: level.rang, key: `caste-${level.rang}-${i}` });
        });
      }
    }
    return result;
  }, [calc.rangCaste]);

  const takenIds = useMemo(() => new Set(characterTraits.map(t => t.id)), [characterTraits]);

  // ── Actions ──

  const addTrait = (traitId) => {
    if (!traitId) return;
    const traitInfo = DATA.traits.find(t => t.id === traitId);
    if (!traitInfo) return;
    updateCharacter(prev => ({
      ...prev,
      traits: [...(prev.traits || []), { id: traitId, rang: 1 }]
    }));
    setModalType(null);
  };

  const removeTrait = (traitId) => {
    const info = DATA.traits.find(t => t.id === traitId);
    if (confirm(`Supprimer "${info?.nom || traitId}" ?`)) {
      updateCharacter(prev => ({
        ...prev,
        traits: (prev.traits || []).filter(t => t.id !== traitId)
      }));
      setExpandedTraits(prev => { const n = { ...prev }; delete n[traitId]; return n; });
    }
  };

  const updateRang = (traitId, newRang) => {
    updateCharacter(prev => ({
      ...prev,
      traits: (prev.traits || []).map(t => {
        if (t.id !== traitId) return t;
        const info = DATA.traits.find(ti => ti.id === traitId);
        const max = info?.rangMax || 1;
        return { ...t, rang: Math.max(1, Math.min(max, newRang)) };
      })
    }));
  };

  const toggleExpand = (id) => {
    setExpandedTraits(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAll = () => {
    const next = {};
    traitsAvecInfos.forEach(t => { next[t.id] = true; });
    avantagesCaste.forEach(av => { next[av.key] = true; });
    setExpandedTraits(next);
  };

  const collapseAll = () => setExpandedTraits({});

  return (
    <div id="tab-traits" className="tab-content active">

      {/* ── Résumé PP ── */}
      <section className="section xp-section">
        <div className="xp-summary-box pp-summary-box">
          <div className="xp-summary-title">Points de Personnage</div>
          <div className="xp-summary-content">
            <div className="xp-summary-row">
              <span className="xp-label">Départ ({character.infos?.destinee || 'Commun des Mortels'})</span>
              <span className="xp-value">{calc.ppDepart}</span>
            </div>
            <div className="xp-summary-row">
              <span className="xp-label">Désavantages</span>
              <span className="xp-value">+{calc.ppDesavantages}</span>
            </div>
            <div className="xp-summary-row">
              <span className="xp-label">Caste (rang {calc.rangCaste})</span>
              <span className="xp-value">+{calc.ppCaste}</span>
            </div>
            <div className="xp-summary-row xp-total-row">
              <span className="xp-label">Total disponible</span>
              <span className="xp-value">{calc.ppTotal}</span>
            </div>
            <div className={`xp-summary-row xp-rest-row ${calc.ppRestants < 0 ? 'over-budget' : ''}`}>
              <span className="xp-label">Dépensés / Restants</span>
              <span className="xp-value xp-restant">{calc.ppUtilises} / {calc.ppRestants}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section traits ── */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Traits du Personnage</h2>
          <div className="traits-actions">
            <button className="btn-traits-expand" onClick={expandAll} title="Tout déplier">▼ Tout</button>
            <button className="btn-traits-expand" onClick={collapseAll} title="Tout replier">▲ Tout</button>
          </div>
        </div>

        <div className="traits-container">

          {/* Avantages Majeurs */}
          <TraitSection
            title="Avantages Majeurs"
            typeClass="avantages"
            isEmpty={avantagesMajeurs.length === 0}
            emptyMsg="Aucun avantage majeur"
            onOpenModal={() => setModalType('avantage_majeur')}
            addLabel="Ajouter un avantage"
          >
            {avantagesMajeurs.map(t => (
              <TraitCard
                key={t.id}
                traitEntry={t}
                expandedTraits={expandedTraits}
                onToggle={toggleExpand}
                onRemove={removeTrait}
                onRangChange={updateRang}
              />
            ))}
          </TraitSection>

          {/* Avantages de Caste */}
          <div className="traits-section traits-caste">
            <h3 className="traits-section-title">Avantages de Caste</h3>
            <div className="traits-list">
              {avantagesCaste.length === 0 ? (
                <div className="traits-empty">Aucun avantage de caste (rang 0)</div>
              ) : avantagesCaste.map(av => {
                const isExpanded = expandedTraits[av.key] || false;
                return (
                  <div key={av.key} className={`trait-item ${isExpanded ? 'expanded' : ''} trait-caste`}>
                    <div className="trait-header">
                      <div className="trait-info">
                        <span className="trait-nom">{av.nom}</span>
                        <span className="trait-rang-caste">Rang {av.rang}</span>
                      </div>
                      <div className="trait-controls">
                        <button className="btn-trait-toggle" onClick={() => toggleExpand(av.key)}>
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
              })}
            </div>
          </div>

          {/* Avantages Mineurs */}
          <TraitSection
            title={
              <span>
                Avantages Mineurs
                {' '}
                <span className={`trait-slot-count ${avantagesMineurs.length > slotsMineurs ? 'over' : ''}`}>
                  ({avantagesMineurs.length} / {slotsMineurs} slots)
                </span>
              </span>
            }
            typeClass="avantages-mineurs"
            isEmpty={avantagesMineurs.length === 0}
            emptyMsg="Aucun avantage mineur"
            onOpenModal={slotsMineurs > avantagesMineurs.length ? () => setModalType('avantage_mineur') : null}
            addLabel="Choisir un avantage mineur"
          >
            {avantagesMineurs.map(t => (
              <TraitCard
                key={t.id}
                traitEntry={t}
                expandedTraits={expandedTraits}
                onToggle={toggleExpand}
                onRemove={removeTrait}
                onRangChange={updateRang}
              />
            ))}
          </TraitSection>

          {/* Désavantages */}
          <TraitSection
            title="Désavantages"
            typeClass="desavantages"
            isEmpty={desavantages.length === 0}
            emptyMsg="Aucun désavantage"
            onOpenModal={() => setModalType('desavantage')}
            addLabel="Ajouter un désavantage"
          >
            {desavantages.map(t => (
              <TraitCard
                key={t.id}
                traitEntry={t}
                expandedTraits={expandedTraits}
                onToggle={toggleExpand}
                onRemove={removeTrait}
                onRangChange={updateRang}
              />
            ))}
          </TraitSection>

        </div>
      </section>

      {/* ── Modale de sélection ── */}
      {modalType && (
        <SelectionModal
          type={modalType}
          takenIds={takenIds}
          onAdd={addTrait}
          onClose={() => setModalType(null)}
        />
      )}
    </div>
  );
}

// ─── Section générique avec bouton d'ajout ────────────────────────────────────

function TraitSection({ title, typeClass, isEmpty, emptyMsg, onOpenModal, addLabel, children }) {
  return (
    <div className={`traits-section traits-${typeClass}`}>
      <div className="traits-section-header">
        <h3 className="traits-section-title">{title}</h3>
        {onOpenModal && (
          <button className="btn-open-modal" onClick={onOpenModal}>+ {addLabel}</button>
        )}
      </div>
      <div className="traits-list">
        {isEmpty ? (
          <div className="traits-empty">{emptyMsg}</div>
        ) : children}
      </div>
    </div>
  );
}

// ─── Carte d'un trait dans la fiche ──────────────────────────────────────────

function TraitCard({ traitEntry, expandedTraits, onToggle, onRemove, onRangChange }) {
  const t = traitEntry.info;
  const isExpanded = expandedTraits[traitEntry.id] || false;
  const isDesavantage = t.type === 'desavantage';
  const isMineur = t.type === 'avantage_mineur';
  const coutTotal = t.coutPP * traitEntry.rang;

  return (
    <div className={`trait-item ${isExpanded ? 'expanded' : ''} trait-${t.type.replace(/_/g, '-')}`}>
      <div className="trait-header">
        <div className="trait-info">
          <span className="trait-nom">{t.nom}</span>
          {!isMineur && t.coutPP > 0 && (
            <span className={`trait-cout-badge ${isDesavantage ? 'badge-gain' : 'badge-cost'}`}>
              {isDesavantage ? `+${coutTotal}` : `${coutTotal}`} PP
            </span>
          )}
          {TYPES_AVANTAGE.includes(t.type) && t.avantage_mineur_bonus && (
            <span className="trait-bonus-badge" title="Inclut un avantage mineur gratuit">▣</span>
          )}
          {t.rangMax > 1 && (
            <div className="trait-rang-stepper">
              <button
                className="btn-rang-step"
                onClick={() => onRangChange(traitEntry.id, traitEntry.rang - 1)}
                disabled={traitEntry.rang <= 1}
              >−</button>
              <span className="trait-rang-value">
                Rang {traitEntry.rang}<span className="trait-rang-max">/{t.rangMax}</span>
              </span>
              <button
                className="btn-rang-step"
                onClick={() => onRangChange(traitEntry.id, traitEntry.rang + 1)}
                disabled={traitEntry.rang >= t.rangMax}
              >+</button>
            </div>
          )}
        </div>

        <div className="trait-tags-inline">
          {t.categories.slice(0, 2).map(c => (
            <span key={c} className="trait-tag tag-categorie">{c}</span>
          ))}
        </div>
        <div className="trait-controls">
          <button className="btn-trait-toggle" onClick={() => onToggle(traitEntry.id)}>
            {isExpanded ? '▲' : '▼'}
          </button>
          <button className="btn-trait-delete" onClick={() => onRemove(traitEntry.id)} title="Supprimer">
            ✕
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="trait-content">
          {t.description && (
            <p className="trait-description">{t.description}</p>
          )}

          {/* Métadonnées */}
          {(t.prerequis || t.conditions?.length > 0 || t.multiples_instances || t.limitation) && (
            <div className="trait-meta-block">
              {t.prerequis && (
                <span className="trait-meta"><strong>Prérequis :</strong> {t.prerequis}</span>
              )}
              {t.conditions?.length > 0 && (
                <span className="trait-meta">
                  <strong>Conditions :</strong> {t.conditions.join(' • ')}
                </span>
              )}
              {t.multiples_instances && (
                <span className="trait-meta">
                  <strong>Instances :</strong> {t.multiples_instances}
                </span>
              )}
              {t.limitation && (
                <span className="trait-meta"><strong>Limitation :</strong> {t.limitation}</span>
              )}
            </div>
          )}

          {/* Tags complets */}
          <div className="trait-tags-full">
            {t.sous_section && (
              <span className="trait-tag tag-extension">{t.sous_section}</span>
            )}
            {t.categories.map(c => (
              <span key={c} className="trait-tag tag-categorie">{c}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Modale de sélection de trait ────────────────────────────────────────────

const MODAL_TITLES = {
  avantage_majeur: 'Ajouter un avantage majeur',
  avantage_mineur: 'Choisir un avantage mineur (gratuit)',
  desavantage:     'Ajouter un désavantage',
};

const MAX_RESULTS = 80;

function SelectionModal({ type, takenIds, onAdd, onClose }) {
  const [search, setSearch]             = useState('');
  const [filterSS, setFilterSS]         = useState('');
  const [filterCat, setFilterCat]       = useState('');
  const [expandedId, setExpandedId]     = useState(null);

  // Pool selon le type ouvert
  const pool = useMemo(() =>
    DATA.traits.filter(t => {
      if (type === 'avantage_majeur') return TYPES_AVANTAGE.includes(t.type);
      return t.type === type;
    }),
    [type]
  );

  // Valeurs uniques pour les filtres
  const sousSections = useMemo(() =>
    [...new Set(pool.map(t => t.sous_section).filter(Boolean))].sort(),
    [pool]
  );
  const categories = useMemo(() =>
    [...new Set(pool.flatMap(t => t.categories))].sort(),
    [pool]
  );

  // Filtrage
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return pool.filter(t => {
      if (takenIds.has(t.id)) return false;
      if (filterSS  && t.sous_section !== filterSS)           return false;
      if (filterCat && !t.categories.includes(filterCat))    return false;
      if (q && !t.nom.toLowerCase().includes(q)
            && !t.description?.toLowerCase().includes(q))    return false;
      return true;
    });
  }, [pool, takenIds, search, filterSS, filterCat]);

  const displayed = filtered.slice(0, MAX_RESULTS);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content traits-modal-content" onClick={e => e.stopPropagation()}>

        <div className="modal-header">
          <h2 className="modal-title">{MODAL_TITLES[type] || 'Ajouter un trait'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="traits-modal-search">
          <input
            type="text"
            className="traits-search-input"
            placeholder="Rechercher par nom ou description…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            autoFocus
          />
          <div className="traits-filter-row">
            <select value={filterSS} onChange={e => setFilterSS(e.target.value)}>
              <option value="">— Extension —</option>
              {sousSections.map(ss => <option key={ss} value={ss}>{ss}</option>)}
            </select>
            <select value={filterCat} onChange={e => setFilterCat(e.target.value)}>
              <option value="">— Catégorie —</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="traits-modal-count">
            {filtered.length} résultat{filtered.length !== 1 ? 's' : ''}
            {filtered.length > MAX_RESULTS && ` (affichage limité à ${MAX_RESULTS})`}
          </div>
        </div>

        <div className="traits-results">
          {displayed.map(t => (
            <TraitResultItem
              key={t.id}
              trait={t}
              isExpanded={expandedId === t.id}
              onToggle={() => setExpandedId(expandedId === t.id ? null : t.id)}
              onAdd={() => onAdd(t.id)}
            />
          ))}
          {filtered.length === 0 && (
            <div className="traits-no-results">Aucun trait disponible avec ces critères.</div>
          )}
        </div>

      </div>
    </div>
  );
}

// ─── Ligne de résultat dans la modale ────────────────────────────────────────

function TraitResultItem({ trait, isExpanded, onToggle, onAdd }) {
  const isDesavantage = trait.type === 'desavantage';
  const isMineur      = trait.type === 'avantage_mineur';

  return (
    <div className={`trait-result-item ${isExpanded ? 'expanded' : ''}`}>
      <div className="trait-result-header">
        <div className="trait-result-name" onClick={onToggle}>
          <span className="trait-nom">{trait.nom}</span>
          {!isMineur && trait.coutPP > 0 && (
            <span className={`trait-cout-badge ${isDesavantage ? 'badge-gain' : 'badge-cost'}`}>
              {isDesavantage ? `+${trait.coutPP}` : trait.coutPP} PP
            </span>
          )}
          {trait.avantage_mineur_bonus && (
            <span className="trait-bonus-badge" title="Inclut un avantage mineur">▣</span>
          )}
          {trait.rangMax > 1 && (
            <span className="trait-rangmax-badge" title={`Jusqu'à ${trait.rangMax} rangs`}>
              ×{trait.rangMax}
            </span>
          )}
        </div>
        <div className="trait-result-tags">
          {trait.sous_section && (
            <span className="trait-tag tag-extension">{trait.sous_section}</span>
          )}
          {trait.categories.slice(0, 3).map(c => (
            <span key={c} className="trait-tag tag-categorie">{c}</span>
          ))}
        </div>
        <button
          className="btn-add-trait-modal"
          onClick={e => { e.stopPropagation(); onAdd(); }}
          title="Ajouter ce trait"
        >
          + Ajouter
        </button>
      </div>

      {isExpanded && (
        <div className="trait-result-detail">
          {trait.description && (
            <p className="trait-description">{trait.description}</p>
          )}
          <div className="trait-meta-block">
            {trait.prerequis && (
              <span className="trait-meta"><strong>Prérequis :</strong> {trait.prerequis}</span>
            )}
            {trait.conditions?.length > 0 && (
              <span className="trait-meta">
                <strong>Conditions :</strong> {trait.conditions.join(' • ')}
              </span>
            )}
            {trait.multiples_instances && (
              <span className="trait-meta">
                <strong>Instances multiples :</strong> {trait.multiples_instances}
              </span>
            )}
            {trait.limitation && (
              <span className="trait-meta"><strong>Limitation :</strong> {trait.limitation}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default TabTraits;
