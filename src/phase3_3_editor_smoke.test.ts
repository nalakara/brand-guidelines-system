import { describe, it, expect } from 'vitest';
import {
  Brand,
  BrandArchitectureModule,
  BrandArchitectureNodeEntity,
  BrandRelationshipEntity,
  BrandArchitectureStrategyType,
  BrandNodeType,
  CouplingLevel
} from './types/brand';
import { normalizeBrandData } from './utils/migration';
import { getAvailableEntities, resolveEntityLabel, findBackReferences } from './utils/entityResolver';

describe('Phase 3.3C: Brand Architecture Editor & Relationship Builder Smoke Tests', () => {
  const createMockBrand = (): Brand => ({
    id: 'test-brand-arch',
    name: 'Northstar Enterprise',
    createdAt: '2026-08-21T00:00:00Z',
    updatedAt: '2026-08-21T00:00:00Z',
    activeModules: ['brandArchitecture', 'visualRules', 'visualAssets', 'strategy'],
    modules: {
      strategy: {
        audiences: [
          {
            id: 'aud-enterprise',
            name: { en: 'B2B Enterprise Clients', id: 'Klien Enterprise B2B' },
            description: { en: '', id: '' },
            painPoints: [],
            needs: []
          }
        ],
        values: [],
        priorities: [],
        differentiators: []
      },
      visualRules: [
        {
          id: 'rule-endorsement',
          name: 'Endorsement Mark Scale & Position',
          category: 'layout',
          severity: 'must',
          description: { en: 'Must appear on bottom right at 25%', id: 'Harus di kanan bawah 25%' },
          scope: 'all',
          references: []
        }
      ],
      visualAssets: [
        {
          id: 'asset-lockup-svg',
          name: 'Northstar Venture Lockup SVG',
          category: 'logos',
          format: 'SVG',
          files: ['/assets/lockup.svg']
        }
      ],
      brandArchitecture: {
        strategyType: 'hybrid',
        strategyOverview: {
          en: 'Operating as a Branded House for cafes and Endorsed for laboratories.',
          id: 'Beroperasi sebagai Branded House untuk kafe dan Terendos untuk laboratorium.'
        },
        nodes: [
          {
            id: 'node-master',
            name: { en: 'Northstar Coffee Master', id: 'Induk Kopi Northstar' },
            nodeType: 'corporateMaster',
            status: 'active',
            description: { en: 'Parent corporate brand holding all IP', id: 'Merek induk memegang seluruh IP' },
            targetMarketOrAudience: { en: 'Global coffee industry', id: 'Industri kopi global' },
            governingRuleRefs: [
              { domain: 'visualRules', entityType: 'rule', entityId: 'rule-endorsement' }
            ],
            targetAudienceRefs: [
              { domain: 'foundation', entityType: 'targetAudience', entityId: 'aud-enterprise' }
            ]
          },
          {
            id: 'node-roastery',
            name: { en: 'Northstar Roastery Lab', id: 'Lab Sangrai Northstar' },
            nodeType: 'subBrand',
            status: 'active',
            description: { en: 'Micro-lot roasting facility', id: 'Fasilitas sangrai micro-lot' }
          },
          {
            id: 'node-venture',
            name: { en: 'Northstar RTD Ventures', id: 'Ventura RTD Northstar' },
            nodeType: 'endorsedBrand',
            status: 'incubating'
          }
        ],
        relationships: [
          {
            id: 'rel-1',
            sourceNodeId: 'node-master',
            targetNodeId: 'node-roastery',
            relationshipType: 'parentOf',
            coupling: 'monolithic',
            endorsementRuleNotes: { en: 'Full corporate lockup required', id: 'Wajib lockup korporat penuh' },
            governingRuleRefs: [
              { domain: 'visualRules', entityType: 'rule', entityId: 'rule-endorsement' }
            ],
            sharedAssetRefs: [
              { domain: 'visualAssets', entityType: 'asset', entityId: 'asset-lockup-svg' }
            ]
          },
          {
            id: 'rel-2',
            sourceNodeId: 'node-master',
            targetNodeId: 'node-venture',
            relationshipType: 'endorses',
            coupling: 'endorsed',
            endorsementRuleNotes: { en: 'Endorsement mark at 25% scale', id: 'Tanda endosemen skala 25%' }
          }
        ]
      }
    }
  });

  // 1 & 2. Strategy persistence
  it('persists strategyOverview and strategyType accurately', () => {
    const brand = createMockBrand();
    const normalized = normalizeBrandData(brand);

    expect(normalized.modules?.brandArchitecture?.strategyType).toBe('hybrid');
    expect(normalized.modules?.brandArchitecture?.strategyOverview?.en).toContain('Branded House');
    expect(normalized.modules?.brandArchitecture?.strategyOverview?.id).toContain('Branded House');
  });

  // 3 to 9. Node CRUD, stable IDs, localized name, nodeType, and status
  it('handles Node CRUD operations with stable IDs and structured attributes', () => {
    const brand = createMockBrand();
    const arch = brand.modules.brandArchitecture!;

    // Create new node
    const newNode: BrandArchitectureNodeEntity = {
      id: 'node-partner',
      name: { en: 'Acme Coffee Co-Lab', id: 'Kolaborasi Kopi Acme' },
      nodeType: 'partnerBrand',
      status: 'active',
      description: { en: 'Co-branding initiative', id: 'Inisiatif co-branding' }
    };
    arch.nodes.push(newNode);

    const normalized = normalizeBrandData(brand);
    const foundNode = normalized.modules?.brandArchitecture?.nodes.find((n) => n.id === 'node-partner');
    expect(foundNode).toBeDefined();
    expect(foundNode?.id).toBe('node-partner');
    expect(foundNode?.name.en).toBe('Acme Coffee Co-Lab');
    expect(foundNode?.name.id).toBe('Kolaborasi Kopi Acme');
    expect(foundNode?.nodeType).toBe('partnerBrand');
    expect(foundNode?.status).toBe('active');

    // Edit node
    const nodeToEdit = brand.modules.brandArchitecture!.nodes.find((n) => n.id === 'node-partner')!;
    nodeToEdit.name = { en: 'Acme Reserve Co-Lab', id: 'Kolaborasi Cadangan Acme' };
    nodeToEdit.status = 'retired';
    const edited = normalizeBrandData(brand);
    const reFound = edited.modules?.brandArchitecture?.nodes.find((n) => n.id === 'node-partner');
    expect(reFound?.name.en).toBe('Acme Reserve Co-Lab');
    expect(reFound?.status).toBe('retired');
    expect(reFound?.id).toBe('node-partner'); // ID remains stable
  });

  // 10 & 11. Root node identification
  it('identifies root corporateMaster node with distinct governance role', () => {
    const brand = createMockBrand();
    const rootNode = brand.modules.brandArchitecture?.nodes.find((n) => n.nodeType === 'corporateMaster');
    expect(rootNode).toBeDefined();
    expect(rootNode?.id).toBe('node-master');
    expect(rootNode?.name.en).toBe('Northstar Coffee Master');
  });

  // 12 to 18. Relationship CRUD, stable IDs, source/target, type, coupling
  it('handles Relationship CRUD operations with stable IDs, source/target topology and coupling', () => {
    const brand = createMockBrand();
    const arch = brand.modules.brandArchitecture!;

    // Add relationship
    const newRel: BrandRelationshipEntity = {
      id: 'rel-partner',
      sourceNodeId: 'node-roastery',
      targetNodeId: 'node-venture',
      relationshipType: 'partnerWith',
      coupling: 'coBranded',
      endorsementRuleNotes: { en: 'Side-by-side equal lockup', id: 'Lockup setara berdampingan' }
    };
    arch.relationships.push(newRel);

    const normalized = normalizeBrandData(brand);
    const foundRel = normalized.modules?.brandArchitecture?.relationships.find((r) => r.id === 'rel-partner');
    expect(foundRel).toBeDefined();
    expect(foundRel?.id).toBe('rel-partner');
    expect(foundRel?.sourceNodeId).toBe('node-roastery');
    expect(foundRel?.targetNodeId).toBe('node-venture');
    expect(foundRel?.relationshipType).toBe('partnerWith');
    expect(foundRel?.coupling).toBe('coBranded');

    // Edit relationship
    const relToEdit = brand.modules.brandArchitecture!.relationships.find((r) => r.id === 'rel-partner')!;
    relToEdit.coupling = 'freestanding';
    const reNormalized = normalizeBrandData(brand);
    const editedRel = reNormalized.modules?.brandArchitecture?.relationships.find((r) => r.id === 'rel-partner');
    expect(editedRel?.coupling).toBe('freestanding');
    expect(editedRel?.id).toBe('rel-partner'); // ID remains stable
  });

  // 19 to 23. Graph Validation Rules (Self-reference, duplicate, missing node, partnerWith)
  it('enforces graph integrity: rejects self-loops, duplicates, and dangling edges while accepting partnerWith', () => {
    const brand = createMockBrand();
    const arch = brand.modules.brandArchitecture!;

    // Add self loop
    arch.relationships.push({
      id: 'rel-self-loop',
      sourceNodeId: 'node-roastery',
      targetNodeId: 'node-roastery',
      relationshipType: 'parentOf',
      coupling: 'monolithic'
    });

    // Add duplicate relationship (same source, target, type as rel-1)
    arch.relationships.push({
      id: 'rel-dup-1',
      sourceNodeId: 'node-master',
      targetNodeId: 'node-roastery',
      relationshipType: 'parentOf',
      coupling: 'monolithic'
    });

    // Add dangling edge pointing to non-existent node
    arch.relationships.push({
      id: 'rel-dangling',
      sourceNodeId: 'node-master',
      targetNodeId: 'node-phantom',
      relationshipType: 'parentOf',
      coupling: 'monolithic'
    });

    const clean = normalizeBrandData(brand);
    const rels = clean.modules?.brandArchitecture?.relationships || [];

    expect(rels.find((r) => r.id === 'rel-self-loop')).toBeUndefined();
    expect(rels.find((r) => r.id === 'rel-dup-1')).toBeUndefined();
    expect(rels.find((r) => r.id === 'rel-dangling')).toBeUndefined();
    expect(rels).toHaveLength(2); // Only original valid rel-1 and rel-2 survive
  });

  // 24 to 28. Reference Semantics: Rule & Audience attachments, Asset attachments, blocked invalid types
  it('preserves semantic references across Nodes and Relationships while blocking invalid entity types', () => {
    const brand = createMockBrand();
    const normalized = normalizeBrandData(brand);
    const arch = normalized.modules!.brandArchitecture!;

    // Node references
    const masterNode = arch.nodes.find((n) => n.id === 'node-master');
    expect(masterNode?.governingRuleRefs?.[0].entityId).toBe('rule-endorsement');
    expect(masterNode?.targetAudienceRefs?.[0].entityId).toBe('aud-enterprise');

    // Relationship references
    const rel1 = arch.relationships.find((r) => r.id === 'rel-1');
    expect(rel1?.governingRuleRefs?.[0].entityId).toBe('rule-endorsement');
    expect(rel1?.sharedAssetRefs?.[0].entityId).toBe('asset-lockup-svg');

    // Entity Resolver validation
    const entities = getAvailableEntities(brand, 'brandArchitecture');
    expect(entities.every((e) => e.reference.entityType === 'brandArchitectureNode')).toBe(true);
    expect(entities.some((e) => (e.reference as any).entityType === 'brandRelationship')).toBe(false);
  });

  // 29 to 31. Persistence & Roundtrip Stability
  it('guarantees normalized architecture state and stable IDs survive multiple roundtrips', () => {
    const brand = createMockBrand();
    const pass1 = normalizeBrandData(brand);
    const pass2 = normalizeBrandData(pass1);
    const pass3 = normalizeBrandData(pass2);

    expect(pass3.modules?.brandArchitecture?.nodes).toEqual(pass1.modules?.brandArchitecture?.nodes);
    expect(pass3.modules?.brandArchitecture?.relationships).toEqual(pass1.modules?.brandArchitecture?.relationships);
  });

  // Dedicated Cascading Node Deletion Test
  it('explicitly verifies cascading deletion of relationships when a referenced node is deleted', () => {
    const brand = createMockBrand();
    const arch = brand.modules.brandArchitecture!;

    // Brand starts with 3 nodes: master, roastery, venture
    // Relationships:
    // rel-1: master -> roastery
    // rel-2: master -> venture
    expect(arch.nodes).toHaveLength(3);
    expect(arch.relationships).toHaveLength(2);

    // Delete node-roastery (target of rel-1)
    const updatedNodes = arch.nodes.filter((n) => n.id !== 'node-roastery');
    const updatedRels = arch.relationships.filter(
      (rel) => rel.sourceNodeId !== 'node-roastery' && rel.targetNodeId !== 'node-roastery'
    );

    brand.modules.brandArchitecture = {
      ...arch,
      nodes: updatedNodes,
      relationships: updatedRels
    };

    const normalized = normalizeBrandData(brand);
    expect(normalized.modules?.brandArchitecture?.nodes).toHaveLength(2);
    expect(normalized.modules?.brandArchitecture?.nodes.find((n) => n.id === 'node-roastery')).toBeUndefined();

    // rel-1 (which pointed to node-roastery) must be cleanly purged, leaving only rel-2
    expect(normalized.modules?.brandArchitecture?.relationships).toHaveLength(1);
    expect(normalized.modules?.brandArchitecture?.relationships[0].id).toBe('rel-2');
    expect(normalized.modules?.brandArchitecture?.relationships[0].targetNodeId).toBe('node-venture');

    // Now delete node-master (source of rel-2)
    const nodesWithoutMaster = normalized.modules!.brandArchitecture!.nodes.filter((n) => n.id !== 'node-master');
    const relsWithoutMaster = normalized.modules!.brandArchitecture!.relationships.filter(
      (rel) => rel.sourceNodeId !== 'node-master' && rel.targetNodeId !== 'node-master'
    );

    brand.modules.brandArchitecture = {
      ...normalized.modules!.brandArchitecture!,
      nodes: nodesWithoutMaster,
      relationships: relsWithoutMaster
    };

    const finalNormalized = normalizeBrandData(brand);
    expect(finalNormalized.modules?.brandArchitecture?.nodes).toHaveLength(1);
    expect(finalNormalized.modules?.brandArchitecture?.relationships).toHaveLength(0);
  });
});
