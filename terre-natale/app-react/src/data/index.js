// data/index.js - Données statiques pour Terre Natale

export const attributsCorps = [
  { id: 'FOR', nom: 'Force', description: 'Puissance physique brute', image: 'images/attributes/strength.webp' },
  { id: 'DEX', nom: 'Dextérité', description: 'Précision et habileté manuelle', image: 'images/attributes/dexterity.webp' },
  { id: 'AGI', nom: 'Agilité', description: 'Souplesse et rapidité de mouvement', image: 'images/attributes/agility.webp' },
  { id: 'CON', nom: 'Constitution', description: 'Endurance et résistance physique', image: 'images/attributes/constitution.webp' },
  { id: 'PER', nom: 'Perception', description: 'Acuité sensorielle', image: 'images/attributes/perception.webp' }
];

export const attributsEsprit = [
  { id: 'CHA', nom: 'Charisme', description: 'Force de personnalité', image: 'images/attributes/charisma.webp' },
  { id: 'INT', nom: 'Intelligence', description: 'Capacité de raisonnement', image: 'images/attributes/intelligence.webp' },
  { id: 'RUS', nom: 'Ruse', description: 'Astuce et malice', image: 'images/attributes/cunning.webp' },
  { id: 'VOL', nom: 'Volonté', description: 'Détermination mentale', image: 'images/attributes/willpower.webp' },
  { id: 'SAG', nom: 'Sagesse', description: 'Intuition et bon sens', image: 'images/attributes/wisdom.webp' }
];

export const attributsMagiques = [
  { id: 'MAG', nom: 'Magie', description: 'Affinité magique', image: 'images/attributes/magic.webp' },
  { id: 'LOG', nom: 'Logique', description: 'Connexion au Logos', image: 'images/attributes/logic.webp' }
];

export const attributsDestin = [
  { id: 'EQU', nom: 'Équilibre', description: 'Harmonie intérieure', image: 'images/attributes/balance.webp', calcule: true },
  { id: 'CHN', nom: 'Chance', description: 'Fortune et destin', image: 'images/attributes/luck.webp' }
];

export const attributsSecondaires = [
  { id: 'STA', nom: 'Stature', categorie: 'corps', description: 'Carrure et masse corporelle' },
  { id: 'TAI', nom: 'Taille', categorie: 'corps', description: 'Hauteur et envergure' },
  { id: 'EGO', nom: 'Ego', categorie: 'esprit', description: 'Force de la personnalité intérieure' },
  { id: 'APP', nom: 'Apparence', categorie: 'esprit', description: 'Beauté et prestance' }
];

export const attributsPrincipaux = [...attributsCorps, ...attributsEsprit];
export const attributsSpeciaux = [...attributsMagiques, ...attributsDestin];

export const rangs = [
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
];

export const sauvegardes = [
  { id: 'robustesse', nom: 'Robustesse', attribut: 'CON' },
  { id: 'determination', nom: 'Détermination', attribut: 'VOL' },
  { id: 'reflexes', nom: 'Réflexes', attribut: 'AGI' },
  { id: 'sangfroid', nom: 'Sang-Froid', attribut: 'RUS' },
  { id: 'intuition', nom: 'Intuition', attribut: 'SAG' },
  { id: 'fortune', nom: 'Fortune', attribut: 'CHN' },
  { id: 'opposition', nom: 'Opposition', attribut: ['MAG', 'LOG'] },
  { id: 'prestige', nom: 'Prestige', attribut: 'APP' }
];

export const ressources = [
  { id: 'PE', nom: 'Endurance', attribut: 'EQU', multiplicateur: 2, icone: '⚡' },
  { id: 'PV', nom: 'Vitalité', attribut: 'CON', multiplicateur: 2, icone: '❤️' },
  { id: 'PS', nom: 'Spiritualité', attribut: 'VOL', multiplicateur: 2, icone: '💙' },
  { id: 'PC', nom: 'Chi', type: 'caste', icone: '💠' },
  { id: 'PK', nom: 'Karma', attribut: 'CHN', multiplicateur: 2, icone: '⭐' },
  { id: 'PM', nom: 'Mana', type: 'tradition', multiplicateur: 2, icone: '🔮' }
];

export const traditions = [
  { id: 'academique', nom: 'Académique', attribut: 'INT' },
  { id: 'shamanique', nom: 'Shamanique', attribut: 'SAG' },
  { id: 'profane', nom: 'Profane', attribut: 'RUS' },
  { id: 'hermetique', nom: 'Hermétique', attribut: 'VOL' },
  { id: 'artistique', nom: 'Artistique', attribut: 'CHA' },
  { id: 'ornementale', nom: 'Ornementale', attribut: 'CON' },
  { id: 'caprice', nom: 'Caprice', attribut: 'CHN' }
];

export const valeurDefautPrincipal = 7;
export const valeurDefautSecondaire = 10;
export const secondaireMin = 8;
export const secondaireMax = 12;

export const destinees = [
  { nom: 'Commun des Mortels', pa: 200, pp: 2, maxAttribut: 15 },
  { nom: 'Destin Honorable', pa: 300, pp: 4, maxAttribut: 16 },
  { nom: 'Marche de la Gloire', pa: 400, pp: 6, maxAttribut: 17 },
  { nom: 'Arpenteur Héroïque', pa: 500, pp: 8, maxAttribut: 18 },
  { nom: 'Dieu parmi les Hommes', pa: 600, pp: 10, maxAttribut: 19 }
];

export const vecus = [
  { nom: 'Aucun', xp: 200, po: 10, maxGroupe: 1, maxCompetence: 1 },
  { nom: 'Notable', xp: 300, po: 15, maxGroupe: 1, maxCompetence: 2 },
  { nom: 'Admirable', xp: 400, po: 20, maxGroupe: 2, maxCompetence: 2 },
  { nom: 'Spectaculaire', xp: 500, po: 25, maxGroupe: 2, maxCompetence: 3 },
  { nom: 'Légendaire', xp: 600, po: 30, maxGroupe: 2, maxCompetence: 4 }
];

export const coutSecondaire = { 8: 5, 9: 2, 10: 0, 11: -4, 12: -9 };
export const coutChance = { 8: 9, 9: 5, 10: 0, 11: -6, 12: -13 };

export const typesMémoire = [
  { id: 0, nom: 'Manoeuvre' },
  { id: 1, nom: 'Sort' },
  { id: 2, nom: 'Patron' },
  { id: 3, nom: 'Autre' }
];

export const typesLesions = [
  { id: 'blessure', nom: 'Blessure', icone: '🩸', couleur: '#8B0000', protection: 'physique', ressource: 'PV' },
  { id: 'traumatisme', nom: 'Traumatisme', icone: '💔', couleur: '#4B0082', protection: 'mentale', ressource: 'PS' }
];

export const gravites = [
  { niveau: 0, nom: 'Bénine', couleur: '#2E7D32' },
  { niveau: 1, nom: 'Légère', couleur: '#689F38' },
  { niveau: 2, nom: 'Importante', couleur: '#F9A825' },
  { niveau: 3, nom: 'Grave', couleur: '#EF6C00' },
  { niveau: 4, nom: 'Mortelle', couleur: '#C62828' },
  { niveau: 5, nom: 'Incapacitante', couleur: '#4A148C' }
];

export const autresRessources = [
  { id: 'armure_physique', nom: 'Armure Physique', icone: '🛡️', couleur: '#8B4513', reposCourt: true, absorption: 'physique' },
  { id: 'armure_mentale', nom: 'Armure Mentale', icone: '🧠', couleur: '#483D8B', reposCourt: true, absorption: 'mentale' },
  { id: 'initiative', nom: 'Initiative', icone: '⏱️', couleur: '#DAA520', reposCourt: true, sansMax: true },
  { id: 'moral', nom: 'Moral', icone: '💪', couleur: '#228B22', reposCourt: true, maxResilience: true },
  { id: 'rage', nom: 'Rage', icone: '🔥', couleur: '#B22222', reposCourt: true, temporaire: true },
  { id: 'garde', nom: 'Garde', icone: '🛡️', couleur: '#4682B4', reposCourt: true, temporaire: true },
  { id: 'adrenaline', nom: 'Adrénaline', icone: '⚡', couleur: '#9932CC', reposCourt: true, temporaire: true },
  { id: 'strategie', nom: 'Stratégie', icone: '♟️', couleur: '#2E8B57', reposCourt: false }
];

export const conditions = [
  { id: 'empoisonne', nom: 'Empoisonné', type: 'physique', effets: 'Malus aux actions physiques', icone: '☠️' },
  { id: 'affaibli', nom: 'Affaibli', type: 'physique', effets: 'Dégâts réduits', icone: '💪' },
  { id: 'ralenti', nom: 'Ralenti', type: 'physique', effets: 'Allure et initiative réduites', icone: '🐌' },
  { id: 'aveugle', nom: 'Aveuglé', type: 'physique', effets: 'Ne peut pas voir', icone: '🙈' },
  { id: 'assourdi', nom: 'Assourdi', type: 'physique', effets: 'Ne peut pas entendre', icone: '🙉' },
  { id: 'entrave', nom: 'Entravé', type: 'physique', effets: 'Immobilisé', icone: '⛓️' },
  { id: 'saignement', nom: 'Saignement', type: 'physique', effets: 'Perd des PV chaque tour', icone: '🩸' },
  { id: 'fatigue', nom: 'Fatigué', type: 'physique', effets: 'Malus général', icone: '😴' },
  { id: 'effraye', nom: 'Effrayé', type: 'mentale', effets: 'Fuit la source de peur', icone: '😨' },
  { id: 'charme', nom: 'Charmé', type: 'mentale', effets: 'Considère la source comme alliée', icone: '💕' },
  { id: 'confus', nom: 'Confus', type: 'mentale', effets: 'Actions aléatoires', icone: '😵' },
  { id: 'provoque', nom: 'Provoqué', type: 'mentale', effets: 'Doit attaquer la source', icone: '😤' },
  { id: 'distrait', nom: 'Distrait', type: 'mentale', effets: 'Malus à la perception', icone: '🤔' },
  { id: 'desespere', nom: 'Désespéré', type: 'mentale', effets: 'Malus aux actions mentales', icone: '😢' }
];

// Castes
export const castes = [
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
    nom: "Mystique",
    type: "fondamentale",
    attribut1: ["SAG", "VOL", "CHA", "INT", "PER"],
    attribut2: ["SAG", "VOL", "CHA", "INT", "PER"],
    domaine: "Magie",
    style: "Esprit",
    ressources: ["PM", "PS"],
    sauvegardesMajeures: ["Détermination", "Opposition"],
    sauvegardesMineures: ["Intuition", "Robustesse"]
  }
];

// Compétences
export const competences = [
  {
    id: 'combat',
    nom: 'Combat',
    description: 'Techniques de combat et maniement des armes',
    competences: [
      { id: 'melee', nom: 'Mêlée', attributs: ['FOR', 'DEX', 'AGI'] },
      { id: 'distance', nom: 'Distance', attributs: ['DEX', 'PER', 'AGI'] },
      { id: 'defense', nom: 'Défense', attributs: ['CON', 'AGI', 'PER'] }
    ]
  },
  {
    id: 'social',
    nom: 'Social',
    description: 'Interactions et influence sociale',
    competences: [
      { id: 'persuasion', nom: 'Persuasion', attributs: ['CHA', 'INT', 'RUS'] },
      { id: 'intimidation', nom: 'Intimidation', attributs: ['CHA', 'FOR', 'VOL'] },
      { id: 'tromperie', nom: 'Tromperie', attributs: ['RUS', 'CHA', 'INT'] }
    ]
  }
];

// Traits
export const traits = [
  {
    id: 'vision-nocturne',
    nom: 'Vision Nocturne',
    type: 'avantage',
    description: 'Le personnage possède une vision adaptée aux environnements sombres.',
    effets: 'Ignore les malus de visibilité dus à l\'obscurité partielle.',
    rangMax: 2,
    coutPP: 1,
    categories: ['Physique', 'Sensoriel']
  },
  {
    id: 'resistance-magique',
    nom: 'Résistance Magique',
    type: 'avantage',
    description: 'Le personnage possède une résistance innée aux effets magiques.',
    effets: 'Bonus de +2 par rang aux sauvegardes contre les effets magiques.',
    rangMax: 3,
    coutPP: 1,
    categories: ['Magique', 'Défensif'],
    prerequis: 'MAG 10+'
  },
  {
    id: 'charisme-naturel',
    nom: 'Charisme Naturel',
    type: 'avantage',
    description: 'Le personnage dégage une aura de confiance et d\'autorité naturelle.',
    effets: 'Bonus de +1 par rang aux tests sociaux.',
    rangMax: 2,
    coutPP: 1,
    categories: ['Social', 'Mental'],
    prerequis: 'CHA 12+'
  },
  {
    id: 'mauvaise-vue',
    nom: 'Mauvaise Vue',
    type: 'desavantage',
    description: 'Le personnage souffre d\'une vue déficiente.',
    effets: 'Malus de -2 par rang aux tests de Perception basés sur la vue.',
    rangMax: 2,
    coutPP: 1,
    categories: ['Physique', 'Sensoriel']
  },
  {
    id: 'phobie',
    nom: 'Phobie',
    type: 'desavantage',
    description: 'Le personnage possède une peur irrationnelle et incontrôlable.',
    effets: 'En présence de l\'objet de sa phobie, malus de -2 par rang à tous les tests.',
    rangMax: 3,
    coutPP: 1,
    categories: ['Mental', 'Psychologique']
  }
];

// Origines (races)
export const origines = ['Humain', 'Elfe', 'Nain'];

// Ethnies
export const ethnies = [
  {
    nom: "Humain des Plaines",
    origine: "Humain",
    strongAttributes: ["FOR", "CON", "AGI"],
    weakAttributes: ["INT", "RUS", "CHA"],
    description: "Les humains des plaines sont robustes et endurants.",
    naissanceRanges: {
      STA: { min: -2, max: 4 },
      TAI: { min: -2, max: 4 },
      EGO: { min: -3, max: 3 },
      APP: { min: -4, max: 4 },
      CHN: { min: -6, max: 6 },
      EQU: { min: -2, max: 2 }
    }
  },
  {
    nom: "Elfe des Bois",
    origine: "Elfe",
    strongAttributes: ["AGI", "PER", "SAG"],
    weakAttributes: ["FOR", "CON", "VOL"],
    description: "Les elfes des bois sont gracieux et vifs.",
    naissanceRanges: {
      STA: { min: -4, max: 2 },
      TAI: { min: -2, max: 4 },
      EGO: { min: -2, max: 4 },
      APP: { min: 0, max: 6 },
      CHN: { min: -6, max: 6 },
      EQU: { min: -1, max: 3 }
    }
  },
  {
    nom: "Nain des Forges",
    origine: "Nain",
    strongAttributes: ["CON", "FOR", "VOL"],
    weakAttributes: ["AGI", "CHA", "PER"],
    description: "Les nains des forges sont incroyablement résistants.",
    naissanceRanges: {
      STA: { min: 0, max: 6 },
      TAI: { min: -6, max: -2 },
      EGO: { min: -2, max: 4 },
      APP: { min: -4, max: 2 },
      CHN: { min: -6, max: 6 },
      EQU: { min: -2, max: 2 }
    }
  }
];

// Allégeances
export const allegeances = [
  { nom: "Neutre", strongAttributes: [], weakAttributes: [] },
  { nom: "Magie", strongAttributes: ["MAG"], weakAttributes: ["CHN"] },
  { nom: "Nature", strongAttributes: ["EQU"], weakAttributes: ["MAG", "LOG"] }
];

// Milieux de vie
export const milieux = [
  { nom: "Mixte", strongAttributes: [], weakAttributes: [] },
  { nom: "Citadin", strongAttributes: ["CHA", "INT", "RUS", "VOL", "SAG"], weakAttributes: ["FOR", "DEX", "AGI", "CON", "PER"] },
  { nom: "Forestier", strongAttributes: ["FOR", "DEX", "AGI", "CON", "PER"], weakAttributes: ["CHA", "INT", "RUS", "VOL", "SAG"] }
];

// Personas
export const personas = [
  { nom: "Loup", strongAttributes: ["RUS", "CHA", "AGI"], weakAttributes: ["DEX", "SAG", "PER"] },
  { nom: "Renard", strongAttributes: ["INT", "RUS", "PER"], weakAttributes: ["FOR", "CON", "VOL"] },
  { nom: "Ours", strongAttributes: ["CON", "FOR", "VOL"], weakAttributes: ["AGI", "DEX", "PER"] }
];

// Tempéraments
export const temperaments = ['Alpha', 'Bêta', 'Delta', 'Lambda'];

// Progression de caste
export const casteProgression = [
  {
    rang: 1, titre: "Apprenti", reqXp: 50, reqAptitude: 7, bonusEquilibre: 0, pa: 7,
    avantages: [
      { nom: "Privilège de Caste", description: "Le personnage peut désormais faire appel au privilège de sa caste. Il peut donc dépenser autant de PC que le « privilège PC max » associé à son rang dans les situations couverts par le dit privilège." },
      { nom: "Entraînement aux armures (1)", description: "Reçoit un rang dans le trait d'entraînement associé. L'entraînement permet de réduire les pénalités d'attributs de 2 au rang 1, de 4 au rang 2." },
      { nom: "Maîtrise de caste 1", description: "Affecte la connaissance, la réputation et la récupération de caste." }
    ]
  },
  {
    rang: 2, titre: "Apprenti +", reqXp: 100, reqAptitude: 9, bonusEquilibre: 1, pa: 8,
    avantages: [
      { nom: "Entrainement de Caste (1)", description: "Reçoit un rang dans le trait d'entraînement associé à la caste." },
      { nom: "Formation Initiale", description: "Donne le trait de formation associé à l'attribut de caste principal. Permet d'éviter les maladresses sur les doubles 2." }
    ]
  },
  {
    rang: 3, titre: "Compagnon", reqXp: 200, reqAptitude: 11, bonusEquilibre: 1, pa: 9,
    avantages: [
      { nom: "1er Trait de Caste", description: "Donne le 1er trait de la Caste." },
      { nom: "Maîtrise de caste 2", description: "Affecte la connaissance, la réputation et la récupération de caste." }
    ]
  },
  {
    rang: 4, titre: "Compagnon +", reqXp: 370, reqAptitude: 13, bonusEquilibre: 2, pa: 10,
    avantages: [
      { nom: "Entrainement de Caste (2)", description: "Reçoit un rang supplémentaire dans le trait d'entraînement associé." },
      { nom: "Formation Finale", description: "Donne le trait de formation associé à l'attribut de caste secondaire." },
      { nom: "Action de Caste", description: "Le personnage peut désormais faire appel à l'action spécifique à sa caste." }
    ]
  },
  {
    rang: 5, titre: "Expert", reqXp: 550, reqAptitude: 17, bonusEquilibre: 2, pa: 11,
    avantages: [
      { nom: "Point de Personnage +1", description: "Le personnage reçoit 1 PP supplémentaire." },
      { nom: "Science de la Caste", description: "Donne le trait de science associé à l'attribut de caste principal." },
      { nom: "Maîtrise de caste 3", description: "Affecte la connaissance, la réputation et la récupération de caste." }
    ]
  },
  {
    rang: 6, titre: "Expert +", reqXp: 700, reqAptitude: 21, bonusEquilibre: 3, pa: 12,
    avantages: [
      { nom: "Entrainement de Caste (3)", description: "Reçoit un rang supplémentaire dans le trait d'entraînement associé." },
      { nom: "2nd Trait de Caste", description: "Donne le 2e trait de la Caste." }
    ]
  },
  {
    rang: 7, titre: "Maître", reqXp: 950, reqAptitude: 25, bonusEquilibre: 3, pa: 13,
    avantages: [
      { nom: "Point de Personnage +1", description: "Le personnage reçoit 1 PP supplémentaire." },
      { nom: "Science de la Caste +", description: "Donne la science associée à l'autre attribut de caste." },
      { nom: "Maîtrise de caste 4", description: "Affecte la connaissance, la réputation et la récupération de caste." }
    ]
  },
  {
    rang: 8, titre: "Maître +", reqXp: 1250, reqAptitude: 29, bonusEquilibre: 4, pa: 14,
    avantages: [
      { nom: "Action de Caste améliorée", description: "Version améliorée de l'action de caste, ou action d'une caste partageant des attributs." },
      { nom: "Compétences supérieures", description: "Le personnage peut apprendre ses compétences jusqu'au rang 5." }
    ]
  },
  {
    rang: 9, titre: "Grand Maître", reqXp: 1600, reqAptitude: 33, bonusEquilibre: 4, pa: 15,
    avantages: [
      { nom: "Point de Personnage +1", description: "Le personnage reçoit 1 PP supplémentaire." },
      { nom: "Maîtrise de caste 5", description: "Affecte la connaissance, la réputation et la récupération de caste." }
    ]
  },
  {
    rang: 10, titre: "Grand Maître +", reqXp: 2000, reqAptitude: 37, bonusEquilibre: 5, pa: 16,
    avantages: [
      { nom: "Récupération Supérieure (+1)", description: "La récupération du personnage est améliorée de 1." },
      { nom: "Savoir-Faire", description: "Peut remplacer les dés affichant 1 et 2 par 3 pour les jets basés sur les attributs de caste." }
    ]
  },
  {
    rang: 11, titre: "Sommité", reqXp: 2400, reqAptitude: 42, bonusEquilibre: 5, pa: 17,
    avantages: [
      { nom: "Point de Personnage +1", description: "Le personnage reçoit 1 PP supplémentaire." },
      { nom: "Maîtrise de caste 6", description: "Affecte la connaissance, la réputation et la récupération de caste." }
    ]
  },
  {
    rang: 12, titre: "Sommité +", reqXp: 2800, reqAptitude: 47, bonusEquilibre: 6, pa: 18,
    avantages: [
      { nom: "Groupes supérieurs", description: "Le personnage peut apprendre ses groupes jusqu'au rang 3." },
      { nom: "Attributs supérieurs", description: "Le personnage peut monter tous ses attributs de base à 18." }
    ]
  }
];

// Export par défaut pour compatibilité
const DATA = {
  attributsCorps,
  attributsEsprit,
  attributsMagiques,
  attributsDestin,
  attributsSecondaires,
  attributsPrincipaux,
  attributsSpeciaux,
  rangs,
  sauvegardes,
  ressources,
  traditions,
  valeurDefautPrincipal,
  valeurDefautSecondaire,
  secondaireMin,
  secondaireMax,
  destinees,
  vecus,
  coutSecondaire,
  coutChance,
  typesMémoire,
  typesLesions,
  gravites,
  autresRessources,
  conditions,
  castes,
  competences,
  traits,
  origines,
  ethnies,
  allegeances,
  milieux,
  personas,
  temperaments,
  casteProgression
};

export default DATA;
