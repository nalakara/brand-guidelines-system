import React from 'react';
import {
  Brand,
  TouchpointEntity,
  Language,
  getLocalizedText
} from '../../../types/brand';
import { resolveEntityLabel } from '../../../utils/entityResolver';
import { t } from '../../../i18n/translations';
import { Edit2, ShieldAlert, FileText, Palette } from 'lucide-react';

interface PreviewExpressionProps {
  brand: Brand;
  contentLanguage: Language;
  onJumpToModule: (moduleId: any) => void;
  sectionNumber: number;
}

export const PreviewExpression: React.FC<PreviewExpressionProps> = ({
  brand,
  contentLanguage,
  onJumpToModule,
  sectionNumber
}) => {
  const expression = brand.modules.brandExpression;
  if (!expression || !expression.touchpoints || expression.touchpoints.length === 0) {
    return null;
  }

  const overviewRes = getLocalizedText(expression.overview, contentLanguage);

  return (
    <section className="doc-section" id="section-brandExpression">
      <div className="doc-section-header">
        <h2 className="doc-section-title">
          <span className="doc-section-num">0{sectionNumber}</span> {t('brandExpressionTitle', contentLanguage)}
        </h2>
        <button className="btn-jump-edit" onClick={() => onJumpToModule('brandExpression')}>
          <Edit2 size={13} /> {t('editSection', contentLanguage) || 'Edit Section'}
        </button>
      </div>

      {overviewRes.text && (
        <p style={{ fontSize: '1rem', color: '#475569', lineHeight: 1.6, marginBottom: '24px' }}>
          {overviewRes.text}
        </p>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {expression.touchpoints.map((tp: TouchpointEntity) => {
          const nameRes = getLocalizedText(tp.name, contentLanguage);
          const descRes = getLocalizedText(tp.description, contentLanguage);
          const doRes = getLocalizedText(tp.guidelines?.doCopy, contentLanguage);
          const dontRes = getLocalizedText(tp.guidelines?.dontCopy, contentLanguage);
          const matRes = getLocalizedText(tp.specifications?.materialsFinish, contentLanguage);
          const prodRes = getLocalizedText(tp.specifications?.productionNotes, contentLanguage);

          return (
            <div
              key={tp.id}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-md)',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
              }}
            >
              {/* Card Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {nameRes.text || 'Touchpoint'}
                  </h3>
                  <div style={{ display: 'flex', gap: '6px', marginTop: '4px', alignItems: 'center' }}>
                    <span
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        backgroundColor: 'var(--accent-light)',
                        color: 'var(--accent-primary)',
                        padding: '2px 8px',
                        borderRadius: '4px'
                      }}
                    >
                      {t(`touchpointCategory${tp.category.charAt(0).toUpperCase() + tp.category.slice(1)}`, contentLanguage) || tp.category}
                    </span>
                    {tp.channelContext && (
                      <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                        • {tp.channelContext}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {descRes.text && (
                <p style={{ fontSize: '0.86rem', color: '#334155', lineHeight: 1.5, margin: 0 }}>
                  {descRes.text}
                </p>
              )}

              {/* Specifications Block */}
              {tp.specifications && (
                <div
                  style={{
                    backgroundColor: '#f8fafc',
                    padding: '12px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8rem',
                    color: '#475569',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                >
                  <div style={{ fontWeight: 600, textTransform: 'uppercase', fontSize: '0.7rem', color: '#64748b', marginBottom: '2px' }}>
                    {t('touchpointSpecsTitle', contentLanguage)}
                  </div>
                  {tp.specifications.dimensions && (
                    <div><strong>{t('dimensionsLabel', contentLanguage)}:</strong> {tp.specifications.dimensions}</div>
                  )}
                  {tp.specifications.colorSpace && (
                    <div><strong>{t('colorSpaceLabel', contentLanguage)}:</strong> {tp.specifications.colorSpace}</div>
                  )}
                  {matRes.text && (
                    <div><strong>{t('materialsFinishLabel', contentLanguage)}:</strong> {matRes.text}</div>
                  )}
                  {tp.specifications.safeZonePadding && (
                    <div><strong>{t('safeZonePaddingLabel', contentLanguage)}:</strong> {tp.specifications.safeZonePadding}</div>
                  )}
                  {prodRes.text && (
                    <div style={{ color: '#0369a1' }}><strong>{t('productionNotesLabel', contentLanguage)}:</strong> {prodRes.text}</div>
                  )}
                </div>
              )}

              {/* Do / Don't Guidance */}
              {(doRes.text || dontRes.text) && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.78rem' }}>
                  {doRes.text && (
                    <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '8px', borderRadius: '4px', color: '#166534' }}>
                      <div style={{ fontWeight: 700, marginBottom: '2px' }}>✓ DO</div>
                      {doRes.text}
                    </div>
                  )}
                  {dontRes.text && (
                    <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', padding: '8px', borderRadius: '4px', color: '#991b1b' }}>
                      <div style={{ fontWeight: 700, marginBottom: '2px' }}>✗ DON'T</div>
                      {dontRes.text}
                    </div>
                  )}
                </div>
              )}

              {/* Semantic Reference Badges */}
              {((tp.appliedAssetRefs && tp.appliedAssetRefs.length > 0) ||
                (tp.appliedRuleRefs && tp.appliedRuleRefs.length > 0) ||
                (tp.governingEntityRefs && tp.governingEntityRefs.length > 0)) && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', paddingTop: '6px', borderTop: '1px solid var(--border-light)' }}>
                  {tp.appliedAssetRefs?.map((ref, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontSize: '0.7rem',
                        backgroundColor: '#f1f5f9',
                        color: '#334155',
                        padding: '2px 6px',
                        borderRadius: '3px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <FileText size={11} /> {resolveEntityLabel(brand, ref, contentLanguage)}
                    </span>
                  ))}
                  {tp.appliedRuleRefs?.map((ref, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontSize: '0.7rem',
                        backgroundColor: '#fef3c7',
                        color: '#92400e',
                        padding: '2px 6px',
                        borderRadius: '3px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <ShieldAlert size={11} /> {resolveEntityLabel(brand, ref, contentLanguage)}
                    </span>
                  ))}
                  {tp.governingEntityRefs?.map((ref, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontSize: '0.7rem',
                        backgroundColor: '#eff6ff',
                        color: '#1d4ed8',
                        padding: '2px 6px',
                        borderRadius: '3px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Palette size={11} /> {resolveEntityLabel(brand, ref, contentLanguage)}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
