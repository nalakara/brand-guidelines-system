import React from 'react';
import { PositioningModule, Language, updateLocalizedString } from '../../types/brand';
import { LocalizedInput, LocalizedTextarea } from '../ui/LocalizedInput';
import { t } from '../../i18n/translations';
import { Plus, Trash2 } from 'lucide-react';

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
    targetAudience: { en: '', id: '' },
    marketCategory: { en: '', id: '' },
    coreProblem: { en: '', id: '' },
    differentiators: [],
    competitiveAlternatives: { en: '', id: '' },
    positioningStatement: { en: '', id: '' }
  };

  const updateField = (field: keyof PositioningModule, val: any) => {
    onChange({ ...current, [field]: val });
  };

  const addDifferentiator = () => {
    updateField('differentiators', [...current.differentiators, { en: '', id: '' }]);
  };

  const updateDifferentiator = (index: number, textVal: string) => {
    const updated = [...current.differentiators];
    updated[index] = updateLocalizedString(updated[index], contentLanguage, textVal);
    updateField('differentiators', updated);
  };

  const removeDifferentiator = (index: number) => {
    updateField('differentiators', current.differentiators.filter((_, i) => i !== index));
  };

  return (
    <div className="editor-card">
      <div className="editor-header">
        <div>
          <h2 className="editor-title">{t('positioningTitle', uiLanguage)}</h2>
          <p className="editor-subtitle">{t('positioningSubtitle', uiLanguage)}</p>
        </div>
      </div>

      <LocalizedTextarea
        label={t('targetAudienceLabel', uiLanguage)}
        hint={t('targetAudienceHint', uiLanguage)}
        placeholder={t('targetAudiencePlaceholder', uiLanguage)}
        rows={3}
        value={current.targetAudience}
        contentLanguage={contentLanguage}
        onChange={(val) => updateField('targetAudience', val)}
      />

      <LocalizedInput
        label={t('marketCategoryLabel', uiLanguage)}
        placeholder={t('marketCategoryPlaceholder', uiLanguage)}
        value={current.marketCategory}
        contentLanguage={contentLanguage}
        onChange={(val) => updateField('marketCategory', val)}
      />

      <LocalizedTextarea
        label={t('coreProblemLabel', uiLanguage)}
        hint={t('coreProblemHint', uiLanguage)}
        placeholder={t('coreProblemPlaceholder', uiLanguage)}
        rows={2}
        value={current.coreProblem}
        contentLanguage={contentLanguage}
        onChange={(val) => updateField('coreProblem', val)}
      />

      <div className="form-group">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div>
            <label className="form-label" style={{ marginBottom: 0 }}>{t('differentiatorsLabel', uiLanguage)}</label>
            <p className="form-hint" style={{ marginBottom: 0 }}>{t('differentiatorsHint', uiLanguage)}</p>
          </div>
          <button type="button" className="btn btn-secondary btn-sm" onClick={addDifferentiator}>
            <Plus size={14} /> {t('addDifferentiator', uiLanguage)}
          </button>
        </div>

        <div className="repeatable-box">
          {current.differentiators.length === 0 ? (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-subtle)', textAlign: 'center', padding: '12px' }}>
              {t('noDifferentiators', uiLanguage)}
            </p>
          ) : (
            current.differentiators.map((diff, idx) => (
              <div key={idx} className="repeatable-item">
                <input
                  type="text"
                  className="form-control"
                  placeholder={`${t('differentiatorPlaceholder', uiLanguage)} (${contentLanguage.toUpperCase()})...`}
                  value={typeof diff === 'string' ? diff : (diff?.[contentLanguage] || '')}
                  onChange={(e) => updateDifferentiator(idx, e.target.value)}
                />
                <button type="button" className="btn-icon" onClick={() => removeDifferentiator(idx)}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <LocalizedInput
        label={t('competitiveAlternativesLabel', uiLanguage)}
        placeholder={t('competitiveAlternativesPlaceholder', uiLanguage)}
        value={current.competitiveAlternatives}
        contentLanguage={contentLanguage}
        onChange={(val) => updateField('competitiveAlternatives', val)}
      />

      <LocalizedTextarea
        label={t('positioningStatementLabel', uiLanguage)}
        hint={t('positioningStatementHint', uiLanguage)}
        placeholder={t('positioningStatementPlaceholder', uiLanguage)}
        rows={4}
        value={current.positioningStatement}
        contentLanguage={contentLanguage}
        onChange={(val) => updateField('positioningStatement', val)}
      />
    </div>
  );
};
