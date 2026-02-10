import { useState } from 'react';
import { useCharacter } from '../../context/CharacterContext';
import { useCharacterCalculations } from '../../hooks/useCharacterCalculations';
import DATA from '../../data';
import Section from '../common/Section';

const ATTRIBUTS_PRINCIPAUX = DATA.attributsPrincipaux.map(a => a.id);

const TYPES_OBJET = [
  { id: 'arme', label: 'Arme' },
  { id: 'armure', label: 'Armure' },
  { id: 'focalisateur', label: 'Focalisateur' },
  { id: 'outil', label: 'Outil' },
  { id: 'consommable', label: 'Consommable' },
  { id: 'autre', label: 'Autre' }
];

const TYPES_AVEC_QUALITE = ['arme', 'armure', 'focalisateur', 'outil', 'autre', 'consommable'];
const TYPES_AVEC_CATEGORIE = ['arme', 'armure', 'focalisateur', 'outil', 'autre'];
const TYPES_EN_MAIN = ['arme', 'focalisateur'];
const TYPES_EQUIPABLES = ['arme', 'armure', 'focalisateur'];

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

function calculerPenaliteAjustement(objet, entrainements) {
  const cat = objet.categorie ?? 0;
  const qual = objet.qualite ?? 0;
  let niveau = 0;
  if (objet.type === 'arme') {
    const forme = getForme(objet.forme);
    niveau = forme?.attr === 'PER'
      ? (entrainements.armesDistance ?? 0)
      : (entrainements.armesMelee ?? 0);
  } else if (objet.type === 'armure') {
    niveau = entrainements.armures ?? 0;
  } else if (objet.type === 'outil') {
    niveau = entrainements.outils ?? 0;
  } else if (objet.type === 'focalisateur') {
    niveau = entrainements.magie ?? 0;
  } else {
    return 0;
  }
  return Math.max(0, 2 * cat - 2 * niveau + qual);
}

const SLOTS = {
  mainDirectrice: 'Main directrice',
  mainNonDirectrice: 'Main non directrice',
  deuxMains: 'Deux mains',
  armure: 'Armure'
};

const SLOTS_ARME = [
  { id: 'mainDirectrice', label: 'Main directrice' },
  { id: 'mainNonDirectrice', label: 'Main non directrice' },
  { id: 'deuxMains', label: 'Deux mains' }
];

function ObjetModal({ objet, isEdit, onSave, onClose }) {
  const [form, setForm] = useState({
    nom: objet?.nom || '',
    type: objet?.type || 'arme',
    description: objet?.description || '',
    qualite: objet?.qualite ?? 0,
    categorie: objet?.categorie ?? 0,
    forme: objet?.forme || 'tranchant',
    typeArme: objet?.typeArme || 'escrime',
    attributOutil: objet?.attributOutil || 'DEX',
    encombrement: objet?.encombrement ?? 0.125,
    quantite: objet?.quantite ?? 1
  });

  const hasQualite = TYPES_AVEC_QUALITE.includes(form.type);
  const hasCategorie = TYPES_AVEC_CATEGORIE.includes(form.type);
  const isArme = form.type === 'arme';
  const isOutil = form.type === 'outil';
  const isConsommable = form.type === 'consommable';

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
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
    }
    if (form.type === 'outil') {
      data.attributOutil = form.attributOutil;
    }
    if (form.type === 'consommable') {
      data.encombrement = form.encombrement;
      data.quantite = form.quantite;
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
                onChange={e => setForm({ ...form, type: e.target.value })}
              >
                {TYPES_OBJET.map(t => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </select>
            </div>
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

function SlotPickerModal({ objet, onSelect, onClose }) {
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
            {SLOTS_ARME.map(slot => (
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

function LigneObjet({ objet, isEquipped, isExpanded, poigne, getMod, entrainements, onToggle, onEdit, onEquip, onUnequip, onDelete, onConsommer, onUpdateAmeliorations }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editingAmelIdx, setEditingAmelIdx] = useState(null);
  const [amelForm, setAmelForm] = useState({ nom: '', description: '' });
  const typeLabel = TYPES_OBJET.find(t => t.id === objet.type)?.label || objet.type;
  const slotLabel = objet.slot ? SLOTS[objet.slot] : null;
  const canEquip = TYPES_EQUIPABLES.includes(objet.type);
  const hasQualite = TYPES_AVEC_QUALITE.includes(objet.type);
  const hasCategorie = TYPES_AVEC_CATEGORIE.includes(objet.type);
  const isArme = objet.type === 'arme';
  const isArmure = objet.type === 'armure';
  const isOutil = objet.type === 'outil';
  const isConsommable = objet.type === 'consommable';
  const qualite = objet.qualite ?? 0;
  const forme = isArme ? getForme(objet.forme) : null;
  const typeArme = isArme ? getTypeArme(objet.typeArme) : null;
  const poids = TYPES_EQUIPABLES.includes(objet.type) ? (objet.categorie ?? 1) * 5 : 0;
  const tropLourd = isEquipped && poids > 0 && poigne < poids;
  const encLabel = isConsommable ? ENCOMBREMENT_OPTIONS.find(o => o.value === objet.encombrement)?.label || '1/8' : null;
  const jetAttr = getJetAttribut(objet);
  const jet = (isArme || isOutil) ? formatJet(objet.categorie, jetAttr ? getMod(jetAttr) : 0) : null;
  const isFocalisateur = objet.type === 'focalisateur';
  const hasPenalite = isArme || isArmure || isOutil || isFocalisateur;
  const penaliteAjustement = hasPenalite ? calculerPenaliteAjustement(objet, entrainements || {}) : 0;

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
          <span className="inventaire-ligne-nom">{isArme ? '⚔ ' : isArmure ? '🛡 ' : ''}{objet.nom}</span>
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
          <span className="inventaire-ligne-type">{typeLabel}</span>
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
            <div className="inventaire-detail-auto">
              Forme : {forme.label} (attaque avec {forme.attr}), Type : {typeArme.label} (attaque sur {typeArme.attr})
            </div>
          )}
          {isOutil && objet.attributOutil && (
            <div className="inventaire-detail-auto">
              Type : {objet.attributOutil}
            </div>
          )}
          {isArmure && (
            <div className="inventaire-detail-auto">
              Absorption : {(objet.categorie ?? 1) * 3}, Résistance : {objet.categorie ?? 1}, Protection : {objet.categorie ?? 1}
            </div>
          )}
          {(jet || poids > 0 || hasCategorie || hasPenalite) && (
            <div className="inventaire-detail-auto">
              {[
                jet && `Jet : ${jet}`,
                poids > 0 && `Poids : ${poids}`,
                hasCategorie && `Encombrement : ${objet.categorie ?? 0}`,
                hasPenalite && (() => {
                  const cat = objet.categorie ?? 0;
                  const qual = objet.qualite ?? 0;
                  const parts = [`2×${cat}`];
                  if (entrainements) {
                    let niv = 0;
                    if (isArme) {
                      const f = getForme(objet.forme);
                      niv = f?.attr === 'PER' ? (entrainements.armesDistance ?? 0) : (entrainements.armesMelee ?? 0);
                    } else if (isArmure) niv = entrainements.armures ?? 0;
                    else if (isOutil) niv = entrainements.outils ?? 0;
                    else if (objet.type === 'focalisateur') niv = entrainements.magie ?? 0;
                    if (niv > 0) parts.push(`entr. -${2 * niv}`);
                  }
                  if (qual !== 0) parts.push(`qual. ${qual > 0 ? '+' : ''}${qual}`);
                  return `Ajustement : -${penaliteAjustement} (${parts.join(', ')})`;
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
          {hasQualite && qualite > 0 && (
            <div className="inventaire-ameliorations">
              <div className="inventaire-ameliorations-header">
                <span className="inventaire-ameliorations-label">Améliorations ({(objet.ameliorations || []).length}/{qualite})</span>
                {(objet.ameliorations || []).length < qualite && (
                  <button
                    className="inventaire-btn-amel-add"
                    onClick={() => { setEditingAmelIdx('new'); setAmelForm({ nom: '', description: '' }); }}
                  >+</button>
                )}
              </div>
              {(objet.ameliorations || []).map((amel, idx) => (
                <div key={idx} className="inventaire-amelioration">
                  {editingAmelIdx === idx ? (
                    <div className="inventaire-amel-edit">
                      <input
                        type="text"
                        placeholder="Nom"
                        value={amelForm.nom}
                        onChange={e => setAmelForm({ ...amelForm, nom: e.target.value })}
                        autoFocus
                      />
                      <textarea
                        placeholder="Description"
                        value={amelForm.description}
                        onChange={e => setAmelForm({ ...amelForm, description: e.target.value })}
                        rows={2}
                      />
                      <div className="inventaire-amel-edit-actions">
                        <button className="btn-primary" onClick={() => {
                          if (!amelForm.nom.trim()) return;
                          const amels = [...(objet.ameliorations || [])];
                          amels[idx] = { nom: amelForm.nom, description: amelForm.description };
                          onUpdateAmeliorations(objet.id, amels);
                          setEditingAmelIdx(null);
                        }}>OK</button>
                        <button className="btn-secondary" onClick={() => setEditingAmelIdx(null)}>Annuler</button>
                        <button className="inventaire-btn-delete" onClick={() => {
                          const amels = (objet.ameliorations || []).filter((_, i) => i !== idx);
                          onUpdateAmeliorations(objet.id, amels);
                          setEditingAmelIdx(null);
                        }}>✕</button>
                      </div>
                    </div>
                  ) : (
                    <div className="inventaire-amel-display" onClick={() => { setEditingAmelIdx(idx); setAmelForm({ nom: amel.nom, description: amel.description }); }}>
                      <span className="inventaire-amel-nom">{amel.nom}</span>
                      {amel.description && <span className="inventaire-amel-desc">{amel.description}</span>}
                    </div>
                  )}
                </div>
              ))}
              {editingAmelIdx === 'new' && (
                <div className="inventaire-amelioration">
                  <div className="inventaire-amel-edit">
                    <input
                      type="text"
                      placeholder="Nom"
                      value={amelForm.nom}
                      onChange={e => setAmelForm({ ...amelForm, nom: e.target.value })}
                      autoFocus
                    />
                    <textarea
                      placeholder="Description"
                      value={amelForm.description}
                      onChange={e => setAmelForm({ ...amelForm, description: e.target.value })}
                      rows={2}
                    />
                    <div className="inventaire-amel-edit-actions">
                      <button className="btn-primary" onClick={() => {
                        if (!amelForm.nom.trim()) return;
                        const amels = [...(objet.ameliorations || []), { nom: amelForm.nom, description: amelForm.description }];
                        onUpdateAmeliorations(objet.id, amels);
                        setEditingAmelIdx(null);
                      }}>Ajouter</button>
                      <button className="btn-secondary" onClick={() => setEditingAmelIdx(null)}>Annuler</button>
                    </div>
                  </div>
                </div>
              )}
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

  let charge = 0;

  // Armure : poids plein
  if (armureEquipee) {
    charge += (armureEquipee.categorie ?? 1) * 5;
  }

  // Armes
  if (armesEquipees.length === 1) {
    charge += (armesEquipees[0].categorie ?? 1) * 5;
  } else if (armesEquipees.length >= 2) {
    const poids = armesEquipees.map(a => (a.categorie ?? 1) * 5).sort((a, b) => a - b);
    // La plus légère est divisée par deux
    charge += Math.floor(poids[0] / 2);
    for (let i = 1; i < poids.length; i++) {
      charge += poids[i];
    }
  }

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
  const [slotPicker, setSlotPicker] = useState(null); // null | objet (arme to equip)
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
        // Si le type change et l'objet est équipé, le déséquiper
        const shouldUnequip = old.slot && form.type !== old.type;
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
      } else if (slot === 'armure') {
        // Armure : swap si occupé
        const occupant = inv.find(o => o.slot === 'armure' && o.id !== objetId);
        inv = inv.map(o => {
          if (o.id === objetId) return { ...o, slot: 'armure' };
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
      setSlotPicker(objet);
    }
  };

  const handleSlotSelect = (slot) => {
    if (slotPicker) {
      equipToSlot(slotPicker.id, slot);
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
          objet={slotPicker}
          onSelect={handleSlotSelect}
          onClose={() => setSlotPicker(null)}
        />
      )}
    </div>
  );
}

export default TabInventaire;
export { calculerPenaliteAjustement };
