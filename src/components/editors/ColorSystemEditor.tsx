import React, { useState } from 'react';
import {
  VisualBasicsModule,
  Language,
  ColorItem,
  ColorRole,
  ColorSwatch,
  getLocalizedText,
  updateLocalizedString
} from '../../types/brand';
import { LocalizedTextarea } from '../ui/LocalizedInput';
import { t } from '../../i18n/translations';
import { Plus, Trash2, Palette, ChevronRight } from 'lucide-react';

interface ColorSystemEditorProps {
  data?: VisualBasicsModule;
  uiLanguage: Language;
  contentLanguage: Language;
  onChange: (updated: VisualBasicsModule) => void;
}

const COLOR_ROLES: { role: ColorRole; labelKey: string }[] = [
  { role: 'primary', labelKey: 'colorRolePrimary' },
  { role: 'secondary', labelKey: 'colorRoleSecondary' },
  { role: 'accent', labelKey: 'colorRoleAccent' },
  { role: 'neutral', labelKey: 'colorRoleNeutral' },
  { role: 'supporting', labelKey: 'colorRoleSupporting' },
  { role: 'custom', labelKey: 'colorRoleCustom' }
];

/**
 * Color math helpers for HEX -> RGB -> HSL -> CMYK
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const sanitized = hex.replace('#', '').trim();
  if (!/^[0-9A-Fa-f]{6}$|^[0-9A-Fa-f]{3}$/.test(sanitized)) return null;

  let fullHex = sanitized;
  if (sanitized.length === 3) {
    fullHex = sanitized.split('').map((char) => char + char).join('');
  }

  const num = parseInt(fullHex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const delta = max - min;

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (delta !== 0) {
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
    switch (max) {
      case rNorm:
        h = (gNorm - bNorm) / delta + (gNorm < bNorm ? 6 : 0);
        break;
      case gNorm:
        h = (bNorm - rNorm) / delta + 2;
        break;
      case bNorm:
        h = (rNorm - gNorm) / delta + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

export function rgbToCmyk(r: number, g: number, b: number): { c: number; m: number; y: number; k: number } {
  if (r === 0 && g === 0 && b === 0) {
    return { c: 0, m: 0, y: 0, k: 100 };
  }

  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const k = 1 - Math.max(rNorm, gNorm, bNorm);
  const c = (1 - rNorm - k) / (1 - k);
  const m = (1 - gNorm - k) / (1 - k);
  const y = (1 - bNorm - k) / (1 - k);

  return {
    c: Math.round(c * 100),
    m: Math.round(m * 100),
    y: Math.round(y * 100),
    k: Math.round(k * 100)
  };
}

export function deriveColorFormats(hex: string): { rgbStr: string; hslStr: string; cmykStr: string } {
  const rgb = hexToRgb(hex);
  if (!rgb) {
    return { rgbStr: '—', hslStr: '—', cmykStr: '—' };
  }
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);

  return {
    rgbStr: `${rgb.r} / ${rgb.g} / ${rgb.b}`,
    hslStr: `${hsl.h}° / ${hsl.s}% / ${hsl.l}%`,
    cmykStr: `${cmyk.c}% / ${cmyk.m}% / ${cmyk.y}% / ${cmyk.k}%`
  };
}

export const ColorSystemEditor: React.FC<ColorSystemEditorProps> = ({
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

  // Convert legacy primaryColors / secondaryColors if colors array is empty
  const getInitialColors = (): ColorItem[] => {
    if (current.colors && current.colors.length > 0) {
      return current.colors;
    }
    const legacy: ColorItem[] = [];
    (current.primaryColors || []).forEach((c, idx) => {
      const derived = deriveColorFormats(c.hex);
      legacy.push({
        id: c.id || `c-p-${idx}`,
        name: getLocalizedText(c.name, 'en').text || 'Primary Color',
        role: idx === 0 ? 'primary' : 'secondary',
        hex: c.hex,
        rgb: derived.rgbStr,
        hsl: derived.hslStr,
        cmyk: derived.cmykStr,
        description: c.usage
      });
    });
    (current.secondaryColors || []).forEach((c, idx) => {
      const derived = deriveColorFormats(c.hex);
      legacy.push({
        id: c.id || `c-s-${idx}`,
        name: getLocalizedText(c.name, 'en').text || 'Accent Color',
        role: 'accent',
        hex: c.hex,
        rgb: derived.rgbStr,
        hsl: derived.hslStr,
        cmyk: derived.cmykStr,
        description: c.usage
      });
    });
    return legacy;
  };

  const colorsList = getInitialColors();

  const [selectedColorId, setSelectedColorId] = useState<string | null>(null);
  const [showAddFlow, setShowAddFlow] = useState(false);

  // New Color Form State
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#3b82f6');
  const [newColorRole, setNewColorRole] = useState<ColorRole>('primary');
  const [newColorDesc, setNewColorDesc] = useState('');

  const updateColorsList = (updatedColors: ColorItem[]) => {
    // Keep legacy primaryColors / secondaryColors in sync for compatibility
    const primarySwatches: ColorSwatch[] = updatedColors
      .filter((c) => c.role === 'primary' || c.role === 'secondary')
      .map((c) => ({
        id: c.id,
        name: { en: c.name, id: c.name },
        hex: c.hex,
        usage: c.description
      }));

    const secondarySwatches: ColorSwatch[] = updatedColors
      .filter((c) => c.role !== 'primary' && c.role !== 'secondary')
      .map((c) => ({
        id: c.id,
        name: { en: c.name, id: c.name },
        hex: c.hex,
        usage: c.description
      }));

    onChange({
      ...current,
      colors: updatedColors,
      primaryColors: primarySwatches,
      secondaryColors: secondarySwatches
    });
  };

  const handleCreateColor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColorName.trim()) return;

    const formattedHex = newColorHex.startsWith('#') ? newColorHex : `#${newColorHex}`;
    const derived = deriveColorFormats(formattedHex);

    const newColorItem: ColorItem = {
      id: 'color-' + Date.now(),
      name: newColorName.trim(),
      role: newColorRole,
      hex: formattedHex,
      rgb: derived.rgbStr,
      hsl: derived.hslStr,
      cmyk: derived.cmykStr,
      description: newColorDesc.trim() ? updateLocalizedString(undefined, contentLanguage, newColorDesc.trim()) : undefined,
      updatedAt: new Date().toISOString()
    };

    const updated = [...colorsList, newColorItem];
    updateColorsList(updated);

    // Reset & open detail view
    setNewColorName('');
    setNewColorHex('#3b82f6');
    setNewColorRole('primary');
    setNewColorDesc('');
    setShowAddFlow(false);
    setSelectedColorId(newColorItem.id);
  };

  const handleDeleteColor = (id: string, colorName: string) => {
    if (confirm(`Delete color "${colorName}"?`)) {
      const updated = colorsList.filter((c) => c.id !== id);
      updateColorsList(updated);
      if (selectedColorId === id) {
        setSelectedColorId(null);
      }
    }
  };

  const selectedColor = colorsList.find((c) => c.id === selectedColorId);

  const updateSelectedColor = (updater: (prev: ColorItem) => ColorItem) => {
    if (!selectedColorId) return;
    const updated = colorsList.map((c) => {
      if (c.id !== selectedColorId) return c;
      const modified = updater(c);
      const derived = deriveColorFormats(modified.hex);
      return {
        ...modified,
        rgb: derived.rgbStr,
        hsl: derived.hslStr,
        cmyk: derived.cmykStr
      };
    });
    updateColorsList(updated);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Editor Header */}
      <div className="editor-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 className="editor-title" style={{ fontSize: '1.25rem', fontWeight: 700 }}>
              {t('colorSystemTitle', uiLanguage)}
            </h2>
            <p className="editor-subtitle" style={{ marginTop: '2px' }}>
              {t('colorSystemSubtitle', uiLanguage)}
            </p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => {
              setShowAddFlow(true);
              setSelectedColorId(null);
            }}
          >
            <Plus size={16} /> {t('addColor', uiLanguage)}
          </button>
        </div>
      </div>

      {/* Add Color Form / Flow View */}
      {showAddFlow && (
        <div className="editor-card" style={{ padding: '24px', border: '2px solid var(--accent-primary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
              {t('addColor', uiLanguage)}
            </h3>
            <button className="btn-icon" onClick={() => setShowAddFlow(false)}>
              ✕
            </button>
          </div>

          <form onSubmit={handleCreateColor} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Step 1: Color Name */}
            <div className="form-group">
              <label className="form-label">{t('colorNameLabel', uiLanguage)}</label>
              <input
                type="text"
                className="form-control"
                placeholder={t('colorNamePlaceholder', uiLanguage)}
                value={newColorName}
                onChange={(e) => setNewColorName(e.target.value)}
                autoFocus
                required
              />
            </div>

            {/* Step 2: Define Color Value */}
            <div>
              <label className="form-label" style={{ fontWeight: 600, marginBottom: '8px' }}>
                {t('colorHexLabel', uiLanguage)}
              </label>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <input
                  type="color"
                  value={newColorHex.startsWith('#') && newColorHex.length === 7 ? newColorHex : '#3b82f6'}
                  onChange={(e) => setNewColorHex(e.target.value)}
                  style={{
                    width: '48px',
                    height: '44px',
                    padding: '2px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-medium)',
                    cursor: 'pointer'
                  }}
                />
                <input
                  type="text"
                  className="form-control"
                  style={{ width: '180px', fontFamily: 'monospace', fontWeight: 600 }}
                  placeholder="#123456"
                  value={newColorHex}
                  onChange={(e) => setNewColorHex(e.target.value)}
                  required
                />
                <div style={{ fontSize: '0.85rem', color: 'var(--text-subtle)', fontFamily: 'monospace' }}>
                  RGB: {deriveColorFormats(newColorHex).rgbStr}
                </div>
              </div>
            </div>

            {/* Step 3: Role Assignment */}
            <div>
              <label className="form-label" style={{ fontWeight: 600, marginBottom: '8px' }}>
                {t('colorRoleLabel', uiLanguage)}
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {COLOR_ROLES.map((cr) => (
                  <button
                    key={cr.role}
                    type="button"
                    onClick={() => setNewColorRole(cr.role)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: 'var(--radius-sm)',
                      border: newColorRole === cr.role ? '2px solid var(--accent-primary)' : '1px solid var(--border-light)',
                      backgroundColor: newColorRole === cr.role ? 'var(--accent-light)' : 'var(--bg-card)',
                      color: 'var(--text-main)',
                      fontSize: '0.84rem',
                      fontWeight: newColorRole === cr.role ? 600 : 400,
                      cursor: 'pointer'
                    }}
                  >
                    {t(cr.labelKey, uiLanguage)}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 4: Optional Description */}
            <div className="form-group">
              <label className="form-label">{t('colorDescLabel', uiLanguage)}</label>
              <input
                type="text"
                className="form-control"
                placeholder={t('colorDescPlaceholder', uiLanguage)}
                value={newColorDesc}
                onChange={(e) => setNewColorDesc(e.target.value)}
              />
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setShowAddFlow(false)}>
                {t('cancel', uiLanguage)}
              </button>
              <button type="submit" className="btn btn-accent" disabled={!newColorName.trim() || !newColorHex.trim()}>
                {t('create', uiLanguage)}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Content Area: Grid Swatches + Detail Editor */}
      <div style={{ display: 'grid', gridTemplateColumns: colorsList.length > 0 ? '320px 1fr' : '1fr', gap: '20px' }}>
        {/* Colors Swatches List */}
        {colorsList.length === 0 ? (
          /* Empty State */
          <div className="editor-card" style={{ padding: '48px 24px', textAlign: 'center' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                color: 'var(--text-muted)'
              }}
            >
              <Palette size={24} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' }}>
              {t('noColorsTitle', uiLanguage)}
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-subtle)', marginBottom: '20px' }}>
              {t('noColorsSubtitle', uiLanguage)}
            </p>
            <button
              className="btn btn-accent"
              onClick={() => {
                setShowAddFlow(true);
                setSelectedColorId(null);
              }}
            >
              <Plus size={16} /> {t('addColor', uiLanguage)}
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', paddingLeft: '4px' }}>
              Brand Colors ({colorsList.length})
            </div>
            {colorsList.map((color) => {
              const isSelected = selectedColorId === color.id;
              const roleLabel = COLOR_ROLES.find((r) => r.role === color.role)?.labelKey || 'colorRoleCustom';

              return (
                <div
                  key={color.id}
                  onClick={() => {
                    setSelectedColorId(color.id);
                    setShowAddFlow(false);
                  }}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: isSelected ? '2px solid var(--accent-primary)' : '1px solid var(--border-light)',
                    backgroundColor: isSelected ? 'var(--accent-light)' : 'var(--bg-card)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {/* Visual Color Swatch */}
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: color.hex,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        border: '1px solid rgba(0,0,0,0.1)',
                        flexShrink: 0
                      }}
                    />
                    <div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-main)' }}>
                        {color.name}
                      </div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '2px' }}>
                        <span className="badge badge-outline" style={{ fontSize: '0.7rem' }}>
                          {t(roleLabel, uiLanguage)}
                        </span>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                          {color.hex}
                        </span>
                      </div>
                    </div>
                  </div>

                  <ChevronRight size={16} style={{ color: isSelected ? 'var(--accent-primary)' : 'var(--border-medium)' }} />
                </div>
              );
            })}
          </div>
        )}

        {/* Selected Color Detail Editor View */}
        {selectedColor && (
          <div className="editor-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid var(--border-light)', paddingBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: selectedColor.hex,
                    boxShadow: 'var(--shadow-md)',
                    border: '1px solid rgba(0,0,0,0.1)'
                  }}
                />
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {selectedColor.name}
                  </h3>
                  <span className="badge badge-secondary" style={{ marginTop: '2px' }}>
                    {t(COLOR_ROLES.find((r) => r.role === selectedColor.role)?.labelKey || 'colorRoleCustom', uiLanguage)}
                  </span>
                </div>
              </div>

              <button
                className="btn-icon"
                style={{ color: '#ef4444' }}
                title="Delete Color"
                onClick={() => handleDeleteColor(selectedColor.id, selectedColor.name)}
              >
                <Trash2 size={16} />
              </button>
            </div>

            {/* Overview & Editable Fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '28px' }}>
              <h4 style={{ fontSize: '0.88rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                Color Identity & Role
              </h4>

              <div className="form-group">
                <label className="form-label">{t('colorNameLabel', uiLanguage)}</label>
                <input
                  type="text"
                  className="form-control"
                  value={selectedColor.name}
                  onChange={(e) => updateSelectedColor((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label className="form-label">{t('colorRoleLabel', uiLanguage)}</label>
                  <select
                    className="form-control"
                    value={selectedColor.role}
                    onChange={(e) => updateSelectedColor((prev) => ({ ...prev, role: e.target.value as ColorRole }))}
                  >
                    {COLOR_ROLES.map((cr) => (
                      <option key={cr.role} value={cr.role}>
                        {t(cr.labelKey, uiLanguage)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label">{t('colorHexLabel', uiLanguage)}</label>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input
                      type="color"
                      value={selectedColor.hex.startsWith('#') && selectedColor.hex.length === 7 ? selectedColor.hex : '#3b82f6'}
                      onChange={(e) => updateSelectedColor((prev) => ({ ...prev, hex: e.target.value }))}
                      style={{
                        width: '40px',
                        height: '38px',
                        padding: '2px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-medium)',
                        cursor: 'pointer'
                      }}
                    />
                    <input
                      type="text"
                      className="form-control"
                      style={{ fontFamily: 'monospace', fontWeight: 600 }}
                      value={selectedColor.hex}
                      onChange={(e) => updateSelectedColor((prev) => ({ ...prev, hex: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              <LocalizedTextarea
                label={t('colorDescLabel', uiLanguage)}
                placeholder={t('colorDescPlaceholder', uiLanguage)}
                rows={2}
                value={selectedColor.description}
                contentLanguage={contentLanguage}
                onChange={(updatedLoc) => updateSelectedColor((prev) => ({ ...prev, description: updatedLoc }))}
              />
            </div>

            {/* Derived Color Values Display */}
            <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '20px' }}>
              <h4 style={{ fontSize: '0.88rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '14px' }}>
                {t('colorValuesTitle', uiLanguage)}
              </h4>

              {(() => {
                const derived = deriveColorFormats(selectedColor.hex);
                return (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
                    <div style={{ padding: '12px', backgroundColor: 'var(--bg-muted)', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '2px' }}>HEX</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, fontFamily: 'monospace', color: 'var(--text-main)' }}>
                        {selectedColor.hex}
                      </div>
                    </div>

                    <div style={{ padding: '12px', backgroundColor: 'var(--bg-muted)', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '2px' }}>RGB</div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 600, fontFamily: 'monospace', color: 'var(--text-main)' }}>
                        {derived.rgbStr}
                      </div>
                    </div>

                    <div style={{ padding: '12px', backgroundColor: 'var(--bg-muted)', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '2px' }}>HSL</div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 600, fontFamily: 'monospace', color: 'var(--text-main)' }}>
                        {derived.hslStr}
                      </div>
                    </div>

                    <div style={{ padding: '12px', backgroundColor: 'var(--bg-muted)', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '2px' }}>CMYK</div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 600, fontFamily: 'monospace', color: 'var(--text-main)' }}>
                        {derived.cmykStr}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
