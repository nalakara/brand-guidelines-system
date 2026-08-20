import React from 'react';
import {
  Brand,
  Language,
  getLocalizedText
} from '../../../types/brand';
import { resolveEntityLabel } from '../../../utils/entityResolver';
import { t } from '../../../i18n/translations';
import {
  Edit2,
  Network,
  GitBranch,
  ShieldAlert,
  Users,
  Image,
  ArrowRight,
  Layers,
  Building2,
  Sparkles,
  Award,
  Box,
  Cpu,
  Handshake
} from 'lucide-react';

interface PreviewArchitectureProps {
  brand: Brand;
  contentLanguage: Language;
  onJumpToModule?: (moduleId: any) => void;
  sectionNumber: number;
}

const STRATEGY_TITLES: Record<string, string> = {
  brandedHouse: 'strategyBrandedHouse',
  houseOfBrands: 'strategyHouseOfBrands',
  endorsed: 'strategyEndorsed',
  hybrid: 'strategyHybrid'
};

const NODE_ROLE_LABELS: Record<string, string> = {
  corporateMaster: 'nodeTypeCorporateMaster',
  subBrand: 'nodeTypeSubBrand',
  endorsedBrand: 'nodeTypeEndorsedBrand',
  productBrand: 'nodeTypeProductBrand',
  ingredientBrand: 'nodeTypeIngredientBrand',
  partnerBrand: 'nodeTypePartnerBrand'
};

const COUPLING_LABELS: Record<string, string> = {
  monolithic: 'couplingMonolithic',
  endorsed: 'couplingEndorsed',
  freestanding: 'couplingFreestanding',
  coBranded: 'couplingCoBranded'
};

const RELATIONSHIP_LABELS: Record<string, string> = {
  parentOf: 'relTypeParentOf',
  endorses: 'relTypeEndorses',
  subBrandOf: 'relTypeSubBrandOf',
  ingredientIn: 'relTypeIngredientIn',
  partnerWith: 'relTypePartnerWith'
};

export const PreviewArchitecture: React.FC<PreviewArchitectureProps> = ({
  brand,
  contentLanguage,
  onJumpToModule,
  sectionNumber
}) => {
  const archData = brand.modules.brandArchitecture;
  if (!archData) return null;

  const { strategyType = 'hybrid', strategyOverview, nodes = [], relationships = [] } = archData;
  const overviewText = getLocalizedText(strategyOverview, contentLanguage).text;
  const strategyKey = STRATEGY_TITLES[strategyType] || 'strategyHybrid';

  const getNodeIcon = (nodeType: string) => {
    switch (nodeType) {
      case 'corporateMaster':
        return <Building2 size={16} className="text-amber-600 dark:text-amber-400" />;
      case 'subBrand':
        return <Layers size={16} className="text-indigo-600 dark:text-indigo-400" />;
      case 'endorsedBrand':
        return <Award size={16} className="text-emerald-600 dark:text-emerald-400" />;
      case 'productBrand':
        return <Box size={16} className="text-blue-600 dark:text-blue-400" />;
      case 'ingredientBrand':
        return <Cpu size={16} className="text-purple-600 dark:text-purple-400" />;
      case 'partnerBrand':
        return <Handshake size={16} className="text-rose-600 dark:text-rose-400" />;
      default:
        return <Sparkles size={16} className="text-gray-500" />;
    }
  };

  const getNodeTypeBadgeClass = (nodeType: string) => {
    switch (nodeType) {
      case 'corporateMaster':
        return 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800';
      case 'subBrand':
        return 'bg-indigo-50 text-indigo-800 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800';
      case 'endorsedBrand':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800';
      case 'productBrand':
        return 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800';
      case 'ingredientBrand':
        return 'bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800';
      case 'partnerBrand':
        return 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
    }
  };

  const getCouplingBadgeClass = (coupling: string) => {
    switch (coupling) {
      case 'monolithic':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700';
      case 'endorsed':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700';
      case 'freestanding':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-300 dark:border-gray-600';
      case 'coBranded':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300 dark:border-rose-700';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <section className="preview-section" id="section-brandArchitecture">
      {/* Section Header */}
      <div className="section-header">
        <div className="section-title-wrap">
          <span className="section-num">{String(sectionNumber).padStart(2, '0')}</span>
          <h2>{t('domainBrandArchitecture', contentLanguage)}</h2>
        </div>
        {onJumpToModule && (
          <button
            className="edit-module-btn"
            onClick={() => onJumpToModule('brandArchitecture')}
            title="Edit Brand Architecture"
          >
            <Edit2 size={16} />
            <span>Edit</span>
          </button>
        )}
      </div>

      {/* Strategic Overview & Model Badge */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '9999px',
              fontSize: '0.8rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              backgroundColor: 'var(--accent-light, #eef2ff)',
              color: 'var(--accent-primary, #4f46e5)',
              border: '1px solid var(--accent-primary, #4f46e5)'
            }}
          >
            <Network size={14} />
            {t(strategyKey, contentLanguage)}
          </span>
        </div>

        <p className="section-lead">
          {overviewText ||
            (contentLanguage === 'id'
              ? 'Topologi arsitektur merek mendefinisikan hierarki portofolio, peran simpul merek, hubungan endosemen, dan tingkat kopling identitas visual.'
              : 'Brand architecture topology defines portfolio hierarchy, brand node roles, endorsement relationships, and visual identity coupling tiers.')}
        </p>
      </div>

      {/* 1. Brand Portfolio Nodes */}
      <div style={{ marginBottom: '36px' }}>
        <h3
          style={{
            fontSize: '1rem',
            fontWeight: 700,
            color: '#1e293b',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Layers size={18} className="text-indigo-600" />
          <span>{t('architectureNodesTitle', contentLanguage)}</span>
          <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#64748b' }}>
            ({nodes.length})
          </span>
        </h3>

        {nodes.length === 0 ? (
          <div className="empty-preview-msg">
            <Network size={24} />
            <p>{t('noArchitectureNodesEmpty', contentLanguage)}</p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '16px'
            }}
          >
            {nodes.map((node) => {
              const nodeName = getLocalizedText(node.name, contentLanguage).text;
              const nodeDesc = getLocalizedText(node.description, contentLanguage).text;
              const nodeMarket = getLocalizedText(node.targetMarketOrAudience, contentLanguage).text;
              const roleLabelKey = NODE_ROLE_LABELS[node.nodeType] || 'nodeTypeSubBrand';

              return (
                <div
                  key={node.id}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid var(--border-light, #e2e8f0)',
                    borderRadius: '8px',
                    padding: '18px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        gap: '8px',
                        marginBottom: '10px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div
                          style={{
                            padding: '6px',
                            borderRadius: '6px',
                            backgroundColor: '#f8fafc',
                            border: '1px solid #e2e8f0'
                          }}
                        >
                          {getNodeIcon(node.nodeType)}
                        </div>
                        <div>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                            {nodeName}
                          </h4>
                          <span
                            style={{
                              display: 'inline-block',
                              marginTop: '3px',
                              fontSize: '0.7rem',
                              fontWeight: 600,
                              textTransform: 'uppercase',
                              padding: '1px 6px',
                              borderRadius: '4px',
                              border: '1px solid'
                            }}
                            className={getNodeTypeBadgeClass(node.nodeType)}
                          >
                            {t(roleLabelKey, contentLanguage)}
                          </span>
                        </div>
                      </div>
                      <span
                        style={{
                          fontSize: '0.68rem',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          color: node.status === 'active' ? '#16a34a' : node.status === 'incubating' ? '#d97706' : '#64748b',
                          backgroundColor: node.status === 'active' ? '#f0fdf4' : node.status === 'incubating' ? '#fffbeb' : '#f1f5f9',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          border: '1px solid currentColor'
                        }}
                      >
                        {node.status}
                      </span>
                    </div>

                    {nodeDesc && (
                      <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5, margin: '8px 0' }}>
                        {nodeDesc}
                      </p>
                    )}

                    {nodeMarket && (
                      <div
                        style={{
                          fontSize: '0.78rem',
                          color: '#64748b',
                          backgroundColor: '#f8fafc',
                          padding: '6px 10px',
                          borderRadius: '4px',
                          marginTop: '8px'
                        }}
                      >
                        <strong style={{ color: '#334155' }}>Scope: </strong>
                        {nodeMarket}
                      </div>
                    )}
                  </div>

                  {/* References Footer */}
                  {((node.governingRuleRefs && node.governingRuleRefs.length > 0) ||
                    (node.targetAudienceRefs && node.targetAudienceRefs.length > 0)) && (
                    <div
                      style={{
                        marginTop: '12px',
                        paddingTop: '10px',
                        borderTop: '1px solid #f1f5f9',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '6px'
                      }}
                    >
                      {node.governingRuleRefs?.map((ref, rIdx) => (
                        <span
                          key={`rule-${rIdx}`}
                          style={{
                            fontSize: '0.7rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            backgroundColor: '#fffbeb',
                            color: '#b45309',
                            border: '1px solid #fde68a',
                            padding: '2px 6px',
                            borderRadius: '4px'
                          }}
                        >
                          <ShieldAlert size={11} />
                          {resolveEntityLabel(brand, ref, contentLanguage)}
                        </span>
                      ))}
                      {node.targetAudienceRefs?.map((ref, aIdx) => (
                        <span
                          key={`aud-${aIdx}`}
                          style={{
                            fontSize: '0.7rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            backgroundColor: '#eff6ff',
                            color: '#1d4ed8',
                            border: '1px solid #bfdbfe',
                            padding: '2px 6px',
                            borderRadius: '4px'
                          }}
                        >
                          <Users size={11} />
                          {resolveEntityLabel(brand, ref, contentLanguage)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. Portfolio Relationships & Coupling Matrix */}
      <div>
        <h3
          style={{
            fontSize: '1rem',
            fontWeight: 700,
            color: '#1e293b',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <GitBranch size={18} className="text-indigo-600" />
          <span>{t('brandRelationshipsTitle', contentLanguage)}</span>
          <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#64748b' }}>
            ({relationships.length})
          </span>
        </h3>

        {relationships.length === 0 ? (
          <div className="empty-preview-msg">
            <GitBranch size={24} />
            <p>{t('noRelationshipsEmpty', contentLanguage)}</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {relationships.map((rel) => {
              const sourceNode = nodes.find((n) => n.id === rel.sourceNodeId);
              const targetNode = nodes.find((n) => n.id === rel.targetNodeId);
              const sourceName = sourceNode ? getLocalizedText(sourceNode.name, contentLanguage).text : rel.sourceNodeId;
              const targetName = targetNode ? getLocalizedText(targetNode.name, contentLanguage).text : rel.targetNodeId;
              const relLabelKey = RELATIONSHIP_LABELS[rel.relationshipType] || 'relTypeParentOf';
              const couplingKey = COUPLING_LABELS[rel.coupling] || 'couplingMonolithic';
              const notesText = getLocalizedText(rel.endorsementRuleNotes, contentLanguage).text;

              return (
                <div
                  key={rel.id}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid var(--border-light, #e2e8f0)',
                    borderRadius: '8px',
                    padding: '16px 20px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '10px',
                      marginBottom: '8px'
                    }}
                  >
                    {/* Source -> Relationship -> Target Flow */}
                    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                      <span
                        style={{
                          fontWeight: 700,
                          fontSize: '0.9rem',
                          color: '#0f172a',
                          backgroundColor: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          padding: '4px 10px',
                          borderRadius: '6px'
                        }}
                      >
                        {sourceName}
                      </span>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: '#6366f1',
                          backgroundColor: '#eef2ff',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <ArrowRight size={12} />
                        {t(relLabelKey, contentLanguage)}
                      </span>
                      <span
                        style={{
                          fontWeight: 700,
                          fontSize: '0.9rem',
                          color: '#0f172a',
                          backgroundColor: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          padding: '4px 10px',
                          borderRadius: '6px'
                        }}
                      >
                        {targetName}
                      </span>
                    </div>

                    {/* Coupling Badge */}
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        padding: '3px 10px',
                        borderRadius: '4px',
                        border: '1px solid'
                      }}
                      className={getCouplingBadgeClass(rel.coupling)}
                    >
                      {t(couplingKey, contentLanguage)}
                    </span>
                  </div>

                  {notesText && (
                    <p style={{ fontSize: '0.84rem', color: '#475569', lineHeight: 1.5, margin: '6px 0 8px' }}>
                      {notesText}
                    </p>
                  )}

                  {/* Attached Rules & Assets */}
                  {((rel.governingRuleRefs && rel.governingRuleRefs.length > 0) ||
                    (rel.sharedAssetRefs && rel.sharedAssetRefs.length > 0)) && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                      {rel.governingRuleRefs?.map((ref, rIdx) => (
                        <span
                          key={`rel-rule-${rIdx}`}
                          style={{
                            fontSize: '0.7rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            backgroundColor: '#fffbeb',
                            color: '#b45309',
                            border: '1px solid #fde68a',
                            padding: '2px 6px',
                            borderRadius: '4px'
                          }}
                        >
                          <ShieldAlert size={11} />
                          {resolveEntityLabel(brand, ref, contentLanguage)}
                        </span>
                      ))}
                      {rel.sharedAssetRefs?.map((ref, aIdx) => (
                        <span
                          key={`rel-asset-${aIdx}`}
                          style={{
                            fontSize: '0.7rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            backgroundColor: '#ecfdf5',
                            color: '#047857',
                            border: '1px solid #a7f3d0',
                            padding: '2px 6px',
                            borderRadius: '4px'
                          }}
                        >
                          <Image size={11} />
                          {resolveEntityLabel(brand, ref, contentLanguage)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
