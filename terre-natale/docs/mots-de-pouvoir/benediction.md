# École de Bénédiction

<div id="mpv-app">

<div class="mpv-filters">
  <input type="text" id="mpv-search" placeholder="Rechercher (nom, latin, arcanique, description…)" />
  <select id="mpv-type">
    <option value="">Tous les types</option>
    <option value="Pouvoir">Pouvoir</option>
  </select>
  <select id="mpv-target">
    <option value="">Toutes les cibles</option>
    <option value="Cible">Cible</option>
<option value="Cible (objet)">Cible (objet)</option>
<option value="Lieu/Cible">Lieu/Cible</option>
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
    "vulgar": "Revigoration",
    "latin": "Vigor (Force, vigueur)",
    "arcane": "Lokvigor (Lok + vigor)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🪷 Nature: Lokvigoreiln",
    "description": "Génère un enchantement positif qui augmente toutes les récupérations de [Magnitude/10], notons que pour en profiter lors d'un repos il est nécessaire que le lanceur de sort ai procédé à un rituel ou qu'il reste éveillé pour maintenir le sort."
  },
  {
    "num": 2,
    "vulgar": "Restitution",
    "latin": "Reddo (Rendre, restituer)",
    "arcane": "Luxreddo (Lux + reddo)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "❤️ Vie: Luxreddoir (PV), 🧩 Mental: Luxreddoend (PS), 🌀 Chaos: Luxreddoix (PK), ⚕️ Corps: Luxreddoen (PC), 🧠 Esprit: Luxreddoys (PC), 🔮 Magie: Luxreddoirn (PM), 🪷 Nature: Luxreddoeiln (PE/fatigue)",
    "description": "Génère un enchantement positif qui augmente la récupération d'une ressource qui dépends de la [clé] associée de [Magnitude/5], notons que pour en profiter lors d'un repos il est nécessaire que le lanceur de sort ai procédé à un rituel ou qu'il reste éveillé pour maintenir le sort."
  },
  {
    "num": 3,
    "vulgar": "Bénédiction",
    "latin": "Benedico (Dire du bien)",
    "arcane": "Lembene (Lem + bene)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "✨ Sacre: Lembeneiel",
    "description": "Génère un enchantement positif qui augmente de [Magnitude/10] la plage des singularités positives (exploits)."
  },
  {
    "num": 4,
    "vulgar": "Assainissement",
    "latin": "???",
    "arcane": "???",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🪷 Nature: Lirpurgoeiln",
    "description": "Produit un enchantement positif qui réduit les charges de [Magnitude/2] des conditions négatives reçues, il est possible de concentrer l'effet sur un domaine de magie unique pour lequel l'effet sera doublé (via [clé]) (les autres domaines n'en profitent alors plus."
  },
  {
    "num": 5,
    "vulgar": "Exhaussement",
    "latin": "???",
    "arcane": "???",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🪷 Nature: Lynallus eiln",
    "description": "Produit un enchantement positif qui double les charges, maximum [Magnitude], les effets des conditions positives, il est possible de concentrer l'effet sur un domaine de magie unique pour lequel l'effet sera doublé (via [clé]) (les autres domaines n'en profitent alors plus."
  },
  {
    "num": 6,
    "vulgar": "Réactivation",
    "latin": "Actus (Action)",
    "arcane": "Luxactus (Lux + actus)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🪷 Nature: Luxactus eiln",
    "description": "Produit un effet d'enchantement positif provoquant à chaque tour les effets d'un autre [mot de pouvoir] prodiguant des soins avec une magnitude divisée par deux."
  },
  {
    "num": 7,
    "vulgar": "Allégement",
    "latin": "Leves (Léger)",
    "arcane": "Lemleves (Lem + leves)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "💢 Vide: Lemlevesarh",
    "description": "Génère un enchantement positif qui réduit le poids effectif de la cible de [Magnitude]% (arrondis supérieur)."
  },
  {
    "num": 8,
    "vulgar": "Délestement",
    "latin": "Onus (Fardeau)",
    "arcane": "Lironus (Lir + onus)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🌪️ Air: Lironusel",
    "description": "Génère un enchantement positif qui réduit le poids effectif de la cible de [Magnitude/4]."
  },
  {
    "num": 9,
    "vulgar": "Consolidement",
    "latin": "???",
    "arcane": "???",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚕️ Corps: Lynfirmen",
    "description": "Génère un enchantement positif qui augmente le poids maximum de la cible de [Magnitude/4]."
  },
  {
    "num": 10,
    "vulgar": "Dissipation",
    "latin": "???",
    "arcane": "???",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🌪️ Air: Luxmorsel",
    "description": "Génère un enchantement positif qui réduit la distance des chutes de [Magnitude/4], maximum la moitié."
  },
  {
    "num": 11,
    "vulgar": "Libération",
    "latin": "Liber (Libre)",
    "arcane": "Lemliber (Lem + liber)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🌪️ Air: Lemliberel",
    "description": "Génère un enchantement positif qui permet d'ignorer jusqu'à [Magnitude/10] pénalité lié au déplacement."
  },
  {
    "num": 12,
    "vulgar": "Équilibrage",
    "latin": "???",
    "arcane": "???",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🪨 Terre: Lirstabum",
    "description": "Génère un enchantement positif qui réduit de [Magnitude/3] le jet de déplacement forcé subit."
  },
  {
    "num": 13,
    "vulgar": "Régulation",
    "latin": "???",
    "arcane": "???",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "❤️ Vie: Loktenuir",
    "description": "Génère un enchantement positif qui réduit de [Magnitude] la charge des conditons de rupture (DOT) ou les dégats continues (en suspens)."
  },
  {
    "num": 14,
    "vulgar": "Isolation",
    "latin": "Solus (Seul)",
    "arcane": "Luxsolu (Lux + solu)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "❤️ Vie: Luxsoluir",
    "description": "Génère un enchantement positif qui réduit jusqu'à [Magnitude/2] les brûlures de mana."
  },
  {
    "num": 15,
    "vulgar": "Endurcissement",
    "latin": "Durus (Dur)",
    "arcane": "Lemdur (Lem + dur)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "❤️ Vie: Lemdurir",
    "description": "Génère un enchantement positif qui augmente d'un total de [Magnitude/5] le maximum de lésions par niveau de gravité (d'abord le niveau 0, puis 1, puis 2, etc)."
  },
  {
    "num": 16,
    "vulgar": "Propagation",
    "latin": "???",
    "arcane": "???",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "❤️ Vie: Lirpercuir",
    "description": "Génère un enchantement positif qui duplique jusqu'à [Magnitude/2] les soins reçus par la cible sur une autre cible, le sort doit avoir une zone d'effet pour fonctionner, la cible doit se situer dans cette zone."
  },
  {
    "num": 17,
    "vulgar": "Infection",
    "latin": "Inficio (Souiller)",
    "arcane": "Lynfect (Lyn + infect)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "☠️ Mort: Lynfectus",
    "description": "Génère un enchantement positif qui augmente les soins reçus de (au choix au lancement du sort) [Magnitude/2] / [Magnitude/3] / [Magnitude/4] , s'applique un maximum de 3 / 4 / 5 fois."
  },
  {
    "num": 18,
    "vulgar": "Anticipation",
    "latin": "Anticipo (Prendre avant)",
    "arcane": "Luxanti (Lux + anti)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "❤️ Vie: Luxantiir",
    "description": "Génère un enchantement positif qui réduit la gravité des blessures à venir de [Magnitude/3] / [Magnitude/2] / [Magnitude], s'applique un maximum de 3 / 2 / 1 fois."
  },
  {
    "num": 19,
    "vulgar": "Prévention",
    "latin": "Caveo (Prendre garde)",
    "arcane": "Lemcave (Lem + cave)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🧩 Mental: Lemcaveend",
    "description": "Génère un enchantement positif qui réduit la gravité des traumas à venir de [Magnitude/3] / [Magnitude/2] / [Magnitude], s'applique un maximum de 3 / 2 / 1 fois."
  },
  {
    "num": 20,
    "vulgar": "Répercussion",
    "latin": "Reverbero (Répercuter)",
    "arcane": "Lireverb (Lir + reverb)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "4",
    "drain": "4",
    "keys": "🛡️ Guerre: Lireverborr",
    "description": "Génère un enchantement positif qui produit les effets d'un autre [mot de pouvoir] à chaque fois qu'une attaque est porté par la cible et touche un adversaire, l'effet en question dispose d'une puissance de [Magnitude/2] / [Magnitude/3] / [Magnitude/4] et s'applique un maximum de 3 / 4 / 5 fois, si l'effet est positif il prend effet sur l'attaquant sinon sur la cible de l'attaque."
  },
  {
    "num": 21,
    "vulgar": "Réaction",
    "latin": "Ago (Agir)",
    "arcane": "Lokago (Lok + ago)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "4",
    "drain": "4",
    "keys": "🛡️ Guerre: Lokagoorr",
    "description": "Génère un enchantement positif qui produit les effets d'un autre [mot de pouvoir] à chaque fois qu'une attaque est porté par un adversaire sur la cible, l'effet en question dispose d'une puissance de [Magnitude/2] / [Magnitude/3] / [Magnitude/4] et s'applique un maximum de 3 / 4 / 5 fois, si l'effet est positif il prend effet sur la cible de l'attaque sinon sur l'attaquant."
  },
  {
    "num": 22,
    "vulgar": "Kaléidoscope",
    "latin": "Forma (Forme)",
    "arcane": "Luxform (Lux + form)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "4",
    "keys": "🎭 Illusion: Luxformin",
    "description": "Génère un enchantement positif qui génère [Magnitude/10] image légèrement décalée de la cible, une attaque (nécessairement mono cible) qui devrait le toucher à donc une chance sur \"nombre d'image restantes\" d'échouer, chaque fois qu'une attaque échoue de cette manière le nombre d'image restante diminue de 1."
  },
  {
    "num": 23,
    "vulgar": "Réfraction",
    "latin": "Frango (Briser)",
    "arcane": "Lemfran (Lem + fran)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "4",
    "keys": "🎭 Illusion: Lemfranin",
    "description": "Génère un enchantement positif qui génère [Magnitude/10] image légèrement décalée de la cible, une attaque (nécessairement mono cible) qu'un adversaire cherche à défendre via une action de défense à une chance sur \"nombre d'image restantes\" d'échouée en ciblant la mauvaise image, chaque fois qu'une défense échoue de cette manière le nombre d'image restante diminue de 1."
  },
  {
    "num": 24,
    "vulgar": "Imprégnation",
    "latin": "Imbueo (Imprégner)",
    "arcane": "Lirimbu (Lir + imbu)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🔮 Magie: Lirimbuirn",
    "description": "Génère un enchantement positif qui augmente la difficulté arcanique des sorts lancés par la cible de [Magnitude/5]."
  },
  {
    "num": 25,
    "vulgar": "Infravision",
    "latin": "Video (Voir)",
    "arcane": "Lynvisu (Lyn + visu)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "👁️ Vision: Lynvisueth",
    "description": "Génère un enchantement positif qui permet à la cible de voir au travers des murs sur une distance de [Magnitude/5]."
  },
  {
    "num": 26,
    "vulgar": "Calibrage",
    "latin": "???",
    "arcane": "???",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "4",
    "drain": "4",
    "keys": "✨ Sacre: Luxoptiiel",
    "description": "Génère un enchantement positif qui permet à la cible de relancer tous les dés d'un test si le total de ces derniers est inférieur à [Magnitude/4] puis il conserve celui de son choix, cet effet peux avoir lieu jusqu'à 3 fois."
  },
  {
    "num": 27,
    "vulgar": "Inflexion",
    "latin": "Flecto (Courber)",
    "arcane": "Lemfleco (Lem + fleco)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚜️ Charme: Lemfleco ynh",
    "description": "Génère un enchantement positif qui rend la cible plus difficulté à persuader/convaincre, la difficulté augmente de [Magnitude/5]."
  },
  {
    "num": 28,
    "vulgar": "Accélération",
    "latin": "Velox (Rapide)",
    "arcane": "Lirvelo (Lir + velo)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🛡️ Guerre: Lirvelo orr",
    "description": "Génère un enchantement positif qui octroie à la cible un total de [Magnitude/7] action libre par tours, hydraté équitablement sur les 3 premiers rounds."
  },
  {
    "num": 29,
    "vulgar": "Préparation",
    "latin": "Paro (Préparer)",
    "arcane": "Lokparo (Lok + paro)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🪨 Terre: Lokparoum",
    "description": "Génère un enchantement positif qui octroie à la cible un total de [Magnitude/10] action de défense par tours, hydraté équitablement sur les 3 premiers rounds."
  },
  {
    "num": 30,
    "vulgar": "Aggression",
    "latin": "Gredior (Marcher)",
    "arcane": "Luxgrede (Lux + grede)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🌪️ Air: Luxgredeel",
    "description": "Génère un enchantement positif qui octroie à la cible un total de [Magnitude/10] action d'attaque par tours, hydraté équitablement sur les 3 premiers rounds."
  },
  {
    "num": 31,
    "vulgar": "Coordination",
    "latin": "Ordo (Ordre)",
    "arcane": "Lemordo (Lem + ordo)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "💧 Eau: Lemordoyn",
    "description": "Génère un enchantement positif qui octroie à la cible un total de [Magnitude/10] action tactique par tours, hydraté équitablement sur les 3 premiers rounds."
  },
  {
    "num": 32,
    "vulgar": "Canalisation",
    "latin": "Canalis (Conduit)",
    "arcane": "Lircana (Lir + cana)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🔮 Magie: Lircanairn",
    "description": "Génère un enchantement positif qui octroie à la cible un total de [Magnitude/10] action d'arcanes ou relatifs à la magie par tours, hydratés équitablement sur les 2 premiers rounds."
  },
  {
    "num": 33,
    "vulgar": "Perception",
    "latin": "Capio (Saisir)",
    "arcane": "Lucapti (Lu + capti)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "👁️ Vision: Lucaptieth",
    "description": "Génère un enchantement positif qui octroie à la cible un total de [Magnitude/5] action d'observation (ou autre actions mentales) par tours, hydraté équitablement sur les 3 premiers rounds."
  },
  {
    "num": 34,
    "vulgar": "Stimulation",
    "latin": "Stimulo (Piquer)",
    "arcane": "Luxstimu (Lux + stimu)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "💢 Vide: Luxstimu arh",
    "description": "Génère un enchantement positif qui ajuste l'initiative de la cible de [Magnitude/6]."
  },
  {
    "num": 35,
    "vulgar": "Sanctuarisation",
    "latin": "Sanctus (Sacré)",
    "arcane": "Lemsanct (Lem + sanct)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🔮 Magie: Lemsanctirn",
    "description": "Génère un enchantement positif qui immunise le lanceur de sort aux sorts qu'il maitrise/dont il est le propriétaire si le niveau du sort ne dépasser celui ci."
  },
  {
    "num": 36,
    "vulgar": "Solidification",
    "latin": "Solidus (Solide)",
    "arcane": "Lirsoli (Lir + soli)",
    "word_type": "Pouvoir",
    "target_type": "Cible (objet)",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚔️ Acier: Lirsolian",
    "description": "Génère un enchantement positif qui renforce l'objet ciblé, ce dernier profitant d'un bonus de solidité de [Magnitude/5]."
  },
  {
    "num": 37,
    "vulgar": "Renforcement",
    "latin": "Roboro (Fortifier)",
    "arcane": "Lurobor (Lu + robor)",
    "word_type": "Pouvoir",
    "target_type": "Cible (objet)",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚔️ Acier: Luroboran",
    "description": "Génère un enchantement positif qui protège l'objet ciblé, ce dernier réalisant ses test de solidité avec un bonus de [Magnitude/3]."
  },
  {
    "num": 38,
    "vulgar": "Affûtement",
    "latin": "Acies (Pointe)",
    "arcane": "Luxacie (Lux + acie)",
    "word_type": "Pouvoir",
    "target_type": "Cible (objet)",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚔️ Acier: Luxaciean",
    "description": "Génère un enchantement positif qui acère l'objet ciblé, ce dernier imposant des test de solidité augmentés de [Magnitude/3]."
  },
  {
    "num": 39,
    "vulgar": "Sauvegarde",
    "latin": "???",
    "arcane": "???",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "💢 Vide: Lemservarh",
    "description": "Génère un enchantement positif qui renforce l'objet ciblé, ce dernier évitant de réaliser ses test de solidité, chaque test ainsi évité provoque une décharge de cet effet."
  },
  {
    "num": 40,
    "vulgar": "Galvanisation",
    "latin": "Vibro (Agiter)",
    "arcane": "Lirvibr (Lir + vibr)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🛡️ Guerre: Lirvibr orr",
    "description": "Génère un enchantement positif qui augmente de moitié la génération de ressources temporaires tel que rage, garde et adrénaline, avec un maximum de [Magnitude/2], augmente également le maximum de ces ressources de [Magnitude/4]."
  },
  {
    "num": 41,
    "vulgar": "Énergisation",
    "latin": "???",
    "arcane": "???",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🛡️ Guerre: Lokintenorr, 🐗 Faune: Lokintenorh, 🧩 Mental: Lokintenend",
    "description": "Génère un enchantement positif qui accorde un bonus d'attribut de [Magnitude/5] lors des tests d'attaque via arme non naturelle (clé guerre) ou arme naturelle (clé faune) ou joute (clé mental) de la cible."
  },
  {
    "num": 42,
    "vulgar": "Solide",
    "latin": "Solidus (Solide)",
    "arcane": "Luxconsol (Lux + consol)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🛡️ Guerre: Luxconsolorr, 🐗 Faune: Luxconsolorh, 🧩 Mental: Luxconsolend",
    "description": "Génère un enchantement positif qui accorde un bonus d'attribut de [Magnitude/5] lors des tests de défense via arme non naturelle (clé guerre) ou arme naturelle (clé faune) ou joute (clé mental) de la cible."
  },
  {
    "num": 43,
    "vulgar": "Optimal",
    "latin": "Perficio (Achever)",
    "arcane": "Lemperf (Lem + perf)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🛡️ Guerre: Lemperforr, 🐗 Faune: Lemperforh, 🧩 Mental: Lemperfend",
    "description": "Génère un enchantement positif qui accorde un bonus d'attribut de [Magnitude/5] lors des tests tactiques via arme non naturelle (clé guerre) ou arme naturelle (clé faune) ou joute (clé mental) de la cible."
  },
  {
    "num": 44,
    "vulgar": "Harmonisation",
    "latin": "Harmonia (Harmonie)",
    "arcane": "Lirharmo (Lir + harmo)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🛡️ Guerre: Lirharmoor, 🧩 Mental: Lirharmoend, 🔮 Magie: Lirharmoirn",
    "description": "Génère un enchantement positif qui réduit de [Magnitude/10] les pénalités des manoeuvres physiques (clé guerre), mentales (clé mental) ou incantatoires (clé magie) de la cible."
  },
  {
    "num": 45,
    "vulgar": "Reverbération",
    "latin": "Verbero (Battre)",
    "arcane": "Luverbe (Lu + verbe)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🛡️ Guerre: Luverbeorr, 🧩 Mental: Luverbeend",
    "description": "Génère un enchantement positif qui génère l'équivalant du tier de la déviation physique ou mentale (selon clé) d'un blocage ou une parade d'ordre physique ou mental (selon clé) en dégats physique ou mental (selon clé) ignorant toutes les défenses de la cible, maximum [Magnitude/3]."
  },
  {
    "num": 46,
    "vulgar": "Purification",
    "latin": "Mundo (Nettoyer, purifier)",
    "arcane": "Luxmundo (Lux + mundo)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🪷 Nature: Luxmundoeiln",
    "description": "Génère un enchantement positif qui augmente de [Magnitude/5] le seuil à la corruption."
  },
  {
    "num": 47,
    "vulgar": "Substitution",
    "latin": "Stat (Être debout)",
    "arcane": "Lemstato (Lem + stato)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🪷 Nature: Lemstatoeiln",
    "description": "Génère un enchantement positif qui permet à la cible d'utiliser son attribut d'équilibre au lieu de la magie pour le calcule de sa sauvegarde d'opposition, le sort doit être de niveau 2 minimum."
  },
  {
    "num": 48,
    "vulgar": "Convergence",
    "latin": "Convergo (Se diriger)",
    "arcane": "Lirconver (Lir + conver)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🔮 Magie: Lirconverirn",
    "description": "Génère un enchantement positif qui augmente la réunion de mana de [Magnitude/3], de plus faire appel à cet action peux se faire en remplaçant l'action simple par une action rapide coutant [Magnitude/10] points d'initiative en moins."
  },
  {
    "num": 49,
    "vulgar": "Transcandence",
    "latin": "Scando (Grader, monter)",
    "arcane": "Luscand (Lu + scand)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🎭 Illusion: Luscandin",
    "description": "Génère un enchantement positif qui inverse l'utilisation des attributs du corps et de l'esprit : Chaque fois qu'une cible dans la zone doit utiliser un attribut dans un test (action, sauvegarde, etc) il peux employer son équivalant du corps ou de l'esprit à la place, cet effet ne peux être maintenu et sa décharge est doublée (10)."
  },
  {
    "num": 50,
    "vulgar": "Élévation",
    "latin": "Levo (Soulever)",
    "arcane": "Luxlevo (Lux + levo)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "4",
    "drain": "4",
    "keys": "⚕️ Corps: Luxlevoen (FOR, CON, DEX, AGI, PER), 🧠 Esprit: Luxlevoys (CHA, VOL, INT, RUS, SAG)",
    "description": "Génère un enchantement positif qui augmente un attribut (au choix au lancement du sort selon la [clé]) de [Magnitude/6]."
  },
  {
    "num": 51,
    "vulgar": "Spécialisation",
    "latin": "Specialis (Particulier)",
    "arcane": "Lemspecia (Lem + specia)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚕️ Corps: Lemspeciaen (FOR, CON, DEX, AGI, PER), 🧠 Esprit: Lemspeciays (CHA, VOL, INT, RUS, SAG), 🌀 Chaos: Lemspeciaix (CHN), 🔮 Magie: Lemspeciairn (MAG, LOG)",
    "description": "Génère un enchantement positif qui augmente un attribut (définit à la création du sort selon la [clé]) de [Magnitude/5]."
  },
  {
    "num": 52,
    "vulgar": "Protection",
    "latin": "???",
    "arcane": "???",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🐗 Faune: Lynfortiorh",
    "description": "Génère un enchantement positif qui augmente tous les attributs du corps de [Magnitude/7] mais réduit ceux de l'esprit d'autant."
  },
  {
    "num": 53,
    "vulgar": "Spiritualisation",
    "latin": "Spiritus (Souffle)",
    "arcane": "Luspiri (Lu + spiri)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🧩 Mental: Luspiriend",
    "description": "Génère un enchantement positif qui augmente tous les attributs de l'esprit de [Magnitude/7] mais réduit ceux du corps d'autant."
  },
  {
    "num": 54,
    "vulgar": "Floraison",
    "latin": "Floreo (Fleurir)",
    "arcane": "Luxflore (Lux + flore)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🌿 Flore: Luxfloreiln",
    "description": "Génère un enchantement positif, à chaque début de tour la cible reçoit un marqueur, augmente un attribut principal au choix de [Magnitude/20] par marqueurs."
  },
  {
    "num": 55,
    "vulgar": "Maximisation",
    "latin": "Maximus (Très grand)",
    "arcane": "Lemmax (Lem + max)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "6",
    "drain": "0",
    "keys": "🐗 Faune: Lemmaxorh",
    "description": "Génère un enchantement positif qui fixe ou nouvelle valeur ou octroie un bonus à l'attribut (au choix parmis les attributs du corps), la cible conserve le résultat le plus élevé entre avoir une valeurs finale de [Magnitude] ou recevoir un bonus de [Magnitude/4]."
  },
  {
    "num": 56,
    "vulgar": "Calibration",
    "latin": "Libra (Équilibre)",
    "arcane": "Lirlibra (Lir + libra)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "6",
    "drain": "0",
    "keys": "🧩 Mental: Lirlibraend",
    "description": "Génère un enchantement positif qui fixe ou nouvelle valeur ou octroie un bonus à l'attribut (au choix parmis les attributs de l'esprit), la cible conserve le résultat le plus élevé entre avoir une valeurs finale de [Magnitude] ou recevoir un bonus de [Magnitude/4]."
  },
  {
    "num": 57,
    "vulgar": "Olfactovision",
    "latin": "Oleo (Sentir)",
    "arcane": "Lynoleo (Lyn + oleo)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🌿 Flore: Lynoleoiln",
    "description": "Génère un enchantement positif qui octroie à sa cible la faculté de voir les parfums comme on verrait des volutes de couleurs sur [Magnitude] de distance, un test (odorat, visuel, connaissance, peu importe) visant ces odeurs se fait avec un bonus de [Magnitude/10]."
  },
  {
    "num": 58,
    "vulgar": "Mitigation",
    "latin": "Mitis (Doux)",
    "arcane": "Luxmitis (Lux + mitis)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🔥 Feu: Luxmitisar, ❄️ Glace: Luxmitisis, ⚡ Foudre: Luxmitisor, 🪨 Terre: Luxmitisum, 💧 Eau: Luxmitisyn, 🌪️ Air: Luxmitisel, ☠️ Mort: Luxmitisus, ✡️ Arcane: Luxmitisys, ☢️ Toxique: Luxmitisex, ⚔️ Acier: Luxmitisan, 🌿 Flore: Luxmitisiln, 🎭 Illusion: Luxmitisin, ⚖️ Loi: Luxmitisem, 🌀 Chaos: Luxmitisix, ✨ Sacre: Luxmitisiel, 🩸 Impie: Luxmitisun, 🧩 Mental: Luxmitisend, ☀️ Lumière: Luxmitision, 🌑 Ombre: Luxmitisoth, 💢 Vide: Luxmitisarh",
    "description": "Génère un enchantement positif qui réduit de [Magnitude/3] les dégats réalisés sur la cible si ces dégats sont issus d'élément contre lequel la [clé] utilisée est forte."
  },
  {
    "num": 59,
    "vulgar": "Absorption",
    "latin": "Sorbeo (Boire)",
    "arcane": "Lemsorb (Lem + sorb)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🛡️ Guerre: Lemsorborr (Mêlée), 🛡️ Guerre: Lemsorborr (Tir), 🧩 Mental: Lemsorbend (Mental), ✡️ Arcane: Lemsorbys (Magique), 🐗 Faune: Lemsorborh (Naturel)",
    "description": "Génère un enchantement positif qui réduit de moitié les dégats d'un type (selon la [clé] utilisée) avec un maximum de [Magnitude/2]."
  },
  {
    "num": 60,
    "vulgar": "Amplification",
    "latin": "Amplus (Vaste)",
    "arcane": "Liramplo (Lir + amplo)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚖️ Loi: Liramploem",
    "description": "Génère un enchantement positif qui augmente la plage singularité de la cible de 1 / 2, à chaque fois que cet effet permet une singularité l'enchantement subit une décharge / double décharge."
  },
  {
    "num": 61,
    "vulgar": "Inhibition",
    "latin": "Habeo (Tenir, retenir)",
    "arcane": "Lokhabi (Lok + habi)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "☀️ Lumière: Lokhabision",
    "description": "Génère un enchantement positif qui réduit la plage singularité contre la cible de 1 / 2, à chaque fois que cet effet permet une singularité l'enchantement subit une décharge / double décharge."
  },
  {
    "num": 62,
    "vulgar": "Bonification",
    "latin": "Bonus (Bon)",
    "arcane": "Luxbono (Lux + bono)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🌀 Chaos: Luxbonoix",
    "description": "Génère un enchantement positif qui augmente octroie un bonus de [Magnitude/5] lors d'une singularité (positive ou négative)."
  },
  {
    "num": 63,
    "vulgar": "Priorisation",
    "latin": "Prior (Premier)",
    "arcane": "Lemprior (Lem + prior)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚖️ Loi: Lempriorem",
    "description": "Génère un enchantement positif qui met en avant une action définit au moment où le sort est lancé, la cible peux réaliser cette action avec un avantage, chaque fois que c'est le cas l'enchantement subit une décharge, cependant tant que cette action n'a pas été réalisée ce tour ci les autres actions sont désavantagées."
  },
  {
    "num": 64,
    "vulgar": "Subjugation",
    "latin": "Iugum (JouG)",
    "arcane": "Liriugo (Lir + iugo)",
    "word_type": "Pouvoir",
    "target_type": "Lieu/Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚖️ Loi: Liriugoem",
    "description": "Génère un effet qui génère une pénalité de [Magnitude/5] à toutes les actions d'un type (choisit au lancement du sort) qui vise la cible (lieu ou cible), la cible peux réaliser un test de détermination afin de réduire les effets."
  },
  {
    "num": 65,
    "vulgar": "Dynamisation",
    "latin": "Dynamis (Puissance, grec)",
    "arcane": "Ludyna (Lu + dyna)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "❤️ Vie: Ludynair",
    "description": "Génère un enchantement positif qui provoque une double décharge des conditions de soins (HOT) de la cible, chaque occurence provoquant une décharge de cet enchantement ci."
  },
  {
    "num": 66,
    "vulgar": "Conservation",
    "latin": "Servo (Sauver)",
    "arcane": "Luxservo (Lux + servo)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚕️ Corps: Luxservoen (Robustesse ou Réflexes), 🧠 Esprit: Luxservoys (Détermination ou Sang-Froid), 🌀 Chaos: Luxservoix (Fortune), 🔮 Magie: Luxservoirn (Opposition), 🪷 Nature: Luxservoeiln (Intuition)",
    "description": "Génère un enchantement positif qui augmente une sauvegarde au choix (dont le type dépends de la [clé]) de [Magnitude/5]."
  },
  {
    "num": 67,
    "vulgar": "Consolidation",
    "latin": "Valentia (Force, valeur)",
    "arcane": "Lemvalen (Lem + valen)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🪷 Nature: Lemvaleneiln",
    "description": "Génère un enchantement positif qui augmente toutes les sauvegardes de [Magnitude/10]."
  },
  {
    "num": 68,
    "vulgar": "Fortification",
    "latin": "Munio (Fortifier)",
    "arcane": "Lirmunio (Lir + munio)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "❤️ Vie: Lirmunioir (PV), 🧩 Mental: Lirmunioend (PS), 🌀 Chaos: Lirmunioix (PK), ⚕️ Corps: Lirmunioen (PC), 🧠 Esprit: Lirmunioys (PC), 🔮 Magie: Lirmunioirn (PM), 🪷 Nature: Lirmunioeiln (PE/fatigue)",
    "description": "Génère un enchantement positif qui augmente le maximum d'une ressource au choix (dont le type dépends de la [clé]) de [Magnitude/2], n'augmente pas la ressource actuelle."
  },
  {
    "num": 69,
    "vulgar": "Capacitation",
    "latin": "Capax (Capable)",
    "arcane": "Lucapax (Lu + capax)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🪷 Nature: Lucapaxeiln",
    "description": "Génère un enchantement positif qui augmente le maximum de toutes les ressources de [Magnitude/4], n'augmente pas la ressource actuelle."
  },
  {
    "num": 70,
    "vulgar": "Augmentation",
    "latin": "Augeo (Augmenter)",
    "arcane": "Luxauge (Lux + auge)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "TODO : Liste des domaines avec caractéristiques",
    "description": "Produit un enchantement positif qui augmente une caractéristique (dont la nature dépends de la [clé]) de [Magnitude/5]."
  },
  {
    "num": 71,
    "vulgar": "Perfectionnement",
    "latin": "Perficere (Achever)",
    "arcane": "Lempfect (Lem + pfect)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🛡️ Guerre: Lempfectorr (Combat, Défense, Tactique, Archerie, Corps à corps), ⚕️ Corps: Lempfecten (Athlétisme, Gymnastique, Discipline), 👁️ Vision: Lempfecteth (Acuité), ✡️ Arcane: Lempfectys (Arcanes), 🔮 Magie: Lempfectirn (Chasse, Survie Rurale, Survie urbaine, Discrétion, Larçin, Sagacité, Subterfuge), ⚜️ Charme: Lempfectynh (Argumentation, Résolution, Manipulation, Art, Eloquence), 🧠 Esprit: Lempfectys (Artisanat, Profession, Savoir être, Savoir faire), 📚 Savoir: Lempfectaum (Langue, Enquête, Erudition, Stratégie, Guérison, Commerce)",
    "description": "Produit un enchantement positif qui augmente une compétence (dont la nature dépends de la [clé]) de [Magnitude/7]."
  },
  {
    "num": 72,
    "vulgar": "Exaltation",
    "latin": "Laudo (Louer)",
    "arcane": "Lirlaudo (Lir + laudo)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🪷 Nature: Lirlaudoeiln",
    "description": "Génère un enchantement positif qui maintient les conditions positives sur la cible, cet enchantement ne peux pas être maintenu."
  },
  {
    "num": 73,
    "vulgar": "Immunisation",
    "latin": "Munus (Charge, devoir)",
    "arcane": "Lumunus (Lu + munus)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "TODO : Liste des domaines avec conditions",
    "description": "Produit un enchantement positif qui immunise contre les conditions négative associées au domaine, réduisant les charges de [Magnitude] lorsque la condition doit être contractée."
  },
  {
    "num": 74,
    "vulgar": "Intense",
    "latin": "Vehemens (Violent)",
    "arcane": "Luxvehem (Lux + vehem)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "TODO : Liste des domaines avec conditions",
    "description": "Produit un enchantement positif qui augmente les effets des conditions positive associées au domaine, augmentant les charges de [Magnitude] lorsque la condition doit être contractée."
  },
  {
    "num": 75,
    "vulgar": "Récupération",
    "latin": "Capio (Prendre)",
    "arcane": "Lemcapio (Lem + capio)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "❤️ Vie: Lemcapioir (PV), 🧩 Mental: Lemcapioend (PS), 🌀 Chaos: Lemcapioix (PK), ⚕️ Corps: Lemcapioen (PC), 🧠 Esprit: Lemcapioys (PC), 🔮 Magie: Lemcapioirn (PM), 🪷 Nature: Lemcapioeiln (PE/fatigue)",
    "description": "Produit un enchantement positif qui octroie à chaque tour [Magnitude/5] points de ressources sous forme de ressource temporaires (dont la nature dépends de la [clé]), le gain ne peux dépasser ce qu'il manque entre la valeurs actuelle et le maximum."
  },
  {
    "num": 76,
    "vulgar": "Régénération",
    "latin": "Gigno (Engendrer)",
    "arcane": "Lirgeno (Lir + geno)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🪷 Nature: Lirgenoeiln",
    "description": "Produit un enchantement positif qui octroie à chaque scènes qui prend fin [Magnitude/5] PV, ce regain n'engendre pas de fatigue (contrairement aux autres) (attention il est difficile de maintenir des enchantements sur plusieurs scènes)."
  },
  {
    "num": 77,
    "vulgar": "Convalescence",
    "latin": "Valeo (Être fort)",
    "arcane": "Lokvale (Lok + vale)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🪷 Nature: Lokvaloeiln",
    "description": "Produit un enchantement positif qui octroie à chaque scènes qui prend fin [Magnitude/5] PS, ce regain n'engendre pas de fatigue (contrairement aux autres) (attention il est difficile de maintenir des enchantements sur plusieurs scènes)."
  },
  {
    "num": 78,
    "vulgar": "Hyperperception",
    "latin": "Sensus (Sens)",
    "arcane": "Luxsens (Lux + sens)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "👁️ Vision: Luxsens eth",
    "description": "Génère un enchantement positif qui augmente drastiquement la portée des sens de la cible, cette dernière peux désormais percevoir les choses [Magnitude/4] fois plus loin qu'habituellement, les sens sont autant de fois plus intenses et les tests de sauvegarde ou compétence reçoivent un bonus équivalant (ce bonus est réduit au delà de la portée habituelle, par example si l'odeur est à 3x la portée habituelle et que le sort permet de percevoir 5x plus loin alors le bonus est de +2)."
  },
  {
    "num": 79,
    "vulgar": "DésIllusion",
    "latin": "Ludo (Jouer)",
    "arcane": "Lemludo (Lem + ludo)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "👁️ Vision: Lemludo eth",
    "description": "Génère un enchantement positif qui permet de voir au travers des Illusions et faux semblants (mensonges, etc), octroyant un bonus de [Magnitude/4] aux tests en question."
  },
  {
    "num": 80,
    "vulgar": "Inapparition",
    "latin": "Apareo (Apparaître)",
    "arcane": "Lirapare (Lir + apare)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚜️ Charme: Lirapare ynh",
    "description": "Génère un enchantement positif qui rend la cible moins marquante, les autres sont prompt à l'ignorer dans la masse ou même dans un environnement chargé, octroyant un bonus de [Magnitude/4] aux tests visant à échapper à l'attention des autres, voir à la menace."
  },
  {
    "num": 81,
    "vulgar": "Majoration",
    "latin": "Maior (Plus grand)",
    "arcane": "Lynmajor (Lyn + major)",
    "word_type": "Pouvoir",
    "target_type": "Cible (objet)",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚔️ Acier: Lynmajoran",
    "description": "Génère un enchantement positif qui augmente la catégorie effective de la cible (arme, outils ou armure) de [Magnitude/10], attention car le changement de catégorie (à la hausse) implique entre autre des pénalités d'usages supérieures."
  },
  {
    "num": 82,
    "vulgar": "Dégrèvement",
    "latin": "Levis (Léger)",
    "arcane": "Luxlevi (Lux + levi)",
    "word_type": "Pouvoir",
    "target_type": "Cible (objet)",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚔️ Acier: Luxlevian",
    "description": "Génère un enchantement positif qui réduit les pénalités d'usage de la cible (arme, outils ou armure) de [Magnitude/10]."
  },
  {
    "num": 83,
    "vulgar": "Inaltération",
    "latin": "Alter (Autre)",
    "arcane": "Lemalter (Lem + alter)",
    "word_type": "Pouvoir",
    "target_type": "Cible (objet)",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚔️ Acier: Lemalteran",
    "description": "Génère un enchantement positif qui réduit la déterioration que subit l'objet à 0, tous les 2 points réduits de cet manière réduisent la charge de cet enchantement de 1."
  },
  {
    "num": 84,
    "vulgar": "Cognitransfert",
    "latin": "Cognitio (Connaissance)",
    "arcane": "Lircognit (Lir + cognit)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "📚 Savoir: Lircognitaum",
    "description": "Génère un enchantement positif qui permet à la cible de partager la mémoire avec le lanceur de sort (il a donc accés à la mémoire que ce dernier accepte de partager, ce qui peux inclures ses sorts, ses techniques, etc, dont la cible peux faire usage (si elle en a les moyens)), ce sort ne peux être maintenus."
  },
  {
    "num": 85,
    "vulgar": "Divination",
    "latin": "Divinus (Divin)",
    "arcane": "Luvinus (Lu + vinus)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🧩 Mental: Luvinusend",
    "description": "Génère un enchantement positif qui permet de voir les intentions des autres, lorsque le personnage réalise un test contre une cible dont il peux lire les pensés cette dernière reçoit une pénalité à ses défenses passives de [Magnitude/7], du fait que le lanceur de sort est en mesure de savoir un peu à l'avance ce que la cible fera, de plus la défense du lanceur de sort est augmenté d'autant contre cette cible."
  },
  {
    "num": 86,
    "vulgar": "Précognition",
    "latin": "Scio (Savoir)",
    "arcane": "Luxscio (Lux + scio)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "📚 Savoir: Luxscioaum",
    "description": "Génère un enchantement positif qui permet de voir une fraction de temps en avance, lorsque le personnage réalise un test contre une cible il peux voir le résultat de son action et il peux donc s'adapter un minimum pour maximiser sa réussite, imposant à ses adversaires une pénalité à ses défenses passives et sauvegarde de [Magnitude/10], de plus la défense et sauvegarde du lanceur de sort est augmenté d'autant."
  },
  {
    "num": 87,
    "vulgar": "Dissuasion",
    "latin": "Suadeo (Conseiller)",
    "arcane": "Lemsuad (Lem + suad)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚖️ Loi: Lemsuadem",
    "description": "Génère un enchantement positif qui impose une pénalité de [Magnitude/3] aux actions visant à agresser la cible (attaque ou tactique, mais pas uniquement, c'est au MD de trancher si une action constitue une agression ou non), une action qui touche la cible est affectée même si elle ne vise pas directement celle ci, si la cible entreprend une action d'agression l'enchantement se dissipe sur le champs."
  },
  {
    "num": 88,
    "vulgar": "Rétorsion",
    "latin": "Torsio (Torsion)",
    "arcane": "Lirtorsio (Lir + torsio)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "✨ Sacre: Lirtorsioiel",
    "description": "Génère un enchantement positif inflige des dégats temporaires (ignorant toute défenses) équivalant à [Magnitude/3] si la cible est la cible d'une action visant à l'agresser une cible (attaque ou tactique, mais pas uniquement, c'est au MD de trancher si une action constitue une agression ou non), une action qui touche la cible est affectée même si elle ne vise pas directement celle ci, si la cible entreprend une action d'agression l'enchantement se dissipe sur le champs."
  },
  {
    "num": 89,
    "vulgar": "Activation",
    "latin": "???",
    "arcane": "???",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🔥 Feu: Lunervoar (attaque), ❄️ Glace: Lunervois (défense), ⚡ Foudre: Lunervoor (tactique)",
    "description": "Génère un enchantement positif qui octroie un bonus aux jets des actions dont la nature dépends de la clé de [Magnitude/3], cependant cet enchantement se dissipe à la fin de n'importe quel tour où le personnage n'a pas entrepris ce type d'action."
  },
  {
    "num": 90,
    "vulgar": "Impulsion",
    "latin": "Pello (Pousser)",
    "arcane": "Luxpulso (Lux + pulso)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚡ Foudre: Luxpulsor",
    "description": "Génère un enchantement positif qui octroie un bonus d'allure de [Magnitude/3], cependant cet enchantement se dissipe à la fin de n'importe quel tour où le personnage n'a pas entrepris d'action de déplacement profitant de l'aLure."
  },
  {
    "num": 91,
    "vulgar": "Consécration",
    "latin": "Sacro (Rendre sacré)",
    "arcane": "Lemsacro (Lem + sacro)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🔥 Feu: Lemsacroar, ❄️ Glace: Lemsacrois, ⚡ Foudre: Lemsacroor, 🪨 Terre: Lemsacroum, 💧 Eau: Lemsacroyn, 🌪️ Air: Lemsacroel, ☀️ Lumière: Lemsacroion, 🌑 Ombre: Lemsacrooth, ⚖️ Loi: Lemsacroem, 🌀 Chaos: Lemsacroix, ✨ Sacre: Lemsacroiel, 🩸 Impie: Lemsacroun, ❤️ Vie: Lemsacroir, ☠️ Mort: Lemsacrous, ⚕️ Corps: Lemsacroen, 🧠 Esprit: Lemsacroys, 🐗 Faune: Lemsacroorh, 🌿 Flore: Lemsacroiln, 🧩 Mental: Lemsacroend, ⚜️ Charme: Lemsacroynh, ✡️ Arcane: Lemsacroys, 🔮 Magie: Lemsacroirn, 🪷 Nature: Lemsacroeiln, ☢️ Toxique: Lemsacroex, 🎭 Illusion: Lemsacroin, 📚 Savoir: Lemsacroaum, 👁️ Vision: Lemsacroeth, ⚔️ Acier: Lemsacroan, 🛡️ Guerre: Lemsacroorr, 💢 Vide: Lemsacroarh",
    "description": "Génère un enchantement positif qui octroie à la cible une résistance très marquée contre un élément donné, cela se traduit par une augmentation de [Magnitude/4] en absorption, [Magnitude/6] de protection et [Magnitude/6] de bonus aux sauvegardes."
  },
  {
    "num": 92,
    "vulgar": "Intensification",
    "latin": "Ardeo (Brûler, être ardent)",
    "arcane": "Lirardeo (Lir + ardeo)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "✨ Sacre: Lirardeoiel",
    "description": "Génère un enchantement positif augmentant les effets des conditions positives dont les charges sont inférieures à [Magnitude] sur la cible (les conditions normales ont les effets de conditions améliorées et les conditions améliorées ont des effets encore améliorés d'un cran, si numériquement applicable)."
  },
  {
    "num": 93,
    "vulgar": "Neutralisation",
    "latin": "Neuter (Ni l'un ni l'autre)",
    "arcane": "Luneute (Lu + neute)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "✨ Sacre: Luneuteiel",
    "description": "Génère un enchantement positif réduisant les effets des conditions négatives dont les charges sont inférieures à [Magnitude] sur la cible (les conditions normales ne font plus  effet et les de conditions améliorées ont des effets normaux)."
  },
  {
    "num": 94,
    "vulgar": "Sanctification",
    "latin": "Sacer (Sacré)",
    "arcane": "Luxsacer (Lux + sacer)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "✨ Sacre: Luxsaceriel",
    "description": "Génère un enchantement positif qui augmente de [Magnitude/10] le cout des relances en karma d'un même test."
  },
  {
    "num": 95,
    "vulgar": "Enthousiasme",
    "latin": "Honoro (Honorer)",
    "arcane": "Lemhonoro (Lem + honoro)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "✨ Sacre: Lemhonoroiel",
    "description": "Génère un enchantement positif qui augmente de [Magnitude/10] le cout des relances en karma d'un même test d'action visant à nuire à la cible."
  },
  {
    "num": 96,
    "vulgar": "Exfiltration",
    "latin": "Filtro (Filtrer)",
    "arcane": "Lirfiltr (Lir + filtr)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🌑 Ombre: Lirfiltr oth",
    "description": "Génère un enchantement négatif qui octroie un bonus de [Magnitude/4] à tous les tests visant à fuire (un lieu, une situation, etc), de plus le déplacement est augmenté d'autant."
  },
  {
    "num": 97,
    "vulgar": "Sublimation",
    "latin": "Sublimis (Sublime)",
    "arcane": "Lynsublim (Lyn + sublim)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "✨ Sacre: Lynsublimiel",
    "description": "Génère un enchantement positif qui augmente les sauvegardes contre les conditions négatives de [Magnitude/5]."
  },
  {
    "num": 98,
    "vulgar": "Suractivation",
    "latin": "Actus (Action)",
    "arcane": "Luxsupra (Lux + supra)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "✨ Sacre: Luxsupraiel",
    "description": "Génère un enchantement positif qui double les bénéfices d'une force élémentaire de la cible, avec un maximum de [Magnitude/2]."
  },
  {
    "num": 99,
    "vulgar": "Létalisation",
    "latin": "Letum (Mort)",
    "arcane": "Lemleto (Lem + leto)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚔️ Acier: Lemletoan",
    "description": "Génère un enchantement positif qui augmente la criticité d'une arme ciblé de [Magnitude/3], à la fin du cycle ou après que l'attaque est été porté (critique ou non) cet effet prend immédiatement fin."
  },
  {
    "num": 100,
    "vulgar": "Purgation",
    "latin": "Purgo (Nettoyer)",
    "arcane": "Lirpurg (Lir + purg)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "💢 Vide: Lirpurgarh",
    "description": "Génère un enchantement positif qui force les enchantements négatifs affectants la cible de se décharger de [Magnitude/4] à la fin de chaque tour, maintenir l'enchantement ne permet pas d'éviter cette décharge."
  },
  {
    "num": 101,
    "vulgar": "Dérégulation",
    "latin": "Regula (Règle)",
    "arcane": "Luregul (Lu + regul)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "💢 Vide: Luregularh",
    "description": "Génère un enchantement négatif qui force les enchantements positifs affectants la cible à se recharger de [Magnitude/4] à la fin de chaque tour."
  },
  {
    "num": 102,
    "vulgar": "Irradiation",
    "latin": "Radius (Rayon)",
    "arcane": "Luxradiu (Lux + radiu)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🔥 Feu: Luxradiuar, ❄️ Glace: Luxradiuis, ⚡ Foudre: Luxradiuor, 🪨 Terre: Luxradiuum, 💧 Eau: Luxradiuyn, 🌪️ Air: Luxradiuel, ☠️ Mort: Luxradiuus, ✡️ Arcane: Luxradiuys, ☢️ Toxique: Luxradiuex, ⚔️ Acier: Luxradiuan, 🌿 Flore: Luxradiuiln, ✨ Sacre: Luxradiuiel, 🩸 Impie: Luxradiuun, ☀️ Lumière: Luxradiuion, 🌑 Ombre: Luxradiuoth",
    "description": "Produit un effet d'enchantement positif génèrant à chaque cases dans laquelle entre la cible un enchantement négatif de zone dont les charges sont de [Magnitude/2], lorsqu'un individus entre dans cette zone il subit les effets d'un [mot de pouvoir] infligeant des dégats ou une conditions du même élément définit par la [clé], la puissance de ces dégats ou charges sont de [Magnitude/2], un test de réflexe permet d'y résister (règle normales de résistances aux effets), lorsque l'enchantement positif expire tous les enchantements négatifs liés disparaissent aussi, ces derniers ne peuvent être maintenus."
  },
  {
    "num": 103,
    "vulgar": "Révélation",
    "latin": "Velum (Voile)",
    "arcane": "Lemvelo (Lem + velo)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "☀️ Lumière: Lemveloion",
    "description": "Créé un enchantement qui permet de « révéler » à son regard un ou des éléments qui sont dissimulés, perdus, cachés, escamotés… par magie ou non. Le lanceur de sort choisit donc si il cherche un objet spécifique ou plusieurs non spécifiques. La cible de l'enchantement est alors en conscient de la position du ou des éléments qui peuvent coRespondre. La perception est limité à une distance de [Magnitude/3] mètres autour du lanceur de sort et si l'objet est dissimulés alors il peux l'apercevoir si la difficulté de cette dissimulation est dépassée par [5+Magnitude/2] ou [5+Magnitude/3], selon que le sort a été lancé pour voir un ou plusieurs éléments."
  },
  {
    "num": 104,
    "vulgar": "Clarification",
    "latin": "Clarus (Clair)",
    "arcane": "Lirclarus (Lir + clarus)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "☀️ Lumière: Lirclarusion",
    "description": "Génère un enchantement positif qui réduit toutes les pénalités pouvant altérer l’usage des sens de la cible de [Magnitude/4]."
  },
  {
    "num": 105,
    "vulgar": "Discrétion",
    "latin": "Secretum (Secret)",
    "arcane": "Lusecres (Lu + secres)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🌑 Ombre: Lusecresoth",
    "description": "Génère un enchantement positif qui rend la cible moins visible, augmentant la difficulté pour le percevoir visuellement de [Magnitude/4]."
  },
  {
    "num": 106,
    "vulgar": "Disparition",
    "latin": "Pareo (Apparaître)",
    "arcane": "Luxpare (Lux + pare)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🌑 Ombre: Luxpare oth",
    "description": "Génère un enchantement positif qui rend la cible moins bruyante, augmentant la difficulté pour l'entendre de [Magnitude/4]."
  },
  {
    "num": 107,
    "vulgar": "Atténuation",
    "latin": "Lentes (Lent)",
    "arcane": "Lemlent (Lem + lent)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🌑 Ombre: Lemlentoth",
    "description": "Génère un enchantement positif qui rend la cible moins odorante et moins perceptible, augmentant la difficulté pour la sentir (odeur ou touché) de [Magnitude/4]."
  },
  {
    "num": 108,
    "vulgar": "Dissimulation",
    "latin": "Celare (Cacher)",
    "arcane": "Lircelar (Lir + celar)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🌑 Ombre: Lircelaroth",
    "description": "Génère un enchantement positif qui cache la vraie nature de la cible, on parle ici du karma notament (alignement, etc), la vraie nature n'est simplement pas perceptible ou élude à l'observation, la difficulté associée à son étude étant augmentée de [Magnitude/4]."
  },
  {
    "num": 109,
    "vulgar": "Occultation",
    "latin": "Occulto (Cacher)",
    "arcane": "Luccult (Lu + ccult)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "✡️: Luccultys (élémentaires), ☠️: Luccultus (Nécrophages), 🪷: Luccult eiln (Ogroïdes), 🐗 Faune: Luccultorh (Bêtes), 🪷: Lucculteiln (Draconoïdes), 🩸 Impie: Luccultun (Maudits), 🪷: Luccult eiln (Vermines), 🪷: Lucculteiln (Chimères), ⚔️: Luccultan (Mécaniques), ✡️: Luccultys (Esprits), 🪷: Luccult eiln (Humanoïdes), 🪷: Lucculteiln (Reliques), 🌿: Luccultiln (Plantes)",
    "description": "Génère un enchantement positif qui rend la perception de la cible plus difficile pour les créatures d'une famille particulières selon la [clé] employée, la difficulté étant augmentée de [Magnitude/3]."
  },
  {
    "num": 110,
    "vulgar": "Orientation",
    "latin": "Oriens (Est, Levant)",
    "arcane": "Luxoriens (Lux + oriens)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "✡️: Luxoriensys (élémentaires), ☠️: Luxoriensus (Nécrophages), 🪷: Luxorienseiln (Ogroïdes), 🐗 Faune: Luxoriensorh (Bêtes), 🪷: Luxorienseiln (Draconoïdes), 🩸 Impie: Luxoriensun (Maudits), 🪷: Luxorienseiln (Vermines), 🪷: Luxorienseiln (Chimères), ⚔️: Luxoriensan (Mécaniques), ✡️: Luxoriensys (Esprits), 🪷: Luxorienseiln (Humanoïdes), 🪷: Luxorienseiln (Reliques), 🌿: Luxoriensiln (Plantes)",
    "description": "Génère un enchantement positif qui améliore la perception de la cible lorsqu'il s'agit des créatures d'une famille particulières selon la [clé] employée, la difficulté étant réduite de [Magnitude/3]."
  },
  {
    "num": 111,
    "vulgar": "Rehaussement",
    "latin": "Alto (Élever)",
    "arcane": "Lemale (Lem + male)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "✨ Sacre: Lemaleiel",
    "description": "Génère un enchantement positif qui augmente le minimum des dés lorsqu'il s'agit des jets de [Magnitude/10]."
  },
  {
    "num": 112,
    "vulgar": "Ajustement",
    "latin": "Sursum (En haut)",
    "arcane": "Lirsur (Lir + sur)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "✨ Sacre: Lirsuriel",
    "description": "Génère un enchantement positif qui  augmente le minimum des dés lorsqu'il s'agit des tests de [Magnitude/10], n'affecte que le premier tirage et non les relance via karma, lorsque l'enchantement est lancé le lanceur de sort peux décider d'étendre l'effet à X relances si il réduit la Magnitude de 10 pour chaque X."
  },
  {
    "num": 113,
    "vulgar": "Cicatrisation",
    "latin": "Cico (Je calme)",
    "arcane": "Lyncica (Lyn + cica)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "❤️ Vie: Lyncicair",
    "description": "Génère un enchantement positif qui réduit la gravité des lésions reçues par la cible de [Magnitude/3]."
  },
  {
    "num": 114,
    "vulgar": "Expiration",
    "latin": "Spirare (Souffler)",
    "arcane": "Luxspir (Lux + spir)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "❤️ Vie: Luxspirir",
    "description": "Génère un enchantement positif qui attends la mort de la cible afin de déclencher des soins PV/PS ou lésions selon la cause de la mort, ce qui peut permettre (si suffisant) d'éviter celle ci, le soin est de [Magnitude/3] (affectant toutes les ressources impactées le cas échéant, par example les PV et la lésion si tout deux provoquent la mort) et génère autant de fatigue (une seule fois si de multiples ressources sont soignées)."
  },
  {
    "num": 115,
    "vulgar": "Tempérance",
    "latin": "Tempero (Modérer)",
    "arcane": "Lemtemper (Lem + temper)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "❤️ Vie: Lemtemperir",
    "description": "Génère un enchantement positif qui permet d'ignorer jusqu'à [Magnitude/4] pénalités totales de lésions (blessures et traumas)."
  },
  {
    "num": 116,
    "vulgar": "Prophylaxie",
    "latin": "Custos (Garde)",
    "arcane": "Lircustos (Lir + custos)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "❤️ Vie: Lircustosir",
    "description": "Génère un enchantement positif qui octroie une forte résistance aux toxines, maladies, poisons, etc... la cible reçoit alors un bonus de [Magnitude/3] à ses sauvegardes contre ces menaces ci."
  },
  {
    "num": 117,
    "vulgar": "Expiation",
    "latin": "Pio (Purifier)",
    "arcane": "Lupio (Lu + pio)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "❤️ Vie: Lupioir",
    "description": "Génère un enchantement positif qui permet à la cible d'ignorer jusqu'à [Magnitude/3] points de corruption."
  },
  {
    "num": 118,
    "vulgar": "Préservation",
    "latin": "Servatus (Sauvé)",
    "arcane": "Luxserv (Lux + serv)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "❤️ Vie: Luxservir",
    "description": "Génère un enchantement positif qui permet à la cible d'ignorer jusqu'à [Magnitude/3] points de fatigue."
  },
  {
    "num": 119,
    "vulgar": "Abaissement",
    "latin": "Pondus (Poids)",
    "arcane": "Lempodus (Lem + podus)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "❤️ Vie: Lempodusir (Physique), 🧩 Mental: Lempodusend (Mental)",
    "description": "Génère un enchantement positif qui permet d'ignorer un total de [Magnitude/4] niveaux de gravité issus des lésions (dont la nature dépends de la [clé]), par example si la cible a deux lésions de niveau 2 et que ce sort est lancé avec une magnitude de 10 alors les deux lésions peuvent être ramenées à 1 et n'impliquer qu'une pénalité lié à ce type de lésion de 1."
  },
  {
    "num": 120,
    "vulgar": "Amortissement",
    "latin": "Lanio (Assouplir)",
    "arcane": "Lirlanio (Lir + lanio)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "❤️ Vie: Lirlanioir (Physique), 🧩 Mental: Lirlanioend (Mental)",
    "description": "Génère un enchantement positif qui réduit les dégats et l'impact (dont la nature dépends de la [clé]) reçus par la cible d'autant que le triple de ses pénalités de lésions (dont la nature dépends de la [clé]) pour un maximum de [Magnitude/4], cet effet ne peux pas réduire les dégats de plus de leur moitié."
  },
  {
    "num": 121,
    "vulgar": "Fractionnement",
    "latin": "Frango (Briser)",
    "arcane": "Lufrange (Lu + frange)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🛡️ Guerre: Lufrangeorr (Physique), 🧩 Mental: Lufrangeend (Mental)",
    "description": "Génère un enchantement positif qui divise les dégats (dont la nature dépends de la [clé]) subit d'un tier, pour un maximum [Magnitude/5]."
  },
  {
    "num": 122,
    "vulgar": "Fragilisation",
    "latin": "Fregit (Brisé)",
    "arcane": "Luxfreg (Lux + freg)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🛡️ Guerre: Luxfregor (Physique), 🧩 Mental: Luxfregend (Mental)",
    "description": "Génère un enchantement positif qui augmente les dégats et l'impact (dont la nature dépends de la [clé]) reçus par la cible d'autant que le triple de ses pénalités de lésions (dont la nature dépends de la [clé]) pour un maximum de [Magnitude/4], cet effet ne peux pas augmenter les dégats de plus de leur moitié."
  },
  {
    "num": 123,
    "vulgar": "???",
    "latin": "Veritas (Vérité)",
    "arcane": "Lemveri (Lem + veri)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "☠️ Mort: Lemverius",
    "description": "Génère un enchantement positif qui génère des ressources temporaires lorsqu'une créature meurs dans la même zone que la cible, le gain est de [Magnitude/4] et peux être des PV, des PS, des PC, des PM ou des PE, au choix du lanceur de sort au moment où il lance cet enchantement."
  },
  {
    "num": 124,
    "vulgar": "Captation",
    "latin": "Capio (Prendre)",
    "arcane": "Lircept (Lir + cept)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "☠️ Mort: Lirceptus",
    "description": "Génère un enchantement positif qui génère des ressources temporaires lorsqu'une créature dans la même zone que la cible en perd ou en consomme (si ce ne sont pas des ressources temporaires), l'enchantement vise un type de ressource au choix du lanceur de sort parmi PV, PS, PC ou PE, le gain est de 1 tous les x points ainsi captés (les différentes occurences s'accumulent pour déclancher le gain lorsque le total le permet), x étant de 15 - [Magnitude/5] (minimum 5)."
  },
  {
    "num": 125,
    "vulgar": "Diligence",
    "latin": "Diligo (Aimer, estimer)",
    "arcane": "Ludiligo (Lu + diligo)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🌪️ Air: Ludiligo el",
    "description": "Génère un enchantement qui augmente l'allure de [Magnitude/4]."
  },
  {
    "num": 126,
    "vulgar": "Dégravitation",
    "latin": "Gravis (Lourd)",
    "arcane": "Luxgrav (Lux + grav)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🌪️ Air: Luxgravel",
    "description": "Génère un enchantement positif qui réduit toutes les chutes de la cible de [Magnitude/4] mètres."
  },
  {
    "num": 127,
    "vulgar": "Stabilisation",
    "latin": "Stat (Être debout)",
    "arcane": "Lemstatu (Lem + statu)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🌪️ Air: Lemstatuel",
    "description": "Génère un enchantement positif qui réduit toutes les déplacements forcés de la cible de [Magnitude/4] mètres."
  },
  {
    "num": 128,
    "vulgar": "Extension",
    "latin": "Tendo (Tendre)",
    "arcane": "Lirtendi (Lir + tendi)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🔮 Magie: Lirtendiirn",
    "description": "Génère un enchantement qui augmente la portée des sorts lancé par la cible de [Magnitude/4] mètres si le sort n'a pas de porté, ou multiplie la portée le cas échéant par [1+Magnitude/10]."
  },
  {
    "num": 129,
    "vulgar": "Magnification",
    "latin": "Magnus (Grand)",
    "arcane": "Lynmagno (Lyn + magno)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🔮 Magie: Lynmagnoirn",
    "description": "Génère un enchantement qui augmente la puissance des sorts lancés par la cible de [Magnitude/5], si le lanceur de sort le souhaite il peux conditionner ce bonus à une école ou un domaine précis, le bonus est alors de [Magnitude/4] mais la difficulté et le drain de ce sort sont respectivement augmentés de 2 et 4."
  },
  {
    "num": 130,
    "vulgar": "Focalisation",
    "latin": "Focus (Foyer)",
    "arcane": "Luxfocus (Lux + focus)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🔮 Magie: Luxfocusirn",
    "description": "Génère un enchantement qui permet à la cible de maintenir jusqu'à [Magnitude/4] niveaux de sorts sans pénalités."
  },
  {
    "num": 131,
    "vulgar": "Concentration",
    "latin": "Centrum (Centre)",
    "arcane": "Lemcentr (Lem + centr)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🔮 Magie: Lemcentrirn",
    "description": "Génère un enchantement qui permet à la cible de recevoir un bonus de [Magnitude/3] à ses tests de sauvegardes visant sa concentration envers les sorts."
  },
  {
    "num": 132,
    "vulgar": "Arcanisation",
    "latin": "Arcanum (Secret)",
    "arcane": "Lirarcana (Lir + arcana)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🔮 Magie: Lirarcana irn",
    "description": "Génère un enchantement positif qui octroie aux compétences associées au groupe des arcanes un bonus d'ajustement de [Magnitude/4], l'enchantement peux cibler une compétence uniquement et dans ce cas le bonus est de [Magnitude/3] à la place."
  },
  {
    "num": 133,
    "vulgar": "Résonance",
    "latin": "Sono (Ressonnance)",
    "arcane": "Loksona (Lok + sona)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🔮 Magie: Loksonairn",
    "description": "Génère un enchantement positif qui génère des PM temporaires lorsqu'une créature dans la même zone que la cible en consomme (si ce ne sont pas des PM temporaires), le gain est de 1 tous les 3 points ainsi captés, avec un gain de PM temporaire maximum par occurence de [Magnitude/3]."
  },
  {
    "num": 134,
    "vulgar": "Accumulation",
    "latin": "Cumulo (Amasser)",
    "arcane": "Luxcumul (Lux + cumul)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🌀 Chaos: Luxcumulix",
    "description": "Génère un enchantement positif qui génère des PK temporaires lorsqu'une créature dans la même zone que la cible en consomme (si ce ne sont pas des PK temporaires), le gain est de 1 tous les x points ainsi captés (les différentes occurences s'accumulent pour déclancher le gain lorsque le total le permet), x étant de 15 - [Magnitude/5] (minimum 5)."
  },
  {
    "num": 135,
    "vulgar": "Fidélisation",
    "latin": "Fides (Foi)",
    "arcane": "Lemfides (Lem + fides)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "✡️ Arcane: Lemfidesys",
    "description": "Génère un enchantement positif qui protège les autres enchantements actifs sur la cible, ces derniers ne pouvant être ciblés tant que celui ci est actif."
  },
  {
    "num": 136,
    "vulgar": "Vascularisation",
    "latin": "Vas (Vaisseau)",
    "arcane": "Lirvascu (Lir + vascu)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "selon",
    "description": "Génère un enchantement positif qui permet d'ignorer jusqu'à [Magnitude/2] PV négatifs (évitant ainsi d'être mis hors de combat)."
  },
  {
    "num": 137,
    "vulgar": "Prolongation",
    "latin": "Longus (Long)",
    "arcane": "Lulong (Lu + long)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "❤️ Vie: Lulongir",
    "description": "Génère un enchantement positif qui permet de repousser le moment de la mort dû aux PV négatifs de [Magnitude]."
  },
  {
    "num": 138,
    "vulgar": "Innervation",
    "latin": "Nervus (Nerf)",
    "arcane": "Luxnervo (Lux + nervo)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🪷 Nature: Luxnervoeiln",
    "description": "Génère un enchantement positif qui permet d'ignorer jusqu'à [Magnitude/2] PE négatifs (évitant ainsi d'être mis en état de choc)."
  },
  {
    "num": 139,
    "vulgar": "Gloire",
    "latin": "Gloria (Gloire)",
    "arcane": "Lemglor (Lem + glor)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "❤️ Vie: Lemglorir",
    "description": "Génère un enchantement positif qui permet de repousser le moment de l'inscience dû aux PE négatifs de [Magnitude]."
  },
  {
    "num": 140,
    "vulgar": "Eternel",
    "latin": "Aeternus (Éternel)",
    "arcane": "Liretros (Lir + etros)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚖️ Loi: Liretros em",
    "description": "Génère un enchantement positif qui améliore les actions contre une cible (unique) d'une famille particulières au choix du lanceur de sort, prend la forme d'un bonus d'ajustement de [Magnitude/7]."
  },
  {
    "num": 141,
    "vulgar": "Recalibration",
    "latin": "Libra (Équilibre)",
    "arcane": "Luxliber (Lux + liber)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🌀 Chaos: Luxliberix",
    "description": "Génère un enchantement positif qui permet à la cible de relancer un dé issus d'un jet ou d'un test, chaque occurence provoque une décharge de l'enchantement (+2 si le dé est issus d'un test), limité à une relance par dés du même jet / test."
  },
  {
    "num": 142,
    "vulgar": "Modération",
    "latin": "Modus (Mesure)",
    "arcane": "Lemmodo (Lem + modo)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "✨ Sacre: Lemmodoiel",
    "description": "Génère un enchantement positif qui permet de réduire la perte de PV ou PS de moitié pour toute perte appliquée en deça de la moitié du maximum, la réduction est de 2/3 pour toute perte appliquée en deça du négatif, avec pour réduction maximum respective de [Magnitude/3] et [Magnitude/2]."
  },
  {
    "num": 143,
    "vulgar": "Adoration",
    "latin": "Oro (Prier)",
    "arcane": "Liroro (Lir + oro)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "✨ Sacre: Liroroiel",
    "description": "Génère un enchantement positif qui se décharge de 1 pour chaque dégats que devrait subir la cible et qui devrait lui faire baisser les PV ou PS en deça de 0, ne fonctionne que si un allié est à proximité."
  },
  {
    "num": 144,
    "vulgar": "Vivification",
    "latin": "Vita (Vie)",
    "arcane": "Lokvita (Lok + vita)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "💢 Vide: Lokvitaarh",
    "description": "Génère un enchantement positif qui augmente la vitesse de la cible de [Magnitude/4]."
  },
  {
    "num": 145,
    "vulgar": "Promptification",
    "latin": "Promptus (Prompt)",
    "arcane": "Luxpromp (Lux + promp)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "💢 Vide: Luxpromparh",
    "description": "Génère un enchantement positif qui augmente la rapidité de la cible de [Magnitude/4]."
  },
  {
    "num": 146,
    "vulgar": "Prévénation",
    "latin": "Praevenio",
    "arcane": "Luxvenio (Lux + venio)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "💢 Vide",
    "description": "Génère un enchantement positif qui augmente l'initiative de la cible de [Magnitude/4], n'affecte pas la vitesse et rapidité."
  },
  {
    "num": 147,
    "vulgar": "Prééminence",
    "latin": "Eminens (Eminent)",
    "arcane": "Lememin (Lem + emin)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🌪️ Air: Lememinel",
    "description": "Génère un enchantement positif qui octroie un ajustement de [Magnitude/5] aux tests d'initiative (ne s'applique donc pas à l'initiative actuelle)."
  },
  {
    "num": 148,
    "vulgar": "Surexécution",
    "latin": "Exsequor (Exécuter)",
    "arcane": "Lirsequor (Lir + sequor)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "💢 Vide: Lirsequor arh",
    "description": "Génère un enchantement positif qui permet à la cible de réaliser une ACTS ou ACTR ou ACTL supplémentaire par round, chaque usage provoque une décharge de l'enchantement (+2 s'il s'agit d'une ACTS ou ACTR)."
  },
  {
    "num": 149,
    "vulgar": "Liberation",
    "latin": "Solve (Délier)",
    "arcane": "Lusolve (Lu + solve)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🌪️ Air: Lusolve el",
    "description": "Génère un enchantement positif qui assure à la cible un déplacement unique disposant d'un minimum de [Magnitude/5] cases/mètre, ignorant toutes formes de contraintes le cas échéant (terrains difficiles, faible aLure, entraves, etc)."
  },
  {
    "num": 150,
    "vulgar": "Vampirisation",
    "latin": "Haustus (Action de boire)",
    "arcane": "Luxhaust (Lux + haust)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🩸 Impie: Luxhaustun",
    "description": "Génère un enchantement positif qui génère des PV temporaires lorsqu'une créature est attaquée physiquement par la cible, le gain est de 1 tous les x points ainsi captés (les différentes occurences s'accumulent pour déclancher le gain lorsque le total le permet), x étant de 12 - [Magnitude/5] (minimum 3)."
  },
  {
    "num": 151,
    "vulgar": "Exacerbation",
    "latin": "Acerbus (Acre, amer)",
    "arcane": "Lemacerb (Lem + acerb)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🛡️ Guerre: Lemacerborr",
    "description": "Génère un enchantement positif qui augmente les dégats des actions d'attaque par menées la cible de [Magnitude/6]."
  },
  {
    "num": 152,
    "vulgar": "Domination",
    "latin": "Dominus (Maître)",
    "arcane": "Lirdomin (Lir + domin)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🛡️ Guerre: Lirdominorr",
    "description": "Génère un enchantement positif qui augmente l'impact des actions tactique menées par la cible de [Magnitude/6]."
  },
  {
    "num": 153,
    "vulgar": "Déflexion",
    "latin": "Flecto (Courber)",
    "arcane": "Luflect (Lu + flect)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🛡️ Guerre: Luflectorr",
    "description": "Génère un enchantement positif qui augmente la déviation des actions de défense menées par la cible [Magnitude/6]."
  },
  {
    "num": 154,
    "vulgar": "Vigilance",
    "latin": "Vigilo (Veiller)",
    "arcane": "Luxvigil (Lux + vigil)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚜️ Charme: Luxvigilynh",
    "description": "Génère un enchantement positif qui permet de se défendre des actions même si pris au dépourvus (endurance et défenses acceptées) tant que la [5+Magnitude/2] dépasse le test de l'action d'agression, de plus permet d'ignorer les actions d'opportunités qui ne dépasse pas ce même seuil."
  },
  {
    "num": 155,
    "vulgar": "Evolution",
    "latin": "Volo (Rouler)",
    "arcane": "Lemvolvo (Lem + volvo)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🐗 Faune: Lemvolvoorh",
    "description": "Génère un enchantement positif qui octroie à la cible non humanoïde les bénéfices de sa version \"primale\", soit [Magnitude/10] à tous ses attributs (sans distinctions, attributs secondaires inclus), la bête n'écoute alors plus que son coeur et ne peux plus être controlée tant que l'enchantement perdure."
  },
  {
    "num": 156,
    "vulgar": "Ballistification",
    "latin": "Ballo (Lancer, grec)",
    "arcane": "Lirballo (Lir + ballo)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🛡️ Guerre: Lirballoorr",
    "description": "Génère un enchantement positif qui augmente la distance de tir et de jet de la cible de [Magnitude/20] fois (soit 5% par magnitude)."
  },
  {
    "num": 157,
    "vulgar": "Munition",
    "latin": "Munio (Fortifier)",
    "arcane": "Lumuni (Lu + muni)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚔️ Acier: Lumunian",
    "description": "Génère un enchantement positif qui permet d'utiliser des projectiles magiques à la place de projectiles conventionnels (flèches, caReaux, munitions), à chaque occurence la cible peux décider si le projectile est normal ou boosté, si c'est un projectile boosté l'enchantement subit une décharge et le projectile en question reçoit un bonus de [Magnitude]."
  },
  {
    "num": 158,
    "vulgar": "Gigantification",
    "latin": "Gigant (Grec)",
    "arcane": "Luxgigan (Lux + gigan)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚕️ Corps: Luxgigaen",
    "description": "Génère un enchantement positif qui augmente la stature ou la taille de [Magnitude/4]."
  },
  {
    "num": 159,
    "vulgar": "Majestuatisation",
    "latin": "Maiestas (Majesté)",
    "arcane": "Lemmajes (Lem + majes)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🧠 Esprit: Lemmajesys",
    "description": "Génère un enchantement positif qui augmente l'ego ou l'apparence de [Magnitude/4]."
  },
  {
    "num": 160,
    "vulgar": "Apnéisation",
    "latin": "Spirare (Souffler)",
    "arcane": "Liraspir (Lir + aspir)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🌪️ Air: Liraspi rel, 💧 Eau: Liraspi ryn",
    "description": "Génère un enchantement qui permet à la cible de se passer du besoin de respirer, selon la [clé] utilisée cet effet ne fonctionne qu'en dehors de l'eau (air) ou que dans l'eau (eau)."
  },
  {
    "num": 161,
    "vulgar": "Thermorégulation",
    "latin": "Thermos (Chaud, grec)",
    "arcane": "Lutherm (Lu + therm)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🔥 Feu: Luthermar, ❄️ Glace: Luthermis",
    "description": "Génère un enchantement qui immunise à la chaleur et au froid en terme de températures, techniquement l'enchantement ajuste la température ressentis de l'air de [Magnitude/2] degrés pour atteindre la température idéale pour la cible (22 pour un homme moyen), s'il est nécessaire il est possible d'interpréter les effets de cet enchantement comme un bonus de [Magnitude/3] visant à se défendre de ce type de menace ou d'effets qui en serait la conséquence (attraper la crève, etc)."
  },
  {
    "num": 162,
    "vulgar": "Désensibilisation",
    "latin": "Sensus (Sens)",
    "arcane": "Luxsensi (Lux + sensi)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚖️ Loi: Luxsensiem",
    "description": "Génère un enchantement qui réduit drastiquement l'impact des faiblesses sur la cible, ces dernières offrant un bonus réduit de [Magnitude/3], le bonus peux être réduit à 0 (et donc la faiblesse ne fait plus d'effets notables) mais ne peux amener à une réduction à la place."
  },
  {
    "num": 163,
    "vulgar": "Perpétuation",
    "latin": "Perpetuus (Permanent)",
    "arcane": "Lempetu (Lem + petu)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "❤️ Vie: Lempetuir",
    "description": "Génère un enchantement positif qui retarde le moment de la mort définitive de la cible tant que la cause est une perte de ressource dont l'excés est limité à [Magnitude/2], ou si elle est lié à une lésion et dont la gravité ajusté à la baisse de [Magnitude/3] permet la survie, ou pour d'autres causes avec des conditions similaires/approchantes (le niveau du sort devrait avoir un impact et devrait avoir un intéret selon la gravité de la situation mais cela peux être une information choisit librement par le MJ le cas échéant), retiens également l'âme de son départ, cependant la cible reste inconsciente et ne peux donc agir de quelque façon que ce soit."
  },
  {
    "num": 164,
    "vulgar": "Rafraîchissement",
    "latin": "Frigus (Froid)",
    "arcane": "Lirfrige (Lir + frige)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🪷 Nature: Lirfrigeiln",
    "description": "Génère un enchantement positif qui réduit les pénalités liés à la fatigue de [Magnitude/5]."
  },
  {
    "num": 165,
    "vulgar": "Rectification",
    "latin": "Rectus (Droit)",
    "arcane": "Lynrect (Lyn + rect)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🌀 Chaos: Lynrectix",
    "description": "Génère un enchantement positif qui permet à la cible de relancer (l'ensemble d')un test affichant une maladresse, chaque occurence provoque une décharge de l'enchantement."
  },
  {
    "num": 166,
    "vulgar": "Paix",
    "latin": "Pax (Paix)",
    "arcane": "Luspax (Lux + pax)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🌑 Ombre: Luspaxoth",
    "description": "Génère un enchantement qui rend la cible plus difficile à dicerner avec précision, ses défenses passives sont augmentées de [Magnitude/7], ou sont de minimum [15+Magnitude/5] (ce minimum n'est pas affecté par l'état de la cible)."
  },
  {
    "num": 167,
    "vulgar": "Obfuscation",
    "latin": "Fusco (Noircir)",
    "arcane": "Lemfusco (Lem + fusco)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🌑 Ombre: Lemfuscoth",
    "description": "Créer un enchantement positif qui augmente la capacité de la cible à se couvrir via des obstacles, le % de couverture est doublé, avec pour maximum un gain de [Magnitude]."
  },
  {
    "num": 168,
    "vulgar": "Apaisement",
    "latin": "Paco (Pacifier)",
    "arcane": "Lirpaco (Lir + paco)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚜️ Charme: Lirpacoynh",
    "description": "Génère un enchantement positif qui protège la cible des émotions négatives, offre un bonus pour y résister de [Magnitude/3]."
  },
  {
    "num": 169,
    "vulgar": "Pétalisation",
    "latin": "Petalos (Pétale, grec)",
    "arcane": "Lupetal (Lu + petal)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🌿 Flore: Lupetaliln",
    "description": "Génère un enchantement qui octroie un bonus d'ajustement à tous les tests effectés équivalant au niveau de pétale actuel, les pétales sont de 0 puis augmente de [Magnitude] à la fin du chaque tour, le niveau de pétale est équivalant aux pétales actuels divisés par 10. Les bonus d'ajustement ne peuvent dépasser [Magnitude/5] de la sorte."
  },
  {
    "num": 170,
    "vulgar": "Rétribution",
    "latin": "Tribu (Donner)",
    "arcane": "Luxtribu (Lux + tribu)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "✨ Sacre: Luxtribuiel",
    "description": "Génère un enchantement positif qui provoque une perte de PE équivalant à 1/3 des dégats que la cible reçoit à ceux qui les lui inflige, maximum [Magnitude/4]."
  },
  {
    "num": 171,
    "vulgar": "Grâce",
    "latin": "Gratia (Grâce)",
    "arcane": "Lemgrat (Lem + grat)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🌀 Chaos: Lemgratix",
    "description": "Génère un enchantement positif qui permet à la cible d'utiliser sa sauvegarde de fortune lorsque celle ci est supérieure à une autre sauvegarde dont il fait l'objet."
  },
  {
    "num": 172,
    "vulgar": "Synergisation",
    "latin": "Syn (Ensemble, grec)",
    "arcane": "Lirsiner (Lir + siner)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "✨ Sacre: Lirsineriel",
    "description": "Génère un enchantement positif qui accorde à la cible un gain de ressource équivalant à 1/4 de ce que les alliés dans la zone perçoivent, maximum [Magnitude/5], si le lanceur de sort précise une ressource unique alors l'effet est de 1/3 et a pour maximum [Magnitude/3]."
  },
  {
    "num": 173,
    "vulgar": "Démasquage",
    "latin": "Larva (Masque)",
    "arcane": "Luxlarva (Lux + larva)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚖️ Loi: Luxlarvatem",
    "description": "Génère un enchantement qui réduit la faculté à mentir, falcifier, se déguiser ou autre manipulation de la vérité, la difficulté visant à percevoir la vérité étant réduite de [Magnitude/5]."
  },
  {
    "num": 174,
    "vulgar": "Subterfuge",
    "latin": "Fugio (S'enfuir)",
    "arcane": "Lemfugi (Lem + fugi)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🌀 Chaos: Lemfugiix",
    "description": "Génère un enchantement qui améliore la faculté à mentir, falcifier, se déguiser ou autre manipulation de la vérité, la difficulté visant à percevoir la vérité étant augmenté de [Magnitude/5]."
  },
  {
    "num": 175,
    "vulgar": "Liberté",
    "latin": "Libero (Libérer)",
    "arcane": "Luxliber (Lux + liber)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🌀 Chaos",
    "description": "Génère un enchantement positif qui octroie un bonus de [Magnitude/3] à tous les tests visant à se soustraire à une forme de contrôle/privation de liberté (qu'il s'agisse d'un test de compétence ou de sauvegarde)."
  },
  {
    "num": 176,
    "vulgar": "Démoralisation",
    "latin": "Demoralis (de demoralizare)",
    "arcane": "Ludemoral (Lu + demoral, ou Lemdemoral)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚜️ Charme",
    "description": "détruit le moral."
  },
  {
    "num": 177,
    "vulgar": "Bestialisation",
    "latin": "Bestialis (Bestial)",
    "arcane": "Lembestia (Lem + bestia)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🐗 Faune: Lembestiarh (FOR, CON, DEX, AGI, PER, CHA, VOL, INT, RUS, SAG)",
    "description": "Génère un enchantement positif qui augmente un attribut (définit à la création du sort selon la [clé]) de [Magnitude/4], si l'attribut est physique alors tous les attributs mentaux sont réduits de 4 et inversement."
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
