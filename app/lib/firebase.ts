import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCCbG5bV_b4fFB32y-rlys5-26Wh2f2x7w",
  authDomain: "eve-clinic-76c0a.firebaseapp.com",
  projectId: "eve-clinic-76c0a",
  storageBucket: "eve-clinic-76c0a.firebasestorage.app",
  messagingSenderId: "328811917034",
  appId: "1:328811917034:web:3e9aa4bd9cd81c65b57193",
  measurementId: "G-9RP6C71ND0",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
