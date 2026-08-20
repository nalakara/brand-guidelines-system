import { describe, it, expect } from 'vitest';
import { sampleBrand } from './data/sampleBrand';
import { normalizeBrandData } from './utils/migration';
import { getAvailableEntities, resolveEntityLabel, findBackReferences } from './utils/entityResolver';
import { Brand } from './types/brand';

describe('Phase 3.2 Brand Naming (NamingSystemEntity) Smoke Tests', () => {
  it('1. Normalizes legacy brand without Brand Naming to empty structure without fabricating naming systems', () => {
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
    // When brandNaming is not active, modules.brandNaming should remain undefined
    expect(normalized.modules.brandNaming).toBeUndefined();

    // When activated with empty data, it normalizes to empty systems array with zero knowledge fabrication
    const rawWithActive: Brand = {
      ...rawLegacyBrand,
      activeModules: [...rawLegacyBrand.activeModules, 'brandNaming'],
      modules: {
        ...rawLegacyBrand.modules,
        brandNaming: undefined
      }
    };

    const normalizedActive = normalizeBrandData(rawWithActive);
    expect(normalizedActive.modules.brandNaming).toBeDefined();
    expect(normalizedActive.modules.brandNaming?.systems).toEqual([]);
    expect(normalizedActive.modules.brandNaming?.principlesOverview?.en).toBe('');

    // Idempotency check
    const secondPass = normalizeBrandData(normalizedActive);
    expect(secondPass).toEqual(normalizedActive);
  });

  it('2. Indexes all NamingSystem entities in getAvailableEntities under foundation domain', () => {
    const normalized = normalizeBrandData(sampleBrand);
    const entities = getAvailableEntities(normalized, 'foundation', 'namingSystem', 'en');

    expect(entities.length).toBeGreaterThanOrEqual(2);
    const blendSystem = entities.find((e) => e.reference.entityId === 'name-sys-1');
    expect(blendSystem).toBeDefined();
    expect(blendSystem?.name).toContain('Seasonal Blend & Harvest Nomenclature');
    expect(blendSystem?.reference.domain).toBe('foundation');
    expect(blendSystem?.reference.entityType).toBe('namingSystem');
  });

  it('3. Resolves live localized labels for Naming Systems in English and Indonesian', () => {
    const normalized = normalizeBrandData(sampleBrand);

    const enLabel = resolveEntityLabel(
      normalized,
      { domain: 'foundation', entityType: 'namingSystem', entityId: 'name-sys-1', label: 'Fallback Name' },
      'en'
    );
    expect(enLabel).toBe('Seasonal Blend & Harvest Nomenclature');

    const idLabel = resolveEntityLabel(
      normalized,
      { domain: 'foundation', entityType: 'namingSystem', entityId: 'name-sys-1', label: 'Fallback Name' },
      'id'
    );
    expect(idLabel).toBe('Nomenklatur Racikan Musiman & Hasil Panen');
  });

  it('4. Discovers backreferences from Naming Systems to Visual Rules, Target Audiences, and Key Messages', () => {
    const normalized = normalizeBrandData(sampleBrand);

    // Rule vr-2 is referenced by name-sys-1
    const ruleBackRefs = findBackReferences(normalized, 'vr-2');
    const namingRuleRefs = ruleBackRefs.filter((b) => b.referencerDomain === 'brandNaming');
    expect(namingRuleRefs.length).toBeGreaterThanOrEqual(1);

    // Audience aud-1 is referenced by name-sys-1
    const audBackRefs = findBackReferences(normalized, 'aud-1');
    const namingAudRefs = audBackRefs.filter((b) => b.referencerDomain === 'brandNaming');
    expect(namingAudRefs.length).toBeGreaterThanOrEqual(1);
    expect(namingAudRefs[0].sourceName).toBe('Seasonal Blend & Harvest Nomenclature');

    // Key Message km-1 is referenced by name-sys-1
    const msgBackRefs = findBackReferences(normalized, 'km-1');
    const namingMsgRefs = msgBackRefs.filter((b) => b.referencerDomain === 'brandNaming');
    expect(namingMsgRefs.length).toBeGreaterThanOrEqual(1);
  });

  it('5. Preserves formula steps, approved/prohibited examples, and tiers across edits', () => {
    const brandWithCustomNaming: Brand = {
      ...sampleBrand,
      modules: {
        ...sampleBrand.modules,
        brandNaming: {
          principlesOverview: { en: 'Custom Overview' },
          systems: [
            {
              id: 'name-sys-custom-1',
              title: { en: 'RTD Beverage Nomenclature' },
              tier: 'productTier',
              approach: 'descriptive',
              formula: [
                {
                  role: 'brandPrefix',
                  label: { en: 'Northstar' },
                  required: true
                },
                {
                  role: 'descriptor',
                  label: { en: 'Cold Brew' },
                  required: true
                },
                {
                  role: 'modifier',
                  label: { en: 'Nitro / Oat' },
                  required: false
                }
              ],
              examples: {
                approved: ['Northstar Nitro Cold Brew', 'Northstar Oat Milk Latte'],
                prohibited: ['Northstar Monster Energy Coffee'],
                rationale: { en: 'Stay grounded.' }
              },
              governingRuleRefs: [],
              targetAudienceRefs: [],
              supportingMessageRefs: []
            }
          ]
        }
      }
    };

    const normalized = normalizeBrandData(brandWithCustomNaming);
    const sys = normalized.modules.brandNaming?.systems[0];
    expect(sys?.id).toBe('name-sys-custom-1');
    expect(sys?.formula.length).toBe(3);
    expect(sys?.formula[0].label.en).toBe('Northstar');
    expect(sys?.formula[2].required).toBe(false);
    expect(sys?.examples.approved).toContain('Northstar Nitro Cold Brew');
    expect(sys?.examples.prohibited).toContain('Northstar Monster Energy Coffee');
  });
});
