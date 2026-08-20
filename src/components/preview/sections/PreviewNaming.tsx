import React from 'react';
import {
  Brand,
  Language,
  NamingSystemEntity,
  getLocalizedText
} from '../../../types/brand';
import { resolveEntityLabel } from '../../../utils/entityResolver';
import { t } from '../../../i18n/translations';
import { Edit2, Tag, ShieldAlert, Users, Megaphone, CheckCircle, XCircle } from 'lucide-react';

interface PreviewNamingProps {
  brand: Brand;
  contentLanguage: Language;
  onJumpToModule?: (moduleId: any) => void;
  sectionNumber: number;
}

export const PreviewNaming: React.FC<PreviewNamingProps> = ({
  brand,
  contentLanguage,
  onJumpToModule,
  sectionNumber
}) => {
  const namingData = brand.modules.brandNaming;
  if (!namingData) return null;

  const { principlesOverview, systems = [] } = namingData;
  const overviewText = getLocalizedText(principlesOverview, contentLanguage).text;

  return (
    <section className="preview-section" id="section-brandNaming">
      <div className="section-header">
        <div className="section-title-wrap">
          <span className="section-num">{String(sectionNumber).padStart(2, '0')}</span>
          <h2>{t('domainBrandNaming', contentLanguage)}</h2>
        </div>
        {onJumpToModule && (
          <button
            className="edit-module-btn"
            onClick={() => onJumpToModule('brandNaming')}
            title="Edit Brand Naming"
          >
            <Edit2 size={16} />
            <span>Edit</span>
          </button>
        )}
      </div>

      <p className="section-lead">
        {overviewText ||
          (contentLanguage === 'id'
            ? 'Taksonomi penamaan terstruktur, formula tata bahasa, serta panduan contoh yang disetujui dan dilarang.'
            : 'Structured naming taxonomy, grammar formulas, and approved/prohibited governance examples.')}
      </p>

      {systems.length === 0 ? (
        <div className="empty-preview-msg">
          <Tag size={24} />
          <p>{t('noNamingSystemsEmpty', contentLanguage)}</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', marginTop: '24px' }}>
          {systems.map((sys: NamingSystemEntity) => {
            const title = getLocalizedText(sys.title, contentLanguage).text || 'Naming System';
            const principles = getLocalizedText(sys.principles, contentLanguage).text;
            const rationale = getLocalizedText(sys.examples?.rationale, contentLanguage).text;

            return (
              <div
                key={sys.id}
                className="preview-card-elevated"
                style={{
                  background: 'var(--color-bg-secondary)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '12px',
                  padding: '24px'
                }}
              >
                {/* Header */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    borderBottom: '1px solid var(--color-border)',
                    paddingBottom: '14px',
                    marginBottom: '18px',
                    gap: '16px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          textTransform: 'uppercase',
                          fontWeight: 700,
                          letterSpacing: '0.5px',
                          background: 'var(--color-primary-light, rgba(217, 119, 6, 0.1))',
                          color: 'var(--color-primary)',
                          padding: '2px 8px',
                          borderRadius: '4px'
                        }}
                      >
                        {t(`tier${sys.tier.charAt(0).toUpperCase() + sys.tier.slice(1)}`, contentLanguage)}
                      </span>
                      <span
                        style={{
                          fontSize: '11px',
                          color: 'var(--color-text-secondary)',
                          background: 'var(--color-bg-tertiary)',
                          padding: '2px 8px',
                          borderRadius: '4px'
                        }}
                      >
                        {t(`approach${sys.approach.charAt(0).toUpperCase() + sys.approach.slice(1)}`, contentLanguage)}
                      </span>
                    </div>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>{title}</h3>
                  </div>
                </div>

                {/* Principles */}
                {principles && (
                  <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', fontStyle: 'italic', marginBottom: '18px' }}>
                    "{principles}"
                  </p>
                )}

                {/* Formula Visual Flow */}
                {sys.formula && sys.formula.length > 0 && (
                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
                      {t('namingFormulaTitle', contentLanguage)}
                    </h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                      {sys.formula.map((step, sIdx) => {
                        const stepLabel = getLocalizedText(step.label, contentLanguage).text;
                        return (
                          <React.Fragment key={sIdx}>
                            {sIdx > 0 && <span style={{ color: 'var(--color-text-secondary)', fontWeight: 600 }}>+</span>}
                            <div
                              style={{
                                background: 'var(--color-bg-primary)',
                                border: '1px solid var(--color-border)',
                                borderRadius: '6px',
                                padding: '6px 12px',
                                fontSize: '13px',
                                fontWeight: step.required ? 600 : 400
                              }}
                            >
                              <span>{stepLabel || `[Step ${sIdx + 1}]`}</span>
                              {!step.required && (
                                <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)', marginLeft: '6px' }}>
                                  ({t('optionalTag', contentLanguage)})
                                </span>
                              )}
                            </div>
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Approved vs Prohibited Examples */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '18px' }}>
                  {/* Approved */}
                  <div style={{ background: 'var(--color-bg-primary)', borderRadius: '8px', padding: '14px', border: '1px solid var(--color-border)' }}>
                    <h4 style={{ margin: '0 0 10px 0', fontSize: '12px', fontWeight: 600, color: 'var(--color-success, #16a34a)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle size={14} />
                      {t('approvedExamplesTitle', contentLanguage)}
                    </h4>
                    <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px' }}>
                      {(sys.examples?.approved || []).map((ex, idx) => (
                        <li key={idx} style={{ marginBottom: '4px' }}>
                          <strong>{ex}</strong>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Prohibited */}
                  <div style={{ background: 'var(--color-bg-primary)', borderRadius: '8px', padding: '14px', border: '1px solid var(--color-border)' }}>
                    <h4 style={{ margin: '0 0 10px 0', fontSize: '12px', fontWeight: 600, color: 'var(--color-danger, #dc2626)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <XCircle size={14} />
                      {t('prohibitedExamplesTitle', contentLanguage)}
                    </h4>
                    <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                      {(sys.examples?.prohibited || []).map((ex, idx) => (
                        <li key={idx} style={{ marginBottom: '4px', textDecoration: 'line-through' }}>
                          {ex}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Rationale */}
                {rationale && (
                  <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', background: 'var(--color-bg-primary)', padding: '8px 12px', borderRadius: '6px', borderLeft: '3px solid var(--color-primary)', marginBottom: '16px' }}>
                    <strong>{t('exampleRationaleLabel', contentLanguage)}:</strong> {rationale}
                  </p>
                )}

                {/* Attached References */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', borderTop: '1px solid var(--color-border)', paddingTop: '12px' }}>
                  {(sys.governingRuleRefs || []).map((ref) => (
                    <span
                      key={ref.entityId}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        background: 'var(--color-bg-primary)',
                        border: '1px solid var(--color-border)',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '11px'
                      }}
                    >
                      <ShieldAlert size={12} style={{ color: 'var(--color-primary)' }} />
                      <span>{resolveEntityLabel(brand, ref, contentLanguage)}</span>
                    </span>
                  ))}

                  {(sys.targetAudienceRefs || []).map((ref) => (
                    <span
                      key={ref.entityId}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        background: 'var(--color-bg-primary)',
                        border: '1px solid var(--color-border)',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '11px'
                      }}
                    >
                      <Users size={12} style={{ color: 'var(--color-info, #0284c7)' }} />
                      <span>{resolveEntityLabel(brand, ref, contentLanguage)}</span>
                    </span>
                  ))}

                  {(sys.supportingMessageRefs || []).map((ref) => (
                    <span
                      key={ref.entityId}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        background: 'var(--color-bg-primary)',
                        border: '1px solid var(--color-border)',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '11px'
                      }}
                    >
                      <Megaphone size={12} style={{ color: 'var(--color-success, #16a34a)' }} />
                      <span>{resolveEntityLabel(brand, ref, contentLanguage)}</span>
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
