import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyCteKlhWbSSKfUu4QfcKic70MISnLbHSnU",
  authDomain: "ai-interview-457d1.firebaseapp.com",
  projectId: "ai-interview-457d1",
  storageBucket: "ai-interview-457d1.firebasestorage.app",
  messagingSenderId: "715798389874",
  appId: "1:715798389874:web:1376fdc5bd4d6a8feb0eeb",
  measurementId: "G-Y3ZYMPQYGL",
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
