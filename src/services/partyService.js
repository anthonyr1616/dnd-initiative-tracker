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

const partiesRef = (uid) => collection(db, "users", uid, "parties");
const partyRef = (uid, id) => doc(db, "users", uid, "parties", id);

export const getParties = async (uid) => {
  const q = query(partiesRef(uid), orderBy("name"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const saveParty = async (uid, party) => {
  const id = party.id ?? crypto.randomUUID();
  await setDoc(
    partyRef(uid, id),
    {
      name: party.name,
      characterIds: party.characterIds ?? [],
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
  return id;
};

export const deleteParty = async (uid, partyId) => {
  await deleteDoc(partyRef(uid, partyId));
};
