import React, { useState } from 'react';
import {
  Brand,
  BrandExpressionModule,
  TouchpointEntity,
  TouchpointCategory,
  Language,
  EntityReference,
  EntityType,
  getLocalizedText
} from '../../types/brand';
import { LocalizedInput, LocalizedTextarea } from '../ui/LocalizedInput';
import { ReferencePicker } from '../ui/ReferencePicker';
import { t } from '../../i18n/translations';
import {
  Plus,
  Trash2,
  LayoutTemplate,
  X,
  FileText,
  ShieldAlert,
  Palette
} from 'lucide-react';

interface TouchpointsEditorProps {
  data?: BrandExpressionModule;
  brand: Brand;
  uiLanguage: Language;
  contentLanguage: Language;
  onChange: (updated: BrandExpressionModule) => void;
}

const TOUCHPOINT_CATEGORIES: { category: TouchpointCategory; labelKey: string }[] = [
  { category: 'packaging', labelKey: 'touchpointCategoryPackaging' },
  { category: 'stationery', labelKey: 'touchpointCategoryStationery' },
  { category: 'digitalProduct', labelKey: 'touchpointCategoryDigitalProduct' },
  { category: 'socialMedia', labelKey: 'touchpointCategorySocialMedia' },
  { category: 'advertising', labelKey: 'touchpointCategoryAdvertising' },
  { category: 'signage', labelKey: 'touchpointCategorySignage' },
  { category: 'environmental', labelKey: 'touchpointCategoryEnvironmental' },
  { category: 'apparel', labelKey: 'touchpointCategoryApparel' },
  { category: 'presentation', labelKey: 'touchpointCategoryPresentation' },
  { category: 'vehicle', labelKey: 'touchpointCategoryVehicle' },
  { category: 'custom', labelKey: 'touchpointCategoryCustom' }
];

// Approved Semantic Targets for Touchpoint Reference Picker
const ALLOWED_ASSET_TYPES: EntityType[] = ['asset'];
const ALLOWED_RULE_TYPES: EntityType[] = ['rule'];
const ALLOWED_KNOWLEDGE_TYPES: EntityType[] = [
  'logo',
  'color',
  'font',
  'typeStyle',
  'imageryDirection',
  'imageTreatment',
  'graphicElement',
  'illustrationStyle',
  'iconSystem',
  'targetAudience'
];

export const TouchpointsEditor: React.FC<TouchpointsEditorProps> = ({
  data,
  brand,
  uiLanguage,
  contentLanguage,
  onChange
}) => {
  const current: BrandExpressionModule = data || {
    overview: { en: '', id: '' },
    touchpoints: []
  };

  const touchpoints = current.touchpoints || [];

  // Active Picker State
  const [activePicker, setActivePicker] = useState<{
    touchpointId: string;
    targetRefList: 'appliedAssetRefs' | 'appliedRuleRefs' | 'governingEntityRefs';
    allowedTypes: EntityType[];
    title: string;
  } | null>(null);

  const updateOverview = (overviewVal: any) => {
    onChange({ ...current, overview: overviewVal });
  };

  const addTouchpoint = () => {
    const newTp: TouchpointEntity = {
      id: 'tp-' + Date.now(),
      name: { en: '', id: '' },
      category: 'packaging',
      channelContext: '',
      description: { en: '', id: '' },
      specifications: {
        dimensions: '',
        aspectRatio: '',
        colorSpace: 'CMYK',
        materialsFinish: { en: '', id: '' },
        safeZonePadding: '',
        productionNotes: { en: '', id: '' }
      },
      guidelines: {
        doCopy: { en: '', id: '' },
        dontCopy: { en: '', id: '' }
      },
      appliedAssetRefs: [],
      appliedRuleRefs: [],
      governingEntityRefs: []
    };
    onChange({ ...current, touchpoints: [...touchpoints, newTp] });
  };

  const updateTouchpoint = (id: string, key: keyof TouchpointEntity, val: any) => {
    const updated = touchpoints.map((tp) => {
      if (tp.id !== id) return tp;
      return { ...tp, [key]: val };
    });
    onChange({ ...current, touchpoints: updated });
  };

  const updateTouchpointSpec = (id: string, key: keyof NonNullable<TouchpointEntity['specifications']>, val: any) => {
    const updated = touchpoints.map((tp) => {
      if (tp.id !== id) return tp;
      const specs = tp.specifications || {};
      return {
        ...tp,
        specifications: {
          ...specs,
          [key]: val
        }
      };
    });
    onChange({ ...current, touchpoints: updated });
  };

  const updateTouchpointGuidelines = (id: string, key: 'doCopy' | 'dontCopy', val: any) => {
    const updated = touchpoints.map((tp) => {
      if (tp.id !== id) return tp;
      const guidelines = tp.guidelines || {};
      return {
        ...tp,
        guidelines: {
          ...guidelines,
          [key]: val
        }
      };
    });
    onChange({ ...current, touchpoints: updated });
  };

  const removeTouchpoint = (id: string) => {
    onChange({ ...current, touchpoints: touchpoints.filter((tp) => tp.id !== id) });
  };

  // Reference Attachment Handlers
  const handleAddReference = (ref: EntityReference) => {
    if (!activePicker) return;
    const { touchpointId, targetRefList } = activePicker;

    const targetTp = touchpoints.find((tp) => tp.id === touchpointId);
    if (!targetTp) return;

    const existingRefs: EntityReference[] = (targetTp as any)[targetRefList] || [];
    if (!existingRefs.some((r) => r.entityId === ref.entityId && r.entityType === ref.entityType)) {
      updateTouchpoint(touchpointId, targetRefList, [...existingRefs, ref]);
    }
    setActivePicker(null);
  };

  const handleRemoveReference = (
    touchpointId: string,
    targetRefList: 'appliedAssetRefs' | 'appliedRuleRefs' | 'governingEntityRefs',
    entityId: string
  ) => {
    const targetTp = touchpoints.find((tp) => tp.id === touchpointId);
    if (!targetTp) return;
    const existingRefs: EntityReference[] = (targetTp as any)[targetRefList] || [];
    updateTouchpoint(
      touchpointId,
      targetRefList,
      existingRefs.filter((r) => r.entityId !== entityId)
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. Header & Overview */}
      <div className="editor-card">
        <div className="editor-header">
          <div>
            <h2 className="editor-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <LayoutTemplate size={20} color="var(--accent-primary)" />
              {t('brandExpressionTitle', uiLanguage)}
            </h2>
            <p className="editor-subtitle">{t('brandExpressionSubtitle', uiLanguage)}</p>
          </div>
          <button className="btn-action-primary" onClick={addTouchpoint}>
            <Plus size={16} /> {t('addTouchpoint', uiLanguage)}
          </button>
        </div>

        <LocalizedTextarea
          label={t('expressionOverviewLabel', uiLanguage)}
          hint={t('expressionOverviewHint', uiLanguage)}
          placeholder={t('expressionOverviewPlaceholder', uiLanguage)}
          rows={2}
          value={current.overview}
          contentLanguage={contentLanguage}
          onChange={updateOverview}
        />
      </div>

      {/* 2. Touchpoints List */}
      {touchpoints.length === 0 ? (
        <div
          style={{
            padding: '32px',
            textAlign: 'center',
            color: '#64748b',
            backgroundColor: '#f8fafc',
            borderRadius: 'var(--radius-md)',
            border: '1px dashed var(--border-light)'
          }}
        >
          {t('noTouchpointsEmpty', uiLanguage)}
        </div>
      ) : (
        touchpoints.map((tp) => {
          const nameRes = getLocalizedText(tp.name, contentLanguage);
          return (
            <div key={tp.id} className="editor-card" style={{ borderLeft: '4px solid var(--accent-primary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {nameRes.text || t('touchpointUntitled', uiLanguage)}
                  </h3>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '6px', alignItems: 'center' }}>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        backgroundColor: 'var(--accent-light)',
                        color: 'var(--accent-primary)',
                        padding: '2px 8px',
                        borderRadius: '4px'
                      }}
                    >
                      {t(`touchpointCategory${tp.category.charAt(0).toUpperCase() + tp.category.slice(1)}`, uiLanguage) || tp.category}
                    </span>
                    {tp.channelContext && (
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        • {tp.channelContext}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  className="btn-icon"
                  style={{ color: 'var(--danger)' }}
                  onClick={() => removeTouchpoint(tp.id)}
                  title={t('removeTouchpoint', uiLanguage)}
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Basic Fields */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '14px' }}>
                <LocalizedInput
                  label={t('touchpointName', uiLanguage)}
                  placeholder={t('touchpointNamePlaceholder', uiLanguage)}
                  value={tp.name}
                  contentLanguage={contentLanguage}
                  onChange={(val) => updateTouchpoint(tp.id, 'name', val)}
                />

                <div className="form-group">
                  <label className="form-label">{t('touchpointCategory', uiLanguage)}</label>
                  <select
                    className="form-control"
                    value={tp.category}
                    onChange={(e) => updateTouchpoint(tp.id, 'category', e.target.value as TouchpointCategory)}
                  >
                    {TOUCHPOINT_CATEGORIES.map((cat) => (
                      <option key={cat.category} value={cat.category}>
                        {t(cat.labelKey, uiLanguage)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">{t('channelContextLabel', uiLanguage)}</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder={t('channelContextPlaceholder', uiLanguage)}
                    value={tp.channelContext || ''}
                    onChange={(e) => updateTouchpoint(tp.id, 'channelContext', e.target.value)}
                  />
                </div>
              </div>

              <LocalizedTextarea
                label={t('touchpointDescription', uiLanguage)}
                placeholder={t('touchpointDescriptionPlaceholder', uiLanguage)}
                rows={2}
                value={tp.description}
                contentLanguage={contentLanguage}
                onChange={(val) => updateTouchpoint(tp.id, 'description', val)}
              />

              {/* 3. Physical / Digital Specifications */}
              <div
                style={{
                  marginTop: '16px',
                  padding: '16px',
                  backgroundColor: '#f8fafc',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-light)'
                }}
              >
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: '#475569', marginBottom: '12px' }}>
                  {t('touchpointSpecsTitle', uiLanguage)}
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '12px' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '0.78rem' }}>{t('dimensionsLabel', uiLanguage)}</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. 90 × 50 mm, 12oz Bag"
                      value={tp.specifications?.dimensions || ''}
                      onChange={(e) => updateTouchpointSpec(tp.id, 'dimensions', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '0.78rem' }}>{t('aspectRatioLabel', uiLanguage)}</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. 1:1, 16:9, 9:16"
                      value={tp.specifications?.aspectRatio || ''}
                      onChange={(e) => updateTouchpointSpec(tp.id, 'aspectRatio', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '0.78rem' }}>{t('colorSpaceLabel', uiLanguage)}</label>
                    <select
                      className="form-control"
                      value={tp.specifications?.colorSpace || 'CMYK'}
                      onChange={(e) => updateTouchpointSpec(tp.id, 'colorSpace', e.target.value)}
                    >
                      <option value="CMYK">CMYK (Print)</option>
                      <option value="RGB">RGB / sRGB (Digital)</option>
                      <option value="PMS">Pantone / PMS Spot</option>
                      <option value="Monochrome">Monochrome / 1-Color</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '0.78rem' }}>{t('safeZonePaddingLabel', uiLanguage)}</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. 5mm bleed, 10mm margin"
                      value={tp.specifications?.safeZonePadding || ''}
                      onChange={(e) => updateTouchpointSpec(tp.id, 'safeZonePadding', e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
                  <LocalizedInput
                    label={t('materialsFinishLabel', uiLanguage)}
                    placeholder="e.g. 350gsm Uncoated Cotton Paper with Foil Stamping"
                    value={tp.specifications?.materialsFinish}
                    contentLanguage={contentLanguage}
                    onChange={(val) => updateTouchpointSpec(tp.id, 'materialsFinish', val)}
                  />

                  <LocalizedInput
                    label={t('productionNotesLabel', uiLanguage)}
                    placeholder="e.g. Vector path stroke >= 0.5pt for blind debossing"
                    value={tp.specifications?.productionNotes}
                    contentLanguage={contentLanguage}
                    onChange={(val) => updateTouchpointSpec(tp.id, 'productionNotes', val)}
                  />
                </div>
              </div>

              {/* 4. Actionable Do / Don't Guidelines */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginTop: '16px' }}>
                <LocalizedTextarea
                  label={t('touchpointDoGuidance', uiLanguage)}
                  placeholder={t('touchpointDoPlaceholder', uiLanguage)}
                  rows={2}
                  value={tp.guidelines?.doCopy}
                  contentLanguage={contentLanguage}
                  onChange={(val) => updateTouchpointGuidelines(tp.id, 'doCopy', val)}
                />

                <LocalizedTextarea
                  label={t('touchpointDontGuidance', uiLanguage)}
                  placeholder={t('touchpointDontPlaceholder', uiLanguage)}
                  rows={2}
                  value={tp.guidelines?.dontCopy}
                  contentLanguage={contentLanguage}
                  onChange={(val) => updateTouchpointGuidelines(tp.id, 'dontCopy', val)}
                />
              </div>

              {/* 5. Semantic Reference Attachments */}
              <div style={{ marginTop: '18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {/* Applied Visual Assets (Dielines, Templates, Mockups) */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 600, color: '#334155' }}>
                    <FileText size={15} color="var(--accent-primary)" />
                    {t('appliedAssetsLabel', uiLanguage)} ({tp.appliedAssetRefs?.length || 0})
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.74rem', padding: '3px 8px' }}
                    onClick={() =>
                      setActivePicker({
                        touchpointId: tp.id,
                        targetRefList: 'appliedAssetRefs',
                        allowedTypes: ALLOWED_ASSET_TYPES,
                        title: t('attachAssetDieline', uiLanguage)
                      })
                    }
                  >
                    <Plus size={13} /> {t('attachAsset', uiLanguage)}
                  </button>
                </div>
                {tp.appliedAssetRefs && tp.appliedAssetRefs.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {tp.appliedAssetRefs.map((ref) => (
                      <span
                        key={ref.entityId}
                        style={{
                          fontSize: '0.74rem',
                          backgroundColor: '#f1f5f9',
                          color: '#334155',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        📄 {ref.label || ref.entityId}
                        <X
                          size={13}
                          style={{ cursor: 'pointer', color: '#64748b' }}
                          onClick={() => handleRemoveReference(tp.id, 'appliedAssetRefs', ref.entityId)}
                        />
                      </span>
                    ))}
                  </div>
                )}

                {/* Applied Visual Rules */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 600, color: '#334155' }}>
                    <ShieldAlert size={15} color="#d97706" />
                    {t('appliedRulesLabel', uiLanguage)} ({tp.appliedRuleRefs?.length || 0})
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.74rem', padding: '3px 8px' }}
                    onClick={() =>
                      setActivePicker({
                        touchpointId: tp.id,
                        targetRefList: 'appliedRuleRefs',
                        allowedTypes: ALLOWED_RULE_TYPES,
                        title: t('attachGoverningRule', uiLanguage)
                      })
                    }
                  >
                    <Plus size={13} /> {t('attachRule', uiLanguage)}
                  </button>
                </div>
                {tp.appliedRuleRefs && tp.appliedRuleRefs.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {tp.appliedRuleRefs.map((ref) => (
                      <span
                        key={ref.entityId}
                        style={{
                          fontSize: '0.74rem',
                          backgroundColor: '#fef3c7',
                          color: '#92400e',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        🛡️ {ref.label || ref.entityId}
                        <X
                          size={13}
                          style={{ cursor: 'pointer', color: '#92400e' }}
                          onClick={() => handleRemoveReference(tp.id, 'appliedRuleRefs', ref.entityId)}
                        />
                      </span>
                    ))}
                  </div>
                )}

                {/* Governing Brand Knowledge Entities (Logos, Colors, Fonts, Graphics) */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 600, color: '#334155' }}>
                    <Palette size={15} color="#2563eb" />
                    {t('governingEntitiesLabel', uiLanguage)} ({tp.governingEntityRefs?.length || 0})
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.74rem', padding: '3px 8px' }}
                    onClick={() =>
                      setActivePicker({
                        touchpointId: tp.id,
                        targetRefList: 'governingEntityRefs',
                        allowedTypes: ALLOWED_KNOWLEDGE_TYPES,
                        title: t('attachBrandKnowledgeEntity', uiLanguage)
                      })
                    }
                  >
                    <Plus size={13} /> {t('attachKnowledge', uiLanguage)}
                  </button>
                </div>
                {tp.governingEntityRefs && tp.governingEntityRefs.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {tp.governingEntityRefs.map((ref) => (
                      <span
                        key={ref.entityId}
                        style={{
                          fontSize: '0.74rem',
                          backgroundColor: '#eff6ff',
                          color: '#1d4ed8',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        🏷️ {ref.label || ref.entityId} ({ref.entityType})
                        <X
                          size={13}
                          style={{ cursor: 'pointer', color: '#1d4ed8' }}
                          onClick={() => handleRemoveReference(tp.id, 'governingEntityRefs', ref.entityId)}
                        />
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })
      )}

      {/* Semantic ReferencePicker Modal */}
      {activePicker && (
        <ReferencePicker
          brand={brand}
          uiLanguage={uiLanguage}
          allowedEntityTypes={activePicker.allowedTypes}
          onSelect={handleAddReference}
          onClose={() => setActivePicker(null)}
          title={activePicker.title}
        />
      )}
    </div>
  );
};
