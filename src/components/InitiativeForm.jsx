import { useState, useEffect, useRef } from "react";
import styles from "./InitiativeForm.module.css";
import { getAllMonsters, getMonster } from "../services/monsterApi";
import CustomComboBox from "./CustomComboBox";
import { rollDice, rollHitDice, calculateModifier } from "../helpers/helperMethods";
import {
  Dices,
  Plus,
} from "lucide-react";

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

  const [showMenu, setShowMenu] = useState(false);
  const [showMonsterSearch, setShowMonsterSearch] = useState(false);
  const [monsters, setMonsters] = useState([]);
  const [selectedSearchMonster, setSelectedSearchMonster] = useState(null);
  const [isLoadingMonsters, setIsLoadingMonsters] = useState(false);
  const [isFetchingDetails, setIsFetchingDetails] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const monstersLoadedRef = useRef(false);
  const menuRef = useRef(null);

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

  useEffect(() => {
    if (!showMonsterSearch || monstersLoadedRef.current) return;
    setIsLoadingMonsters(true);
    getAllMonsters().then((data) => {
      setMonsters(data);
      monstersLoadedRef.current = true;
      setIsLoadingMonsters(false);
    });
  }, [showMonsterSearch]);

  useEffect(() => {
    if (!showMenu) return;
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMenu]);

  const handleMonsterSelect = async (monster) => {
    if (!monster) return;
    setIsFetchingDetails(true);
    try {
      const details = await getMonster(monster.id);
      setName(details.name);
      const hp = typeof details.hitPoints === "number" ? String(details.hitPoints) : "";
      setMaxHp(hp);
      if (!isEditing) setCurrentHp(hp);
      const acValue = details.armorClass[0]?.value;
      setAc(acValue != null ? String(acValue) : "");
      setSelectedEntity(details);
      const dex = details.stats.dexterity;
      const dexMod = dex != null ? calculateModifier(dex) : 0;
      setInitiative(String(rollDice(20) + dexMod));
      setShowMonsterSearch(false);
      setSelectedSearchMonster(null);
    } finally {
      setIsFetchingDetails(false);
    }
  };

  const closeMonsterSearch = () => {
    setShowMonsterSearch(false);
    setSelectedSearchMonster(null);
  };

  const handleRerollInitiative = () => {
    const dex = selectedEntity?.stats?.dexterity;
    const dexMod = dex != null ? calculateModifier(dex) : 0;
    setInitiative(String(rollDice(20) + dexMod));
  };

  const handleRerollHp = () => {
    const result = rollHitDice(selectedEntity?.hitDice);
    if (result == null) return;
    setMaxHp(String(result));
    if (!isEditing) setCurrentHp(String(result));
  };

  const resetForm = () => {
    setName("");
    setMaxHp("");
    setCurrentHp("");
    setTemporaryHp("");
    setAc("");
    setBonusAc("");
    setInitiative("");
    setSelectedEntity(null);
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
    <>
      <form
        onSubmit={handleSubmit}
        className={`w-full max-w-2xl mx-auto p-5 rounded-xl ${styles.form}`}
      >
        <div className="mb-4">
          <label className={`block text-xs font-medium mb-1 ${styles.label}`}>Name</label>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              placeholder="Character or monster name"
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
              className={`rounded-md border px-3 py-2 text-sm flex-1 ${styles.input}`}
            />
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setShowMenu(!showMenu)}
                className={`rounded-md border px-3 py-2 text-sm font-bold leading-none ${styles.menuBtn}`}
                aria-label="Fill from source"
              >
                <Plus className="w-4 h-4" />
              </button>
              {showMenu && (
                <div className={`absolute right-0 mt-1 z-20 min-w-max rounded-md shadow-lg ${styles.dropdown}`}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowMonsterSearch(true);
                      setShowMenu(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${styles.dropdownItem}`}
                  >
                    Use Monster
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-4">
          <fieldset className={`flex-1 min-w-[260px] border rounded-lg px-3 pt-1 pb-3 ${styles.fieldset}`}>
            <legend className={`text-xs font-semibold px-1 ${styles.legend}`}>Hit Points</legend>
            <div className="flex gap-2 mt-1">
              <div className="flex-1">
                <label className={`block text-xs font-medium mb-1 ${styles.label}`}>Max</label>
                <div className="flex gap-1 items-center">
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
                    className={`rounded-md border px-3 py-2 text-sm flex-1 ${styles.input}`}
                  />
                  <button
                    type="button"
                    onClick={handleRerollHp}
                    disabled={!selectedEntity?.hitDice}
                    className={styles.rerollBtn}
                    aria-label="Reroll hit points"
                  >
                    <Dices className="w-4 h-4" />
                  </button>
                </div>
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

          <fieldset className={`w-[175px] shrink-0 border rounded-lg px-3 pt-1 pb-3 ${styles.fieldset}`}>
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
            <div className="flex gap-1 items-center">
              <input
                type="number"
                max="999"
                placeholder="—"
                value={initiative}
                onChange={(e) => setInitiative(e.target.value)}
                className={`rounded-md border px-3 py-2 text-sm w-full ${styles.input}`}
              />
              <button
                type="button"
                onClick={handleRerollInitiative}
                className={styles.rerollBtn}
                aria-label="Reroll initiative"
              >
                <Dices className="w-4 h-4" />
              </button>
            </div>
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
            <>
              <button
                type="button"
                onClick={resetForm}
                className={`rounded-md border px-4 py-2 text-sm font-medium ${styles.cancelBtn}`}
              >
                Clear
              </button>
              <button
                type="submit"
                className={`rounded-md px-5 py-2 text-sm font-medium ${styles.addBtn}`}
              >
                Add to Initiative
              </button>
            </>
          )}
        </div>
      </form>

      {showMonsterSearch && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeMonsterSearch();
          }}
        >
          <div className={`rounded-xl p-6 w-full max-w-md mx-4 ${styles.modal}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-lg font-semibold ${styles.modalTitle}`}>Select Monster</h2>
              <button
                type="button"
                onClick={closeMonsterSearch}
                className={styles.closeBtn}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            {isLoadingMonsters ? (
              <p className={`text-sm ${styles.loadingText}`}>Loading monsters...</p>
            ) : isFetchingDetails ? (
              <p className={`text-sm ${styles.loadingText}`}>Loading monster details...</p>
            ) : (
              <CustomComboBox
                items={monsters}
                value={selectedSearchMonster}
                onChange={(monster) => {
                  setSelectedSearchMonster(monster);
                  if (monster) handleMonsterSelect(monster);
                }}
                ariaLabel="Monster"
                placeholder="Search monsters..."
                displayFunction={(item) => item?.toString() ?? ""}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default InitiativeForm;
