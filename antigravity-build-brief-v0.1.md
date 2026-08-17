# Brand Guidelines App - Antigravity Build Brief v0.1

## Product Intent

Build a PWA for creating structured brand guidelines from modular brand knowledge.

This is not primarily a PDF generator. The core product is a brand knowledge builder: users create a brand, choose the modules they need, fill structured forms, and see those modules assembled into a readable brand guideline.

The first version should prove that brand guidelines can be created from structured, reusable data instead of a static document.

## MVP Goal

Create a runnable v0.1 app with this core flow:

```text
Create Brand -> Select Modules -> Fill Forms -> Preview Guideline -> Edit Again
```

The app should feel like a focused internal product tool: clear, structured, calm, and practical. Avoid marketing-page treatment. The first screen should be the actual application experience.

## Primary User

The initial user is a founder, brand strategist, designer, or small team member who needs to organize brand thinking into a usable guideline without starting from a blank document.

They may not have a complete brand system yet, so the app should support partial completion. A brand can have only some modules filled in and still produce a useful guideline preview.

## Core Concept

Each brand is composed of optional modules.

A module contains structured fields.

The guideline preview is assembled only from active modules.

Example:

```text
Brand: Northstar Coffee

Active modules:
- Brand Overview
- Brand Strategy
- Positioning
- Personality
- Voice & Tone
- Visual Basics
- Messaging

Inactive modules:
- Applications
- Governance
- Advanced Brand Architecture
```

## Scope For v0.1

Include:

- Create, rename, and delete a brand locally.
- View a list of brands.
- Select active modules for a brand.
- Fill and edit structured forms per module.
- Save data locally in browser storage.
- Show a guideline preview assembled from active modules.
- Show completion state per module.
- Allow returning from preview to edit a module.
- Use realistic sample data for one demo brand.

Do not include yet:

- Login or accounts.
- Team collaboration.
- Cloud database.
- AI generation.
- PDF export.
- Public sharing.
- Version history.
- Approval workflows.
- Brand compliance checking.
- Large asset library.
- Payment or subscription.

## App Structure

Use a simple single-page PWA structure with these main areas:

1. Brand Workspace
2. Brand List
3. Module Selector
4. Module Editor
5. Guideline Preview

Recommended navigation:

```text
Left sidebar:
- Brands
- Current brand modules

Main content:
- Selected module form
- Guideline preview

Top bar:
- Current brand name
- Save status
- Preview/Edit toggle
```

## Pages And Views

### 1. Brand List View

Purpose:
Let the user create or select a brand.

Features:

- List existing brands.
- Show brand name, short description, active module count, and last edited time.
- Create new brand button.
- Include one sample brand preloaded for demo.

### 2. Brand Workspace View

Purpose:
Central editing area for one brand.

Features:

- Brand name in header.
- Sidebar module list.
- Completion indicator for each active module.
- Button or control to manage active modules.
- Main panel shows selected module editor.
- Preview toggle shows assembled guideline.

### 3. Module Selector View

Purpose:
Let users decide what kind of guideline they want to build.

Features:

- List available modules with short descriptions.
- Toggle modules on or off.
- Keep completed data even if a module is temporarily disabled.
- Disabled modules should not appear in the guideline preview.

### 4. Module Editor View

Purpose:
Let users fill structured brand data.

Features:

- One form per module.
- Use field groups, textareas, inputs, sliders, checkboxes, and repeatable list items where appropriate.
- Autosave or explicit save is acceptable, but the UI should clearly indicate saved state.
- Empty fields should be allowed.

### 5. Guideline Preview View

Purpose:
Show the assembled brand guideline.

Features:

- Render only active modules.
- Use clean document-like formatting.
- Skip empty fields or show subtle placeholders only in edit mode.
- Each section should have an edit action that returns to the relevant module.
- Preview should feel like a useful internal brand reference.

## Initial Module Taxonomy

### Module 1: Brand Overview

Purpose:
Basic identity and context.

Fields:

- Brand name
- One-line description
- Longer description
- Industry/category
- Website
- Internal notes

Preview output:

- Brand introduction
- Category/context
- Short descriptive summary

### Module 2: Brand Strategy

Purpose:
Capture the foundational reason the brand exists.

Fields:

- Purpose
- Mission
- Vision
- Values, repeatable list
- Strategic priorities, repeatable list

Preview output:

- Purpose statement
- Mission and vision
- Values list
- Strategic priorities

### Module 3: Positioning

Purpose:
Define where the brand sits in the market and why it is different.

Fields:

- Target audience
- Market category
- Core problem solved
- Differentiators, repeatable list
- Competitive alternatives
- Positioning statement

Preview output:

- Audience and market context
- Differentiators
- Positioning statement

### Module 4: Personality

Purpose:
Define the character of the brand.

Fields:

- Brand traits, repeatable list
- Personality sliders:
  - Classic to modern
  - Serious to playful
  - Reserved to expressive
  - Practical to visionary
- Brand archetype, optional
- We are / we are not pairs

Preview output:

- Personality summary
- Trait list
- Behavioral boundaries

### Module 5: Voice & Tone

Purpose:
Define how the brand writes and speaks.

Fields:

- Voice principles, repeatable list
- Tone guidelines
- Words to use
- Words to avoid
- Example sentence before
- Example sentence after
- Channel notes, repeatable list

Preview output:

- Voice principles
- Tone guidance
- Vocabulary guidance
- Writing examples

### Module 6: Visual Basics

Purpose:
Capture basic visual identity guidance without building a full asset manager.

Fields:

- Logo usage notes
- Primary colors, repeatable list with name and hex
- Secondary colors, repeatable list with name and hex
- Typography notes
- Imagery direction
- Layout/design notes

Preview output:

- Logo guidance
- Color palette swatches
- Typography direction
- Imagery and layout notes

### Module 7: Messaging

Purpose:
Capture reusable language.

Fields:

- Tagline
- Elevator pitch
- Key messages, repeatable list
- Proof points, repeatable list
- Calls to action, repeatable list

Preview output:

- Tagline
- Elevator pitch
- Key messages
- Proof points
- CTAs

## Data Model

Use a simple local data model that can later be migrated to a backend.

Suggested shape:

```ts
type Brand = {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  activeModules: ModuleId[];
  modules: {
    overview?: BrandOverviewModule;
    strategy?: BrandStrategyModule;
    positioning?: PositioningModule;
    personality?: PersonalityModule;
    voiceTone?: VoiceToneModule;
    visualBasics?: VisualBasicsModule;
    messaging?: MessagingModule;
  };
};

type ModuleId =
  | "overview"
  | "strategy"
  | "positioning"
  | "personality"
  | "voiceTone"
  | "visualBasics"
  | "messaging";
```

Keep schemas explicit. Avoid storing everything as generic untyped key-value blobs.

## UX Principles

- The app should feel like a working product, not a landing page.
- Prioritize clarity, editability, and scanability.
- Users should always know which brand they are editing.
- Users should always know which modules are active.
- The preview should make incomplete work still feel useful.
- Do not block progress because one module is incomplete.
- Avoid decorative visuals that do not support the workflow.
- Use compact controls and clear information hierarchy.
- Avoid oversized hero sections.

## Visual Direction

Design tone:

- Calm
- Editorial but functional
- Structured
- Brand-strategy workspace
- Slightly premium, but not flashy

Interface suggestions:

- Left sidebar for brands/modules.
- Main work area with forms and preview.
- Small status indicators for completion.
- Color swatches in visual module.
- Sliders for personality traits.
- Repeatable rows for values, messages, words, and proof points.
- Tabs or segmented control for Edit / Preview.

Avoid:

- Purple-heavy gradients.
- Marketing hero layout.
- Large decorative cards.
- Nested cards.
- Fake analytics dashboards.
- Empty AI-first affordances.

## Completion Rules

For each module, calculate completion lightly:

- Empty: no meaningful fields completed.
- Started: at least one meaningful field completed.
- Complete: enough important fields completed for useful preview.

Do not require all fields to be complete.

Example:

```text
Brand Strategy
- Empty if purpose, mission, vision, and values are all empty.
- Started if any field has content.
- Complete if purpose or mission is filled and at least two values exist.
```

## Sample Brand

Include one sample brand so the app feels alive immediately.

Sample brand:

```text
Name: Northstar Coffee
Description: A neighborhood coffee brand for people who use small daily rituals to stay grounded.
Category: Specialty coffee / neighborhood cafe
```

Sample positioning:

```text
For urban professionals and creative locals who want a calmer alternative to rushed coffee chains, Northstar Coffee is a neighborhood coffee brand that turns everyday coffee into a grounding ritual through warm service, carefully sourced beans, and quiet, well-designed spaces.
```

Sample personality:

```text
Warm, grounded, thoughtful, quietly confident.
```

Sample voice:

```text
Clear, human, calm, and lightly poetic. Never overly cute, corporate, or technical.
```

## Technical Expectations

Antigravity may choose the stack, but prefer a modern frontend app that is easy to iterate:

- React or equivalent component-based UI.
- TypeScript if available.
- Local browser storage for persistence.
- Clear component separation:
  - Brand list
  - Module selector
  - Module form components
  - Guideline preview renderer
  - Local storage/data helpers
- Keep module definitions centralized so new modules can be added later.

## Acceptance Criteria

The v0.1 app is successful when:

- A user can create a new brand.
- A user can activate or deactivate modules.
- A user can fill in the seven v0.1 modules.
- A user can preview a guideline assembled from active modules.
- A user can return from preview to edit a specific section.
- Data persists after page refresh.
- The app includes a realistic sample brand.
- The interface is usable on desktop and acceptable on mobile.
- The implementation is structured so future AI generation or export features can be added later.

## Antigravity Prompt

Build the MVP v0.1 of a Brand Guidelines App as a PWA.

The app should be a structured brand knowledge builder. Users create a brand, select which brand guideline modules are active, fill structured forms for those modules, and preview an assembled brand guideline generated from the active modules.

Do not build a marketing landing page. The first screen should be the actual app. Do not add login, AI features, PDF export, collaboration, payments, or backend functionality in this version.

Use local browser storage for persistence. Include one realistic sample brand called Northstar Coffee.

Implement these modules:

- Brand Overview
- Brand Strategy
- Positioning
- Personality
- Voice & Tone
- Visual Basics
- Messaging

Each module should have a structured form and a corresponding preview section. Users should be able to activate/deactivate modules, edit fields, see completion status, and switch between editing and previewing the assembled guideline.

Design the app as a calm, structured, premium but practical workspace for founders, strategists, and designers. Use a sidebar, focused form area, and document-like preview. Avoid decorative landing-page treatment, oversized hero sections, purple gradients, nested cards, and fake dashboard clutter.

Keep the code organized so modules are defined centrally and future modules, AI generation, export, and backend persistence can be added later.
