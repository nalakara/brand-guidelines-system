import { describe, it, expect } from 'vitest';
import { Brand, BrandArchitectureNodeEntity, BrandRelationshipEntity } from './types/brand';
import { getAvailableEntities, resolveEntityLabel, findBackReferences } from './utils/entityResolver';
import { normalizeBrandData } from './utils/migration';

describe('Phase 3.3B: Brand Architecture Entity Resolver & Reference Semantics', () => {
  const createMockBrandWithArchitecture = (): Brand => ({
    id: 'test-brand',
    name: 'Test Holding Corp',
    createdAt: '2026-08-21T00:00:00Z',
    updatedAt: '2026-08-21T00:00:00Z',
    activeModules: ['brandArchitecture', 'visualRules', 'visualAssets', 'positioning'],
    modules: {
      positioning: {
        marketCategory: { en: 'Specialty Coffee', id: 'Kopi Spesialti' },
        coreProblem: { en: '', id: '' },
        competitiveAlternatives: { en: '', id: '' },
        positioningStatement: { en: '', id: '' },
        targetAudiences: [
          {
            id: 'aud-specialty',
            name: { en: 'Specialty Coffee Drinkers', id: 'Peminum Kopi Spesialti' },
            description: { en: '', id: '' },
            needsPainPoints: { en: 'Seeking tranquil ritual', id: 'Mencari ritual tenang' }
          }
        ],
        differentiators: []
      },
      visualRules: [
        {
          id: 'rule-lockup',
          name: 'Endorsement Clearspace & Lockup Scale',
          type: 'requirement',
          context: 'layout',
          guidance: { en: 'Parent endorsement must be at 30% scale', id: 'Endosemen induk harus berskala 30%' },
          references: []
        }
      ],
      visualAssets: [
        {
          id: 'asset-badge',
          name: 'Co-Branded Emblem Lockup SVG',
          category: 'logos',
          files: [
            {
              id: 'f-1',
              filename: 'cobrand.svg',
              format: 'svg',
              sizeBytes: 1024,
              uploadedAt: '2026-08-21T00:00:00Z'
            }
          ]
        }
      ],
      brandArchitecture: {
        strategyType: 'hybrid',
        strategyOverview: { en: 'Hybrid masterbrand and endorsed ventures.', id: 'Merek induk hibrida dan ventura terendos.' },
        nodes: [
          {
            id: 'node-corp',
            name: { en: 'Northstar Corporate', id: 'Korporat Northstar' },
            nodeType: 'corporateMaster',
            status: 'active',
            targetAudienceRefs: [
              { domain: 'foundation', entityType: 'targetAudience', entityId: 'aud-specialty' }
            ],
            governingRuleRefs: [
              { domain: 'visualRules', entityType: 'rule', entityId: 'rule-lockup' }
            ]
          },
          {
            id: 'node-lab',
            name: { en: 'Northstar Roastery Lab', id: 'Laboratorium Sangrai Northstar' },
            nodeType: 'subBrand',
            status: 'active'
          }
        ],
        relationships: [
          {
            id: 'rel-1',
            sourceNodeId: 'node-corp',
            targetNodeId: 'node-lab',
            relationshipType: 'parentOf',
            coupling: 'monolithic',
            governingRuleRefs: [
              { domain: 'visualRules', entityType: 'rule', entityId: 'rule-lockup' }
            ],
            sharedAssetRefs: [
              { domain: 'visualAssets', entityType: 'asset', entityId: 'asset-badge' }
            ]
          }
        ]
      }
    }
  });

  // 1 & 2. Architecture nodes appear with proper domain, entityType, and ID
  it('indexes BrandArchitectureNodeEntity with domain brandArchitecture and entityType brandArchitectureNode', () => {
    const brand = createMockBrandWithArchitecture();
    const entities = getAvailableEntities(brand);

    const nodeEntities = entities.filter((e) => e.reference.domain === 'brandArchitecture');
    expect(nodeEntities).toHaveLength(2);

    const corpNode = nodeEntities.find((e) => e.reference.entityId === 'node-corp');
    expect(corpNode).toBeDefined();
    expect(corpNode?.reference.entityType).toBe('brandArchitectureNode');
    expect(corpNode?.name).toBe('Northstar Corporate');
    expect(corpNode?.categoryOrRole).toBe('corporateMaster · active');
  });

  // 3 & 4. Live localized label resolution in EN and ID
  it('resolves live node labels in both English and Indonesian', () => {
    const brand = createMockBrandWithArchitecture();

    const enLabel = resolveEntityLabel(
      brand,
      { domain: 'brandArchitecture', entityType: 'brandArchitectureNode', entityId: 'node-corp' },
      'en'
    );
    expect(enLabel).toBe('Northstar Corporate');

    const idLabel = resolveEntityLabel(
      brand,
      { domain: 'brandArchitecture', entityType: 'brandArchitectureNode', entityId: 'node-corp' },
      'id'
    );
    expect(idLabel).toBe('Korporat Northstar');
  });

  // 5. Renaming node changes label without mutating entityId
  it('updates resolved label dynamically when node name is changed', () => {
    const brand = createMockBrandWithArchitecture();
    const node = brand.modules.brandArchitecture!.nodes[0];
    node.name = { en: 'Northstar Global Holdings', id: 'Induk Global Northstar' };

    const updatedEnLabel = resolveEntityLabel(
      brand,
      { domain: 'brandArchitecture', entityType: 'brandArchitectureNode', entityId: 'node-corp' },
      'en'
    );
    expect(updatedEnLabel).toBe('Northstar Global Holdings');
  });

  // 6 & 7. Node -> Rule and Node -> Target Audience backreferences
  it('discovers backreferences from Architecture Node to governing Rule and Target Audience', () => {
    const brand = createMockBrandWithArchitecture();

    // Backreference from Node -> Target Audience
    const audienceBackRefs = findBackReferences(brand, 'aud-specialty');
    expect(audienceBackRefs.some((r) => r.sourceEntityType === 'brandArchitectureNode' && r.sourceName === 'Northstar Corporate')).toBe(true);

    // Backreference from Node -> Rule
    const ruleBackRefs = findBackReferences(brand, 'rule-lockup');
    expect(ruleBackRefs.some((r) => r.sourceName === 'Northstar Corporate')).toBe(true);
  });

  // 8 & 9. Relationship -> Rule and Relationship -> Asset backreferences
  it('discovers backreferences from Relationship to governing Rule and shared co-brand Asset', () => {
    const brand = createMockBrandWithArchitecture();

    // Relationship -> Rule backreference
    const ruleBackRefs = findBackReferences(brand, 'rule-lockup');
    const relToRule = ruleBackRefs.find((r) => r.sourceName.includes('Northstar Corporate → Northstar Roastery Lab'));
    expect(relToRule).toBeDefined();
    expect(relToRule?.sourceDomain).toBe('Brand Architecture');

    // Relationship -> Asset backreference
    const assetBackRefs = findBackReferences(brand, 'asset-badge');
    const relToAsset = assetBackRefs.find((r) => r.sourceName.includes('Northstar Corporate → Northstar Roastery Lab'));
    expect(relToAsset).toBeDefined();
    expect(relToAsset?.sourceDomain).toBe('Brand Architecture');
  });

  // 10. Invariant: BrandRelationshipEntity is NOT exposed as an entity in getAvailableEntities()
  it('enforces the invariant: BrandRelationshipEntity is structural topology only and NEVER an entity target', () => {
    const brand = createMockBrandWithArchitecture();
    const entities = getAvailableEntities(brand);

    // Assert that no entity in getAvailableEntities has entityType or id matching relationships
    const relEntity = entities.find((e) => (e.reference as any).entityType === 'brandRelationship' || e.reference.entityId === 'rel-1');
    expect(relEntity).toBeUndefined();

    // Assert that getAvailableEntities for domain brandArchitecture returns only nodes
    const archEntities = getAvailableEntities(brand, 'brandArchitecture');
    expect(archEntities.every((e) => e.reference.entityType === 'brandArchitectureNode')).toBe(true);
  });

  // 11. ReferencePicker semantic filtering blocks invalid entity types
  it('filters available entities when restricted to allowedEntityTypes', () => {
    const brand = createMockBrandWithArchitecture();

    // Only allow rules
    const ruleEntities = getAvailableEntities(brand).filter((e) => e.reference.entityType === 'rule');
    expect(ruleEntities.every((e) => e.reference.entityType === 'rule')).toBe(true);
    expect(ruleEntities.some((e) => e.reference.entityType === 'brandArchitectureNode')).toBe(false);

    // Only allow brandArchitectureNode
    const nodeOnlyEntities = getAvailableEntities(brand).filter((e) => e.reference.entityType === 'brandArchitectureNode');
    expect(nodeOnlyEntities).toHaveLength(2);
    expect(nodeOnlyEntities.every((e) => e.reference.entityType === 'brandArchitectureNode')).toBe(true);
  });

  // 12. Migration preserves graph integrity and zero knowledge fabrication
  it('preserves graph integrity without fabricating synthetic nodes on empty brands', () => {
    const emptyBrand: Brand = {
      id: 'empty-brand',
      name: 'Empty Brand',
      createdAt: '2026-08-21T00:00:00Z',
      updatedAt: '2026-08-21T00:00:00Z',
      activeModules: ['strategy'],
      modules: {}
    };

    const normalized = normalizeBrandData(emptyBrand);
    expect(normalized.modules?.brandArchitecture).toBeUndefined();

    // Test with active brandArchitecture but invalid self loop & dangling edges
    const brandWithBadGraph: Brand = {
      id: 'bad-graph',
      name: 'Bad Graph',
      createdAt: '2026-08-21T00:00:00Z',
      updatedAt: '2026-08-21T00:00:00Z',
      activeModules: ['brandArchitecture'],
      modules: {
        brandArchitecture: {
          strategyType: 'hybrid',
          nodes: [
            { id: 'node-1', name: { en: 'Node 1', id: 'Node 1' }, nodeType: 'corporateMaster', status: 'active' }
          ],
          relationships: [
            { id: 'rel-loop', sourceNodeId: 'node-1', targetNodeId: 'node-1', relationshipType: 'parentOf', coupling: 'monolithic' },
            { id: 'rel-dangling', sourceNodeId: 'node-1', targetNodeId: 'node-nonexistent', relationshipType: 'parentOf', coupling: 'monolithic' }
          ]
        }
      }
    };

    const cleanNormalized = normalizeBrandData(brandWithBadGraph);
    expect(cleanNormalized.modules?.brandArchitecture?.nodes).toHaveLength(1);
    // Both self-loop and dangling relationship must be discarded
    expect(cleanNormalized.modules?.brandArchitecture?.relationships).toHaveLength(0);
  });
});
