import React from 'react';
import { GuidanceStage, GuidanceRecommendation } from '../../types/guidance';
import { Language, getLocalizedText } from '../../types/brand';
import { Sparkles, Lightbulb, ArrowRight, Compass } from 'lucide-react';

interface StageNarrativeHeaderProps {
  stage: GuidanceStage;
  recommendation?: GuidanceRecommendation;
  uiLanguage: Language;
  onNavigateToRecommendation?: (stageId: string, moduleId: string) => void;
}

export const StageNarrativeHeader: React.FC<StageNarrativeHeaderProps> = ({
  stage,
  recommendation,
  uiLanguage,
  onNavigateToRecommendation
}) => {
  const stageTitle = getLocalizedText(stage.title, uiLanguage).text;
  const stageTagline = getLocalizedText(stage.tagline, uiLanguage).text;
  const learningObjective = getLocalizedText(stage.learningObjective, uiLanguage).text;
  const designerMentalModel = getLocalizedText(stage.designerMentalModel, uiLanguage).text;

  const isRecommendingCurrentStage = recommendation && recommendation.stageId === stage.id;

  return (
    <div
      className="stage-narrative-header"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        padding: '20px 24px',
        backgroundColor: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-light)',
        marginBottom: '24px'
      }}
    >
      {/* Top Title & Tagline */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--accent-primary)',
                backgroundColor: 'var(--accent-light)',
                padding: '2px 8px',
                borderRadius: 'var(--radius-sm)'
              }}
            >
              {uiLanguage === 'id' ? `Tahap ${stage.stageNumber}` : `Stage ${stage.stageNumber}`}
            </span>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
              {stageTitle}
            </h1>
          </div>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-subtle)', margin: 0, fontWeight: 500 }}>
            {stageTagline}
          </p>
        </div>
      </div>

      {/* Narrative Framing: Objective & Mental Model */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '16px',
          padding: '14px 16px',
          backgroundColor: 'var(--bg-muted)',
          borderRadius: 'var(--radius-md)',
          borderLeft: '3.5px solid var(--accent-primary)'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <Compass size={14} color="var(--accent-primary)" />
            <span style={{ fontSize: '0.76rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-subtle)' }}>
              {uiLanguage === 'id' ? 'Tujuan Pembelajaran' : 'Learning Objective'}
            </span>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-main)', margin: 0, lineHeight: 1.5 }}>
            {learningObjective}
          </p>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <Lightbulb size={14} color="var(--accent-primary)" />
            <span style={{ fontSize: '0.76rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-subtle)' }}>
              {uiLanguage === 'id' ? 'Pola Pikir Desainer' : 'Designer Mental Model'}
            </span>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-main)', margin: 0, lineHeight: 1.5, fontStyle: 'italic' }}>
            "{designerMentalModel}"
          </p>
        </div>
      </div>

      {/* Advisory Recommendation Banner */}
      {recommendation && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            padding: '10px 14px',
            backgroundColor: 'var(--accent-light)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--accent-primary)',
            fontSize: '0.82rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={16} color="var(--accent-primary)" />
            <div>
              <span style={{ fontWeight: 700, color: 'var(--accent-primary)', marginRight: '6px' }}>
                {uiLanguage === 'id' ? 'Saran Langkah Selanjutnya:' : 'Recommended Next Step:'}
              </span>
              <span style={{ color: 'var(--text-main)' }}>
                {recommendation.reasonCode === 'firstIncompleteStage' &&
                  (uiLanguage === 'id'
                    ? 'Mulai dengan melengkapi modul yang belum terisi.'
                    : 'Begin by defining the foundational core fields.')}
                {recommendation.reasonCode === 'activeModuleIncomplete' &&
                  (uiLanguage === 'id'
                    ? 'Lanjutkan pengisian modul aktif yang sedang berjalan.'
                    : 'Continue authoring the in-progress module.')}
                {recommendation.reasonCode === 'upstreamDependency' &&
                  (uiLanguage === 'id'
                    ? 'Tinjau modul hilir ini untuk menyesuaikan dengan keputusan sebelumnya.'
                    : 'Review this downstream area to align with prior strategic decisions.')}
                {recommendation.reasonCode === 'revisitSuggested' &&
                  (uiLanguage === 'id'
                    ? 'Pastikan aturan tata kelola mencakup aplikasi media baru Anda.'
                    : 'Ensure governance rules protect your newly defined touchpoints.')}
                {recommendation.reasonCode === 'optionalExploration' &&
                  (uiLanguage === 'id'
                    ? 'Semua modul aktif sudah terisi. Anda dapat mengeksplorasi modul opsional lanjutan.'
                    : 'All active modules are defined. You may explore optional advanced modules.')}
              </span>
            </div>
          </div>

          {!isRecommendingCurrentStage && onNavigateToRecommendation && (
            <button
              onClick={() => onNavigateToRecommendation(recommendation.stageId, recommendation.moduleId)}
              className="btn btn-secondary btn-sm"
              style={{ flexShrink: 0, fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <span>{uiLanguage === 'id' ? 'Buka Modul' : 'Open Module'}</span>
              <ArrowRight size={12} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
