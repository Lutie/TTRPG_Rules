import { useCharacter } from '../../context/CharacterContext';

function TabNotes() {
  const { character, updateCharacter } = useCharacter();
  const notes = character.notes || [];

  const handleAddNote = () => {
    updateCharacter(prev => ({
      ...prev,
      notes: [...(prev.notes || []), { titre: '', contenu: '' }]
    }));
  };

  const handleNoteChange = (index, field, value) => {
    updateCharacter(prev => ({
      ...prev,
      notes: prev.notes.map((note, i) =>
        i === index ? { ...note, [field]: value } : note
      )
    }));
  };

  const handleDeleteNote = (index) => {
    if (confirm('Supprimer cette note ?')) {
      updateCharacter(prev => ({
        ...prev,
        notes: prev.notes.filter((_, i) => i !== index)
      }));
    }
  };

  return (
    <div id="tab-notes" className="tab-content active">
      <section className="section notes-section">
        <h2 className="section-title">Notes</h2>
        <div className="notes-container">
          {notes.map((note, index) => (
            <div key={index} className="note-block">
              <div className="note-header">
                <input
                  type="text"
                  className="note-titre"
                  value={note.titre || ''}
                  onChange={(e) => handleNoteChange(index, 'titre', e.target.value)}
                  placeholder="Titre de la note..."
                />
                <button
                  className="note-delete"
                  onClick={() => handleDeleteNote(index)}
                  title="Supprimer cette note"
                >
                  ×
                </button>
              </div>
              <textarea
                className="note-textarea"
                value={note.contenu || ''}
                onChange={(e) => handleNoteChange(index, 'contenu', e.target.value)}
                placeholder="Écrivez vos notes ici..."
              />
            </div>
          ))}

          <button className="note-add-btn" onClick={handleAddNote}>
            <span className="note-add-icon">+</span>
            <span className="note-add-text">Ajouter une note</span>
          </button>
        </div>
      </section>
    </div>
  );
}

export default TabNotes;
