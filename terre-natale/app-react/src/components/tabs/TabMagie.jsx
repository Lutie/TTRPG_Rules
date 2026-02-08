import { useCharacter } from '../../context/CharacterContext';
import { useCharacterCalculations } from '../../hooks/useCharacterCalculations';
import DATA from '../../data';
import Section from '../common/Section';

function TabMagie() {
  const { character, updateCharacter } = useCharacter();
  const calc = useCharacterCalculations(character);

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
