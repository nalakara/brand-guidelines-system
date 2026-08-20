import React from 'react';
import {
  VisualBasicsModule,
  Language,
  ImageryData,
  ImageryDirectionEntity,
  ImageTreatmentEntity
} from '../../types/brand';
import { LocalizedInput, LocalizedTextarea } from '../ui/LocalizedInput';
import { t } from '../../i18n/translations';
import {
  Plus,
  Trash2,
  Camera,
  Palette
} from 'lucide-react';

interface ImageryEditorProps {
  data?: VisualBasicsModule;
  uiLanguage: Language;
  contentLanguage: Language;
  onChange: (updated: VisualBasicsModule) => void;
}

const PREDEFINED_MOODS = ['Warm', 'Natural', 'Human', 'Calm', 'Editorial', 'Understated', 'Playful', 'Dramatic', 'Energetic'];
const PREDEFINED_SUBJECTS = ['People', 'Product', 'Environment', 'Architecture', 'Lifestyle', 'Craft', 'Ritual'];
const PREDEFINED_LIGHTING = ['Natural Daylight', 'Soft Ambient', 'Directional Sun', 'High Contrast', 'Warm Golden', 'Diffused'];
const PREDEFINED_COLOR_TREATMENTS = ['Natural', 'Muted Earth', 'Warm Film', 'Monochromatic', 'Earthy', 'Low Saturation', 'True-to-Life'];

export const ImageryEditor: React.FC<ImageryEditorProps> = ({
  data,
  uiLanguage,
  contentLanguage,
  onChange
}) => {
  const current: VisualBasicsModule = data || {
    logoUsageNotes: { en: '', id: '' },
    logoVariants: [],
    primaryColors: [],
    secondaryColors: [],
    typographyNotes: { en: '', id: '' },
    imageryDirection: { en: '', id: '' },
    layoutNotes: { en: '', id: '' }
  };

  const imageryData: ImageryData = current.imagery || {};
  const directions: ImageryDirectionEntity[] = imageryData.directions || [];
  const treatments: ImageTreatmentEntity[] = imageryData.treatments || [];

  const updateImagery = (partial: Partial<ImageryData>) => {
    onChange({
      ...current,
      imagery: {
        ...imageryData,
        ...partial
      }
    });
  };

  // --- Imagery Directions Handlers ---
  const addDirection = () => {
    const newDir: ImageryDirectionEntity = {
      id: 'img-dir-' + Date.now(),
      name: { en: '', id: '' },
      category: 'photography',
      description: { en: '', id: '' },
      mood: [],
      subjects: [],
      lighting: [],
      composition: [],
      doGuidance: { en: '', id: '' },
      dontGuidance: { en: '', id: '' }
    };
    updateImagery({ directions: [...directions, newDir] });
  };

  const updateDirection = (id: string, key: keyof ImageryDirectionEntity, val: any) => {
    const updated = directions.map((d) => {
      if (d.id !== id) return d;
      return { ...d, [key]: val };
    });
    updateImagery({ directions: updated });
  };

  const toggleDirectionTag = (id: string, listKey: 'mood' | 'subjects' | 'lighting', tag: string) => {
    const targetDir = directions.find((d) => d.id === id);
    if (!targetDir) return;
    const currentList = targetDir[listKey] || [];
    const updatedList = currentList.includes(tag)
      ? currentList.filter((t) => t !== tag)
      : [...currentList, tag];
    updateDirection(id, listKey, updatedList);
  };

  const removeDirection = (id: string) => {
    updateImagery({ directions: directions.filter((d) => d.id !== id) });
  };

  // --- Image Treatments Handlers ---
  const addTreatment = () => {
    const newTrm: ImageTreatmentEntity = {
      id: 'img-trm-' + Date.now(),
      name: { en: '', id: '' },
      description: { en: '', id: '' },
      colorTreatment: [],
      filterNotes: { en: '', id: '' }
    };
    updateImagery({ treatments: [...treatments, newTrm] });
  };

  const updateTreatment = (id: string, key: keyof ImageTreatmentEntity, val: any) => {
    const updated = treatments.map((trm) => {
      if (trm.id !== id) return trm;
      return { ...trm, [key]: val };
    });
    updateImagery({ treatments: updated });
  };

  const toggleTreatmentTag = (id: string, tag: string) => {
    const targetTrm = treatments.find((t) => t.id === id);
    if (!targetTrm) return;
    const currentList = targetTrm.colorTreatment || [];
    const updatedList = currentList.includes(tag)
      ? currentList.filter((t) => t !== tag)
      : [...currentList, tag];
    updateTreatment(id, 'colorTreatment', updatedList);
  };

  const removeTreatment = (id: string) => {
    updateImagery({ treatments: treatments.filter((trm) => trm.id !== id) });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. Imagery Directions (Entities) */}
      <div className="editor-card">
        <div className="editor-header">
          <div>
            <h2 className="editor-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Camera size={20} color="var(--accent-primary)" />
              {t('imageryDirectionsTitle', uiLanguage)}
            </h2>
            <p className="editor-subtitle">{t('imageryDirectionsSubtitle', uiLanguage)}</p>
          </div>
          <button className="btn-action-primary" onClick={addDirection}>
            <Plus size={16} /> {t('addImageryDirection', uiLanguage)}
          </button>
        </div>

        {directions.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: '#64748b', backgroundColor: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-light)' }}>
            {t('noImageryDirectionsEmpty', uiLanguage)}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {directions.map((dir) => (
              <div
                key={dir.id}
                style={{
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-md)',
                  padding: '20px',
                  backgroundColor: '#ffffff'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                  <div style={{ flex: 1, marginRight: '16px' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>
                      {t('imageryStyleName', uiLanguage)}
                    </label>
                    <LocalizedInput
                      value={dir.name}
                      contentLanguage={contentLanguage}
                      placeholder={t('imageryStyleNamePlaceholder', uiLanguage)}
                      onChange={(val) => updateDirection(dir.id, 'name', val)}
                    />
                  </div>
                  <div style={{ width: '160px', marginRight: '12px' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>
                      {t('categoryLabel', uiLanguage)}
                    </label>
                    <select
                      value={dir.category || 'photography'}
                      onChange={(e) => updateDirection(dir.id, 'category', e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', fontSize: '0.85rem' }}
                    >
                      <option value="photography">Photography</option>
                      <option value="editorial">Editorial</option>
                      <option value="product">Product</option>
                      <option value="lifestyle">Lifestyle</option>
                      <option value="abstract">Abstract</option>
                    </select>
                  </div>
                  <button
                    onClick={() => removeDirection(dir.id)}
                    style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '6px', marginTop: '18px' }}
                    title={t('removeDirection', uiLanguage)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>
                    {t('imageryDescription', uiLanguage)}
                  </label>
                  <LocalizedTextarea
                    value={dir.description}
                    contentLanguage={contentLanguage}
                    rows={2}
                    placeholder={t('imageryDescriptionPlaceholder', uiLanguage)}
                    onChange={(val) => updateDirection(dir.id, 'description', val)}
                  />
                </div>

                {/* Mood Chips */}
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>
                    {t('moodTagsLabel', uiLanguage)}
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {PREDEFINED_MOODS.map((m) => {
                      const isSelected = dir.mood?.includes(m);
                      return (
                        <button
                          key={m}
                          type="button"
                          onClick={() => toggleDirectionTag(dir.id, 'mood', m)}
                          style={{
                            border: isSelected ? '1px solid var(--accent-primary)' : '1px solid var(--border-light)',
                            backgroundColor: isSelected ? 'var(--accent-light)' : '#f8fafc',
                            color: isSelected ? 'var(--accent-primary)' : '#475569',
                            borderRadius: '4px',
                            padding: '4px 10px',
                            fontSize: '0.76rem',
                            cursor: 'pointer',
                            fontWeight: isSelected ? 600 : 400
                          }}
                        >
                          {m}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Subjects & Lighting Chips */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>
                      {t('subjectTagsLabel', uiLanguage)}
                    </label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {PREDEFINED_SUBJECTS.map((s) => {
                        const isSelected = dir.subjects?.includes(s);
                        return (
                          <button
                            key={s}
                            type="button"
                            onClick={() => toggleDirectionTag(dir.id, 'subjects', s)}
                            style={{
                              border: isSelected ? '1px solid var(--accent-primary)' : '1px solid var(--border-light)',
                              backgroundColor: isSelected ? 'var(--accent-light)' : '#f8fafc',
                              color: isSelected ? 'var(--accent-primary)' : '#475569',
                              borderRadius: '4px',
                              padding: '3px 8px',
                              fontSize: '0.72rem',
                              cursor: 'pointer',
                              fontWeight: isSelected ? 600 : 400
                            }}
                          >
                            {s}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>
                      {t('lightingTagsLabel', uiLanguage)}
                    </label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {PREDEFINED_LIGHTING.map((l) => {
                        const isSelected = dir.lighting?.includes(l);
                        return (
                          <button
                            key={l}
                            type="button"
                            onClick={() => toggleDirectionTag(dir.id, 'lighting', l)}
                            style={{
                              border: isSelected ? '1px solid var(--accent-primary)' : '1px solid var(--border-light)',
                              backgroundColor: isSelected ? 'var(--accent-light)' : '#f8fafc',
                              color: isSelected ? 'var(--accent-primary)' : '#475569',
                              borderRadius: '4px',
                              padding: '3px 8px',
                              fontSize: '0.72rem',
                              cursor: 'pointer',
                              fontWeight: isSelected ? 600 : 400
                            }}
                          >
                            {l}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Do / Don't Guidance */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: '#16a34a', textTransform: 'uppercase', marginBottom: '4px' }}>
                      ✓ {t('imageryDoGuidance', uiLanguage)}
                    </label>
                    <LocalizedTextarea
                      value={dir.doGuidance}
                      contentLanguage={contentLanguage}
                      rows={2}
                      placeholder={t('imageryDoGuidancePlaceholder', uiLanguage)}
                      onChange={(val) => updateDirection(dir.id, 'doGuidance', val)}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: '#dc2626', textTransform: 'uppercase', marginBottom: '4px' }}>
                      ✕ {t('imageryDontGuidance', uiLanguage)}
                    </label>
                    <LocalizedTextarea
                      value={dir.dontGuidance}
                      contentLanguage={contentLanguage}
                      rows={2}
                      placeholder={t('imageryDontGuidancePlaceholder', uiLanguage)}
                      onChange={(val) => updateDirection(dir.id, 'dontGuidance', val)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. Image Treatments (Entities) */}
      <div className="editor-card">
        <div className="editor-header">
          <div>
            <h2 className="editor-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Palette size={20} color="var(--accent-primary)" />
              {t('imageTreatmentsTitle', uiLanguage)}
            </h2>
            <p className="editor-subtitle">{t('imageTreatmentsSubtitle', uiLanguage)}</p>
          </div>
          <button className="btn-action-primary" onClick={addTreatment}>
            <Plus size={16} /> {t('addImageTreatment', uiLanguage)}
          </button>
        </div>

        {treatments.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: '#64748b', backgroundColor: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-light)' }}>
            {t('noImageTreatmentsEmpty', uiLanguage)}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {treatments.map((trm) => (
              <div
                key={trm.id}
                style={{
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  backgroundColor: '#ffffff'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ flex: 1, marginRight: '16px' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>
                      {t('treatmentName', uiLanguage)}
                    </label>
                    <LocalizedInput
                      value={trm.name}
                      contentLanguage={contentLanguage}
                      placeholder={t('treatmentNamePlaceholder', uiLanguage)}
                      onChange={(val) => updateTreatment(trm.id, 'name', val)}
                    />
                  </div>
                  <button
                    onClick={() => removeTreatment(trm.id)}
                    style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '6px', marginTop: '18px' }}
                    title={t('removeTreatment', uiLanguage)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>
                    {t('treatmentDescription', uiLanguage)}
                  </label>
                  <LocalizedTextarea
                    value={trm.description}
                    contentLanguage={contentLanguage}
                    rows={2}
                    placeholder={t('treatmentDescriptionPlaceholder', uiLanguage)}
                    onChange={(val) => updateTreatment(trm.id, 'description', val)}
                  />
                </div>

                {/* Color Treatment Chips */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>
                    {t('colorTreatmentTags', uiLanguage)}
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {PREDEFINED_COLOR_TREATMENTS.map((c) => {
                      const isSelected = trm.colorTreatment?.includes(c);
                      return (
                        <button
                          key={c}
                          type="button"
                          onClick={() => toggleTreatmentTag(trm.id, c)}
                          style={{
                            border: isSelected ? '1px solid var(--accent-primary)' : '1px solid var(--border-light)',
                            backgroundColor: isSelected ? 'var(--accent-light)' : '#f8fafc',
                            color: isSelected ? 'var(--accent-primary)' : '#475569',
                            borderRadius: '4px',
                            padding: '3px 8px',
                            fontSize: '0.74rem',
                            cursor: 'pointer',
                            fontWeight: isSelected ? 600 : 400
                          }}
                        >
                          {c}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
