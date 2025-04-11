// app/sync.ts
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { initAuth, db } from './firebase';

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

// ✅ Fetch data from Firestore for the current user
export const fetchUserData = async (): Promise<SyncData> => {
  const user = await initAuth();
  const docRef = doc(db, 'users', user.uid);
  const snapshot = await getDoc(docRef);

  if (snapshot.exists()) {
    return snapshot.data() as SyncData;
  } else {
    await setDoc(docRef, defaultData);
    return defaultData;
  }
};

// ✅ Save updated data to Firestore
export const saveUserData = async (data: SyncData) => {
  const user = await initAuth();
  const docRef = doc(db, 'users', user.uid);
  await setDoc(docRef, data);
};
