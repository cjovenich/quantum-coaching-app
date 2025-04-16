// app/sync.ts
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { initAuth, db } from './firebase';

const encoder = new TextEncoder();
const decoder = new TextDecoder();

// Derive a secure encryption key using PBKDF2
async function deriveEncryptionKey(password: string, salt: string): Promise<CryptoKey> {
  const baseKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encoder.encode(salt),
      iterations: 200000,
      hash: 'SHA-256',
    },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
}

// Encrypt data before saving
async function encryptData(data: any, key: CryptoKey): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = encoder.encode(JSON.stringify(data));
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoded);
  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(encrypted), iv.length);
  return Buffer.from(combined).toString('base64');
}

// Decrypt data after loading
async function decryptData(base64: string, key: CryptoKey): Promise<any> {
  const combined = Buffer.from(base64, 'base64');
  const iv = combined.slice(0, 12);
  const data = combined.slice(12);
  const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data);
  const decoded = decoder.decode(decrypted);
  return JSON.parse(decoded);
}

// Default structure
export type SyncData = {
  habits: string[];
  habit_streaks: Record<string, number>;
  completed_today: Record<string, boolean>;
  calendar_log: Record<string, string[]>;
  unlocked_badges: string[];
};

const defaultData: SyncData = {
  habits: [],
  habit_streaks: {},
  completed_today: {},
  calendar_log: {},
  unlocked_badges: []
};

// 🔐 Replace with real user-provided secret or something consistent
const SECRET_PASSWORD = 'QuantumSuperSecret';
const SALT = 'QuantumSaltKey';

// 🚀 Fetch data from Firestore, decrypt, and return
export const fetchUserData = async (): Promise<SyncData> => {
  const user = await initAuth();
  const ref = doc(db, 'users', user.uid);
  const snapshot = await getDoc(ref);

  const key = await deriveEncryptionKey(SECRET_PASSWORD, SALT);

  if (snapshot.exists()) {
    const encrypted = snapshot.data().payload;
    if (typeof encrypted === 'string') {
      return await decryptData(encrypted, key);
    }
  }

  await saveUserData(defaultData); // first-time setup
  return defaultData;
};

// 🚀 Save encrypted user data to Firestore
export const saveUserData = async (data: SyncData): Promise<void> => {
  const user = await initAuth();
  const ref = doc(db, 'users', user.uid);
  const key = await deriveEncryptionKey(SECRET_PASSWORD, SALT);
  const encrypted = await encryptData(data, key);
  await setDoc(ref, { payload: encrypted });
};

// sync.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export const fetchUserData = async () => {
  const raw = await AsyncStorage.getItem('userData');
  return raw ? JSON.parse(raw) : {};
};

export const saveUserData = async (data: any) => {
  await AsyncStorage.setItem('userData', JSON.stringify(data));
};

export const saveEmotion = async (date: string, mood: string) => {
  const key = `emotion:${date}`;
  await AsyncStorage.setItem(key, mood);
};

export const getEmotionHistory = async (): Promise<Record<string, string>> => {
  const keys = await AsyncStorage.getAllKeys();
  const emotionKeys = keys.filter((k) => k.startsWith('emotion:'));
  const entries = await AsyncStorage.multiGet(emotionKeys);
  const data = Object.fromEntries(entries.map(([k, v]) => [k.split(':')[1], v]));
  return data;
};
