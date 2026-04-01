import { useState } from 'react';

export default function TemperamentModal({ title, items, currentValue, onSelect, onClose }) {
  const [expandedId, setExpandedId] = useState(null);

  const toggle = (id) => setExpandedId(prev => prev === id ? null : id);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content temperament-modal-content" onClick={e => e.stopPropagation()}>

        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="temperament-list">
          {items.map(item => {
            const isSelected = currentValue === item.id;
            const isExpanded = expandedId === item.id;
            return (
              <div
                key={item.id}
                className={`temperament-item${isSelected ? ' temperament-item--selected' : ''}${isExpanded ? ' temperament-item--expanded' : ''}`}
              >
                <button className="temperament-item-header" onClick={() => toggle(item.id)}>
                  <span className="temperament-item-name">{item.nom}</span>
                  <span className="temperament-item-right">
                    {isSelected && <span className="temperament-item-badge">✓</span>}
                    <span className="temperament-item-chevron">{isExpanded ? '▲' : '▼'}</span>
                  </span>
                </button>
                {isExpanded && (
                  <div className="temperament-item-body">
                    {item.description
                      ? <p className="temperament-item-desc">{item.description}</p>
                      : <p className="temperament-item-desc temperament-item-desc--empty">Aucune description disponible pour l'instant.</p>
                    }
                    <div className="temperament-item-footer">
                      <button
                        className={`btn-select-temperament${isSelected ? ' btn-select-temperament--active' : ''}`}
                        onClick={() => { onSelect(item.id); onClose(); }}
                      >
                        {isSelected ? '✓ Sélectionné' : 'Choisir'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
