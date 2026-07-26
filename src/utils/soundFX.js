// Web Audio API Sound Effects Generator

let audioCtx = null;
let soundEnabled = true;

const getAudioContext = () => {
  if (!audioCtx && typeof window !== "undefined") {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) {
      audioCtx = new AudioCtx();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
};

// Global click listener to unlock Web Audio context on modern browsers
if (typeof window !== "undefined") {
  const unlockAudio = () => {
    getAudioContext();
    window.removeEventListener("click", unlockAudio);
    window.removeEventListener("touchstart", unlockAudio);
  };
  window.addEventListener("click", unlockAudio);
  window.addEventListener("touchstart", unlockAudio);

  // Automatic global click audio listener on all interactive elements
  window.addEventListener(
    "click",
    (e) => {
      const isInteractive = e.target.closest?.(
        "button, a, input[type='submit'], input[type='button'], select, [role='button'], .cursor-pointer"
      );
      if (isInteractive) {
        playClick();
      }
    },
    true
  );
}

export const setSoundEnabled = (enabled) => {
  soundEnabled = enabled;
  if (typeof window !== "undefined") {
    localStorage.setItem("portfolio_sound_enabled", enabled ? "true" : "false");
  }
};

export const isSoundEnabled = () => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("portfolio_sound_enabled");
    if (stored !== null) return stored === "true";
  }
  return soundEnabled;
};

// Helper: Crisp Pleasant Tone Generator
const createTone = (ctx, freqStart, freqEnd, duration, type = "sine", maxGain = 0.1) => {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freqStart, ctx.currentTime);
  if (freqEnd && freqEnd !== freqStart) {
    osc.frequency.exponentialRampToValueAtTime(freqEnd, ctx.currentTime + duration);
  }

  gain.gain.setValueAtTime(maxGain, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + duration);
};

// 1. Crisp Button Click Pop
export const playClick = () => {
  if (!isSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    createTone(ctx, 600, 300, 0.06, "sine", 0.12);
  } catch (e) {}
};

// 2. Subtle Soft Hover Tone
export const playHover = () => {
  if (!isSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    createTone(ctx, 480, 480, 0.04, "sine", 0.04);
  } catch (e) {}
};

// 3. Quest / Project Opening Chime
export const playOpen = () => {
  if (!isSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const now = ctx.currentTime;
    [523.25, 659.25, 783.99].forEach((freq, i) => { // C5, E5, G5
      setTimeout(() => {
        if (ctx) createTone(ctx, freq, freq * 1.04, 0.1, "triangle", 0.1);
      }, i * 50);
    });
  } catch (e) {}
};

// 4. Triumph Victory Chime
export const playSuccess = () => {
  if (!isSoundEnabled()) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
      setTimeout(() => {
        if (ctx) createTone(ctx, freq, freq, 0.15, "sine", 0.12);
      }, i * 70);
    });
  } catch (e) {}
};
