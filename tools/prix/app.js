// Calculateur de Prix — Terre Natale
// Formule : prix_achat = (prix_base + particularités×(C+1) + améliorations + matière) × qual_mult × rareté%
// prix_vente = prix_achat × 0.25

// ─── Tables de données ────────────────────────────────────────────────────────

// Prix de base par catégorie (directement depuis les tables du Chapitre 9)
const BASE = {
  melee:    [20, 40, 60, 80, 100, 120, 160, null, null], // cat 0–8 (6-8 n'existent pas en mêlée)
  distance: [null, 30, 50, 70, 90, 110, 150, 200, 250],  // cat 0 n'existe pas
  armure:          [20, 60, 100, 140, 180, 220],          // cat 0–5
  armure_travaillee:[40, 80, 120, 160, 200, 240],
};

const CAT_LABELS = {
  melee: [
    "0 – Sans arme (poing)",
    "1 – Arme Commune (dague, bâton)",
    "2 – Arme d'Escarmouche (épée courte, arc léger)",
    "3 – Arme d'Assaut (épée longue, hache)",
    "4 – Arme de Bataille (épée bâtarde, marteau)",
    "5 – Arme de Guerre (espadon, flamberge)",
  ],
  distance: [
    "1 – Arme Commune à distance",
    "2 – Arme d'Escarmouche à distance",
    "3 – Arme d'Assaut à distance",
    "4 – Arme de Bataille à distance",
    "5 – Arme de Guerre à distance",
    "6 – Siège léger",
    "7 – Siège",
    "8 – Siège lourd",
  ],
  armure: [
    "0 – Sans armure (vêtement)",
    "1 – Tissu / Étoffes",
    "2 – Peau légère / Peau lourde",
    "3 – Cuir léger / Cuir lourd",
    "4 – Mailles / Écailles",
    "5 – Plaques / Plates",
  ],
};

// Valeurs de catégorie correspondant aux labels ci-dessus
const CAT_VALUES = {
  melee:    [0, 1, 2, 3, 4, 5],
  distance: [1, 2, 3, 4, 5, 6, 7, 8],
  armure:   [0, 1, 2, 3, 4, 5],
};

// Multiplicateurs de qualité pour les équipements
const QUAL_DATA = [
  { v: -5, label: "−5  Minable",               mult: 1/4 },
  { v: -4, label: "−4  Très médiocre",          mult: 1/3 },
  { v: -3, label: "−3  Médiocre",               mult: 1/2 },
  { v: -2, label: "−2  Très mauvaise facture",  mult: 2/3 },
  { v: -1, label: "−1  Mauvaise facture",        mult: 3/4 },
  { v:  0, label: " 0  Normale",                mult: 1   },
  { v:  1, label: "+1  Bonne facture",           mult: 3   },
  { v:  2, label: "+2  Très bonne facture",      mult: 6   },
  { v:  3, label: "+3  Excellente facture",      mult: 12  },
  { v:  4, label: "+4  Superbe",                 mult: 25  },
  { v:  5, label: "+5  Merveilleuse",            mult: 50  },
  { v:  6, label: "+6  Légendaire",              mult: 100 },
];

// Modificateurs de taille/gabarit/équilibre sur le prix de référence
const PARTI_PRIX = { "-2": -6, "-1": -3, "0": 0, "1": 3, "2": 6 };

// Formes
const FORMES = {
  arme: [
    { v: "non_metal", label: "Non métallique  (−4 au prix réf.)", delta: -4 },
    { v: "composite", label: "Composite  (±0)", delta: 0 },
    { v: "metal",     label: "Entièrement métallique  (+4 au prix réf.)", delta: 4 },
  ],
  armure: [
    { v: "allegee",   label: "Allégée  (−7 au prix réf.)", delta: -7 },
    { v: "normale",   label: "Normale  (±0)", delta: 0 },
    { v: "renforcee", label: "Renforcée  (+7 au prix réf.)", delta: 7 },
  ],
};

// ─── État ─────────────────────────────────────────────────────────────────────

let state = {
  type:       "melee",
  cat:        0,       // index in CAT_VALUES[type]
  travaillee: false,
  qual:       0,
  taille:     0,
  gabarit:    0,
  equilibre:  0,
  forme:      "composite",
  amelios:    0,
  matiere:    0,
  rarete:     0,
};

// ─── Éléments DOM ─────────────────────────────────────────────────────────────

const selCat      = document.getElementById("selCat");
const selQual     = document.getElementById("selQual");
const selTaille   = document.getElementById("selTaille");
const selGabarit  = document.getElementById("selGabarit");
const selEquilibre= document.getElementById("selEquilibre");
const selForme    = document.getElementById("selForme");
const inpAmelios  = document.getElementById("inpAmelios");
const inpMatiere  = document.getElementById("inpMatiere");
const inpRarete   = document.getElementById("inpRarete");
const hintCat     = document.getElementById("hintCat");
const hintQual    = document.getElementById("hintQual");
const hintForme   = document.getElementById("hintForme");
const hintAmelios = document.getElementById("hintAmelios");
const groupEquilibre  = document.getElementById("groupEquilibre");
const groupTravaillee = document.getElementById("groupTravaillee");
const togNormale      = document.getElementById("togNormale");
const togTravaillee   = document.getElementById("togTravaillee");
const breakdown   = document.getElementById("breakdown");
const prices      = document.getElementById("prices");

// ─── Init ─────────────────────────────────────────────────────────────────────

function buildCatSelect() {
  selCat.innerHTML = "";
  const labels = CAT_LABELS[state.type];
  labels.forEach((lbl, i) => {
    const o = document.createElement("option");
    o.value = i;
    o.textContent = lbl;
    selCat.appendChild(o);
  });
  selCat.value = 0;
  state.cat = 0;
}

function buildQualSelect() {
  selQual.innerHTML = "";
  QUAL_DATA.forEach(q => {
    const o = document.createElement("option");
    o.value = q.v;
    o.textContent = q.label;
    selQual.appendChild(o);
  });
  selQual.value = 0;
  state.qual = 0;
}

function buildFormeSelect() {
  selForme.innerHTML = "";
  const formes = state.type === "armure" ? FORMES.armure : FORMES.arme;
  formes.forEach(f => {
    const o = document.createElement("option");
    o.value = f.v;
    o.textContent = f.label;
    selForme.appendChild(o);
  });
  // Default to composite/normale (index 1)
  selForme.selectedIndex = 1;
  state.forme = formes[1].v;
}

function updateTypeUI() {
  const isArmure = state.type === "armure";
  groupEquilibre.style.display  = isArmure ? "none" : "";
  groupTravaillee.style.display = isArmure ? "" : "none";

  // Forme restrictions for armure
  if (isArmure) {
    // Allégée only for cat ≤ 2, renforcée only for cat ≥ 3
    updateFormeRestrictions();
  }
}

function updateFormeRestrictions() {
  if (state.type !== "armure") return;
  const catVal = CAT_VALUES.armure[state.cat] ?? 0;
  Array.from(selForme.options).forEach(o => {
    if (o.value === "allegee")   o.disabled = catVal >= 3;
    if (o.value === "renforcee") o.disabled = catVal <= 2;
  });
  // Reset if current choice is now disabled
  const cur = selForme.options[selForme.selectedIndex];
  if (cur && cur.disabled) {
    selForme.value = "normale";
    state.forme = "normale";
  }
}

// ─── Calcul ───────────────────────────────────────────────────────────────────

function fmt(n) {
  return n.toLocaleString("fr-FR", { minimumFractionDigits: 0, maximumFractionDigits: 1 });
}

function compute() {
  const catIdx  = parseInt(selCat.value);
  const catVal  = CAT_VALUES[state.type][catIdx];
  const cPlus1  = catVal + 1;

  // Prix de base depuis la table
  let prixBase;
  if (state.type === "armure") {
    prixBase = state.travaillee
      ? BASE.armure_travaillee[catIdx]
      : BASE.armure[catIdx];
  } else {
    prixBase = BASE[state.type][catVal];
  }

  if (prixBase == null) {
    breakdown.innerHTML = `<p class="err">Cette combinaison n'existe pas (catégorie ${catVal} invalide pour ce type).</p>`;
    prices.innerHTML = "";
    return;
  }

  // Modificateurs de particularités → appliqués au prix de référence × (C+1)
  const dTaille   = PARTI_PRIX[String(state.taille)]   ?? 0;
  const dGabarit  = PARTI_PRIX[String(state.gabarit)]  ?? 0;
  const dEquilibre= state.type !== "armure" ? (PARTI_PRIX[String(state.equilibre)] ?? 0) : 0;

  const formes = state.type === "armure" ? FORMES.armure : FORMES.arme;
  const formeData = formes.find(f => f.v === state.forme) ?? formes[1];
  const dForme = formeData.delta;

  const totalDelta = dTaille + dGabarit + dEquilibre + dForme;
  const prixPartic = totalDelta * cPlus1;

  const amelios = parseFloat(inpAmelios.value) || 0;
  const matiere = parseFloat(inpMatiere.value) || 0;

  const prixObjet = prixBase + prixPartic + amelios + matiere;

  const qualData = QUAL_DATA.find(q => q.v === parseInt(selQual.value)) ?? QUAL_DATA[5];
  const rarete   = (parseFloat(inpRarete.value) || 0) / 100;

  const prixAchat = prixObjet * qualData.mult * (1 + rarete);
  const prixVente = prixAchat * 0.25;

  // Capacité d'amélioration
  const qualVal = parseInt(selQual.value);
  const capAmelio = Math.max(0, qualVal);

  // Affichage breakdown
  const rows = [];
  rows.push(["Prix de base (table cat. " + catVal + (state.travaillee ? " travaillée" : "") + ")", fmt(prixBase) + " ¤"]);

  if (totalDelta !== 0) {
    const parts = [];
    if (dTaille   !== 0) parts.push(`taille ${dTaille > 0 ? "+" : ""}${dTaille}`);
    if (dGabarit  !== 0) parts.push(`gabarit ${dGabarit > 0 ? "+" : ""}${dGabarit}`);
    if (dEquilibre !== 0) parts.push(`équilibre ${dEquilibre > 0 ? "+" : ""}${dEquilibre}`);
    if (dForme    !== 0) parts.push(`forme ${dForme > 0 ? "+" : ""}${dForme}`);
    const sign = prixPartic >= 0 ? "+" : "";
    rows.push([`Particularités (${parts.join(", ")}) × ${cPlus1}`, `${sign}${fmt(prixPartic)} ¤`]);
  }

  if (amelios !== 0) rows.push(["Améliorations", `+${fmt(amelios)} ¤`]);
  if (matiere !== 0) rows.push(["Matière", `+${fmt(matiere)} ¤`]);

  rows.push(["Prix de l'objet", fmt(prixObjet) + " ¤", "sep"]);
  rows.push([`Qualité ×${fmt(qualData.mult)} (${qualData.label.trim()})`, ""]);
  if (rarete !== 0) rows.push([`Rareté ${rarete >= 0 ? "+" : ""}${fmt(rarete * 100)}%`, ""]);
  rows.push(["Capacité d'amélioration", capAmelio > 0 ? `${capAmelio} slot${capAmelio > 1 ? "s" : ""}` : "—"]);

  breakdown.innerHTML = rows.map(([label, val, cls]) => `
    <div class="brow${cls === "sep" ? " sep" : ""}">
      <span class="blabel">${label}</span>
      <span class="bval">${val}</span>
    </div>`).join("");

  prices.innerHTML = `
    <div class="price-box">
      <div class="price-label">Prix d'achat</div>
      <div class="price-value">${fmt(prixAchat)} <span class="currency">¤</span></div>
    </div>
    <div class="price-box sell">
      <div class="price-label">Prix de vente</div>
      <div class="price-value">${fmt(prixVente)} <span class="currency">¤</span></div>
    </div>`;
}

// ─── Événements ───────────────────────────────────────────────────────────────

document.getElementById("typeTabs").addEventListener("click", e => {
  const btn = e.target.closest(".tab");
  if (!btn) return;
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  btn.classList.add("active");
  state.type = btn.dataset.type;
  buildCatSelect();
  buildFormeSelect();
  updateTypeUI();
  compute();
});

selCat.addEventListener("change", () => {
  state.cat = parseInt(selCat.value);
  updateFormeRestrictions();
  updateCatHint();
  compute();
});

selQual.addEventListener("change", () => {
  state.qual = parseInt(selQual.value);
  updateQualHint();
  compute();
});

selTaille.addEventListener("change",    () => { state.taille    = parseInt(selTaille.value);    compute(); });
selGabarit.addEventListener("change",   () => { state.gabarit   = parseInt(selGabarit.value);   compute(); });
selEquilibre.addEventListener("change", () => { state.equilibre = parseInt(selEquilibre.value); compute(); });

selForme.addEventListener("change", () => {
  state.forme = selForme.value;
  updateFormeHint();
  compute();
});

inpAmelios.addEventListener("input", () => {
  updateAmelioHint();
  compute();
});
inpMatiere.addEventListener("input", compute);
inpRarete.addEventListener("input",  compute);

// Travaillée toggles
[togNormale, togTravaillee].forEach(btn => {
  btn.addEventListener("click", () => {
    state.travaillee = btn.dataset.val === "travaillee";
    togNormale.classList.toggle("active",    !state.travaillee);
    togTravaillee.classList.toggle("active", state.travaillee);
    compute();
  });
});

// ─── Hints ────────────────────────────────────────────────────────────────────

function updateCatHint() {
  const catVal = CAT_VALUES[state.type][state.cat] ?? 0;
  const cPlus1 = catVal + 1;
  const jets   = catVal === 0 ? "2D8" : `${catVal + 2}D8`;
  const pen    = catVal * 2;
  hintCat.textContent = `Jets : ${jets}  ·  Pénalités : −${pen}  ·  Poids de base : ${catVal * 5}  ·  Facteur (C+1) : ×${cPlus1}`;
}

function updateQualHint() {
  const q = QUAL_DATA.find(d => d.v === parseInt(selQual.value));
  if (!q) return;
  const qualVal = parseInt(selQual.value);
  hintQual.textContent = `Multiplicateur de prix : ×${q.mult <= 1 ? q.mult.toFixed(2) : q.mult}  ·  Slots d'amélioration : ${Math.max(0, qualVal)}`;
}

function updateFormeHint() {
  if (state.type === "armure") {
    const map = { allegee: "Fragile, charge −2. Interdit cat ≥ 3.", normale: "Standard.", renforcee: "Solide, charge +2. Interdit cat ≤ 2." };
    hintForme.textContent = map[state.forme] ?? "";
  } else {
    const map = { non_metal: "Fragile, charge −2. Non létale.", composite: "Standard. Létale.", metal: "Solide, charge +2. Létale." };
    hintForme.textContent = map[state.forme] ?? "";
  }
}

function updateAmelioHint() {
  const qualVal = parseInt(selQual.value);
  const cap = Math.max(0, qualVal);
  hintAmelios.textContent = cap > 0
    ? `Capacité d'amélioration : ${cap} slot${cap > 1 ? "s" : ""} (= niveau de qualité).`
    : "Qualité 0 ou négative : aucune amélioration possible.";
}

// ─── Démarrage ────────────────────────────────────────────────────────────────

buildCatSelect();
buildQualSelect();
buildFormeSelect();
updateTypeUI();
togNormale.classList.add("active");
updateCatHint();
updateQualHint();
updateFormeHint();
updateAmelioHint();
compute();
