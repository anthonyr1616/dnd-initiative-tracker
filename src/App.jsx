import "./App.css";
import styles from "./App.module.css";
import InitiativeForm from "./components/InitiativeForm";
import InitiativeList from "./components/InitiativeList";
import { useState, useEffect, useRef } from "react";
import {
  createSession,
  updateSession,
  deleteSession,
  getSession,
} from "./services/sessionService";
import { useCombat } from "./helpers/useCombat";

const STORAGE_KEY = "dnd-initiative-tracker";

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {
    console.error("Failed to load state from localStorage");
  }
  return null;
}

function App() {
  const [initiativeItems, setInitiativeItems] = useState(
    () => loadState()?.initiativeItems ?? [],
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [sessionId, setSessionId] = useState(
    () => loadState()?.sessionId ?? null,
  );
  const [copied, setCopied] = useState(false);
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const syncTimeoutRef = useRef(null);

  const combat = useCombat(initiativeItems, {
    initCurrentTurnId: () => loadState()?.currentTurnId ?? null,
    initRound: () => loadState()?.round ?? 1,
    initCombatStarted: () => loadState()?.combatStarted ?? false,
  });
  const { currentTurnId, round, combatStarted } = combat;

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        initiativeItems,
        currentTurnId,
        round,
        combatStarted,
        sessionId,
      }),
    );
  }, [initiativeItems, currentTurnId, round, combatStarted, sessionId]);

  useEffect(() => {
    const id = loadState()?.sessionId;
    if (!id) return;
    getSession(id).then((data) => {
      if (data === null) setSessionId(null);
      else if (data.expiresAt < Date.now()) {
        setSessionId(null);
        deleteSession(id);
      }
    });
  }, []);

  useEffect(() => {
    if (!sessionId) return;
    clearTimeout(syncTimeoutRef.current);
    syncTimeoutRef.current = setTimeout(() => {
      updateSession(sessionId, {
        items: initiativeItems,
        currentTurnId,
        round,
      });
    }, 500);
    return () => clearTimeout(syncTimeoutRef.current);
  }, [initiativeItems, currentTurnId, round, sessionId]);

  const handleStartSharing = async () => {
    setIsCreatingSession(true);
    try {
      const id = await createSession({
        items: initiativeItems,
        currentTurnId,
        round,
      });
      setSessionId(id);
    } finally {
      setIsCreatingSession(false);
    }
  };

  const handleStopSharing = () => {
    deleteSession(sessionId);
    setSessionId(null);
    setCopied(false);
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}${import.meta.env.BASE_URL}#/room/${sessionId}`,
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAdd = (newCharacter) => {
    setInitiativeItems((prev) =>
      [...prev, newCharacter].sort((a, b) => b.initiative - a.initiative),
    );
  };

  const handleSave = (updatedCharacter) => {
    setInitiativeItems((prev) =>
      prev
        .map((item) =>
          item.id === updatedCharacter.id ? updatedCharacter : item,
        )
        .sort((a, b) => b.initiative - a.initiative),
    );
  };

  const handleDelete = (id) => {
    if (isEditing && editingItem?.id === id) {
      setIsEditing(false);
      setEditingItem(null);
    }
    const next = initiativeItems.filter((item) => item.id !== id);
    setInitiativeItems(next);
    combat.onItemDeleted(id, next);
  };

  const handleEdit = (id) => {
    const item = initiativeItems.find((i) => i.id === id);
    setEditingItem(item);
    setIsEditing(true);
  };

  const handleUpdate = (id, changes) => {
    setInitiativeItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...changes } : item)),
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

  const handleClearAll = () => {
    setInitiativeItems([]);
    setIsEditing(false);
    setEditingItem(null);
    combat.reset();
  };

  return (
    <div className="flex flex-col max-w-7xl mx-auto p-4 gap-4">
      <div className="flex justify-end">
        {sessionId ? (
          <div
            className={`flex items-center gap-2 rounded-lg px-3 py-2 ${styles.sessionActive}`}
          >
            <span className={`text-xs font-semibold ${styles.sessionLabel}`}>
              Live
            </span>
            <code className={`text-xs ${styles.sessionUrl}`}>
              {window.location.origin}
              {import.meta.env.BASE_URL}#/room/{sessionId}
            </code>
            <button
              onClick={handleCopyUrl}
              className={`text-xs px-2 py-1 rounded ${styles.copyBtn}`}
            >
              {copied ? "Copied!" : "Copy"}
            </button>
            <button
              onClick={handleStopSharing}
              className={`text-xs px-2 py-1 rounded ${styles.stopBtn}`}
            >
              Stop
            </button>
          </div>
        ) : (
          <button
            onClick={handleStartSharing}
            disabled={isCreatingSession}
            className={`text-sm px-3 py-1.5 rounded-md font-medium ${styles.shareBtn}`}
          >
            {isCreatingSession ? "Creating…" : "Share Session"}
          </button>
        )}
      </div>

      {initiativeItems.length > 0 && (
        <div
          className={`flex items-center justify-between rounded-xl px-4 py-3 ${styles.turnTracker}`}
        >
          {combatStarted ? (
            <>
              <div className="flex items-center gap-3">
                <span className={`text-lg font-bold ${styles.roundText}`}>
                  Round {round}
                </span>
                <span className={styles.divider}>|</span>
                <span className={`font-medium ${styles.turnName}`}>
                  {combat.currentTurnName}&apos;s turn
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={combat.prev}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium cursor-pointer ${styles.navBtn}`}
                >
                  ← Prev
                </button>
                <button
                  onClick={combat.next}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium cursor-pointer ${styles.primaryBtn}`}
                >
                  Next →
                </button>
                <button
                  onClick={combat.reset}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium cursor-pointer ${styles.resetBtn}`}
                >
                  Reset
                </button>
                <button
                  onClick={handleClearAll}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium cursor-pointer ${styles.clearBtn}`}
                >
                  Clear All
                </button>
              </div>
            </>
          ) : (
            <>
              <span className={`text-lg font-bold ${styles.roundText}`}>
                Combat not started
              </span>
              <div className="flex gap-2">
                <button
                  onClick={combat.start}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium cursor-pointer ${styles.primaryBtn}`}
                >
                  Start Combat
                </button>
                <button
                  onClick={handleClearAll}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium cursor-pointer ${styles.clearBtn}`}
                >
                  Clear All
                </button>
              </div>
            </>
          )}
        </div>
      )}

      <InitiativeList
        initiativeItems={initiativeItems}
        currentTurnId={combatStarted ? currentTurnId : null}
        sessionActive={!!sessionId}
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
        sessionActive={!!sessionId}
      />
    </div>
  );
}

export default App;
