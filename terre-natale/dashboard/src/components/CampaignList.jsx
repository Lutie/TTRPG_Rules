import { useState } from 'react';

function CampaignList({ campaigns, onCreate, onDelete, onSelect }) {
  const [newName, setNewName] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  const handleCreate = () => {
    if (!newName.trim()) return;
    onCreate(newName.trim());
    setNewName('');
  };

  return (
    <div className="campaign-list">
      <div className="section-header">
        <h2>Campagnes</h2>
      </div>

      <div className="campaign-create">
        <input
          type="text"
          placeholder="Nom de la campagne"
          value={newName}
          onChange={e => setNewName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleCreate()}
        />
        <button className="btn-create" onClick={handleCreate}>Créer</button>
      </div>

      {campaigns.length === 0 && (
        <p className="empty-message">Aucune campagne. Créez-en une pour commencer.</p>
      )}

      <div className="campaign-grid">
        {campaigns.map(c => (
          <div key={c.id} className="campaign-card">
            {confirmDelete === c.id ? (
              <div className="campaign-confirm">
                <span>Supprimer cette campagne ?</span>
                <div className="campaign-confirm-actions">
                  <button className="btn-confirm-yes" onClick={() => { onDelete(c.id); setConfirmDelete(null); }}>Oui</button>
                  <button className="btn-confirm-no" onClick={() => setConfirmDelete(null)}>Non</button>
                </div>
              </div>
            ) : (
              <>
                <div className="campaign-card-info" onClick={() => onSelect(c.id)}>
                  <span className="campaign-card-nom">{c.nom}</span>
                  <span className="campaign-card-meta">
                    {c.personnages.length} personnage{c.personnages.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <button
                  className="btn-card-delete"
                  onClick={() => setConfirmDelete(c.id)}
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

export default CampaignList;
