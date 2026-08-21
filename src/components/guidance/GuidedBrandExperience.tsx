import React, { useState } from 'react';
import { Brand, ModuleId, Language } from '../../types/brand';
import { GuidanceStageId, GuidanceInteractionState } from '../../types/guidance';
import { GUIDANCE_STAGES, getGuidanceStage } from '../../data/guidanceContent';
import {
  calculateStageProgress,
  getRecommendedNext
} from '../../utils/guidanceController';

// Guidance UI Components
import { StageJourneyRibbon } from './StageJourneyRibbon';
import { StageNarrativeHeader } from './StageNarrativeHeader';
import { ContextualGuidanceDrawer } from './ContextualGuidanceDrawer';

// Frozen Editor Components (Reused verbatim)
import { OverviewEditor } from '../editors/OverviewEditor';
import { StrategyEditor } from '../editors/StrategyEditor';
import { PositioningEditor } from '../editors/PositioningEditor';
import { PersonalityEditor } from '../editors/PersonalityEditor';
import { VoiceToneEditor } from '../editors/VoiceToneEditor';
import { LogoSystemEditor } from '../editors/LogoSystemEditor';
import { ColorSystemEditor } from '../editors/ColorSystemEditor';
import { TypographySystemEditor } from '../editors/TypographySystemEditor';
import { ImageryEditor } from '../editors/ImageryEditor';
import { GraphicLanguageEditor } from '../editors/GraphicLanguageEditor';
import { LayoutCompositionEditor } from '../editors/LayoutCompositionEditor';
import { VisualAssetsEditor } from '../editors/VisualAssetsEditor';
import { VisualRulesEditor } from '../editors/VisualRulesEditor';
import { MessagingEditor } from '../editors/MessagingEditor';
import { NamingEditor } from '../editors/NamingEditor';
import { BrandArchitectureEditor } from '../editors/BrandArchitectureEditor';
import { TouchpointsEditor } from '../editors/TouchpointsEditor';

import { SlidersHorizontal, AlertCircle } from 'lucide-react';

interface GuidedBrandExperienceProps {
  brand: Brand;
  uiLanguage: Language;
  contentLanguage: Language;
  onUpdateModuleData: (moduleId: ModuleId, updatedData: any) => void;
  onOpenModuleManager: () => void;
}

export const GuidedBrandExperience: React.FC<GuidedBrandExperienceProps> = ({
  brand,
  uiLanguage,
  contentLanguage,
  onUpdateModuleData,
  onOpenModuleManager
}) => {
  const [activeStageId, setActiveStageId] = useState<GuidanceStageId>('stage1_discover');
  const [activeTopicId, setActiveTopicId] = useState<string | undefined>(undefined);
  const [isGuidanceOpen, setIsGuidanceOpen] = useState<boolean>(true);
  const [interactionState] = useState<GuidanceInteractionState>({});

  const [visualKnowledgeTab, setVisualKnowledgeTab] = useState<
    'logo' | 'color' | 'typography' | 'imagery' | 'graphicLanguage' | 'layoutComposition'
  >('logo');

  // Compute Stage Summaries and Next Recommendation using Guidance Controller
  const currentStage = getGuidanceStage(activeStageId) || GUIDANCE_STAGES[0];
  const stageSummaries = GUIDANCE_STAGES.map((s) =>
    calculateStageProgress(brand, s, interactionState)
  );
  const recommendation = getRecommendedNext(brand, interactionState);

  const activeModules = brand.activeModules || [];
  const activeSet = new Set(activeModules);
  const stageActiveModules = currentStage.primaryModuleIds.filter((mId) => activeSet.has(mId));
  const hasActiveModulesInStage = stageActiveModules.length > 0;

  const handleStageSelect = (stageId: GuidanceStageId) => {
    setActiveStageId(stageId);
    const targetStage = getGuidanceStage(stageId);
    if (targetStage && targetStage.topics.length > 0) {
      setActiveTopicId(targetStage.topics[0].id);
    }
  };

  const handleNavigateToRecommendation = (stageId: string) => {
    handleStageSelect(stageId as GuidanceStageId);
  };

  return (
    <div className="guided-brand-experience">
      {/* 1. Stage Journey Ribbon */}
      <StageJourneyRibbon
        stages={GUIDANCE_STAGES}
        stageSummaries={stageSummaries}
        activeStageId={activeStageId}
        uiLanguage={uiLanguage}
        onSelectStage={handleStageSelect}
      />

      {/* 2. Stage Narrative Header */}
      <StageNarrativeHeader
        stage={currentStage}
        recommendation={recommendation}
        uiLanguage={uiLanguage}
        onNavigateToRecommendation={handleNavigateToRecommendation}
      />

      {/* 3. Inactive Stage Notice if no modules in this stage are activated */}
      {!hasActiveModulesInStage && (
        <div
          style={{
            padding: '24px',
            backgroundColor: 'var(--bg-muted)',
            borderRadius: 'var(--radius-lg)',
            border: '1px dashed var(--border-medium)',
            textAlign: 'center',
            marginBottom: '24px'
          }}
        >
          <AlertCircle size={28} color="var(--text-subtle)" style={{ marginBottom: '8px' }} />
          <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: '0 0 4px 0', color: 'var(--text-main)' }}>
            {uiLanguage === 'id'
              ? 'Modul dalam Tahap Ini Belum Diaktifkan'
              : 'Modules in This Stage Are Currently Inactive'}
          </h3>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-subtle)', margin: '0 0 16px 0' }}>
            {uiLanguage === 'id'
              ? 'Merek ini belum mengaktifkan modul untuk tahap ini. Anda dapat mengaktifkannya kapan saja sesuai kebutuhan cakupan proyek.'
              : 'This brand has not activated modules for this stage. You can activate them at any time to expand your project scope.'}
          </p>
          <button
            onClick={onOpenModuleManager}
            className="btn btn-secondary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <SlidersHorizontal size={14} />
            <span>{uiLanguage === 'id' ? 'Buka Pengelola Modul' : 'Open Module Manager'}</span>
          </button>
        </div>
      )}

      {/* 4. Contextual Guidance Drawer */}
      {hasActiveModulesInStage && (
        <ContextualGuidanceDrawer
          topics={currentStage.topics}
          activeTopicId={activeTopicId}
          uiLanguage={uiLanguage}
          isOpen={isGuidanceOpen}
          onClose={() => setIsGuidanceOpen(false)}
          onSelectTopic={(topicId) => setActiveTopicId(topicId)}
        />
      )}

      {/* 5. Embedded Frozen Editors for Active Modules in This Stage */}
      {hasActiveModulesInStage && (
        <div className="guided-stage-editors" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {stageActiveModules.map((mId) => {
            return (
              <div key={mId} className="guided-module-card">
                {/* Stage 1: overview, strategy */}
                {mId === 'overview' && (
                  <OverviewEditor
                    data={brand.modules.overview}
                    uiLanguage={uiLanguage}
                    contentLanguage={contentLanguage}
                    onChange={(updated) => onUpdateModuleData('overview', updated)}
                  />
                )}
                {mId === 'strategy' && (
                  <StrategyEditor
                    data={brand.modules.strategy}
                    uiLanguage={uiLanguage}
                    contentLanguage={contentLanguage}
                    onChange={(updated) => onUpdateModuleData('strategy', updated)}
                  />
                )}

                {/* Stage 2: positioning */}
                {mId === 'positioning' && (
                  <PositioningEditor
                    data={brand.modules.positioning}
                    uiLanguage={uiLanguage}
                    contentLanguage={contentLanguage}
                    onChange={(updated) => onUpdateModuleData('positioning', updated)}
                  />
                )}

                {/* Stage 3: personality, voiceTone, messaging */}
                {mId === 'personality' && (
                  <PersonalityEditor
                    data={brand.modules.personality}
                    uiLanguage={uiLanguage}
                    contentLanguage={contentLanguage}
                    onChange={(updated) => onUpdateModuleData('personality', updated)}
                  />
                )}
                {mId === 'voiceTone' && (
                  <VoiceToneEditor
                    data={brand.modules.voiceTone}
                    uiLanguage={uiLanguage}
                    contentLanguage={contentLanguage}
                    onChange={(updated) => onUpdateModuleData('voiceTone', updated)}
                  />
                )}
                {mId === 'messaging' && (
                  <MessagingEditor
                    data={brand.modules.messaging}
                    brand={brand}
                    uiLanguage={uiLanguage}
                    contentLanguage={contentLanguage}
                    onChange={(updated) => onUpdateModuleData('messaging', updated)}
                  />
                )}

                {/* Stage 4: visualKnowledge, visualAssets */}
                {(mId === 'visualKnowledge' || mId === 'visualBasics') && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
                      <button
                        className={`btn ${visualKnowledgeTab === 'logo' ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ fontSize: '0.86rem' }}
                        onClick={() => setVisualKnowledgeTab('logo')}
                      >
                        Logo
                      </button>
                      <button
                        className={`btn ${visualKnowledgeTab === 'color' ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ fontSize: '0.86rem' }}
                        onClick={() => setVisualKnowledgeTab('color')}
                      >
                        Color
                      </button>
                      <button
                        className={`btn ${visualKnowledgeTab === 'typography' ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ fontSize: '0.86rem' }}
                        onClick={() => setVisualKnowledgeTab('typography')}
                      >
                        Typography
                      </button>
                      <button
                        className={`btn ${visualKnowledgeTab === 'imagery' ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ fontSize: '0.86rem' }}
                        onClick={() => setVisualKnowledgeTab('imagery')}
                      >
                        Imagery
                      </button>
                      <button
                        className={`btn ${visualKnowledgeTab === 'graphicLanguage' ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ fontSize: '0.86rem' }}
                        onClick={() => setVisualKnowledgeTab('graphicLanguage')}
                      >
                        Graphic Language
                      </button>
                      <button
                        className={`btn ${visualKnowledgeTab === 'layoutComposition' ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ fontSize: '0.86rem' }}
                        onClick={() => setVisualKnowledgeTab('layoutComposition')}
                      >
                        Layout
                      </button>
                    </div>

                    {visualKnowledgeTab === 'logo' && (
                      <LogoSystemEditor
                        data={brand.modules.visualKnowledge || brand.modules.visualBasics}
                        uiLanguage={uiLanguage}
                        contentLanguage={contentLanguage}
                        onChange={(updated) => onUpdateModuleData('visualKnowledge', updated)}
                      />
                    )}
                    {visualKnowledgeTab === 'color' && (
                      <ColorSystemEditor
                        data={brand.modules.visualKnowledge || brand.modules.visualBasics}
                        uiLanguage={uiLanguage}
                        contentLanguage={contentLanguage}
                        onChange={(updated) => onUpdateModuleData('visualKnowledge', updated)}
                      />
                    )}
                    {visualKnowledgeTab === 'typography' && (
                      <TypographySystemEditor
                        data={brand.modules.visualKnowledge || brand.modules.visualBasics}
                        uiLanguage={uiLanguage}
                        contentLanguage={contentLanguage}
                        onChange={(updated) => onUpdateModuleData('visualKnowledge', updated)}
                      />
                    )}
                    {visualKnowledgeTab === 'imagery' && (
                      <ImageryEditor
                        data={brand.modules.visualKnowledge || brand.modules.visualBasics}
                        uiLanguage={uiLanguage}
                        contentLanguage={contentLanguage}
                        onChange={(updated) => onUpdateModuleData('visualKnowledge', updated)}
                      />
                    )}
                    {visualKnowledgeTab === 'graphicLanguage' && (
                      <GraphicLanguageEditor
                        data={brand.modules.visualKnowledge || brand.modules.visualBasics}
                        uiLanguage={uiLanguage}
                        contentLanguage={contentLanguage}
                        onChange={(updated) => onUpdateModuleData('visualKnowledge', updated)}
                      />
                    )}
                    {visualKnowledgeTab === 'layoutComposition' && (
                      <LayoutCompositionEditor
                        data={brand.modules.visualKnowledge || brand.modules.visualBasics}
                        uiLanguage={uiLanguage}
                        contentLanguage={contentLanguage}
                        onChange={(updated) => onUpdateModuleData('visualKnowledge', updated)}
                      />
                    )}
                  </div>
                )}

                {mId === 'visualAssets' && (
                  <VisualAssetsEditor
                    data={brand.modules.visualAssets}
                    uiLanguage={uiLanguage}
                    contentLanguage={contentLanguage}
                    onChange={(updated) => onUpdateModuleData('visualAssets', updated)}
                  />
                )}

                {/* Stage 5: visualRules, brandNaming */}
                {mId === 'visualRules' && (
                  <VisualRulesEditor
                    data={brand.modules.visualRules}
                    brand={brand}
                    uiLanguage={uiLanguage}
                    contentLanguage={contentLanguage}
                    onChange={(updated) => onUpdateModuleData('visualRules', updated)}
                  />
                )}
                {mId === 'brandNaming' && (
                  <NamingEditor
                    data={brand.modules.brandNaming}
                    brand={brand}
                    uiLanguage={uiLanguage}
                    contentLanguage={contentLanguage}
                    onChange={(updated) => onUpdateModuleData('brandNaming', updated)}
                  />
                )}

                {/* Stage 6: brandExpression, brandArchitecture */}
                {mId === 'brandExpression' && (
                  <TouchpointsEditor
                    data={brand.modules.brandExpression}
                    brand={brand}
                    uiLanguage={uiLanguage}
                    contentLanguage={contentLanguage}
                    onChange={(updated) => onUpdateModuleData('brandExpression', updated)}
                  />
                )}
                {mId === 'brandArchitecture' && (
                  <BrandArchitectureEditor
                    data={brand.modules.brandArchitecture}
                    brand={brand}
                    uiLanguage={uiLanguage}
                    contentLanguage={contentLanguage}
                    onChange={(updated) => onUpdateModuleData('brandArchitecture', updated)}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
