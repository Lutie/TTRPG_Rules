'use strict';

const ATTRS = ["FOR", "DEX", "AGI", "PER", "CON", "CHA", "INT", "RUS", "SAG", "VOL", "MAG"];
// TH×2 + H×2 + M×2 + B×2 = 8 assigned, TB = remaining 3

const LEVEL_NAMES = { "-1": "Minimal", "0": "Défaut", "1": "Avancé", "2": "Optimum", "3": "Paroxysme" };
const PART_BASE   = { "regne": 0, "race": 1, "ethnie": 2, "lignee": 3 };

let DATA = null;

const state = {
  regne:  null,
  race:   null,
  ethnie: null,
  lignee: null,
  rang:   3,
  role:   "ennemi",
  tiers:  {}    // { "FOR": "TH", "DEX": "H", ... }  — absent/null = TB
};

// ─── Init ───────────────────────────────────────────────────────────────────

async function init() {
  DATA = await fetch("data.json").then(r => r.json());
  buildAttrRows();
  populateRegnes();
  populateRangs();
  populateRoles();
  populateLignees();
  attachSelectors();
  render();
}

function populateLignees() {
  const lignees = DATA.lignees.filter(l => l.regne === null || l.regne === state.regne);
  const sel = document.getElementById("sel-lignee");
  sel.innerHTML = '<option value="">— Aucune —</option>' +
    lignees.map(l => `<option value="${l.id}">${l.nom}${l.regne === null ? " ✦" : ""}</option>`).join("");
  if (state.lignee && lignees.some(l => l.id === state.lignee)) sel.value = state.lignee;
}

// ─── Build static DOM ────────────────────────────────────────────────────────

function buildAttrRows() {
  const tbody = document.getElementById("attr-tbody");
  const tiers = ["TH", "H", "M", "B", "TB"];
  tbody.innerHTML = ATTRS.map(a => `
    <tr>
      <td class="attr-name">${a}</td>
      <td class="tier-radios">
        ${tiers.map(v => {
          const val = v === "TB" ? "" : v;
          return `<label class="tier-btn tier-${v}"><input type="radio" name="tier-${a}" value="${val}"${v === "TB" ? " checked" : ""}><span>${v}</span></label>`;
        }).join("")}
      </td>
      <td id="base-${a}" class="num">—</td>
      <td id="mod-${a}"  class="num">—</td>
      <td id="final-${a}" class="num final">—</td>
    </tr>
  `).join("");

  ATTRS.forEach(a => {
    document.querySelectorAll(`input[name="tier-${a}"]`).forEach(radio => {
      radio.addEventListener("change", e => {
        if (e.target.checked) {
          state.tiers[a] = e.target.value || null;
          render();
        }
      });
    });
  });
}

// ─── Populate dropdowns ──────────────────────────────────────────────────────

function populateRegnes() {
  const sel = document.getElementById("sel-regne");
  sel.innerHTML = '<option value="">— Choisir —</option>' +
    DATA.regnes.map(r => `<option value="${r.id}">${r.nom}</option>`).join("");
}

function populateRaces() {
  const races = state.regne ? DATA.races.filter(r => r.regne === state.regne) : [];
  const sel = document.getElementById("sel-race");
  sel.innerHTML = '<option value="">— Choisir —</option>' +
    races.map(r => `<option value="${r.id}">${r.nom}</option>`).join("");
}

function populateEthnies() {
  const ethnies = DATA.ethnies.filter(e => e.race === null || e.race === state.race);
  const sel = document.getElementById("sel-ethnie");
  sel.innerHTML = '<option value="">— Aucune —</option>' +
    ethnies.map(e => `<option value="${e.id}">${e.nom}${e.race === null ? " ✦" : ""}</option>`).join("");
}

function populateRangs() {
  const sel = document.getElementById("sel-rang");
  sel.innerHTML = DATA.rangs.map(r =>
    `<option value="${r.rang}" ${r.rang === state.rang ? "selected" : ""}>${r.rang >= 0 ? "+" : ""}${r.rang} — ${r.titre}</option>`
  ).join("");
}

function populateRoles() {
  const sel = document.getElementById("sel-role");
  sel.innerHTML = DATA.roles.map(r =>
    `<option value="${r.id}" ${r.id === state.role ? "selected" : ""}>${r.nom}</option>`
  ).join("");
}

// ─── Attach selectors ────────────────────────────────────────────────────────

function attachSelectors() {
  document.getElementById("sel-regne").addEventListener("change", e => {
    state.regne  = e.target.value || null;
    state.race   = null;
    state.ethnie = null;
    state.lignee = null;
    populateRaces();
    populateEthnies();
    populateLignees();
    render();
  });
  document.getElementById("sel-lignee").addEventListener("change", e => {
    state.lignee = e.target.value || null;
    render();
  });
  document.getElementById("sel-race").addEventListener("change", e => {
    state.race = e.target.value || null;
    state.ethnie = null;
    populateEthnies();
    render();
  });
  document.getElementById("sel-ethnie").addEventListener("change", e => {
    state.ethnie = e.target.value || null;
    render();
  });
  document.getElementById("sel-rang").addEventListener("change", e => {
    state.rang = parseInt(e.target.value);
    render();
  });
  document.getElementById("sel-role").addEventListener("change", e => {
    state.role = e.target.value;
    render();
  });
}

// ─── Lookups ─────────────────────────────────────────────────────────────────

const getRangData    = () => DATA.rangs.find(r => r.rang === state.rang);
const getRaceData    = () => state.race   ? DATA.races.find(r => r.id === state.race)     : null;
const getEthnieData  = () => state.ethnie ? DATA.ethnies.find(e => e.id === state.ethnie) : null;
const getRegneData   = () => state.regne  ? DATA.regnes.find(r => r.id === state.regne)   : null;
const getRoleData    = () => DATA.roles.find(r => r.id === state.role);
const getLigneeData  = () => state.lignee ? DATA.lignees.find(l => l.id === state.lignee) : null;

function attrMod(attr) {
  let mod = 0;
  const race   = getRaceData();
  const ethnie = getEthnieData();
  if (race)   { if (race.attributs_forts.includes(attr))   mod += 2; if (race.attributs_faibles.includes(attr))   mod -= 2; }
  if (ethnie) { if (ethnie.attributs_forts.includes(attr)) mod += 2; if (ethnie.attributs_faibles.includes(attr)) mod -= 2; }
  const lignee = getLigneeData();
  if (lignee) { if (lignee.attributs_forts.includes(attr)) mod += 2; }
  return mod;
}

function tierCounts() {
  const c = { TH: 0, H: 0, M: 0, B: 0 };
  Object.values(state.tiers).forEach(t => { if (t && c[t] !== undefined) c[t]++; });
  return c;
}

// level: null = pas disponible, -1 à 3
function partLevel(type, rang) {
  const base = PART_BASE[type] ?? 0;
  if (rang < base - 3) return null;
  if (rang < base)     return -1;
  if (rang < base + 5) return 0;
  if (rang < base + 10) return 1;
  if (rang < base + 15) return 2;
  return 3;
}

// ─── Render ──────────────────────────────────────────────────────────────────

function render() {
  renderRangInfo();
  renderRoleInfo();
  renderAttrTable();
  renderParticularites();
}

function renderRangInfo() {
  const rd = getRangData();
  if (!rd) return;
  const sign = n => n >= 0 ? `+${n}` : `${n}`;
  document.getElementById("rang-info").innerHTML = `
    <span class="chip">TH ${rd.TH}</span>
    <span class="chip">H ${rd.H}</span>
    <span class="chip">M ${rd.M}</span>
    <span class="chip">B ${rd.B}</span>
    <span class="chip">TB ${rd.TB}</span>
    <span class="chip sep">Ajust ${sign(rd.ajust)}</span>
    <span class="chip">Modif ${sign(rd.modif)}</span>
    <span class="chip">Comp ${rd.comp}</span>
    <span class="chip">Grp ${rd.grp}</span>
    <span class="chip accent">Total ${sign(rd.total)}</span>
  `;
}

function renderRoleInfo() {
  const role = getRoleData();
  if (!role) return;
  const sign = n => n >= 0 ? `+${n}` : `${n}`;
  const inRange = state.rang >= role.rang_min && state.rang <= role.rang_max;
  document.getElementById("role-info").innerHTML = `
    <span class="chip ${inRange ? "" : "warn"}">Rang ${role.rang_min}→${role.rang_max}${inRange ? "" : " ⚠"}</span>
    <span class="chip">Moral ${role.moral}</span>
    <span class="chip">PK ${role.pk}</span>
    <span class="chip">Ressources ${role.ressources}</span>
    <span class="chip sep">Qualité ${role.qualite}</span>
    <span class="chip">Promo ${role.promotions_def}/${role.promotions_max}</span>
    <span class="chip accent">Bonus/Malus ${sign(role.bonus_malus)}</span>
  `;
}

function renderAttrTable() {
  const rd     = getRangData();
  const counts = tierCounts();
  const tbAttrs = ATTRS.filter(a => !state.tiers[a]);

  // Validation indicator
  const isValid = counts.TH <= 2 && counts.H <= 2 && counts.M <= 2 && counts.B <= 2;
  const validEl = document.getElementById("tier-valid");
  if (validEl) {
    validEl.textContent = isValid ? " ✓" : " ✗";
    validEl.className   = isValid ? "tier-valid ok" : "tier-valid err";
  }

  ATTRS.forEach(a => {
    const tier = state.tiers[a] || null;
    const isTB = !tier;
    const effectiveTier = tier || "TB";
    const base  = rd ? rd[effectiveTier] : null;
    const mod   = attrMod(a);
    const final = base !== null ? base + mod : null;

    const baseEl = document.getElementById(`base-${a}`);
    if (baseEl) baseEl.textContent = base !== null ? base : "—";

    const modEl = document.getElementById(`mod-${a}`);
    if (modEl) {
      modEl.textContent = mod !== 0 ? (mod > 0 ? `+${mod}` : `${mod}`) : "—";
      modEl.className   = `num ${mod > 0 ? "pos" : mod < 0 ? "neg" : ""}`;
    }

    const finalEl = document.getElementById(`final-${a}`);
    if (finalEl) {
      finalEl.textContent = final !== null ? final : "—";
      finalEl.className   = `num final ${isTB ? "tb" : ""}`;
    }

    // Disable radio options already at cap (except TB and current selection)
    document.querySelectorAll(`input[name="tier-${a}"]`).forEach(radio => {
      const val = radio.value;
      if (!val) { radio.disabled = false; return; }
      radio.disabled = val !== tier && counts[val] >= 2;
    });
  });

  const tbEl = document.getElementById("tb-summary");
  if (tbEl) tbEl.textContent = tbAttrs.length ? tbAttrs.join(", ") : "—";

  const eqEl = document.getElementById("equilibre-val");
  if (eqEl && rd) eqEl.textContent = rd.M + rd.ajust;
}

function renderParticularites() {
  const rang   = state.rang;
  const regne  = getRegneData();
  const race   = getRaceData();
  const ethnie = getEthnieData();

  const all = [];
  if (regne)  regne.particularites.forEach(p  => all.push({ ...p,  source: "Règne"  }));
  if (race)   race.particularites.forEach(p   => all.push({ ...p,  source: "Race"   }));
  if (ethnie) ethnie.particularites.forEach(p => all.push({ ...p,  source: "Ethnie" }));
  const lignee = getLigneeData();
  if (lignee) lignee.particularites.forEach(p => all.push({ ...p, source: `Lignée — ${lignee.nom}` }));

  const el = document.getElementById("result-parts");
  if (!el) return;

  if (!all.length) {
    el.innerHTML = '<p class="muted">Sélectionner un règne, une race et/ou une ethnie.</p>';
    return;
  }

  el.innerHTML = all.map(part => {
    const level = partLevel(part.type, rang);
    const levelName = level !== null ? LEVEL_NAMES[String(level)] : null;

    if (level === null) {
      return `<div class="part locked">
        <div class="part-head">
          <span class="part-nom">${part.nom}</span>
          <span class="tag">${part.source}</span>
        </div>
        <p class="muted">Non disponible à ce rang.</p>
      </div>`;
    }

    const effets = part.sous_effets.map(e => {
      const val = e.valeurs[String(level)];
      if (val === null || val === undefined) {
        return `<li><strong>${e.nom}</strong> — <em class="muted">Non actif à ce rang.</em></li>`;
      }
      const desc = val === true
        ? e.description
        : e.description.replace(/\{x\}/g, `<strong class="val-x">${val}</strong>`);
      return `<li><strong>${e.nom}</strong> — ${desc}</li>`;
    }).join("");

    return `<div class="part">
      <div class="part-head">
        <span class="part-nom">${part.nom}</span>
        <span class="tag">${part.source}</span>
        <span class="level-badge">${levelName} (${level >= 0 ? "+" : ""}${level})</span>
      </div>
      <ul class="effets">${effets}</ul>
    </div>`;
  }).join("");
}

window.addEventListener("DOMContentLoaded", init);
