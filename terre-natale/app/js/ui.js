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
    this.renderRessources();
    this.renderCaracteristiques();
    this.renderSauvegardes();
    this.renderCompetences();
    this.renderTraits();
    this.renderMemoire();
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

    // Calcul des bonus séparés
    const bonusEthnie = data.bonus || 0;
    const bonusOrigines = (this.character.originesBonus && this.character.originesBonus[attr.id]) || 0;
    const totalBonus = bonusEthnie + bonusOrigines;

    // Bonus de naissance (pour CHN notamment)
    const hasNaissance = ['STA', 'TAI', 'EGO', 'APP', 'CHN', 'EQU'].includes(attr.id);
    const bonusNaissance = hasNaissance ? (this.character.naissanceBonus?.[attr.id] || 0) : 0;

    const formatBonus = (val) => val > 0 ? '+' + val : (val < 0 ? val : '0');
    const bonusClass = totalBonus > 0 ? 'positive' : (totalBonus < 0 ? 'negative' : '');
    const naissanceClass = bonusNaissance > 0 ? 'positive' : (bonusNaissance < 0 ? 'negative' : '');

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
                <label>Bonus</label>
                <span class="attr-bonus ${bonusClass}" title="Ethnie: ${formatBonus(bonusEthnie)}, Origines: ${formatBonus(bonusOrigines)}">${formatBonus(totalBonus)}</span>
              </div>
              ${hasNaissance ? `
              <div class="attr-row">
                <label>Naissance</label>
                <span class="attr-bonus ${naissanceClass}">${formatBonus(bonusNaissance)}</span>
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
    const totalBonus = bonusEthnie + bonusOrigines;

    // Bonus de naissance pour EQU
    const bonusNaissance = this.character.naissanceBonus?.[attr.id] || 0;

    // Bonus de caste pour EQU : +1 tous les 2 rangs révolus
    const rang = this.character.caste?.rang || 0;
    const bonusCaste = Math.floor(rang / 2);

    // Utilise getValeurTotale pour le total (inclut tous les bonus)
    const total = Character.getValeurTotale(this.character, attr.id);
    const mod = Character.calculerModificateur(total);

    const formatBonus = (val) => val > 0 ? '+' + val : (val < 0 ? val : '0');
    const bonusClass = totalBonus > 0 ? 'positive' : (totalBonus < 0 ? 'negative' : '');
    const naissanceClass = bonusNaissance > 0 ? 'positive' : (bonusNaissance < 0 ? 'negative' : '');
    const casteClass = bonusCaste > 0 ? 'positive' : '';

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
                <label>Bonus</label>
                <span class="attr-bonus ${bonusClass}" title="Ethnie: ${formatBonus(bonusEthnie)}, Origines: ${formatBonus(bonusOrigines)}">${formatBonus(totalBonus)}</span>
              </div>
              <div class="attr-row">
                <label>Naissance</label>
                <span class="attr-bonus ${naissanceClass}">${formatBonus(bonusNaissance)}</span>
              </div>
              <div class="attr-row">
                <label>Caste</label>
                <span class="attr-bonus ${casteClass}" title="+1 par 2 rangs révolus">${formatBonus(bonusCaste)}</span>
              </div>
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

          return `
            <div class="attr-compact" title="${attr.description}">
              <span class="compact-name">${attr.nom}</span>
              <input type="number" class="attr-input-compact" data-attr="${attr.id}" value="${data.base}" min="${DATA.secondaireMin}" max="${DATA.secondaireMax}" />
              <span class="compact-naissance ${naissanceClass}" title="Naissance">${formatNaissance}</span>
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
          // Récupération = 5 + mod(SAG + mod EQU + rang caste si ressource de caste)
          const isCasteRessource = caste && caste.ressources && caste.ressources.includes(res.id);
          const baseForMod = sagTotal + modEqu + (isCasteRessource ? rangCaste : 0);
          const recup = 5 + Character.calculerModificateur(baseForMod);
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

    const formatMod = (val) => val >= 0 ? '+' + val : val;

    container.innerHTML = `
      <div class="caracteristiques-grid">
        <div class="carac-box">
          <span class="carac-name">Allure</span>
          <span class="carac-value">${allure}</span>
        </div>
        <div class="carac-box">
          <span class="carac-name">Déplacement</span>
          <span class="carac-value">${deplacement}</span>
        </div>
        <div class="carac-box">
          <span class="carac-name">Résilience</span>
          <span class="carac-value">${resilience}</span>
        </div>
        <div class="carac-box">
          <span class="carac-name">Récupération</span>
          <span class="carac-value">${recuperation}</span>
        </div>
        <div class="carac-box">
          <span class="carac-name">Mémoire</span>
          <span class="carac-value">${memoire}</span>
        </div>
        <div class="carac-box">
          <span class="carac-name">Charge Max</span>
          <span class="carac-value">${chargeMax}</span>
        </div>
        <div class="carac-box">
          <span class="carac-name">Encombrement Max</span>
          <span class="carac-value">${encombrementMax}</span>
        </div>
        <div class="carac-box">
          <span class="carac-name">Poigne</span>
          <span class="carac-value">${poigne}</span>
        </div>
        <div class="carac-box">
          <span class="carac-name">Prot. Physique</span>
          <span class="carac-value">${protPhys}</span>
        </div>
        <div class="carac-box">
          <span class="carac-name">Prot. Mentale</span>
          <span class="carac-value">${protMent}</span>
        </div>
        <div class="carac-box">
          <span class="carac-name">Abs. Physique</span>
          <span class="carac-value">${formatMod(absPhys)}</span>
        </div>
        <div class="carac-box">
          <span class="carac-name">Abs. Mentale</span>
          <span class="carac-value">${formatMod(absMent)}</span>
        </div>
        <div class="carac-box">
          <span class="carac-name">Prouesses Innées</span>
          <span class="carac-value">${formatMod(prouesses)}</span>
        </div>
        <div class="carac-box">
          <span class="carac-name">Moral</span>
          <span class="carac-value">${formatMod(moral)}</span>
        </div>
        <div class="carac-box">
          <span class="carac-name">Perf. Physique</span>
          <span class="carac-value">${formatMod(perfPhys)}</span>
        </div>
        <div class="carac-box">
          <span class="carac-name">Perf. Mentale</span>
          <span class="carac-value">${formatMod(perfMent)}</span>
        </div>
        <div class="carac-box">
          <span class="carac-name">Contrôle Actif</span>
          <span class="carac-value">${formatMod(ctrlActif)}</span>
        </div>
        <div class="carac-box">
          <span class="carac-name">Contrôle Passif</span>
          <span class="carac-value">${formatMod(ctrlPassif)}</span>
        </div>
        <div class="carac-box">
          <span class="carac-name">Technique Max</span>
          <span class="carac-value">${formatMod(techMax)}</span>
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
    });
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
          ${this.renderTraitsList(desavantages, 'desavantage', traitsDisponibles)}
          ${this.renderAvantagesCaste()}
          ${this.renderTraitsList(avantages, 'avantage', traitsDisponibles)}
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
  }
};
