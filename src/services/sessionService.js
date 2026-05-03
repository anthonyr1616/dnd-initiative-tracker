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

export const createSession = async (state) => {
  const id = crypto.randomUUID().replace(/-/g, "").slice(0, 8);
  await setDoc(sessionRef(id), {
    items: state.items,
    currentTurnId: state.currentTurnId,
    round: state.round,
    updatedAt: serverTimestamp(),
  });
  return id;
};

export const updateSession = (id, state) =>
  setDoc(sessionRef(id), {
    items: state.items,
    currentTurnId: state.currentTurnId,
    round: state.round,
    updatedAt: serverTimestamp(),
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
