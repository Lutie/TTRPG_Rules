// app.js — RPG Resource Manager (NES.css + Press Start 2P)
// v4.0 — Resources + sidebar for Injuries/Trauma + Conditions + End Turn

(function(){
  const NEGATIVE_TO_MAX = new Set(['PE','PV','PS']); // can go to -max
  const NO_UPPER_CAP = new Set(['FT']); // no max
  const TEMP_OPTIONS = ['', 'Rage','Adrenaline','Guard','Endurance','Vitality','Spirituality','Mana','Karma','Chi'];

  // === Main resources
  const MAIN_TEMPLATE = [
    { key: 'PA',  name: 'Absorption',  img: 'images/armor.png', color: 'is-primary',   max: 10, value: 10, rec: 2 },
    { key: 'PE',  name: 'Endurance',   img: 'images/endurance.png', color: 'is-success',   max: 10, value: 10, rec: 3 },
    { key: 'PV',  name: 'Vitality',    img: 'images/vitality.png', color: 'is-error',     max: 10, value: 10, rec: 2 },
    { key: 'PS',  name: 'Spirituality',img: 'images/spirit.png', color: 'is-warning',   max: 10, value: 10, rec: 2 },
    { key: 'PC',  name: 'Chi',         img: 'images/chi.png', color: 'is-primary',   max: 10, value: 10, rec: 2 },
    { key: 'PK',  name: 'Karma',       img: 'images/karma.png', color: 'is-success',   max: 10, value: 10, rec: 1 },
    { key: 'FT',  name: 'Fatigue',     img: 'images/stress.png', color: 'is-warning',   max: 10, value: 0,  rec: 0 },
  ];

  // === Injuries & Trauma definitions
  const PHYS_LEVELS = [
    { key:'phys_minor',   label:'Minor (-0)',   penalty:0 },
    { key:'phys_light',   label:'Light (-1)',   penalty:1 },
    { key:'phys_moderate',label:'Moderate (-2)',penalty:2 },
    { key:'phys_severe',  label:'Severe (-3)',  penalty:3 },
    { key:'phys_critical',label:'Critical (-4)',penalty:4 },
  ];

  const MENT_LEVELS = [
    { key:'ment_minor',   label:'Minor (-0)',   penalty:0 },
    { key:'ment_light',   label:'Light (-1 )',   penalty:1 },
    { key:'ment_moderate',label:'Moderate (-2)',penalty:2 },
    { key:'ment_severe',  label:'Severe (-3)',  penalty:3 },
    { key:'ment_critical',label:'Critical (-4)',penalty:4 },
  ];

  // === State
  const STORAGE_KEY = 'rpg_resource_manager_v4_0';
  const loadState = () => {
    try { const raw = localStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) : null; }
    catch { return null; }
  };
  const saveState = (state) => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {} };

  const defaultState = () => ({
    main: MAIN_TEMPLATE.reduce((acc, r)=>{
      acc[r.key] = { max:r.max, value:r.value, rec:r.rec, img:r.img, color:r.color, name:r.name };
      return acc;
    }, {}),
    tempRows: [
      { name: '', value: 0 },
      { name: '', value: 0 },
      { name: '', value: 0 },
      { name: '', value: 0 },
    ],
    globalRecovery: 0,
    equilibrium: 0,
    tempMax: 5,
    step: 1,
    actionCounterEnabled: false,
    actionCounterValue: '',
    mitigationCounterEnabled: false,
    mitigationCounterValue: '',
    injuryCounts: PHYS_LEVELS.reduce((o,l)=> (o[l.key]=2,o),{}),
    traumaCounts: MENT_LEVELS.reduce((o,l)=> (o[l.key]=2,o),{}),
    injuryChecks: PHYS_LEVELS.reduce((o,l)=> (o[l.key]=[false,false],o),{}),
    traumaChecks: MENT_LEVELS.reduce((o,l)=> (o[l.key]=[false,false],o),{}),
    conditions: Array.from({length:5}, ()=>({ name:'', value:0, type:'physical' })),
  });

  let state = Object.assign(defaultState(), loadState() || {});

  // === Elements
  const mainWrap = document.getElementById('mainResources');
  const tempWrap = document.getElementById('tempResources');
  const settingsDialog = document.getElementById('settingsDialog');
  const openSettingsBtn = document.getElementById('openSettings');
  const saveSettingsBtn = document.getElementById('saveSettings');
  const settingsGrid = document.getElementById('settingsGrid');
  const injurySettings = document.getElementById('injurySettings');
  const resetAllBtn = document.getElementById('resetAll');
  const shortRestBtn = document.getElementById('shortRest');
  const longRestBtn = document.getElementById('longRest');
  const endTurnBtn = document.getElementById('endTurn');
  const stepInput = document.getElementById('stepInput');

  const actionCounterEnabled = document.getElementById('actionCounterEnabled');
  const actionCounterValue = document.getElementById('actionCounterValue');
  const mitigationCounterEnabled = document.getElementById('mitigationCounterEnabled');
  const mitigationCounterValue = document.getElementById('mitigationCounterValue');

  const confirmDialog = document.getElementById('confirmDialog');
  const confirmDesc = document.getElementById('confirm-desc');
  const confirmYes = document.getElementById('confirmYes');
  let pendingResetApply = null;

  // === Utils
  const clamp = (val, min, max) => Math.max(min, Math.min(max, val));
  const parseCounter = (enabled, rawValue) => {
    if (!enabled) return null;
    if (rawValue === '' || rawValue === null || rawValue === undefined) return null;
    const n = parseInt(rawValue, 10);
    return Number.isFinite(n) ? n : null;
  };

  function applyStepDeltaMain(key, current, max, sign, step) {
    const target = sign > 0 ? current + step : current - step;
    const min = NEGATIVE_TO_MAX.has(key) ? -max : 0;
    const upper = NO_UPPER_CAP.has(key) ? Number.POSITIVE_INFINITY : max;
    return clamp(target, min, upper);
  }
  function applyStepDeltaTemp(current, max, sign, step) {
    const target = sign > 0 ? current + step : current - step;
    return clamp(target, 0, max);
  }

  function syncTopControls() {
    stepInput.value = state.step;
    actionCounterEnabled.checked = state.actionCounterEnabled;
    mitigationCounterEnabled.checked = state.mitigationCounterEnabled;
    if (state.actionCounterValue !== '') actionCounterValue.value = state.actionCounterValue;
    if (state.mitigationCounterValue !== '') mitigationCounterValue.value = state.mitigationCounterValue;
  }

  // === Render main resources
  function renderMain() {
    mainWrap.innerHTML = '';
    const header = document.createElement('div');
    header.className = 'nes-container with-title';
    const title = document.createElement('p');
    title.className = 'title';
    title.textContent = 'Main Resources';
    header.appendChild(title);

    Object.keys(state.main).forEach(key => {
      const r = state.main[key];
      const row = document.createElement('div');
      row.className = 'resource-row';

      const meta = document.createElement('div');
      meta.className = 'resource-meta';
      const img = document.createElement('img');
      img.className = 'icon-img';
      img.alt = `${key} ${r.name}`;
      img.src = r.img;
      const nameSpan = document.createElement('span');
      nameSpan.textContent = key;
      meta.appendChild(img);
      meta.appendChild(nameSpan);

      const progressWrap = document.createElement('div');
      progressWrap.className = 'progress-wrap';
      const progress = document.createElement('progress');
      progress.className = `nes-progress ${r.color || ''}`;
      progress.max = r.max;
      progress.value = clamp(r.value, 0, r.max);
      progress.style.width = '100%';
      progressWrap.appendChild(progress);

      const valueText = document.createElement('div');
      valueText.className = 'value-text';
      const label = document.createElement('span');
      label.textContent = `${r.value} / ${r.max}`;
      valueText.appendChild(label);

      const btns = document.createElement('div');
      btns.className = 'btns';
      const minus = document.createElement('button');
      minus.className = 'nes-btn is-error';
      minus.textContent = '−';
      const plus = document.createElement('button');
      plus.className = 'nes-btn is-success';
      plus.textContent = '+';
      const reset = document.createElement('button');
      reset.className = 'nes-btn is-warning';
      reset.textContent = 'Reset';
      btns.appendChild(minus);
      btns.appendChild(plus);
      btns.appendChild(reset);

      function updateUI() {
        progress.max = r.max;
        progress.value = clamp(r.value, 0, r.max);
        label.textContent = `${r.value} / ${r.max}`;
      }

      function onDelta(sign) {
        const before = r.value;
        const after = applyStepDeltaMain(key, before, r.max, sign, state.step);
        if (after !== before) {
          r.value = after;
          updateUI();

          const ac = parseCounter(state.actionCounterEnabled, state.actionCounterValue);
          if (ac !== null) {
            state.actionCounterValue = ac - Math.abs(after - before);
            actionCounterValue.value = state.actionCounterValue;
          }
          if (key === 'PE' && sign < 0) {
            const mc = parseCounter(state.mitigationCounterEnabled, state.mitigationCounterValue);
            if (mc !== null) {
              state.mitigationCounterValue = mc - Math.abs(after - before);
              mitigationCounterValue.value = state.mitigationCounterValue;
            }
          }

          saveState(state);
        }
      }

      minus.addEventListener('click', () => onDelta(-1));
      plus.addEventListener('click', () => onDelta(1));

      reset.addEventListener('click', () => {
        pendingResetApply = () => {
          if (key === 'FT') return; // FT has no fixed max
          r.value = r.max;
          updateUI();
          saveState(state);
        };
        confirmDesc.textContent = `Reset ${key}?`;
        confirmDialog.showModal();
      });

      row.appendChild(meta);
      row.appendChild(progressWrap);
      row.appendChild(valueText);
      row.appendChild(btns);
      header.appendChild(row);
    });

    mainWrap.appendChild(header);
  }

  // === Temporary resources (4 rows with dropdowns)
  function renderTemp() {
    tempWrap.innerHTML = '';
    const box = document.createElement('div');
    box.className = 'nes-container with-title';
    const title = document.createElement('p');
    title.className = 'title';
    title.textContent = 'Temporary Resources';
    box.appendChild(title);

    state.tempRows.forEach((tr, idx) => {
      const row = document.createElement('div');
      row.className = 'temp-row';

      const selWrap = document.createElement('div');
      selWrap.className = 'nes-select temp-select-wrap';
      const select = document.createElement('select');
      TEMP_OPTIONS.forEach(optName => {
        const opt = document.createElement('option');
        opt.value = optName;
        opt.textContent = optName === '' ? '— None —' : optName;
        if ((tr.name || '') === optName) opt.selected = true;
        select.appendChild(opt);
      });
      selWrap.appendChild(select);

      const progressWrap = document.createElement('div');
      progressWrap.className = 'progress-wrap';
      const progress = document.createElement('progress');
      progress.className = 'nes-progress is-primary';
      progress.max = state.tempMax;
      progress.value = clamp(tr.value, 0, state.tempMax);
      progress.style.width = '100%';
      progressWrap.appendChild(progress);

      const valueText = document.createElement('div');
      valueText.className = 'value-text';
      const label = document.createElement('span');
      label.textContent = `${tr.value} / ${state.tempMax}`;
      valueText.appendChild(label);

      const btns = document.createElement('div');
      btns.className = 'btns';
      const minus = document.createElement('button');
      minus.className = 'nes-btn is-error';
      minus.textContent = '−';
      const plus = document.createElement('button');
      plus.className = 'nes-btn is-success';
      plus.textContent = '+';
      const reset = document.createElement('button');
      reset.className = 'nes-btn is-warning';
      reset.textContent = 'Reset';
      btns.appendChild(minus);
      btns.appendChild(plus);
      btns.appendChild(reset);

      function updateUI() {
        const disabled = (tr.name || '') === '';
        row.classList.toggle('muted', disabled);
        progress.max = state.tempMax;
        progress.value = clamp(tr.value, 0, state.tempMax);
        label.textContent = `${tr.value} / ${state.tempMax}`;
      }

      function onDelta(sign) {
        if ((tr.name || '') === '') return;
        const before = tr.value;
        const after = applyStepDeltaTemp(before, state.tempMax, sign, state.step);
        if (after !== before) {
          tr.value = after;
          updateUI();
          const ac = parseCounter(state.actionCounterEnabled, state.actionCounterValue);
          if (ac !== null) {
            state.actionCounterValue = ac - Math.abs(after - before);
            actionCounterValue.value = state.actionCounterValue;
          }
          saveState(state);
        }
      }

      select.addEventListener('change', () => {
        tr.name = select.value;
        saveState(state);
        updateUI();
      });

      minus.addEventListener('click', () => onDelta(-1));
      plus.addEventListener('click', () => onDelta(1));
      reset.addEventListener('click', () => {
        pendingResetApply = () => {
          if ((tr.name || '') === '') return;
          tr.value = state.tempMax;
          updateUI();
          saveState(state);
        };
        confirmDesc.textContent = `Reset ${tr.name || 'None'}?`;
        confirmDialog.showModal();
      });

      row.appendChild(selWrap);
      row.appendChild(progressWrap);
      row.appendChild(valueText);
      row.appendChild(btns);
      box.appendChild(row);

      updateUI();
    });

    tempWrap.appendChild(box);
  }

  // === Injuries & Trauma
  function renderChecks(container, levels, counts, checks, onToggle) {
    container.innerHTML = '';
    levels.forEach(level => {
      if (!Array.isArray(checks[level.key])) checks[level.key] = [];
      if (checks[level.key].length !== counts[level.key]) {
        checks[level.key] = Array.from({length: counts[level.key]}, (_,i)=> !!checks[level.key][i]);
      }
      const row = document.createElement('div');
      row.className = 'row';
      const label = document.createElement('span');
      label.textContent = level.label;
      row.appendChild(label);

      const chips = document.createElement('div');
      chips.className = 'chips';
      checks[level.key].forEach((val, idx) => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'chip nes-btn ' + (val ? 'is-active' : '');
        chip.textContent = val ? '✓' : '';
        chip.addEventListener('click', () => {
          checks[level.key][idx] = !checks[level.key][idx];
          chip.classList.toggle('is-active', checks[level.key][idx]);
          chip.textContent = checks[level.key][idx] ? '✓' : '';
          onToggle();
        });
        chips.appendChild(chip);
      });
      row.appendChild(chips);
      container.appendChild(row);
    });
  }

  function highestPenalty(levels, checks) {
    let maxPen = 0;
    levels.forEach(level => {
      const arr = checks[level.key] || [];
      if (arr.some(Boolean)) {
        maxPen = Math.max(maxPen, level.penalty);
      }
    });
    return maxPen;
  }

  function recomputePenalties() {
    const phys = highestPenalty(PHYS_LEVELS, state.injuryChecks);
    const ment = highestPenalty(MENT_LEVELS, state.traumaChecks);
    const total = phys + ment;
    document.getElementById('totalPenalties').textContent = `${total} (P:${phys} + M:${ment})`;
    saveState(state);
  }

  function renderInjuries() {
    const physBox = document.getElementById('physicalInjuries');
    const mentBox = document.getElementById('mentalTrauma');
    renderChecks(physBox, PHYS_LEVELS, state.injuryCounts, state.injuryChecks, recomputePenalties);
    renderChecks(mentBox, MENT_LEVELS, state.traumaCounts, state.traumaChecks, recomputePenalties);
    recomputePenalties();
  }
    // === Conditions
    function renderConditions() {
      const grid = document.getElementById('conditionsGrid');
      grid.innerHTML = '';
      const TYPES = ['physical','mental','magical','other'];
  
      state.conditions.forEach((c, idx) => {
        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.className = 'nes-input';
        nameInput.placeholder = `Condition ${idx+1}`;
        nameInput.value = c.name || '';
        nameInput.addEventListener('change', () => { c.name = nameInput.value; saveState(state); });
  
        const valueInput = document.createElement('input');
        valueInput.type = 'number';
        valueInput.className = 'nes-input';
        valueInput.step = '1';
        valueInput.value = c.value || 0;
        valueInput.addEventListener('change', () => {
          const n = parseInt(valueInput.value,10);
          c.value = Number.isFinite(n) ? n : 0;
          saveState(state);
        });
  
        const selWrap = document.createElement('div');
        selWrap.className = 'nes-select';
        const typeSelect = document.createElement('select');
        TYPES.forEach(t => {
          const opt = document.createElement('option');
          opt.value = t;
          opt.textContent = t[0].toUpperCase() + t.slice(1);
          if ((c.type||'physical') === t) opt.selected = true;
          typeSelect.appendChild(opt);
        });
        typeSelect.addEventListener('change', () => { c.type = typeSelect.value; saveState(state); });
        selWrap.appendChild(typeSelect);
  
        const clearBtn = document.createElement('button');
        clearBtn.className = 'nes-btn';
        clearBtn.type = 'button';
        clearBtn.textContent = 'Clear';
        clearBtn.addEventListener('click', () => {
          c.name = ''; c.value = 0; c.type = 'physical';
          nameInput.value = ''; valueInput.value = 0; typeSelect.value = 'physical';
          saveState(state);
        });
  
        const row = document.createElement('div');
        row.className = 'cond-row';
        row.appendChild(nameInput);
        row.appendChild(valueInput);
        row.appendChild(selWrap);
        row.appendChild(clearBtn);
        grid.appendChild(row);
      });
    }
  
    // === Settings modal
    function renderSettings() {
      document.getElementById('globalRecovery').value = state.globalRecovery;
      document.getElementById('equilibrium').value = state.equilibrium;
      document.getElementById('tempMax').value = state.tempMax;
  
      settingsGrid.innerHTML = '';
      Object.keys(state.main).forEach(key => {
        const r = state.main[key];
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
        labelRec.textContent = `${key} — ${r.name} (recovery)`;
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
  
      // Injuries/Trauma counts
      injurySettings.innerHTML = '';
      const makeCountInput = (key, label, obj) => {
        const box = document.createElement('div');
        box.className = 'nes-field';
        const lab = document.createElement('label');
        lab.setAttribute('for', key);
        lab.textContent = label + ' (boxes)';
        const inp = document.createElement('input');
        inp.type = 'number';
        inp.min = '0';
        inp.step = '1';
        inp.id = key;
        inp.className = 'nes-input';
        inp.value = obj[key] ?? 2;
        box.appendChild(lab);
        box.appendChild(inp);
        return {box, inp};
      };
  
      const physHead = document.createElement('p'); physHead.textContent = 'Physical severities'; injurySettings.appendChild(physHead);
      const physInputs = PHYS_LEVELS.map(l => {
        const {box, inp} = makeCountInput(l.key, l.label, state.injuryCounts);
        injurySettings.appendChild(box);
        return {level:l, input:inp};
      });
  
      const mentHead = document.createElement('p'); mentHead.textContent = 'Mental severities'; injurySettings.appendChild(mentHead);
      const mentInputs = MENT_LEVELS.map(l => {
        const {box, inp} = makeCountInput(l.key, l.label, state.traumaCounts);
        injurySettings.appendChild(box);
        return {level:l, input:inp};
      });
  
      renderSettings._physInputs = physInputs;
      renderSettings._mentInputs = mentInputs;
    }
  
    function applySettings() {
      state.globalRecovery = Math.max(0, parseInt(document.getElementById('globalRecovery').value || '0', 10));
      state.equilibrium   = Math.max(0, parseInt(document.getElementById('equilibrium').value || '0', 10));
      state.tempMax       = Math.max(0, parseInt(document.getElementById('tempMax').value || '0', 10));
  
      Object.keys(state.main).forEach(key => {
        const r = state.main[key];
        const newMax = Math.max(0, parseInt(document.getElementById(`max_${key}`).value || '0', 10));
        const newRec = Math.max(0, parseInt(document.getElementById(`rec_${key}`).value || '0', 10));
        r.max = newMax;
        r.rec = newRec;
        if (NEGATIVE_TO_MAX.has(key)) {
          r.value = Math.max(-newMax, Math.min(r.value, newMax));
        } else if (NO_UPPER_CAP.has(key)) {
          r.value = Math.max(0, r.value);
        } else {
          r.value = clamp(r.value, 0, newMax);
        }
      });
  
      (renderSettings._physInputs||[]).forEach(({level,input}) => {
        const n = Math.max(0, parseInt(input.value||'0',10));
        state.injuryCounts[level.key] = n;
        const arr = state.injuryChecks[level.key] || [];
        state.injuryChecks[level.key] = Array.from({length:n}, (_,i)=> !!arr[i]);
      });
      (renderSettings._mentInputs||[]).forEach(({level,input}) => {
        const n = Math.max(0, parseInt(input.value||'0',10));
        state.traumaCounts[level.key] = n;
        const arr = state.traumaChecks[level.key] || [];
        state.traumaChecks[level.key] = Array.from({length:n}, (_,i)=> !!arr[i]);
      });
  
      state.tempRows.forEach(tr => {
        tr.value = clamp(tr.value, 0, state.tempMax);
      });
  
      saveState(state);
      renderMain();
      renderTemp();
      renderInjuries();
    }
  // === Rests
  shortRestBtn.addEventListener('click', () => {
    const pe = state.main['PE'];
    const ft = state.main['FT'];
    if (pe) {
      const target = Math.max(pe.value, state.equilibrium || 0);
      pe.value = Math.min(target, pe.max); // cap to max on short rest
    }
    if (ft) {
      ft.value = Math.max(0, ft.value + 2); // FT has no upper cap but no negatives
    }
    saveState(state);
    renderMain();
  });

  longRestBtn.addEventListener('click', () => {
    const g = state.globalRecovery || 0;
    Object.keys(state.main).forEach(key => {
      const r = state.main[key];
      if (key === 'PE') {
        r.value = r.max; // Endurance full on long rest
      } else {
        const gain = (r.rec || 0) + g;
        const upper = NO_UPPER_CAP.has(key) ? Number.POSITIVE_INFINITY : r.max;
        r.value = Math.min(r.value + gain, upper);
        if (!NEGATIVE_TO_MAX.has(key)) r.value = Math.max(0, r.value);
        else r.value = Math.max(-r.max, r.value);
      }
    });
    saveState(state);
    renderMain();
  });

  // === End Turn: decay conditions
  endTurnBtn.addEventListener('click', () => {
    const pvRec = (state.main['PV']?.rec || 0) + (state.globalRecovery || 0);
    const psRec = (state.main['PS']?.rec || 0) + (state.globalRecovery || 0);
  
    state.conditions.forEach(c => {
      if (!c || !c.type) return;
      if (c.type === 'physical') {
        c.value = Math.max(0, (c.value||0) - pvRec);
      } else if (c.type === 'mental') {
        c.value = Math.max(0, (c.value||0) - psRec);
      } else if (c.type === 'magical') {
        c.value = Math.max(0, (c.value||0) - 5);
      } else {
        // "other": no automatic decay
      }
    });
    saveState(state);
    renderConditions();
  });

  // === Top controls
  stepInput.addEventListener('change', () => {
    const v = Math.max(1, parseInt(stepInput.value || '1', 10));
    state.step = v;
    stepInput.value = v;
    saveState(state);
  });

  actionCounterEnabled.addEventListener('change', () => {
    state.actionCounterEnabled = !!actionCounterEnabled.checked;
    saveState(state);
  });
  actionCounterValue.addEventListener('change', () => {
    const raw = actionCounterValue.value;
    state.actionCounterValue = raw === '' ? '' : (Number.isFinite(parseInt(raw,10)) ? parseInt(raw,10) : '');
    actionCounterValue.value = state.actionCounterValue;
    saveState(state);
  });

  mitigationCounterEnabled.addEventListener('change', () => {
    state.mitigationCounterEnabled = !!mitigationCounterEnabled.checked;
    saveState(state);
  });
  mitigationCounterValue.addEventListener('change', () => {
    const raw = mitigationCounterValue.value;
    state.mitigationCounterValue = raw === '' ? '' : (Number.isFinite(parseInt(raw,10)) ? parseInt(raw,10) : '');
    mitigationCounterValue.value = state.mitigationCounterValue;
    saveState(state);
  });

  // === Settings modal
  openSettingsBtn.addEventListener('click', () => {
    // Build the settings form's top fields (already referenced in renderSettings):
    // We ensure the three top inputs exist in DOM (if your HTML doesn't have them,
    // add them above settingsGrid).
    // The provided index.html includes them implicitly; renderSettings fills them.
    renderSettings();
    if (settingsDialog.showModal) settingsDialog.showModal();
    else settingsDialog.setAttribute('open', '');
  });

  saveSettingsBtn.addEventListener('click', (e) => {
    e.preventDefault();
    applySettings();
    settingsDialog.close();
  });

  // === Confirm reset
  confirmYes.addEventListener('click', (e) => {
    e.preventDefault();
    if (pendingResetApply) pendingResetApply();
    confirmDialog.close();
    pendingResetApply = null;
  });

  // === Global reset to max (where applicable)
  resetAllBtn.addEventListener('click', () => {
    Object.keys(state.main).forEach(key => {
      const r = state.main[key];
      if (key === 'FT') return; // FT has no fixed max
      r.value = r.max;
    });
    state.tempRows.forEach(tr => {
      if ((tr.name || '') !== '') tr.value = state.tempMax;
    });
    saveState(state);
    renderMain();
    renderTemp();
  });

  // === Init
  (function init() {
    // Ensure top-of-settings inputs exist. If your index.html doesn't include:
    // <input id="globalRecovery">, <input id="equilibrium">, <input id="tempMax">
    // add them inside the settings dialog. (The earlier parts assume they exist.)
    syncTopControls();
    renderMain();
    renderTemp();
    renderInjuries();
    renderConditions();
  })();

})(); // end IIFE
  
