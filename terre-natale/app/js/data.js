// data.js - Données statiques pour Terre Natale

const DATA = {
  // Attributs principaux - Corps
  attributsCorps: [
    { id: 'FOR', nom: 'Force', description: 'Puissance physique brute', image: 'images/attributes/strength.webp' },
    { id: 'DEX', nom: 'Dextérité', description: 'Précision et habileté manuelle', image: 'images/attributes/dexterity.webp' },
    { id: 'AGI', nom: 'Agilité', description: 'Souplesse et rapidité de mouvement', image: 'images/attributes/agility.webp' },
    { id: 'CON', nom: 'Constitution', description: 'Endurance et résistance physique', image: 'images/attributes/constitution.webp' },
    { id: 'PER', nom: 'Perception', description: 'Acuité sensorielle', image: 'images/attributes/perception.webp' }
  ],

  // Attributs principaux - Esprit
  attributsEsprit: [
    { id: 'CHA', nom: 'Charisme', description: 'Force de personnalité', image: 'images/attributes/charisma.webp' },
    { id: 'INT', nom: 'Intelligence', description: 'Capacité de raisonnement', image: 'images/attributes/intelligence.webp' },
    { id: 'RUS', nom: 'Ruse', description: 'Astuce et malice', image: 'images/attributes/cunning.webp' },
    { id: 'VOL', nom: 'Volonté', description: 'Détermination mentale', image: 'images/attributes/willpower.webp' },
    { id: 'SAG', nom: 'Sagesse', description: 'Intuition et bon sens', image: 'images/attributes/wisdom.webp' }
  ],

  // Attributs spéciaux - Magie/Logique (avec défenses)
  attributsMagiques: [
    { id: 'MAG', nom: 'Magie', description: 'Affinité magique', image: 'images/attributes/magic.webp' },
    { id: 'LOG', nom: 'Logique', description: 'Connexion au Logos', image: 'images/attributes/logic.webp' }
  ],

  // Attributs spéciaux - Équilibre/Chance
  attributsDestin: [
    { id: 'EQU', nom: 'Équilibre', description: 'Harmonie intérieure', image: 'images/attributes/balance.webp', calcule: true },
    { id: 'CHN', nom: 'Chance', description: 'Fortune et destin', image: 'images/attributes/luck.webp' }
  ],

  // Tous les attributs spéciaux (pour les calculs)
  get attributsSpeciaux() {
    return [...this.attributsMagiques, ...this.attributsDestin];
  },

  // Attributs secondaires (sans images, affichage sobre)
  attributsSecondaires: [
    { id: 'STA', nom: 'Stature', categorie: 'corps', description: 'Carrure et masse corporelle' },
    { id: 'TAI', nom: 'Taille', categorie: 'corps', description: 'Hauteur et envergure' },
    { id: 'EGO', nom: 'Ego', categorie: 'esprit', description: 'Force de la personnalité intérieure' },
    { id: 'APP', nom: 'Apparence', categorie: 'esprit', description: 'Beauté et prestance' }
  ],

  // Tous les attributs principaux (pour les calculs)
  get attributsPrincipaux() {
    return [...this.attributsCorps, ...this.attributsEsprit];
  },

  // Rangs de caste (voir tableau Notes.md)
  rangs: [
    { niveau: 0, nom: 'Quidam', xpRequis: 0, aptitude: 0, bonusEquilibre: 0, pa: 0 },
    { niveau: 1, nom: 'Apprenti', xpRequis: 50, aptitude: 7, bonusEquilibre: 0, pa: 7 },
    { niveau: 2, nom: 'Apprenti+', xpRequis: 100, aptitude: 9, bonusEquilibre: 1, pa: 8 },
    { niveau: 3, nom: 'Compagnon', xpRequis: 225, aptitude: 11, bonusEquilibre: 1, pa: 9 },
    { niveau: 4, nom: 'Compagnon+', xpRequis: 375, aptitude: 13, bonusEquilibre: 2, pa: 10 },
    { niveau: 5, nom: 'Expert', xpRequis: 550, aptitude: 17, bonusEquilibre: 2, pa: 11 },
    { niveau: 6, nom: 'Expert+', xpRequis: 700, aptitude: 21, bonusEquilibre: 3, pa: 12 },
    { niveau: 7, nom: 'Maître', xpRequis: 950, aptitude: 25, bonusEquilibre: 3, pa: 13 },
    { niveau: 8, nom: 'Maître+', xpRequis: 1250, aptitude: 29, bonusEquilibre: 4, pa: 14 },
    { niveau: 9, nom: 'Grand Maître', xpRequis: 1600, aptitude: 33, bonusEquilibre: 4, pa: 15 },
    { niveau: 10, nom: 'Grand Maître+', xpRequis: 2000, aptitude: 37, bonusEquilibre: 5, pa: 16 },
    { niveau: 11, nom: 'Sommité', xpRequis: 2400, aptitude: 42, bonusEquilibre: 5, pa: 17 },
    { niveau: 12, nom: 'Sommité+', xpRequis: 2800, aptitude: 47, bonusEquilibre: 6, pa: 18 }
  ],

  // Sauvegardes
  sauvegardes: [
    { id: 'robustesse', nom: 'Robustesse', attribut: 'CON' },
    { id: 'determination', nom: 'Détermination', attribut: 'VOL' },
    { id: 'reflexes', nom: 'Réflexes', attribut: 'AGI' },
    { id: 'sangfroid', nom: 'Sang-Froid', attribut: 'RUS' },
    { id: 'intuition', nom: 'Intuition', attribut: 'SAG' },
    { id: 'fortune', nom: 'Fortune', attribut: 'CHN' },
    { id: 'opposition', nom: 'Opposition', attribut: ['MAG', 'LOG'] }, // Le plus haut des deux
    { id: 'prestige', nom: 'Prestige', attribut: 'APP' }
  ],

  // Ressources et leurs attributs liés
  ressources: [
    { id: 'PE', nom: 'Endurance', attribut: 'EQU', multiplicateur: 2, icone: '⚡' },
    { id: 'PV', nom: 'Vitalité', attribut: 'CON', multiplicateur: 2, icone: '❤️' },
    { id: 'PS', nom: 'Spiritualité', attribut: 'VOL', multiplicateur: 2, icone: '💙' },
    { id: 'PC', nom: 'Chi', type: 'caste', icone: '💠' }, // Attribut Caste 1 + Attribut Caste 2
    { id: 'PK', nom: 'Karma', attribut: 'CHN', multiplicateur: 2, icone: '⭐' },
    { id: 'PM', nom: 'Mana', type: 'tradition', multiplicateur: 2, icone: '🔮' }
  ],

  // Traditions magiques et leurs attributs
  traditions: [
    { id: 'academique', nom: 'Académique', attribut: 'INT' },
    { id: 'shamanique', nom: 'Shamanique', attribut: 'SAG' },
    { id: 'profane', nom: 'Profane', attribut: 'RUS' },
    { id: 'hermetique', nom: 'Hermétique', attribut: 'VOL' },
    { id: 'artistique', nom: 'Artistique', attribut: 'CHA' },
    { id: 'ornementale', nom: 'Ornementale', attribut: 'CON' },
    { id: 'caprice', nom: 'Caprice', attribut: 'CHN' }
  ],

  // Caractéristiques calculées
  caracteristiques: [
    { id: 'allure', nom: 'Allure', description: 'Vitesse de déplacement en mètres par tour' },
    { id: 'resilience', nom: 'Résilience', description: 'Capacité à résister aux effets négatifs' },
    { id: 'initiative', nom: 'Initiative', description: 'Ordre d\'action en combat' },
    { id: 'encombrement', nom: 'Encombrement Max', description: 'Poids transportable' }
  ],

  // Valeur par défaut des attributs
  valeurDefaut: 10,

  // PA de départ
  paDepart: 27
};

// Freeze pour éviter les modifications accidentelles
Object.freeze(DATA);
Object.freeze(DATA.attributsCorps);
Object.freeze(DATA.attributsEsprit);
Object.freeze(DATA.attributsMagiques);
Object.freeze(DATA.attributsDestin);
Object.freeze(DATA.attributsSecondaires);
Object.freeze(DATA.rangs);
Object.freeze(DATA.sauvegardes);
Object.freeze(DATA.ressources);
Object.freeze(DATA.traditions);
Object.freeze(DATA.caracteristiques);
