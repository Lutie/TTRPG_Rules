import { useState } from 'react';

/**
 * Modal accordion générique pour sélectionner un élément parmi une liste.
 *
 * Props :
 *   title        — titre de la modale
 *   items        — [{ id, nom, description?, subtitle? }]
 *   currentValue — id de la sélection courante
 *   onSelect     — (id) => void
 *   onClose      — () => void
 *   searchable   — affiche un champ de recherche (défaut: false)
 *   wide         — modale plus large pour les listes denses (défaut: false)
 *   renderExtra  — (item) => JSX, rendu additionnel dans le volet ouvert
 */
export default function PickerModal({
  title, items, currentValue, onSelect, onClose,
  searchable = false, wide = false, renderExtra,
}) {
  const [search, setSearch]       = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const toggle = (id) => setExpandedId(prev => prev === id ? null : id);

  const displayed = searchable && search.trim()
    ? items.filter(item =>
        item.nom.toLowerCase().includes(search.toLowerCase().trim()) ||
        item.description?.toLowerCase().includes(search.toLowerCase().trim())
      )
    : items;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className={`modal-content picker-modal-content${wide ? ' picker-modal-content--wide' : ''}`}
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {searchable && (
          <div className="picker-search">
            <input
              type="text"
              className="picker-search-input"
              placeholder="Rechercher…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        )}

        <div className="picker-list">
          {displayed.map(item => {
            const isSelected = currentValue === item.id;
            const isExpanded = expandedId === item.id;
            return (
              <div
                key={item.id}
                className={`picker-item${isSelected ? ' picker-item--selected' : ''}${isExpanded ? ' picker-item--expanded' : ''}`}
              >
                <button className="picker-item-header" onClick={() => toggle(item.id)}>
                  <span className="picker-item-name">
                    <span className="picker-item-name-row">
                      <span>{item.nom}</span>
                      {item.culturel && <span className="picker-item-culturel">culturel</span>}
                    </span>
                    {item.subtitle && <span className="picker-item-subtitle">{item.subtitle}</span>}
                  </span>
                  <span className="picker-item-right">
                    {isSelected && <span className="picker-item-badge">✓</span>}
                    <span className="picker-item-chevron">{isExpanded ? '▲' : '▼'}</span>
                  </span>
                </button>

                {isExpanded && (
                  <div className="picker-item-body">
                    {item.description
                      ? <p className="picker-item-desc">{item.description}</p>
                      : <p className="picker-item-desc picker-item-desc--empty">Aucune description disponible pour l'instant.</p>
                    }
                    {renderExtra?.(item)}
                    <div className="picker-item-footer">
                      <button
                        className={`btn-picker-select${isSelected ? ' btn-picker-select--active' : ''}`}
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
          {displayed.length === 0 && (
            <div className="picker-no-results">Aucun résultat.</div>
          )}
        </div>
      </div>
    </div>
  );
}
