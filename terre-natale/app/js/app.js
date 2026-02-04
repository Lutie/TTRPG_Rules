// app.js - Point d'entrée et initialisation

const App = {
  character: null,
  castes: [],
  ethnies: [],
  origines: [],
  allegeances: [],
  milieux: [],
  personas: [],

  // Initialisation de l'application
  async init() {
    try {
      // Charge les données depuis les fichiers JS
      this.loadData();

      // Charge ou crée le personnage
      this.character = Storage.load();
      if (!this.character) {
        this.character = Character.create();
      } else {
        this.character = Character.valider(this.character);
      }

      // Applique les bonus d'ethnie
      this.character = Character.appliquerBonusEthnie(this.character, this.ethnies);

      // Sauvegarde initiale
      Storage.save(this.character);

      // Initialise l'interface
      UI.init(this.character, this.castes, this.ethnies, this.origines, this.allegeances, this.milieux, this.personas);

      console.log('Terre Natale - Application initialisée');
    } catch (error) {
      console.error('Erreur d\'initialisation:', error);
      this.showError('Erreur lors du chargement de l\'application: ' + error.message);
    }
  },

  // Charge les données depuis les fichiers JS
  loadData() {
    this.castes = Castes.get();
    console.log('Castes chargées:', this.castes.length, 'entrées');

    this.ethnies = Ethnies.get();
    console.log('Ethnies chargées:', this.ethnies.length, 'entrées');

    this.origines = Origines.get();
    console.log('Origines chargées:', this.origines.length, 'entrées');

    this.allegeances = Allegeances.get();
    console.log('Allégeances chargées:', this.allegeances.length, 'entrées');

    this.milieux = Milieux.get();
    console.log('Milieux chargés:', this.milieux.length, 'entrées');

    this.personas = Personas.get();
    console.log('Personas chargés:', this.personas.length, 'entrées');
  },

  // Affiche une erreur
  showError(message) {
    const container = document.querySelector('.container');
    if (container) {
      container.innerHTML = `
        <div class="error-message">
          <h2>Erreur</h2>
          <p>${message}</p>
          <button onclick="location.reload()">Recharger</button>
        </div>
      `;
    }
  }
};

// Démarrage de l'application au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
