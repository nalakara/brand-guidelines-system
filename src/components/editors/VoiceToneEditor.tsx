import React, { useState } from 'react';
import { VoiceToneModule, Language, WritingExample, updateLocalizedString } from '../../types/brand';
import { LocalizedTextarea } from '../ui/LocalizedInput';
import { t } from '../../i18n/translations';
import { Plus, Trash2, X } from 'lucide-react';

interface VoiceToneEditorProps {
  data?: VoiceToneModule;
  uiLanguage: Language;
  contentLanguage: Language;
  onChange: (updated: VoiceToneModule) => void;
}

export const VoiceToneEditor: React.FC<VoiceToneEditorProps> = ({
  data,
  uiLanguage,
  contentLanguage,
  onChange
}) => {
  const current: VoiceToneModule = data || {
    principles: [],
    toneGuidelines: { en: '', id: '' },
    wordsToUse: [],
    wordsToAvoid: [],
    examples: [],
    channelNotes: []
  };

  const [useWordInput, setUseWordInput] = useState('');
  const [avoidWordInput, setAvoidWordInput] = useState('');

  const updateField = (field: keyof VoiceToneModule, val: any) => {
    onChange({ ...current, [field]: val });
  };

  const addPrinciple = () => {
    updateField('principles', [...current.principles, { en: '', id: '' }]);
  };

  const updatePrinciple = (idx: number, textVal: string) => {
    const updated = [...current.principles];
    updated[idx] = updateLocalizedString(updated[idx], contentLanguage, textVal);
    updateField('principles', updated);
  };

  const removePrinciple = (idx: number) => {
    updateField('principles', current.principles.filter((_, i) => i !== idx));
  };

  const addWordToUse = () => {
    if (!useWordInput.trim()) return;
    const newWord = { [contentLanguage]: useWordInput.trim() };
    updateField('wordsToUse', [...current.wordsToUse, newWord]);
    setUseWordInput('');
  };

  const removeWordToUse = (idx: number) => {
    updateField('wordsToUse', current.wordsToUse.filter((_, i) => i !== idx));
  };

  const addWordToAvoid = () => {
    if (!avoidWordInput.trim()) return;
    const newWord = { [contentLanguage]: avoidWordInput.trim() };
    updateField('wordsToAvoid', [...current.wordsToAvoid, newWord]);
    setAvoidWordInput('');
  };

  const removeWordToAvoid = (idx: number) => {
    updateField('wordsToAvoid', current.wordsToAvoid.filter((_, i) => i !== idx));
  };

  const addExample = () => {
    const newEx: WritingExample = {
      id: 'ex-' + Date.now(),
      context: { en: '', id: '' },
      before: { en: '', id: '' },
      after: { en: '', id: '' }
    };
    updateField('examples', [...current.examples, newEx]);
  };

  const updateExample = (id: string, field: keyof WritingExample, textVal: string) => {
    const updated = current.examples.map(e => {
      if (e.id !== id) return e;
      return {
        ...e,
        [field]: updateLocalizedString(e[field] as any, contentLanguage, textVal)
      };
    });
    updateField('examples', updated);
  };

  const removeExample = (id: string) => {
    updateField('examples', current.examples.filter(e => e.id !== id));
  };

  const addChannelNote = () => {
    updateField('channelNotes', [...current.channelNotes, { en: '', id: '' }]);
  };

  const updateChannelNote = (idx: number, textVal: string) => {
    const updated = [...current.channelNotes];
    updated[idx] = updateLocalizedString(updated[idx], contentLanguage, textVal);
    updateField('channelNotes', updated);
  };

  const removeChannelNote = (idx: number) => {
    updateField('channelNotes', current.channelNotes.filter((_, i) => i !== idx));
  };

  return (
    <div className="editor-card">
      <div className="editor-header">
        <div>
          <h2 className="editor-title">{t('voiceToneTitle', uiLanguage)}</h2>
          <p className="editor-subtitle">{t('voiceToneSubtitle', uiLanguage)}</p>
        </div>
      </div>

      {/* Voice Principles */}
      <div className="form-group">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div>
            <label className="form-label" style={{ marginBottom: 0 }}>{t('principlesLabel', uiLanguage)}</label>
            <p className="form-hint" style={{ marginBottom: 0 }}>{t('principlesHint', uiLanguage)}</p>
          </div>
          <button type="button" className="btn btn-secondary btn-sm" onClick={addPrinciple}>
            <Plus size={14} /> {t('addPrinciple', uiLanguage)}
          </button>
        </div>

        <div className="repeatable-box">
          {current.principles.length === 0 ? (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-subtle)', textAlign: 'center', padding: '12px' }}>
              {t('noPrinciples', uiLanguage)}
            </p>
          ) : (
            current.principles.map((p, idx) => (
              <div key={idx} className="repeatable-item">
                <input
                  type="text"
                  className="form-control"
                  placeholder={`${t('principlePlaceholder', uiLanguage)} (${contentLanguage.toUpperCase()})...`}
                  value={typeof p === 'string' ? p : (p?.[contentLanguage] || '')}
                  onChange={(e) => updatePrinciple(idx, e.target.value)}
                />
                <button type="button" className="btn-icon" onClick={() => removePrinciple(idx)}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <LocalizedTextarea
        label={t('toneGuidelinesLabel', uiLanguage)}
        hint={t('toneGuidelinesHint', uiLanguage)}
        placeholder={t('toneGuidelinesPlaceholder', uiLanguage)}
        rows={3}
        value={current.toneGuidelines}
        contentLanguage={contentLanguage}
        onChange={(val) => updateField('toneGuidelines', val)}
      />

      {/* Vocabulary: Words to Use / Words to Avoid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
        <div>
          <label className="form-label">{t('wordsToUseLabel', uiLanguage)} ({contentLanguage.toUpperCase()})</label>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <input
              type="text"
              className="form-control"
              placeholder={t('addWordPlaceholder', uiLanguage)}
              value={useWordInput}
              onChange={(e) => setUseWordInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addWordToUse())}
            />
            <button type="button" className="btn btn-secondary btn-sm" onClick={addWordToUse}>{t('add', uiLanguage)}</button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {current.wordsToUse.map((w, idx) => {
              const textVal = typeof w === 'string' ? w : (w?.[contentLanguage] || w?.en || '');
              return (
                <span key={idx} style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '4px 10px', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  {textVal}
                  <button type="button" onClick={() => removeWordToUse(idx)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#166534' }}><X size={12} /></button>
                </span>
              );
            })}
          </div>
        </div>

        <div>
          <label className="form-label">{t('wordsToAvoidLabel', uiLanguage)} ({contentLanguage.toUpperCase()})</label>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <input
              type="text"
              className="form-control"
              placeholder={t('addWordPlaceholder', uiLanguage)}
              value={avoidWordInput}
              onChange={(e) => setAvoidWordInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addWordToAvoid())}
            />
            <button type="button" className="btn btn-secondary btn-sm" onClick={addWordToAvoid}>{t('add', uiLanguage)}</button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {current.wordsToAvoid.map((w, idx) => {
              const textVal = typeof w === 'string' ? w : (w?.[contentLanguage] || w?.en || '');
              return (
                <span key={idx} style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '4px 10px', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  {textVal}
                  <button type="button" onClick={() => removeWordToAvoid(idx)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#991b1b' }}><X size={12} /></button>
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Writing Examples */}
      <div className="form-group">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div>
            <label className="form-label" style={{ marginBottom: 0 }}>{t('examplesLabel', uiLanguage)}</label>
            <p className="form-hint" style={{ marginBottom: 0 }}>{t('examplesHint', uiLanguage)}</p>
          </div>
          <button type="button" className="btn btn-secondary btn-sm" onClick={addExample}>
            <Plus size={14} /> {t('addExample', uiLanguage)}
          </button>
        </div>

        <div className="repeatable-box">
          {current.examples.length === 0 ? (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-subtle)', textAlign: 'center', padding: '12px' }}>
              {t('noExamples', uiLanguage)}
            </p>
          ) : (
            current.examples.map((ex) => (
              <div key={ex.id} className="repeatable-item-block">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder={`${t('contextPlaceholder', uiLanguage)} (${contentLanguage.toUpperCase()})`}
                    value={typeof ex.context === 'string' ? ex.context : (ex.context?.[contentLanguage] || '')}
                    style={{ fontWeight: 600, width: '60%' }}
                    onChange={(e) => updateExample(ex.id, 'context', e.target.value)}
                  />
                  <button type="button" className="btn-icon" onClick={() => removeExample(ex.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#991b1b' }}>{t('beforeLabel', uiLanguage)} ({contentLanguage.toUpperCase()})</label>
                    <textarea
                      className="form-control"
                      rows={2}
                      placeholder="Off-brand example text..."
                      value={typeof ex.before === 'string' ? ex.before : (ex.before?.[contentLanguage] || '')}
                      style={{ borderColor: '#fca5a5' }}
                      onChange={(e) => updateExample(ex.id, 'before', e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#166534' }}>{t('afterLabel', uiLanguage)} ({contentLanguage.toUpperCase()})</label>
                    <textarea
                      className="form-control"
                      rows={2}
                      placeholder="On-brand rewrite..."
                      value={typeof ex.after === 'string' ? ex.after : (ex.after?.[contentLanguage] || '')}
                      style={{ borderColor: '#86efac' }}
                      onChange={(e) => updateExample(ex.id, 'after', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Channel Notes */}
      <div className="form-group">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div>
            <label className="form-label" style={{ marginBottom: 0 }}>{t('channelNotesLabel', uiLanguage)}</label>
            <p className="form-hint" style={{ marginBottom: 0 }}>{t('channelNotesHint', uiLanguage)}</p>
          </div>
          <button type="button" className="btn btn-secondary btn-sm" onClick={addChannelNote}>
            <Plus size={14} /> {t('addChannelNote', uiLanguage)}
          </button>
        </div>

        <div className="repeatable-box">
          {current.channelNotes.length === 0 ? (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-subtle)', textAlign: 'center', padding: '12px' }}>
              {t('noChannelNotes', uiLanguage)}
            </p>
          ) : (
            current.channelNotes.map((note, idx) => (
              <div key={idx} className="repeatable-item">
                <input
                  type="text"
                  className="form-control"
                  placeholder={`${t('channelNotePlaceholder', uiLanguage)} (${contentLanguage.toUpperCase()})...`}
                  value={typeof note === 'string' ? note : (note?.[contentLanguage] || '')}
                  onChange={(e) => updateChannelNote(idx, e.target.value)}
                />
                <button type="button" className="btn-icon" onClick={() => removeChannelNote(idx)}>
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
