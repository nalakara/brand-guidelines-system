import React, { useState } from 'react';
import {
  VoiceToneModule,
  Language,
  VoicePrincipleEntity,
  VocabularyEntity,
  WritingExampleEntity,
  LocalizedString
} from '../../types/brand';
import { LocalizedInput, LocalizedTextarea } from '../ui/LocalizedInput';
import { t } from '../../i18n/translations';
import { Plus, Trash2, MessageSquare, BookOpen, ThumbsUp, ThumbsDown } from 'lucide-react';

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
    vocabulary: [],
    examples: [],
    channelNotes: []
  };

  const [newVocabTerm, setNewVocabTerm] = useState('');
  const [newVocabType, setNewVocabType] = useState<'prefer' | 'avoid'>('prefer');

  const updateField = (field: keyof VoiceToneModule, val: any) => {
    onChange({ ...current, [field]: val });
  };

  // --- Voice Principles ---
  const addPrinciple = () => {
    const newPr: VoicePrincipleEntity = {
      id: 'vp-' + Date.now(),
      title: { en: '', id: '' },
      description: { en: '', id: '' },
      doExample: { en: '', id: '' },
      dontExample: { en: '', id: '' }
    };
    updateField('principles', [...current.principles, newPr]);
  };

  const updatePrinciple = (
    id: string,
    key: 'title' | 'description' | 'doExample' | 'dontExample',
    val: LocalizedString
  ) => {
    const updated = current.principles.map((pr) => {
      if (pr.id !== id) return pr;
      return {
        ...pr,
        [key]: val
      };
    });
    updateField('principles', updated);
  };

  const removePrinciple = (id: string) => {
    updateField('principles', current.principles.filter((pr) => pr.id !== id));
  };

  // --- Vocabulary ---
  const addVocabItem = () => {
    if (!newVocabTerm.trim()) return;
    const newVoc: VocabularyEntity = {
      id: 'voc-' + Date.now(),
      term: { [contentLanguage]: newVocabTerm.trim() },
      recommendation: newVocabType,
      context: { en: '', id: '' }
    };
    updateField('vocabulary', [...current.vocabulary, newVoc]);
    setNewVocabTerm('');
  };

  const removeVocabItem = (id: string) => {
    updateField('vocabulary', current.vocabulary.filter((v) => v.id !== id));
  };

  // --- Writing Examples ---
  const addExample = () => {
    const newEx: WritingExampleEntity = {
      id: 'ex-' + Date.now(),
      context: { en: '', id: '' },
      before: { en: '', id: '' },
      after: { en: '', id: '' },
      explanation: { en: '', id: '' }
    };
    updateField('examples', [...current.examples, newEx]);
  };

  const updateExample = (
    id: string,
    key: 'context' | 'before' | 'after' | 'explanation',
    val: LocalizedString
  ) => {
    const updated = current.examples.map((ex) => {
      if (ex.id !== id) return ex;
      return {
        ...ex,
        [key]: val
      };
    });
    updateField('examples', updated);
  };

  const removeExample = (id: string) => {
    updateField('examples', current.examples.filter((ex) => ex.id !== id));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Overview & Tone Guidelines */}
      <div className="editor-card">
        <div className="editor-header">
          <div>
            <h2 className="editor-title">{t('voiceToneTitle', uiLanguage)}</h2>
            <p className="editor-subtitle">{t('voiceToneSubtitle', uiLanguage)}</p>
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
      </div>

      {/* Voice Principles */}
      <div className="editor-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
              {t('voicePrinciplesTitle', uiLanguage)}
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              {t('voicePrinciplesSubtitle', uiLanguage)}
            </p>
          </div>
          <button type="button" className="btn btn-secondary btn-sm" onClick={addPrinciple}>
            <Plus size={14} /> {t('addVoicePrinciple', uiLanguage)}
          </button>
        </div>

        {current.principles.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', border: '1px dashed var(--border-light)', borderRadius: 'var(--radius-md)' }}>
            <MessageSquare size={24} style={{ margin: '0 auto 8px', opacity: 0.6 }} />
            <p style={{ fontSize: '0.86rem' }}>{t('noVoicePrinciplesDefined', uiLanguage)}</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {current.principles.map((pr, idx) => (
              <div
                key={pr.id}
                style={{
                  padding: '16px',
                  backgroundColor: 'var(--bg-muted)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-light)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="badge badge-secondary" style={{ fontSize: '0.74rem' }}>
                    Principle #{idx + 1}
                  </span>
                  <button
                    type="button"
                    className="btn-icon"
                    style={{ color: '#ef4444' }}
                    onClick={() => removePrinciple(pr.id)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <LocalizedInput
                  label="Principle Headline *"
                  placeholder="e.g. Speak like a thoughtful friend, not a corporation"
                  value={pr.title}
                  contentLanguage={contentLanguage}
                  onChange={(text) => updatePrinciple(pr.id, 'title', text)}
                />

                <LocalizedTextarea
                  label="Description & Guidance"
                  placeholder="Elaborate on how to achieve this tone in practice..."
                  rows={2}
                  value={pr.description}
                  contentLanguage={contentLanguage}
                  onChange={(text) => updatePrinciple(pr.id, 'description', text)}
                />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <LocalizedTextarea
                    label="Do Example"
                    placeholder="e.g. 'Take a quiet moment. Your coffee is brewed inside.'"
                    rows={2}
                    value={pr.doExample}
                    contentLanguage={contentLanguage}
                    onChange={(text) => updatePrinciple(pr.id, 'doExample', text)}
                  />

                  <LocalizedTextarea
                    label="Don't Example"
                    placeholder="e.g. 'Grab your quick caffeine hit fast!'"
                    rows={2}
                    value={pr.dontExample}
                    contentLanguage={contentLanguage}
                    onChange={(text) => updatePrinciple(pr.id, 'dontExample', text)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Vocabulary Guardrails (Words to Use vs Avoid) */}
      <div className="editor-card">
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
          {t('vocabularyTitle', uiLanguage)}
        </h3>
        <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
          {t('vocabularySubtitle', uiLanguage)}
        </p>

        {/* Add Term Form */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <select
            className="form-control"
            style={{ width: '130px', fontSize: '0.84rem' }}
            value={newVocabType}
            onChange={(e) => setNewVocabType(e.target.value as any)}
          >
            <option value="prefer">Prefer / Use</option>
            <option value="avoid">Avoid</option>
          </select>

          <input
            type="text"
            className="form-control"
            style={{ fontSize: '0.84rem' }}
            placeholder="Add term or phrase (e.g. Grounding or Fuel up)..."
            value={newVocabTerm}
            onChange={(e) => setNewVocabTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addVocabItem();
              }
            }}
          />

          <button type="button" className="btn btn-secondary btn-sm" onClick={addVocabItem}>
            <Plus size={14} /> Add
          </button>
        </div>

        {/* Term Chips */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {current.vocabulary.map((voc) => {
            const isPrefer = voc.recommendation === 'prefer';
            return (
              <span
                key={voc.id}
                className="badge"
                style={{
                  fontSize: '0.8rem',
                  padding: '5px 10px',
                  backgroundColor: isPrefer ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  color: isPrefer ? '#10b981' : '#ef4444',
                  border: `1px solid ${isPrefer ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {isPrefer ? <ThumbsUp size={12} /> : <ThumbsDown size={12} />}
                <span>{voc.term[contentLanguage] || voc.term.en || voc.term.id}</span>
                <button
                  type="button"
                  onClick={() => removeVocabItem(voc.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'inherit' }}
                >
                  ✕
                </button>
              </span>
            );
          })}
        </div>
      </div>

      {/* Writing Examples */}
      <div className="editor-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
              {t('writingExamplesTitle', uiLanguage)}
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              {t('writingExamplesSubtitle', uiLanguage)}
            </p>
          </div>
          <button type="button" className="btn btn-secondary btn-sm" onClick={addExample}>
            <Plus size={14} /> {t('addExample', uiLanguage)}
          </button>
        </div>

        {current.examples.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', border: '1px dashed var(--border-light)', borderRadius: 'var(--radius-md)' }}>
            <BookOpen size={24} style={{ margin: '0 auto 8px', opacity: 0.6 }} />
            <p style={{ fontSize: '0.86rem' }}>{t('noExamplesDefined', uiLanguage)}</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {current.examples.map((ex, idx) => (
              <div
                key={ex.id}
                style={{
                  padding: '16px',
                  backgroundColor: 'var(--bg-muted)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-light)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="badge badge-secondary" style={{ fontSize: '0.74rem' }}>
                    Example #{idx + 1}
                  </span>
                  <button
                    type="button"
                    className="btn-icon"
                    style={{ color: '#ef4444' }}
                    onClick={() => removeExample(ex.id)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <LocalizedInput
                  label="Context / Channel"
                  placeholder="e.g. In-Store Signage, Website Hero, Instagram Caption"
                  value={ex.context}
                  contentLanguage={contentLanguage}
                  onChange={(text) => updateExample(ex.id, 'context', text)}
                />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <LocalizedTextarea
                    label="Before / Avoid"
                    placeholder="The generic or off-brand draft..."
                    rows={2}
                    value={ex.before}
                    contentLanguage={contentLanguage}
                    onChange={(text) => updateExample(ex.id, 'before', text)}
                  />

                  <LocalizedTextarea
                    label="After / Preferred"
                    placeholder="The refined, on-brand phrasing..."
                    rows={2}
                    value={ex.after}
                    contentLanguage={contentLanguage}
                    onChange={(text) => updateExample(ex.id, 'after', text)}
                  />
                </div>

                <LocalizedTextarea
                  label="Nuance & Explanation"
                  placeholder="Why does the 'after' version better reflect the brand's voice?"
                  rows={2}
                  value={ex.explanation}
                  contentLanguage={contentLanguage}
                  onChange={(text) => updateExample(ex.id, 'explanation', text)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
