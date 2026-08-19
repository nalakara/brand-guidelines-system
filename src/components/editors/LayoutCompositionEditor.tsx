import React, { useState } from 'react';
import {
  VisualBasicsModule,
  Language,
  LayoutCompositionData,
  GridData,
  SpacingData,
  AlignmentData,
  LayoutCategoryData,
  getLocalizedText
} from '../../types/brand';
import { LocalizedTextarea } from '../ui/LocalizedInput';
import { t } from '../../i18n/translations';
import {
  Plus,
  Edit2,
  Trash2,
  LayoutGrid,
  Maximize2,
  AlignLeft,
  Scale,
  Layers,
  Compass,
  Check
} from 'lucide-react';

interface LayoutCompositionEditorProps {
  data?: VisualBasicsModule;
  uiLanguage: Language;
  contentLanguage: Language;
  onChange: (updated: VisualBasicsModule) => void;
}

const PREDEFINED_CHARACTERISTICS = {
  grid: ['Column', 'Modular', 'Baseline', 'Freeform', 'Structured', 'Flexible'],
  spacing: ['Tight', 'Moderate', 'Generous', 'Consistent', 'Rhythmic', 'Dense', 'Spacious'],
  alignment: ['Left', 'Center', 'Right', 'Edge-aligned', 'Baseline', 'Symmetrical', 'Asymmetrical'],
  proportion: ['Balanced', 'Generous', 'Compact', 'Oversized', 'Restrained', 'Dynamic', 'Symmetrical', 'Asymmetrical'],
  hierarchy: ['Strong', 'Clear', 'Minimal', 'Typographic', 'Contrast-driven', 'Scale-driven', 'Layered'],
  compositionPrinciples: ['Minimal', 'Spacious', 'Dynamic', 'Structured', 'Editorial', 'Balanced', 'Asymmetrical', 'Focused', 'Layered', 'Restrained']
};

export const LayoutCompositionEditor: React.FC<LayoutCompositionEditorProps> = ({
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

  const layoutData: LayoutCompositionData = current.layoutComposition || {};

  const [activeEditingArea, setActiveEditingArea] = useState<
    'grid' | 'spacing' | 'alignment' | 'proportion' | 'hierarchy' | 'compositionPrinciples' | null
  >(null);

  // Form states for active Area editing
  const [descInput, setDescInput] = useState<any>(undefined);
  const [selectedChars, setSelectedChars] = useState<string[]>([]);

  // Grid fields
  const [gridType, setGridType] = useState<'column' | 'modular' | 'baseline' | 'freeform' | 'custom'>('column');
  const [gridCols, setGridCols] = useState<number | undefined>(12);
  const [gridGutter, setGridGutter] = useState<number | undefined>(24);
  const [gridMargin, setGridMargin] = useState<number | undefined>(64);

  // Spacing field
  const [baseUnit, setBaseUnit] = useState<number | undefined>(8);

  // Alignment field
  const [prefAlignment, setPrefAlignment] = useState<'left' | 'center' | 'right' | 'edge' | 'asymmetrical' | 'custom'>('left');

  const updateLayoutData = (updatedLayout: LayoutCompositionData) => {
    onChange({
      ...current,
      layoutComposition: updatedLayout
    });
  };

  const openEditorForArea = (areaKey: keyof LayoutCompositionData) => {
    const existing = layoutData[areaKey];
    setDescInput(existing?.description);
    setSelectedChars(existing?.characteristics || []);

    if (areaKey === 'grid') {
      const g = existing as GridData;
      setGridType(g?.type || 'column');
      setGridCols(g?.columns || 12);
      setGridGutter(g?.gutterPx || 24);
      setGridMargin(g?.marginPx || 64);
    } else if (areaKey === 'spacing') {
      const s = existing as SpacingData;
      setBaseUnit(s?.baseUnitPx || 8);
    } else if (areaKey === 'alignment') {
      const a = existing as AlignmentData;
      setPrefAlignment(a?.preferredAlignment || 'left');
    }

    setActiveEditingArea(areaKey);
  };

  const handleSaveArea = (areaKey: keyof LayoutCompositionData) => {
    let updatedObj: any;

    if (areaKey === 'grid') {
      updatedObj = {
        description: descInput,
        characteristics: selectedChars,
        type: gridType,
        columns: gridCols,
        gutterPx: gridGutter,
        marginPx: gridMargin
      } as GridData;
    } else if (areaKey === 'spacing') {
      updatedObj = {
        description: descInput,
        characteristics: selectedChars,
        baseUnitPx: baseUnit
      } as SpacingData;
    } else if (areaKey === 'alignment') {
      updatedObj = {
        description: descInput,
        characteristics: selectedChars,
        preferredAlignment: prefAlignment
      } as AlignmentData;
    } else {
      updatedObj = {
        description: descInput,
        characteristics: selectedChars
      } as LayoutCategoryData;
    }

    updateLayoutData({
      ...layoutData,
      [areaKey]: updatedObj
    });

    setActiveEditingArea(null);
  };

  const handleClearArea = (areaKey: keyof LayoutCompositionData) => {
    if (confirm('Clear definition for this area?')) {
      const copy = { ...layoutData };
      delete copy[areaKey];
      updateLayoutData(copy);
      if (activeEditingArea === areaKey) {
        setActiveEditingArea(null);
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

  const renderAreaCard = (
    areaKey: keyof LayoutCompositionData,
    titleKey: string,
    noTitleKey: string,
    noSubtitleKey: string,
    defineKey: string,
    placeholderKey: string,
    predefinedTagList: string[],
    IconComponent: any
  ) => {
    const areaData = layoutData[areaKey];
    const isEditing = activeEditingArea === areaKey;
    const descText = getLocalizedText(areaData?.description, contentLanguage).text;
    const hasData = areaData && (descText || (areaData.characteristics && areaData.characteristics.length > 0));

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
                title="Clear Area"
                onClick={() => handleClearArea(areaKey)}
              >
                <Trash2 size={15} />
              </button>
            )}
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => openEditorForArea(areaKey)}
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
              handleSaveArea(areaKey);
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

            {/* Custom fields for Grid */}
            {areaKey === 'grid' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
                <div>
                  <label className="form-label">{t('gridTypeLabel', uiLanguage)}</label>
                  <select
                    className="form-control"
                    value={gridType}
                    onChange={(e) => setGridType(e.target.value as any)}
                  >
                    <option value="column">Column</option>
                    <option value="modular">Modular</option>
                    <option value="baseline">Baseline</option>
                    <option value="freeform">Freeform</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">{t('gridColumnsLabel', uiLanguage)}</label>
                  <input
                    type="number"
                    className="form-control"
                    value={gridCols || ''}
                    onChange={(e) => setGridCols(Number(e.target.value))}
                  />
                </div>

                <div>
                  <label className="form-label">{t('gridGutterLabel', uiLanguage)}</label>
                  <input
                    type="number"
                    className="form-control"
                    value={gridGutter || ''}
                    onChange={(e) => setGridGutter(Number(e.target.value))}
                  />
                </div>

                <div>
                  <label className="form-label">{t('gridMarginLabel', uiLanguage)}</label>
                  <input
                    type="number"
                    className="form-control"
                    value={gridMargin || ''}
                    onChange={(e) => setGridMargin(Number(e.target.value))}
                  />
                </div>
              </div>
            )}

            {/* Custom field for Spacing */}
            {areaKey === 'spacing' && (
              <div style={{ maxWidth: '200px' }}>
                <label className="form-label">{t('spacingBaseUnitLabel', uiLanguage)}</label>
                <input
                  type="number"
                  className="form-control"
                  value={baseUnit || ''}
                  onChange={(e) => setBaseUnit(Number(e.target.value))}
                />
              </div>
            )}

            {/* Custom field for Alignment */}
            {areaKey === 'alignment' && (
              <div style={{ maxWidth: '240px' }}>
                <label className="form-label">{t('alignmentPreferredLabel', uiLanguage)}</label>
                <select
                  className="form-control"
                  value={prefAlignment}
                  onChange={(e) => setPrefAlignment(e.target.value as any)}
                >
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                  <option value="edge">Edge-aligned</option>
                  <option value="asymmetrical">Asymmetrical</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
            )}

            {/* Standard Characteristics Selection */}
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
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setActiveEditingArea(null)}>
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

            {/* Custom Data Chips */}
            {areaKey === 'grid' && (areaData as GridData)?.columns && (
              <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                <strong>Grid:</strong> {(areaData as GridData).columns} columns · Gutter: {(areaData as GridData).gutterPx || '—'}px · Margin: {(areaData as GridData).marginPx || '—'}px
              </div>
            )}

            {areaKey === 'spacing' && (areaData as SpacingData)?.baseUnitPx && (
              <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                <strong>Base Unit:</strong> {(areaData as SpacingData).baseUnitPx}px
              </div>
            )}

            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {(areaData.characteristics || []).map((tag, idx) => (
                <span key={idx} className="badge badge-secondary" style={{ fontSize: '0.78rem' }}>
                  {tag}
                </span>
              ))}
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
          {t('layoutCompositionTitle', uiLanguage)}
        </h2>
        <p className="editor-subtitle" style={{ marginTop: '2px' }}>
          {t('layoutCompositionSubtitle', uiLanguage)}
        </p>
      </div>

      {/* 6 Area Cards */}
      {renderAreaCard('grid', 'gridAreaTitle', 'noGridTitle', 'noGridSubtitle', 'defineGrid', 'gridDescPlaceholder', PREDEFINED_CHARACTERISTICS.grid, LayoutGrid)}
      {renderAreaCard('spacing', 'spacingAreaTitle', 'noSpacingTitle', 'noSpacingSubtitle', 'defineSpacing', 'spacingDescPlaceholder', PREDEFINED_CHARACTERISTICS.spacing, Maximize2)}
      {renderAreaCard('alignment', 'alignmentAreaTitle', 'noAlignmentTitle', 'noAlignmentSubtitle', 'defineAlignment', 'alignmentDescPlaceholder', PREDEFINED_CHARACTERISTICS.alignment, AlignLeft)}
      {renderAreaCard('proportion', 'proportionAreaTitle', 'noProportionTitle', 'noProportionSubtitle', 'defineProportion', 'proportionDescPlaceholder', PREDEFINED_CHARACTERISTICS.proportion, Scale)}
      {renderAreaCard('hierarchy', 'hierarchyAreaTitle', 'noHierarchyTitle', 'noHierarchySubtitle', 'defineHierarchy', 'hierarchyDescPlaceholder', PREDEFINED_CHARACTERISTICS.hierarchy, Layers)}
      {renderAreaCard('compositionPrinciples', 'compositionPrinciplesAreaTitle', 'noCompositionPrinciplesTitle', 'noCompositionPrinciplesSubtitle', 'defineCompositionPrinciples', 'compositionPrinciplesDescPlaceholder', PREDEFINED_CHARACTERISTICS.compositionPrinciples, Compass)}
    </div>
  );
};
