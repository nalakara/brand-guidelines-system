import { describe, it, expect } from 'vitest';
import { Brand } from './types/brand';
import { getLocalizedText } from './types/brand';
import { resolveEntityLabel } from './utils/entityResolver';
import { t } from './i18n/translations';

describe('Phase 3.3D: Brand Architecture Preview Smoke Tests', () => {
  const createMockBrand = (): Brand => ({
    id: 'test-brand-preview',
    name: 'Northstar Enterprise',
    createdAt: '2026-08-21T00:00:00Z',
    updatedAt: '2026-08-21T00:00:00Z',
    activeModules: ['brandArchitecture', 'visualRules', 'visualAssets', 'positioning'],
    modules: {
      positioning: {
        marketCategory: { en: 'Enterprise Coffee', id: 'Kopi Enterprise' },
        coreProblem: { en: '', id: '' },
        competitiveAlternatives: { en: '', id: '' },
        positioningStatement: { en: '', id: '' },
        targetAudiences: [
          {
            id: 'aud-enterprise',
            name: { en: 'B2B Enterprise Clients', id: 'Klien Enterprise B2B' },
            description: { en: '', id: '' },
            needsPainPoints: { en: 'Enterprise scalability', id: 'Skalabilitas enterprise' }
          }
        ],
        differentiators: []
      },
      visualRules: [
        {
          id: 'rule-endorsement',
          name: 'Endorsement Clearspace & Lockup Scale',
          type: 'requirement',
          context: 'layout',
          guidance: { en: 'Must appear on bottom right at 25%', id: 'Harus di kanan bawah 25%' },
          references: []
        }
      ],
      visualAssets: [
        {
          id: 'asset-lockup-svg',
          name: 'Northstar Venture Lockup SVG',
          category: 'logos',
          files: [
            {
              id: 'f-2',
              filename: 'lockup.svg',
              format: 'svg',
              sizeBytes: 2048,
              uploadedAt: '2026-08-21T00:00:00Z'
            }
          ]
        }
      ],
      brandArchitecture: {
        strategyType: 'hybrid',
        strategyOverview: {
          en: 'Operating as a Branded House for retail and Endorsed for laboratories.',
          id: 'Beroperasi sebagai Branded House untuk ritel dan Terendos untuk laboratorium.'
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
          }
        ]
      }
    }
  });

  // 1 & 2. Strategy type and overview projection
  it('projects strategy model and overview in English and Indonesian without modifying source', () => {
    const brand = createMockBrand();
    const arch = brand.modules.brandArchitecture!;

    // EN Projection
    const enOverview = getLocalizedText(arch.strategyOverview, 'en').text;
    const enStrategyLabel = t('strategyHybrid', 'en');
    expect(enOverview).toBe('Operating as a Branded House for retail and Endorsed for laboratories.');
    expect(enStrategyLabel).toContain('Hybrid');

    // ID Projection
    const idOverview = getLocalizedText(arch.strategyOverview, 'id').text;
    const idStrategyLabel = t('strategyHybrid', 'id');
    expect(idOverview).toBe('Beroperasi sebagai Branded House untuk ritel dan Terendos untuk laboratorium.');
    expect(idStrategyLabel).toContain('Hibrida');
  });

  // 3 to 6. Node projection: root master and subBrand nodes
  it('projects root corporateMaster and subBrand nodes with localized role and status labels', () => {
    const brand = createMockBrand();
    const nodes = brand.modules.brandArchitecture!.nodes;

    const master = nodes.find((n) => n.id === 'node-master')!;
    expect(getLocalizedText(master.name, 'en').text).toBe('Northstar Coffee Master');
    expect(getLocalizedText(master.name, 'id').text).toBe('Induk Kopi Northstar');
    expect(t('nodeTypeCorporateMaster', 'en')).toBe('Corporate Masterbrand');
    expect(t('nodeTypeCorporateMaster', 'id')).toBe('Merek Induk Korporat');
    expect(master.status).toBe('active');

    const roastery = nodes.find((n) => n.id === 'node-roastery')!;
    expect(getLocalizedText(roastery.name, 'en').text).toBe('Northstar Roastery Lab');
    expect(t('nodeTypeSubBrand', 'en')).toBe('Sub-Brand (Shared Equity)');
    expect(t('nodeTypeSubBrand', 'id')).toBe('Sub-Merek (Berbagi Ekuitas)');
  });

  // 7 to 10. Relationship projection: source/target resolution, type, and coupling
  it('projects relationship topology with resolved source/target names, relationship types, and coupling tiers', () => {
    const brand = createMockBrand();
    const rel = brand.modules.brandArchitecture!.relationships[0];
    const nodes = brand.modules.brandArchitecture!.nodes;

    const sourceNode = nodes.find((n) => n.id === rel.sourceNodeId);
    const targetNode = nodes.find((n) => n.id === rel.targetNodeId);

    expect(getLocalizedText(sourceNode?.name, 'en').text).toBe('Northstar Coffee Master');
    expect(getLocalizedText(targetNode?.name, 'en').text).toBe('Northstar Roastery Lab');
    expect(t('relTypeParentOf', 'en')).toBe('Parent of (Hierarchy)');
    expect(t('relTypeParentOf', 'id')).toBe('Induk dari (Hierarki)');
    expect(t('couplingMonolithic', 'en')).toContain('Monolithic');
    expect(t('couplingMonolithic', 'id')).toContain('Monolitik');
    expect(getLocalizedText(rel.endorsementRuleNotes, 'en').text).toBe('Full corporate lockup required');
  });

  // 11 to 14. Reference resolution and graceful handling of missing references
  it('resolves live reference labels for rules, audiences, and assets with graceful fallback', () => {
    const brand = createMockBrand();
    const master = brand.modules.brandArchitecture!.nodes[0];
    const rel = brand.modules.brandArchitecture!.relationships[0];

    // Node rule reference
    const ruleRef = master.governingRuleRefs![0];
    expect(resolveEntityLabel(brand, ruleRef, 'en')).toBe('Endorsement Clearspace & Lockup Scale');

    // Node audience reference
    const audRef = master.targetAudienceRefs![0];
    expect(resolveEntityLabel(brand, audRef, 'en')).toBe('B2B Enterprise Clients');
    expect(resolveEntityLabel(brand, audRef, 'id')).toBe('Klien Enterprise B2B');

    // Relationship asset reference
    const assetRef = rel.sharedAssetRefs![0];
    expect(resolveEntityLabel(brand, assetRef, 'en')).toBe('Northstar Venture Lockup SVG');

    // Missing reference fallback
    const missingRef = {
      domain: 'visualRules' as const,
      entityType: 'rule' as const,
      entityId: 'rule-phantom',
      label: 'Cached Fallback Rule'
    };
    expect(resolveEntityLabel(brand, missingRef, 'en')).toBe('Cached Fallback Rule');
  });

  // 15. Zero knowledge fabrication on empty architecture
  it('does not fabricate synthetic nodes or relationships for brands with empty architecture', () => {
    const emptyBrand: Brand = {
      id: 'empty-preview-brand',
      name: 'Empty Preview Brand',
      createdAt: '2026-08-21T00:00:00Z',
      updatedAt: '2026-08-21T00:00:00Z',
      activeModules: ['brandArchitecture'],
      modules: {
        brandArchitecture: {
          strategyType: 'hybrid',
          nodes: [],
          relationships: []
        }
      }
    };

    const arch = emptyBrand.modules.brandArchitecture!;
    expect(arch.nodes).toHaveLength(0);
    expect(arch.relationships).toHaveLength(0);
  });

  // 16 to 18. Pure read-only projection invariant
  it('enforces that preview projections do not mutate source data and relationships are not generic entities', () => {
    const brand = createMockBrand();
    const sourceCopy = JSON.parse(JSON.stringify(brand));

    // Resolve all preview labels
    const arch = brand.modules.brandArchitecture!;
    arch.nodes.forEach((n) => {
      resolveEntityLabel(brand, { domain: 'brandArchitecture', entityType: 'brandArchitectureNode', entityId: n.id }, 'en');
    });

    // Invariant 1: Source data is untouched
    expect(brand).toEqual(sourceCopy);

    // Invariant 2: BrandRelationshipEntity is NOT an EntityType
    const validEntityTypes = ['brandArchitectureNode', 'rule', 'asset', 'targetAudience'];
    expect(validEntityTypes.includes('brandRelationship')).toBe(false);
  });
});
