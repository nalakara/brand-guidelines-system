import React from 'react';
import {
  PositioningModule,
  Language,
  AudienceEntity,
  DifferentiatorEntity,
  LocalizedString
} from '../../types/brand';
import { LocalizedInput, LocalizedTextarea } from '../ui/LocalizedInput';
import { t } from '../../i18n/translations';
import { Plus, Trash2, Users, Award } from 'lucide-react';

interface PositioningEditorProps {
  data?: PositioningModule;
  uiLanguage: Language;
  contentLanguage: Language;
  onChange: (updated: PositioningModule) => void;
}

export const PositioningEditor: React.FC<PositioningEditorProps> = ({
  data,
  uiLanguage,
  contentLanguage,
  onChange
}) => {
  const current: PositioningModule = data || {
    targetAudiences: [],
    marketCategory: { en: '', id: '' },
    coreProblem: { en: '', id: '' },
    differentiators: [],
    competitiveAlternatives: { en: '', id: '' },
    positioningStatement: { en: '', id: '' }
  };

  const updateField = (field: keyof PositioningModule, val: any) => {
    onChange({ ...current, [field]: val });
  };

  // --- Target Audiences ---
  const addAudience = () => {
    const newAud: AudienceEntity = {
      id: 'aud-' + Date.now(),
      name: { en: '', id: '' },
      description: { en: '', id: '' },
      needsPainPoints: { en: '', id: '' }
    };
    updateField('targetAudiences', [...current.targetAudiences, newAud]);
  };

  const updateAudience = (id: string, key: 'name' | 'description' | 'needsPainPoints', val: LocalizedString) => {
    const updated = current.targetAudiences.map((aud) => {
      if (aud.id !== id) return aud;
      return {
        ...aud,
        [key]: val
      };
    });
    updateField('targetAudiences', updated);
  };

  const removeAudience = (id: string) => {
    updateField('targetAudiences', current.targetAudiences.filter((a) => a.id !== id));
  };

  // --- Differentiators ---
  const addDifferentiator = () => {
    const newDiff: DifferentiatorEntity = {
      id: 'diff-' + Date.now(),
      title: { en: '', id: '' },
      description: { en: '', id: '' },
      evidence: { en: '', id: '' }
    };
    updateField('differentiators', [...current.differentiators, newDiff]);
  };

  const updateDifferentiator = (id: string, key: 'title' | 'description' | 'evidence', val: LocalizedString) => {
    const updated = current.differentiators.map((diff) => {
      if (diff.id !== id) return diff;
      return {
        ...diff,
        [key]: val
      };
    });
    updateField('differentiators', updated);
  };

  const removeDifferentiator = (id: string) => {
    updateField('differentiators', current.differentiators.filter((d) => d.id !== id));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Overview & Core Positioning Statement */}
      <div className="editor-card">
        <div className="editor-header">
          <div>
            <h2 className="editor-title">{t('positioningTitle', uiLanguage)}</h2>
            <p className="editor-subtitle">{t('positioningSubtitle', uiLanguage)}</p>
          </div>
        </div>

        <LocalizedInput
          label={t('marketCategoryLabel', uiLanguage)}
          placeholder={t('marketCategoryPlaceholder', uiLanguage)}
          value={current.marketCategory}
          contentLanguage={contentLanguage}
          onChange={(val) => updateField('marketCategory', val)}
        />

        <LocalizedTextarea
          label={t('coreProblemLabel', uiLanguage)}
          placeholder={t('coreProblemPlaceholder', uiLanguage)}
          rows={2}
          value={current.coreProblem}
          contentLanguage={contentLanguage}
          onChange={(val) => updateField('coreProblem', val)}
        />

        <LocalizedTextarea
          label={t('competitiveAlternativesLabel', uiLanguage)}
          placeholder={t('competitiveAlternativesPlaceholder', uiLanguage)}
          rows={2}
          value={current.competitiveAlternatives}
          contentLanguage={contentLanguage}
          onChange={(val) => updateField('competitiveAlternatives', val)}
        />

        <LocalizedTextarea
          label={t('positioningStatementLabel', uiLanguage)}
          hint={t('positioningStatementHint', uiLanguage)}
          placeholder={t('positioningStatementPlaceholder', uiLanguage)}
          rows={3}
          value={current.positioningStatement}
          contentLanguage={contentLanguage}
          onChange={(val) => updateField('positioningStatement', val)}
        />
      </div>

      {/* Target Audiences Entities */}
      <div className="editor-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
              {t('targetAudiencesTitle', uiLanguage)}
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              {t('targetAudiencesSubtitle', uiLanguage)}
            </p>
          </div>
          <button type="button" className="btn btn-secondary btn-sm" onClick={addAudience}>
            <Plus size={14} /> {t('addAudience', uiLanguage)}
          </button>
        </div>

        {current.targetAudiences.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', border: '1px dashed var(--border-light)', borderRadius: 'var(--radius-md)' }}>
            <Users size={24} style={{ margin: '0 auto 8px', opacity: 0.6 }} />
            <p style={{ fontSize: '0.86rem' }}>{t('noAudiencesDefined', uiLanguage)}</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {current.targetAudiences.map((aud, idx) => (
              <div
                key={aud.id}
                style={{
                  padding: '16px',
                  backgroundColor: 'var(--bg-muted)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-light)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="badge badge-secondary" style={{ fontSize: '0.74rem' }}>
                    Audience Segment #{idx + 1}
                  </span>
                  <button
                    type="button"
                    className="btn-icon"
                    style={{ color: '#ef4444' }}
                    onClick={() => removeAudience(aud.id)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <LocalizedInput
                  label="Segment Name *"
                  placeholder="e.g. Urban Creative Professionals"
                  value={aud.name}
                  contentLanguage={contentLanguage}
                  onChange={(text) => updateAudience(aud.id, 'name', text)}
                />

                <LocalizedTextarea
                  label="Profile & Mindset"
                  placeholder="Demographics, psychographics, and daily behaviors..."
                  rows={2}
                  value={aud.description}
                  contentLanguage={contentLanguage}
                  onChange={(text) => updateAudience(aud.id, 'description', text)}
                />

                <LocalizedTextarea
                  label="Core Needs & Pain Points"
                  placeholder="What friction or desire brings them to our brand?"
                  rows={2}
                  value={aud.needsPainPoints}
                  contentLanguage={contentLanguage}
                  onChange={(text) => updateAudience(aud.id, 'needsPainPoints', text)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Differentiators Entities */}
      <div className="editor-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
              {t('differentiatorsTitle', uiLanguage)}
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              {t('differentiatorsSubtitle', uiLanguage)}
            </p>
          </div>
          <button type="button" className="btn btn-secondary btn-sm" onClick={addDifferentiator}>
            <Plus size={14} /> {t('addDifferentiator', uiLanguage)}
          </button>
        </div>

        {current.differentiators.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', border: '1px dashed var(--border-light)', borderRadius: 'var(--radius-md)' }}>
            <Award size={24} style={{ margin: '0 auto 8px', opacity: 0.6 }} />
            <p style={{ fontSize: '0.86rem' }}>{t('noDifferentiatorsDefined', uiLanguage)}</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {current.differentiators.map((diff, idx) => (
              <div
                key={diff.id}
                style={{
                  padding: '16px',
                  backgroundColor: 'var(--bg-muted)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-light)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="badge badge-secondary" style={{ fontSize: '0.74rem' }}>
                    Differentiator #{idx + 1}
                  </span>
                  <button
                    type="button"
                    className="btn-icon"
                    style={{ color: '#ef4444' }}
                    onClick={() => removeDifferentiator(diff.id)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <LocalizedInput
                  label="Differentiator Headline *"
                  placeholder="e.g. Acoustically dampened cafe spaces designed for presence"
                  value={diff.title}
                  contentLanguage={contentLanguage}
                  onChange={(text) => updateDifferentiator(diff.id, 'title', text)}
                />

                <LocalizedTextarea
                  label="Explanation & Nuance"
                  placeholder="Why does this distinction matter to the customer?"
                  rows={2}
                  value={diff.description}
                  contentLanguage={contentLanguage}
                  onChange={(text) => updateDifferentiator(diff.id, 'description', text)}
                />

                <LocalizedTextarea
                  label="Proof / Concrete Evidence"
                  placeholder="Certifications, proprietary methods, or operational proof..."
                  rows={2}
                  value={diff.evidence}
                  contentLanguage={contentLanguage}
                  onChange={(text) => updateDifferentiator(diff.id, 'evidence', text)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
