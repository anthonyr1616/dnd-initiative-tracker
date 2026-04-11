import "./App.css";
import InitiativeForm from "./components/InitiativeForm";
import InitiativeList from "./components/InitiativeList";
import { useState } from "react";

function App() {
  const [initiativeItems, setInitiativeItems] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [currentTurn, setCurrentTurn] = useState(0);
  const [round, setRound] = useState(1);

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
  };

  const handleDelete = (id) => {
    if (isEditing && editingItem && editingItem.id === id) {
      setIsEditing(false);
      setEditingItem(null);
    }
    const next = initiativeItems.filter((item) => item.id !== id);
    setInitiativeItems(next);
    if (next.length === 0) {
      setCurrentTurn(0);
    } else if (currentTurn >= next.length) {
      setCurrentTurn(next.length - 1);
    }
  };

  const handleEdit = (id) => {
    const item = initiativeItems.find((i) => i.id === id);
    setEditingItem(item);
    setIsEditing(true);
  };

  const handleUpdate = (id, changes) => {
    setInitiativeItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...changes } : item))
    );
  };

  const handleMoveUp = (id) => {
    setInitiativeItems((prev) => {
      const idx = prev.findIndex((i) => i.id === id);
      if (idx <= 0) return prev;
      const next = [...prev];
      [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
      return next;
    });
  };

  const handleMoveDown = (id) => {
    setInitiativeItems((prev) => {
      const idx = prev.findIndex((i) => i.id === id);
      if (idx >= prev.length - 1) return prev;
      const next = [...prev];
      [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
      return next;
    });
  };

  const handleNextTurn = () => {
    if (initiativeItems.length === 0) return;
    const next = currentTurn + 1;
    if (next >= initiativeItems.length) {
      setRound((r) => r + 1);
      setCurrentTurn(0);
    } else {
      setCurrentTurn(next);
    }
  };

  const handlePrevTurn = () => {
    if (initiativeItems.length === 0) return;
    if (currentTurn === 0) {
      setRound((r) => Math.max(1, r - 1));
      setCurrentTurn(initiativeItems.length - 1);
    } else {
      setCurrentTurn(currentTurn - 1);
    }
  };

  const handleResetCombat = () => {
    setCurrentTurn(0);
    setRound(1);
  };

  const handleClearAll = () => {
    setInitiativeItems([]);
    setCurrentTurn(0);
    setRound(1);
    setIsEditing(false);
    setEditingItem(null);
  };

  return (
    <div className="flex flex-col max-w-7xl mx-auto p-4 gap-4">
      {initiativeItems.length > 0 && (
        <div className="flex items-center justify-between bg-white rounded-xl px-4 py-3 shadow-md shadow-[#b6ad90]">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold text-[#3a1c04]">Round {round}</span>
            <span className="text-gray-400">|</span>
            <span className="text-gray-700 font-medium">
              {initiativeItems[currentTurn]?.name}&apos;s turn
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePrevTurn}
              className="px-3 py-1.5 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm font-medium cursor-pointer"
            >
              ← Prev
            </button>
            <button
              onClick={handleNextTurn}
              className="px-4 py-1.5 rounded-md bg-[#806c39] text-white hover:bg-[#6b5a30] text-sm font-medium cursor-pointer"
            >
              Next →
            </button>
            <button
              onClick={handleResetCombat}
              className="px-3 py-1.5 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 text-sm font-medium cursor-pointer"
            >
              Reset
            </button>
            <button
              onClick={handleClearAll}
              className="px-3 py-1.5 rounded-md bg-red-100 text-red-700 hover:bg-red-200 text-sm font-medium cursor-pointer"
            >
              Clear All
            </button>
          </div>
        </div>
      )}

      <InitiativeList
        initiativeItems={initiativeItems}
        currentTurn={currentTurn}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onUpdate={handleUpdate}
        onMoveUp={handleMoveUp}
        onMoveDown={handleMoveDown}
      />

      <InitiativeForm
        onAdd={handleAdd}
        onSave={handleSave}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        editingItem={editingItem}
        setEditingItem={setEditingItem}
      />
    </div>
  );
}

export default App;
