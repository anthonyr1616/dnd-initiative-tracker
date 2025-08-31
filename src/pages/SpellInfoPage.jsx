import { useState, useEffect } from "react";
import { getAllSpells, getSpell } from "../services/dndApi";
import CustomComboBox from "../components/CustomComboBox";
import SpellCard from "../components/SpellCard";

const SpellInfoPage = () => {
  const [spells, setSpells] = useState([]);
  const [selectedSpell, setSelectedSpell] = useState(null);
  const [spellDetails, setSpellDetails] = useState(null);

  useEffect(() => {
    async function fetchSpells() {
      try {
        const data = await getAllSpells();
        setSpells(data);
        console.log("Got All Spells");
      } catch (err) {
        console.error("Failed to fetch spells:", err);
      }
    }
    fetchSpells();
  }, []);

  useEffect(() => {
    if (!selectedSpell) return;
    async function fetchSpellDetails() {
      try {
        const details = await getSpell(selectedSpell.id);
        setSpellDetails(details);
        console.log("Got spell details:", details);
      } catch (err) {
        console.error("Failed to fetch spell details:", err);
      }
    }
    fetchSpellDetails();
  }, [selectedSpell]);

  return (
    <div id="spell-info-page" className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="font-bold mb-4 text-center text-[white] text-4xl [text-shadow:_2px_2px_0_black,_-2px_2px_0_black,_2px_-2px_0_black,_-2px_-2px_0_black]">Spell Info</h1>
      <CustomComboBox
        items={spells}
        value={selectedSpell}
        onChange={setSelectedSpell}
        ariaLabel="Spell"
        placeholder="Search spells..."
      ></CustomComboBox>
      {spellDetails && <SpellCard spell={spellDetails} />}
    </div>
  );
};

export default SpellInfoPage;
