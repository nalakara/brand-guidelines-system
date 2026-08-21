/**
 * Phase 4.2A — Guidance Controller & State Integration Test Suite
 * 
 * Tests:
 * 1. Active stage detection based on active modules.
 * 2. Inactive modules do not become mandatory stages.
 * 3. Knowledge status vs Guidance interaction status separation.
 * 4. Advisory stage progress and composite percentage calculation.
 * 5. Deterministic recommendation of first relevant incomplete area.
 * 6. Legitimate feedback revisit suggestions (e.g. positioning -> personality, visual -> rules).
 * 7. Difficulty tier filtering (progressive disclosure without access locking).
 * 8. Experience mode stability & zero mutation of Brand Knowledge.
 * 9. Determinism: identical inputs yield identical outputs.
 */

import { describe, it, expect } from 'vitest';
import { Brand, BrandOverviewModule } from './types/brand';
import {
  getActiveStages,
  getTopicStatus,
  calculateStageProgress,
  getRevisitSuggestions,
  getRecommendedNext,
  evaluateGuidanceState,
  filterTopicsByDifficulty
} from './utils/guidanceController';
import { GUIDANCE_STAGES } from './data/guidanceContent';
import { sampleBrand } from './data/sampleBrand';
import { GuidanceInteractionState } from './types/guidance';

describe('Phase 4.2A — Guidance Controller & State Foundation', () => {
  const createEmptyBrand = (activeModules = ['overview', 'strategy', 'positioning']): Brand => ({
    id: 'test-brand-1',
    name: 'Empty Brand',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    activeModules: activeModules as any,
    modules: {}
  });

  it('1. Active Stage Detection: should detect stages containing active modules', () => {
    // Only overview & strategy active -> only Stage 1 active
    const stagesStage1Only = getActiveStages(['overview', 'strategy']);
    expect(stagesStage1Only).toHaveLength(1);
    expect(stagesStage1Only[0].id).toBe('stage1_discover');

    // Visual Identity Starter scope
    const starterScopeStages = getActiveStages([
      'overview',
      'visualKnowledge',
      'visualAssets',
      'visualRules',
      'brandExpression'
    ]);
    const starterStageIds = starterScopeStages.map((s) => s.id);
    expect(starterStageIds).toContain('stage1_discover');
    expect(starterStageIds).toContain('stage4_visual');
    expect(starterStageIds).toContain('stage5_govern');
    expect(starterStageIds).toContain('stage6_apply');
    expect(starterStageIds).not.toContain('stage2_position');
  });

  it('2. Inactive stages should evaluate to isActive: false and zero advisory penalty', () => {
    const brand = createEmptyBrand(['overview']); // Only Stage 1 active
    const stage2 = GUIDANCE_STAGES.find((s) => s.id === 'stage2_position')!;
    const progress = calculateStageProgress(brand, stage2);

    expect(progress.isActive).toBe(false);
    expect(progress.activeModuleIds).toHaveLength(0);
    expect(progress.advisoryPercentage).toBe(0);
  });

  it('3. Knowledge vs Guidance Separation: complete knowledge does not mutate guidance status', () => {
    // sampleBrand has complete overview & strategy
    const stage1 = GUIDANCE_STAGES[0];
    const interactionState: GuidanceInteractionState = {
      topicStatuses: {
        topic_brand_essence: 'viewed'
      }
    };

    const progress = calculateStageProgress(sampleBrand, stage1, interactionState);
    expect(progress.knowledgeStatus).toBe('complete');
    expect(progress.completedTopicsCount).toBe(0); // topic_brand_essence was only 'viewed', not 'completed'

    // Topic status is resolved independently
    expect(getTopicStatus('topic_brand_essence', interactionState)).toBe('viewed');
    expect(getTopicStatus('topic_operational_values', interactionState)).toBe('notStarted');
  });

  it('4. Topic Status Tracking: supports notStarted, viewed, workedOn, completed, skipped', () => {
    const interactionState: GuidanceInteractionState = {
      topicStatuses: {
        t1: 'notStarted',
        t2: 'viewed',
        t3: 'workedOn',
        t4: 'completed',
        t5: 'skipped'
      }
    };

    expect(getTopicStatus('t1', interactionState)).toBe('notStarted');
    expect(getTopicStatus('t2', interactionState)).toBe('viewed');
    expect(getTopicStatus('t3', interactionState)).toBe('workedOn');
    expect(getTopicStatus('t4', interactionState)).toBe('completed');
    expect(getTopicStatus('t5', interactionState)).toBe('skipped');
    expect(getTopicStatus('non_existent', interactionState)).toBe('notStarted');
  });

  it('5. Recommended Next: recommends the first incomplete active stage and module in order', () => {
    const emptyBrand = createEmptyBrand(['overview', 'strategy', 'positioning']);
    const recommendation = getRecommendedNext(emptyBrand);

    expect(recommendation).toBeDefined();
    expect(recommendation?.stageId).toBe('stage1_discover');
    expect(recommendation?.moduleId).toBe('overview');
    expect(recommendation?.reasonCode).toBe('firstIncompleteStage');
  });

  it('6. Revisit Engine: generates deterministic revisit suggestions without mutating data', () => {
    // Brand with positioning filled, but personality empty
    const brandWithPos: Brand = {
      id: 'b-pos',
      name: 'Positioned Brand',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      activeModules: ['overview', 'positioning', 'personality', 'visualKnowledge', 'visualRules'],
      modules: {
        positioning: {
          targetAudiences: [{ id: 'a1', name: { en: 'Audience 1' }, needsPainPoints: { en: 'Needs' } }],
          positioningStatement: { en: 'Statement' }
        }
      }
    };

    const revisits = getRevisitSuggestions(brandWithPos);
    expect(revisits.length).toBeGreaterThanOrEqual(1);

    const posToPersonality = revisits.find((r) => r.id === 'rev_positioning_to_personality');
    expect(posToPersonality).toBeDefined();
    expect(posToPersonality?.sourceModuleId).toBe('positioning');
    expect(posToPersonality?.targetModuleId).toBe('personality');
    expect(posToPersonality?.reasonCode).toBe('upstreamDependency');

    // Verify brand was not mutated
    expect(brandWithPos.modules.personality).toBeUndefined();
  });

  it('7. Difficulty Progressive Disclosure: filters topics appropriately while keeping advanced accessible', () => {
    const allTopics = GUIDANCE_STAGES.flatMap((s) => s.topics);

    // Beginner filter
    const beginnerView = filterTopicsByDifficulty(allTopics, 'beginner');
    expect(beginnerView.primary.every((t) => t.tier === 'beginner')).toBe(true);
    expect(beginnerView.advanced.length).toBeGreaterThan(0);

    // Intermediate filter
    const intermediateView = filterTopicsByDifficulty(allTopics, 'intermediate');
    expect(intermediateView.primary.every((t) => t.tier === 'beginner' || t.tier === 'intermediate')).toBe(true);

    // Advanced filter
    const advancedView = filterTopicsByDifficulty(allTopics, 'advanced');
    expect(advancedView.primary).toHaveLength(allTopics.length);
    expect(advancedView.advanced).toHaveLength(0);
  });

  it('8. Controller Determinism: identical inputs produce strictly identical outputs', () => {
    const brand = createEmptyBrand(['overview', 'strategy', 'positioning', 'visualKnowledge']);
    const stateA = evaluateGuidanceState(brand);
    const stateB = evaluateGuidanceState(brand);

    expect(stateA).toEqual(stateB);
    expect(stateA.activeStageId).toBe('stage1_discover');
    expect(stateA.stages).toHaveLength(6);
  });

  it('9. Zero Mutation: evaluating guidance state leaves Brand Knowledge completely unchanged', () => {
    const originalBrand = JSON.parse(JSON.stringify(sampleBrand));
    evaluateGuidanceState(sampleBrand);
    expect(sampleBrand).toEqual(originalBrand);
  });
});
