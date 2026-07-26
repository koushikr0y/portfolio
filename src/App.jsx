import { useState, useEffect } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import LoadingScreen from "./components/LoadingScreen";
import CustomCursor from "./components/CustomCursor";
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

  // Deep-linking hash handler
  useEffect(() => {
    if (!gameStarted) return;
    const checkHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith("#project-")) {
        const projId = hash.replace("#project-", "");
        const found = ALL_PROJECTS.find((p) => p.id === projId);
        if (found) setSelectedProject(found);
      }
    };
    checkHash();
    window.addEventListener("hashchange", checkHash);
    return () => window.removeEventListener("hashchange", checkHash);
  }, [gameStarted]);

  const handleSelectProject = (project) => {
    window.location.hash = `project-${project.id}`;
    setSelectedProject(project);
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
      <Navbar />
      {selectedProject ? (
        <ProjectDetailView
          project={selectedProject}
          onSelectProject={handleSelectProject}
          onBack={() => {
            if (window.location.hash.startsWith("#project-")) {
              window.history.replaceState(null, "", window.location.pathname);
            }
            setSelectedProject(null);
            setTimeout(() => {
              document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
            }, 100);
          }}
        />
      ) : (
        <>
          <Hero />
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
