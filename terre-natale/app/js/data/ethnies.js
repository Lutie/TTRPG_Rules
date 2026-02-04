// ethnies.js - Données des ethnies

const Ethnies = {
  get() {
    return [
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
  }
};
