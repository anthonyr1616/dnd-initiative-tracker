import { useState, useEffect, useCallback } from "react";
import { Plus, Edit, Trash2, UserRound, LogIn } from "lucide-react";
import { useAuth } from "../helpers/useAuth";
import { signInWithGoogle } from "../services/authService";
import {
  getCharacters,
  saveCharacter,
  deleteCharacter,
} from "../services/characterService";
import styles from "./CharactersPage.module.css";

const EMPTY_FORM = {
  name: "",
  maxHp: "",
  ac: "",
  dexterity: "",
  notes: "",
};

function CharacterForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial ?? EMPTY_FORM);

  const set = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...form,
      maxHp: Number(form.maxHp) || 0,
      ac: Number(form.ac) || 0,
      dexterity: Number(form.dexterity) || 10,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className={`rounded-xl p-6 w-full max-w-md mx-4 ${styles.modal}`}>
        <h2 className={`text-lg font-semibold mb-4 ${styles.modalTitle}`}>
          {initial ? "Edit Character" : "New Character"}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className={`block text-xs font-medium mb-1 ${styles.label}`}>
              Name *
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={set("name")}
              placeholder="Character name"
              className={`w-full rounded-md border px-3 py-2 text-sm ${styles.input}`}
            />
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <label
                className={`block text-xs font-medium mb-1 ${styles.label}`}
              >
                Max HP
              </label>
              <input
                type="number"
                min="0"
                max="999"
                value={form.maxHp}
                onChange={set("maxHp")}
                placeholder="#"
                className={`w-full rounded-md border px-3 py-2 text-sm ${styles.input}`}
              />
            </div>
            <div className="flex-1">
              <label
                className={`block text-xs font-medium mb-1 ${styles.label}`}
              >
                Base AC
              </label>
              <input
                type="number"
                min="0"
                max="99"
                value={form.ac}
                onChange={set("ac")}
                placeholder="#"
                className={`w-full rounded-md border px-3 py-2 text-sm ${styles.input}`}
              />
            </div>
            <div className="flex-1">
              <label
                className={`block text-xs font-medium mb-1 ${styles.label}`}
              >
                Dexterity
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={form.dexterity}
                onChange={set("dexterity")}
                placeholder="#"
                className={`w-full rounded-md border px-3 py-2 text-sm ${styles.input}`}
              />
            </div>
          </div>

          <div>
            <label className={`block text-xs font-medium mb-1 ${styles.label}`}>
              Notes
            </label>
            <textarea
              value={form.notes}
              onChange={set("notes")}
              placeholder="Optional notes..."
              rows={3}
              className={`w-full rounded-md border px-3 py-2 text-sm resize-none ${styles.input}`}
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onCancel}
              className={`rounded-md border px-4 py-2 text-sm font-medium ${styles.cancelBtn}`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`rounded-md px-5 py-2 text-sm font-medium ${styles.saveBtn}`}
            >
              {initial ? "Save" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function CharacterCard({ character, onEdit, onDelete }) {
  const totalAc = (character.ac ?? 0) + (character.bonusAc ?? 0);
  const dexMod = Math.floor(((character.dexterity ?? 10) - 10) / 2);

  return (
    <div className={`rounded-xl p-4 ${styles.card}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <UserRound
            className={`w-5 h-5 shrink-0 ${styles.cardIcon}`}
            strokeWidth={1.5}
          />
          <h3 className={`font-bold text-lg truncate ${styles.cardName}`}>
            {character.name}
          </h3>
        </div>
        <div className="flex gap-1 shrink-0">
          <button
            onClick={() => onEdit(character)}
            className={`w-8 h-8 flex items-center justify-center rounded-full cursor-pointer ${styles.editBtn}`}
            title="Edit"
          >
            <Edit className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(character.id)}
            className={`w-8 h-8 flex items-center justify-center rounded-full cursor-pointer ${styles.deleteBtn}`}
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className={`flex gap-4 mt-3 text-sm flex-wrap ${styles.statRow}`}>
        <span title="Max HP">
          <span className={styles.statLabel}>HP </span>
          {character.maxHp}
        </span>
        <span title="Armor Class">
          <span className={styles.statLabel}>AC </span>
          {totalAc}
        </span>
        <span title="Dexterity modifier for initiative">
          <span className={styles.statLabel}>Initiative </span>
          {dexMod >= 0 ? `+${dexMod}` : dexMod}
        </span>
      </div>

      {character.notes && (
        <p className={`mt-2 text-xs line-clamp-2 ${styles.notes}`}>
          {character.notes}
        </p>
      )}
    </div>
  );
}

export default function CharactersPage() {
  const { user, isLoading } = useAuth();
  const [characters, setCharacters] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [formState, setFormState] = useState(null); // null = closed, {} = new, {id,...} = editing

  const loadCharacters = useCallback(async () => {
    if (!user) return;
    setIsFetching(true);
    try {
      const data = await getCharacters(user.uid);
      setCharacters(data);
    } finally {
      setIsFetching(false);
    }
  }, [user]);

  useEffect(() => {
    loadCharacters();
  }, [loadCharacters]);

  const handleSave = async (data) => {
    await saveCharacter(user.uid, { ...data, id: formState?.id });
    setFormState(null);
    loadCharacters();
  };

  const handleDelete = async (id) => {
    await deleteCharacter(user.uid, id);
    setCharacters((prev) => prev.filter((c) => c.id !== id));
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-2xl mx-auto flex justify-center">
        <p className={styles.muted}>Loading…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6 max-w-2xl mx-auto flex flex-col items-center gap-4 mt-16">
        <UserRound
          className={`w-16 h-16 ${styles.emptyIcon}`}
          strokeWidth={1}
        />
        <p className={`text-lg font-semibold ${styles.emptyTitle}`}>
          Sign in to manage characters
        </p>
        <button
          onClick={signInWithGoogle}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium ${styles.signInBtn}`}
        >
          <LogIn className="w-4 h-4" />
          Sign in with Google
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1
          className="font-bold text-4xl text-center text-[white]"
          style={{
            textShadow:
              "2px 2px 0 black, -2px 2px 0 black, 2px -2px 0 black, -2px -2px 0 black",
          }}
        >
          Characters
        </h1>
        <button
          onClick={() => setFormState({})}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer ${styles.newBtn}`}
        >
          <Plus className="w-4 h-4" />
          New Character
        </button>
      </div>

      {isFetching && (
        <p className={`text-sm text-center py-4 ${styles.muted}`}>
          Loading characters…
        </p>
      )}

      {!isFetching && characters.length === 0 && (
        <div className={`rounded-xl p-8 text-center ${styles.emptyCard}`}>
          <UserRound
            className={`w-10 h-10 mx-auto mb-2 ${styles.emptyIcon}`}
            strokeWidth={1}
          />
          <p className={`text-sm ${styles.muted}`}>
            No characters yet. Create one to get started.
          </p>
        </div>
      )}

      <div className="grid gap-3">
        {characters.map((c) => (
          <CharacterCard
            key={c.id}
            character={c}
            onEdit={(char) => setFormState(char)}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {formState !== null && (
        <CharacterForm
          initial={formState.id ? formState : null}
          onSave={handleSave}
          onCancel={() => setFormState(null)}
        />
      )}
    </div>
  );
}
