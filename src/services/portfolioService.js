// --- Portfolio Data Service ---
// Handles synchronization between Firebase Firestore, local cache, and code defaults.
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { getDb, isFirebaseConfigured } from "../config/firebase";
import { ALL_PROJECTS, JOBS, STATS, PORTFOLIO_DATA } from "../data/portfolioData";

const FIRESTORE_DOC_PATH = ["portfolio", "content"];
const LOCAL_CACHE_KEY = "portfolio_local_data_v1";

// Default initial state
export const getDefaultData = () => ({
  projects: ALL_PROJECTS,
  jobs: JOBS,
  stats: STATS,
  profile: PORTFOLIO_DATA,
  lastUpdated: new Date().toISOString(),
});

// Load cached data from localStorage or fallback to defaults
export const getLocalCachedData = () => {
  try {
    const raw = localStorage.getItem(LOCAL_CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.projects && Array.isArray(parsed.projects)) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Failed to load local cache:", e);
  }
  return getDefaultData();
};

export const saveToLocalCache = (data) => {
  try {
    localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn("Failed to save local cache:", e);
  }
};

// Fetch current portfolio data
export const fetchPortfolioData = async () => {
  const db = getDb();
  if (db && isFirebaseConfigured()) {
    try {
      const ref = doc(db, ...FIRESTORE_DOC_PATH);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        saveToLocalCache(data);
        return { data, source: "firestore" };
      } else {
        // Document doesn't exist yet, seed with defaults
        const initial = getLocalCachedData();
        await setDoc(ref, initial);
        return { data: initial, source: "firestore-seeded" };
      }
    } catch (err) {
      console.warn("Firestore fetch error, falling back to local cache:", err);
    }
  }

  return { data: getLocalCachedData(), source: "local" };
};

// Subscribe to real-time updates from Firestore
export const subscribeToPortfolioData = (onDataUpdate, onError) => {
  const db = getDb();
  if (!db || !isFirebaseConfigured()) {
    return () => {};
  }

  try {
    const ref = doc(db, ...FIRESTORE_DOC_PATH);
    const unsubscribe = onSnapshot(
      ref,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          saveToLocalCache(data);
          onDataUpdate(data);
        }
      },
      (err) => {
        console.warn("Firestore subscription error:", err);
        if (onError) onError(err);
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn("Failed to subscribe to Firestore:", err);
    return () => {};
  }
};

// Save updated portfolio data to Firestore (and update local cache)
export const savePortfolioData = async (data) => {
  const payload = {
    ...data,
    lastUpdated: new Date().toISOString(),
  };

  // Always update local cache immediately for zero-lag UI response
  saveToLocalCache(payload);

  const db = getDb();
  if (db && isFirebaseConfigured()) {
    const ref = doc(db, ...FIRESTORE_DOC_PATH);
    await setDoc(ref, payload, { merge: true });
    return { success: true, destination: "firestore" };
  }

  return { success: true, destination: "local" };
};

// Seed Firestore with the codebase defaults with 1 click
export const seedFirestoreWithDefaults = async () => {
  const defaults = getDefaultData();
  const db = getDb();
  if (!db || !isFirebaseConfigured()) {
    throw new Error("Firebase Firestore is not configured yet. Please configure your Firebase keys first.");
  }

  const ref = doc(db, ...FIRESTORE_DOC_PATH);
  await setDoc(ref, defaults);
  saveToLocalCache(defaults);
  return defaults;
};

// Reset to factory defaults
export const resetToFactoryDefaults = () => {
  localStorage.removeItem(LOCAL_CACHE_KEY);
  return getDefaultData();
};
