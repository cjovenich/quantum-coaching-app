import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc
} from 'firebase/firestore';
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
  User
} from 'firebase/auth';

// 🔐 Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyD6XOwkz1YzITrQjy2GuBAe5wWImyg7k-g",
  authDomain: "quantum-coaching-7ccee.firebaseapp.com",
  projectId: "quantum-coaching-7ccee",
  storageBucket: "quantum-coaching-7ccee.firebasestorage.app",
  messagingSenderId: "332035700106",
  appId: "1:332035700106:web:138a5ede9c9cf794a58473",
  measurementId: "G-61M4KMD5S1"
};

// 🔧 Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 🔐 Auth: ensure user is authenticated (anonymous or existing)
const initAuth = async (): Promise<User> => {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        resolve(user);
      } else {
        try {
          const credential = await signInAnonymously(auth);
          resolve(credential.user);
        } catch (err) {
          reject(err);
        }
      }
    });
  });
};

// 📝 Save username under /users/{uid}
const saveUsername = async (uid: string, username: string): Promise<void> => {
  const ref = doc(db, 'users', uid);
  await setDoc(ref, { username }, { merge: true });
};

// 📥 Get username from /users/{uid}
const getUsername = async (uid: string): Promise<string | null> => {
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    const data = snap.data();
    return typeof data.username === 'string' ? data.username : null;
  }
  return null;
};

export { app, auth, db, initAuth, saveUsername, getUsername };
