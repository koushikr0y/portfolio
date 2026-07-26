import { useState } from "react";
import { X, Smartphone, Apple, ExternalLink, QrCode } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { COLORS } from "../config/theme";

export default function QRCodeModal({ project, onClose }) {
  const { currentTheme } = useTheme();
  const [activePlatform, setActivePlatform] = useState(() => {
    if (project?.androidUrl) return "android";
    if (project?.iosUrl) return "ios";
    return "android";
  });

  if (!project) return null;

  const currentUrl =
    activePlatform === "android" ? project.androidUrl : project.iosUrl;

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=10&data=${encodeURIComponent(
    currentUrl || ""
  )}`;

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      {/* Modal Card */}
      <div
        className={`relative w-full max-w-sm ${currentTheme.cardBg} border-[3px] border-dashed ${COLORS.orange.border} rounded-2xl p-6 shadow-[10px_10px_0px_0px_#1A1A1A] animate-pop-in`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 transition-all"
        >
          <X size={18} className={currentTheme.text} />
        </button>

        {/* Header */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF9F1C]/15 border border-[#FF9F1C]/40 text-[#FF9F1C] text-[10px] font-black uppercase tracking-widest mb-2">
            <QrCode size={13} /> Desktop Mobile Bridge
          </div>
          <h3 className={`text-2xl font-black ${currentTheme.text} uppercase tracking-tight`}>
            {project.title}
          </h3>
          <p className={`text-xs font-bold ${currentTheme.textMuted} mt-1`}>
            Point your mobile camera to test live build
          </p>
        </div>

        {/* Platform Selection Tabs */}
        {project.androidUrl && project.iosUrl && (
          <div className="flex items-center justify-center gap-2 mb-5">
            <button
              onClick={() => setActivePlatform("android")}
              className={`flex-1 py-2 px-3 rounded-xl font-bold uppercase text-xs tracking-wider flex items-center justify-center gap-1.5 border-2 border-[#1A1A1A] transition-all ${
                activePlatform === "android"
                  ? "bg-[#2EC4B6] text-black shadow-[3px_3px_0px_0px_#1A1A1A]"
                  : `${currentTheme.inputBg} ${currentTheme.text} opacity-60 hover:opacity-100`
              }`}
            >
              <Smartphone size={14} /> Android
            </button>
            <button
              onClick={() => setActivePlatform("ios")}
              className={`flex-1 py-2 px-3 rounded-xl font-bold uppercase text-xs tracking-wider flex items-center justify-center gap-1.5 border-2 border-[#1A1A1A] transition-all ${
                activePlatform === "ios"
                  ? "bg-[#007AFF] text-white shadow-[3px_3px_0px_0px_#1A1A1A]"
                  : `${currentTheme.inputBg} ${currentTheme.text} opacity-60 hover:opacity-100`
              }`}
            >
              <Apple size={14} /> App Store
            </button>
          </div>
        )}

        {/* QR Display Frame */}
        <div className="bg-white p-4 rounded-xl border-2 border-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A] flex flex-col items-center justify-center mb-5">
          <img
            src={qrImageUrl}
            alt={`QR Code for ${project.title}`}
            className="w-48 h-48 object-contain"
          />
        </div>

        {/* Direct Link Action */}
        {currentUrl && (
          <a
            href={currentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 rounded-xl font-black uppercase text-xs tracking-wider flex items-center justify-center gap-2 bg-[#2EC4B6] text-black border-2 border-[#1A1A1A] shadow-[3px_3px_0px_0px_#1A1A1A] hover:-translate-y-0.5 transition-all"
          >
            <span>Open Direct Store Link</span>
            <ExternalLink size={14} />
          </a>
        )}
      </div>
    </div>
  );
}
