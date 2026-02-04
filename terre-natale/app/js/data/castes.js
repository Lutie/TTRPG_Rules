// castes.js - Données des castes

const Castes = {
  get() {
    return [
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
  }
};
