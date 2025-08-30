import "./App.css";
import InitiativeForm from "./components/InitiativeForm";
import InitiativeList from "./components/InitiativeList";
import { useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";

function App() {
  const [initiativeItems, setInitiativeItems] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const handleAdd = (newCharacter) => {
    setInitiativeItems((prev) =>
      [...prev, newCharacter].sort((a, b) => b.initiative - a.initiative)
    );
  };

  const handleSave = (updatedCharacter) => {
    setInitiativeItems((prev) =>
      prev
        .map((item) => (item.id === updatedCharacter.id ? updatedCharacter : item))
        .sort((a, b) => b.initiative - a.initiative)
    );
  }

  const handleDelete = (id) => {
    setInitiativeItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleEdit = (id) => {
    const item = initiativeItems.find((i) => i.id === id);
    setEditingItem(item);
    setIsEditing(true);
  };

  return (
    <div className="flex flex-col max-w-7xl mx-auto p-4">
      <InitiativeList
        initiativeItems={initiativeItems}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />
      <InitiativeForm
        onAdd={handleAdd}
        onSave={handleSave}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        editingItem={editingItem}
        setEditingItem={setEditingItem}
      ></InitiativeForm>
    </div>
  );
}

export default App;
