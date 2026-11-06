// --- Firebase Firestore Client Configuration ---
// Connects to Google Cloud Firestore (Free Spark Plan)
// Allows dynamic updates to portfolio projects, stats, and jobs without code redeploys.

import { initializeApp, getApps, getApp, deleteApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

const STORAGE_KEY = "portfolio_firebase_config";

export const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyBS2JXKgKO-a6B3g0qysvv1tAQSg8OX3As",
  authDomain: "portfolio-data-6388b.firebaseapp.com",
  projectId: "portfolio-data-6388b",
  storageBucket: "portfolio-data-6388b.firebasestorage.app",
  messagingSenderId: "352851077107",
  appId: "1:352851077107:web:81ebb7b1d679607fbb1486",
  measurementId: "G-XYQG0WGVL5",
};

// Read from localStorage first (set via Admin Dashboard), Vite env variables, or default project config
export const getStoredFirebaseConfig = () => {
  try {
    const local = localStorage.getItem(STORAGE_KEY);
    if (local) {
      const parsed = JSON.parse(local);
      if (parsed.projectId && parsed.apiKey) return parsed;
    }
  } catch (e) {
    console.warn("Failed to read stored Firebase config:", e);
  }

  // Fallback to Vite env variables if defined
  if (import.meta.env?.VITE_FIREBASE_PROJECT_ID && import.meta.env?.VITE_FIREBASE_API_KEY) {
    return {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
      appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
      measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "",
    };
  }

  return DEFAULT_FIREBASE_CONFIG;
};

let firebaseApp = null;
let firestoreDb = null;

export const resetFirebaseApp = async (configOverride) => {
  try {
    const apps = getApps();
    for (const app of apps) {
      try {
        await deleteApp(app);
      } catch (err) {
        console.warn("Error deleting Firebase app:", err);
      }
    }
  } catch (e) {
    console.warn("Could not clean existing Firebase apps:", e);
  }
  firebaseApp = null;
  firestoreDb = null;
  return initFirebaseApp(configOverride);
};

export const saveFirebaseConfig = async (config) => {
  try {
    if (!config) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    }
    return await resetFirebaseApp(config);
  } catch (e) {
    console.error("Error saving Firebase config:", e);
    throw e;
  }
};

export const initFirebaseApp = (configOverride) => {
  const config = configOverride || getStoredFirebaseConfig();
  if (!config || !config.apiKey || !config.projectId) {
    firestoreDb = null;
    return null;
  }

  try {
    if (getApps().length > 0) {
      firebaseApp = getApp();
    } else {
      firebaseApp = initializeApp(config);
    }
    firestoreDb = getFirestore(firebaseApp);
    return firestoreDb;
  } catch (e) {
    console.error("Error initializing Firebase:", e);
    firestoreDb = null;
    return null;
  }
};

export const getDb = () => {
  if (!firestoreDb) {
    initFirebaseApp();
  }
  return firestoreDb;
};

export const isFirebaseConfigured = () => {
  const config = getStoredFirebaseConfig();
  return Boolean(config && config.apiKey && config.projectId);
};

export const testFirestoreConnection = async (testConfig) => {
  let testApp = null;
  try {
    testApp = initializeApp(testConfig, "test-instance-" + Date.now());
    const testDb = getFirestore(testApp);
    const testRef = doc(testDb, "portfolio", "health_check");
    await setDoc(testRef, { timestamp: Date.now(), status: "ok" }, { merge: true });
    const snap = await getDoc(testRef);
    return snap.exists();
  } catch (err) {
    console.error("Firebase connection test failed:", err);
    throw err;
  } finally {
    if (testApp) {
      try {
        await deleteApp(testApp);
      } catch (_) {}
    }
  }
};
