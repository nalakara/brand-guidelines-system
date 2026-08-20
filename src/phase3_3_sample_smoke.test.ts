import { describe, it, expect } from 'vitest';
import { sampleBrand } from './data/sampleBrand';
import { normalizeBrandData } from './utils/migration';
import { getAvailableEntities, resolveEntityLabel, findBackReferences } from './utils/entityResolver';

describe('Phase 3.3E: Northstar Coffee Sample Brand Architecture Smoke Tests', () => {
  // 1 to 3. Strategy & Root Node Verification
  it('1. Verifies strategy is hybrid and root corporateMaster node exists for Northstar Coffee', () => {
    const arch = sampleBrand.modules.brandArchitecture;
    expect(arch).toBeDefined();
    expect(arch?.strategyType).toBe('hybrid');
    expect(arch?.strategyOverview?.en).toContain('Branded House');
    expect(arch?.strategyOverview?.id).toContain('Branded House');

    const rootNode = arch?.nodes.find((n) => n.nodeType === 'corporateMaster');
    expect(rootNode).toBeDefined();
    expect(rootNode?.id).toBe('node-master');
    expect(rootNode?.name.en).toBe('Northstar Coffee');
    expect(rootNode?.name.id).toBe('Kopi Northstar');
    expect(rootNode?.status).toBe('active');
  });

  // 4 to 8. Unique Node IDs, Bilingual Names, and Specific Portfolio Entities
  it('2. Verifies unique node IDs, bilingual names, and expected portfolio nodes (Roastery Lab, RTD, Bali Cacao)', () => {
    const nodes = sampleBrand.modules.brandArchitecture?.nodes || [];
    expect(nodes.length).toBe(4);

    // Node IDs uniqueness
    const nodeIds = nodes.map((n) => n.id);
    const uniqueIds = new Set(nodeIds);
    expect(uniqueIds.size).toBe(nodes.length);

    // Bilingual check
    nodes.forEach((n) => {
      expect(n.name.en).toBeTruthy();
      expect(n.name.id).toBeTruthy();
    });

    // node-roastery
    const roastery = nodes.find((n) => n.id === 'node-roastery');
    expect(roastery).toBeDefined();
    expect(roastery?.nodeType).toBe('subBrand');
    expect(roastery?.name.en).toBe('Northstar Roastery Lab');

    // node-rtd
    const rtd = nodes.find((n) => n.id === 'node-rtd');
    expect(rtd).toBeDefined();
    expect(rtd?.nodeType).toBe('endorsedBrand');
    expect(rtd?.name.en).toBe('Northstar Daily Rituals RTD');

    // node-bali-cacao
    const baliCacao = nodes.find((n) => n.id === 'node-bali-cacao');
    expect(baliCacao).toBeDefined();
    expect(baliCacao?.nodeType).toBe('partnerBrand');
    expect(baliCacao?.name.en).toBe('Bali Cacao Co-Lab');
  });

  // 9 to 16. Relationship Topology, Types, and Coupling Tiers
  it('3. Verifies unique relationship IDs, valid source/target connections, no self-loops, and correct coupling tiers', () => {
    const arch = sampleBrand.modules.brandArchitecture!;
    const rels = arch.relationships || [];
    const nodes = arch.nodes || [];
    const validNodeIds = new Set(nodes.map((n) => n.id));

    expect(rels.length).toBe(3);

    // Relationship IDs uniqueness
    const relIds = rels.map((r) => r.id);
    expect(new Set(relIds).size).toBe(rels.length);

    // No self-loops and all source/target exist
    rels.forEach((r) => {
      expect(r.sourceNodeId).not.toBe(r.targetNodeId);
      expect(validNodeIds.has(r.sourceNodeId)).toBe(true);
      expect(validNodeIds.has(r.targetNodeId)).toBe(true);
    });

    // No duplicate directed pairs
    const pairs = rels.map((r) => `${r.sourceNodeId}->${r.targetNodeId}`);
    expect(new Set(pairs).size).toBe(rels.length);

    // rel-1: parentOf (monolithic)
    const rel1 = rels.find((r) => r.id === 'rel-1');
    expect(rel1).toBeDefined();
    expect(rel1?.sourceNodeId).toBe('node-master');
    expect(rel1?.targetNodeId).toBe('node-roastery');
    expect(rel1?.relationshipType).toBe('parentOf');
    expect(rel1?.coupling).toBe('monolithic');

    // rel-2: endorses (endorsed)
    const rel2 = rels.find((r) => r.id === 'rel-2');
    expect(rel2).toBeDefined();
    expect(rel2?.sourceNodeId).toBe('node-master');
    expect(rel2?.targetNodeId).toBe('node-rtd');
    expect(rel2?.relationshipType).toBe('endorses');
    expect(rel2?.coupling).toBe('endorsed');

    // rel-3: partnerWith (coBranded)
    const rel3 = rels.find((r) => r.id === 'rel-3');
    expect(rel3).toBeDefined();
    expect(rel3?.sourceNodeId).toBe('node-master');
    expect(rel3?.targetNodeId).toBe('node-bali-cacao');
    expect(rel3?.relationshipType).toBe('partnerWith');
    expect(rel3?.coupling).toBe('coBranded');
  });

  // 17 to 21. Semantic References to Existing Brand Knowledge
  it('4. Verifies all node and relationship references resolve to actual authored Visual Rules, Target Audiences, and Assets', () => {
    const arch = sampleBrand.modules.brandArchitecture!;
    const visualRules = sampleBrand.modules.visualRules || [];
    const targetAudiences = sampleBrand.modules.positioning?.targetAudiences || [];
    const visualAssets = sampleBrand.modules.visualAssets || [];

    const existingRuleIds = new Set(visualRules.map((r) => r.id));
    const existingAudienceIds = new Set(targetAudiences.map((a) => a.id));
    const existingAssetIds = new Set(visualAssets.map((a) => a.id));

    // Check Node rule & audience references
    arch.nodes.forEach((node) => {
      node.governingRuleRefs?.forEach((ref) => {
        expect(ref.domain).toBe('visualRules');
        expect(ref.entityType).toBe('rule');
        expect(existingRuleIds.has(ref.entityId)).toBe(true);
        expect(resolveEntityLabel(sampleBrand, ref, 'en')).toBeTruthy();
      });

      node.targetAudienceRefs?.forEach((ref) => {
        expect(ref.domain).toBe('foundation');
        expect(ref.entityType).toBe('targetAudience');
        expect(existingAudienceIds.has(ref.entityId)).toBe(true);
        expect(resolveEntityLabel(sampleBrand, ref, 'en')).toBeTruthy();
      });
    });

    // Check Relationship rule & asset references
    arch.relationships.forEach((rel) => {
      rel.governingRuleRefs?.forEach((ref) => {
        expect(ref.domain).toBe('visualRules');
        expect(ref.entityType).toBe('rule');
        expect(existingRuleIds.has(ref.entityId)).toBe(true);
        expect(resolveEntityLabel(sampleBrand, ref, 'en')).toBeTruthy();
      });

      rel.sharedAssetRefs?.forEach((ref) => {
        expect(ref.domain).toBe('visualAssets');
        expect(ref.entityType).toBe('asset');
        expect(existingAssetIds.has(ref.entityId)).toBe(true);
        expect(resolveEntityLabel(sampleBrand, ref, 'en')).toBeTruthy();
      });
    });
  });

  // 22 to 24. Normalization and Idempotency
  it('5. Normalization preserves all authored sample architecture entities and remains strictly idempotent', () => {
    const normalized = normalizeBrandData(sampleBrand);
    const arch = normalized.modules?.brandArchitecture!;

    expect(arch.nodes).toHaveLength(4);
    expect(arch.relationships).toHaveLength(3);
    expect(arch.strategyType).toBe('hybrid');

    // Idempotency check: 2nd and 3rd passes
    const pass2 = normalizeBrandData(normalized);
    const pass3 = normalizeBrandData(pass2);

    expect(pass3.modules?.brandArchitecture?.nodes).toEqual(arch.nodes);
    expect(pass3.modules?.brandArchitecture?.relationships).toEqual(arch.relationships);
  });

  // 25. Non-Architecture Coexistence & System Coherence
  it('6. Verifies non-architecture sample modules (Foundation, Naming, Touchpoints, Visual Rules) remain coherent and intact', () => {
    const { modules } = sampleBrand;

    // Overview & Strategy
    expect(modules.overview?.brandName).toBe('Northstar Coffee');
    expect(modules.strategy?.values?.length).toBeGreaterThan(0);

    // Positioning
    expect(modules.positioning?.targetAudiences?.length).toBe(2);

    // Brand Naming (Phase 3.2)
    expect(modules.brandNaming?.systems?.length).toBe(2);

    // Brand Expression Touchpoints (Phase 3.1)
    expect(modules.brandExpression?.touchpoints?.length).toBe(4);

    // Invariant: Relationships remain structural topology and are not in getAvailableEntities()
    const entities = getAvailableEntities(sampleBrand);
    const archEntities = entities.filter((e) => e.reference.domain === 'brandArchitecture');
    expect(archEntities).toHaveLength(4);
    expect(archEntities.every((e) => e.reference.entityType === 'brandArchitectureNode')).toBe(true);
    expect(entities.some((e) => (e.reference as any).entityType === 'brandRelationship')).toBe(false);
  });
});
