import { useState, useEffect, useCallback } from 'react';
import CampaignList from './components/CampaignList';
import CampaignView from './components/CampaignView';
import ConfrontationList from './components/ConfrontationList';
import ConfrontationView from './components/ConfrontationView';
import CharacterList from './components/CharacterList';
import PlayerList from './components/PlayerList';

function App() {
  const [campaigns, setCampaigns] = useState([]);
  const [confrontations, setConfrontations] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [players, setPlayers] = useState([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState(null);
  const [selectedConfrontationId, setSelectedConfrontationId] = useState(null);

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

  const selectedCampaign = campaigns.find(c => c.id === selectedCampaignId);
  const selectedConfrontation = confrontations.find(c => c.id === selectedConfrontationId);

  // --- Campagnes ---
  const handleCreateCampaign = async (nom) => {
    await fetch('/api/campaigns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nom })
    });
    await fetchCampaigns();
  };

  const handleDeleteCampaign = async (id) => {
    await fetch(`/api/campaigns/${id}`, { method: 'DELETE' });
    if (selectedCampaignId === id) setSelectedCampaignId(null);
    await fetchCampaigns();
  };

  const handleUpdateCampaign = async (id, updates) => {
    await fetch(`/api/campaigns/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    await fetchCampaigns();
  };

  // --- Joueurs ---
  const handleCreatePlayer = async (nom) => {
    const res = await fetch('/api/players', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nom })
    });
    if (res.ok) await fetchPlayers();
  };

  const handleDeletePlayer = async (id) => {
    await fetch(`/api/players/${id}`, { method: 'DELETE' });
    await fetchPlayers();
  };

  // --- Confrontations ---
  const handleCreateConfrontation = async (nom) => {
    await fetch('/api/confrontations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nom })
    });
    await fetchConfrontations();
  };

  const handleDeleteConfrontation = async (id) => {
    await fetch(`/api/confrontations/${id}`, { method: 'DELETE' });
    if (selectedConfrontationId === id) setSelectedConfrontationId(null);
    await fetchConfrontations();
  };

  const handleUpdateConfrontation = async (id, updates) => {
    await fetch(`/api/confrontations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    await fetchConfrontations();
  };

  const selectCampaign = (id) => {
    setSelectedConfrontationId(null);
    setSelectedCampaignId(id);
  };

  const selectConfrontation = (id) => {
    setSelectedCampaignId(null);
    setSelectedConfrontationId(id);
  };

  return (
    <div className="container">
      <header>
        <h1><span className="title-symbol">Ͽ</span> Dashboard</h1>
        <div className="header-info">
          <span className="header-stat">{characters.length} personnage{characters.length !== 1 ? 's' : ''} reçu{characters.length !== 1 ? 's' : ''}</span>
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
          />
        ) : selectedConfrontation ? (
          <ConfrontationView
            confrontation={selectedConfrontation}
            onBack={() => setSelectedConfrontationId(null)}
            onUpdate={(updates) => handleUpdateConfrontation(selectedConfrontation.id, updates)}
          />
        ) : (
          <>
            <PlayerList
              players={players}
              onCreate={handleCreatePlayer}
              onDelete={handleDeletePlayer}
            />
            <CampaignList
              campaigns={campaigns}
              onCreate={handleCreateCampaign}
              onDelete={handleDeleteCampaign}
              onSelect={selectCampaign}
            />
            <ConfrontationList
              confrontations={confrontations}
              onCreate={handleCreateConfrontation}
              onDelete={handleDeleteConfrontation}
              onSelect={selectConfrontation}
            />
            <CharacterList characters={characters} />
          </>
        )}
      </main>
    </div>
  );
}

export default App;
