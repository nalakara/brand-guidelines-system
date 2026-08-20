import React, { useState } from 'react';
import {
  Brand,
  EntityReference,
  EntityDomain,
  EntityType,
  Language
} from '../../types/brand';
import { getAvailableEntities } from '../../utils/entityResolver';
import { t } from '../../i18n/translations';
import { Search, X, Link, Layers, Check } from 'lucide-react';

interface ReferencePickerProps {
  brand: Brand;
  uiLanguage: Language;
  filterDomain?: EntityDomain;
  filterType?: EntityType;
  allowedEntityTypes?: EntityType[];
  allowedDomains?: EntityDomain[];
  selectedEntityIds?: string[];
  onSelect: (reference: EntityReference) => void;
  onClose: () => void;
  title?: string;
}

const DOMAIN_TABS: { domain?: EntityDomain; labelKey: string }[] = [
  { domain: undefined, labelKey: 'allRulesFilter' },
  { domain: 'foundation', labelKey: 'pickerDomainFoundation' },
  { domain: 'visualKnowledge', labelKey: 'pickerDomainVisualKnowledge' },
  { domain: 'visualAssets', labelKey: 'pickerDomainVisualAssets' },
  { domain: 'visualRules', labelKey: 'pickerDomainVisualRules' },
  { domain: 'brandExpression', labelKey: 'pickerDomainBrandExpression' }
];

export const ReferencePicker: React.FC<ReferencePickerProps> = ({
  brand,
  uiLanguage,
  filterDomain,
  filterType,
  allowedEntityTypes,
  allowedDomains,
  selectedEntityIds = [],
  onSelect,
  onClose,
  title
}) => {
  const [activeDomain, setActiveDomain] = useState<EntityDomain | undefined>(filterDomain);
  const [searchQuery, setSearchQuery] = useState('');

  const allEntities = getAvailableEntities(brand, activeDomain, filterType);

  const filteredEntities = allEntities.filter((item) => {
    if (allowedEntityTypes && allowedEntityTypes.length > 0) {
      if (!allowedEntityTypes.includes(item.reference.entityType)) return false;
    }
    if (allowedDomains && allowedDomains.length > 0) {
      if (!allowedDomains.includes(item.reference.domain)) return false;
    }
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      item.name.toLowerCase().includes(q) ||
      item.reference.entityType.toLowerCase().includes(q) ||
      (item.categoryOrRole && item.categoryOrRole.toLowerCase().includes(q))
    );
  });

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.55)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1100,
        backdropFilter: 'blur(2px)'
      }}
    >
      <div
        className="editor-card"
        style={{
          width: '540px',
          maxHeight: '80vh',
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-xl)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link size={18} style={{ color: 'var(--accent-primary)' }} />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
              {title || t('attachReference', uiLanguage)}
            </h3>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Search & Domain Filter Bar */}
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ position: 'relative' }}>
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }}
            />
            <input
              type="text"
              className="form-control"
              style={{ paddingLeft: '36px', fontSize: '0.86rem' }}
              placeholder={t('searchEntitiesPlaceholder', uiLanguage)}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          </div>

          {!filterDomain && (
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {DOMAIN_TABS.map((tab, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveDomain(tab.domain)}
                  className={`btn ${activeDomain === tab.domain ? 'btn-accent' : 'btn-secondary'} btn-sm`}
                  style={{ fontSize: '0.76rem', padding: '4px 10px' }}
                >
                  {t(tab.labelKey, uiLanguage)}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Entity List */}
        <div style={{ padding: '12px 20px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {filteredEntities.length === 0 ? (
            <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Layers size={28} style={{ margin: '0 auto 8px', opacity: 0.5 }} />
              <p style={{ fontSize: '0.88rem' }}>{t('noEntitiesFound', uiLanguage)}</p>
            </div>
          ) : (
            filteredEntities.map((item) => {
              const isSelected = selectedEntityIds.includes(item.reference.entityId);

              return (
                <div
                  key={`${item.reference.entityType}-${item.reference.entityId}`}
                  onClick={() => {
                    onSelect(item.reference);
                    onClose();
                  }}
                  style={{
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: isSelected ? '1.5px solid var(--accent-primary)' : '1px solid var(--border-light)',
                    backgroundColor: isSelected ? 'var(--accent-light)' : 'var(--bg-card)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {item.preview && item.reference.entityType === 'color' ? (
                      <span
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '4px',
                          backgroundColor: item.preview,
                          border: '1px solid var(--border-light)'
                        }}
                      />
                    ) : item.preview && item.reference.entityType === 'asset' ? (
                      <img
                        src={item.preview}
                        alt=""
                        style={{ width: '24px', height: '24px', objectFit: 'contain', borderRadius: '2px' }}
                      />
                    ) : null}

                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'flex', gap: '6px', alignItems: 'center', marginTop: '2px' }}>
                        <span className="badge badge-secondary" style={{ fontSize: '0.68rem', padding: '1px 6px' }}>
                          {item.reference.domain}
                        </span>
                        <span>·</span>
                        <span>{item.categoryOrRole || item.reference.entityType}</span>
                      </div>
                    </div>
                  </div>

                  {isSelected && <Check size={16} style={{ color: 'var(--accent-primary)' }} />}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
