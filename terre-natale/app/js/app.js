// app.js - Point d'entrée et initialisation

const App = {
  character: null,
  castes: [],
  ethnies: [],

  // Initialisation de l'application
  async init() {
    try {
      // Charge les données JSON
      await this.loadData();

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
      UI.init(this.character, this.castes, this.ethnies);

      console.log('Terre Natale - Application initialisée');
    } catch (error) {
      console.error('Erreur d\'initialisation:', error);
      this.showError('Erreur lors du chargement de l\'application: ' + error.message);
    }
  },

  // Charge les fichiers JSON
  async loadData() {
    try {
      // Essaie de charger les fichiers JSON
      const [castesResponse, ethniesResponse] = await Promise.all([
        fetch('data/castes.json'),
        fetch('data/ethnies.json')
      ]);

      if (castesResponse.ok) {
        this.castes = await castesResponse.json();
      } else {
        console.warn('Impossible de charger castes.json, utilisation des données intégrées');
        this.castes = this.getDefaultCastes();
      }

      if (ethniesResponse.ok) {
        this.ethnies = await ethniesResponse.json();
      } else {
        console.warn('Impossible de charger ethnies.json, utilisation des données intégrées');
        this.ethnies = this.getDefaultEthnies();
      }
    } catch (error) {
      // En mode fichier local (file://), fetch ne fonctionne pas
      console.warn('Mode fichier local détecté, utilisation des données intégrées');
      this.castes = this.getDefaultCastes();
      this.ethnies = this.getDefaultEthnies();
    }
  },

  // Données de castes par défaut (fallback)
  getDefaultCastes() {
    return [
      {
        nom: "Combattant",
        type: "fondamentale",
        attribut1: ["FOR", "DEX", "AGI", "CON", "PER"],
        attribut2: ["FOR", "DEX", "AGI", "CON", "PER"],
        domaine: "Martiale",
        style: "Corps",
        ressources: ["PV", "PE"],
        sauvegardesMajeures: ["Robustesse", "Réflexes"],
        sauvegardesMineures: ["Détermination", "Sang-Froid"]
      },
      {
        nom: "Érudit",
        type: "fondamentale",
        attribut1: ["INT", "SAG", "CHA", "VOL", "PER"],
        attribut2: ["INT", "SAG", "CHA", "VOL", "PER"],
        domaine: "Connaissance",
        style: "Esprit",
        ressources: ["PS", "PM"],
        sauvegardesMajeures: ["Détermination", "Intuition"],
        sauvegardesMineures: ["Sang-Froid", "Prestige"]
      },
      {
        nom: "Roublard",
        type: "fondamentale",
        attribut1: ["DEX", "AGI", "PER", "RUS", "INT"],
        attribut2: ["DEX", "AGI", "PER", "RUS", "INT"],
        domaine: "Furtivité",
        style: "Corps",
        ressources: ["PE", "PC"],
        sauvegardesMajeures: ["Réflexes", "Sang-Froid"],
        sauvegardesMineures: ["Intuition", "Fortune"]
      },
      {
        nom: "Mystique",
        type: "fondamentale",
        attribut1: ["SAG", "VOL", "CHA", "INT", "PER"],
        attribut2: ["SAG", "VOL", "CHA", "INT", "PER"],
        domaine: "Magie",
        style: "Esprit",
        ressources: ["PM", "PS"],
        sauvegardesMajeures: ["Détermination", "Opposition"],
        sauvegardesMineures: ["Intuition", "Robustesse"]
      },
      {
        nom: "Artisan",
        type: "fondamentale",
        attribut1: ["INT", "DEX", "SAG", "CON", "PER"],
        attribut2: ["INT", "DEX", "SAG", "CON", "PER"],
        domaine: "Artisanat",
        style: "Corps",
        ressources: ["PV", "PC"],
        sauvegardesMajeures: ["Robustesse", "Intuition"],
        sauvegardesMineures: ["Sang-Froid", "Détermination"]
      }
    ];
  },

  // Données d'ethnies par défaut (fallback)
  getDefaultEthnies() {
    return [
      {
        nom: "Humain des Plaines",
        origine: "Humain",
        bonus: { FOR: 1, CON: 1 },
        description: "Les humains des plaines sont robustes et endurants."
      },
      {
        nom: "Humain des Montagnes",
        origine: "Humain",
        bonus: { CON: 1, VOL: 1 },
        description: "Les montagnards sont résistants et déterminés."
      },
      {
        nom: "Humain des Côtes",
        origine: "Humain",
        bonus: { DEX: 1, PER: 1 },
        description: "Les habitants des côtes sont agiles et observateurs."
      },
      {
        nom: "Elfe des Bois",
        origine: "Elfe",
        bonus: { AGI: 1, PER: 1 },
        description: "Les elfes des bois sont gracieux et vifs."
      },
      {
        nom: "Elfe des Cités",
        origine: "Elfe",
        bonus: { INT: 1, CHA: 1 },
        description: "Les elfes des cités sont cultivés et charismatiques."
      },
      {
        nom: "Nain des Forges",
        origine: "Nain",
        bonus: { CON: 2 },
        description: "Les nains des forges sont incroyablement résistants."
      },
      {
        nom: "Nain des Profondeurs",
        origine: "Nain",
        bonus: { FOR: 1, SAG: 1 },
        description: "Les nains des profondeurs sont forts et sages."
      }
    ];
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
