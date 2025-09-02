// app.js — Gestionnaire de Ressources (NES.css)
// v2.1 — Négatifs sur PE/PV/PS, compteur révisé
(function(){
  const PLACEHOLDER = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=';

  // Ressources (FT démarre à 0)
  const RES_TPL = [
    { key: 'ABS', name: 'Absorption',  img: PLACEHOLDER, color: 'is-primary', max: 10, value: 10, rec: 2 },
    { key: 'PE',  name: 'Endurance',   img: PLACEHOLDER, color: 'is-success', max: 10, value: 10, rec: 3 },
    { key: 'PV',  name: 'Vitalité',    img: PLACEHOLDER, color: 'is-error',   max: 10, value: 10, rec: 2 },
    { key: 'PS',  name: 'Spiritualité',img: PLACEHOLDER, color: 'is-warning', max: 10, value: 10, rec: 2 },
    { key: 'PC',  name: 'Chi',         img: PLACEHOLDER, color: 'is-primary', max: 10, value: 10, rec: 2 },
    { key: 'PK',  name: 'Karma',       img: PLACEHOLDER, color: 'is-success', max: 10, value: 10, rec: 1 },
    { key: 'FT',  name: 'Fatigue',     img: PLACEHOLDER, color: 'is-warning', max: 10, value: 0,  rec: 0 },
  ];

  const NEGATIVE_ALLOWED = new Set(['PE','PV','PS']);

  // Persistance locale
  const STORAGE_KEY = 'jdr_resource_manager_v2_1';
  const loadState = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch { return null; }
  };
  const saveState = (state) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  };

  // État par défaut
  const defaultState = () => ({
    resources: RES_TPL.reduce((acc, r) => {
      acc[r.key] = { max: r.max, value: r.value, rec: r.rec, img: r.img, color: r.color, name: r.name };
      return acc;
    }, {}),
    globalRecovery: 0,
    step: 1,
    counterEnabled: false,
    counterValue: '', // vide = ignoré
  });

  let state = Object.assign(defaultState(), loadState() || {});

  // Elements
  const wrap = document.getElementById('resources');
  const settingsDialog = document.getElementById('settingsDialog');
  const openSettingsBtn = document.getElementById('openSettings');
  const saveSettingsBtn = document.getElementById('saveSettings');
  const settingsGrid = document.getElementById('settingsGrid');
  const resetAllBtn = document.getElementById('resetAll');
  const shortRestBtn = document.getElementById('shortRest');
  const longRestBtn = document.getElementById('longRest');
  const stepInput = document.getElementById('stepInput');
  const counterEnabled = document.getElementById('counterEnabled');
  const counterValue = document.getElementById('counterValue');

  // Confirm dialog
  const confirmDialog = document.getElementById('confirmDialog');
  const confirmDesc = document.getElementById('confirm-desc');
  const confirmYes = document.getElementById('confirmYes');
  let pendingResetApply = null;

  // Utils
  const clamp = (val, min, max) => Math.max(min, Math.min(max, val));
  const parseCounter = () => {
    if (!state.counterEnabled) return null;
    // valeur vide => ignoré
    if (state.counterValue === '' || state.counterValue === null || state.counterValue === undefined) return null;
    const n = parseInt(state.counterValue, 10);
    return Number.isFinite(n) ? n : null;
  };

  const applyStepDelta = (current, max, sign, step, allowNegative) => {
    const target = sign > 0 ? current + step : current - step;
    const min = allowNegative ? Number.NEGATIVE_INFINITY : 0;
    // On ne borne que par le max (min si non négatif)
    return clamp(target, min, max);
  };

  // MAJ top controls
  function syncTopControls() {
    stepInput.value = state.step;
    counterEnabled.checked = state.counterEnabled;
    counterValue.value = state.counterValue;
  }

  // Helpers de mise à jour ciblée
  function updateRowUI(key, ctx) {
    const r = state.resources[key];
    ctx.progressEl.max = r.max;
    // Si négatif autorisé, on n'affiche pas de valeur négative dans la barre
    ctx.progressEl.value = Math.max(0, r.value);
    ctx.labelEl.textContent = `${r.value} / ${r.max}`;
  }

  function renderResourceRow(key) {
    const r = state.resources[key];
    const row = document.createElement('div');
    row.className = 'resource-row';

    // Col 1: meta (image + acronyme)
    const meta = document.createElement('div');
    meta.className = 'resource-meta';
    const img = document.createElement('img');
    img.className = 'icon-img';
    img.alt = `${key} ${r.name}`;
    img.src = r.img || PLACEHOLDER;
    const acronym = document.createElement('span');
    acronym.textContent = key;
    meta.appendChild(img);
    meta.appendChild(acronym);

    // Col 2: progress
    const progressWrap = document.createElement('div');
    progressWrap.className = 'progress-wrap';
    const progress = document.createElement('progress');
    progress.className = `nes-progress ${r.color || ''}`;
    progress.max = r.max;
    progress.value = Math.max(0, r.value); // garde >= 0 visuellement
    progress.style.width = '100%';
    progressWrap.appendChild(progress);

    // Col 3: texte valeurs
    const valueText = document.createElement('div');
    valueText.className = 'value-text';
    const label = document.createElement('span');
    label.textContent = `${r.value} / ${r.max}`;
    valueText.appendChild(label);

    // Col 4: boutons +/- + reset
    const btns = document.createElement('div');
    btns.className = 'btns';
    const minus = document.createElement('button');
    minus.className = 'nes-btn is-error';
    minus.type = 'button';
    minus.title = 'Diminuer';
    minus.textContent = '−';

    const plus = document.createElement('button');
    plus.className = 'nes-btn is-success';
    plus.type = 'button';
    plus.title = 'Augmenter';
    plus.textContent = '+';

    const reset = document.createElement('button');
    reset.className = 'nes-btn is-warning';
    reset.type = 'button';
    reset.title = 'Remettre cette ressource à son maximum';
    reset.textContent = 'Reset';

    btns.appendChild(minus);
    btns.appendChild(plus);
    btns.appendChild(reset);

    const ctx = { progressEl: progress, labelEl: label };

    function onDelta(sign) {
      const allowNeg = NEGATIVE_ALLOWED.has(key);
      const before = r.value;
      const after = applyStepDelta(before, r.max, sign, state.step, allowNeg);
      if (after !== before) {
        r.value = after;
        updateRowUI(key, ctx);

        // Compteur: seulement si activé et valeur présente
        const c = parseCounter();
        if (c !== null) {
          state.counterValue = c - Math.abs(after - before);
          counterValue.value = state.counterValue;
        }
        saveState(state);
      }
    }

    minus.addEventListener('click', () => onDelta(-1));
    plus.addEventListener('click', () => onDelta(1));

    // Reset (ne touche PAS le compteur)
    reset.addEventListener('click', () => {
      pendingResetApply = () => {
        r.value = r.max;
        updateRowUI(key, ctx);
        saveState(state);
      };
      const name = r.name || key;
      const confirmDesc = document.getElementById('confirm-desc');
      confirmDesc.textContent = `Voulez-vous remettre ${key} — ${name} à son maximum (${r.max}) ?`;
      const dlg = document.getElementById('confirmDialog');
      if (dlg.showModal) dlg.showModal();
      else dlg.setAttribute('open', '');
    });

    row.appendChild(meta);
    row.appendChild(progressWrap);
    row.appendChild(valueText);
    row.appendChild(btns);
    return row;
  }

  document.getElementById('confirmYes').addEventListener('click', (e) => {
    e.preventDefault();
    if (pendingResetApply) pendingResetApply();
    document.getElementById('confirmDialog').close();
    pendingResetApply = null;
  });

  function renderAll() {
    wrap.innerHTML = '';
    const header = document.createElement('div');
    header.className = 'nes-container with-title';
    const title = document.createElement('p');
    title.className = 'title';
    title.textContent = 'Ressources';
    header.appendChild(title);

    Object.keys(state.resources).forEach(k => header.appendChild(renderResourceRow(k)));
    wrap.appendChild(header);
  }

  // SETTINGS
  function renderSettings() {
    document.getElementById('globalRecovery').value = state.globalRecovery;
    settingsGrid.innerHTML = '';
    Object.keys(state.resources).forEach(key => {
      const r = state.resources[key];
      const boxMax = document.createElement('div');
      boxMax.className = 'nes-field';
      const labelMax = document.createElement('label');
      labelMax.setAttribute('for', `max_${key}`);
      labelMax.textContent = `${key} — ${r.name} (max)`;
      const inputMax = document.createElement('input');
      inputMax.type = 'number';
      inputMax.min = '0';
      inputMax.step = '1';
      inputMax.id = `max_${key}`;
      inputMax.className = 'nes-input';
      inputMax.value = r.max;
      boxMax.appendChild(labelMax);
      boxMax.appendChild(inputMax);

      const boxRec = document.createElement('div');
      boxRec.className = 'nes-field';
      const labelRec = document.createElement('label');
      labelRec.setAttribute('for', `rec_${key}`);
      labelRec.textContent = `${key} — ${r.name} (récupération)`;
      const inputRec = document.createElement('input');
      inputRec.type = 'number';
      inputRec.min = '0';
      inputRec.step = '1';
      inputRec.id = `rec_${key}`;
      inputRec.className = 'nes-input';
      inputRec.value = r.rec || 0;
      boxRec.appendChild(labelRec);
      boxRec.appendChild(inputRec);

      settingsGrid.appendChild(boxMax);
      settingsGrid.appendChild(boxRec);
    });
  }

  function applySettings() {
    const newGlobal = Math.max(0, parseInt(document.getElementById('globalRecovery').value || '0', 10));
    state.globalRecovery = newGlobal;

    Object.keys(state.resources).forEach(key => {
      const r = state.resources[key];
      const newMax = Math.max(0, parseInt(document.getElementById(`max_${key}`).value || '0', 10));
      const newRec = Math.max(0, parseInt(document.getElementById(`rec_${key}`).value || '0', 10));
      r.max = newMax;
      r.rec = newRec;
      // clamp max only; min depends on negative allowed
      r.value = NEGATIVE_ALLOWED.has(key) ? Math.min(r.value, newMax) : clamp(r.value, 0, newMax);
    });
    saveState(state);
    renderAll();
  }

  // REST LOGIC (ne touche PAS au compteur)
  shortRestBtn.addEventListener('click', () => {
    const pe = state.resources['PE'];
    if (!pe) return;
    const next = Math.max(pe.value, pe.rec || 0);
    if (next !== pe.value) {
      pe.value = Math.min(next, pe.max); // max clamp
      saveState(state);
      renderAll();
    }
  });

  longRestBtn.addEventListener('click', () => {
    const g = state.globalRecovery || 0;
    Object.keys(state.resources).forEach(key => {
      const r = state.resources[key];
      if (key === 'PE') {
        r.value = r.max; // PE pleine au repos long
      } else {
        const gain = (r.rec || 0) + g;
        r.value = Math.min(r.value + gain, r.max);
      }
    });
    saveState(state);
    renderAll();
  });

  // TOP CONTROLS BEHAVIOR
  stepInput.addEventListener('change', () => {
    const v = Math.max(1, parseInt(stepInput.value || '1', 10));
    state.step = v;
    stepInput.value = v;
    saveState(state);
  });
  counterEnabled.addEventListener('change', () => {
    state.counterEnabled = !!counterEnabled.checked;
    saveState(state);
  });
  counterValue.addEventListener('change', () => {
    // accepter vide => ignoré
    const raw = counterValue.value;
    if (raw === '') {
      state.counterValue = '';
    } else {
      const n = parseInt(raw, 10);
      state.counterValue = Number.isFinite(n) ? n : '';
    }
    counterValue.value = state.counterValue;
    saveState(state);
  });

  // Global actions
  openSettingsBtn.addEventListener('click', () => {
    renderSettings();
    if (settingsDialog.showModal) settingsDialog.showModal();
    else settingsDialog.setAttribute('open', '');
  });

  saveSettingsBtn.addEventListener('click', (e) => {
    e.preventDefault();
    applySettings();
    settingsDialog.close();
  });

  resetAllBtn.addEventListener('click', () => {
    Object.keys(state.resources).forEach(key => {
      const r = state.resources[key];
      r.value = r.max;
    });
    saveState(state);
    renderAll();
  });

  // INIT
  // migrer ancienne clé si présente
  const old = localStorage.getItem('jdr_resource_manager_v2');
  if (old && !localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, old);
    state = Object.assign(defaultState(), loadState() || {});
  }

  // Hydrate top controls
  // si state.counterValue === '', garder input vide
  stepInput.value = state.step;
  counterEnabled.checked = state.counterEnabled;
  if (state.counterValue !== '') counterValue.value = state.counterValue;

  renderAll();
})();