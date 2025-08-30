import { useState } from "react";

// TODO: Add current HP, bonus health, and bonus AC to form

function InitiativeForm({ onAdd }) {
  const [name, setName] = useState("");
  const [maxHp, setMaxHp] = useState("");
  const [currentHp, setCurrentHp] = useState("");
  const [temporaryHp, setTemporaryHp] = useState("");
  const [ac, setAc] = useState("");
  const [bonusAc, setBonusAc] = useState("");
  const [initiative, setInitiative] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const newCharacter = {
      id: crypto.randomUUID(),
      name,
      maxHp: Number(maxHp),
      currentHp: Number(currentHp),
      temporaryHp: Number(temporaryHp),
      ac: Number(ac),
      bonusAc: Number(bonusAc),
      initiative: Number(initiative),
    };

    onAdd(newCharacter);

    setName("");
    setMaxHp("");
    setCurrentHp("");
    setTemporaryHp("");
    setAc("");
    setBonusAc("");
    setInitiative("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-2xl mx-auto p-4 bg-white rounded-xl shadow-slate-800 shadow-md"
    >
      <div className="flex flex-wrap gap-2 items-center">
        <input
          type="text"
          placeholder="Name"
          value={name}
          required
          onChange={(e) => setName(e.target.value)}
          className="flex-1 min-w-[120px] rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex flex-col w-32 gap-1">
          <input
            type="number"
            max="999"
            min="0"
            placeholder="Max HP"
            value={maxHp}
            onChange={(e) => {
              setMaxHp(e.target.value);
              setCurrentHp(e.target.value);
            }}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            max="999"
            placeholder="Current HP"
            value={currentHp}
            onChange={(e) => {
              setCurrentHp(Math.min(e.target.value, maxHp));
            }}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            max="999"
            min="0"
            placeholder="Temporary HP"
            value={temporaryHp}
            onChange={(e) => setTemporaryHp(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col gap-1 w-25">
          <input
            type="number"
            max="999"
            placeholder="Base AC"
            value={ac}
            onChange={(e) => setAc(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            max="999"
            placeholder="Bonus AC"
            value={bonusAc}
            onChange={(e) => setBonusAc(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
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
