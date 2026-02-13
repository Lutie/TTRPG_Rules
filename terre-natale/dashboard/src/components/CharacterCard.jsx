const RESSOURCES = [
  { id: 'PE', nom: 'Endurance', icone: '⚡', color: '#e6a820' },
  { id: 'PV', nom: 'Vitalité', icone: '❤️', color: '#c62828' },
  { id: 'PS', nom: 'Spiritualité', icone: '💙', color: '#1565c0' },
  { id: 'PC', nom: 'Chi', icone: '💠', color: '#00838f' },
  { id: 'PK', nom: 'Karma', icone: '⭐', color: '#f9a825' },
  { id: 'PM', nom: 'Mana', icone: '🔮', color: '#6a1b9a' }
];

function CharacterCard({ character, summary, onRemove }) {
  if (!character && !summary) {
    return (
      <div className="char-card char-card-missing">
        <span className="char-card-nom">Personnage inconnu</span>
        <button className="btn-card-delete" onClick={onRemove} title="Retirer">✕</button>
      </div>
    );
  }

  const nom = character?.infos?.nom || summary?.nom || 'Sans nom';
  const caste = character?.caste?.nom || summary?.caste || '';
  const dateSync = character?._sync?.dateSync;
  const isStale = dateSync && (Date.now() - new Date(dateSync).getTime() > 120000);

  const ressources = character?.ressources || {};
  const tensions = character?.tensions || { fatigue: 0, corruption: 0 };
  const lesions = character?.lesions || [];
  const conditions = character?.conditions || [];

  const formatTime = (iso) => {
    if (!iso) return 'jamais';
    const d = new Date(iso);
    return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className={`char-card ${isStale ? 'char-card-stale' : ''}`}>
      <div className="char-card-header">
        <div className="char-card-identity">
          <span className="char-card-nom">{nom}</span>
          {caste && <span className="char-card-caste">{caste}</span>}
        </div>
        <button className="btn-card-delete" onClick={onRemove} title="Retirer">✕</button>
      </div>

      <div className="char-card-ressources">
        {RESSOURCES.map(res => {
          const r = ressources[res.id] || { actuel: 0, max: 0 };
          const max = r.max || 0;
          const actuel = r.actuel || 0;
          const pct = max > 0 ? Math.min(100, (actuel / max) * 100) : 0;

          return (
            <div key={res.id} className="char-res-row">
              <span className="char-res-icon">{res.icone}</span>
              <span className="char-res-label">{res.id}</span>
              <div className="char-res-bar-container">
                <div
                  className="char-res-bar-fill"
                  style={{ width: `${pct}%`, backgroundColor: res.color }}
                />
              </div>
              <span className="char-res-values">{actuel}/{max}</span>
            </div>
          );
        })}
      </div>

      {(tensions.fatigue > 0 || tensions.corruption > 0) && (
        <div className="char-card-tensions">
          {tensions.fatigue > 0 && (
            <span className="char-tension">😫 Fatigue {tensions.fatigue}</span>
          )}
          {tensions.corruption > 0 && (
            <span className="char-tension">💀 Corruption {tensions.corruption}</span>
          )}
        </div>
      )}

      {lesions.length > 0 && (
        <div className="char-card-lesions">
          <span className="char-card-tag tag-lesion">
            {lesions.length} lésion{lesions.length > 1 ? 's' : ''}
          </span>
        </div>
      )}

      {conditions.length > 0 && (
        <div className="char-card-conditions">
          {conditions.map((cond, i) => (
            <span key={i} className="char-card-tag tag-condition">
              {cond.id}{cond.avancee ? ' (Av.)' : ''} ×{cond.charges}
            </span>
          ))}
        </div>
      )}

      <div className="char-card-footer">
        <span className={`char-card-sync ${isStale ? 'sync-stale' : 'sync-ok'}`}>
          {isStale ? '⚠ ' : '● '}{formatTime(dateSync)}
        </span>
      </div>
    </div>
  );
}

export default CharacterCard;
