'use strict';

const ATTRS       = ["FOR", "DEX", "AGI", "PER", "CON", "CHA", "INT", "RUS", "SAG", "VOL", "MAG"];
const ATTRS_SEC   = ["STA", "TAI", "EGO", "APP", "CHN"]; // EQU est calculé séparément
const SAUVEGARDES = ["robustesse", "détermination", "réflexes", "sang-froid", "intuition", "opposition", "fortune"];
const SOURCES     = ["race", "ethnie", "lignee", "regne"];
const SRC_LABEL   = { race: "Race", ethnie: "Ethnie", lignee: "Lignée", regne: "Règne" };
const TYPE_LABEL  = { regne: "Règne", race: "Race", ethnie: "Ethnie", lignee: "Lignée", particularite: "Particularité", declencheur: "Déclencheur", effet: "Effet", regle: "Règle structurelle", action: "Action" };
const LEVEL_NAMES = { "-1": "Minimal", "0": "Défaut", "1": "Avancé", "2": "Optimisé", "3": "Paroxysme" };
const LEVEL_X     = { "-1": 1, "0": 2, "1": 3, "2": 4, "3": 5 };
const SAVE_COLORS = { haut: "ok", moyen: "acc", bas: "" };
const PART_BASE   = { "regne": 0, "race": 1, "ethnie": 2, "lignee": 3 };
const STORAGE_KEY = "tn_pnj_profiles";
const DATA_KEY    = "tn_data";
const PARTS_KEY   = "tn_particularites";
const ACTIONS_KEY = "tn_actions";
const TRIGGERS_KEY = "tn_declencheurs";
const EFFECTS_KEY  = "tn_effets";
const RULES_KEY    = "tn_regles_structurelles";

let DATA        = null;
let COMPETENCES = [];

// ── App state ─────────────────────────────────────────────────────────────────

const state = {
  editingId: null,
  regne: null, race: null, ethnie: null, lignee: null,
  rang: 3, role: "ennemi",
  tiers: {},
  bd: { race: {}, ethnie: {}, lignee: {}, regne: {} },
  arme_nat: 0, armure_nat: 0,
  attrs_sec: { STA: 0, TAI: 0, EGO: 0, APP: 0, CHN: 0, EQU: 0 }
};

// ── Couche données taxonomy ───────────────────────────────────────────────────

function loadTnData() {
  try {
    return JSON.parse(localStorage.getItem(DATA_KEY) || "null")
      || { regnes: [], races: [], ethnies: [], lignees: [] };
  } catch { return { regnes: [], races: [], ethnies: [], lignees: [] }; }
}
function persistTnData(d)      { localStorage.setItem(DATA_KEY, JSON.stringify(d)); }
function getCollection(type)   { return loadTnData()[type + "s"] || []; }
function getEntryById(type, id) {
  if (!id) return null;
  return getCollection(type).find(x => x.id === id) || null;
}

// ── Bibliothèque particularités ───────────────────────────────────────────────

function loadParts() {
  try { return JSON.parse(localStorage.getItem(PARTS_KEY) || "[]"); }
  catch { return []; }
}
function persistParts(p)    { localStorage.setItem(PARTS_KEY, JSON.stringify(p)); }
function getPartById(id)    { return loadParts().find(p => p.id === id) || null; }
function savePart(part) {
  const parts = loadParts();
  const idx = parts.findIndex(p => p.id === part.id);
  if (idx >= 0) parts[idx] = part; else parts.push(part);
  persistParts(parts);
  return part;
}

function loadTriggers() { try { return JSON.parse(localStorage.getItem(TRIGGERS_KEY) || "[]"); } catch { return []; } }
function persistTriggers(items) { localStorage.setItem(TRIGGERS_KEY, JSON.stringify(items)); }
function getTriggerById(id) { return loadTriggers().find(x => x.id === id) || null; }
function saveTrigger(item) { const items = loadTriggers(); const i = items.findIndex(x => x.id === item.id); if (i >= 0) items[i] = item; else items.push(item); persistTriggers(items); return item; }

function loadEffects() { try { return JSON.parse(localStorage.getItem(EFFECTS_KEY) || "[]"); } catch { return []; } }
function persistEffects(items) { localStorage.setItem(EFFECTS_KEY, JSON.stringify(items)); }
function getEffectById(id) { return loadEffects().find(x => x.id === id) || null; }
function saveEffect(item) { const items = loadEffects(); const i = items.findIndex(x => x.id === item.id); if (i >= 0) items[i] = item; else items.push(item); persistEffects(items); return item; }
function loadRules() { try { return JSON.parse(localStorage.getItem(RULES_KEY) || "[]"); } catch { return []; } }
function persistRules(items) { localStorage.setItem(RULES_KEY, JSON.stringify(items)); }
function getRuleById(id) { return loadRules().find(x => x.id === id) || null; }
function saveRule(item) { const items = loadRules(); const i = items.findIndex(x => x.id === item.id); if (i >= 0) items[i] = item; else items.push(item); persistRules(items); return item; }

// ── Bibliothèque actions ──────────────────────────────────────────────────────

function loadActions() {
  try { return JSON.parse(localStorage.getItem(ACTIONS_KEY) || "[]"); }
  catch { return []; }
}
function persistActions(a)  { localStorage.setItem(ACTIONS_KEY, JSON.stringify(a)); }
function getActionById(id)  { return loadActions().find(a => a.id === id) || null; }
function saveAction(action) {
  const actions = loadActions();
  const idx = actions.findIndex(a => a.id === action.id);
  if (idx >= 0) actions[idx] = action; else actions.push(action);
  persistActions(actions);
  return action;
}

// ── Profils ───────────────────────────────────────────────────────────────────

function loadProfiles() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); }
  catch { return []; }
}
function persistProfiles(p) { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); }

function snapshotState(name) {
  return {
    id: state.editingId || crypto.randomUUID(),
    name: name || "Sans nom",
    savedAt: new Date().toISOString(),
    regne: state.regne, race: state.race, ethnie: state.ethnie, lignee: state.lignee,
    rang: state.rang, role: state.role,
    tiers: { ...state.tiers },
    bd: {
      race:   { ...state.bd.race },
      ethnie: { ...state.bd.ethnie },
      lignee: { ...state.bd.lignee },
      regne:  { ...state.bd.regne }
    },
    arme_nat: state.arme_nat,
    armure_nat: state.armure_nat,
    attrs_sec: { ...state.attrs_sec }
  };
}

function saveCurrentProfile() {
  const name    = document.getElementById("profile-name").value.trim();
  const profile = snapshotState(name);
  const profiles = loadProfiles();
  const idx = profiles.findIndex(p => p.id === profile.id);
  if (idx >= 0) profiles[idx] = profile; else profiles.push(profile);
  persistProfiles(profiles);
  state.editingId = profile.id;
  flashStatus("save-status", "✓ Sauvegardé");
  renderBiblio();
}

function deleteProfile(id) {
  persistProfiles(loadProfiles().filter(p => p.id !== id));
  if (state.editingId === id) state.editingId = null;
  renderBiblio();
}

function duplicateProfile(id) {
  const profiles = loadProfiles();
  const orig = profiles.find(p => p.id === id);
  if (!orig) return;
  profiles.push({ ...orig, id: crypto.randomUUID(), name: orig.name + " (copie)", savedAt: new Date().toISOString() });
  persistProfiles(profiles);
  renderBiblio();
}

function applyProfile(profile) {
  state.editingId = profile.id;
  state.regne  = profile.regne  || null;
  state.race   = profile.race   || null;
  state.ethnie = profile.ethnie || null;
  state.lignee = profile.lignee || null;
  state.rang   = profile.rang   ?? 3;
  state.role   = profile.role   || "ennemi";
  state.tiers  = { ...(profile.tiers || {}) };
  state.bd = {
    race:   { ...(profile.bd?.race   || {}) },
    ethnie: { ...(profile.bd?.ethnie || {}) },
    lignee: { ...(profile.bd?.lignee || {}) },
    regne:  { ...(profile.bd?.regne  || {}) }
  };
  state.arme_nat   = profile.arme_nat   ?? 0;
  state.armure_nat = profile.armure_nat ?? 0;
  state.attrs_sec  = { STA: 0, TAI: 0, EGO: 0, APP: 0, CHN: 0, EQU: 0, ...(profile.attrs_sec || {}) };

  populateRaces(state.regne);
  populateEthnies(state.race);
  populateLignees(state.regne);

  document.getElementById("sel-regne").value  = state.regne  || "";
  document.getElementById("sel-race").value   = state.race   || "";
  document.getElementById("sel-ethnie").value = state.ethnie || "";
  document.getElementById("sel-lignee").value = state.lignee || "";
  document.getElementById("sel-rang").value   = state.rang;
  document.getElementById("sel-role").value   = state.role;

  ATTRS.forEach(a => {
    const radio = document.querySelector(`input[name="tier-${a}"][value="${state.tiers[a] || ""}"]`);
    if (radio) radio.checked = true;
  });
  document.getElementById("profile-name").value = profile.name || "";
  render();
}

function resetState() {
  state.editingId = null;
  state.regne = state.race = state.ethnie = state.lignee = null;
  state.rang = 3; state.role = "ennemi";
  state.tiers = {};
  SOURCES.forEach(s => { state.bd[s] = {}; });
  state.arme_nat = state.armure_nat = 0;
  [...ATTRS_SEC, "EQU"].forEach(a => { state.attrs_sec[a] = 0; });

  document.getElementById("sel-regne").value    = "";
  document.getElementById("sel-rang").value     = 3;
  document.getElementById("sel-role").value     = "ennemi";
  document.getElementById("profile-name").value = "";
  populateRaces(null);
  populateEthnies(null);
  populateLignees(null);
  ATTRS.forEach(a => {
    const radio = document.querySelector(`input[name="tier-${a}"][value=""]`);
    if (radio) radio.checked = true;
  });
  render();
}

// ── Import / Export ───────────────────────────────────────────────────────────

function exportJSON()      { return JSON.stringify(loadProfiles(), null, 2); }
function downloadJSON()    { triggerDownload(exportJSON(), "tn_profils_pnj.json"); }
function exportDataBundle() {
  return { version: 2, ...loadTnData(), particularites: loadParts(), declencheurs: loadTriggers(), effets: loadEffects(), regles: loadRules(), actions: loadActions() };
}
function downloadDataJSON(){ triggerDownload(JSON.stringify(exportDataBundle(), null, 2), "tn_donnees_pnj.json"); }

function importJSON(json) {
  try {
    const imported = JSON.parse(json);
    if (!Array.isArray(imported)) return { ok: false, error: "Tableau JSON attendu." };
    const existing = loadProfiles();
    const ids = new Set(existing.map(p => p.id));
    let added = 0;
    imported.forEach(p => {
      if (!p.id) p.id = crypto.randomUUID();
      if (!ids.has(p.id)) { existing.push(p); ids.add(p.id); added++; }
    });
    persistProfiles(existing);
    renderBiblio();
    return { ok: true, added, total: imported.length };
  } catch (e) { return { ok: false, error: e.message }; }
}

function importDataJSON(json) {
  try {
    const imported = JSON.parse(json);
    if (typeof imported !== "object" || Array.isArray(imported)) return { ok: false, error: "Format invalide." };
    const current = loadTnData();
    let added = 0;
    ["regnes","races","ethnies","lignees"].forEach(col => {
      if (!Array.isArray(imported[col])) return;
      const ids = new Set(current[col].map(x => x.id));
      imported[col].forEach(entry => {
        if (!entry.id) entry.id = crypto.randomUUID();
        if (!ids.has(entry.id)) { current[col].push(entry); ids.add(entry.id); added++; }
      });
    });
    const libraries = [
      ["particularites", loadParts, persistParts], ["declencheurs", loadTriggers, persistTriggers],
      ["effets", loadEffects, persistEffects], ["regles", loadRules, persistRules], ["actions", loadActions, persistActions]
    ];
    libraries.forEach(([col, load, persist]) => {
      if (!Array.isArray(imported[col])) return;
      const items = load(); const ids = new Set(items.map(x => x.id));
      imported[col].forEach(entry => { if (!entry.id) entry.id = crypto.randomUUID(); if (!ids.has(entry.id)) { items.push(entry); ids.add(entry.id); added++; } });
      persist(items);
    });
    persistTnData(current);
    return { ok: true, added };
  } catch (e) { return { ok: false, error: e.message }; }
}

function triggerDownload(json, filename) {
  const blob = new Blob([json], { type: "application/json" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

// ── Onglets ───────────────────────────────────────────────────────────────────

let donneesType = "regne";

function switchTab(name) {
  document.querySelectorAll(".tab-btn").forEach(b => b.classList.toggle("active", b.dataset.tab === name));
  document.querySelectorAll(".tab-panel").forEach(p => p.classList.toggle("tab-hidden", p.id !== `tab-${name}`));
  if (name === "biblio")  renderBiblio();
  if (name === "io")      renderIO();
  if (name === "donnees") renderDonneesTab();
}

// ── Modal ─────────────────────────────────────────────────────────────────────

let mState         = null;
let mCompSearch    = "";
let mPartSearch    = "";
let mPartTypeFilter = "tous";
let mActionSearch  = "";

function openModal(type, existingId) {
  let entry = null;
  if (existingId) {
    if (type === "particularite") entry = getPartById(existingId);
    else if (type === "declencheur") entry = getTriggerById(existingId);
    else if (type === "effet") entry = getEffectById(existingId);
    else if (type === "regle") entry = getRuleById(existingId);
    else if (type === "action")   entry = getActionById(existingId);
    else                          entry = getEntryById(type, existingId);
  }

  // Init mState selon le type
  if (type === "particularite") {
    mState = {
      type,
      id: existingId || null,
      nom: entry?.nom || "",
      type_part: entry?.type_part || "passif",
      mode: entry?.mode || "texte",
      declencheur_id: entry?.declencheur_id || "",
      effets: JSON.parse(JSON.stringify(entry?.effets || [])),
      sous_effets: JSON.parse(JSON.stringify(entry?.sous_effets || [{ nom: "", description: "" }]))
    };
  } else if (type === "declencheur" || type === "regle") {
    mState = { type, id: existingId || null, nom: entry?.nom || "", description: entry?.description || "" };
  } else if (type === "effet") {
    mState = { type, id: existingId || null, nom: entry?.nom || "", description: entry?.description || "", parametres: JSON.parse(JSON.stringify(entry?.parametres || [])) };
  } else if (type === "action") {
    mState = {
      type,
      id: existingId || null,
      nom: entry?.nom || "",
      description: entry?.description || ""
    };
  } else {
    // Types taxonomy
    mState = {
      type,
      id: existingId || null,
      nom: entry?.nom || "",
      parent: entry ? (entry.race !== undefined ? entry.race : (entry.regne ?? null)) : null,
      boosts:     [...(entry?.boosts    || [])],
      deboosts:   [...(entry?.deboosts  || [])],
      arme_nat:   entry?.arme_nat   ?? 0,
      armure_nat: entry?.armure_nat ?? 0,
      attrs_sec:  { STA: 0, TAI: 0, EGO: 0, APP: 0, CHN: 0, EQU: 0, ...(entry?.attrs_sec || {}) },
      competences:   [...(entry?.competences   || [])],
      particularites:[...(entry?.particularites || [])],
      actions:       [...(entry?.actions        || [])],
      regles:        [...(entry?.regles         || [])],
      sauvegardes:   { ...(entry?.sauvegardes   || {}) }
    };
  }
  mCompSearch = ""; mPartSearch = ""; mPartTypeFilter = "tous"; mActionSearch = "";
  document.getElementById("modal-title").textContent =
    (existingId ? "Modifier" : "Nouveau") + " — " + TYPE_LABEL[type];
  renderModalBody();
  document.getElementById("modal-overlay").classList.remove("modal-hidden");
}

function closeModal() {
  mState = null;
  document.getElementById("modal-overlay").classList.add("modal-hidden");
}

// ── Corps de la modale ────────────────────────────────────────────────────────

function renderModalBody() {
  const el   = document.getElementById("modal-body");
  const type = mState.type;

  if (type === "particularite") { el.innerHTML = buildModalPart(); attachModalPartEvents(); return; }
  if (type === "declencheur" || type === "effet" || type === "regle") { el.innerHTML = buildModalBrick(); attachModalBrickEvents(); return; }
  if (type === "action")        { el.innerHTML = buildModalAction(); attachModalActionEvents(); return; }

  // Types taxonomy
  let html = `<div class="mfield">
    <label>Nom</label>
    <input type="text" id="m-nom" class="m-input" value="${esc(mState.nom)}" placeholder="Nom…" maxlength="80">
  </div>`;

  if (type === "race") {
    const regnes = getCollection("regne");
    html += `<div class="mfield"><label>Règne</label><select id="m-parent" class="m-select">
      <option value="">— Choisir —</option>
      ${regnes.map(r => `<option value="${r.id}"${mState.parent === r.id ? " selected" : ""}>${esc(r.nom)}</option>`).join("")}
    </select></div>`;
  } else if (type === "ethnie") {
    const races = getCollection("race");
    html += `<div class="mfield"><label>Race <small>(vide = transverse ✦)</small></label><select id="m-parent" class="m-select">
      <option value="">— Transverse ✦ —</option>
      ${races.map(r => `<option value="${r.id}"${mState.parent === r.id ? " selected" : ""}>${esc(r.nom)}</option>`).join("")}
    </select></div>`;
  } else if (type === "lignee") {
    const regnes = getCollection("regne");
    html += `<div class="mfield"><label>Règne <small>(vide = transverse ✦)</small></label><select id="m-parent" class="m-select">
      <option value="">— Transverse ✦ —</option>
      ${regnes.map(r => `<option value="${r.id}"${mState.parent === r.id ? " selected" : ""}>${esc(r.nom)}</option>`).join("")}
    </select></div>`;
  }

  // Boosts / Deboosts
  html += `<div class="mfield">
    <label>${type === "lignee" ? "Boosts (2 requis, pas de deboosts)" : "Boosts &amp; Deboosts"}</label>
    <div class="m-bd-grid" id="m-bd-grid">
      ${ATTRS.map(a => {
        const isB = mState.boosts.includes(a);
        const isD = !isB && mState.deboosts.includes(a);
        return `<span class="m-bd-chip ${isB ? "bd-plus" : isD ? "bd-minus" : "bd-empty"}" data-attr="${a}">${a}</span>`;
      }).join("")}
    </div>
    <div class="m-bd-counts" id="m-bd-counts"></div>
  </div>`;

  if (type === "regne") {
    const rules = loadRules();
    html += `<div class="mfield m-section"><label>Règles structurelles <small>(informatives pour le moment)</small></label><div class="m-rule-list">
      ${rules.length ? rules.map(rule => `<label class="m-rule-choice"><input type="checkbox" class="m-rule-check" value="${rule.id}"${mState.regles.includes(rule.id) ? " checked" : ""}> <strong>${esc(rule.nom)}</strong><span>${esc(rule.description || "")}</span></label>`).join("") : '<span class="muted">Bibliothèque vide.</span>'}
    </div></div>`;
  }

  // Race : arme/armure nat + attrs sec
  if (type === "race") {
    html += `
    <div class="mfield"><label>Arme naturelle (0–6)</label>
      <div class="m-nat-row">
        <button class="m-nat-btn" data-field="arme_nat" data-delta="-1">−</button>
        <span id="m-arme-nat-val" class="nat-val">${mState.arme_nat}</span>
        <button class="m-nat-btn" data-field="arme_nat" data-delta="1">+</button>
      </div></div>
    <div class="mfield"><label>Armure naturelle (0–6)</label>
      <div class="m-nat-row">
        <button class="m-nat-btn" data-field="armure_nat" data-delta="-1">−</button>
        <span id="m-armure-nat-val" class="nat-val">${mState.armure_nat}</span>
        <button class="m-nat-btn" data-field="armure_nat" data-delta="1">+</button>
      </div></div>
    <div class="mfield"><label>Modificateurs secondaires <small>(somme = 0 hors EQU)</small></label>
      <div class="m-attrs-sec">
        ${[...ATTRS_SEC, "EQU"].map(a => `
          <div class="m-sec-row">
            <span class="m-sec-label">${a}</span>
            <button class="m-sec-btn" data-attr="${a}" data-delta="-1">−</button>
            <span id="m-sec-${a}" class="sec-adj-val">${mState.attrs_sec[a] >= 0 ? "+" : ""}${mState.attrs_sec[a]}</span>
            <button class="m-sec-btn" data-attr="${a}" data-delta="1">+</button>
          </div>`).join("")}
        <div class="m-sec-total-line">Somme (hors EQU) : <span id="m-sec-total"></span></div>
      </div></div>`;
  }

  // Lignée : sauvegardes
  if (type === "lignee") {
    html += `<div class="mfield m-section">
      <label>Sauvegardes</label>
      <div class="m-saves-grid">
        ${SAUVEGARDES.map(s => {
          const val = mState.sauvegardes[s] || "bas";
          return `<button class="m-save-btn m-save-${val}" data-save="${s}">${s}<span class="m-save-level">${val}</span></button>`;
        }).join("")}
      </div>
    </div>`;
  }

  // Compétences
  html += `<div class="mfield m-section">
    <label>Compétences &amp; Groupes</label>
    <div id="m-comp-tags" class="m-tags-row"></div>
    <input type="text" class="m-input" id="m-comp-search" placeholder="Rechercher une compétence…">
    <div class="m-comp-list" id="m-comp-list"></div>
  </div>`;

  // Particularités (bibliothèque)
  html += buildLibraryPicker("particularites", "Particularités", "m-part", "particularite");

  // Actions (bibliothèque)
  html += buildLibraryPicker("actions", "Actions", "m-action", "action");

  el.innerHTML = html;
  attachModalEvents();
  updateBdCounts();
  if (type === "race") updateSecTotal();
  renderModalCompList();
  renderModalLibList("part",   mState.particularites, loadParts,   mPartSearch);
  renderModalLibList("action", mState.actions,        loadActions, mActionSearch);
  renderModalCompTags();
  renderModalLibTags("part",   mState.particularites, getPartById);
  renderModalLibTags("action", mState.actions,        getActionById);
}

function buildLibraryPicker(field, label, prefix, libType) {
  return `<div class="mfield m-section">
    <label>${label} <button class="m-add-part-btn" id="${prefix}-new-btn">+ Créer</button></label>
    <div id="${prefix}-new-form" class="m-new-action-form" style="display:none">
      <input type="text" class="m-input" id="${prefix}-new-nom" placeholder="Nom…">
      ${libType === "particularite"
        ? `<div class="m-type-row">
            <label class="m-radio-label"><input type="radio" name="${prefix}-new-type" value="passif" checked> Passif</label>
            <label class="m-radio-label"><input type="radio" name="${prefix}-new-type" value="actif"> Actif</label>
          </div>
          <div id="${prefix}-new-se-list"></div><button class="m-add-se-btn" id="${prefix}-new-se-add">+ Effet</button>`
        : `<input type="text" class="m-input" id="${prefix}-new-desc" placeholder="Description…">`}
      <div class="m-action-form-btns">
        <button class="tool-btn save-btn" id="${prefix}-new-ok">Ajouter</button>
        <button class="tool-btn" id="${prefix}-new-cancel">Annuler</button>
      </div>
    </div>
    <div id="${prefix}-tags" class="m-tags-row"></div>
    ${libType === "particularite" ? `<div class="m-part-type-filter" id="${prefix}-type-filter">
      <button class="m-type-btn active" data-type="tous">Tous</button>
      <button class="m-type-btn" data-type="passif">Passif</button>
      <button class="m-type-btn" data-type="actif">Actif</button>
    </div>` : ""}
    <input type="text" class="m-input" id="${prefix}-search" placeholder="Rechercher…">
    <div class="m-action-list" id="${prefix}-list"></div>
  </div>`;
}

// ── Modal type particularite (édition bibliothèque) ───────────────────────────

function buildModalPart() {
  return `<div class="mfield">
    <label>Nom</label>
    <input type="text" id="m-nom" class="m-input" value="${esc(mState.nom)}" placeholder="Nom de la particularité…">
  </div>
  <div class="mfield">
    <label>Type</label>
    <div class="m-type-row">
      <label class="m-radio-label"><input type="radio" name="m-part-type" value="passif"${mState.type_part !== "actif" ? " checked" : ""}> Passif</label>
      <label class="m-radio-label"><input type="radio" name="m-part-type" value="actif"${mState.type_part === "actif" ? " checked" : ""}> Actif</label>
    </div>
  </div>
  <div class="mfield">
    <label>Construction</label>
    <select id="m-part-mode" class="m-select">
      <option value="texte"${mState.mode !== "composee" ? " selected" : ""}>Textuelle — texte paramétré par x</option>
      <option value="composee"${mState.mode === "composee" ? " selected" : ""}>Composée — déclencheur + effets référencés</option>
    </select>
  </div>
  ${mState.mode === "composee" ? buildComposedPartFields() : `
  <div class="mfield m-section">
    <label>Effets <button class="m-add-part-btn" id="m-add-se">+ Effet</button></label>
    <div id="m-se-list">
      ${(mState.sous_effets || []).map((se, i) => renderSeRow(se, i)).join("")}
    </div>
  </div>`}`;
}

function buildComposedPartFields() {
  const triggers = loadTriggers(); const effects = loadEffects();
  return `<div class="mfield m-section"><label>Déclencheur</label><select id="m-part-trigger" class="m-select">
    <option value="">— Aucun / permanent —</option>${triggers.map(t => `<option value="${t.id}"${mState.declencheur_id === t.id ? " selected" : ""}>${esc(t.nom)}</option>`).join("")}
  </select></div>
  <div class="mfield m-section"><label>Effets <button class="m-add-part-btn" id="m-add-composed-effect">+ Effet</button></label>
    <div id="m-composed-effects">${(mState.effets || []).map((item, i) => renderComposedEffect(item, i, effects)).join("")}</div>
  </div>`;
}

function renderComposedEffect(item, i, effects = loadEffects()) {
  const def = effects.find(x => x.id === item.effet_id);
  const params = def?.parametres || [];
  return `<div class="m-se-item" data-i="${i}"><div class="m-se-top"><select class="m-select m-effect-def" data-i="${i}">
    <option value="">— Choisir un effet —</option>${effects.map(e => `<option value="${e.id}"${item.effet_id === e.id ? " selected" : ""}>${esc(e.nom)}</option>`).join("")}
  </select><button class="m-icon-btn m-composed-del" data-i="${i}">✕</button></div>
  <div class="m-effect-params">${params.map(p => `<label class="m-param-row">${esc(p.label || p.id)}<input class="m-input m-effect-param" data-i="${i}" data-param="${p.id}" value="${esc(item.parametres?.[p.id] ?? p.defaut ?? "")}"></label>`).join("")}</div></div>`;
}

function renderSeRow(se, i) {
  return `<div class="m-se-item" data-i="${i}">
    <div class="m-se-top">
      <input type="text" class="m-input m-se-nom-i" data-i="${i}" value="${esc(se.nom)}" placeholder="Nom de l'effet…">
      <button class="m-icon-btn m-se-del-i" data-i="${i}">✕</button>
    </div>
    <input type="text" class="m-input m-se-desc-i" data-i="${i}" value="${esc(se.description || "")}" placeholder="Description — {x}, {x+1}, {x*2}… selon le niveau">
  </div>`;
}

function attachModalPartEvents() {
  const el = document.getElementById("modal-body");
  el.querySelector("#m-nom")?.addEventListener("input", e => { mState.nom = e.target.value; });
  el.querySelectorAll('input[name="m-part-type"]').forEach(r => {
    r.addEventListener("change", e => { if (e.target.checked) mState.type_part = e.target.value; });
  });
  el.querySelector("#m-part-mode")?.addEventListener("change", e => { mState.mode = e.target.value; renderModalBody(); });
  el.querySelector("#m-part-trigger")?.addEventListener("change", e => { mState.declencheur_id = e.target.value; });
  el.querySelector("#m-add-composed-effect")?.addEventListener("click", () => { mState.effets.push({ effet_id: "", parametres: {} }); renderModalBody(); });
  el.querySelectorAll(".m-effect-def").forEach(sel => sel.addEventListener("change", e => { const item = mState.effets[+e.target.dataset.i]; item.effet_id = e.target.value; const def = getEffectById(item.effet_id); item.parametres = Object.fromEntries((def?.parametres || []).map(p => [p.id, p.defaut || ""])); renderModalBody(); }));
  el.querySelectorAll(".m-effect-param").forEach(inp => inp.addEventListener("input", e => { const item = mState.effets[+e.target.dataset.i]; item.parametres[e.target.dataset.param] = e.target.value; }));
  el.querySelectorAll(".m-composed-del").forEach(btn => btn.addEventListener("click", () => { mState.effets.splice(+btn.dataset.i, 1); renderModalBody(); }));
  el.querySelector("#m-add-se")?.addEventListener("click", () => {
    mState.sous_effets.push({ nom: "", description: "" });
    refreshSeList();
  });
  attachSeListEvents();
}

function buildModalBrick() {
  const isEffect = mState.type === "effet";
  return `<div class="mfield"><label>Nom</label><input type="text" id="m-nom" class="m-input" value="${esc(mState.nom)}"></div>
  <div class="mfield"><label>${isEffect ? "Modèle de texte" : "Description"}</label><textarea id="m-brick-desc" class="m-input m-textarea" placeholder="${isEffect ? "Utiliser {x} et {parametre}" : "Quand cet événement se produit…"}">${esc(mState.description)}</textarea></div>
  ${isEffect ? `<div class="mfield"><label>Paramètres <small>(un par ligne : id|libellé|valeur par défaut)</small></label><textarea id="m-effect-params-def" class="m-input m-textarea">${esc((mState.parametres || []).map(p => `${p.id}|${p.label || p.id}|${p.defaut || ""}`).join("\n"))}</textarea></div>` : ""}`;
}

function attachModalBrickEvents() {
  const el = document.getElementById("modal-body");
  el.querySelector("#m-nom")?.addEventListener("input", e => { mState.nom = e.target.value; });
  el.querySelector("#m-brick-desc")?.addEventListener("input", e => { mState.description = e.target.value; });
  el.querySelector("#m-effect-params-def")?.addEventListener("input", e => { mState.parametres = e.target.value.split(/\r?\n/).filter(Boolean).map(line => { const [id,label,defaut] = line.split("|"); return { id: (id || "").trim(), label: (label || id || "").trim(), defaut: (defaut || "").trim() }; }).filter(p => p.id); });
}

function attachSeListEvents() {
  const el = document.getElementById("m-se-list");
  if (!el) return;
  el.querySelectorAll(".m-se-nom-i").forEach(inp => {
    inp.addEventListener("input", e => { mState.sous_effets[+e.target.dataset.i].nom = e.target.value; });
  });
  el.querySelectorAll(".m-se-desc-i").forEach(inp => {
    inp.addEventListener("input", e => { mState.sous_effets[+e.target.dataset.i].description = e.target.value; });
  });
  el.querySelectorAll(".m-se-del-i").forEach(btn => {
    btn.addEventListener("click", () => { mState.sous_effets.splice(+btn.dataset.i, 1); refreshSeList(); });
  });
}

function refreshSeList() {
  const el = document.getElementById("m-se-list");
  if (!el) return;
  el.innerHTML = (mState.sous_effets || []).map((se, i) => renderSeRow(se, i)).join("");
  attachSeListEvents();
}

// ── Modal type action (édition bibliothèque) ──────────────────────────────────

function buildModalAction() {
  return `<div class="mfield">
    <label>Nom</label>
    <input type="text" id="m-nom" class="m-input" value="${esc(mState.nom)}" placeholder="Nom de l'action…">
  </div>
  <div class="mfield">
    <label>Description</label>
    <textarea id="m-action-desc-ta" class="m-input m-textarea" placeholder="Description de l'action…">${esc(mState.description)}</textarea>
  </div>`;
}

function attachModalActionEvents() {
  const el = document.getElementById("modal-body");
  el.querySelector("#m-nom")?.addEventListener("input", e => { mState.nom = e.target.value; });
  el.querySelector("#m-action-desc-ta")?.addEventListener("input", e => { mState.description = e.target.value; });
}

// ── Modal taxonomy : compétences ──────────────────────────────────────────────

function getModalGroupes() {
  const groups = new Set();
  mState.competences.forEach(id => {
    const c = COMPETENCES.find(x => x.id === id);
    if (c) groups.add(c.categorie);
  });
  return [...groups];
}

function renderModalCompTags() {
  const el = document.getElementById("m-comp-tags");
  if (!el) return;
  const groups  = getModalGroupes();
  const gHtml   = groups.map(g => `<span class="comp-tag grp-tag">${esc(g)}</span>`).join("");
  const cHtml   = mState.competences.map(id => {
    const c = COMPETENCES.find(x => x.id === id);
    return `<span class="comp-tag"><button class="comp-remove" data-id="${id}">×</button>${c ? esc(c.nom) : id}</span>`;
  }).join("");
  el.innerHTML  = (gHtml + cHtml) || '<span class="muted">Aucune.</span>';
  el.querySelectorAll(".comp-remove").forEach(btn => {
    btn.addEventListener("click", () => {
      mState.competences = mState.competences.filter(x => x !== btn.dataset.id);
      renderModalCompTags(); renderModalCompList();
    });
  });
}

function renderModalCompList() {
  const el = document.getElementById("m-comp-list");
  if (!el) return;
  const q = mCompSearch.toLowerCase();
  const filtered = COMPETENCES.filter(c => !q || c.nom.toLowerCase().includes(q) || c.categorie.toLowerCase().includes(q));
  const groups = {};
  filtered.forEach(c => { (groups[c.categorie] = groups[c.categorie] || []).push(c); });
  el.innerHTML = Object.entries(groups).map(([cat, comps]) => `
    <div class="comp-group">
      <div class="comp-cat">${cat}</div>
      ${comps.map(c => `
        <div class="comp-item${mState.competences.includes(c.id) ? " comp-active" : ""}" data-id="${c.id}">
          <span class="comp-nom">${esc(c.nom)}</span>
        </div>`).join("")}
    </div>`).join("");
  el.querySelectorAll(".comp-item").forEach(item => {
    item.addEventListener("click", () => {
      const id = item.dataset.id;
      mState.competences = mState.competences.includes(id)
        ? mState.competences.filter(x => x !== id)
        : [...mState.competences, id];
      renderModalCompTags(); renderModalCompList();
    });
  });
}

// ── Modal taxonomy : sélecteur de bibliothèque générique ──────────────────────

function renderModalLibTags(prefix, selectedIds, getByIdFn) {
  const el = document.getElementById(`m-${prefix}-tags`);
  if (!el) return;
  el.innerHTML = selectedIds.map(id => {
    const item = getByIdFn(id);
    return item
      ? `<span class="comp-tag">${esc(item.nom)}<button class="comp-remove m-lib-remove" data-prefix="${prefix}" data-id="${id}">×</button></span>`
      : "";
  }).join("") || '<span class="muted">Aucune.</span>';
  el.querySelectorAll(".m-lib-remove").forEach(btn => {
    btn.addEventListener("click", () => {
      const p  = btn.dataset.prefix;
      const f  = p === "part" ? "particularites" : "actions";
      mState[f] = mState[f].filter(x => x !== btn.dataset.id);
      renderModalLibTags(p, mState[f], p === "part" ? getPartById : getActionById);
      renderModalLibList(p, mState[f], p === "part" ? loadParts : loadActions, p === "part" ? mPartSearch : mActionSearch);
    });
  });
}

function renderModalLibList(prefix, selectedIds, loadFn, query) {
  const el = document.getElementById(`m-${prefix}-list`);
  if (!el) return;
  const q = query.toLowerCase();
  let items = loadFn().filter(a => !q || a.nom.toLowerCase().includes(q));
  if (prefix === "part" && mPartTypeFilter !== "tous") {
    items = items.filter(a => (a.type_part || "passif") === mPartTypeFilter);
  }
  if (!items.length) { el.innerHTML = '<p class="muted">Bibliothèque vide.</p>'; return; }
  const field = prefix === "part" ? "particularites" : "actions";
  el.innerHTML = items.map(item => `
    <div class="comp-item${selectedIds.includes(item.id) ? " comp-active" : ""}" data-id="${item.id}">
      <span class="comp-nom">${esc(item.nom)}</span>
      ${prefix === "part" && item.type_part ? `<span class="comp-other type-label-${item.type_part}">${item.type_part}</span>` : ""}
      ${item.description ? `<span class="comp-other">${esc(item.description)}</span>` : ""}
      ${item.sous_effets?.length ? `<span class="comp-other">${item.sous_effets.length} effet(s)</span>` : ""}
    </div>`).join("");
  el.querySelectorAll(".comp-item").forEach(item => {
    item.addEventListener("click", () => {
      const id  = item.dataset.id;
      mState[field] = mState[field].includes(id)
        ? mState[field].filter(x => x !== id)
        : [...mState[field], id];
      const getByIdFn = prefix === "part" ? getPartById : getActionById;
      renderModalLibTags(prefix, mState[field], getByIdFn);
      renderModalLibList(prefix, mState[field], loadFn, query);
    });
  });
}

// ── Gestionnaires taxonomy modal ──────────────────────────────────────────────

function attachModalEvents() {
  const el = document.getElementById("modal-body");
  el.querySelector("#m-nom")?.addEventListener("input", e => { mState.nom = e.target.value; });
  el.querySelector("#m-parent")?.addEventListener("change", e => { mState.parent = e.target.value || null; });
  el.querySelectorAll(".m-rule-check").forEach(input => input.addEventListener("change", e => {
    mState.regles = e.target.checked ? [...new Set([...mState.regles, e.target.value])] : mState.regles.filter(id => id !== e.target.value);
  }));

  // Boost chips
  el.querySelectorAll(".m-bd-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      const a = chip.dataset.attr;
      if (mState.boosts.includes(a)) {
        mState.boosts = mState.boosts.filter(x => x !== a);
        if (mState.type !== "lignee") mState.deboosts = [...mState.deboosts, a];
      } else if (mState.deboosts.includes(a)) {
        mState.deboosts = mState.deboosts.filter(x => x !== a);
      } else {
        mState.boosts = [...mState.boosts, a];
      }
      el.querySelectorAll(".m-bd-chip").forEach(c => {
        const ca = c.dataset.attr;
        const isB = mState.boosts.includes(ca);
        const isD = !isB && mState.deboosts.includes(ca);
        c.className = `m-bd-chip ${isB ? "bd-plus" : isD ? "bd-minus" : "bd-empty"}`;
      });
      updateBdCounts();
    });
  });

  // Nat buttons
  el.querySelectorAll(".m-nat-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const f  = btn.dataset.field;
      mState[f] = Math.max(0, Math.min(6, mState[f] + parseInt(btn.dataset.delta)));
      document.getElementById(f === "arme_nat" ? "m-arme-nat-val" : "m-armure-nat-val").textContent = mState[f];
    });
  });

  // Attrs sec
  el.querySelectorAll(".m-sec-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const a = btn.dataset.attr;
      mState.attrs_sec[a] += parseInt(btn.dataset.delta);
      const sp = document.getElementById(`m-sec-${a}`);
      if (sp) sp.textContent = (mState.attrs_sec[a] >= 0 ? "+" : "") + mState.attrs_sec[a];
      updateSecTotal();
    });
  });

  // Sauvegardes (lignée)
  el.querySelectorAll(".m-save-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const s    = btn.dataset.save;
      const cur  = mState.sauvegardes[s] || "bas";
      const next = cur === "bas" ? "haut" : cur === "haut" ? "moyen" : "bas";
      mState.sauvegardes[s] = next;
      btn.className = `m-save-btn m-save-${next}`;
      btn.querySelector(".m-save-level").textContent = next;
    });
  });

  // Comp search
  el.querySelector("#m-comp-search")?.addEventListener("input", e => {
    mCompSearch = e.target.value.toLowerCase();
    renderModalCompList();
  });

  // Part library
  attachLibraryHandlers("part", "particularite", "particularites");

  // Action library
  attachLibraryHandlers("action", "action", "actions");
}

function attachLibraryHandlers(prefix, libType, field) {
  const el = document.getElementById("modal-body");
  if (!el) return;

  el.querySelector(`#m-${prefix}-search`)?.addEventListener("input", e => {
    if (prefix === "part") mPartSearch = e.target.value.toLowerCase();
    else mActionSearch = e.target.value.toLowerCase();
    const loadFn  = prefix === "part" ? loadParts : loadActions;
    const query   = prefix === "part" ? mPartSearch : mActionSearch;
    renderModalLibList(prefix, mState[field], loadFn, query);
  });

  if (libType === "particularite") {
    el.querySelectorAll(`#m-${prefix}-type-filter .m-type-btn`).forEach(btn => {
      btn.addEventListener("click", () => {
        mPartTypeFilter = btn.dataset.type;
        el.querySelectorAll(`#m-${prefix}-type-filter .m-type-btn`).forEach(b => b.classList.toggle("active", b === btn));
        renderModalLibList(prefix, mState[field], loadParts, mPartSearch);
      });
    });
  }

  el.querySelector(`#m-${prefix}-new-btn`)?.addEventListener("click", () => {
    const form = document.getElementById(`m-${prefix}-new-form`);
    if (form) form.style.display = form.style.display === "none" ? "flex" : "none";
    // Init inline part se list
    if (prefix === "part" && form?.style.display !== "none") {
      const seList = document.getElementById(`m-${prefix}-new-se-list`);
      if (seList) seList.innerHTML = renderInlineSeRow(0);
      attachInlineSeEvents(prefix);
    }
  });

  el.querySelector(`#m-${prefix}-new-cancel`)?.addEventListener("click", () => {
    const form = document.getElementById(`m-${prefix}-new-form`);
    if (form) form.style.display = "none";
  });

  el.querySelector(`#m-${prefix}-new-se-add`)?.addEventListener("click", () => {
    const seList = document.getElementById(`m-${prefix}-new-se-list`);
    if (!seList) return;
    const count = seList.querySelectorAll(".m-se-inline").length;
    seList.insertAdjacentHTML("beforeend", renderInlineSeRow(count));
    attachInlineSeEvents(prefix);
  });

  el.querySelector(`#m-${prefix}-new-ok`)?.addEventListener("click", () => {
    const nomEl = document.getElementById(`m-${prefix}-new-nom`);
    const nom   = nomEl?.value.trim();
    if (!nom) { alert("Le nom est requis."); return; }
    let newItem;
    if (libType === "particularite") {
      const seList  = document.getElementById(`m-${prefix}-new-se-list`);
      const rows    = seList ? seList.querySelectorAll(".m-se-inline") : [];
      const souEffets = [...rows].map(row => ({
        nom:         row.querySelector(".m-se-inline-nom")?.value || "",
        description: row.querySelector(".m-se-inline-desc")?.value || ""
      }));
      const typeEl  = document.querySelector(`input[name="${prefix}-new-type"]:checked`);
      newItem = savePart({ id: crypto.randomUUID(), nom, type_part: typeEl?.value || "passif", sous_effets: souEffets });
    } else {
      const desc = document.getElementById(`m-${prefix}-new-desc`)?.value.trim() || "";
      newItem = saveAction({ id: crypto.randomUUID(), nom, description: desc });
    }
    mState[field] = [...mState[field], newItem.id];
    if (nomEl) nomEl.value = "";
    const form = document.getElementById(`m-${prefix}-new-form`);
    if (form) form.style.display = "none";
    const getByIdFn = prefix === "part" ? getPartById : getActionById;
    const loadFn    = prefix === "part" ? loadParts : loadActions;
    const query     = prefix === "part" ? mPartSearch : mActionSearch;
    renderModalLibTags(prefix, mState[field], getByIdFn);
    renderModalLibList(prefix, mState[field], loadFn, query);
    // Also refresh données tab if visible
    renderDonneesTab();
  });
}

function renderInlineSeRow(i) {
  return `<div class="m-se-item m-se-inline" data-i="${i}">
    <div class="m-se-top">
      <input type="text" class="m-input m-se-inline-nom" placeholder="Nom de l'effet…">
      <button class="m-icon-btn m-se-inline-del" data-i="${i}">✕</button>
    </div>
    <input type="text" class="m-input m-se-inline-desc" placeholder="Description — {x}, {x+1}, {x*2}… selon le niveau">
  </div>`;
}

function attachInlineSeEvents(prefix) {
  const seList = document.getElementById(`m-${prefix}-new-se-list`);
  if (!seList) return;
  seList.querySelectorAll(".m-se-inline-del").forEach(btn => {
    btn.addEventListener("click", () => {
      btn.closest(".m-se-inline").remove();
    });
  });
}

function updateBdCounts() {
  const el = document.getElementById("m-bd-counts");
  if (!el) return;
  const b = mState.boosts.length, d = mState.deboosts.length;
  let valid = false, msg = "";
  switch (mState.type) {
    case "race":
    case "ethnie": valid = b >= 1 && b === d; msg = `${b}B ${d}D — paires égales ≥1`; break;
    case "lignee": valid = b === 2 && d === 0; msg = `${b}/2 boosts, pas de deboosts`; break;
    case "regne":  valid = (b === 0 && d === 0) || b === d; msg = b === 0 ? "vide (OK)" : `${b}B ${d}D`; break;
  }
  el.innerHTML = `<span class="${valid ? "ok" : "err"}">${valid ? "✓" : "✗"} ${msg}</span>`;
}

function updateSecTotal() {
  const total = ATTRS_SEC.reduce((s, a) => s + (mState.attrs_sec[a] || 0), 0); // sans EQU
  const el = document.getElementById("m-sec-total");
  if (el) { el.textContent = (total >= 0 ? "+" : "") + total; el.className = `sec-adj-val ${total === 0 ? "ok" : "err"}`; }
}

function saveModalEntry() {
  if (!mState) return;
  const nom = document.getElementById("m-nom")?.value.trim();
  if (!nom) { alert("Le nom est requis."); return; }
  mState.nom = nom;

  // Types bibliothèque
  if (mState.type === "particularite") {
    savePart({ id: mState.id || crypto.randomUUID(), nom, type_part: mState.type_part || "passif", mode: mState.mode || "texte", declencheur_id: mState.declencheur_id || "", effets: JSON.parse(JSON.stringify(mState.effets || [])), sous_effets: JSON.parse(JSON.stringify(mState.sous_effets || [])) });
    closeModal(); renderDonneesTab(); return;
  }
  if (mState.type === "declencheur") { saveTrigger({ id: mState.id || crypto.randomUUID(), nom, description: mState.description || "" }); closeModal(); renderDonneesTab(); return; }
  if (mState.type === "effet") { saveEffect({ id: mState.id || crypto.randomUUID(), nom, description: mState.description || "", parametres: JSON.parse(JSON.stringify(mState.parametres || [])) }); closeModal(); renderDonneesTab(); return; }
  if (mState.type === "regle") { saveRule({ id: mState.id || crypto.randomUUID(), nom, description: mState.description || "" }); closeModal(); renderDonneesTab(); return; }
  if (mState.type === "action") {
    saveAction({ id: mState.id || crypto.randomUUID(), nom, description: document.getElementById("m-action-desc-ta")?.value.trim() || "" });
    closeModal(); renderDonneesTab(); return;
  }

  // Types taxonomy
  const data  = loadTnData();
  const col   = mState.type + "s";
  const entry = buildTaxoEntry();
  const idx   = data[col].findIndex(x => x.id === entry.id);
  if (idx >= 0) data[col][idx] = entry; else data[col].push(entry);
  persistTnData(data);
  closeModal();
  renderDonneesTab();
  populateRegnes(); populateRaces(state.regne); populateEthnies(state.race); populateLignees(state.regne);
}

function buildTaxoEntry() {
  const base = {
    id:   mState.id || crypto.randomUUID(),
    nom:  mState.nom,
    boosts:        [...mState.boosts],
    deboosts:      mState.type === "lignee" ? [] : [...mState.deboosts],
    competences:   [...mState.competences],
    particularites:[...mState.particularites],
    actions:       [...mState.actions]
  };
  if (mState.type === "regne") base.regles = [...mState.regles];
  if (mState.type === "race") {
    base.regne      = mState.parent || null;
    base.arme_nat   = mState.arme_nat;
    base.armure_nat = mState.armure_nat;
    base.attrs_sec  = { ...mState.attrs_sec };
  } else if (mState.type === "ethnie") {
    base.race  = mState.parent || null;
  } else if (mState.type === "lignee") {
    base.regne       = mState.parent || null;
    base.sauvegardes = { ...mState.sauvegardes };
  }
  return base;
}

// ── Onglet Données ────────────────────────────────────────────────────────────

function renderDonneesTab() {
  // Types bibliothèque
  if (donneesType === "particularite") { renderLibTab(loadParts, "particularite"); return; }
  if (donneesType === "declencheur")   { renderLibTab(loadTriggers, "declencheur"); return; }
  if (donneesType === "effet")         { renderLibTab(loadEffects, "effet"); return; }
  if (donneesType === "regle")         { renderLibTab(loadRules, "regle"); return; }
  if (donneesType === "action")        { renderLibTab(loadActions, "action"); return; }

  const entries = getCollection(donneesType);
  const el      = document.getElementById("donnees-list");
  if (!el) return;

  if (!entries.length) { el.innerHTML = `<p class="muted">Aucune entrée. Cliquer sur + Nouveau.</p>`; return; }

  el.innerHTML = entries.map(entry => {
    let meta = "";
    if (donneesType === "race")   meta = entry.regne ? (getEntryById("regne", entry.regne)?.nom || "?") : "—";
    if (donneesType === "ethnie") meta = entry.race  ? (getEntryById("race",  entry.race)?.nom  || "?") : "✦ Transverse";
    if (donneesType === "lignee") meta = entry.regne ? (getEntryById("regne", entry.regne)?.nom || "?") : "✦ Transverse";
    const chips = [
      (entry.boosts  ||[]).length ? `<span class="d-chip ok">+${(entry.boosts||[]).length}B</span>` : "",
      (entry.deboosts||[]).length ? `<span class="d-chip err">−${(entry.deboosts||[]).length}D</span>` : "",
      (entry.competences||[]).length ? `<span class="d-chip">${(entry.competences||[]).length}C</span>` : "",
      (entry.actions||[]).length     ? `<span class="d-chip">${(entry.actions||[]).length}A</span>` : "",
      (entry.particularites||[]).length ? `<span class="d-chip">${(entry.particularites||[]).length}P</span>` : ""
    ].join("");
    const sauv = donneesType === "lignee" && entry.sauvegardes
      ? Object.entries(entry.sauvegardes).filter(([,v])=>v !== "bas").map(([k,v])=>`<span class="d-chip ${v==="haut"?"ok":"acc"}">${k[0].toUpperCase()}</span>`).join("")
      : "";
    return `<div class="d-entry">
      <div class="d-entry-main">
        <span class="d-nom">${esc(entry.nom)}</span>
        ${meta ? `<span class="d-meta">${esc(meta)}</span>` : ""}
        <span class="d-chips">${chips}${sauv}</span>
      </div>
      <div class="d-actions">
        <button class="pc-btn pc-btn-load d-btn-edit" data-id="${entry.id}">Modifier</button>
        <button class="pc-btn pc-btn-del  d-btn-del"  data-id="${entry.id}">Supprimer</button>
      </div>
    </div>`;
  }).join("");

  attachDonneesListEvents(donneesType);
}

function renderLibTab(loadFn, type) {
  const items = loadFn();
  const el    = document.getElementById("donnees-list");
  if (!el) return;
  if (!items.length) { el.innerHTML = `<p class="muted">Bibliothèque vide. Cliquer sur + Nouveau.</p>`; return; }
  el.innerHTML = items.map(item => `
    <div class="d-entry">
      <div class="d-entry-main">
        <span class="d-nom">${esc(item.nom)}</span>
        ${type === "particularite" && item.type_part ? `<span class="d-chip d-chip-${item.type_part}">${item.type_part}</span>` : ""}
        ${type === "particularite" && item.mode === "composee" ? `<span class="d-chip acc">composée</span>` : ""}
        ${item.description ? `<span class="d-meta">${esc(item.description)}</span>` : ""}
        ${type === "effet" && item.parametres?.length ? `<span class="d-chip">${item.parametres.length} param.</span>` : ""}
        ${item.sous_effets?.length ? `<span class="d-chip">${item.sous_effets.length} effet(s)</span>` : ""}
      </div>
      <div class="d-actions">
        <button class="pc-btn pc-btn-load d-btn-edit" data-id="${item.id}">Modifier</button>
        <button class="pc-btn pc-btn-del  d-btn-del"  data-id="${item.id}">Supprimer</button>
      </div>
    </div>`).join("");
  attachDonneesListEvents(type);
}

function attachDonneesListEvents(type) {
  const el = document.getElementById("donnees-list");
  el.querySelectorAll(".d-btn-edit").forEach(btn => {
    btn.addEventListener("click", () => openModal(type, btn.dataset.id));
  });
  el.querySelectorAll(".d-btn-del").forEach(btn => {
    btn.addEventListener("click", () => {
      let nom = btn.dataset.id;
      if (type === "particularite") { nom = getPartById(btn.dataset.id)?.nom || nom; }
      else if (type === "declencheur") { nom = getTriggerById(btn.dataset.id)?.nom || nom; }
      else if (type === "effet") { nom = getEffectById(btn.dataset.id)?.nom || nom; }
      else if (type === "regle") { nom = getRuleById(btn.dataset.id)?.nom || nom; }
      else if (type === "action")   { nom = getActionById(btn.dataset.id)?.nom || nom; }
      else { nom = getEntryById(type, btn.dataset.id)?.nom || nom; }
      if (!confirm(`Supprimer "${nom}" ?`)) return;
      if (type === "particularite") { persistParts(loadParts().filter(x => x.id !== btn.dataset.id)); }
      else if (type === "declencheur") { persistTriggers(loadTriggers().filter(x => x.id !== btn.dataset.id)); }
      else if (type === "effet") { persistEffects(loadEffects().filter(x => x.id !== btn.dataset.id)); }
      else if (type === "regle") { persistRules(loadRules().filter(x => x.id !== btn.dataset.id)); }
      else if (type === "action")   { persistActions(loadActions().filter(x => x.id !== btn.dataset.id)); }
      else {
        const data = loadTnData(); const col = type + "s";
        data[col] = data[col].filter(x => x.id !== btn.dataset.id);
        persistTnData(data);
        populateRegnes(); populateRaces(state.regne); populateEthnies(state.race); populateLignees(state.regne);
      }
      renderDonneesTab();
    });
  });
}

// ── Populate dropdowns ────────────────────────────────────────────────────────

function populateRegnes() {
  const regnes = getCollection("regne");
  const sel = document.getElementById("sel-regne");
  sel.innerHTML = '<option value="">— Choisir —</option>' +
    regnes.map(r => `<option value="${r.id}">${esc(r.nom)}</option>`).join("");
  if (state.regne) sel.value = state.regne;
}

function populateRaces(regneId) {
  const races = regneId ? getCollection("race").filter(r => r.regne === regneId) : [];
  const sel = document.getElementById("sel-race");
  sel.innerHTML = '<option value="">— Choisir —</option>' +
    races.map(r => `<option value="${r.id}">${esc(r.nom)}</option>`).join("");
  if (state.race) sel.value = state.race;
}

function populateEthnies(raceId) {
  const ethnies = getCollection("ethnie").filter(e => e.race === null || e.race === raceId);
  const sel = document.getElementById("sel-ethnie");
  sel.innerHTML = '<option value="">— Aucune —</option>' +
    ethnies.map(e => `<option value="${e.id}">${esc(e.nom)}${e.race === null ? " ✦" : ""}</option>`).join("");
  if (state.ethnie) sel.value = state.ethnie;
}

function populateLignees(regneId) {
  const lignees = getCollection("lignee").filter(l => l.regne === null || l.regne === regneId);
  const sel = document.getElementById("sel-lignee");
  sel.innerHTML = '<option value="">— Aucune —</option>' +
    lignees.map(l => `<option value="${l.id}">${esc(l.nom)}${l.regne === null ? " ✦" : ""}</option>`).join("");
  if (state.lignee) sel.value = state.lignee;
}

function populateRangs() {
  const sel = document.getElementById("sel-rang");
  sel.innerHTML = DATA.rangs.map(r =>
    `<option value="${r.rang}"${r.rang === state.rang ? " selected" : ""}>${r.rang >= 0 ? "+" : ""}${r.rang} — ${r.titre}</option>`
  ).join("");
}

function populateRoles() {
  const sel = document.getElementById("sel-role");
  sel.innerHTML = DATA.roles.map(r =>
    `<option value="${r.id}"${r.id === state.role ? " selected" : ""}>${r.nom}</option>`
  ).join("");
}

// ── Sélecteurs cascade (préserve transverses) ─────────────────────────────────

function attachSelectors() {
  document.getElementById("sel-regne").addEventListener("change", e => {
    state.regne = e.target.value || null;
    state.race  = null;
    const curEthnie = getEntryById("ethnie", state.ethnie);
    if (curEthnie && curEthnie.race !== null) state.ethnie = null;
    const curLignee = getEntryById("lignee", state.lignee);
    if (curLignee && curLignee.regne !== null) state.lignee = null;
    populateRaces(state.regne);
    populateEthnies(null);
    populateLignees(state.regne);
    applyPreset("regne", getEntryById("regne", state.regne));
    applyPreset("race", null); applyPreset("ethnie", null); applyPreset("lignee", null);
    render();
  });

  document.getElementById("sel-race").addEventListener("change", e => {
    state.race = e.target.value || null;
    const curEthnie = getEntryById("ethnie", state.ethnie);
    if (curEthnie && curEthnie.race !== null) state.ethnie = null;
    populateEthnies(state.race);
    applyPreset("race", getEntryById("race", state.race));
    applyPreset("ethnie", null);
    applyNatPreset();
    render();
  });

  document.getElementById("sel-ethnie").addEventListener("change", e => {
    state.ethnie = e.target.value || null;
    applyPreset("ethnie", getEntryById("ethnie", state.ethnie));
    render();
  });

  document.getElementById("sel-lignee").addEventListener("change", e => {
    state.lignee = e.target.value || null;
    applyPreset("lignee", getEntryById("lignee", state.lignee));
    render();
  });

  document.getElementById("sel-rang").addEventListener("change", e => { state.rang = parseInt(e.target.value); render(); });
  document.getElementById("sel-role").addEventListener("change", e => { state.role = e.target.value; render(); });
}

function applyPreset(src, data) {
  state.bd[src] = {};
  if (!data) return;
  (data.boosts   || []).forEach(a => { state.bd[src][a] = "+"; });
  (data.deboosts || []).forEach(a => { state.bd[src][a] = "-"; });
}

function applyNatPreset() {
  const race = getEntryById("race", state.race);
  if (!race) return;
  if (race.arme_nat   !== undefined) state.arme_nat   = race.arme_nat;
  if (race.armure_nat !== undefined) state.armure_nat = race.armure_nat;
  if (race.attrs_sec) {
    [...ATTRS_SEC, "EQU"].forEach(a => { state.attrs_sec[a] = race.attrs_sec[a] ?? 0; });
  }
}

// ── Helpers héritage ──────────────────────────────────────────────────────────

function getInherited(field) {
  const result = [], seen = new Set();
  SOURCES.forEach(src => {
    const entry = getEntryById(src, state[src]);
    if (!entry) return;
    (entry[field] || []).forEach(id => { if (!seen.has(id)) { seen.add(id); result.push(id); } });
  });
  return result;
}

// ── EQU calculé ──────────────────────────────────────────────────────────────

function computeEQU() {
  const rd = DATA.rangs.find(r => r.rang === state.rang);
  if (!rd) return null;
  const bases = ATTRS.map(a => rd[state.tiers[a] || "TB"]);
  return Math.floor((Math.max(...bases) + Math.min(...bases)) / 2) + rd.ajust;
}

// ── Boost/deboost ─────────────────────────────────────────────────────────────

function attrMod(attr) {
  let boosts = 0, deboosts = 0;
  SOURCES.forEach(src => {
    const v = state.bd[src][attr];
    if (v === "+") boosts++; else if (v === "-") deboosts++;
  });
  const net = boosts - deboosts;
  if (net === 0) return 0;
  return net > 0 ? net + 1 : net - 1;
}

function bdCounts(src) {
  let b = 0, d = 0;
  ATTRS.forEach(a => { if (state.bd[src][a] === "+") b++; else if (state.bd[src][a] === "-") d++; });
  return { b, d };
}

function bdValid(src) {
  const { b, d } = bdCounts(src);
  const sel = { race: state.race, ethnie: state.ethnie, lignee: state.lignee, regne: state.regne }[src];
  if (!sel && b === 0 && d === 0) return true;
  switch (src) {
    case "race":   return b >= 1 && b === d;
    case "ethnie": return b >= 1 && b === d;
    case "lignee": return b === 2 && d === 0;
    case "regne":  return (b === 0 && d === 0) || b === d;
  }
  return true;
}

function tierCounts() {
  const c = { TH: 0, H: 0, M: 0, B: 0 };
  Object.values(state.tiers).forEach(t => { if (t && c[t] !== undefined) c[t]++; });
  return c;
}

function partLevel(type, rang) {
  const base = PART_BASE[type] ?? 0;
  if (rang < base - 3)  return null;
  if (rang < base)      return -1;
  if (rang < base + 5)  return 0;
  if (rang < base + 10) return 1;
  if (rang < base + 15) return 2;
  return 3;
}

// ── Render principal ──────────────────────────────────────────────────────────

function render() {
  renderRangInfo();
  renderRoleInfo();
  renderBoostTable();
  renderAttrTable();
  renderAttrSec();
  renderNat();
  renderInheritedRight();
  renderParticularites();
  renderStructuralRules();
}

function renderStructuralRules() {
  const el = document.getElementById("result-rules"); if (!el) return;
  const regne = getEntryById("regne", state.regne);
  const rules = (regne?.regles || []).map(getRuleById).filter(Boolean);
  el.innerHTML = rules.length ? rules.map(rule => `<div class="recap-action"><span class="recap-action-nom">${esc(rule.nom)}</span>${rule.description ? `<span class="recap-action-desc">${esc(rule.description)}</span>` : ""}</div>`).join("") : '<p class="muted">—</p>';
}

function renderRangInfo() {
  const rd = DATA.rangs.find(r => r.rang === state.rang);
  if (!rd) return;
  const s = n => n >= 0 ? `+${n}` : `${n}`;
  document.getElementById("rang-info").innerHTML = `
    <span class="chip">TH ${rd.TH}</span><span class="chip">H ${rd.H}</span>
    <span class="chip">M ${rd.M}</span><span class="chip">B ${rd.B}</span>
    <span class="chip">TB ${rd.TB}</span>
    <span class="chip sep">Ajust ${s(rd.ajust)}</span><span class="chip">Modif ${s(rd.modif)}</span>
    <span class="chip">Comp ${rd.comp}</span><span class="chip">Grp ${rd.grp}</span>
    <span class="chip accent">Total ${s(rd.total)}</span>`;
}

function renderRoleInfo() {
  const role = DATA.roles.find(r => r.id === state.role);
  if (!role) return;
  const s = n => n >= 0 ? `+${n}` : `${n}`;
  const inRange = state.rang >= role.rang_min && state.rang <= role.rang_max;
  document.getElementById("role-info").innerHTML = `
    <span class="chip ${inRange ? "" : "warn"}">Rang ${role.rang_min}→${role.rang_max}${inRange ? "" : " ⚠"}</span>
    <span class="chip">Moral ${role.moral}</span><span class="chip">PK ${role.pk}</span>
    <span class="chip">Ress. ${role.ressources}</span>
    <span class="chip accent">B/M ${s(role.bonus_malus)}</span>`;
}

function renderBoostTable() {
  SOURCES.forEach(src => {
    ATTRS.forEach(a => {
      const cell = document.getElementById(`bd-${src}-${a}`);
      if (!cell) return;
      const v = state.bd[src][a];
      cell.textContent = v === "+" ? "+" : v === "-" ? "−" : "·";
      cell.className   = `bd-cell ${v === "+" ? "bd-plus" : v === "-" ? "bd-minus" : "bd-empty"}`;
    });
    const valid = bdValid(src);
    const el = document.getElementById(`bd-valid-${src}`);
    if (el) { el.textContent = valid ? "✓" : "✗"; el.className = `bd-valid-cell ${valid ? "ok" : "err"}`; }
  });
}

function renderAttrTable() {
  const rd     = DATA.rangs.find(r => r.rang === state.rang);
  const counts = tierCounts();
  const tbAttrs = ATTRS.filter(a => !state.tiers[a]);

  const valid = counts.TH <= 2 && counts.H <= 2 && counts.M <= 2 && counts.B <= 2;
  const vEl = document.getElementById("tier-valid");
  if (vEl) { vEl.textContent = valid ? " ✓" : " ✗"; vEl.className = valid ? "tier-valid ok" : "tier-valid err"; }

  ATTRS.forEach(a => {
    const tier  = state.tiers[a] || null;
    const base  = rd ? rd[tier || "TB"] : null;
    const mod   = attrMod(a);
    const final = base !== null ? base + mod : null;

    document.getElementById(`base-${a}`).textContent = base !== null ? base : "—";

    const modEl = document.getElementById(`mod-${a}`);
    modEl.textContent = mod !== 0 ? (mod > 0 ? `+${mod}` : `${mod}`) : "—";
    modEl.className   = `num ${mod > 0 ? "pos" : mod < 0 ? "neg" : ""}`;

    const finalEl = document.getElementById(`final-${a}`);
    finalEl.textContent = final !== null ? final : "—";
    finalEl.className   = `num final${!tier ? " tb" : ""}`;

    document.querySelectorAll(`input[name="tier-${a}"]`).forEach(radio => {
      const val = radio.value;
      if (!val) { radio.disabled = false; return; }
      radio.disabled = val !== tier && counts[val] >= 2;
    });
  });

  const tbEl = document.getElementById("tb-summary");
  if (tbEl) tbEl.textContent = tbAttrs.length ? tbAttrs.join(", ") : "—";
  const eqEl = document.getElementById("equilibre-val");
  if (eqEl && rd) {
    const equ = computeEQU();
    eqEl.textContent = equ !== null ? `${equ} + ${state.attrs_sec.EQU >= 0 ? "+" : ""}${state.attrs_sec.EQU} = ${equ + state.attrs_sec.EQU}` : "—";
  }
}

function renderAttrSec() {
  const total = ATTRS_SEC.reduce((s, a) => s + (state.attrs_sec[a] || 0), 0); // sans EQU
  const totalEl = document.getElementById("sec-total");
  if (totalEl) { totalEl.textContent = (total > 0 ? "+" : "") + total; totalEl.className = `sec-total-val ${total === 0 ? "ok" : "err"}`; }
  const validEl = document.getElementById("sec-valid");
  if (validEl) { validEl.textContent = total === 0 ? "✓" : "✗"; validEl.className = `tier-valid ${total === 0 ? "ok" : "err"}`; }

  ATTRS_SEC.forEach(a => {
    const adj = state.attrs_sec[a];
    const adjEl   = document.getElementById(`sec-adj-${a}`);
    if (adjEl) { adjEl.textContent = (adj >= 0 ? "+" : "") + adj; adjEl.className = `sec-adj-val ${adj > 0 ? "pos" : adj < 0 ? "neg" : ""}`; }
    const finalEl = document.getElementById(`sec-final-${a}`);
    if (finalEl) { finalEl.textContent = 10 + adj; finalEl.className = `num final${adj !== 0 ? (adj > 0 ? " pos" : " neg") : ""}`; }
  });

  // EQU
  const equCalc = computeEQU();
  const equAdj  = state.attrs_sec.EQU || 0;
  const equFinal = equCalc !== null ? equCalc + equAdj : null;
  const equAdjEl = document.getElementById("sec-adj-EQU");
  if (equAdjEl) { equAdjEl.textContent = (equAdj >= 0 ? "+" : "") + equAdj; equAdjEl.className = `sec-adj-val ${equAdj > 0 ? "pos" : equAdj < 0 ? "neg" : ""}`; }
  const equBaseEl = document.getElementById("sec-base-EQU");
  if (equBaseEl) equBaseEl.textContent = equCalc !== null ? equCalc : "—";
  const equFinalEl = document.getElementById("sec-final-EQU");
  if (equFinalEl) { equFinalEl.textContent = equFinal !== null ? equFinal : "—"; equFinalEl.className = "num final"; }
}

function renderNat() {
  const fill = n => "■".repeat(n) + "□".repeat(6 - n);
  document.getElementById("arme-nat-val").textContent   = state.arme_nat;
  document.getElementById("armure-nat-val").textContent = state.armure_nat;
  const ab = document.getElementById("arme-nat-bar");
  const rb = document.getElementById("armure-nat-bar");
  if (ab) ab.textContent = fill(state.arme_nat);
  if (rb) rb.textContent = fill(state.armure_nat);
}

function renderInheritedRight() {
  const compIds = getInherited("competences");
  const groups  = [...new Set(compIds.map(id => COMPETENCES.find(x => x.id === id)?.categorie).filter(Boolean))];

  const grpEl = document.getElementById("result-groupes");
  if (grpEl) grpEl.innerHTML = groups.length
    ? groups.map(g => `<span class="recap-chip grp-chip">${esc(g)}</span>`).join("")
    : '<p class="muted">—</p>';

  const compEl = document.getElementById("result-competences");
  if (compEl) compEl.innerHTML = compIds.length
    ? compIds.map(id => { const c = COMPETENCES.find(x => x.id === id); return c ? `<span class="recap-chip">${esc(c.nom)}</span>` : ""; }).join("")
    : '<p class="muted">—</p>';

  const actionIds = getInherited("actions");
  const actEl = document.getElementById("result-actions");
  if (actEl) actEl.innerHTML = actionIds.length
    ? actionIds.map(id => {
        const a = getActionById(id);
        return a ? `<div class="recap-action"><span class="recap-action-nom">${esc(a.nom)}</span>${a.description ? `<span class="recap-action-desc">${esc(a.description)}</span>` : ""}</div>` : "";
      }).join("")
    : '<p class="muted">—</p>';

  // Sauvegardes (depuis lignée)
  const lignee = getEntryById("lignee", state.lignee);
  const savesEl = document.getElementById("result-saves");
  if (savesEl) {
    if (lignee?.sauvegardes) {
      const sauv = lignee.sauvegardes;
      savesEl.innerHTML = SAUVEGARDES.map(s => {
        const val = sauv[s] || "bas";
        return `<span class="recap-chip save-chip save-${val}">${s.slice(0,3).toUpperCase()}<small>${val[0]}</small></span>`;
      }).join("");
    } else {
      savesEl.innerHTML = '<p class="muted">—</p>';
    }
  }
}

function renderParticularites() {
  const rang = state.rang;
  const defs = [
    { entry: getEntryById("regne",  state.regne),  srcType: "regne",  label: "Règne"  },
    { entry: getEntryById("race",   state.race),   srcType: "race",   label: "Race"   },
    { entry: getEntryById("ethnie", state.ethnie), srcType: "ethnie", label: "Ethnie" },
    { entry: getEntryById("lignee", state.lignee), srcType: "lignee", label: "Lignée" }
  ];

  const all = [];
  defs.forEach(({ entry, srcType, label }) => {
    if (!entry) return;
    (entry.particularites || []).forEach(id => {
      const p = getPartById(id);
      if (p) all.push({ ...p, srcType, source: label });
    });
  });

  const el = document.getElementById("result-parts");
  if (!el) return;
  if (!all.length) { el.innerHTML = '<p class="muted">Sélectionner un règne, une race et/ou une ethnie.</p>'; return; }

  el.innerHTML = all.map(part => {
    const level   = partLevel(part.srcType, rang);
    const lvlName = level !== null ? LEVEL_NAMES[String(level)] : null;
    if (level === null) return `<div class="part locked">
      <div class="part-head"><span class="part-nom">${esc(part.nom)}</span><span class="tag">${part.source}</span></div>
      <p class="muted">Non disponible à ce rang.</p></div>`;
    const x      = LEVEL_X[String(level)];
    const effets = part.mode === "composee" ? renderComposedPartEffects(part, x) : (part.sous_effets || []).map(e => {
      const desc = (e.description || "").replace(/\{([^}]+)\}/g, (_, expr) => {
        const val = resolveFormula(expr, x);
        return `<strong class="val-x">${val}</strong>`;
      });
      return `<li><strong>${esc(e.nom)}</strong>${desc ? ` — ${desc}` : ""}</li>`;
    }).join("");
    return `<div class="part">
      <div class="part-head">
        <span class="part-nom">${esc(part.nom)}</span>
        <span class="tag">${part.source}</span>
        ${part.type_part ? `<span class="tag tag-${part.type_part}">${part.type_part === "actif" ? "Actif" : "Passif"}</span>` : ""}
        <span class="level-badge">${lvlName} (×${x})</span>
      </div>
      <ul class="effets">${effets}</ul>
    </div>`;
  }).join("");
}

function renderComposedPartEffects(part, x) {
  const trigger = getTriggerById(part.declencheur_id);
  const triggerHtml = trigger ? `<li><strong>${esc(trigger.nom)}</strong>${trigger.description ? ` — ${esc(trigger.description)}` : ""}</li>` : "";
  const effectsHtml = (part.effets || []).map(instance => {
    const def = getEffectById(instance.effet_id); if (!def) return "";
    let text = def.description || "";
    Object.entries(instance.parametres || {}).forEach(([key, value]) => { text = text.replaceAll(`{${key}}`, esc(value)); });
    text = text.replace(/\{([^}]+)\}/g, (_, expr) => `<strong class="val-x">${resolveFormula(expr, x)}</strong>`);
    return `<li><strong>${esc(def.nom)}</strong>${text ? ` — ${text}` : ""}</li>`;
  }).join("");
  return triggerHtml + effectsHtml;
}

// ── Bibliothèque profils ──────────────────────────────────────────────────────

function renderBiblio() {
  const profiles = loadProfiles();
  const countEl  = document.getElementById("biblio-count");
  if (countEl) countEl.textContent = `${profiles.length} profil(s)`;
  const grid = document.getElementById("profile-grid");
  if (!grid) return;
  if (!profiles.length) { grid.innerHTML = '<p class="muted">Aucun profil sauvegardé.</p>'; return; }

  grid.innerHTML = profiles.map(p => {
    const rd     = DATA.rangs.find(r => r.rang === p.rang);
    const race   = getEntryById("race",   p.race);
    const ethnie = getEntryById("ethnie", p.ethnie);
    const role   = DATA.roles.find(r => r.id === p.role);
    const date   = p.savedAt ? new Date(p.savedAt).toLocaleDateString("fr-FR") : "—";
    const rangStr = rd ? `${p.rang >= 0 ? "+" : ""}${p.rang} ${rd.titre}` : `rang ${p.rang}`;
    const raceStr = [race?.nom, ethnie?.nom].filter(Boolean).map(esc).join(" / ") || "—";
    const isEditing = p.id === state.editingId;
    return `<div class="profile-card${isEditing ? " pc-active" : ""}">
      <div class="pc-header">
        <span class="pc-name">${esc(p.name || "Sans nom")}</span>
        ${isEditing ? '<span class="pc-editing">en cours</span>' : ""}
      </div>
      <div class="pc-meta"><span class="pc-rang">${rangStr}</span><span class="pc-role">${role?.nom || "—"}</span></div>
      <div class="pc-race">${raceStr}</div>
      <div class="pc-footer"><span class="pc-date">${date}</span></div>
      <div class="pc-actions">
        <button class="pc-btn pc-btn-load" data-action="load" data-id="${p.id}">Charger</button>
        <button class="pc-btn pc-btn-dup"  data-action="dup"  data-id="${p.id}">Dupliquer</button>
        <button class="pc-btn pc-btn-del"  data-action="del"  data-id="${p.id}">Supprimer</button>
      </div>
    </div>`;
  }).join("");

  grid.querySelectorAll(".pc-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      const { action, id } = btn.dataset;
      if (action === "load") {
        const profile = loadProfiles().find(p => p.id === id);
        if (profile) { applyProfile(profile); switchTab("create"); }
      } else if (action === "dup") {
        duplicateProfile(id);
      } else if (action === "del") {
        if (confirm(`Supprimer "${loadProfiles().find(p => p.id === id)?.name || id}" ?`)) deleteProfile(id);
      }
    });
  });
}

// ── Import / Export tab ───────────────────────────────────────────────────────

function renderIO() {
  const ta = document.getElementById("export-json");
  if (ta) ta.value = exportJSON();
}

function attachIOHandlers() {
  document.getElementById("btn-export").addEventListener("click", downloadJSON);
  document.getElementById("btn-copy-json").addEventListener("click", () => {
    const ta = document.getElementById("export-json");
    if (!ta) return;
    navigator.clipboard.writeText(ta.value).then(() => flashStatus("copy-status", "✓ Copié"));
  });
  document.getElementById("btn-import").addEventListener("click", () => {
    const ta   = document.getElementById("import-json");
    const json = ta?.value.trim();
    if (!json) { showImportStatus("Aucun JSON.", false); return; }
    const result = importJSON(json);
    if (result.ok) { showImportStatus(`✓ ${result.added} ajouté(s) sur ${result.total}.`, true); if (ta) ta.value = ""; }
    else showImportStatus(`✗ ${result.error}`, false);
  });
  document.getElementById("import-file").addEventListener("change", e => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const result = importJSON(ev.target.result);
      if (result.ok) showImportStatus(`✓ ${result.added} ajouté(s) sur ${result.total}.`, true);
      else showImportStatus(`✗ ${result.error}`, false);
      e.target.value = "";
    };
    reader.readAsText(file);
  });
}

function showImportStatus(msg, ok) {
  const el = document.getElementById("import-status");
  if (el) { el.textContent = msg; el.className = `io-status ${ok ? "ok" : "err"}`; }
}

function flashStatus(id, msg) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg; el.classList.add("flash");
  setTimeout(() => { el.textContent = ""; el.classList.remove("flash"); }, 2000);
}

// ── DOM statique ──────────────────────────────────────────────────────────────

function buildBoostTable() {
  const container = document.getElementById("boost-table-container");
  container.innerHTML = `
    <table class="boost-table">
      <thead><tr>
        <th class="bd-src-col">Source</th>
        ${ATTRS.map(a => `<th class="bd-attr-hd">${a}</th>`).join("")}
        <th class="bd-valid-hd">✓</th>
      </tr></thead>
      <tbody>
        ${SOURCES.map(src => `
          <tr id="bd-row-${src}">
            <td class="bd-src-label">${SRC_LABEL[src]}</td>
            ${ATTRS.map(a => `<td class="bd-cell bd-empty" id="bd-${src}-${a}" data-source="${src}" data-attr="${a}">·</td>`).join("")}
            <td class="bd-valid-cell" id="bd-valid-${src}">—</td>
          </tr>`).join("")}
      </tbody>
    </table>`;

  container.querySelectorAll(".bd-cell").forEach(cell => {
    cell.addEventListener("click", () => {
      const { source: src, attr } = cell.dataset;
      const cur = state.bd[src][attr];
      state.bd[src][attr] = cur === "+" ? "-" : cur === "-" ? null : "+";
      renderBoostTable(); renderAttrTable();
    });
  });
}

function buildAttrRows() {
  const tbody = document.getElementById("attr-tbody");
  tbody.innerHTML = ATTRS.map(a => `
    <tr>
      <td class="attr-name">${a}</td>
      <td class="tier-radios">
        ${["TH","H","M","B","TB"].map(v => {
          const val = v === "TB" ? "" : v;
          return `<label class="tier-btn tier-${v}"><input type="radio" name="tier-${a}" value="${val}"${v === "TB" ? " checked" : ""}><span>${v}</span></label>`;
        }).join("")}
      </td>
      <td id="base-${a}" class="num">—</td>
      <td id="mod-${a}"  class="num">—</td>
      <td id="final-${a}" class="num final">—</td>
    </tr>`).join("");

  ATTRS.forEach(a => {
    document.querySelectorAll(`input[name="tier-${a}"]`).forEach(radio => {
      radio.addEventListener("change", e => {
        if (e.target.checked) { state.tiers[a] = e.target.value || null; renderAttrTable(); renderAttrSec(); }
      });
    });
  });
}

function buildAttrSecPanel() {
  const tbody = document.getElementById("sec-tbody");
  // Rows pour STA..CHN (base = 10)
  const rows = ATTRS_SEC.map(a => `
    <tr>
      <td class="attr-name">${a}</td>
      <td class="num">10</td>
      <td class="sec-adj-cell">
        <button class="sec-btn" data-attr="${a}" data-delta="-1">−</button>
        <span id="sec-adj-${a}" class="sec-adj-val">+0</span>
        <button class="sec-btn" data-attr="${a}" data-delta="1">+</button>
      </td>
      <td id="sec-final-${a}" class="num final">10</td>
    </tr>`);
  // Row EQU (base calculée)
  rows.push(`
    <tr class="equ-row">
      <td class="attr-name">EQU</td>
      <td id="sec-base-EQU" class="num muted">—</td>
      <td class="sec-adj-cell">
        <button class="sec-btn" data-attr="EQU" data-delta="-1">−</button>
        <span id="sec-adj-EQU" class="sec-adj-val">+0</span>
        <button class="sec-btn" data-attr="EQU" data-delta="1">+</button>
      </td>
      <td id="sec-final-EQU" class="num final">—</td>
    </tr>`);
  tbody.innerHTML = rows.join("");

  document.querySelectorAll(".sec-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      state.attrs_sec[btn.dataset.attr] += parseInt(btn.dataset.delta);
      renderAttrSec();
    });
  });
}

function buildNatPanel() {
  document.querySelectorAll(".nat-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const field = btn.dataset.field;
      state[field] = Math.max(0, Math.min(6, state[field] + parseInt(btn.dataset.delta)));
      renderNat();
    });
  });
}

function attachSaveBar() {
  document.getElementById("btn-save").addEventListener("click", saveCurrentProfile);
  document.getElementById("btn-new-profile").addEventListener("click", resetState);
  document.getElementById("btn-new-from-biblio").addEventListener("click", () => { resetState(); switchTab("create"); });
}

function attachTabs() {
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => switchTab(btn.dataset.tab));
  });
}

function attachDonneesTab() {
  document.querySelectorAll(".dtype-tab").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".dtype-tab").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      donneesType = btn.dataset.type;
      renderDonneesTab();
    });
  });
  document.getElementById("btn-new-entry").addEventListener("click", () => openModal(donneesType, null));
  document.getElementById("btn-export-data").addEventListener("click", downloadDataJSON);
  document.getElementById("btn-import-data-open").addEventListener("click", () => {
    document.getElementById("import-data-file").click();
  });
  document.getElementById("import-data-file").addEventListener("change", e => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const result = importDataJSON(ev.target.result);
      alert(result.ok ? `✓ ${result.added} entrée(s) importée(s).` : `✗ ${result.error}`);
      if (result.ok) { renderDonneesTab(); populateRegnes(); populateRaces(state.regne); populateEthnies(state.race); populateLignees(state.regne); }
      e.target.value = "";
    };
    reader.readAsText(file);
  });
}

function attachModalHandlers() {
  document.getElementById("modal-close").addEventListener("click",  closeModal);
  document.getElementById("modal-cancel").addEventListener("click", closeModal);
  document.getElementById("modal-ok").addEventListener("click",     saveModalEntry);
  document.getElementById("modal-overlay").addEventListener("click", e => {
    if (e.target === document.getElementById("modal-overlay")) closeModal();
  });
  document.querySelectorAll(".add-btn").forEach(btn => {
    btn.addEventListener("click", () => openModal(btn.dataset.modal, null));
  });
}

// ── Utilitaires ───────────────────────────────────────────────────────────────

function resolveFormula(expr, x) {
  const substituted = expr.replace(/(\d)x/g, '$1*x').replace(/x/g, String(x));
  if (!/^[\d+\-*\/().\s]+$/.test(substituted)) return substituted;
  try {
    const result = Function('return (' + substituted + ')')();
    if (!Number.isFinite(result)) return substituted;
    return result % 1 === 0 ? result : Math.round(result * 10) / 10;
  } catch { return substituted; }
}

function esc(s) {
  return String(s || "")
    .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

// ── Init ──────────────────────────────────────────────────────────────────────

async function init() {
  [DATA, COMPETENCES] = await Promise.all([
    fetch("data.json").then(r => r.json()),
    fetch("competences.json").then(r => r.json())
  ]);
  buildBoostTable();
  buildAttrRows();
  buildAttrSecPanel();
  buildNatPanel();
  populateRegnes();
  populateRangs();
  populateRoles();
  populateLignees(null);
  attachSelectors();
  attachSaveBar();
  attachTabs();
  attachDonneesTab();
  attachModalHandlers();
  render();
}

window.addEventListener("DOMContentLoaded", async () => {
  await init();
  attachIOHandlers();
});
