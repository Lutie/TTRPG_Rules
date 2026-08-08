import { useCharacter } from '../../context/CharacterContext';
import Section from '../common/Section';

function TabScience() {
  useCharacter();

  return (
    <div id="tab-science" className="tab-content active">
      <Section title="Contenu à venir">
        <p className="status-info">
          Cet onglet accueillera les règles de science : gadgets, automates, recettes alchimiques, etc.
        </p>
      </Section>
    </div>
  );
}

export default TabScience;
