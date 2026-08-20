import {
  Brand,
  BrandModulesData,
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
  CTAEntity,
  GridSystemEntity,
  LayoutPrincipleEntity,
  SpacingScaleData,
  ImageryDirectionEntity,
  ImageTreatmentEntity,
  GraphicElementEntity,
  IllustrationStyleEntity,
  IconographySystemEntity,
  TouchpointEntity,
  NamingSystemEntity,
  BrandArchitectureNodeEntity,
  BrandRelationshipEntity,
  LocalizedString
} from '../types/brand';

/**
 * Idempotent, non-destructive normalizer for Brand data.
 * Ensures legacy saved brands in localStorage and sampleBrand instances
 * are safely upgraded to structured Brand Knowledge entities.
 */
export function normalizeBrandData(brand: Brand): Brand {
  if (!brand || !brand.modules) return brand;

  const modules: BrandModulesData = { ...brand.modules };

  // 1. Normalize Strategy
  if (modules.strategy) {
    const rawStrat: any = modules.strategy;
    const values: StrategicValueEntity[] = Array.isArray(rawStrat.values)
      ? rawStrat.values.map((v: any, idx: number) => ({
          id: v.id || `val-${idx + 1}`,
          title: typeof v.title === 'string' ? { en: v.title } : (v.title || { en: '', id: '' }),
          description: typeof v.description === 'string' ? { en: v.description } : (v.description || { en: '', id: '' }),
          tags: v.tags || []
        }))
      : [];

    const priorities: StrategicPriorityEntity[] = Array.isArray(rawStrat.priorities)
      ? rawStrat.priorities.map((p: any, idx: number) => {
          if (p && typeof p === 'object' && ('en' in p || 'id' in p) && !('title' in p)) {
            // Legacy LocalizedString priority
            return {
              id: `pri-${idx + 1}`,
              title: p,
              description: { en: '', id: '' },
              timeframe: 'Near-term'
            };
          }
          return {
            id: p.id || `pri-${idx + 1}`,
            title: p.title || { en: '', id: '' },
            description: p.description || { en: '', id: '' },
            timeframe: p.timeframe || 'Near-term'
          };
        })
      : [];

    modules.strategy = {
      purpose: rawStrat.purpose || { en: '', id: '' },
      mission: rawStrat.mission || { en: '', id: '' },
      vision: rawStrat.vision || { en: '', id: '' },
      values,
      priorities
    };
  }

  // 2. Normalize Positioning
  if (modules.positioning) {
    const rawPos: any = modules.positioning;
    let targetAudiences: AudienceEntity[] = [];

    if (Array.isArray(rawPos.targetAudiences) && rawPos.targetAudiences.length > 0) {
      targetAudiences = rawPos.targetAudiences.map((aud: any, idx: number) => ({
        id: aud.id || `aud-${idx + 1}`,
        name: aud.name || { en: '', id: '' },
        description: aud.description || { en: '', id: '' },
        needsPainPoints: aud.needsPainPoints || { en: '', id: '' }
      }));
    } else if (rawPos.targetAudience && (rawPos.targetAudience.en || rawPos.targetAudience.id)) {
      // Legacy single targetAudience field migration
      targetAudiences = [
        {
          id: 'aud-1',
          name: { en: 'Primary Target Audience', id: 'Target Audiens Utama' },
          description: rawPos.targetAudience,
          needsPainPoints: { en: '', id: '' }
        }
      ];
    }

    const differentiators: DifferentiatorEntity[] = Array.isArray(rawPos.differentiators)
      ? rawPos.differentiators.map((diff: any, idx: number) => {
          if (diff && typeof diff === 'object' && ('en' in diff || 'id' in diff) && !('title' in diff)) {
            // Legacy LocalizedString diff
            return {
              id: `diff-${idx + 1}`,
              title: diff,
              description: { en: '', id: '' },
              evidence: { en: '', id: '' }
            };
          }
          return {
            id: diff.id || `diff-${idx + 1}`,
            title: diff.title || { en: '', id: '' },
            description: diff.description || { en: '', id: '' },
            evidence: diff.evidence || { en: '', id: '' }
          };
        })
      : [];

    modules.positioning = {
      targetAudiences,
      marketCategory: rawPos.marketCategory || { en: '', id: '' },
      coreProblem: rawPos.coreProblem || { en: '', id: '' },
      differentiators,
      competitiveAlternatives: rawPos.competitiveAlternatives || { en: '', id: '' },
      positioningStatement: rawPos.positioningStatement || { en: '', id: '' }
    };
  }

  // 3. Normalize Personality
  if (modules.personality) {
    const rawPers: any = modules.personality;
    const traits: PersonalityTraitEntity[] = Array.isArray(rawPers.traits)
      ? rawPers.traits.map((t: any, idx: number) => {
          if (t && typeof t === 'object' && ('en' in t || 'id' in t) && !('trait' in t)) {
            // Legacy LocalizedString trait
            return {
              id: `trait-${idx + 1}`,
              trait: t,
              definition: { en: '', id: '' },
              spectrumPosition: 50
            };
          }
          return {
            id: t.id || `trait-${idx + 1}`,
            trait: t.trait || { en: '', id: '' },
            definition: t.definition || { en: '', id: '' },
            spectrumPosition: typeof t.spectrumPosition === 'number' ? t.spectrumPosition : 50
          };
        })
      : [];

    const weAreWeAreNot: WeArePairEntity[] = Array.isArray(rawPers.weAreWeAreNot)
      ? rawPers.weAreWeAreNot.map((pair: any, idx: number) => ({
          id: pair.id || `pair-${idx + 1}`,
          weAre: pair.weAre || { en: '', id: '' },
          weAreNot: pair.weAreNot || { en: '', id: '' },
          rationale: pair.rationale || { en: '', id: '' }
        }))
      : [];

    modules.personality = {
      traits,
      sliders: rawPers.sliders || {
        classicToModern: 50,
        seriousToPlayful: 50,
        reservedToExpressive: 50,
        practicalToVisionary: 50
      },
      archetype: rawPers.archetype || { en: '', id: '' },
      weAreWeAreNot
    };
  }

  // 4. Normalize Voice & Tone
  if (modules.voiceTone) {
    const rawVoice: any = modules.voiceTone;
    const principles: VoicePrincipleEntity[] = Array.isArray(rawVoice.principles)
      ? rawVoice.principles.map((pr: any, idx: number) => {
          if (pr && typeof pr === 'object' && ('en' in pr || 'id' in pr) && !('title' in pr)) {
            // Legacy LocalizedString principle
            return {
              id: `vp-${idx + 1}`,
              title: pr,
              description: { en: '', id: '' },
              doExample: { en: '', id: '' },
              dontExample: { en: '', id: '' }
            };
          }
          return {
            id: pr.id || `vp-${idx + 1}`,
            title: pr.title || { en: '', id: '' },
            description: pr.description || { en: '', id: '' },
            doExample: pr.doExample || { en: '', id: '' },
            dontExample: pr.dontExample || { en: '', id: '' }
          };
        })
      : [];

    let vocabulary: VocabularyEntity[] = [];
    if (Array.isArray(rawVoice.vocabulary)) {
      vocabulary = rawVoice.vocabulary.map((voc: any, idx: number) => ({
        id: voc.id || `voc-${idx + 1}`,
        term: voc.term || { en: '', id: '' },
        recommendation: voc.recommendation || 'prefer',
        context: voc.context || { en: '', id: '' }
      }));
    } else {
      // Legacy wordsToUse / wordsToAvoid migration
      if (Array.isArray(rawVoice.wordsToUse)) {
        rawVoice.wordsToUse.forEach((word: LocalizedString, idx: number) => {
          vocabulary.push({
            id: `voc-use-${idx + 1}`,
            term: word,
            recommendation: 'prefer',
            context: { en: '', id: '' }
          });
        });
      }
      if (Array.isArray(rawVoice.wordsToAvoid)) {
        rawVoice.wordsToAvoid.forEach((word: LocalizedString, idx: number) => {
          vocabulary.push({
            id: `voc-avoid-${idx + 1}`,
            term: word,
            recommendation: 'avoid',
            context: { en: '', id: '' }
          });
        });
      }
    }

    const examples: WritingExampleEntity[] = Array.isArray(rawVoice.examples)
      ? rawVoice.examples.map((ex: any, idx: number) => ({
          id: ex.id || `ex-${idx + 1}`,
          context: ex.context || { en: '', id: '' },
          before: ex.before || { en: '', id: '' },
          after: ex.after || { en: '', id: '' },
          explanation: ex.explanation || { en: '', id: '' }
        }))
      : [];

    modules.voiceTone = {
      principles,
      toneGuidelines: rawVoice.toneGuidelines || { en: '', id: '' },
      vocabulary,
      examples,
      channelNotes: rawVoice.channelNotes || []
    };
  }

  // 5. Normalize Messaging
  if (modules.messaging) {
    const rawMsg: any = modules.messaging;
    const keyMessages: KeyMessageEntity[] = Array.isArray(rawMsg.keyMessages)
      ? rawMsg.keyMessages.map((km: any, idx: number) => {
          if (km && typeof km === 'object' && ('en' in km || 'id' in km) && !('headline' in km)) {
            // Legacy LocalizedString key message
            return {
              id: `km-${idx + 1}`,
              headline: km,
              narrative: { en: '', id: '' }
            };
          }
          return {
            id: km.id || `km-${idx + 1}`,
            headline: km.headline || { en: '', id: '' },
            narrative: km.narrative || { en: '', id: '' },
            targetAudienceRef: km.targetAudienceRef,
            proofPointRefs: km.proofPointRefs
          };
        })
      : [];

    const proofPoints: ProofPointEntity[] = Array.isArray(rawMsg.proofPoints)
      ? rawMsg.proofPoints.map((pp: any, idx: number) => {
          if (pp && typeof pp === 'object' && ('en' in pp || 'id' in pp) && !('claim' in pp)) {
            // Legacy LocalizedString proof point
            return {
              id: `pp-${idx + 1}`,
              claim: pp,
              evidence: { en: '', id: '' }
            };
          }
          return {
            id: pp.id || `pp-${idx + 1}`,
            claim: pp.claim || { en: '', id: '' },
            evidence: pp.evidence || { en: '', id: '' },
            category: pp.category
          };
        })
      : [];

    const callsToAction: CTAEntity[] = Array.isArray(rawMsg.callsToAction)
      ? rawMsg.callsToAction.map((cta: any, idx: number) => {
          if (cta && typeof cta === 'object' && ('en' in cta || 'id' in cta) && !('label' in cta)) {
            // Legacy LocalizedString CTA
            return {
              id: `cta-${idx + 1}`,
              label: cta,
              contextChannel: ''
            };
          }
          return {
            id: cta.id || `cta-${idx + 1}`,
            label: cta.label || { en: '', id: '' },
            contextChannel: cta.contextChannel || ''
          };
        })
      : [];

    modules.messaging = {
      ...rawMsg,
      keyMessages,
      proofPoints,
      callsToAction
    };
  }

  // 6. Normalize Visual Knowledge (Layout, Imagery, Graphic Language)
  const visualModule = modules.visualBasics || modules.visualKnowledge;
  if (visualModule) {
    const rawVisual: any = visualModule;

    // A. Layout & Composition
    const rawLayout: any = rawVisual.layoutComposition || {};
    let gridSystems: GridSystemEntity[] = Array.isArray(rawLayout.gridSystems)
      ? rawLayout.gridSystems.map((g: any, idx: number) => ({
          id: g.id || `grid-${idx + 1}`,
          name: g.name || { en: 'Primary Grid System' },
          type: g.type || 'column',
          columns: g.columns,
          gutterPx: g.gutterPx,
          marginPx: g.marginPx,
          contextChannel: g.contextChannel || '',
          description: g.description || { en: '', id: '' }
        }))
      : [];

    // Legacy grid migration without fabricating knowledge
    if (gridSystems.length === 0 && rawLayout.grid && (rawLayout.grid.columns || rawLayout.grid.description?.en || rawLayout.grid.description?.id)) {
      gridSystems = [
        {
          id: 'grid-1',
          name: { en: 'Primary Grid System', id: 'Sistem Grid Utama' },
          type: rawLayout.grid.type || 'column',
          columns: rawLayout.grid.columns,
          gutterPx: rawLayout.grid.gutterPx,
          marginPx: rawLayout.grid.marginPx,
          contextChannel: 'General Layout',
          description: rawLayout.grid.description || { en: '', id: '' }
        }
      ];
    }

    let layoutPrinciples: LayoutPrincipleEntity[] = Array.isArray(rawLayout.layoutPrinciples)
      ? rawLayout.layoutPrinciples.map((lp: any, idx: number) => ({
          id: lp.id || `lp-${idx + 1}`,
          title: lp.title || { en: 'Layout Principle' },
          category: lp.category || 'composition',
          description: lp.description || { en: '', id: '' },
          guidance: lp.guidance || { en: '', id: '' }
        }))
      : [];

    // Legacy proportion/hierarchy principles migration
    if (layoutPrinciples.length === 0) {
      if (rawLayout.hierarchy?.description?.en || rawLayout.hierarchy?.description?.id) {
        layoutPrinciples.push({
          id: 'lp-hierarchy-1',
          title: { en: 'Visual Hierarchy', id: 'Hierarki Visual' },
          category: 'hierarchy',
          description: rawLayout.hierarchy.description,
          guidance: { en: '', id: '' }
        });
      }
      if (rawLayout.compositionPrinciples?.description?.en || rawLayout.compositionPrinciples?.description?.id) {
        layoutPrinciples.push({
          id: 'lp-comp-1',
          title: { en: 'Composition Discipline', id: 'Disiplin Komposisi' },
          category: 'composition',
          description: rawLayout.compositionPrinciples.description,
          guidance: { en: '', id: '' }
        });
      }
    }

    const spacingScale: SpacingScaleData = rawLayout.spacingScale || {
      baseUnitPx: rawLayout.spacing?.baseUnitPx,
      scaleSteps: rawLayout.spacingScale?.scaleSteps, // Preserve explicit scale steps only; never fabricate
      description: rawLayout.spacing?.description || { en: '', id: '' }
    };

    rawVisual.layoutComposition = {
      ...rawLayout,
      gridSystems,
      layoutPrinciples,
      spacingScale
    };

    // B. Imagery & Photography
    const rawImagery: any = rawVisual.imagery || {};
    let directions: ImageryDirectionEntity[] = Array.isArray(rawImagery.directions)
      ? rawImagery.directions.map((d: any, idx: number) => ({
          id: d.id || `img-dir-${idx + 1}`,
          name: d.name || { en: 'Primary Imagery Direction' },
          category: d.category || 'photography',
          description: d.description || { en: '', id: '' },
          mood: d.mood || [],
          subjects: d.subjects || [],
          lighting: d.lighting || [],
          composition: d.composition || [],
          doGuidance: d.doGuidance || { en: '', id: '' },
          dontGuidance: d.dontGuidance || { en: '', id: '' }
        }))
      : [];

    // Legacy photography migration
    if (directions.length === 0 && rawImagery.photography && (rawImagery.photography.description?.en || rawImagery.photography.description?.id || rawImagery.photography.mood?.length)) {
      directions = [
        {
          id: 'img-dir-1',
          name: { en: 'Core Photography Style', id: 'Gaya Fotografi Utama' },
          category: 'photography',
          description: rawImagery.photography.description || { en: '', id: '' },
          mood: rawImagery.photography.mood || [],
          subjects: rawImagery.photography.subjects || [],
          lighting: rawImagery.photography.lighting || [],
          composition: rawImagery.photography.composition || [],
          doGuidance: { en: '', id: '' },
          dontGuidance: { en: '', id: '' }
        }
      ];
    }

    let treatments: ImageTreatmentEntity[] = Array.isArray(rawImagery.treatments)
      ? rawImagery.treatments.map((trm: any, idx: number) => ({
          id: trm.id || `img-trm-${idx + 1}`,
          name: trm.name || { en: 'Color Treatment' },
          description: trm.description || { en: '', id: '' },
          colorTreatment: trm.colorTreatment || [],
          filterNotes: trm.filterNotes || { en: '', id: '' }
        }))
      : [];

    if (treatments.length === 0 && (rawImagery.photography?.colorTreatment?.length || rawImagery.artDirection?.treatment?.en)) {
      treatments = [
        {
          id: 'img-trm-1',
          name: { en: 'Signature Image Treatment', id: 'Perlakuan Gambar Khas' },
          description: rawImagery.artDirection?.treatment || { en: '', id: '' },
          colorTreatment: rawImagery.photography?.colorTreatment || []
        }
      ];
    }

    rawVisual.imagery = {
      ...rawImagery,
      directions,
      treatments
    };

    // C. Graphic Language
    const rawGL: any = rawVisual.graphicLanguage || {};
    let elements: GraphicElementEntity[] = Array.isArray(rawGL.elements)
      ? rawGL.elements.map((el: any, idx: number) => ({
          id: el.id || `ge-${idx + 1}`,
          name: el.name || { en: 'Graphic Element' },
          category: el.category || 'pattern',
          description: el.description || { en: '', id: '' },
          characteristics: el.characteristics || [],
          usageNotes: el.usageNotes || { en: '', id: '' }
        }))
      : [];

    let illustrationStyles: IllustrationStyleEntity[] = Array.isArray(rawGL.illustrationStyles)
      ? rawGL.illustrationStyles.map((il: any, idx: number) => ({
          id: il.id || `illus-${idx + 1}`,
          name: il.name || { en: 'Illustration Style' },
          style: il.style || [],
          subjects: il.subjects || [],
          description: il.description || { en: '', id: '' },
          treatment: il.treatment || { en: '', id: '' }
        }))
      : [];

    if (illustrationStyles.length === 0 && rawGL.illustration && (rawGL.illustration.description?.en || rawGL.illustration.style?.length)) {
      illustrationStyles = [
        {
          id: 'illus-1',
          name: { en: 'Primary Illustration Direction', id: 'Arah Ilustrasi Utama' },
          style: rawGL.illustration.style || [],
          subjects: rawGL.illustration.subject || [],
          description: rawGL.illustration.description || { en: '', id: '' },
          treatment: rawGL.illustration.treatment || { en: '', id: '' }
        }
      ];
    }

    let iconSystems: IconographySystemEntity[] = Array.isArray(rawGL.iconSystems)
      ? rawGL.iconSystems.map((ic: any, idx: number) => ({
          id: ic.id || `icon-sys-${idx + 1}`,
          name: ic.name || { en: 'Iconography System' },
          style: ic.style || [],
          gridSizePx: ic.gridSizePx,
          strokeWidthPx: ic.strokeWidthPx,
          description: ic.description || { en: '', id: '' },
          cornerTreatment: ic.cornerTreatment || 'rounded'
        }))
      : [];

    if (iconSystems.length === 0 && rawGL.iconography && (rawGL.iconography.description?.en || rawGL.iconography.characteristics?.length)) {
      iconSystems = [
        {
          id: 'icon-sys-1',
          name: { en: 'Core Icon System', id: 'Sistem Ikon Utama' },
          style: rawGL.iconography.characteristics || ['Outline'],
          gridSizePx: 24,
          strokeWidthPx: 2,
          description: rawGL.iconography.description || { en: '', id: '' },
          cornerTreatment: 'rounded'
        }
      ];
    }

    rawVisual.graphicLanguage = {
      ...rawGL,
      elements,
      illustrationStyles,
      iconSystems
    };

    if (modules.visualBasics) modules.visualBasics = rawVisual;
    if (modules.visualKnowledge) modules.visualKnowledge = rawVisual;
  }

  // 10. Normalize Brand Expression (Level 3.1)
  if (modules.brandExpression || brand.activeModules?.includes('brandExpression')) {
    const rawExpr: any = modules.brandExpression || {};
    const touchpoints: TouchpointEntity[] = Array.isArray(rawExpr.touchpoints)
      ? rawExpr.touchpoints.map((tp: any, idx: number) => ({
          id: tp.id || `tp-${idx + 1}`,
          name: tp.name || { en: 'Touchpoint', id: 'Titik Sentuh' },
          category: tp.category || 'custom',
          channelContext: tp.channelContext || '',
          description: tp.description || { en: '', id: '' },
          specifications: tp.specifications
            ? {
                dimensions: tp.specifications.dimensions || '',
                aspectRatio: tp.specifications.aspectRatio || '',
                colorSpace: tp.specifications.colorSpace,
                materialsFinish: tp.specifications.materialsFinish || { en: '', id: '' },
                safeZonePadding: tp.specifications.safeZonePadding || '',
                productionNotes: tp.specifications.productionNotes || { en: '', id: '' }
              }
            : undefined,
          guidelines: tp.guidelines
            ? {
                doCopy: tp.guidelines.doCopy || { en: '', id: '' },
                dontCopy: tp.guidelines.dontCopy || { en: '', id: '' }
              }
            : undefined,
          appliedAssetRefs: Array.isArray(tp.appliedAssetRefs) ? tp.appliedAssetRefs : [],
          appliedRuleRefs: Array.isArray(tp.appliedRuleRefs) ? tp.appliedRuleRefs : [],
          governingEntityRefs: Array.isArray(tp.governingEntityRefs) ? tp.governingEntityRefs : []
        }))
      : [];

    modules.brandExpression = {
      overview: rawExpr.overview || { en: '', id: '' },
      touchpoints
    };
  }

  // 11. Normalize Brand Naming (Level 3.2)
  if (modules.brandNaming || brand.activeModules?.includes('brandNaming')) {
    const rawNaming: any = modules.brandNaming || {};
    const systems: NamingSystemEntity[] = Array.isArray(rawNaming.systems)
      ? rawNaming.systems.map((sys: any, idx: number) => ({
          id: sys.id || `name-sys-${idx + 1}`,
          title: sys.title || { en: 'Naming System', id: 'Sistem Penamaan' },
          tier: sys.tier || 'productTier',
          approach: sys.approach || 'descriptive',
          formula: Array.isArray(sys.formula)
            ? sys.formula.map((step: any) => ({
                role: step.role || 'descriptor',
                label: step.label || { en: '', id: '' },
                required: typeof step.required === 'boolean' ? step.required : true
              }))
            : [],
          principles: sys.principles || { en: '', id: '' },
          examples: {
            approved: Array.isArray(sys.examples?.approved) ? sys.examples.approved : [],
            prohibited: Array.isArray(sys.examples?.prohibited) ? sys.examples.prohibited : [],
            rationale: sys.examples?.rationale || { en: '', id: '' }
          },
          governingRuleRefs: Array.isArray(sys.governingRuleRefs) ? sys.governingRuleRefs : [],
          targetAudienceRefs: Array.isArray(sys.targetAudienceRefs) ? sys.targetAudienceRefs : [],
          supportingMessageRefs: Array.isArray(sys.supportingMessageRefs) ? sys.supportingMessageRefs : []
        }))
      : [];

    modules.brandNaming = {
      principlesOverview: rawNaming.principlesOverview || { en: '', id: '' },
      systems
    };
  }

  // 12. Normalize Brand Architecture (Level 3.3)
  if (modules.brandArchitecture || brand.activeModules?.includes('brandArchitecture')) {
    const rawArch: any = modules.brandArchitecture || {};

    // Normalize nodes (no synthetic nodes fabricated)
    const rawNodes: any[] = Array.isArray(rawArch.nodes) ? rawArch.nodes : [];
    const validNodeIds = new Set<string>();

    const nodes: BrandArchitectureNodeEntity[] = rawNodes.map((n: any, idx: number) => {
      const id = n.id || `node-${idx + 1}`;
      validNodeIds.add(id);

      const nameVal: any = n.name;
      const normalizedName = typeof nameVal === 'object' && nameVal !== null
        ? { en: nameVal.en || '', id: nameVal.id || '' }
        : { en: typeof nameVal === 'string' ? nameVal : '', id: typeof nameVal === 'string' ? nameVal : '' };

      return {
        id,
        name: normalizedName,
        nodeType: n.nodeType || 'subBrand',
        status: n.status || 'active',
        description: n.description || { en: '', id: '' },
        targetMarketOrAudience: n.targetMarketOrAudience || { en: '', id: '' },
        governingRuleRefs: Array.isArray(n.governingRuleRefs) ? n.governingRuleRefs : [],
        targetAudienceRefs: Array.isArray(n.targetAudienceRefs) ? n.targetAudienceRefs : []
      };
    });

    // Normalize relationships with foundational graph integrity rules:
    // 1. Must reference existing nodes (sourceNodeId & targetNodeId in validNodeIds)
    // 2. Prevent self-reference (sourceNodeId !== targetNodeId)
    // 3. Deduplicate exact duplicate directed edges (same source, target, relationshipType)
    const rawRelationships: any[] = Array.isArray(rawArch.relationships) ? rawArch.relationships : [];
    const seenEdges = new Set<string>();

    const relationships: BrandRelationshipEntity[] = [];

    rawRelationships.forEach((rel: any, idx: number) => {
      const sourceNodeId = rel.sourceNodeId;
      const targetNodeId = rel.targetNodeId;
      const relationshipType = rel.relationshipType || 'parentOf';

      // Graph Rule 1: Both nodes must exist if nodes are defined
      if (validNodeIds.size > 0 && (!validNodeIds.has(sourceNodeId) || !validNodeIds.has(targetNodeId))) {
        return; // Ignore dangling edge
      }

      // Graph Rule 2: No self-references
      if (sourceNodeId && targetNodeId && sourceNodeId === targetNodeId) {
        return; // Ignore self loop
      }

      // Graph Rule 3: Deduplicate exact directed edge
      const edgeKey = `${sourceNodeId}->${targetNodeId}:${relationshipType}`;
      if (seenEdges.has(edgeKey)) {
        return; // Ignore duplicate relationship
      }
      seenEdges.add(edgeKey);

      relationships.push({
        id: rel.id || `rel-${idx + 1}`,
        sourceNodeId: sourceNodeId || '',
        targetNodeId: targetNodeId || '',
        relationshipType,
        coupling: rel.coupling || 'monolithic',
        endorsementRuleNotes: rel.endorsementRuleNotes || { en: '', id: '' },
        governingRuleRefs: Array.isArray(rel.governingRuleRefs) ? rel.governingRuleRefs : [],
        sharedAssetRefs: Array.isArray(rel.sharedAssetRefs) ? rel.sharedAssetRefs : []
      });
    });

    modules.brandArchitecture = {
      strategyOverview: rawArch.strategyOverview || { en: '', id: '' },
      strategyType: rawArch.strategyType || 'hybrid',
      nodes,
      relationships
    };
  }

  return {
    ...brand,
    modules
  };
}
