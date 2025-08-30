import "./App.css";
import InitiativeForm from "./components/InitiativeForm";
import InitiativeList from "./components/InitiativeList";
import { useState } from "react";
import { Link } from "react-router-dom";

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
    <div className="flex flex-col max-w-7xl mx-auto p-4">
      <InitiativeList
        initiativeItems={initiativeItems}
        onDelete={handleDelete}
      />
      <InitiativeForm onAdd={handleAdd}></InitiativeForm>
    </div>
  );
}

export default App;
