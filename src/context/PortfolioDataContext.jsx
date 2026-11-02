import { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  fetchPortfolioData,
  subscribeToPortfolioData,
  savePortfolioData,
  seedFirestoreWithDefaults,
  resetToFactoryDefaults,
  getLocalCachedData,
  getDefaultData,
} from "../services/portfolioService";
import { isFirebaseConfigured, initFirebaseApp } from "../config/firebase";

const PortfolioDataContext = createContext(null);

export const PortfolioDataProvider = ({ children }) => {
  const [data, setData] = useState(() => getLocalCachedData());
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(() => isFirebaseConfigured());
  const [dataSource, setDataSource] = useState("local");

  // Initial load
  const loadInitialData = useCallback(async () => {
    setLoading(true);
    try {
      initFirebaseApp();
      const hasFirebase = isFirebaseConfigured();
      setIsLive(hasFirebase);

      const result = await fetchPortfolioData();
      if (result && result.data) {
        setData(result.data);
        setDataSource(result.source);
      }
    } catch (e) {
      console.warn("PortfolioDataProvider initial load warning:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();

    // Subscribe to real-time changes if Firestore is connected
    const unsubscribe = subscribeToPortfolioData(
      (updatedData) => {
        setData(updatedData);
        setDataSource("firestore-realtime");
        setIsLive(true);
      },
      (err) => {
        console.warn("Real-time listener warning:", err);
      }
    );

    return () => unsubscribe();
  }, [loadInitialData]);

  // Save changes
  const updateData = async (newData) => {
    setData(newData);
    const result = await savePortfolioData(newData);
    if (result.destination === "firestore") {
      setIsLive(true);
      setDataSource("firestore");
    }
    return result;
  };

  // Projects helpers
  const saveProjects = async (projects) => {
    const updated = { ...data, projects };
    return updateData(updated);
  };

  const addProject = async (project) => {
    const newId = project.id || (data.projects.length > 0 ? Math.max(...data.projects.map((p) => Number(p.id) || 0)) + 1 : 1);
    const newProject = { ...project, id: newId };
    const projects = [newProject, ...data.projects];
    await saveProjects(projects);
    return newProject;
  };

  const updateProject = async (updatedProject) => {
    const projects = data.projects.map((p) =>
      String(p.id) === String(updatedProject.id) ? updatedProject : p
    );
    return saveProjects(projects);
  };

  const deleteProject = async (id) => {
    const projects = data.projects.filter((p) => String(p.id) !== String(id));
    return saveProjects(projects);
  };

  // Jobs helpers
  const saveJobs = async (jobs) => {
    const updated = { ...data, jobs };
    return updateData(updated);
  };

  // Stats helpers
  const saveStats = async (stats) => {
    const updated = { ...data, stats };
    return updateData(updated);
  };

  // Profile helpers
  const saveProfile = async (profile) => {
    const updated = { ...data, profile };
    return updateData(updated);
  };

  // 1-Click seed
  const seedFirestore = async () => {
    const seeded = await seedFirestoreWithDefaults();
    setData(seeded);
    setIsLive(true);
    setDataSource("firestore");
    return seeded;
  };

  // Reset to original codebase defaults
  const resetDefaults = () => {
    const defaults = resetToFactoryDefaults();
    setData(defaults);
    setDataSource("local");
    return defaults;
  };

  const refresh = () => loadInitialData();

  const value = {
    projects: data.projects || [],
    jobs: data.jobs || [],
    stats: data.stats || [],
    profile: data.profile || {},
    allData: data,
    loading,
    isLive,
    dataSource,
    updateData,
    saveProjects,
    addProject,
    updateProject,
    deleteProject,
    saveJobs,
    saveStats,
    saveProfile,
    seedFirestore,
    resetDefaults,
    refresh,
  };

  return (
    <PortfolioDataContext.Provider value={value}>
      {children}
    </PortfolioDataContext.Provider>
  );
};

export const usePortfolioData = () => {
  const context = useContext(PortfolioDataContext);
  if (!context) {
    throw new Error("usePortfolioData must be used within a PortfolioDataProvider");
  }
  return context;
};
