import { useState, useEffect, useRef } from 'react';
import { useCharacter } from '../../context/CharacterContext';

const N_ZONES = 3;
const DEFAULT_ZONE_NAMES = ['À faire', 'En cours', 'Fait'];

let _idCounter = Date.now();
function genId() {
  return `note-${++_idCounter}`;
}

function TabNotes() {
  const { character, updateCharacter } = useCharacter();
  const [dragOverZone, setDragOverZone] = useState(null);
  const [dragOverNoteId, setDragOverNoteId] = useState(null);
  const dragIdRef = useRef(null);

  // Migration : notes sans id/zone/ordre → zone 0
  useEffect(() => {
    const notes = character.notes || [];
    if (notes.some(n => !n.id)) {
      updateCharacter(prev => ({
        ...prev,
        notes: (prev.notes || []).map((n, i) => ({
          id: n.id || genId(),
          titre: n.titre || '',
          contenu: n.contenu || '',
          zone: n.zone ?? 0,
          ordre: n.ordre ?? i,
        }))
      }));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const notes = (character.notes || []).map((n, i) => ({
    id: n.id || `tmp-${i}`,
    titre: n.titre || '',
    contenu: n.contenu || '',
    zone: n.zone ?? 0,
    ordre: n.ordre ?? i,
  }));

  const zoneNames = character.notesZones || DEFAULT_ZONE_NAMES;

  const notesByZone = Array.from({ length: N_ZONES }, (_, z) =>
    notes.filter(n => n.zone === z).sort((a, b) => a.ordre - b.ordre)
  );

  // --- Mutations ---

  const addNote = (zone) => {
    const zoneNotes = notesByZone[zone];
    updateCharacter(prev => ({
      ...prev,
      notes: [...(prev.notes || []), {
        id: genId(),
        titre: '',
        contenu: '',
        zone,
        ordre: zoneNotes.length,
      }]
    }));
  };

  const updateNote = (id, field, value) => {
    updateCharacter(prev => ({
      ...prev,
      notes: (prev.notes || []).map(n => n.id === id ? { ...n, [field]: value } : n)
    }));
  };

  const deleteNote = (id) => {
    if (!confirm('Supprimer cette note ?')) return;
    updateCharacter(prev => ({
      ...prev,
      notes: (prev.notes || []).filter(n => n.id !== id)
    }));
  };

  const renameZone = (zoneIdx, name) => {
    const next = [...zoneNames];
    next[zoneIdx] = name;
    updateCharacter(prev => ({ ...prev, notesZones: next }));
  };

  // --- Drag & Drop ---

  const handleDragStart = (e, note) => {
    dragIdRef.current = note.id;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', note.id);
    e.currentTarget.classList.add('is-dragging');
  };

  const handleDragEnd = (e) => {
    e.currentTarget.classList.remove('is-dragging');
    dragIdRef.current = null;
    setDragOverZone(null);
    setDragOverNoteId(null);
  };

  const handleDragOverColumn = (e, zoneIdx) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverZone(zoneIdx);
    setDragOverNoteId(null);
  };

  const handleDragOverNote = (e, zoneIdx, noteId) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    setDragOverZone(zoneIdx);
    setDragOverNoteId(noteId);
  };

  const handleDrop = (e, targetZone, beforeId = null) => {
    e.preventDefault();
    const draggedId = dragIdRef.current || e.dataTransfer.getData('text/plain');
    if (!draggedId) return;

    updateCharacter(prev => {
      const allNotes = (prev.notes || []).map((n, i) => ({
        id: n.id || `tmp-${i}`,
        titre: n.titre || '',
        contenu: n.contenu || '',
        zone: n.zone ?? 0,
        ordre: n.ordre ?? i,
      }));

      const dragged = allNotes.find(n => n.id === draggedId);
      if (!dragged) return prev;

      // Build zone lists without the dragged note
      const zones = Array.from({ length: N_ZONES }, (_, z) =>
        allNotes.filter(n => n.zone === z && n.id !== draggedId)
                .sort((a, b) => a.ordre - b.ordre)
      );

      // Insert dragged note at target position
      const updatedNote = { ...dragged, zone: targetZone };
      if (beforeId) {
        const idx = zones[targetZone].findIndex(n => n.id === beforeId);
        zones[targetZone].splice(idx === -1 ? zones[targetZone].length : idx, 0, updatedNote);
      } else {
        zones[targetZone].push(updatedNote);
      }

      // Re-assign ordre and flatten
      const result = zones.flatMap((zNotes, z) =>
        zNotes.map((n, i) => ({ ...n, zone: z, ordre: i }))
      );

      return { ...prev, notes: result };
    });

    setDragOverZone(null);
    setDragOverNoteId(null);
  };

  return (
    <div id="tab-notes" className="tab-content active">
      <div className="notes-board">
        {Array.from({ length: N_ZONES }, (_, zoneIdx) => (
          <div
            key={zoneIdx}
            className={`notes-column${dragOverZone === zoneIdx && dragOverNoteId === null ? ' drop-target' : ''}`}
            onDragOver={(e) => handleDragOverColumn(e, zoneIdx)}
            onDrop={(e) => handleDrop(e, zoneIdx, null)}
            onDragLeave={() => { setDragOverZone(null); setDragOverNoteId(null); }}
          >
            <div className="notes-column-header">
              <input
                className="notes-column-title"
                value={zoneNames[zoneIdx] ?? DEFAULT_ZONE_NAMES[zoneIdx]}
                onChange={e => renameZone(zoneIdx, e.target.value)}
              />
              <span className="notes-column-count">{notesByZone[zoneIdx].length}</span>
            </div>

            <div className="notes-column-body">
              {notesByZone[zoneIdx].map(note => (
                <div
                  key={note.id}
                  className={`note-block${dragOverZone === zoneIdx && dragOverNoteId === note.id ? ' drop-before' : ''}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, note)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => handleDragOverNote(e, zoneIdx, note.id)}
                  onDrop={(e) => handleDrop(e, zoneIdx, note.id)}
                >
                  <div className="note-header">
                    <span className="note-drag-handle" title="Déplacer">⠿</span>
                    <input
                      type="text"
                      className="note-titre"
                      value={note.titre}
                      onChange={(e) => updateNote(note.id, 'titre', e.target.value)}
                      placeholder="Titre de la note..."
                    />
                    <button
                      className="note-delete"
                      onClick={() => deleteNote(note.id)}
                      title="Supprimer cette note"
                    >×</button>
                  </div>
                  <textarea
                    className="note-textarea"
                    value={note.contenu}
                    onChange={(e) => updateNote(note.id, 'contenu', e.target.value)}
                    placeholder="Écrivez vos notes ici..."
                  />
                </div>
              ))}

              <button className="note-add-btn" onClick={() => addNote(zoneIdx)}>
                <span className="note-add-icon">+</span>
                <span className="note-add-text">Ajouter une note</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TabNotes;
