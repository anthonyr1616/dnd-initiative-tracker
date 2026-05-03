import { useState, useEffect, useRef } from "react";
import { getAllSpells, getSpell } from "../services/spellApi";
import { useSources } from "../helpers/useSources";
import CustomComboBox from "../components/CustomComboBox";
import SpellCard from "../components/SpellCard";

const SpellInfoPage = () => {
  const { selectedSources } = useSources();
  const [spells, setSpells] = useState([]);
  const [selectedSpell, setSelectedSpell] = useState(null);
  const [spellDetails, setSpellDetails] = useState(null);
  const cache = useRef({});

  useEffect(() => {
    async function fetchSpells() {
      try {
        const data = await getAllSpells(selectedSources);
        setSpells(data);
      } catch (err) {
        console.error("Failed to fetch spells:", err);
      }
    }
    fetchSpells();
  }, [selectedSources]);

  useEffect(() => {
    if (!selectedSpell) return;
    if (cache.current[selectedSpell.id]) {
      setSpellDetails(cache.current[selectedSpell.id]);
      return;
    }
    async function fetchSpellDetails() {
      try {
        const details = await getSpell(selectedSpell.id);
        cache.current[selectedSpell.id] = details;
        setSpellDetails(details);
      } catch (err) {
        console.error("Failed to fetch spell details:", err);
      }
    }
    fetchSpellDetails();
  }, [selectedSpell]);

  return (
    <div id="spell-info-page" className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="font-bold mb-4 text-center text-[white] text-4xl [text-shadow:_2px_2px_0_black,_-2px_2px_0_black,_2px_-2px_0_black,_-2px_-2px_0_black]">
        Spell Info
      </h1>
      <CustomComboBox
        items={spells}
        value={selectedSpell}
        onChange={setSelectedSpell}
        ariaLabel="Spell"
        placeholder="Search spells..."
        displayFunction={(item) => item?.toString() ?? ""}
      />
      {spellDetails && <SpellCard spell={spellDetails} />}
    </div>
  );
};

export default SpellInfoPage;
