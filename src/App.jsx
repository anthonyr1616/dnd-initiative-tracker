import { useEffect } from "react";
import "./App.css";
import { getSpell, getAllSpells, getMonster } from "./services/dndApi";

function App() {
  console.log("Hell2o");

  const getSpells = async () => {
    const spells = await getAllSpells();
    console.log(spells);
    const fireball = await getMonster("tarrasque");
    console.log(fireball);
  };

  useEffect(() => {
    getSpells();
  }, []);
  return <></>;
}

export default App;
