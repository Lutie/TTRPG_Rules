// Thalifen Boost/Deboost helper (simple structured version)
// Rules per attribute:
// - Boosts: first = +2, next = +1 each, cap +4 total
// - Deboosts: first = -2, next = -1 each, cap -4 total
// - Compute counts per attribute, apply caps, sum.

const ATTRIBUTES = [
    "Force",
    "Constitution",
    "Dextérité",
    "Agilité",
    "Perception",
    "Charisme",
    "Volonté",
    "Intelligence",
    "Ruse",
    "Sagesse",
    "Magie",
    "Logique",
    "Chance",
    "Équilibre",
  ];
  
  const attrSelects = Array.from(document.querySelectorAll(".attrSelect"));
  const resetBtn = document.getElementById("resetBtn");
  const resultsGrid = document.getElementById("resultsGrid");
  const detailsBox = document.getElementById("detailsBox");
  
  function buildOptions(selectEl) {
    selectEl.innerHTML = "";
  
    // Empty option
    const empty = document.createElement("option");
    empty.value = "";
    empty.textContent = "—";
    selectEl.appendChild(empty);
  
    for (const a of ATTRIBUTES) {
      const opt = document.createElement("option");
      opt.value = a;
      opt.textContent = a;
      selectEl.appendChild(opt);
    }
  }
  
  function getSelections() {
    // Returns array of { type: "boost"|"deboost", attr: "Force"|... }
    const picks = [];
    for (const sel of attrSelects) {
      const attr = sel.value;
      if (!attr) continue; // ignore empty
      picks.push({
        type: sel.dataset.type,
        source: sel.dataset.source,
        slot: sel.dataset.slot,
        attr,
      });
    }
    return picks;
  }
  
  function computeAdjustmentForAttribute(boostCount, deboostCount) {
    let boostValue = 0;
    if (boostCount >= 1) boostValue = 2 + Math.max(0, boostCount - 1) * 1;
    boostValue = Math.min(boostValue, 4);
  
    let deboostValue = 0;
    if (deboostCount >= 1) deboostValue = -2 - Math.max(0, deboostCount - 1) * 1;
    deboostValue = Math.max(deboostValue, -4);
  
    return { boostValue, deboostValue, total: boostValue + deboostValue };
  }
  
  function computeAll(picks) {
    const counts = {};
    for (const a of ATTRIBUTES) counts[a] = { boost: 0, deboost: 0 };
  
    for (const p of picks) {
      if (!counts[p.attr]) continue;
      if (p.type === "boost") counts[p.attr].boost += 1;
      if (p.type === "deboost") counts[p.attr].deboost += 1;
    }
  
    const results = {};
    for (const a of ATTRIBUTES) {
      const { boost, deboost } = counts[a];
      results[a] = {
        boostCount: boost,
        deboostCount: deboost,
        ...computeAdjustmentForAttribute(boost, deboost),
      };
    }
    return results;
  }
  
  function formatSigned(n) {
    if (n > 0) return `+${n}`;
    return `${n}`;
  }
  
  function renderResults(results) {
    resultsGrid.innerHTML = "";
  
    for (const attr of ATTRIBUTES) {
      const r = results[attr];
  
      const card = document.createElement("div");
      card.className = "resultCard";
  
      const top = document.createElement("div");
      top.className = "resultTop";
  
      const name = document.createElement("div");
      name.className = "resultName";
      name.textContent = attr;
  
      const val = document.createElement("div");
      val.className = "resultValue";
      if (r.total > 0) val.classList.add("valuePos");
      if (r.total < 0) val.classList.add("valueNeg");
      val.textContent = formatSigned(r.total);
  
      top.appendChild(name);
      top.appendChild(val);
  
      const meta = document.createElement("div");
      meta.className = "resultMeta";
      meta.innerHTML = `
        Boosts: <strong>${r.boostCount}</strong> → ${formatSigned(r.boostValue)}<br/>
        Deboosts: <strong>${r.deboostCount}</strong> → ${formatSigned(r.deboostValue)}<br/>
        Total: <strong>${formatSigned(r.total)}</strong>
      `;
  
      card.appendChild(top);
      card.appendChild(meta);
      resultsGrid.appendChild(card);
    }
  }
  
  function summarizeBySource(picks) {
    const sources = ["race", "allegeance", "milieu", "persona"];
    const nice = {
      race: "Race",
      allegeance: "Allégeance",
      milieu: "Milieu de vie",
      persona: "Persona",
    };
  
    const counts = {};
    for (const s of sources) counts[s] = { boost: 0, deboost: 0 };
  
    for (const p of picks) {
      if (!counts[p.source]) continue;
      if (p.type === "boost") counts[p.source].boost += 1;
      if (p.type === "deboost") counts[p.source].deboost += 1;
    }
  
    return sources.map(s => ({
      source: nice[s],
      boost: counts[s].boost,
      deboost: counts[s].deboost,
    }));
  }
  
  function renderDetails(picks, results) {
    const totalBoosts = picks.filter(p => p.type === "boost").length;
    const totalDeboosts = picks.filter(p => p.type === "deboost").length;
  
    const capped = [];
    for (const a of ATTRIBUTES) {
      const r = results[a];
      if (r.boostCount > 0 && r.boostValue === 4) capped.push(`${a} (cap Boost +4)`);
      if (r.deboostCount > 0 && r.deboostValue === -4) capped.push(`${a} (cap Deboost -4)`);
    }
  
    const bySource = summarizeBySource(picks);
  
    detailsBox.innerHTML = `
      <div><strong>Sélections :</strong> ${picks.length}</div>
      <div><strong>Total Boosts :</strong> ${totalBoosts}</div>
      <div><strong>Total Deboosts :</strong> ${totalDeboosts}</div>
  
      <div style="margin-top:10px;">
        <strong>Par catégorie :</strong>
        <ul>
          ${bySource.map(s => `<li>${s.source} — Boosts: <strong>${s.boost}</strong>, Deboosts: <strong>${s.deboost}</strong></li>`).join("")}
        </ul>
      </div>
  
      <div style="margin-top:10px;">
        <strong>Caps atteints :</strong><br/>
        ${capped.length ? `<ul>${capped.map(x => `<li>${x}</li>`).join("")}</ul>` : `<em>Aucun</em>`}
      </div>
    `;
  }
  
  function renderAll() {
    const picks = getSelections();
    const results = computeAll(picks);
    renderResults(results);
    renderDetails(picks, results);
  }
  
  function resetAll() {
    for (const sel of attrSelects) sel.value = "";
    renderAll();
  }
  
  // Init
  (function init() {
    for (const sel of attrSelects) {
      buildOptions(sel);
      sel.addEventListener("change", renderAll);
    }
    resetBtn.addEventListener("click", resetAll);
    renderAll();
  })();
  