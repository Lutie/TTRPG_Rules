// Compétences de Magie — hardcodé, ne pas modifier via script

const TRADITION_CHOICES = [
  {
    group: 'Domaine',
    options: ['Feu', 'Glace', 'Foudre', 'Terre', 'Eau', 'Air', 'Lumière', 'Ombre', 'Loi', 'Chaos', 'Sacre', 'Impie', 'Vie', 'Mort', 'Corps', 'Esprit', 'Faune', 'Flore', 'Mental', 'Charme', 'Arcane', 'Magie', 'Nature', 'Toxique', 'Illusion', 'Savoir', 'Vision', 'Acier', 'Guerre', 'Vide'],
  },
  {
    group: 'École',
    options: ['École', 'Destruction', 'Restauration', 'Bénédiction', 'Malédiction', 'Invocation', 'Abjuration', 'Divination', 'Évocation', 'Conjuration', 'Altération'],
  },
];

export const competencesMagie = [
  // Tradition — domaine ou école à choisir dans une liste
  { id: 'tradition-domaine', nom: '< Domaine ou École de Magie >', categorie: 'magie', groupe: 'tradition', sousGroupe: null, attributs: ['MAG'], secondaires: [], attrVariable: false, libre: true, limitant: false, choices: TRADITION_CHOICES },
  // Arcanes
  { id: 'erudis',   nom: 'Érudis',   categorie: 'magie', groupe: 'arcanes', sousGroupe: null, attributs: ['INT'], secondaires: [], attrVariable: false, libre: false, limitant: false },
  { id: 'focus',    nom: 'Focus',    categorie: 'magie', groupe: 'arcanes', sousGroupe: null, attributs: ['SAG'], secondaires: [], attrVariable: false, libre: false, limitant: false },
  { id: 'imperius', nom: 'Impérius', categorie: 'magie', groupe: 'arcanes', sousGroupe: null, attributs: ['CHA'], secondaires: [], attrVariable: false, libre: false, limitant: false },
  { id: 'denis',    nom: 'Denis',    categorie: 'magie', groupe: 'arcanes', sousGroupe: null, attributs: ['VOL'], secondaires: [], attrVariable: false, libre: false, limitant: false },
  { id: 'aldus',    nom: 'Aldus',    categorie: 'magie', groupe: 'arcanes', sousGroupe: null, attributs: ['RUS'], secondaires: [], attrVariable: false, libre: false, limitant: false },
  { id: 'modus',    nom: 'Modus',    categorie: 'magie', groupe: 'arcanes', sousGroupe: null, attributs: ['MAG'], secondaires: [], attrVariable: false, libre: false, limitant: false },
  { id: 'rituel',   nom: 'Rituel',   categorie: 'magie', groupe: 'arcanes', sousGroupe: null, attributs: [],     secondaires: [], attrVariable: false, libre: false, limitant: false, attrTradition: true },
  { id: 'apertus',  nom: 'Apertus',  categorie: 'magie', groupe: 'arcanes', sousGroupe: null, attributs: ['MAG'], secondaires: [], attrVariable: false, libre: false, limitant: false },
];

export const categoriesMagie = [
  {
    id: 'magie',
    nom: 'Les Compétences de Magie',
    groupes: [
      {
        id: 'tradition',
        nom: 'Tradition',
        limitant: false,
        libre: false,
        competences: ['tradition-domaine'],
      },
      {
        id: 'arcanes',
        nom: 'Arcanes',
        limitant: false,
        libre: false,
        competences: ['erudis', 'focus', 'imperius', 'denis', 'aldus', 'modus', 'rituel', 'apertus'],
      },
    ],
  },
];
