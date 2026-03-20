// data/index.js - Données statiques pour Terre Natale
// NOTE: traits.json est AUTO-GÉNÉRÉ via tools/generate_traits_js.py (voir ce script pour mise à jour)
import traits from './traits.json';
import _rawEthnies from './ethnies.json';
import competences from './competences.json';
import categoriesCompetences from './categories_competences.json';
import _castes from './castes.json';
import _manoeuvresJson from './manoeuvres.json';
import _prouessesJson from './prouesses.json';
import competencesMagie from './competences_magie.json';
import categoriesMagie from './categories_magie.json';

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
  { id: 'commun_des_mortels', nom: 'Commun des Mortels', pa: 200, pp: 2, maxAttribut: 15 },
  { id: 'destin_honorable', nom: 'Destin Honorable', pa: 300, pp: 4, maxAttribut: 16 },
  { id: 'marche_de_la_gloire', nom: 'Marche de la Gloire', pa: 400, pp: 6, maxAttribut: 17 },
  { id: 'arpenteur_heroique', nom: 'Arpenteur Héroïque', pa: 500, pp: 8, maxAttribut: 18 },
  { id: 'dieu_parmi_les_hommes', nom: 'Dieu parmi les Hommes', pa: 600, pp: 10, maxAttribut: 19 }
];

export const vecus = [
  { id: 'aucun', nom: 'Aucun', xp: 200, po: 10, maxGroupe: 1, maxCompetence: 1 },
  { id: 'notable', nom: 'Notable', xp: 300, po: 15, maxGroupe: 1, maxCompetence: 2 },
  { id: 'admirable', nom: 'Admirable', xp: 400, po: 20, maxGroupe: 2, maxCompetence: 2 },
  { id: 'spectaculaire', nom: 'Spectaculaire', xp: 500, po: 25, maxGroupe: 2, maxCompetence: 3 },
  { id: 'legendaire', nom: 'Légendaire', xp: 600, po: 30, maxGroupe: 2, maxCompetence: 4 }
];

export const coutSecondaire = { 8: 5, 9: 2, 10: 0, 11: -4, 12: -9 };
export const coutChance = { 8: 9, 9: 5, 10: 0, 11: -6, 12: -13 };

export const manoeuvres = _manoeuvresJson.map((m, i) => ({ id: i + 1, ...m }));

export const sorts = [
  { id: 1, nom: 'Sort 1', description: '' },
  { id: 2, nom: 'Sort 2', description: '' }
];

export const patrons = [
  { id: 1, nom: 'Patron 1', description: '' },
  { id: 2, nom: 'Patron 2', description: '' }
];

export const prouesses = _prouessesJson.map((p, i) => ({ id: i + 1, ...p }));

export const typesMémoire = [
  { id: 0, nom: 'Manœuvre', liste: manoeuvres },
  { id: 1, nom: 'Sort',     liste: sorts },
  { id: 2, nom: 'Patron',   liste: patrons },
  { id: 3, nom: 'Prouesse', liste: prouesses },
  { id: 4, nom: 'Autre',    liste: null }
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

// Castes — importées depuis ./castes.json (auto-généré via tools/castes.py)
export const castes = _castes;

// Compétences — importées depuis ./competences.json et ./categories_competences.json (auto-généré)
export { competences, categoriesCompetences };

// Compétences de Magie — importées depuis ./competences_magie.json et ./categories_magie.json
export { competencesMagie, categoriesMagie };

// Traits — importés depuis ./traits.json (AUTO-GÉNÉRÉ via tools/generate_traits_js.py → maintenant generate_traits_json.py)
export { traits };

// Origines (races)
export const origines = [
  { id: 'humain',       nom: 'Humain' },
  { id: 'elfe',         nom: 'Elfe' },
  { id: 'nain',         nom: 'Nain' },
  { id: 'feral',        nom: 'Feral' },
  { id: 'cursed-feral', nom: 'Cursed Feral' },
  { id: 'demie',        nom: 'Demie' },
  { id: 'semie',        nom: 'Semie' },
  { id: 'vermine',      nom: 'Vermine' },
];

// Map race string (from ethnies.json) → origine id
const RACE_TO_ID = {
  'Human':        'humain',
  'Elven':        'elfe',
  'Dwarf':        'nain',
  'Feral':        'feral',
  'Cursed Feral': 'cursed-feral',
  'Demie':        'demie',
  'Semie':        'semie',
  'Vermine':      'vermine',
};

// Aplatit attributs_forts / attributs_faibles en liste d'IDs simple
// { choice: ['MAG','LOG'] } → ['MAG','LOG']  ;  { id:'PER', fois:2 } → ['PER','PER']
function _flattenAttrs(list) {
  return (list || []).flatMap(a =>
    typeof a === 'string'  ? [a]
    : a.choice             ? a.choice
    : Array(a.fois || 1).fill(a.id)
  );
}

// Ethnies — source : docs/ethnies/ethnies.md via tools/parse_ethnies.py
export const ethnies = _rawEthnies.map(e => ({
  ...e,
  origine:          e.race,
  origineId:        RACE_TO_ID[e.race] || null,
  strongAttributes: _flattenAttrs(e.attributs_forts),
  weakAttributes:   _flattenAttrs(e.attributs_faibles),
}));

// Allégeances
export const allegeances = [
  { id: "neutre", nom: "Neutre", strongAttributes: [], weakAttributes: [] },
  { id: "magie", nom: "Magie", strongAttributes: ["MAG"], weakAttributes: ["CHN"] },
  { id: "nature", nom: "Nature", strongAttributes: ["EQU"], weakAttributes: ["MAG", "LOG"] }
];

// Milieux de vie
export const milieux = [
  { id: "mixte", nom: "Mixte", strongAttributes: [], weakAttributes: [] },
  { id: "citadin", nom: "Citadin", strongAttributes: ["CHA", "INT", "RUS", "VOL", "SAG"], weakAttributes: ["FOR", "DEX", "AGI", "CON", "PER"] },
  { id: "forestier", nom: "Forestier", strongAttributes: ["FOR", "DEX", "AGI", "CON", "PER"], weakAttributes: ["CHA", "INT", "RUS", "VOL", "SAG"] }
];

// Personas
export const personas = [
  { id: "loup", nom: "Loup", strongAttributes: ["RUS", "CHA", "AGI"], weakAttributes: ["DEX", "SAG", "PER"] },
  { id: "renard", nom: "Renard", strongAttributes: ["INT", "RUS", "PER"], weakAttributes: ["FOR", "CON", "VOL"] },
  { id: "ours", nom: "Ours", strongAttributes: ["CON", "FOR", "VOL"], weakAttributes: ["AGI", "DEX", "PER"] }
];

// Tempéraments
export const temperaments = [
  { id: 'alpha', nom: 'Alpha' },
  { id: 'beta', nom: 'Bêta' },
  { id: 'delta', nom: 'Delta' },
  { id: 'lambda', nom: 'Lambda' }
];

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
  categoriesCompetences,
  competencesMagie,
  categoriesMagie,
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
