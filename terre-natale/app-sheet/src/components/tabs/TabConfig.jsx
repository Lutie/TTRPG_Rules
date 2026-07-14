import { useState, useCallback } from 'react';
import { useCharacter } from '../../context/CharacterContext';

// ─── Définition de tous les types de bonus (pour le select) ──────────────────

const BONUS_GROUPS = [
  {
    groupe: 'Attributs — Corps',
    types: [
      { id: 'attrFOR', nom: 'Force' },
      { id: 'attrDEX', nom: 'Dextérité' },
      { id: 'attrAGI', nom: 'Agilité' },
      { id: 'attrCON', nom: 'Constitution' },
      { id: 'attrPER', nom: 'Perception' },
    ]
  },
  {
    groupe: 'Attributs — Esprit',
    types: [
      { id: 'attrCHA', nom: 'Charisme' },
      { id: 'attrINT', nom: 'Intelligence' },
      { id: 'attrRUS', nom: 'Ruse' },
      { id: 'attrVOL', nom: 'Volonté' },
      { id: 'attrSAG', nom: 'Sagesse' },
    ]
  },
  {
    groupe: 'Attributs — Spéciaux',
    types: [
      { id: 'attrMAG', nom: 'Magie' },
      { id: 'attrLOG', nom: 'Logique' },
      { id: 'attrCHN', nom: 'Chance' },
    ]
  },
  {
    groupe: 'Attributs — Secondaires',
    types: [
      { id: 'attrSTA', nom: 'Stature' },
      { id: 'attrTAI', nom: 'Taille' },
      { id: 'attrEGO', nom: 'Ego' },
      { id: 'attrAPP', nom: 'Apparence' },
    ]
  },
  {
    groupe: 'Ressources Max',
    types: [
      { id: 'maxPV', nom: 'Max PV' },
      { id: 'maxPS', nom: 'Max PS' },
      { id: 'maxPE', nom: 'Max PE' },
      { id: 'maxPM', nom: 'Max PM' },
      { id: 'maxPK', nom: 'Max PK' },
      { id: 'maxPC', nom: 'Max PC' },
    ]
  },
  {
    groupe: 'Général',
    types: [
      { id: 'pa',      nom: 'Budget PA' },
      { id: 'paMax',   nom: 'Max Attribut (PA)' },
      { id: 'xp',      nom: 'Budget XP' },
      { id: 'allure', nom: 'Allure' },
      { id: 'resilience', nom: 'Résilience' },
      { id: 'encombrement', nom: 'Encombrement Max' },
      { id: 'chargeMax', nom: 'Charge Max' },
      { id: 'memoire', nom: 'Mémoire' },
    ]
  },
  {
    groupe: 'Combat',
    types: [
      { id: 'protectionPhysique', nom: 'Prot. Nat. Physique' },
      { id: 'protectionMentale', nom: 'Prot. Nat. Mentale' },
      { id: 'absorptionPhysique', nom: 'Abs. Nat. Physique' },
      { id: 'absorptionMentale', nom: 'Abs. Nat. Mentale' },
      { id: 'poigne', nom: 'Poigne' },
      { id: 'prouessesInnees', nom: 'Prouesses Innées' },
      { id: 'moral', nom: 'Moral' },
      { id: 'perfPhysique', nom: 'Perf. Nat. Physique' },
      { id: 'perfMentale', nom: 'Perf. Nat. Mentale' },
      { id: 'attritionPhysique', nom: 'Attrition Nat. Phys.' },
      { id: 'attritionMentale', nom: 'Attrition Nat. Ment.' },
      { id: 'controleActif', nom: 'Contrôle Actif' },
      { id: 'controlePassif', nom: 'Contrôle Passif' },
      { id: 'techniqueMax', nom: 'Technique Max' },
      { id: 'expertisePhysique', nom: 'Expertise Physique' },
      { id: 'expertiseMentale', nom: 'Expertise Mentale' },
      { id: 'precisionPhysique', nom: 'Précision Physique' },
      { id: 'precisionMentale', nom: 'Précision Mentale' },
    ]
  },
  {
    groupe: 'Magie',
    types: [
      { id: 'memoireDesSorts', nom: 'Mémoire des Sorts' },
      { id: 'porteeMagique', nom: 'Portée Magique' },
      { id: 'tempsIncantation', nom: 'Temps Incantation' },
      { id: 'expertiseMagique', nom: 'Expertise Magique' },
      { id: 'resistanceDrain', nom: 'Résist. Drain' },
      { id: 'puissanceInvocatrice', nom: 'Puiss. Invocatrice' },
      { id: 'puissanceSoinsDegats', nom: 'Puiss. Soins/Dégâts' },
      { id: 'puissancePositive', nom: 'Puiss. Positive' },
      { id: 'puissanceNegative', nom: 'Puiss. Négative' },
      { id: 'puissanceGenerique', nom: 'Puiss. Générique' },
    ]
  },
  {
    groupe: 'Résiliences',
    types: [
      { id: 'resiliencePhysique', nom: 'Résil. Physique' },
      { id: 'resilienceMentale', nom: 'Résil. Mentale' },
      { id: 'resilienceMagique', nom: 'Résil. Magique' },
      { id: 'resilienceNerf', nom: 'Résil. Nerf' },
      { id: 'resilienceCorruption', nom: 'Résil. Corruption' },
      { id: 'resilienceFatigue', nom: 'Résil. Fatigue' },
    ]
  },
  {
    groupe: 'Récupération',
    types: [
      { id: 'recuperation', nom: 'Récupération (base)' },
      { id: 'recuperationPV', nom: 'Récup. PV' },
      { id: 'recuperationPS', nom: 'Récup. PS' },
      { id: 'recuperationPE', nom: 'Récup. PE' },
      { id: 'recuperationPM', nom: 'Récup. PM' },
      { id: 'recuperationPK', nom: 'Récup. PK' },
      { id: 'recuperationPC', nom: 'Récup. PC' },
    ]
  },
];

// Lookup rapide id → nom
const BONUS_TYPE_LABEL = {};
BONUS_GROUPS.forEach(g => g.types.forEach(t => { BONUS_TYPE_LABEL[t.id] = t.nom; }));

// ─── Composant principal ──────────────────────────────────────────────────────

function TabConfig() {
  const {
    character, updateCharacter,
    dashboardUrl, setDashboardUrl,
    syncEnabled, setSyncEnabled,
    playerToken, setPlayerToken,
    pullFromDashboard
  } = useCharacter();

  const [urlInput, setUrlInput]       = useState(dashboardUrl);
  const [tokenInput, setTokenInput]   = useState(playerToken);
  const [tokenStatus, setTokenStatus] = useState(null);
  const [pullStatus, setPullStatus]   = useState(null);
  const [showForm, setShowForm]       = useState(false);
  const [newType, setNewType]         = useState('');
  const [newOrigine, setNewOrigine]   = useState('');
  const [newValeur, setNewValeur]     = useState(0);
  const [showSummary, setShowSummary] = useState(false);

  const options      = character.options || {};
  const bonusEntries = character.bonusEntries || [];

  // ── Options ──

  const handleOptionToggle = (key) => {
    updateCharacter(prev => ({
      ...prev,
      options: { ...prev.options, [key]: !prev.options?.[key] }
    }));
  };

  // ── Bonus entries ──

  const addEntry = () => {
    if (!newType || newValeur === 0) return;
    updateCharacter(prev => ({
      ...prev,
      bonusEntries: [
        ...(prev.bonusEntries || []),
        { type: newType, origine: newOrigine.trim(), valeur: parseInt(newValeur) || 0 }
      ]
    }));
    setNewOrigine('');
    setNewValeur(0);
    // Garde le type sélectionné pour faciliter la saisie de plusieurs bonus du même type
  };

  const removeEntry = (index) => {
    updateCharacter(prev => ({
      ...prev,
      bonusEntries: (prev.bonusEntries || []).filter((_, i) => i !== index)
    }));
  };

  // Totaux par type (pour le récap)
  const totaux = {};
  bonusEntries.forEach(e => {
    if (e.type) totaux[e.type] = (totaux[e.type] || 0) + (e.valeur || 0);
  });
  const totauxNonNuls = Object.entries(totaux).filter(([, v]) => v !== 0);

  // ── Dashboard ──

  const handleVerifyToken = useCallback(async () => {
    const token = tokenInput.trim().toUpperCase();
    if (!token) return;
    setTokenStatus(null);
    try {
      const res = await fetch(`${dashboardUrl}/api/players/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
      if (res.ok) {
        const data = await res.json();
        setPlayerToken(token);
        setTokenStatus({ ok: true, nom: data.nom });
      } else {
        setTokenStatus({ ok: false, error: 'Token invalide' });
      }
    } catch {
      setTokenStatus({ ok: false, error: 'Impossible de joindre le dashboard' });
    }
  }, [tokenInput, dashboardUrl, setPlayerToken]);

  const handlePull = useCallback(async () => {
    setPullStatus(null);
    const result = await pullFromDashboard();
    setPullStatus(result);
    setTimeout(() => setPullStatus(null), 5000);
  }, [pullFromDashboard]);

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div id="tab-config" className="tab-content active">
      <section className="section">
        <h2 className="section-title">Configuration</h2>
        <div className="config-content">

          {/* ── Options ── */}
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
            <label className="config-toggle-row">
              <input
                type="checkbox"
                checked={!!options.scienceActive}
                onChange={() => handleOptionToggle('scienceActive')}
              />
              <span>Activer l'onglet Science (Steam)</span>
            </label>
          </div>

          {/* ── Bonus ── */}
          <div className="config-option">
            <div className="config-option-header">
              <span className="config-option-label">
                Bonus
                {bonusEntries.length > 0 && (
                  <span className="config-bonus-active">{bonusEntries.length} entrée{bonusEntries.length > 1 ? 's' : ''}</span>
                )}
              </span>
            </div>
            <p className="config-option-desc">
              Ajoutez ici tous les bonus/malus provenant d'équipements, effets, sorts, etc.
            </p>

            {/* Liste des entrées */}
            {bonusEntries.length > 0 && (
              <div className="bonus-list">
                {bonusEntries.map((e, i) => (
                  <div key={i} className="bonus-entry">
                    <span className="bonus-entry-type">{BONUS_TYPE_LABEL[e.type] || e.type}</span>
                    {e.origine && <span className="bonus-entry-origine">{e.origine}</span>}
                    <span className={`bonus-entry-val ${e.valeur > 0 ? 'positive' : e.valeur < 0 ? 'negative' : ''}`}>
                      {e.valeur > 0 ? `+${e.valeur}` : e.valeur}
                    </span>
                    <button className="bonus-entry-del" onClick={() => removeEntry(i)} title="Supprimer">✕</button>
                  </div>
                ))}
              </div>
            )}

            {/* Formulaire d'ajout */}
            {showForm ? (
              <div className="bonus-add-form">
                <select
                  className="bonus-select"
                  value={newType}
                  onChange={e => setNewType(e.target.value)}
                >
                  <option value="">— Type de bonus —</option>
                  {BONUS_GROUPS.map(g => (
                    <optgroup key={g.groupe} label={g.groupe}>
                      {g.types.map(t => (
                        <option key={t.id} value={t.id}>{t.nom}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                <input
                  type="text"
                  className="bonus-origine-input"
                  placeholder="Origine (ex: Anneau +2)"
                  value={newOrigine}
                  onChange={e => setNewOrigine(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') addEntry(); }}
                />
                <input
                  type="number"
                  className="bonus-val-input"
                  value={newValeur}
                  onChange={e => setNewValeur(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') addEntry(); }}
                />
                <button
                  className="btn-bonus-add"
                  onClick={addEntry}
                  disabled={!newType || newValeur === 0}
                >
                  Ajouter
                </button>
                <button className="btn-bonus-cancel" onClick={() => setShowForm(false)}>✕</button>
              </div>
            ) : (
              <button className="btn-bonus-new" onClick={() => setShowForm(true)}>
                + Ajouter un bonus
              </button>
            )}

            {/* Récapitulatif */}
            {totauxNonNuls.length > 0 && (
              <div className="bonus-summary-section">
                <button
                  className="btn-bonus-summary-toggle"
                  onClick={() => setShowSummary(s => !s)}
                >
                  {showSummary ? '▲' : '▼'} Récapitulatif ({totauxNonNuls.length} type{totauxNonNuls.length > 1 ? 's' : ''})
                </button>
                {showSummary && (
                  <div className="bonus-summary">
                    {totauxNonNuls.map(([type, total]) => (
                      <div key={type} className="bonus-summary-row">
                        <span className="bonus-summary-type">{BONUS_TYPE_LABEL[type] || type}</span>
                        <span className={`bonus-summary-total ${total > 0 ? 'positive' : 'negative'}`}>
                          {total > 0 ? `+${total}` : total}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Dashboard & Identité ── */}
          <div className="config-option">
            <div className="config-option-header">
              <span className="config-option-label">Dashboard & Identité joueur</span>
              {syncEnabled && dashboardUrl && playerToken && <span className="config-bonus-active">Sync active</span>}
            </div>

            <div className="config-subsection">
              <span className="config-subsection-label">Synchronisation</span>
              <p className="config-option-desc">URL du serveur dashboard pour la synchronisation automatique</p>
              <label className="config-toggle-row">
                <input
                  type="checkbox"
                  checked={!!syncEnabled}
                  onChange={() => setSyncEnabled(!syncEnabled)}
                />
                <span>Activer la synchronisation</span>
              </label>
              <div className="charselect-dashboard-row">
                <input
                  type="text"
                  placeholder="https://dash.thalifen.synology.me"
                  value={urlInput}
                  onChange={e => setUrlInput(e.target.value)}
                  onBlur={() => setDashboardUrl(urlInput)}
                  onKeyDown={e => { if (e.key === 'Enter') { setDashboardUrl(urlInput); e.target.blur(); } }}
                  className="config-url-input"
                />
              </div>
            </div>

            <div className="config-subsection-divider" />

            <div className="config-subsection">
              <span className="config-subsection-label">
                Identité joueur
                {playerToken && <span className="config-bonus-active" style={{marginLeft: '8px'}}>Actif</span>}
              </span>
              <p className="config-option-desc">
                Token fourni par le MJ. Permet de récupérer vos personnages depuis n'importe quel navigateur.
                {!syncEnabled && <span className="config-option-desc-warn"> La synchronisation doit être activée ci-dessus pour envoyer vos personnages au dashboard.</span>}
              </p>
              <div className="config-token-row">
                <input
                  type="text"
                  placeholder="XXXX-XXXX"
                  value={tokenInput}
                  onChange={e => setTokenInput(e.target.value.toUpperCase())}
                  onKeyDown={e => { if (e.key === 'Enter') handleVerifyToken(); }}
                  className="config-url-input"
                  maxLength={9}
                />
                <button className="btn-config" onClick={handleVerifyToken}>Vérifier</button>
              </div>
              {tokenStatus && (
                <p className={`config-token-status ${tokenStatus.ok ? 'token-ok' : 'token-error'}`}>
                  {tokenStatus.ok ? `Connecté en tant que : ${tokenStatus.nom}` : tokenStatus.error}
                </p>
              )}
              {playerToken && (
                <div className="config-pull-row">
                  <button className="btn-config" onClick={handlePull}>
                    ↓ Récupérer depuis le dashboard
                  </button>
                  {pullStatus && (
                    <span className={`config-token-status ${pullStatus.ok ? 'token-ok' : 'token-error'}`}>
                      {pullStatus.ok
                        ? `${pullStatus.added} ajouté(s), ${pullStatus.updated} mis à jour`
                        : pullStatus.error}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}

export default TabConfig;
