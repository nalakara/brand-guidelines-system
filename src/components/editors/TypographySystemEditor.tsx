import React, { useState } from 'react';
import {
  VisualBasicsModule,
  Language,
  FontItem,
  FontRole,
  TypeStyleItem,
  TypeStyleCategory,
  updateLocalizedString,
  getLocalizedText
} from '../../types/brand';
import { t } from '../../i18n/translations';
import { Plus, Trash2, Type, ChevronRight, Check, Eye } from 'lucide-react';

interface TypographySystemEditorProps {
  data?: VisualBasicsModule;
  uiLanguage: Language;
  contentLanguage: Language;
  onChange: (updated: VisualBasicsModule) => void;
}

const FONT_ROLES: { role: FontRole; labelKey: string }[] = [
  { role: 'primary', labelKey: 'fontRolePrimary' },
  { role: 'secondary', labelKey: 'fontRoleSecondary' },
  { role: 'supporting', labelKey: 'fontRoleSupporting' },
  { role: 'custom', labelKey: 'fontRoleCustom' }
];

const TYPE_STYLE_CATEGORIES: { category: TypeStyleCategory; labelKey: string }[] = [
  { category: 'display', labelKey: 'categoryDisplay' },
  { category: 'heading', labelKey: 'categoryHeading' },
  { category: 'body', labelKey: 'categoryBody' },
  { category: 'caption', labelKey: 'categoryCaption' },
  { category: 'custom', labelKey: 'categoryCustom' }
];

const WEIGHT_OPTIONS = [
  { weight: 100, label: '100 Thin' },
  { weight: 200, label: '200 Extra Light' },
  { weight: 300, label: '300 Light' },
  { weight: 400, label: '400 Regular' },
  { weight: 500, label: '500 Medium' },
  { weight: 600, label: '600 Semi Bold' },
  { weight: 700, label: '700 Bold' },
  { weight: 800, label: '800 Extra Bold' },
  { weight: 900, label: '900 Black' }
];

export const TypographySystemEditor: React.FC<TypographySystemEditorProps> = ({
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

  // Convert legacy typographyNotes if fonts array is empty
  const getInitialFonts = (): FontItem[] => {
    if (current.fonts && current.fonts.length > 0) {
      return current.fonts;
    }
    const notesText = getLocalizedText(current.typographyNotes, 'en').text;
    if (notesText) {
      return [
        {
          id: 'font-default-1',
          name: notesText.split('.')[0] || 'Primary Brand Font',
          role: 'primary',
          weights: [400, 600, 700],
          styles: ['normal']
        }
      ];
    }
    return [];
  };

  const fontsList = getInitialFonts();
  const typeStylesList = current.typeStyles || [];

  // Selected State
  const [selectedFontId, setSelectedFontId] = useState<string | null>(null);
  const [selectedTypeStyleId, setSelectedTypeStyleId] = useState<string | null>(null);

  // Add Flows State
  const [showAddFontFlow, setShowAddFontFlow] = useState(false);
  const [showAddStyleFlow, setShowAddStyleFlow] = useState(false);

  // New Font State
  const [newFontName, setNewFontName] = useState('');
  const [newFontRole, setNewFontRole] = useState<FontRole>('primary');
  const [newFontWeights, setNewFontWeights] = useState<number[]>([400, 600, 700]);

  // New Type Style State
  const [newStyleName, setNewStyleName] = useState('');
  const [newStyleCategory, setNewStyleCategory] = useState<TypeStyleCategory>('heading');
  const [newStyleFontId, setNewStyleFontId] = useState<string>('');
  const [newStyleWeight, setNewStyleWeight] = useState<number>(700);
  const [newStyleSizePx, setNewStyleSizePx] = useState<number>(32);
  const [newStyleLineHeight, setNewStyleLineHeight] = useState<number>(1.2);
  const [newStyleLetterSpacing] = useState<number>(-0.02);

  const updateTypographyData = (updatedFonts: FontItem[], updatedStyles: TypeStyleItem[]) => {
    // Keep legacy typographyNotes in sync for compatibility
    const notesStr = updatedFonts.map((f) => `${f.name} (${f.role})`).join(' · ');

    onChange({
      ...current,
      fonts: updatedFonts,
      typeStyles: updatedStyles,
      typographyNotes: notesStr ? updateLocalizedString(current.typographyNotes, contentLanguage, notesStr) : current.typographyNotes
    });
  };

  // --- Handlers for Fonts ---
  const handleCreateFont = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFontName.trim()) return;

    const newFont: FontItem = {
      id: 'font-' + Date.now(),
      name: newFontName.trim(),
      role: newFontRole,
      weights: newFontWeights,
      styles: ['normal'],
      updatedAt: new Date().toISOString()
    };

    const updatedFonts = [...fontsList, newFont];
    updateTypographyData(updatedFonts, typeStylesList);

    setNewFontName('');
    setShowAddFontFlow(false);
    setSelectedFontId(newFont.id);
  };

  const handleDeleteFont = (id: string, fontName: string) => {
    if (confirm(`Delete font "${fontName}"?`)) {
      const updatedFonts = fontsList.filter((f) => f.id !== id);
      // Clean up orphaned type styles reference
      const updatedStyles = typeStylesList.filter((s) => s.fontFamilyId !== id);
      updateTypographyData(updatedFonts, updatedStyles);

      if (selectedFontId === id) setSelectedFontId(null);
    }
  };

  const toggleWeightInNewFont = (weight: number) => {
    if (newFontWeights.includes(weight)) {
      setNewFontWeights(newFontWeights.filter((w) => w !== weight));
    } else {
      setNewFontWeights([...newFontWeights, weight].sort((a, b) => a - b));
    }
  };

  // --- Handlers for Type Styles ---
  const handleCreateTypeStyle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStyleName.trim()) return;

    const targetFontId = newStyleFontId || (fontsList[0]?.id || 'fallback-font');

    const newStyle: TypeStyleItem = {
      id: 'style-' + Date.now(),
      name: newStyleName.trim(),
      category: newStyleCategory,
      fontFamilyId: targetFontId,
      weight: newStyleWeight,
      sizePx: newStyleSizePx,
      lineHeight: newStyleLineHeight,
      letterSpacingEm: newStyleLetterSpacing,
      updatedAt: new Date().toISOString()
    };

    const updatedStyles = [...typeStylesList, newStyle];
    updateTypographyData(fontsList, updatedStyles);

    setNewStyleName('');
    setShowAddStyleFlow(false);
    setSelectedTypeStyleId(newStyle.id);
  };

  const handleDeleteTypeStyle = (id: string, styleName: string) => {
    if (confirm(`Delete type style "${styleName}"?`)) {
      const updatedStyles = typeStylesList.filter((s) => s.id !== id);
      updateTypographyData(fontsList, updatedStyles);
      if (selectedTypeStyleId === id) setSelectedTypeStyleId(null);
    }
  };

  const selectedTypeStyle = typeStylesList.find((s) => s.id === selectedTypeStyleId);

  const updateSelectedTypeStyle = (updater: (prev: TypeStyleItem) => TypeStyleItem) => {
    if (!selectedTypeStyleId) return;
    const updatedStyles = typeStylesList.map((s) => (s.id === selectedTypeStyleId ? updater(s) : s));
    updateTypographyData(fontsList, updatedStyles);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Editor Header */}
      <div className="editor-card" style={{ padding: '24px' }}>
        <h2 className="editor-title" style={{ fontSize: '1.25rem', fontWeight: 700 }}>
          {t('typographySystemTitle', uiLanguage)}
        </h2>
        <p className="editor-subtitle" style={{ marginTop: '2px' }}>
          {t('typographySystemSubtitle', uiLanguage)}
        </p>
      </div>

      {/* ========================================================================= */}
      {/* 1. FONTS SECTION */}
      {/* ========================================================================= */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: '4px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
            {t('fontsSectionTitle', uiLanguage)} ({fontsList.length})
          </h3>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => {
              setShowAddFontFlow(true);
              setSelectedFontId(null);
            }}
          >
            <Plus size={14} /> {t('addFont', uiLanguage)}
          </button>
        </div>

        {/* Add Font Flow Form */}
        {showAddFontFlow && (
          <div className="editor-card" style={{ padding: '20px', border: '2px solid var(--accent-primary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{t('addFont', uiLanguage)}</h4>
              <button className="btn-icon" onClick={() => setShowAddFontFlow(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateFont} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">{t('fontNameLabel', uiLanguage)}</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder={t('fontNamePlaceholder', uiLanguage)}
                  value={newFontName}
                  onChange={(e) => setNewFontName(e.target.value)}
                  autoFocus
                  required
                />
              </div>

              <div>
                <label className="form-label">{t('fontRoleLabel', uiLanguage)}</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {FONT_ROLES.map((fr) => (
                    <button
                      key={fr.role}
                      type="button"
                      onClick={() => setNewFontRole(fr.role)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 'var(--radius-sm)',
                        border: newFontRole === fr.role ? '2px solid var(--accent-primary)' : '1px solid var(--border-light)',
                        backgroundColor: newFontRole === fr.role ? 'var(--accent-light)' : 'var(--bg-card)',
                        fontSize: '0.82rem',
                        cursor: 'pointer'
                      }}
                    >
                      {t(fr.labelKey, uiLanguage)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="form-label">{t('fontWeightsLabel', uiLanguage)}</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '6px' }}>
                  {WEIGHT_OPTIONS.map((w) => {
                    const isSelected = newFontWeights.includes(w.weight);
                    return (
                      <button
                        key={w.weight}
                        type="button"
                        onClick={() => toggleWeightInNewFont(w.weight)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 10px',
                          borderRadius: 'var(--radius-sm)',
                          border: isSelected ? '1px solid var(--accent-primary)' : '1px solid var(--border-light)',
                          backgroundColor: isSelected ? 'var(--accent-light)' : 'var(--bg-card)',
                          fontSize: '0.8rem',
                          cursor: 'pointer'
                        }}
                      >
                        <div
                          style={{
                            width: '14px',
                            height: '14px',
                            borderRadius: '3px',
                            border: isSelected ? 'none' : '1px solid var(--border-medium)',
                            backgroundColor: isSelected ? 'var(--accent-primary)' : 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#ffffff'
                          }}
                        >
                          {isSelected && <Check size={10} strokeWidth={3} />}
                        </div>
                        <span>{w.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowAddFontFlow(false)}>
                  {t('cancel', uiLanguage)}
                </button>
                <button type="submit" className="btn btn-accent btn-sm" disabled={!newFontName.trim()}>
                  {t('create', uiLanguage)}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Fonts List & Detail */}
        {fontsList.length === 0 ? (
          <div className="editor-card" style={{ padding: '32px 24px', textAlign: 'center' }}>
            <Type size={24} style={{ color: 'var(--text-muted)', marginBottom: '8px' }} />
            <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>{t('noFontsTitle', uiLanguage)}</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-subtle)', marginBottom: '16px' }}>
              {t('noFontsSubtitle', uiLanguage)}
            </p>
            <button className="btn btn-accent btn-sm" onClick={() => setShowAddFontFlow(true)}>
              <Plus size={14} /> {t('addFont', uiLanguage)}
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
            {fontsList.map((font) => {
              const isSelected = selectedFontId === font.id;
              const roleLabel = FONT_ROLES.find((r) => r.role === font.role)?.labelKey || 'fontRoleCustom';

              return (
                <div
                  key={font.id}
                  onClick={() => setSelectedFontId(isSelected ? null : font.id)}
                  style={{
                    padding: '16px',
                    borderRadius: 'var(--radius-md)',
                    border: isSelected ? '2px solid var(--accent-primary)' : '1px solid var(--border-light)',
                    backgroundColor: 'var(--bg-card)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 700, fontFamily: font.name }}>{font.name}</h4>
                      <span className="badge badge-secondary" style={{ fontSize: '0.72rem', marginTop: '2px' }}>
                        {t(roleLabel, uiLanguage)}
                      </span>
                    </div>

                    <button
                      className="btn-icon"
                      style={{ color: '#ef4444' }}
                      title="Delete Font"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteFont(font.id, font.name);
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {font.weights?.length ? font.weights.map((w: number) => `${w}`).join(' · ') : 'Regular'}
                  </div>

                  <div
                    style={{
                      fontFamily: font.name,
                      fontSize: '1.25rem',
                      lineHeight: 1.3,
                      letterSpacing: '-0.01em',
                      color: 'var(--text-main)',
                      backgroundColor: 'var(--bg-muted)',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-sm)'
                    }}
                  >
                    Aa Bb Cc  0123456789
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. TYPE STYLES SECTION */}
      {/* ========================================================================= */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderTop: '1px solid var(--border-light)', paddingTop: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: '4px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
            {t('typeStylesSectionTitle', uiLanguage)} ({typeStylesList.length})
          </h3>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => {
              setShowAddStyleFlow(true);
              setSelectedTypeStyleId(null);
            }}
          >
            <Plus size={14} /> {t('addTypeStyle', uiLanguage)}
          </button>
        </div>

        {/* Add Type Style Flow Form */}
        {showAddStyleFlow && (
          <div className="editor-card" style={{ padding: '20px', border: '2px solid var(--accent-primary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{t('addTypeStyle', uiLanguage)}</h4>
              <button className="btn-icon" onClick={() => setShowAddStyleFlow(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTypeStyle} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">{t('typeStyleNameLabel', uiLanguage)}</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder={t('typeStyleNamePlaceholder', uiLanguage)}
                    value={newStyleName}
                    onChange={(e) => setNewStyleName(e.target.value)}
                    autoFocus
                    required
                  />
                </div>

                <div>
                  <label className="form-label">{t('typeStyleCategoryLabel', uiLanguage)}</label>
                  <select
                    className="form-control"
                    value={newStyleCategory}
                    onChange={(e) => setNewStyleCategory(e.target.value as TypeStyleCategory)}
                  >
                    {TYPE_STYLE_CATEGORIES.map((cat) => (
                      <option key={cat.category} value={cat.category}>
                        {t(cat.labelKey, uiLanguage)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="form-label">{t('typeStyleFontLabel', uiLanguage)}</label>
                  <select
                    className="form-control"
                    value={newStyleFontId || (fontsList[0]?.id || '')}
                    onChange={(e) => setNewStyleFontId(e.target.value)}
                  >
                    {fontsList.length === 0 ? (
                      <option value="">(No fonts defined yet)</option>
                    ) : (
                      fontsList.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.name} ({f.role})
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div>
                  <label className="form-label">{t('typeStyleWeightLabel', uiLanguage)}</label>
                  <select
                    className="form-control"
                    value={newStyleWeight}
                    onChange={(e) => setNewStyleWeight(Number(e.target.value))}
                  >
                    {WEIGHT_OPTIONS.map((w) => (
                      <option key={w.weight} value={w.weight}>
                        {w.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label">{t('typeStyleSizeLabel', uiLanguage)}</label>
                  <input
                    type="number"
                    className="form-control"
                    value={newStyleSizePx}
                    onChange={(e) => setNewStyleSizePx(Number(e.target.value))}
                  />
                </div>

                <div>
                  <label className="form-label">{t('typeStyleLineHeightLabel', uiLanguage)}</label>
                  <input
                    type="number"
                    step="0.05"
                    className="form-control"
                    value={newStyleLineHeight}
                    onChange={(e) => setNewStyleLineHeight(Number(e.target.value))}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowAddStyleFlow(false)}>
                  {t('cancel', uiLanguage)}
                </button>
                <button type="submit" className="btn btn-accent btn-sm" disabled={!newStyleName.trim()}>
                  {t('create', uiLanguage)}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Type Styles List & Live Preview */}
        {typeStylesList.length === 0 ? (
          <div className="editor-card" style={{ padding: '32px 24px', textAlign: 'center' }}>
            <Eye size={24} style={{ color: 'var(--text-muted)', marginBottom: '8px' }} />
            <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>{t('noTypeStylesTitle', uiLanguage)}</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-subtle)', marginBottom: '16px' }}>
              {t('noTypeStylesSubtitle', uiLanguage)}
            </p>
            <button className="btn btn-accent btn-sm" onClick={() => setShowAddStyleFlow(true)}>
              <Plus size={14} /> {t('addTypeStyle', uiLanguage)}
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: typeStylesList.length > 0 ? '300px 1fr' : '1fr', gap: '20px' }}>
            {/* Styles List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {typeStylesList.map((style) => {
                const isSelected = selectedTypeStyleId === style.id;
                const font = fontsList.find((f) => f.id === style.fontFamilyId);

                return (
                  <div
                    key={style.id}
                    onClick={() => setSelectedTypeStyleId(style.id)}
                    style={{
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-md)',
                      border: isSelected ? '2px solid var(--accent-primary)' : '1px solid var(--border-light)',
                      backgroundColor: isSelected ? 'var(--accent-light)' : 'var(--bg-card)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-main)' }}>
                        {style.name}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {font?.name || 'Default'} · {style.weight} · {style.sizePx}px
                      </div>
                    </div>
                    <ChevronRight size={16} style={{ color: isSelected ? 'var(--accent-primary)' : 'var(--border-medium)' }} />
                  </div>
                );
              })}
            </div>

            {/* Selected Style Detail & Live Preview Editor */}
            {selectedTypeStyle && (
              <div className="editor-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid var(--border-light)', paddingBottom: '16px' }}>
                  <div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{selectedTypeStyle.name}</h4>
                    <span className="badge badge-secondary" style={{ marginTop: '2px' }}>
                      {t(TYPE_STYLE_CATEGORIES.find((c) => c.category === selectedTypeStyle.category)?.labelKey || 'categoryCustom', uiLanguage)}
                    </span>
                  </div>

                  <button
                    className="btn-icon"
                    style={{ color: '#ef4444' }}
                    title="Delete Type Style"
                    onClick={() => handleDeleteTypeStyle(selectedTypeStyle.id, selectedTypeStyle.name)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Editable Properties */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
                  <div className="form-group">
                    <label className="form-label">{t('typeStyleNameLabel', uiLanguage)}</label>
                    <input
                      type="text"
                      className="form-control"
                      value={selectedTypeStyle.name}
                      onChange={(e) => updateSelectedTypeStyle((prev) => ({ ...prev, name: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="form-label">{t('typeStyleFontLabel', uiLanguage)}</label>
                    <select
                      className="form-control"
                      value={selectedTypeStyle.fontFamilyId}
                      onChange={(e) => updateSelectedTypeStyle((prev) => ({ ...prev, fontFamilyId: e.target.value }))}
                    >
                      {fontsList.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.name} ({f.role})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="form-label">{t('typeStyleWeightLabel', uiLanguage)}</label>
                    <select
                      className="form-control"
                      value={selectedTypeStyle.weight}
                      onChange={(e) => updateSelectedTypeStyle((prev) => ({ ...prev, weight: Number(e.target.value) }))}
                    >
                      {WEIGHT_OPTIONS.map((w) => (
                        <option key={w.weight} value={w.weight}>
                          {w.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="form-label">{t('typeStyleSizeLabel', uiLanguage)}</label>
                    <input
                      type="number"
                      className="form-control"
                      value={selectedTypeStyle.sizePx}
                      onChange={(e) => updateSelectedTypeStyle((prev) => ({ ...prev, sizePx: Number(e.target.value) }))}
                    />
                  </div>

                  <div>
                    <label className="form-label">{t('typeStyleLineHeightLabel', uiLanguage)}</label>
                    <input
                      type="number"
                      step="0.05"
                      className="form-control"
                      value={selectedTypeStyle.lineHeight}
                      onChange={(e) => updateSelectedTypeStyle((prev) => ({ ...prev, lineHeight: Number(e.target.value) }))}
                    />
                  </div>

                  <div>
                    <label className="form-label">{t('typeStyleLetterSpacingLabel', uiLanguage)}</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      value={selectedTypeStyle.letterSpacingEm}
                      onChange={(e) => updateSelectedTypeStyle((prev) => ({ ...prev, letterSpacingEm: Number(e.target.value) }))}
                    />
                  </div>
                </div>

                {/* Live Typographic Preview Box */}
                <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '10px' }}>
                    {t('livePreviewTitle', uiLanguage)}
                  </div>

                  {(() => {
                    const font = fontsList.find((f) => f.id === selectedTypeStyle.fontFamilyId);
                    return (
                      <div
                        style={{
                          fontFamily: font?.name || 'inherit',
                          fontWeight: selectedTypeStyle.weight,
                          fontSize: `${selectedTypeStyle.sizePx}px`,
                          lineHeight: selectedTypeStyle.lineHeight,
                          letterSpacing: `${selectedTypeStyle.letterSpacingEm}em`,
                          color: 'var(--text-main)',
                          backgroundColor: 'var(--bg-muted)',
                          padding: '20px',
                          borderRadius: 'var(--radius-md)',
                          overflowX: 'auto'
                        }}
                      >
                        The quick brown fox jumps over the lazy dog.
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
