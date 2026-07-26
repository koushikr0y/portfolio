import { useState, useEffect } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import LoadingScreen from "./components/LoadingScreen";
import CustomCursor from "./components/CustomCursor";
import ArcadeGameModal from "./components/ArcadeGameModal";
// import FamiliarChat from "./components/FamiliarChat";
import Navbar from "./sections/Navbar";
import Hero from "./sections/Hero";
import Stats from "./sections/Stats";
import Skills from "./sections/Skills";
import Experience from "./sections/Experience";
import Projects from "./sections/Projects";
import Contact from "./sections/Contact";
import Footer from "./sections/Footer";
import ProjectDetailView from "./components/ProjectDetailView";
import { ALL_PROJECTS } from "./data/portfolioData";

// --- Main App ---
export default function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showArcade, setShowArcade] = useState(false);

  // Browser / Mobile back button & hash navigation handler
  useEffect(() => {
    if (!gameStarted) return;

    const checkHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith("#project-")) {
        const projId = hash.replace("#project-", "");
        const found = ALL_PROJECTS.find((p) => p.id === projId);
        if (found) {
          setSelectedProject(found);
          return;
        }
      }
      // If back button pressed or hash cleared, close subpage view
      setSelectedProject(null);
    };

    checkHash();
    window.addEventListener("hashchange", checkHash);
    window.addEventListener("popstate", checkHash);
    return () => {
      window.removeEventListener("hashchange", checkHash);
      window.removeEventListener("popstate", checkHash);
    };
  }, [gameStarted]);

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
      <Navbar onOpenArcade={() => setShowArcade(true)} />
      
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
          <Hero onOpenArcade={() => setShowArcade(true)} />
          <Stats />
          <Skills />
          <Experience />
          <Projects onSelectProject={handleSelectProject} />
          <Contact />
          {/* <FamiliarChat /> */}
          <Footer />
        </>
      )}
    </ThemeProvider>
  );
}
