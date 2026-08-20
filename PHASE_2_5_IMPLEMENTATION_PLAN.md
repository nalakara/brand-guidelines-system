# Phase 2.5 — Visual Knowledge Deepening: Architecture Review & Implementation Plan (Revised)

**Evaluation Baseline**: Commit `32748db` (*feat: implement Phase 2 brand knowledge entity architecture*)  
**Scope Context**: Deepening Visual Knowledge Entities without altering navigation, inventing unrecorded data, or adding unneeded domains  
**Core Architectural Principles**:
1. **"Entity = Meaningful Reusable Brand Knowledge."** Do not create entities for primitive design values (e.g. raw pixel values, arbitrary geometric shapes, alignment directions).
2. **"Never fabricate Brand Knowledge during migration."** Preserve known legacy information only; do not generate synthetic tokens or assumptions not explicitly authored by the user.
3. **"Everything is available, nothing is mandatory."** All fields and entities remain strictly optional.

---

## 1. Objective

Phase 2.5 deepens the three partially-structured subsystems within **Visual Knowledge** into first-class, structured, and referencable Brand Knowledge entities:

1. **Layout & Composition** (Grid Systems, Layout & Composition Principles)
2. **Imagery & Photography** (Imagery Directions / Photography Styles, Image Treatments)
3. **Graphic Language** (Graphic Elements / Motifs, Illustration Styles, Iconography Systems)

This enables authentic cross-domain relationships such as:
* *"Visual Rule X restricts Photo Style A to Editorial contexts"*
* *"Key Message Y links to Imagery Direction B"*
* *"Layout Template Asset Z implements Grid System C"*
* *"Icon SVG Asset Family links to Iconography System D"*

All enhancements occur **strictly within the existing modules and navigation**, preserving the frozen Phase 2 Entity Reference Architecture.

---

## 2. Current State

In commit `32748db`, Visual Knowledge contains six subsystems:
* `logos` (`LogoItem[]`, `LogoVariant[]`): Fully structured entities with `id`, types, roles, and color variants.
* `colors` (`ColorItem[]`, `ColorSwatch[]`): Fully structured entities with `id`, roles, color values (HEX/RGB/HSL/CMYK), and localized usage notes.
* `fonts` (`FontItem[]`, `TypeStyleItem[]`): Fully structured entities with `id`, weights, styles, family links, and type hierarchy tokens.
* `imagery` (`ImageryData`): Grouped configuration block (`photography?: PhotographyData`, `artDirection?: ArtDirectionData`, `characteristics?: ImageCharacteristicsData`) consisting of string arrays (`mood[]`, `subjects[]`, `lighting[]`, `composition[]`, `colorTreatment[]`).
* `graphicLanguage` (`GraphicLanguageData`): Grouped configuration categories (`shapes`, `patterns`, `illustration`, `iconography`, `lines`, `decorativeElements`) with descriptions and keyword arrays.
* `layoutComposition` (`LayoutCompositionData`): Grouped configuration categories (`grid`, `spacing`, `alignment`, `proportion`, `hierarchy`, `compositionPrinciples`) with scalar numbers (columns, gutterPx, marginPx, baseUnitPx) and keyword arrays.

---

## 3. Architectural Gaps & Refined Boundary Decisions

| Capability Subsystem | Current Schema Representation | Architectural Limitation | Revised Refinement Decision |
|---|---|---|---|
| **Layout & Composition** | `LayoutCompositionData` singleton object with `grid`, `spacing`, `alignment`, etc. | Grid systems and composition principles cannot be independently referenced in Rules or linked to template assets. | **Model Grid Systems & Layout Principles as Entities.** Retain Spacing Scale as a structured subsystem attribute (`SpacingScaleData` with `baseUnitPx` and optional scale steps), avoiding micro-entity over-modeling for raw pixel values. |
| **Imagery / Photography** | `ImageryData` with singleton `photography`, `artDirection`, and `characteristics` sub-objects. | A brand cannot define multiple distinct photo styles (e.g. "Documentary Portraiture" vs. "Clean Product Stills"). Rules cannot target a specific photography style independently. | **Model `ImageryDirectionEntity` & `ImageTreatmentEntity`.** Represents authentic reusable photographic/visual directions and treatment systems. |
| **Graphic Language** | `GraphicLanguageData` with singleton category records (`shapes`, `illustration`, `iconography`). | A brand cannot define distinct iconography systems (e.g. "Monoline 24px UI" vs. "Filled Marketing Icons") or specific graphic motifs as discrete entities that link to assets. | **Model `GraphicElementEntity`, `IllustrationStyleEntity`, & `IconographySystemEntity`.** Represents discrete reusable motifs, illustration systems, and icon systems. |

---

## 4. Proposed Entity Model

We adopt the **minimal coherent model** to prevent over-modeling. Primitive design values remain structured configuration properties, while reusable systems and principles become first-class entities.

```
VISUAL KNOWLEDGE (Deepened)
 ├── Logo System (Existing: LogoItem, LogoVariant)
 ├── Color System (Existing: ColorItem, ColorSwatch)
 ├── Typography System (Existing: FontItem, TypeStyleItem)
 ├── Layout & Composition
 │     ├── GridSystemEntity[] (Discrete grid systems: 12-col desktop, 4-col mobile, baseline, modular)
 │     ├── LayoutPrincipleEntity[] (Principles: alignment, proportion, hierarchy, whitespace discipline)
 │     └── SpacingScaleData (Structured system configuration: baseUnitPx, scaleSteps, description)
 ├── Imagery System
 │     ├── ImageryDirectionEntity[] (Distinct photo/imagery styles with mood, subjects, lighting, Do/Don't)
 │     └── ImageTreatmentEntity[] (Color treatment, filters, duotone, post-processing rules)
 └── Graphic Language System
       ├── GraphicElementEntity[] (Reusable motifs, patterns, bespoke shapes, visual accents)
       ├── IllustrationStyleEntity[] (Illustration directions, line weights, palettes, character rules)
       └── IconographySystemEntity[] (Icon systems, stroke weights, grid sizes, corner radiuses)
```

### A. Layout & Composition Entities & Data

```typescript
export interface GridSystemEntity {
  id: string; // e.g. 'grid-1'
  name: LocalizedString; // e.g. "12-Column Desktop Grid"
  type: 'column' | 'modular' | 'baseline' | 'freeform' | 'custom';
  columns?: number;
  gutterPx?: number;
  marginPx?: number;
  contextChannel?: string; // e.g. "Desktop Web", "Editorial Print", "Mobile App"
  description?: LocalizedString;
}

export interface LayoutPrincipleEntity {
  id: string; // e.g. 'lp-1'
  title: LocalizedString; // e.g. "Intentional Whitespace & Asymmetry"
  category: 'alignment' | 'proportion' | 'hierarchy' | 'composition';
  description: LocalizedString;
  guidance?: LocalizedString;
}

export interface SpacingScaleData {
  baseUnitPx?: number; // e.g. 8
  scaleSteps?: number[]; // e.g. [4, 8, 16, 24, 32, 48, 64] (explicitly defined by user only)
  description?: LocalizedString;
}
```
*Rationale for Spacing*: Spacing tokens are numerical steps of a scale rather than independent brand entities that require standalone cross-referencing. Modeling Spacing as `SpacingScaleData` avoids token explosion while keeping the base unit and scale steps fully structured.

### B. Imagery & Photography Entities

```typescript
export interface ImageryDirectionEntity {
  id: string; // e.g. 'img-dir-1'
  name: LocalizedString; // e.g. "Documentary Cafe Moments"
  category?: 'photography' | 'editorial' | 'product' | 'lifestyle' | 'abstract';
  description: LocalizedString;
  mood?: string[];
  subjects?: string[];
  lighting?: string[];
  composition?: string[];
  doGuidance?: LocalizedString;
  dontGuidance?: LocalizedString;
}

export interface ImageTreatmentEntity {
  id: string; // e.g. 'img-trm-1'
  name: LocalizedString; // e.g. "Warm Daylight Wash"
  description: LocalizedString;
  colorTreatment?: string[]; // e.g. ["Warm", "Muted", "Low Saturation"]
  filterNotes?: LocalizedString;
}
```

### C. Graphic Language Entities

```typescript
export interface GraphicElementEntity {
  id: string; // e.g. 'ge-1'
  name: LocalizedString; // e.g. "Warm Parchment Topo Line Pattern"
  category: 'shape' | 'pattern' | 'decorative' | 'line';
  description: LocalizedString;
  characteristics?: string[];
  usageNotes?: LocalizedString;
}

export interface IllustrationStyleEntity {
  id: string; // e.g. 'illus-1'
  name: LocalizedString; // e.g. "Minimal Monoline Botanical"
  style: string[]; // e.g. ["Hand-drawn", "Minimal", "Monoline"]
  subjects?: string[];
  description: LocalizedString;
  treatment?: LocalizedString;
}

export interface IconographySystemEntity {
  id: string; // e.g. 'icon-sys-1'
  name: LocalizedString; // e.g. "24px Rounded UI Icons"
  style: string[]; // e.g. ["Outline", "Rounded", "2px Stroke"]
  gridSizePx?: number; // e.g. 24
  strokeWidthPx?: number; // e.g. 2
  description: LocalizedString;
  cornerTreatment?: 'sharp' | 'rounded' | 'chamfered';
}
```

---

## 5. Entity Reference & Semantic Relationship Integration

### Extended `EntityType` Union in `src/types/brand.ts`
```typescript
export type EntityType =
  // Foundation (Existing)
  | 'strategyValue' | 'strategicPriority' | 'targetAudience' | 'differentiator'
  | 'personalityTrait' | 'voicePrinciple' | 'vocabularyTerm' | 'writingExample'
  | 'keyMessage' | 'proofPoint' | 'callToAction'
  // Visual Knowledge (Existing + Phase 2.5 Deepened)
  | 'logo' | 'color' | 'font' | 'typeStyle'
  | 'gridSystem' | 'layoutPrinciple'                     // <-- Phase 2.5
  | 'imageryDirection' | 'imageTreatment'                // <-- Phase 2.5
  | 'graphicElement' | 'illustrationStyle' | 'iconSystem' // <-- Phase 2.5
  // Assets & Rules (Existing)
  | 'asset' | 'rule';
```

### Indexing in `src/utils/entityResolver.ts`
The `getAvailableEntities(brand, filterDomain?, filterType?, lang?)` function indexes the new collections under `domain: 'visualKnowledge'`:
* `GridSystemEntity` $\rightarrow$ `name: "{name} ({columns} cols)"`, `categoryOrRole: 'Grid System'`
* `LayoutPrincipleEntity` $\rightarrow$ `name: "{title}"`, `categoryOrRole: 'Layout Principle'`
* `ImageryDirectionEntity` $\rightarrow$ `name: "{name}"`, `categoryOrRole: 'Imagery Direction'`
* `ImageTreatmentEntity` $\rightarrow$ `name: "{name}"`, `categoryOrRole: 'Image Treatment'`
* `GraphicElementEntity` $\rightarrow$ `name: "{name}"`, `categoryOrRole: 'Graphic Element'`
* `IllustrationStyleEntity` $\rightarrow$ `name: "{name}"`, `categoryOrRole: 'Illustration Style'`
* `IconographySystemEntity` $\rightarrow$ `name: "{name}"`, `categoryOrRole: 'Iconography System'`

### ReferencePicker & Semantic Relationship Awareness
* **ReferencePicker Capability**: The picker can filter by `domain: 'visualKnowledge'` or specific `entityType`.
* **Semantic Relationships**:
  * Visual Rules can target any entity type via `references[]`.
  * Messaging Key Messages continue targeting `targetAudience` and `proofPoint` entities.
  * Visual Assets link to relevant Visual Knowledge entities (`imageryDirection`, `iconSystem`, `graphicElement`, `gridSystem`).
* *Relationship Filtering*: The picker supports an optional `filterType` constraint so editors can narrow selection when only specific entity types are semantically meaningful.

---

## 6. Asset Integration

Visual Assets use `references: AssetReference[]`. With Phase 2.5:
* A photography asset (e.g. `northstar_cafe_interior.jpg`) links to `ImageryDirectionEntity` (`id: 'img-dir-1'`).
* An SVG icon family asset (e.g. `beverage_icons.svg`) links to `IconographySystemEntity` (`id: 'icon-sys-1'`).
* A layout template asset (e.g. `menu_dieline_grid.ai`) links to `GridSystemEntity` (`id: 'grid-1'`).
* Reverse backlinks (`findBackReferences`) discover these connections automatically without modifying the Asset storage structure.

---

## 7. Rule Integration

`VisualRuleItem.references: EntityReference[]` attaches directly to the deepened entities:
* **Requirement Rule**: *"Always align hero headline to 12-Column Desktop Grid"* (`entityType: 'gridSystem'`, `entityId: 'grid-1'`).
* **Restriction Rule**: *"Do not apply high-contrast flash photography to Cafe Moments"* (`entityType: 'imageryDirection'`, `entityId: 'img-dir-1'`).
* **Preference Rule**: *"Prefer 24px Rounded UI Icons on digital navigation bars"* (`entityType: 'iconSystem'`, `entityId: 'icon-sys-1'`).

---

## 8. Reference Integrity & Dangling Reference Policy

To maintain lightweight, robust reference integrity without building an over-engineered cascading-delete engine:
1. **Resolver Resilience**: `resolveEntityLabel(brand, ref, lang)` already falls back to `ref.label || ref.entityId` if the target entity is missing or deleted. Referencing consumer cards will render the cached label with an indicator rather than crashing.
2. **Deletion Dependency Warning**:
   * Before deleting an entity in an editor (e.g. deleting an `ImageryDirection` or `GridSystem`), call `findBackReferences(brand, entityId)`.
   * If backlinks exist, display a lightweight confirmation modal listing the referencing Rules/Assets:
     > *"This entity is referenced by 2 Visual Rules. Deleting it will keep the cached label in those rules. Are you sure?"*
3. **No Hidden Mutations**: Deleting an entity never silently corrupts or forcibly mutates unrelated modules.

---

## 9. Migration & Normalization Strategy (`src/utils/migration.ts`)

### Non-Destructive, Idempotent Normalization
When `normalizeBrandData(brand)` executes:
1. **Never Fabricate Knowledge**:
   * If `layoutComposition.grid` exists with explicit `columns` or description, map it to a single `GridSystemEntity` (`id: 'grid-1'`). If empty, leave the array empty.
   * If `layoutComposition.spacing.baseUnitPx` exists (e.g. `8`), retain `baseUnitPx: 8` in `spacingScale`. **Do NOT invent arbitrary scale steps (4, 16, 24, etc.)** unless the user explicitly authored them.
   * If `imagery.photography` exists with explicit description or mood, map it to `ImageryDirectionEntity` (`id: 'img-dir-1'`). If empty, do not fabricate photo styles.
   * If `graphicLanguage.illustration` exists with style/subject, map it to `IllustrationStyleEntity` (`id: 'illus-1'`).
   * If `graphicLanguage.iconography` exists with style/description, map it to `IconographySystemEntity` (`id: 'icon-sys-1'`).
2. **Idempotency Guarantee**:
   * If an entity array already contains items with IDs, `normalizeBrandData` preserves them untouched.
   * Multiple normalization passes produce byte-for-byte identical objects.

---

## 10. UI & Editor Changes

All changes occur within the existing tabbed editors in `src/components/editors/`:

1. **`LayoutCompositionEditor.tsx`**:
   * Manageable list for **Grid Systems** (Add/Edit Grid modal with columns, gutter, margin, context channel).
   * Manageable list for **Layout Principles** (Alignment, proportion, hierarchy, composition).
   * **Spacing Scale** configuration panel (base unit and custom scale steps).
2. **`ImageryEditor.tsx`**:
   * Card-based list of **Imagery Directions** (Name, Mood chips, Subject tags, Lighting guidance, Do/Don't notes).
   * Card-based list of **Image Treatments** (Name, color treatment tags, filter notes).
3. **`GraphicLanguageEditor.tsx`**:
   * Manageable lists for **Graphic Elements / Motifs**, **Illustration Styles**, and **Iconography Systems** (with stroke width and grid size inputs).

---

## 11. Preview Changes (`src/components/preview/GuidelinePreview.tsx`)

* Update the **Visual Guidelines** documentation section to render structured cards for:
  * Grid Systems with column specifications and channel contexts.
  * Spacing scale base unit and defined steps.
  * Imagery Directions with mood/lighting tags and subject chips.
  * Iconography and Illustration styles with defined rules and stroke metrics.
* Maintain fallback rendering for legacy brands containing scalar strings.

---

## 12. Localization Plan (`src/i18n/translations.ts`)

Add parallel English and Indonesian strings for:
* **Entities**: `gridSystem`, `layoutPrinciple`, `imageryDirection`, `imageTreatment`, `graphicElement`, `illustrationStyle`, `iconSystem`.
* **Actions & Headers**: `addGridSystem`, `addLayoutPrinciple`, `addImageryDirection`, `addImageTreatment`, `addGraphicElement`, `addIllustrationStyle`, `addIconSystem`.
* **Field Labels**: `columnsCount`, `gutterWidth`, `marginWidth`, `baseSpacingUnit`, `strokeWidth`, `gridSize`, `lightingDirection`, `subjectTags`, `moodTags`.

---

## 13. Testing Strategy

1. **Automated Unit & Regression Suite (`src/phase2_5_smoke.test.ts`)**:
   * Verify creation and persistent IDs for all deepened entity types.
   * Verify `getAvailableEntities` aggregates all new entity types across Visual Knowledge.
   * Verify `resolveEntityLabel` live resolution upon renaming.
   * Verify dangling reference fallback behavior (`ref.label || ref.entityId`).
   * Verify cross-domain references in `VisualRuleItem` and `VisualAssetItem`.
   * Verify `normalizeBrandData` does NOT fabricate unrecorded knowledge and is 100% idempotent.
2. **Build Verification**:
   * `tsc --noEmit` clean compile (0 errors).
   * `npm run build` production bundle passing.

---

## 14. Files Expected to Change

* [`src/types/brand.ts`](file:///Users/yudhan/Library/CloudStorage/GoogleDrive-nalakara.id@gmail.com/My%20Drive/FRAMEWORKS/Brand%20Guidelines%20System/src/types/brand.ts) (Deepened entity interfaces & `EntityType` union)
* [`src/utils/migration.ts`](file:///Users/yudhan/Library/CloudStorage/GoogleDrive-nalakara.id@gmail.com/My%20Drive/FRAMEWORKS/Brand%20Guidelines%20System/src/utils/migration.ts) (Idempotent normalization logic without knowledge fabrication)
* [`src/utils/entityResolver.ts`](file:///Users/yudhan/Library/CloudStorage/GoogleDrive-nalakara.id@gmail.com/My%20Drive/FRAMEWORKS/Brand%20Guidelines%20System/src/utils/entityResolver.ts) (Index new entities for resolver and picker)
* [`src/components/editors/LayoutCompositionEditor.tsx`](file:///Users/yudhan/Library/CloudStorage/GoogleDrive-nalakara.id@gmail.com/My%20Drive/FRAMEWORKS/Brand%20Guidelines%20System/src/components/editors/LayoutCompositionEditor.tsx)
* [`src/components/editors/ImageryEditor.tsx`](file:///Users/yudhan/Library/CloudStorage/GoogleDrive-nalakara.id@gmail.com/My%20Drive/FRAMEWORKS/Brand%20Guidelines%20System/src/components/editors/ImageryEditor.tsx)
* [`src/components/editors/GraphicLanguageEditor.tsx`](file:///Users/yudhan/Library/CloudStorage/GoogleDrive-nalakara.id@gmail.com/My%20Drive/FRAMEWORKS/Brand%20Guidelines%20System/src/components/editors/GraphicLanguageEditor.tsx)
* [`src/components/preview/GuidelinePreview.tsx`](file:///Users/yudhan/Library/CloudStorage/GoogleDrive-nalakara.id@gmail.com/My%20Drive/FRAMEWORKS/Brand%20Guidelines%20System/src/components/preview/GuidelinePreview.tsx)
* [`src/data/sampleBrand.ts`](file:///Users/yudhan/Library/CloudStorage/GoogleDrive-nalakara.id@gmail.com/My%20Drive/FRAMEWORKS/Brand%20Guidelines%20System/src/data/sampleBrand.ts) (Sample data for Northstar Coffee)
* [`src/i18n/translations.ts`](file:///Users/yudhan/Library/CloudStorage/GoogleDrive-nalakara.id@gmail.com/My%20Drive/FRAMEWORKS/Brand%20Guidelines%20System/src/i18n/translations.ts) (EN & ID translations)
* [`src/phase2_5_smoke.test.ts`](file:///Users/yudhan/Library/CloudStorage/GoogleDrive-nalakara.id@gmail.com/My%20Drive/FRAMEWORKS/Brand%20Guidelines%20System/src/phase2_5_smoke.test.ts) (New automated acceptance test suite)

---

## 15. Architectural Risks & Mitigations

1. **Risk of Over-modeling**: Creating distinct entity models for primitive design values (e.g. pixel numbers, raw geometric shapes).
   * *Mitigation*: Strictly modeling reusable systems (`GridSystemEntity`, `ImageryDirectionEntity`, `IconographySystemEntity`, `GraphicElementEntity`) while keeping spacing scales and general characteristics as structured properties.
2. **Risk of Data Fabrication in Migration**:
   * *Mitigation*: Normalizer maps only explicit, recorded data. If a brand has only a base unit of 8px, it preserves `baseUnitPx: 8` and leaves `scaleSteps` undefined.
3. **Risk of Broken Dangling References**:
   * *Mitigation*: Dynamic resolver always falls back to cached `label` or `entityId`; editors warn users via `findBackReferences` before deletion.

---

## 16. Acceptance Criteria

1. Subsystems (Layout, Imagery, Graphic Language) allow creating, editing, and deleting discrete reusable entities with persistent IDs.
2. New entity types appear in the `ReferencePicker` and can be attached to Visual Rules and Visual Assets.
3. Renaming any deepened entity instantly reflects across all referencing consumers in real-time via `resolveEntityLabel`.
4. `normalizeBrandData` deterministically normalizes legacy data without data fabrication or ID mutation.
5. Deletion of referenced entities does not crash referencing consumers (graceful fallback).
6. All UI labels, badges, and modals support both English and Indonesian.
7. `tsc --noEmit`, `vitest`, and `npm run build` pass with 0 errors.

---

## 17. Implementation Sequence

* **Step 1**: Type System Expansion (`src/types/brand.ts`)
* **Step 2**: Normalization & Resolver Engine (`migration.ts`, `entityResolver.ts`)
* **Step 3**: Editor Upgrades (`LayoutCompositionEditor`, `ImageryEditor`, `GraphicLanguageEditor`)
* **Step 4**: Preview Rendering & Sample Brand Data (`GuidelinePreview.tsx`, `sampleBrand.ts`)
* **Step 5**: Localization (`translations.ts`)
* **Step 6**: Automated Regression Test & Build Verification (`phase2_5_smoke.test.ts`, `npm run build`)

---

## 18. Critical Architectural Decision

### **Recommendation: Option A — Only entity deepening inside existing Visual Knowledge**

**Justification**:
* The existing tripartite architecture (`Visual Knowledge` $\leftrightarrow$ `Visual Assets` $\leftrightarrow$ `Visual Rules`) and the Phase 2 `EntityReference` contract natively accommodate these entities without structural changes.
* No new domains, navigation sidebars, or shared engine alterations are required.
* Eliminating primitive over-modeling (e.g. spacing tokens) ensures the knowledge model remains clean, robust, and aligned with professional brand identity systems.
