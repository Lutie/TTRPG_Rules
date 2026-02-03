// storage.js - Gestion du localStorage et import/export JSON

const Storage = {
  STORAGE_KEY: 'terreNatale_character',

  // Sauvegarde dans localStorage
  save(character) {
    try {
      const json = JSON.stringify(character);
      localStorage.setItem(this.STORAGE_KEY, json);
      return true;
    } catch (e) {
      console.error('Erreur lors de la sauvegarde:', e);
      return false;
    }
  },

  // Chargement depuis localStorage
  load() {
    try {
      const json = localStorage.getItem(this.STORAGE_KEY);
      if (json) {
        return JSON.parse(json);
      }
      return null;
    } catch (e) {
      console.error('Erreur lors du chargement:', e);
      return null;
    }
  },

  // Efface les données sauvegardées
  clear() {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      return true;
    } catch (e) {
      console.error('Erreur lors de la suppression:', e);
      return false;
    }
  },

  // Export vers fichier JSON
  exportToFile(character) {
    try {
      const json = JSON.stringify(character, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      const nom = character.infos?.nom || 'personnage';
      a.download = `${nom.replace(/[^a-z0-9]/gi, '_')}_terre_natale.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      return true;
    } catch (e) {
      console.error('Erreur lors de l\'export:', e);
      return false;
    }
  },

  // Import depuis fichier JSON
  importFromFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const character = JSON.parse(e.target.result);
          // Validation basique
          if (character && typeof character === 'object') {
            resolve(character);
          } else {
            reject(new Error('Format de fichier invalide'));
          }
        } catch (err) {
          reject(new Error('Erreur de parsing JSON: ' + err.message));
        }
      };

      reader.onerror = () => {
        reject(new Error('Erreur de lecture du fichier'));
      };

      reader.readAsText(file);
    });
  }
};
