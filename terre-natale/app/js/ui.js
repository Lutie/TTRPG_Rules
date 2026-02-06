// ui.js - Gestion de l'interface utilisateur

const UI = {
  currentTab: 'principal',
  character: null,
  castes: [],
  ethnies: [],
  origines: [],
  temperaments: ['Alpha', 'Bêta', 'Delta', 'Lambda'],
  destinees: [
    'Commun des Mortels',
    'Destin Honorable',
    'Marche de la Gloire',
    'Arpenteur Héroïque',
    'Dieu parmi les Hommes'
  ],
  vecus: [
    'Aucun',
    'Notable',
    'Admirable',
    'Spectaculaire',
    'Légendaire'
  ],

  // Attributs disponibles pour les origines (tous les attributs)
  originesAttributs: [
    // Corps
    { id: 'FOR', nom: 'Force', groupe: 'corps' },
    { id: 'DEX', nom: 'Dextérité', groupe: 'corps' },
    { id: 'AGI', nom: 'Agilité', groupe: 'corps' },
    { id: 'CON', nom: 'Constitution', groupe: 'corps' },
    { id: 'PER', nom: 'Perception', groupe: 'corps' },
    // Esprit
    { id: 'CHA', nom: 'Charisme', groupe: 'esprit' },
    { id: 'INT', nom: 'Intelligence', groupe: 'esprit' },
    { id: 'RUS', nom: 'Ruse', groupe: 'esprit' },
    { id: 'VOL', nom: 'Volonté', groupe: 'esprit' },
    { id: 'SAG', nom: 'Sagesse', groupe: 'esprit' },
    // Spéciaux
    { id: 'MAG', nom: 'Magie', groupe: 'special' },
    { id: 'LOG', nom: 'Logique', groupe: 'special' },
    { id: 'CHN', nom: 'Chance', groupe: 'special' },
    { id: 'EQU', nom: 'Équilibre', groupe: 'special' }
  ],

  // Sources qui n'autorisent pas les doublons
  nonDuplicateSources: ['allegeance', 'milieu', 'persona'],

  // Initialise l'interface
  init(character, castes, ethnies, origines, allegeances, milieux, personas) {
    this.character = character;
    this.castes = castes;
    this.ethnies = ethnies;
    this.origines = origines || [];
    this.allegeances = allegeances || [];
    this.milieux = milieux || [];
    this.personas = personas || [];

    this.setupTabs();
    this.setupEventListeners();
    this.setupOriginesModal();
    this.setupNaissanceModal();
    this.render();
  },

  // Configure les onglets
  setupTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tabId = e.target.dataset.tab;
        this.switchTab(tabId);
      });
    });
  },

  // Change d'onglet
  switchTab(tabId) {
    this.currentTab = tabId;

    // Met à jour les boutons
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });

    // Met à jour le contenu
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.toggle('active', content.id === `tab-${tabId}`);
    });
  },

  // Configure les écouteurs d'événements
  setupEventListeners() {
    // Export
    document.getElementById('btn-export').addEventListener('click', () => {
      Storage.exportToFile(this.character);
    });

    // Import
    document.getElementById('btn-import').addEventListener('click', () => {
      document.getElementById('file-import').click();
    });

    document.getElementById('file-import').addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (file) {
        try {
          const imported = await Storage.importFromFile(file);
          this.character = Character.valider(imported);
          this.character = Character.appliquerBonusEthnie(this.character, this.ethnies);
          Storage.save(this.character);
          this.render();
          alert('Personnage importé avec succès !');
        } catch (err) {
          alert('Erreur d\'import: ' + err.message);
        }
        e.target.value = '';
      }
    });

    // Nouveau personnage
    document.getElementById('btn-new').addEventListener('click', () => {
      if (confirm('Créer un nouveau personnage ? Les données non exportées seront perdues.')) {
        this.character = Character.create();
        Storage.save(this.character);
        this.render();
      }
    });
  },

  // Configure la modale des origines
  setupOriginesModal() {
    const modal = document.getElementById('modal-origines');
    const btnOpen = document.getElementById('btn-origines');
    const btnClose = document.getElementById('modal-close');
    const btnApply = document.getElementById('btn-apply-origines');
    const btnReset = document.getElementById('btn-reset-origines');
    const selects = document.querySelectorAll('.origin-select');

    // Initialise les selects avec les attributs (sauf race qui est filtré)
    selects.forEach(select => {
      if (!select.classList.contains('origin-race-boost') && !select.classList.contains('origin-race-deboost')) {
        this.populateOriginSelect(select);
      }
      select.addEventListener('change', (e) => {
        this.onOriginSelectChange(e.target);
      });
    });

    // Ouvrir la modale
    btnOpen.addEventListener('click', () => {
      this.loadOriginsToModal();
      this.updateRaceSelects();
      this.updateAllegeanceSelects();
      this.updateMilieuSelects();
      this.updatePersonaSelects();
      this.updateConditionalBoosts();
      modal.classList.add('active');
    });

    // Fermer la modale
    btnClose.addEventListener('click', () => {
      modal.classList.remove('active');
    });

    // Fermer en cliquant à l'extérieur
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });

    // Réinitialiser
    btnReset.addEventListener('click', () => {
      selects.forEach(select => {
        select.value = '';
        if (select.classList.contains('origin-conditional-select')) {
          select.disabled = true;
          select.closest('.origin-field').classList.remove('active');
        }
      });
      this.refreshDisabledOptions();
    });

    // Appliquer
    btnApply.addEventListener('click', () => {
      this.applyOriginsFromModal();
      modal.classList.remove('active');
    });
  },

  // Configure la modale de naissance
  setupNaissanceModal() {
    const modal = document.getElementById('modal-naissance');
    const btnOpen = document.getElementById('btn-naissance');
    const btnClose = document.getElementById('modal-naissance-close');
    const btnApply = document.getElementById('btn-apply-naissance');
    const btnReset = document.getElementById('btn-reset-naissance');

    // Attributs de naissance
    this.naissanceAttrs = ['STA', 'TAI', 'EGO', 'APP', 'CHN', 'EQU'];

    // Valeurs temporaires pour la modale
    this.naissanceTemp = {};

    // Ouvrir la modale
    btnOpen.addEventListener('click', () => {
      this.loadNaissanceToModal();
      modal.classList.add('active');
    });

    // Fermer la modale
    btnClose.addEventListener('click', () => {
      modal.classList.remove('active');
    });

    // Fermer en cliquant à l'extérieur
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });

    // Réinitialiser
    btnReset.addEventListener('click', () => {
      this.naissanceAttrs.forEach(attr => {
        this.naissanceTemp[attr] = 0;
      });
      this.renderNaissanceGrid();
      this.updateNaissanceStatus();
    });

    // Appliquer
    btnApply.addEventListener('click', () => {
      this.applyNaissanceFromModal();
      modal.classList.remove('active');
    });
  },

  // Charge les valeurs de naissance dans la modale
  loadNaissanceToModal() {
    this.naissanceAttrs.forEach(attr => {
      this.naissanceTemp[attr] = this.character.naissanceBonus?.[attr] || 0;
    });
    this.renderNaissanceGrid();
    this.updateNaissanceStatus();
  },

  // Rend la grille de naissance
  renderNaissanceGrid() {
    const grid = document.getElementById('naissance-grid');
    const ethnie = this.getCurrentEthnie();
    const defaultRange = { min: -6, max: 6 };

    grid.innerHTML = this.naissanceAttrs.map(attrId => {
      const attrData = [...DATA.attributsSecondaires, ...DATA.attributsDestin].find(a => a.id === attrId);
      const attrName = attrData ? attrData.nom : attrId;
      const range = ethnie?.naissanceRanges?.[attrId] || defaultRange;
      const value = this.naissanceTemp[attrId] || 0;
      const valueClass = value > 0 ? 'positive' : (value < 0 ? 'negative' : 'neutral');

      return `
        <div class="naissance-item" data-attr="${attrId}">
          <div class="naissance-item-header">
            <span class="naissance-item-name">${attrName}</span>
            <span class="naissance-item-range">${range.min} à ${range.max}</span>
          </div>
          <div class="naissance-item-controls">
            <button class="naissance-btn-minus" data-attr="${attrId}" ${value <= range.min ? 'disabled' : ''}>−</button>
            <span class="naissance-item-value ${valueClass}">${value >= 0 ? '+' + value : value}</span>
            <button class="naissance-btn-plus" data-attr="${attrId}" ${value >= range.max ? 'disabled' : ''}>+</button>
          </div>
        </div>
      `;
    }).join('');

    // Ajoute les événements aux boutons
    grid.querySelectorAll('.naissance-btn-minus').forEach(btn => {
      btn.addEventListener('click', () => this.adjustNaissance(btn.dataset.attr, -1));
    });
    grid.querySelectorAll('.naissance-btn-plus').forEach(btn => {
      btn.addEventListener('click', () => this.adjustNaissance(btn.dataset.attr, 1));
    });
  },

  // Ajuste une valeur de naissance
  adjustNaissance(attrId, delta) {
    const ethnie = this.getCurrentEthnie();
    const defaultRange = { min: -6, max: 6 };
    const range = ethnie?.naissanceRanges?.[attrId] || defaultRange;

    const newValue = (this.naissanceTemp[attrId] || 0) + delta;
    if (newValue >= range.min && newValue <= range.max) {
      this.naissanceTemp[attrId] = newValue;
      this.renderNaissanceGrid();
      this.updateNaissanceStatus();
    }
  },

  // Met à jour le statut de conformité
  updateNaissanceStatus() {
    const total = this.naissanceAttrs.reduce((sum, attr) => sum + (this.naissanceTemp[attr] || 0), 0);
    const isConforme = total === 0;

    const statusEl = document.getElementById('naissance-status');
    statusEl.innerHTML = `
      <span class="naissance-total">Total: ${total >= 0 ? '+' : ''}${total}</span>
      <span class="naissance-conforme ${isConforme ? 'conforme' : 'non-conforme'}">
        ${isConforme ? 'Conforme' : 'Pas conforme'}
      </span>
    `;
  },

  // Applique les valeurs de naissance
  applyNaissanceFromModal() {
    this.naissanceAttrs.forEach(attr => {
      this.character.naissanceBonus[attr] = this.naissanceTemp[attr] || 0;
    });
    Storage.save(this.character);
    this.render();
  },

  // Récupère l'ethnie actuelle
  getCurrentEthnie() {
    const ethnieNom = this.character.infos?.ethnie;
    return this.ethnies.find(e => e.nom === ethnieNom);
  },

  // Met à jour les selects de Race selon l'ethnie
  updateRaceSelects() {
    const ethnie = this.getCurrentEthnie();
    const ethnieLabel = document.querySelector('.origin-ethnie-label');

    if (ethnieLabel) {
      ethnieLabel.textContent = ethnie ? `(${ethnie.nom})` : '(Aucune ethnie sélectionnée)';
    }

    const strongAttrs = ethnie?.strongAttributes || [];
    const weakAttrs = ethnie?.weakAttributes || [];

    // Boosts de race
    document.querySelectorAll('.origin-race-boost').forEach(select => {
      const currentValue = select.value;
      select.innerHTML = '<option value="">—</option>';

      if (strongAttrs.length > 0) {
        strongAttrs.forEach(attrId => {
          const attr = this.originesAttributs.find(a => a.id === attrId);
          if (attr) {
            const option = document.createElement('option');
            option.value = attr.id;
            option.textContent = attr.nom;
            select.appendChild(option);
          }
        });
        // Restaure la valeur si elle est toujours valide
        if (strongAttrs.includes(currentValue)) {
          select.value = currentValue;
        }
      }
    });

    // Deboosts de race
    document.querySelectorAll('.origin-race-deboost').forEach(select => {
      const currentValue = select.value;
      select.innerHTML = '<option value="">—</option>';

      if (weakAttrs.length > 0) {
        weakAttrs.forEach(attrId => {
          const attr = this.originesAttributs.find(a => a.id === attrId);
          if (attr) {
            const option = document.createElement('option');
            option.value = attr.id;
            option.textContent = attr.nom;
            select.appendChild(option);
          }
        });
        // Restaure la valeur si elle est toujours valide
        if (weakAttrs.includes(currentValue)) {
          select.value = currentValue;
        }
      }
    });
  },

  // Récupère l'allégeance actuelle
  getCurrentAllegeance() {
    const nom = this.character.infos?.allegeance;
    return this.allegeances.find(a => a.nom === nom);
  },

  // Met à jour les selects d'Allégeance selon le choix
  updateAllegeanceSelects() {
    const allegeance = this.getCurrentAllegeance();
    const label = document.querySelector('.origin-allegeance-label');
    if (label) {
      label.textContent = allegeance ? `(${allegeance.nom})` : '(Non sélectionnée)';
    }

    const strongAttrs = allegeance?.strongAttributes || [];
    const weakAttrs = allegeance?.weakAttributes || [];

    // Boosts d'allégeance
    document.querySelectorAll('[data-source="allegeance"][data-type="boost"]').forEach(select => {
      const currentValue = select.value;
      select.innerHTML = '<option value="">—</option>';

      if (strongAttrs.length > 0) {
        strongAttrs.forEach(attrId => {
          const attr = this.originesAttributs.find(a => a.id === attrId);
          if (attr) {
            const option = document.createElement('option');
            option.value = attr.id;
            option.textContent = attr.nom;
            select.appendChild(option);
          }
        });
        if (strongAttrs.includes(currentValue)) {
          select.value = currentValue;
        }
      }
    });

    // Deboosts d'allégeance
    document.querySelectorAll('[data-source="allegeance"][data-type="deboost"]').forEach(select => {
      const currentValue = select.value;
      select.innerHTML = '<option value="">—</option>';

      if (weakAttrs.length > 0) {
        weakAttrs.forEach(attrId => {
          const attr = this.originesAttributs.find(a => a.id === attrId);
          if (attr) {
            const option = document.createElement('option');
            option.value = attr.id;
            option.textContent = attr.nom;
            select.appendChild(option);
          }
        });
        if (weakAttrs.includes(currentValue)) {
          select.value = currentValue;
        }
      }
    });
  },

  // Récupère le milieu actuel
  getCurrentMilieu() {
    const nom = this.character.infos?.milieu;
    return this.milieux.find(m => m.nom === nom);
  },

  // Met à jour les selects de Milieu selon le choix
  updateMilieuSelects() {
    const milieu = this.getCurrentMilieu();
    const label = document.querySelector('.origin-milieu-label');
    if (label) {
      label.textContent = milieu ? `(${milieu.nom})` : '(Non sélectionné)';
    }

    const strongAttrs = milieu?.strongAttributes || [];
    const weakAttrs = milieu?.weakAttributes || [];

    // Boosts de milieu
    document.querySelectorAll('[data-source="milieu"][data-type="boost"]').forEach(select => {
      const currentValue = select.value;
      select.innerHTML = '<option value="">—</option>';

      if (strongAttrs.length > 0) {
        strongAttrs.forEach(attrId => {
          const attr = this.originesAttributs.find(a => a.id === attrId);
          if (attr) {
            const option = document.createElement('option');
            option.value = attr.id;
            option.textContent = attr.nom;
            select.appendChild(option);
          }
        });
        if (strongAttrs.includes(currentValue)) {
          select.value = currentValue;
        }
      }
    });

    // Deboosts de milieu
    document.querySelectorAll('[data-source="milieu"][data-type="deboost"]').forEach(select => {
      const currentValue = select.value;
      select.innerHTML = '<option value="">—</option>';

      if (weakAttrs.length > 0) {
        weakAttrs.forEach(attrId => {
          const attr = this.originesAttributs.find(a => a.id === attrId);
          if (attr) {
            const option = document.createElement('option');
            option.value = attr.id;
            option.textContent = attr.nom;
            select.appendChild(option);
          }
        });
        if (weakAttrs.includes(currentValue)) {
          select.value = currentValue;
        }
      }
    });
  },

  // Récupère le persona actuel
  getCurrentPersona() {
    const nom = this.character.infos?.persona;
    return this.personas.find(p => p.nom === nom);
  },

  // Met à jour les selects de Persona selon le choix
  updatePersonaSelects() {
    const persona = this.getCurrentPersona();
    const label = document.querySelector('.origin-persona-label');
    if (label) {
      label.textContent = persona ? `(${persona.nom})` : '(Non sélectionné)';
    }

    const strongAttrs = persona?.strongAttributes || [];
    const weakAttrs = persona?.weakAttributes || [];

    // Boosts de persona
    document.querySelectorAll('[data-source="persona"][data-type="boost"]').forEach(select => {
      const currentValue = select.value;
      select.innerHTML = '<option value="">—</option>';

      if (strongAttrs.length > 0) {
        strongAttrs.forEach(attrId => {
          const attr = this.originesAttributs.find(a => a.id === attrId);
          if (attr) {
            const option = document.createElement('option');
            option.value = attr.id;
            option.textContent = attr.nom;
            select.appendChild(option);
          }
        });
        if (strongAttrs.includes(currentValue)) {
          select.value = currentValue;
        }
      }
    });

    // Deboosts de persona
    document.querySelectorAll('[data-source="persona"][data-type="deboost"]').forEach(select => {
      const currentValue = select.value;
      select.innerHTML = '<option value="">—</option>';

      if (weakAttrs.length > 0) {
        weakAttrs.forEach(attrId => {
          const attr = this.originesAttributs.find(a => a.id === attrId);
          if (attr) {
            const option = document.createElement('option');
            option.value = attr.id;
            option.textContent = attr.nom;
            select.appendChild(option);
          }
        });
        if (weakAttrs.includes(currentValue)) {
          select.value = currentValue;
        }
      }
    });
  },

  // Met à jour l'état des boosts conditionnels
  updateConditionalBoosts() {
    // Gestion générique des boosts conditionnels avec data-requires
    document.querySelectorAll('.origin-conditional-select[data-requires]').forEach(boostSelect => {
      const source = boostSelect.dataset.source;
      const requiredSlot = boostSelect.dataset.requires;
      const deboostSelect = document.querySelector(`[data-source="${source}"][data-slot="${requiredSlot}"]`);

      if (deboostSelect) {
        const hasDeboost = deboostSelect.value !== '';
        boostSelect.disabled = !hasDeboost;
        boostSelect.closest('.origin-field').classList.toggle('active', hasDeboost);
        if (!hasDeboost) {
          boostSelect.value = '';
        }
      }
    });

    // Pour Race - le boost3 nécessite n'importe quel deboost
    const raceDebost = document.querySelector('.origin-race-deboost');
    const raceConditional = document.querySelector('[data-source="race"][data-slot="boost3"]');
    if (raceDebost && raceConditional) {
      const hasRaceDeboost = raceDebost.value !== '';
      raceConditional.disabled = !hasRaceDeboost;
      raceConditional.closest('.origin-field').classList.toggle('active', hasRaceDeboost);
      if (!hasRaceDeboost) {
        raceConditional.value = '';
      }
    }

    // Pour Persona - le boost3 nécessite le deboost1
    const personaDeboost = document.querySelector('[data-source="persona"][data-slot="deboost1"]');
    const personaConditional = document.querySelector('[data-source="persona"][data-slot="boost3"]');
    if (personaDeboost && personaConditional) {
      const hasPersonaDeboost = personaDeboost.value !== '';
      personaConditional.disabled = !hasPersonaDeboost;
      personaConditional.closest('.origin-field').classList.toggle('active', hasPersonaDeboost);
      if (!hasPersonaDeboost) {
        personaConditional.value = '';
      }
    }
  },

  // Remplit un select avec les attributs
  populateOriginSelect(select) {
    select.innerHTML = '<option value="">—</option>';
    this.originesAttributs.forEach(attr => {
      const option = document.createElement('option');
      option.value = attr.id;
      option.textContent = attr.nom;
      option.dataset.groupe = attr.groupe;
      select.appendChild(option);
    });
  },

  // Quand un select d'origine change
  onOriginSelectChange(select) {
    const source = select.dataset.source;
    const type = select.dataset.type;

    // Si c'est une source sans doublons, vérifier
    if (this.nonDuplicateSources.includes(source)) {
      const chosen = select.value;
      if (chosen) {
        const otherSelects = document.querySelectorAll(`.origin-select[data-source="${source}"]`);
        const used = new Set();
        otherSelects.forEach(s => {
          if (s !== select && s.value) used.add(s.value);
        });

        if (used.has(chosen)) {
          select.value = '';
          alert('Dans cette catégorie, vous ne pouvez pas choisir deux fois le même attribut.');
        }
      }
    }

    // Met à jour les boosts conditionnels si un deboost change
    if (type === 'deboost' || select.classList.contains('origin-deboost-trigger')) {
      this.updateConditionalBoosts();
    }

    this.refreshDisabledOptions();
  },

  // Rafraîchit les options désactivées
  refreshDisabledOptions() {
    this.nonDuplicateSources.forEach(source => {
      const selects = document.querySelectorAll(`.origin-select[data-source="${source}"]`);
      const usedValues = new Set();
      selects.forEach(s => {
        if (s.value) usedValues.add(s.value);
      });

      selects.forEach(select => {
        const currentValue = select.value;
        Array.from(select.options).forEach(option => {
          if (!option.value) return; // Option vide
          const isUsedElsewhere = usedValues.has(option.value) && option.value !== currentValue;
          option.disabled = isUsedElsewhere;
        });
      });
    });
  },

  // Charge les origines du personnage dans la modale
  loadOriginsToModal() {
    const originsData = this.character.originesChoix || {};
    const selects = document.querySelectorAll('.origin-select');

    selects.forEach(select => {
      const source = select.dataset.source;
      const slot = select.dataset.slot;
      const key = `${source}_${slot}`;
      select.value = originsData[key] || '';
    });

    this.refreshDisabledOptions();
  },

  // Applique les origines depuis la modale
  applyOriginsFromModal() {
    const selects = document.querySelectorAll('.origin-select');
    const originsData = {};

    selects.forEach(select => {
      const source = select.dataset.source;
      const slot = select.dataset.slot;
      const key = `${source}_${slot}`;
      if (select.value) {
        originsData[key] = select.value;
      }
    });

    this.character.originesChoix = originsData;

    // Calcule et applique les bonus d'origines
    this.applyOriginesBonus();

    Storage.save(this.character);
    this.renderAttributs();
    this.renderRessources();
    this.renderCaracteristiques();
    this.renderMagieCaracteristiques();
    this.renderSauvegardes();
  },

  // Récupère les picks d'origines
  getOriginPicks() {
    const picks = [];
    const originsData = this.character.originesChoix || {};

    Object.entries(originsData).forEach(([key, attrId]) => {
      const [source, slot] = key.split('_');
      const type = slot.startsWith('boost') ? 'boost' : 'deboost';
      picks.push({ source, slot, type, attr: attrId });
    });

    return picks;
  },

  // Calcule les ajustements d'un attribut
  computeAdjustmentForAttribute(boostCount, deboostCount, boostCap = 4) {
    let boostValue = 0;
    if (boostCount >= 1) {
      boostValue = 2 + Math.max(0, boostCount - 1);
    }
    boostValue = Math.min(boostValue, boostCap);

    let deboostValue = 0;
    if (deboostCount >= 1) {
      deboostValue = -2 - Math.max(0, deboostCount - 1);
    }
    deboostValue = Math.max(deboostValue, -4);

    return boostValue + deboostValue;
  },

  // Calcule les bonus d'origines pour tous les attributs
  computeOriginesAdjustments() {
    const picks = this.getOriginPicks();
    const counts = {};
    const raceBoostCounts = {};

    // Initialise les compteurs
    this.originesAttributs.forEach(attr => {
      counts[attr.id] = { boost: 0, deboost: 0 };
      raceBoostCounts[attr.id] = 0;
    });

    // Compte les boosts et deboosts
    picks.forEach(pick => {
      if (!counts[pick.attr]) return;

      if (pick.type === 'boost') {
        counts[pick.attr].boost += 1;
        if (pick.source === 'race') {
          raceBoostCounts[pick.attr] += 1;
        }
      } else if (pick.type === 'deboost') {
        counts[pick.attr].deboost += 1;
      }
    });

    // Calcule les ajustements finaux
    const adjustments = {};
    this.originesAttributs.forEach(attr => {
      const { boost, deboost } = counts[attr.id];
      // Si 2+ boosts de race sur le même attribut, cap = 6
      const boostCap = raceBoostCounts[attr.id] >= 2 ? 6 : 4;
      adjustments[attr.id] = this.computeAdjustmentForAttribute(boost, deboost, boostCap);
    });

    return adjustments;
  },

  // Applique les bonus d'origines aux attributs
  applyOriginesBonus() {
    const adjustments = this.computeOriginesAdjustments();

    // Reset les bonus d'origines (on garde les bonus d'ethnie séparément)
    this.character.originesBonus = adjustments;
  },

  // Rendu complet
  render() {
    this.renderInfos();
    this.renderAttributs();
    this.renderCaste();
    this.renderXPSummary('xp-summary');
    this.renderPPSummary('pp-summary');
    this.renderTradition();
    this.renderMagieCaracteristiques();
    this.renderRessources();
    this.renderCaracteristiques();
    this.renderSauvegardes();
    this.renderCompetences();
    this.renderTraits();
    this.renderMemoire();
    this.renderStatus();
    this.renderNotes();
    this.renderConfig();
  },

  // Rendu des informations du personnage
  renderInfos() {
    const infos = this.character.infos;
    const container = document.getElementById('infos-personnage');

    container.innerHTML = `
      <div class="info-grid">
        <div class="info-field info-field-wide">
          <label>Nom</label>
          <input type="text" data-info="nom" value="${infos.nom || ''}" />
        </div>
        <div class="info-field">
          <label>Origine</label>
          <select data-info="origine">
            <option value="">-- Sélectionner --</option>
            ${this.origines.map(o => `
              <option value="${o}" ${infos.origine === o ? 'selected' : ''}>${o}</option>
            `).join('')}
          </select>
        </div>
        <div class="info-field">
          <label>Ethnie</label>
          <select data-info="ethnie">
            <option value="">-- Sélectionner --</option>
            ${this.ethnies.map(e => `
              <option value="${e.nom}" ${infos.ethnie === e.nom ? 'selected' : ''}>
                ${e.nom} (${e.origine})
              </option>
            `).join('')}
          </select>
        </div>
        <div class="info-field">
          <label>Comportement</label>
          <select data-info="comportement">
            <option value="">-- Sélectionner --</option>
            ${this.temperaments.map(t => `
              <option value="${t}" ${infos.comportement === t ? 'selected' : ''}>${t}</option>
            `).join('')}
          </select>
        </div>
        <div class="info-field">
          <label>Caractère</label>
          <select data-info="caractere">
            <option value="">-- Sélectionner --</option>
            ${this.temperaments.map(t => `
              <option value="${t}" ${infos.caractere === t ? 'selected' : ''}>${t}</option>
            `).join('')}
          </select>
        </div>
        <div class="info-field">
          <label>Destinée</label>
          <select data-info="destinee">
            <option value="">-- Sélectionner --</option>
            ${this.destinees.map(d => `
              <option value="${d}" ${infos.destinee === d ? 'selected' : ''}>${d}</option>
            `).join('')}
          </select>
        </div>
        <div class="info-field">
          <label>Vécu</label>
          <select data-info="vecu">
            <option value="">-- Sélectionner --</option>
            ${this.vecus.map(v => `
              <option value="${v}" ${infos.vecu === v ? 'selected' : ''}>${v}</option>
            `).join('')}
          </select>
        </div>
        <div class="info-field">
          <label>Nombre Fétiche</label>
          <select data-info="nombreFetiche">
            <option value="">-- Sélectionner --</option>
            ${[1, 2, 3, 4, 5, 6].map(n => `
              <option value="${n}" ${infos.nombreFetiche == n ? 'selected' : ''}>${n}</option>
            `).join('')}
          </select>
        </div>
        <div class="info-field">
          <label>Allégeance</label>
          <select data-info="allegeance">
            <option value="">-- Sélectionner --</option>
            ${this.allegeances.map(a => `
              <option value="${a.nom}" ${infos.allegeance === a.nom ? 'selected' : ''}>${a.nom}</option>
            `).join('')}
          </select>
        </div>
        <div class="info-field">
          <label>Milieu de vie</label>
          <select data-info="milieu">
            <option value="">-- Sélectionner --</option>
            ${this.milieux.map(m => `
              <option value="${m.nom}" ${infos.milieu === m.nom ? 'selected' : ''}>${m.nom}</option>
            `).join('')}
          </select>
        </div>
        <div class="info-field">
          <label>Persona</label>
          <select data-info="persona">
            <option value="">-- Sélectionner --</option>
            ${this.personas.map(p => `
              <option value="${p.nom}" ${infos.persona === p.nom ? 'selected' : ''}>${p.nom}</option>
            `).join('')}
          </select>
        </div>
      </div>
    `;

    // Événements
    container.querySelectorAll('input, select').forEach(input => {
      input.addEventListener('change', (e) => {
        const field = e.target.dataset.info;
        this.character.infos[field] = e.target.value;

        // Si l'ethnie change, mettre à jour les selects de race
        if (field === 'ethnie') {
          this.updateRaceSelects();
          // Réinitialiser les choix de race si l'ethnie change
          document.querySelectorAll('.origin-race-boost, .origin-race-deboost').forEach(select => {
            select.value = '';
          });
          this.updateConditionalBoosts();
        }

        // Si allégeance, milieu ou persona change, mettre à jour les selects correspondants
        if (field === 'allegeance') {
          this.updateAllegeanceSelects();
        }
        if (field === 'milieu') {
          this.updateMilieuSelects();
        }
        if (field === 'persona') {
          this.updatePersonaSelects();
        }

        // Si la destinée change, recalculer les PA et PP
        if (field === 'destinee') {
          this.renderAttributs();
          this.renderPPSummary('pp-summary');
          this.renderPPSummary('pp-summary-traits');
        }

        // Si le vécu change, recalculer les XP
        if (field === 'vecu') {
          this.renderXPSummary('xp-summary');
          this.renderXPSummary('xp-summary-competences');
        }

        Storage.save(this.character);
      });
    });
  },

  // Vérifie si un attribut est un attribut de caste
  isAttributCaste(attrId) {
    return this.character.caste.attribut1 === attrId || this.character.caste.attribut2 === attrId;
  },

  // Génère le HTML d'un bloc attribut avec image
  renderAttributBlock(attr, showDefenses = true) {
    const data = this.character.attributs[attr.id];
    const total = Character.getValeurTotale(this.character, attr.id);
    const mod = Character.calculerModificateur(total);
    const def = Character.calculerDefenseNormale(total);
    const choc = Character.calculerDefenseChoquee(total);
    const isCaste = this.isAttributCaste(attr.id);

    // Calcul des bonus d'origines séparés
    const bonusEthnie = data.bonus || 0;
    const bonusOrigines = (this.character.originesBonus && this.character.originesBonus[attr.id]) || 0;
    const totalOrigine = bonusEthnie + bonusOrigines;

    // Bonus de naissance (pour CHN notamment)
    const hasNaissance = ['STA', 'TAI', 'EGO', 'APP', 'CHN', 'EQU'].includes(attr.id);
    const bonusNaissance = hasNaissance ? (this.character.naissanceBonus?.[attr.id] || 0) : 0;

    // Bonus configuré (équipement, effets, etc.)
    const bonusConfig = this.character.bonusConfig?.['attr' + attr.id] || 0;

    const formatBonus = (val) => val > 0 ? '+' + val : (val < 0 ? val : '0');
    const origineClass = totalOrigine > 0 ? 'positive' : (totalOrigine < 0 ? 'negative' : '');
    const naissanceClass = bonusNaissance > 0 ? 'positive' : (bonusNaissance < 0 ? 'negative' : '');
    const bonusConfigClass = bonusConfig > 0 ? 'positive' : (bonusConfig < 0 ? 'negative' : '');

    return `
      <div class="attr-block ${isCaste ? 'attr-caste' : ''}" title="${attr.description}">
        <div class="attr-image" style="background-image: url('${attr.image}')"></div>
        <div class="attr-content">
          <div class="attr-header">
            <span class="attr-name">${attr.nom} ${isCaste ? ' ★' : ''}</span>
            <span class="attr-id">${attr.id}</span>
          </div>
          <div class="attr-details">
            <div class="attr-details-row">
              <div class="attr-row">
                <label>Base</label>
                <input type="number" class="attr-input" data-attr="${attr.id}" value="${data.base}" min="${DATA.valeurDefautPrincipal}" max="20" />
              </div>
              <div class="attr-row">
                <label>Origine</label>
                <span class="attr-bonus ${origineClass}" title="Ethnie: ${formatBonus(bonusEthnie)}, Origines: ${formatBonus(bonusOrigines)}">${formatBonus(totalOrigine)}</span>
              </div>
              ${hasNaissance ? `
              <div class="attr-row">
                <label>Naissance</label>
                <span class="attr-bonus ${naissanceClass}">${formatBonus(bonusNaissance)}</span>
              </div>
              ` : ''}
              ${bonusConfig !== 0 ? `
              <div class="attr-row">
                <label>Bonus</label>
                <span class="attr-bonus ${bonusConfigClass}">${formatBonus(bonusConfig)}</span>
              </div>
              ` : ''}
            </div>
            ${showDefenses ? `
            <div class="attr-details-row">
              <div class="attr-row">
                <label>Déf</label>
                <span class="attr-def">${def}</span>
              </div>
              <div class="attr-row">
                <label>Déf Choc</label>
                <span class="attr-choc">${choc}</span>
              </div>
            </div>
            ` : ''}
          </div>
        </div>
        <div class="attr-total">
          <span class="total-value">${total}</span>
          <span class="total-mod ${mod >= 0 ? 'positive' : 'negative'}">(${mod >= 0 ? '+' + mod : mod})</span>
        </div>
      </div>
    `;
  },

  // Génère le HTML d'un bloc attribut avec base calculée (pour Équilibre)
  renderAttributBlockCalcule(attr) {
    const baseCalculee = Character.calculerEquilibreBase(this.character);
    // Met à jour la base du personnage
    this.character.attributs[attr.id].base = baseCalculee;

    const data = this.character.attributs[attr.id];
    const bonusEthnie = data.bonus || 0;
    const bonusOrigines = (this.character.originesBonus && this.character.originesBonus[attr.id]) || 0;
    const totalOrigine = bonusEthnie + bonusOrigines;

    // Bonus de naissance pour EQU
    const bonusNaissance = this.character.naissanceBonus?.[attr.id] || 0;

    // Bonus de caste pour EQU : +1 tous les 2 rangs révolus
    const rang = this.character.caste?.rang || 0;
    const bonusCaste = Math.floor(rang / 2);

    // Bonus configuré (équipement, effets, etc.)
    const bonusConfig = this.character.bonusConfig?.['attr' + attr.id] || 0;

    // Utilise getValeurTotale pour le total (inclut tous les bonus)
    const total = Character.getValeurTotale(this.character, attr.id);
    const mod = Character.calculerModificateur(total);

    const formatBonus = (val) => val > 0 ? '+' + val : (val < 0 ? val : '0');
    const origineClass = totalOrigine > 0 ? 'positive' : (totalOrigine < 0 ? 'negative' : '');
    const naissanceClass = bonusNaissance > 0 ? 'positive' : (bonusNaissance < 0 ? 'negative' : '');
    const casteClass = bonusCaste > 0 ? 'positive' : '';
    const bonusConfigClass = bonusConfig > 0 ? 'positive' : (bonusConfig < 0 ? 'negative' : '');

    return `
      <div class="attr-block" title="${attr.description}">
        <div class="attr-image" style="background-image: url('${attr.image}')"></div>
        <div class="attr-content">
          <div class="attr-header">
            <span class="attr-name">${attr.nom}</span>
            <span class="attr-id">${attr.id}</span>
          </div>
          <div class="attr-details">
            <div class="attr-details-row">
              <div class="attr-row">
                <label>Base</label>
                <span class="attr-base-calc">${baseCalculee}</span>
              </div>
              <div class="attr-row">
                <label>Origine</label>
                <span class="attr-bonus ${origineClass}" title="Ethnie: ${formatBonus(bonusEthnie)}, Origines: ${formatBonus(bonusOrigines)}">${formatBonus(totalOrigine)}</span>
              </div>
              <div class="attr-row">
                <label>Naissance</label>
                <span class="attr-bonus ${naissanceClass}">${formatBonus(bonusNaissance)}</span>
              </div>
              <div class="attr-row">
                <label>Caste</label>
                <span class="attr-bonus ${casteClass}" title="+1 par 2 rangs révolus">${formatBonus(bonusCaste)}</span>
              </div>
              ${bonusConfig !== 0 ? `
              <div class="attr-row">
                <label>Bonus</label>
                <span class="attr-bonus ${bonusConfigClass}">${formatBonus(bonusConfig)}</span>
              </div>
              ` : ''}
            </div>
            <div class="attr-calc-info">moy(min/max principaux)</div>
          </div>
        </div>
        <div class="attr-total">
          <span class="total-value">${total}</span>
          <span class="total-mod ${mod >= 0 ? 'positive' : 'negative'}">(${mod >= 0 ? '+' + mod : mod})</span>
        </div>
      </div>
    `;
  },

  // Reset les attributs principaux à une valeur donnée
  resetAttributsPrincipaux(valeur) {
    // Corps + Esprit + MAG + LOG
    [...DATA.attributsPrincipaux, ...DATA.attributsMagiques].forEach(attr => {
      this.character.attributs[attr.id].base = valeur;
    });
    Storage.save(this.character);
    this.renderAttributs();
    this.renderRessources();
    this.renderCaracteristiques();
    this.renderMagieCaracteristiques();
    this.renderSauvegardes();
  },

  // Rendu des attributs
  renderAttributs() {
    const paUtilises = Character.calculerPAUtilises(this.character);
    const paDepart = Character.getPADepart(this.character);
    const paCaste = Character.getPACaste(this.character);
    const paTotal = Character.getPATotal(this.character);
    const paRestants = paTotal - paUtilises;

    const rangCaste = this.character.caste?.rang || 0;
    document.getElementById('pa-display').innerHTML = `
      <span class="${paRestants < 0 ? 'over-budget' : ''}">
        PA: ${paUtilises} / ${paTotal} (${paDepart}+${paCaste}) reste: ${paRestants}
      </span>
      <button type="button" class="pa-reset-btn" data-reset="7" title="Remettre les attributs principaux à 7">→ 7</button>
      <button type="button" class="pa-reset-btn" data-reset="10" title="Mettre les attributs principaux à 10">→ 10</button>
    `;

    // Événements des boutons reset
    document.querySelectorAll('.pa-reset-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const val = parseInt(e.target.dataset.reset);
        this.resetAttributsPrincipaux(val);
      });
    });

    // Attributs Corps
    const corpsContainer = document.getElementById('attributs-corps');
    corpsContainer.innerHTML = `
      <div class="attr-grid">
        ${DATA.attributsCorps.map(attr => this.renderAttributBlock(attr, true)).join('')}
      </div>
    `;

    // Attributs Esprit
    const espritContainer = document.getElementById('attributs-esprit');
    espritContainer.innerHTML = `
      <div class="attr-grid">
        ${DATA.attributsEsprit.map(attr => this.renderAttributBlock(attr, true)).join('')}
      </div>
    `;

    // Attributs Magiques (MAG, LOG avec défenses)
    const magiquesContainer = document.getElementById('attributs-magiques');
    magiquesContainer.innerHTML = `
      <div class="attr-grid">
        ${DATA.attributsMagiques.map(attr => this.renderAttributBlock(attr, true)).join('')}
      </div>
    `;

    // Attributs Destin (EQU calculé, CHN éditable)
    const destinContainer = document.getElementById('attributs-destin');
    destinContainer.innerHTML = `
      <div class="attr-grid">
        ${DATA.attributsDestin.map(attr =>
          attr.calcule
            ? this.renderAttributBlockCalcule(attr)
            : this.renderAttributBlock(attr, false)
        ).join('')}
      </div>
    `;

    // Attributs Secondaires (STA, TAI, EGO, APP - affichage sobre avec bonus de naissance)
    const secondairesContainer = document.getElementById('attributs-secondaires');
    secondairesContainer.innerHTML = `
      <div class="attr-compact-grid">
        ${DATA.attributsSecondaires.map(attr => {
          const data = this.character.attributs[attr.id];
          const total = Character.getValeurTotale(this.character, attr.id);
          const mod = Character.calculerModificateur(total);
          const naissanceBonus = this.character.naissanceBonus?.[attr.id] || 0;
          const formatNaissance = naissanceBonus > 0 ? '+' + naissanceBonus : (naissanceBonus < 0 ? naissanceBonus : '');
          const naissanceClass = naissanceBonus > 0 ? 'positive' : (naissanceBonus < 0 ? 'negative' : '');
          const bonusConfig = this.character.bonusConfig?.['attr' + attr.id] || 0;
          const formatBonus = bonusConfig > 0 ? '+' + bonusConfig : (bonusConfig < 0 ? bonusConfig : '');
          const bonusClass = bonusConfig > 0 ? 'positive' : (bonusConfig < 0 ? 'negative' : '');

          return `
            <div class="attr-compact" title="${attr.description}">
              <span class="compact-name">${attr.nom}</span>
              <input type="number" class="attr-input-compact" data-attr="${attr.id}" value="${data.base}" min="${DATA.secondaireMin}" max="${DATA.secondaireMax}" />
              <span class="compact-naissance ${naissanceClass}" title="Naissance">${formatNaissance}</span>
              ${bonusConfig !== 0 ? `<span class="compact-bonus ${bonusClass}" title="Bonus">${formatBonus}</span>` : ''}
              <span class="compact-total">${total}</span>
              <span class="compact-mod ${mod >= 0 ? 'positive' : 'negative'}">(${mod >= 0 ? '+' + mod : mod})</span>
            </div>
          `;
        }).join('')}
      </div>
    `;

    // Événements sur les inputs
    document.querySelectorAll('.attr-input, .attr-input-compact').forEach(input => {
      input.addEventListener('change', (e) => {
        const attrId = e.target.dataset.attr;
        const defaut = Character.getValeurDefaut(attrId);
        const value = parseInt(e.target.value) || defaut;
        this.character.attributs[attrId].base = value;
        Storage.save(this.character);
        this.renderAttributs();
        this.renderRessources();
        this.renderCaracteristiques();
        this.renderMagieCaracteristiques();
        this.renderSauvegardes();
      });
    });
  },

  // Rendu de la caste
  renderCaste() {
    const container = document.getElementById('caste-section');
    const casteActuelle = this.castes.find(c => c.nom === this.character.caste.nom);

    // Calculer le rang basé sur l'XP et l'aptitude
    const rangXP = Character.calculerRangCasteParXP(this.character);
    const rangAptitude = Character.calculerRangCasteParAptitude(this.character);
    const rangCalcule = Character.calculerRangCaste(this.character);
    this.character.caste.rang = rangCalcule;

    const aptitudeActuelle = Character.calculerAptitude(this.character);
    const xpTotal = Character.getXPTotal(this.character);
    const estLimiteParAptitude = rangAptitude < rangXP;
    const estLimiteParXP = rangXP < rangAptitude;

    // Récupérer les infos de progression pour aptitude et XP séparément
    const progressionAptitude = Character.getProgressionInfo(rangAptitude);
    const progressionXP = Character.getProgressionInfo(rangXP);
    const prochainAptitude = Character.getNextProgressionInfo(rangAptitude);
    const prochainXP = Character.getNextProgressionInfo(rangXP);

    // Calculer la progression aptitude
    let aptitudePct = 100;
    if (prochainAptitude) {
      const aptPourCeRang = progressionAptitude ? progressionAptitude.reqAptitude : 0;
      const aptPourProchain = prochainAptitude.reqAptitude;
      const aptDansRang = aptitudeActuelle - aptPourCeRang;
      const aptNecessaire = aptPourProchain - aptPourCeRang;
      aptitudePct = aptNecessaire > 0 ? Math.min(100, Math.floor((aptDansRang / aptNecessaire) * 100)) : 100;
    }

    // Calculer la progression XP
    let xpPct = 100;
    if (prochainXP) {
      const xpPourCeRang = progressionXP ? progressionXP.reqXp : 0;
      const xpPourProchain = prochainXP.reqXp;
      const xpDansRang = xpTotal - xpPourCeRang;
      const xpNecessaire = xpPourProchain - xpPourCeRang;
      xpPct = xpNecessaire > 0 ? Math.min(100, Math.floor((xpDansRang / xpNecessaire) * 100)) : 100;
    }

    const titreRang = Character.getProgressionInfo(rangCalcule)?.titre || 'Novice';

    container.innerHTML = `
      <div class="caste-grid">
        <div class="caste-row-top">
          <div class="caste-field caste-field-caste">
            <label>Caste</label>
            <select id="select-caste">
              <option value="">-- Sélectionner --</option>
              ${this.castes.map(c => `
                <option value="${c.nom}" ${this.character.caste.nom === c.nom ? 'selected' : ''}>
                  ${c.nom} (${c.type})
                </option>
              `).join('')}
            </select>
          </div>
          <div class="caste-field caste-field-rang">
            <label>Rang ${estLimiteParAptitude ? '<span class="rang-limite">(limité par aptitude)</span>' : estLimiteParXP ? '<span class="rang-limite">(limité par expérience)</span>' : ''}</label>
            <div class="caste-rang-display">
              <span class="caste-rang-value">${rangCalcule}</span>
              <span class="caste-rang-titre">${titreRang}</span>
            </div>
          </div>
          ${casteActuelle ? `
            <div class="caste-field caste-field-attr">
              <label>Attribut 1</label>
              <select id="select-attr1">
                ${casteActuelle.attribut1.map(a => `
                  <option value="${a}" ${this.character.caste.attribut1 === a ? 'selected' : ''}>${a}</option>
                `).join('')}
              </select>
            </div>
            <div class="caste-field caste-field-attr">
              <label>Attribut 2</label>
              <select id="select-attr2">
                ${casteActuelle.attribut2.map(a => `
                  <option value="${a}" ${this.character.caste.attribut2 === a ? 'selected' : ''}>${a}</option>
                `).join('')}
              </select>
            </div>
          ` : ''}
        </div>
        <div class="caste-row-progression">
          <div class="caste-progression-block ${estLimiteParAptitude ? 'progression-limite' : ''}">
            <div class="caste-progression-header">
              <span class="caste-progression-label">Aptitude</span>
              <span class="caste-progression-rang">Rang ${rangAptitude}</span>
              <span class="caste-progression-value">${aptitudeActuelle}${prochainAptitude ? ` / ${prochainAptitude.reqAptitude}` : ''}</span>
            </div>
            <div class="caste-progression-bar">
              <div class="caste-progression-fill ${estLimiteParAptitude ? 'fill-limite' : ''}" style="width: ${aptitudePct}%"></div>
            </div>
          </div>
          <div class="caste-progression-block ${estLimiteParXP ? 'progression-limite' : ''}">
            <div class="caste-progression-header">
              <span class="caste-progression-label">Expérience</span>
              <span class="caste-progression-rang">Rang ${rangXP}</span>
              <span class="caste-progression-value">${xpTotal}${prochainXP ? ` / ${prochainXP.reqXp}` : ''}</span>
            </div>
            <div class="caste-progression-bar">
              <div class="caste-progression-fill ${estLimiteParXP ? 'fill-limite' : ''}" style="width: ${xpPct}%"></div>
            </div>
          </div>
        </div>
        ${casteActuelle ? `
          <div class="caste-info">
            <p><strong>Domaine:</strong> ${casteActuelle.domaine}</p>
            <p><strong>Style:</strong> ${casteActuelle.style}</p>
            <p><strong>Ressources:</strong> ${casteActuelle.ressources?.join(', ') || '-'}</p>
            <p><strong>Sauvegardes Majeures:</strong> ${casteActuelle.sauvegardesMajeures?.join(', ') || '-'}</p>
            <p><strong>Sauvegardes Mineures:</strong> ${casteActuelle.sauvegardesMineures?.join(', ') || '-'}</p>
          </div>
        ` : ''}
      </div>
    `;

    // Événements
    document.getElementById('select-caste')?.addEventListener('change', (e) => {
      this.character.caste.nom = e.target.value;
      const caste = this.castes.find(c => c.nom === e.target.value);
      if (caste) {
        this.character.caste.attribut1 = caste.attribut1[0];
        this.character.caste.attribut2 = caste.attribut2[0];
      }
      Storage.save(this.character);
      this.renderCaste();
      this.renderRessources();
      this.renderSauvegardes();
    });

    document.getElementById('select-attr1')?.addEventListener('change', (e) => {
      this.character.caste.attribut1 = e.target.value;
      Storage.save(this.character);
      this.renderAttributs();
      this.renderCaste();
    });

    document.getElementById('select-attr2')?.addEventListener('change', (e) => {
      this.character.caste.attribut2 = e.target.value;
      Storage.save(this.character);
      this.renderAttributs();
      this.renderCaste();
    });
  },

  // Rendu des ressources
  renderRessources() {
    const ressources = Character.calculerRessources(this.character, this.castes);
    this.character.ressources = ressources;
    Storage.save(this.character);

    // Récupère les valeurs pour le calcul de récupération
    const sagTotal = Character.getValeurTotale(this.character, 'SAG');
    const modEqu = Character.calculerModificateur(Character.getValeurTotale(this.character, 'EQU'));

    // Récupère la caste actuelle pour vérifier les ressources de caste
    const caste = this.castes.find(c => c.nom === this.character.caste.nom);
    const rangCaste = this.character.caste.rang || 0;

    const container = document.getElementById('ressources-section');
    container.innerHTML = `
      <div class="ressources-grid">
        ${DATA.ressources.map(res => {
          const data = ressources[res.id];
          const isCasteRessource = caste && caste.ressources && caste.ressources.includes(res.id);
          // Utilise la même fonction que pour le repos long
          const recup = this.calculerRecuperationRessource(res.id, sagTotal, modEqu, caste, rangCaste);
          return `
            <div class="ressource-box ${isCasteRessource ? 'ressource-caste' : ''}">
              <div class="ressource-name">${res.icone || ''} ${res.nom}</div>
              <div class="ressource-value">${data.max}</div>
              <div class="ressource-recup">Récupération ${recup >= 0 ? '+' : ''}${recup}</div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  // Rendu des caractéristiques
  renderCaracteristiques() {
    const container = document.getElementById('caracteristiques-section');

    const allure = Character.calculerAllure(this.character);
    const deplacement = Character.calculerDeplacement(this.character);
    const sautHauteur = Math.floor(allure / 8);
    const sautLargeur = Math.floor(allure / 4);
    const resilience = Character.calculerResilience(this.character);
    const recuperation = Character.calculerRecuperation(this.character);
    const memoire = Character.calculerMemoire(this.character);
    const chargeMax = Character.calculerChargeMax(this.character);
    const encombrementMax = Character.calculerEncombrementMax(this.character);
    const poigne = Character.calculerPoigne(this.character);
    const protPhys = Character.calculerProtectionPhysique(this.character);
    const protMent = Character.calculerProtectionMentale(this.character);
    const absPhys = Character.calculerAbsorptionPhysique(this.character);
    const absMent = Character.calculerAbsorptionMentale(this.character);
    const prouesses = Character.calculerProuessesInnees(this.character);
    const moral = Character.calculerMoral(this.character);
    const perfPhys = Character.calculerPerforationPhysique(this.character);
    const perfMent = Character.calculerPerforationMentale(this.character);
    const ctrlActif = Character.calculerControleActif(this.character);
    const ctrlPassif = Character.calculerControlePassif(this.character);
    const techMax = Character.calculerTechniqueMax(this.character);
    const expPhys = Character.calculerExpertisePhysique(this.character);
    const expMent = Character.calculerExpertiseMentale(this.character);
    const precPhys = Character.calculerPrecisionPhysique(this.character);
    const precMent = Character.calculerPrecisionMentale(this.character);

    // Résiliences spécifiques
    const bonusConfig = this.character.bonusConfig || {};
    const resilPhys = resilience + (bonusConfig.resiliencePhysique || 0);
    const resilMent = resilience + (bonusConfig.resilienceMentale || 0);
    const resilMag = resilience + (bonusConfig.resilienceMagique || 0);
    const resilNerf = resilience + (bonusConfig.resilienceNerf || 0);
    const resilCorr = resilience + (bonusConfig.resilienceCorruption || 0);
    const resilFat = resilience + (bonusConfig.resilienceFatigue || 0);

    const formatMod = (val) => val >= 0 ? '+' + val : val;

    container.innerHTML = `
      <div class="caracteristiques-grid">
        <div class="carac-box">
          <span class="carac-name">Allure</span>
          <span class="carac-value">${allure}</span>
          <span class="carac-help" title="10 + mTAI + mAGI">ⓘ</span>
        </div>
        <div class="carac-box">
          <span class="carac-name">Déplacement</span>
          <span class="carac-value">${deplacement} <small>m/c</small></span>
          <span class="carac-help" title="Allure / 2">ⓘ</span>
        </div>
        <div class="carac-box">
          <span class="carac-name">Saut Hauteur</span>
          <span class="carac-value">${sautHauteur} <small>m/c</small></span>
          <span class="carac-help" title="Allure / 8">ⓘ</span>
        </div>
        <div class="carac-box">
          <span class="carac-name">Saut Largeur</span>
          <span class="carac-value">${sautLargeur} <small>m/c</small></span>
          <span class="carac-help" title="Allure / 4">ⓘ</span>
        </div>
        <div class="carac-box">
          <span class="carac-name">Résilience</span>
          <span class="carac-value">${resilience}</span>
          <span class="carac-help" title="10 + mVOL + mEQU">ⓘ</span>
          <span class="carac-help carac-help-details" title="Physique (PE temp): ${resilPhys} | Mentale (PS temp): ${resilMent} | Magique (PM temp): ${resilMag} | Nerf (Garde/Rage/Adré): ${resilNerf} | Fatigue: ${resilFat} | Corruption: ${resilCorr}">!</span>
        </div>
        <div class="carac-box">
          <span class="carac-name">Récupération</span>
          <span class="carac-value">${recuperation}</span>
          <span class="carac-help" title="5 + mSAG">ⓘ</span>
        </div>
        <div class="carac-box">
          <span class="carac-name">Mémoire</span>
          <span class="carac-value">${memoire}</span>
          <span class="carac-help" title="INT - 5">ⓘ</span>
        </div>
        <div class="carac-box">
          <span class="carac-name">Charge Max</span>
          <span class="carac-value">${chargeMax}</span>
          <span class="carac-help" title="5 + FOR + STA">ⓘ</span>
        </div>
        <div class="carac-box">
          <span class="carac-name">Encombrement Max</span>
          <span class="carac-value">${encombrementMax}</span>
          <span class="carac-help" title="5 + FOR + STA">ⓘ</span>
        </div>
        <div class="carac-box">
          <span class="carac-name">Poigne</span>
          <span class="carac-value">${poigne}</span>
          <span class="carac-help" title="FOR">ⓘ</span>
        </div>
        <div class="carac-box">
          <span class="carac-name">Prot. Physique</span>
          <span class="carac-value">${protPhys}</span>
          <span class="carac-help" title="5 + mSTA">ⓘ</span>
        </div>
        <div class="carac-box">
          <span class="carac-name">Prot. Mentale</span>
          <span class="carac-value">${protMent}</span>
          <span class="carac-help" title="5 + mEGO">ⓘ</span>
        </div>
        <div class="carac-box">
          <span class="carac-name">Abs. Physique</span>
          <span class="carac-value">${formatMod(absPhys)}</span>
          <span class="carac-help" title="mCON">ⓘ</span>
        </div>
        <div class="carac-box">
          <span class="carac-name">Abs. Mentale</span>
          <span class="carac-value">${formatMod(absMent)}</span>
          <span class="carac-help" title="mVOL">ⓘ</span>
        </div>
        <div class="carac-box">
          <span class="carac-name">Prouesses Innées</span>
          <span class="carac-value">${formatMod(prouesses)}</span>
          <span class="carac-help" title="mRUS">ⓘ</span>
        </div>
        <div class="carac-box">
          <span class="carac-name">Moral</span>
          <span class="carac-value">${formatMod(moral)}</span>
          <span class="carac-help" title="mCHA">ⓘ</span>
        </div>
        <div class="carac-box">
          <span class="carac-name">Perf. Physique</span>
          <span class="carac-value">${formatMod(perfPhys)}</span>
          <span class="carac-help" title="mPER">ⓘ</span>
        </div>
        <div class="carac-box">
          <span class="carac-name">Perf. Mentale</span>
          <span class="carac-value">${formatMod(perfMent)}</span>
          <span class="carac-help" title="mSAG">ⓘ</span>
        </div>
        <div class="carac-box">
          <span class="carac-name">Contrôle Actif</span>
          <span class="carac-value">${formatMod(ctrlActif)}</span>
          <span class="carac-help" title="mDEX">ⓘ</span>
        </div>
        <div class="carac-box">
          <span class="carac-name">Contrôle Passif</span>
          <span class="carac-value">${formatMod(ctrlPassif)}</span>
          <span class="carac-help" title="mAGI">ⓘ</span>
        </div>
        <div class="carac-box">
          <span class="carac-name">Technique Max</span>
          <span class="carac-value">${formatMod(techMax)}</span>
          <span class="carac-help" title="mINT">ⓘ</span>
        </div>
        <div class="carac-box">
          <span class="carac-name">Expertise Physique</span>
          <span class="carac-value">${formatMod(expPhys)}</span>
          <span class="carac-help" title="mDEX">ⓘ</span>
        </div>
        <div class="carac-box">
          <span class="carac-name">Expertise Mentale</span>
          <span class="carac-value">${formatMod(expMent)}</span>
          <span class="carac-help" title="mINT">ⓘ</span>
        </div>
        <div class="carac-box">
          <span class="carac-name">Précision Physique</span>
          <span class="carac-value">${formatMod(precPhys)}</span>
          <span class="carac-help" title="mDEX">ⓘ</span>
        </div>
        <div class="carac-box">
          <span class="carac-name">Précision Mentale</span>
          <span class="carac-value">${formatMod(precMent)}</span>
          <span class="carac-help" title="mINT">ⓘ</span>
        </div>
      </div>
    `;
  },

  // Rendu des sauvegardes
  renderSauvegardes() {
    const container = document.getElementById('sauvegardes-section');
    const caste = this.castes.find(c => c.nom === this.character.caste.nom);

    container.innerHTML = `
      <div class="sauvegardes-grid">
        ${DATA.sauvegardes.map(sauv => {
          const estMajeure = caste?.sauvegardesMajeures?.includes(sauv.nom);
          const estMineure = caste?.sauvegardesMineures?.includes(sauv.nom);
          const estAutre = caste && !estMajeure && !estMineure && this.character.caste.rang >= 5;
          const bonus = Character.calculerSauvegarde(this.character, sauv, caste, estMajeure, estMineure, estAutre);

          let typeClass = '';
          let typeLabel = '';
          if (estMajeure) {
            typeClass = 'majeure';
          } else if (estMineure) {
            typeClass = 'mineure';
          }

          // Affichage de l'attribut
          const attrDisplay = Array.isArray(sauv.attribut) ? sauv.attribut.join('/') : sauv.attribut;

          return `
            <div class="sauvegarde-box ${typeClass}">
              <span class="sauv-name">${sauv.nom}${typeLabel}</span>
              <span class="sauv-value">${bonus >= 0 ? '+' : ''}${bonus}</span>
              <span class="sauv-attrs">(${attrDisplay})</span>
            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  // Rendu de la tradition
  renderTradition() {
    const container = document.getElementById('tradition-section');
    if (!container) return;

    container.innerHTML = `
      <div class="tradition-field">
        <label>Tradition Magique</label>
        <select id="select-tradition">
          <option value="">-- Aucune --</option>
          ${DATA.traditions.map(t => `
            <option value="${t.id}" ${this.character.tradition === t.id ? 'selected' : ''}>
              ${t.nom} (${t.attribut})
            </option>
          `).join('')}
        </select>
      </div>
    `;

    document.getElementById('select-tradition')?.addEventListener('change', (e) => {
      this.character.tradition = e.target.value;
      Storage.save(this.character);
      this.renderRessources();
      this.renderMagieCaracteristiques();
    });
  },

  // Rendu des caractéristiques magiques
  renderMagieCaracteristiques() {
    const container = document.getElementById('magie-caracteristiques');
    if (!container) return;

    const porteeMagique = Character.calculerPorteeMagique(this.character);
    const tempsIncantation = Character.calculerTempsIncantation(this.character);
    const expertiseMagique = Character.calculerExpertiseMagique(this.character);
    const resistanceDrain = Character.calculerResistanceDrain(this.character);
    const puissanceInvocatrice = Character.calculerPuissanceInvocatrice(this.character);
    const puissanceSoinsDegats = Character.calculerPuissanceSoinsDegats(this.character);
    const puissancePositive = Character.calculerPuissancePositive(this.character);
    const puissanceNegative = Character.calculerPuissanceNegative(this.character);
    const puissanceGenerique = Character.calculerPuissanceGenerique(this.character);

    const formatMod = (val) => val >= 0 ? '+' + val : val;

    container.innerHTML = `
      <div class="magie-carac-section">
        <div class="magie-carac-row magie-puissances">
          <div class="carac-box carac-box-small">
            <span class="carac-name">Puissance Invocatrice</span>
            <span class="carac-value">${formatMod(puissanceInvocatrice)}</span>
            <span class="carac-desc">Effets d'invocation</span>
          </div>
          <div class="carac-box carac-box-small">
            <span class="carac-name">Puissance Soins/Dégâts</span>
            <span class="carac-value">${formatMod(puissanceSoinsDegats)}</span>
            <span class="carac-desc">Effets de soins/dégats/perte/gain/etc</span>
          </div>
          <div class="carac-box carac-box-small">
            <span class="carac-name">Puissance Positive</span>
            <span class="carac-value">${formatMod(puissancePositive)}</span>
            <span class="carac-desc">Enchantements positif (bénédictions)</span>
          </div>
          <div class="carac-box carac-box-small">
            <span class="carac-name">Puissance Négative</span>
            <span class="carac-value">${formatMod(puissanceNegative)}</span>
            <span class="carac-desc">Enchantements négatif (malédictions)</span>
          </div>
          <div class="carac-box carac-box-small">
            <span class="carac-name">Puissance Générique</span>
            <span class="carac-value">${formatMod(puissanceGenerique)}</span>
            <span class="carac-desc">Tous les autres effets</span>
          </div>
        </div>
        <div class="caracteristiques-grid">
          <div class="carac-box">
            <span class="carac-name">Portée Magique</span>
            <span class="carac-value">${porteeMagique} <small>m/c</small></span>
            <span class="carac-help" title="10 + mPER">ⓘ</span>
          </div>
          <div class="carac-box">
            <span class="carac-name">Temps d'Incantation</span>
            <span class="carac-value">${formatMod(-tempsIncantation)}</span>
            <span class="carac-help" title="-mDEX">ⓘ</span>
          </div>
          <div class="carac-box">
            <span class="carac-name">Expertise Magique</span>
            <span class="carac-value">${formatMod(expertiseMagique)}</span>
            <span class="carac-help" title="mAttribut Tradition">ⓘ</span>
          </div>
          <div class="carac-box">
            <span class="carac-name">Résistance au Drain</span>
            <span class="carac-value">${resistanceDrain}</span>
            <span class="carac-help" title="mAttribut Tradition">ⓘ</span>
          </div>
        </div>
      </div>
    `;
  },

  // === COMPETENCES ===

  // Rendu du bloc XP (page principale et compétences)
  renderXPSummary(containerId = 'xp-summary') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const xpDepart = Character.getXPDepart(this.character);
    const xpAcquis = this.character.xpAcquis || 0;
    const xpTotal = Character.getXPTotal(this.character);
    const xpUtilises = Character.calculerXPUtilises(this.character);
    const xpRestants = Character.calculerXPRestants(this.character);

    const vecuNom = this.character.infos?.vecu || 'Aucun';

    container.innerHTML = `
      <div class="xp-summary-box">
        <div class="xp-summary-title">Points d'Expérience</div>
        <div class="xp-summary-content">
          <div class="xp-summary-row">
            <span class="xp-label">Départ (${vecuNom})</span>
            <span class="xp-value">${xpDepart}</span>
          </div>
          <div class="xp-summary-row">
            <span class="xp-label">Acquis</span>
            <input type="number" class="xp-input" id="${containerId}-acquis" value="${xpAcquis}" min="0" />
          </div>
          <div class="xp-summary-row xp-total-row">
            <span class="xp-label">Total</span>
            <span class="xp-value">${xpTotal}</span>
          </div>
          <div class="xp-summary-row xp-rest-row ${xpRestants < 0 ? 'over-budget' : ''}">
            <span class="xp-label">Restant</span>
            <span class="xp-value xp-restant">${xpRestants} / ${xpTotal}</span>
          </div>
        </div>
      </div>
    `;

    // Event listener pour XP acquis
    const inputAcquis = document.getElementById(`${containerId}-acquis`);
    if (inputAcquis) {
      inputAcquis.addEventListener('change', (e) => {
        this.character.xpAcquis = parseInt(e.target.value) || 0;
        Storage.save(this.character);
        this.renderXPSummary('xp-summary');
        this.renderXPSummary('xp-summary-competences');
        this.renderCompetences();
        this.renderCaste();
        this.renderAttributs();
        this.renderRessources();
        this.renderSauvegardes();
        this.renderPPSummary('pp-summary');
        this.renderPPSummary('pp-summary-traits');
      });
    }
  },

  // Rendu du bloc PP (page principale et traits)
  renderPPSummary(containerId = 'pp-summary') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const ppDepart = Character.getPPDepart(this.character);
    const ppDesavantages = Character.getPPDesavantages(this.character);
    const ppCaste = Character.getPPCaste(this.character);
    const ppAcquis = Character.getPPAcquis(this.character);
    const ppTotal = Character.getPPTotal(this.character);
    const ppUtilises = Character.calculerPPUtilises(this.character);
    const ppRestants = Character.calculerPPRestants(this.character);

    const destineeNom = this.character.infos?.destinee || 'Commun des Mortels';
    const rangCaste = this.character.caste?.rang || 0;

    container.innerHTML = `
      <div class="xp-summary-box pp-summary-box">
        <div class="xp-summary-title">Points de Personnage</div>
        <div class="xp-summary-content">
          <div class="xp-summary-row">
            <span class="xp-label">Départ (${destineeNom})</span>
            <span class="xp-value">${ppDepart}</span>
          </div>
          <div class="xp-summary-row">
            <span class="xp-label">Désavantages</span>
            <span class="xp-value">${ppDesavantages}</span>
          </div>
          <div class="xp-summary-row">
            <span class="xp-label">Caste (rang ${rangCaste})</span>
            <span class="xp-value">${ppCaste}</span>
          </div>
          <div class="xp-summary-row xp-total-row">
            <span class="xp-label">Total</span>
            <span class="xp-value">${ppTotal}</span>
          </div>
          <div class="xp-summary-row xp-rest-row ${ppRestants < 0 ? 'over-budget' : ''}">
            <span class="xp-label">Restant</span>
            <span class="xp-value xp-restant">${ppRestants} / ${ppTotal}</span>
          </div>
        </div>
      </div>
    `;
  },

  // Rendu de la page compétences
  renderCompetences() {
    const container = document.getElementById('tab-competences');
    if (!container) return;

    const groupesData = typeof Competences !== 'undefined' ? Competences.get() : [];
    const maxRangGroupe = 3;
    const maxRangCompetence = 6;
    const competencesData = this.character.competences || { groupes: {}, competences: {}, attributsChoisis: {} };

    // Construction des attributs disponibles pour chaque groupe
    const getGroupeAttributs = (groupe) => {
      const attrsSet = new Set();
      groupe.competences.forEach(comp => {
        comp.attributs.forEach(attr => attrsSet.add(attr));
      });
      return Array.from(attrsSet);
    };

    container.innerHTML = `
      <!-- Bloc XP Résumé -->
      <section class="section xp-section">
        <div id="xp-summary-competences"></div>
      </section>

      <!-- Groupes de compétences -->
      <section class="section">
        <h2 class="section-title">Compétences</h2>
        <div class="competences-container">
          ${groupesData.map(groupe => {
            const groupeAttrs = getGroupeAttributs(groupe);
            const rangGroupe = competencesData.groupes?.[groupe.id] || 0;
            const prouesse = Character.calculerProuesse(this.character, groupe.id);

            return `
              <div class="groupe-block">
                <div class="groupe-header">
                  <div class="groupe-info">
                    <span class="groupe-nom">${groupe.nom}</span>
                    <span class="groupe-desc">${groupe.description || ''}</span>
                  </div>
                  <div class="groupe-stats">
                    <div class="groupe-rang">
                      <label>Rang</label>
                      <select class="groupe-rang-select" data-groupe="${groupe.id}">
                        ${Array.from({length: maxRangGroupe + 1}, (_, i) => `
                          <option value="${i}" ${rangGroupe === i ? 'selected' : ''}>${i}</option>
                        `).join('')}
                      </select>
                    </div>
                    <div class="groupe-prouesse">
                      Prouesse: ${prouesse >= 0 ? '+' : ''}${prouesse}
                    </div>
                  </div>
                </div>
                <div class="competences-list">
                  ${groupe.competences.map(comp => {
                    const rangComp = competencesData.competences?.[comp.id] || 0;
                    const attrChoisi = competencesData.attributsChoisis?.[comp.id] || comp.attributs[0];
                    const bonus = Character.calculerBonusCompetence(this.character, groupe.id, comp.id, attrChoisi);

                    return `
                      <div class="competence-item">
                        <div class="competence-main">
                          <select class="competence-attr-select" data-competence="${comp.id}">
                            ${comp.attributs.map(attr => `
                              <option value="${attr}" ${attrChoisi === attr ? 'selected' : ''}>${attr}</option>
                            `).join('')}
                          </select>
                          <span class="competence-nom">${comp.nom}</span>
                        </div>
                        <div class="competence-rang">
                          <select class="competence-rang-select" data-groupe="${groupe.id}" data-competence="${comp.id}">
                            ${Array.from({length: maxRangCompetence + 1}, (_, i) => `
                              <option value="${i}" ${rangComp === i ? 'selected' : ''}>${i}</option>
                            `).join('')}
                          </select>
                        </div>
                        <div class="competence-bonus ${bonus >= 0 ? 'positive' : 'negative'}">
                          ${bonus >= 0 ? '+' : ''}${bonus}
                        </div>
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </section>
    `;

    // Rendu du bloc XP
    this.renderXPSummary('xp-summary-competences');

    // Event listeners pour les rangs de groupes
    container.querySelectorAll('.groupe-rang-select').forEach(select => {
      select.addEventListener('change', (e) => {
        const groupeId = e.target.dataset.groupe;
        const rang = parseInt(e.target.value);
        if (!this.character.competences) {
          this.character.competences = { groupes: {}, competences: {}, attributsChoisis: {} };
        }
        if (!this.character.competences.groupes) {
          this.character.competences.groupes = {};
        }
        this.character.competences.groupes[groupeId] = rang;
        Storage.save(this.character);
        this.renderXPSummary('xp-summary');
        this.renderXPSummary('xp-summary-competences');
        this.renderCompetences();
        this.renderCaste();
      });
    });

    // Event listeners pour les rangs de compétences
    container.querySelectorAll('.competence-rang-select').forEach(select => {
      select.addEventListener('change', (e) => {
        const compId = e.target.dataset.competence;
        const rang = parseInt(e.target.value);
        if (!this.character.competences) {
          this.character.competences = { groupes: {}, competences: {}, attributsChoisis: {} };
        }
        if (!this.character.competences.competences) {
          this.character.competences.competences = {};
        }
        this.character.competences.competences[compId] = rang;
        Storage.save(this.character);
        this.renderXPSummary('xp-summary');
        this.renderXPSummary('xp-summary-competences');
        this.renderCompetences();
        this.renderCaste();
      });
    });

    // Event listeners pour les attributs choisis
    container.querySelectorAll('.competence-attr-select').forEach(select => {
      select.addEventListener('change', (e) => {
        const compId = e.target.dataset.competence;
        const attr = e.target.value;
        if (!this.character.competences) {
          this.character.competences = { groupes: {}, competences: {}, attributsChoisis: {} };
        }
        if (!this.character.competences.attributsChoisis) {
          this.character.competences.attributsChoisis = {};
        }
        this.character.competences.attributsChoisis[compId] = attr;
        Storage.save(this.character);
        this.renderCompetences();
      });
    });
  },

  // === TRAITS ===

  // État des traits dépliés
  traitsExpanded: {},

  // Génère le HTML d'une liste de traits
  renderTraitsList(traits, type, traitsDisponibles) {
    const typeLabel = type === 'avantage' ? 'Avantages Généraux' : 'Désavantages';
    const typeClass = type === 'avantage' ? 'avantages' : 'desavantages';
    const traitsFiltered = traitsDisponibles.filter(t => t.type === type);

    return `
      <div class="traits-section traits-${typeClass}">
        <h3 class="traits-section-title">${typeLabel}</h3>
        <div class="traits-list">
          ${traits.length === 0 ? `
            <div class="traits-empty">Aucun ${type}</div>
          ` : traits.map(trait => {
            const isExpanded = this.traitsExpanded[trait.id] || false;
            return `
              <div class="trait-item ${isExpanded ? 'expanded' : ''} trait-${type}" data-trait-id="${trait.id}">
                <div class="trait-header">
                  <div class="trait-info">
                    <span class="trait-nom">${trait.info.nom}</span>
                    <span class="trait-rang">[${trait.rang}]</span>
                  </div>
                  <div class="trait-controls">
                    <button class="btn-trait-toggle" data-trait-id="${trait.id}" title="${isExpanded ? 'Replier' : 'Déplier'}">
                      ${isExpanded ? '&#9650;' : '&#9660;'}
                    </button>
                    <button class="btn-trait-delete" data-trait-id="${trait.id}" title="Supprimer">&#10005;</button>
                  </div>
                </div>
                <div class="trait-content" style="display: ${isExpanded ? 'block' : 'none'}">
                  <p class="trait-description">${trait.info.description}</p>
                </div>
              </div>
            `;
          }).join('')}
        </div>
        <!-- Ajout de trait -->
        <div class="trait-add-section">
          <div class="trait-add-row">
            <select class="select-add-trait" data-type="${type}">
              <option value="">-- Ajouter un ${type} --</option>
              ${traitsFiltered.map(t => `
                <option value="${t.id}">${t.nom} (${t.coutPP} PP, max ${t.rangMax})</option>
              `).join('')}
            </select>
            <button class="btn-add-trait" data-type="${type}" title="Ajouter">+</button>
          </div>
        </div>
      </div>
    `;
  },

  // Génère le HTML des avantages de caste (basé sur CasteProgression)
  renderAvantagesCaste() {
    const rang = this.character.caste?.rang || 0;
    const progression = typeof CasteProgression !== 'undefined' ? CasteProgression.get() : [];

    // Collecter tous les avantages jusqu'au rang actuel
    const avantagesCaste = [];
    for (const level of progression) {
      if (level.rang <= rang && level.avantages) {
        level.avantages.forEach(av => {
          avantagesCaste.push({
            ...av,
            rang: level.rang
          });
        });
      }
    }

    return `
      <div class="traits-section traits-caste">
        <h3 class="traits-section-title">Avantages de Caste</h3>
        <div class="traits-list">
          ${avantagesCaste.length === 0 ? `
            <div class="traits-empty">Aucun avantage de caste (rang 0)</div>
          ` : avantagesCaste.map(av => {
            const isExpanded = this.traitsExpanded[`caste-${av.rang}-${av.nom}`] || false;
            const expandId = `caste-${av.rang}-${av.nom}`;
            return `
              <div class="trait-item ${isExpanded ? 'expanded' : ''} trait-caste" data-trait-id="${expandId}">
                <div class="trait-header">
                  <div class="trait-info">
                    <span class="trait-nom">${av.nom}</span>
                    <span class="trait-rang-caste">Rang ${av.rang}</span>
                  </div>
                  <div class="trait-controls">
                    <button class="btn-trait-toggle" data-trait-id="${expandId}" title="${isExpanded ? 'Replier' : 'Déplier'}">
                      ${isExpanded ? '&#9650;' : '&#9660;'}
                    </button>
                  </div>
                </div>
                <div class="trait-content" style="display: ${isExpanded ? 'block' : 'none'}">
                  <p class="trait-description">${av.description}</p>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  },

  // Rendu de la page traits
  renderTraits() {
    const container = document.getElementById('tab-traits');
    if (!container) return;

    const traitsData = typeof Traits !== 'undefined' ? Traits.get() : [];
    const characterTraits = this.character.traits || [];

    // Récupérer les infos complètes des traits du personnage
    const traitsAvecInfos = characterTraits.map(ct => {
      const traitInfo = traitsData.find(t => t.id === ct.id);
      return { ...ct, info: traitInfo };
    }).filter(t => t.info);

    // Séparer avantages et désavantages
    const avantages = traitsAvecInfos.filter(t => t.info.type === 'avantage');
    const desavantages = traitsAvecInfos.filter(t => t.info.type === 'desavantage');

    // Traits disponibles (non encore pris)
    const traitsDisponibles = traitsData.filter(t =>
      !characterTraits.some(ct => ct.id === t.id)
    );

    container.innerHTML = `
      <!-- Bloc PP -->
      <section class="section xp-section">
        <div id="pp-summary-traits"></div>
      </section>

      <section class="section">
        <div class="section-header">
          <h2 class="section-title">Traits du Personnage</h2>
          <div class="traits-actions">
            <button class="btn-traits-expand" id="btn-expand-all" title="Tout déplier">&#9660; Tout</button>
            <button class="btn-traits-expand" id="btn-collapse-all" title="Tout replier">&#9650; Tout</button>
          </div>
        </div>

        <div class="traits-container">
          ${this.renderTraitsList(avantages, 'avantage', traitsDisponibles)}
          ${this.renderAvantagesCaste()}
          ${this.renderTraitsList(desavantages, 'desavantage', traitsDisponibles)}
        </div>
      </section>
    `;

    // Rendu du bloc PP
    this.renderPPSummary('pp-summary-traits');

    // Event listeners
    this.setupTraitsEventListeners(container);
  },

  // Configure les événements de la page traits
  setupTraitsEventListeners(container) {
    // Bouton tout déplier
    document.getElementById('btn-expand-all')?.addEventListener('click', () => {
      const characterTraits = this.character.traits || [];
      characterTraits.forEach(t => {
        this.traitsExpanded[t.id] = true;
      });
      this.renderTraits();
    });

    // Bouton tout replier
    document.getElementById('btn-collapse-all')?.addEventListener('click', () => {
      this.traitsExpanded = {};
      this.renderTraits();
    });

    // Boutons toggle individuels
    container.querySelectorAll('.btn-trait-toggle').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const traitId = e.target.dataset.traitId;
        this.traitsExpanded[traitId] = !this.traitsExpanded[traitId];
        this.renderTraits();
      });
    });

    // Boutons supprimer
    container.querySelectorAll('.btn-trait-delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const traitId = e.target.dataset.traitId;
        const traitsData = typeof Traits !== 'undefined' ? Traits.get() : [];
        const traitInfo = traitsData.find(t => t.id === traitId);
        const traitNom = traitInfo ? traitInfo.nom : traitId;

        if (confirm(`Supprimer le trait "${traitNom}" ?`)) {
          this.character.traits = this.character.traits.filter(t => t.id !== traitId);
          delete this.traitsExpanded[traitId];
          Storage.save(this.character);
          this.renderTraits();
          this.renderPPSummary('pp-summary');
        }
      });
    });

    // Boutons ajouter (un par type)
    container.querySelectorAll('.btn-add-trait').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const type = e.target.dataset.type;
        const select = container.querySelector(`.select-add-trait[data-type="${type}"]`);
        const traitId = select?.value;
        if (!traitId) return;

        const traitsData = typeof Traits !== 'undefined' ? Traits.get() : [];
        const traitInfo = traitsData.find(t => t.id === traitId);
        if (!traitInfo) return;

        // Ajouter le trait avec rang 1
        if (!this.character.traits) this.character.traits = [];
        this.character.traits.push({ id: traitId, rang: 1 });
        Storage.save(this.character);
        this.renderTraits();
        this.renderPPSummary('pp-summary');
      });
    });
  },

  // === MEMOIRE ===

  // État des descriptions de mémoire dépliées
  memoireDescExpanded: {},

  // Rendu de la page mémoire
  renderMemoire() {
    const container = document.getElementById('tab-memoire');
    if (!container) return;

    const typesMémoire = DATA.typesMémoire || [];
    const memoireEntries = this.character.memoire || [];
    const memoireMax = Character.calculerMemoire(this.character);
    const memoireUsed = memoireEntries.length;

    // Grouper les entrées par type
    const entriesParType = {};
    typesMémoire.forEach(type => {
      entriesParType[type.id] = memoireEntries
        .map((entry, index) => ({ ...entry, index }))
        .filter(entry => entry.typeId === type.id);
    });

    container.innerHTML = `
      <section class="section">
        <div class="section-header">
          <h2 class="section-title">Mémoire</h2>
          <div class="memoire-counter ${memoireUsed > memoireMax ? 'over-budget' : ''}">
            ${memoireUsed} / ${memoireMax}
          </div>
        </div>

        <div class="memoire-container">
          ${typesMémoire.map(type => `
            <div class="memoire-section" data-type-id="${type.id}">
              <div class="memoire-section-header">
                <h3 class="memoire-section-title">${type.nom}</h3>
                <span class="memoire-section-count">(${entriesParType[type.id].length})</span>
              </div>
              <div class="memoire-list">
                ${entriesParType[type.id].length === 0 ? `
                  <div class="memoire-empty">Aucune entrée</div>
                ` : entriesParType[type.id].map(entry => {
                  const isExpanded = this.memoireDescExpanded[entry.index] || false;
                  const hasDesc = entry.description && entry.description.trim() !== '';
                  return `
                    <div class="memoire-item ${isExpanded ? 'expanded' : ''}" data-index="${entry.index}">
                      <div class="memoire-item-header">
                        <span class="memoire-nom">${entry.nom}</span>
                        <div class="memoire-item-controls">
                          <button class="btn-memoire-desc ${hasDesc ? 'has-content' : ''}" data-index="${entry.index}" title="Description">&#9998;</button>
                          <button class="btn-memoire-delete" data-index="${entry.index}" title="Supprimer">&#10005;</button>
                        </div>
                      </div>
                      ${isExpanded ? `
                        <div class="memoire-item-desc">
                          <textarea class="memoire-desc-input" data-index="${entry.index}" placeholder="Description...">${entry.description || ''}</textarea>
                        </div>
                      ` : ''}
                    </div>
                  `;
                }).join('')}
              </div>
              <div class="memoire-add">
                <input type="text" class="memoire-input" data-type-id="${type.id}" placeholder="Nouvelle entrée..." />
                <button class="btn-memoire-add" data-type-id="${type.id}" title="Ajouter">+</button>
              </div>
            </div>
          `).join('')}
        </div>
      </section>
    `;

    // Event listeners
    this.setupMemoireEventListeners(container);
  },

  // Configure les événements de la page mémoire
  setupMemoireEventListeners(container) {
    // Boutons supprimer
    container.querySelectorAll('.btn-memoire-delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        if (!this.character.memoire) return;

        const entry = this.character.memoire[index];
        if (confirm(`Supprimer "${entry.nom}" ?`)) {
          this.character.memoire.splice(index, 1);
          delete this.memoireDescExpanded[index];
          Storage.save(this.character);
          this.renderMemoire();
        }
      });
    });

    // Boutons description (toggle)
    container.querySelectorAll('.btn-memoire-desc').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        this.memoireDescExpanded[index] = !this.memoireDescExpanded[index];
        this.renderMemoire();

        // Focus sur le textarea si on vient de l'ouvrir
        if (this.memoireDescExpanded[index]) {
          setTimeout(() => {
            const textarea = container.querySelector(`.memoire-desc-input[data-index="${index}"]`);
            textarea?.focus();
          }, 10);
        }
      });
    });

    // Textarea description (sauvegarde au blur)
    container.querySelectorAll('.memoire-desc-input').forEach(textarea => {
      textarea.addEventListener('blur', (e) => {
        const index = parseInt(e.target.dataset.index);
        if (!this.character.memoire || !this.character.memoire[index]) return;

        this.character.memoire[index].description = e.target.value;
        Storage.save(this.character);
      });
    });

    // Boutons ajouter
    container.querySelectorAll('.btn-memoire-add').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const typeId = parseInt(e.target.dataset.typeId);
        const input = container.querySelector(`.memoire-input[data-type-id="${typeId}"]`);
        const nom = input?.value.trim();

        if (!nom) return;

        if (!this.character.memoire) this.character.memoire = [];
        this.character.memoire.push({ typeId, nom, description: '' });
        Storage.save(this.character);
        this.renderMemoire();
      });
    });

    // Entrée avec la touche Enter
    container.querySelectorAll('.memoire-input').forEach(input => {
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          const typeId = parseInt(input.dataset.typeId);
          const btn = container.querySelector(`.btn-memoire-add[data-type-id="${typeId}"]`);
          btn?.click();
        }
      });
    });
  },

  // === STATUS ===

  renderStatus() {
    const container = document.getElementById('tab-status');
    if (!container) return;

    const resilience = Character.calculerResilience(this.character);
    const bonusConfig = this.character.bonusConfig || {};

    // Résiliences spécifiques
    const resilPhys = resilience + (bonusConfig.resiliencePhysique || 0);
    const resilMent = resilience + (bonusConfig.resilienceMentale || 0);
    const resilMag = resilience + (bonusConfig.resilienceMagique || 0);
    const resilFat = resilience + (bonusConfig.resilienceFatigue || 0);
    const resilCorr = resilience + (bonusConfig.resilienceCorruption || 0);

    // Mapping ressource → résilience spécifique pour les temporaires
    const resilParRessource = {
      PE: resilPhys,
      PS: resilMent,
      PM: resilMag,
      PV: resilience,
      PK: resilience,
      PC: resilience
    };

    const ressourcesData = DATA.ressources;

    // S'assurer que les ressources ont la propriété temporaire
    for (const key of Object.keys(this.character.ressources)) {
      if (this.character.ressources[key].temporaire === undefined) {
        this.character.ressources[key].temporaire = 0;
      }
    }

    const recuperation = Character.calculerRecuperation(this.character);
    const equilibreTotal = Character.getValeurTotale(this.character, 'EQU');

    // Calcul des pénalités de lésions
    const lesions = this.character.lesions || [];
    const blessures = lesions.filter(l => l.type === 'blessure');
    const traumas = lesions.filter(l => l.type === 'traumatisme');
    const maxNivBlessure = blessures.length > 0
      ? Math.max(...blessures.map(l => l.max > 0 ? Math.ceil(l.actuel / l.max) : 0))
      : 0;
    const maxNivTrauma = traumas.length > 0
      ? Math.max(...traumas.map(l => l.max > 0 ? Math.ceil(l.actuel / l.max) : 0))
      : 0;

    // Calcul des pénalités de tensions (Fatigue et Corruption)
    const tensions = this.character.tensions || { fatigue: 0, corruption: 0 };
    const nivFatigue = resilFat > 0 ? Math.ceil(tensions.fatigue / resilFat) : 0;
    const nivCorruption = resilCorr > 0 ? Math.ceil(tensions.corruption / resilCorr) : 0;

    const penaliteLesions = maxNivBlessure + maxNivTrauma;
    const penaliteTensions = nivFatigue + nivCorruption;
    const penaliteTotal = penaliteLesions + penaliteTensions;

    // État de choc si PE <= 0
    const peActuel = this.character.ressources?.PE?.actuel || 0;
    const enChoc = peActuel <= 0;

    container.innerHTML = `
      <!-- Récap État -->
      <div class="status-recap-box">
        <div class="status-recap-item">
          <span class="status-recap-label">État</span>
          <span class="status-recap-value ${enChoc ? 'etat-choc' : 'etat-normal'}">${enChoc ? 'Choc' : 'Normal'}</span>
        </div>
        <div class="status-recap-item">
          <span class="status-recap-label">Pénalités</span>
          <span class="status-recap-value ${penaliteTotal > 0 ? 'has-penalty' : ''}">${penaliteTotal} <span class="status-recap-detail">(${maxNivBlessure}/${maxNivTrauma}/${nivFatigue}/${nivCorruption})</span></span>
        </div>
      </div>

      <!-- Actions -->
      <section class="section status-actions-section">
        <div class="status-actions-box">
          <div class="status-actions-group">
            <span class="status-actions-label">Combat</span>
            <button class="btn-combat" id="btn-confrontation" title="Démarre une confrontation avec Initiative et Moral">Confrontation</button>
            <button class="btn-combat" id="btn-nouveau-tour" title="Nouveau tour de combat">Nouveau Tour</button>
            <button class="btn-combat" id="btn-nouveau-round" title="Réduit l'Initiative de 10">Nouveau Round</button>
          </div>
          <div class="status-actions-group">
            <span class="status-actions-label">Scène</span>
            <button class="btn-scene" id="btn-fin-scene" title="Supprime temporaires et initiative">Fin de Scène</button>
          </div>
          <div class="status-actions-group">
            <span class="status-actions-label">Repos</span>
            <button class="btn-repos" id="btn-repos-court" title="Remet PE au minimum (EQU) et supprime les temporaires">Repos Court</button>
            <button class="btn-repos" id="btn-repos-long" title="Applique la récupération et remet PE au max">Repos Long</button>
          </div>
        </div>
      </section>

      <!-- Ressources -->
      <section class="section">
        <h2 class="section-title">Ressources</h2>
        <p class="status-info">Résilience : ${resilience} | Récupération : ${recuperation} | Équilibre : ${equilibreTotal}</p>
        <div class="status-ressources-grid">
          ${ressourcesData.map(res => {
            const ressource = this.character.ressources[res.id] || { actuel: 0, max: 0, temporaire: 0 };
            const actuel = ressource.actuel || 0;
            const max = ressource.max || 0;
            const resilTemp = resilParRessource[res.id] || resilience;
            const temporaire = Math.min(ressource.temporaire || 0, resilTemp);
            const total = max + temporaire;
            const pctActuel = total > 0 ? Math.min(100, (actuel / total) * 100) : 0;
            const pctTemp = total > 0 ? Math.min(100, (temporaire / total) * 100) : 0;

            return `
              <div class="status-ressource-box" data-ressource="${res.id}" data-resil-temp="${resilTemp}">
                <div class="status-ressource-icone">${res.icone || ''}</div>
                <div class="status-ressource-content">
                  <div class="status-ressource-header">
                    <span class="status-ressource-nom">${res.nom}</span>
                    <span class="status-ressource-valeurs">
                      ${actuel} / ${max}${temporaire > 0 ? ` <span class="status-valeur-temp">(+${temporaire})</span>` : ''}
                    </span>
                  </div>
                  <div class="status-ressource-bar-container">
                    <div class="status-ressource-bar">
                      <div class="status-ressource-bar-fill" style="width: ${pctActuel}%"></div>
                    </div>
                    ${temporaire > 0 ? `
                      <div class="status-ressource-bar-temp" style="width: ${pctTemp}%; left: ${100 - pctTemp}%"></div>
                    ` : ''}
                  </div>
                  <div class="status-ressource-controls">
                    <span class="status-control-label">Actu</span>
                    <button class="btn-status-minus" data-ressource="${res.id}" data-field="actuel">-</button>
                    <button class="btn-status-edit" data-ressource="${res.id}" data-field="actuel" data-max="${total}">${actuel}</button>
                    <button class="btn-status-plus" data-ressource="${res.id}" data-field="actuel">+</button>
                    <span class="status-separator">|</span>
                    <span class="status-control-label">Temp</span>
                    <button class="btn-status-minus" data-ressource="${res.id}" data-field="temporaire">-</button>
                    <button class="btn-status-edit" data-ressource="${res.id}" data-field="temporaire" data-max="${resilTemp}">${temporaire}</button>
                    <button class="btn-status-plus" data-ressource="${res.id}" data-field="temporaire">+</button>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </section>

      <!-- Autres Ressources -->
      <section class="section">
        <h2 class="section-title">Autres Ressources</h2>
        <div class="status-ressources-grid status-autres-grid">
          ${(this.character.autresRessources || []).map((ar, index) => {
            const resData = DATA.autresRessources.find(r => r.id === ar.id);
            if (!resData) return '';
            const isSansMax = resData.sansMax === true;
            const isTemporaire = resData.temporaire === true;
            const isAbsorption = !!resData.absorption;
            let maxEffectif;
            if (isAbsorption) {
              maxEffectif = resData.absorption === 'physique'
                ? Character.calculerAbsorptionPhysique(this.character)
                : Character.calculerAbsorptionMentale(this.character);
            } else if (isTemporaire) {
              maxEffectif = resilience;
            } else {
              maxEffectif = ar.max || 0;
            }
            const pctActuel = !isSansMax && maxEffectif > 0 ? Math.min(100, (ar.actuel / maxEffectif) * 100) : 0;
            const reposTag = resData.reposCourt ? 'Court' : 'Long';
            const reposClass = resData.reposCourt ? 'repos-court' : 'repos-long';
            const hasEditableMax = !isSansMax && !isTemporaire && !isAbsorption;
            return `
              <div class="status-ressource-box status-autre-ressource ${reposClass}" data-autre-index="${index}">
                <div class="status-ressource-icone">${resData.icone || ''}</div>
                <div class="status-ressource-content">
                  <div class="status-ressource-header">
                    <span class="status-ressource-nom">${resData.nom} <span class="status-repos-tag ${reposClass}">${reposTag}</span></span>
                    <span class="status-ressource-valeurs">${ar.actuel}${!isSansMax ? ` / ${maxEffectif}` : ''}</span>
                  </div>
                  ${!isSansMax ? `
                  <div class="status-ressource-bar-container">
                    <div class="status-ressource-bar">
                      <div class="status-ressource-bar-fill status-autre-bar" style="width: ${pctActuel}%; background: linear-gradient(90deg, ${resData.couleur} 0%, ${resData.couleur}99 100%);"></div>
                    </div>
                  </div>
                  ` : ''}
                  <div class="status-ressource-controls">
                    <span class="status-control-label">Valeur</span>
                    <button class="btn-status-minus btn-autre-minus" data-autre-index="${index}">-</button>
                    ${ar.id === 'initiative' ? `<button class="btn-status-minus btn-initiative-moins5" data-autre-index="${index}">-5</button>` : ''}
                    <button class="btn-status-edit btn-autre-edit" data-autre-index="${index}" data-max="${isSansMax ? 999 : maxEffectif}" data-sans-max="${isSansMax}">${ar.actuel}</button>
                    <button class="btn-status-plus btn-autre-plus" data-autre-index="${index}" data-sans-max="${isSansMax}" data-max="${isSansMax ? 999 : maxEffectif}">+</button>
                    ${hasEditableMax ? `
                    <span class="status-separator">|</span>
                    <span class="status-control-label">Max</span>
                    <button class="btn-status-edit btn-autre-max-edit" data-autre-index="${index}">${ar.max}</button>
                    ` : ''}
                    <button class="btn-autre-delete" data-autre-index="${index}" title="Supprimer">✕</button>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
          <!-- Carte d'ajout -->
          <div class="status-ressource-box status-autre-add">
            <div class="status-autre-add-content">
              <select class="select-autre-ressource" id="select-autre-ressource">
                <option value="">-- Ajouter --</option>
                ${DATA.autresRessources.filter(ar =>
                  !(this.character.autresRessources || []).some(cr => cr.id === ar.id)
                ).map(ar => `
                  <option value="${ar.id}">${ar.icone} ${ar.nom} (${ar.reposCourt ? 'Court' : 'Long'})</option>
                `).join('')}
              </select>
              <button class="btn-autre-add" id="btn-autre-add" title="Ajouter">+</button>
            </div>
          </div>
        </div>
      </section>

      <!-- Lésions -->
      <section class="section">
        <h2 class="section-title">Lésions</h2>
        <div class="status-ressources-grid status-lesions-grid">
          ${(this.character.lesions || []).map((lesion, index) => {
            const lesionData = DATA.typesLesions.find(l => l.id === lesion.type);
            if (!lesionData) return '';
            const pctActuel = lesion.max > 0 ? Math.min(100, (lesion.actuel / lesion.max) * 100) : 0;
            const niveauGravite = lesion.max > 0 ? Math.ceil(lesion.actuel / lesion.max) : 0;
            const gravite = DATA.gravites.find(g => g.niveau === Math.min(niveauGravite, 5)) || DATA.gravites[0];
            return `
              <div class="status-ressource-box status-lesion" data-lesion-index="${index}">
                <div class="status-ressource-icone">${lesionData.icone || ''}</div>
                <div class="status-ressource-content">
                  <div class="status-ressource-header">
                    <span class="status-ressource-nom">${lesionData.nom} <span class="status-lesion-gravite" style="color: ${gravite.couleur};">${gravite.nom}</span></span>
                    <span class="status-ressource-valeurs">${lesion.actuel} / ${lesion.max}</span>
                  </div>
                  <div class="status-ressource-bar-container">
                    <div class="status-ressource-bar">
                      <div class="status-ressource-bar-fill" style="width: ${pctActuel}%; background: linear-gradient(90deg, ${gravite.couleur} 0%, ${gravite.couleur}99 100%);"></div>
                    </div>
                  </div>
                  <div class="status-ressource-controls">
                    <span class="status-control-label">Valeur</span>
                    <button class="btn-status-minus btn-lesion-minus" data-lesion-index="${index}">-</button>
                    <button class="btn-status-edit btn-lesion-edit" data-lesion-index="${index}" data-max="${lesion.max}">${lesion.actuel}</button>
                    <button class="btn-status-plus btn-lesion-plus" data-lesion-index="${index}">+</button>
                    <button class="btn-lesion-delete" data-lesion-index="${index}" title="Supprimer">✕</button>
                    <span class="status-lesion-niveau" style="color: ${gravite.couleur};">Nv ${niveauGravite}</span>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
          <!-- Carte d'ajout -->
          <div class="status-ressource-box status-lesion-add">
            <div class="status-lesion-add-content">
              <select class="select-lesion" id="select-lesion">
                <option value="">-- Type --</option>
                ${DATA.typesLesions.map(l => {
                  const protection = l.protection === 'physique'
                    ? Character.calculerProtectionPhysique(this.character)
                    : Character.calculerProtectionMentale(this.character);
                  return `<option value="${l.id}" data-max="${protection}">${l.icone} ${l.nom} (max: ${protection})</option>`;
                }).join('')}
              </select>
              <input type="number" class="input-lesion-valeur" id="input-lesion-valeur" min="1" placeholder="Valeur" title="Valeur initiale">
              <button class="btn-lesion-add" id="btn-lesion-add" title="Ajouter">+</button>
            </div>
          </div>
        </div>
      </section>

      <!-- Conditions -->
      <section class="section">
        <h2 class="section-title">Conditions</h2>
        <div class="status-ressources-grid status-conditions-grid">
          ${(this.character.conditions || []).map((cond, index) => {
            const condData = DATA.conditions.find(c => c.id === cond.id);
            if (!condData) return '';
            const typeClass = condData.type === 'physique' ? 'type-physique' : 'type-mentale';
            const typeLabel = condData.type === 'physique' ? 'Phys' : 'Ment';
            return `
              <div class="status-ressource-box status-condition ${typeClass} ${cond.avancee ? 'condition-avancee' : ''}" data-condition-index="${index}">
                <div class="status-ressource-icone">${condData.icone || ''}</div>
                <div class="status-ressource-content">
                  <div class="status-ressource-header">
                    <span class="status-ressource-nom">${condData.nom} ${cond.avancee ? '<span class="condition-avancee-tag">Avancée</span>' : ''}</span>
                    <span class="status-condition-type ${typeClass}">${typeLabel}</span>
                  </div>
                  <div class="status-condition-effets">${condData.effets}</div>
                  <div class="status-ressource-controls">
                    <span class="status-control-label">Charges</span>
                    <button class="btn-status-minus btn-condition-minus" data-condition-index="${index}">-</button>
                    <button class="btn-status-edit btn-condition-edit" data-condition-index="${index}">${cond.charges}</button>
                    <button class="btn-status-plus btn-condition-plus" data-condition-index="${index}">+</button>
                    <label class="condition-avancee-toggle" title="Avancée">
                      <input type="checkbox" class="condition-avancee-checkbox" data-condition-index="${index}" ${cond.avancee ? 'checked' : ''}>
                      <span class="condition-avancee-label">Av.</span>
                    </label>
                    <button class="btn-condition-delete" data-condition-index="${index}" title="Supprimer">✕</button>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
          <!-- Carte d'ajout -->
          <div class="status-ressource-box status-condition-add">
            <div class="status-condition-add-content">
              <select class="select-condition" id="select-condition">
                <option value="">-- Condition --</option>
                ${DATA.conditions.map(c => {
                  const typeLabel = c.type === 'physique' ? '🏃' : '🧠';
                  return `<option value="${c.id}">${typeLabel} ${c.nom}</option>`;
                }).join('')}
              </select>
              <input type="number" class="input-condition-charges" id="input-condition-charges" min="1" value="10" placeholder="Charges" title="Charges initiales">
              <button class="btn-condition-add" id="btn-condition-add" title="Ajouter">+</button>
            </div>
          </div>
        </div>
      </section>

      <!-- Tensions -->
      <section class="section">
        <h2 class="section-title">Tensions</h2>
        <div class="status-ressources-grid status-lesions-grid">
          ${this.renderTensionCard('fatigue', 'Fatigue', '😫', tensions.fatigue, resilFat, nivFatigue)}
          ${this.renderTensionCard('corruption', 'Corruption', '💀', tensions.corruption, resilCorr, nivCorruption)}
        </div>
      </section>
    `;

    // Event listeners pour ressources principales
    container.querySelectorAll('.btn-status-minus:not(.btn-autre-minus)').forEach(btn => {
      btn.addEventListener('click', () => {
        const resId = btn.dataset.ressource;
        const field = btn.dataset.field;
        const ressource = this.character.ressources[resId];
        if (ressource[field] > 0) {
          ressource[field]--;
          Storage.save(this.character);
          this.renderStatus();
        }
      });
    });

    container.querySelectorAll('.btn-status-plus:not(.btn-autre-plus)').forEach(btn => {
      btn.addEventListener('click', () => {
        const resId = btn.dataset.ressource;
        const field = btn.dataset.field;
        const ressource = this.character.ressources[resId];
        const box = btn.closest('.status-ressource-box');
        const resilTemp = parseInt(box?.dataset.resilTemp) || resilience;
        const maxVal = field === 'temporaire' ? resilTemp : ressource.max + (ressource.temporaire || 0);
        if (ressource[field] < maxVal) {
          ressource[field]++;
          Storage.save(this.character);
          this.renderStatus();
        }
      });
    });

    container.querySelectorAll('.btn-status-edit:not(.btn-autre-edit):not(.btn-autre-max-edit)').forEach(btn => {
      btn.addEventListener('click', () => {
        const resId = btn.dataset.ressource;
        const field = btn.dataset.field;
        const maxVal = parseInt(btn.dataset.max) || 0;
        const ressource = this.character.ressources[resId];
        const currentVal = ressource[field] || 0;

        this.showStatusEditModal(resId, field, currentVal, maxVal, resilience);
      });
    });

    // Event listeners pour autres ressources
    container.querySelectorAll('.btn-autre-minus').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.dataset.autreIndex);
        const ar = this.character.autresRessources[index];
        if (ar && ar.actuel > 0) {
          ar.actuel--;
          Storage.save(this.character);
          this.renderStatus();
        }
      });
    });

    container.querySelectorAll('.btn-initiative-moins5').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.dataset.autreIndex);
        const ar = this.character.autresRessources[index];
        if (ar) {
          ar.actuel = Math.max(0, ar.actuel - 5);
          Storage.save(this.character);
          this.renderStatus();
        }
      });
    });

    container.querySelectorAll('.btn-autre-plus').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.dataset.autreIndex);
        const ar = this.character.autresRessources[index];
        const resData = DATA.autresRessources.find(r => r.id === ar?.id);
        if (ar) {
          const isSansMax = resData?.sansMax === true;
          const isTemporaire = resData?.temporaire === true;
          const isAbsorption = !!resData?.absorption;
          let maxEffectif;
          if (isSansMax) {
            maxEffectif = 999;
          } else if (isAbsorption) {
            maxEffectif = resData.absorption === 'physique'
              ? Character.calculerAbsorptionPhysique(this.character)
              : Character.calculerAbsorptionMentale(this.character);
          } else if (isTemporaire) {
            maxEffectif = resilience;
          } else {
            maxEffectif = ar.max;
          }
          if (ar.actuel < maxEffectif) {
            ar.actuel++;
            Storage.save(this.character);
            this.renderStatus();
          }
        }
      });
    });

    container.querySelectorAll('.btn-autre-edit').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.dataset.autreIndex);
        const ar = this.character.autresRessources[index];
        const resData = DATA.autresRessources.find(r => r.id === ar?.id);
        if (ar) {
          const isSansMax = resData?.sansMax === true;
          const isTemporaire = resData?.temporaire === true;
          const isAbsorption = !!resData?.absorption;
          let maxEffectif;
          if (isSansMax) {
            maxEffectif = 999;
          } else if (isAbsorption) {
            maxEffectif = resData.absorption === 'physique'
              ? Character.calculerAbsorptionPhysique(this.character)
              : Character.calculerAbsorptionMentale(this.character);
          } else if (isTemporaire) {
            maxEffectif = resilience;
          } else {
            maxEffectif = ar.max;
          }
          this.showAutreRessourceEditModal(index, 'actuel', ar.actuel, maxEffectif, isSansMax);
        }
      });
    });

    container.querySelectorAll('.btn-autre-max-edit').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.dataset.autreIndex);
        const ar = this.character.autresRessources[index];
        if (ar) {
          this.showAutreRessourceEditModal(index, 'max', ar.max, 99);
        }
      });
    });

    container.querySelectorAll('.btn-autre-delete').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.dataset.autreIndex);
        this.character.autresRessources.splice(index, 1);
        Storage.save(this.character);
        this.renderStatus();
      });
    });

    document.getElementById('btn-autre-add')?.addEventListener('click', () => {
      const select = document.getElementById('select-autre-ressource');
      const id = select?.value;
      if (id) {
        if (!this.character.autresRessources) this.character.autresRessources = [];
        this.character.autresRessources.push({ id, actuel: 0, max: 10 });
        Storage.save(this.character);
        this.renderStatus();
      }
    });

    // Event listeners pour lésions
    container.querySelectorAll('.btn-lesion-minus').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.dataset.lesionIndex);
        const lesion = this.character.lesions[index];
        if (lesion && lesion.actuel > 0) {
          lesion.actuel--;
          // Supprimer si actuel atteint 0
          if (lesion.actuel <= 0) {
            this.character.lesions.splice(index, 1);
          }
          Storage.save(this.character);
          this.renderStatus();
        }
      });
    });

    container.querySelectorAll('.btn-lesion-plus').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.dataset.lesionIndex);
        const lesion = this.character.lesions[index];
        if (lesion) {
          lesion.actuel++;
          Storage.save(this.character);
          this.renderStatus();
        }
      });
    });

    container.querySelectorAll('.btn-lesion-edit').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.dataset.lesionIndex);
        const lesion = this.character.lesions[index];
        if (lesion) {
          this.showLesionEditModal(index, lesion.actuel, lesion.max);
        }
      });
    });

    container.querySelectorAll('.btn-lesion-delete').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.dataset.lesionIndex);
        this.character.lesions.splice(index, 1);
        Storage.save(this.character);
        this.renderStatus();
      });
    });

    // Mise à jour de la valeur par défaut quand on change le type de lésion
    document.getElementById('select-lesion')?.addEventListener('change', (e) => {
      const input = document.getElementById('input-lesion-valeur');
      const selectedOption = e.target.selectedOptions[0];
      if (input && selectedOption) {
        const maxVal = selectedOption.dataset.max || '';
        input.value = maxVal; // Valeur par défaut = protection, mais pas de limite max
      }
    });

    document.getElementById('btn-lesion-add')?.addEventListener('click', () => {
      const select = document.getElementById('select-lesion');
      const input = document.getElementById('input-lesion-valeur');
      const type = select?.value;
      if (type) {
        const lesionData = DATA.typesLesions.find(l => l.id === type);
        const protection = lesionData.protection === 'physique'
          ? Character.calculerProtectionPhysique(this.character)
          : Character.calculerProtectionMentale(this.character);
        let valeur = parseInt(input?.value) || protection;
        valeur = Math.max(1, valeur); // Minimum 1, pas de maximum
        if (!this.character.lesions) this.character.lesions = [];
        this.character.lesions.push({ type, actuel: valeur, max: protection });
        Storage.save(this.character);
        this.renderStatus();
      }
    });

    // Event listeners pour conditions
    container.querySelectorAll('.btn-condition-minus').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.dataset.conditionIndex);
        const cond = this.character.conditions[index];
        if (cond && cond.charges > 0) {
          cond.charges--;
          if (cond.charges <= 0) {
            this.character.conditions.splice(index, 1);
          }
          Storage.save(this.character);
          this.renderStatus();
        }
      });
    });

    container.querySelectorAll('.btn-condition-plus').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.dataset.conditionIndex);
        const cond = this.character.conditions[index];
        if (cond) {
          cond.charges++;
          Storage.save(this.character);
          this.renderStatus();
        }
      });
    });

    container.querySelectorAll('.btn-condition-edit').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.dataset.conditionIndex);
        const cond = this.character.conditions[index];
        if (cond) {
          this.showConditionEditModal(index, cond.charges);
        }
      });
    });

    container.querySelectorAll('.condition-avancee-checkbox').forEach(cb => {
      cb.addEventListener('change', () => {
        const index = parseInt(cb.dataset.conditionIndex);
        const cond = this.character.conditions[index];
        if (cond) {
          cond.avancee = cb.checked;
          Storage.save(this.character);
          this.renderStatus();
        }
      });
    });

    container.querySelectorAll('.btn-condition-delete').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.dataset.conditionIndex);
        this.character.conditions.splice(index, 1);
        Storage.save(this.character);
        this.renderStatus();
      });
    });

    document.getElementById('btn-condition-add')?.addEventListener('click', () => {
      const select = document.getElementById('select-condition');
      const input = document.getElementById('input-condition-charges');
      const id = select?.value;
      if (id) {
        let charges = parseInt(input?.value) || 10;
        charges = Math.max(1, charges);
        if (!this.character.conditions) this.character.conditions = [];
        this.character.conditions.push({ id, charges, avancee: false });
        Storage.save(this.character);
        this.renderStatus();
      }
    });

    // Boutons de combat
    document.getElementById('btn-confrontation')?.addEventListener('click', () => {
      this.showConfrontationModal();
    });

    document.getElementById('btn-nouveau-tour')?.addEventListener('click', () => {
      this.appliquerNouveauTour();
    });

    document.getElementById('btn-nouveau-round')?.addEventListener('click', () => {
      this.appliquerNouveauRound();
    });

    // Bouton fin de scène
    document.getElementById('btn-fin-scene')?.addEventListener('click', () => {
      this.appliquerFinDeScene();
    });

    // Boutons de repos
    document.getElementById('btn-repos-court')?.addEventListener('click', () => {
      this.showReposConfirmModal('court', equilibreTotal, recuperation);
    });

    document.getElementById('btn-repos-long')?.addEventListener('click', () => {
      this.showReposConfirmModal('long', equilibreTotal, recuperation);
    });

    // Event listeners pour tensions
    container.querySelectorAll('.btn-tension-minus').forEach(btn => {
      btn.addEventListener('click', () => {
        const tensionId = btn.dataset.tension;
        if (!this.character.tensions) this.character.tensions = { fatigue: 0, corruption: 0 };
        this.character.tensions[tensionId] = Math.max(0, (this.character.tensions[tensionId] || 0) - 1);
        Storage.save(this.character);
        this.renderStatus();
      });
    });

    container.querySelectorAll('.btn-tension-plus').forEach(btn => {
      btn.addEventListener('click', () => {
        const tensionId = btn.dataset.tension;
        if (!this.character.tensions) this.character.tensions = { fatigue: 0, corruption: 0 };
        this.character.tensions[tensionId] = (this.character.tensions[tensionId] || 0) + 1;
        Storage.save(this.character);
        this.renderStatus();
      });
    });

    container.querySelectorAll('.btn-tension-edit').forEach(btn => {
      btn.addEventListener('click', () => {
        const tensionId = btn.dataset.tension;
        this.showTensionEditModal(tensionId);
      });
    });
  },

  renderTensionCard(id, nom, icone, actuel, max, niveau) {
    const gravite = DATA.gravites.find(g => g.niveau === Math.min(niveau, 5)) || DATA.gravites[0];
    const pct = max > 0 ? Math.min((actuel / max) * 100, 100) : 0;

    return `
      <div class="status-ressource-box status-lesion status-tension" data-tension="${id}">
        <div class="status-ressource-icone">${icone}</div>
        <div class="status-ressource-content">
          <div class="status-ressource-header">
            <span class="status-ressource-nom">${nom} <span class="status-lesion-gravite" style="color: ${gravite.couleur};">${gravite.nom}</span></span>
            <span class="status-ressource-valeurs">${actuel} / ${max}</span>
          </div>
          <div class="status-ressource-bar-container">
            <div class="status-ressource-bar">
              <div class="status-ressource-bar-fill" style="width: ${pct}%; background: linear-gradient(90deg, ${gravite.couleur} 0%, ${gravite.couleur}99 100%);"></div>
            </div>
          </div>
          <div class="status-ressource-controls">
            <span class="status-control-label">Valeur</span>
            <button class="btn-status-minus btn-tension-minus" data-tension="${id}">-</button>
            <button class="btn-status-edit btn-tension-edit" data-tension="${id}">${actuel}</button>
            <button class="btn-status-plus btn-tension-plus" data-tension="${id}">+</button>
            <span class="status-lesion-niveau" style="color: ${gravite.couleur};">Nv ${niveau}</span>
          </div>
        </div>
      </div>
    `;
  },

  showTensionEditModal(tensionId) {
    const existingModal = document.querySelector('.status-edit-modal');
    if (existingModal) existingModal.remove();

    if (!this.character.tensions) this.character.tensions = { fatigue: 0, corruption: 0 };
    const actuel = this.character.tensions[tensionId] || 0;
    const nom = tensionId === 'fatigue' ? 'Fatigue' : 'Corruption';

    const modal = document.createElement('div');
    modal.className = 'status-edit-modal';
    modal.innerHTML = `
      <div class="status-edit-modal-content">
        <div class="status-edit-modal-header">
          <span>Modifier ${nom}</span>
          <button class="status-edit-modal-close">&times;</button>
        </div>
        <div class="status-edit-modal-body">
          <input type="number" class="status-edit-input" id="input-tension-value" value="${actuel}" min="0" autofocus>
        </div>
        <div class="status-edit-modal-footer">
          <button class="btn-repos-confirm" id="btn-tension-confirm">OK</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const input = modal.querySelector('#input-tension-value');
    const closeBtn = modal.querySelector('.status-edit-modal-close');
    const confirmBtn = modal.querySelector('#btn-tension-confirm');

    input.focus();
    input.select();

    const applyValue = () => {
      const val = Math.max(0, parseInt(input.value) || 0);
      this.character.tensions[tensionId] = val;
      Storage.save(this.character);
      modal.remove();
      this.renderStatus();
    };

    confirmBtn.addEventListener('click', applyValue);
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') applyValue();
    });
    closeBtn.addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });
  },

  appliquerNouveauTour() {
    // Affiche une popup pour saisir l'initiative
    this.showNouveauTourModal();
  },

  showNouveauTourModal() {
    const existingModal = document.querySelector('.status-edit-modal');
    if (existingModal) existingModal.remove();

    const absPhysique = Character.calculerAbsorptionPhysique(this.character);
    const absMentale = Character.calculerAbsorptionMentale(this.character);

    const modal = document.createElement('div');
    modal.className = 'status-edit-modal';
    modal.innerHTML = `
      <div class="status-edit-modal-content">
        <div class="status-edit-modal-header">
          <span>Nouveau Tour</span>
          <button class="status-edit-modal-close">&times;</button>
        </div>
        <div class="status-edit-modal-body" style="flex-direction: column; gap: 15px;">
          <p class="repos-description">Entrez le résultat de votre jet d'Initiative.</p>
          <div style="display: flex; align-items: center; gap: 10px;">
            <span>Initiative :</span>
            <input type="number" class="status-edit-input" id="input-initiative-tour" value="10" min="0" autofocus>
          </div>
          <p class="repos-description" style="font-size: 0.8rem; color: var(--color-text-light);">
            Armure Physique : ${absPhysique} | Armure Mentale : ${absMentale}
          </p>
        </div>
        <div class="status-edit-modal-footer repos-footer">
          <button class="btn-repos-cancel">Annuler</button>
          <button class="btn-repos-confirm">Démarrer</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const input = modal.querySelector('#input-initiative-tour');
    const closeBtn = modal.querySelector('.status-edit-modal-close');
    const cancelBtn = modal.querySelector('.btn-repos-cancel');
    const confirmBtn = modal.querySelector('.btn-repos-confirm');

    input.focus();
    input.select();

    const applyNouveauTour = () => {
      const initiative = parseInt(input.value) || 0;

      // Initialise les autres ressources si nécessaire
      if (!this.character.autresRessources) this.character.autresRessources = [];

      // Supprime les anciennes armures et initiative si présentes
      this.character.autresRessources = this.character.autresRessources.filter(
        ar => !['armure_physique', 'armure_mentale', 'initiative'].includes(ar.id)
      );

      // Ajoute les ressources de combat au début (dans l'ordre inverse pour unshift)
      // Ajoute Initiative
      if (initiative > 0) {
        this.character.autresRessources.unshift({
          id: 'initiative',
          actuel: initiative
        });
      }

      // Ajoute Armure Mentale (si absorption > 0)
      if (absMentale > 0) {
        this.character.autresRessources.unshift({
          id: 'armure_mentale',
          actuel: absMentale
        });
      }

      // Ajoute Armure Physique (si absorption > 0)
      if (absPhysique > 0) {
        this.character.autresRessources.unshift({
          id: 'armure_physique',
          actuel: absPhysique
        });
      }

      // Réduit les conditions selon leur type
      if (this.character.conditions && this.character.conditions.length > 0) {
        const sagTotal = Character.getValeurTotale(this.character, 'SAG');
        const modEqu = Character.calculerModificateur(Character.getValeurTotale(this.character, 'EQU'));
        const caste = this.castes.find(c => c.nom === this.character.caste.nom);
        const rangCaste = this.character.caste.rang || 0;

        const recupPV = this.calculerRecuperationRessource('PV', sagTotal, modEqu, caste, rangCaste);
        const recupPS = this.calculerRecuperationRessource('PS', sagTotal, modEqu, caste, rangCaste);

        this.character.conditions = this.character.conditions.filter(cond => {
          const condData = DATA.conditions.find(c => c.id === cond.id);
          if (!condData) return false;

          const recup = condData.type === 'physique' ? recupPV : recupPS;
          cond.charges -= recup;

          return cond.charges > 0;
        });
      }

      Storage.save(this.character);
      modal.remove();
      this.renderStatus();
    };

    confirmBtn.addEventListener('click', applyNouveauTour);

    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') applyNouveauTour();
    });

    cancelBtn.addEventListener('click', () => modal.remove());
    closeBtn.addEventListener('click', () => modal.remove());

    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });
  },

  showConfrontationModal() {
    const existingModal = document.querySelector('.status-edit-modal');
    if (existingModal) existingModal.remove();

    const absPhysique = Character.calculerAbsorptionPhysique(this.character);
    const absMentale = Character.calculerAbsorptionMentale(this.character);
    const resilience = Character.calculerResilience(this.character);

    const modal = document.createElement('div');
    modal.className = 'status-edit-modal';
    modal.innerHTML = `
      <div class="status-edit-modal-content">
        <div class="status-edit-modal-header">
          <span>Début de Confrontation</span>
          <button class="status-edit-modal-close">&times;</button>
        </div>
        <div class="status-edit-modal-body" style="flex-direction: column; gap: 15px;">
          <p class="repos-description">Entrez vos résultats de jets d'Initiative et de Moral.</p>
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="min-width: 80px;">Initiative :</span>
            <input type="number" class="status-edit-input" id="input-confrontation-initiative" value="10" min="0" autofocus>
          </div>
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="min-width: 80px;">Moral :</span>
            <input type="number" class="status-edit-input" id="input-confrontation-moral" value="10" min="0" max="${resilience}">
            <small style="color: var(--color-text-muted);">max: ${resilience}</small>
          </div>
          <p class="repos-description" style="font-size: 0.8rem; color: var(--color-text-light);">
            Armure Physique : ${absPhysique} | Armure Mentale : ${absMentale}
          </p>
        </div>
        <div class="status-edit-modal-footer repos-footer">
          <button class="btn-repos-cancel">Annuler</button>
          <button class="btn-repos-confirm">Démarrer</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const inputInitiative = modal.querySelector('#input-confrontation-initiative');
    const inputMoral = modal.querySelector('#input-confrontation-moral');
    const closeBtn = modal.querySelector('.status-edit-modal-close');
    const cancelBtn = modal.querySelector('.btn-repos-cancel');
    const confirmBtn = modal.querySelector('.btn-repos-confirm');

    inputInitiative.focus();
    inputInitiative.select();

    const applyConfrontation = () => {
      const initiative = parseInt(inputInitiative.value) || 0;
      const moral = Math.min(parseInt(inputMoral.value) || 0, resilience);

      // Initialise les autres ressources si nécessaire
      if (!this.character.autresRessources) this.character.autresRessources = [];

      // Supprime les anciennes armures, initiative et moral si présentes
      this.character.autresRessources = this.character.autresRessources.filter(
        ar => !['armure_physique', 'armure_mentale', 'initiative', 'moral'].includes(ar.id)
      );

      // Ajoute les ressources de combat au début (dans l'ordre inverse pour unshift)
      // Ajoute Moral
      if (moral > 0) {
        this.character.autresRessources.unshift({
          id: 'moral',
          actuel: moral,
          max: resilience
        });
      }

      // Ajoute Initiative
      if (initiative > 0) {
        this.character.autresRessources.unshift({
          id: 'initiative',
          actuel: initiative
        });
      }

      // Ajoute Armure Mentale (si absorption > 0)
      if (absMentale > 0) {
        this.character.autresRessources.unshift({
          id: 'armure_mentale',
          actuel: absMentale
        });
      }

      // Ajoute Armure Physique (si absorption > 0)
      if (absPhysique > 0) {
        this.character.autresRessources.unshift({
          id: 'armure_physique',
          actuel: absPhysique
        });
      }

      Storage.save(this.character);
      modal.remove();
      this.renderStatus();
    };

    confirmBtn.addEventListener('click', applyConfrontation);

    inputInitiative.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') inputMoral.focus();
    });

    inputMoral.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') applyConfrontation();
    });

    cancelBtn.addEventListener('click', () => modal.remove());
    closeBtn.addEventListener('click', () => modal.remove());

    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });
  },

  appliquerNouveauRound() {
    // Réduit l'initiative de 10
    if (this.character.autresRessources) {
      const initiative = this.character.autresRessources.find(ar => ar.id === 'initiative');
      if (initiative) {
        initiative.actuel = Math.max(0, initiative.actuel - 10);
        // Si l'initiative tombe à 0, on la supprime
        if (initiative.actuel <= 0) {
          this.character.autresRessources = this.character.autresRessources.filter(ar => ar.id !== 'initiative');
        }
      }
    }
    Storage.save(this.character);
    this.renderStatus();
  },

  appliquerFinDeScene() {
    // Supprime tous les temporaires des ressources principales
    for (const key of Object.keys(this.character.ressources)) {
      this.character.ressources[key].temporaire = 0;
    }

    // Supprime l'initiative et les armures
    if (this.character.autresRessources) {
      this.character.autresRessources = this.character.autresRessources.filter(
        ar => !['armure_physique', 'armure_mentale', 'initiative'].includes(ar.id)
      );
    }

    Storage.save(this.character);
    this.renderStatus();
  },

  showReposConfirmModal(type, equilibreTotal, recuperation) {
    const existingModal = document.querySelector('.status-edit-modal');
    if (existingModal) existingModal.remove();

    const isCourtType = type === 'court';
    const titre = isCourtType ? 'Repos Court' : 'Repos Long';
    const description = isCourtType
      ? `Remet l'Endurance au minimum (${equilibreTotal}) et supprime tous les points temporaires.`
      : `Applique la récupération à chaque ressource (bonus pour ressources de caste), remet l'Endurance au maximum, réduit la Fatigue (récup PE) et la Corruption (récup normale).`;

    const modal = document.createElement('div');
    modal.className = 'status-edit-modal';
    modal.innerHTML = `
      <div class="status-edit-modal-content">
        <div class="status-edit-modal-header">
          <span>${titre}</span>
          <button class="status-edit-modal-close">&times;</button>
        </div>
        <div class="status-edit-modal-body">
          <p class="repos-description">${description}</p>
        </div>
        <div class="status-edit-modal-footer repos-footer">
          <button class="btn-repos-cancel">Annuler</button>
          <button class="btn-repos-confirm">Confirmer</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const closeBtn = modal.querySelector('.status-edit-modal-close');
    const cancelBtn = modal.querySelector('.btn-repos-cancel');
    const confirmBtn = modal.querySelector('.btn-repos-confirm');

    const closeModal = () => modal.remove();

    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    confirmBtn.addEventListener('click', () => {
      if (isCourtType) {
        this.appliquerReposCourt(equilibreTotal);
      } else {
        this.appliquerReposLong(recuperation);
      }
      closeModal();
    });
  },

  appliquerReposCourt(equilibreTotal) {
    // Remet PE au minimum (équilibre total)
    const pe = this.character.ressources['PE'];
    if (pe) {
      pe.actuel = Math.max(pe.actuel, equilibreTotal);
      if (pe.actuel > pe.max) pe.actuel = pe.max;
    }

    // Supprime tous les temporaires
    for (const key of Object.keys(this.character.ressources)) {
      this.character.ressources[key].temporaire = 0;
    }

    // Supprime les autres ressources qui se nettoient au repos court
    if (this.character.autresRessources) {
      this.character.autresRessources = this.character.autresRessources.filter(ar => {
        const resData = DATA.autresRessources.find(r => r.id === ar.id);
        return resData && resData.reposCourt === false;
      });
    }

    Storage.save(this.character);
    this.renderStatus();
  },

  appliquerReposLong(recuperationBase) {
    // Calcul de la récupération par ressource (bonus caste)
    const sagTotal = Character.getValeurTotale(this.character, 'SAG');
    const modEqu = Character.calculerModificateur(Character.getValeurTotale(this.character, 'EQU'));
    const caste = this.castes.find(c => c.nom === this.character.caste.nom);
    const rangCaste = this.character.caste.rang || 0;

    // Applique la récupération à chaque ressource
    DATA.ressources.forEach(resData => {
      const res = this.character.ressources[resData.id];
      if (!res) return;

      const recup = this.calculerRecuperationRessource(resData.id, sagTotal, modEqu, caste, rangCaste);
      res.actuel = Math.min(res.actuel + recup, res.max);
    });

    // Remet PE au maximum
    const pe = this.character.ressources['PE'];
    if (pe) {
      pe.actuel = pe.max;
    }

    // Supprime les autres ressources
    this.character.autresRessources = [];

    // Récupération des lésions
    if (this.character.lesions && this.character.lesions.length > 0) {
      // Calcule la récup PV et PS pour les lésions
      const recupPV = this.calculerRecuperationRessource('PV', sagTotal, modEqu, caste, rangCaste);
      const recupPS = this.calculerRecuperationRessource('PS', sagTotal, modEqu, caste, rangCaste);

      // Réduit chaque lésion selon son type
      this.character.lesions = this.character.lesions.filter(lesion => {
        const lesionData = DATA.typesLesions.find(l => l.id === lesion.type);
        if (!lesionData) return false;

        const recup = lesionData.ressource === 'PV' ? recupPV : recupPS;
        lesion.actuel -= recup;

        // Garde la lésion seulement si elle a encore des points
        return lesion.actuel > 0;
      });
    }

    // Récupération des tensions
    if (!this.character.tensions) this.character.tensions = { fatigue: 0, corruption: 0 };
    const recupPE = this.calculerRecuperationRessource('PE', sagTotal, modEqu, caste, rangCaste);
    // Fatigue réduite de la récupération PE
    this.character.tensions.fatigue = Math.max(0, this.character.tensions.fatigue - recupPE);
    // Corruption réduite de la récupération normale
    this.character.tensions.corruption = Math.max(0, this.character.tensions.corruption - recuperationBase);

    Storage.save(this.character);
    this.renderStatus();
  },

  calculerRecuperationRessource(resId, sagTotal, modEqu, caste, rangCaste) {
    // Récupération de base (utilise Character.calculerRecuperation qui inclut bonusConfig.recuperation)
    const baseRecup = Character.calculerRecuperation(this.character);

    // Bonus spécifique à la ressource (bonusConfig.recuperationPV, etc.)
    const bonusKey = 'recuperation' + resId;
    const bonusRessource = this.character.bonusConfig?.[bonusKey] || 0;

    // Bonus de caste : +1 par rang impair (1, 3, 5, 7...) si ressource de caste
    const isCasteRessource = caste && caste.ressources && caste.ressources.includes(resId);
    const bonusCaste = isCasteRessource ? Math.ceil(rangCaste / 2) : 0;

    return baseRecup + bonusRessource + bonusCaste;
  },

  showStatusEditModal(resId, field, currentVal, maxVal, resilience) {
    // Supprimer modale existante si présente
    const existingModal = document.querySelector('.status-edit-modal');
    if (existingModal) existingModal.remove();

    const fieldLabel = field === 'actuel' ? 'Actuel' : 'Temporaire';
    const resData = DATA.ressources.find(r => r.id === resId);
    const resNom = resData ? resData.nom : resId;

    const modal = document.createElement('div');
    modal.className = 'status-edit-modal';
    modal.innerHTML = `
      <div class="status-edit-modal-content">
        <div class="status-edit-modal-header">
          <span>${resNom} - ${fieldLabel}</span>
          <button class="status-edit-modal-close">&times;</button>
        </div>
        <div class="status-edit-modal-body">
          <input type="number" class="status-edit-input" value="${currentVal}" min="0" max="${maxVal}" autofocus>
          <span class="status-edit-max">/ ${maxVal}</span>
        </div>
        <div class="status-edit-modal-footer">
          <button class="btn-status-edit-confirm">OK</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const input = modal.querySelector('.status-edit-input');
    const closeBtn = modal.querySelector('.status-edit-modal-close');
    const confirmBtn = modal.querySelector('.btn-status-edit-confirm');

    // Focus et sélection
    input.focus();
    input.select();

    const applyValue = () => {
      let val = parseInt(input.value) || 0;
      val = Math.max(0, Math.min(val, maxVal));
      this.character.ressources[resId][field] = val;
      Storage.save(this.character);
      modal.remove();
      this.renderStatus();
    };

    confirmBtn.addEventListener('click', applyValue);

    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') applyValue();
    });

    closeBtn.addEventListener('click', () => modal.remove());

    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });
  },

  showAutreRessourceEditModal(index, field, currentVal, maxVal, isSansMax = false) {
    const existingModal = document.querySelector('.status-edit-modal');
    if (existingModal) existingModal.remove();

    const ar = this.character.autresRessources[index];
    const resData = DATA.autresRessources.find(r => r.id === ar.id);
    const fieldLabel = field === 'actuel' ? 'Valeur' : 'Maximum';

    const modal = document.createElement('div');
    modal.className = 'status-edit-modal';
    modal.innerHTML = `
      <div class="status-edit-modal-content">
        <div class="status-edit-modal-header">
          <span>${resData?.nom || ar.id} - ${fieldLabel}</span>
          <button class="status-edit-modal-close">&times;</button>
        </div>
        <div class="status-edit-modal-body">
          <input type="number" class="status-edit-input" value="${currentVal}" min="0" ${!isSansMax ? `max="${maxVal}"` : ''} autofocus>
          ${field === 'actuel' && !isSansMax ? `<span class="status-edit-max">/ ${maxVal}</span>` : ''}
        </div>
        <div class="status-edit-modal-footer">
          <button class="btn-status-edit-confirm">OK</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const input = modal.querySelector('.status-edit-input');
    const closeBtn = modal.querySelector('.status-edit-modal-close');
    const confirmBtn = modal.querySelector('.btn-status-edit-confirm');

    input.focus();
    input.select();

    const applyValue = () => {
      let val = parseInt(input.value) || 0;
      val = Math.max(0, isSansMax ? val : Math.min(val, maxVal));
      this.character.autresRessources[index][field] = val;
      // Si on modifie le max et que actuel > max, ajuster actuel
      if (field === 'max' && this.character.autresRessources[index].actuel > val) {
        this.character.autresRessources[index].actuel = val;
      }
      Storage.save(this.character);
      modal.remove();
      this.renderStatus();
    };

    confirmBtn.addEventListener('click', applyValue);

    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') applyValue();
    });

    closeBtn.addEventListener('click', () => modal.remove());

    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });
  },

  showLesionEditModal(index, currentVal, maxVal) {
    const existingModal = document.querySelector('.status-edit-modal');
    if (existingModal) existingModal.remove();

    const lesion = this.character.lesions[index];
    const lesionData = DATA.typesLesions.find(l => l.id === lesion.type);

    const modal = document.createElement('div');
    modal.className = 'status-edit-modal';
    modal.innerHTML = `
      <div class="status-edit-modal-content">
        <div class="status-edit-modal-header">
          <span>${lesionData?.nom || lesion.type} - Valeur</span>
          <button class="status-edit-modal-close">&times;</button>
        </div>
        <div class="status-edit-modal-body">
          <input type="number" class="status-edit-input" value="${currentVal}" min="0" autofocus>
          <span class="status-edit-max">/ ${maxVal}</span>
        </div>
        <div class="status-edit-modal-footer">
          <button class="btn-status-edit-confirm">OK</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const input = modal.querySelector('.status-edit-input');
    const closeBtn = modal.querySelector('.status-edit-modal-close');
    const confirmBtn = modal.querySelector('.btn-status-edit-confirm');

    input.focus();
    input.select();

    const applyValue = () => {
      let val = parseInt(input.value) || 0;
      val = Math.max(0, val);
      this.character.lesions[index].actuel = val;
      // Si la lésion tombe à 0, la supprimer
      if (val <= 0) {
        this.character.lesions.splice(index, 1);
      }
      Storage.save(this.character);
      modal.remove();
      this.renderStatus();
    };

    confirmBtn.addEventListener('click', applyValue);

    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') applyValue();
    });

    closeBtn.addEventListener('click', () => modal.remove());

    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });
  },

  showConditionEditModal(index, currentVal) {
    const existingModal = document.querySelector('.status-edit-modal');
    if (existingModal) existingModal.remove();

    const cond = this.character.conditions[index];
    const condData = DATA.conditions.find(c => c.id === cond.id);

    const modal = document.createElement('div');
    modal.className = 'status-edit-modal';
    modal.innerHTML = `
      <div class="status-edit-modal-content">
        <div class="status-edit-modal-header">
          <span>${condData?.nom || cond.id} - Charges</span>
          <button class="status-edit-modal-close">&times;</button>
        </div>
        <div class="status-edit-modal-body">
          <input type="number" class="status-edit-input" value="${currentVal}" min="0" autofocus>
        </div>
        <div class="status-edit-modal-footer">
          <button class="btn-status-edit-confirm">OK</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const input = modal.querySelector('.status-edit-input');
    const closeBtn = modal.querySelector('.status-edit-modal-close');
    const confirmBtn = modal.querySelector('.btn-status-edit-confirm');

    input.focus();
    input.select();

    const applyValue = () => {
      let val = parseInt(input.value) || 0;
      val = Math.max(0, val);
      this.character.conditions[index].charges = val;
      if (val <= 0) {
        this.character.conditions.splice(index, 1);
      }
      Storage.save(this.character);
      modal.remove();
      this.renderStatus();
    };

    confirmBtn.addEventListener('click', applyValue);

    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') applyValue();
    });

    closeBtn.addEventListener('click', () => modal.remove());

    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });
  },

  // === NOTES ===

  renderNotes() {
    const container = document.getElementById('tab-notes');
    if (!container) return;

    // Migration : convertit l'ancien format objet en array
    if (this.character.notes && !Array.isArray(this.character.notes)) {
      const oldNotes = this.character.notes;
      const newNotes = [];
      if (oldNotes.note1) newNotes.push({ titre: 'Note 1', contenu: oldNotes.note1 });
      if (oldNotes.note2) newNotes.push({ titre: 'Note 2', contenu: oldNotes.note2 });
      if (oldNotes.note3) newNotes.push({ titre: 'Note 3', contenu: oldNotes.note3 });
      this.character.notes = newNotes;
      Storage.save(this.character);
    }

    // Initialise notes si absent
    if (!this.character.notes) {
      this.character.notes = [];
    }

    const notes = this.character.notes;

    const notesHtml = notes.map((note, index) => `
      <div class="note-block" data-index="${index}">
        <div class="note-header">
          <input type="text" class="note-titre" data-index="${index}" value="${note.titre || ''}" placeholder="Titre de la note..." />
          <button class="note-delete" data-index="${index}" title="Supprimer cette note">&times;</button>
        </div>
        <textarea class="note-textarea" data-index="${index}" placeholder="Écrivez vos notes ici...">${note.contenu || ''}</textarea>
      </div>
    `).join('');

    container.innerHTML = `
      <section class="section notes-section">
        <h2 class="section-title">Notes</h2>
        <div class="notes-container">
          ${notesHtml}
          <button class="note-add-btn" id="btn-add-note">
            <span class="note-add-icon">+</span>
            <span class="note-add-text">Ajouter une note</span>
          </button>
        </div>
      </section>
    `;

    // Événement ajout de note
    document.getElementById('btn-add-note')?.addEventListener('click', () => {
      this.character.notes.push({ titre: '', contenu: '' });
      Storage.save(this.character);
      this.renderNotes();
      // Focus sur le titre de la nouvelle note
      const lastTitre = container.querySelector('.note-block:last-of-type .note-titre');
      if (lastTitre) lastTitre.focus();
    });

    // Événements de sauvegarde automatique pour les titres
    container.querySelectorAll('.note-titre').forEach(input => {
      input.addEventListener('input', (e) => {
        const index = parseInt(e.target.dataset.index);
        this.character.notes[index].titre = e.target.value;
        Storage.save(this.character);
      });
    });

    // Événements de sauvegarde automatique pour les contenus
    container.querySelectorAll('.note-textarea').forEach(textarea => {
      textarea.addEventListener('input', (e) => {
        const index = parseInt(e.target.dataset.index);
        this.character.notes[index].contenu = e.target.value;
        Storage.save(this.character);
      });
    });

    // Événements de suppression
    container.querySelectorAll('.note-delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        if (confirm('Supprimer cette note ?')) {
          this.character.notes.splice(index, 1);
          Storage.save(this.character);
          this.renderNotes();
        }
      });
    });
  },

  // === CONFIG ===

  renderConfig() {
    const container = document.getElementById('tab-config');
    if (!container) return;

    // Initialise bonusConfig si absent ou incomplet
    const defaultBonus = {
      allure: 0, resilience: 0, encombrement: 0,
      protectionPhysique: 0, protectionMentale: 0,
      absorptionPhysique: 0, absorptionMentale: 0,
      recuperation: 0, recuperationPV: 0, recuperationPS: 0,
      recuperationPE: 0, recuperationPM: 0, recuperationPK: 0, recuperationPC: 0,
      memoire: 0, chargeMax: 0, poigne: 0, prouessesInnees: 0,
      moral: 0, perfPhysique: 0, perfMentale: 0,
      controleActif: 0, controlePassif: 0, techniqueMax: 0, expertisePhysique: 0, expertiseMentale: 0, precisionPhysique: 0, precisionMentale: 0,
      porteeMagique: 0, tempsIncantation: 0, expertiseMagique: 0, resistanceDrain: 0,
      puissanceInvocatrice: 0, puissanceSoinsDegats: 0, puissancePositive: 0, puissanceNegative: 0, puissanceGenerique: 0,
      maxPV: 0, maxPS: 0, maxPE: 0, maxPM: 0, maxPK: 0, maxPC: 0,
      attrFOR: 0, attrDEX: 0, attrAGI: 0, attrCON: 0, attrPER: 0,
      attrCHA: 0, attrINT: 0, attrRUS: 0, attrVOL: 0, attrSAG: 0,
      attrMAG: 0, attrLOG: 0, attrCHN: 0,
      attrSTA: 0, attrTAI: 0, attrEGO: 0, attrAPP: 0
    };
    this.character.bonusConfig = { ...defaultBonus, ...this.character.bonusConfig };

    const bonusConfig = this.character.bonusConfig;
    const caracKeys = ['allure', 'resilience', 'encombrement', 'protectionPhysique', 'protectionMentale',
      'absorptionPhysique', 'absorptionMentale', 'recuperation', 'recuperationPV', 'recuperationPS',
      'recuperationPE', 'recuperationPM', 'recuperationPK', 'recuperationPC', 'memoire', 'chargeMax',
      'poigne', 'prouessesInnees', 'moral', 'perfPhysique', 'perfMentale', 'controleActif', 'controlePassif', 'techniqueMax'];
    const maxKeys = ['maxPV', 'maxPS', 'maxPE', 'maxPM', 'maxPK', 'maxPC'];
    const attrKeys = ['attrFOR', 'attrDEX', 'attrAGI', 'attrCON', 'attrPER',
      'attrCHA', 'attrINT', 'attrRUS', 'attrVOL', 'attrSAG',
      'attrMAG', 'attrLOG', 'attrCHN', 'attrSTA', 'attrTAI', 'attrEGO', 'attrAPP'];

    const hasCaracBonus = caracKeys.some(k => bonusConfig[k] !== 0);
    const hasMaxBonus = maxKeys.some(k => bonusConfig[k] !== 0);
    const hasAttrBonus = attrKeys.some(k => bonusConfig[k] !== 0);

    container.innerHTML = `
      <section class="section">
        <h2 class="section-title">Configuration</h2>
        <div class="config-content">
          <div class="config-option">
            <div class="config-option-header">
              <span class="config-option-label">Bonus aux attributs</span>
              ${hasAttrBonus ? '<span class="config-bonus-active">Actif</span>' : ''}
            </div>
            <p class="config-option-desc">Ajustez les bonus/malus aux attributs (équipement, effets, etc.)</p>
            <button class="btn-config" id="btn-config-attr">Configurer les attributs</button>
          </div>
          <div class="config-option">
            <div class="config-option-header">
              <span class="config-option-label">Bonus aux caractéristiques</span>
              ${hasCaracBonus ? '<span class="config-bonus-active">Actif</span>' : ''}
            </div>
            <p class="config-option-desc">Ajustez les bonus/malus aux caractéristiques calculées</p>
            <button class="btn-config" id="btn-config-bonus">Configurer les bonus</button>
          </div>
          <div class="config-option">
            <div class="config-option-header">
              <span class="config-option-label">Bonus aux ressources max</span>
              ${hasMaxBonus ? '<span class="config-bonus-active">Actif</span>' : ''}
            </div>
            <p class="config-option-desc">Ajustez les bonus/malus aux maximums des ressources</p>
            <button class="btn-config" id="btn-config-max">Configurer les max</button>
          </div>
        </div>
      </section>
    `;

    document.getElementById('btn-config-attr')?.addEventListener('click', () => {
      this.showAttributsConfigModal();
    });

    document.getElementById('btn-config-bonus')?.addEventListener('click', () => {
      this.showBonusConfigModal();
    });

    document.getElementById('btn-config-max')?.addEventListener('click', () => {
      this.showMaxConfigModal();
    });
  },

  showBonusConfigModal() {
    const existingModal = document.querySelector('.status-edit-modal');
    if (existingModal) existingModal.remove();

    const bonusConfig = this.character.bonusConfig || {};

    const bonusFields = [
      // Général
      { id: 'allure', nom: 'Allure', desc: 'Vitesse de déplacement', section: 'Général' },
      { id: 'resilience', nom: 'Résilience', desc: 'Résistance aux effets' },
      { id: 'encombrement', nom: 'Encombrement Max', desc: 'Capacité de charge' },
      { id: 'chargeMax', nom: 'Charge Max', desc: 'Poids transportable' },
      { id: 'memoire', nom: 'Mémoire', desc: 'Capacité de mémorisation' },
      // Combat
      { id: 'protectionPhysique', nom: 'Protection Physique', desc: 'Seuil de blessure', section: 'Combat' },
      { id: 'protectionMentale', nom: 'Protection Mentale', desc: 'Seuil de trauma' },
      { id: 'absorptionPhysique', nom: 'Absorption Physique', desc: 'Réduction dégâts physiques' },
      { id: 'absorptionMentale', nom: 'Absorption Mentale', desc: 'Réduction dégâts mentaux' },
      { id: 'poigne', nom: 'Poigne', desc: 'Force de préhension' },
      { id: 'prouessesInnees', nom: 'Prouesses Innées', desc: 'Capacités naturelles' },
      { id: 'moral', nom: 'Moral', desc: 'Force mentale' },
      { id: 'perfPhysique', nom: 'Perf. Physique', desc: 'Perforation physique' },
      { id: 'perfMentale', nom: 'Perf. Mentale', desc: 'Perforation mentale' },
      { id: 'controleActif', nom: 'Contrôle Actif', desc: 'Précision active' },
      { id: 'controlePassif', nom: 'Contrôle Passif', desc: 'Esquive passive' },
      { id: 'techniqueMax', nom: 'Technique Max', desc: 'Maîtrise technique' },
      { id: 'expertisePhysique', nom: 'Expertise Physique', desc: 'Maîtrise physique (mDEX)' },
      { id: 'expertiseMentale', nom: 'Expertise Mentale', desc: 'Maîtrise mentale (mINT)' },
      { id: 'precisionPhysique', nom: 'Précision Physique', desc: 'Précision physique (mDEX)' },
      { id: 'precisionMentale', nom: 'Précision Mentale', desc: 'Précision mentale (mINT)' },
      // Magie
      { id: 'porteeMagique', nom: 'Portée Magique', desc: 'Distance des sorts', section: 'Magie' },
      { id: 'tempsIncantation', nom: 'Temps Incantation', desc: 'Réduction temps de lancement' },
      { id: 'expertiseMagique', nom: 'Expertise Magique', desc: 'Maîtrise (mAttr Tradition)' },
      { id: 'resistanceDrain', nom: 'Résist. Drain', desc: 'Résistance (mAttr Tradition)' },
      { id: 'puissanceInvocatrice', nom: 'Puiss. Invocatrice', desc: 'Invocation (mCHA)' },
      { id: 'puissanceSoinsDegats', nom: 'Puiss. Soins/Dégâts', desc: 'Soins et dégâts (mVOL)' },
      { id: 'puissancePositive', nom: 'Puiss. Positive', desc: 'Effets positifs (mSAG)' },
      { id: 'puissanceNegative', nom: 'Puiss. Négative', desc: 'Effets négatifs (mRUS)' },
      { id: 'puissanceGenerique', nom: 'Puiss. Générique', desc: 'Effets génériques (mINT)' },
      // Résiliences spécifiques
      { id: 'resiliencePhysique', nom: 'Résil. Physique', desc: 'PE temporaires', section: 'Résiliences' },
      { id: 'resilienceMentale', nom: 'Résil. Mentale', desc: 'PS temporaires' },
      { id: 'resilienceMagique', nom: 'Résil. Magique', desc: 'PM temporaires' },
      { id: 'resilienceNerf', nom: 'Résil. Nerf', desc: 'Garde, Rage, Adrénaline' },
      { id: 'resilienceCorruption', nom: 'Résil. Corruption', desc: 'Max Corruption' },
      { id: 'resilienceFatigue', nom: 'Résil. Fatigue', desc: 'Max Fatigue' },
      // Récupération
      { id: 'recuperation', nom: 'Récupération', desc: 'Récupération globale', section: 'Récupération' },
      { id: 'recuperationPV', nom: 'Récup. PV', desc: 'Bonus récupération Vitalité' },
      { id: 'recuperationPS', nom: 'Récup. PS', desc: 'Bonus récupération Spiritualité' },
      { id: 'recuperationPE', nom: 'Récup. PE', desc: 'Bonus récupération Endurance' },
      { id: 'recuperationPM', nom: 'Récup. PM', desc: 'Bonus récupération Mana' },
      { id: 'recuperationPK', nom: 'Récup. PK', desc: 'Bonus récupération Karma' },
      { id: 'recuperationPC', nom: 'Récup. PC', desc: 'Bonus récupération Chi' }
    ];

    // Générer le HTML avec sections
    let currentSection = '';
    const gridHtml = bonusFields.map(field => {
      let sectionHtml = '';
      if (field.section && field.section !== currentSection) {
        currentSection = field.section;
        sectionHtml = `<div class="config-bonus-section">${field.section}</div>`;
      }
      return `${sectionHtml}
        <div class="config-bonus-row">
          <span class="config-bonus-nom">${field.nom}</span>
          <input type="number" class="config-bonus-input" data-bonus-id="${field.id}" value="${bonusConfig[field.id] || 0}">
        </div>`;
    }).join('');

    const modal = document.createElement('div');
    modal.className = 'status-edit-modal';
    modal.innerHTML = `
      <div class="status-edit-modal-content config-modal-content">
        <div class="status-edit-modal-header">
          <span>Configurer les bonus</span>
          <button class="status-edit-modal-close">&times;</button>
        </div>
        <div class="status-edit-modal-body config-modal-body">
          <div class="config-bonus-grid">
            ${gridHtml}
          </div>
        </div>
        <div class="status-edit-modal-footer repos-footer">
          <button class="btn-repos-cancel" id="btn-bonus-reset">Réinitialiser</button>
          <button class="btn-repos-confirm" id="btn-bonus-apply">Appliquer</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const closeBtn = modal.querySelector('.status-edit-modal-close');
    const resetBtn = modal.querySelector('#btn-bonus-reset');
    const applyBtn = modal.querySelector('#btn-bonus-apply');

    const applyBonus = () => {
      modal.querySelectorAll('.config-bonus-input').forEach(input => {
        const id = input.dataset.bonusId;
        const val = parseInt(input.value) || 0;
        this.character.bonusConfig[id] = val;
      });
      Storage.save(this.character);
      modal.remove();
      this.render();
    };

    const resetBonus = () => {
      modal.querySelectorAll('.config-bonus-input').forEach(input => {
        input.value = 0;
      });
    };

    applyBtn.addEventListener('click', applyBonus);
    resetBtn.addEventListener('click', resetBonus);
    closeBtn.addEventListener('click', () => modal.remove());

    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });
  },

  showMaxConfigModal() {
    const existingModal = document.querySelector('.status-edit-modal');
    if (existingModal) existingModal.remove();

    const bonusConfig = this.character.bonusConfig || {};

    const maxFields = [
      { id: 'maxPV', nom: 'Max PV', desc: 'Points de Vitalité' },
      { id: 'maxPS', nom: 'Max PS', desc: 'Points de Spiritualité' },
      { id: 'maxPE', nom: 'Max PE', desc: 'Points d\'Endurance' },
      { id: 'maxPM', nom: 'Max PM', desc: 'Points de Mana' },
      { id: 'maxPK', nom: 'Max PK', desc: 'Points de Karma' },
      { id: 'maxPC', nom: 'Max PC', desc: 'Points de Chi' }
    ];

    const gridHtml = maxFields.map(field => {
      return `
        <div class="config-bonus-row">
          <span class="config-bonus-nom">${field.nom}</span>
          <input type="number" class="config-bonus-input" data-bonus-id="${field.id}" value="${bonusConfig[field.id] || 0}">
        </div>`;
    }).join('');

    const modal = document.createElement('div');
    modal.className = 'status-edit-modal';
    modal.innerHTML = `
      <div class="status-edit-modal-content config-modal-content config-max-modal">
        <div class="status-edit-modal-header">
          <span>Bonus aux Ressources Max</span>
          <button class="status-edit-modal-close">&times;</button>
        </div>
        <div class="status-edit-modal-body config-modal-body">
          <div class="config-max-grid">
            ${gridHtml}
          </div>
        </div>
        <div class="status-edit-modal-footer repos-footer">
          <button class="btn-repos-cancel" id="btn-max-reset">Réinitialiser</button>
          <button class="btn-repos-confirm" id="btn-max-apply">Appliquer</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const closeBtn = modal.querySelector('.status-edit-modal-close');
    const resetBtn = modal.querySelector('#btn-max-reset');
    const applyBtn = modal.querySelector('#btn-max-apply');

    const applyMax = () => {
      modal.querySelectorAll('.config-bonus-input').forEach(input => {
        const id = input.dataset.bonusId;
        const val = parseInt(input.value) || 0;
        this.character.bonusConfig[id] = val;
      });
      Storage.save(this.character);
      modal.remove();
      this.render();
    };

    const resetMax = () => {
      modal.querySelectorAll('.config-bonus-input').forEach(input => {
        input.value = 0;
      });
    };

    applyBtn.addEventListener('click', applyMax);
    resetBtn.addEventListener('click', resetMax);
    closeBtn.addEventListener('click', () => modal.remove());

    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });
  },

  showAttributsConfigModal() {
    const existingModal = document.querySelector('.status-edit-modal');
    if (existingModal) existingModal.remove();

    const bonusConfig = this.character.bonusConfig || {};

    const attrFields = [
      // Corps
      { id: 'attrFOR', nom: 'Force', section: 'Corps' },
      { id: 'attrDEX', nom: 'Dextérité' },
      { id: 'attrAGI', nom: 'Agilité' },
      { id: 'attrCON', nom: 'Constitution' },
      { id: 'attrPER', nom: 'Perception' },
      // Esprit
      { id: 'attrCHA', nom: 'Charisme', section: 'Esprit' },
      { id: 'attrINT', nom: 'Intelligence' },
      { id: 'attrRUS', nom: 'Ruse' },
      { id: 'attrVOL', nom: 'Volonté' },
      { id: 'attrSAG', nom: 'Sagesse' },
      // Spéciaux
      { id: 'attrMAG', nom: 'Magie', section: 'Spéciaux' },
      { id: 'attrLOG', nom: 'Logique' },
      { id: 'attrCHN', nom: 'Chance' },
      // Secondaires
      { id: 'attrSTA', nom: 'Stature', section: 'Secondaires' },
      { id: 'attrTAI', nom: 'Taille' },
      { id: 'attrEGO', nom: 'Ego' },
      { id: 'attrAPP', nom: 'Apparence' }
    ];

    // Générer le HTML avec sections
    let currentSection = '';
    const gridHtml = attrFields.map(field => {
      let sectionHtml = '';
      if (field.section && field.section !== currentSection) {
        currentSection = field.section;
        sectionHtml = `<div class="config-bonus-section">${field.section}</div>`;
      }
      return `${sectionHtml}
        <div class="config-bonus-row">
          <span class="config-bonus-nom">${field.nom}</span>
          <input type="number" class="config-bonus-input" data-bonus-id="${field.id}" value="${bonusConfig[field.id] || 0}">
        </div>`;
    }).join('');

    const modal = document.createElement('div');
    modal.className = 'status-edit-modal';
    modal.innerHTML = `
      <div class="status-edit-modal-content config-modal-content config-attr-modal">
        <div class="status-edit-modal-header">
          <span>Bonus aux Attributs</span>
          <button class="status-edit-modal-close">&times;</button>
        </div>
        <div class="status-edit-modal-body config-modal-body">
          <div class="config-attr-grid">
            ${gridHtml}
          </div>
        </div>
        <div class="status-edit-modal-footer repos-footer">
          <button class="btn-repos-cancel" id="btn-attr-reset">Réinitialiser</button>
          <button class="btn-repos-confirm" id="btn-attr-apply">Appliquer</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const closeBtn = modal.querySelector('.status-edit-modal-close');
    const resetBtn = modal.querySelector('#btn-attr-reset');
    const applyBtn = modal.querySelector('#btn-attr-apply');

    const applyAttr = () => {
      modal.querySelectorAll('.config-bonus-input').forEach(input => {
        const id = input.dataset.bonusId;
        const val = parseInt(input.value) || 0;
        this.character.bonusConfig[id] = val;
      });
      Storage.save(this.character);
      modal.remove();
      this.render();
    };

    const resetAttr = () => {
      modal.querySelectorAll('.config-bonus-input').forEach(input => {
        input.value = 0;
      });
    };

    applyBtn.addEventListener('click', applyAttr);
    resetBtn.addEventListener('click', resetAttr);
    closeBtn.addEventListener('click', () => modal.remove());

    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });
  }
};
