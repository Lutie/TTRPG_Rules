import { useState, useEffect, useCallback } from 'react';
import { apiFetch, getAdminToken, setAdminToken, clearAdminToken } from './adminAuth';
import CampaignList from './components/CampaignList';
import CampaignView from './components/CampaignView';
import ConfrontationList from './components/ConfrontationList';
import ConfrontationView from './components/ConfrontationView';
import CharacterList from './components/CharacterList';
import PlayerList from './components/PlayerList';

function AdminLoginModal({ onClose, onSuccess }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!password) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (res.ok) {
        setAdminToken(data.token);
        onSuccess();
      } else {
        setError(data.error || 'Erreur');
      }
    } catch {
      setError('Impossible de joindre le serveur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="admin-modal">
        <div className="admin-modal-header">
          <h3>Connexion Admin</h3>
          <button className="btn-card-delete" onClick={onClose}>✕</button>
        </div>
        <div className="admin-modal-body">
          <input
            type="password"
            className="admin-password-input"
            placeholder="Mot de passe"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            autoFocus
          />
          {error && <p className="admin-error">{error}</p>}
        </div>
        <div className="admin-modal-footer">
          <button className="btn-back" onClick={onClose}>Annuler</button>
          <button className="btn-create" onClick={handleLogin} disabled={loading}>
            {loading ? '...' : 'Connexion'}
          </button>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [campaigns, setCampaigns] = useState([]);
  const [confrontations, setConfrontations] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [players, setPlayers] = useState([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState(null);
  const [selectedConfrontationId, setSelectedConfrontationId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(() => !!getAdminToken());
  const [showLoginModal, setShowLoginModal] = useState(false);

  const fetchCampaigns = useCallback(async () => {
    const res = await fetch('/api/campaigns');
    if (res.ok) setCampaigns(await res.json());
  }, []);

  const fetchConfrontations = useCallback(async () => {
    const res = await fetch('/api/confrontations');
    if (res.ok) setConfrontations(await res.json());
  }, []);

  const fetchCharacters = useCallback(async () => {
    const res = await fetch('/api/characters');
    if (res.ok) setCharacters(await res.json());
  }, []);

  const fetchPlayers = useCallback(async () => {
    const res = await fetch('/api/players');
    if (res.ok) setPlayers(await res.json());
  }, []);

  useEffect(() => {
    fetchCampaigns();
    fetchConfrontations();
    fetchCharacters();
    fetchPlayers();
    const interval = setInterval(fetchCharacters, 10000);
    return () => clearInterval(interval);
  }, [fetchCampaigns, fetchConfrontations, fetchCharacters, fetchPlayers]);

  const handleLogout = async () => {
    await apiFetch('/api/admin/logout', { method: 'POST' });
    clearAdminToken();
    setIsAdmin(false);
  };

  // --- Joueurs ---
  const handleCreatePlayer = async (nom) => {
    const res = await apiFetch('/api/players', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nom })
    });
    if (res.ok) await fetchPlayers();
  };

  const handleDeletePlayer = async (id) => {
    await apiFetch(`/api/players/${id}`, { method: 'DELETE' });
    await fetchPlayers();
  };

  // --- Campagnes ---
  const handleCreateCampaign = async (nom) => {
    await apiFetch('/api/campaigns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nom })
    });
    await fetchCampaigns();
  };

  const handleDeleteCampaign = async (id) => {
    await apiFetch(`/api/campaigns/${id}`, { method: 'DELETE' });
    if (selectedCampaignId === id) setSelectedCampaignId(null);
    await fetchCampaigns();
  };

  const handleUpdateCampaign = async (id, updates) => {
    await apiFetch(`/api/campaigns/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    await fetchCampaigns();
  };

  // --- Confrontations ---
  const handleCreateConfrontation = async (nom) => {
    await apiFetch('/api/confrontations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nom })
    });
    await fetchConfrontations();
  };

  const handleDeleteConfrontation = async (id) => {
    await apiFetch(`/api/confrontations/${id}`, { method: 'DELETE' });
    if (selectedConfrontationId === id) setSelectedConfrontationId(null);
    await fetchConfrontations();
  };

  const handleUpdateConfrontation = async (id, updates) => {
    await apiFetch(`/api/confrontations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    await fetchConfrontations();
  };

  // --- Personnages ---
  const handleDeleteCharacter = async (uuid) => {
    await apiFetch(`/api/characters/${uuid}`, { method: 'DELETE' });
    await fetchCharacters();
  };

  const selectCampaign = (id) => {
    setSelectedConfrontationId(null);
    setSelectedCampaignId(id);
  };

  const selectConfrontation = (id) => {
    setSelectedCampaignId(null);
    setSelectedConfrontationId(id);
  };

  const selectedCampaign = campaigns.find(c => c.id === selectedCampaignId);
  const selectedConfrontation = confrontations.find(c => c.id === selectedConfrontationId);

  return (
    <div className="container">
      <header>
        <h1><span className="title-symbol">Ͽ</span> Dashboard</h1>
        <div className="header-info">
          <span className="header-stat">{characters.length} personnage{characters.length !== 1 ? 's' : ''} reçu{characters.length !== 1 ? 's' : ''}</span>
          {isAdmin ? (
            <button className="btn-admin btn-admin-active" onClick={handleLogout} title="Déconnexion admin">
              Admin ✓
            </button>
          ) : (
            <button className="btn-admin" onClick={() => setShowLoginModal(true)} title="Connexion admin">
              Admin
            </button>
          )}
        </div>
      </header>

      <main>
        {selectedCampaign ? (
          <CampaignView
            campaign={selectedCampaign}
            allCharacters={characters}
            onBack={() => setSelectedCampaignId(null)}
            onUpdate={(updates) => handleUpdateCampaign(selectedCampaign.id, updates)}
            onRefresh={fetchCharacters}
            isAdmin={isAdmin}
          />
        ) : selectedConfrontation ? (
          <ConfrontationView
            confrontation={selectedConfrontation}
            onBack={() => setSelectedConfrontationId(null)}
            onUpdate={(updates) => handleUpdateConfrontation(selectedConfrontation.id, updates)}
            isAdmin={isAdmin}
          />
        ) : (
          <>
            {isAdmin && (
              <PlayerList
                players={players}
                onCreate={handleCreatePlayer}
                onDelete={handleDeletePlayer}
                isAdmin={isAdmin}
              />
            )}
            <CampaignList
              campaigns={campaigns}
              onCreate={handleCreateCampaign}
              onDelete={handleDeleteCampaign}
              onSelect={selectCampaign}
              isAdmin={isAdmin}
            />
            <ConfrontationList
              confrontations={confrontations}
              onCreate={handleCreateConfrontation}
              onDelete={handleDeleteConfrontation}
              onSelect={selectConfrontation}
              isAdmin={isAdmin}
            />
            <CharacterList
              characters={characters}
              onDelete={handleDeleteCharacter}
              isAdmin={isAdmin}
            />
          </>
        )}
      </main>

      {showLoginModal && (
        <AdminLoginModal
          onClose={() => setShowLoginModal(false)}
          onSuccess={() => { setIsAdmin(true); setShowLoginModal(false); }}
        />
      )}
    </div>
  );
}

export default App;
