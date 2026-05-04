import { db } from "../firebase";
import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

const sessionRef = (id) => doc(db, "sessions", id);

const serializeItems = (items) =>
  items.map(
    ({
      id,
      name,
      maxHp,
      currentHp,
      temporaryHp,
      ac,
      bonusAc,
      initiative,
      privateFields,
      entityType,
    }) => ({
      id,
      name,
      maxHp,
      currentHp,
      temporaryHp,
      ac,
      bonusAc,
      initiative,
      privateFields,
      entityType: entityType ?? "custom",
    }),
  );

export const createSession = async (state) => {
  const id = crypto.randomUUID().replace(/-/g, "").slice(0, 8);
  await setDoc(sessionRef(id), {
    items: serializeItems(state.items),
    currentTurnId: state.currentTurnId,
    round: state.round,
    updatedAt: serverTimestamp(),
    expiresAt: Date.now() + 1 * 24 * 60 * 60 * 1000,
  });
  return id;
};

export const updateSession = (id, state) =>
  setDoc(sessionRef(id), {
    items: serializeItems(state.items),
    currentTurnId: state.currentTurnId,
    round: state.round,
    updatedAt: serverTimestamp(),
    expiresAt: Date.now() + 1 * 24 * 60 * 60 * 1000,
  });

export const deleteSession = (id) => deleteDoc(sessionRef(id));

export const getSession = async (id) => {
  const snap = await getDoc(sessionRef(id));
  return snap.exists() ? snap.data() : null;
};

export const subscribeToSession = (id, callback) =>
  onSnapshot(sessionRef(id), (snap) =>
    callback(snap.exists() ? snap.data() : null),
  );
