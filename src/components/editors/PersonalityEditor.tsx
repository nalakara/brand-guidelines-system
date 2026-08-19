import React from 'react';
import {
  PersonalityModule,
  Language,
  PersonalityTraitEntity,
  WeArePairEntity,
  LocalizedString
} from '../../types/brand';
import { LocalizedInput, LocalizedTextarea } from '../ui/LocalizedInput';
import { t } from '../../i18n/translations';
import { Plus, Trash2, Sparkles, Scale } from 'lucide-react';

interface PersonalityEditorProps {
  data?: PersonalityModule;
  uiLanguage: Language;
  contentLanguage: Language;
  onChange: (updated: PersonalityModule) => void;
}

const DIMENSION_SLIDERS = [
  { key: 'classicToModern' as const, leftKey: 'sliderClassic', rightKey: 'sliderModern' },
  { key: 'seriousToPlayful' as const, leftKey: 'sliderSerious', rightKey: 'sliderPlayful' },
  { key: 'reservedToExpressive' as const, leftKey: 'sliderReserved', rightKey: 'sliderExpressive' },
  { key: 'practicalToVisionary' as const, leftKey: 'sliderPractical', rightKey: 'sliderVisionary' }
];

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

  // --- Traits ---
  const addTrait = () => {
    const newTrait: PersonalityTraitEntity = {
      id: 'trait-' + Date.now(),
      trait: { en: '', id: '' },
      definition: { en: '', id: '' },
      spectrumPosition: 50
    };
    updateField('traits', [...current.traits, newTrait]);
  };

  const updateTrait = (id: string, key: 'trait' | 'definition', val: LocalizedString) => {
    const updated = current.traits.map((t) => {
      if (t.id !== id) return t;
      return {
        ...t,
        [key]: val
      };
    });
    updateField('traits', updated);
  };

  const removeTrait = (id: string) => {
    updateField('traits', current.traits.filter((t) => t.id !== id));
  };

  // --- We Are / We Are Not Pairs ---
  const addPair = () => {
    const newPair: WeArePairEntity = {
      id: 'pair-' + Date.now(),
      weAre: { en: '', id: '' },
      weAreNot: { en: '', id: '' },
      rationale: { en: '', id: '' }
    };
    updateField('weAreWeAreNot', [...current.weAreWeAreNot, newPair]);
  };

  const updatePair = (id: string, key: 'weAre' | 'weAreNot' | 'rationale', val: LocalizedString) => {
    const updated = current.weAreWeAreNot.map((p) => {
      if (p.id !== id) return p;
      return {
        ...p,
        [key]: val
      };
    });
    updateField('weAreWeAreNot', updated);
  };

  const removePair = (id: string) => {
    updateField('weAreWeAreNot', current.weAreWeAreNot.filter((p) => p.id !== id));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Archetype & Sliders Header */}
      <div className="editor-card">
        <div className="editor-header">
          <div>
            <h2 className="editor-title">{t('personalityTitle', uiLanguage)}</h2>
            <p className="editor-subtitle">{t('personalitySubtitle', uiLanguage)}</p>
          </div>
        </div>

        <LocalizedInput
          label={t('archetypeLabel', uiLanguage)}
          hint={t('archetypeHint', uiLanguage)}
          placeholder={t('archetypePlaceholder', uiLanguage)}
          value={current.archetype}
          contentLanguage={contentLanguage}
          onChange={(val) => updateField('archetype', val)}
        />

        <div style={{ marginTop: '24px' }}>
          <label className="form-label" style={{ fontWeight: 600, marginBottom: '16px', display: 'block' }}>
            {t('slidersTitle', uiLanguage)}
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {DIMENSION_SLIDERS.map((slider) => {
              const val = current.sliders[slider.key];
              return (
                <div key={slider.key} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 600 }}>
                    <span style={{ color: val < 50 ? 'var(--accent-primary)' : 'var(--text-muted)' }}>
                      {t(slider.leftKey, uiLanguage)}
                    </span>
                    <span style={{ color: val > 50 ? 'var(--accent-primary)' : 'var(--text-muted)' }}>
                      {t(slider.rightKey, uiLanguage)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={val}
                    onChange={(e) => updateSlider(slider.key, Number(e.target.value))}
                    style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--accent-primary)' }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Personality Traits Entities */}
      <div className="editor-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
              {t('traitsTitle', uiLanguage)}
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              {t('traitsSubtitle', uiLanguage)}
            </p>
          </div>
          <button type="button" className="btn btn-secondary btn-sm" onClick={addTrait}>
            <Plus size={14} /> {t('addTrait', uiLanguage)}
          </button>
        </div>

        {current.traits.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', border: '1px dashed var(--border-light)', borderRadius: 'var(--radius-md)' }}>
            <Sparkles size={24} style={{ margin: '0 auto 8px', opacity: 0.6 }} />
            <p style={{ fontSize: '0.86rem' }}>{t('noTraitsDefined', uiLanguage)}</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {current.traits.map((tr, idx) => (
              <div
                key={tr.id}
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
                    Trait #{idx + 1}
                  </span>
                  <button
                    type="button"
                    className="btn-icon"
                    style={{ color: '#ef4444' }}
                    onClick={() => removeTrait(tr.id)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <LocalizedInput
                  label="Trait Name *"
                  placeholder="e.g. Grounded, Thoughtful, Warm"
                  value={tr.trait}
                  contentLanguage={contentLanguage}
                  onChange={(text) => updateTrait(tr.id, 'trait', text)}
                />

                <LocalizedTextarea
                  label="Behavioral Definition & Nuance"
                  placeholder="How does this trait show up in actual brand interactions?"
                  rows={2}
                  value={tr.definition}
                  contentLanguage={contentLanguage}
                  onChange={(text) => updateTrait(tr.id, 'definition', text)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* We Are / We Are Not Pairs */}
      <div className="editor-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
              {t('weAreWeAreNotTitle', uiLanguage)}
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              {t('weAreWeAreNotSubtitle', uiLanguage)}
            </p>
          </div>
          <button type="button" className="btn btn-secondary btn-sm" onClick={addPair}>
            <Plus size={14} /> {t('addPair', uiLanguage)}
          </button>
        </div>

        {current.weAreWeAreNot.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', border: '1px dashed var(--border-light)', borderRadius: 'var(--radius-md)' }}>
            <Scale size={24} style={{ margin: '0 auto 8px', opacity: 0.6 }} />
            <p style={{ fontSize: '0.86rem' }}>{t('noPairsDefined', uiLanguage)}</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {current.weAreWeAreNot.map((pair, idx) => (
              <div
                key={pair.id}
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
                    Guardrail #{idx + 1}
                  </span>
                  <button
                    type="button"
                    className="btn-icon"
                    style={{ color: '#ef4444' }}
                    onClick={() => removePair(pair.id)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <LocalizedInput
                    label="We Are *"
                    placeholder="e.g. Warm & welcoming hosts"
                    value={pair.weAre}
                    contentLanguage={contentLanguage}
                    onChange={(text) => updatePair(pair.id, 'weAre', text)}
                  />

                  <LocalizedInput
                    label="We Are NOT *"
                    placeholder="e.g. Elitist coffee snobs"
                    value={pair.weAreNot}
                    contentLanguage={contentLanguage}
                    onChange={(text) => updatePair(pair.id, 'weAreNot', text)}
                  />
                </div>

                <LocalizedTextarea
                  label="Strategic Rationale"
                  placeholder="Why is this distinction crucial for keeping the brand authentic?"
                  rows={2}
                  value={pair.rationale}
                  contentLanguage={contentLanguage}
                  onChange={(text) => updatePair(pair.id, 'rationale', text)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
