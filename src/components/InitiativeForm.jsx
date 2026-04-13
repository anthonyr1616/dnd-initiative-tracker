import { useState, useEffect } from "react";
import styles from "./InitiativeForm.module.css";

function InitiativeForm({
  onAdd,
  isEditing,
  setIsEditing,
  editingItem,
  setEditingItem,
  onSave,
}) {
  const [name, setName] = useState("");
  const [maxHp, setMaxHp] = useState("");
  const [currentHp, setCurrentHp] = useState("");
  const [temporaryHp, setTemporaryHp] = useState("");
  const [ac, setAc] = useState("");
  const [bonusAc, setBonusAc] = useState("");
  const [initiative, setInitiative] = useState("");

  useEffect(() => {
    if (isEditing && editingItem) {
      setName(editingItem.name || "");
      setMaxHp(editingItem.maxHp || "");
      setCurrentHp(editingItem.currentHp || "");
      setTemporaryHp(editingItem.temporaryHp || "");
      setAc(editingItem.ac || "");
      setBonusAc(editingItem.bonusAc || "");
      setInitiative(editingItem.initiative || "");
    }
  }, [isEditing, editingItem]);

  const resetForm = () => {
    setName("");
    setMaxHp("");
    setCurrentHp("");
    setTemporaryHp("");
    setAc("");
    setBonusAc("");
    setInitiative("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const character = {
      id: isEditing ? editingItem.id : crypto.randomUUID(),
      name,
      maxHp: Number(maxHp),
      currentHp: Number(currentHp),
      temporaryHp: Number(temporaryHp),
      ac: Number(ac),
      bonusAc: Number(bonusAc),
      initiative: Number(initiative),
    };

    if (isEditing) {
      onSave(character);
      setIsEditing(false);
      setEditingItem(null);
    } else {
      onAdd(character);
    }

    resetForm();
  };

  const handleCancel = () => {
    resetForm();
    setIsEditing(false);
    setEditingItem(null);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`w-full max-w-2xl mx-auto p-5 rounded-xl ${styles.form}`}
    >
      <div className="mb-4">
        <label className={`block text-xs font-medium mb-1 ${styles.label}`}>Name</label>
        <input
          type="text"
          placeholder="Character or monster name"
          value={name}
          required
          onChange={(e) => setName(e.target.value)}
          className={`rounded-md border px-3 py-2 text-sm w-full ${styles.input}`}
        />
      </div>

      <div className="flex flex-wrap gap-4 mb-4">
        <fieldset className={`flex-1 min-w-[180px] border rounded-lg px-3 pt-1 pb-3 ${styles.fieldset}`}>
          <legend className={`text-xs font-semibold px-1 ${styles.legend}`}>Hit Points</legend>
          <div className="flex gap-2 mt-1">
            <div className="flex-1">
              <label className={`block text-xs font-medium mb-1 ${styles.label}`}>Max</label>
              <input
                type="number"
                max="999"
                min="0"
                placeholder="—"
                value={maxHp}
                onChange={(e) => {
                  setMaxHp(e.target.value);
                  if (!isEditing) setCurrentHp(e.target.value);
                }}
                className={`rounded-md border px-3 py-2 text-sm w-full ${styles.input}`}
              />
            </div>
            <div className="flex-1">
              <label className={`block text-xs font-medium mb-1 ${styles.label}`}>Current</label>
              <input
                type="number"
                max="999"
                placeholder="—"
                value={currentHp}
                onChange={(e) => setCurrentHp(Math.min(e.target.value, maxHp))}
                className={`rounded-md border px-3 py-2 text-sm w-full ${styles.input}`}
              />
            </div>
            <div className="flex-1">
              <label className={`block text-xs font-medium mb-1 ${styles.label}`}>Temp</label>
              <input
                type="number"
                max="999"
                min="0"
                placeholder="—"
                value={temporaryHp}
                onChange={(e) => setTemporaryHp(e.target.value)}
                className={`rounded-md border px-3 py-2 text-sm w-full ${styles.input}`}
              />
            </div>
          </div>
        </fieldset>

        <fieldset className={`min-w-[140px] border rounded-lg px-3 pt-1 pb-3 ${styles.fieldset}`}>
          <legend className={`text-xs font-semibold px-1 ${styles.legend}`}>Armor Class</legend>
          <div className="flex gap-2 mt-1">
            <div className="flex-1">
              <label className={`block text-xs font-medium mb-1 ${styles.label}`}>Base</label>
              <input
                type="number"
                max="999"
                placeholder="—"
                value={ac}
                onChange={(e) => setAc(e.target.value)}
                className={`rounded-md border px-3 py-2 text-sm w-full ${styles.input}`}
              />
            </div>
            <div className="flex-1">
              <label className={`block text-xs font-medium mb-1 ${styles.label}`}>Bonus</label>
              <input
                type="number"
                max="999"
                placeholder="—"
                value={bonusAc}
                onChange={(e) => setBonusAc(e.target.value)}
                className={`rounded-md border px-3 py-2 text-sm w-full ${styles.input}`}
              />
            </div>
          </div>
        </fieldset>

        <div className="flex flex-col justify-end min-w-[80px]">
          <label className={`block text-xs font-medium mb-1 ${styles.label}`}>Initiative</label>
          <input
            type="number"
            max="999"
            placeholder="—"
            value={initiative}
            onChange={(e) => setInitiative(e.target.value)}
            className={`rounded-md border px-3 py-2 text-sm w-full ${styles.input}`}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        {isEditing ? (
          <>
            <button
              type="button"
              onClick={handleCancel}
              className={`rounded-md border px-4 py-2 text-sm font-medium ${styles.cancelBtn}`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`rounded-md px-5 py-2 text-sm font-medium ${styles.saveBtn}`}
            >
              Save
            </button>
          </>
        ) : (
          <button
            type="submit"
            className={`rounded-md px-5 py-2 text-sm font-medium ${styles.addBtn}`}
          >
            Add to Initiative
          </button>
        )}
      </div>
    </form>
  );
}

export default InitiativeForm;
