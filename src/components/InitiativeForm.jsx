import { useState } from "react";

function InitiativeForm({ onAdd }) {
  const [name, setName] = useState("");
  const [hp, setHp] = useState("");
  const [ac, setAc] = useState("");
  const [initiative, setInitiative] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const newCharacter = {
      id: crypto.randomUUID(),
      name,
      hp: Number(hp),
      ac: Number(ac),
      initiative: Number(initiative),
    };

    onAdd(newCharacter);

    setName("");
    setHp("");
    setAc("");
    setInitiative("");
  };

  return (
<form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto p-4 bg-white rounded-xl shadow-slate-800 shadow-md">
  <div className="flex flex-wrap gap-2 items-center">
    <input
      type="text"
      placeholder="Name"
      value={name}
      required
      onChange={(e) => setName(e.target.value)}
      className="flex-1 min-w-[120px] rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <input
      type="number"
      max="999"
      placeholder="HP"
      value={hp}
      onChange={(e) => setHp(e.target.value)}
      className="w-20 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <input
      type="number"
      max="999"
      placeholder="AC"
      value={ac}
      onChange={(e) => setAc(e.target.value)}
      className="w-20 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <input
      type="number"
      max="999"
      placeholder="Initiative"
      value={initiative}
      onChange={(e) => setInitiative(e.target.value)}
      className="w-28 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <button
      type="submit"
      className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      Add
    </button>
  </div>
</form>

  );
}

export default InitiativeForm;
