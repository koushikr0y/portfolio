export const PORTFOLIO_DATA = {
  name: "Koushik Roy",
  level: 42,
  class: "Game Developer",
  skills: {
    engines: ["Unreal Engine 5", "Unity", "Godot", "Phaser.js"],
    languages: ["C++", "C#", "Python"],
    design: ["Level Design", "Systems Design", "Narrative"],
    technical: ["Shaders", "Optimization", "VFX Graph"],
  },
  jobs: [
    {
      company: "Epic Game Studios",
      role: "Lead Game Developer",
      desc: "Built AAA multiplayer games.",
    },
    {
      company: "Indie Dreams",
      role: "Senior Programmer",
      desc: "Indie physics and AI systems.",
    },
  ],
  projects: [
    { title: "Neon Odyssey", type: "Cyberpunk Action RPG" },
    { title: "Pixel Dungeons", type: "Roguelike" },
    { title: "Speed Demons", type: "Racing" },
  ],
};

// --- Stats Section (Character Sheet) ---
export const STATS = [
  { icon: "Code", val: "20+", label: "Projects Completed", color: "teal" },
  { icon: "Coffee", val: "∞", label: "Cups of Coffee", color: "pink" },
  // { icon: "Trophy", val: "12", label: "Awards Won",       color: "orange" },
  // { icon: "Star",   val: "100+", label: "Happy Clients",  color: "purple" },
];

// --- Experience Section (Quest Log) ---
export const JOBS = [
  {
    title: "Unity Game Developer",
    company: "Studio Krew",
    location: "Remote",
    date: "Aug 2023 - Present",
    status: "ACTIVE",
    xp: "+5000 XP",
    desc: "Leading development of multiplayer and system-driven games, managing a team of developers, and architecting scalable game systems with 3+ years of professional experience in game development.",

    achievements: [
      "Architected and implemented multiplayer systems using Fusion and Netcode, ensuring smooth real-time gameplay",
      "Led a team of developers, mentoring juniors and making key technical decisions across projects",
      "Designed scalable and modular game systems for faster iteration and maintainability",
      "Optimized performance by reducing memory usage and improving frame rates across multiple builds",
      "Integrated hardware-based features and external systems into gameplay pipelines",
      "Improved code quality through structured code reviews and refactoring practices",
      "Collaborated with designers and artists to deliver polished gameplay experiences",
      "Handled end-to-end development cycles from prototyping to production deployment",
    ],

    stack: [
      "Unity",
      "C#",
      "Sockets",
      "Multiplayer (Fusion + Netcode)",
      "Hardware Integration",
      "Game Architecture",
    ],

    color: "orange",
  },
  {
    title: "Unity Gameplay Programmer",
    company: "Digital Jalebi",
    location: "Noida, India",
    date: "Dec 2022 - Jun 2023",
    status: "COMPLETED",
    xp: "+3500 XP",
    desc: "Gameplay programmer focused on interactive and event-based applications, specializing in Augmented Reality experiences and performance optimization for mobile and hardware-integrated systems.",

    achievements: [
      "Developed AR experiences using multiple SDKs including Niantic Lightship, Meta Spark, Vuforia, AR Foundation, and Snapchat Lens Studio",
      "Built interactive gameplay systems for event-based applications with real-time user engagement",
      "Optimized physics and gameplay performance for mobile devices and hardware-constrained environments",
      "Integrated hardware inputs such as Kinect and LiDAR for immersive and responsive experiences",
      "Handled cross-platform AR deployment across Android and iOS devices",
      "Collaborated with creative and design teams to translate concepts into interactive AR experiences",
      "Debugged and fine-tuned AR tracking, stability, and performance in real-world environments",
    ],

    stack: [
      "Unity",
      "C#",
      "Procedural Generation",
      "Augmented Reality",
      "Kinect",
      "LiDAR",
    ],

    color: "purple",
  },
];

export const ALL_PROJECTS = [
  {
    id: 5,
    title: "Farm Shot: Slay the Dragon",
    desc: "",
    tags: ["Unity", "Level Editor", "Puzzle"],
    rarity: "EPIC",
    rating: "",
    color: "teal",

    thumbnailImage:
      "https://play-lh.googleusercontent.com/ftMA-91VujhlovCUzL1T15NbSzrWdZzsr5AG14lytfkRkmdg0cy_TA0ToogP8yI0VjztYWIW_DOUs1JelzHZ=w416-h235-rw",
    cardGradient: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
    youtubeId: "",
    previewImages: [
      "https://play-lh.googleusercontent.com/7nUXcO9NRL2ktiE8J2YszC011PILRVZWh4d-jnUHlzykY5sdgP2ULe4wYciLo31s9v4F6WU7mqwGFkTn3zcmHo8=w2560-h1440-rw",
      "https://play-lh.googleusercontent.com/jypHxIq2t0SL1FSdws1N5ekn3HHEhR2FeBNy7a9EcHQDVNy08P7m6e4O4BEhuEAM_XmGMWmwYgFXNa2S-OIqFQ=w2560-h1440-rw"
    ],
    githubUrl:
      "https://play.google.com/store/apps/details?id=com.adsphire.farmshot&hl=en_IN",
    demoUrl:
      "https://play.google.com/store/apps/details?id=com.adsphire.farmshot&hl=en_IN",
  },
  {
    id: 1,
    title: "KrewGames Multiplayer Club",
    desc: `A community-driven multiplayer gaming platform with club-based competitive gameplay across Ludo, Chess, 8 Ball Pool, and Carrom.
My Contributions:
• Built real-time multiplayer systems using Photon Fusion  
• Designed scalable & modular architecture  
• Developed matchmaking, club systems & player flows  
• Integrated backend APIs for sync & data handling  
• Optimized low-latency gameplay across devices  
• Implemented fair-play systems & anti-cheat logic  
🔒 Safe system — No gambling, no cashouts.
© All rights reserved to Studio Krew.`,
    tags: ["Unity", "Photon Fusion", "Backend Integration"],
    rarity: "LEGENDARY",
    rating: "",
    color: "orange",

    // thumbnailImage: "https://play-lh.googleusercontent.com/EUSZc6mg3hYRAn6iXnnlwoGuDI4tJ6YvaCFPdHiDngYaHN-5mGpY1UfOojqzLxxnXIZKm7yvVB2EgDVqd3ruDN4=w480-h960",
    thumbnailImage: `https://play-lh.googleusercontent.com/EUSZc6mg3hYRAn6iXnnlwoGuDI4tJ6YvaCFPdHiDngYaHN-5mGpY1UfOojqzLxxnXIZKm7yvVB2EgDVqd3ruDN4=w480-h960-rw`,
    cardGradient: "linear-gradient(135deg, #1A1A1A 0%, #2a2a2a 100%)",

    youtubeId: "Riu23UEngwc",

    previewImages: [
      "https://play-lh.googleusercontent.com/4m7Ip963PexEB_K1NYOdeGOY1cCWogn15T9od0YQA2kYxKxrlzlynhKNe5VGe5PcvJtLMAF-0cADP98MiqRak0M=w5120-h2880-rw",
      "https://play-lh.googleusercontent.com/fcYrOHUu92DLqXRA5iBAavKFYQp5KepZTvCifupGeCYyUoelvoa0Hl8fd3--u4Jb3OCb28uM3HZLuA3LU5ldvJQ=w5120-h2880",
      "https://play-lh.googleusercontent.com/_FdBzszppThYkV6xfE6_PX40OR5AYLInnOT2Z0vNIud20J35HkItORIm2bLOBnKSWmRngpco4cdt_x5lrTUpgA=w5120-h2880",
    ],

    githubUrl:
      "https://play.google.com/store/apps/details?id=com.studiokrew.krewgames",
    demoUrl:
      "https://play.google.com/store/apps/details?id=com.studiokrew.krewgames",
  },
  {
    id: 2,
    title: "Challenge Master: 2 Player",
    desc: `A multi-game offline challenge platform featuring 20+ mini-games including Ludo, Chess, Pool, Air Hockey, and more — designed for quick 2-player battles and solo play.

My Contributions:
• Built scalable multi-game architecture supporting 20+ mini-games  
• Designed 2-player local gameplay & AI systems  
• Implemented ad monetization (rewarded & interstitial ads)  
• Developed smooth game switching & state management  
• Optimized performance for low-end devices  
• Created modular systems for adding new mini-games easily  

🎮 Fully offline experience with engaging casual gameplay.
© All rights reserved to Studio Krew.`,
    tags: ["Unity", "Ads", "Gameplay"],
    rarity: "EPIC",
    rating: "",
    color: "purple",

    // thumbnailImage: "https://i.ytimg.com/an_webp/hcj0sin2S-I/mqdefault_6s.webp?du=3000&sqp=CIaX0M4G&rs=AOn4CLAjqWrCSX-nIB6N3dZp8uhIbFlA3g",
    thumbnailImage:
      "https://play-lh.googleusercontent.com/ethCPJOu3GnzCUeM7NPuU74ZHFLsyOqJdSHbwhPng5SWuhjwYz6QK9OGGyw32SuRLWg=s512-rw",
    cardGradient: "linear-gradient(135deg, #2D1B69 0%, #1A103C 100%)",
    youtubeId: "hcj0sin2S-I",
    previewImages: [
      "https://play-lh.googleusercontent.com/ezwQan5xOkQa_LCWtz-GYUMAM71X7znMXFBqC0P18ovZ-cXof2bGQSWqcT2PgUMh4bs=w5120-h2880-rw",
      "https://play-lh.googleusercontent.com/eiN4mpn6BPHWMTlDE9ZIuENpLQT5L-SQnWih8Kf3Jbg0pWTZv4UdxoPn3PCuSX7s=w5120-h2880-rw",
      "https://play-lh.googleusercontent.com/mG4RFJRliMApnP1r_MWr3fSmIM7k6wcEQGTFbnbxBoF4okOwuLQlpzzmalLiT9CyJw=w5120-h2880-rw",
    ],
    githubUrl:
      "https://play.google.com/store/apps/details?id=com.studiokrew.challengemaster",
    demoUrl:
      "https://play.google.com/store/apps/details?id=com.studiokrew.challengemaster",
  },
];

// export const socialLinks = [
//   { Icon: Github, url: "https://github.com/yourusername" },
//   { Icon: Linkedin, url: "https://linkedin.com/in/yourusername" },
//   { Icon: Twitter, url: "https://twitter.com/yourusername" },
//   { Icon: Mail, url: "mailto:youremail@example.com" },
// ];
