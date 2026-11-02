import { useState, useEffect } from "react";
import {
  X, Lock, Shield, KeyRound, Database, Plus, Trash2, Edit3,
  CheckCircle2, AlertCircle, ArrowUp, ArrowDown, ExternalLink,
  Sparkles, RefreshCw, Download, Upload, Copy, Eye, Star,
  Smartphone, Apple, Globe, Gamepad2, Github, Briefcase, Award,
  Sliders, Save, LogOut
} from "lucide-react";
import { usePortfolioData } from "../../context/PortfolioDataContext";
import { useTheme } from "../../context/ThemeContext";
import { COLORS } from "../../config/theme";
import {
  getStoredFirebaseConfig,
  saveFirebaseConfig,
  testFirestoreConnection,
  isFirebaseConfigured,
} from "../../config/firebase";

const PIN_STORAGE_KEY = "portfolio_admin_pin";
const DEFAULT_PIN = "2026";

export default function AdminModal({ isOpen, onClose }) {
  const { currentTheme } = useTheme();
  const {
    projects,
    jobs,
    stats,
    profile,
    allData,
    isLive,
    dataSource,
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
  } = usePortfolioData();

  // PIN Auth state
  const [pinInput, setPinInput] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinError, setPinError] = useState("");
  const [currentPin, setCurrentPin] = useState(() => {
    return localStorage.getItem(PIN_STORAGE_KEY) || DEFAULT_PIN;
  });

  // Active Tab: "projects" | "experience" | "stats" | "database"
  const [activeTab, setActiveTab] = useState("projects");

  // Project Editor State
  const [editingProject, setEditingProject] = useState(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Experience Editor State
  const [editingJob, setEditingJob] = useState(null);
  const [isCreatingJob, setIsCreatingJob] = useState(false);

  // Firebase Config State
  const [firebaseConfig, setFirebaseConfig] = useState(() => {
    return (
      getStoredFirebaseConfig() || {
        apiKey: "",
        authDomain: "",
        projectId: "",
        storageBucket: "",
        messagingSenderId: "",
        appId: "",
      }
    );
  });
  const [testStatus, setTestStatus] = useState(null); // null | "testing" | "success" | "error"
  const [testMessage, setTestMessage] = useState("");
  const [saveStatus, setSaveStatus] = useState("");

  // PIN settings state
  const [newPin, setNewPin] = useState("");
  const [pinChangeMsg, setPinChangeMsg] = useState("");

  useEffect(() => {
    if (!isOpen) {
      // Reset input when closing
      setPinInput("");
      setPinError("");
    }
  }, [isOpen]);

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pinInput.trim() === currentPin) {
      setIsAuthenticated(true);
      setPinError("");
    } else {
      setPinError("Incorrect PIN. Please try again.");
    }
  };

  const handlePinChange = (e) => {
    e.preventDefault();
    if (newPin.trim().length < 4) {
      setPinChangeMsg("PIN must be at least 4 digits.");
      return;
    }
    localStorage.setItem(PIN_STORAGE_KEY, newPin.trim());
    setCurrentPin(newPin.trim());
    setNewPin("");
    setPinChangeMsg("Admin PIN updated successfully!");
    setTimeout(() => setPinChangeMsg(""), 3000);
  };

  // Reorder projects
  const handleMoveProject = (index, direction) => {
    const newIdx = index + direction;
    if (newIdx < 0 || newIdx >= projects.length) return;
    const reordered = [...projects];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(newIdx, 0, moved);
    saveProjects(reordered);
  };

  // Save project form
  const handleSaveProjectForm = async (e) => {
    e.preventDefault();
    if (!editingProject) return;

    if (isCreatingNew) {
      await addProject(editingProject);
    } else {
      await updateProject(editingProject);
    }
    setEditingProject(null);
    setIsCreatingNew(false);
  };

  // Save Firebase config
  const handleSaveFirebase = async () => {
    try {
      setSaveStatus("Connecting...");
      saveFirebaseConfig(firebaseConfig);
      await refresh();
      setSaveStatus("Connected successfully!");
      setTimeout(() => setSaveStatus(""), 3000);
    } catch (err) {
      setSaveStatus("Error saving config: " + err.message);
    }
  };

  const handleTestConnection = async () => {
    setTestStatus("testing");
    setTestMessage("Testing connection to Firestore...");
    try {
      await testFirestoreConnection(firebaseConfig);
      setTestStatus("success");
      setTestMessage("Connection successful! Firestore is active and ready.");
    } catch (err) {
      setTestStatus("error");
      setTestMessage("Connection failed: " + (err.message || String(err)));
    }
  };

  const handleSeedNow = async () => {
    if (!window.confirm("Seed Firestore with your current portfolio data? This will save all projects to the cloud database.")) return;
    try {
      setSaveStatus("Seeding Firestore...");
      await seedFirestore();
      setSaveStatus("Firestore seeded with current data!");
      setTimeout(() => setSaveStatus(""), 3000);
    } catch (err) {
      alert("Seeding failed: " + err.message);
      setSaveStatus("");
    }
  };

  // Export JSON backup
  const handleExportBackup = () => {
    const jsonStr = JSON.stringify(allData, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `portfolio-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON backup
  const handleImportBackup = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const parsed = JSON.parse(evt.target.result);
        if (parsed.projects && Array.isArray(parsed.projects)) {
          if (window.confirm("Replace current portfolio data with this backup?")) {
            await saveProjects(parsed.projects);
            if (parsed.jobs) await saveJobs(parsed.jobs);
            if (parsed.stats) await saveStats(parsed.stats);
            if (parsed.profile) await saveProfile(parsed.profile);
            alert("Backup imported successfully!");
          }
        } else {
          alert("Invalid backup file format.");
        }
      } catch (err) {
        alert("Failed to parse JSON file: " + err.message);
      }
    };
    reader.readAsText(file);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div
        className={`relative w-full max-w-5xl my-auto ${currentTheme.cardBg} border-[3px] border-dashed ${COLORS.orange.border} rounded-2xl shadow-[10px_10px_0px_0px_#1A1A1A] overflow-hidden flex flex-col max-h-[92vh]`}
      >
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b-2 border-dashed border-gray-700/30 flex items-center justify-between bg-black/20">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#FF9F1C] text-black border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A]">
              <Shield size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className={`text-lg sm:text-xl font-black ${currentTheme.text} uppercase tracking-tight`}>
                  Quest Master Dashboard
                </h2>
                {isAuthenticated && (
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-black uppercase flex items-center gap-1 ${
                      isLive
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                        : "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${isLive ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
                    {isLive ? "Firestore Live Cloud" : "Local Storage"}
                  </span>
                )}
              </div>
              <p className={`text-xs ${currentTheme.textMuted} font-medium`}>
                Private CMS to manage portfolio data without code edits or git pushes
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 transition-all cursor-pointer"
            title="Close Dashboard"
          >
            <X size={18} className={currentTheme.text} />
          </button>
        </div>

        {/* Auth Gate (PIN protection) */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-14 flex flex-col items-center justify-center text-center my-auto">
            <div className="w-16 h-16 rounded-2xl bg-[#FF9F1C]/15 border-2 border-dashed border-[#FF9F1C] flex items-center justify-center mb-4 text-[#FF9F1C]">
              <Lock size={32} />
            </div>
            <h3 className={`text-2xl font-black ${currentTheme.text} uppercase tracking-tight mb-2`}>
              Protected Access
            </h3>
            <p className={`text-sm ${currentTheme.textMuted} max-w-sm mb-6`}>
              Enter your Admin Secret PIN to manage projects, character stats, and live database sync.
            </p>

            <form onSubmit={handlePinSubmit} className="w-full max-w-xs space-y-4">
              <div>
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="Enter Secret PIN"
                  className={`w-full px-4 py-3 rounded-xl text-center text-xl tracking-widest font-black border-2 border-[#1A1A1A] ${currentTheme.inputBg} ${currentTheme.text} shadow-[3px_3px_0px_0px_#1A1A1A] focus:outline-none`}
                  autoFocus
                />
                {pinError && (
                  <p className="text-rose-400 text-xs font-bold mt-2 flex items-center justify-center gap-1">
                    <AlertCircle size={14} /> {pinError}
                  </p>
                )}
                <p className="text-[11px] text-gray-500 mt-2">
                  Default initial PIN: <code className="bg-white/10 px-1.5 py-0.5 rounded text-orange-400 font-mono">2026</code>
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-black uppercase text-xs tracking-wider bg-[#2EC4B6] hover:bg-[#20ab9d] text-black border-2 border-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#1A1A1A] transition-all cursor-pointer"
              >
                Unlock Dashboard
              </button>
            </form>
          </div>
        ) : (
          /* Dashboard Content */
          <div className="flex-1 overflow-y-auto flex flex-col">
            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 px-4 sm:px-6 py-3 border-b border-gray-700/20 bg-black/10 overflow-x-auto">
              <button
                onClick={() => { setActiveTab("projects"); setEditingProject(null); }}
                className={`px-4 py-2 rounded-xl font-bold uppercase text-xs tracking-wider transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  activeTab === "projects"
                    ? "bg-[#FF9F1C] text-black shadow-[3px_3px_0px_0px_#1A1A1A] -translate-y-0.5 border-2 border-[#1A1A1A]"
                    : `${currentTheme.cardBg} ${currentTheme.text} hover:bg-white/10`
                }`}
              >
                <Gamepad2 size={14} /> Quests & Projects ({projects.length})
              </button>
              <button
                onClick={() => { setActiveTab("experience"); setEditingJob(null); }}
                className={`px-4 py-2 rounded-xl font-bold uppercase text-xs tracking-wider transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  activeTab === "experience"
                    ? "bg-[#9B5DE5] text-white shadow-[3px_3px_0px_0px_#1A1A1A] -translate-y-0.5 border-2 border-[#1A1A1A]"
                    : `${currentTheme.cardBg} ${currentTheme.text} hover:bg-white/10`
                }`}
              >
                <Briefcase size={14} /> Experience ({jobs.length})
              </button>
              <button
                onClick={() => setActiveTab("database")}
                className={`px-4 py-2 rounded-xl font-bold uppercase text-xs tracking-wider transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  activeTab === "database"
                    ? "bg-[#2EC4B6] text-black shadow-[3px_3px_0px_0px_#1A1A1A] -translate-y-0.5 border-2 border-[#1A1A1A]"
                    : `${currentTheme.cardBg} ${currentTheme.text} hover:bg-white/10`
                }`}
              >
                <Database size={14} /> Cloud Database & Settings
              </button>
            </div>

            {/* TAB: PROJECTS */}
            {activeTab === "projects" && (
              <div className="p-4 sm:p-6 space-y-6">
                {!editingProject ? (
                  <>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h3 className={`text-xl font-black ${currentTheme.text} uppercase tracking-tight`}>
                          Projects & Games Showcase
                        </h3>
                        <p className={`text-xs ${currentTheme.textMuted}`}>
                          Add, edit, or reorder the game cards that appear on your portfolio.
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setIsCreatingNew(true);
                          setEditingProject({
                            title: "",
                            desc: "",
                            tags: ["Unity"],
                            rarity: "EPIC",
                            rating: "4.8",
                            color: "orange",
                            thumbnailImage: "",
                            cardGradient: "linear-gradient(135deg, #FF9F1C 0%, #1A1A1A 100%)",
                            youtubeId: "",
                            previewImages: [],
                            androidUrl: "",
                            iosUrl: "",
                            webUrl: "",
                            steamUrl: "",
                            githubUrl: "",
                            itchUrl: "",
                            challenges: [
                              { problem: "", resolution: "" }
                            ],
                            metrics: {
                              role: "Lead Unity Developer",
                              duration: "4 Months",
                              engine: "Unity (C#)",
                              teamSize: "2 Developers",
                            },
                          });
                        }}
                        className="px-4 py-2.5 rounded-xl font-black uppercase text-xs tracking-wider bg-[#4ade80] hover:bg-[#3ec470] text-black border-2 border-[#1A1A1A] shadow-[3px_3px_0px_0px_#1A1A1A] flex items-center gap-2 cursor-pointer"
                      >
                        <Plus size={15} /> Add New Quest
                      </button>
                    </div>

                    {/* Projects Table / Card List */}
                    <div className="space-y-3">
                      {projects.map((p, index) => (
                        <div
                          key={p.id}
                          className={`p-4 rounded-xl border-2 border-dashed ${currentTheme.inputBorder} ${currentTheme.cardBg} flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-gray-500`}
                        >
                          <div className="flex items-center gap-4 min-w-0">
                            {/* Reorder Buttons */}
                            <div className="flex flex-col gap-1">
                              <button
                                disabled={index === 0}
                                onClick={() => handleMoveProject(index, -1)}
                                className="p-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-20 cursor-pointer"
                                title="Move Up"
                              >
                                <ArrowUp size={14} className={currentTheme.text} />
                              </button>
                              <button
                                disabled={index === projects.length - 1}
                                onClick={() => handleMoveProject(index, 1)}
                                className="p-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-20 cursor-pointer"
                                title="Move Down"
                              >
                                <ArrowDown size={14} className={currentTheme.text} />
                              </button>
                            </div>

                            {/* Thumbnail Preview */}
                            <div
                              className="w-16 h-12 rounded-lg bg-cover bg-center border border-gray-700/40 shrink-0"
                              style={{ backgroundImage: `url(${p.thumbnailImage})`, backgroundSize: "cover" }}
                            />

                            {/* Info */}
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className={`text-base font-black ${currentTheme.text} truncate`}>
                                  {p.title}
                                </h4>
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${COLORS[p.color || "orange"].bg} text-black uppercase`}>
                                  {p.rarity || "EPIC"}
                                </span>
                                <span className="text-xs font-bold text-amber-400 flex items-center gap-0.5">
                                  <Star size={12} fill="currentColor" /> {p.rating}
                                </span>
                              </div>
                              <p className={`text-xs ${currentTheme.textMuted} truncate max-w-lg mt-0.5`}>
                                {p.desc}
                              </p>
                              {/* Store Badges */}
                              <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                                {p.androidUrl && <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">Android</span>}
                                {p.iosUrl && <span className="text-[9px] font-bold text-sky-400 bg-sky-500/10 px-1.5 py-0.5 rounded">iOS</span>}
                                {p.webUrl && <span className="text-[9px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">Web</span>}
                                {p.itchUrl && <span className="text-[9px] font-bold text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded">itch.io</span>}
                                {p.steamUrl && <span className="text-[9px] font-bold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded">Steam</span>}
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                            <button
                              onClick={() => {
                                setIsCreatingNew(false);
                                setEditingProject({ ...p });
                              }}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-white/10 hover:bg-white/20 border border-white/20 flex items-center gap-1.5 cursor-pointer"
                            >
                              <Edit3 size={13} /> Edit
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete "${p.title}"?`)) {
                                  deleteProject(p.id);
                                }
                              }}
                              className="p-1.5 rounded-lg text-xs text-rose-400 hover:bg-rose-500/15 border border-rose-500/20 cursor-pointer"
                              title="Delete Project"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  /* Edit / Add Form */
                  <form onSubmit={handleSaveProjectForm} className="space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-gray-700/30">
                      <div>
                        <h3 className={`text-xl font-black ${currentTheme.text} uppercase tracking-tight`}>
                          {isCreatingNew ? "Add New Quest" : `Edit: ${editingProject.title}`}
                        </h3>
                        <p className={`text-xs ${currentTheme.textMuted}`}>
                          Changes will save to your live database immediately.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingProject(null)}
                          className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-white/10 hover:bg-white/20 border border-white/20 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 rounded-xl font-black uppercase text-xs tracking-wider bg-[#2EC4B6] hover:bg-[#20ab9d] text-black border-2 border-[#1A1A1A] shadow-[3px_3px_0px_0px_#1A1A1A] flex items-center gap-1.5 cursor-pointer"
                        >
                          <Save size={15} /> Save Changes
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Title */}
                      <div className="md:col-span-2">
                        <label className={`block text-xs font-bold uppercase tracking-wider ${currentTheme.textMuted} mb-1`}>
                          Game Title *
                        </label>
                        <input
                          type="text"
                          required
                          value={editingProject.title || ""}
                          onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                          className={`w-full px-3 py-2 rounded-xl border-2 border-[#1A1A1A] ${currentTheme.inputBg} ${currentTheme.text} text-sm font-bold`}
                          placeholder="e.g. Top Champs: Boxing Card Battle"
                        />
                      </div>

                      {/* Description */}
                      <div className="md:col-span-2">
                        <label className={`block text-xs font-bold uppercase tracking-wider ${currentTheme.textMuted} mb-1`}>
                          Description & Features *
                        </label>
                        <textarea
                          rows={4}
                          required
                          value={editingProject.desc || ""}
                          onChange={(e) => setEditingProject({ ...editingProject, desc: e.target.value })}
                          className={`w-full px-3 py-2 rounded-xl border-2 border-[#1A1A1A] ${currentTheme.inputBg} ${currentTheme.text} text-xs font-medium`}
                          placeholder="Overview of the game, contributions, and key mechanics..."
                        />
                      </div>

                      {/* Tags */}
                      <div>
                        <label className={`block text-xs font-bold uppercase tracking-wider ${currentTheme.textMuted} mb-1`}>
                          Tags (comma-separated)
                        </label>
                        <input
                          type="text"
                          value={Array.isArray(editingProject.tags) ? editingProject.tags.join(", ") : ""}
                          onChange={(e) => setEditingProject({ ...editingProject, tags: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
                          className={`w-full px-3 py-2 rounded-xl border-2 border-[#1A1A1A] ${currentTheme.inputBg} ${currentTheme.text} text-xs font-bold`}
                          placeholder="Unity, Level Editor, Puzzle"
                        />
                      </div>

                      {/* Rarity & Rating */}
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className={`block text-xs font-bold uppercase tracking-wider ${currentTheme.textMuted} mb-1`}>
                            Rarity
                          </label>
                          <select
                            value={editingProject.rarity || "EPIC"}
                            onChange={(e) => setEditingProject({ ...editingProject, rarity: e.target.value })}
                            className={`w-full px-2 py-2 rounded-xl border-2 border-[#1A1A1A] ${currentTheme.inputBg} ${currentTheme.text} text-xs font-bold`}
                          >
                            <option value="COMMON">COMMON</option>
                            <option value="RARE">RARE</option>
                            <option value="EPIC">EPIC</option>
                            <option value="LEGENDARY">LEGENDARY</option>
                          </select>
                        </div>

                        <div>
                          <label className={`block text-xs font-bold uppercase tracking-wider ${currentTheme.textMuted} mb-1`}>
                            Rating
                          </label>
                          <input
                            type="text"
                            value={editingProject.rating || "4.8"}
                            onChange={(e) => setEditingProject({ ...editingProject, rating: e.target.value })}
                            className={`w-full px-3 py-2 rounded-xl border-2 border-[#1A1A1A] ${currentTheme.inputBg} ${currentTheme.text} text-xs font-bold`}
                          />
                        </div>

                        <div>
                          <label className={`block text-xs font-bold uppercase tracking-wider ${currentTheme.textMuted} mb-1`}>
                            Accent Color
                          </label>
                          <select
                            value={editingProject.color || "orange"}
                            onChange={(e) => setEditingProject({ ...editingProject, color: e.target.value })}
                            className={`w-full px-2 py-2 rounded-xl border-2 border-[#1A1A1A] ${currentTheme.inputBg} ${currentTheme.text} text-xs font-bold`}
                          >
                            <option value="orange">Orange</option>
                            <option value="teal">Teal</option>
                            <option value="purple">Purple</option>
                            <option value="pink">Pink</option>
                            <option value="gray">Gray</option>
                          </select>
                        </div>
                      </div>

                      {/* Thumbnail URL */}
                      <div className="md:col-span-2">
                        <label className={`block text-xs font-bold uppercase tracking-wider ${currentTheme.textMuted} mb-1`}>
                          Thumbnail Banner Image URL *
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="url"
                            required
                            value={editingProject.thumbnailImage || ""}
                            onChange={(e) => setEditingProject({ ...editingProject, thumbnailImage: e.target.value })}
                            className={`flex-1 px-3 py-2 rounded-xl border-2 border-[#1A1A1A] ${currentTheme.inputBg} ${currentTheme.text} text-xs`}
                            placeholder="https://..."
                          />
                          {editingProject.thumbnailImage && (
                            <div
                              className="w-12 h-10 rounded border border-gray-700 bg-cover bg-center shrink-0"
                              style={{ backgroundImage: `url(${editingProject.thumbnailImage})` }}
                            />
                          )}
                        </div>
                      </div>

                      {/* Preview Images */}
                      <div className="md:col-span-2">
                        <label className={`block text-xs font-bold uppercase tracking-wider ${currentTheme.textMuted} mb-1`}>
                          Screenshot Gallery URLs (one per line)
                        </label>
                        <textarea
                          rows={3}
                          value={Array.isArray(editingProject.previewImages) ? editingProject.previewImages.join("\n") : ""}
                          onChange={(e) => setEditingProject({
                            ...editingProject,
                            previewImages: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean),
                          })}
                          className={`w-full px-3 py-2 rounded-xl border-2 border-[#1A1A1A] ${currentTheme.inputBg} ${currentTheme.text} text-xs font-mono`}
                          placeholder="https://play-lh.googleusercontent.com/...\nhttps://play-lh.googleusercontent.com/..."
                        />
                      </div>

                      {/* Store Links */}
                      <div>
                        <label className={`block text-xs font-bold uppercase tracking-wider ${currentTheme.textMuted} mb-1 flex items-center gap-1`}>
                          <Smartphone size={13} className="text-emerald-400" /> Android Play Store URL
                        </label>
                        <input
                          type="url"
                          value={editingProject.androidUrl || ""}
                          onChange={(e) => setEditingProject({ ...editingProject, androidUrl: e.target.value })}
                          className={`w-full px-3 py-2 rounded-xl border-2 border-[#1A1A1A] ${currentTheme.inputBg} ${currentTheme.text} text-xs`}
                          placeholder="https://play.google.com/store/apps/details?id=..."
                        />
                      </div>

                      <div>
                        <label className={`block text-xs font-bold uppercase tracking-wider ${currentTheme.textMuted} mb-1 flex items-center gap-1`}>
                          <Apple size={13} className="text-sky-400" /> iOS App Store URL
                        </label>
                        <input
                          type="url"
                          value={editingProject.iosUrl || ""}
                          onChange={(e) => setEditingProject({ ...editingProject, iosUrl: e.target.value })}
                          className={`w-full px-3 py-2 rounded-xl border-2 border-[#1A1A1A] ${currentTheme.inputBg} ${currentTheme.text} text-xs`}
                          placeholder="https://apps.apple.com/us/app/..."
                        />
                      </div>

                      <div>
                        <label className={`block text-xs font-bold uppercase tracking-wider ${currentTheme.textMuted} mb-1 flex items-center gap-1`}>
                          <Globe size={13} className="text-amber-400" /> Web / Playable URL
                        </label>
                        <input
                          type="url"
                          value={editingProject.webUrl || ""}
                          onChange={(e) => setEditingProject({ ...editingProject, webUrl: e.target.value })}
                          className={`w-full px-3 py-2 rounded-xl border-2 border-[#1A1A1A] ${currentTheme.inputBg} ${currentTheme.text} text-xs`}
                          placeholder="https://..."
                        />
                      </div>

                      <div>
                        <label className={`block text-xs font-bold uppercase tracking-wider ${currentTheme.textMuted} mb-1 flex items-center gap-1`}>
                          <Gamepad2 size={13} className="text-rose-400" /> itch.io URL (optional)
                        </label>
                        <input
                          type="url"
                          value={editingProject.itchUrl || ""}
                          onChange={(e) => setEditingProject({ ...editingProject, itchUrl: e.target.value })}
                          className={`w-full px-3 py-2 rounded-xl border-2 border-[#1A1A1A] ${currentTheme.inputBg} ${currentTheme.text} text-xs`}
                          placeholder="https://koushikroy.itch.io/..."
                        />
                      </div>

                      {/* YouTube Video ID */}
                      <div className="md:col-span-2">
                        <label className={`block text-xs font-bold uppercase tracking-wider ${currentTheme.textMuted} mb-1`}>
                          YouTube Video ID (optional trailer)
                        </label>
                        <input
                          type="text"
                          value={editingProject.youtubeId || ""}
                          onChange={(e) => setEditingProject({ ...editingProject, youtubeId: e.target.value })}
                          className={`w-full px-3 py-2 rounded-xl border-2 border-[#1A1A1A] ${currentTheme.inputBg} ${currentTheme.text} text-xs font-mono`}
                          placeholder="e.g. Riu23UEngwc (from youtube.com/watch?v=Riu23UEngwc)"
                        />
                      </div>

                      {/* Metrics */}
                      <div>
                        <label className={`block text-xs font-bold uppercase tracking-wider ${currentTheme.textMuted} mb-1`}>
                          Role
                        </label>
                        <input
                          type="text"
                          value={editingProject.metrics?.role || ""}
                          onChange={(e) => setEditingProject({
                            ...editingProject,
                            metrics: { ...(editingProject.metrics || {}), role: e.target.value },
                          })}
                          className={`w-full px-3 py-2 rounded-xl border-2 border-[#1A1A1A] ${currentTheme.inputBg} ${currentTheme.text} text-xs font-bold`}
                          placeholder="Lead Unity Developer"
                        />
                      </div>

                      <div>
                        <label className={`block text-xs font-bold uppercase tracking-wider ${currentTheme.textMuted} mb-1`}>
                          Engine / Tech
                        </label>
                        <input
                          type="text"
                          value={editingProject.metrics?.engine || ""}
                          onChange={(e) => setEditingProject({
                            ...editingProject,
                            metrics: { ...(editingProject.metrics || {}), engine: e.target.value },
                          })}
                          className={`w-full px-3 py-2 rounded-xl border-2 border-[#1A1A1A] ${currentTheme.inputBg} ${currentTheme.text} text-xs font-bold`}
                          placeholder="Unity (C#)"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t border-gray-700/30">
                      <button
                        type="button"
                        onClick={() => setEditingProject(null)}
                        className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-white/10 hover:bg-white/20 border border-white/20 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl font-black uppercase text-xs tracking-wider bg-[#2EC4B6] hover:bg-[#20ab9d] text-black border-2 border-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A] cursor-pointer"
                      >
                        Save Quest
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* TAB: EXPERIENCE */}
            {activeTab === "experience" && (
              <div className="p-4 sm:p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`text-xl font-black ${currentTheme.text} uppercase tracking-tight`}>
                      Experience & Quest Log
                    </h3>
                    <p className={`text-xs ${currentTheme.textMuted}`}>
                      Manage your career timeline, roles, and achievements.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const newJob = {
                        title: "Unity Game Developer",
                        company: "Studio Name",
                        location: "Remote",
                        date: "2026 - Present",
                        status: "ACTIVE",
                        xp: "+5000 XP",
                        desc: "Role description...",
                        achievements: ["Key achievement 1", "Key achievement 2"],
                        stack: ["Unity", "C#"],
                        color: "orange",
                      };
                      saveJobs([newJob, ...jobs]);
                    }}
                    className="px-4 py-2 rounded-xl font-black uppercase text-xs tracking-wider bg-[#9B5DE5] text-white border-2 border-[#1A1A1A] shadow-[3px_3px_0px_0px_#1A1A1A] flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus size={14} /> Add Role
                  </button>
                </div>

                <div className="space-y-3">
                  {jobs.map((job, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border-2 border-dashed ${currentTheme.inputBorder} ${currentTheme.cardBg} space-y-2`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <h4 className={`text-base font-black ${currentTheme.text}`}>
                            {job.title} <span className="text-[#FF9F1C]">@ {job.company}</span>
                          </h4>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                            {job.status}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete ${job.title} at ${job.company}?`)) {
                              const updated = jobs.filter((_, i) => i !== idx);
                              saveJobs(updated);
                            }
                          }}
                          className="text-rose-400 hover:text-rose-300 p-1 cursor-pointer"
                          title="Delete Job"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                      <p className={`text-xs ${currentTheme.textMuted}`}>{job.desc}</p>
                      <div className="flex flex-wrap gap-1">
                        {job.stack?.map((t) => (
                          <span key={t} className="text-[10px] font-bold bg-white/5 px-2 py-0.5 rounded text-gray-400">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: DATABASE SETTINGS */}
            {activeTab === "database" && (
              <div className="p-4 sm:p-6 space-y-8">
                {/* Status Callout */}
                <div
                  className={`p-5 rounded-2xl border-2 border-dashed ${
                    isLive ? "border-emerald-500 bg-emerald-500/10" : "border-amber-500 bg-amber-500/10"
                  } flex flex-col sm:flex-row sm:items-center justify-between gap-4`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl border-2 border-[#1A1A1A] ${isLive ? "bg-emerald-400 text-black" : "bg-amber-400 text-black"}`}>
                      <Database size={24} />
                    </div>
                    <div>
                      <h4 className={`text-base font-black ${currentTheme.text} uppercase tracking-tight`}>
                        {isLive ? "Firebase Firestore: Connected & Live" : "Local Storage Mode (Offline)"}
                      </h4>
                      <p className={`text-xs ${currentTheme.textMuted}`}>
                        {isLive
                          ? "All edits sync to Google Cloud Firestore in real time. Changes appear instantly on your live portfolio without git pushes!"
                          : "Edits are currently saved in your browser local storage. Connect Firebase below so visitors see your updates live."}
                      </p>
                    </div>
                  </div>

                  {isLive && (
                    <button
                      onClick={handleSeedNow}
                      className="px-4 py-2 rounded-xl font-black uppercase text-xs tracking-wider bg-[#FF9F1C] hover:bg-[#e88c0c] text-black border-2 border-[#1A1A1A] shadow-[3px_3px_0px_0px_#1A1A1A] flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                    >
                      <Sparkles size={14} /> Seed Data to Cloud
                    </button>
                  )}
                </div>

                {/* Firebase Credentials Form */}
                <div className={`p-5 rounded-2xl border-2 border-dashed ${currentTheme.inputBorder} ${currentTheme.inputBg} space-y-4`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className={`text-base font-black ${currentTheme.text} uppercase tracking-tight`}>
                        Google Cloud Firebase Setup (100% Free Forever)
                      </h4>
                      <p className={`text-xs ${currentTheme.textMuted}`}>
                        Paste your Firebase project credentials from the Firebase Console (Project Settings &gt; Web App).
                      </p>
                    </div>

                    <a
                      href="https://console.firebase.google.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-[#FF9F1C] hover:underline flex items-center gap-1"
                    >
                      Firebase Console <ExternalLink size={12} />
                    </a>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block font-bold text-gray-400 mb-1">Project ID *</label>
                      <input
                        type="text"
                        value={firebaseConfig.projectId || ""}
                        onChange={(e) => setFirebaseConfig({ ...firebaseConfig, projectId: e.target.value.trim() })}
                        placeholder="e.g. portfolio-game-dev"
                        className={`w-full px-3 py-2 rounded-xl border border-gray-700 ${currentTheme.cardBg} ${currentTheme.text}`}
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-400 mb-1">API Key *</label>
                      <input
                        type="text"
                        value={firebaseConfig.apiKey || ""}
                        onChange={(e) => setFirebaseConfig({ ...firebaseConfig, apiKey: e.target.value.trim() })}
                        placeholder="AIzaSy..."
                        className={`w-full px-3 py-2 rounded-xl border border-gray-700 ${currentTheme.cardBg} ${currentTheme.text}`}
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-400 mb-1">Auth Domain</label>
                      <input
                        type="text"
                        value={firebaseConfig.authDomain || ""}
                        onChange={(e) => setFirebaseConfig({ ...firebaseConfig, authDomain: e.target.value.trim() })}
                        placeholder="your-project.firebaseapp.com"
                        className={`w-full px-3 py-2 rounded-xl border border-gray-700 ${currentTheme.cardBg} ${currentTheme.text}`}
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-400 mb-1">App ID</label>
                      <input
                        type="text"
                        value={firebaseConfig.appId || ""}
                        onChange={(e) => setFirebaseConfig({ ...firebaseConfig, appId: e.target.value.trim() })}
                        placeholder="1:1234567890:web:abcdef..."
                        className={`w-full px-3 py-2 rounded-xl border border-gray-700 ${currentTheme.cardBg} ${currentTheme.text}`}
                      />
                    </div>
                  </div>

                  {testMessage && (
                    <div
                      className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                        testStatus === "success"
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                          : testStatus === "error"
                          ? "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                          : "bg-blue-500/15 text-blue-400"
                      }`}
                    >
                      {testStatus === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                      <span>{testMessage}</span>
                    </div>
                  )}

                  {saveStatus && (
                    <p className="text-xs font-bold text-emerald-400">{saveStatus}</p>
                  )}

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleTestConnection}
                      disabled={!firebaseConfig.projectId || !firebaseConfig.apiKey || testStatus === "testing"}
                      className="px-4 py-2 rounded-xl font-bold uppercase text-xs tracking-wider bg-white/10 hover:bg-white/20 border border-white/20 disabled:opacity-30 cursor-pointer"
                    >
                      {testStatus === "testing" ? "Testing..." : "Test Firestore Connection"}
                    </button>

                    <button
                      type="button"
                      onClick={handleSaveFirebase}
                      className="px-5 py-2 rounded-xl font-black uppercase text-xs tracking-wider bg-[#2EC4B6] hover:bg-[#20ab9d] text-black border-2 border-[#1A1A1A] shadow-[3px_3px_0px_0px_#1A1A1A] cursor-pointer"
                    >
                      Save & Connect Cloud
                    </button>

                    {isFirebaseConfigured() && (
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm("Disconnect Firebase and switch to local storage?")) {
                            saveFirebaseConfig(null);
                            setFirebaseConfig({ apiKey: "", authDomain: "", projectId: "", storageBucket: "", messagingSenderId: "", appId: "" });
                            refresh();
                          }
                        }}
                        className="px-3 py-2 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 cursor-pointer ml-auto"
                      >
                        Disconnect Cloud
                      </button>
                    )}
                  </div>
                </div>

                {/* Backup & PIN Security Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Backup / Export */}
                  <div className={`p-5 rounded-2xl border-2 border-dashed ${currentTheme.inputBorder} ${currentTheme.inputBg} space-y-3`}>
                    <h4 className={`text-sm font-black ${currentTheme.text} uppercase tracking-tight`}>
                      Data Backup & Restoration
                    </h4>
                    <p className={`text-xs ${currentTheme.textMuted}`}>
                      Export your complete portfolio data as a JSON file or restore from a backup.
                    </p>

                    <div className="flex items-center gap-2 pt-2">
                      <button
                        onClick={handleExportBackup}
                        className="px-4 py-2 rounded-xl font-bold uppercase text-xs tracking-wider bg-white/10 hover:bg-white/20 border border-white/20 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Download size={13} /> Export JSON
                      </button>

                      <label className="px-4 py-2 rounded-xl font-bold uppercase text-xs tracking-wider bg-white/10 hover:bg-white/20 border border-white/20 flex items-center gap-1.5 cursor-pointer">
                        <Upload size={13} /> Import JSON
                        <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
                      </label>
                    </div>
                  </div>

                  {/* Change PIN */}
                  <div className={`p-5 rounded-2xl border-2 border-dashed ${currentTheme.inputBorder} ${currentTheme.inputBg} space-y-3`}>
                    <h4 className={`text-sm font-black ${currentTheme.text} uppercase tracking-tight`}>
                      Change Secret PIN
                    </h4>
                    <p className={`text-xs ${currentTheme.textMuted}`}>
                      Change the PIN required to access this dashboard.
                    </p>

                    <form onSubmit={handlePinChange} className="flex items-center gap-2 pt-2">
                      <input
                        type="password"
                        value={newPin}
                        onChange={(e) => setNewPin(e.target.value)}
                        placeholder="New PIN (4+ digits)"
                        className={`w-36 px-3 py-2 rounded-xl border border-gray-700 ${currentTheme.cardBg} ${currentTheme.text} text-xs font-bold text-center`}
                      />
                      <button
                        type="submit"
                        className="px-3 py-2 rounded-xl font-bold uppercase text-xs tracking-wider bg-white/10 hover:bg-white/20 border border-white/20 cursor-pointer"
                      >
                        Update PIN
                      </button>
                    </form>
                    {pinChangeMsg && <p className="text-xs font-bold text-emerald-400">{pinChangeMsg}</p>}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer info */}
        <div className="p-3 px-6 border-t border-gray-700/20 bg-black/30 flex items-center justify-between text-[11px] text-gray-500">
          <span>Shortcuts: Press <code className="bg-white/10 px-1 py-0.5 rounded text-orange-400 font-mono">Ctrl + Shift + A</code> anywhere to open Dashboard</span>
          <span>Quest Master CMS v1.0</span>
        </div>
      </div>
    </div>
  );
}
