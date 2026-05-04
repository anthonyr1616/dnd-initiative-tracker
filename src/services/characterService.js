import { db } from "../firebase";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";

const charactersRef = (uid) => collection(db, "users", uid, "characters");
const characterRef = (uid, id) => doc(db, "users", uid, "characters", id);

export const getCharacters = async (uid) => {
  const q = query(charactersRef(uid), orderBy("name"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const saveCharacter = async (uid, character) => {
  const id = character.id ?? crypto.randomUUID();
  await setDoc(
    characterRef(uid, id),
    {
      name: character.name,
      maxHp: character.maxHp,
      ac: character.ac,
      dexterity: character.dexterity,
      notes: character.notes ?? "",
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
  return id;
};

export const deleteCharacter = async (uid, characterId) => {
  await deleteDoc(characterRef(uid, characterId));
};
