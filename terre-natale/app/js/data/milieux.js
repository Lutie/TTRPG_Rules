// milieux.js - Données des milieux de vie

const Milieux = {
  get() {
    return [
      { nom: "Mixte", strongAttributes: [], weakAttributes: [] },
      { nom: "Citadin", strongAttributes: ["CHA", "INT", "RUS", "VOL", "SAG"], weakAttributes: ["FOR", "DEX", "AGI", "CON", "PER"] },
      { nom: "Forestier", strongAttributes: ["FOR", "DEX", "AGI", "CON", "PER"], weakAttributes: ["CHA", "INT", "RUS", "VOL", "SAG"] }
    ];
  }
};
