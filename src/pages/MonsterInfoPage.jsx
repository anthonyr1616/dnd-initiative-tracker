import { useState, useEffect } from "react";
import { getAllMonsters, getMonster } from "../services/dndApi";
import CustomComboBox from "../components/CustomComboBox";

const MonsterInfoPage = () => {
  const [monsters, setMonsters] = useState([]);
  const [selectedMonster, setSelectedMonster] = useState(null);
  const [monsterDetails, setMonsterDetails] = useState(null);

  useEffect(() => {
    async function fetchMonsters() {
      try {
        const data = await getAllMonsters();
        setMonsters(data);
        console.log("Got All Monsters");
      } catch (err) {
        console.error("Failed to fetch monsters:", err);
      }
    }
    fetchMonsters();
  }, []);

  useEffect(() => {
    if (!selectedMonster) return;
    async function fetchMonsterDetails() {
      try {
        const details = await getMonster(selectedMonster.id);
        setMonsterDetails(details);
        console.log("Got monster details:", details);
      } catch (err) {
        console.error("Failed to fetch monster details:", err);
      }
    }
    fetchMonsterDetails();
  }, [selectedMonster]);

  return (
    <div id="monster-info-page" className="p-6 max-w-lg mx-auto space-y-6">
      <h1 className="text-2xl font-bold mb-4">Monster Info Page</h1>

      <CustomComboBox
        items={monsters}
        value={selectedMonster}
        onChange={setSelectedMonster}
        ariaLabel="Monster"
        placeholder="Search monsters..."
      ></CustomComboBox>

      {monsterDetails && (
        <div className="rounded-lg border p-4 shadow-sm bg-gray-50">
          <h2 className="text-xl font-semibold mb-2">{monsterDetails.name}</h2>
          <p>
            <span className="font-medium">Size:</span> {monsterDetails.size}
          </p>
          <p>
            <span className="font-medium">Type:</span> {monsterDetails.type}
          </p>
          <p>
            <span className="font-medium">Alignment:</span>{" "}
            {monsterDetails.alignment}
          </p>
          <p>
            <span className="font-medium">Armor Class:</span>{" "}
            {monsterDetails.armorClass?.[0]?.value}
          </p>
          <p>
            <span className="font-medium">Hit Points:</span>{" "}
            {monsterDetails.hitPoints}
          </p>
        </div>
      )}
    </div>
  );
};

export default MonsterInfoPage;
