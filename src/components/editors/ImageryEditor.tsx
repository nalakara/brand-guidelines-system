import React, { useState } from 'react';
import {
  VisualBasicsModule,
  Language,
  ImageryData,
  PhotographyData,
  ArtDirectionData,
  ImageCharacteristicsData,
  updateLocalizedString,
  getLocalizedText
} from '../../types/brand';
import { LocalizedTextarea, LocalizedInput } from '../ui/LocalizedInput';
import { t } from '../../i18n/translations';
import { Plus, Edit2, Camera, Palette, Sliders, Check } from 'lucide-react';

interface ImageryEditorProps {
  data?: VisualBasicsModule;
  uiLanguage: Language;
  contentLanguage: Language;
  onChange: (updated: VisualBasicsModule) => void;
}

const PREDEFINED_MOODS = ['Warm', 'Natural', 'Human', 'Energetic', 'Calm', 'Editorial', 'Understated', 'Playful', 'Dramatic'];
const PREDEFINED_SUBJECTS = ['People', 'Product', 'Environment', 'Architecture', 'Food', 'Lifestyle'];
const PREDEFINED_LIGHTING = ['Natural', 'Soft', 'Directional', 'High Contrast', 'Low Contrast', 'Dramatic', 'Ambient'];
const PREDEFINED_COMPOSITION = ['Documentary', 'Minimal', 'Editorial', 'Spacious', 'Centered', 'Dynamic', 'Layered'];
const PREDEFINED_COLOR_TREATMENTS = ['Natural', 'Muted', 'Vibrant', 'Warm', 'Cool', 'Monochromatic', 'Earthy', 'High Contrast'];

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

  // Convert legacy imageryDirection if imagery object is undefined
  const getInitialImagery = (): ImageryData => {
    if (current.imagery) {
      return current.imagery;
    }
    const legacyText = getLocalizedText(current.imageryDirection, 'en').text;
    if (legacyText) {
      return {
        photography: {
          description: current.imageryDirection,
          mood: ['Natural', 'Human'],
          composition: ['Documentary']
        }
      };
    }
    return {};
  };

  const imageryData = getInitialImagery();

  // Modal / Form States
  const [editingSection, setEditingSection] = useState<'photography' | 'artDirection' | 'characteristics' | null>(null);

  // Temp Form States
  const [photoDesc, setPhotoDesc] = useState(imageryData.photography?.description);
  const [photoMood, setPhotoMood] = useState<string[]>(imageryData.photography?.mood || []);
  const [photoSubjects, setPhotoSubjects] = useState<string[]>(imageryData.photography?.subjects || []);
  const [photoLighting, setPhotoLighting] = useState<string[]>(imageryData.photography?.lighting || []);
  const [photoComp, setPhotoComp] = useState<string[]>(imageryData.photography?.composition || []);
  const [photoColor, setPhotoColor] = useState<string[]>(imageryData.photography?.colorTreatment || []);

  const [artMood, setArtMood] = useState(imageryData.artDirection?.visualMood);
  const [artSubject, setArtSubject] = useState(imageryData.artDirection?.subjectDirection);
  const [artComp, setArtComp] = useState(imageryData.artDirection?.compositionDirection);
  const [artTreatment, setArtTreatment] = useState(imageryData.artDirection?.treatment);

  const [charMood, setCharMood] = useState<string[]>(imageryData.characteristics?.mood || []);
  const [charLighting, setCharLighting] = useState<string[]>(imageryData.characteristics?.lighting || []);
  const [charComp, setCharComp] = useState<string[]>(imageryData.characteristics?.composition || []);
  const [charColor, setCharColor] = useState<string[]>(imageryData.characteristics?.color || []);

  const updateImageryData = (updated: ImageryData) => {
    // Sync summary text to legacy imageryDirection
    const photoDescText = getLocalizedText(updated.photography?.description, 'en').text;
    const artMoodText = getLocalizedText(updated.artDirection?.visualMood, 'en').text;
    const summary = photoDescText || artMoodText || 'Imagery Direction defined';

    onChange({
      ...current,
      imagery: updated,
      imageryDirection: updateLocalizedString(current.imageryDirection, contentLanguage, summary)
    });
  };

  const handleSavePhotography = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedPhoto: PhotographyData = {
      description: photoDesc,
      mood: photoMood,
      subjects: photoSubjects,
      lighting: photoLighting,
      composition: photoComp,
      colorTreatment: photoColor
    };
    updateImageryData({ ...imageryData, photography: updatedPhoto });
    setEditingSection(null);
  };

  const handleSaveArtDirection = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedArt: ArtDirectionData = {
      visualMood: artMood,
      subjectDirection: artSubject,
      compositionDirection: artComp,
      treatment: artTreatment
    };
    updateImageryData({ ...imageryData, artDirection: updatedArt });
    setEditingSection(null);
  };

  const handleSaveCharacteristics = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedChar: ImageCharacteristicsData = {
      mood: charMood,
      lighting: charLighting,
      composition: charComp,
      color: charColor
    };
    updateImageryData({ ...imageryData, characteristics: updatedChar });
    setEditingSection(null);
  };

  const toggleTag = (list: string[], setList: (updated: string[]) => void, item: string) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const photography = imageryData.photography;
  const artDirection = imageryData.artDirection;
  const characteristics = imageryData.characteristics;

  const hasPhotography = photography && (
    getLocalizedText(photography.description, 'en').text ||
    (photography.mood && photography.mood.length > 0) ||
    (photography.subjects && photography.subjects.length > 0) ||
    (photography.lighting && photography.lighting.length > 0) ||
    (photography.composition && photography.composition.length > 0) ||
    (photography.colorTreatment && photography.colorTreatment.length > 0)
  );

  const hasArtDirection = artDirection && (
    getLocalizedText(artDirection.visualMood, 'en').text ||
    getLocalizedText(artDirection.subjectDirection, 'en').text ||
    getLocalizedText(artDirection.compositionDirection, 'en').text ||
    getLocalizedText(artDirection.treatment, 'en').text
  );

  const hasCharacteristics = characteristics && (
    (characteristics.mood && characteristics.mood.length > 0) ||
    (characteristics.lighting && characteristics.lighting.length > 0) ||
    (characteristics.composition && characteristics.composition.length > 0) ||
    (characteristics.color && characteristics.color.length > 0)
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Editor Header */}
      <div className="editor-card" style={{ padding: '24px' }}>
        <h2 className="editor-title" style={{ fontSize: '1.25rem', fontWeight: 700 }}>
          {t('imageryTitle', uiLanguage)}
        </h2>
        <p className="editor-subtitle" style={{ marginTop: '2px' }}>
          {t('imagerySubtitle', uiLanguage)}
        </p>
      </div>

      {/* ========================================================================= */}
      {/* 1. PHOTOGRAPHY SECTION */}
      {/* ========================================================================= */}
      <div className="editor-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Camera size={20} style={{ color: 'var(--accent-primary)' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
              {t('photographySectionTitle', uiLanguage)}
            </h3>
          </div>

          <button
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setPhotoDesc(photography?.description);
              setPhotoMood(photography?.mood || []);
              setPhotoSubjects(photography?.subjects || []);
              setPhotoLighting(photography?.lighting || []);
              setPhotoComp(photography?.composition || []);
              setPhotoColor(photography?.colorTreatment || []);
              setEditingSection('photography');
            }}
          >
            {hasPhotography ? <Edit2 size={14} /> : <Plus size={14} />}
            {hasPhotography ? t('edit', uiLanguage) : t('definePhotography', uiLanguage)}
          </button>
        </div>

        {editingSection === 'photography' ? (
          <form onSubmit={handleSavePhotography} style={{ display: 'flex', flexDirection: 'column', gap: '18px', borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
            <LocalizedTextarea
              label={t('photographyDescLabel', uiLanguage)}
              placeholder={t('photographyDescPlaceholder', uiLanguage)}
              rows={3}
              value={photoDesc}
              contentLanguage={contentLanguage}
              onChange={setPhotoDesc}
            />

            <div>
              <label className="form-label" style={{ fontWeight: 600 }}>{t('photographyMoodLabel', uiLanguage)}</label>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
                {PREDEFINED_MOODS.map((item) => {
                  const isSelected = photoMood.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleTag(photoMood, setPhotoMood, item)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 'var(--radius-sm)',
                        border: isSelected ? '1px solid var(--accent-primary)' : '1px solid var(--border-light)',
                        backgroundColor: isSelected ? 'var(--accent-light)' : 'var(--bg-card)',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      {isSelected && <Check size={12} />} {item}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="form-label" style={{ fontWeight: 600 }}>{t('photographySubjectLabel', uiLanguage)}</label>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
                {PREDEFINED_SUBJECTS.map((item) => {
                  const isSelected = photoSubjects.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleTag(photoSubjects, setPhotoSubjects, item)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 'var(--radius-sm)',
                        border: isSelected ? '1px solid var(--accent-primary)' : '1px solid var(--border-light)',
                        backgroundColor: isSelected ? 'var(--accent-light)' : 'var(--bg-card)',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      {isSelected && <Check size={12} />} {item}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="form-label" style={{ fontWeight: 600 }}>{t('photographyLightingLabel', uiLanguage)}</label>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
                {PREDEFINED_LIGHTING.map((item) => {
                  const isSelected = photoLighting.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleTag(photoLighting, setPhotoLighting, item)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 'var(--radius-sm)',
                        border: isSelected ? '1px solid var(--accent-primary)' : '1px solid var(--border-light)',
                        backgroundColor: isSelected ? 'var(--accent-light)' : 'var(--bg-card)',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      {isSelected && <Check size={12} />} {item}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="form-label" style={{ fontWeight: 600 }}>{t('photographyCompositionLabel', uiLanguage)}</label>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
                {PREDEFINED_COMPOSITION.map((item) => {
                  const isSelected = photoComp.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleTag(photoComp, setPhotoComp, item)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 'var(--radius-sm)',
                        border: isSelected ? '1px solid var(--accent-primary)' : '1px solid var(--border-light)',
                        backgroundColor: isSelected ? 'var(--accent-light)' : 'var(--bg-card)',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      {isSelected && <Check size={12} />} {item}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="form-label" style={{ fontWeight: 600 }}>{t('photographyColorTreatmentLabel', uiLanguage)}</label>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
                {PREDEFINED_COLOR_TREATMENTS.map((item) => {
                  const isSelected = photoColor.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleTag(photoColor, setPhotoColor, item)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 'var(--radius-sm)',
                        border: isSelected ? '1px solid var(--accent-primary)' : '1px solid var(--border-light)',
                        backgroundColor: isSelected ? 'var(--accent-light)' : 'var(--bg-card)',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      {isSelected && <Check size={12} />} {item}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setEditingSection(null)}>
                {t('cancel', uiLanguage)}
              </button>
              <button type="submit" className="btn btn-accent btn-sm">
                {t('save', uiLanguage)}
              </button>
            </div>
          </form>
        ) : hasPhotography ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {getLocalizedText(photography.description, contentLanguage).text && (
              <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                {getLocalizedText(photography.description, contentLanguage).text}
              </p>
            )}

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
              {[
                ...(photography.mood || []),
                ...(photography.subjects || []),
                ...(photography.lighting || []),
                ...(photography.composition || []),
                ...(photography.colorTreatment || [])
              ].map((tag, idx) => (
                <span key={idx} className="badge badge-secondary" style={{ fontSize: '0.78rem' }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ padding: '16px 0', textAlign: 'center', color: 'var(--text-subtle)', fontSize: '0.88rem' }}>
            {t('noPhotographyTitle', uiLanguage)}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. ART DIRECTION SECTION */}
      {/* ========================================================================= */}
      <div className="editor-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Palette size={20} style={{ color: 'var(--accent-primary)' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
              {t('artDirectionSectionTitle', uiLanguage)}
            </h3>
          </div>

          <button
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setArtMood(artDirection?.visualMood);
              setArtSubject(artDirection?.subjectDirection);
              setArtComp(artDirection?.compositionDirection);
              setArtTreatment(artDirection?.treatment);
              setEditingSection('artDirection');
            }}
          >
            {hasArtDirection ? <Edit2 size={14} /> : <Plus size={14} />}
            {hasArtDirection ? t('edit', uiLanguage) : t('defineArtDirection', uiLanguage)}
          </button>
        </div>

        {editingSection === 'artDirection' ? (
          <form onSubmit={handleSaveArtDirection} style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
            <LocalizedInput
              label={t('artDirectionVisualMoodLabel', uiLanguage)}
              placeholder={t('artDirectionVisualMoodPlaceholder', uiLanguage)}
              value={artMood}
              contentLanguage={contentLanguage}
              onChange={setArtMood}
            />

            <LocalizedInput
              label={t('artDirectionSubjectLabel', uiLanguage)}
              placeholder={t('artDirectionSubjectPlaceholder', uiLanguage)}
              value={artSubject}
              contentLanguage={contentLanguage}
              onChange={setArtSubject}
            />

            <LocalizedInput
              label={t('artDirectionCompositionLabel', uiLanguage)}
              placeholder={t('artDirectionCompositionPlaceholder', uiLanguage)}
              value={artComp}
              contentLanguage={contentLanguage}
              onChange={setArtComp}
            />

            <LocalizedInput
              label={t('artDirectionTreatmentLabel', uiLanguage)}
              placeholder={t('artDirectionTreatmentPlaceholder', uiLanguage)}
              value={artTreatment}
              contentLanguage={contentLanguage}
              onChange={setArtTreatment}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setEditingSection(null)}>
                {t('cancel', uiLanguage)}
              </button>
              <button type="submit" className="btn btn-accent btn-sm">
                {t('save', uiLanguage)}
              </button>
            </div>
          </form>
        ) : hasArtDirection ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            {getLocalizedText(artDirection.visualMood, contentLanguage).text && (
              <div style={{ padding: '12px', backgroundColor: 'var(--bg-muted)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  {t('artDirectionVisualMoodLabel', uiLanguage)}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginTop: '4px' }}>
                  {getLocalizedText(artDirection.visualMood, contentLanguage).text}
                </div>
              </div>
            )}

            {getLocalizedText(artDirection.subjectDirection, contentLanguage).text && (
              <div style={{ padding: '12px', backgroundColor: 'var(--bg-muted)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  {t('artDirectionSubjectLabel', uiLanguage)}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginTop: '4px' }}>
                  {getLocalizedText(artDirection.subjectDirection, contentLanguage).text}
                </div>
              </div>
            )}

            {getLocalizedText(artDirection.compositionDirection, contentLanguage).text && (
              <div style={{ padding: '12px', backgroundColor: 'var(--bg-muted)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  {t('artDirectionCompositionLabel', uiLanguage)}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginTop: '4px' }}>
                  {getLocalizedText(artDirection.compositionDirection, contentLanguage).text}
                </div>
              </div>
            )}

            {getLocalizedText(artDirection.treatment, contentLanguage).text && (
              <div style={{ padding: '12px', backgroundColor: 'var(--bg-muted)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  {t('artDirectionTreatmentLabel', uiLanguage)}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginTop: '4px' }}>
                  {getLocalizedText(artDirection.treatment, contentLanguage).text}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={{ padding: '16px 0', textAlign: 'center', color: 'var(--text-subtle)', fontSize: '0.88rem' }}>
            {t('noArtDirectionTitle', uiLanguage)}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 3. IMAGE CHARACTERISTICS SECTION */}
      {/* ========================================================================= */}
      <div className="editor-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sliders size={20} style={{ color: 'var(--accent-primary)' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
              {t('characteristicsSectionTitle', uiLanguage)}
            </h3>
          </div>

          <button
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setCharMood(characteristics?.mood || []);
              setCharLighting(characteristics?.lighting || []);
              setCharComp(characteristics?.composition || []);
              setCharColor(characteristics?.color || []);
              setEditingSection('characteristics');
            }}
          >
            {hasCharacteristics ? <Edit2 size={14} /> : <Plus size={14} />}
            {hasCharacteristics ? t('edit', uiLanguage) : t('addCharacteristics', uiLanguage)}
          </button>
        </div>

        {editingSection === 'characteristics' ? (
          <form onSubmit={handleSaveCharacteristics} style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
            <div>
              <label className="form-label" style={{ fontWeight: 600 }}>Mood Characteristics</label>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
                {PREDEFINED_MOODS.map((item) => {
                  const isSelected = charMood.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleTag(charMood, setCharMood, item)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 'var(--radius-sm)',
                        border: isSelected ? '1px solid var(--accent-primary)' : '1px solid var(--border-light)',
                        backgroundColor: isSelected ? 'var(--accent-light)' : 'var(--bg-card)',
                        fontSize: '0.8rem',
                        cursor: 'pointer'
                      }}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="form-label" style={{ fontWeight: 600 }}>Lighting & Color Qualities</label>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
                {[...PREDEFINED_LIGHTING, ...PREDEFINED_COLOR_TREATMENTS].map((item) => {
                  const isSelected = charLighting.includes(item) || charColor.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleTag(charLighting, setCharLighting, item)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 'var(--radius-sm)',
                        border: isSelected ? '1px solid var(--accent-primary)' : '1px solid var(--border-light)',
                        backgroundColor: isSelected ? 'var(--accent-light)' : 'var(--bg-card)',
                        fontSize: '0.8rem',
                        cursor: 'pointer'
                      }}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setEditingSection(null)}>
                {t('cancel', uiLanguage)}
              </button>
              <button type="submit" className="btn btn-accent btn-sm">
                {t('save', uiLanguage)}
              </button>
            </div>
          </form>
        ) : hasCharacteristics ? (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              ...(characteristics.mood || []),
              ...(characteristics.lighting || []),
              ...(characteristics.composition || []),
              ...(characteristics.color || [])
            ].map((tag, idx) => (
              <span key={idx} className="badge badge-outline" style={{ fontSize: '0.82rem', padding: '6px 12px' }}>
                {tag}
              </span>
            ))}
          </div>
        ) : (
          <div style={{ padding: '16px 0', textAlign: 'center', color: 'var(--text-subtle)', fontSize: '0.88rem' }}>
            {t('noCharacteristicsTitle', uiLanguage)}
          </div>
        )}
      </div>
    </div>
  );
};
