import {
  ModuleId,
  CompletionStatus,
  Brand,
  BrandOverviewModule,
  BrandStrategyModule,
  PositioningModule,
  PersonalityModule,
  VoiceToneModule,
  VisualBasicsModule,
  MessagingModule,
  getLocalizedText
} from '../types/brand';
import { defaultLogoVariants } from '../data/sampleBrand';

export interface ModuleDefinition {
  id: ModuleId;
  nameKey: string;
  shortDescription: string;
  iconName: string;
  defaultData: () => any;
  calculateCompletion: (data?: any) => CompletionStatus;
}

export interface ModuleGroup {
  domainKey: string;
  moduleIds: ModuleId[];
}

export const MODULE_GROUPS: ModuleGroup[] = [
  {
    domainKey: 'domainBrand',
    moduleIds: ['overview']
  },
  {
    domainKey: 'domainVisualGuidelines',
    moduleIds: ['visualKnowledge', 'visualAssets', 'visualRules']
  },
  {
    domainKey: 'domainFoundation',
    moduleIds: ['strategy', 'positioning', 'personality', 'voiceTone', 'messaging']
  }
];

export const ALL_MODULE_IDS: ModuleId[] = [
  'overview',
  'visualKnowledge',
  'visualAssets',
  'visualRules',
  'strategy',
  'positioning',
  'personality',
  'voiceTone',
  'messaging'
];

export const MODULE_REGISTRY: Record<ModuleId, ModuleDefinition> = {
  overview: {
    id: 'overview',
    nameKey: 'moduleOverview',
    shortDescription: 'Core identity, one-line summary, category, and background.',
    iconName: 'Building2',
    defaultData: (): BrandOverviewModule => ({
      brandName: '',
      oneLineDescription: { en: '', id: '' },
      longDescription: { en: '', id: '' },
      category: { en: '', id: '' },
      website: '',
      internalNotes: { en: '', id: '' }
    }),
    calculateCompletion: (data?: BrandOverviewModule): CompletionStatus => {
      if (!data) return 'empty';
      const hasName = Boolean(data.brandName?.trim());
      const hasOneLiner = Boolean(getLocalizedText(data.oneLineDescription, 'en').text);
      const hasLongDesc = Boolean(getLocalizedText(data.longDescription, 'en').text);
      const hasCategory = Boolean(getLocalizedText(data.category, 'en').text);
      
      if (!hasName && !hasOneLiner && !hasLongDesc && !hasCategory) return 'empty';
      if (hasName && (hasOneLiner || hasLongDesc) && hasCategory) return 'complete';
      return 'started';
    }
  },
  visualKnowledge: {
    id: 'visualKnowledge',
    nameKey: 'moduleVisualKnowledge',
    shortDescription: 'Definitions, typography, color palettes, and visual identity knowledge.',
    iconName: 'BookOpen',
    defaultData: (): VisualBasicsModule => ({
      logoUsageNotes: { en: '', id: '' },
      logoVariants: defaultLogoVariants,
      primaryColors: [],
      secondaryColors: [],
      typographyNotes: { en: '', id: '' },
      imageryDirection: { en: '', id: '' },
      layoutNotes: { en: '', id: '' }
    }),
    calculateCompletion: (data?: VisualBasicsModule): CompletionStatus => {
      if (!data) return 'empty';
      const colorsCount = (data.primaryColors?.length || 0) + (data.secondaryColors?.length || 0);
      const hasLogo = Boolean(getLocalizedText(data.logoUsageNotes, 'en').text);
      const variantsCount = data.logoVariants?.length || 0;
      const hasTypo = Boolean(getLocalizedText(data.typographyNotes, 'en').text);
      
      if (colorsCount === 0 && !hasLogo && variantsCount === 0 && !hasTypo) return 'empty';
      if ((colorsCount >= 2 || variantsCount >= 2) && (hasLogo || hasTypo)) return 'complete';
      return 'started';
    }
  },
  visualAssets: {
    id: 'visualAssets',
    nameKey: 'moduleVisualAssets',
    shortDescription: 'Logo files, typography packages, media, and visual identity files.',
    iconName: 'Image',
    defaultData: () => ({}),
    calculateCompletion: (): CompletionStatus => 'empty'
  },
  visualRules: {
    id: 'visualRules',
    nameKey: 'moduleVisualRules',
    shortDescription: 'Do & don\'ts, spacing constraints, clear space, and usage guidelines.',
    iconName: 'FileCheck',
    defaultData: () => ({}),
    calculateCompletion: (): CompletionStatus => 'empty'
  },
  visualBasics: {
    id: 'visualBasics',
    nameKey: 'moduleVisualBasics',
    shortDescription: 'Logo rules, logo variants, color palettes, typography, and imagery.',
    iconName: 'Palette',
    defaultData: (): VisualBasicsModule => ({
      logoUsageNotes: { en: '', id: '' },
      logoVariants: defaultLogoVariants,
      primaryColors: [],
      secondaryColors: [],
      typographyNotes: { en: '', id: '' },
      imageryDirection: { en: '', id: '' },
      layoutNotes: { en: '', id: '' }
    }),
    calculateCompletion: (data?: VisualBasicsModule): CompletionStatus => {
      if (!data) return 'empty';
      const colorsCount = (data.primaryColors?.length || 0) + (data.secondaryColors?.length || 0);
      const hasLogo = Boolean(getLocalizedText(data.logoUsageNotes, 'en').text);
      const variantsCount = data.logoVariants?.length || 0;
      const hasTypo = Boolean(getLocalizedText(data.typographyNotes, 'en').text);
      
      if (colorsCount === 0 && !hasLogo && variantsCount === 0 && !hasTypo) return 'empty';
      if ((colorsCount >= 2 || variantsCount >= 2) && (hasLogo || hasTypo)) return 'complete';
      return 'started';
    }
  },
  strategy: {
    id: 'strategy',
    nameKey: 'moduleStrategy',
    shortDescription: 'Foundational purpose, mission, vision, values, and priorities.',
    iconName: 'Compass',
    defaultData: (): BrandStrategyModule => ({
      purpose: { en: '', id: '' },
      mission: { en: '', id: '' },
      vision: { en: '', id: '' },
      values: [],
      priorities: []
    }),
    calculateCompletion: (data?: BrandStrategyModule): CompletionStatus => {
      if (!data) return 'empty';
      const hasPurpose = Boolean(getLocalizedText(data.purpose, 'en').text);
      const hasMission = Boolean(getLocalizedText(data.mission, 'en').text);
      const hasVision = Boolean(getLocalizedText(data.vision, 'en').text);
      const valuesCount = data.values?.filter(v => getLocalizedText(v.title, 'en').text).length || 0;
      
      if (!hasPurpose && !hasMission && !hasVision && valuesCount === 0) return 'empty';
      if ((hasPurpose || hasMission) && valuesCount >= 2) return 'complete';
      return 'started';
    }
  },
  positioning: {
    id: 'positioning',
    nameKey: 'modulePositioning',
    shortDescription: 'Target audience, differentiators, and core positioning statement.',
    iconName: 'Target',
    defaultData: (): PositioningModule => ({
      targetAudience: { en: '', id: '' },
      marketCategory: { en: '', id: '' },
      coreProblem: { en: '', id: '' },
      differentiators: [],
      competitiveAlternatives: { en: '', id: '' },
      positioningStatement: { en: '', id: '' }
    }),
    calculateCompletion: (data?: PositioningModule): CompletionStatus => {
      if (!data) return 'empty';
      const hasAudience = Boolean(getLocalizedText(data.targetAudience, 'en').text);
      const hasStatement = Boolean(getLocalizedText(data.positioningStatement, 'en').text);
      const diffsCount = data.differentiators?.filter(d => getLocalizedText(d, 'en').text).length || 0;
      
      if (!hasAudience && !hasStatement && diffsCount === 0) return 'empty';
      if (hasAudience && (hasStatement || diffsCount >= 2)) return 'complete';
      return 'started';
    }
  },
  personality: {
    id: 'personality',
    nameKey: 'modulePersonality',
    shortDescription: 'Brand traits, slider spectrums, archetype, and We Are/Are Not rules.',
    iconName: 'Sparkles',
    defaultData: (): PersonalityModule => ({
      traits: [],
      sliders: {
        classicToModern: 50,
        seriousToPlayful: 50,
        reservedToExpressive: 50,
        practicalToVisionary: 50
      },
      archetype: { en: '', id: '' },
      weAreWeAreNot: []
    }),
    calculateCompletion: (data?: PersonalityModule): CompletionStatus => {
      if (!data) return 'empty';
      const traitsCount = data.traits?.filter(t => getLocalizedText(t, 'en').text).length || 0;
      const pairsCount = data.weAreWeAreNot?.filter(p => getLocalizedText(p.weAre, 'en').text).length || 0;
      const hasArchetype = Boolean(getLocalizedText(data.archetype, 'en').text);
      
      if (traitsCount === 0 && pairsCount === 0 && !hasArchetype) return 'empty';
      if (traitsCount >= 3 && pairsCount >= 2) return 'complete';
      return 'started';
    }
  },
  voiceTone: {
    id: 'voiceTone',
    nameKey: 'moduleVoiceTone',
    shortDescription: 'Writing principles, vocabulary guidance, examples, and channel notes.',
    iconName: 'MessageSquareText',
    defaultData: (): VoiceToneModule => ({
      principles: [],
      toneGuidelines: { en: '', id: '' },
      wordsToUse: [],
      wordsToAvoid: [],
      examples: [],
      channelNotes: []
    }),
    calculateCompletion: (data?: VoiceToneModule): CompletionStatus => {
      if (!data) return 'empty';
      const hasTone = Boolean(getLocalizedText(data.toneGuidelines, 'en').text);
      const principlesCount = data.principles?.filter(p => getLocalizedText(p, 'en').text).length || 0;
      const examplesCount = data.examples?.filter(e => getLocalizedText(e.before, 'en').text).length || 0;
      
      if (!hasTone && principlesCount === 0 && examplesCount === 0) return 'empty';
      if (hasTone && (principlesCount >= 2 || examplesCount >= 1)) return 'complete';
      return 'started';
    }
  },
  messaging: {
    id: 'messaging',
    nameKey: 'moduleMessaging',
    shortDescription: 'Tagline, elevator pitch, key messages, proof points, and CTAs.',
    iconName: 'Megaphone',
    defaultData: (): MessagingModule => ({
      tagline: { en: '', id: '' },
      elevatorPitch: { en: '', id: '' },
      keyMessages: [],
      proofPoints: [],
      callsToAction: []
    }),
    calculateCompletion: (data?: MessagingModule): CompletionStatus => {
      if (!data) return 'empty';
      const hasTagline = Boolean(getLocalizedText(data.tagline, 'en').text);
      const hasPitch = Boolean(getLocalizedText(data.elevatorPitch, 'en').text);
      const keyMsgsCount = data.keyMessages?.filter(m => getLocalizedText(m, 'en').text).length || 0;
      
      if (!hasTagline && !hasPitch && keyMsgsCount === 0) return 'empty';
      if ((hasTagline || hasPitch) && keyMsgsCount >= 2) return 'complete';
      return 'started';
    }
  }
};

export function getModuleCompletion(brand: Brand, moduleId: ModuleId): CompletionStatus {
  // If checking visualKnowledge, fallback to visualBasics data if visualKnowledge is not directly present
  const targetKey = moduleId === 'visualKnowledge' && !brand.modules.visualKnowledge ? 'visualBasics' : moduleId;
  const moduleData = brand.modules[targetKey as ModuleId];
  return MODULE_REGISTRY[moduleId].calculateCompletion(moduleData);
}
