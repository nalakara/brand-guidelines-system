import React, { useState } from 'react';
import {
  Brand,
  MessagingModule,
  Language,
  KeyMessageEntity,
  ProofPointEntity,
  CTAEntity,
  EntityReference,
  LocalizedString
} from '../../types/brand';
import { LocalizedInput, LocalizedTextarea } from '../ui/LocalizedInput';
import { ReferencePicker } from '../ui/ReferencePicker';
import { resolveEntityLabel } from '../../utils/entityResolver';
import { t } from '../../i18n/translations';
import { Plus, Trash2, Megaphone, CheckCircle2, MousePointerClick, Link, X } from 'lucide-react';

interface MessagingEditorProps {
  data?: MessagingModule;
  brand: Brand;
  uiLanguage: Language;
  contentLanguage: Language;
  onChange: (updated: MessagingModule) => void;
}

export const MessagingEditor: React.FC<MessagingEditorProps> = ({
  data,
  brand,
  uiLanguage,
  contentLanguage,
  onChange
}) => {
  const current: MessagingModule = data || {
    tagline: { en: '', id: '' },
    elevatorPitch: { en: '', id: '' },
    keyMessages: [],
    proofPoints: [],
    callsToAction: []
  };

  // State for Reference Picker on Key Messages
  const [pickerTarget, setPickerTarget] = useState<{
    kmId: string;
    type: 'audience' | 'proofPoint';
  } | null>(null);

  const updateField = (field: keyof MessagingModule, val: any) => {
    onChange({ ...current, [field]: val });
  };

  // --- Key Messages ---
  const addKeyMessage = () => {
    const newKM: KeyMessageEntity = {
      id: 'km-' + Date.now(),
      headline: { en: '', id: '' },
      narrative: { en: '', id: '' },
      proofPointRefs: []
    };
    updateField('keyMessages', [...current.keyMessages, newKM]);
  };

  const updateKeyMessage = (id: string, key: 'headline' | 'narrative', val: LocalizedString) => {
    const updated = current.keyMessages.map((km) => {
      if (km.id !== id) return km;
      return {
        ...km,
        [key]: val
      };
    });
    updateField('keyMessages', updated);
  };

  const setKMAudienceRef = (kmId: string, ref: EntityReference) => {
    const updated = current.keyMessages.map((km) => {
      if (km.id !== kmId) return km;
      return { ...km, targetAudienceRef: ref };
    });
    updateField('keyMessages', updated);
  };

  const addKMProofPointRef = (kmId: string, ref: EntityReference) => {
    const updated = current.keyMessages.map((km) => {
      if (km.id !== kmId) return km;
      const existing = km.proofPointRefs || [];
      if (existing.some((r) => r.entityId === ref.entityId)) return km;
      return { ...km, proofPointRefs: [...existing, ref] };
    });
    updateField('keyMessages', updated);
  };

  const removeKMProofPointRef = (kmId: string, entityId: string) => {
    const updated = current.keyMessages.map((km) => {
      if (km.id !== kmId) return km;
      return {
        ...km,
        proofPointRefs: (km.proofPointRefs || []).filter((r) => r.entityId !== entityId)
      };
    });
    updateField('keyMessages', updated);
  };

  const removeKeyMessage = (id: string) => {
    updateField('keyMessages', current.keyMessages.filter((km) => km.id !== id));
  };

  // --- Proof Points ---
  const addProofPoint = () => {
    const newPP: ProofPointEntity = {
      id: 'pp-' + Date.now(),
      claim: { en: '', id: '' },
      evidence: { en: '', id: '' },
      category: 'General'
    };
    updateField('proofPoints', [...current.proofPoints, newPP]);
  };

  const updateProofPoint = (id: string, key: 'claim' | 'evidence' | 'category', val: any) => {
    const updated = current.proofPoints.map((pp) => {
      if (pp.id !== id) return pp;
      return {
        ...pp,
        [key]: val
      };
    });
    updateField('proofPoints', updated);
  };

  const removeProofPoint = (id: string) => {
    updateField('proofPoints', current.proofPoints.filter((pp) => pp.id !== id));
  };

  // --- Calls to Action ---
  const addCTA = () => {
    const newCTA: CTAEntity = {
      id: 'cta-' + Date.now(),
      label: { en: '', id: '' },
      contextChannel: ''
    };
    updateField('callsToAction', [...current.callsToAction, newCTA]);
  };

  const updateCTA = (id: string, key: 'label' | 'contextChannel', val: any) => {
    const updated = current.callsToAction.map((cta) => {
      if (cta.id !== id) return cta;
      return {
        ...cta,
        [key]: val
      };
    });
    updateField('callsToAction', updated);
  };

  const removeCTA = (id: string) => {
    updateField('callsToAction', current.callsToAction.filter((cta) => cta.id !== id));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Overview & Tagline */}
      <div className="editor-card">
        <div className="editor-header">
          <div>
            <h2 className="editor-title">{t('messagingTitle', uiLanguage)}</h2>
            <p className="editor-subtitle">{t('messagingSubtitle', uiLanguage)}</p>
          </div>
        </div>

        <LocalizedInput
          label={t('taglineLabel', uiLanguage)}
          hint={t('taglineHint', uiLanguage)}
          placeholder={t('taglinePlaceholder', uiLanguage)}
          value={current.tagline}
          contentLanguage={contentLanguage}
          onChange={(val) => updateField('tagline', val)}
        />

        <LocalizedTextarea
          label={t('elevatorPitchLabel', uiLanguage)}
          hint={t('elevatorPitchHint', uiLanguage)}
          placeholder={t('elevatorPitchPlaceholder', uiLanguage)}
          rows={3}
          value={current.elevatorPitch}
          contentLanguage={contentLanguage}
          onChange={(val) => updateField('elevatorPitch', val)}
        />
      </div>

      {/* Key Messages Entities with Cross-References */}
      <div className="editor-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
              {t('keyMessagesTitle', uiLanguage)}
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              {t('keyMessagesSubtitle', uiLanguage)}
            </p>
          </div>
          <button type="button" className="btn btn-secondary btn-sm" onClick={addKeyMessage}>
            <Plus size={14} /> {t('addKeyMessage', uiLanguage)}
          </button>
        </div>

        {current.keyMessages.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', border: '1px dashed var(--border-light)', borderRadius: 'var(--radius-md)' }}>
            <Megaphone size={24} style={{ margin: '0 auto 8px', opacity: 0.6 }} />
            <p style={{ fontSize: '0.86rem' }}>{t('noKeyMessagesDefined', uiLanguage)}</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {current.keyMessages.map((km, idx) => (
              <div
                key={km.id}
                style={{
                  padding: '16px',
                  backgroundColor: 'var(--bg-muted)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-light)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="badge badge-secondary" style={{ fontSize: '0.74rem' }}>
                    Message Pillar #{idx + 1}
                  </span>
                  <button
                    type="button"
                    className="btn-icon"
                    style={{ color: '#ef4444' }}
                    onClick={() => removeKeyMessage(km.id)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <LocalizedInput
                  label="Headline / Core Pillar *"
                  placeholder="e.g. Grounding Rituals for Modern Life"
                  value={km.headline}
                  contentLanguage={contentLanguage}
                  onChange={(text) => updateKeyMessage(km.id, 'headline', text)}
                />

                <LocalizedTextarea
                  label="Supporting Narrative"
                  placeholder="Expanded paragraph or talking points explaining this pillar..."
                  rows={2}
                  value={km.narrative}
                  contentLanguage={contentLanguage}
                  onChange={(text) => updateKeyMessage(km.id, 'narrative', text)}
                />

                {/* Target Audience Reference Attachment */}
                <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                      Target Audience (Optional)
                    </span>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.74rem', padding: '2px 8px' }}
                      onClick={() => setPickerTarget({ kmId: km.id, type: 'audience' })}
                    >
                      <Plus size={12} /> {km.targetAudienceRef ? 'Change' : 'Link Audience'}
                    </button>
                  </div>

                  {km.targetAudienceRef && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className="badge badge-secondary" style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Link size={12} />
                        <span>Audience: {resolveEntityLabel(brand, km.targetAudienceRef, contentLanguage)}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = current.keyMessages.map((item) =>
                              item.id === km.id ? { ...item, targetAudienceRef: undefined } : item
                            );
                            updateField('keyMessages', updated);
                          }}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 2px' }}
                        >
                          <X size={12} />
                        </button>
                      </span>
                    </div>
                  )}
                </div>

                {/* Proof Point References */}
                <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                      Supporting Proof Points ({km.proofPointRefs?.length || 0})
                    </span>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.74rem', padding: '2px 8px' }}
                      onClick={() => setPickerTarget({ kmId: km.id, type: 'proofPoint' })}
                    >
                      <Plus size={12} /> Link Proof Point
                    </button>
                  </div>

                  {km.proofPointRefs && km.proofPointRefs.length > 0 && (
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {km.proofPointRefs.map((ref) => (
                        <span
                          key={ref.entityId}
                          className="badge badge-secondary"
                          style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          <Link size={12} />
                          <span>Proof: {resolveEntityLabel(brand, ref, contentLanguage)}</span>
                          <button
                            type="button"
                            onClick={() => removeKMProofPointRef(km.id, ref.entityId)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 2px' }}
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Proof Points Entities */}
      <div className="editor-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
              {t('proofPointsTitle', uiLanguage)}
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              {t('proofPointsSubtitle', uiLanguage)}
            </p>
          </div>
          <button type="button" className="btn btn-secondary btn-sm" onClick={addProofPoint}>
            <Plus size={14} /> {t('addProofPoint', uiLanguage)}
          </button>
        </div>

        {current.proofPoints.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', border: '1px dashed var(--border-light)', borderRadius: 'var(--radius-md)' }}>
            <CheckCircle2 size={24} style={{ margin: '0 auto 8px', opacity: 0.6 }} />
            <p style={{ fontSize: '0.86rem' }}>{t('noProofPointsDefined', uiLanguage)}</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {current.proofPoints.map((pp, idx) => (
              <div
                key={pp.id}
                style={{
                  padding: '16px',
                  backgroundColor: 'var(--bg-muted)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-light)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span className="badge badge-secondary" style={{ fontSize: '0.74rem' }}>
                      Proof Point #{idx + 1}
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      style={{ fontSize: '0.78rem', padding: '2px 8px', height: 'auto', width: '130px' }}
                      placeholder="Category..."
                      value={pp.category || ''}
                      onChange={(e) => updateProofPoint(pp.id, 'category', e.target.value)}
                    />
                  </div>
                  <button
                    type="button"
                    className="btn-icon"
                    style={{ color: '#ef4444' }}
                    onClick={() => removeProofPoint(pp.id)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <LocalizedInput
                  label="Claim / Fact *"
                  placeholder="e.g. 100% Direct-Trade Farm Origin Sourcing"
                  value={pp.claim}
                  contentLanguage={contentLanguage}
                  onChange={(text) => updateProofPoint(pp.id, 'claim', text)}
                />

                <LocalizedTextarea
                  label="Evidence & Documentation"
                  placeholder="Supporting statistics, certification bodies, or published reports..."
                  rows={2}
                  value={pp.evidence}
                  contentLanguage={contentLanguage}
                  onChange={(text) => updateProofPoint(pp.id, 'evidence', text)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Calls To Action */}
      <div className="editor-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
              {t('callsToActionTitle', uiLanguage)}
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              {t('callsToActionSubtitle', uiLanguage)}
            </p>
          </div>
          <button type="button" className="btn btn-secondary btn-sm" onClick={addCTA}>
            <Plus size={14} /> {t('addCTA', uiLanguage)}
          </button>
        </div>

        {current.callsToAction.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', border: '1px dashed var(--border-light)', borderRadius: 'var(--radius-md)' }}>
            <MousePointerClick size={24} style={{ margin: '0 auto 8px', opacity: 0.6 }} />
            <p style={{ fontSize: '0.86rem' }}>{t('noCTAsDefined', uiLanguage)}</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {current.callsToAction.map((cta, idx) => (
              <div
                key={cta.id}
                style={{
                  padding: '14px',
                  backgroundColor: 'var(--bg-muted)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-light)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <span className="badge badge-secondary" style={{ fontSize: '0.74rem' }}>
                  CTA #{idx + 1}
                </span>

                <div style={{ flex: 1 }}>
                  <LocalizedInput
                    label=""
                    placeholder="e.g. Find your morning pause / Order Whole Bean"
                    value={cta.label}
                    contentLanguage={contentLanguage}
                    onChange={(text) => updateCTA(cta.id, 'label', text)}
                  />
                </div>

                <div style={{ width: '160px' }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Channel / Context"
                    style={{ fontSize: '0.84rem' }}
                    value={cta.contextChannel || ''}
                    onChange={(e) => updateCTA(cta.id, 'contextChannel', e.target.value)}
                  />
                </div>

                <button
                  type="button"
                  className="btn-icon"
                  style={{ color: '#ef4444' }}
                  onClick={() => removeCTA(cta.id)}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reference Picker Modal for Key Messages */}
      {pickerTarget && (
        <ReferencePicker
          brand={brand}
          uiLanguage={uiLanguage}
          filterDomain={pickerTarget.type === 'audience' ? 'foundation' : 'foundation'}
          filterType={pickerTarget.type === 'audience' ? 'targetAudience' : 'proofPoint'}
          title={pickerTarget.type === 'audience' ? 'Link Target Audience' : 'Link Proof Point'}
          onSelect={(ref) => {
            if (pickerTarget.type === 'audience') {
              setKMAudienceRef(pickerTarget.kmId, ref);
            } else {
              addKMProofPointRef(pickerTarget.kmId, ref);
            }
            setPickerTarget(null);
          }}
          onClose={() => setPickerTarget(null)}
        />
      )}
    </div>
  );
};
