import { useState } from 'react';
import { useCharacter } from '../../context/CharacterContext';
import { useCharacterCalculations } from '../../hooks/useCharacterCalculations';
import DATA from '../../data';
import AttributeBlock from '../common/AttributeBlock';
import Section from '../common/Section';

// Attributs disponibles pour les origines
const ORIGINES_ATTRS = [
  { id: 'FOR', nom: 'Force', groupe: 'corps' },
  { id: 'DEX', nom: 'Dextérité', groupe: 'corps' },
  { id: 'AGI', nom: 'Agilité', groupe: 'corps' },
  { id: 'CON', nom: 'Constitution', groupe: 'corps' },
  { id: 'PER', nom: 'Perception', groupe: 'corps' },
  { id: 'CHA', nom: 'Charisme', groupe: 'esprit' },
  { id: 'INT', nom: 'Intelligence', groupe: 'esprit' },
  { id: 'RUS', nom: 'Ruse', groupe: 'esprit' },
  { id: 'VOL', nom: 'Volonté', groupe: 'esprit' },
  { id: 'SAG', nom: 'Sagesse', groupe: 'esprit' },
  { id: 'MAG', nom: 'Magie', groupe: 'special' },
  { id: 'LOG', nom: 'Logique', groupe: 'special' },
  { id: 'CHN', nom: 'Chance', groupe: 'special' },
  { id: 'EQU', nom: 'Équilibre', groupe: 'special' }
];

function TabPrincipal() {
  const { character, updateCharacter } = useCharacter();
  const calc = useCharacterCalculations(character);
  const [showOriginesModal, setShowOriginesModal] = useState(false);

  const handleInfoChange = (field, value) => {
    updateCharacter(prev => ({
      ...prev,
      infos: { ...prev.infos, [field]: value }
    }));
  };

  const handleEthnieChange = (nom) => {
    const ethnie = DATA.ethnies.find(e => e.nom === nom);
    updateCharacter(prev => ({
      ...prev,
      infos: { ...prev.infos, ethnie: nom, origine: ethnie?.origine || '' }
    }));
  };

  // Ethnies regroupées par race pour le select
  const ethniesParRace = DATA.ethnies.reduce((acc, e) => {
    if (!acc[e.origine]) acc[e.origine] = [];
    acc[e.origine].push(e);
    return acc;
  }, {});

  const formatMod = (val) => val >= 0 ? `+${val}` : `${val}`;

  return (
    <div id="tab-principal" className="tab-content active">
      {/* Informations */}
      <Section title="Informations">
        <div className="info-section-header">
          <button className="btn-origines" onClick={() => setShowOriginesModal(true)}>
            Origines
          </button>
        </div>
        <div className="info-grid">
          {/* Ligne 1 : Nom | Race (auto) | Destinée | Vécu */}
          <div className="info-field">
            <label>Nom</label>
            <input
              type="text"
              value={character.infos?.nom || ''}
              onChange={(e) => handleInfoChange('nom', e.target.value)}
            />
          </div>
          <div className="info-field">
            <label>Race</label>
            <div className="info-field-readonly">
              {character.infos?.origine || '—'}
            </div>
          </div>
          <div className="info-field">
            <label>Destinée</label>
            <select
              value={character.infos?.destinee || ''}
              onChange={(e) => handleInfoChange('destinee', e.target.value)}
            >
              <option value="">-- Choisir --</option>
              {DATA.destinees.map(d => (
                <option key={d.nom} value={d.nom}>{d.nom}</option>
              ))}
            </select>
          </div>
          <div className="info-field">
            <label>Vécu</label>
            <select
              value={character.infos?.vecu || ''}
              onChange={(e) => handleInfoChange('vecu', e.target.value)}
            >
              <option value="">-- Choisir --</option>
              {DATA.vecus.map(v => (
                <option key={v.nom} value={v.nom}>{v.nom}</option>
              ))}
            </select>
          </div>

          {/* Ligne 2 : Ethnie | Milieu de vie | Allégeance | Persona */}
          <div className="info-field">
            <label>Ethnie</label>
            <select
              value={character.infos?.ethnie || ''}
              onChange={(e) => handleEthnieChange(e.target.value)}
            >
              <option value="">-- Choisir --</option>
              {Object.entries(ethniesParRace).map(([race, liste]) => (
                <optgroup key={race} label={race}>
                  {liste.map(e => (
                    <option key={e.nom} value={e.nom}>{e.nom}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
          <div className="info-field">
            <label>Milieu de vie</label>
            <select
              value={character.infos?.milieu || ''}
              onChange={(e) => handleInfoChange('milieu', e.target.value)}
            >
              <option value="">-- Choisir --</option>
              {DATA.milieux.map(m => (
                <option key={m.nom} value={m.nom}>{m.nom}</option>
              ))}
            </select>
          </div>
          <div className="info-field">
            <label>Allégeance</label>
            <select
              value={character.infos?.allegeance || ''}
              onChange={(e) => handleInfoChange('allegeance', e.target.value)}
            >
              <option value="">-- Choisir --</option>
              {DATA.allegeances.map(a => (
                <option key={a.nom} value={a.nom}>{a.nom}</option>
              ))}
            </select>
          </div>
          <div className="info-field">
            <label>Persona</label>
            <select
              value={character.infos?.persona || ''}
              onChange={(e) => handleInfoChange('persona', e.target.value)}
            >
              <option value="">-- Choisir --</option>
              {DATA.personas.map(p => (
                <option key={p.nom} value={p.nom}>{p.nom}</option>
              ))}
            </select>
          </div>

          {/* Ligne 3 : Comportement | Caractère | Nombre Fétiche */}
          <div className="info-field">
            <label>Comportement</label>
            <select
              value={character.infos?.comportement || ''}
              onChange={(e) => handleInfoChange('comportement', e.target.value)}
            >
              <option value="">-- Choisir --</option>
              {DATA.temperaments.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="info-field">
            <label>Caractère</label>
            <select
              value={character.infos?.caractere || ''}
              onChange={(e) => handleInfoChange('caractere', e.target.value)}
            >
              <option value="">-- Choisir --</option>
              {DATA.temperaments.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="info-field">
            <label>Nombre Fétiche</label>
            <select
              value={character.infos?.nombreFetiche || ''}
              onChange={(e) => handleInfoChange('nombreFetiche', e.target.value)}
            >
              <option value="">-- Choisir --</option>
              {[1, 2, 3, 4, 5, 6].map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        </div>
      </Section>

      {/* Attributs */}
      <Section title="Attributs">
        <h3 className="attr-section-title">Corps</h3>
        <div className="attr-grid">
          {DATA.attributsCorps.map(attr => (
            <AttributeBlock key={attr.id} attr={attr} />
          ))}
        </div>

        <h3 className="attr-section-title">Esprit</h3>
        <div className="attr-grid">
          {DATA.attributsEsprit.map(attr => (
            <AttributeBlock key={attr.id} attr={attr} />
          ))}
        </div>

        <h3 className="attr-section-title">Spéciaux</h3>
        <div className="attr-grid">
          {DATA.attributsMagiques.map(attr => (
            <AttributeBlock key={attr.id} attr={attr} />
          ))}
        </div>

        <h3 className="attr-section-title">Destin</h3>
        <div className="attr-grid">
          {DATA.attributsDestin.map(attr => (
            <AttributeBlock key={attr.id} attr={attr} />
          ))}
        </div>

        <h3 className="attr-section-title">Naissance</h3>
        <div className="attr-compact-grid">
          {DATA.attributsSecondaires.map(attr => (
            <AttributeBlock key={attr.id} attr={attr} compact />
          ))}
        </div>
      </Section>

      {/* Caste */}
      <Section title="Caste">
        <CasteSection
          character={character}
          updateCharacter={updateCharacter}
          calc={calc}
        />
      </Section>

      {/* Ressources */}
      <Section title="Ressources">
        <div className="ressources-grid">
          {DATA.ressources.map(res => {
            const max = calc.ressourcesMax[res.id] || 0;
            const recup = calc.recuperationRessource[res.id] || 0;
            const isCasteRessource = calc.caste?.ressources?.includes(res.id);
            return (
              <div key={res.id} className={`ressource-box ${isCasteRessource ? 'ressource-caste' : ''}`}>
                <div className="ressource-name">{res.icone || ''} {res.nom}</div>
                <div className="ressource-value">{max}</div>
                <div className="ressource-recup">Récupération {recup >= 0 ? '+' : ''}{recup}</div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Sauvegardes */}
      <Section title="Sauvegardes">
        <div className="sauvegardes-grid">
          {DATA.sauvegardes.map(sauv => {
            const attrId = Array.isArray(sauv.attribut) ? sauv.attribut[0] : sauv.attribut;
            const attrDisplay = Array.isArray(sauv.attribut) ? sauv.attribut.join('/') : sauv.attribut;
            const mod = calc.getMod(attrId);
            const estMajeure = calc.caste?.sauvegardesMajeures?.includes(sauv.nom);
            const estMineure = calc.caste?.sauvegardesMineures?.includes(sauv.nom);
            let typeClass = '';
            if (estMajeure) typeClass = 'majeure';
            else if (estMineure) typeClass = 'mineure';
            return (
              <div key={sauv.id} className={`sauvegarde-box ${typeClass}`}>
                <span className="sauv-name">{sauv.nom}</span>
                <span className="sauv-value">{formatMod(mod)}</span>
                <span className="sauv-attrs">({attrDisplay})</span>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Caractéristiques */}
      <Section title="Caractéristiques">
        <div className="caracteristiques-grid">
          <CaracBox name="Allure" value={calc.allure} help="10 + mTAI + mAGI" />
          <CaracBox name="Déplacement" value={`${calc.deplacement} m/c`} help="Allure / 2" />
          <CaracBox name="Saut Hauteur" value={`${calc.sautHauteur} m/c`} help="Allure / 8" />
          <CaracBox name="Saut Largeur" value={`${calc.sautLargeur} m/c`} help="Allure / 4" />
          <CaracBox
            name="Résilience"
            value={calc.resilience}
            help="10 + mVOL + mEQU"
            details={`Physique: ${calc.resilPhys} | Mentale: ${calc.resilMent} | Magique: ${calc.resilMag} | Nerf: ${calc.resilNerf} | Fatigue: ${calc.resilFat} | Corruption: ${calc.resilCorr}`}
          />
          <CaracBox name="Récupération" value={calc.recuperation} help="5 + mSAG" />
          <CaracBox name="Mémoire" value={calc.memoire} help="INT - 5" />
          <CaracBox name="Charge Max" value={calc.chargeMax} help="5 + FOR + STA" />
          <CaracBox name="Encombrement Max" value={calc.encombrementMax} help="5 + FOR + STA" />
          <CaracBox name="Poigne" value={calc.poigne} help="FOR" />
          <CaracBox name="Panache" value={calc.panache} help="CHA" />
          <CaracBox name="Prestance" value={calc.prestance} help="5 + CHA + EGO" />
          <CaracBox name="Protection Physique" value={calc.protPhys} help="5 + mSTA" />
          <CaracBox name="Protection Mentale" value={calc.protMent} help="5 + mEGO" />
          <CaracBox name="Absorption Physique" value={calc.absPhys} help="mCON" />
          <CaracBox name="Absorption Mentale" value={calc.absMent} help="mVOL" />
          <CaracBox name="Prouesses Innées" value={formatMod(calc.prouesses)} help="mRUS" />
          <CaracBox name="Moral" value={formatMod(calc.moral)} help="mCHA" />
          <CaracBox name="Perforation Physique" value={formatMod(calc.perfPhys)} help="mPER" />
          <CaracBox name="Perforation Mentale" value={formatMod(calc.perfMent)} help="mSAG" />
          <CaracBox name="Contrôle Actif" value={formatMod(calc.ctrlActif)} help="mDEX" />
          <CaracBox name="Contrôle Passif" value={formatMod(calc.ctrlPassif)} help="mAGI" />
          <CaracBox name="Technique Max" value={calc.techMax} help="mINT" />
          <CaracBox name="Expertise Physique" value={formatMod(calc.expPhys)} help="mDEX" />
          <CaracBox name="Expertise Mentale" value={formatMod(calc.expMent)} help="mINT" />
          <CaracBox name="Précision Physique" value={formatMod(calc.precPhys)} help="mDEX" />
          <CaracBox name="Précision Mentale" value={formatMod(calc.precMent)} help="mINT" />
        </div>
      </Section>

      {/* Points d'Expérience */}
      <Section title="Points d'Expérience">
        <XPSummary character={character} updateCharacter={updateCharacter} calc={calc} />
      </Section>

      {/* Points de Personnage */}
      <Section title="Points de Personnage">
        <PPSummary character={character} calc={calc} />
      </Section>

      {/* Entraînements */}
      <Section title="Entraînements">
        <EntrainementsSection character={character} updateCharacter={updateCharacter} />
      </Section>

      {/* Modal Origines */}
      {showOriginesModal && (
        <OriginesModal
          character={character}
          updateCharacter={updateCharacter}
          onClose={() => setShowOriginesModal(false)}
        />
      )}
    </div>
  );
}

function CaracBox({ name, value, help, details }) {
  return (
    <div className="carac-box">
      <span className="carac-name">{name}</span>
      <span className="carac-value">{value}</span>
      <span className="carac-help" title={help}>ⓘ</span>
      {details && <span className="carac-help carac-help-details" title={details}>!</span>}
    </div>
  );
}

function CasteSection({ character, updateCharacter, calc }) {
  const casteActuelle = calc.caste;
  const estLimiteParAptitude = calc.rangAptitude < calc.rangXP;
  const estLimiteParXP = calc.rangXP < calc.rangAptitude;

  // Calcul progression aptitude
  let aptitudePct = 100;
  if (calc.nextProgression) {
    const aptPourCeRang = calc.progressionInfo?.reqAptitude || 0;
    const aptPourProchain = calc.nextProgression.reqAptitude;
    const aptDansRang = calc.aptitude - aptPourCeRang;
    const aptNecessaire = aptPourProchain - aptPourCeRang;
    aptitudePct = aptNecessaire > 0 ? Math.min(100, Math.floor((aptDansRang / aptNecessaire) * 100)) : 100;
  }

  // Calcul progression XP
  let xpPct = 100;
  if (calc.nextProgression) {
    const xpPourCeRang = calc.progressionInfo?.reqXp || 0;
    const xpPourProchain = calc.nextProgression.reqXp;
    const xpDansRang = calc.xpTotal - xpPourCeRang;
    const xpNecessaire = xpPourProchain - xpPourCeRang;
    xpPct = xpNecessaire > 0 ? Math.min(100, Math.floor((xpDansRang / xpNecessaire) * 100)) : 100;
  }

  const titreRang = calc.progressionInfo?.titre || 'Novice';

  const handleCasteChange = (e) => {
    const newCasteName = e.target.value;
    const newCaste = DATA.castes.find(c => c.nom === newCasteName);
    updateCharacter(prev => ({
      ...prev,
      caste: {
        ...prev.caste,
        nom: newCasteName,
        attribut1: newCaste?.attribut1?.[0] || '',
        attribut2: newCaste?.attribut2?.[0] || ''
      }
    }));
  };

  const handleAttrChange = (attrNum, value) => {
    updateCharacter(prev => ({
      ...prev,
      caste: {
        ...prev.caste,
        [`attribut${attrNum}`]: value
      }
    }));
  };

  return (
    <div className="caste-grid">
      <div className="caste-row-top">
        <div className="caste-field caste-field-caste">
          <label>Caste</label>
          <select value={character.caste?.nom || ''} onChange={handleCasteChange}>
            <option value="">-- Sélectionner --</option>
            {DATA.castes.map(c => (
              <option key={c.nom} value={c.nom}>{c.nom} ({c.type})</option>
            ))}
          </select>
        </div>
        <div className="caste-field caste-field-rang">
          <label>
            Rang
            {estLimiteParAptitude && <span className="rang-limite"> (limité par aptitude)</span>}
            {estLimiteParXP && <span className="rang-limite"> (limité par XP)</span>}
          </label>
          <div className="caste-rang-display">
            <span className="caste-rang-value">{calc.rangCaste}</span>
            <span className="caste-rang-titre">{titreRang}</span>
          </div>
        </div>
        {casteActuelle && (
          <>
            <div className="caste-field caste-field-attr">
              <label>Attribut 1</label>
              <select
                value={character.caste?.attribut1 || ''}
                onChange={(e) => handleAttrChange(1, e.target.value)}
              >
                {casteActuelle.attribut1?.map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
            <div className="caste-field caste-field-attr">
              <label>Attribut 2</label>
              <select
                value={character.caste?.attribut2 || ''}
                onChange={(e) => handleAttrChange(2, e.target.value)}
              >
                {casteActuelle.attribut2?.map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
          </>
        )}
      </div>
      <div className="caste-row-progression">
        <div className={`caste-progression-block ${estLimiteParAptitude ? 'progression-limite' : ''}`}>
          <div className="caste-progression-header">
            <span className="caste-progression-label">Aptitude</span>
            <span className="caste-progression-rang">Rang {calc.rangAptitude}</span>
            <span className="caste-progression-value">
              {calc.aptitude}{calc.nextProgression ? ` / ${calc.nextProgression.reqAptitude}` : ''}
            </span>
          </div>
          <div className="caste-progression-bar">
            <div
              className={`caste-progression-fill ${estLimiteParAptitude ? 'fill-limite' : ''}`}
              style={{ width: `${aptitudePct}%` }}
            />
          </div>
        </div>
        <div className={`caste-progression-block ${estLimiteParXP ? 'progression-limite' : ''}`}>
          <div className="caste-progression-header">
            <span className="caste-progression-label">Expérience</span>
            <span className="caste-progression-rang">Rang {calc.rangXP}</span>
            <span className="caste-progression-value">
              {calc.xpTotal}{calc.nextProgression ? ` / ${calc.nextProgression.reqXp}` : ''}
            </span>
          </div>
          <div className="caste-progression-bar">
            <div
              className={`caste-progression-fill ${estLimiteParXP ? 'fill-limite' : ''}`}
              style={{ width: `${xpPct}%` }}
            />
          </div>
        </div>
      </div>
      {casteActuelle && (
        <div className="caste-info">
          <div className="caste-info-row">
            <span><strong>Domaine :</strong> {casteActuelle.domaine || '—'}</span>
            <span><strong>Style :</strong> {casteActuelle.style || '—'}</span>
          </div>
          <div className="caste-info-row">
            <span><strong>Ressources :</strong> {casteActuelle.ressources?.join(', ') || '—'}</span>
            <span><strong>Sauv. majeures :</strong> {casteActuelle.sauvegardesMajeures?.join(', ') || '—'}</span>
            <span><strong>Sauv. mineures :</strong> {casteActuelle.sauvegardesMineures?.join(', ') || '—'}</span>
          </div>
          {casteActuelle.privilege && (
            <div className="caste-info-privilege">
              <strong>Privilège</strong> <span className="caste-info-pc-hint">(Jusqu'à {calc.rangCaste} PC pour {calc.rangCaste} d'ajustement dans les situations concernées)</span> <strong>:</strong> {casteActuelle.privilege}
            </div>
          )}
          {calc.rangCaste >= 3 && casteActuelle.trait1 && (
            <div className="caste-info-unlock">
              <strong>1er Trait de Caste :</strong> {casteActuelle.trait1}
            </div>
          )}
          {calc.rangCaste >= 4 && casteActuelle.actionSpeciale && (
            <div className="caste-info-unlock">
              <strong>Action de Caste :</strong> {casteActuelle.actionSpeciale}
            </div>
          )}
          {calc.rangCaste >= 6 && casteActuelle.trait2 && (
            <div className="caste-info-unlock">
              <strong>2nd Trait de Caste :</strong> {casteActuelle.trait2}
            </div>
          )}
          {calc.rangCaste >= 8 && casteActuelle.amelioration && (
            <div className="caste-info-unlock">
              <strong>Action de Caste Améliorée :</strong> {casteActuelle.amelioration}
            </div>
          )}
          {casteActuelle.entrainements && (
            <div className="caste-info-entrainements">
              <strong>Entraînements :</strong> {casteActuelle.entrainements}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function XPSummary({ character, updateCharacter, calc }) {
  const vecuNom = character.infos?.vecu || 'Aucun';

  const handleXpAcquisChange = (e) => {
    updateCharacter(prev => ({
      ...prev,
      xpAcquis: parseInt(e.target.value) || 0
    }));
  };

  return (
    <div className="xp-summary-box">
      <div className="xp-summary-title">Points d'Expérience</div>
      <div className="xp-summary-content">
        <div className="xp-summary-row">
          <span className="xp-label">Départ ({vecuNom})</span>
          <span className="xp-value">{calc.xpDepart}</span>
        </div>
        <div className="xp-summary-row">
          <span className="xp-label">Acquis</span>
          <input
            type="number"
            className="xp-input"
            value={character.xpAcquis || 0}
            onChange={handleXpAcquisChange}
            min="0"
          />
        </div>
        <div className="xp-summary-row xp-total-row">
          <span className="xp-label">Total</span>
          <span className="xp-value">{calc.xpTotal}</span>
        </div>
        <div className={`xp-summary-row xp-rest-row ${calc.xpRestants < 0 ? 'over-budget' : ''}`}>
          <span className="xp-label">Restant</span>
          <span className="xp-value xp-restant">{calc.xpRestants} / {calc.xpTotal}</span>
        </div>
      </div>
    </div>
  );
}

function PPSummary({ character, calc }) {
  const destineeNom = character.infos?.destinee || 'Commun des Mortels';

  return (
    <div className="xp-summary-box pp-summary-box">
      <div className="xp-summary-title">Points de Personnage</div>
      <div className="xp-summary-content">
        <div className="xp-summary-row">
          <span className="xp-label">Départ</span>
          <span className="xp-value">{calc.ppDepart}</span>
        </div>
        <div className="xp-summary-row">
          <span className="xp-label">Désavantages</span>
          <span className="xp-value">{calc.ppDesavantages}</span>
        </div>
        <div className="xp-summary-row">
          <span className="xp-label">Caste</span>
          <span className="xp-value">{calc.ppCaste}</span>
        </div>
        <div className="xp-summary-row xp-total-row">
          <span className="xp-label">Total</span>
          <span className="xp-value">{calc.ppTotal}</span>
        </div>
        <div className={`xp-summary-row xp-rest-row ${calc.ppRestants < 0 ? 'over-budget' : ''}`}>
          <span className="xp-label">Restant</span>
          <span className="xp-value xp-restant">{calc.ppRestants} / {calc.ppTotal}</span>
        </div>
      </div>
    </div>
  );
}

const ENTRAINEMENTS = [
  { id: 'armesMelee', label: 'Armes de Mêlée' },
  { id: 'armesDistance', label: 'Armes à Distance' },
  { id: 'armesJet', label: 'Armes de Jet' },
  { id: 'armures', label: 'Armures' },
  { id: 'outils', label: 'Outils' },
  { id: 'magie', label: 'Magie' },
  { id: 'science', label: 'Science' },
  { id: 'social', label: 'Social' }
];

const NIVEAUX_ENTRAINEMENT = [
  { value: 0, label: 'Non entraîné' },
  { value: 1, label: 'Expert' },
  { value: 2, label: 'Maître' },
  { value: 3, label: 'Légende', special: true }
];

function EntrainementsSection({ character, updateCharacter }) {
  const entrainements = character.entrainements || {};

  const handleChange = (id, value) => {
    updateCharacter(prev => ({
      ...prev,
      entrainements: { ...prev.entrainements, [id]: value }
    }));
  };

  return (
    <div className="entrainements-grid">
      {ENTRAINEMENTS.map(e => {
        const niveau = entrainements[e.id] ?? 0;
        return (
          <div key={e.id} className="entrainement-box">
            <span className="entrainement-label">{e.label}</span>
            <div className="entrainement-levels">
              {NIVEAUX_ENTRAINEMENT.map(n => (
                <button
                  key={n.value}
                  className={`entrainement-btn ${niveau === n.value ? 'active' : ''} niveau-${n.value}${n.special ? ' special' : ''}`}
                  onClick={() => handleChange(e.id, n.value)}
                  title={n.special
                    ? `${n.label} — Uniquement accessible dans des conditions spéciales ou avec l'accord explicite du Meneur de Jeu`
                    : n.label}
                >
                  {n.value}
                </button>
              ))}
            </div>
            <span className="entrainement-niveau-label">
              {NIVEAUX_ENTRAINEMENT.find(n => n.value === niveau)?.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// === Modal Origines ===
function OriginesModal({ character, updateCharacter, onClose }) {
  // État local pour les choix temporaires
  const [choices, setChoices] = useState(() => character.originesChoix || {});
  const [naissanceChoix, setNaissanceChoix] = useState(() => {
    const nb = character.naissanceBonus || {};
    const eth = DATA.ethnies.find(e => e.nom === character.infos?.ethnie);
    const result = {};
    Object.entries(eth?.attributs_naissance || {}).forEach(([id, def]) => {
      result[id] = DATA.valeurDefautSecondaire + (nb[id] || 0);
    });
    return result;
  });

  // Récupère les données actuelles
  const ethnie = DATA.ethnies.find(e => e.nom === character.infos?.ethnie);
  const allegeance = DATA.allegeances.find(a => a.nom === character.infos?.allegeance);
  const milieu = DATA.milieux.find(m => m.nom === character.infos?.milieu);
  const persona = DATA.personas.find(p => p.nom === character.infos?.persona);

  const handleNaissanceChange = (attrId, val) => {
    setNaissanceChoix(prev => ({ ...prev, [attrId]: val }));
  };

  // Gestion des choix
  const handleChoiceChange = (source, slot, value) => {
    setChoices(prev => {
      const key = `${source}_${slot}`;
      if (value) {
        return { ...prev, [key]: value };
      } else {
        const newChoices = { ...prev };
        delete newChoices[key];
        return newChoices;
      }
    });
  };

  // Vérifie si un attribut est déjà utilisé dans une source
  const isUsedInSource = (source, attrId, excludeSlot) => {
    return Object.entries(choices).some(([key, val]) => {
      const [src, slot] = key.split('_');
      return src === source && slot !== excludeSlot && val === attrId;
    });
  };

  // Vérifie si un deboost est pris pour activer un boost conditionnel
  const hasDeboost = (source, deboostSlot) => {
    const key = `${source}_${deboostSlot}`;
    return !!choices[key];
  };

  // Calcul des bonus d'origines
  const computeAdjustments = () => {
    const counts = {};
    const raceBoostCounts = {};

    ORIGINES_ATTRS.forEach(attr => {
      counts[attr.id] = { boost: 0, deboost: 0 };
      raceBoostCounts[attr.id] = 0;
    });

    Object.entries(choices).forEach(([key, attrId]) => {
      const [source, slot] = key.split('_');
      const type = slot.startsWith('boost') ? 'boost' : 'deboost';

      if (counts[attrId]) {
        if (type === 'boost') {
          counts[attrId].boost += 1;
          if (source === 'race') {
            raceBoostCounts[attrId] += 1;
          }
        } else {
          counts[attrId].deboost += 1;
        }
      }
    });

    const adjustments = {};
    ORIGINES_ATTRS.forEach(attr => {
      const { boost, deboost } = counts[attr.id];
      const boostCap = raceBoostCounts[attr.id] >= 2 ? 6 : 4;

      let boostValue = 0;
      if (boost >= 1) {
        boostValue = 2 + Math.max(0, boost - 1);
      }
      boostValue = Math.min(boostValue, boostCap);

      let deboostValue = 0;
      if (deboost >= 1) {
        deboostValue = -2 - Math.max(0, deboost - 1);
      }
      deboostValue = Math.max(deboostValue, -4);

      adjustments[attr.id] = boostValue + deboostValue;
    });

    return adjustments;
  };

  // Applique les origines
  const handleApply = () => {
    const adjustments = computeAdjustments();
    const newNaissanceBonus = { ...(character.naissanceBonus || {}) };
    Object.entries(ethnie?.attributs_naissance || {}).forEach(([id]) => {
      const val = naissanceChoix[id] ?? DATA.valeurDefautSecondaire;
      newNaissanceBonus[id] = val - DATA.valeurDefautSecondaire;
    });
    updateCharacter(prev => ({
      ...prev,
      originesChoix: choices,
      originesBonus: adjustments,
      naissanceBonus: newNaissanceBonus,
    }));
    onClose();
  };

  // Réinitialise
  const handleReset = () => {
    setChoices({});
    const resetNaissance = {};
    Object.entries(ethnie?.attributs_naissance || {}).forEach(([id, def]) => {
      resetNaissance[id] = def.val ?? def.min;
    });
    setNaissanceChoix(resetNaissance);
  };

  // Ferme en cliquant sur le backdrop
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Composant Select pour un choix d'origine
  const OriginSelect = ({ source, slot, type, availableAttrs, disabled = false }) => {
    const key = `${source}_${slot}`;
    const value = choices[key] || '';

    return (
      <select
        className="origin-select"
        value={value}
        onChange={(e) => handleChoiceChange(source, slot, e.target.value)}
        disabled={disabled}
      >
        <option value="">—</option>
        {availableAttrs.map(attrId => {
          const attr = ORIGINES_ATTRS.find(a => a.id === attrId);
          if (!attr) return null;
          const isUsed = isUsedInSource(source, attrId, slot);
          return (
            <option key={attrId} value={attrId} disabled={isUsed}>
              {attr.nom}
            </option>
          );
        })}
      </select>
    );
  };

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className="modal-content origines-modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Ajustements d'Origines</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body origines-modal-body">
          <p className="modal-info">
            <strong>Règles :</strong> 1er Boost = +2, suivants = +1 (max +4, ou +6 si Race x2).
            1er Deboost = -2, suivants = -1 (max -4). Les boosts et deboosts ne s'annulent pas.
          </p>

          {/* Ethnie */}
          <div className="origin-section">
            <h3>Ethnie <span className="origin-label">{ethnie ? `(${ethnie.nom})` : '(Non sélectionnée)'}</span></h3>
            <p className="origin-desc">2 Boosts parmi les attributs forts, 1 Deboost parmi les faibles, +1 Boost si Deboost pris</p>
            <div className="origin-selects">
              <div className="origin-field">
                <label>Boost 1</label>
                <OriginSelect
                  source="race"
                  slot="boost1"
                  type="boost"
                  availableAttrs={ethnie?.strongAttributes || []}
                />
              </div>
              <div className="origin-field">
                <label>Boost 2</label>
                <OriginSelect
                  source="race"
                  slot="boost2"
                  type="boost"
                  availableAttrs={ethnie?.strongAttributes || []}
                />
              </div>
              <div className="origin-field">
                <label>Deboost</label>
                <OriginSelect
                  source="race"
                  slot="deboost1"
                  type="deboost"
                  availableAttrs={ethnie?.weakAttributes || []}
                />
              </div>
              <div className={`origin-field origin-conditional ${hasDeboost('race', 'deboost1') ? 'active' : ''}`}>
                <label>Boost 3</label>
                <OriginSelect
                  source="race"
                  slot="boost3"
                  type="boost"
                  availableAttrs={ethnie?.strongAttributes || []}
                  disabled={!hasDeboost('race', 'deboost1')}
                />
              </div>
            </div>
          </div>

          {/* Allégeance */}
          <div className="origin-section">
            <h3>Allégeance <span className="origin-label">{allegeance ? `(${allegeance.nom})` : '(Non sélectionnée)'}</span></h3>
            <p className="origin-desc">1 Boost débloqué si Deboost pris</p>
            <div className="origin-selects origin-selects-paired">
              <div className={`origin-field origin-conditional ${hasDeboost('allegeance', 'deboost1') ? 'active' : ''}`}>
                <label>Boost</label>
                <OriginSelect
                  source="allegeance"
                  slot="boost1"
                  type="boost"
                  availableAttrs={allegeance?.strongAttributes || []}
                  disabled={!hasDeboost('allegeance', 'deboost1')}
                />
              </div>
              <div className="origin-field">
                <label>Deboost</label>
                <OriginSelect
                  source="allegeance"
                  slot="deboost1"
                  type="deboost"
                  availableAttrs={allegeance?.weakAttributes || []}
                />
              </div>
            </div>
          </div>

          {/* Milieu */}
          <div className="origin-section">
            <h3>Milieu de vie <span className="origin-label">{milieu ? `(${milieu.nom})` : '(Non sélectionné)'}</span></h3>
            <p className="origin-desc">Chaque Boost se débloque si son Deboost correspondant est pris</p>
            <div className="origin-selects origin-selects-paired">
              <div className={`origin-field origin-conditional ${hasDeboost('milieu', 'deboost1') ? 'active' : ''}`}>
                <label>Boost 1</label>
                <OriginSelect
                  source="milieu"
                  slot="boost1"
                  type="boost"
                  availableAttrs={milieu?.strongAttributes || []}
                  disabled={!hasDeboost('milieu', 'deboost1')}
                />
              </div>
              <div className="origin-field">
                <label>Deboost 1</label>
                <OriginSelect
                  source="milieu"
                  slot="deboost1"
                  type="deboost"
                  availableAttrs={milieu?.weakAttributes || []}
                />
              </div>
              <div className={`origin-field origin-conditional ${hasDeboost('milieu', 'deboost2') ? 'active' : ''}`}>
                <label>Boost 2</label>
                <OriginSelect
                  source="milieu"
                  slot="boost2"
                  type="boost"
                  availableAttrs={milieu?.strongAttributes || []}
                  disabled={!hasDeboost('milieu', 'deboost2')}
                />
              </div>
              <div className="origin-field">
                <label>Deboost 2</label>
                <OriginSelect
                  source="milieu"
                  slot="deboost2"
                  type="deboost"
                  availableAttrs={milieu?.weakAttributes || []}
                />
              </div>
            </div>
          </div>

          {/* Persona */}
          <div className="origin-section">
            <h3>Persona <span className="origin-label">{persona ? `(${persona.nom})` : '(Non sélectionné)'}</span></h3>
            <p className="origin-desc">2 Boosts parmi les attributs forts, 1 Deboost parmi les faibles, +1 Boost si Deboost pris</p>
            <div className="origin-selects">
              <div className="origin-field">
                <label>Boost 1</label>
                <OriginSelect
                  source="persona"
                  slot="boost1"
                  type="boost"
                  availableAttrs={persona?.strongAttributes || []}
                />
              </div>
              <div className="origin-field">
                <label>Boost 2</label>
                <OriginSelect
                  source="persona"
                  slot="boost2"
                  type="boost"
                  availableAttrs={persona?.strongAttributes || []}
                />
              </div>
              <div className="origin-field">
                <label>Deboost</label>
                <OriginSelect
                  source="persona"
                  slot="deboost1"
                  type="deboost"
                  availableAttrs={persona?.weakAttributes || []}
                />
              </div>
              <div className={`origin-field origin-conditional ${hasDeboost('persona', 'deboost1') ? 'active' : ''}`}>
                <label>Boost 3</label>
                <OriginSelect
                  source="persona"
                  slot="boost3"
                  type="boost"
                  availableAttrs={persona?.strongAttributes || []}
                  disabled={!hasDeboost('persona', 'deboost1')}
                />
              </div>
            </div>
          </div>

          {/* Attributs de Naissance */}
          {ethnie?.attributs_naissance && Object.keys(ethnie.attributs_naissance).length > 0 && (() => {
            const NOMS = { STA: 'Stature', TAI: 'Taille', EGO: 'Ego', APP: 'Apparence', CHN: 'Chance', EQU: 'Équilibre' };
            const entries = Object.entries(ethnie.attributs_naissance);
            const naissanceTotal = entries.reduce((sum, [attrId, def]) => {
              const minVal = def.val ?? def.min;
              return sum + (naissanceChoix[attrId] ?? minVal);
            }, 0);
            const totalOk = naissanceTotal === 60;
            const hasOutOfBounds = entries.some(([attrId, def]) => {
              const minVal = def.val ?? def.min;
              const maxVal = def.val ?? def.max;
              const val = naissanceChoix[attrId] ?? minVal;
              return val < minVal || val > maxVal;
            });
            return (
              <div className="origin-section naissance-section">
                <div className="naissance-header">
                  <h3>Attributs de Naissance <span className="origin-label">({ethnie.nom})</span></h3>
                  <div className="naissance-header-right">
                    {hasOutOfBounds && (
                      <span className="naissance-warn-icon" title="Certains attributs sont hors bornes">⚠</span>
                    )}
                    <span className={`naissance-total-badge ${totalOk ? 'ok' : 'warn'}`}>
                      {naissanceTotal}/60
                    </span>
                  </div>
                </div>
                <p className="origin-desc">Valeurs absolues définies par votre ethnie — ajustez dans les bornes indiquées. Le total doit être 60.</p>
                <div className="naissance-attrs-grid">
                  {entries.map(([attrId, def]) => {
                    const nom = NOMS[attrId] || attrId;
                    const isFixed = def.val !== undefined;
                    const minVal = isFixed ? def.val : def.min;
                    const maxVal = isFixed ? def.val : def.max;
                    const currentVal = naissanceChoix[attrId] ?? minVal;
                    const delta = currentVal - DATA.valeurDefautSecondaire;
                    const outOfBounds = currentVal < minVal || currentVal > maxVal;
                    return (
                      <div key={attrId} className={`naissance-attr-field ${outOfBounds ? 'out-of-bounds' : ''}`}>
                        <span className="naissance-attr-nom">{nom}</span>
                        {isFixed ? (
                          <span className="naissance-attr-fixed">{minVal}</span>
                        ) : (
                          <div className="naissance-attr-stepper">
                            <button
                              className="btn-rang-step"
                              onClick={() => handleNaissanceChange(attrId, Math.max(minVal, currentVal - 1))}
                              disabled={currentVal <= minVal}
                            >−</button>
                            <span className="naissance-attr-val">{currentVal}</span>
                            <button
                              className="btn-rang-step"
                              onClick={() => handleNaissanceChange(attrId, Math.min(maxVal, currentVal + 1))}
                              disabled={currentVal >= maxVal}
                            >+</button>
                          </div>
                        )}
                        <span className={`naissance-attr-delta ${delta > 0 ? 'positive' : delta < 0 ? 'negative' : ''}`}>
                          {delta > 0 ? `+${delta}` : delta === 0 ? '±0' : delta}
                        </span>
                        <span className="naissance-attr-range">
                          {isFixed ? 'fixe' : `${minVal}–${maxVal}`}
                          {outOfBounds && <span className="naissance-field-warn" title="Hors bornes">⚠</span>}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </div>
        <div className="modal-footer">
          <button className="btn-secondary" onClick={handleReset}>Réinitialiser</button>
          <button className="btn-primary" onClick={handleApply}>Appliquer</button>
        </div>
      </div>
    </div>
  );
}

export default TabPrincipal;
