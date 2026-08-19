import React from 'react';
import {
  BrandStrategyModule,
  Language,
  StrategicValueEntity,
  StrategicPriorityEntity,
  LocalizedString
} from '../../types/brand';
import { LocalizedInput, LocalizedTextarea } from '../ui/LocalizedInput';
import { t } from '../../i18n/translations';
import { Plus, Trash2, Shield, Compass } from 'lucide-react';

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

  // --- Values ---
  const addValue = () => {
    const newVal: StrategicValueEntity = {
      id: 'val-' + Date.now(),
      title: { en: '', id: '' },
      description: { en: '', id: '' },
      tags: []
    };
    updateField('values', [...current.values, newVal]);
  };

  const updateValue = (id: string, key: 'title' | 'description', localizedVal: LocalizedString) => {
    const updatedVals = current.values.map((v) => {
      if (v.id !== id) return v;
      return {
        ...v,
        [key]: localizedVal
      };
    });
    updateField('values', updatedVals);
  };

  const removeValue = (id: string) => {
    updateField('values', current.values.filter((v) => v.id !== id));
  };

  // --- Priorities ---
  const addPriority = () => {
    const newPri: StrategicPriorityEntity = {
      id: 'pri-' + Date.now(),
      title: { en: '', id: '' },
      description: { en: '', id: '' },
      timeframe: 'Near-term'
    };
    updateField('priorities', [...current.priorities, newPri]);
  };

  const updatePriority = (id: string, key: 'title' | 'description' | 'timeframe', val: any) => {
    const updatedPris = current.priorities.map((p) => {
      if (p.id !== id) return p;
      return {
        ...p,
        [key]: val
      };
    });
    updateField('priorities', updatedPris);
  };

  const removePriority = (id: string) => {
    updateField('priorities', current.priorities.filter((p) => p.id !== id));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header & Core Beliefs */}
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
      </div>

      {/* Strategic Values */}
      <div className="editor-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
              {t('valuesTitle', uiLanguage)}
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              {t('valuesSubtitle', uiLanguage)}
            </p>
          </div>
          <button type="button" className="btn btn-secondary btn-sm" onClick={addValue}>
            <Plus size={14} /> {t('addValue', uiLanguage)}
          </button>
        </div>

        {current.values.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', border: '1px dashed var(--border-light)', borderRadius: 'var(--radius-md)' }}>
            <Shield size={24} style={{ margin: '0 auto 8px', opacity: 0.6 }} />
            <p style={{ fontSize: '0.86rem' }}>{t('noValuesDefined', uiLanguage)}</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {current.values.map((val, idx) => (
              <div
                key={val.id}
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
                    Value #{idx + 1}
                  </span>
                  <button
                    type="button"
                    className="btn-icon"
                    style={{ color: '#ef4444' }}
                    onClick={() => removeValue(val.id)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <LocalizedInput
                  label="Title *"
                  placeholder="e.g. Radical Transparency"
                  value={val.title}
                  contentLanguage={contentLanguage}
                  onChange={(text) => updateValue(val.id, 'title', text)}
                />

                <LocalizedTextarea
                  label="Description"
                  placeholder="Define what this value means in practice..."
                  rows={2}
                  value={val.description}
                  contentLanguage={contentLanguage}
                  onChange={(text) => updateValue(val.id, 'description', text)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Strategic Priorities */}
      <div className="editor-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
              {t('prioritiesTitle', uiLanguage)}
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              {t('prioritiesSubtitle', uiLanguage)}
            </p>
          </div>
          <button type="button" className="btn btn-secondary btn-sm" onClick={addPriority}>
            <Plus size={14} /> {t('addPriority', uiLanguage)}
          </button>
        </div>

        {current.priorities.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', border: '1px dashed var(--border-light)', borderRadius: 'var(--radius-md)' }}>
            <Compass size={24} style={{ margin: '0 auto 8px', opacity: 0.6 }} />
            <p style={{ fontSize: '0.86rem' }}>{t('noPrioritiesDefined', uiLanguage)}</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {current.priorities.map((pri, idx) => (
              <div
                key={pri.id}
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
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span className="badge badge-secondary" style={{ fontSize: '0.74rem' }}>
                      Priority #{idx + 1}
                    </span>
                    <select
                      className="form-control"
                      style={{ fontSize: '0.78rem', padding: '2px 8px', height: 'auto', width: '120px' }}
                      value={pri.timeframe || 'Near-term'}
                      onChange={(e) => updatePriority(pri.id, 'timeframe', e.target.value)}
                    >
                      <option value="Near-term">Near-term</option>
                      <option value="Mid-term">Mid-term</option>
                      <option value="Long-term">Long-term</option>
                    </select>
                  </div>
                  <button
                    type="button"
                    className="btn-icon"
                    style={{ color: '#ef4444' }}
                    onClick={() => removePriority(pri.id)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <LocalizedInput
                  label="Initiative / Objective *"
                  placeholder="e.g. Deepen direct-trade producer partnerships"
                  value={pri.title}
                  contentLanguage={contentLanguage}
                  onChange={(text) => updatePriority(pri.id, 'title', text)}
                />

                <LocalizedTextarea
                  label="Rationale & Notes"
                  placeholder="Context, milestones, or success criteria..."
                  rows={2}
                  value={pri.description}
                  contentLanguage={contentLanguage}
                  onChange={(text) => updatePriority(pri.id, 'description', text)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
