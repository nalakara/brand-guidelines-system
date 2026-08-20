import React, { useState } from 'react';
import {
  Brand,
  BrandArchitectureModule,
  BrandArchitectureNodeEntity,
  BrandRelationshipEntity,
  BrandArchitectureStrategyType,
  BrandNodeType,
  CouplingLevel,
  Language,
  EntityReference,
  EntityType,
  getLocalizedText,
  updateLocalizedString
} from '../../types/brand';
import { resolveEntityLabel } from '../../utils/entityResolver';
import { ReferencePicker } from '../ui/ReferencePicker';
import { t } from '../../i18n/translations';
import {
  Plus,
  Trash2,
  Network,
  X,
  ShieldAlert,
  Users,
  Image,
  Layers,
  ArrowRight,
  GitBranch
} from 'lucide-react';

interface BrandArchitectureEditorProps {
  data?: BrandArchitectureModule;
  brand: Brand;
  uiLanguage: Language;
  contentLanguage: Language;
  onChange: (updatedData: BrandArchitectureModule) => void;
}

const STRATEGY_OPTIONS: { type: BrandArchitectureStrategyType; labelKey: string; descKey: string }[] = [
  { type: 'brandedHouse', labelKey: 'strategyBrandedHouse', descKey: 'strategyBrandedHouseDesc' },
  { type: 'houseOfBrands', labelKey: 'strategyHouseOfBrands', descKey: 'strategyHouseOfBrandsDesc' },
  { type: 'endorsed', labelKey: 'strategyEndorsed', descKey: 'strategyEndorsedDesc' },
  { type: 'hybrid', labelKey: 'strategyHybrid', descKey: 'strategyHybridDesc' }
];

const NODE_TYPES: { type: BrandNodeType; labelKey: string }[] = [
  { type: 'corporateMaster', labelKey: 'nodeTypeCorporateMaster' },
  { type: 'subBrand', labelKey: 'nodeTypeSubBrand' },
  { type: 'endorsedBrand', labelKey: 'nodeTypeEndorsedBrand' },
  { type: 'productBrand', labelKey: 'nodeTypeProductBrand' },
  { type: 'ingredientBrand', labelKey: 'nodeTypeIngredientBrand' },
  { type: 'partnerBrand', labelKey: 'nodeTypePartnerBrand' }
];

const NODE_STATUSES: { status: 'active' | 'incubating' | 'retired'; labelKey: string }[] = [
  { status: 'active', labelKey: 'statusActive' },
  { status: 'incubating', labelKey: 'statusIncubating' },
  { status: 'retired', labelKey: 'statusRetired' }
];

const RELATIONSHIP_TYPES: { type: 'parentOf' | 'endorses' | 'partnerWith' | 'subBrandOf' | 'independentOf'; labelKey: string }[] = [
  { type: 'parentOf', labelKey: 'relTypeParentOf' },
  { type: 'endorses', labelKey: 'relTypeEndorses' },
  { type: 'partnerWith', labelKey: 'relTypePartnerWith' },
  { type: 'subBrandOf', labelKey: 'relTypeSubBrandOf' },
  { type: 'independentOf', labelKey: 'relTypeIndependentOf' }
];

const COUPLING_LEVELS: { level: CouplingLevel; labelKey: string }[] = [
  { level: 'monolithic', labelKey: 'couplingMonolithic' },
  { level: 'endorsed', labelKey: 'couplingEndorsed' },
  { level: 'freestanding', labelKey: 'couplingFreestanding' },
  { level: 'coBranded', labelKey: 'couplingCoBranded' }
];

// Semantic constraints for ReferencePicker
const ALLOWED_RULE_TYPES: EntityType[] = ['rule'];
const ALLOWED_AUDIENCE_TYPES: EntityType[] = ['targetAudience'];
const ALLOWED_ASSET_TYPES: EntityType[] = ['asset'];

export const BrandArchitectureEditor: React.FC<BrandArchitectureEditorProps> = ({
  data,
  brand,
  uiLanguage,
  contentLanguage,
  onChange
}) => {
  const currentData: BrandArchitectureModule = data || {
    strategyOverview: { en: '', id: '' },
    strategyType: 'hybrid',
    nodes: [],
    relationships: []
  };

  const [activePicker, setActivePicker] = useState<{
    targetType: 'node' | 'relationship';
    targetId: string;
    field: 'governingRules' | 'targetAudiences' | 'sharedAssets';
  } | null>(null);

  // Strategy Overview change
  const handleOverviewChange = (val: string) => {
    onChange({
      ...currentData,
      strategyOverview: updateLocalizedString(currentData.strategyOverview, contentLanguage, val)
    });
  };

  // Strategy Type change
  const handleStrategyTypeChange = (type: BrandArchitectureStrategyType) => {
    onChange({
      ...currentData,
      strategyType: type
    });
  };

  // --- Node Actions ---
  const handleAddNode = () => {
    const newNode: BrandArchitectureNodeEntity = {
      id: `node-${Date.now()}`,
      name: {
        en: 'New Brand Entity',
        id: 'Entitas Merek Baru'
      },
      nodeType: 'subBrand',
      status: 'active',
      description: { en: '', id: '' },
      targetMarketOrAudience: { en: '', id: '' },
      governingRuleRefs: [],
      targetAudienceRefs: []
    };

    onChange({
      ...currentData,
      nodes: [...currentData.nodes, newNode]
    });
  };

  const handleUpdateNode = (nodeId: string, updates: Partial<BrandArchitectureNodeEntity>) => {
    onChange({
      ...currentData,
      nodes: currentData.nodes.map((n) => (n.id === nodeId ? { ...n, ...updates } : n))
    });
  };

  const handleDeleteNode = (nodeId: string) => {
    onChange({
      ...currentData,
      nodes: currentData.nodes.filter((n) => n.id !== nodeId),
      relationships: currentData.relationships.filter(
        (rel) => rel.sourceNodeId !== nodeId && rel.targetNodeId !== nodeId
      )
    });
  };

  // --- Relationship Actions ---
  const handleAddRelationship = () => {
    if (currentData.nodes.length < 2) return;

    const source = currentData.nodes[0].id;
    const target = currentData.nodes[1].id;

    // Check if relationship already exists
    const exists = currentData.relationships.some(
      (r) => r.sourceNodeId === source && r.targetNodeId === target
    );
    if (exists) return;

    const newRel: BrandRelationshipEntity = {
      id: `rel-${Date.now()}`,
      sourceNodeId: source,
      targetNodeId: target,
      relationshipType: 'parentOf',
      coupling: 'monolithic',
      endorsementRuleNotes: { en: '', id: '' },
      governingRuleRefs: [],
      sharedAssetRefs: []
    };

    onChange({
      ...currentData,
      relationships: [...currentData.relationships, newRel]
    });
  };

  const handleUpdateRelationship = (relId: string, updates: Partial<BrandRelationshipEntity>) => {
    onChange({
      ...currentData,
      relationships: currentData.relationships.map((r) => (r.id === relId ? { ...r, ...updates } : r))
    });
  };

  const handleDeleteRelationship = (relId: string) => {
    onChange({
      ...currentData,
      relationships: currentData.relationships.filter((rel) => rel.id !== relId)
    });
  };

  // --- Reference Attachments ---
  const handleAttachReference = (ref: EntityReference) => {
    if (!activePicker) return;
    const { targetType, targetId, field } = activePicker;

    if (targetType === 'node') {
      const node = currentData.nodes.find((n) => n.id === targetId);
      if (!node) return;

      if (field === 'governingRules') {
        const existing = node.governingRuleRefs || [];
        if (!existing.some((r) => r.entityId === ref.entityId)) {
          handleUpdateNode(targetId, { governingRuleRefs: [...existing, ref] });
        }
      } else if (field === 'targetAudiences') {
        const existing = node.targetAudienceRefs || [];
        if (!existing.some((r) => r.entityId === ref.entityId)) {
          handleUpdateNode(targetId, { targetAudienceRefs: [...existing, ref] });
        }
      }
    } else if (targetType === 'relationship') {
      const rel = currentData.relationships.find((r) => r.id === targetId);
      if (!rel) return;

      if (field === 'governingRules') {
        const existing = rel.governingRuleRefs || [];
        if (!existing.some((r) => r.entityId === ref.entityId)) {
          handleUpdateRelationship(targetId, { governingRuleRefs: [...existing, ref] });
        }
      } else if (field === 'sharedAssets') {
        const existing = rel.sharedAssetRefs || [];
        if (!existing.some((r) => r.entityId === ref.entityId)) {
          handleUpdateRelationship(targetId, { sharedAssetRefs: [...existing, ref] });
        }
      }
    }

    setActivePicker(null);
  };

  const handleRemoveNodeRef = (nodeId: string, field: 'governingRules' | 'targetAudiences', refIndex: number) => {
    const node = currentData.nodes.find((n) => n.id === nodeId);
    if (!node) return;
    if (field === 'governingRules') {
      const list = [...(node.governingRuleRefs || [])];
      list.splice(refIndex, 1);
      handleUpdateNode(nodeId, { governingRuleRefs: list });
    } else if (field === 'targetAudiences') {
      const list = [...(node.targetAudienceRefs || [])];
      list.splice(refIndex, 1);
      handleUpdateNode(nodeId, { targetAudienceRefs: list });
    }
  };

  const handleRemoveRelRef = (relId: string, field: 'governingRules' | 'sharedAssets', refIndex: number) => {
    const rel = currentData.relationships.find((r) => r.id === relId);
    if (!rel) return;
    if (field === 'governingRules') {
      const list = [...(rel.governingRuleRefs || [])];
      list.splice(refIndex, 1);
      handleUpdateRelationship(relId, { governingRuleRefs: list });
    } else if (field === 'sharedAssets') {
      const list = [...(rel.sharedAssetRefs || [])];
      list.splice(refIndex, 1);
      handleUpdateRelationship(relId, { sharedAssetRefs: list });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '1024px', paddingBottom: '64px' }}>
      {/* 1. Header & Strategy Model Card */}
      <div className="editor-card">
        <div className="editor-header">
          <div className="editor-title-group">
            <div
              style={{
                padding: '10px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--accent-light)',
                color: 'var(--accent-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Network size={22} />
            </div>
            <div>
              <h2 className="editor-title">{t('brandArchitectureTitle', uiLanguage)}</h2>
              <p className="editor-subtitle">{t('brandArchitectureSubtitle', uiLanguage)}</p>
            </div>
          </div>
        </div>

        {/* Strategy Model Selector */}
        <div className="form-group">
          <label className="form-label">{t('portfolioStrategyTypeLabel', uiLanguage)}</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px', marginTop: '8px' }}>
            {STRATEGY_OPTIONS.map((opt) => {
              const isSelected = currentData.strategyType === opt.type;
              return (
                <button
                  key={opt.type}
                  type="button"
                  onClick={() => handleStrategyTypeChange(opt.type)}
                  style={{
                    textAlign: 'left',
                    padding: '16px',
                    borderRadius: 'var(--radius-md)',
                    border: isSelected ? '2px solid var(--accent-primary)' : '1px solid var(--border-medium)',
                    backgroundColor: isSelected ? 'var(--accent-light)' : 'var(--bg-card)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.92rem', color: isSelected ? 'var(--accent-primary)' : 'var(--text-main)' }}>
                      {t(opt.labelKey, uiLanguage)}
                    </span>
                    {isSelected && (
                      <span
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--accent-primary)'
                        }}
                      />
                    )}
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.45', margin: 0 }}>
                    {t(opt.descKey, uiLanguage)}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Strategy Overview */}
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">{t('strategyOverviewLabel', uiLanguage)}</label>
          <p className="form-hint">{t('strategyOverviewHint', uiLanguage)}</p>
          <textarea
            className="form-control"
            value={getLocalizedText(currentData.strategyOverview, contentLanguage).text}
            onChange={(e) => handleOverviewChange(e.target.value)}
            placeholder={t('strategyOverviewPlaceholder', uiLanguage)}
            rows={3}
          />
        </div>
      </div>

      {/* 2. Brand Portfolio Nodes */}
      <div className="editor-card">
        <div className="editor-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={20} color="var(--accent-primary)" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
              {t('architectureNodesTitle', uiLanguage)} ({currentData.nodes.length})
            </h3>
          </div>
          <button type="button" className="btn btn-primary" onClick={handleAddNode}>
            <Plus size={16} />
            {t('addArchitectureNode', uiLanguage)}
          </button>
        </div>

        {currentData.nodes.length === 0 ? (
          <div
            style={{
              padding: '36px',
              textAlign: 'center',
              color: 'var(--text-muted)',
              backgroundColor: 'var(--bg-muted)',
              borderRadius: 'var(--radius-md)',
              border: '1px dashed var(--border-medium)'
            }}
          >
            {t('noArchitectureNodesEmpty', uiLanguage)}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {currentData.nodes.map((node, index) => {
              const nodeTitle = getLocalizedText(node.name, contentLanguage).text || `${t('nodeNameLabel', uiLanguage)} ${index + 1}`;
              const isMaster = node.nodeType === 'corporateMaster';

              return (
                <div
                  key={node.id}
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-light)',
                    borderLeft: isMaster ? '4px solid var(--accent-primary)' : '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-md)',
                    padding: '24px',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        #{index + 1}
                      </span>
                      <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>
                        {nodeTitle}
                      </span>
                      {isMaster && (
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
                          {t('nodeTypeCorporateMaster', uiLanguage)}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteNode(node.id)}
                      className="btn btn-sm btn-secondary"
                      style={{ color: '#ef4444' }}
                      title={t('removeArchitectureNode', uiLanguage)}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                    {/* Node Name */}
                    <div>
                      <label className="form-label">{t('nodeNameLabel', uiLanguage)}</label>
                      <input
                        type="text"
                        className="form-control"
                        value={getLocalizedText(node.name, contentLanguage).text}
                        onChange={(e) =>
                          handleUpdateNode(node.id, {
                            name: updateLocalizedString(node.name, contentLanguage, e.target.value)
                          })
                        }
                        placeholder={t('nodeNamePlaceholder', uiLanguage)}
                      />
                    </div>

                    {/* Node Type */}
                    <div>
                      <label className="form-label">{t('nodeTypeLabel', uiLanguage)}</label>
                      <select
                        className="form-control"
                        value={node.nodeType}
                        onChange={(e) => handleUpdateNode(node.id, { nodeType: e.target.value as BrandNodeType })}
                      >
                        {NODE_TYPES.map((nt) => (
                          <option key={nt.type} value={nt.type}>
                            {t(nt.labelKey, uiLanguage)}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Status */}
                    <div>
                      <label className="form-label">{t('nodeStatusLabel', uiLanguage)}</label>
                      <select
                        className="form-control"
                        value={node.status}
                        onChange={(e) => handleUpdateNode(node.id, { status: e.target.value as any })}
                      >
                        {NODE_STATUSES.map((st) => (
                          <option key={st.status} value={st.status}>
                            {t(st.labelKey, uiLanguage)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                    {/* Role Description */}
                    <div>
                      <label className="form-label">{t('nodeDescriptionLabel', uiLanguage)}</label>
                      <textarea
                        className="form-control"
                        value={getLocalizedText(node.description, contentLanguage).text}
                        onChange={(e) =>
                          handleUpdateNode(node.id, {
                            description: updateLocalizedString(node.description, contentLanguage, e.target.value)
                          })
                        }
                        placeholder={t('nodeDescriptionPlaceholder', uiLanguage)}
                        rows={2}
                      />
                    </div>

                    {/* Target Market / Audience */}
                    <div>
                      <label className="form-label">{t('nodeTargetMarketLabel', uiLanguage)}</label>
                      <textarea
                        className="form-control"
                        value={getLocalizedText(node.targetMarketOrAudience, contentLanguage).text}
                        onChange={(e) =>
                          handleUpdateNode(node.id, {
                            targetMarketOrAudience: updateLocalizedString(
                              node.targetMarketOrAudience,
                              contentLanguage,
                              e.target.value
                            )
                          })
                        }
                        placeholder={t('nodeTargetMarketPlaceholder', uiLanguage)}
                        rows={2}
                      />
                    </div>
                  </div>

                  {/* Semantic Reference Attachments for Node */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', paddingTop: '12px', borderTop: '1px dashed var(--border-light)' }}>
                    {/* Governing Rules */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <ShieldAlert size={14} color="#f59e0b" />
                          {t('governingRulesLabel', uiLanguage)}
                        </span>
                        <button
                          type="button"
                          onClick={() => setActivePicker({ targetType: 'node', targetId: node.id, field: 'governingRules' })}
                          className="btn btn-sm btn-secondary"
                          style={{ fontSize: '0.75rem', padding: '3px 8px' }}
                        >
                          <Plus size={12} /> {t('attachGoverningRule', uiLanguage)}
                        </button>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {(node.governingRuleRefs || []).length === 0 ? (
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                            {t('noneAttached', uiLanguage) || 'None attached'}
                          </span>
                        ) : (
                          node.governingRuleRefs?.map((ref, rIdx) => (
                            <span
                              key={`${ref.entityId}-${rIdx}`}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '3px 8px',
                                borderRadius: 'var(--radius-sm)',
                                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                                color: '#b45309',
                                border: '1px solid rgba(245, 158, 11, 0.25)',
                                fontSize: '0.75rem',
                                fontWeight: 500
                              }}
                            >
                              <span>{resolveEntityLabel(brand, ref, contentLanguage)}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveNodeRef(node.id, 'governingRules', rIdx)}
                                style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'inherit', display: 'flex' }}
                              >
                                <X size={12} />
                              </button>
                            </span>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Target Audience Reference */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Users size={14} color="var(--accent-primary)" />
                          {t('targetAudiencesLabel', uiLanguage)}
                        </span>
                        <button
                          type="button"
                          onClick={() => setActivePicker({ targetType: 'node', targetId: node.id, field: 'targetAudiences' })}
                          className="btn btn-sm btn-secondary"
                          style={{ fontSize: '0.75rem', padding: '3px 8px' }}
                        >
                          <Plus size={12} /> {t('attachTargetAudience', uiLanguage)}
                        </button>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {(node.targetAudienceRefs || []).length === 0 ? (
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                            {t('noneAttached', uiLanguage) || 'None attached'}
                          </span>
                        ) : (
                          node.targetAudienceRefs?.map((ref, rIdx) => (
                            <span
                              key={`${ref.entityId}-${rIdx}`}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '3px 8px',
                                borderRadius: 'var(--radius-sm)',
                                backgroundColor: 'var(--accent-light)',
                                color: 'var(--accent-primary)',
                                border: '1px solid rgba(37, 99, 235, 0.25)',
                                fontSize: '0.75rem',
                                fontWeight: 500
                              }}
                            >
                              <span>{resolveEntityLabel(brand, ref, contentLanguage)}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveNodeRef(node.id, 'targetAudiences', rIdx)}
                                style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'inherit', display: 'flex' }}
                              >
                                <X size={12} />
                              </button>
                            </span>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. Portfolio Relationships & Coupling Topology */}
      <div className="editor-card">
        <div className="editor-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <GitBranch size={20} color="var(--accent-primary)" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>
              {t('architectureRelationshipsTitle', uiLanguage)} ({currentData.relationships.length})
            </h3>
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleAddRelationship}
            disabled={currentData.nodes.length < 2}
            style={{ opacity: currentData.nodes.length < 2 ? 0.6 : 1, cursor: currentData.nodes.length < 2 ? 'not-allowed' : 'pointer' }}
          >
            <Plus size={16} />
            {t('addRelationship', uiLanguage)}
          </button>
        </div>

        {currentData.relationships.length === 0 ? (
          <div
            style={{
              padding: '36px',
              textAlign: 'center',
              color: 'var(--text-muted)',
              backgroundColor: 'var(--bg-muted)',
              borderRadius: 'var(--radius-md)',
              border: '1px dashed var(--border-medium)'
            }}
          >
            {t('noRelationshipsEmpty', uiLanguage)}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {currentData.relationships.map((rel, index) => {
              const sourceNode = currentData.nodes.find((n) => n.id === rel.sourceNodeId);
              const targetNode = currentData.nodes.find((n) => n.id === rel.targetNodeId);

              const sourceName = sourceNode ? getLocalizedText(sourceNode.name, contentLanguage).text : 'Source Node';
              const targetName = targetNode ? getLocalizedText(targetNode.name, contentLanguage).text : 'Target Node';

              return (
                <div
                  key={rel.id}
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-md)',
                    padding: '24px',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        #{index + 1}
                      </span>
                      <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>{sourceName}</span>
                        <ArrowRight size={14} color="var(--text-muted)" />
                        <span>{targetName}</span>
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteRelationship(rel.id)}
                      className="btn btn-sm btn-secondary"
                      style={{ color: '#ef4444' }}
                      title={t('removeRelationship', uiLanguage)}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                    {/* Source Node Selector */}
                    <div>
                      <label className="form-label">{t('sourceNodeLabel', uiLanguage)}</label>
                      <select
                        className="form-control"
                        value={rel.sourceNodeId}
                        onChange={(e) => handleUpdateRelationship(rel.id, { sourceNodeId: e.target.value })}
                      >
                        {currentData.nodes.map((n) => (
                          <option key={n.id} value={n.id}>
                            {getLocalizedText(n.name, contentLanguage).text || n.id}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Target Node Selector */}
                    <div>
                      <label className="form-label">{t('targetNodeLabel', uiLanguage)}</label>
                      <select
                        className="form-control"
                        value={rel.targetNodeId}
                        onChange={(e) => handleUpdateRelationship(rel.id, { targetNodeId: e.target.value })}
                      >
                        {currentData.nodes.map((n) => (
                          <option key={n.id} value={n.id} disabled={n.id === rel.sourceNodeId}>
                            {getLocalizedText(n.name, contentLanguage).text || n.id}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Relationship Type */}
                    <div>
                      <label className="form-label">{t('relationshipTypeLabel', uiLanguage)}</label>
                      <select
                        className="form-control"
                        value={rel.relationshipType}
                        onChange={(e) => handleUpdateRelationship(rel.id, { relationshipType: e.target.value as any })}
                      >
                        {RELATIONSHIP_TYPES.map((rt) => (
                          <option key={rt.type} value={rt.type}>
                            {t(rt.labelKey, uiLanguage)}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Coupling Tier */}
                    <div>
                      <label className="form-label">{t('couplingLevelLabel', uiLanguage)}</label>
                      <select
                        className="form-control"
                        value={rel.coupling}
                        onChange={(e) => handleUpdateRelationship(rel.id, { coupling: e.target.value as CouplingLevel })}
                      >
                        {COUPLING_LEVELS.map((cl) => (
                          <option key={cl.level} value={cl.level}>
                            {t(cl.labelKey, uiLanguage)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Endorsement & Governance Rules Note */}
                  <div style={{ marginBottom: '16px' }}>
                    <label className="form-label">{t('endorsementNotesLabel', uiLanguage)}</label>
                    <textarea
                      className="form-control"
                      value={getLocalizedText(rel.endorsementRuleNotes, contentLanguage).text}
                      onChange={(e) =>
                        handleUpdateRelationship(rel.id, {
                          endorsementRuleNotes: updateLocalizedString(
                            rel.endorsementRuleNotes,
                            contentLanguage,
                            e.target.value
                          )
                        })
                      }
                      placeholder={t('endorsementNotesPlaceholder', uiLanguage)}
                      rows={2}
                    />
                  </div>

                  {/* Semantic Reference Attachments for Relationship */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', paddingTop: '12px', borderTop: '1px dashed var(--border-light)' }}>
                    {/* Governing Rules */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <ShieldAlert size={14} color="#f59e0b" />
                          {t('governingRulesLabel', uiLanguage)}
                        </span>
                        <button
                          type="button"
                          onClick={() => setActivePicker({ targetType: 'relationship', targetId: rel.id, field: 'governingRules' })}
                          className="btn btn-sm btn-secondary"
                          style={{ fontSize: '0.75rem', padding: '3px 8px' }}
                        >
                          <Plus size={12} /> {t('attachGoverningRule', uiLanguage)}
                        </button>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {(rel.governingRuleRefs || []).length === 0 ? (
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                            {t('noneAttached', uiLanguage) || 'None attached'}
                          </span>
                        ) : (
                          rel.governingRuleRefs?.map((ref, rIdx) => (
                            <span
                              key={`${ref.entityId}-${rIdx}`}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '3px 8px',
                                borderRadius: 'var(--radius-sm)',
                                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                                color: '#b45309',
                                border: '1px solid rgba(245, 158, 11, 0.25)',
                                fontSize: '0.75rem',
                                fontWeight: 500
                              }}
                            >
                              <span>{resolveEntityLabel(brand, ref, contentLanguage)}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveRelRef(rel.id, 'governingRules', rIdx)}
                                style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'inherit', display: 'flex' }}
                              >
                                <X size={12} />
                              </button>
                            </span>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Shared Co-Brand Assets */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Image size={14} color="#10b981" />
                          {t('sharedAssetsLabel', uiLanguage)}
                        </span>
                        <button
                          type="button"
                          onClick={() => setActivePicker({ targetType: 'relationship', targetId: rel.id, field: 'sharedAssets' })}
                          className="btn btn-sm btn-secondary"
                          style={{ fontSize: '0.75rem', padding: '3px 8px' }}
                        >
                          <Plus size={12} /> {t('attachSharedAsset', uiLanguage)}
                        </button>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {(rel.sharedAssetRefs || []).length === 0 ? (
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                            {t('noneAttached', uiLanguage) || 'None attached'}
                          </span>
                        ) : (
                          rel.sharedAssetRefs?.map((ref, rIdx) => (
                            <span
                              key={`${ref.entityId}-${rIdx}`}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '3px 8px',
                                borderRadius: 'var(--radius-sm)',
                                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                                color: '#047857',
                                border: '1px solid rgba(16, 185, 129, 0.25)',
                                fontSize: '0.75rem',
                                fontWeight: 500
                              }}
                            >
                              <span>{resolveEntityLabel(brand, ref, contentLanguage)}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveRelRef(rel.id, 'sharedAssets', rIdx)}
                                style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'inherit', display: 'flex' }}
                              >
                                <X size={12} />
                              </button>
                            </span>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Semantic Reference Picker Modal */}
      {activePicker && (
        <ReferencePicker
          brand={brand}
          uiLanguage={uiLanguage}
          filterDomain={
            activePicker.field === 'governingRules'
              ? 'visualRules'
              : activePicker.field === 'targetAudiences'
              ? 'foundation'
              : activePicker.field === 'sharedAssets'
              ? 'visualAssets'
              : undefined
          }
          allowedEntityTypes={
            activePicker.field === 'governingRules'
              ? ALLOWED_RULE_TYPES
              : activePicker.field === 'targetAudiences'
              ? ALLOWED_AUDIENCE_TYPES
              : activePicker.field === 'sharedAssets'
              ? ALLOWED_ASSET_TYPES
              : undefined
          }
          selectedEntityIds={
            activePicker.targetType === 'node'
              ? activePicker.field === 'governingRules'
                ? currentData.nodes.find((n) => n.id === activePicker.targetId)?.governingRuleRefs?.map((r) => r.entityId)
                : currentData.nodes.find((n) => n.id === activePicker.targetId)?.targetAudienceRefs?.map((r) => r.entityId)
              : activePicker.field === 'governingRules'
              ? currentData.relationships.find((r) => r.id === activePicker.targetId)?.governingRuleRefs?.map((r) => r.entityId)
              : currentData.relationships.find((r) => r.id === activePicker.targetId)?.sharedAssetRefs?.map((r) => r.entityId)
          }
          onSelect={handleAttachReference}
          onClose={() => setActivePicker(null)}
          title={
            activePicker.field === 'governingRules'
              ? t('attachGoverningRule', uiLanguage)
              : activePicker.field === 'targetAudiences'
              ? t('attachTargetAudience', uiLanguage)
              : t('attachSharedAsset', uiLanguage)
          }
        />
      )}
    </div>
  );
};
