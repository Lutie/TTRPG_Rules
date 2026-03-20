import { useState } from 'react';

const RESSOURCES = [
  { id: 'PE', icone: '⚡', color: '#e6a820' },
  { id: 'PV', icone: '❤️', color: '#c62828' },
  { id: 'PS', icone: '💙', color: '#1565c0' },
  { id: 'PC', icone: '💠', color: '#00838f' },
  { id: 'PK', icone: '⭐', color: '#f9a825' },
  { id: 'PM', icone: '🔮', color: '#6a1b9a' },
];

// Stats ajustables avec +/-
const STATS = [
  { id: 'armure_physique', label: 'Arm.Phys',  icone: '🛡️', maxField: 'armure_physique_max' },
  { id: 'armure_mentale',  label: 'Arm.Ment',  icone: '🧠', maxField: 'armure_mentale_max'  },
  {
    id: 'initiative', label: 'Initiative', icone: '🎲',
    hint: npc => npc.ajustement_initiative ? `adj. ${npc.ajustement_initiative >= 0 ? '+' : ''}${npc.ajustement_initiative}` : null,
  },
  {
    id: 'moral', label: 'Moral', icone: '💚',
    hint: npc => npc.moral_perso ? `⚙ ${npc.moral_perso}` : null,
  },
];

function NpcCard({ npc, onRemove, onUpdate }) {
  const ressources = npc.ressources || {};
  const [note, setNote] = useState(npc.note || '');

  const adjustRes = (resId, delta) => {
    const r = ressources[resId] || { actuel: 0, max: 0 };
    const newActuel = Math.max(0, Math.min(r.max, r.actuel + delta));
    if (newActuel === r.actuel) return;
    onUpdate({ ressources: { ...ressources, [resId]: { ...r, actuel: newActuel } } });
  };

  const adjustStat = (statId, delta) => {
    const current = npc[statId] || 0;
    const next = Math.max(0, current + delta);
    if (next === current) return;
    onUpdate({ [statId]: next });
  };

  const activeRes = RESSOURCES.filter(r => {
    const v = ressources[r.id];
    return v && v.max > 0;
  });

  return (
    <div className="npc-card">
      <div className="npc-card-header">
        <span className="npc-card-nom">{npc.nom}</span>
        <button className="btn-card-delete" onClick={onRemove} title="Retirer">✕</button>
      </div>

      {activeRes.length > 0 && (
        <div className="npc-card-ressources">
          {activeRes.map(res => {
            const r = ressources[res.id] || { actuel: 0, max: 0 };
            const pct = r.max > 0 ? Math.min(100, (r.actuel / r.max) * 100) : 0;
            return (
              <div key={res.id} className="npc-res-row">
                <span className="char-res-icon">{res.icone}</span>
                <span className="char-res-label">{res.id}</span>
                <div className="char-res-bar-container">
                  <div className="char-res-bar-fill" style={{ width: `${pct}%`, backgroundColor: res.color }} />
                </div>
                <span className="npc-res-values">{r.actuel}/{r.max}</span>
                <button className="npc-adj-btn" onClick={() => adjustRes(res.id, -1)}>−</button>
                <button className="npc-adj-btn" onClick={() => adjustRes(res.id, +1)}>+</button>
              </div>
            );
          })}
        </div>
      )}

      <div className="npc-card-stats">
        {STATS.map(stat => {
          const hint = stat.hint ? stat.hint(npc) : null;
          return (
            <div key={stat.id} className="npc-stat-row">
              <span className="npc-stat-icon">{stat.icone}</span>
              <span className="npc-stat-label" title={hint || undefined}>{stat.label}</span>
              {stat.id === 'initiative' && (
                <button className="npc-adj-btn npc-adj-btn-wide" onClick={() => adjustStat('initiative', -5)}>−5</button>
              )}
              <button className="npc-adj-btn" onClick={() => adjustStat(stat.id, -1)}>−</button>
              <span className="npc-stat-value">
                {npc[stat.id] || 0}
                {stat.maxField && <span className="npc-stat-max">/{npc[stat.maxField] ?? npc[stat.id] ?? 0}</span>}
              </span>
              <button className="npc-adj-btn" onClick={() => adjustStat(stat.id, +1)}>+</button>
            </div>
          );
        })}
      </div>

      <textarea
        className="npc-note"
        value={note}
        onChange={e => setNote(e.target.value)}
        onBlur={() => onUpdate({ note })}
        placeholder="Notes temporaires…"
        rows={2}
      />
    </div>
  );
}

export default NpcCard;
