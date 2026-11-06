import { useState, useEffect } from "react";
import {
  X,
  Lock,
  Shield,
  KeyRound,
  Database,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Sparkles,
  RefreshCw,
  Download,
  Upload,
  Copy,
  Eye,
  Star,
  Smartphone,
  Apple,
  Globe,
  Gamepad2,
  Github,
  Briefcase,
  Award,
  Sliders,
  Save,
  LogOut,
  Check,
  Layers,
  Cpu,
  Radio,
  Terminal,
  Code2,
  Boxes,
  Zap,
  Wrench,
  GitBranch,
  Flame,
  ShieldCheck,
  Mail,
  Twitter,
  Linkedin,
  FileText,
  User,
  Heart,
  Coffee,
  Trophy,
  Clock,
  Laptop,
  Repeat,
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

const COLOR_OPTIONS = ["teal", "orange", "purple", "pink"];
const RARITY_OPTIONS = ["LEGENDARY", "EPIC", "RARE", "COMMON"];
const STATUS_OPTIONS = ["ACTIVE", "COMPLETED", "IN PROGRESS"];

// Helper to extract YouTube video ID from full URL or return bare ID
const extractYoutubeId = (urlOrId) => {
  if (!urlOrId) return "";
  const match = urlOrId.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
  );
  return match ? match[1] : urlOrId.trim();
};

export default function AdminModal({ isOpen, onClose }) {
  const { currentTheme, theme } = useTheme();
  const {
    projects,
    jobs,
    stats,
    skills,
    profile,
    allData,
    isLive,
    dataSource,
    lastSaved,
    updateData,
    saveAllData,
    saveProjects,
    addProject,
    updateProject,
    deleteProject,
    saveJobs,
    saveStats,
    saveSkills,
    saveProfile,
    seedFirestore,
    fetchFromFirestore,
    resetDefaults,
    refresh,
  } = usePortfolioData();

  // PIN Auth State
  const [pinInput, setPinInput] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinError, setPinError] = useState("");
  const [currentPin, setCurrentPin] = useState(() => {
    return localStorage.getItem(PIN_STORAGE_KEY) || DEFAULT_PIN;
  });

  // Active Tab: "profile" | "projects" | "experience" | "skills" | "stats_contact" | "database"
  const [activeTab, setActiveTab] = useState("projects");

  // Project Editor State
  const [editingProject, setEditingProject] = useState(null);
  const [isCreatingNewProject, setIsCreatingNewProject] = useState(false);

  // Job / Experience Editor State
  const [editingJob, setEditingJob] = useState(null);
  const [editingJobIndex, setEditingJobIndex] = useState(-1);
  const [isCreatingJob, setIsCreatingJob] = useState(false);

  // Skills Editor State
  const [editingBranch, setEditingBranch] = useState(null);
  const [editingBranchIndex, setEditingBranchIndex] = useState(-1);
  const [isCreatingBranch, setIsCreatingBranch] = useState(false);

  // Profile Form State
  const [profileForm, setProfileForm] = useState(profile);

  // Global Save Feedback
  const [globalSaveStatus, setGlobalSaveStatus] = useState("");

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
        measurementId: "",
      }
    );
  });
  const [testStatus, setTestStatus] = useState(null);
  const [testMessage, setTestMessage] = useState("");
  const [dbSaveStatus, setDbSaveStatus] = useState("");
  const [copiedRules, setCopiedRules] = useState(false);

  // PIN Settings State
  const [newPin, setNewPin] = useState("");
  const [pinChangeMsg, setPinChangeMsg] = useState("");

  // Sync profile form when profile loads
  useEffect(() => {
    if (profile) {
      setProfileForm(profile);
    }
  }, [profile]);

  useEffect(() => {
    if (!isOpen) {
      setPinInput("");
      setPinError("");
      setEditingProject(null);
      setEditingJob(null);
      setEditingBranch(null);
    }
  }, [isOpen]);

  // Auth Submit
  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pinInput.trim() === currentPin) {
      setIsAuthenticated(true);
      setPinError("");
    } else {
      setPinError("Incorrect PIN. Please try again. (Default: 2026)");
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
    setPinChangeMsg("PIN updated successfully!");
    setTimeout(() => setPinChangeMsg(""), 3000);
  };

  // One-click Master Cloud Save
  const handleMasterSave = async () => {
    try {
      setGlobalSaveStatus("Saving to cloud database...");
      const result = await saveAllData({
        ...allData,
        profile: profileForm,
        projects,
        jobs,
        stats,
        skills,
      });
      if (result.destination === "firestore") {
        setGlobalSaveStatus("Saved & Synced with Firebase Firestore!");
      } else {
        setGlobalSaveStatus("Saved to local browser cache!");
      }
      setTimeout(() => setGlobalSaveStatus(""), 3500);
    } catch (err) {
      setGlobalSaveStatus("Save failed: " + err.message);
      setTimeout(() => setGlobalSaveStatus(""), 4000);
    }
  };

  // --- Projects Handlers ---
  const handleMoveProject = (index, direction) => {
    const newIdx = index + direction;
    if (newIdx < 0 || newIdx >= projects.length) return;
    const reordered = [...projects];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(newIdx, 0, moved);
    saveProjects(reordered);
  };

  const handleDuplicateProject = (project) => {
    const newId =
      projects.length > 0
        ? Math.max(...projects.map((p) => Number(p.id) || 0)) + 1
        : 1;
    const duplicated = {
      ...project,
      id: newId,
      title: `${project.title} (Copy)`,
    };
    addProject(duplicated);
  };

  const handleSaveProjectForm = async (e) => {
    e.preventDefault();
    if (!editingProject) return;

    const cleanedProject = {
      ...editingProject,
      youtubeId: extractYoutubeId(editingProject.youtubeId),
    };

    if (isCreatingNewProject) {
      await addProject(cleanedProject);
    } else {
      await updateProject(cleanedProject);
    }
    setEditingProject(null);
    setIsCreatingNewProject(false);
  };

  // --- Experience Handlers ---
  const handleMoveJob = (index, direction) => {
    const newIdx = index + direction;
    if (newIdx < 0 || newIdx >= jobs.length) return;
    const reordered = [...jobs];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(newIdx, 0, moved);
    saveJobs(reordered);
  };

  const handleSaveJobForm = async (e) => {
    e.preventDefault();
    if (!editingJob) return;

    if (isCreatingJob) {
      await saveJobs([editingJob, ...jobs]);
    } else {
      const updated = [...jobs];
      updated[editingJobIndex] = editingJob;
      await saveJobs(updated);
    }
    setEditingJob(null);
    setIsCreatingJob(false);
    setEditingJobIndex(-1);
  };

  // --- Skills Handlers ---
  const handleSaveBranchForm = async (e) => {
    e.preventDefault();
    if (!editingBranch) return;

    if (isCreatingBranch) {
      await saveSkills([...skills, editingBranch]);
    } else {
      const updated = [...skills];
      updated[editingBranchIndex] = editingBranch;
      await saveSkills(updated);
    }
    setEditingBranch(null);
    setIsCreatingBranch(false);
    setEditingBranchIndex(-1);
  };

  // --- Profile Handler ---
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    await saveProfile(profileForm);
    setGlobalSaveStatus("Profile & Hero details saved!");
    setTimeout(() => setGlobalSaveStatus(""), 3000);
  };

  // --- Firebase Cloud Database Handlers ---
  const handleSaveFirebase = async () => {
    try {
      setDbSaveStatus("Connecting to Firebase...");
      await saveFirebaseConfig(firebaseConfig);
      await refresh();
      setDbSaveStatus("Connected & saved successfully!");
      setTimeout(() => setDbSaveStatus(""), 3500);
    } catch (err) {
      setDbSaveStatus("Error saving config: " + err.message);
    }
  };

  const handleTestConnection = async () => {
    setTestStatus("testing");
    setTestMessage("Pinging Firestore database...");
    try {
      await testFirestoreConnection(firebaseConfig);
      setTestStatus("success");
      setTestMessage("Success! Firestore is active, authenticated, and ready.");
    } catch (err) {
      setTestStatus("error");
      setTestMessage(
        "Connection failed: " +
          (err.message || String(err)) +
          "\nTip: Check Firestore security rules in Firebase console."
      );
    }
  };

  const handleSeedNow = async () => {
    if (
      !window.confirm(
        "Push and seed all current website data to Firestore? This will save all projects, experience, skills, profile, and stats to your cloud database."
      )
    )
      return;
    try {
      setDbSaveStatus("Uploading entire dataset to Firestore...");
      await seedFirestore({
        ...allData,
        profile: profileForm,
        projects,
        jobs,
        stats,
        skills,
      });
      setDbSaveStatus("All website data pushed to Firebase Firestore!");
      setTimeout(() => setDbSaveStatus(""), 3500);
    } catch (err) {
      alert("Seeding failed: " + err.message);
      setDbSaveStatus("");
    }
  };

  const handlePullFromFirestore = async () => {
    try {
      setDbSaveStatus("Fetching from Firestore...");
      const res = await fetchFromFirestore();
      if (res.source === "firestore") {
        setDbSaveStatus("Data synced directly from Firestore!");
      } else {
        setDbSaveStatus("No data in Firestore yet. Click 'Seed to Firebase' first.");
      }
      setTimeout(() => setDbSaveStatus(""), 3500);
    } catch (err) {
      setDbSaveStatus("Pull error: " + err.message);
    }
  };

  // JSON Export / Import
  const handleExportBackup = () => {
    const jsonStr = JSON.stringify(
      {
        ...allData,
        profile: profileForm,
        projects,
        jobs,
        stats,
        skills,
      },
      null,
      2
    );
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `portfolio-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const parsed = JSON.parse(evt.target.result);
        if (parsed.projects && Array.isArray(parsed.projects)) {
          if (
            window.confirm(
              "Replace current portfolio data with this imported JSON file?"
            )
          ) {
            await saveAllData(parsed);
            if (parsed.profile) setProfileForm(parsed.profile);
            alert("Backup imported and applied successfully!");
          }
        } else {
          alert("Invalid backup file: missing projects array.");
        }
      } catch (err) {
        alert("Failed to parse JSON file: " + err.message);
      }
    };
    reader.readAsText(file);
  };

  const copySecurityRules = () => {
    const rules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(rules);
      setCopiedRules(true);
      setTimeout(() => setCopiedRules(false), 2500);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div
        className={`relative w-full max-w-6xl my-auto ${currentTheme.cardBg} border-[3px] border-dashed ${COLORS.orange.border} rounded-2xl shadow-[10px_10px_0px_0px_#1A1A1A] overflow-hidden flex flex-col max-h-[94vh]`}
      >
        {/* Top Header */}
        <div className="p-3 sm:p-4 border-b-2 border-dashed border-gray-700/30 flex flex-wrap items-center justify-between gap-3 bg-black/25">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-2.5 rounded-xl bg-[#FF9F1C] text-black border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A]">
              <Shield size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2
                  className={`text-base sm:text-lg font-black ${currentTheme.text} uppercase tracking-tight`}
                >
                  Quest Master Admin CMS
                </h2>
                {isAuthenticated && (
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-black uppercase flex items-center gap-1.5 ${
                      isLive
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                        : "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isLive ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
                      }`}
                    />
                    {isLive ? "Firebase Live Database" : "Local Storage"}
                  </span>
                )}
                {lastSaved && (
                  <span className="text-[10px] text-gray-400">
                    Saved at {lastSaved}
                  </span>
                )}
              </div>
              <p className={`text-xs ${currentTheme.textMuted} font-medium`}>
                Edit and update your whole personal website without code changes or git pushes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <>
                <button
                  onClick={handleMasterSave}
                  title="Save all changes to Firebase database"
                  className="px-3.5 py-1.5 rounded-xl font-black uppercase text-xs tracking-wider bg-[#4ade80] hover:bg-[#3ec470] text-black border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] flex items-center gap-1.5 cursor-pointer transition-all active:translate-y-0.5"
                >
                  <Save size={14} />
                  <span className="hidden sm:inline">Save All to Cloud</span>
                </button>
                <button
                  onClick={() => setIsAuthenticated(false)}
                  title="Lock CMS"
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 cursor-pointer"
                >
                  <LogOut size={16} />
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 cursor-pointer"
              title="Close Admin Panel"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Global Save Alert Banner */}
        {globalSaveStatus && (
          <div className="bg-[#4ade80]/15 border-b border-[#4ade80]/40 px-4 py-2 flex items-center justify-between text-xs font-bold text-emerald-400">
            <span className="flex items-center gap-2">
              <CheckCircle2 size={14} />
              {globalSaveStatus}
            </span>
            <button
              onClick={() => setGlobalSaveStatus("")}
              className="hover:opacity-75"
            >
              <X size={13} />
            </button>
          </div>
        )}

        {/* PIN Screen if not authenticated */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-14 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border-2 border-dashed border-amber-500 flex items-center justify-center text-amber-400">
              <Lock size={32} />
            </div>

            <div className="max-w-md space-y-2">
              <h3
                className={`text-2xl font-black ${currentTheme.text} uppercase tracking-tight`}
              >
                Admin Access Required
              </h3>
              <p className={`text-xs ${currentTheme.textMuted} leading-relaxed`}>
                Enter your Quest Master PIN to edit website content, upload projects, and sync with Firebase.
              </p>
            </div>

            <form
              onSubmit={handlePinSubmit}
              className="w-full max-w-xs space-y-4"
            >
              <div className="relative">
                <KeyRound
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="Enter PIN..."
                  autoFocus
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 border-dashed ${currentTheme.inputBorder} ${currentTheme.inputBg} ${currentTheme.text} font-mono text-center tracking-widest text-lg font-black focus:outline-none focus:border-[#FF9F1C]`}
                />
              </div>

              {pinError && (
                <div className="text-xs font-bold text-rose-400 flex items-center justify-center gap-1.5">
                  <AlertCircle size={14} />
                  {pinError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl font-black uppercase text-xs tracking-wider bg-[#FF9F1C] hover:bg-[#e88f17] text-black border-2 border-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Lock size={14} /> Unlock Dashboard
              </button>
            </form>

            <div className="text-[11px] text-gray-500 flex items-center gap-1.5">
              <span>Default PIN:</span>
              <code className="px-2 py-0.5 rounded bg-white/5 text-amber-300 font-mono font-bold">
                2026
              </code>
              <span>· Shortcut: Ctrl+Shift+A</span>
            </div>
          </div>
        ) : (
          <>
            {/* Navigation Tabs Bar */}
            <div className="border-b-2 border-dashed border-gray-700/30 px-3 sm:px-5 flex gap-1.5 overflow-x-auto bg-black/10 py-2 scrollbar-none">
              {[
                { id: "projects", label: "Projects & Games", icon: Gamepad2, count: projects.length },
                { id: "experience", label: "Experience & Roles", icon: Briefcase, count: jobs.length },
                { id: "skills", label: "Skills Tree", icon: Layers, count: skills.length },
                { id: "profile", label: "Profile & Hero", icon: User },
                { id: "stats_contact", label: "Stats & Contact", icon: Sparkles },
                { id: "database", label: "Firebase & Backup", icon: Database },
              ].map(({ id, label, icon: TabIcon, count }) => {
                const isActive = activeTab === id;
                return (
                  <button
                    key={id}
                    onClick={() => {
                      setActiveTab(id);
                      setEditingProject(null);
                      setEditingJob(null);
                      setEditingBranch(null);
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? "bg-[#FF9F1C] text-black border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A]"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <TabIcon size={14} />
                    <span>{label}</span>
                    {typeof count === "number" && (
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                          isActive
                            ? "bg-black/20 text-black"
                            : "bg-white/10 text-gray-400"
                        }`}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* TAB CONTENT AREA */}
            <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(94vh-130px)]">
              {/* ========================================================
                  TAB 1: PROJECTS & GAMES
              ======================================================== */}
              {activeTab === "projects" && (
                <div className="space-y-6">
                  {!editingProject ? (
                    <>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <h3
                            className={`text-xl font-black ${currentTheme.text} uppercase tracking-tight`}
                          >
                            Projects & Games Showcase ({projects.length})
                          </h3>
                          <p className={`text-xs ${currentTheme.textMuted}`}>
                            Add, edit, duplicate, and reorder game cards that appear on your live site.
                          </p>
                        </div>

                        <button
                          onClick={() => {
                            setIsCreatingNewProject(true);
                            setEditingProject({
                              title: "",
                              desc: "",
                              tags: ["Unity"],
                              rarity: "EPIC",
                              rating: "4.8",
                              color: "orange",
                              thumbnailImage: "",
                              cardGradient:
                                "linear-gradient(135deg, #FF9F1C 0%, #1A1A1A 100%)",
                              youtubeId: "",
                              previewImages: [],
                              androidUrl: "",
                              iosUrl: "",
                              webUrl: "",
                              steamUrl: "",
                              githubUrl: "",
                              itchUrl: "",
                              challenges: [{ problem: "", resolution: "" }],
                              metrics: {
                                role: "Lead Unity Developer",
                                duration: "4 Months",
                                engine: "Unity (C#)",
                                teamSize: "2 Developers",
                              },
                            });
                          }}
                          className="px-4 py-2.5 rounded-xl font-black uppercase text-xs tracking-wider bg-[#4ade80] hover:bg-[#3ec470] text-black border-2 border-[#1A1A1A] shadow-[3px_3px_0px_0px_#1A1A1A] flex items-center gap-2 cursor-pointer transition-all active:translate-y-0.5"
                        >
                          <Plus size={15} /> Add New Quest
                        </button>
                      </div>

                      {/* Projects List */}
                      <div className="space-y-3">
                        {projects.map((p, index) => (
                          <div
                            key={p.id}
                            className={`p-3.5 sm:p-4 rounded-xl border-2 border-dashed ${currentTheme.inputBorder} ${currentTheme.cardBg} flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-gray-500`}
                          >
                            <div className="flex items-center gap-3.5 min-w-0">
                              {/* Reorder Buttons */}
                              <div className="flex flex-col gap-1">
                                <button
                                  disabled={index === 0}
                                  onClick={() => handleMoveProject(index, -1)}
                                  className="p-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-20 cursor-pointer"
                                  title="Move Up"
                                >
                                  <ArrowUp
                                    size={14}
                                    className={currentTheme.text}
                                  />
                                </button>
                                <button
                                  disabled={index === projects.length - 1}
                                  onClick={() => handleMoveProject(index, 1)}
                                  className="p-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-20 cursor-pointer"
                                  title="Move Down"
                                >
                                  <ArrowDown
                                    size={14}
                                    className={currentTheme.text}
                                  />
                                </button>
                              </div>

                              {/* Thumbnail */}
                              <div
                                className="w-16 h-12 rounded-lg bg-cover bg-center border border-gray-700/40 shrink-0 bg-black/40"
                                style={{
                                  backgroundImage: p.thumbnailImage
                                    ? `url(${p.thumbnailImage})`
                                    : "none",
                                }}
                              />

                              {/* Title & Info */}
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h4
                                    className={`text-sm sm:text-base font-black ${currentTheme.text} truncate`}
                                  >
                                    {p.title || "Untitled Project"}
                                  </h4>
                                  <span
                                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                      COLORS[p.color || "orange"]?.bg ||
                                      "bg-orange-400"
                                    } text-black uppercase`}
                                  >
                                    {p.rarity || "EPIC"}
                                  </span>
                                  <span className="text-xs font-bold text-amber-400 flex items-center gap-0.5">
                                    <Star size={12} fill="currentColor" />{" "}
                                    {p.rating}
                                  </span>
                                </div>
                                <p
                                  className={`text-xs ${currentTheme.textMuted} truncate max-w-lg mt-0.5`}
                                >
                                  {p.desc}
                                </p>
                                <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                                  {p.androidUrl && (
                                    <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                                      Play Store
                                    </span>
                                  )}
                                  {p.iosUrl && (
                                    <span className="text-[9px] font-bold text-sky-400 bg-sky-500/10 px-1.5 py-0.5 rounded">
                                      iOS
                                    </span>
                                  )}
                                  {p.webUrl && (
                                    <span className="text-[9px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                                      Web
                                    </span>
                                  )}
                                  {p.itchUrl && (
                                    <span className="text-[9px] font-bold text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded">
                                      itch.io
                                    </span>
                                  )}
                                  {p.steamUrl && (
                                    <span className="text-[9px] font-bold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded">
                                      Steam
                                    </span>
                                  )}
                                  {p.githubUrl && (
                                    <span className="text-[9px] font-bold text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded">
                                      GitHub
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                              <button
                                onClick={() => handleDuplicateProject(p)}
                                title="Duplicate Project"
                                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 cursor-pointer"
                              >
                                <Copy size={14} />
                              </button>
                              <button
                                onClick={() => {
                                  setIsCreatingNewProject(false);
                                  setEditingProject({ ...p });
                                }}
                                className="px-3 py-1.5 rounded-lg text-xs font-black uppercase bg-[#FF9F1C] text-black border border-[#1A1A1A] flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_0px_#1A1A1A]"
                              >
                                <Edit3 size={12} /> Edit
                              </button>
                              <button
                                onClick={() => {
                                  if (
                                    window.confirm(
                                      `Delete quest "${p.title}"?`
                                    )
                                  ) {
                                    deleteProject(p.id);
                                  }
                                }}
                                className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 cursor-pointer"
                                title="Delete Project"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    /* Project Form Editor */
                    <form
                      onSubmit={handleSaveProjectForm}
                      className="space-y-6"
                    >
                      <div className="flex items-center justify-between pb-3 border-b-2 border-dashed border-gray-700/30">
                        <h4
                          className={`text-lg font-black ${currentTheme.text} uppercase`}
                        >
                          {isCreatingNewProject
                            ? "Add New Quest"
                            : `Edit: ${editingProject.title}`}
                        </h4>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingProject(null);
                              setIsCreatingNewProject(false);
                            }}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 text-gray-300 cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-1.5 rounded-xl font-black uppercase text-xs bg-[#4ade80] hover:bg-[#3ec470] text-black border border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] flex items-center gap-1.5 cursor-pointer"
                          >
                            <Save size={13} /> Save Project
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Title */}
                        <div>
                          <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">
                            Project Title *
                          </label>
                          <input
                            type="text"
                            required
                            value={editingProject.title || ""}
                            onChange={(e) =>
                              setEditingProject({
                                ...editingProject,
                                title: e.target.value,
                              })
                            }
                            className={`w-full p-2.5 rounded-xl border-2 border-dashed ${currentTheme.inputBorder} ${currentTheme.inputBg} ${currentTheme.text} font-bold text-sm focus:outline-none focus:border-[#FF9F1C]`}
                          />
                        </div>

                        {/* Rarity & Rating */}
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">
                              Rarity
                            </label>
                            <select
                              value={editingProject.rarity || "EPIC"}
                              onChange={(e) =>
                                setEditingProject({
                                  ...editingProject,
                                  rarity: e.target.value,
                                })
                              }
                              className={`w-full p-2.5 rounded-xl border-2 border-dashed ${currentTheme.inputBorder} ${currentTheme.inputBg} ${currentTheme.text} font-bold text-xs focus:outline-none`}
                            >
                              {RARITY_OPTIONS.map((r) => (
                                <option key={r} value={r}>
                                  {r}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">
                              Rating (★)
                            </label>
                            <input
                              type="text"
                              value={editingProject.rating || "4.8"}
                              onChange={(e) =>
                                setEditingProject({
                                  ...editingProject,
                                  rating: e.target.value,
                                })
                              }
                              className={`w-full p-2.5 rounded-xl border-2 border-dashed ${currentTheme.inputBorder} ${currentTheme.inputBg} ${currentTheme.text} font-bold text-xs focus:outline-none`}
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">
                              Color
                            </label>
                            <select
                              value={editingProject.color || "orange"}
                              onChange={(e) =>
                                setEditingProject({
                                  ...editingProject,
                                  color: e.target.value,
                                })
                              }
                              className={`w-full p-2.5 rounded-xl border-2 border-dashed ${currentTheme.inputBorder} ${currentTheme.inputBg} ${currentTheme.text} font-bold text-xs focus:outline-none`}
                            >
                              {COLOR_OPTIONS.map((c) => (
                                <option key={c} value={c}>
                                  {c.toUpperCase()}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Description / Story */}
                      <div>
                        <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">
                          Game Description / Story & Key Features *
                        </label>
                        <textarea
                          rows={4}
                          required
                          value={editingProject.desc || ""}
                          onChange={(e) =>
                            setEditingProject({
                              ...editingProject,
                              desc: e.target.value,
                            })
                          }
                          className={`w-full p-3 rounded-xl border-2 border-dashed ${currentTheme.inputBorder} ${currentTheme.inputBg} ${currentTheme.text} font-medium text-xs focus:outline-none focus:border-[#FF9F1C]`}
                        />
                      </div>

                      {/* Tags */}
                      <div>
                        <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">
                          Tags / Genres (comma-separated, e.g. Unity, Multiplayer, Card Battler)
                        </label>
                        <input
                          type="text"
                          value={
                            Array.isArray(editingProject.tags)
                              ? editingProject.tags.join(", ")
                              : editingProject.tags || ""
                          }
                          onChange={(e) =>
                            setEditingProject({
                              ...editingProject,
                              tags: e.target.value
                                .split(",")
                                .map((t) => t.trim())
                                .filter(Boolean),
                            })
                          }
                          className={`w-full p-2.5 rounded-xl border-2 border-dashed ${currentTheme.inputBorder} ${currentTheme.inputBg} ${currentTheme.text} font-medium text-xs`}
                        />
                      </div>

                      {/* Media URLs */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">
                            Thumbnail Image URL
                          </label>
                          <input
                            type="text"
                            value={editingProject.thumbnailImage || ""}
                            onChange={(e) =>
                              setEditingProject({
                                ...editingProject,
                                thumbnailImage: e.target.value,
                              })
                            }
                            placeholder="https://..."
                            className={`w-full p-2.5 rounded-xl border-2 border-dashed ${currentTheme.inputBorder} ${currentTheme.inputBg} ${currentTheme.text} font-mono text-xs`}
                          />
                          {editingProject.thumbnailImage && (
                            <img
                              src={editingProject.thumbnailImage}
                              alt="Thumbnail preview"
                              className="mt-2 h-20 rounded-lg object-cover border border-gray-700/40"
                              onError={(e) =>
                                (e.currentTarget.style.display = "none")
                              }
                            />
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">
                            YouTube Video ID or URL (Optional trailer)
                          </label>
                          <input
                            type="text"
                            value={editingProject.youtubeId || ""}
                            onChange={(e) =>
                              setEditingProject({
                                ...editingProject,
                                youtubeId: e.target.value,
                              })
                            }
                            placeholder="e.g. dQw4w9WgXcQ or https://youtube.com/watch?v=..."
                            className={`w-full p-2.5 rounded-xl border-2 border-dashed ${currentTheme.inputBorder} ${currentTheme.inputBg} ${currentTheme.text} font-mono text-xs`}
                          />
                        </div>
                      </div>

                      {/* Preview Screenshots Gallery URLs */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-bold text-gray-400 uppercase">
                            Preview Screenshots Gallery URLs ({editingProject.previewImages?.length || 0})
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              const current = editingProject.previewImages || [];
                              setEditingProject({
                                ...editingProject,
                                previewImages: [...current, ""],
                              });
                            }}
                            className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <Plus size={12} /> Add Screenshot URL
                          </button>
                        </div>
                        <div className="space-y-2">
                          {(editingProject.previewImages || []).map(
                            (imgUrl, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-2"
                              >
                                <input
                                  type="text"
                                  value={imgUrl}
                                  placeholder="https://..."
                                  onChange={(e) => {
                                    const updated = [
                                      ...editingProject.previewImages,
                                    ];
                                    updated[idx] = e.target.value;
                                    setEditingProject({
                                      ...editingProject,
                                      previewImages: updated,
                                    });
                                  }}
                                  className={`flex-1 p-2 rounded-lg border-2 border-dashed ${currentTheme.inputBorder} ${currentTheme.inputBg} ${currentTheme.text} font-mono text-xs`}
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated =
                                      editingProject.previewImages.filter(
                                        (_, i) => i !== idx
                                      );
                                    setEditingProject({
                                      ...editingProject,
                                      previewImages: updated,
                                    });
                                  }}
                                  className="text-rose-400 p-1 hover:bg-rose-500/10 rounded cursor-pointer"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            )
                          )}
                        </div>
                      </div>

                      {/* Store & Project Links */}
                      <div>
                        <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">
                          Store & Download Links
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                          <div>
                            <span className="text-[10px] text-emerald-400 font-bold block mb-1">
                              Google Play (Android)
                            </span>
                            <input
                              type="text"
                              value={editingProject.androidUrl || ""}
                              onChange={(e) =>
                                setEditingProject({
                                  ...editingProject,
                                  androidUrl: e.target.value,
                                })
                              }
                              placeholder="https://play.google.com/..."
                              className={`w-full p-2 rounded-lg border ${currentTheme.inputBorder} ${currentTheme.inputBg} ${currentTheme.text} text-xs font-mono`}
                            />
                          </div>

                          <div>
                            <span className="text-[10px] text-sky-400 font-bold block mb-1">
                              Apple App Store (iOS)
                            </span>
                            <input
                              type="text"
                              value={editingProject.iosUrl || ""}
                              onChange={(e) =>
                                setEditingProject({
                                  ...editingProject,
                                  iosUrl: e.target.value,
                                })
                              }
                              placeholder="https://apps.apple.com/..."
                              className={`w-full p-2 rounded-lg border ${currentTheme.inputBorder} ${currentTheme.inputBg} ${currentTheme.text} text-xs font-mono`}
                            />
                          </div>

                          <div>
                            <span className="text-[10px] text-amber-400 font-bold block mb-1">
                              Web / Itch.io URL
                            </span>
                            <input
                              type="text"
                              value={
                                editingProject.webUrl ||
                                editingProject.itchUrl ||
                                ""
                              }
                              onChange={(e) =>
                                setEditingProject({
                                  ...editingProject,
                                  webUrl: e.target.value,
                                  itchUrl: e.target.value,
                                })
                              }
                              placeholder="https://..."
                              className={`w-full p-2 rounded-lg border ${currentTheme.inputBorder} ${currentTheme.inputBg} ${currentTheme.text} text-xs font-mono`}
                            />
                          </div>

                          <div>
                            <span className="text-[10px] text-indigo-400 font-bold block mb-1">
                              Steam Store URL
                            </span>
                            <input
                              type="text"
                              value={editingProject.steamUrl || ""}
                              onChange={(e) =>
                                setEditingProject({
                                  ...editingProject,
                                  steamUrl: e.target.value,
                                })
                              }
                              placeholder="https://store.steampowered.com/..."
                              className={`w-full p-2 rounded-lg border ${currentTheme.inputBorder} ${currentTheme.inputBg} ${currentTheme.text} text-xs font-mono`}
                            />
                          </div>

                          <div>
                            <span className="text-[10px] text-purple-400 font-bold block mb-1">
                              GitHub Repo URL
                            </span>
                            <input
                              type="text"
                              value={editingProject.githubUrl || ""}
                              onChange={(e) =>
                                setEditingProject({
                                  ...editingProject,
                                  githubUrl: e.target.value,
                                })
                              }
                              placeholder="https://github.com/..."
                              className={`w-full p-2 rounded-lg border ${currentTheme.inputBorder} ${currentTheme.inputBg} ${currentTheme.text} text-xs font-mono`}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Technical Challenges & Solutions */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-xs font-bold text-gray-400 uppercase">
                            Technical Challenges & Solutions ({editingProject.challenges?.length || 0})
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              const cur = editingProject.challenges || [];
                              setEditingProject({
                                ...editingProject,
                                challenges: [
                                  ...cur,
                                  { problem: "", resolution: "" },
                                ],
                              });
                            }}
                            className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <Plus size={12} /> Add Challenge
                          </button>
                        </div>

                        <div className="space-y-3">
                          {(editingProject.challenges || []).map(
                            (ch, cIdx) => (
                              <div
                                key={cIdx}
                                className={`p-3 rounded-xl border border-dashed ${currentTheme.inputBorder} ${currentTheme.inputBg} space-y-2`}
                              >
                                <div className="flex justify-between items-center">
                                  <span className="text-[10px] font-bold text-rose-400 uppercase">
                                    Challenge #{cIdx + 1}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated =
                                        editingProject.challenges.filter(
                                          (_, i) => i !== cIdx
                                        );
                                      setEditingProject({
                                        ...editingProject,
                                        challenges: updated,
                                      });
                                    }}
                                    className="text-rose-400 text-xs hover:underline cursor-pointer"
                                  >
                                    Remove
                                  </button>
                                </div>
                                <input
                                  type="text"
                                  placeholder="Problem / Challenge description..."
                                  value={ch.problem}
                                  onChange={(e) => {
                                    const updated = [
                                      ...editingProject.challenges,
                                    ];
                                    updated[cIdx].problem = e.target.value;
                                    setEditingProject({
                                      ...editingProject,
                                      challenges: updated,
                                    });
                                  }}
                                  className={`w-full p-2 rounded-lg border ${currentTheme.inputBorder} bg-black/20 ${currentTheme.text} text-xs font-medium`}
                                />
                                <textarea
                                  rows={2}
                                  placeholder="Resolution / Architecture solution..."
                                  value={ch.resolution}
                                  onChange={(e) => {
                                    const updated = [
                                      ...editingProject.challenges,
                                    ];
                                    updated[cIdx].resolution = e.target.value;
                                    setEditingProject({
                                      ...editingProject,
                                      challenges: updated,
                                    });
                                  }}
                                  className={`w-full p-2 rounded-lg border ${currentTheme.inputBorder} bg-black/20 ${currentTheme.text} text-xs font-medium`}
                                />
                              </div>
                            )
                          )}
                        </div>
                      </div>

                      {/* Metrics */}
                      <div>
                        <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">
                          Project Metrics (Role, Duration, Engine, Team)
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <div>
                            <span className="text-[10px] text-gray-400 block mb-1">
                              Role
                            </span>
                            <input
                              type="text"
                              value={editingProject.metrics?.role || ""}
                              onChange={(e) =>
                                setEditingProject({
                                  ...editingProject,
                                  metrics: {
                                    ...editingProject.metrics,
                                    role: e.target.value,
                                  },
                                })
                              }
                              className={`w-full p-2 rounded-lg border ${currentTheme.inputBorder} ${currentTheme.inputBg} ${currentTheme.text} text-xs`}
                            />
                          </div>
                          <div>
                            <span className="text-[10px] text-gray-400 block mb-1">
                              Duration
                            </span>
                            <input
                              type="text"
                              value={editingProject.metrics?.duration || ""}
                              onChange={(e) =>
                                setEditingProject({
                                  ...editingProject,
                                  metrics: {
                                    ...editingProject.metrics,
                                    duration: e.target.value,
                                  },
                                })
                              }
                              className={`w-full p-2 rounded-lg border ${currentTheme.inputBorder} ${currentTheme.inputBg} ${currentTheme.text} text-xs`}
                            />
                          </div>
                          <div>
                            <span className="text-[10px] text-gray-400 block mb-1">
                              Engine / Tech
                            </span>
                            <input
                              type="text"
                              value={editingProject.metrics?.engine || ""}
                              onChange={(e) =>
                                setEditingProject({
                                  ...editingProject,
                                  metrics: {
                                    ...editingProject.metrics,
                                    engine: e.target.value,
                                  },
                                })
                              }
                              className={`w-full p-2 rounded-lg border ${currentTheme.inputBorder} ${currentTheme.inputBg} ${currentTheme.text} text-xs`}
                            />
                          </div>
                          <div>
                            <span className="text-[10px] text-gray-400 block mb-1">
                              Team Size
                            </span>
                            <input
                              type="text"
                              value={editingProject.metrics?.teamSize || ""}
                              onChange={(e) =>
                                setEditingProject({
                                  ...editingProject,
                                  metrics: {
                                    ...editingProject.metrics,
                                    teamSize: e.target.value,
                                  },
                                })
                              }
                              className={`w-full p-2 rounded-lg border ${currentTheme.inputBorder} ${currentTheme.inputBg} ${currentTheme.text} text-xs`}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t-2 border-dashed border-gray-700/30 flex justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingProject(null);
                            setIsCreatingNewProject(false);
                          }}
                          className="px-4 py-2 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 text-gray-300 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2.5 rounded-xl font-black uppercase text-xs bg-[#4ade80] hover:bg-[#3ec470] text-black border-2 border-[#1A1A1A] shadow-[3px_3px_0px_0px_#1A1A1A] flex items-center gap-1.5 cursor-pointer"
                        >
                          <Save size={14} /> Save Quest
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* ========================================================
                  TAB 2: EXPERIENCE & ROLES
              ======================================================== */}
              {activeTab === "experience" && (
                <div className="space-y-6">
                  {!editingJob ? (
                    <>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <h3
                            className={`text-xl font-black ${currentTheme.text} uppercase tracking-tight`}
                          >
                            Experience & Quest Log ({jobs.length})
                          </h3>
                          <p className={`text-xs ${currentTheme.textMuted}`}>
                            Manage your career timeline, professional positions, and achievements.
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setIsCreatingJob(true);
                            setEditingJobIndex(-1);
                            setEditingJob({
                              title: "Game Developer",
                              company: "Studio Name",
                              location: "Remote",
                              date: "2024 - Present",
                              status: "ACTIVE",
                              xp: "+5000 XP",
                              desc: "Role description overview...",
                              achievements: [
                                "Architected scalable gameplay systems",
                                "Optimized memory and frame rates",
                              ],
                              stack: ["Unity", "C#"],
                              color: "orange",
                            });
                          }}
                          className="px-4 py-2 rounded-xl font-black uppercase text-xs tracking-wider bg-[#9B5DE5] hover:bg-[#8b4fd4] text-white border-2 border-[#1A1A1A] shadow-[3px_3px_0px_0px_#1A1A1A] flex items-center gap-1.5 cursor-pointer transition-all active:translate-y-0.5"
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
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                              <div className="flex items-center gap-3">
                                {/* Reorder buttons */}
                                <div className="flex flex-col gap-0.5">
                                  <button
                                    disabled={idx === 0}
                                    onClick={() => handleMoveJob(idx, -1)}
                                    className="p-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-20 cursor-pointer"
                                    title="Move Up"
                                  >
                                    <ArrowUp size={12} />
                                  </button>
                                  <button
                                    disabled={idx === jobs.length - 1}
                                    onClick={() => handleMoveJob(idx, 1)}
                                    className="p-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-20 cursor-pointer"
                                    title="Move Down"
                                  >
                                    <ArrowDown size={12} />
                                  </button>
                                </div>

                                <div>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h4
                                      className={`text-base font-black ${currentTheme.text}`}
                                    >
                                      {job.title}{" "}
                                      <span className="text-[#FF9F1C]">
                                        @ {job.company}
                                      </span>
                                    </h4>
                                    <span
                                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                        job.status === "ACTIVE"
                                          ? "bg-emerald-500/10 text-emerald-400"
                                          : "bg-gray-500/10 text-gray-400"
                                      }`}
                                    >
                                      {job.status}
                                    </span>
                                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400">
                                      {job.xp}
                                    </span>
                                  </div>
                                  <div className="text-[11px] text-gray-400 mt-0.5">
                                    {job.location} · {job.date}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => {
                                    setIsCreatingJob(false);
                                    setEditingJobIndex(idx);
                                    setEditingJob({ ...job });
                                  }}
                                  className="px-3 py-1.5 rounded-lg text-xs font-black uppercase bg-[#FF9F1C] text-black border border-[#1A1A1A] flex items-center gap-1 cursor-pointer"
                                >
                                  <Edit3 size={12} /> Edit
                                </button>
                                <button
                                  onClick={() => {
                                    if (
                                      window.confirm(
                                        `Delete role "${job.title} at ${job.company}"?`
                                      )
                                    ) {
                                      const updated = jobs.filter(
                                        (_, i) => i !== idx
                                      );
                                      saveJobs(updated);
                                    }
                                  }}
                                  className="text-rose-400 hover:text-rose-300 p-1.5 cursor-pointer rounded hover:bg-rose-500/10"
                                  title="Delete Job"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </div>
                            </div>

                            <p className={`text-xs ${currentTheme.textMuted}`}>
                              {job.desc}
                            </p>

                            <div className="flex flex-wrap gap-1 pt-1">
                              {job.stack?.map((t, i) => (
                                <span
                                  key={i}
                                  className="text-[10px] font-bold bg-white/5 px-2 py-0.5 rounded text-gray-300"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    /* Job Form Editor */
                    <form onSubmit={handleSaveJobForm} className="space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b-2 border-dashed border-gray-700/30">
                        <h4
                          className={`text-lg font-black ${currentTheme.text} uppercase`}
                        >
                          {isCreatingJob
                            ? "Add New Experience Role"
                            : `Edit Role: ${editingJob.title}`}
                        </h4>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingJob(null);
                              setIsCreatingJob(false);
                            }}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 text-gray-300 cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-1.5 rounded-xl font-black uppercase text-xs bg-[#4ade80] hover:bg-[#3ec470] text-black border border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] flex items-center gap-1.5 cursor-pointer"
                          >
                            <Save size={13} /> Save Role
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">
                            Role / Job Title *
                          </label>
                          <input
                            type="text"
                            required
                            value={editingJob.title || ""}
                            onChange={(e) =>
                              setEditingJob({
                                ...editingJob,
                                title: e.target.value,
                              })
                            }
                            className={`w-full p-2.5 rounded-xl border ${currentTheme.inputBorder} ${currentTheme.inputBg} ${currentTheme.text} text-xs font-bold`}
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">
                            Company Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={editingJob.company || ""}
                            onChange={(e) =>
                              setEditingJob({
                                ...editingJob,
                                company: e.target.value,
                              })
                            }
                            className={`w-full p-2.5 rounded-xl border ${currentTheme.inputBorder} ${currentTheme.inputBg} ${currentTheme.text} text-xs font-bold`}
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">
                            Location (e.g. Remote, City)
                          </label>
                          <input
                            type="text"
                            value={editingJob.location || ""}
                            onChange={(e) =>
                              setEditingJob({
                                ...editingJob,
                                location: e.target.value,
                              })
                            }
                            className={`w-full p-2.5 rounded-xl border ${currentTheme.inputBorder} ${currentTheme.inputBg} ${currentTheme.text} text-xs font-bold`}
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">
                            Date Period (e.g. Aug 2023 - Present)
                          </label>
                          <input
                            type="text"
                            value={editingJob.date || ""}
                            onChange={(e) =>
                              setEditingJob({
                                ...editingJob,
                                date: e.target.value,
                              })
                            }
                            className={`w-full p-2.5 rounded-xl border ${currentTheme.inputBorder} ${currentTheme.inputBg} ${currentTheme.text} text-xs font-bold`}
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">
                            Status
                          </label>
                          <select
                            value={editingJob.status || "ACTIVE"}
                            onChange={(e) =>
                              setEditingJob({
                                ...editingJob,
                                status: e.target.value,
                              })
                            }
                            className={`w-full p-2.5 rounded-xl border ${currentTheme.inputBorder} ${currentTheme.inputBg} ${currentTheme.text} text-xs font-bold`}
                          >
                            {STATUS_OPTIONS.map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">
                            XP Reward (e.g. +5000 XP)
                          </label>
                          <input
                            type="text"
                            value={editingJob.xp || "+5000 XP"}
                            onChange={(e) =>
                              setEditingJob({
                                ...editingJob,
                                xp: e.target.value,
                              })
                            }
                            className={`w-full p-2.5 rounded-xl border ${currentTheme.inputBorder} ${currentTheme.inputBg} ${currentTheme.text} text-xs font-bold`}
                          />
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">
                          Role Overview Description
                        </label>
                        <textarea
                          rows={3}
                          value={editingJob.desc || ""}
                          onChange={(e) =>
                            setEditingJob({
                              ...editingJob,
                              desc: e.target.value,
                            })
                          }
                          className={`w-full p-2.5 rounded-xl border ${currentTheme.inputBorder} ${currentTheme.inputBg} ${currentTheme.text} text-xs font-medium`}
                        />
                      </div>

                      {/* Achievements List */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-bold text-gray-400 uppercase">
                            Key Achievements & Responsibilities ({editingJob.achievements?.length || 0})
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              const cur = editingJob.achievements || [];
                              setEditingJob({
                                ...editingJob,
                                achievements: [...cur, ""],
                              });
                            }}
                            className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <Plus size={12} /> Add Achievement Bullet
                          </button>
                        </div>

                        <div className="space-y-2">
                          {(editingJob.achievements || []).map((ach, aIdx) => (
                            <div key={aIdx} className="flex items-center gap-2">
                              <input
                                type="text"
                                value={ach}
                                placeholder="Key achievement..."
                                onChange={(e) => {
                                  const updated = [...editingJob.achievements];
                                  updated[aIdx] = e.target.value;
                                  setEditingJob({
                                    ...editingJob,
                                    achievements: updated,
                                  });
                                }}
                                className={`flex-1 p-2 rounded-lg border ${currentTheme.inputBorder} ${currentTheme.inputBg} ${currentTheme.text} text-xs`}
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const updated =
                                    editingJob.achievements.filter(
                                      (_, i) => i !== aIdx
                                    );
                                  setEditingJob({
                                    ...editingJob,
                                    achievements: updated,
                                  });
                                }}
                                className="text-rose-400 p-1 hover:bg-rose-500/10 rounded cursor-pointer"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Tech Stack */}
                      <div>
                        <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">
                          Tech Stack Tags (comma-separated, e.g. Unity, C#, Netcode, Sockets)
                        </label>
                        <input
                          type="text"
                          value={
                            Array.isArray(editingJob.stack)
                              ? editingJob.stack.join(", ")
                              : editingJob.stack || ""
                          }
                          onChange={(e) =>
                            setEditingJob({
                              ...editingJob,
                              stack: e.target.value
                                .split(",")
                                .map((s) => s.trim())
                                .filter(Boolean),
                            })
                          }
                          className={`w-full p-2.5 rounded-xl border ${currentTheme.inputBorder} ${currentTheme.inputBg} ${currentTheme.text} text-xs`}
                        />
                      </div>

                      <div className="pt-3 border-t border-dashed border-gray-700/30 flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingJob(null);
                            setIsCreatingJob(false);
                          }}
                          className="px-4 py-2 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 text-gray-300 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 rounded-xl font-black uppercase text-xs bg-[#4ade80] hover:bg-[#3ec470] text-black border border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] flex items-center gap-1.5 cursor-pointer"
                        >
                          <Save size={13} /> Save Role
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* ========================================================
                  TAB 3: SKILLS TREE
              ======================================================== */}
              {activeTab === "skills" && (
                <div className="space-y-6">
                  {!editingBranch ? (
                    <>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <h3
                            className={`text-xl font-black ${currentTheme.text} uppercase tracking-tight`}
                          >
                            Skill Tree & Branches ({skills.length})
                          </h3>
                          <p className={`text-xs ${currentTheme.textMuted}`}>
                            Organize your competencies, technical branches, and capability pills.
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setIsCreatingBranch(true);
                            setEditingBranchIndex(-1);
                            setEditingBranch({
                              id: `branch-${Date.now()}`,
                              category: "New Skill Branch",
                              icon: "Sparkles",
                              color: "teal",
                              skills: [
                                {
                                  name: "Skill Node",
                                  icon: "Sparkles",
                                  capabilities: ["Capability 1", "Capability 2"],
                                },
                              ],
                            });
                          }}
                          className="px-4 py-2 rounded-xl font-black uppercase text-xs tracking-wider bg-[#2EC4B6] hover:bg-[#25ab9e] text-black border-2 border-[#1A1A1A] shadow-[3px_3px_0px_0px_#1A1A1A] flex items-center gap-1.5 cursor-pointer transition-all active:translate-y-0.5"
                        >
                          <Plus size={14} /> Add Skill Branch
                        </button>
                      </div>

                      <div className="space-y-4">
                        {skills.map((branch, bIdx) => (
                          <div
                            key={bIdx}
                            className={`p-4 rounded-xl border-2 border-dashed ${currentTheme.inputBorder} ${currentTheme.cardBg} space-y-3`}
                          >
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`p-1.5 rounded-lg ${
                                    COLORS[branch.color || "teal"]?.bg ||
                                    "bg-teal-400"
                                  } text-black font-black text-xs`}
                                >
                                  {branch.icon || "Sparkles"}
                                </span>
                                <h4
                                  className={`text-base font-black ${currentTheme.text}`}
                                >
                                  {branch.category}
                                </h4>
                                <span className="text-[10px] font-bold text-gray-400">
                                  ({branch.skills?.length || 0} skills)
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => {
                                    setIsCreatingBranch(false);
                                    setEditingBranchIndex(bIdx);
                                    setEditingBranch({ ...branch });
                                  }}
                                  className="px-3 py-1.5 rounded-lg text-xs font-black uppercase bg-[#FF9F1C] text-black border border-[#1A1A1A] flex items-center gap-1 cursor-pointer"
                                >
                                  <Edit3 size={12} /> Edit
                                </button>
                                <button
                                  onClick={() => {
                                    if (
                                      window.confirm(
                                        `Delete skill branch "${branch.category}"?`
                                      )
                                    ) {
                                      const updated = skills.filter(
                                        (_, i) => i !== bIdx
                                      );
                                      saveSkills(updated);
                                    }
                                  }}
                                  className="text-rose-400 hover:text-rose-300 p-1.5 cursor-pointer rounded hover:bg-rose-500/10"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </div>
                            </div>

                            {/* Skills inside this branch preview */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-dashed border-gray-700/20">
                              {branch.skills?.map((s, sIdx) => (
                                <div
                                  key={sIdx}
                                  className="p-2 rounded-lg bg-white/5 border border-white/5"
                                >
                                  <div className="text-xs font-bold text-white mb-1">
                                    {s.name}
                                  </div>
                                  <div className="flex flex-wrap gap-1">
                                    {s.capabilities?.map((c, cIdx) => (
                                      <span
                                        key={cIdx}
                                        className="text-[9px] font-medium bg-black/30 px-1.5 py-0.5 rounded text-gray-300"
                                      >
                                        {c}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    /* Branch Form Editor */
                    <form
                      onSubmit={handleSaveBranchForm}
                      className="space-y-4"
                    >
                      <div className="flex items-center justify-between pb-3 border-b-2 border-dashed border-gray-700/30">
                        <h4
                          className={`text-lg font-black ${currentTheme.text} uppercase`}
                        >
                          {isCreatingBranch
                            ? "Add New Skill Branch"
                            : `Edit Branch: ${editingBranch.category}`}
                        </h4>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingBranch(null);
                              setIsCreatingBranch(false);
                            }}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 text-gray-300 cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-1.5 rounded-xl font-black uppercase text-xs bg-[#4ade80] hover:bg-[#3ec470] text-black border border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] flex items-center gap-1.5 cursor-pointer"
                          >
                            <Save size={13} /> Save Branch
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">
                            Branch Category Title *
                          </label>
                          <input
                            type="text"
                            required
                            value={editingBranch.category || ""}
                            onChange={(e) =>
                              setEditingBranch({
                                ...editingBranch,
                                category: e.target.value,
                              })
                            }
                            className={`w-full p-2.5 rounded-xl border ${currentTheme.inputBorder} ${currentTheme.inputBg} ${currentTheme.text} text-xs font-bold`}
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">
                            Icon Name (e.g. Layers, Cpu, Radio, Sparkles, Terminal)
                          </label>
                          <input
                            type="text"
                            value={editingBranch.icon || "Layers"}
                            onChange={(e) =>
                              setEditingBranch({
                                ...editingBranch,
                                icon: e.target.value,
                              })
                            }
                            className={`w-full p-2.5 rounded-xl border ${currentTheme.inputBorder} ${currentTheme.inputBg} ${currentTheme.text} text-xs font-bold`}
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">
                            Color Theme
                          </label>
                          <select
                            value={editingBranch.color || "teal"}
                            onChange={(e) =>
                              setEditingBranch({
                                ...editingBranch,
                                color: e.target.value,
                              })
                            }
                            className={`w-full p-2.5 rounded-xl border ${currentTheme.inputBorder} ${currentTheme.inputBg} ${currentTheme.text} text-xs font-bold`}
                          >
                            {COLOR_OPTIONS.map((c) => (
                              <option key={c} value={c}>
                                {c.toUpperCase()}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Skills inside this branch */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-xs font-bold text-gray-400 uppercase">
                            Skills & Capabilities ({editingBranch.skills?.length || 0})
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              const cur = editingBranch.skills || [];
                              setEditingBranch({
                                ...editingBranch,
                                skills: [
                                  ...cur,
                                  {
                                    name: "New Skill Node",
                                    icon: "Sparkles",
                                    capabilities: [
                                      "Capability 1",
                                      "Capability 2",
                                    ],
                                  },
                                ],
                              });
                            }}
                            className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <Plus size={12} /> Add Skill Node
                          </button>
                        </div>

                        <div className="space-y-3">
                          {(editingBranch.skills || []).map((sk, skIdx) => (
                            <div
                              key={skIdx}
                              className={`p-3 rounded-xl border border-dashed ${currentTheme.inputBorder} ${currentTheme.inputBg} space-y-2`}
                            >
                              <div className="flex justify-between items-center gap-2">
                                <span className="text-[10px] font-bold text-teal-400 uppercase">
                                  Skill Node #{skIdx + 1}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated =
                                      editingBranch.skills.filter(
                                        (_, i) => i !== skIdx
                                      );
                                    setEditingBranch({
                                      ...editingBranch,
                                      skills: updated,
                                    });
                                  }}
                                  className="text-rose-400 text-xs hover:underline cursor-pointer"
                                >
                                  Remove
                                </button>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <div>
                                  <label className="text-[10px] text-gray-400 uppercase block mb-1">
                                    Skill Name
                                  </label>
                                  <input
                                    type="text"
                                    value={sk.name || ""}
                                    onChange={(e) => {
                                      const updated = [
                                        ...editingBranch.skills,
                                      ];
                                      updated[skIdx].name = e.target.value;
                                      setEditingBranch({
                                        ...editingBranch,
                                        skills: updated,
                                      });
                                    }}
                                    className={`w-full p-2 rounded-lg border ${currentTheme.inputBorder} bg-black/20 ${currentTheme.text} text-xs font-bold`}
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] text-gray-400 uppercase block mb-1">
                                    Icon Name (e.g. Layers, Terminal, Sparkles)
                                  </label>
                                  <input
                                    type="text"
                                    value={sk.icon || "Sparkles"}
                                    onChange={(e) => {
                                      const updated = [
                                        ...editingBranch.skills,
                                      ];
                                      updated[skIdx].icon = e.target.value;
                                      setEditingBranch({
                                        ...editingBranch,
                                        skills: updated,
                                      });
                                    }}
                                    className={`w-full p-2 rounded-lg border ${currentTheme.inputBorder} bg-black/20 ${currentTheme.text} text-xs font-bold`}
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="text-[10px] text-gray-400 uppercase block mb-1">
                                  Capabilities (comma-separated, e.g. Addressables, DOTS, Optimization)
                                </label>
                                <input
                                  type="text"
                                  value={
                                    Array.isArray(sk.capabilities)
                                      ? sk.capabilities.join(", ")
                                      : sk.capabilities || ""
                                  }
                                  onChange={(e) => {
                                    const updated = [
                                      ...editingBranch.skills,
                                    ];
                                    updated[skIdx].capabilities = e.target.value
                                      .split(",")
                                      .map((c) => c.trim())
                                      .filter(Boolean);
                                    setEditingBranch({
                                      ...editingBranch,
                                      skills: updated,
                                    });
                                  }}
                                  className={`w-full p-2 rounded-lg border ${currentTheme.inputBorder} bg-black/20 ${currentTheme.text} text-xs`}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-dashed border-gray-700/30 flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingBranch(null);
                            setIsCreatingBranch(false);
                          }}
                          className="px-4 py-2 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 text-gray-300 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 rounded-xl font-black uppercase text-xs bg-[#4ade80] hover:bg-[#3ec470] text-black border border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] flex items-center gap-1.5 cursor-pointer"
                        >
                          <Save size={13} /> Save Branch
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* ========================================================
                  TAB 4: PROFILE & HERO
              ======================================================== */}
              {activeTab === "profile" && (
                <form onSubmit={handleSaveProfile} className="space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b-2 border-dashed border-gray-700/30">
                    <div>
                      <h3
                        className={`text-xl font-black ${currentTheme.text} uppercase tracking-tight`}
                      >
                        Profile & Hero Section
                      </h3>
                      <p className={`text-xs ${currentTheme.textMuted}`}>
                        Update your name, title, level, avatar, typewriter phrases, and About Me bio.
                      </p>
                    </div>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl font-black uppercase text-xs tracking-wider bg-[#4ade80] hover:bg-[#3ec470] text-black border-2 border-[#1A1A1A] shadow-[3px_3px_0px_0px_#1A1A1A] flex items-center gap-1.5 cursor-pointer"
                    >
                      <Save size={14} /> Save Profile Changes
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Name */}
                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={profileForm.name || ""}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            name: e.target.value,
                          })
                        }
                        className={`w-full p-2.5 rounded-xl border ${currentTheme.inputBorder} ${currentTheme.inputBg} ${currentTheme.text} font-black text-sm`}
                      />
                    </div>

                    {/* Professional Title / Class */}
                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">
                        Title / Role (e.g. Game Developer)
                      </label>
                      <input
                        type="text"
                        value={profileForm.title || ""}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            title: e.target.value,
                          })
                        }
                        className={`w-full p-2.5 rounded-xl border ${currentTheme.inputBorder} ${currentTheme.inputBg} ${currentTheme.text} font-bold text-sm`}
                      />
                    </div>

                    {/* Level Badge Text */}
                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">
                        Level Badge Text (e.g. LVL 24 DEV)
                      </label>
                      <input
                        type="text"
                        value={profileForm.levelText || ""}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            levelText: e.target.value,
                          })
                        }
                        className={`w-full p-2.5 rounded-xl border ${currentTheme.inputBorder} ${currentTheme.inputBg} ${currentTheme.text} font-bold text-sm`}
                      />
                    </div>
                  </div>

                  {/* Avatar URL & Live Preview */}
                  <div className="p-4 rounded-xl border border-dashed border-gray-700/30 bg-black/20 flex flex-col sm:flex-row items-center gap-4">
                    <img
                      src={
                        profileForm.avatarUrl ||
                        "https://api.dicebear.com/9.x/notionists/svg?seed=Riley"
                      }
                      alt="Avatar Preview"
                      className="w-20 h-20 rounded-full border-2 border-[#FF9F1C] bg-[#FFE5D9] object-cover"
                    />
                    <div className="flex-1 w-full space-y-1">
                      <label className="block text-xs font-bold text-gray-400 uppercase">
                        Avatar Image URL
                      </label>
                      <input
                        type="text"
                        value={profileForm.avatarUrl || ""}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            avatarUrl: e.target.value,
                          })
                        }
                        placeholder="https://..."
                        className={`w-full p-2 rounded-lg border ${currentTheme.inputBorder} ${currentTheme.inputBg} ${currentTheme.text} text-xs font-mono`}
                      />
                      <div className="flex gap-2 pt-1 flex-wrap">
                        {["Riley", "Felix", "Avery", "Sam"].map((seed) => (
                          <button
                            key={seed}
                            type="button"
                            onClick={() =>
                              setProfileForm({
                                ...profileForm,
                                avatarUrl: `https://api.dicebear.com/9.x/notionists/svg?seed=${seed}`,
                              })
                            }
                            className="text-[10px] text-amber-400 hover:underline cursor-pointer"
                          >
                            Set Avatar: {seed}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Availability Badge */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="isAvail"
                        checked={profileForm.isAvailable !== false}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            isAvailable: e.target.checked,
                          })
                        }
                        className="w-4 h-4 rounded text-emerald-500 cursor-pointer"
                      />
                      <label
                        htmlFor="isAvail"
                        className="text-xs font-bold text-gray-300 uppercase cursor-pointer"
                      >
                        Show Availability Badge
                      </label>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">
                        Availability Status Text
                      </label>
                      <input
                        type="text"
                        value={profileForm.availabilityText || ""}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            availabilityText: e.target.value,
                          })
                        }
                        className={`w-full p-2.5 rounded-xl border ${currentTheme.inputBorder} ${currentTheme.inputBg} ${currentTheme.text} font-medium text-xs`}
                      />
                    </div>
                  </div>

                  {/* Typewriter Rotating Phrases */}
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">
                      Typewriter Specialization Phrases (one per line or comma-separated)
                    </label>
                    <textarea
                      rows={3}
                      value={
                        Array.isArray(profileForm.typewriterWords)
                          ? profileForm.typewriterWords.join("\n")
                          : profileForm.typewriterWords || ""
                      }
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          typewriterWords: e.target.value
                            .split("\n")
                            .map((s) => s.trim())
                            .filter(Boolean),
                        })
                      }
                      className={`w-full p-2.5 rounded-xl border ${currentTheme.inputBorder} ${currentTheme.inputBg} ${currentTheme.text} font-medium text-xs`}
                    />
                  </div>

                  {/* Resume URL */}
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">
                      Resume / CV Link (Google Drive, Dropbox, or PDF URL)
                    </label>
                    <input
                      type="text"
                      value={profileForm.resumeUrl || ""}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          resumeUrl: e.target.value,
                        })
                      }
                      placeholder="https://drive.google.com/... or https://..."
                      className={`w-full p-2.5 rounded-xl border ${currentTheme.inputBorder} ${currentTheme.inputBg} ${currentTheme.text} font-mono text-xs`}
                    />
                  </div>

                  {/* About Me Section Bio */}
                  <div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-1">
                      <label className="block text-xs font-bold text-gray-400 uppercase">
                        About Me Section Title
                      </label>
                      <input
                        type="text"
                        value={profileForm.aboutTitle || "★ ABOUT ME ★"}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            aboutTitle: e.target.value,
                          })
                        }
                        className={`w-full sm:col-span-2 p-2 rounded-lg border ${currentTheme.inputBorder} ${currentTheme.inputBg} ${currentTheme.text} text-xs font-bold`}
                      />
                    </div>

                    <label className="block text-xs font-bold text-gray-400 mb-1 uppercase mt-3">
                      About Me Paragraphs (Separate paragraphs with blank lines)
                    </label>
                    <textarea
                      rows={6}
                      value={profileForm.aboutText || ""}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          aboutText: e.target.value,
                        })
                      }
                      className={`w-full p-3 rounded-xl border ${currentTheme.inputBorder} ${currentTheme.inputBg} ${currentTheme.text} font-medium text-xs leading-relaxed`}
                    />
                  </div>

                  <div className="pt-4 border-t border-dashed border-gray-700/30 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl font-black uppercase text-xs bg-[#4ade80] hover:bg-[#3ec470] text-black border-2 border-[#1A1A1A] shadow-[3px_3px_0px_0px_#1A1A1A] flex items-center gap-1.5 cursor-pointer"
                    >
                      <Save size={14} /> Save Profile Changes
                    </button>
                  </div>
                </form>
              )}

              {/* ========================================================
                  TAB 5: STATS, CONTACT & FOOTER
              ======================================================== */}
              {activeTab === "stats_contact" && (
                <div className="space-y-8">
                  {/* Character Stats Counters */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-dashed border-gray-700/30">
                      <div>
                        <h4
                          className={`text-lg font-black ${currentTheme.text} uppercase`}
                        >
                          Character Sheet Stats Cards
                        </h4>
                        <p className={`text-xs ${currentTheme.textMuted}`}>
                          Stat badges displayed near the top of the homepage (e.g. Projects Completed, Cups of Coffee).
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          saveStats([
                            ...stats,
                            {
                              icon: "Star",
                              val: "100+",
                              label: "New Stat",
                              color: "teal",
                            },
                          ]);
                        }}
                        className="px-3 py-1.5 rounded-xl font-black uppercase text-xs bg-[#2EC4B6] text-black flex items-center gap-1 cursor-pointer border border-[#1A1A1A]"
                      >
                        <Plus size={12} /> Add Stat Card
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                      {stats.map((st, sIdx) => (
                        <div
                          key={sIdx}
                          className={`p-3 rounded-xl border-2 border-dashed ${currentTheme.inputBorder} ${currentTheme.cardBg} space-y-2`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-gray-400">
                              Stat #{sIdx + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = stats.filter(
                                  (_, i) => i !== sIdx
                                );
                                saveStats(updated);
                              }}
                              className="text-rose-400 hover:text-rose-300 p-1 cursor-pointer"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>

                          <div>
                            <span className="text-[10px] text-gray-400 block mb-0.5">
                              Value
                            </span>
                            <input
                              type="text"
                              value={st.val}
                              onChange={(e) => {
                                const updated = [...stats];
                                updated[sIdx].val = e.target.value;
                                saveStats(updated);
                              }}
                              className={`w-full p-1.5 rounded border ${currentTheme.inputBorder} bg-black/20 ${currentTheme.text} text-sm font-black`}
                            />
                          </div>

                          <div>
                            <span className="text-[10px] text-gray-400 block mb-0.5">
                              Label
                            </span>
                            <input
                              type="text"
                              value={st.label}
                              onChange={(e) => {
                                const updated = [...stats];
                                updated[sIdx].label = e.target.value;
                                saveStats(updated);
                              }}
                              className={`w-full p-1.5 rounded border ${currentTheme.inputBorder} bg-black/20 ${currentTheme.text} text-xs font-bold`}
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <span className="text-[10px] text-gray-400 block mb-0.5">
                                Icon
                              </span>
                              <input
                                type="text"
                                value={st.icon || "Code"}
                                onChange={(e) => {
                                  const updated = [...stats];
                                  updated[sIdx].icon = e.target.value;
                                  saveStats(updated);
                                }}
                                className={`w-full p-1.5 rounded border ${currentTheme.inputBorder} bg-black/20 ${currentTheme.text} text-xs font-bold`}
                              />
                            </div>
                            <div>
                              <span className="text-[10px] text-gray-400 block mb-0.5">
                                Color
                              </span>
                              <select
                                value={st.color || "teal"}
                                onChange={(e) => {
                                  const updated = [...stats];
                                  updated[sIdx].color = e.target.value;
                                  saveStats(updated);
                                }}
                                className={`w-full p-1.5 rounded border ${currentTheme.inputBorder} bg-black/20 ${currentTheme.text} text-xs`}
                              >
                                {COLOR_OPTIONS.map((c) => (
                                  <option key={c} value={c}>
                                    {c}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Contact Section Settings */}
                  <div className="space-y-4 pt-4 border-t-2 border-dashed border-gray-700/30">
                    <h4
                      className={`text-lg font-black ${currentTheme.text} uppercase`}
                    >
                      Contact Form & Destination Email
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">
                          Contact / Inquiries Destination Email *
                        </label>
                        <input
                          type="email"
                          value={profileForm.contactEmail || ""}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              contactEmail: e.target.value,
                            })
                          }
                          className={`w-full p-2.5 rounded-xl border ${currentTheme.inputBorder} ${currentTheme.inputBg} ${currentTheme.text} font-bold text-xs`}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">
                          Side Quest Card Headline
                        </label>
                        <input
                          type="text"
                          value={profileForm.contactHeading || "Let's Team Up!"}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              contactHeading: e.target.value,
                            })
                          }
                          className={`w-full p-2.5 rounded-xl border ${currentTheme.inputBorder} ${currentTheme.inputBg} ${currentTheme.text} font-bold text-xs`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">
                        Side Quest Introductory Message
                      </label>
                      <textarea
                        rows={2}
                        value={profileForm.contactText || ""}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            contactText: e.target.value,
                          })
                        }
                        className={`w-full p-2.5 rounded-xl border ${currentTheme.inputBorder} ${currentTheme.inputBg} ${currentTheme.text} text-xs font-medium`}
                      />
                    </div>
                  </div>

                  {/* Footer Settings */}
                  <div className="space-y-4 pt-4 border-t-2 border-dashed border-gray-700/30">
                    <h4
                      className={`text-lg font-black ${currentTheme.text} uppercase`}
                    >
                      Footer Details
                    </h4>

                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">
                        Footer Tagline
                      </label>
                      <input
                        type="text"
                        value={profileForm.footerTagline || ""}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            footerTagline: e.target.value,
                          })
                        }
                        className={`w-full p-2.5 rounded-xl border ${currentTheme.inputBorder} ${currentTheme.inputBg} ${currentTheme.text} text-xs font-medium`}
                      />
                    </div>
                  </div>

                  {/* Social Links List */}
                  <div className="space-y-4 pt-4 border-t-2 border-dashed border-gray-700/30">
                    <div className="flex items-center justify-between">
                      <h4
                        className={`text-lg font-black ${currentTheme.text} uppercase`}
                      >
                        Social Profiles & Links
                      </h4>
                      <button
                        type="button"
                        onClick={() => {
                          const cur = profileForm.socialLinks || [];
                          setProfileForm({
                            ...profileForm,
                            socialLinks: [
                              ...cur,
                              {
                                platform: "custom",
                                label: "New Link",
                                href: "https://",
                                icon: "Globe",
                                color: "purple",
                              },
                            ],
                          });
                        }}
                        className="px-3 py-1.5 rounded-xl font-black uppercase text-xs bg-[#FF9F1C] text-black border border-[#1A1A1A] flex items-center gap-1 cursor-pointer"
                      >
                        <Plus size={12} /> Add Link
                      </button>
                    </div>

                    <div className="space-y-2">
                      {(profileForm.socialLinks || []).map((soc, sIdx) => (
                        <div
                          key={sIdx}
                          className="flex flex-col sm:flex-row items-center gap-2 p-2 rounded-xl border border-dashed border-gray-700/30 bg-black/20"
                        >
                          <input
                            type="text"
                            placeholder="Label (e.g. GitHub)"
                            value={soc.label}
                            onChange={(e) => {
                              const updated = [...profileForm.socialLinks];
                              updated[sIdx].label = e.target.value;
                              setProfileForm({
                                ...profileForm,
                                socialLinks: updated,
                              });
                            }}
                            className={`w-full sm:w-36 p-1.5 rounded border ${currentTheme.inputBorder} ${currentTheme.inputBg} ${currentTheme.text} text-xs font-bold`}
                          />
                          <input
                            type="text"
                            placeholder="URL (https://...)"
                            value={soc.href}
                            onChange={(e) => {
                              const updated = [...profileForm.socialLinks];
                              updated[sIdx].href = e.target.value;
                              setProfileForm({
                                ...profileForm,
                                socialLinks: updated,
                              });
                            }}
                            className={`flex-1 w-full p-1.5 rounded border ${currentTheme.inputBorder} ${currentTheme.inputBg} ${currentTheme.text} text-xs font-mono`}
                          />
                          <input
                            type="text"
                            placeholder="Icon (Github, Twitter, Mail, Itch)"
                            value={soc.icon || "Globe"}
                            onChange={(e) => {
                              const updated = [...profileForm.socialLinks];
                              updated[sIdx].icon = e.target.value;
                              setProfileForm({
                                ...profileForm,
                                socialLinks: updated,
                              });
                            }}
                            className={`w-full sm:w-28 p-1.5 rounded border ${currentTheme.inputBorder} ${currentTheme.inputBg} ${currentTheme.text} text-xs font-bold`}
                          />
                          <select
                            value={soc.color || "purple"}
                            onChange={(e) => {
                              const updated = [...profileForm.socialLinks];
                              updated[sIdx].color = e.target.value;
                              setProfileForm({
                                ...profileForm,
                                socialLinks: updated,
                              });
                            }}
                            className={`w-full sm:w-24 p-1.5 rounded border ${currentTheme.inputBorder} ${currentTheme.inputBg} ${currentTheme.text} text-xs font-bold`}
                          >
                            {COLOR_OPTIONS.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = profileForm.socialLinks.filter(
                                (_, i) => i !== sIdx
                              );
                              setProfileForm({
                                ...profileForm,
                                socialLinks: updated,
                              });
                            }}
                            className="text-rose-400 p-1 hover:bg-rose-500/10 rounded cursor-pointer"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-dashed border-gray-700/30 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleSaveProfile(new Event("submit"))}
                      className="px-6 py-2.5 rounded-xl font-black uppercase text-xs bg-[#4ade80] hover:bg-[#3ec470] text-black border-2 border-[#1A1A1A] shadow-[3px_3px_0px_0px_#1A1A1A] flex items-center gap-1.5 cursor-pointer"
                    >
                      <Save size={14} /> Save Contact & Social Changes
                    </button>
                  </div>
                </div>
              )}

              {/* ========================================================
                  TAB 6: FIREBASE & BACKUP
              ======================================================== */}
              {activeTab === "database" && (
                <div className="space-y-8">
                  {/* Status Callout Card */}
                  <div
                    className={`p-5 rounded-2xl border-2 border-dashed ${
                      isLive
                        ? "border-emerald-500/50 bg-emerald-500/5"
                        : "border-amber-500/50 bg-amber-500/5"
                    } flex flex-col md:flex-row md:items-center justify-between gap-4`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2.5 rounded-xl ${
                          isLive
                            ? "bg-emerald-500 text-black"
                            : "bg-amber-500 text-black"
                        }`}
                      >
                        <Database size={24} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4
                            className={`text-lg font-black ${currentTheme.text}`}
                          >
                            {isLive
                              ? "Firebase Firestore Connected"
                              : "Local Storage Mode Active"}
                          </h4>
                          <span
                            className={`w-2.5 h-2.5 rounded-full ${
                              isLive
                                ? "bg-emerald-400 animate-pulse"
                                : "bg-amber-400"
                            }`}
                          />
                        </div>
                        <p
                          className={`text-xs ${currentTheme.textMuted} mt-0.5 leading-relaxed`}
                        >
                          {isLive
                            ? "All project, experience, skills, and profile edits are saved directly to Google Cloud Firestore and sync live."
                            : "Changes are currently saved only to this browser's localStorage. Configure Firebase below to sync across all visitors without code redeploys."}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={handleSeedNow}
                        className="px-4 py-2 rounded-xl text-xs font-black uppercase bg-[#4ade80] hover:bg-[#3ec470] text-black border border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] cursor-pointer flex items-center gap-1.5"
                      >
                        <Upload size={14} /> Push All to Firebase
                      </button>
                      <button
                        type="button"
                        onClick={handlePullFromFirestore}
                        className="px-4 py-2 rounded-xl text-xs font-black uppercase bg-white/10 hover:bg-white/20 text-white border border-[#1A1A1A] cursor-pointer flex items-center gap-1.5"
                      >
                        <RefreshCw size={14} /> Sync from Firebase
                      </button>
                    </div>
                  </div>

                  {dbSaveStatus && (
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-2">
                      <Sparkles size={14} />
                      {dbSaveStatus}
                    </div>
                  )}

                  {/* 60-Second Firebase Setup Guide Accordion */}
                  <div className="p-5 rounded-2xl border-2 border-dashed border-gray-700/40 bg-black/25 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4
                        className={`text-sm font-black ${currentTheme.text} uppercase tracking-wider flex items-center gap-2`}
                      >
                        <Sparkles size={16} className="text-[#FF9F1C]" />
                        Easy 60-Second Firebase Setup Guide
                      </h4>
                      <button
                        type="button"
                        onClick={copySecurityRules}
                        className="px-3 py-1 rounded-lg text-xs font-bold bg-[#FF9F1C] text-black border border-[#1A1A1A] cursor-pointer flex items-center gap-1"
                      >
                        {copiedRules ? (
                          <>
                            <Check size={12} /> Copied!
                          </>
                        ) : (
                          <>
                            <Copy size={12} /> Copy Firestore Rules
                          </>
                        )}
                      </button>
                    </div>

                    <ol className="text-xs text-gray-300 space-y-1.5 list-decimal list-inside leading-relaxed font-medium">
                      <li>
                        Go to{" "}
                        <a
                          href="https://console.firebase.google.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#FF9F1C] underline font-bold"
                        >
                          Firebase Console
                        </a>{" "}
                        and click <strong>Add Project</strong> (Free Spark plan).
                      </li>
                      <li>
                        Navigate to <strong>Build &gt; Firestore Database</strong> &gt; click <strong>Create Database</strong>.
                      </li>
                      <li>
                        In the <strong>Rules</strong> tab of Firestore, paste the public read/write rules (click "Copy Firestore Rules" button above):
                        <pre className="mt-1 p-2 rounded bg-black/40 font-mono text-[11px] text-emerald-400 overflow-x-auto">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}`}
                        </pre>
                      </li>
                      <li>
                        Click <strong>Project Settings (gear icon) &gt; General &gt; Your apps &gt; Web (&lt;/&gt;)</strong>, register an app, copy the config values, paste them into the form below, and click <strong>Connect to Firebase</strong>!
                      </li>
                    </ol>
                  </div>

                  {/* Firebase Config Form */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4
                        className={`text-base font-black ${currentTheme.text} uppercase`}
                      >
                        Firebase Credentials & Configuration
                      </h4>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={handleTestConnection}
                          disabled={testStatus === "testing"}
                          className="px-3 py-1.5 rounded-xl text-xs font-black uppercase bg-white/10 hover:bg-white/15 text-white border border-[#1A1A1A] flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          <RefreshCw
                            size={12}
                            className={
                              testStatus === "testing" ? "animate-spin" : ""
                            }
                          />
                          Test Connection
                        </button>
                        <button
                          type="button"
                          onClick={handleSaveFirebase}
                          className="px-4 py-1.5 rounded-xl font-black uppercase text-xs bg-[#FF9F1C] hover:bg-[#e88f17] text-black border border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] flex items-center gap-1.5 cursor-pointer"
                        >
                          <Save size={13} /> Save & Reconnect
                        </button>
                      </div>
                    </div>

                    {testMessage && (
                      <div
                        className={`p-3 rounded-xl border text-xs font-bold whitespace-pre-line ${
                          testStatus === "success"
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                            : testStatus === "error"
                            ? "bg-rose-500/10 border-rose-500/30 text-rose-300"
                            : "bg-sky-500/10 border-sky-500/30 text-sky-300"
                        }`}
                      >
                        {testMessage}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">
                          API Key *
                        </label>
                        <input
                          type="text"
                          value={firebaseConfig.apiKey || ""}
                          onChange={(e) =>
                            setFirebaseConfig({
                              ...firebaseConfig,
                              apiKey: e.target.value,
                            })
                          }
                          placeholder="AIzaSy..."
                          className={`w-full p-2.5 rounded-xl border ${currentTheme.inputBorder} ${currentTheme.inputBg} ${currentTheme.text} font-mono text-xs`}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">
                          Project ID *
                        </label>
                        <input
                          type="text"
                          value={firebaseConfig.projectId || ""}
                          onChange={(e) =>
                            setFirebaseConfig({
                              ...firebaseConfig,
                              projectId: e.target.value,
                              authDomain: `${e.target.value}.firebaseapp.com`,
                              storageBucket: `${e.target.value}.firebasestorage.app`,
                            })
                          }
                          placeholder="your-project-id"
                          className={`w-full p-2.5 rounded-xl border ${currentTheme.inputBorder} ${currentTheme.inputBg} ${currentTheme.text} font-mono text-xs`}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">
                          Auth Domain
                        </label>
                        <input
                          type="text"
                          value={firebaseConfig.authDomain || ""}
                          onChange={(e) =>
                            setFirebaseConfig({
                              ...firebaseConfig,
                              authDomain: e.target.value,
                            })
                          }
                          placeholder="your-project-id.firebaseapp.com"
                          className={`w-full p-2.5 rounded-xl border ${currentTheme.inputBorder} ${currentTheme.inputBg} ${currentTheme.text} font-mono text-xs`}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">
                          App ID
                        </label>
                        <input
                          type="text"
                          value={firebaseConfig.appId || ""}
                          onChange={(e) =>
                            setFirebaseConfig({
                              ...firebaseConfig,
                              appId: e.target.value,
                            })
                          }
                          placeholder="1:123456789:web:abcdef..."
                          className={`w-full p-2.5 rounded-xl border ${currentTheme.inputBorder} ${currentTheme.inputBg} ${currentTheme.text} font-mono text-xs`}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">
                          Storage Bucket
                        </label>
                        <input
                          type="text"
                          value={firebaseConfig.storageBucket || ""}
                          onChange={(e) =>
                            setFirebaseConfig({
                              ...firebaseConfig,
                              storageBucket: e.target.value,
                            })
                          }
                          placeholder="your-project-id.firebasestorage.app"
                          className={`w-full p-2.5 rounded-xl border ${currentTheme.inputBorder} ${currentTheme.inputBg} ${currentTheme.text} font-mono text-xs`}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">
                          Messaging Sender ID
                        </label>
                        <input
                          type="text"
                          value={firebaseConfig.messagingSenderId || ""}
                          onChange={(e) =>
                            setFirebaseConfig({
                              ...firebaseConfig,
                              messagingSenderId: e.target.value,
                            })
                          }
                          placeholder="123456789"
                          className={`w-full p-2.5 rounded-xl border ${currentTheme.inputBorder} ${currentTheme.inputBg} ${currentTheme.text} font-mono text-xs`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Full Backup & Migration */}
                  <div className="p-5 rounded-2xl border-2 border-dashed border-gray-700/40 bg-black/15 space-y-4">
                    <h4
                      className={`text-base font-black ${currentTheme.text} uppercase`}
                    >
                      JSON Backup & Project Portability
                    </h4>
                    <p className={`text-xs ${currentTheme.textMuted}`}>
                      Download your entire website data (projects, jobs, stats, skills, profile) as a single JSON file or restore from a backup.
                    </p>

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={handleExportBackup}
                        className="px-4 py-2 rounded-xl text-xs font-black uppercase bg-[#9B5DE5] hover:bg-[#884bd4] text-white border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] cursor-pointer flex items-center gap-1.5"
                      >
                        <Download size={14} /> Export JSON Backup
                      </button>

                      <label className="px-4 py-2 rounded-xl text-xs font-black uppercase bg-white/10 hover:bg-white/15 text-white border-2 border-[#1A1A1A] cursor-pointer flex items-center gap-1.5">
                        <Upload size={14} /> Import JSON Backup
                        <input
                          type="file"
                          accept=".json"
                          onChange={handleImportBackup}
                          className="hidden"
                        />
                      </label>

                      <button
                        type="button"
                        onClick={() => {
                          if (
                            window.confirm(
                              "Reset all website data to initial codebase factory defaults? This removes all local edits."
                            )
                          ) {
                            resetDefaults();
                            alert("Reset to factory defaults complete.");
                          }
                        }}
                        className="px-4 py-2 rounded-xl text-xs font-black uppercase bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 cursor-pointer flex items-center gap-1.5 ml-auto"
                      >
                        <Repeat size={14} /> Reset to Defaults
                      </button>
                    </div>
                  </div>

                  {/* Admin Security PIN Settings */}
                  <div className="p-5 rounded-2xl border-2 border-dashed border-gray-700/40 bg-black/15 space-y-3">
                    <h4
                      className={`text-base font-black ${currentTheme.text} uppercase`}
                    >
                      Security PIN Settings
                    </h4>
                    <p className={`text-xs ${currentTheme.textMuted}`}>
                      Change the PIN required to access this Quest Master CMS dashboard.
                    </p>

                    <form
                      onSubmit={handlePinChange}
                      className="flex items-center gap-3 max-w-sm"
                    >
                      <input
                        type="password"
                        placeholder="New PIN (min 4 digits)"
                        value={newPin}
                        onChange={(e) => setNewPin(e.target.value)}
                        className={`flex-1 p-2 rounded-xl border ${currentTheme.inputBorder} ${currentTheme.inputBg} ${currentTheme.text} text-xs font-mono font-bold`}
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl text-xs font-black uppercase bg-[#FF9F1C] text-black border border-[#1A1A1A] cursor-pointer"
                      >
                        Update PIN
                      </button>
                    </form>

                    {pinChangeMsg && (
                      <div className="text-xs font-bold text-emerald-400">
                        {pinChangeMsg}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
