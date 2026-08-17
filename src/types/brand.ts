export type ModuleId =
  | 'overview'
  | 'strategy'
  | 'positioning'
  | 'personality'
  | 'voiceTone'
  | 'visualBasics'
  | 'messaging';

export type Language = 'en' | 'id';

export type CompletionStatus = 'empty' | 'started' | 'complete';

export type LocalizedString = {
  en?: string;
  id?: string;
};

export function getLocalizedText(
  field: LocalizedString | string | undefined,
  lang: Language,
  fallbackLang: Language = 'en'
): { text: string; isFallback: boolean } {
  if (!field) return { text: '', isFallback: false };
  if (typeof field === 'string') return { text: field, isFallback: false };

  const currentVal = field[lang]?.trim();
  if (currentVal) return { text: currentVal, isFallback: false };

  const fallbackVal = field[fallbackLang]?.trim();
  if (fallbackVal) return { text: fallbackVal, isFallback: true };

  // Try any available language string
  const anyVal = field.en?.trim() || field.id?.trim() || '';
  return { text: anyVal, isFallback: Boolean(anyVal) };
}

export function updateLocalizedString(
  field: LocalizedString | string | undefined,
  lang: Language,
  newText: string
): LocalizedString {
  const currentObj: LocalizedString = typeof field === 'string'
    ? { en: field }
    : { ...(field || {}) };

  return {
    ...currentObj,
    [lang]: newText
  };
}

export interface ValueItem {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
}

export interface WeArePair {
  id: string;
  weAre: LocalizedString;
  weAreNot: LocalizedString;
}

export interface WritingExample {
  id: string;
  context?: LocalizedString;
  before: LocalizedString;
  after: LocalizedString;
}

export interface ColorSwatch {
  id: string;
  name: LocalizedString;
  hex: string;
  usage?: LocalizedString;
}

export type LogoVariantKey =
  | 'primary'
  | 'black'
  | 'white'
  | 'monochrome'
  | 'simplifiedMark'
  | 'horizontal'
  | 'vertical'
  | 'iconApp';

export interface LogoVariant {
  id: string;
  variantKey: LogoVariantKey;
  name: LocalizedString;
  previewUrl?: string; // Image/Data URL or SVG placeholder
  usageNotes: LocalizedString;
  recommendedBg?: string; // e.g. "#ffffff" or "Light background"
  doNotUseWhen?: LocalizedString;
}

export interface BrandOverviewModule {
  brandName: string; // Brand core name is shared
  oneLineDescription: LocalizedString;
  longDescription: LocalizedString;
  category: LocalizedString;
  website: string;
  internalNotes: LocalizedString;
}

export interface BrandStrategyModule {
  purpose: LocalizedString;
  mission: LocalizedString;
  vision: LocalizedString;
  values: ValueItem[];
  priorities: LocalizedString[];
}

export interface PositioningModule {
  targetAudience: LocalizedString;
  marketCategory: LocalizedString;
  coreProblem: LocalizedString;
  differentiators: LocalizedString[];
  competitiveAlternatives: LocalizedString;
  positioningStatement: LocalizedString;
}

export interface PersonalityModule {
  traits: LocalizedString[];
  sliders: {
    classicToModern: number; // 0 to 100 (Shared)
    seriousToPlayful: number; // 0 to 100 (Shared)
    reservedToExpressive: number; // 0 to 100 (Shared)
    practicalToVisionary: number; // 0 to 100 (Shared)
  };
  archetype: LocalizedString;
  weAreWeAreNot: WeArePair[];
}

export interface VoiceToneModule {
  principles: LocalizedString[];
  toneGuidelines: LocalizedString;
  wordsToUse: LocalizedString[];
  wordsToAvoid: LocalizedString[];
  examples: WritingExample[];
  channelNotes: LocalizedString[];
}

export interface VisualBasicsModule {
  logoUsageNotes: LocalizedString;
  logoVariants: LogoVariant[];
  primaryColors: ColorSwatch[];
  secondaryColors: ColorSwatch[];
  typographyNotes: LocalizedString;
  imageryDirection: LocalizedString;
  layoutNotes: LocalizedString;
}

export interface MessagingModule {
  tagline: LocalizedString;
  elevatorPitch: LocalizedString;
  keyMessages: LocalizedString[];
  proofPoints: LocalizedString[];
  callsToAction: LocalizedString[];
}

export interface BrandModulesData {
  overview?: BrandOverviewModule;
  strategy?: BrandStrategyModule;
  positioning?: PositioningModule;
  personality?: PersonalityModule;
  voiceTone?: VoiceToneModule;
  visualBasics?: VisualBasicsModule;
  messaging?: MessagingModule;
}

export interface Brand {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  activeModules: ModuleId[];
  modules: BrandModulesData;
}
