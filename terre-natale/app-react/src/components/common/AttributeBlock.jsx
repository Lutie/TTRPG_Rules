import { useCharacter } from '../../context/CharacterContext';
import { getValeurTotale, calculerModificateur, getValeurDefaut } from '../../hooks/useCharacterCalculations';
import DATA from '../../data';

// Calcul défense normale
const calculerDefenseNormale = (valeur) => {
  const mod = calculerModificateur(valeur);
  const impair = valeur % 2 !== 0 ? 1 : 0;
  return 10 + mod + 5 + impair;
};

// Calcul défense choquée
const calculerDefenseChoquee = (valeur) => {
  const mod = calculerModificateur(valeur);
  const impair = valeur % 2 !== 0 ? 1 : 0;
  return 10 + mod + impair;
};

function AttributeBlock({ attr, showDefenses = true, compact = false }) {
  const { character, updateCharacter } = useCharacter();

  const attrData = character.attributs[attr.id] || { base: getValeurDefaut(attr.id), bonus: 0 };
  const valeurTotale = getValeurTotale(character, attr.id);
  const modificateur = calculerModificateur(valeurTotale);
  const defense = calculerDefenseNormale(valeurTotale);
  const defenseChoc = calculerDefenseChoquee(valeurTotale);

  // Bonus
  const bonusEthnie = attrData.bonus || 0;
  const bonusOrigines = character.originesBonus?.[attr.id] || 0;
  const totalOrigine = bonusEthnie + bonusOrigines;
  const bonusNaissance = character.naissanceBonus?.[attr.id] || 0;
  const bonusConfig = character.bonusConfig?.[`attr${attr.id}`] || 0;

  const hasNaissance = ['STA', 'TAI', 'EGO', 'APP', 'CHN', 'EQU'].includes(attr.id);
  const isSecondary = ['STA', 'TAI', 'EGO', 'APP'].includes(attr.id);
  const isCaste = character.caste?.attribut1 === attr.id || character.caste?.attribut2 === attr.id;

  const min = isSecondary ? DATA.secondaireMin : DATA.valeurDefautPrincipal;
  const max = isSecondary ? DATA.secondaireMax : 20;

  const handleBaseChange = (e) => {
    const newBase = Math.max(min, Math.min(max, parseInt(e.target.value) || min));
    updateCharacter(prev => ({
      ...prev,
      attributs: {
        ...prev.attributs,
        [attr.id]: { ...attrData, base: newBase }
      }
    }));
  };

  const formatBonus = (val) => val > 0 ? `+${val}` : (val < 0 ? `${val}` : '0');
  const bonusClass = (val) => val > 0 ? 'positive' : (val < 0 ? 'negative' : '');

  // Compact mode for secondary attributes
  if (compact) {
    return (
      <div className="attr-compact" title={attr.description}>
        <span className="compact-name">{attr.nom}</span>
        <input
          type="number"
          className="attr-input-compact"
          value={attrData.base}
          onChange={handleBaseChange}
          min={min}
          max={max}
        />
        {hasNaissance && bonusNaissance !== 0 && (
          <span className={`compact-naissance ${bonusClass(bonusNaissance)}`} title="Naissance">
            {formatBonus(bonusNaissance)}
          </span>
        )}
        {bonusConfig !== 0 && (
          <span className={`compact-bonus ${bonusClass(bonusConfig)}`} title="Bonus">
            {formatBonus(bonusConfig)}
          </span>
        )}
        <span className="compact-eq">=</span>
        <span className="compact-total">{valeurTotale}</span>
        <span className={`compact-mod ${modificateur >= 0 ? 'positive' : 'negative'}`}>
          ({modificateur >= 0 ? `+${modificateur}` : modificateur})
        </span>
      </div>
    );
  }

  // Full attribute block with image
  return (
    <div className={`attr-block ${isCaste ? 'attr-caste' : ''}`} title={attr.description}>
      {attr.image && (
        <div className="attr-image" style={{ backgroundImage: `url('${attr.image}')` }} />
      )}
      <div className="attr-content">
        <div className="attr-header">
          <span className="attr-name">{attr.nom}{isCaste ? ' ★' : ''}</span>
          <span className="attr-id">{attr.id}</span>
        </div>
        <div className="attr-details">
          <div className="attr-details-row">
            <div className="attr-row">
              <label>Base</label>
              <input
                type="number"
                className="attr-input"
                value={attrData.base}
                onChange={handleBaseChange}
                min={min}
                max={max}
              />
            </div>
            <div className="attr-row">
              <label>Origine</label>
              <span
                className={`attr-bonus ${bonusClass(totalOrigine)}`}
                title={`Ethnie: ${formatBonus(bonusEthnie)}, Origines: ${formatBonus(bonusOrigines)}`}
              >
                {formatBonus(totalOrigine)}
              </span>
            </div>
            {hasNaissance && (
              <div className="attr-row">
                <label>Naissance</label>
                <span className={`attr-bonus ${bonusClass(bonusNaissance)}`}>
                  {formatBonus(bonusNaissance)}
                </span>
              </div>
            )}
            {bonusConfig !== 0 && (
              <div className="attr-row">
                <label>Bonus</label>
                <span className={`attr-bonus ${bonusClass(bonusConfig)}`}>
                  {formatBonus(bonusConfig)}
                </span>
              </div>
            )}
          </div>
          {showDefenses && (
            <div className="attr-details-row">
              <div className="attr-row">
                <label>Déf</label>
                <span className="attr-def">{defense}</span>
              </div>
              <div className="attr-row">
                <label>Déf Choc</label>
                <span className="attr-choc">{defenseChoc}</span>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="attr-total">
        <span className="total-value">{valeurTotale}</span>
        <span className={`total-mod ${modificateur >= 0 ? 'positive' : 'negative'}`}>
          ({modificateur >= 0 ? `+${modificateur}` : modificateur})
        </span>
      </div>
    </div>
  );
}

export default AttributeBlock;
