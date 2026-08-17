import React from 'react';
import {
  VisualBasicsModule,
  Language,
  LogoVariant,
  LogoVariantKey,
  ColorSwatch,
  updateLocalizedString
} from '../../types/brand';
import { LocalizedTextarea } from '../ui/LocalizedInput';
import { t } from '../../i18n/translations';
import { Plus, Trash2, Image } from 'lucide-react';

interface VisualBasicsEditorProps {
  data?: VisualBasicsModule;
  uiLanguage: Language;
  contentLanguage: Language;
  onChange: (updated: VisualBasicsModule) => void;
}

const VARIANT_KEY_LABELS: Record<LogoVariantKey, { en: string; id: string }> = {
  primary: { en: 'Primary / Full Color', id: 'Utama / Warna Penuh' },
  black: { en: 'Black Lockup', id: 'Format Hitam' },
  white: { en: 'White / Reversed', id: 'Format Putih / Terbalik' },
  monochrome: { en: 'Monochrome', id: 'Monokrom' },
  simplifiedMark: { en: 'Simplified Mark', id: 'Simbol Disederhanakan' },
  horizontal: { en: 'Horizontal Lockup', id: 'Susunan Horisontal' },
  vertical: { en: 'Vertical / Stacked', id: 'Susunan Vertikal' },
  iconApp: { en: 'Icon / Favicon / App Mark', id: 'Ikon / Favicon / Merek Aplikasi' }
};

export const VisualBasicsEditor: React.FC<VisualBasicsEditorProps> = ({
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

  const updateField = (field: keyof VisualBasicsModule, val: any) => {
    onChange({ ...current, [field]: val });
  };

  const addLogoVariant = () => {
    const newVariant: LogoVariant = {
      id: 'logo-var-' + Date.now(),
      variantKey: 'primary',
      name: { en: 'New Logo Variant', id: 'Varian Logo Baru' },
      usageNotes: { en: '', id: '' },
      recommendedBg: '#ffffff',
      doNotUseWhen: { en: '', id: '' }
    };
    updateField('logoVariants', [...(current.logoVariants || []), newVariant]);
  };

  const updateLogoVariantText = (
    id: string,
    field: 'name' | 'usageNotes' | 'doNotUseWhen',
    textVal: string
  ) => {
    const updated = (current.logoVariants || []).map((v) => {
      if (v.id !== id) return v;
      return {
        ...v,
        [field]: updateLocalizedString(v[field], contentLanguage, textVal)
      };
    });
    updateField('logoVariants', updated);
  };

  const updateLogoVariantMeta = (id: string, field: keyof LogoVariant, val: any) => {
    const updated = (current.logoVariants || []).map((v) => {
      if (v.id !== id) return v;
      return { ...v, [field]: val };
    });
    updateField('logoVariants', updated);
  };

  const removeLogoVariant = (id: string) => {
    updateField(
      'logoVariants',
      (current.logoVariants || []).filter((v) => v.id !== id)
    );
  };

  const addColor = (palette: 'primaryColors' | 'secondaryColors') => {
    const newSwatch: ColorSwatch = {
      id: 'c-' + Date.now(),
      name: { en: 'New Color', id: 'Warna Baru' },
      hex: '#3b82f6',
      usage: { en: '', id: '' }
    };
    updateField(palette, [...current[palette], newSwatch]);
  };

  const updateColorText = (
    palette: 'primaryColors' | 'secondaryColors',
    id: string,
    field: 'name' | 'usage',
    textVal: string
  ) => {
    const updated = current[palette].map((c) => {
      if (c.id !== id) return c;
      return {
        ...c,
        [field]: updateLocalizedString(c[field], contentLanguage, textVal)
      };
    });
    updateField(palette, updated);
  };

  const updateColorHex = (
    palette: 'primaryColors' | 'secondaryColors',
    id: string,
    hexVal: string
  ) => {
    const updated = current[palette].map((c) => (c.id === id ? { ...c, hex: hexVal } : c));
    updateField(palette, updated);
  };

  const removeColor = (palette: 'primaryColors' | 'secondaryColors', id: string) => {
    updateField(
      palette,
      current[palette].filter((c) => c.id !== id)
    );
  };

  return (
    <div className="editor-card">
      <div className="editor-header">
        <div>
          <h2 className="editor-title">{t('visualBasicsTitle', uiLanguage)}</h2>
          <p className="editor-subtitle">{t('visualBasicsSubtitle', uiLanguage)}</p>
        </div>
      </div>

      <LocalizedTextarea
        label={t('logoUsageLabel', uiLanguage)}
        hint={t('logoUsageHint', uiLanguage)}
        placeholder={t('logoUsagePlaceholder', uiLanguage)}
        rows={3}
        value={current.logoUsageNotes}
        contentLanguage={contentLanguage}
        onChange={(val) => updateField('logoUsageNotes', val)}
      />

      {/* Logo Variant Placeholders */}
      <div className="form-group" style={{ marginTop: '32px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '14px'
          }}
        >
          <div>
            <label className="form-label" style={{ marginBottom: 0, fontSize: '1rem' }}>
              {t('logoVariantsTitle', uiLanguage)} ({current.logoVariants?.length || 0} slots)
            </label>
            <p className="form-hint" style={{ marginBottom: 0 }}>
              {t('logoVariantsSubtitle', uiLanguage)}
            </p>
          </div>
          <button type="button" className="btn btn-secondary btn-sm" onClick={addLogoVariant}>
            <Plus size={14} /> {t('addLogoVariant', uiLanguage)}
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {(current.logoVariants || []).map((variant) => {
            const nameVal =
              typeof variant.name === 'string'
                ? variant.name
                : variant.name?.[contentLanguage] || variant.name?.en || '';
            const usageVal =
              typeof variant.usageNotes === 'string'
                ? variant.usageNotes
                : variant.usageNotes?.[contentLanguage] || variant.usageNotes?.en || '';
            const doNotUseVal =
              typeof variant.doNotUseWhen === 'string'
                ? variant.doNotUseWhen
                : variant.doNotUseWhen?.[contentLanguage] || variant.doNotUseWhen?.en || '';

            return (
              <div
                key={variant.id}
                className="repeatable-item-block"
                style={{ backgroundColor: 'var(--bg-card)' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                  <div style={{ display: 'flex', gap: '10px', flex: 1, alignItems: 'center' }}>
                    <select
                      className="form-control"
                      style={{ width: '220px', fontWeight: 600 }}
                      value={variant.variantKey}
                      onChange={(e) =>
                        updateLogoVariantMeta(
                          variant.id,
                          'variantKey',
                          e.target.value as LogoVariantKey
                        )
                      }
                    >
                      {Object.entries(VARIANT_KEY_LABELS).map(([k, labelObj]) => (
                        <option key={k} value={k}>
                          {labelObj[uiLanguage] || labelObj.en}
                        </option>
                      ))}
                    </select>

                    <input
                      type="text"
                      className="form-control"
                      placeholder={`Variant Name (${contentLanguage.toUpperCase()})`}
                      value={nameVal}
                      style={{ fontWeight: 600, flex: 1 }}
                      onChange={(e) =>
                        updateLogoVariantText(variant.id, 'name', e.target.value)
                      }
                    />
                  </div>

                  <button
                    type="button"
                    className="btn-icon"
                    onClick={() => removeLogoVariant(variant.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Placeholder Preview Zone */}
                <div
                  style={{
                    height: '110px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: variant.recommendedBg || '#f8fafc',
                    border: '2px dashed var(--border-medium)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '16px',
                    margin: '8px 0'
                  }}
                >
                  <Image size={28} color="var(--text-subtle)" style={{ marginBottom: '6px' }} />
                  <span
                    style={{
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      color:
                        variant.recommendedBg?.toLowerCase() === '#ffffff' ||
                        variant.recommendedBg?.toLowerCase() === '#f7f4ef'
                          ? '#0f172a'
                          : '#64748b'
                    }}
                  >
                    {nameVal || VARIANT_KEY_LABELS[variant.variantKey][uiLanguage]} [Placeholder Slot]
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', marginTop: '2px' }}>
                    Asset Drop Zone / Data URL Ready
                  </span>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gap: '10px'
                  }}
                >
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-subtle)' }}>
                      USAGE NOTES ({contentLanguage.toUpperCase()})
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="When & where to use..."
                      value={usageVal}
                      onChange={(e) =>
                        updateLogoVariantText(variant.id, 'usageNotes', e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-subtle)' }}>
                      RECOMMENDED BG (HEX / Note)
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. #f7f4ef or Light background"
                      value={variant.recommendedBg || ''}
                      onChange={(e) =>
                        updateLogoVariantMeta(variant.id, 'recommendedBg', e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#991b1b' }}>
                      DO NOT USE WHEN ({contentLanguage.toUpperCase()})
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Unsuitable surfaces/contexts..."
                      value={doNotUseVal}
                      style={{ borderColor: '#fca5a5' }}
                      onChange={(e) =>
                        updateLogoVariantText(variant.id, 'doNotUseWhen', e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Primary Color Palette */}
      <div className="form-group" style={{ marginTop: '32px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px'
          }}
        >
          <div>
            <label className="form-label" style={{ marginBottom: 0 }}>
              {t('primaryColorPalette', uiLanguage)}
            </label>
            <p className="form-hint" style={{ marginBottom: 0 }}>
              {t('primaryColorHint', uiLanguage)}
            </p>
          </div>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => addColor('primaryColors')}
          >
            <Plus size={14} /> {t('addPrimaryColor', uiLanguage)}
          </button>
        </div>

        <div className="swatch-grid">
          {current.primaryColors.map((color) => {
            const nameVal =
              typeof color.name === 'string'
                ? color.name
                : color.name?.[contentLanguage] || color.name?.en || '';
            const usageVal =
              typeof color.usage === 'string'
                ? color.usage
                : color.usage?.[contentLanguage] || color.usage?.en || '';

            return (
              <div key={color.id} className="swatch-card">
                <div
                  className="swatch-preview"
                  style={{
                    backgroundColor: color.hex || '#e2e8f0',
                    color:
                      color.hex?.toLowerCase() === '#ffffff' ||
                      color.hex?.toLowerCase() === '#f7f4ef'
                        ? '#0f172a'
                        : '#ffffff'
                  }}
                >
                  {color.hex}
                </div>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={color.hex || '#3b82f6'}
                    onChange={(e) => updateColorHex('primaryColors', color.id, e.target.value)}
                    style={{
                      width: '32px',
                      height: '32px',
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer'
                    }}
                  />
                  <input
                    type="text"
                    className="form-control"
                    placeholder={`Name (${contentLanguage.toUpperCase()})`}
                    value={nameVal}
                    style={{ fontWeight: 600, flex: 1 }}
                    onChange={(e) =>
                      updateColorText('primaryColors', color.id, 'name', e.target.value)
                    }
                  />
                  <button
                    type="button"
                    className="btn-icon"
                    onClick={() => removeColor('primaryColors', color.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <input
                  type="text"
                  className="form-control"
                  placeholder="HEX (e.g. #2d241e)"
                  value={color.hex}
                  onChange={(e) => updateColorHex('primaryColors', color.id, e.target.value)}
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder={`Usage (${contentLanguage.toUpperCase()})`}
                  value={usageVal}
                  onChange={(e) =>
                    updateColorText('primaryColors', color.id, 'usage', e.target.value)
                  }
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Secondary Color Palette */}
      <div className="form-group">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px'
          }}
        >
          <div>
            <label className="form-label" style={{ marginBottom: 0 }}>
              {t('secondaryColorPalette', uiLanguage)}
            </label>
            <p className="form-hint" style={{ marginBottom: 0 }}>
              {t('secondaryColorHint', uiLanguage)}
            </p>
          </div>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => addColor('secondaryColors')}
          >
            <Plus size={14} /> {t('addSecondaryColor', uiLanguage)}
          </button>
        </div>

        <div className="swatch-grid">
          {current.secondaryColors.map((color) => {
            const nameVal =
              typeof color.name === 'string'
                ? color.name
                : color.name?.[contentLanguage] || color.name?.en || '';
            const usageVal =
              typeof color.usage === 'string'
                ? color.usage
                : color.usage?.[contentLanguage] || color.usage?.en || '';

            return (
              <div key={color.id} className="swatch-card">
                <div
                  className="swatch-preview"
                  style={{
                    backgroundColor: color.hex || '#e2e8f0',
                    color:
                      color.hex?.toLowerCase() === '#ffffff' ||
                      color.hex?.toLowerCase() === '#f7f4ef'
                        ? '#0f172a'
                        : '#ffffff'
                  }}
                >
                  {color.hex}
                </div>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={color.hex || '#3b82f6'}
                    onChange={(e) => updateColorHex('secondaryColors', color.id, e.target.value)}
                    style={{
                      width: '32px',
                      height: '32px',
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer'
                    }}
                  />
                  <input
                    type="text"
                    className="form-control"
                    placeholder={`Name (${contentLanguage.toUpperCase()})`}
                    value={nameVal}
                    style={{ fontWeight: 600, flex: 1 }}
                    onChange={(e) =>
                      updateColorText('secondaryColors', color.id, 'name', e.target.value)
                    }
                  />
                  <button
                    type="button"
                    className="btn-icon"
                    onClick={() => removeColor('secondaryColors', color.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <input
                  type="text"
                  className="form-control"
                  placeholder="HEX"
                  value={color.hex}
                  onChange={(e) => updateColorHex('secondaryColors', color.id, e.target.value)}
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder={`Usage (${contentLanguage.toUpperCase()})`}
                  value={usageVal}
                  onChange={(e) =>
                    updateColorText('secondaryColors', color.id, 'usage', e.target.value)
                  }
                />
              </div>
            );
          })}
        </div>
      </div>

      <LocalizedTextarea
        label={t('typographyTitle', uiLanguage)}
        hint={t('typographyHint', uiLanguage)}
        placeholder={t('typographyPlaceholder', uiLanguage)}
        rows={3}
        value={current.typographyNotes}
        contentLanguage={contentLanguage}
        onChange={(val) => updateField('typographyNotes', val)}
      />

      <LocalizedTextarea
        label={t('imageryTitle', uiLanguage)}
        hint={t('imageryHint', uiLanguage)}
        placeholder={t('imageryPlaceholder', uiLanguage)}
        rows={3}
        value={current.imageryDirection}
        contentLanguage={contentLanguage}
        onChange={(val) => updateField('imageryDirection', val)}
      />

      <LocalizedTextarea
        label={t('layoutTitle', uiLanguage)}
        rows={2}
        value={current.layoutNotes}
        contentLanguage={contentLanguage}
        onChange={(val) => updateField('layoutNotes', val)}
      />
    </div>
  );
};
