import { useState, useEffect, useCallback } from 'react';
import CharacterCard from './CharacterCard';

function CampaignView({ campaign, allCharacters, onBack, onUpdate, onRefresh }) {
  const [characterDetails, setCharacterDetails] = useState({});
  const [showAddPicker, setShowAddPicker] = useState(false);

  // Charger les détails des personnages de la campagne
  const loadDetails = useCallback(async () => {
    const details = {};
    for (const uuid of campaign.personnages) {
      try {
        const res = await fetch(`/api/characters/${uuid}`);
        if (res.ok) {
          details[uuid] = await res.json();
        }
      } catch { /* ignore */ }
    }
    setCharacterDetails(details);
  }, [campaign.personnages]);

  useEffect(() => {
    loadDetails();
    const interval = setInterval(loadDetails, 10000);
    return () => clearInterval(interval);
  }, [loadDetails]);

  const handleAddCharacter = (uuid) => {
    if (campaign.personnages.includes(uuid)) return;
    onUpdate({ personnages: [...campaign.personnages, uuid] });
    setShowAddPicker(false);
  };

  const handleRemoveCharacter = (uuid) => {
    onUpdate({ personnages: campaign.personnages.filter(id => id !== uuid) });
  };

  const availableCharacters = allCharacters.filter(
    c => !campaign.personnages.includes(c.uuid)
  );

  return (
    <div className="campaign-view">
      <div className="campaign-view-header">
        <button className="btn-back" onClick={onBack}>← Retour</button>
        <h2>{campaign.nom}</h2>
        <button className="btn-add-char" onClick={() => setShowAddPicker(!showAddPicker)}>
          + Personnage
        </button>
      </div>

      {showAddPicker && (
        <div className="char-picker">
          {availableCharacters.length === 0 ? (
            <p className="empty-message">Aucun personnage disponible.</p>
          ) : (
            availableCharacters.map(c => (
              <button
                key={c.uuid}
                className="char-picker-item"
                onClick={() => handleAddCharacter(c.uuid)}
              >
                {c.nom} {c.caste && `(${c.caste})`}
              </button>
            ))
          )}
        </div>
      )}

      {campaign.personnages.length === 0 && (
        <p className="empty-message">Aucun personnage dans cette campagne. Ajoutez-en avec le bouton ci-dessus.</p>
      )}

      <div className="characters-grid">
        {campaign.personnages.map(uuid => {
          const data = characterDetails[uuid];
          const summary = allCharacters.find(c => c.uuid === uuid);
          return (
            <CharacterCard
              key={uuid}
              character={data}
              summary={summary}
              onRemove={() => handleRemoveCharacter(uuid)}
            />
          );
        })}
      </div>
    </div>
  );
}

export default CampaignView;
