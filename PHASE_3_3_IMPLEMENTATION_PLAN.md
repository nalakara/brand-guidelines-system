# Phase 3.3 Implementation Plan — Brand Architecture

**Baseline Commit**: `fa590d4` (Phase 3.2 Frozen Baseline)  
**Document Status**: IMPLEMENTATION PLAN ONLY — READ-ONLY  
**Authoritative Architectural Baselines**:
- `LEVEL_3_ARCHITECTURE_REVIEW.md`
- `LEVEL_3_IMPLEMENTATION_PLAN.md`
- `PHASE_3_3_ARCHITECTURE_READINESS.md`

---

## 1. Executive Overview & Core Philosophy

### 1.1 Objective
Implement **Phase 3.3 — Brand Architecture** as the final milestone of **Level 3 (Brand System)**. 

Brand Architecture introduces a domain-specific directed topology graph (`Nodes + Relationships`) governing the brand's portfolio structure, sub-brands, endorsement models, and visual coupling tiers.

### 1.2 Core Architectural Principles
1. **Brand Knowledge is the Source**: The graph lives inside `brand.modules.brandArchitecture`. UI editors, guideline preview, export generators, and AI consumption are projections of this underlying entity knowledge.
2. **Entity = Reusable Brand Knowledge**:
   - `BrandArchitectureNodeEntity` is a first-class entity with persistent identity and lifecycle.
   - `BrandRelationshipEntity` represents typed directed topology between nodes and carries governance rules.
3. **Everything is Available, Nothing is Mandatory**: Brand Architecture is an optional capability. When inactive, existing Level 1, 2, 3.1, and 3.2 brands function with zero disruption.
4. **Zero Knowledge Fabrication**: Normalizing legacy brands without architecture data will initialize empty collections or undefined state. Zero synthetic nodes, sub-brands, or relationships will ever be fabricated.
5. **No Generic Graph Engine / No Canvas Bloat**: Avoid generic graph databases or infinite D3 canvas editors. Implement a structured card-based and tree-based projection that directly serves brand strategists and designers.

---

## 2. Proposed Data Schema & TypeScript Types (`src/types/brand.ts`)

```typescript
// Extended ModuleId
export type ModuleId =
  | 'overview'
  | 'strategy'
  | 'positioning'
  | 'personality'
  | 'voiceTone'
  | 'messaging'
  | 'brandNaming'
  | 'brandArchitecture' // NEW in Phase 3.3
  | 'visualBasics'
  | 'visualKnowledge'
  | 'visualAssets'
  | 'visualRules'
  | 'brandExpression';

// Extended EntityDomain
export type EntityDomain =
  | 'foundation'
  | 'visualKnowledge'
  | 'visualAssets'
  | 'visualRules'
  | 'brandExpression'
  | 'brandArchitecture'; // NEW in Phase 3.3

// Extended EntityType
export type EntityType =
  // Foundation Entities
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
  | 'namingSystem'
  // Brand Architecture Entities
  | 'brandArchitectureNode' // First-class reusable entity
  // Note: BrandRelationshipEntity is internal structural topology, NOT a generic EntityReference target
  // Visual Knowledge Entities
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
  // Visual Assets & Rules
  | 'asset'
  | 'rule'
  // Brand Expression Entities
  | 'touchpoint';

// --- Brand Architecture Entities (Phase 3.3) ---

export type BrandArchitectureStrategyType =
  | 'brandedHouse'      // Monolithic masterbrand (e.g., Virgin, FedEx)
  | 'houseOfBrands'     // Standalone independent brands (e.g., P&G, Unilever)
  | 'endorsed'          // Endorsement model (e.g., Marriott, Nestlé)
  | 'hybrid';           // Combination portfolio (e.g., Alphabet, Northstar)

export type BrandNodeType =
  | 'corporateMaster'   // Parent holding / master corporate brand
  | 'subBrand'          // Dependent sub-brand sharing master equity
  | 'endorsedBrand'     // Distinct brand with parent endorsement
  | 'productBrand'      // Autonomous freestanding product brand
  | 'ingredientBrand'   // Ingredient / proprietary technology brand
  | 'partnerBrand';     // External co-branding entity

export type CouplingLevel =
  | 'monolithic'        // 100% shared visual identity (lockup only)
  | 'endorsed'          // Unique mark + mandatory endorsement lockup
  | 'freestanding'      // Completely independent mark & palette
  | 'coBranded';        // Dual-branding lockup with strict clearance ratios

export interface BrandArchitectureNodeEntity {
  id: string;                   // 'node-master', 'node-roastery'
  name: LocalizedString;        // "Northstar Roastery Lab"
  nodeType: BrandNodeType;
  status: 'active' | 'incubating' | 'retired';
  description?: LocalizedString;
  targetMarketOrAudience?: LocalizedString;
  governingRuleRefs?: EntityReference[];
  targetAudienceRefs?: EntityReference[];
}

export interface BrandRelationshipEntity {
  id: string;                   // 'rel-1'
  sourceNodeId: string;         // 'node-master'
  targetNodeId: string;         // 'node-roastery'
  relationshipType:
    | 'parentOf'
    | 'endorses'
    | 'subBrandOf'
    | 'ingredientIn'
    | 'partnerWith';
  coupling: CouplingLevel;
  endorsementRuleNotes?: LocalizedString; // "Parent logo must appear at 30% scale on reverse"
  governingRuleRefs?: EntityReference[];  // Governing Visual Rules
  sharedAssetRefs?: EntityReference[];    // Co-brand lockups in Visual Assets
}

export interface BrandArchitectureModule {
  strategyOverview?: LocalizedString;
  strategyType: BrandArchitectureStrategyType;
  nodes: BrandArchitectureNodeEntity[];
  relationships: BrandRelationshipEntity[];
}

// Updated BrandModulesData
export interface BrandModulesData {
  overview?: BrandOverviewModule;
  strategy?: BrandStrategyModule;
  positioning?: PositioningModule;
  personality?: PersonalityModule;
  voiceTone?: VoiceToneModule;
  messaging?: MessagingModule;
  brandNaming?: BrandNamingModule;
  brandArchitecture?: BrandArchitectureModule; // NEW in Phase 3.3
  visualBasics?: VisualBasicsModule;
  visualKnowledge?: VisualBasicsModule;
  visualAssets?: VisualAssetItem[];
  visualRules?: VisualRuleItem[];
  brandExpression?: BrandExpressionModule;
}
```

---

## 3. Step-by-Step Implementation Steps

### Step 1: Schema & Type Definitions (`src/types/brand.ts`)
- Add `'brandArchitecture'` to `ModuleId` and `EntityDomain`.
- Add `'brandArchitectureNode'` to `EntityType` (reusable Brand Knowledge entity).
- Note: `BrandRelationshipEntity` represents structural topology between nodes and carries references, but is NOT added to `EntityType`.
- Define `BrandArchitectureStrategyType`, `BrandNodeType`, `CouplingLevel`, `BrandArchitectureNodeEntity`, `BrandRelationshipEntity`, and `BrandArchitectureModule`.
- Add `brandArchitecture?: BrandArchitectureModule` to `BrandModulesData`.

### Step 2: Idempotent Migration & Normalization (`src/utils/migration.ts`)
- Implement non-destructive normalizer for `brand.modules.brandArchitecture`:
  ```typescript
  if (modules.brandArchitecture || brand.activeModules?.includes('brandArchitecture')) {
    const rawArch: any = modules.brandArchitecture || {};
    const nodes: BrandArchitectureNodeEntity[] = Array.isArray(rawArch.nodes)
      ? rawArch.nodes.map((n: any, idx: number) => ({
          id: n.id || `node-${idx + 1}`,
          name: typeof n.name === 'object' ? n.name : { en: n.name || 'Node', id: n.name || 'Node' },
          nodeType: n.nodeType || 'subBrand',
          status: n.status || 'active',
          description: n.description || { en: '', id: '' },
          targetMarketOrAudience: n.targetMarketOrAudience || { en: '', id: '' },
          governingRuleRefs: Array.isArray(n.governingRuleRefs) ? n.governingRuleRefs : [],
          targetAudienceRefs: Array.isArray(n.targetAudienceRefs) ? n.targetAudienceRefs : []
        }))
      : [];

    const relationships: BrandRelationshipEntity[] = Array.isArray(rawArch.relationships)
      ? rawArch.relationships.map((rel: any, idx: number) => ({
          id: rel.id || `rel-${idx + 1}`,
          sourceNodeId: rel.sourceNodeId || '',
          targetNodeId: rel.targetNodeId || '',
          relationshipType: rel.relationshipType || 'parentOf',
          coupling: rel.coupling || 'monolithic',
          endorsementRuleNotes: rel.endorsementRuleNotes || { en: '', id: '' },
          governingRuleRefs: Array.isArray(rel.governingRuleRefs) ? rel.governingRuleRefs : [],
          sharedAssetRefs: Array.isArray(rel.sharedAssetRefs) ? rel.sharedAssetRefs : []
        }))
      : [];

    modules.brandArchitecture = {
      strategyOverview: rawArch.strategyOverview || { en: '', id: '' },
      strategyType: rawArch.strategyType || 'hybrid',
      nodes,
      relationships
    };
  }
  ```
- Guarantee: If `brandArchitecture` is not active, `modules.brandArchitecture` remains undefined. Zero fabricated nodes.

### Step 3: Entity Resolver & Backreference Discovery (`src/utils/entityResolver.ts`)
- In `getAvailableEntities()`:
  - Index `nodes` under `domain: 'brandArchitecture', entityType: 'brandArchitectureNode'`.
  - Provide human-readable localized label and node role.
- In `resolveEntityLabel()`:
  - Match `brandArchitectureNode` and return localized name with fallback.
- In `findBackReferences()`:
  - Check `node.governingRuleRefs` and `node.targetAudienceRefs`.
  - Check `relationship.governingRuleRefs` and `relationship.sharedAssetRefs`.
  - Surface incoming links from Brand Architecture back to Visual Rules, Target Audiences, and Visual Assets.

### Step 4: Semantic ReferencePicker Restrictions (`src/components/ui/ReferencePicker.tsx`)
- Add `'brandArchitecture'` to `DOMAIN_TABS`.
- Ensure semantic filters correctly restrict targets:
  - Node governing rules $\rightarrow$ `allowedEntityTypes: ['rule']`.
  - Node audiences $\rightarrow$ `allowedEntityTypes: ['targetAudience']`.
  - Relationship governing rules $\rightarrow$ `allowedEntityTypes: ['rule']`.
  - Relationship co-branding assets $\rightarrow$ `allowedEntityTypes: ['asset']`.

### Step 5: Module Registry & Sidebar Navigation (`src/modules/registry.ts`, `src/components/Sidebar.tsx`)
- In `registry.ts`:
  - Add `brandArchitecture` to `MODULE_GROUPS` under `domainFoundation` (or dedicated group).
  - Add `brandArchitecture` module definition with completion calculation:
    - Empty when nodes count === 0.
    - Complete when nodes count >= 2 and relationships count >= 1.
    - Started otherwise.
- In `Sidebar.tsx`:
  - Import and register `Network` or `GitFork` icon for `brandArchitecture`.

### Step 6: BrandArchitectureEditor Component (`src/components/editors/BrandArchitectureEditor.tsx`)
- **Strategy & Overview Block**:
  - Strategy selector (`brandedHouse`, `houseOfBrands`, `endorsed`, `hybrid`).
  - Localized strategy overview text area.
- **Node Management Section**:
  - Add / edit / delete nodes (`id`, `name`, `nodeType`, `status`, `description`).
  - Semantic `ReferencePicker` attachments for target audiences and governing rules.
- **Relationship Management Section**:
  - Add / edit / delete relationships.
  - Source node $\rightarrow$ Target node dropdowns (filtered to defined nodes).
  - Relationship type selector (`parentOf`, `endorses`, `subBrandOf`, `ingredientIn`, `partnerWith`).
  - Coupling level selector (`monolithic`, `endorsed`, `freestanding`, `coBranded`).
  - Endorsement rule notes text area.
  - Semantic `ReferencePicker` attachments for co-branding lockup Assets and governing Visual Rules.

### Step 7: Modular Preview Section (`src/components/preview/sections/PreviewArchitecture.tsx` & `GuidelinePreview.tsx`)
- Create `src/components/preview/sections/PreviewArchitecture.tsx`:
  - Strategy badge and philosophy overview.
  - Structured portfolio node cards with node type badges and status indicators.
  - Relationship topology flow / matrix displaying connected nodes, coupling level badges, endorsement rules, and resolved backlinks.
- Integrate `PreviewArchitecture` into `GuidelinePreview.tsx` as a modular section.
- Wire `BrandArchitectureEditor` into `src/App.tsx`.

### Step 8: Northstar Coffee Sample Brand Data (`src/data/sampleBrand.ts`)
- Add `'brandArchitecture'` to `sampleBrand.activeModules`.
- Populate realistic Northstar Coffee portfolio architecture:
  - **Strategy Type**: `hybrid` ("Northstar operates primarily as a Branded House for retail cafe experiences, utilizing an Endorsed Model for specialized roasting laboratories and Ready-to-Drink consumer products.")
  - **Nodes**:
    1. `node-master`: Northstar Coffee (`corporateMaster`, Active) — Parent brand.
    2. `node-roastery`: Northstar Roastery Lab (`subBrand`, Active) — Specialty micro-lot roastery.
    3. `node-rtd`: Northstar Daily Rituals RTD (`endorsedBrand`, Active) — Ready-to-drink canned beverage line.
    4. `node-foundation`: Northstar Direct Trade Fund (`endorsedBrand`, Active) — Non-profit farm partnership initiative.
  - **Relationships**:
    1. `rel-1`: `node-master` $\rightarrow$ `node-roastery` (`subBrandOf`, `monolithic`, references Clearspace Rule `vr-1`).
    2. `rel-2`: `node-master` $\rightarrow$ `node-rtd` (`endorses`, `endorsed`, notes: "Northstar wordmark must appear on back seal at 30% scale", references Asset `asset-1`).
    3. `rel-3`: `node-master` $\rightarrow$ `node-foundation` (`endorses`, `endorsed`, references Proof Point `pp-1`).

### Step 9: Bilingual Dictionaries (`src/i18n/translations.ts`)
- Add complete English and Indonesian translations for:
  - Domain/Module titles: `domainBrandArchitecture`, `moduleBrandArchitecture`.
  - Strategy types: `strategyBrandedHouse`, `strategyHouseOfBrands`, `strategyEndorsed`, `strategyHybrid`.
  - Node types: `nodeTypeCorporateMaster`, `nodeTypeSubBrand`, `nodeTypeEndorsedBrand`, `nodeTypeProductBrand`, `nodeTypeIngredientBrand`, `nodeTypePartnerBrand`.
  - Coupling levels: `couplingMonolithic`, `couplingEndorsed`, `couplingFreestanding`, `couplingCoBranded`.
  - Relationship types: `relTypeParentOf`, `relTypeEndorses`, `relTypeSubBrandOf`, `relTypeIngredientIn`, `relTypePartnerWith`.
  - Node statuses: `statusActive`, `statusIncubating`, `statusRetired`.
  - Field labels, placeholders, empty states, and modal titles.

### Step 10: Automated Regression & Smoke Tests (`src/phase3_3_smoke.test.ts`)
- Test 1: Normalization of legacy brands without architecture data (zero knowledge fabrication, idempotent).
- Test 2: Indexing of `brandArchitectureNode` entities in `getAvailableEntities()`.
- Test 3: Resolving live localized labels for architecture nodes in EN and ID.
- Test 4: Backreference discovery from relationships and nodes to Visual Rules, Audiences, and Assets.
- Test 5: Graph integrity: Node IDs, relationship source/target linkage, coupling levels, and endorsement notes survive roundtrip normalization.

---

## 4. Verification Plan

### Automated Verification
```bash
# 1. Run full Vitest suite (must pass all tests across Phase 2, 2.5, 3.1, 3.2, and 3.3)
npx vitest run

# 2. Production build verification (TypeScript strict check + Vite bundle)
npm run build
```

### Manual Browser Acceptance Checklist
1. **Navigation**: Brand Architecture appears in Sidebar under Foundation with proper icon.
2. **Node CRUD**: Add, edit, and delete nodes; verify ID stability and status badges.
3. **Relationship Topology**: Pair source and target nodes with specific relationship types and coupling tiers.
4. **Semantic ReferencePicker**: Attach governing Visual Rules and co-branding Assets; verify unrelated primitives are filtered out.
5. **Live Label Dynamic Sync**: Renaming a node or referenced Rule updates live labels across English and Indonesian.
6. **Persistence**: Browser refresh preserves nodes, relationships, and references without data loss.
7. **Preview Projection**: `GuidelinePreview` renders clean visual node cards and relationship topology flows.
8. **Bilingual Parity**: EN $\leftrightarrow$ ID toggle has 0 missing or raw translation keys.
9. **Regression Check**: Level 1, 2, 3.1 (Touchpoints), and 3.2 (Naming) continue functioning flawlessly.

---

## 5. Scope & Boundary Enforcement

| Explicitly IN Scope for Phase 3.3 | Explicitly OUT OF SCOPE |
|---|---|
| `BrandArchitectureNodeEntity` | Multi-tenant workspace database partitions |
| `BrandRelationshipEntity` | Generic infinite graph database engine |
| Strategy Type classification (`brandedHouse`, `endorsed`, etc.) | D3 drag-and-drop canvas designer |
| Coupling level taxonomy (`monolithic`, `endorsed`, etc.) | Legal corporate formation tracking |
| Semantic references to Visual Rules & Assets | AI portfolio generation |
| Resolver indexing & reverse backreferences | Level 4 multi-brand cross-workspace synchronization |
| Modular `PreviewArchitecture` projection | Full capability preset builder UI |

---

# **END OF PHASE 3.3 IMPLEMENTATION PLAN**
*Ready for user review and approval before execution.*
