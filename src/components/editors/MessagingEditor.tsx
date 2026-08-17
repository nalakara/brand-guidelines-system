import React from 'react';
import { MessagingModule, Language, updateLocalizedString } from '../../types/brand';
import { LocalizedInput, LocalizedTextarea } from '../ui/LocalizedInput';
import { t } from '../../i18n/translations';
import { Plus, Trash2 } from 'lucide-react';

interface MessagingEditorProps {
  data?: MessagingModule;
  uiLanguage: Language;
  contentLanguage: Language;
  onChange: (updated: MessagingModule) => void;
}

export const MessagingEditor: React.FC<MessagingEditorProps> = ({
  data,
  uiLanguage,
  contentLanguage,
  onChange
}) => {
  const current: MessagingModule = data || {
    tagline: { en: '', id: '' },
    elevatorPitch: { en: '', id: '' },
    keyMessages: [],
    proofPoints: [],
    callsToAction: []
  };

  const updateField = (field: keyof MessagingModule, val: any) => {
    onChange({ ...current, [field]: val });
  };

  const addListField = (field: 'keyMessages' | 'proofPoints' | 'callsToAction') => {
    updateField(field, [...current[field], { en: '', id: '' }]);
  };

  const updateListField = (
    field: 'keyMessages' | 'proofPoints' | 'callsToAction',
    idx: number,
    textVal: string
  ) => {
    const updated = [...current[field]];
    updated[idx] = updateLocalizedString(updated[idx], contentLanguage, textVal);
    updateField(field, updated);
  };

  const removeListField = (field: 'keyMessages' | 'proofPoints' | 'callsToAction', idx: number) => {
    updateField(field, current[field].filter((_, i) => i !== idx));
  };

  return (
    <div className="editor-card">
      <div className="editor-header">
        <div>
          <h2 className="editor-title">{t('messagingTitle', uiLanguage)}</h2>
          <p className="editor-subtitle">{t('messagingSubtitle', uiLanguage)}</p>
        </div>
      </div>

      <LocalizedInput
        label={t('taglineLabel', uiLanguage)}
        placeholder={t('taglinePlaceholder', uiLanguage)}
        value={current.tagline}
        contentLanguage={contentLanguage}
        onChange={(val) => updateField('tagline', val)}
      />

      <LocalizedTextarea
        label={t('elevatorPitchLabel', uiLanguage)}
        hint={t('elevatorPitchHint', uiLanguage)}
        placeholder={t('elevatorPitchPlaceholder', uiLanguage)}
        rows={3}
        value={current.elevatorPitch}
        contentLanguage={contentLanguage}
        onChange={(val) => updateField('elevatorPitch', val)}
      />

      {/* Key Messages */}
      <div className="form-group">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div>
            <label className="form-label" style={{ marginBottom: 0 }}>{t('keyMessagesLabel', uiLanguage)}</label>
            <p className="form-hint" style={{ marginBottom: 0 }}>{t('keyMessagesHint', uiLanguage)}</p>
          </div>
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => addListField('keyMessages')}>
            <Plus size={14} /> {t('addMessage', uiLanguage)}
          </button>
        </div>

        <div className="repeatable-box">
          {current.keyMessages.length === 0 ? (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-subtle)', textAlign: 'center', padding: '12px' }}>
              {t('noMessages', uiLanguage)}
            </p>
          ) : (
            current.keyMessages.map((msg, idx) => (
              <div key={idx} className="repeatable-item">
                <input
                  type="text"
                  className="form-control"
                  placeholder={`${t('messagePlaceholder', uiLanguage)} (${contentLanguage.toUpperCase()})...`}
                  value={typeof msg === 'string' ? msg : (msg?.[contentLanguage] || '')}
                  onChange={(e) => updateListField('keyMessages', idx, e.target.value)}
                />
                <button type="button" className="btn-icon" onClick={() => removeListField('keyMessages', idx)}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Proof Points */}
      <div className="form-group">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div>
            <label className="form-label" style={{ marginBottom: 0 }}>{t('proofPointsLabel', uiLanguage)}</label>
            <p className="form-hint" style={{ marginBottom: 0 }}>{t('proofPointsHint', uiLanguage)}</p>
          </div>
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => addListField('proofPoints')}>
            <Plus size={14} /> {t('addProofPoint', uiLanguage)}
          </button>
        </div>

        <div className="repeatable-box">
          {current.proofPoints.length === 0 ? (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-subtle)', textAlign: 'center', padding: '12px' }}>
              {t('noProofPoints', uiLanguage)}
            </p>
          ) : (
            current.proofPoints.map((point, idx) => (
              <div key={idx} className="repeatable-item">
                <input
                  type="text"
                  className="form-control"
                  placeholder={`${t('proofPointPlaceholder', uiLanguage)} (${contentLanguage.toUpperCase()})...`}
                  value={typeof point === 'string' ? point : (point?.[contentLanguage] || '')}
                  onChange={(e) => updateListField('proofPoints', idx, e.target.value)}
                />
                <button type="button" className="btn-icon" onClick={() => removeListField('proofPoints', idx)}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Calls to Action */}
      <div className="form-group">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div>
            <label className="form-label" style={{ marginBottom: 0 }}>{t('ctasLabel', uiLanguage)}</label>
            <p className="form-hint" style={{ marginBottom: 0 }}>{t('ctasHint', uiLanguage)}</p>
          </div>
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => addListField('callsToAction')}>
            <Plus size={14} /> {t('addCta', uiLanguage)}
          </button>
        </div>

        <div className="repeatable-box">
          {current.callsToAction.length === 0 ? (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-subtle)', textAlign: 'center', padding: '12px' }}>
              {t('noCtas', uiLanguage)}
            </p>
          ) : (
            current.callsToAction.map((cta, idx) => (
              <div key={idx} className="repeatable-item">
                <input
                  type="text"
                  className="form-control"
                  placeholder={`${t('ctaPlaceholder', uiLanguage)} (${contentLanguage.toUpperCase()})...`}
                  value={typeof cta === 'string' ? cta : (cta?.[contentLanguage] || '')}
                  onChange={(e) => updateListField('callsToAction', idx, e.target.value)}
                />
                <button type="button" className="btn-icon" onClick={() => removeListField('callsToAction', idx)}>
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
