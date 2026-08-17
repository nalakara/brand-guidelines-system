import React from 'react';
import { Brand, Language } from '../types/brand';
import { t } from '../i18n/translations';
import { Menu, Eye, Edit3, SlidersHorizontal, Globe } from 'lucide-react';

interface HeaderProps {
  brand: Brand;
  viewMode: 'edit' | 'preview';
  isSaving: boolean;
  uiLanguage: Language;
  contentLanguage: Language;
  onToggleViewMode: (mode: 'edit' | 'preview') => void;
  onToggleMobileMenu: () => void;
  onOpenModuleManager: () => void;
  onChangeUiLanguage: (lang: Language) => void;
  onChangeContentLanguage: (lang: Language) => void;
}

export const Header: React.FC<HeaderProps> = ({
  brand,
  viewMode,
  isSaving,
  uiLanguage,
  contentLanguage,
  onToggleViewMode,
  onToggleMobileMenu,
  onOpenModuleManager,
  onChangeUiLanguage,
  onChangeContentLanguage
}) => {
  return (
    <header className="top-header">
      <div className="header-left">
        <button
          className="btn-icon mobile-menu-btn"
          onClick={onToggleMobileMenu}
          title="Toggle Navigation Menu"
        >
          <Menu size={20} />
        </button>

        <div className="header-brand-title">
          <span>{brand.name}</span>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', fontWeight: 400 }}>
            ({brand.activeModules?.length || 0} {t('activeModulesCount', uiLanguage)})
          </span>
        </div>
      </div>

      <div className="header-right">
        {/* Language Selectors */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--bg-muted)', padding: '3px 8px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
          <Globe size={14} color="var(--text-subtle)" />
          
          {/* UI Language Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', fontWeight: 600 }}>
            <span style={{ color: 'var(--text-subtle)' }}>UI:</span>
            <button
              type="button"
              style={{
                border: 'none',
                background: uiLanguage === 'en' ? 'var(--bg-card)' : 'transparent',
                color: uiLanguage === 'en' ? 'var(--accent-primary)' : 'var(--text-muted)',
                fontWeight: uiLanguage === 'en' ? 700 : 500,
                padding: '2px 6px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
              onClick={() => onChangeUiLanguage('en')}
            >
              EN
            </button>
            <button
              type="button"
              style={{
                border: 'none',
                background: uiLanguage === 'id' ? 'var(--bg-card)' : 'transparent',
                color: uiLanguage === 'id' ? 'var(--accent-primary)' : 'var(--text-muted)',
                fontWeight: uiLanguage === 'id' ? 700 : 500,
                padding: '2px 6px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
              onClick={() => onChangeUiLanguage('id')}
            >
              ID
            </button>
          </div>

          <span style={{ color: 'var(--border-medium)' }}>|</span>

          {/* Brand Content Language Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', fontWeight: 600 }}>
            <span style={{ color: 'var(--text-subtle)' }}>Content:</span>
            <button
              type="button"
              style={{
                border: 'none',
                background: contentLanguage === 'en' ? 'var(--accent-primary)' : 'transparent',
                color: contentLanguage === 'en' ? '#ffffff' : 'var(--text-muted)',
                fontWeight: contentLanguage === 'en' ? 700 : 500,
                padding: '2px 6px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
              onClick={() => onChangeContentLanguage('en')}
            >
              EN
            </button>
            <button
              type="button"
              style={{
                border: 'none',
                background: contentLanguage === 'id' ? 'var(--accent-primary)' : 'transparent',
                color: contentLanguage === 'id' ? '#ffffff' : 'var(--text-muted)',
                fontWeight: contentLanguage === 'id' ? 700 : 500,
                padding: '2px 6px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
              onClick={() => onChangeContentLanguage('id')}
            >
              ID
            </button>
          </div>
        </div>

        {/* Save Status */}
        <div className="save-status">
          <span className={`status-dot ${isSaving ? 'saving' : ''}`} />
          <span>{isSaving ? t('saving', uiLanguage) : t('savedLocalStorage', uiLanguage)}</span>
        </div>

        {/* Manage Modules Shortcut */}
        <button
          className="btn btn-secondary btn-sm"
          onClick={onOpenModuleManager}
          title={t('manageModules', uiLanguage)}
        >
          <SlidersHorizontal size={14} /> {t('manageModules', uiLanguage)}
        </button>

        {/* View Mode Toggle */}
        <div className="view-mode-toggle">
          <button
            className={`view-mode-btn ${viewMode === 'edit' ? 'active' : ''}`}
            onClick={() => onToggleViewMode('edit')}
          >
            <Edit3 size={14} /> {t('editForm', uiLanguage)}
          </button>
          <button
            className={`view-mode-btn ${viewMode === 'preview' ? 'active' : ''}`}
            onClick={() => onToggleViewMode('preview')}
          >
            <Eye size={14} /> {t('previewGuideline', uiLanguage)}
          </button>
        </div>
      </div>
    </header>
  );
};
