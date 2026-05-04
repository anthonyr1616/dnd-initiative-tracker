import { useState } from "react";

export function useCombat(
  items,
  { initCurrentTurnId = null, initRound = 1, initCombatStarted = false } = {},
) {
  const [currentTurnId, setCurrentTurnId] = useState(initCurrentTurnId);
  const [round, setRound] = useState(initRound);
  const [combatStarted, setCombatStarted] = useState(initCombatStarted);

  const getCurrentIndex = () => {
    if (currentTurnId === null) return 0;
    const idx = items.findIndex((i) => i.id === currentTurnId);
    return idx === -1 ? 0 : idx;
  };

  const start = () => {
    if (items.length === 0) return;
    setCombatStarted(true);
    setCurrentTurnId(items[0].id);
  };

  const next = () => {
    if (items.length === 0) return;
    const idx = getCurrentIndex();
    if (idx + 1 >= items.length) {
      setRound((r) => r + 1);
      setCurrentTurnId(items[0].id);
    } else {
      setCurrentTurnId(items[idx + 1].id);
    }
  };

  const prev = () => {
    if (items.length === 0) return;
    const idx = getCurrentIndex();
    if (idx === 0) {
      setRound((r) => Math.max(1, r - 1));
      setCurrentTurnId(items[items.length - 1].id);
    } else {
      setCurrentTurnId(items[idx - 1].id);
    }
  };

  const reset = () => {
    setCombatStarted(false);
    setCurrentTurnId(null);
    setRound(1);
  };

  const onItemDeleted = (id, remainingItems) => {
    if (remainingItems.length === 0) {
      reset();
      return;
    }
    if (combatStarted && id === currentTurnId) {
      const oldIdx = items.findIndex((i) => i.id === id);
      const newIdx = Math.min(oldIdx, remainingItems.length - 1);
      setCurrentTurnId(remainingItems[newIdx].id);
    }
  };

  return {
    currentTurnId,
    round,
    combatStarted,
    currentTurnName: items[getCurrentIndex()]?.name,
    start,
    next,
    prev,
    reset,
    onItemDeleted,
  };
}
