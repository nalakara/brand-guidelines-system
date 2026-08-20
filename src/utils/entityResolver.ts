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

  // 11. Visual Knowledge: Grid Systems
  if (visualBasics?.layoutComposition?.gridSystems) {
    visualBasics.layoutComposition.gridSystems.forEach((grid) => {
      const gridName = getLocalizedText(grid.name, lang).text || 'Grid System';
      items.push({
        reference: {
          domain: 'visualKnowledge',
          entityType: 'gridSystem',
          entityId: grid.id,
          label: gridName
        },
        name: grid.columns ? `${gridName} (${grid.columns} cols)` : gridName,
        categoryOrRole: grid.type ? `${grid.type.toUpperCase()} Grid` : 'Grid System'
      });
    });
  }

  // 12. Visual Knowledge: Layout Principles
  if (visualBasics?.layoutComposition?.layoutPrinciples) {
    visualBasics.layoutComposition.layoutPrinciples.forEach((lp) => {
      const lpTitle = getLocalizedText(lp.title, lang).text || 'Layout Principle';
      items.push({
        reference: {
          domain: 'visualKnowledge',
          entityType: 'layoutPrinciple',
          entityId: lp.id,
          label: lpTitle
        },
        name: lpTitle,
        categoryOrRole: `${lp.category.charAt(0).toUpperCase() + lp.category.slice(1)} Principle`
      });
    });
  }

  // 13. Visual Knowledge: Imagery Directions
  if (visualBasics?.imagery?.directions) {
    visualBasics.imagery.directions.forEach((d) => {
      const dirName = getLocalizedText(d.name, lang).text || 'Imagery Direction';
      items.push({
        reference: {
          domain: 'visualKnowledge',
          entityType: 'imageryDirection',
          entityId: d.id,
          label: dirName
        },
        name: dirName,
        categoryOrRole: d.category ? `${d.category.charAt(0).toUpperCase() + d.category.slice(1)} Direction` : 'Imagery Direction'
      });
    });
  }

  // 14. Visual Knowledge: Image Treatments
  if (visualBasics?.imagery?.treatments) {
    visualBasics.imagery.treatments.forEach((trm) => {
      const trmName = getLocalizedText(trm.name, lang).text || 'Image Treatment';
      items.push({
        reference: {
          domain: 'visualKnowledge',
          entityType: 'imageTreatment',
          entityId: trm.id,
          label: trmName
        },
        name: trmName,
        categoryOrRole: 'Image Treatment'
      });
    });
  }

  // 15. Visual Knowledge: Graphic Elements / Motifs
  if (visualBasics?.graphicLanguage?.elements) {
    visualBasics.graphicLanguage.elements.forEach((el) => {
      const elName = getLocalizedText(el.name, lang).text || 'Graphic Element';
      items.push({
        reference: {
          domain: 'visualKnowledge',
          entityType: 'graphicElement',
          entityId: el.id,
          label: elName
        },
        name: elName,
        categoryOrRole: el.category ? `${el.category.charAt(0).toUpperCase() + el.category.slice(1)} Motif` : 'Graphic Motif'
      });
    });
  }

  // 16. Visual Knowledge: Illustration Styles
  if (visualBasics?.graphicLanguage?.illustrationStyles) {
    visualBasics.graphicLanguage.illustrationStyles.forEach((il) => {
      const ilName = getLocalizedText(il.name, lang).text || 'Illustration Style';
      items.push({
        reference: {
          domain: 'visualKnowledge',
          entityType: 'illustrationStyle',
          entityId: il.id,
          label: ilName
        },
        name: ilName,
        categoryOrRole: 'Illustration Style'
      });
    });
  }

  // 17. Visual Knowledge: Iconography Systems
  if (visualBasics?.graphicLanguage?.iconSystems) {
    visualBasics.graphicLanguage.iconSystems.forEach((ic) => {
      const icName = getLocalizedText(ic.name, lang).text || 'Iconography System';
      items.push({
        reference: {
          domain: 'visualKnowledge',
          entityType: 'iconSystem',
          entityId: ic.id,
          label: icName
        },
        name: ic.gridSizePx ? `${icName} (${ic.gridSizePx}px)` : icName,
        categoryOrRole: 'Iconography System'
      });
    });
  }

  // 18. Visual Assets
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

  // 19. Visual Rules
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

  // 17. Brand Expression: Touchpoints (Level 3.1)
  if (modules.brandExpression?.touchpoints) {
    modules.brandExpression.touchpoints.forEach((tp) => {
      items.push({
        reference: {
          domain: 'brandExpression',
          entityType: 'touchpoint',
          entityId: tp.id,
          label: getLocalizedText(tp.name, lang).text || 'Touchpoint'
        },
        name: getLocalizedText(tp.name, lang).text || 'Touchpoint',
        categoryOrRole: tp.category
      });
    });
  }

  // 18. Foundation: Brand Naming Systems (Level 3.2)
  if (modules.brandNaming?.systems) {
    modules.brandNaming.systems.forEach((sys) => {
      items.push({
        reference: {
          domain: 'foundation',
          entityType: 'namingSystem',
          entityId: sys.id,
          label: getLocalizedText(sys.title, lang).text || 'Naming System'
        },
        name: getLocalizedText(sys.title, lang).text || 'Naming System',
        categoryOrRole: `${sys.tier} · ${sys.approach}`
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
): { sourceDomain: string; sourceEntityType: string; sourceName: string; referencerName?: string; referencerDomain?: string }[] {
  if (!brand || !brand.modules || !targetEntityId) return [];

  const results: { sourceDomain: string; sourceEntityType: string; sourceName: string; referencerName?: string; referencerDomain?: string }[] = [];
  const { modules } = brand;

  // Check Visual Rules
  if (modules.visualRules) {
    modules.visualRules.forEach((rule: any) => {
      const allRefs = rule.references || rule.relatedEntities || [];
      if (allRefs.some((r: any) => r.entityId === targetEntityId)) {
        results.push({
          sourceDomain: 'Visual Rules',
          sourceEntityType: 'rule',
          sourceName: rule.name,
          referencerName: rule.name,
          referencerDomain: 'visualRules'
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
        const headline = getLocalizedText(km.headline, 'en').text || 'Key Message';
        results.push({
          sourceDomain: 'Brand Messaging',
          sourceEntityType: 'keyMessage',
          sourceName: headline,
          referencerName: headline,
          referencerDomain: 'messaging'
        });
      }
    });
  }

  // Check Brand Expression Touchpoints (Level 3.1)
  if (modules.brandExpression?.touchpoints) {
    modules.brandExpression.touchpoints.forEach((tp) => {
      const allTpRefs = [
        ...(tp.appliedAssetRefs || []),
        ...(tp.appliedRuleRefs || []),
        ...(tp.governingEntityRefs || [])
      ];
      if (allTpRefs.some((r) => r.entityId === targetEntityId)) {
        const tpName = getLocalizedText(tp.name, 'en').text || 'Touchpoint';
        results.push({
          sourceDomain: 'Brand Expression',
          sourceEntityType: 'touchpoint',
          sourceName: tpName,
          referencerName: tpName,
          referencerDomain: 'brandExpression'
        });
      }
    });
  }

  // Check Brand Naming Systems (Level 3.2)
  if (modules.brandNaming?.systems) {
    modules.brandNaming.systems.forEach((sys) => {
      const allSysRefs = [
        ...(sys.governingRuleRefs || []),
        ...(sys.targetAudienceRefs || []),
        ...(sys.supportingMessageRefs || [])
      ];
      if (allSysRefs.some((r) => r.entityId === targetEntityId)) {
        const sysTitle = getLocalizedText(sys.title, 'en').text || 'Naming System';
        results.push({
          sourceDomain: 'Brand Naming',
          sourceEntityType: 'namingSystem',
          sourceName: sysTitle,
          referencerName: sysTitle,
          referencerDomain: 'brandNaming'
        });
      }
    });
  }

  return results;
}
