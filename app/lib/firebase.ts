import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

/**
 * FIREBASE CONFIGURATION
 * 
 * IMPORTANT: Replace these placeholder values with your actual Firebase config!
 * 
 * How to get your Firebase config:
 * 1. Go to https://console.firebase.google.com
 * 2. Click the gear icon (⚙️) → Project settings
 * 3. Scroll down to "Your apps" section
 * 4. Click the "</>" (Web) icon
 * 5. Copy the config values and paste them below
 * 
 * For ahmadelkholii@gmail.com:
 * - Create a project named "eve-clinic"
 * - Enable Firestore Database
 * - Get your config from Project Settings
 */

const firebaseConfig = {
  // TODO: Replace with your actual Firebase config values
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'YOUR_API_KEY_HERE',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'YOUR_PROJECT_ID.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'YOUR_PROJECT_ID',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'YOUR_PROJECT_ID.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || 'YOUR_MESSAGING_SENDER_ID',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || 'YOUR_APP_ID',
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
