import { useState } from 'react';
import { useCharacter } from '../../context/CharacterContext';

const CARAC_FIELDS = [
  // Général
  { id: 'allure', nom: 'Allure', section: 'Général' },
  { id: 'resilience', nom: 'Résilience' },
  { id: 'encombrement', nom: 'Encombrement Max' },
  { id: 'chargeMax', nom: 'Charge Max' },
  { id: 'memoire', nom: 'Mémoire' },
  // Combat
  { id: 'protectionPhysique', nom: 'Protection Physique', section: 'Combat' },
  { id: 'protectionMentale', nom: 'Protection Mentale' },
  { id: 'absorptionPhysique', nom: 'Absorption Physique' },
  { id: 'absorptionMentale', nom: 'Absorption Mentale' },
  { id: 'poigne', nom: 'Poigne' },
  { id: 'prouessesInnees', nom: 'Prouesses Innées' },
  { id: 'moral', nom: 'Moral' },
  { id: 'perfPhysique', nom: 'Perf. Physique' },
  { id: 'perfMentale', nom: 'Perf. Mentale' },
  { id: 'controleActif', nom: 'Contrôle Actif' },
  { id: 'controlePassif', nom: 'Contrôle Passif' },
  { id: 'techniqueMax', nom: 'Technique Max' },
  { id: 'expertisePhysique', nom: 'Expertise Physique' },
  { id: 'expertiseMentale', nom: 'Expertise Mentale' },
  { id: 'precisionPhysique', nom: 'Précision Physique' },
  { id: 'precisionMentale', nom: 'Précision Mentale' },
  // Magie
  { id: 'porteeMagique', nom: 'Portée Magique', section: 'Magie' },
  { id: 'tempsIncantation', nom: 'Temps Incantation' },
  { id: 'expertiseMagique', nom: 'Expertise Magique' },
  { id: 'resistanceDrain', nom: 'Résist. Drain' },
  { id: 'puissanceInvocatrice', nom: 'Puiss. Invocatrice' },
  { id: 'puissanceSoinsDegats', nom: 'Puiss. Soins/Dégâts' },
  { id: 'puissancePositive', nom: 'Puiss. Positive' },
  { id: 'puissanceNegative', nom: 'Puiss. Négative' },
  { id: 'puissanceGenerique', nom: 'Puiss. Générique' },
  // Résiliences
  { id: 'resiliencePhysique', nom: 'Résil. Physique', section: 'Résiliences' },
  { id: 'resilienceMentale', nom: 'Résil. Mentale' },
  { id: 'resilienceMagique', nom: 'Résil. Magique' },
  { id: 'resilienceNerf', nom: 'Résil. Nerf' },
  { id: 'resilienceCorruption', nom: 'Résil. Corruption' },
  { id: 'resilienceFatigue', nom: 'Résil. Fatigue' },
  // Récupération
  { id: 'recuperation', nom: 'Récupération', section: 'Récupération' },
  { id: 'recuperationPV', nom: 'Récup. PV' },
  { id: 'recuperationPS', nom: 'Récup. PS' },
  { id: 'recuperationPE', nom: 'Récup. PE' },
  { id: 'recuperationPM', nom: 'Récup. PM' },
  { id: 'recuperationPK', nom: 'Récup. PK' },
  { id: 'recuperationPC', nom: 'Récup. PC' }
];

const MAX_FIELDS = [
  { id: 'maxPV', nom: 'Max PV' },
  { id: 'maxPS', nom: 'Max PS' },
  { id: 'maxPE', nom: 'Max PE' },
  { id: 'maxPM', nom: 'Max PM' },
  { id: 'maxPK', nom: 'Max PK' },
  { id: 'maxPC', nom: 'Max PC' }
];

const ATTR_FIELDS = [
  // Corps
  { id: 'attrFOR', nom: 'Force', section: 'Corps' },
  { id: 'attrDEX', nom: 'Dextérité' },
  { id: 'attrAGI', nom: 'Agilité' },
  { id: 'attrCON', nom: 'Constitution' },
  { id: 'attrPER', nom: 'Perception' },
  // Esprit
  { id: 'attrCHA', nom: 'Charisme', section: 'Esprit' },
  { id: 'attrINT', nom: 'Intelligence' },
  { id: 'attrRUS', nom: 'Ruse' },
  { id: 'attrVOL', nom: 'Volonté' },
  { id: 'attrSAG', nom: 'Sagesse' },
  // Spéciaux
  { id: 'attrMAG', nom: 'Magie', section: 'Spéciaux' },
  { id: 'attrLOG', nom: 'Logique' },
  { id: 'attrCHN', nom: 'Chance' },
  // Secondaires
  { id: 'attrSTA', nom: 'Stature', section: 'Secondaires' },
  { id: 'attrTAI', nom: 'Taille' },
  { id: 'attrEGO', nom: 'Ego' },
  { id: 'attrAPP', nom: 'Apparence' }
];

function TabConfig() {
  const { character, updateCharacter } = useCharacter();
  const [activeModal, setActiveModal] = useState(null);
  const bonusConfig = character.bonusConfig || {};
  const options = character.options || {};

  const handleOptionToggle = (key) => {
    updateCharacter(prev => ({
      ...prev,
      options: { ...prev.options, [key]: !prev.options?.[key] }
    }));
  };

  const handleBonusChange = (id, value) => {
    const numValue = parseInt(value) || 0;
    updateCharacter(prev => ({
      ...prev,
      bonusConfig: {
        ...prev.bonusConfig,
        [id]: numValue
      }
    }));
  };

  const resetAll = (fields) => {
    const updates = {};
    fields.forEach(f => { updates[f.id] = 0; });
    updateCharacter(prev => ({
      ...prev,
      bonusConfig: {
        ...prev.bonusConfig,
        ...updates
      }
    }));
  };

  const hasCaracBonus = CARAC_FIELDS.some(k => bonusConfig[k.id] !== 0 && bonusConfig[k.id] !== undefined);
  const hasMaxBonus = MAX_FIELDS.some(k => bonusConfig[k.id] !== 0 && bonusConfig[k.id] !== undefined);
  const hasAttrBonus = ATTR_FIELDS.some(k => bonusConfig[k.id] !== 0 && bonusConfig[k.id] !== undefined);

  // Render fields with sections
  const renderFieldsWithSections = (fields, gridClass = 'config-bonus-grid') => {
    let currentSection = '';
    const elements = [];

    fields.forEach((field, idx) => {
      if (field.section && field.section !== currentSection) {
        currentSection = field.section;
        elements.push(
          <div key={`section-${field.section}`} className="config-bonus-section">
            {field.section}
          </div>
        );
      }
      elements.push(
        <div key={field.id} className="config-bonus-row">
          <span className="config-bonus-nom">{field.nom}</span>
          <input
            type="number"
            className="config-bonus-input"
            value={bonusConfig[field.id] || 0}
            onChange={(e) => handleBonusChange(field.id, e.target.value)}
          />
        </div>
      );
    });

    return <div className={gridClass}>{elements}</div>;
  };

  return (
    <div id="tab-config" className="tab-content active">
      <section className="section">
        <h2 className="section-title">Configuration</h2>
        <div className="config-content">
          <div className="config-option">
            <div className="config-option-header">
              <span className="config-option-label">Options</span>
            </div>
            <label className="config-toggle-row">
              <input
                type="checkbox"
                checked={!!options.magieActive}
                onChange={() => handleOptionToggle('magieActive')}
              />
              <span>Activer l'onglet Magie</span>
            </label>
            <label className="config-toggle-row">
              <input
                type="checkbox"
                checked={!!options.aptitudeActive}
                onChange={() => handleOptionToggle('aptitudeActive')}
              />
              <span>Activer l'onglet Aptitude</span>
            </label>
          </div>

          <div className="config-option">
            <div className="config-option-header">
              <span className="config-option-label">Bonus aux attributs</span>
              {hasAttrBonus && <span className="config-bonus-active">Actif</span>}
            </div>
            <p className="config-option-desc">Ajustez les bonus/malus aux attributs (équipement, effets, etc.)</p>
            <button className="btn-config" onClick={() => setActiveModal('attr')}>
              Configurer les attributs
            </button>
          </div>

          <div className="config-option">
            <div className="config-option-header">
              <span className="config-option-label">Bonus aux caractéristiques</span>
              {hasCaracBonus && <span className="config-bonus-active">Actif</span>}
            </div>
            <p className="config-option-desc">Ajustez les bonus/malus aux caractéristiques calculées</p>
            <button className="btn-config" onClick={() => setActiveModal('bonus')}>
              Configurer les bonus
            </button>
          </div>

          <div className="config-option">
            <div className="config-option-header">
              <span className="config-option-label">Bonus aux ressources max</span>
              {hasMaxBonus && <span className="config-bonus-active">Actif</span>}
            </div>
            <p className="config-option-desc">Ajustez les bonus/malus aux maximums des ressources</p>
            <button className="btn-config" onClick={() => setActiveModal('max')}>
              Configurer les max
            </button>
          </div>
        </div>
      </section>

      {/* Modal Attributs */}
      {activeModal === 'attr' && (
        <ConfigModal
          title="Bonus aux Attributs"
          onClose={() => setActiveModal(null)}
          onReset={() => resetAll(ATTR_FIELDS)}
          className="config-attr-modal"
        >
          {renderFieldsWithSections(ATTR_FIELDS, 'config-attr-grid')}
        </ConfigModal>
      )}

      {/* Modal Bonus Caractéristiques */}
      {activeModal === 'bonus' && (
        <ConfigModal
          title="Bonus aux Caractéristiques"
          onClose={() => setActiveModal(null)}
          onReset={() => resetAll(CARAC_FIELDS)}
        >
          {renderFieldsWithSections(CARAC_FIELDS, 'config-bonus-grid')}
        </ConfigModal>
      )}

      {/* Modal Max Ressources */}
      {activeModal === 'max' && (
        <ConfigModal
          title="Bonus aux Ressources Max"
          onClose={() => setActiveModal(null)}
          onReset={() => resetAll(MAX_FIELDS)}
          className="config-max-modal"
        >
          <div className="config-max-grid">
            {MAX_FIELDS.map(field => (
              <div key={field.id} className="config-bonus-row">
                <span className="config-bonus-nom">{field.nom}</span>
                <input
                  type="number"
                  className="config-bonus-input"
                  value={bonusConfig[field.id] || 0}
                  onChange={(e) => handleBonusChange(field.id, e.target.value)}
                />
              </div>
            ))}
          </div>
        </ConfigModal>
      )}
    </div>
  );
}

function ConfigModal({ title, children, onClose, onReset, className = '' }) {
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className={`config-modal-content ${className}`}>
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="config-modal-body">
          {children}
        </div>
        <div className="config-modal-footer">
          <button className="btn-config-reset" onClick={onReset}>Réinitialiser</button>
          <button className="btn-config-apply" onClick={onClose}>Fermer</button>
        </div>
      </div>
    </div>
  );
}

export default TabConfig;
