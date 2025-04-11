// app/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyD6XOwkz1YzITrQjy2GuBAe5wWImyg7k-g",
  authDomain: "quantum-coaching-7ccee.firebaseapp.com",
  projectId: "quantum-coaching-7ccee",
  storageBucket: "quantum-coaching-7ccee.firebasestorage.app",
  messagingSenderId: "332035700106",
  appId: "1:332035700106:web:138a5ede9c9cf794a58473",
  measurementId: "G-61M4KMD5S1"
};

const app = initializeApp(firebaseConfig);

// 🔐 Auth + Anonymous Sign In
const auth = getAuth(app);
const db = getFirestore(app);

const initAuth = async () => {
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

export { app, auth, db, initAuth };
