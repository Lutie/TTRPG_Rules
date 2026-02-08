import { useState, useRef } from 'react';
import { CharacterProvider, useCharacter } from './context/CharacterContext';
import TabPrincipal from './components/tabs/TabPrincipal';
import TabStatus from './components/tabs/TabStatus';
import TabCompetences from './components/tabs/TabCompetences';
import TabTraits from './components/tabs/TabTraits';
import TabMemoire from './components/tabs/TabMemoire';
import TabMagie from './components/tabs/TabMagie';
import TabNotes from './components/tabs/TabNotes';
import TabConfig from './components/tabs/TabConfig';
import './styles.css';

const TABS = [
  { id: 'status', label: 'Status' },
  { id: 'principal', label: 'Principal' },
  { id: 'competences', label: 'Compétences' },
  { id: 'traits', label: 'Traits' },
  { id: 'inventaire', label: 'Inventaire' },
  { id: 'memoire', label: 'Mémoire' },
  { id: 'magie', label: 'Magie' },
  { id: 'notes', label: 'Notes' },
  { id: 'config', label: 'Config' }
];

function AppContent() {
  const [activeTab, setActiveTab] = useState('principal');
  const { resetCharacter, exportCharacter, importCharacter } = useCharacter();
  const fileInputRef = useRef(null);

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      importCharacter(file);
      e.target.value = '';
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'principal':
        return <TabPrincipal />;
      case 'status':
        return <TabStatus />;
      case 'competences':
        return <TabCompetences />;
      case 'traits':
        return <TabTraits />;
      case 'inventaire':
        return <Placeholder title="Inventaire" />;
      case 'memoire':
        return <TabMemoire />;
      case 'magie':
        return <TabMagie />;
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
        <h1>Terre Natale</h1>
        <div className="header-actions">
          <button onClick={resetCharacter} title="Nouveau personnage">Nouveau</button>
          <button onClick={exportCharacter} title="Exporter en JSON">Exporter</button>
          <button onClick={() => fileInputRef.current?.click()} title="Importer un fichier JSON">
            Importer
          </button>
          <input
            ref={fileInputRef}
            type="file"
            id="file-import"
            accept=".json"
            onChange={handleImport}
            style={{ display: 'none' }}
          />
        </div>
      </header>

      <nav className="tabs-container">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main>
        {renderTabContent()}
      </main>
    </div>
  );
}

function Placeholder({ title }) {
  return (
    <div className="tab-content active">
      <div className="placeholder">
        <h2>{title}</h2>
        <p>Migration en cours...</p>
      </div>
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
