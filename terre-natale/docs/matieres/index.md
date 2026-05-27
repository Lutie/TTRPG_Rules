# Compendium des Matières

<div id="mat-app">

<div class="mat-filters">
  <input type="text" id="mat-search" placeholder="Rechercher…" />
  <select id="mat-type">
    <option value="">Tous les types</option>
    <option value="Alliage">Alliage</option>
<option value="Bois">Bois</option>
<option value="Cuir">Cuir</option>
<option value="Magicite">Magicite</option>
<option value="Métal">Métal</option>
<option value="Pierre">Pierre</option>
<option value="Tissu">Tissu</option>
  </select>
  <select id="mat-niveau">
    <option value="">Tous niveaux</option>
    <option value="1">Niveau 1</option>
<option value="2">Niveau 2</option>
<option value="3">Niveau 3</option>
<option value="4">Niveau 4</option>
<option value="5">Niveau 5</option>
<option value="X">Niveau X</option>
  </select>
  <div class="mat-checks">
    <label><input type="checkbox" id="f-armes" /> Armes</label>
    <label><input type="checkbox" id="f-outils" /> Outils</label>
    <label><input type="checkbox" id="f-armures" /> Armures</label>
    <label><input type="checkbox" id="f-bijoux" /> Bijoux</label>
    <label><input type="checkbox" id="f-foca" /> Focalisateurs</label>
  </div>
  <span id="mat-count"></span>
</div>

<table id="mat-table">
  <thead>
    <tr>
      <th class="col-nom" data-col="nom">Nom ↕</th>
      <th class="col-type" data-col="type">Type ↕</th>
      <th class="col-niv" data-col="niveau">Niv. ↕</th>
      <th class="col-app">Usage</th>
      <th class="col-effet">Effet</th>
      <th class="col-special">Effet Spécial</th>
      <th class="col-alt">Alternative</th>
    </tr>
  </thead>
  <tbody id="mat-tbody"></tbody>
</table>

</div>

<style>
#mat-app { font-size: 0.85em; }
.mat-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5em;
  margin-bottom: 1em;
  align-items: center;
}
.mat-filters input[type=text] {
  flex: 1;
  min-width: 200px;
  padding: 0.35em 0.6em;
  border: 1px solid #aaa;
  border-radius: 4px;
  font-size: 0.9em;
  background: var(--md-default-bg-color, #fff);
  color: var(--md-default-fg-color, #000);
}
.mat-filters select {
  padding: 0.35em 0.6em;
  border: 1px solid #aaa;
  border-radius: 4px;
  font-size: 0.9em;
  background: var(--md-default-bg-color, #fff);
  color: var(--md-default-fg-color, #000);
}
.mat-checks {
  display: flex;
  gap: 0.8em;
  align-items: center;
  flex-wrap: wrap;
}
.mat-checks label {
  display: flex;
  align-items: center;
  gap: 0.3em;
  cursor: pointer;
  font-size: 0.9em;
}
#mat-count {
  margin-left: auto;
  color: #888;
  font-size: 0.85em;
  white-space: nowrap;
}
#mat-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}
#mat-table th, #mat-table td {
  padding: 0.35em 0.5em;
  border: 1px solid var(--md-default-fg-color--lightest, #e0e0e0);
  vertical-align: top;
  word-break: break-word;
}
#mat-table th {
  background: var(--md-primary-fg-color, #3f51b5);
  color: var(--md-primary-bg-color, #fff);
  cursor: pointer;
  user-select: none;
}
#mat-table th:hover { opacity: 0.85; }
.col-nom    { width: 9%; }
.col-type   { width: 7%; }
.col-niv    { width: 4%; text-align: center; }
.col-app    { width: 10%; }
.col-effet  { width: 28%; }
.col-special{ width: 21%; }
.col-alt    { width: 21%; }
#mat-table tbody tr:nth-child(even) {
  background: var(--md-default-bg-color--light, #f9f9f9);
}
#mat-table tbody tr:hover {
  background: var(--md-accent-fg-color--transparent, #e8eaf6);
}
.mat-tag {
  display: inline-block;
  font-size: 0.75em;
  padding: 0.1em 0.4em;
  border-radius: 3px;
  background: var(--md-primary-fg-color, #3f51b5);
  color: var(--md-primary-bg-color, #fff);
  margin: 0.1em;
}
</style>

<script>
(function() {
  const DATA = [
  {
    "nom": "Bovidé",
    "type": "Cuir",
    "niveau": 1,
    "effet": "Intégrité de l'objet +2Q",
    "armes": true,
    "outils": false,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Porcidé",
    "type": "Cuir",
    "niveau": 1,
    "effet": "Ajustement aux tests de musculation +Q",
    "armes": true,
    "outils": false,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Equidé",
    "type": "Cuir",
    "niveau": 1,
    "effet": "Ajustement aux tests de course +Q",
    "armes": true,
    "outils": false,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Canidé",
    "type": "Cuir",
    "niveau": 2,
    "effet": "Défense passive de DEX +Q",
    "armes": true,
    "outils": false,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Vivipare",
    "type": "Cuir",
    "niveau": 2,
    "effet": "Défense passive de AGI +Q",
    "armes": true,
    "outils": false,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Crocolidé",
    "type": "Cuir",
    "niveau": 2,
    "effet": "Défense passive de FOR +Q",
    "armes": true,
    "outils": false,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Ursidé",
    "type": "Cuir",
    "niveau": 2,
    "effet": "Défense passive de CON +Q",
    "armes": true,
    "outils": false,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Félin",
    "type": "Cuir",
    "niveau": 2,
    "effet": "Défense passive de PER +Q",
    "armes": true,
    "outils": false,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Cervidé",
    "type": "Cuir",
    "niveau": 2,
    "effet": "Ajustement aux tests d'endurance +Q",
    "armes": true,
    "outils": false,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Galuchat",
    "type": "Cuir",
    "niveau": 2,
    "effet": "Ajustement aux tests de maitrise +Q",
    "armes": true,
    "outils": false,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Prédateur",
    "type": "Cuir",
    "niveau": 2,
    "effet": "Ajustement aux tests d'intimidation +Q",
    "armes": true,
    "outils": false,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Ariline",
    "type": "Cuir",
    "niveau": 3,
    "effet": "Sauvegarde Réflexes ajustement +Q",
    "armes": true,
    "outils": false,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Requin",
    "type": "Cuir",
    "niveau": 3,
    "effet": "Ajustement aux tests de natation +Q (tests de combat en situation marine aussi)",
    "armes": true,
    "outils": false,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Batracien",
    "type": "Cuir",
    "niveau": 3,
    "effet": "Ajustement aux tests d'esquive +Q",
    "armes": true,
    "outils": false,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Griffosire",
    "type": "Cuir",
    "niveau": 4,
    "effet": "Pénalité de l'objet (sur l'allure etc) -Q",
    "armes": true,
    "outils": false,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Drakarien",
    "type": "Cuir",
    "niveau": 4,
    "effet": "Résistance élémentaire (un élément selon race) +2Q",
    "armes": true,
    "outils": false,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Wyverne",
    "type": "Cuir",
    "niveau": 4,
    "effet": "Ajustement aux tests d'evasion +Q",
    "armes": true,
    "outils": false,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Guivre",
    "type": "Cuir",
    "niveau": 4,
    "effet": "Génère Q PE temporaires par tours, si initiative mixte ou physique",
    "armes": true,
    "outils": false,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Chimère",
    "type": "Cuir",
    "niveau": 4,
    "effet": "Défense minimum attributs du corps 15+Q (10 si choqué)",
    "armes": true,
    "outils": false,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Dracosire",
    "type": "Cuir",
    "niveau": 5,
    "effet": "Criticité adverse réduite de Q",
    "armes": true,
    "outils": false,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Démon",
    "type": "Cuir",
    "niveau": 5,
    "effet": "Ajustement aux tests de duperie +Q",
    "armes": true,
    "outils": false,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Kirin",
    "type": "Cuir",
    "niveau": 5,
    "effet": "Chaque tour le personnage reçoit X PK temporaire(s)",
    "armes": true,
    "outils": false,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Dandelion",
    "type": "Cuir",
    "niveau": 5,
    "effet": "Génère Q PC temporaires par tours",
    "armes": true,
    "outils": false,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Lycra",
    "type": "Tissu",
    "niveau": 1,
    "effet": "Gravité (des traumas) reçues -1-Q",
    "armes": false,
    "outils": false,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Toile",
    "type": "Tissu",
    "niveau": 1,
    "effet": "Absorption Mentale +Q",
    "armes": false,
    "outils": false,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Jute",
    "type": "Tissu",
    "niveau": 1,
    "effet": "Absorption Magique +Q",
    "armes": false,
    "outils": false,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Coton",
    "type": "Tissu",
    "niveau": 1,
    "effet": "Ajustement aux défenses/sauvegardes contre les énergies +Q (feu, froid, elec)",
    "armes": false,
    "outils": false,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Laine",
    "type": "Tissu",
    "niveau": 1,
    "effet": "Ajustement aux tests de prestige +Q",
    "armes": false,
    "outils": false,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Ramie",
    "type": "Tissu",
    "niveau": 2,
    "effet": "Défense minimum attributs de l'esprit 15+Q (10 si choqué)",
    "armes": false,
    "outils": false,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Veloutine",
    "type": "Tissu",
    "niveau": 2,
    "effet": "Protection contre les énergies +Q",
    "armes": false,
    "outils": false,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Velours",
    "type": "Tissu",
    "niveau": 2,
    "effet": "Protection Mentale ajustement +Q",
    "armes": false,
    "outils": false,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Samit",
    "type": "Tissu",
    "niveau": 2,
    "effet": "Test de sauvegarde contre la déconcentration +Q",
    "armes": false,
    "outils": false,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Chanvre",
    "type": "Tissu",
    "niveau": 2,
    "effet": "Action mentale pénalité des maladresses -Q",
    "armes": false,
    "outils": false,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Satin",
    "type": "Tissu",
    "niveau": 2,
    "effet": "Chaque tour le personnage reçoit X PS temporaire(s)",
    "armes": false,
    "outils": false,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Nylon",
    "type": "Tissu",
    "niveau": 2,
    "effet": "Bonus d'ajustement en initiative +Q",
    "armes": false,
    "outils": false,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Epsylon",
    "type": "Tissu",
    "niveau": 2,
    "effet": "Immunité à une école de magie (infusée lors de la création) (réduction de la Magnitude du sort/sauvegardes +Q)",
    "armes": false,
    "outils": false,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Artygon",
    "type": "Tissu",
    "niveau": 2,
    "effet": "Défenses passives magique ajustement +Q",
    "armes": false,
    "outils": false,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Valespire",
    "type": "Tissu",
    "niveau": 2,
    "effet": "Génère Q PE temporaires par tours, si initiative mixte ou mentale",
    "armes": false,
    "outils": false,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Vertigon",
    "type": "Tissu",
    "niveau": 2,
    "effet": "Décharge des enchantements négatifs +Q",
    "armes": false,
    "outils": false,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Mohair",
    "type": "Tissu",
    "niveau": 3,
    "effet": "Sauvegarde Détermination ajustement +Q",
    "armes": false,
    "outils": false,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Soie",
    "type": "Tissu",
    "niveau": 3,
    "effet": "Sauvegarde Sang Froid ajustement +Q",
    "armes": false,
    "outils": false,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Alapaga",
    "type": "Tissu",
    "niveau": 3,
    "effet": "Protection contre la magie +Q",
    "armes": false,
    "outils": false,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Angora",
    "type": "Tissu",
    "niveau": 3,
    "effet": "Les négociations sont 10+5Q% plus favorable (seulement sur la partie \"négociée\", pas l'ensemble)",
    "armes": false,
    "outils": false,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Carmeline",
    "type": "Tissu",
    "niveau": 3,
    "effet": "Les sorts positifs reçus ont une magnitude augmentée de Q",
    "armes": false,
    "outils": false,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Cachemire",
    "type": "Tissu",
    "niveau": 3,
    "effet": "Un attribut de l'esprit (infusé) défense passif +Q",
    "armes": false,
    "outils": false,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Brocart",
    "type": "Tissu",
    "niveau": 4,
    "effet": "Les sorts négatifs reçus ont une magnitude réduite de Q",
    "armes": false,
    "outils": false,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Jute d'araignée",
    "type": "Tissu",
    "niveau": 4,
    "effet": "Hâte mentale (vitesse/rapidité) ajustement +Q",
    "armes": false,
    "outils": false,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Laine d'Orée",
    "type": "Tissu",
    "niveau": 4,
    "effet": "Sauvegarde Fortune ajustement +Q",
    "armes": false,
    "outils": false,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Soie Rosalienne",
    "type": "Tissu",
    "niveau": 4,
    "effet": "Bûlures de Mana réduite de 2Q (mais pas le drain)",
    "armes": false,
    "outils": false,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Coton azure",
    "type": "Tissu",
    "niveau": 4,
    "effet": "Sauvegarde Intuition ajustement +Q",
    "armes": false,
    "outils": false,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Flanelle Sylvanienne",
    "type": "Tissu",
    "niveau": 4,
    "effet": "Génère Q PM temporaires par tours",
    "armes": false,
    "outils": false,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Voile Immatériel",
    "type": "Tissu",
    "niveau": 5,
    "effet": "Génère 5Q% de couverture en toute situation",
    "armes": false,
    "outils": false,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Tulle",
    "type": "Tissu",
    "niveau": 5,
    "effet": "Les relances en défense requière 1 PK de moins",
    "armes": false,
    "outils": false,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Tissue Néant",
    "type": "Tissu",
    "niveau": 5,
    "effet": "Si succombe alors reste en vie, une fois par jour",
    "armes": false,
    "outils": false,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Cèdre",
    "type": "Bois",
    "niveau": 1,
    "effet": "Vitesse (via l'objet) +Q",
    "armes": true,
    "outils": true,
    "armures": false,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Chêne",
    "type": "Bois",
    "niveau": 1,
    "effet": "Déviation (via l'objet) +Q",
    "armes": true,
    "outils": true,
    "armures": false,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Saule",
    "type": "Bois",
    "niveau": 1,
    "effet": "Rapidité (via l'objet) +Q",
    "armes": true,
    "outils": true,
    "armures": false,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Hêtre",
    "type": "Bois",
    "niveau": 1,
    "effet": "Solidité de l'objet +Q",
    "armes": true,
    "outils": true,
    "armures": false,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Acacia",
    "type": "Bois",
    "niveau": 1,
    "effet": "Attrition via l'objet +Q",
    "armes": true,
    "outils": true,
    "armures": false,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Pin",
    "type": "Bois",
    "niveau": 1,
    "effet": "Précision via l'objet +Q",
    "armes": true,
    "outils": true,
    "armures": false,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Châtaigner",
    "type": "Bois",
    "niveau": 2,
    "effet": "Ajustement aux actions tactique +Q",
    "armes": true,
    "outils": true,
    "armures": false,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Noyer",
    "type": "Bois",
    "niveau": 2,
    "effet": "Ajustement aux actions d'attaque +Q",
    "armes": true,
    "outils": true,
    "armures": false,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Bouleau",
    "type": "Bois",
    "niveau": 2,
    "effet": "Ajustement aux actions de défense +Q",
    "armes": true,
    "outils": true,
    "armures": false,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Frêne",
    "type": "Bois",
    "niveau": 2,
    "effet": "Impact via l'objet +Q",
    "armes": true,
    "outils": true,
    "armures": false,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "?",
    "type": "Bois",
    "niveau": 2,
    "effet": "Perforation via l'objet +Q",
    "armes": true,
    "outils": true,
    "armures": false,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Bambou",
    "type": "Bois",
    "niveau": 2,
    "effet": "Rapidié et Vitesse (hâte) +Q mais solidité -Q",
    "armes": true,
    "outils": true,
    "armures": false,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Bouleau",
    "type": "Bois",
    "niveau": 2,
    "effet": "?",
    "armes": true,
    "outils": true,
    "armures": false,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "If",
    "type": "Bois",
    "niveau": 2,
    "effet": "Maitrise via l'objet +Q",
    "armes": true,
    "outils": true,
    "armures": false,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Orme",
    "type": "Bois",
    "niveau": 2,
    "effet": "Ajustement des outils +Q",
    "armes": true,
    "outils": true,
    "armures": false,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Epicéa",
    "type": "Bois",
    "niveau": 3,
    "effet": "Si l'attaque touche la cible, elle perd X points spirituels (PS)",
    "armes": true,
    "outils": true,
    "armures": false,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Erable",
    "type": "Bois",
    "niveau": 3,
    "effet": "Critique de l'objet +Q",
    "armes": true,
    "outils": true,
    "armures": false,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Merisier",
    "type": "Bois",
    "niveau": 3,
    "effet": "L'objet a 5% de chances d'ignorer ou couverture",
    "armes": true,
    "outils": true,
    "armures": false,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Ebène",
    "type": "Bois",
    "niveau": 3,
    "effet": "Expertise Physique ajustement +Q",
    "armes": true,
    "outils": true,
    "armures": false,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Acajou",
    "type": "Bois",
    "niveau": 3,
    "effet": "Chaque coups porté décharge les charges des enchantements de Q (sur la cible)",
    "armes": true,
    "outils": true,
    "armures": false,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Rosaline",
    "type": "Bois",
    "niveau": 4,
    "effet": "Bois le sang : 3 PV infligés octrois 1 d'adrénaline",
    "armes": true,
    "outils": true,
    "armures": false,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Chêne Noir",
    "type": "Bois",
    "niveau": 4,
    "effet": "Cout des relances en karma via l'objet -1",
    "armes": true,
    "outils": true,
    "armures": false,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Cèdre Blanc",
    "type": "Bois",
    "niveau": 4,
    "effet": "Drain de mana des sorts lancés via l'objet -1 et drain minimum -1",
    "armes": true,
    "outils": true,
    "armures": false,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Boissendre",
    "type": "Bois",
    "niveau": 4,
    "effet": "Les soints magiques prodigués via l'objet génèrent 2 PF de moins",
    "armes": true,
    "outils": true,
    "armures": false,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Syldavigne",
    "type": "Bois",
    "niveau": 4,
    "effet": "Les actions d'opportunités reçoivent +Q d'ajustement aux tests et jets",
    "armes": true,
    "outils": true,
    "armures": false,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Grand chêne",
    "type": "Bois",
    "niveau": 5,
    "effet": "Lorsque l'objet sert à la défense les jets adversent sont désavantagés, que la défense réussisse ou non",
    "armes": true,
    "outils": true,
    "armures": false,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Vivracine",
    "type": "Bois",
    "niveau": 5,
    "effet": "Tous les 2 PK consommés octroient 1 PE temporaire",
    "armes": true,
    "outils": true,
    "armures": false,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Yggdrasil",
    "type": "Bois",
    "niveau": 5,
    "effet": "Si l'attaque touche la cible, elle perd X points karmiques (PK)",
    "armes": true,
    "outils": true,
    "armures": false,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Bronze",
    "type": "Métal",
    "niveau": 1,
    "effet": "Sauvegarde Robustesse ajustement +Q",
    "armes": true,
    "outils": true,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Carbone",
    "type": "Métal",
    "niveau": 1,
    "effet": "Déviation vs énergie +3Q",
    "armes": true,
    "outils": true,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "Pas de pertes en ratant l'artisanat",
    "alternative": "Absorption vs énergie +2Q"
  },
  {
    "nom": "Fer",
    "type": "Métal",
    "niveau": 1,
    "effet": "Intégrité +2Q",
    "armes": true,
    "outils": true,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "Ignore mCON en ABS (double les malus if any)",
    "alternative": "//"
  },
  {
    "nom": "Argent",
    "type": "Métal",
    "niveau": 2,
    "effet": "Allergène vs impies (expertise, dégats et attrition +Q)",
    "armes": true,
    "outils": true,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "Avantage Sauvegardes vs Maladie, Venins, Poisons",
    "alternative": "Immunité vs impies (sauvegardes/résistance +Q)"
  },
  {
    "nom": "Mithril",
    "type": "Métal",
    "niveau": 2,
    "effet": "Charge -Q",
    "armes": true,
    "outils": true,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "Pas de test de solidité sur un critique (de soi en échec ou adverse en réussite)",
    "alternative": "//"
  },
  {
    "nom": "Fer Noir",
    "type": "Métal",
    "niveau": 2,
    "effet": "Si attaque > défense FOR +5 => perforation +2Q",
    "armes": true,
    "outils": true,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "Les dés de jet affichants 8 octroient +2",
    "alternative": "Résistance contre contondant +2Q"
  },
  {
    "nom": "Fer Blanc",
    "type": "Métal",
    "niveau": 2,
    "effet": "Si attaque > défense DEX +5 => perforation +2Q",
    "armes": true,
    "outils": true,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "Maladesse malus -2 (ne peux pas être positif)",
    "alternative": "Résistance contre tranchant +2Q"
  },
  {
    "nom": "Fer Bleu",
    "type": "Métal",
    "niveau": 2,
    "effet": "Si attaque > défense AGI +5 => perforation +2Q",
    "armes": true,
    "outils": true,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "Les dés de jet affichants <=3 octroient +1",
    "alternative": "Résistance contre perforant +2Q"
  },
  {
    "nom": "Malachite",
    "type": "Métal",
    "niveau": 2,
    "effet": "Jets critique +2Q",
    "armes": true,
    "outils": true,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "Exploit bonus +2",
    "alternative": "Résistance vs critiques +2Q"
  },
  {
    "nom": "Platine",
    "type": "Métal",
    "niveau": 2,
    "effet": "Allergène vs venins/poisons/acides",
    "armes": true,
    "outils": true,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "Défenses contres les tactiques +1",
    "alternative": "Immunité vs venins/poisons/acides (sauvegardes/résistance +Q)"
  },
  {
    "nom": "Altium",
    "type": "Métal",
    "niveau": 2,
    "effet": "Ajustement +Q avec les mécanismes de l'objet (lors de l'activation)",
    "armes": true,
    "outils": true,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "Améliorations technologiques maximum possible +2",
    "alternative": "Ajustement +Q avec les mécanismes de l'objet (lors de l'activation)"
  },
  {
    "nom": "Titane",
    "type": "Métal",
    "niveau": 2,
    "effet": "Déviation des défenses +Q",
    "armes": true,
    "outils": true,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "Avantage solidité",
    "alternative": "Protection Physique ajustement +Q"
  },
  {
    "nom": "Mercurite",
    "type": "Métal",
    "niveau": 2,
    "effet": "Charge d'huile/poison/substances +2Q",
    "armes": true,
    "outils": true,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "L'objet régénère lentement son intégrité (2 par scène, max 4 par jours)",
    "alternative": "Résistance aux conditions de ruptures +2Q"
  },
  {
    "nom": "Mégalite",
    "type": "Métal",
    "niveau": 2,
    "effet": "Malice +1+Q",
    "armes": true,
    "outils": true,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "Améliorations antiques maximum possible +2",
    "alternative": "Résistance aux conditions physiques +1+Q"
  },
  {
    "nom": "Corentine",
    "type": "Métal",
    "niveau": 2,
    "effet": "Gravité (des blessures) +1+Q",
    "armes": true,
    "outils": true,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "A chaque coups portés, si la cible a perdu au moins 1 PV, inflige la maladie fièvre jaune avec 50% du jet en charges",
    "alternative": "Gravité (des blessures) reçues -1-Q"
  },
  {
    "nom": "Or",
    "type": "Métal",
    "niveau": 2,
    "effet": "Difficulté à travailler -Q, Solidité -Q",
    "armes": true,
    "outils": true,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "Prix x2",
    "alternative": "//"
  },
  {
    "nom": "Fer Azuréen",
    "type": "Métal",
    "niveau": 2,
    "effet": "L'objet reçoit des enchantements dont la magnitude est augmentée de 1+Q",
    "armes": true,
    "outils": true,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "Avantage aux tests de sauvegarde contre la magie",
    "alternative": "Réduit les enchantements reçus d'une magnitude de 1+Q"
  },
  {
    "nom": "Lunalite",
    "type": "Métal",
    "niveau": 2,
    "effet": "Allergène vs élémentaires",
    "armes": true,
    "outils": true,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "Légère lumière (pénalités de visibilité -1)",
    "alternative": "Immunité aux élémentaires (sauvegardes/résistance +Q)"
  },
  {
    "nom": "Materium",
    "type": "Métal",
    "niveau": 3,
    "effet": "Ajustement +Q avec les matérias de l'objet (lors de l'activation)",
    "armes": true,
    "outils": true,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "Améliorations magiques maximum possible +2",
    "alternative": "//"
  },
  {
    "nom": "Viridium",
    "type": "Métal",
    "niveau": 3,
    "effet": "Perforation +Q",
    "armes": true,
    "outils": true,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "Criticité +2",
    "alternative": "Absorption physique +Q"
  },
  {
    "nom": "Fergacite",
    "type": "Métal",
    "niveau": 3,
    "effet": "Si l'attaque touche la cible, elle perd X points d'endurance (PE) (attrition)",
    "armes": true,
    "outils": true,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "Propriété matière qualité +1",
    "alternative": "Chaque tour le personnage reçoit X PE temporaire(s)"
  },
  {
    "nom": "Olutium",
    "type": "Métal",
    "niveau": 3,
    "effet": "Dégats des attaques +Q",
    "armes": true,
    "outils": true,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "Toutes les sauvegardes passives sont accrues de 1",
    "alternative": "Résistance +Q/2"
  },
  {
    "nom": "Météorite",
    "type": "Métal",
    "niveau": 3,
    "effet": "Impact des tactiques +Q",
    "armes": true,
    "outils": true,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "Effets allergènes accrus, moins efficaces sur d'autres cibles cependant",
    "alternative": "Résilience ajustement +Q"
  },
  {
    "nom": "Torium",
    "type": "Métal",
    "niveau": 3,
    "effet": "Difficulté des réparations -Q, cout des réparations -10Q%",
    "armes": true,
    "outils": true,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "Immunité de l'objet aux énergies et changement d'état, mais cassable",
    "alternative": "//"
  },
  {
    "nom": "Oridecon",
    "type": "Métal",
    "niveau": 4,
    "effet": "Solidité active +2+Q",
    "armes": true,
    "outils": true,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "Les objets qui s'entrechoquent avec celui ci subissent 1D8 de dégradation automatique (sans sauvegardes) sauf si incassable",
    "alternative": "//"
  },
  {
    "nom": "Elunium",
    "type": "Métal",
    "niveau": 4,
    "effet": "Solidité passive +2+Q",
    "armes": true,
    "outils": true,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "Bonus de qualité +1",
    "alternative": "//"
  },
  {
    "nom": "Obsidienne",
    "type": "Métal",
    "niveau": 4,
    "effet": "Rapidité (via l'objet) +Q",
    "armes": true,
    "outils": true,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "Menace +2 (arme), Menace -2 (armure)",
    "alternative": "Pénalité d'initiative de l'armure -Q"
  },
  {
    "nom": "Fer Sidéral",
    "type": "Métal",
    "niveau": 4,
    "effet": "Vitesse active (via l'objet) +Q",
    "armes": true,
    "outils": true,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "Pénalités d'usage -1",
    "alternative": "Vitesse passive (via l'objet) +Q"
  },
  {
    "nom": "Chromite",
    "type": "Métal",
    "niveau": 4,
    "effet": "Pénétration +Q",
    "armes": true,
    "outils": true,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "Plage d'exploits et maladresse +1",
    "alternative": "Résistance à la pénétration +Q"
  },
  {
    "nom": "Tenebrium",
    "type": "Métal",
    "niveau": 4,
    "effet": "Peux dépenser des PE pour les prouesses innées utilisant l'objet, maximum Q",
    "armes": true,
    "outils": true,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "Pas de relance si l'objet est utilisé, ni pour l'utilisateur ni pour son adversaire",
    "alternative": "//"
  },
  {
    "nom": "Os de Drake",
    "type": "Métal",
    "niveau": 4,
    "effet": "Si attaque > défense selon élément +5 => Dégats +1+Q",
    "armes": true,
    "outils": true,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "Résistance élémentaire de la cible réduite d'un cran // résistance élémentaire du porteur +1 rang",
    "alternative": "Si attaque adverse < défense - 5 => Dégats 1+Q de l'élément (ignore résistance)"
  },
  {
    "nom": "Dragonite",
    "type": "Métal",
    "niveau": 4,
    "effet": "Allergène vs Dragons",
    "armes": true,
    "outils": true,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "Les 1 et 2 sont relancés sur un jet (une fois)",
    "alternative": "Immunité aux dragpns (sauvegardes/résistance +Q)"
  },
  {
    "nom": "Orichalque",
    "type": "Métal",
    "niveau": 5,
    "effet": "Indestructible",
    "armes": true,
    "outils": true,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "Les 8 sont explosifs sur un jet (une fois)",
    "alternative": "//"
  },
  {
    "nom": "?",
    "type": "Métal",
    "niveau": 5,
    "effet": "Bois le sang : 3 PV infligés octrois 1 PV temporaire",
    "armes": true,
    "outils": true,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": "Bois le sang : 3 PV perdus octrois 1 PV temporaire"
  },
  {
    "nom": "?",
    "type": "Métal",
    "niveau": 2,
    "effet": "Si l'attaque touche la cible, elle perd X points de mana (PM)",
    "armes": true,
    "outils": true,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": "Chaque tour le personnage reçoit X PM temporaire(s)"
  },
  {
    "nom": "?",
    "type": "Métal",
    "niveau": 2,
    "effet": "Si l'attaque touche la cible, elle perd X points de chi (PC)",
    "armes": true,
    "outils": true,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": "Chaque tour le personnage reçoit X PC temporaire(s)"
  },
  {
    "nom": "Acier",
    "type": "Alliage",
    "niveau": 1,
    "effet": "Fer + Carbone, Poids de l'objet +1",
    "armes": true,
    "outils": true,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Acier Noir",
    "type": "Alliage",
    "niveau": 2,
    "effet": "Fer Noir + Carbone, Poids de l'objet +2",
    "armes": true,
    "outils": true,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Titanium",
    "type": "Alliage",
    "niveau": 3,
    "effet": "Titane + Viridium, Poids de l'objet +3",
    "armes": true,
    "outils": true,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Mithral",
    "type": "Alliage",
    "niveau": 4,
    "effet": "Mithril + Viridium, Poids de l'objet +4",
    "armes": true,
    "outils": true,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Adamantium",
    "type": "Alliage",
    "niveau": 5,
    "effet": "Orchilaque + Viridium, Poids de l'objet +5",
    "armes": true,
    "outils": true,
    "armures": true,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Sélénite",
    "type": "Pierre",
    "niveau": "X",
    "effet": "Attribut: Volonté, Propriété: Protection contre la corruption, Sauvegarde: Détermination, Éléments: Divin (sacré/impie), Ressource: Spiritualité",
    "armes": false,
    "outils": false,
    "armures": false,
    "bijoux": true,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Pierre de Lune",
    "type": "Pierre",
    "niveau": "X",
    "effet": "Attribut: Perception, Propriété: Protection contre les faux semblants, le mensonge, la tromperie, Sauvegarde: Intuition, Éléments: Mauvais (Chaos/Mort/Ombre/Impie), Ressource:",
    "armes": false,
    "outils": false,
    "armures": false,
    "bijoux": true,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Pierre de Soleil",
    "type": "Pierre",
    "niveau": "X",
    "effet": "Attribut: Charisme, Propriété: Protection contre les émotions non souhaitées (colère, peur, intimidation, provocation…), Sauvegarde: Première impression Éléments: Bon (Loi/Vie/Lumière/Sacré), Ressource:",
    "armes": false,
    "outils": false,
    "armures": false,
    "bijoux": true,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Obsidienne",
    "type": "Pierre",
    "niveau": "X",
    "effet": "Attribut: Dextérité, Propriété: Protection contre toutes les formes de surprises, Sauvegarde: Réflexes, Éléments: […], Ressource: Vitalité",
    "armes": false,
    "outils": false,
    "armures": false,
    "bijoux": true,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Améphyste",
    "type": "Pierre",
    "niveau": "X",
    "effet": "Attribut: Intelligence, Propriété: Protection contre les énigmes, les mystères, les secrets, Sauvegarde: Sang-Froid, Éléments: Terre Ressource:",
    "armes": false,
    "outils": false,
    "armures": false,
    "bijoux": true,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Quartz",
    "type": "Pierre",
    "niveau": "X",
    "effet": "Attribut: Logique, Propriété: Protection contre l'oubli et la perte de mémoire, Sauvegarde: Opposition, Éléments: Steam Ressource:",
    "armes": false,
    "outils": false,
    "armures": false,
    "bijoux": true,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Lapis-Lazuli",
    "type": "Pierre",
    "niveau": "X",
    "effet": "Attribut: Sagesse, Propriété: Protection contre la méfiance (vérité/mensonge), Sauvegarde: Intuition, Éléments: Illusion, Ressource:",
    "armes": false,
    "outils": false,
    "armures": false,
    "bijoux": true,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Azurite",
    "type": "Pierre",
    "niveau": "X",
    "effet": "Attribut: Perception, Propriété: ???, Sauvegarde: Intuition, Éléments: […], Ressource:",
    "armes": false,
    "outils": false,
    "armures": false,
    "bijoux": true,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Tourmaline",
    "type": "Pierre",
    "niveau": "X",
    "effet": "Attribut: Constitution, Propriété: Protection contre toutes les formes de confusions (y compris l'ivresse), Sauvegarde: Robustesse, Éléments: Vie/Mort, Ressource:",
    "armes": false,
    "outils": false,
    "armures": false,
    "bijoux": true,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Onyx",
    "type": "Pierre",
    "niveau": "X",
    "effet": "Attribut: Volonté, Propriété: Favorise la récupération, le rétablissement, la convalescence, Sauvegarde: Détermination, Éléments: Vie/Mort, Ressource:",
    "armes": false,
    "outils": false,
    "armures": false,
    "bijoux": true,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Jais",
    "type": "Pierre",
    "niveau": "X",
    "effet": "Attribut: Ruse, Propriété: Protection contre les malédictions, Sauvegarde: Sang-Froid, Éléments: Loi/Chaos, Ressource:",
    "armes": false,
    "outils": false,
    "armures": false,
    "bijoux": true,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Citrine",
    "type": "Pierre",
    "niveau": "X",
    "effet": "Attribut: Chance, Propriété: Protection contre les problèmes d'argent (arnaques, vols…), Sauvegarde: Fortune, Éléments: Air, Ressource:",
    "armes": false,
    "outils": false,
    "armures": false,
    "bijoux": true,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Ambre",
    "type": "Pierre",
    "niveau": "X",
    "effet": "Attribut: Sagesse, Propriété: Protection contre les maladies, Sauvegarde: Intuition, Éléments: Bois, Ressource:",
    "armes": false,
    "outils": false,
    "armures": false,
    "bijoux": true,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Topaze",
    "type": "Pierre",
    "niveau": "X",
    "effet": "Attribut: Intelligence, Propriété: Protection contre les énergies, Sauvegarde: Sang-Froid, Éléments: Foudre, Ressource:",
    "armes": false,
    "outils": false,
    "armures": false,
    "bijoux": true,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Grenat",
    "type": "Pierre",
    "niveau": "X",
    "effet": "Attribut: Force Propriété: Protection contre la fatigue Sauvegarde: Robustesse, Éléments: Métal Ressource:",
    "armes": false,
    "outils": false,
    "armures": false,
    "bijoux": true,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Rubis",
    "type": "Pierre",
    "niveau": "X",
    "effet": "Attribut: Volonté, Propriété: Protection contre la chaleur Sauvegarde: Détermination, Éléments: Feu, Ressource:",
    "armes": false,
    "outils": false,
    "armures": false,
    "bijoux": true,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Saphir",
    "type": "Pierre",
    "niveau": "X",
    "effet": "Attribut: Constitution, Propriété: Protection contre le froid, Sauvegarde: Robustesse, Éléments: Glace Ressource:",
    "armes": false,
    "outils": false,
    "armures": false,
    "bijoux": true,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Cornaline",
    "type": "Pierre",
    "niveau": "X",
    "effet": "Attribut: Dextérité, Propriété: ???, Sauvegarde: Réflexes, Éléments: […], Ressource:",
    "armes": false,
    "outils": false,
    "armures": false,
    "bijoux": true,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Spinelle",
    "type": "Pierre",
    "niveau": "X",
    "effet": "Attribut: Agilité, Propriété: Protection contre la contrainte (qui prive de liberté ou la réduit), Sauvegarde: Réflexes, Éléments: Eau, Ressource:",
    "armes": false,
    "outils": false,
    "armures": false,
    "bijoux": true,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Malachite",
    "type": "Pierre",
    "niveau": "X",
    "effet": "Attribut: Constitution, Propriété: Protection contre les toxines, poisons ou venins, Sauvegarde: Robustesse, Éléments: Poison/Acide/Etc., Ressource:",
    "armes": false,
    "outils": false,
    "armures": false,
    "bijoux": true,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Jade",
    "type": "Pierre",
    "niveau": "X",
    "effet": "Attribut: Equilibre, Propriété: Favorise les bonnes rencontres, les événements bénéfiques, Sauvegarde: Fortune, Éléments: […], Ressource:",
    "armes": false,
    "outils": false,
    "armures": false,
    "bijoux": true,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Péridot",
    "type": "Pierre",
    "niveau": "X",
    "effet": "Attribut: Ruse, Propriété: Protection contre les soupçons, l'attention ou les regards indiscrets, Sauvegarde: Sang-Froid, Éléments: Mental, Ressource:",
    "armes": false,
    "outils": false,
    "armures": false,
    "bijoux": true,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Aventurine",
    "type": "Pierre",
    "niveau": "X",
    "effet": "Attribut: Chance, Propriété: Protection contre les coups du sort, les événements néfastes Sauvegarde: Fortune, Éléments: […], Ressource:",
    "armes": false,
    "outils": false,
    "armures": false,
    "bijoux": true,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Jaspe",
    "type": "Pierre",
    "niveau": "X",
    "effet": "Attribut: Force Propriété: Protection contre l'absence de nutrition ou hydratation, Sauvegarde: Détermination, Éléments: Naturel, Ressource:",
    "armes": false,
    "outils": false,
    "armures": false,
    "bijoux": true,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Pyrite",
    "type": "Pierre",
    "niveau": "X",
    "effet": "Attribut: Intelligence, Propriété: ???, Sauvegarde: Sang-Froid, Éléments: […], Ressource:",
    "armes": false,
    "outils": false,
    "armures": false,
    "bijoux": true,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Aetherite",
    "type": "Pierre",
    "niveau": "X",
    "effet": "Attribut: Magie Propriété: Protection contre l'influence des rêves (voile inclus), Sauvegarde: Opposition, Éléments: Arcanes, Ressource:",
    "armes": false,
    "outils": false,
    "armures": false,
    "bijoux": true,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Vesperine",
    "type": "Pierre",
    "niveau": "X",
    "effet": "Attribut: Agilité, Propriété: Protection contre la chute et/ou ses conséquences, Sauvegarde: Réflexes, Éléments: Lumière/Ombre Ressource:",
    "armes": false,
    "outils": false,
    "armures": false,
    "bijoux": true,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Seraphine",
    "type": "Pierre",
    "niveau": "X",
    "effet": "Attribut: Equilibre, Propriété: Protection contre le divin, Sauvegarde: Fortune, Éléments: Sacré/Impie, Ressource:",
    "armes": false,
    "outils": false,
    "armures": false,
    "bijoux": true,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Dracarys",
    "type": "Pierre",
    "niveau": "X",
    "effet": "Attribut: Magie Propriété: ???, Sauvegarde: Opposition, Éléments: Chroma, Ressource:",
    "armes": false,
    "outils": false,
    "armures": false,
    "bijoux": true,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Orpheal",
    "type": "Pierre",
    "niveau": "X",
    "effet": "Attribut: Charisme, Propriété: ???, Sauvegarde: Prestige, Éléments: Vide, Ressource:",
    "armes": false,
    "outils": false,
    "armures": false,
    "bijoux": true,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Auralis",
    "type": "Magicite",
    "niveau": "X",
    "effet": "Maîtrise des sorts +Q (limité par niveau du sort)",
    "armes": false,
    "outils": false,
    "armures": false,
    "bijoux": false,
    "focalisateurs": true,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Borealis",
    "type": "Magicite",
    "niveau": "X",
    "effet": "Expertise des sorts +Q (limité par niveau du sort)",
    "armes": false,
    "outils": false,
    "armures": false,
    "bijoux": false,
    "focalisateurs": true,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Caelunox",
    "type": "Magicite",
    "niveau": "X",
    "effet": "Mana temporaire +Q par lancé de sort (limité par niveau du sort)",
    "armes": false,
    "outils": false,
    "armures": false,
    "bijoux": false,
    "focalisateurs": true,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Darethys",
    "type": "Magicite",
    "niveau": "X",
    "effet": "Puissance de sort +Q (limité par niveau du sort)",
    "armes": false,
    "outils": false,
    "armures": false,
    "bijoux": false,
    "focalisateurs": true,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Erydiome",
    "type": "Magicite",
    "niveau": "X",
    "effet": "Charge des enchantements +2xQ (limité par niveau du sort)",
    "armes": false,
    "outils": false,
    "armures": false,
    "bijoux": false,
    "focalisateurs": true,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Fayndral",
    "type": "Magicite",
    "niveau": "X",
    "effet": "Charge des conditions +2xQ (limité par niveau du sort)",
    "armes": false,
    "outils": false,
    "armures": false,
    "bijoux": false,
    "focalisateurs": true,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Galmyrra",
    "type": "Magicite",
    "niveau": "X",
    "effet": "Charge des invocations +2xQ (limité par niveau du sort)",
    "armes": false,
    "outils": false,
    "armures": false,
    "bijoux": false,
    "focalisateurs": true,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Helionox",
    "type": "Magicite",
    "niveau": "X",
    "effet": "Difficulté arcanique +Q (limité par niveau du sort)",
    "armes": false,
    "outils": false,
    "armures": false,
    "bijoux": false,
    "focalisateurs": true,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Ignathys",
    "type": "Magicite",
    "niveau": "X",
    "effet": "Jets arcaniques +Q",
    "armes": false,
    "outils": false,
    "armures": false,
    "bijoux": false,
    "focalisateurs": true,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Jakharys",
    "type": "Magicite",
    "niveau": "X",
    "effet": "Jets arcaniques +Q",
    "armes": false,
    "outils": false,
    "armures": false,
    "bijoux": false,
    "focalisateurs": true,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Kalythis",
    "type": "Magicite",
    "niveau": "X",
    "effet": "Ajustement d'incantation +Q (école ou domaine précis)",
    "armes": false,
    "outils": false,
    "armures": false,
    "bijoux": false,
    "focalisateurs": true,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Lunareth",
    "type": "Magicite",
    "niveau": "X",
    "effet": "Ajustement d'arcane +Q (action d'arcane précise)",
    "armes": false,
    "outils": false,
    "armures": false,
    "bijoux": false,
    "focalisateurs": true,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Myros",
    "type": "Magicite",
    "niveau": "X",
    "effet": "Brûlures de mana -2xQ",
    "armes": false,
    "outils": false,
    "armures": false,
    "bijoux": false,
    "focalisateurs": true,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Nymbréos",
    "type": "Magicite",
    "niveau": "X",
    "effet": "Portée des sorts +20xQ%",
    "armes": false,
    "outils": false,
    "armures": false,
    "bijoux": false,
    "focalisateurs": true,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Oracyn",
    "type": "Magicite",
    "niveau": "X",
    "effet": "Zone d'effet des sorts +20xQ%",
    "armes": false,
    "outils": false,
    "armures": false,
    "bijoux": false,
    "focalisateurs": true,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Phenixia",
    "type": "Magicite",
    "niveau": "X",
    "effet": "Magnitude des enchantements +2xQ (limité par niveau du sort)",
    "armes": false,
    "outils": false,
    "armures": false,
    "bijoux": false,
    "focalisateurs": true,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Qyone",
    "type": "Magicite",
    "niveau": "X",
    "effet": "Déviation contre attaques magiques (défense) +2",
    "armes": false,
    "outils": false,
    "armures": false,
    "bijoux": false,
    "focalisateurs": true,
    "effet_special": "",
    "alternative": ""
  },
  {
    "nom": "Ravhalis",
    "type": "Magicite",
    "niveau": "X",
    "effet": "Ajustement en défense contre la magie = Q",
    "armes": false,
    "outils": false,
    "armures": false,
    "bijoux": false,
    "focalisateurs": true,
    "effet_special": "",
    "alternative": ""
  }
];

  const tbody    = document.getElementById('mat-tbody');
  const search   = document.getElementById('mat-search');
  const selType  = document.getElementById('mat-type');
  const selNiv   = document.getElementById('mat-niveau');
  const chkArmes  = document.getElementById('f-armes');
  const chkOutils = document.getElementById('f-outils');
  const chkArmures= document.getElementById('f-armures');
  const chkBijoux = document.getElementById('f-bijoux');
  const chkFoca   = document.getElementById('f-foca');
  const counter  = document.getElementById('mat-count');

  let sortCol = null;
  let sortAsc = true;

  function tags(e) {
    const t = [];
    if (e.armes)         t.push('Armes');
    if (e.outils)        t.push('Outils');
    if (e.armures)       t.push('Armures');
    if (e.bijoux)        t.push('Bijoux');
    if (e.focalisateurs) t.push('Foca.');
    return t.map(l => `<span class="mat-tag">${l}</span>`).join(' ');
  }

  function render(list) {
    tbody.innerHTML = '';
    list.forEach(e => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${e.nom}</strong></td>
        <td>${e.type}</td>
        <td style="text-align:center">${e.niveau}</td>
        <td>${tags(e)}</td>
        <td>${e.effet}</td>
        <td style="font-size:0.88em;color:#555">${e.effet_special}</td>
        <td style="font-size:0.88em;color:#555">${e.alternative === '//' ? '' : e.alternative}</td>
      `;
      tbody.appendChild(tr);
    });
    counter.textContent = list.length + ' matière' + (list.length !== 1 ? 's' : '');
  }

  function filter() {
    const q   = search.value.toLowerCase();
    const t   = selType.value;
    const n   = selNiv.value;

    let list = DATA.filter(e => {
      if (t && e.type !== t) return false;
      if (n && String(e.niveau) !== n) return false;
      if (chkArmes.checked   && !e.armes)         return false;
      if (chkOutils.checked  && !e.outils)        return false;
      if (chkArmures.checked && !e.armures)       return false;
      if (chkBijoux.checked  && !e.bijoux)        return false;
      if (chkFoca.checked    && !e.focalisateurs) return false;
      if (q && ![e.nom, e.type, e.effet, e.effet_special, e.alternative]
               .some(s => (s || '').toLowerCase().includes(q))) return false;
      return true;
    });

    if (sortCol) {
      list = list.slice().sort((a, b) => {
        const va = String(a[sortCol] ?? '').toLowerCase();
        const vb = String(b[sortCol] ?? '').toLowerCase();
        return sortAsc ? va.localeCompare(vb) : vb.localeCompare(va);
      });
    }

    render(list);
  }

  [search, selType, selNiv, chkArmes, chkOutils, chkArmures, chkBijoux, chkFoca]
    .forEach(el => el.addEventListener('input', filter));

  document.querySelectorAll('#mat-table th[data-col]').forEach(th => {
    th.addEventListener('click', () => {
      if (sortCol === th.dataset.col) sortAsc = !sortAsc;
      else { sortCol = th.dataset.col; sortAsc = true; }
      filter();
    });
  });

  filter();
})();
</script>
