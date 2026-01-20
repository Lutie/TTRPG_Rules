// Thalifen — Destinée + PA + Origines + Attributs Secondaires
// Base starts at 7 for primary attributes, 10 for secondary.
// Destiny sets PA budget and max base value at creation.
// Step cost rule (matches your table):
//   X -> X+1 costs (X - 4) PA
// So: 7->8=3, 8->9=4, 9->10=5, ..., 17->18=13
// Lowering refunds the inverse step cost.
//
// Secondary attributes (except Équilibre):
// 10→8 = +3 PA, 10→9 = +2 PA, 10→11 = -2 PA, 10→12 = -3 PA
//
// Origins adjust per attribute:
// - Boosts: first +2, then +1 each, cap +4
// - Deboosts: first -2, then -1 each, cap -4
// Final = Base + OriginsAdjust + BirthAdjust (for secondary)

const START_VALUE = 7;
const MIN_BASE = 7;

const SECONDARY_BASE = 10;
const SECONDARY_MIN = 8;
const SECONDARY_MAX = 12;

const DESTINIES = [
  { name: "Commun des Mortels", pa: 200, pp: 2, max: 14 },
  { name: "Destin Honorable", pa: 300, pp: 4, max: 15 },
  { name: "Marche de la Gloire", pa: 400, pp: 6, max: 16 },
  { name: "Arpenteur Héroïque", pa: 500, pp: 8, max: 17 },
  { name: "Dieu parmi les Hommes", pa: 600, pp: 10, max: 18 },
];

const GROUPS = {
  corps: ["Force", "Dextérité", "Agilité", "Constitution", "Perception"],
  esprit: ["Charisme", "Intelligence", "Ruse", "Volonté", "Sagesse"],
  autre: ["Magie", "Logique"],
};

const SECONDARY_ATTRS = [
  "Stature",
  "Taille",
  "Ego",
  "Apparence",
  "Chance",
  "Équilibre",
];

// Origins targets include all attributes
const ORIGIN_ATTRIBUTES = [
  ...GROUPS.corps,
  ...GROUPS.esprit,
  ...GROUPS.autre,
  ...SECONDARY_ATTRS,
];

// Elements
const destinySelect = document.getElementById("destinySelect");
const destinyPAEl = document.getElementById("destinyPA");
const destinyMaxEl = document.getElementById("destinyMax");

const paSpentEl = document.getElementById("paSpent");
const paRemainingEl = document.getElementById("paRemaining");

const gridCorps = document.getElementById("gridCorps");
const gridEsprit = document.getElementById("gridEsprit");
const gridAutre = document.getElementById("gridAutre");
const gridSecondary = document.getElementById("gridSecondary");

const resetAllBtn = document.getElementById("resetAllBtn");
const resetOriginsBtn = document.getElementById("resetOriginsBtn");

const originSelects = Array.from(document.querySelectorAll(".attrSelect"));

const birthInputs = {
  Stature: document.getElementById("birthStature"),
  Taille: document.getElementById("birthTaille"),
  Ego: document.getElementById("birthEgo"),
  Apparence: document.getElementById("birthApparence"),
  Chance: document.getElementById("birthChance"),
  Équilibre: document.getElementById("birthEquilibre"),
};

// State
let selectedDestinyIndex = 0;

const baseValues = {};
for (const a of [...GROUPS.corps, ...GROUPS.esprit]) {
  baseValues[a] = START_VALUE;
}

const secondaryValues = {};
for (const a of SECONDARY_ATTRS) {
  secondaryValues[a] = SECONDARY_BASE;
}

const birthAdjustments = {};
for (const a of SECONDARY_ATTRS) {
  birthAdjustments[a] = 0;
}

// ---------- PA cost helpers ----------
function stepCostUp(x) {
  // cost from x to x+1
  // matches your table: 7->8=3 (7-4), 8->9=4 (8-4), etc.
  return Math.max(0, x - 4);
}

function costRelativeToStart(value) {
  // cumulative PA delta relative to START_VALUE
  // >0 means spent, <0 means refunded
  let cost = 0;

  if (value > START_VALUE) {
    for (let x = START_VALUE; x < value; x += 1) cost += stepCostUp(x);
  } else if (value < START_VALUE) {
    for (let x = START_VALUE; x > value; x -= 1) cost -= stepCostUp(x - 1);
  }
  return cost;
}

function secondaryCostRelativeToBase(value) {
  // Special cost for secondary attributes
  const costs = { 8: -5, 9: -2, 10: 0, 11: 2, 12: 5 };
  return costs[value] ?? 0;
}

function chanceCostRelativeToBase(value) {
  // Chance uses double the secondary attribute cost
  const costs = { 8: -10, 9: -4, 10: 0, 11: 4, 12: 10 };
  return costs[value] ?? 0;
}

function totalSpentPA() {
  let sum = 0;
  for (const a of Object.keys(baseValues))
    sum += costRelativeToStart(baseValues[a]);
  for (const a of Object.keys(secondaryValues)) {
    if (a === "Équilibre") continue; // Équilibre doesn't cost PA directly
    if (a === "Chance") {
      sum += chanceCostRelativeToBase(secondaryValues[a]);
    } else {
      sum += secondaryCostRelativeToBase(secondaryValues[a]);
    }
  }
  return sum;
}

function currentDestiny() {
  return DESTINIES[selectedDestinyIndex];
}

function paBudget() {
  return currentDestiny().pa;
}

function maxBase() {
  return currentDestiny().max;
}

function paRemaining() {
  return paBudget() - totalSpentPA();
}

function formatSigned(n) {
  if (n > 0) return `+${n}`;
  return `${n}`;
}

function computeEquilibreBase() {
  // Équilibre = (min + max of base attributes) / 2
  const allBases = Object.values(baseValues);
  const min = Math.min(...allBases);
  const max = Math.max(...allBases);
  return Math.round((min + max) / 2);
}

// ---------- Origins helpers ----------
function buildOriginOptions(selectEl) {
  selectEl.innerHTML = "";

  const empty = document.createElement("option");
  empty.value = "";
  empty.textContent = "—";
  selectEl.appendChild(empty);

  for (const a of ORIGIN_ATTRIBUTES) {
    const opt = document.createElement("option");
    opt.value = a;
    opt.textContent = a;
    selectEl.appendChild(opt);
  }
}

const NON_RACE_SOURCES = new Set(["allegeance", "milieu", "persona"]);

function enforceNoDuplicatesOutsideRace(changedSelect) {
  const src = changedSelect.dataset.source;
  if (!NON_RACE_SOURCES.has(src)) return; // Race autorise les doublons

  const chosen = changedSelect.value;
  if (!chosen) return;

  // Collecte toutes les valeurs déjà prises dans ce même src (hors select courant)
  const others = originSelects.filter(s => s !== changedSelect && s.dataset.source === src);
  const used = new Set(others.map(s => s.value).filter(Boolean));

  // Si la valeur choisie existe déjà => on annule le dernier choix
  if (used.has(chosen)) {
    changedSelect.value = "";
    // Feedback minimal (pas "over engineered")
    alert("Dans cette catégorie, tu ne peux pas choisir deux fois le même attribut.");
  }
}

function refreshDisabledOptions() {
  // Pour chaque source non-race : désactiver les options déjà utilisées dans les autres selects de la même source
  for (const src of NON_RACE_SOURCES) {
    const selects = originSelects.filter(s => s.dataset.source === src);
    const values = selects.map(s => s.value).filter(Boolean);

    for (const sel of selects) {
      const current = sel.value;
      for (const opt of sel.options) {
        if (!opt.value) continue; // "—"
        // désactiver si utilisé ailleurs
        const usedElsewhere = values.includes(opt.value) && opt.value !== current;
        opt.disabled = usedElsewhere;
      }
    }
  }
}

function getOriginPicks() {
  const picks = [];
  for (const sel of originSelects) {
    const attr = sel.value;
    if (!attr) continue;
    picks.push({
      type: sel.dataset.type,     // boost | deboost
      attr,
      source: sel.dataset.source, // race | allegeance | milieu | persona
      slot: sel.dataset.slot,     // boost1/boost2/etc (utile pour debug)
    });
  }
  return picks;
}

function computeAdjustmentForAttribute(boostCount, deboostCount, boostCap = 4) {
  let boostValue = 0;
  if (boostCount >= 1) boostValue = 2 + Math.max(0, boostCount - 1);
  boostValue = Math.min(boostValue, boostCap);

  let deboostValue = 0;
  if (deboostCount >= 1) deboostValue = -2 - Math.max(0, deboostCount - 1);
  deboostValue = Math.max(deboostValue, -4);

  return { total: boostValue + deboostValue, boostValue, deboostValue };
}

function computeOriginsAdjustments(picks) {
  const counts = {};
  for (const a of ORIGIN_ATTRIBUTES) counts[a] = { boost: 0, deboost: 0 };

  const raceBoostCounts = {};
  for (const a of ORIGIN_ATTRIBUTES) raceBoostCounts[a] = 0;

  for (const p of picks) {
    if (!counts[p.attr]) continue;

    if (p.type === "boost") counts[p.attr].boost += 1;
    if (p.type === "deboost") counts[p.attr].deboost += 1;

    if (p.source === "race" && p.type === "boost") {
      raceBoostCounts[p.attr] += 1;
    }
  }

  const res = {};
  for (const a of ORIGIN_ATTRIBUTES) {
    const { boost, deboost } = counts[a];
    const boostCap = raceBoostCounts[a] >= 2 ? 6 : 4;

    res[a] = {
      boostCount: boost,
      deboostCount: deboost,
      boostCap,
      ...computeAdjustmentForAttribute(boost, deboost, boostCap),
    };
  }
  return res;
}

// ---------- UI rendering ----------
function makeSecondaryCard(attrName) {
  const card = document.createElement("div");
  card.className = "attrCard";
  card.dataset.attr = attrName;

  const left = document.createElement("div");
  left.className = "attrLeft";

  const name = document.createElement("div");
  name.className = "attrName";
  name.textContent = attrName;

  const baseRow = document.createElement("div");
  baseRow.className = "baseRow";

  if (attrName === "Équilibre") {
    baseRow.innerHTML = `
      <div>Calculé</div>
      <div class="baseControls">
        <span class="baseValue" data-role="baseValue">${SECONDARY_BASE}</span>
      </div>
    `;
  } else {
    baseRow.innerHTML = `
      <div>Base</div>
      <div class="baseControls">
        <button type="button" class="miniBtn" data-action="dec" aria-label="Baisser">−</button>
        <span class="baseValue" data-role="baseValue">${SECONDARY_BASE}</span>
        <button type="button" class="miniBtn" data-action="inc" aria-label="Monter">+</button>
      </div>
    `;
  }

  const origRow = document.createElement("div");
  origRow.className = "origRow";
  origRow.innerHTML = `
    <div>Orig.</div>
    <div class="origRowRight">
      <span class="origValue" data-role="origValue">0</span>
      <span class="paCost" data-role="paCost">0 PA</span>
    </div>
  `;

  const birthRow = document.createElement("div");
  birthRow.className = "origRow";
  birthRow.innerHTML = `
    <div>Naiss.</div>
    <div class="origRowRight">
      <span class="origValue" data-role="birthValue">0</span>
    </div>
  `;

  left.appendChild(name);
  left.appendChild(baseRow);
  left.appendChild(origRow);
  left.appendChild(birthRow);

  const divider = document.createElement("div");
  divider.className = "dividerV";

  const right = document.createElement("div");
  right.className = "attrFinal";
  right.innerHTML = `
    <div class="finalLabel">Final</div>
    <div class="finalValue" data-role="finalValue">${SECONDARY_BASE}</div>
  `;

  card.appendChild(left);
  card.appendChild(divider);
  card.appendChild(right);

  if (attrName !== "Équilibre") {
    card
      .querySelector('[data-action="inc"]')
      ?.addEventListener("click", () => changeSecondary(attrName, +1));
    card
      .querySelector('[data-action="dec"]')
      ?.addEventListener("click", () => changeSecondary(attrName, -1));
  }

  return card;
}

function makeAttrCard(attrName) {
  const card = document.createElement("div");
  card.className = "attrCard";
  card.dataset.attr = attrName;

  const left = document.createElement("div");
  left.className = "attrLeft";

  const name = document.createElement("div");
  name.className = "attrName";
  name.textContent = attrName;

  const baseRow = document.createElement("div");
  baseRow.className = "baseRow";
  baseRow.innerHTML = `
    <div>Base</div>
    <div class="baseControls">
      <button type="button" class="miniBtn" data-action="dec" aria-label="Baisser">−</button>
      <span class="baseValue" data-role="baseValue">${START_VALUE}</span>
      <button type="button" class="miniBtn" data-action="inc" aria-label="Monter">+</button>
    </div>
  `;

  const origRow = document.createElement("div");
  origRow.className = "origRow";
  origRow.innerHTML = `
    <div>Orig.</div>
    <div class="origRowRight">
      <span class="origValue" data-role="origValue">0</span>
      <span class="paCost" data-role="paCost">0 PA</span>
    </div>
  `;

  left.appendChild(name);
  left.appendChild(baseRow);
  left.appendChild(origRow);

  const divider = document.createElement("div");
  divider.className = "dividerV";

  const right = document.createElement("div");
  right.className = "attrFinal";
  right.innerHTML = `
    <div class="finalLabel">Final</div>
    <div class="finalValue" data-role="finalValue">${START_VALUE}</div>
  `;

  card.appendChild(left);
  card.appendChild(divider);
  card.appendChild(right);

  card
    .querySelector('[data-action="inc"]')
    .addEventListener("click", () => changeBase(attrName, +1));
  card
    .querySelector('[data-action="dec"]')
    .addEventListener("click", () => changeBase(attrName, -1));

  return card;
}

function mountAttrCards() {
  gridCorps.innerHTML = "";
  gridEsprit.innerHTML = "";
  gridAutre.innerHTML = "";
  gridSecondary.innerHTML = "";

  for (const a of GROUPS.corps) gridCorps.appendChild(makeAttrCard(a));
  for (const a of GROUPS.esprit) gridEsprit.appendChild(makeAttrCard(a));
  for (const a of GROUPS.autre) gridAutre.appendChild(makeAttrCard(a));
  for (const a of SECONDARY_ATTRS)
    gridSecondary.appendChild(makeSecondaryCard(a));
}

function updateDestinyUI() {
  const d = currentDestiny();
  destinyPAEl.textContent = `${d.pa}`;
  destinyMaxEl.textContent = `${d.max}`;
}

function updatePAHeader() {
  const spent = totalSpentPA();
  const remaining = paRemaining();

  paSpentEl.textContent = `${spent}`;
  paRemainingEl.textContent = `${remaining}`;
  paRemainingEl.style.color = remaining < 0 ? "var(--danger)" : "var(--text)";
}

function updateAttrCards() {
  const picks = getOriginPicks();
  const origins = computeOriginsAdjustments(picks);

  const max = maxBase();

  // Update primary attributes
  for (const attrName of Object.keys(baseValues)) {
    const card = document.querySelector(
      `.attrCard[data-attr="${CSS.escape(attrName)}"]`
    );
    if (!card) continue;

    const base = baseValues[attrName];
    const cost = costRelativeToStart(base);

    const orig = origins[attrName]?.total ?? 0;
    const final = base + orig;

    card.querySelector('[data-role="baseValue"]').textContent = `${base}`;

    const paCostEl = card.querySelector('[data-role="paCost"]');
    paCostEl.textContent = `${formatSigned(cost)} PA`;
    paCostEl.style.color = cost > 0 ? "var(--warn)" : "var(--muted)";

    const origEl = card.querySelector('[data-role="origValue"]');
    origEl.textContent = formatSigned(orig);
    origEl.classList.remove("origPos", "origNeg");
    if (orig > 0) origEl.classList.add("origPos");
    if (orig < 0) origEl.classList.add("origNeg");

    card.querySelector('[data-role="finalValue"]').textContent = `${final}`;

    const incBtn = card.querySelector('[data-action="inc"]');
    const decBtn = card.querySelector('[data-action="dec"]');

    decBtn.disabled = base <= MIN_BASE;

    const nextCost = stepCostUp(base);
    incBtn.disabled = base >= max || paRemaining() < nextCost;
  }

  // Update secondary attributes
  for (const attrName of SECONDARY_ATTRS) {
    const card = document.querySelector(
      `.attrCard[data-attr="${CSS.escape(attrName)}"]`
    );
    if (!card) continue;

    let base;
    if (attrName === "Équilibre") {
      base = computeEquilibreBase();
    } else {
      base = secondaryValues[attrName];
    }

    const cost =
      attrName === "Équilibre"
        ? 0
        : attrName === "Chance"
        ? chanceCostRelativeToBase(base)
        : secondaryCostRelativeToBase(base);
    const orig = origins[attrName]?.total ?? 0;
    const birth = birthAdjustments[attrName] ?? 0;
    const final = base + orig + birth;

    card.querySelector('[data-role="baseValue"]').textContent = `${base}`;

    const paCostEl = card.querySelector('[data-role="paCost"]');
    paCostEl.textContent = `${formatSigned(cost)} PA`;
    paCostEl.style.color =
      cost < 0 ? "var(--warn)" : cost > 0 ? "var(--muted)" : "var(--text)";

    const origEl = card.querySelector('[data-role="origValue"]');
    origEl.textContent = formatSigned(orig);
    origEl.classList.remove("origPos", "origNeg");
    if (orig > 0) origEl.classList.add("origPos");
    if (orig < 0) origEl.classList.add("origNeg");

    const birthEl = card.querySelector('[data-role="birthValue"]');
    birthEl.textContent = formatSigned(birth);
    birthEl.classList.remove("origPos", "origNeg");
    if (birth > 0) birthEl.classList.add("origPos");
    if (birth < 0) birthEl.classList.add("origNeg");

    card.querySelector('[data-role="finalValue"]').textContent = `${final}`;

    if (attrName !== "Équilibre") {
      const incBtn = card.querySelector('[data-action="inc"]');
      const decBtn = card.querySelector('[data-action="dec"]');

      if (incBtn && decBtn) {
        decBtn.disabled = base <= SECONDARY_MIN;

        const nextCost =
          attrName === "Chance"
            ? chanceCostRelativeToBase(base + 1)
            : secondaryCostRelativeToBase(base + 1);
        const currentRemaining = paRemaining();
        const costDiff = nextCost - cost;
        incBtn.disabled = base >= SECONDARY_MAX || currentRemaining < -costDiff;
      }
    }
  }

  updatePAHeader();
}

function changeBase(attrName, delta) {
  const current = baseValues[attrName];
  const next = current + delta;

  if (next < MIN_BASE || next > maxBase()) return;

  if (delta > 0) {
    const cost = stepCostUp(current);
    if (paRemaining() < cost) return;
  }

  baseValues[attrName] = next;
  renderAll();
}

function changeSecondary(attrName, delta) {
  if (attrName === "Équilibre") return; // Cannot manually change Équilibre

  const current = secondaryValues[attrName];
  const next = current + delta;

  if (next < SECONDARY_MIN || next > SECONDARY_MAX) return;

  const currentCost =
    attrName === "Chance"
      ? chanceCostRelativeToBase(current)
      : secondaryCostRelativeToBase(current);
  const nextCost =
    attrName === "Chance"
      ? chanceCostRelativeToBase(next)
      : secondaryCostRelativeToBase(next);
  const costDiff = nextCost - currentCost;

  if (paRemaining() < -costDiff) return;

  secondaryValues[attrName] = next;
  renderAll();
}

function resetBases() {
  for (const a of Object.keys(baseValues)) baseValues[a] = START_VALUE;
  for (const a of Object.keys(secondaryValues))
    secondaryValues[a] = SECONDARY_BASE;
}

function resetOrigins() {
  for (const sel of originSelects) sel.value = "";
}

function resetBirthAdjustments() {
  for (const a of SECONDARY_ATTRS) {
    birthAdjustments[a] = 0;
    if (birthInputs[a]) birthInputs[a].value = "0";
  }
}

function clampBasesToDestinyMax() {
  const max = maxBase();
  for (const a of Object.keys(baseValues)) {
    if (baseValues[a] > max) baseValues[a] = max;
  }
}

function renderAll() {
  updateDestinyUI();
  clampBasesToDestinyMax();
  updateAttrCards();
}

// ---------- Init ----------
(function init() {
  // Destinée dropdown
  destinySelect.innerHTML = "";
  DESTINIES.forEach((d, i) => {
    const opt = document.createElement("option");
    opt.value = String(i);
    opt.textContent = `${d.name} — ${d.pa} PA (Max ${d.max})`;
    destinySelect.appendChild(opt);
  });
  destinySelect.value = "0";
  destinySelect.addEventListener("change", () => {
    selectedDestinyIndex = Number(destinySelect.value) || 0;
    renderAll();
  });

  mountAttrCards();

  for (const sel of originSelects) {
    buildOriginOptions(sel);
    sel.addEventListener("change", (e) => {
      enforceNoDuplicatesOutsideRace(e.target);
      refreshDisabledOptions();
      renderAll();
    });
  }
  refreshDisabledOptions();

  resetOriginsBtn.addEventListener("click", () => {
    resetOrigins();
    renderAll();
  });

  resetAllBtn.addEventListener("click", () => {
    selectedDestinyIndex = 0;
    destinySelect.value = "0";
    resetBases();
    resetOrigins();
    resetBirthAdjustments();
    renderAll();
  });

  // Birth adjustments listeners
  for (const attrName of SECONDARY_ATTRS) {
    const input = birthInputs[attrName];
    if (!input) continue;

    input.addEventListener("input", () => {
      const value = parseInt(input.value) || 0;
      birthAdjustments[attrName] = value;
      renderAll();
    });
  }

  renderAll();
})();
