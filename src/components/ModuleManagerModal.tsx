import React from 'react';
import { ModuleId, Brand, Language } from '../types/brand';
import { ALL_MODULE_IDS, MODULE_REGISTRY, getModuleCompletion } from '../modules/registry';
import { t } from '../i18n/translations';
import { X, Check } from 'lucide-react';

interface ModuleManagerModalProps {
  isOpen: boolean;
  brand: Brand;
  uiLanguage: Language;
  onClose: () => void;
  onToggleModule: (moduleId: ModuleId) => void;
}

export const ModuleManagerModal: React.FC<ModuleManagerModalProps> = ({
  isOpen,
  brand,
  uiLanguage,
  onClose,
  onToggleModule
}) => {
  if (!isOpen) return null;

  const activeSet = new Set(brand.activeModules || []);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">{t('manageModules', uiLanguage)}</h2>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-subtle)', marginTop: '2px' }}>
              Choose which brand modules to include in {brand.name}'s assembled guideline preview.
            </p>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {ALL_MODULE_IDS.map((mId) => {
              const def = MODULE_REGISTRY[mId];
              const isActive = activeSet.has(mId) || (activeSet.has('visualBasics') && ['visualKnowledge', 'visualAssets', 'visualRules'].includes(mId));
              const completion = getModuleCompletion(brand, mId);

              return (
                <div
                  key={mId}
                  onClick={() => onToggleModule(mId)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: isActive ? '1px solid var(--accent-primary)' : '1px solid var(--border-light)',
                    backgroundColor: isActive ? 'var(--accent-light)' : 'var(--bg-card)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '6px',
                        border: isActive ? 'none' : '2px solid var(--border-medium)',
                        backgroundColor: isActive ? 'var(--accent-primary)' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff'
                      }}
                    >
                      {isActive && <Check size={16} strokeWidth={3} />}
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>
                          {t(def.nameKey, uiLanguage)}
                        </span>
                        <span className={`badge-status ${completion}`}>
                          {completion === 'complete' ? t('statusDone', uiLanguage) : completion === 'started' ? t('statusStarted', uiLanguage) : t('statusEmpty', uiLanguage)}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-subtle)', marginTop: '2px' }}>
                        {def.shortDescription}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-primary" onClick={onClose}>
            {t('done', uiLanguage)}
          </button>
        </div>
      </div>
    </div>
  );
};
