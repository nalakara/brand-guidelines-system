# Release Notes - Brand Guidelines System v0.1

**Version**: v0.1  
**Status**: Frozen MVP Baseline  
**Date**: August 17, 2026  

---

## Core Product Promise

A structured brand knowledge builder that allows founders, strategists, and designers to build, organize, and preview modular brand guidelines from structured data rather than starting from blank static documents.

---

## Included Features (v0.1)

### 1. Brand Workspace & Persistence
- **Local Brand Management**: Create, select, and delete brands locally.
- **LocalStorage Persistence**: Debounced autosave to browser `localStorage` with visual status indicator (*Saved to LocalStorage* / *Saving...*).
- **Realistic Sample Brand**: Preloaded with **Northstar Coffee** including rich English and Indonesian brand copy.

### 2. 7 Core Brand Guideline Modules
- **Brand Overview**: Brand name, one-line summary, detailed background, category/industry, website URL, and internal team notes.
- **Brand Strategy**: Purpose statement, mission, vision, repeatable core values, and strategic priorities.
- **Positioning**: Target audience, market category, core problem solved, repeatable differentiators, competitive alternatives, and positioning statement.
- **Personality**: Character trait tags, 4 spectrum sliders (*Classic/Modern*, *Serious/Playful*, *Reserved/Expressive*, *Practical/Visionary*), brand archetype, and repeatable *We Are / We Are Not* contrast pairs.
- **Voice & Tone**: Voice principles, tone guidelines, *Words to Use* & *Words to Avoid* tag chips, Before/After copy rewriting examples, and channel notes.
- **Visual Basics**: Logo usage rules, 8 pre-structured logo variant placeholders, primary & secondary color palettes (color picker + hex input + live swatches), typography, imagery direction, and layout notes.
- **Messaging**: Tagline, 30-second elevator pitch, key message pillars, proof points, and CTAs.

### 3. Logo Variant Placeholders
- **8 Pre-Structured Slots**: Primary Full Color, Black, White / Reversed, Monochrome, Simplified Mark, Horizontal Lockup, Vertical Stacked, and App Icon.
- **Variant Metadata**: Localized name, usage notes, recommended background (HEX/note), and "Do Not Use When" guidance.
- **v0.2 Ready Placeholders**: Dashed drop zone slots ready for image file uploads or Data URLs.

### 4. Multilingual Architecture (EN / ID)
- **UI Interface Language (`UI: EN | ID`)**: Translates all navigation, buttons, badges, section headers, and form labels.
- **Brand Content Language (`Content: EN | ID`)**: Stores localized content `{ en?: string, id?: string }` per field, allowing culturally adapted brand phrasing.
- **Graceful Fallback**: Fallback badge indicator when content in selected language is missing.
- **Unified Non-Text Assets**: HEX color codes, numeric spectrum sliders, and active module selections remain shared.

### 5. Document Guideline Preview
- **Assembled Preview**: Assembles active modules into a clean, document-like internal reference view with section numbers.
- **Direct Roundtrip Edit**: Every preview section features an "Edit Section" button returning directly to that module form.

### 6. PWA Support
- **Web App Manifest (`public/manifest.json`)**: Standalone display mode with custom icon.
- **Service Worker (`public/sw.js`)**: Minimal, network-first service worker for offline shell caching, easy to disable via `localStorage.setItem('SW_DISABLED', 'true')`.

---

## Explicitly Excluded Features (v0.1)

- Login / User Authentication
- Team Collaboration & Multi-user Sync
- Cloud Database & Backend Persistence
- AI Content Generation / AI Translation
- PDF Export & Public Share Links
- Version History & Approval Workflows
- Asset Library Upload Management

---

## Known Non-Blocking Next Improvements

1. **Drag-and-Drop Image Uploads**: Replace dashed placeholder zones in Logo Variants with `FileReader` file uploads.
2. **JSON Export & Import**: Provide one-click backup/restore of brand data outside browser storage.
3. **Accessibility Polish**: Enhance screen reader ARIA labels for spectrum sliders.

---

## Recommended Next Version Options (v0.2 Roadmap)

- **Option A (AI-Assisted Builder)**: Add Gemini API integration for AI drafting of mission, vision, positioning, and tone rewrites.
- **Option B (Asset & PDF Export)**: Add image file uploads to logo variants and PDF/Markdown export.
- **Option C (Backend Sync)**: Connect brand data model to Firebase Data Connect / PostgreSQL backend.
