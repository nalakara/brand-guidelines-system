import { describe, it, expect } from 'vitest';
import { sampleBrand } from '../src/data/sampleBrand';
import { normalizeBrandData } from '../src/utils/migration';
import {
  getAvailableEntities,
  resolveEntityLabel,
  findBackReferences
} from '../src/utils/entityResolver';
import {
  Brand,
  EntityReference,
  StrategicValueEntity,
  StrategicPriorityEntity,
  AudienceEntity,
  DifferentiatorEntity,
  PersonalityTraitEntity,
  WeArePairEntity,
  VoicePrincipleEntity,
  VocabularyEntity,
  WritingExampleEntity,
  KeyMessageEntity,
  ProofPointEntity,
  CTAEntity
} from '../src/types/brand';

describe('Phase 2 — Functional Acceptance Suite', () => {
  // --- 1. Foundation Entity Creation & Editing ---
  it('1. Foundation entity models accept structured fields with persistent IDs', () => {
    const value: StrategicValueEntity = {
      id: 'val-101',
      title: { en: 'Radical Simplicity', id: 'Kesederhanaan Radikal' },
      description: { en: 'Remove friction', id: 'Hilangkan friksi' },
      tags: ['core', 'product']
    };
    expect(value.id).toBe('val-101');
    expect(value.tags).toContain('core');

    const priority: StrategicPriorityEntity = {
      id: 'pri-101',
      title: { en: 'Expand to Japan', id: 'Ekspansi ke Jepang' },
      timeframe: 'Mid-term'
    };
    expect(priority.timeframe).toBe('Mid-term');

    const audience: AudienceEntity = {
      id: 'aud-101',
      name: { en: 'Digital Nomads', id: 'Pengembara Digital' },
      needsPainPoints: { en: 'Reliable quiet workspaces', id: 'Ruang kerja tenang' }
    };
    expect(audience.id).toBe('aud-101');

    const differentiator: DifferentiatorEntity = {
      id: 'diff-101',
      title: { en: 'Acoustic zoning', id: 'Zonasi akustik' },
      evidence: { en: 'Decibel meters in every booth', id: 'Pengukur desibel' }
    };
    expect(differentiator.evidence?.en).toBe('Decibel meters in every booth');

    const trait: PersonalityTraitEntity = {
      id: 'tr-101',
      trait: { en: 'Serene', id: 'Tenang' },
      spectrumPosition: 90
    };
    expect(trait.spectrumPosition).toBe(90);

    const pair: WeArePairEntity = {
      id: 'pair-101',
      weAre: { en: 'Craft-focused', id: 'Fokus Kriya' },
      weAreNot: { en: 'Snobbish', id: 'Sombong' },
      rationale: { en: 'Accessibility matters', id: 'Aksesibilitas itu penting' }
    };
    expect(pair.weAre.en).toBe('Craft-focused');

    const vp: VoicePrincipleEntity = {
      id: 'vp-101',
      title: { en: 'Calm Clarity', id: 'Kejelasan yang Tenang' },
      doExample: { en: 'Welcome in.', id: 'Selamat datang.' },
      dontExample: { en: 'Hurry up!', id: 'Cepat!' }
    };
    expect(vp.doExample?.en).toBe('Welcome in.');

    const vocab: VocabularyEntity = {
      id: 'voc-101',
      term: { en: 'Pause' },
      recommendation: 'prefer'
    };
    expect(vocab.recommendation).toBe('prefer');

    const ex: WritingExampleEntity = {
      id: 'ex-101',
      before: { en: 'Get fast coffee' },
      after: { en: 'Take a quiet moment' }
    };
    expect(ex.before.en).toBe('Get fast coffee');

    const pp: ProofPointEntity = {
      id: 'pp-101',
      claim: { en: 'Direct origin receipts' },
      category: 'Transparency'
    };
    expect(pp.category).toBe('Transparency');

    const cta: CTAEntity = {
      id: 'cta-101',
      label: { en: 'Order Beans' },
      contextChannel: 'Online Store'
    };
    expect(cta.contextChannel).toBe('Online Store');
  });

  // --- 2. Real Entity Reference Test ---
  it('2. Correctly builds entity references and queries available entities across 4 domains', () => {
    const brand = normalizeBrandData(sampleBrand);
    brand.modules.visualAssets = [
      {
        id: 'asset-1',
        name: 'Northstar Primary Vector Mark',
        category: 'logos',
        files: []
      }
    ];
    brand.modules.visualRules = [
      {
        id: 'rule-1',
        name: 'Logo Clear Space Rule',
        type: 'requirement',
        context: 'logo',
        guidance: { en: 'Keep 20px clear margin around the mark.' }
      }
    ];

    const entities = getAvailableEntities(brand);

    // Verify all 4 domains are present
    const domains = new Set(entities.map((e) => e.reference.domain));
    expect(domains.has('foundation')).toBe(true);
    expect(domains.has('visualKnowledge')).toBe(true);
    expect(domains.has('visualAssets')).toBe(true);
    expect(domains.has('visualRules')).toBe(true);

    // Verify Color reference structure
    const colorEntity = entities.find(
      (e) => e.reference.domain === 'visualKnowledge' && e.reference.entityType === 'color'
    );
    expect(colorEntity).toBeDefined();
    expect(colorEntity?.reference.entityId).toBeTruthy();
    expect(colorEntity?.reference.entityType).toBe('color');
    expect(colorEntity?.reference.domain).toBe('visualKnowledge');
  });

  // --- 3. Critical Live Label Resolution Test ---
  it('3. Dynamically resolves live labels even when the underlying entity is renamed', () => {
    // 1. Initial brand with Primary Color
    const brand: Brand = JSON.parse(JSON.stringify(sampleBrand));
    brand.modules.visualBasics = {
      ...brand.modules.visualBasics!,
      colors: [
        {
          id: 'c-blue-1',
          name: { en: 'Primary Blue', id: 'Biru Utama' },
          hex: '#0055ff',
          role: 'primary'
        }
      ]
    };

    // 2. Attach reference to Visual Rules using the stable ID 'c-blue-1'
    const colorRef: EntityReference = {
      domain: 'visualKnowledge',
      entityType: 'color',
      entityId: 'c-blue-1',
      label: 'Primary Blue' // Cached label
    };

    // Confirm initial resolution in EN and ID
    expect(resolveEntityLabel(brand, colorRef, 'en')).toBe('Primary Blue (#0055ff)');
    expect(resolveEntityLabel(brand, colorRef, 'id')).toBe('Biru Utama (#0055ff)');

    // 3. Rename the underlying color entity to "Brand Blue" WITHOUT touching the rule
    brand.modules.visualBasics.colors[0].name = {
      en: 'Brand Blue',
      id: 'Biru Merek'
    };

    // 4. Live resolution MUST return the new name "Brand Blue"
    const liveResolvedEn = resolveEntityLabel(brand, colorRef, 'en');
    const liveResolvedId = resolveEntityLabel(brand, colorRef, 'id');
    expect(liveResolvedEn).toBe('Brand Blue (#0055ff)');
    expect(liveResolvedId).toBe('Biru Merek (#0055ff)');
  });

  // --- 4. Messaging Cross-Reference Test ---
  it('4. Cross-references between Key Messages, Target Audiences, and Proof Points resolve dynamically', () => {
    const brand: Brand = JSON.parse(JSON.stringify(sampleBrand));
    brand.modules.positioning = {
      ...brand.modules.positioning!,
      targetAudiences: [
        {
          id: 'aud-special',
          name: { en: 'Design Enthusiasts', id: 'Pecinta Desain' }
        }
      ]
    };
    brand.modules.messaging = {
      ...brand.modules.messaging!,
      proofPoints: [
        {
          id: 'pp-special',
          claim: { en: '100% Recycled Oak Furniture', id: '100% Mebel Kayu Daur Ulang' }
        }
      ]
    };

    const km: KeyMessageEntity = {
      id: 'km-101',
      headline: { en: 'Spaces Designed for Mindful Work', id: 'Ruang untuk Kerja Tenang' },
      targetAudienceRef: {
        domain: 'foundation',
        entityType: 'targetAudience',
        entityId: 'aud-special'
      },
      proofPointRefs: [
        {
          domain: 'foundation',
          entityType: 'proofPoint',
          entityId: 'pp-special'
        }
      ]
    };

    // Resolve attached audience label
    const audLabel = resolveEntityLabel(brand, km.targetAudienceRef!, 'en');
    expect(audLabel).toBe('Design Enthusiasts');

    // Resolve attached proof point label
    const ppLabel = resolveEntityLabel(brand, km.proofPointRefs![0], 'en');
    expect(ppLabel).toBe('100% Recycled Oak Furniture');

    // Rename Audience
    brand.modules.positioning.targetAudiences[0].name = {
      en: 'Architects & Designers',
      id: 'Arsitek & Desainer'
    };
    expect(resolveEntityLabel(brand, km.targetAudienceRef!, 'en')).toBe('Architects & Designers');
    expect(resolveEntityLabel(brand, km.targetAudienceRef!, 'id')).toBe('Arsitek & Desainer');
  });

  // --- 5. Legacy Compatibility & Normalization Idempotency ---
  it('5. Legacy string arrays normalize cleanly and idempotency is preserved on multiple passes', () => {
    const legacyBrand: any = {
      id: 'legacy-1',
      name: 'Old Brand',
      modules: {
        strategy: {
          priorities: [
            { en: 'Priority 1', id: 'Prioritas 1' },
            { en: 'Priority 2', id: 'Prioritas 2' }
          ]
        },
        positioning: {
          targetAudience: { en: 'Urban Youth', id: 'Pemuda Kota' },
          differentiators: [
            { en: 'Fastest Roasting', id: 'Sangrai Tercepat' },
            { en: 'Free Wi-Fi', id: 'Wi-Fi Gratis' }
          ]
        },
        personality: {
          traits: [
            { en: 'Brave', id: 'Berani' },
            { en: 'Vibrant', id: 'Semarak' }
          ]
        },
        voiceTone: {
          wordsToUse: [{ en: 'Energize', id: 'Semangat' }],
          wordsToAvoid: [{ en: 'Sluggish', id: 'Lambat' }]
        },
        messaging: {
          keyMessages: [{ en: 'Best morning roast', id: 'Sangrai pagi terbaik' }],
          proofPoints: [{ en: 'Over 1M cups poured', id: 'Lebih dari 1 juta cangkir' }],
          callsToAction: [{ en: 'Order Now', id: 'Pesan Sekarang' }]
        }
      }
    };

    // First Pass Normalization
    const pass1 = normalizeBrandData(legacyBrand);

    expect(pass1.modules.strategy.priorities[0].id).toBeDefined();
    expect(pass1.modules.positioning.targetAudiences.length).toBe(1);
    expect(pass1.modules.positioning.targetAudiences[0].name.en).toBe('Primary Target Audience');
    expect(pass1.modules.positioning.targetAudiences[0].description.en).toBe('Urban Youth');
    expect(pass1.modules.positioning.differentiators.length).toBe(2);
    expect(pass1.modules.personality.traits.length).toBe(2);
    expect(pass1.modules.personality.traits[0].trait.en).toBe('Brave');
    expect(pass1.modules.voiceTone.vocabulary.length).toBe(2);
    expect(pass1.modules.voiceTone.vocabulary[0].recommendation).toBe('prefer');
    expect(pass1.modules.voiceTone.vocabulary[1].recommendation).toBe('avoid');
    expect(pass1.modules.messaging.keyMessages.length).toBe(1);
    expect(pass1.modules.messaging.keyMessages[0].headline.en).toBe('Best morning roast');

    const pass1AudienceId = pass1.modules.positioning.targetAudiences[0].id;
    const pass1TraitId = pass1.modules.personality.traits[0].id;

    // Second Pass Normalization (Idempotency)
    const pass2 = normalizeBrandData(pass1);

    expect(pass2.modules.positioning.targetAudiences[0].id).toBe(pass1AudienceId);
    expect(pass2.modules.personality.traits[0].id).toBe(pass1TraitId);
    expect(pass2.modules.positioning.targetAudiences.length).toBe(1);
    expect(pass2.modules.personality.traits.length).toBe(2);
    expect(pass2.modules.voiceTone.vocabulary.length).toBe(2);
  });

  // --- 6. Derived Reverse References (findBackReferences) ---
  it('6. Dynamically discovers backlinks without storing redundant arrays', () => {
    const brand: Brand = JSON.parse(JSON.stringify(sampleBrand));
    // Sample brand has km-1 pointing to aud-1 and pp-1
    const backRefsToAudience = findBackReferences(brand, 'aud-1');
    expect(backRefsToAudience.length).toBeGreaterThan(0);
    expect(backRefsToAudience.some((r) => r.sourceEntityType === 'keyMessage')).toBe(true);

    const backRefsToProofPoint = findBackReferences(brand, 'pp-1');
    expect(backRefsToProofPoint.length).toBeGreaterThan(0);
    expect(backRefsToProofPoint.some((r) => r.sourceEntityType === 'keyMessage')).toBe(true);
  });
});
