import { useState } from 'react';

function PlayerList({ players, onCreate, onDelete }) {
  const [newName, setNewName] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const handleCreate = () => {
    if (!newName.trim()) return;
    onCreate(newName.trim());
    setNewName('');
  };

  const handleCopy = (token, id) => {
    navigator.clipboard.writeText(token);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="campaign-list">
      <div className="section-header">
        <h2>Joueurs</h2>
      </div>

      <div className="campaign-create">
        <input
          type="text"
          placeholder="Nom du joueur"
          value={newName}
          onChange={e => setNewName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleCreate()}
        />
        <button className="btn-create" onClick={handleCreate}>Créer</button>
      </div>

      {players.length === 0 && (
        <p className="empty-message">Aucun joueur. Créez un compte pour générer un token.</p>
      )}

      <div className="campaign-grid">
        {players.map(p => (
          <div key={p.id} className="campaign-card">
            {confirmDelete === p.id ? (
              <div className="campaign-confirm">
                <span>Supprimer ce joueur ?</span>
                <div className="campaign-confirm-actions">
                  <button className="btn-confirm-yes" onClick={() => { onDelete(p.id); setConfirmDelete(null); }}>Oui</button>
                  <button className="btn-confirm-no" onClick={() => setConfirmDelete(null)}>Non</button>
                </div>
              </div>
            ) : (
              <>
                <div className="campaign-card-info" style={{ cursor: 'default' }}>
                  <span className="campaign-card-nom">{p.nom}</span>
                  <span
                    className="campaign-card-meta player-token"
                    onClick={() => handleCopy(p.token, p.id)}
                    title="Cliquer pour copier"
                  >
                    {copiedId === p.id ? 'Copié !' : p.token}
                  </span>
                </div>
                <button
                  className="btn-card-delete"
                  onClick={() => setConfirmDelete(p.id)}
                  title="Supprimer"
                >✕</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlayerList;
