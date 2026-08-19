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
      tagline: rawMsg.tagline || { en: '', id: '' },
      elevatorPitch: rawMsg.elevatorPitch || { en: '', id: '' },
      keyMessages,
      proofPoints,
      callsToAction
    };
  }

  return {
    ...brand,
    modules
  };
}
