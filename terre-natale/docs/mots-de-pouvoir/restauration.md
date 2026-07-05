# École de Restauration

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
    "vulgar": "Restauration",
    "latin": "Instauro (Je rétablis)",
    "arcane": "Restaura (Re + staura)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "❤️ Vie: Restaurair (PV), 🧩 Mental: Restauraend (PS), 🌀 Chaos: Restauraix (PK), ⚕️ Corps: Restauraen (PC), 🧠 Esprit: Restaurays (PC), 🔮 Magie: Restaurairn (PM), 🪷 Nature: Restauraeiln (PC/PE/fatigue)",
    "description": "Produit un soin de [Magnitude/2] visant une ressource qui dépends de la [clé], ce soin n'est pas dispensé des règles des soins naturels et de la fatigue (voir guérison dans les règles de base)."
  },
  {
    "num": 2,
    "vulgar": "Vivification",
    "latin": "Vita (Vie)",
    "arcane": "Renvita (Ren + vita)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🔥 Feu, ❄️ Glace, ⚡ Foudre, 🪨 Terre, 💧 Eau, 🌪️ Air, ☀️ Lumière, 🌑 Ombre, ⚖️ Loi, 🌀 Chaos, 💢 Vide, ❤️ Vie, ☢️ Toxique, ✨ Sacre, 🩸 Impie, ☠️ Mort, 🎭 Illusion, 🌿 Flore, 🐗 Faune, 🛡️ Guerre, ⚔️ Acier, ✡️ Arcane, 🪷 Nature",
    "description": "Produit un soin de [Magnitude/2] pour les PV & PS ainsi qu'une recharge d'autant de charges de l'invocation ciblée (dont le type correspond à la [clé] utilisée)."
  },
  {
    "num": 3,
    "vulgar": "Revitalisation",
    "latin": "Vigor (Force, Vigueur)",
    "arcane": "Ryuvigo (Ryu + vigo)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🪷 Nature: Ryuvigoeiln",
    "description": "Produit un soin de l'endurance (PE) équivalant à la moitié des PE manquants, avec pour maximum [Magnitude], ce soin est dispensé des règles des soins naturels et de la fatigue."
  },
  {
    "num": 4,
    "vulgar": "Réinvigoration",
    "latin": "Roboro (Je fortifie)",
    "arcane": "Rhorobor (Rho + robor)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🪷 Nature: Rhoroboreiln",
    "description": "Produit un soin de [Magnitude/2] visant l'endurance (PE), ce soin est dispensé des règles des soins naturels et de la fatigue."
  },
  {
    "num": 5,
    "vulgar": "Transfusion",
    "latin": "Fundo (Je verse)",
    "arcane": "Refund (Re + fund)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🪷 Nature: Refundeiln",
    "description": "Produit un soin qui convertis [Magnitude/2] chi (PC) en [Magnitude] endurance (PE), ce soin est dispensé des règles des soins naturels et de la fatigue."
  },
  {
    "num": 6,
    "vulgar": "Grandiloquence",
    "latin": "Magnus (Grand)",
    "arcane": "Relmagnus (Rel + magnus)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🎭 Illusion: Relmagnusin",
    "description": "Produit un soin de [Magnitude] de n'importe quelle ressource, à la fin de la scène ces ressources sont immédiatement perdus (ce qui peux entrainer la mort ou le passage en négatif d'une ressource), ce soin est dispensé des règles des soins naturels et de la fatigue."
  },
  {
    "num": 7,
    "vulgar": "Revigoration",
    "latin": "Vigor (Force, Vigueur)",
    "arcane": "Rasvigore (Ras + vigore)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🪷 Nature: Rasvigoreiln",
    "description": "Produit un soin de [Magnitude/3] visant la fatigue."
  },
  {
    "num": 8,
    "vulgar": "Purification",
    "latin": "Purgo (Je nettoie)",
    "arcane": "Rhopurgo (Rho + purgo)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🪷 Nature: Rhopurgoeiln",
    "description": "Produit un soin de [Magnitude/4] visant la corruption."
  },
  {
    "num": 9,
    "vulgar": "Canalisation",
    "latin": "Canalis (Conduit)",
    "arcane": "Recana (Re + cana)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🛡️ Guerre: Recanaorr, 🧩 Mental: Recanaend",
    "description": "Produit un soin qui convertis un maximum de [Magnitude] points de garde/adrénaline/rage ou leurs équivalants mentaux (selon la [clé] utilisée) en 2 PE chaques, l'éxcédant est acquis en PE temporaires."
  },
  {
    "num": 10,
    "vulgar": "Dissolution",
    "latin": "Solvo (Délier)",
    "arcane": "Rensolvo (Ren + solvo)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚕️ Corps: Rensolvoen, 🧠 Esprit: Rensolvoys",
    "description": "Génère un soin de [Magnitude x2] visant une condition négative de nature spécifique (la nature de la condition doit être éligible à la [clé]) affectant la cible."
  },
  {
    "num": 11,
    "vulgar": "Neutralisation",
    "latin": "Neuter (Ni l'un ni l'autre)",
    "arcane": "Rasneuta (Ras + neuta)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚕️ Corps: Rasneutaen, 🧠 Esprit: Rasneutays",
    "description": "Génère un soin de [Magnitude] visant une condition négative au choix (physique ou mentale selon la [clé]) affectant la cible."
  },
  {
    "num": 12,
    "vulgar": "Absolution",
    "latin": "Absolvo (Je délie)",
    "arcane": "Rhoabsol (Rho + absol)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🪷 Nature: Rhoabsoleiln",
    "description": "Génère un soin de [Magnitude/2] visant toutes les conditions négatives (physique et mentale) affectant la cible."
  },
  {
    "num": 13,
    "vulgar": "Intégration",
    "latin": "Integrare",
    "arcane": "Aenintegr",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚕️ Corps: Resoliden (Force, Dextérité, Agilité, Perception, Constitution)",
    "description": "Produit un effet soignant [Magnitude]/5 points d'un attribut du corps associé à [clé]."
  },
  {
    "num": 14,
    "vulgar": "Consolidation",
    "latin": "Solidus (Solide)",
    "arcane": "Resolid (Re + solid)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🧠 Esprit: Relumenys (Charisme, Intelligence, Ruse, Sagesse, Volonté)",
    "description": "Produit un effet soignant [Magnitude]/5 points d'un attribut de l'esprit associé à [clé]."
  },
  {
    "num": 15,
    "vulgar": "Illumination",
    "latin": "Lumen (Lumière)",
    "arcane": "Relumen (Rel + lumen)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "✡️ Arcane: Rascauter ys (Magie), 🌀 Chaos: Rascauterix (Chance), ⚕️ Corps: RascauTerren (Stature, Taille), 🧠 Esprit: Rascauterys (Ego, Apparence), 🪷 Nature: RascauTerreiln (Equilibre)",
    "description": "Produit un effet soignant [Magnitude]/5 points d'un attribut secondaire associé à [clé]."
  },
  {
    "num": 16,
    "vulgar": "Cautérisation",
    "latin": "Adustus (Brûlé)",
    "arcane": "Rascauter (Ras + cauter)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🔥 Feu: Rascauterar",
    "description": "Produit un soin de [Magnitude/2] visant une blessure (lésion physique), la moitié de ce soin est perdu en PV."
  },
  {
    "num": 17,
    "vulgar": "Cicatrisation",
    "latin": "Cico (Je calme)",
    "arcane": "Rhocicat (Rho + cicat)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "❤️ Vie: Rhocicatiir",
    "description": "Produit un soin de [Magnitude/2] visant une blessure (lésion physique), génère la moitié en fatigue."
  },
  {
    "num": 18,
    "vulgar": "Harmonisation",
    "latin": "Harmonia (Harmonie)",
    "arcane": "Reharmo (Re + harmo)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🧩 Mental: Reharmoend",
    "description": "Produit un soin de [Magnitude/2] visant un trauma (lésion mentale), génère la moitié en fatigue."
  },
  {
    "num": 19,
    "vulgar": "RésuRection",
    "latin": "Resurgo (Je me relève)",
    "arcane": "Renresur (Ren + resur)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "6",
    "drain": "6",
    "keys": "❤️ Vie: Renresuriir",
    "description": "Sur une cible morte - Restaure tout ce qui a causé la mort de la cible pile à la limite de celle ci, la cible reçoit un niveau entier de fatigue, chaque fois qu'une cible doit être ramenée à la vie au delà de la première fois il y a une chance sur deux que cela échoue et qu'il ne soit plus jamais possible de le faire, le sort ne peux être lancé qu'à un niveau de 3 au minimum."
  },
  {
    "num": 20,
    "vulgar": "Rajeunissement",
    "latin": "Iuventus (Jeunesse)",
    "arcane": "Ryujuve (Ryu + juve)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "💢 Vide: Ryujuvearh",
    "description": "La cible rajeunit de [Magnitude/4] années, cependant elle reçoit 1 point de corruption permanent, qui ne peux être enlevé d'aucune manière que ce soit, ce sort peux à la place soigné un vieillissement magique sans conséquences à la place."
  },
  {
    "num": 21,
    "vulgar": "Reconstitution",
    "latin": "Statuo (Je rétablis)",
    "arcane": "Rhostatuo (Rho + statuo)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "📚 Savoir: Rhostatuaum",
    "description": "Restaure l'indice, la piste ou autre information ciblé, qui a été rendue bien plus difficile à déchiffrer ou comprendre quelque soit le moyen employé (magie ou manuel), restaure un maximum de [Magnitude] lettres cependant (ou équivalant)."
  },
  {
    "num": 22,
    "vulgar": "Libération",
    "latin": "Libero (Je délivre)",
    "arcane": "Reliber (Re + liber)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "👁️ Vision: Relibereth",
    "description": "Génère un soin de [Magnitude] visant toutes les conditions négative affectant les sens."
  },
  {
    "num": 23,
    "vulgar": "Stabilisation",
    "latin": "Firmus (Ferme)",
    "arcane": "Relfirmus (Rel + firmus)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "0",
    "drain": "0",
    "keys": "❤️ Vie: Relfirmusiir",
    "description": "Génère un soin qui stabilise l'état, physique ou mental, de la cible."
  },
  {
    "num": 24,
    "vulgar": "Désintoxication",
    "latin": "Veneno (Poison)",
    "arcane": "Rasvenen (Ras + venen)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "❤️ Vie: Rasveneniir",
    "description": "Génère un soin de [Magnitude x2] visant une condition négative de type poison, venin ou autre forme de substances du même genre."
  },
  {
    "num": 25,
    "vulgar": "Sanguination",
    "latin": "Sanguis (Sang)",
    "arcane": "Rhosangu (Rho + sangu)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "❤️ Vie: Rhosanguiir",
    "description": "Génère un soin de [Magnitude x2] visant une condition négative de type maladie."
  },
  {
    "num": 26,
    "vulgar": "Réincarnation",
    "latin": "Caro (Chair, corps)",
    "arcane": "Recarno (Re + carno)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "❤️ Vie: Recarnoir",
    "description": "Génère un effet qui apaise l'âme d'un mort et soigne celle-ci, offrant à l'individu l'accés à son cycle de réincarnation, l'âme peux réaliser un test de sauvegarde (réussir signifie ignorer ce sort), l'âme doit avoir été mis hors d'état (ou ne doit pas être en mesure de se manifester pour se défendre)."
  },
  {
    "num": 27,
    "vulgar": "Ancrage",
    "latin": "Stato (Je me tiens)",
    "arcane": "Ryustato (Ryu + stato)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "0",
    "keys": "❤️ Vie: Ryustatoir",
    "description": "Génère un sort qui stabilise un total de [Magnitude/4] rangs de lésions, répartis comme souhaité, quelques soit leurs types."
  },
  {
    "num": 28,
    "vulgar": "Stigmatisation",
    "latin": "Nota (Marque)",
    "arcane": "Rasnota (Ras + nota)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "✨ Sacre: Rasnotai el",
    "description": "Génère un effet qui permet au lanceur de sort de recevoir et encaisser lui même jusqu'à [Magnitude/4] rangs de lésions (tous type) de la cible."
  },
  {
    "num": 29,
    "vulgar": "Sanctification",
    "latin": "Sanctus (Sacré)",
    "arcane": "Rhosanct (Rho + sanct)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🩸 Impie: Rhosanctun",
    "description": "Nécessite du sang au sol à proximité de la cible, produit un soin de [Magnitude/2] visant l'endurance (PE) et génère la même quantité de vitalité (PV) temporaires, le sang en question est consummé (et ne peux être réutilisé), la quantité de sang requis est équivalant à celle que laisse une blessure légère, par rang de blessure supérieur le sort est majoré (+1 par dés) maximum 3 fois, ce soin n'est pas dispensé des règles des soins naturels et de la fatigue (voir guérison dans les règles de base) mais le seuil du gain de fatigue est doublé."
  },
  {
    "num": 30,
    "vulgar": "Cryothérapie",
    "latin": "Frigus (Froid)",
    "arcane": "Refrig (Re + frig)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "❄️ Glace: Refrigis",
    "description": "Produit un soin de [Magnitude/2] visant la vitalité (PV), génère une blessure dont la gravité est équivalante à 2 fois les PV ainsi soignés (mais pas de fatigue)."
  },
  {
    "num": 31,
    "vulgar": "Régénération",
    "latin": "Gigno (J'engendre)",
    "arcane": "Rengen (Ren + gen)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "❤️ Vie: Rengenir (Tonique)",
    "description": "Génère un effet qui octroie une condition de soin dans le temps (HOT)."
  },
  {
    "num": 32,
    "vulgar": "Purification",
    "latin": "Purgo (Purifier)",
    "arcane": "Mugpurgo (Mug + purgo)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "📚 Savoir",
    "description": "Génère un enchantement qui réduit la magnitude des marques dont fait l'objet la cible d'autant que [Magnitude]."
  },
  {
    "num": 33,
    "vulgar": "Moralisation",
    "latin": "Moralis (Moral)",
    "arcane": "Remoral (Re + moral)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚜️ Charme: Rengenynh",
    "description": "Génère un effet qui restaure [Magnitude] points de moral à la cible, le soin de moral est dispensé des règles des soins naturels et de la fatigue."
  },
  {
    "num": 34,
    "vulgar": "Emoglobine",
    "latin": "Sanguis (Sang)",
    "arcane": "Haemosang (Hae + mosang)",
    "word_type": "Pouvoir",
    "target_type": "Cible",
    "difficulty": "2",
    "drain": "2",
    "keys": "🩸 Impie",
    "description": "Génère un effet qui soigne [Magnitude/5] PV la cible pour chaque fois où le sang a été versé durant la scène et dans la zone, après quoi ces itérations ne peuvent plus compter pour des effets du genre, le gain de fatigue à ces soins est divisé par deux."
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
