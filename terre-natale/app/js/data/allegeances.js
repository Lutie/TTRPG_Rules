// allegeances.js - Données des allégeances

const Allegeances = {
  get() {
    return [
      { nom: "Neutre", strongAttributes: [], weakAttributes: [] },
      { nom: "Magie", strongAttributes: ["MAG"], weakAttributes: ["CHN"] },
      { nom: "Nature", strongAttributes: ["EQU"], weakAttributes: ["MAG", "LOG"] }
    ];
  }
};
