import { useState, useEffect } from 'react';
import CharacterCard from './CharacterCard';

function CharacterList({ characters, onDelete, isAdmin }) {
  const [expanded, setExpanded] = useState(null);
  const [characterDetails, setCharacterDetails] = useState({});
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    if (!expanded) return;
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch(`/api/characters/${expanded}`);
        if (res.ok && !cancelled) {
          const data = await res.json();
          setCharacterDetails(prev => ({ ...prev, [expanded]: data }));
        }
      } catch { /* ignore */ }
    };
    load();
    const interval = setInterval(load, 10000);
    return () => { cancelled = true; clearInterval(interval); };
  }, [expanded]);

  if (characters.length === 0) {
    return (
      <div className="character-list">
        <div className="section-header">
          <h2>Personnages reçus</h2>
        </div>
        <p className="empty-message">Aucun personnage reçu pour le moment.</p>
      </div>
    );
  }

  const formatTime = (iso) => {
    if (!iso) return 'jamais';
    const d = new Date(iso);
    return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="character-list">
      <div className="section-header">
        <h2>Personnages reçus</h2>
      </div>

      <div className="charlist-grid">
        {characters.map(c => {
          const isExpanded = expanded === c.uuid;
          const detail = characterDetails[c.uuid];
          const isStale = c.dateSync && (Date.now() - new Date(c.dateSync).getTime() > 120000);

          return (
            <div key={c.uuid} className="charlist-item-wrapper">
              {confirmDelete === c.uuid ? (
                <div className="charlist-item charlist-confirm">
                  <span>Supprimer {c.nom} ?</span>
                  <div className="campaign-confirm-actions">
                    <button className="btn-confirm-yes" onClick={() => { onDelete(c.uuid); setConfirmDelete(null); }}>Oui</button>
                    <button className="btn-confirm-no" onClick={() => setConfirmDelete(null)}>Non</button>
                  </div>
                </div>
              ) : (
                <>
                  <div
                    className={`charlist-item ${isExpanded ? 'charlist-item-active' : ''}`}
                    onClick={() => setExpanded(isExpanded ? null : c.uuid)}
                  >
                    <span className={`charlist-sync-dot ${isStale ? 'sync-stale' : 'sync-ok'}`}>
                      {isStale ? '⚠' : '●'}
                    </span>
                    {c.avatar && <img src={c.avatar} alt="" className="charlist-avatar" />}
                    <span className="charlist-nom">{c.nom}</span>
                    {c.caste && <span className="charlist-caste">{c.caste}</span>}
                    <span className="charlist-time">{formatTime(c.dateSync)}</span>
                    {isAdmin && (
                      <button
                        className="btn-card-delete charlist-delete"
                        onClick={e => { e.stopPropagation(); setConfirmDelete(c.uuid); }}
                        title="Supprimer ce personnage"
                      >✕</button>
                    )}
                  </div>
                  {isExpanded && detail && (
                    <div className="charlist-detail">
                      <CharacterCard character={detail} summary={c} onRemove={() => setExpanded(null)} />
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CharacterList;
