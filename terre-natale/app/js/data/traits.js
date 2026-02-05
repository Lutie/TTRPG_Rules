// traits.js - Données des traits

const Traits = {
  get() {
    return [
      {
        id: 'vision-nocturne',
        nom: 'Vision Nocturne',
        type: 'avantage',
        description: 'Le personnage possède une vision adaptée aux environnements sombres.',
        effets: 'Ignore les malus de visibilité dus à l\'obscurité partielle. En obscurité totale, les malus sont réduits de moitié.',
        rangMax: 2,
        coutPP: 1,
        extension: 'Base',
        categories: ['Physique', 'Sensoriel'],
        conditions: ['Permanent'],
        infos: [
          { cle: 'Rang 1', valeur: 'Obscurité partielle ignorée' },
          { cle: 'Rang 2', valeur: 'Obscurité totale réduite de moitié' }
        ],
        prerequis: ''
      },
      {
        id: 'resistance-magique',
        nom: 'Résistance Magique',
        type: 'avantage',
        description: 'Le personnage possède une résistance innée aux effets magiques.',
        effets: 'Bonus de +2 par rang aux sauvegardes contre les effets magiques. Peut dépenser 1 PM pour annuler un effet magique mineur.',
        rangMax: 3,
        coutPP: 1,
        extension: 'Base',
        categories: ['Magique', 'Défensif'],
        conditions: ['Permanent', 'Activation'],
        infos: [
          { cle: 'Sauvegarde', valeur: '+2 par rang contre la magie' },
          { cle: 'Activation', valeur: '1 PM pour annuler un effet mineur' }
        ],
        prerequis: 'MAG 10+'
      },
      {
        id: 'charisme-naturel',
        nom: 'Charisme Naturel',
        type: 'avantage',
        description: 'Le personnage dégage une aura de confiance et d\'autorité naturelle.',
        effets: 'Bonus de +1 par rang aux tests sociaux. Une fois par scène, peut relancer un test social raté.',
        rangMax: 2,
        coutPP: 1,
        extension: 'Base',
        categories: ['Social', 'Mental'],
        conditions: ['Permanent', 'Scène'],
        infos: [
          { cle: 'Bonus', valeur: '+1 par rang aux tests sociaux' },
          { cle: 'Relance', valeur: '1/scène sur test social raté' }
        ],
        prerequis: 'CHA 12+'
      },
      {
        id: 'mauvaise-vue',
        nom: 'Mauvaise Vue',
        type: 'desavantage',
        description: 'Le personnage souffre d\'une vue déficiente.',
        effets: 'Malus de -2 par rang aux tests de Perception basés sur la vue et aux attaques à distance au-delà de la portée courte.',
        rangMax: 2,
        coutPP: 1,
        extension: 'Base',
        categories: ['Physique', 'Sensoriel'],
        conditions: ['Permanent'],
        infos: [
          { cle: 'Malus', valeur: '-2 par rang aux tests de vue' }
        ],
        prerequis: ''
      },
      {
        id: 'phobie',
        nom: 'Phobie',
        type: 'desavantage',
        description: 'Le personnage possède une peur irrationnelle et incontrôlable.',
        effets: 'En présence de l\'objet de sa phobie, le personnage subit un malus de -2 par rang à tous ses tests. Doit réussir un test de Volonté pour ne pas fuir.',
        rangMax: 3,
        coutPP: 1,
        extension: 'Base',
        categories: ['Mental', 'Psychologique'],
        conditions: ['Permanent', 'Situationnel'],
        infos: [
          { cle: 'Malus', valeur: '-2 par rang en présence du stimulus' },
          { cle: 'Fuite', valeur: 'Test de VOL pour ne pas fuir' }
        ],
        prerequis: ''
      }
    ];
  }
};
