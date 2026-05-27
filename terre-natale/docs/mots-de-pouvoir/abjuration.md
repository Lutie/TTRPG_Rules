# École d'Abjuration

<div id="mpv-app">

<div class="mpv-filters">
  <input type="text" id="mpv-search" placeholder="Rechercher (nom, latin, arcanique, description…)" />
  <select id="mpv-type">
    <option value="">Tous les types</option>
    <option value="Barrière">Barrière</option>
<option value="Interruption">Interruption</option>
<option value="Pouvoir">Pouvoir</option>
  </select>
  <select id="mpv-target">
    <option value="">Toutes les cibles</option>
    <option value="Cible">Cible</option>
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
    "vulgar": "Imprégnation",
    "latin": "Imbueo (Imprégner)",
    "arcane": "Borimbue (Bor + imbue)",
    "word_type": "Interruption",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🔮 Magie: Borimbueirn",
    "description": "Génère un effet qui augmente la difficulté arcanique d'un autre sort en cours de lancement de [Magnitude/5]."
  },
  {
    "num": 2,
    "vulgar": "Déviation",
    "latin": "Deverto (Détourner)",
    "arcane": "Brivert (Bri + vert)",
    "word_type": "Interruption",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🛡️ Guerre: Brivertorr, 🧩 Mental: Brivertend, 🔮 Magie: Briverteirn",
    "description": "Génère un effet qui génère [Magnitude] de la déviation physique ou mentale chez la cible lorsqu'elle est la cible d'une attaque ou tactique physique ou mentale (selon la clé), la clé de magie permet donc de générer de la déviation à l'égard de toute forme de magie."
  },
  {
    "num": 3,
    "vulgar": "Réduction",
    "latin": "Minuo (Diminuer)",
    "arcane": "Basminu (Bas + minu)",
    "word_type": "Interruption",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "✡️ Arcane: Basminuys",
    "description": "Génère un effet qui réduit la magnitude de [Magnitude] le niveau du sort qui affecte la cible."
  },
  {
    "num": 4,
    "vulgar": "Désenchantement",
    "latin": "Fallo (Tromper)",
    "arcane": "Brenfallo (Bren + fallo)",
    "word_type": "Pouvoir",
    "target_type": "Lieu/Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🪷 Nature: Brenfalloeiln",
    "description": "Génère un effet qui provoque une décharge de [Magnitude/2] à tous les enchantements affectant la cible (lieu ou cible)."
  },
  {
    "num": 5,
    "vulgar": "Suppression",
    "latin": "Premo (Presser, supprimer)",
    "arcane": "Barpremo (Bar + premo)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "✡️ Arcane: Barpremoys",
    "description": "Génère un effet qui provoque une décharge de [Magnitude] à un enchantement ciblé."
  },
  {
    "num": 6,
    "vulgar": "Corruption",
    "latin": "Vitio (Corrompre)",
    "arcane": "Borviti (Bor + viti)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "☢️ Toxique: Borvitiex",
    "description": "Génère un effet qui retire jusqu'à [Magnitude/2] charges à un enchantement positif ciblé, la cible contracte à la place une condition négative (issus du répertoire d'un des domaines naturels : Nature, toxique ou bois), la cible peux réaliser un test de sauvegarde concernant cette condition."
  },
  {
    "num": 7,
    "vulgar": "Convertion",
    "latin": "Muto (Changer)",
    "arcane": "Basmutatio (Bas + mutatio)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🪷 Nature: Basmutatioeiln",
    "description": "Génère un effet qui retire jusqu'à [Magnitude/2] charges à un enchantement négatif ciblé, la cible contracte à la place une condition positif (issus du répertoire d'un des domaines naturels : Nature, toxique ou bois)."
  },
  {
    "num": 8,
    "vulgar": "Confiscation",
    "latin": "Confisco (Confisquer)",
    "arcane": "Brinfisc (Bri + fisc)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🔮 Magie: Brinfisceirn",
    "description": "Génère un effet qui octroie le contrôle de l'enchantement ciblé si ce dernier a une charge restante inférieure à [Magnitude], prendre le contrôle d'un enchantement n'y met pas fin ou ne permet pas de le déplacer, cependant une invocation considère les ordres de ce nouveau maitre à la place par example (voir les règles des Arcanes)."
  },
  {
    "num": 9,
    "vulgar": "Délocalisation",
    "latin": "Locus (Lieu)",
    "arcane": "Barlocus (Bar + locus)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🔮 Magie: Barlocuseirn",
    "description": "Génère un effet qui permet de déplacer l'enchantement de cible (qui doit rester une cible valide au regard du sort à son origine) si ce dernier a une charge restante inférieure à [Magnitude], déplacer le contrôle d'un enchantement n'en donne pas le contrôle, on ne peux déplacer un enchantement d'invocation (voir les règles des Arcanes)."
  },
  {
    "num": 10,
    "vulgar": "Annulation",
    "latin": "Casso (Détruire, annuler)",
    "arcane": "Belcasso (Bel + casso)",
    "word_type": "Interruption",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚜️ Charme: Belcassoynh",
    "description": "Génère un effet qui annule l'action à venir de la cible cette dernière a moins de [Magnitude] en endurance actuelle, un test de sauvegarde de détermination peux permettre de réduire les effets, l'action entreprise est perdue si annulée."
  },
  {
    "num": 11,
    "vulgar": "Rétroaction",
    "latin": "Ago (Agir)",
    "arcane": "Basago (Bas + ago)",
    "word_type": "Interruption",
    "target_type": "Cible",
    "difficulty": "4",
    "drain": "4",
    "keys": "⚜️ Charme: Basagoynh",
    "description": "Génère un effet qui retourne l'action à venir de la cible contre elle même à moins qu'elle ne dispose de [Magnitude/2] en endurance actuelle, un test de sauvegarde de détermination peux permettre de réduire les effets."
  },
  {
    "num": 12,
    "vulgar": "Protection",
    "latin": "Tego (Protéger, couvrir)",
    "arcane": "Brentu (Bren + tu)",
    "word_type": "Barrière",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "✡️ Arcane: Brentuys",
    "description": "Génère un enchantement neutre de type barrière physique pouvant absorber jusqu'à [Magnitude] dégats (attention car les barrières s'appliquent avant la réduction de dégats et autre ressors défensif des cibles)."
  },
  {
    "num": 13,
    "vulgar": "Préservation",
    "latin": "Servo (Sauver, garder)",
    "arcane": "Borserv (Bor + serv)",
    "word_type": "Barrière",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "✡️ Arcane: Borservys",
    "description": "Génère un enchantement neutre de type barrière mentale pouvant absorber jusqu'à [Magnitude] dégats (attention car les barrières s'appliquent avant la réduction de dégats et autre ressors défensif des cibles)."
  },
  {
    "num": 14,
    "vulgar": "Absorption",
    "latin": "Sorbeo (Boire, aspirer)",
    "arcane": "Belsorb (Bel + sorb)",
    "word_type": "Barrière",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "✡️ Arcane: Belsorbys",
    "description": "Génère un enchantement neutre de type barrière magique pouvant absorber jusqu'à [Magnitude] de dégats (attention car les barrières s'appliquent avant la réduction de dégats et autre ressors défensif des cibles)."
  },
  {
    "num": 15,
    "vulgar": "Entravation",
    "latin": "Impedio (Empêcher)",
    "arcane": "Baspedio (Bas + pedio)",
    "word_type": "Barrière",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "✡️ Arcane: Baspedioys",
    "description": "Génère un enchantement neutre de type barrière mixte pouvant absorber jusqu'à [Magnitude/2] dégats ou impact (attention car les barrières s'appliquent avant la réduction de dégats et autre ressors défensif des cibles)."
  },
  {
    "num": 16,
    "vulgar": "Isolation",
    "latin": "Solus (Seul)",
    "arcane": "Brenisol (Bren + isol)",
    "word_type": "Barrière",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "✡️ Arcane: Brenisolys",
    "description": "Génère un enchantement neutre de type barrière mixte pouvant absorber jusqu'à [Magnitude] d'impacts (des tactiques)."
  },
  {
    "num": 17,
    "vulgar": "Prévention",
    "latin": "Caveo (Prendre garde)",
    "arcane": "Borsus (Bor + cave)",
    "word_type": "Barrière",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "✡️ Arcane: Borsusys",
    "description": "Génère un enchantement neutre de type barrière mixte pouvant absorber jusqu'à [Magnitude] de charges (de conditions)."
  },
  {
    "num": 18,
    "vulgar": "Extinction",
    "latin": "Tingo (Éteindre)",
    "arcane": "Beltinto (Bel + tinto)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "✡️ Arcane: Beltintoys",
    "description": "Génère un effet neutralisant jusqu'à [Magnitude x2] charge de toutes les formes de barrières affectant la cible."
  },
  {
    "num": 19,
    "vulgar": "Restriction",
    "latin": "Stringo (ResseRer)",
    "arcane": "Basstrin (Bas + strin)",
    "word_type": "Pouvoir",
    "target_type": "Lieu/Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "✡️ Arcane: Basstrinys",
    "description": "Génère un effet qui génère une pénalité de [Magnitude/5] à toutes les actions d'un type (choisit au lancement du sort) qui vise la cible (lieu ou cible)."
  },
  {
    "num": 20,
    "vulgar": "Interdiction",
    "latin": "Veto (J'interdis)",
    "arcane": "Brenveto (Bren + veto)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚖️ Loi: Brenvetoem",
    "description": "Génère un enchantement positif qui interdit les autres de réaliser une action (définit au moment où le sort est lancé) sur la cible, ceux qui cherche à faire cette action malgré peuvent réaliser un test de sauvegarde (détermination) pour outrepasser cette interdiction : sur une réussite elle le peux mais avec un désavantage, sur un échec elle ne le peux pas, sur un échec critique elle perd son action en prime, sur une réussite critique elle le peux sans désavantage, à chaque fois que la cible réaliser un test de sauvegarde l'enchantement subit une décharge."
  },
  {
    "num": 21,
    "vulgar": "Contradiction",
    "latin": "Contra (Contre)",
    "arcane": "Bricontra (Bri + contra)",
    "word_type": "Interruption",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "✡️ Arcane: Bricontrays",
    "description": "Contrecarre le sort ciblé dont le niveau est égal ou inférieur à [Magnitude/5], les ressources engagées sont perdues."
  },
  {
    "num": 22,
    "vulgar": "Inhibition",
    "latin": "Habeo (Tenir)",
    "arcane": "Belhabe (Bel + habe)",
    "word_type": "Interruption",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "✡️ Arcane: Belhabeys",
    "description": "Contrecarre le pouvoir surnaturel (dons etc) ciblé dont la valeurs (chi dépensés, etc) est égal ou inférieur à [Magnitude/5], les ressources engagées sont perdues."
  },
  {
    "num": 23,
    "vulgar": "Opposition",
    "latin": "Pono (Placer)",
    "arcane": "Basoppo (Bas + oppo)",
    "word_type": "Interruption",
    "target_type": "Cible",
    "difficulty": "0",
    "drain": "0",
    "keys": "✡️ Arcane: Basoppoys",
    "description": "Contrecarre le sort ciblé à moins que le lanceur de sort ne dépense [Magnitude] PM (temporaires ou non), le lanceur de sort doit dépenser les PM qu'il puisse ou non dépasser cette valeur."
  },
  {
    "num": 24,
    "vulgar": "Contestation",
    "latin": "Testor (Témoigner)",
    "arcane": "Brentes (Bren + tes)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚖️ Loi: Brentesem",
    "description": "Génère un enchantement négatif qui empêche la cible de lancer un sort d'un domaine ou d'une école (au choix lors du lancement du sort), ceux qui cherche à faire cette action malgré tout peuvent réaliser un test de sauvegarde (détermination) pour outrepasser cette interdiction : sur une réussite elle le peux mais avec un désavantage, sur un échec elle ne le peux pas, sur un échec critique elle perd son action en prime, sur une réussite critique elle le peux sans désavantage."
  },
  {
    "num": 25,
    "vulgar": "Extraction",
    "latin": "Extraho (Tirer hors de)",
    "arcane": "Barextra (Bar + extra)",
    "word_type": "Interruption",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "✡️ Arcane: Barextrays",
    "description": "Génère un effet qui téléporte (sans collisions donc) la cible d'un point A à B distant d'au mieux [Magnitude/4] de distance, ce sort ne peux affecter que soi ou un allié, le lanceur de sort doit pouvoir être mesure de voir le point d'arrivé et être la cible ou de voir la cible."
  },
  {
    "num": 26,
    "vulgar": "Proscription",
    "latin": "???",
    "arcane": "???",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚖️ Loi: Borarceoem",
    "description": "Génère un enchantement négatif qui interdit les autres de réaliser une action (définit au moment où le sort est lancé) sur la cible, ceux qui cherche à faire cette action malgré peuvent réaliser un test de sauvegarde (détermination) pour outrepasser cette interdiction : sur une réussite elle le peux mais avec un désavantage, sur un échec elle ne le peux pas, sur un échec critique elle perd son action en prime, sur une réussite critique elle le peux sans désavantage, à chaque fois que la cible réaliser un test de sauvegarde l'enchantement subit une décharge."
  },
  {
    "num": 27,
    "vulgar": "Obstruction",
    "latin": "Obstruo (Boucher)",
    "arcane": "Basobstru (Bas + obstru)",
    "word_type": "Interruption",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🔥 Feu: Basobstruar, ❄️ Glace: Basobstruis, ⚡ Foudre: Basobstruor, 🪨 Terre: Basobstruum, 💧 Eau: Basobstruyn, 🌪️ Air: Basobstruel, ☀️ Lumière: Basobstruion, 🌑 Ombre: Basobstruoth, ⚖️ Loi: Basobstruem, 🌀 Chaos: Basobstruix, ✨ Sacre: Basobstruiel, 🩸 Impie: Basobstruun, ❤️ Vie: Basobstruir, ☠️ Mort: Basobstruus, ⚕️ Corps: Basobstruen, 🧠 Esprit: Basobstruys, 🐗 Faune: Basobstruorh, 🌿 Flore: Basobstruiln, 🧩 Mental: Basobstruend, ⚜️ Charme: Basobstruynh, ✡️ Arcane: Basobstruys, 🔮 Magie: Basobstruirn, 🪷 Nature: Basobstrueiln, ☢️ Toxique: Basobstruex, 🎭 Illusion: Basobstruin, 📚 Savoir: Basobstruaum, 👁️ Vision: Basobstrueth, ⚔️ Acier: Basobstruan, 🛡️ Guerre: Basobstruorr, 💢 Vide: Basobstruarh",
    "description": "Génère un effet qui octroie à la cible une résistance très marquée contre un élément donné, cela se traduit par une augmentation de [Magnitude/2] en absorption, [Magnitude/4] de protection, [Magnitude/4] de résistance et [Magnitude/3] de bonus aux sauvegardes, cet effet ne s'applique pour un effet/une action."
  },
  {
    "num": 28,
    "vulgar": "Protestation",
    "latin": "Testor (Témoigner)",
    "arcane": "Barenteste (Bren + teste)",
    "word_type": "Interruption",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🔥 Feu: Barentestear, ❄️ Glace: Barentesteis, ⚡ Foudre: Barentesteor, 🪨 Terre: Barentesteum, 💧 Eau: Barenteste yn, 🌪️ Air: Barentesteel, ☀️ Lumière: Barentesteion, 🌑 Ombre: Barentesteoth, ⚖️ Loi: Barentesteem, 🌀 Chaos: Barentesteix, ✨ Sacre: Barentesteiel, 🩸 Impie: Barentesteun, ❤️ Vie: Barentesteir, ☠️ Mort: Barentesteus, ⚕️ Corps: Barentesteen, 🧠 Esprit: Barentesteys, 🐗 Faune: Barentesteorh, 🌿 Flore: Barentesteiln, 🧩 Mental: Barentesteend, ⚜️ Charme: Barentesteynh, ✡️ Arcane: Barentesteys, 🔮 Magie: Barentesteirn, 🪷 Nature: Barentesteiln, ☢️ Toxique: Barentesteex, 🎭 Illusion: Barentestein, 📚 Savoir: Barentesteaum, 👁️ Vision: Barentesteeth, ⚔️ Acier: Barentestean, 🛡️ Guerre: Barentesteorr, 💢 Vide: Barentestearh",
    "description": "Contrecarre le sort ciblé, dont le domaine est nécessairement celui opposé à la clé, dont le niveau est égal ou inférieur à [Magnitude/4], les ressources engagées sont perdues, de plus la cible subit autant de dégats temporairs (jusqu'à un maximum de [Magnitude/2]."
  },
  {
    "num": 29,
    "vulgar": "Neutralisation",
    "latin": "Neuter (Ni l'un ni l'autre)",
    "arcane": "Barneute (Bar + neute)",
    "word_type": "Interruption",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🔥 Feu: Barneutear, ❄️ Glace: Barneuteis, ⚡ Foudre: Barneuteor, 🪨 Terre: Barneuteum, 💧 Eau: Barneute yn, 🌪️ Air: Barneuteel, ☀️ Lumière: Barneuteion, 🌑 Ombre: Barneuteoth, ⚖️ Loi: Barneuteem, 🌀 Chaos: Barneuteix, ✨ Sacre: Barneuteiel, 🩸 Impie: Barneuteun, ❤️ Vie: Barneuteir, ☠️ Mort: Barneuteus, ⚕️ Corps: Barneuteen, 🧠 Esprit: Barneuteys, 🐗 Faune: Barneuteorh, 🌿 Flore: Barneuteiln, 🧩 Mental: Barneuteend, ⚜️ Charme: Barneuteynh, ✡️ Arcane: Barneuteys, 🔮 Magie: Barneuteirn, 🪷 Nature: Barneuteiln, ☢️ Toxique: Barneuteex, 🎭 Illusion: Barneutein, 📚 Savoir: Barneuteaum, 👁️ Vision: Barneuteeth, ⚔️ Acier: Barneutean, 🛡️ Guerre: Barneuteorr, 💢 Vide: Barneute arh",
    "description": "Contrecarre le sort ciblé, dont le domaine est nécessairement celui de la clé, dont le niveau est égal ou inférieur à [Magnitude/4], les ressources engagées sont perdues, de plus le lanceur de sort reçoit du mana temporaire à la même hauteur (jusqu'à un maximum de [Magnitude/2])."
  },
  {
    "num": 30,
    "vulgar": "Réprobation",
    "latin": "Reproba (Désapprouver)",
    "arcane": "Bripoba (Bri + proba)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "✡️ Arcane: Bripobays",
    "description": "Génère un enchantement négatif qui interdit les autres de réaliser une action (définit au moment où le sort est lancé) sur la cible, ceux qui cherche à faire cette action malgré peuvent s'acquitter d'une attrition de [Magnitude/2]."
  },
  {
    "num": 31,
    "vulgar": "Déflexion",
    "latin": "Flecto (Courber)",
    "arcane": "Basfleto (Bas + fleto)",
    "word_type": "Interruption",
    "target_type": "Soi",
    "difficulty": "2",
    "drain": "2",
    "keys": "🌪️ Air: Basfletoel",
    "description": "Génère un effet qui génère [Magnitude] de la déviation chez la cible lorsqu'elle est la cible d'une attaque à distance (peu importe la forme)."
  },
  {
    "num": 32,
    "vulgar": "Redirection",
    "latin": "Dirigo (Diriger)",
    "arcane": "Brendirigo (Bren + dirigo)",
    "word_type": "Interruption",
    "target_type": "Soi",
    "difficulty": "6",
    "drain": "6",
    "keys": "🌪️ Air: Brendirigoel",
    "description": "Génère un effet qui renvoie un projectile (peu importe sa forme) à son celui qui l'a lancé ou sur une autre cible (à distance égale avec son origine), ceci n'est possible que si le jet du projectile est inférieur à [Magnitude]."
  },
  {
    "num": 33,
    "vulgar": "Négation",
    "latin": "Nego (Je nie)",
    "arcane": "Barnega (Bar + nega)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "✡️ Arcane: Barnegays",
    "description": "Génère un enchantement qui permet à la cible de sacrifier 1 PM pour réduire les dégats ou l'impact reçu de 2 (3 si le PM n'est pas temporaire), la réduction ne peux être supérieure à [Magnitude/2], cette réduction s'applique avant les autres (barrières, resistance, etc)."
  },
  {
    "num": 34,
    "vulgar": "Boomrang",
    "latin": "Pello (Pousser)",
    "arcane": "Borpello (Bor + pello)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "✡️ Arcane: Borpelloys",
    "description": "Génère un enchantement qui renvoie les sorts non critiques reçus aux lanceur de sort, la magnitude du sort renvoyé est limité à [Magnitude/2], chaque fois qu'un sort est renvoyé cet enchantement subit une décharge, ne fonctionne pas sur les sorts de zone."
  },
  {
    "num": 35,
    "vulgar": "Distraction",
    "latin": "Traho (Tirer)",
    "arcane": "Bastracto (Bas + tracto)",
    "word_type": "Interruption",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🪷 Nature: Bastractoeiln",
    "description": "Génère un effet qui augmente la difficulté d'un sort en cours d'incantation de [Magnitude/3]."
  },
  {
    "num": 36,
    "vulgar": "Surexposition",
    "latin": "Expono (Exposer)",
    "arcane": "Brenpono (Bren + pono)",
    "word_type": "Interruption",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🪷 Nature: Brenponoeiln",
    "description": "Génère un effet qui double la brûlure d'un sort en cours d'incantation, avec une augmentation maximale de [Magnitude]."
  },
  {
    "num": 37,
    "vulgar": "Dissuasion",
    "latin": "Suadeo (Conseiller)",
    "arcane": "Barvias (Bar + vias)",
    "word_type": "Interruption",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚜️ Charme: Barviasynh",
    "description": "Génère un effet qui augmente la difficulté d'une action qui vise le lanceur de sort de [Magnitude/4]."
  },
  {
    "num": 38,
    "vulgar": "Réfraction",
    "latin": "Frango (Briser)",
    "arcane": "Brifrang (Bri + frang)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🌀 Chaos: Brifrangix",
    "description": "Génère un enchantement qui renvoie les sorts conditions reçus à l'auteur de ces dernières, la magnitude des conditions renvoyées est limité à [Magnitude/2], chaque fois qu'une condition est renvoyé cet enchantement subit une décharge, fonctionne sur les conditions de zone mais n'annule que celle de la cible."
  },
  {
    "num": 39,
    "vulgar": "Transposition",
    "latin": "Pono (Placer)",
    "arcane": "Basposto (Bas + posto)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🌿 Flore: Baspostoiln",
    "description": "Génère un enchantement qui lie la cible à un arbre à proximité de lui, tant que la cible reste à proximité de l'arbre en question ce dernier reçoit les agressions qui devrait normalement le viser, évidemment les arbres sont des structures ce qui induit une gestion des dégats remplacées par de la dégradation, la taille de l'arbre définit la catégorie de ce dernier, notons cependant que l'arme des agresseurs n'est pas sujette aux tests de solidité car l'attaque frappe réellement la cible et pas l'arbre, chaque fois qu'une agression est reçu par l'arbre l'enchantement subit une décharge."
  },
  {
    "num": 40,
    "vulgar": "Interposition",
    "latin": "Pono (Placer)",
    "arcane": "Breniposi (Bren + posi)",
    "word_type": "Barrière",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🛡️ Guerre: Breniposiorr",
    "description": "Génère un enchantement neutre de type barrière mixte pouvant absorber jusqu'à [Magnitude] des jets (dégats, impacts, charges) en mêlée (attention car les barrières s'appliquent avant la réduction de dégats et autre ressors défensif des cibles)."
  },
  {
    "num": 41,
    "vulgar": "Déflection",
    "latin": "Curvo (Courber)",
    "arcane": "Barcurvo (Bar + curvo)",
    "word_type": "Barrière",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🛡️ Guerre: Barcurvoorr",
    "description": "Génère un enchantement neutre de type barrière mixte pouvant absorber jusqu'à [Magnitude] les jets (dégats, impacts, charges) à distance (attention car les barrières s'appliquent avant la réduction de dégats et autre ressors défensif des cibles)."
  },
  {
    "num": 42,
    "vulgar": "Introspection",
    "latin": "Intra (Dedans)",
    "arcane": "Borintra (Bor + intra)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🧩 Mental: Borintraend",
    "description": "Génère un enchantement neutre de type barrière mentale pouvant absorber jusqu'à [Magnitude] (minoré) les jets (dégats, impacts, charges) mentaux (attention car les barrières s'appliquent avant la réduction de dégats et autre ressors défensif des cibles)."
  },
  {
    "num": 43,
    "vulgar": "Dissipation",
    "latin": "Disipo (Disperser)",
    "arcane": "Basdisipo (Bas + disipo)",
    "word_type": "Barrière",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🪷 Nature: Basdisipoeiln",
    "description": "Génère un enchantement neutre de type barrière magique pouvant absorber jusqu'à [Magnitude] (minoré) de puissance des sorts (attention car les barrières s'appliquent avant la réduction de dégats et autre ressors défensif des cibles)."
  },
  {
    "num": 44,
    "vulgar": "Fortification",
    "latin": "Fortis (Fort)",
    "arcane": "Brenfortis (Bren + fortis)",
    "word_type": "Interruption",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚡ Foudre: Brenfortisor",
    "description": "Génère un effet qui augmente la défense passive contre les attaques physiques de [Magnitude/3]."
  },
  {
    "num": 45,
    "vulgar": "Consolidation",
    "latin": "Solidus (Solide)",
    "arcane": "Brisolid (Bri + solid)",
    "word_type": "Interruption",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "❄️ Glace: Brisolidis",
    "description": "Génère un effet qui augmente la défense passive contre les tactiques physiques de [Magnitude/3]."
  },
  {
    "num": 46,
    "vulgar": "Fragilisation",
    "latin": "Frango (Briser)",
    "arcane": "Belfragi (Bel + fragi)",
    "word_type": "Interruption",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🔥 Feu: Belfragiar",
    "description": "Génère un effet qui réduit la défense passive contre les attaques ou défenses physiques de [Magnitude/3] de la cible, elle peux réaliser un test de détermination afin de réduire les effets du sort."
  },
  {
    "num": 47,
    "vulgar": "Occultation",
    "latin": "Occulto (Cacher)",
    "arcane": "Basoccult (Bas + occult)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🧩 Mental: Basoccultend",
    "description": "Génère un enchantement positif qui permet de cacher ses pensés/son esprit/ses émotions à la vue des autres, fonctionne aussi sur la magie et les sorts qui touche à ces sujets, les adversaires peuvent réaliser un test adapté afin de percer ce voile (difficulté arcanique)."
  },
  {
    "num": 48,
    "vulgar": "Simplification",
    "latin": "Simplex (Simple)",
    "arcane": "Brensim (Bren + sim)",
    "word_type": "Interruption",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "💢 Vide: Brensimarh",
    "description": "Génère un effet qui annule la manoeuvre en cours d'utilisation si la cible a moins que [Magnitudex2] en endurance actuelle, un test de sauvegarde de détermination peux permettre de réduire les effets, la manoeuvre entreprise est perdue mais pas l'action, cependant la manoeuvre employée est oublié pour une durée de [Magnitude/10] cycles."
  },
  {
    "num": 49,
    "vulgar": "Oblitération",
    "latin": "Littera (Lettre, signe)",
    "arcane": "Barlita (Bar + lita)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "📚 Savoir: Barlitaaum",
    "description": "Génère un effet qui permet au lanceur de sort de connaitre les manoeuvres connues de l'adversaire puis il peux choisir une manoeuvre (connue ou non) qui est oubliée pour une durée de [Magnitude/10] cycles."
  },
  {
    "num": 50,
    "vulgar": "Retardement",
    "latin": "Tardo (Retarder)",
    "arcane": "Bortardo (Bor + tardo)",
    "word_type": "Interruption",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "💢 Vide: Bortardoarh",
    "description": "Génère un effet qui réduit le test d'initiative d'une cible de [Magnitude/3]."
  },
  {
    "num": 51,
    "vulgar": "Hésitation",
    "latin": "Haesito (Hésiter)",
    "arcane": "Bashaes (Bas + haes)",
    "word_type": "Interruption",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "💢 Vide: Bashaesarh",
    "description": "Génère un effet qui augmente le cout d'un type d'action au choix (attaque, tactique ou défense) jusqu'à la fin du round, l'action requière alors [Magnitude/3] points d'initiative en plus."
  },
  {
    "num": 52,
    "vulgar": "Perturbation",
    "latin": "Turbo (Troubler)",
    "arcane": "Brinturb (Bri + turb)",
    "word_type": "Interruption",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚖️ Loi: Brinturbem",
    "description": "Génère un effet qui complique la réalisation d'un type d'action au choix (attaque, tactique ou défense) jusqu'à la fin du round, l'action subissant une pénalité de [Magnitude/3]."
  },
  {
    "num": 53,
    "vulgar": "Sacrilège",
    "latin": "???",
    "arcane": "???",
    "word_type": "Interruption",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🩸 Impie",
    "description": "Génère un effet qui inverse les effets de soins du sort ciblé, convertis une maximum de [Magnitude] du sort ciblé en question (inverse 2 de soins sur un total de 4 provoque donc un soin de 0 au final)."
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
