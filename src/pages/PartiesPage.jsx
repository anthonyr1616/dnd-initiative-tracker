import { useState, useEffect, useCallback } from "react";
import { Plus, Edit, Trash2, Users, LogIn } from "lucide-react";
import { useAuth } from "../helpers/useAuth";
import { signInWithGoogle } from "../services/authService";
import { getCharacters } from "../services/characterService";
import { getParties, saveParty, deleteParty } from "../services/partyService";
import styles from "./PartiesPage.module.css";

const EMPTY_FORM = { name: "", characterIds: [] };

function PartyForm({
  initial,
  characters,
  existingParties,
  isSaving,
  onSave,
  onCancel,
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const existingIds = new Set(characters.map((c) => c.id));
  const [selectedIds, setSelectedIds] = useState(
    new Set((initial?.characterIds ?? []).filter((id) => existingIds.has(id))),
  );
  const [nameError, setNameError] = useState("");

  const toggleChar = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    const duplicate = existingParties.find(
      (p) =>
        p.name.toLowerCase() === trimmed.toLowerCase() && p.id !== initial?.id,
    );
    if (duplicate) {
      setNameError("A party with this name already exists.");
      return;
    }
    onSave({ ...initial, name: trimmed, characterIds: [...selectedIds] });
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
          {initial?.id ? "Edit Party" : "New Party"}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className={`block text-xs font-medium mb-1 ${styles.label}`}>
              Party Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setNameError("");
              }}
              placeholder="e.g. My Party"
              className={`w-full rounded-md border px-3 py-2 text-sm ${styles.input}`}
            />
            {nameError && (
              <p className={`mt-1 text-xs ${styles.errorMsg}`}>{nameError}</p>
            )}
          </div>

          <div>
            <label className={`block text-xs font-medium mb-2 ${styles.label}`}>
              Members ({selectedIds.size} selected)
            </label>
            {characters.length === 0 ? (
              <p className={`text-xs ${styles.muted}`}>No characters yet</p>
            ) : (
              <div
                className={`rounded-md border overflow-y-auto ${styles.charList}`}
              >
                {characters.map((c) => (
                  <label
                    key={c.id}
                    className={`flex items-center gap-3 px-3 py-2 cursor-pointer ${styles.charOption}`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.has(c.id)}
                      onChange={() => toggleChar(c.id)}
                      className="accent-[var(--color-brand)]"
                    />
                    <span className={`text-sm font-medium ${styles.charName}`}>
                      {c.name}
                    </span>
                    {(c.ac || c.bonusAc) && (
                      <span className={`text-xs ml-auto ${styles.charStat}`}>
                        AC {(c.ac ?? 0) + (c.bonusAc ?? 0)}
                      </span>
                    )}
                  </label>
                ))}
              </div>
            )}
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
              disabled={isSaving}
              className={`rounded-md px-5 py-2 text-sm font-medium ${styles.saveBtn}`}
            >
              {isSaving ? "Saving…" : initial?.id ? "Save" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function PartyCard({ party, characters, onEdit, onDelete }) {
  const charMap = Object.fromEntries(characters.map((c) => [c.id, c]));
  const members = (party.characterIds ?? [])
    .map((id) => charMap[id])
    .filter(Boolean);

  return (
    <div className={`rounded-xl p-4 ${styles.card}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Users
            className={`w-5 h-5 shrink-0 ${styles.cardIcon}`}
            strokeWidth={1.5}
          />
          <h3 className={`font-bold text-lg truncate ${styles.cardName}`}>
            {party.name}
          </h3>
        </div>
        <div className="flex gap-1 shrink-0">
          <button
            onClick={() => onEdit(party)}
            className={`w-8 h-8 flex items-center justify-center rounded-full ${styles.editBtn}`}
            title="Edit"
          >
            <Edit className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(party.id)}
            className={`w-8 h-8 flex items-center justify-center rounded-full ${styles.deleteBtn}`}
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {members.length === 0 ? (
        <p className={`mt-2 text-xs ${styles.muted}`}>No members</p>
      ) : (
        <ul className={`mt-3 flex flex-wrap gap-1.5 ${styles.memberList}`}>
          {members.map((c) => (
            <li
              key={c.id}
              className={`text-xs rounded-full px-2.5 py-0.5 ${styles.memberChip}`}
            >
              {c.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function PartiesPage() {
  const { user, isLoading } = useAuth();
  const [parties, setParties] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formState, setFormState] = useState(null);

  const loadData = useCallback(async () => {
    if (!user) return;
    setIsFetching(true);
    try {
      const [p, c] = await Promise.all([
        getParties(user.uid),
        getCharacters(user.uid),
      ]);
      setParties(p);
      setCharacters(c);
    } finally {
      setIsFetching(false);
    }
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSave = async (data) => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      await saveParty(user.uid, data);
      setFormState(null);
      loadData();
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    await deleteParty(user.uid, id);
    setParties((prev) => prev.filter((p) => p.id !== id));
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
        <Users className={`w-16 h-16 ${styles.emptyIcon}`} strokeWidth={1} />
        <p className={`text-lg font-semibold ${styles.emptyTitle}`}>
          Sign in to manage parties
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
          Parties
        </h1>
        <button
          onClick={() => setFormState(EMPTY_FORM)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${styles.newBtn}`}
        >
          <Plus className="w-4 h-4" />
          New Party
        </button>
      </div>

      {isFetching && (
        <p className={`text-sm text-center py-4 ${styles.muted}`}>
          Loading parties…
        </p>
      )}

      {!isFetching && parties.length === 0 && (
        <div className={`rounded-xl p-8 text-center ${styles.emptyCard}`}>
          <Users
            className={`w-10 h-10 mx-auto mb-2 ${styles.emptyIcon}`}
            strokeWidth={1}
          />
          <p className={`text-sm ${styles.muted}`}>No parties yet</p>
        </div>
      )}

      <div className="grid gap-3">
        {parties.map((p) => (
          <PartyCard
            key={p.id}
            party={p}
            characters={characters}
            onEdit={(party) => setFormState(party)}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {formState !== null && (
        <PartyForm
          initial={formState.id ? formState : undefined}
          characters={characters}
          existingParties={parties}
          isSaving={isSaving}
          onSave={handleSave}
          onCancel={() => setFormState(null)}
        />
      )}
    </div>
  );
}
