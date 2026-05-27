# École d'Évocation

<div id="mpv-app">

<div class="mpv-filters">
  <input type="text" id="mpv-search" placeholder="Rechercher (nom, latin, arcanique, description…)" />
  <select id="mpv-type">
    <option value="">Tous les types</option>
    <option value="Interruption">Interruption</option>
<option value="Miracle">Miracle</option>
<option value="Pouvoir">Pouvoir</option>
  </select>
  <select id="mpv-target">
    <option value="">Toutes les cibles</option>
    <option value="Cible">Cible</option>
<option value="Cible (enchantement)">Cible (enchantement)</option>
<option value="Cible (point)">Cible (point)</option>
<option value="Lieu/Cible">Lieu/Cible</option>
<option value="Soi">Soi</option>
  </select>
  <span id="mpv-count"></span>
</div>

<table id="mpv-table">
  <thead>
    <tr>
      <th class="col-num">#</th>
      <th class="col-vulgar" data-col="vulgar">Vulgaire ↕</th>
      <th class="col-latin">Latin / Arcanique</th>
      <th class="col-type" data-col="word_type">Type ↕</th>
      <th class="col-target" data-col="target_type">Cible ↕</th>
      <th class="col-diff" data-col="difficulty">Diff. ↕</th>
      <th class="col-drain" data-col="drain">Drain ↕</th>
      <th class="col-keys">Clés</th>
      <th class="col-desc">Description</th>
    </tr>
  </thead>
  <tbody id="mpv-tbody"></tbody>
</table>

</div>

<style>
#mpv-app {
  font-size: 0.85em;
}
.mpv-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5em;
  margin-bottom: 1em;
  align-items: center;
}
.mpv-filters input[type=text] {
  flex: 1;
  min-width: 260px;
  padding: 0.35em 0.6em;
  border: 1px solid #aaa;
  border-radius: 4px;
  font-size: 0.9em;
  background: var(--md-default-bg-color, #fff);
  color: var(--md-default-fg-color, #000);
}
.mpv-filters select {
  padding: 0.35em 0.6em;
  border: 1px solid #aaa;
  border-radius: 4px;
  font-size: 0.9em;
  background: var(--md-default-bg-color, #fff);
  color: var(--md-default-fg-color, #000);
}
#mpv-count {
  margin-left: auto;
  color: #888;
  font-size: 0.85em;
  white-space: nowrap;
}
#mpv-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}
#mpv-table th, #mpv-table td {
  padding: 0.35em 0.5em;
  border: 1px solid var(--md-default-fg-color--lightest, #e0e0e0);
  vertical-align: top;
  word-break: break-word;
}
#mpv-table th {
  background: var(--md-primary-fg-color, #3f51b5);
  color: var(--md-primary-bg-color, #fff);
  cursor: pointer;
  user-select: none;
}
#mpv-table th:hover { opacity: 0.85; }
.col-num    { width: 2%; text-align: center; }
.col-vulgar { width: 9%; }
.col-latin  { width: 10%; }
.col-type   { width: 7%; }
.col-target { width: 7%; }
.col-diff   { width: 3%; text-align: center; }
.col-drain  { width: 3%; text-align: center; }
.col-keys   { width: 16%; }
.col-desc   { width: 43%; }
#mpv-table tbody tr:nth-child(even) {
  background: var(--md-default-bg-color--light, #f9f9f9);
}
#mpv-table tbody tr:hover {
  background: var(--md-accent-fg-color--transparent, #e8eaf6);
}
.mpv-bracket {
  color: #ff1493;
  font-weight: bold;
}
</style>

<script>
(function() {
  const DATA = [
  {
    "num": 1,
    "vulgar": "Galvanisation",
    "latin": "Vibro (Agiter, secouer)",
    "arcane": "Evvibro (Ev + vibro)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "❤️ Vie: Evvibroir (PV), 🧩 Mental: Evvibroend (PS), 🌀 Chaos: Evvibroix (PK), ⚕️ Corps: Evvibroen (PC), 🧠 Esprit: Evvibroys (PC), 🔮 Magie: Evvibroirn (PM), 🪷 Nature: Evvibroeiln (PE/fatigue)",
    "description": "Génère un effet octroyant [Magnitude/2] points temporaires d'une ressource qui dépends de la [clé]."
  },
  {
    "num": 2,
    "vulgar": "Corruption",
    "latin": "Corruptio (Briser, détruire)",
    "arcane": "Enruptio (En + ruptio)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "✡️ Arcane: Enruptioys",
    "description": "Génère un effet octroyant [Magnitude/5] points de corruption temporaires."
  },
  {
    "num": 3,
    "vulgar": "Énergisation",
    "latin": "Energia (Force)",
    "arcane": "Eloenrgi (Elo + enrgi)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🪷 Nature: Eloenrgieiln",
    "description": "Génère un effet octroyant [Magnitude] points d'endurance (PE) temporaires."
  },
  {
    "num": 4,
    "vulgar": "Attraction",
    "latin": "Traho (Tirer)",
    "arcane": "Eruatrat (Eru + atrat)",
    "word_type": "Pouvoir",
    "target_type": "Cible (point)",
    "difficulty": "2",
    "drain": "2",
    "keys": "💢 Vide: Eruatratarh",
    "description": "Génère un effet d'attraction agissant comme l'action tactique de déplacement forcé avec un jet de [Magnitude] et attirant en son centre toutes les cibles dans la zone d'effet, de fait le sort doit inclure une zone d'effet, la cible doit être touchée (défense passive FOR dépassée) et peux s'en défendre normalement (comme s'il s'agissait d'une tactique)."
  },
  {
    "num": 5,
    "vulgar": "Répulsion",
    "latin": "Pello (Pousser, chasser)",
    "arcane": "Evpello (Ev + pello)",
    "word_type": "Pouvoir",
    "target_type": "Cible (point)",
    "difficulty": "2",
    "drain": "2",
    "keys": "🌪️ Air: Evpelloel",
    "description": "Génère un effet de répulsion agissant comme l'action tactique de déplacement forcé avec un jet de [Magnitude] et repoussant de son centre toutes les cibles dans la zone d'effet, de fait le sort doit inclure une zone d'effet, la cible doit être touchée (défense passive AGI dépassée) et peux s'en défendre normalement (comme s'il s'agissait d'une tactique)."
  },
  {
    "num": 6,
    "vulgar": "Lévitation",
    "latin": "Leves (Léger)",
    "arcane": "Enleves (En + leves)",
    "word_type": "Interruption",
    "target_type": "Cible (point)",
    "difficulty": "2",
    "drain": "2",
    "keys": "🌪️ Air: Enlevesel",
    "description": "Réduit la chute de la cible de [Magnitude/2] mètres."
  },
  {
    "num": 7,
    "vulgar": "Précipitation",
    "latin": "Precipito (Lancer en avant)",
    "arcane": "Elopreci (Elo + preci)",
    "word_type": "Interruption",
    "target_type": "Cible (point)",
    "difficulty": "2",
    "drain": "2",
    "keys": "🪨 Terre: Eloprecium",
    "description": "Augmente la chute de la cible de [Magnitude/2] mètres."
  },
  {
    "num": 8,
    "vulgar": "Propulsion",
    "latin": "Pello (Pousser en avant)",
    "arcane": "Erupuls (Eru + puls)",
    "word_type": "Pouvoir",
    "target_type": "Cible (point)",
    "difficulty": "2",
    "drain": "2",
    "keys": "🌪️ Air: Erupulsel",
    "description": "Génère un effet de déplacement agissant comme l'action tactique de déplacement forcé avec un jet de [Magnitude] sur une cible dans la direction opposée au lanceur du sort."
  },
  {
    "num": 9,
    "vulgar": "Traction",
    "latin": "Traho (Tirer)",
    "arcane": "Evtract (Ev + tract)",
    "word_type": "Pouvoir",
    "target_type": "Cible (point)",
    "difficulty": "2",
    "drain": "2",
    "keys": "💢 Vide: Evtractarh",
    "description": "Génère un effet de déplacement agissant comme l'action tactique de déplacement forcé avec un jet de [Magnitude] sur une cible dans la direction du lanceur du sort."
  },
  {
    "num": 10,
    "vulgar": "Translation",
    "latin": "Fero (Porter)",
    "arcane": "Enlata (En + lata)",
    "word_type": "Pouvoir",
    "target_type": "Cible (point)",
    "difficulty": "2",
    "drain": "2",
    "keys": "✡️ Arcane: Enlatays",
    "description": "Déplace une cible inerte de [Magnitude] mètres, sur une cible non inerte le sort agit comme un déplacement forcé avec la moitié de la magnitude (vs robustesse), les distances de collision sont divisées par deux le cas échéant."
  },
  {
    "num": 11,
    "vulgar": "Émergence",
    "latin": "???",
    "arcane": "???",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🪨 Terre: Elomaterum, 💧 Eau: Elomateryn, 🌪️ Air: ElomaTerrel",
    "description": "Produit un effet qui génère [Magnitude/5] d'unités solide, [Magnitude] d'unités gazeux ou [Magnitude/2] d'unités liquide, une unité vaux 1 case x 1 case, d'un élément vulgaire qui dépends de la [clé]."
  },
  {
    "num": 12,
    "vulgar": "Manipulation",
    "latin": "Manus (Main)",
    "arcane": "Erumanu (Eru + manu)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "✡️ Arcane: Erumanuys",
    "description": "Réalise une action manuelle avec [Magnitude] de Force et Dextérité, l'action peux être une attaque ou n'importe quoi d'autre."
  },
  {
    "num": 13,
    "vulgar": "Simulation",
    "latin": "Simulo (Imiter)",
    "arcane": "Evsimul (Ev + simul)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🎭 Illusion: Evsimulin",
    "description": "Génère un son, une image ou une odeur portant sur [Magnitude] unités de distance, le phénomène est aussi réaliste que possible sur cette distance, au delà si le phénomène est perçus alors le doute est permis sur si il a bien eu lieu mais pas nécessairement sur son origine (le test de sauvegarde affecte donc cette distance de crédibilité), si la cible a de bonnes raisons de douter du phénomène alors un test d'intuition peux être entrepris, le phénomène dure l'équivalant d'un tour."
  },
  {
    "num": 14,
    "vulgar": "Transmigration",
    "latin": "Migro (Migrer)",
    "arcane": "Enmigro (En + migro)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🪷 Nature: Enmigroeiln",
    "description": "Génère un effet qui renvoie dans l'au delà l'âme errante d'un défunt dont les points de psyché sont inférieur à [Magnitude/2], c'est une fin plutôt douce/naturelle qui favorise la réincarnation, tant que l'âme a des griefs en ce monde ses sauvegardes contre cet effet sont avantagés."
  },
  {
    "num": 15,
    "vulgar": "Oblitération",
    "latin": "Obtero (Détruire)",
    "arcane": "Elooblit (Elo + oblit)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "☠️ Mort: Elooblitus",
    "description": "Génère un effet qui détruit l'âme errante d'un défunt dont les points de psyché sont inférieur à [Magnitude/2], c'est une fin atroce qui réduit à néant l'existence, tant que l'âme a des griefs en ce monde ses sauvegardes contre cet effet sont avantagés."
  },
  {
    "num": 16,
    "vulgar": "Déclenchement",
    "latin": "???",
    "arcane": "???",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🛡️ Guerre: Evfulgoorr",
    "description": "Génère un effet provoquant un gain de [Magnitude] points de ressource physique temporaire parmi : Garde, Adrénaline et Rage."
  },
  {
    "num": 17,
    "vulgar": "Exaltation",
    "latin": "Alto (Élever)",
    "arcane": "Enalto (En + alto)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚜️ Charme: Enaltoynh",
    "description": "Génère un effet provoquant un gain de [Magnitude] points de ressource mentale temporaire parmi : Audace, etc."
  },
  {
    "num": 18,
    "vulgar": "Accélération",
    "latin": "Velox (Rapide)",
    "arcane": "Eloveloc (Elo + veloc)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "💢 Vide: Elovelocarh",
    "description": "Génère un effet provoquant un gain de [Magnitude/4] points d'initiative."
  },
  {
    "num": 19,
    "vulgar": "Rétrospection",
    "latin": "Retro (En arrière)",
    "arcane": "Eruretro (Eru + retro)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "📚 Savoir: Eruretroaum",
    "description": "Génère un effet qui octroie au lanceur de sort l'historique de la cible sur [Magnitude²] heures, si la cible est une personne elle peux réaliser un test de sauvegarde pour réduire ou échapper à ces effets."
  },
  {
    "num": 20,
    "vulgar": "Palimpseste",
    "latin": "Limpia (Nettoyer)",
    "arcane": "Enpalim (En + palim)",
    "word_type": "Miracle",
    "target_type": "Cible",
    "difficulty": "8",
    "drain": "8",
    "keys": "💢 Vide: Enpalimarh",
    "description": "Génère un effet qui renvoie tous les participants d'une scène en cours dans le passé, le sort a un potenciel de [Magnitude] a répartie en X et Y. Le temps ainsi remonté a pour maximum X (un round ici est considéré comme durant 10s) et le sort ne fonctionne que si il affecte au mieux Y/3 personnes, pas de sauvegarde possible."
  },
  {
    "num": 21,
    "vulgar": "Réinitialisation",
    "latin": "Initium (Début)",
    "arcane": "Eloinit (Elo + init)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "4",
    "drain": "4",
    "keys": "💢 Vide: Eloinitarh",
    "description": "Génère un effet qui renvoie tous les participants d'une confrontation en cours dans le passé, très exactement au début du tour actuel en confrontation, le sort ne fonctionne que si il affecte au mieux [Magnitude/3] personnes, pas de sauvegarde possible."
  },
  {
    "num": 22,
    "vulgar": "Intrusion",
    "latin": "Trudo (Pousser)",
    "arcane": "Eruitrud (Eru + itrud)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "4",
    "drain": "4",
    "keys": "📚 Savoir: Eruitrudaum",
    "description": "Génère un effet qui octroie au lanceur de sort de consulter la mémoire (informations acquises, pensées, etc...) de la cible sur [Magnitude²] heures."
  },
  {
    "num": 23,
    "vulgar": "Préparation",
    "latin": "Paro (Préparer)",
    "arcane": "Evparo (Ev + paro)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚔️ Acier: Evparoan",
    "description": "Génère un effet qui permet à la cible de s'équiper d'un maximum de [Magnitude/10] pièces d'équipements (arme(s), armure, etc) en un fragment de seconde, les objets en question doivent se situer à moins de [Magnitude] de la cible et le total des charges de ces objets à \"déplacer\" ne peux dépasser [Magnitude x2], ne fonctionne que sur les objets qui sont \"moralement\" ceux de la cible."
  },
  {
    "num": 24,
    "vulgar": "Encapsulation",
    "latin": "Capto (Saisir)",
    "arcane": "Encap (En + cap)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "✡️ Arcane: Encapys",
    "description": "Génère un effet qui permet de stocker ou récupérer dans l'espace interdimentionnel personel (chaque personne en dispose d'un unique) un objet, l'objet est limité à un encombrement de [Magnitude/5], l'objet est catalogué juqu'à ou récupéré depuis l'index de référencement maximum [Magnitude/2], par exemple un objet d'encombrement 3 peux occuper l'espace de 16 à 18, il faudra alors une magnitude de 36 pour le récupérer ensuite, si l'objet a stocké est lié à un individu (équipé, porté, etc) alors ce dernier peux réaliser un test d'opposition et une réussite annule l'effet (test normal si l'objet est ni équipé, ni porté; test avantage si porté; test doublement avantagé si équipé)."
  },
  {
    "num": 25,
    "vulgar": "Détection",
    "latin": "Tego (Couvrir)",
    "arcane": "Eloteges (Elo + teges)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "👁️ Vision: Elotegeseth",
    "description": "Génère un effet qui révèle la localisation de tous les espaces interdimentionnels sur un rayon de [Magnitude] de distance (ceci reviens à réussir un test de focus avec une distance drastiquement supérieure)."
  },
  {
    "num": 26,
    "vulgar": "Visualisation",
    "latin": "Video (Voir)",
    "arcane": "Eruvidi (Eru + vidi)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "📚 Savoir: Eruvidi aum",
    "description": "Génère un effet qui permet de voir ce que contient un espace interdimentionnel dont la distance ne dépasse pas [Magnitude]."
  },
  {
    "num": 27,
    "vulgar": "Imposition",
    "latin": "Pono (Placer)",
    "arcane": "Evponi (Ev + poni)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "TODO : Liste des domaines avec conditions",
    "description": "Génère un effet agissant comme l'action tactique provoquant une condition nécessairement négative (dont la nature est associable à la [clé]) avec un jet de [Magnitude x1.5], la cible peux donc se défendre de l'action et aussi réaliser un test de sauvegarde adapté à la condition (ou opposition si supérieure)."
  },
  {
    "num": 28,
    "vulgar": "Majoration",
    "latin": "Maior (Plus grand)",
    "arcane": "Enmaior (En + maior)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚕️ Corps: Enmaioren, 🧠 Esprit: Enmaiorys",
    "description": "Génère un effet qui augmente de [Magnitude] les charges d'une condition (physique ou mentale selon la [clé]) affectant la cible."
  },
  {
    "num": 29,
    "vulgar": "Epidémie",
    "latin": "Demus (Peuple)",
    "arcane": "Elodemus (Elo + demus)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "☢️ Toxique: Elodemusex",
    "description": "Génère un effet qui transmet les conditions de la cible aux créatures à son contact, si le sort comporte une zone d'effet alors la transmision se fait dans cette zone, la transmission est limité à une charge de [Magnitude], les victimes peuvent réaliser un test de sauvegarde adéquat mais ce dernier est désavantagé."
  },
  {
    "num": 30,
    "vulgar": "Réinjection",
    "latin": "Iacio (Jeter)",
    "arcane": "Eruiacio (Eru + iacio)",
    "word_type": "Pouvoir",
    "target_type": "Lieu/Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🔮 Magie: Eruiacioirn",
    "description": "Génère un effet qui recharge de [Magnitude/2] tous les enchantements affectant la cible (lieu ou cible)."
  },
  {
    "num": 31,
    "vulgar": "Rechargement",
    "latin": "Carga (Charge)",
    "arcane": "Evcar (Ev + car)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🔮 Magie: Evcarirn",
    "description": "Génère un effet qui recharge de [Magnitude] un enchantement ciblé."
  },
  {
    "num": 32,
    "vulgar": "Manifestation",
    "latin": "Manes (Esprits, apparences)",
    "arcane": "Enmani (En + mani)",
    "word_type": "Pouvoir",
    "target_type": "Soi",
    "difficulty": "2",
    "drain": "2",
    "keys": "🛡️ Guerre: Enmaniorr (Combat, Défense, Tactique, Archerie, Corps à corps), ⚕️ Corps: Enmanien (Athlétisme, Gymnastique, Discipline), 👁️ Vision: Enmanieth (Acuité), ✡️ Arcane: Enmaniys (Arcanes), 🔮 Magie: Enmaniirn (Chasse, Survie Rurale, Survie urbaine, Discrétion, Larçin, Sagacité, Subterfuge), ⚜️ Charme: Enmaniynh (Argumentation, Résolution, Manipulation, Art, Eloquence), 🧠 Esprit: Enmaniys (Artisanat, Profession, Savoir être, Savoir faire), 📚 Savoir: Enmaniaum (Langue, Enquête, Erudition, Stratégie, Guérison, Commerce)",
    "description": "Génère un effet qui permet au lanceur de sort une action caractérisée par une compétence (dont la nature est associable à la [clé]) en réalisant le test avec, au choix : Un total de Compétence/Groupe de [Magnitude/3] ou le total de Compétence/Groupe du lanceur de sort plus un bonus de [Magnitude/5], le tout plus le modificateur de magie du lanceur de sort (ici aucun bonus, sauf magique, ne peuvent intervenir, encore moins les bonus de qualité issus d'objets ou autre). Dans le cas d'une action avec progression le lanceur du sort peux reproduire un test avec les avantages de ce sort en dépensant 2 PS à chaque fois. L'action peux profiter de manoeuvres normalement."
  },
  {
    "num": 33,
    "vulgar": "Matérialisation",
    "latin": "Corp (Corps)",
    "arcane": "Elocorpus (Elo + corpus)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🪨 Terre: Elocorpusum, 💧 Eau: Elocorpusyn, 🌪️ Air: Elocorpusel",
    "description": "Produit un effet qui créé de la matière (gaz, liquide ou solide) de [Magnitude/2] unités d'un élément qui dépends de la [clé]."
  },
  {
    "num": 34,
    "vulgar": "Téléportation",
    "latin": "Porto (Porter)",
    "arcane": "Eruport (Eru + port)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "✡️ Arcane: Eruportys",
    "description": "Génère un effet qui téléporte (sans collisions donc) la cible d'un point A à B distant d'au mieux [Magnitude/3] de distance, la cible peux réaliser un test de détermination afin de réduire les effets du sort, le lanceur de sort doit pouvoir être mesure de voir le point d'arrivé et être la cible ou de voir la cible."
  },
  {
    "num": 35,
    "vulgar": "Intromission",
    "latin": "Mitto (Envoyer)",
    "arcane": "Evmiss (Ev + miss)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🪨 Terre: Evmissum (Minéral), ✡️ Arcane: Evmissys",
    "description": "Génère un effet qui permet à la cible d'être téléporter d'un coté à l'autre d'un mur ou d'un obstacle, le sort ne fonctionne que si la distance entre les deux points est inférieur à [Magnitude]² centimères, le domaine des arcanes peux se déplacer à travers n'importe quelle matière mais la magnitude est divisé par 2."
  },
  {
    "num": 36,
    "vulgar": "Séquençation",
    "latin": "Sequor (Suivre)",
    "arcane": "Ensequor (En + sequor)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚜️ Charme: Ensequorynh",
    "description": "énère un effet qui permet au lanceur de sort de d'entreprendre jusqu'à [Magnitude/3] actions purement manipulatrices (groupe manipulation) sur-le-champs, le personnage est de plus avantagé sur ces tests."
  },
  {
    "num": 37,
    "vulgar": "Connexion",
    "latin": "Necto (Lier)",
    "arcane": "Elonect (Elo + nect)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🧩 Mental: Elonectend",
    "description": "Génère un effet qui permet au lanceur de sort de s'entretenir avec une cible par télépathie, pour un maximum de [Magnitude] mots minus la distance entre les deux protagonistes."
  },
  {
    "num": 38,
    "vulgar": "Amplication",
    "latin": "Amplus (Vaste)",
    "arcane": "Evamplus (Ev + amplus)",
    "word_type": "Pouvoir",
    "target_type": "Cible (enchantement)",
    "difficulty": "2",
    "drain": "2",
    "keys": "🔮 Magie: Evamplusirn",
    "description": "Génère un enchantement qui cible un enchantement existant afin d’en augmenter la magnitude d'origine de [Magnitude/2], ce qui peux au mieux doubler la magnitude d'origine. La chute des charges de l’enchantement est doublée et maintenir le sort requière 2x plus de focus."
  },
  {
    "num": 39,
    "vulgar": "Diminution",
    "latin": "Minus (Moins)",
    "arcane": "Enminus (En + minus)",
    "word_type": "Pouvoir",
    "target_type": "Cible (enchantement)",
    "difficulty": "2",
    "drain": "2",
    "keys": "🔮 Magie: Enminusirn",
    "description": "Génère un enchantement qui cible un enchantement existant afin d’en réduire la magnitude d'origine de [Magnitude/2]."
  },
  {
    "num": 40,
    "vulgar": "Activation",
    "latin": "Actus (Action)",
    "arcane": "Eloactus (Elo + actus)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "✡️ Arcane: Eloactusys",
    "description": "Le sort provoque l’activation d’un objet ou d’un mécanisme au fonctionnement sommaire (ou en tout cas non technologique). Dans le cas où un test est nécessaire à cette activation le personnage peut réaliser celui-ci comme si le sort émulé la compétence associée: Il peux alors le faire avec ses propres compétences ou [Magnitude/5], dans tous les cas avec son propre modificateur de magie pour tout attribut."
  },
  {
    "num": 41,
    "vulgar": "Projection",
    "latin": "???",
    "arcane": "???",
    "word_type": "Pouvoir",
    "target_type": "Soi",
    "difficulty": "2",
    "drain": "2",
    "keys": "🌑 Ombre: Erulocusoth",
    "description": "Génère un effet qui déplace le lanceur de sort à une distance maximale équivalante à [Magnitude], la moitié durant une confrontation, la destination doit partager la même zone d'ombre que le point de départ, le déplacement étant instantané ce dernier ne provoque pas d'opportunité etc."
  },
  {
    "num": 42,
    "vulgar": "Nécrotisation",
    "latin": "Necros (Mort)",
    "arcane": "Evnecro (Ev + necro)",
    "word_type": "Pouvoir",
    "target_type": "Soi",
    "difficulty": "2",
    "drain": "2",
    "keys": "☠️ Mort: Evnecrous",
    "description": "Génère un enchantement qui a pour charge maximum le total des PV et PS perdus, maximum [Magnitude], la cible peux réduire les charges de cet enchantement de 4 pour réduire le cout en drain d'un sort de 1 OU le minimum de drain d'un sort de 1."
  },
  {
    "num": 43,
    "vulgar": "Exanimisation",
    "latin": "Anima (Souffle, vie)",
    "arcane": "Enanima (En + anima)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "☠️ Mort: Enanimaus",
    "description": "Génère un enchantement qui fait passer la cible pour morte, si un individu se pose la question alors un test d'intuition (contre expertise magique) réussie peux permettre de relever une étrangeté, qui pourra/devra être corroboré/confirmé par un test approprié (contre difficulté arcanique)."
  },
  {
    "num": 44,
    "vulgar": "Fulguration",
    "latin": "Fulgeo (Briller)",
    "arcane": "Elofulg (Elo + fulg)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚡ Foudre: Elofulgor",
    "description": "Génère un effet qui déplace le lanceur de sort à une distance maximale équivalante à [Magnitude/2], la moitié durant une confrontation, le déplacement étant instantané ce dernier ne provoque pas d'opportunité etc."
  },
  {
    "num": 45,
    "vulgar": "Vibration",
    "latin": "Vibro (Agiter)",
    "arcane": "Eruvibr (Eru + vibr)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🪨 Terre: Eruvibrum",
    "description": "Génère un effet qui agit comme l'action tactique de renversement avec un jet de [Magnitude], la cible doit être touchée (défense passive FOR ou AGI dépassée) et peux s'en défendre normalement (comme s'il s'agissait d'une tactique)."
  },
  {
    "num": 46,
    "vulgar": "Dépossession",
    "latin": "Possessio (Possession)",
    "arcane": "Evposs (Ev + poss)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🌪️ Air: Evpossel",
    "description": "Génère un effet qui agit comme l'action tactique de désarmement avec un jet de [Magnitude], la cible doit être touchée (défense passive DEX dépassée) et peux s'en défendre normalement (comme s'il s'agissait d'une tactique)."
  },
  {
    "num": 47,
    "vulgar": "Transmission",
    "latin": "Mitto (Envoyer)",
    "arcane": "Enmitt (En + mitt)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🌪️ Air: Enmittel",
    "description": "Génère un effet qui permet de véhiculer un message jusqu'à une cible distante d'au mieux [Magnitude²] de distance, la distance est divisée par le nombre de mots (pas les liaisons) inclus dans le message."
  },
  {
    "num": 48,
    "vulgar": "Transvasation",
    "latin": "Vaso (Vase)",
    "arcane": "Elovaso (Elo + vaso)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "✡️ Arcane: Elovaseoys",
    "description": "Génère un effet qui déplace jusqu'à [Magnitude] charges d'un enchantement vers un autre."
  },
  {
    "num": 49,
    "vulgar": "Apportation",
    "latin": "Porto (Porter)",
    "arcane": "Eruporta (Eru + porta)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "✡️ Arcane: Eruportays",
    "description": "Génère un effet qui projète l'objet inerte (inanimé et non équipé) ciblé sur une autre cible distante d'au mieux [Magnitude/3], ceci constitue une attaque (vs perception), la catégorie de l'objet ainsi utilisée est limitée à [Magnitude/7] et cela définit les dégats subits comme les pénalités pour toucher la cible, ces dégats sont augmentés d'autant que la distance parcourues pour toucher la cible, si l'objet ne touche pas de cible (ou si l'objet est envoyé sur un élément du décors) alors jusqu'à [Magnitude/10] tests de solidité peuvent avoir lieu avec une pénalité équivalante à la moitié de la distance parcourues, si le lanceur de sort le souhaite l'objet peux être transporté sans entrainer d'attaque puis déposé délicatement."
  },
  {
    "num": 50,
    "vulgar": "Harmonisation",
    "latin": "Harmonia (Harmonie)",
    "arcane": "Evharm (Ev + harm)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚖️ Loi: Evharmem",
    "description": "Génère un effet qui rééquilibre les PV, PS et PE entre deux cibles (à portés du sort), les deux cibles aurons donc la moitié de la somme de ces ressources, attention car une même ressource ne peux faire l'objet d'un transfert supérieur à [Magnitude/4] points."
  },
  {
    "num": 51,
    "vulgar": "Prédétermination",
    "latin": "Terminus (Fin)",
    "arcane": "Entermin (En + termin)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚖️ Loi: Enterminem",
    "description": "Génère un effet permet à la cible de \"stocker\" un test (valeur des 3 dés) parmis une série de [Magnitude/10] tests différents (réalisés au moment où le sort est lancé), la cible peux ensuite utiliser ce test stocké à la place de n'importe quel autre test qu'il doit effectuer et ce avant que le dit test ne soit lancé, cet effet n'est pas un enchantement et cesse à la fin de la scène, le test stocké ne peux pas être modifié via le karma mais il peux ensuite l'être lorsqu'il est utilisé."
  },
  {
    "num": 52,
    "vulgar": "Conditionnement",
    "latin": "Condicio (Condition)",
    "arcane": "Elocondi (Elo + condi)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚖️ Loi: Elocondiem",
    "description": "Génère un enchantement qui contient les effets d'un autre [Mot de pouvoir] d'alignement positif ou négatif, ce mot de pouvoir sera relâché avec la même [Magnitude] mais sous conditions stipulées dans un contrat, ce contrat peux prendre la forme d'une action à réaliser mais doit être suffisament précis (généralement une action envers une cible tel que : si tu attaque cette personne, si tu défends contre cette personne)."
  },
  {
    "num": 53,
    "vulgar": "Polarisation",
    "latin": "Polus (Pôle)",
    "arcane": "Erupolus (Eru + polus)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🌀 Chaos: Erupoluix",
    "description": "Génère un effet qui creuse l'écart entre les PV, PS et PE de deux cibles (à portés du sort), la cible ayant le moins en perd et celle qui en a le plus en gagne, attention car une même ressource ne peux faire l'objet d'un gain ou perte supérieur à [Magnitude/4] points."
  },
  {
    "num": 54,
    "vulgar": "Préemption",
    "latin": "Emo (Acheter, prendre)",
    "arcane": "Evemo (Ev + emo)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🌀 Chaos: Evemoix",
    "description": "Génère un effet forçant la cible à \"stocker\" un test (valeur des 3 dés) parmis une série de [Magnitude/10] tests différents (réalisés au moment où le sort est lancé), la cible doit ensuite utiliser ce test stocké à la place de n'importe quel autre test que le lanceur de sort souhaite voir remplacé, le choix se faisant avant qu'un tel test soit effectué, cet effet n'est pas un enchantement et cesse à la fin de la scène, le test stocké ne peux pas être modifié via le karma mais il peux ensuite l'être lorsqu'il est utilisé."
  },
  {
    "num": 55,
    "vulgar": "Aléatorisation",
    "latin": "Aleo (Jeu de dés)",
    "arcane": "Enalea (En + alea)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🌀 Chaos: Enaleaix",
    "description": "Génère un enchantement qui contient les effets d'un autre [Mot de pouvoir] d'alignement positif ou négatif, ce mot de pouvoir sera relâché avec la même [Magnitude x1.5] mais aléatoirement à tout instant où le sort serait utile (du point de vu du lanceur de sort), à chaque occurence 1D6 est lancé est l'effet est activé si le dé affiche 1, dans le cas où le sort n'est pas relâché ce seuil est augmenté de 1, maximum 3."
  },
  {
    "num": 56,
    "vulgar": "Captivation",
    "latin": "Capto (Saisir)",
    "arcane": "Elocaptus (Elo + captus)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🐗 Faune: Elocaptusorh",
    "description": "Génère un effet qui charme une bête, le sort remplace un test de prestige qui prend automatiquement comme valeurs 5 + [Magnitude/4] + modificateur de magie, si la bête est de nature agressive la difficulté peux être ajustée comme le prévoit les règles de prestige (généralement +5), si la cible est un monstre le sort peux fonctionner mais la difficulté est une fois de plus réhaussée, le résultat est similaire à ceux d'un test de prestige effectuée dans le cadre d'une rencontre avec un individu (voir les règles), ce sort écrase un résultat précédent (naturel ou magique), la cible peux effectuer un test de sang froid qui lui permet de résister à cet effet (dans les proportions prévues par la règle des sauvegardes)."
  },
  {
    "num": 57,
    "vulgar": "Fascination",
    "latin": "Fascinum (Charme)",
    "arcane": "Erufasci (Eru + fasci)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "4",
    "drain": "4",
    "keys": "⚜️ Charme: Erufasciynh",
    "description": "Génère un effet qui charme une personne, le sort remplace un test de prestige qui prend automatiquement comme valeurs 5 + [Magnitude/4] + modificateur de magie, si la personne a des raisons de ne pas apprécier le personnage la difficulté peux être ajustée comme le prévoit les règles de prestige (généralement +5), chaque bonnes raisons d'inimitié peuvent accroitre la difficulté, le résultat est similaire à ceux d'un test de prestige effectuée dans le cadre d'une rencontre avec un individu (voir les règles), ce sort écrase un résultat précédent (naturel ou magique), la cible peux effectuer un test de sang froid qui lui permet de résister à cet effet (dans les proportions prévues par la règle des sauvegardes)."
  },
  {
    "num": 58,
    "vulgar": "Falsification",
    "latin": "Fallo (Tromper)",
    "arcane": "Evfall (Ev + fall)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "6",
    "drain": "6",
    "keys": "🧩 Mental: Evfallend",
    "description": "Génère des faux souvenirs chez la cible, à raison de [Magnitude²] secondes, affecté par la sauvegarde de détermination, un test d'intuition peux permettre de savoir si ces idées sont légitimes ou suspicieuses (et donc en douter)."
  },
  {
    "num": 59,
    "vulgar": "Communication",
    "latin": "Communis (Commun)",
    "arcane": "Encommu (En + commu)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "4",
    "keys": "🧩 Mental: Encommuend",
    "description": "Génère une connexion entre deux cibles qui doivent être à portée, la discussion est alors limitée à [(Magnitude - 5)/2] mots (en tout)."
  },
  {
    "num": 60,
    "vulgar": "Onirisation",
    "latin": "Onir (Rêve, grec)",
    "arcane": "Eloonir (Elo + onir)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🧩 Mental: Eloonirend",
    "description": "Permet à une cible d'entrer dans les rêves d'une autre cible, toutes à portée du lanceur de sort, la [Magnitude/2] fixe le maximum des attributs de la cible dans le rêve, si l'entrant n'a pas le souhait actif d'entrer dans ce rêve il peux effectuer un test de détermination et il ignore totalement cet effet en cas de réussite, la cible entrante est considérée comme endormis et peux être réveillée de façon conventionnel, notons que l'interprétation des enjeux sont à la discrétion du MJ (qui peux par example rendre le réveil bien plus difficile si l'entrant est dans un lieu du rêve très sensible, etc). Les limitations (somme toute légères) de ce sort ne doivent pas permettre des usages qui briserait la logique, le MJ peux donc ajuster selon les besoins et la situation. Ce sort à vocation de permettre à des personnes d'entrer dans le rêve d'autrui pour les aider ou les fragiliser via des interactions etc... guère rien de plus (sauf si le MJ le décide)."
  },
  {
    "num": 61,
    "vulgar": "Retranscription",
    "latin": "Scribo (Écrire)",
    "arcane": "Erutran (Eru + tran)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🧩 Mental: Erutranend",
    "description": "Génère un message envoyé à une cible à portée, le message est limité à [Magnitude/2] mots."
  },
  {
    "num": 62,
    "vulgar": "Induction",
    "latin": "Duco (Mener)",
    "arcane": "Evduco (Ev + duco)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚜️ Charme: Evducoynh",
    "description": "Génère une émotion (bien réelle, voir la liste dans les règles) sur la cible, si l'émotion est négatif la cible peux effectuer un test de sang froid, l'intensité de l'émotion peux être chiffrée [Magnitude/3] si le MJ estime que c'est nécessaire, ce peux être un bonus à une sauvegarde ou à une compétence visant à se calmer, à provoquer, etc... l'interprétation est ici de mise. Si la cible avait déjà tenté une sauvegarde alors le test est augmenté d'autant (il n'est pas relancé)."
  },
  {
    "num": 63,
    "vulgar": "Suggestion",
    "latin": "Gero (Porter)",
    "arcane": "Ensubger (En + subger)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚜️ Charme: Ensubgerynh",
    "description": "Génère une suggestion qui implente un objectif ou désir nouveau chez la cible, à raison de [Magnitude/4] mots pour formuler la suggestion, affecté par la sauvegarde de détermination, un test d'intuition peux permettre de savoir si ces idées sont légitimes ou suspicieuses (et donc en douter)."
  },
  {
    "num": 64,
    "vulgar": "Coordination",
    "latin": "Ordo (Ordre)",
    "arcane": "Eloordo (Elo + ordo)",
    "word_type": "Interruption",
    "target_type": "Soi",
    "difficulty": "4",
    "drain": "4",
    "keys": "💢 Vide: Eloordoarh",
    "description": "Le lanceur du sort deviens le centre d'une discussion télépathique qui se déroule en une fraction de seconde comprenant jusqu'à [Magnitude/7] autres participants à portée du sort, ces participants doivent être des alliés du lanceur de sort et accepter la communication, la discussion est limitée à [Magnitude] mots, les personnages ne peuvent que transmettre des informations et ne peux réaliser d'actions etc..."
  },
  {
    "num": 65,
    "vulgar": "Cognition",
    "latin": "Cogito (Penser)",
    "arcane": "Erucogit (Eru + cogit)",
    "word_type": "Pouvoir",
    "target_type": "Soi",
    "difficulty": "6",
    "drain": "2",
    "keys": "📚 Savoir: Erucogitaum",
    "description": "Génère un effet qui déclanche chez le lanceur de sort un test de connaissance lié à la nature d'une cible, jusqu'à la fin de la scène il reçoit du mana ET du karma temporaire visant à lancer un sort sur cette cible, le montant de ces ressources temporaires est calculé à partir d'un jet de catégorie 0 + DR du test de connaissance + [Magnitude/3] à la place d'un modificateur d'attributs."
  },
  {
    "num": 66,
    "vulgar": "Haloportation",
    "latin": "Halos (Sel, grec)",
    "arcane": "Evhalos (Ev + halos)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "☀️ Lumière: Evhalosion",
    "description": "Génère un effet qui déplace le lanceur de sort à une distance maximale équivalante à [Magnitude], la moitié durant une confrontation, la destination doit partager la même zone de lumière que le point de départ, le déplacement étant instantané ce dernier ne provoque pas d'opportunité etc."
  },
  {
    "num": 67,
    "vulgar": "Epilepsie",
    "latin": "Lepsia (Crise, grec)",
    "arcane": "Enlepsia (En + lepsia)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "☀️ Lumière: Enlepsiaion",
    "description": "Ce sort génère une lésion (considéré à la fois comme une blessure et une lésion, elle n'a pas besoin d'être stabilisée) qui dure au choix jusqu'à la prochaine action / jusqu'au round prochain / jusqu'au tour prochain / jusqu'à la scène prochaine (vis à vis du lanceur de sort), la gravitant étant alors de [Magnitude/4] / [Magnitude/6] / [Magnitude/10] / [Magnitude/15], la cible peux résister à cet effet via la robustesse ou la détermination, la lésion peux tuer la cible si elle rate un test de l'autre sauvegarde en prime."
  },
  {
    "num": 68,
    "vulgar": "Télétransmission",
    "latin": "Mitto (Envoyer)",
    "arcane": "Elotrams (Elo + trams)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "6",
    "drain": "2",
    "keys": "📚 Savoir: Elotramsaum",
    "description": "Génère un message envoyé à une cible peu importe sa localisation, la distance est limitée à [Magnitude²] km, le message est limité à [Magnitude/5] mots mais seule la magnitude qui n'est pas utilisée pour la distance est comptabilisée (le message peux être tronqué si trop long), le lanceur de sort ne sait pas si le message a été reçu ni la position de la cible, il doit connaitre la cible (apparence, nom/prénom, etc) pour pouvoir envoyer ce message, la cible peux reconnaitre la voix du lanceur de sort via un test approprié (à la discrétion du MJ, intuition ou mémoire, probablement difficulté 15)."
  },
  {
    "num": 69,
    "vulgar": "Sédation",
    "latin": "Sedeo (Être assis)",
    "arcane": "Erusedeo (Eru + sedeo)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "4",
    "keys": "⚜️ Charme: Erusedeoynh",
    "description": "Le sort permet à la cible de s'endormir quelque soit son état d'agitement, mais uniquement si elle le souhaite, elle profite alors d'un bonus aux ressources récupérés lors de ce repos là de [Magnitude/3], ce montant n'est pas un bonus à la récupération directement mais un total à répartis équitablement entre les ressources en ayant besoin."
  },
  {
    "num": 70,
    "vulgar": "Climatisation",
    "latin": "Clima (Climat)",
    "arcane": "Evclima (Ev + clima)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "6",
    "drain": "6",
    "keys": "🔥 Feu: Evclimaar (chaleur), ❄️ Glace: Evclimais (froid), ⚡ Foudre: Evclimaor (orageux), 💧 Eau: Evclimayn (pluvieux), 🌪️ Air: Evclimael (venteux), ☀️ Lumière: Evclimaion (ensoleillé), 🌑 Ombre: Evclimaoth (nuageux)",
    "description": "Génère un effet qui modifie le climat environnant sur [Magnitude²] km de distance, le nouveau climat dépends de la [clé], ce dernier dure jusqu'à ce qu'un changement naturel ai lieu (minimum 1h), l'intensité de l'intempérie peux être chiffrée [Magnitude/7] si le MJ estime que c'est nécessaire, ce peux être un bonus à une sauvegarde ou à une compétence SI le changement de temps aide ou n'aide pas, c'est au MJ de juger."
  },
  {
    "num": 71,
    "vulgar": "Effraction",
    "latin": "Frango (Briser)",
    "arcane": "Enfract (En + fract)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "✡️ Arcane: Enfractys",
    "description": "Génère un effet qui fait progresser le crochetage d'une serrure ciblée de [Magnitude], ce sort doit dépasser une défense passive qui est la difficulté du crochetage lui même (sans quoi il n'a pas d'effet)."
  },
  {
    "num": 72,
    "vulgar": "Occlusion",
    "latin": "Claudo (Fermer)",
    "arcane": "Eloclaud (Elo + claud)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "✡️ Arcane: Eloclaudys",
    "description": "Génère un effet qui fait ferme une serrure ciblée, la progression étant fixée à [Magnitude] (peux dépasser le maximum, ne s'accumule pas à une autre instance de cet effet mais garde le plus élevé), ce sort doit dépasser une défense passive qui est la difficulté du crochetage lui même (sans quoi il n'a pas d'effet)."
  },
  {
    "num": 73,
    "vulgar": "Transposition",
    "latin": "Pono (Placer)",
    "arcane": "Erupono (Eru + pono)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "✡️ Arcane: Eruponoys",
    "description": "Génère un effet qui téléporte (sans collisions donc) et intervertis la position de deux cibles distantes d'au mieux [Magnitude/3] de distance, les cibles peuvent réaliser un test de détermination afin de réduire les effets du sort, le lanceur de sort doit pouvoir être mesure de voir les cible et il peux faire partis de l'unes d'elles."
  },
  {
    "num": 74,
    "vulgar": "Subordination",
    "latin": "Ordo (Ordre)",
    "arcane": "Evsubor (Ev + subor)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚜️ Charme: Evsuborynh",
    "description": "Génère un effet qui force la cible à réaliser une action sur-le-champs, cela ne lui cout pas d'actions ou d'initiative, il choisit la cible de l'action le cas échéant et les modalités si c'est pertinent (attaque la cible à ta droite, par exemple), la cible peux réaliser un test de détermination pour réduire la puissance du sort, la magnitude du sort permet de déterminer le type d'action qui peux être ainsi réalisées : Action Simple 15, Complexe 30, Libre 10, Rapide 15. Si la cible est un allié et qu'elle accepte l'action, elle reçoit un bonus de [Magnitude/4] d'ajustement. Le sort peux être lancé en interruption mais avec une difficulté augmenté de 2, par example dans le cas où le mage souhaite qu'un autre le défende d'une action, etc..."
  },
  {
    "num": 75,
    "vulgar": "Nutrition",
    "latin": "Nutrio (Nourrir)",
    "arcane": "Ennutri (En + nutri)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🪷 Nature: Ennutrieiln",
    "description": "Génère un effet qui comble les besoins en nourriture d'une cible, afin que le repos par example soit plus efficace donc, la condition de repos (qui est naturellement de -2 au plus bas et +1 au mieux) est augmentée de [Magnitude/4] avec pour maximum +1. L'excédant forme un total de ressource à récupérer utilisable comme bon le semblera à la cible."
  },
  {
    "num": 76,
    "vulgar": "Marque",
    "latin": "Nota (Marque)",
    "arcane": "Elonota (Elo + nota)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🔮 Magie: Elonotairn",
    "description": "Génère un effet qui inscrit dans la mémoire du lanceur de sort un lieu, un objet ou une cible, la place prise dans la mémoire occupe un espace similaire aux techniques ou aux sorts par exemple, le lanceur de sort peux plus tard lancer des sorts sur la cible en question comme si il s'agissait d'une cible valide, sur une distance maximale de [Magnitude] pour une personne, [Magnitude x5] pour un objet ou [Magnitude x50] pour un lieu (le sort échoue si la cible est trop loin)."
  },
  {
    "num": 77,
    "vulgar": "Révélation",
    "latin": "Velum (Voile)",
    "arcane": "Eruvelo (Eru + velo)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "☀️ Lumière: Eruveloion",
    "description": "Le sort permet au lanceur de sort de « révéler » à son regard un ou des éléments qui sont dissimulés, perdus, cachés, escamotés… par magie ou non. Le lanceur de sort choisit donc si il cherche un objet spécifique ou plusieurs non spécifiques. Le personnage est alors en conscient de la position du ou des éléments qui peuvent coRespondre. La perception est limité à une distance de [Magnitude] mètres autour du lanceur de sort et si l'objet est dissimulés alors il peux l'apercevoir si la difficulté de cette dissimulation est dépassée par [5+Magnitude/2] ou [5+Magnitude/3], selon que le sort a été lancé pour voir un ou plusieurs éléments."
  },
  {
    "num": 78,
    "vulgar": "Amplification",
    "latin": "Augeo (Augmenter)",
    "arcane": "Evauge (Ev + auge)",
    "word_type": "Interruption",
    "target_type": "Cible",
    "difficulty": "4",
    "drain": "2",
    "keys": "🔮 Magie: Evaugeirn",
    "description": "Génère un effet qui augmente la puissance du sort lancé par la cible de [Magnitude/3], la cible ne peux pas être le lanceur de CE sort (surtout qu'il est de toute façon occupé à lancer CE sort)."
  },
  {
    "num": 79,
    "vulgar": "Retemporisation",
    "latin": "Tempus (Temps)",
    "arcane": "Entempus (En + tempus)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "💢 Vide: Entempusarh",
    "description": "Génère un effet qui force toutes les cibles (qui doivent être à portée) au choix du lanceur de sort de relancer un test d'initiative avec un bonus de [Magnitude/5] si allié et un malus de [Magnitude/5] dans le cas inverse, les alliés peuvent garder le nouveau résultat ou conserver l'ancien, les autres gardent le résultat qui convient le mieux au lanceur de sort, notons que ce sort ne peux affecter qu'un maximum de [Magnitude/7] cibles (lanceur de sort inclus le cas échéant), notons que le nouveau résultat conserve toutes les décotes que l'initiative d'origine à subit, de sorte que SEUL la partie concernant le test change."
  },
  {
    "num": 80,
    "vulgar": "Catharsis",
    "latin": "Canalis (Conduit)",
    "arcane": "Lircana (Elo + cana)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🔮 Magie: Evcanairn",
    "description": "Génère un effet qui permet à la cible de réaliser sur-le-champs un total de [Magnitude/7] action d'arcanes ou relatifs à la magie, elle peux ne pas en réaliser certaines."
  },
  {
    "num": 81,
    "vulgar": "Fictification",
    "latin": "Fictum (Fictif)",
    "arcane": "Asfict (As + fict)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🧩 Mental",
    "description": "Génère un effet qui génère dans la mémoire de la cible un souvenir fictif, la cible peux avoir une attitude de méfiance à l'égard de ce souvenir ou en être convaincu selon le résultat d'un test de sauvegarde au moment du sort (échec critique : il le pense réel, échec : il a un doute et ira jusqu'à éprouver sa véracité si besoin, réussite : il pensera l'avoir rêvé, réussite critique : il pensera avoir été influencé), puis il s'il effectue un test de mémoire la difficulté [5+Magnitude/2] (en cas de réussite il se souviens de ce qui s'est vraiment passé)."
  },
  {
    "num": 82,
    "vulgar": "Surpuissance",
    "latin": "Potentia (Puissance)",
    "arcane": "Aspoten (As + poten)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🔮 Magie",
    "description": "Génère un effet qui augmente drastiquement la puissance du prochain sort lancé par la cible de [Magnitude/4], ceci est considéré comme enchantement éphémère qui est défaussé dés lors qu'il fait effet."
  },
  {
    "num": 83,
    "vulgar": "Imprimation",
    "latin": "Imprimo (Imprimer / Graver)",
    "arcane": "Aimprim (Ai + imprim)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🔮 Magie: Elonotairn",
    "description": "Génère un effet qui inscrit dans la mémoire de la cible un sort connu du lanceur de sort, notons que la cible doit pouvoir conserver ce sort dans un emplacement libre de sa mémoire (ou il doit oublier un élément de sa liste actuelle), la cible peux plus tard lancer le sorts comme si il connait le sort lui même avec les compétences (magiques) qu'il souhaite, le niveau du sort auquel ce dernier pourra prétendre est (en plus de limites liées à ses compétences) limités à [Magnitude/10], le personnage perd l'usufruit de ce sort après à [1 + Magnitude/15] repos long et/ou usages (les deux provoquent le décompte), le lanceur de sort peux décider de réduire la magnitude de 5 afin de que cet effet n'ai pas besoin d'emplacement de mémoire."
  },
  {
    "num": 84,
    "vulgar": "Scarification",
    "latin": "Scarifico",
    "arcane": "Asscarif",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🩸 Impie",
    "description": "Génère un effet octroyant [Magnitude] points de mana temporaire à la cible qui doit en contre partie perdre [Magnitude/4] PV, la cible peux refuser cette perte et le sort n'a alors aucun effet, de plus la cible peux décider de ne perdre que X PV de la sorte limitants les effets du sort à 4X."
  },
  {
    "num": 85,
    "vulgar": "Libération",
    "latin": "Libero (Libérer)",
    "arcane": "Aliber (Al + liber)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🌀 Chaos",
    "description": "Génère un effet qui déclanche chez la cible un test visant à recouvrir la liberté (en fonction de comment cette notion de liberté est menacée) avec un bonus de [Magnitude/3], ce sort peux être lancé en interruption lorsqu'un allié subit une perte/privation de liberté."
  }
];

  const tbody   = document.getElementById('mpv-tbody');
  const search  = document.getElementById('mpv-search');
  const selType = document.getElementById('mpv-type');
  const selTgt  = document.getElementById('mpv-target');
  const counter = document.getElementById('mpv-count');

  let sortCol = null;
  let sortAsc = true;

  function fmtDesc(text) {
    if (!text) return '';
    return text.replace(/\[([^\]]+)\]/g, '<span class="mpv-bracket">[$1]</span>');
  }

  function render(list) {
    tbody.innerHTML = '';
    list.forEach(w => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="text-align:center">${w.num}</td>
        <td><strong>${w.vulgar}</strong></td>
        <td><em style="font-size:0.88em">${w.latin}</em><br/><small style="color:#888">${w.arcane}</small></td>
        <td>${w.word_type}</td>
        <td>${w.target_type}</td>
        <td style="text-align:center">${w.difficulty}</td>
        <td style="text-align:center">${w.drain}</td>
        <td style="font-size:0.82em">${w.keys}</td>
        <td>${fmtDesc(w.description)}</td>
      `;
      tbody.appendChild(tr);
    });
    counter.textContent = list.length + ' mot' + (list.length !== 1 ? 's' : '');
  }

  function filter() {
    const q = search.value.toLowerCase();
    const t = selType.value;
    const tgt = selTgt.value;

    let list = DATA.filter(w => {
      if (t && w.word_type !== t) return false;
      if (tgt && w.target_type !== tgt) return false;
      if (q && ![w.vulgar, w.latin, w.arcane, w.description, w.keys]
               .some(s => (s || '').toLowerCase().includes(q))) return false;
      return true;
    });

    if (sortCol) {
      list = list.slice().sort((a, b) => {
        const va = String(a[sortCol] || '').toLowerCase();
        const vb = String(b[sortCol] || '').toLowerCase();
        return sortAsc ? va.localeCompare(vb) : vb.localeCompare(va);
      });
    }

    render(list);
  }

  search.addEventListener('input', filter);
  selType.addEventListener('change', filter);
  selTgt.addEventListener('change', filter);

  document.querySelectorAll('#mpv-table th[data-col]').forEach(th => {
    th.addEventListener('click', () => {
      if (sortCol === th.dataset.col) sortAsc = !sortAsc;
      else { sortCol = th.dataset.col; sortAsc = true; }
      filter();
    });
  });

  filter();
})();
</script>
