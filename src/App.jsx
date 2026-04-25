import { useState } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import LoadingScreen from "./components/LoadingScreen";
import FamiliarChat from "./components/FamiliarChat";
import Navbar from "./sections/Navbar";
import Hero from "./sections/Hero";
import Stats from "./sections/Stats";
import Skills from "./sections/Skills";
import Experience from "./sections/Experience";
import Projects from "./sections/Projects";
import Contact from "./sections/Contact";
import Footer from "./sections/Footer";

// --- Main App ---
export default function App() {
  const [gameStarted, setGameStarted] = useState(false);

  if (!gameStarted) {
    return (
      <ThemeProvider>
        <LoadingScreen onComplete={() => setGameStarted(true)} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <Navbar />
      <Hero />
      <Stats />
      <Skills />
      <Experience />
      <Projects />
      <Contact />
      <FamiliarChat />
      <Footer />
    </ThemeProvider>
  );
}
