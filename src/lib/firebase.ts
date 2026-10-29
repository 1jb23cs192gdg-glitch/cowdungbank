import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import defaultConfig from '../../firebase-applet-config.json';

// Resolves Firebase credentials with fallback to firebase-applet-config.json
// This ensures that when deployed to Vercel, Firebase Firestore and Auth work
// automatically out-of-the-box or via Vercel Project Environment Variables.
const resolvedConfig = {
  projectId: (import.meta as any).env?.VITE_FIREBASE_PROJECT_ID || defaultConfig.projectId,
  appId: (import.meta as any).env?.VITE_FIREBASE_APP_ID || defaultConfig.appId,
  apiKey: (import.meta as any).env?.VITE_FIREBASE_API_KEY || defaultConfig.apiKey,
  authDomain: (import.meta as any).env?.VITE_FIREBASE_AUTH_DOMAIN || defaultConfig.authDomain,
  firestoreDatabaseId: (import.meta as any).env?.VITE_FIREBASE_DATABASE_ID || defaultConfig.firestoreDatabaseId,
  storageBucket: (import.meta as any).env?.VITE_FIREBASE_STORAGE_BUCKET || defaultConfig.storageBucket,
  messagingSenderId: (import.meta as any).env?.VITE_FIREBASE_MESSAGING_SENDER_ID || defaultConfig.messagingSenderId,
  measurementId: (import.meta as any).env?.VITE_FIREBASE_MEASUREMENT_ID || defaultConfig.measurementId || '',
};

// Initialize Firebase App
export const app = initializeApp(resolvedConfig);

// CRITICAL: Initialize Firestore with the exact firestoreDatabaseId from configuration
export const db = getFirestore(app, resolvedConfig.firestoreDatabaseId);

// Export Auth & Google Auth Provider
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Validate connection to Firestore on initialization
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline or connecting...');
    }
  }
}

testConnection();

export default db;
