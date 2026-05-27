# École d'Invocation

<div id="mpv-app">

<div class="mpv-filters">
  <input type="text" id="mpv-search" placeholder="Rechercher (nom, latin, arcanique, description…)" />
  <select id="mpv-type">
    <option value="">Tous les types</option>
    <option value="Liaison">Liaison</option>
<option value="Pouvoir">Pouvoir</option>
  </select>
  <select id="mpv-target">
    <option value="">Toutes les cibles</option>
    <option value="/">/</option>
<option value="Cible (invocation)">Cible (invocation)</option>
<option value="Cible (lieu)">Cible (lieu)</option>
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
    "vulgar": "Elémentaire",
    "latin": "Elementum (Élément)",
    "arcane": "Voele (Vo + ele)",
    "word_type": "Pouvoir",
    "target_type": "Cible (lieu)",
    "difficulty": "4",
    "drain": "6",
    "keys": "🔥 Feu: Voelear, ❄️ Glace: Voeleis, ⚡ Foudre: Voeleor, 🪨 Terre: Voeleum, 💧 Eau: Voeleyn, 🌪️ Air: Voeleel, ☀️ Lumière: Voeleion, 🌑 Ombre: Voeleoth, ⚖️ Loi: Voeleem, 🌀 Chaos: Voeleix, 💢 Vide: Voele arh, ❤️ Vie: Voeleir, ☢️ Toxique: Voeleex",
    "description": "Génère un enchantement qui invoque une créature de type élémentaire au choix parmis les archétypes existants via une [clé], la charge est de [Magnitude]."
  },
  {
    "num": 2,
    "vulgar": "Empyréen",
    "latin": "Ignis (Feu)",
    "arcane": "Vanignis (Van + ignis)",
    "word_type": "Pouvoir",
    "target_type": "Cible (lieu)",
    "difficulty": "4",
    "drain": "6",
    "keys": "✨ Sacre: Vanignisiel",
    "description": "Génère un enchantement qui invoque une créature de type empyréen au choix parmis les archétypes existants via une [clé], la charge est de [Magnitude]."
  },
  {
    "num": 3,
    "vulgar": "Hypogéen",
    "latin": "Terra (Terre)",
    "arcane": "Vorterra (Vor + terra)",
    "word_type": "Pouvoir",
    "target_type": "Cible (lieu)",
    "difficulty": "4",
    "drain": "6",
    "keys": "🩸 Impie: Vorterraun",
    "description": "Génère un enchantement qui invoque une créature de type hypogéen au choix parmis les archétypes existants via une [clé], la charge est de [Magnitude]."
  },
  {
    "num": 4,
    "vulgar": "Esprit",
    "latin": "Spiritus (Souffle)",
    "arcane": "Vaspiri (Vas + spiri)",
    "word_type": "Pouvoir",
    "target_type": "Cible (lieu)",
    "difficulty": "4",
    "drain": "6",
    "keys": "🪷 Nature: Vaspirieiln",
    "description": "Génère un enchantement qui invoque une créature de type esprit au choix parmis les archétypes existants via une [clé], la charge est de [Magnitude]."
  },
  {
    "num": 5,
    "vulgar": "Zodiaque",
    "latin": "Signum (Signe)",
    "arcane": "Vosign (Vo + sign)",
    "word_type": "Pouvoir",
    "target_type": "Cible (lieu)",
    "difficulty": "4",
    "drain": "6",
    "keys": "🪷 Nature: Vosign eiln",
    "description": "Génère un enchantement qui invoque une créature de type zodiacal au choix parmis les archétypes existants via une [clé], la charge est de [Magnitude]."
  },
  {
    "num": 6,
    "vulgar": "Arcane",
    "latin": "Arcanum (Secret)",
    "arcane": "Vanarca (Van + arca)",
    "word_type": "Pouvoir",
    "target_type": "Cible (lieu)",
    "difficulty": "4",
    "drain": "6",
    "keys": "✡️ Arcane: Vanarcays",
    "description": "Génère un enchantement qui invoque une créature de type arcanique au choix parmis les archétypes existants via une [clé], la charge est de [Magnitude]."
  },
  {
    "num": 7,
    "vulgar": "Objet (animé)",
    "latin": "Anima (Âme)",
    "arcane": "Voranim (Vor + anim)",
    "word_type": "Pouvoir",
    "target_type": "Cible (lieu)",
    "difficulty": "4",
    "drain": "6",
    "keys": "⚔️ Acier: Voraniman",
    "description": "Génère un enchantement qui invoque une créature de type objet au choix parmis les archétypes existants via une [clé], la charge est de [Magnitude]."
  },
  {
    "num": 8,
    "vulgar": "Manifestation",
    "latin": "Appareo (Apparaître)",
    "arcane": "Vasapar (Vas + apar)",
    "word_type": "Pouvoir",
    "target_type": "Cible (lieu)",
    "difficulty": "4",
    "drain": "6",
    "keys": "🛡️ Guerre: Vasaparorr",
    "description": "Génère un enchantement qui invoque une créature de type manifestation au choix parmis les archétypes existants via une [clé], la charge est de [Magnitude]."
  },
  {
    "num": 9,
    "vulgar": "Bête",
    "latin": "Fera (Bête sauvage)",
    "arcane": "Vofera (Vo + fera)",
    "word_type": "Pouvoir",
    "target_type": "Cible (lieu)",
    "difficulty": "4",
    "drain": "6",
    "keys": "🐗 Faune: Voferaorh",
    "description": "Génère un enchantement qui invoque une créature de type bête au choix parmis les archétypes existants via une [clé], la charge est de [Magnitude]."
  },
  {
    "num": 10,
    "vulgar": "Plante",
    "latin": "Herba (Herbe, plante)",
    "arcane": "Vanherba (Van + herba)",
    "word_type": "Pouvoir",
    "target_type": "Cible (lieu)",
    "difficulty": "4",
    "drain": "6",
    "keys": "🌿 Flore: Vanherba iln",
    "description": "Génère un enchantement qui invoque une créature de type plante au choix parmis les archétypes existants via une [clé], la charge est de [Magnitude]."
  },
  {
    "num": 11,
    "vulgar": "Crépusculaire",
    "latin": "Crepusculum (Crépuscule)",
    "arcane": "Vorcrep (Vor + crep)",
    "word_type": "Pouvoir",
    "target_type": "Cible (lieu)",
    "difficulty": "4",
    "drain": "6",
    "keys": "☠️ Mort: Vorcrepus",
    "description": "Génère un enchantement qui invoque une créature de type crépusculaire au choix parmis les archétypes existants via une [clé], ces choix inclus tous les choix de la liste des bêtes, des guerriers et des mystique, mais dans une version mort vivant, la charge est de [Magnitude]."
  },
  {
    "num": 12,
    "vulgar": "Illusion",
    "latin": "Illusio (Moquerie)",
    "arcane": "Vasilusi (Vas + ilusi)",
    "word_type": "Pouvoir",
    "target_type": "Cible (lieu)",
    "difficulty": "4",
    "drain": "6",
    "keys": "🎭 Illusion: Vasilusiin",
    "description": "Génère un enchantement qui invoque une créature de type iLusoire au choix parmis les archétypes existants via une [clé], ces choix inclus tous les choix de la liste des bêtes et des guerriers, mais dans une version iLusoire, la charge est de [Magnitude]."
  },
  {
    "num": 13,
    "vulgar": "Livre",
    "latin": "Liber (Livre)",
    "arcane": "Voliber (Vo + liber)",
    "word_type": "Pouvoir",
    "target_type": "Cible (lieu)",
    "difficulty": "2",
    "drain": "2",
    "keys": "📚 Savoir: Voliberaum",
    "description": "Génère un enchantement qui invoque un livre, la charge est de [Magnitude]."
  },
  {
    "num": 14,
    "vulgar": "Lien",
    "latin": "Vinculum (Lien, chaîne)",
    "arcane": "Vanvincul (Van + vincul)",
    "word_type": "Pouvoir",
    "target_type": "Cible (lieu)",
    "difficulty": "2",
    "drain": "2",
    "keys": "❤️ Vie: Vanvinculir (PV), 🧩 Mental: Vanvinculend (PS), 🌀 Chaos: Vanvinculix (PK), ⚕️ Corps: Vanvinculen (PC), 🧠 Esprit: Vanvinculys (PC), 🔮 Magie: Vanvinculirn (PM), 🪷 Nature: Vanvincul eiln (PE)",
    "description": "Génère un enchantement qui permet à l'invocation d'utiliser ses charges comme moyen de soigner la ressource associé à une [clé], jusqu'à un total de [Magnitude/2], le soin peux survenir n'importe quand."
  },
  {
    "num": 15,
    "vulgar": "Ressource (lien)",
    "latin": "Opus (Œuvre, besoin)",
    "arcane": "Voropus (Vor + opus)",
    "word_type": "Pouvoir",
    "target_type": "Cible (invocation)",
    "difficulty": "2",
    "drain": "2",
    "keys": "❤️ Vie: Voropusir (PV), 🧩 Mental: Voropusend (PS), 🌀 Chaos: Voropusix (PK), ⚕️ Corps: Voropusen (PC), 🧠 Esprit: Voropusys (PC), 🔮 Magie: Voropusirn (PM), 🪷 Nature: Voropuseiln (PE)",
    "description": "Génère un enchantement qui permet à l'invocation et à son invocateur de partager la perte d'un type de ressource associé à une [clé], jusqu'à un total de [Magnitude/4] à chaque occurence, l'effet va donc dans les deux sens."
  },
  {
    "num": 16,
    "vulgar": "Temporaire (lien)",
    "latin": "Tempus (Temps)",
    "arcane": "Vastemp (Vas + temp)",
    "word_type": "Pouvoir",
    "target_type": "Cible (invocation)",
    "difficulty": "2",
    "drain": "2",
    "keys": "⚔️ Acier: Vastem pan",
    "description": "Génère un enchantement qui permet à l'invocation et à son invocateur de partager leurs ressources temporaires, dont l'initiative, jusqu'à un total de [Magnitude/4] à chaque occurence, l'effet va donc dans les deux sens."
  },
  {
    "num": 17,
    "vulgar": "Sensation (lien)",
    "latin": "Sensus (Sens)",
    "arcane": "Vosens (Vo + sens)",
    "word_type": "Pouvoir",
    "target_type": "Cible (invocation)",
    "difficulty": "2",
    "drain": "2",
    "keys": "👁️ Vision: Vosens eth",
    "description": "Génère un enchantement qui permet à l'invocation et à son invocateur de communiquer sur une distance maximale de [Magnitude]² mètres, l'invocation partage également ses sens avec l'invocateur sur 10x cette distance (sans pouvoir communiquer avec lui si trop distant)."
  },
  {
    "num": 18,
    "vulgar": "Consultation",
    "latin": "Consulo (Consulter)",
    "arcane": "Vanconsul (Van + consul)",
    "word_type": "Pouvoir",
    "target_type": "Cible (invocation)",
    "difficulty": "2",
    "drain": "2",
    "keys": "📚 Savoir: Vanconsulaum",
    "description": "Génère un effet qui permet de consulter la mémoire d'une invocation sur [Magnitude] minutes, si l'invocation n'est pas un allié elle peux réalisé un test de sauvegarde (détermination) pour réduire l'effet."
  },
  {
    "num": 19,
    "vulgar": "Infusion",
    "latin": "Fundo (Verser)",
    "arcane": "Vorfundo (Vor + fundo)",
    "word_type": "Pouvoir",
    "target_type": "Cible (invocation)",
    "difficulty": "2",
    "drain": "2",
    "keys": "🔮 Magie: Vorfundoirn",
    "description": "Génère un effet qui consomme une surface/zone élémentaire associé à l'invocation ciblée pour restaurer jusqu'à [Magnitude] charges, si le regain excède le maximum alors la moitié du restant est acquis sous forme de surcharge, la surface/zone en question ne peux alors plus être assimilée (mais subsiste)."
  },
  {
    "num": 20,
    "vulgar": "Imprégnation",
    "latin": "Pingo (Peindre, teindre)",
    "arcane": "Vaspingo (Vas + pingo)",
    "word_type": "Pouvoir",
    "target_type": "Cible (invocation)",
    "difficulty": "2",
    "drain": "2",
    "keys": "🔮 Magie: Vaspingoirn",
    "description": "Génère un enchantement qui augmente la difficulté arcanique associée à l'invocation de [Magnitude/5]."
  },
  {
    "num": 21,
    "vulgar": "Démultiplication",
    "latin": "Multiplus (Multiple)",
    "arcane": "Vomulti (Vo + multi)",
    "word_type": "Liaison",
    "target_type": "/",
    "difficulty": "2",
    "drain": "2",
    "keys": "☠️ Mort: Vomultius, 🐗 Faune: Vomultiorh",
    "description": "L'invocation apparait sous la forme de 2 / 3 / 4 créatures, l'enchantement et ses charges sont associés à l'ensemble, les attributs finaux des invocations sont divisée par 2 / 3 / 4, les créatures en question ont tendances à agir vers un but commun et s'engage dans des actions communes vers des cibles communes."
  },
  {
    "num": 22,
    "vulgar": "Fulgurant",
    "latin": "Fulmen (Foudre)",
    "arcane": "Vanfulmen (Van + fulmen)",
    "word_type": "Liaison",
    "target_type": "/",
    "difficulty": "2",
    "drain": "2",
    "keys": "🔮 Magie: Vanfulmenirn",
    "description": "L'invocation reçoit un avantage à tous ses tests et ses jets sont assurés (min 4) et majoré (+1 par dés), mais elle est révoquée automatiquement après un cycle ou une action en dehors d'une confrontation."
  },
  {
    "num": 23,
    "vulgar": "Communication",
    "latin": "Communis (Commun)",
    "arcane": "Vorcommu (Vor + commu)",
    "word_type": "Liaison",
    "target_type": "/",
    "difficulty": "2",
    "drain": "2",
    "keys": "🐗 Faune: Vorcommuorh",
    "description": "L'invocation est dotée de parole et peux transmettre des messages, sans que cela ne lui accorde des avantages notables en matière de persuasion ou autre."
  },
  {
    "num": 24,
    "vulgar": "Majeur",
    "latin": "Maior (Plus grand)",
    "arcane": "Vasmajor (Vas + major)",
    "word_type": "Liaison",
    "target_type": "/",
    "difficulty": "2",
    "drain": "2",
    "keys": "🔮 Magie: Vasmajorirn",
    "description": "L'invocation voit tous ses attributs augmentés de 2, le sort doit être de niveau 3 minimum, un seul mot du même type à la fois."
  },
  {
    "num": 25,
    "vulgar": "Epique",
    "latin": "Gloria (Gloire)",
    "arcane": "Vogloria (Vo + gloria)",
    "word_type": "Liaison",
    "target_type": "/",
    "difficulty": "4",
    "drain": "4",
    "keys": "🔮 Magie: Vogloirairn",
    "description": "L'invocation voit tous ses attributs augmentés de 4, le sort doit être de niveau 4 minimum, un seul mot du même type à la fois."
  },
  {
    "num": 26,
    "vulgar": "Ultime",
    "latin": "Ultimus (Dernier)",
    "arcane": "Vanultim (Van + ultim)",
    "word_type": "Liaison",
    "target_type": "/",
    "difficulty": "6",
    "drain": "6",
    "keys": "🔮 Magie: Vanultimirn",
    "description": "L'invocation voit tous ses attributs augmentés de 6, le sort doit être de niveau 5 minimum, un seul mot du même type à la fois."
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
