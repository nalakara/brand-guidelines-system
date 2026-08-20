import React, { useState } from 'react';
import { Brand, ModuleId, Language } from '../types/brand';
import { ALL_MODULE_IDS, MODULE_GROUPS, MODULE_REGISTRY, getModuleCompletion } from '../modules/registry';
import { t } from '../i18n/translations';
import {
  Building2,
  Compass,
  Target,
  Sparkles,
  MessageSquareText,
  Palette,
  Megaphone,
  BookOpen,
  Image,
  FileCheck,
  LayoutTemplate,
  Tag,
  Plus,
  SlidersHorizontal,
  ChevronDown,
  Layers,
  Trash2
} from 'lucide-react';
import { sampleBrand } from '../data/sampleBrand';

interface SidebarProps {
  brands: Brand[];
  activeBrand: Brand;
  activeModuleId: ModuleId;
  isOpenMobile: boolean;
  uiLanguage: Language;
  onSelectBrand: (id: string) => void;
  onCreateBrand: (name: string) => void;
  onDeleteBrand: (id: string) => void;
  onSelectModule: (id: ModuleId) => void;
  onOpenModuleManager: () => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Building2: <Building2 size={16} />,
  Compass: <Compass size={16} />,
  Target: <Target size={16} />,
  Sparkles: <Sparkles size={16} />,
  MessageSquareText: <MessageSquareText size={16} />,
  Palette: <Palette size={16} />,
  Megaphone: <Megaphone size={16} />,
  Tag: <Tag size={16} />,
  BookOpen: <BookOpen size={16} />,
  Image: <Image size={16} />,
  FileCheck: <FileCheck size={16} />,
  LayoutTemplate: <LayoutTemplate size={16} />
};

export const Sidebar: React.FC<SidebarProps> = ({
  brands,
  activeBrand,
  activeModuleId,
  isOpenMobile,
  uiLanguage,
  onSelectBrand,
  onCreateBrand,
  onDeleteBrand,
  onSelectModule,
  onOpenModuleManager
}) => {
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newBrandName, setNewBrandName] = useState('');

  const activeModules = activeBrand.activeModules || [];

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrandName.trim()) return;
    onCreateBrand(newBrandName.trim());
    setNewBrandName('');
    setShowCreateModal(false);
    setShowBrandDropdown(false);
  };

  return (
    <>
      <aside className={`app-sidebar ${isOpenMobile ? 'open' : ''}`}>
        {/* Logo Header */}
        <div className="sidebar-header">
          <div className="app-brand-logo">
            <Layers size={22} />
            <span>{t('appTitle', uiLanguage)}</span>
          </div>
        </div>

        {/* Brand Selector Dropdown */}
        <div className="brand-select-wrapper" style={{ position: 'relative', marginTop: '14px' }}>
          <div className="sidebar-section-title">{t('currentBrand', uiLanguage)}</div>
          <button
            className="brand-select-btn"
            onClick={() => setShowBrandDropdown(!showBrandDropdown)}
          >
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {activeBrand.name}
            </span>
            <ChevronDown size={16} />
          </button>

          {showBrandDropdown && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: '12px',
                right: '12px',
                backgroundColor: 'var(--bg-sidebar-hover)',
                border: '1px solid var(--border-sidebar)',
                borderRadius: 'var(--radius-md)',
                marginTop: '4px',
                zIndex: 30,
                boxShadow: 'var(--shadow-lg)',
                overflow: 'hidden'
              }}
            >
              <div style={{ maxHeight: '180px', overflowY: 'auto', padding: '4px' }}>
                {brands.map((b) => (
                  <div
                    key={b.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: b.id === activeBrand.id ? 'var(--bg-sidebar-active)' : 'transparent',
                      color: '#ffffff',
                      fontSize: '0.85rem',
                      fontWeight: b.id === activeBrand.id ? 600 : 400,
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      onSelectBrand(b.id);
                      setShowBrandDropdown(false);
                    }}
                  >
                    <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      {b.name}
                    </span>
                    {brands.length > 1 && b.id !== sampleBrand.id && (
                      <button
                        className="btn-icon"
                        style={{ padding: '2px', color: '#94a3b8' }}
                        title={t('delete', uiLanguage)}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Delete brand "${b.name}"?`)) {
                            onDeleteBrand(b.id);
                          }
                        }}
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div style={{ padding: '6px', borderTop: '1px solid var(--border-sidebar)' }}>
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem' }}
                  onClick={() => setShowCreateModal(true)}
                >
                  <Plus size={14} /> {t('newBrand', uiLanguage)}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modules Nav */}
        <div className="sidebar-section">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: '10px' }}>
            <span className="sidebar-section-title">{t('activeModules', uiLanguage)}</span>
            <button
              className="btn-icon"
              style={{ color: 'var(--text-inverse-muted)' }}
              title={t('manageModules', uiLanguage)}
              onClick={onOpenModuleManager}
            >
              <SlidersHorizontal size={14} />
            </button>
          </div>
        </div>

        <nav className="sidebar-nav">
          {MODULE_GROUPS.map((group) => {
            const filteredModuleIds = group.moduleIds.filter((mId) => {
              if (activeModules.includes(mId)) return true;
              if (activeModules.includes('visualBasics') && ['visualKnowledge', 'visualAssets', 'visualRules'].includes(mId)) return true;
              return false;
            });
            if (filteredModuleIds.length === 0) return null;

            return (
              <div key={group.domainKey} className="sidebar-domain-group">
                <div className="sidebar-domain-label">
                  {t(group.domainKey, uiLanguage)}
                </div>
                <div className="sidebar-domain-modules">
                  {filteredModuleIds.map((mId) => {
                    const def = MODULE_REGISTRY[mId];
                    const isSelected = activeModuleId === mId;
                    const completion = getModuleCompletion(activeBrand, mId);

                    return (
                      <button
                        key={mId}
                        className={`nav-module-item ${isSelected ? 'active' : ''}`}
                        onClick={() => onSelectModule(mId)}
                      >
                        <div className="nav-module-info">
                          {ICON_MAP[def.iconName]}
                          <span>{t(def.nameKey, uiLanguage)}</span>
                        </div>
                        <span className={`badge-status ${completion}`}>
                          {completion === 'complete' ? t('statusDone', uiLanguage) : completion === 'started' ? t('statusStarted', uiLanguage) : t('statusEmpty', uiLanguage)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          <div style={{ marginTop: '16px', padding: '0 4px' }}>
            <button
              className="btn btn-secondary btn-sm"
              style={{
                width: '100%',
                justifyContent: 'center',
                backgroundColor: 'rgba(255,255,255,0.06)',
                borderColor: 'rgba(255,255,255,0.12)',
                color: 'var(--text-inverse-muted)'
              }}
              onClick={onOpenModuleManager}
            >
              <SlidersHorizontal size={14} /> {t('manageModules', uiLanguage)} ({activeModules.length}/{ALL_MODULE_IDS.length})
            </button>
          </div>
        </nav>
      </aside>

      {/* New Brand Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
            <div className="modal-header">
              <h2 className="modal-title">{t('newBrand', uiLanguage)}</h2>
              <button className="btn-icon" onClick={() => setShowCreateModal(false)}>
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Brand Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Acme Corp"
                    value={newBrandName}
                    onChange={(e) => setNewBrandName(e.target.value)}
                    autoFocus
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                  {t('cancel', uiLanguage)}
                </button>
                <button type="submit" className="btn btn-accent" disabled={!newBrandName.trim()}>
                  {t('create', uiLanguage)}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
