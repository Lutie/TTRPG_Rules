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

<p class="mat-note">Les applications indiquent les types d'objets pour lesquels la matière est naturellement pertinente. La logique du MJ prévaut : l'objet doit rester utile et cohérent dans une situation de JDR.</p>

<table id="mat-table">
  <thead>
    <tr>
      <th class="col-nom" data-col="nom">Nom ↕</th>
      <th class="col-type" data-col="type">Type ↕</th>
      <th class="col-niv" data-col="niveau">Niv. ↕</th>
      <th class="col-app">Équipements</th>
      <th class="col-effet">Effet</th>
      <th class="col-desc">Description</th>
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
.mat-note {
  margin: -0.25em 0 1em;
  color: #666;
  font-size: 0.9em;
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
.col-app    { width: 15%; }
.col-effet  { width: 20%; }
.col-desc   { width: 18%; }
.col-special{ width: 13%; }
.col-alt    { width: 14%; }
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
    "alternative": "",
    "description": "Le cuir bovin est un matériau durable et résistant, avec une couleur brune à noire. Il a une surface lisse et uniforme, mais peut avoir des marques, des tâches et des imperfections naturelles. Il est également résistant à l'eau et à l'usure.",
    "applications": [
      "Armes",
      "Armures et protections"
    ]
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
    "alternative": "",
    "description": "Il est généralement plus résistant et plus épais que le cuir de bovin.",
    "applications": [
      "Armes",
      "Armures et protections"
    ]
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
    "alternative": "",
    "description": "???",
    "applications": [
      "Armes",
      "Armures et protections"
    ]
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
    "alternative": "",
    "description": "Issu de créatures rapides et endurantes, le cuir de canidé est apprécié pour sa légèreté et sa souplesse, permettant une meilleure liberté de mouvement. Il est souvent utilisé pour les armures légères, optimisant la réactivité en combat et améliorant les capacités d’évasion.",
    "applications": [
      "Armes",
      "Armures et protections"
    ]
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
    "alternative": "",
    "description": "Souple et flexible, ce cuir est extrait d’animaux particulièrement agiles. Son élasticité naturelle en fait un matériau idéal pour les équipements destinés aux combattants privilégiant la fluidité et l’adaptabilité. Il est recherché pour sa capacité à favoriser les esquives et les mouvements instinctifs.",
    "applications": [
      "Armes",
      "Armures et protections"
    ]
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
    "alternative": "",
    "description": "Rugueux et extrêmement résistant, le cuir de crocodilidé est épais et rigide, conférant une protection naturelle renforcée. Son aspect écailleux offre une résistance accrue aux coups et aux pressions, en faisant un matériau idéal pour les armures lourdes privilégiant la force et l’impact physique.",
    "applications": [
      "Armes",
      "Armures et protections"
    ]
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
    "alternative": "",
    "description": "Issu des puissants ours et créatures apparentées, ce cuir est dense et isolant, procurant une grande résistance aux assauts prolongés. Il est apprécié pour sa capacité à absorber les chocs et protéger contre les coups lourds, renforçant la constitution du porteur.",
    "applications": [
      "Armes",
      "Armures et protections"
    ]
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
    "alternative": "",
    "description": "Léger et résistant, le cuir de félin est réputé pour sa finesse et sa souplesse, facilitant des mouvements précis et une perception accrue du danger. Il est souvent utilisé par les chasseurs et rôdeurs qui dépendent de leurs sens affûtés pour détecter les menaces avant qu’elles ne frappent.",
    "applications": [
      "Armes",
      "Armures et protections"
    ]
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
    "alternative": "",
    "description": "Plus souple et plus léger que le cuir de bovin, le cuir de cervidé est particulièrement adapté aux déplacements rapides et discrets. Il offre une défense stable et régulière, garantissant une protection minimale en cas d’épuisement, ce qui en fait un choix prisé pour les survivants et les éclaireurs.",
    "applications": [
      "Armes",
      "Armures et protections"
    ]
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
    "alternative": "",
    "description": "Cuir d’amphibien rare et exceptionnellement résistant, le galuchat est apprécié pour sa surface rugueuse et imperméable. Utilisé par les guerriers et navigateurs, il favorise une discipline stricte et une maîtrise mentale accrue, rendant son porteur plus résistant aux distractions et aux altérations psychiques.",
    "applications": [
      "Armes",
      "Armures et protections"
    ]
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
    "alternative": "",
    "description": "Issu des créatures dominantes de la chaîne alimentaire, ce cuir possède une aura naturelle d’intimidation. Les équipements en cuir de prédateur renforcent l’assurance et la présence du porteur, lui conférant un avantage dans les confrontations sociales où il doit imposer sa volonté face à un adversaire récalcitrant.",
    "applications": [
      "Armes",
      "Armures et protections"
    ]
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
    "alternative": "",
    "description": "Traitée de manière spécifique, l’aniline est un cuir d’une grande souplesse et d’une résistance accrue aux agressions physiques. Son tannage particulier lui confère une robustesse évolutive, renforçant la capacité de son porteur à encaisser les chocs et à réagir rapidement aux attaques soudaines. Il est particulièrement prisé pour les équipements nécessitant une adaptabilité progressive aux conditions de combat.",
    "applications": [
      "Armes",
      "Armures et protections"
    ]
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
    "alternative": "",
    "description": "De teinte gris foncé à noir profond, le cuir de requin est rugueux et incroyablement résistant grâce à sa texture naturellement abrasée. Il offre une adhérence supérieure en milieu aquatique et une souplesse accrue dans les environnements sombres où l’instinct doit primer sur la vision. Idéal pour les équipements de combat sous-marin ou furtifs, il améliore les capacités défensives du porteur face aux attaques imprévisibles.",
    "applications": [
      "Armes",
      "Armures et protections"
    ]
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
    "alternative": "",
    "description": "Issu d’amphibiens au derme particulier, ce cuir est extrêmement souple et naturellement imperméable. Sa capacité à épouser les formes et à s’adapter à son environnement en fait un matériau idéal pour les équipements de discrétion et de furtivité. Il est aussi reconnu pour sa résistance aux variations de température et aux environnements marécageux, offrant un avantage aux combattants opérant en terrain humide ou instable.",
    "applications": [
      "Armes",
      "Armures et protections"
    ]
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
    "alternative": "",
    "description": "Issu de griffons et d'hippogriffes, ce cuir est à la fois solide et léger, combinant la robustesse des prédateurs terrestres et l'agilité des créatures volantes. Son aspect noble en fait un matériau prisé pour les armures de prestige et les équipements destinés aux combattants cherchant un équilibre entre puissance et rapidité.",
    "applications": [
      "Armes",
      "Armures et protections"
    ]
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
    "alternative": "",
    "description": "Issu des créatures draconiques telles que les drakkons, vouivres, drakes et salamandres, ce cuir est imprégné d’une énergie élémentaire latente. Il confère une résistance exceptionnelle aux environnements hostiles et est souvent utilisé pour des armures destinées aux combattants affrontant des conditions extrêmes.",
    "applications": [
      "Armes",
      "Armures et protections"
    ]
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
    "alternative": "",
    "description": "Ce cuir est extrait des wyvernes, des créatures volantes aux écailles souples mais résistantes. Il est particulièrement apprécié pour sa légèreté et sa flexibilité, ce qui en fait un matériau recherché par les combattants agiles et les éclaireurs.",
    "applications": [
      "Armes",
      "Armures et protections"
    ]
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
    "alternative": "",
    "description": "Plus lourd et plus dense que le cuir de wyverne, le cuir de guivre provient de créatures souterraines aux peaux épaisses et renforcées. Il est recherché pour sa résistance aux chocs et sa capacité à absorber les impacts, offrant une excellente protection sans sacrifier trop de mobilité.",
    "applications": [
      "Armes",
      "Armures et protections"
    ]
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
    "alternative": "",
    "description": "Matériau rare et puissant, le cuir de chimère provient de créatures à la nature hybride et imprévisible. Il semble canaliser une énergie surnaturelle, permettant au porteur de puiser continuellement dans sa force intérieure pour maintenir son endurance en combat.",
    "applications": [
      "Armes",
      "Armures et protections"
    ]
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
    "alternative": "",
    "description": "Matériau légendaire issu des dragons véritables, le cuir de dracosire est réputé pour sa résistance exceptionnelle et son affinité magique innée. Il est aussi robuste que les écailles dont il est extrait, conférant à son porteur une défense quasi impénétrable et une connexion unique aux flux draconiques.",
    "applications": [
      "Armes",
      "Armures et protections"
    ]
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
    "alternative": "",
    "description": "Issu des créatures infernales, ce cuir semble encore imprégné d’une énergie maléfique. Utilisé par ceux qui ne craignent pas de pactiser avec les ténèbres, il confère une résistance surnaturelle aux forces destructrices tout en amplifiant l’agressivité de son porteur.",
    "applications": [
      "Armes",
      "Armures et protections"
    ]
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
    "alternative": "",
    "description": "???",
    "applications": [
      "Armes",
      "Armures et protections"
    ]
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
    "alternative": "",
    "description": "Ce cuir rare tire son nom de son apparence légère et vaporeuse, semblable aux aigrettes d’un pissenlit soufflé par le vent. Imprégné d’énergie fluide, il facilite l’utilisation du Chi, permettant aux combattants de canaliser leur force intérieure plus rapidement que la normale.",
    "applications": [
      "Armes",
      "Armures et protections"
    ]
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
    "alternative": "",
    "description": "???",
    "applications": [
      "Armures et protections"
    ]
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
    "alternative": "",
    "description": "Légère, respirante et durable, la toile est un textile apprécié pour sa souplesse et sa capacité d’absorption des énergies mentales. Elle est souvent utilisée pour les vêtements de méditation, les habits des érudits ou des praticiens des arts psychiques, facilitant la concentration et la résistance aux perturbations mentales.",
    "applications": [
      "Armures et protections"
    ]
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
    "alternative": "",
    "description": "Résistant et isolant, le jute est un tissu naturel qui protège contre les perturbations mystiques. Son tissage dense et robuste est particulièrement prisé par ceux cherchant à se prémunir contre les influences magiques, notamment dans les rituels et enchantements défensifs.",
    "applications": [
      "Armures et protections"
    ]
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
    "alternative": "",
    "description": "Apprécié pour son confort et son excellente isolation thermique, le coton est un matériau courant dans la confection de vêtements adaptés aux climats variés. Sa structure pelucheuse permet de réduire l'impact des fluctuations énergétiques, rendant son porteur plus résistant aux assauts élémentaires.",
    "applications": [
      "Armures et protections"
    ]
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
    "alternative": "",
    "description": "Textile souple et résistant, la laine est prisée pour son élégance et son confort, mais aussi pour l’image de prestige qu’elle véhicule dans de nombreuses sociétés. Portée par les nobles et les érudits, elle confère à son porteur une présence plus marquée, facilitant son influence et sa reconnaissance sociale.",
    "applications": [
      "Armures et protections"
    ]
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
    "alternative": "",
    "description": "Textile naturellement absorbant, antibactérien et incroyablement résistant, la ramie est souvent utilisée pour des vêtements de haute qualité conférant une grande stabilité mentale. Elle est prisée par les moines, érudits et praticiens de disciplines nécessitant une force d’esprit inébranlable, même en situation d’épuisement.",
    "applications": [
      "Armures et protections"
    ]
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
    "alternative": "",
    "description": "Variante luxueuse du coton, la veloutine possède une texture douce et veloutée, tout en conservant une bonne résistance. Son tissage dense lui permet d’offrir une protection supplémentaire contre les agressions énergétiques, rendant son porteur plus résistant aux attaques élémentaires ou magiques.",
    "applications": [
      "Armures et protections"
    ]
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
    "alternative": "",
    "description": "Textile raffiné et élégant, le velours est apprécié autant pour son confort que pour sa capacité à isoler l’esprit des agressions extérieures. Il est souvent porté par les aristocrates et les érudits en quête de sérénité, aidant à maintenir un esprit clair et protégé des influences perturbatrices.",
    "applications": [
      "Armures et protections"
    ]
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
    "alternative": "",
    "description": "Tissu épais et précieux, souvent perçu comme ancien mais sophistiqué, le samit est utilisé par les érudits et les pratiquants de la magie rituelle. Son tissage particulier favorise la concentration et la stabilité mentale, aidant son porteur à maintenir son focus même dans des conditions difficiles.",
    "applications": [
      "Armures et protections"
    ]
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
    "alternative": "",
    "description": "Résistant et durable, le chanvre est un textile apprécié pour ses propriétés hypoallergéniques et sa souplesse croissante avec le temps. Son tissage robuste permet de limiter l’impact des erreurs et maladresses, en particulier dans des situations exigeant de la précision comme la joute verbale où la magie.",
    "applications": [
      "Armures et protections"
    ]
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
    "alternative": "",
    "description": "Textile fin et brillant, souvent associé au luxe et à la fluidité, le satin est prisé pour sa capacité à favoriser la concentration en procurant un confort optimal à son porteur. Il est souvent utilisé dans les robes cérémonielles ou les vêtements d’érudits, facilitant l’accomplissement d’actions nécessitant un esprit focalisé.",
    "applications": [
      "Armures et protections"
    ]
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
    "alternative": "",
    "description": "Matériau résistant à l’eau et à l’usure, le nylon est apprécié pour sa robustesse et sa flexibilité. Bien que moins respirant que les textiles naturels, il est idéal pour les équipements nécessitant rapidité et réactivité, facilitant la prise d’initiative dans des situations dynamiques.",
    "applications": [
      "Armures et protections"
    ]
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
    "alternative": "",
    "description": "Substance mystérieuse issue d’alliages cristallins d’origine inconnue, l’Epsylon semble vibrer faiblement à proximité des phénomènes surnaturels. Froid au toucher et souvent irisé de reflets changeants, il est prisé par les alchimistes et les enchanteurs pour ses propriétés d’annulation. Ce matériau est souvent intégré dans des armures cérémonielles, des talismans ou des gantelets de protection contre les arcanes.",
    "applications": [
      "Armures et protections"
    ]
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
    "alternative": "",
    "description": "Matériau rare aux surfaces mates et géométriquement parfaites, l’Artygon semble détourner l’attention et la puissance des sorts. Sa structure moléculaire complexe défie les principes magiques classiques, rendant difficile toute tentative d’analyse ou d’influence directe. Les sages estiment qu’il \"floute\" l’aura de son porteur, le rendant difficile à cibler ou affecter par la magie.",
    "applications": [
      "Armures et protections"
    ]
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
    "alternative": "",
    "description": "Fluide cristallisé en fragments semi-transparents, le Valespire pulse d’une lumière douce semblable à un cœur battant. Utilisé dans les armes mystiques ou les catalyseurs d'énergie, il se régénère naturellement, alimentant les sorts comme une batterie autonome. Les mages itinérants raffolent de ce matériau qui leur assure une réserve constante de mana.",
    "applications": [
      "Armures et protections"
    ]
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
    "alternative": "",
    "description": "Pierre semi-organique d’origine végétale ou fongique, le Vertigon possède une mémoire arcanique perverse. Il \"retient\" les malédictions ou les sorts néfastes, et les relâche d’un coup, amplifiés, souvent à contretemps. Son usage est controversé, certains le considérant comme une forme de piège vivant. Néanmoins, certains artefacts de guerre l’emploient pour provoquer des contrecoups magiques spectaculaires.",
    "applications": [
      "Armures et protections"
    ]
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
    "alternative": "",
    "description": "élastique, respirant et durable, le mohair est un textile apprécié pour sa souplesse et sa résistance naturelle. Il ne s'enflamme pas facilement et conserve sa forme avec le temps, ce qui en fait un choix privilégié pour les vêtements de protection mentale et magique.",
    "applications": [
      "Armures et protections"
    ]
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
    "alternative": "",
    "description": "Tissu luxueux et léger, la soie est prisée pour sa douceur et son élégance. Elle offre une grande respirabilité et s’adapte parfaitement aux variations de température, tout en étant naturellement infroissable et élastique.",
    "applications": [
      "Armures et protections"
    ]
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
    "alternative": "",
    "description": "Extrait de la laine de lama, l’alpaga est réputé pour son pouvoir thermique exceptionnel et sa légèreté. Elle permet de confectionner des vêtements à la fois doux, confortables et protecteurs contre le froid, tout en restant agréables à porter.",
    "applications": [
      "Armures et protections"
    ]
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
    "alternative": "",
    "description": "Léger, doux et soyeux, l’angora est un matériau prisé pour ses qualités thermiques et son confort. Il offre une sensation de chaleur et de bien-être tout en laissant respirer la peau, ce qui le rend parfait pour les vêtements de repos et de récupération.",
    "applications": [
      "Armures et protections"
    ]
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
    "alternative": "",
    "description": "Laine extrêmement rare provenant de la vigogne, la carmeline est réputée pour sa finesse et son confort exceptionnel. Son isolation thermique et sa douceur en font une matière prisée pour les vêtements de prestige et les habits rituels.",
    "applications": [
      "Armures et protections"
    ]
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
    "alternative": "",
    "description": "Textile luxueux provenant d’un type particulier de chèvre, le cachemire est reconnu pour sa douceur, sa légèreté et sa capacité à retenir la chaleur. Hypoallergénique et respirant, il est souvent utilisé dans les vêtements raffinés et confortables.",
    "applications": [
      "Armures et protections"
    ]
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
    "alternative": "",
    "description": "Soie précieuse finement brodée, le brocart est un tissu luxueux utilisé dans les vêtements de cérémonie et d'apparat. Son tissage sophistiqué lui confère une structure robuste et harmonieuse, favorisant une meilleure régénération physique et mentale.",
    "applications": [
      "Armures et protections"
    ]
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
    "alternative": "",
    "description": "Fibre extrêmement résistante issue des toiles d’araignées géantes, ce textile allie souplesse et réactivité. Son élasticité naturelle permet d’accélérer la vitesse des mouvements, notamment lors des échanges rapides en joute et en combat magique.",
    "applications": [
      "Armures et protections"
    ]
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
    "alternative": "",
    "description": "Laine rare issue de créatures mystiques, la laine d’orée est réputée pour ses propriétés protectrices contre les influences mentales et magiques. Son tissage dense absorbe et dissipe les effets nocifs, renforçant l’esprit contre toute altération.",
    "applications": [
      "Armures et protections"
    ]
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
    "alternative": "",
    "description": "Soie enchantée réputée pour sa capacité à apaiser les flux magiques, la soie rosalienne est particulièrement efficace contre les effets secondaires liés aux surcharges de mana ou aux sorts agressifs. Elle est prisée par les mages cherchant à limiter les dégâts résiduels d’origine arcanique.",
    "applications": [
      "Armures et protections"
    ]
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
    "alternative": "",
    "description": "Tissu imprégné d’une énergie apaisante, le coton d’azure est réputé pour sa capacité à atténuer les blessures infligées par la magie et les chocs mentaux. Il confère une résistance passive aux effets néfastes des assauts arcanes.",
    "applications": [
      "Armures et protections"
    ]
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
    "alternative": "",
    "description": "Tissu doux et isolant, la flanelle sylvaine est appréciée pour son affinité avec les échanges verbaux et les joutes d’influence. Elle permet à son porteur de récupérer rapidement son énergie en pleine confrontation rhétorique ou mystique.",
    "applications": [
      "Armures et protections"
    ]
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
    "alternative": "",
    "description": "Tissé à partir de fibres éthérées, le voile immatériel confère à son porteur une présence subtile, difficile à cerner aussi bien physiquement que mentalement. Son essence semi-transparente interfère avec les perceptions adverses, rendant les attaques plus incertaines.",
    "applications": [
      "Armures et protections"
    ]
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
    "alternative": "",
    "description": "Tissu léger et aérien, le tulle est apprécié pour sa capacité à atténuer les effets du destin. Sa structure fine mais complexe semble capter l’énergie du karma et faciliter les interventions de la providence.",
    "applications": [
      "Armures et protections"
    ]
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
    "alternative": "",
    "description": "Matériau issu des profondeurs du vide, le tisse-néant est une étoffe d’apparence insondable, absorbant la lumière et les intentions hostiles. Il perturbe la perception et la précision des adversaires, leur imposant une difficulté accrue à atteindre un coup décisif. En dernier recours, il peut se sacrifier pour sauver son porteur d’une mort imminente.",
    "applications": [
      "Armures et protections"
    ]
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
    "alternative": "",
    "description": "Bois léger et stable, le cèdre est un choix privilégié pour la fabrication d’armes nécessitant rapidité et maniabilité. Sa résistance naturelle aux parasites et aux intempéries le rend idéal pour des équipements exposés aux éléments, comme les arcs ou les hampes de lances. Facile à sculpter et à assembler, il permet d’obtenir des armes équilibrées et durables.",
    "applications": [
      "Armes",
      "Outils, instruments et objets utiles"
    ]
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
    "alternative": "",
    "description": "Bois dense et résistant, le chêne est réputé pour sa capacité à absorber les chocs, ce qui en fait un matériau de choix pour les armes lourdes comme les massues, les manches d’armes à deux mains et les renforts de boucliers. Son grain marqué et sa stabilité en font aussi un excellent choix pour la fabrication d’outils robustes et de structures renforcées.",
    "applications": [
      "Armes",
      "Outils, instruments et objets utiles"
    ]
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
    "alternative": "",
    "description": "Souple et léger, le saule est un matériau privilégié pour les armes et outils nécessitant flexibilité et réactivité. Sa capacité à absorber les impacts sans se briser en fait un excellent choix pour les arcs, les bâtons de combat et les armes conçues pour des mouvements rapides. Il est également apprécié pour la confection de protections légères et d’objets nécessitant une certaine élasticité.",
    "applications": [
      "Armes",
      "Outils, instruments et objets utiles"
    ]
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
    "alternative": "",
    "description": "Bois dur et homogène, le hêtre est idéal pour la confection d’armes solides et équilibrées. Il est particulièrement adapté aux manches d’armes de frappe comme les haches et les marteaux, ainsi qu’aux structures nécessitant une grande résistance aux torsions, comme les arbalètes ou les bâtons de parade. Son grain fin lui permet également un travail précis, apprécié par les artisans.",
    "applications": [
      "Armes",
      "Outils, instruments et objets utiles"
    ]
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
    "alternative": "",
    "description": "Reconnu pour sa densité et sa résistance aux agressions extérieures, l’acacia est un matériau de choix pour les armes et outils soumis à des usages prolongés. Il est idéal pour la fabrication de hampes d’armes de mêlée, de poignées renforcées et d’objets devant supporter une usure constante. Sa dureté naturelle lui confère une excellente durabilité en combat et dans les environnements difficiles.",
    "applications": [
      "Armes",
      "Outils, instruments et objets utiles"
    ]
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
    "alternative": "",
    "description": "Facile à travailler et léger, le pin est souvent utilisé pour la fabrication d’armes d’entraînement, de manches d’outils et de structures nécessitant une précision particulière. Bien qu’il soit moins résistant que d’autres bois, il est apprécié pour sa capacité à offrir une grande précision dans la fabrication, ce qui en fait un excellent matériau pour les éléments nécessitant un travail détaillé, comme les crosses d’armes à feu ou les pièces de mécanismes.",
    "applications": [
      "Armes",
      "Outils, instruments et objets utiles"
    ]
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
    "alternative": "",
    "description": "Bois dur et résistant, le châtaignier est apprécié pour sa solidité et sa longévité. Sa structure dense en fait un matériau idéal pour les équipements nécessitant une grande stabilité, comme les hampes d’armes ou les renforts de boucliers. Il est particulièrement prisé pour les armes stratégiques nécessitant une approche tactique, car il confère une grande fiabilité en combat.",
    "applications": [
      "Armes",
      "Outils, instruments et objets utiles"
    ]
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
    "alternative": "",
    "description": "D’une densité élevée et d’une teinte sombre élégante, le noyer est reconnu pour sa robustesse et sa durabilité. Il est prisé pour la confection d’armes nécessitant une grande précision et un excellent équilibre, comme les crosses d’armes de tir ou les manches d’armes blanches. Son poids bien réparti améliore considérablement la précision et l’efficacité des attaques.",
    "applications": [
      "Armes",
      "Outils, instruments et objets utiles"
    ]
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
    "alternative": "",
    "description": "Bois clair et stable, le bouleau est souvent utilisé pour des équipements nécessitant à la fois légèreté et solidité. Sa capacité à absorber les chocs en fait un excellent matériau pour les boucliers et les armures en bois, renforçant naturellement les capacités défensives de son porteur.",
    "applications": [
      "Armes",
      "Outils, instruments et objets utiles"
    ]
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
    "alternative": "",
    "description": "Bois robuste et flexible, le frêne est connu pour son excellent équilibre entre résistance et légèreté. Il est souvent utilisé pour la fabrication de lances, de bâtons et d’armes de frappe nécessitant un bon transfert d’énergie. Sa souplesse naturelle lui permet d’absorber efficacement les chocs, ce qui le rend idéal pour améliorer les charges en confrontation.",
    "applications": [
      "Armes",
      "Outils, instruments et objets utiles"
    ]
  },
  {
    "nom": "Bouleau",
    "type": "Bois",
    "niveau": 2,
    "effet": "Perforation via l'objet +Q",
    "armes": true,
    "outils": true,
    "armures": false,
    "bijoux": false,
    "focalisateurs": false,
    "effet_special": "",
    "alternative": "",
    "description": "Bois clair et stable, le bouleau est souvent utilisé pour des équipements nécessitant à la fois légèreté et solidité. Sa capacité à absorber les chocs en fait un excellent matériau pour les boucliers et les armures en bois, renforçant naturellement les capacités défensives de son porteur.",
    "applications": [
      "Armes",
      "Outils, instruments et objets utiles"
    ]
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
    "alternative": "",
    "description": "Léger et incroyablement résistant, le bambou est un matériau naturellement souple et durable. Il est couramment utilisé pour la fabrication d’armes nécessitant une vitesse et une réactivité accrues, comme les arcs, les sarbacanes ou les hampes de lances rapides. Sa flexibilité en fait un excellent choix pour les équipements favorisant la vitesse et l’initiative.",
    "applications": [
      "Armes",
      "Outils, instruments et objets utiles"
    ]
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
    "alternative": "",
    "description": "Flexible et résistant, le bois d’if est célèbre pour son utilisation dans la fabrication d’arcs longs et d’armes nécessitant une maîtrise exceptionnelle. Son élasticité naturelle permet un excellent contrôle des frappes et des tirs, rendant les armes forgées dans ce bois plus maniables et précises.",
    "applications": [
      "Armes",
      "Outils, instruments et objets utiles"
    ]
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
    "alternative": "",
    "description": "Bois dense et robuste, l’orme est réputé pour sa résilience et sa polyvalence. Stable et résistant à l’humidité, il est souvent utilisé dans la fabrication d’outils de précision, de manches d’armes et d’éléments de structure nécessitant une grande durabilité. Son grain serré en fait également un matériau recherché pour les catalyseurs magiques, facilitant la canalisation des énergies et renforçant la stabilité des incantations.",
    "applications": [
      "Armes",
      "Outils, instruments et objets utiles"
    ]
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
    "alternative": "",
    "description": "Bois léger et souple, l’épicéa est particulièrement apprécié pour la fabrication de baguettes magiques et d’armes de tir. Sa capacité à canaliser et amplifier certains types d’énergie en fait un matériau privilégié pour les focalisateurs arcanes et les arcs nécessitant une portée accrue. Son essence résineuse confère une excellente transmission des vibrations, idéale pour la précision et la résonance magique.",
    "applications": [
      "Armes",
      "Outils, instruments et objets utiles"
    ]
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
    "alternative": "",
    "description": "Bois dense et homogène, l’érable est réputé pour sa résistance aux chocs et sa stabilité. Sa structure fine et équilibrée en fait un matériau idéal pour les armes de précision et les outils nécessitant une maîtrise poussée. Il est particulièrement apprécié pour sa capacité à accroître la puissance des coups critiques, rendant chaque frappe plus redoutable.",
    "applications": [
      "Armes",
      "Outils, instruments et objets utiles"
    ]
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
    "alternative": "",
    "description": "Bois au grain fin et à la teinte rougeâtre profonde, le merisier est souvent utilisé pour les armes et équipements nécessitant une grande maniabilité. Sa capacité à réduire l’impact des obstacles visuels et environnementaux en fait un matériau de choix pour les armes de tir et les équipements défensifs, conférant une meilleure maîtrise des angles d’attaque et de défense.",
    "applications": [
      "Armes",
      "Outils, instruments et objets utiles"
    ]
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
    "alternative": "",
    "description": "Bois extrêmement dense et lourd, l’ébène est connu pour son affinité avec les enchantements et les forces obscures. Il est particulièrement recherché pour la fabrication d’armes et d’outils permettant d’outrepasser les résistances et les sauvegardes des adversaires, bien que cette puissance s’accompagne d’une consommation plus rapide des charges appliquées.",
    "applications": [
      "Armes",
      "Outils, instruments et objets utiles"
    ]
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
    "alternative": "",
    "description": "Bois noble au veinage marqué, l’acajou est souvent associé à la magie et aux objets enchantés. Son affinité naturelle avec les flux mystiques lui permet d’interagir avec les enchantements et maléfices, facilitant leur suppression ou leur affaiblissement au contact. Son essence robuste en fait un matériau prisé pour les armes et équipements spécialisés dans le contrôle des effets magiques.",
    "applications": [
      "Armes",
      "Outils, instruments et objets utiles"
    ]
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
    "alternative": "",
    "description": "Bois rare à la teinte rose profond, la rosaline est imprégnée d’une énergie réactive qui transforme la douleur en force. Utilisée principalement pour les armes, elle amplifie la fureur du combat en canalisant les blessures infligées pour alimenter l’adrénaline de son porteur, en faisant un matériau recherché par les combattants agressifs.",
    "applications": [
      "Armes",
      "Outils, instruments et objets utiles"
    ]
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
    "alternative": "",
    "description": "Bois dense et sombre, le chêne noir est connu pour sa force inébranlable et sa résilience naturelle. Bien qu’il ralentit les réflexes initiaux, il confère une puissance stable et méthodique, renforçant chaque action entreprise. Ce matériau est souvent utilisé pour les armes et outils nécessitant une puissance brute sans compromis.",
    "applications": [
      "Armes",
      "Outils, instruments et objets utiles"
    ]
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
    "alternative": "",
    "description": "Bois aux teintes pâles et parfum boisé léger, le cèdre blanc est réputé pour son affinité avec la magie. Il facilite le flux des énergies mystiques, réduisant la fatigue magique et optimisant l’efficacité des incantations. Prisé par les mages et enchanteurs, il est utilisé pour les bâtons, catalyseurs et artefacts arcanes.",
    "applications": [
      "Armes",
      "Outils, instruments et objets utiles"
    ]
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
    "alternative": "",
    "description": "Bois d’un gris cendré, à l’apparence fragile mais d’une structure énergétique unique, le boiscendre est un excellent conducteur de mana. Il est prisé pour les objets magiques et les catalyseurs destinés aux mages nécessitant une récupération rapide de leurs ressources mystiques, facilitant la résonance avec le flux magique environnant.",
    "applications": [
      "Armes",
      "Outils, instruments et objets utiles"
    ]
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
    "alternative": "",
    "description": "Bois tissé naturellement avec des lianes vivantes, la sylvevigne est réputée pour sa réactivité instinctive au danger. Ce matériau est particulièrement prisé par les guerriers et éclaireurs cherchant à exploiter les ouvertures et attaquer sans laisser de répit, en optimisant les frappes opportunistes.",
    "applications": [
      "Armes",
      "Outils, instruments et objets utiles"
    ]
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
    "alternative": "",
    "description": "Issu des plus anciens arbres, le bois du grand chêne est un symbole de résilience et de stabilité absolue. Utilisé dans la fabrication de boucliers et d’armures défensives, il ralentit et affaiblit les assauts ennemis en absorbant leur force et en les déséquilibrant, rendant chaque offensive plus laborieuse pour l’adversaire.",
    "applications": [
      "Armes",
      "Outils, instruments et objets utiles"
    ]
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
    "alternative": "",
    "description": "Bois imprégné d’une énergie vitale continue, la vivracine est prisée pour son affinité avec le renforcement physique et spirituel. Elle permet d’optimiser la gestion des ressources vitales en convertissant la puissance consommée en énergie utilisable, faisant d’elle un matériau privilégié pour les équipements de soutien ou d’endurance prolongée.",
    "applications": [
      "Armes",
      "Outils, instruments et objets utiles"
    ]
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
    "alternative": "",
    "description": "Légendaire et sacré, le bois d’Yggdrasil est considéré comme une extension du grand cycle de l’énergie vitale. Sa connexion avec les forces du Chi et de la Maîtrise permet d’optimiser la dépense d’énergie, réduisant l’effort nécessaire à l’accomplissement d’actions avancées. Prisé par les maîtres des arts martiaux et les pratiquants du flux énergétique, il est réservé aux armes et artefacts des plus grands combattants mystiques.",
    "applications": [
      "Armes",
      "Outils, instruments et objets utiles"
    ]
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
    "alternative": "",
    "description": "Le métal le plus répandu, considéré comme négligeable. Ce matériau ne présente ni avantages ni inconvénients.",
    "applications": [
      "Armes",
      "Armures et protections",
      "Outils, instruments et objets utiles"
    ]
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
    "alternative": "Absorption vs énergie +2Q",
    "description": "Principalement utilisé dans les alliages pour corriger les imperfections des métaux, le carbone est également reconnu pour sa résistance aux intempéries et sa durabilité.",
    "applications": [
      "Armes",
      "Armures et protections",
      "Outils, instruments et objets utiles"
    ]
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
    "alternative": "//",
    "description": "Métal largement utilisé en raison de sa disponibilité et de sa robustesse, le fer donne naissance à des produits solides mais souvent lourds. Sa refonte ne provoque aucune perte de qualité, ce qui en fait un matériau durable et recyclable. L’acier, issu de son alliage avec le carbone, combine la résistance du fer avec les propriétés correctrices du carbone, offrant ainsi un équilibre optimal entre solidité et malléabilité.",
    "applications": [
      "Armes",
      "Armures et protections",
      "Outils, instruments et objets utiles"
    ]
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
    "alternative": "Immunité vs impies (sauvegardes/résistance +Q)",
    "description": "Métal précieux et emblématique des légendes, l’argent est réputé pour son efficacité contre les créatures impies et les forces surnaturelles. Son éclat pur et sa nature conductrice en font un matériau prisé aussi bien pour les armes que pour les ornements sacrés.",
    "applications": [
      "Armes",
      "Armures et protections",
      "Outils, instruments et objets utiles"
    ]
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
    "alternative": "//",
    "description": "Métal légendaire de la culture naine, le mithril est connu pour sa solidité exceptionnelle alliée à une légèreté incomparable. Abondant dans les mines naines, il est cependant difficile à travailler, ce qui en fait un matériau réservé aux artisans les plus chevronnés.",
    "applications": [
      "Armes",
      "Armures et protections",
      "Outils, instruments et objets utiles"
    ]
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
    "alternative": "Résistance contre contondant +2Q",
    "description": "D’un aspect sombre et inquiétant, le fer noir inspire la crainte et le respect. Apprécié dans les milieux clandestins et parmi les mercenaires, il est souvent associé à des armes brutales et impitoyables Propriétés principales (Arme) : Génère 2 de pénétration plus 1 par niveau de matière si le test d’attaque dépasse la défense passive de force de la cible. Charge augmentée de 1 par niveau de matière.",
    "applications": [
      "Armes",
      "Armures et protections",
      "Outils, instruments et objets utiles"
    ]
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
    "alternative": "Résistance contre tranchant +2Q",
    "description": "Reconnaissable à son éclat laiteux, le fer blanc est un dérivé du fer classique dont l’apparence évoque la noblesse et la majesté. Apprécié dans les cercles aristocratiques et politiques, il est souvent utilisé pour la confection d’armes et d’armures symbolisant prestige et autorité.",
    "applications": [
      "Armes",
      "Armures et protections",
      "Outils, instruments et objets utiles"
    ]
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
    "alternative": "Résistance contre perforant +2Q",
    "description": "Ce métal au reflet bleuté intrigue par son lien profond avec les environnements marins. Bien que sa rareté soit relative, son extraction reste un défi en raison de son unique présence dans les fonds rocheux des côtes et des îles.",
    "applications": [
      "Armes",
      "Armures et protections",
      "Outils, instruments et objets utiles"
    ]
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
    "alternative": "Résistance vs critiques +2Q",
    "description": "Profondément liée à la transmutation et à la purification, la malachite agit comme un filtre naturel absorbant les impuretés et les énergies nocives. Elle protège contre les toxines, poisons et venins, tout en renforçant les défenses du corps contre leurs effets.",
    "applications": [
      "Armes",
      "Armures et protections",
      "Outils, instruments et objets utiles"
    ]
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
    "alternative": "Immunité vs venins/poisons/acides (sauvegardes/résistance +Q)",
    "description": "Métal rare et noble, le platine est reconnu pour sa grande résistance aux agents corrosifs et aux toxines. Sa pureté et son inertie chimique en font un choix privilégié pour les équipements nécessitant une durabilité exceptionnelle face aux substances agressives.",
    "applications": [
      "Armes",
      "Armures et protections",
      "Outils, instruments et objets utiles"
    ]
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
    "alternative": "Ajustement +Q avec les mécanismes de l'objet (lors de l'activation)",
    "description": "Matériau sophistiqué à la structure exceptionnelle, l’altium est prisé pour son interaction harmonieuse avec les mécanismes complexes. Son utilisation facilite l’ingénierie et l’intégration de technologies avancées, rendant les objets plus performants et adaptatifs.",
    "applications": [
      "Armes",
      "Armures et protections",
      "Outils, instruments et objets utiles"
    ]
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
    "alternative": "Protection Physique ajustement +Q",
    "description": "Métal d’une robustesse exceptionnelle, le titane est reconnu pour sa résistance à l’usure et à la corrosion. Sa solidité lui permet d’absorber efficacement les chocs, tandis que sa légèreté relative en fait un choix prisé pour les équipements nécessitant une durabilité accrue.",
    "applications": [
      "Armes",
      "Armures et protections",
      "Outils, instruments et objets utiles"
    ]
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
    "alternative": "Résistance aux conditions de ruptures +2Q",
    "description": "Matériau d’origine ancienne et énigmatique, la mégalite est reconnue pour son interaction avec les forces mystiques et les enchantements. Elle confère à ses équipements une capacité unique à manipuler les altérations d’état, renforçant leur efficacité ou minimisant leurs effets adverses.",
    "applications": [
      "Armes",
      "Armures et protections",
      "Outils, instruments et objets utiles"
    ]
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
    "alternative": "Résistance aux conditions physiques +1+Q",
    "description": "Matériau d’origine ancienne et énigmatique, la mégalite semble imprégnée d’un pouvoir influençant les forces mystiques et les altérations d’état. Elle renforce les malédictions et afflictions infligées tout en protégeant son porteur des effets néfastes, ce qui en fait un élément prisé pour les reliques et artefacts anciens.",
    "applications": [
      "Armes",
      "Armures et protections",
      "Outils, instruments et objets utiles"
    ]
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
    "alternative": "Gravité (des blessures) reçues -1-Q",
    "description": "Métal imprégné d’une essence corruptrice, la corentine est réputée pour exacerber la gravité des blessures qu’elle inflige, rendant leur guérison particulièrement difficile. À l’inverse, les armures forgées dans ce matériau atténuent les effets des blessures reçues et stabilisent l’état du porteur, limitant les risques d’aggravation.",
    "applications": [
      "Armes",
      "Armures et protections",
      "Outils, instruments et objets utiles"
    ]
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
    "alternative": "//",
    "description": "Métal précieux reconnu pour sa malléabilité et son éclat inaltérable, l’or est prisé pour l’ornementation et les objets de prestige. Cependant, sa faible solidité le rend peu adapté aux usages martiaux, bien qu’il soit extrêmement facile à travailler et à façonner.",
    "applications": [
      "Armes",
      "Armures et protections",
      "Outils, instruments et objets utiles"
    ]
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
    "alternative": "Réduit les enchantements reçus d'une magnitude de 1+Q",
    "description": "D’une teinte bleutée iridescente, le fer azuréen est connu pour sa forte affinité avec les enchantements. Capable de canaliser et d’amplifier la magie, il est souvent employé dans la fabrication d’armes et d’armures mystiques, facilitant l’usage des sorts et des incantations.",
    "applications": [
      "Armes",
      "Armures et protections",
      "Outils, instruments et objets utiles"
    ]
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
    "alternative": "Immunité aux élémentaires (sauvegardes/résistance +Q)",
    "description": "Matériau rare à l’éclat spectral, la lunalite est connue pour son effet nocif sur les élémentaires, perturbant leur structure magique. Elle émet une faible lueur en permanence, dont l’intensité semble réagir aux phases lunaires ou à la proximité de phénomènes surnaturels.",
    "applications": [
      "Armes",
      "Armures et protections",
      "Outils, instruments et objets utiles"
    ]
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
    "alternative": "//",
    "description": "Pierre d’une rareté extrême, le matérium est conçu pour harmoniser et amplifier l’utilisation des matérias, facilitant leur fusion et maximisant leur efficacité. Son essence hautement adaptable en fait un matériau de choix pour les équipements magiques avancés.",
    "applications": [
      "Armes",
      "Armures et protections",
      "Outils, instruments et objets utiles"
    ]
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
    "alternative": "Absorption physique +Q",
    "description": "Métal dense d’un vert profond, le viridium est réputé pour sa solidité et sa capacité à transpercer les matériaux les plus résistants. Utilisé autant pour les armes que pour les armures, il confère une robustesse accrue et améliore l’efficacité des coups critiques en raison de sa structure unique.",
    "applications": [
      "Armes",
      "Armures et protections",
      "Outils, instruments et objets utiles"
    ]
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
    "alternative": "Chaque tour le personnage reçoit X PE temporaire(s)",
    "description": "Matériau particulièrement résistant à l’usure, la fergacite est connue pour sa capacité à prolonger la durée de vie des équipements. Son extrême résilience en fait un choix privilégié pour les armures et les armes qui doivent supporter un usage intensif sans perdre en efficacité.",
    "applications": [
      "Armes",
      "Armures et protections",
      "Outils, instruments et objets utiles"
    ]
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
    "alternative": "Résistance +Q/2",
    "description": "Pierre singulière à la structure évolutive, l’olutium s’adapte progressivement à son porteur et à son environnement. D’abord instable et fragile, il gagne en puissance avec le temps, améliorant la robustesse des équipements qui en sont constitués.",
    "applications": [
      "Armes",
      "Armures et protections",
      "Outils, instruments et objets utiles"
    ]
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
    "alternative": "Résilience ajustement +Q",
    "description": "Issu des profondeurs du cosmos, ce matériau céleste possède des propriétés singulières qui le rendent extrêmement solide mais difficile à manier. Chargé d’énergies inconnues, il interagit de manière imprévisible avec certaines créatures, amplifiant ou inversant ses effets en fonction de leur nature.",
    "applications": [
      "Armes",
      "Armures et protections",
      "Outils, instruments et objets utiles"
    ]
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
    "alternative": "//",
    "description": "Métal extrêmement stable, le torium est réputé pour sa résistance aux conditions les plus extrêmes. Ni la chaleur, ni le froid, ni les environnements hostiles ne semblent l’altérer, ce qui en fait un matériau idéal pour la fabrication d’armes et d’armures capables de résister aux pires épreuves.",
    "applications": [
      "Armes",
      "Armures et protections",
      "Outils, instruments et objets utiles"
    ]
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
    "alternative": "//",
    "description": "Métal rare aux propriétés instables, l’oridecon est réputé pour conférer une puissance inégalée à ses porteurs, mais au prix d’un maniement difficile. Sa densité extrême en fait un matériau particulièrement lourd, et son interaction brutale avec les autres métaux peut entraîner leur détérioration rapide lors des affrontements.",
    "applications": [
      "Armes",
      "Armures et protections",
      "Outils, instruments et objets utiles"
    ]
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
    "alternative": "//",
    "description": "Connue pour sa structure incroyablement robuste, l’elunium est un matériau idéal pour les équipements conçus pour endurer des conditions extrêmes. Sa résilience exceptionnelle lui permet d’absorber les impacts avec une efficacité redoutable, retournant même les effets des tests de solidité contre ses assaillants.",
    "applications": [
      "Armes",
      "Armures et protections",
      "Outils, instruments et objets utiles"
    ]
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
    "alternative": "Pénalité d'initiative de l'armure -Q",
    "description": "L’obsidienne est une pierre de protection et de lucidité, qui renforce l’agilité mentale et physique en éliminant les distractions et les blocages émotionnels. Elle aide à réagir rapidement face aux dangers en donnant une vision claire et tranchante de la réalité.",
    "applications": [
      "Armes",
      "Armures et protections",
      "Outils, instruments et objets utiles"
    ]
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
    "alternative": "Vitesse passive (via l'objet) +Q",
    "description": "Issu d’éclats métalliques tombés du ciel, le fer sidéral possède une résonance particulière avec les forces célestes et les flux énergétiques. Il confère une fluidité exceptionnelle aux mouvements de ceux qui le manient, rendant les attaques plus rapides et les déplacements plus instinctifs, bien que son usage exige une grande maîtrise.",
    "applications": [
      "Armes",
      "Armures et protections",
      "Outils, instruments et objets utiles"
    ]
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
    "alternative": "Résistance à la pénétration +Q",
    "description": "Métal à la structure complexe, la chromite est réputée pour son influence sur la stabilité des actions réalisées avec un objet forgé dans cette matière. Elle modifie subtilement les résultats des affrontements, amplifiant les exploits tout en perturbant les défenses adverses, ce qui en fait un matériau recherché par les combattants aguerris.",
    "applications": [
      "Armes",
      "Armures et protections",
      "Outils, instruments et objets utiles"
    ]
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
    "alternative": "//",
    "description": "D’une noirceur abyssale, le ténébrium est une matière aux propriétés mystérieuses qui semble altérer la perception du temps et de l’espace lors des affrontements. Elle renforce l’expertise et la maîtrise de son porteur tout en drainant son endurance, rendant chaque action plus calculée mais énergivore. Son influence obscure interdit toute interférence du hasard, forçant les adversaires à se reposer uniquement sur leur talent brut.",
    "applications": [
      "Armes",
      "Armures et protections",
      "Outils, instruments et objets utiles"
    ]
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
    "alternative": "Si attaque adverse < défense - 5 => Dégats 1+Q de l'élément (ignore résistance)",
    "description": "Issu des créatures draconiques, l’os de drake est un matériau organique exceptionnel, imprégné de l’essence élémentaire du dragon dont il provient. Forgé en arme ou en armure, il confère des propriétés élémentaires naturelles, modifiant la résistance de son porteur ou affaiblissant celle de ses adversaires, faisant de lui un choix privilégié pour les combattants cherchant à exploiter les faiblesses élémentaires.",
    "applications": [
      "Armes",
      "Armures et protections",
      "Outils, instruments et objets utiles"
    ]
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
    "alternative": "Immunité aux dragpns (sauvegardes/résistance +Q)",
    "description": "Légendaire et extrêmement rare, la dragonite est un minéral formé dans les profondeurs des montagnes où sommeillent les dragons anciens. Naturellement hostile aux créatures dragonoïdes, elle est redoutée par ces dernières et confère à ses porteurs une faveur du destin en réduisant l’influence du hasard dans leurs actions.",
    "applications": [
      "Armes",
      "Armures et protections",
      "Outils, instruments et objets utiles"
    ]
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
    "alternative": "//",
    "description": "Métal mythique mentionné dans les légendes anciennes, l’orichalque est la matière la plus rare et la plus résistante connue. Indestructible à température normale, il ne peut être forgé qu’à des chaleurs extrêmes et uniquement avec des outils d’une robustesse équivalente, comme ceux en orichalque ou en torium. Réservé aux maîtres artisans, il confère à ses équipements une longévité absolue et une puissance hors du commun.",
    "applications": [
      "Armes",
      "Armures et protections",
      "Outils, instruments et objets utiles"
    ]
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
    "effet_special": "n/a",
    "alternative": "Bois le sang : 3 PV perdus octrois 1 PV temporaire",
    "description": "???",
    "applications": [
      "Armes",
      "Armures et protections",
      "Outils, instruments et objets utiles"
    ]
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
    "effet_special": "n/a",
    "alternative": "Chaque tour le personnage reçoit X PM temporaire(s)",
    "description": "???",
    "applications": [
      "Armes",
      "Armures et protections",
      "Outils, instruments et objets utiles"
    ]
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
    "effet_special": "n/a",
    "alternative": "Chaque tour le personnage reçoit X PC temporaire(s)",
    "description": "???",
    "applications": [
      "Armes",
      "Armures et protections",
      "Outils, instruments et objets utiles"
    ]
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
    "alternative": "",
    "description": "Fer + Carbone",
    "applications": [
      "Armes",
      "Armures et protections",
      "Outils, instruments et objets utiles"
    ]
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
    "alternative": "",
    "description": "Fer noir + Carbone",
    "applications": [
      "Armes",
      "Armures et protections",
      "Outils, instruments et objets utiles"
    ]
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
    "alternative": "",
    "description": "Titane + Olutium",
    "applications": [
      "Armes",
      "Armures et protections",
      "Outils, instruments et objets utiles"
    ]
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
    "alternative": "",
    "description": "Mithril + Fer Sidérale",
    "applications": [
      "Armes",
      "Armures et protections",
      "Outils, instruments et objets utiles"
    ]
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
    "alternative": "",
    "description": "Orichalque + Olutium",
    "applications": [
      "Armes",
      "Armures et protections",
      "Outils, instruments et objets utiles"
    ]
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
    "alternative": "",
    "description": "???",
    "applications": [
      "Bijoux et colifichets"
    ]
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
    "alternative": "",
    "description": "Pierre de l’intuition et de la perception subtile, la pierre de lune affine les sens invisibles et favorise une compréhension plus profonde du monde. Elle aide à capter les signes cachés, renforce l’instinct et permet de distinguer la vérité derrière les illusions.",
    "applications": [
      "Bijoux et colifichets"
    ]
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
    "alternative": "",
    "description": "Rayonnante et ardente, la pierre de soleil stimule le charisme et l’assurance personnelle. Elle insuffle une énergie magnétique qui attire le succès et renforce la confiance en soi. Elle est idéale pour les leaders et orateurs, leur permettant d’inspirer et motiver leur entourage.",
    "applications": [
      "Bijoux et colifichets"
    ]
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
    "alternative": "",
    "description": "L’obsidienne est une pierre de protection et de lucidité, qui renforce l’agilité mentale et physique en éliminant les distractions et les blocages émotionnels. Elle aide à réagir rapidement face aux dangers en donnant une vision claire et tranchante de la réalité.",
    "applications": [
      "Bijoux et colifichets"
    ]
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
    "alternative": "",
    "description": "Pierre de sagesse et d’apaisement mental, l’améthyste stimule la pensée claire et la réflexion profonde. Elle renforce l’intellect et la capacité d’analyse, permettant de prendre du recul et d’éviter les décisions précipitées sous l’influence des émotions.",
    "applications": [
      "Bijoux et colifichets"
    ]
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
    "alternative": "",
    "description": "Pierre de clarté et d’amplification, le quartz canalise et renforce les énergies environnantes, offrant une meilleure concentration et une perception affinée du réel. Il dissipe le flou mental et empêche l’altération des souvenirs, permettant une pensée structurée et logique en toutes circonstances.",
    "applications": [
      "Bijoux et colifichets"
    ]
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
    "alternative": "",
    "description": "Pierre de vérité et d’éveil intellectuel, le lapis-lazuli éclaire l’esprit et renforce la cohérence entre la parole et la pensée. Il dissipe les incertitudes et aiguise l’intuition, permettant une compréhension instinctive des interactions et un discernement accru face aux manipulations.",
    "applications": [
      "Bijoux et colifichets"
    ]
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
    "alternative": "",
    "description": "Vibrante et mystérieuse, l’azurite favorise une vision au-delà des apparences et stimule l’esprit à percevoir ce qui est caché ou dissimulé. Elle protège contre les illusions et les distorsions de la réalité, offrant une perception plus aiguisée et une meilleure compréhension des phénomènes inexplicables.",
    "applications": [
      "Bijoux et colifichets"
    ]
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
    "alternative": "",
    "description": "Pierre d’ancrage et de stabilité, la tourmaline agit comme un rempart contre les perturbations mentales. Elle absorbe et neutralise les influences négatives, évitant la confusion et maintenant un esprit lucide et ordonné, même dans des situations chaotiques ou sous l’effet d’altérations extérieures.",
    "applications": [
      "Bijoux et colifichets"
    ]
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
    "alternative": "",
    "description": "Pierre de discipline et de ténacité, l’onyx renforce la résistance mentale et physique, permettant de surmonter les épreuves avec persévérance. Son énergie stabilisante favorise la récupération et le rétablissement, accélérant la convalescence après une blessure ou une épreuve intense.",
    "applications": [
      "Bijoux et colifichets"
    ]
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
    "alternative": "",
    "description": "Sombre et protecteur, le jais est une pierre traditionnellement utilisée pour repousser les énergies néfastes et les malédictions. Il agit comme un rempart contre les influences occultes, tout en permettant d’accéder à une sagesse ancienne, ancrée dans la mémoire des ancêtres.",
    "applications": [
      "Bijoux et colifichets"
    ]
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
    "alternative": "",
    "description": "Lumineuse et rayonnante, la citrine attire la prospérité et l’abondance, tout en dissipant la négativité et le doute. Elle protège des pertes et des imprévus financiers, rendant son porteur plus alerte face aux arnaques, manipulations et vols.",
    "applications": [
      "Bijoux et colifichets"
    ]
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
    "alternative": "",
    "description": "Fossilisé au fil des âges, l’ambre est associé à la longévité et à la vitalité. Sa nature solaire et chaleureuse fortifie le corps et l’esprit, aidant à prévenir et combattre les maladies en renforçant les défenses naturelles et l’équilibre intérieur.",
    "applications": [
      "Bijoux et colifichets"
    ]
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
    "alternative": "",
    "description": "Pierre de clarté mentale et de lucidité, la topaze dissipe la confusion et les influences troublantes, permettant une pensée affûtée et une compréhension limpide des situations complexes. Elle agit comme un filtre énergétique, protégeant son porteur des perturbations extérieures et des influences magiques instables.",
    "applications": [
      "Bijoux et colifichets"
    ]
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
    "alternative": "",
    "description": "Rayonnant d’une énergie ardente, le grenat stimule la vigueur et la motivation, insufflant force et ténacité. Il est un catalyseur de vitalité, permettant de lutter contre l’épuisement et la lassitude, et conférant une endurance accrue face aux efforts prolongés.",
    "applications": [
      "Bijoux et colifichets"
    ]
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
    "alternative": "",
    "description": "Brûlant d’une intensité flamboyante, le rubis est le symbole du courage et de l’ambition, forgeant une volonté inébranlable. Son éclat incandescent confère une résistance exceptionnelle aux chaleurs extrêmes, rendant son porteur moins vulnérable aux environnements hostiles et aux flammes destructrices.",
    "applications": [
      "Bijoux et colifichets"
    ]
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
    "alternative": "",
    "description": "Profond et immuable, le saphir est la pierre de la sagesse et de la discipline mentale. Il favorise la concentration et la rigueur, tout en protégeant son porteur des distractions et des influences émotionnelles nuisibles. Associé à la clarté d’esprit, il procure une résistance naturelle aux froids les plus mordants.",
    "applications": [
      "Bijoux et colifichets"
    ]
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
    "alternative": "",
    "description": "Vibrante et ardente, la cornaline est une pierre de mouvement et d’initiative, insufflant audace et spontanéité. Elle stimule la prise de décision rapide et l’action instinctive, empêchant l’indécision et favorisant l’adaptabilité face aux défis.",
    "applications": [
      "Bijoux et colifichets"
    ]
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
    "alternative": "",
    "description": "Énergisant et fortifiant, le spinelle est une pierre de résistance et d’endurance, renforçant la capacité du corps et de l’esprit à encaisser l’oppression. Il confère à son porteur une résilience inébranlable face aux contraintes physiques ou mentales, l’aidant à échapper aux entraves et à préserver sa liberté.",
    "applications": [
      "Bijoux et colifichets"
    ]
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
    "alternative": "",
    "description": "Profondément liée à la transmutation et à la purification, la malachite agit comme un filtre naturel absorbant les impuretés et les énergies nocives. Elle protège contre les toxines, poisons et venins, tout en renforçant les défenses du corps contre leurs effets.",
    "applications": [
      "Bijoux et colifichets"
    ]
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
    "alternative": "",
    "description": "Symbole d’équilibre et d’harmonie, le jade favorise une connexion fluide avec le destin, attirant la prospérité et les opportunités favorables. Il équilibre les énergies internes et externes, ouvrant la voie aux rencontres bénéfiques et aux tournants positifs de la vie.",
    "applications": [
      "Bijoux et colifichets"
    ]
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
    "alternative": "",
    "description": "Clairvoyant et protecteur, le péridot dissipe les énergies malveillantes et les influences oppressantes. Il agit comme un voile subtil qui détourne les soupçons, les regards indiscrets et l’attention non désirée, rendant son porteur plus difficile à cerner et à surveiller.",
    "applications": [
      "Bijoux et colifichets"
    ]
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
    "alternative": "",
    "description": "Pierre d’optimisme et de sérénité, l’aventurine attire la chance et les opportunités tout en réduisant les tensions intérieures. Son énergie douce agit comme un bouclier contre les coups du sort, aidant son porteur à se relever et à naviguer à travers l’incertitude avec confiance.",
    "applications": [
      "Bijoux et colifichets"
    ]
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
    "alternative": "",
    "description": "Symbole de stabilité et de résilience, le jaspe renforce l’endurance et la persévérance face aux épreuves. Il confère une force intérieure permettant de mieux résister aux conditions extrêmes, comme le manque de nourriture ou d’eau, en maintenant l’énergie vitale du porteur.",
    "applications": [
      "Bijoux et colifichets"
    ]
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
    "alternative": "",
    "description": "Pierre d’intellect et d’ambition, la pyrite stimule l’esprit analytique et protège contre les tromperies et les manipulations. Son éclat métallique symbolise la clarté mentale et la résistance aux influences extérieures qui chercheraient à fausser le jugement ou à troubler la perception de la réalité.",
    "applications": [
      "Bijoux et colifichets"
    ]
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
    "alternative": "",
    "description": "Pierre imprégnée d’énergie cosmique, l’ætherite est un catalyseur de magie pure, reliant son porteur aux flux mystiques de l’univers. Elle protège l’esprit contre les influences oniriques et les altérations du voile, empêchant les incursions extérieures dans la psyché du porteur.",
    "applications": [
      "Bijoux et colifichets"
    ]
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
    "alternative": "",
    "description": "Pierre énigmatique liée aux ombres et aux secrets, la vesperine confère une agilité instinctive et une perception affinée des mystères cachés. Son énergie stabilisante réduit les risques liés aux chutes, amortissant leurs conséquences physiques et magiques.",
    "applications": [
      "Bijoux et colifichets"
    ]
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
    "alternative": "",
    "description": "Pierre de lumière sacrée, la seraphine est un rempart contre les forces occultes et les influences corruptrices. Son éclat purificateur dissipe les ténèbres et protège de toute intrusion divine, qu’elle soit bénédiction ou malédiction, offrant un équilibre spirituel inaltérable.",
    "applications": [
      "Bijoux et colifichets"
    ]
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
    "alternative": "",
    "description": "Imprégnée de l’énergie primordiale des dragons, la dracarys incarne la puissance brute et l’instinct combatif. Elle confère une force indomptable, renforçant l’impact des attaques et intensifiant les flammes intérieures, qu’elles soient physiques ou magiques.",
    "applications": [
      "Bijoux et colifichets"
    ]
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
    "alternative": "",
    "description": "???",
    "applications": [
      "Bijoux et colifichets"
    ]
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
    "alternative": "",
    "description": "Pierre de résonance magique, l’orpheal amplifie les vibrations sonores et mystiques, permettant une expression claire et puissante. Elle harmonise les énergies environnantes, rendant la voix plus pénétrante et l’influence plus marquée, qu’il s’agisse d’incantations, de persuasion ou d’art oratoire.",
    "applications": [
      "Focalisateurs"
    ]
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
    "alternative": "",
    "description": "Pierre cristalline d’un blanc laiteux, traversée de veines dorées scintillant à chaque incantation. Elle évoque l’éclat d’une idée parfaitement formulée.",
    "applications": [
      "Focalisateurs"
    ]
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
    "alternative": "",
    "description": "Fragment d’arc-en-ciel minéral aux teintes changeantes selon l’angle de vue. Le cristal pulse doucement comme s’il respirait une logique supérieure.",
    "applications": [
      "Focalisateurs"
    ]
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
    "alternative": "",
    "description": "Cristal violet foncé strié de lignes argentées. Il donne une impression d’élasticité arcanique, comme si le temps s’étirait au contact de la matière.",
    "applications": [
      "Focalisateurs"
    ]
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
    "alternative": "",
    "description": "Minerai d’un bleu profond, hérissé de pointes translucides qui s’allument légèrement à chaque usage. On dit qu’il garde la mémoire des sorts.",
    "applications": [
      "Focalisateurs"
    ]
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
    "alternative": "",
    "description": "Minerai d’un bleu profond, hérissé de pointes translucides qui s’illuminent faiblement au contact de l’énergie magique. Il semble résonner avec les forces latentes du monde.",
    "applications": [
      "Focalisateurs"
    ]
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
    "alternative": "",
    "description": "Pierre rougeoyante et striée comme une veine battante, elle dégage une chaleur sourde, presque émotionnelle. Elle semble intensifier l’intention du lanceur.",
    "applications": [
      "Focalisateurs"
    ]
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
    "alternative": "",
    "description": "Bloc minéral rugueux à l’extérieur, mais renfermant un cœur cristallin mouvant. Il vibre au rythme des entités convoquées, comme une cage encore habitée.",
    "applications": [
      "Focalisateurs"
    ]
  },
  {
    "nom": "Ignathys",
    "type": "Magicite",
    "niveau": "X",
    "effet": "Perforation des sorts +2xQ (limité par niveau du sort)",
    "armes": false,
    "outils": false,
    "armures": false,
    "bijoux": false,
    "focalisateurs": true,
    "effet_special": "",
    "alternative": "",
    "description": "Éclat doré zébré de noir, semblant se consumer lentement de l’intérieur. Sa présence impose silence et tension.",
    "applications": [
      "Focalisateurs"
    ]
  },
  {
    "nom": "Jakharys",
    "type": "Magicite",
    "niveau": "X",
    "effet": "Jets arcaniques +Q (limité par niveau du sort)",
    "armes": false,
    "outils": false,
    "armures": false,
    "bijoux": false,
    "focalisateurs": true,
    "effet_special": "",
    "alternative": "",
    "description": "Cristal orangé incandescent, dont les reflets dansent comme des braises vivantes. Il semble vouloir bondir hors de la main du mage.",
    "applications": [
      "Focalisateurs"
    ]
  },
  {
    "nom": "Kalythis",
    "type": "Magicite",
    "niveau": "X",
    "effet": "Ajustement d'incantation +Q (école ou domaine précis) (limité par niveau du sort)",
    "armes": false,
    "outils": false,
    "armures": false,
    "bijoux": false,
    "focalisateurs": true,
    "effet_special": "",
    "alternative": "",
    "description": "Pierre noire à reflets bleutés, mate mais vivante, comme un œil fermé. Elle semble amplifier toute forme d’intuition arcanique.",
    "applications": [
      "Focalisateurs"
    ]
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
    "alternative": "",
    "description": "Cristal émeraude taillé en strates, qui s’adapte à l’aura de celui qui le touche. Un lien profond se forme selon la magie façonnée.",
    "applications": [
      "Focalisateurs"
    ]
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
    "alternative": "",
    "description": "Éclat d’opale lunaire presque translucide. Une fois activée, elle projette de brèves ondulations lumineuses autour du lanceur.",
    "applications": [
      "Focalisateurs"
    ]
  },
  {
    "nom": "Nymbréos",
    "type": "Magicite",
    "niveau": "X",
    "effet": "Portée des sorts +20xQ% (limité par niveau du sort)",
    "armes": false,
    "outils": false,
    "armures": false,
    "bijoux": false,
    "focalisateurs": true,
    "effet_special": "",
    "alternative": "",
    "description": "Pierre fumée dont les volutes internes semblent ralentir le flux de mana. Elle adoucit l’impact des excès magiques.",
    "applications": [
      "Focalisateurs"
    ]
  },
  {
    "nom": "Oracyn",
    "type": "Magicite",
    "niveau": "X",
    "effet": "Zone d'effet des sorts +20xQ% (limité par niveau du sort)",
    "armes": false,
    "outils": false,
    "armures": false,
    "bijoux": false,
    "focalisateurs": true,
    "effet_special": "",
    "alternative": "",
    "description": "Fragment cristallin traversé de veines blanches et bleues. En l’utilisant, les sorts semblent s’étirer plus loin que la main ne peut voir.",
    "applications": [
      "Focalisateurs"
    ]
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
    "alternative": "",
    "description": "Cristal argenté irradiant une lueur douce et uniforme. Il semble étendre la présence du lanceur autour de lui.",
    "applications": [
      "Focalisateurs"
    ]
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
    "alternative": "",
    "description": "Pierre rouge intense parcourue de nervures dorées. Elle brûle doucement, ranimant la puissance des enchantements qui la touchent.",
    "applications": [
      "Focalisateurs"
    ]
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
    "alternative": "",
    "description": "Bloc minéral d’un gris bleuté, lisse comme le métal poli. Il réagit vivement aux menaces, générant de subtils éclats protecteurs.",
    "applications": [
      "Focalisateurs"
    ]
  },
  {
    "nom": "Targarris",
    "type": "Magicite",
    "niveau": "X",
    "effet": "Attrition des sorts +2xQ (limité par niveau du sort)",
    "armes": false,
    "outils": false,
    "armures": false,
    "bijoux": false,
    "focalisateurs": true,
    "effet_special": "",
    "alternative": "",
    "description": "Cristal noir profond, parsemé de micro-luminescences violettes. Il confère une impression de stabilité face à l’inconnu.",
    "applications": [
      "Focalisateurs"
    ]
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

  function equipmentTags(e) {
    const labels = e.applications || [];
    return labels.map(l => `<span class="mat-tag">${l}</span>`).join(' ');
  }

  function render(list) {
    tbody.innerHTML = '';
    list.forEach(e => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${e.nom}</strong></td>
        <td>${e.type}</td>
        <td style="text-align:center">${e.niveau}</td>
        <td>${equipmentTags(e)}</td>
        <td>${e.effet}</td>
        <td style="font-size:0.88em;color:#555">${e.description}</td>
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
      if (q && ![e.nom, e.type, e.effet, e.description, e.effet_special, e.alternative, ...(e.applications || [])]
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
