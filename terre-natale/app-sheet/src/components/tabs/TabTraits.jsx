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
  const [customForm, setCustomForm] = useState(null); // null | { type: 'avantage_majeur'|'desavantage' }

  const characterTraits = character.traits || [];

  // Traits du personnage avec leurs infos complètes + index dans le tableau source
  const traitsAvecInfos = useMemo(() =>
    characterTraits
      .map((ct, index) => ({
        ...ct,
        _index: index,
        info: ct.custom ? ct : DATA.traits.find(t => t.id === ct.id),
      }))
      .filter(t => t.info),
    [characterTraits]
  );

  // Options disponibles par type de choix
  const choixOptions = useMemo(() => ({
    attribut_principal: DATA.attributsPrincipaux.map(a => ({ id: a.id, label: `${a.nom} (${a.id})` })),
  }), []);

  // Traits normaux (sans choix) déjà pris
  const takenIds = useMemo(() => new Set(
    characterTraits
      .filter(ct => !DATA.traits.find(t => t.id === ct.id)?.choix)
      .map(ct => ct.id)
  ), [characterTraits]);

  // Choix déjà assignés par trait (id → Set de valeurs de choix)
  const takenChoixPerTrait = useMemo(() => {
    const map = {};
    characterTraits.forEach(ct => {
      const info = DATA.traits.find(t => t.id === ct.id);
      if (info?.choix && ct.choix) {
        if (!map[ct.id]) map[ct.id] = new Set();
        map[ct.id].add(ct.choix);
      }
    });
    return map;
  }, [characterTraits]);

  const avantagesMajeurs = traitsAvecInfos.filter(t => TYPES_AVANTAGE.includes(t.info.type));
  const avantagesMineurs = traitsAvecInfos.filter(t => t.info.type === 'avantage_mineur');
  const desavantages     = traitsAvecInfos.filter(t => t.info.type === 'desavantage');

  const ethnie = useMemo(() =>
    DATA.ethnies.find(e => e.id === character.infos?.ethnicity),
    [character.infos?.ethnicity]
  );

  const particuliaritesOrigine = useMemo(() => {
    if (!ethnie) return [];
    const naissance   = (ethnie.particularites_naissance   || []).map(p => ({ ...p, categorie: 'Naissance' }));
    const culturelles = (ethnie.particularites_culturelles || []).map(p => ({ ...p, categorie: 'Culturelle' }));
    return [...naissance, ...culturelles];
  }, [ethnie]);

  // Comptage des slots d'avantages mineurs (1 par avantage majeur avec ▣)
  const slotsMineurs = avantagesMajeurs.filter(t => t.info.avantage_mineur_bonus).length;

  // Avantages de caste
  const avantagesCaste = useMemo(() => {
    const rangCaste = calc.rangCaste || 0;
    const all = [];
    for (const level of DATA.casteProgression) {
      if (level.rang <= rangCaste && level.avantages) {
        level.avantages.forEach((av, i) => {
          all.push({ ...av, rang: level.rang, key: `caste-${level.rang}-${i}` });
        });
      }
    }
    // Les avantages dont le nom se termine par " N" ou " (N)" sont des séries :
    // seul le rang de caste le plus élevé débloqué est conservé, en remplaçant
    // l'entrée à sa position d'origine pour ne pas perturber l'ordre d'affichage.
    const getCanon = (nom) => nom.replace(/ \(\d+\)$/, '').replace(/ \d+$/, '');
    const seriesMap = new Map();
    const result = [];
    for (const av of all) {
      const canon = getCanon(av.nom);
      if (canon !== av.nom) {
        const existing = seriesMap.get(canon);
        if (!existing) {
          seriesMap.set(canon, { av, idx: result.length });
          result.push(av);
        } else if (av.rang > existing.av.rang) {
          result[existing.idx] = av;
          existing.av = av;
        }
      } else {
        result.push(av);
      }
    }
    return result;
  }, [calc.rangCaste]);

  // ── Actions ──

  const addTrait = (traitId) => {
    if (!traitId) return;
    updateCharacter(prev => ({
      ...prev,
      traits: [...(prev.traits || []), { id: traitId, rang: 1 }]
    }));
    setModalType(null);
  };

  const addCustomTrait = ({ nom, type, coutPP, rangMax }) => {
    if (!nom.trim()) return;
    updateCharacter(prev => ({
      ...prev,
      traits: [...(prev.traits || []), {
        id: crypto.randomUUID(),
        custom: true,
        nom: nom.trim(),
        type,
        coutPP,
        rangMax,
        rang: 1,
        categories: [],
      }]
    }));
    setCustomForm(null);
  };

  const updateCustomTrait = (index, fields) => {
    updateCharacter(prev => ({
      ...prev,
      traits: (prev.traits || []).map((t, i) => i === index ? { ...t, ...fields } : t)
    }));
  };

  const updateChoix = (index, choix) => {
    updateCharacter(prev => ({
      ...prev,
      traits: (prev.traits || []).map((t, i) =>
        i === index ? { ...t, choix: choix || undefined } : t
      )
    }));
  };

  const removeTrait = (index) => {
    const entry = characterTraits[index];
    const info = DATA.traits.find(t => t.id === entry?.id);
    const nomAffiche = info ? (info.choix && entry.choix ? `${info.nom} (${entry.choix})` : info.nom) : entry?.id;
    if (confirm(`Supprimer "${nomAffiche}" ?`)) {
      updateCharacter(prev => ({
        ...prev,
        traits: (prev.traits || []).filter((_, i) => i !== index)
      }));
      setExpandedTraits(prev => { const n = { ...prev }; delete n[index]; return n; });
    }
  };

  const updateRang = (index, newRang) => {
    updateCharacter(prev => ({
      ...prev,
      traits: (prev.traits || []).map((t, i) => {
        if (i !== index) return t;
        const info = DATA.traits.find(ti => ti.id === t.id);
        const max = info?.rangMax || 1;
        return { ...t, rang: Math.max(1, Math.min(max, newRang)) };
      })
    }));
  };

  const toggleExpand = (id) => {
    setExpandedTraits(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const isParticuliariteActive = (anchor) => {
    const info = DATA.particularites?.[anchor];
    const defaultActive = !info?.coutPP;
    return character.particuliaritesActives?.[anchor] ?? defaultActive;
  };

  const toggleParticuliariteActive = (anchor) => {
    const current = isParticuliariteActive(anchor);
    updateCharacter(prev => ({
      ...prev,
      particuliaritesActives: { ...(prev.particuliaritesActives || {}), [anchor]: !current }
    }));
  };

  const expandAll = () => {
    const next = {};
    traitsAvecInfos.forEach(t => { next[t._index] = true; });
    avantagesCaste.forEach(av => { next[av.key] = true; });
    particuliaritesOrigine.forEach((_, i) => { next[`part-${i}`] = true; });
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
              <span className="xp-label">Départ ({DATA.destinees.find(d => d.id === character.infos?.destiny)?.nom || 'Commun des Mortels'})</span>
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
            onAddCustom={() => setCustomForm({ type: 'avantage_majeur' })}
          >
            {avantagesMajeurs.map(t => t.custom ? (
              <CustomTraitCard
                key={t._index}
                traitEntry={t}
                expandedTraits={expandedTraits}
                onToggle={toggleExpand}
                onRemove={removeTrait}
                onRangChange={updateRang}
                onUpdate={updateCustomTrait}
              />
            ) : (
              <TraitCard
                key={t._index}
                traitEntry={t}
                expandedTraits={expandedTraits}
                onToggle={toggleExpand}
                onRemove={removeTrait}
                onRangChange={updateRang}
                onChoixChange={updateChoix}
                choixOptions={choixOptions}
                takenChoixPerTrait={takenChoixPerTrait}
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

          {/* Particularités d'origine */}
          {particuliaritesOrigine.length > 0 && (
            <div className="traits-section traits-origine">
              <div className="traits-section-header">
                <h3 className="traits-section-title">
                  Particularités liées à l'origine
                  <span className="traits-section-subtitle"> — {ethnie.nom}</span>
                </h3>
              </div>
              <div className="traits-list">
                {particuliaritesOrigine.map((p, i) => (
                  <ParticuliariteCard
                    key={i}
                    index={i}
                    particuliarite={p}
                    expandedTraits={expandedTraits}
                    onToggle={toggleExpand}
                    isActive={isParticuliariteActive(p.anchor)}
                    onToggleActive={() => toggleParticuliariteActive(p.anchor)}
                  />
                ))}
              </div>
            </div>
          )}

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
                key={t._index}
                traitEntry={t}
                expandedTraits={expandedTraits}
                onToggle={toggleExpand}
                onRemove={removeTrait}
                onRangChange={updateRang}
                onChoixChange={updateChoix}
                choixOptions={choixOptions}
                takenChoixPerTrait={takenChoixPerTrait}
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
            onAddCustom={() => setCustomForm({ type: 'desavantage' })}
          >
            {desavantages.map(t => t.custom ? (
              <CustomTraitCard
                key={t._index}
                traitEntry={t}
                expandedTraits={expandedTraits}
                onToggle={toggleExpand}
                onRemove={removeTrait}
                onRangChange={updateRang}
                onUpdate={updateCustomTrait}
              />
            ) : (
              <TraitCard
                key={t._index}
                traitEntry={t}
                expandedTraits={expandedTraits}
                onToggle={toggleExpand}
                onRemove={removeTrait}
                onRangChange={updateRang}
                onChoixChange={updateChoix}
                choixOptions={choixOptions}
                takenChoixPerTrait={takenChoixPerTrait}
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
          takenChoixPerTrait={takenChoixPerTrait}
          choixOptions={choixOptions}
          onAdd={addTrait}
          onClose={() => setModalType(null)}
        />
      )}

      {/* ── Formulaire trait custom ── */}
      {customForm && (
        <CustomTraitForm
          type={customForm.type}
          onAdd={addCustomTrait}
          onClose={() => setCustomForm(null)}
        />
      )}
    </div>
  );
}

// ─── Section générique avec bouton d'ajout ────────────────────────────────────

function TraitSection({ title, typeClass, isEmpty, emptyMsg, onOpenModal, addLabel, onAddCustom, children }) {
  return (
    <div className={`traits-section traits-${typeClass}`}>
      <div className="traits-section-header">
        <h3 className="traits-section-title">{title}</h3>
        <div className="traits-section-actions">
          {onOpenModal && (
            <button className="btn-open-modal" onClick={onOpenModal}>+ {addLabel}</button>
          )}
          {onAddCustom && (
            <button className="btn-open-modal btn-custom-trait" onClick={onAddCustom} title="Ajouter un trait personnalisé">+ Personnalisé</button>
          )}
        </div>
      </div>
      <div className="traits-list">
        {isEmpty ? (
          <div className="traits-empty">{emptyMsg}</div>
        ) : children}
      </div>
    </div>
  );
}

// ─── Rendu basique du markdown (gras uniquement) ─────────────────────────────

function renderMd(text) {
  if (!text) return null;
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith('**') && p.endsWith('**')
      ? <strong key={i}>{p.slice(2, -2)}</strong>
      : p
  );
}

// ─── Carte d'une particularité d'origine (fixe, non modifiable) ──────────────

function ParticuliariteCard({ index, particuliarite, expandedTraits, onToggle, isActive, onToggleActive }) {
  const key = `part-${index}`;
  const isExpanded = expandedTraits[key] || false;

  const info = DATA.particularites?.[particuliarite.anchor];
  const hasContent = info?.description || info?.effet || particuliarite.details?.length > 0;
  const coutPP = info?.coutPP || 0;

  return (
    <div className={`trait-item ${isExpanded ? 'expanded' : ''} trait-origine${!isActive ? ' trait-inactive' : ''}`}>
      <div className="trait-header">
        <div className="trait-info">
          <span className="trait-nom">{particuliarite.nom}</span>
          <span className={`trait-cout-badge badge-particularite badge-particularite--${particuliarite.categorie.toLowerCase()}`}>
            {particuliarite.categorie}
          </span>
          {coutPP > 0 && (
            <span className="trait-cout-badge badge-cost">{coutPP} PP</span>
          )}
        </div>
        <div className="trait-tags-inline" />
        <div className="trait-controls">
          <button
            className={`btn-particularite-toggle ${isActive ? 'active' : 'inactive'}`}
            onClick={onToggleActive}
            title={isActive ? 'Désactiver' : 'Activer'}
          >
            {isActive ? '●' : '○'}
          </button>
          {hasContent && (
            <button className="btn-trait-toggle" onClick={() => onToggle(key)}>
              {isExpanded ? '▲' : '▼'}
            </button>
          )}
        </div>
      </div>
      {isExpanded && hasContent && (
        <div className="trait-content">
          {info?.description && (
            <p className="trait-description">{renderMd(info.description)}</p>
          )}
          {info?.effet && (
            <div className="trait-meta-block">
              <span className="trait-meta">
                <strong>Effet :</strong>{' '}{renderMd(info.effet)}
              </span>
            </div>
          )}
          {particuliarite.details?.length > 0 && (
            <div className="trait-tags-full">
              {particuliarite.details.map((d, i) => (
                <span key={i} className="trait-tag tag-categorie">{d}</span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Carte d'un trait dans la fiche ──────────────────────────────────────────

function TraitCard({ traitEntry, expandedTraits, onToggle, onRemove, onRangChange, onChoixChange, choixOptions, takenChoixPerTrait }) {
  const t = traitEntry.info;
  const expandKey = traitEntry._index;
  const isExpanded = expandedTraits[expandKey] || false;
  const isDesavantage = t.type === 'desavantage';
  const isMineur = t.type === 'avantage_mineur';
  const coutTotal = t.coutPP * traitEntry.rang;

  // Options disponibles pour ce trait (pas prises par d'autres instances)
  const availableChoix = useMemo(() => {
    if (!t.choix) return null;
    const opts = choixOptions[t.choix] || [];
    const takenByOthers = takenChoixPerTrait[traitEntry.id] || new Set();
    return opts.filter(opt => !takenByOthers.has(opt.id) || opt.id === traitEntry.choix);
  }, [t.choix, choixOptions, takenChoixPerTrait, traitEntry.id, traitEntry.choix]);

  return (
    <div className={`trait-item ${isExpanded ? 'expanded' : ''} trait-${t.type.replace(/_/g, '-')}`}>
      <div className="trait-header">
        <div className="trait-info">
          <span className="trait-nom">{t.nom}</span>
          {t.choix && (
            <select
              className="trait-choix-inline"
              value={traitEntry.choix || ''}
              onChange={e => onChoixChange(traitEntry._index, e.target.value)}
              onClick={e => e.stopPropagation()}
            >
              <option value="">— choisir —</option>
              {availableChoix?.map(opt => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>
          )}
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
                onClick={() => onRangChange(traitEntry._index, traitEntry.rang - 1)}
                disabled={traitEntry.rang <= 1}
              >−</button>
              <span className="trait-rang-value">
                Rang {traitEntry.rang}<span className="trait-rang-max">/{t.rangMax}</span>
              </span>
              <button
                className="btn-rang-step"
                onClick={() => onRangChange(traitEntry._index, traitEntry.rang + 1)}
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
          <button className="btn-trait-toggle" onClick={() => onToggle(expandKey)}>
            {isExpanded ? '▲' : '▼'}
          </button>
          <button className="btn-trait-delete" onClick={() => onRemove(traitEntry._index)} title="Supprimer">
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

const MAX_RESULTS = Infinity;

function SelectionModal({ type, takenIds, takenChoixPerTrait, choixOptions, onAdd, onClose }) {
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
      if (filterSS  && t.sous_section !== filterSS)           return false;
      if (filterCat && !t.categories.includes(filterCat))    return false;
      if (q && !t.nom.toLowerCase().includes(q)
            && !t.description?.toLowerCase().includes(q))    return false;
      // Traits avec choix : disponible si au moins une option reste disponible
      if (t.choix) {
        const opts = choixOptions[t.choix] || [];
        const takenCount = takenChoixPerTrait[t.id]?.size || 0;
        return takenCount < opts.length;
      }
      return !takenIds.has(t.id);
    });
  }, [pool, takenIds, takenChoixPerTrait, choixOptions, search, filterSS, filterCat]);

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
            {''}
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
          {trait.choix && (
            <span className="trait-rangmax-badge" title="Nécessite un choix après ajout">✦</span>
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

// ─── Carte d'un trait custom (éditable inline) ────────────────────────────────

function CustomTraitCard({ traitEntry, expandedTraits, onToggle, onRemove, onRangChange, onUpdate }) {
  const expandKey = traitEntry._index;
  const isExpanded = expandedTraits[expandKey] || false;
  const isDesavantage = traitEntry.type === 'desavantage';
  const coutTotal = (traitEntry.coutPP || 1) * traitEntry.rang;

  return (
    <div className={`trait-item ${isExpanded ? 'expanded' : ''} trait-custom trait-${traitEntry.type?.replace(/_/g, '-')}`}>
      <div className="trait-header">
        <div className="trait-info">
          <input
            className="trait-custom-nom-input"
            value={traitEntry.nom || ''}
            placeholder="Nom du trait…"
            onChange={e => onUpdate(traitEntry._index, { nom: e.target.value })}
            onClick={e => e.stopPropagation()}
          />
          <span className={`trait-cout-badge ${isDesavantage ? 'badge-gain' : 'badge-cost'}`}>
            {isDesavantage ? `+${coutTotal}` : coutTotal} PP
          </span>
          {(traitEntry.rangMax || 1) > 1 && (
            <div className="trait-rang-stepper">
              <button className="btn-rang-step" onClick={() => onRangChange(traitEntry._index, traitEntry.rang - 1)} disabled={traitEntry.rang <= 1}>−</button>
              <span className="trait-rang-value">Rang {traitEntry.rang}<span className="trait-rang-max">/{traitEntry.rangMax}</span></span>
              <button className="btn-rang-step" onClick={() => onRangChange(traitEntry._index, traitEntry.rang + 1)} disabled={traitEntry.rang >= (traitEntry.rangMax || 1)}>+</button>
            </div>
          )}
        </div>
        <div className="trait-tags-inline">
          <span className="trait-tag tag-custom">Personnalisé</span>
        </div>
        <div className="trait-controls">
          <button className="btn-trait-toggle" onClick={() => onToggle(expandKey)}>{isExpanded ? '▲' : '▼'}</button>
          <button className="btn-trait-delete" onClick={() => onRemove(traitEntry._index)} title="Supprimer">✕</button>
        </div>
      </div>

      {isExpanded && (
        <div className="trait-content trait-custom-edit">
          <div className="trait-custom-row">
            <label>Coût PP</label>
            <input
              type="number"
              className="trait-custom-number"
              value={traitEntry.coutPP ?? 1}
              min={1}
              onChange={e => onUpdate(traitEntry._index, { coutPP: Math.max(1, parseInt(e.target.value) || 1) })}
            />
          </div>
          <div className="trait-custom-row">
            <label>Rang max</label>
            <input
              type="number"
              className="trait-custom-number"
              value={traitEntry.rangMax ?? 1}
              min={1}
              onChange={e => onUpdate(traitEntry._index, { rangMax: Math.max(1, parseInt(e.target.value) || 1) })}
            />
          </div>
          <div className="trait-custom-row">
            <label>Description</label>
            <textarea
              className="trait-custom-desc"
              value={traitEntry.description || ''}
              placeholder="Description optionnelle…"
              onChange={e => onUpdate(traitEntry._index, { description: e.target.value })}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Formulaire de création d'un trait custom ────────────────────────────────

function CustomTraitForm({ type, onAdd, onClose }) {
  const [nom, setNom]         = useState('');
  const [coutPP, setCoutPP]   = useState(1);
  const [rangMax, setRangMax] = useState(1);
  const isDesavantage = type === 'desavantage';

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({ nom, type, coutPP, rangMax });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content custom-trait-form-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{isDesavantage ? 'Désavantage personnalisé' : 'Avantage majeur personnalisé'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form className="custom-trait-form" onSubmit={handleSubmit}>
          <div className="trait-custom-row">
            <label>Nom</label>
            <input
              type="text"
              className="trait-custom-nom-input"
              value={nom}
              placeholder="Nom du trait…"
              onChange={e => setNom(e.target.value)}
              autoFocus
            />
          </div>
          <div className="trait-custom-row">
            <label>Coût PP {isDesavantage ? '(rapportés)' : '(dépensés)'}</label>
            <input
              type="number"
              className="trait-custom-number"
              value={coutPP}
              min={1}
              onChange={e => setCoutPP(Math.max(1, parseInt(e.target.value) || 1))}
            />
          </div>
          <div className="trait-custom-row">
            <label>Rang max</label>
            <input
              type="number"
              className="trait-custom-number"
              value={rangMax}
              min={1}
              onChange={e => setRangMax(Math.max(1, parseInt(e.target.value) || 1))}
            />
          </div>
          <div className="custom-trait-form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Annuler</button>
            <button type="submit" className="btn-add-trait-modal" disabled={!nom.trim()}>Ajouter</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TabTraits;
