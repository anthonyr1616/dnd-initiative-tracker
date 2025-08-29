import "./App.css";
import InitiativeForm from "./components/InitiativeForm";
import InitiativeList from "./components/InitiativeList";
import { useState } from "react";

function App() {
  const [initiativeItems, setInitiativeItems] = useState([]);

  const handleAdd = (newCharacter) => {
    setInitiativeItems((prev) =>
      [...prev, newCharacter].sort((a, b) => b.initiative - a.initiative)
    );
  };

  const handleDelete = (id) => {
    setInitiativeItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <>
      <InitiativeList
        initiativeItems={initiativeItems}
        onDelete={handleDelete}
      />
      <InitiativeForm onAdd={handleAdd}></InitiativeForm>
    </>
  );
}

export default App;
