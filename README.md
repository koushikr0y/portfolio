# Portfolio – Project Structure

## Directory Overview

```
src/
├── App.jsx                        # Root component – add/remove sections here
├── main.jsx                       # React DOM entry point (unchanged)
├── index.css                      # Tailwind + custom scrollbar (unchanged)
│
├── config/
│   ├── gemini.js                  # 🔑 Gemini API key & model config
│   └── theme.js                   # 🎨 THEMES (light/dark) and COLORS palette
│
├── data/
│   └── portfolioData.js           # 📝 ALL editable content lives here
│                                  #    (stats, jobs, projects, chatbot context)
│
├── context/
│   └── ThemeContext.jsx           # Theme state, ThemeProvider, useTheme hook
│
├── components/                    # Reusable, non-section components
│   ├── UI.jsx                     # SectionTitle, Card, Badge, SkillBar
│   ├── LoadingScreen.jsx          # Game-style loading screen
│   └── FamiliarChat.jsx           # Gemini-powered chatbot widget
│
└── sections/                      # Full page sections (one file per section)
    ├── Navbar.jsx                 # Theme toggle button (top-right)
    ├── Hero.jsx                   # Name, avatar, social links, XP bar
    ├── Stats.jsx                  # Character Sheet + About Me
    ├── Skills.jsx                 # Skill Tree (engines, programming, design)
    ├── Experience.jsx             # Quest Log (expandable job cards)
    ├── Projects.jsx               # Project grid + detail modal
    ├── Contact.jsx                # Contact form + Gemini quest brief
    └── Footer.jsx                 # Footer
```

---

## Quick Editing Guide

### Change personal info / content
→ Edit `src/data/portfolioData.js`
- `PORTFOLIO_DATA` — used by the AI chatbot as context
- `STATS` — the stat cards in the Character Sheet section
- `JOBS` — experience entries in the Quest Log
- `ALL_PROJECTS` — project cards and modal data

### Change colors or theme
→ Edit `src/config/theme.js`
- `THEMES` — light/dark CSS class sets
- `COLORS` — the named color palette (orange, teal, purple, pink, gray)

### Swap the Gemini API key or model
→ Edit `src/config/gemini.js`

### Add/remove a section
→ Edit `src/App.jsx` — import and add/comment out the section component

### Enable the Projects section (currently hidden)
→ In `src/App.jsx`, uncomment:
```jsx
// import Projects from "./sections/Projects";
// ...
// <Projects />
```

### Toggle individual skill bars / stat cards
→ Comment/uncomment the relevant lines inside the section file or in `portfolioData.js`

---

## Commented-Out Items (preserved from original)

| Location | Item | How to re-enable |
|---|---|---|
| `App.jsx` | `<Projects />` section | Uncomment import + JSX |
| `Stats.jsx` | Trophy & Star stat cards | Uncomment in `data/portfolioData.js` STATS array |
| `Skills.jsx` | Unreal Engine 5, Phaser.js, TypeScript, Narrative skill bars | Uncomment in `Skills.jsx` |
| `Skills.jsx` | Technical Art card (Shaders, Optimization, VFX Graph) | Uncomment the entire card block |
| `Experience.jsx` | Total XP summary banner | Uncomment at bottom of section |
| `Contact.jsx` | Location row | Uncomment in `Contact.jsx` |
