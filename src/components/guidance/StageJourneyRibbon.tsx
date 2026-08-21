import React from 'react';
import { GuidanceStage, GuidanceStageId } from '../../types/guidance';
import { StageProgressSummary } from '../../utils/guidanceController';
import { Language, getLocalizedText } from '../../types/brand';
import { CheckCircle2, CircleDot, Circle, Compass } from 'lucide-react';

interface StageJourneyRibbonProps {
  stages: GuidanceStage[];
  stageSummaries: StageProgressSummary[];
  activeStageId: GuidanceStageId;
  uiLanguage: Language;
  onSelectStage: (stageId: GuidanceStageId) => void;
}

export const StageJourneyRibbon: React.FC<StageJourneyRibbonProps> = ({
  stages,
  stageSummaries,
  activeStageId,
  uiLanguage,
  onSelectStage
}) => {
  const summaryMap = new Map(stageSummaries.map((s) => [s.stageId, s]));

  return (
    <div
      className="stage-journey-ribbon"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        overflowX: 'auto',
        padding: '12px 16px',
        backgroundColor: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-light)',
        marginBottom: '20px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginRight: '8px', flexShrink: 0 }}>
        <Compass size={16} color="var(--accent-primary)" />
        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {uiLanguage === 'id' ? 'Alur Desain' : 'Design Journey'}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 'max-content' }}>
        {stages.map((stage) => {
          const summary = summaryMap.get(stage.id);
          const isCurrent = stage.id === activeStageId;
          const isActive = summary?.isActive ?? true;
          const knowledgeStatus = summary?.knowledgeStatus ?? 'empty';
          const title = getLocalizedText(stage.title, uiLanguage).text;

          // Status Icon calculation
          let StatusIcon = Circle;
          let iconColor = 'var(--text-muted)';
          if (knowledgeStatus === 'complete') {
            StatusIcon = CheckCircle2;
            iconColor = 'var(--color-success, #10b981)';
          } else if (knowledgeStatus === 'started') {
            StatusIcon = CircleDot;
            iconColor = 'var(--accent-primary)';
          }

          return (
            <button
              key={stage.id}
              onClick={() => onSelectStage(stage.id)}
              className="stage-ribbon-step"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 14px',
                borderRadius: 'var(--radius-md)',
                border: isCurrent
                  ? '1.5px solid var(--accent-primary)'
                  : '1px solid var(--border-light)',
                backgroundColor: isCurrent
                  ? 'var(--accent-light)'
                  : isActive
                  ? 'var(--bg-surface)'
                  : 'var(--bg-muted)',
                color: isCurrent ? 'var(--accent-primary)' : 'var(--text-main)',
                fontWeight: isCurrent ? 700 : 500,
                fontSize: '0.84rem',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                opacity: isActive ? 1 : 0.7
              }}
              title={getLocalizedText(stage.tagline, uiLanguage).text}
            >
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: isCurrent ? 'var(--accent-primary)' : 'var(--bg-muted)',
                  color: isCurrent ? '#ffffff' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.72rem',
                  fontWeight: 700
                }}
              >
                {stage.stageNumber}
              </div>

              <span>{title}</span>

              <StatusIcon size={14} color={iconColor} />
            </button>
          );
        })}
      </div>
    </div>
  );
};
