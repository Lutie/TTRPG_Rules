// ui.js - Gestion de l'interface utilisateur

const UI = {
  currentTab: 'principal',
  character: null,
  castes: [],
  ethnies: [],

  // Initialise l'interface
  init(character, castes, ethnies) {
    this.character = character;
    this.castes = castes;
    this.ethnies = ethnies;

    this.setupTabs();
    this.setupEventListeners();
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

  // Rendu complet
  render() {
    this.renderInfos();
    this.renderAttributs();
    this.renderCaste();
    this.renderTradition();
    this.renderRessources();
    this.renderCaracteristiques();
    this.renderSauvegardes();
  },

  // Rendu des informations du personnage
  renderInfos() {
    const infos = this.character.infos;
    const container = document.getElementById('infos-personnage');

    container.innerHTML = `
      <div class="info-grid">
        <div class="info-field">
          <label>Nom</label>
          <input type="text" data-info="nom" value="${infos.nom || ''}" />
        </div>
        <div class="info-field">
          <label>Origine</label>
          <input type="text" data-info="origine" value="${infos.origine || ''}" />
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
          <input type="text" data-info="comportement" value="${infos.comportement || ''}" />
        </div>
        <div class="info-field">
          <label>Caractère</label>
          <input type="text" data-info="caractere" value="${infos.caractere || ''}" />
        </div>
        <div class="info-field">
          <label>Destinée</label>
          <input type="text" data-info="destinee" value="${infos.destinee || ''}" />
        </div>
        <div class="info-field">
          <label>Vécu</label>
          <input type="text" data-info="vecu" value="${infos.vecu || ''}" />
        </div>
        <div class="info-field">
          <label>Nombre Fétiche</label>
          <input type="text" data-info="nombreFetiche" value="${infos.nombreFetiche || ''}" />
        </div>
      </div>
    `;

    // Événements
    container.querySelectorAll('input, select').forEach(input => {
      input.addEventListener('change', (e) => {
        const field = e.target.dataset.info;
        this.character.infos[field] = e.target.value;

        // Si l'ethnie change, recalculer les bonus
        if (field === 'ethnie') {
          this.character = Character.appliquerBonusEthnie(this.character, this.ethnies);
          this.renderAttributs();
          this.renderRessources();
          this.renderCaracteristiques();
          this.renderSauvegardes();
        }

        Storage.save(this.character);
      });
    });
  },

  // Génère le HTML d'un bloc attribut avec image
  renderAttributBlock(attr, showDefenses = true) {
    const data = this.character.attributs[attr.id];
    const total = Character.getValeurTotale(this.character, attr.id);
    const mod = Character.calculerModificateur(total);
    const def = Character.calculerDefenseNormale(total);
    const choc = Character.calculerDefenseChoquee(total);

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
                <input type="number" class="attr-input" data-attr="${attr.id}" value="${data.base}" min="3" max="20" />
              </div>
              <div class="attr-row">
                <label>Bonus</label>
                <span class="attr-bonus ${data.bonus > 0 ? 'positive' : ''}">${data.bonus > 0 ? '+' + data.bonus : data.bonus || '0'}</span>
              </div>
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
    const total = baseCalculee + (data.bonus || 0);
    const mod = Character.calculerModificateur(total);

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
                <span class="attr-bonus ${data.bonus > 0 ? 'positive' : ''}">${data.bonus > 0 ? '+' + data.bonus : data.bonus || '0'}</span>
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

  // Rendu des attributs
  renderAttributs() {
    const paUtilises = Character.calculerPAUtilises(this.character);
    const paTotal = DATA.paDepart;

    document.getElementById('pa-display').innerHTML = `
      <span class="${paUtilises > paTotal ? 'over-budget' : ''}">
        PA: ${paUtilises} / ${paTotal}
      </span>
    `;

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

    // Attributs Secondaires (STA, TAI, EGO, APP - affichage sobre)
    const secondairesContainer = document.getElementById('attributs-secondaires');
    secondairesContainer.innerHTML = `
      <div class="attr-compact-grid">
        ${DATA.attributsSecondaires.map(attr => {
          const data = this.character.attributs[attr.id];
          const total = Character.getValeurTotale(this.character, attr.id);
          const mod = Character.calculerModificateur(total);

          return `
            <div class="attr-compact" title="${attr.description}">
              <span class="compact-name">${attr.nom}</span>
              <input type="number" class="attr-input-compact" data-attr="${attr.id}" value="${data.base}" min="3" max="20" />
              <span class="compact-bonus ${data.bonus > 0 ? 'positive' : ''}">${data.bonus > 0 ? '+' + data.bonus : ''}</span>
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
        const value = parseInt(e.target.value) || DATA.valeurDefaut;
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

    container.innerHTML = `
      <div class="caste-grid">
        <div class="caste-field">
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
        <div class="caste-field">
          <label>Rang</label>
          <select id="select-rang">
            ${DATA.rangs.map(r => `
              <option value="${r.niveau}" ${this.character.caste.rang === r.niveau ? 'selected' : ''}>
                ${r.niveau} - ${r.nom}
              </option>
            `).join('')}
          </select>
        </div>
        ${casteActuelle ? `
          <div class="caste-field">
            <label>Attribut Principal 1</label>
            <select id="select-attr1">
              ${casteActuelle.attribut1.map(a => `
                <option value="${a}" ${this.character.caste.attribut1 === a ? 'selected' : ''}>${a}</option>
              `).join('')}
            </select>
          </div>
          <div class="caste-field">
            <label>Attribut Principal 2</label>
            <select id="select-attr2">
              ${casteActuelle.attribut2.map(a => `
                <option value="${a}" ${this.character.caste.attribut2 === a ? 'selected' : ''}>${a}</option>
              `).join('')}
            </select>
          </div>
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

    document.getElementById('select-rang')?.addEventListener('change', (e) => {
      this.character.caste.rang = parseInt(e.target.value);
      Storage.save(this.character);
      this.renderRessources();
      this.renderSauvegardes();
    });

    document.getElementById('select-attr1')?.addEventListener('change', (e) => {
      this.character.caste.attribut1 = e.target.value;
      Storage.save(this.character);
    });

    document.getElementById('select-attr2')?.addEventListener('change', (e) => {
      this.character.caste.attribut2 = e.target.value;
      Storage.save(this.character);
    });
  },

  // Rendu des ressources
  renderRessources() {
    const ressources = Character.calculerRessources(this.character, this.castes);
    this.character.ressources = ressources;
    Storage.save(this.character);

    const container = document.getElementById('ressources-section');
    container.innerHTML = `
      <div class="ressources-grid">
        ${DATA.ressources.map(res => {
          const data = ressources[res.id];
          return `
            <div class="ressource-box">
              <div class="ressource-name">${res.icone || ''} ${res.nom}</div>
              <div class="ressource-value">${data.max}</div>
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
            typeLabel = ' (M)';
          } else if (estMineure) {
            typeClass = 'mineure';
            typeLabel = ' (m)';
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
  }
};
