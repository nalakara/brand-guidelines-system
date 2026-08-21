/**
 * Phase 4.2A — Guidance Controller
 * 
 * Pure, deterministic TypeScript controller for Guided Brand Experience.
 * Provides stage discovery, advisory progress calculation, topic tracking,
 * recommendation routing, and feedback revisit triggers.
 * 
 * Invariant: ZERO modification or mutation of Brand Knowledge.
 * Zero UI rendering or localized string hardcoding inside the controller.
 */

import { Brand, ModuleId, CompletionStatus } from '../types/brand';
import {
  GuidanceStage,
  GuidanceStageId,
  GuidanceTopic,
  GuidanceInteractionState,
  TopicGuidanceStatus,
  GuidanceRecommendation,
  RevisitSuggestion,
  DifficultyTier
} from '../types/guidance';
import { GUIDANCE_STAGES } from '../data/guidanceContent';
import { getModuleCompletion } from '../modules/registry';

export interface StageProgressSummary {
  stageId: GuidanceStageId;
  stageNumber: number;
  isActive: boolean;
  activeModuleIds: ModuleId[];
  knowledgeStatus: CompletionStatus; // 'empty' | 'started' | 'complete'
  allModulesCompleted: boolean;
  totalTopicsCount: number;
  completedTopicsCount: number;
  advisoryPercentage: number;
}

export interface GuidanceOverviewState {
  stages: StageProgressSummary[];
  activeStageId: GuidanceStageId;
  recommendedNext?: GuidanceRecommendation;
  revisitSuggestions: RevisitSuggestion[];
}

/**
 * 1. Stage Discovery: Returns all curriculum stages and marks which ones contain active modules
 */
export function getActiveStages(
  activeModules: ModuleId[],
  guidanceStages: GuidanceStage[] = GUIDANCE_STAGES
): GuidanceStage[] {
  const activeSet = new Set(activeModules || []);
  return guidanceStages.filter((stage) =>
    stage.primaryModuleIds.some((mId) => activeSet.has(mId))
  );
}

/**
 * 2. Topic Status Resolver: Resolves the interaction status for a specific topic
 */
export function getTopicStatus(
  topicId: string,
  interactionState?: GuidanceInteractionState
): TopicGuidanceStatus {
  if (!interactionState?.topicStatuses) return 'notStarted';
  return interactionState.topicStatuses[topicId] || 'notStarted';
}

/**
 * 3. Stage Progress Evaluator: Computes advisory progress metrics for a single stage
 */
export function calculateStageProgress(
  brand: Brand,
  stage: GuidanceStage,
  interactionState?: GuidanceInteractionState
): StageProgressSummary {
  const activeModules = brand.activeModules || [];
  const activeSet = new Set(activeModules);
  const stageActiveModules = stage.primaryModuleIds.filter((mId) => activeSet.has(mId));
  const isActive = stageActiveModules.length > 0;

  if (!isActive) {
    return {
      stageId: stage.id,
      stageNumber: stage.stageNumber,
      isActive: false,
      activeModuleIds: [],
      knowledgeStatus: 'empty',
      allModulesCompleted: false,
      totalTopicsCount: stage.topics.length,
      completedTopicsCount: 0,
      advisoryPercentage: 0
    };
  }

  // Evaluate knowledge completion of each active module in this stage
  const moduleStatuses = stageActiveModules.map((mId) => getModuleCompletion(brand, mId));
  const completedCount = moduleStatuses.filter((s) => s === 'complete').length;
  const startedCount = moduleStatuses.filter((s) => s === 'started').length;

  let knowledgeStatus: CompletionStatus = 'empty';
  if (completedCount === stageActiveModules.length) {
    knowledgeStatus = 'complete';
  } else if (completedCount > 0 || startedCount > 0) {
    knowledgeStatus = 'started';
  }

  // Count topic guidance interaction progress
  let completedTopics = 0;
  stage.topics.forEach((t) => {
    const status = getTopicStatus(t.id, interactionState);
    if (status === 'completed') completedTopics++;
  });

  // Calculate composite advisory percentage (50% knowledge status + 50% guidance completion)
  const knowledgeRatio = completedCount / stageActiveModules.length;
  const guidanceRatio = stage.topics.length > 0 ? completedTopics / stage.topics.length : 1;
  const advisoryPercentage = Math.round((knowledgeRatio * 0.7 + guidanceRatio * 0.3) * 100);

  return {
    stageId: stage.id,
    stageNumber: stage.stageNumber,
    isActive: true,
    activeModuleIds: stageActiveModules,
    knowledgeStatus,
    allModulesCompleted: completedCount === stageActiveModules.length,
    totalTopicsCount: stage.topics.length,
    completedTopicsCount: completedTopics,
    advisoryPercentage
  };
}

/**
 * 4. Revisit Suggestions Engine: Identifies legitimate upstream-to-downstream review triggers
 */
export function getRevisitSuggestions(
  brand: Brand
): RevisitSuggestion[] {
  const suggestions: RevisitSuggestion[] = [];
  const activeSet = new Set(brand.activeModules || []);

  // Rule 1: If Positioning has content but Personality WeAreWeAreNot is empty
  if (
    activeSet.has('positioning') &&
    activeSet.has('personality') &&
    getModuleCompletion(brand, 'positioning') !== 'empty' &&
    getModuleCompletion(brand, 'personality') === 'empty'
  ) {
    suggestions.push({
      id: 'rev_positioning_to_personality',
      sourceModuleId: 'positioning',
      targetStageId: 'stage3_character',
      targetModuleId: 'personality',
      reasonCode: 'upstreamDependency',
      triggerDescriptionKey: 'revisitPositioningToPersonality'
    });
  }

  // Rule 2: If Visual Knowledge has colors/logos but Visual Rules is empty
  if (
    activeSet.has('visualKnowledge') &&
    activeSet.has('visualRules') &&
    getModuleCompletion(brand, 'visualKnowledge') !== 'empty' &&
    getModuleCompletion(brand, 'visualRules') === 'empty'
  ) {
    suggestions.push({
      id: 'rev_visual_to_rules',
      sourceModuleId: 'visualKnowledge',
      targetStageId: 'stage5_govern',
      targetModuleId: 'visualRules',
      reasonCode: 'upstreamDependency',
      triggerDescriptionKey: 'revisitVisualToRules'
    });
  }

  // Rule 3: If Touchpoints are created in Expression but Visual Rules is incomplete
  if (
    activeSet.has('brandExpression') &&
    activeSet.has('visualRules') &&
    getModuleCompletion(brand, 'brandExpression') !== 'empty' &&
    getModuleCompletion(brand, 'visualRules') !== 'complete'
  ) {
    suggestions.push({
      id: 'rev_touchpoints_to_rules',
      sourceModuleId: 'brandExpression',
      targetStageId: 'stage5_govern',
      targetModuleId: 'visualRules',
      reasonCode: 'revisitSuggested',
      triggerDescriptionKey: 'revisitTouchpointsToRules'
    });
  }

  return suggestions;
}

/**
 * 5. Recommended Next Step: Recommends the highest-priority incomplete stage and module
 */
export function getRecommendedNext(
  brand: Brand,
  interactionState?: GuidanceInteractionState,
  guidanceStages: GuidanceStage[] = GUIDANCE_STAGES
): GuidanceRecommendation | undefined {
  const activeSet = new Set(brand.activeModules || []);

  // Check revisit suggestions first
  const revisits = getRevisitSuggestions(brand);
  if (revisits.length > 0) {
    const firstRevisit = revisits[0];
    return {
      stageId: firstRevisit.targetStageId,
      moduleId: firstRevisit.targetModuleId,
      reasonCode: firstRevisit.reasonCode,
      relatedModuleId: firstRevisit.sourceModuleId
    };
  }

  // Otherwise, traverse stages in pedagogical order 1 -> 6
  for (const stage of guidanceStages) {
    const stageActiveModules = stage.primaryModuleIds.filter((mId) => activeSet.has(mId));
    if (stageActiveModules.length === 0) continue;

    // Check if any active module in this stage is incomplete
    for (const mId of stageActiveModules) {
      const completion = getModuleCompletion(brand, mId);
      if (completion !== 'complete') {
        // Find the first incomplete or unworked topic in this module
        const moduleTopics = stage.topics.filter((t) => t.moduleId === mId);
        const nextTopic = moduleTopics.find(
          (t) => getTopicStatus(t.id, interactionState) !== 'completed'
        );

        return {
          stageId: stage.id,
          moduleId: mId,
          topicId: nextTopic?.id,
          reasonCode: completion === 'empty' ? 'firstIncompleteStage' : 'activeModuleIncomplete'
        };
      }
    }
  }

  // If all active modules are complete, recommend optional advanced exploration
  const firstStage = guidanceStages[0];
  if (firstStage && firstStage.primaryModuleIds.length > 0) {
    return {
      stageId: firstStage.id,
      moduleId: firstStage.primaryModuleIds[0],
      reasonCode: 'optionalExploration'
    };
  }

  return undefined;
}

/**
 * 6. Composite Guidance State Evaluator: Returns full snapshot for UI orchestration
 */
export function evaluateGuidanceState(
  brand: Brand,
  interactionState?: GuidanceInteractionState,
  guidanceStages: GuidanceStage[] = GUIDANCE_STAGES
): GuidanceOverviewState {
  const stages = guidanceStages.map((stage) =>
    calculateStageProgress(brand, stage, interactionState)
  );

  const activeStages = stages.filter((s) => s.isActive);
  let activeStageId: GuidanceStageId = 'stage1_discover';

  if (interactionState?.activeStageId && activeStages.some((s) => s.stageId === interactionState.activeStageId)) {
    activeStageId = interactionState.activeStageId;
  } else if (activeStages.length > 0) {
    activeStageId = activeStages[0].stageId;
  }

  const recommendedNext = getRecommendedNext(brand, interactionState, guidanceStages);
  const revisitSuggestions = getRevisitSuggestions(brand);

  return {
    stages,
    activeStageId,
    recommendedNext,
    revisitSuggestions
  };
}

/**
 * 7. Progressive Disclosure Helper: Filters topics based on difficulty preference
 */
export function filterTopicsByDifficulty(
  topics: GuidanceTopic[],
  preference: DifficultyTier = 'beginner'
): { primary: GuidanceTopic[]; advanced: GuidanceTopic[] } {
  if (preference === 'advanced') {
    return { primary: topics, advanced: [] };
  }

  if (preference === 'intermediate') {
    return {
      primary: topics.filter((t) => t.tier === 'beginner' || t.tier === 'intermediate'),
      advanced: topics.filter((t) => t.tier === 'advanced')
    };
  }

  // Default 'beginner': show beginners as primary, intermediate/advanced as collapsed
  return {
    primary: topics.filter((t) => t.tier === 'beginner'),
    advanced: topics.filter((t) => t.tier !== 'beginner')
  };
}
