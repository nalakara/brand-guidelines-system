# Phase 4.2 — Guided Brand Experience UI & Mode Controller: Architectural Review

**Document Version:** 1.0.0  
**Phase:** 4.2 — Architectural Design & Blueprint  
**Baseline Commits:** Level 3 Frozen at `ff52bdf`, Phase 4.1C Frozen at `9962145`  
**Status:** Read-Only Architectural Review  

---

## 1. Executive Summary

Phase 4.2 transitions the static pedagogical knowledge established in Phase 4.1C (`guidanceContent.ts`) into an active, contextual, and non-blocking **Guided Brand Experience UI & Mode Controller**.

The product's central mission is to solve a fundamental UX dilemma:
> How to teach a graphic designer transitioning into brand design *what to think about*, *what questions to ask*, and *how decisions connect into an interconnected system*, without turning the software into a rigid, sequential form-locking wizard.

This architectural review establishes the component hierarchy, state ownership, editor reuse strategy, controller logic, and non-blocking navigation semantics for Phase 4.2 without modifying any frozen Level 3 Brand Knowledge schemas.

---

## 2. Existing Architecture Audit & Reuse Strategy

```
+----------------------------------------------------------------------------------------------------+
|                                    APPLICATION STATE (App.tsx)                                     |
|                                                                                                    |
|  - `brands`: Brand[] (from storage.ts)                                                             |
|  - `activeBrandId`: string                                                                         |
|  - `activeModuleId`: ModuleId                                                                      |
|  - `viewMode`: 'edit' | 'preview'                                                                  |
|  - `uiLanguage` / `contentLanguage`: Language ('en' | 'id')                                        |
|  - [NEW Phase 4.2] `experienceMode`: 'guided' | 'studio' (persisted in localStorage)              |
|  - [NEW Phase 4.2] `activeStageId`: GuidanceStageId (session UI state)                             |
+----------------------------------------------------------------------------------------------------+
                                                  |
                         +------------------------+------------------------+
                         |                                                 |
                         v                                                 v
+--------------------------------------------------+  +--------------------------------------------------+
| GUIDED MODE (`experienceMode === 'guided'`)      |  | STUDIO MODE (`experienceMode === 'studio'`)      |
|                                                  |  |                                                  |
| 1. Stage Journey Ribbon (6 Stages, non-locking)  |  | 1. Sidebar Domain-Grouped Navigation             |
| 2. Stage Narrative & Objective Banner            |  | 2. Direct Module Selection                       |
| 3. Contextual Pedagogical Panel                  |  | 3. Uninterrupted Power-User Editing              |
|    (WhyThisMatters, ClientPrompts, Weak/Strong)  |  | 4. Direct View of Active Modules                 |
| 4. Embedded Frozen Editor Wrapper                |  | 5. Direct Module Manager Modal                   |
|    (Reuses OverviewEditor, PositioningEditor,    |  |                                                  |
|     VisualRulesEditor, etc. verbatim)            |  |                                                  |
+--------------------------------------------------+  +--------------------------------------------------+
                                                  |
                                                  v
+----------------------------------------------------------------------------------------------------+
|                               FROZEN BRAND KNOWLEDGE SOURCE OF TRUTH                               |
|                                         (Commit ff52bdf)                                           |
|                                                                                                    |
|   `Brand.modules.*` -> Sole repository for brand decisions. Both modes read/write identically.     |
+----------------------------------------------------------------------------------------------------+
```

### Audit Invariant: Editor Reuse (Zero Duplication)
- All 12 existing editor components (`OverviewEditor`, `StrategyEditor`, `PositioningEditor`, `PersonalityEditor`, `VoiceToneEditor`, `MessagingEditor`, `LogoSystemEditor`, `ColorSystemEditor`, `TypographySystemEditor`, `VisualAssetsEditor`, `VisualRulesEditor`, `NamingEditor`, `BrandArchitectureEditor`, `TouchpointsEditor`) will be mounted directly within the Guided container.
- **No duplicate form implementations** will be created.

---

## 3. Guided Mode vs. Studio Mode Architecture

| Dimension | Guided Mode (`'guided'`) | Studio Mode (`'studio'`) |
| :--- | :--- | :--- |
| **Primary User** | Graphic designer transitioning into brand strategy | Senior brand strategist / Experienced identity designer |
| **Primary Navigation** | 6-Stage Journey Tracker & Stage narrative cards | Domain-grouped Sidebar navigation |
| **Pedagogical Support** | Contextual Guidance Drawer (*Why This Matters*, *Client Prompts*, *Examples*) | Unobtrusive, high-density direct editing |
| **Layout Focus** | Focused, progressive task cards with guidance drawers | Full capability universe instantly visible |
| **Underlying Data** | `Brand.modules.*` (Same object) | `Brand.modules.*` (Same object) |
| **Sync Speed** | Instantaneous (Single React state in `App.tsx`) | Instantaneous (Single React state in `App.tsx`) |

- **Header Switcher**: A sleek segmented pill control in `src/components/Header.tsx`: `[ 🎓 Guided Mode | ⚡ Studio Mode ]`.
- **Mode Persistence**: Keyed under `localStorage.getItem('app_experience_mode')` (defaults to `'guided'` on initial load).

---

## 4. Guided Mode Controller Architecture

The Guided Mode Controller is a lightweight, pure TypeScript utility (`src/utils/guidanceController.ts`) that evaluates the active brand state and answers: **"What should the designer consider working on next?"**

### Decision Inputs:
1. `brand.activeModules`: Which modules are part of this brand's tailored scope.
2. `getModuleCompletion()`: Existing completion status (`empty`, `started`, `complete`) from `src/modules/registry.ts`.
3. `GUIDANCE_STAGES`: Static pedagogical sequence from `src/data/guidanceContent.ts`.
4. `decisionDependencies`: Downstream links and upstream prerequisites.

### Controller Capabilities:
- Computes stage-level aggregate progress (`empty`, `started`, `complete`).
- Computes the **Next Recommended Stage & Topic** (finds the first incomplete active stage in curriculum order).
- Detects **Feedback Loop Suggestions** (e.g., if Stage 6 Packaging has assets but Stage 5 has no Contrast Rules).
- **Non-Coercive**: The controller provides recommendations via UI badges and banners, but **never forces or locks navigation**.

---

## 5. Progress Model: Guidance vs. Brand Knowledge

```
+----------------------------------------------------------------------------------------------------+
| DISTINCTION: GUIDANCE PROGRESS vs. BRAND KNOWLEDGE COMPLETENESS                                    |
+----------------------------------------------------------------------------------------------------+
| 1. Brand Knowledge Completeness (Authoritative):                                                   |
|    - Calculated deterministically from `Brand.modules.*` using `src/modules/registry.ts`.         |
|    - Inspects real authored data (e.g. `primaryColors.length >= 2`, `values.length >= 2`).         |
|    - Used for Guideline Assembly and Export validation.                                           |
+----------------------------------------------------------------------------------------------------+
| 2. Guidance Pedagogical Progress (Advisory):                                                       |
|    - Computed on-the-fly by combining module completeness with active curriculum stages.          |
|    - Informs the designer: "Stage 2 is substantially defined to support Stage 3 decisions."        |
|    - Stored 0% in the Brand database. Pure UI projection.                                         |
+----------------------------------------------------------------------------------------------------+
```

---

## 6. Contextual Guidance Layout Models

We evaluated 4 UX layout patterns:
1. *Inline*: Guidance crammed between form inputs $\rightarrow$ **Rejected** (Clutters form, degrades scannability).
2. *Persistent Side Panel*: Full-height right drawer $\rightarrow$ **Selected for Desktop Hybrid**.
3. *Full-Page Guided Wizard*: Multi-step wizard $\rightarrow$ **Rejected** (Violates "no rigid wizard" rule).
4. **Adaptive Top/Side Hybrid (Recommended)**:
   - **Stage Journey Ribbon** pinned at the top of the workspace.
   - **Stage Narrative Header** providing mental model framing.
   - **Contextual Guidance Accordion/Drawer** beside or above the active module editor that users can expand, collapse, or pin.

---

## 7. Mentor Interaction Model (No AI Required)

The Guided Experience follows a structured cognitive rhythm for every topic:

```
[ 1. WHY THIS MATTERS ]   -> Explains business & design justification.
         ↓
[ 2. THINK ABOUT THIS ]   -> Cognitive reflection prompt (trade-offs).
         ↓
[ 3. ASK YOUR CLIENT ]    -> Practical interview scripts with follow-ups.
         ↓
[ 4. WEAK vs. STRONG ]    -> Real-world case contrast (e.g. Northstar Coffee).
         ↓
[ 5. WATCH OUT ]          -> Beginner pitfalls to avoid.
         ↓
[ 6. ENTER DECISION ]     -> Active input in the embedded editor.
         ↓
[ 7. CONNECTS TO ]        -> Shows downstream impact & feedback triggers.
```

---

## 8. Skip / Back / Revisit Behavior (Non-Linear Semantics)

To prevent cognitive friction:
1. **Free Navigation**: Clicking any stage tab instantly jumps to that stage.
2. **Revisit Alerts**: When a designer edits an upstream field (e.g. changing Brand Personality), a subtle advisory banner notes: *"Tip: You updated personality traits. You may want to review your Voice Principles in Stage 3."*
3. **Dismissible Tips**: Users can collapse or dismiss guidance cards; dismissal preferences are stored in `localStorage` under `app_dismissed_guidance`.

---

## 9. Module Activation & Scope Adaptability

The system respects *"Everything is available, nothing is mandatory"*:
- If a brand only activates `overview`, `visualKnowledge`, `visualAssets`, `visualRules`, and `brandExpression` (Visual Identity Starter):
  - Stages 1, 4, 5, and 6 show active module cards.
  - Stages 2 and 3 show a helpful note: *"This stage contains strategy & voice modules that are currently inactive for this brand. Click here to activate them in Module Manager."*
- Guided Mode seamlessly adapts its progress calculations based only on **active modules**.

---

## 10. Pedagogical Difficulty Tiers

`guidanceContent.ts` defines 3 difficulty tiers: `beginner`, `intermediate`, and `advanced`.
- **Beginner**: Core identity, audience pain points, primary logo, basic colors, clearspace rules.
- **Intermediate**: Operational values, differentiators, We Are / We Are Not, typography scales, touchpoint dielines.
- **Advanced**: Naming taxonomy formulas, portfolio graph coupling tiers, variable fonts.
- **Implementation**: Topics are tagged with difficulty badges. In Guided Mode, all active topics for a stage are accessible, with advanced topics grouped in collapsible sections to prevent cognitive overload.

---

## 11. Diagnostic Architecture & Boundaries

```
+-----------------------------------------------------------------------------------+
| DETERMINISTIC HEURISTICS (Phase 4.2 Pure TypeScript Engine)                       |
| - Missing required logo reversed variant when dark color exists                   |
| - Differentiator missing proof/evidence string                                    |
| - OneLineDescription exceeding word threshold or matching known buzzwords         |
| - Self-looping relationship in Brand Architecture graph                           |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
| SEMANTIC / COGNITIVE CRITIQUE (Future Optional AI Phase)                          |
| - Evaluating whether a positioning claim is truly differentiated in the market    |
| - Evaluating whether a typography pair conveys the intended personality           |
+-----------------------------------------------------------------------------------+
```

---

## 12. AI Boundaries & Plug-in Architecture

- **Role**: Socratic interview assistant, draft refiner, and consistency critic upon explicit user request.
- **Hard Constraint**: AI will **never** automatically populate `Brand.modules.*` or silently mutate data.
- **Decoupled Engine**: The Guided UI renders standard slot triggers (e.g. `[ Ask AI to critique this positioning ]`) that communicate via clean event callbacks, ensuring zero vendor lock-in.

---

## 13. Persistence Architecture

| State Layer | Location | Key / Storage | Schema Impact |
| :--- | :--- | :--- | :--- |
| **Brand Knowledge** | LocalStorage | `brand_guidelines_data` | **FROZEN (Zero change)** |
| **Experience Mode** | LocalStorage | `app_experience_mode` | None (UI state) |
| **Active Guided Stage** | React State | `activeStageId` (in `App.tsx`) | None (Session state) |
| **Dismissed Guidance Tips** | LocalStorage | `app_dismissed_guidance` | None (UI state) |

---

## 14. Bilingual Architecture & Parity

All Guided Mode UI components (stage ribbons, narrative banners, guidance drawers, diagnostic alerts) resolve text through:
1. `guidanceContent.ts` typed `LocalizedString` entries (`en` and `id`).
2. Existing translation engine (`src/i18n/translations.ts` via `t(key, uiLanguage)`).
- Full bilingual parity is guaranteed with zero missing keys.

---

## 15. Preview Boundary

- **Working Environment**: Guided Mode and Studio Mode are authoring/learning workspaces.
- **Guideline Preview**: The client-facing presentation assembled strictly from `Brand.modules.*`.
- Guidance copy, client interview prompts, and weak/strong examples **never leak into the Preview or Export document**.

---

## 16. Proposed Component Architecture

```
src/
├── components/
│   ├── Header.tsx                                [MODIFIED: Add Guided/Studio toggle]
│   ├── guided/
│   │   ├── GuidedBrandExperience.tsx             [NEW: Main Guided Container]
│   │   ├── StageJourneyRibbon.tsx                [NEW: 6-Stage Progress & Nav Bar]
│   │   ├── StageNarrativeHeader.tsx              [NEW: Learning Objective & Mental Model]
│   │   ├── ContextualGuidanceDrawer.tsx          [NEW: 9-Block Pedagogical Content Renderer]
│   │   ├── DiagnosticAlertsList.tsx              [NEW: Diagnostic Warning & Tip Cards]
│   │   └── InactiveModuleNotice.tsx              [NEW: Activation Prompt for Inactive Stages]
├── utils/
│   └── guidanceController.ts                     [NEW: Stage progress & next-step logic]
```

---

## 17. Data Flow & State Ownership

```
[ User Interaction in Guided Mode ]
               ↓
[ Embedded Frozen Editor (e.g. OverviewEditor) ]
               ↓
[ `onChange` / `handleUpdateModuleData(moduleId, data)` in App.tsx ]
               ↓
[ `Brand.modules[moduleId]` Updated in React State ]
               ↓
[ `saveSingleBrand()` Debounced to LocalStorage ]
               ↓
[ `guidanceController` Reactively Re-calculates Stage Progress ]
```

---

## 18. Explicit Non-Goals for Phase 4.2

1. **No Form Re-implementations**: We will not rewrite `OverviewEditor`, `PositioningEditor`, etc.
2. **No Rigid Wizards**: We will not disable or lock stage navigation.
3. **No Autonomous AI Authoring**: We will not introduce automated brand generation.
4. **No Schema Mutations**: We will not touch `src/types/brand.ts` or migration logic.

---

## 19. Recommended Phase 4.2 Implementation Sequence

When approved to move from review to execution, Phase 4.2 will proceed in 4 structured sub-phases:

1. **Phase 4.2A — Guidance Controller & State Integration**:
   - Create `src/utils/guidanceController.ts` (stage progress, recommended next step calculation).
   - Add `experienceMode` state and toggle to `App.tsx` and `Header.tsx`.
2. **Phase 4.2B — Guided Brand Experience UI Components**:
   - Create `StageJourneyRibbon.tsx`, `StageNarrativeHeader.tsx`, `ContextualGuidanceDrawer.tsx`, and `GuidedBrandExperience.tsx`.
3. **Phase 4.2C — Editor Embedding & Diagnostic Wiring**:
   - Mount existing 12 editors into the Guided Container with contextual guidance drawers.
4. **Phase 4.2D — Smoke Tests, Browser Validation & Regression**:
   - Create `src/phase4_2_guided_ui_smoke.test.ts`.
   - Run full regression and production build.

---

# Architectural Review Verdict
**PHASE 4.2 — ARCHITECTURAL REVIEW COMPLETE — AWAITING APPROVAL**  
*(Frozen Level 3 baseline `ff52bdf` and Phase 4.1C baseline `9962145` are 100% preserved).*
