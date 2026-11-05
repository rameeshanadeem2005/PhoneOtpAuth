import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// Import compat layers to satisfy any legacy app-compat checks
import 'firebase/compat/app';
import firebase from 'firebase/compat/app';

const firebaseConfig = {
  apiKey: "AIzaSyBn54S_rfdXuKGjBves9Ba0O9iJge8N2d0",
  authDomain: "expo-otp-auth-134fc.firebaseapp.com",
  projectId: "expo-otp-auth-134fc",
  storageBucket: "expo-otp-auth-134fc.firebasestorage.app",
  messagingSenderId: "678821808797",
  appId: "1:678821808797:web:10e6f2cc908f7429eb2274"
};

// 1. Initialize modern modular Firebase app
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// 2. Initialize legacy compat Firebase app (fixes app-compat/no-app error)
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = getAuth(app);