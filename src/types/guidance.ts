/**
 * Phase 4.1C — Guidance Content Model Types
 * 
 * Provides strongly typed pedagogical structures for the Guided Brand Design Layer.
 * Follows PHASE_4_1B_GUIDANCE_CURRICULUM.md specifications.
 * 
 * Zero modification to frozen Brand Knowledge types.
 */

import { ModuleId, LocalizedString } from './brand';

export type GuidanceStageId =
  | 'stage1_discover'
  | 'stage2_position'
  | 'stage3_character'
  | 'stage4_visual'
  | 'stage5_govern'
  | 'stage6_apply';

export type DifficultyTier = 'beginner' | 'intermediate' | 'advanced';

export type DiagnosticSeverity = 'error' | 'warning' | 'recommendation' | 'tip';

/**
 * 9 Pedagogical Block Types specified in Curriculum
 */
export interface WhyThisMattersBlock {
  type: 'whyThisMatters';
  content: LocalizedString;
}

export interface ThinkAboutThisBlock {
  type: 'thinkAboutThis';
  prompt: LocalizedString;
}

export interface AskYourClientBlock {
  type: 'askYourClient';
  question: LocalizedString;
  whatToLookFor: LocalizedString;
  followUpPrompt?: LocalizedString;
}

export interface WeakExampleBlock {
  type: 'weakExample';
  example: LocalizedString;
  critique: LocalizedString;
}

export interface StrongExampleBlock {
  type: 'strongExample';
  example: LocalizedString;
  rationale: LocalizedString;
}

export interface WatchOutBlock {
  type: 'watchOut';
  mistake: LocalizedString;
  whyItMatters: LocalizedString;
  remedy: LocalizedString;
}

export interface ConnectsToBlock {
  type: 'connectsTo';
  targetStageId?: GuidanceStageId;
  targetModuleId?: ModuleId;
  explanation: LocalizedString;
}

export interface RevisitWhenBlock {
  type: 'revisitWhen';
  triggerCondition: LocalizedString;
  recommendedAction: LocalizedString;
}

export interface LearnMoreBlock {
  type: 'learnMore';
  title: LocalizedString;
  content: LocalizedString;
}

export type PedagogicalBlock =
  | WhyThisMattersBlock
  | ThinkAboutThisBlock
  | AskYourClientBlock
  | WeakExampleBlock
  | StrongExampleBlock
  | WatchOutBlock
  | ConnectsToBlock
  | RevisitWhenBlock
  | LearnMoreBlock;

export interface GuidanceDiagnosticRule {
  id: string;
  severity: DiagnosticSeverity;
  title: LocalizedString;
  message: LocalizedString;
  remediationStageId?: GuidanceStageId;
  remediationModuleId?: ModuleId;
}

export interface GuidanceTopic {
  id: string;
  moduleId: ModuleId;
  fieldKey?: string;
  tier: DifficultyTier;
  title: LocalizedString;
  shortDescription: LocalizedString;
  conceptTaught: LocalizedString;
  blocks: PedagogicalBlock[];
  diagnostics?: GuidanceDiagnosticRule[];
}

export interface GuidanceStage {
  id: GuidanceStageId;
  stageNumber: number;
  title: LocalizedString;
  tagline: LocalizedString;
  learningObjective: LocalizedString;
  designerMentalModel: LocalizedString;
  primaryModuleIds: ModuleId[];
  topics: GuidanceTopic[];
}
