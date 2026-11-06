// --- Portfolio Data Service ---
// Handles synchronization between Firebase Firestore, local cache, and code defaults.
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { getDb, isFirebaseConfigured } from "../config/firebase";
import {
  ALL_PROJECTS,
  JOBS,
  STATS,
  DEFAULT_PROFILE,
  DEFAULT_SKILLS,
} from "../data/portfolioData";

const FIRESTORE_DOC_PATH = ["portfolio", "content"];
const LOCAL_CACHE_KEY = "portfolio_local_data_v1";

// Safely sanitize data for Firestore (Firestore throws errors on `undefined` values)
export const sanitizeForFirestore = (obj) => {
  return JSON.parse(
    JSON.stringify(obj, (key, value) => (value === undefined ? null : value))
  );
};

// Default initial state
export const getDefaultData = () => ({
  projects: ALL_PROJECTS,
  jobs: JOBS,
  stats: STATS,
  profile: DEFAULT_PROFILE,
  skills: DEFAULT_SKILLS,
  lastUpdated: new Date().toISOString(),
});

// Merges partial or loaded data with code defaults to guarantee structure
export const mergeWithDefaults = (data) => {
  const defaults = getDefaultData();
  if (!data || typeof data !== "object") return defaults;

  return {
    ...defaults,
    ...data,
    projects:
      Array.isArray(data.projects) && data.projects.length > 0
        ? data.projects
        : defaults.projects,
    jobs:
      Array.isArray(data.jobs) && data.jobs.length > 0
        ? data.jobs
        : defaults.jobs,
    stats:
      Array.isArray(data.stats) && data.stats.length > 0
        ? data.stats
        : defaults.stats,
    skills:
      Array.isArray(data.skills) && data.skills.length > 0
        ? data.skills
        : defaults.skills,
    profile: {
      ...defaults.profile,
      ...(data.profile && typeof data.profile === "object" ? data.profile : {}),
    },
    lastUpdated: data.lastUpdated || defaults.lastUpdated,
  };
};

// Load cached data from localStorage or fallback to defaults
export const getLocalCachedData = () => {
  try {
    const raw = localStorage.getItem(LOCAL_CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return mergeWithDefaults(parsed);
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
        const data = mergeWithDefaults(snap.data());
        saveToLocalCache(data);
        return { data, source: "firestore" };
      } else {
        // Document doesn't exist yet, seed with initial defaults
        const initial = getLocalCachedData();
        await setDoc(ref, sanitizeForFirestore(initial));
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
          const data = mergeWithDefaults(snap.data());
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
    try {
      const ref = doc(db, ...FIRESTORE_DOC_PATH);
      const sanitized = sanitizeForFirestore(payload);
      await setDoc(ref, sanitized, { merge: true });
      return { success: true, destination: "firestore" };
    } catch (err) {
      console.error("Firestore save failed:", err);
      return { success: false, destination: "local", error: err.message };
    }
  }

  return { success: true, destination: "local" };
};

// Seed Firestore with the given data (or codebase defaults)
export const seedFirestoreWithDefaults = async (customData) => {
  const dataToSeed = customData ? mergeWithDefaults(customData) : getDefaultData();
  const db = getDb();
  if (!db || !isFirebaseConfigured()) {
    throw new Error(
      "Firebase Firestore is not configured yet. Please configure your Firebase keys first."
    );
  }

  const ref = doc(db, ...FIRESTORE_DOC_PATH);
  const sanitized = sanitizeForFirestore(dataToSeed);
  await setDoc(ref, sanitized);
  saveToLocalCache(dataToSeed);
  return dataToSeed;
};

// Reset to factory defaults
export const resetToFactoryDefaults = () => {
  localStorage.removeItem(LOCAL_CACHE_KEY);
  return getDefaultData();
};
