# Brand Guidelines System (v0.1 PWA)

A structured brand knowledge builder PWA that enables founders, brand strategists, and designers to create, manage, and preview modular brand guidelines from structured data.

🌐 **Live Demo**: [https://brand-guidelines-system.vercel.app/](https://brand-guidelines-system.vercel.app/)

![License](https://img.shields.io/badge/status-v0.1_frozen-blue)
![PWA](https://img.shields.io/badge/PWA-offline_capable-emerald)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue)
![React](https://img.shields.io/badge/React-18.2-sky)

---

## Key Features

- **Structured Brand Knowledge Builder**: Organize brand identity into modular, reusable structured data rather than static unstructured documents.
- **7 Core Brand Modules**:
  1. *Brand Overview*
  2. *Brand Strategy*
  3. *Positioning*
  4. *Personality* (with 4 interactive spectrum sliders)
  5. *Voice & Tone* (with Before/After writing examples)
  6. *Visual Basics* (with live color swatches)
  7. *Messaging*
- **Logo Variant Placeholders**: 8 pre-structured logo lockup slots (*Primary Full Color, Black, White / Reversed, Monochrome, Simplified Mark, Horizontal, Vertical, App Icon*) with usage notes, recommended background, and "Do Not Use" guidance.
- **English & Indonesian Multilingual Support**:
  - Independent **UI Language Switcher** (`UI: EN | ID`) for app controls.
  - Independent **Brand Content Language Switcher** (`Content: EN | ID`) supporting culturally adapted copy per field with graceful fallback.
- **Document Guideline Preview**: Clean internal reference view assembling active modules with section numbers and direct "Edit Section" roundtrip links.
- **Local Browser Persistence**: Automatic debounced autosave to `localStorage` with visual save indicator. Pre-loaded with realistic sample brand **Northstar Coffee**.
- **Progressive Web App (PWA)**: Web App Manifest and offline-capable Service Worker.

---

## Tech Stack

- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Vanilla CSS with custom design tokens (`src/styles/design-tokens.css`)
- **Icons**: Lucide React
- **Persistence**: Browser `localStorage`

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation & Development

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Run TypeScript type check
npm run lint

# Build production distribution
npm run build
```

---

## Project Structure

```text
src/
├── components/
│   ├── editors/       # 7 Module Form Editors
│   ├── preview/       # Assembled Guideline Document Renderer
│   ├── ui/            # Localized Inputs, Badges, Modals
│   ├── Header.tsx     # Top bar controls & language switchers
│   ├── Sidebar.tsx    # Brand switcher & active module navigation
│   └── ModuleManagerModal.tsx
├── data/              # Preloaded sample brand (Northstar Coffee)
├── i18n/              # UI translation dictionary (EN/ID)
├── modules/           # Central Module Registry & completion logic
├── services/          # LocalStorage persistence helper
├── styles/            # Design tokens, global layout & preview CSS
├── types/             # TypeScript definitions
├── App.tsx
└── main.tsx
```

---

## License

MIT License © 2026 Brand Guidelines System
