import { useState, useRef, useEffect, useCallback } from 'react';
import { CharacterProvider, useCharacter } from './context/CharacterContext';
import TabPrincipal from './components/tabs/TabPrincipal';
import TabStatus from './components/tabs/TabStatus';
import TabCompetences from './components/tabs/TabCompetences';
import TabTraits from './components/tabs/TabTraits';
import TabMemoire from './components/tabs/TabMemoire';
import TabMagie from './components/tabs/TabMagie';
import TabAptitude from './components/tabs/TabAptitude';
import TabNotes from './components/tabs/TabNotes';
import TabConfig from './components/tabs/TabConfig';
import TabInventaire from './components/tabs/TabInventaire';
import './styles.css';

const ALL_TABS = [
  { id: 'status', label: 'Status' },
  { id: 'principal', label: 'Principal' },
  { id: 'competences', label: 'Compétences' },
  { id: 'aptitude', label: 'Aptitudes', option: 'aptitudeActive' },
  { id: 'traits', label: 'Traits' },
  { id: 'inventaire', label: 'Inventaire' },
  { id: 'memoire', label: 'Mémoire' },
  { id: 'magie', label: 'Magie', option: 'magieActive' },
  { id: 'notes', label: 'Notes' },
  { id: 'config', label: 'Config' }
];

function CharacterSelectModal({ onClose, canClose }) {
  const { listCharacters, loadCharacter, createNewCharacter, deleteCharacter, importCharacter, dashboardUrl, setDashboardUrl } = useCharacter();
  const [characters, setCharacters] = useState(() => listCharacters());
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [urlInput, setUrlInput] = useState(dashboardUrl);
  const fileInputRef = useRef(null);

  const refresh = () => setCharacters(listCharacters());

  const handleLoad = (uuid) => {
    loadCharacter(uuid);
    onClose();
  };

  const handleCreate = () => {
    createNewCharacter();
    onClose();
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      importCharacter(file).then(() => {
        onClose();
      });
      e.target.value = '';
    }
  };

  const handleDelete = (uuid) => {
    deleteCharacter(uuid);
    setConfirmDelete(null);
    refresh();
  };

  const formatDate = (isoDate) => {
    if (!isoDate) return '';
    const d = new Date(isoDate);
    return d.toLocaleDateString('fr-FR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="modal-overlay" onClick={canClose ? onClose : undefined}>
      <div className="charselect-modal" onClick={e => e.stopPropagation()}>
        <div className="charselect-header">
          <h2>Personnages</h2>
          {canClose && (
            <button className="charselect-close" onClick={onClose}>✕</button>
          )}
        </div>

        {characters.length > 0 && (
          <div className="charselect-list">
            {characters.map(c => (
              <div key={c.uuid} className="charselect-card">
                {confirmDelete === c.uuid ? (
                  <div className="charselect-confirm">
                    <span>Supprimer ce personnage ?</span>
                    <div className="charselect-confirm-actions">
                      <button className="charselect-btn-confirm-yes" onClick={() => handleDelete(c.uuid)}>Oui</button>
                      <button className="charselect-btn-confirm-no" onClick={() => setConfirmDelete(null)}>Non</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="charselect-card-info" onClick={() => handleLoad(c.uuid)}>
                      <span className="charselect-card-nom">{c.nom || 'Sans nom'}</span>
                      <span className="charselect-card-date">{formatDate(c.dateModification)}</span>
                    </div>
                    <button
                      className="charselect-btn-delete"
                      onClick={() => setConfirmDelete(c.uuid)}
                      title="Supprimer"
                    >✕</button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {characters.length === 0 && (
          <p className="charselect-empty">Aucun personnage sauvegardé.</p>
        )}

        <div className="charselect-actions">
          <button className="charselect-btn-create" onClick={handleCreate}>
            Nouveau personnage
          </button>
          <button className="charselect-btn-import" onClick={() => fileInputRef.current?.click()}>
            Importer (JSON)
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            style={{ display: 'none' }}
          />
        </div>

        <div className="charselect-dashboard">
          <label className="charselect-dashboard-label">Dashboard URL</label>
          <div className="charselect-dashboard-row">
            <input
              type="text"
              placeholder="http://192.168.1.x:3100"
              value={urlInput}
              onChange={e => setUrlInput(e.target.value)}
              onBlur={() => setDashboardUrl(urlInput)}
              onKeyDown={e => { if (e.key === 'Enter') { setDashboardUrl(urlInput); e.target.blur(); } }}
            />
            {dashboardUrl && <span className="charselect-dashboard-ok">✓</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

function AppContent() {
  const [activeTab, setActiveTab] = useState('principal');
  const [showCharSelect, setShowCharSelect] = useState(false);
  const [syncStatus, setSyncStatus] = useState(null); // null | 'ok' | 'error'
  const { character, currentCharacterId, exportCharacter, createNewCharacter, dashboardUrl, syncToDashboard } = useCharacter();

  const visibleTabs = ALL_TABS.filter(tab =>
    !tab.option || character?.options?.[tab.option]
  );

  // Rediriger si l'onglet actif n'est plus visible
  const effectiveTab = visibleTabs.some(t => t.id === activeTab) ? activeTab : 'principal';

  // Si aucun personnage chargé, afficher la modale obligatoire
  const mustSelectCharacter = !currentCharacterId || !character;

  // Sync manuelle
  const handleSync = useCallback(async () => {
    const ok = await syncToDashboard();
    setSyncStatus(ok ? 'ok' : 'error');
    setTimeout(() => setSyncStatus(null), 3000);
  }, [syncToDashboard]);

  // Sync auto toutes les 30s
  useEffect(() => {
    if (!dashboardUrl || !character) return;
    const interval = setInterval(() => {
      syncToDashboard();
    }, 30000);
    return () => clearInterval(interval);
  }, [dashboardUrl, character, syncToDashboard]);

  const renderTabContent = () => {
    switch (effectiveTab) {
      case 'principal':
        return <TabPrincipal />;
      case 'status':
        return <TabStatus />;
      case 'competences':
        return <TabCompetences />;
      case 'traits':
        return <TabTraits />;
      case 'inventaire':
        return <TabInventaire />;
      case 'memoire':
        return <TabMemoire />;
      case 'magie':
        return <TabMagie />;
      case 'aptitude':
        return <TabAptitude />;
      case 'notes':
        return <TabNotes />;
      case 'config':
        return <TabConfig />;
      default:
        return null;
    }
  };

  return (
    <div className="container">
      <header>
        <h1><span className="title-symbol">Ͽ</span> Terre Natale</h1>
        <div className="header-actions">
          <button onClick={() => setShowCharSelect(true)} title="Changer de personnage">Personnages</button>
          <button onClick={exportCharacter} title="Exporter en JSON">Exporter</button>
          <button onClick={() => { createNewCharacter(); }} title="Créer un nouveau personnage">Nouveau</button>
          {dashboardUrl && (
            <button
              className={`btn-sync ${syncStatus === 'ok' ? 'sync-ok' : syncStatus === 'error' ? 'sync-error' : ''}`}
              onClick={handleSync}
              title={`Synchroniser avec le dashboard (${dashboardUrl})`}
            >
              ↻
            </button>
          )}
        </div>
      </header>

      <nav className="tabs-container">
        {visibleTabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${effectiveTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main>
        {character ? renderTabContent() : (
          <div className="tab-content active">
            <div className="placeholder">
              <p>Sélectionnez ou créez un personnage pour commencer.</p>
            </div>
          </div>
        )}
      </main>

      {(mustSelectCharacter || showCharSelect) && (
        <CharacterSelectModal
          onClose={() => setShowCharSelect(false)}
          canClose={!mustSelectCharacter}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <CharacterProvider>
      <AppContent />
    </CharacterProvider>
  );
}

export default App;
