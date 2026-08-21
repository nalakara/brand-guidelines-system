# Phase 4.1 — Guided Brand Experience Architecture Review

**Document Version:** 1.0.0  
**Phase:** 4.1 — Architectural Blueprint & Pre-Implementation Review  
**Baseline Commit:** `ff52bdf` (Level 3 Frozen)  
**Status:** Pre-Implementation Architectural Review  

---

## Executive Summary

Phase 4.1 introduces the **Guided Brand Experience** — an educational, progressive design journey designed for graphic designers transitioning into professional brand identity design.

This review verifies the technical boundaries, component models, persistence rules, and pedagogical wrapping strategies necessary to implement Phase 4.1 **without modifying, redefining, or altering any frozen Level 1, 2, 2.5, or 3 Brand Knowledge schemas or resolvers**.

---

## 1. Architectural Boundary & Core Principle

```
+----------------------------------------------------------------------------------------------------+
|                                    GUIDED BRAND EXPERIENCE                                         |
|                               (Phase 4.1 Pedagogical Layer)                                        |
|                                                                                                    |
|   +--------------------------------------------------------------------------------------------+   |
|   | 1. Curriculum Content Repository (`src/data/guidanceContent.ts`)                           |   |
|   |    - 6 Stages, 12 Topics, Bilingual (EN + ID adapted)                                      |   |
|   |    - ConceptExplanation, WhyThisMatters, DiscoveryPrompt, ExemplaryReference               |   |
|   |    - CommonMistakeWarning, DiagnosticSignal, DecisionDependency, RevisitSuggestion         |   |
|   +--------------------------------------------------------------------------------------------+   |
|   | 2. Guided Container (`src/components/guided/GuidedBrandExperience.tsx`)                     |   |
|   |    - Stage Journey Navigation (Non-linear, No completion locks)                            |   |
|   |    - Stage Overview & Objectives                                                           |   |
|   |    - Contextual Guidance Accordion / Drawer                                                |   |
|   |    - Embedded Editor Projection (Wraps existing frozen editors)                            |   |
|   +--------------------------------------------------------------------------------------------+   |
|   | 3. Experience Mode Controller (`experienceMode: 'guided' | 'studio'`)                      |   |
|   |    - Switcher in Header, persisted in localStorage `app_experience_mode`                   |   |
|   +--------------------------------------------------------------------------------------------+   |
+----------------------------------------------------------------------------------------------------+
                                                  |
                    Non-Mutating Pedagogical & Interaction Projection
                                                  |
                                                  v
+----------------------------------------------------------------------------------------------------+
|                               FROZEN BRAND KNOWLEDGE SOURCE OF TRUTH                               |
|                                         (Commit ff52bdf)                                           |
|                                                                                                    |
|   overview           strategy           positioning        personality        voiceTone          messaging         |
|   visualKnowledge    visualAssets       visualRules        brandNaming        brandArchitecture  brandExpression   |
+----------------------------------------------------------------------------------------------------+
```

### Invariants:
1. **Single Source of Truth**: `Brand.modules.*` is the sole data store for brand decisions.
2. **Zero Schema Duplication**: No parallel data structures or curriculum-specific decision stores exist.
3. **Pure Projection**: Guided Mode and Studio Mode manipulate the exact same `Brand` state through the existing editor components.
4. **Zero Knowledge Fabrication**: When a brand has empty modules, Guided Mode surfaces guidance questions and examples without inserting dummy/synthetic entities into `Brand.modules.*`.

---

## 2. Curriculum Content Repository Architecture (`src/data/guidanceContent.ts`)

To keep guidance maintainable, structured, and decoupled from component markup, guidance content will be stored in a dedicated typed data repository:

### Content Data Types
```typescript
export type GuidanceStageId = 
  | 'stage1_discover'
  | 'stage2_position'
  | 'stage3_character'
  | 'stage4_visual'
  | 'stage5_govern'
  | 'stage6_apply';

export type DifficultyTier = 'beginner' | 'intermediate' | 'advanced';

export interface ExemplaryReference {
  weak: LocalizedString;
  strong: LocalizedString;
  explanation: LocalizedString;
}

export interface GuidanceTopic {
  id: string; // e.g. 'topic_one_liner', 'topic_values', 'topic_differentiators'
  moduleId: ModuleId;
  tier: DifficultyTier;
  title: LocalizedString;
  explanation: LocalizedString;
  whyThisMatters: LocalizedString;
  discoveryPrompts: LocalizedString[];
  exemplaryReference?: ExemplaryReference;
  commonMistakes: LocalizedString[];
  diagnosticSignals: LocalizedString[];
  decisionDependencies?: {
    dependsOn?: string[];
    influences?: string[];
  };
  revisitTriggers?: LocalizedString[];
}

export interface GuidanceStage {
  id: GuidanceStageId;
  stageNumber: number;
  title: LocalizedString;
  shortDescription: LocalizedString;
  learningObjective: LocalizedString;
  designerMentalModel: LocalizedString;
  primaryModuleIds: ModuleId[];
  topics: GuidanceTopic[];
}
```

---

## 3. Experience Mode State & App Integration

### Where Experience Mode Lives
- **State Location**: Top-level `App.tsx` state (`experienceMode: 'guided' | 'studio'`).
- **Persistence**: `localStorage.getItem('app_experience_mode')` (fallback: `'guided'` for first-time users).
- **Header Placement**: Segmented pill switch in `src/components/Header.tsx`:
  `[ Guided Mode | Studio Mode ]` located next to `[ Edit | Preview ]`.
- **Zero Database / Schema Mutation**: Not stored in the `Brand` object.

---

## 4. Stage-to-Module Mapping & Editor Wrapping

### Non-Linear Stage Map:
1. **Stage 1 — Discover & Define**: `overview`, `strategy`
2. **Stage 2 — Position & Audience**: `positioning`
3. **Stage 3 — Shape the Character**: `personality`, `voiceTone`, `messaging`
4. **Stage 4 — Craft the Visual Identity**: `visualKnowledge`, `visualAssets`
5. **Stage 5 — Govern & Protect**: `visualRules`, `brandNaming`
6. **Stage 6 — Apply & Scale**: `brandExpression`, `brandArchitecture`

### How Guidance Wraps Existing Editors:
`GuidedBrandExperience.tsx` does **not** duplicate the form controls or input logic. Instead, it renders:
1. **Stage Header & Breadcrumb**: Shows the 6-stage continuum with completion indicators.
2. **Stage Narrative Banner**: Displays learning objective and mental model for the active stage.
3. **Side-by-Side / Top-Bottom Contextual Card**: Displays topic guidance (*"Why This Matters"*, *Client Prompts*, *Weak vs. Strong Example*, *Common Mistakes*).
4. **Embedded Frozen Editor**: Directly mounts `<OverviewEditor ... />`, `<PositioningEditor ... />`, etc., passing existing `onChange` callbacks.

---

## 5. Non-Linear Navigation & Zero Completion Locks

To support real-world iterative design thinking:
- The designer can click any of the 6 stages at any time.
- Stage indicators show completeness (`empty`, `started`, `complete`) using existing `calculateCompletion()` logic from `src/modules/registry.ts`.
- **No lock icons or disabled clicks**.
- Diagnostic alerts provide helpful advice (e.g. *"Tip: Defining Target Audiences in Stage 2 will make writing Key Messages in Stage 3 much easier"*), but never block the UI.

---

## 6. Testing Strategy

Dedicated test file: `src/phase4_1_guidance_smoke.test.ts`
Tests will verify:
1. Complete bilingual guidance content exists for all 6 stages.
2. English and Indonesian content parity with cultural/pedagogical adaptations.
3. Stage-to-module mapping correctness.
4. Guided Mode and Studio Mode operate against the same `Brand` state without mutating Brand Knowledge.
5. Zero synthetic knowledge fabrication on empty brands.
6. Full regression of Level 1–3 test suites (48/48 tests pass).
7. Production build exit code 0.

---

## 7. Architectural Risks & Mitigation

| Risk | Mitigation |
| :--- | :--- |
| **Risk of Data Duplication** | Guidance content contains only pedagogical copy. All brand decisions flow directly into `Brand.modules.*`. |
| **Risk of Rigid Wizard UX** | Stages are clickable tabs with feedback loop hints rather than sequential step-locks. |
| **Risk of Code Bloat** | Reuse existing 12 editor components verbatim inside `GuidedBrandExperience`. |
| **Risk of Breaking Frozen Baseline** | Zero modifications to `src/types/brand.ts`, `src/utils/entityResolver.ts`, or `src/utils/migration.ts`. |

---

# Verdict
**READY FOR APPROVAL TO PROCEED WITH PHASE 4.1 IMPLEMENTATION.**
