import { useCharacter } from '../../context/CharacterContext';
import { useCharacterCalculations } from '../../hooks/useCharacterCalculations';
import DATA from '../../data';
import Section from '../common/Section';

function TabScience() {
  const { character } = useCharacter();
  const calc = useCharacterCalculations(character);

  const steamMax = calc.ressourcesMax['PR'] || 0;
  const logVal = calc.getAttr('LOG');
  const logMod = calc.getMod('LOG');

  const caste = DATA.castes.find(c => c.id === character.caste?.id);
  const hasSteamCaste = caste?.ressources?.includes('PR');

  return (
    <div id="tab-science" className="tab-content active">

      {/* ── Résumé Steam ── */}
      <Section title="Aether (PR)">
        <div className="xp-summary-box">
          <div className="xp-summary-title">Réserve d'Aether</div>
          <div className="xp-summary-content">
            <div className="xp-summary-row">
              <span className="xp-label">Logique × 2</span>
              <span className="xp-value">{logVal} × 2 = {logVal * 2}</span>
            </div>
            {hasSteamCaste && (
              <div className="xp-summary-row">
                <span className="xp-label">Bonus caste (rang {calc.rangCaste})</span>
                <span className="xp-value">+{calc.rangCaste}</span>
              </div>
            )}
            <div className="xp-summary-row xp-total-row">
              <span className="xp-label">Maximum</span>
              <span className="xp-value">{steamMax}</span>
            </div>
            <div className="xp-summary-row">
              <span className="xp-label">Modificateur LOG</span>
              <span className="xp-value">{logMod >= 0 ? `+${logMod}` : logMod}</span>
            </div>
          </div>
        </div>
      </Section>

      {/* ── Placeholder contenu ── */}
      <Section title="Contenu à venir">
        <p className="status-info">
          Cet onglet accueillera les règles de science : gadgets, automates, recettes alchimiques, etc.
        </p>
      </Section>

    </div>
  );
}

export default TabScience;
