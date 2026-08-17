import React, { useState } from 'react';
import { PersonalityModule, Language, WeArePair, updateLocalizedString } from '../../types/brand';
import { LocalizedInput } from '../ui/LocalizedInput';
import { t } from '../../i18n/translations';
import { Plus, Trash2, X } from 'lucide-react';

interface PersonalityEditorProps {
  data?: PersonalityModule;
  uiLanguage: Language;
  contentLanguage: Language;
  onChange: (updated: PersonalityModule) => void;
}

export const PersonalityEditor: React.FC<PersonalityEditorProps> = ({
  data,
  uiLanguage,
  contentLanguage,
  onChange
}) => {
  const current: PersonalityModule = data || {
    traits: [],
    sliders: {
      classicToModern: 50,
      seriousToPlayful: 50,
      reservedToExpressive: 50,
      practicalToVisionary: 50
    },
    archetype: { en: '', id: '' },
    weAreWeAreNot: []
  };

  const [traitInput, setTraitInput] = useState('');

  const updateField = (field: keyof PersonalityModule, val: any) => {
    onChange({ ...current, [field]: val });
  };

  const updateSlider = (sliderKey: keyof PersonalityModule['sliders'], val: number) => {
    onChange({
      ...current,
      sliders: {
        ...current.sliders,
        [sliderKey]: val
      }
    });
  };

  const addTrait = () => {
    if (!traitInput.trim()) return;
    const newTraitObj = { [contentLanguage]: traitInput.trim() };
    updateField('traits', [...current.traits, newTraitObj]);
    setTraitInput('');
  };

  const removeTrait = (idx: number) => {
    updateField('traits', current.traits.filter((_, i) => i !== idx));
  };

  const addPair = () => {
    const newPair: WeArePair = {
      id: 'pair-' + Date.now(),
      weAre: { en: '', id: '' },
      weAreNot: { en: '', id: '' }
    };
    updateField('weAreWeAreNot', [...current.weAreWeAreNot, newPair]);
  };

  const updatePair = (id: string, field: 'weAre' | 'weAreNot', textVal: string) => {
    const updated = current.weAreWeAreNot.map(p => {
      if (p.id !== id) return p;
      return {
        ...p,
        [field]: updateLocalizedString(p[field], contentLanguage, textVal)
      };
    });
    updateField('weAreWeAreNot', updated);
  };

  const removePair = (id: string) => {
    updateField('weAreWeAreNot', current.weAreWeAreNot.filter(p => p.id !== id));
  };

  return (
    <div className="editor-card">
      <div className="editor-header">
        <div>
          <h2 className="editor-title">{t('personalityTitle', uiLanguage)}</h2>
          <p className="editor-subtitle">{t('personalitySubtitle', uiLanguage)}</p>
        </div>
      </div>

      {/* Brand Traits */}
      <div className="form-group">
        <label className="form-label">{t('traitsLabel', uiLanguage)} ({contentLanguage.toUpperCase()})</label>
        <p className="form-hint">{t('traitsHint', uiLanguage)}</p>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          <input
            type="text"
            className="form-control"
            placeholder={t('traitInputPlaceholder', uiLanguage)}
            value={traitInput}
            onChange={(e) => setTraitInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTrait())}
          />
          <button type="button" className="btn btn-secondary" onClick={addTrait}>
            <Plus size={16} /> {t('add', uiLanguage)}
          </button>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {current.traits.map((tItem, idx) => {
            const traitText = typeof tItem === 'string' ? tItem : (tItem?.[contentLanguage] || tItem?.en || '');
            return (
              <span
                key={idx}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--accent-light)',
                  color: 'var(--accent-primary)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  border: '1px solid rgba(37, 99, 235, 0.2)'
                }}
              >
                {traitText}
                <button
                  type="button"
                  onClick={() => removeTrait(idx)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-primary)', display: 'inline-flex' }}
                >
                  <X size={14} />
                </button>
              </span>
            );
          })}
        </div>
      </div>

      {/* Sliders */}
      <div className="form-group" style={{ backgroundColor: 'var(--bg-muted)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
        <label className="form-label" style={{ marginBottom: '16px', fontSize: '0.95rem' }}>
          {t('spectrumTitle', uiLanguage)}
        </label>

        <div className="slider-group">
          <div className="slider-labels">
            <span>Classic ({100 - current.sliders.classicToModern}%)</span>
            <span>Modern ({current.sliders.classicToModern}%)</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            className="slider-input"
            value={current.sliders.classicToModern}
            onChange={(e) => updateSlider('classicToModern', Number(e.target.value))}
          />
        </div>

        <div className="slider-group">
          <div className="slider-labels">
            <span>Serious ({100 - current.sliders.seriousToPlayful}%)</span>
            <span>Playful ({current.sliders.seriousToPlayful}%)</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            className="slider-input"
            value={current.sliders.seriousToPlayful}
            onChange={(e) => updateSlider('seriousToPlayful', Number(e.target.value))}
          />
        </div>

        <div className="slider-group">
          <div className="slider-labels">
            <span>Reserved ({100 - current.sliders.reservedToExpressive}%)</span>
            <span>Expressive ({current.sliders.reservedToExpressive}%)</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            className="slider-input"
            value={current.sliders.reservedToExpressive}
            onChange={(e) => updateSlider('reservedToExpressive', Number(e.target.value))}
          />
        </div>

        <div className="slider-group" style={{ marginBottom: 0 }}>
          <div className="slider-labels">
            <span>Practical ({100 - current.sliders.practicalToVisionary}%)</span>
            <span>Visionary ({current.sliders.practicalToVisionary}%)</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            className="slider-input"
            value={current.sliders.practicalToVisionary}
            onChange={(e) => updateSlider('practicalToVisionary', Number(e.target.value))}
          />
        </div>
      </div>

      <LocalizedInput
        label={t('archetypeLabel', uiLanguage)}
        placeholder={t('archetypePlaceholder', uiLanguage)}
        value={current.archetype}
        contentLanguage={contentLanguage}
        onChange={(val) => updateField('archetype', val)}
      />

      {/* Contrast Pairs */}
      <div className="form-group">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div>
            <label className="form-label" style={{ marginBottom: 0 }}>{t('contrastPairsLabel', uiLanguage)}</label>
            <p className="form-hint" style={{ marginBottom: 0 }}>{t('contrastPairsHint', uiLanguage)}</p>
          </div>
          <button type="button" className="btn btn-secondary btn-sm" onClick={addPair}>
            <Plus size={14} /> {t('addContrastPair', uiLanguage)}
          </button>
        </div>

        <div className="repeatable-box">
          {current.weAreWeAreNot.length === 0 ? (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-subtle)', textAlign: 'center', padding: '12px' }}>
              {t('noContrastPairs', uiLanguage)}
            </p>
          ) : (
            current.weAreWeAreNot.map((pair) => (
              <div key={pair.id} className="repeatable-item-block">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '10px', alignItems: 'center' }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder={`${t('weArePlaceholder', uiLanguage)} (${contentLanguage.toUpperCase()})`}
                    value={typeof pair.weAre === 'string' ? pair.weAre : (pair.weAre?.[contentLanguage] || '')}
                    style={{ borderColor: '#86efac' }}
                    onChange={(e) => updatePair(pair.id, 'weAre', e.target.value)}
                  />
                  <input
                    type="text"
                    className="form-control"
                    placeholder={`${t('weAreNotPlaceholder', uiLanguage)} (${contentLanguage.toUpperCase()})`}
                    value={typeof pair.weAreNot === 'string' ? pair.weAreNot : (pair.weAreNot?.[contentLanguage] || '')}
                    style={{ borderColor: '#fca5a5' }}
                    onChange={(e) => updatePair(pair.id, 'weAreNot', e.target.value)}
                  />
                  <button type="button" className="btn-icon" onClick={() => removePair(pair.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
