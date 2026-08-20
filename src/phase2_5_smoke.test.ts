import { describe, it, expect } from 'vitest';
import { sampleBrand } from './data/sampleBrand';
import { normalizeBrandData } from './utils/migration';
import { getAvailableEntities, resolveEntityLabel, findBackReferences } from './utils/entityResolver';
import { BrandData } from './types/brand';

describe('Phase 2.5 Visual Knowledge Deepening Smoke Tests', () => {
  it('1. Normalizes brand data idempotently with deepened Visual Knowledge entities without fabricating scale steps', () => {
    const rawBrand: BrandData = {
      ...sampleBrand,
      modules: {
        ...sampleBrand.modules,
        visualBasics: {
          ...sampleBrand.modules.visualBasics,
          layoutComposition: {
            spacing: {
              baseUnitPx: 8
            }
          },
          imagery: {},
          graphicLanguage: {}
        }
      }
    };

    const normalized = normalizeBrandData(rawBrand);
    const layout = normalized.modules.visualBasics?.layoutComposition;
    const imagery = normalized.modules.visualBasics?.imagery;
    const gl = normalized.modules.visualBasics?.graphicLanguage;

    // Must have arrays initialized
    expect(layout?.gridSystems).toBeDefined();
    expect(layout?.layoutPrinciples).toBeDefined();
    expect(layout?.spacingScale?.baseUnitPx).toBe(8);
    // Crucial rule: Migration must NEVER fabricate scaleSteps if not present
    expect(layout?.spacingScale?.scaleSteps).toBeUndefined();

    expect(imagery?.directions).toBeDefined();
    expect(imagery?.treatments).toBeDefined();

    expect(gl?.elements).toBeDefined();
    expect(gl?.illustrationStyles).toBeDefined();
    expect(gl?.iconSystems).toBeDefined();

    // Second pass idempotency check
    const normalizedSecond = normalizeBrandData(normalized);
    expect(normalizedSecond).toEqual(normalized);
  });

  it('2. Indexes all Phase 2.5 entities in getAvailableEntities() under visualKnowledge domain', () => {
    const normalized = normalizeBrandData(sampleBrand);
    const entities = getAvailableEntities(normalized, 'visualKnowledge', undefined, 'en');

    const types = entities.map((e) => e.reference.entityType);
    expect(types).toContain('gridSystem');
    expect(types).toContain('layoutPrinciple');
    expect(types).toContain('imageryDirection');
    expect(types).toContain('imageTreatment');
    expect(types).toContain('graphicElement');
    expect(types).toContain('illustrationStyle');
    expect(types).toContain('iconSystem');

    const gridEntity = entities.find((e) => e.reference.entityId === 'grid-1');
    expect(gridEntity).toBeDefined();
    expect(gridEntity?.name).toContain('12-Column Desktop Grid');

    const imageryEntity = entities.find((e) => e.reference.entityId === 'img-dir-1');
    expect(imageryEntity).toBeDefined();
    expect(imageryEntity?.name).toBe('Documentary Morning Rituals');
  });

  it('3. Resolves localized labels dynamically and handles fallback gracefully', () => {
    const normalized = normalizeBrandData(sampleBrand);

    // English label
    const enLabel = resolveEntityLabel(
      normalized,
      { domain: 'visualKnowledge', entityType: 'gridSystem', entityId: 'grid-1', label: 'Cached Label' },
      'en'
    );
    expect(enLabel).toContain('12-Column Desktop Grid');

    // Indonesian label
    const idLabel = resolveEntityLabel(
      normalized,
      { domain: 'visualKnowledge', entityType: 'gridSystem', entityId: 'grid-1', label: 'Cached Label' },
      'id'
    );
    expect(idLabel).toContain('Grid Desktop 12-Kolom');

    // Non-existent entity falls back to cached label
    const missingLabel = resolveEntityLabel(
      normalized,
      { domain: 'visualKnowledge', entityType: 'gridSystem', entityId: 'grid-non-existent', label: 'Fallback Label' },
      'en'
    );
    expect(missingLabel).toBe('Fallback Label');
  });

  it('4. Attaches references to deepened visual entities from Visual Rules and detects backreferences', () => {
    const brandWithRule: BrandData = {
      ...sampleBrand,
      modules: {
        ...sampleBrand.modules,
        visualRules: [
          {
            id: 'vr-deep-1',
            name: 'Hero Whitespace Rule',
            context: 'Editorial & Landing Pages',
            type: 'must',
            rule: {
              en: 'All heroes must align with the 12-Column grid and obey intentional whitespace.',
              id: 'Semua hero harus sejajar dengan grid 12-Kolom dan mematuhi ruang kosong berniat.'
            },
            severity: 'error',
            relatedEntities: [
              {
                domain: 'visualKnowledge',
                entityType: 'gridSystem',
                entityId: 'grid-1',
                label: '12-Column Desktop Grid'
              },
              {
                domain: 'visualKnowledge',
                entityType: 'layoutPrinciple',
                entityId: 'lp-1',
                label: 'Intentional Whitespace & Asymmetry'
              }
            ]
          }
        ]
      }
    };

    const backRefs = findBackReferences(brandWithRule, 'grid-1');
    expect(backRefs.length).toBe(1);
    expect(backRefs[0].referencerName).toBe('Hero Whitespace Rule');
    expect(backRefs[0].referencerDomain).toBe('visualRules');
  });
});
