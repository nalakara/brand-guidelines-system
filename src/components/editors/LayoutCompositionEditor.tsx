import React from 'react';
import {
  VisualBasicsModule,
  Language,
  LayoutCompositionData,
  GridSystemEntity,
  LayoutPrincipleEntity,
  SpacingScaleData
} from '../../types/brand';
import { LocalizedInput, LocalizedTextarea } from '../ui/LocalizedInput';
import { t } from '../../i18n/translations';
import {
  Plus,
  Trash2,
  LayoutGrid,
  Maximize2,
  Layers
} from 'lucide-react';

interface LayoutCompositionEditorProps {
  data?: VisualBasicsModule;
  uiLanguage: Language;
  contentLanguage: Language;
  onChange: (updated: VisualBasicsModule) => void;
}

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
  const gridSystems: GridSystemEntity[] = layoutData.gridSystems || [];
  const layoutPrinciples: LayoutPrincipleEntity[] = layoutData.layoutPrinciples || [];
  const spacingScale: SpacingScaleData = layoutData.spacingScale || {
    baseUnitPx: layoutData.spacing?.baseUnitPx || 8,
    description: layoutData.spacing?.description
  };

  const updateLayout = (partial: Partial<LayoutCompositionData>) => {
    onChange({
      ...current,
      layoutComposition: {
        ...layoutData,
        ...partial
      }
    });
  };

  // --- Grid Systems Handlers ---
  const addGridSystem = () => {
    const newGrid: GridSystemEntity = {
      id: 'grid-' + Date.now(),
      name: { en: '', id: '' },
      type: 'column',
      columns: 12,
      gutterPx: 24,
      marginPx: 64,
      contextChannel: 'General Layout',
      description: { en: '', id: '' }
    };
    updateLayout({ gridSystems: [...gridSystems, newGrid] });
  };

  const updateGridSystem = (id: string, key: keyof GridSystemEntity, val: any) => {
    const updated = gridSystems.map((g) => {
      if (g.id !== id) return g;
      return { ...g, [key]: val };
    });
    updateLayout({ gridSystems: updated });
  };

  const removeGridSystem = (id: string) => {
    updateLayout({ gridSystems: gridSystems.filter((g) => g.id !== id) });
  };

  // --- Layout Principles Handlers ---
  const addPrinciple = () => {
    const newP: LayoutPrincipleEntity = {
      id: 'lp-' + Date.now(),
      title: { en: '', id: '' },
      category: 'composition',
      description: { en: '', id: '' },
      guidance: { en: '', id: '' }
    };
    updateLayout({ layoutPrinciples: [...layoutPrinciples, newP] });
  };

  const updatePrinciple = (id: string, key: keyof LayoutPrincipleEntity, val: any) => {
    const updated = layoutPrinciples.map((p) => {
      if (p.id !== id) return p;
      return { ...p, [key]: val };
    });
    updateLayout({ layoutPrinciples: updated });
  };

  const removePrinciple = (id: string) => {
    updateLayout({ layoutPrinciples: layoutPrinciples.filter((p) => p.id !== id) });
  };

  // --- Spacing Scale Handler ---
  const updateSpacing = (key: keyof SpacingScaleData, val: any) => {
    updateLayout({
      spacingScale: {
        ...spacingScale,
        [key]: val
      }
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. Grid Systems (Entities) */}
      <div className="editor-card">
        <div className="editor-header">
          <div>
            <h2 className="editor-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <LayoutGrid size={20} color="var(--accent-primary)" />
              {t('gridSystemsTitle', uiLanguage)}
            </h2>
            <p className="editor-subtitle">{t('gridSystemsSubtitle', uiLanguage)}</p>
          </div>
          <button className="btn-action-primary" onClick={addGridSystem}>
            <Plus size={16} /> {t('addGridSystem', uiLanguage)}
          </button>
        </div>

        {gridSystems.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: '#64748b', backgroundColor: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-light)' }}>
            {t('noGridSystemsEmpty', uiLanguage)}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {gridSystems.map((grid) => (
              <div
                key={grid.id}
                style={{
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  backgroundColor: '#ffffff'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                  <div style={{ flex: 1, marginRight: '16px' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>
                      {t('gridSystemName', uiLanguage)}
                    </label>
                    <LocalizedInput
                      value={grid.name}
                      contentLanguage={contentLanguage}
                      placeholder={t('gridSystemNamePlaceholder', uiLanguage)}
                      onChange={(val) => updateGridSystem(grid.id, 'name', val)}
                    />
                  </div>
                  <button
                    onClick={() => removeGridSystem(grid.id)}
                    style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '6px', marginTop: '18px' }}
                    title={t('removeGridSystem', uiLanguage)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', marginBottom: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>
                      {t('gridType', uiLanguage)}
                    </label>
                    <select
                      value={grid.type || 'column'}
                      onChange={(e) => updateGridSystem(grid.id, 'type', e.target.value)}
                      style={{ width: '100%', padding: '7px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', fontSize: '0.85rem' }}
                    >
                      <option value="column">Column</option>
                      <option value="modular">Modular</option>
                      <option value="baseline">Baseline</option>
                      <option value="freeform">Freeform</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>
                      {t('columnsCount', uiLanguage)}
                    </label>
                    <input
                      type="number"
                      value={grid.columns ?? ''}
                      onChange={(e) => updateGridSystem(grid.id, 'columns', e.target.value ? parseInt(e.target.value, 10) : undefined)}
                      placeholder="12"
                      style={{ width: '100%', padding: '7px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', fontSize: '0.85rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>
                      {t('gutterWidth', uiLanguage)} (px)
                    </label>
                    <input
                      type="number"
                      value={grid.gutterPx ?? ''}
                      onChange={(e) => updateGridSystem(grid.id, 'gutterPx', e.target.value ? parseInt(e.target.value, 10) : undefined)}
                      placeholder="24"
                      style={{ width: '100%', padding: '7px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', fontSize: '0.85rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>
                      {t('marginWidth', uiLanguage)} (px)
                    </label>
                    <input
                      type="number"
                      value={grid.marginPx ?? ''}
                      onChange={(e) => updateGridSystem(grid.id, 'marginPx', e.target.value ? parseInt(e.target.value, 10) : undefined)}
                      placeholder="64"
                      style={{ width: '100%', padding: '7px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', fontSize: '0.85rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>
                      {t('contextChannel', uiLanguage)}
                    </label>
                    <input
                      type="text"
                      value={grid.contextChannel || ''}
                      onChange={(e) => updateGridSystem(grid.id, 'contextChannel', e.target.value)}
                      placeholder="e.g. Desktop Web"
                      style={{ width: '100%', padding: '7px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>
                    {t('gridDescription', uiLanguage)}
                  </label>
                  <LocalizedTextarea
                    value={grid.description}
                    contentLanguage={contentLanguage}
                    rows={2}
                    placeholder={t('gridDescriptionPlaceholder', uiLanguage)}
                    onChange={(val) => updateGridSystem(grid.id, 'description', val)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. Spacing Scale (Structured System Configuration) */}
      <div className="editor-card">
        <div className="editor-header">
          <div>
            <h2 className="editor-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Maximize2 size={20} color="var(--accent-primary)" />
              {t('spacingScaleTitle', uiLanguage)}
            </h2>
            <p className="editor-subtitle">{t('spacingScaleSubtitle', uiLanguage)}</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: '20px', alignItems: 'start' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>
              {t('baseSpacingUnit', uiLanguage)} (px)
            </label>
            <input
              type="number"
              value={spacingScale.baseUnitPx ?? ''}
              onChange={(e) => updateSpacing('baseUnitPx', e.target.value ? parseInt(e.target.value, 10) : undefined)}
              placeholder="8"
              style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', fontSize: '1rem', fontWeight: 600 }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>
              {t('spacingScaleNotes', uiLanguage)}
            </label>
            <LocalizedTextarea
              value={spacingScale.description}
              contentLanguage={contentLanguage}
              rows={2}
              placeholder={t('spacingScaleNotesPlaceholder', uiLanguage)}
              onChange={(val) => updateSpacing('description', val)}
            />
          </div>
        </div>
      </div>

      {/* 3. Layout Principles (Entities) */}
      <div className="editor-card">
        <div className="editor-header">
          <div>
            <h2 className="editor-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={20} color="var(--accent-primary)" />
              {t('layoutPrinciplesTitle', uiLanguage)}
            </h2>
            <p className="editor-subtitle">{t('layoutPrinciplesSubtitle', uiLanguage)}</p>
          </div>
          <button className="btn-action-primary" onClick={addPrinciple}>
            <Plus size={16} /> {t('addLayoutPrinciple', uiLanguage)}
          </button>
        </div>

        {layoutPrinciples.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: '#64748b', backgroundColor: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-light)' }}>
            {t('noLayoutPrinciplesEmpty', uiLanguage)}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {layoutPrinciples.map((lp) => (
              <div
                key={lp.id}
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
                      {t('principleTitle', uiLanguage)}
                    </label>
                    <LocalizedInput
                      value={lp.title}
                      contentLanguage={contentLanguage}
                      placeholder={t('principleTitlePlaceholder', uiLanguage)}
                      onChange={(val) => updatePrinciple(lp.id, 'title', val)}
                    />
                  </div>
                  <div style={{ width: '160px', marginRight: '12px' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>
                      {t('categoryLabel', uiLanguage)}
                    </label>
                    <select
                      value={lp.category || 'composition'}
                      onChange={(e) => updatePrinciple(lp.id, 'category', e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', fontSize: '0.85rem' }}
                    >
                      <option value="composition">Composition</option>
                      <option value="alignment">Alignment</option>
                      <option value="proportion">Proportion</option>
                      <option value="hierarchy">Hierarchy</option>
                    </select>
                  </div>
                  <button
                    onClick={() => removePrinciple(lp.id)}
                    style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '6px', marginTop: '18px' }}
                    title={t('removePrinciple', uiLanguage)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>
                      {t('principleDescription', uiLanguage)}
                    </label>
                    <LocalizedTextarea
                      value={lp.description}
                      contentLanguage={contentLanguage}
                      rows={2}
                      placeholder={t('principleDescriptionPlaceholder', uiLanguage)}
                      onChange={(val) => updatePrinciple(lp.id, 'description', val)}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>
                      {t('actionableGuidance', uiLanguage)}
                    </label>
                    <LocalizedTextarea
                      value={lp.guidance}
                      contentLanguage={contentLanguage}
                      rows={2}
                      placeholder={t('actionableGuidancePlaceholder', uiLanguage)}
                      onChange={(val) => updatePrinciple(lp.id, 'guidance', val)}
                    />
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
