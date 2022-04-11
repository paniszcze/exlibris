import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDitsV8IWqpzgZEWDcL9SKIPRH6-dUHK3g",
  authDomain: "exlibris-f130f.firebaseapp.com",
  projectId: "exlibris-f130f",
  storageBucket: "exlibris-f130f.appspot.com",
  messagingSenderId: "57606762057",
  appId: "1:57606762057:web:7637a86f8a89bf6f579998",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
