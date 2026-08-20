import React from 'react';
import { Brand, ModuleId, Language, getLocalizedText } from '../../types/brand';
import { Edit2, CheckCircle2 } from 'lucide-react';
import { PreviewNaming } from './sections/PreviewNaming';
import { PreviewExpression } from './sections/PreviewExpression';
import '../../styles/preview.css';

interface GuidelinePreviewProps {
  brand: Brand;
  contentLanguage: Language;
  onJumpToModule: (moduleId: ModuleId) => void;
}

export const GuidelinePreview: React.FC<GuidelinePreviewProps> = ({
  brand,
  contentLanguage,
  onJumpToModule
}) => {
  const activeModuleIds = brand.activeModules || [];

  const getText = (field: any) => {
    return getLocalizedText(field, contentLanguage);
  };

  if (activeModuleIds.length === 0) {
    return (
      <div className="guideline-document" style={{ textAlign: 'center', padding: '64px 20px' }}>
        <h2 className="doc-brand-title">{brand.name}</h2>
        <p style={{ color: 'var(--text-subtle)', marginTop: '16px' }}>
          No modules are currently active for this brand guideline.
        </p>
      </div>
    );
  }

  let sectionCounter = 1;

  const tagline = getText(brand.modules.messaging?.tagline);
  const oneLiner = getText(brand.modules.overview?.oneLineDescription);

  return (
    <div className="guideline-document">
      {/* Document Top Header */}
      <div className="doc-header">
        <div>
          <h1 className="doc-brand-title">{brand.name}</h1>
          {tagline.text && <p className="doc-tagline">"{tagline.text}"</p>}
          {oneLiner.text && (
            <p style={{ color: '#475569', fontSize: '1.05rem', marginTop: '8px', maxWidth: '640px' }}>
              {oneLiner.text}
            </p>
          )}
        </div>
        <div className="doc-meta-badge">
          Brand Guidelines ({contentLanguage.toUpperCase()})
        </div>
      </div>

      {/* 1. Brand Overview Section */}
      {activeModuleIds.includes('overview') && brand.modules.overview && (
        <section className="doc-section" id="section-overview">
          <div className="doc-section-header">
            <h2 className="doc-section-title">
              <span className="doc-section-num">0{sectionCounter++}</span> Brand Overview
            </h2>
            <button className="btn-jump-edit" onClick={() => onJumpToModule('overview')}>
              <Edit2 size={13} /> Edit Section
            </button>
          </div>

          {(() => {
            const cat = getText(brand.modules.overview.category);
            return cat.text ? (
              <div className="doc-info-block">
                <div className="doc-info-label">Category / Industry</div>
                <div className="doc-info-val">
                  {cat.text} {cat.isFallback && <span className="fallback-badge">EN Fallback</span>}
                </div>
              </div>
            ) : null;
          })()}

          {(() => {
            const desc = getText(brand.modules.overview.longDescription);
            return desc.text ? (
              <p className="doc-lead-paragraph">
                {desc.text} {desc.isFallback && <span className="fallback-badge">EN Fallback</span>}
              </p>
            ) : null;
          })()}

          {brand.modules.overview.website && (
            <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
              <strong>Website:</strong>{' '}
              <a
                href={brand.modules.overview.website}
                target="_blank"
                rel="noreferrer"
                style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}
              >
                {brand.modules.overview.website}
              </a>
            </p>
          )}
        </section>
      )}

      {/* 2. Brand Strategy Section */}
      {activeModuleIds.includes('strategy') && brand.modules.strategy && (
        <section className="doc-section" id="section-strategy">
          <div className="doc-section-header">
            <h2 className="doc-section-title">
              <span className="doc-section-num">0{sectionCounter++}</span> Brand Strategy
            </h2>
            <button className="btn-jump-edit" onClick={() => onJumpToModule('strategy')}>
              <Edit2 size={13} /> Edit Section
            </button>
          </div>

          <div className="doc-grid-2">
            {(() => {
              const p = getText(brand.modules.strategy.purpose);
              return p.text ? (
                <div className="doc-info-block">
                  <div className="doc-info-label">Brand Purpose</div>
                  <div className="doc-info-val" style={{ fontWeight: 400, fontStyle: 'italic' }}>
                    "{p.text}"
                  </div>
                </div>
              ) : null;
            })()}

            {(() => {
              const m = getText(brand.modules.strategy.mission);
              return m.text ? (
                <div className="doc-info-block">
                  <div className="doc-info-label">Mission Statement</div>
                  <div className="doc-info-val" style={{ fontWeight: 400 }}>
                    {m.text}
                  </div>
                </div>
              ) : null;
            })()}
          </div>

          {(() => {
            const v = getText(brand.modules.strategy.vision);
            return v.text ? (
              <div className="doc-info-block" style={{ marginTop: '16px' }}>
                <div className="doc-info-label">Vision Statement</div>
                <div className="doc-info-val" style={{ fontWeight: 400 }}>
                  {v.text}
                </div>
              </div>
            ) : null;
          })()}

          {brand.modules.strategy.values && brand.modules.strategy.values.length > 0 && (
            <div style={{ marginTop: '28px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '14px', color: '#0f172a' }}>
                Core Values
              </h3>
              <div className="doc-values-grid">
                {brand.modules.strategy.values.map((val) => {
                  const tRes = getText(val.title);
                  const dRes = getText(val.description);
                  return (
                    <div key={val.id} className="doc-value-card">
                      <div className="doc-value-title">{tRes.text}</div>
                      <div className="doc-value-desc">{dRes.text}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {brand.modules.strategy.priorities && brand.modules.strategy.priorities.length > 0 && (
            <div style={{ marginTop: '28px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px', color: '#0f172a' }}>
                Strategic Priorities
              </h3>
              <ul style={{ paddingLeft: '20px', lineHeight: '1.8', color: '#334155' }}>
                {brand.modules.strategy.priorities.map((item, idx) => {
                  const titleRes = typeof item === 'object' && 'title' in item ? getText((item as any).title) : getText(item as any);
                  const descRes = typeof item === 'object' && 'description' in item ? getText((item as any).description) : null;
                  return (
                    <li key={idx}>
                      <strong>{titleRes.text}</strong>
                      {descRes?.text && <span style={{ color: '#64748b' }}> — {descRes.text}</span>}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </section>
      )}

      {/* 3. Positioning Section */}
      {activeModuleIds.includes('positioning') && brand.modules.positioning && (
        <section className="doc-section" id="section-positioning">
          <div className="doc-section-header">
            <h2 className="doc-section-title">
              <span className="doc-section-num">0{sectionCounter++}</span> Positioning
            </h2>
            <button className="btn-jump-edit" onClick={() => onJumpToModule('positioning')}>
              <Edit2 size={13} /> Edit Section
            </button>
          </div>

          {(() => {
            const stmt = getText(brand.modules.positioning.positioningStatement);
            return stmt.text ? (
              <div className="doc-info-block" style={{ backgroundColor: 'var(--accent-light)', borderColor: 'var(--accent-primary)', marginBottom: '28px' }}>
                <div className="doc-info-label" style={{ color: 'var(--accent-primary)' }}>Positioning Statement</div>
                <div className="doc-info-val" style={{ fontSize: '1.08rem', lineHeight: 1.6, fontWeight: 500 }}>
                  "{stmt.text}"
                </div>
              </div>
            ) : null;
          })()}

          <div className="doc-grid-2">
            {(() => {
              const audiences = brand.modules.positioning.targetAudiences;
              if (audiences && audiences.length > 0) {
                return (
                  <div>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: '8px' }}>
                      Target Audiences ({audiences.length})
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {audiences.map((aud) => {
                        const nameRes = getText(aud.name);
                        const descRes = getText(aud.description);
                        return (
                          <div key={aud.id} style={{ backgroundColor: '#f8fafc', padding: '8px 12px', borderRadius: 'var(--radius-sm)' }}>
                            <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>{nameRes.text}</div>
                            {descRes.text && <div style={{ fontSize: '0.84rem', color: '#64748b', marginTop: '2px' }}>{descRes.text}</div>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              }
              const aud = getText(brand.modules.positioning.targetAudience);
              return aud.text ? (
                <div>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: '8px' }}>
                    Target Audience
                  </h4>
                  <p className="doc-prose">{aud.text}</p>
                </div>
              ) : null;
            })()}
            {(() => {
              const prob = getText(brand.modules.positioning.coreProblem);
              return prob.text ? (
                <div>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: '8px' }}>
                    Core Problem Solved
                  </h4>
                  <p className="doc-prose">{prob.text}</p>
                </div>
              ) : null;
            })()}
          </div>

          {brand.modules.positioning.differentiators && brand.modules.positioning.differentiators.length > 0 && (
            <div style={{ marginTop: '24px' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: '12px' }}>
                Key Differentiators
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {brand.modules.positioning.differentiators.map((diff, idx) => {
                  const res = typeof diff === 'object' && 'title' in diff ? getText((diff as any).title) : getText(diff as any);
                  const evidenceRes = typeof diff === 'object' && 'evidence' in diff ? getText((diff as any).evidence) : null;
                  return (
                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', backgroundColor: '#f8fafc', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                      <CheckCircle2 size={16} color="var(--accent-teal)" style={{ marginTop: '3px', flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: '0.95rem', color: '#1e293b', fontWeight: 500 }}>{res.text}</div>
                        {evidenceRes?.text && <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>Evidence: {evidenceRes.text}</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      )}

      {/* 4. Personality Section */}
      {activeModuleIds.includes('personality') && brand.modules.personality && (
        <section className="doc-section" id="section-personality">
          <div className="doc-section-header">
            <h2 className="doc-section-title">
              <span className="doc-section-num">0{sectionCounter++}</span> Brand Personality
            </h2>
            <button className="btn-jump-edit" onClick={() => onJumpToModule('personality')}>
              <Edit2 size={13} /> Edit Section
            </button>
          </div>

          {brand.modules.personality.traits && brand.modules.personality.traits.length > 0 && (
            <div style={{ marginBottom: '28px' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: '12px' }}>
                Character Traits
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {brand.modules.personality.traits.map((tItem, idx) => {
                  const res = typeof tItem === 'object' && 'trait' in tItem ? getText((tItem as any).trait) : getText(tItem as any);
                  return (
                    <span key={idx} style={{ padding: '6px 16px', borderRadius: 'var(--radius-full)', backgroundColor: '#0f172a', color: '#ffffff', fontSize: '0.88rem', fontWeight: 600 }}>
                      {res.text}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Personality Sliders Display */}
          {brand.modules.personality.sliders && (
            <div style={{ marginBottom: '32px', backgroundColor: '#fafafa', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: '20px' }}>
                Personality Spectrum
              </h4>
              <div className="doc-slider-row">
                <div className="doc-slider-left">Classic</div>
                <div className="doc-slider-track-bg">
                  <div className="doc-slider-track-fill" style={{ width: `${brand.modules.personality.sliders.classicToModern}%` }} />
                </div>
                <div className="doc-slider-right">Modern</div>
              </div>
              <div className="doc-slider-row">
                <div className="doc-slider-left">Serious</div>
                <div className="doc-slider-track-bg">
                  <div className="doc-slider-track-fill" style={{ width: `${brand.modules.personality.sliders.seriousToPlayful}%` }} />
                </div>
                <div className="doc-slider-right">Playful</div>
              </div>
              <div className="doc-slider-row">
                <div className="doc-slider-left">Reserved</div>
                <div className="doc-slider-track-bg">
                  <div className="doc-slider-track-fill" style={{ width: `${brand.modules.personality.sliders.reservedToExpressive}%` }} />
                </div>
                <div className="doc-slider-right">Expressive</div>
              </div>
              <div className="doc-slider-row" style={{ marginBottom: 0 }}>
                <div className="doc-slider-left">Practical</div>
                <div className="doc-slider-track-bg">
                  <div className="doc-slider-track-fill" style={{ width: `${brand.modules.personality.sliders.practicalToVisionary}%` }} />
                </div>
                <div className="doc-slider-right">Visionary</div>
              </div>
            </div>
          )}

          {(() => {
            const arch = getText(brand.modules.personality.archetype);
            return arch.text ? (
              <div className="doc-info-block" style={{ marginBottom: '24px' }}>
                <div className="doc-info-label">Brand Archetype</div>
                <div className="doc-info-val">{arch.text}</div>
              </div>
            ) : null;
          })()}

          {brand.modules.personality.weAreWeAreNot && brand.modules.personality.weAreWeAreNot.length > 0 && (
            <div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: '12px' }}>
                We Are / We Are Not
              </h4>
              <div className="doc-pairs-grid">
                {brand.modules.personality.weAreWeAreNot.map((pair) => {
                  const areRes = getText(pair.weAre);
                  const notRes = getText(pair.weAreNot);
                  return (
                    <div key={pair.id} className="doc-pair-card">
                      <div className="doc-pair-are">✓ {areRes.text}</div>
                      <div className="doc-pair-not">✕ {notRes.text}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      )}

      {/* 5. Voice & Tone Section */}
      {activeModuleIds.includes('voiceTone') && brand.modules.voiceTone && (
        <section className="doc-section" id="section-voiceTone">
          <div className="doc-section-header">
            <h2 className="doc-section-title">
              <span className="doc-section-num">0{sectionCounter++}</span> Voice & Tone
            </h2>
            <button className="btn-jump-edit" onClick={() => onJumpToModule('voiceTone')}>
              <Edit2 size={13} /> Edit Section
            </button>
          </div>

          {(() => {
            const tone = getText(brand.modules.voiceTone.toneGuidelines);
            return tone.text ? <p className="doc-lead-paragraph">{tone.text}</p> : null;
          })()}

          {brand.modules.voiceTone.principles && brand.modules.voiceTone.principles.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: '12px' }}>
                Voice Principles
              </h4>
              <ul style={{ paddingLeft: '20px', lineHeight: 1.8, color: '#1e293b' }}>
                {brand.modules.voiceTone.principles.map((p, idx) => {
                  const res = typeof p === 'object' && 'title' in p ? getText((p as any).title) : getText(p as any);
                  return <li key={idx} style={{ fontWeight: 500 }}>{res.text}</li>;
                })}
              </ul>
            </div>
          )}

          {/* Writing Examples */}
          {brand.modules.voiceTone.examples && brand.modules.voiceTone.examples.length > 0 && (
            <div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: '12px' }}>
                Copy Rewriting Examples
              </h4>
              {brand.modules.voiceTone.examples.map((ex) => {
                const ctx = getText(ex.context);
                const bef = getText(ex.before);
                const aft = getText(ex.after);
                return (
                  <div key={ex.id} className="doc-example-box">
                    {ctx.text && <div className="doc-example-context">{ctx.text}</div>}
                    <div className="doc-example-split">
                      <div className="doc-example-before">
                        <strong style={{ display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', marginBottom: '4px' }}>Off-Brand</strong>
                        "{bef.text}"
                      </div>
                      <div className="doc-example-after">
                        <strong style={{ display: 'block', fontSize: '0.72rem', textTransform: 'uppercase', marginBottom: '4px' }}>On-Brand</strong>
                        "{aft.text}"
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* 6. Visual Basics & Logo Variant Placeholders Section */}
      {activeModuleIds.includes('visualBasics') && brand.modules.visualBasics && (
        <section className="doc-section" id="section-visualBasics">
          <div className="doc-section-header">
            <h2 className="doc-section-title">
              <span className="doc-section-num">0{sectionCounter++}</span> Visual Basics & Logo Variants
            </h2>
            <button className="btn-jump-edit" onClick={() => onJumpToModule('visualBasics')}>
              <Edit2 size={13} /> Edit Section
            </button>
          </div>

          {(() => {
            const logoUsage = getText(brand.modules.visualBasics.logoUsageNotes);
            return logoUsage.text ? (
              <div className="doc-info-block" style={{ marginBottom: '28px' }}>
                <div className="doc-info-label">Logo Usage Guidance</div>
                <div className="doc-info-val" style={{ fontWeight: 400 }}>{logoUsage.text}</div>
              </div>
            ) : null;
          })()}

          {/* Logo Variant Placeholders Display */}
          {brand.modules.visualBasics.logoVariants && brand.modules.visualBasics.logoVariants.length > 0 && (
            <div style={{ marginBottom: '32px' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: '16px' }}>
                Logo Variant Placeholders
              </h4>
              <div className="doc-logo-variants-grid">
                {brand.modules.visualBasics.logoVariants.map((variant) => {
                  const nameRes = getText(variant.name);
                  const usageRes = getText(variant.usageNotes);
                  return (
                    <div key={variant.id} className="doc-logo-variant-card">
                      <div
                        className="doc-logo-stage"
                        style={{ backgroundColor: variant.recommendedBg || '#ffffff' }}
                      >
                        <div className="doc-logo-placeholder-text">{nameRes.text}</div>
                      </div>
                      <div className="doc-logo-meta">
                        <div className="doc-logo-name">{nameRes.text}</div>
                        <div className="doc-logo-badge">{variant.variantKey}</div>
                        {usageRes.text && <div className="doc-logo-usage">{usageRes.text}</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Color Palettes */}
          {brand.modules.visualBasics.primaryColors && brand.modules.visualBasics.primaryColors.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: '12px' }}>
                Primary Color Palette
              </h4>
              <div className="doc-colors-flex">
                {brand.modules.visualBasics.primaryColors.map((c) => {
                  const nameRes = getText(c.name);
                  const usageRes = getText(c.usage);
                  return (
                    <div key={c.id} className="doc-color-swatch-box">
                      <div className="doc-swatch-rect" style={{ backgroundColor: c.hex }} />
                      <div className="doc-swatch-meta">
                        <div className="doc-swatch-name">{nameRes.text}</div>
                        <div className="doc-swatch-hex">{c.hex}</div>
                        {usageRes.text && <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>{usageRes.text}</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Secondary Color Palettes */}
          {brand.modules.visualBasics.secondaryColors && brand.modules.visualBasics.secondaryColors.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: '12px' }}>
                Secondary & Supporting Colors
              </h4>
              <div className="doc-colors-flex">
                {brand.modules.visualBasics.secondaryColors.map((c) => {
                  const nameRes = getText(c.name);
                  const usageRes = getText(c.usage);
                  return (
                    <div key={c.id} className="doc-color-swatch-box">
                      <div className="doc-swatch-rect" style={{ backgroundColor: c.hex }} />
                      <div className="doc-swatch-meta">
                        <div className="doc-swatch-name">{nameRes.text}</div>
                        <div className="doc-swatch-hex">{c.hex}</div>
                        {usageRes.text && <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>{usageRes.text}</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Typography System */}
          {(() => {
            const typo = getText(brand.modules.visualBasics.typographyNotes);
            return typo.text ? (
              <div className="doc-info-block" style={{ marginTop: '20px', marginBottom: '24px' }}>
                <div className="doc-info-label">Typography Direction</div>
                <div className="doc-info-val" style={{ fontWeight: 400 }}>{typo.text}</div>
              </div>
            ) : null;
          })()}

          {brand.modules.visualBasics.fonts && brand.modules.visualBasics.fonts.length > 0 && (
            <div style={{ marginBottom: '28px' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: '12px' }}>
                Brand Font Families ({brand.modules.visualBasics.fonts.length})
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
                {brand.modules.visualBasics.fonts.map((f) => (
                  <div key={f.id} style={{ backgroundColor: '#f8fafc', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a' }}>{f.name}</div>
                      <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 600, backgroundColor: 'var(--accent-light)', color: 'var(--accent-primary)', padding: '2px 8px', borderRadius: '4px' }}>
                        {f.role}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>
                      Weights: {f.weights?.join(', ') || 'Regular'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {brand.modules.visualBasics.typeStyles && brand.modules.visualBasics.typeStyles.length > 0 && (
            <div style={{ marginBottom: '28px' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: '12px' }}>
                Type Hierarchy & Styles ({brand.modules.visualBasics.typeStyles.length})
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {brand.modules.visualBasics.typeStyles.map((ts) => {
                  const sampleRes = getText(ts.sampleText);
                  return (
                    <div key={ts.id} style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-light)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#0f172a' }}>{ts.name}</div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                          {ts.sizePx}px / {ts.lineHeight} line-height • {ts.weight} weight • {ts.category}
                        </div>
                      </div>
                      {sampleRes.text && (
                        <div style={{ fontSize: '0.86rem', color: '#475569', fontStyle: 'italic', maxWidth: '40%' }}>
                          "{sampleRes.text}"
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Grid Systems Display */}
          {brand.modules.visualBasics.layoutComposition?.gridSystems && brand.modules.visualBasics.layoutComposition.gridSystems.length > 0 && (
            <div style={{ marginBottom: '28px' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: '12px' }}>
                Grid Systems ({brand.modules.visualBasics.layoutComposition.gridSystems.length})
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
                {brand.modules.visualBasics.layoutComposition.gridSystems.map((grid) => {
                  const gName = getText(grid.name);
                  const gDesc = getText(grid.description);
                  return (
                    <div key={grid.id} style={{ backgroundColor: '#f8fafc', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.92rem', color: '#0f172a' }}>{gName.text}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--accent-primary)', fontWeight: 600, marginTop: '2px' }}>
                        {grid.type?.toUpperCase()} {grid.columns ? `• ${grid.columns} cols` : ''} {grid.gutterPx ? `• ${grid.gutterPx}px gutter` : ''}
                      </div>
                      {gDesc.text && <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '6px' }}>{gDesc.text}</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Imagery Directions Display */}
          {brand.modules.visualBasics.imagery?.directions && brand.modules.visualBasics.imagery.directions.length > 0 && (
            <div style={{ marginBottom: '28px' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: '12px' }}>
                Imagery & Photography Directions ({brand.modules.visualBasics.imagery.directions.length})
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                {brand.modules.visualBasics.imagery.directions.map((dir) => {
                  const dName = getText(dir.name);
                  const dDesc = getText(dir.description);
                  const doRes = getText(dir.doGuidance);
                  return (
                    <div key={dir.id} style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.94rem', color: '#0f172a' }}>{dName.text}</div>
                      {dDesc.text && <div style={{ fontSize: '0.84rem', color: '#475569', marginTop: '4px', lineHeight: 1.5 }}>{dDesc.text}</div>}
                      {dir.mood && dir.mood.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '8px' }}>
                          {dir.mood.map((m) => (
                            <span key={m} style={{ fontSize: '0.7rem', backgroundColor: '#e2e8f0', color: '#334155', padding: '2px 6px', borderRadius: '3px' }}>
                              {m}
                            </span>
                          ))}
                        </div>
                      )}
                      {doRes.text && (
                        <div style={{ fontSize: '0.78rem', color: '#16a34a', backgroundColor: '#f0fdf4', padding: '6px 8px', borderRadius: '4px', marginTop: '10px' }}>
                          ✓ {doRes.text}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Graphic Language Elements Display */}
          {brand.modules.visualBasics.graphicLanguage?.elements && brand.modules.visualBasics.graphicLanguage.elements.length > 0 && (
            <div style={{ marginBottom: '28px' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: '12px' }}>
                Graphic Motifs & Elements ({brand.modules.visualBasics.graphicLanguage.elements.length})
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
                {brand.modules.visualBasics.graphicLanguage.elements.map((el) => {
                  const elName = getText(el.name);
                  const elDesc = getText(el.description);
                  return (
                    <div key={el.id} style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-light)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#0f172a' }}>{elName.text}</div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', marginTop: '2px' }}>{el.category}</div>
                      {elDesc.text && <div style={{ fontSize: '0.8rem', color: '#475569', marginTop: '4px' }}>{elDesc.text}</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      )}

      {/* 7. Messaging Section */}
      {activeModuleIds.includes('messaging') && brand.modules.messaging && (
        <section className="doc-section" id="section-messaging">
          <div className="doc-section-header">
            <h2 className="doc-section-title">
              <span className="doc-section-num">0{sectionCounter++}</span> Messaging
            </h2>
            <button className="btn-jump-edit" onClick={() => onJumpToModule('messaging')}>
              <Edit2 size={13} /> Edit Section
            </button>
          </div>

          {(() => {
            const pitch = getText(brand.modules.messaging.elevatorPitch);
            return pitch.text ? (
              <div className="doc-info-block" style={{ marginBottom: '24px' }}>
                <div className="doc-info-label">Elevator Pitch</div>
                <div className="doc-info-val" style={{ fontWeight: 400, fontSize: '1.05rem', lineHeight: 1.6 }}>
                  {pitch.text}
                </div>
              </div>
            ) : null;
          })()}

          {brand.modules.messaging.keyMessages && brand.modules.messaging.keyMessages.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: '12px' }}>
                Key Message Pillars
              </h4>
              <ul style={{ paddingLeft: '20px', lineHeight: 1.8, color: '#1e293b' }}>
                {brand.modules.messaging.keyMessages.map((msg, idx) => {
                  const res = typeof msg === 'object' && 'headline' in msg ? getText((msg as any).headline) : getText(msg as any);
                  const narRes = typeof msg === 'object' && 'narrative' in msg ? getText((msg as any).narrative) : null;
                  return (
                    <li key={idx} style={{ fontWeight: 500 }}>
                      {res.text}
                      {narRes?.text && <div style={{ fontSize: '0.86rem', color: '#64748b', fontWeight: 400 }}>{narRes.text}</div>}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Calls to Action */}
          {brand.modules.messaging.callsToAction && brand.modules.messaging.callsToAction.length > 0 && (
            <div style={{ marginTop: '20px' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: '12px' }}>
                Calls to Action
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {brand.modules.messaging.callsToAction.map((cta) => {
                  const labelRes = getText(cta.label);
                  return (
                    <div key={cta.id} style={{ backgroundColor: 'var(--accent-light)', border: '1px solid var(--accent-primary)', padding: '8px 14px', borderRadius: 'var(--radius-sm)' }}>
                      <span style={{ fontWeight: 600, color: 'var(--accent-primary)', fontSize: '0.9rem' }}>{labelRes.text}</span>
                      {cta.contextChannel && <span style={{ fontSize: '0.74rem', color: '#64748b', marginLeft: '8px' }}>({cta.contextChannel})</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Brand Naming Section (Level 3.2) */}
      {activeModuleIds.includes('brandNaming') && brand.modules.brandNaming && (
        <PreviewNaming
          brand={brand}
          contentLanguage={contentLanguage}
          onJumpToModule={onJumpToModule}
          sectionNumber={sectionCounter++}
        />
      )}

      {/* 8. Visual Assets Section */}
      {activeModuleIds.includes('visualAssets') && brand.modules.visualAssets && brand.modules.visualAssets.length > 0 && (
        <section className="doc-section" id="section-visualAssets">
          <div className="doc-section-header">
            <h2 className="doc-section-title">
              <span className="doc-section-num">0{sectionCounter++}</span> Visual Asset Library
            </h2>
            <button className="btn-jump-edit" onClick={() => onJumpToModule('visualAssets')}>
              <Edit2 size={13} /> Edit Section
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
            {brand.modules.visualAssets.map((asset) => {
              const notesRes = getText(asset.notes);
              return (
                <div key={asset.id} style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-light)', padding: '16px', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.94rem', color: '#0f172a' }}>{asset.name}</div>
                    <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 600, backgroundColor: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: '4px' }}>
                      {asset.category}
                    </span>
                  </div>
                  {notesRes.text && <div style={{ fontSize: '0.84rem', color: '#64748b', marginTop: '6px' }}>{notesRes.text}</div>}
                  <div style={{ fontSize: '0.78rem', color: 'var(--accent-primary)', marginTop: '8px', fontWeight: 500 }}>
                    {asset.files.length} file{asset.files.length !== 1 ? 's' : ''} ({asset.files.map(f => f.format.toUpperCase()).join(', ')})
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 9. Visual Rules Section */}
      {activeModuleIds.includes('visualRules') && brand.modules.visualRules && brand.modules.visualRules.length > 0 && (
        <section className="doc-section" id="section-visualRules">
          <div className="doc-section-header">
            <h2 className="doc-section-title">
              <span className="doc-section-num">0{sectionCounter++}</span> Visual Rules & Governance
            </h2>
            <button className="btn-jump-edit" onClick={() => onJumpToModule('visualRules')}>
              <Edit2 size={13} /> Edit Section
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {brand.modules.visualRules.map((rule) => {
              const guideRes = getText(rule.guidance);
              const typeColor = rule.type === 'restriction' ? '#dc2626' : rule.type === 'requirement' ? '#d97706' : rule.type === 'preference' ? '#2563eb' : '#16a34a';
              return (
                <div key={rule.id} style={{ backgroundColor: '#ffffff', border: '1px solid var(--border-light)', padding: '14px 18px', borderRadius: 'var(--radius-sm)', borderLeft: `4px solid ${typeColor}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.94rem', color: '#0f172a' }}>{rule.name}</div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', fontWeight: 700, color: typeColor, backgroundColor: '#f8fafc', border: `1px solid ${typeColor}`, padding: '2px 8px', borderRadius: '4px' }}>
                        {rule.type}
                      </span>
                      <span style={{ fontSize: '0.68rem', textTransform: 'uppercase', fontWeight: 600, color: '#64748b', backgroundColor: '#f1f5f9', padding: '2px 8px', borderRadius: '4px' }}>
                        {rule.context}
                      </span>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.86rem', color: '#334155', marginTop: '6px', lineHeight: 1.5 }}>
                    {guideRes.text}
                  </div>
                  {rule.references && rule.references.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                      {rule.references.map((ref, rIdx) => (
                        <span key={rIdx} style={{ fontSize: '0.7rem', backgroundColor: '#f1f5f9', color: '#475569', padding: '2px 6px', borderRadius: '3px' }}>
                          ↳ {ref.label || ref.entityId}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 10. Brand Expression Section (Level 3.1) */}
      {activeModuleIds.includes('brandExpression') && brand.modules.brandExpression && (
        <PreviewExpression
          brand={brand}
          contentLanguage={contentLanguage}
          onJumpToModule={onJumpToModule}
          sectionNumber={sectionCounter++}
        />
      )}
    </div>
  );
};
