// competences.js - Données des groupes de compétences et compétences

const Competences = {
  get() {
    return [
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
  }
};
