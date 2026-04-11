import { useState, useEffect, useRef } from "react";
import { getAllMonsters, getMonster } from "../services/dndApi";
import CustomComboBox from "../components/CustomComboBox";
import MonsterCard from "../components/MonsterCard";

const MonsterInfoPage = () => {
  const [monsters, setMonsters] = useState([]);
  const [selectedMonster, setSelectedMonster] = useState(null);
  const [monsterDetails, setMonsterDetails] = useState(null);
  const cache = useRef({});

  useEffect(() => {
    async function fetchMonsters() {
      try {
        const data = await getAllMonsters();
        setMonsters(data);
      } catch (err) {
        console.error("Failed to fetch monsters:", err);
      }
    }
    fetchMonsters();
  }, []);

  useEffect(() => {
    if (!selectedMonster) return;
    if (cache.current[selectedMonster.id]) {
      setMonsterDetails(cache.current[selectedMonster.id]);
      return;
    }
    async function fetchMonsterDetails() {
      try {
        const details = await getMonster(selectedMonster.id);
        cache.current[selectedMonster.id] = details;
        setMonsterDetails(details);
      } catch (err) {
        console.error("Failed to fetch monster details:", err);
      }
    }
    fetchMonsterDetails();
  }, [selectedMonster]);

  return (
    <div id="monster-info-page" className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="font-bold mb-4 text-center text-[white] text-4xl [text-shadow:_2px_2px_0_black,_-2px_2px_0_black,_2px_-2px_0_black,_-2px_-2px_0_black]">
        Monster Info
      </h1>
      <CustomComboBox
        items={monsters}
        value={selectedMonster}
        onChange={setSelectedMonster}
        ariaLabel="Monster"
        placeholder="Search monsters..."
      />
      {monsterDetails && <MonsterCard monster={monsterDetails} />}
    </div>
  );
};

export default MonsterInfoPage;
