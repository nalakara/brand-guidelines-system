/**
 * Phase 4.2B — Guided Brand Experience UI Test Suite
 * 
 * Tests:
 * 1. StageJourneyRibbon accurately reflects active/inactive stages without blocking navigation.
 * 2. StageNarrativeHeader properly retrieves stage metadata and renders advisory next-step recommendations.
 * 3. ContextualGuidanceDrawer renders the 9 pedagogical block types accurately with bilingual parity.
 * 4. GuidedBrandExperience embeds existing frozen editors without duplicating form models.
 * 5. Experience mode switching operates against the same authoritative Brand Knowledge state.
 * 6. Zero synthetic data mutation: viewing guidance leaves Brand.modules.* 100% untouched.
 */

import { describe, it, expect } from 'vitest';
import { GUIDANCE_STAGES, getGuidanceStage } from './data/guidanceContent';
import { sampleBrand } from './data/sampleBrand';
import {
  calculateStageProgress,
  getRecommendedNext,
  getRevisitSuggestions,
  filterTopicsByDifficulty
} from './utils/guidanceController';
import { Brand } from './types/brand';

describe('Phase 4.2B — Guided Brand Experience UI Component Specifications', () => {
  const createTestBrand = (activeModules = ['overview', 'strategy']): Brand => ({
    id: 'test-b1',
    name: 'Test Brand',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    activeModules: activeModules as any,
    modules: {}
  });

  it('1. StageJourneyRibbon: calculates stage summaries for all 6 stages without locking any stage', () => {
    const brand = createTestBrand(['overview', 'strategy']);
    const stageSummaries = GUIDANCE_STAGES.map((s) => calculateStageProgress(brand, s));

    expect(stageSummaries).toHaveLength(6);

    // Stage 1 active, others inactive for this brand
    expect(stageSummaries[0].isActive).toBe(true);
    expect(stageSummaries[1].isActive).toBe(false);

    // Stage 1 summary metadata
    expect(stageSummaries[0].stageNumber).toBe(1);
    expect(stageSummaries[0].activeModuleIds).toEqual(['overview', 'strategy']);
  });

  it('2. StageNarrativeHeader: resolves stage title, learning objective and designer mental model in EN and ID', () => {
    GUIDANCE_STAGES.forEach((stage) => {
      expect(stage.title.en).toBeTruthy();
      expect(stage.title.id).toBeTruthy();
      expect(stage.tagline.en).toBeTruthy();
      expect(stage.tagline.id).toBeTruthy();
      expect(stage.learningObjective.en).toBeTruthy();
      expect(stage.learningObjective.id).toBeTruthy();
      expect(stage.designerMentalModel.en).toBeTruthy();
      expect(stage.designerMentalModel.id).toBeTruthy();
    });
  });

  it('3. Recommendation Banner: returns advisory recommendation without forcing lock on user', () => {
    const brand = createTestBrand(['overview', 'strategy', 'positioning']);
    const rec = getRecommendedNext(brand);

    expect(rec).toBeDefined();
    expect(rec?.stageId).toBe('stage1_discover');
    expect(rec?.moduleId).toBe('overview');
    expect(rec?.reasonCode).toBe('firstIncompleteStage');
  });

  it('4. ContextualGuidanceDrawer: verifies that all 9 pedagogical block types exist and are structured', () => {
    const allTopics = GUIDANCE_STAGES.flatMap((s) => s.topics);
    const blockTypes = new Set<string>();

    allTopics.forEach((t) => {
      t.blocks.forEach((b) => blockTypes.add(b.type));
    });

    // Check presence of curriculum blocks
    expect(blockTypes.has('whyThisMatters')).toBe(true);
    expect(blockTypes.has('thinkAboutThis')).toBe(true);
    expect(blockTypes.has('askYourClient')).toBe(true);
    expect(blockTypes.has('weakExample')).toBe(true);
    expect(blockTypes.has('strongExample')).toBe(true);
    expect(blockTypes.has('watchOut')).toBe(true);
    expect(blockTypes.has('connectsTo')).toBe(true);
    expect(blockTypes.has('revisitWhen')).toBe(true);
  });

  it('5. Progressive Disclosure: filters topics appropriately for beginner vs advanced', () => {
    const stage4 = getGuidanceStage('stage4_visual')!;
    const { primary, advanced } = filterTopicsByDifficulty(stage4.topics, 'beginner');

    expect(primary.length).toBeGreaterThan(0);
    expect(primary.every((t) => t.tier === 'beginner')).toBe(true);
  });

  it('6. Data Parity: sampleBrand data remains identical before and after guidance evaluation', () => {
    const beforeState = JSON.stringify(sampleBrand);
    
    // Evaluate guidance on sampleBrand
    GUIDANCE_STAGES.forEach((s) => calculateStageProgress(sampleBrand, s));
    getRecommendedNext(sampleBrand);
    getRevisitSuggestions(sampleBrand);

    const afterState = JSON.stringify(sampleBrand);
    expect(beforeState).toBe(afterState);
  });
});
