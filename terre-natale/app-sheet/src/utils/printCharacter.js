import DATA from '../data';
import { calculerModificateur } from '../hooks/useCharacterCalculations';

const ATTRS_CORPS  = ['FOR', 'DEX', 'AGI', 'CON', 'PER'];
const ATTRS_ESPRIT = ['CHA', 'INT', 'RUS', 'VOL', 'SAG'];
const ATTRS_SPEC   = ['MAG', 'LOG', 'CHN', 'EQU', 'STA', 'TAI', 'EGO', 'APP'];
const ALL_ATTRS    = [...DATA.attributsCorps, ...DATA.attributsEsprit, ...DATA.attributsSecondaires];

const FORMES_ARME = [
  { id: 'tranchant',   label: 'Tranchant',   attr: 'DEX' },
  { id: 'contondant',  label: 'Contondant',   attr: 'FOR' },
  { id: 'perforant',   label: 'Perforant',    attr: 'AGI' },
  { id: 'distance',    label: 'Distance',     attr: 'PER' },
];

const TYPES_ARME = [
  { id: 'escrime',  label: 'Escrime',  attr: 'DEX' },
  { id: 'choc',     label: 'Choc',     attr: 'FOR' },
  { id: 'hast',     label: 'Hast',     attr: 'AGI' },
  { id: 'defense',  label: 'Défense',  attr: 'CON' },
  { id: 'distance', label: 'Distance', attr: 'PER' },
];

const SLOT_LABELS = {
  mainDirectrice: 'Main dir.', mainNonDirectrice: 'Main non-dir.', deuxMains: 'Deux mains',
  armure: 'Armure', visage: 'Visage', epaules: 'Épaules', dos: 'Dos', mains: 'Mains', pieds: 'Pieds',
  poignetGauche: 'Poignet G', poignetDroit: 'Poignet D',
  doigtGauche: 'Doigt G', doigtDroit: 'Doigt D', cou: 'Cou', taille: 'Taille',
};

const TYPE_LABELS = {
  arme: 'Arme', armure: 'Armure', sous_piece_armure: 'Sous-pièce', colifichet: 'Colifichet',
  focalisateur: 'Focalisateur', outil: 'Outil', consommable: 'Consommable', autre: 'Autre',
};

const TRAIT_TYPE_LABELS = {
  avantage_majeur:    'Avantage majeur',
  avantage_archetype: 'Archétype',
  avantage_mineur:    'Avantage mineur',
  desavantage:        'Désavantage',
};

function lookup(arr, id, field = 'nom') {
  return arr?.find(x => x.id === id)?.[field] || '';
}

function fmt(m) {
  return m >= 0 ? `+${m}` : `${m}`;
}

function mod(val) {
  const m = calculerModificateur(val);
  return fmt(m);
}

function row(label, value) {
  if (!value && value !== 0) return '';
  return `<tr><td class="stat-label">${label}</td><td class="stat-val">${value}</td></tr>`;
}

function section(title, content) {
  return `<div class="section"><div class="section-title">${title}</div>${content}</div>`;
}

function itemStats(obj, getMod) {
  const lines = [];
  const cat = obj.categorie ?? 0;
  const qual = obj.qualite ?? 0;

  if (obj.type === 'arme') {
    const forme   = FORMES_ARME.find(f => f.id === obj.forme);
    const typeArme = TYPES_ARME.find(t => t.id === obj.typeArme);
    if (forme && typeArme) {
      const baseMod  = getMod(forme.attr);
      const taille   = obj.taille   ?? 0;
      const gabarit  = obj.gabarit  ?? 0;
      const equilibre = obj.equilibre ?? 0;
      const nbDes    = 2 + cat;
      const isDistance = forme.attr === 'PER';

      lines.push(`${forme.label} (${forme.attr}) · ${typeArme.label} (${typeArme.attr})`);
      lines.push(
        `${nbDes}D8 · Attaque ${fmt(baseMod + taille - gabarit - equilibre)}` +
        ` · Défense ${fmt(baseMod - taille + gabarit - equilibre)}` +
        ` · Tactique ${fmt(baseMod - taille - gabarit + equilibre)}` +
        ` · Hâte ${fmt(equilibre)}`
      );
      if (isDistance) {
        const x = (cat + taille) * 4;
        lines.push(`Portée : 0(dsvgt) ~ ${x} ~ ${2*x}(dsvgt) ~ ${3*x}(2×dsvgt)`);
      } else {
        const pm = Math.floor((cat + getMod('TAI') + taille) / 4);
        const pj = Math.max(0, 5 - cat + taille);
        lines.push(`Portée mêlée : ${pm} · Portée jet : ${pj}`);
      }
    }
    const solidite = 10 + cat + qual + (obj.gabarit ?? 0);
    lines.push(`Solidité : ${solidite}` + (obj.matiere ? ` · ${obj.matiere}` : ''));
  } else if (obj.type === 'armure' || obj.type === 'sous_piece_armure') {
    lines.push(`Absorption : ${cat * 3} · Résistance : ${cat} · Protection : ${cat}`);
    const solidite = 10 + cat + qual + (obj.gabarit ?? 0);
    lines.push(`Solidité : ${solidite}` + (obj.matiere ? ` · ${obj.matiere}` : ''));
  } else if (obj.type === 'outil' && obj.attributOutil) {
    lines.push(`Attribut : ${obj.attributOutil}`);
  } else if (obj.type === 'consommable') {
    const enc = ((obj.encombrement ?? 0.125) * (obj.quantite ?? 1)).toFixed(2).replace(/\.?0+$/, '');
    lines.push(`Encombrement total : ${enc}`);
  }

  if (qual) lines.push(`Qualité ${qual > 0 ? '+' : ''}${qual}`);
  if (obj.slot) lines.push(`Équipé : ${SLOT_LABELS[obj.slot] || obj.slot}`);

  return lines;
}

export function printCharacter(character, calc) {
  const c = character;
  const infos = c.infos || {};
  const magieActive = c.options?.magieActive || false;

  // --- Caste complète ---
  const casteData = calc.caste || DATA.castes.find(x => x.id === c.caste?.id) || null;

  // --- Lookups identité ---
  const casteName   = casteData?.nom || lookup(DATA.castes, c.caste?.id);
  const ethnName    = lookup(DATA.ethnies,      infos.ethnicity);
  const originName  = lookup(DATA.origines,     infos.origin);
  const bgName      = lookup(DATA.vecus,        infos.background);
  const destName    = lookup(DATA.destinees,    infos.destiny);
  const envName     = lookup(DATA.milieux,      infos.environment);
  const allegName   = lookup(DATA.allegeances,  infos.allegiance);
  const personaName = lookup(DATA.personas,     infos.persona);
  const behavName   = lookup(DATA.temperaments, infos.behavior);
  const natureName  = lookup(DATA.temperaments, infos.nature);
  const tradName    = lookup(DATA.traditions,   c.tradition);

  // --- Attributs ---
  const attrVal = (id) => calc.getAttr(id);
  const attrBlock = (ids) => ids.map(id => {
    const def = ALL_ATTRS.find(a => a.id === id);
    if (!def) return '';
    const val = attrVal(id);
    return `<div class="attr-box">
      <div class="attr-id">${id}</div>
      <div class="attr-val">${val}</div>
      <div class="attr-mod">${mod(val)}</div>
    </div>`;
  }).join('');

  // --- Compétences ---
  const compEntries = c.competences?.competences || {};
  const compGroups  = c.competences?.groupes || {};
  const compSection = DATA.categoriesCompetences.map(cat => {
    const lines = [];
    cat.groupes.forEach(groupe => {
      const groupeRang = compGroups[groupe.id] || 0;
      const comps = groupe.competences || [];
      const compLines = comps.map(comp => {
        const key = comp.sousGroupe
          ? `${groupe.id}__${comp.sousGroupe}__${comp.id}`
          : `${groupe.id}__${comp.id}`;
        const rang = compEntries[key] || 0;
        if (!rang) return '';
        return `<span class="comp-entry">${comp.nom} <strong>${rang}</strong></span>`;
      }).filter(Boolean);
      if (groupeRang || compLines.length) {
        lines.push(`<div class="comp-groupe">
          <span class="comp-groupe-nom">${groupe.nom}${groupeRang ? ` <strong>${groupeRang}</strong>` : ''}</span>
          ${compLines.length ? `<span class="comp-list">${compLines.join(' · ')}</span>` : ''}
        </div>`);
      }
    });
    if (!lines.length) return '';
    return `<div class="comp-cat"><div class="comp-cat-title">${cat.nom}</div>${lines.join('')}</div>`;
  }).filter(Boolean).join('');

  // --- Mémoire avec détails (sorts exclus — page 2) ---
  const memoireEntries = c.memoire || [];
  const memoireSection = DATA.typesMémoire
    .filter(t => t.id !== 1) // sorts gérés sur page 2
    .map(type => {
      const entries = memoireEntries.filter(e => e.typeId === type.id);
      if (!entries.length) return '';
      const items = entries.map(entry => {
        // Résoudre depuis le compendium si sourceId
        const resolved = entry.sourceId && type.liste
          ? type.liste.find(e => e.id === entry.sourceId)
          : null;
        const nom = resolved ? (resolved.nom_fluff || resolved.nom || '') : (entry.nom || '');
        if (!nom) return '';
        const details = resolved ? [
          resolved.resume || '',
          resolved.type ? `${resolved.type}${resolved.penalite ? ` · ${resolved.penalite}` : ''}${resolved.categorie ? ` · ${resolved.categorie}` : ''}` : '',
          resolved.description || '',
          resolved.effets ? `Effets : ${resolved.effets}` : '',
          resolved.modularite ? `Modularité : ${resolved.modularite}` : '',
          resolved.conditions ? `Conditions : ${resolved.conditions}` : '',
        ].filter(Boolean) : [entry.description || ''].filter(Boolean);
        return `<div class="memo-entry">
          <span class="memo-nom">${nom}</span>
          ${details.length ? `<div class="memo-details">${details.map(d => `<div class="memo-detail-line">${d}</div>`).join('')}</div>` : ''}
        </div>`;
      }).filter(Boolean);
      if (!items.length) return '';
      return `<div class="memo-group-block"><div class="memo-type-title">${type.nom}</div>${items.join('')}</div>`;
    }).filter(Boolean).join('');

  // --- PAGE 2 : Traits avec descriptions ---
  const traitsPage2 = (c.traits || []).map(ct => {
    const info = DATA.traits.find(t => t.id === ct.id);
    if (!info) return '';
    const typeLabel = TRAIT_TYPE_LABELS[info.type] || info.type;
    const rangStr = ct.rang > 1 ? ` ×${ct.rang}` : '';
    return `<div class="p2-entry">
      <div class="p2-entry-header">
        <span class="p2-entry-nom">${info.nom}${rangStr}</span>
        <span class="p2-entry-meta">${typeLabel}${info.coutPP ? ` · ${info.coutPP} PP` : ''}</span>
      </div>
      ${info.description ? `<div class="p2-entry-desc">${info.description}</div>` : ''}
    </div>`;
  }).filter(Boolean).join('');

  // --- PAGE 2 : Inventaire avec stats ---
  const inventairePage2 = (c.inventaire || []).map(obj => {
    const stats = itemStats(obj, calc.getMod);
    const promos = (obj.promotions || []).filter(p => p.nom);
    return `<div class="p2-entry">
      <div class="p2-entry-header">
        <span class="p2-entry-nom">${obj.nom}</span>
        <span class="p2-entry-meta">${TYPE_LABELS[obj.type] || obj.type}${obj.qualite ? ` · Q${obj.qualite}` : ''}${obj.quantite > 1 ? ` · ×${obj.quantite}` : ''}</span>
      </div>
      ${stats.length ? `<div class="p2-entry-stats">${stats.join(' &nbsp;·&nbsp; ')}</div>` : ''}
      ${obj.description ? `<div class="p2-entry-desc">${obj.description}</div>` : ''}
      ${promos.length ? `<div class="p2-entry-promos">${promos.map(p =>
        `<span class="p2-promo"><strong>${p.nom}</strong>${p.rang > 1 ? ` ×${p.rang}` : ''}${p.description ? ` — ${p.description}` : ''}</span>`
      ).join('')}</div>` : ''}
    </div>`;
  }).filter(Boolean).join('');

  // --- PAGE 2 : Sorts avec descriptions ---
  const sortsPage2 = magieActive ? (c.sorts || []).map(s => {
    return `<div class="p2-entry">
      <div class="p2-entry-header">
        <span class="p2-entry-nom">${s.nom}</span>
        <span class="p2-entry-meta">Diff ${s.difficulte} · Drain ${s.drain}${s.ecole ? ` · ${s.ecole}` : ''}</span>
      </div>
      ${s.description ? `<div class="p2-entry-desc">${s.description}</div>` : ''}
      ${s.effets ? `<div class="p2-entry-effets"><span class="p2-effets-label">Effets</span><div>${s.effets}</div></div>` : ''}
    </div>`;
  }).filter(Boolean).join('') : '';

  const hasPage2 = casteData || traitsPage2 || inventairePage2 || sortsPage2 || c.notes;

  // --- HTML ---
  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>${infos.nom || 'Personnage'} — Terre Natale</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Georgia', serif; font-size: 9pt; color: #1a1a1a; background: white; padding: 12mm 14mm; }
  h1 { font-size: 18pt; font-weight: bold; letter-spacing: 0.04em; margin-bottom: 2px; }
  h2 { font-size: 13pt; font-weight: bold; letter-spacing: 0.02em; margin-bottom: 6px; border-bottom: 2px solid #333; padding-bottom: 3px; }
  .subtitle { font-size: 9pt; color: #555; margin-bottom: 10px; }
  .cols { display: flex; gap: 10px; }
  .col-2 { flex: 1; }
  .section { margin-bottom: 8px; break-inside: avoid; }
  .section-title { font-size: 7pt; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; color: #666; border-bottom: 1px solid #ccc; margin-bottom: 4px; padding-bottom: 1px; }
  .page-break { break-before: page; padding-top: 12mm; }

  /* Identité */
  .identity-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 3px 10px; }
  .id-field { font-size: 8.5pt; }
  .id-label { font-size: 6.5pt; color: #888; text-transform: uppercase; letter-spacing: 0.06em; }
  .id-val { font-weight: bold; }

  /* Attributs */
  .attrs-row { display: flex; gap: 4px; flex-wrap: wrap; }
  .attr-box { text-align: center; border: 1px solid #bbb; border-radius: 3px; padding: 2px 4px; min-width: 36px; }
  .attr-id  { font-size: 6pt; color: #666; text-transform: uppercase; }
  .attr-val { font-size: 11pt; font-weight: bold; line-height: 1.1; }
  .attr-mod { font-size: 7pt; color: #555; }

  /* Stats */
  .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 16px; }
  .stats-grid table { width: 100%; border-collapse: collapse; }
  .stat-label { font-size: 8pt; color: #444; padding: 1px 4px 1px 0; }
  .stat-val { font-size: 8pt; font-weight: bold; padding: 1px 0; text-align: right; }

  /* Ressources max */
  .res-row { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 2px; }
  .res-box { border: 1px solid #bbb; border-radius: 3px; padding: 2px 6px; font-size: 8pt; }
  .res-id { font-size: 6.5pt; color: #888; text-transform: uppercase; }
  .res-val { font-weight: bold; }

  /* Compétences */
  .comp-cat { margin-bottom: 4px; }
  .comp-cat-title { font-size: 6.5pt; font-weight: bold; text-transform: uppercase; color: #888; margin-bottom: 2px; }
  .comp-groupe { font-size: 8pt; margin-bottom: 1px; }
  .comp-groupe-nom { font-weight: bold; margin-right: 4px; }
  .comp-entry { font-size: 7.5pt; }

  /* Mémoire */
  .memo-group-block { margin-bottom: 6px; }
  .memo-type-title { font-size: 6.5pt; font-weight: bold; text-transform: uppercase; color: #888; margin-bottom: 2px; }
  .memo-entry { font-size: 8pt; margin-bottom: 3px; padding-left: 6px; border-left: 1px solid #ddd; }
  .memo-nom { font-weight: bold; }
  .memo-details { margin-top: 1px; }
  .memo-detail-line { font-size: 7.5pt; color: #444; line-height: 1.3; }

  /* Sauvegardes */
  .sauv-row { display: flex; gap: 5px; flex-wrap: wrap; }
  .sauv-box { text-align: center; border: 1px solid #bbb; border-radius: 3px; padding: 2px 6px; min-width: 52px; }
  .sauv-box.majeure { border-color: #555; background: #f0f0f0; }
  .sauv-box.mineure { border-color: #999; }
  .sauv-name { font-size: 6.5pt; color: #555; }
  .sauv-val  { font-size: 11pt; font-weight: bold; line-height: 1.1; }
  .sauv-attr { font-size: 6pt; color: #888; }

  /* Caste */
  .caste-grid { display: flex; flex-direction: column; gap: 2px; }
  .caste-row { font-size: 8pt; display: flex; gap: 6px; }
  .caste-label { font-size: 6.5pt; text-transform: uppercase; color: #888; font-weight: bold; min-width: 120px; padding-top: 1px; flex-shrink: 0; }
  .caste-val { flex: 1; }

  /* Page 2 — entrées avec descriptions */
  .p2-entry { margin-bottom: 8px; break-inside: avoid; border-left: 2px solid #ddd; padding-left: 8px; }
  .p2-entry-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 2px; }
  .p2-entry-nom { font-size: 9pt; font-weight: bold; }
  .p2-entry-meta { font-size: 7pt; color: #888; }
  .p2-entry-stats { font-size: 7.5pt; color: #555; margin-bottom: 2px; }
  .p2-entry-desc { font-size: 8pt; color: #333; white-space: pre-wrap; line-height: 1.4; }
  .p2-entry-effets { font-size: 8pt; margin-top: 2px; }
  .p2-effets-label { font-size: 6.5pt; text-transform: uppercase; color: #888; font-weight: bold; margin-right: 4px; }
  .p2-entry-promos { margin-top: 3px; }
  .p2-promo { display: block; font-size: 7.5pt; color: #555; margin-bottom: 1px; }

  /* Notes */
  .notes-text { font-size: 8pt; white-space: pre-wrap; color: #333; }

  @media print {
    body { padding: 10mm 12mm; }
    .section { break-inside: avoid; }
    .p2-entry { break-inside: avoid; }
    @page { margin: 10mm; size: A4; }
  }
</style>
</head>
<body>

<h1>${infos.nom || '—'}</h1>
<div class="subtitle">${[casteName, `Rang ${calc.rangCaste}`, ethnName, originName].filter(Boolean).join(' · ')}</div>

<div class="cols">
  <div class="col-2">

    ${section('Identité', `<div class="identity-grid">
      ${infos.background  ? `<div class="id-field"><div class="id-label">Vécu</div><div class="id-val">${bgName}</div></div>` : ''}
      ${infos.destiny     ? `<div class="id-field"><div class="id-label">Destinée</div><div class="id-val">${destName}</div></div>` : ''}
      ${infos.environment ? `<div class="id-field"><div class="id-label">Milieu</div><div class="id-val">${envName}</div></div>` : ''}
      ${infos.allegiance  ? `<div class="id-field"><div class="id-label">Allégeance</div><div class="id-val">${allegName}</div></div>` : ''}
      ${infos.persona     ? `<div class="id-field"><div class="id-label">Persona</div><div class="id-val">${personaName}</div></div>` : ''}
      ${infos.behavior    ? `<div class="id-field"><div class="id-label">Comportement</div><div class="id-val">${behavName}</div></div>` : ''}
      ${infos.nature      ? `<div class="id-field"><div class="id-label">Caractère</div><div class="id-val">${natureName}</div></div>` : ''}
      ${infos.nombreFetiche ? `<div class="id-field"><div class="id-label">Fétiche</div><div class="id-val">${infos.nombreFetiche}</div></div>` : ''}
    </div>`)}

    ${section('Corps', `<div class="attrs-row">${attrBlock(ATTRS_CORPS)}</div>`)}
    ${section('Esprit', `<div class="attrs-row">${attrBlock(ATTRS_ESPRIT)}</div>`)}
    ${section('Spéciaux', `<div class="attrs-row">${attrBlock(ATTRS_SPEC.filter(id => ALL_ATTRS.find(a => a.id === id)))}</div>`)}

    ${section('Ressources (max)', `<div class="res-row">
      ${Object.entries(calc.ressourcesMax).filter(([,v]) => v > 0).map(([id, v]) =>
        `<div class="res-box"><div class="res-id">${id}</div><div class="res-val">${v}</div></div>`
      ).join('')}
    </div>`)}

  </div>
  <div class="col-2">

    ${section('Caractéristiques', `<div class="stats-grid">
      <table>
        ${row('Résilience', calc.resilience)}
        ${row('Rés. Physique', calc.resilPhys)}
        ${row('Rés. Mentale', calc.resilMent)}
        ${row('Rés. Magique', calc.resilMag)}
        ${row('Récupération', calc.recuperation)}
        ${row('Protection Phys.', calc.protPhys)}
        ${row('Protection Ment.', calc.protMent)}
        ${row('Absorption Phys.', calc.absPhys)}
        ${row('Absorption Ment.', calc.absMent)}
      </table>
      <table>
        ${row('Mémoire', calc.memoire)}
        ${row('Panache', calc.panache)}
        ${row('Prestance', calc.prestance)}
        ${row('Charge max', calc.chargeMax)}
        ${row('Allure', calc.allure)}
        ${row('Déplacement', calc.deplacement)}
      </table>
    </div>`)}

    ${section('XP / PP', `<div class="stats-grid">
      <table>
        ${row('XP total', calc.xpTotal)}
        ${row('XP utilisés', calc.xpUtilises)}
        ${row('XP restants', calc.xpRestants)}
      </table>
      <table>
        ${row('PP total', calc.ppTotal)}
        ${row('PP utilisés', calc.ppUtilises)}
        ${row('PP restants', calc.ppRestants)}
      </table>
    </div>`)}

    ${section('Sauvegardes', `<div class="sauv-row">
      ${DATA.sauvegardes.map(sauv => {
        const attrId = Array.isArray(sauv.attribut) ? sauv.attribut[0] : sauv.attribut;
        const attrDisplay = Array.isArray(sauv.attribut) ? sauv.attribut.join('/') : sauv.attribut;
        const m = calc.getMod(attrId);
        const mStr = fmt(m);
        const estMajeure = casteData?.sauvegardesMajeures?.includes(sauv.nom);
        const estMineure = casteData?.sauvegardesMineures?.includes(sauv.nom);
        const cls = estMajeure ? 'sauv-box majeure' : estMineure ? 'sauv-box mineure' : 'sauv-box';
        return `<div class="${cls}"><div class="sauv-name">${sauv.nom}</div><div class="sauv-val">${mStr}</div><div class="sauv-attr">${attrDisplay}</div></div>`;
      }).join('')}
    </div>`)}

    ${magieActive && tradName ? section('Magie', `<div class="identity-grid">
      <div class="id-field"><div class="id-label">Tradition</div><div class="id-val">${tradName}</div></div>
      <div class="id-field"><div class="id-label">Expertise</div><div class="id-val">${calc.expertiseMagique}</div></div>
      <div class="id-field"><div class="id-label">Portée</div><div class="id-val">${calc.porteeMagique}</div></div>
    </div>`) : ''}

  </div>
</div>

${compSection ? section('Compétences', compSection) : ''}
${memoireSection ? section('Mémoire', memoireSection) : ''}

${hasPage2 ? `<div class="page-break">
<h2>${infos.nom || '—'} — Descriptions</h2>

${casteData ? section('Caste', `
  <div class="caste-grid">
    ${casteData.sauvegardesMajeures?.length ? `<div class="caste-row"><span class="caste-label">Sauvegardes majeures</span><span class="caste-val">${casteData.sauvegardesMajeures.join(', ')}</span></div>` : ''}
    ${casteData.sauvegardesMineures?.length ? `<div class="caste-row"><span class="caste-label">Sauvegardes mineures</span><span class="caste-val">${casteData.sauvegardesMineures.join(', ')}</span></div>` : ''}
    ${casteData.entrainements ? `<div class="caste-row"><span class="caste-label">Entraînements</span><span class="caste-val">${casteData.entrainements}</span></div>` : ''}
    ${casteData.privilege ? `<div class="caste-row"><span class="caste-label">Privilège</span><span class="caste-val">${casteData.privilege}</span></div>` : ''}
    ${casteData.trait1 ? `<div class="caste-row"><span class="caste-label">Trait 1</span><span class="caste-val">${casteData.trait1}</span></div>` : ''}
    ${casteData.trait2 ? `<div class="caste-row"><span class="caste-label">Trait 2</span><span class="caste-val">${casteData.trait2}</span></div>` : ''}
    ${casteData.actionSpeciale ? `<div class="caste-row"><span class="caste-label">Action spéciale</span><span class="caste-val">${casteData.actionSpeciale}</span></div>` : ''}
    ${casteData.amelioration ? `<div class="caste-row"><span class="caste-label">Amélioration</span><span class="caste-val">${casteData.amelioration}</span></div>` : ''}
  </div>
`) : ''}
${traitsPage2    ? section('Traits',     traitsPage2)    : ''}
${inventairePage2 ? section('Inventaire', inventairePage2) : ''}
${sortsPage2     ? section('Sorts',      sortsPage2)     : ''}
${c.notes        ? section('Notes',      `<div class="notes-text">${c.notes}</div>`) : ''}
</div>` : ''}

</body>
</html>`;

  const win = window.open('', '_blank', 'width=900,height=700');
  win.document.write(html);
  win.document.close();
  setTimeout(() => win.print(), 400);
}
