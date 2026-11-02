import { useState, useEffect } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { PortfolioDataProvider, usePortfolioData } from "./context/PortfolioDataContext";
import LoadingScreen from "./components/LoadingScreen";
import CustomCursor from "./components/CustomCursor";
import ArcadeGameModal from "./components/ArcadeGameModal";
import AdminModal from "./components/Admin/AdminModal";
import Navbar from "./sections/Navbar";
import Hero from "./sections/Hero";
import Stats from "./sections/Stats";
import Skills from "./sections/Skills";
import Experience from "./sections/Experience";
import Projects from "./sections/Projects";
import Contact from "./sections/Contact";
import Footer from "./sections/Footer";
import ProjectDetailView from "./components/ProjectDetailView";

// --- Main App Content ---
function PortfolioAppContent() {
  const { projects } = usePortfolioData();
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showArcade, setShowArcade] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  // Check URL hash for #admin or #project-<id>
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash === "#admin") {
        setShowAdmin(true);
        return;
      }

      if (hash.startsWith("#project-")) {
        const projId = hash.replace("#project-", "");
        const found = projects.find((p) => String(p.id) === String(projId));
        if (found) {
          setSelectedProject(found);
          return;
        }
      }

      // If hash cleared or not a project hash
      if (!hash.startsWith("#project-")) {
        setSelectedProject(null);
      }
    };

    handleHash();
    window.addEventListener("hashchange", handleHash);
    window.addEventListener("popstate", handleHash);
    return () => {
      window.removeEventListener("hashchange", handleHash);
      window.removeEventListener("popstate", handleHash);
    };
  }, [projects]);

  // Keyboard shortcut: Ctrl+Shift+A (or Cmd+Shift+A) to open Admin CMS
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "A" || e.key === "a")) {
        e.preventDefault();
        setShowAdmin((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSelectProject = (project) => {
    window.location.hash = `project-${project.id}`;
    setSelectedProject(project);
  };

  const handleBackToMain = () => {
    if (window.location.hash.startsWith("#project-")) {
      window.history.back();
    } else {
      setSelectedProject(null);
    }
    setTimeout(() => {
      document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleCloseAdmin = () => {
    setShowAdmin(false);
    if (window.location.hash === "#admin") {
      window.history.replaceState(null, "", window.location.pathname);
    }
  };

  if (!gameStarted) {
    return (
      <ThemeProvider>
        <CustomCursor />
        <LoadingScreen onComplete={() => setGameStarted(true)} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <CustomCursor />

      {/* Secret Admin CMS Modal */}
      <AdminModal isOpen={showAdmin} onClose={handleCloseAdmin} />

      {showArcade && (
        <ArcadeGameModal onClose={() => setShowArcade(false)} />
      )}

      {selectedProject ? (
        <ProjectDetailView
          project={selectedProject}
          onSelectProject={handleSelectProject}
          onBack={handleBackToMain}
        />
      ) : (
        <>
          <Navbar onOpenArcade={() => setShowArcade(true)} />
          <Hero onOpenArcade={() => setShowArcade(true)} />
          <Stats />
          <Projects onSelectProject={handleSelectProject} />
          <Skills />
          <Experience />
          <Contact />
          <Footer onOpenAdmin={() => setShowAdmin(true)} />
        </>
      )}
    </ThemeProvider>
  );
}

// --- App Root Provider ---
export default function App() {
  return (
    <PortfolioDataProvider>
      <PortfolioAppContent />
    </PortfolioDataProvider>
  );
}
