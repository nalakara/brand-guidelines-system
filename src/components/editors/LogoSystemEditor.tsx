import React, { useState } from 'react';
import {
  VisualBasicsModule,
  Language,
  LogoItem,
  LogoType,
  LogoRole,
  VariantColorType,
  LogoItemVariant,
  updateLocalizedString,
  getLocalizedText
} from '../../types/brand';
import { LocalizedInput } from '../ui/LocalizedInput';
import { t } from '../../i18n/translations';
import { Plus, Trash2, Layers, Check, ChevronRight } from 'lucide-react';

interface LogoSystemEditorProps {
  data?: VisualBasicsModule;
  uiLanguage: Language;
  contentLanguage: Language;
  onChange: (updated: VisualBasicsModule) => void;
}

const LOGO_TYPES: { type: LogoType; labelKey: string }[] = [
  { type: 'primaryLogo', labelKey: 'typePrimaryLogo' },
  { type: 'secondaryLogo', labelKey: 'typeSecondaryLogo' },
  { type: 'symbolMark', labelKey: 'typeSymbolMark' },
  { type: 'wordmark', labelKey: 'typeWordmark' },
  { type: 'monogram', labelKey: 'typeMonogram' },
  { type: 'lockup', labelKey: 'typeLockup' },
  { type: 'badgeEmblem', labelKey: 'typeBadgeEmblem' },
  { type: 'other', labelKey: 'typeOther' }
];

const LOGO_ROLES: { role: LogoRole; labelKey: string }[] = [
  { role: 'primary', labelKey: 'rolePrimary' },
  { role: 'secondary', labelKey: 'roleSecondary' },
  { role: 'supporting', labelKey: 'roleSupporting' },
  { role: 'campaign', labelKey: 'roleCampaign' },
  { role: 'custom', labelKey: 'roleCustom' }
];

const COLOR_TYPES: { colorType: VariantColorType; labelKey: string }[] = [
  { colorType: 'fullColor', labelKey: 'colorFullColor' },
  { colorType: 'white', labelKey: 'colorWhite' },
  { colorType: 'black', labelKey: 'colorBlack' },
  { colorType: 'monochrome', labelKey: 'colorMonochrome' },
  { colorType: 'reversed', labelKey: 'colorReversed' },
  { colorType: 'custom', labelKey: 'colorCustom' }
];

export const LogoSystemEditor: React.FC<LogoSystemEditorProps> = ({
  data,
  uiLanguage,
  contentLanguage,
  onChange
}) => {
  const current: VisualBasicsModule = data || {
    logoUsageNotes: { en: '', id: '' },
    logoVariants: [],
    logos: [],
    primaryColors: [],
    secondaryColors: [],
    typographyNotes: { en: '', id: '' },
    imageryDirection: { en: '', id: '' },
    layoutNotes: { en: '', id: '' }
  };

  const logosList = current.logos || [];

  const [selectedLogoId, setSelectedLogoId] = useState<string | null>(null);
  const [showAddFlow, setShowAddFlow] = useState(false);

  // New Logo Form State (Progressive flow)
  const [newLogoName, setNewLogoName] = useState('');
  const [newLogoType, setNewLogoType] = useState<LogoType>('primaryLogo');
  const [newLogoRole, setNewLogoRole] = useState<LogoRole>('primary');
  const [selectedDefaultVariants, setSelectedDefaultVariants] = useState<VariantColorType[]>([
    'fullColor',
    'white',
    'black'
  ]);

  const updateLogos = (updatedLogos: LogoItem[]) => {
    onChange({
      ...current,
      logos: updatedLogos
    });
  };

  const handleCreateLogo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLogoName.trim()) return;

    const newVariants: LogoItemVariant[] = selectedDefaultVariants.map((colorType) => ({
      id: 'var-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      name: {
        en: `${newLogoName.trim()} ${colorType.charAt(0).toUpperCase() + colorType.slice(1)}`,
        id: `${newLogoName.trim()} ${colorType}`
      },
      colorType,
      assetReference: ''
    }));

    const newLogo: LogoItem = {
      id: 'logo-' + Date.now(),
      name: newLogoName.trim(),
      type: newLogoType,
      role: newLogoRole,
      variants: newVariants,
      structure: {
        hasSymbol: newLogoType === 'primaryLogo' || newLogoType === 'symbolMark' || newLogoType === 'lockup',
        hasWordmark: newLogoType === 'primaryLogo' || newLogoType === 'wordmark' || newLogoType === 'lockup',
        composition: { en: '', id: '' }
      },
      updatedAt: new Date().toISOString()
    };

    const updated = [...logosList, newLogo];
    updateLogos(updated);

    // Reset & open details
    setNewLogoName('');
    setNewLogoType('primaryLogo');
    setNewLogoRole('primary');
    setShowAddFlow(false);
    setSelectedLogoId(newLogo.id);
  };

  const handleDeleteLogo = (id: string, logoName: string) => {
    if (confirm(`Delete logo "${logoName}"?`)) {
      const updated = logosList.filter((l) => l.id !== id);
      updateLogos(updated);
      if (selectedLogoId === id) {
        setSelectedLogoId(null);
      }
    }
  };

  const selectedLogo = logosList.find((l) => l.id === selectedLogoId);

  const updateSelectedLogo = (updater: (prev: LogoItem) => LogoItem) => {
    if (!selectedLogoId) return;
    const updated = logosList.map((l) => (l.id === selectedLogoId ? updater(l) : l));
    updateLogos(updated);
  };

  const addVariantToSelected = () => {
    if (!selectedLogo) return;
    const newVariant: LogoItemVariant = {
      id: 'var-' + Date.now(),
      name: { en: 'New Variant', id: 'Varian Baru' },
      colorType: 'custom',
      assetReference: ''
    };
    updateSelectedLogo((prev) => ({
      ...prev,
      variants: [...prev.variants, newVariant]
    }));
  };

  const removeVariantFromSelected = (varId: string) => {
    if (!selectedLogo) return;
    updateSelectedLogo((prev) => ({
      ...prev,
      variants: prev.variants.filter((v) => v.id !== varId)
    }));
  };

  const updateVariantInSelected = (
    varId: string,
    field: keyof LogoItemVariant,
    val: any
  ) => {
    if (!selectedLogo) return;
    updateSelectedLogo((prev) => ({
      ...prev,
      variants: prev.variants.map((v) => (v.id === varId ? { ...v, [field]: val } : v))
    }));
  };

  const toggleVariantColorSelection = (colorType: VariantColorType) => {
    if (selectedDefaultVariants.includes(colorType)) {
      setSelectedDefaultVariants(selectedDefaultVariants.filter((c) => c !== colorType));
    } else {
      setSelectedDefaultVariants([...selectedDefaultVariants, colorType]);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Editor Header */}
      <div className="editor-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 className="editor-title" style={{ fontSize: '1.25rem', fontWeight: 700 }}>
              {t('logoSystemTitle', uiLanguage)}
            </h2>
            <p className="editor-subtitle" style={{ marginTop: '2px' }}>
              {t('logoSystemSubtitle', uiLanguage)}
            </p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => {
              setShowAddFlow(true);
              setSelectedLogoId(null);
            }}
          >
            <Plus size={16} /> {t('addLogo', uiLanguage)}
          </button>
        </div>
      </div>

      {/* Add Logo Form / Flow View */}
      {showAddFlow && (
        <div className="editor-card" style={{ padding: '24px', border: '2px solid var(--accent-primary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
              {t('addLogo', uiLanguage)}
            </h3>
            <button className="btn-icon" onClick={() => setShowAddFlow(false)}>
              ✕
            </button>
          </div>

          <form onSubmit={handleCreateLogo} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Step 1: Identify Logo Type */}
            <div>
              <label className="form-label" style={{ fontWeight: 600, marginBottom: '8px' }}>
                1. What are you adding? (Logo Type)
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '8px' }}>
                {LOGO_TYPES.map((lt) => (
                  <button
                    key={lt.type}
                    type="button"
                    onClick={() => setNewLogoType(lt.type)}
                    style={{
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: newLogoType === lt.type ? '2px solid var(--accent-primary)' : '1px solid var(--border-light)',
                      backgroundColor: newLogoType === lt.type ? 'var(--accent-light)' : 'var(--bg-card)',
                      color: 'var(--text-main)',
                      fontSize: '0.85rem',
                      fontWeight: newLogoType === lt.type ? 600 : 400,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    {t(lt.labelKey, uiLanguage)}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Name */}
            <div className="form-group">
              <label className="form-label">2. Logo Name *</label>
              <input
                type="text"
                className="form-control"
                placeholder={t('logoNamePlaceholder', uiLanguage)}
                value={newLogoName}
                onChange={(e) => setNewLogoName(e.target.value)}
                autoFocus
                required
              />
            </div>

            {/* Step 3: Role */}
            <div>
              <label className="form-label" style={{ fontWeight: 600, marginBottom: '8px' }}>
                3. How is it used? (Role)
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {LOGO_ROLES.map((lr) => (
                  <button
                    key={lr.role}
                    type="button"
                    onClick={() => setNewLogoRole(lr.role)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: 'var(--radius-sm)',
                      border: newLogoRole === lr.role ? '2px solid var(--accent-primary)' : '1px solid var(--border-light)',
                      backgroundColor: newLogoRole === lr.role ? 'var(--accent-light)' : 'var(--bg-card)',
                      color: 'var(--text-main)',
                      fontSize: '0.84rem',
                      fontWeight: newLogoRole === lr.role ? 600 : 400,
                      cursor: 'pointer'
                    }}
                  >
                    {t(lr.labelKey, uiLanguage)}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 4: Default Variants */}
            <div>
              <label className="form-label" style={{ fontWeight: 600, marginBottom: '6px' }}>
                4. Select versions / variants to create:
              </label>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '6px' }}>
                {COLOR_TYPES.map((ct) => {
                  const isChecked = selectedDefaultVariants.includes(ct.colorType);
                  return (
                    <button
                      key={ct.colorType}
                      type="button"
                      onClick={() => toggleVariantColorSelection(ct.colorType)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        borderRadius: 'var(--radius-sm)',
                        border: isChecked ? '1px solid var(--accent-primary)' : '1px solid var(--border-light)',
                        backgroundColor: isChecked ? 'var(--accent-light)' : 'var(--bg-card)',
                        fontSize: '0.82rem',
                        cursor: 'pointer'
                      }}
                    >
                      <div
                        style={{
                          width: '16px',
                          height: '16px',
                          borderRadius: '4px',
                          border: isChecked ? 'none' : '1px solid var(--border-medium)',
                          backgroundColor: isChecked ? 'var(--accent-primary)' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#ffffff'
                        }}
                      >
                        {isChecked && <Check size={12} strokeWidth={3} />}
                      </div>
                      <span>{t(ct.labelKey, uiLanguage)}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setShowAddFlow(false)}>
                {t('cancel', uiLanguage)}
              </button>
              <button type="submit" className="btn btn-accent" disabled={!newLogoName.trim()}>
                {t('create', uiLanguage)}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Content Area: List + Details */}
      <div style={{ display: 'grid', gridTemplateColumns: logosList.length > 0 ? '300px 1fr' : '1fr', gap: '20px' }}>
        {/* Logos List Sidebar/Cards */}
        {logosList.length === 0 ? (
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
              <Layers size={24} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' }}>
              {t('noLogosTitle', uiLanguage)}
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-subtle)', marginBottom: '20px' }}>
              {t('noLogosSubtitle', uiLanguage)}
            </p>
            <button
              className="btn btn-accent"
              onClick={() => {
                setShowAddFlow(true);
                setSelectedLogoId(null);
              }}
            >
              <Plus size={16} /> {t('addLogo', uiLanguage)}
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', paddingLeft: '4px' }}>
              Brand Logos ({logosList.length})
            </div>
            {logosList.map((logo) => {
              const isSelected = selectedLogoId === logo.id;
              const typeLabel = LOGO_TYPES.find((t) => t.type === logo.type)?.labelKey || 'typeOther';
              const roleLabel = LOGO_ROLES.find((r) => r.role === logo.role)?.labelKey || 'roleCustom';

              return (
                <div
                  key={logo.id}
                  onClick={() => {
                    setSelectedLogoId(logo.id);
                    setShowAddFlow(false);
                  }}
                  style={{
                    padding: '14px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: isSelected ? '2px solid var(--accent-primary)' : '1px solid var(--border-light)',
                    backgroundColor: isSelected ? 'var(--accent-light)' : 'var(--bg-card)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>
                      {logo.name}
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
                      <span className="badge badge-secondary" style={{ fontSize: '0.72rem' }}>
                        {t(typeLabel, uiLanguage)}
                      </span>
                      {logo.role && (
                        <span className="badge badge-outline" style={{ fontSize: '0.72rem' }}>
                          {t(roleLabel, uiLanguage)}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                      {logo.variants?.length || 0} variant(s)
                    </div>
                  </div>
                  <ChevronRight size={16} style={{ color: isSelected ? 'var(--accent-primary)' : 'var(--border-medium)' }} />
                </div>
              );
            })}
          </div>
        )}

        {/* Selected Logo Editor Detail View */}
        {selectedLogo && (
          <div className="editor-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid var(--border-light)', paddingBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  {selectedLogo.name}
                </h3>
                <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                  <span className="badge badge-secondary">{t(LOGO_TYPES.find((t) => t.type === selectedLogo.type)?.labelKey || 'typeOther', uiLanguage)}</span>
                  {selectedLogo.role && (
                    <span className="badge badge-outline">{t(LOGO_ROLES.find((r) => r.role === selectedLogo.role)?.labelKey || 'roleCustom', uiLanguage)}</span>
                  )}
                </div>
              </div>

              <button
                className="btn-icon"
                style={{ color: '#ef4444' }}
                title="Delete Logo"
                onClick={() => handleDeleteLogo(selectedLogo.id, selectedLogo.name)}
              >
                <Trash2 size={16} />
              </button>
            </div>

            {/* Overview / Identity Editable Section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>
              <h4 style={{ fontSize: '0.88rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                Identity Details
              </h4>

              <div className="form-group">
                <label className="form-label">{t('logoNameLabel', uiLanguage)}</label>
                <input
                  type="text"
                  className="form-control"
                  value={selectedLogo.name}
                  onChange={(e) => updateSelectedLogo((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label className="form-label">{t('logoTypeLabel', uiLanguage)}</label>
                  <select
                    className="form-control"
                    value={selectedLogo.type}
                    onChange={(e) => updateSelectedLogo((prev) => ({ ...prev, type: e.target.value as LogoType }))}
                  >
                    {LOGO_TYPES.map((lt) => (
                      <option key={lt.type} value={lt.type}>
                        {t(lt.labelKey, uiLanguage)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label">{t('logoRoleLabel', uiLanguage)}</label>
                  <select
                    className="form-control"
                    value={selectedLogo.role || 'primary'}
                    onChange={(e) => updateSelectedLogo((prev) => ({ ...prev, role: e.target.value as LogoRole }))}
                  >
                    {LOGO_ROLES.map((lr) => (
                      <option key={lr.role} value={lr.role}>
                        {t(lr.labelKey, uiLanguage)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Variants Section */}
            <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '20px', marginBottom: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div>
                  <h4 style={{ fontSize: '0.88rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                    {t('logoSystemVariantsTitle', uiLanguage)} ({selectedLogo.variants?.length || 0})
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
                    {t('logoSystemVariantsSubtitle', uiLanguage)}
                  </p>
                </div>
                <button className="btn btn-secondary btn-sm" onClick={addVariantToSelected}>
                  <Plus size={14} /> {t('addVariant', uiLanguage)}
                </button>
              </div>

              {selectedLogo.variants.length === 0 ? (
                <div style={{ padding: '16px', backgroundColor: 'var(--bg-muted)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', color: 'var(--text-subtle)' }}>
                  {t('noVariants', uiLanguage)}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {selectedLogo.variants.map((v) => {
                    const nameVal = getLocalizedText(v.name, contentLanguage).text;
                    const usageVal = getLocalizedText(v.usageNotes, contentLanguage).text;

                    return (
                      <div
                        key={v.id}
                        style={{
                          padding: '14px',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-light)',
                          backgroundColor: 'var(--bg-card)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '10px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                            <select
                              className="form-control"
                              style={{ width: '150px', fontSize: '0.82rem', padding: '4px 8px' }}
                              value={v.colorType}
                              onChange={(e) => updateVariantInSelected(v.id, 'colorType', e.target.value as VariantColorType)}
                            >
                              {COLOR_TYPES.map((ct) => (
                                <option key={ct.colorType} value={ct.colorType}>
                                  {t(ct.labelKey, uiLanguage)}
                                </option>
                              ))}
                            </select>

                            <input
                              type="text"
                              className="form-control"
                              style={{ fontSize: '0.85rem', padding: '4px 8px' }}
                              placeholder={t('variantNamePlaceholder', uiLanguage)}
                              value={nameVal}
                              onChange={(e) =>
                                updateVariantInSelected(
                                  v.id,
                                  'name',
                                  updateLocalizedString(v.name, contentLanguage, e.target.value)
                                )
                              }
                            />
                          </div>

                          <button
                            className="btn-icon"
                            style={{ color: '#ef4444', marginLeft: '8px' }}
                            title="Remove Variant"
                            onClick={() => removeVariantFromSelected(v.id)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                        {/* Optional Asset Reference field */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                          <div>
                            <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '2px' }}>
                              {t('assetReferenceLabel', uiLanguage)}
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              style={{ fontSize: '0.82rem', padding: '4px 8px' }}
                              placeholder={t('assetReferencePlaceholder', uiLanguage)}
                              value={v.assetReference || ''}
                              onChange={(e) => updateVariantInSelected(v.id, 'assetReference', e.target.value)}
                            />
                          </div>

                          <div>
                            <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '2px' }}>
                              Usage Notes
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              style={{ fontSize: '0.82rem', padding: '4px 8px' }}
                              placeholder="e.g. For light background surfaces..."
                              value={usageVal}
                              onChange={(e) =>
                                updateVariantInSelected(
                                  v.id,
                                  'usageNotes',
                                  updateLocalizedString(v.usageNotes, contentLanguage, e.target.value)
                                )
                              }
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Structure Section (Optional) */}
            <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '20px' }}>
              <h4 style={{ fontSize: '0.88rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '12px' }}>
                {t('structureTitle', uiLanguage)}
              </h4>

              <div style={{ display: 'flex', gap: '20px', marginBottom: '14px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={selectedLogo.structure?.hasSymbol || false}
                    onChange={(e) =>
                      updateSelectedLogo((prev) => ({
                        ...prev,
                        structure: { ...(prev.structure || {}), hasSymbol: e.target.checked }
                      }))
                    }
                  />
                  <span>{t('hasSymbolLabel', uiLanguage)}</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={selectedLogo.structure?.hasWordmark || false}
                    onChange={(e) =>
                      updateSelectedLogo((prev) => ({
                        ...prev,
                        structure: { ...(prev.structure || {}), hasWordmark: e.target.checked }
                      }))
                    }
                  />
                  <span>{t('hasWordmarkLabel', uiLanguage)}</span>
                </label>
              </div>

              {(selectedLogo.structure?.hasSymbol || selectedLogo.structure?.hasWordmark) && (
                <LocalizedInput
                  label={t('compositionLabel', uiLanguage)}
                  placeholder={t('compositionPlaceholder', uiLanguage)}
                  value={selectedLogo.structure?.composition}
                  contentLanguage={contentLanguage}
                  onChange={(updatedLoc) =>
                    updateSelectedLogo((prev) => ({
                      ...prev,
                      structure: {
                        ...(prev.structure || {}),
                        composition: updatedLoc
                      }
                    }))
                  }
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
