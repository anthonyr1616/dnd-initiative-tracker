import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCwlMC2m9lowol9YdJAqIPXVF5K18i-lZQ",
  authDomain: "dnd-initiative-tracker-dd214.firebaseapp.com",
  projectId: "dnd-initiative-tracker-dd214",
  storageBucket: "dnd-initiative-tracker-dd214.firebasestorage.app",
  messagingSenderId: "378083788843",
  appId: "1:378083788843:web:496657bba2d143ee04826e",
  measurementId: "G-Q9CK749MC9",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
