import React from 'react';
import { Brand, ModuleId, Language, getLocalizedText } from '../../types/brand';
import { Edit2, CheckCircle2, Image } from 'lucide-react';
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
                  const res = getText(item);
                  return <li key={idx}>{res.text}</li>;
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
                  const res = getText(diff);
                  return (
                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', backgroundColor: '#f8fafc', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                      <CheckCircle2 size={16} color="var(--accent-teal)" style={{ marginTop: '3px', flexShrink: 0 }} />
                      <span style={{ fontSize: '0.95rem', color: '#1e293b' }}>{res.text}</span>
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
                  const res = getText(tItem);
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
                  const res = getText(p);
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
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                {brand.modules.visualBasics.logoVariants.map((variant) => {
                  const nameRes = getText(variant.name);
                  const usageRes = getText(variant.usageNotes);
                  const doNotUseRes = getText(variant.doNotUseWhen);
                  const isDarkBg = variant.recommendedBg?.toLowerCase() === '#2d241e' || variant.recommendedBg?.toLowerCase() === '#0f172a';

                  return (
                    <div
                      key={variant.id}
                      style={{
                        border: '1px solid var(--border-light)',
                        borderRadius: 'var(--radius-md)',
                        overflow: 'hidden',
                        backgroundColor: '#ffffff'
                      }}
                    >
                      <div
                        style={{
                          height: '100px',
                          backgroundColor: variant.recommendedBg || '#f8fafc',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexDirection: 'column',
                          borderBottom: '1px solid var(--border-light)',
                          padding: '12px'
                        }}
                      >
                        <Image size={24} color={isDarkBg ? '#94a3b8' : '#64748b'} style={{ marginBottom: '4px' }} />
                        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: isDarkBg ? '#ffffff' : '#0f172a' }}>
                          {nameRes.text}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: isDarkBg ? '#94a3b8' : '#64748b' }}>
                          Recommended BG: {variant.recommendedBg || 'Default'}
                        </span>
                      </div>
                      <div style={{ padding: '14px' }}>
                        {usageRes.text && (
                          <p style={{ fontSize: '0.84rem', color: '#334155', lineHeight: 1.5, marginBottom: '8px' }}>
                            <strong>Usage:</strong> {usageRes.text}
                          </p>
                        )}
                        {doNotUseRes.text && (
                          <p style={{ fontSize: '0.78rem', color: '#991b1b', backgroundColor: '#fef2f2', padding: '6px 8px', borderRadius: '4px' }}>
                            ✕ <strong>Avoid:</strong> {doNotUseRes.text}
                          </p>
                        )}
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

          {(() => {
            const typo = getText(brand.modules.visualBasics.typographyNotes);
            return typo.text ? (
              <div className="doc-info-block" style={{ marginTop: '20px' }}>
                <div className="doc-info-label">Typography Direction</div>
                <div className="doc-info-val" style={{ fontWeight: 400 }}>{typo.text}</div>
              </div>
            ) : null;
          })()}
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
                  const res = getText(msg);
                  return <li key={idx} style={{ fontWeight: 500 }}>{res.text}</li>;
                })}
              </ul>
            </div>
          )}
        </section>
      )}
    </div>
  );
};
