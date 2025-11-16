import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBwE48Y7zTPCzKUpv1UX2OAHlqeMZFqkiE",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "mentor-bridge-1e158.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "mentor-bridge-1e158",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "mentor-bridge-1e158.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "666720829430",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:666720829430:web:71d48c9777e5cd83ca51d7",
  measurementId: "G-RLNXWKJP8Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;

