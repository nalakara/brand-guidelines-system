import {
  Brand,
  EntityReference,
  EntityDomain,
  EntityType,
  Language,
  getLocalizedText
} from '../types/brand';

export interface ReferenceableEntityItem {
  reference: EntityReference;
  name: string;
  categoryOrRole?: string;
  preview?: string;
}

/**
 * Aggregates all live referenceable entities across all Brand modules.
 */
export function getAvailableEntities(
  brand: Brand,
  filterDomain?: EntityDomain,
  filterType?: EntityType,
  lang: Language = 'en'
): ReferenceableEntityItem[] {
  if (!brand || !brand.modules) return [];

  const items: ReferenceableEntityItem[] = [];
  const { modules } = brand;

  // 1. Foundation: Strategic Values
  if (modules.strategy?.values) {
    modules.strategy.values.forEach((v) => {
      items.push({
        reference: {
          domain: 'foundation',
          entityType: 'strategyValue',
          entityId: v.id,
          label: getLocalizedText(v.title, lang).text || 'Strategic Value'
        },
        name: getLocalizedText(v.title, lang).text || 'Strategic Value',
        categoryOrRole: 'Strategy Value'
      });
    });
  }

  // 2. Foundation: Strategic Priorities
  if (modules.strategy?.priorities) {
    modules.strategy.priorities.forEach((p) => {
      items.push({
        reference: {
          domain: 'foundation',
          entityType: 'strategicPriority',
          entityId: p.id,
          label: getLocalizedText(p.title, lang).text || 'Strategic Priority'
        },
        name: getLocalizedText(p.title, lang).text || 'Strategic Priority',
        categoryOrRole: p.timeframe || 'Priority'
      });
    });
  }

  // 3. Foundation: Target Audiences
  if (modules.positioning?.targetAudiences) {
    modules.positioning.targetAudiences.forEach((aud) => {
      items.push({
        reference: {
          domain: 'foundation',
          entityType: 'targetAudience',
          entityId: aud.id,
          label: getLocalizedText(aud.name, lang).text || 'Target Audience'
        },
        name: getLocalizedText(aud.name, lang).text || 'Target Audience',
        categoryOrRole: 'Audience'
      });
    });
  }

  // 4. Foundation: Differentiators
  if (modules.positioning?.differentiators) {
    modules.positioning.differentiators.forEach((diff) => {
      items.push({
        reference: {
          domain: 'foundation',
          entityType: 'differentiator',
          entityId: diff.id,
          label: getLocalizedText(diff.title, lang).text || 'Differentiator'
        },
        name: getLocalizedText(diff.title, lang).text || 'Differentiator',
        categoryOrRole: 'Differentiator'
      });
    });
  }

  // 5. Foundation: Personality Traits
  if (modules.personality?.traits) {
    modules.personality.traits.forEach((t) => {
      items.push({
        reference: {
          domain: 'foundation',
          entityType: 'personalityTrait',
          entityId: t.id,
          label: getLocalizedText(t.trait, lang).text || 'Personality Trait'
        },
        name: getLocalizedText(t.trait, lang).text || 'Personality Trait',
        categoryOrRole: 'Trait'
      });
    });
  }

  // 6. Foundation: Voice Principles
  if (modules.voiceTone?.principles) {
    modules.voiceTone.principles.forEach((vp) => {
      items.push({
        reference: {
          domain: 'foundation',
          entityType: 'voicePrinciple',
          entityId: vp.id,
          label: getLocalizedText(vp.title, lang).text || 'Voice Principle'
        },
        name: getLocalizedText(vp.title, lang).text || 'Voice Principle',
        categoryOrRole: 'Voice Principle'
      });
    });
  }

  // 7. Foundation: Proof Points
  if (modules.messaging?.proofPoints) {
    modules.messaging.proofPoints.forEach((pp) => {
      items.push({
        reference: {
          domain: 'foundation',
          entityType: 'proofPoint',
          entityId: pp.id,
          label: getLocalizedText(pp.claim, lang).text || 'Proof Point'
        },
        name: getLocalizedText(pp.claim, lang).text || 'Proof Point',
        categoryOrRole: pp.category || 'Proof Point'
      });
    });
  }

  // 8. Visual Knowledge: Logos
  const visualBasics = modules.visualBasics || modules.visualKnowledge;
  if (visualBasics?.logos) {
    visualBasics.logos.forEach((l) => {
      items.push({
        reference: {
          domain: 'visualKnowledge',
          entityType: 'logo',
          entityId: l.id,
          label: l.name || 'Logo'
        },
        name: l.name || 'Logo',
        categoryOrRole: l.type
      });
    });
  }

  // 9. Visual Knowledge: Colors
  const colorsList: any[] = visualBasics?.colors || [
    ...(visualBasics?.primaryColors || []),
    ...(visualBasics?.secondaryColors || [])
  ];
  if (colorsList.length > 0) {
    colorsList.forEach((c) => {
      const colorName = typeof c.name === 'object' ? getLocalizedText(c.name, lang).text : (c.name || c.hex);
      const roleOrUsage = 'role' in c ? c.role : ('usage' in c && c.usage ? getLocalizedText(c.usage, lang).text : 'Color');
      items.push({
        reference: {
          domain: 'visualKnowledge',
          entityType: 'color',
          entityId: c.id,
          label: colorName
        },
        name: `${colorName} (${c.hex})`,
        categoryOrRole: roleOrUsage,
        preview: c.hex
      });
    });
  }

  // 10. Visual Knowledge: Fonts
  if (visualBasics?.fonts) {
    visualBasics.fonts.forEach((f) => {
      items.push({
        reference: {
          domain: 'visualKnowledge',
          entityType: 'font',
          entityId: f.id,
          label: f.name
        },
        name: f.name,
        categoryOrRole: f.role
      });
    });
  }

  // 11. Visual Assets
  if (modules.visualAssets) {
    modules.visualAssets.forEach((a) => {
      const firstFile = a.files[0];
      items.push({
        reference: {
          domain: 'visualAssets',
          entityType: 'asset',
          entityId: a.id,
          label: a.name
        },
        name: a.name,
        categoryOrRole: a.category,
        preview: firstFile?.dataUrl
      });
    });
  }

  // 12. Visual Rules
  if (modules.visualRules) {
    modules.visualRules.forEach((r) => {
      items.push({
        reference: {
          domain: 'visualRules',
          entityType: 'rule',
          entityId: r.id,
          label: r.name
        },
        name: r.name,
        categoryOrRole: `${r.context} · ${r.type}`
      });
    });
  }

  return items.filter((item) => {
    const matchesDomain = !filterDomain || item.reference.domain === filterDomain;
    const matchesType = !filterType || item.reference.entityType === filterType;
    return matchesDomain && matchesType;
  });
}

/**
 * Resolves a live human label for an EntityReference using the active brand's data.
 */
export function resolveEntityLabel(
  brand: Brand,
  ref: EntityReference,
  lang: Language = 'en'
): string {
  if (!brand || !ref) return ref?.label || '';

  const entities = getAvailableEntities(brand, undefined, undefined, lang);
  const match = entities.find(
    (e) => e.reference.entityId === ref.entityId && e.reference.entityType === ref.entityType
  );

  if (match) {
    return match.name || match.reference.label || match.reference.entityId;
  }

  // Fallback
  return ref.label || ref.entityId;
}

/**
 * Discovers any entity references across the brand that point to the target entityId.
 */
export function findBackReferences(
  brand: Brand,
  targetEntityId: string
): { sourceDomain: string; sourceEntityType: string; sourceName: string }[] {
  if (!brand || !brand.modules || !targetEntityId) return [];

  const results: { sourceDomain: string; sourceEntityType: string; sourceName: string }[] = [];
  const { modules } = brand;

  // Check Visual Rules
  if (modules.visualRules) {
    modules.visualRules.forEach((rule) => {
      if (rule.references?.some((r) => r.entityId === targetEntityId)) {
        results.push({
          sourceDomain: 'Visual Rules',
          sourceEntityType: 'rule',
          sourceName: rule.name
        });
      }
    });
  }

  // Check Messaging Key Messages
  if (modules.messaging?.keyMessages) {
    modules.messaging.keyMessages.forEach((km) => {
      if (
        km.targetAudienceRef?.entityId === targetEntityId ||
        km.proofPointRefs?.some((r) => r.entityId === targetEntityId)
      ) {
        results.push({
          sourceDomain: 'Brand Messaging',
          sourceEntityType: 'keyMessage',
          sourceName: getLocalizedText(km.headline, 'en').text || 'Key Message'
        });
      }
    });
  }

  return results;
}
