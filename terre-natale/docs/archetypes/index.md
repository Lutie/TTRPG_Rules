# Compendium des Archétypes

Les archétypes sont des traits spéciaux à 5 rangs. Le **rang 1** débloque une mécanique de jeu significative ; les rangs suivants l'améliorent, parfois avec des choix à faire parmi un pool d'options.

!!! warning "Règle générale"
    Un personnage ne peut posséder qu'**un seul archétype**. Des exceptions restent possibles avec l'accord du MJ, qui devrait considérer la question avec grande attention — cumuler plusieurs archétypes peut rapidement devenir difficile à gérer en jeu.

<div id="arch-app">

<div class="arch-filters">
  <input type="text" id="arch-search" placeholder="Rechercher un archétype…" />
  <span id="arch-count"></span>
</div>

<div id="arch-list">

<div class="arch-card" id="arch-0">
  <div class="arch-header" onclick="toggleArch('arch-0')">
    <span class="arch-nom">Inspiration</span>
    <span class="arch-concept">Barde — performances buffant/debuffant via la musique, le chant ou la danse</span>
    <span class="arch-chevron">▾</span>
  </div>
  <div class="arch-body">
    <p class="arch-desc">L'archétype de l'Inspiration permet au personnage de réaliser des compositions performatives — musique, chant ou danse — pour affecter les attributs de ses cibles. Chaque composition produit un effet positif (Bonus) ou négatif (Malus) sur les personnes qui perçoivent la prestation.</p>
    <table class="arch-mec"><tr><th>Nouvelle Action : Composer</th><td>Réaliser une composition performative ciblant les personnes qui perçoivent la prestation. Choisir un <strong>Style</strong> (Bonus ou Malus) et une <strong>Méthode</strong> : <strong>Danse</strong> (ACTS, 2 rounds, 2 PS), <strong>Chant</strong> (ACTL, 2 rounds, 5 PS) ou <strong>Musique</strong> (ACTC, 3 rounds, 2 PS).</td></tr><tr><th>Évaluation</th><td><strong>Difficulté</strong> 5 ; résultat en <strong>ajustements aux tests</strong> (pas aux jets) : 10 = +1, 15 = +2, etc.</td></tr><tr><th>Style</th><td><strong>Bonus</strong> : affecte positivement les cibles. <strong>Malus</strong> : les cibles effectuent un jet de Détermination pour résister — ne peut jamais affecter le personnage lui-même.</td></tr><tr><th>Composition</th><td><strong>Simple</strong> = 1 attribut. <strong>Experte</strong> = 2 attributs (débloquable). Portée de base : à proximité.</td></tr></table>
    <div class="arch-rangs">
<div class="rang-row">
  <div class="rang-badge">R1</div>
  <div class="rang-body">
    <div class="rang-desc">Accès aux compositions d'Inspiration. Au moment de la composition, choisir un Style (Bonus ou Malus) et une Méthode (Danse, Chant ou Musique).</div>
    
  </div>
</div>
<div class="rang-row">
  <div class="rang-badge">R2</div>
  <div class="rang-body">
    
    <span class="rang-choix">⬡ Choisir une amélioration</span>
  </div>
</div>
<div class="rang-row">
  <div class="rang-badge">R3</div>
  <div class="rang-body">
    
    <span class="rang-choix">⬡ Choisir une amélioration</span>
  </div>
</div>
<div class="rang-row">
  <div class="rang-badge">R4</div>
  <div class="rang-body">
    
    <span class="rang-choix">⬡ Choisir une amélioration</span>
  </div>
</div>
<div class="rang-row">
  <div class="rang-badge">R5</div>
  <div class="rang-body">
    
    <span class="rang-choix">⬡ Choisir une amélioration</span>
  </div>
</div></div>
    
<details class="arch-amel">
  <summary>Améliorations disponibles (8)</summary>
  <ul><li><strong>Difficulté nulle</strong> — Évaluation : difficulté ramenée à 0 (résultat minimum +1).</li><li><strong>Composition experte</strong> — Peut composer avec 2 attributs au lieu d'un.</li><li><strong>Ciblage affiné</strong> — Distingue alliés et ennemis : les effets négatifs n'affectent pas les alliés, les effets positifs n'affectent pas les ennemis. Les méthodes affectent désormais toutes les personnes dans la zone d'effet, qu'elles perçoivent ou non la prestation.</li><li><strong>Double composition</strong> — Une même composition peut buff un attribut et debuff un autre simultanément.</li><li><strong>Répertoire</strong> — 5 emplacements de mémoire pour des compositions préparées à l'avance.</li><li><strong>Durée prolongée</strong> — La durée s'exprime en tours plutôt qu'en rounds (coût +2 PS).</li><li><strong>Résistance diminuée</strong> — Les sauvegardes adverses contre les effets négatifs sont désavantagées.</li><li><strong>Portée supérieure</strong> — Portée étendue : proximité devient zone.</li></ul>
</details>
  </div>
</div>
</div>

</div>

<style>
#arch-app {
  font-size: 0.9em;
}
.arch-filters {
  display: flex;
  gap: 0.6em;
  margin-bottom: 1.2em;
  align-items: center;
}
.arch-filters input {
  flex: 1;
  max-width: 360px;
  padding: 0.35em 0.6em;
  border: 1px solid #aaa;
  border-radius: 4px;
  font-size: 0.9em;
  background: var(--md-default-bg-color, #fff);
  color: var(--md-default-fg-color, #000);
}
#arch-count {
  color: #888;
  font-size: 0.85em;
}
.arch-card {
  border: 1px solid var(--md-default-fg-color--lightest, #ddd);
  border-radius: 6px;
  margin-bottom: 0.7em;
  overflow: hidden;
}
.arch-header {
  display: flex;
  align-items: baseline;
  gap: 0.8em;
  padding: 0.65em 1em;
  cursor: pointer;
  background: var(--md-primary-fg-color, #3f51b5);
  color: var(--md-primary-bg-color, #fff);
  user-select: none;
}
.arch-header:hover { opacity: 0.9; }
.arch-nom {
  font-weight: 700;
  font-size: 1.05em;
  white-space: nowrap;
}
.arch-concept {
  flex: 1;
  font-style: italic;
  font-size: 0.88em;
  opacity: 0.85;
}
.arch-chevron {
  font-size: 1.1em;
  transition: transform 0.2s;
}
.arch-card.open .arch-chevron {
  transform: rotate(180deg);
}
.arch-body {
  display: none;
  padding: 1em;
  border-top: 1px solid var(--md-default-fg-color--lightest, #ddd);
}
.arch-card.open .arch-body {
  display: block;
}
/* description */
.arch-desc {
  margin: 0 0 0.9em 0;
  color: var(--md-default-fg-color--light, #444);
  font-size: 0.92em;
  line-height: 1.5;
}
/* mécaniques */
.arch-mec {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1em;
  font-size: 0.9em;
}
.arch-mec th, .arch-mec td {
  padding: 0.35em 0.6em;
  border: 1px solid var(--md-default-fg-color--lightest, #e0e0e0);
  vertical-align: top;
}
.arch-mec th {
  white-space: nowrap;
  font-weight: 600;
  width: 1%;
  background: var(--md-default-bg-color--light, #f5f5f5);
  color: var(--md-default-fg-color, #000);
}
/* rangs */
.arch-rangs {
  display: flex;
  flex-direction: column;
  gap: 0.4em;
  margin-bottom: 0.9em;
}
.rang-row {
  display: flex;
  gap: 0.7em;
  align-items: flex-start;
}
.rang-badge {
  flex-shrink: 0;
  width: 2em;
  height: 2em;
  border-radius: 50%;
  background: var(--md-primary-fg-color, #3f51b5);
  color: var(--md-primary-bg-color, #fff);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.8em;
}
.rang-body {
  flex: 1;
}
.rang-desc {
  color: var(--md-default-fg-color--light, #444);
  font-size: 0.92em;
}
.rang-choix {
  display: inline-block;
  margin-top: 0.2em;
  font-size: 0.82em;
  color: #7c4dff;
  font-style: italic;
}
/* améliorations */
.arch-amel > summary {
  cursor: pointer;
  font-weight: 600;
  color: var(--md-primary-fg-color, #3f51b5);
  margin-bottom: 0.4em;
  user-select: none;
}
.arch-amel ul {
  margin: 0.4em 0 0 0;
  padding-left: 1.2em;
}
.arch-amel li {
  margin-bottom: 0.3em;
  font-size: 0.9em;
}
/* search highlight */
.arch-card.hidden {
  display: none;
}
</style>

<script>
(function() {
  const search  = document.getElementById('arch-search');
  const counter = document.getElementById('arch-count');
  const cards   = Array.from(document.querySelectorAll('.arch-card'));

  function updateCount() {
    const visible = cards.filter(c => !c.classList.contains('hidden')).length;
    counter.textContent = visible + ' archétype' + (visible !== 1 ? 's' : '');
  }

  search.addEventListener('input', () => {
    const q = search.value.toLowerCase();
    cards.forEach(card => {
      const text = card.textContent.toLowerCase();
      card.classList.toggle('hidden', q.length > 0 && !text.includes(q));
    });
    updateCount();
  });

  updateCount();
})();

function toggleArch(id) {
  document.getElementById(id).classList.toggle('open');
}
</script>
