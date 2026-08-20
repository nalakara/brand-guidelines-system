import React, { useState } from 'react';
import {
  Brand,
  BrandNamingModule,
  NamingSystemEntity,
  NamingApproach,
  NamingTier,
  NamingFormulaStep,
  Language,
  EntityReference,
  getLocalizedText,
  updateLocalizedString
} from '../../types/brand';
import { resolveEntityLabel } from '../../utils/entityResolver';
import { ReferencePicker } from '../ui/ReferencePicker';
import { t } from '../../i18n/translations';
import {
  Plus,
  Trash2,
  Tag,
  X,
  ShieldAlert,
  Users,
  Megaphone
} from 'lucide-react';

interface NamingEditorProps {
  data?: BrandNamingModule;
  brand: Brand;
  uiLanguage: Language;
  contentLanguage: Language;
  onChange: (updatedData: BrandNamingModule) => void;
}

export const NamingEditor: React.FC<NamingEditorProps> = ({
  data,
  brand,
  uiLanguage,
  contentLanguage,
  onChange
}) => {
  const currentData: BrandNamingModule = data || {
    principlesOverview: { en: '', id: '' },
    systems: []
  };

  const [activePicker, setActivePicker] = useState<{
    systemId: string;
    targetField: 'governingRules' | 'targetAudiences' | 'supportingMessages';
  } | null>(null);

  // Overview change
  const handleOverviewChange = (val: string) => {
    onChange({
      ...currentData,
      principlesOverview: updateLocalizedString(currentData.principlesOverview, contentLanguage, val)
    });
  };

  // Add system
  const handleAddSystem = () => {
    const newSystem: NamingSystemEntity = {
      id: `name-sys-${Date.now()}`,
      title: {
        en: 'New Naming System',
        id: 'Sistem Penamaan Baru'
      },
      tier: 'productTier',
      approach: 'descriptive',
      formula: [
        {
          role: 'brandPrefix',
          label: { en: 'Brand Prefix', id: 'Awalan Merek' },
          required: true
        },
        {
          role: 'descriptor',
          label: { en: 'Descriptor / Flavor', id: 'Deskriptor / Rasa' },
          required: true
        }
      ],
      principles: { en: '', id: '' },
      examples: {
        approved: [],
        prohibited: [],
        rationale: { en: '', id: '' }
      },
      governingRuleRefs: [],
      targetAudienceRefs: [],
      supportingMessageRefs: []
    };

    onChange({
      ...currentData,
      systems: [...currentData.systems, newSystem]
    });
  };

  // Update system
  const handleUpdateSystem = (id: string, patch: Partial<NamingSystemEntity>) => {
    const updated = currentData.systems.map((sys) => {
      if (sys.id !== id) return sys;
      return { ...sys, ...patch };
    });
    onChange({ ...currentData, systems: updated });
  };

  // Remove system
  const handleRemoveSystem = (id: string) => {
    onChange({
      ...currentData,
      systems: currentData.systems.filter((sys) => sys.id !== id)
    });
  };

  // Formula step management
  const handleAddFormulaStep = (systemId: string) => {
    const sys = currentData.systems.find((s) => s.id === systemId);
    if (!sys) return;
    const newStep: NamingFormulaStep = {
      role: 'modifier',
      label: { en: 'Modifier', id: 'Pengubah' },
      required: false
    };
    handleUpdateSystem(systemId, { formula: [...sys.formula, newStep] });
  };

  const handleUpdateFormulaStep = (
    systemId: string,
    stepIndex: number,
    patch: Partial<NamingFormulaStep>
  ) => {
    const sys = currentData.systems.find((s) => s.id === systemId);
    if (!sys) return;
    const newFormula = [...sys.formula];
    newFormula[stepIndex] = { ...newFormula[stepIndex], ...patch };
    handleUpdateSystem(systemId, { formula: newFormula });
  };

  const handleRemoveFormulaStep = (systemId: string, stepIndex: number) => {
    const sys = currentData.systems.find((s) => s.id === systemId);
    if (!sys) return;
    handleUpdateSystem(systemId, {
      formula: sys.formula.filter((_, idx) => idx !== stepIndex)
    });
  };

  // References attachment
  const handleAttachReference = (ref: EntityReference) => {
    if (!activePicker) return;
    const { systemId, targetField } = activePicker;
    const sys = currentData.systems.find((s) => s.id === systemId);
    if (!sys) return;

    if (targetField === 'governingRules') {
      const current = sys.governingRuleRefs || [];
      if (!current.some((r) => r.entityId === ref.entityId)) {
        handleUpdateSystem(systemId, { governingRuleRefs: [...current, ref] });
      }
    } else if (targetField === 'targetAudiences') {
      const current = sys.targetAudienceRefs || [];
      if (!current.some((r) => r.entityId === ref.entityId)) {
        handleUpdateSystem(systemId, { targetAudienceRefs: [...current, ref] });
      }
    } else if (targetField === 'supportingMessages') {
      const current = sys.supportingMessageRefs || [];
      if (!current.some((r) => r.entityId === ref.entityId)) {
        handleUpdateSystem(systemId, { supportingMessageRefs: [...current, ref] });
      }
    }

    setActivePicker(null);
  };

  const handleRemoveReference = (
    systemId: string,
    targetField: 'governingRules' | 'targetAudiences' | 'supportingMessages',
    entityId: string
  ) => {
    const sys = currentData.systems.find((s) => s.id === systemId);
    if (!sys) return;

    if (targetField === 'governingRules') {
      handleUpdateSystem(systemId, {
        governingRuleRefs: (sys.governingRuleRefs || []).filter((r) => r.entityId !== entityId)
      });
    } else if (targetField === 'targetAudiences') {
      handleUpdateSystem(systemId, {
        targetAudienceRefs: (sys.targetAudienceRefs || []).filter((r) => r.entityId !== entityId)
      });
    } else if (targetField === 'supportingMessages') {
      handleUpdateSystem(systemId, {
        supportingMessageRefs: (sys.supportingMessageRefs || []).filter((r) => r.entityId !== entityId)
      });
    }
  };

  return (
    <div className="editor-container">
      {/* Header */}
      <div className="editor-header">
        <div>
          <h2 className="editor-title">{t('brandNamingTitle', uiLanguage)}</h2>
          <p className="editor-subtitle">{t('brandNamingSubtitle', uiLanguage)}</p>
        </div>
        <button className="btn btn-primary" onClick={handleAddSystem}>
          <Plus size={16} />
          {t('addNamingSystem', uiLanguage)}
        </button>
      </div>

      {/* Overview */}
      <div className="editor-card" style={{ marginBottom: '24px' }}>
        <label className="form-label" style={{ fontWeight: 600 }}>
          {t('namingOverviewLabel', uiLanguage)}
        </label>
        <p className="form-hint" style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
          {t('namingOverviewHint', uiLanguage)}
        </p>
        <textarea
          className="form-textarea"
          rows={3}
          value={getLocalizedText(currentData.principlesOverview, contentLanguage).text}
          onChange={(e) => handleOverviewChange(e.target.value)}
          placeholder={t('namingOverviewPlaceholder', uiLanguage)}
        />
      </div>

      {/* Systems List */}
      <div className="systems-list" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {currentData.systems.length === 0 ? (
          <div className="empty-state-card" style={{ padding: '40px 20px', textAlign: 'center', background: 'var(--color-bg-secondary)', borderRadius: '10px', border: '1px dashed var(--color-border)' }}>
            <Tag size={32} style={{ color: 'var(--color-text-secondary)', opacity: 0.5, marginBottom: '12px' }} />
            <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
              {t('noNamingSystemsEmpty', uiLanguage)}
            </p>
          </div>
        ) : (
          currentData.systems.map((sys) => {
            const titleVal = getLocalizedText(sys.title, contentLanguage).text;
            const principlesVal = getLocalizedText(sys.principles, contentLanguage).text;
            const rationaleVal = getLocalizedText(sys.examples?.rationale, contentLanguage).text;

            return (
              <div key={sys.id} className="editor-card system-card" style={{ border: '1px solid var(--color-border)', borderRadius: '10px', padding: '20px' }}>
                {/* System Title & Top Controls */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', gap: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <label className="form-label" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {t('namingSystemTitleLabel', uiLanguage)}
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      style={{ fontSize: '16px', fontWeight: 600 }}
                      value={titleVal}
                      onChange={(e) =>
                        handleUpdateSystem(sys.id, {
                          title: updateLocalizedString(sys.title, contentLanguage, e.target.value)
                        })
                      }
                      placeholder={t('namingSystemTitlePlaceholder', uiLanguage)}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
                    <div>
                      <label className="form-label" style={{ fontSize: '11px' }}>{t('namingTierLabel', uiLanguage)}</label>
                      <select
                        className="form-select"
                        style={{ padding: '6px 10px', fontSize: '13px' }}
                        value={sys.tier}
                        onChange={(e) => handleUpdateSystem(sys.id, { tier: e.target.value as NamingTier })}
                      >
                        <option value="flagship">{t('tierFlagship', uiLanguage)}</option>
                        <option value="productTier">{t('tierProductTier', uiLanguage)}</option>
                        <option value="feature">{t('tierFeature', uiLanguage)}</option>
                        <option value="internalCode">{t('tierInternalCode', uiLanguage)}</option>
                      </select>
                    </div>
                    <div>
                      <label className="form-label" style={{ fontSize: '11px' }}>{t('namingApproachLabel', uiLanguage)}</label>
                      <select
                        className="form-select"
                        style={{ padding: '6px 10px', fontSize: '13px' }}
                        value={sys.approach}
                        onChange={(e) => handleUpdateSystem(sys.id, { approach: e.target.value as NamingApproach })}
                      >
                        <option value="descriptive">{t('approachDescriptive', uiLanguage)}</option>
                        <option value="invented">{t('approachInvented', uiLanguage)}</option>
                        <option value="metaphorical">{t('approachMetaphorical', uiLanguage)}</option>
                        <option value="acronym">{t('approachAcronym', uiLanguage)}</option>
                        <option value="arbitrary">{t('approachArbitrary', uiLanguage)}</option>
                      </select>
                    </div>
                    <button
                      className="btn btn-ghost"
                      style={{ color: 'var(--color-danger)', padding: '6px' }}
                      title={t('removeNamingSystem', uiLanguage)}
                      onClick={() => handleRemoveSystem(sys.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Formula / Grammar Builder */}
                <div style={{ background: 'var(--color-bg-tertiary)', borderRadius: '8px', padding: '14px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Tag size={15} style={{ color: 'var(--color-primary)' }} />
                      <span style={{ fontWeight: 600, fontSize: '13px' }}>{t('namingFormulaTitle', uiLanguage)}</span>
                    </div>
                    <button
                      className="btn btn-ghost"
                      style={{ fontSize: '12px', padding: '3px 8px' }}
                      onClick={() => handleAddFormulaStep(sys.id)}
                    >
                      <Plus size={13} /> {t('addFormulaStep', uiLanguage)}
                    </button>
                  </div>

                  {/* Formula Pills Flow */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', marginBottom: '12px' }}>
                    {sys.formula.map((step, sIdx) => {
                      const stepLabel = getLocalizedText(step.label, contentLanguage).text;
                      return (
                        <React.Fragment key={sIdx}>
                          {sIdx > 0 && <span style={{ color: 'var(--color-text-secondary)', fontWeight: 600, fontSize: '14px' }}>+</span>}
                          <div
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              background: 'var(--color-bg-primary)',
                              border: '1px solid var(--color-border)',
                              borderRadius: '6px',
                              padding: '4px 8px',
                              fontSize: '13px'
                            }}
                          >
                            <span style={{ fontWeight: step.required ? 600 : 400, color: step.required ? 'var(--color-text-primary)' : 'var(--color-text-secondary)' }}>
                              {stepLabel || `[Step ${sIdx + 1}]`}
                            </span>
                            {!step.required && (
                              <span style={{ fontSize: '10px', background: 'var(--color-bg-secondary)', padding: '1px 4px', borderRadius: '3px', color: 'var(--color-text-secondary)' }}>
                                {t('optionalTag', uiLanguage)}
                              </span>
                            )}
                            <button
                              className="btn btn-ghost"
                              style={{ padding: '0 2px', height: 'auto', color: 'var(--color-text-secondary)' }}
                              onClick={() => handleRemoveFormulaStep(sys.id, sIdx)}
                            >
                              <X size={12} />
                            </button>
                          </div>
                        </React.Fragment>
                      );
                    })}
                  </div>

                  {/* Step detail editors */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {sys.formula.map((step, sIdx) => {
                      const stepLabel = getLocalizedText(step.label, contentLanguage).text;
                      return (
                        <div
                          key={sIdx}
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '120px 1fr 100px 30px',
                            gap: '8px',
                            alignItems: 'center',
                            background: 'var(--color-bg-primary)',
                            padding: '6px 10px',
                            borderRadius: '6px',
                            fontSize: '12px'
                          }}
                        >
                          <select
                            className="form-select"
                            style={{ padding: '4px 6px', fontSize: '12px' }}
                            value={step.role}
                            onChange={(e) =>
                              handleUpdateFormulaStep(sys.id, sIdx, {
                                role: e.target.value as NamingFormulaStep['role']
                              })
                            }
                          >
                            <option value="brandPrefix">{t('roleBrandPrefix', uiLanguage)}</option>
                            <option value="descriptor">{t('roleDescriptor', uiLanguage)}</option>
                            <option value="tierSuffix">{t('roleTierSuffix', uiLanguage)}</option>
                            <option value="modifier">{t('roleModifier', uiLanguage)}</option>
                            <option value="arbitrary">{t('roleArbitrary', uiLanguage)}</option>
                          </select>
                          <input
                            type="text"
                            className="form-input"
                            style={{ padding: '4px 8px', fontSize: '12px' }}
                            placeholder={t('formulaStepLabelPlaceholder', uiLanguage)}
                            value={stepLabel}
                            onChange={(e) =>
                              handleUpdateFormulaStep(sys.id, sIdx, {
                                label: updateLocalizedString(step.label, contentLanguage, e.target.value)
                              })
                            }
                          />
                          <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', margin: 0 }}>
                            <input
                              type="checkbox"
                              checked={step.required}
                              onChange={(e) =>
                                handleUpdateFormulaStep(sys.id, sIdx, { required: e.target.checked })
                              }
                            />
                            <span>{t('requiredCheckbox', uiLanguage)}</span>
                          </label>
                          <button
                            className="btn btn-ghost"
                            style={{ padding: 0, color: 'var(--color-danger)' }}
                            onClick={() => handleRemoveFormulaStep(sys.id, sIdx)}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Principles & Philosophy */}
                <div style={{ marginBottom: '16px' }}>
                  <label className="form-label" style={{ fontSize: '12px' }}>
                    {t('namingPrinciplesLabel', uiLanguage)}
                  </label>
                  <textarea
                    className="form-textarea"
                    rows={2}
                    placeholder={t('namingPrinciplesPlaceholder', uiLanguage)}
                    value={principlesVal}
                    onChange={(e) =>
                      handleUpdateSystem(sys.id, {
                        principles: updateLocalizedString(sys.principles, contentLanguage, e.target.value)
                      })
                    }
                  />
                </div>

                {/* Approved vs Prohibited Examples & Rationale */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                  {/* Approved Examples */}
                  <div style={{ background: 'var(--color-bg-secondary)', borderRadius: '8px', padding: '12px', border: '1px solid var(--color-border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontWeight: 600, fontSize: '12px', color: 'var(--color-success, #16a34a)' }}>
                        ✓ {t('approvedExamplesTitle', uiLanguage)}
                      </span>
                      <button
                        className="btn btn-ghost"
                        style={{ fontSize: '11px', padding: '2px 6px' }}
                        onClick={() => {
                          const current = sys.examples?.approved || [];
                          handleUpdateSystem(sys.id, {
                            examples: { ...sys.examples, approved: [...current, ''] }
                          });
                        }}
                      >
                        <Plus size={12} /> {t('addNamingExample', uiLanguage)}
                      </button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {(sys.examples?.approved || []).map((ex, exIdx) => (
                        <div key={exIdx} style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                          <input
                            type="text"
                            className="form-input"
                            style={{ padding: '4px 8px', fontSize: '12px', flex: 1 }}
                            placeholder="e.g. Northstar Solstice Roast"
                            value={ex}
                            onChange={(e) => {
                              const newArr = [...(sys.examples?.approved || [])];
                              newArr[exIdx] = e.target.value;
                              handleUpdateSystem(sys.id, {
                                examples: { ...sys.examples, approved: newArr }
                              });
                            }}
                          />
                          <button
                            className="btn btn-ghost"
                            style={{ padding: '2px', color: 'var(--color-text-secondary)' }}
                            onClick={() => {
                              handleUpdateSystem(sys.id, {
                                examples: {
                                  ...sys.examples,
                                  approved: (sys.examples?.approved || []).filter((_, idx) => idx !== exIdx)
                                }
                              });
                            }}
                          >
                            <X size={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Prohibited Examples */}
                  <div style={{ background: 'var(--color-bg-secondary)', borderRadius: '8px', padding: '12px', border: '1px solid var(--color-border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontWeight: 600, fontSize: '12px', color: 'var(--color-danger, #dc2626)' }}>
                        ✗ {t('prohibitedExamplesTitle', uiLanguage)}
                      </span>
                      <button
                        className="btn btn-ghost"
                        style={{ fontSize: '11px', padding: '2px 6px' }}
                        onClick={() => {
                          const current = sys.examples?.prohibited || [];
                          handleUpdateSystem(sys.id, {
                            examples: { ...sys.examples, prohibited: [...current, ''] }
                          });
                        }}
                      >
                        <Plus size={12} /> {t('addNamingExample', uiLanguage)}
                      </button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {(sys.examples?.prohibited || []).map((ex, exIdx) => (
                        <div key={exIdx} style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                          <input
                            type="text"
                            className="form-input"
                            style={{ padding: '4px 8px', fontSize: '12px', flex: 1 }}
                            placeholder="e.g. Northstar Ultra Luxury Blend"
                            value={ex}
                            onChange={(e) => {
                              const newArr = [...(sys.examples?.prohibited || [])];
                              newArr[exIdx] = e.target.value;
                              handleUpdateSystem(sys.id, {
                                examples: { ...sys.examples, prohibited: newArr }
                              });
                            }}
                          />
                          <button
                            className="btn btn-ghost"
                            style={{ padding: '2px', color: 'var(--color-text-secondary)' }}
                            onClick={() => {
                              handleUpdateSystem(sys.id, {
                                examples: {
                                  ...sys.examples,
                                  prohibited: (sys.examples?.prohibited || []).filter((_, idx) => idx !== exIdx)
                                }
                              });
                            }}
                          >
                            <X size={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Example Rationale */}
                <div style={{ marginBottom: '16px' }}>
                  <label className="form-label" style={{ fontSize: '11px' }}>
                    {t('exampleRationaleLabel', uiLanguage)}
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    style={{ fontSize: '12px' }}
                    placeholder={t('exampleRationalePlaceholder', uiLanguage)}
                    value={rationaleVal}
                    onChange={(e) =>
                      handleUpdateSystem(sys.id, {
                        examples: {
                          ...sys.examples,
                          rationale: updateLocalizedString(sys.examples?.rationale, contentLanguage, e.target.value)
                        }
                      })
                    }
                  />
                </div>

                {/* References Sections */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', borderTop: '1px solid var(--color-border)', paddingTop: '14px' }}>
                  {/* Governing Rules */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                        <ShieldAlert size={12} style={{ display: 'inline', marginRight: '4px' }} />
                        {t('governingRulesLabel', uiLanguage)}
                      </span>
                      <button
                        className="btn btn-ghost"
                        style={{ fontSize: '10px', padding: '2px 5px' }}
                        onClick={() => setActivePicker({ systemId: sys.id, targetField: 'governingRules' })}
                      >
                        <Plus size={11} /> {t('attachRule', uiLanguage)}
                      </button>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {(sys.governingRuleRefs || []).map((ref) => (
                        <span
                          key={ref.entityId}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: 'var(--color-bg-tertiary)',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '11px'
                          }}
                        >
                          {resolveEntityLabel(brand, ref, contentLanguage)}
                          <button
                            className="btn btn-ghost"
                            style={{ padding: 0 }}
                            onClick={() => handleRemoveReference(sys.id, 'governingRules', ref.entityId)}
                          >
                            <X size={10} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Target Audiences */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                        <Users size={12} style={{ display: 'inline', marginRight: '4px' }} />
                        {t('targetAudiencesLabel', uiLanguage)}
                      </span>
                      <button
                        className="btn btn-ghost"
                        style={{ fontSize: '10px', padding: '2px 5px' }}
                        onClick={() => setActivePicker({ systemId: sys.id, targetField: 'targetAudiences' })}
                      >
                        <Plus size={11} /> {t('attachAudience', uiLanguage)}
                      </button>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {(sys.targetAudienceRefs || []).map((ref) => (
                        <span
                          key={ref.entityId}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: 'var(--color-bg-tertiary)',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '11px'
                          }}
                        >
                          {resolveEntityLabel(brand, ref, contentLanguage)}
                          <button
                            className="btn btn-ghost"
                            style={{ padding: 0 }}
                            onClick={() => handleRemoveReference(sys.id, 'targetAudiences', ref.entityId)}
                          >
                            <X size={10} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Supporting Messages */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                        <Megaphone size={12} style={{ display: 'inline', marginRight: '4px' }} />
                        {t('supportingMessagesLabel', uiLanguage)}
                      </span>
                      <button
                        className="btn btn-ghost"
                        style={{ fontSize: '10px', padding: '2px 5px' }}
                        onClick={() => setActivePicker({ systemId: sys.id, targetField: 'supportingMessages' })}
                      >
                        <Plus size={11} /> {t('attachMessage', uiLanguage)}
                      </button>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {(sys.supportingMessageRefs || []).map((ref) => (
                        <span
                          key={ref.entityId}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: 'var(--color-bg-tertiary)',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '11px'
                          }}
                        >
                          {resolveEntityLabel(brand, ref, contentLanguage)}
                          <button
                            className="btn btn-ghost"
                            style={{ padding: 0 }}
                            onClick={() => handleRemoveReference(sys.id, 'supportingMessages', ref.entityId)}
                          >
                            <X size={10} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Semantic Reference Picker Modal */}
      {activePicker && (
        <ReferencePicker
          brand={brand}
          uiLanguage={uiLanguage}
          title={
            activePicker.targetField === 'governingRules'
              ? t('attachGoverningRule', uiLanguage)
              : activePicker.targetField === 'targetAudiences'
              ? t('attachTargetAudience', uiLanguage)
              : t('attachSupportingMessage', uiLanguage)
          }
          allowedEntityTypes={
            activePicker.targetField === 'governingRules'
              ? ['rule']
              : activePicker.targetField === 'targetAudiences'
              ? ['targetAudience']
              : ['keyMessage', 'proofPoint', 'callToAction']
          }
          onSelect={handleAttachReference}
          onClose={() => setActivePicker(null)}
        />
      )}
    </div>
  );
};
