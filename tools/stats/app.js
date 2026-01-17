// Thalifen — Destinée + PA + Origines
// Base starts at 7.
// Destiny sets PA budget and max base value at creation.
// Step cost rule (matches your table):
//   X -> X+1 costs (X - 4) PA
// So: 7->8=3, 8->9=4, 9->10=5, ..., 17->18=13
// Lowering refunds the inverse step cost.
//
// Origins adjust per attribute:
// - Boosts: first +2, then +1 each, cap +4
// - Deboosts: first -2, then -1 each, cap -4
// Final = Base + OriginsAdjust

const START_VALUE = 7;
const MIN_BASE = 7;

const DESTINIES = [
  { name: "Commun des Mortels", pa: 200, pp: 2,  max: 14 },
  { name: "Destin Honorable",   pa: 300, pp: 4,  max: 15 },
  { name: "Marche de la Gloire",pa: 400, pp: 6,  max: 16 },
  { name: "Arpenteur Héroïque", pa: 500, pp: 8,  max: 17 },
  { name: "Dieu parmi les Hommes", pa: 600, pp: 10, max: 18 },
];

const GROUPS = {
  corps: ["Force", "Dextérité", "Agilité", "Constitution", "Perception"],
  esprit: ["Charisme", "Intelligence", "Ruse", "Volonté", "Sagesse"],
  autre: ["Magie", "Logique"],
};

// Origins targets include these (even if not displayed as PA cards)
const ORIGIN_ATTRIBUTES = [
  ...GROUPS.corps,
  ...GROUPS.esprit,
  ...GROUPS.autre,
  "Chance",
  "Équilibre",
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

const resetAllBtn = document.getElementById("resetAllBtn");
const resetOriginsBtn = document.getElementById("resetOriginsBtn");

const originSelects = Array.from(document.querySelectorAll(".attrSelect"));

// State
let selectedDestinyIndex = 0;

const baseValues = {};
for (const a of [...GROUPS.corps, ...GROUPS.esprit, ...GROUPS.autre]) {
  baseValues[a] = START_VALUE;
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

function totalSpentPA() {
  let sum = 0;
  for (const a of Object.keys(baseValues)) sum += costRelativeToStart(baseValues[a]);
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

function getOriginPicks() {
  const picks = [];
  for (const sel of originSelects) {
    const attr = sel.value;
    if (!attr) continue;
    picks.push({ type: sel.dataset.type, attr });
  }
  return picks;
}

function computeAdjustmentForAttribute(boostCount, deboostCount) {
  let boostValue = 0;
  if (boostCount >= 1) boostValue = 2 + Math.max(0, boostCount - 1);
  boostValue = Math.min(boostValue, 4);

  let deboostValue = 0;
  if (deboostCount >= 1) deboostValue = -2 - Math.max(0, deboostCount - 1);
  deboostValue = Math.max(deboostValue, -4);

  return { total: boostValue + deboostValue, boostValue, deboostValue };
}

function computeOriginsAdjustments(picks) {
  const counts = {};
  for (const a of ORIGIN_ATTRIBUTES) counts[a] = { boost: 0, deboost: 0 };

  for (const p of picks) {
    if (!counts[p.attr]) continue;
    if (p.type === "boost") counts[p.attr].boost += 1;
    if (p.type === "deboost") counts[p.attr].deboost += 1;
  }

  const res = {};
  for (const a of ORIGIN_ATTRIBUTES) {
    const { boost, deboost } = counts[a];
    res[a] = { boostCount: boost, deboostCount: deboost, ...computeAdjustmentForAttribute(boost, deboost) };
  }
  return res;
}

// ---------- UI rendering ----------
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

  card.querySelector('[data-action="inc"]').addEventListener("click", () => changeBase(attrName, +1));
  card.querySelector('[data-action="dec"]').addEventListener("click", () => changeBase(attrName, -1));

  return card;
}

function mountAttrCards() {
  gridCorps.innerHTML = "";
  gridEsprit.innerHTML = "";
  gridAutre.innerHTML = "";

  for (const a of GROUPS.corps) gridCorps.appendChild(makeAttrCard(a));
  for (const a of GROUPS.esprit) gridEsprit.appendChild(makeAttrCard(a));
  for (const a of GROUPS.autre) gridAutre.appendChild(makeAttrCard(a));
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
  const remaining = paRemaining(); // after current state

  for (const attrName of Object.keys(baseValues)) {
    const card = document.querySelector(`.attrCard[data-attr="${CSS.escape(attrName)}"]`);
    if (!card) continue;

    const base = baseValues[attrName];
    const cost = costRelativeToStart(base);

    const orig = origins[attrName]?.total ?? 0;
    const final = base + orig;

    card.querySelector('[data-role="baseValue"]').textContent = `${base}`;

    const paCostEl = card.querySelector('[data-role="paCost"]');
    paCostEl.textContent = `${formatSigned(cost)} PA`;

    // small tone: spent = warn-ish, refunded = muted
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
    // Recompute remaining after current total; increasing would reduce it by nextCost.
    incBtn.disabled = base >= max || paRemaining() < nextCost;
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

function resetBases() {
  for (const a of Object.keys(baseValues)) baseValues[a] = START_VALUE;
}

function resetOrigins() {
  for (const sel of originSelects) sel.value = "";
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
    sel.addEventListener("change", renderAll);
  }

  resetOriginsBtn.addEventListener("click", () => {
    resetOrigins();
    renderAll();
  });

  resetAllBtn.addEventListener("click", () => {
    selectedDestinyIndex = 0;
    destinySelect.value = "0";
    resetBases();
    resetOrigins();
    renderAll();
  });

  renderAll();
})();
