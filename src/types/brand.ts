export type ModuleId =
  | 'overview'
  | 'strategy'
  | 'positioning'
  | 'personality'
  | 'voiceTone'
  | 'visualBasics'
  | 'visualKnowledge'
  | 'visualAssets'
  | 'visualRules'
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

export type EntityDomain =
  | 'foundation'
  | 'visualKnowledge'
  | 'visualAssets'
  | 'visualRules';

export type EntityType =
  // Foundation Entities
  | 'strategyValue'
  | 'strategicPriority'
  | 'targetAudience'
  | 'differentiator'
  | 'personalityTrait'
  | 'voicePrinciple'
  | 'vocabularyTerm'
  | 'writingExample'
  | 'keyMessage'
  | 'proofPoint'
  | 'callToAction'
  // Visual Knowledge Entities
  | 'logo'
  | 'color'
  | 'font'
  | 'typeStyle'
  | 'imageryDirection'
  | 'graphicLanguage'
  | 'layoutPrinciple'
  // Visual Assets & Rules
  | 'asset'
  | 'rule';

export interface EntityReference {
  domain: EntityDomain;
  entityType: EntityType;
  entityId: string;
  label?: string; // Human label cached for quick render
}

// --- Foundation Entities ---

export interface StrategicValueEntity {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
  tags?: string[];
}

export type ValueItem = StrategicValueEntity; // Alias for backward compatibility

export interface StrategicPriorityEntity {
  id: string;
  title: LocalizedString;
  description?: LocalizedString;
  timeframe?: string; // e.g. 'Near-term', 'Long-term'
}

export interface AudienceEntity {
  id: string;
  name: LocalizedString;
  description?: LocalizedString;
  needsPainPoints?: LocalizedString;
}

export interface DifferentiatorEntity {
  id: string;
  title: LocalizedString;
  description?: LocalizedString;
  evidence?: LocalizedString;
}

export interface PersonalityTraitEntity {
  id: string;
  trait: LocalizedString;
  definition?: LocalizedString;
  spectrumPosition?: number; // 0-100
}

export interface WeArePairEntity {
  id: string;
  weAre: LocalizedString;
  weAreNot: LocalizedString;
  rationale?: LocalizedString;
}

export type WeArePair = WeArePairEntity; // Alias for backward compatibility

export interface VoicePrincipleEntity {
  id: string;
  title: LocalizedString;
  description?: LocalizedString;
  doExample?: LocalizedString;
  dontExample?: LocalizedString;
}

export interface VocabularyEntity {
  id: string;
  term: LocalizedString;
  recommendation: 'prefer' | 'avoid';
  context?: LocalizedString;
}

export interface WritingExampleEntity {
  id: string;
  context?: LocalizedString;
  before: LocalizedString;
  after: LocalizedString;
  explanation?: LocalizedString;
}

export type WritingExample = WritingExampleEntity; // Alias for backward compatibility

export interface KeyMessageEntity {
  id: string;
  headline: LocalizedString;
  narrative?: LocalizedString;
  targetAudienceRef?: EntityReference;
  proofPointRefs?: EntityReference[];
}

export interface ProofPointEntity {
  id: string;
  claim: LocalizedString;
  evidence?: LocalizedString;
  category?: string;
}

export interface CTAEntity {
  id: string;
  label: LocalizedString;
  contextChannel?: string;
}

export interface ColorSwatch {
  id: string;
  name: LocalizedString;
  hex: string;
  usage?: LocalizedString;
}

export type ColorRole =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'neutral'
  | 'supporting'
  | 'custom';

export interface ColorItem {
  id: string;
  name: string;
  role: ColorRole;
  hex: string;
  rgb?: string;
  hsl?: string;
  cmyk?: string;
  description?: LocalizedString;
  updatedAt?: string;
}

export type FontRole =
  | 'primary'
  | 'secondary'
  | 'supporting'
  | 'custom';

export interface FontItem {
  id: string;
  name: string;
  role: FontRole;
  weights: number[]; // e.g. [400, 500, 700]
  styles: ('normal' | 'italic')[];
  assetReference?: string;
  updatedAt?: string;
}

export type TypeStyleCategory =
  | 'display'
  | 'heading'
  | 'body'
  | 'caption'
  | 'custom';

export interface TypeStyleItem {
  id: string;
  name: string;
  category: TypeStyleCategory;
  fontFamilyId: string; // References FontItem.id
  weight: number;
  sizePx: number;
  lineHeight: number; // e.g. 1.2
  letterSpacingEm: number; // e.g. -0.02
  sampleText?: LocalizedString;
  updatedAt?: string;
}

export interface PhotographyData {
  description?: LocalizedString;
  mood?: string[];
  subjects?: string[];
  lighting?: string[];
  composition?: string[];
  colorTreatment?: string[];
}

export interface ArtDirectionData {
  visualMood?: LocalizedString;
  subjectDirection?: LocalizedString;
  compositionDirection?: LocalizedString;
  treatment?: LocalizedString;
}

export interface ImageCharacteristicsData {
  mood?: string[];
  lighting?: string[];
  composition?: string[];
  color?: string[];
}

export interface ImageryData {
  photography?: PhotographyData;
  artDirection?: ArtDirectionData;
  characteristics?: ImageCharacteristicsData;
}

export interface GraphicCategoryData {
  description?: LocalizedString;
  characteristics?: string[];
}

export interface IllustrationCategoryData extends GraphicCategoryData {
  style?: string[];
  subject?: string[];
  treatment?: LocalizedString;
}

export interface GraphicLanguageData {
  shapes?: GraphicCategoryData;
  patterns?: GraphicCategoryData;
  illustration?: IllustrationCategoryData;
  iconography?: GraphicCategoryData;
  lines?: GraphicCategoryData;
  decorativeElements?: GraphicCategoryData;
}

export interface GridData {
  description?: LocalizedString;
  type?: 'column' | 'modular' | 'baseline' | 'freeform' | 'custom';
  columns?: number;
  gutterPx?: number;
  marginPx?: number;
  characteristics?: string[];
}

export interface SpacingData {
  description?: LocalizedString;
  baseUnitPx?: number;
  characteristics?: string[];
}

export interface AlignmentData {
  description?: LocalizedString;
  preferredAlignment?: 'left' | 'center' | 'right' | 'edge' | 'asymmetrical' | 'custom';
  characteristics?: string[];
}

export interface LayoutCategoryData {
  description?: LocalizedString;
  characteristics?: string[];
}

export interface LayoutCompositionData {
  grid?: GridData;
  spacing?: SpacingData;
  alignment?: AlignmentData;
  proportion?: LayoutCategoryData;
  hierarchy?: LayoutCategoryData;
  compositionPrinciples?: LayoutCategoryData;
}

export type AssetCategory =
  | 'logos'
  | 'fonts'
  | 'images'
  | 'illustrations'
  | 'icons'
  | 'patterns'
  | 'other';

export interface AssetFile {
  id: string;
  filename: string;
  format: string;
  sizeBytes: number;
  dataUrl?: string; // Local storage base64 data url for preview/storage
  uploadedAt: string;
}

export interface AssetReference {
  moduleId: string; // e.g. 'logoSystem', 'typographySystem'
  entityName: string; // e.g. 'Northstar Primary Logo' or 'Heading 1'
}

export interface VisualAssetItem {
  id: string;
  name: string;
  category: AssetCategory;
  notes?: LocalizedString;
  files: AssetFile[]; // Supports font families with multiple files or single file
  references?: AssetReference[];
  updatedAt?: string;
}

export type RuleType =
  | 'usage'
  | 'restriction'
  | 'preference'
  | 'requirement';

export type RuleContextCategory =
  | 'logo'
  | 'color'
  | 'typography'
  | 'imagery'
  | 'graphicLanguage'
  | 'layout'
  | 'general';

export type RuleEntityReference = EntityReference;

export interface VisualRuleItem {
  id: string;
  name: string;
  type: RuleType;
  context: RuleContextCategory;
  guidance: LocalizedString;
  tags?: string[];
  references?: RuleEntityReference[];
  updatedAt?: string;
}

export type LogoType =
  | 'primaryLogo'
  | 'secondaryLogo'
  | 'symbolMark'
  | 'wordmark'
  | 'monogram'
  | 'lockup'
  | 'badgeEmblem'
  | 'other';

export type LogoRole =
  | 'primary'
  | 'secondary'
  | 'supporting'
  | 'campaign'
  | 'custom';

export type VariantColorType =
  | 'fullColor'
  | 'white'
  | 'black'
  | 'monochrome'
  | 'reversed'
  | 'custom';

export interface LogoItemVariant {
  id: string;
  name: LocalizedString;
  colorType: VariantColorType;
  previewUrl?: string;
  assetReference?: string;
  usageNotes?: LocalizedString;
}

export interface LogoItemStructure {
  hasSymbol?: boolean;
  hasWordmark?: boolean;
  composition?: LocalizedString;
}

export interface LogoItem {
  id: string;
  name: string;
  type: LogoType;
  role?: LogoRole;
  description?: LocalizedString;
  variants: LogoItemVariant[];
  structure?: LogoItemStructure;
  updatedAt?: string;
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
  values: StrategicValueEntity[];
  priorities: StrategicPriorityEntity[];
}

export interface PositioningModule {
  targetAudiences: AudienceEntity[];
  targetAudience?: LocalizedString; // Legacy compatibility
  marketCategory: LocalizedString;
  coreProblem: LocalizedString;
  differentiators: DifferentiatorEntity[];
  competitiveAlternatives: LocalizedString;
  positioningStatement: LocalizedString;
}

export interface PersonalityModule {
  traits: PersonalityTraitEntity[];
  sliders: {
    classicToModern: number; // 0 to 100 (Shared)
    seriousToPlayful: number; // 0 to 100 (Shared)
    reservedToExpressive: number; // 0 to 100 (Shared)
    practicalToVisionary: number; // 0 to 100 (Shared)
  };
  archetype: LocalizedString;
  weAreWeAreNot: WeArePairEntity[];
}

export interface VoiceToneModule {
  principles: VoicePrincipleEntity[];
  toneGuidelines: LocalizedString;
  vocabulary: VocabularyEntity[];
  wordsToUse?: LocalizedString[]; // Legacy compatibility
  wordsToAvoid?: LocalizedString[]; // Legacy compatibility
  examples: WritingExampleEntity[];
  channelNotes: LocalizedString[];
}

export interface VisualBasicsModule {
  logoUsageNotes: LocalizedString;
  logoVariants: LogoVariant[];
  logos?: LogoItem[];
  primaryColors: ColorSwatch[];
  secondaryColors: ColorSwatch[];
  colors?: ColorItem[];
  fonts?: FontItem[];
  typeStyles?: TypeStyleItem[];
  typographyNotes: LocalizedString;
  imageryDirection: LocalizedString;
  imagery?: ImageryData;
  graphicLanguage?: GraphicLanguageData;
  layoutNotes: LocalizedString;
  layoutComposition?: LayoutCompositionData;
}

export interface MessagingModule {
  tagline: LocalizedString;
  elevatorPitch: LocalizedString;
  keyMessages: KeyMessageEntity[];
  proofPoints: ProofPointEntity[];
  callsToAction: CTAEntity[];
}

export interface BrandModulesData {
  overview?: BrandOverviewModule;
  strategy?: BrandStrategyModule;
  positioning?: PositioningModule;
  personality?: PersonalityModule;
  voiceTone?: VoiceToneModule;
  visualBasics?: VisualBasicsModule;
  visualKnowledge?: VisualBasicsModule;
  visualAssets?: VisualAssetItem[];
  visualRules?: VisualRuleItem[];
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
