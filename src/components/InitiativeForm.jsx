import { useState, useEffect, useRef } from "react";
import styles from "./InitiativeForm.module.css";
import { getAllMonsters, getMonster } from "../services/monsterApi";
import { useSources } from "../helpers/useSources";
import CustomComboBox from "./CustomComboBox";
import {
  rollDice,
  rollHitDice,
  calculateModifier,
} from "../helpers/helperMethods";
import { Dices, Plus, X } from "lucide-react";
import { useAuth } from "../helpers/useAuth";
import { getCharacters } from "../services/characterService";
import { getParties } from "../services/partyService";

function SearchModal({
  title,
  onClose,
  isLoading,
  loadingText = "Loading...",
  children,
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={`rounded-xl p-6 w-full max-w-md mx-4 ${styles.modal}`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-lg font-semibold ${styles.modalTitle}`}>
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className={styles.closeBtn}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {isLoading ? (
          <p className={`text-sm ${styles.loadingText}`}>{loadingText}</p>
        ) : (
          children
        )}
      </div>
    </div>
  );
}

function InitiativeForm({
  onAdd,
  isEditing,
  setIsEditing,
  editingItem,
  setEditingItem,
  onSave,
  sessionActive = false,
}) {
  const [name, setName] = useState("");
  const [maxHp, setMaxHp] = useState("");
  const [currentHp, setCurrentHp] = useState("");
  const [temporaryHp, setTemporaryHp] = useState("");
  const [ac, setAc] = useState("");
  const [bonusAc, setBonusAc] = useState("");
  const [initiative, setInitiative] = useState("");

  const { user } = useAuth();
  const { selectedSources } = useSources();
  const [hideDetails, setHideDetails] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showMonsterSearch, setShowMonsterSearch] = useState(false);
  const [monsters, setMonsters] = useState([]);
  const [selectedSearchMonster, setSelectedSearchMonster] = useState(null);
  const [isLoadingMonsters, setIsLoadingMonsters] = useState(false);
  const [isFetchingDetails, setIsFetchingDetails] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [entityType, setEntityType] = useState("custom");
  const [showCharacterSearch, setShowCharacterSearch] = useState(false);
  const [showPartySearch, setShowPartySearch] = useState(false);
  const [savedCharacters, setSavedCharacters] = useState([]);
  const [savedParties, setSavedParties] = useState([]);
  const [isLoadingCharacters, setIsLoadingCharacters] = useState(false);
  const [isLoadingParties, setIsLoadingParties] = useState(false);
  const loadedSourcesKeyRef = useRef(null);
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
      setSelectedEntity(editingItem.entity ?? null);
      setEntityType(editingItem.entityType ?? "custom");
    }
  }, [isEditing, editingItem]);

  useEffect(() => {
    if (!showMonsterSearch) return;
    const key = JSON.stringify(selectedSources);
    if (loadedSourcesKeyRef.current === key) return;
    setIsLoadingMonsters(true);
    getAllMonsters(selectedSources).then((data) => {
      setMonsters(data);
      loadedSourcesKeyRef.current = key;
      setIsLoadingMonsters(false);
    });
  }, [showMonsterSearch, selectedSources]);

  useEffect(() => {
    if (!showCharacterSearch || !user) return;
    setIsLoadingCharacters(true);
    getCharacters(user.uid).then((data) => {
      setSavedCharacters(data);
      setIsLoadingCharacters(false);
    });
  }, [showCharacterSearch, user]);

  useEffect(() => {
    if (!showPartySearch || !user) return;
    setIsLoadingParties(true);
    Promise.all([getCharacters(user.uid), getParties(user.uid)]).then(
      ([chars, parties]) => {
        setSavedCharacters(chars);
        setSavedParties(parties);
        setIsLoadingParties(false);
      },
    );
  }, [showPartySearch, user]);

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
      const hp =
        typeof details.hitPoints === "number" ? String(details.hitPoints) : "";
      setMaxHp(hp);
      if (!isEditing) setCurrentHp(hp);
      const acValue = details.armorClass[0]?.value;
      setAc(acValue != null ? String(acValue) : "");
      setSelectedEntity(details);
      setEntityType("monster");
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
    setEntityType("custom");
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
      privateFields: isEditing
        ? (editingItem.privateFields ?? { name: false, hp: false, ac: false })
        : { name: hideDetails, hp: hideDetails, ac: hideDetails },
      entity:
        selectedEntity ?? (isEditing ? (editingItem.entity ?? null) : null),
      entityType,
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

  const handleCharacterSelect = (character) => {
    setName(character.name);
    const hp = character.maxHp != null ? String(character.maxHp) : "";
    setMaxHp(hp);
    setCurrentHp(hp);
    setTemporaryHp("");
    setAc(character.ac != null ? String(character.ac) : "");
    setBonusAc("");
    const entity = { stats: { dexterity: character.dexterity } };
    const dexMod =
      character.dexterity != null ? calculateModifier(character.dexterity) : 0;
    setInitiative(String(rollDice(20) + dexMod));
    setSelectedEntity(entity);
    setEntityType("character");
    setShowCharacterSearch(false);
  };

  const handlePartySelect = (party) => {
    const members = savedCharacters.filter((c) =>
      party.characterIds.includes(c.id),
    );
    members.forEach((character) => {
      const hp = character.maxHp ?? 0;
      const dexMod =
        character.dexterity != null
          ? calculateModifier(character.dexterity)
          : 0;
      onAdd({
        id: crypto.randomUUID(),
        name: character.name,
        maxHp: hp,
        currentHp: hp,
        temporaryHp: 0,
        ac: character.ac ?? 0,
        bonusAc: 0,
        initiative: rollDice(20) + dexMod,
        privateFields: { name: false, hp: false, ac: false },
        entity: { stats: { dexterity: character.dexterity } },
        entityType: "character",
      });
    });
    setShowPartySearch(false);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className={`w-full max-w-2xl mx-auto p-5 rounded-xl ${styles.form}`}
      >
        <div className="mb-4">
          <label className={`block text-xs font-medium mb-1 ${styles.label}`}>
            Name
          </label>
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
                <div
                  className={`absolute right-0 mt-1 z-20 min-w-max rounded-md shadow-lg ${styles.dropdown}`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setShowMonsterSearch(true);
                      setShowMenu(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm ${styles.dropdownItem}`}
                  >
                    Add Monster
                  </button>
                  {user && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setShowCharacterSearch(true);
                          setShowMenu(false);
                        }}
                        className={`flex items-center gap-2 w-full text-left px-4 py-2 text-sm ${styles.dropdownItem}`}
                      >
                        Add Character
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowPartySearch(true);
                          setShowMenu(false);
                        }}
                        className={`flex items-center gap-2 w-full text-left px-4 py-2 text-sm ${styles.dropdownItem}`}
                      >
                        Add Party
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-4">
          <fieldset
            className={`flex-1 min-w-[260px] border rounded-lg px-3 pt-1 pb-3 ${styles.fieldset}`}
          >
            <legend className={`text-xs font-semibold px-1 ${styles.legend}`}>
              Hit Points
            </legend>
            <div className="flex gap-2 mt-1">
              <div className="flex-1">
                <label
                  className={`block text-xs font-medium mb-1 ${styles.label}`}
                >
                  Max
                </label>
                <div className="flex gap-1 items-center">
                  <input
                    type="number"
                    max="999"
                    min="0"
                    placeholder="#"
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
                    title={`Reroll hit dice ${selectedEntity?.hitDice ? `(${selectedEntity.hitDice})` : ""}`}
                  >
                    <Dices className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex-1">
                <label
                  className={`block text-xs font-medium mb-1 ${styles.label}`}
                >
                  Current
                </label>
                <input
                  type="number"
                  max="999"
                  placeholder="#"
                  value={currentHp}
                  onChange={(e) =>
                    setCurrentHp(Math.min(e.target.value, maxHp))
                  }
                  className={`rounded-md border px-3 py-2 text-sm w-full ${styles.input}`}
                />
              </div>
              <div className="flex-1">
                <label
                  className={`block text-xs font-medium mb-1 ${styles.label}`}
                >
                  Temp
                </label>
                <input
                  type="number"
                  max="999"
                  min="0"
                  placeholder="#"
                  value={temporaryHp}
                  onChange={(e) => setTemporaryHp(e.target.value)}
                  className={`rounded-md border px-3 py-2 text-sm w-full ${styles.input}`}
                />
              </div>
            </div>
          </fieldset>

          <fieldset
            className={`w-[175px] shrink-0 border rounded-lg px-3 pt-1 pb-3 ${styles.fieldset}`}
          >
            <legend className={`text-xs font-semibold px-1 ${styles.legend}`}>
              Armor Class
            </legend>
            <div className="flex gap-2 mt-1">
              <div className="flex-1">
                <label
                  className={`block text-xs font-medium mb-1 ${styles.label}`}
                >
                  Base
                </label>
                <input
                  type="number"
                  max="999"
                  placeholder="#"
                  value={ac}
                  onChange={(e) => setAc(e.target.value)}
                  className={`rounded-md border px-3 py-2 text-sm w-full ${styles.input}`}
                />
              </div>
              <div className="flex-1">
                <label
                  className={`block text-xs font-medium mb-1 ${styles.label}`}
                >
                  Bonus
                </label>
                <input
                  type="number"
                  max="999"
                  placeholder="#"
                  value={bonusAc}
                  onChange={(e) => setBonusAc(e.target.value)}
                  className={`rounded-md border px-3 py-2 text-sm w-full ${styles.input}`}
                />
              </div>
            </div>
          </fieldset>

          <div className="flex flex-col justify-end min-w-[80px]">
            <label className={`block text-xs font-medium mb-1 ${styles.label}`}>
              Initiative
            </label>
            <div className="flex gap-1 items-center">
              <input
                type="number"
                max="999"
                placeholder="#"
                value={initiative}
                onChange={(e) => setInitiative(e.target.value)}
                className={`rounded-md border px-3 py-2 text-sm w-full ${styles.input}`}
              />
              <button
                type="button"
                onClick={handleRerollInitiative}
                className={styles.rerollBtn}
                aria-label="Reroll initiative"
                title={`Reroll initiative (d20 + ${calculateModifier(selectedEntity?.stats?.dexterity) ?? "0"})`}
              >
                <Dices className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          {!isEditing && sessionActive && (
            <label
              className={`flex items-center gap-2 text-sm cursor-pointer select-none ${styles.label}`}
            >
              <input
                type="checkbox"
                checked={hideDetails}
                onChange={(e) => setHideDetails(e.target.checked)}
                className={styles.checkbox}
              />
              Hide details
            </label>
          )}
          <div className="flex gap-2 ml-auto">
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
                  className={`rounded-md border px-4 py-2 text-sm font-medium cursor-pointer ${styles.cancelBtn}`}
                >
                  Clear
                </button>
                <button
                  type="submit"
                  className={`rounded-md px-5 py-2 text-sm font-medium cursor-pointer ${styles.addBtn}`}
                >
                  Add to Initiative
                </button>
              </>
            )}
          </div>
        </div>
      </form>

      {showCharacterSearch && (
        <SearchModal
          title="Select Character"
          onClose={() => setShowCharacterSearch(false)}
          isLoading={isLoadingCharacters}
          loadingText="Loading characters..."
        >
          {savedCharacters.length === 0 ? (
            <p className={`text-sm ${styles.loadingText}`}>
              No saved characters found.
            </p>
          ) : (
            <ul className="flex flex-col gap-1 max-h-80 overflow-y-auto">
              {savedCharacters.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => handleCharacterSelect(c)}
                    className={`flex items-center justify-between w-full text-left px-4 py-2 rounded-md text-sm ${styles.dropdownItem}`}
                  >
                    <span className="font-medium">{c.name}</span>
                    <span className={`text-xs ${styles.label}`}>
                      {c.notes ? c.notes : ""}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </SearchModal>
      )}

      {showPartySearch && (
        <SearchModal
          title="Select Party"
          onClose={() => setShowPartySearch(false)}
          isLoading={isLoadingParties}
          loadingText="Loading parties..."
        >
          {savedParties.length === 0 ? (
            <p className={`text-sm ${styles.loadingText}`}>
              No saved parties found.
            </p>
          ) : (
            <ul className="flex flex-col gap-1 max-h-80 overflow-y-auto">
              {savedParties.map((p) => {
                const memberNames = savedCharacters
                  .filter((c) => p.characterIds.includes(c.id))
                  .map((c) => c.name)
                  .join(", ");
                return (
                  <li key={p.id}>
                    <button
                      type="button"
                      onClick={() => handlePartySelect(p)}
                      className={`flex items-center justify-between w-full text-left px-4 py-2 rounded-md text-sm ${styles.dropdownItem}`}
                    >
                      <span className="font-medium">{p.name}</span>
                      <span
                        className={`text-xs ${styles.label} ml-4 truncate max-w-[180px]`}
                      >
                        {memberNames || "No members"}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </SearchModal>
      )}

      {showMonsterSearch && (
        <SearchModal
          title="Select Monster"
          onClose={closeMonsterSearch}
          isLoading={isLoadingMonsters || isFetchingDetails}
          loadingText={
            isFetchingDetails
              ? "Loading monster details..."
              : "Loading monsters..."
          }
        >
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
        </SearchModal>
      )}
    </>
  );
}

export default InitiativeForm;
