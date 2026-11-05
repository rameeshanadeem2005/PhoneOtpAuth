import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// Import compat layers to satisfy any legacy app-compat checks
import 'firebase/compat/app';
import firebase from 'firebase/compat/app';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

// 1. Initialize modern modular Firebase app
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// 2. Initialize legacy compat Firebase app (fixes app-compat/no-app error)
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = getAuth(app);