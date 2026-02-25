import { useState } from 'react';
import { useCharacter } from '../../context/CharacterContext';
import { useCharacterCalculations } from '../../hooks/useCharacterCalculations';
import DATA from '../../data';
import Section from '../common/Section';

const ATTRIBUTS_PRINCIPAUX = DATA.attributsPrincipaux.map(a => a.id);

const TYPES_OBJET = [
  { id: 'arme', label: 'Arme' },
  { id: 'armure', label: 'Armure' },
  { id: 'sous_piece_armure', label: 'Sous-pièce d\'armure' },
  { id: 'colifichet', label: 'Colifichet' },
  { id: 'focalisateur', label: 'Focalisateur' },
  { id: 'outil', label: 'Outil' },
  { id: 'consommable', label: 'Consommable' },
  { id: 'autre', label: 'Autre' }
];

const TYPES_AVEC_QUALITE = ['arme', 'armure', 'sous_piece_armure', 'colifichet', 'focalisateur', 'outil', 'autre', 'consommable'];
const TYPES_AVEC_CATEGORIE = ['arme', 'armure', 'sous_piece_armure', 'focalisateur', 'outil', 'autre'];
const TYPES_EN_MAIN = ['arme', 'focalisateur'];
const TYPES_EQUIPABLES = ['arme', 'armure', 'sous_piece_armure', 'colifichet', 'focalisateur'];
const TYPES_AVEC_PROMOTIONS = ['arme', 'outil', 'armure', 'sous_piece_armure', 'colifichet'];
const TYPES_AVEC_MATIERE = ['arme', 'focalisateur', 'armure', 'outil'];

const MATIERES_LISTE = [
  { id: 1, nom: 'Fer',    description: '' },
  { id: 2, nom: 'Acier',  description: '' },
  { id: 3, nom: 'Bronze', description: '' },
  { id: 4, nom: 'Bois',   description: '' },
  { id: 5, nom: 'Cuir',   description: '' },
  { id: 6, nom: 'Tissu',  description: '' },
  { id: 7, nom: 'Pierre', description: '' },
  { id: 8, nom: 'Os',     description: '' }
];

// Améliorations prédéfinies — types: null = universelle, sinon liste des types d'objet concernés
const AMELIORATIONS_LISTE = [
  { id: 1, nom: 'Alléger',           description: 'Réduit la charge/poids de l\'objet de 1.', types: null },
  { id: 2, nom: 'Solidité accrue',   description: 'Solidité de l\'objet +1.',                 types: null },
  { id: 3, nom: 'Perforation accrue', description: 'Perforation de l\'arme +2.',              types: ['arme'] },
  { id: 4, nom: 'Absorption accrue',  description: 'Absorption de l\'armure +2.',             types: ['armure'] }
];

// Qualité : 0, 1..6, -1..-6 (positifs en priorité)
const QUALITE_OPTIONS = [0, 1, 2, 3, 4, 5, 6, -1, -2, -3, -4, -5, -6];
const CATEGORIE_OPTIONS = [0, 1, 2, 3, 4, 5, 6];
const ENCOMBREMENT_OPTIONS = [
  { value: 0.125, label: '1/8' },
  { value: 0.25, label: '1/4' },
  { value: 0.5, label: '1/2' }
];

const FORMES_ARME = [
  { id: 'tranchant', label: 'Tranchant', attr: 'DEX' },
  { id: 'contondant', label: 'Contondant', attr: 'FOR' },
  { id: 'perforant', label: 'Perforant', attr: 'AGI' },
  { id: 'defense', label: 'Défense', attr: 'CON' },
  { id: 'distance', label: 'Distance', attr: 'PER' }
];

const TYPES_ARME = [
  { id: 'escrime', label: 'Escrime', attr: 'DEX' },
  { id: 'choc', label: 'Choc', attr: 'FOR' },
  { id: 'hast', label: 'Hast', attr: 'AGI' },
  { id: 'defense', label: 'Défense', attr: 'CON' },
  { id: 'distance', label: 'Distance', attr: 'PER' }
];

const getForme = (id) => FORMES_ARME.find(f => f.id === id);
const getTypeArme = (id) => TYPES_ARME.find(t => t.id === id);

// Taille, Gabarit, Équilibre : -2 à +2 (impactent le poids de l'arme)
const ARME_DIMENSIONS = [
  {
    id: 'taille',
    label: 'Taille',
    options: [
      { value: -2, label: 'Très petite' },
      { value: -1, label: 'Petite' },
      { value:  0, label: 'Normale' },
      { value:  1, label: 'Grande' },
      { value:  2, label: 'Très grande' }
    ]
  },
  {
    id: 'gabarit',
    label: 'Gabarit',
    options: [
      { value: -2, label: 'Très fin' },
      { value: -1, label: 'Fin' },
      { value:  0, label: 'Normal' },
      { value:  1, label: 'Large' },
      { value:  2, label: 'Très large' }
    ]
  },
  {
    id: 'equilibre',
    label: 'Équilibre',
    options: [
      { value: -2, label: 'Très déséquilibré' },
      { value: -1, label: 'Déséquilibré' },
      { value:  0, label: 'Normal' },
      { value:  1, label: 'Équilibré' },
      { value:  2, label: 'Très équilibré' }
    ]
  }
];

function calculerPoidsArme(arme) {
  const base = (arme.categorie ?? 1) * 5;
  const ajust = (arme.taille ?? 0) + (arme.gabarit ?? 0) + (arme.equilibre ?? 0);
  return Math.max(0, base + ajust);
}

function calculerPenaliteAjustement(objet, entrainements) {
  const cat = objet.categorie ?? 0;
  const qual = objet.qualite ?? 0;
  let niveau = 0;
  if (objet.type === 'arme') {
    const forme = getForme(objet.forme);
    niveau = forme?.attr === 'PER'
      ? (entrainements.armesDistance ?? 0)
      : (entrainements.armesMelee ?? 0);
  } else if (objet.type === 'armure' || objet.type === 'sous_piece_armure') {
    niveau = entrainements.armures ?? 0;
  } else if (objet.type === 'outil') {
    niveau = entrainements.outils ?? 0;
  } else if (objet.type === 'focalisateur') {
    niveau = entrainements.magie ?? 0;
  } else {
    return 0;
  }
  return -2 * cat + 2 * niveau + qual;
}

const SLOTS = {
  mainDirectrice: 'Main directrice',
  mainNonDirectrice: 'Main non directrice',
  deuxMains: 'Deux mains',
  armure: 'Armure',
  // Sous-pièces d'armure
  visage: 'Visage',
  epaules: 'Épaules',
  dos: 'Dos',
  mains: 'Mains',
  pieds: 'Pieds',
  // Colifichets
  poignetGauche: 'Poignet gauche',
  poignetDroit: 'Poignet droit',
  doigtGauche: 'Doigt gauche',
  doigtDroit: 'Doigt droit',
  cou: 'Cou',
  taille: 'Taille'
};

const SLOTS_ARME = [
  { id: 'mainDirectrice', label: 'Main directrice' },
  { id: 'mainNonDirectrice', label: 'Main non directrice' },
  { id: 'deuxMains', label: 'Deux mains' }
];

// Emplacements pour sous-pièces d'armure — le slotType de l'objet détermine son slot
const SLOTS_SOUS_PIECE = [
  { id: 'visage', label: 'Visage', exemple: 'masque…' },
  { id: 'epaules', label: 'Épaules', exemple: 'spallières…' },
  { id: 'dos', label: 'Dos', exemple: 'cape…' },
  { id: 'mains', label: 'Mains', exemple: 'gants…' },
  { id: 'pieds', label: 'Pieds', exemple: 'chausses…' }
];

// Types de colifichets — slots détermine le/les emplacements disponibles
const TYPES_COLIFICHET = [
  { id: 'poignet', label: 'Poignet', exemple: 'bracelet…', slots: ['poignetGauche', 'poignetDroit'] },
  { id: 'doigt', label: 'Doigt', exemple: 'anneau…', slots: ['doigtGauche', 'doigtDroit'] },
  { id: 'cou', label: 'Cou', exemple: 'amulette…', slots: ['cou'] },
  { id: 'taille', label: 'Taille', exemple: 'ceinture…', slots: ['taille'] }
];

function getDefaultSlotType(type) {
  if (type === 'sous_piece_armure') return 'visage';
  if (type === 'colifichet') return 'cou';
  return '';
}

function ObjetModal({ objet, isEdit, onSave, onClose }) {
  const _matiereMatch = MATIERES_LISTE.find(m => m.nom === objet?.matiere);
  const [form, setForm] = useState({
    nom: objet?.nom || '',
    type: objet?.type || 'arme',
    description: objet?.description || '',
    qualite: objet?.qualite ?? 0,
    categorie: objet?.categorie ?? 0,
    forme: objet?.forme || 'tranchant',
    typeArme: objet?.typeArme || 'escrime',
    taille: objet?.taille ?? 0,
    gabarit: objet?.gabarit ?? 0,
    equilibre: objet?.equilibre ?? 0,
    attributOutil: objet?.attributOutil || 'DEX',
    encombrement: objet?.encombrement ?? 0.125,
    quantite: objet?.quantite ?? 1,
    slotType: objet?.slotType || getDefaultSlotType(objet?.type),
    matiereMode: objet?.matiere ? (_matiereMatch ? 'liste' : 'libre') : 'liste',
    matiereListeId: _matiereMatch?.id ?? '',
    matiereLibre: _matiereMatch ? '' : (objet?.matiere || '')
  });

  const hasQualite = TYPES_AVEC_QUALITE.includes(form.type);
  const hasCategorie = TYPES_AVEC_CATEGORIE.includes(form.type);
  const isArme = form.type === 'arme';
  const isOutil = form.type === 'outil';
  const isConsommable = form.type === 'consommable';
  const isSousPiece = form.type === 'sous_piece_armure';
  const isColifichet = form.type === 'colifichet';

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleTypeChange = (newType) => {
    setForm({ ...form, type: newType, slotType: getDefaultSlotType(newType) });
  };

  const handleSave = () => {
    if (!form.nom.trim()) return;
    const data = { nom: form.nom, type: form.type, description: form.description };
    if (TYPES_AVEC_QUALITE.includes(form.type)) {
      data.qualite = form.qualite;
    }
    if (TYPES_AVEC_CATEGORIE.includes(form.type)) {
      data.categorie = form.categorie;
    }
    if (form.type === 'arme') {
      data.forme = form.forme;
      data.typeArme = form.typeArme;
      data.taille = form.taille;
      data.gabarit = form.gabarit;
      data.equilibre = form.equilibre;
    }
    if (form.type === 'outil') {
      data.attributOutil = form.attributOutil;
    }
    if (form.type === 'consommable') {
      data.encombrement = form.encombrement;
      data.quantite = form.quantite;
    }
    if (form.type === 'sous_piece_armure' || form.type === 'colifichet') {
      data.slotType = form.slotType;
    }
    if (TYPES_AVEC_MATIERE.includes(form.type)) {
      if (form.matiereMode === 'liste' && form.matiereListeId) {
        data.matiere = MATIERES_LISTE.find(m => m.id === form.matiereListeId)?.nom || '';
      } else if (form.matiereMode === 'libre' && form.matiereLibre.trim()) {
        data.matiere = form.matiereLibre.trim();
      } else {
        data.matiere = '';
      }
    }
    onSave(data);
  };

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">{isEdit ? 'Modifier l\'objet' : 'Nouvel objet'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="inventaire-modal-fields">
            <div className="info-field">
              <label>Nom</label>
              <input
                type="text"
                value={form.nom}
                onChange={e => setForm({ ...form, nom: e.target.value })}
                autoFocus
              />
            </div>
            <div className="info-field">
              <label>Type</label>
              <select
                value={form.type}
                onChange={e => handleTypeChange(e.target.value)}
              >
                {TYPES_OBJET.map(t => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </select>
            </div>
            {isSousPiece && (
              <div className="info-field">
                <label>Emplacement</label>
                <select
                  value={form.slotType}
                  onChange={e => setForm({ ...form, slotType: e.target.value })}
                >
                  {SLOTS_SOUS_PIECE.map(s => (
                    <option key={s.id} value={s.id}>{s.label} ({s.exemple})</option>
                  ))}
                </select>
              </div>
            )}
            {isColifichet && (
              <div className="info-field">
                <label>Type de colifichet</label>
                <select
                  value={form.slotType}
                  onChange={e => setForm({ ...form, slotType: e.target.value })}
                >
                  {TYPES_COLIFICHET.map(t => (
                    <option key={t.id} value={t.id}>{t.label} ({t.exemple})</option>
                  ))}
                </select>
              </div>
            )}
            {(hasQualite || hasCategorie) && (
              <div className="inventaire-modal-row">
                {hasQualite && (
                  <div className="info-field">
                    <label>Qualité</label>
                    <select
                      value={form.qualite}
                      onChange={e => setForm({ ...form, qualite: Number(e.target.value) })}
                    >
                      {QUALITE_OPTIONS.map(v => (
                        <option key={v} value={v}>{v}</option>
                      ))}
                    </select>
                  </div>
                )}
                {hasCategorie && (
                  <div className="info-field">
                    <label>Catégorie</label>
                    <select
                      value={form.categorie}
                      onChange={e => setForm({ ...form, categorie: Number(e.target.value) })}
                    >
                      {CATEGORIE_OPTIONS.map(v => (
                        <option key={v} value={v}>{v}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}
            {isArme && (
              <>
                <div className="inventaire-modal-row">
                  <div className="info-field">
                    <label>Forme</label>
                    <select
                      value={form.forme}
                      onChange={e => setForm({ ...form, forme: e.target.value })}
                    >
                      {FORMES_ARME.map(f => (
                        <option key={f.id} value={f.id}>{f.label} ({f.attr})</option>
                      ))}
                    </select>
                  </div>
                  <div className="info-field">
                    <label>Type d'arme</label>
                    <select
                      value={form.typeArme}
                      onChange={e => setForm({ ...form, typeArme: e.target.value })}
                    >
                      {TYPES_ARME.map(t => (
                        <option key={t.id} value={t.id}>{t.label} ({t.attr})</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="inventaire-modal-row">
                  {ARME_DIMENSIONS.map(dim => (
                    <div className="info-field" key={dim.id}>
                      <label>{dim.label}</label>
                      <select
                        value={form[dim.id]}
                        onChange={e => setForm({ ...form, [dim.id]: Number(e.target.value) })}
                      >
                        {dim.options.map(o => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </>
            )}
            {isOutil && (
              <div className="info-field">
                <label>Type</label>
                <select
                  value={form.attributOutil}
                  onChange={e => setForm({ ...form, attributOutil: e.target.value })}
                >
                  {ATTRIBUTS_PRINCIPAUX.map(id => (
                    <option key={id} value={id}>{id}</option>
                  ))}
                </select>
              </div>
            )}
            {isConsommable && (
              <div className="inventaire-modal-row">
                <div className="info-field">
                  <label>Encombrement</label>
                  <select
                    value={form.encombrement}
                    onChange={e => setForm({ ...form, encombrement: Number(e.target.value) })}
                  >
                    {ENCOMBREMENT_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
                <div className="info-field">
                  <label>Quantité</label>
                  <input
                    type="number"
                    min="1"
                    value={form.quantite}
                    onChange={e => setForm({ ...form, quantite: Math.max(1, parseInt(e.target.value) || 1) })}
                  />
                </div>
              </div>
            )}
            {TYPES_AVEC_MATIERE.includes(form.type) && (
              <div className="info-field">
                <label>Matière</label>
                <div className="inventaire-matiere-field">
                  <div className="inventaire-amel-mode-toggle">
                    <button
                      className={`inventaire-amel-mode-btn${form.matiereMode === 'liste' ? ' active' : ''}`}
                      onClick={() => setForm({ ...form, matiereMode: 'liste' })}
                    >Liste</button>
                    <button
                      className={`inventaire-amel-mode-btn${form.matiereMode === 'libre' ? ' active' : ''}`}
                      onClick={() => setForm({ ...form, matiereMode: 'libre' })}
                    >Libre</button>
                  </div>
                  {form.matiereMode === 'liste' ? (
                    <select
                      value={form.matiereListeId}
                      onChange={e => setForm({ ...form, matiereListeId: Number(e.target.value) || '' })}
                    >
                      <option value="">— aucune —</option>
                      {MATIERES_LISTE.map(m => (
                        <option key={m.id} value={m.id}>{m.nom}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      placeholder="Matière libre"
                      value={form.matiereLibre}
                      onChange={e => setForm({ ...form, matiereLibre: e.target.value })}
                    />
                  )}
                </div>
              </div>
            )}
            <div className="info-field">
              <label>Description</label>
              <textarea
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                rows={3}
              />
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Annuler</button>
          <button className="btn-primary" onClick={handleSave} disabled={!form.nom.trim()}>
            {isEdit ? 'Modifier' : 'Ajouter'}
          </button>
        </div>
      </div>
    </div>
  );
}

function SlotPickerModal({ objet, slots, onSelect, onClose }) {
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Équiper : {objet.nom}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="inventaire-slot-picker">
            {slots.map(slot => (
              <button
                key={slot.id}
                className="inventaire-slot-btn"
                onClick={() => onSelect(slot.id)}
              >
                {slot.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function getJetAttribut(objet) {
  if (objet.type === 'arme') {
    const forme = getForme(objet.forme);
    return forme?.attr || null;
  }
  if (objet.type === 'outil') return objet.attributOutil || null;
  return null;
}

function formatJet(categorie, mod) {
  const nbDes = 2 + (categorie ?? 1);
  const modStr = mod >= 0 ? `(+${mod})` : `(${mod})`;
  return `${nbDes}D8 ${modStr}`;
}

function AmeliorationEditForm({ objet, amel, slotsRestants, onSave, onCancel, onDelete }) {
  const [mode, setMode] = useState(amel ? 'libre' : 'liste');
  const [selectedListeId, setSelectedListeId] = useState('');
  const [rang, setRang] = useState(amel?.rang || 1);
  const [nom, setNom] = useState(amel?.nom || '');
  const [description, setDescription] = useState(amel?.description || '');

  const amelDisponibles = AMELIORATIONS_LISTE.filter(
    a => a.types === null || a.types.includes(objet.type)
  );
  const slotsMax = slotsRestants + (amel?.rang || 0);
  const selectedListeAmel = amelDisponibles.find(a => a.id === selectedListeId);

  const handleSave = () => {
    if (mode === 'liste') {
      if (!selectedListeAmel) return;
      onSave({ nom: selectedListeAmel.nom, description: selectedListeAmel.description, rang });
    } else {
      if (!nom.trim()) return;
      onSave({ nom, description, rang });
    }
  };

  return (
    <div className="inventaire-amel-edit">
      <div className="inventaire-amel-mode-toggle">
        <button className={`inventaire-amel-mode-btn${mode === 'liste' ? ' active' : ''}`} onClick={() => setMode('liste')}>Liste</button>
        <button className={`inventaire-amel-mode-btn${mode === 'libre' ? ' active' : ''}`} onClick={() => setMode('libre')}>Libre</button>
      </div>
      {mode === 'liste' ? (
        <>
          <div className="inventaire-amel-edit-row">
            <select value={selectedListeId} onChange={e => setSelectedListeId(e.target.value)} autoFocus>
              <option value="">— choisir —</option>
              {amelDisponibles.map(a => (
                <option key={a.id} value={a.id}>{a.nom}</option>
              ))}
            </select>
            <select className="inventaire-amel-rang-select" value={rang} onChange={e => setRang(Number(e.target.value))}>
              {[1, 2, 3].filter(r => r <= slotsMax).map(r => (
                <option key={r} value={r}>{['I','II','III'][r-1]}</option>
              ))}
            </select>
          </div>
          {selectedListeAmel && (
            <p className="inventaire-amel-liste-desc">{selectedListeAmel.description}</p>
          )}
        </>
      ) : (
        <>
          <div className="inventaire-amel-edit-row">
            <input type="text" placeholder="Nom" value={nom} onChange={e => setNom(e.target.value)} autoFocus />
            <select className="inventaire-amel-rang-select" value={rang} onChange={e => setRang(Number(e.target.value))}>
              {[1, 2, 3].filter(r => r <= slotsMax).map(r => (
                <option key={r} value={r}>{['I','II','III'][r-1]}</option>
              ))}
            </select>
          </div>
          <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} rows={2} />
        </>
      )}
      <div className="inventaire-amel-edit-actions">
        <button className="btn-primary" onClick={handleSave}>{amel ? 'OK' : 'Ajouter'}</button>
        <button className="btn-secondary" onClick={onCancel}>Annuler</button>
        {amel && onDelete && (
          <button className="inventaire-btn-delete" onClick={onDelete}>✕</button>
        )}
      </div>
    </div>
  );
}

function LigneObjet({ objet, isEquipped, isExpanded, poigne, getMod, entrainements, onToggle, onEdit, onEquip, onUnequip, onDelete, onConsommer, onUpdateAmeliorations, onUpdatePromotions }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editingAmelIdx, setEditingAmelIdx] = useState(null);
  const [editingPromIdx, setEditingPromIdx] = useState(null);
  const [promForm, setPromForm] = useState({ nom: '', description: '', rang: 1 });
  const typeLabel = TYPES_OBJET.find(t => t.id === objet.type)?.label || objet.type;
  const slotLabel = objet.slot ? SLOTS[objet.slot] : null;
  const canEquip = TYPES_EQUIPABLES.includes(objet.type);
  const hasQualite = TYPES_AVEC_QUALITE.includes(objet.type);
  const hasCategorie = TYPES_AVEC_CATEGORIE.includes(objet.type);
  const isArme = objet.type === 'arme';
  const isArmure = objet.type === 'armure';
  const isSousPiece = objet.type === 'sous_piece_armure';
  const isColifichet = objet.type === 'colifichet';
  const isOutil = objet.type === 'outil';
  const isConsommable = objet.type === 'consommable';
  const qualite = objet.qualite ?? 0;
  const forme = isArme ? getForme(objet.forme) : null;
  const typeArme = isArme ? getTypeArme(objet.typeArme) : null;
  const poids = isArme
    ? calculerPoidsArme(objet)
    : (TYPES_EQUIPABLES.includes(objet.type) && TYPES_AVEC_CATEGORIE.includes(objet.type)) ? (objet.categorie ?? 0) * 5 : 0;
  const tropLourd = isEquipped && poids > 0 && poigne < poids;
  const encLabel = isConsommable ? ENCOMBREMENT_OPTIONS.find(o => o.value === objet.encombrement)?.label || '1/8' : null;
  const jetAttr = getJetAttribut(objet);
  const jet = isOutil ? formatJet(objet.categorie, jetAttr ? getMod(jetAttr) : 0) : null;
  const solidite = hasQualite ? 10 + (objet.categorie ?? 0) + (objet.qualite ?? 0) + (objet.gabarit ?? 0) : null;
  const isFocalisateur = objet.type === 'focalisateur';
  const hasPenalite = isArme || isArmure || isSousPiece || isOutil || isFocalisateur;
  const hasPromotions = TYPES_AVEC_PROMOTIONS.includes(objet.type) && qualite > 0;
  const penaliteAjustement = hasPenalite ? calculerPenaliteAjustement(objet, entrainements || {}) : 0;

  const slotTypeLabel = isSousPiece
    ? SLOTS_SOUS_PIECE.find(s => s.id === objet.slotType)?.label
    : isColifichet
      ? TYPES_COLIFICHET.find(t => t.id === objet.slotType)?.label
      : null;

  const handleDelete = () => {
    if (confirmDelete) {
      onDelete(objet.id);
    } else {
      setConfirmDelete(true);
    }
  };

  return (
    <div className={`inventaire-ligne ${isExpanded ? 'expanded' : ''}`}>
      <div className="inventaire-ligne-header">
        <div className="inventaire-ligne-info" onClick={onToggle}>
          <span className="inventaire-ligne-nom">{isArme ? '⚔ ' : isArmure ? '🛡 ' : isSousPiece ? '🔰 ' : isColifichet ? '💍 ' : ''}{objet.nom}</span>
          {tropLourd && (
            <span
              className="inventaire-poids-warn"
              title="Poigne insuffisante : le personnage est désavantagé à son usage"
            >&#x26A0;</span>
          )}
          {(hasQualite || hasCategorie) && (
            <span className="inventaire-ligne-stats">
              {hasQualite && (
                <span className={`inventaire-qualite ${qualite > 0 ? 'positive' : qualite < 0 ? 'negative' : ''}`}>
                  Q{qualite}
                </span>
              )}
              {hasCategorie && (
                <span className="inventaire-categorie">C{objet.categorie ?? 0}</span>
              )}
            </span>
          )}
          <span className="inventaire-ligne-type">
            {typeLabel}{slotTypeLabel ? ` — ${slotTypeLabel}` : ''}
          </span>
          {isConsommable && (
            <span className="inventaire-ligne-slot">×{objet.quantite ?? 1} (enc. {encLabel})</span>
          )}
          {isEquipped && slotLabel && (
            <span className="inventaire-ligne-slot">{slotLabel}</span>
          )}
        </div>
        <div className="inventaire-ligne-actions">
          {isConsommable && (
            <button
              className="inventaire-btn-consommer"
              onClick={() => onConsommer(objet.id)}
              title="Consommer (−1)"
            >
              −1
            </button>
          )}
          {canEquip && (
            <button
              className={`inventaire-btn-equip ${isEquipped ? 'equipped' : ''}`}
              onClick={() => isEquipped ? onUnequip(objet.id) : onEquip(objet)}
              title={isEquipped ? 'Retirer' : 'Équiper'}
            >
              {isEquipped ? '▼' : '▲'}
            </button>
          )}
          <button
            className="inventaire-btn-edit"
            onClick={() => onEdit(objet)}
            title="Modifier"
          >
            ✎
          </button>
          <button
            className={`inventaire-btn-delete ${confirmDelete ? 'confirm' : ''}`}
            onClick={handleDelete}
            onBlur={() => setConfirmDelete(false)}
            title={confirmDelete ? 'Confirmer la suppression' : 'Supprimer'}
          >
            {confirmDelete ? '?' : '✕'}
          </button>
        </div>
      </div>
      {isExpanded && (
        <div className="inventaire-ligne-detail">
          {isArme && forme && typeArme && (
            <>
              <div className="inventaire-detail-auto">
                {[
                  `Forme : ${forme.label} (${forme.attr})`,
                  `Type : ${typeArme.label} (${typeArme.attr})`,
                  ...ARME_DIMENSIONS.map(dim => {
                    const val = objet[dim.id] ?? 0;
                    const label = dim.options.find(o => o.value === val)?.label || 'Normal';
                    return `${dim.label} : ${label}`;
                  })
                ].join(', ')}
              </div>
              <div className="inventaire-detail-auto">
                {(() => {
                  const baseMod = getMod(forme.attr);
                  const cat = objet.categorie ?? 0;
                  const taille = objet.taille ?? 0;
                  const gabarit = objet.gabarit ?? 0;
                  const equilibre = objet.equilibre ?? 0;
                  const nbDes = 2 + cat;
                  const fmt = (m) => m >= 0 ? `+${m}` : `${m}`;
                  const isDistance = forme.attr === 'PER';

                  let porteeStr;
                  if (isDistance) {
                    const x = (cat + taille) * 4;
                    porteeStr = `Portée de tir : 0(dsvgt) ~ ${x} ~ ${2 * x}(dsvgt) ~ ${3 * x}(2×dsvgt)`;
                  } else {
                    const porteeMelee = Math.floor((cat + getMod('TAI') + taille) / 4);
                    const porteeJet = Math.max(0, 5 - cat + taille);
                    porteeStr = `Portée de mêlée : ${porteeMelee}, Portée de jet : ${porteeJet}`;
                  }

                  return [
                    `${nbDes}D8 (${fmt(baseMod + taille - gabarit - equilibre)} attaque) (${fmt(baseMod - taille + gabarit - equilibre)} défense) (${fmt(baseMod - taille - gabarit + equilibre)} tactique)`,
                    `Hâte : ${fmt(equilibre)}`,
                    porteeStr
                  ].join(', ');
                })()}
              </div>
            </>
          )}
          {isOutil && objet.attributOutil && (
            <div className="inventaire-detail-auto">
              Type : {objet.attributOutil}
            </div>
          )}
          {(isArmure || isSousPiece) && (
            <div className="inventaire-detail-auto">
              Absorption : {(objet.categorie ?? 1) * 3}, Résistance : {objet.categorie ?? 1}, Protection : {objet.categorie ?? 1}
            </div>
          )}
          {(jet || poids > 0 || hasCategorie || hasPenalite || solidite !== null) && (
            <div className="inventaire-detail-auto">
              {[
                jet && `Jet : ${jet}`,
                TYPES_AVEC_MATIERE.includes(objet.type) && objet.matiere && `Matière : ${objet.matiere}`,
                poids > 0 && `Poids : ${poids}`,
                hasCategorie && `Encombrement : ${objet.categorie ?? 0}`,
                solidite !== null && `Solidité : ${solidite}`,
                hasPenalite && (() => {
                  const cat = objet.categorie ?? 0;
                  const qual = objet.qualite ?? 0;
                  const parts = [`2×${cat}`];
                  if (entrainements) {
                    let niv = 0;
                    if (isArme) {
                      const f = getForme(objet.forme);
                      niv = f?.attr === 'PER' ? (entrainements.armesDistance ?? 0) : (entrainements.armesMelee ?? 0);
                    } else if (isArmure || isSousPiece) niv = entrainements.armures ?? 0;
                    else if (isOutil) niv = entrainements.outils ?? 0;
                    else if (isFocalisateur) niv = entrainements.magie ?? 0;
                    if (niv > 0) parts.push(`entr. -${2 * niv}`);
                  }
                  if (qual !== 0) parts.push(`qual. ${qual > 0 ? '+' : ''}${qual}`);
                  const sign = penaliteAjustement > 0 ? '+' : '';
                  return `Ajustement : ${sign}${penaliteAjustement} (${parts.join(', ')})`;
                })()
              ].filter(Boolean).join(', ')}
            </div>
          )}
          {isConsommable && (
            <div className="inventaire-detail-auto">
              Encombrement : {encLabel} × {objet.quantite ?? 1} = {((objet.encombrement ?? 0.125) * (objet.quantite ?? 1)).toFixed(2).replace(/\.?0+$/, '')}
            </div>
          )}
          {objet.description && (
            <div className="inventaire-detail-desc">{objet.description}</div>
          )}
          {hasPromotions && (
            <div className="inventaire-ameliorations">
              {(() => {
                const proms = objet.promotions || [];
                const slotsUtilises = proms.reduce((s, p) => s + (p.rang || 1), 0);
                const slotsRestants = qualite - slotsUtilises;
                return (
                  <>
                    <div className="inventaire-ameliorations-header">
                      <span className="inventaire-ameliorations-label">Promotions ({slotsUtilises}/{qualite} slots)</span>
                      {slotsRestants >= 1 && (
                        <button
                          className="inventaire-btn-amel-add"
                          onClick={() => { setEditingPromIdx('new'); setPromForm({ nom: '', description: '', rang: 1 }); }}
                        >+</button>
                      )}
                    </div>
                    {proms.map((prom, idx) => (
                      <div key={idx} className="inventaire-amelioration">
                        {editingPromIdx === idx ? (
                          <div className="inventaire-amel-edit">
                            <div className="inventaire-amel-edit-row">
                              <input
                                type="text"
                                placeholder="Nom"
                                value={promForm.nom}
                                onChange={e => setPromForm({ ...promForm, nom: e.target.value })}
                                autoFocus
                              />
                              <select
                                className="inventaire-amel-rang-select"
                                value={promForm.rang || 1}
                                onChange={e => setPromForm({ ...promForm, rang: Number(e.target.value) })}
                              >
                                {[1, 2, 3].filter(r => r <= slotsRestants + (prom.rang || 1)).map(r => (
                                  <option key={r} value={r}>{['I','II','III'][r-1]}</option>
                                ))}
                              </select>
                            </div>
                            <textarea
                              placeholder="Description"
                              value={promForm.description}
                              onChange={e => setPromForm({ ...promForm, description: e.target.value })}
                              rows={2}
                            />
                            <div className="inventaire-amel-edit-actions">
                              <button className="btn-primary" onClick={() => {
                                if (!promForm.nom.trim()) return;
                                const newProms = [...proms];
                                newProms[idx] = { nom: promForm.nom, description: promForm.description, rang: promForm.rang || 1 };
                                onUpdatePromotions(objet.id, newProms);
                                setEditingPromIdx(null);
                              }}>OK</button>
                              <button className="btn-secondary" onClick={() => setEditingPromIdx(null)}>Annuler</button>
                              <button className="inventaire-btn-delete" onClick={() => {
                                const newProms = proms.filter((_, i) => i !== idx);
                                onUpdatePromotions(objet.id, newProms);
                                setEditingPromIdx(null);
                              }}>✕</button>
                            </div>
                          </div>
                        ) : (
                          <div className="inventaire-amel-display" onClick={() => { setEditingPromIdx(idx); setPromForm({ nom: prom.nom, description: prom.description, rang: prom.rang || 1 }); }}>
                            <span className="inventaire-amel-nom"><span className="inventaire-amel-rang">{['I','II','III'][(prom.rang || 1) - 1]}</span>{prom.nom}</span>
                            {prom.description && <span className="inventaire-amel-desc">{prom.description}</span>}
                          </div>
                        )}
                      </div>
                    ))}
                    {editingPromIdx === 'new' && (
                      <div className="inventaire-amelioration">
                        <div className="inventaire-amel-edit">
                          <div className="inventaire-amel-edit-row">
                            <input
                              type="text"
                              placeholder="Nom"
                              value={promForm.nom}
                              onChange={e => setPromForm({ ...promForm, nom: e.target.value })}
                              autoFocus
                            />
                            <select
                              className="inventaire-amel-rang-select"
                              value={promForm.rang || 1}
                              onChange={e => setPromForm({ ...promForm, rang: Number(e.target.value) })}
                            >
                              {[1, 2, 3].filter(r => r <= slotsRestants).map(r => (
                                <option key={r} value={r}>{['I','II','III'][r-1]}</option>
                              ))}
                            </select>
                          </div>
                          <textarea
                            placeholder="Description"
                            value={promForm.description}
                            onChange={e => setPromForm({ ...promForm, description: e.target.value })}
                            rows={2}
                          />
                          <div className="inventaire-amel-edit-actions">
                            <button className="btn-primary" onClick={() => {
                              if (!promForm.nom.trim()) return;
                              const newProms = [...proms, { nom: promForm.nom, description: promForm.description, rang: promForm.rang || 1 }];
                              onUpdatePromotions(objet.id, newProms);
                              setEditingPromIdx(null);
                            }}>Ajouter</button>
                            <button className="btn-secondary" onClick={() => setEditingPromIdx(null)}>Annuler</button>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          )}
          {hasQualite && qualite > 0 && (
            <div className="inventaire-ameliorations">
              {(() => {
                const amels = objet.ameliorations || [];
                const slotsUtilises = amels.reduce((s, a) => s + (a.rang || 1), 0);
                const slotsRestants = qualite - slotsUtilises;
                return (
                  <>
                    <div className="inventaire-ameliorations-header">
                      <span className="inventaire-ameliorations-label">Améliorations ({slotsUtilises}/{qualite} slots)</span>
                      {slotsRestants >= 1 && (
                        <button
                          className="inventaire-btn-amel-add"
                          onClick={() => setEditingAmelIdx('new')}
                        >+</button>
                      )}
                    </div>
                    {amels.map((amel, idx) => (
                      <div key={idx} className="inventaire-amelioration">
                        {editingAmelIdx === idx ? (
                          <AmeliorationEditForm
                            objet={objet}
                            amel={amel}
                            slotsRestants={slotsRestants}
                            onSave={saved => {
                              const newAmels = [...amels];
                              newAmels[idx] = saved;
                              onUpdateAmeliorations(objet.id, newAmels);
                              setEditingAmelIdx(null);
                            }}
                            onCancel={() => setEditingAmelIdx(null)}
                            onDelete={() => {
                              const newAmels = amels.filter((_, i) => i !== idx);
                              onUpdateAmeliorations(objet.id, newAmels);
                              setEditingAmelIdx(null);
                            }}
                          />
                        ) : (
                          <div className="inventaire-amel-display" onClick={() => setEditingAmelIdx(idx)}>
                            <span className="inventaire-amel-nom"><span className="inventaire-amel-rang">{['I','II','III'][(amel.rang || 1) - 1]}</span>{amel.nom}</span>
                            {amel.description && <span className="inventaire-amel-desc">{amel.description}</span>}
                          </div>
                        )}
                      </div>
                    ))}
                    {editingAmelIdx === 'new' && (
                      <div className="inventaire-amelioration">
                        <AmeliorationEditForm
                          objet={objet}
                          amel={null}
                          slotsRestants={slotsRestants}
                          onSave={saved => {
                            const newAmels = [...amels, saved];
                            onUpdateAmeliorations(objet.id, newAmels);
                            setEditingAmelIdx(null);
                          }}
                          onCancel={() => setEditingAmelIdx(null)}
                        />
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function calculerCharge(objetsEquipes) {
  const armesEquipees = objetsEquipes.filter(o => TYPES_EN_MAIN.includes(o.type) && o.slot);
  const armureEquipee = objetsEquipes.find(o => o.type === 'armure' && o.slot);
  const piecesEquipees = objetsEquipes.filter(o => (o.type === 'sous_piece_armure' || o.type === 'colifichet') && o.slot);

  let charge = 0;

  // Armure : poids plein
  if (armureEquipee) {
    charge += (armureEquipee.categorie ?? 1) * 5;
  }

  // Armes
  if (armesEquipees.length === 1) {
    charge += calculerPoidsArme(armesEquipees[0]);
  } else if (armesEquipees.length >= 2) {
    const poids = armesEquipees.map(calculerPoidsArme).sort((a, b) => a - b);
    // La plus légère est divisée par deux
    charge += Math.floor(poids[0] / 2);
    for (let i = 1; i < poids.length; i++) {
      charge += poids[i];
    }
  }

  // Sous-pièces d'armure et colifichets : poids plein
  piecesEquipees.forEach(p => {
    charge += (p.categorie ?? 0) * 5;
  });

  return charge;
}

function ChargeTotal({ objetsEquipes, chargeMax }) {
  const charge = calculerCharge(objetsEquipes);
  const surcharge = charge > chargeMax;

  return (
    <span className={`inventaire-charge ${surcharge ? 'surcharge' : ''}`}>
      {surcharge && (
        <span
          className="inventaire-poids-warn"
          title="Le personnage est désavantagé à tous ses tests de compétence"
        >&#x26A0; </span>
      )}
      Charge Totale = {charge}/{chargeMax}
    </span>
  );
}

function calculerEncombrement(objets) {
  let total = 0;
  objets.forEach(o => {
    if (o.type === 'consommable') {
      total += (o.encombrement ?? 0.125) * (o.quantite ?? 1);
    } else if (TYPES_AVEC_CATEGORIE.includes(o.type)) {
      total += o.categorie ?? 0;
    }
  });
  return total;
}

function formatEncombrement(val) {
  // Affiche proprement les fractions
  const str = val.toFixed(3).replace(/\.?0+$/, '');
  return str;
}

function EncombrementTotal({ objets, encombrementMax }) {
  const enc = calculerEncombrement(objets);
  const surcharge = enc > encombrementMax;

  return (
    <span className={`inventaire-charge ${surcharge ? 'surcharge' : ''}`}>
      {surcharge && (
        <span
          className="inventaire-poids-warn"
          title="Encombrement dépassé"
        >&#x26A0; </span>
      )}
      Encombrement = {formatEncombrement(enc)}/{encombrementMax}
    </span>
  );
}

function TabInventaire() {
  const { character, updateCharacter } = useCharacter();
  const calc = useCharacterCalculations(character);
  const [modal, setModal] = useState(null); // null | 'new' | { edit: objet }
  const [slotPicker, setSlotPicker] = useState(null); // null | { objet, slots: [{id, label}] }
  const [expandedId, setExpandedId] = useState(null);

  const inventaire = character.inventaire || [];
  const entrainements = character.entrainements || {};

  const objetsEquipes = inventaire.filter(o => o.slot);
  const objetsNonEquipes = inventaire.filter(o => !o.slot);

  const handleAdd = () => {
    setModal('new');
  };

  const handleEdit = (objet) => {
    setModal({ edit: objet });
  };

  const handleSave = (form) => {
    updateCharacter(prev => {
      const inv = prev.inventaire || [];

      if (modal?.edit) {
        const old = modal.edit;
        // Déséquiper si le type ou le slotType change
        const shouldUnequip = old.slot && (form.type !== old.type || form.slotType !== old.slotType);
        return {
          ...prev,
          inventaire: inv.map(o => o.id === old.id
            ? { ...o, ...form, slot: shouldUnequip ? null : o.slot }
            : o
          )
        };
      }

      const newObjet = {
        ...form,
        id: Date.now().toString(),
        slot: null
      };
      return { ...prev, inventaire: [...inv, newObjet] };
    });
    setModal(null);
  };

  const equipToSlot = (objetId, slot) => {
    updateCharacter(prev => {
      let inv = [...(prev.inventaire || [])];

      // Trouver l'objet à équiper
      const objetIndex = inv.findIndex(o => o.id === objetId);
      if (objetIndex === -1) return prev;

      if (slot === 'deuxMains') {
        // Deux mains : libérer mainDirectrice + mainNonDirectrice, swap si deux-mains occupé
        const occupant = inv.find(o => o.slot === 'deuxMains' && o.id !== objetId);
        inv = inv.map(o => {
          if (o.id === objetId) return { ...o, slot: 'deuxMains' };
          if (o.slot === 'mainDirectrice' || o.slot === 'mainNonDirectrice') return { ...o, slot: null };
          if (occupant && o.id === occupant.id) return { ...o, slot: null };
          return o;
        });
      } else if (slot === 'mainDirectrice' || slot === 'mainNonDirectrice') {
        // Une main : libérer deuxMains si occupé, swap si le slot visé est occupé
        const occupant = inv.find(o => o.slot === slot && o.id !== objetId);
        inv = inv.map(o => {
          if (o.id === objetId) return { ...o, slot };
          if (o.slot === 'deuxMains') return { ...o, slot: null };
          if (occupant && o.id === occupant.id) return { ...o, slot: null };
          return o;
        });
      } else {
        // Slot simple (armure, sous-pièce d'armure, colifichet…) : swap si occupé
        const occupant = inv.find(o => o.slot === slot && o.id !== objetId);
        inv = inv.map(o => {
          if (o.id === objetId) return { ...o, slot };
          if (occupant && o.id === occupant.id) return { ...o, slot: null };
          return o;
        });
      }

      return { ...prev, inventaire: inv };
    });
  };

  const handleEquip = (objet) => {
    if (objet.type === 'armure') {
      equipToSlot(objet.id, 'armure');
    } else if (TYPES_EN_MAIN.includes(objet.type)) {
      setSlotPicker({ objet, slots: SLOTS_ARME });
    } else if (objet.type === 'sous_piece_armure') {
      // Le slotType de l'objet détermine directement son emplacement
      if (objet.slotType) equipToSlot(objet.id, objet.slotType);
    } else if (objet.type === 'colifichet') {
      const typeColif = TYPES_COLIFICHET.find(t => t.id === objet.slotType);
      if (typeColif) {
        if (typeColif.slots.length > 1) {
          // Deux emplacements possibles (gauche/droit) → picker
          setSlotPicker({
            objet,
            slots: typeColif.slots.map(s => ({ id: s, label: SLOTS[s] }))
          });
        } else {
          // Slot unique → équipement direct
          equipToSlot(objet.id, typeColif.slots[0]);
        }
      }
    }
  };

  const handleSlotSelect = (slot) => {
    if (slotPicker) {
      equipToSlot(slotPicker.objet.id, slot);
      setSlotPicker(null);
    }
  };

  const handleUnequip = (id) => {
    updateCharacter(prev => ({
      ...prev,
      inventaire: (prev.inventaire || []).map(o =>
        o.id === id ? { ...o, slot: null } : o
      )
    }));
  };

  const handleDelete = (id) => {
    updateCharacter(prev => ({
      ...prev,
      inventaire: (prev.inventaire || []).filter(o => o.id !== id)
    }));
  };

  const handleUpdateAmeliorations = (id, ameliorations) => {
    updateCharacter(prev => ({
      ...prev,
      inventaire: (prev.inventaire || []).map(o =>
        o.id === id ? { ...o, ameliorations } : o
      )
    }));
  };

  const handleUpdatePromotions = (id, promotions) => {
    updateCharacter(prev => ({
      ...prev,
      inventaire: (prev.inventaire || []).map(o =>
        o.id === id ? { ...o, promotions } : o
      )
    }));
  };

  const handleConsommer = (id) => {
    updateCharacter(prev => {
      const inv = (prev.inventaire || []).map(o => {
        if (o.id !== id) return o;
        const newQte = (o.quantite ?? 1) - 1;
        return newQte > 0 ? { ...o, quantite: newQte } : null;
      }).filter(Boolean);
      return { ...prev, inventaire: inv };
    });
  };

  return (
    <div id="tab-inventaire" className="tab-content active">
      <div className="inventaire-add-bar">
        <button className="btn-primary" onClick={handleAdd}>+ Nouvel objet</button>
      </div>

      <Section title="Équipement" headerContent={
        <ChargeTotal objetsEquipes={objetsEquipes} chargeMax={calc.chargeMax} />
      }>
        <div className="inventaire-liste">
          {objetsEquipes.length === 0 && (
            <div className="inventaire-liste-vide">Aucun équipement porté</div>
          )}
          {objetsEquipes.map(o => (
            <LigneObjet
              key={o.id}
              objet={o}
              isEquipped
              isExpanded={expandedId === o.id}
              poigne={calc.poigne}
              getMod={calc.getMod}
              entrainements={entrainements}
              onToggle={() => setExpandedId(expandedId === o.id ? null : o.id)}
              onEdit={handleEdit}
              onEquip={handleEquip}
              onUnequip={handleUnequip}
              onDelete={handleDelete}
              onConsommer={handleConsommer}
              onUpdateAmeliorations={handleUpdateAmeliorations}
              onUpdatePromotions={handleUpdatePromotions}
            />
          ))}
        </div>
      </Section>

      <Section title="Inventaire" headerContent={
        <EncombrementTotal objets={inventaire} encombrementMax={calc.encombrementMax} />
      }>
        <div className="inventaire-liste">
          {objetsNonEquipes.length === 0 && (
            <div className="inventaire-liste-vide">Inventaire vide</div>
          )}
          {objetsNonEquipes.map(o => (
            <LigneObjet
              key={o.id}
              objet={o}
              isEquipped={false}
              isExpanded={expandedId === o.id}
              poigne={calc.poigne}
              getMod={calc.getMod}
              entrainements={entrainements}
              onToggle={() => setExpandedId(expandedId === o.id ? null : o.id)}
              onEdit={handleEdit}
              onEquip={handleEquip}
              onUnequip={handleUnequip}
              onDelete={handleDelete}
              onConsommer={handleConsommer}
              onUpdateAmeliorations={handleUpdateAmeliorations}
              onUpdatePromotions={handleUpdatePromotions}
            />
          ))}
        </div>
      </Section>

      {modal && (
        <ObjetModal
          objet={modal?.edit || null}
          isEdit={!!modal?.edit}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}

      {slotPicker && (
        <SlotPickerModal
          objet={slotPicker.objet}
          slots={slotPicker.slots}
          onSelect={handleSlotSelect}
          onClose={() => setSlotPicker(null)}
        />
      )}
    </div>
  );
}

export default TabInventaire;
export { calculerPenaliteAjustement };
