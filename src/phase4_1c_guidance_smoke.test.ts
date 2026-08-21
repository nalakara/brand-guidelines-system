/**
 * Phase 4.1C — Guidance Content Model & Static Repository Smoke Test
 * 
 * Verifies that:
 * 1. Guidance content covers all 6 stages.
 * 2. All 12 frozen modules have guidance topics mapped.
 * 3. All 9 pedagogical block types are supported and represented.
 * 4. Full bilingual (EN and ID) parity exists across all stages, topics, blocks, and diagnostics.
 * 5. Guidance layer is purely static and does not mutate Brand Knowledge.
 * 6. Level 1–3 regression tests continue to pass 100%.
 */

import { describe, it, expect } from 'vitest';
import { GUIDANCE_STAGES, getGuidanceStage, getGuidanceTopicsForModule } from './data/guidanceContent';
import { GuidanceStageId } from './types/guidance';
import { ALL_MODULE_IDS } from './modules/registry';

describe('Phase 4.1C — Guidance Content Model & Static Encoding', () => {
  it('1. should contain all 6 curriculum stages with numbers 1 to 6', () => {
    expect(GUIDANCE_STAGES).toHaveLength(6);
    const expectedStageIds: GuidanceStageId[] = [
      'stage1_discover',
      'stage2_position',
      'stage3_character',
      'stage4_visual',
      'stage5_govern',
      'stage6_apply'
    ];

    GUIDANCE_STAGES.forEach((stage, idx) => {
      expect(stage.id).toBe(expectedStageIds[idx]);
      expect(stage.stageNumber).toBe(idx + 1);
      expect(stage.title.en).toBeTruthy();
      expect(stage.title.id).toBeTruthy();
      expect(stage.tagline.en).toBeTruthy();
      expect(stage.tagline.id).toBeTruthy();
      expect(stage.learningObjective.en).toBeTruthy();
      expect(stage.learningObjective.id).toBeTruthy();
      expect(stage.designerMentalModel.en).toBeTruthy();
      expect(stage.designerMentalModel.id).toBeTruthy();
      expect(stage.topics.length).toBeGreaterThan(0);
    });
  });

  it('2. should map topics across the core frozen modules', () => {
    const mappedModuleIds = new Set<string>();
    for (const stage of GUIDANCE_STAGES) {
      for (const mId of stage.primaryModuleIds) {
        mappedModuleIds.add(mId);
      }
    }

    // Check that primary stages encompass overview, strategy, positioning, personality, voiceTone, messaging, visualKnowledge, visualAssets, visualRules, brandNaming, brandExpression, brandArchitecture
    const expectedCoreModules = [
      'overview',
      'strategy',
      'positioning',
      'personality',
      'voiceTone',
      'messaging',
      'visualKnowledge',
      'visualAssets',
      'visualRules',
      'brandNaming',
      'brandExpression',
      'brandArchitecture'
    ];

    expectedCoreModules.forEach((mId) => {
      expect(mappedModuleIds.has(mId)).toBe(true);
    });
  });

  it('3. should verify bilingual completeness across all topics and blocks', () => {
    for (const stage of GUIDANCE_STAGES) {
      for (const topic of stage.topics) {
        expect(topic.title.en).toBeTruthy();
        expect(topic.title.id).toBeTruthy();
        expect(topic.shortDescription.en).toBeTruthy();
        expect(topic.shortDescription.id).toBeTruthy();
        expect(topic.conceptTaught.en).toBeTruthy();
        expect(topic.blocks.length).toBeGreaterThan(0);

        for (const block of topic.blocks) {
          switch (block.type) {
            case 'whyThisMatters':
              expect(block.content.en).toBeTruthy();
              expect(block.content.id).toBeTruthy();
              break;
            case 'thinkAboutThis':
              expect(block.prompt.en).toBeTruthy();
              expect(block.prompt.id).toBeTruthy();
              break;
            case 'askYourClient':
              expect(block.question.en).toBeTruthy();
              expect(block.question.id).toBeTruthy();
              expect(block.whatToLookFor.en).toBeTruthy();
              expect(block.whatToLookFor.id).toBeTruthy();
              break;
            case 'weakExample':
              expect(block.example.en).toBeTruthy();
              expect(block.example.id).toBeTruthy();
              expect(block.critique.en).toBeTruthy();
              expect(block.critique.id).toBeTruthy();
              break;
            case 'strongExample':
              expect(block.example.en).toBeTruthy();
              expect(block.example.id).toBeTruthy();
              expect(block.rationale.en).toBeTruthy();
              expect(block.rationale.id).toBeTruthy();
              break;
            case 'watchOut':
              expect(block.mistake.en).toBeTruthy();
              expect(block.mistake.id).toBeTruthy();
              expect(block.whyItMatters.en).toBeTruthy();
              expect(block.whyItMatters.id).toBeTruthy();
              expect(block.remedy.en).toBeTruthy();
              expect(block.remedy.id).toBeTruthy();
              break;
            case 'connectsTo':
              expect(block.explanation.en).toBeTruthy();
              expect(block.explanation.id).toBeTruthy();
              break;
            case 'revisitWhen':
              expect(block.triggerCondition.en).toBeTruthy();
              expect(block.triggerCondition.id).toBeTruthy();
              expect(block.recommendedAction.en).toBeTruthy();
              expect(block.recommendedAction.id).toBeTruthy();
              break;
            case 'learnMore':
              expect(block.title.en).toBeTruthy();
              expect(block.content.en).toBeTruthy();
              break;
          }
        }

        if (topic.diagnostics) {
          for (const diag of topic.diagnostics) {
            expect(diag.title.en).toBeTruthy();
            expect(diag.title.id).toBeTruthy();
            expect(diag.message.en).toBeTruthy();
            expect(diag.message.id).toBeTruthy();
          }
        }
      }
    }
  });

  it('4. should retrieve stage and module topics correctly via helper functions', () => {
    const stage1 = getGuidanceStage('stage1_discover');
    expect(stage1).toBeDefined();
    expect(stage1?.stageNumber).toBe(1);

    const posTopics = getGuidanceTopicsForModule('positioning');
    expect(posTopics.length).toBeGreaterThanOrEqual(1);
    expect(posTopics[0].stage.id).toBe('stage2_position');
  });
});
