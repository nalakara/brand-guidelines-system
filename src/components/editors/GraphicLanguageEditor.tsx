import React from 'react';
import {
  VisualBasicsModule,
  Language,
  GraphicLanguageData,
  GraphicElementEntity,
  IllustrationStyleEntity,
  IconographySystemEntity
} from '../../types/brand';
import { LocalizedInput, LocalizedTextarea } from '../ui/LocalizedInput';
import { t } from '../../i18n/translations';
import {
  Plus,
  Trash2,
  Shapes,
  PenTool,
  Smile
} from 'lucide-react';

interface GraphicLanguageEditorProps {
  data?: VisualBasicsModule;
  uiLanguage: Language;
  contentLanguage: Language;
  onChange: (updated: VisualBasicsModule) => void;
}

const PREDEFINED_ELEMENT_CHARS = ['Geometric', 'Organic', 'Repeating', 'Dense', 'Sparse', 'Minimal', 'Abstract', 'Textured', 'Accented'];
const PREDEFINED_ILLUS_STYLES = ['Hand-drawn', 'Geometric', 'Minimal', 'Expressive', 'Editorial', 'Technical', 'Flat', 'Textured', 'Monoline'];
const PREDEFINED_ILLUS_SUBJECTS = ['People', 'Product', 'Botanical', 'Concepts', 'Environments', 'Abstract', 'Cafe Life'];
const PREDEFINED_ICON_STYLES = ['Outline', 'Filled', 'Monoline', 'Rounded', 'Geometric', 'Compact', 'Duo-tone'];

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
  const elements: GraphicElementEntity[] = glData.elements || [];
  const illustrationStyles: IllustrationStyleEntity[] = glData.illustrationStyles || [];
  const iconSystems: IconographySystemEntity[] = glData.iconSystems || [];

  const updateGL = (partial: Partial<GraphicLanguageData>) => {
    onChange({
      ...current,
      graphicLanguage: {
        ...glData,
        ...partial
      }
    });
  };

  // --- Graphic Elements Handlers ---
  const addElement = () => {
    const newEl: GraphicElementEntity = {
      id: 'ge-' + Date.now(),
      name: { en: '', id: '' },
      category: 'pattern',
      description: { en: '', id: '' },
      characteristics: [],
      usageNotes: { en: '', id: '' }
    };
    updateGL({ elements: [...elements, newEl] });
  };

  const updateElement = (id: string, key: keyof GraphicElementEntity, val: any) => {
    const updated = elements.map((el) => {
      if (el.id !== id) return el;
      return { ...el, [key]: val };
    });
    updateGL({ elements: updated });
  };

  const toggleElementChar = (id: string, char: string) => {
    const targetEl = elements.find((el) => el.id === id);
    if (!targetEl) return;
    const currentChars = targetEl.characteristics || [];
    const updated = currentChars.includes(char)
      ? currentChars.filter((c) => c !== char)
      : [...currentChars, char];
    updateElement(id, 'characteristics', updated);
  };

  const removeElement = (id: string) => {
    updateGL({ elements: elements.filter((el) => el.id !== id) });
  };

  // --- Illustration Styles Handlers ---
  const addIllustrationStyle = () => {
    const newIl: IllustrationStyleEntity = {
      id: 'illus-' + Date.now(),
      name: { en: '', id: '' },
      style: [],
      subjects: [],
      description: { en: '', id: '' },
      treatment: { en: '', id: '' }
    };
    updateGL({ illustrationStyles: [...illustrationStyles, newIl] });
  };

  const updateIllustrationStyle = (id: string, key: keyof IllustrationStyleEntity, val: any) => {
    const updated = illustrationStyles.map((il) => {
      if (il.id !== id) return il;
      return { ...il, [key]: val };
    });
    updateGL({ illustrationStyles: updated });
  };

  const toggleIllusTag = (id: string, listKey: 'style' | 'subjects', tag: string) => {
    const targetIl = illustrationStyles.find((il) => il.id === id);
    if (!targetIl) return;
    const currentList = targetIl[listKey] || [];
    const updated = currentList.includes(tag)
      ? currentList.filter((t) => t !== tag)
      : [...currentList, tag];
    updateIllustrationStyle(id, listKey, updated);
  };

  const removeIllustrationStyle = (id: string) => {
    updateGL({ illustrationStyles: illustrationStyles.filter((il) => il.id !== id) });
  };

  // --- Iconography Systems Handlers ---
  const addIconSystem = () => {
    const newIc: IconographySystemEntity = {
      id: 'icon-sys-' + Date.now(),
      name: { en: '', id: '' },
      style: [],
      gridSizePx: 24,
      strokeWidthPx: 2,
      description: { en: '', id: '' },
      cornerTreatment: 'rounded'
    };
    updateGL({ iconSystems: [...iconSystems, newIc] });
  };

  const updateIconSystem = (id: string, key: keyof IconographySystemEntity, val: any) => {
    const updated = iconSystems.map((ic) => {
      if (ic.id !== id) return ic;
      return { ...ic, [key]: val };
    });
    updateGL({ iconSystems: updated });
  };

  const toggleIconStyle = (id: string, tag: string) => {
    const targetIc = iconSystems.find((ic) => ic.id === id);
    if (!targetIc) return;
    const currentList = targetIc.style || [];
    const updated = currentList.includes(tag)
      ? currentList.filter((t) => t !== tag)
      : [...currentList, tag];
    updateIconSystem(id, 'style', updated);
  };

  const removeIconSystem = (id: string) => {
    updateGL({ iconSystems: iconSystems.filter((ic) => ic.id !== id) });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. Graphic Elements & Motifs (Entities) */}
      <div className="editor-card">
        <div className="editor-header">
          <div>
            <h2 className="editor-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shapes size={20} color="var(--accent-primary)" />
              {t('graphicElementsTitle', uiLanguage)}
            </h2>
            <p className="editor-subtitle">{t('graphicElementsSubtitle', uiLanguage)}</p>
          </div>
          <button className="btn-action-primary" onClick={addElement}>
            <Plus size={16} /> {t('addGraphicElement', uiLanguage)}
          </button>
        </div>

        {elements.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: '#64748b', backgroundColor: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-light)' }}>
            {t('noGraphicElementsEmpty', uiLanguage)}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {elements.map((el) => (
              <div
                key={el.id}
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
                      {t('elementName', uiLanguage)}
                    </label>
                    <LocalizedInput
                      value={el.name}
                      contentLanguage={contentLanguage}
                      placeholder={t('elementNamePlaceholder', uiLanguage)}
                      onChange={(val) => updateElement(el.id, 'name', val)}
                    />
                  </div>
                  <div style={{ width: '160px', marginRight: '12px' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>
                      {t('categoryLabel', uiLanguage)}
                    </label>
                    <select
                      value={el.category || 'pattern'}
                      onChange={(e) => updateElement(el.id, 'category', e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', fontSize: '0.85rem' }}
                    >
                      <option value="pattern">Pattern</option>
                      <option value="shape">Shape</option>
                      <option value="decorative">Decorative Motif</option>
                      <option value="line">Line / Texture</option>
                    </select>
                  </div>
                  <button
                    onClick={() => removeElement(el.id)}
                    style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '6px', marginTop: '18px' }}
                    title={t('removeElement', uiLanguage)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>
                      {t('elementDescription', uiLanguage)}
                    </label>
                    <LocalizedTextarea
                      value={el.description}
                      contentLanguage={contentLanguage}
                      rows={2}
                      placeholder={t('elementDescriptionPlaceholder', uiLanguage)}
                      onChange={(val) => updateElement(el.id, 'description', val)}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>
                      {t('elementUsageNotes', uiLanguage)}
                    </label>
                    <LocalizedTextarea
                      value={el.usageNotes}
                      contentLanguage={contentLanguage}
                      rows={2}
                      placeholder={t('elementUsageNotesPlaceholder', uiLanguage)}
                      onChange={(val) => updateElement(el.id, 'usageNotes', val)}
                    />
                  </div>
                </div>

                {/* Characteristics */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>
                    {t('elementCharacteristicsLabel', uiLanguage)}
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {PREDEFINED_ELEMENT_CHARS.map((char) => {
                      const isSelected = el.characteristics?.includes(char);
                      return (
                        <button
                          key={char}
                          type="button"
                          onClick={() => toggleElementChar(el.id, char)}
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
                          {char}
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

      {/* 2. Illustration Styles (Entities) */}
      <div className="editor-card">
        <div className="editor-header">
          <div>
            <h2 className="editor-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <PenTool size={20} color="var(--accent-primary)" />
              {t('illustrationStylesTitle', uiLanguage)}
            </h2>
            <p className="editor-subtitle">{t('illustrationStylesSubtitle', uiLanguage)}</p>
          </div>
          <button className="btn-action-primary" onClick={addIllustrationStyle}>
            <Plus size={16} /> {t('addIllustrationStyle', uiLanguage)}
          </button>
        </div>

        {illustrationStyles.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: '#64748b', backgroundColor: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-light)' }}>
            {t('noIllustrationStylesEmpty', uiLanguage)}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {illustrationStyles.map((il) => (
              <div
                key={il.id}
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
                      {t('styleNameLabel', uiLanguage)}
                    </label>
                    <LocalizedInput
                      value={il.name}
                      contentLanguage={contentLanguage}
                      placeholder={t('illustrationStylePlaceholder', uiLanguage)}
                      onChange={(val) => updateIllustrationStyle(il.id, 'name', val)}
                    />
                  </div>
                  <button
                    onClick={() => removeIllustrationStyle(il.id)}
                    style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '6px', marginTop: '18px' }}
                    title={t('removeIllustrationStyle', uiLanguage)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>
                      {t('styleDescriptionLabel', uiLanguage)}
                    </label>
                    <LocalizedTextarea
                      value={il.description}
                      contentLanguage={contentLanguage}
                      rows={2}
                      placeholder={t('styleDescriptionPlaceholder', uiLanguage)}
                      onChange={(val) => updateIllustrationStyle(il.id, 'description', val)}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>
                      {t('treatmentGuidanceLabel', uiLanguage)}
                    </label>
                    <LocalizedTextarea
                      value={il.treatment}
                      contentLanguage={contentLanguage}
                      rows={2}
                      placeholder={t('treatmentGuidancePlaceholder', uiLanguage)}
                      onChange={(val) => updateIllustrationStyle(il.id, 'treatment', val)}
                    />
                  </div>
                </div>

                {/* Style & Subjects */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>
                      {t('styleKeywordsLabel', uiLanguage)}
                    </label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {PREDEFINED_ILLUS_STYLES.map((st) => {
                        const isSelected = il.style?.includes(st);
                        return (
                          <button
                            key={st}
                            type="button"
                            onClick={() => toggleIllusTag(il.id, 'style', st)}
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
                            {st}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>
                      {t('subjectKeywordsLabel', uiLanguage)}
                    </label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {PREDEFINED_ILLUS_SUBJECTS.map((sub) => {
                        const isSelected = il.subjects?.includes(sub);
                        return (
                          <button
                            key={sub}
                            type="button"
                            onClick={() => toggleIllusTag(il.id, 'subjects', sub)}
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
                            {sub}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Iconography Systems (Entities) */}
      <div className="editor-card">
        <div className="editor-header">
          <div>
            <h2 className="editor-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Smile size={20} color="var(--accent-primary)" />
              {t('iconographySystemsTitle', uiLanguage)}
            </h2>
            <p className="editor-subtitle">{t('iconographySystemsSubtitle', uiLanguage)}</p>
          </div>
          <button className="btn-action-primary" onClick={addIconSystem}>
            <Plus size={16} /> {t('addIconSystem', uiLanguage)}
          </button>
        </div>

        {iconSystems.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: '#64748b', backgroundColor: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-light)' }}>
            {t('noIconSystemsEmpty', uiLanguage)}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {iconSystems.map((ic) => (
              <div
                key={ic.id}
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
                      {t('iconSystemName', uiLanguage)}
                    </label>
                    <LocalizedInput
                      value={ic.name}
                      contentLanguage={contentLanguage}
                      placeholder={t('iconSystemNamePlaceholder', uiLanguage)}
                      onChange={(val) => updateIconSystem(ic.id, 'name', val)}
                    />
                  </div>
                  <button
                    onClick={() => removeIconSystem(ic.id)}
                    style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '6px', marginTop: '18px' }}
                    title={t('removeIconSystem', uiLanguage)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', marginBottom: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>
                      {t('gridSizeLabel', uiLanguage)} (px)
                    </label>
                    <input
                      type="number"
                      value={ic.gridSizePx ?? ''}
                      onChange={(e) => updateIconSystem(ic.id, 'gridSizePx', e.target.value ? parseInt(e.target.value, 10) : undefined)}
                      placeholder="24"
                      style={{ width: '100%', padding: '7px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', fontSize: '0.85rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>
                      {t('strokeWidthLabel', uiLanguage)} (px)
                    </label>
                    <input
                      type="number"
                      value={ic.strokeWidthPx ?? ''}
                      onChange={(e) => updateIconSystem(ic.id, 'strokeWidthPx', e.target.value ? parseInt(e.target.value, 10) : undefined)}
                      placeholder="2"
                      style={{ width: '100%', padding: '7px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', fontSize: '0.85rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>
                      {t('cornerTreatmentLabel', uiLanguage)}
                    </label>
                    <select
                      value={ic.cornerTreatment || 'rounded'}
                      onChange={(e) => updateIconSystem(ic.id, 'cornerTreatment', e.target.value)}
                      style={{ width: '100%', padding: '7px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', fontSize: '0.85rem' }}
                    >
                      <option value="rounded">Rounded</option>
                      <option value="sharp">Sharp</option>
                      <option value="chamfered">Chamfered</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>
                    {t('systemDescriptionLabel', uiLanguage)}
                  </label>
                  <LocalizedTextarea
                    value={ic.description}
                    contentLanguage={contentLanguage}
                    rows={2}
                    placeholder={t('systemDescriptionPlaceholder', uiLanguage)}
                    onChange={(val) => updateIconSystem(ic.id, 'description', val)}
                  />
                </div>

                {/* Style tags */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>
                    {t('iconStylesLabel', uiLanguage)}
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {PREDEFINED_ICON_STYLES.map((st) => {
                      const isSelected = ic.style?.includes(st);
                      return (
                        <button
                          key={st}
                          type="button"
                          onClick={() => toggleIconStyle(ic.id, st)}
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
                          {st}
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
