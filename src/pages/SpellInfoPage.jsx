import { useState, useEffect } from "react";
import { getAllSpells, getSpell } from "../services/dndApi";
import CustomComboBox from "../components/CustomComboBox";
import ReactMarkdown from "react-markdown";

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
    <div id="spell-info-page" className="p-6 max-w-lg mx-auto space-y-6">
      <h1 className="text-2xl font-bold mb-4">Spell Info Page</h1>
      <CustomComboBox
        items={spells}
        value={selectedSpell}
        onChange={setSelectedSpell}
        ariaLabel="Spell"
        placeholder="Search spells..."
      ></CustomComboBox>
      {spellDetails && (
        <div className="rounded-lg border p-4 shadow-sm bg-gray-50">
          <h2 className="text-xl font-semibold mb-2">{spellDetails.name}</h2>
          <p>
            <span className="font-medium">
              {`${
                spellDetails.level > 0 ? `Level ${spellDetails.level}` : ""
              } ${spellDetails.school} ${
                spellDetails.level === 0 ? "Cantrip" : ""
              }`}{" "}
              ({spellDetails.classes.join(", ")})
            </span>
          </p>
          <p>
            <span className="font-medium">
              Casting Time: {spellDetails.castingTime}
            </span>
          </p>
          <p>
            <span className="font-medium">Range: {spellDetails.range}</span>
          </p>
          <p>
            <span className="font-medium">
              Components: {spellDetails.components.join(", ")}
              {spellDetails.material ? ` (${spellDetails.material})` : ""}
            </span>
          </p>
          <p>
            <span className="font-medium">
              Duration: {spellDetails.duration}
            </span>
          </p>
          {spellDetails.description.map((paragraph, index) => (
            <ReactMarkdown key={index}>{paragraph}</ReactMarkdown>
          ))}
        </div>
      )}
    </div>
  );
};

export default SpellInfoPage;
