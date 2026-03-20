import { useState, useEffect } from 'react';
import NpcCard from './NpcCard';

const RESSOURCES = [
  { id: 'PE', icone: '⚡' },
  { id: 'PV', icone: '❤️' },
  { id: 'PS', icone: '💙' },
  { id: 'PC', icone: '💠' },
  { id: 'PK', icone: '⭐' },
  { id: 'PM', icone: '🔮' },
];

const STATS_FORM = [
  { id: 'armure_physique',      label: 'Arm. Physique',     icone: '🛡️' },
  { id: 'armure_mentale',       label: 'Arm. Mentale',      icone: '🧠' },
  { id: 'ajustement_initiative',label: 'Adj. Initiative',   icone: '🎲' },
  { id: 'moral_perso',          label: 'Moral (perso)',     icone: '💚' },
];

const defaultForm = () => ({
  nom: '',
  ressources: Object.fromEntries(RESSOURCES.map(r => [r.id, { actuel: 0, max: 0 }])),
  armure_physique: 0,
  armure_mentale: 0,
  ajustement_initiative: 0,
  moral_perso: 0,
  saveAsPreset: false,
});

const roll3d6 = () => [0, 0, 0].reduce(acc => acc + Math.floor(Math.random() * 6) + 1, 0);

function ConfrontationView({ confrontation, onBack, onUpdate }) {
  const [showModal, setShowModal] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [form, setForm] = useState(defaultForm());
  const [presets, setPresets] = useState([]);
  const [showInitModal, setShowInitModal] = useState(false);
  const [initRolls, setInitRolls] = useState({});

  const fetchPresets = async () => {
    const res = await fetch('/api/npc-presets');
    if (res.ok) setPresets(await res.json());
  };

  useEffect(() => { fetchPresets(); }, []);

  const applyPreset = (presetId) => {
    const preset = presets.find(p => p.id === presetId);
    if (!preset) return;
    setForm(prev => ({
      ...prev,
      nom: preset.nom,
      ressources: { ...defaultForm().ressources, ...preset.ressources },
      armure_physique: preset.armure_physique || 0,
      armure_mentale: preset.armure_mentale || 0,
      ajustement_initiative: preset.ajustement_initiative || 0,
      moral_perso: preset.moral_perso || 0,
    }));
  };

  const setResMax = (resId, value) => {
    const max = Math.max(0, parseInt(value) || 0);
    setForm(prev => ({
      ...prev,
      ressources: { ...prev.ressources, [resId]: { actuel: max, max } },
    }));
  };

  const setStatVal = (statId, value) => {
    setForm(prev => ({ ...prev, [statId]: Math.max(0, parseInt(value) || 0) }));
  };

  const handleAddNpc = async () => {
    if (!form.nom.trim()) return;

    if (form.saveAsPreset) {
      await fetch('/api/npc-presets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom: form.nom.trim(),
          ressources: form.ressources,
          armure_physique: form.armure_physique,
          armure_mentale: form.armure_mentale,
          ajustement_initiative: form.ajustement_initiative,
          moral_perso: form.moral_perso,
        }),
      });
      await fetchPresets();
    }

    const npc = {
      id: crypto.randomUUID(),
      nom: form.nom.trim(),
      ressources: form.ressources,
      armure_physique: form.armure_physique,
      armure_physique_max: form.armure_physique,
      armure_mentale: form.armure_mentale,
      armure_mentale_max: form.armure_mentale,
      ajustement_initiative: form.ajustement_initiative,
      initiative: 0,
      moral_perso: form.moral_perso,
      moral: 0,
      note: '',
    };

    await onUpdate({ npcs: [...confrontation.npcs, npc] });
    setForm(defaultForm());
    setShowModal(false);
  };

  // --- Initiative : calcul résultat ---
  const calcResult = (dice, adj = 0) => {
    const sixes = dice.filter(d => d === 6).length;
    const ones  = dice.filter(d => d === 1).length;
    const sum   = dice.reduce((a, b) => a + b, 0);
    if (sixes >= 2) {
      const bonusIdx = dice.findIndex(d => d !== 6);
      const bonus    = bonusIdx >= 0 ? dice[bonusIdx] : 6;
      return { total: sum + bonus + adj, isExploit: true, isMaladresse: false, bonusIdx };
    }
    if (ones >= 2) {
      const ignoredIdx = dice.findIndex(d => d !== 1);
      const total = dice
        .filter((_, i) => i !== ignoredIdx)
        .reduce((a, b) => a + b, 0) + adj;
      return { total, isMaladresse: true, isExploit: false, ignoredIdx };
    }
    return { total: sum + adj, isExploit: false, isMaladresse: false };
  };

  const mkRoll = (npc) => {
    const dice = [0, 0, 0].map(() => Math.floor(Math.random() * 6) + 1);
    return { dice, rerollCount: 0, ...calcResult(dice, npc.ajustement_initiative || 0) };
  };

  const handleNouveauRound = () => {
    const npcs = confrontation.npcs.map(n => ({ ...n, initiative: (n.initiative || 0) - 10 }));
    onUpdate({ npcs });
  };

  const openInitModal = () => {
    // Reset armures physique et mentale au max au début d'un nouveau tour
    const npcs = confrontation.npcs.map(n => ({
      ...n,
      armure_physique: n.armure_physique_max ?? n.armure_physique,
      armure_mentale:  n.armure_mentale_max  ?? n.armure_mentale,
    }));
    onUpdate({ npcs });
    setInitRolls({});
    setShowInitModal(true);
  };

  const rollAll = () => {
    const rolls = {};
    confrontation.npcs.forEach(n => { rolls[n.id] = mkRoll(n); });
    setInitRolls(rolls);
  };

  const rollOneNpc = (npcId) => {
    const npc = confrontation.npcs.find(n => n.id === npcId);
    if (npc) setInitRolls(prev => ({ ...prev, [npcId]: mkRoll(npc) }));
  };

  const rerollDie = (npcId, dieIndex, cost, npc) => {
    // Prélever les PK immédiatement
    const pk = npc.ressources?.PK || { actuel: 0, max: 0 };
    handleUpdateNpc(npcId, {
      ressources: { ...npc.ressources, PK: { ...pk, actuel: Math.max(0, pk.actuel - cost) } },
    });
    // Relancer le dé
    setInitRolls(prev => {
      const roll = prev[npcId];
      if (!roll) return prev;
      const newDice = [...roll.dice];
      newDice[dieIndex] = Math.floor(Math.random() * 6) + 1;
      const newCount = roll.rerollCount + 1;
      return { ...prev, [npcId]: { dice: newDice, rerollCount: newCount, ...calcResult(newDice, npc.ajustement_initiative || 0) } };
    });
  };

  const confirmInit = () => {
    const npcs = confrontation.npcs.map(n => ({
      ...n,
      initiative: initRolls[n.id]?.total ?? n.initiative,
    }));
    onUpdate({ npcs });
    setShowInitModal(false);
  };

  const handleInitialisationMoral = () => {
    const total = confrontation.npcs.reduce((sum, n) => sum + (n.moral_perso || 0), 0);
    const npcs = confrontation.npcs.map(n => ({ ...n, moral: total }));
    onUpdate({ npcs });
  };

  const handleDeletePreset = async (id) => {
    await fetch(`/api/npc-presets/${id}`, { method: 'DELETE' });
    await fetchPresets();
  };

  const handleRemoveNpc = (npcId) => {
    onUpdate({ npcs: confrontation.npcs.filter(n => n.id !== npcId) });
  };

  const handleUpdateNpc = (npcId, updates) => {
    const npcs = confrontation.npcs.map(n => n.id === npcId ? { ...n, ...updates } : n);
    onUpdate({ npcs });
  };

  return (
    <div>
      <div className="campaign-view-header">
        <button className="btn-back" onClick={onBack}>← Retour</button>
        <h2>⚔ {confrontation.nom}</h2>
        <button className="btn-back" onClick={() => setShowPresets(s => !s)}>
          {showPresets ? 'Fermer presets' : 'Presets'}
        </button>
        <button className="btn-back" onClick={handleInitialisationMoral} title="Moral = somme des Moral (perso) de tous les PNJs">
          Initialisation
        </button>
        <button className="btn-back" onClick={handleNouveauRound}>
          Nouveau round
        </button>
        <button className="btn-back" onClick={openInitModal}>
          Nouveau tour
        </button>
        <button className="btn-add-char" onClick={() => setShowModal(true)}>+ PNJ</button>
      </div>

      {showPresets && (
        <div className="presets-manager">
          <div className="presets-manager-header">Presets enregistrés</div>
          {presets.length === 0 ? (
            <p className="empty-message" style={{ padding: '10px' }}>Aucun preset enregistré.</p>
          ) : (
            <ul className="presets-list">
              {presets.map(p => (
                <li key={p.id} className="preset-item">
                  <span className="preset-item-nom">{p.nom}</span>
                  <span className="preset-item-meta">
                    PV {p.ressources?.PV?.max || 0} · PE {p.ressources?.PE?.max || 0} · Adj.Init {p.ajustement_initiative || 0} · Moral⚙ {p.moral_perso || 0}
                  </span>
                  <button
                    className="btn-confirm-yes"
                    onClick={() => handleDeletePreset(p.id)}
                    title="Supprimer ce preset"
                  >✕</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {confrontation.npcs.length === 0 && (
        <p className="empty-message">Aucun PNJ dans cette scène. Ajoutez-en un.</p>
      )}

      <div className="npcs-grid">
        {confrontation.npcs.map(npc => (
          <NpcCard
            key={npc.id}
            npc={npc}
            onRemove={() => handleRemoveNpc(npc.id)}
            onUpdate={(updates) => handleUpdateNpc(npc.id, updates)}
          />
        ))}
      </div>

      {showModal && (
        <div className="npc-modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="npc-modal">
            <div className="npc-modal-header">
              <h3>Nouveau PNJ</h3>
              <button className="btn-card-delete" onClick={() => setShowModal(false)}>✕</button>
            </div>

            {presets.length > 0 && (
              <div className="npc-modal-field">
                <label className="npc-modal-label">Preset</label>
                <select
                  className="npc-modal-select"
                  defaultValue=""
                  onChange={e => applyPreset(e.target.value)}
                >
                  <option value="">— Choisir un preset —</option>
                  {presets.map(p => (
                    <option key={p.id} value={p.id}>{p.nom}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="npc-modal-field">
              <label className="npc-modal-label">Nom *</label>
              <input
                type="text"
                className="npc-modal-input"
                placeholder="Nom du PNJ"
                value={form.nom}
                onChange={e => setForm(prev => ({ ...prev, nom: e.target.value }))}
                autoFocus
              />
            </div>

            <div className="npc-modal-section-label">Ressources (max)</div>
            <div className="npc-modal-grid">
              {RESSOURCES.map(res => (
                <label key={res.id} className="npc-form-res-label">
                  <span>{res.icone} {res.id}</span>
                  <input
                    type="number"
                    min="0"
                    className="npc-modal-num"
                    value={form.ressources[res.id].max || ''}
                    placeholder="0"
                    onChange={e => setResMax(res.id, e.target.value)}
                  />
                </label>
              ))}
            </div>

            <div className="npc-modal-section-label">Statistiques</div>
            <div className="npc-modal-grid">
              {STATS_FORM.map(stat => (
                <label key={stat.id} className="npc-form-res-label">
                  <span>{stat.icone} {stat.label}</span>
                  <input
                    type="number"
                    min="0"
                    className="npc-modal-num"
                    value={form[stat.id] || ''}
                    placeholder="0"
                    onChange={e => setStatVal(stat.id, e.target.value)}
                  />
                </label>
              ))}
            </div>

            <label className="npc-modal-preset-check">
              <input
                type="checkbox"
                checked={form.saveAsPreset}
                onChange={e => setForm(prev => ({ ...prev, saveAsPreset: e.target.checked }))}
              />
              Enregistrer comme preset
            </label>

            <div className="npc-modal-footer">
              <button className="btn-back" onClick={() => setShowModal(false)}>Annuler</button>
              <button className="btn-create" onClick={handleAddNpc}>Ajouter</button>
            </div>
          </div>
        </div>
      )}

      {showInitModal && (
        <div className="npc-modal-overlay" onClick={e => e.target === e.currentTarget && setShowInitModal(false)}>
          <div className="npc-modal init-modal">
            <div className="npc-modal-header">
              <h3>🎲 Initiative — Nouveau tour</h3>
              <button className="btn-card-delete" onClick={() => setShowInitModal(false)}>✕</button>
            </div>

            <div className="init-npc-list">
              {confrontation.npcs.map(n => {
                const roll = initRolls[n.id];
                return (
                  <div key={n.id} className="init-npc-card">
                    <div className="init-npc-header">
                      <span className="init-npc-nom">{n.nom}</span>
                      {!!n.ajustement_initiative && (
                        <span className="init-npc-adj">adj. {n.ajustement_initiative > 0 ? '+' : ''}{n.ajustement_initiative}</span>
                      )}
                      {roll && (
                        <span className={`init-total-badge ${roll.isExploit ? 'badge-exploit' : roll.isMaladresse ? 'badge-mala' : ''}`}>
                          = {roll.total}
                          {roll.isExploit && ' ⭐'}
                          {roll.isMaladresse && ' 💥'}
                        </span>
                      )}
                      <button className="init-reroll-npc-btn" onClick={() => rollOneNpc(n.id)}>
                        Relancer tout
                      </button>
                    </div>

                    {roll ? (
                      <div className="init-dice-row">
                        {roll.dice.map((d, i) => {
                          const cost = (6 - d) + roll.rerollCount;
                          const isExploitDie = roll.isExploit && d === 6 && roll.bonusIdx !== i;
                          const isBonusDie   = roll.isExploit && roll.bonusIdx === i;
                          const isMalaDie    = roll.isMaladresse && d === 1;
                          const isIgnored    = roll.isMaladresse && roll.ignoredIdx === i;
                          return (
                            <div key={i} className="init-die-wrap">
                              <div className={[
                                'init-die',
                                isExploitDie ? 'die-six' : '',
                                isBonusDie   ? 'die-bonus' : '',
                                isMalaDie    ? 'die-one' : '',
                                isIgnored    ? 'die-ignored' : '',
                              ].filter(Boolean).join(' ')}>
                                {d}
                              </div>
                              <button
                                className="init-reroll-btn"
                                onClick={() => rerollDie(n.id, i, cost, n)}
                                title={`Coût : ${cost} PK`}
                                disabled={(n.ressources?.PK?.actuel ?? 0) < cost}
                              >
                                R {cost}pk
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="init-dice-row init-dice-empty">—</div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="npc-modal-footer">
              <button className="btn-back" onClick={() => setShowInitModal(false)}>Annuler</button>
              <button className="btn-back" onClick={rollAll}>Lancer l'initiative</button>
              <button className="btn-create" onClick={confirmInit} disabled={Object.keys(initRolls).length === 0}>
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ConfrontationView;
