import React, { useState } from 'react';
import {
  Brand,
  Language,
  VisualRuleItem,
  RuleType,
  RuleContextCategory,
  EntityReference,
  getLocalizedText
} from '../../types/brand';
import { LocalizedTextarea } from '../ui/LocalizedInput';
import { ReferencePicker } from '../ui/ReferencePicker';
import { resolveEntityLabel } from '../../utils/entityResolver';
import { t } from '../../i18n/translations';
import {
  Plus,
  Search,
  Trash2,
  CheckCircle,
  AlertOctagon,
  HelpCircle,
  ShieldAlert,
  ChevronRight,
  Link,
  BookOpen,
  X
} from 'lucide-react';

interface VisualRulesEditorProps {
  data?: VisualRuleItem[];
  brand: Brand;
  uiLanguage: Language;
  contentLanguage: Language;
  onChange: (updatedRules: VisualRuleItem[]) => void;
}

const RULE_CONTEXTS: { context: RuleContextCategory; labelKey: string }[] = [
  { context: 'logo', labelKey: 'contextLogo' },
  { context: 'color', labelKey: 'contextColor' },
  { context: 'typography', labelKey: 'contextTypography' },
  { context: 'imagery', labelKey: 'contextImagery' },
  { context: 'graphicLanguage', labelKey: 'contextGraphicLanguage' },
  { context: 'layout', labelKey: 'contextLayout' },
  { context: 'general', labelKey: 'contextGeneral' }
];

const RULE_TYPES: { type: RuleType; labelKey: string; color: string; icon: any }[] = [
  { type: 'usage', labelKey: 'typeUsage', color: '#3b82f6', icon: CheckCircle },
  { type: 'restriction', labelKey: 'typeRestriction', color: '#ef4444', icon: AlertOctagon },
  { type: 'preference', labelKey: 'typePreference', color: '#8b5cf6', icon: HelpCircle },
  { type: 'requirement', labelKey: 'typeRequirement', color: '#10b981', icon: ShieldAlert }
];

export const VisualRulesEditor: React.FC<VisualRulesEditorProps> = ({
  data = [],
  brand,
  uiLanguage,
  contentLanguage,
  onChange
}) => {
  const rulesList = data;

  const [activeContextFilter, setActiveContextFilter] = useState<RuleContextCategory | 'all'>('all');
  const [activeTypeFilter, setActiveTypeFilter] = useState<RuleType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedRuleId, setSelectedRuleId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPickerModal, setShowPickerModal] = useState(false);

  // Form States for Rule Add / Edit
  const [ruleName, setRuleName] = useState('');
  const [ruleType, setRuleType] = useState<RuleType>('requirement');
  const [ruleContext, setRuleContext] = useState<RuleContextCategory>('logo');
  const [ruleGuidance, setRuleGuidance] = useState<any>(undefined);
  const [ruleTagsInput, setRuleTagsInput] = useState('');
  const [selectedReferences, setSelectedReferences] = useState<EntityReference[]>([]);

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleName.trim() || !ruleGuidance) return;

    const parsedTags = ruleTagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const newRule: VisualRuleItem = {
      id: 'rule-' + Date.now(),
      name: ruleName.trim(),
      type: ruleType,
      context: ruleContext,
      guidance: ruleGuidance,
      tags: parsedTags,
      references: selectedReferences,
      updatedAt: new Date().toISOString()
    };

    const updated = [...rulesList, newRule];
    onChange(updated);

    // Reset Form
    setRuleName('');
    setRuleGuidance(undefined);
    setRuleTagsInput('');
    setSelectedReferences([]);
    setShowAddModal(false);
    setSelectedRuleId(newRule.id);
  };

  const handleDeleteRule = (id: string, name: string) => {
    if (confirm(`Delete rule "${name}"?`)) {
      const updated = rulesList.filter((r) => r.id !== id);
      onChange(updated);
      if (selectedRuleId === id) setSelectedRuleId(null);
    }
  };

  const handleSelectReference = (ref: EntityReference) => {
    if (!selectedReferences.some((r) => r.entityId === ref.entityId && r.entityType === ref.entityType)) {
      setSelectedReferences([...selectedReferences, ref]);
    }
  };

  const handleRemoveReference = (entityId: string) => {
    setSelectedReferences(selectedReferences.filter((r) => r.entityId !== entityId));
  };

  const selectedRule = rulesList.find((r) => r.id === selectedRuleId);

  const filteredRules = rulesList.filter((rule) => {
    const matchesContext = activeContextFilter === 'all' || rule.context === activeContextFilter;
    const matchesType = activeTypeFilter === 'all' || rule.type === activeTypeFilter;
    const q = searchQuery.toLowerCase().trim();
    const guidanceText = getLocalizedText(rule.guidance, 'en').text.toLowerCase();
    const matchesQuery =
      !q ||
      rule.name.toLowerCase().includes(q) ||
      rule.context.toLowerCase().includes(q) ||
      rule.type.toLowerCase().includes(q) ||
      guidanceText.includes(q) ||
      (rule.tags && rule.tags.some((t) => t.toLowerCase().includes(q)));

    return matchesContext && matchesType && matchesQuery;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Editor Header */}
      <div className="editor-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 className="editor-title" style={{ fontSize: '1.25rem', fontWeight: 700 }}>
              {t('visualRulesTitle', uiLanguage)}
            </h2>
            <p className="editor-subtitle" style={{ marginTop: '2px' }}>
              {t('visualRulesSubtitle', uiLanguage)}
            </p>
          </div>

          <button
            className="btn btn-primary"
            onClick={() => {
              setShowAddModal(true);
              setSelectedRuleId(null);
            }}
          >
            <Plus size={16} /> {t('addRule', uiLanguage)}
          </button>
        </div>

        {/* Search & Filter Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '20px' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Search Box */}
            <div style={{ position: 'relative', width: '260px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="form-control"
                style={{ paddingLeft: '36px', fontSize: '0.86rem' }}
                placeholder={t('searchRulesPlaceholder', uiLanguage)}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Context Filters */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setActiveContextFilter('all')}
                className={`btn ${activeContextFilter === 'all' ? 'btn-accent' : 'btn-secondary'} btn-sm`}
                style={{ fontSize: '0.8rem' }}
              >
                {t('allRulesFilter', uiLanguage)} ({rulesList.length})
              </button>
              {RULE_CONTEXTS.map((rc) => {
                const count = rulesList.filter((r) => r.context === rc.context).length;
                return (
                  <button
                    key={rc.context}
                    type="button"
                    onClick={() => setActiveContextFilter(rc.context)}
                    className={`btn ${activeContextFilter === rc.context ? 'btn-accent' : 'btn-secondary'} btn-sm`}
                    style={{ fontSize: '0.8rem' }}
                  >
                    {t(rc.labelKey, uiLanguage)} {count > 0 ? `(${count})` : ''}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Rule Type Sub-Filter */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', borderTop: '1px solid var(--border-light)', paddingTop: '10px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Rule Type:
            </span>
            <button
              type="button"
              onClick={() => setActiveTypeFilter('all')}
              style={{
                fontSize: '0.78rem',
                fontWeight: activeTypeFilter === 'all' ? 700 : 400,
                color: activeTypeFilter === 'all' ? 'var(--accent-primary)' : 'var(--text-subtle)',
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {t('allRulesFilter', uiLanguage)}
            </button>
            {RULE_TYPES.map((rt) => (
              <button
                key={rt.type}
                type="button"
                onClick={() => setActiveTypeFilter(rt.type)}
                style={{
                  fontSize: '0.78rem',
                  fontWeight: activeTypeFilter === rt.type ? 700 : 400,
                  color: activeTypeFilter === rt.type ? rt.color : 'var(--text-subtle)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: rt.color }} />
                {t(rt.labelKey, uiLanguage)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Add Rule Modal / Form */}
      {showAddModal && (
        <div className="editor-card" style={{ padding: '24px', border: '2px solid var(--accent-primary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{t('addRule', uiLanguage)}</h3>
            <button className="btn-icon" onClick={() => setShowAddModal(false)}>
              ✕
            </button>
          </div>

          <form onSubmit={handleCreateRule} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">{t('ruleNameLabel', uiLanguage)}</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder={t('ruleNamePlaceholder', uiLanguage)}
                  value={ruleName}
                  onChange={(e) => setRuleName(e.target.value)}
                  autoFocus
                  required
                />
              </div>

              <div>
                <label className="form-label">{t('ruleContextLabel', uiLanguage)}</label>
                <select
                  className="form-control"
                  value={ruleContext}
                  onChange={(e) => setRuleContext(e.target.value as RuleContextCategory)}
                >
                  {RULE_CONTEXTS.map((rc) => (
                    <option key={rc.context} value={rc.context}>
                      {t(rc.labelKey, uiLanguage)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="form-label" style={{ fontWeight: 600 }}>{t('ruleTypeLabel', uiLanguage)}</label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
                {RULE_TYPES.map((rt) => {
                  const isSelected = ruleType === rt.type;
                  return (
                    <button
                      key={rt.type}
                      type="button"
                      onClick={() => setRuleType(rt.type)}
                      style={{
                        padding: '8px 14px',
                        borderRadius: 'var(--radius-sm)',
                        border: isSelected ? `2px solid ${rt.color}` : '1px solid var(--border-light)',
                        backgroundColor: isSelected ? 'var(--bg-muted)' : 'var(--bg-card)',
                        color: isSelected ? rt.color : 'var(--text-main)',
                        fontSize: '0.84rem',
                        fontWeight: isSelected ? 700 : 400,
                        cursor: 'pointer'
                      }}
                    >
                      {t(rt.labelKey, uiLanguage)}
                    </button>
                  );
                })}
              </div>
            </div>

            <LocalizedTextarea
              label={t('ruleGuidanceLabel', uiLanguage)}
              placeholder={t('ruleGuidancePlaceholder', uiLanguage)}
              rows={3}
              value={ruleGuidance}
              contentLanguage={contentLanguage}
              onChange={setRuleGuidance}
            />

            <div className="form-group">
              <label className="form-label">{t('tagsLabel', uiLanguage)}</label>
              <input
                type="text"
                className="form-control"
                placeholder={t('tagsPlaceholder', uiLanguage)}
                value={ruleTagsInput}
                onChange={(e) => setRuleTagsInput(e.target.value)}
              />
            </div>

            {/* Reference Attachment Sub-Section */}
            <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label className="form-label" style={{ fontWeight: 600, marginBottom: 0 }}>
                  {t('attachedReferences', uiLanguage)} ({selectedReferences.length})
                </label>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setShowPickerModal(true)}
                  style={{ fontSize: '0.78rem' }}
                >
                  <Plus size={14} /> {t('attachReference', uiLanguage)}
                </button>
              </div>

              {selectedReferences.length > 0 ? (
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {selectedReferences.map((ref) => (
                    <span
                      key={`${ref.entityType}-${ref.entityId}`}
                      className="badge badge-secondary"
                      style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Link size={12} />
                      <span>
                        {ref.entityType}: {resolveEntityLabel(brand, ref, contentLanguage)}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveReference(ref.entityId)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 2px', display: 'flex', alignItems: 'center' }}
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {t('noReferencesAttached', uiLanguage)}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                {t('cancel', uiLanguage)}
              </button>
              <button type="submit" className="btn btn-accent" disabled={!ruleName.trim() || !ruleGuidance}>
                {t('create', uiLanguage)}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Rules Grid & Detail Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: filteredRules.length > 0 ? 'repeat(auto-fill, minmax(280px, 1fr))' : '1fr', gap: '16px' }}>
        {filteredRules.length === 0 ? (
          <div className="editor-card" style={{ padding: '48px 24px', textAlign: 'center' }}>
            <BookOpen size={32} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600 }}>{t('noRulesTitle', uiLanguage)}</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-subtle)', marginBottom: '20px' }}>
              {t('noRulesSubtitle', uiLanguage)}
            </p>
            <button className="btn btn-accent" onClick={() => setShowAddModal(true)}>
              <Plus size={16} /> {t('addRule', uiLanguage)}
            </button>
          </div>
        ) : (
          filteredRules.map((rule) => {
            const isSelected = selectedRuleId === rule.id;
            const typeConfig = RULE_TYPES.find((rt) => rt.type === rule.type) || RULE_TYPES[0];
            const TypeIcon = typeConfig.icon;
            const contextLabelKey = RULE_CONTEXTS.find((rc) => rc.context === rule.context)?.labelKey || 'contextGeneral';

            return (
              <div
                key={rule.id}
                onClick={() => setSelectedRuleId(isSelected ? null : rule.id)}
                style={{
                  padding: '18px',
                  borderRadius: 'var(--radius-md)',
                  border: isSelected ? '2px solid var(--accent-primary)' : '1px solid var(--border-light)',
                  backgroundColor: 'var(--bg-card)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  borderLeft: `4px solid ${typeConfig.color}`
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {rule.name}
                  </h4>
                  <ChevronRight size={16} style={{ color: isSelected ? 'var(--accent-primary)' : 'var(--border-medium)' }} />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      color: typeConfig.color,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <TypeIcon size={12} /> {t(typeConfig.labelKey, uiLanguage)}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>·</span>
                  <span className="badge badge-secondary" style={{ fontSize: '0.7rem' }}>
                    {t(contextLabelKey, uiLanguage)}
                  </span>
                </div>

                <p
                  style={{
                    fontSize: '0.88rem',
                    color: 'var(--text-subtle)',
                    lineHeight: 1.4,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
                  {getLocalizedText(rule.guidance, contentLanguage).text}
                </p>

                {rule.tags && rule.tags.length > 0 && (
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: 'auto' }}>
                    {rule.tags.map((tag, idx) => (
                      <span key={idx} className="badge badge-outline" style={{ fontSize: '0.7rem' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Selected Rule Detail Panel */}
      {selectedRule && (
        <div className="editor-card" style={{ padding: '24px', borderTop: '2px solid var(--accent-primary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid var(--border-light)', paddingBottom: '14px' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{selectedRule.name}</h3>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
                <span className="badge badge-secondary" style={{ fontSize: '0.75rem' }}>
                  {t(RULE_CONTEXTS.find((rc) => rc.context === selectedRule.context)?.labelKey || 'contextGeneral', uiLanguage)}
                </span>
                <span className="badge badge-outline" style={{ fontSize: '0.75rem', fontWeight: 700, color: RULE_TYPES.find((rt) => rt.type === selectedRule.type)?.color }}>
                  {t(RULE_TYPES.find((rt) => rt.type === selectedRule.type)?.labelKey || 'typeRequirement', uiLanguage)}
                </span>
              </div>
            </div>

            <button
              className="btn-icon"
              style={{ color: '#ef4444' }}
              title="Delete Rule"
              onClick={() => handleDeleteRule(selectedRule.id, selectedRule.name)}
            >
              <Trash2 size={16} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <h4 style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px' }}>
                {t('ruleGuidanceLabel', uiLanguage)}
              </h4>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                {getLocalizedText(selectedRule.guidance, contentLanguage).text}
              </p>
            </div>

            {selectedRule.references && selectedRule.references.length > 0 && (
              <div>
                <h4 style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  {t('attachedReferences', uiLanguage)}
                </h4>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {selectedRule.references.map((ref, idx) => (
                    <span key={idx} className="badge badge-secondary" style={{ fontSize: '0.8rem' }}>
                      <Link size={12} style={{ marginRight: '4px' }} />
                      {ref.entityType}: {resolveEntityLabel(brand, ref, contentLanguage)}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reference Picker Modal */}
      {showPickerModal && (
        <ReferencePicker
          brand={brand}
          uiLanguage={uiLanguage}
          selectedEntityIds={selectedReferences.map((r) => r.entityId)}
          onSelect={handleSelectReference}
          onClose={() => setShowPickerModal(false)}
        />
      )}
    </div>
  );
};
