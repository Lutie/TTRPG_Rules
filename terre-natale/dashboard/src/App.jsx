import { useState, useEffect, useCallback } from 'react';
import CampaignList from './components/CampaignList';
import CampaignView from './components/CampaignView';
import CharacterList from './components/CharacterList';

function App() {
  const [campaigns, setCampaigns] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState(null);

  const fetchCampaigns = useCallback(async () => {
    const res = await fetch('/api/campaigns');
    setCampaigns(await res.json());
  }, []);

  const fetchCharacters = useCallback(async () => {
    const res = await fetch('/api/characters');
    setCharacters(await res.json());
  }, []);

  useEffect(() => {
    fetchCampaigns();
    fetchCharacters();
    // Rafraîchir les personnages toutes les 10s
    const interval = setInterval(fetchCharacters, 10000);
    return () => clearInterval(interval);
  }, [fetchCampaigns, fetchCharacters]);

  const selectedCampaign = campaigns.find(c => c.id === selectedCampaignId);

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
        ) : (
          <>
            <CampaignList
              campaigns={campaigns}
              onCreate={handleCreateCampaign}
              onDelete={handleDeleteCampaign}
              onSelect={setSelectedCampaignId}
            />
            <CharacterList characters={characters} />
          </>
        )}
      </main>
    </div>
  );
}

export default App;
