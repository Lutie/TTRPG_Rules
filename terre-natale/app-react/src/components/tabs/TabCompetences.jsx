import { useCharacter } from '../../context/CharacterContext';
import { useCharacterCalculations, calculerModificateur, getValeurTotale } from '../../hooks/useCharacterCalculations';
import DATA from '../../data';
import Section from '../common/Section';

function TabCompetences() {
  const { character, updateCharacter } = useCharacter();
  const calc = useCharacterCalculations(character);

  const competencesData = character.competences || { groupes: {}, competences: {}, attributsChoisis: {} };
  const maxRangGroupe = 3;
  const maxRangCompetence = 6;

  const handleGroupeChange = (groupeId, value) => {
    updateCharacter(prev => ({
      ...prev,
      competences: {
        ...prev.competences,
        groupes: { ...prev.competences?.groupes, [groupeId]: parseInt(value) }
      }
    }));
  };

  const handleCompetenceChange = (compId, value) => {
    updateCharacter(prev => ({
      ...prev,
      competences: {
        ...prev.competences,
        competences: { ...prev.competences?.competences, [compId]: parseInt(value) }
      }
    }));
  };

  const handleAttributChange = (compId, attrId) => {
    updateCharacter(prev => ({
      ...prev,
      competences: {
        ...prev.competences,
        attributsChoisis: { ...prev.competences?.attributsChoisis, [compId]: attrId }
      }
    }));
  };

  const handleXpAcquisChange = (e) => {
    updateCharacter(prev => ({
      ...prev,
      xpAcquis: parseInt(e.target.value) || 0
    }));
  };

  const calculerProuesse = (groupeId) => {
    const rangGroupe = competencesData.groupes?.[groupeId] || 0;
    const groupe = DATA.competences.find(g => g.id === groupeId);
    if (!groupe) return 0;

    // Trouver l'attribut le plus utilisé dans le groupe
    const attrsSet = new Set();
    groupe.competences.forEach(comp => {
      comp.attributs.forEach(attr => attrsSet.add(attr));
    });
    const attrs = Array.from(attrsSet);

    // Prendre le meilleur mod d'attribut du groupe
    let bestMod = -10;
    attrs.forEach(attr => {
      const mod = calc.getMod(attr);
      if (mod > bestMod) bestMod = mod;
    });

    return bestMod + rangGroupe + calc.prouesses;
  };

  const formatMod = (val) => val >= 0 ? `+${val}` : `${val}`;

  const vecuNom = character.infos?.vecu || 'Aucun';

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

      <Section title="Compétences">
        <div className="competences-container">
          {DATA.competences.map(groupe => {
            const rangGroupe = competencesData.groupes?.[groupe.id] || 0;
            const prouesse = calculerProuesse(groupe.id);

            return (
              <div key={groupe.id} className="groupe-block">
                <div className="groupe-header">
                  <div className="groupe-info">
                    <span className="groupe-nom">{groupe.nom}</span>
                    <span className="groupe-desc">{groupe.description || ''}</span>
                  </div>
                  <div className="groupe-stats">
                    <div className="groupe-rang">
                      <label>Rang</label>
                      <select
                        className="groupe-rang-select"
                        value={rangGroupe}
                        onChange={(e) => handleGroupeChange(groupe.id, e.target.value)}
                      >
                        {Array.from({ length: maxRangGroupe + 1 }, (_, i) => (
                          <option key={i} value={i}>{i}</option>
                        ))}
                      </select>
                    </div>
                    <div className="groupe-prouesse">
                      Prouesse: {formatMod(prouesse)}
                    </div>
                  </div>
                </div>

                <div className="competences-list">
                  {groupe.competences.map(comp => {
                    const rangComp = competencesData.competences?.[comp.id] || 0;
                    const attrChoisi = competencesData.attributsChoisis?.[comp.id] || comp.attributs[0];
                    const valeurAttr = getValeurTotale(character, attrChoisi);
                    const modAttr = calculerModificateur(valeurAttr);
                    const bonus = modAttr + rangGroupe + rangComp;

                    return (
                      <div key={comp.id} className="competence-item">
                        <div className="competence-main">
                          <select
                            className="competence-attr-select"
                            value={attrChoisi}
                            onChange={(e) => handleAttributChange(comp.id, e.target.value)}
                          >
                            {comp.attributs.map(attr => (
                              <option key={attr} value={attr}>{attr}</option>
                            ))}
                          </select>
                          <span className="competence-nom">{comp.nom}</span>
                        </div>
                        <div className="competence-rang">
                          <select
                            className="competence-rang-select"
                            value={rangComp}
                            onChange={(e) => handleCompetenceChange(comp.id, e.target.value)}
                          >
                            {Array.from({ length: maxRangCompetence + 1 }, (_, i) => (
                              <option key={i} value={i}>{i}</option>
                            ))}
                          </select>
                        </div>
                        <div className={`competence-bonus ${bonus >= 0 ? 'positive' : 'negative'}`}>
                          {formatMod(bonus)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </Section>
    </div>
  );
}

export default TabCompetences;
