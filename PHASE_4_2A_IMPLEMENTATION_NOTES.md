# Phase 4.2A — Guided Mode Controller & State Foundation Implementation Notes

**Document Version:** 1.0.0  
**Phase:** 4.2A — Controller & State Foundation  
**Baseline Commits:** Level 3 Frozen at `ff52bdf`, Phase 4.1C Frozen at `9962145`  
**Status:** Implementation Complete  

---

## 1. State Ownership & Architecture

| State Layer | Location | Storage Mechanism | Architectural Role |
| :--- | :--- | :--- | :--- |
| **Brand Knowledge** | Authoritative Source | `localStorage` (`brand_guidelines_data`) | **FROZEN**. Stores all typed brand decisions (`Brand.modules.*`). |
| **Experience Mode** | Application UI State | `localStorage` (`app_experience_mode`) | Controls workspace mode (`'guided' \| 'studio'`). Defaults to `'guided'`. |
| **Guidance Interaction State** | UI Session Layer | React / Optional UI persistence | Tracks topic progress (`notStarted`, `viewed`, `workedOn`, `completed`, `skipped`). |
| **Active Stage** | Workspace Navigation | React Component State (`App.tsx` / `GuidedBrandExperience`) | Ephemeral active stage selection. |

- **Strict Boundary**: Zero guidance interaction state is stored inside the `Brand` entity.

---

## 2. Controller Responsibilities (`src/utils/guidanceController.ts`)

The controller is a **pure, deterministic TypeScript engine**:
1. **Stage Discovery (`getActiveStages`)**: Filters the 6 curriculum stages to those containing at least one active module.
2. **Advisory Stage Progress (`calculateStageProgress`)**: Computes composite knowledge status (`empty`, `started`, `complete`) and guidance completion without locking navigation.
3. **Topic Status Resolver (`getTopicStatus`)**: Resolves interaction status for individual topics.
4. **Recommendation Engine (`getRecommendedNext`)**: Identifies the next recommended incomplete stage and module in curriculum order with structured reason codes.
5. **Revisit Suggestions Engine (`getRevisitSuggestions`)**: Detects legitimate upstream-to-downstream review triggers (e.g. `Positioning` content with empty `Personality`, or `Visual Knowledge` with empty `Visual Rules`).
6. **Difficulty Filter (`filterTopicsByDifficulty`)**: Implements progressive disclosure by grouping intermediate and advanced topics without locking access.

---

## 3. Recommendation Reason Codes (Structured Reason Metadata)

The controller outputs structured reason identifiers instead of hardcoded UI strings:
- `firstIncompleteStage`: Recommends the first active stage in curriculum order that has not been started.
- `activeModuleIncomplete`: Recommends an in-progress active module requiring attention.
- `upstreamDependency`: Recommends reviewing a downstream module following an upstream change.
- `revisitSuggested`: Recommends verifying rules after touchpoint creation.
- `optionalExploration`: All active modules substantially defined; recommends optional advanced exploration.

---

## 4. Knowledge Status vs. Guidance Progress Distinction

```
+-----------------------------------------------------------------------------------+
| 1. Knowledge Status (Authoritative):                                              |
|    - 'empty' | 'started' | 'complete'                                             |
|    - Calculated directly from authored Brand.modules.* data.                      |
+-----------------------------------------------------------------------------------+
| 2. Guidance Interaction Status (Pedagogical):                                     |
|    - 'notStarted' | 'viewed' | 'workedOn' | 'completed' | 'skipped'               |
|    - Represents designer engagement with the educational material.                |
+-----------------------------------------------------------------------------------+
```

---

## 5. Explicit Non-Goals for Phase 4.2A

- **No Form Re-implementations**: Editors remain the single source of editing logic.
- **No Locking Wizard**: Stages and modules are never locked.
- **No Autonomous AI Authoring**: No synthetic brand creation or silent mutation.
- **No UI Layout Rendering**: UI components (`StageJourneyRibbon`, `GuidanceDrawer`, `GuidedBrandExperience`) are deferred to Phase 4.2B.

---

## 6. How Phase 4.2B Will Consume the Controller

In Phase 4.2B:
1. `GuidedBrandExperience.tsx` calls `evaluateGuidanceState(activeBrand, interactionState)` on render.
2. `StageJourneyRibbon.tsx` renders the 6 stages with active badges, progress bars, and click handlers.
3. `ContextualGuidanceDrawer.tsx` renders the 9 pedagogical blocks for the active topic.
4. The embedded frozen editor (`OverviewEditor`, `PositioningEditor`, etc.) is mounted directly below the ribbon.

---

## 7. Verification Summary

- **Automated Tests (`npx vitest run`)**: **61/61 tests passed** (10 test suites).
- **Production Build (`npm run build`)**: **PASS** (Zero TypeScript / Vite errors).
- **Frozen Baselines**: Level 3 (`ff52bdf`) and Phase 4.1C (`9962145`) remain **100% untouched**.
