import { useState, useCallback } from 'react';
import { useCharacter } from '../../context/CharacterContext';
import { useCharacterCalculations, calculerModificateur, getValeurTotale } from '../../hooks/useCharacterCalculations';
import DATA from '../../data';
import Section from '../common/Section';

// Groupes libres sans sous-groupes (Ambidextrie) : entête seule, pas collapsible
const isHeaderOnly = (g) => g.libre && !g.sousGroupes;
const ALL_GROUP_IDS = DATA.categoriesCompetences.flatMap(c =>
  c.groupes.filter(g => !isHeaderOnly(g)).map(g => g.id)
);

const ALL_ATTRS = ['FOR', 'DEX', 'AGI', 'CON', 'PER', 'CHA', 'INT', 'RUS', 'VOL', 'SAG', 'MAG', 'LOG', 'EQU', 'CHN'];

const MAX_RANG_GROUPE = 3;
const MAX_RANG_COMPETENCE = 6;

// Retourne la liste des compétences (objets) d'un groupe, dans l'ordre affiché
function getCompsInGroupe(groupe) {
  if (groupe.sousGroupes) {
    return groupe.sousGroupes.flatMap(sg =>
      sg.competences.map(cid =>
        DATA.competences.find(c => c.id === cid && c.groupe === groupe.id && c.sousGroupe === sg.nom) || null
      ).filter(Boolean)
    );
  }
  return (groupe.competences || []).map(cid =>
    DATA.competences.find(c => c.id === cid && c.groupe === groupe.id) || null
  ).filter(Boolean);
}

// Choisit l'attribut affiché par défaut pour une compétence
function defaultAttr(comp) {
  if (comp.attrVariable) return ALL_ATTRS[0];
  if (comp.attributs.length > 0) return comp.attributs[0];
  return ALL_ATTRS[0];
}

// Clé unique pour stocker le rang/attr d'une compétence dans un groupe donné
// (le même ID peut apparaître dans plusieurs groupes)
function compKey(comp) {
  return comp.sousGroupe
    ? `${comp.groupe}__${comp.sousGroupe}__${comp.id}`
    : `${comp.groupe}__${comp.id}`;
}

function TabCompetences() {
  const { character, updateCharacter } = useCharacter();
  const calc = useCharacterCalculations(character);

  const stored = character.competences || { groupes: {}, competences: {}, attributsChoisis: {} };

  // Panneau résumé
  const [summaryOpen, setSummaryOpen] = useState(false);

  // Groupes ouverts / fermés
  const [openGroups, setOpenGroups] = useState(() => new Set(ALL_GROUP_IDS));
  const toggleGroupe = useCallback(id =>
    setOpenGroups(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    }), []);
  const ouvrirTout  = () => setOpenGroups(new Set(ALL_GROUP_IDS));
  const fermerTout  = () => setOpenGroups(new Set());

  const handleGroupeChange = (groupeId, value) => {
    updateCharacter(prev => ({
      ...prev,
      competences: {
        ...prev.competences,
        groupes: { ...prev.competences?.groupes, [groupeId]: parseInt(value) }
      }
    }));
  };

  const handleCompetenceChange = (key, value) => {
    updateCharacter(prev => ({
      ...prev,
      competences: {
        ...prev.competences,
        competences: { ...prev.competences?.competences, [key]: parseInt(value) }
      }
    }));
  };

  const handleAttributChange = (key, attrId) => {
    updateCharacter(prev => ({
      ...prev,
      competences: {
        ...prev.competences,
        attributsChoisis: { ...prev.competences?.attributsChoisis, [key]: attrId }
      }
    }));
  };

  const handleLibreAdd = (key) => {
    updateCharacter(prev => {
      const current = prev.competences?.libres?.[key] || [];
      return {
        ...prev,
        competences: {
          ...prev.competences,
          libres: { ...prev.competences?.libres, [key]: [...current, { nom: '', attr: ALL_ATTRS[0], rang: 0 }] }
        }
      };
    });
  };

  const handleLibreUpdate = (key, idx, field, value) => {
    updateCharacter(prev => {
      const current = [...(prev.competences?.libres?.[key] || [])];
      current[idx] = { ...current[idx], [field]: field === 'rang' ? parseInt(value) : value };
      return {
        ...prev,
        competences: {
          ...prev.competences,
          libres: { ...prev.competences?.libres, [key]: current }
        }
      };
    });
  };

  const handleLibreRemove = (key, idx) => {
    updateCharacter(prev => {
      const current = [...(prev.competences?.libres?.[key] || [])];
      current.splice(idx, 1);
      return {
        ...prev,
        competences: {
          ...prev.competences,
          libres: { ...prev.competences?.libres, [key]: current }
        }
      };
    });
  };

  const handleXpAcquisChange = (e) => {
    updateCharacter(prev => ({
      ...prev,
      xpAcquis: parseInt(e.target.value) || 0
    }));
  };

  const calculerProuesse = (groupe) => {
    const rangGroupe = stored.groupes?.[groupe.id] || 0;
    return Math.max(0, (calc.prouesses || 0) + rangGroupe);
  };

  const formatMod = (val) => val >= 0 ? `+${val}` : `${val}`;

  const vecuNom = character.infos?.vecu || 'Aucun';

  // Rendu d'un slot de compétence libre (< Type d'Arme >, < Langue >, etc.)
  const renderCompetenceLibre = (comp, rangGroupe) => {
    const key = compKey(comp);
    const entries = stored.libres?.[key] || [];
    return (
      <div key={key} className="competence-libre-slot">
        <div className="competence-libre-header">
          <span className="competence-libre-label">{comp.nom}</span>
          <button className="btn-libre-add" onClick={() => handleLibreAdd(key)} title="Ajouter une entrée">+</button>
        </div>
        {entries.map((entry, idx) => {
          const attr = entry.attr || ALL_ATTRS[0];
          const bonus = calculerModificateur(getValeurTotale(character, attr)) + rangGroupe + (entry.rang || 0);
          return (
            <div key={idx} className="competence-libre-entry">
              <select
                className="competence-attr-select"
                value={attr}
                onChange={e => handleLibreUpdate(key, idx, 'attr', e.target.value)}
              >
                {ALL_ATTRS.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
              <input
                type="text"
                className="competence-libre-nom-input"
                value={entry.nom}
                placeholder="Nom…"
                onChange={e => handleLibreUpdate(key, idx, 'nom', e.target.value)}
              />
              <div className="competence-rang">
                <select
                  className="competence-rang-select"
                  value={entry.rang || 0}
                  onChange={e => handleLibreUpdate(key, idx, 'rang', e.target.value)}
                >
                  {Array.from({ length: MAX_RANG_COMPETENCE + 1 }, (_, i) => (
                    <option key={i} value={i}>{i}</option>
                  ))}
                </select>
              </div>
              <div className={`competence-bonus ${bonus >= 0 ? 'positive' : 'negative'}`}>
                {formatMod(bonus)}
              </div>
              <button className="btn-libre-remove" onClick={() => handleLibreRemove(key, idx)} title="Supprimer">×</button>
            </div>
          );
        })}
      </div>
    );
  };

  // Rendu d'une ligne de compétence standard
  const renderCompetence = (comp, rangGroupe) => {
    if (comp.libre) return renderCompetenceLibre(comp, rangGroupe);

    const key = compKey(comp);
    const rangComp = stored.competences?.[key] || 0;

    // Liste d'attrs proposés dans le select
    // Compétence limitante sans attr fixe (ex: Représailles) → choix libre parmi tous les attrs
    const attrOptions = (comp.attrVariable || (comp.limitant && comp.attributs.length === 0))
      ? ALL_ATTRS
      : [...comp.attributs, ...comp.secondaires];

    const attrChoisi = stored.attributsChoisis?.[key]
      || (attrOptions.length > 0 ? attrOptions[0] : null);

    const valeurAttr = attrChoisi ? getValeurTotale(character, attrChoisi) : 0;
    const modAttr = calculerModificateur(valeurAttr);
    const bonus = modAttr + rangGroupe + rangComp;

    return (
      <div key={key} className={`competence-item${comp.limitant ? ' limitant' : ''}`}>
        <div className="competence-main">
          {attrOptions.length > 1 ? (
            <select
              className="competence-attr-select"
              value={attrChoisi || ''}
              onChange={(e) => handleAttributChange(key, e.target.value)}
            >
              {attrOptions.map(attr => (
                <option key={attr} value={attr}>{attr}</option>
              ))}
            </select>
          ) : (
            <span className="competence-attr-badge">{attrChoisi || '—'}</span>
          )}
          <span className="competence-nom">
            {comp.nom}
            {comp.limitant && <span className="badge-limitant" title="Compétence limitante"> (L)</span>}
          </span>
        </div>
        <div className="competence-rang">
          <select
            className="competence-rang-select"
            value={rangComp}
            onChange={(e) => handleCompetenceChange(key, e.target.value)}
          >
            {Array.from({ length: MAX_RANG_COMPETENCE + 1 }, (_, i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
        </div>
        <div className={`competence-bonus ${bonus >= 0 ? 'positive' : 'negative'}`}>
          {formatMod(bonus)}
        </div>
      </div>
    );
  };

  // Rendu d'un groupe (avec ou sans sous-groupes)
  const renderGroupe = (groupe) => {
    const rangGroupe = stored.groupes?.[groupe.id] || 0;
    const prouesse = calculerProuesse(groupe);
    const headerOnly = isHeaderOnly(groupe);
    const isOpen = !headerOnly && openGroups.has(groupe.id);

    return (
      <div key={groupe.id} className={`groupe-block${groupe.limitant ? ' groupe-limitant' : ''}${isOpen ? ' open' : ''}`}>
        <div
          className="groupe-header"
          onClick={headerOnly ? undefined : () => toggleGroupe(groupe.id)}
          role={headerOnly ? undefined : 'button'}
          aria-expanded={headerOnly ? undefined : isOpen}
          style={headerOnly ? { cursor: 'default' } : undefined}
        >
          <div className="groupe-info">
            {!headerOnly && <span className="groupe-chevron">{isOpen ? '▾' : '▸'}</span>}
            <span className="groupe-nom">
              {groupe.nom}
              {groupe.limitant && <span className="badge-limitant" title="Groupe limitant"> (L)</span>}
            </span>
          </div>
          <div className="groupe-stats" onClick={e => e.stopPropagation()}>
            <div className="groupe-rang">
              <label>Rang</label>
              <select
                className="groupe-rang-select"
                value={rangGroupe}
                onChange={(e) => handleGroupeChange(groupe.id, e.target.value)}
              >
                {Array.from({ length: MAX_RANG_GROUPE + 1 }, (_, i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
            </div>
            {!groupe.libre && (
              <div
                className="groupe-prouesse"
                title={`Le personnage peut dépenser jusqu'à ${prouesse} PC pour obtenir ${prouesse} d'ajustement à un test utilisant ce groupe`}
              >
                Prouesse : {prouesse}
              </div>
            )}
          </div>
        </div>

        {isOpen && (
          groupe.sousGroupes ? (
            groupe.sousGroupes.map(sg => (
              <div key={sg.nom} className="sous-groupe-block">
                <div className="sous-groupe-header">{sg.nom}</div>
                <div className="competences-list">
                  {sg.competences.map(cid => {
                    const comp = DATA.competences.find(
                      c => c.id === cid && c.groupe === groupe.id && c.sousGroupe === sg.nom
                    );
                    return comp ? renderCompetence(comp, rangGroupe) : null;
                  })}
                </div>
              </div>
            ))
          ) : (
            <div className="competences-list">
              {(groupe.competences || []).map(cid => {
                const comp = DATA.competences.find(c => c.id === cid && c.groupe === groupe.id);
                return comp ? renderCompetence(comp, rangGroupe) : null;
              })}
            </div>
          )
        )}
      </div>
    );
  };

  // Groupes/compétences où le personnage a investi des points
  const summaryGroupes = DATA.categoriesCompetences.flatMap(cat =>
    cat.groupes.flatMap(groupe => {
      const rangGroupe = stored.groupes?.[groupe.id] || 0;
      const comps = isHeaderOnly(groupe) ? [] : getCompsInGroupe(groupe);
      const compsInvestis = comps.filter(comp => !comp.libre && (stored.competences?.[compKey(comp)] || 0) > 0);
      const libreSlots = comps
        .filter(comp => comp.libre)
        .map(comp => ({ comp, entries: (stored.libres?.[compKey(comp)] || []).filter(e => e.rang > 0 || e.nom) }))
        .filter(s => s.entries.length > 0);
      if (rangGroupe === 0 && compsInvestis.length === 0 && libreSlots.length === 0) return [];
      return [{ groupe, rangGroupe, compsInvestis, libreSlots }];
    })
  );

  return (
    <div id="tab-competences" className="tab-content active">
      {/* Bloc XP Résumé */}
      <section className="section xp-section">
        <div className="xp-summary-box">
          <div className="xp-summary-title">Points d'Expérience</div>
          <div className="xp-summary-content">
            <div className="xp-summary-row">
              <span className="xp-label">Départ ({vecuNom})</span>
              <span className="xp-value">{calc.xpDepart}</span>
            </div>
            <div className="xp-summary-row">
              <span className="xp-label">Acquis</span>
              <input
                type="number"
                className="xp-input"
                value={character.xpAcquis || 0}
                onChange={handleXpAcquisChange}
                min="0"
              />
            </div>
            <div className="xp-summary-row xp-total-row">
              <span className="xp-label">Total</span>
              <span className="xp-value">{calc.xpTotal}</span>
            </div>
            <div className={`xp-summary-row xp-rest-row ${calc.xpRestants < 0 ? 'over-budget' : ''}`}>
              <span className="xp-label">Restant</span>
              <span className="xp-value xp-restant">{calc.xpRestants} / {calc.xpTotal}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Résumé des investissements */}
      <div className="comp-summary-panel">
        <div className="comp-summary-header" onClick={() => setSummaryOpen(o => !o)}>
          <span className="groupe-chevron">{summaryOpen ? '▾' : '▸'}</span>
          <span>Résumé des compétences investies</span>
          <span className="comp-summary-count">
            {summaryGroupes.length} groupe{summaryGroupes.length !== 1 ? 's' : ''}
          </span>
        </div>
        {summaryOpen && (
          <div className="comp-summary-body">
            {summaryGroupes.length === 0 ? (
              <div className="comp-summary-empty">Aucune compétence investie</div>
            ) : summaryGroupes.map(({ groupe, rangGroupe, compsInvestis, libreSlots }) => {
              const prouesse = calculerProuesse(groupe);
              return (
                <div key={groupe.id} className="comp-summary-groupe">
                  <div className="comp-summary-groupe-header">
                    <span className="comp-summary-groupe-nom">{groupe.nom}</span>
                    <span className="comp-summary-badge">rang {rangGroupe}</span>
                    {!groupe.libre && <span className="comp-summary-badge">prouesse {prouesse}</span>}
                  </div>
                  {compsInvestis.map(comp => {
                    const k = compKey(comp);
                    const rangComp = stored.competences?.[k] || 0;
                    const attrChoisi = stored.attributsChoisis?.[k] || defaultAttr(comp);
                    const bonus = calculerModificateur(getValeurTotale(character, attrChoisi)) + rangGroupe + rangComp;
                    return (
                      <div key={k} className="comp-summary-comp">
                        <span className="comp-summary-attr">{attrChoisi}</span>
                        <span className="comp-summary-nom">{comp.nom}</span>
                        <span className="comp-summary-comp-rang">rang {rangComp}</span>
                        <span className={`comp-summary-bonus ${bonus >= 0 ? 'positive' : 'negative'}`}>
                          {formatMod(bonus)}
                        </span>
                      </div>
                    );
                  })}
                  {libreSlots.flatMap(({ comp, entries }) =>
                    entries.map((entry, idx) => {
                      const attr = entry.attr || ALL_ATTRS[0];
                      const bonus = calculerModificateur(getValeurTotale(character, attr)) + rangGroupe + (entry.rang || 0);
                      return (
                        <div key={`${compKey(comp)}-${idx}`} className="comp-summary-comp comp-summary-libre">
                          <span className="comp-summary-attr">{attr}</span>
                          <span className="comp-summary-nom">{entry.nom || comp.nom}</span>
                          <span className="comp-summary-comp-rang">rang {entry.rang || 0}</span>
                          <span className={`comp-summary-bonus ${bonus >= 0 ? 'positive' : 'negative'}`}>
                            {formatMod(bonus)}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="competences-toolbar">
        <button className="btn-comp-toggle" onClick={ouvrirTout}>▾ Tout ouvrir</button>
        <button className="btn-comp-toggle" onClick={fermerTout}>▸ Tout fermer</button>
      </div>

      {DATA.categoriesCompetences.map(categorie => (
        <Section key={categorie.id} title={categorie.nom}>
          <div className="competences-container">
            {categorie.groupes.map(groupe => renderGroupe(groupe))}
          </div>
        </Section>
      ))}
    </div>
  );
}

export default TabCompetences;
