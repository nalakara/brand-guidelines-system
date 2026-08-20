# Brand Guidelines System — Level 3 Architecture Review (Revised)
## Brand System Capability Architecture

**Baseline**: Commit `ab3059f` (*feat: deepen visual knowledge architecture*)  
**Scope Context**: Architectural Review for Level 3 — Brand System  
**Mode**: Read-Only Architecture Review & Design Specification (Refined)  

---

## 1. Executive Summary & Objective

The Brand Guidelines System has established solid, verified foundations for:
- **Level 1 — Visual Identity**: Logos, Colors, Typography, Layout & Composition, Imagery & Photography, Graphic Language, Shared Asset Library, Semantic Visual Rules.
- **Level 2 — Brand Identity**: Strategy, Positioning, Personality, Voice & Tone, Messaging with discrete entity IDs, dynamic label resolution, and cross-domain references.

Our core architectural principle remains:
> **"Brand Knowledge is the source. UI, Preview, Export, and AI consumption are projections of that source."**  
> **"The system has a large capability universe, but every brand gets a tailored subset."**

The objective of **Level 3 — Brand System** is to transition the system from describing what a brand *is* to operationalizing **how an organization expresses, governs, and structures the brand across its ecosystem**.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CAPABILITY LEVEL EVOLUTION                        │
├──────────────────────────┬──────────────────────────────────────────────────┤
│ Level 1: Visual Identity │ "What are our visual assets, tokens, and rules?" │
│ Level 2: Brand Identity  │ "Who are we, what is our ethos, voice, & story?" │
│ Level 3: Brand System    │ "How do we express, govern, & structure brands?" │
│ Level 4: Brand Ecosystem │ "How does a multi-entity / sensory world scale?"  │
└──────────────────────────┴──────────────────────────────────────────────────┘
```

This revised document resolves the fundamental architectural questions regarding entity granularity, domain boundaries, relationship models, and brand record coexistence.

---

## 2. Deep Dive: Architectural Resolutions

### 2.1 Touchpoint vs. Application vs. Template

#### The Question:
Should `Touchpoint` and `Application` both be first-class entities? Where do templates, mockups, examples, and production files belong?

#### Architectural Resolution:
1. **Touchpoint is the SINGLE first-class entity (`TouchpointEntity`)**:
   - Applying the principle: *"Entity = meaningful reusable Brand Knowledge"*.
   - A **Touchpoint** is a distinct, recurring channel manifestation where the brand meets its audience (e.g., *Primary Business Card*, *Social Media Story Grid*, *Roastery Coffee Bag*, *Storefront Fascia*).
   - "Application" is not an independent entity. In real-world brand governance, an *application* is simply an instance, execution, or category context of a Touchpoint.
   - Therefore, `category` (`stationery`, `packaging`, `digitalProduct`, `signage`, etc.) and `contextChannel` (`Print`, `Mobile`, `Retail`) are **attributes of `TouchpointEntity`**, not separate entities.

2. **Templates, Mockups, Examples, and Production Files belong in `Visual Assets`**:
   - Do NOT create `TemplateEntity`, `ExampleEntity`, or `MockupEntity`.
   - The existing **Visual Assets** library (`VisualAssetItem`) is already a horizontal, multi-file binary asset repository supporting categories (`logo`, `colorPalette`, `typography`, `imagery`, `template`, `mockup`, `document`, `other`).
   - A `TouchpointEntity` connects to templates and production files purely via standard `appliedAssetRefs: EntityReference[]` (pointing to `domain: 'visualAssets', entityType: 'asset'`).
   - A `TouchpointEntity` connects to governing guidelines and constraints via `appliedRuleRefs: EntityReference[]` (pointing to `domain: 'visualRules', entityType: 'rule'`).

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       TOUCHPOINT ARCHITECTURAL TOPOLOGY                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                     [ TouchpointEntity: "Roastery Coffee Bag" ]             │
│                       ├── id: "tp-pkg-coffee-bag"                           │
│                       ├── category: "packaging"                             │
│                       ├── specifications: { dimensions: "12oz Pouch", ... } │
│                       └── guidelines: { doCopy: "...", dontCopy: "..." }    │
│                                │                     │                      │
│            ┌───────────────────┘                     └──────────────────┐   │
│            ▼ (appliedAssetRefs)                                         ▼   │
│   [ Visual Asset Library ]                               [ Visual Rules ]   │
│   ├── "12oz Pouch Dieline PDF" (asset-1)                 ├── "Packaging     │
│   └── "Retail Bag Mockup JPG"  (asset-2)                 │    Contrast Rule"│
│                                                          │    (rule-1)      │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 2.2 Naming System Granularity

#### The Question:
What is the minimum coherent model for Naming Systems? Should principles, patterns/formulas, rules, approved terms, and prohibited terms be separate entities or nested structures?

#### Architectural Resolution:
1. **`NamingSystemEntity` is the SINGLE first-class entity**:
   - Do NOT create `ApprovedTermEntity`, `ProductNameEntity`, `NamingRuleEntity`, or `NamingPatternEntity`.
   - An independent entity is only justified if it has an autonomous lifecycle and needs to be referenced independently across disparate parts of the guideline.
   - In brand governance, approved names, prohibited words, word formulas, and rationales exist strictly *within the context of a naming system/taxonomy* (e.g., *Roast Line Naming System*, *Sub-brand Naming Convention*).

2. **Structural Composition of `NamingSystemEntity`**:
   - **Formulas / Patterns**: Modeled as an ordered array of structured steps (`formula: NamingFormulaStep[]`) defining the semantic grammar (e.g., `[Prefix] + [Descriptor] + [Tier]`).
   - **Approved / Prohibited Examples**: Modeled as structured nested lists (`examples.approved: string[]`, `examples.prohibited: string[]`) with actionable brand rationale.
   - **General Terminology & Vocabulary**: The system *already* possesses `VocabularyEntity` in `VoiceToneModule` (prefer/avoid tags). Naming systems complement this by handling structural product/service taxonomies and generative formulas.
   - **Governance Rules**: Modeled as concise guideline strings or cross-linked via `EntityReference` to `Visual Rules` / `Semantic Rules`.

```typescript
export interface NamingFormulaStep {
  role: 'brandPrefix' | 'descriptor' | 'tierSuffix' | 'modifier' | 'arbitrary';
  label: LocalizedString; // e.g. "[Master Brand Name] + [Roast Profile] + 'Reserve'"
  required: boolean;
}

export interface NamingSystemEntity {
  id: string;                   // 'name-sys-1'
  title: LocalizedString;       // "Blend & Single Origin Naming Taxonomy"
  tier: 'flagship' | 'productTier' | 'feature' | 'internalCode';
  approach: 'descriptive' | 'invented' | 'metaphorical' | 'acronym' | 'arbitrary';
  formula: NamingFormulaStep[]; // Ordered formula blocks
  principles?: LocalizedString; // Guiding philosophy for this naming branch
  examples: {
    approved: string[];         // ["Northstar Solstice Roast", "Northstar Equinox Blend"]
    prohibited: string[];       // ["Northstar Luxury Java Blend"]
    rationale?: LocalizedString;// "Avoid 'Luxury' descriptor as it violates Unpretentious trait"
  };
  governingRuleRefs?: EntityReference[];
}
```

---

### 2.3 Brand Architecture: Node vs. Relationship Model

#### The Question:
Is a flat tree with `parentBrandId` sufficient? Or does real brand architecture require a first-class `Relationship` entity to support hybrid portfolios, co-branding, endorsements, and multi-parent structures?

#### Architectural Resolution:
1. **Real-world Brand Architecture is a Directed Graph, NOT a Pure Tree**:
   - Monolithic brands (Branded House) behave hierarchically.
   - Endorsed brands (e.g., *"Solstice by Northstar"*), ingredient brands (e.g., *"Powered by Northstar Cold Extraction"*), and co-branding partnerships (e.g., *"Northstar × Patagonia"*) involve multi-directional, peer-to-peer, or conditional coupling.

2. **The Minimum Coherent Model**:
   - **`BrandArchitectureNodeEntity` (First-Class Entity)**: Represents a distinct brand, sub-brand, division, or product line entity within the portfolio.
   - **`BrandRelationshipEntity` (First-Class Entity / Explicit Relationship Model)**: Represents the directional or mutual link between two nodes, carrying the specific governance, visual coupling, and endorsement rules.

```typescript
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
  id: string;                   // 'node-northstar-roastery'
  name: string;                 // "Northstar Roastery Lab"
  nodeType: BrandNodeType;
  description?: LocalizedString;
  targetMarketOrAudience?: LocalizedString;
  status: 'active' | 'incubating' | 'retired';
}

export interface BrandRelationshipEntity {
  id: string;                   // 'rel-1'
  sourceNodeId: string;         // 'node-northstar-master'
  targetNodeId: string;         // 'node-northstar-roastery'
  relationshipType: 'parentOf' | 'endorses' | 'subBrandOf' | 'ingredientIn' | 'partnerWith';
  coupling: CouplingLevel;
  endorsementRuleNotes?: LocalizedString; // "Parent logo must appear at 30% scale on reverse"
  governingRuleRefs?: EntityReference[];
  sharedAssetRefs?: EntityReference[];    // Approved co-brand lockup vector files
}

export interface BrandArchitectureModule {
  portfolioOverview?: LocalizedString;
  strategyType: 'brandedHouse' | 'houseOfBrands' | 'endorsed' | 'hybrid';
  nodes: BrandArchitectureNodeEntity[];
  relationships: BrandRelationshipEntity[];
}
```

---

### 2.4 Brand Record vs. Architecture Node

#### The Question:
What is the conceptual and operational relationship between the top-level `Brand` record in storage and a `BrandArchitectureNode`?

#### Architectural Resolution:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       BRAND RECORD vs. ARCHITECTURE NODE                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  [ ACTIVE BRAND RECORD ] (Storage Root / Guideline Workspace)               │
│    ID: "brand-northstar-coffee"                                             │
│    Name: "Northstar Coffee"                                                 │
│    Modules: { Overview, Strategy, VisualKnowledge, BrandArchitecture, ... } │
│                                                                             │
│    ├── Inside Modules.BrandArchitecture:                                    │
│    │     Nodes: [                                                           │
│    │       { id: "node-master", name: "Northstar Coffee", role: "master" }, │
│    │       { id: "node-roastery", name: "Northstar Roastery", role: "sub" } │
│    │     ]                                                                  │
│    │     Relationships: [                                                   │
│    │       { source: "node-master", target: "node-roastery", ... }           │
│    │     ]                                                                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Evaluation of Options:
- **Concept B is the source of truth for Level 3**:
  `BrandArchitectureNodeEntity` items are **structured Brand Knowledge entities describing the brand's portfolio within a single guideline workspace**.
- **Coexistence Model**:
  - The root `Brand` record represents the current active brand workspace.
  - The `BrandArchitectureNodeEntity` represents named entities within that brand's portfolio topology (sub-brands, product lines, divisions, venture arms).
  - The root brand itself is represented as the root node (`nodeType: 'corporateMaster'`) inside its own architecture graph.
- **Implications**:
  - **Identity**: `Brand.id` is the workspace document identity. `BrandArchitectureNodeEntity.id` is the entity identity in the resolver.
  - **Storage**: Nodes and Relationships live inside `brand.modules.brandArchitecture` without requiring multi-tenant database partitioning.
  - **Resolver Scope**: All nodes are indexable under `domain: 'brandArchitecture', entityType: 'brandArchitectureNode'`.
  - **Future Multi-Brand Compatibility (Level 4+)**: In the future, when workspace-level multi-brand switching is introduced, a `BrandArchitectureNodeEntity` can optionally link to an external `targetBrandRecordId` without altering its internal Level 3 entity schema.

---

### 2.5 Governance Model: Rules + References + Context

#### The Question:
Should Brand Governance be a separate top-level domain?

#### Architectural Resolution:
- **Governance does NOT become a standalone domain.**
- Creating a separate "Governance Domain" creates artificial silos and duplicates rule engines.
- Governance is already elegantly realized through our tripartite architecture:
  $$\text{Brand Governance} = \text{Visual/Semantic Rules} + \text{Entity References} + \text{Channel Context}$$
- Naming rules belong in `NamingSystemEntity` and `VoiceToneModule.vocabulary`.
- Visual and application constraints belong in `VisualRuleItem` linked to Touchpoints, Logos, Colors, and Architecture Nodes.
- Approval criteria and review notes are captured via `RuleType` (`requirement`, `restriction`, `preference`, `usage`) with channel/context tags.

---

### 2.6 Capability Activation & Level Presets (Conceptual Architecture)

#### The Question:
How will the system move from a monolithic module list to dynamic capability presets without introducing rigid boundaries?

#### Architectural Resolution (Conceptual Only — Deferred Implementation):
Level 1–4 are **configuration presets (starting templates)**, not hard-coded product limitations.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      CAPABILITY ACTIVATION CONCEPT                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  [ Capability Universe ] (Complete set of all system modules & entities)    │
│            │                                                                │
│            ▼                                                                │
│  [ Level Preset Selector ]                                                  │
│     ├── Level 1: Visual Identity                                            │
│     ├── Level 2: Brand Identity                                             │
│     ├── Level 3: Brand System                                               │
│     └── Level 4: Brand Ecosystem                                            │
│            │                                                                │
│            ▼ (Sets default active modules & sub-capabilities)               │
│  [ Brand.activeModules: Set<ModuleId> ]                                     │
│            │                                                                │
│            ▼ (User can toggle individual modules on/off)                    │
│  [ Tailored Brand Workspace UI & Preview Projection ]                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```
- **Level 1 Preset**: Activates `overview`, `visualKnowledge`, `visualAssets`, `visualRules`.
- **Level 2 Preset**: Activates Level 1 + `strategy`, `positioning`, `personality`, `voiceTone`, `messaging`.
- **Level 3 Preset**: Activates Level 2 + `brandExpression`, `brandNaming`, `brandArchitecture`.
- *Execution Constraint*: Capability activation UI is deferred from immediate Level 3 scope; all modules remain dynamically toggleable via `Brand.activeModules`.

---

## 3. Revised Level 3 Domain Map

The minimum coherent architecture for Level 3:

```
BRAND
 ├── Brand Overview & Core Metadata
 └── Brand Architecture (NEW MODULE: Nodes & Explicit Relationships)

FOUNDATION
 ├── Strategy (Values, Priorities)
 ├── Positioning (Audiences, Differentiators)
 ├── Personality (Traits, Dimensions, We Are / We Are Not)
 ├── Voice & Tone (Principles, Vocabulary, Examples)
 ├── Messaging (Pillars, Proof Points, CTAs)
 └── Brand Naming (NEW MODULE: Naming Systems, Formulas, Taxonomies)

VISUAL IDENTITY
 ├── Visual Knowledge (Logos, Colors, Fonts, Layout, Imagery, Graphic Language)
 ├── Visual Assets (Shared Horizontal Asset Library — Files, Mocks, Dielines)
 └── Visual Rules (Semantic Rule Governance & Boundaries)

BRAND EXPRESSION (NEW DOMAIN)
 └── Touchpoints & Applications (Single Entity: Stationery, Packaging, Digital, Signage)
```

---

## 4. Entity Reference Model & Resolver Schema for Level 3

```typescript
// Extended EntityDomain
export type EntityDomain =
  | 'foundation'
  | 'visualKnowledge'
  | 'visualAssets'
  | 'visualRules'
  | 'brandExpression'     // NEW Level 3 Domain
  | 'brandArchitecture';  // NEW Level 3 Domain

// Extended EntityType
export type EntityType =
  // Existing Foundation & Visual Knowledge types...
  | 'strategyValue'
  | 'strategicPriority'
  | 'targetAudience'
  | 'differentiator'
  | 'personalityTrait'
  | 'voicePrinciple'
  | 'vocabularyTerm'
  | 'writingExample'
  | 'keyMessage'
  | 'proofPoint'
  | 'callToAction'
  | 'logo'
  | 'color'
  | 'font'
  | 'typeStyle'
  | 'gridSystem'
  | 'layoutPrinciple'
  | 'imageryDirection'
  | 'imageTreatment'
  | 'graphicElement'
  | 'illustrationStyle'
  | 'iconSystem'
  | 'asset'
  | 'rule'
  // Level 3 Entity Types (Strictly Minimal Set)
  | 'touchpoint'
  | 'namingSystem'
  | 'brandArchitectureNode'
  | 'brandRelationship';
```

---

## 5. Final Recommendations

### 5.1 Confirmed Architectural Decisions
1. **Touchpoint is the ONLY first-class entity in Brand Expression**: Applications are categories/contexts; mockups and templates live in horizontal `Visual Assets`.
2. **NamingSystem is the ONLY first-class entity in Naming**: Formulas, examples, and rationales are structured nested data.
3. **Brand Architecture uses a Node + Relationship Graph Model**: Accommodates hybrid portfolios, co-branding, and endorsements cleanly.
4. **Architecture Nodes represent portfolio entities within a guideline workspace**: Distinct from document `Brand.id`, avoiding premature multi-tenant database partitioning while remaining future-proof.
5. **Governance is realized via Rules + References + Context**: No redundant "Governance" domain.
6. **Zero Source Code Changes in this Phase**: Complete architectural alignment before any implementation begins.

### 5.2 Still Open (To be aligned before Implementation Plan)
1. **Module Registry Grouping**: Confirm whether `Brand Architecture` lives under a root `Brand Portfolio` navigation group or under `Foundation`.
2. **Touchpoint Specification Custom Fields**: Determine if `TouchpointSpecification` needs a dynamic key-value list for unusual production media (e.g. embroidery stitch count, neon tube diameter).

### 5.3 Recommended Implementation Sequence (Future)
When authorized to proceed to implementation planning:
1. **Phase 3.1 — Brand Expression (`Touchpoints & Applications`)**: Schema, `TouchpointEntity` editor, `Visual Assets` / `Visual Rules` reference integration, preview rendering.
2. **Phase 3.2 — Brand Naming System (`Foundation`)**: Schema, `NamingSystemEntity` editor with visual formula builder and approved/prohibited badge lists, preview rendering.
3. **Phase 3.3 — Brand Architecture (`Portfolio Topology`)**: Schema, `BrandArchitectureNode` and `BrandRelationship` editors, topology preview, and full regression verification.

---

### Status

**REVISED LEVEL 3 ARCHITECTURE REVIEW COMPLETE**  
Ready for final stakeholder confirmation.
