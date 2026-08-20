import { describe, it, expect } from 'vitest';
import { sampleBrand } from './data/sampleBrand';
import { normalizeBrandData } from './utils/migration';
import { getAvailableEntities, resolveEntityLabel, findBackReferences } from './utils/entityResolver';
import { Brand } from './types/brand';

describe('Phase 3.1 Brand Expression (Touchpoints) Smoke Tests', () => {
  it('1. Normalizes legacy brand without Brand Expression to empty structure without fabricating touchpoints', () => {
    const rawLegacyBrand: Brand = {
      ...sampleBrand,
      activeModules: ['overview', 'strategy', 'visualBasics'],
      modules: {
        overview: sampleBrand.modules.overview,
        strategy: sampleBrand.modules.strategy,
        visualBasics: sampleBrand.modules.visualBasics
      }
    };

    const normalized = normalizeBrandData(rawLegacyBrand);
    // When brandExpression is not active, modules.brandExpression should remain undefined
    expect(normalized.modules.brandExpression).toBeUndefined();

    // When activated with empty data, it normalizes to empty touchpoints array with zero knowledge fabrication
    const rawWithActive: Brand = {
      ...rawLegacyBrand,
      activeModules: [...rawLegacyBrand.activeModules, 'brandExpression'],
      modules: {
        ...rawLegacyBrand.modules,
        brandExpression: undefined
      }
    };

    const normalizedActive = normalizeBrandData(rawWithActive);
    expect(normalizedActive.modules.brandExpression).toBeDefined();
    expect(normalizedActive.modules.brandExpression?.touchpoints).toEqual([]);
    expect(normalizedActive.modules.brandExpression?.overview?.en).toBe('');

    // Idempotency check
    const secondPass = normalizeBrandData(normalizedActive);
    expect(secondPass).toEqual(normalizedActive);
  });

  it('2. Indexes all Touchpoint entities in getAvailableEntities under brandExpression domain', () => {
    const normalized = normalizeBrandData(sampleBrand);
    const entities = getAvailableEntities(normalized, 'brandExpression', 'touchpoint', 'en');

    expect(entities.length).toBeGreaterThanOrEqual(4);
    const coffeeBag = entities.find((e) => e.reference.entityId === 'tp-1');
    expect(coffeeBag).toBeDefined();
    expect(coffeeBag?.name).toContain('Roastery Whole Bean 12oz Pouch');
    expect(coffeeBag?.reference.domain).toBe('brandExpression');
    expect(coffeeBag?.reference.entityType).toBe('touchpoint');
    expect(coffeeBag?.categoryOrRole).toBe('packaging');
  });

  it('3. Resolves live localized labels for Touchpoints in English and Indonesian', () => {
    const normalized = normalizeBrandData(sampleBrand);

    const enLabel = resolveEntityLabel(
      normalized,
      { domain: 'brandExpression', entityType: 'touchpoint', entityId: 'tp-1', label: 'Fallback Bag' },
      'en'
    );
    expect(enLabel).toBe('Roastery Whole Bean 12oz Pouch');

    const idLabel = resolveEntityLabel(
      normalized,
      { domain: 'brandExpression', entityType: 'touchpoint', entityId: 'tp-1', label: 'Fallback Bag' },
      'id'
    );
    expect(idLabel).toBe('Kantong Biji Kopi Roastery 12oz');

    // Missing entity falls back safely
    const fallbackLabel = resolveEntityLabel(
      normalized,
      { domain: 'brandExpression', entityType: 'touchpoint', entityId: 'tp-non-existent', label: 'Cached Label' },
      'en'
    );
    expect(fallbackLabel).toBe('Cached Label');
  });

  it('4. Discovers backreferences from Touchpoints to Visual Assets, Visual Rules, and Brand Knowledge entities', () => {
    const normalized = normalizeBrandData(sampleBrand);

    // Asset-1 is referenced by tp-1 and tp-2
    const assetBackRefs = findBackReferences(normalized, 'asset-1');
    const tpAssetRefs = assetBackRefs.filter((b) => b.referencerDomain === 'brandExpression');
    expect(tpAssetRefs.length).toBeGreaterThanOrEqual(2);

    // Rule vr-1 is referenced by tp-1
    const ruleBackRefs = findBackReferences(normalized, 'vr-1');
    const tpRuleRefs = ruleBackRefs.filter((b) => b.referencerDomain === 'brandExpression');
    expect(tpRuleRefs.length).toBeGreaterThanOrEqual(1);

    // Logo-1 is referenced by tp-1
    const logoBackRefs = findBackReferences(normalized, 'logo-1');
    const tpLogoRefs = logoBackRefs.filter((b) => b.referencerDomain === 'brandExpression');
    expect(tpLogoRefs.length).toBeGreaterThanOrEqual(1);
    expect(tpLogoRefs[0].sourceName).toBe('Roastery Whole Bean 12oz Pouch');
  });

  it('5. Preserves stable IDs and structured specifications across touchpoint edits', () => {
    const brandWithCustomTp: Brand = {
      ...sampleBrand,
      modules: {
        ...sampleBrand.modules,
        brandExpression: {
          overview: { en: 'Custom Expression' },
          touchpoints: [
            {
              id: 'tp-custom-1',
              name: { en: 'Cold Brew Can 250ml' },
              category: 'packaging',
              specifications: {
                dimensions: '250ml Slim Can',
                colorSpace: 'CMYK',
                materialsFinish: { en: 'Brushed Aluminum with Matte Shrink Sleeve' }
              },
              appliedAssetRefs: [],
              appliedRuleRefs: [],
              governingEntityRefs: []
            }
          ]
        }
      }
    };

    const normalized = normalizeBrandData(brandWithCustomTp);
    const tp = normalized.modules.brandExpression?.touchpoints[0];
    expect(tp?.id).toBe('tp-custom-1');
    expect(tp?.specifications?.dimensions).toBe('250ml Slim Can');
    expect(tp?.specifications?.materialsFinish?.en).toBe('Brushed Aluminum with Matte Shrink Sleeve');
  });
});
