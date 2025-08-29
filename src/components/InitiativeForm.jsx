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
    <form onSubmit={handleSubmit}>
      <div className="initiative-input-container">
        <input
          type="text"
          placeholder="Name"
          value={name}
          required
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          max="999"
          placeholder="HP"
          value={hp}
          onChange={(e) => setHp(e.target.value)}
        />
        <input
          type="number"
          max="999"
          placeholder="AC"
          value={ac}
          onChange={(e) => setAc(e.target.value)}
        />
        <input
          type="number"
          max="999"
          placeholder="Initiative"
          value={initiative}
          onChange={(e) => setInitiative(e.target.value)}
        />
        <button type="submit">Add</button>
      </div>
    </form>
  );
}

export default InitiativeForm;
