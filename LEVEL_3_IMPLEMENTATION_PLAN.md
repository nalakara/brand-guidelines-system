# Level 3 Implementation Plan — Brand System Architecture

**Baseline**: Commit `ab3059f` (*feat: deepen visual knowledge architecture*)  
**Architecture Reference**: `LEVEL_3_ARCHITECTURE_REVIEW.md` (Approved)  
**Status**: Ready for Implementation Approval  
**Mode**: Specification & Execution Plan Only (Read-Only Codebase)  

---

## 1. Executive Summary & Objective

The **Level 3 — Brand System** milestone evolves the Brand Guidelines System from defining *what a brand is* (Visual & Foundation Identity) to operationalizing **how an organization expresses, governs, and structures the brand across its ecosystem**.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CAPABILITY LEVEL SCOPE                            │
├──────────────────────────┬──────────────────────────────────────────────────┤
│ Level 1: Visual Identity │ Logos, Colors, Fonts, Imagery, Layout, Assets    │
│ Level 2: Brand Identity  │ Strategy, Positioning, Personality, Voice, Pitch │
│ Level 3: Brand System    │ Expression (Touchpoints), Naming, Architecture   │
│ Level 4: Brand Ecosystem │ Multi-Sensory (Motion/Sonic), Multi-Brand Worksp.│
└──────────────────────────┴──────────────────────────────────────────────────┘
```

### Core Architectural Directives
1. **Brand Knowledge is the Source**: Touchpoints, Naming Systems, and Architecture Nodes are structured knowledge entities with persistent IDs, resolved labels, and graph references.
2. **Entity = Meaningful Reusable Brand Knowledge**:
   - `TouchpointEntity` is the single entity in Brand Expression (no `ApplicationEntity` or `TemplateEntity`).
   - `NamingSystemEntity` is the single entity in Brand Naming (no `ApprovedTermEntity` or `ProductNameEntity`).
   - `BrandArchitectureNodeEntity` and `BrandRelationshipEntity` form the directed graph in Brand Architecture.
3. **Horizontal Assets & Unified Governance**: Assets (dielines, templates, mocks) live in `Visual Assets`; rules and approval criteria live in `Visual Rules` / `Semantic Rules`.
4. **Zero Knowledge Fabrication**: Migration initializes empty typed structures without inventing synthetic touchpoints or relationships.

---

## 2. Information Architecture & Navigation Schema

Level 3 fits cleanly into the application's existing domain groups:

```
BRAND
 ├── Overview (Core Metadata & Background)
 └── Brand Architecture (Portfolio Nodes & Directed Relationships)  <-- NEW (Phase 3.3)

FOUNDATION
 ├── Strategy (Values, Priorities)
 ├── Positioning (Audiences, Differentiators)
 ├── Personality (Traits, Sliders, We Are / We Are Not)
 ├── Voice & Tone (Principles, Vocabulary, Examples)
 ├── Messaging (Key Messages, Proof Points, CTAs)
 └── Brand Naming (Taxonomies, Formulas, Naming Systems)             <-- NEW (Phase 3.2)

VISUAL IDENTITY
 ├── Visual Knowledge (Logos, Colors, Fonts, Layout, Imagery, Graphic Language)
 ├── Visual Assets (Shared Horizontal Asset Library)
 └── Visual Rules (Semantic Governance Rules)

BRAND EXPRESSION                                                    <-- NEW (Phase 3.1)
 └── Touchpoints & Applications (Physical & Digital Touchpoint Entities)
```

---

## 3. Reference Semantics & Allowed Relationships

To ensure system integrity without building an unconstrained generic graph, Level 3 explicitly governs which entity reference types are semantically valid:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     LEVEL 3 REFERENCE SEMANTICS MATRIX                      │
├───────────────────────────────┬─────────────────────────────────────────────┤
│ Source Entity                 │ Allowed Target References                   │
├───────────────────────────────┼─────────────────────────────────────────────┤
│ TouchpointEntity              │ • Visual Assets (dielines, templates, mocks)│
│                               │ • Visual Rules (governing constraints)      │
│                               │ • Logos (applied mark/lockup)               │
│                               │ • Colors (primary/accent palettes applied)  │
│                               │ • Fonts / TypeStyles (typography applied)   │
│                               │ • Imagery Directions / Image Treatments     │
│                               │ • Graphic Elements / Motifs                 │
│                               │ • Target Audiences (intended consumer)      │
├───────────────────────────────┼─────────────────────────────────────────────┤
│ NamingSystemEntity            │ • Visual/Semantic Rules (naming constraints)│
│                               │ • Brand Architecture Nodes (governed tier)  │
│                               │ • Key Messages (supporting messaging pillar)│
│                               │ • Target Audiences (demographic context)    │
├───────────────────────────────┼─────────────────────────────────────────────┤
│ BrandArchitectureNodeEntity   │ • Visual Assets (sub-brand lockup vector)   │
│                               │ • Visual Rules (sub-brand usage guidelines) │
│                               │ • Touchpoint Entities (exclusive channels)  │
│                               │ • Target Audiences (specific market segment)│
├───────────────────────────────┼─────────────────────────────────────────────┤
│ BrandRelationshipEntity       │ • Visual Assets (co-branding lockups)       │
│                               │ • Visual Rules (endorsement size ratio rules│
└───────────────────────────────┴─────────────────────────────────────────────┘
```

---

## 4. Phase-by-Phase Implementation Specifications

```
                ┌──────────────────────────────────────────────┐
                │   PHASE 3.1: BRAND EXPRESSION (Touchpoints)  │
                └──────────────────────┬───────────────────────┘
                                       │ (Verified & Gate Passed)
                                       ▼
                ┌──────────────────────────────────────────────┐
                │   PHASE 3.2: BRAND NAMING (Taxonomies)       │
                └──────────────────────┬───────────────────────┘
                                       │ (Verified & Gate Passed)
                                       ▼
                ┌──────────────────────────────────────────────┐
                │   PHASE 3.3: BRAND ARCHITECTURE (Graph)      │
                └──────────────────────┬───────────────────────┘
                                       │ (Verified & Gate Passed)
                                       ▼
                ┌──────────────────────────────────────────────┐
                │   LEVEL 3 FREEZE + REGRESSION + COMMIT       │
                └──────────────────────────────────────────────┘
```

---

### Phase 3.1 — Brand Expression (`Touchpoints & Applications`)

#### 1. Objective
Establish the **Brand Expression** domain and `TouchpointEntity` model to capture real-world brand executions across physical, digital, and environmental channels.

#### 2. Data Schema & Types (`src/types/brand.ts`)
```typescript
// Extended ModuleId
export type ModuleId =
  | ... existing modules ...
  | 'brandExpression';

// Extended EntityDomain & EntityType
export type EntityDomain =
  | 'foundation'
  | 'visualKnowledge'
  | 'visualAssets'
  | 'visualRules'
  | 'brandExpression'     // Phase 3.1
  | 'brandArchitecture';  // Phase 3.3

export type EntityType =
  | ... existing types ...
  | 'touchpoint';         // Phase 3.1

export type TouchpointCategory =
  | 'stationery'        // Business cards, letterhead, envelopes, invoices
  | 'presentation'      // Keynote/PPT decks, pitch templates
  | 'socialMedia'       // Instagram grid/story, LinkedIn banners, YouTube covers
  | 'advertising'       // OOH billboards, digital ads, print ads
  | 'digitalProduct'    // Web hero, app icons, UI components
  | 'packaging'         // Boxes, coffee bags, pouches, labels, tape
  | 'signage'           // Wayfinding, storefront fascia, interior signs
  | 'environmental'     // Wall graphics, exhibition booths, murals
  | 'apparel'           // Uniforms, aprons, totes, merchandise
  | 'vehicle'           // Fleet wraps, delivery vans
  | 'custom';

export interface TouchpointSpecification {
  dimensions?: string;              // e.g. "90 × 50 mm", "1080 × 1920 px"
  aspectRatio?: string;             // e.g. "1:1", "16:9", "9:16"
  colorSpace?: 'CMYK' | 'RGB' | 'PMS' | 'Monochrome';
  materialsFinish?: LocalizedString;// e.g. "350gsm Uncoated Cotton Paper"
  safeZonePadding?: string;         // e.g. "5mm bleed, 10mm inner margin"
  productionNotes?: LocalizedString;// e.g. "Vector stroke >= 0.5pt for foil deboss"
}

export interface TouchpointEntity {
  id: string;                       // 'tp-1', 'tp-card'
  name: LocalizedString;            // "Primary Business Card"
  category: TouchpointCategory;     // 'stationery'
  channelContext?: string;          // 'Print / Networking'
  description?: LocalizedString;
  specifications?: TouchpointSpecification;
  guidelines?: {
    doCopy?: LocalizedString;       // "Keep contact details aligned to the subgrid"
    dontCopy?: LocalizedString;     // "Do not place dark artwork behind small text"
  };
  appliedAssetRefs?: EntityReference[]; // Templates, dielines, mockups in Visual Assets
  appliedRuleRefs?: EntityReference[];  // Governing Visual Rules
  governingEntityRefs?: EntityReference[]; // Logo, Color, Typography used
}

export interface BrandExpressionModule {
  overview?: LocalizedString;
  touchpoints: TouchpointEntity[];
}
```

#### 3. Migration & Normalization (`src/utils/migration.ts`)
- Add idempotent normalization pass:
  ```typescript
  brand.modules.brandExpression = {
    overview: raw.modules?.brandExpression?.overview || { en: '', id: '' },
    touchpoints: Array.isArray(raw.modules?.brandExpression?.touchpoints)
      ? raw.modules.brandExpression.touchpoints.map(normalizeTouchpoint)
      : []
  };
  ```
- No touchpoint knowledge is fabricated if absent.

#### 4. Entity Resolver Integration (`src/utils/entityResolver.ts`)
- In `getAvailableEntities`: Index all `touchpoints` under `domain: 'brandExpression', entityType: 'touchpoint'`.
- In `resolveEntityLabel`: Return `getLocalizedText(tp.name, lang).text || 'Touchpoint'`.
- In `findBackReferences`: Scan `tp.appliedAssetRefs`, `tp.appliedRuleRefs`, and `tp.governingEntityRefs` to surface incoming links from touchpoints to logos, colors, fonts, assets, and rules.

#### 5. UI Components (`src/components/editors/TouchpointsEditor.tsx`)
- Card-based entity CRUD list with category badges.
- Specification input block (dimensions, aspect ratio, color mode, materials/finish).
- Integrated `ReferencePicker` for attaching Asset dielines, Governing Rules, and Brand Knowledge entities.
- Do/Don't guidance localized textareas.

#### 6. Preview & Sample Brand
- Add `TouchpointsSection` to `GuidelinePreview.tsx`.
- Populate Northstar Coffee sample touchpoints:
  - *Roastery Coffee Bag Pouch (Packaging)* linking to dieline asset and contrast rule.
  - *Specialty Cafe Takeaway Cup (Packaging)* linking to logo lockup and parchment color.
  - *Barista Apron Uniform (Apparel)* linking to embroidered compass logo.
  - *Instagram Morning Ritual Template (Social Media)* linking to documentary photography direction.

---

### Phase 3.2 — Brand Naming (`Foundation / Governance`)

#### 1. Objective
Establish the **Brand Naming** module within `Foundation` to provide generative naming formulas, taxonomies, tier structures, and approved/prohibited examples.

#### 2. Data Schema & Types (`src/types/brand.ts`)
```typescript
// Extended ModuleId
export type ModuleId =
  | ...
  | 'brandNaming';

// Extended EntityType
export type EntityType =
  | ...
  | 'namingSystem';

export type NamingApproach =
  | 'descriptive'   // "Northstar Cold Brew"
  | 'invented'      // "Aromatica"
  | 'metaphorical'  // "Compass Blend"
  | 'acronym'       // "NSC Reserves"
  | 'arbitrary';

export type NamingTier =
  | 'flagship'      // Core product/brand line
  | 'productTier'   // Premium, Standard, Lite
  | 'feature'       // Internal capability or ingredient
  | 'internalCode'; // Internal project naming

export interface NamingFormulaStep {
  role: 'brandPrefix' | 'descriptor' | 'tierSuffix' | 'modifier' | 'arbitrary';
  label: LocalizedString; // e.g. "[Master Brand] + [Roast Profile] + 'Reserve'"
  required: boolean;
}

export interface NamingSystemEntity {
  id: string;                   // 'name-sys-1'
  title: LocalizedString;       // "Blend & Single Origin Naming Taxonomy"
  tier: NamingTier;
  approach: NamingApproach;
  formula: NamingFormulaStep[]; // Ordered formula blocks
  principles?: LocalizedString; // Guiding philosophy for this naming branch
  examples: {
    approved: string[];         // ["Northstar Solstice Roast", "Northstar Equinox Blend"]
    prohibited: string[];       // ["Northstar Luxury Java Blend"]
    rationale?: LocalizedString;// "Avoid 'Luxury' descriptor as it violates Unpretentious trait"
  };
  governingRuleRefs?: EntityReference[];
}

export interface BrandNamingModule {
  principlesOverview?: LocalizedString;
  systems: NamingSystemEntity[];
}
```

#### 3. Migration & Normalization (`src/utils/migration.ts`)
- Idempotently normalize `brand.modules.brandNaming`:
  ```typescript
  brand.modules.brandNaming = {
    principlesOverview: raw.modules?.brandNaming?.principlesOverview || { en: '', id: '' },
    systems: Array.isArray(raw.modules?.brandNaming?.systems)
      ? raw.modules.brandNaming.systems.map(normalizeNamingSystem)
      : []
  };
  ```

#### 4. Entity Resolver Integration (`src/utils/entityResolver.ts`)
- In `getAvailableEntities`: Index `namingSystems` under `domain: 'foundation', entityType: 'namingSystem'`.
- In `resolveEntityLabel`: Return `getLocalizedText(ns.title, lang).text || 'Naming System'`.
- In `findBackReferences`: Scan `governingRuleRefs` and cross-references.

#### 5. UI Components (`src/components/editors/BrandNamingEditor.tsx`)
- Naming system cards with tier/approach selectors.
- Visual formula step builder (reorderable token chips: `[Prefix] + [Descriptor] + [Suffix]`).
- Approved & prohibited tag manager with rationale text.
- Integrated `ReferencePicker` for governing rules and messaging pillars.

#### 6. Preview & Sample Brand
- Add `BrandNamingSection` to `GuidelinePreview.tsx` (visual formula badges, approved vs prohibited lists).
- Populate Northstar Coffee sample naming systems:
  - *Coffee Roast Line Taxonomy* (`[Northstar] + [Astronomical Metaphor] + 'Roast'`).
  - *Single Origin Espresso Series* (`[Northstar Origin] + [Farm/Region] + 'Lot'`).

---

### Phase 3.3 — Brand Architecture (`Portfolio Topology Graph`)

#### 1. Objective
Establish the **Brand Architecture** module under root `Brand` using a directed graph model (`Nodes + Relationships`) to govern corporate portfolios, sub-brands, endorsements, and co-branding.

#### 2. Data Schema & Types (`src/types/brand.ts`)
```typescript
// Extended ModuleId
export type ModuleId =
  | ...
  | 'brandArchitecture';

// Extended EntityType
export type EntityType =
  | ...
  | 'brandArchitectureNode'
  | 'brandRelationship';

export type BrandNodeType =
  | 'corporateMaster'   // Parent holding / master corporate brand
  | 'subBrand'          // Dependent sub-brand
  | 'endorsedBrand'     // Distinct brand with parent endorsement
  | 'productBrand'      // Autonomous product brand
  | 'ingredientBrand'   // Ingredient / technology brand
  | 'partnerBrand';     // External co-branding entity

export type CouplingLevel =
  | 'monolithic'        // 100% shared visual identity (lockup only)
  | 'endorsed'          // Unique mark + mandatory endorsement lockup
  | 'freestanding'      // Completely independent mark & palette
  | 'coBranded';        // Dual-branding lockup with strict clearance ratios

export interface BrandArchitectureNodeEntity {
  id: string;                   // 'node-master', 'node-roastery'
  name: string;                 // "Northstar Roastery Lab"
  nodeType: BrandNodeType;
  description?: LocalizedString;
  targetMarketOrAudience?: LocalizedString;
  status: 'active' | 'incubating' | 'retired';
}

export interface BrandRelationshipEntity {
  id: string;                   // 'rel-1'
  sourceNodeId: string;         // 'node-master'
  targetNodeId: string;         // 'node-roastery'
  relationshipType: 'parentOf' | 'endorses' | 'subBrandOf' | 'ingredientIn' | 'partnerWith';
  coupling: CouplingLevel;
  endorsementRuleNotes?: LocalizedString; // "Parent logo must appear at 30% scale on reverse"
  governingRuleRefs?: EntityReference[];
  sharedAssetRefs?: EntityReference[];    // Co-brand lockups in Visual Assets
}

export interface BrandArchitectureModule {
  strategyOverview?: LocalizedString;
  strategyType: 'brandedHouse' | 'houseOfBrands' | 'endorsed' | 'hybrid';
  nodes: BrandArchitectureNodeEntity[];
  relationships: BrandRelationshipEntity[];
}
```

#### 3. Graph Integrity & Deterministic In-Memory Rules
- **No Self-References**: `sourceNodeId !== targetNodeId`.
- **No Duplicate Relationships**: No two relationships share the exact same `(sourceNodeId, targetNodeId, relationshipType)`.
- **Referential Integrity on Deletion**: When a node is deleted, all relationships referencing it as source or target are automatically cleaned up in state without crashing or leaving dangling pointers.
- **Root Node Representation**: The root brand maps to a node (`id: 'node-root-' + brand.id` or `id: 'node-root'`, `name: brand.brandName || 'Master Brand'`, `nodeType: 'corporateMaster'`).
  - *Zero Fabrication Principle*: If `brandArchitecture.nodes` is empty, normalization safely leaves it empty; clicking "Initialize Architecture" or opening the editor creates the root node with the active brand name.

#### 4. Entity Resolver Integration (`src/utils/entityResolver.ts`)
- Index all nodes under `domain: 'brandArchitecture', entityType: 'brandArchitectureNode'`.
- Dynamic label returns `node.name`.
- `findBackReferences` surfaces incoming references from rules, touchpoints, and relationships.

#### 5. UI Components (`src/components/editors/BrandArchitectureEditor.tsx`)
- Strategy Type selector (`brandedHouse`, `houseOfBrands`, `endorsed`, `hybrid`).
- Node Management Table (Node type badge, status badge, market segment).
- Relationship Graph Builder (Source Node $\rightarrow$ Target Node, Relationship Type, Visual Coupling badge).
- Visual coupling indicators and endorsement rule notes.

#### 6. Preview & Sample Brand
- Add `BrandArchitectureSection` to `GuidelinePreview.tsx` (rendered tree/topology cards with visual coupling badges).
- Populate Northstar Coffee sample architecture:
  - *Northstar Coffee* (Corporate Master)
  - *Northstar Roastery Lab* (Sub-brand, Monolithic coupling)
  - *Solstice Cold Extraction* (Endorsed Brand, Endorsed coupling)
  - *Equinox Ready-to-Drink* (Product Brand, Endorsed coupling)

---

## 5. Preview & Projection Strategy

To prevent `GuidelinePreview.tsx` from growing into an unmaintainable monolith, we recommend decomposing preview rendering into clean modular sections:

```
src/components/preview/
  ├── GuidelinePreview.tsx               (Main container & TOC)
  ├── sections/
  │    ├── PreviewOverview.tsx
  │    ├── PreviewFoundation.tsx
  │    ├── PreviewVisualIdentity.tsx
  │    ├── PreviewExpression.tsx         <-- NEW (Phase 3.1)
  │    ├── PreviewNaming.tsx             <-- NEW (Phase 3.2)
  │    ├── PreviewArchitecture.tsx       <-- NEW (Phase 3.3)
  │    └── PreviewGovernanceRules.tsx
```

---

## 6. Bilingual Localization Matrix (`src/i18n/translations.ts`)

Every Level 3 entity label, category name, placeholder, modal prompt, and guidance string requires complete English (`en`) and Indonesian (`id`) dictionaries:

| Key Category | English Example | Indonesian Example |
|---|---|---|
| `domainBrandExpression` | "Brand Expression" | "Ekspresi Merek" |
| `moduleTouchpoints` | "Touchpoints & Applications" | "Titik Sentuh & Aplikasi" |
| `touchpointCategoryPackaging` | "Packaging & Unboxing" | "Kemasan & Buka Kotak" |
| `touchpointCategoryStationery` | "Stationery & Corporate" | "Alat Tulis & Dokumen Perusahaan" |
| `moduleBrandNaming` | "Brand Naming System" | "Sistem Penamaan Merek" |
| `namingTierFlagship` | "Flagship Brand Line" | "Lini Produk Utama (Flagship)" |
| `namingApproachInvented` | "Invented / Neologism" | "Kata Ciptaan / Neologisme" |
| `moduleBrandArchitecture` | "Brand Architecture" | "Arsitektur Merek" |
| `architectureStrategyBrandedHouse`| "Branded House (Monolithic)" | "Branded House (Monolitik)" |
| `couplingEndorsed` | "Endorsed Brand Coupling" | "Keterikatan Merek Terdukung" |

---

## 7. Automated & Acceptance Testing Plan

### Automated Regression Suite (`src/phase3_smoke.test.ts`)
1. **Normalization & Idempotency**:
   - `normalizeBrandData()` handles legacy brands missing Level 3 modules without mutating existing fields or fabricating fake knowledge.
   - Second normalization pass is strictly idempotent (`toEqual(normalized)`).
2. **Entity Resolver Indexing**:
   - `getAvailableEntities()` correctly indexes `touchpoint`, `namingSystem`, and `brandArchitectureNode`.
   - `resolveEntityLabel()` returns live localized titles across EN/ID.
   - Missing entity IDs fall back safely to cached labels.
3. **Graph & Relationship Integrity**:
   - Prevents self-referencing relationships (`sourceNodeId === targetNodeId`).
   - Prevents duplicate relationships between identical node pairs.
   - Deleting a node cleanly cascades to delete attached relationships in state.
4. **Cross-Domain Reference Integration**:
   - Attaching `appliedAssetRefs` and `appliedRuleRefs` to a Touchpoint surfaces in `findBackReferences()`.

### Browser Acceptance Test Checklist
- [ ] **Brand Expression**: Create, edit, and delete Touchpoint; set dimensions/materials; attach dieline asset from Visual Assets; attach contrast rule from Visual Rules; verify live label in Preview.
- [ ] **Brand Naming**: Create Naming System; add formula steps (`[Prefix] + [Descriptor]`); add approved/prohibited examples; verify formula badges in Preview.
- [ ] **Brand Architecture**: Create Master, Sub-brand, and Endorsed nodes; create directed relationships with coupling levels; verify graph integrity on deletion; verify topology cards in Preview.
- [ ] **Bilingual Switch**: Switch EN $\rightarrow$ ID $\rightarrow$ EN across all new screens; verify 0 raw translation keys.
- [ ] **Persistence**: Reload browser and confirm all Level 3 data, references, and IDs persist seamlessly.

---

## 8. Implementation Sequence & Acceptance Gates

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        PHASED EXECUTION GATES                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  GATE 3.1: Brand Expression Complete                                        │
│  • Touchpoint schema, editor, resolver, sample data, preview & smoke tests. │
│  • Requirement: `npx vitest run` & `npm run build` PASS.                    │
│                                                                             │
│  GATE 3.2: Brand Naming Complete                                            │
│  • NamingSystem schema, editor, formulas, resolver, sample data, preview.   │
│  • Requirement: `npx vitest run` & `npm run build` PASS.                    │
│                                                                             │
│  GATE 3.3: Brand Architecture Complete                                      │
│  • Node & Relationship schema, directed graph rules, editor, preview.       │
│  • Requirement: `npx vitest run` & `npm run build` PASS.                    │
│                                                                             │
│  FINAL GATE: Level 3 Freeze + Commit + Push                                 │
│  • Full acceptance checklist, zero regressions, clean working tree.         │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 9. Scope & Exclusions

### In Scope for Level 3
- `TouchpointEntity` and Brand Expression domain.
- `NamingSystemEntity` and Brand Naming module in Foundation.
- `BrandArchitectureNodeEntity` and `BrandRelationshipEntity` directed graph module under root Brand.
- Entity resolver, reference picker, bidirectional backreference tracking.
- Localization in English and Indonesian.
- Guideline Preview section rendering.
- Complete Northstar Coffee sample dataset population.
- Automated regression test suite (`src/phase3_smoke.test.ts`).

### Explicitly Out of Scope (Deferred to Level 4 / Future)
- Multi-brand workspace database partitioning / tenant switching.
- Dynamic Capability Activation preset selector UI.
- Motion easing tokens and animation engine.
- Sonic identity soundscape players / audio frequency tokens.
- Spatial 3D / architectural CAD token schemas.
- ZIP package / PDF production export engines.
- AI integration / external LLM compliance APIs.

---

### Status

**LEVEL 3 IMPLEMENTATION PLAN COMPLETE**  
Awaiting user authorization to proceed to **Phase 3.1 (Brand Expression)** execution.
