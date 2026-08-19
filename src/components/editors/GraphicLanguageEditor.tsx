import React, { useState } from 'react';
import {
  VisualBasicsModule,
  Language,
  GraphicLanguageData,
  GraphicCategoryData,
  IllustrationCategoryData,
  getLocalizedText
} from '../../types/brand';
import { LocalizedTextarea, LocalizedInput } from '../ui/LocalizedInput';
import { t } from '../../i18n/translations';
import {
  Plus,
  Edit2,
  Trash2,
  Shapes,
  Grid,
  PenTool,
  Smile,
  Minus,
  Sparkles,
  Check
} from 'lucide-react';

interface GraphicLanguageEditorProps {
  data?: VisualBasicsModule;
  uiLanguage: Language;
  contentLanguage: Language;
  onChange: (updated: VisualBasicsModule) => void;
}

const PREDEFINED_CHARACTERISTICS = {
  shapes: ['Organic', 'Geometric', 'Rounded', 'Angular', 'Soft', 'Bold', 'Minimal', 'Irregular', 'Modular', 'Abstract'],
  patterns: ['Geometric', 'Organic', 'Repeating', 'Dense', 'Sparse', 'Regular', 'Irregular', 'Subtle', 'Bold'],
  illustrationStyle: ['Hand-drawn', 'Geometric', 'Minimal', 'Expressive', 'Editorial', 'Playful', 'Technical', 'Abstract', 'Flat', 'Textured'],
  illustrationSubject: ['People', 'Objects', 'Concepts', 'Environments', 'Abstract', 'Characters'],
  iconography: ['Outline', 'Filled', 'Geometric', 'Rounded', 'Minimal', 'Compact', 'Expressive', 'Monoline'],
  lines: ['Thin', 'Bold', 'Monoline', 'Rounded', 'Angular', 'Continuous', 'Dashed', 'Decorative', 'Structural'],
  decorativeElements: ['Minimal', 'Geometric', 'Organic', 'Subtle', 'Expressive', 'Playful', 'Editorial', 'Textured']
};

export const GraphicLanguageEditor: React.FC<GraphicLanguageEditorProps> = ({
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

  const glData: GraphicLanguageData = current.graphicLanguage || {};

  const [activeEditingCategory, setActiveEditingCategory] = useState<
    'shapes' | 'patterns' | 'illustration' | 'iconography' | 'lines' | 'decorativeElements' | null
  >(null);

  // Form states for active Category editing
  const [descInput, setDescInput] = useState<any>(undefined);
  const [selectedChars, setSelectedChars] = useState<string[]>([]);

  // Extra Illustration form states
  const [illusStyle, setIllusStyle] = useState<string[]>([]);
  const [illusSubject, setIllusSubject] = useState<string[]>([]);
  const [illusTreatment, setIllusTreatment] = useState<any>(undefined);

  const updateGraphicData = (updatedGL: GraphicLanguageData) => {
    onChange({
      ...current,
      graphicLanguage: updatedGL
    });
  };

  const openEditorForCategory = (categoryKey: keyof GraphicLanguageData) => {
    const existing = glData[categoryKey];
    setDescInput(existing?.description);
    setSelectedChars(existing?.characteristics || []);

    if (categoryKey === 'illustration') {
      const illus = existing as IllustrationCategoryData;
      setIllusStyle(illus?.style || []);
      setIllusSubject(illus?.subject || []);
      setIllusTreatment(illus?.treatment);
    }

    setActiveEditingCategory(categoryKey);
  };

  const handleSaveCategory = (categoryKey: keyof GraphicLanguageData) => {
    let updatedCategory: GraphicCategoryData | IllustrationCategoryData;

    if (categoryKey === 'illustration') {
      updatedCategory = {
        description: descInput,
        characteristics: selectedChars,
        style: illusStyle,
        subject: illusSubject,
        treatment: illusTreatment
      } as IllustrationCategoryData;
    } else {
      updatedCategory = {
        description: descInput,
        characteristics: selectedChars
      };
    }

    updateGraphicData({
      ...glData,
      [categoryKey]: updatedCategory
    });

    setActiveEditingCategory(null);
  };

  const handleClearCategory = (categoryKey: keyof GraphicLanguageData) => {
    if (confirm('Clear definition for this category?')) {
      const copy = { ...glData };
      delete copy[categoryKey];
      updateGraphicData(copy);
      if (activeEditingCategory === categoryKey) {
        setActiveEditingCategory(null);
      }
    }
  };

  const toggleTag = (list: string[], setList: (updated: string[]) => void, tag: string) => {
    if (list.includes(tag)) {
      setList(list.filter((t) => t !== tag));
    } else {
      setList([...list, tag]);
    }
  };

  const renderCategoryCard = (
    categoryKey: keyof GraphicLanguageData,
    titleKey: string,
    noTitleKey: string,
    noSubtitleKey: string,
    defineKey: string,
    placeholderKey: string,
    predefinedTagList: string[],
    IconComponent: any
  ) => {
    const categoryData = glData[categoryKey];
    const isEditing = activeEditingCategory === categoryKey;
    const descText = getLocalizedText(categoryData?.description, contentLanguage).text;
    const hasData = categoryData && (descText || (categoryData.characteristics && categoryData.characteristics.length > 0));

    return (
      <div className="editor-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <IconComponent size={20} style={{ color: 'var(--accent-primary)' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
              {t(titleKey, uiLanguage)}
            </h3>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {hasData && !isEditing && (
              <button
                className="btn-icon"
                style={{ color: '#ef4444' }}
                title="Clear Category"
                onClick={() => handleClearCategory(categoryKey)}
              >
                <Trash2 size={15} />
              </button>
            )}
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => openEditorForCategory(categoryKey)}
            >
              {hasData ? <Edit2 size={14} /> : <Plus size={14} />}
              {hasData ? t('edit', uiLanguage) : t(defineKey, uiLanguage)}
            </button>
          </div>
        </div>

        {isEditing ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveCategory(categoryKey);
            }}
            style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}
          >
            <LocalizedTextarea
              label={t('description', uiLanguage)}
              placeholder={t(placeholderKey, uiLanguage)}
              rows={3}
              value={descInput}
              contentLanguage={contentLanguage}
              onChange={setDescInput}
            />

            {/* Extra fields for Illustration */}
            {categoryKey === 'illustration' && (
              <>
                <div>
                  <label className="form-label" style={{ fontWeight: 600 }}>{t('illustrationStyleLabel', uiLanguage)}</label>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
                    {PREDEFINED_CHARACTERISTICS.illustrationStyle.map((tag) => {
                      const isSel = illusStyle.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleTag(illusStyle, setIllusStyle, tag)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: 'var(--radius-sm)',
                            border: isSel ? '1px solid var(--accent-primary)' : '1px solid var(--border-light)',
                            backgroundColor: isSel ? 'var(--accent-light)' : 'var(--bg-card)',
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          {isSel && <Check size={12} />} {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="form-label" style={{ fontWeight: 600 }}>{t('illustrationSubjectLabel', uiLanguage)}</label>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
                    {PREDEFINED_CHARACTERISTICS.illustrationSubject.map((tag) => {
                      const isSel = illusSubject.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleTag(illusSubject, setIllusSubject, tag)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: 'var(--radius-sm)',
                            border: isSel ? '1px solid var(--accent-primary)' : '1px solid var(--border-light)',
                            backgroundColor: isSel ? 'var(--accent-light)' : 'var(--bg-card)',
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          {isSel && <Check size={12} />} {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <LocalizedInput
                  label={t('illustrationTreatmentLabel', uiLanguage)}
                  placeholder={t('illustrationTreatmentPlaceholder', uiLanguage)}
                  value={illusTreatment}
                  contentLanguage={contentLanguage}
                  onChange={setIllusTreatment}
                />
              </>
            )}

            {/* Standard Characteristics selection */}
            <div>
              <label className="form-label" style={{ fontWeight: 600 }}>{t('characteristicsLabel', uiLanguage)}</label>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
                {predefinedTagList.map((tag) => {
                  const isSel = selectedChars.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(selectedChars, setSelectedChars, tag)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 'var(--radius-sm)',
                        border: isSel ? '1px solid var(--accent-primary)' : '1px solid var(--border-light)',
                        backgroundColor: isSel ? 'var(--accent-light)' : 'var(--bg-card)',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      {isSel && <Check size={12} />} {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setActiveEditingCategory(null)}>
                {t('cancel', uiLanguage)}
              </button>
              <button type="submit" className="btn btn-accent btn-sm">
                {t('save', uiLanguage)}
              </button>
            </div>
          </form>
        ) : hasData ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {descText && (
              <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                {descText}
              </p>
            )}

            {categoryKey === 'illustration' && (categoryData as IllustrationCategoryData)?.treatment && (
              <div style={{ fontSize: '0.86rem', color: 'var(--text-subtle)' }}>
                <strong>Treatment:</strong> {getLocalizedText((categoryData as IllustrationCategoryData).treatment, contentLanguage).text}
              </div>
            )}

            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {(categoryData.characteristics || []).map((tag, idx) => (
                <span key={idx} className="badge badge-secondary" style={{ fontSize: '0.78rem' }}>
                  {tag}
                </span>
              ))}
              {categoryKey === 'illustration' && (
                <>
                  {((categoryData as IllustrationCategoryData).style || []).map((st, idx) => (
                    <span key={`style-${idx}`} className="badge badge-outline" style={{ fontSize: '0.78rem' }}>
                      {st}
                    </span>
                  ))}
                  {((categoryData as IllustrationCategoryData).subject || []).map((sb, idx) => (
                    <span key={`sub-${idx}`} className="badge badge-outline" style={{ fontSize: '0.78rem' }}>
                      {sb}
                    </span>
                  ))}
                </>
              )}
            </div>
          </div>
        ) : (
          <div style={{ padding: '16px 0', textAlign: 'center', color: 'var(--text-subtle)', fontSize: '0.88rem' }}>
            <div style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '2px' }}>{t(noTitleKey, uiLanguage)}</div>
            <div style={{ fontSize: '0.82rem' }}>{t(noSubtitleKey, uiLanguage)}</div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Editor Header */}
      <div className="editor-card" style={{ padding: '24px' }}>
        <h2 className="editor-title" style={{ fontSize: '1.25rem', fontWeight: 700 }}>
          {t('graphicLanguageTitle', uiLanguage)}
        </h2>
        <p className="editor-subtitle" style={{ marginTop: '2px' }}>
          {t('graphicLanguageSubtitle', uiLanguage)}
        </p>
      </div>

      {/* 6 Category Cards */}
      {renderCategoryCard('shapes', 'shapesCategoryTitle', 'noShapesTitle', 'noShapesSubtitle', 'defineShapes', 'shapesDescPlaceholder', PREDEFINED_CHARACTERISTICS.shapes, Shapes)}
      {renderCategoryCard('patterns', 'patternsCategoryTitle', 'noPatternsTitle', 'noPatternsSubtitle', 'definePatterns', 'patternsDescPlaceholder', PREDEFINED_CHARACTERISTICS.patterns, Grid)}
      {renderCategoryCard('illustration', 'illustrationCategoryTitle', 'noIllustrationTitle', 'noIllustrationSubtitle', 'defineIllustration', 'illustrationDescPlaceholder', [], PenTool)}
      {renderCategoryCard('iconography', 'iconographyCategoryTitle', 'noIconographyTitle', 'noIconographySubtitle', 'defineIconography', 'iconographyDescPlaceholder', PREDEFINED_CHARACTERISTICS.iconography, Smile)}
      {renderCategoryCard('lines', 'linesCategoryTitle', 'noLinesTitle', 'noLinesSubtitle', 'defineLines', 'linesDescPlaceholder', PREDEFINED_CHARACTERISTICS.lines, Minus)}
      {renderCategoryCard('decorativeElements', 'decorativeElementsCategoryTitle', 'noDecorativeElementsTitle', 'noDecorativeElementsSubtitle', 'defineDecorativeElements', 'decorativeElementsDescPlaceholder', PREDEFINED_CHARACTERISTICS.decorativeElements, Sparkles)}
    </div>
  );
};
