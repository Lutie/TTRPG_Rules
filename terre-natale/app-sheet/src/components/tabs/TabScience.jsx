import { useState } from 'react';
import { useCharacter } from '../../context/CharacterContext';
import { useCharacterCalculations } from '../../hooks/useCharacterCalculations';
import Section from '../common/Section';

function TabScience() {
  const { character, updateCharacter } = useCharacter();
  const calc = useCharacterCalculations(character);
  const [editModal, setEditModal] = useState(null);

  const piRes = character.ressources?.PI || { actuel: 0, temporaire: 0 };
  const piMax = calc.ressourcesMax?.PI || 0;
  const piActuel = piRes.actuel || 0;
  const piTemp = piRes.temporaire || 0;
  const piTotal = piMax + piTemp;
  const piPct = piTotal > 0 ? Math.min(100, (piActuel / piTotal) * 100) : 0;
  const piPctTemp = piTotal > 0 ? Math.min(100, (piTemp / piTotal) * 100) : 0;

  const handlePI = (field, delta) => {
    updateCharacter(prev => {
      const res = prev.ressources?.PI || { actuel: 0, temporaire: 0 };
      const max = field === 'actuel' ? piTotal : piMax;
      const newVal = Math.max(0, Math.min(max, (res[field] || 0) + delta));
      return {
        ...prev,
        ressources: { ...prev.ressources, PI: { ...res, [field]: newVal } }
      };
    });
  };

  const handleEditSubmit = (value) => {
    if (!editModal) return;
    const parsed = parseInt(value, 10);
    if (isNaN(parsed)) { setEditModal(null); return; }
    updateCharacter(prev => {
      const res = prev.ressources?.PI || { actuel: 0, temporaire: 0 };
      const clamped = Math.max(0, Math.min(editModal.max, parsed));
      return {
        ...prev,
        ressources: { ...prev.ressources, PI: { ...res, [editModal.field]: clamped } }
      };
    });
    setEditModal(null);
  };

  return (
    <div id="tab-science" className="tab-content active">

      <Section title="Points d'Ingéniosité">
        <p className="status-info">
          Budget matériel en pièces (pc) — représente les scraps et composants récupérés disponibles.
          Récupération : {calc.recuperationRessource?.PI ?? calc.recuperation} / repos.
        </p>
        <div className="status-ressources-grid">
          <div className="status-ressource-box" data-ressource="PI">
            <div className="status-ressource-icone">⚙️</div>
            <div className="status-ressource-content">
              <div className="status-ressource-header">
                <span className="status-ressource-nom">Ingéniosité (PI)</span>
                <span className="status-ressource-valeurs">
                  {piActuel} / {piMax}
                  {piTemp > 0 && <span className="status-valeur-temp"> (+{piTemp})</span>}
                </span>
              </div>
              <div className="status-ressource-bar-container">
                <div className="status-ressource-bar">
                  <div className="status-ressource-bar-fill" style={{ width: `${piPct}%` }} />
                </div>
                {piTemp > 0 && (
                  <div className="status-ressource-bar-temp" style={{ width: `${piPctTemp}%`, left: `${100 - piPctTemp}%` }} />
                )}
              </div>
              <div className="status-ressource-controls">
                <span className="status-control-label">Actu</span>
                <button className="btn-status-minus" onClick={() => handlePI('actuel', -1)}>-</button>
                <button
                  className="btn-status-edit"
                  onClick={() => setEditModal({ field: 'actuel', value: piActuel, max: piTotal })}
                >
                  {piActuel}
                </button>
                <button className="btn-status-plus" onClick={() => handlePI('actuel', 1)}>+</button>
                <span className="status-separator">|</span>
                <span className="status-control-label">Temp</span>
                <button className="btn-status-minus" onClick={() => handlePI('temporaire', -1)}>-</button>
                <button
                  className="btn-status-edit"
                  onClick={() => setEditModal({ field: 'temporaire', value: piTemp, max: piMax })}
                >
                  {piTemp}
                </button>
                <button className="btn-status-plus" onClick={() => handlePI('temporaire', 1)}>+</button>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section title="Contenu à venir">
        <p className="status-info">
          Cet onglet accueillera les règles de science : gadgets, automates, recettes alchimiques, etc.
        </p>
      </Section>

      {editModal && (
        <EditValueModal
          value={editModal.value}
          max={editModal.max}
          onClose={() => setEditModal(null)}
          onSubmit={handleEditSubmit}
        />
      )}
    </div>
  );
}

function EditValueModal({ value, max, onClose, onSubmit }) {
  const [val, setVal] = useState(String(value));
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h3>Modifier la valeur</h3>
        <input
          type="number"
          min={0}
          max={max}
          value={val}
          onChange={e => setVal(e.target.value)}
          autoFocus
          onKeyDown={e => { if (e.key === 'Enter') onSubmit(val); if (e.key === 'Escape') onClose(); }}
        />
        <div className="modal-actions">
          <button onClick={() => onSubmit(val)}>OK</button>
          <button onClick={onClose}>Annuler</button>
        </div>
      </div>
    </div>
  );
}

export default TabScience;
