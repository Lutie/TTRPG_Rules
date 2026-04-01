# Compendium des Conditions

<div id="conditions-app">

<div class="cond-filters">
  <input type="text" id="cond-search" placeholder="Rechercher…" />
  <select id="cond-polarite">
    <option value="">Positives &amp; Négatives</option>
    <option value="positive">Positives uniquement</option>
    <option value="negative">Négatives uniquement</option>
  </select>
  <select id="cond-categorie">
    <option value="">Toutes catégories</option>
    <option value="Avantage / Désavantage">Avantage / Désavantage</option>
<option value="Modificateur de Jet">Modificateur de Jet</option>
<option value="Modificateur de Test">Modificateur de Test</option>
<option value="Caractéristique">Caractéristique</option>
<option value="Économie d'Action">Économie d'Action</option>
<option value="Attributs">Attributs</option>
<option value="Résistance Élémentaire">Résistance Élémentaire</option>
<option value="Spécial">Spécial</option>
<option value="HOT / DOT">HOT / DOT</option>
  </select>
  <select id="cond-domaine">
    <option value="">Tous domaines</option>
    <option value="☀️ Lumière">☀️ Lumière</option>
<option value="☠️ Mort">☠️ Mort</option>
<option value="☢️ Toxique">☢️ Toxique</option>
<option value="⚔️ Acier">⚔️ Acier</option>
<option value="⚕️ Corps">⚕️ Corps</option>
<option value="⚖️ Loi">⚖️ Loi</option>
<option value="⚜️ Charme">⚜️ Charme</option>
<option value="⚡ Foudre">⚡ Foudre</option>
<option value="✨ Sacre">✨ Sacre</option>
<option value="❄️ Glace">❄️ Glace</option>
<option value="❤️ Vie">❤️ Vie</option>
<option value="🌀 Chaos">🌀 Chaos</option>
<option value="🌑 Ombre">🌑 Ombre</option>
<option value="🌪️ Air">🌪️ Air</option>
<option value="🌿 Flore">🌿 Flore</option>
<option value="🎭 Illusion">🎭 Illusion</option>
<option value="🐗 Faune">🐗 Faune</option>
<option value="👁️ Vision">👁️ Vision</option>
<option value="💧 Eau">💧 Eau</option>
<option value="🔥 Feu">🔥 Feu</option>
<option value="🛡️ Guerre">🛡️ Guerre</option>
<option value="🧠 Esprit">🧠 Esprit</option>
<option value="🧩 Mental">🧩 Mental</option>
<option value="🩸 Impie">🩸 Impie</option>
<option value="🪨 Terre">🪨 Terre</option>
<option value="🪷 Nature">🪷 Nature</option>
  </select>
  <span id="cond-count"></span>
</div>

<table id="cond-table">
  <thead>
    <tr>
      <th class="col-nom" data-col="nom">Condition ↕</th>
      <th class="col-pol" data-col="polarite">Polarité ↕</th>
      <th class="col-cat" data-col="categorie">Catégorie ↕</th>
      <th class="col-dom">Domaines</th>
      <th class="col-sav">Sauvegarde</th>
      <th class="col-eff">Effet</th>
    </tr>
  </thead>
  <tbody id="cond-tbody"></tbody>
</table>

</div>

<style>
#conditions-app {
  font-size: 0.9em;
}
.cond-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5em;
  margin-bottom: 1em;
  align-items: center;
}
.cond-filters input, .cond-filters select {
  padding: 0.35em 0.6em;
  border: 1px solid #aaa;
  border-radius: 4px;
  font-size: 0.9em;
  background: var(--md-default-bg-color, #fff);
  color: var(--md-default-fg-color, #000);
}
.cond-filters input {
  flex: 1;
  min-width: 160px;
}
#cond-count {
  margin-left: auto;
  color: #888;
  font-size: 0.85em;
  white-space: nowrap;
}
#cond-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}
#cond-table th, #cond-table td {
  padding: 0.4em 0.6em;
  border: 1px solid var(--md-default-fg-color--lightest, #e0e0e0);
  vertical-align: top;
  word-break: break-word;
}
#cond-table th {
  background: var(--md-primary-fg-color, #3f51b5);
  color: var(--md-primary-bg-color, #fff);
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
}
#cond-table th:hover { opacity: 0.85; }
.col-nom  { width: 11%; }
.col-pol  { width: 8%; }
.col-cat  { width: 14%; }
.col-dom  { width: 10%; }
.col-sav  { width: 8%; }
.col-eff  { width: 49%; }
.badge {
  display: inline-block;
  padding: 0.15em 0.5em;
  border-radius: 3px;
  font-size: 0.82em;
  font-weight: 600;
  white-space: nowrap;
}
.badge-pos { background: #d4edda; color: #155724; }
.badge-neg { background: #f8d7da; color: #721c24; }
.dom-tag {
  display: inline-block;
  background: var(--md-code-bg-color, #f5f5f5);
  border-radius: 3px;
  padding: 0.1em 0.4em;
  font-size: 0.82em;
  margin: 0.1em 0.1em 0.1em 0;
  white-space: nowrap;
}
#cond-table tbody tr:nth-child(even) {
  background: var(--md-default-bg-color--light, #f9f9f9);
}
#cond-table tbody tr:hover {
  background: var(--md-accent-fg-color--transparent, #e8eaf6);
}
</style>

<script>
(function() {
  const DATA = [
  {
    "nom": "Gracieux",
    "polarite": "positive",
    "categorie": "Avantage / Désavantage",
    "cat_key": "Avtg/Dsvgt",
    "domaine_a": "✨ Sacre",
    "domaine_b": "⚜️ Charme",
    "sauvegarde": "",
    "effet": "Jusqu'à un test au choix du personnage reçoit un avantage, une fois par tours (rounds)"
  },
  {
    "nom": "Chatiment",
    "polarite": "negative",
    "categorie": "Avantage / Désavantage",
    "cat_key": "Avtg/Dsvgt",
    "domaine_a": "🩸 Impie",
    "domaine_b": "⚖️ Loi",
    "sauvegarde": "Détermination",
    "effet": "Jusqu'à un test au choix du personnage qui est à l'origine de cette condition reçoit un désavantage, une fois par tours (rounds)"
  },
  {
    "nom": "Focus",
    "polarite": "positive",
    "categorie": "Avantage / Désavantage",
    "cat_key": "Avtg/Dsvgt",
    "domaine_a": "⚡ Foudre",
    "domaine_b": "🧩 Mental",
    "sauvegarde": "",
    "effet": "Le personnage reçoit un (deux) avantage à ses tests réalisés par un membre spécifique X"
  },
  {
    "nom": "Paralysie",
    "polarite": "negative",
    "categorie": "Avantage / Désavantage",
    "cat_key": "Avtg/Dsvgt",
    "domaine_a": "⚡ Foudre",
    "domaine_b": "⚔️ Acier",
    "sauvegarde": "Robustesse",
    "effet": "Le personnage reçoit un (deux) désavantage à ses tests réalisés par un membre spécifique X"
  },
  {
    "nom": "Ire",
    "polarite": "positive",
    "categorie": "Avantage / Désavantage",
    "cat_key": "Avtg/Dsvgt",
    "domaine_a": "🛡️ Guerre",
    "domaine_b": "✨ Sacre",
    "sauvegarde": "",
    "effet": "Le personnage reçoit un (deux) avantage à ses tests d'attaque"
  },
  {
    "nom": "Accablé",
    "polarite": "negative",
    "categorie": "Avantage / Désavantage",
    "cat_key": "Avtg/Dsvgt",
    "domaine_a": "🛡️ Guerre",
    "domaine_b": "🩸 Impie",
    "sauvegarde": "Les deux",
    "effet": "Le personnage reçoit un (deux) désavantage à ses tests d'attaque"
  },
  {
    "nom": "Renfort",
    "polarite": "positive",
    "categorie": "Avantage / Désavantage",
    "cat_key": "Avtg/Dsvgt",
    "domaine_a": "🛡️ Guerre",
    "domaine_b": "❤️ Vie",
    "sauvegarde": "",
    "effet": "Le personnage reçoit un (deux) avantage à ses tests de défense"
  },
  {
    "nom": "Fracture",
    "polarite": "negative",
    "categorie": "Avantage / Désavantage",
    "cat_key": "Avtg/Dsvgt",
    "domaine_a": "🛡️ Guerre",
    "domaine_b": "☠️ Mort",
    "sauvegarde": "Robustesse",
    "effet": "Le personnage reçoit un (deux) désavantage à ses tests de défense"
  },
  {
    "nom": "Implaccable",
    "polarite": "positive",
    "categorie": "Avantage / Désavantage",
    "cat_key": "Avtg/Dsvgt",
    "domaine_a": "🛡️ Guerre",
    "domaine_b": "⚖️ Loi",
    "sauvegarde": "",
    "effet": "Le personnage reçoit un (deux) avantage à ses tests tactiques"
  },
  {
    "nom": "Exposé",
    "polarite": "negative",
    "categorie": "Avantage / Désavantage",
    "cat_key": "Avtg/Dsvgt",
    "domaine_a": "🛡️ Guerre",
    "domaine_b": "🌀 Chaos",
    "sauvegarde": "Robustesse",
    "effet": "Le personnage reçoit un (deux) désavantage à ses tests tactiques"
  },
  {
    "nom": "Réactif",
    "polarite": "positive",
    "categorie": "Avantage / Désavantage",
    "cat_key": "Avtg/Dsvgt",
    "domaine_a": "🛡️ Guerre",
    "domaine_b": "☀️ Lumière",
    "sauvegarde": "",
    "effet": "Le personnage reçoit un (deux) avantage à ses tests d'initiatives"
  },
  {
    "nom": "Inactif",
    "polarite": "negative",
    "categorie": "Avantage / Désavantage",
    "cat_key": "Avtg/Dsvgt",
    "domaine_a": "🛡️ Guerre",
    "domaine_b": "🌑 Ombre",
    "sauvegarde": "Robustesse",
    "effet": "Le personnage reçoit un (deux) désavantage à ses tests d'initiatives"
  },
  {
    "nom": "Vigueur",
    "polarite": "positive",
    "categorie": "Avantage / Désavantage",
    "cat_key": "Avtg/Dsvgt",
    "domaine_a": "⚕️ Corps",
    "domaine_b": "🐗 Faune",
    "sauvegarde": "",
    "effet": "Le personnage reçoit un (deux) avantage à ses tests de robustesse et réflexes"
  },
  {
    "nom": "Affliction",
    "polarite": "negative",
    "categorie": "Avantage / Désavantage",
    "cat_key": "Avtg/Dsvgt",
    "domaine_a": "⚕️ Corps",
    "domaine_b": "☠️ Mort",
    "sauvegarde": "Robustesse",
    "effet": "Le personnage reçoit un (deux) désavantage à ses tests de robustesse"
  },
  {
    "nom": "Vif",
    "polarite": "positive",
    "categorie": "Avantage / Désavantage",
    "cat_key": "Avtg/Dsvgt",
    "domaine_a": "🧠 Esprit",
    "domaine_b": "🐗 Faune",
    "sauvegarde": "",
    "effet": "Le personnage reçoit un (deux) avantage à ses tests de détermination et sang froid"
  },
  {
    "nom": "Apathie",
    "polarite": "negative",
    "categorie": "Avantage / Désavantage",
    "cat_key": "Avtg/Dsvgt",
    "domaine_a": "🧠 Esprit",
    "domaine_b": "🌑 Ombre",
    "sauvegarde": "Détermination",
    "effet": "Le personnage reçoit un (deux) désavantage à ses tests de détermination"
  },
  {
    "nom": "Inspiration",
    "polarite": "positive",
    "categorie": "Avantage / Désavantage",
    "cat_key": "Avtg/Dsvgt",
    "domaine_a": "🧩 Mental",
    "domaine_b": "✨ Sacre",
    "sauvegarde": "",
    "effet": "Le personnage reçoit un (deux) avantage à ses tests d'intuition, fortune et opposition"
  },
  {
    "nom": "Démence",
    "polarite": "negative",
    "categorie": "Avantage / Désavantage",
    "cat_key": "Avtg/Dsvgt",
    "domaine_a": "🧩 Mental",
    "domaine_b": "🐗 Faune",
    "sauvegarde": "Détermination",
    "effet": "Le personnage reçoit un (deux) désavantage à ses tests d'intuition"
  },
  {
    "nom": "Espoir",
    "polarite": "positive",
    "categorie": "Avantage / Désavantage",
    "cat_key": "Avtg/Dsvgt",
    "domaine_a": "🧩 Mental",
    "domaine_b": "❤️ Vie",
    "sauvegarde": "",
    "effet": "Le personnage reçoit un (deux) avantage lorsqu'il est à l'agonie"
  },
  {
    "nom": "Désespoir",
    "polarite": "negative",
    "categorie": "Avantage / Désavantage",
    "cat_key": "Avtg/Dsvgt",
    "domaine_a": "🧩 Mental",
    "domaine_b": "☠️ Mort",
    "sauvegarde": "Détermination",
    "effet": "Le personnage reçoit un (deux) désavantage lorsqu'il est à l'agonie"
  },
  {
    "nom": "Repli",
    "polarite": "positive",
    "categorie": "Avantage / Désavantage",
    "cat_key": "Avtg/Dsvgt",
    "domaine_a": "🧩 Mental",
    "domaine_b": "🛡️ Guerre",
    "sauvegarde": "",
    "effet": "Le personnage reçoit un (deux) avantage lorsqu'il tente de fuire (toutes les actions visant ou permettant de fuire)"
  },
  {
    "nom": "Accablement",
    "polarite": "negative",
    "categorie": "Avantage / Désavantage",
    "cat_key": "Avtg/Dsvgt",
    "domaine_a": "🧩 Mental",
    "domaine_b": "☠️ Mort",
    "sauvegarde": "Les deux",
    "effet": "Le personnage reçoit un (deux) désavantage lorsqu'il n'est pas en train de fuir"
  },
  {
    "nom": "Ordre",
    "polarite": "positive",
    "categorie": "Avantage / Désavantage",
    "cat_key": "Avtg/Dsvgt",
    "domaine_a": "⚖️ Loi",
    "domaine_b": "🛡️ Guerre",
    "sauvegarde": "",
    "effet": "Le personnage reçoit un (deux) avantage à ses tests réalisés visant à accomplir un ordre qui lui a été donné lorsqu'il a reçu cette condition, le test ne soit pas vaguement contribuer à l'objectif mais directement y contribuer"
  },
  {
    "nom": "Désordre",
    "polarite": "negative",
    "categorie": "Avantage / Désavantage",
    "cat_key": "Avtg/Dsvgt",
    "domaine_a": "🌀 Chaos",
    "domaine_b": "🛡️ Guerre",
    "sauvegarde": "Les deux",
    "effet": "Le personnage reçoit un (deux) désavantage à ses tests réalisés visant à accomplir un (contre) ordre qui lui a été donné lorsqu'il a reçu cette condition, le test ne soit pas vaguement contribuer à l'objectif mais directement y contribuer"
  },
  {
    "nom": "Eveillé",
    "polarite": "positive",
    "categorie": "Avantage / Désavantage",
    "cat_key": "Avtg/Dsvgt",
    "domaine_a": "👁️ Vision",
    "domaine_b": "☀️ Lumière",
    "sauvegarde": "",
    "effet": "Le personnage reçoit un (deux) avantage à ses tests visant les sens, le personnage voit le cout de ses ACTR réduits de 2 (3)"
  },
  {
    "nom": "Ensommeillé",
    "polarite": "negative",
    "categorie": "Avantage / Désavantage",
    "cat_key": "Avtg/Dsvgt",
    "domaine_a": "👁️ Vision",
    "domaine_b": "🌑 Ombre",
    "sauvegarde": "Détermination",
    "effet": "Le personnage reçoit un (deux) désavantage à ses tests visant les sens, le personnage voit le cout de ses ACTR augmenté de 2 (3)"
  },
  {
    "nom": "Résilience",
    "polarite": "positive",
    "categorie": "Modificateur de Jet",
    "cat_key": "Jet mod",
    "domaine_a": "✨ Sacre",
    "domaine_b": "🌿 Flore",
    "sauvegarde": "",
    "effet": "Les jets de combat reçus par le personnage sont réduits de 1D8 (2D8)"
  },
  {
    "nom": "Vulnérabilité",
    "polarite": "negative",
    "categorie": "Modificateur de Jet",
    "cat_key": "Jet mod",
    "domaine_a": "🩸 Impie",
    "domaine_b": "⚔️ Acier",
    "sauvegarde": "Robustesse",
    "effet": "Les jets de combat reçus par le personnage sont augmentés de 1D8 (2D8)"
  },
  {
    "nom": "Héroïsme",
    "polarite": "positive",
    "categorie": "Modificateur de Jet",
    "cat_key": "Jet mod",
    "domaine_a": "✨ Sacre",
    "domaine_b": "🛡️ Guerre",
    "sauvegarde": "",
    "effet": "Les jets de combat infligés par le personnage sont augmentés de 1D8 (2D8)"
  },
  {
    "nom": "Léthargie",
    "polarite": "negative",
    "categorie": "Modificateur de Jet",
    "cat_key": "Jet mod",
    "domaine_a": "🩸 Impie",
    "domaine_b": "⚔️ Acier",
    "sauvegarde": "Robustesse",
    "effet": "Les jets de combat infligés par le personnage sont réduits de 1D8 (2D8)"
  },
  {
    "nom": "Accalmie",
    "polarite": "positive",
    "categorie": "Modificateur de Jet",
    "cat_key": "Jet mod",
    "domaine_a": "✨ Sacre",
    "domaine_b": "❤️ Vie",
    "sauvegarde": "",
    "effet": "Les jets de rupture reçues par le personnage sont réduits de 1/3 (1/2)"
  },
  {
    "nom": "Hémophilie",
    "polarite": "negative",
    "categorie": "Modificateur de Jet",
    "cat_key": "Jet mod",
    "domaine_a": "🩸 Impie",
    "domaine_b": "⚕️ Corps",
    "sauvegarde": "Robustesse",
    "effet": "Les jets de rupture reçues par le personnage sont augmentés de 1/3 (1/2)"
  },
  {
    "nom": "Assurance",
    "polarite": "positive",
    "categorie": "Modificateur de Jet",
    "cat_key": "Jet mod",
    "domaine_a": "⚖️ Loi",
    "domaine_b": "🧩 Mental",
    "sauvegarde": "",
    "effet": "Les jets du personnage affiche des valeurs minimum de 4 (5), lors d'un critique la valeurs des dés est augmentées de 1"
  },
  {
    "nom": "Incertitude",
    "polarite": "negative",
    "categorie": "Modificateur de Jet",
    "cat_key": "Jet mod",
    "domaine_a": "🌀 Chaos",
    "domaine_b": "🧩 Mental",
    "sauvegarde": "Détermination",
    "effet": "Les jets du personnage affiche des valeurs maximum de 5 (4), lors d'un critique ce maximum est conservé"
  },
  {
    "nom": "Aisance",
    "polarite": "positive",
    "categorie": "Modificateur de Test",
    "cat_key": "Test mod",
    "domaine_a": "☀️ Lumière",
    "domaine_b": "⚜️ Charme",
    "sauvegarde": "",
    "effet": "Tous les tests reçoivent un bonus de 1 (2)"
  },
  {
    "nom": "Faiblesse",
    "polarite": "negative",
    "categorie": "Modificateur de Test",
    "cat_key": "Test mod",
    "domaine_a": "🌑 Ombre",
    "domaine_b": "⚔️ Acier",
    "sauvegarde": "Robustesse",
    "effet": "Tous les tests reçoivent un malus de 1 (2)"
  },
  {
    "nom": "Dominance",
    "polarite": "positive",
    "categorie": "Modificateur de Test",
    "cat_key": "Test mod",
    "domaine_a": "🛡️ Guerre",
    "domaine_b": "🐗 Faune",
    "sauvegarde": "",
    "effet": "Tous les tests de confrontation reçoivent un bonus de 2 (3)"
  },
  {
    "nom": "Infériorité?",
    "polarite": "negative",
    "categorie": "Modificateur de Test",
    "cat_key": "Test mod",
    "domaine_a": "🛡️ Guerre",
    "domaine_b": "🌿 Flore",
    "sauvegarde": "Les deux",
    "effet": "Tous les tests de confrontation reçoivent un malus de 2 (3)"
  },
  {
    "nom": "Préservation",
    "polarite": "positive",
    "categorie": "Modificateur de Test",
    "cat_key": "Test mod",
    "domaine_a": "❤️ Vie",
    "domaine_b": "🌿 Flore",
    "sauvegarde": "",
    "effet": "Tous les tests de sauvegarde reçoivent un bonus de 2 (3)"
  },
  {
    "nom": "Peste",
    "polarite": "negative",
    "categorie": "Modificateur de Test",
    "cat_key": "Test mod",
    "domaine_a": "☢️ Toxique",
    "domaine_b": "🩸 Impie",
    "sauvegarde": "Robustesse",
    "effet": "Tous les tests de sauvegarde reçoivent un malus de 2 (3)"
  },
  {
    "nom": "Assistance",
    "polarite": "positive",
    "categorie": "Modificateur de Test",
    "cat_key": "Test mod",
    "domaine_a": "🪷 Nature",
    "domaine_b": "❤️ Vie",
    "sauvegarde": "",
    "effet": "Tous les tests d'aventure reçoivent un bonus de 2 (3)"
  },
  {
    "nom": "Déboussolé",
    "polarite": "negative",
    "categorie": "Modificateur de Test",
    "cat_key": "Test mod",
    "domaine_a": "🪷 Nature",
    "domaine_b": "🌀 Chaos",
    "sauvegarde": "Détermination",
    "effet": "Tous les tests d'aventure reçoivent un malus de 2 (3)"
  },
  {
    "nom": "Fougue",
    "polarite": "positive",
    "categorie": "Modificateur de Test",
    "cat_key": "Test mod",
    "domaine_a": "⚡ Foudre",
    "domaine_b": "🐗 Faune",
    "sauvegarde": "",
    "effet": "Tous les tests d'interruption reçoivent un bonus de 3 (5)"
  },
  {
    "nom": "Molesse",
    "polarite": "negative",
    "categorie": "Modificateur de Test",
    "cat_key": "Test mod",
    "domaine_a": "⚡ Foudre",
    "domaine_b": "🌿 Flore",
    "sauvegarde": "Robustesse",
    "effet": "Tous les tests d'interruption reçoivent un malus de 3 (5)"
  },
  {
    "nom": "Constance",
    "polarite": "positive",
    "categorie": "Modificateur de Test",
    "cat_key": "Test mod",
    "domaine_a": "🪨 Terre",
    "domaine_b": "🌿 Flore",
    "sauvegarde": "",
    "effet": "Tous les tests reçoivent un bonus de 2 (3) lorsque le personnage est choqué"
  },
  {
    "nom": "Supplice",
    "polarite": "negative",
    "categorie": "Modificateur de Test",
    "cat_key": "Test mod",
    "domaine_a": "🩸 Impie",
    "domaine_b": "☠️ Mort",
    "sauvegarde": "Les deux",
    "effet": "Tous les tests reçoivent un malus de 2 (3) lorsque le personnage est choqué"
  },
  {
    "nom": "Vigilance",
    "polarite": "positive",
    "categorie": "Caractéristique",
    "cat_key": "Carac buff",
    "domaine_a": "🛡️ Guerre",
    "domaine_b": "👁️ Vision",
    "sauvegarde": "",
    "effet": "Les défenses passives physique du personnage contre les attaques sont augmentées de 2 (3)"
  },
  {
    "nom": "Imprudence",
    "polarite": "negative",
    "categorie": "Caractéristique",
    "cat_key": "Carac buff",
    "domaine_a": "🛡️ Guerre",
    "domaine_b": "🌀 Chaos",
    "sauvegarde": "Détermination",
    "effet": "Les défenses passives du personnage contre les attaques sont réduites de 2 (3)"
  },
  {
    "nom": "Stabilité",
    "polarite": "positive",
    "categorie": "Caractéristique",
    "cat_key": "Carac buff",
    "domaine_a": "🛡️ Guerre",
    "domaine_b": "🌿 Flore",
    "sauvegarde": "",
    "effet": "Les défenses passives physique du personnage contre les tactiques sont augmentées de 2 (3)"
  },
  {
    "nom": "Instabilité",
    "polarite": "negative",
    "categorie": "Caractéristique",
    "cat_key": "Carac buff",
    "domaine_a": "🛡️ Guerre",
    "domaine_b": "🌀 Chaos",
    "sauvegarde": "Les deux",
    "effet": "Les défenses passives du personnage contre les tactiques sont réduites de 2 (3)"
  },
  {
    "nom": "Audace",
    "polarite": "positive",
    "categorie": "Caractéristique",
    "cat_key": "Carac buff",
    "domaine_a": "🐗 Faune",
    "domaine_b": "🛡️ Guerre",
    "sauvegarde": "",
    "effet": "Les défenses passives mentales du personnage sont augmentées de 2 (3)"
  },
  {
    "nom": "Couardise",
    "polarite": "negative",
    "categorie": "Caractéristique",
    "cat_key": "Carac buff",
    "domaine_a": "🐗 Faune",
    "domaine_b": "🛡️ Guerre",
    "sauvegarde": "Détermination",
    "effet": "Les défenses passives mentales du personnage sont réduites de 2 (3)"
  },
  {
    "nom": "Solide",
    "polarite": "positive",
    "categorie": "Caractéristique",
    "cat_key": "Carac buff",
    "domaine_a": "🛡️ Guerre",
    "domaine_b": "❄️ Glace",
    "sauvegarde": "",
    "effet": "Le personnage gagne 3 (5) en protection"
  },
  {
    "nom": "Fragile",
    "polarite": "negative",
    "categorie": "Caractéristique",
    "cat_key": "Carac buff",
    "domaine_a": "❄️ Glace",
    "domaine_b": "⚔️ Acier",
    "sauvegarde": "Robustesse",
    "effet": "Le personnage perd 3 (5) en protection (le minimum reste 5)"
  },
  {
    "nom": "Excellence",
    "polarite": "positive",
    "categorie": "Caractéristique",
    "cat_key": "Carac buff",
    "domaine_a": "⚖️ Loi",
    "domaine_b": "🧩 Mental",
    "sauvegarde": "",
    "effet": "Le personnage gagne 2 (3) en criticité (réduit la MR requise pour un réussite critique) et en adresse (augmente la MR réquise pour un échec critique)"
  },
  {
    "nom": "Errance",
    "polarite": "negative",
    "categorie": "Caractéristique",
    "cat_key": "Carac buff",
    "domaine_a": "🐗 Faune",
    "domaine_b": "🌀 Chaos",
    "sauvegarde": "Détermination",
    "effet": "Le personnage perd 2 (3) en criticité (réduit la MR requise pour un réussite critique) et en adresse (augmente la MR réquise pour un échec critique)"
  },
  {
    "nom": "Promptitude",
    "polarite": "positive",
    "categorie": "Caractéristique",
    "cat_key": "Carac buff",
    "domaine_a": "🌪️ Air",
    "domaine_b": "🛡️ Guerre",
    "sauvegarde": "",
    "effet": "Le personnage gagne 2 (3) en allure"
  },
  {
    "nom": "Infirmité",
    "polarite": "negative",
    "categorie": "Caractéristique",
    "cat_key": "Carac buff",
    "domaine_a": "⚕️ Corps",
    "domaine_b": "⚔️ Acier",
    "sauvegarde": "Robustesse",
    "effet": "Le personnage perd 2 (3) en allure"
  },
  {
    "nom": "Rapide",
    "polarite": "positive",
    "categorie": "Caractéristique",
    "cat_key": "Carac buff",
    "domaine_a": "⚡ Foudre",
    "domaine_b": "🛡️ Guerre",
    "sauvegarde": "",
    "effet": "Le personnage gagne 2 (3) en initiative"
  },
  {
    "nom": "Lent",
    "polarite": "negative",
    "categorie": "Caractéristique",
    "cat_key": "Carac buff",
    "domaine_a": "⚕️ Corps",
    "domaine_b": "⚔️ Acier",
    "sauvegarde": "Robustesse",
    "effet": "Le personnage perd 2 (3) en initiative"
  },
  {
    "nom": "Hâte",
    "polarite": "positive",
    "categorie": "Caractéristique",
    "cat_key": "Carac buff",
    "domaine_a": "⚡ Foudre",
    "domaine_b": "🛡️ Guerre",
    "sauvegarde": "",
    "effet": "Le personnage gagne 3 (5) en rapidité et vitesse"
  },
  {
    "nom": "Torpeur",
    "polarite": "negative",
    "categorie": "Caractéristique",
    "cat_key": "Carac buff",
    "domaine_a": "⚕️ Corps",
    "domaine_b": "⚔️ Acier",
    "sauvegarde": "Robustesse",
    "effet": "Le personnage perd 3 (5) en rapidité et vitesse"
  },
  {
    "nom": "Rude",
    "polarite": "positive",
    "categorie": "Caractéristique",
    "cat_key": "Carac buff",
    "domaine_a": "🐗 Faune",
    "domaine_b": "🛡️ Guerre",
    "sauvegarde": "",
    "effet": "Le personnage voit sa capacité de charge et d'encombrement augmentée de 3 (5), son seuil des fatigues est également augmenté de 3 (5)"
  },
  {
    "nom": "Contusion",
    "polarite": "negative",
    "categorie": "Caractéristique",
    "cat_key": "Carac buff",
    "domaine_a": "⚕️ Corps",
    "domaine_b": "⚔️ Acier",
    "sauvegarde": "Robustesse",
    "effet": "Le personnage voit sa capacité de charge et d'encombrement réduit de 3 (5), son seuil des fatigues est également réduit de 3 (5)"
  },
  {
    "nom": "Célérité",
    "polarite": "positive",
    "categorie": "Économie d'Action",
    "cat_key": "Action eco",
    "domaine_a": "⚡ Foudre",
    "domaine_b": "🛡️ Guerre",
    "sauvegarde": "",
    "effet": "Le personnage peux réaliser une action rapide ou libre gratuite par tour (rounds)"
  },
  {
    "nom": "Ralentis",
    "polarite": "negative",
    "categorie": "Économie d'Action",
    "cat_key": "Action eco",
    "domaine_a": "⚕️ Corps",
    "domaine_b": "⚔️ Acier",
    "sauvegarde": "Robustesse",
    "effet": "Le personnage doit payer 2 (3) points d'initiative chaque fois qu'il souhaite réaliser une action rapide, de même avec les actions libres qui requière 1 (2) à la place"
  },
  {
    "nom": "Alacrité",
    "polarite": "positive",
    "categorie": "Économie d'Action",
    "cat_key": "Action eco",
    "domaine_a": "⚡ Foudre",
    "domaine_b": "🌪️ Air",
    "sauvegarde": "",
    "effet": "Le personnage peux réaliser une action simple non déplacement gratuite par tour (rounds)"
  },
  {
    "nom": "Amorphe",
    "polarite": "negative",
    "categorie": "Économie d'Action",
    "cat_key": "Action eco",
    "domaine_a": "🌑 Ombre",
    "domaine_b": "⚕️ Corps",
    "sauvegarde": "Robustesse",
    "effet": "Le personnage doit payer 2 (3) points d'initiative chaque fois qu'il souhaite réaliser une action simple"
  },
  {
    "nom": "Bougeotte",
    "polarite": "positive",
    "categorie": "Économie d'Action",
    "cat_key": "Action eco",
    "domaine_a": "🌪️ Air",
    "domaine_b": "🐗 Faune",
    "sauvegarde": "",
    "effet": "Le personnage peux réaliser une action simple de déplacement gratuite par tour (rounds)"
  },
  {
    "nom": "Nauséeux",
    "polarite": "negative",
    "categorie": "Économie d'Action",
    "cat_key": "Action eco",
    "domaine_a": "☢️ Toxique",
    "domaine_b": "⚕️ Corps",
    "sauvegarde": "Robustesse",
    "effet": "Le personnage doit payer 2 (3) points d'initiative chaque fois qu'il souhaite réaliser une action de déplacement"
  },
  {
    "nom": "Sanctification",
    "polarite": "positive",
    "categorie": "Attributs",
    "cat_key": "Attributs mod",
    "domaine_a": "✨ Sacre",
    "domaine_b": "⚖️ Loi",
    "sauvegarde": "",
    "effet": "Tous les attributs du personnage sont augmentés de 2 (3)"
  },
  {
    "nom": "Sanction",
    "polarite": "negative",
    "categorie": "Attributs",
    "cat_key": "Attributs mod",
    "domaine_a": "🩸 Impie",
    "domaine_b": "⚖️ Loi",
    "sauvegarde": "Détermination",
    "effet": "Tous les attributs du personnage sont réduits de 2 (3)"
  },
  {
    "nom": "Instinctif",
    "polarite": "positive",
    "categorie": "Attributs",
    "cat_key": "Attributs mod",
    "domaine_a": "🐗 Faune",
    "domaine_b": "🌿 Flore",
    "sauvegarde": "",
    "effet": "Tous les attributs du corps du personnage sont augmentés de 3 (4), ceux de l'esprit sont réduits de 1 (2)"
  },
  {
    "nom": "Végétatif",
    "polarite": "negative",
    "categorie": "Attributs",
    "cat_key": "Attributs mod",
    "domaine_a": "🌿 Flore",
    "domaine_b": "☠️ Mort",
    "sauvegarde": "Robustesse",
    "effet": "Tous les attributs du corps du personnage sont réduits de 3 (4), ceux de l'esprit sont augmentés de 1 (2)"
  },
  {
    "nom": "Contemplatif",
    "polarite": "positive",
    "categorie": "Attributs",
    "cat_key": "Attributs mod",
    "domaine_a": "🌿 Flore",
    "domaine_b": "🧩 Mental",
    "sauvegarde": "",
    "effet": "Tous les attributs de l'esprit du personnage sont augmentés de 3 (4), ceux du corps sont réduits de 1 (2)"
  },
  {
    "nom": "Frénésie",
    "polarite": "negative",
    "categorie": "Attributs",
    "cat_key": "Attributs mod",
    "domaine_a": "🐗 Faune",
    "domaine_b": "🌀 Chaos",
    "sauvegarde": "Détermination",
    "effet": "Tous les attributs de l'esprit du personnage sont réduits de 3 (4), ceux du corps sont augmentés de 1 (2)"
  },
  {
    "nom": "Puissant",
    "polarite": "positive",
    "categorie": "Attributs",
    "cat_key": "Attributs mod",
    "domaine_a": "⚕️ Corps",
    "domaine_b": "🔥 Feu",
    "sauvegarde": "",
    "effet": "L'attribut de force du personnage est augmenté de 4 (6)"
  },
  {
    "nom": "Impuissant",
    "polarite": "negative",
    "categorie": "Attributs",
    "cat_key": "Attributs mod",
    "domaine_a": "⚕️ Corps",
    "domaine_b": "❄️ Glace",
    "sauvegarde": "Les deux",
    "effet": "L'attribut de force du personnage est réduit de 4 (6)"
  },
  {
    "nom": "Adroit",
    "polarite": "positive",
    "categorie": "Attributs",
    "cat_key": "Attributs mod",
    "domaine_a": "⚕️ Corps",
    "domaine_b": "💧 Eau",
    "sauvegarde": "",
    "effet": "L'attribut de dextérité du personnage est augmenté de 4 (6)"
  },
  {
    "nom": "Maladroit",
    "polarite": "negative",
    "categorie": "Attributs",
    "cat_key": "Attributs mod",
    "domaine_a": "⚕️ Corps",
    "domaine_b": "🐗 Faune",
    "sauvegarde": "Robustesse",
    "effet": "L'attribut de dextérité du personnage est réduit de 4 (6)"
  },
  {
    "nom": "Souple",
    "polarite": "positive",
    "categorie": "Attributs",
    "cat_key": "Attributs mod",
    "domaine_a": "⚕️ Corps",
    "domaine_b": "🌪️ Air",
    "sauvegarde": "",
    "effet": "L'attribut de agilité du personnage est augmenté de 4 (6)"
  },
  {
    "nom": "Rigide",
    "polarite": "negative",
    "categorie": "Attributs",
    "cat_key": "Attributs mod",
    "domaine_a": "⚕️ Corps",
    "domaine_b": "🌑 Ombre",
    "sauvegarde": "Robustesse",
    "effet": "L'attribut de agilité du personnage est réduit de 4 (6)"
  },
  {
    "nom": "Attentif",
    "polarite": "positive",
    "categorie": "Attributs",
    "cat_key": "Attributs mod",
    "domaine_a": "⚕️ Corps",
    "domaine_b": "🌿 Flore",
    "sauvegarde": "",
    "effet": "L'attribut de perception du personnage est augmenté de 4 (6)"
  },
  {
    "nom": "Inattentif",
    "polarite": "negative",
    "categorie": "Attributs",
    "cat_key": "Attributs mod",
    "domaine_a": "⚕️ Corps",
    "domaine_b": "☀️ Lumière",
    "sauvegarde": "Détermination",
    "effet": "L'attribut de perception du personnage est réduit de 4 (6)"
  },
  {
    "nom": "Robuste",
    "polarite": "positive",
    "categorie": "Attributs",
    "cat_key": "Attributs mod",
    "domaine_a": "⚕️ Corps",
    "domaine_b": "🪨 Terre",
    "sauvegarde": "",
    "effet": "L'attribut de constitution du personnage est augmenté de 4 (6)"
  },
  {
    "nom": "Atrophie",
    "polarite": "negative",
    "categorie": "Attributs",
    "cat_key": "Attributs mod",
    "domaine_a": "⚕️ Corps",
    "domaine_b": "⚡ Foudre",
    "sauvegarde": "Robustesse",
    "effet": "L'attribut de constitution du personnage est réduit de 4 (6)"
  },
  {
    "nom": "Grâce",
    "polarite": "positive",
    "categorie": "Attributs",
    "cat_key": "Attributs mod",
    "domaine_a": "🧠 Esprit",
    "domaine_b": "🔥 Feu",
    "sauvegarde": "",
    "effet": "L'attribut de charisme du personnage est augmenté de 4 (6)"
  },
  {
    "nom": "Disgrâce",
    "polarite": "negative",
    "categorie": "Attributs",
    "cat_key": "Attributs mod",
    "domaine_a": "🧠 Esprit",
    "domaine_b": "❄️ Glace",
    "sauvegarde": "Détermination",
    "effet": "L'attribut de charisme du personnage est réduit de 4 (6)"
  },
  {
    "nom": "Lucide",
    "polarite": "positive",
    "categorie": "Attributs",
    "cat_key": "Attributs mod",
    "domaine_a": "🧠 Esprit",
    "domaine_b": "🌪️ Air",
    "sauvegarde": "",
    "effet": "L'attribut de intelligence du personnage est augmenté de 4 (6)"
  },
  {
    "nom": "Aberration",
    "polarite": "negative",
    "categorie": "Attributs",
    "cat_key": "Attributs mod",
    "domaine_a": "🧠 Esprit",
    "domaine_b": "🐗 Faune",
    "sauvegarde": "Détermination",
    "effet": "L'attribut de intelligence du personnage est réduit de 4 (6)"
  },
  {
    "nom": "Imaginatif",
    "polarite": "positive",
    "categorie": "Attributs",
    "cat_key": "Attributs mod",
    "domaine_a": "🧠 Esprit",
    "domaine_b": "💧 Eau",
    "sauvegarde": "",
    "effet": "L'attribut de ruse du personnage est augmenté de 4 (6)"
  },
  {
    "nom": "Trahison",
    "polarite": "negative",
    "categorie": "Attributs",
    "cat_key": "Attributs mod",
    "domaine_a": "🧠 Esprit",
    "domaine_b": "🌑 Ombre",
    "sauvegarde": "Détermination",
    "effet": "L'attribut de ruse du personnage est réduit de 4 (6)"
  },
  {
    "nom": "Osmose",
    "polarite": "positive",
    "categorie": "Attributs",
    "cat_key": "Attributs mod",
    "domaine_a": "🧠 Esprit",
    "domaine_b": "🌿 Flore",
    "sauvegarde": "",
    "effet": "L'attribut de sagesse du personnage est augmenté de 4 (6)"
  },
  {
    "nom": "Discorde",
    "polarite": "negative",
    "categorie": "Attributs",
    "cat_key": "Attributs mod",
    "domaine_a": "🧠 Esprit",
    "domaine_b": "☀️ Lumière",
    "sauvegarde": "Détermination",
    "effet": "L'attribut de sagesse du personnage est réduit de 4 (6)"
  },
  {
    "nom": "Résolution",
    "polarite": "positive",
    "categorie": "Attributs",
    "cat_key": "Attributs mod",
    "domaine_a": "🧠 Esprit",
    "domaine_b": "🪨 Terre",
    "sauvegarde": "",
    "effet": "L'attribut de volonté du personnage est augmenté de 4 (6)"
  },
  {
    "nom": "Défaite",
    "polarite": "negative",
    "categorie": "Attributs",
    "cat_key": "Attributs mod",
    "domaine_a": "🧠 Esprit",
    "domaine_b": "⚡ Foudre",
    "sauvegarde": "Détermination",
    "effet": "L'attribut de volonté du personnage est réduit de 4 (6)"
  },
  {
    "nom": "Chaleur",
    "polarite": "positive",
    "categorie": "Résistance Élémentaire",
    "cat_key": "Résist elem",
    "domaine_a": "🔥 Feu",
    "domaine_b": "✨ Sacre",
    "sauvegarde": "",
    "effet": "Le personnage est voit sa résistance à l'eau et au froid augmenter d'un (deux) cran, ses résistances au vent et à la foudre sont réduits d'un cran"
  },
  {
    "nom": "Fraicheur",
    "polarite": "positive",
    "categorie": "Résistance Élémentaire",
    "cat_key": "Résist elem",
    "domaine_a": "❄️ Glace",
    "domaine_b": "💧 Eau",
    "sauvegarde": "",
    "effet": "Le personnage est voit sa résistance à la terre et au feu augmenter d'un (deux) cran, ses résistances à l'eau et à la glace sont réduits d'un cran"
  },
  {
    "nom": "Isolé",
    "polarite": "positive",
    "categorie": "Résistance Élémentaire",
    "cat_key": "Résist elem",
    "domaine_a": "⚡ Foudre",
    "domaine_b": "🪨 Terre",
    "sauvegarde": "",
    "effet": "Le personnage est voit sa résistance au vent et à l'électricité augmenter d'un (deux) cran, ses résistances au feu et à la terre sont réduits d'un cran"
  },
  {
    "nom": "Bénit",
    "polarite": "positive",
    "categorie": "Résistance Élémentaire",
    "cat_key": "Résist elem",
    "domaine_a": "✨ Sacre",
    "domaine_b": "❤️ Vie",
    "sauvegarde": "",
    "effet": "Le personnage est voit sa résistance à la lumière, la loi, le sacré et la vie d'un (deux) cran, ses résistances à l'ombre, le chaos, l'impie et la mort sont réduits d'un cran"
  },
  {
    "nom": "Profané",
    "polarite": "positive",
    "categorie": "Résistance Élémentaire",
    "cat_key": "Résist elem",
    "domaine_a": "🩸 Impie",
    "domaine_b": "☠️ Mort",
    "sauvegarde": "",
    "effet": "Le personnage est voit sa résistance à l'ombre, le chaos, l'impie et la mort d'un (deux) cran, ses résistances à lumière, la loi, le sacré et la vie sont réduits d'un cran"
  },
  {
    "nom": "Stoïque",
    "polarite": "positive",
    "categorie": "Spécial",
    "cat_key": "Spécial",
    "domaine_a": "🛡️ Guerre",
    "domaine_b": "🌿 Flore",
    "sauvegarde": "",
    "effet": "Le personnage voit ses lésions stabilisées tant que la condition dure (toujours)"
  },
  {
    "nom": "Déchirure",
    "polarite": "negative",
    "categorie": "Spécial",
    "cat_key": "Spécial",
    "domaine_a": "⚕️ Corps",
    "domaine_b": "⚔️ Acier",
    "sauvegarde": "Robustesse",
    "effet": "Le personnage voit ses lésions non stabilisées même si elles le sont tant qu'il a cette condition (toujours)"
  },
  {
    "nom": "Inépuisable",
    "polarite": "positive",
    "categorie": "Spécial",
    "cat_key": "Spécial",
    "domaine_a": "💧 Eau",
    "domaine_b": "🌿 Flore",
    "sauvegarde": "",
    "effet": "Le personnage ignore la moitié (toute) de sa fatigue"
  },
  {
    "nom": "Exténuation",
    "polarite": "negative",
    "categorie": "Spécial",
    "cat_key": "Spécial",
    "domaine_a": "🌪️ Air",
    "domaine_b": "⚕️ Corps",
    "sauvegarde": "Robustesse",
    "effet": "Le personnage voit sa fatigue réelle augmentée de moitié (doublée)"
  },
  {
    "nom": "Effréné",
    "polarite": "positive",
    "categorie": "Spécial",
    "cat_key": "Spécial",
    "domaine_a": "🛡️ Guerre",
    "domaine_b": "🌪️ Air",
    "sauvegarde": "",
    "effet": "Le maximum d'endurance du personnage est augmenté de 50% (100%), cette augmentation n'octroie pas l'endurance elle même pour suivre cette augmentation de maximum"
  },
  {
    "nom": "Ebranlé",
    "polarite": "negative",
    "categorie": "Spécial",
    "cat_key": "Spécial",
    "domaine_a": "🪨 Terre",
    "domaine_b": "⚔️ Acier",
    "sauvegarde": "Les deux",
    "effet": "Le maximum d'endurance du personnage est réduit de 33% (50%), cette augmentation fait perdre l'endurance qui dépasse le cas échéant"
  },
  {
    "nom": "Placebo",
    "polarite": "positive",
    "categorie": "Spécial",
    "cat_key": "Spécial",
    "domaine_a": "🎭 Illusion",
    "domaine_b": "🧩 Mental",
    "sauvegarde": "",
    "effet": "Le personnage ignore jusqu'à une (deux) lésion la (les) plus grave de chaque type"
  },
  {
    "nom": "Nocebo",
    "polarite": "negative",
    "categorie": "Spécial",
    "cat_key": "Spécial",
    "domaine_a": "🎭 Illusion",
    "domaine_b": "🧩 Mental",
    "sauvegarde": "Les deux",
    "effet": "Le personnage compte double jusqu'à une (deux) lésion la (les) plus grave de chaque type"
  },
  {
    "nom": "Vaillance",
    "polarite": "positive",
    "categorie": "Spécial",
    "cat_key": "Spécial",
    "domaine_a": "🛡️ Guerre",
    "domaine_b": "✨ Sacre",
    "sauvegarde": "",
    "effet": "Les conditions positive du personnage ont une décharge réduit de 3 (5), les décharges négatives ont une décharge augmentée d'autant"
  },
  {
    "nom": "Angoisse",
    "polarite": "negative",
    "categorie": "Spécial",
    "cat_key": "Spécial",
    "domaine_a": "🧩 Mental",
    "domaine_b": "⚜️ Charme",
    "sauvegarde": "Détermination",
    "effet": "Les conditions positives du personnage ont une décharge augmentée de 3 (5), les décharges négatives ont une décharge réduite d’autant"
  },
  {
    "nom": "Réceptif",
    "polarite": "positive",
    "categorie": "Spécial",
    "cat_key": "Spécial",
    "domaine_a": "❤️ Vie",
    "domaine_b": "🌿 Flore",
    "sauvegarde": "",
    "effet": "Lorsque le personnage reçoit un soin de ressource permanent ou temporaire, il peux recevoir 1/3 (1/2) de plus sous forme de ressource temporaire"
  },
  {
    "nom": "Gangrène",
    "polarite": "negative",
    "categorie": "Spécial",
    "cat_key": "Spécial",
    "domaine_a": "☠️ Mort",
    "domaine_b": "☢️ Toxique",
    "sauvegarde": "Robustesse",
    "effet": "Lorsque le personnage reçoit un soin de ressource permanent ou temporaire, il reçoit 1/2 (100%) de moins, le calcul de la fatigue ainsi acquises le cas échéant est basée sur la valeurs avant réduction"
  },
  {
    "nom": "Acuité",
    "polarite": "positive",
    "categorie": "Spécial",
    "cat_key": "Spécial",
    "domaine_a": "👁️ Vision",
    "domaine_b": "☀️ Lumière",
    "sauvegarde": "",
    "effet": "Le personnage voit la portée de ses sens et de ses attaques à distanc augmentés de moitié (doublé), sa zone augmente de 2 (3)"
  },
  {
    "nom": "Inacuité",
    "polarite": "negative",
    "categorie": "Spécial",
    "cat_key": "Spécial",
    "domaine_a": "👁️ Vision",
    "domaine_b": "🌑 Ombre",
    "sauvegarde": "Robustesse",
    "effet": "Le personnage voit la portée de ses sens et de ses attaques à distance réduite de moitié (à 1, proximité uniquement), sa zone est réduite de 2 (3)"
  },
  {
    "nom": "Libre",
    "polarite": "positive",
    "categorie": "Spécial",
    "cat_key": "Spécial",
    "domaine_a": "🌪️ Air",
    "domaine_b": "🌀 Chaos",
    "sauvegarde": "",
    "effet": "Le personnage ignore les conditions négatives dont la charge est inférieure à (deux fois) celle ci"
  },
  {
    "nom": "Misère",
    "polarite": "negative",
    "categorie": "Spécial",
    "cat_key": "Spécial",
    "domaine_a": "🩸 Impie",
    "domaine_b": "🧩 Mental",
    "sauvegarde": "Les deux",
    "effet": "Le personnage ignore les conditions positives dont la charge est inférieure à (deux fois) celle ci"
  },
  {
    "nom": "Motivé",
    "polarite": "positive",
    "categorie": "HOT / DOT",
    "cat_key": "HOT/DOT",
    "domaine_a": "🧩 Mental",
    "domaine_b": "⚜️ Charme",
    "sauvegarde": "",
    "effet": "Le personnage gagne 1D6+1 (+3) points de moral par rounds (l'excédent est perdu)"
  },
  {
    "nom": "Démotivé",
    "polarite": "negative",
    "categorie": "HOT / DOT",
    "cat_key": "HOT/DOT",
    "domaine_a": "☢️ Toxique",
    "domaine_b": "⚜️ Charme",
    "sauvegarde": "Détermination",
    "effet": "Le personnage subit, au début de chaque tours, des dégats de rupture équivalants à D8+2 (+4) directement sur le moral."
  },
  {
    "nom": "Vaillant",
    "polarite": "positive",
    "categorie": "HOT / DOT",
    "cat_key": "HOT/DOT",
    "domaine_a": "🛡️ Guerre",
    "domaine_b": "🪷 Nature",
    "sauvegarde": "",
    "effet": "Le personnage gagne 1D6 (+2) PE temporaires par rounds"
  },
  {
    "nom": "Intoxication",
    "polarite": "negative",
    "categorie": "HOT / DOT",
    "cat_key": "HOT/DOT",
    "domaine_a": "☢️ Toxique",
    "domaine_b": "🪷 Nature",
    "sauvegarde": "Robustesse",
    "effet": "Le personnage subit, au début de chaque tours, des dégats de rupture équivalants à D8+2 (+4) directement sur l'endurance."
  },
  {
    "nom": "Vivacité",
    "polarite": "positive",
    "categorie": "HOT / DOT",
    "cat_key": "HOT/DOT",
    "domaine_a": "💧 Eau",
    "domaine_b": "❤️ Vie",
    "sauvegarde": "",
    "effet": "Le personnage gagne 1D6 (+2) PV temporaires par rounds"
  },
  {
    "nom": "Infection",
    "polarite": "negative",
    "categorie": "HOT / DOT",
    "cat_key": "HOT/DOT",
    "domaine_a": "☢️ Toxique",
    "domaine_b": "☠️ Mort",
    "sauvegarde": "Robustesse",
    "effet": "Le personnage subit, au début de chaque tours, des dégats de rupture équivalants à D8+2 (+4) directement sur la vitalité (PV)."
  },
  {
    "nom": "Imperturbable",
    "polarite": "positive",
    "categorie": "HOT / DOT",
    "cat_key": "HOT/DOT",
    "domaine_a": "🪨 Terre",
    "domaine_b": "🧩 Mental",
    "sauvegarde": "",
    "effet": "Le personnage gagne 1D6 (+2) PS temporaires par rounds"
  },
  {
    "nom": "Malaise",
    "polarite": "negative",
    "categorie": "HOT / DOT",
    "cat_key": "HOT/DOT",
    "domaine_a": "☢️ Toxique",
    "domaine_b": "🧩 Mental",
    "sauvegarde": "Robustesse",
    "effet": "Le personnage subit, au début de chaque tours, des dégats de rupture équivalants à D8+2 (+4) directement sur le mental (PS)."
  },
  {
    "nom": "Tonique",
    "polarite": "positive",
    "categorie": "HOT / DOT",
    "cat_key": "HOT/DOT",
    "domaine_a": "🌪️ Air",
    "domaine_b": "🪷 Nature",
    "sauvegarde": "",
    "effet": "Le personnage gagne 1D6 (+2) PC temporaires par rounds"
  },
  {
    "nom": "Asthénie",
    "polarite": "negative",
    "categorie": "HOT / DOT",
    "cat_key": "HOT/DOT",
    "domaine_a": "☢️ Toxique",
    "domaine_b": "🪷 Nature",
    "sauvegarde": "Robustesse",
    "effet": "Le personnage subit, au début de chaque tours, des dégats de rupture équivalants à D8+2 (+4) directement sur le chi (PC)."
  },
  {
    "nom": "Effervescence",
    "polarite": "positive",
    "categorie": "HOT / DOT",
    "cat_key": "HOT/DOT",
    "domaine_a": "⚡ Foudre",
    "domaine_b": "🌀 Chaos",
    "sauvegarde": "",
    "effet": "Le personnage gagne 1D6 (+2) PK temporaires par rounds"
  },
  {
    "nom": "Chavirage",
    "polarite": "negative",
    "categorie": "HOT / DOT",
    "cat_key": "HOT/DOT",
    "domaine_a": "☢️ Toxique",
    "domaine_b": "⚖️ Loi",
    "sauvegarde": "Robustesse",
    "effet": "Le personnage subit, au début de chaque tours, des dégats de rupture équivalants à D8+2 (+4) directement sur le karma (PK)."
  },
  {
    "nom": "Régénération",
    "polarite": "positive",
    "categorie": "HOT / DOT",
    "cat_key": "HOT/DOT",
    "domaine_a": "🌿 Flore",
    "domaine_b": "❤️ Vie",
    "sauvegarde": "",
    "effet": "La gravité des lésions du personnage sont réduites de 2 (3) par rounds, doublé si la lésion est stabilisée, n'affecte que les gravités reçues durant la scène en cours et ne peux réduire les lésions en question en de ça de la moitié de leurs valeurs initiale"
  },
  {
    "nom": "Dégénération",
    "polarite": "negative",
    "categorie": "HOT / DOT",
    "cat_key": "HOT/DOT",
    "domaine_a": "☢️ Toxique",
    "domaine_b": "☠️ Mort",
    "sauvegarde": "Robustesse",
    "effet": "La gravité des lésions du personnage augmente 2 (3) par rounds, doublé si la lésion n'est pas stabilisée"
  },
  {
    "nom": "Farouche",
    "polarite": "positive",
    "categorie": "Économie d'Action",
    "cat_key": "Action eco",
    "domaine_a": "🪨 Terre",
    "domaine_b": "🛡️ Guerre",
    "sauvegarde": "",
    "effet": "Une fois par tour (rounds) le personnage peux éviter la perte d'une action, quelque soit l'origine"
  },
  {
    "nom": "Etourdi",
    "polarite": "negative",
    "categorie": "Économie d'Action",
    "cat_key": "Action eco",
    "domaine_a": "🪨 Terre",
    "domaine_b": "⚔️ Acier",
    "sauvegarde": "Robustesse",
    "effet": "Le personnage ne peux prendre d'actions, la décharge de cette condition est doublée (normale)"
  },
  {
    "nom": "Impétueux",
    "polarite": "positive",
    "categorie": "Spécial",
    "cat_key": "Spécial",
    "domaine_a": "💧 Eau",
    "domaine_b": "🌪️ Air",
    "sauvegarde": "",
    "effet": "Chaque fois que le personnage est la cible d'une agression (attaque, tactique, ...) il gagne 1D6 (+2) PE temporaires"
  },
  {
    "nom": "Choc",
    "polarite": "negative",
    "categorie": "Spécial",
    "cat_key": "Spécial",
    "domaine_a": "⚡ Foudre",
    "domaine_b": "⚕️ Corps",
    "sauvegarde": "Robustesse",
    "effet": "Chaque fois que le personnage est la cible d'une agression, réussite ou non, (attaque, tactique, ...) il perd 1D6 (+2) PE"
  },
  {
    "nom": "Tempêtueux",
    "polarite": "positive",
    "categorie": "Avantage / Désavantage",
    "cat_key": "Avtg/Dsvgt",
    "domaine_a": "🌪️ Air",
    "domaine_b": "⚡ Foudre",
    "sauvegarde": "",
    "effet": "Le personnage reçoit un (deux) avantage à ses tests visant à esquiver ou s'échapper"
  },
  {
    "nom": "Gel",
    "polarite": "negative",
    "categorie": "Avantage / Désavantage",
    "cat_key": "Avtg/Dsvgt",
    "domaine_a": "❄️ Glace",
    "domaine_b": "💧 Eau",
    "sauvegarde": "Robustesse",
    "effet": "A chaque action entreprise par le personnage son initiative baisse de 1 (2), de plus le personnage reçoit un (deux) désavantage à ses tests visant à esquiver ou s'échapper"
  },
  {
    "nom": "Isolation",
    "polarite": "positive",
    "categorie": "Spécial",
    "cat_key": "Spécial",
    "domaine_a": "🪨 Terre",
    "domaine_b": "🌿 Flore",
    "sauvegarde": "",
    "effet": "Au début de son round le personnage retire une condition de DOT qui a la moitié (totalité) ou moins des charges de cette condition ci"
  },
  {
    "nom": "Immolation",
    "polarite": "negative",
    "categorie": "Spécial",
    "cat_key": "Spécial",
    "domaine_a": "🔥 Feu",
    "domaine_b": "🩸 Impie",
    "sauvegarde": "Robustesse",
    "effet": "Au début de son round le personnage reçoit la condition \"enflammé\" avec la moitié (totalité) des charges de cette condition ci"
  },
  {
    "nom": "Extase",
    "polarite": "positive",
    "categorie": "Spécial",
    "cat_key": "Spécial",
    "domaine_a": "⚜️ Charme",
    "domaine_b": "✨ Sacre",
    "sauvegarde": "",
    "effet": "Tous les tests de compétence du personnage sont désavantagés, sauf les actions d'attaques qui sont doublement (triplemet) avantagées"
  },
  {
    "nom": "Rage",
    "polarite": "negative",
    "categorie": "Spécial",
    "cat_key": "Spécial",
    "domaine_a": "⚜️ Charme",
    "domaine_b": "🔥 Feu",
    "sauvegarde": "Détermination",
    "effet": "Tous les tests de compétence du personnage sont (doublement) désavantagés, sauf les actions d'attaques"
  },
  {
    "nom": "Prudence",
    "polarite": "positive",
    "categorie": "Spécial",
    "cat_key": "Spécial",
    "domaine_a": "⚜️ Charme",
    "domaine_b": "⚖️ Loi",
    "sauvegarde": "",
    "effet": "Tous les tests de compétence du personnage sont désavantagés, sauf les actions de défenses qui sont doublement (triplement) avantagées"
  },
  {
    "nom": "Surprise",
    "polarite": "negative",
    "categorie": "Spécial",
    "cat_key": "Spécial",
    "domaine_a": "⚜️ Charme",
    "domaine_b": "🌀 Chaos",
    "sauvegarde": "Détermination",
    "effet": "Tous les tests de compétence du personnage sont (doublement) désavantagés, sauf les actions de défenses"
  },
  {
    "nom": "Joie",
    "polarite": "positive",
    "categorie": "Spécial",
    "cat_key": "Spécial",
    "domaine_a": "⚜️ Charme",
    "domaine_b": "☀️ Lumière",
    "sauvegarde": "",
    "effet": "Plage d'exploit et maladresse des actions de combat +1 (2) et -1 (2)"
  },
  {
    "nom": "Tristesse",
    "polarite": "negative",
    "categorie": "Spécial",
    "cat_key": "Spécial",
    "domaine_a": "⚜️ Charme",
    "domaine_b": "☠️ Mort",
    "sauvegarde": "Détermination",
    "effet": "Plage d'exploit et maladresse des actions de combat -1 (2) et +1 (2)"
  },
  {
    "nom": "Courage",
    "polarite": "positive",
    "categorie": "Avantage / Désavantage",
    "cat_key": "Avtg/Dsvgt",
    "domaine_a": "⚜️ Charme",
    "domaine_b": "🛡️ Guerre",
    "sauvegarde": "",
    "effet": "Le personnage reçoit un (deux) désavantage à ses tests visant l'object de son courage (qui est déterminé lorsque la condition est contractée)"
  },
  {
    "nom": "Peur",
    "polarite": "negative",
    "categorie": "Avantage / Désavantage",
    "cat_key": "Avtg/Dsvgt",
    "domaine_a": "⚜️ Charme",
    "domaine_b": "🌑 Ombre",
    "sauvegarde": "Détermination",
    "effet": "Le personnage reçoit un (deux) désavantage à ses tests visant l'object de sa peur (qui est déterminé lorsque la condition est contractée)"
  },
  {
    "nom": "Sérénité",
    "polarite": "positive",
    "categorie": "Spécial",
    "cat_key": "Spécial",
    "domaine_a": "⚜️ Charme",
    "domaine_b": "🌿 Flore",
    "sauvegarde": "",
    "effet": "Le personnage n'est pas choqué lorsqu'il devrait l'être tant que les PE ne dépasse leurs moitié (totalité) dans le négatif"
  },
  {
    "nom": "Stress",
    "polarite": "negative",
    "categorie": "Spécial",
    "cat_key": "Spécial",
    "domaine_a": "⚜️ Charme",
    "domaine_b": "🧩 Mental",
    "sauvegarde": "Détermination",
    "effet": "Le personnage est choqué lorsque ses PE sont inférieurs à 1/3 (1/2) du maximum"
  },
  {
    "nom": "Confiance",
    "polarite": "positive",
    "categorie": "Spécial",
    "cat_key": "Spécial",
    "domaine_a": "⚜️ Charme",
    "domaine_b": "⚖️ Loi",
    "sauvegarde": "",
    "effet": "Lorsque le personnage réalise une action de confrontation autre qu'une défense il gagne 2 (3) PE temporaires"
  },
  {
    "nom": "Regrets",
    "polarite": "negative",
    "categorie": "Spécial",
    "cat_key": "Spécial",
    "domaine_a": "⚜️ Charme",
    "domaine_b": "☠️ Mort",
    "sauvegarde": "Détermination",
    "effet": "Lorsque le personnage réalise une action de confrontation autre qu'une défense, il perd 4 (7) PE"
  },
  {
    "nom": "Courroux",
    "polarite": "positive",
    "categorie": "Spécial",
    "cat_key": "Spécial",
    "domaine_a": "⚜️ Charme",
    "domaine_b": "🔥 Feu",
    "sauvegarde": "",
    "effet": "Le personnage voit ses jets infligés augmentés de 1D8 (2D8) et reçus réduits de 1D8 (2D8), quelque soit le type d'action, si elle vise ou sont originaire de l'object de son extase (qui est déterminé lorsque la condition est contractée)"
  },
  {
    "nom": "Haine",
    "polarite": "negative",
    "categorie": "Spécial",
    "cat_key": "Spécial",
    "domaine_a": "⚜️ Charme",
    "domaine_b": "🩸 Impie",
    "sauvegarde": "Détermination",
    "effet": "Le personnage voit ses jets infligés réduits de 1D8 (2D8) et reçus augmentés de 1D8 (2D8), quelque soit le type d'action, si elle vise ou sont originaire de l'object de sa haine (qui est déterminé lorsque la condition est contractée)"
  },
  {
    "nom": "Vigilance",
    "polarite": "positive",
    "categorie": "Spécial",
    "cat_key": "Spécial",
    "domaine_a": "⚜️ Charme",
    "domaine_b": "👁️ Vision",
    "sauvegarde": "",
    "effet": "Le personnage ne peux plus réaliser d'échec critique (ne peux plus faire l'objet de réussite critique), le personnage reçoit un (deux) avantage à ses tests d'opportunité, de plus ses défenses contre de telles actions sont augmentés de 2 (3)"
  },
  {
    "nom": "Songerie",
    "polarite": "negative",
    "categorie": "Spécial",
    "cat_key": "Spécial",
    "domaine_a": "⚜️ Charme",
    "domaine_b": "🌑 Ombre",
    "sauvegarde": "Détermination",
    "effet": "Le personnage perd 5 (10) en adresse (augmente la MR réquise pour un échec critique, donc à 10 un échec est automatiquement critique), le personnage reçoit un (deux) désavantage à ses tests d'opportunité, de plus ses défenses contre de telles actions sont réduites de 2 (3)"
  },
  {
    "nom": "Sanguinaire",
    "polarite": "positive",
    "categorie": "Spécial",
    "cat_key": "Spécial",
    "domaine_a": "⚜️ Charme",
    "domaine_b": "🩸 Impie",
    "sauvegarde": "",
    "effet": "Le personnage récupère 1/3 (1/2) des PVs perdus par une cible lors d'une attaque de mếlée sous forme de PE temporaires"
  },
  {
    "nom": "Remord",
    "polarite": "negative",
    "categorie": "Spécial",
    "cat_key": "Spécial",
    "domaine_a": "⚜️ Charme",
    "domaine_b": "⚖️ Loi",
    "sauvegarde": "Détermination",
    "effet": "Le personnage perd 1/3 (1/2) des PVs perdus par une cible lors d'une attaque de mếlée sous forme de PE, puis de PV si plus assez de PE"
  },
  {
    "nom": "Idempotence",
    "polarite": "positive",
    "categorie": "Spécial",
    "cat_key": "Spécial",
    "domaine_a": "🧩 Mental",
    "domaine_b": "👁️ Vision",
    "sauvegarde": "",
    "effet": "Le personnage ignore tous les effets (même magique) qui visent à altérer ses faits et gestes, sauf si elles sont avancées (de niveau 4 et plus) mais elles sont alors traitées comme normale (elles aussi sont ignorées)"
  },
  {
    "nom": "Folie",
    "polarite": "negative",
    "categorie": "Spécial",
    "cat_key": "Spécial",
    "domaine_a": "🧩 Mental",
    "domaine_b": "🌀 Chaos",
    "sauvegarde": "Détermination",
    "effet": "Le personnage prend sa première (ses deux) action simples de façon aléatoire parmis (1D8) : Attaquer, Préparer une défense, Tactique, Déplacement, Au choix, Au choix, Rien, Rien, de fait le personnage ne peux plus entreprendre d'action complexe"
  },
  {
    "nom": "Omnipotence",
    "polarite": "positive",
    "categorie": "Économie d'Action",
    "cat_key": "Action eco",
    "domaine_a": "🧩 Mental",
    "domaine_b": "👁️ Vision",
    "sauvegarde": "",
    "effet": "Le personnage est habitué à tous les types d'action (il peux également réaliser les actions complexes en actions simples)"
  },
  {
    "nom": "Furie",
    "polarite": "negative",
    "categorie": "Économie d'Action",
    "cat_key": "Action eco",
    "domaine_a": "🧩 Mental",
    "domaine_b": "🔥 Feu",
    "sauvegarde": "Détermination",
    "effet": "Le personnage prend sa première (ses deux) action simples de façon à approcher et/ou attaquer la cible la plus proche de lui, de fait le personnage ne peux plus entreprendre d'action complexe"
  },
  {
    "nom": "Omniscience",
    "polarite": "positive",
    "categorie": "Spécial",
    "cat_key": "Spécial",
    "domaine_a": "🧩 Mental",
    "domaine_b": "👁️ Vision",
    "sauvegarde": "",
    "effet": "A chaque action entreprise par le personnage il peux ne pas choisir sa cible sur le champs et attendre le résultat pour choisir celle ci, il est alors en mesure de savoir quel sera le résultat de l'action selon la cible choisit (il est désormais même en mesure d'annuler l'action pour faire autre chose, il récupère les ressources engagées dans le processus, une fois par round maximum)"
  },
  {
    "nom": "Confusion",
    "polarite": "negative",
    "categorie": "Spécial",
    "cat_key": "Spécial",
    "domaine_a": "🧩 Mental",
    "domaine_b": "🌀 Chaos",
    "sauvegarde": "Détermination",
    "effet": "A chaque action entreprise par le personnage la cible est modifiée de façon aléatoire : Il a 3 (5) chances sur 8 que la cible ne soit pas la bonne, lorsque c'est le cas la cible peux être n'importe laquelle à portée de l'action (allié ou non)"
  },
  {
    "nom": "Parlotte",
    "polarite": "positive",
    "categorie": "Avantage / Désavantage",
    "cat_key": "Avtg/Dsvgt",
    "domaine_a": "⚖️ Loi",
    "domaine_b": "👁️ Vision",
    "sauvegarde": "",
    "effet": "Le personnage reçoit un (deux) désavantage à ses tests utilisant la parole comme vecteur principal de réussite (tel qu'ordonner, commander, rugir, convaincre, etc, mais pas les actions dont la parole est juste un vecteur tel qu'incanter un sort, etc)"
  },
  {
    "nom": "Mutisme",
    "polarite": "negative",
    "categorie": "Avantage / Désavantage",
    "cat_key": "Avtg/Dsvgt",
    "domaine_a": "🌀 Chaos",
    "domaine_b": "👁️ Vision",
    "sauvegarde": "Détermination",
    "effet": "Le personnage ne peux plus s'exprimer correctement (du tout) à l'oral, les actions qui dépendent entièrement de ce sens sont désavantagées (plus possibles)"
  },
  {
    "nom": "Infravision",
    "polarite": "positive",
    "categorie": "Avantage / Désavantage",
    "cat_key": "Avtg/Dsvgt",
    "domaine_a": "⚖️ Loi",
    "domaine_b": "👁️ Vision",
    "sauvegarde": "",
    "effet": "Le personnage reçoit un (deux) désavantage à ses tests utilisant la vue comme vecteur principal de réussite (tel que chercher du regard, observer, identifier, etc, mais pas les actions dont la vue est juste un vecteur tel qu'attaquer, défendre, etc)"
  },
  {
    "nom": "Cécité",
    "polarite": "negative",
    "categorie": "Avantage / Désavantage",
    "cat_key": "Avtg/Dsvgt",
    "domaine_a": "🌀 Chaos",
    "domaine_b": "👁️ Vision",
    "sauvegarde": "Détermination",
    "effet": "Le personnage ne peux plus voir correctement (du tout) à l'oral, les actions qui dépendent entièrement de ce sens sont désavantagées (plus possibles)"
  },
  {
    "nom": "6e Sens",
    "polarite": "positive",
    "categorie": "Avantage / Désavantage",
    "cat_key": "Avtg/Dsvgt",
    "domaine_a": "⚖️ Loi",
    "domaine_b": "👁️ Vision",
    "sauvegarde": "",
    "effet": "Le personnage reçoit un (deux) désavantage à ses tests utilisant l'odorat, le touché, l'ouie comme vecteur principal de réussite (tel qu'entendre, sentir, etc, mais pas les actions pour lesquels ces sens sont juste un vecteur)"
  },
  {
    "nom": "Insensible",
    "polarite": "negative",
    "categorie": "Avantage / Désavantage",
    "cat_key": "Avtg/Dsvgt",
    "domaine_a": "🌀 Chaos",
    "domaine_b": "👁️ Vision",
    "sauvegarde": "Détermination",
    "effet": "Le personnage ne peux plus sentir (odorat ou touché) correctement (du tout) à l'oral, les actions qui dépendent entièrement de ce sens sont désavantagées (plus possibles)"
  },
  {
    "nom": "Fureur",
    "polarite": "positive",
    "categorie": "Spécial",
    "cat_key": "Spécial",
    "domaine_a": "🧩 Mental",
    "domaine_b": "⚖️ Loi",
    "sauvegarde": "",
    "effet": "Le personnage génère 2 (3) PE temporaires à chaques attaques réalisée (réussite ou non)"
  },
  {
    "nom": "Pacifisme",
    "polarite": "negative",
    "categorie": "Spécial",
    "cat_key": "Spécial",
    "domaine_a": "🧩 Mental",
    "domaine_b": "🌀 Chaos",
    "sauvegarde": "Détermination",
    "effet": "Le personnage ne peux plus agresser correctement (du tout) ses opposants, les actions considérées comme telles (la logique prévaut sur une liste exhaustive) sont désavantagées (plus possibles)"
  },
  {
    "nom": "Encouragé",
    "polarite": "positive",
    "categorie": "Avantage / Désavantage",
    "cat_key": "Avtg/Dsvgt",
    "domaine_a": "🧩 Mental",
    "domaine_b": "⚖️ Loi",
    "sauvegarde": "",
    "effet": "Le personnage reçoit un (deux) désavantage à ses tests visant à réaliser une action qui va dans le sens d'une demande réalisé par la personne qui l'a encouragé, si et seulement ci cette dernière a pris le temps de lui communiquer son souhait"
  },
  {
    "nom": "Charme",
    "polarite": "negative",
    "categorie": "Avantage / Désavantage",
    "cat_key": "Avtg/Dsvgt",
    "domaine_a": "🧩 Mental",
    "domaine_b": "🌀 Chaos",
    "sauvegarde": "Détermination",
    "effet": "Le personnage prend sa première action simples de façon à faire plaisir à la personne qui l'a charmé, si et seulement ci cette dernière a pris le temps de lui communiquer son souhait, le personnage ne peux pas ensuite activement défaire le fruit de cette action (par exemple s'approcher d'un objectif puis revenir), de fait le personnage ne peux plus entreprendre d'action complexe, les actions forcées ne peuvent porter atteinte à la vie d'un allié (peux porter atteinte à la vie d'un allié, mais PAS du personnage lui même)"
  },
  {
    "nom": "Confiance",
    "polarite": "positive",
    "categorie": "Spécial",
    "cat_key": "Spécial",
    "domaine_a": "🧩 Mental",
    "domaine_b": "⚖️ Loi",
    "sauvegarde": "",
    "effet": "Lorsque le personnage réalise un test, la valeurs totale de ses dés (hors singularité) ne peux être inférieure à 10 (12)"
  },
  {
    "nom": "Modestie",
    "polarite": "negative",
    "categorie": "Spécial",
    "cat_key": "Spécial",
    "domaine_a": "🧩 Mental",
    "domaine_b": "🌀 Chaos",
    "sauvegarde": "Détermination",
    "effet": "Lorsque le personnage réalise un test, la valeurs totale de ses dés (hors singularité) ne peux être supérieure à 12 (10)"
  },
  {
    "nom": "Inébranlable",
    "polarite": "positive",
    "categorie": "Avantage / Désavantage",
    "cat_key": "Avtg/Dsvgt",
    "domaine_a": "🧩 Mental",
    "domaine_b": "⚖️ Loi",
    "sauvegarde": "",
    "effet": "Le personnage reçoit un (deux) avantage à ses tests de sauvegarde contre les interruptions, de plus le personnage voit la gravité réelle de ses lésions réduites de moitié (totalité) pour ce qui est du calcule des pénalités"
  },
  {
    "nom": "Souffrance",
    "polarite": "negative",
    "categorie": "Avantage / Désavantage",
    "cat_key": "Avtg/Dsvgt",
    "domaine_a": "🧩 Mental",
    "domaine_b": "🌀 Chaos",
    "sauvegarde": "Détermination",
    "effet": "Le personnage reçoit un (deux) désavantage à ses tests de sauvegarde contre les interruptions, de plus le personnage voit la gravité réelle de ses lésions augmentée de moitié (doublée) pour ce qui est du calcule des pénalités"
  },
  {
    "nom": "Stoïcisme",
    "polarite": "positive",
    "categorie": "Spécial",
    "cat_key": "Spécial",
    "domaine_a": "🧩 Mental",
    "domaine_b": "⚖️ Loi",
    "sauvegarde": "",
    "effet": "Le personnage ignore jusqu'à un (tous) élément(s) qui peux réduire son allure, qu'il s'agisse de conditions comme de la nature d'un terrain"
  },
  {
    "nom": "Désorientation",
    "polarite": "negative",
    "categorie": "Spécial",
    "cat_key": "Spécial",
    "domaine_a": "🧩 Mental",
    "domaine_b": "🌀 Chaos",
    "sauvegarde": "Détermination",
    "effet": "Lorsque le personnage décide de se déplacer il établie le chemin qu'il souhaite réaliser puis applique ce dernier en choisissant la direction au hasard: Nord, Sud, Est, Ouest, Opposé, Normal (Opposé), Normal (Rien), Normal."
  },
  {
    "nom": "Invulnérable",
    "polarite": "positive",
    "categorie": "Spécial",
    "cat_key": "Spécial",
    "domaine_a": "❤️ Vie",
    "domaine_b": "✨ Sacre",
    "sauvegarde": "",
    "effet": "Le personnage ne peux pas perdre connaissance à moins d'avoir dépasser ses limites de plus de 50% (pas de limites). Ceci est très dangereux."
  },
  {
    "nom": "Coma",
    "polarite": "negative",
    "categorie": "Spécial",
    "cat_key": "Spécial",
    "domaine_a": "☠️ Mort",
    "domaine_b": "🩸 Impie",
    "sauvegarde": "Robustesse",
    "effet": "Le personnage perd connaissance si il a atteint 33% (50%) des limites normales."
  },
  {
    "nom": "Veinard",
    "polarite": "positive",
    "categorie": "Spécial",
    "cat_key": "Spécial",
    "domaine_a": "🌀 Chaos",
    "domaine_b": "✨ Sacre",
    "sauvegarde": "",
    "effet": "Le personnage choisit un (deux) nouveau chiffre porte bonheur"
  },
  {
    "nom": "Poissard",
    "polarite": "negative",
    "categorie": "Spécial",
    "cat_key": "Spécial",
    "domaine_a": "⚖️ Loi",
    "domaine_b": "🩸 Impie",
    "sauvegarde": "Détermination",
    "effet": "Le personnage perd son (ses) chiffre(s) porte bonheur."
  },
  {
    "nom": "Réveillé",
    "polarite": "positive",
    "categorie": "Économie d'Action",
    "cat_key": "Action eco",
    "domaine_a": "☀️ Lumière",
    "domaine_b": "⚡ Foudre",
    "sauvegarde": "",
    "effet": "Le personnage ne peux pas perdre d'actions à cause d'effets (naturels ou non), jusqu'à un (tous) effet"
  },
  {
    "nom": "Sommeil",
    "polarite": "negative",
    "categorie": "Économie d'Action",
    "cat_key": "Action eco",
    "domaine_a": "🌑 Ombre",
    "domaine_b": "🧩 Mental",
    "sauvegarde": "Détermination",
    "effet": "Le personnage perd une action simple (deux actions simples) par rounds, cette condition est ignorée si le personnage a fait l'objet d'une interaction physique depuis son dernier round (une simple tape dans le dos en ACTL suffit, mais encore faut-il le faire), une action mentale n'a qu'une chance sur 2 de fonctionner"
  },
  {
    "nom": "Venin",
    "polarite": "negative",
    "categorie": "Économie d'Action",
    "cat_key": "Action eco",
    "domaine_a": "☢️ Toxique",
    "domaine_b": "🐗 Faune",
    "sauvegarde": "Robustesse",
    "effet": "Le personnage subit, au début de chaque tours, des dégats de rupture équivalants à 1 si D8<=4 et 2 si D8>=5 (+1) directement sur un attribut (dépends du venin)."
  },
  {
    "nom": "Poison",
    "polarite": "negative",
    "categorie": "Économie d'Action",
    "cat_key": "Action eco",
    "domaine_a": "☢️ Toxique",
    "domaine_b": "🐗 Faune",
    "sauvegarde": "Robustesse",
    "effet": "Le personnage subit, au début de chaque tours, des dégats de rupture équivalants à D8+4-mVIT (+6) directement sur l'endurance (PE) puis la vitalité (PV) si choqué."
  },
  {
    "nom": "Acide",
    "polarite": "negative",
    "categorie": "Économie d'Action",
    "cat_key": "Action eco",
    "domaine_a": "☢️ Toxique",
    "domaine_b": "🪷 Nature",
    "sauvegarde": "Robustesse",
    "effet": "Le personnage subit, au début de chaque tours, des dégats de rupture équivalants à D8 (+2) directement sur l'armure puis la vitalité (PV) si l'armure est réduite à 0."
  },
  {
    "nom": "Nécrose",
    "polarite": "negative",
    "categorie": "Économie d'Action",
    "cat_key": "Action eco",
    "domaine_a": "☠️ Mort",
    "domaine_b": "🩸 Impie",
    "sauvegarde": "Robustesse",
    "effet": "Le personnage subit, au début de chaque tours, des dégats de rupture équivalants à D8 (+2) directement sur la gravité des blessures."
  },
  {
    "nom": "Hémorragie",
    "polarite": "negative",
    "categorie": "Économie d'Action",
    "cat_key": "Action eco",
    "domaine_a": "⚔️ Acier",
    "domaine_b": "🩸 Impie",
    "sauvegarde": "Robustesse",
    "effet": "Le personnage subit, au début de chaque tours, des dégats de rupture équivalants à D8+mVIT (+2) directement sur la vitalité (PV)."
  },
  {
    "nom": "Saignement",
    "polarite": "negative",
    "categorie": "Économie d'Action",
    "cat_key": "Action eco",
    "domaine_a": "⚔️ Acier",
    "domaine_b": "🩸 Impie",
    "sauvegarde": "Robustesse",
    "effet": "Le personnage subit, au début de chaque tours, des dégats de rupture équivalants à D8 (+2) directement sur l'endurance (PE) puis la vitalité (PV) si choqué, les dégats sont subits une fois supplémentaire à la fin de chaque rounds si le personnage n'a pas utilisé une action simple pour atténuer son saignement"
  },
  {
    "nom": "Enflammé",
    "polarite": "negative",
    "categorie": "Économie d'Action",
    "cat_key": "Action eco",
    "domaine_a": "🔥 Feu",
    "domaine_b": "🩸 Impie",
    "sauvegarde": "Robustesse",
    "effet": "Le personnage subit, au début de chaque tours, des dégats de rupture équivalants à D8+4 (+6) de dégats physiques d'élément feu (calcule des dégats normaux, une seule lésion associée qui croit à mesure que les PV sont perdus)."
  },
  {
    "nom": "Brûlure",
    "polarite": "negative",
    "categorie": "Économie d'Action",
    "cat_key": "Action eco",
    "domaine_a": "🔥 Feu",
    "domaine_b": "⚕️ Corps",
    "sauvegarde": "Robustesse",
    "effet": "Le personnage subit, au début de chaque tours, des dégats de rupture équivalants à D8 (+2) directement sur l'endurance (PE) puis la vitalité (PV) si choqué."
  },
  {
    "nom": "Torture",
    "polarite": "negative",
    "categorie": "Économie d'Action",
    "cat_key": "Action eco",
    "domaine_a": "☠️ Mort",
    "domaine_b": "🩸 Impie",
    "sauvegarde": "Détermination",
    "effet": "Le personnage subit, au début de chaque tours, des dégats de rupture équivalants à D8+4-mVOL (+6) directement sur l'endurance (PE) puis la spiritualité (PS) si choqué."
  },
  {
    "nom": "Mélancolie",
    "polarite": "negative",
    "categorie": "Économie d'Action",
    "cat_key": "Action eco",
    "domaine_a": "🧩 Mental",
    "domaine_b": "⚜️ Charme",
    "sauvegarde": "Détermination",
    "effet": "Le personnage subit, au début de chaque tours, des dégats de rupture équivalants à D8+mVOL (+2) directement sur la spiritualité (PS)."
  },
  {
    "nom": "Rouille",
    "polarite": "negative",
    "categorie": "Économie d'Action",
    "cat_key": "Action eco",
    "domaine_a": "☢️ Toxique",
    "domaine_b": "⚔️ Acier",
    "sauvegarde": "Robustesse",
    "effet": "Le personnage subit, au début de chaque tours, des dégats de rupture équivalants à D8+2 (+4) directement sous forme de dégradation de l'armure."
  }
];

  const tbody   = document.getElementById('cond-tbody');
  const search  = document.getElementById('cond-search');
  const selPol  = document.getElementById('cond-polarite');
  const selCat  = document.getElementById('cond-categorie');
  const selDom  = document.getElementById('cond-domaine');
  const counter = document.getElementById('cond-count');

  let sortCol = 'nom';
  let sortAsc = true;

  function domTags(a, b) {
    return [a, b].filter(Boolean)
      .map(d => `<span class="dom-tag">${d}</span>`)
      .join(' ');
  }

  function render(list) {
    tbody.innerHTML = '';
    list.forEach(c => {
      const polBadge = c.polarite === 'positive'
        ? '<span class="badge badge-pos">Positive</span>'
        : '<span class="badge badge-neg">Négative</span>';
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${c.nom}</strong></td>
        <td>${polBadge}</td>
        <td>${c.categorie}</td>
        <td>${domTags(c.domaine_a, c.domaine_b)}</td>
        <td>${c.sauvegarde || ''}</td>
        <td>${c.effet}</td>
      `;
      tbody.appendChild(tr);
    });
    counter.textContent = list.length + ' condition' + (list.length !== 1 ? 's' : '');
  }

  function filter() {
    const q   = search.value.toLowerCase();
    const pol = selPol.value;
    const cat = selCat.value;
    const dom = selDom.value;

    let list = DATA.filter(c => {
      if (pol && c.polarite !== pol) return false;
      if (cat && c.categorie !== cat) return false;
      if (dom && c.domaine_a !== dom && c.domaine_b !== dom) return false;
      if (q && !c.nom.toLowerCase().includes(q) &&
               !c.effet.toLowerCase().includes(q) &&
               !c.categorie.toLowerCase().includes(q)) return false;
      return true;
    });

    list = list.slice().sort((a, b) => {
      const va = (a[sortCol] || '').toLowerCase();
      const vb = (b[sortCol] || '').toLowerCase();
      return sortAsc ? va.localeCompare(vb) : vb.localeCompare(va);
    });

    render(list);
  }

  search.addEventListener('input', filter);
  selPol.addEventListener('change', filter);
  selCat.addEventListener('change', filter);
  selDom.addEventListener('change', filter);

  document.querySelectorAll('#cond-table th[data-col]').forEach(th => {
    th.addEventListener('click', () => {
      if (sortCol === th.dataset.col) sortAsc = !sortAsc;
      else { sortCol = th.dataset.col; sortAsc = true; }
      filter();
    });
  });

  filter();
})();
</script>
