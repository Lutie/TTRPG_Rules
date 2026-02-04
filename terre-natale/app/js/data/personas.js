// personas.js - Données des personas

const Personas = {
  get() {
    return [
      { nom: "Loup", strongAttributes: ["RUS", "CHA", "AGI"], weakAttributes: ["DEX", "SAG", "PER"] },
      { nom: "Renard", strongAttributes: ["INT", "RUS", "PER"], weakAttributes: ["FOR", "CON", "VOL"] },
      { nom: "Ours", strongAttributes: ["CON", "FOR", "VOL"], weakAttributes: ["AGI", "DEX", "PER"] }
    ];
  }
};
