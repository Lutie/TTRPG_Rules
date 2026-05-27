# École de Destruction

<div id="mpv-app">

<div class="mpv-filters">
  <input type="text" id="mpv-search" placeholder="Rechercher (nom, latin, arcanique, description…)" />
  <select id="mpv-type">
    <option value="">Tous les types</option>
    <option value="Interruption">Interruption</option>
<option value="Pouvoir">Pouvoir</option>
  </select>
  <select id="mpv-target">
    <option value="">Toutes les cibles</option>
    <option value="Cible">Cible</option>
<option value="Lieu">Lieu</option>
<option value="Objet">Objet</option>
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
    "vulgar": "Destruction",
    "latin": "Ruptura (Rupture)",
    "arcane": "Kinrupt (Kin + rupt)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🔥 Feu: Kinruptar (vs FOR), ❄️ Glace: Kinruptis (vs DEX), ⚡ Foudre: Kinruptor (vs AGI), ☠️ Mort: Kinruptus (vs CON), ☢️ Toxique: Kinruptex (vs CON), ⚔️ Acier: Kinruptan (vs FOR, DEX, AGI, PER), 🌿 Flore: Kinruptiln (vs PER)",
    "description": "Produit un effet d'attaque physique (armure) infligeant [Magnitude] de dégats physique (PV) basés sur l'élément [clé]."
  },
  {
    "num": 2,
    "vulgar": "Conjuration",
    "latin": "Iungo (Joindre)",
    "arcane": "Keljung (Kel + jung)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "✡️ Arcane: Keljungys (vs MAG)",
    "description": "Produit un effet d'attaque physique (armure) infligeant [Magnitude x0.66] de dégats physique (PV) basés sur l'élément des arcanes."
  },
  {
    "num": 3,
    "vulgar": "Mystification",
    "latin": "Occulto (Cacher)",
    "arcane": "Krucclt (Kru + cclt)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🎭 Illusion: Kruccltin (vs VOL)",
    "description": "Produit un effet d'attaque physique (armure) infligeant [Magnitude] de dégats mentaux (PS) basés sur l'élément [clé]."
  },
  {
    "num": 4,
    "vulgar": "Annihilation",
    "latin": "Nihil (Rien)",
    "arcane": "Kranihil (Kra + nihil)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚖️ Loi: Kranihilem (vs VOL), 🌀 Chaos: Kranihilix (vs VOL), ✨ Sacre: Kranihiliel (vs SAG), 🩸 Impie: Kranihilun (vs RUS)",
    "description": "Produit un effet d'attaque mentale (résolution) infligeant [Magnitude] de dégats physique (PV) basés sur l'élément [clé]."
  },
  {
    "num": 5,
    "vulgar": "Profanation",
    "latin": "Profano (Souiller)",
    "arcane": "Kaprofan (Ka + profan)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🧩 Mental: Kaprofanend (vs VOL)",
    "description": "Produit un effet d'attaque mentale (résolution) infligeant [Magnitude] de dégats mentaux (PS) basés sur l'élément [clé]."
  },
  {
    "num": 6,
    "vulgar": "Transgression",
    "latin": "Gressus (Pas, marche)",
    "arcane": "Kintrans (Kin + trans)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚖️ Loi: Kintransem (vs VOL)",
    "description": "Produit un effet d'attaque mentale (résolution) infligeant [Magnitude] de dégats karmique (PK) basés sur l'élément [clé]."
  },
  {
    "num": 7,
    "vulgar": "Expiation",
    "latin": "Luo (Payer, laver)",
    "arcane": "Krulex (Kru + lex)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "☢️ Toxique: Krulexex (vs VOL)",
    "description": "Produit un effet d'attaque mentale (résolution) infligeant [Magnitude] de dégats pranique (PC) basés sur l'élément [clé]."
  },
  {
    "num": 8,
    "vulgar": "Distorsion",
    "latin": "Torsio (Torsion)",
    "arcane": "Keltor (Kel + tor)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "✡️ Arcane: Keltorys (vs MAG)",
    "description": "Produit un effet d'attaque mentale (résolution) infligeant [Magnitude] de dégats arcanique (PM) basés sur l'élément [clé]."
  },
  {
    "num": 9,
    "vulgar": "Eradication",
    "latin": "Radix (Racine)",
    "arcane": "Karadix (Ka + radix)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "☀️ Lumière: Karadixion (vs PER), 🌑 Ombre: Karadixoth (vs PER), ☢️ Toxique: Karadixex (vs CON)",
    "description": "Produit un effet d'attaque (ni armure, ni résolution) infligeant [Magnitude/2] de dégats physique (PV) basés sur l'élément [clé]."
  },
  {
    "num": 10,
    "vulgar": "Dévastation",
    "latin": "Vasto (Je dévaste)",
    "arcane": "Kordevast (Kor + devast)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "☀️ Lumière: Kordevastion (vs SAG), 🌑 Ombre: Kordevastoth (vs SAG)",
    "description": "Produit un effet d'attaque (ni armure, ni résolution) infligeant [Magnitude/2] de dégats mentaux (PS) basés sur l'élément [clé]."
  },
  {
    "num": 11,
    "vulgar": "Commotion",
    "latin": "Moveo (Bouger, remuer)",
    "arcane": "Krucomov (Kru + comov)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "✨ Sacre: Krucomoviel (vs SAG), 🩸 Impie: Krucomovun (vs RUS)",
    "description": "Produit un effet d'attaque physique (armure) infligeant [Magnitude x1.5] de dégats physique choquants (condition physique de choc, en état de choc si charge > PV actuelles) basés sur l'élément [clé] (état de choc = épuisé, actions -2)."
  },
  {
    "num": 12,
    "vulgar": "Perturbation",
    "latin": "Turbo (Troubler)",
    "arcane": "Kraturb (Kra + turb)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🎭 Illusion: Kraturbin (vs VOL)",
    "description": "Produit un effet d'attaque mentale (résolution) infligeant [Magnitude x1.5] de dégats mentaux choquants (condition mentale de choc, en état de choc si charge > PS actuelles) basés sur l'élément [clé] (état de choc = épuisé, actions -2)."
  },
  {
    "num": 13,
    "vulgar": "Ruine",
    "latin": "Ruina (Chute)",
    "arcane": "Keluina (Kel + ruina)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "☢️ Toxique: Keluinaex (vs EQU)",
    "description": "Produit un effet d'attaque (ni armure, ni résolution) infligeant [Magnitude x1] de dégats mixtes choquants (condition mixte de choc, en état de choc si charge > PV ou PS actuelles) basés sur l'élément [clé] (état de choc = épuisé, actions -2)."
  },
  {
    "num": 14,
    "vulgar": "Percussion",
    "latin": "Percutio (Frapper)",
    "arcane": "Kortio (Kor + tio)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🪨 Terre: Kortioum (vs FOR), 💧 Eau: Kortioun (vs DEX), 🌪️ Air: Kortioel (vs AGI)",
    "description": "Produit un effet d'attaque physique (armure) infligeant [Magnitude] de dégats physique temporaires (PE puis PV) basés sur l'élément [clé], le jet est assuré (minimum des dés 4) et majoré (+1 par dés)."
  },
  {
    "num": 15,
    "vulgar": "Suggestion",
    "latin": "Gero (Porter)",
    "arcane": "Krusuger (Kru + suger)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🧩 Mental: Krusugerend (vs VOL)",
    "description": "Produit un effet d'attaque mentale (résolution) infligeant [Magnitude] de dégats mentaux temporaires (PE puis PS) basés sur l'élément [clé], le jet est assuré (minimum des dés 4) et majoré (+1 par dés)."
  },
  {
    "num": 16,
    "vulgar": "Attrition",
    "latin": "Tero (Frotter, user)",
    "arcane": "Kratrit (Kra + trit)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "☢️ Toxique: Kratritex (vs CON), 🪷 Nature: Kratritn eil (vs CON)",
    "description": "Produit un effet d'attaque (ni armure, ni résolution) infligeant [Magnitude] de dégats physique temporaires (PE puis PV) basés sur l'élément [clé]."
  },
  {
    "num": 17,
    "vulgar": "Dissipation",
    "latin": "Dissipo (Je disperse)",
    "arcane": "Kadisipo (Ka + disipo)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "☢️ Toxique: Kadisipoex (vs VOL), ✡️ Arcane: Kadisipoys (vs MAG)",
    "description": "Produit un effet d'attaque (ni armure, ni résolution) infligeant [Magnitude] de dégats mentaux temporaires (PE puis PS) basés sur l'élément [clé]."
  },
  {
    "num": 18,
    "vulgar": "Corrosion",
    "latin": "Rodo (Je ronge)",
    "arcane": "Kinrado (Kin + rado)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🔥 Feu: Kinradoar (vs FOR), ☠️ Mort: Kinradous (vs CON)",
    "description": "Produit un effet d'attaque physique (armure) infligeant [Magnitude x1.5] de dégats physique continue (PE puis PV) basés sur l'élément [clé], le jet est assuré (minimum des dés 4) et majoré (+1 par dés)."
  },
  {
    "num": 19,
    "vulgar": "Obsession",
    "latin": "Sedeo (Être assis)",
    "arcane": "Kruobsid (Kru + obsid)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🧩 Mental: Kruobsidend (vs VOL)",
    "description": "Produit un effet d'attaque mentale (résolution) infligeant [Magnitude x1.5] de dégats mentaux continues (PE puis PS) basés sur l'élément [clé], le jet est assuré (minimum des dés 4) et majoré (+1 par dés)."
  },
  {
    "num": 20,
    "vulgar": "Perdition",
    "latin": "Perdo (Je perds)",
    "arcane": "Kraperd (Kra + perd)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "☢️ Toxique: Kraperdex (vs CON)",
    "description": "Produit un effet d'attaque (ni armure, ni résolution) infligeant [Magnitude x1.5] de dégats physique continues (PE puis PV) basés sur l'élément [clé]."
  },
  {
    "num": 21,
    "vulgar": "Dérision",
    "latin": "Rideo (Rire)",
    "arcane": "Kinrideo (Kin + rideo)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "☢️ Toxique: Kinrideoex (vs VOL)",
    "description": "Produit un effet d'attaque (ni armure, ni résolution) infligeant [Magnitude x1.5] de dégats mentaux continues (PE puis PS) basés sur l'élément [clé]."
  },
  {
    "num": 22,
    "vulgar": "Gravitation",
    "latin": "Gravis (Lourd)",
    "arcane": "Korgrav (Kor + grav)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "💢 Vide: Korgravarh (vs CON)",
    "description": "Produit un effet d'attaque (ni armure, ni résolution) infligeant [Magnitude x1.5] / [Magnitude x1.25] / [Magnitude x1] / [Magnitude x0.75] de dégats physique (PV), les dégats permanents et temporaires ne peuvent respectivement être supérieur au cinquième / quart / tier / moitié de la vitalité et de l'endurance actuels, le choix est à effectuer à la création du sort."
  },
  {
    "num": 23,
    "vulgar": "Relativité",
    "latin": "Refero (Rapporter)",
    "arcane": "Krurelat (Kru + relat)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "4",
    "drain": "6",
    "keys": "💢 Vide: Krurelatarh (vs CON)",
    "description": "Produit un effet d'attaque (ni armure, ni résolution) infligeant [Magnitude x1.5] / [Magnitude x1.25] / [Magnitude x1] / [Magnitude x0.75] de dégats physique (PV), les dégats permanents et temporaires ne peuvent respectivement être supérieur au cinquième / quart / tier / moitié de la vitalité et de l'endurance maximum, le choix est à effectuer à la création du sort."
  },
  {
    "num": 24,
    "vulgar": "Lésion",
    "latin": "Laedo (Blesser)",
    "arcane": "Kralesi (Kra + lesi)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "☠️ Mort: Kralesius",
    "description": "Génère un effet infligeant une blessure de gravité [Magnitude], la sauvegarde d'opposition modifie ce gain."
  },
  {
    "num": 25,
    "vulgar": "Traumatisation",
    "latin": "Vulnus (Blessure)",
    "arcane": "Kavulnus (Ka + vulnus)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🧩 Mental: Kavulnusend",
    "description": "Génère un effet infligeant un trauma de gravité [Magnitude], la sauvegarde d'opposition modifie ce gain."
  },
  {
    "num": 26,
    "vulgar": "Exténuation",
    "latin": "Tenuo (Rendre mince/faible)",
    "arcane": "Keltenua (Kel + tenua)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🪷 Nature: Keltenuaeil",
    "description": "Génère un effet infligeant un gain de [Magnitude/4] en fatigue, la sauvegarde d'opposition modifie ce gain."
  },
  {
    "num": 27,
    "vulgar": "Damnation",
    "latin": "Damno (Condamner)",
    "arcane": "Krudamn (Kru + damn)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "✡️ Arcane: Krudamnys",
    "description": "Génère un effet infligeant un gain de [Magnitude/4] en corruption, la sauvegarde d'opposition modifie cette perte."
  },
  {
    "num": 28,
    "vulgar": "Inhibition",
    "latin": "Habeo (Tenir, retenir)",
    "arcane": "Krainhib (Kra + inhib)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "4",
    "drain": "4",
    "keys": "💢 Vide: Krainhibarh",
    "description": "Génère un effet infligeant la perte de [Magnitude/2] points d'initiative, la sauvegarde d'opposition modifie cette perte."
  },
  {
    "num": 29,
    "vulgar": "Putréfaction",
    "latin": "Putris (Pourri)",
    "arcane": "Kaputre (Ka + putre)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🪷 Nature: Kaputreeil",
    "description": "Produit un effet d'attaque (ni armure, ni résolution) infligeant [Magnitude/10] par points de corruption de la cible de dégats physique & mentaux temporaires (PE puis PV et PS) basés sur l'élément [clé]."
  },
  {
    "num": 30,
    "vulgar": "Détérioration",
    "latin": "Pessum (Au pire)",
    "arcane": "Kinpessum (Kin + pessum)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚕️ Corps: Kinpessumen (Force, Dextérité, Agilité, Perception, Constitution)",
    "description": "Produit un effet infligeant une perte de [Magnitude]/5 points d'un attribut du corps associé à [clé] (vs EQU) (peux être soigné sans magie au même titre que des lésions)."
  },
  {
    "num": 31,
    "vulgar": "Atonation",
    "latin": "Tonus (Tension)",
    "arcane": "Kruaton (Kru + aton)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🧠 Esprit: Kruatonys (Charisme, Intelligence, Ruse, Sagesse, Volonté)",
    "description": "Produit un effet infligeant une perte de [Magnitude]/5 points d'un attribut de l'esprit associé à [clé] (vs EQU) (peux être soigné sans magie au même titre que des lésions)."
  },
  {
    "num": 32,
    "vulgar": "Fragmentation",
    "latin": "Frango (Je brise)",
    "arcane": "Krafrag (Kra + frag)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "✡️ Arcane: Krafragys (Magie), ⚖️ Loi: Krafragem (Chance), ⚕️ Corps: Krafragen (Stature, Taille), 🧠 Esprit: Krafragys (Ego, Apparence), 🪷 Nature: Krafrageil (Equilibre)",
    "description": "Produit un effet infligeant une perte de [Magnitude]/5 points d'un attribut secondaire associé à [clé] (vs EQU) (peux être soigné sans magie au même titre que des lésions)."
  },
  {
    "num": 33,
    "vulgar": "Dématérialisation",
    "latin": "Materia (Matière)",
    "arcane": "Keldemater (Kel + demater)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🪨 Terre: Keldematerum, 💧 Eau: Keldemateryn, 🌪️ Air: KeldemaTerrel",
    "description": "Produit un effet qui détruit [Magnitude/5] d'unités solide, [Magnitude] d'unités gazeux ou [Magnitude/2] d'unités liquide, une unité vaux 1 case x 1 case, affecte un élément vulgaire qui dépends de la [clé]."
  },
  {
    "num": 34,
    "vulgar": "Hallucination",
    "latin": "Luceo (Briller)",
    "arcane": "KorhaLu (Kor + hallu)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🎭 Illusion: KorhaLuin (Mirage)",
    "description": "Produit un effet infligeant [Magnitude] dégats mentaux iLusoire [clé]."
  },
  {
    "num": 35,
    "vulgar": "Intimidation",
    "latin": "Timeo (Craindre)",
    "arcane": "Krutimid (Kru + timid)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🧩 Mental: Krutimidend (Charisme, Intelligence, Ruse, Sagesse, Volonté)",
    "description": "Produit un effet infligeant [Magnitude] dégats mentaux de type [clé] (vs Attribut)."
  },
  {
    "num": 36,
    "vulgar": "Délabrement",
    "latin": "???",
    "arcane": "???",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🔥 Feu: Kralapsar, ❄️ Glace: Kralapsis, ⚡ Foudre: Kralapsor",
    "description": "Produit un effet supprimant [Magnitude]/2 de m³ de matière qui ne constitue pas une structure via [clé]."
  },
  {
    "num": 37,
    "vulgar": "Privation",
    "latin": "Privo (Enlever)",
    "arcane": "Kaprivo (Ka + privo)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "4",
    "drain": "2",
    "keys": "🛡️ Guerre: Kaprivoorr (Garde, Rage ou Adrénaline), ⚜️ Charme: Kaprivoynh (Audace, etc), 🔥 Feu: Kaprivoar (Garde), ❄️ Glace: Kaprivois (Rage), ⚡ Foudre: Kaprivoor (Adréaline), 🪨 Terre: Kaprivoum (Initiative), 💧 Eau: Kaprivoun (Initiative), 🌪️ Air: Kaprivoel (Initiative), ⚖️ Loi: Kaprivrag (Karma), ☠️ Mort: Kaprivous (Vitalité), ⚕️ Corps: Kaprivoen (Vitalité), 🧠 Esprit: Kaprivoys (Psyché), ⚜️ Charme: Kaprivoynh (Psyché), ✡️ Arcane: Kaprivoys (Mana), 🪷 Nature: Kaprivoeil (Chi), ☢️ Toxique: Kaprivoex (endurance)",
    "description": "Produit un effet infligeant [Magnitude]/2 de perte en ressource de type [clé], les ressources temporaires (pas l'initiative) sont perdus au rythme de [Magnitude] à la place."
  },
  {
    "num": 38,
    "vulgar": "Désintégration",
    "latin": "Integro (Intégrité)",
    "arcane": "Korintegr (Kor + integr)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🔥 Feu: Korintegrar, ❄️ Glace: Korintegris, ⚡ Foudre: Korintegror",
    "description": "Produit un effet infligeant [Magnitude] dégats structurels via [clé]."
  },
  {
    "num": 39,
    "vulgar": "Dévitalisation",
    "latin": "Vita (Vie)",
    "arcane": "Kruvit (Kru + vit)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🪷 Nature: Kruviteil",
    "description": "La cible perd 2 points d'endurance (PE) par mana temporaire qu'elle possède actuellement, pour un maximum [Magnitude x2]."
  },
  {
    "num": 40,
    "vulgar": "Sénescence",
    "latin": "Senex (Vieux)",
    "arcane": "Kinsenex (Kin + senex)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "💢 Vide: Kinsenexarh",
    "description": "La cible vieillit de [Magnitude/3] années, la cible autant de mourir que son (Âge - Espérance de vie / 4) x 2, un test de robustesse permet de réduire les effets de ce sort."
  },
  {
    "num": 41,
    "vulgar": "Obfuscation",
    "latin": "Fusco (Noircir)",
    "arcane": "Kafusc (Ka + fusc)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "📚 Savoir: Kafuscaum",
    "description": "Détruit l'indice, la piste ou autre information ciblé, rendue bien plus difficile à déchiffrer ou comprendre, un test d'intuition permet de savoir qu'une information a été supprimée et un test adapté de compétence peux permettre de retrouver, sinon la totalité, au moins les grandes lignes de l'information (sur une réussite critique c'est la totalité à la place), le sort n'altère pas le \"porteur\" de l'information pour autant, sur une cible vivante c'est la mémoire qui est généralement altéré, mais ce peux être des traces ou des marques sur le corps etc."
  },
  {
    "num": 42,
    "vulgar": "Déperdition",
    "latin": "Perdo (Je perds)",
    "arcane": "Kordeperd (Kor + deperd)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "☠️ Mort: Kordeperdus (Blessures), 🧩 Mental: Kordeperdend (Traumas)",
    "description": "Génère un effet qui duplique une lésion (physique ou mentale selon la clé), la copie ne peut dépasser une gravité de [Magnitude] (le niveau de gravité dépends donc de la protection de la cible à ce type de lésions, notons que la copie se base sur le degré de gravité x la protection pour déduire de la gravité de la lésion à copier)."
  },
  {
    "num": 43,
    "vulgar": "Aggravation",
    "latin": "Gravis (Lourd)",
    "arcane": "Keluagrav (Kel + agrav)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "☠️ Mort: Keluagravus",
    "description": "Produit un effet qui aggrave d'un rang toutes les lésions de la cible, pour un total de [Magnitude/2] de gravité (5 pour un rang supérieur), les lésions les plus graves sont aggravées en premier, sans effets si la cible n'a pas de lésions."
  },
  {
    "num": 44,
    "vulgar": "Mortification",
    "latin": "Mors (Mort)",
    "arcane": "Kramorti (Kra + morti)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "☠️ Mort: Kramortius",
    "description": "Produit un effet qui provoque la mort de la cible si ses PV sont inférieurs à [Magnitude], la cible peux effectuer un test de robustesse ET un test de détermination contre cet effet, les sauvegardes et leurs conséquences s'appliquent de façon consécutive."
  },
  {
    "num": 45,
    "vulgar": "Termination",
    "latin": "Terminus (Fin)",
    "arcane": "Katermin (Ka + termin)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🧩 Mental: Katerminend (Charisme, Intelligence, Ruse, Sagesse, Volonté)",
    "description": "Produit un effet qui provoque la mort de la cible si ses PS sont inférieurs à [Magnitude], la cible peux effectuer un test de robustesse ET un test de détermination contre cet effet, les sauvegardes et leurs conséquences s'appliquent de façon consécutive."
  },
  {
    "num": 46,
    "vulgar": "Abolition",
    "latin": "Abolitio (Suppression)",
    "arcane": "Kinelabol (Kin + abol)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "☢️ Toxique: Kinabol ex",
    "description": "Produit un effet qui provoque la mort de la cible si elle rate à la fois un test robustesse ET un test de détermination, les deux tests reçoivent un bonus de 5 mais aussi un malus équivalant [Magnitude/4] avec pour maximum 2x somme des pénalités relatives aux lésions (blessures et traumas), si la cible rate un des tests elle ne meurs pas mais elle ne peux plus réussire ce type de test jusqu'à la fin de la scène."
  },
  {
    "num": 47,
    "vulgar": "Déstabilisation",
    "latin": "Stabilis (Stable)",
    "arcane": "Krustabil (Kru + stabil)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "☠️ Mort: Krustabilus",
    "description": "Produit un effet qui force toutes les lésions de la cible sont déstabilisées si elles ont un rang équivalant ou inférieur à [Magnitude/10], la cible subit également des dégats choquants (catégorie 0 + total des lésions ainsi déstabilisées)."
  },
  {
    "num": 48,
    "vulgar": "Dégradation",
    "latin": "Cadus (Chute)",
    "arcane": "Kracadus (Kra + cadus)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "☠️ Mort: Kracadusus",
    "description": "Toutes les lésions de la cible subissent [Magnitude/10] aggravations (même règles que lorsque les lésions sont aggravées par des gestes brusques ou quand le temps passe)."
  },
  {
    "num": 49,
    "vulgar": "Décomposition",
    "latin": "Pono (Mettre, poser)",
    "arcane": "Kadepono (Ka + depono)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "☠️ Mort: Kadeponous",
    "description": "Génère un effet qui provoque l'explosion d'un corps mort, ce qui coRespond à une attaque de zone affectant les cibles à proximités, infligeant [Magnitude] dégats choquants, si le sort est en zone alors plusieurs cadavres peuvent exploser (et si ils sont regroupés ils peuvent tous toucher la/les mêmes cibles)."
  },
  {
    "num": 50,
    "vulgar": "Dissolution",
    "latin": "Solvo (Délier)",
    "arcane": "Kordisol (Kor + disol)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "✡️ Arcane: Kordisolys",
    "description": "Génère un effet qui réduit une barrière (magique ou technologique) de [Magnitude] (majoré)."
  },
  {
    "num": 51,
    "vulgar": "Convulsion",
    "latin": "Vello (Arracher)",
    "arcane": "Kelvello (Kel + vello)",
    "word_type": "Pouvoir",
    "target_type": "Lieu",
    "difficulty": "2",
    "drain": "2",
    "keys": "🌀 Chaos: Kelvelloix",
    "description": "Génère un effet qui créée une (ou des) entité(s) magique (voir la règle concernant les entités magiques) de type Vortex sur le lieu ciblé. La (ou les) entitées se dispersent sur le champs en ciblant (chacunes) une cibles aléatoires (plusieurs vortex peuvent avoir la même cible) dans la zone, priorisant les cibles à portée de leur déplacement, une fois le déplacement terminé les cibles adjacentes à l'entité subit des dégats choquants (ignorant l'armure) basé sur la magnitude de l'entité, la cible effectue alors un test de réflexe qui modifie ces dégats."
  },
  {
    "num": 52,
    "vulgar": "Anticyclone",
    "latin": "???",
    "arcane": "???",
    "word_type": "Pouvoir",
    "target_type": "Lieu",
    "difficulty": "2",
    "drain": "2",
    "keys": "🌪️ Air",
    "description": "Génère un effet qui créée une (ou des) entité(s) magique (voir la règle concernant les entités magiques) de type Cyclone sur le lieu ciblé. La (ou les) entitées se dispersent sur le champs en ciblant (chacunes) une direction aléatoire (un cyclone par direction maximum, la direction est décidé via 1D8 en tenant compte des diagonales) dans la zone, sans tenir compte des cibles en présence ou non, toutes les cibles traversées par l'entitée subissent des dégats choquants (ignorant l'armure) basé sur la magnitude de l'entité, la cible effectue alors un test de réflexe qui modifie ces dégats."
  },
  {
    "num": 53,
    "vulgar": "Exhumation",
    "latin": "Humus (Terre)",
    "arcane": "Kraxhum (Kra + xhum)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "☠️ Mort: Kraxhumus",
    "description": "Génère un effet qui créée une (ou des) entité(s) magique (voir la règle concernant les entités magiques) de type Ossement ou Esprit (au choix) sur le lieu ciblé. La (ou les) entitées se dispersent sur le champs en ciblant (chacunes) une cible proche, priorisant LA ou LES plus proches (les entités peuvent avoir la même cible mais doivent équilibrer le nombre si possible) dans la zone, priorisant les cibles à portée de leur déplacement, une fois le déplacement terminé une cible adjacente à l'entité subit des dégats perçant (ignorant la moitié de l'absorption) basé sur la magnitude de l'entité, la cible effectue alors un test de robustesse ou détermination, selon le type d'entité, qui modifie ces dégats."
  },
  {
    "num": 54,
    "vulgar": "Amnésiation",
    "latin": "Memoria (Mémoire)",
    "arcane": "Kinmemo (Kin + memo)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🧩 Mental: Kinmemoend",
    "description": "Génère un effet qui supprime de la mémoire d'une cible un élément (personne, scène, objet ou lieu), le sort a un potenciel de [Magnitude²], le temps auquel remonte la mémoire réduit d'autant le potenciel, chaque minutes nécessite 1 de potenciel, un test de détermination peux être effectué par la cible et si réussie le sort ne fonctionne pas."
  },
  {
    "num": 55,
    "vulgar": "Conflagration",
    "latin": "Flagrare (Brûler)",
    "arcane": "Korflag (Kor + flag)",
    "word_type": "Pouvoir",
    "target_type": "Objet",
    "difficulty": "2",
    "drain": "2",
    "keys": "🔥 Feu: Korflagar",
    "description": "Génère un effet qui oblige l'objet à réaliser [Magnitude/5] tests de solidité."
  },
  {
    "num": 56,
    "vulgar": "Suppression",
    "latin": "Premo (Presser)",
    "arcane": "Krupremo (Kru + premo)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "☠️ Mort: Krupremous (PV), 🧩 Mental: Krupremoend (PS)",
    "description": "Si la cible a moins de [Magnitude/2] PV ou PS (selon la clé) actuels elle est mise KO, elle peux réaliser un test de robustesse ou détermination (selon clé)."
  },
  {
    "num": 57,
    "vulgar": "Exsanguination",
    "latin": "Sanguis (Sang)",
    "arcane": "Krasangui (Kra + sangui)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "☠️ Mort: Krasanguius (robustesse), 🧩 Mental: Krasanguiend (détermination)",
    "description": "Si la cible a moins de [Magnitude] PE elle perd tous ses PE et est mise en état de choc, elle peux réaliser un test de robustesse ou détermination (selon clé)."
  },
  {
    "num": 58,
    "vulgar": "Scarification",
    "latin": "Scara (Coupure)",
    "arcane": "Kascar (Ka + scar)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "☠️ Mort: Kascarus (blessure), 🧩 Mental: Kascarend (trauma)",
    "description": "Génère un total de [Magnitude/5] lésions de type blessure ou traumatisme (selon clé), ces lésions sont des égratinures (mais elles peuvent être enregistrées comme des lésions bien pire si la cible a trop de lésions de ce type, tel que le prévoit les règles)."
  },
  {
    "num": 59,
    "vulgar": "Fission",
    "latin": "Fissura (Fissure)",
    "arcane": "Korfiss (Kor + fiss)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🪨 Terre: Korfissum",
    "description": "Génère un effet qui oblige tous les objets porté par la cible à réaliser un test solidité, ces tests sont réalisés avec une difficulté réduite de 3 puis augmentée de [Magnitude/4]."
  },
  {
    "num": 60,
    "vulgar": "Condamnation",
    "latin": "Damno (Condamner)",
    "arcane": "Krudamnat (Kru + damnat)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚡ Foudre: Krudamnator",
    "description": "Génère un effet qui marque la cible du sort, au prochain cycle si la cible à le ciel au dessus d'elle la foudre s'abattra sur elle lui infligeant [Magnitude] de dégats perçant (ignore la moitié de l'absorption) physique (PV) de foudre, la cible peux réaliser un test de réflexe mais l'attaque touche forcément, on considère que la cible est prise au dépourvue (note: à moins de ressentir la magie personne n'est en mesure de savoir si un lieu a été ainsi marqué)."
  },
  {
    "num": 61,
    "vulgar": "Exaction",
    "latin": "Ago (Agir)",
    "arcane": "Kinago (Kin + ago)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🌀 Chaos: Kinagoix",
    "description": "Génère un effet qui fait perdre autant de ressources permanentes que de ressources temporaires, maximum [Magnitude/2], puis autant de ressources temporaires sont perdues."
  },
  {
    "num": 62,
    "vulgar": "Conversion",
    "latin": "Vert (Tourner)",
    "arcane": "Kaverto (Ka + verto)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "❤️ Vie: Kavertoir",
    "description": "Produit un effet d'attaque (ni armure, ni résolution) infligeant autant de dégats physique (PV) que de PV temporaires et autant de dégats mentaux (PS) que de PS temporaires de la cible, pour un maximum [Magnitude]."
  },
  {
    "num": 63,
    "vulgar": "Corruption",
    "latin": "Rumpo (Briser)",
    "arcane": "Korrupt (Kor + rupt)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🪷 Nature: Korrupteil (fatigue, venin), ☢️ Toxique: Korruptex (poison, acide), ☠️ Mort: Korruptus (nécrose), 🩸 Impie: Korruptun (hémorragie), ⚔️ Acier: Korruptan (saignement), 🔥 Feu: Korruptar (enflammé, brûlure), 🧩 Mental: Korruptend (torture, regret)",
    "description": "Génère un effet infligeant une condition de rupture (DOT), la cible peux réaliser un test de sauvegarde (qui dépend de la condition)."
  },
  {
    "num": 64,
    "vulgar": "Déincarnation",
    "latin": "Caro (Chair)",
    "arcane": "Krucarno (Kru + carno)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "☠️ Mort: Crucarnous",
    "description": "Génère un effet qui brise l'âme d'un mort et détruit celle-ci, privant l'individu de son cycle de réincarnation, l'âme peux réaliser un test de sauvegarde (réussir signifie annuler ces effets), l'âme doit avoir été mis hors d'état (ou ne doit pas être en mesure de se manifester pour se défendre)."
  },
  {
    "num": 65,
    "vulgar": "Déflagration",
    "latin": "Flagrare (Brûler)",
    "arcane": "Kraflagr (Kra + flagr)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚡ Foudre: Kraflagror",
    "description": "Génère un effet qui provoque un test de solidité pour tous les consommables \"fragiles\" transporté par la cible (tel que les potions), le test en question se fait avec un bonus de 5 au test mais avec une pénalité de [Magnitude/4], un tel objet est généralement détruit si le test est raté mais pas nécessairement, cela dépend de sa \"catégorie\" (voir régle de la solidité)."
  },
  {
    "num": 66,
    "vulgar": "Extinction",
    "latin": "Tingo (Éteindre)",
    "arcane": "Katingo (Ka + tingo)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "6",
    "drain": "6",
    "keys": "☠️ Mort: Katingous",
    "description": "Produit un effet qui met les PV et PS de la cible à 0, chaque perte est lié à un test de sauvegarde adapté (robustesse pour les PV et détermination pour les PS), les deux tests reçoivent un bonus de 5 mais aussi un malus équivalant [Magnitude/5], un test réussis permet de diviser la perte par deux, un test critique réussis permet d'ignorer cette partie de l'effet, un test échoué provoque donc la perte de tous les PV ou PS restants (amenant ces derniers à 0), un test qui échoue de façon critique amène les PV ou PS à leurs maximum dans le négatif, ce sort n'affecte pas les cibles dont le rang est supérieur ou égale à celui du lanceur de sort."
  },
  {
    "num": 67,
    "vulgar": "Démoralisation",
    "latin": "Mos (Mœurs, caractère)",
    "arcane": "Keldemos (Kel + demos)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚜️ Charme: Keldemosynh",
    "description": "Génère un effet infligeant [Magnitude/2] de perte au moral de la cible, la moitié de la perte qui n'a pas pu être infligée au moral passe sur l'endurance."
  },
  {
    "num": 68,
    "vulgar": "Magnétisme",
    "latin": "???",
    "arcane": "???",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "4",
    "drain": "4",
    "keys": "⚡ Foudre",
    "description": "Produit un effet d'attaque physique (armure) infligeant des dégats physique (PV) à hauteur de [Magnitude]% des PE actuels de la cible."
  },
  {
    "num": 69,
    "vulgar": "Stalagmite",
    "latin": "???",
    "arcane": "???",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🪨 Terre",
    "description": "Génère un effet qui cible un lieu en hauteur constitué de pierre et le marque, au prochain cycle de la roche se fend et tombe pour percuter ceux qui sont positionné sous le lieu en question, infligeant [Magnitudex2] de dégats physique choquants de terre, la cible peux réaliser un test de réflexe, on considère que la cible est prise au dépourvue (note: à moins de ressentir la magie personne n'est en mesure de savoir si un lieu a été ainsi marqué), fonctionne aussi sur un sol constitué de pierre (et dans ce cas la pierre jaillit du sol)."
  },
  {
    "num": 70,
    "vulgar": "Démarquage",
    "latin": "???",
    "arcane": "???",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "📚 Savoir",
    "description": "Génère un effet qui permet au lanceur de sort de détruire au moins une marque magique sur la cible, tant que ces dernières ont une magnitude inférieure à ce sort, il n'est pas possible de savoir si le sort a fait effet ou si il reste des marques sans employer d'autres moyens (tel qu'un sort de divination)."
  },
  {
    "num": 71,
    "vulgar": "Ponction",
    "latin": "???",
    "arcane": "???",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🩸 Impie",
    "description": "Produit un effet d'attaque (ni armure, ni résolution) infligeant [Magnitude/3] de dégats physique (PV) basés sur l'élément [clé], le lanceur du sort perçoit les PV ainsi perdus par la cible sous forme de PV (affectés par les règles de fatigue) ou PV temporaires (limités par la résilience)."
  },
  {
    "num": 72,
    "vulgar": "Implaccable",
    "latin": "???",
    "arcane": "???",
    "word_type": "Interruption",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🩸 Impie",
    "description": "Produit un effet d'attaque physique (armure) infligeant [Magnitude] de dégats physique (PV) basés sur l'élément [clé], le sort ne peux être lancé qu'après avoir perdu des PVs suite à une attaque, la cible doit être l'auteur et unique."
  },
  {
    "num": 73,
    "vulgar": "Rétribution",
    "latin": "???",
    "arcane": "???",
    "word_type": "Interruption",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🩸 Impie",
    "description": "Produit un effet d'attaque mentale (résolution) infligeant [Magnitude] de dégats mentaux (PS) basés sur l'élément [clé], le sort ne peux être lancé qu'après avoir perdu des PSs suite à une attaque, la cible doit être l'auteur et unique."
  },
  {
    "num": 74,
    "vulgar": "Conséquence",
    "latin": "???",
    "arcane": "???",
    "word_type": "Interruption",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚖️ Loi",
    "description": "Produit un effet d'attaque (ni armure, ni résolution) infligeant [Magnitude] de dégats temporaires (PE) basés sur l'élément [clé], le sort ne peux être lancé que si une créature dans la zone a perdu des PV ou des PS suite à une attaque, la cible doit être l'auteur et unique."
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
