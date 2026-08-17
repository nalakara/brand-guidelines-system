import React from 'react';
import { BrandStrategyModule, Language, ValueItem, updateLocalizedString } from '../../types/brand';
import { LocalizedTextarea } from '../ui/LocalizedInput';
import { t } from '../../i18n/translations';
import { Plus, Trash2 } from 'lucide-react';

interface StrategyEditorProps {
  data?: BrandStrategyModule;
  uiLanguage: Language;
  contentLanguage: Language;
  onChange: (updated: BrandStrategyModule) => void;
}

export const StrategyEditor: React.FC<StrategyEditorProps> = ({
  data,
  uiLanguage,
  contentLanguage,
  onChange
}) => {
  const current: BrandStrategyModule = data || {
    purpose: { en: '', id: '' },
    mission: { en: '', id: '' },
    vision: { en: '', id: '' },
    values: [],
    priorities: []
  };

  const updateField = (field: keyof BrandStrategyModule, val: any) => {
    onChange({ ...current, [field]: val });
  };

  const addValue = () => {
    const newVal: ValueItem = {
      id: 'val-' + Date.now(),
      title: { en: '', id: '' },
      description: { en: '', id: '' }
    };
    updateField('values', [...current.values, newVal]);
  };

  const updateValue = (id: string, key: 'title' | 'description', textVal: string) => {
    const updatedVals = current.values.map(v => {
      if (v.id !== id) return v;
      return {
        ...v,
        [key]: updateLocalizedString(v[key], contentLanguage, textVal)
      };
    });
    updateField('values', updatedVals);
  };

  const removeValue = (id: string) => {
    updateField('values', current.values.filter(v => v.id !== id));
  };

  const addPriority = () => {
    updateField('priorities', [...current.priorities, { en: '', id: '' }]);
  };

  const updatePriority = (index: number, textVal: string) => {
    const updated = [...current.priorities];
    updated[index] = updateLocalizedString(updated[index], contentLanguage, textVal);
    updateField('priorities', updated);
  };

  const removePriority = (index: number) => {
    updateField('priorities', current.priorities.filter((_, i) => i !== index));
  };

  return (
    <div className="editor-card">
      <div className="editor-header">
        <div>
          <h2 className="editor-title">{t('strategyTitle', uiLanguage)}</h2>
          <p className="editor-subtitle">{t('strategySubtitle', uiLanguage)}</p>
        </div>
      </div>

      <LocalizedTextarea
        label={t('purposeLabel', uiLanguage)}
        hint={t('purposeHint', uiLanguage)}
        placeholder={t('purposePlaceholder', uiLanguage)}
        rows={2}
        value={current.purpose}
        contentLanguage={contentLanguage}
        onChange={(val) => updateField('purpose', val)}
      />

      <LocalizedTextarea
        label={t('missionLabel', uiLanguage)}
        hint={t('missionHint', uiLanguage)}
        placeholder={t('missionPlaceholder', uiLanguage)}
        rows={2}
        value={current.mission}
        contentLanguage={contentLanguage}
        onChange={(val) => updateField('mission', val)}
      />

      <LocalizedTextarea
        label={t('visionLabel', uiLanguage)}
        hint={t('visionHint', uiLanguage)}
        placeholder={t('visionPlaceholder', uiLanguage)}
        rows={2}
        value={current.vision}
        contentLanguage={contentLanguage}
        onChange={(val) => updateField('vision', val)}
      />

      {/* Core Values */}
      <div className="form-group">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div>
            <label className="form-label" style={{ marginBottom: 0 }}>{t('valuesLabel', uiLanguage)}</label>
            <p className="form-hint" style={{ marginBottom: 0 }}>{t('valuesHint', uiLanguage)}</p>
          </div>
          <button type="button" className="btn btn-secondary btn-sm" onClick={addValue}>
            <Plus size={14} /> {t('addValue', uiLanguage)}
          </button>
        </div>

        <div className="repeatable-box">
          {current.values.length === 0 ? (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-subtle)', textAlign: 'center', padding: '12px' }}>
              {t('noValues', uiLanguage)}
            </p>
          ) : (
            current.values.map((v) => (
              <div key={v.id} className="repeatable-item-block">
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder={`${t('valueTitlePlaceholder', uiLanguage)} (${contentLanguage.toUpperCase()})`}
                    value={typeof v.title === 'string' ? v.title : (v.title?.[contentLanguage] || '')}
                    style={{ fontWeight: 600 }}
                    onChange={(e) => updateValue(v.id, 'title', e.target.value)}
                  />
                  <button type="button" className="btn-icon" onClick={() => removeValue(v.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
                <input
                  type="text"
                  className="form-control"
                  placeholder={`${t('valueDescPlaceholder', uiLanguage)} (${contentLanguage.toUpperCase()})...`}
                  value={typeof v.description === 'string' ? v.description : (v.description?.[contentLanguage] || '')}
                  onChange={(e) => updateValue(v.id, 'description', e.target.value)}
                />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Strategic Priorities */}
      <div className="form-group">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div>
            <label className="form-label" style={{ marginBottom: 0 }}>{t('prioritiesLabel', uiLanguage)}</label>
            <p className="form-hint" style={{ marginBottom: 0 }}>{t('prioritiesHint', uiLanguage)}</p>
          </div>
          <button type="button" className="btn btn-secondary btn-sm" onClick={addPriority}>
            <Plus size={14} /> {t('addPriority', uiLanguage)}
          </button>
        </div>

        <div className="repeatable-box">
          {current.priorities.length === 0 ? (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-subtle)', textAlign: 'center', padding: '12px' }}>
              {t('noPriorities', uiLanguage)}
            </p>
          ) : (
            current.priorities.map((p, idx) => (
              <div key={idx} className="repeatable-item">
                <input
                  type="text"
                  className="form-control"
                  placeholder={`${t('priorityPlaceholder', uiLanguage)} (${contentLanguage.toUpperCase()})...`}
                  value={typeof p === 'string' ? p : (p?.[contentLanguage] || '')}
                  onChange={(e) => updatePriority(idx, e.target.value)}
                />
                <button type="button" className="btn-icon" onClick={() => removePriority(idx)}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
